import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header tests", () => {
  it("renders the title and currency correctly", () => {
    render(<Header />);

    const titleElement = screen.getByText(/Order Book/i);
    const currencyElement = screen.getByText(/BTC\/USD/i);

    expect(titleElement).toBeInTheDocument();
    expect(currencyElement).toBeInTheDocument();
  });
});
