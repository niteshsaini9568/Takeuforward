"use client";

/**
 * Wire-O spiral binding that matches the reference photograph:
 * - Dense Ω-shaped coils (open at bottom, arch upward)
 * - Left + right runs separated by a center V-bail over the wall nail
 * - Drop-shadow on coils for depth
 */

const VB_W = 520;
const ROD_Y = 24;   // top of binding rod in viewBox units
const ROD_H = 5;    // rod height
const R = 9;        // coil radius
const SPACING = 16.5; // center-to-center between coils
const N = 12;       // coils per side
const GAP = 50;     // clear gap at center for the V-bail
const MID = VB_W / 2; // 260

// Left run: starts near center, grows outward
const leftCX = Array.from({ length: N }, (_, i) => MID - GAP / 2 - i * SPACING);
// Right run: starts near center, grows outward
const rightCX = Array.from({ length: N }, (_, i) => MID + GAP / 2 + i * SPACING);

const rodMidY = ROD_Y + ROD_H / 2;

function Coil({ cx }: { cx: number }) {
  // Ω arc: from (cx−R, rodMidY) counterclockwise (sweep=0) → (cx+R, rodMidY)
  // This traces the upper semicircle (arch above the rod)
  const d1 = `M ${cx - R},${rodMidY} A ${R},${R},0,0,0,${cx + R},${rodMidY}`;
  // Inner highlight arc (slightly smaller + shifted up) for metallic tube look
  const hr = R - 2.5;
  const d2 = `M ${cx - hr},${rodMidY - 2} A ${hr},${hr},0,0,0,${cx + hr},${rodMidY - 2}`;

  return (
    <g filter="url(#cShadow)">
      <path d={d1} fill="none" stroke="#1e1e1e" strokeWidth={3.2} strokeLinecap="round" />
      <path d={d2} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.1} strokeLinecap="round" />
    </g>
  );
}

function VBail() {
  const spread = 18;
  const loopR = 4.5;
  const topY = 5;
  // V-legs go from the rod up to a circular loop at the top
  const legBotY = ROD_Y + ROD_H + 1;

  return (
    <g filter="url(#cShadow)">
      {/* Left leg */}
      <line
        x1={MID - spread} y1={legBotY}
        x2={MID - loopR} y2={topY + loopR}
        stroke="#1e1e1e" strokeWidth={2} strokeLinecap="round"
      />
      {/* Circle loop at top (the part that hangs on the nail) */}
      <circle cx={MID} cy={topY + loopR} r={loopR} fill="none" stroke="#1e1e1e" strokeWidth={2} />
      {/* Highlight on loop */}
      <circle cx={MID - 1.2} cy={topY + loopR - 1.5} r={loopR * 0.45} fill="none"
              stroke="rgba(255,255,255,0.22)" strokeWidth={0.8} />
      {/* Right leg */}
      <line
        x1={MID + loopR} y1={topY + loopR}
        x2={MID + spread} y2={legBotY}
        stroke="#1e1e1e" strokeWidth={2} strokeLinecap="round"
      />
    </g>
  );
}

export function CalendarSpiral() {
  return (
    <div aria-hidden className="relative w-full">
      <svg
        viewBox={`0 0 ${VB_W} ${ROD_Y + ROD_H + 4}`}
        className="block w-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="cShadow" x="-50%" y="-60%" width="200%" height="220%">
            <feDropShadow dx="0" dy="1.8" stdDeviation="1.0" floodOpacity="0.45" />
          </filter>
          <filter id="rodShadow" x="-5%" y="-40%" width="110%" height="180%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="1.6" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Binding rod (full width) */}
        <rect
          x={0} y={ROD_Y} width={VB_W} height={ROD_H} rx={ROD_H / 2}
          fill="#141414" filter="url(#rodShadow)"
        />

        {/* Coil runs */}
        {leftCX.map((cx, i) => <Coil key={`L${i}`} cx={cx} />)}
        <VBail />
        {rightCX.map((cx, i) => <Coil key={`R${i}`} cx={cx} />)}
      </svg>
    </div>
  );
}
