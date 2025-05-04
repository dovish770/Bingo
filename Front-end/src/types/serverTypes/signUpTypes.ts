import { IUser } from "..";

export interface SignInData {
    message: string;
    data: IUser
    success: boolean
  }

  export interface SignInResponse {
    message: string;
    success: boolean
  }