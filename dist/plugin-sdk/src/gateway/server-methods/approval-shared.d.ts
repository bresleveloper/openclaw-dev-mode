import { ErrorCodes } from "../../../packages/gateway-protocol/src/index.js";
import type { ValidationError } from "../../../packages/gateway-protocol/src/index.js";
import type { ExecApprovalDecision } from "../../infra/exec-approvals.js";
import type { ExecApprovalManager, ExecApprovalRecord } from "../exec-approval-manager.js";
import type { GatewayClient, GatewayRequestContext, RespondFn } from "./types.js";
type PendingApprovalLookupError = "missing" | {
    code: (typeof ErrorCodes)["INVALID_REQUEST"];
    message: string;
};
type ApprovalTurnSourceFields = {
    turnSourceChannel?: string | null;
    turnSourceAccountId?: string | null;
};
type RequestedApprovalEvent<TPayload extends ApprovalTurnSourceFields> = {
    id: string;
    request: TPayload;
    createdAtMs: number;
    expiresAtMs: number;
};
type PendingApprovalListEntry<TPayload> = {
    id: string;
    request: TPayload;
    createdAtMs: number;
    expiresAtMs: number;
};
type ApprovalResolveParams = {
    id: string;
    decision: string;
};
type ApprovalResolveParamsValidator<TParams extends ApprovalResolveParams> = ((params: unknown) => params is TParams) & {
    errors?: ValidationError[] | null;
};
type ApprovalRecordLookupResult<TPayload> = {
    ok: true;
    approvalId: string;
    snapshot: ExecApprovalRecord<TPayload>;
} | {
    ok: false;
    response: PendingApprovalLookupError;
};
export declare function isApprovalDecision(value: string): value is ExecApprovalDecision;
/** Checks whether a client can observe or resolve an approval record. */
export declare function isApprovalRecordVisibleToClient<TPayload>(params: {
    record: ExecApprovalRecord<TPayload>;
    client: GatewayClient | null;
}): boolean;
/** Returns only pending approval requests the connected client is allowed to see. */
export declare function listVisiblePendingApprovalRequests<TPayload>(params: {
    manager: ExecApprovalManager<TPayload>;
    client?: GatewayClient | null;
}): PendingApprovalListEntry<TPayload>[];
/** Binds the current gateway client identity onto a newly-created approval record. */
export declare function bindApprovalRequesterMetadata<TPayload>(params: {
    record: ExecApprovalRecord<TPayload>;
    client?: GatewayClient | null;
}): void;
export declare function bindApprovalReviewerDeviceIds<TPayload>(params: {
    record: ExecApprovalRecord<TPayload>;
    deviceIds?: readonly string[] | null;
}): void;
/** Registers an approval record and converts manager registration errors to gateway errors. */
export declare function registerPendingApprovalRecord<TPayload>(params: {
    manager: ExecApprovalManager<TPayload>;
    record: ExecApprovalRecord<TPayload>;
    timeoutMs: number;
    respond: RespondFn;
}): Promise<ExecApprovalDecision | null> | undefined;
/** Builds the gateway event payload broadcast when an approval starts waiting. */
export declare function buildRequestedApprovalEvent<TPayload extends ApprovalTurnSourceFields>(record: ExecApprovalRecord<TPayload>): RequestedApprovalEvent<TPayload>;
/** Validates approval resolve params and narrows the decision to the supported enum. */
export declare function resolveApprovalDecisionParams<TParams extends ApprovalResolveParams>(params: {
    rawParams: unknown;
    validate: ApprovalResolveParamsValidator<TParams>;
    methodName: string;
    respond: RespondFn;
}): {
    inputId: string;
    decision: ExecApprovalDecision;
} | null;
/** Resolves the approval clients that should receive request or resolution events. */
export declare function resolveApprovalRequestRecipientConnIds<TPayload>(params: {
    context: GatewayRequestContext;
    record: ExecApprovalRecord<TPayload>;
    excludeConnId?: string;
}): ReadonlySet<string> | null;
/** Finds a pending approval by full id or prefix after applying client visibility rules. */
export declare function resolvePendingApprovalRecord<TPayload>(params: {
    manager: ExecApprovalManager<TPayload>;
    inputId: string;
    client?: GatewayClient | null;
    exposeAmbiguousPrefixError?: boolean;
}): ApprovalRecordLookupResult<TPayload>;
/** Sends the public lookup failure shape for missing, expired, or ambiguous approvals. */
export declare function respondPendingApprovalLookupError(params: {
    respond: RespondFn;
    response: PendingApprovalLookupError;
}): void;
/** Waits for an already-registered approval decision visible to the caller. */
export declare function handleApprovalWaitDecision<TPayload>(params: {
    manager: ExecApprovalManager<TPayload>;
    inputId: unknown;
    client?: GatewayClient | null;
    respond: RespondFn;
}): Promise<void>;
/** Broadcasts or routes a pending approval request, then responds after acceptance/decision. */
export declare function handlePendingApprovalRequest<TPayload extends ApprovalTurnSourceFields>(params: {
    manager: ExecApprovalManager<TPayload>;
    record: ExecApprovalRecord<TPayload>;
    decisionPromise: Promise<ExecApprovalDecision | null>;
    respond: RespondFn;
    context: GatewayRequestContext;
    clientConnId?: string;
    requestEventName: string;
    requestEvent: RequestedApprovalEvent<TPayload>;
    twoPhase: boolean;
    approvalKind?: "exec" | "plugin";
    deliverRequest: () => boolean | Promise<boolean>;
    afterDecision?: (decision: ExecApprovalDecision | null, requestEvent: RequestedApprovalEvent<TPayload>) => Promise<void> | void;
    afterDecisionErrorLabel?: string;
    keepPendingWithoutRoute?: boolean;
    requireDeliveryRoute?: boolean;
    suppressDelivery?: boolean;
}): Promise<void>;
/** Resolves a pending approval and broadcasts the final decision exactly once. */
export declare function handleApprovalResolve<TPayload, TResolvedEvent extends object>(params: {
    manager: ExecApprovalManager<TPayload>;
    inputId: string;
    decision: ExecApprovalDecision;
    respond: RespondFn;
    context: GatewayRequestContext;
    client: GatewayClient | null;
    exposeAmbiguousPrefixError?: boolean;
    validateDecision?: (snapshot: ExecApprovalRecord<TPayload>) => {
        message: string;
        details?: Record<string, unknown>;
    } | null | undefined;
    resolvedEventName: string;
    buildResolvedEvent: (params: {
        approvalId: string;
        decision: ExecApprovalDecision;
        resolvedBy: string | null;
        snapshot: ExecApprovalRecord<TPayload>;
        nowMs: number;
    }) => TResolvedEvent;
    forwardResolved?: (event: TResolvedEvent) => Promise<void> | void;
    forwardResolvedErrorLabel?: string;
    extraResolvedHandlers?: Array<{
        run: (event: TResolvedEvent) => Promise<void> | void;
        errorLabel: string;
    }>;
}): Promise<void>;
export {};
