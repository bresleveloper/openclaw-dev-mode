import type { MarkdownTableMode } from "./types.js";
export type MarkdownStyle = "bold" | "italic" | "strikethrough" | "code" | "code_block" | "spoiler" | "blockquote" | "heading_1" | "heading_2" | "heading_3" | "heading_4" | "heading_5" | "heading_6";
export type MarkdownStyleSpan = {
    start: number;
    end: number;
    style: MarkdownStyle;
    language?: string;
};
export type MarkdownLinkSpan = {
    start: number;
    end: number;
    href: string;
};
export type MarkdownIR = {
    text: string;
    styles: MarkdownStyleSpan[];
    links: MarkdownLinkSpan[];
};
export type MarkdownTableData = {
    headers: string[];
    rows: string[][];
};
export type MarkdownTableCell = {
    text: string;
    styles: MarkdownStyleSpan[];
    links: MarkdownLinkSpan[];
};
export type MarkdownTableMeta = MarkdownTableData & {
    placeholderOffset: number;
    headerCells: MarkdownTableCell[];
    rowCells: MarkdownTableCell[][];
};
export type MarkdownParseOptions = {
    linkify?: boolean;
    enableSpoilers?: boolean;
    headingStyle?: "none" | "bold" | "rich";
    blockquotePrefix?: string;
    autolink?: boolean;
    /** How to render tables (off|bullets|code|block). Default: off. */
    tableMode?: MarkdownTableMode;
};
export declare function sliceMarkdownIR(ir: MarkdownIR, start: number, end: number): MarkdownIR;
export declare function markdownToIR(markdown: string, options?: MarkdownParseOptions): MarkdownIR;
export declare function markdownToIRWithMeta(markdown: string, options?: MarkdownParseOptions): {
    ir: MarkdownIR;
    hasTables: boolean;
    tables: MarkdownTableMeta[];
};
export declare function chunkMarkdownIR(ir: MarkdownIR, limit: number): MarkdownIR[];
