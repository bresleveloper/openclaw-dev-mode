//#region packages/ai/src/utils/sanitize-unicode.d.ts
/** Remove unpaired surrogates rejected by providers; preserve valid Unicode pairs. */
declare function sanitizeSurrogates(text: string): string;
//#endregion
export { sanitizeSurrogates as t };