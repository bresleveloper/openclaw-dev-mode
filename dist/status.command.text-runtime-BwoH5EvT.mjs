import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as info } from "./globals-BXbZ1A_g.mjs";
import { t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { t as formatUsageReportLines } from "./provider-usage.format-Cp0i6XBO.mjs";
import { n as shortenText } from "./text-format-DKwAItdz.mjs";
import { n as readBackupRunFreshness } from "./backup-run-records-BXl2ZzeJ.mjs";
import { t as formatUpdateAvailableHint } from "./status.update-B3BIlw-v.mjs";
import { r as buildStatusUpdateSurface } from "./format-DaR_VHQw.mjs";
import { r as formatStatusConfigDiagnosticEntries } from "./status.format-vDJygGtq.mjs";
import { _ as buildStatusSecurityAuditLines, b as buildStatusSystemEventsTrailer, c as buildStatusChannelsTableRows, d as buildStatusCommandOverviewRows, f as buildStatusFooterLines, g as buildStatusPluginCompatibilityLines, h as buildStatusPairingRecoveryLines, l as statusChannelsTableColumns, m as buildStatusModelSelectionLines, n as appendStatusReportLines, p as buildStatusHealthRows, r as appendStatusReportTable, s as statusOverviewTableColumns, v as buildStatusSessionsRows, x as statusHealthColumns, y as buildStatusSystemEventsRows } from "./text-report-bB5UBKCE.mjs";
//#region src/commands/status.command-report-data.ts
async function buildStatusCommandReportData(params) {
	const overviewRows = buildStatusCommandOverviewRows({
		...params,
		backupFreshness: await readBackupRunFreshness(params.env),
		osLabel: params.osSummary.label
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
	const securityAuditLines = params.securityAudit ? buildStatusSecurityAuditLines({ securityAudit: params.securityAudit }) : [theme.muted(`Skipped in fast status. Full report: ${formatCliCommand("openclaw security audit")}`), theme.muted(`Deep probe: ${formatCliCommand("openclaw status --deep")}`)];
	return {
		width: params.tableWidth,
		overviewRows,
		pluginCompatibilityLines: buildStatusPluginCompatibilityLines({ notices: params.pluginCompatibility }),
		pairingRecoveryLines: buildStatusPairingRecoveryLines({ pairingRecovery: params.pairingRecovery }),
		modelSelectionLines: buildStatusModelSelectionLines({ recent: params.summary.sessions.recent }),
		securityAuditLines,
		channelsColumns: statusChannelsTableColumns,
		channelsRows: buildStatusChannelsTableRows({
			rows: params.channels.rows,
			channelIssues: params.channelIssues,
			ok: theme.success,
			warn: theme.warn,
			muted: theme.muted,
			accentDim: theme.accentDim,
			formatIssueMessage: (message) => shortenText(message, 84)
		}),
		sessionsColumns,
		sessionsRows: buildStatusSessionsRows({
			recent: params.summary.sessions.recent,
			verbose: params.opts.verbose
		}),
		systemEventsRows: buildStatusSystemEventsRows({ queuedSystemEvents: params.summary.queuedSystemEvents }),
		systemEventsTrailer: buildStatusSystemEventsTrailer({ queuedSystemEvents: params.summary.queuedSystemEvents }),
		healthColumns: params.health ? statusHealthColumns : void 0,
		healthRows: params.health ? buildStatusHealthRows({
			health: params.health,
			sqliteWal: params.summary.sqliteWal
		}) : void 0,
		usageLines: params.usageLines,
		footerLines: buildStatusFooterLines({
			updateHint: formatUpdateAvailableHint(params.surface.update),
			nodeOnlyGateway: params.surface.nodeOnlyGateway,
			gatewayReachable: params.surface.gatewayReachable,
			gatewayStartupPhase: params.surface.gatewayProbe?.startupPhase
		})
	};
}
//#endregion
//#region src/commands/status.command-report.ts
async function buildStatusCommandReportLines(params) {
	const lines = [];
	lines.push(theme.heading("OpenClaw status"));
	const report = {
		lines,
		heading: theme.heading,
		width: params.width
	};
	const channelsMessage = params.channelsRows.length === 0 ? theme.muted("No channels configured") : void 0;
	const sessionsMessage = params.sessionsRows.length === 0 ? theme.muted("No sessions") : void 0;
	appendStatusReportTable(report, "Overview", [...statusOverviewTableColumns], params.overviewRows);
	if (params.pluginCompatibilityLines.length > 0) appendStatusReportLines(report, "Plugin compatibility", params.pluginCompatibilityLines);
	if (params.pairingRecoveryLines.length > 0) lines.push("", ...params.pairingRecoveryLines);
	if (params.modelSelectionLines.length > 0) appendStatusReportLines(report, "Model selection", params.modelSelectionLines);
	appendStatusReportLines(report, "Security audit", params.securityAuditLines);
	if (channelsMessage !== void 0) appendStatusReportLines(report, "Channels", [channelsMessage]);
	else appendStatusReportTable(report, "Channels", [...params.channelsColumns], params.channelsRows);
	if (sessionsMessage !== void 0) appendStatusReportLines(report, "Sessions", [sessionsMessage]);
	else appendStatusReportTable(report, "Sessions", [...params.sessionsColumns], params.sessionsRows);
	if (params.systemEventsRows?.length) appendStatusReportTable(report, "System events", [{
		key: "Event",
		header: "Event",
		flex: true,
		minWidth: 24
	}], params.systemEventsRows, params.systemEventsTrailer);
	if (params.healthRows?.length) appendStatusReportTable(report, "Health", [...params.healthColumns ?? []], params.healthRows);
	if (params.usageLines?.length) appendStatusReportLines(report, "Usage", params.usageLines);
	lines.push("", ...params.footerLines);
	return lines;
}
//#endregion
export { buildStatusCommandReportData, buildStatusCommandReportLines, buildStatusUpdateSurface, formatStatusConfigDiagnosticEntries, formatUsageReportLines, getTerminalTableWidth, info, theme };
