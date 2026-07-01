/**
 * Late-bound steer hooks for the subagent registry.
 *
 * Lets steer/recovery code depend on a small module while the full registry installs concrete mutation hooks.
 */
import type { SubagentRunRecord } from "./subagent-registry.types.js";
type ReplaceSubagentRunAfterSteerParams = {
    previousRunId: string;
    nextRunId: string;
    fallback?: SubagentRunRecord;
    runTimeoutSeconds?: number;
    preserveFrozenResultFallback?: boolean;
    transcriptFile?: string;
};
type ReplaceSubagentRunAfterSteerFn = (params: ReplaceSubagentRunAfterSteerParams) => boolean;
type FinalizeInterruptedSubagentRunParams = {
    runId?: string;
    childSessionKey?: string;
    error: string;
    endedAt?: number;
};
type FinalizeInterruptedSubagentRunFn = (params: FinalizeInterruptedSubagentRunParams) => Promise<number>;
/** Installs registry mutation hooks used by steer/recovery runtime paths. */
export declare function configureSubagentRegistrySteerRuntime(params: {
    replaceSubagentRunAfterSteer: ReplaceSubagentRunAfterSteerFn;
    finalizeInterruptedSubagentRun?: FinalizeInterruptedSubagentRunFn;
}): void;
/** Replaces a previous run id after steering, returning false when no hook is installed. */
export declare function replaceSubagentRunAfterSteer(params: ReplaceSubagentRunAfterSteerParams): boolean;
/** Finalizes interrupted runs through the installed registry hook. */
export declare function finalizeInterruptedSubagentRun(params: FinalizeInterruptedSubagentRunParams): Promise<number>;
export {};
