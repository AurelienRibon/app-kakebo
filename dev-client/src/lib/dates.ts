export function formatDateToDay(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  return `${year}-${month}-${day}`;
}

export function formatDateToMonth(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  return `${year}-${month}`;
}

export function formatDate(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
  const dtf = new Intl.DateTimeFormat('fr');
  const daysDiff = computeDaysDiff(new Date(), date);
  return daysDiff >= -1 && daysDiff <= 0 ? rtf.format(daysDiff, 'day') : dtf.format(date);
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function computeDaysDiff(date1: Date, date2: Date) {
  const millisDiff = date2.getTime() - date1.getTime();
  const daysDiff = millisDiff / 1000 / 60 / 60 / 24;
  return daysDiff >= 0 ? Math.floor(daysDiff) : Math.ceil(daysDiff);
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}
