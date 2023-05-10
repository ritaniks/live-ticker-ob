import { render, screen } from "@testing-library/react";
import Chart from "./Chart";

test("renders chart with style", () => {
  render(<Chart />);
  const divElement = screen.getByTestId("chart");
  expect(divElement).toBeInTheDocument();
  expect(divElement).toHaveAttribute("style");
});
