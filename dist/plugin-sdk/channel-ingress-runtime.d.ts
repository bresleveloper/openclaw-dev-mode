import { AO as AccessGroupMembershipFact, CO as ChannelIngressRouteDescriptor, CT as PluginHookBeforeChannelIngressContext, Ch as ChannelIngressMonitorLifecycle, DO as ResolveStableChannelMessageIngressParams, EO as ResolveChannelMessageIngressParams, FO as ChannelIngressState, IO as ChannelIngressStateInput, JO as resolveChannelImplicitMentions, LO as IngressReasonCode, MO as ChannelIngressEventInput, NO as ChannelIngressIdentifierKind, OO as ResolvedChannelMessageIngress, PO as ChannelIngressPolicyInput, SO as ChannelIngressRouteAccess, Sh as ChannelIngressMonitorFacts, TO as CreateChannelIngressResolverParams, Th as CreateChannelIngressMonitorOptions, Uj as IdentifierAuthentication, Wj as meetsIdentifierAuthentication, Y as channelIngressRoutes, _O as ChannelIngressIdentityDescriptor, bO as ChannelIngressResolver, dO as ChannelIngressAccessGroupMembershipResolver, fO as ChannelIngressCommandPresetInput, gO as ChannelIngressIdentityAlias, hO as ChannelIngressEventPresetInput, jO as ChannelIngressDecision, kO as StableChannelIngressIdentityParams, mO as ChannelIngressContextBinding, pO as ChannelIngressConfigInput, qO as ResolvedChannelImplicitMentions, uO as readChannelIngressStoreAllowFromForDmPolicy, vO as ChannelIngressIdentityField, wO as ChannelMessageIngressCommandInput, wh as ChannelIngressMonitorPayloadCodec, xO as ChannelIngressResolverMessageParams, xh as ChannelIngressMonitorDrainOptions, yO as ChannelIngressIdentitySubjectInput } from "../config-contracts-hzlacViZ.js";
/** Await enabled ingress policies without materializing a plugin runtime at channel startup. */
export declare function prepareChannelIngressEvent(event: unknown, context: PluginHookBeforeChannelIngressContext): Promise<{
  event: unknown;
  assertCurrent: () => void;
} | undefined>;
/** Build an identity descriptor for channels with one stable id and optional aliases. */
export declare function defineStableChannelIngressIdentity(params?: StableChannelIngressIdentityParams): ChannelIngressIdentityDescriptor;
/** Classify configured entries without needing a sender or granting admission. */
export declare function identityEntryAuthenticationClassifier(identity: ChannelIngressIdentityDescriptor | StableChannelIngressIdentityParams): (raw: string) => IdentifierAuthentication | undefined;
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
/** Version-1 raw events, direct admission wakeups, eight deliveries, and standard retention. */
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
export { type AccessGroupMembershipFact, type ChannelIngressAccessGroupMembershipResolver, type ChannelIngressCommandPresetInput, type ChannelIngressConfigInput, type ChannelIngressContextBinding, type ChannelIngressDecision, type ChannelIngressEventInput, type ChannelIngressEventPresetInput, type ChannelIngressIdentifierKind, type ChannelIngressIdentityAlias, type ChannelIngressIdentityDescriptor, type ChannelIngressIdentityField, type ChannelIngressIdentitySubjectInput, type ChannelIngressPolicyInput, type ChannelIngressResolver, type ChannelIngressResolverMessageParams, type ChannelIngressRouteAccess, type ChannelIngressRouteDescriptor, type ChannelIngressState, type ChannelIngressStateInput, type ChannelMessageIngressCommandInput, type CreateChannelIngressResolverParams, type IdentifierAuthentication, type IngressReasonCode, type ResolveChannelMessageIngressParams, type ResolveStableChannelMessageIngressParams, type ResolvedChannelImplicitMentions, type ResolvedChannelMessageIngress, type StableChannelIngressIdentityParams, channelIngressRoutes, meetsIdentifierAuthentication, readChannelIngressStoreAllowFromForDmPolicy, resolveChannelImplicitMentions };