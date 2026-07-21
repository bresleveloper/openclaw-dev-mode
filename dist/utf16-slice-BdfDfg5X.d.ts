//#region packages/normalization-core/src/utf16-slice.d.ts
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
declare function sliceUtf16Safe(input: string, start: number, end?: number): string;
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
declare function truncateUtf16Safe(input: string, maxLen: number): string;
//#endregion
export { truncateUtf16Safe as n, sliceUtf16Safe as t };