import { render, screen } from "@testing-library/react";
import Chart from "./Chart";

describe("Chart tests", () => {
  it("renders a colored bar chart with correct styles", () => {
    const total = 75;
    const switchOrder = true;

    render(<Chart total={total} switchOrder={switchOrder} />);

    const chartElement = screen.getByTestId("chart");

    // Check the styles of the chart
    expect(chartElement).toHaveStyle(`
      background-color: #205c4e;
      height: 1.250em;
      width: 75%;
      position: relative;
      top: 20px;
      left: 25%;
      margin-top: -24px;
      z-index: 1;
    `);
  });

  it("limits the width of the chart to 100%", () => {
    const total = 120;
    const switchOrder = false;
    render(<Chart total={total} switchOrder={switchOrder} />);
    const chartElement = screen.getByTestId("chart");

    // Check that the width is limited to 100%
    expect(chartElement).toHaveStyle(`
      width: 100%;
    `);
  });
});
