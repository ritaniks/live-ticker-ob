import Widget from "../Widget/Widget";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.Body} data-testid="app-component">
      <Widget />
    </div>
  );
}

export default App;
