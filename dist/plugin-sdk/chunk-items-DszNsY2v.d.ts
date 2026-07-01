import { n as MarkdownTableMode } from "./tables-BBMGs0qO.js";

//#region packages/markdown-core/src/ir.d.ts
type MarkdownStyle = "bold" | "italic" | "strikethrough" | "code" | "code_block" | "spoiler" | "blockquote" | "heading_1" | "heading_2" | "heading_3" | "heading_4" | "heading_5" | "heading_6";
type MarkdownStyleSpan = {
  start: number;
  end: number;
  style: MarkdownStyle;
  language?: string;
};
type MarkdownLinkSpan = {
  start: number;
  end: number;
  href: string;
};
type MarkdownIR = {
  text: string;
  styles: MarkdownStyleSpan[];
  links: MarkdownLinkSpan[];
};
type MarkdownTableData = {
  headers: string[];
  rows: string[][];
};
type MarkdownTableCell = {
  text: string;
  styles: MarkdownStyleSpan[];
  links: MarkdownLinkSpan[];
};
type MarkdownTableMeta = MarkdownTableData & {
  placeholderOffset: number;
  headerCells: MarkdownTableCell[];
  rowCells: MarkdownTableCell[][];
};
type MarkdownParseOptions = {
  linkify?: boolean;
  enableSpoilers?: boolean;
  headingStyle?: "none" | "bold" | "rich";
  blockquotePrefix?: string;
  autolink?: boolean; /** How to render tables (off|bullets|code|block). Default: off. */
  tableMode?: MarkdownTableMode;
};
declare function sliceMarkdownIR(ir: MarkdownIR, start: number, end: number): MarkdownIR;
declare function markdownToIR(markdown: string, options?: MarkdownParseOptions): MarkdownIR;
declare function markdownToIRWithMeta(markdown: string, options?: MarkdownParseOptions): {
  ir: MarkdownIR;
  hasTables: boolean;
  tables: MarkdownTableMeta[];
};
declare function chunkMarkdownIR(ir: MarkdownIR, limit: number): MarkdownIR[];
//#endregion
//#region packages/markdown-core/src/render-aware-chunking.d.ts
/** A rendered chunk paired with the Markdown IR slice that produced it. */
type RenderedMarkdownChunk<TRendered> = {
  /** Rendered payload for this chunk after caller-specific escaping/link rewriting. */rendered: TRendered; /** Source IR slice used to produce the rendered payload. */
  source: MarkdownIR;
};
/** Inputs for chunking Markdown IR against the final rendered payload size. */
type RenderMarkdownIRChunksWithinLimitOptions<TRendered> = {
  /** Parsed Markdown IR to split. */ir: MarkdownIR; /** Maximum measured size for each rendered chunk. */
  limit: number; /** Returns the size unit enforced by the target transport. */
  measureRendered: (rendered: TRendered) => number; /** Renders a candidate IR slice for measuring and final output. */
  renderChunk: (ir: MarkdownIR) => TRendered;
};
/** Chunks Markdown IR by rendered size while preserving styles, links, and whitespace. */
declare function renderMarkdownIRChunksWithinLimit<TRendered>(options: RenderMarkdownIRChunksWithinLimitOptions<TRendered>): RenderedMarkdownChunk<TRendered>[];
//#endregion
//#region packages/markdown-core/src/render.d.ts
/** Marker pair used to wrap a styled Markdown span in the target renderer. */
type RenderStyleMarker = {
  open: string | ((span: MarkdownStyleSpan) => string);
  close: string;
};
/** Optional marker map; omitted styles are emitted as plain escaped text. */
type RenderStyleMap = Partial<Record<MarkdownStyle, RenderStyleMarker>>;
/** Link wrapper boundaries after a renderer has accepted or rewritten a link span. */
type RenderLink = {
  start: number;
  end: number;
  open: string;
  close: string;
};
/** Renderer hooks for converting Markdown IR into a marker-based target format. */
type RenderOptions = {
  styleMarkers: RenderStyleMap;
  escapeText: (text: string) => string;
  buildLink?: (link: MarkdownLinkSpan, text: string) => RenderLink | null;
};
/** Renders Markdown IR by nesting configured style markers and optional link markers. */
declare function renderMarkdownWithMarkers(ir: MarkdownIR, options: RenderOptions): string;
//#endregion
//#region src/shared/text/code-regions.d.ts
interface CodeRegion {
  start: number;
  end: number;
}
/** Finds fenced and inline Markdown code regions so text sanitizers can avoid examples. */
declare function findCodeRegions(text: string): CodeRegion[];
/** Returns true when a character offset falls inside one of the discovered code regions. */
declare function isInsideCode(pos: number, regions: CodeRegion[]): boolean;
//#endregion
//#region src/shared/text/reasoning-tags.d.ts
type ReasoningTagMode = "strict" | "preserve";
type ReasoningTagTrim = "none" | "start" | "both";
/** Detects whether a stray reasoning close tag separates two visible text regions. */
declare function hasOrphanReasoningCloseBoundary(params: {
  before: string;
  after: string;
}): boolean;
/** Strips model reasoning/final tags from visible text while preserving literal code examples. */
declare function stripReasoningTagsFromText(text: string, options?: {
  mode?: ReasoningTagMode;
  trim?: ReasoningTagTrim;
}): string;
//#endregion
//#region src/shared/text/strip-markdown.d.ts
/**
 * Strip lightweight markdown formatting from text while preserving readable
 * plain-text structure for TTS and channel fallbacks.
 */
