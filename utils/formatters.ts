export function formatCurrency(amount: number) {
  const result = amount / 100;
  return `£${result}`;
}
