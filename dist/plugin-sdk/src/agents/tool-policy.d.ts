import { IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW } from "./sandbox-tool-policy.js";
export { couldNormalizeToolNamePrefixToAllowedTool, expandToolGroups, normalizeToolList, normalizeToolName, resolveToolProfilePolicy, TOOL_GROUPS, } from "./tool-policy-shared.js";
export type { ToolProfileId } from "./tool-policy-shared.js";
/** Tool allow/deny policy shape accepted by agent and sandbox config. */
export type ToolPolicyLike = {
    allow?: string[];
    deny?: string[];
    [IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW]?: true;
};
/** Plugin-owned tool group expansion state. */
export type PluginToolGroups = {
    all: string[];
    byPlugin: Map<string, string[]>;
};
/** Analysis of an allowlist after matching core and plugin tool ids. */
type AllowlistResolution = {
    policy: ToolPolicyLike | undefined;
    unknownAllowlist: string[];
    pluginOnlyAllowlist: boolean;
};
export type DeclaredToolAllowlistContext = {
    pluginToolNames?: Iterable<string>;
    pluginIds?: Iterable<string>;
    mcpServerNames?: Iterable<string>;
};
/** Synthetic allowlist entry that means "use default plugin tools". */
export declare const DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY = "__openclaw_default_plugin_tools__";
/** Returns true when an allow policy is narrower than all/default plugin tools. */
export declare function hasRestrictiveAllowPolicy(policy?: {
    allow?: string[];
}): boolean;
/** Replaces an allowlist with the normalized names of an effective tool array. */
export declare function replaceWithEffectiveToolAllowlist(target: string[], tools: Array<{
    name: string;
}>): void;
/** Collects explicit allow entries from layered policies. */
export declare function collectExplicitAllowlist(policies: Array<ToolPolicyLike | undefined>): string[];
/** Collects explicit deny entries from layered policies. */
export declare function collectExplicitDenylist(policies: Array<ToolPolicyLike | undefined>): string[];
/** Builds plugin tool groups from tool metadata. */
export declare function buildPluginToolGroups<T extends {
    name: string;
}>(params: {
    tools: T[];
    toolMeta: (tool: T) => {
        pluginId: string;
    } | undefined;
}): PluginToolGroups;
/** Expands plugin groups in a policy while preserving undefined policies. */
export declare function expandPolicyWithPluginGroups(policy: ToolPolicyLike | undefined, groups: PluginToolGroups): ToolPolicyLike | undefined;
/** Classifies allowlists as core, plugin-only, or unknown for diagnostics. */
export declare function analyzeAllowlistByToolType(policy: ToolPolicyLike | undefined, groups: PluginToolGroups, coreTools: Set<string>, declaredTools?: DeclaredToolAllowlistContext): AllowlistResolution;
/** Merges alsoAllow entries into an existing allow policy. */
export declare function mergeAlsoAllowPolicy<TPolicy extends {
    allow?: string[];
}>(policy: TPolicy | undefined, alsoAllow?: string[]): TPolicy | undefined;
