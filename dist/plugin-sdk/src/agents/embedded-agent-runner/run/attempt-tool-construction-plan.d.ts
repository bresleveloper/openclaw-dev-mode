import type { OpenClawCodingToolConstructionPlan } from "../../agent-tools.js";
/**
 * Applies a runtime allowlist to a concrete tool list after expanding tool and
 * plugin groups. Undefined allowlists keep all tools; an explicit empty list
 * intentionally disables all runtime tools.
 */
export declare function applyEmbeddedAttemptToolsAllow<T extends {
    name: string;
}>(tools: T[], toolsAllow?: string[], options?: {
    toolMeta?: (tool: T) => {
        pluginId: string;
    } | undefined;
}): T[];
/**
 * Adds the message tool to a narrowed allowlist when the caller must support
 * forced source-reply delivery. Wildcard and undefined allowlists already cover
 * message, while an empty allowlist becomes message-only.
 */
export declare function mergeForcedEmbeddedAttemptToolsAllow(toolsAllow: string[] | undefined, params: {
    forceMessageTool?: boolean;
}): string[] | undefined;
/**
 * Decides which tool families need to be constructed for an embedded attempt.
 * This keeps allowlisted plugin/channel tools available without forcing every
 * local core tool factory to run for narrow plugin-only configurations.
 */
export declare function resolveEmbeddedAttemptToolConstructionPlan(params: {
    disableTools?: boolean;
    isRawModelRun?: boolean;
    toolsAllow?: string[];
    forceMessageTool?: boolean;
}): {
    constructTools: boolean;
    includeCoreTools: boolean;
    runtimeToolAllowlist?: string[];
    codingToolConstructionPlan: OpenClawCodingToolConstructionPlan;
};
/**
 * Decides whether the bundled MCP runtime is needed for this attempt. Bundle
 * runtime creation follows explicit bundle/plugin allowlist names rather than
 * generic local tool names.
 */
export declare function shouldCreateBundleMcpRuntimeForAttempt(params: {
    toolsEnabled: boolean;
    disableTools?: boolean;
    toolsAllow?: string[];
}): boolean;
/**
 * Decides whether the bundled LSP runtime is needed for this attempt. LSP tools
 * are enabled by default/wildcard and by allowlist entries with the `lsp_`
 * prefix.
 */
export declare function shouldCreateBundleLspRuntimeForAttempt(params: {
    toolsEnabled: boolean;
    disableTools?: boolean;
    toolsAllow?: string[];
}): boolean;
