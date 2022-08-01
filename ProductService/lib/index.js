"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const rabbitmq_1 = __importDefault(require("./common/rabbitmq/rabbitmq"));
const is_authenticated_1 = __importDefault(require("@nirangad/is-authenticated"));
const Product_model_1 = __importDefault(require("./models/Product.model"));
// MongoDB Connection
const mongoDBURL = (_a = process.env.MONGODB_URL) !== null && _a !== void 0 ? _a : "mongodb://localhost:27017";
mongoose_1.default.connect(mongoDBURL, () => {
    console.log(`Product Service DB connected`);
});
// DotEnv Configuration
dotenv_1.default.config();
// Express Server
const port = (_b = process.env.SERVER_PORT) !== null && _b !== void 0 ? _b : 8081;
const app = express_1.default();
app.use(express_1.default.json());
// Logger
// app.use(logger());
// RabbitMQ connection
rabbitmq_1.default.connect((_c = process.env.RABBITMQ_PRODUCT_QUEUE) !== null && _c !== void 0 ? _c : "amqp://localhost:5672");
app.listen(port, async () => {
    console.log(`Product Service listening on port ${port}`);
});
// curl -X POST http://localhost:8081/product -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZTA5YzRiMWFhNTM2YTRlOWUyMmY4MiIsImVtYWlsIjoibmlyYW5nYWRAZ21haWwuY29tIiwidGltZXN0YW1wIjoxNjU5MDI0MTg0MzUyLCJpYXQiOjE2NTkwMjQxODR9.r0vHG5WP3wJEpoXH41vbwH63_y3z1RrvqJ7FVdu4AiY" | json_pp
// Express Routes
app.get("/product/all", is_authenticated_1.default, async (_req, res) => {
    const products = await Product_model_1.default.find({});
    console.log("Products: ", products);
    return res.json({ status: 1, message: products });
});
app.post("/product", is_authenticated_1.default, async (req, res) => {
    const productPayload = req.body.product;
    return res.json({ status: 1, message: "Welcome to Product create Service" });
});
//# sourceMappingURL=index.js.map