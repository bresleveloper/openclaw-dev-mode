import type { Model } from "../llm/types.js";
export declare function resolveModelRequestTimeoutMs(model: Model, timeoutMs: number | undefined): number | undefined;
export declare function buildGuardedModelFetch(model: Model, timeoutMs?: number, options?: {
    sanitizeSse?: boolean;
}): typeof fetch;
