import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IAddress {
  _id?: string;
  house?: String;
  lane?: String;
  street?: String;
  city?: String;
  country?: String;
  zip?: String;
}

export const AddressSchema = new Schema<IAddress>(
  {
    house: String,
    lane: String,
    street: String,
    city: String,
    country: String,
    zip: String,
  },
  { timestamps: true }
);

export default mongoose.model<IAddress>("Address", AddressSchema);
