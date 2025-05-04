import Order from "../models/OrderModel";
import Product from "../models/ProductModel";
import User from "../models/UserModel";
import { IOrder, inputOrder } from "../types";
import { ERegion } from "../types/enums";

export const addOrder = async (
  userId: string,
  region: string
): Promise<IOrder[]> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const totalAmount = await Promise.all(
        user.cart.map(async (item) => {
            const product = await Product.findById(item.product);
            return product!.price * item.amount;
        })
    );
    
    const totalPrice = totalAmount.reduce((sum, price) => sum + price, 0);
    if (totalPrice === 0) {
        console.log(user);
        throw new Error("Cart is empty");
    }
    const newOrder: inputOrder = {
        userId: userId,
        products: user.cart,
        region,
        totalAmount: totalPrice,
        orderDate: new Date(),
        isDelivered: false,
    };
    user.cart = [];
    const order = await Order.create(newOrder);
    await order.save();
    if (!order) {
      throw new Error("Order not created");
    }
    await user.save();
    const orders = await Order.find({});
    return orders;
  } catch (err) {
    throw err;
  }
};
export const getAllOrders = async () => {
  try {
    const orders = await Order.find({});
    if (orders.length === 0) {
      throw new Error("No orders found");
    }
    return orders;
  } catch (err) {
    throw err;
  }
};

export const getOrderByUserId = async (userName: string) => {
  try {
    const user = await User.findOne({ username: userName });
    if (!user) {
      throw new Error("User not found");
    }
    const order = await Order.find({ userId: user!._id });
    if (!order) {
      throw new Error("Orders for user not found");
    }
    return order;
  } catch (err) {
    throw err;
  }
};

export const updateShippingStatusInOrder = async (orderId: string) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.isDelivered = order.isDelivered === false ? true : false;
    await order.save();
    const orders = await Order.find({});
    return orders;
  } catch (err) {
    throw err;
  }
};

export const InventoryUpdateForManager = async (
  productId: string,
  amount: number
) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (amount === 0) {
      throw new Error("Quantity must be greater than 0");
    }
    if (product.inventory + amount < 0) {
        throw new Error("Quantity must be greater than 0");
    }
    product.inventory += amount;
    await product.save();
    const products = await Product.find({});
    return products;
  } catch (err) {
    throw err;
  }
};
