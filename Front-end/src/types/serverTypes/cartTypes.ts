import { IUser } from ".."

export interface AddToCartRequest {
    amount: number
    productId:string
    userId:string
}

export interface AddToCartResponse {
    data: {
      user: IUser,
    }
    message: string,
    success: boolean
  }