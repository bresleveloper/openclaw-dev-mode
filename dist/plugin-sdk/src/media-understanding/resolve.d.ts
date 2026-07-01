import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.js";
import type { MediaUnderstandingConfig, MediaUnderstandingModelConfig, MediaUnderstandingScopeConfig } from "../config/types.tools.js";
import type { MediaUnderstandingCapability } from "./types.js";
/** Default per-provider media-understanding runtime timeout in milliseconds. */
export declare const DEFAULT_MEDIA_RUNTIME_TIMEOUT_MS = 30000;
/** Converts configured timeout seconds into a timer-safe millisecond deadline. */
export declare function resolveTimeoutMs(seconds: number | undefined, fallbackSeconds: number): number;
/** Clamps an already-millisecond runtime timeout to the shared timer bounds. */
export declare function resolveMediaRuntimeTimeoutMs(timeoutMs: number | undefined): number;
/** Resolves the provider prompt and appends length guidance for non-audio outputs. */
export declare function resolvePrompt(capability: MediaUnderstandingCapability, prompt?: string, maxChars?: number): string;
/** Resolves the effective max response characters for a model entry and capability. */
export declare function resolveMaxChars(params: {
    capability: MediaUnderstandingCapability;
    entry: MediaUnderstandingModelConfig;
    cfg: OpenClawConfig;
    config?: MediaUnderstandingConfig;
}): number | undefined;
/** Resolves the effective input byte cap for a model entry and capability. */
export declare function resolveMaxBytes(params: {
    capability: MediaUnderstandingCapability;
    entry: MediaUnderstandingModelConfig;
    cfg: OpenClawConfig;
    config?: MediaUnderstandingConfig;
}): number;
/** Maps the message context to an allow/deny decision for configured media scope rules. */
export declare function resolveScopeDecision(params: {
    scope?: MediaUnderstandingScopeConfig;
    ctx: MsgContext;
}): "allow" | "deny";
/** Resolves configured model entries that can handle the requested media capability. */
export declare function resolveModelEntries(params: {
    cfg: OpenClawConfig;
    capability: MediaUnderstandingCapability;
    config?: MediaUnderstandingConfig;
    providerRegistry: Map<string, {
        capabilities?: MediaUnderstandingCapability[];
    }>;
}): MediaUnderstandingModelConfig[];
/** Resolves the bounded media-understanding task concurrency from config. */
export declare function resolveConcurrency(cfg: OpenClawConfig): number;
