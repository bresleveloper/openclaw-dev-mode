import { Q as AcpRuntimeSessionMode, r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { _ as ChannelConfigSchema } from "./zod-schema.implicit-mentions-BfiN-dfC.js";
import { x as ReplyToMode } from "./types.base-D8MIFbSh.js";
import "./types.secrets-CqlN900w.js";
import "./deliver-08FDWQV8.js";
import "./config-Dpca5-xX.js";
import "./paths-DeeYrQKO.js";
import "./defaults-D0SAbcb2.js";
import { Ss as OpenClawPluginApi, ma as PluginRuntime } from "./agent-harness-runtime-DZjstJNb.js";
import { D as ChannelSecurityDmPolicy, S as ChannelOutboundSessionRoute, b as ChannelMessagingAdapter, j as ChannelThreadingAdapter, x as ChannelMeta } from "./types.core-Bra2QBA5.js";
import { n as ChatChannelId, t as ChannelId } from "./channel-id.types-CM2F8b5e.js";
import { M as ChannelPairingAdapter, k as ChannelSecurityAdapter } from "./types.adapters-Bo2TMZGx.js";
import "./resolve-route-Dv1zO_Td.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-B8D3jrzb.js";
import { n as ChannelPlugin } from "./types.plugin-BiZwy65L.js";
import "./types.public-DpLTXZT0.js";
import "./common-K-HB_vKp.js";
import { o as SessionBindingRecord } from "./session-binding.types-CHb9gl-M.js";
import "./reply-payload-OW17IyAQ.js";
import "./typebox-BnYtibKt.js";
import "./helpers-gk1rbVRv.js";
import "./config-helpers-B3C2dCc9.js";
import { a as createAttachedChannelResultAdapter } from "./channel-send-result-BsoGWSxf.js";
import "./plugin-entry-D4JWmN6h.js";
import "./setup-helpers-Bi7ML6Fn.js";
import "./secret-file-DYBcTeIO.js";
import "./net-BAY1NiI6.js";
//#region src/acp/persistent-bindings.types.d.ts
type ConfiguredAcpBindingChannel = ChannelId;
type ConfiguredAcpBindingSpec = {
  channel: ConfiguredAcpBindingChannel;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  /** Owning OpenClaw agent id (used for session identity/storage). */
  agentId: string;
  /** ACP harness agent id override (falls back to agentId when omitted). */
  acpAgentId?: string;
  mode: AcpRuntimeSessionMode;
  model?: string;
  /** Owner agent's effective thinking default, forwarded as the ACP session's thinking runtime option. */
  thinking?: string;
  cwd?: string;
  backend?: string;
  label?: string;
};
type ResolvedConfiguredAcpBinding = {
  spec: ConfiguredAcpBindingSpec;
  record: SessionBindingRecord;
};
//#endregion
//#region src/plugin-sdk/keyed-async-queue.d.ts
/** Optional lifecycle hooks fired around each queued task. */
type KeyedAsyncQueueHooks = {
  onEnqueue?: () => void;
  onSettle?: () => void;
};
/** Serialize async work per key while allowing unrelated keys to run concurrently. */
declare function enqueueKeyedTask<T>(params: {
  tails: Map<string, Promise<void>>;
  key: string;
  task: () => Promise<T>;
  hooks?: KeyedAsyncQueueHooks;
}): Promise<T>;
/** Small per-key async queue wrapper for plugin runtimes that need serialized work. */
declare class KeyedAsyncQueue {
  private readonly tails;
  /**
   * @deprecated Retained for shipped Plugin SDK compatibility. New callers must
   * not depend on queue storage; remove in a declared Plugin SDK breaking window.
   */
  getTailMapForTesting(): Map<string, Promise<void>>;
  enqueue<T>(key: string, task: () => Promise<T>, hooks?: KeyedAsyncQueueHooks): Promise<T>;
}
//#endregion
//#region src/infra/secure-random.d.ts
/** Generates a cryptographically secure UUID for runtime ids and cache keys. */
declare function generateSecureUuid(): string;
/** Generates a URL-safe cryptographic token from the requested byte count. */
declare function generateSecureToken(options: {
  bytes?: number;
  redact: true;
}): string;
declare function generateSecureToken(bytes?: number): string;
//#endregion
//#region src/shared/tailscale-status.d.ts
type TailscaleStatusCommandResult = {
  code: number | null;
  stdout: string;
};
type TailscaleStatusCommandRunner = (argv: string[], opts: {
  timeoutMs: number;
}) => Promise<TailscaleStatusCommandResult>;
/** Resolves the host published to clients for tailnet or Tailscale Serve gateway modes. */
declare function resolveTailscalePublishedHost(params: {
  tailscaleMode: string;
  tailnetHost: string | null;
  /** @deprecated Managed Gateway ingress no longer supports named Services. */
  serviceName?: string | null;
}): string | null;
/** Runs known Tailscale status commands and returns the first DNS name or tailnet IP found. */
declare function resolveTailnetHostWithRunner(runCommandWithTimeout?: TailscaleStatusCommandRunner): Promise<string | null>;
/** Finds persistent HTTPS Serve routes whose root proxy targets this gateway port. */
declare function resolveTailscaleServeGatewayUrlsWithRunner(gatewayPort: number, runCommandWithTimeout?: TailscaleStatusCommandRunner): Promise<string[]>;
//#endregion
//#region src/shared/gateway-bind-url.d.ts
type GatewayBindUrlResult = {
  url: string;
  source: "gateway.bind=custom" | "gateway.bind=tailnet" | "gateway.bind=lan";
} | {
  error: string;
} | null;
/** Resolves the externally advertised gateway URL for non-loopback bind modes. */
declare function resolveGatewayBindUrl(params: {
  bind?: string;
  customBindHost?: string;
  scheme: "ws" | "wss";
  port: number;
  pickTailnetHost: () => string | null;
  pickLanHost: () => string | null;
}): GatewayBindUrlResult;
//#endregion
//#region src/infra/format-time/format-datetime.d.ts
type FormatTimestampOptions = {
  /** Include seconds in the output. Default: false */
  displaySeconds?: boolean;
};
type FormatZonedTimestampOptions = FormatTimestampOptions & {
  /** IANA timezone string (e.g., 'America/New_York'). Default: system timezone */
  timeZone?: string;
  /** Include an abbreviated weekday before the date. Default: false */
  displayWeekday?: boolean;
};
/**
 * Format a Date with timezone display using Intl.DateTimeFormat.
 *
 * Without seconds: `2024-01-15 14:30 EST`
 * With seconds:    `2024-01-15 14:30:05 EST`
 *
 * Returns undefined if Intl formatting fails.
 */
declare function formatZonedTimestamp(date: Date, options?: FormatZonedTimestampOptions): string | undefined;
//#endregion
//#region src/acp/persistent-bindings.resolve.d.ts
declare function resolveConfiguredAcpBindingRecord(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
}): ResolvedConfiguredAcpBinding | null;
//#endregion
//#region src/plugin-sdk/core.d.ts
/** Ensure a configured ACP binding has live runtime state before channel delivery uses it. */
declare function ensureConfiguredAcpBindingReady(params: {
  cfg: OpenClawConfig;
  configuredBinding: ResolvedConfiguredAcpBinding | null;
}): Promise<{
  ok: true;
} | {
  ok: false;
  error: string;
}>;
/** Params passed to a channel adapter when resolving outbound session routing. */
type ChannelOutboundSessionRouteParams = Parameters<NonNullable<ChannelMessagingAdapter["resolveOutboundSessionRoute"]>>[0];
declare function getChatChannelMetaForSdk(id: ChatChannelId): ChannelMeta;
/**
 * Build the canonical outbound session route payload returned by channel
 * message adapters.
 */
