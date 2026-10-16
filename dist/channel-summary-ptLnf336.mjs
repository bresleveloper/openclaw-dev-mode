import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import "./session-key-C09ow4h0.mjs";
import "./account-id-DbRsdayc.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
import { r as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-e1ulxwox.mjs";
import { i as formatChannelAllowFrom } from "./account-summary-BxKjshxY.mjs";
import { n as resolveInspectedChannelAccount } from "./account-inspection-u4OYe2Rv.mjs";
import { t as formatChannelStatusState } from "./status-state-CzH5Ru9-.mjs";
//#region src/infra/channel-summary.ts
const formatAccountLabel = (params) => {
	const base = params.accountId || "default";
	if (params.name?.trim()) return `${base} (${params.name.trim()})`;
	return base;
};
const accountLine = (label, details) => `  - ${label}${details.length ? ` (${details.join(", ")})` : ""}`;
const buildAccountDetails = (params) => {
	const details = [];
	const snapshot = params.entry.snapshot;
	if (snapshot.enabled === false) details.push("disabled");
	if (snapshot.dmPolicy) details.push(`dm:${snapshot.dmPolicy}`);
	for (const [key, label] of [
		["tokenSource", "token"],
		["botTokenSource", "bot"],
		["appTokenSource", "app"],
		["signingSecretSource", "signing"]
	]) {
		const source = snapshot[key];
		if (source && source !== "none") details.push(`${label}:${source}`);
	}
	if (params.entry.kind === "unavailable" || hasConfiguredUnavailableCredentialStatus(params.entry.account)) details.push("secret unavailable in this command path");
	if (snapshot.baseUrl) details.push(snapshot.baseUrl);
	if (snapshot.port != null) details.push(`port:${snapshot.port}`);
	if (snapshot.cliPath) details.push(`cli:${snapshot.cliPath}`);
	if (snapshot.dbPath) details.push(`db:${snapshot.dbPath}`);
	if (params.includeAllowFrom && snapshot.allowFrom?.length) {
		const formatted = formatChannelAllowFrom({
			plugin: params.plugin,
			cfg: params.cfg,
			accountId: snapshot.accountId,
			allowFrom: snapshot.allowFrom
		}).slice(0, 2);
		if (formatted.length > 0) details.push(`allow:${formatted.join(",")}`);
	}
	return details;
};
async function buildChannelSummary(cfg, options) {
	const effective = cfg ?? (await import("./config/config.js")).getRuntimeConfig();
	const lines = [];
	const { colorize = false, includeAllowFrom = false } = options ?? {};
	const tint = (value, color) => colorize && color ? color(value) : value;
	const sourceConfig = options?.sourceConfig ?? effective;
	const plugins = options?.plugins ?? (await import("./read-only-DAjh9bs0.mjs")).listReadOnlyChannelPluginsForConfig(effective, {
		activationSourceConfig: sourceConfig,
		includeSetupFallbackPlugins: false
	});
	for (const plugin of plugins) {
		const accountIds = plugin.config.listAccountIds(effective);
		const defaultAccountId = plugin.config.defaultAccountId?.(effective) ?? accountIds[0] ?? "default";
		const resolvedAccountIds = accountIds.length > 0 ? accountIds : [defaultAccountId];
		const entries = [];
		for (const accountId of resolvedAccountIds) {
			const inspected = await resolveInspectedChannelAccount({
				plugin,
				cfg: effective,
				sourceConfig,
				accountId
			});
			entries.push({
				accountId,
				...inspected
			});
		}
		const configuredEntries = entries.filter((entry) => entry.configured);
		const anyEnabled = entries.some((entry) => entry.enabled);
		const configurationUnknown = entries.some((entry) => entry.enabled && entry.configured === void 0);
		const fallbackEntry = entries.find((entry) => entry.accountId === defaultAccountId) ?? entries[0];
		const summary = fallbackEntry?.kind === "resolved" && plugin.status?.buildChannelSummary ? await plugin.status.buildChannelSummary({
			account: fallbackEntry.account,
			cfg: effective,
			defaultAccountId,
			snapshot: fallbackEntry.snapshot
		}) : fallbackEntry?.snapshot;
		const summaryRecord = asNullableRecord(summary);
		const statusState = summaryRecord && typeof summaryRecord.statusState === "string" ? summaryRecord.statusState : null;
		const linked = summaryRecord && typeof summaryRecord.linked === "boolean" ? summaryRecord.linked : null;
		const configured = summaryRecord && typeof summaryRecord.configured === "boolean" ? summaryRecord.configured : configuredEntries.length > 0;
		const status = !anyEnabled ? "disabled" : configurationUnknown ? "configuration status unavailable" : statusState ? formatChannelStatusState(statusState) : linked !== null ? linked ? "linked" : "not linked" : configured ? "configured" : "not configured";
		const statusColor = status === "linked" || status === "configured" ? theme.success : status === "not linked" || status === "auth stabilizing" ? theme.error : theme.muted;
		let line = `${sanitizeForLog(plugin.meta.label ?? plugin.id).trim() || plugin.id}: ${status}`;
		const authAgeMs = summaryRecord && typeof summaryRecord.authAgeMs === "number" ? summaryRecord.authAgeMs : null;
		const self = summaryRecord?.self;
		if (self?.e164) line += ` ${self.e164}`;
		if (authAgeMs != null && authAgeMs >= 0) line += ` auth ${formatTimeAgo(authAgeMs)}`;
		lines.push(tint(line, statusColor));
		for (const entry of configuredEntries) {
			const details = buildAccountDetails({
				entry,
				plugin,
				cfg: effective,
				includeAllowFrom
			});
			lines.push(accountLine(formatAccountLabel({
				accountId: entry.accountId,
				name: entry.snapshot.name
			}), details));
		}
	}
	return lines;
}
//#endregion
export { buildChannelSummary as t };
