/** Grayscale map illustration like the as-is screens. A real map is out of scope (brief §3). */
export function MapPlaceholder({ route = false, caption }: { route?: boolean; caption?: string }) {
  return (
    <div className="map" role="img" aria-label={route ? "Route preview (demo)" : "Pin preview (demo)"}>
      <svg viewBox="0 0 375 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="375" height="150" fill="var(--oo-neutral-200)" />
        <rect x="36" y="20" width="64" height="38" rx="4" fill="var(--oo-neutral-300)" />
        <rect x="196" y="62" width="52" height="34" rx="4" fill="var(--oo-neutral-300)" />
        <rect x="306" y="78" width="46" height="30" rx="4" fill="var(--oo-neutral-300)" />
        <path d="M0 62 L375 40" stroke="#fff" strokeWidth="9" />
        <path d="M118 0 L166 150" stroke="#fff" strokeWidth="9" />
        <path d="M262 0 L300 150" stroke="var(--oo-neutral-100)" strokeWidth="6" />
        {route ? (
          <>
            <polyline points="70,112 70,86 165,74 182,48 300,38" fill="none" stroke="var(--oo-neutral-600)" strokeWidth="4" />
            <rect x="62" y="108" width="16" height="16" rx="3" fill="var(--oo-neutral-700)" />
            <Pin x={300} y={38} />
          </>
        ) : (
          <Pin x={187} y={66} />
        )}
      </svg>
      {caption && <span className="map__caption">{caption}</span>}
    </div>
  );
}

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0Z" fill="var(--oo-neutral-900)" />
      <circle cx="0" cy="-22" r="5" fill="#fff" />
    </g>
  );
}
