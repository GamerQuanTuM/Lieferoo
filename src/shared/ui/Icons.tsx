import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
};

export const BackIcon = () => <svg {...base}><path d="M15 5l-7 7 7 7" /></svg>;
export const ChevronRightIcon = () => <svg {...base} width={20} height={20}><path d="M9 5l7 7-7 7" /></svg>;
export const SearchIcon = () => <svg {...base} width={20} height={20}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>;
export const LocateIcon = () => <svg {...base}><circle cx="12" cy="12" r="3.5" /><circle cx="12" cy="12" r="8" /><path d="M12 1v3M12 20v3M1 12h3M20 12h3" /></svg>;
export const CheckIcon = () => <svg {...base} width={16} height={16} strokeWidth={3}><path d="M5 12l5 5 9-10" /></svg>;
