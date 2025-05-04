import mongoose, { Schema, Document } from "mongoose";
import { IProductInOrder, IUser } from "../types";

const ProductInOrderSchema: Schema<IProductInOrder> = new Schema({
  product: {
    type: String, 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: [
    {
      type: ProductInOrderSchema,  
      required: true,
    },
  ],
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
