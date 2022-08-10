"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ShoppingCart_model_1 = __importDefault(require("../models/ShoppingCart.model"));
const read = async (user) => {
    return ShoppingCart_model_1.default.findOne({ user: user._id });
};
const create = async (data) => {
    let shoppingCart = await ShoppingCart_model_1.default.findOne({ user: data.user._id });
    const shoppingCartData = data;
    if (!shoppingCart) {
        shoppingCart = new ShoppingCart_model_1.default(shoppingCartData);
        shoppingCart.save();
    }
    else {
        shoppingCart = await update({
            id: shoppingCart._id,
            user: data.user,
            items: shoppingCartData.items,
        });
    }
    return shoppingCart;
};
const update = async (data) => {
    const shoppingCart = await ShoppingCart_model_1.default.findOne({
        user: data.user._id,
        _id: data.id,
    });
    if (!shoppingCart) {
        return null;
    }
    data.items.forEach((item) => {
        let cartItem = shoppingCart.items.find((i) => i.product == item.product);
        if (!cartItem) {
            if (item.qty > 0) {
                shoppingCart.items.push(item);
            }
        }
        else if (cartItem && item.qty <= 0) {
            shoppingCart.items = shoppingCart.items.filter((i) => i.product != item.product);
        }
        else {
            cartItem.qty = item.qty;
        }
    });
    await shoppingCart.save();
    return shoppingCart;
};
const remove = async (user) => {
    return ShoppingCart_model_1.default.deleteOne({
        user: user._id,
    });
};
const checkout = async (user, rabbitInstance) => {
    let shoppingCart = await ShoppingCart_model_1.default.findOne({ user: user._id });
    if (!shoppingCart) {
        return null;
    }
    return rabbitInstance.channel.sendToQueue(rabbitInstance.queue, Buffer.from(JSON.stringify({ shoppingCart, user })));
};
exports.default = { read, create, update, remove, checkout };
//# sourceMappingURL=ShoppingCart.service.js.map