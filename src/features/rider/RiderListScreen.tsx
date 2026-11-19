import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { getDeliveredAt, listLocalOrders } from "@/features/orders";
import { PRESET_LABEL_KO } from "@/features/translation";
import type { Order } from "@/domain/types";
import { routes } from "@/shared/routes";

/** Rider app order list (demo entry point so the PM can open any sample or new order). */
export function RiderListScreen() {
  const { samples } = useData();
  const local = listLocalOrders();
  const ids = new Set(local.map((o) => o.order_id));
  const all: Order[] = [...local, ...samples.filter((o) => !ids.has(o.order_id))];

  return (
    <main className="screen" lang="ko">
      <TopBar title="배달 목록" backHref={routes.search()} />
      <p className="sub pad">데모용 라이더 앱입니다. 주문을 눌러 상세를 확인하세요.</p>
      <ul className="list pad">
        {all.map((o) => {
          const delivered = o.status === "delivered" || !!getDeliveredAt(o.order_id);
          return (
            <li key={o.order_id}>
              <a className="result" href={routes.rider(o.order_id)}>
                <span className="row">
                  <strong>{o.delivery_address.building_name_ko ?? o.delivery_address.road_address_ko}</strong>
                  <span className={`pill${delivered ? " pill--done" : ""}`}>{delivered ? "배달 완료" : "배달 중"}</span>
                </span>
                <span className="sub">{o.order_id} · {o.store.name_ko}</span>
                {o.rider_request.preset && <span className="sub">{PRESET_LABEL_KO[o.rider_request.preset]}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
