import { createSlice, PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";
import UserState from "../../../types/serverTypes/userSliceType";
import { LoginResponse } from "../../../types/serverTypes/loginTypes";
import { loginUser, signInUser } from "../../../service/userService";
import { IUser } from "../../../types";
import axios from "../../../axiosConfig/axiosConfig";
import { addToCartM } from "../../../service/cartService";

const initialState: UserState = {
    user: null,
    status: "idle",
    error: null,
    token: null
};


export const fetchGetUserById = createAsyncThunk<
  IUser,
  { userId: string },
  { rejectValue: string }
>("users/fetchById", async ({ userId }, thunkAPI) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/users/getById/${userId}`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const fetchGetAllUsers = createAsyncThunk<
  IUser[],
  void,
  { rejectValue: string }
>("users/fetchById", async (_, thunkAPI) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/users`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
        },
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.status = "succeeded";
                state.user = action.payload.data.user;
                state.token = action.payload.data.token as string;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Login failed";
            })
            .addCase(signInUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(signInUser.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Register failed";
            })
            .addCase(addToCartM.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addToCartM.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(addToCartM.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Register failed";
            })
            
    }
});

export const { logout, resetError } = userSlice.actions;
export default userSlice.reducer;

