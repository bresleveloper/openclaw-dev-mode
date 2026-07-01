import type { SubagentRunRecord } from "./subagent-registry.types.js";
/** Convert subagent timeout seconds to a timer-safe delay. */
export declare function resolveSubagentRunTimerDelayMs(timeoutSeconds: unknown): number | undefined;
/** Convert subagent timeout seconds to a finite millisecond duration. */
export declare function resolveSubagentRunDurationMs(timeoutSeconds: unknown): number | undefined;
/** Resolve the absolute timeout deadline for a subagent run. */
export declare function resolveSubagentRunDeadlineMs(entry: Pick<SubagentRunRecord, "createdAt" | "startedAt" | "runTimeoutSeconds">, observedStartedAt?: number): number | undefined;
