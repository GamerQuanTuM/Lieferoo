import { TopBar } from "@/shared/ui/TopBar";
import { decodeOrder } from "@/features/orders";
import { absoluteUrl, routes } from "@/shared/routes";

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
        <p className="body">Your rider will see your address and note in Korean.</p>
        <a className="btn btn--primary" href={routes.track(token)}>Track my order</a>
        <a className="btn btn--outline" href={routes.rider(token)}>See what the rider sees (한국어)</a>
        <a className="btn btn--outline" href={routes.store(token)}>See the store’s order screen (한국어)</a>
        {riderUrl && (
          <>
            <p className="sub">Open the rider screen on another device with this link:</p>
            <input className="input" readOnly value={riderUrl} onFocus={(e) => e.currentTarget.select()} aria-label="Rider screen link" />
          </>
        )}
        <p className="sub footer-link"><a href={routes.search()}>Place another order</a></p>
      </div>
    </main>
  );
}
