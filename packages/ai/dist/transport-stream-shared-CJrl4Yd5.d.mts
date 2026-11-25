import { M as ModelRequestHeaders, W as ProviderResponse, a as AssistantMessage, at as StreamOptions, gt as Usage, k as Model } from "./types-B1ZIh9Ch.mjs";
import "./index-94l3uJ39.mjs";
import { r as createAssistantMessageEventStream, t as AssistantMessageEventStream } from "./event-stream-MivcTu-M.mjs";
import "./event-stream-qCU9FGtl.mjs";
import { t as ProviderErrorProjection } from "./provider-error-DZMru0Jv.mjs";
/** A single synchronous scanner per stream; undefined requests the next reader result. */
declare function decodeSseFrames(limit?: {
  max: number;
  unit: "characters" | "bytes";
  message: string;
}): Generator<{
  frame: string;
  terminated: boolean;
} | undefined, void, ReadableStreamReadResult<Uint8Array>>;
/** Decodes frame boundaries; callers retain reader lifetime and protocol admission. */
declare function iterateSseFrames(read: () => Promise<ReadableStreamReadResult<Uint8Array>>, limit?: Parameters<typeof decodeSseFrames>[0]): AsyncGenerator<{
  frame: string;
  terminated: boolean;
}>;
type WritableTransportStream = Pick<ReturnType<typeof createAssistantMessageEventStream>, "push" | "end">;
declare function sanitizeTransportPayloadText(text: string): string;
declare function sanitizeNonEmptyTransportPayloadText(text: string, fallback?: string): string;
declare function coerceTransportToolCallArguments(argumentsValue: unknown): Record<string, unknown>;
/** Stable terminal fact: presentation must not infer unfinished calls from provider prose. */
declare class IncompleteToolCallError extends Error {
  readonly code = "incomplete_tool_call";
}
/**
 * Admit only complete object-shaped terminal tool arguments; partial parsing is preview-only.
 * `repairStringLiterals` opts a stream whose provider may deliver unvalidated tool input into
 * string-literal repair before rejection.
 */
declare function parseTerminalToolCallArguments(value: unknown, errorMessage?: string, options?: {
  repairStringLiterals?: boolean;
}): Record<string, unknown>;
/** Validate a complete sibling set before mutating any call into executable state. */
declare function finalizeTerminalToolCallArguments<T extends {
  arguments: Record<string, unknown>;
}>(calls: readonly T[], readArguments: (call: T) => unknown, errorMessage?: string, options?: {
  repairStringLiterals?: boolean;
}): void;
declare function mergeTransportHeaders(...headerSources: Array<ModelRequestHeaders | undefined>): ModelRequestHeaders | undefined;
declare function createEmptyTransportUsage(): Pick<Usage, "input" | "output" | "cacheRead" | "cacheWrite" | "contextUsage" | "totalTokens"> & {
  cost: Pick<Usage["cost"], "input" | "output" | "cacheRead" | "cacheWrite" | "total">;
};
declare function createWritableTransportEventStream(): {
  eventStream: AssistantMessageEventStream;
  stream: AssistantMessageEventStream;
};
/**
 * Abort error to surface for an aborted `signal`.
 *
 * Rethrows the caller's abort reason only when it carries a `code`, so that code
 * survives into `errorCode` on the persisted assistant message and consumers can
 * recognize an abort's origin without matching error text. A default
 * `abort()` reason is an uncoded DOMException that carries nothing the synthetic
 * error does not, so it keeps the "Request was aborted" text every transport
 * already emits rather than churning it.
 */
