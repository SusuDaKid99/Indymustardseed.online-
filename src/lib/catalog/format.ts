const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(amount: number) {
  return usd.format(amount);
}

/** Money math in integer cents to avoid floating point drift. */
export function toCents(amount: number) {
  return Math.round(amount * 100);
}

export function fromCents(cents: number) {
  return cents / 100;
}

export function sumPrices(lines: { price: number; quantity: number }[]) {
  return fromCents(lines.reduce((t, l) => t + toCents(l.price) * l.quantity, 0));
}
