import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { O as ChannelStatusIssue, r as ChannelAccountSnapshot } from "./types.core-D1MQo5ra.js";
import { O as ChannelStatusAdapter } from "./types.adapters-dxHXA2rq.js";
import "./types.public-B8oQ1D30.js";
//#region src/channels/plugins/status-issues/shared.d.ts
/**
 * Formats optional match metadata for status issue messages.
 */
declare function formatMatchMetadata(params: {
  matchKey?: unknown;
  matchSource?: unknown;
}): string | undefined;
/**
 * Appends formatted match metadata to a status issue message.
 */
declare function appendMatchMetadata(message: string, params: {
  matchKey?: unknown;
  matchSource?: unknown;
}): string;
/**
 * Resolves the account id for enabled, configured account snapshots.
 */
declare function resolveEnabledConfiguredAccountId(account: {
  accountId?: unknown;
  enabled?: unknown;
  configured?: unknown;
}): string | null;
/**
 * Collects status issues only for enabled account snapshots.
 */
declare function collectIssuesForEnabledAccounts<T extends {
  accountId?: unknown;
  enabled?: unknown;
}>(params: {
  accounts: ChannelAccountSnapshot[];
  readAccount: (value: ChannelAccountSnapshot) => T | null;
  collectIssues: (params: {
    account: T;
    accountId: string;
    issues: ChannelStatusIssue[];
  }) => void;
}): ChannelStatusIssue[];
//#endregion
//#region src/utils/reaction-level.d.ts
/**
 * Shared reaction-level resolver for channel plugins that expose ACK and agent reaction controls.
 * Channel adapters supply defaults/fallbacks; this helper owns the common flag expansion.
 */
