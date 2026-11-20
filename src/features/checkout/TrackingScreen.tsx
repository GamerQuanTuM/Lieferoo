import { useState } from "react";
import { MapPlaceholder } from "@/shared/ui/MapPlaceholder";
import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { resolveOrder } from "@/features/orders";
import { PRESET_LABEL_EN } from "@/features/translation";
import { routes } from "@/shared/routes";

const STEPS = ["Order Placed", "Accepted", "Pickup", "Delivered"];

/** New screen "Order Tracking" (customer, English). Progress comes from the order status; the ETA is a demo value. */
export function TrackingScreen({ token }: { token: string }) {
  const { samples } = useData();
  const order = resolveOrder(token, samples);
  const [notice, setNotice] = useState("");

  if (!order) {
    return (
      <main className="screen">
        <TopBar title="Order Tracking" backHref={routes.search()} />
        <div className="pad" role="alert">
          <p className="headline">We couldn’t find that order</p>
          <a className="btn btn--primary" href={routes.search()}>Start over</a>
        </div>
      </main>
    );
  }

  const delivered = order.status === "delivered";
  const done = delivered ? 4 : order.picked_up_at ? 3 : 2; // steps completed
  const { preset, text } = order.rider_request;

  return (
    <main className="screen">
      <TopBar title="Order Tracking" backHref={routes.placed(token)} />
      <MapPlaceholder tall route caption={order.delivery_address.building_name_en ?? order.delivery_address.road_address_en} />
      <section className="pad">
        <div className="card">
          <div className="row">
            <strong className="headline">{delivered ? "Delivered" : "Out for delivery"}</strong>
            {!delivered && <strong>12 min</strong>}
          </div>
          <ol className="steps" aria-label="Order progress">
            {STEPS.map((label, i) => (
              <li key={label} className={`step${i < done ? " step--on" : ""}`} aria-current={i === done - 1 ? "step" : undefined}>
                <span className="step__dot" />
                <span className="step__label">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card">
          <div className="rider">
            <span className="avatar" aria-hidden="true">{order.rider.name_masked.slice(0, 1)}</span>
            <strong className="headline">{order.rider.name_masked}</strong>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => setNotice("Messaging isn’t available in this demo. The rider already sees your note below.")}>
            Message
          </button>
          {notice && <p className="sub" role="status">{notice}</p>}
        </div>

        <h2 className="headline label-gap">Request to rider</h2>
        {!preset && !text && <p className="sub">No request.</p>}
        {preset && <div className="chips"><span className="chip chip--on">{PRESET_LABEL_EN[preset]}</span></div>}
        {text && <div className="box"><p className="body">{text}</p></div>}
      </section>
    </main>
  );
}
