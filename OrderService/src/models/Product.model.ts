export interface IProduct {
  _id?: string;
  name: string;
  code: string;
  description?: string;
  purchasePrice: number;
  retailPrice: number;
  imageUrl?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
