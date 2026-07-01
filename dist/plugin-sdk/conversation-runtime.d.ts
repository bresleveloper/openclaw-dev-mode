import { L as ChannelThreadingAdapter } from "./types.core-BBGk7pBn.js";
import { T as ReplyToMode } from "./types.base-DmKdGokm.js";
import { i as MsgContext } from "./templating-KsALmYhy.js";
import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { a as SessionBindingCapabilities, c as SessionBindingRecord, i as SessionBindingBindInput, l as SessionBindingUnbindInput, n as BindingTargetKind, r as ConversationRef, s as SessionBindingPlacement, t as BindingStatus } from "./session-binding.types-BbT2v6Ty.js";
import { a as getSessionBindingService, c as testing, i as SessionBindingService, l as unregisterSessionBindingAdapter, n as SessionBindingAdapterCapabilities, o as isSessionBindingError, r as SessionBindingError, s as registerSessionBindingAdapter, t as SessionBindingAdapter } from "./session-binding-service-FRcWK28J.js";
import { t as PairingChannel } from "./pairing-store.types-BoZulJ8-.js";
import { t as buildPairingReply } from "./pairing-messages-Bg1taZel.js";
import { t as recordInboundSession } from "./session-Btcu5HF7.js";
import { d as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-CbXY3hb3.js";
import { a as approveChannelPairingCode, c as readChannelAllowFromStore, d as readLegacyChannelAllowFromStoreSync, f as removeChannelAllowFromStoreEntry, i as addChannelAllowFromStoreEntry, l as readChannelAllowFromStoreSync, m as upsertChannelPairingRequest, n as issuePairingChallenge, o as clearPairingAllowFromReadCacheForTest, p as resolveChannelAllowFromPath, r as PairingRequest, s as listChannelPairingRequests, t as PairingChallengeParams, u as readLegacyChannelAllowFromStore } from "./pairing-challenge-BOtNJx05.js";
import { a as StatefulBindingTargetDescriptor, i as ConfiguredBindingResolution, n as ConfiguredBindingConversation, r as ConfiguredBindingRecordResolution, t as CompiledConfiguredBinding } from "./binding-types-Cn7fed1T.js";
import { a as resolveRuntimeConversationBindingRoute, i as resolveConfiguredBindingRoute, n as RuntimeConversationBindingRouteResult, r as ensureConfiguredBindingRouteReady, t as ConfiguredBindingRouteResult } from "./binding-routing-B0BORohO.js";
import { a as buildPluginBindingUnavailableText, c as hasShownPluginBindingFallbackNotice, d as markPluginBindingFallbackNoticeShown, f as parsePluginBindingApprovalCustomId, h as toPluginConversationBinding, i as buildPluginBindingResolvedText, l as isPluginOwnedBindingMetadata, m as resolvePluginConversationBindingApproval, n as buildPluginBindingDeclinedText, o as detachPluginConversationBinding, p as requestPluginConversationBinding, r as buildPluginBindingErrorText, s as getCurrentPluginConversationBinding, t as buildPluginBindingApprovalCustomId, u as isPluginOwnedSessionBindingRecord } from "./conversation-binding-Dte-2_br.js";
import { i as StatefulBindingTargetSessionResult, n as StatefulBindingTargetReadyResult, r as StatefulBindingTargetResetResult, t as StatefulBindingTargetDriver } from "./stateful-target-drivers-DRuwzdxp.js";
import { a as resolveThreadBindingEffectiveExpiresAt, c as resolveThreadBindingMaxAgeMs, d as resolveThreadBindingsEnabled, f as resolveThreadBindingConversationIdFromBindingId, i as formatThreadBindingSpawnDisabledError, l as resolveThreadBindingMaxAgeMsForChannel, n as ThreadBindingSpawnPolicy, o as resolveThreadBindingIdleTimeoutMs, r as formatThreadBindingDisabledError, s as resolveThreadBindingIdleTimeoutMsForChannel, t as ThreadBindingSpawnKind, u as resolveThreadBindingSpawnPolicy } from "./thread-bindings-policy-DetsarH1.js";
import { a as resolveThreadBindingIntroText, i as resolveThreadBindingFarewellText, n as resolveThreadBindingLifecycle, o as resolveThreadBindingThreadName, r as formatThreadBindingDurationLabel } from "./thread-binding-lifecycle-BboAexP6.js";

//#region src/bindings/records.d.ts
declare function createConversationBindingRecord(input: SessionBindingBindInput): Promise<SessionBindingRecord>;
declare function getConversationBindingCapabilities(params: {
  channel: string;
  accountId: string;
}): SessionBindingCapabilities;
declare function listSessionBindingRecords(targetSessionKey: string): SessionBindingRecord[];
declare function resolveConversationBindingRecord(conversation: ConversationRef): SessionBindingRecord | null;
declare function touchConversationBindingRecord(bindingId: string, at?: number): void;
declare function unbindConversationBindingRecord(input: SessionBindingUnbindInput): Promise<SessionBindingRecord[]>;
//#endregion
//#region src/channels/plugins/configured-binding-registry.d.ts
/**
 * Warms and counts the compiled configured binding registry for a config snapshot.
 */
declare function primeConfiguredBindingRegistry$1(params: {
  cfg: OpenClawConfig;
}): {
  bindingCount: number;
  channelCount: number;
};
/**
 * Resolves a configured binding record from explicit channel/account/conversation ids.
 */
declare function resolveConfiguredBindingRecord$1(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
}): ConfiguredBindingRecordResolution | null;
/**
 * Resolves a configured binding record from a normalized conversation reference.
 */
