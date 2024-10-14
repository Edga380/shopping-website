export function formatCurrency(amount: number) {
  const result = amount / 100;
  return `£${result}`;
}

export function addDiscount(basePrice: number, discount: number) {
  const discountAmount = basePrice * (discount / 100);
  const finalPrice = basePrice - discountAmount;
  return `£${(finalPrice / 100).toFixed(2)}`;
}
