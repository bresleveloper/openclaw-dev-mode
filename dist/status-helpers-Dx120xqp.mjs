import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { i as resolveChannelAccountState, t as applyChannelAccountState } from "./account-state-Bap6_YQI.mjs";
//#region src/channels/plugins/status-issues/shared.ts
/**
* Channel status issue helper utilities.
*
* Formats status metadata and finds enabled/configured account ids for diagnostics.
*/
/**
* Formats optional match metadata for status issue messages.
*/
function formatMatchMetadata(params) {
	const matchKey = typeof params.matchKey === "string" ? params.matchKey : typeof params.matchKey === "number" ? String(params.matchKey) : void 0;
	const matchSource = normalizeOptionalString(params.matchSource);
	const parts = [matchKey ? `matchKey=${matchKey}` : null, matchSource ? `matchSource=${matchSource}` : null].filter((entry) => Boolean(entry));
	return parts.length > 0 ? parts.join(" ") : void 0;
}
/**
* Appends formatted match metadata to a status issue message.
*/
function appendMatchMetadata(message, params) {
	const meta = formatMatchMetadata(params);
	return meta ? `${message} (${meta})` : message;
}
/**
* Resolves the account id for enabled, configured account snapshots.
*/
function resolveEnabledConfiguredAccountId(account) {
	const accountId = normalizeOptionalString(account.accountId) ?? "default";
	const enabled = account.enabled !== false;
	const configured = account.configured === true;
	return enabled && configured ? accountId : null;
}
/**
* Collects status issues only for enabled account snapshots.
*/
function collectIssuesForEnabledAccounts(params) {
	const issues = [];
	for (const entry of params.accounts) {
		const account = params.readAccount(entry);
		if (!account || account.enabled === false) continue;
		const accountId = normalizeOptionalString(account.accountId) ?? "default";
		params.collectIssues({
			account,
			accountId,
			issues
		});
	}
	return issues;
}
//#endregion
//#region src/utils/reaction-level.ts
const LEVELS = /* @__PURE__ */ new Set([
	"off",
	"ack",
	"minimal",
	"extensive"
]);
/** Parses a raw config value while preserving missing vs invalid for fallback policy. */
function parseLevel(value) {
	if (value === void 0 || value === null) return { kind: "missing" };
	if (typeof value !== "string") return { kind: "invalid" };
	const trimmed = value.trim();
	if (!trimmed) return { kind: "missing" };
	if (LEVELS.has(trimmed)) return {
		kind: "ok",
		value: trimmed
	};
	return { kind: "invalid" };
}
/** Resolves raw reaction config into ACK and agent-reaction runtime flags. */
function resolveReactionLevel(params) {
	const parsed = parseLevel(params.value);
	switch (parsed.kind === "ok" ? parsed.value : parsed.kind === "missing" ? params.defaultLevel : params.invalidFallback) {
		case "off": return {
			level: "off",
			ackEnabled: false,
			agentReactionsEnabled: false
		};
		case "ack": return {
			level: "ack",
			ackEnabled: true,
			agentReactionsEnabled: false
		};
		case "minimal": return {
			level: "minimal",
			ackEnabled: false,
			agentReactionsEnabled: true,
			agentReactionGuidance: "minimal"
		};
		case "extensive": return {
			level: "extensive",
			ackEnabled: false,
			agentReactionsEnabled: true,
			agentReactionGuidance: "extensive"
		};
		default: return {
			level: "minimal",
			ackEnabled: false,
			agentReactionsEnabled: true,
			agentReactionGuidance: "minimal"
		};
	}
}
//#endregion
//#region src/plugin-sdk/status-helpers.ts
const ACCOUNT_STATUS_SNAPSHOT_FIELDS = [
	"accountId",
	"enabled",
	"configured",
	"running",
	"connected"
];
/** Coerce a status row to the standard account fields plus channel-owned extras. */
function readAccountStatusSnapshot(value, extraFields) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	const fields = [...ACCOUNT_STATUS_SNAPSHOT_FIELDS, ...extraFields];
	const result = {};
	for (const field of fields) result[field] = record[field];
	return result;
}
/** Build the standard warning for an enabled/configured account with open DM policy. */
function standardDmPolicyOpenIssue(params) {
	return {
		channel: params.channel,
		accountId: params.accountId,
		kind: "config",
		message: `${params.channelLabel} dmPolicy is "open", allowing any user to message the bot without pairing.`,
		fix: `Set ${params.configPath}.dmPolicy to "pairing" or "allowlist" to restrict access.`
	};
}
/** Build a standard authentication issue for an enabled but unconfigured account. */
function standardNotConfiguredIssue(params) {
	return {
		channel: params.channel,
		accountId: params.accountId,
		kind: "auth",
		message: params.message,
		fix: params.fix
	};
}
function buildComputedAccountStatusAdapterBase(options) {
	return {
		defaultRuntime: options.defaultRuntime,
		buildChannelSummary: options.buildChannelSummary,
		probeAccount: options.probeAccount,
		formatCapabilitiesProbe: options.formatCapabilitiesProbe,
		auditAccount: options.auditAccount,
		buildCapabilitiesDiagnostics: options.buildCapabilitiesDiagnostics,
		logSelfId: options.logSelfId,
		resolveAccountState: options.resolveAccountState,
		collectStatusIssues: options.collectStatusIssues
	};
}
/** Create the baseline runtime snapshot shape used by channel/account status stores. */
function createDefaultChannelRuntimeState(accountId, extra) {
	return {
		accountId,
		running: false,
		lastStartAt: null,
		lastStopAt: null,
		lastError: null,
		...extra ?? {}
	};
}
/** Normalize a channel-level status summary so missing lifecycle fields become explicit nulls. */
function buildBaseChannelStatusSummary(snapshot, extra) {
	return {
		configured: snapshot.configured ?? false,
		...extra ?? {},
		running: snapshot.running ?? false,
		lastStartAt: snapshot.lastStartAt ?? null,
		lastStopAt: snapshot.lastStopAt ?? null,
		lastError: snapshot.lastError ?? null
	};
}
/** Extend the base summary with probe fields while preserving stable null defaults. */
function buildProbeChannelStatusSummary(snapshot, extra) {
	return {
		...buildBaseChannelStatusSummary(snapshot, extra),
		probe: snapshot.probe,
		lastProbeAt: snapshot.lastProbeAt ?? null
	};
}
/** Build webhook channel summaries with a stable default mode. */
function buildWebhookChannelStatusSummary(snapshot, extra) {
	return buildBaseChannelStatusSummary(snapshot, {
		mode: snapshot.mode ?? "webhook",
		...extra ?? {}
	});
}
/** Build the standard per-account status payload from config metadata plus runtime state. */
function buildBaseAccountStatusSnapshot(params, extra) {
	const { account, runtime, probe } = params;
	const snapshot = {
		accountId: account.accountId,
		name: account.name,
		enabled: account.enabled,
		configured: account.configured,
		...buildRuntimeAccountStatusSnapshot({
			runtime,
			probe
		}),
		lastInboundAt: runtime?.lastInboundAt ?? null,
		lastOutboundAt: runtime?.lastOutboundAt ?? null,
		...extra ?? {}
	};
	const state = resolveChannelAccountState({
		enabled: account.enabled !== false,
		configured: account.configured === true,
		linked: typeof snapshot.linked === "boolean" ? snapshot.linked : void 0,
		runtime: snapshot
	});
	applyChannelAccountState(snapshot, state);
	return snapshot;
}
/** Convenience wrapper when the caller already has flattened account fields instead of an account object. */
function buildComputedAccountStatusSnapshot(params, extra) {
	const { accountId, name, enabled, configured, runtime, probe } = params;
	return buildBaseAccountStatusSnapshot({
		account: {
			accountId,
			name,
			enabled,
			configured
		},
		runtime,
		probe
	}, extra);
}
function buildResolvedComputedAccountStatusSnapshot(params, { extra, ...snapshot }) {
	return buildComputedAccountStatusSnapshot({
		...snapshot,
		runtime: params.runtime,
		probe: params.probe
	}, extra);
}
/** Build a full status adapter when only configured/extras vary per account. */
function createComputedAccountStatusAdapter(options) {
	return {
		...buildComputedAccountStatusAdapterBase(options),
		buildAccountSnapshot: (params) => buildResolvedComputedAccountStatusSnapshot(params, options.resolveAccountSnapshot(params))
	};
}
/** Async variant for channels that compute configured state or snapshot extras from I/O. */
function createAsyncComputedAccountStatusAdapter(options) {
	return {
		...buildComputedAccountStatusAdapterBase(options),
		buildAccountSnapshot: async (params) => buildResolvedComputedAccountStatusSnapshot(params, await options.resolveAccountSnapshot(params))
	};
}
/** Normalize runtime-only account state into the shared status snapshot fields. */
function buildRuntimeAccountStatusSnapshot(params, extra) {
	const { runtime, probe } = params;
	return {
		running: runtime?.running ?? false,
		lastStartAt: runtime?.lastStartAt ?? null,
		lastStopAt: runtime?.lastStopAt ?? null,
		lastError: runtime?.lastError ?? null,
		probe,
		...typeof runtime?.linked === "boolean" ? { linked: runtime.linked } : {},
		...typeof runtime?.connected === "boolean" ? { connected: runtime.connected } : {},
		...typeof runtime?.restartPending === "boolean" ? { restartPending: runtime.restartPending } : {},
		...typeof runtime?.reconnectAttempts === "number" ? { reconnectAttempts: runtime.reconnectAttempts } : {},
		...typeof runtime?.lastConnectedAt === "number" ? { lastConnectedAt: runtime.lastConnectedAt } : {},
		...runtime?.lastDisconnect ? { lastDisconnect: runtime.lastDisconnect } : {},
		...typeof runtime?.lastEventAt === "number" ? { lastEventAt: runtime.lastEventAt } : {},
		...typeof runtime?.lastTransportActivityAt === "number" ? { lastTransportActivityAt: runtime.lastTransportActivityAt } : {},
		...typeof runtime?.healthState === "string" ? { healthState: runtime.healthState } : {},
		...runtime?.lifecycle ? { lifecycle: runtime.lifecycle } : {},
		...runtime?.ingressUnavailable === true ? { ingressUnavailable: true } : {},
		...runtime?.terminalDisconnect ? { terminalDisconnect: runtime.terminalDisconnect } : {},
		...typeof runtime?.busy === "boolean" ? { busy: runtime.busy } : {},
		...typeof runtime?.activeRuns === "number" ? { activeRuns: runtime.activeRuns } : {},
		...typeof runtime?.lastRunActivityAt === "number" ? { lastRunActivityAt: runtime.lastRunActivityAt } : {},
		...typeof runtime?.activeRunStartedAt === "number" ? { activeRunStartedAt: runtime.activeRunStartedAt } : {},
		...extra ?? {}
	};
}
/** Build token-based channel status summaries with optional mode reporting. */
function buildTokenChannelStatusSummary(snapshot, opts) {
	const base = {
		...buildBaseChannelStatusSummary(snapshot),
		tokenSource: snapshot.tokenSource ?? "none",
		probe: snapshot.probe,
		lastProbeAt: snapshot.lastProbeAt ?? null
	};
	if (opts?.includeMode === false) return base;
	return {
		...base,
		mode: snapshot.mode ?? null
	};
}
/** Build a config-issue collector from snapshot-safe source metadata only. */
function createDependentCredentialStatusIssueCollector(options) {
	const isDependencyConfigured = options.isDependencyConfigured ?? ((value) => {
		const normalized = typeof value === "string" ? normalizeOptionalString(value) : void 0;
		return Boolean(normalized && normalized !== "none");
	});
	return (accounts) => accounts.flatMap((account) => {
		if (account.configured !== false) return [];
		return [{
			channel: options.channel,
			accountId: account.accountId ?? "",
			kind: "config",
			message: isDependencyConfigured(account[options.dependencySourceKey]) ? options.missingDependentMessage : options.missingPrimaryMessage
		}];
	});
}
/** Convert account runtime errors into the generic channel status issue format. */
function collectStatusIssuesFromLastError(channel, accounts) {
	return accounts.flatMap((account) => {
		const lastError = typeof account.lastError === "string" ? account.lastError.trim() : "";
		if (!lastError) return [];
		return [{
			channel,
			accountId: account.accountId,
			kind: "runtime",
			message: `Channel error: ${lastError}`
		}];
	});
}
//#endregion
export { appendMatchMetadata as _, buildRuntimeAccountStatusSnapshot as a, resolveEnabledConfiguredAccountId as b, collectStatusIssuesFromLastError as c, createDefaultChannelRuntimeState as d, createDependentCredentialStatusIssueCollector as f, resolveReactionLevel as g, standardNotConfiguredIssue as h, buildProbeChannelStatusSummary as i, createAsyncComputedAccountStatusAdapter as l, standardDmPolicyOpenIssue as m, buildBaseChannelStatusSummary as n, buildTokenChannelStatusSummary as o, readAccountStatusSnapshot as p, buildComputedAccountStatusSnapshot as r, buildWebhookChannelStatusSummary as s, buildBaseAccountStatusSnapshot as t, createComputedAccountStatusAdapter as u, collectIssuesForEnabledAccounts as v, formatMatchMetadata as y };
