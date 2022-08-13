import { IAddress } from "./Address.model";

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
