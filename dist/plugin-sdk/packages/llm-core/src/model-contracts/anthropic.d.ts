type ClaudeModelRef = {
    id?: string;
    params?: Record<string, unknown>;
};
type ClaudeEffortModelRef = ClaudeModelRef & {
    thinkingLevelMap?: Record<string, string | null | undefined>;
};
export declare const CLAUDE_FABLE_5_THINKING_PROFILE: {
    readonly levels: readonly [{
        readonly id: "off";
    }, {
        readonly id: "minimal";
    }, {
        readonly id: "low";
    }, {
        readonly id: "medium";
    }, {
        readonly id: "high";
    }, {
        readonly id: "xhigh";
    }, {
        readonly id: "adaptive";
    }, {
        readonly id: "max";
    }];
    readonly defaultLevel: "high";
    readonly preserveWhenCatalogReasoningFalse: true;
};
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
export declare function resolveClaudeModelIdentity(ref: ClaudeModelRef): string;
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
export declare function resolveClaudeFable5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model supports adaptive thinking. */
export declare function supportsClaudeAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native max effort. */
export declare function supportsClaudeNativeMaxEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native xhigh effort. */
export declare function supportsClaudeNativeXhighEffort(ref: ClaudeModelRef): boolean;
/**
 * Fill native Claude effort mappings only when the provider did not publish a
 * narrower route-specific contract.
 */
export declare function resolveClaudeNativeThinkingLevelMap(ref: ClaudeEffortModelRef): Record<string, string | null | undefined> | undefined;
export {};
