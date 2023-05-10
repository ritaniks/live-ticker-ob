import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WSS_URL, PRICE_LEVELS } from "../../config/constant";
import { formatNumber, formatPrice } from "../../helpers";
import OrderRow from "../OrderRow/OrderRow";
import Chart from "../Chart/Chart";

import {
  addAsks,
  addBids,
  selectAsks,
  selectBids,
} from "../../silce/orderbookSlice";

import Header from "../Header/Header";

import Loader from "../Loader";

import styles from "./Widget.module.scss";

const switchOrder = true;

let currentBids = [];
let currentAsks = [];

let respBids = [];
let respAsks = [];

const Widget = () => {
  const bids = useSelector(selectBids);
  const asks = useSelector(selectAsks);
  const dispatch = useDispatch();

  useEffect(() => {
    const wss = new WebSocket(WSS_URL);

    wss.onmessage = (msg) => {
      if (msg.event) return;
      if (msg[1] === "hb") return;

      const parsed = JSON.parse(msg.data);

      restructure(parsed);
    };
    let subscribe = JSON.stringify({
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
    });

    wss.onopen = () => {
      wss.send(subscribe);
    };

    const restructure = (response) => {
      if (Array.isArray(response) && response[1].length > 3) {
        response[1].forEach((item) => {
          if (Math.sign(item[2]) === -1 && item[2] !== -1) {
            const abs = [item[0], item[1], Math.abs(item[2])];
            respAsks.push(abs);
          } else if (item[2] !== 1) {
            respBids.push(item);
          }
        });
      }

      if (respBids.length > 0) {
        currentBids = [...currentBids, ...respBids];
        if (currentBids.length > PRICE_LEVELS) {
          dispatch(addBids(currentBids));
          currentBids = [];
          currentBids.length = 0;
        }
      }
      if (respAsks.length >= 0) {
        currentAsks = [...currentAsks, ...respAsks];

        if (currentAsks.length > PRICE_LEVELS) {
          dispatch(addAsks(currentAsks));
          currentAsks = [];
          currentAsks.length = 0;
        }
      }
    };
  }, [dispatch]);

  const buildPriceLevels = (levels, switchOrder) => {
    return levels.map((level, idx) => {
      const amount = formatNumber(level[2]);
      const total = formatNumber(level[3]);
      const price = formatPrice(level[0]);
      const count = level[1];

      return (
        <div key={total + idx}>
          <Chart amount={amount} total={total} switchOrder={switchOrder} />
          <OrderRow
            key={amount + idx}
            count={count}
            total={total}
            amount={amount}
            price={price}
            switchOrder={switchOrder}
          />
        </div>
      );
    });
  };

  return (
    <div className={styles.Wrapper}>
      <Header />

      <>
        {bids.length && asks.length ? (
          <div className={styles.OrderContainer}>
            <div className={styles.TableContent}>
              <div className={styles.TitleHeader}>
                <span>Counts</span>
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
                <span>Counts </span>
              </div>
              <div>{buildPriceLevels(asks)}</div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </>
    </div>
  );
};

export default Widget;
