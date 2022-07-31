"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Address_model_1 = __importDefault(require("./Address.model"));
const { Schema } = mongoose_1.default;
const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    token: String,
    billingAddress: Address_model_1.default.schema,
    shippingAddress: Address_model_1.default.schema,
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true });
exports.default = mongoose_1.default.model("user", UserSchema);
//# sourceMappingURL=User.model%20copy.js.map