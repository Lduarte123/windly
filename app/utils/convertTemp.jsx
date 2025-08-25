export function convertTemp(temp, unit) {
  if (
    temp === "--" ||
    temp === undefined ||
    temp === null ||
    isNaN(parseFloat(temp))
  ) {
    return "--";
  }

  const normalizedUnit = unit?.toLowerCase();

  return normalizedUnit === "f"
    ? (parseFloat(temp) * 9/5 + 32).toFixed(1)
    : parseFloat(temp).toFixed(1);
}
