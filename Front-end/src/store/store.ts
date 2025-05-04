import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice/userSlice";
import productReducer from "./features/products/productSlice";
import orderReducer from "./features/orderSlice/orderSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
