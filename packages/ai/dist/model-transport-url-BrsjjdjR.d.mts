//#region packages/ai/src/transports/model-transport-debug.d.ts
type SubsystemLogger = {
  info(message: string): void;
  debug(message: string): void;
};
type ModelTransportDebugEnv = NodeJS.ProcessEnv;
/** Payload debug detail levels accepted by `OPENCLAW_DEBUG_MODEL_PAYLOAD`. */
type ModelPayloadDebugMode = "off" | "summary" | "tools" | "full-redacted";
/** SSE debug detail levels accepted by `OPENCLAW_DEBUG_SSE`. */
type ModelSseDebugMode = "off" | "events" | "peek";
/** Resolves model payload debug verbosity from `OPENCLAW_DEBUG_MODEL_PAYLOAD`. */
declare function resolveModelPayloadDebugMode(env?: ModelTransportDebugEnv): ModelPayloadDebugMode;
/** Resolves SSE stream debug verbosity from `OPENCLAW_DEBUG_SSE`. */
declare function resolveModelSseDebugMode(env?: ModelTransportDebugEnv): ModelSseDebugMode;
/** Emits transport diagnostics at debug, promoted to info by explicit debug flags. */
declare function emitModelTransportDebug(log: SubsystemLogger, message: string): void;
/** The requesting layer owns AbortError classification; deadlines remain failures here. */
declare function emitModelTransportError(log: SubsystemLogger & {
  warn(message: string): void;
}, label: string, detail: string, signal?: AbortSignal): void;
//#endregion
//#region packages/ai/src/transports/model-transport-url.d.ts
/**
 * Debug formatting helpers for model transport endpoints.
 * Keeps logs useful without exposing credentials, request params, or fragments.
 */
/** Return a sanitized URL suitable for logs and diagnostics. */
declare function formatModelTransportDebugUrl(rawUrl: string): string;
/** Format a configured base URL for debug output, or the implicit default. */
declare function formatModelTransportDebugBaseUrl(rawUrl: string | undefined): string;
//#endregion
export { resolveModelPayloadDebugMode as a, emitModelTransportError as i, formatModelTransportDebugUrl as n, resolveModelSseDebugMode as o, emitModelTransportDebug as r, formatModelTransportDebugBaseUrl as t };