"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
// Hashing
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(6);
    return await bcrypt_1.default.hash(password, salt);
};
const checkPassword = async (password, hashed) => {
    const valid = await bcrypt_1.default.compare(password, hashed);
    return valid;
};
const getUser = async (params, withPassword = false) => {
    if (withPassword) {
        return User_model_1.default.findOne(params, "+password");
    }
    return User_model_1.default.findOne(params);
};
const getAllUsers = async () => {
    return User_model_1.default.find({});
};
const validateLogin = (given, checkWith) => {
    const valid = checkPassword(given, checkWith);
    return valid;
};
const generateToken = async (value, secret, expiresIn = "10h") => {
    const token = jsonwebtoken_1.default.sign(value, secret, { expiresIn });
    if (!token) {
        return null;
    }
    return token;
};
const deleteUser = async (email, callback) => {
    return User_model_1.default.deleteOne({ email }, callback);
};
exports.default = {
    getUser,
    getAllUsers,
    validateLogin,
    generateToken,
    hashPassword,
    deleteUser,
};
//# sourceMappingURL=AuthService.service.js.map