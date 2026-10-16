import { G as AgentBinding, Vt as GroupToolPolicyConfig, r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { p as DmScope } from "./types.base-D8MIFbSh.js";
import { pn as ReplyPayload } from "./reply-payload-DazZPys5.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
import "./manifest-registry-Bj1Q7bnt.js";
import { S as ExecApprovalResolved, b as ExecApprovalRequest, d as PluginApprovalRequest, o as SystemAgentApprovalRequest, p as PluginApprovalResolved, r as ChannelApprovalKind } from "./approval-types-DOLowId2.js";
import { D as ChannelSecurityDmPolicy, E as ChannelSecurityContext, O as ChannelStatusIssue, d as ChannelGroupContext, f as ChannelHeartbeatDeps, i as ChannelAccountState, l as ChannelDirectoryEntry, p as ChannelLogSink, r as ChannelAccountSnapshot } from "./types.core-Bra2QBA5.js";
import { T as ChannelApprovalNativeAdapter, c as ChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-types-DDiXSqb1.js";
import { t as PluginServiceSchedulerV1 } from "./service-scheduler.types-BeqzszjJ.js";
import { n as ResolvedAgentRoute } from "./resolve-route-Dv1zO_Td.js";
import { n as SecretDefaults, t as ResolverContext } from "./runtime-shared-BbVsAF3Z.js";
import { n as SecretTargetRegistryEntry } from "./target-registry-types-rt3qR_99.js";
import { r as ChannelRuntimeSurface } from "./channel-runtime-surface.types-W_EoSebH.js";
import "./outbound.types-B8D3jrzb.js";
//#region src/channels/plugins/legacy-state-migration.types.d.ts
type ChannelLegacyStateMigrationPlan = {
  kind: "copy" | "move";
  label: string;
  sourcePath: string;
  targetPath: string;
} | {
  kind: "plugin-state-import";
  label: string;
  sourcePath: string;
  targetPath: string;
  pluginId: string;
  namespace: string;
  maxEntries: number;
  defaultTtlMs?: number;
  scopeKey: string;
  stateDir?: string;
  cleanupSource?: "rename" | "remove";
  cleanupWhenEmpty?: boolean;
  /** Only for unused artifacts whose retained bytes cannot affect runtime state. */
  cleanupWarningDisposition?: "recoverable";
  /** Deletes a non-file legacy source (e.g. plugin-state rows) once all entries are covered. */
  removeSource?: () => void | Promise<void>;
  preview?: string;
  shouldReplaceExistingEntry?: (params: {
    key: string;
    existingValue: unknown;
    incomingValue: unknown;
  }) => boolean | Promise<boolean>;
  /**
   * `timestamp` (epoch ms) and `ttlMs` order entries newest-first when capacity forces a
   * partial import; `timestamp` is also persisted as the migrated row's creation time so
   * cap eviction keeps treating imported rows as old as their legacy source.
   */
  readEntries: () => Array<{
    key: string;
    value: unknown;
    ttlMs?: number;
    timestamp?: number;
  }> | Promise<Array<{
    key: string;
    value: unknown;
    ttlMs?: number;
    timestamp?: number;
  }>>;
};
//#endregion
//#region src/config/legacy.shared.d.ts
type LegacyConfigRule = {
  path: string[];
  message: string;
  match?: (value: unknown, root: Record<string, unknown>) => boolean;
  requireSourceLiteral?: boolean;
};
//#endregion
//#region src/security/audit.types.d.ts
/** Severity levels emitted by security audit checks. */
type SecurityAuditSeverity = "info" | "warn" | "critical";
/** One actionable or informational security audit finding. */
type SecurityAuditFinding = {
  checkId: string;
  severity: SecurityAuditSeverity;
  title: string;
  detail: string;
  remediation?: string;
};
//#endregion
//#region src/channels/plugins/config-write-policy-shared.d.ts
type ConfigWriteScopeLike<TChannelId extends string = string> = {
  channelId?: TChannelId | null;
  accountId?: string | null;
};
type ConfigWriteTargetLike<TChannelId extends string = string> = {
  kind: "global";
} | {
  kind: "channel";
  scope: {
    channelId: TChannelId;
  };
} | {
  kind: "account";
  scope: {
    channelId: TChannelId;
    accountId: string;
  };
} | {
  kind: "ambiguous";
  scopes: ConfigWriteScopeLike<TChannelId>[];
};
type ConfigWriteAuthorizationResultLike<TChannelId extends string = string> = {
  allowed: true;
} | {
  allowed: false;
  reason: "ambiguous-target" | "origin-disabled" | "target-disabled";
  blockedScope?: {
    kind: "origin" | "target";
    scope: ConfigWriteScopeLike<TChannelId>;
  };
};
//#endregion
//#region src/channels/plugins/config-writes.d.ts
/**
 * Target affected by a channel config write.
 */
type ConfigWriteTarget = ConfigWriteTargetLike;
declare const authorizeConfigWrite: (params: {
  cfg: OpenClawConfig;
  origin?: ConfigWriteScopeLike;
  target?: ConfigWriteTarget;
  allowBypass?: boolean;
}) => ConfigWriteAuthorizationResultLike;
declare const formatConfigWriteDeniedMessage: (params: {
  result: Exclude<ConfigWriteAuthorizationResultLike, {
    allowed: true;
  }>;
  fallbackChannelId?: string | null;
}) => string;
/**
 * Checks whether a gateway client can bypass channel config write policy.
 */
declare function canBypassConfigWritePolicy(params: {
  channel?: string | null;
  gatewayClientScopes?: string[] | null;
}): boolean;
//#endregion
//#region src/channels/plugins/pairing.types.d.ts
/**
 * Channel pairing hooks used by setup and allowlist approval flows.
 */
type ChannelPairingAdapter = {
  idLabel: string;
  normalizeAllowEntry?: (entry: string) => string;
  /** Derive the persisted approval entry from the locally issued request. */
  resolveApprovalStoreEntry?: (request: {
    id: string;
    meta?: Record<string, string>;
  }) => string | null | undefined;
  notifyApproval?: (params: {
    cfg: OpenClawConfig;
    id: string;
    accountId?: string;
    meta?: Record<string, string>;
    runtime?: RuntimeEnv;
  }) => Promise<void>;
};
//#endregion
//#region src/channels/plugins/types.conversation-bindings.d.ts
type ChannelConversationBindingSupport = {
  supportsCurrentConversationBinding?: boolean;
  isCurrentConversationBindingSupported?: (params: {
    accountId: string;
  }) => boolean;
  /** Declares that live bindings come from a channel-registered adapter, never generic storage. */
  bindingStore?: "adapter";
  /**
   * Preferred placement when a command is started from a top-level conversation
   * without an existing native thread id.
   *
   * - `current`: bind/spawn in the current conversation
   * - `child`: create a child thread/conversation first
   */
  defaultTopLevelPlacement?: "current" | "child";
  resolveConversationRef?: (params: {
    accountId?: string | null;
    conversationId: string;
    parentConversationId?: string;
    threadId?: string | number | null;
  }) => {
    conversationId: string;
    parentConversationId?: string;
  } | null;
  buildBoundReplyPayload?: (params: {
    operation: "acp-spawn";
    placement: "current" | "child";
    conversation: {
      channel: string;
      accountId?: string | null;
      conversationId: string;
      parentConversationId?: string;
    };
  }) => Pick<ReplyPayload, "channelData" | "delivery" | "presentation"> | null | Promise<Pick<ReplyPayload, "channelData" | "delivery" | "presentation"> | null>;
  buildModelOverrideParentCandidates?: (params: {
    parentConversationId?: string | null;
  }) => string[] | null | undefined;
  shouldStripThreadFromAnnounceOrigin?: (params: {
    requester: {
      channel?: string;
      to?: string;
      threadId?: string | number;
    };
    entry: {
      channel?: string;
      to?: string;
      threadId?: string | number;
    };
  }) => boolean;
  /** @deprecated Use setIdleTimeoutBySessionKeyAsync. Retained through the next Plugin SDK major. */
  setIdleTimeoutBySessionKey?: (params: {
    targetSessionKey: string;
    accountId?: string | null;
    idleTimeoutMs: number;
  }) => Array<{
    boundAt: number;
    lastActivityAt: number;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
  }>;
  /** @deprecated Use setMaxAgeBySessionKeyAsync. Retained through the next Plugin SDK major. */
  setMaxAgeBySessionKey?: (params: {
    targetSessionKey: string;
    accountId?: string | null;
    maxAgeMs: number;
  }) => ReturnType<NonNullable<ChannelConversationBindingSupport["setIdleTimeoutBySessionKey"]>>;
  setIdleTimeoutBySessionKeyAsync?: (params: Parameters<NonNullable<ChannelConversationBindingSupport["setIdleTimeoutBySessionKey"]>>[0]) => Promise<ReturnType<NonNullable<ChannelConversationBindingSupport["setIdleTimeoutBySessionKey"]>>>;
  setMaxAgeBySessionKeyAsync?: (params: Parameters<NonNullable<ChannelConversationBindingSupport["setMaxAgeBySessionKey"]>>[0]) => Promise<ReturnType<NonNullable<ChannelConversationBindingSupport["setMaxAgeBySessionKey"]>>>;
  createManager?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    stop: () => void | Promise<void>;
  } | Promise<{
    stop: () => void | Promise<void>;
  }>;
};
//#endregion
//#region src/channels/plugins/types.adapters.d.ts
type ChannelActionAvailabilityState = {
  kind: "enabled";
} | {
  kind: "disabled";
} | {
  kind: "unsupported";
};
type ChannelApprovalForwardTarget = {
  channel: string;
  to: string;
  accountId?: string | null;
  threadId?: string | number | null;
  source?: "session" | "target";
};
type ChannelCapabilitiesDisplayTone = "default" | "muted" | "success" | "warn" | "error";
type ChannelCapabilitiesDisplayLine = {
  text: string;
  tone?: ChannelCapabilitiesDisplayTone;
};
type ChannelCapabilitiesDiagnostics = {
  lines?: ChannelCapabilitiesDisplayLine[];
  details?: Record<string, unknown>;
};
type ChannelAccountLinkState = "linked" | "not-linked" | "unknown";
type ChannelConfigAdapter<ResolvedAccount> = {
  listAccountIds: (cfg: OpenClawConfig) => string[];
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  /** Operational account preparation; preferred over the synchronous compatibility hook. */
  resolveAccountAsync?: (cfg: OpenClawConfig, accountId?: string | null) => Promise<ResolvedAccount>;
  inspectAccount?: (cfg: OpenClawConfig, accountId?: string | null) => unknown;
  defaultAccountId?: (cfg: OpenClawConfig) => string;
  setAccountEnabled?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    enabled: boolean;
  }) => OpenClawConfig;
  deleteAccount?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig;
  isEnabled?: (account: ResolvedAccount, cfg: OpenClawConfig) => boolean;
  disabledReason?: (account: ResolvedAccount, cfg: OpenClawConfig) => string;
  isConfigured?: (account: ResolvedAccount, cfg: OpenClawConfig) => boolean | Promise<boolean>;
  isLinked?: (account: ResolvedAccount, cfg: OpenClawConfig) => ChannelAccountLinkState | Promise<ChannelAccountLinkState>;
  unconfiguredReason?: (account: ResolvedAccount, cfg: OpenClawConfig) => string;
  unlinkedReason?: (account: ResolvedAccount, cfg: OpenClawConfig) => string;
  describeAccount?: (account: ResolvedAccount, cfg: OpenClawConfig) => ChannelAccountSnapshot;
  resolveAllowFrom?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Array<string | number> | undefined;
  formatAllowFrom?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    allowFrom: Array<string | number>;
  }) => string[];
  hasConfiguredState?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
  }) => boolean;
  hasConfiguredStateAsync?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
  }) => Promise<boolean>;
  hasPersistedAuthState?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
  }) => boolean;
  resolveDefaultTo?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string | undefined;
};
type ChannelSecretsAdapter = {
  secretTargetRegistryEntries?: readonly SecretTargetRegistryEntry[];
  unsupportedSecretRefSurfacePatterns?: readonly string[];
  collectUnsupportedSecretRefConfigCandidates?: (raw: unknown) => Array<{
    path: string;
    value: unknown;
  }>;
  collectRuntimeConfigAssignments?: (params: {
    config: OpenClawConfig;
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
  }) => void;
};
type ChannelGroupAdapter = {
  resolveRequireMention?: (params: ChannelGroupContext) => boolean | undefined;
  resolveToolPolicy?: (params: ChannelGroupContext) => GroupToolPolicyConfig | undefined;
};
type ChannelStatusAdapter<ResolvedAccount, Probe = unknown, Audit = unknown> = {
  defaultRuntime?: ChannelAccountSnapshot;
  buildChannelSummary?: (params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    defaultAccountId: string;
    snapshot: ChannelAccountSnapshot;
  }) => Record<string, unknown> | Promise<Record<string, unknown>>;
  probeAccount?: (params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
  }) => Promise<Probe>;
  formatCapabilitiesProbe?: (params: {
    probe: Probe;
  }) => ChannelCapabilitiesDisplayLine[];
  auditAccount?: (params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
    probe?: Probe;
  }) => Promise<Audit>;
  buildCapabilitiesDiagnostics?: (params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
    probe?: Probe;
    audit?: Audit;
    target?: string;
  }) => Promise<ChannelCapabilitiesDiagnostics | undefined>;
  buildAccountSnapshot?: (params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    runtime?: ChannelAccountSnapshot;
    probe?: Probe;
    audit?: Audit;
  }) => ChannelAccountSnapshot | Promise<ChannelAccountSnapshot>;
  logSelfId?: (params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    includeChannelPrefix?: boolean;
  }) => void;
  resolveAccountState?: (params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    configured: boolean;
    enabled: boolean;
  }) => ChannelAccountState;
  collectStatusIssues?: (accounts: ChannelAccountSnapshot[]) => ChannelStatusIssue[];
};
type ChannelGatewayContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId: string;
  account: ResolvedAccount;
  runtime: RuntimeEnv;
  abortSignal: AbortSignal;
  /** Account-owned timed work; required by the version 2 Gateway adapter. */
  scheduler?: PluginServiceSchedulerV1;
  log?: ChannelLogSink;
  getStatus: () => ChannelAccountSnapshot;
  setStatus: (next: ChannelAccountSnapshot) => void;
  /** Clear cached outbound directory lookups after the channel accepts newer directory data. */
  invalidateDirectoryCache?: () => void;
  /**
   * Host-provided channel helpers for dispatch, routing, sessions, text, media,
   * command authorization, groups, and pairing. Present when Gateway startup
   * has a runtime resolver; external plugins must handle its absence.
   * @since Plugin SDK 2026.2.19
   */
  channelRuntime?: ChannelRuntimeSurface;
};
type ChannelGatewayContextV2<ResolvedAccount = unknown> = ChannelGatewayContext<ResolvedAccount> & {
  scheduler: PluginServiceSchedulerV1;
};
type ChannelLogoutResult = {
  cleared: boolean;
  loggedOut?: boolean;
  [key: string]: unknown;
};
type ChannelLoginWithQrStartResult = {
  qrDataUrl?: string;
  message: string;
  connected?: boolean;
  sessionKey?: string;
};
type ChannelLoginWithQrWaitResult = {
  connected: boolean;
  message: string;
  qrDataUrl?: string;
};
type ChannelLogoutContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId: string;
  account: ResolvedAccount;
  runtime: RuntimeEnv;
  log?: ChannelLogSink;
};
type ChannelGatewayAdapter<ResolvedAccount = unknown> = {
  apiVersion?: 1;
  startAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<unknown>;
  stopAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<void>;
  /** Keep gateway auth bypass resolution mirrored through a lightweight top-level `gateway-auth-api.ts` artifact. */
  resolveGatewayAuthBypassPaths?: (params: {
    cfg: OpenClawConfig;
  }) => string[];
  loginWithQrStart?: (params: {
    accountId?: string;
    force?: boolean;
    timeoutMs?: number;
    verbose?: boolean;
  }) => Promise<ChannelLoginWithQrStartResult>;
  loginWithQrWait?: (params: {
    accountId?: string;
    sessionKey?: string;
    timeoutMs?: number;
    currentQrDataUrl?: string;
  }) => Promise<ChannelLoginWithQrWaitResult>;
  logoutAccount?: (ctx: ChannelLogoutContext<ResolvedAccount>) => Promise<ChannelLogoutResult>;
};
type ChannelGatewayAdapterV2<ResolvedAccount = unknown> = Omit<ChannelGatewayAdapter<ResolvedAccount>, "apiVersion" | "startAccount" | "stopAccount"> & {
  apiVersion: 2;
  startAccount?: (ctx: ChannelGatewayContextV2<ResolvedAccount>) => Promise<unknown>;
  stopAccount?: (ctx: ChannelGatewayContextV2<ResolvedAccount>) => Promise<void>;
};
type ChannelAuthAdapter = {
  login?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    runtime: RuntimeEnv;
    verbose?: boolean;
    channelInput?: string | null;
  }) => Promise<void>;
};
type ChannelHeartbeatAdapter = {
  checkReady?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<{
    ok: boolean;
    reason: string;
  }>;
  sendTyping?: (params: {
    cfg: OpenClawConfig;
    to: string;
    accountId?: string | null;
    threadId?: string | number | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<void> | void;
  /** Optional owned typing: recheck the guard after transport waits and honor cancellation. */
  sendTypingGuarded?: (params: {
    cfg: OpenClawConfig;
    to: string;
    accountId?: string | null;
    threadId?: string | number | null;
    signal: AbortSignal;
    assertPlatformSendAuthorized: () => void;
  }) => Promise<void> | void;
  clearTyping?: NonNullable<ChannelHeartbeatAdapter["sendTyping"]>;
};
type ChannelDirectorySelfParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryListParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryListGroupMembersParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  groupId: string;
  limit?: number | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryAdapter = {
  self?: (params: ChannelDirectorySelfParams) => Promise<ChannelDirectoryEntry | null>;
  listPeers?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listPeersLive?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroups?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroupsLive?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroupMembers?: (params: ChannelDirectoryListGroupMembersParams) => Promise<ChannelDirectoryEntry[]>;
};
type ChannelResolveKind = "user" | "group";
type ChannelResolveResult = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  note?: string;
};
type ChannelResolverAdapter = {
  resolveTargets: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    inputs: string[];
    kind: ChannelResolveKind;
    runtime: RuntimeEnv;
  }) => Promise<ChannelResolveResult[]>;
};
type ChannelElevatedAdapter = {
  allowFromFallback?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Array<string | number> | undefined;
};
type ChannelCommandAdapter = {
  enforceOwnerForCommands?: boolean;
  skipWhenConfigEmpty?: boolean;
  nativeCommandsAutoEnabled?: boolean;
  nativeSkillsAutoEnabled?: boolean;
  preferSenderE164ForCommands?: boolean;
  resolveNativeCommandName?: (params: {
    commandKey: string;
    defaultName: string;
  }) => string | undefined;
  buildCommandsListChannelData?: (params: {
    currentPage: number;
    totalPages: number;
    agentId?: string;
  }) => ReplyPayload["channelData"] | null;
  buildModelsMenuChannelData?: (params: {
    providers: Array<{
      id: string;
      count: number;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsProviderChannelData?: NonNullable<ChannelCommandAdapter["buildModelsMenuChannelData"]>;
  buildModelsAddProviderChannelData?: (params: {
    providers: Array<{
      id: string;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsListChannelData?: (params: {
    provider: string;
    models: readonly string[];
    currentModel?: string;
    currentPage: number;
    totalPages: number;
    pageSize?: number;
    modelNames?: ReadonlyMap<string, string>;
  }) => ReplyPayload["channelData"] | null;
  buildModelBrowseChannelData?: () => ReplyPayload["channelData"] | null;
};
type ChannelDoctorConfigMutation = {
  config: OpenClawConfig;
  changes: string[];
  warnings?: string[];
  /** null defers environment-dependent eligibility; an undefined account ID selects the root. */
  historicalWebhookAccountIds?: readonly (string | undefined)[] | null;
};
type ChannelDoctorLegacyConfigRule = LegacyConfigRule;
type ChannelDoctorSequenceResult = {
  changeNotes: string[];
  infoNotes?: string[];
  warningNotes: string[];
};
type ChannelDoctorEmptyAllowlistAccountContext = {
  account: Record<string, unknown>;
  channelName: string;
  dmPolicy?: string;
  effectiveAllowFrom?: Array<string | number>;
  parent?: Record<string, unknown>;
  prefix: string;
};
type ChannelDoctorAdapter = {
  dmAllowFromMode?: "topOnly" | "topOrNested" | "nestedOnly";
  groupModel?: "sender" | "route" | "hybrid";
  groupAllowFromFallbackToAllowFrom?: boolean;
  warnOnEmptyGroupSenderAllowlist?: boolean;
  legacyConfigRules?: LegacyConfigRule[];
  normalizeCompatibilityConfig?: (params: {
    cfg: OpenClawConfig;
  }) => ChannelDoctorConfigMutation;
  collectPreviewWarnings?: (params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
  }) => string[] | Promise<string[]>;
  collectMutableAllowlistWarnings?: (params: {
    cfg: OpenClawConfig;
  }) => string[] | Promise<string[]>;
  repairConfig?: (params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  runConfigSequence?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    shouldRepair: boolean;
  }) => ChannelDoctorSequenceResult | Promise<ChannelDoctorSequenceResult>;
  cleanStaleConfig?: (params: {
    cfg: OpenClawConfig;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  collectEmptyAllowlistExtraWarnings?: (params: ChannelDoctorEmptyAllowlistAccountContext) => string[];
  shouldSkipDefaultEmptyGroupAllowlistWarning?: (params: ChannelDoctorEmptyAllowlistAccountContext) => boolean;
};
type ChannelLifecycleAdapter = {
  onAccountConfigChanged?: (params: {
    prevCfg: OpenClawConfig;
    nextCfg: OpenClawConfig;
    accountId: string;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  onAccountRemoved?: (params: {
    prevCfg: OpenClawConfig;
    accountId: string;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  runStartupMaintenance?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    log: {
      info?: (message: string) => void;
      warn?: (message: string) => void;
    };
    trigger?: string;
    logPrefix?: string;
  }) => Promise<void> | void;
  /**
   * @deprecated Export stateMigrations from the plugin doctor contract instead.
   * Removal plan: remove the lifecycle adapter after the 2027.1 external-plugin migration window.
   */
  detectLegacyStateMigrations?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
  }) => ChannelLegacyStateMigrationPlan[] | Promise<ChannelLegacyStateMigrationPlan[]>;
};
type ChannelApprovalForwardingFallbackParams = {
  cfg: OpenClawConfig;
  approvalKind: ChannelApprovalKind;
  target: ChannelApprovalForwardTarget;
  request: ExecApprovalRequest | PluginApprovalRequest | SystemAgentApprovalRequest;
};
type ChannelApprovalDeliveryAdapter = {
  hasConfiguredDmRoute?: (params: {
    cfg: OpenClawConfig;
  }) => boolean;
  /** Deny a fallback that cannot satisfy this request's reviewer policy, even without a native handler. */
  shouldBlockForwardingFallback?: (params: ChannelApprovalForwardingFallbackParams) => boolean;
  shouldSuppressForwardingFallback?: (params: ChannelApprovalForwardingFallbackParams) => boolean;
};
type ChannelApproveCommandBehavior = {
  kind: "allow";
} | {
  kind: "ignore";
} | {
  kind: "reply";
  text: string;
};
type ChannelApprovalRenderHandlers<Request, Resolved> = {
  buildPendingPayload?: (params: {
    cfg: OpenClawConfig;
    request: Request;
    target: ChannelApprovalForwardTarget;
    nowMs: number;
  }) => ReplyPayload | null;
  buildResolvedPayload?: (params: {
    cfg: OpenClawConfig;
    resolved: Resolved;
    target: ChannelApprovalForwardTarget;
  }) => ReplyPayload | null;
};
type ChannelApprovalRenderAdapter = {
  exec?: ChannelApprovalRenderHandlers<ExecApprovalRequest, ExecApprovalResolved>;
  plugin?: ChannelApprovalRenderHandlers<PluginApprovalRequest, PluginApprovalResolved>;
};
type ChannelApprovalAdapter = {
  delivery?: ChannelApprovalDeliveryAdapter;
  nativeRuntime?: ChannelApprovalNativeRuntimeAdapter;
  render?: ChannelApprovalRenderAdapter;
  native?: ChannelApprovalNativeAdapter;
  describeExecApprovalSetup?: (params: {
    channel: string;
    channelLabel: string;
    accountId?: string;
  }) => string | null | undefined;
  describePluginApprovalSetup?: (params: {
    channel: string;
    channelLabel: string;
    accountId?: string;
  }) => string | null | undefined;
};
type ChannelApprovalCapability = ChannelApprovalAdapter & {
  /** Confirms that this channel enforces configured plugin reviewer lists for routing and decisions. */
  supportsScopedPluginApprovalApprovers?: true;
  authorizeActorAction?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
    action: "approve";
    approvalKind: ChannelApprovalKind;
    request?: ExecApprovalRequest | PluginApprovalRequest | SystemAgentApprovalRequest;
  }) => {
    authorized: boolean;
    reason?: string;
  };
  resolveReviewerSenderId?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
    spaceId?: string | null;
  }) => string | undefined;
  getActionAvailabilityState?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    action: "approve";
    approvalKind?: ChannelApprovalKind;
    /** Exact pending plugin request when route availability depends on its selected tool. */
    request?: PluginApprovalRequest;
  }) => ChannelActionAvailabilityState;
  /** Exec-native client availability for the initiating surface; distinct from same-chat auth. */
  getExecInitiatingSurfaceState?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    action: "approve";
  }) => ChannelActionAvailabilityState;
  resolveApproveCommandBehavior?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
    approvalKind: ChannelApprovalKind;
  }) => ChannelApproveCommandBehavior | undefined;
};
type ChannelAllowlistConfigEditResult = {
  kind: "ok";
  changed: boolean;
  pathLabel: string;
  writeTarget: ConfigWriteTarget;
} | {
  kind: "invalid-entry";
};
type ChannelAllowlistConfig = {
  dmAllowFrom?: Array<string | number>;
  groupAllowFrom?: Array<string | number>;
  dmPolicy?: string;
  groupPolicy?: string;
  groupOverrides?: Array<{
    label: string;
    entries: Array<string | number>;
  }>;
};
type ChannelAllowlistAdapter = {
  applyConfigEdit?: (params: {
    cfg: OpenClawConfig;
    parsedConfig: Record<string, unknown>;
    accountId?: string | null;
    scope: "dm" | "group";
    action: "add" | "remove";
    entry: string;
  }) => ChannelAllowlistConfigEditResult | Promise<ChannelAllowlistConfigEditResult> | null;
  readConfig?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => ChannelAllowlistConfig | Promise<ChannelAllowlistConfig>;
  resolveNames?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    scope: "dm" | "group";
    entries: string[];
  }) => Array<{
    input: string;
    resolved: boolean;
    name?: string | null;
  }> | Promise<Array<{
    input: string;
    resolved: boolean;
    name?: string | null;
  }>>;
  supportsScope?: (params: {
    scope: "dm" | "group" | "all";
  }) => boolean;
};
type ChannelConfiguredBindingConversationRef = {
  conversationId: string;
  parentConversationId?: string;
};
type ChannelConfiguredBindingMatch = ChannelConfiguredBindingConversationRef & {
  matchPriority?: number;
};
type ChannelCommandConversationContext = {
  accountId: string;
  threadId?: string;
  threadParentId?: string;
  senderId?: string;
  sessionKey?: string;
  parentSessionKey?: string;
  from?: string;
  chatType?: string;
  originatingTo?: string;
  commandTo?: string;
  fallbackTo?: string;
};
type ChannelConfiguredBindingProvider = {
  selfParentConversationByDefault?: boolean;
  compileConfiguredBinding: (params: {
    binding: AgentBinding;
    conversationId: string;
  }) => ChannelConfiguredBindingConversationRef | null;
  matchInboundConversation: (params: {
    binding: AgentBinding;
    compiledBinding: ChannelConfiguredBindingConversationRef;
    conversationId: string;
    parentConversationId?: string;
  }) => ChannelConfiguredBindingMatch | null;
  resolveCommandConversation?: (params: ChannelCommandConversationContext) => ChannelConfiguredBindingConversationRef | null;
};
type ChannelSecurityDmRouteContext<ResolvedAccount> = ChannelSecurityContext<ResolvedAccount> & {
  accountId: string;
  principalId?: string;
};
type ChannelSecurityAdapter<ResolvedAccount = unknown> = {
  applyConfigFixes?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  resolveDmPolicy?: (ctx: ChannelSecurityContext<ResolvedAccount>) => ChannelSecurityDmPolicy | null;
  dmRouting?: {
    resolveDmScope?: (ctx: ChannelSecurityDmRouteContext<ResolvedAccount>) => DmScope | undefined;
    resolveDmRoute?: (ctx: ChannelSecurityDmRouteContext<ResolvedAccount> & {
      route: ResolvedAgentRoute;
    }) => {
      kind: "core" | "isolated";
    } | {
      sessionKey: string;
    } | undefined;
  };
  collectWarnings?: (ctx: ChannelSecurityContext<ResolvedAccount>) => Promise<Array<string | SecurityAuditFinding>> | Array<string | SecurityAuditFinding>;
  collectAuditFindings?: (ctx: ChannelSecurityContext<ResolvedAccount> & {
    sourceConfig: OpenClawConfig;
    orderedAccountIds: string[];
    hasExplicitAccountPath: boolean;
  }) => Promise<SecurityAuditFinding[]> | SecurityAuditFinding[];
};
//#endregion
export { ChannelStatusAdapter as A, ChannelLegacyStateMigrationPlan as B, ChannelHeartbeatAdapter as C, ChannelResolverAdapter as D, ChannelResolveResult as E, formatConfigWriteDeniedMessage as F, ConfigWriteAuthorizationResultLike as I, ConfigWriteScopeLike as L, ChannelPairingAdapter as M, authorizeConfigWrite as N, ChannelSecretsAdapter as O, canBypassConfigWritePolicy as P, ConfigWriteTargetLike as R, ChannelGroupAdapter as S, ChannelResolveKind as T, ChannelElevatedAdapter as _, ChannelCommandAdapter as a, ChannelGatewayContext as b, ChannelConfiguredBindingConversationRef as c, ChannelDirectoryAdapter as d, ChannelDoctorAdapter as f, ChannelDoctorSequenceResult as g, ChannelDoctorLegacyConfigRule as h, ChannelAuthAdapter as i, ChannelConversationBindingSupport as j, ChannelSecurityAdapter as k, ChannelConfiguredBindingMatch as l, ChannelDoctorEmptyAllowlistAccountContext as m, ChannelApprovalAdapter as n, ChannelCommandConversationContext as o, ChannelDoctorConfigMutation as p, ChannelApprovalCapability as r, ChannelConfigAdapter as s, ChannelAllowlistAdapter as t, ChannelConfiguredBindingProvider as u, ChannelGatewayAdapter as v, ChannelLifecycleAdapter as w, ChannelGatewayContextV2 as x, ChannelGatewayAdapterV2 as y, SecurityAuditFinding as z };