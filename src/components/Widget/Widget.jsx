import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WSS_URL } from "../../config/constant";
import { formatNumber, formatPrice } from "../../helpers";
import OrderRow from "../OrderRow/OrderRow";
import Chart from "../Chart/Chart";

import {
  addAsks,
  addBids,
  addSnapshot,
  selectAsks,
  selectBids,
} from "../../silce/orderbookSlice";

import Header from "../Header/Header";

import Loader from "../Loader";

import styles from "./Widget.module.scss";

const switchOrder = true;

let subscribeMessage = JSON.stringify({
  event: "subscribe",
  channel: "book",
  symbol: "tBTCUSD",
});

let wss;

const Widget = () => {
  // Retrieving data from Store
  const bids = useSelector(selectBids);
  const asks = useSelector(selectAsks);

  const dispatch = useDispatch();

  const websocket = useMemo(() => {
    if (!wss) {
      wss = new WebSocket(WSS_URL);
    }
  }, []);

  useEffect(() => {
    wss.onopen = () => {
      wss.send(subscribeMessage);
    };

    wss.onmessage = (msg) => {
      if (msg.event || msg[1] === "hb") return;

      const parsed = JSON.parse(msg.data);
      const data = parsed[1];

      if (Array.isArray(data) && data.length > 3) {
        // receiving the snapshot Arr(50) to create the initial book structure
        dispatch(addSnapshot(data));
      } else if (Array.isArray(data) && data.length === 3) {
        // receiving every new single level
        manageData(data);
      }
    };

    const manageData = (data) => {
      if (data[2] < 0 && data.length > 0) {
        dispatch(addAsks([data]));
      } else if (data[2] > 0 && data.length > 0) {
        dispatch(addBids([data]));
      }
    };
  }, [dispatch, websocket]);

  const buildPriceLevels = (levels, switchOrder) => {
    return levels.map(([price, count, amount, total], idx) => {
      const formattedAmount = formatNumber(amount);
      const formattedTotal = formatNumber(total);
      const formattedPrice = formatPrice(price);
      return (
        <div key={idx}>
          <Chart total={total} switchOrder={switchOrder} />
          <OrderRow
            key={idx}
            count={count}
            total={formattedTotal}
            amount={formattedAmount}
            price={formattedPrice}
            switchOrder={switchOrder}
          />
        </div>
      );
    });
  };

  return (
    <div className={styles.Wrapper} data-testid="widget-component">
      <Header />

      <>
        {bids.length && asks.length ? (
          <div className={styles.OrderContainer}>
            <div className={styles.TableContent}>
              <div className={styles.TitleHeader}>
                <span>Count</span>
                <span className={styles.AlignRight}>Amount</span>
                <span className={styles.AlignRight}>Total</span>
                <span>Price</span>
              </div>
              <div>{buildPriceLevels(bids, switchOrder)}</div>
            </div>

            <div className={styles.TableContent}>
              <div className={styles.TitleHeader}>
                <span>Price</span>
                <span className={styles.AlignRight}>Total</span>
                <span className={styles.AlignRight}>Amount</span>
                <span>Count</span>
              </div>
              <div>{buildPriceLevels(asks)}</div>
            </div>
          </div>
        ) : (
          <div data-testid="loader">
            <Loader />
          </div>
        )}
      </>
    </div>
  );
};

export default Widget;
