//#region packages/normalization-core/src/utf16-slice.d.ts
/** Moves a chunk boundary away from the middle of a UTF-16 surrogate pair. */
declare function avoidTrailingHighSurrogateBreak(text: string, start: number, end: number): number;
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
declare function truncateUtf16Safe(input: string, maxLen: number): string;
//#endregion
export { truncateUtf16Safe as n, avoidTrailingHighSurrogateBreak as t };