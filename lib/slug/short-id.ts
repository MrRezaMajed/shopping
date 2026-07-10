export function secureShortId(length = 6): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, length);
}