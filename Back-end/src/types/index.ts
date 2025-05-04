import mongoose, { Document, Schema } from "mongoose";
import { ERegion } from "./enums";

export interface IProductInOrder extends Document {
  product: string;
  amount: number;
}

export interface ProductInOrder {
  product: string;
  amount: number;
}
export interface IOrder extends Document {
  userId: string;
  products: IProductInOrder[];
  region: string;
  totalAmount: number;
  orderDate?: Date;
  isDelivered: boolean;
}
export interface inputOrder {
    userId: string;
    products: IProductInOrder[];
    region: string;
    totalAmount: number;
    orderDate?: Date;
    isDelivered: boolean;
  }

export interface IProduct extends Document {
  name: string;
  price: number;
  inventory: number;
  imageURL: string;
  description: string;
  category: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: IProductInOrder[];
}
