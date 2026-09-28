import { t as avoidTrailingHighSurrogateBreak } from "../utf16-slice-C5Uh1nl-.js";
import { n as MarkdownTableMode, t as convertMarkdownTables } from "../tables-BAppoNmX.js";
import { n as hasSystemMark, r as prefixSystemMessage, t as SYSTEM_MARK } from "../system-message-CItK8lzT.js";
//#region packages/markdown-core/src/reasoning-tag-parser.d.ts
type MarkdownCodeRegion = {
  start: number;
  end: number;
  block: boolean;
  source?: MarkdownInlineSource;
  indentedSource?: MarkdownIndentedSource;
};
type MarkdownInlineSource = {
  prefix: {
    start: number;
    end: number;
    text: string;
    ownerStart: number;
  };
  value: string;
  offsets: number[];
};
type MarkdownIndentedSource = {
  value: string;
  offsets: number[];
  /** Source framing before the first content token, including its owning containers. */
  context: string;
  ownerStart: number;
  nested: boolean;
};
type MarkdownOwnershipOptions = {
  includeSource?: boolean;
  includeIndentedSource?: boolean;
  includeText?: boolean;
  syntax?: "commonmark" | "gfm";
};
/** Returns parser-owned CommonMark/GFM code ranges with block ownership. */
declare function findMarkdownCodeRegions(text: string, options?: MarkdownOwnershipOptions): MarkdownCodeRegion[];
//#endregion
//#region src/shared/text/code-regions.d.ts
/** Public range inputs need only offsets; parser-owned metadata belongs to discovered regions. */
interface CodeRegion {
  start: number;
  end: number;
}
/** Finds CommonMark block-aware fenced, indented, and inline code regions. */
export declare function findCodeRegions(text: string, options?: Parameters<typeof findMarkdownCodeRegions>[1]): ReturnType<typeof findMarkdownCodeRegions>;
/** Returns true when a character offset falls inside one of the discovered code regions. */
export declare function isInsideCode(pos: number, regions: CodeRegion[]): boolean;
//#endregion
//#region packages/markdown-core/src/chunk-text.d.ts
type TextChunkRange = {
  start: number;
  end: number;
};
type ChunkTextRangesOptions = {
  limit: number;
  mode?: "hard" | "preferred";
};
/**
 * Splits text into contiguous UTF-16 ranges without dropping separator whitespace.
 * Preferred mode selects paragraph, newline, then whitespace boundaries.
 */
