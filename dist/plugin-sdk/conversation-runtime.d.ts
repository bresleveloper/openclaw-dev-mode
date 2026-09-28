import { U as AgentBinding, r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { C as ReplyToMode } from "../types.base-CA0_JvyZ.js";
import { s as MsgContext } from "../templating-OpWn1DzT.js";
import "../types-BnfxNjkF.js";
import { j as ChannelThreadingAdapter } from "../types.core-D1MQo5ra.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import { c as ChannelConfiguredBindingConversationRef, l as ChannelConfiguredBindingMatch, u as ChannelConfiguredBindingProvider } from "../types.adapters-dxHXA2rq.js";
import { n as ResolvedAgentRoute } from "../resolve-route-CnXT0jTq.js";
import "../types.public-B8oQ1D30.js";
import { n as ConversationRef, o as SessionBindingRecord, r as SessionBindingBindInput, t as BindingTargetKind } from "../session-binding.types-CHb9gl-M.js";
import { a as testing, i as registerSessionBindingAdapter, n as getSessionBindingService, o as unregisterSessionBindingAdapter, t as SessionBindingAdapter } from "../session-binding-service-BC_tJfmx.js";
import { n as PairingChannel, t as buildPairingReply } from "../pairing-messages-Bt0KszAj.js";
import { s as resolvePinnedMainDmOwnerFromAllowlist } from "../dm-policy-shared-BXVdVRPm.js";
import { r as upsertChannelPairingRequest, t as readChannelAllowFromStore } from "../pairing-store-CecnwoKE.js";
import { t as recordInboundSession } from "../session-CLUHG8Dl.js";
import { a as resolvePluginConversationBindingApproval, n as buildPluginBindingResolvedText, r as parsePluginBindingApprovalCustomId, t as buildPluginBindingApprovalCustomId } from "../conversation-binding-B_Y2HBau.js";
//#region src/channels/plugins/binding-types.d.ts
/**
 * Normalized conversation facts used to match configured channel bindings.
 */
type ConfiguredBindingConversation = ConversationRef;
/**
 * Channel id used by configured binding rules.
 */
type ConfiguredBindingChannel = ChannelId;
/**
 * Raw binding config entry from OpenClaw config.
 */
type ConfiguredBindingRuleConfig = AgentBinding;
/**
 * Stateful target descriptor produced by a binding consumer.
 */
type StatefulBindingTargetDescriptor = {
  kind: "stateful";
  driverId: string;
  sessionKey: string;
  agentId: string;
  label?: string;
};
/**
 * Materialized binding record plus the stateful target it points at.
 */
type ConfiguredBindingRecordResolution = {
  record: SessionBindingRecord;
  statefulTarget: StatefulBindingTargetDescriptor;
};
/**
 * Factory that materializes a configured binding for one account/conversation pair.
 */
type ConfiguredBindingTargetFactory = {
  driverId: string;
  materialize: (params: {
    accountId: string;
    conversation: ChannelConfiguredBindingConversationRef;
  }) => ConfiguredBindingRecordResolution;
};
/**
 * Compiled binding rule with provider matcher, target factory, and static target facts.
 */
type CompiledConfiguredBinding = {
  channel: ConfiguredBindingChannel;
  accountPattern?: string;
  binding: ConfiguredBindingRuleConfig;
  bindingConversationId: string;
  target: ChannelConfiguredBindingConversationRef;
  agentId: string;
  provider: ChannelConfiguredBindingProvider;
  targetFactory: ConfiguredBindingTargetFactory;
};
/**
 * Full configured binding resolution used to rewrite routes and prepare target sessions.
 */
type ConfiguredBindingResolution = ConfiguredBindingRecordResolution & {
  conversation: ConfiguredBindingConversation;
  compiledBinding: CompiledConfiguredBinding;
  match: ChannelConfiguredBindingMatch;
};
//#endregion
//#region src/channels/plugins/binding-routing.d.ts
/**
 * Route resolution after applying a configured channel binding.
 */
type ConfiguredBindingRouteResult = {
  bindingResolution: ConfiguredBindingResolution | null;
  route: ResolvedAgentRoute;
  boundSessionKey?: string;
  boundAgentId?: string;
};
/**
 * Route resolution after applying a runtime conversation binding record.
 */
type RuntimeConversationBindingRouteResult = {
  /** False only when the authoritative channel-owned binding store is temporarily unavailable. */
  bindingOwnerAvailable?: boolean;
  bindingRecord: SessionBindingRecord | null;
  route: ResolvedAgentRoute;
  boundSessionKey?: string;
  boundAgentId?: string;
  pluginId?: string;
};
type ConfiguredBindingRouteConversationInput = {
  conversation: ConversationRef;
} | {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};
/**
 * Rewrites an agent route when the current conversation matches a configured binding.
 */
export declare function resolveConfiguredBindingRoute(params: {
  cfg: OpenClawConfig;
  route: ResolvedAgentRoute;
} & ConfiguredBindingRouteConversationInput): ConfiguredBindingRouteResult;
/**
 * Rewrites an agent route using a persisted runtime conversation binding, when applicable.
 */
export declare function resolveRuntimeConversationBindingRoute(params: {
  route: ResolvedAgentRoute;
  touchBinding?: boolean;
} & ConfiguredBindingRouteConversationInput): RuntimeConversationBindingRouteResult;
/**
 * Ensures a configured binding target is ready without blocking route resolution indefinitely.
 */
export declare function ensureConfiguredBindingRouteReady(params: {
  assertActive?: () => void;
  cfg: OpenClawConfig;
  bindingResolution: ConfiguredBindingResolution | null;
}): Promise<{
  ok: true;
} | {
  ok: false;
  error: string;
}>;
//#endregion
//#region src/channels/conversation-label.d.ts
/**
 * Resolves the most readable conversation label from normalized inbound message context.
 */
export declare function resolveConversationLabel(ctx: MsgContext): string | undefined;
//#endregion
//#region src/channels/session-meta.d.ts
/**
 * Best-effort inbound session metadata recorder for channel plugin command handlers.
 */
export declare function recordInboundSessionMetaSafe(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  ctx: MsgContext;
  onError?: (error: unknown) => void;
}): Promise<void>;
//#endregion
//#region src/channels/thread-binding-id.d.ts
/** Parses an account-prefixed binding id back into a conversation id. */
export declare function resolveThreadBindingConversationIdFromBindingId(params: {
  accountId: string;
  bindingId?: string;
}): string | undefined;
//#endregion
//#region src/channels/plugins/threading-helpers.d.ts
type ReplyToModeResolver = NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
/**
 * Creates a reply-to-mode resolver that always returns one mode.
 */
