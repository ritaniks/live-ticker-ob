import { configureStore } from "@reduxjs/toolkit";

import { listenerMiddleware } from "./middleware";
import orderbookSlice from "./silce/orderbookSlice";

export const store = configureStore({
  reducer: {
    orderbook: orderbookSlice,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    listenerMiddleware.middleware,
  ],
});
