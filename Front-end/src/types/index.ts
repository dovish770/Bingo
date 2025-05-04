import { ERegion } from "./enums";

export interface IProductInOrder {
  product: string;
  amount: number;
}

export interface IOrder {
  _id: string;
  userId: string;
  products: IProductInOrder[];
  region: ERegion;
  totalAmount: number;
  orderDate?: Date;
  isDelivered: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  inventory: number;
  imageURL: string;
  description: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: IProductInOrder[];
}
