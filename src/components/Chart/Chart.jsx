const Chart = ({ total, switchOrder }) => {
  // Checks if the total value is greater than 100.
  // The total value is set to 100 to ensure the bar does not exceed 100%.
  if (total > 100) {
    total = 100;
  }
  return (
    <div
      data-testid="chart"
      style={{
        backgroundColor: `${switchOrder ? "#205c4e" : "#813d3a"}`,
        height: "1.250em",
        width: `${total}%`,
        position: "relative",
        top: 20,
        left: `${switchOrder ? `${100 - total}%` : 0}`,
        marginTop: -24,
        zIndex: 1,
      }}
    />
  );
};

export default Chart;
