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
const idValidation_1 = __importDefault(require("./common/mongo/idValidation"));
const localize_1 = __importDefault(require("./common/locales/localize"));
const is_authenticated_1 = __importDefault(require("@nirangad/is-authenticated"));
const Product_model_1 = __importDefault(require("./models/Product.model"));
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
const mongoDBURL = (_c = process.env.MONGODB_URL) !== null && _c !== void 0 ? _c : "mongodb://localhost:27017/product-service";
mongoose_1.default.connect(mongoDBURL, () => {
    console.log(`Product Service DB connected`);
});
app.listen(port, async () => {
    console.log(`Product Service listening on port ${port}`);
});
// Express Routes
app.get("/product", is_authenticated_1.default, (req, res) => {
    return res.json({ status: 1, message: req.t("PRODUCT.WELCOME") });
});
app.get("/product/all", is_authenticated_1.default, async (req, res) => {
    Product_model_1.default.find({}, (err, products) => {
        console.log("INFO (/product/all[GET]) Product.find({}): ", products);
        if (err) {
            console.log("ERROR (/product/all[GET]) Product.find({}): ", err);
            return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
        }
        return res.json({ status: 1, message: products });
    });
});
app.get("/product/:id", is_authenticated_1.default, idValidation_1.default, async (req, res) => {
    const product = await Product_model_1.default.findById(req.params.id);
    if (product) {
        return res.json({ status: 1, message: product });
    }
    return res.json({ status: 0, message: req.t("PRODUCT.ERROR.NO_PRODUCT") });
});
app.delete("/product/:id", is_authenticated_1.default, idValidation_1.default, async (req, res) => {
    Product_model_1.default.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            console.log("ERROR (/product/:id[DELETE]) Product.deleteOne({}): ", err);
            return res.json({
                status: 0,
                message: req.t("HTTP_500"),
            });
        }
        if (data.deletedCount == 0) {
            return res.json({
                status: 0,
                message: req.t("PRODUCT.ERROR.NO_PRODUCT"),
            });
        }
        return res.json({
            status: 1,
            message: `${req.t("PRODUCT.DELETED")}: ${req.params.id}`,
        });
    });
});
app.post("/product", is_authenticated_1.default, express_validator_1.body("*.*").escape(), async (req, res) => {
    const productPayload = req.body.product;
    Product_model_1.default.create(productPayload, (err, product) => {
        if (err) {
            if (err.code == 11000) {
                return res.status(400).json({
                    status: 0,
                    message: {
                        error: req.t("PRODUCT.ERROR.UNIQUE_FIELDS"),
                        fields: err.keyValue,
                    },
                });
            }
            console.log("ERROR (/product[POST]) Product.create: ", err);
            return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
        }
        return res.json({ status: 1, message: product });
    });
});
app.put("/product/:id", is_authenticated_1.default, idValidation_1.default, express_validator_1.body("*.*").escape(), async (req, res) => {
    const productPayload = req.body.product;
    Product_model_1.default.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            console.log("ERROR (/product/:id[PUT]) Product.findOne({}): ", err);
            return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
        }
        if (!product) {
            return res.status(404).json({
                status: 0,
                message: req.t("PRODUCT.ERROR.NO_PRODUCT"),
            });
        }
        Object.keys(productPayload).forEach(function (key) {
            if (productPayload[key] !== null || productPayload[key] !== undefined) {
                product[key] = productPayload[key];
            }
        });
        product.save((err, product) => {
            if (err) {
                if (err.code == 11000) {
                    return res.status(400).json({
                        status: 0,
                        message: {
                            error: req.t("PRODUCT.ERROR.UNIQUE_FIELDS"),
                            fields: err.keyValue,
                        },
                    });
                }
                console.log("ERROR (/product/:id[PUT]) product.save: ", err);
                return res
                    .status(500)
                    .json({ status: 0, message: req.t("HTTP_500") });
            }
            return res.json({ status: 1, message: product });
        });
    });
});
//# sourceMappingURL=index.js.map