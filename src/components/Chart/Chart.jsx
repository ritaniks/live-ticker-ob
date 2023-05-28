const Chart = ({ total, switchOrder }) => {
  return (
    <div
      data-testid="chart"
      style={{
        backgroundColor: `${switchOrder ? "#205c4e" : "#813d3a"}`,
        height: "1.250em",
        width: `${total > 100 ? 100 : total}%`,
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
