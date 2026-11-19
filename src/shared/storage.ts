/**
 * Safe browser storage. Storage can throw (private mode, blocked cookies, quota),
 * so every access is wrapped: the app keeps working without it.
 */
export const localStore = (): Storage | null => {
  try { return window.localStorage; } catch { return null; }
};

export const sessionStore = (): Storage | null => {
  try { return window.sessionStorage; } catch { return null; }
};

export function readJson<T>(store: Storage | null, key: string, fallback: T): T {
  try {
    const raw = store?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(store: Storage | null, key: string, value: unknown): void {
  try { store?.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked: ignore */ }
}
