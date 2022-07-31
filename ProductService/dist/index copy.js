"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const amqplib_1 = __importDefault(require("amqplib"));
const mongoose_1 = __importDefault(require("mongoose"));
// MongoDB Connection
const mongoDBURL = process.env.MONGODB_URL || "mongodb://localhost:27017";
mongoose_1.default.connect(mongoDBURL, () => {
    console.log(`Product Service DB connected`);
});
// DotEnv Configuration
dotenv_1.default.config();
// RabbitMQ connection
const rabbitConnectionURL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const rabbitAuthQueue = process.env.RABBITMQ_PRODUCT_QUEUE || "rabbitmq@product";
const connectRabbitMQ = async () => {
    const rabbitConnection = await amqplib_1.default.connect(rabbitConnectionURL);
    const rabbitChannel = await rabbitConnection.createChannel();
    rabbitChannel.assertQueue(rabbitAuthQueue);
};
connectRabbitMQ();
// Express Server
const port = process.env.SERVER_PORT || "8081";
const app = express_1.default();
app.use(express_1.default.json());
app.listen(port, () => {
    console.log(`Product Service listening on port ${port}`);
});
// Express Routes
app.get("/product", (_req, res) => {
    return res.json({ status: 1, message: "Welcome to Product Service" });
});
app.get("/product", (_req, res) => {
    return res.json({ status: 1, message: "Welcome to Product Service" });
});
//# sourceMappingURL=index%20copy.js.map