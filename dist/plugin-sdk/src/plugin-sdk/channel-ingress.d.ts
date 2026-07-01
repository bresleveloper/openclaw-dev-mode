import { decideChannelIngress } from "../channels/message-access/index.js";
import type { AccessGraphGate, ChannelIngressDecision, ChannelIngressIdentifierKind, ChannelIngressPolicyInput, ChannelIngressState, ChannelIngressStateInput as MessageAccessChannelIngressStateInput, IngressGateKind, IngressGatePhase, InternalChannelIngressAdapter, InternalChannelIngressNormalizeResult, InternalChannelIngressSubject, InternalMatchMaterial, InternalNormalizedEntry, IngressReasonCode } from "../channels/message-access/index.js";
import type { AccessFacts, ChannelTurnAdmission } from "../channels/turn/types.js";
import type { DmGroupAccessDecision, DmGroupAccessReasonCode } from "../security/dm-policy-shared.js";
export { decideChannelIngress };
export type { AccessGraph, AccessGraphGate, AccessGroupMembershipFact, ChannelIngressAdmission, ChannelIngressChannelId, ChannelIngressDecision, ChannelIngressEventInput, ChannelIngressIdentifierKind, ChannelIngressNormalizedEntry, ChannelIngressPolicyInput, ChannelIngressState, IngressGateEffect, IngressGateKind, IngressGatePhase, IngressReasonCode, MatchableIdentifier, RedactedChannelIngressEvent, RedactedIngressAllowlistFacts, RedactedIngressEntryDiagnostic, RedactedIngressMatch, ResolvedIngressAllowlist, ResolvedRouteGateFacts, RouteGateFacts, RouteGateState, RouteSenderAllowlistSource, RouteSenderPolicy, } from "../channels/message-access/index.js";
/** Redacted identifier material that can be matched against channel allowlist entries. */
export type ChannelIngressSubjectIdentifier = InternalMatchMaterial;
/** Inbound actor identity described by one or more channel-specific identifiers. */
export type ChannelIngressSubject = InternalChannelIngressSubject;
/** Normalized allowlist entry produced by a channel ingress adapter. */
export type ChannelIngressAdapterEntry = InternalNormalizedEntry;
/** Adapter normalization output split into matchable, invalid, and disabled entries. */
export type ChannelIngressAdapterNormalizeResult = InternalChannelIngressNormalizeResult;
/** Channel-specific allowlist normalizer and subject matcher used by ingress policy. */
export type ChannelIngressAdapter = InternalChannelIngressAdapter;
/** SDK-facing input shape for resolving redacted channel ingress state. */
export type ChannelIngressStateInput = MessageAccessChannelIngressStateInput;
declare const CHANNEL_INGRESS_PLUGIN_ID: unique symbol;
/** Branded plugin id used in stable ingress diagnostics and generated gate identifiers. */
export type ChannelIngressPluginId = string & {
    readonly [CHANNEL_INGRESS_PLUGIN_ID]: true;
};
/** Selector for a single access-graph gate in an ingress decision. */
export type ChannelIngressGateSelector = {
    phase: IngressGatePhase;
    kind: IngressGateKind;
};
/** Canonical direct/group and command/non-command decisions for one inbound event. */
export type ChannelIngressDecisionBundle = {
    dm: ChannelIngressDecision;
    group: ChannelIngressDecision;
    dmCommand: ChannelIngressDecision;
    groupCommand: ChannelIngressDecision;
};
/** Side effect produced while handling an ingress decision before turn admission is mapped. */
export type ChannelIngressSideEffectResult = {
    kind: "none";
} | {
    kind: "pairing-reply-sent";
} | {
    kind: "pairing-reply-failed";
    errorCode?: string;
} | {
    kind: "command-reply-sent";
} | {
    kind: "command-reply-failed";
    errorCode?: string;
} | {
    kind: "pending-history-recorded";
} | {
    kind: "local-event-handled";
};
/** Minimal redacted decision summary suitable for logs and plugin diagnostics. */
export type RedactedIngressDiagnostics = {
    decisiveGateId?: string;
    reasonCode: IngressReasonCode;
};
/** Stable selectors for the ingress gates most plugin SDK callers inspect. */
export declare const CHANNEL_INGRESS_GATE_SELECTORS: {
    readonly command: {
        readonly phase: "command";
        readonly kind: "command";
    };
    readonly activation: {
        readonly phase: "activation";
        readonly kind: "mention";
    };
    readonly dmSender: {
        readonly phase: "sender";
        readonly kind: "dmSender";
    };
    readonly groupSender: {
        readonly phase: "sender";
        readonly kind: "groupSender";
    };
    readonly event: {
        readonly phase: "event";
        readonly kind: "event";
    };
};
/** Input descriptor for a single channel subject identifier before redacted normalization. */
export type ChannelIngressSubjectIdentifierInput = {
    value: string;
    opaqueId?: string;
    kind?: ChannelIngressIdentifierKind;
    dangerous?: boolean;
    sensitivity?: "normal" | "pii";
};
/** Options for the common one-string-id allowlist adapter. */
export type CreateChannelIngressStringAdapterParams = {
    kind?: ChannelIngressIdentifierKind;
    normalizeEntry?: (value: string) => string | null | undefined;
    normalizeSubject?: (value: string) => string | null | undefined;
    isWildcardEntry?: (value: string) => boolean;
    resolveEntryId?: (params: {
        entry: string;
        index: number;
    }) => string;
    dangerous?: boolean | ((entry: string) => boolean);
    sensitivity?: "normal" | "pii";
};
/** Options for adapters that expand each allowlist entry into multiple identifier records. */
export type CreateChannelIngressMultiIdentifierAdapterParams = {
    normalizeEntry: (entry: string, index: number) => readonly ChannelIngressAdapterEntry[];
    getEntryMatchKey?: (entry: ChannelIngressAdapterEntry) => string | null | undefined;
    getSubjectMatchKeys?: (identifier: ChannelIngressSubjectIdentifier) => readonly (string | null | undefined)[];
    isWildcardEntry?: (entry: ChannelIngressAdapterEntry) => boolean;
};
/** Legacy DM/group access projection retained for older channel runtime callers. */
export type ChannelIngressDmGroupAccessProjection = {
    decision: DmGroupAccessDecision;
    reasonCode: DmGroupAccessReasonCode;
    reason: string;
};
/** Sender-only group access projection used when command and sender gates are evaluated separately. */
export type ChannelIngressSenderGroupAccessProjection = {
    allowed: boolean;
    groupPolicy: ChannelIngressPolicyInput["groupPolicy"];
    providerMissingFallbackApplied: boolean;
    reason: "allowed" | "disabled" | "empty_allowlist" | "sender_not_allowlisted";
};
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export type ResolveChannelIngressAccessParams = ChannelIngressStateInput & {
    policy: ChannelIngressPolicyInput;
    effectiveAllowFrom?: readonly string[];
    effectiveGroupAllowFrom?: readonly string[];
};
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
export type ResolvedChannelIngressAccess = {
    state: ChannelIngressState;
    ingress: ChannelIngressDecision;
    isGroup: boolean;
    senderReasonCode: IngressReasonCode;
    access: ChannelIngressDmGroupAccessProjection & {
        effectiveAllowFrom: string[];
        effectiveGroupAllowFrom: string[];
    };
    commandAuthorized: boolean;
    shouldBlockControlCommand: boolean;
};
/** Find the first gate matching a selector in an ingress decision graph. */
export declare function findChannelIngressGate(decision: ChannelIngressDecision, selector: ChannelIngressGateSelector): AccessGraphGate | undefined;
/** Find the sender gate for a DM or group ingress decision. */
export declare function findChannelIngressSenderGate(decision: ChannelIngressDecision, params: {
    isGroup: boolean;
}): AccessGraphGate | undefined;
/** Find the command authorization gate in an ingress decision, when command policy ran. */
export declare function findChannelIngressCommandGate(decision: ChannelIngressDecision): AccessGraphGate | undefined;
/** Run base and command ingress decisions for both DM and group states. */
export declare function decideChannelIngressBundle(params: {
    directState: ChannelIngressState;
    groupState: ChannelIngressState;
    basePolicy: ChannelIngressPolicyInput;
    commandPolicy: ChannelIngressPolicyInput;
}): ChannelIngressDecisionBundle;
/** Project a full ingress decision graph into the legacy AccessFacts shape used by channels. */
export declare function projectIngressAccessFacts(decision: ChannelIngressDecision): AccessFacts;
/** Convert an ingress graph decision plus any local side effect into channel turn admission. */
export declare function mapChannelIngressDecisionToTurnAdmission(decision: ChannelIngressDecision, sideEffect: ChannelIngressSideEffectResult): ChannelTurnAdmission;
/** Brand a non-empty plugin id for channel ingress diagnostics and gate ids. */
export declare function createChannelIngressPluginId(id: string): ChannelIngressPluginId;
/**
 * Create a channel ingress subject from one or more identifiers.
 * Missing opaque ids are generated deterministically so redacted match output stays stable.
 */
