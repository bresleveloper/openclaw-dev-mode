import "./index-D27wAoOr.mjs";
import { H as ProviderResponse, a as AssistantMessage, k as Model, nt as StreamOptions, pt as Usage } from "./types-DvzmWW8J.mjs";
import { r as createAssistantMessageEventStream, t as AssistantMessageEventStream } from "./event-stream-DrRM_90c.mjs";
import "./event-stream-DqDQWqiy.mjs";
import { t as ProviderErrorProjection } from "./provider-error-xumb1V3F.mjs";
//#region packages/ai/src/transports/transport-stream-shared.d.ts
type TransportUsage = Pick<Usage, "input" | "output" | "cacheRead" | "cacheWrite" | "contextUsage" | "totalTokens"> & {
  cost: Pick<Usage["cost"], "input" | "output" | "cacheRead" | "cacheWrite" | "total">;
};
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
declare function mergeTransportHeaders(...headerSources: Array<Record<string, string> | undefined>): Record<string, string> | undefined;
declare function createEmptyTransportUsage(): TransportUsage;
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
type ModelStreamCooperativeScheduler = {
  afterEvent: () => Promise<void>;
};
declare function throwIfModelStreamAborted(signal?: AbortSignal): void;
declare function createModelStreamCooperativeScheduler(signal?: AbortSignal): ModelStreamCooperativeScheduler;
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
/** Assign terminal fields and record silent transport failures before partial-call cleanup. */
declare function assignTransportErrorDetails(output: AssistantMessage, error: unknown, signal?: AbortSignal): ProviderErrorProjection;
declare function failTransportStream(params: {
  stream: WritableTransportStream;
  output: AssistantMessage;
  signal?: AbortSignal;
  error: unknown;
  cleanup?: () => void;
}): void;
//#endregion
export { withProviderAcceptanceObserver as C, transportAbortError as S, notifyProviderStreamOpened as _, coerceTransportToolCallArguments as a, sanitizeTransportPayloadText as b, createModelStreamCooperativeScheduler as c, finalizeTerminalToolCallArguments as d, finalizeTransportStream as f, notifyProviderHttpResponse as g, notifyProviderHttpMetadata as h, assignTransportErrorDetails as i, createWritableTransportEventStream as l, mergeTransportHeaders as m, ProviderAcceptance as n, copyProviderAcceptanceObserver as o, iterateModelStream as p, WritableTransportStream as r, createEmptyTransportUsage as s, IncompleteToolCallError as t, failTransportStream as u, parseTerminalToolCallArguments as v, withProviderResponseHook as w, throwIfModelStreamAborted as x, sanitizeNonEmptyTransportPayloadText as y };