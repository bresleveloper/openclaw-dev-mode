import { G as ProviderStreamOptions, N as ModelThinkingLevel, a as AssistantMessage, at as StreamOptions, d as Context, gt as Usage, k as Model, n as Api, s as AssistantMessageEventStreamContract, tt as SimpleStreamOptions } from "../types-B1ZIh9Ch.mjs";
import "../index-94l3uJ39.mjs";
import { i as getEventStreamCompletion } from "../event-stream-MivcTu-M.mjs";
import { a as RegisteredApiProvider, t as ApiProvider } from "../api-registry-BZQ-Qwa8.mjs";
import "../types-CeCl7cJZ.mjs";
import { SessionResourceCleanup, SessionResourceOwner, cleanupSessionResources, getSessionResourceOwnerId, registerSessionResourceCleanup } from "./session-resources.mjs";
import { n as isContextOverflow, t as sanitizeSurrogates } from "../sanitize-unicode-Ba_nhygY.mjs";
import { b as parseTerminalToolCallArguments } from "../transport-stream-shared-CJrl4Yd5.mjs";
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
export declare function createDeferredEventBuffer<T>(sink: {
  push(event: T): void;
}): {
  push(event: T): void;
  flush(): void;
  discard(): void;
};
/** Fast deterministic hash to shorten long strings */
export declare function shortHash(str: string): string;
/** Converts a Headers object to a plain record for provider request handling. */
export declare function headersToRecord(headers: Headers): Record<string, string>;
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
type ActivityListener = (progress: boolean, progressTimeoutMs?: number) => void;
export declare function notifyLlmRequestActivity(signal: AbortSignal | undefined, progress?: boolean, progressTimeoutMs?: number): void;
export declare function onLlmRequestActivity(signal: AbortSignal, listener: ActivityListener): () => void;
declare const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
export type OpenAICodexJwtPayload = {
  [OPENAI_CODEX_AUTH_CLAIM]?: {
    chatgpt_account_id?: unknown;
  };
  [key: string]: unknown;
};
export declare function decodeOpenAICodexJwtPayload(token: string): OpenAICodexJwtPayload | null;
export declare function resolveOpenAICodexAccountId(token: string): string | null;
export type FirstStreamEventTimeoutContext = {
  provider?: string;
  api?: string;
  model?: string;
  timeoutMs: number;
  stage?: "responses" | "completions";
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
/** Lazily bound an SDK response while preserving upstream cancellation. */
export declare function boundResponseBody(response: Response, options: ReadSseStreamWithLimitOptions): Response;
export { SessionResourceCleanup, SessionResourceOwner, cleanupSessionResources, complete, completeSimple, getApiProvider, getApiProviders, getEventStreamCompletion, getSessionResourceOwnerId, isContextOverflow, parseTerminalToolCallArguments, registerSessionResourceCleanup, sanitizeSurrogates, stream, streamSimple };