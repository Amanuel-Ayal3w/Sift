/**
 * The dashboard stores criteria as one freeform blob, but agent-service takes
 * a list — one line is one criterion, with bullet markers stripped.
 */
export function splitCriteria(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim().replace(/^[-*•]\s*/, '').trim())
    .filter((line) => line.length > 0);
}
