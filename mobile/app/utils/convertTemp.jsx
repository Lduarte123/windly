export function convertTemp(temp, unit) {
  if (
    temp === "--" ||
    temp === undefined ||
    temp === null ||
    isNaN(parseFloat(temp))
  ) {
    return "--";
  }
  return unit === "F"
    ? (parseFloat(temp) * 9/5 + 32).toFixed(1)
    : parseFloat(temp);
}