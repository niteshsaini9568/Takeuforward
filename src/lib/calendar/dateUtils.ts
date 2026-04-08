/**
 * Fixed locale for calendar copy that participates in SSR/hydration.
 * `undefined` uses different defaults on server vs browser and causes mismatches.
 */
export const CALENDAR_DISPLAY_LOCALE = "en-US";

/** Local calendar day key — avoids UTC shifts from ISO strings. */
export function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function monthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function compareDayKeys(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function normalizeRange(start: string, end: string): [string, string] {
  return compareDayKeys(start, end) <= 0 ? [start, end] : [end, start];
}

export function isDayInRange(day: string, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  const [lo, hi] = normalizeRange(start, end);
  return compareDayKeys(day, lo) >= 0 && compareDayKeys(day, hi) <= 0;
}

export type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

/**
 * Six-week grid (42 cells), **Monday-first** (matches print wall calendars).
 */
export function getMonthGrid(year: number, monthIndex: number): CalendarCell[] {
  const first = new Date(year, monthIndex, 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const cells: CalendarCell[] = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(year, monthIndex, 1 - mondayOffset + i);
    const inCurrentMonth = d.getFullYear() === year && d.getMonth() === monthIndex;
    cells.push({ date: d, inCurrentMonth });
  }

  return cells;
}

const TODAY = () => new Date();

export function isToday(d: Date): boolean {
  const t = TODAY();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function formatDayAriaLabel(d: Date): string {
  return d.toLocaleDateString(CALENDAR_DISPLAY_LOCALE, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMedium(d: Date): string {
  return d.toLocaleDateString(CALENDAR_DISPLAY_LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRangeLabel(start: string, end: string): string {
  const a = parseDayKey(start);
  const b = parseDayKey(end);
  const [lo, hi] = compareDayKeys(start, end) <= 0 ? [a, b] : [b, a];
  const sameYear = lo.getFullYear() === hi.getFullYear();
  const sameMonth = sameYear && lo.getMonth() === hi.getMonth();
  if (sameMonth) {
    return `${lo.toLocaleDateString(CALENDAR_DISPLAY_LOCALE, { month: "long", day: "numeric" })} – ${hi.getDate()}, ${hi.getFullYear()}`;
  }
  if (sameYear) {
    return `${lo.toLocaleDateString(CALENDAR_DISPLAY_LOCALE, { month: "short", day: "numeric" })} – ${hi.toLocaleDateString(CALENDAR_DISPLAY_LOCALE, { month: "short", day: "numeric" })}, ${hi.getFullYear()}`;
  }
  return `${formatMedium(lo)} – ${formatMedium(hi)}`;
}

export function rangeStorageKey(start: string, end: string): string {
  const [lo, hi] = normalizeRange(start, end);
  return `${lo}:${hi}`;
}
