"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const rabbitmq_1 = __importDefault(require("./common/rabbitmq/rabbitmq"));
const logger_1 = __importDefault(require("./common/logger/logger"));
const localize_1 = __importDefault(require("./common/locales/localize"));
const is_authenticated_1 = __importDefault(require("@nirangad/is-authenticated"));
// DotEnv Configuration
dotenv_1.default.config();
// Express Server
const port = (_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : 8081;
const app = express_1.default();
app.use(express_1.default.json());
// Localization
app.use(localize_1.default);
// Logger
app.use(logger_1.default());
// RabbitMQ connection
rabbitmq_1.default.connect((_b = process.env.RABBITMQ_PRODUCT_QUEUE) !== null && _b !== void 0 ? _b : "rabbitmq@product");
// MongoDB Connection
const mongoDBURL = (_c = process.env.MONGODB_URL) !== null && _c !== void 0 ? _c : "mongodb://localhost:27017/shopping-cart-service";
mongoose_1.default.connect(mongoDBURL, () => {
    console.log(`Shopping Cart DB connected`);
});
app.listen(port, async () => {
    console.log(`Shopping Cart Service listening on port ${port}`);
});
// Express Routes
app.get("/shopping-cart", is_authenticated_1.default, (req, res) => {
    return res.json({ status: 1, message: req.t("SHOPPINGCART.WELCOME") });
});
app.post("/shopping-cart", is_authenticated_1.default, express_validator_1.body("*.*").escape(), async (req, res) => {
    const productPayload = req.body.product;
    return res.json({ status: 1, message: "Welcome to Product create Service" });
});
//# sourceMappingURL=index.js.map