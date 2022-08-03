"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateId(req, res, next) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.json({ status: 0, message: "Unsupported ID" });
    }
    next();
    return;
}
exports.default = validateId;
//# sourceMappingURL=idValidation.js.map