import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// -----------------------------------------------------------------------------
// FORMAT
// -----------------------------------------------------------------------------

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

export function formatDateToDayHuman(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
  const dtf = new Intl.DateTimeFormat('fr');
  const daysDiff = dayjs(date).diff(dayjs(), 'days');
  return daysDiff >= -1 && daysDiff <= 0 ? rtf.format(daysDiff, 'day') : dtf.format(date);
}

// -----------------------------------------------------------------------------
// MUTATION
// -----------------------------------------------------------------------------

export function addMonthsToDate(date: Date, monthsDiff: number): Date {
  return dayjs(date).add(monthsDiff, 'months').toDate();
}

// -----------------------------------------------------------------------------
// MONTHS
// -----------------------------------------------------------------------------

export function getStartOfMonthDate(date: Date): Date {
  return dayjs(date).startOf('month').toDate();
}

export function getEndOfMonthDate(date: Date): Date {
  return dayjs(date).endOf('month').toDate();
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function pad(value: number) {
  return String(value).padStart(2, '0');
}
