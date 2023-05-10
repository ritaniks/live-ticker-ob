import { configureStore } from "@reduxjs/toolkit";
import orderbookSlice from "./silce/orderbookSlice";

export const store = configureStore({
  reducer: {
    orderbook: orderbookSlice,
  },
});
