import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import "./session-key-CSDERtm3.mjs";
import "./account-id-ifCOO7_9.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as formatTimeAgo } from "./format-relative-DP9tOdyD.mjs";
import { r as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-BIlgyhxH.mjs";
import { i as formatChannelAllowFrom } from "./account-summary-DHgRbD3b.mjs";
import { n as resolveInspectedChannelAccount } from "./account-inspection-DpPvjRRw.mjs";
import { t as formatChannelStatusState } from "./status-state-CUdQlr68.mjs";
//#region src/infra/channel-summary.ts
async function buildChannelSummary(cfg, options) {
	const effective = cfg ?? (await import("./config/config.js")).getRuntimeConfig();
	const lines = [];
	const { colorize = false, includeAllowFrom = false } = options ?? {};
	const sourceConfig = options?.sourceConfig ?? effective;
	const plugins = options?.plugins ?? await (await import("./read-only-DKjbEaN1.mjs")).listReadOnlyChannelPluginsForConfigAsync(effective, {
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
		lines.push(colorize ? statusColor(line) : line);
		for (const entry of configuredEntries) {
			const details = [];
			const snapshot = entry.snapshot;
			if (snapshot.enabled === false) details.push("disabled");
			if (snapshot.dmPolicy) details.push(`dm:${snapshot.dmPolicy}`);
			for (const [key, sourceLabel] of [
				["tokenSource", "token"],
				["botTokenSource", "bot"],
				["appTokenSource", "app"],
				["signingSecretSource", "signing"]
			]) {
				const source = snapshot[key];
				if (source && source !== "none") details.push(`${sourceLabel}:${source}`);
			}
			if (entry.kind === "unavailable" || hasConfiguredUnavailableCredentialStatus(entry.account)) details.push("secret unavailable in this command path");
			if (snapshot.baseUrl) details.push(snapshot.baseUrl);
			if (snapshot.port != null) details.push(`port:${snapshot.port}`);
			if (snapshot.cliPath) details.push(`cli:${snapshot.cliPath}`);
			if (snapshot.dbPath) details.push(`db:${snapshot.dbPath}`);
			if (includeAllowFrom && snapshot.allowFrom?.length) {
				const formatted = formatChannelAllowFrom({
					plugin,
					cfg: effective,
					accountId: snapshot.accountId,
					allowFrom: snapshot.allowFrom
				}).slice(0, 2);
				if (formatted.length > 0) details.push(`allow:${formatted.join(",")}`);
			}
			const accountId = entry.accountId || "default";
			const name = entry.snapshot.name?.trim();
			const label = name ? `${accountId} (${name})` : accountId;
			lines.push(`  - ${label}${details.length ? ` (${details.join(", ")})` : ""}`);
		}
	}
	return lines;
}
//#endregion
export { buildChannelSummary as t };
