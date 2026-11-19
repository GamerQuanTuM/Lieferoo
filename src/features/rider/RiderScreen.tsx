import { useEffect, useState } from "react";
import { MapPlaceholder } from "@/shared/ui/MapPlaceholder";
import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { markDelivered, resolveOrder, toKstIso } from "@/features/orders";
import { PRESET_LABEL_KO, normalizeDetail, translateRiderNote } from "@/features/translation";
import type { Translation } from "@/domain/types";
import { routes } from "@/shared/routes";

/** As-is screen 04 · Rider order detail (rider app, Korean), plus the translated information. */
export function RiderScreen({ param }: { param: string }) {
  const { samples } = useData();
  const [version, setVersion] = useState(0); // bump after "delivered" so the order is re-resolved
  const order = resolveOrder(param, samples);
  void version;

  const note = order?.rider_request.text ?? "";
  const stored = order?.rider_request.translation;
  const [computed, setComputed] = useState<Translation | null>(null);

  useEffect(() => {
    let alive = true;
    setComputed(null);
    if (note && !stored) translateRiderNote(note).then((t) => alive && setComputed(t));
    return () => { alive = false; };
  }, [note, stored]);

  if (!order) {
    return (
      <main className="screen" lang="ko">
        <TopBar title="배달 상세" backHref={routes.riderList()} />
        <div className="pad" role="alert">
          <p className="headline">주문 정보를 불러올 수 없어요</p>
          <p className="sub">링크가 잘못되었거나 주문이 없어요. 고객에게 다시 확인해 주세요.</p>
          <a className="btn btn--outline" href={routes.riderList()}>배달 목록으로</a>
        </div>
      </main>
    );
  }

  const a = order.delivery_address;
  const tr = stored ?? computed;
  const doorCodes = tr?.clues.filter((c) => c.type === "door_code") ?? [];
  const otherClues = tr?.clues.filter((c) => c.type !== "door_code") ?? [];
  const detailKo = a.detail_ko ?? normalizeDetail(a.detail);
  const preset = order.rider_request.preset;
  const delivered = order.status === "delivered";
  const isRoad = a.address_type === "road";
  const hasRequest = !!preset || !!note;
  const itemCount = order.items.reduce((n, i) => n + i.qty, 0);
  const pickup = order.picked_up_at ? order.picked_up_at.slice(11, 16) : null;

  function complete() {
    markDelivered(order!.order_id, toKstIso(new Date()));
    setVersion((v) => v + 1);
  }

  return (
    <main className="screen screen--rider" lang="ko">
      <TopBar title="배달 상세" backHref={routes.riderList()} right={<span className={`pill${delivered ? " pill--done" : ""}`}>{delivered ? "배달 완료" : "배달 중"}</span>} />
      <MapPlaceholder route />
      <section className="pad">
        <div className="row sub"><span>주문번호 {order.order_id}</span>{pickup && <span>픽업 {pickup}</span>}</div>
        <p className="sub">도착지 · {isRoad ? "도로명" : "지번"}</p>
        <p className="title">{a.building_name_ko ?? (isRoad ? a.road_address_ko : a.jibun_address_ko)}</p>
        <p className="body">{isRoad ? a.road_address_ko : a.jibun_address_ko}</p>
        <p className="sub">{isRoad ? `지번 · ${a.jibun_address_ko}` : `도로명 · ${a.road_address_ko}`}</p>

        <p className="sub label-gap">상세주소</p>
        {a.detail ? (
          <>
            <p className="title">{detailKo ?? a.detail}</p>
            {detailKo && detailKo !== a.detail && <p className="sub">고객 입력: <span lang="en">{a.detail}</span></p>}
          </>
        ) : (
          <p className="body">상세주소 없음 (건물 앞에서 고객에게 전화해 주세요)</p>
        )}
      </section>
      <div className="band" />
      <section className="pad">
        <p className="sub">요청사항</p>
        {!hasRequest && <p className="body">요청사항 없음</p>}
        {preset && <p className="headline">{PRESET_LABEL_KO[preset]}</p>}

        {doorCodes.length > 0 && (
          <div className="codes" role="note" aria-label="출입 비밀번호">
            {doorCodes.map((c) => (
              <div key={c.value}><span className="sub">{c.label_ko}</span> <strong className="code">{c.value}</strong></div>
            ))}
          </div>
        )}
        {otherClues.length > 0 && (
          <ul className="clues">{otherClues.map((c) => <li key={c.type + c.value} className="clue">{c.value}</li>)}</ul>
        )}
        {tr?.text_ko && <p className="body">{tr.text_ko}</p>}
        {note && (
          <div className="original">
            <p className="sub">고객 원문{tr ? ` (${langName(tr.source_lang)})` : ""}</p>
            <p lang={tr?.source_lang === "other" || !tr ? undefined : tr.source_lang}>{note}</p>
          </div>
        )}
        {note && tr && tr.confidence === "low" && (
          <p className="notice" role="note">
            {tr.text_ko ? "일부만 번역되었어요. 원문을 꼭 확인해 주세요." : "자동 번역이 되지 않았어요. 원문을 확인해 주세요."}
          </p>
        )}
      </section>
      <div className="band" />
      <section className="pad">
        <div className="row"><span className="sub">메뉴 {itemCount}개 · {order.total_krw.toLocaleString("ko-KR")}원</span><span className="sub strong">{order.payment.status === "paid" ? "선결제 완료" : "현장 결제"}</span></div>
        <div className="two">
          <a className="btn btn--outline" href={`tel:${order.customer.safe_number.replace(/-/g, "")}`}>고객에게 전화</a>
          <a className="btn btn--outline" href={`https://map.kakao.com/link/to/${encodeURIComponent(a.building_name_ko ?? "도착지")},${a.location.lat},${a.location.lng}`} target="_blank" rel="noreferrer">길 안내</a>
        </div>
        <button type="button" className="btn btn--primary" onClick={complete} disabled={delivered}>
          {delivered ? "배달 완료됨" : "배달 완료"}
        </button>
      </section>
    </main>
  );
}

const LANG: Record<string, string> = { en: "영어", ja: "일본어", zh: "중국어", vi: "베트남어", ko: "한국어", other: "기타" };
const langName = (l: string) => LANG[l] ?? l;
