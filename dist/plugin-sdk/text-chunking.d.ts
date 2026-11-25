import { t as avoidTrailingHighSurrogateBreak } from "../utf16-slice-6nYU5s3H.js";
import { n as MarkdownTableMode, t as convertMarkdownTables } from "../tables-CrEryc7Z.js";
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
/** Public range inputs need only offsets; parser-owned metadata belongs to discovered regions. */
interface CodeRegion {
  start: number;
  end: number;
}
export declare function isInsideCode(pos: number, regions: CodeRegion[]): boolean;
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
type FormatConstruct = keyof typeof NATIVE_FORMAT_CONSTRUCTS;
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
declare const NATIVE_FORMAT_CONSTRUCTS: {
  readonly bold: "native";
  readonly italic: "native";
  readonly underline: "native";
  readonly strikethrough: "native";
  readonly spoiler: "native";
  readonly codeInline: "native";
  readonly codeBlock: "native";
  readonly codeLanguage: "native";
  readonly linkLabel: "native";
  readonly heading: "native";
  readonly bulletList: "native";
  readonly orderedList: "native";
  readonly taskList: "native";
  readonly table: "native";
  readonly blockquote: "native";
  readonly image: "native";
  readonly mention: "native";
};
type DefinedConstructs<Overrides extends Partial<FormatCapabilityProfile["constructs"]>> = { [Construct in FormatConstruct]: Construct extends keyof Overrides ? Overrides[Construct] : "native"; };
type DefinedChunk<Chunk extends FormatCapabilityProfile["chunk"]> = Omit<FormatCapabilityProfile["chunk"], "unit"> & {
  unit: Chunk["unit"];
};
/** Defines a channel profile with native support as the default for each construct. */
declare function defineFormatProfile<const Mechanism extends FormatCapabilityProfile["mechanism"], const Overrides extends Partial<FormatCapabilityProfile["constructs"]> = object, const Chunk extends FormatCapabilityProfile["chunk"] = FormatCapabilityProfile["chunk"]>(profile: {
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
type AssistantTranscriptRole = (typeof TRANSCRIPT_ROLES)[number];
type AssistantTranscriptRoleHeaderKind = "angle_role_header" | "role_timestamp_bracket" | "timestamp_role_colon";
declare const TRANSCRIPT_ROLES: readonly ["assistant", "developer", "system", "user"];
/** A replacement in the original text's UTF-16 coordinates; equal bounds insert text. */
type MarkdownTextEdit = {
  start: number;
  end: number;
  text: string;
};
/** Apply disjoint edits; equal-position insertions keep caller order and shift their boundary. */
export declare function applyMarkdownTextEdits(text: string, edits: readonly MarkdownTextEdit[]): {
  text: string;
  mapOffset: (offset: number) => number;
};
declare const MARKDOWN_STYLE_ORDER: readonly ["blockquote", "code_block", "code", "heading_1", "heading_2", "heading_3", "heading_4", "heading_5", "heading_6", "bold", "italic", "underline", "strikethrough", "spoiler"];
type MarkdownStyle = (typeof MARKDOWN_STYLE_ORDER)[number];
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
type MarkdownListItemMetadata = {
  /** Rendered content owned by this item after its native marker. */
  contentStart?: number;
  contentEnd?: number;
  /** True when the source marker line itself contains no item content. */
  markerOnly?: true;
  /** Original Markdown source ownership, attached without changing legacy serialization. */
  sourceMarker?: {
    start: number;
    end: number;
  };
  sourceContent?: {
    start: number;
    end: number;
  };
  sourceIndent?: number;
  sourceStartLine?: number;
  sourceEndLine?: number;
};
type MarkdownListItemWithMetadata = MarkdownListItemMarker & MarkdownListItemMetadata;
type MarkdownBlockSpan = {
  kind: "blockquote" | "code_block" | "heading" | "thematic_break";
  start: number;
  end: number;
  /** Parser-owned container nesting depth, starting at one. */
  depth: number;
  blockquoteDepth?: number;
  codeOrigin?: "fenced" | "indented";
  codeClosed?: boolean;
  headingLevel?: number;
  headingOrigin?: "atx" | "setext";
  language?: string;
  sourceStartLine?: number;
  sourceEndLine?: number;
};
type MarkdownIRWithMetadata = Omit<MarkdownIR, "listItems"> & {
  /** Parser-owned block metadata, attached without changing legacy serialization. */
  blocks?: MarkdownBlockSpan[];
  listItems?: MarkdownListItemWithMetadata[];
};
export declare function sliceMarkdownIR(ir: MarkdownIR, start: number, end: number): MarkdownIR;
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
  /**
   * Let links with any scheme (file:, data:, javascript:, ...) tokenize instead
   * of being dropped by markdown-it's built-in denylist. Only set this when the
   * caller's own `buildLink` already applies a scheme allowlist downstream.
   */
  allowAllLinkSchemes?: boolean;
};
export declare function markdownToIR(markdown: string, options?: MarkdownParseOptions): MarkdownIR;
export declare function markdownToIRWithMeta(markdown: string, options?: MarkdownParseOptions): {
  ir: MarkdownIRWithMetadata;
  hasTables: boolean;
  tables: MarkdownTableMeta[];
};
export declare function chunkMarkdownIR(ir: MarkdownIR, limit: number): MarkdownIR[];
type RenderedMarkdownChunk<TRendered> = {
  /** Rendered payload for this chunk after caller-specific escaping/link rewriting. */
  rendered: TRendered;
  source: MarkdownIR;
};
type RenderMarkdownIRChunksWithinLimitOptions<TRendered> = {
  ir: MarkdownIR;
  /** Maximum measured size for each rendered chunk. */
  limit: number;
  /** Returns the size unit enforced by the target transport. */
  measureRendered: (rendered: TRendered) => number;
  renderChunk: (ir: MarkdownIR) => TRendered;
  /** Re-annotate transcript-role headers promoted by a new message boundary. */
  assistantTranscriptRoleMessageBoundaries?: boolean;
};
/** Chunks Markdown IR by rendered size while preserving styles, links, and whitespace. */
export declare function renderMarkdownIRChunksWithinLimit<TRendered>(options: RenderMarkdownIRChunksWithinLimitOptions<TRendered>): RenderedMarkdownChunk<TRendered>[];
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
type RenderStyleMarker = {
  open: string | ((span: MarkdownStyleSpan) => string);
  close: string;
};
/** Optional marker map; omitted styles are emitted as plain escaped text. */
type RenderStyleMap = Partial<Record<MarkdownStyle, RenderStyleMarker>>;
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
type RenderOptions = {
  styleMarkers: RenderStyleMap;
  annotationMarkers?: RenderAnnotationMap;
  /** Line-oriented targets repeat this before each nonempty blockquote line. */
  blockquotePrefix?: string;
  escapeText: (text: string) => string;
  buildLink?: (link: MarkdownLinkSpan, text: string, context: {
    origin: MarkdownLinkOrigin;
  }) => RenderLink | null;
};
/** Renders Markdown IR by nesting configured style markers and optional link markers. */
export declare function renderMarkdownWithMarkers(ir: MarkdownIR, options: RenderOptions, profile?: FormatCapabilityProfile): string;
export declare function stripAssistantInternalScaffolding(text: string): string;
type StripToolCallXmlOptions = {
  stripFunctionCallsXmlPayloads?: boolean;
  stripFunctionResponseAfterPluralToolCalls?: boolean;
};
export declare function stripToolCallXmlTags(input: string, options?: StripToolCallXmlOptions): string;
type AssistantVisibleTextSanitizerProfile = "delivery" | "final-answer-delivery" | "history" | "internal-scaffolding" | "tool-progress";
export declare function sanitizeAssistantVisibleTextWithProfile(text: string, profile?: AssistantVisibleTextSanitizerProfile, streaming?: boolean): string;
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
export declare const FILE_REF_EXTENSIONS_WITH_TLD: Set<string>;
export declare function isAutoLinkedFileRef(href: string, label: string): boolean;
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
/**
 * Normalize untrusted text for single-line rendering, including bidirectional controls.
 */
export declare function sanitizeTerminalText(input: string): string;
export declare const SYSTEM_MARK = "⚙️";
/** Return true when text already carries the system-message prefix. */
export declare function hasSystemMark(text: string): boolean;
/** Prefix non-empty text as a system message without double-prefixing. */
export declare function prefixSystemMessage(text: string): string;
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
/** Splits items into fixed-size chunks, preserving order and returning one row for non-positive sizes. */
export declare function chunkItems<T>(items: readonly T[], size: number): T[][];
/**
 * Splits outbound channel text into chunks no longer than the requested limit.
 * Newline boundaries win over spaces; text without usable separators falls back
 * to a hard character split so channel senders always receive bounded strings.
 */
export declare function chunkTextForOutbound(text: string, limit: number, options?: {
  preserveWhitespace?: boolean;
  formatting?: unknown;
}): string[];
export { type AssistantVisibleTextSanitizerProfile, type AttributedRenderOptions, type ChunkTextRangesOptions, type CodeRegion, type InlineDirectiveParseResult, type MarkdownIR, type MarkdownLinkSpan, type MarkdownParseOptions, type MarkdownStyle, type MarkdownStyleSpan, type MarkdownTableCell, type MarkdownTableMeta, type MarkdownTextEdit, type ReasoningTagMode, type ReasoningTagTrim, type RenderLink, type RenderMarkdownIRChunksWithinLimitOptions, type RenderOptions, type RenderStyleMap, type RenderStyleMarker, type TextChunkRange, avoidTrailingHighSurrogateBreak, convertMarkdownTables, findMarkdownCodeRegions as findCodeRegions };