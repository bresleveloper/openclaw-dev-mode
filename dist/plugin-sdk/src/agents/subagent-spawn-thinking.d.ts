import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves subagent thinking override and initial session patch from caller/agent config. */
export declare function resolveSubagentThinkingOverride(params: {
    cfg: OpenClawConfig;
    requesterAgentConfig?: unknown;
    targetAgentConfig?: unknown;
    thinkingOverrideRaw?: string;
    callerThinkingRaw?: string;
}): {
    status: "error";
    thinkingCandidateRaw: string;
    thinkingOverride?: undefined;
    initialSessionPatch?: undefined;
} | {
    thinkingCandidateRaw?: undefined;
    status: "ok";
    thinkingOverride: import("../auto-reply/thinking.shared.js").ThinkLevel;
    initialSessionPatch: {
        thinkingLevel: import("../auto-reply/thinking.shared.js").ThinkLevel;
    };
} | {
    thinkingCandidateRaw?: undefined;
    status: "ok";
    thinkingOverride: undefined;
    initialSessionPatch: {
        thinkingLevel?: undefined;
    };
} | {
    thinkingCandidateRaw?: undefined;
    status: "ok";
    thinkingOverride: undefined;
    initialSessionPatch: {
        thinkingLevel: import("../auto-reply/thinking.shared.js").ThinkLevel;
    };
};
