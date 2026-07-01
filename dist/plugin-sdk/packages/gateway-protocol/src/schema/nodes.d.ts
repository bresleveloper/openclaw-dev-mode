import { Type } from "typebox";
/** Reasons a node can report itself alive without implying an operator action. */
export declare const NodePresenceAliveReasonSchema: Type.TString;
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
export declare const NodePresenceAlivePayloadSchema: Type.TObject<{
    trigger: Type.TString;
    sentAtMs: Type.TOptional<Type.TInteger>;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    pushTransport: Type.TOptional<Type.TString>;
}>;
/** Normalized result for node-originated events after gateway dispatch. */
export declare const NodeEventResultSchema: Type.TObject<{
    ok: Type.TBoolean;
    event: Type.TString;
    handled: Type.TBoolean;
    reason: Type.TOptional<Type.TString>;
}>;
/** Pairing request metadata advertised by a node before trust is granted. */
export declare const NodePairRequestParamsSchema: Type.TObject<{
    nodeId: Type.TString;
    displayName: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    coreVersion: Type.TOptional<Type.TString>;
    uiVersion: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    caps: Type.TOptional<Type.TArray<Type.TString>>;
    commands: Type.TOptional<Type.TArray<Type.TString>>;
    permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    remoteIp: Type.TOptional<Type.TString>;
    silent: Type.TOptional<Type.TBoolean>;
}>;
/** Lists pending node-pairing requests. */
export declare const NodePairListParamsSchema: Type.TObject<{}>;
/** Approves a pending node-pairing request by request id. */
export declare const NodePairApproveParamsSchema: Type.TObject<{
    requestId: Type.TString;
}>;
/** Rejects a pending node-pairing request by request id. */
export declare const NodePairRejectParamsSchema: Type.TObject<{
    requestId: Type.TString;
}>;
/** Removes an already paired node from the gateway trust set. */
export declare const NodePairRemoveParamsSchema: Type.TObject<{
    nodeId: Type.TString;
}>;
/** Verifies node ownership with a short-lived pairing token. */
export declare const NodePairVerifyParamsSchema: Type.TObject<{
    nodeId: Type.TString;
    token: Type.TString;
}>;
/** Renames a paired node while preserving its stable node id. */
export declare const NodeRenameParamsSchema: Type.TObject<{
    nodeId: Type.TString;
    displayName: Type.TString;
}>;
/** Lists paired nodes known to the gateway. */
export declare const NodeListParamsSchema: Type.TObject<{}>;
/** Acknowledges queued node work that the node has consumed. */
export declare const NodePendingAckParamsSchema: Type.TObject<{
    ids: Type.TArray<Type.TString>;
}>;
/** Requests detailed metadata for one paired node. */
export declare const NodeDescribeParamsSchema: Type.TObject<{
    nodeId: Type.TString;
}>;
/** Invokes a command on a paired node; idempotency allows safe retries. */
export declare const NodeInvokeParamsSchema: Type.TObject<{
    nodeId: Type.TString;
    command: Type.TString;
    params: Type.TOptional<Type.TUnknown>;
    timeoutMs: Type.TOptional<Type.TInteger>;
    idempotencyKey: Type.TString;
}>;
/** Result callback payload for a node command invocation. */
export declare const NodeInvokeResultParamsSchema: Type.TObject<{
    id: Type.TString;
    nodeId: Type.TString;
    ok: Type.TBoolean;
    payload: Type.TOptional<Type.TUnknown>;
    payloadJSON: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TObject<{
        code: Type.TOptional<Type.TString>;
        message: Type.TOptional<Type.TString>;
    }>>;
}>;
/** Generic node event envelope accepted by the gateway. */
export declare const NodeEventParamsSchema: Type.TObject<{
    event: Type.TString;
    payload: Type.TOptional<Type.TUnknown>;
    payloadJSON: Type.TOptional<Type.TString>;
}>;
/** Request for a bounded batch of queued work assigned to the calling node. */
export declare const NodePendingDrainParamsSchema: Type.TObject<{
    maxItems: Type.TOptional<Type.TInteger>;
}>;
/** One queued node-work item returned by pending-work drain calls. */
export declare const NodePendingDrainItemSchema: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    priority: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
}>;
/** Drain response with a revision marker for node queue state. */
export declare const NodePendingDrainResultSchema: Type.TObject<{
    nodeId: Type.TString;
    revision: Type.TInteger;
    items: Type.TArray<Type.TObject<{
        id: Type.TString;
        type: Type.TString;
        priority: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
        payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>;
    hasMore: Type.TBoolean;
}>;
/** Enqueues gateway-initiated work for a paired node. */
export declare const NodePendingEnqueueParamsSchema: Type.TObject<{
    nodeId: Type.TString;
    type: Type.TString;
    priority: Type.TOptional<Type.TString>;
    expiresInMs: Type.TOptional<Type.TInteger>;
    wake: Type.TOptional<Type.TBoolean>;
}>;
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
export declare const NodePendingEnqueueResultSchema: Type.TObject<{
    nodeId: Type.TString;
    revision: Type.TInteger;
    queued: Type.TObject<{
        id: Type.TString;
        type: Type.TString;
        priority: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
        payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>;
    wakeTriggered: Type.TBoolean;
}>;
/** Event payload used by the gateway to ask a node to run a command. */
export declare const NodeInvokeRequestEventSchema: Type.TObject<{
    id: Type.TString;
    nodeId: Type.TString;
    command: Type.TString;
    paramsJSON: Type.TOptional<Type.TString>;
    timeoutMs: Type.TOptional<Type.TInteger>;
    idempotencyKey: Type.TOptional<Type.TString>;
}>;
