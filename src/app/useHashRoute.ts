import { useEffect, useState } from "react";

/** Reads `#/page/param` from the URL hash and re-renders on change. Returns ["page", "param"]. */
export function useHashRoute(): string[] {
  const read = () => window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [route, setRoute] = useState<string[]>(read);
  useEffect(() => {
    const onChange = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
