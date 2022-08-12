"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = __importDefault(require("../common/rabbitmq/rabbitmq"));
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
                console.log("[ORDER CONSUMER] Message acknwolegded: ", message);
                rabbitInstance.channel.ack(message);
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