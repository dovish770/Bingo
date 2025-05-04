import { IProduct } from ".."

export interface ProductProps {
    product:IProduct
    updateLocalCart: (productId: string, quantity: number) => void;
}