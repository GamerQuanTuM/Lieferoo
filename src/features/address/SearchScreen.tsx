import { useMemo, useState } from "react";
import { TopBar } from "@/shared/ui/TopBar";
import { useData } from "@/data/DataProvider";
import { searchAddresses } from "./addresses";
import { routes } from "@/shared/routes";
import { ChevronRightIcon, LocateIcon, SearchIcon } from "@/shared/ui/Icons";

/** As-is screen 01 · Delivery address search (customer app, English). */
export function SearchScreen() {
  const { addresses } = useData();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const results = useMemo(() => searchAddresses(addresses, query), [addresses, query]);
  const hasQuery = query.trim().length > 0;

  return (
    <main className="screen">
      <TopBar title="Delivery address" />
      <div className="pad">
        <div className="search">
          <span className="search__icon"><SearchIcon /></span>
          <label className="sr-only" htmlFor="q">Search address</label>
          <input
            id="q" className="search__input" type="search" inputMode="search" autoComplete="off"
            placeholder="Building name, road name or lot number"
            value={query} onChange={(e) => setQuery(e.target.value)}
          />
          {hasQuery && (
            <button type="button" className="search__clear" aria-label="Clear search" onClick={() => setQuery("")}>×</button>
          )}
        </div>
        <button type="button" className="row-btn" onClick={() => setNotice("Current location isn’t available in this demo. Please search by name.")}>
          <span className="row-btn__label"><LocateIcon /> Use my current location</span><ChevronRightIcon />
        </button>
        {notice && <p className="sub" role="status">{notice}</p>}
      </div>
      <div className="band" />
      <section className="pad" aria-live="polite">
        {!hasQuery && <SearchTips />}
        {hasQuery && results.length === 0 && (
          <div role="status">
            <p className="headline">No results for “{query.trim()}”</p>
            <p className="sub">Try fewer words, or search by neighborhood (e.g. Itaewon), road name + building number, neighborhood + lot number, or the building name. You can also type in Korean.</p>
          </div>
        )}
        {results.length > 0 && (
          <>
            <p className="sub">{results.length} result{results.length > 1 ? "s" : ""} for “{query.trim()}”</p>
            <ul className="list">
              {results.map((a) => (
                <li key={a.address_id}>
                  <a className="result" href={routes.address(a.address_id)}>
                    <strong>{a.building_name_en ?? a.road_address_en}</strong>
                    <span className="sub">{a.road_address_en}</span>
                    <span className="sub"><span className="tag">Lot</span> {a.jibun_address_en}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="sub label-gap">Can’t find the place?</p>
        <a className="btn btn--outline" href={routes.pin()}>Pin on Maps</a>
        <p className="sub footer-link"><a href={routes.riderList()}>Open the rider app (demo)</a></p>
      </section>
    </main>
  );
}

function SearchTips() {
  return (
    <div>
      <p className="headline">Search tips</p>
      <dl className="tips">
        <dt>Road name + building number</dt><dd>e.g. Donggyo-ro 51-gil 10</dd>
        <dt>Neighborhood + lot number</dt><dd>e.g. Yeonnam-dong 240-15</dd>
        <dt>Building name</dt><dd>e.g. Hanbit Village</dd>
      </dl>
    </div>
  );
}
