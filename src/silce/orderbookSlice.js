import { createSlice, current } from "@reduxjs/toolkit";
import { PRICE_LEVELS } from "../config/constant";

// Persisting data in localStorage, even if we refresh the page,
// the trades of old data is retained

const bidsState =
  localStorage.getItem("lastBids") !== undefined
    ? JSON.parse(localStorage.getItem("lastBids"))
    : null;

const asksState =
  localStorage.getItem("lastAsks") !== undefined
    ? JSON.parse(localStorage.getItem("lastAsks"))
    : null;

const initialState = {
  rawBids: [],
  bids: bidsState === null ? [] : bidsState,
  rawAsks: [],
  asks: asksState === null ? [] : asksState,
};

const updatePriceLevel = (currentLevels, newLvl) => {
  return currentLevels.map((level) =>
    level[0] === newLvl[0] ? newLvl : level
  );
};

const levelExists = (currentLevels, newPrice) =>
  currentLevels.some(([deltaPrice]) => deltaPrice === newPrice);

const applyDeltas = (currentLevels, newLvl, switchOrder) => {
  let updatedLevels = currentLevels;
  const [newPrice, newCount] = newLvl[0];

  // when count = 0 then you have to delete the price level
  if (newCount === 0 && currentLevels.length > 0) {
    updatedLevels = currentLevels.filter(
      ([deltaPrice]) => deltaPrice !== newPrice
    );
    // If the price level doesn't exist in the orderbook
    // and there are less than 24 levels, add it
  } else if (
    !levelExists(updatedLevels, newPrice) &&
    updatedLevels.length < PRICE_LEVELS
  ) {
    updatedLevels = [...updatedLevels, newLvl[0]];

    // If the price level exists and the count is not zero, update it
  } else if (levelExists(updatedLevels, newPrice)) {
    updatedLevels = updatePriceLevel(currentLevels, newLvl);
  }

  const sortedByPrice = [...updatedLevels].sort((curr, next) =>
    switchOrder ? next[0] - curr[0] : curr[0] - next[0]
  );

  return addTotalSums(sortedByPrice);
};

const addTotalSums = (orders) =>
  orders.reduce((result, [price, count, amount]) => {
    const totalSum = result.length
      ? result[result.length - 1][3] + amount
      : amount;
    result.push([price, count, amount, totalSum]);
    return result;
  }, []);

// Redux Toolkit's createReducer API uses Immer internally automatically.
// createSlice uses createReducer inside, so it's also safe to "mutate" state,
// this even applies if the case reducer functions are defined outside of the createSlice/createReducer call.

export const orderbookSlice = createSlice({
  name: "orderbook",
  initialState,
  reducers: {
    addBids: (state, { payload }) => {
      const updatedBids = applyDeltas(
        current(state).rawBids,
        addTotalSums(payload),
        true
      );
      state.rawBids = updatedBids;
      state.bids = updatedBids;
    },
    addAsks: {
      reducer: (state, { payload }) => {
        const updatedAsks = applyDeltas(
          current(state).rawAsks,
          addTotalSums(payload),
          false
        );
        state.rawAsks = updatedAsks;
        state.asks = updatedAsks;
      },
      prepare: (ask) => {
        const abs = ask.map(([price, count, amount]) => [
          price,
          count,
          Math.abs(amount),
        ]);
        return { payload: abs };
      },
    },
    addSnapshot: (state, { payload }) => {
      payload.forEach(([price, count, amount]) => {
        if (amount < 0) {
          state.rawAsks.push([price, count, Math.abs(amount)]);
        } else state.rawBids.push([price, count, amount]);
      });
    },
  },
});

export const { addBids, addAsks, addSnapshot } = orderbookSlice.actions;

export const selectBids = (state) => state.orderbook.bids;
export const selectAsks = (state) => state.orderbook.asks;

export default orderbookSlice.reducer;
