"use client";

import { CALENDAR_DISPLAY_LOCALE } from "@/lib/calendar/dateUtils";
import Image from "next/image";
import { useId } from "react";
import { CALENDAR_HERO_IMAGES } from "./calendarHeroImages";

/** Reference blue — bright sky blue, flat fill (no gradient per reference design). */
const BLUE = "#1fb3f5";
const BLUE_DARK = "#138fc5"; // slightly deeper for right shape (shadow side)

type CalendarHeroProps = {
  monthIndex: number;
  year: number;
};

export function CalendarHero({ monthIndex, year }: CalendarHeroProps) {
  const uid = useId().replace(/:/g, "");
  const { src, alt } = CALENDAR_HERO_IMAGES[monthIndex % CALENDAR_HERO_IMAGES.length];
  const monthUpper = new Date(year, monthIndex, 1)
    .toLocaleString(CALENDAR_DISPLAY_LOCALE, { month: "long" })
    .toUpperCase();

  /**
   * Two flat-polygon blue triangular masses at the bottom of the photo.
   *
   * ViewBox: 0 0 1200 290  (covers the bottom ~36% of the hero)
   * y=0 = top of the SVG (upper edge of the blue transition zone in the photo)
   * y=290 = bottom of photo → meets the white calendar body
   *
   * Left  quad: 0,290  0,32  492,216  600,290
   * Right quad: 1200,290  1200,32  708,216  600,290
   *
   * Gap at y=216: x=492 to x=708 → 216 units (18 % of 1200) → photo visible here.
   * Both shapes taper to a shared point at (600, 290) at the very bottom.
   */
  return (
    <div className="relative w-full overflow-hidden bg-[#b8c4cc]">
      {/* Photo — aspect [4/3] to match portrait reference shape */}
      <div className="relative aspect-4/3 w-full min-h-[200px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 680px"
          priority
        />

        {/* Very light vignette — keep the photo bright like the reference */}
        <div
          className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/8"
          aria-hidden
        />

        {/* Two flat triangular blue shapes (no curves, no gradients — matches print reference) */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 h-[38%] min-h-[88px] w-full"
          viewBox="0 0 1200 290"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-lg`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={BLUE} />
              <stop offset="100%" stopColor={BLUE} stopOpacity={0.95} />
            </linearGradient>
            <linearGradient id={`${uid}-rg`} x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={BLUE_DARK} />
              <stop offset="100%" stopColor={BLUE_DARK} stopOpacity={0.95} />
            </linearGradient>
          </defs>

          {/* Left triangular mass: rises from left edge, sharp rightward tip, meets center-bottom */}
          <polygon points={`0,290 0,32 492,216 600,290`} fill={`url(#${uid}-lg)`} />

          {/* Right triangular mass: mirror, slightly deeper blue for visual separation */}
          <polygon points={`1200,290 1200,32 708,216 600,290`} fill={`url(#${uid}-rg)`} />
        </svg>

        {/* Year + month text — right side, over the photo / right blue mass */}
        <div
          className="absolute z-10 text-right text-white"
          style={{ bottom: "13%", right: "4.5%" }}
        >
          <p
            className="font-sans font-bold tracking-[0.32em] text-white/95"
            style={{ fontSize: "clamp(0.85rem, 2.2vw, 1.15rem)" }}
          >
            {year}
          </p>
          <p
            className="mt-1 font-sans font-extrabold leading-none tracking-[0.12em] text-white"
            style={{ fontSize: "clamp(1.3rem, 3.6vw, 2rem)" }}
          >
            {monthUpper}
          </p>
        </div>
      </div>
    </div>
  );
}
