import e, { Request, Response } from "express";
import { AddProductToCart, CreateObjectUser, gitUserById, login } from "../services/userService";

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await CreateObjectUser(username, email, password);
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      data: newUser,
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const loginUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const data = await login(username, password);
    const { token, user } = data;
    console.log("token", token);
    res.cookie('token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, 
        sameSite: 'none',
      });
      

    res.status(200).json({
      message: "Login successful",
      data: { user, token },
      success: true,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(400).json({
      message: error.message || "Something went wrong during login",
      success: false,
    });
  }
};

export const addProductToCartController = async (req: Request, res: Response) => {
  try {
    const { amount, productId,userId } = req.body;
console.log(amount)
    const data = await AddProductToCart(userId, productId, amount);
    res.status(200).json({
      message: "Product added to cart successfully",
      data: data,
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message, success: false });
  }
}

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await gitUserById(userId);
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message, success: false });
  }
};
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await gitAllUsers();
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message, success: false });
  }
}
function gitAllUsers() {
    throw new Error("Function not implemented.");
}

