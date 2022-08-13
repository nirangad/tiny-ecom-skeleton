"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = __importDefault(require("../common/rabbitmq/rabbitmq"));
const Order_service_1 = __importDefault(require("./Order.service"));
require("dotenv").config();
const orderQueue = process.env.RABBITMQ_ORDER_QUEUE || "rabbitmq@order";
async function start() {
    try {
        let rabbitInstance;
        rabbitmq_1.default
            .connect(orderQueue)
            .then((data) => {
            rabbitInstance = data;
            rabbitInstance.channel.consume(orderQueue, (message) => {
                if (message) {
                    rabbitInstance.channel.ack(message);
                    const { shoppingCart, user } = JSON.parse(message.content.toString());
                    console.log("[ORDER CONSUMER] Message read: ", "Shopping Cart: ", shoppingCart._id, ", User: ", user._id);
                    Order_service_1.default.create(shoppingCart, user);
                }
            });
        })
            .catch((err) => {
            console.error("[ORDER CONSUMER] Error at Promise: ", err);
            process.exit(1);
        });
    }
    catch (err) {
        console.error("[ORDER CONSUMER] Error at catch block ", err);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=OrderConsumer.js.map