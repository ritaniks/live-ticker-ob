import { render, screen } from "@testing-library/react";
import OrderRow from "./OrderRow";

describe("OrderRow tests", () => {
  it("renders price levels correctly with switchOrder true", () => {
    const props = {
      total: 10,
      amount: 0.1,
      price: 10000,
      count: 1,
      switchOrder: true,
    };

    render(<OrderRow {...props} />);

    const countElement = screen.getByText(props.count);
    const amountElement = screen.getByText(props.amount.toString());
    const totalElement = screen.getByText(props.total.toString());
    const priceElement = screen.getByText(props.price.toString());

    expect(countElement).toBeInTheDocument();
    expect(amountElement).toBeInTheDocument();
    expect(totalElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
  });

  it("renders price levels correctly with switchOrder false", () => {
    const props = {
      total: 10,
      amount: 0.1,
      price: 10000,
      count: 1,
      switchOrder: false,
    };

    render(<OrderRow {...props} />);

    const countElement = screen.getByText(props.count);
    const amountElement = screen.getByText(props.amount.toString());
    const totalElement = screen.getByText(props.total.toString());
    const priceElement = screen.getByText(props.price.toString());

    expect(countElement).toBeInTheDocument();
    expect(amountElement).toBeInTheDocument();
    expect(totalElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
  });
});
