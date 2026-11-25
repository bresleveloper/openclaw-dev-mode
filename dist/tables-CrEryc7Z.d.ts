/** Table rendering modes used when markdown tables need plaintext-safe output. */
type MarkdownTableMode = "off" | "bullets" | "code" | "block";
/** Convert only parsed table ranges; unrelated Markdown retains its original source bytes. */
declare function convertMarkdownTables(markdown: string, mode: MarkdownTableMode): string;
export { MarkdownTableMode as n, convertMarkdownTables as t };