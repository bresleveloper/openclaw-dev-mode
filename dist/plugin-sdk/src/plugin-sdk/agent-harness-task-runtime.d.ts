import { deliverSubagentAnnouncement } from "../agents/subagent-announce-delivery.js";
import { type AgentHarnessTaskRuntimeScope } from "../tasks/agent-harness-task-runtime-scope.js";
import { createRunningTaskRun, finalizeTaskRunByRunId, recordTaskRunProgressByRunId, setDetachedTaskDeliveryStatusByRunId } from "../tasks/detached-task-runtime.js";
import { type TaskRecord } from "../tasks/runtime-internal.js";
export type { TaskRecord as AgentHarnessTaskRecord };
export type { AgentHarnessTaskRuntimeScope };
type AgentHarnessTaskRuntimeId = Parameters<typeof createRunningTaskRun>[0]["runtime"];
type CreateRunningTaskRunParams = Parameters<typeof createRunningTaskRun>[0];
type RecordTaskRunProgressParams = Parameters<typeof recordTaskRunProgressByRunId>[0];
type FinalizeTaskRunParams = Parameters<typeof finalizeTaskRunByRunId>[0];
type SetDeliveryStatusParams = Parameters<typeof setDetachedTaskDeliveryStatusByRunId>[0];
/** Scope and naming options used to bind task operations to one requester session. */
export type AgentHarnessTaskRuntimeScopeParams = {
    runtime: AgentHarnessTaskRuntimeId;
    scope: AgentHarnessTaskRuntimeScope;
    taskKind?: string;
    runIdPrefix?: string;
};
/** Create-task params with runtime and requester scope supplied by the scoped task runtime. */
export type AgentHarnessScopedCreateRunningTaskRunParams = Omit<CreateRunningTaskRunParams, "runtime" | "taskKind" | "requesterSessionKey" | "ownerKey" | "scopeKind"> & {
    runId: string;
};
/** Progress params scoped to the requester session owned by the harness runtime. */
export type AgentHarnessScopedRecordTaskRunProgressParams = Omit<RecordTaskRunProgressParams, "runtime" | "sessionKey">;
/** Finalization params scoped to the requester session owned by the harness runtime. */
export type AgentHarnessScopedFinalizeTaskRunParams = Omit<FinalizeTaskRunParams, "runtime" | "sessionKey">;
/** Delivery-status params scoped to the requester session owned by the harness runtime. */
export type AgentHarnessScopedSetDeliveryStatusParams = Omit<SetDeliveryStatusParams, "runtime" | "sessionKey">;
/** Scoped task runtime that prevents callers from mutating tasks outside their harness scope. */
export type AgentHarnessTaskRuntime = {
    createRunningTaskRun(params: AgentHarnessScopedCreateRunningTaskRunParams): TaskRecord;
    tryCreateRunningTaskRun(params: AgentHarnessScopedCreateRunningTaskRunParams): TaskRecord | null;
    recordTaskRunProgressByRunId(params: AgentHarnessScopedRecordTaskRunProgressParams): TaskRecord[];
    finalizeTaskRunByRunId(params: AgentHarnessScopedFinalizeTaskRunParams): TaskRecord[];
    setDetachedTaskDeliveryStatusByRunId(params: AgentHarnessScopedSetDeliveryStatusParams): TaskRecord[];
    listTaskRecords(): TaskRecord[];
};
/** Completion states a harness task can report to its requester. */
export type AgentHarnessCompletionStatus = "succeeded" | "failed" | "cancelled";
/** Delivery result returned after routing a harness task completion announcement. */
export type AgentHarnessCompletionDelivery = Awaited<ReturnType<typeof deliverSubagentAnnouncement>>;
/** Creates a task runtime whose run ids and task records are constrained to one scope. */
export declare function createAgentHarnessTaskRuntime(params: AgentHarnessTaskRuntimeScopeParams): AgentHarnessTaskRuntime;
/** Delivers a completed harness task result back to the requester or parent session. */
export declare function deliverAgentHarnessTaskCompletion(params: {
    scope: AgentHarnessTaskRuntimeScope;
    childSessionKey: string;
    childSessionId: string;
    announceId: string;
    status: AgentHarnessCompletionStatus;
    statusLabel?: string;
    result: string;
    taskLabel?: string;
    announceType?: string;
    replyInstruction?: string;
    signal?: AbortSignal;
}): Promise<AgentHarnessCompletionDelivery>;
/** Returns true when completion delivery reached a persistent direct or steered path. */
export declare function isDurableAgentHarnessCompletionDelivery(delivery: AgentHarnessCompletionDelivery): boolean;
