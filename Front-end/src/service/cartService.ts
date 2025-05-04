import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddToCartRequest, AddToCartResponse } from "../types/serverTypes/cartTypes";
import { getToken } from "./tokenService";
import axios from "../axiosConfig/axiosConfig";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const addToCartM = createAsyncThunk<AddToCartResponse, AddToCartRequest, { rejectValue: string }>(
    "cart/add",
    async (addToCartRequest, { rejectWithValue }) => {
        try {
            const token = getToken();            
            if (!token) {
                throw new Error("Token not found");
            }
              
            const response:AddToCartResponse|any = await axios.post(`${BASE_URL}/api/products/addItemToCart`, addToCartRequest, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue((error as Error).message);
        }
    }
);