/** User-configurable reaction behavior level for channel delivery. */
type ReactionLevel = "off" | "ack" | "minimal" | "extensive";
/** Expanded reaction flags consumed by runtime delivery and prompt guidance. */
type ResolvedReactionLevel = {
  level: ReactionLevel;
  /** Whether ACK reactions (e.g., 👀 when processing) are enabled. */
  ackEnabled: boolean;
  /** Whether agent-controlled reactions are enabled. */
  agentReactionsEnabled: boolean;
  /** Guidance level for agent reactions (minimal = sparse, extensive = liberal). */
  agentReactionGuidance?: "minimal" | "extensive";
};
/** Resolves raw reaction config into ACK and agent-reaction runtime flags. */
declare function resolveReactionLevel(params: {
  value: unknown;
  defaultLevel: ReactionLevel;
  invalidFallback: "ack" | "minimal";
}): ResolvedReactionLevel;
//#endregion
//#region src/plugin-sdk/status-helpers.d.ts
type RuntimeLifecycleSnapshot = {
  linked?: boolean | null;
  running?: boolean | null;
  connected?: boolean | null;
  restartPending?: boolean | null;
  reconnectAttempts?: number | null;
  lastConnectedAt?: number | null;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | null;
  lastEventAt?: number | null;
  lastTransportActivityAt?: number | null;
  healthState?: string | null;
  lifecycle?: ChannelAccountSnapshot["lifecycle"] | null;
  ingressUnavailable?: true | null;
  terminalDisconnect?: boolean | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
  busy?: boolean | null;
  activeRuns?: number | null;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
};
type StatusSnapshotExtra = Record<string, unknown>;
type ComputedAccountStatusBase = {
  accountId: string;
  name?: string;
  enabled?: boolean;
  configured?: boolean;
};
type ComputedAccountStatusAdapterParams<ResolvedAccount, Probe, Audit> = {
  account: ResolvedAccount;
  cfg: OpenClawConfig;
  runtime?: ChannelAccountSnapshot;
  probe?: Probe;
  audit?: Audit;
};
type ComputedAccountStatusSnapshot<TExtra extends StatusSnapshotExtra = StatusSnapshotExtra> = ComputedAccountStatusBase & {
  extra?: TExtra;
};
type ConfigIssueAccount = {
  accountId?: string | null;
  configured?: boolean | null;
} & Record<string, unknown>;
declare const ACCOUNT_STATUS_SNAPSHOT_FIELDS: readonly ["accountId", "enabled", "configured", "running", "connected"];
type AccountStatusSnapshot<TField extends string = never> = Record<(typeof ACCOUNT_STATUS_SNAPSHOT_FIELDS)[number] | TField, unknown>;
/** Coerce a status row to the standard account fields plus channel-owned extras. */
declare function readAccountStatusSnapshot<TField extends string>(value: unknown, extraFields: readonly TField[]): AccountStatusSnapshot<TField> | null;
/** Build the standard warning for an enabled/configured account with open DM policy. */
declare function standardDmPolicyOpenIssue(params: {
  channel: ChannelStatusIssue["channel"];
  accountId: string;
  channelLabel: string;
  configPath: string;
}): ChannelStatusIssue;
/** Build a standard authentication issue for an enabled but unconfigured account. */
declare function standardNotConfiguredIssue(params: {
  channel: ChannelStatusIssue["channel"];
  accountId: string;
  message: string;
  fix: string;
}): ChannelStatusIssue;
/** Create the baseline runtime snapshot shape used by channel/account status stores. */
declare function createDefaultChannelRuntimeState<T extends Record<string, unknown>>(accountId: string, extra?: T): {
  accountId: string;
  running: false;
  lastStartAt: null;
  lastStopAt: null;
  lastError: null;
} & T;
/** Normalize a channel-level status summary so missing lifecycle fields become explicit nulls. */
declare function buildBaseChannelStatusSummary<TExtra extends StatusSnapshotExtra>(snapshot: {
  configured?: boolean | null;
  running?: boolean | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
}, extra?: TExtra): {
  configured: boolean;
} & TExtra & {
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
};
/** Extend the base summary with probe fields while preserving stable null defaults. */
declare function buildProbeChannelStatusSummary<TExtra extends Record<string, unknown>>(snapshot: {
  configured?: boolean | null;
  running?: boolean | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: unknown;
  lastProbeAt?: number | null;
}, extra?: TExtra): {
  configured: boolean;
} & TExtra & {
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  probe: unknown;
  lastProbeAt: number | null;
};
/** Build webhook channel summaries with a stable default mode. */
declare function buildWebhookChannelStatusSummary<TExtra extends StatusSnapshotExtra>(snapshot: {
  configured?: boolean | null;
  mode?: string | null;
  running?: boolean | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
}, extra?: TExtra): {
  configured: boolean;
} & {
  mode: string;
} & TExtra & {
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
};
/** Build the standard per-account status payload from config metadata plus runtime state. */
declare function buildBaseAccountStatusSnapshot<TExtra extends StatusSnapshotExtra>(params: {
  account: {
    accountId: string;
    name?: string;
    enabled?: boolean;
    configured?: boolean;
  };
  runtime?: RuntimeLifecycleSnapshot | null;
  probe?: unknown;
}, extra?: TExtra): {
  accountId: string;
  name: string | undefined;
  enabled: boolean | undefined;
  configured: boolean | undefined;
  lastInboundAt: number | null;
  lastOutboundAt: number | null;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  probe: unknown;
  linked?: boolean | undefined;
  connected?: boolean | undefined;
  restartPending?: boolean | undefined;
  reconnectAttempts?: number | undefined;
  lastConnectedAt?: number | undefined;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | undefined;
  lastEventAt?: number | undefined;
  lastTransportActivityAt?: number | undefined;
  healthState?: string | undefined;
  lifecycle?: "blocked" | "ready" | "recovering" | "starting" | "stopped" | undefined;
  ingressUnavailable?: true | undefined;
  terminalDisconnect?: true | undefined;
  busy?: boolean | undefined;
  activeRuns?: number | undefined;
  lastRunActivityAt?: number | undefined;
  activeRunStartedAt?: number | undefined;
} & TExtra;
/** Convenience wrapper when the caller already has flattened account fields instead of an account object. */
declare function buildComputedAccountStatusSnapshot<TExtra extends StatusSnapshotExtra>(params: {
  accountId: string;
  name?: string;
  enabled?: boolean;
  configured?: boolean;
  runtime?: RuntimeLifecycleSnapshot | null;
  probe?: unknown;
}, extra?: TExtra): {
  accountId: string;
  name: string | undefined;
  enabled: boolean | undefined;
  configured: boolean | undefined;
  lastInboundAt: number | null;
  lastOutboundAt: number | null;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  probe: unknown;
  linked?: boolean | undefined;
  connected?: boolean | undefined;
  restartPending?: boolean | undefined;
  reconnectAttempts?: number | undefined;
  lastConnectedAt?: number | undefined;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | undefined;
  lastEventAt?: number | undefined;
  lastTransportActivityAt?: number | undefined;
  healthState?: string | undefined;
  lifecycle?: "blocked" | "ready" | "recovering" | "starting" | "stopped" | undefined;
  ingressUnavailable?: true | undefined;
  terminalDisconnect?: true | undefined;
  busy?: boolean | undefined;
  activeRuns?: number | undefined;
  lastRunActivityAt?: number | undefined;
  activeRunStartedAt?: number | undefined;
} & TExtra;
/** Build a full status adapter when only configured/extras vary per account. */
declare function createComputedAccountStatusAdapter<ResolvedAccount, Probe = unknown, Audit = unknown, TExtra extends StatusSnapshotExtra = StatusSnapshotExtra>(options: Omit<ChannelStatusAdapter<ResolvedAccount, Probe, Audit>, "buildAccountSnapshot"> & {
  resolveAccountSnapshot: (params: ComputedAccountStatusAdapterParams<ResolvedAccount, Probe, Audit>) => ComputedAccountStatusSnapshot<TExtra>;
}): ChannelStatusAdapter<ResolvedAccount, Probe, Audit>;
/** Async variant for channels that compute configured state or snapshot extras from I/O. */
declare function createAsyncComputedAccountStatusAdapter<ResolvedAccount, Probe = unknown, Audit = unknown, TExtra extends StatusSnapshotExtra = StatusSnapshotExtra>(options: Omit<ChannelStatusAdapter<ResolvedAccount, Probe, Audit>, "buildAccountSnapshot"> & {
  resolveAccountSnapshot: (params: ComputedAccountStatusAdapterParams<ResolvedAccount, Probe, Audit>) => Promise<ComputedAccountStatusSnapshot<TExtra>>;
}): ChannelStatusAdapter<ResolvedAccount, Probe, Audit>;
/** Normalize runtime-only account state into the shared status snapshot fields. */
declare function buildRuntimeAccountStatusSnapshot<TExtra extends StatusSnapshotExtra>(params: {
  runtime?: RuntimeLifecycleSnapshot | null;
  probe?: unknown;
}, extra?: TExtra): {
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  probe: unknown;
  linked?: boolean | undefined;
  connected?: boolean | undefined;
  restartPending?: boolean | undefined;
  reconnectAttempts?: number | undefined;
  lastConnectedAt?: number | undefined;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | undefined;
  lastEventAt?: number | undefined;
  lastTransportActivityAt?: number | undefined;
  healthState?: string | undefined;
  lifecycle?: "blocked" | "ready" | "recovering" | "starting" | "stopped" | undefined;
  ingressUnavailable?: true | undefined;
  terminalDisconnect?: true | undefined;
  busy?: boolean | undefined;
  activeRuns?: number | undefined;
  lastRunActivityAt?: number | undefined;
  activeRunStartedAt?: number | undefined;
} & TExtra;
/** Build token-based channel status summaries with optional mode reporting. */
declare function buildTokenChannelStatusSummary(snapshot: {
  configured?: boolean | null;
  tokenSource?: string | null;
  running?: boolean | null;
  mode?: string | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: unknown;
  lastProbeAt?: number | null;
}, opts?: {
  includeMode?: boolean;
}): {
  configured: boolean;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  tokenSource: string;
  probe: unknown;
  lastProbeAt: number | null;
} | {
  configured: boolean;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  tokenSource: string;
  probe: unknown;
  lastProbeAt: number | null;
  mode: string | null;
};
/** Build a config-issue collector from snapshot-safe source metadata only. */
declare function createDependentCredentialStatusIssueCollector(options: {
  channel: string;
  dependencySourceKey: string;
  missingPrimaryMessage: string;
  missingDependentMessage: string;
  isDependencyConfigured?: ((value: unknown) => boolean) | undefined;
}): (accounts: ConfigIssueAccount[]) => ChannelStatusIssue[];
/** Convert account runtime errors into the generic channel status issue format. */
declare function collectStatusIssuesFromLastError(channel: string, accounts: Array<{
  accountId: string;
  lastError?: unknown;
}>): ChannelStatusIssue[];
//#endregion
export { resolveEnabledConfiguredAccountId as C, formatMatchMetadata as S, ReactionLevel as _, buildProbeChannelStatusSummary as a, appendMatchMetadata as b, buildWebhookChannelStatusSummary as c, createComputedAccountStatusAdapter as d, createDefaultChannelRuntimeState as f, standardNotConfiguredIssue as g, standardDmPolicyOpenIssue as h, buildComputedAccountStatusSnapshot as i, collectStatusIssuesFromLastError as l, readAccountStatusSnapshot as m, buildBaseAccountStatusSnapshot as n, buildRuntimeAccountStatusSnapshot as o, createDependentCredentialStatusIssueCollector as p, buildBaseChannelStatusSummary as r, buildTokenChannelStatusSummary as s, AccountStatusSnapshot as t, createAsyncComputedAccountStatusAdapter as u, ResolvedReactionLevel as v, collectIssuesForEnabledAccounts as x, resolveReactionLevel as y };