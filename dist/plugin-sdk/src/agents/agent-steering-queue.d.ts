import type { PendingFinalDeliveryPayload, SubagentRunRecord } from "./subagent-registry.types.js";
/** Pending subagent completion selected for requester-session steering. */
type AgentSteeringQueueItem = {
    runId: string;
    entry: SubagentRunRecord;
    payload: PendingFinalDeliveryPayload;
};
/** A batch of leased subagent completions plus the prompt to inject upstream. */
type LeasedAgentSteeringBatch = {
    runIds: string[];
    prompt: string;
};
/** List pending completion payloads that should be steered into a requester turn. */
export declare function listPendingAgentSteeringItemsFromSubagentRuns(params: {
    runs: Map<string, SubagentRunRecord>;
    requesterSessionKey: string;
    now?: number;
}): AgentSteeringQueueItem[];
/** Build the merged runtime prompt for one or more pending steering items. */
export declare function buildMergedAgentSteeringPrompt(items: readonly AgentSteeringQueueItem[]): string | undefined;
/** Leases pending steering items and returns the prompt to prepend to the requester turn. */
export declare function leasePendingAgentSteeringItemsFromSubagentRuns(params: {
    runs: Map<string, SubagentRunRecord>;
    requesterSessionKey: string;
    leaseId: string;
    now?: number;
}): LeasedAgentSteeringBatch | undefined;
/** Marks leased steering items delivered after successful requester injection. */
export declare function ackLeasedAgentSteeringItemsFromSubagentRuns(params: {
    runs: Map<string, SubagentRunRecord>;
    runIds: readonly string[];
    leaseId: string;
    now?: number;
}): number;
/** Releases leased steering items when requester injection fails or is abandoned. */
export declare function releaseLeasedAgentSteeringItemsFromSubagentRuns(params: {
    runs: Map<string, SubagentRunRecord>;
    runIds: readonly string[];
    leaseId: string;
    error?: string;
}): number;
/** Prepend steering runtime data before the current parent-turn prompt. */
/** Prepends a steering prompt to an existing user prompt when pending results exist. */
export declare function prependAgentSteeringPrompt(params: {
    steeringPrompt: string;
    prompt: string;
}): string;
export {};
