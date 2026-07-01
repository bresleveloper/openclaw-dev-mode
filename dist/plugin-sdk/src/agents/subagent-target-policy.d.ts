type SubagentTargetPolicyResult = {
    ok: true;
} | {
    ok: false;
    allowedText: string;
    error: string;
};
/** Resolve the normalized agent IDs a requester may target with sessions_spawn. */
export declare function resolveSubagentAllowedTargetIds(params: {
    requesterAgentId: string;
    allowAgents?: readonly string[];
    configuredAgentIds?: readonly string[];
}): {
    allowAny: boolean;
    allowedIds: string[];
};
/** Validate one requested target against subagent spawn policy. */
export declare function resolveSubagentTargetPolicy(params: {
    requesterAgentId: string;
    targetAgentId: string;
    requestedAgentId?: string;
    allowAgents?: readonly string[];
    configuredAgentIds?: readonly string[];
}): SubagentTargetPolicyResult;
export {};
