import { useState } from "react";
import { MapPlaceholder } from "@/shared/ui/MapPlaceholder";
import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { addressLineEn, checkBuildingNumber, getAddress } from "./addresses";
import { loadDraft, saveDraft } from "./draft";
import type { AddressType } from "@/domain/types";
import { navigate, routes } from "@/shared/routes";

/** As-is screen 02 · Address details (customer app, English). */
export function DetailsScreen({ addressId }: { addressId: string }) {
  const { addresses } = useData();
  const address = getAddress(addresses, addressId);
  const draft = loadDraft();
  const same = draft?.addressId === addressId;
  const [type, setType] = useState<AddressType>(same ? draft.addressType : "road");
  const [detail, setDetail] = useState(same ? draft.detail : "");

  if (!address) {
    return (
      <main className="screen">
        <TopBar title="Address details" backHref={routes.search()} />
        <div className="pad" role="alert">
          <p className="headline">We couldn’t find that address</p>
          <p className="sub">It may have been removed. Please search again.</p>
          <a className="btn btn--primary" href={routes.search()}>Search address</a>
        </div>
      </main>
    );
  }

  const warning = checkBuildingNumber(address, detail);

  function save() {
    saveDraft({ addressId, addressType: type, detail: detail.trim() });
    navigate(routes.checkout());
  }

  return (
    <main className="screen">
      <TopBar title="Address details" backHref={routes.search()} />
      <MapPlaceholder caption="Map preview (demo)" />
      <section className="pad">
        <h2 className="title">{address.building_name_en ?? address.road_address_en}</h2>
        <div className="seg" role="group" aria-label="Address type">
          {(["road", "jibun"] as const).map((t) => (
            <button key={t} type="button" className={`seg__btn${type === t ? " seg__btn--on" : ""}`} aria-pressed={type === t} onClick={() => setType(t)}>
              {t === "road" ? "도로명" : "지번"}
            </button>
          ))}
        </div>
        <p className="sub">{addressLineEn(address, type)}</p>
        <p className="sub">Not sure which to pick? Choose 도로명 (road name address). The rider also sees your other address.</p>

        <label className="label" htmlFor="detail">Apt, suite, unit, floor (optional)</label>
        <input
          id="detail" className={`input${warning ? " input--warn" : ""}`} placeholder="e.g. 1203, Bldg 101"
          value={detail} onChange={(e) => setDetail(e.target.value)} aria-describedby={warning ? "detail-warn" : undefined}
        />
        {warning && <p id="detail-warn" className="warn" role="alert">{warning}</p>}
      </section>
      <div className="cta">
        <button type="button" className="btn btn--primary" onClick={save}>Save address</button>
      </div>
    </main>
  );
}
