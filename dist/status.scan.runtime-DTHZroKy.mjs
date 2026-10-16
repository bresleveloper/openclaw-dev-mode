import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import { s as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-BruI3Lbo.mjs";
import "./channel-plugin-ids-BIGwmSOe.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-M7Ed27uG.mjs";
import { n as resolveReadOnlyChannelPluginsForConfig } from "./read-only-bu8BjV4Y.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { r as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-e1ulxwox.mjs";
import { i as formatChannelAllowFrom } from "./account-summary-BxKjshxY.mjs";
import { n as resolveInspectedChannelAccount } from "./account-inspection-u4OYe2Rv.mjs";
import { t as formatChannelStatusState } from "./status-state-CzH5Ru9-.mjs";
import { n as hasRuntimeCredentialAvailable, r as markConfiguredUnavailableCredentialStatusesAvailable, t as getRuntimeChannelAccounts } from "./read-model-BZsen0Xj.mjs";
import { t as collectChannelStatusIssues } from "./channels-status-issues-C5VCY0fx.mjs";
import { t as formatPhoneNumberForCli } from "./phone-number-presentation-CkgOlVtz.mjs";
import "./format-DaR_VHQw.mjs";
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
	if (httpMode || hasBotTokenField && hasAppTokenField) {
		const secondaryKey = httpMode ? "signingSecret" : "appToken";
		const secondaryLabel = httpMode ? "signing" : "app";
		const credentialLabel = httpMode ? "credentials" : "tokens";
		const need = `bot+${secondaryLabel}`;
		const hasCredential = (rec, key) => Boolean(normalizeOptionalString(rec[key])) || httpMode && rec[`${key}Status`] === "available";
		const ready = enabled.filter((a) => {
			const rec = asRecord(a.account);
			return hasCredential(rec, "botToken") && hasCredential(rec, secondaryKey);
		});
		const partial = enabled.filter((a) => {
			const rec = asRecord(a.account);
			return hasCredential(rec, "botToken") !== hasCredential(rec, secondaryKey);
		});
		if (unavailable.length > 0 && (httpMode || partial.length === 0)) return {
			state: "warn",
			detail: `configured ${httpMode ? "http credentials" : "tokens"} unavailable in this command path · accounts ${unavailable.length}`
		};
		if (partial.length > 0) return {
			state: "warn",
			detail: `partial ${credentialLabel} (need ${need}) · accounts ${partial.length}`
		};
		if (ready.length === 0) return {
			state: "setup",
			detail: `no ${credentialLabel} (need ${need})`
		};
		const botSources = summarizeSources(ready.map((a) => a.snapshot.botTokenSource ?? "none"));
		const secondarySources = summarizeSources(ready.map((a) => a.snapshot[httpMode ? "signingSecretSource" : "appTokenSource"] ?? "none"));
		const botHint = tokenHint(ready[0]?.account, "botToken");
		const secondaryHint = tokenHint(ready[0]?.account, secondaryKey);
		return {
			state: "ok",
			detail: `${credentialLabel} ok (bot ${botSources}, ${secondaryLabel} ${secondarySources})${botHint || secondaryHint ? ` (bot ${botHint || "?"}, ${secondaryLabel} ${secondaryHint || "?"})` : ""} · accounts ${ready.length}/${enabled.length}`
		};
	}
	const tokenKey = hasBotTokenField ? "botToken" : "token";
	const label = hasBotTokenField ? "bot token" : "token";
	const ready = enabled.filter((a) => Boolean(normalizeOptionalString(asRecord(a.account)[tokenKey])));
	if (unavailable.length > 0) return {
		state: "warn",
		detail: `configured ${label} unavailable in this command path · accounts ${unavailable.length}`
	};
	if (ready.length === 0) return {
		state: "setup",
		detail: `no ${label}`
	};
	const source = hasBotTokenField ? "config" : summarizeSources(ready.map((a) => a.snapshot.tokenSource));
	const hint = tokenHint(ready[0]?.account, tokenKey);
	return {
		state: "ok",
		detail: `${label} ${source}${hint ? ` (${hint})` : ""} · accounts ${ready.length}/${enabled.length}`
	};
}
//#endregion
//#region src/commands/status-all/channels.ts
function existsSyncMaybe(p) {
	const path = normalizeOptionalString(p) ?? "";
	if (!path) return null;
	try {
		return fs.existsSync(path);
	} catch {
		return null;
	}
}
const formatAccountLabel = (params) => {
	const base = params.accountId || "default";
	if (params.name?.trim()) return `${base} (${params.name.trim()})`;
	return base;
};
const buildAccountNotes = (params) => {
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
	const allowFrom = entry.kind === "unavailable" || hasConfiguredUnavailableCredentialStatus(entry.account) ? snapshot.allowFrom : plugin.config.resolveAllowFrom?.({
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
			if (existsSyncMaybe(raw) === false) missing.push(String(raw));
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
		const state = (() => {
			if (!anyEnabled) return "off";
			if (missingPaths.length > 0 || issues.length > 0 || unavailableConfiguredAccounts.length > 0 || configurationUnknown || link.statusState === "unstable") return "warn";
			if (link.linked === false) return "setup";
			if (tokenSummary.state) return tokenSummary.state;
			return link.linked === true || configuredAccounts.length > 0 ? "ok" : "setup";
		})();
		const detail = (() => {
			if (!anyEnabled) {
				if (!defaultEntry) return "disabled";
				return defaultEntry.kind === "resolved" ? plugin.config.disabledReason?.(defaultEntry.account, cfg) ?? "disabled" : defaultEntry.snapshot.stateReason ?? "disabled";
			}
			if (missingPaths.length > 0) return `missing file (${missingPaths[0]})`;
			if (issues.length > 0) return issues[0]?.message ?? "misconfigured";
			if (configurationUnknown) return "configuration status unavailable";
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
		})();
		rows.push({
			id: plugin.id,
			label,
			enabled: anyEnabled,
			state,
			detail
		});
		if (configuredAccounts.length > 0) details.push({
			title: `${label} accounts`,
			columns: [
				"Account",
				"Status",
				"Notes"
			],
			rows: configuredAccounts.map((entry) => {
				const liveCredentialAvailable = hasRuntimeCredentialAvailable({
					liveAccounts,
					accountId: entry.accountId
				});
				const notes = buildAccountNotes({
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
			})
		});
	}
	const visibleChannelIds = new Set(rows.map((row) => row.id));
	const loadFailuresByChannel = new Map(readOnlyPlugins.loadFailures.map((failure) => [failure.channelId, failure]));
	const missingConfiguredChannelIds = readOnlyPlugins.missingConfiguredChannelIds.toSorted((left, right) => left.localeCompare(right));
	for (const channelId of missingConfiguredChannelIds) {
		if (visibleChannelIds.has(channelId)) continue;
		const failure = loadFailuresByChannel.get(channelId);
		if (!failure) continue;
		rows.push({
			id: channelId,
			label: channelId,
			enabled: true,
			state: "warn",
			detail: formatLoadFailureDetail(failure.message)
		});
		visibleChannelIds.add(channelId);
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
		rows.push({
			id: channelId,
			label: sanitizeForLog(channelId).trim() || "configured-channel",
			enabled: true,
			state: "setup",
			detail: "configured; status unavailable in fast mode"
		});
		visibleChannelIds.add(channelId);
	};
	for (const channelId of missingCandidateChannelIds) {
		if (visibleChannelIds.has(channelId)) continue;
		const hint = missingHintsByChannelId.get(channelId);
		if (!hint || hint.channelId !== channelId) {
			if (!includeSetupFallbackPlugins && explicitConfiguredChannelIds.has(channelId)) addFastModeRow(channelId);
			continue;
		}
		rows.push({
			id: channelId,
			label: hint.label,
			enabled: true,
			state: "warn",
			detail: `plugin not installed - run ${hint.installCommand} or ${hint.doctorFixCommand}`
		});
		visibleChannelIds.add(channelId);
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
