import { GetAllProducts } from "../services/ProductService";
import { IProduct } from "../types";
import { Request, Response } from "express";

export const getAllProductsHandler = async (req: Request, res: Response) => {
  try {
    const products: IProduct[] = await GetAllProducts();
    if (!products) {
      res.status(404).json({ message: "No products found", success: false });
      return;
    }
    res
      .status(200)
      .json({
        massage: "Products fetched successfully",
        data: products,
        success: true,
      });
  } catch (error: any) {
    res.status(400).json({ message: error.message, success: false });
  }
};
