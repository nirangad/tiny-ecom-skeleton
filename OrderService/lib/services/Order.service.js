"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_model_1 = __importDefault(require("../models/Order.model"));
const create = async (shoppingCart, user) => {
    console.log("At Order service: ", shoppingCart);
    console.log("From user: ", user);
    let order = await Order_model_1.default.findOne({
        user: user._id,
        shoppingCart: shoppingCart._id,
    });
    if (order) {
        return null;
    }
    order = new Order_model_1.default({ shoppingCart, user });
    order.items = shoppingCart.items;
    await order.save();
    return order;
};
const allOrders = async (user) => {
    return Order_model_1.default.find({ user: user._id });
};
exports.default = { create, allOrders };
//# sourceMappingURL=Order.service.js.map