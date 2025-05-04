import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "../types";

const ProductSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inventory: {
    type: Number,
    required: true,
    default: 0,
  },
  imageURL: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
