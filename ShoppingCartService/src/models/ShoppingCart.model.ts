import mongoose, { Schema } from "mongoose";
import { IProduct } from "./Product.model";
import { IUser } from "./User.model";

export interface IShoppingCartItem {
  _id?: string;
  qty: number;
  product: IProduct;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShoppingCart {
  _id?: string;
  user: IUser;
  items: IShoppingCartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const ShoppingCartItemSchema = new Schema<IShoppingCartItem>(
  {
    qty: Number,
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

export const ShoppingCartSchema = new Schema<IShoppingCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    items: [
      {
        type: ShoppingCartItemSchema,
      },
    ],
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

export const ShoppingCartItem = mongoose.model<IShoppingCartItem>(
  "ShoppingCartItem",
  ShoppingCartItemSchema
);

export default mongoose.model<IShoppingCart>(
  "ShoppingCart",
  ShoppingCartSchema
);
