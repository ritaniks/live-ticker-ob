import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Widget from "./Widget";

const mockStore = configureStore();

const initialState = {
  orderbook: {
    rawBids: [],
    bids: [],
    maxTotalBids: 0,
    rawAsks: [],
    asks: [],
    maxTotalAsks: 0,
  },
};

test("renders Widget", () => {
  const store = mockStore(initialState);
  render(
    <Provider store={store}>
      <Widget />
    </Provider>
  );
});
