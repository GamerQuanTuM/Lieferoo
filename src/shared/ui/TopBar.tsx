import type { ReactNode } from "react";

export function TopBar({ title, backHref, right }: { title: string; backHref?: string; right?: ReactNode }) {
  return (
    <header className="topbar">
      {backHref ? <a className="topbar__back" href={backHref} aria-label="Back">‹</a> : <span />}
      <h1 className="topbar__title">{title}</h1>
      <div className="topbar__right">{right}</div>
    </header>
  );
}
