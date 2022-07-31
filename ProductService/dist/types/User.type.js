"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUser = void 0;
const mapUser = (userModel) => {
    const user = {
        id: userModel.id,
        firstName: userModel.firstName,
        lastName: userModel.lastName,
        password: undefined,
        email: userModel.email,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt,
        token: userModel.token,
        billingAddress: userModel.billingAddress,
        shippingAddress: userModel.shippingAddress,
    };
    return user;
};
exports.mapUser = mapUser;
//# sourceMappingURL=User.type.js.map