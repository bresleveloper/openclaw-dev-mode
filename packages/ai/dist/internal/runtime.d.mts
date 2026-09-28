import "../index-C25RT6bP.mjs";
import { G as SimpleStreamOptions, H as ProviderStreamOptions, O as Model, Y as StreamOptions, a as AssistantMessage, d as Context, j as ModelThinkingLevel, n as Api, ot as Usage, s as AssistantMessageEventStreamContract } from "../types-qZFbaDbK.mjs";
import { i as getEventStreamCompletion } from "../event-stream-CjnIZZst.mjs";
import { a as RegisteredApiProvider, t as ApiProvider } from "../api-registry-C2T3lTV7.mjs";
import "../types-DTvddOfm.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-BZiVbGwK.mjs";
import { _ as parseTerminalToolCallArguments } from "../transport-stream-shared-B7Z9oCYg.mjs";
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
};
export declare const getApiProvider: (api: Api) => RegisteredApiProvider | undefined, getApiProviders: () => RegisteredApiProvider[];
export declare function clearApiProviders(): void;
export declare const stream: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => AssistantMessageEventStreamContract, complete: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => Promise<AssistantMessage>, streamSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract, completeSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => Promise<AssistantMessage>;
//#endregion
//#region packages/ai/src/env-api-keys.d.ts
/**
 * Find configured environment variables that can provide an API key for a provider.
 *
 * This only reports actual API key variables. It intentionally excludes ambient
 * credential sources such as AWS profiles, AWS IAM credentials, and Google
 * Application Default Credentials.
 */
export declare function findEnvKeys(provider: string): string[] | undefined;
/**
 * Get API key for provider from known environment variables, e.g. OPENAI_API_KEY.
 *
 * Will not return API keys for providers that require OAuth tokens.
 */
export declare function getEnvApiKey(provider: string): string | undefined;
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
/** Cleanup callback for resources tied to an LLM session or all sessions. */
export type SessionResourceCleanup = (sessionId?: string) => void;
/** Registers a session-resource cleanup hook and returns an unregister function. */
export declare function registerSessionResourceCleanup(cleanup: SessionResourceCleanup): () => void;
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
export declare function cleanupSessionResources(sessionId?: string): void;
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
 * Check if an assistant message represents a context overflow error.
 *
 * This handles two cases:
 * 1. Error-based overflow: Most providers return stopReason "error" with a
 *    specific error message pattern.
 * 2. Silent overflow: Some providers accept overflow requests and return
 *    successfully. For these, we check if usage.input exceeds the context window.
 *
 * ## Reliability by Provider
 *
 * **Reliable detection (returns error with detectable message):**
 * - Anthropic: "prompt is too long: X tokens > Y maximum" or "request_too_large"
 * - OpenAI (Completions & Responses): "exceeds the context window" or "exceeds the model's maximum context length of X tokens"
 * - Google Gemini: "input token count exceeds the maximum"
 * - xAI (Grok): "maximum prompt length is X but request contains Y"
 * - Groq: "reduce the length of the messages"
 * - Cerebras: 413 status code (no body)
 * - Mistral: "Prompt contains X tokens ... too large for model with Y maximum context length"
 * - OpenRouter (all backends): "maximum context length is X tokens"
 * - Together AI: "The input (X tokens) is longer than the model's context length (Y tokens)."
 * - llama.cpp: "exceeds the available context size"
 * - LM Studio: "greater than the context length"
 * - Kimi For Coding: "exceeded model token limit: X (requested: Y)"
 * - z.ai: "tokens in request more than max tokens allowed" or "Prompt exceeds max length"
 *
 * **Unreliable detection:**
 * - z.ai: Sometimes accepts overflow silently (detectable via usage.input > contextWindow),
 *   sometimes returns rate limit errors instead of the explicit overflow error above. Pass
 *   contextWindow param to detect silent overflow.
 * - Xiaomi MiMo: Truncates input to fit contextWindow then returns stopReason "length" with
 *   output=0. Pass contextWindow param to detect via the "filled context + zero output" signal.
 * - Ollama: May truncate input silently for some setups, but may also return explicit
 *   overflow errors that match the patterns above. Silent truncation still cannot be
 *   detected here because we do not know the expected token count.
 *
 * ## Custom Providers
 *
 * If you've added custom models via settings.json, this function may not detect
 * overflow errors from those providers. To add support:
 *
 * 1. Send a request that exceeds the model's context window
 * 2. Check the errorMessage in the response
 * 3. Create a regex pattern that matches the error
 * 4. The pattern should be added to the appropriate canonical scope in this file, or
 *    check the errorMessage yourself before calling this function
 *
 * @param message - The assistant message to check
 * @param contextWindow - Optional context window size for detecting silent overflow (z.ai)
 * @returns true if the message indicates a context overflow
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
/**
 * Bounded SSE / NDJSON stream reader guard.
 *
 * Wraps a `ReadableStreamDefaultReader<Uint8Array>` so the caller's existing
 * chunk-by-chunk parsing logic is unchanged, but accumulated bytes are tracked
 * against a hard cap. On overflow the underlying reader is cancelled and a
 * canonical error is thrown. Mirrors the `readResponseWithLimit` / bounded
 * JSON response pattern (see `src/agents/provider-http-errors.ts`).
 *
 * Internal helper for now. If extensions need it, promote to a plugin-SDK
 * subpath in a separate, dedicated PR with full SDK metadata sync.
 */
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
export { type ReasoningTagTextDelta, type ReasoningTagTextPartitioner, getEventStreamCompletion, parseTerminalToolCallArguments, sanitizeSurrogates };