import { render } from "@testing-library/react";

import OrderRow from "./OrderRow";

test("renders price level row properly - not reversed", () => {
  render(
    <OrderRow
      count={1}
      price={"1000"}
      switchOrder={false}
      amount={"500"}
      total={"50000"}
    />
  );
});

test("renders price level row properly - reversed", () => {
  render(
    <OrderRow
      count={1}
      price={"1000"}
      switchOrder={true}
      amount={"500"}
      total={"50000"}
    />
  );
});
