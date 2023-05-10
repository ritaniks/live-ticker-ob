import reducer from "./orderbookSlice";

test("should return the initial state", () => {
  expect(reducer(undefined, {})).toEqual({
    rawBids: [],
    bids: [],
    maxTotalBids: 0,
    rawAsks: [],
    asks: [],
    maxTotalAsks: 0,
  });
});
