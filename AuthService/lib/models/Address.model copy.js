"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
exports.AddressSchema = new Schema({
    house: String,
    lane: String,
    street: String,
    city: String,
    country: String,
    zip: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model("Address", exports.AddressSchema);
//# sourceMappingURL=Address.model%20copy.js.map