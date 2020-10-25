export function formatAmount(oldValue: string, newDigit: string): string {
  const rawValue = oldValue.replace('.', '') + newDigit;
  const integer = formatInteger(rawValue);
  const decimal = formatDecimal(rawValue);
  return `${integer}.${decimal}`;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function formatInteger(value: string): string {
  return value
    .slice(0, -2)
    .replace(/^0+$/, '0')
    .replace(/^0+([1-9])/, '$1');
}

function formatDecimal(value: string): string {
  return value.slice(-2);
}
