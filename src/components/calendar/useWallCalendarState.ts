"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  compareDayKeys,
  monthKey,
  rangeStorageKey,
} from "@/lib/calendar/dateUtils";

const STORAGE_KEY = "wall-calendar-v1";

export type PersistedCalendarState = {
  monthMemos: Record<string, string>;
  rangeNotes: Record<string, string>;
};

function loadPersisted(): PersistedCalendarState {
  if (typeof window === "undefined") {
    return { monthMemos: {}, rangeNotes: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { monthMemos: {}, rangeNotes: {} };
    const parsed = JSON.parse(raw) as Partial<PersistedCalendarState>;
    return {
      monthMemos:
        typeof parsed.monthMemos === "object" && parsed.monthMemos !== null
          ? parsed.monthMemos
          : {},
      rangeNotes:
        typeof parsed.rangeNotes === "object" && parsed.rangeNotes !== null
          ? parsed.rangeNotes
          : {},
    };
  } catch {
    return { monthMemos: {}, rangeNotes: {} };
  }
}

function savePersisted(state: PersistedCalendarState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function useWallCalendarState() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [monthIndex, setMonthIndex] = useState(() => new Date().getMonth());
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [monthMemos, setMonthMemos] = useState<Record<string, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const p = loadPersisted();
      setMonthMemos(p.monthMemos);
      setRangeNotes(p.rangeNotes);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePersisted({ monthMemos, rangeNotes });
  }, [hydrated, monthMemos, rangeNotes]);

  const currentMonthKey = useMemo(() => monthKey(year, monthIndex), [year, monthIndex]);

  const setMonthMemo = useCallback(
    (text: string) => {
      setMonthMemos((prev) => ({ ...prev, [currentMonthKey]: text }));
    },
    [currentMonthKey]
  );

  const monthMemo = monthMemos[currentMonthKey] ?? "";

  const selectionStart = range.start;
  const selectionEnd = range.end;
  const rangeComplete = Boolean(selectionStart && selectionEnd);
  const rangeKey =
    rangeComplete && selectionStart && selectionEnd
      ? rangeStorageKey(selectionStart, selectionEnd)
      : null;

  const selectionNote = rangeKey ? (rangeNotes[rangeKey] ?? "") : "";

  const setSelectionNote = useCallback(
    (text: string) => {
      if (!rangeKey) return;
      setRangeNotes((prev) => ({ ...prev, [rangeKey]: text }));
    },
    [rangeKey]
  );

  const goPrevMonth = useCallback(() => {
    setMonthIndex((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setMonthIndex((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const goToday = useCallback(() => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonthIndex(t.getMonth());
  }, []);

  const clearSelection = useCallback(() => {
    setRange({ start: null, end: null });
  }, []);

  const onDayClick = useCallback((dayKey: string) => {
    setRange((r) => {
      const { start, end } = r;
      if (start === null || end !== null) {
        return { start: dayKey, end: null };
      }
      if (compareDayKeys(dayKey, start) < 0) {
        return { start: dayKey, end: start };
      }
      return { start, end: dayKey };
    });
  }, []);

  return {
    year,
    monthIndex,
    currentMonthKey,
    goPrevMonth,
    goNextMonth,
    goToday,
    selectionStart,
    selectionEnd,
    rangeComplete,
    rangeKey,
    onDayClick,
    clearSelection,
    monthMemo,
    setMonthMemo,
    selectionNote,
    setSelectionNote,
    hydrated,
  };
}