export declare function createChannelIngressSubject(input: ChannelIngressSubjectIdentifierInput | {
    identifiers: readonly ChannelIngressSubjectIdentifierInput[];
}): ChannelIngressSubject;
/**
 * Create an adapter for channels that match allowlist entries against one normalized string id.
 * Wildcards are preserved as `*`; empty normalized values are omitted from matchable entries.
 */
export declare function createChannelIngressStringAdapter(params?: CreateChannelIngressStringAdapterParams): ChannelIngressAdapter;
/**
 * Create an adapter for channels that match one allowlist entry against multiple identifier kinds.
 * This is useful when a channel supports stable ids plus aliases such as email or username.
 */
export declare function createChannelIngressMultiIdentifierAdapter(params: CreateChannelIngressMultiIdentifierAdapterParams): ChannelIngressAdapter;
/** Exhaustiveness helper for switch statements over ingress reason codes. */
export declare function assertNeverChannelIngressReason(reasonCode: never): never;
/**
 * Read the sender gate reason code for legacy callers.
 *
 * @deprecated Use `senderAccess.reasonCode` from `resolveChannelMessageIngress(...)` or typed gate selectors.
 */
export declare function findChannelIngressSenderReasonCode(decision: ChannelIngressDecision, params: {
    isGroup: boolean;
}): IngressReasonCode;
/**
 * Map channel-ingress reason codes back to legacy DM/group access reason codes.
 *
 * @deprecated Use `senderAccess.reasonCode` from `resolveChannelMessageIngress(...)`.
 */
