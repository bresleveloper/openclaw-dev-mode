import type { AgentRuntimePolicyConfig } from "../config/types.agents-shared.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Config surface that supplied a resolved model runtime policy. */
type ModelRuntimePolicySource = "model" | "provider";
/** Runtime policy plus the config surface that supplied it. */
type ResolvedModelRuntimePolicy = {
    policy?: AgentRuntimePolicyConfig;
    source?: ModelRuntimePolicySource;
    matchedProvider?: string;
};
/** Resolves the effective runtime policy for an agent/model/provider selection. */
export declare function resolveModelRuntimePolicy(params: {
    config?: OpenClawConfig;
    provider?: string;
    modelId?: string;
    agentId?: string;
    sessionKey?: string;
}): ResolvedModelRuntimePolicy;
export {};
