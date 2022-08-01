"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
exports.productSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    purchasePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    imageUrl: String,
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true });
exports.default = mongoose_1.default.model('Product', exports.productSchema);
//# sourceMappingURL=Product.model.js.map