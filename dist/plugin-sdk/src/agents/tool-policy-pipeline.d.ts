import type { AnyAgentTool } from "./agent-tools.types.js";
import { type ToolPolicyAuditLogLevel } from "./tool-policy-audit.js";
import { type DeclaredToolAllowlistContext, type ToolPolicyLike } from "./tool-policy.js";
/** One named policy layer in the effective runtime tool policy pipeline. */
export type ToolPolicyPipelineStep = {
    policy: ToolPolicyLike | undefined;
    label: string;
    stripPluginOnlyAllowlist?: boolean;
    suppressUnavailableCoreToolWarning?: boolean;
    suppressUnavailableCoreToolWarningAllowlist?: string[];
    unavailableCoreToolReason?: string;
};
/** Builds the default profile, provider, agent, group, and sender policy layers. */
export declare function buildDefaultToolPolicyPipelineSteps(params: {
    profilePolicy?: ToolPolicyLike;
    profile?: string;
    profileUnavailableCoreWarningAllowlist?: string[];
    providerProfilePolicy?: ToolPolicyLike;
    providerProfile?: string;
    providerProfileUnavailableCoreWarningAllowlist?: string[];
    globalPolicy?: ToolPolicyLike;
    globalProviderPolicy?: ToolPolicyLike;
    agentPolicy?: ToolPolicyLike;
    agentProviderPolicy?: ToolPolicyLike;
    groupPolicy?: ToolPolicyLike;
    senderPolicy?: ToolPolicyLike;
    agentId?: string;
    unavailableCoreToolReason?: string;
}): ToolPolicyPipelineStep[];
/** Applies configured policy layers to a tool list and emits deduped warnings/audit events. */
export declare function applyToolPolicyPipeline(params: {
    tools: AnyAgentTool[];
    toolMeta: (tool: AnyAgentTool) => {
        pluginId: string;
    } | undefined;
    warn: (message: string) => void;
    steps: ToolPolicyPipelineStep[];
    auditLogLevel?: ToolPolicyAuditLogLevel;
    declaredToolAllowlist?: DeclaredToolAllowlistContext;
}): AnyAgentTool[];
/** Clears process-local warning dedupe state between tests. */
export declare function resetToolPolicyWarningCacheForTest(): void;
