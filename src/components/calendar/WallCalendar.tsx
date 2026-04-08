"use client";

import { CALENDAR_DISPLAY_LOCALE } from "@/lib/calendar/dateUtils";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarHero } from "./CalendarHero";
import { CalendarSpiral } from "./CalendarSpiral";
import { NotesPanel } from "./NotesPanel";
import { useCalendarMonthFlip } from "./useCalendarMonthFlip";
import { useWallCalendarState } from "./useWallCalendarState";

/** Small nail/pin that the V-bail hangs on, visible above the calendar sheet. */
function WallNail() {
  return (
    <div className="pointer-events-none relative z-20 -mb-0.5 flex flex-col items-center">
      {/* Nail head */}
      <div className="h-3 w-3 rounded-full bg-linear-to-br from-white via-neutral-200 to-neutral-500 shadow-[0_2px_6px_rgba(0,0,0,0.38)] ring-1 ring-neutral-500/50" />
      {/* Nail shank */}
      <div className="h-3 w-[3px] rounded-b-sm bg-linear-to-b from-neutral-600 to-neutral-900" />
    </div>
  );
}

export function WallCalendar() {
  const {
    year,
    monthIndex,
    goPrevMonth,
    goNextMonth,
    goToday,
    selectionStart,
    selectionEnd,
    rangeComplete,
    onDayClick,
    clearSelection,
    monthMemo,
    setMonthMemo,
    selectionNote,
    setSelectionNote,
  } = useWallCalendarState();

  const { sheetMotion, onSheetTransitionEnd, flipNext, flipPrev, flipping } =
    useCalendarMonthFlip(goPrevMonth, goNextMonth);

  const monthLabel = new Date(year, monthIndex, 1).toLocaleString(CALENDAR_DISPLAY_LOCALE, {
    month: "long",
    year: "numeric",
  });

  const hasSelection = selectionStart !== null || selectionEnd !== null;

  const sheetClass = [
    "calendar-sheet calendar-flip-inner",
    flipping ? "is-flipping" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="calendar-root min-h-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-[560px] sm:max-w-[620px] lg:max-w-[680px]">
        <p className="mb-5 text-center text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Interactive calendar
        </p>

        {/* Nail + spiral sit OUTSIDE the clipped sheet so coils are visible above the paper */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Wall shadow — blurred halo cast by the calendar on the gray wall */}
          <div className="pointer-events-none absolute -top-2 left-0 right-0 mx-auto h-10 w-[90%] rounded-full bg-black/15 blur-xl" />
          <WallNail />
          <div className="w-full">
            <CalendarSpiral />
          </div>
        </div>

        {/* Calendar sheet (overflow-hidden, 3D flip) */}
        <div className="calendar-flip-stage">
          <div
            className={sheetClass}
            style={sheetMotion}
            onTransitionEnd={onSheetTransitionEnd}
          >
            <CalendarHero monthIndex={monthIndex} year={year} />

            <div className="flex flex-col lg:flex-row lg:items-stretch">
              {/* Notes — left on desktop, bottom on mobile */}
              <div className="order-2 border-t border-neutral-200/90 p-4 sm:p-5 lg:order-1 lg:w-[40%] lg:border-r lg:border-t-0 lg:border-neutral-200/90 lg:p-5">
                <NotesPanel
                  monthLabel={monthLabel}
                  monthMemo={monthMemo}
                  onMonthMemoChange={setMonthMemo}
                  rangeComplete={rangeComplete}
                  selectionStart={selectionStart}
                  selectionEnd={selectionEnd}
                  selectionNote={selectionNote}
                  onSelectionNoteChange={setSelectionNote}
                />
              </div>

              {/* Calendar grid — right on desktop, top on mobile */}
              <div className="order-1 flex flex-col p-4 sm:p-5 lg:order-2 lg:w-[60%] lg:p-5">
                <CalendarHeader
                  year={year}
                  monthIndex={monthIndex}
                  onPrev={flipPrev}
                  onNext={flipNext}
                  onToday={goToday}
                  onClearSelection={clearSelection}
                  hasSelection={hasSelection}
                  monthNavDisabled={flipping}
                />
                <CalendarGrid
                  year={year}
                  monthIndex={monthIndex}
                  selectionStart={selectionStart}
                  selectionEnd={selectionEnd}
                  onDayClick={onDayClick}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 pb-4 text-center text-[0.62rem] text-neutral-400">
          ← → flip month · select a range · notes saved in browser
        </p>
      </div>
    </div>
  );
}
