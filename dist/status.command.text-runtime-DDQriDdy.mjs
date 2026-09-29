import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as info } from "./globals-QODkv80i.mjs";
import { n as formatTimeAgo } from "./format-relative-BOUle7M5.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { n as resolveMemoryFtsState, r as resolveMemoryVectorState, t as resolveMemoryCacheSummary } from "./status-format-ExS6-yQO.mjs";
import { t as formatUsageReportLines } from "./provider-usage.format-Z_dzle_W.mjs";
import { t as formatPluginCompatibilityNotice } from "./status-compatibility-DdQ1VWdc.mjs";
import { n as shortenText } from "./text-format-D_7c--rP.mjs";
import { n as readBackupRunFreshness } from "./backup-run-records-CBOO28UK.mjs";
import { t as formatUpdateAvailableHint } from "./status.update-CJiluPGL.mjs";
import { r as formatHealthChannelLines } from "./health-format-dbbKwHdv.mjs";
import { r as buildStatusUpdateSurface } from "./format-BAb_G2oU.mjs";
import { a as formatTokensCompact, i as formatStatusConfigDiagnosticEntries, n as formatKTokens, r as formatPromptCacheCompact } from "./status.format-8PiDIM9o.mjs";
import { _ as buildStatusSecurityAuditLines, b as buildStatusSystemEventsTrailer, c as buildStatusChannelsTableRows, d as buildStatusCommandOverviewRows, f as buildStatusFooterLines, g as buildStatusPluginCompatibilityLines, h as buildStatusPairingRecoveryLines, l as statusChannelsTableColumns, m as buildStatusModelSelectionLines, n as appendStatusReportLines, p as buildStatusHealthRows, r as appendStatusReportTable, s as statusOverviewTableColumns, v as buildStatusSessionsRows, x as statusHealthColumns, y as buildStatusSystemEventsRows } from "./text-report-DeJJdZJN.mjs";
//#region src/commands/status.command-report-data.ts
/** Builds all table rows, section lines, and footer data needed by the status report renderer. */
async function buildStatusCommandReportData(params) {
	const ok = (value) => theme.success(value);
	const warn = (value) => theme.warn(value);
	const muted = (value) => theme.muted(value);
	const overviewRows = buildStatusCommandOverviewRows({
		env: params.env,
		backupFreshness: await readBackupRunFreshness(params.env),
		opts: params.opts,
		surface: params.surface,
		osLabel: params.osSummary.label,
		summary: params.summary,
		health: params.health,
		lastHeartbeat: params.lastHeartbeat,
		agentStatus: params.agentStatus,
		memory: params.memory,
		memoryPlugin: params.memoryPlugin,
		pluginCompatibility: params.pluginCompatibility,
		ok,
		warn,
		muted,
		formatTimeAgo,
		formatKTokens,
		resolveMemoryVectorState,
		resolveMemoryFtsState,
		resolveMemoryCacheSummary,
		updateValue: params.updateValue,
		updateRows: params.updateRows
	});
	const sessionsColumns = [
		{
			key: "Key",
			header: "Key",
			minWidth: 20,
			flex: true
		},
		{
			key: "Kind",
			header: "Kind",
			minWidth: 6
		},
		{
			key: "Age",
			header: "Age",
			minWidth: 9
		},
		{
			key: "Model",
			header: "Model",
			minWidth: 14
		},
		{
			key: "Runtime",
			header: "Runtime",
			minWidth: 14
		},
		{
			key: "Tokens",
			header: "Tokens",
			minWidth: 16
		},
		...params.opts.verbose ? [{
			key: "Cache",
			header: "Cache",
			minWidth: 16,
			flex: true
		}] : []
	];
	const securityAuditLines = params.securityAudit ? buildStatusSecurityAuditLines({
		securityAudit: params.securityAudit,
		theme,
		shortenText,
		formatCliCommand
	}) : [theme.muted(`Skipped in fast status. Full report: ${formatCliCommand("openclaw security audit")}`), theme.muted(`Deep probe: ${formatCliCommand("openclaw status --deep")}`)];
	const retainedLost = params.summary.taskAuditRetainedLost;
	const retainedLostLine = (params.opts.deep || params.opts.verbose) && retainedLost && retainedLost.count > 0 ? theme.muted(`${retainedLost.count} lost task${retainedLost.count === 1 ? "" : "s"} retained until ${timestampMsToIsoString(retainedLost.nextCleanupAfter) ?? "cleanupAfter"}`) : null;
	return {
		heading: theme.heading,
		muted: theme.muted,
		renderTable,
		width: params.tableWidth,
		overviewRows,
		showTaskMaintenanceHint: params.summary.taskAudit.errors > 0,
		taskMaintenanceHint: `Task maintenance: ${formatCliCommand("openclaw tasks maintenance --apply")}`,
		taskRegistryMigrationHint: params.summary.tasks.warning ? theme.warn(params.summary.tasks.warning) : null,
		retainedLostTaskLine: retainedLostLine,
		pluginCompatibilityLines: buildStatusPluginCompatibilityLines({
			notices: params.pluginCompatibility,
			formatNotice: formatPluginCompatibilityNotice,
			warn: theme.warn,
			muted: theme.muted
		}),
		pairingRecoveryLines: buildStatusPairingRecoveryLines({
			pairingRecovery: params.pairingRecovery,
			warn: theme.warn,
			muted: theme.muted,
			formatCliCommand
		}),
		modelSelectionLines: buildStatusModelSelectionLines({
			recent: params.summary.sessions.recent,
			shortenText,
			warn: theme.warn,
			muted: theme.muted
		}),
		securityAuditLines,
		channelsColumns: statusChannelsTableColumns,
		channelsRows: buildStatusChannelsTableRows({
			rows: params.channels.rows,
			channelIssues: params.channelIssues,
			ok,
			warn,
			muted,
			accentDim: theme.accentDim,
			formatIssueMessage: (message) => shortenText(message, 84)
		}),
		sessionsColumns,
		sessionsRows: buildStatusSessionsRows({
			recent: params.summary.sessions.recent,
			verbose: params.opts.verbose,
			shortenText,
			formatTimeAgo,
			formatTokensCompact,
			formatPromptCacheCompact,
			muted
		}),
		systemEventsRows: buildStatusSystemEventsRows({ queuedSystemEvents: params.summary.queuedSystemEvents }),
		systemEventsTrailer: buildStatusSystemEventsTrailer({
			queuedSystemEvents: params.summary.queuedSystemEvents,
			muted
		}),
		healthColumns: params.health ? statusHealthColumns : void 0,
		healthRows: params.health ? buildStatusHealthRows({
			health: params.health,
			sqliteWal: params.summary.sqliteWal,
			formatHealthChannelLines,
			ok,
			warn,
			muted
		}) : void 0,
		usageLines: params.usageLines,
		footerLines: buildStatusFooterLines({
			updateHint: formatUpdateAvailableHint(params.surface.update),
			warn: theme.warn,
			formatCliCommand,
			nodeOnlyGateway: params.surface.nodeOnlyGateway,
			gatewayReachable: params.surface.gatewayReachable,
			gatewayStartupPhase: params.surface.gatewayProbe?.startupPhase
		})
	};
}
//#endregion
//#region src/commands/status.command-report.ts
/** Builds terminal lines for the standard status report. */
async function buildStatusCommandReportLines(params) {
	const lines = [];
	lines.push(params.heading("OpenClaw status"));
	const report = {
		lines,
		heading: params.heading,
		width: params.width,
		renderTable: params.renderTable
	};
	const overviewColumns = [...statusOverviewTableColumns];
	const overviewRows = params.overviewRows;
	const maintenanceLines = params.showTaskMaintenanceHint || params.taskRegistryMigrationHint || params.retainedLostTaskLine ? [
		"",
		...params.showTaskMaintenanceHint ? [params.muted(params.taskMaintenanceHint)] : [],
		...params.taskRegistryMigrationHint ? [params.taskRegistryMigrationHint] : [],
		...params.retainedLostTaskLine ? [params.retainedLostTaskLine] : []
	] : [];
	const pluginCompatibilityLines = params.pluginCompatibilityLines;
	const pairingRecoveryLines = params.pairingRecoveryLines.length > 0 ? ["", ...params.pairingRecoveryLines] : [];
	const modelSelectionLines = params.modelSelectionLines;
	const securityAuditLines = params.securityAuditLines;
	const channelsMessage = params.channelsRows.length === 0 ? params.muted("No channels configured") : void 0;
	const channelsColumns = channelsMessage === void 0 ? [...params.channelsColumns] : [];
	const channelsRows = channelsMessage === void 0 ? params.channelsRows : [];
	const sessionsMessage = params.sessionsRows.length === 0 ? params.muted("No sessions") : void 0;
	const sessionsColumns = sessionsMessage === void 0 ? [...params.sessionsColumns] : [];
	const sessionsRows = sessionsMessage === void 0 ? params.sessionsRows : [];
	const systemEventsColumns = [{
		key: "Event",
		header: "Event",
		flex: true,
		minWidth: 24
	}];
	const systemEventsRows = params.systemEventsRows ?? [];
	const systemEventsTrailer = params.systemEventsTrailer;
	const healthColumns = [...params.healthColumns ?? []];
	const healthRows = params.healthRows ?? [];
	const usageLines = params.usageLines ?? [];
	const footerLines = ["", ...params.footerLines];
	appendStatusReportTable(report, "Overview", overviewColumns, overviewRows);
	lines.push(...maintenanceLines);
	if (pluginCompatibilityLines.length > 0) appendStatusReportLines(report, "Plugin compatibility", pluginCompatibilityLines);
	lines.push(...pairingRecoveryLines);
	if (modelSelectionLines.length > 0) appendStatusReportLines(report, "Model selection", modelSelectionLines);
	appendStatusReportLines(report, "Security audit", securityAuditLines);
	if (channelsMessage !== void 0) appendStatusReportLines(report, "Channels", [channelsMessage]);
	else appendStatusReportTable(report, "Channels", channelsColumns, channelsRows);
	if (sessionsMessage !== void 0) appendStatusReportLines(report, "Sessions", [sessionsMessage]);
	else appendStatusReportTable(report, "Sessions", sessionsColumns, sessionsRows);
	if (systemEventsRows.length > 0) appendStatusReportTable(report, "System events", systemEventsColumns, systemEventsRows, systemEventsTrailer);
	if (healthRows.length > 0) appendStatusReportTable(report, "Health", healthColumns, healthRows);
	if (usageLines.length > 0) appendStatusReportLines(report, "Usage", usageLines);
	lines.push(...footerLines);
	return lines;
}
//#endregion
export { buildStatusCommandReportData, buildStatusCommandReportLines, buildStatusUpdateSurface, formatStatusConfigDiagnosticEntries, formatTimeAgo, formatUsageReportLines, getTerminalTableWidth, info, theme };
