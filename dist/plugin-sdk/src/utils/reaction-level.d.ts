/**
 * Shared reaction-level resolver for channel plugins that expose ACK and agent reaction controls.
 * Channel adapters supply defaults/fallbacks; this helper owns the common flag expansion.
 */
/** User-configurable reaction behavior level for channel delivery. */
export type ReactionLevel = "off" | "ack" | "minimal" | "extensive";
/** Expanded reaction flags consumed by runtime delivery and prompt guidance. */
export type ResolvedReactionLevel = {
    level: ReactionLevel;
    /** Whether ACK reactions (e.g., 👀 when processing) are enabled. */
    ackEnabled: boolean;
    /** Whether agent-controlled reactions are enabled. */
    agentReactionsEnabled: boolean;
    /** Guidance level for agent reactions (minimal = sparse, extensive = liberal). */
    agentReactionGuidance?: "minimal" | "extensive";
};
/** Resolves raw reaction config into ACK and agent-reaction runtime flags. */
export declare function resolveReactionLevel(params: {
    value: unknown;
    defaultLevel: ReactionLevel;
    invalidFallback: "ack" | "minimal";
}): ResolvedReactionLevel;
