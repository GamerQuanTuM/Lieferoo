import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { resolveOrder } from "@/features/orders";
import { STORE_PRESET_LABEL_KO } from "@/features/translation";
import { routes } from "@/shared/routes";

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

/**
 * New screen "Order (Store View)": what the shop sees (Korean).
 * Quick requests (chips) show their fixed Korean label; typed text shows the Korean translation made at checkout,
 * always with the customer's original next to it (and a notice when only part could be translated).
 */
export function StoreOrderScreen({ param }: { param: string }) {
  const { samples } = useData();
  const order = resolveOrder(param, samples);

  if (!order) {
    return (
      <main className="screen" lang="ko">
        <TopBar title="주문" backHref={routes.search()} />
        <div className="pad" role="alert">
          <p className="headline">주문 정보를 불러올 수 없어요</p>
          <p className="sub">링크가 잘못되었거나 주문이 없어요.</p>
        </div>
      </main>
    );
  }

  const { text, no_cutlery, presets = [], translation: tr } = order.store_request;
  const number = order.order_id.split("-").pop();

  return (
    <main className="screen" lang="ko">
      <TopBar title={`주문 #${number}`} backHref={routes.placed(param)} />
      <ul className="list pad">
        {order.items.map((it) => (
          <li key={it.name_ko} className="item">
            <span className="item__img" aria-hidden="true" />
            <div>
              <p className="headline">{it.name_ko}{it.qty > 1 ? ` × ${it.qty}` : ""}</p>
              <p className="body">{won(it.unit_price_krw * it.qty)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="band" />
      <section className="pad">
        <p className="sub">가게 요청사항</p>
        {!text && !no_cutlery && presets.length === 0 && <p className="body">요청사항 없음</p>}
        {presets.map((p) => <p key={p} className="headline">{STORE_PRESET_LABEL_KO[p] ?? p}</p>)}
        {no_cutlery && <p className="headline">일회용 수저 안 받음</p>}
        {text && tr?.text_ko && tr.source_lang !== "ko" && <p className="body">{tr.text_ko}</p>}
        {text && (
          <div className="original">
            <p className="sub">고객 원문</p>
            <p lang={tr && tr.source_lang !== "other" ? tr.source_lang : undefined}>{text}</p>
          </div>
        )}
        {text && tr && tr.source_lang !== "ko" && tr.confidence === "low" && (
          <p className="notice" role="note">
            {tr.text_ko ? "일부만 번역되었어요. 원문을 꼭 확인해 주세요." : "자동 번역이 되지 않았어요. 원문을 확인해 주세요."}
          </p>
        )}
        {text && !tr && <p className="notice" role="note">번역이 없는 주문이에요. 원문을 확인해 주세요.</p>}
        <p className="sub label-gap">합계 {won(order.subtotal_krw)} · {order.payment.status === "paid" ? "선결제 완료" : "현장 결제"}</p>
      </section>
    </main>
  );
}
