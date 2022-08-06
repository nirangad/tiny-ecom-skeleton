import mongoose, { mongo } from "mongoose";
const { Schema } = mongoose;

export interface IProduct {
  id?: string;
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

export const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: String,
    purchasePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    imageUrl: String,
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);