import axios from "../../../axiosConfig/axiosConfig";
import { IOrder } from "../../../types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface IOrderState {
  data: IOrder[];
  loading: boolean;
  error: string | null;
}

export const fetchAllOrders = createAsyncThunk<
  IOrder[],
  void,
  { rejectValue: string }
>("orders/fetchAllOrders", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/orders`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const updateOrderShippingStatus = createAsyncThunk<
  IOrder[],
  { orderId: string },
  { rejectValue: string }
>("orders/updateOrderShippingStatus", async ({ orderId }, thunkAPI) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/orders/updateShippingStatus`,
      { orderId },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const createNewOrder = createAsyncThunk<
  IOrder[],
  { userId: string; region: string },
  { rejectValue: string }
>("orders/createNewOrder", async ({ userId, region }, thunkAPI) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/orders`,
      { userId, region },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    data: [],
    loading: false,
    error: null,
  } as IOrderState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(updateOrderShippingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderShippingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateOrderShippingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      });
  },
});

export default ordersSlice.reducer;
