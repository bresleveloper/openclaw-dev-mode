//#region packages/terminal-core/src/ansi.d.ts
declare function stripAnsi(input: string): string;
declare function splitGraphemes(input: string): string[];
/**
 * Sanitize a value for safe interpolation into log messages.
 * Strips ANSI escape sequences, C0/C1 control characters, and DEL to
 * prevent log forging / terminal escape injection (CWE-117).
 */
declare function sanitizeForLog(v: string): string;
declare function visibleWidth(input: string): number;
/**
 * Truncate to at most `maxWidth` visible columns, dropping whole grapheme
 * clusters that would overflow while preserving ANSI sequences verbatim
 * (they have zero visible width). A single wide grapheme that cannot fit the
 * remaining budget is dropped rather than emitted partially, so the result is
 * always `visibleWidth(result) <= maxWidth`. Callers that need a fixed width
 * pad the (possibly short) remainder themselves.
 */
declare function truncateToVisibleWidth(input: string, maxWidth: number): string;
//#endregion
export { visibleWidth as a, truncateToVisibleWidth as i, splitGraphemes as n, stripAnsi as r, sanitizeForLog as t };