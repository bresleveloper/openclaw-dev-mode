type SubsystemLogger = {
  isEnabled?(level: "debug" | "info" | "warn"): boolean;
  info(message: string): void;
  debug(message: string): void;
  debugLazy?(build: () => string): void;
};
type ModelTransportDebugEnv = NodeJS.ProcessEnv;
/** Resolves model payload debug verbosity from `OPENCLAW_DEBUG_MODEL_PAYLOAD`. */
declare function resolveModelPayloadDebugMode(env?: ModelTransportDebugEnv): "off" | "summary" | "tools" | "full-redacted";
/** Resolves SSE stream debug verbosity from `OPENCLAW_DEBUG_SSE`. */
declare function resolveModelSseDebugMode(env?: ModelTransportDebugEnv): "off" | "events" | "peek";
/** Emits transport diagnostics at debug, promoted to info by explicit debug flags. */
declare function emitModelTransportDebug(log: SubsystemLogger, message: string | (() => string)): void;
/** The requesting layer owns AbortError classification; deadlines remain failures here. */
declare function emitModelTransportError(log: SubsystemLogger & {
  warn(message: string): void;
}, label: string, detail: string | (() => string), signal?: AbortSignal): void;
/**
 * Debug formatting helpers for model transport endpoints.
 * Keeps logs useful without exposing credentials, request params, or fragments.
 */
/** Return a sanitized URL suitable for logs and diagnostics. */
declare function formatModelTransportDebugUrl(rawUrl: string): string;
/** Format a configured base URL for debug output, or the implicit default. */
declare function formatModelTransportDebugBaseUrl(rawUrl: string | undefined): string;
export { resolveModelPayloadDebugMode as a, emitModelTransportError as i, formatModelTransportDebugUrl as n, resolveModelSseDebugMode as o, emitModelTransportDebug as r, formatModelTransportDebugBaseUrl as t };