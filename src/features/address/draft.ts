import type { AddressType } from "@/domain/types";
import { readJson, sessionStore, writeJson } from "@/shared/storage";

/** Address chosen on the search and details screens, kept for checkout. */
export interface Draft { addressId: string; addressType: AddressType; detail: string }

const KEY = "lieferoo.draft.v1";

export function loadDraft(): Draft | null {
  return readJson<Draft | null>(sessionStore(), KEY, null);
}

export function saveDraft(d: Draft): void {
  writeJson(sessionStore(), KEY, d);
}