declare function buildChannelOutboundSessionRoute(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  recipientSessionExact?: boolean | "direct-alias" | "delivery-identity";
  peer: {
    kind: "direct" | "group" | "channel";
    id: string;
  };
  chatType: "direct" | "group" | "channel";
  from: string;
  to: string;
  threadId?: string | number;
}): ChannelOutboundSessionRoute;
/** Candidate source used when choosing a thread id for outbound session routing. */
type ThreadAwareOutboundSessionRouteThreadSource = "replyToId" | "threadId" | "currentSession";
/** Recovery context passed before reusing the current session thread id. */
type ThreadAwareOutboundSessionRouteRecoveryContext = {
  route: ChannelOutboundSessionRoute;
  currentBaseSessionKey: string;
  currentThreadId: string;
};
/** Recover the current thread id when the current session belongs to the same base route. */
declare function recoverCurrentThreadSessionId(params: {
  route: ChannelOutboundSessionRoute;
  currentSessionKey?: string | null;
  canRecover?: (context: ThreadAwareOutboundSessionRouteRecoveryContext) => boolean;
}): string | undefined;
/** Add thread-aware session keys and route thread ids to an outbound channel route. */
declare function buildThreadAwareOutboundSessionRoute(params: {
  route: ChannelOutboundSessionRoute;
  replyToId?: string | number | null;
  threadId?: string | number | null;
  currentSessionKey?: string | null;
  precedence?: readonly ThreadAwareOutboundSessionRouteThreadSource[];
  useSuffix?: boolean;
  parentSessionKey?: string;
  normalizeThreadId?: (threadId: string) => string;
  canRecoverCurrentThread?: (context: ThreadAwareOutboundSessionRouteRecoveryContext) => boolean;
}): ChannelOutboundSessionRoute;
/** Options for a channel plugin entry that should register a channel capability. */
type ChannelEntryConfigSchema<TPlugin> = TPlugin extends ChannelPlugin<unknown> ? NonNullable<TPlugin["configSchema"]> : ChannelConfigSchema;
type DefineChannelPluginEntryOptions<TPlugin = ChannelPlugin> = {
  id: string;
  name: string;
  description: string;
  plugin: TPlugin;
  configSchema?: ChannelEntryConfigSchema<TPlugin> | (() => ChannelEntryConfigSchema<TPlugin>);
  setRuntime?: (runtime: PluginRuntime) => void;
  registerCliMetadata?: (api: OpenClawPluginApi) => void;
  registerFull?: (api: OpenClawPluginApi) => void;
  registerCapabilities?: (api: OpenClawPluginApi) => void;
};
type DefinedChannelPluginEntry<TPlugin> = {
  id: string;
  name: string;
  description: string;
  configSchema: ChannelConfigSchema;
  register: (api: OpenClawPluginApi) => void;
  channelPlugin: TPlugin;
  setChannelRuntime?: (runtime: PluginRuntime) => void;
};
type CreateChannelPluginBaseOptions<TResolvedAccount> = {
  id: ChannelPlugin<TResolvedAccount>["id"];
  meta?: Partial<NonNullable<ChannelPlugin<TResolvedAccount>["meta"]>>;
  setupWizard?: NonNullable<ChannelPlugin<TResolvedAccount>["setupWizard"]>;
  capabilities?: ChannelPlugin<TResolvedAccount>["capabilities"];
  commands?: ChannelPlugin<TResolvedAccount>["commands"];
  doctor?: ChannelPlugin<TResolvedAccount>["doctor"];
  agentPrompt?: ChannelPlugin<TResolvedAccount>["agentPrompt"];
  streaming?: ChannelPlugin<TResolvedAccount>["streaming"];
  reload?: ChannelPlugin<TResolvedAccount>["reload"];
  gatewayMethods?: ChannelPlugin<TResolvedAccount>["gatewayMethods"];
  gatewayMethodDescriptors?: ChannelPlugin<TResolvedAccount>["gatewayMethodDescriptors"];
  configSchema?: ChannelPlugin<TResolvedAccount>["configSchema"];
  config?: ChannelPlugin<TResolvedAccount>["config"];
  security?: ChannelPlugin<TResolvedAccount>["security"];
  setup?: NonNullable<ChannelPlugin<TResolvedAccount>["setup"]>;
  setupContract?: NonNullable<ChannelPlugin<TResolvedAccount>["setupContract"]>;
  groups?: ChannelPlugin<TResolvedAccount>["groups"];
};
type CreatedChannelPluginBase<TResolvedAccount> = Pick<ChannelPlugin<TResolvedAccount>, "id" | "meta"> & Partial<Pick<ChannelPlugin<TResolvedAccount>, Exclude<keyof CreateChannelPluginBaseOptions<TResolvedAccount>, "id" | "meta">>>;
/**
 * Canonical entry helper for channel plugins.
 *
 * Registers the channel capability and optionally exposes full-runtime hooks
 * such as tools or gateway handlers outside setup-only registration modes.
 */
