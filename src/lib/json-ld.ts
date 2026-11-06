/** Serialize JSON-LD without allowing CMS text to terminate the script element. */
export function serializeJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
