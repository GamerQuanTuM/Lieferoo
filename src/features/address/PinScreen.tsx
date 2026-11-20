import { useMemo, useState } from "react";
import { MapPlaceholder } from "@/shared/ui/MapPlaceholder";
import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { addressBounds, addressLineEn, nearestAddress } from "./addresses";
import { navigate, routes } from "@/shared/routes";

/** New screen "Confirming Address": pin the place on a map when search finds nothing (demo, no real map). */
export function PinScreen() {
  const { addresses } = useData();
  const bounds = useMemo(() => addressBounds(addresses), [addresses]);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 }); // 0..1 inside the map

  const lat = bounds.maxLat - pos.y * (bounds.maxLat - bounds.minLat);
  const lng = bounds.minLng + pos.x * (bounds.maxLng - bounds.minLng);
  const address = nearestAddress(addresses, lat, lng);

  function place(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    });
  }

  return (
    <main className="screen">
      <TopBar title="Address" backHref={routes.search()} />
      <div className="pinmap" onPointerDown={place} role="application" aria-label="Map. Tap to move the pin.">
        <MapPlaceholder tall noPin caption="Tap the map to move the pin" />
        <svg className="pinmap__pin" viewBox="-14 -36 28 38" style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }} aria-hidden="true">
          <path d="M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0Z" fill="var(--oo-neutral-900)" />
          <circle cx="0" cy="-22" r="5" fill="#fff" />
        </svg>
      </div>
      <section className="pad">
        <p className="sub">Address</p>
        <div className="box" aria-live="polite">
          {address ? (
            <>
              <strong>{address.building_name_en ?? address.road_address_en}</strong>
              <span className="sub">{addressLineEn(address, "road")}</span>
            </>
          ) : (
            <span className="sub">No address found here. Move the pin.</span>
          )}
        </div>
      </section>
      <div className="cta">
        <button type="button" className="btn btn--primary" disabled={!address} onClick={() => address && navigate(routes.address(address.address_id))}>
          Confirm Location
        </button>
      </div>
    </main>
  );
}
