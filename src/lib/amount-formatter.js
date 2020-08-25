export function formatAmount(oldValue, newDigit) {
  const rawValue = oldValue.replace('.', '') + newDigit;
  const integer = formatInteger(rawValue);
  const decimal = formatDecimal(rawValue);
  return `${integer}.${decimal}`;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function formatInteger(value) {
  return value
    .slice(0, -2)
    .replace(/^0+$/, '0')
    .replace(/^0+([1-9])/, '$1');
}

function formatDecimal(value) {
  return value.slice(-2);
}
