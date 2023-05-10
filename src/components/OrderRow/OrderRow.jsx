import styles from "./OrderRow.module.scss";

const OrderRow = ({ total, amount, price, count, switchOrder }) => {
  return (
    <div data-testid="price-level" className={styles.TableContent}>
      {switchOrder ? (
        <div className={styles.NumbersContainer}>
          <span>{count}</span>
          <span className={styles.AlignRight}>{amount}</span>
          <span className={styles.AlignRight}>{total}</span>
          <span>{price}</span>
        </div>
      ) : (
        <div className={styles.NumbersContainer}>
          <span>{price}</span>
          <span className={styles.AlignRight}>{total}</span>
          <span className={styles.AlignRight}>{amount}</span>
          <span>{count}</span>
        </div>
      )}
    </div>
  );
};

export default OrderRow;