declare function stripMarkdown(text: string): string;
//#endregion
//#region packages/terminal-core/src/safe-text.d.ts
/**
 * Normalize untrusted text for single-line terminal/log rendering.
 */
declare function sanitizeTerminalText(input: string): string;
//#endregion
//#region src/utils/directive-tags.d.ts
type InlineDirectiveParseResult = {
  text: string;
  audioAsVoice: boolean;
  replyToId?: string;
  replyToExplicitId?: string;
  replyToCurrent: boolean;
  hasAudioTag: boolean;
  hasReplyTag: boolean;
};
type InlineDirectiveParseOptions = {
  currentMessageId?: string;
  stripAudioTag?: boolean;
  stripReplyTags?: boolean;
};
type StripInlineDirectiveTagsResult = {
  text: string;
  changed: boolean;
};
type DisplayMessageWithContent = {
  content?: unknown;
} & Record<string, unknown>;
declare function stripInlineDirectiveTagsForDisplay(text: string): StripInlineDirectiveTagsResult;
declare function sanitizeReplyDirectiveId(rawReplyToId?: string): string | undefined;
declare function stripInlineDirectiveTagsForDelivery(text: string): StripInlineDirectiveTagsResult;
/**
 * Strips inline directive tags from text content while preserving message shape.
 * Empty post-strip text stays empty-string to preserve caller semantics.
 * Returns the input message reference (including the original content array) when
 * no text part changed, and reuses unchanged text-part references in mixed content,
 * so identity-equality consumers avoid spurious churn.
 */
declare function stripInlineDirectiveTagsFromMessageForDisplay(message: DisplayMessageWithContent | undefined): DisplayMessageWithContent | undefined;
declare function parseInlineDirectives(text?: string, options?: InlineDirectiveParseOptions): InlineDirectiveParseResult;
//#endregion
//#region src/utils/chunk-items.d.ts
/** Splits items into fixed-size chunks, preserving order and returning one row for non-positive sizes. */
declare function chunkItems<T>(items: readonly T[], size: number): T[][];
//#endregion
export { MarkdownStyleSpan as A, RenderMarkdownIRChunksWithinLimitOptions as C, MarkdownLinkSpan as D, MarkdownIR as E, markdownToIR as F, markdownToIRWithMeta as I, sliceMarkdownIR as L, MarkdownTableData as M, MarkdownTableMeta as N, MarkdownParseOptions as O, chunkMarkdownIR as P, renderMarkdownWithMarkers as S, renderMarkdownIRChunksWithinLimit as T, isInsideCode as _, sanitizeReplyDirectiveId as a, RenderStyleMap as b, stripInlineDirectiveTagsFromMessageForDisplay as c, ReasoningTagMode as d, ReasoningTagTrim as f, findCodeRegions as g, CodeRegion as h, parseInlineDirectives as i, MarkdownTableCell as j, MarkdownStyle as k, sanitizeTerminalText as l, stripReasoningTagsFromText as m, DisplayMessageWithContent as n, stripInlineDirectiveTagsForDelivery as o, hasOrphanReasoningCloseBoundary as p, InlineDirectiveParseResult as r, stripInlineDirectiveTagsForDisplay as s, chunkItems as t, stripMarkdown as u, RenderLink as v, RenderedMarkdownChunk as w, RenderStyleMarker as x, RenderOptions as y };