import { $O as IdentifierAuthentication, AO as ResolveChannelMessageIngressParams, BO as ChannelIngressStateInput, Bf as ChannelIngressMonitorPayloadCodec, CO as ChannelIngressIdentitySubjectInput, DO as ChannelIngressRouteDescriptor, EO as ChannelIngressRouteAccess, FO as ChannelIngressDecision, IO as ChannelIngressEventInput, LO as ChannelIngressIdentifierKind, Lf as ChannelIngressMonitorDrainOptions, MO as ResolvedChannelMessageIngress, NO as StableChannelIngressIdentityParams, OO as ChannelMessageIngressCommandInput, PO as AccessGroupMembershipFact, QO as resolveChannelImplicitMentions, RO as ChannelIngressPolicyInput, Rf as ChannelIngressMonitorFacts, SO as ChannelIngressIdentityField, TO as ChannelIngressResolverMessageParams, VO as IngressReasonCode, Vf as CreateChannelIngressMonitorOptions, Yg as channelIngressRoutes, ZO as ResolvedChannelImplicitMentions, _O as ChannelIngressConfigInput, bO as ChannelIngressIdentityAlias, dx as readChannelIngressStoreAllowFromForDmPolicy, ek as meetsIdentifierAuthentication, gO as ChannelIngressCommandPresetInput, hO as ChannelIngressAccessGroupMembershipResolver, jO as ResolveStableChannelMessageIngressParams, kO as CreateChannelIngressResolverParams, vO as ChannelIngressContextBinding, wO as ChannelIngressResolver, xO as ChannelIngressIdentityDescriptor, yO as ChannelIngressEventPresetInput, zO as ChannelIngressState, zf as ChannelIngressMonitorLifecycle } from "../config-contracts-CY87ANNp.js";
//#region src/channels/message-access/runtime-identity.d.ts
/** Build an identity descriptor for channels with one stable id and optional aliases. */
export declare function defineStableChannelIngressIdentity(params?: StableChannelIngressIdentityParams): ChannelIngressIdentityDescriptor;
/** Classify configured entries without needing a sender or granting admission. */
export declare function identityEntryAuthenticationClassifier(identity: ChannelIngressIdentityDescriptor | StableChannelIngressIdentityParams): (raw: string) => IdentifierAuthentication | undefined;
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
export { type AccessGroupMembershipFact, type ChannelIngressAccessGroupMembershipResolver, type ChannelIngressCommandPresetInput, type ChannelIngressConfigInput, type ChannelIngressContextBinding, type ChannelIngressDecision, type ChannelIngressEventInput, type ChannelIngressEventPresetInput, type ChannelIngressIdentifierKind, type ChannelIngressIdentityAlias, type ChannelIngressIdentityDescriptor, type ChannelIngressIdentityField, type ChannelIngressIdentitySubjectInput, type ChannelIngressPolicyInput, type ChannelIngressResolver, type ChannelIngressResolverMessageParams, type ChannelIngressRouteAccess, type ChannelIngressRouteDescriptor, type ChannelIngressState, type ChannelIngressStateInput, type ChannelMessageIngressCommandInput, type CreateChannelIngressResolverParams, type IdentifierAuthentication, type IngressReasonCode, type ResolveChannelMessageIngressParams, type ResolveStableChannelMessageIngressParams, type ResolvedChannelImplicitMentions, type ResolvedChannelMessageIngress, type StableChannelIngressIdentityParams, channelIngressRoutes, meetsIdentifierAuthentication, readChannelIngressStoreAllowFromForDmPolicy, resolveChannelImplicitMentions };