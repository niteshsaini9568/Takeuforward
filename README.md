# Wall Calendar — Interactive Next.js Component

A polished, **frontend-only** wall-calendar UI built for a frontend engineering challenge. It mimics a physical spiral-bound calendar on a wall: hero photo per month, geometric blue footer, notes area, date range selection, and a 3D month transition. All data stays in the browser (`localStorage`).

## Features

| Area | What it does |
|------|----------------|
| **Wall aesthetic** | Portrait sheet with wall nail, wire-O spiral binding (SVG), hero image, and flat blue polygon “wings” at the bottom of the photo |
| **Month navigation** | Previous / next with a **CSS 3D flip** (two-phase transition + `transitionend`), disabled while animating; **Today** jumps to the current month |
| **Range selection** | Click a **start** date, then an **end** date; clear visual states for start, end, middle, and single-day selection |
| **Notes** | Month memo + optional note for the selected range; both persist across reloads |
| **Holidays** | US fixed and floating holidays shown with a small marker on the grid |
| **Responsive** | Stacked layout on small screens; notes left / grid right on large screens |
| **Accessibility** | Descriptive `aria-label`s, nav button labels, `prefers-reduced-motion` respected in month flip |
| **SSR-safe dates** | Display locale fixed to **`en-US`** for labels that render on server and client (avoids hydration mismatches) |

## Tech stack

- **[Next.js](https://nextjs.org/)** `16.2.2` — App Router (`src/app`)
- **[React](https://react.dev/)** `19.2.4` — client components for interactivity
- **[TypeScript](https://www.typescriptlang.org/)** `^5`
- **[Tailwind CSS](https://tailwindcss.com/)** `^4` — utility styling + custom classes in `globals.css`
- **[next/image](https://nextjs.org/docs/pages/api-reference/components/image)** — optimized hero images from Unsplash (`next.config.ts` `remotePatterns`)

No backend, database, or external APIs for calendar data.

## Getting started

**Requirements:** Node.js 20+ (recommended; matches `@types/node` in the project).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run production server (after build)
npm run lint    # ESLint
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, Geist fonts, metadata
│   ├── page.tsx            # Renders WallCalendar
│   └── globals.css         # Tailwind + calendar theme (sheet, flip, notes lines, day states)
├── components/calendar/
│   ├── WallCalendar.tsx    # Composes layout, flip hook, nail + spiral above sheet
│   ├── CalendarHero.tsx    # Hero image + blue polygon overlay + month/year text
│   ├── CalendarSpiral.tsx # SVG wire-O coils + center V-hanger
│   ├── CalendarHeader.tsx  # Month label, prev/next, Today, Clear range
│   ├── CalendarGrid.tsx    # Monday-first grid, range + holiday UI
│   ├── NotesPanel.tsx      # Lined memo + range note fields
│   ├── useWallCalendarState.ts  # State + localStorage persistence
│   ├── useCalendarMonthFlip.ts  # 3D month change animation
│   ├── calendarHeroImages.ts    # Per-month Unsplash URLs + alt text
│   └── holidays.ts         # Holiday helpers
└── lib/calendar/
    └── dateUtils.ts        # Grid generation, range helpers, fixed en-US formatting
```

## Implementation notes (what was used to build it)

1. **Component split** — Hero, spiral, header, grid, and notes are separate modules; `WallCalendar` wires state and layout only.
2. **State** — `useWallCalendarState` holds current month, selection range, memos, and syncs to `localStorage` after hydration (microtask deferral avoids strict React lint issues around effects).
3. **Month flip** — `useCalendarMonthFlip` drives `transform` / `box-shadow` via inline styles and `onTransitionEnd` for a smooth out → swap month → in sequence; reduced motion skips the animation.
4. **Calendar math** — `getMonthGrid` in `dateUtils.ts` builds a **Monday-first** 6×7 grid; `formatDayAriaLabel` and related formatters use `CALENDAR_DISPLAY_LOCALE = "en-US"`.
5. **Styling** — Shared tokens and behaviors live in `globals.css` (e.g. `.calendar-sheet`, `.calendar-flip-stage`, range day classes, lined notes field).
6. **Images** — Remote images allowed only for `images.unsplash.com` in `next.config.ts`.

## Demo / submission checklist

For reviewers or a portfolio:

1. **Repo** — This README + source.
2. **Video (if required)** — Show range selection, notes (month + range), month flip, and resize between mobile and desktop widths.
3. **Live deploy (optional)** — Push to GitHub and deploy on [Vercel](https://vercel.com/) (zero-config for Next.js).

## License

Private project (`"private": true` in `package.json`). Adjust if you open-source it.