export declare function chunkTextRanges(text: string, options: ChunkTextRangesOptions): TextChunkRange[];
//#endregion
//#region packages/markdown-core/src/html-tags.d.ts
type HtmlTagToken = {
  raw: string;
  start: number;
  end: number;
  name: string;
  closing: boolean;
  selfClosing: boolean;
};
/** Tokenizes valid open/close HTML tags with Markdown-It's quote-aware grammar. */
export declare function tokenizeHtmlTags(html: string): Generator<HtmlTagToken>;
//#endregion
//#region packages/markdown-core/src/format-capabilities.d.ts
type FormatConstruct = "bold" | "italic" | "underline" | "strikethrough" | "spoiler" | "codeInline" | "codeBlock" | "codeLanguage" | "linkLabel" | "heading" | "bulletList" | "orderedList" | "taskList" | "table" | "blockquote" | "image" | "mention";
type ConstructSupport = "native" | "fallback" | "strip";
/** Static formatting capabilities declared by an outbound channel. */
export type FormatCapabilityProfile = {
  mechanism: "markdown" | "html" | "ranges" | "blocks" | "plain";
  constructs: Record<FormatConstruct, ConstructSupport>;
  chunk: {
    limit: number;
    unit: "chars" | "utf16" | "bytes";
    hardCap?: number;
  };
};
type DefinedConstructs<Overrides extends Partial<FormatCapabilityProfile["constructs"]>> = { [Construct in FormatConstruct]: Construct extends keyof Overrides ? Overrides[Construct] : "native"; };
type DefinedChunk<Chunk extends FormatCapabilityProfile["chunk"]> = Omit<FormatCapabilityProfile["chunk"], "unit"> & {
  unit: Chunk["unit"];
};
/** Defines a channel profile with native support as the default for each construct. */
declare function defineFormatProfile<const Mechanism extends FormatCapabilityProfile["mechanism"], const Overrides extends Partial<FormatCapabilityProfile["constructs"]> = Record<never, never>, const Chunk extends FormatCapabilityProfile["chunk"] = FormatCapabilityProfile["chunk"]>(profile: {
  mechanism: Mechanism;
  constructs?: Overrides & Record<Exclude<keyof Overrides, FormatConstruct>, never>;
  chunk: Chunk;
}): {
  mechanism: Mechanism;
  constructs: DefinedConstructs<Overrides>;
  chunk: DefinedChunk<Chunk>;
};
/** Runtime helpers for defining static channel formatting capabilities. */
export declare const FormatCapabilityProfile: {
  define: typeof defineFormatProfile;
};
//#endregion
//#region packages/markdown-core/src/ir-metadata.d.ts
type MarkdownHtmlMetadata = {
  /** Complete authored HTML tags in UTF-16 offsets; omitted from serialized IR. */
  htmlTags?: HtmlTagToken[];
};
type MarkdownListItemMarker = {
  kind: "bullet" | "ordered";
  listMarker?: {
    start: number;
    end: number;
  };
  task?: true;
  taskMarker?: {
    start: number;
    end: number;
  };
  /** Parser-owned identity and rendered span for block-native list emitters. */
  listId?: number;
  parentListId?: number;
  depth?: number;
  start?: number;
  end?: number;
};
//#endregion
//#region packages/markdown-core/src/assistant-transcript-headers.d.ts
type AssistantTranscriptRole = "assistant" | "developer" | "system" | "user";
type AssistantTranscriptRoleHeaderKind = "angle_role_header" | "role_timestamp_bracket" | "timestamp_role_colon";
//#endregion
//#region packages/markdown-core/src/ir-spans.d.ts
type MarkdownStyle = "bold" | "italic" | "underline" | "strikethrough" | "code" | "code_block" | "spoiler" | "blockquote" | "heading_1" | "heading_2" | "heading_3" | "heading_4" | "heading_5" | "heading_6";
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
type MarkdownAnnotationSpan = {
  start: number;
  end: number;
  type: "assistant_transcript_role";
  kind: AssistantTranscriptRoleHeaderKind;
  role: AssistantTranscriptRole;
};
//#endregion
//#region packages/markdown-core/src/ir-slice.d.ts
export declare function sliceMarkdownIR(ir: MarkdownIR, start: number, end: number): MarkdownIR;
//#endregion
//#region packages/markdown-core/src/ir.d.ts
type MarkdownIR = MarkdownHtmlMetadata & {
  text: string;
  styles: MarkdownStyleSpan[];
  links: MarkdownLinkSpan[];
  annotations?: MarkdownAnnotationSpan[];
  listItems?: MarkdownListItemMarker[];
};
type MarkdownTableAlignment = "left" | "center" | "right";
type MarkdownTableData = {
  headers: string[];
  rows: string[][];
  aligns?: (MarkdownTableAlignment | undefined)[];
};
type MarkdownTableCell = MarkdownHtmlMetadata & {
  text: string;
  styles: MarkdownStyleSpan[];
  links: MarkdownLinkSpan[];
  annotations?: MarkdownAnnotationSpan[];
};
type MarkdownTableMeta = MarkdownTableData & {
  placeholderOffset: number;
  headerCells: MarkdownTableCell[];
  rowCells: MarkdownTableCell[][];
};
type MarkdownParseOptions = {
  /** Mark assistant-authored transcript-role headers after Markdown parsing. */
  assistantTranscriptRoleHeaders?: boolean;
  linkify?: boolean;
  enableSpoilers?: boolean;
  /** Parse authored HTML <u>/<ins> tags into underline spans. */
  enableHtmlUnderline?: boolean;
  /** Preserve task-list checkboxes as semantic list markers. */
  enableTaskLists?: boolean;
  headingStyle?: "none" | "bold" | "rich";
  blockquotePrefix?: string;
  autolink?: boolean;
  /** How to render tables (off|bullets|code|block). Default: off. */
  tableMode?: MarkdownTableMode;
  /** Visible text emitted for a thematic break. Default: ───. */
  horizontalRuleText?: string;
  /** Preserve source line spacing after headings and code blocks. */
  preserveSourceBlockSpacing?: boolean;
  /**
   * Treat Python-style `__name__` member, call, argument, and index identifiers as literal text
   * instead of emphasis delimiters. Disabled by default.
   */
  preserveDunderIdentifiers?: boolean;
};
export declare function markdownToIR(markdown: string, options?: MarkdownParseOptions): MarkdownIR;
export declare function markdownToIRWithMeta(markdown: string, options?: MarkdownParseOptions): {
  ir: MarkdownIR;
  hasTables: boolean;
  tables: MarkdownTableMeta[];
};
export declare function chunkMarkdownIR(ir: MarkdownIR, limit: number): MarkdownIR[];
//#endregion
//#region packages/markdown-core/src/render-aware-chunking.d.ts
/** A rendered chunk paired with the Markdown IR slice that produced it. */
type RenderedMarkdownChunk<TRendered> = {
  /** Rendered payload for this chunk after caller-specific escaping/link rewriting. */
  rendered: TRendered;
  /** Source IR slice used to produce the rendered payload. */
  source: MarkdownIR;
};
/** Inputs for chunking Markdown IR against the final rendered payload size. */
type RenderMarkdownIRChunksWithinLimitOptions<TRendered> = {
  /** Parsed Markdown IR to split. */
  ir: MarkdownIR;
  /** Maximum measured size for each rendered chunk. */
  limit: number;
  /** Returns the size unit enforced by the target transport. */
  measureRendered: (rendered: TRendered) => number;
  /** Renders a candidate IR slice for measuring and final output. */
  renderChunk: (ir: MarkdownIR) => TRendered;
  /** Re-annotate transcript-role headers promoted by a new message boundary. */
  assistantTranscriptRoleMessageBoundaries?: boolean;
};
/** Chunks Markdown IR by rendered size while preserving styles, links, and whitespace. */
export declare function renderMarkdownIRChunksWithinLimit<TRendered>(options: RenderMarkdownIRChunksWithinLimitOptions<TRendered>): RenderedMarkdownChunk<TRendered>[];
//#endregion
//#region packages/markdown-core/src/render-attributed.d.ts
type AttributedRange<TStyle extends string> = {
  start: number;
  length: number;
  style: TStyle;
};
/** Renderer hooks for converting Markdown IR into text plus native style ranges. */
type AttributedRenderOptions<TStyle extends string> = {
  styleMap: Partial<Record<MarkdownStyle, TStyle>>;
  annotationStyleMap?: Partial<Record<MarkdownAnnotationSpan["type"], TStyle>>;
  /** Returns text appended after a link label; appended text remains unstyled. */
  renderLink?: (link: MarkdownLinkSpan, text: string, context: {
    origin: "authored" | "linkify";
  }) => string;
  trimEnd?: boolean;
};
/** Renders Markdown IR into text plus UTF-16 style ranges for attributed-text targets. */
export declare function renderMarkdownWithAttributedRanges<TStyle extends string>(ir: MarkdownIR, options: AttributedRenderOptions<TStyle>, profile?: FormatCapabilityProfile): {
  text: string;
  ranges: AttributedRange<TStyle>[];
};
//#endregion
//#region packages/markdown-core/src/render.d.ts
/** Marker pair used to wrap a styled Markdown span in the target renderer. */
type RenderStyleMarker = {
  open: string | ((span: MarkdownStyleSpan) => string);
  close: string;
};
/** Optional marker map; omitted styles are emitted as plain escaped text. */
type RenderStyleMap = Partial<Record<MarkdownStyle, RenderStyleMarker>>;
/** Marker pair used to render a semantic Markdown annotation. */
type RenderAnnotationMarker = {
  open: string | ((span: MarkdownAnnotationSpan) => string);
  close: string;
  /** Drop links and ordinary styles that overlap this annotation. */
  suppressNestedFormatting?: boolean;
};
type RenderAnnotationMap = Partial<Record<MarkdownAnnotationSpan["type"], RenderAnnotationMarker>>;
/** Link wrapper boundaries after a renderer has accepted or rewritten a link span. */
type RenderLink = {
  start: number;
  end: number;
  open: string;
  close: string;
};
type MarkdownLinkOrigin = "authored" | "linkify";
/** Renderer hooks for converting Markdown IR into a marker-based target format. */
type RenderOptions = {
  styleMarkers: RenderStyleMap;
  annotationMarkers?: RenderAnnotationMap;
  escapeText: (text: string) => string;
  buildLink?: (link: MarkdownLinkSpan, text: string, context: {
    origin: MarkdownLinkOrigin;
  }) => RenderLink | null;
};
/** Renders Markdown IR by nesting configured style markers and optional link markers. */
export declare function renderMarkdownWithMarkers(ir: MarkdownIR, options: RenderOptions, profile?: FormatCapabilityProfile): string;
//#endregion
//#region src/shared/text/assistant-visible-text.d.ts
export declare function stripToolCallXmlTags(input: string, options?: {
  stripFunctionCallsXmlPayloads?: boolean;
  stripFunctionResponseAfterPluralToolCalls?: boolean;
}): string;
type AssistantVisibleTextSanitizerProfile = "delivery" | "final-answer-delivery" | "history" | "internal-scaffolding" | "tool-progress";
export declare function sanitizeAssistantVisibleTextWithProfile(text: string, profile?: AssistantVisibleTextSanitizerProfile, streaming?: boolean): string;
export declare function stripAssistantInternalScaffolding(text: string): string;
/**
 * Canonical user-visible assistant text sanitizer for delivery and history
 * extraction paths. Keeps prose, removes internal scaffolding.
 */
