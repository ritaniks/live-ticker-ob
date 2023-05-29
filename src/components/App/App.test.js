import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import App from "./App";

const mockStore = configureStore();

const initialState = {
  orderbook: {
    rawBids: [],
    bids: [],
    rawAsks: [],
    asks: [],
  },
};

describe("App test", () => {
  it("renders the App component", () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const appComponent = screen.getByTestId("app-component");

    expect(appComponent).toBeInTheDocument();
  });
});