export declare function mapChannelIngressReasonCodeToDmGroupAccessReason(params: {
    reasonCode: IngressReasonCode;
    isGroup: boolean;
}): DmGroupAccessReasonCode;
/**
 * Format a legacy DM/group policy reason string from a mapped ingress reason code.
 *
 * @deprecated Use `senderAccess.reason` from `resolveChannelMessageIngress(...)`.
 */
export declare function formatChannelIngressPolicyReason(params: {
    reasonCode: DmGroupAccessReasonCode;
    dmPolicy: string;
    groupPolicy: string;
}): string;
/**
 * Project a sender ingress reason into the legacy group-access compatibility shape.
 *
 * @deprecated Use `senderAccess.groupAccess` from `resolveChannelMessageIngress(...)`.
 */
export declare function projectChannelIngressSenderGroupAccess(params: {
    reasonCode: IngressReasonCode;
    decisionAllowed: boolean;
    groupPolicy: ChannelIngressPolicyInput["groupPolicy"];
    providerMissingFallbackApplied?: boolean;
}): ChannelIngressSenderGroupAccessProjection;
/**
 * Project a full ingress decision into the legacy DM/group access compatibility shape.
 *
 * @deprecated Use `senderAccess` from `resolveChannelMessageIngress(...)`.
 */
export declare function projectChannelIngressDmGroupAccess(params: {
    ingress: ChannelIngressDecision;
    isGroup: boolean;
    dmPolicy: string;
    groupPolicy: string;
}): ChannelIngressDmGroupAccessProjection;
/** Resolve and normalize channel ingress state from SDK input. */
export declare function resolveChannelIngressState(input: ChannelIngressStateInput): Promise<ChannelIngressState>;
/**
 * Resolve legacy ingress access with compatibility projections and effective allowlists.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export declare function resolveChannelIngressAccess(params: ResolveChannelIngressAccessParams): Promise<ResolvedChannelIngressAccess>;
