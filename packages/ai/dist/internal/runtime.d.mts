import "../index-D27wAoOr.mjs";
import { M as ModelThinkingLevel, Q as SimpleStreamOptions, U as ProviderStreamOptions, a as AssistantMessage, d as Context, k as Model, n as Api, nt as StreamOptions, pt as Usage, s as AssistantMessageEventStreamContract } from "../types-DvzmWW8J.mjs";
import { i as getEventStreamCompletion } from "../event-stream-DrRM_90c.mjs";
import { a as RegisteredApiProvider, t as ApiProvider } from "../api-registry-B3rC2qu3.mjs";
import { m as getDefaultAiTransportHost } from "../host-DiPhRjrc.mjs";
import "../types-UlNana-2.mjs";
import { n as getEnvApiKey, t as findEnvKeys } from "../env-api-keys-BR0MUYYD.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-CjDG6jJx.mjs";
import { v as parseTerminalToolCallArguments } from "../transport-stream-shared-DW-7-qLR.mjs";
//#region packages/ai/src/internal/default-runtime.d.ts
export declare const defaultApiRegistry: {
  registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void;
  getApiProvider: (api: Api) => RegisteredApiProvider | undefined;
  getApiProviders: () => RegisteredApiProvider[];
  unregisterApiProviders: (sourceId: string) => void;
  clearApiProviders: () => void;
};
export declare const defaultLlmRuntime: {
  registry: {
    registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void;
    getApiProvider: (api: Api) => RegisteredApiProvider | undefined;
    getApiProviders: () => RegisteredApiProvider[];
    unregisterApiProviders: (sourceId: string) => void;
    clearApiProviders: () => void;
  };
  stream: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => AssistantMessageEventStreamContract;
  complete: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => Promise<AssistantMessage>;
  streamSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
  completeSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => Promise<AssistantMessage>;
  cleanupSessionResources: (sessionId?: string) => void;
};
declare const { getApiProvider, getApiProviders }: {
  registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void;
  getApiProvider: (api: Api) => RegisteredApiProvider | undefined;
  getApiProviders: () => RegisteredApiProvider[];
  unregisterApiProviders: (sourceId: string) => void;
  clearApiProviders: () => void;
};
export declare function clearApiProviders(): void;
declare const { stream, complete, streamSimple, completeSimple }: {
  registry: {
    registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void;
    getApiProvider: (api: Api) => RegisteredApiProvider | undefined;
    getApiProviders: () => RegisteredApiProvider[];
    unregisterApiProviders: (sourceId: string) => void;
    clearApiProviders: () => void;
  };
  stream: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => AssistantMessageEventStreamContract;
  complete: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => Promise<AssistantMessage>;
  streamSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
  completeSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => Promise<AssistantMessage>;
  cleanupSessionResources: (sessionId?: string) => void;
};
//#endregion
//#region packages/ai/src/model-utils.d.ts
/** Calculates and stores model cost fields from token usage and per-million pricing. */
export declare function calculateCost<TApi extends Api>(model: Model<TApi>, usage: Usage): Usage["cost"];
/** Replaces the catalog estimate when the provider reports an authoritative billed total. */
export declare function applyProviderReportedUsageCost(usage: Usage, reportedCost: unknown): void;
/** Returns thinking levels exposed by a reasoning-capable model. */
export declare function getSupportedThinkingLevels<TApi extends Api>(model: Model<TApi>): ModelThinkingLevel[];
/** Clamps a requested thinking level to the closest supported level for a model. */
export declare function clampThinkingLevel<TApi extends Api>(model: Model<TApi>, level: ModelThinkingLevel): ModelThinkingLevel;
/** Compares model identity by provider and id. */
export declare function modelsAreEqual<TApi extends Api>(a: Model<TApi> | null | undefined, b: Model<TApi> | null | undefined): boolean;
//#endregion
//#region packages/ai/src/session-resources.d.ts
/** Runtime transport owner attached to retained provider resources. */
export type SessionResourceOwner = ReturnType<typeof getDefaultAiTransportHost>;
/** Cleanup callback for resources tied to an LLM session or all sessions. */
export type SessionResourceCleanup = (sessionId?: string, owner?: SessionResourceOwner) => void;
/** Returns a process-local key that keeps retained resources separated by runtime owner. */
export declare function getSessionResourceOwnerId(owner: SessionResourceOwner): number;
/** Registers a session-resource cleanup hook and returns an unregister function. */
export declare function registerSessionResourceCleanup(cleanup: SessionResourceCleanup): () => void;
/** Registers metadata cleanup that runs only after every resource cleanup succeeds. */
export declare function registerSessionResourceCleanupObserver(observer: SessionResourceCleanup): () => void;
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
export declare function cleanupSessionResources(sessionId?: string, owner?: SessionResourceOwner): void;
//#endregion
//#region packages/ai/src/utils/deferred-event-buffer.d.ts
type EventSink<T> = {
  push(event: T): void;
};
export declare function createDeferredEventBuffer<T>(sink: EventSink<T>, onBufferedEvent?: () => void): {
  push(event: T): void;
  flush(): void;
  discard(): void;
};
//#endregion
//#region packages/ai/src/utils/hash.d.ts
/** Fast deterministic hash to shorten long strings */
export declare function shortHash(str: string): string;
//#endregion
//#region packages/ai/src/utils/headers.d.ts
/** Converts a Headers object to a plain record for provider request handling. */
export declare function headersToRecord(headers: Headers): Record<string, string>;
//#endregion
//#region packages/ai/src/utils/json-parse.d.ts
/**
 * Repairs malformed JSON string literals by:
 * - escaping raw control characters inside strings
 * - doubling backslashes before invalid escape characters
 *
 * By default a valid control escape (`\n`, `\t`, ...) that follows a Windows-path-looking
 * prefix is treated as an unescaped path separator and doubled. Pass
 * `preserveValidControlEscapes` when the text is authoritative (for example a completed
 * tool-call argument buffer) and every valid escape must survive as written.
 */
