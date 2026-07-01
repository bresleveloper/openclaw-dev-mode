import type { MarkdownTableMode } from "./types.js";
/** Converts markdown tables into the configured plaintext/code rendering mode. */
export declare function convertMarkdownTables(markdown: string, mode: MarkdownTableMode): string;
