import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { FallbackNoticeState } from "../status/fallback-notice-state.js";
import type { RuntimeFallbackAttempt } from "./reply/agent-runner-execution.js";
export { resolveActiveFallbackState, type FallbackNoticeState, } from "../status/fallback-notice-state.js";
/** Builds the visible notice shown when runtime falls back from the selected model. */
export declare function buildFallbackNotice(params: {
    selectedProvider: string;
    selectedModel: string;
    activeProvider: string;
    activeModel: string;
    attempts: RuntimeFallbackAttempt[];
    cfg?: OpenClawConfig;
}): string | null;
/** Builds the visible notice shown when runtime returns to the selected model. */
export declare function buildFallbackClearedNotice(params: {
    selectedProvider: string;
    selectedModel: string;
    previousActiveModel?: string;
}): string;
type ResolvedFallbackTransition = {
    selectedModelRef: string;
    activeModelRef: string;
    fallbackActive: boolean;
    fallbackTransitioned: boolean;
    fallbackCleared: boolean;
    reasonSummary: string;
    attemptSummaries: string[];
    previousState: {
        selectedModel?: string;
        activeModel?: string;
        reason?: string;
    };
    nextState: {
        selectedModel?: string;
        activeModel?: string;
        reason?: string;
    };
    stateChanged: boolean;
};
/** Resolves fallback state transitions and the next persisted notice-state fields. */
export declare function resolveFallbackTransition(params: {
    selectedProvider: string;
    selectedModel: string;
    activeProvider: string;
    activeModel: string;
    attempts: RuntimeFallbackAttempt[];
    state?: FallbackNoticeState;
    cfg?: OpenClawConfig;
}): ResolvedFallbackTransition;
