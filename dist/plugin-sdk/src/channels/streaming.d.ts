import type { BlockStreamingChunkConfig, BlockStreamingCoalesceConfig, ChannelStreamingCommandTextMode, ChannelStreamingProgressConfig, ChannelStreamingConfig, StreamingMode, TextChunkMode } from "../config/types.base.js";
export type { ChannelDeliveryStreamingConfig, ChannelPreviewStreamingConfig, ChannelStreamingBlockConfig, ChannelStreamingCommandTextMode, ChannelStreamingConfig, ChannelStreamingProgressConfig, ChannelStreamingPreviewConfig, StreamingMode, TextChunkMode, } from "../config/types.base.js";
export type { SlackChannelStreamingConfig } from "../config/types.slack.js";
export type StreamingCompatEntry = {
    /** Canonical nested streaming config or legacy preview mode string. */
    streaming?: unknown;
    /** Legacy preview stream mode. */
    streamMode?: unknown;
    /** Legacy text chunking mode. */
    chunkMode?: unknown;
    /** Legacy block delivery toggle. */
    blockStreaming?: unknown;
    /** Legacy preview chunk config. */
    draftChunk?: unknown;
    /** Legacy block coalescing config. */
    blockStreamingCoalesce?: unknown;
    /** Legacy native streaming transport toggle. */
    nativeStreaming?: unknown;
};
export declare const DEFAULT_PROGRESS_DRAFT_LABELS: readonly ["Working", "Shelling", "Scuttling", "Clawing", "Pinching", "Molting", "Bubbling", "Tiding", "Reefing", "Cracking", "Sifting", "Brining", "Nautiling", "Krilling", "Barnacling", "Lobstering", "Tidepooling", "Pearling", "Snapping", "Surfacing"];
export declare const DEFAULT_PROGRESS_DRAFT_INITIAL_DELAY_MS = 5000;
export declare function isChannelProgressDraftWorkToolName(name: string | null | undefined): boolean;
export declare function isPotentialTruncatedFinal(finalText: string): boolean;
export declare function selectLongerFinalText(params: {
    finalText: string;
    candidateTexts: readonly (string | undefined)[];
}): string | undefined;
export declare function resolveTranscriptBackedChannelFinalText(params: {
    finalText: string;
    resolveCandidateText: () => Promise<string | undefined>;
}): Promise<string>;
export type ChannelProgressLineOptions = {
    /** Whether generated tool details should use Markdown formatting. */
    markdown?: boolean;
    /** Detail shape for tool arguments shown in progress drafts. */
    detailMode?: "explain" | "raw";
    /** Whether command progress should show raw command text or status-only copy. */
    commandText?: ChannelStreamingCommandTextMode;
};
export type ChannelProgressDraftRenderMode = "text" | "rich";
export type ChannelProgressDraftLineInput = {
    event: "tool";
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
} | {
    event: "item";
    itemId?: string;
    toolCallId?: string;
    itemKind?: string;
    title?: string;
    name?: string;
    phase?: string;
    status?: string;
    summary?: string;
    progressText?: string;
    meta?: string;
} | {
    event: "plan";
    phase?: string;
    title?: string;
    explanation?: string;
    steps?: string[];
} | {
    event: "approval";
    phase?: string;
    title?: string;
    command?: string;
    reason?: string;
    message?: string;
} | {
    event: "command-output";
    itemId?: string;
    toolCallId?: string;
    phase?: string;
    title?: string;
    name?: string;
    status?: string;
    exitCode?: number | null;
} | {
    event: "patch";
    itemId?: string;
    toolCallId?: string;
    phase?: string;
    title?: string;
    name?: string;
    added?: string[];
    modified?: string[];
    deleted?: string[];
    summary?: string;
};
export type ChannelProgressDraftLineKind = ChannelProgressDraftLineInput["event"];
export type ChannelProgressDraftLine = {
    /** Stable line id used to update an existing progress line in place. */
    id?: string;
    /** Progress event family that produced this line. */
    kind: ChannelProgressDraftLineKind;
    /** Rendered line text before final draft truncation/prefix formatting. */
    text: string;
    /** Human-readable label for UI renderers. */
    label: string;
    /** Optional leading icon for rich or plain progress renderers. */
    icon?: string;
    /** Compact detail text separated from label/icon. */
    detail?: string;
    /** Optional lifecycle status, such as completed or exit code. */
    status?: string;
    /** Normalized tool name when the line represents tool work. */
    toolName?: string;
    /** Whether final formatting should add a bullet/line prefix. */
    prefix?: boolean;
};
export declare function formatChannelProgressDraftLine(
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput, 
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): string | undefined;
export declare function resolveChannelProgressDraftLineOptions(
/** Channel streaming config source for command-text defaults. */
entry: StreamingCompatEntry | null | undefined, 
/** Caller-supplied line formatting overrides. */
options?: ChannelProgressLineOptions): ChannelProgressLineOptions;
export declare function buildChannelProgressDraftLineForEntry(
/** Channel streaming config source for command-text defaults. */
entry: StreamingCompatEntry | null | undefined, 
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput, 
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
export declare function formatChannelProgressDraftLineForEntry(
/** Channel streaming config source for command-text defaults. */
entry: StreamingCompatEntry | null | undefined, 
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput, 
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): string | undefined;
export declare function buildChannelProgressDraftLine(
/** Structured progress event to normalize into draft-line metadata. */
input: ChannelProgressDraftLineInput, 
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
export declare function createChannelProgressDraftGate(params: {
    /** Callback that starts the channel progress draft. */
    onStart: () => void | Promise<void>;
    /** Delay before first work event starts a draft; second work event starts immediately. */
    initialDelayMs?: number;
    /** Reports timer-fired startup failures, which have no awaiting caller. */
    onStartError?: (error: unknown) => void;
    /** Timer implementation, injectable for tests. */
    setTimeoutFn?: typeof setTimeout;
    /** Timer clearer, injectable for tests. */
    clearTimeoutFn?: typeof clearTimeout;
}): {
    readonly hasStarted: boolean;
    readonly workEvents: number;
    noteWork(): Promise<boolean>;
    startNow(): Promise<void>;
    cancel(): void;
};
export declare function getChannelStreamingConfigObject(entry: StreamingCompatEntry | null | undefined): ChannelStreamingConfig | undefined;
export declare function resolveChannelStreamingChunkMode(entry: StreamingCompatEntry | null | undefined): TextChunkMode | undefined;
export declare function resolveChannelStreamingBlockEnabled(entry: StreamingCompatEntry | null | undefined): boolean | undefined;
export declare function resolveChannelStreamingBlockCoalesce(entry: StreamingCompatEntry | null | undefined): BlockStreamingCoalesceConfig | undefined;
export declare function resolveChannelStreamingPreviewChunk(entry: StreamingCompatEntry | null | undefined): BlockStreamingChunkConfig | undefined;
export declare function resolveChannelStreamingPreviewToolProgress(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean): boolean;
export declare function resolveChannelStreamingProgressCommentary(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean): boolean;
export declare function resolveChannelStreamingPreviewCommandText(entry: StreamingCompatEntry | null | undefined, defaultValue?: ChannelStreamingCommandTextMode): ChannelStreamingCommandTextMode;
export declare function resolveChannelStreamingSuppressDefaultToolProgressMessages(entry: StreamingCompatEntry | null | undefined, options?: {
    draftStreamActive?: boolean;
    previewToolProgressEnabled?: boolean;
    previewStreamingEnabled?: boolean;
}): boolean;
export declare function resolveChannelStreamingNativeTransport(entry: StreamingCompatEntry | null | undefined): boolean | undefined;
export declare function resolveChannelPreviewStreamMode(entry: StreamingCompatEntry | null | undefined, defaultMode: "off" | "partial"): StreamingMode;
export declare function resolveChannelProgressDraftConfig(entry: StreamingCompatEntry | null | undefined): ChannelStreamingProgressConfig;
export declare function resolveChannelProgressDraftLabel(params: {
    entry?: StreamingCompatEntry | null;
    seed?: string;
    random?: () => number;
}): string | undefined;
export declare function resolveChannelProgressDraftMaxLines(entry: StreamingCompatEntry | null | undefined, defaultValue?: number): number;
export declare function resolveChannelProgressDraftMaxLineChars(entry: StreamingCompatEntry | null | undefined, defaultValue?: number): number;
export declare function resolveChannelProgressDraftRender(entry: StreamingCompatEntry | null | undefined, defaultValue?: ChannelProgressDraftRenderMode): ChannelProgressDraftRenderMode;
export declare function normalizeChannelProgressDraftLineIdentity(
/** Progress line whose duplicate/update identity should be normalized. */
line: string | ChannelProgressDraftLine | undefined): string;
export declare function mergeChannelProgressDraftLine<TLine extends string | ChannelProgressDraftLine>(
/** Existing progress draft lines in display order. */
lines: TLine[], 
/** New or updated progress line. */
line: TLine, 
/** Merge limits for rolling progress drafts. */
params: {
    maxLines: number;
}): TLine[];
export declare function formatChannelProgressDraftText(params: {
    /** Channel streaming config source for progress label and bounds. */
    entry?: StreamingCompatEntry | null;
    /** Ordered progress lines to render. */
    lines: Array<string | ChannelProgressDraftLine>;
    /** Stable seed used when choosing automatic progress labels. */
    seed?: string;
    /** Random source used when choosing automatic progress labels. */
    random?: () => number;
    /** Optional formatter applied after line compaction. */
    formatLine?: (line: string) => string;
    /** Prefix used for plain progress lines that lack their own icon. */
    bullet?: string;
}): string;
