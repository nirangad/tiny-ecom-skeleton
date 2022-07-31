"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProduct = void 0;
const mapProduct = (productModel) => {
    const product = {
        id: productModel.id,
        name: productModel.name,
        code: productModel.code,
        description: productModel.description,
        purchasePrice: productModel.purchasePrice,
        retailPrice: productModel.retailPrice,
        imageUrl: productModel.imageUrl,
        length: productModel.length,
        width: productModel.width,
        height: productModel.height,
        weight: productModel.weight,
        createdAt: productModel.createdAt,
        updatedAt: productModel.createdAt,
    };
    return product;
};
exports.mapProduct = mapProduct;
//# sourceMappingURL=Product.type.js.map