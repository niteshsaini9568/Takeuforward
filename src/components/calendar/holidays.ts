/** Fixed-date US holidays for demo markers (creative extra). */
const FIXED: Record<string, string> = {
  "01-01": "New Year's Day",
  "07-04": "Independence Day",
  "11-11": "Veterans Day",
  "12-25": "Christmas Day",
};

function nthWeekdayOfMonth(
  year: number,
  monthIndex: number,
  weekday: number,
  n: number
): Date {
  let count = 0;
  const last = new Date(year, monthIndex + 1, 0).getDate();
  for (let d = 1; d <= last; d++) {
    const dt = new Date(year, monthIndex, d);
    if (dt.getDay() === weekday) {
      count += 1;
      if (count === n) return dt;
    }
  }
  return new Date(year, monthIndex, 1);
}

function lastWeekdayOfMonth(year: number, monthIndex: number, weekday: number): Date {
  const last = new Date(year, monthIndex + 1, 0).getDate();
  for (let d = last; d >= 1; d--) {
    const dt = new Date(year, monthIndex, d);
    if (dt.getDay() === weekday) return dt;
  }
  return new Date(year, monthIndex, 1);
}

export function getHolidayLabel(year: number, monthIndex: number, day: number): string | null {
  const md = `${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (FIXED[md]) return FIXED[md];

  // MLK 3rd Monday in January
  if (monthIndex === 0 && day === nthWeekdayOfMonth(year, 0, 1, 3).getDate()) {
    return "MLK Day";
  }
  // Presidents' Day 3rd Monday in February
  if (monthIndex === 1 && day === nthWeekdayOfMonth(year, 1, 1, 3).getDate()) {
    return "Presidents' Day";
  }
  // Memorial Day last Monday in May
  if (monthIndex === 4 && day === lastWeekdayOfMonth(year, 4, 1).getDate()) {
    return "Memorial Day";
  }
  // Labor Day 1st Monday in September
  if (monthIndex === 8 && day === nthWeekdayOfMonth(year, 8, 1, 1).getDate()) {
    return "Labor Day";
  }
  // Thanksgiving 4th Thursday in November
  if (monthIndex === 10 && day === nthWeekdayOfMonth(year, 10, 4, 4).getDate()) {
    return "Thanksgiving";
  }

  return null;
}
