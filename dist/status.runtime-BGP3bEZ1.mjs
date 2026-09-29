import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { a as listConfiguredAnnounceChannelIdsForConfig, s as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-C83ks5im.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import "./channel-plugin-ids-DiMsgxMa.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-QFuGb490.mjs";
import { i as normalizeChannelId } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as formatDurationCompact } from "./format-duration-CeDWULoS.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-CvMQqs0s.mjs";
import { n as formatTimeAgo } from "./format-relative-BOUle7M5.mjs";
import { n as hasConfiguredUnavailableCredentialStatus, r as hasResolvedCredentialValue } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { c as getConfiguredChannelsCommandSecretTargetIds } from "./command-secret-targets-DAUWRpL2.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-DOX1XwQ9.mjs";
import { t as requireValidConfig } from "./config-validation-CdWq9kXm.mjs";
import { a as appendTokenSourceBits, i as appendModeBit, n as appendBaseUrlBit, o as buildChannelAccountLine, r as appendEnabledConfiguredLinkedBits, t as NO_CONFIGURED_CHAT_CHANNELS_LINE } from "./shared-1R7GTSZV.mjs";
import { n as buildReadOnlySourceChannelAccountSnapshot, r as resolveChannelAccountSnapshot } from "./status-qraVaO13.mjs";
import { t as collectChannelStatusIssues } from "./channels-status-issues-YkUebnBD.mjs";
import { t as formatPhoneNumberForCli } from "./phone-number-presentation-CkgOlVtz.mjs";
//#region src/commands/channels/status-config-format.ts
/** Render channel status lines from config snapshots without calling the gateway. */
async function formatConfigChannelsStatusLines(cfg, meta, opts) {
	const lines = [];
	lines.push(theme.warn(opts?.fallbackReason ?? "Gateway not reachable; showing config-only status."));
	if (meta.path) lines.push(`Config: ${meta.path}`);
	if (meta.mode) lines.push(`Mode: ${meta.mode}`);
	if (meta.path || meta.mode) lines.push("");
	const accountLines = (plugin, accounts) => accounts.map((account) => {
		const bits = [];
		appendEnabledConfiguredLinkedBits(bits, account);
		appendModeBit(bits, account);
		appendTokenSourceBits(bits, account);
		appendBaseUrlBit(bits, account);
		return buildChannelAccountLine(plugin.id, account, bits, { channelLabel: plugin.meta.label ?? plugin.id });
	});
	const sourceConfig = opts?.sourceConfig ?? cfg;
	const requestedChannel = opts?.channel ? normalizeChannelId(opts.channel) ?? normalizeOptionalLowercaseString(opts.channel) : null;
	const plugins = listReadOnlyChannelPluginsForConfig(cfg, {
		activationSourceConfig: sourceConfig,
		includeSetupFallbackPlugins: true
	}).filter((plugin) => !requestedChannel || plugin.id === requestedChannel);
	const visibleChannelIds = /* @__PURE__ */ new Set();
	const statusLinesStart = lines.length;
	for (const plugin of plugins) {
		visibleChannelIds.add(plugin.id);
		const accountIds = plugin.config.listAccountIds(cfg);
		if (!accountIds.length) continue;
		const snapshots = [];
		for (const accountId of accountIds) {
			const sourceSnapshot = await buildReadOnlySourceChannelAccountSnapshot({
				plugin,
				cfg: sourceConfig,
				accountId
			});
			const resolvedSnapshot = await resolveChannelAccountSnapshot({
				plugin,
				cfg,
				accountId
			});
			snapshots.push(sourceSnapshot && hasConfiguredUnavailableCredentialStatus(sourceSnapshot) && (!hasResolvedCredentialValue(resolvedSnapshot) || sourceSnapshot.configured === true && resolvedSnapshot.configured === false) ? sourceSnapshot : resolvedSnapshot);
		}
		if (snapshots.length > 0) lines.push(...accountLines(plugin, snapshots));
	}
	const missingChannelIds = [.../* @__PURE__ */ new Set([...listExplicitConfiguredChannelIdsForConfig(sourceConfig), ...listExplicitConfiguredChannelIdsForConfig(cfg)])].filter((channelId) => (!requestedChannel || channelId === requestedChannel) && !visibleChannelIds.has(channelId));
	const missingHints = resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		activationSourceConfig: sourceConfig,
		channelIds: missingChannelIds
	});
	if (missingHints.length > 0) {
		lines.push("");
		lines.push(theme.warn("Missing official external plugins:"));
		for (const hint of missingHints) lines.push(`- ${hint.label}: ${hint.repairHint}`);
	}
	if (lines.length === statusLinesStart) lines.push(theme.muted(NO_CONFIGURED_CHAT_CHANNELS_LINE));
	lines.push("");
	lines.push(`Tip: ${formatDocsLink("/cli/status", "status --deep")} adds gateway health probes to status output (requires a reachable gateway).`);
	return lines;
}
//#endregion
//#region src/commands/channels/status.runtime.ts
function formatEventLoopBits(value) {
	if (!value || typeof value !== "object") return null;
	const record = value;
	if (record.degraded !== true) return null;
	const reasons = Array.isArray(record.reasons) ? record.reasons.filter((reason) => typeof reason === "string") : [];
	const delayMaxMs = typeof record.delayMaxMs === "number" && Number.isFinite(record.delayMaxMs) ? Math.round(record.delayMaxMs) : null;
	const utilization = typeof record.utilization === "number" && Number.isFinite(record.utilization) ? record.utilization : null;
	const cpuCoreRatio = typeof record.cpuCoreRatio === "number" && Number.isFinite(record.cpuCoreRatio) ? record.cpuCoreRatio : null;
	const degradedSinceMs = typeof record.degradedSinceMs === "number" && Number.isFinite(record.degradedSinceMs) ? Math.max(0, record.degradedSinceMs) : null;
	const delayP99Ms = typeof record.delayP99Ms === "number" && Number.isFinite(record.delayP99Ms) ? Math.round(record.delayP99Ms) : null;
	return [
		degradedSinceMs != null ? `for ${formatDurationCompact(degradedSinceMs) ?? "0s"}` : null,
		delayP99Ms != null ? `(p99 ${delayP99Ms}ms)` : null,
		reasons.length ? `reasons=${reasons.join(",")}` : null,
		delayMaxMs != null ? `eventLoopDelayMaxMs=${delayMaxMs}` : null,
		utilization != null ? `eventLoopUtilization=${utilization}` : null,
		cpuCoreRatio != null ? `cpuCoreRatio=${cpuCoreRatio}` : null
	].filter((part) => Boolean(part)).join(" ");
}
/** Render gateway channel status payloads into terminal-friendly lines. */
function formatGatewayChannelsStatusLines(payload) {
	const lines = [];
	lines.push(theme.success("Gateway reachable."));
	const eventLoopLine = formatEventLoopBits(payload.eventLoop);
	if (eventLoopLine) lines.push(theme.warn(`Gateway event loop degraded ${eventLoopLine}`));
	const statusWarnings = Array.isArray(payload.warnings) ? payload.warnings.filter((warning) => typeof warning === "string" && warning.trim().length > 0).slice(0, 50) : [];
	if (payload.partial === true || statusWarnings.length > 0) {
		lines.push(theme.warn("Channel status is partial:"));
		for (const warning of statusWarnings) lines.push(`- ${warning.slice(0, 500)}`);
		lines.push("");
	}
	const channelLabels = payload.channelLabels && typeof payload.channelLabels === "object" ? payload.channelLabels : {};
	const accountLines = (provider, accounts) => accounts.map((account) => {
		const bits = [];
		appendEnabledConfiguredLinkedBits(bits, account);
		if (typeof account.running === "boolean") bits.push(account.running ? "running" : "stopped");
		if (typeof account.connected === "boolean") bits.push(account.connected ? "connected" : "disconnected");
		const inboundAt = typeof account.lastInboundAt === "number" && Number.isFinite(account.lastInboundAt) ? account.lastInboundAt : null;
		const outboundAt = typeof account.lastOutboundAt === "number" && Number.isFinite(account.lastOutboundAt) ? account.lastOutboundAt : null;
		const transportAt = typeof account.lastTransportActivityAt === "number" && Number.isFinite(account.lastTransportActivityAt) ? account.lastTransportActivityAt : null;
		if (inboundAt) bits.push(`in:${formatTimeAgo(Date.now() - inboundAt)}`);
		if (outboundAt) bits.push(`out:${formatTimeAgo(Date.now() - outboundAt)}`);
		if (transportAt) bits.push(`transport:${formatTimeAgo(Date.now() - transportAt)}`);
		appendModeBit(bits, account);
		const botUsername = (() => {
			const bot = account.bot;
			const probeBot = account.probe?.bot;
			const raw = bot?.username ?? probeBot?.username ?? "";
			if (typeof raw !== "string") return "";
			const trimmed = raw.trim();
			if (!trimmed) return "";
			return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
		})();
		if (botUsername) bits.push(`bot:${botUsername}`);
		if (typeof account.dmPolicy === "string" && account.dmPolicy.length > 0) bits.push(`dm:${account.dmPolicy}`);
		if (Array.isArray(account.allowFrom) && account.allowFrom.length > 0) {
			const allowFrom = account.allowFrom.slice(0, 2).map((entry) => formatPhoneNumberForCli(String(entry)));
			bits.push(`allow:${allowFrom.join(",")}`);
		}
		appendTokenSourceBits(bits, account);
		const messageContent = account.application?.intents?.messageContent;
		if (typeof messageContent === "string" && messageContent.length > 0 && messageContent !== "enabled") bits.push(`intents:content=${messageContent}`);
		if (account.allowUnmentionedGroups === true) bits.push("groups:unmentioned");
		if (typeof account.healthState === "string" && account.healthState) bits.push(`health:${account.healthState}`);
		appendBaseUrlBit(bits, account);
		const probe = account.probe;
		if (probe && typeof probe.ok === "boolean") bits.push(probe.ok ? "works" : "probe failed");
		const audit = account.audit;
		if (audit && typeof audit.ok === "boolean") bits.push(audit.ok ? "audit ok" : "audit failed");
		const rawChannelLabel = channelLabels[provider];
		return buildChannelAccountLine(provider, account, bits, { channelLabel: typeof rawChannelLabel === "string" ? rawChannelLabel : provider });
	});
	const accountsByChannel = payload.channelAccounts;
	const accountPayloads = {};
	for (const channelId of Object.keys(accountsByChannel ?? {}).toSorted()) {
		const raw = accountsByChannel?.[channelId];
		if (Array.isArray(raw)) accountPayloads[channelId] = raw;
	}
	const accountLinesStart = lines.length;
	for (const channelId of Object.keys(accountPayloads).toSorted()) {
		const accounts = accountPayloads[channelId];
		if (accounts && accounts.length > 0) lines.push(...accountLines(channelId, accounts));
	}
	if (lines.length === accountLinesStart) lines.push(theme.muted(NO_CONFIGURED_CHAT_CHANNELS_LINE));
	lines.push("");
	const issues = collectChannelStatusIssues(payload);
	if (issues.length > 0) {
		lines.push(theme.warn("Warnings:"));
		for (const issue of issues) lines.push(`- ${issue.channel} ${issue.accountId}: ${issue.message}${issue.fix ? ` (${issue.fix})` : ""}`);
		lines.push(`- Run: ${formatCliCommand("openclaw doctor")}`);
		lines.push("");
	}
	lines.push(`Tip: ${formatDocsLink("/cli/status", "status --deep")} adds gateway health probes to status output (requires a reachable gateway).`);
	return lines;
}
async function renderChannelsStatusFallback(params) {
	const { opts, runtime, safeError, gatewayAuthUnavailable, expectedErrorOutput } = params;
	const fallbackReason = gatewayAuthUnavailable ? "Gateway auth unavailable; showing config-only status." : "Gateway not reachable; showing config-only status.";
	if (!opts.json) runtime.error(expectedErrorOutput ?? `${gatewayAuthUnavailable ? "Gateway auth unavailable" : "Gateway not reachable"}: ${safeError}`);
	const cfg = await requireValidConfig(runtime, { observe: false });
	if (!cfg) return;
	const { resolvedConfig } = await resolveCommandConfigWithSecrets({
		config: cfg,
		commandName: "channels status",
		targetIds: getConfiguredChannelsCommandSecretTargetIds(cfg),
		mode: "read_only_status",
		runtime
	});
	const snapshot = await readConfigFileSnapshot({ observe: false });
	const mode = cfg.gateway?.mode === "remote" ? "remote" : "local";
	const requestedChannel = opts.channel ? normalizeChannelId(opts.channel) ?? normalizeOptionalLowercaseString(opts.channel) : null;
	if (opts.json) {
		writeRuntimeJson(runtime, {
			gatewayReachable: false,
			error: safeError,
			gatewayAuthUnavailable,
			configOnly: true,
			config: {
				path: snapshot.path,
				mode
			},
			configuredChannels: listConfiguredAnnounceChannelIdsForConfig({
				config: resolvedConfig,
				activationSourceConfig: cfg,
				env: process.env
			}).filter((channelId) => !requestedChannel || channelId === requestedChannel)
		});
		return;
	}
	runtime.log((await formatConfigChannelsStatusLines(resolvedConfig, {
		path: snapshot.path,
		mode
	}, {
		sourceConfig: cfg,
		channel: opts.channel,
		fallbackReason
	})).join("\n"));
}
//#endregion
export { formatGatewayChannelsStatusLines, renderChannelsStatusFallback };
