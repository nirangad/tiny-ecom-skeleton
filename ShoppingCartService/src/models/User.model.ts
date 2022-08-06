import mongoose, { Schema } from "mongoose";
import { AddressSchema, IAddress } from "./Address.model";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
}

export const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    token: { type: String, select: false },
    billingAddress: AddressSchema,
    shippingAddress: AddressSchema,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
