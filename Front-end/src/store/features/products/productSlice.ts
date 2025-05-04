import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../axiosConfig/axiosConfig";
import { IProduct } from "../../../types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface ProductState {
  data: IProduct[];
  loading: boolean;
  error: string | null;
}
export const fetchDataAllProducts = createAsyncThunk<
  IProduct[],
  void,
  { rejectValue: string }
>("allProducts/fetchData", async (_, thunkAPI) => {
  try {
    const response = await axios.get(BASE_URL + `/api/products`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const fetchUpdateInventory = createAsyncThunk<
  IProduct[],
  { productId: string; amount: number },
  { rejectValue: string }
>("updateInventory/fetchData", async ({ productId, amount }, thunkAPI) => {
  try {
    const response = await axios.post(
      BASE_URL +`/api/orders/updateInventory`,
      { productId, amount },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Failed to update inventory");
  }
});

const sliceName = createSlice({
  name: "allProducts",
  initialState: {
    data: [],
    loading: false,
    error: null,
  } as ProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDataAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(fetchUpdateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUpdateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      });
  },
});
export default sliceName.reducer;
