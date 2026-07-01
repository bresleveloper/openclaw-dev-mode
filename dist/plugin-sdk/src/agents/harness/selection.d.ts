/**
 * Selects and invokes native agent harnesses for embedded run attempts.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { EmbeddedRunAttemptParams, EmbeddedRunAttemptResult } from "../embedded-agent-runner/run/types.js";
import { type AgentHarnessPolicy } from "./policy.js";
import type { AgentHarness } from "./types.js";
export { resolveAgentHarnessPolicy } from "./policy.js";
export type { AgentHarnessPolicy };
type PluginHarnessToolPolicyContext = Pick<EmbeddedRunAttemptParams, "config" | "sessionKey" | "sandboxSessionKey" | "agentId" | "provider" | "modelId" | "messageProvider" | "messageChannel" | "spawnedBy" | "groupId" | "groupChannel" | "groupSpace" | "agentAccountId" | "senderId" | "senderName" | "senderUsername" | "senderE164">;
export declare function resolveAvailableAgentHarnessPolicy(params: {
    provider?: string;
    modelId?: string;
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    env?: NodeJS.ProcessEnv;
}): AgentHarnessPolicy;
export declare function selectAgentHarness(params: {
    provider: string;
    modelId?: string;
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    agentHarnessId?: string;
    agentHarnessRuntimeOverride?: string;
}): AgentHarness;
export declare function runAgentHarnessAttempt(params: EmbeddedRunAttemptParams): Promise<EmbeddedRunAttemptResult>;
export declare function resolvePluginHarnessPolicyToolsAllow(params: PluginHarnessToolPolicyContext): [] | undefined;
