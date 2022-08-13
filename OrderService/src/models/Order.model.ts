import mongoose, { Schema } from "mongoose";

import { IProduct } from "./Product.model";
import { IUser } from "./User.model";
import { IShoppingCart } from "./ShoppingCart.model";

export interface IOrderItem {
  _id?: string;
  qty: number;
  product: IProduct;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id?: string;
  user: IUser;
  shoppingCart: IShoppingCart;
  items: IOrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const OrderItemSchema = new Schema<IOrderItem>(
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

export const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    shoppingCart: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingCart",
    },
    items: [
      {
        type: OrderItemSchema,
      },
    ],
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, shoppingCart: 1 }, { unique: true });

export const OrderItem = mongoose.model<IOrderItem>(
  "OrderItem",
  OrderItemSchema
);

export default mongoose.model<IOrder>("Order", OrderSchema);
