/** Korea time ISO string, same format as the sample data: 2026-10-12T20:41:00+09:00 */
export function toKstIso(d: Date): string {
  const kst = new Date(d.getTime() + 9 * 3600_000);
  return kst.toISOString().replace(/\.\d{3}Z$/, "") + "+09:00";
}
