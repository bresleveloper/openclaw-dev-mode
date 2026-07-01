/**
 * Tool names are not ownership boundaries. Callers must reject plugin/channel
 * instances before using this audited core-tool allowlist.
 */
export declare function isAgentToolReplaySafe(tool: {
    name?: string;
}, options?: {
    declaredReplaySafe?: (tool: {
        name?: string;
    }) => boolean | undefined;
}): boolean;
/**
 * Name-only tool events are safe only when one concrete registered instance
 * owns the name. Duplicate/shadowed names fail closed.
 */
export declare function collectReplaySafeToolNames(tools: Array<{
    name?: string;
}>, options?: {
    declaredReplaySafe?: (tool: {
        name?: string;
    }) => boolean | undefined;
}): Set<string>;
/** Test/fixture helper for constructing metadata for audited core tool names. */
export declare function isCoreToolNameReplaySafe(toolName: string): boolean;
