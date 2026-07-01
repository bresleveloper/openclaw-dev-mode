import type { SubagentRunRecord } from "../../agents/subagent-registry.types.js";
/** Builds the compact status line for active and completed subagents. */
export declare function buildSubagentsStatusLine(params: {
    runs: SubagentRunRecord[];
    verboseEnabled: boolean;
    pendingDescendantsForRun: (entry: SubagentRunRecord) => number;
    now?: number;
}): string | undefined;
