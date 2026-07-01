import type { ExecApprovalForwardingConfig, ExecApprovalForwardingMode } from "../config/types.approvals.js";
import { type ExecApprovalReplyMetadata } from "../infra/exec-approval-reply.js";
import type { ExecApprovalSessionTarget } from "../infra/exec-approval-session-target.js";
import type { ExecApprovalRequest } from "../infra/exec-approvals.js";
import type { PluginApprovalRequest } from "../infra/plugin-approvals.js";
import type { ChannelApprovalCapability, ChannelOutboundPayloadHint } from "./channel-contract.js";
import type { OpenClawConfig } from "./config-runtime.js";
import type { ReplyPayload } from "./reply-payload.js";
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalKind = "exec" | "plugin";
type DeliverySuppressionInput = Parameters<NonNullable<NonNullable<ChannelApprovalCapability["delivery"]>["shouldSuppressForwardingFallback"]>>[0];
type NativeApprovalForwardTarget = DeliverySuppressionInput["target"];
type LocalNativeExecApprovalConfig = {
    enabled?: boolean | "auto";
    mode?: string | null;
    agentFilter?: string[];
    sessionFilter?: string[];
};
type ChannelApprovalForwardTarget = DeliverySuppressionInput["target"];
type ApprovalResolverParams = {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind?: ApprovalKind;
    request: ApprovalRequest;
};
type ChannelApprovalForwardingEvaluatorParams = {
    channel: string;
    isTransportEnabled: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => boolean;
    hasMatchingTarget: (params: {
        cfg: OpenClawConfig;
        config: ExecApprovalForwardingConfig;
        accountId?: string | null;
        target?: ChannelApprovalForwardTarget;
    }) => boolean;
    hasOriginOrSessionTarget: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        request: ApprovalRequest;
    }) => boolean;
};
/** Inputs for checking whether one approval request can use session-native forwarding. */
export type ChannelApprovalForwardingEligibilityParams = {
    /** Full config containing exec/plugin approval forwarding settings. */
    cfg: OpenClawConfig;
    /** Optional channel account id for account-scoped transport checks. */
    accountId?: string | null;
    /** Approval family whose forwarding config should be evaluated. */
    approvalKind: ApprovalKind;
    /** Approval request being considered for native delivery. */
    request: ApprovalRequest;
};
/** Inputs for checking whether approval forwarding is configured for a channel route. */
export type ChannelApprovalPotentialRouteParams = {
    /** Full config containing exec/plugin approval forwarding settings. */
    cfg: OpenClawConfig;
    /** Optional channel account id for account-scoped transport checks. */
    accountId?: string | null;
    /** Approval family whose forwarding config should be evaluated. */
    approvalKind: ApprovalKind;
    /** When true, ignore explicit target routes and only consider session/native origin routes. */
    nativeSessionOnly?: boolean;
};
/** Inputs for checking whether one configured target can receive an approval request. */
export type ChannelApprovalExplicitTargetEligibilityParams = ChannelApprovalForwardingEligibilityParams & {
    /** Forwarding target that may be handled by the channel-native approval route. */
    target: ChannelApprovalForwardTarget;
};
type NativeApprovalTargetNormalizer<TTarget> = (target: TTarget, request: ApprovalRequest) => TTarget | null | undefined;
type NativeApprovalForwardingFallbackSuppressorParams<TTarget extends NativeApprovalTarget> = {
    channel: string;
    normalizeForwardTarget: (target: NativeApprovalForwardTarget) => TTarget | null;
    resolveAccountId?: (params: {
        forwardingTarget: TTarget;
        target: NativeApprovalForwardTarget;
        request: ApprovalRequest;
    }) => string | null | undefined;
    resolveApprovalKind?: (params: {
        approvalKind?: ApprovalKind;
        request: ApprovalRequest;
    }) => ApprovalKind;
    isSessionRouteEligible: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind: ApprovalKind;
        request: ApprovalRequest;
    }) => boolean;
    isExplicitTargetEligible?: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind: ApprovalKind;
        request: ApprovalRequest;
        target: NativeApprovalForwardTarget;
    }) => boolean;
    resolveForwardingTargetForMatch?: (params: {
        forwardingTarget: TTarget;
        accountId?: string | null;
        target: NativeApprovalForwardTarget;
        approvalKind: ApprovalKind;
        request: ApprovalRequest;
    }) => TTarget | null;
    resolveOriginTarget: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind: ApprovalKind;
        request: ApprovalRequest;
    }) => TTarget | null;
    resolveApproverDmTargets: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind: ApprovalKind;
        request: ApprovalRequest;
    }) => readonly TTarget[];
    targetsMatch?: (left: TTarget, right: TTarget) => boolean;
};
type NativeApprovalChannelRouteGateParams<TTarget extends NativeApprovalTarget> = {
    channel: string;
    defaultForwardingMode: ExecApprovalForwardingMode;
    isTransportEnabled: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => boolean;
    listAccountIds: (cfg: OpenClawConfig) => readonly string[];
    resolveDefaultAccountId: (cfg: OpenClawConfig) => string;
    normalizeForwardTarget: (target: NativeApprovalForwardTarget) => TTarget | null;
    resolveTurnSourceTarget: (request: ApprovalRequest) => TTarget | null;
    targetsMatch?: (left: TTarget, right: TTarget) => boolean;
};
type NativeApprovalChannelRouteGates = {
    canApprovalPotentiallyRouteToChannel: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind: ApprovalKind;
        nativeSessionOnly?: boolean;
    }) => boolean;
    canAnyApprovalPotentiallyRouteToChannel: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        nativeSessionOnly?: boolean;
    }) => boolean;
    isNativeApprovalHandlerConfigured: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => boolean;
    isSessionApprovalEligible: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind: ApprovalKind;
        request: ApprovalRequest;
    }) => boolean;
    isExplicitTargetEligible: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind: ApprovalKind;
        request: ApprovalRequest;
        target: NativeApprovalForwardTarget;
    }) => boolean;
    shouldHandleApprovalRequest: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind?: ApprovalKind;
        request: ApprovalRequest;
    }) => boolean;
};
type BaseOriginResolverParams<TTarget> = {
    /** Channel id whose origin target should be resolved. */
    channel: string;
    /** Optional gate; returning false prevents native origin delivery. */
    shouldHandleRequest?: (params: ApprovalResolverParams) => boolean;
    /** Maps request turn-source metadata to a native target. */
    resolveTurnSourceTarget: (request: ApprovalRequest) => TTarget | null;
    /** Maps a persisted session target to a native target. */
    resolveSessionTarget: (sessionTarget: ExecApprovalSessionTarget, request: ApprovalRequest) => TTarget | null;
    /** Normalizes the returned target before delivery. */
    normalizeTarget?: NativeApprovalTargetNormalizer<TTarget>;
    /** Normalizes only matcher inputs when delivery target shape must stay native. */
    normalizeTargetForMatch?: NativeApprovalTargetNormalizer<TTarget>;
    /** Optional fallback target when neither turn-source nor session target resolves. */
    resolveFallbackTarget?: (request: ApprovalRequest) => TTarget | null;
};
type NativeOriginResolverParams<TTarget extends NativeApprovalTarget> = BaseOriginResolverParams<TTarget> & {
    /** Optional native target matcher; defaults to route-exact target matching. */
    targetsMatch?: (a: TTarget, b: TTarget) => boolean;
};
type CustomOriginResolverParams<TTarget> = BaseOriginResolverParams<TTarget> & {
    /** Custom matcher required when target shape is not `NativeApprovalTarget`. */
    targetsMatch: (a: TTarget, b: TTarget) => boolean;
};
/** Standard channel-native approval destination used by route and origin matchers. */
export type NativeApprovalTarget = {
    /** Channel-local destination id. */
    to: string;
    /** Optional channel account id associated with the destination. */
    accountId?: string | null;
    /** Optional thread/topic id inside the destination. */
    threadId?: string | number | null;
};
/** Compare channel-native approval targets with the same normalization used by outbound routes. */
export declare function nativeApprovalTargetsMatch(params: {
    /** Channel id used for route target normalization. */
    channel?: string | null;
    /** Left native target to compare. */
    left: NativeApprovalTarget;
    /** Right native target to compare. */
    right: NativeApprovalTarget;
}): boolean;
/** Decide whether a channel-native exec approval route replaces the local text prompt. */
export declare function shouldSuppressLocalNativeExecApprovalPrompt(params: {
    /** Full config containing top-level or channel-specific approval settings. */
    cfg: OpenClawConfig;
    /** Optional channel account id for account-scoped native delivery checks. */
    accountId?: string | null;
    /** Reply payload that may already contain exec approval metadata. */
    payload: ReplyPayload;
    /** Outbound payload hint proving an active native exec approval route. */
    hint?: ChannelOutboundPayloadHint;
    /** Legacy transport gate for native delivery. */
    isTransportEnabled?: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => boolean;
    /** Preferred transport gate for native delivery. */
    isNativeDeliveryEnabled?: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => boolean;
    /** Optional channel-specific approval config resolver. */
    resolveApprovalConfig?: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        metadata: ExecApprovalReplyMetadata;
    }) => LocalNativeExecApprovalConfig | undefined;
    /** Whether the resolved approval config must be enabled before suppressing local prompt. */
    requireApprovalConfigEnabled?: boolean;
    /** Whether forwarding mode must be session/both unless exact target proof is present. */
    enforceForwardingMode?: boolean;
    /** Optional session-route gate for the approval metadata. */
    isSessionRouteEligible?: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        metadata: ExecApprovalReplyMetadata;
    }) => boolean;
    /** Proof that target-mode forwarding already matched this exact native target. */
    hasExactTargetProof?: boolean;
    /** Whether agent filters may fall back to the agent segment in sessionKey. */
    fallbackAgentIdFromSessionKey?: boolean;
}): boolean;
/** Infer approval family from the request shape unless the caller already knows it. */
export declare function resolveApprovalKind(request: ApprovalRequest, approvalKind?: ApprovalKind): ApprovalKind;
/** Build reusable forwarding gates for channels with custom target matching logic. */
export declare function createChannelApprovalForwardingEvaluator(params: ChannelApprovalForwardingEvaluatorParams): {
    canAnyPotentiallyRoute: (input: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        nativeSessionOnly?: boolean;
    }) => boolean;
    isExplicitTargetEligible: (input: ChannelApprovalExplicitTargetEligibilityParams) => boolean;
    isPotentialRoute: (input: ChannelApprovalPotentialRouteParams) => boolean;
    isSessionEligible: (input: ChannelApprovalForwardingEligibilityParams) => boolean;
    shouldHandleRequest: (input: {
        cfg: OpenClawConfig;
        accountId?: string | null;
        approvalKind?: ApprovalKind;
        request: ApprovalRequest;
    }) => boolean;
};
/** Create the standard route gates for native channel approval forwarding. */
export declare function createNativeApprovalChannelRouteGates<TTarget extends NativeApprovalTarget>(params: NativeApprovalChannelRouteGateParams<TTarget>): NativeApprovalChannelRouteGates;
/** Create a fallback suppressor that avoids duplicate approval prompts after native delivery. */
export declare function createNativeApprovalForwardingFallbackSuppressor<TTarget extends NativeApprovalTarget>(params: NativeApprovalForwardingFallbackSuppressorParams<TTarget>): NonNullable<NonNullable<ChannelApprovalCapability["delivery"]>["shouldSuppressForwardingFallback"]>;
/** Resolve a request origin target using standard native approval target matching. */
export declare function createChannelNativeOriginTargetResolver<TTarget extends NativeApprovalTarget>(params: NativeOriginResolverParams<TTarget>): (input: ApprovalResolverParams) => TTarget | null;
/** Resolve a request origin target for channels with custom target shapes. */
export declare function createChannelNativeOriginTargetResolver<TTarget>(params: CustomOriginResolverParams<TTarget>): (input: ApprovalResolverParams) => TTarget | null;
/** Create a resolver for configured approver DM targets. */
export declare function createChannelApproverDmTargetResolver<TApprover, TTarget extends NativeApprovalTarget = NativeApprovalTarget>(params: {
    /** Optional gate; returning false skips approver DM delivery for the request. */
    shouldHandleRequest?: (params: ApprovalResolverParams) => boolean;
    /** Resolves approver records from config and optional account scope. */
    resolveApprovers: (params: {
        cfg: OpenClawConfig;
        accountId?: string | null;
    }) => readonly TApprover[];
    /** Maps one approver record to a native DM target; nullish results are skipped. */
    mapApprover: (approver: TApprover, params: ApprovalResolverParams) => TTarget | null | undefined;
}): (input: ApprovalResolverParams) => TTarget[];
export {};
