import { Capacitor } from "@capacitor/core";

/**
 * Single source of truth for URLs (hash routing, so it works on any static host).
 * Screens build links with `routes.*` instead of hard-coding "#/...".
 */
export const routes = {
  search: () => "#/",
  address: (addressId: string) => `#/address/${addressId}`,
  pin: () => "#/pin",
  checkout: () => "#/checkout",
  placed: (token: string) => `#/placed/${token}`,
  track: (token: string) => `#/track/${token}`,
  store: (idOrToken: string) => `#/store/${idOrToken}`,
  riderList: () => "#/rider",
  /** `idOrToken` is a sample/local order id, or a share token (see orders/shareToken). */
  rider: (idOrToken: string) => `#/rider/${idOrToken}`,
} as const;

export function navigate(hash: string): void {
  window.location.hash = hash;
}

/**
 * Full shareable URL for a hash route, or `null` inside the Android app: its origin is
 * https://localhost, which is useless on another device, so the website-only link is hidden there.
 */
export function absoluteUrl(hash: string): string | null {
  if (Capacitor.isNativePlatform()) return null;
  return `${window.location.origin}${window.location.pathname}${hash}`;
}
