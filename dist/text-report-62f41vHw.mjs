import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { C as resolveIsNixMode } from "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as indexFirstByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { t as formatDurationCompact } from "./format-duration-BIQQYTeV.mjs";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-B5N-I0ib.mjs";
import { a as buildPairingConnectRecoveryTitle, s as describePairingConnectRequirement } from "./connect-error-details-q_NaMExM.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
import { n as renderTable } from "./table-CvWMfO8o.mjs";
import { n as resolveMemoryFtsState, r as resolveMemoryVectorState, t as resolveMemoryCacheSummary } from "./status-format-ExS6-yQO.mjs";
import { t as formatPluginCompatibilityNotice } from "./status-compatibility-DdQ1VWdc.mjs";
import { n as shortenText } from "./text-format-DKwAItdz.mjs";
import { a as buildStatusSecretsValue, c as formatHostDesktopStatus, i as buildStatusProbesValue, n as buildStatusEventsValue, o as buildStatusSessionsOverviewValue, r as buildStatusPluginCompatibilityValue, t as buildStatusAllAgentsValue } from "./status-overview-values-w-Za2K-6.mjs";
import { r as formatHealthChannelLines, t as formatDeliveryQueueHealthLine } from "./health-format-DWa2HpAp.mjs";
import { t as formatMissingChildRuntimeWarning } from "./child-runtime-viability-Dt-lp9OO.mjs";
import { t as formatSqliteWalHealthWarning } from "./sqlite-wal-health-B-rV2lld.mjs";
import { n as buildStatusOverviewSurfaceRows } from "./format-BtdanoQr.mjs";
import { t as buildBackupStatusValue } from "./backup-health-ClSJFJC2.mjs";
import { i as formatTokensCompact, n as formatPromptCacheCompact } from "./status.format-vDJygGtq.mjs";
//#region src/commands/status.command-sections.ts
const statusHealthColumns = [
	{
		key: "Item",
		header: "Item",
		minWidth: 10
	},
	{
		key: "Status",
		header: "Status",
		minWidth: 8
	},
	{
		key: "Detail",
		header: "Detail",
		flex: true,
		minWidth: 28
	}
];
function buildStatusAgentsValue(params) {
	const pending = params.agentStatus.bootstrapPendingCount > 0 ? `${params.agentStatus.bootstrapPendingCount} bootstrap file${params.agentStatus.bootstrapPendingCount === 1 ? "" : "s"} present` : "no workspaces bootstrapping";
	const def = params.agentStatus.agents.find((a) => a.id === params.agentStatus.defaultId);
	const defActive = def?.lastActiveAgeMs != null ? formatTimeAgo(def.lastActiveAgeMs) : "unknown";
	const defSuffix = def ? ` · default ${def.id} active ${defActive}` : "";
	return `${params.agentStatus.agents.length} · ${pending} · sessions ${params.agentStatus.totalSessions}${defSuffix}`;
}
function buildStatusHeartbeatValue(params) {
	const parts = params.summary.heartbeat.agents.map((agent) => {
		if (!agent.enabled || !agent.everyMs) return `disabled (${agent.agentId})`;
		if (agent.waitingForRoute) return `${agent.every} (${agent.agentId}; waiting for delivery route — set commands.ownerAllowFrom=["telegram:123456789"] or channel allowFrom; explicit delivery: heartbeat.target="telegram" with heartbeat.to="123456789")`;
		return `${agent.every} (${agent.agentId})`;
	});
	return parts.length > 0 ? parts.join(", ") : "disabled";
}
function buildStatusLastHeartbeatValue(params) {
	if (!params.deep) return null;
	if (params.gatewayStartupPhase) return theme.muted(`not checked (gateway still starting; phase ${params.gatewayStartupPhase})`);
	if (!params.gatewayReachable) return theme.warn("unavailable");
	if (!params.lastHeartbeat) return theme.muted("none");
	const age = formatTimeAgo(Date.now() - params.lastHeartbeat.ts);
	const accountLabel = params.lastHeartbeat.accountId ? `account ${params.lastHeartbeat.accountId}` : null;
	return [
		params.lastHeartbeat.status,
		age,
		params.lastHeartbeat.channel,
		accountLabel
	].filter(Boolean).join(" · ");
}
function buildStatusMemoryValue(params) {
	if (!params.memoryPlugin.enabled) {
		const suffix = params.memoryPlugin.reason ? ` (${params.memoryPlugin.reason})` : "";
		return theme.muted(`disabled${suffix}`);
	}
	if (!params.memory) {
		const slot = params.memoryPlugin.slot ? `plugin ${params.memoryPlugin.slot}` : "plugin";
		return theme.muted(`enabled (${slot}) · ${params.memoryUnavailableLabel ?? "unavailable"}`);
	}
	if ("health" in params.memory) {
		const detail = params.memory.health.message ? ` · ${params.memory.health.message}` : "";
		const status = params.memory.health.status === "ready" ? theme.success("ready") : params.memory.health.status === "degraded" ? theme.warn("degraded") : theme.warn("unavailable");
		return `plugin ${params.memory.provider} · ${status}${detail}`;
	}
	const parts = [];
	const dirtySuffix = params.memory.dirty ? ` · ${theme.warn("dirty")}` : "";
	parts.push(`${params.memory.files} files · ${params.memory.chunks} chunks${dirtySuffix}`);
	if (params.memory.sources?.length) parts.push(`sources ${params.memory.sources.join(", ")}`);
	if (params.memoryPlugin.slot) parts.push(`plugin ${params.memoryPlugin.slot}`);
	const colorByTone = (tone, text) => tone === "ok" ? theme.success(text) : tone === "warn" ? theme.warn(text) : theme.muted(text);
	if (params.memory.vector) {
		const vector = params.memory.backend === "builtin" && params.memory.vector.storeAvailable !== void 0 ? {
			...params.memory.vector,
			available: params.memory.vector.storeAvailable
		} : params.memory.vector;
		const state = resolveMemoryVectorState(vector);
		const prefix = params.memory.backend === "builtin" ? "vector store" : "vector";
		const label = state.state === "disabled" ? `${prefix} off` : `${prefix} ${state.state}`;
		parts.push(colorByTone(state.tone, label));
	}
	if (params.memory.fts) {
		const state = resolveMemoryFtsState(params.memory.fts);
		const label = state.state === "disabled" ? "fts off" : `fts ${state.state}`;
		parts.push(colorByTone(state.tone, label));
	}
	if (params.memory.cache) {
		const summary = resolveMemoryCacheSummary(params.memory.cache);
		parts.push(colorByTone(summary.tone, summary.text));
	}
	return parts.join(" · ");
}
function buildStatusSecurityAuditLines(params) {
	const fmtSummary = (value) => {
		return [
			theme.error(`${value.critical} critical`),
			theme.warn(`${value.warn} warn`),
			theme.muted(`${value.info} info`)
		].join(" · ");
	};
	const lines = [theme.muted(`Summary: ${fmtSummary(params.securityAudit.summary)}`)];
	const importantFindings = params.securityAudit.findings.filter((f) => f.severity === "critical" || f.severity === "warn");
	if (importantFindings.length === 0) lines.push(theme.muted("No critical or warn findings detected."));
	else {
		const severityLabel = (sev) => sev === "critical" ? theme.error("CRITICAL") : sev === "warn" ? theme.warn("WARN") : theme.muted("INFO");
		const sevRank = (sev) => sev === "critical" ? 0 : sev === "warn" ? 1 : 2;
		const shown = importantFindings.toSorted((a, b) => sevRank(a.severity) - sevRank(b.severity)).slice(0, 6);
		for (const finding of shown) {
			lines.push(`  ${severityLabel(finding.severity)} ${finding.title}`);
			lines.push(`    ${shortenText(finding.detail.replaceAll("\n", " "), 160)}`);
			if (finding.remediation?.trim()) lines.push(`    ${theme.muted(`Fix: ${finding.remediation.trim()}`)}`);
		}
		if (importantFindings.length > shown.length) lines.push(theme.muted(`… +${importantFindings.length - shown.length} more`));
	}
	lines.push(theme.muted(`Full report: ${formatCliCommand("openclaw security audit")}`));
	lines.push(theme.muted(`Deep probe: ${formatCliCommand("openclaw security audit --deep")}`));
	return lines;
}
function buildStatusHealthRows(params) {
	const rows = [{
		Item: "Gateway",
		Status: theme.success("reachable"),
		Detail: `${params.health.durationMs}ms`
	}];
	const childRuntimeWarning = params.health.childRuntime ? formatMissingChildRuntimeWarning(params.health.childRuntime) : void 0;
	if (childRuntimeWarning) rows.push({
		Item: "Gateway runtime",
		Status: theme.warn("WARN"),
		Detail: childRuntimeWarning
	});
	const sqliteWalWarning = formatSqliteWalHealthWarning(params.sqliteWal);
	if (sqliteWalWarning) rows.push({
		Item: "SQLite WAL",
		Status: theme.warn("WARN"),
		Detail: sqliteWalWarning
	});
	if (params.health.eventLoop) rows.push({
		Item: "Event loop",
		Status: params.health.eventLoop.degraded ? theme.warn("WARN") : theme.success("OK"),
		Detail: formatEventLoopHealthDetail(params.health.eventLoop)
	});
	const healthLines = formatHealthChannelLines(params.health, { accountMode: "all" });
	const deliveryQueueLine = formatDeliveryQueueHealthLine(params.health);
	if (deliveryQueueLine) healthLines.push(deliveryQueueLine);
	for (const line of healthLines) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const item = line.slice(0, colon).trim();
		const detail = line.slice(colon + 1).trim();
		const normalized = normalizeLowercaseStringOrEmpty(detail);
		const status = normalized === "healthy" || normalized.startsWith("ok") || normalized.startsWith("configured") ? theme.success("OK") : normalized.startsWith("not configured") || normalized.startsWith("disabled") ? theme.muted("OFF") : normalized.startsWith("linked") ? theme.success("LINKED") : normalized.startsWith("not linked") ? theme.warn("UNLINKED") : theme.warn("WARN");
		rows.push({
			Item: item,
			Status: status,
			Detail: detail
		});
	}
	return rows;
}
function formatEventLoopHealthDetail(eventLoop) {
	return [
		eventLoop.degraded && eventLoop.degradedSinceMs != null ? `degraded for ${formatDurationCompact(eventLoop.degradedSinceMs) ?? "0s"}` : null,
		eventLoop.reasons.length > 0 ? `reasons ${eventLoop.reasons.join(",")}` : "healthy",
		`max ${Math.round(eventLoop.delayMaxMs)}ms`,
		`p99 ${Math.round(eventLoop.delayP99Ms)}ms`,
		`util ${eventLoop.utilization}`,
		`cpu ${eventLoop.cpuCoreRatio}`
	].filter((part) => part !== null).join(" · ");
}
function buildStatusSessionsRows(params) {
	return params.recent.map((sess) => ({
		Key: shortenText(sess.key, 32),
		Kind: sess.kind,
		Age: sess.updatedAt && sess.age != null ? formatTimeAgo(sess.age) : "no activity",
		Model: sess.model ?? "unknown",
		Runtime: sess.runtime ?? "unknown",
		Tokens: formatTokensCompact(sess),
		...params.verbose ? { Cache: formatPromptCacheCompact(sess) || theme.muted("—") } : {}
	}));
}
/** Explains sessions pinned to a selected model different from the current configured default. */
function buildStatusModelSelectionLines(params) {
	const mismatches = params.recent.filter((sess) => {
		if (!sess.configuredModel || !sess.selectedModel || !sess.modelSelectionReason) return false;
		return sess.configuredModel !== sess.selectedModel && !areRuntimeModelRefsEquivalent(sess.configuredModel, sess.selectedModel);
	});
	if (mismatches.length === 0) return [];
	const limit = params.limit ?? 3;
	const lines = [];
	for (const sess of mismatches.slice(0, limit)) {
		const key = shortenText(sess.key, 48);
		const configured = sess.configuredModel ?? "unknown";
		const selected = sess.selectedModel ?? "unknown";
		const isFallback = sess.modelSelectionReason === "fallback selected";
		const intro = isFallback ? `Session ${key} is running ${selected} (auto fallback); config primary is ${configured}.` : `Session ${key} is pinned to ${selected}; config primary ${configured} will apply to new/unpinned sessions.`;
		const reasonLine = `  Reason: ${sess.modelSelectionReason ?? "session override"}`;
		const clearLine = isFallback ? "  Action: check provider availability or retry with /model" : "  Clear with: /model default";
		lines.push(theme.warn(intro), `  Configured default: ${configured}`, `  Session selected: ${selected}`, reasonLine, clearLine, "  Docs: https://docs.openclaw.ai/concepts/models#selection-source-and-fallback-strictness");
	}
	if (mismatches.length > limit) lines.push(theme.muted(`  … +${mismatches.length - limit} more pinned session(s)`));
	return lines;
}
function buildStatusFooterLines(params) {
	return [
		"FAQ: https://docs.openclaw.ai/faq",
		"Troubleshooting: https://docs.openclaw.ai/troubleshooting",
		...params.updateHint ? ["", theme.warn(params.updateHint)] : [],
		"Next steps:",
		`  Need to share?      ${formatCliCommand("openclaw status --all")}`,
		`  Need to debug live? ${formatCliCommand("openclaw logs --follow")}`,
		params.nodeOnlyGateway ? `  Need node service?  ${formatCliCommand("openclaw node status")}` : params.gatewayStartupPhase ? `  Retry after startup: ${formatCliCommand("openclaw status --deep")}` : params.gatewayReachable ? `  Need to test channels? ${formatCliCommand("openclaw status --deep")}` : `  Fix reachability first: ${formatCliCommand("openclaw gateway probe")}`
	];
}
function buildStatusPluginCompatibilityLines(params) {
	if (params.notices.length === 0) return [];
	const limit = params.limit ?? 8;
	return [...params.notices.slice(0, limit).map((notice) => {
		return `  ${notice.severity === "warn" ? theme.warn("WARN") : theme.muted("INFO")} ${formatPluginCompatibilityNotice(notice)}`;
	}), ...params.notices.length > limit ? [theme.muted(`  … +${params.notices.length - limit} more`)] : []];
}
function buildStatusPairingRecoveryLines(params) {
	if (!params.pairingRecovery) return [];
	return [
		theme.warn(buildPairingConnectRecoveryTitle(params.pairingRecovery.reason ?? void 0)),
		...params.pairingRecovery.reason ? [theme.muted(`Reason: ${describePairingConnectRequirement(params.pairingRecovery.reason)}.`)] : [],
		...params.pairingRecovery.remediationHint ? [theme.muted(`Hint: ${params.pairingRecovery.remediationHint}`)] : [],
		...params.pairingRecovery.requestId ? [theme.muted(`Recovery: ${formatCliCommand(`openclaw devices approve ${params.pairingRecovery.requestId}`)}`)] : [],
		theme.muted(`Fallback: ${formatCliCommand("openclaw devices approve --latest")}`),
		theme.muted(`Inspect: ${formatCliCommand("openclaw devices list")}`)
	];
}
function buildStatusSystemEventsRows(params) {
	const limit = params.limit ?? 5;
	if (params.queuedSystemEvents.length === 0) return;
	return params.queuedSystemEvents.slice(0, limit).map((event) => ({ Event: event }));
}
function buildStatusSystemEventsTrailer(params) {
	const limit = params.limit ?? 5;
	return params.queuedSystemEvents.length > limit ? theme.muted(`… +${params.queuedSystemEvents.length - limit} more`) : null;
}
//#endregion
//#region src/commands/status-overview-rows.ts
function buildStatusDegradationRows(summary, decorate = (value) => value) {
	const rows = [];
	if (summary.startupMigrationWarning) rows.push({
		Item: "Startup migrations",
		Value: decorate(summary.startupMigrationWarning)
	});
	if (summary.startupRecoveryWarning) rows.push({
		Item: "Session recovery",
		Value: decorate(summary.startupRecoveryWarning)
	});
	const childRuntimeWarning = summary.childRuntime ? formatMissingChildRuntimeWarning(summary.childRuntime) : void 0;
	if (childRuntimeWarning) rows.push({
		Item: "Gateway runtime",
		Value: decorate(childRuntimeWarning)
	});
	if (summary.installationReplacementWarning) rows.push({
		Item: "Installation replaced",
		Value: decorate(summary.installationReplacementWarning)
	});
	if (summary.secretEgressProxy) {
		const status = summary.secretEgressProxy;
		rows.push({
			Item: "Secret egress proxy",
			Value: status.state === "ready" ? `ready · CA expires ${status.caExpiresAt}` : decorate(status.message ?? "Certificate preparation unavailable")
		});
	}
	const secretOwners = summary.degradedSecretOwners ?? [];
	if (secretOwners.length > 0) rows.push({
		Item: "Degraded secrets",
		Value: decorate(`${secretOwners.length} degraded · ${secretOwners.map((owner) => `${owner.ownerKind}:${owner.ownerId}`).join(", ")}`)
	});
	const plugins = summary.degradedPlugins ?? [];
	if (plugins.length > 0) rows.push({
		Item: "Degraded plugins",
		Value: decorate(`${plugins.length} configured-unavailable · ${plugins.map((plugin) => plugin.pluginId).join(", ")}`)
	});
	return rows;
}
function buildStatusCommandOverviewRows(params) {
	const agentsValue = buildStatusAgentsValue({ agentStatus: params.agentStatus });
	const eventsValue = buildStatusEventsValue({ queuedSystemEvents: params.summary.queuedSystemEvents });
	const probesValue = buildStatusProbesValue({ health: params.health });
	const heartbeatValue = buildStatusHeartbeatValue({ summary: params.summary });
	const lastHeartbeatValue = buildStatusLastHeartbeatValue({
		deep: params.opts.deep,
		gatewayReachable: params.surface.gatewayReachable,
		gatewayStartupPhase: params.surface.gatewayProbe?.startupPhase,
		lastHeartbeat: params.lastHeartbeat
	});
	const memoryValue = buildStatusMemoryValue({
		memory: params.memory,
		memoryPlugin: params.memoryPlugin,
		memoryUnavailableLabel: "not checked"
	});
	const pluginCompatibilityValue = buildStatusPluginCompatibilityValue({ notices: params.pluginCompatibility });
	const updatesDisabled = params.surface.cfg.update?.checkOnStart === false || isTruthyEnvValue(params.env.OPENCLAW_NO_AUTO_UPDATE) || resolveIsNixMode(params.env);
	const doNotTrack = params.env.DO_NOT_TRACK?.trim().toLowerCase();
	const telemetryValue = updatesDisabled ? theme.muted("disabled · update checks off") : doNotTrack === "1" || doNotTrack === "true" ? theme.muted("disabled (DO_NOT_TRACK)") : params.surface.cfg.telemetry?.enabled === true ? theme.success("enabled · anonymous feature stats") : theme.muted("disabled · update checks only");
	const hostDesktopValue = formatHostDesktopStatus(params.summary.hostDesktop);
	return buildStatusOverviewSurfaceRows({
		...params.surface,
		decorateOk: theme.success,
		decorateWarn: theme.warn,
		decorateTailscaleOff: theme.muted,
		decorateTailscaleWarn: theme.warn,
		prefixRows: [{
			Item: "OS",
			Value: `${params.osLabel} · node ${process.versions.node}`
		}],
		updateValue: params.updateValue,
		agentsValue,
		suffixRows: [
			...params.updateRows ?? [],
			{
				Item: "Telemetry",
				Value: telemetryValue
			},
			{
				Item: "Memory",
				Value: memoryValue
			},
			{
				Item: "Host desktop",
				Value: (params.summary.hostDesktop?.state ?? "disabled") === "disabled" ? theme.muted(hostDesktopValue) : hostDesktopValue
			},
			...buildStatusDegradationRows(params.summary, theme.warn),
			{
				Item: "Plugin compatibility",
				Value: pluginCompatibilityValue
			},
			{
				Item: "Probes",
				Value: probesValue
			},
			{
				Item: "Events",
				Value: eventsValue
			},
			{
				Item: "Backups",
				Value: buildBackupStatusValue({
					freshness: params.backupFreshness,
					formatTimeAgo
				})
			},
			...params.backupFreshness.latestOffsite ? [{
				Item: "Offsite backup",
				Value: `${params.backupFreshness.latestOffsite.location?.name ?? params.backupFreshness.latestOffsite.target}: ${buildBackupStatusValue({
					freshness: { latest: params.backupFreshness.latestOffsite },
					formatTimeAgo
				})}`
			}] : [],
			{
				Item: "Heartbeat",
				Value: heartbeatValue
			},
			...lastHeartbeatValue ? [{
				Item: "Last heartbeat",
				Value: lastHeartbeatValue
			}] : [],
			{
				Item: "Sessions",
				Value: buildStatusSessionsOverviewValue({ sessions: params.summary.sessions })
			}
		],
		gatewayAuthWarningValue: params.surface.gatewayProbeAuthWarning ? theme.warn(params.surface.gatewayProbeAuthWarning) : null
	});
}
function buildStatusAllOverviewRows(params) {
	return buildStatusOverviewSurfaceRows({
		...params.surface,
		includeBackendStateWhenOn: true,
		includeDnsNameWhenOff: true,
		prefixRows: [
			{
				Item: "Version",
				Value: VERSION
			},
			{
				Item: "OS",
				Value: params.osLabel
			},
			{
				Item: "Node",
				Value: process.versions.node
			},
			{
				Item: "Config",
				Value: params.configPath
			}
		],
		middleRows: [
			...params.updateRows ?? [],
			{
				Item: "Security",
				Value: `Run: ${formatCliCommand("openclaw security audit --deep")}`
			},
			...buildStatusDegradationRows(params.summary)
		],
		agentsValue: buildStatusAllAgentsValue({ agentStatus: params.agentStatus }),
		suffixRows: [{
			Item: "Secrets",
			Value: buildStatusSecretsValue(params.secretDiagnosticsCount)
		}],
		gatewaySelfFallbackValue: "unknown"
	});
}
//#endregion
//#region src/commands/status-all/channels-table.ts
const statusChannelsTableColumns = [
	{
		key: "Channel",
		header: "Channel",
		minWidth: 10
	},
	{
		key: "Enabled",
		header: "Enabled",
		minWidth: 7
	},
	{
		key: "State",
		header: "State",
		minWidth: 8
	},
	{
		key: "Detail",
		header: "Detail",
		flex: true,
		minWidth: 24
	}
];
function buildStatusChannelsTableRows(params) {
	const firstIssueByChannel = indexFirstByKey(params.channelIssues, (issue) => issue.channel);
	const formatIssueMessage = params.formatIssueMessage ?? ((message) => message);
	return params.rows.map((row) => {
		const issue = firstIssueByChannel.get(row.id);
		const effectiveState = row.state === "off" ? "off" : issue ? "warn" : row.state;
		const issueSuffix = issue ? ` · ${params.warn(`gateway: ${formatIssueMessage(issue.message ?? "issue")}`)}` : "";
		return {
			Channel: row.label,
			Enabled: row.enabled ? params.ok("ON") : params.muted("OFF"),
			State: effectiveState === "ok" ? params.ok("OK") : effectiveState === "warn" ? params.warn("WARN") : effectiveState === "off" ? params.muted("OFF") : params.accentDim("SETUP"),
			Detail: `${row.detail}${issueSuffix}`
		};
	});
}
//#endregion
//#region src/commands/status-all/report-tables.ts
const statusOverviewTableColumns = [{
	key: "Item",
	header: "Item",
	minWidth: 10
}, {
	key: "Value",
	header: "Value",
	flex: true,
	minWidth: 24
}];
const statusAgentsTableColumns = [
	{
		key: "Agent",
		header: "Agent",
		minWidth: 12
	},
	{
		key: "BootstrapFile",
		header: "Bootstrap file",
		minWidth: 14
	},
	{
		key: "Sessions",
		header: "Sessions",
		align: "right",
		minWidth: 8
	},
	{
		key: "Active",
		header: "Active",
		minWidth: 10
	},
	{
		key: "Store",
		header: "Store",
		flex: true,
		minWidth: 34
	}
];
function buildStatusAgentTableRows(params) {
	return params.agentStatus.agents.map((agent) => ({
		Agent: `${agent.name?.trim() ? `${agent.id} (${agent.name.trim()})` : agent.id}${agent.status === "degraded" ? params.warn(" (degraded)") : ""}`,
		BootstrapFile: agent.bootstrapPending === true ? params.warn("PRESENT") : agent.bootstrapPending === false ? params.ok("ABSENT") : "unknown",
		Sessions: agent.status === "degraded" ? "unavailable" : String(agent.sessionsCount),
		Active: agent.status === "degraded" ? params.warn("refused") : agent.lastActiveAgeMs != null ? formatTimeAgo(agent.lastActiveAgeMs) : "unknown",
		Store: agent.admissionRefusal ? `${agent.sessionsPath}\n${agent.admissionRefusal.reason}\n${agent.admissionRefusal.repairHint}` : agent.sessionsPath
	}));
}
function buildStatusChannelDetailSections(params) {
	return params.details.map((detail) => ({
		title: detail.title,
		columns: detail.columns.map((column) => ({
			key: column,
			header: column,
			flex: column === "Notes",
			minWidth: column === "Notes" ? 28 : 10
		})),
		rows: detail.rows.map((row) => ({
			...row,
			...row.Status === "OK" ? { Status: params.ok("OK") } : row.Status === "WARN" ? { Status: params.warn("WARN") } : {}
		}))
	}));
}
//#endregion
//#region src/commands/status-all/text-report.ts
/** Keeps section spacing in one rendering owner. */
function appendStatusReportHeading(context, title) {
	if (context.lines.length > 0) context.lines.push("");
	context.lines.push(context.heading(title));
}
function appendStatusReportLines(context, title, body) {
	appendStatusReportHeading(context, title);
	context.lines.push(...body);
}
function appendStatusReportTable(context, title, columns, rows, trailer) {
	appendStatusReportHeading(context, title);
	context.lines.push(renderTable({
		width: context.width,
		columns,
		rows
	}).trimEnd());
	if (trailer) context.lines.push(trailer);
}
//#endregion
export { buildStatusSecurityAuditLines as _, buildStatusChannelDetailSections as a, buildStatusSystemEventsTrailer as b, buildStatusChannelsTableRows as c, buildStatusCommandOverviewRows as d, buildStatusFooterLines as f, buildStatusPluginCompatibilityLines as g, buildStatusPairingRecoveryLines as h, buildStatusAgentTableRows as i, statusChannelsTableColumns as l, buildStatusModelSelectionLines as m, appendStatusReportLines as n, statusAgentsTableColumns as o, buildStatusHealthRows as p, appendStatusReportTable as r, statusOverviewTableColumns as s, appendStatusReportHeading as t, buildStatusAllOverviewRows as u, buildStatusSessionsRows as v, statusHealthColumns as x, buildStatusSystemEventsRows as y };
