"use client";

import { formatRangeLabel } from "@/lib/calendar/dateUtils";

type NotesPanelProps = {
  monthLabel: string;
  monthMemo: string;
  onMonthMemoChange: (value: string) => void;
  rangeComplete: boolean;
  selectionStart: string | null;
  selectionEnd: string | null;
  selectionNote: string;
  onSelectionNoteChange: (value: string) => void;
};

export function NotesPanel({
  monthLabel,
  monthMemo,
  onMonthMemoChange,
  rangeComplete,
  selectionStart,
  selectionEnd,
  selectionNote,
  onSelectionNoteChange,
}: NotesPanelProps) {
  const rangeLabel =
    rangeComplete && selectionStart && selectionEnd
      ? formatRangeLabel(selectionStart, selectionEnd)
      : null;

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-[#333333]">
          Notes
        </h3>
        <p className="mt-1 text-[0.7rem] leading-relaxed text-neutral-500">
          Month: <span className="font-medium text-neutral-600">{monthLabel}</span> · saved locally
        </p>
        <label htmlFor="month-memo" className="sr-only">
          Notes for {monthLabel}
        </label>
        <textarea
          id="month-memo"
          value={monthMemo}
          onChange={(e) => onMonthMemoChange(e.target.value)}
          rows={8}
          placeholder=""
          className="notes-lined-field mt-3 min-h-[12rem]"
        />
      </div>

      <div className="border-t border-neutral-200 pt-5">
        <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-[#333333]">
          Range notes
        </h3>
        {rangeComplete && rangeLabel ? (
          <>
            <p className="mt-1 text-[0.7rem] text-neutral-500">
              <span className="font-medium text-neutral-700">{rangeLabel}</span>
            </p>
            <label htmlFor="range-note" className="sr-only">
              Notes for {rangeLabel}
            </label>
            <textarea
              id="range-note"
              value={selectionNote}
              onChange={(e) => onSelectionNoteChange(e.target.value)}
              rows={5}
              placeholder=""
              className="notes-lined-field mt-3 min-h-[7.5rem]"
            />
          </>
        ) : (
          <p className="notes-range-placeholder mt-3">
            Select a <strong className="font-semibold text-neutral-600">start</strong> and{" "}
            <strong className="font-semibold text-neutral-600">end</strong> date on the grid to
            attach notes to that range.
          </p>
        )}
      </div>
    </div>
  );
}
