import { createSlice, current } from "@reduxjs/toolkit";
import { PRICE_LEVELS } from "../config/constant";

const initialState = {
  rawBids: [],
  bids: [],
  maxTotalBids: 0,
  rawAsks: [],
  asks: [],
  maxTotalAsks: 0,
};

const removePriceLevel = (price, levels) => {
  levels.filter((level) => level[0] !== price);
};

const updatePriceLevel = (updatedLevel, levels) => {
  return levels.map((level) => {
    if (level[0] === updatedLevel[0]) {
      level = updatedLevel;
    }
    return level;
  });
};

const levelExists = (deltaLevelPrice, currentLevels) =>
  currentLevels.some((level) => level[0] === deltaLevelPrice);

const addPriceLevel = (deltaLevel, levels) => {
  return [...levels, deltaLevel];
};

const applyDeltas = (currentLevels, orders) => {
  let updatedLevels = currentLevels;

  orders.forEach((deltaLevel) => {
    const deltaLevelPrice = deltaLevel[0];
    const deltaLevelCount = deltaLevel[1];

    // when count = 0 then you have to delete the price level
    if (deltaLevelCount === 0 && updatedLevels.length > PRICE_LEVELS) {
      updatedLevels = removePriceLevel(deltaLevelPrice, updatedLevels);
    } else {
      // If the price level exists and the count is not zero, update it
      if (levelExists(deltaLevelPrice, currentLevels)) {
        updatedLevels = updatePriceLevel(deltaLevel, updatedLevels);
      } else {
        // If the price level doesn't exist in the orderbook and there are less than 24 levels, add it
        if (updatedLevels.length < PRICE_LEVELS) {
          updatedLevels = addPriceLevel(deltaLevel, updatedLevels);
        }
      }
    }
  });

  return updatedLevels;
};

const addTotalSums = (orders) => {
  const totalSums = [];
  return orders.map((order, idx) => {
    const amount = order[2];
    if (typeof order[3] !== "undefined") {
      return order;
    } else {
      const updatedLevel = [...order];
      const totalSum = idx === 0 ? amount : amount + totalSums[idx - 1];
      updatedLevel[3] = totalSum;
      totalSums.push(totalSum);
      return updatedLevel;
    }
  });
};

const addDepths = (orders, maxTotal) => {
  return orders.map((order) => {
    if (typeof order[4] !== "undefined") {
      return order;
    } else {
      const calculatedTotal = order[2];
      const depth = calculatedTotal / maxTotal;
      const updatedOrder = [...order];
      updatedOrder[4] = depth;
      return updatedOrder;
    }
  });
};

const getMaxTotalSum = (orders) => {
  const totalSums = orders.map((order) => order[2]);
  return Math.max.apply(Math, totalSums);
};

export const orderbookSlice = createSlice({
  name: "orderbook",
  initialState,
  reducers: {
    addBids: (state, { payload }) => {
      const updatedBids = addTotalSums(
        applyDeltas(current(state).rawBids, payload)
      );

      state.maxTotalBids = getMaxTotalSum(updatedBids);
      state.bids = addDepths(updatedBids, current(state).maxTotalBids);
    },
    addAsks: (state, { payload }) => {
      const updatedAsks = addTotalSums(
        applyDeltas(current(state).rawAsks, payload)
      );

      state.maxTotalAsks = getMaxTotalSum(updatedAsks);
      state.asks = addDepths(updatedAsks, current(state).maxTotalAsks);
    },
  },
});

export const { addBids, addAsks } = orderbookSlice.actions;

export const selectBids = (state) => state.orderbook.bids;
export const selectAsks = (state) => state.orderbook.asks;

export default orderbookSlice.reducer;
