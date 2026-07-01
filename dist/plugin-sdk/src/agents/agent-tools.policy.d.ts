import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AgentToolsConfig } from "../config/types.tools.js";
import type { AnyAgentTool } from "./agent-tools.types.js";
import { resolveProviderToolPolicy } from "./provider-tool-policy.js";
import type { SandboxToolPolicy } from "./sandbox.js";
import { type SessionCapabilityStore } from "./subagent-capabilities.js";
export { resolveProviderToolPolicy };
/** Resolve sub-agent tool policy from stored session capabilities. */
export declare function resolveSubagentToolPolicyForSession(cfg: OpenClawConfig | undefined, sessionKey: string, opts?: {
    store?: SessionCapabilityStore;
}): SandboxToolPolicy;
/** Resolve the tool policy inherited from a parent sub-agent session. */
export declare function resolveInheritedToolPolicyForSession(cfg: OpenClawConfig | undefined, sessionKey: string | undefined | null, opts?: {
    store?: SessionCapabilityStore;
}): SandboxToolPolicy | undefined;
/** Filter runtime tools by sandbox allow/deny policy. */
export declare function filterToolsByPolicy(tools: AnyAgentTool[], policy?: SandboxToolPolicy): AnyAgentTool[];
/** Resolve the shared profile, scope, extra, and sandbox policy layers. */
export declare function resolveConfiguredToolPolicies(params: {
    cfg: OpenClawConfig;
    agentTools?: AgentToolsConfig;
    sandboxMode?: "off" | "non-main" | "all";
    agentId?: string | null;
    extraPolicies?: readonly (SandboxToolPolicy | undefined)[];
}): SandboxToolPolicy[];
/** Validate caller-supplied group ids against server-derived session context. */
export declare function resolveTrustedGroupId(params: {
    groupId?: string | null;
    sessionKey?: string | null;
    spawnedBy?: string | null;
}): {
    groupId: string | null | undefined;
    dropped: boolean;
};
/** Resolve the layered global, provider, agent, and profile tool policies. */
export declare function resolveEffectiveToolPolicy(params: {
    config?: OpenClawConfig;
    sessionKey?: string;
    agentId?: string;
    modelProvider?: string;
    modelId?: string;
}): {
    agentId: string | undefined;
    globalPolicy: SandboxToolPolicy | undefined;
    globalProviderPolicy: SandboxToolPolicy | undefined;
    agentPolicy: SandboxToolPolicy | undefined;
    agentProviderPolicy: SandboxToolPolicy | undefined;
    profile: import("../config/types.tools.js").ToolProfileId | undefined;
    providerProfile: import("../config/types.tools.js").ToolProfileId | undefined;
    profileAlsoAllow: string[] | undefined;
    providerProfileAlsoAllow: string[] | undefined;
};
/** Resolve group-scoped tool policy after validating session provenance. */
export declare function resolveGroupToolPolicy(params: {
    config?: OpenClawConfig;
    sessionKey?: string;
    spawnedBy?: string | null;
    messageProvider?: string;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    accountId?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
}): SandboxToolPolicy | undefined;