declare function defineChannelPluginEntry<TPlugin>({ id, name, description, plugin, configSchema, setRuntime, registerCliMetadata, registerFull, registerCapabilities }: DefineChannelPluginEntryOptions<TPlugin>): DefinedChannelPluginEntry<TPlugin>;
/**
 * Minimal setup-entry helper for channels that ship a separate `setup-entry.ts`.
 *
 * The setup entry only needs to export `{ plugin }`, but using this helper
 * keeps the shape explicit in examples and generated typings.
 */
declare function defineSetupPluginEntry<TPlugin>(plugin: TPlugin): {
  plugin: TPlugin;
};
type ChatChannelPluginBase<Plugin> = Omit<Plugin, "capabilities"> & Partial<Pick<ChannelPlugin, "capabilities">>;
type ChatChannelSecurityOptions<TResolvedAccount extends {
  accountId?: string | null;
}> = {
  dm: {
    channelKey: string;
    resolvePolicy: (account: TResolvedAccount) => string | null | undefined;
    resolveAllowFrom: (account: TResolvedAccount) => Array<string | number> | null | undefined;
    resolveFallbackAccountId?: (account: TResolvedAccount) => string | null | undefined;
    defaultPolicy?: string;
    allowFromPathSuffix?: string;
    policyPathSuffix?: string;
    approveChannelId?: string;
    approveHint?: string;
    normalizeEntry?: (raw: string) => string;
    classifyEntryAuthentication?: ChannelSecurityDmPolicy["classifyEntryAuthentication"];
    inheritSharedDefaultsFromDefaultAccount?: boolean;
  };
  dmRouting?: ChannelSecurityAdapter<TResolvedAccount>["dmRouting"];
  collectWarnings?: ChannelSecurityAdapter<TResolvedAccount>["collectWarnings"];
  collectAuditFindings?: ChannelSecurityAdapter<TResolvedAccount>["collectAuditFindings"];
};
type ChatChannelPairingOptions = {
  text: {
    idLabel: string;
    message: string;
    normalizeAllowEntry?: ChannelPairingAdapter["normalizeAllowEntry"];
    notify: (params: Parameters<NonNullable<ChannelPairingAdapter["notifyApproval"]>>[0] & {
      message: string;
    }) => Promise<void> | void;
  };
};
type ChatChannelThreadingReplyModeOptions<TResolvedAccount> = {
  topLevelReplyToMode: string;
} | {
  scopedAccountReplyToMode: {
    resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TResolvedAccount;
    resolveReplyToMode: (account: TResolvedAccount, chatType?: string | null) => ReplyToMode | null | undefined;
    fallback?: ReplyToMode;
  };
} | {
  resolveReplyToMode: NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;
};
type ChatChannelThreadingOptions<TResolvedAccount> = ChatChannelThreadingReplyModeOptions<TResolvedAccount> & Omit<ChannelThreadingAdapter, "resolveReplyToMode">;
type ChatChannelAttachedOutboundOptions = {
  base: Omit<ChannelOutboundAdapter, "sendText" | "sendMedia" | "sendPoll">;
  attachedResults: Parameters<typeof createAttachedChannelResultAdapter>[0];
};
/**
 * Build a chat-style channel plugin by composing common security, pairing,
 * threading, and outbound adapters around a channel-specific base.
 */
