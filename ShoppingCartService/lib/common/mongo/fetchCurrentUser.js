"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function fetchCurrentUser(req, res, next) {
    const getUserUrl = `${process.env.AUTH_SERVER}/auth/users/current`;
    console.log(`Get URL(fetchUser): ${process.env.AUTH_SERVER}/auth/users/current`);
    if (!req.user || !req.user.email) {
        return res.status(401).json({ status: 0, message: "Unauthorized" });
    }
    const response = await axios_1.default.get(getUserUrl, {
        headers: {
            authorization: req.headers["authorization"],
            "accept-language": req.headers["accept-language"],
        },
    });
    req.currentUser = response.data.message;
    next();
    return;
}
exports.default = fetchCurrentUser;
//# sourceMappingURL=fetchCurrentUser.js.map