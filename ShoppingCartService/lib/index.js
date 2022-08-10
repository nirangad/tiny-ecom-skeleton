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
const fetchCurrentUser_1 = __importDefault(require("./common/mongo/fetchCurrentUser"));
const localize_1 = __importDefault(require("./common/locales/localize"));
const is_authenticated_1 = __importDefault(require("@nirangad/is-authenticated"));
const ShoppingCart_service_1 = __importDefault(require("./services/ShoppingCart.service"));
// DotEnv Configuration
dotenv_1.default.config();
// Express Server
const port = (_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : 8082;
const app = express_1.default();
app.use(express_1.default.json());
// Localization
app.use(localize_1.default);
// Logger
app.use(logger_1.default());
const startServer = async () => { };
startServer();
// RabbitMQ connection
let rabbitInstance;
rabbitmq_1.default
    .connect((_b = process.env.RABBITMQ_PRODUCT_QUEUE) !== null && _b !== void 0 ? _b : "rabbitmq@product")
    .then((data) => {
    rabbitInstance = data;
});
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
    return res.json({ status: 1, message: req.t("SHOPPING_CART.WELCOME") });
});
app.get("/shopping-cart/active", is_authenticated_1.default, fetchCurrentUser_1.default, async (req, res) => {
    const currentUser = req.currentUser;
    const shoppingCart = await ShoppingCart_service_1.default.read(currentUser);
    if (!shoppingCart) {
        return res
            .status(404)
            .json({ status: 0, message: req.t("SHOPPING_CART.ERROR.NO_CART") });
    }
    return res.json({ status: 1, message: { shoppingCart } });
});
app.post("/shopping-cart", is_authenticated_1.default, fetchCurrentUser_1.default, async (req, res) => {
    const currentUser = req.currentUser;
    let shoppingCart;
    let shoppingCartData = {
        user: currentUser,
        items: req.body.shoppingCart,
    };
    shoppingCart = await ShoppingCart_service_1.default.create(shoppingCartData);
    if (!shoppingCart) {
        return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
    }
    return res.json({
        status: 1,
        message: shoppingCart,
    });
});
app.put("/shopping-cart", is_authenticated_1.default, fetchCurrentUser_1.default, async (req, res) => {
    const currentUser = req.currentUser;
    const shoppingCartData = {
        id: req.body.shoppingCart.id,
        user: currentUser,
        items: req.body.shoppingCart.items,
    };
    const shoppingCart = await ShoppingCart_service_1.default.update(shoppingCartData);
    if (!shoppingCart) {
        return res
            .status(404)
            .json({ status: 0, message: req.t("SHOPPING_CART.ERROR.NO_CART") });
    }
    return res.json({
        status: 1,
        message: shoppingCart,
    });
});
app.delete("/shopping-cart", is_authenticated_1.default, fetchCurrentUser_1.default, async (req, res) => {
    const currentUser = req.currentUser;
    const data = await ShoppingCart_service_1.default.remove(currentUser);
    if (data.deletedCount == 0) {
        return res.status(404).json({
            status: 0,
            message: req.t("SHOPPING_CART.ERROR.NO_CART"),
        });
    }
    return res.json({
        status: 1,
        message: req.t("SHOPPING_CART.CART_DELETED"),
    });
});
app.post("/shopping-cart/checkout", is_authenticated_1.default, fetchCurrentUser_1.default, async (req, res) => {
    const currentUser = req.currentUser;
    const data = await ShoppingCart_service_1.default.checkout(currentUser, rabbitInstance);
    if (!data) {
        return res.status(404).json({
            status: 0,
            message: req.t("SHOPPING_CART.ERROR.NO_CART"),
        });
    }
});
//# sourceMappingURL=index.js.map