export declare function sanitizeAssistantVisibleText(text: string): string;
/**
 * Backwards-compatible trim wrapper.
 * Prefer sanitizeAssistantVisibleTextWithProfile for new call sites.
 */
export declare function sanitizeAssistantVisibleTextWithOptions(text: string, options?: {
  trim?: "none" | "both";
}): string;
//#endregion
//#region src/shared/text/auto-linked-file-ref.d.ts
export declare const FILE_REF_EXTENSIONS_WITH_TLD: Set<string>;
export declare function isAutoLinkedFileRef(href: string, label: string): boolean;
//#endregion
//#region src/shared/text/reasoning-tags.d.ts
type ReasoningTagMode = "strict" | "preserve";
type ReasoningTagTrim = "none" | "start" | "both";
type ReasoningTagScope = "all" | "leading";
/** Strips model reasoning/final tags from visible text while preserving literal code examples. */
export declare function stripReasoningTagsFromText(text: string, options?: {
  mode?: ReasoningTagMode;
  trim?: ReasoningTagTrim;
  scope?: ReasoningTagScope;
  recoverUnclosed?: boolean;
}): string;
//#endregion
//#region src/shared/text/strip-markdown.d.ts
type StripMarkdownOptions = {
  /** Mark parsed assistant transcript-role headers in transports without rich text. */
  assistantTranscriptRoleHeaders?: boolean;
  /** Prefix inserted before each marked transcript-role header. */
  assistantTranscriptRolePrefix?: string;
  /** Link projection after formatting is removed. Default: label-and-url. */
  linkStyle?: "label" | "label-and-url";
  /** Plain-text cleanup target. Speech removes decorative symbol and punctuation runs. */
  mode?: "plain-text" | "speech";
  /** Omit authored HTML tags and raw-text content while preserving code literals. */
  stripHtml?: boolean;
};
/** Parse Markdown, then protect role headers exposed by the final plain-text projection. */
export declare function stripMarkdown(text: string, options?: StripMarkdownOptions, profile?: FormatCapabilityProfile): string;
//#endregion
//#region packages/terminal-core/src/safe-text.d.ts
/**
 * Normalize untrusted text for single-line terminal/log rendering.
 */
