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
const logger_1 = __importDefault(require("./common/logger/logger"));
const localize_1 = __importDefault(require("./common/locales/localize"));
const is_authenticated_1 = __importDefault(require("@nirangad/is-authenticated"));
const Order_service_1 = __importDefault(require("./services/Order.service"));
const fetchCurrentUser_1 = __importDefault(require("./common/mongo/fetchCurrentUser"));
// DotEnv Configuration
dotenv_1.default.config();
// Express Server
const port = (_a = process.env.ORDER_SERVER_PORT) !== null && _a !== void 0 ? _a : 8083;
const app = express_1.default();
app.use(express_1.default.json());
// Localization
app.use(localize_1.default);
// Logger
app.use(logger_1.default());
// RabbitMQ connection
let rabbitInstance;
rabbitmq_1.default
    .connect((_b = process.env.RABBITMQ_ORDER_QUEUE) !== null && _b !== void 0 ? _b : "rabbitmq@order")
    .then((data) => {
    rabbitInstance = data;
});
// MongoDB Connection
const mongoDBURL = (_c = process.env.ORDER_MONGODB_URL) !== null && _c !== void 0 ? _c : "mongodb://localhost:27017/order-service";
mongoose_1.default.connect(mongoDBURL, () => {
    console.log(`Order DB connected`);
});
app.listen(port, async () => {
    console.log(`Order Service listening on port ${port}`);
});
// Express Routes
app.get("/order", is_authenticated_1.default, (req, res) => {
    return res.json({ status: 1, message: req.t("ORDER.WELCOME") });
});
app.get("/order/all", is_authenticated_1.default, fetchCurrentUser_1.default, async (req, res) => {
    const currentUser = req.currentUser;
    const orders = await Order_service_1.default.allOrders(currentUser);
    return res.json({ status: 1, message: orders });
});
//# sourceMappingURL=index.js.map