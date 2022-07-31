import mongoose from "mongoose";
import { AddressSchema, IAddress } from "./Address.model";
const { Schema } = mongoose;

export interface IUser {
  id?: string;
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
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    token: String,
    billingAddress: AddressSchema,
    shippingAddress: AddressSchema,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
