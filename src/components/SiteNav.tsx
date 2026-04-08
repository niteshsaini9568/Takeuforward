import { SITE_LINKS } from "@/lib/siteLinks";
import Link from "next/link";

const navItemClass =
  "rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-white/80 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1da1f2]";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-300/80 bg-neutral-200/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-neutral-800 transition hover:text-[#1da1f2]"
        >
          Wall Calendar
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Primary"
        >
          <a
            href={SITE_LINKS.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={navItemClass}
          >
            Resume
          </a>
          <a
            href={SITE_LINKS.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className={navItemClass}
          >
            Portfolio
          </a>
          <a
            href={SITE_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className={navItemClass}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
