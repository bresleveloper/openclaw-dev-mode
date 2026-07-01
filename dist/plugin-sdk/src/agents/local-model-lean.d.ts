/**
 * Local-model lean tool filtering.
 * Removes high-latency or channel-dependent tools for local models while
 * preserving explicitly required delivery tools.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AnyAgentTool } from "./agent-tools.types.js";
/** Resolves tool names that must survive local-model lean filtering. */
export declare function resolveLocalModelLeanPreserveToolNames(params?: {
    toolNames?: Iterable<string>;
    forceMessageTool?: boolean;
    sourceReplyDeliveryMode?: string;
}): string[];
/** Returns true when local-model lean mode is enabled for the selected agent. */
export declare function isLocalModelLeanEnabled(params: {
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
}): boolean;
/** Filters tools for local-model lean mode while preserving required delivery tools. */
export declare function filterLocalModelLeanTools(params: {
    tools: AnyAgentTool[];
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    preserveToolNames?: Iterable<string>;
}): AnyAgentTool[];
export declare function applyLocalModelLeanToolSearchDefaults(params: {
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
}): OpenClawConfig | undefined;
