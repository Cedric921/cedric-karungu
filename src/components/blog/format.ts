/** "12 Oct 2026" in the page locale. */
export function formatDate(iso: string, locale: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}
