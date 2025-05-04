import { IUser } from "..";

export interface LoginResponse {
    data: {
      user: IUser,
      token: string
    }
    message: string,
    success: boolean
  }

export interface LoginData {
  username: string;
  password: string;
}

