/**
 * Converts a balance in paise (as bigint) to a formatted INR string.
 * e.g. 125000n → "₹1,250.00"
 */
export function formatPaiseToINR(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Converts a rupee amount (number) to paise as bigint for backend calls.
 * e.g. 1250 → 125000n
 */
export function rupeesToPaise(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

/**
 * Converts paise bigint to rupees number.
 * e.g. 125000n → 1250
 */
export function paiseToRupees(paise: bigint): number {
  return Number(paise) / 100;
}

// Legacy USD helpers kept for compatibility
export function formatCentsToUSD(cents: bigint): string {
  return formatPaiseToINR(cents);
}

export function dollarsToCents(dollars: number): bigint {
  return rupeesToPaise(dollars);
}
