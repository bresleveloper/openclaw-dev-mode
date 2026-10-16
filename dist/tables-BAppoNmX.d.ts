//#region packages/markdown-core/src/types.d.ts
/** Table rendering modes used when markdown tables need plaintext-safe output. */
type MarkdownTableMode = "off" | "bullets" | "code" | "block";
//#endregion
//#region packages/markdown-core/src/tables.d.ts
/** Convert only parsed table ranges; unrelated Markdown retains its original source bytes. */
declare function convertMarkdownTables(markdown: string, mode: MarkdownTableMode): string;
//#endregion
export { MarkdownTableMode as n, convertMarkdownTables as t };