declare function resolveConfiguredBindingRecordForConversation$1(params: {
  cfg: OpenClawConfig;
  conversation: ConversationRef;
}): ConfiguredBindingRecordResolution | null;
/**
 * Resolves the full configured binding match, including compiled rule and match diagnostics.
 */
declare function resolveConfiguredBinding$1(params: {
  cfg: OpenClawConfig;
  conversation: ConversationRef;
}): ConfiguredBindingResolution | null;
/**
 * Resolves a configured binding record by the stateful target session key.
 */
declare function resolveConfiguredBindingRecordBySessionKey$1(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}): ConfiguredBindingRecordResolution | null;
//#endregion
//#region src/channels/plugins/binding-registry.d.ts
declare function primeConfiguredBindingRegistry(...args: Parameters<typeof primeConfiguredBindingRegistry$1>): ReturnType<typeof primeConfiguredBindingRegistry$1>;
declare function resolveConfiguredBindingRecord(...args: Parameters<typeof resolveConfiguredBindingRecord$1>): ReturnType<typeof resolveConfiguredBindingRecord$1>;
declare function resolveConfiguredBindingRecordForConversation(...args: Parameters<typeof resolveConfiguredBindingRecordForConversation$1>): ReturnType<typeof resolveConfiguredBindingRecordForConversation$1>;
declare function resolveConfiguredBinding(...args: Parameters<typeof resolveConfiguredBinding$1>): ReturnType<typeof resolveConfiguredBinding$1>;
declare function resolveConfiguredBindingRecordBySessionKey(...args: Parameters<typeof resolveConfiguredBindingRecordBySessionKey$1>): ReturnType<typeof resolveConfiguredBindingRecordBySessionKey$1>;
//#endregion
//#region src/channels/plugins/binding-targets.d.ts
/**
 * Ensures the stateful target driver for a configured binding is ready to receive traffic.
 */
declare function ensureConfiguredBindingTargetReady(params: {
  cfg: OpenClawConfig;
  bindingResolution: ConfiguredBindingResolution | null;
}): Promise<{
  ok: true;
} | {
  ok: false;
  error: string;
}>;
/**
 * Resets a stateful configured binding target in place when its driver supports reset.
 */
declare function resetConfiguredBindingTargetInPlace(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: "new" | "reset";
  commandSource?: string;
}): Promise<StatefulBindingTargetResetResult>;
/**
 * Ensures the configured binding target session exists and returns its session key.
 */
declare function ensureConfiguredBindingTargetSession(params: {
  cfg: OpenClawConfig;
  bindingResolution: ConfiguredBindingResolution;
}): Promise<{
  ok: true;
  sessionKey: string;
} | {
  ok: false;
  sessionKey: string;
  error: string;
}>;
//#endregion
//#region src/channels/conversation-label.d.ts
/**
 * Resolves the most readable conversation label from normalized inbound message context.
 */
declare function resolveConversationLabel(ctx: MsgContext): string | undefined;
//#endregion
//#region src/channels/session-meta.d.ts
/**
 * Best-effort inbound session metadata recorder for channel plugin command handlers.
 */
