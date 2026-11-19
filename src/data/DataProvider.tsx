import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Address, Order } from "@/domain/types";

export interface AppData { addresses: Address[]; samples: Order[] }

type State = { status: "loading" } | { status: "error" } | { status: "ready"; data: AppData };

const Ctx = createContext<AppData | null>(null);

async function getJson<T>(file: string): Promise<T> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${file}`);
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  return (await res.json()) as T;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(() => {
    setState({ status: "loading" });
    Promise.all([
      getJson<{ addresses: Address[] }>("B1_sample_addresses.json"),
      getJson<{ orders: Order[] }>("B2_sample_orders.json"),
    ])
      .then(([a, o]) => setState({ status: "ready", data: { addresses: a.addresses, samples: o.orders } }))
      .catch(() => setState({ status: "error" }));
  }, []);

  useEffect(load, [load]);

  if (state.status === "loading") return <main className="screen pad" role="status">Loading…</main>;
  if (state.status === "error") {
    return (
      <main className="screen pad" role="alert">
        <p className="headline">Couldn’t load the data</p>
        <p className="sub">Check your connection and try again.</p>
        <button className="btn btn--primary" onClick={load}>Retry</button>
      </main>
    );
  }
  return <Ctx.Provider value={state.data}>{children}</Ctx.Provider>;
}

export function useData(): AppData {
  const v = useContext(Ctx);
  if (!v) throw new Error("useData outside DataProvider");
  return v;
}
