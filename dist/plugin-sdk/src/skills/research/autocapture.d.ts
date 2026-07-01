import type { OpenClawConfig } from "../../config/types.openclaw.js";
type SkillResearchAgentEndEvent = {
    messages: unknown[];
    success?: boolean;
};
type SkillResearchAgentContext = {
    agentId?: string;
    runId?: string;
    sessionKey?: string;
    trigger?: string;
    workspaceDir?: string;
};
/** Captures durable skill research signals from a session transcript when enabled. */
export declare function runSkillResearchAutoCapture(params: {
    event: SkillResearchAgentEndEvent;
    ctx: SkillResearchAgentContext;
    config?: OpenClawConfig;
}): Promise<void>;
export {};
