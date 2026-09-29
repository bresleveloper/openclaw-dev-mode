import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { x as resolveIsNixMode } from "./paths-DehQwyE0.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { a as buildPairingConnectRecoveryTitle, s as describePairingConnectRequirement } from "./connect-error-details-HKRZ1hRc.mjs";
import { a as buildStatusSecretsValue, i as buildStatusProbesValue, n as buildStatusEventsValue, o as buildStatusSessionsOverviewValue, r as buildStatusPluginCompatibilityValue, s as formatHostDesktopStatus, t as buildStatusAllAgentsValue } from "./status-overview-values-DDrXo98p.mjs";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { t as formatDurationCompact } from "./format-duration-CeDWULoS.mjs";
import { n as formatTimeAgo } from "./format-relative-BOUle7M5.mjs";
import { t as formatDeliveryQueueHealthLine } from "./health-format-dbbKwHdv.mjs";
import { t as formatSqliteWalHealthWarning } from "./sqlite-wal-health-C1o54iaE.mjs";
import "./format-BAb_G2oU.mjs";
import { t as buildBackupStatusValue } from "./backup-health-C6zTF_2P.mjs";
import { s as buildStatusOverviewRowsFromSurface } from "./status.format-8PiDIM9o.mjs";
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
/** Formats the agents overview row value, including default-agent recent activity. */
function buildStatusAgentsValue(params) {
	const pending = params.agentStatus.bootstrapPendingCount > 0 ? `${params.agentStatus.bootstrapPendingCount} bootstrap file${params.agentStatus.bootstrapPendingCount === 1 ? "" : "s"} present` : "no workspaces bootstrapping";
	const def = params.agentStatus.agents.find((a) => a.id === params.agentStatus.defaultId);
	const defActive = def?.lastActiveAgeMs != null ? params.formatTimeAgo(def.lastActiveAgeMs) : "unknown";
	const defSuffix = def ? ` · default ${def.id} active ${defActive}` : "";
	return `${params.agentStatus.agents.length} · ${pending} · sessions ${params.agentStatus.totalSessions}${defSuffix}`;
}
/** Formats task counters and audit state for the overview table. */
function buildStatusTasksValue(params) {
	if (params.summary.tasks.total <= 0) return params.muted("none");
	return [
		`${params.summary.tasks.active} active`,
		`${params.summary.tasks.byStatus.queued} queued`,
		`${params.summary.tasks.byStatus.running} running`,
		params.summary.tasks.failures > 0 ? params.warn(`${params.summary.tasks.failures} issue${params.summary.tasks.failures === 1 ? "" : "s"}`) : params.muted("no issues"),
		params.summary.taskAudit.errors > 0 ? params.warn(`audit ${params.summary.taskAudit.errors} error${params.summary.taskAudit.errors === 1 ? "" : "s"} · ${params.summary.taskAudit.warnings} warn`) : params.summary.taskAudit.warnings > 0 ? params.muted(`audit ${params.summary.taskAudit.warnings} warn`) : params.muted("audit clean"),
		`${params.summary.tasks.total} tracked`
	].join(" · ");
}
/** Formats configured heartbeat intervals by agent. */
function buildStatusHeartbeatValue(params) {
	const parts = params.summary.heartbeat.agents.map((agent) => {
		if (!agent.enabled || !agent.everyMs) return `disabled (${agent.agentId})`;
		if (agent.waitingForRoute) return `${agent.every} (${agent.agentId}; waiting for delivery route — set commands.ownerAllowFrom=["telegram:123456789"] or channel allowFrom; explicit delivery: heartbeat.target="telegram" with heartbeat.to="123456789")`;
		return `${agent.every} (${agent.agentId})`;
	}).filter(Boolean);
	return parts.length > 0 ? parts.join(", ") : "disabled";
}
/** Formats the last observed heartbeat when deep status queried the gateway. */
function buildStatusLastHeartbeatValue(params) {
	if (!params.deep) return null;
	if (params.gatewayStartupPhase) return params.muted(`not checked (gateway still starting; phase ${params.gatewayStartupPhase})`);
	if (!params.gatewayReachable) return params.warn("unavailable");
	if (!params.lastHeartbeat) return params.muted("none");
	const age = params.formatTimeAgo(Date.now() - params.lastHeartbeat.ts);
	const accountLabel = params.lastHeartbeat.accountId ? `account ${params.lastHeartbeat.accountId}` : null;
	return [
		params.lastHeartbeat.status,
		age,
		params.lastHeartbeat.channel,
		accountLabel
	].filter(Boolean).join(" · ");
}
/** Formats memory plugin/index/cache state for the overview table. */
function buildStatusMemoryValue(params) {
	if (!params.memoryPlugin.enabled) {
		const suffix = params.memoryPlugin.reason ? ` (${params.memoryPlugin.reason})` : "";
		return params.muted(`disabled${suffix}`);
	}
	if (!params.memory) {
		const slot = params.memoryPlugin.slot ? `plugin ${params.memoryPlugin.slot}` : "plugin";
		return params.muted(`enabled (${slot}) · ${params.memoryUnavailableLabel ?? "unavailable"}`);
	}
	const parts = [];
	const dirtySuffix = params.memory.dirty ? ` · ${params.warn("dirty")}` : "";
	parts.push(`${params.memory.files} files · ${params.memory.chunks} chunks${dirtySuffix}`);
	if (params.memory.sources?.length) parts.push(`sources ${params.memory.sources.join(", ")}`);
	if (params.memoryPlugin.slot) parts.push(`plugin ${params.memoryPlugin.slot}`);
	const colorByTone = (tone, text) => tone === "ok" ? params.ok(text) : tone === "warn" ? params.warn(text) : params.muted(text);
	if (params.memory.vector) {
		const vector = params.memory.backend === "builtin" && params.memory.vector.storeAvailable !== void 0 ? {
			...params.memory.vector,
			available: params.memory.vector.storeAvailable
		} : params.memory.vector;
		const state = params.resolveMemoryVectorState(vector);
		const prefix = params.memory.backend === "builtin" ? "vector store" : "vector";
		const label = state.state === "disabled" ? `${prefix} off` : `${prefix} ${state.state}`;
		parts.push(colorByTone(state.tone, label));
	}
	if (params.memory.fts) {
		const state = params.resolveMemoryFtsState(params.memory.fts);
		const label = state.state === "disabled" ? "fts off" : `fts ${state.state}`;
		parts.push(colorByTone(state.tone, label));
	}
	if (params.memory.cache) {
		const summary = params.resolveMemoryCacheSummary(params.memory.cache);
		parts.push(colorByTone(summary.tone, summary.text));
	}
	return parts.join(" · ");
}
/** Builds the security audit text section for status output. */
function buildStatusSecurityAuditLines(params) {
	const fmtSummary = (value) => {
		return [
			params.theme.error(`${value.critical} critical`),
			params.theme.warn(`${value.warn} warn`),
			params.theme.muted(`${value.info} info`)
		].join(" · ");
	};
	const lines = [params.theme.muted(`Summary: ${fmtSummary(params.securityAudit.summary)}`)];
	const importantFindings = params.securityAudit.findings.filter((f) => f.severity === "critical" || f.severity === "warn");
	if (importantFindings.length === 0) lines.push(params.theme.muted("No critical or warn findings detected."));
	else {
		const severityLabel = (sev) => sev === "critical" ? params.theme.error("CRITICAL") : sev === "warn" ? params.theme.warn("WARN") : params.theme.muted("INFO");
		const sevRank = (sev) => sev === "critical" ? 0 : sev === "warn" ? 1 : 2;
		const shown = [...importantFindings].toSorted((a, b) => sevRank(a.severity) - sevRank(b.severity)).slice(0, 6);
		for (const finding of shown) {
			lines.push(`  ${severityLabel(finding.severity)} ${finding.title}`);
			lines.push(`    ${params.shortenText(finding.detail.replaceAll("\n", " "), 160)}`);
			if (finding.remediation?.trim()) lines.push(`    ${params.theme.muted(`Fix: ${finding.remediation.trim()}`)}`);
		}
		if (importantFindings.length > shown.length) lines.push(params.theme.muted(`… +${importantFindings.length - shown.length} more`));
	}
	lines.push(params.theme.muted(`Full report: ${params.formatCliCommand("openclaw security audit")}`));
	lines.push(params.theme.muted(`Deep probe: ${params.formatCliCommand("openclaw security audit --deep")}`));
	return lines;
}
/** Builds gateway, channel, and delivery queue health table rows. */
function buildStatusHealthRows(params) {
	const rows = [{
		Item: "Gateway",
		Status: params.ok("reachable"),
		Detail: `${params.health.durationMs}ms`
	}];
	const sqliteWalWarning = formatSqliteWalHealthWarning(params.sqliteWal);
	if (sqliteWalWarning) rows.push({
		Item: "SQLite WAL",
		Status: params.warn("WARN"),
		Detail: sqliteWalWarning
	});
	if (params.health.eventLoop) rows.push({
		Item: "Event loop",
		Status: params.health.eventLoop.degraded ? params.warn("WARN") : params.ok("OK"),
		Detail: formatEventLoopHealthDetail(params.health.eventLoop)
	});
	const healthLines = params.formatHealthChannelLines(params.health, { accountMode: "all" });
	const deliveryQueueLine = formatDeliveryQueueHealthLine(params.health);
	if (deliveryQueueLine) healthLines.push(deliveryQueueLine);
	for (const line of healthLines) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const item = line.slice(0, colon).trim();
		const detail = line.slice(colon + 1).trim();
		const normalized = normalizeLowercaseStringOrEmpty(detail);
		const status = normalized === "healthy" || normalized.startsWith("ok") || normalized.startsWith("configured") ? params.ok("OK") : normalized.startsWith("not configured") || normalized.startsWith("disabled") ? params.muted("OFF") : normalized.startsWith("linked") ? params.ok("LINKED") : normalized.startsWith("not linked") ? params.warn("UNLINKED") : params.warn("WARN");
		rows.push({
			Item: item,
			Status: status,
			Detail: detail
		});
	}
	return rows;
}
/** Formats event-loop latency/utilization health into one table detail string. */
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
/** Builds recent session table rows, optionally including prompt-cache data. */
function buildStatusSessionsRows(params) {
	if (params.recent.length === 0) return [];
	return params.recent.map((sess) => ({
		Key: params.shortenText(sess.key, 32),
		Kind: sess.kind,
		Age: sess.updatedAt && sess.age != null ? params.formatTimeAgo(sess.age) : "no activity",
		Model: sess.model ?? "unknown",
		Runtime: sess.runtime ?? "unknown",
		Tokens: params.formatTokensCompact(sess),
		...params.verbose ? { Cache: params.formatPromptCacheCompact(sess) || params.muted("—") } : {}
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
		const key = params.shortenText(sess.key, 48);
		const configured = sess.configuredModel ?? "unknown";
		const selected = sess.selectedModel ?? "unknown";
		const isFallback = sess.modelSelectionReason === "fallback selected";
		const intro = isFallback ? `Session ${key} is running ${selected} (auto fallback); config primary is ${configured}.` : `Session ${key} is pinned to ${selected}; config primary ${configured} will apply to new/unpinned sessions.`;
		const reasonLine = `  Reason: ${sess.modelSelectionReason ?? "session override"}`;
		const clearLine = isFallback ? "  Action: check provider availability or retry with /model" : "  Clear with: /model default";
		lines.push(params.warn(intro), `  Configured default: ${configured}`, `  Session selected: ${selected}`, reasonLine, clearLine, "  Docs: https://docs.openclaw.ai/concepts/models#selection-source-and-fallback-strictness");
	}
	if (mismatches.length > limit) lines.push(params.muted(`  … +${mismatches.length - limit} more pinned session(s)`));
	return lines;
}
/** Builds footer links and next-step commands for the current gateway state. */
function buildStatusFooterLines(params) {
	return [
		"FAQ: https://docs.openclaw.ai/faq",
		"Troubleshooting: https://docs.openclaw.ai/troubleshooting",
		...params.updateHint ? ["", params.warn(params.updateHint)] : [],
		"Next steps:",
		`  Need to share?      ${params.formatCliCommand("openclaw status --all")}`,
		`  Need to debug live? ${params.formatCliCommand("openclaw logs --follow")}`,
		params.nodeOnlyGateway ? `  Need node service?  ${params.formatCliCommand("openclaw node status")}` : params.gatewayStartupPhase ? `  Retry after startup: ${params.formatCliCommand("openclaw status --deep")}` : params.gatewayReachable ? `  Need to test channels? ${params.formatCliCommand("openclaw status --deep")}` : `  Fix reachability first: ${params.formatCliCommand("openclaw gateway probe")}`
	];
}
/** Builds plugin compatibility lines, capped to keep status output readable. */
function buildStatusPluginCompatibilityLines(params) {
	if (params.notices.length === 0) return [];
	const limit = params.limit ?? 8;
	return [...params.notices.slice(0, limit).map((notice) => {
		return `  ${notice.severity === "warn" ? params.warn("WARN") : params.muted("INFO")} ${params.formatNotice(notice)}`;
	}), ...params.notices.length > limit ? [params.muted(`  … +${params.notices.length - limit} more`)] : []];
}
/** Builds recovery guidance when the gateway reports device pairing is required. */
function buildStatusPairingRecoveryLines(params) {
	if (!params.pairingRecovery) return [];
	return [
		params.warn(buildPairingConnectRecoveryTitle(params.pairingRecovery.reason ?? void 0)),
		...params.pairingRecovery.reason ? [params.muted(`Reason: ${describePairingConnectRequirement(params.pairingRecovery.reason)}.`)] : [],
		...params.pairingRecovery.remediationHint ? [params.muted(`Hint: ${params.pairingRecovery.remediationHint}`)] : [],
		...params.pairingRecovery.requestId ? [params.muted(`Recovery: ${params.formatCliCommand(`openclaw devices approve ${params.pairingRecovery.requestId}`)}`)] : [],
		params.muted(`Fallback: ${params.formatCliCommand("openclaw devices approve --latest")}`),
		params.muted(`Inspect: ${params.formatCliCommand("openclaw devices list")}`)
	];
}
/** Builds the queued system-events table rows. */
function buildStatusSystemEventsRows(params) {
	const limit = params.limit ?? 5;
	if (params.queuedSystemEvents.length === 0) return;
	return params.queuedSystemEvents.slice(0, limit).map((event) => ({ Event: event }));
}
/** Builds the overflow trailer for queued system events. */
function buildStatusSystemEventsTrailer(params) {
	const limit = params.limit ?? 5;
	return params.queuedSystemEvents.length > limit ? params.muted(`… +${params.queuedSystemEvents.length - limit} more`) : null;
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
/** Builds the default `openclaw status` overview rows from scan, health, memory, and session inputs. */
function buildStatusCommandOverviewRows(params) {
	const agentsValue = buildStatusAgentsValue({
		agentStatus: params.agentStatus,
		formatTimeAgo: params.formatTimeAgo
	});
	const eventsValue = buildStatusEventsValue({ queuedSystemEvents: params.summary.queuedSystemEvents });
	const tasksValue = buildStatusTasksValue({
		summary: params.summary,
		warn: params.warn,
		muted: params.muted
	});
	const probesValue = buildStatusProbesValue({
		health: params.health,
		ok: params.ok,
		muted: params.muted
	});
	const heartbeatValue = buildStatusHeartbeatValue({ summary: params.summary });
	const lastHeartbeatValue = buildStatusLastHeartbeatValue({
		deep: params.opts.deep,
		gatewayReachable: params.surface.gatewayReachable,
		gatewayStartupPhase: params.surface.gatewayProbe?.startupPhase,
		lastHeartbeat: params.lastHeartbeat,
		warn: params.warn,
		muted: params.muted,
		formatTimeAgo: params.formatTimeAgo
	});
	const memoryValue = buildStatusMemoryValue({
		memory: params.memory,
		memoryPlugin: params.memoryPlugin,
		ok: params.ok,
		warn: params.warn,
		muted: params.muted,
		resolveMemoryVectorState: params.resolveMemoryVectorState,
		resolveMemoryFtsState: params.resolveMemoryFtsState,
		resolveMemoryCacheSummary: params.resolveMemoryCacheSummary,
		memoryUnavailableLabel: "not checked"
	});
	const pluginCompatibilityValue = buildStatusPluginCompatibilityValue({
		notices: params.pluginCompatibility,
		ok: params.ok,
		warn: params.warn
	});
	const updatesDisabled = params.surface.cfg.update?.checkOnStart === false || isTruthyEnvValue(params.env.OPENCLAW_NO_AUTO_UPDATE) || resolveIsNixMode(params.env);
	const doNotTrack = params.env.DO_NOT_TRACK?.trim().toLowerCase();
	const telemetryValue = updatesDisabled ? params.muted("disabled · update checks off") : doNotTrack === "1" || doNotTrack === "true" ? params.muted("disabled (DO_NOT_TRACK)") : params.surface.cfg.telemetry?.enabled === true ? params.ok("enabled · anonymous feature stats") : params.muted("disabled · update checks only");
	const hostDesktopValue = formatHostDesktopStatus(params.summary.hostDesktop);
	return buildStatusOverviewRowsFromSurface({
		surface: params.surface,
		decorateOk: params.ok,
		decorateWarn: params.warn,
		decorateTailscaleOff: params.muted,
		decorateTailscaleWarn: params.warn,
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
				Value: (params.summary.hostDesktop?.state ?? "disabled") === "disabled" ? params.muted(hostDesktopValue) : hostDesktopValue
			},
			...buildStatusDegradationRows(params.summary, params.warn),
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
				Item: "Tasks",
				Value: tasksValue
			},
			{
				Item: "Backups",
				Value: buildBackupStatusValue({
					freshness: params.backupFreshness,
					formatTimeAgo: params.formatTimeAgo
				})
			},
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
				Value: buildStatusSessionsOverviewValue({
					sessions: params.summary.sessions,
					formatKTokens: params.formatKTokens
				})
			}
		],
		gatewayAuthWarningValue: params.surface.gatewayProbeAuthWarning ? params.warn(params.surface.gatewayProbeAuthWarning) : null
	});
}
/** Builds the expanded status-all overview rows, including config and security hints. */
function buildStatusAllOverviewRows(params) {
	return buildStatusOverviewRowsFromSurface({
		surface: params.surface,
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
/** Formats channel rows and overlays live gateway issues onto their display state. */
function buildStatusChannelsTableRows(params) {
	const firstIssueByChannel = /* @__PURE__ */ new Map();
	for (const issue of params.channelIssues) {
		const channel = issue.channel;
		if (!firstIssueByChannel.has(channel)) firstIssueByChannel.set(channel, issue);
	}
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
/** Formats agent status rows for the status report table. */
function buildStatusAgentTableRows(params) {
	return params.agentStatus.agents.map((agent) => ({
		Agent: `${agent.name?.trim() ? `${agent.id} (${agent.name.trim()})` : agent.id}${agent.status === "degraded" ? params.warn(" (degraded)") : ""}`,
		BootstrapFile: agent.bootstrapPending === true ? params.warn("PRESENT") : agent.bootstrapPending === false ? params.ok("ABSENT") : "unknown",
		Sessions: agent.status === "degraded" ? "unavailable" : String(agent.sessionsCount),
		Active: agent.status === "degraded" ? params.warn("refused") : agent.lastActiveAgeMs != null ? formatTimeAgo(agent.lastActiveAgeMs) : "unknown",
		Store: agent.admissionRefusal ? `${agent.sessionsPath}\n${agent.admissionRefusal.reason}\n${agent.admissionRefusal.repairHint}` : agent.sessionsPath
	}));
}
/** Converts per-channel account detail rows into renderable table sections. */
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
	context.lines.push(context.renderTable({
		width: context.width,
		columns,
		rows
	}).trimEnd());
	if (trailer) context.lines.push(trailer);
}
//#endregion
export { buildStatusSecurityAuditLines as _, buildStatusChannelDetailSections as a, buildStatusSystemEventsTrailer as b, buildStatusChannelsTableRows as c, buildStatusCommandOverviewRows as d, buildStatusFooterLines as f, buildStatusPluginCompatibilityLines as g, buildStatusPairingRecoveryLines as h, buildStatusAgentTableRows as i, statusChannelsTableColumns as l, buildStatusModelSelectionLines as m, appendStatusReportLines as n, statusAgentsTableColumns as o, buildStatusHealthRows as p, appendStatusReportTable as r, statusOverviewTableColumns as s, appendStatusReportHeading as t, buildStatusAllOverviewRows as u, buildStatusSessionsRows as v, statusHealthColumns as x, buildStatusSystemEventsRows as y };
