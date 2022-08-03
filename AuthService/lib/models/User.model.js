"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Address_model_1 = require("./Address.model");
const { Schema } = mongoose_1.default;
exports.UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    token: { type: String, select: false },
    billingAddress: Address_model_1.AddressSchema,
    shippingAddress: Address_model_1.AddressSchema,
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", exports.UserSchema);
//# sourceMappingURL=User.model.js.map