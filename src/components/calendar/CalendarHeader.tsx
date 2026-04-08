"use client";

import { CALENDAR_DISPLAY_LOCALE } from "@/lib/calendar/dateUtils";

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type CalendarHeaderProps = {
  year: number;
  monthIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onClearSelection: () => void;
  hasSelection: boolean;
  monthNavDisabled?: boolean;
};

export function CalendarHeader({
  year,
  monthIndex,
  onPrev,
  onNext,
  onToday,
  onClearSelection,
  hasSelection,
  monthNavDisabled = false,
}: CalendarHeaderProps) {
  const label = new Date(year, monthIndex, 1).toLocaleString(CALENDAR_DISPLAY_LOCALE, {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mb-4 flex w-full flex-col gap-3 border-b border-neutral-200/90 pb-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={monthNavDisabled}
          className="calendar-nav-btn disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="min-w-0 flex-1 text-center font-sans text-sm font-semibold uppercase tracking-wide text-[#333333] sm:text-base">
          {label}
        </p>
        <button
          type="button"
          onClick={onNext}
          disabled={monthNavDisabled}
          className="calendar-nav-btn disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
        <button type="button" onClick={onToday} className="calendar-chip-ghost">
          Today
        </button>
        <button
          type="button"
          onClick={onClearSelection}
          disabled={!hasSelection}
          className="calendar-chip-ghost disabled:pointer-events-none disabled:opacity-35"
        >
          Clear range
        </button>
      </div>
    </div>
  );
}
