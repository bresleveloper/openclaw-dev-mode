import type { SubagentRunRecord } from "./subagent-registry.types.js";
/** Returns the best available session start timestamp for a run record. */
export declare function getSubagentSessionStartedAt(entry: Pick<SubagentRunRecord, "sessionStartedAt" | "startedAt" | "createdAt"> | null | undefined): number | undefined;
/** Computes accumulated runtime including the current live run when still active. */
export declare function getSubagentSessionRuntimeMs(entry: Pick<SubagentRunRecord, "startedAt" | "endedAt" | "accumulatedRuntimeMs"> | null | undefined, now?: number): number | undefined;
/** Maps persisted run outcome fields to the compact session status shown in tools/UI. */
export declare function resolveSubagentSessionStatus(entry: Pick<SubagentRunRecord, "endedAt" | "endedReason" | "outcome"> | null | undefined): "running" | "killed" | "failed" | "timeout" | "done" | undefined;