declare function createChatChannelPlugin<TResolvedAccount extends {
  accountId?: string | null;
}, Probe = unknown, Audit = unknown, GatewayVersion extends 1 | 2 = 1>(params: {
  base: ChatChannelPluginBase<ChannelPlugin<TResolvedAccount, Probe, Audit, GatewayVersion>>;
  security?: ChannelSecurityAdapter<TResolvedAccount> | ChatChannelSecurityOptions<TResolvedAccount>;
  pairing?: ChannelPairingAdapter | ChatChannelPairingOptions;
  threading?: ChannelThreadingAdapter | ChatChannelThreadingOptions<TResolvedAccount>;
  outbound?: ChannelOutboundAdapter | ChatChannelAttachedOutboundOptions;
}): ChannelPlugin<TResolvedAccount, Probe, Audit, GatewayVersion>;
/** Create the shared base object for channel plugins that override only selected surfaces. */
declare function createChannelPluginBase<TResolvedAccount>(params: CreateChannelPluginBaseOptions<TResolvedAccount>): CreatedChannelPluginBase<TResolvedAccount>;
//#endregion
export { generateSecureUuid as C, generateSecureToken as S, enqueueKeyedTask as T, TailscaleStatusCommandResult as _, buildThreadAwareOutboundSessionRoute as a, resolveTailscalePublishedHost as b, defineChannelPluginEntry as c, getChatChannelMetaForSdk as d, recoverCurrentThreadSessionId as f, resolveGatewayBindUrl as g, GatewayBindUrlResult as h, buildChannelOutboundSessionRoute as i, defineSetupPluginEntry as l, formatZonedTimestamp as m, ThreadAwareOutboundSessionRouteRecoveryContext as n, createChannelPluginBase as o, resolveConfiguredAcpBindingRecord as p, ThreadAwareOutboundSessionRouteThreadSource as r, createChatChannelPlugin as s, ChannelOutboundSessionRouteParams as t, ensureConfiguredAcpBindingReady as u, TailscaleStatusCommandRunner as v, KeyedAsyncQueue as w, resolveTailscaleServeGatewayUrlsWithRunner as x, resolveTailnetHostWithRunner as y };