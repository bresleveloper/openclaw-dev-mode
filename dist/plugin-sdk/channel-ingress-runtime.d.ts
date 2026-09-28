import { $f as ChannelIngressIdentitySubjectInput, $i as channelIngressRoutes, Dp as ResolvedChannelImplicitMentions, Gf as ChannelIngressAccessGroupMembershipResolver, Jf as ChannelIngressContextBinding, Kf as ChannelIngressCommandPresetInput, Op as resolveChannelImplicitMentions, Qf as ChannelIngressIdentityField, Xf as ChannelIngressIdentityAlias, Yf as ChannelIngressEventPresetInput, Zf as ChannelIngressIdentityDescriptor, _p as IngressReasonCode, ap as CreateChannelIngressResolverParams, cp as ResolvedChannelMessageIngress, dp as ChannelIngressDecision, ep as ChannelIngressResolver, fp as ChannelIngressEventInput, gp as ChannelIngressStateInput, hp as ChannelIngressState, ip as ChannelMessageIngressCommandInput, lp as StableChannelIngressIdentityParams, mp as ChannelIngressPolicyInput, np as ChannelIngressRouteAccess, op as ResolveChannelMessageIngressParams, pp as ChannelIngressIdentifierKind, qf as ChannelIngressConfigInput, rp as ChannelIngressRouteDescriptor, sp as ResolveStableChannelMessageIngressParams, tp as ChannelIngressResolverMessageParams, up as AccessGroupMembershipFact } from "../agent-harness-runtime-CWL0fcg5.js";
import { L as IdentifierAuthentication, R as meetsIdentifierAuthentication } from "../types.core-D1MQo5ra.js";
import { n as PairingChannel } from "../pairing-messages-Bt0KszAj.js";
import { a as ChannelIngressMonitorFacts, c as CreateChannelIngressMonitorOptions, i as ChannelIngressMonitorDrainOptions, o as ChannelIngressMonitorLifecycle, s as ChannelIngressMonitorPayloadCodec } from "../ingress-monitor-CgL0N2mA.js";
//#region src/channels/message-access/runtime-identity.d.ts
/** Build an identity descriptor for channels with one stable id and optional aliases. */
export declare function defineStableChannelIngressIdentity(params?: StableChannelIngressIdentityParams): ChannelIngressIdentityDescriptor;
/** Classify configured entries without needing a sender or granting admission. */
export declare function identityEntryAuthenticationClassifier(identity: ChannelIngressIdentityDescriptor | StableChannelIngressIdentityParams): (raw: string) => IdentifierAuthentication | undefined;
//#endregion
//#region src/channels/message-access/store-allow-from.d.ts
/**
 * Read pairing-store allowlist entries when a direct-message policy permits
 * store fallback.
 */
export declare function readChannelIngressStoreAllowFromForDmPolicy(params: {
  provider: PairingChannel;
  accountId: string;
  dmPolicy?: string | null;
  shouldRead?: boolean | null;
  readStore?: (provider: PairingChannel, accountId: string) => Promise<string[]>;
}): Promise<string[]>;
//#endregion
//#region src/plugin-sdk/channel-ingress-runtime.d.ts
/** Retain the creating instance when adapting a released reusable resolver. */
export declare function createChannelIngressResolver(base: CreateChannelIngressResolverParams): ChannelIngressResolver;
/** Preserve the released helper's trusted attribution within its managed callback. */
export declare function resolveChannelMessageIngress(params: ResolveChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
/** Preserve the released stable-identity helper through the same ingress owner. */
export declare function resolveStableChannelMessageIngress(params: ResolveStableChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
type ChannelIngressLifecycle = Omit<ChannelIngressMonitorLifecycle, "admission">;
type StandardRawEventPayload = {
  version: 1;
  rawEvent: string;
};
type StandardRawEventAdmission<TInspection> = {
  kind: "invalid";
  message: string;
} | {
  kind: "durable" | (null extends TInspection ? "ignored" : never);
};
type StandardRawEventIngressOptions<TRaw, TMetadata, TInspection> = Omit<CreateChannelIngressMonitorOptions<TRaw, string, StandardRawEventPayload, TMetadata>, "admissionMode" | "drain" | "inspect" | "inspectAsync" | "payload" | "pollIntervalMs" | "retention"> & {
  inspect: (raw: TRaw) => TInspection;
  payload: Omit<ChannelIngressMonitorPayloadCodec<TRaw, string, StandardRawEventPayload, TMetadata>, "storage" | "version">;
  pollIntervalMs?: number;
  drain?: Omit<ChannelIngressMonitorDrainOptions<StandardRawEventPayload, TMetadata>, "startLimit">;
  classifyAdmissionError: (error: unknown) => string | undefined;
};
/** Version-1 raw events, 500 ms polling, eight deliveries, and standard retention. */
export declare function createStandardRawEventIngressMonitor<TRaw, TMetadata, TInspection extends ChannelIngressMonitorFacts | null>(options: StandardRawEventIngressOptions<TRaw, TMetadata, TInspection>): {
  receive: (raw: TRaw) => Promise<StandardRawEventAdmission<TInspection>>;
  start: () => void;
  stop: () => Promise<void>;
  waitForIdle: () => Promise<void>;
};
/** Fan one logical inbound turn's ownership lifecycle across its durable claims. */
export declare function fanInChannelIngressLifecycles(inputs: readonly (ChannelIngressLifecycle | undefined)[]): {
  lifecycle: ChannelIngressLifecycle | undefined;
  settle: () => Promise<void>;
  abandon: (error?: unknown) => Promise<void>;
  cancel: () => Promise<void>;
};
//#endregion
export { type AccessGroupMembershipFact, type ChannelIngressAccessGroupMembershipResolver, type ChannelIngressCommandPresetInput, type ChannelIngressConfigInput, type ChannelIngressContextBinding, type ChannelIngressDecision, type ChannelIngressEventInput, type ChannelIngressEventPresetInput, type ChannelIngressIdentifierKind, type ChannelIngressIdentityAlias, type ChannelIngressIdentityDescriptor, type ChannelIngressIdentityField, type ChannelIngressIdentitySubjectInput, type ChannelIngressPolicyInput, type ChannelIngressResolver, type ChannelIngressResolverMessageParams, type ChannelIngressRouteAccess, type ChannelIngressRouteDescriptor, type ChannelIngressState, type ChannelIngressStateInput, type ChannelMessageIngressCommandInput, type CreateChannelIngressResolverParams, type IdentifierAuthentication, type IngressReasonCode, type ResolveChannelMessageIngressParams, type ResolveStableChannelMessageIngressParams, type ResolvedChannelImplicitMentions, type ResolvedChannelMessageIngress, type StableChannelIngressIdentityParams, channelIngressRoutes, meetsIdentifierAuthentication, resolveChannelImplicitMentions };