export declare function repairJson(json: string, options?: {
  preserveValidControlEscapes?: boolean;
}): string;
export declare function parseJsonWithRepair(json: string): unknown;
/**
 * Attempts to parse potentially incomplete JSON during streaming.
 * Always returns a valid object, even if the JSON is incomplete.
 *
 * @param partialJson The partial JSON string from streaming
 * @returns Parsed object or empty object if parsing fails
 */
export declare function parseStreamingJson(partialJson: string | undefined): Record<string, unknown>;
/** Returns true when the streamed argument buffer crossed its next preview checkpoint. */
export type ToolArgumentPreviewSchedule = (accumulatedChars: number) => boolean;
/**
 * Streamed tool-call arguments are preview-only; the terminal parse re-reads
 * the full buffer authoritatively at content_block_stop. Reparsing every delta
 * scans an ever-growing buffer and makes assembly quadratic in the argument
 * size, so refresh previews on a geometric length schedule instead — bounded
 * staleness, linear total parse work.
 */
export declare function createToolArgumentPreviewSchedule(): ToolArgumentPreviewSchedule;
//#endregion
//#region packages/ai/src/utils/llm-request-activity.d.ts
export declare function notifyLlmRequestActivity(signal: AbortSignal | undefined): void;
export declare function onLlmRequestActivity(signal: AbortSignal, listener: () => void): () => void;
//#endregion
//#region packages/ai/src/utils/oauth/openai-chatgpt-jwt.d.ts
declare const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
export type OpenAICodexJwtPayload = {
  [OPENAI_CODEX_AUTH_CLAIM]?: {
    chatgpt_account_id?: unknown;
  };
  [key: string]: unknown;
};
export declare function decodeOpenAICodexJwtPayload(token: string): OpenAICodexJwtPayload | null;
export declare function resolveOpenAICodexAccountId(token: string): string | null;
//#endregion
//#region packages/ai/src/utils/overflow.d.ts
declare const CONTEXT_OVERFLOW_PATTERN_SCOPES: {
  readonly "assistant-error": RegExp[];
  readonly "failover-explicit": RegExp[];
  readonly "provider-fallback": RegExp[];
  readonly "failover-hint": readonly [RegExp];
  readonly "context-window-too-small": readonly [RegExp];
  readonly "tpm-rate-limit-hint": readonly [RegExp];
  readonly "rate-limit-hint": readonly [RegExp];
};
export type ContextOverflowMessageScope = keyof typeof CONTEXT_OVERFLOW_PATTERN_SCOPES;
/** Match one canonical context-overflow wording scope without applying caller policy. */
export declare function matchesContextOverflowMessage(errorMessage: string, scope: ContextOverflowMessageScope): boolean;
/**
 * Match provider overflow errors, or infer overflow from reported context usage.
 * A context window enables silent-overflow detection; silent truncation without
 * a length stop remains undetectable because the original token count is unknown.
 */
