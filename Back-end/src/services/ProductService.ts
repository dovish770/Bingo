import Product from "../models/ProductModel";
import { IProduct } from "../types";

export const GetAllProducts = async (): Promise<IProduct[]> => {
  try {
    const products: IProduct[] = await Product.find({});
    if (products.length === 0) {
      throw new Error("No products found");
    }
    return products;
  } catch (err) {
    throw err;
  }
};

export const UpdateTheQuantityOfAProductInStock = async (
  productId: string,
  inventory: number
) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (inventory !== 0) {
      product.inventory += inventory * -1;
    }

    await product.save();
    return await GetAllProducts();
  } catch (error) {
    throw new Error("An error occurred while updating the product inventory.");
  }
};
