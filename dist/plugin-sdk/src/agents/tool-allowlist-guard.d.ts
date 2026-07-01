type ExplicitToolAllowlistSource = {
    label: string;
    entries: string[];
    enforceWhenToolsDisabled?: boolean;
};
/** Normalize explicit allowlist sources, dropping empty source entries. */
export declare function collectExplicitToolAllowlistSources(sources: Array<{
    label: string;
    allow?: string[];
    enforceWhenToolsDisabled?: boolean;
}>): ExplicitToolAllowlistSource[];
/** Build an actionable error when explicit allowlists remove every callable tool. */
export declare function buildEmptyExplicitToolAllowlistError(params: {
    sources: ExplicitToolAllowlistSource[];
    callableToolNames: string[];
    toolsEnabled: boolean;
    disableTools?: boolean;
}): Error | null;
export {};
