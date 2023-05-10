import { render, screen } from "@testing-library/react";

import Header from "./Header";

test("renders header component with text", () => {
  render(<Header />);
  const txtElement = screen.getByText(/Order Book/i);
  expect(txtElement).toBeInTheDocument();
});