declare function transportAbortError(signal?: AbortSignal): Error;
declare function throwIfModelStreamAborted(signal?: AbortSignal): void;
/** Keep ready provider events from monopolizing the main loop, including ignored events. */
declare function iterateModelStream<T>(events: AsyncIterable<T> | Iterable<T>, signal?: AbortSignal): AsyncGenerator<T>;
type ProviderAcceptance = {
  kind: "http_response";
  status: number;
  headers: Record<string, string>;
} | {
  kind: "provider_stream_opened";
};
type ProviderAcceptanceObserver = (acceptance: ProviderAcceptance) => void;
type ProviderAcceptanceOptions = Pick<StreamOptions, "onResponse" | "signal">;
type ProviderStreamCancel = (reason: Error) => void | Promise<void>;
/** Attach an OpenClaw-internal provider acceptance observer to one model call. */
declare function withProviderAcceptanceObserver<T extends object>(options: T, observer: ProviderAcceptanceObserver): T;
/** Preserve the private provider acceptance observer when a built-in wrapper rebuilds options. */
declare function copyProviderAcceptanceObserver<T extends object>(source: unknown, target: T): T;
declare function awaitProviderLifecycleCallback<T>(callback: (() => T | Promise<T>) | undefined, signal?: AbortSignal): Promise<T | undefined>;
/** Report observed HTTP metadata; rejected responses use only onResponse. */
declare function notifyProviderHttpMetadata(params: {
  options?: ProviderAcceptanceOptions;
  response: ProviderResponse;
  model: Model;
  cancelStream: ProviderStreamCancel;
  signal?: AbortSignal;
}): Promise<void>;
/** Report a real HTTP response before body consumption. */
declare function notifyProviderHttpResponse(params: {
  options?: ProviderAcceptanceOptions;
  response: Response;
  model: Model;
  cancelStream?: ProviderStreamCancel;
  signal?: AbortSignal;
}): Promise<void>;
/** Report an accepted SDK stream when the SDK does not expose HTTP metadata. */
declare function notifyProviderStreamOpened(params: {
  options?: Pick<StreamOptions, "signal">;
  cancelStream: ProviderStreamCancel;
  signal?: AbortSignal;
}): Promise<void>;
/** Run a provider-response hook before start/body consumption inside the first-event deadline. */
declare function withProviderResponseHook<T = never>(params: {
  stream?: AsyncIterable<T>;
  signal: AbortSignal;
  abort: (reason: Error) => void;
  hook?: () => void | Promise<void>;
  onReady?: () => void;
}): AsyncIterable<T>;
declare function finalizeTransportStream(params: {
  stream: WritableTransportStream;
  output: AssistantMessage;
  signal?: AbortSignal;
}): void;
type TransportFailureDiagnostic = {
  abortReason?: string;
  incompleteReason?: string;
};
/** Assign terminal fields and record silent transport failures before partial-call cleanup. */
declare function assignTransportErrorDetails(output: AssistantMessage, error: unknown, signal?: AbortSignal, diagnostic?: TransportFailureDiagnostic): ProviderErrorProjection;
declare function failTransportStream(params: {
  stream: WritableTransportStream;
  output: AssistantMessage;
  signal?: AbortSignal;
  error: unknown;
  diagnostic?: TransportFailureDiagnostic;
  cleanup?: () => void;
}): void;
export { throwIfModelStreamAborted as C, withProviderResponseHook as E, sanitizeTransportPayloadText as S, withProviderAcceptanceObserver as T, notifyProviderHttpMetadata as _, awaitProviderLifecycleCallback as a, parseTerminalToolCallArguments as b, createEmptyTransportUsage as c, failTransportStream as d, finalizeTerminalToolCallArguments as f, mergeTransportHeaders as g, iterateSseFrames as h, assignTransportErrorDetails as i, createWritableTransportEventStream as l, iterateModelStream as m, ProviderAcceptance as n, coerceTransportToolCallArguments as o, finalizeTransportStream as p, WritableTransportStream as r, copyProviderAcceptanceObserver as s, IncompleteToolCallError as t, decodeSseFrames as u, notifyProviderHttpResponse as v, transportAbortError as w, sanitizeNonEmptyTransportPayloadText as x, notifyProviderStreamOpened as y };