import type { OpenClawConfig } from "../config/types.openclaw.js";
export declare const CONTEXT_WINDOW_HARD_MIN_TOKENS = 4000;
type ContextWindowSource = "model" | "modelsConfig" | "agentContextTokens" | "default";
export type ContextWindowInfo = {
    tokens: number;
    referenceTokens?: number;
    source: ContextWindowSource;
};
/** Resolve the effective context window and source for one provider/model. */
export declare function resolveContextWindowInfo(params: {
    cfg: OpenClawConfig | undefined;
    provider: string;
    modelId: string;
    modelContextTokens?: number;
    modelContextWindow?: number;
    defaultTokens: number;
}): ContextWindowInfo;
type ContextWindowGuardResult = ContextWindowInfo & {
    hardMinTokens: number;
    warnBelowTokens: number;
    shouldWarn: boolean;
    shouldBlock: boolean;
};
/** Format a non-blocking low-context warning message. */
export declare function formatContextWindowWarningMessage(params: {
    provider: string;
    modelId: string;
    guard: ContextWindowGuardResult;
    runtimeBaseUrl?: string | null;
}): string;
/** Format a blocking context-window guard message. */
export declare function formatContextWindowBlockMessage(params: {
    guard: ContextWindowGuardResult;
    runtimeBaseUrl?: string | null;
}): string;
/** Evaluate whether the resolved context window should warn or block. */
export declare function evaluateContextWindowGuard(params: {
    info: ContextWindowInfo;
    warnBelowTokens?: number;
    hardMinTokens?: number;
}): ContextWindowGuardResult;
export {};
