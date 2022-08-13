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
