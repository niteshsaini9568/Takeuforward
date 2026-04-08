"use client";

import {
  formatDayAriaLabel,
  getMonthGrid,
  isDayInRange,
  isToday,
  isWeekend,
  toDayKey,
} from "@/lib/calendar/dateUtils";
import { getHolidayLabel } from "./holidays";

const WEEKDAYS_MON_FIRST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type CalendarGridProps = {
  year: number;
  monthIndex: number;
  selectionStart: string | null;
  selectionEnd: string | null;
  onDayClick: (dayKey: string) => void;
};

export function CalendarGrid({
  year,
  monthIndex,
  selectionStart,
  selectionEnd,
  onDayClick,
}: CalendarGridProps) {
  const cells = getMonthGrid(year, monthIndex);

  return (
    <div className="calendar-grid-panel">
      <div className="mb-2 grid grid-cols-7 gap-y-1">
        {WEEKDAYS_MON_FIRST.map((d, col) => {
          const weekend = col >= 5;
          return (
            <div
              key={d}
              className={`py-2 text-center text-[0.68rem] font-bold uppercase tracking-wide sm:text-[0.72rem] ${weekend ? "text-[#1da1f2]" : "text-[#333333]"}`}
            >
              {d}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 gap-x-0.5 gap-y-1 sm:gap-x-1 sm:gap-y-1.5">
        {cells.map(({ date, inCurrentMonth }, index) => {
          const key = toDayKey(date);
          const inRange = isDayInRange(key, selectionStart, selectionEnd);
          const isStart = selectionStart !== null && key === selectionStart;
          const isEnd = selectionEnd !== null && key === selectionEnd;
          const pendingStart =
            selectionStart !== null && selectionEnd === null && key === selectionStart;
          const today = isToday(date);
          const weekendDay = isWeekend(date);
          const holiday = inCurrentMonth
            ? getHolidayLabel(date.getFullYear(), date.getMonth(), date.getDate())
            : null;

          let rangeClass = "";
          if (inRange) {
            if (isStart && isEnd) rangeClass = "calendar-day-range calendar-day-single";
            else if (isStart) rangeClass = "calendar-day-range calendar-day-start";
            else if (isEnd) rangeClass = "calendar-day-range calendar-day-end";
            else rangeClass = "calendar-day-range calendar-day-mid";
          }

          const baseColor = !inCurrentMonth
            ? "text-[#cccccc]"
            : inRange
              ? isStart || isEnd
                ? ""
                : "text-[#333333]"
              : weekendDay
                ? "text-[#1da1f2]"
                : "text-[#333333]";

          return (
            <button
              key={`${key}-${inCurrentMonth}-${index}`}
              type="button"
              onClick={() => onDayClick(key)}
              aria-label={`${formatDayAriaLabel(date)}${holiday ? `, ${holiday}` : ""}${isStart ? ", range start" : ""}${isEnd ? ", range end" : ""}${inRange && !isStart && !isEnd ? ", in selected range" : ""}`}
              aria-pressed={inRange}
              title={holiday ?? undefined}
              className={[
                "calendar-day-cell",
                baseColor,
                !inCurrentMonth && "opacity-95",
                today && !inRange && !pendingStart && "calendar-day-today",
                pendingStart && "calendar-day-pending-start",
                rangeClass,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="tabular-nums leading-none">{date.getDate()}</span>
              {holiday ? (
                <span
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-[#1da1f2]"
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-neutral-400">
        Tap a day for the start, then another for the end. Start, end, and days in between are
        highlighted.
      </p>
    </div>
  );
}
