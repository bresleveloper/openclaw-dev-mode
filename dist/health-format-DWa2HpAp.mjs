import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { a as isGatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as formatDurationHuman } from "./format-duration-BIQQYTeV.mjs";
import { t as formatChannelStatusState } from "./status-state-CzH5Ru9-.mjs";
//#region src/commands/health-format.ts
function formatGatewayClosedDiagnostic(err) {
	if (!isGatewayTransportError(err) || err.kind !== "closed" || err.code === void 0) return;
	return `Gateway connect failed: ${sanitizeTerminalText(err.message.split("\n", 1)[0] ?? "")}`;
}
const formatKv = (line, rich) => {
	const idx = line.indexOf(": ");
	if (idx <= 0) return colorize(rich, theme.muted, line);
	const key = line.slice(0, idx);
	const value = line.slice(idx + 2);
	const valueColor = key === "Gateway target" || key === "Config" ? theme.command : key === "Source" ? theme.muted : theme.info;
	return `${colorize(rich, theme.muted, `${key}:`)} ${colorize(rich, valueColor, value)}`;
};
function formatHealthCheckFailure(err, opts = {}) {
	const rich = opts.rich ?? isRich();
	const raw = String(err);
	const message = err instanceof Error ? err.message : raw;
	if (!rich) return `Health check failed: ${raw}`;
	const lines = message.split("\n").map((l) => l.trimEnd()).filter(Boolean);
	const detailsIdx = lines.findIndex((l) => l.startsWith("Gateway target: "));
	const summaryLines = (detailsIdx >= 0 ? lines.slice(0, detailsIdx) : lines).map((l) => l.trim()).filter(Boolean);
	const detailLines = detailsIdx >= 0 ? lines.slice(detailsIdx) : [];
	const summary = summaryLines.length > 0 ? summaryLines.join(" ") : message;
	const out = [`${colorize(rich, theme.error.bold, "Health check failed")}: ${summary}`];
	for (const line of detailLines) out.push(`  ${formatKv(line, rich)}`);
	return out.join("\n");
}
const formatProbeLine = (probe, accounts) => {
	const record = asNullableRecord(probe);
	if (!record) return null;
	const ok = typeof record.ok === "boolean" ? record.ok : void 0;
	if (ok === void 0) return null;
	if (!ok) {
		const status = typeof record.status === "number" ? record.status : null;
		const error = typeof record.error === "string" ? record.error : null;
		return `failed (${status ?? "unknown"})${error ? ` - ${error}` : ""}`;
	}
	const elapsedMs = typeof record.elapsedMs === "number" ? record.elapsedMs : null;
	const bot = asNullableRecord(record.bot);
	const botUsername = bot && typeof bot.username === "string" ? bot.username : null;
	const webhook = asNullableRecord(record.webhook);
	const webhookUrl = webhook && typeof webhook.url === "string" ? webhook.url : null;
	const usernames = /* @__PURE__ */ new Set();
	if (botUsername) usernames.add(botUsername);
	for (const account of accounts ?? []) {
		const accountProbe = asNullableRecord(account.probe);
		const accountBot = accountProbe ? asNullableRecord(accountProbe.bot) : null;
		if (accountBot && typeof accountBot.username === "string" && accountBot.username) usernames.add(accountBot.username);
	}
	let label = "ok";
	if (usernames.size > 0) label += ` (@${Array.from(usernames).join(", @")})`;
	if (elapsedMs != null) label += ` (${elapsedMs}ms)`;
	if (webhookUrl) label += ` - webhook ${webhookUrl}`;
	return label;
};
const formatAccountProbeTiming = (summary) => {
	const probe = asNullableRecord(summary.probe);
	if (!probe) return null;
	const elapsedMs = typeof probe.elapsedMs === "number" ? Math.round(probe.elapsedMs) : null;
	const ok = typeof probe.ok === "boolean" ? probe.ok : null;
	if (elapsedMs == null && ok !== true) return null;
	const accountId = summary.accountId || "default";
	const botRecord = asNullableRecord(probe.bot);
	const botUsername = botRecord && typeof botRecord.username === "string" ? botRecord.username : null;
	return `${botUsername ? `@${botUsername}` : accountId}:${accountId}:${elapsedMs != null ? `${elapsedMs}ms` : "ok"}`;
};
function formatPluginDiagnostic(text, maxChars) {
	const normalized = sanitizeTerminalText(redactToolPayloadText(text)).replace(/[\p{Cf}\p{Cs}\p{Zl}\p{Zp}]/gu, "");
	return truncateUtf16Safe(redactToolPayloadText(normalized), maxChars);
}
const formatHealthChannelLines = (summary, opts = {}) => {
	const channels = summary.channels ?? {};
	const channelOrder = summary.channelOrder?.length > 0 ? summary.channelOrder : Object.keys(channels);
	const accountMode = opts.accountMode ?? "default";
	const lines = [];
	for (const channelId of channelOrder) {
		const channelSummary = channels[channelId];
		if (!channelSummary) continue;
		const label = summary.channelLabels?.[channelId] ?? channelId;
		const accountSummaries = channelSummary.accounts ?? {};
		const accountIds = accountMode === "all" ? void 0 : opts.accountIdsByChannel?.[channelId];
		const listSummaries = accountIds?.length ? accountIds.flatMap((accountId) => accountSummaries[accountId] ?? []) : Object.values(accountSummaries);
		const preferredSummary = accountIds?.length ? listSummaries[0] ?? channelSummary : channelSummary;
		const activeSummaries = listSummaries.filter((account) => account.enabled !== false && account.configured !== false && account.linked !== false && account.statusState !== "disabled" && account.statusState !== "unconfigured");
		const selectedSummary = activeSummaries.find((account) => account.healthState && account.healthState !== "healthy" || account.statusState && account.statusState !== "linked" && account.statusState !== "configured") ?? activeSummaries.find((account) => account.accountId === preferredSummary.accountId) ?? activeSummaries[0] ?? preferredSummary;
		const statusState = typeof selectedSummary.statusState === "string" ? selectedSummary.statusState : null;
		const healthState = typeof selectedSummary.healthState === "string" && selectedSummary.healthState ? selectedSummary.healthState : null;
		const { linked, configured } = selectedSummary;
		const inactiveState = selectedSummary.enabled === false ? "disabled" : statusState === "disabled" || statusState === "unconfigured" ? formatChannelStatusState(statusState) : configured === false ? "not configured" : null;
		const preProbeState = inactiveState ? inactiveState : healthState && healthState !== "healthy" ? healthState : statusState && statusState !== "linked" && statusState !== "configured" ? formatChannelStatusState(statusState) : linked === false ? "not linked" : null;
		if (preProbeState) {
			const error = typeof selectedSummary.lastError === "string" ? sanitizeTerminalText(selectedSummary.lastError) : "";
			lines.push(`${label}: ${preProbeState}${error ? ` (${error})` : ""}`);
			continue;
		}
		const failedSummary = activeSummaries.find((account) => asNullableRecord(account.probe)?.ok === false);
		if (failedSummary) {
			const failureLine = formatProbeLine(failedSummary.probe);
			if (failureLine) {
				lines.push(`${label}: ${failureLine}`);
				continue;
			}
		}
		const accountTimings = accountMode === "all" ? activeSummaries.map((account) => formatAccountProbeTiming(account)).filter((value) => Boolean(value)) : [];
		if (accountTimings.length > 0) {
			lines.push(`${label}: ok (${accountTimings.join(", ")})`);
			continue;
		}
		const probeLine = formatProbeLine(selectedSummary.probe, activeSummaries);
		if (probeLine) {
			lines.push(`${label}: ${probeLine}`);
			continue;
		}
		const authAgeMs = typeof selectedSummary.authAgeMs === "number" ? selectedSummary.authAgeMs : null;
		const authLabel = authAgeMs != null ? ` (auth age ${Math.round(authAgeMs / 6e4)}m)` : "";
		const passiveState = healthState ? healthState : statusState ? `${formatChannelStatusState(statusState)}${statusState === "linked" ? authLabel : ""}` : linked === true ? `linked${authLabel}` : configured === true ? "configured" : "unknown";
		lines.push(`${label}: ${passiveState}`);
	}
	const pluginWarnings = [...(summary.plugins?.errors ?? []).filter((plugin) => plugin.activated || plugin.activationSource === "explicit" || plugin.activationSource === "auto" || plugin.activationSource === "default").map(({ id, error }) => ({
		id,
		state: "failed",
		detail: error
	})), ...(summary.plugins?.unavailable ?? []).map(({ id, diagnostic }) => ({
		id,
		state: "unavailable",
		detail: diagnostic.detail ? `${diagnostic.reason}: ${diagnostic.detail}` : diagnostic.reason
	}))];
	for (const plugin of pluginWarnings.slice(0, 20)) {
		const id = formatPluginDiagnostic(plugin.id, 120);
		const diagnostic = formatPluginDiagnostic(plugin.detail, 500);
		const label = id.includes(":") ? "Plugin" : `Plugin ${id}`;
		const detail = id.includes(":") ? `${id}: ${diagnostic}` : diagnostic;
		lines.push(`${label}: ${plugin.state} - ${detail}; run openclaw doctor`);
	}
	if (pluginWarnings.length > 20) lines.push(`Plugins: warning - ${pluginWarnings.length - 20} additional plugin warnings; run openclaw doctor`);
	return lines;
};
function formatDeliveryQueueHealthLine(summary, now = Date.now()) {
	const failed = summary.deliveryQueues?.failed ?? [];
	const ingressFailed = summary.deliveryQueues?.ingressFailed ?? [];
	const ingressPressure = summary.deliveryQueues?.ingressPressure ?? [];
	const warnings = [];
	const deadLetterCounts = [...failed.map((queue) => `${queue.queueName}: ${queue.count}`), ...ingressFailed.map((queue) => `inbound ${queue.channelId}/${queue.accountId}: ${queue.count}`)].join(", ");
	const oldest = [...failed, ...ingressFailed].map((queue) => queue.oldestFailedAt).filter((value) => typeof value === "number");
	const oldestNote = oldest.length > 0 ? `; oldest ${formatDurationHuman(now - Math.min(...oldest))} ago` : "";
	if (deadLetterCounts) warnings.push(`dead-lettered entries — ${deadLetterCounts}${oldestNote}`);
	if (ingressPressure.length > 0) {
		const pressureCounts = ingressPressure.map((queue) => `inbound ${queue.channelId}/${queue.accountId}: ${queue.laneCount} pressured ${queue.laneCount === 1 ? "lane" : "lanes"}, ${queue.pendingCount} pending, ${queue.claimedCount} claimed, ${queue.blockedCount} blocked`).join(", ");
		const oldestPressure = Math.min(...ingressPressure.map((queue) => queue.oldestReceivedAt));
		warnings.push(`ingress pressure — ${pressureCounts}; oldest ${formatDurationHuman(now - oldestPressure)} ago`);
	}
	return warnings.length > 0 ? `Delivery queue: warning (${warnings.join("; ")})` : null;
}
//#endregion
export { formatHealthCheckFailure as i, formatGatewayClosedDiagnostic as n, formatHealthChannelLines as r, formatDeliveryQueueHealthLine as t };
