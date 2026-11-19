/**
 * Single source of truth for URLs (hash routing, so it works on any static host).
 * Screens build links with `routes.*` instead of hard-coding "#/...".
 */
export const routes = {
  search: () => "#/",
  address: (addressId: string) => `#/address/${addressId}`,
  checkout: () => "#/checkout",
  placed: (token: string) => `#/placed/${token}`,
  riderList: () => "#/rider",
  /** `idOrToken` is a sample/local order id, or a share token (see orders/shareToken). */
  rider: (idOrToken: string) => `#/rider/${idOrToken}`,
} as const;

export function navigate(hash: string): void {
  window.location.hash = hash;
}

/** Full shareable URL for a hash route on the current origin. */
export function absoluteUrl(hash: string): string {
  return `${window.location.origin}${window.location.pathname}${hash}`;
}
