import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Address, Order } from "@/domain/types";

/** Sample data used by tests: the same files the app loads (public/data). Vitest runs from the repo root. */
const read = <T>(file: string): T => JSON.parse(readFileSync(join(process.cwd(), "public/data", file), "utf8")) as T;

export const addresses = read<{ addresses: Address[] }>("B1_sample_addresses.json").addresses;
export const samples = read<{ orders: Order[] }>("B2_sample_orders.json").orders;
export const addressById = (id: string): Address => {
  const a = addresses.find((x) => x.address_id === id);
  if (!a) throw new Error(`fixture ${id} missing`);
  return a;
};
