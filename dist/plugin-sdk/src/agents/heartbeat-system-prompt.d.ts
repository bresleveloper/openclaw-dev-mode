import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Returns true when heartbeat guidance should be included in the system prompt. */
export declare function shouldIncludeHeartbeatGuidanceForSystemPrompt(params: {
    config?: OpenClawConfig;
    agentId?: string;
    defaultAgentId?: string;
}): boolean;
/** Resolves the heartbeat system prompt section for the selected/default agent. */
export declare function resolveHeartbeatPromptForSystemPrompt(params: {
    config?: OpenClawConfig;
    agentId?: string;
    defaultAgentId?: string;
}): string | undefined;
