/** Reactivates a completed subagent session by swapping in the new run id. */
export declare function reactivateCompletedSubagentSession(params: {
    sessionKey: string;
    runId?: string;
}): Promise<boolean>;
