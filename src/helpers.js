export const formatNumber = (number, precision = 4) => {
  const exponent = Math.pow(10, precision);
  return Math.round(number * exponent) / exponent;
};

export const formatPrice = (price) => {
  return price.toLocaleString("en-US");
};
