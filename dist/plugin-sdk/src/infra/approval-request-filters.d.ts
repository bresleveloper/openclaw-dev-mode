/** Minimal approval request identity used by agent/session filter checks. */
export type ApprovalRequestFilterInput = {
    agentId?: string | null;
    sessionKey?: string | null;
};
/** Matches session filters as literal substrings first, then bounded safe regexes. */
export declare function matchesApprovalRequestSessionFilter(sessionKey: string, patterns: string[]): boolean;
/**
 * Applies optional approval request filters for agent ids and session keys.
 * Agent id can be parsed from the session key only when the caller opts in.
 */
export declare function matchesApprovalRequestFilters(params: {
    request: ApprovalRequestFilterInput;
    agentFilter?: string[];
    sessionFilter?: string[];
    fallbackAgentIdFromSessionKey?: boolean;
}): boolean;
