"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const rabbitMQ = {
    connect: async (queue, url) => {
        var _a;
        const rabbitConnectionURL = url
            ? url
            : (_a = process.env.RABBITMQ_URL) !== null && _a !== void 0 ? _a : "amqp://localhost:5672";
        const rabbitConnection = await amqplib_1.default.connect(rabbitConnectionURL);
        const rabbitChannel = await rabbitConnection.createChannel();
        await rabbitChannel.assertQueue(queue);
        return { connection: rabbitConnection, channel: rabbitChannel, queue };
    },
};
exports.default = rabbitMQ;
//# sourceMappingURL=rabbitmq.js.map