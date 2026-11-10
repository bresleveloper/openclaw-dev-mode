import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import { u as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-hdzky3AO.mjs";
import "./channel-plugin-ids-Bgv12GOX.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-Ue6gYZgR.mjs";
import { i as resolveChannelAllowFrom } from "./account-resolution-akTcFkRf.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { r as resolveReadOnlyChannelPluginsForConfig } from "./read-only-BTHRPuD9.mjs";
import { n as formatTimeAgo } from "./format-relative-DP9tOdyD.mjs";
import { r as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-BIlgyhxH.mjs";
import { i as formatChannelAllowFrom } from "./account-summary-DHgRbD3b.mjs";
import { n as resolveInspectedChannelAccount } from "./account-inspection-DpPvjRRw.mjs";
import { t as formatChannelStatusState } from "./status-state-CUdQlr68.mjs";
import { n as hasRuntimeCredentialAvailable, r as markConfiguredUnavailableCredentialStatusesAvailable, t as getRuntimeChannelAccounts } from "./read-model-gNfylNK1.mjs";
import { t as collectChannelStatusIssues } from "./channels-status-issues-DRa6QOeK.mjs";
import { t as formatPhoneNumberForCli } from "./phone-number-presentation-CUSLxUVz.mjs";
import "./format-DvaI7amh.mjs";
import fs from "node:fs";
//#region src/commands/status-all/channels-token-summary.ts
function summarizeSources(sources) {
	const counts = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const key = source?.trim() || "unknown";
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts.entries()].toSorted((a, b) => b[1] - a[1]).map(([key, count]) => `${key}${count > 1 ? `×${count}` : ""}`).join("+") || "unknown";
}
function formatTokenHint(token, opts) {
	const t = token.trim();
	if (!opts.showSecrets) return `sha256:${sha256HexPrefixCore(t, 8)} · len ${t.length}`;
	const head = sliceUtf16Safe(t, 0, 4);
	const tail = sliceUtf16Safe(t, -4);
	if (t.length <= 10) return `${t} · len ${t.length}`;
	return `${head}…${tail} · len ${t.length}`;
}
/** Returns the credential status sentence for enabled channel accounts, if the plugin exposes token fields. */
function summarizeTokenConfig(params) {
	const enabled = params.accounts.filter((a) => a.enabled);
	if (enabled.length === 0) return {
		state: null,
		detail: null
	};
	const accountRecs = enabled.map((a) => asRecord(a.account));
	const hasBotTokenField = accountRecs.some((r) => "botToken" in r);
	const hasAppTokenField = accountRecs.some((r) => "appToken" in r);
	const hasSigningSecretField = accountRecs.some((r) => "signingSecret" in r || "signingSecretSource" in r || "signingSecretStatus" in r);
	const hasTokenField = accountRecs.some((r) => "token" in r);
	if (!hasBotTokenField && !hasAppTokenField && !hasSigningSecretField && !hasTokenField) return {
		state: null,
		detail: null
	};
	const httpMode = hasBotTokenField && hasSigningSecretField && accountRecs.every((rec) => typeof rec.mode === "string" && rec.mode.trim() === "http");
	const unavailable = enabled.filter((a) => hasConfiguredUnavailableCredentialStatus(a.account));
	const tokenHint = (account, key) => {
		const value = asRecord(account)[key];
		return typeof value === "string" && value.trim() ? formatTokenHint(value, { showSecrets: params.showSecrets }) : "";
	};
	const paired = httpMode || hasBotTokenField && hasAppTokenField;
	const tokenKey = hasBotTokenField ? "botToken" : "token";
	const secondaryKey = httpMode ? "signingSecret" : "appToken";
	const secondaryLabel = httpMode ? "signing" : "app";
	const label = paired ? httpMode ? "credentials" : "tokens" : hasBotTokenField ? "bot token" : "token";
	const need = paired ? ` (need bot+${secondaryLabel})` : "";
	const hasCredential = (rec, key) => Boolean(normalizeOptionalString(rec[key])) || httpMode && rec[`${key}Status`] === "available";
	const ready = enabled.filter((a) => {
		const rec = asRecord(a.account);
		return hasCredential(rec, tokenKey) && (!paired || hasCredential(rec, secondaryKey));
	});
	const partial = paired ? enabled.filter((a) => {
		const rec = asRecord(a.account);
		return hasCredential(rec, tokenKey) !== hasCredential(rec, secondaryKey);
	}).length : 0;
	if (unavailable.length > 0 && (httpMode || partial === 0)) return {
		state: "warn",
		detail: `configured ${httpMode ? "http credentials" : label} unavailable in this command path · accounts ${unavailable.length}`
	};
	if (partial > 0) return {
		state: "warn",
		detail: `partial ${label}${need} · accounts ${partial}`
	};
	if (ready.length === 0) return {
		state: "setup",
		detail: `no ${label}${need}`
	};
	if (paired) {
		const botSources = summarizeSources(ready.map((a) => a.snapshot.botTokenSource ?? "none"));
		const secondarySources = summarizeSources(ready.map((a) => a.snapshot[httpMode ? "signingSecretSource" : "appTokenSource"] ?? "none"));
		const botHint = tokenHint(ready[0]?.account, "botToken");
		const secondaryHint = tokenHint(ready[0]?.account, secondaryKey);
		return {
			state: "ok",
			detail: `${label} ok (bot ${botSources}, ${secondaryLabel} ${secondarySources})${botHint || secondaryHint ? ` (bot ${botHint || "?"}, ${secondaryLabel} ${secondaryHint || "?"})` : ""} · accounts ${ready.length}/${enabled.length}`
		};
	}
	const source = hasBotTokenField ? "config" : summarizeSources(ready.map((a) => a.snapshot.tokenSource));
	const hint = tokenHint(ready[0]?.account, tokenKey);
	return {
		state: "ok",
		detail: `${label} ${source}${hint ? ` (${hint})` : ""} · accounts ${ready.length}/${enabled.length}`
	};
}
//#endregion
//#region src/commands/status-all/channels.ts
const formatAccountLabel = (params) => {
	const base = params.accountId || "default";
	if (params.name?.trim()) return `${base} (${params.name.trim()})`;
	return base;
};
const buildAccountNotes = async (params) => {
	const { plugin, cfg, entry } = params;
	const notes = [];
	const snapshot = entry.snapshot;
	if (snapshot.enabled === false) notes.push("disabled");
	if (snapshot.dmPolicy) notes.push(`dm:${snapshot.dmPolicy}`);
	for (const [label, source] of [
		["token", snapshot.tokenSource],
		["bot", snapshot.botTokenSource],
		["app", snapshot.appTokenSource],
		["signing", snapshot.signingSecretSource]
	]) if (source && source !== "none") notes.push(`${label}:${source}`);
	if (entry.kind === "unavailable") notes.push("secret unavailable in this command path");
	else if (params.liveCredentialAvailable) notes.push("credential available in gateway runtime");
	else if (hasConfiguredUnavailableCredentialStatus(entry.account)) notes.push("secret unavailable in this command path");
	if (snapshot.baseUrl) notes.push(snapshot.baseUrl);
	if (snapshot.port != null) notes.push(`port:${snapshot.port}`);
	if (snapshot.cliPath) notes.push(`cli:${snapshot.cliPath}`);
	if (snapshot.dbPath) notes.push(`db:${snapshot.dbPath}`);
	const allowFrom = entry.kind === "unavailable" || hasConfiguredUnavailableCredentialStatus(entry.account) ? snapshot.allowFrom : await resolveChannelAllowFrom({
		plugin,
		cfg,
		accountId: snapshot.accountId
	}) ?? snapshot.allowFrom;
	if (allowFrom?.length) {
		const allowInternationalDigits = plugin.configSchema?.uiHints?.allowFrom?.presentation === "phone-number";
		const formatted = formatChannelAllowFrom({
			plugin,
			cfg,
			accountId: snapshot.accountId,
			allowFrom
		}).slice(0, 3).map((allowEntry) => formatPhoneNumberForCli(allowEntry, { allowInternationalDigits }));
		if (formatted.length > 0) notes.push(`allow:${formatted.join(",")}`);
	}
	return notes;
};
function resolveLinkFields(summary) {
	const rec = asRecord(summary);
	const statusState = typeof rec.statusState === "string" ? rec.statusState : null;
	const linked = typeof rec.linked === "boolean" ? rec.linked : null;
	const authAgeMs = typeof rec.authAgeMs === "number" ? rec.authAgeMs : null;
	const self = asRecord(rec.self);
	return {
		statusState,
		linked,
		authAgeMs,
		selfE164: typeof self.e164 === "string" && self.e164.trim() ? self.e164.trim() : null
	};
}
function collectMissingPaths(accounts) {
	const missing = [];
	for (const entry of accounts) {
		const accountRec = asRecord(entry.account);
		const snapshotRec = asRecord(entry.snapshot);
		for (const key of [
			"tokenFile",
			"botTokenFile",
			"appTokenFile",
			"cliPath",
			"dbPath",
			"authDir"
		]) {
			const raw = accountRec[key] ?? snapshotRec[key];
			const path = normalizeOptionalString(raw);
			if (!path) continue;
			try {
				if (!fs.existsSync(path)) missing.push(String(raw));
			} catch {}
		}
	}
	return missing;
}
function isLikelyDependencyTreeCorruption(message) {
	return /(?:cannot find (?:module|package)|module_not_found|err_module_not_found|enoent|enotempty|missing package|failed to resolve)/iu.test(message);
}
function formatLoadFailureDetail(message) {
	return `plugin load failed: ${isLikelyDependencyTreeCorruption(message) ? "dependency tree corrupted" : "registration failed"}; run openclaw doctor --fix`;
}
/** Builds the `status --all` channel summary and per-account detail tables. */
async function buildChannelsTable(cfg, opts) {
	const showSecrets = opts?.showSecrets === true;
	const rows = [];
	const details = [];
	const sourceConfig = opts?.sourceConfig ?? cfg;
	const includeSetupFallbackPlugins = opts?.includeSetupFallbackPlugins ?? true;
	const readOnlyPlugins = resolveReadOnlyChannelPluginsForConfig(cfg, {
		activationSourceConfig: sourceConfig,
		includeSetupFallbackPlugins
	});
	for (const plugin of readOnlyPlugins.plugins) {
		const accountIds = plugin.config.listAccountIds(cfg);
		const defaultAccountId = resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds
		});
		const resolvedAccountIds = accountIds.length > 0 ? accountIds : [defaultAccountId];
		const accounts = [];
		for (const accountId of resolvedAccountIds) accounts.push({
			accountId,
			...await resolveInspectedChannelAccount({
				plugin,
				cfg,
				sourceConfig,
				accountId
			})
		});
		const liveAccounts = getRuntimeChannelAccounts({
			payload: opts?.liveChannelStatus,
			channelId: plugin.id
		});
		const anyEnabled = accounts.some((a) => a.enabled);
		const enabledAccounts = accounts.filter((a) => a.enabled);
		const configuredAccounts = enabledAccounts.filter((a) => a.configured);
		const configurationUnknown = enabledAccounts.some((a) => a.configured === void 0);
		const unavailableConfiguredAccounts = enabledAccounts.filter((a) => a.kind === "unavailable" || hasConfiguredUnavailableCredentialStatus(a.account) && !hasRuntimeCredentialAvailable({
			liveAccounts,
			accountId: a.accountId
		}));
		const accountsForTokenSummary = accounts.map((entry) => hasConfiguredUnavailableCredentialStatus(entry.account) && hasRuntimeCredentialAvailable({
			liveAccounts,
			accountId: entry.accountId
		}) ? {
			...entry,
			account: markConfiguredUnavailableCredentialStatusesAvailable(entry.account)
		} : entry);
		const defaultEntry = accounts.find((a) => a.accountId === defaultAccountId) ?? accounts[0];
		const link = resolveLinkFields(defaultEntry?.kind === "resolved" && plugin.status?.buildChannelSummary ? await plugin.status.buildChannelSummary({
			account: defaultEntry.account,
			cfg,
			defaultAccountId,
			snapshot: defaultEntry.snapshot
		}) : defaultEntry?.snapshot);
		const missingPaths = collectMissingPaths(enabledAccounts);
		const tokenSummary = summarizeTokenConfig({
			accounts: accountsForTokenSummary,
			showSecrets
		});
		const issues = plugin.status?.collectStatusIssues ? plugin.status.collectStatusIssues(accounts.map((a) => a.snapshot)) : [];
		const label = plugin.meta.label ?? plugin.id;
		const status = (() => {
			if (!anyEnabled) return {
				state: "off",
				detail: !defaultEntry ? "disabled" : defaultEntry.kind === "resolved" ? plugin.config.disabledReason?.(defaultEntry.account, cfg) ?? "disabled" : defaultEntry.snapshot.stateReason ?? "disabled"
			};
			if (missingPaths.length > 0) return {
				state: "warn",
				detail: `missing file (${missingPaths[0]})`
			};
			if (issues.length > 0) return {
				state: "warn",
				detail: issues[0]?.message ?? "misconfigured"
			};
			if (configurationUnknown) return {
				state: "warn",
				detail: "configuration status unavailable"
			};
			return {
				state: unavailableConfiguredAccounts.length > 0 || link.statusState === "unstable" ? "warn" : link.linked === false ? "setup" : tokenSummary.state ?? (link.linked === true || configuredAccounts.length > 0 ? "ok" : "setup"),
				detail: (() => {
					if (link.statusState || link.linked !== null) {
						if (link.statusState && link.statusState !== "linked") return formatChannelStatusState(link.statusState);
						const linked = link.statusState === "linked" || link.linked === true;
						const base = link.statusState ? formatChannelStatusState(link.statusState) : linked ? "linked" : "not linked";
						const extra = [];
						if (linked && link.selfE164) extra.push(formatPhoneNumberForCli(link.selfE164));
						if (linked && link.authAgeMs != null && link.authAgeMs >= 0) extra.push(`auth ${formatTimeAgo(link.authAgeMs)}`);
						if (accounts.length > 1 || plugin.meta.forceAccountBinding) extra.push(`accounts ${accounts.length || 1}`);
						return extra.length > 0 ? `${base} · ${extra.join(" · ")}` : base;
					}
					if (unavailableConfiguredAccounts.length > 0) {
						if (tokenSummary.detail?.includes("unavailable")) return tokenSummary.detail;
						return `configured credentials unavailable in this command path · accounts ${unavailableConfiguredAccounts.length}`;
					}
					if (tokenSummary.detail) return tokenSummary.detail;
					if (configuredAccounts.length > 0) {
						const head = "configured";
						if (accounts.length <= 1 && !plugin.meta.forceAccountBinding) return head;
						return `${head} · accounts ${configuredAccounts.length}/${enabledAccounts.length || 1}`;
					}
					return (defaultEntry?.kind === "resolved" && plugin.config.unconfiguredReason ? plugin.config.unconfiguredReason(defaultEntry.account, cfg) : defaultEntry?.snapshot.stateReason) ?? "not configured";
				})()
			};
		})();
		rows.push({
			id: plugin.id,
			label,
			enabled: anyEnabled,
			...status
		});
		if (configuredAccounts.length > 0) details.push({
			title: `${label} accounts`,
			columns: [
				"Account",
				"Status",
				"Notes"
			],
			rows: await Promise.all(configuredAccounts.map(async (entry) => {
				const liveCredentialAvailable = hasRuntimeCredentialAvailable({
					liveAccounts,
					accountId: entry.accountId
				});
				const notes = await buildAccountNotes({
					plugin,
					cfg,
					entry,
					liveCredentialAvailable
				});
				return {
					Account: formatAccountLabel({
						accountId: entry.accountId,
						name: entry.snapshot.name
					}),
					Status: entry.enabled && entry.kind !== "unavailable" && (!hasConfiguredUnavailableCredentialStatus(entry.account) || liveCredentialAvailable) ? "OK" : "WARN",
					Notes: notes.join(" · ")
				};
			}))
		});
	}
	const visibleChannelIds = new Set(rows.map((row) => row.id));
	const addFallbackRow = (id, state, detail, label = id) => {
		rows.push({
			id,
			label,
			enabled: true,
			state,
			detail
		});
		visibleChannelIds.add(id);
	};
	const loadFailuresByChannel = new Map(readOnlyPlugins.loadFailures.map((failure) => [failure.channelId, failure]));
	const missingConfiguredChannelIds = readOnlyPlugins.missingConfiguredChannelIds.toSorted((left, right) => left.localeCompare(right));
	for (const channelId of missingConfiguredChannelIds) {
		if (visibleChannelIds.has(channelId)) continue;
		const failure = loadFailuresByChannel.get(channelId);
		if (!failure) continue;
		addFallbackRow(channelId, "warn", formatLoadFailureDetail(failure.message));
	}
	const explicitConfiguredChannelIds = /* @__PURE__ */ new Set([...listExplicitConfiguredChannelIdsForConfig(sourceConfig), ...listExplicitConfiguredChannelIdsForConfig(cfg)]);
	const missingCandidateChannelIds = [.../* @__PURE__ */ new Set([...readOnlyPlugins.missingConfiguredChannelIds, ...explicitConfiguredChannelIds])].toSorted((left, right) => left.localeCompare(right));
	const missingHintsByChannelId = new Map(resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		activationSourceConfig: sourceConfig,
		channelIds: missingCandidateChannelIds,
		manifestRecords: readOnlyPlugins.manifestRecords
	}).map((hint) => [hint.channelId, hint]));
	const addFastModeRow = (channelId) => {
		addFallbackRow(channelId, "setup", "configured; status unavailable in fast mode", sanitizeForLog(channelId).trim() || "configured-channel");
	};
	for (const channelId of missingCandidateChannelIds) {
		if (visibleChannelIds.has(channelId)) continue;
		const hint = missingHintsByChannelId.get(channelId);
		if (!hint) {
			if (!includeSetupFallbackPlugins && explicitConfiguredChannelIds.has(channelId)) addFastModeRow(channelId);
			continue;
		}
		addFallbackRow(channelId, "warn", `plugin not installed - run ${hint.installCommand} or ${hint.doctorFixCommand}`, hint.label);
	}
	if (!includeSetupFallbackPlugins) for (const channelId of missingConfiguredChannelIds) {
		if (visibleChannelIds.has(channelId)) continue;
		addFastModeRow(channelId);
	}
	return {
		rows,
		details
	};
}
//#endregion
//#region src/commands/status.scan.runtime.ts
const statusScanRuntime = {
	collectChannelStatusIssues,
	buildChannelsTable
};
//#endregion
export { statusScanRuntime };