declare function recordInboundSessionMetaSafe(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  ctx: MsgContext;
  onError?: (error: unknown) => void;
}): Promise<void>;
//#endregion
//#region src/channels/plugins/threading-helpers.d.ts
type ReplyToModeResolver = NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
/**
 * Creates a reply-to-mode resolver that always returns one mode.
 */
declare function createStaticReplyToModeResolver(mode: ReplyToMode): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from top-level channel config.
 */
declare function createTopLevelChannelReplyToModeResolver(channelId: string): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from account-scoped config.
 */
declare function createScopedAccountReplyToModeResolver<TAccount>(params: {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TAccount;
  resolveReplyToMode: (account: TAccount, chatType?: string | null) => ReplyToMode | null | undefined;
  fallback?: ReplyToMode;
}): ReplyToModeResolver;
//#endregion
//#region src/pairing/pairing-labels.d.ts
declare function resolvePairingIdLabel(channel: PairingChannel): string;
//#endregion
export { type BindingStatus, type BindingTargetKind, type CompiledConfiguredBinding, type ConfiguredBindingConversation, type ConfiguredBindingResolution, type ConfiguredBindingRouteResult, type ConversationRef, PairingChallengeParams, type PairingChannel, PairingRequest, type RuntimeConversationBindingRouteResult, type SessionBindingAdapter, type SessionBindingAdapterCapabilities, type SessionBindingBindInput, type SessionBindingCapabilities, SessionBindingError, type SessionBindingPlacement, type SessionBindingRecord, type SessionBindingService, type SessionBindingUnbindInput, type StatefulBindingTargetDescriptor, type StatefulBindingTargetDriver, type StatefulBindingTargetReadyResult, type StatefulBindingTargetResetResult, type StatefulBindingTargetSessionResult, type ThreadBindingSpawnKind, type ThreadBindingSpawnPolicy, testing as __testing, testing, addChannelAllowFromStoreEntry, approveChannelPairingCode, buildPairingReply, buildPluginBindingApprovalCustomId, buildPluginBindingDeclinedText, buildPluginBindingErrorText, buildPluginBindingResolvedText, buildPluginBindingUnavailableText, clearPairingAllowFromReadCacheForTest, createConversationBindingRecord, createScopedAccountReplyToModeResolver, createStaticReplyToModeResolver, createTopLevelChannelReplyToModeResolver, detachPluginConversationBinding, ensureConfiguredBindingRouteReady, ensureConfiguredBindingTargetReady, ensureConfiguredBindingTargetSession, formatThreadBindingDisabledError, formatThreadBindingDurationLabel, formatThreadBindingSpawnDisabledError, getConversationBindingCapabilities, getCurrentPluginConversationBinding, getSessionBindingService, hasShownPluginBindingFallbackNotice, isPluginOwnedBindingMetadata, isPluginOwnedSessionBindingRecord, isSessionBindingError, issuePairingChallenge, listChannelPairingRequests, listSessionBindingRecords, markPluginBindingFallbackNoticeShown, parsePluginBindingApprovalCustomId, primeConfiguredBindingRegistry, readChannelAllowFromStore, readChannelAllowFromStoreSync, readLegacyChannelAllowFromStore, readLegacyChannelAllowFromStoreSync, recordInboundSession, recordInboundSessionMetaSafe, registerSessionBindingAdapter, removeChannelAllowFromStoreEntry, requestPluginConversationBinding, resetConfiguredBindingTargetInPlace, resolveChannelAllowFromPath, resolveConfiguredBinding, resolveConfiguredBindingRecord, resolveConfiguredBindingRecordBySessionKey, resolveConfiguredBindingRecordForConversation, resolveConfiguredBindingRoute, resolveConversationBindingRecord, resolveConversationLabel, resolvePairingIdLabel, resolvePinnedMainDmOwnerFromAllowlist, resolvePluginConversationBindingApproval, resolveRuntimeConversationBindingRoute, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingEffectiveExpiresAt, resolveThreadBindingFarewellText, resolveThreadBindingIdleTimeoutMs, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingIntroText, resolveThreadBindingLifecycle, resolveThreadBindingMaxAgeMs, resolveThreadBindingMaxAgeMsForChannel, resolveThreadBindingSpawnPolicy, resolveThreadBindingThreadName, resolveThreadBindingsEnabled, toPluginConversationBinding, touchConversationBindingRecord, unbindConversationBindingRecord, unregisterSessionBindingAdapter, upsertChannelPairingRequest };