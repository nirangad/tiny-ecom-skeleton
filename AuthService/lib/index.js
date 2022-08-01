"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const rabbitmq_1 = __importDefault(require("./common/rabbitmq/rabbitmq"));
const logger_1 = __importDefault(require("./common/logger/logger"));
const is_authenticated_1 = __importDefault(require("@nirangad/is-authenticated"));
const User_model_1 = __importDefault(require("./models/User.model"));
// DotEnv Configuration
dotenv_1.default.config();
// Express Server
const port = process.env.SERVER_PORT || "8080";
const app = express_1.default();
app.use(express_1.default.json());
// Logger
app.use(logger_1.default());
// RabbitMQ connection
rabbitmq_1.default.connect((_a = process.env.RABBITMQ_AUTH_QUEUE) !== null && _a !== void 0 ? _a : "rabbitmq@auth");
// MongoDB Connection
const mongoDBURL = process.env.MONGODB_URL || "mongodb://localhost:27017";
mongoose_1.default.connect(mongoDBURL, () => {
    console.log(`Auth Service DB connected`);
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
app.listen(port, () => {
    console.log(`Auth Service listening on port ${port}`);
});
// Express Routes
app.get("/auth", (_req, res) => {
    return res.json({ status: 1, message: "Welcome to Auth Service" });
});
app.delete("/auth", is_authenticated_1.default, (req, res) => {
    const authUser = req.user;
    User_model_1.default.deleteOne({ email: authUser.email }, (err, data) => {
        if (err) {
            return res.json({
                status: 0,
                message: `Failed to delete user ${authUser.email}`,
            });
        }
        if (data.deletedCount == 0) {
            return res.json({
                status: 0,
                message: `User does not exists`,
            });
        }
        return res.json({
            status: 1,
            message: `User deleted: ${authUser.email}`,
        });
    });
});
app.get("/auth/users/all", is_authenticated_1.default, async (_req, res) => {
    const users = await User_model_1.default.find({});
    return res.json({ status: 1, message: users });
});
//curl -d '{ "email": "nirangad@gmail.com", "password": "abcd1234" }' -H "Content-Type: application/json" -X POST http://localhost:8080/auth/login
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.json({ status: 0, message: "Email and Password required" });
    }
    User_model_1.default.findOne({ email }, "+password", async (err, user) => {
        if (err) {
            return res
                .status(500)
                .json({ status: 0, message: "Something went wrong" });
        }
        const valid = await checkPassword(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (valid) {
            user.token = "";
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, timestamp: Date.now() }, process.env.SECRET_KEY ||
                JSON.stringify({ id: user.id, email: user.email }), { expiresIn: "10h" });
            if (!token) {
                return res.json({
                    status: 0,
                    message: "Authentication failed due to server error. Try again later",
                });
            }
            user.token = token;
            await user.save();
            user.password = undefined;
            return res.json({
                status: 1,
                message: { user },
            });
        }
        else {
            return res.json({ status: 0, message: "Incorrect Email or Password" });
        }
    });
});
app.post("/auth/register", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    let user = await User_model_1.default.findOne({ email });
    if (user) {
        return res.json({ status: 0, message: "User already exists" });
    }
    else {
        let user = new User_model_1.default({ email, password, firstName, lastName });
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