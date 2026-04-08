"use client";

import type { CSSProperties, TransitionEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const OUT_MS = 480;
const IN_MS = 600;

const SHADOW_REST =
  "0 24px 60px -12px rgba(0, 0, 0, 0.16), 0 12px 28px -10px rgba(0, 0, 0, 0.1)";
const SHADOW_FLIP =
  "0 44px 88px -22px rgba(0, 0, 0, 0.34), 0 26px 52px -16px rgba(0, 0, 0, 0.2)";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 0.55, 0.2)";

type Segment = "idle" | "out-next" | "in-next" | "out-prev" | "in-prev";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const idleMotion: CSSProperties = {
  transform: "rotateX(0deg) translateY(0px)",
  transition: "none",
  boxShadow: SHADOW_REST,
};

/**
 * Two-phase 3D flip (ease-in away → swap month → ease-out settle). No mid-keyframe snap.
 */
export function useCalendarMonthFlip(
  goPrevMonth: () => void,
  goNextMonth: () => void
) {
  const [sheetMotion, setSheetMotion] = useState<CSSProperties>(idleMotion);
  const [flipping, setFlipping] = useState(false);
  const segmentRef = useRef<Segment>("idle");
  const prevRef = useRef(goPrevMonth);
  const nextRef = useRef(goNextMonth);
  const rafIn = useRef<number | null>(null);

  useEffect(() => {
    prevRef.current = goPrevMonth;
    nextRef.current = goNextMonth;
  }, [goPrevMonth, goNextMonth]);

  useEffect(() => {
    return () => {
      if (rafIn.current != null) cancelAnimationFrame(rafIn.current);
    };
  }, []);

  const snapIdle = useCallback(() => {
    segmentRef.current = "idle";
    setFlipping(false);
    setSheetMotion({
      transform: "rotateX(0deg) translateY(0px)",
      transition: "none",
      boxShadow: SHADOW_REST,
    });
  }, []);

  const onSheetTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;

      const seg = segmentRef.current;

      if (seg === "out-next") {
        nextRef.current();
        segmentRef.current = "in-next";
        setSheetMotion({
          transform: "rotateX(84deg) translateY(-8px)",
          transition: "none",
          boxShadow: SHADOW_FLIP,
        });
        rafIn.current = requestAnimationFrame(() => {
          rafIn.current = requestAnimationFrame(() => {
            setSheetMotion({
              transform: "rotateX(0deg) translateY(0px)",
              transition: `transform ${IN_MS}ms ${EASE_OUT}, box-shadow ${IN_MS}ms ease-out`,
              boxShadow: SHADOW_REST,
            });
          });
        });
        return;
      }

      if (seg === "in-next") {
        snapIdle();
        return;
      }

      if (seg === "out-prev") {
        prevRef.current();
        segmentRef.current = "in-prev";
        setSheetMotion({
          transform: "rotateX(-84deg) translateY(-8px)",
          transition: "none",
          boxShadow: SHADOW_FLIP,
        });
        rafIn.current = requestAnimationFrame(() => {
          rafIn.current = requestAnimationFrame(() => {
            setSheetMotion({
              transform: "rotateX(0deg) translateY(0px)",
              transition: `transform ${IN_MS}ms ${EASE_OUT}, box-shadow ${IN_MS}ms ease-out`,
              boxShadow: SHADOW_REST,
            });
          });
        });
        return;
      }

      if (seg === "in-prev") {
        snapIdle();
      }
    },
    [snapIdle]
  );

  const flipNext = useCallback(() => {
    if (segmentRef.current !== "idle") return;
    if (prefersReducedMotion()) {
      nextRef.current();
      return;
    }
    setFlipping(true);
    segmentRef.current = "out-next";
    setSheetMotion({
      transform: "rotateX(-76deg) translateY(-10px)",
      transition: `transform ${OUT_MS}ms ${EASE_IN}, box-shadow ${OUT_MS}ms ease-in`,
      boxShadow: SHADOW_FLIP,
    });
  }, []);

  const flipPrev = useCallback(() => {
    if (segmentRef.current !== "idle") return;
    if (prefersReducedMotion()) {
      prevRef.current();
      return;
    }
    setFlipping(true);
    segmentRef.current = "out-prev";
    setSheetMotion({
      transform: "rotateX(76deg) translateY(-10px)",
      transition: `transform ${OUT_MS}ms ${EASE_IN}, box-shadow ${OUT_MS}ms ease-in`,
      boxShadow: SHADOW_FLIP,
    });
  }, []);

  return { sheetMotion, onSheetTransitionEnd, flipNext, flipPrev, flipping };
}
