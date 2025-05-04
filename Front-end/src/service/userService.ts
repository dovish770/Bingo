import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginResponse, LoginData } from "../types/serverTypes/loginTypes";
import { implementToken } from "./tokenService";
import { SignInData, SignInResponse } from "../types/serverTypes/signUpTypes";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = createAsyncThunk<LoginResponse, LoginData, { rejectValue: string }>(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        throw new Error(errorData.message || "Login failed");
      }
      const data: LoginResponse = await response.json();

      implementToken(data.data.token)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInUser = createAsyncThunk<SignInResponse, SignInData, { rejectValue: string }>(
  'user/signIn',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "signup failed");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
)

