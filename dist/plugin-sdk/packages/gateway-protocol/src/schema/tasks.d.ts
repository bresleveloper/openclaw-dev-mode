import { Type } from "typebox";
/**
 * Task ledger protocol schemas.
 *
 * Tasks represent long-running SDK/agent operations exposed through the gateway;
 * these schemas keep list/get/cancel payloads bounded and status values closed.
 */
/** Closed task lifecycle statuses visible in the gateway task ledger. */
export declare const TaskLedgerStatusSchema: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
/** Public task summary returned by task list/get/cancel responses. */
export declare const TaskSummarySchema: Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
}>;
/** Task list filters with bounded pagination. */
export declare const TasksListParamsSchema: Type.TObject<{
    status: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>, Type.TArray<Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>>]>>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    limit: Type.TOptional<Type.TInteger>;
    cursor: Type.TOptional<Type.TString>;
}>;
/** Task list page response. */
export declare const TasksListResultSchema: Type.TObject<{
    tasks: Type.TArray<Type.TObject<{
        id: Type.TString;
        kind: Type.TOptional<Type.TString>;
        runtime: Type.TOptional<Type.TString>;
        status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
        title: Type.TOptional<Type.TString>;
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
        childSessionKey: Type.TOptional<Type.TString>;
        ownerKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        taskId: Type.TOptional<Type.TString>;
        flowId: Type.TOptional<Type.TString>;
        parentTaskId: Type.TOptional<Type.TString>;
        sourceId: Type.TOptional<Type.TString>;
        createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        progressSummary: Type.TOptional<Type.TString>;
        terminalSummary: Type.TOptional<Type.TString>;
        error: Type.TOptional<Type.TString>;
    }>>;
    nextCursor: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one task id. */
export declare const TasksGetParamsSchema: Type.TObject<{
    taskId: Type.TString;
}>;
/** Lookup result for one task summary. */
export declare const TasksGetResultSchema: Type.TObject<{
    task: Type.TObject<{
        id: Type.TString;
        kind: Type.TOptional<Type.TString>;
        runtime: Type.TOptional<Type.TString>;
        status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
        title: Type.TOptional<Type.TString>;
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
        childSessionKey: Type.TOptional<Type.TString>;
        ownerKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        taskId: Type.TOptional<Type.TString>;
        flowId: Type.TOptional<Type.TString>;
        parentTaskId: Type.TOptional<Type.TString>;
        sourceId: Type.TOptional<Type.TString>;
        createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        progressSummary: Type.TOptional<Type.TString>;
        terminalSummary: Type.TOptional<Type.TString>;
        error: Type.TOptional<Type.TString>;
    }>;
}>;
/** Cancel request for one task id with optional operator reason. */
export declare const TasksCancelParamsSchema: Type.TObject<{
    taskId: Type.TString;
    reason: Type.TOptional<Type.TString>;
}>;
/** Cancel result, including the task snapshot when it was found. */
export declare const TasksCancelResultSchema: Type.TObject<{
    found: Type.TBoolean;
    cancelled: Type.TBoolean;
    reason: Type.TOptional<Type.TString>;
    task: Type.TOptional<Type.TObject<{
        id: Type.TString;
        kind: Type.TOptional<Type.TString>;
        runtime: Type.TOptional<Type.TString>;
        status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
        title: Type.TOptional<Type.TString>;
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
        childSessionKey: Type.TOptional<Type.TString>;
        ownerKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        taskId: Type.TOptional<Type.TString>;
        flowId: Type.TOptional<Type.TString>;
        parentTaskId: Type.TOptional<Type.TString>;
        sourceId: Type.TOptional<Type.TString>;
        createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
        progressSummary: Type.TOptional<Type.TString>;
        terminalSummary: Type.TOptional<Type.TString>;
        error: Type.TOptional<Type.TString>;
    }>>;
}>;
