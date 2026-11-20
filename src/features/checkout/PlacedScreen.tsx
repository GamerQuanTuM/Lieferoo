import { TopBar } from "@/shared/ui/TopBar";
import { decodeOrder } from "@/features/orders";
import { deliveryStatus, type DeliveryStatus } from "@/features/translation";
import { absoluteUrl, routes } from "@/shared/routes";

/** What the customer is told for each note — honest about partial or failed translation (the original always goes too). */
const STATUS_TEXT: Record<Exclude<DeliveryStatus, "empty">, string> = {
  translated: "translated to Korean",
  partial: "partly translated to Korean, with your original text",
  original: "your original text (we couldn’t translate it this time)",
  korean: "as you wrote it (already in Korean)",
};

/** Confirmation after checkout. Not in the as-is screens; it is the bridge to the rider screen. */
export function PlacedScreen({ token }: { token: string }) {
  const order = decodeOrder(token);
  const riderUrl = absoluteUrl(routes.rider(token));

  if (!order) {
    return (
      <main className="screen">
        <TopBar title="Order" backHref={routes.search()} />
        <div className="pad" role="alert">
          <p className="headline">This order link is invalid</p>
          <a className="btn btn--primary" href={routes.search()}>Start over</a>
        </div>
      </main>
    );
  }

  return (
    <main className="screen">
      <TopBar title="Order placed" />
      <div className="pad">
        <p className="title">Thank you!</p>
        <p className="sub">Order {order.order_id}</p>
        <p className="body">Your rider will see your address in Korean.</p>
        <ul className="sub status-list" aria-label="How your notes are delivered">
          {(["rider", "store"] as const).map((box) => {
            const req = box === "rider" ? order.rider_request : order.store_request;
            const status = deliveryStatus(req.text, req.translation);
            if (status === "empty") return null;
            return (
              <li key={box}>
                {box === "rider" ? "Note to the rider" : "Request to the store"}: {STATUS_TEXT[status]}
              </li>
            );
          })}
        </ul>
        <a className="btn btn--primary" href={routes.rider(token)}>See what the rider sees (한국어)</a>
        <p className="sub">Open the rider screen on another device with this link:</p>
        <input className="input" readOnly value={riderUrl} onFocus={(e) => e.currentTarget.select()} aria-label="Rider screen link" />
        <p className="sub footer-link"><a href={routes.search()}>Place another order</a></p>
      </div>
    </main>
  );
}