export declare function sanitizeTerminalText(input: string): string;
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
type StripInlineDirectiveTagsResult = {
  text: string;
  changed: boolean;
};
export declare function stripInlineDirectiveTagsForDisplay(text: string): StripInlineDirectiveTagsResult;
export declare function stripInlineDirectiveTagsForDelivery(text: string, options?: {
  preserveTrailingWhitespace?: boolean;
}): StripInlineDirectiveTagsResult;
//#endregion
//#region src/utils/chunk-items.d.ts
/** Splits items into fixed-size chunks, preserving order and returning one row for non-positive sizes. */
export declare function chunkItems<T>(items: readonly T[], size: number): T[][];
//#endregion
//#region src/plugin-sdk/text-chunking.d.ts
/**
 * Splits outbound channel text into chunks no longer than the requested limit.
 * Newline boundaries win over spaces; text without usable separators falls back
 * to a hard character split so channel senders always receive bounded strings.
 */
export declare function chunkTextForOutbound(text: string, limit: number, options?: {
  preserveWhitespace?: boolean;
  formatting?: unknown;
}): string[];
//#endregion
export { type AssistantVisibleTextSanitizerProfile, type AttributedRenderOptions, type ChunkTextRangesOptions, type CodeRegion, type InlineDirectiveParseResult, type MarkdownIR, type MarkdownLinkSpan, type MarkdownParseOptions, type MarkdownStyle, type MarkdownStyleSpan, type MarkdownTableCell, type MarkdownTableMeta, type ReasoningTagMode, type ReasoningTagTrim, type RenderLink, type RenderMarkdownIRChunksWithinLimitOptions, type RenderOptions, type RenderStyleMap, type RenderStyleMarker, SYSTEM_MARK, type TextChunkRange, avoidTrailingHighSurrogateBreak, convertMarkdownTables, hasSystemMark, prefixSystemMessage };