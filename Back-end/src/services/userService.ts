import User from "../models/UserModel";
import { IfUserExists } from "../utils/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IProductInOrder, IUser, ProductInOrder } from "../types";
import mongoose from "mongoose";
import Product from "../models/ProductModel";
import { UpdateTheQuantityOfAProductInStock } from "./ProductService";

dotenv.config();

const Jwt_Secret = process.env.JWT_SECRET;

export async function CreateObjectUser(
  username: string,
  email: string,
  password: string
) {
  try {
    if (!username || !password || !email) {
      throw new Error("Username or password or email are required");
    }
    const userExists = await IfUserExists(username);
    if (userExists.userExists) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
    });
    return newUser;
  } catch (err) {
    throw err;
  }
}

export const login = async (username: string, password: string) => {
  try {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
    const userFind = await IfUserExists(username);
    if (!userFind.userExists) {
      throw new Error("One of the details is wrong");
    }
    const isPasswordValid = await bcrypt.compare(

      password,
      userFind.user!.password
    );
    if (!isPasswordValid) {
      throw new Error("One of the details is wrong");
    }
    const token = jwt.sign(
      { userId: userFind.user!._id },
      Jwt_Secret as string,
      { expiresIn: "1h" }
    );

    return { token: token, user: userFind.user };
  } catch (err) {
    throw err;
  }
};

export const AddProductToCart = async (
  userId: string,
  productId: string,
  amount: number
) => {
  try {
    if (!userId || !productId || !amount) {
      throw new Error("User ID, product ID, and quantity are required");
    }
    if (amount === 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.amount += amount;
    } else {
      if (amount < 0) {
        throw new Error("Quantity must be greater than 0");
      }
      const newProductInOrder: ProductInOrder = {
        product: productId,
        amount: amount,
      };

      user.cart.push(newProductInOrder as IProductInOrder);
    }

    await user.save();
   await UpdateTheQuantityOfAProductInStock(productId, amount);
    return user;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while adding the product to the cart"
    );
  }
};

export const gitUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred while getting the user");
  }
};

export const getAllOrders = async () => {
  try {
    const orders = await User.find({});
    if (orders.length === 0) {
      throw new Error("No orders found");
    }
    return orders;
  } catch (err) {
    throw err;
  }
};
