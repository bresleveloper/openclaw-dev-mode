import { type ToolProfileId } from "./tool-catalog.js";
type ToolProfilePolicy = {
    allow?: string[];
    deny?: string[];
};
/** Core tool groups exposed to allow/deny policy config. */
export declare const TOOL_GROUPS: Record<string, string[]>;
/** Normalizes a tool name or alias to the policy id used for matching. */
export declare function normalizeToolName(name: string): string;
/** Checks whether an in-progress prefix can still resolve to an allowed tool or alias. */
export declare function couldNormalizeToolNamePrefixToAllowedTool(prefix: string, allowedToolNames: Set<string>): boolean;
/** Normalizes a configured allow/deny list while dropping blank entries. */
export declare function normalizeToolList(list?: string[]): string[];
/** Expands named tool groups into concrete tool ids. */
export declare function expandToolGroups(list?: string[]): string[];
/** Resolves a built-in tool profile policy by id. */
export declare function resolveToolProfilePolicy(profile?: string): ToolProfilePolicy | undefined;
export type { ToolProfileId };