export declare function createStaticReplyToModeResolver(mode: ReplyToMode): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from top-level channel config.
 */
export declare function createTopLevelChannelReplyToModeResolver(channelId: string): ReplyToModeResolver;
/**
 * Creates a resolver that reads reply-to mode from account-scoped config.
 */
export declare function createScopedAccountReplyToModeResolver<TAccount>(params: {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TAccount;
  resolveReplyToMode: (account: TAccount, chatType?: string | null) => ReplyToMode | null | undefined;
  fallback?: ReplyToMode;
}): ReplyToModeResolver;
//#endregion
//#region src/channels/thread-bindings-messages.d.ts
/** Formats thread-binding timeout durations for compact user-facing messages. */
export declare function formatThreadBindingDurationLabel(durationMs: number): string;
/** Builds the native thread name for a thread-bound session. */
export declare function resolveThreadBindingThreadName(params: {
  agentId?: string;
  label?: string;
}): string;
/** Builds the system-prefixed intro text posted when a thread binding becomes active. */
export declare function resolveThreadBindingIntroText(params: {
  agentId?: string;
  label?: string;
  idleTimeoutMs?: number;
  maxAgeMs?: number;
  sessionCwd?: string;
  sessionDetails?: string[];
}): string;
/** Builds the system-prefixed farewell text posted when a thread binding ends. */
export declare function resolveThreadBindingFarewellText(params: {
  reason?: string;
  farewellText?: string;
  idleTimeoutMs: number;
  maxAgeMs: number;
}): string;
//#endregion
//#region src/shared/thread-binding-lifecycle.d.ts
/** Persisted timestamps and optional TTL overrides for one channel thread binding. */
type ThreadBindingLifecycleRecord = {
  /** Epoch milliseconds when the binding was created. */
  boundAt: number;
  /** Epoch milliseconds of the latest activity seen for the bound conversation. */
  lastActivityAt: number;
  /** Optional idle timeout override in milliseconds; zero disables idle expiry. */
  idleTimeoutMs?: number;
  /** Optional max-age override in milliseconds; zero disables max-age expiry. */
  maxAgeMs?: number;
};
/** Resolves the next expiration for a channel thread binding from idle and max-age limits. */
export declare function resolveThreadBindingLifecycle(params: {
  /** Stored binding timestamps and optional timeout overrides. */
  record: ThreadBindingLifecycleRecord;
  /** Fallback idle timeout in milliseconds when the record has no override. */
  defaultIdleTimeoutMs: number;
  /** Fallback max-age timeout in milliseconds when the record has no override. */
  defaultMaxAgeMs: number;
}): {
  /** Earliest expiration timestamp, omitted when both limits are disabled. */
  expiresAt?: number;
  /** Expiration source corresponding to `expiresAt`. */
  reason?: "idle-expired" | "max-age-expired";
};
//#endregion
//#region src/channels/thread-bindings-policy.d.ts
/** Thread-bound session type controlled by spawn policy. */
type ThreadBindingSpawnKind = "subagent" | "acp";
/** Effective per-channel/account policy for creating thread-bound sessions. */
type ThreadBindingSpawnPolicy = {
  channel: string;
  accountId: string;
  enabled: boolean;
  spawnEnabled: boolean;
  defaultSpawnContext: ThreadBindingSpawnContext;
};
/** Starting transcript mode for a spawned thread-bound session. */
type ThreadBindingSpawnContext = "isolated" | "fork";
/** Resolves thread-binding idle timeout with channel/account override before session default. */
export declare function resolveThreadBindingIdleTimeoutMs(params: {
  channelIdleHoursRaw: unknown;
  sessionIdleHoursRaw: unknown;
}): number;
/** Resolves thread-binding max age with channel/account override before session default. */
export declare function resolveThreadBindingMaxAgeMs(params: {
  channelMaxAgeHoursRaw: unknown;
  sessionMaxAgeHoursRaw: unknown;
}): number;
/** Computes the effective expiry timestamp for a thread-binding lifecycle record. */
export declare function resolveThreadBindingEffectiveExpiresAt(params: {
  record: ThreadBindingLifecycleRecord;
  defaultIdleTimeoutMs: number;
  defaultMaxAgeMs: number;
}): number | undefined;
/** Resolves the effective enabled flag for thread bindings. */
export declare function resolveThreadBindingsEnabled(params: {
  channelEnabledRaw: unknown;
  sessionEnabledRaw: unknown;
}): boolean;
/** Resolves effective spawn policy from account, channel, then global thread-binding config. */
export declare function resolveThreadBindingSpawnPolicy(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  kind: ThreadBindingSpawnKind;
}): ThreadBindingSpawnPolicy;
/** Resolves idle timeout for a concrete channel/account config scope. */
export declare function resolveThreadBindingIdleTimeoutMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
/** Resolves max age for a concrete channel/account config scope. */
export declare function resolveThreadBindingMaxAgeMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
/** Formats the user-facing error for disabled thread bindings. */
export declare function formatThreadBindingDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string;
/** Formats the user-facing error for disabled thread-bound session spawning. */
export declare function formatThreadBindingSpawnDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string;
//#endregion
//#region src/pairing/pairing-labels.d.ts
export declare function resolvePairingIdLabel(channel: PairingChannel): string;
//#endregion
export { type BindingTargetKind, type ConfiguredBindingRouteResult, type RuntimeConversationBindingRouteResult, type SessionBindingAdapter, type SessionBindingBindInput, type SessionBindingRecord, buildPairingReply, buildPluginBindingApprovalCustomId, buildPluginBindingResolvedText, getSessionBindingService, parsePluginBindingApprovalCustomId, readChannelAllowFromStore, recordInboundSession, registerSessionBindingAdapter, resolvePinnedMainDmOwnerFromAllowlist, resolvePluginConversationBindingApproval, testing, unregisterSessionBindingAdapter, upsertChannelPairingRequest };