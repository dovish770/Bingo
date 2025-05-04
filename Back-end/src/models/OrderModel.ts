import mongoose, { Schema } from "mongoose";
import { IOrder, IProductInOrder } from "../types";
import { ERegion } from "../types/enums";

const ProductInOrderSchema: Schema<IProductInOrder> = new Schema({
  product: {
    type: String,
    ref: "Product",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const OrderSchema: Schema<IOrder> = new Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: ProductInOrderSchema,
      required: true,
    },
  ],
  region: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
