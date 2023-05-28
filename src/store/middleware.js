import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addBids, addAsks } from "../silce/orderbookSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(addBids),
  effect: (action, listenerApi) => {
    localStorage.setItem(
      "lastBids",
      JSON.stringify(listenerApi.getState().orderbook.bids)
    );
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(addAsks),
  effect: (action, listenerApi) =>
    localStorage.setItem(
      "lastAsks",
      JSON.stringify(listenerApi.getState().orderbook.asks)
    ),
});