export declare function isContextOverflow(message: AssistantMessage, contextWindow?: number): boolean;
//#endregion
//#region packages/markdown-core/src/reasoning-tag-parser.d.ts
type ReasoningTagTextDelta = {
  kind: "text";
  text: string;
} | {
  kind: "thinking";
  text: string;
};
//#endregion
//#region packages/markdown-core/src/reasoning-tags.d.ts
interface ReasoningTagTextPartitioner {
  markStrict(): void;
  push(chunk: string): ReasoningTagTextDelta[];
  pushVisible(chunk: string): ReasoningTagTextDelta[];
  flush(): ReasoningTagTextDelta[];
  hasPending(): boolean;
  /** Whether more input can change buffered Markdown or reasoning-tag ownership. */
  hasPendingSyntax(): boolean;
  isInsideReasoning(): boolean;
}
/** Creates a block-incremental parser that emits only Markdown-stable text. */
export declare function createReasoningTagTextPartitioner(): ReasoningTagTextPartitioner;
//#endregion
//#region packages/ai/src/utils/stream-first-event-timeout.d.ts
type StreamStage = "responses" | "completions";
export type FirstStreamEventTimeoutContext = {
  provider?: string;
  api?: string;
  model?: string;
  timeoutMs: number;
  stage?: StreamStage;
  hint?: string;
  abort?: (reason: Error) => void;
  onTimeout?: (reason: Error) => void;
};
export type FirstStreamEventInternalOptions = {
  firstEventTimeoutMs?: number;
  abortFirstEventStream?: (reason: Error) => void;
  onFirstEventTimeout?: (reason: Error) => void;
};
export type FirstStreamEventAbortController = {
  signal: AbortSignal;
  abort: (reason: Error) => void;
  dispose: () => void;
};
export declare function getFirstStreamEventTimeoutMs(options: unknown): number | undefined;
export declare function getFirstStreamEventTimeoutHandler(options: unknown): ((reason: Error) => void) | undefined;
export declare function createFirstStreamEventTimeoutError(context: FirstStreamEventTimeoutContext): Error;
export declare function createFirstStreamEventAbortController(parentSignal?: AbortSignal): FirstStreamEventAbortController;
export declare function withFirstStreamEventTimeout<T>(stream: AsyncIterable<T>, context: FirstStreamEventTimeoutContext): AsyncIterable<T>;
//#endregion
//#region packages/ai/src/utils/streaming-byte-guard.d.ts
/** Bounds cumulative stream bytes without waiting for reader cleanup after overflow. */
export type SseStreamOverflow = {
  size: number;
  maxBytes: number;
};
export type ReadSseStreamWithLimitOptions = {
  maxBytes: number;
  onOverflow?: (params: SseStreamOverflow) => Error;
};
export type SseByteGuard = {
  read(): Promise<ReadableStreamReadResult<Uint8Array>>;
  cancel(reason?: unknown): Promise<void>;
  totalBytes(): number;
  overflowed(): boolean;
  cancelled(): boolean;
};
export declare function createSseByteGuard(reader: ReadableStreamDefaultReader<Uint8Array>, opts: ReadSseStreamWithLimitOptions): SseByteGuard;
//#endregion
export { type ReasoningTagTextDelta, type ReasoningTagTextPartitioner, complete, completeSimple, findEnvKeys, getApiProvider, getApiProviders, getEnvApiKey, getEventStreamCompletion, parseTerminalToolCallArguments, sanitizeSurrogates, stream, streamSimple };