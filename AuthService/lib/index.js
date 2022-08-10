"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("./common/logger/logger"));
const idValidation_1 = __importDefault(require("./common/mongo/idValidation"));
const localize_1 = __importDefault(require("./common/locales/localize"));
const is_authenticated_1 = __importDefault(require("@nirangad/is-authenticated"));
const User_model_1 = __importDefault(require("./models/User.model"));
// DotEnv Configuration
dotenv_1.default.config();
// Express Server
const port = process.env.AUTH_SERVER_PORT || "8080";
const app = express_1.default();
app.use(express_1.default.json());
// Localization
app.use(localize_1.default);
// Logger
app.use(logger_1.default());
// MongoDB Connection
const mongoDBURL = process.env.AUTH_MONGODB_URL || "mongodb://localhost:27017/auth-service";
mongoose_1.default.connect(mongoDBURL, () => {
    console.log(`Auth Service DB connected`);
});
app.listen(port, () => {
    console.log(`Auth Service listening on port ${port}`);
});
// Hashing
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(6);
    return await bcrypt_1.default.hash(password, salt);
};
const checkPassword = async (password, hashed) => {
    const valid = await bcrypt_1.default.compare(password, hashed);
    return valid;
};
// Express Routes
app.get("/auth", (req, res) => {
    return res.json({ status: 1, message: req.t("AUTH.WELCOME") });
});
app.delete("/auth", is_authenticated_1.default, (req, res) => {
    const authUser = req.user;
    User_model_1.default.deleteOne({ email: authUser.email }, (err, data) => {
        if (err) {
            return res.status(500).json({
                status: 0,
                message: req.t("HTTP_500"),
            });
        }
        if (data.deletedCount == 0) {
            return res.status(404).json({
                status: 0,
                message: req.t("AUTH.ERROR.NO_USER"),
            });
        }
        return res.json({
            status: 1,
            message: `${req.t("AUTH.USER_DELETED")}: ${authUser.email}`,
        });
    });
});
app.get("/auth/users/all", is_authenticated_1.default, async (_req, res) => {
    const users = await User_model_1.default.find({});
    return res.json({ status: 1, message: users });
});
app.get("/auth/users/current", is_authenticated_1.default, async (req, res) => {
    const user = await User_model_1.default.findOne({ email: req.user.email });
    if (!user) {
        return res
            .status(404)
            .json({ status: 0, message: req.t("AUTH.ERROR.NO_USER") });
    }
    return res.json({ status: 1, message: user });
});
app.get("/auth/users/:id", is_authenticated_1.default, idValidation_1.default, async (req, res) => {
    const user = await User_model_1.default.findById(req.params.id);
    if (!user) {
        return res
            .status(404)
            .json({ status: 0, message: req.t("AUTH.ERROR.NO_USER") });
    }
    return res.json({ status: 1, message: user });
});
app.post("/auth/login", express_validator_1.body("email").isEmail(), async (req, res) => {
    const result = express_validator_1.validationResult(req);
    if (!result.isEmpty()) {
        return res
            .status(400)
            .json({ status: 0, message: req.t("ERROR.VALIDATION") });
    }
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({
            status: 0,
            message: req.t("AUTH.ERROR.REQUIRED.EMAIL_PASSWORD"),
        });
    }
    User_model_1.default.findOne({ email }, "+password", async (err, user) => {
        if (err) {
            return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
        }
        const valid = await checkPassword(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (valid) {
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, timestamp: Date.now() }, process.env.SECRET_KEY ||
                JSON.stringify({ id: user.id, email: user.email }), { expiresIn: "10h" });
            if (!token) {
                return res.status(500).json({
                    status: 0,
                    message: req.t("HTTP_500"),
                });
            }
            user.password = undefined;
            return res.json({
                status: 1,
                message: { user, token },
            });
        }
        else {
            return res.status(400).json({
                status: 0,
                message: req.t("AUTH.ERROR.INCORRECT_CREDENTIALS"),
            });
        }
    });
});
app.post("/auth/register", express_validator_1.body("email").isEmail().normalizeEmail(), express_validator_1.body("password").not().isEmpty(), express_validator_1.body("firstName").not().isEmpty().trim().escape(), express_validator_1.body("lastName").not().isEmpty().trim().escape(), async (req, res) => {
    const result = express_validator_1.validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 0,
            message: `${req.t("AUTH.ERROR.REQUIRED.MANDATORY_FIELDS")} - email, password, firstName & lastName`,
        });
    }
    const { email, password } = req.body;
    let user = await User_model_1.default.findOne({ email });
    if (user) {
        return res
            .status(400)
            .json({ status: 0, message: req.t("AUTH.ERROR.USER_EXISTS") });
    }
    else {
        let user = new User_model_1.default(Object.assign({}, req.body));
        user.password = await hashPassword(password);
        await user.save();
        user.password = undefined;
        return res.json({
            status: 1,
            message: { user },
        });
    }
});
//# sourceMappingURL=index.js.map