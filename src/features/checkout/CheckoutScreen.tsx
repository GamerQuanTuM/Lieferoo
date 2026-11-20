import { useState } from "react";
import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { addressLineEn, getAddress, loadDraft } from "@/features/address";
import { splitFoodRequests } from "./food";
import { DEMO_FEE, DEMO_SUBTOTAL, buildOrder, encodeOrder, saveLocalOrder } from "@/features/orders";
import { PRESETS, PRESET_LABEL_EN, STORE_PRESETS, STORE_PRESET_LABEL_EN } from "@/features/translation";
import { NOTE_MAX_LENGTH, type RiderPreset, type StorePreset } from "@/domain/types";
import { navigate, routes } from "@/shared/routes";
import { CheckIcon } from "@/shared/ui/Icons";

const won = (n: number) => `₩${n.toLocaleString("en-US")}`;

/** As-is screen 03 · Checkout, request notes (customer app, English). */
export function CheckoutScreen() {
  const { addresses } = useData();
  const draft = loadDraft();
  const address = draft ? getAddress(addresses, draft.addressId) : undefined;

  const [storeText, setStoreText] = useState("");
  const [storePresets, setStorePresets] = useState<StorePreset[]>([]);
  const toggleStorePreset = (p: StorePreset) =>
    setStorePresets((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  const [noCutlery, setNoCutlery] = useState(false);
  const [preset, setPreset] = useState<RiderPreset | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!draft || !address) {
    return (
      <main className="screen">
        <TopBar title="Checkout" backHref={routes.search()} />
        <div className="pad" role="alert">
          <p className="headline">Choose a delivery address first</p>
          <p className="sub">We need an address before you can place the order.</p>
          <a className="btn btn--primary" href={routes.search()}>Search address</a>
        </div>
      </main>
    );
  }

  async function place() {
    if (!draft || !address || busy) return;
    setBusy(true);
    setError("");
    try {
      const order = await buildOrder({
        address, addressType: draft.addressType, detail: draft.detail,
        preset, riderText: note, storeText, noCutlery, storePresets,
      });
      saveLocalOrder(order);
      navigate(routes.placed(encodeOrder(order)));
    } catch {
      setError("Something went wrong placing the order. Please try again.");
      setBusy(false);
    }
  }

  const foodSplit = splitFoodRequests(note);
  function moveFood() {
    setStoreText((s) => [s.trim(), foodSplit.food].filter(Boolean).join(" ").slice(0, NOTE_MAX_LENGTH));
    setNote(foodSplit.rest);
  }

  const total = DEMO_SUBTOTAL + DEMO_FEE;
  return (
    <main className="screen">
      <TopBar title="Checkout" backHref={routes.address(address.address_id)} />
      <section className="pad deliver">
        <div>
          <p className="sub">Deliver to</p>
          <p className="headline">{address.building_name_en ?? address.road_address_en}</p>
          <p className="sub">{addressLineEn(address, draft.addressType)}{draft.detail ? ` · ${draft.detail}` : ""}</p>
        </div>
        <a className="change" href={routes.search()}>Change</a>
      </section>
      <div className="band" />
      <section className="pad">
        <h2 className="headline">Request to the store</h2>
        <div className="chips" role="group" aria-label="Quick request to the store">
          {STORE_PRESETS.map((p) => {
            const on = storePresets.includes(p);
            return (
              <button key={p} type="button" className={`chip${on ? " chip--on" : ""}`} aria-pressed={on} onClick={() => toggleStorePreset(p)}>
                {on && "✓ "}{STORE_PRESET_LABEL_EN[p]}
              </button>
            );
          })}
        </div>
        <label className="sr-only" htmlFor="store">Request to the store</label>
        <input id="store" className="input" placeholder="e.g. Not too spicy please" maxLength={NOTE_MAX_LENGTH} value={storeText} onChange={(e) => setStoreText(e.target.value)} />
        <p className="sub">The store sees the quick requests in Korean. Anything you type is shown in Korean with your original text alongside.</p>
        <label className="check">
          <input type="checkbox" checked={noCutlery} onChange={(e) => setNoCutlery(e.target.checked)} /> No disposable cutlery
        </label>
      </section>
      <div className="band" />
      <section className="pad">
        <h2 className="headline">Request to the rider</h2>
        <div className="chips" role="group" aria-label="Quick request">
          {PRESETS.map((p) => (
            <button key={p} type="button" className={`chip${preset === p ? " chip--on" : ""}`} aria-pressed={preset === p} onClick={() => setPreset(preset === p ? null : p)}>
              {preset === p && <CheckIcon />}{PRESET_LABEL_EN[p]}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="note">Note to the rider</label>
        <textarea
          id="note" className="input input--area" rows={4} maxLength={NOTE_MAX_LENGTH}
          placeholder="Gate code, entrance, landmarks… (optional)" value={note} onChange={(e) => setNote(e.target.value)}
        />
        <p className="counter">{note.length}/{NOTE_MAX_LENGTH}</p>
        {foodSplit.food && (
          <div className="notice notice--info" role="status">
            <p>“{foodSplit.food}” sounds like a food request. The rider can’t pass it to the shop.</p>
            <button type="button" className="btn btn--outline" onClick={moveFood}>Move to “Request to the store”</button>
          </div>
        )}
        <p className="sub">The rider reads this in Korean. Door codes are kept exactly as you type them. If we can’t translate it, the rider sees exactly what you wrote.</p>
      </section>
      <div className="band" />
      <section className="pad sums">
        <div><span>Order amount</span><span>{won(DEMO_SUBTOTAL)}</span></div>
        <div><span>Delivery fee</span><span>{won(DEMO_FEE)}</span></div>
        <p className="sub">Demo order: menu and payment are not part of this prototype.</p>
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      <div className="cta">
        <button type="button" className="btn btn--primary" onClick={place} disabled={busy}>
          {busy ? (note.trim() || storeText.trim() ? "Translating for your rider…" : "Placing order…") : `Place order · ${won(total)}`}
        </button>
      </div>
    </main>
  );
}
