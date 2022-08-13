"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = exports.OrderSchema = exports.OrderItemSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.OrderItemSchema = new mongoose_1.Schema({
    qty: Number,
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
    },
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true });
exports.OrderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    shoppingCart: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ShoppingCart",
    },
    items: [
        {
            type: exports.OrderItemSchema,
        },
    ],
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true });
exports.OrderSchema.index({ user: 1, shoppingCart: 1 }, { unique: true });
exports.OrderItem = mongoose_1.default.model("OrderItem", exports.OrderItemSchema);
exports.default = mongoose_1.default.model("Order", exports.OrderSchema);
//# sourceMappingURL=Order.model.js.map