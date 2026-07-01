/**
 * Resolves configured native harness policy for agent ids.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type EmbeddedAgentRuntime } from "../agent-runtime-id.js";
/**
 * Effective runtime policy for selecting the agent harness that should execute a turn.
 */
export type AgentHarnessPolicy = {
    runtime: EmbeddedAgentRuntime;
    runtimeSource?: "model" | "provider" | "implicit";
};
/** Resolves model/provider/runtime config into the canonical harness runtime id. */
export declare function resolveAgentHarnessPolicy(params: {
    provider?: string;
    modelId?: string;
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    env?: NodeJS.ProcessEnv;
}): AgentHarnessPolicy;
