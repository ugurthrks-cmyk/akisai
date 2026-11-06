/** Must match the published renderer: whitespace alone does not activate MDX. */
export function hasLegacyMarkdown(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
