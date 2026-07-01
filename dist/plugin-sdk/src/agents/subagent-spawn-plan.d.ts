import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Splits a provider/model ref while preserving model-only refs. */
export declare function splitModelRef(ref?: string): {
    provider: undefined;
    model: undefined;
} | {
    provider: string;
    model: string;
} | {
    provider: undefined;
    model: string;
};
/** Resolves the effective subagent run timeout from per-call override or config default. */
export declare function resolveConfiguredSubagentRunTimeoutSeconds(params: {
    cfg: OpenClawConfig;
    runTimeoutSeconds?: number;
}): number;
/** Resolves the subagent model plus thinking patch to apply to the spawned session. */
export declare function resolveSubagentModelAndThinkingPlan(params: {
    cfg: OpenClawConfig;
    targetAgentId: string;
    requesterAgentConfig?: unknown;
    targetAgentConfig?: unknown;
    modelOverride?: string;
    thinkingOverrideRaw?: string;
    callerThinkingRaw?: string;
}): {
    thinkingOverride?: undefined;
    initialSessionPatch?: undefined;
    status: "error";
    resolvedModel: string;
    error: string;
    modelApplied?: undefined;
} | {
    error?: undefined;
    status: "ok";
    resolvedModel: string;
    modelApplied: boolean;
    thinkingOverride: import("../auto-reply/thinking.shared.ts").ThinkLevel | undefined;
    initialSessionPatch: {
        thinkingLevel: import("../auto-reply/thinking.shared.ts").ThinkLevel;
        model?: string | undefined;
        modelOverrideSource?: string | undefined;
        modelOverrideFallbackOriginProvider?: string | undefined;
        modelOverrideFallbackOriginModel?: string | undefined;
    } | {
        thinkingLevel?: undefined;
        model?: string | undefined;
        modelOverrideSource?: string | undefined;
        modelOverrideFallbackOriginProvider?: string | undefined;
        modelOverrideFallbackOriginModel?: string | undefined;
    } | {
        thinkingLevel: import("../auto-reply/thinking.shared.ts").ThinkLevel;
        model?: string | undefined;
        modelOverrideSource?: string | undefined;
        modelOverrideFallbackOriginProvider?: string | undefined;
        modelOverrideFallbackOriginModel?: string | undefined;
    };
};
