import { render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import Widget from "../Widget/Widget";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("Widget tests", () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockReturnValue([]);
  });

  it("renders the Widget component", () => {
    useSelector.mockReturnValueOnce([]).mockReturnValueOnce([]);
    render(<Widget />);
    const widgetComponent = screen.getByTestId("widget-component");

    expect(widgetComponent).toBeInTheDocument();
  });

  it("renders Loader when bids and asks are empty", () => {
    useSelector.mockReturnValueOnce([]).mockReturnValueOnce([]);
    render(<Widget />);
    const loader = screen.getByTestId("loader");

    expect(loader).toBeInTheDocument();
  });

  it("renders price levels correctly when bids and asks are not empty", () => {
    const mockBids = [
      [
        [10000, 1, 0.1, 10],
        [9999, 2, 0.2, 20],
      ],
    ];
    const mockAsks = [
      [
        [10001, 1, 0.1, 10],
        [10002, 2, 0.2, 20],
      ],
    ];
    useSelector.mockReturnValueOnce(mockBids).mockReturnValueOnce(mockAsks);
    render(<Widget />);

    const bidPriceLevelsExist = screen.getByText(/10000|9999/);
    const askPriceLevelsExist = screen.getByText(/10001|10002/);

    expect(bidPriceLevelsExist).toBeInTheDocument();
    expect(askPriceLevelsExist).toBeInTheDocument();
  });
});
