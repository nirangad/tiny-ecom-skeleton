"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
exports.default = () => {
    return express_winston_1.default.logger({
        transports: [
            new winston_1.default.transports.File({
                dirname: "logs",
                filename: "access.log",
                level: "info",
            }),
            new winston_1.default.transports.File({
                dirname: "logs",
                filename: "error.log",
                level: "error",
            }),
        ],
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
        meta: true,
        msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
        expressFormat: true,
        colorize: false,
    });
};
//# sourceMappingURL=logger.js.map