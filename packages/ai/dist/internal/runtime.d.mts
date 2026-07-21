import { D as ModelThinkingLevel, E as Model, F as SimpleStreamOptions, P as ProviderStreamOptions, X as Usage, i as AssistantMessage, n as Api, o as AssistantMessageEventStreamContract, u as Context, z as StreamOptions } from "../types-DRgdPqaZ.mjs";
import { a as RegisteredApiProvider, t as ApiProvider } from "../api-registry-BXYnCOIR.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-BZiVbGwK.mjs";

//#region packages/ai/src/internal/default-runtime.d.ts
declare const defaultApiRegistry: {
  registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void;
  getApiProvider: (api: Api) => RegisteredApiProvider | undefined;
  getApiProviders: () => RegisteredApiProvider[];
  unregisterApiProviders: (sourceId: string) => void;
  clearApiProviders: () => void;
};
declare const defaultLlmRuntime: {
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
declare const registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void, getApiProvider: (api: Api) => RegisteredApiProvider | undefined, getApiProviders: () => RegisteredApiProvider[], unregisterApiProviders: (sourceId: string) => void, clearApiProviders: () => void;
declare const stream: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => AssistantMessageEventStreamContract, complete: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => Promise<AssistantMessage>, streamSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract, completeSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => Promise<AssistantMessage>;
//#endregion
//#region packages/ai/src/env-api-keys.d.ts
/**
 * Find configured environment variables that can provide an API key for a provider.
 *
 * This only reports actual API key variables. It intentionally excludes ambient
 * credential sources such as AWS profiles, AWS IAM credentials, and Google
 * Application Default Credentials.
 */
declare function findEnvKeys(provider: string): string[] | undefined;
/**
 * Get API key for provider from known environment variables, e.g. OPENAI_API_KEY.
 *
 * Will not return API keys for providers that require OAuth tokens.
 */
declare function getEnvApiKey(provider: string): string | undefined;
//#endregion
//#region packages/ai/src/model-utils.d.ts
/** Calculates and stores model cost fields from token usage and per-million pricing. */
declare function calculateCost<TApi extends Api>(model: Model<TApi>, usage: Usage): Usage["cost"];
/** Replaces the catalog estimate when the provider reports an authoritative billed total. */
declare function applyProviderReportedUsageCost(usage: Usage, reportedCost: unknown): void;
/** Returns thinking levels exposed by a reasoning-capable model. */
declare function getSupportedThinkingLevels<TApi extends Api>(model: Model<TApi>): ModelThinkingLevel[];
/** Clamps a requested thinking level to the closest supported level for a model. */
declare function clampThinkingLevel<TApi extends Api>(model: Model<TApi>, level: ModelThinkingLevel): ModelThinkingLevel;
/** Compares model identity by provider and id. */
declare function modelsAreEqual<TApi extends Api>(a: Model<TApi> | null | undefined, b: Model<TApi> | null | undefined): boolean;
//#endregion
//#region packages/ai/src/session-resources.d.ts
/** Cleanup callback for resources tied to an LLM session or all sessions. */
type SessionResourceCleanup = (sessionId?: string) => void;
/** Registers a session-resource cleanup hook and returns an unregister function. */
declare function registerSessionResourceCleanup(cleanup: SessionResourceCleanup): () => void;
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
declare function cleanupSessionResources(sessionId?: string): void;
//#endregion
//#region packages/ai/src/utils/deferred-event-buffer.d.ts
type EventSink<T> = {
  push(event: T): void;
};
declare function createDeferredEventBuffer<T>(sink: EventSink<T>, onBufferedEvent?: () => void): {
  push(event: T): void;
  flush(): void;
  discard(): void;
};
//#endregion
//#region packages/ai/src/utils/hash.d.ts
/** Fast deterministic hash to shorten long strings */
declare function shortHash(str: string): string;
//#endregion
//#region packages/ai/src/utils/headers.d.ts
/** Converts a Headers object to a plain record for provider request handling. */
declare function headersToRecord(headers: Headers): Record<string, string>;
//#endregion
//#region packages/ai/src/utils/json-parse.d.ts
/**
 * Repairs malformed JSON string literals by:
 * - escaping raw control characters inside strings
 * - doubling backslashes before invalid escape characters
 */
declare function repairJson(json: string): string;
declare function parseJsonWithRepair(json: string): unknown;
/**
 * Attempts to parse potentially incomplete JSON during streaming.
 * Always returns a valid object, even if the JSON is incomplete.
 *
 * @param partialJson The partial JSON string from streaming
 * @returns Parsed object or empty object if parsing fails
 */
declare function parseStreamingJson(partialJson: string | undefined): Record<string, unknown>;
//#endregion
//#region packages/ai/src/utils/llm-request-activity.d.ts
declare function notifyLlmRequestActivity(signal: AbortSignal | undefined): void;
declare function onLlmRequestActivity(signal: AbortSignal, listener: () => void): () => void;
//#endregion
//#region packages/ai/src/utils/oauth/openai-chatgpt-jwt.d.ts
declare const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
type OpenAICodexJwtPayload = {
  [OPENAI_CODEX_AUTH_CLAIM]?: {
    chatgpt_account_id?: unknown;
  };
  [key: string]: unknown;
};
declare function decodeOpenAICodexJwtPayload(token: string): OpenAICodexJwtPayload | null;
declare function resolveOpenAICodexAccountId(token: string): string | null;
//#endregion
//#region packages/ai/src/utils/overflow.d.ts
/** Detects DS4-style raw token-count context overflow errors. */
declare function isConfiguredContextSizeOverflowError(errorMessage: string): boolean;
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
 * - Cerebras: 400/413 status code (no body)
 * - Mistral: "Prompt contains X tokens ... too large for model with Y maximum context length"
 * - OpenRouter (all backends): "maximum context length is X tokens"
 * - Together AI: "The input (X tokens) is longer than the model's context length (Y tokens)."
 * - llama.cpp: "exceeds the available context size"
 * - LM Studio: "greater than the context length"
 * - Kimi For Coding: "exceeded model token limit: X (requested: Y)"
 *
 * **Unreliable detection:**
 * - z.ai: Sometimes accepts overflow silently (detectable via usage.input > contextWindow),
 *   sometimes returns rate limit errors. Pass contextWindow param to detect silent overflow.
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
 * 4. The pattern should be added to OVERFLOW_PATTERNS in this file, or
 *    check the errorMessage yourself before calling this function
 *
 * @param message - The assistant message to check
 * @param contextWindow - Optional context window size for detecting silent overflow (z.ai)
 * @returns true if the message indicates a context overflow
 */
declare function isContextOverflow(message: AssistantMessage, contextWindow?: number): boolean;
//#endregion
//#region packages/ai/src/utils/reasoning-tag-text-partitioner.d.ts
type ReasoningTagTextDelta = {
  kind: "text";
  text: string;
} | {
  kind: "thinking";
  text: string;
};
interface ReasoningTagTextPartitioner {
  markStrict(): void;
  push(chunk: string): ReasoningTagTextDelta[];
  pushVisible(chunk: string): ReasoningTagTextDelta[];
  flush(): ReasoningTagTextDelta[];
  hasPending(): boolean;
  isInsideReasoning(): boolean;
}
declare function createReasoningTagTextPartitioner(): ReasoningTagTextPartitioner;
//#endregion
//#region packages/ai/src/utils/stream-first-event-timeout.d.ts
type StreamStage = "responses" | "completions";
type FirstStreamEventTimeoutContext = {
  provider?: string;
  api?: string;
  model?: string;
  timeoutMs: number;
  stage?: StreamStage;
  hint?: string;
  abort?: (reason: Error) => void;
  onTimeout?: (reason: Error) => void;
};
type FirstStreamEventInternalOptions = {
  firstEventTimeoutMs?: number;
  abortFirstEventStream?: (reason: Error) => void;
  onFirstEventTimeout?: (reason: Error) => void;
};
type FirstStreamEventAbortController = {
  signal: AbortSignal;
  abort: (reason: Error) => void;
  dispose: () => void;
};
declare function getFirstStreamEventTimeoutMs(options: unknown): number | undefined;
declare function getFirstStreamEventTimeoutHandler(options: unknown): ((reason: Error) => void) | undefined;
declare function createFirstStreamEventTimeoutError(context: FirstStreamEventTimeoutContext): Error;
declare function createFirstStreamEventAbortController(parentSignal?: AbortSignal): FirstStreamEventAbortController;
declare function withFirstStreamEventTimeout<T>(stream: AsyncIterable<T>, context: FirstStreamEventTimeoutContext): AsyncIterable<T>;
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
type SseStreamOverflow = {
  size: number;
  maxBytes: number;
};
type ReadSseStreamWithLimitOptions = {
  maxBytes: number;
  onOverflow?: (params: SseStreamOverflow) => Error;
};
type SseByteGuard = {
  read(): Promise<ReadableStreamReadResult<Uint8Array>>;
  cancel(reason?: unknown): Promise<void>;
  totalBytes(): number;
  overflowed(): boolean;
  cancelled(): boolean;
};
declare function createSseByteGuard(reader: ReadableStreamDefaultReader<Uint8Array>, opts: ReadSseStreamWithLimitOptions): SseByteGuard;
//#endregion
export { FirstStreamEventAbortController, FirstStreamEventInternalOptions, FirstStreamEventTimeoutContext, OpenAICodexJwtPayload, ReadSseStreamWithLimitOptions, ReasoningTagTextDelta, ReasoningTagTextPartitioner, SessionResourceCleanup, SseByteGuard, SseStreamOverflow, applyProviderReportedUsageCost, calculateCost, clampThinkingLevel, cleanupSessionResources, clearApiProviders, complete, completeSimple, createDeferredEventBuffer, createFirstStreamEventAbortController, createFirstStreamEventTimeoutError, createReasoningTagTextPartitioner, createSseByteGuard, decodeOpenAICodexJwtPayload, defaultApiRegistry, defaultLlmRuntime, findEnvKeys, getApiProvider, getApiProviders, getEnvApiKey, getFirstStreamEventTimeoutHandler, getFirstStreamEventTimeoutMs, getSupportedThinkingLevels, headersToRecord, isConfiguredContextSizeOverflowError, isContextOverflow, modelsAreEqual, notifyLlmRequestActivity, onLlmRequestActivity, parseJsonWithRepair, parseStreamingJson, registerApiProvider, registerSessionResourceCleanup, repairJson, resolveOpenAICodexAccountId, sanitizeSurrogates, shortHash, stream, streamSimple, unregisterApiProviders, withFirstStreamEventTimeout };