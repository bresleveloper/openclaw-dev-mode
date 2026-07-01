/**
 * Environment-driven debug controls for model transport logging.
 *
 * Model adapters share these helpers so payload, SSE, and transport diagnostics
 * interpret OpenClaw debug environment variables consistently.
 */
import type { createSubsystemLogger } from "../logging/subsystem.js";
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
type ModelTransportDebugEnv = NodeJS.ProcessEnv;
/** Payload debug detail levels accepted by `OPENCLAW_DEBUG_MODEL_PAYLOAD`. */
type ModelPayloadDebugMode = "off" | "summary" | "tools" | "full-redacted";
/** SSE debug detail levels accepted by `OPENCLAW_DEBUG_SSE`. */
type ModelSseDebugMode = "off" | "events" | "peek";
/** Resolves model payload debug verbosity from `OPENCLAW_DEBUG_MODEL_PAYLOAD`. */
export declare function resolveModelPayloadDebugMode(env?: ModelTransportDebugEnv): ModelPayloadDebugMode;
/** Resolves SSE stream debug verbosity from `OPENCLAW_DEBUG_SSE`. */
export declare function resolveModelSseDebugMode(env?: ModelTransportDebugEnv): ModelSseDebugMode;
/** Emits model-fetch metadata at info level by default; other diagnostics require debug env. */
export declare function emitModelTransportDebug(log: SubsystemLogger, message: string): void;
export {};
