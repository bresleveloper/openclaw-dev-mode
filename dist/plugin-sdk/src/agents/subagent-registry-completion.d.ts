import type { SubagentRunOutcome } from "./subagent-announce-output.js";
import { type SubagentLifecycleEndedOutcome, type SubagentLifecycleEndedReason } from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";
/** Returns true when a run outcome update should replace current state. */
export declare function shouldUpdateRunOutcome(current: SubagentRunOutcome | undefined, next: SubagentRunOutcome | undefined): boolean;
/** Maps registry run outcome to lifecycle event outcome. */
export declare function resolveLifecycleOutcomeFromRunOutcome(outcome: SubagentRunOutcome | undefined): SubagentLifecycleEndedOutcome;
/** Emits the subagent_ended hook once per completed run. */
export declare function emitSubagentEndedHookOnce(params: {
    entry: SubagentRunRecord;
    reason: SubagentLifecycleEndedReason;
    sendFarewell?: boolean;
    accountId?: string;
    outcome?: SubagentLifecycleEndedOutcome;
    error?: string;
    inFlightRunIds: Set<string>;
    persist: () => void;
}): Promise<boolean>;
