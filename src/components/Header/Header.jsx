import styles from "./Header.module.scss";

const Header = () => {
  return (
    <div className={styles.Wrapper}>
      <div>
        <span className={styles.Title}>Order Book</span>
        <span className={styles.CurrencyTitle}>BTC/USD</span>
      </div>
    </div>
  );
};

export default Header;
