import orderbookReducer, {
  addSnapshot,
  selectBids,
  selectAsks,
} from "./orderbookSlice";

describe("orderbookSlice tests", () => {
  const initialState = {
    rawBids: [],
    bids: [],
    rawAsks: [],
    asks: [],
  };

  it("should handle adding a snapshot", () => {
    const snapshot = [
      [10000, 1, 0.1],
      [10001, 2, -0.2],
    ];
    const action = addSnapshot(snapshot);

    const newState = orderbookReducer(initialState, action);

    expect(newState.rawBids).toEqual([[10000, 1, 0.1]]);
    expect(newState.rawAsks).toEqual([[10001, 2, 0.2]]);
  });

  it("should select the bids from the state", () => {
    const state = {
      orderbook: {
        bids: [
          [10000, 1, 0.1, 10],
          [9999, 2, 0.2, 20],
        ],
      },
    };

    const selectedBids = selectBids(state);

    expect(selectedBids).toEqual([
      [10000, 1, 0.1, 10],
      [9999, 2, 0.2, 20],
    ]);
  });

  it("should select the asks from the state", () => {
    const state = {
      orderbook: {
        asks: [
          [10001, 1, 0.1, 10],
          [10002, 2, 0.2, 20],
        ],
      },
    };

    const selectedAsks = selectAsks(state);

    expect(selectedAsks).toEqual([
      [10001, 1, 0.1, 10],
      [10002, 2, 0.2, 20],
    ]);
  });
});
