import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { g as readRestartSentinelReadOnly } from "./restart-sentinel-CWHFSDjo.mjs";
import { x as OPENCLAW_WRAPPER_ENV_KEY } from "./schtasks-BZ33FXAo.mjs";
import { f as readConnectPairingRequiredMessage, l as normalizePairingConnectRequestId, p as readPairingConnectErrorDetails } from "./connect-error-details-q_NaMExM.mjs";
import { r as withProgress } from "./progress-UTM8yfZa.mjs";
import { t as collectNodeRuntimeFindings } from "./node-runtime-diagnostics-yzIhwSa8.mjs";
import { t as logGatewayConnectionDetails } from "./status.gateway-connection-CSdcTL3Z.mjs";
import { a as resolveStatusRuntimeSnapshot, c as resolveStatusUsageSummary, o as resolveStatusSecurityAudit, r as resolveStatusGatewayHealth, t as reportStatusScanFailure, u as buildStatusOverviewSurfaceFromScan } from "./status-runtime-shared-QlMOhK9Q.mjs";
import { t as createStatusGatewayProbeBudget } from "./status.gateway-probe-budget-CGuGR8Uw.mjs";
import { t as buildStatusUpdateRows } from "./status-update-restart-7GONVQm2.mjs";
import { n as runStatusJsonCommand, t as assertStatusUsageAgentScope } from "./status-json-command-C1_TmBLo.mjs";
//#region src/commands/status.command.ts
const statusScanModuleLoader = createLazyImportLoader(() => import("./status.scan-CeQ-wmqX.mjs"));
const statusScanFastJsonModuleLoader = createLazyImportLoader(() => import("./status.scan.fast-json-DGb_k4Cy.mjs"));
const statusAllModuleLoader = createLazyImportLoader(() => import("./status-all-DSkJHU_V.mjs"));
const statusCommandTextRuntimeLoader = createLazyImportLoader(() => import("./status.command.text-runtime-BwoH5EvT.mjs"));
const statusNodeModeModuleLoader = createLazyImportLoader(() => import("./status.node-mode-CaV7Jj_4.mjs"));
/** Extracts device-pairing recovery context from structured gateway errors or legacy message text. */
function resolvePairingRecoveryContext(params) {
	const structured = readPairingConnectErrorDetails(params.details);
	if (structured) return {
		requestId: normalizePairingConnectRequestId(structured.requestId) ?? null,
		reason: structured.reason ?? null,
		remediationHint: structured.remediationHint ? sanitizeTerminalText(structured.remediationHint) : null
	};
	const source = [params.error, params.closeReason].filter((part) => typeof part === "string" && part.trim().length > 0).join(" ");
	const pairing = readConnectPairingRequiredMessage(source);
	if (!pairing) return null;
	return {
		requestId: normalizePairingConnectRequestId(pairing.requestId) ?? null,
		reason: pairing.reason ?? null,
		remediationHint: null
	};
}
function resolveServiceWrapperContextHint(params) {
	const serviceWrapperPath = params.serviceWrapperPath?.trim();
	if (!serviceWrapperPath) return null;
	if (params.cliWrapperPath?.trim() === serviceWrapperPath) return null;
	return `The installed gateway service uses ${OPENCLAW_WRAPPER_ENV_KEY} (${sanitizeTerminalText(serviceWrapperPath)}), but this CLI process is not running with that same wrapper. Missing-secret diagnostics may describe the current CLI process rather than the installed gateway service context.`;
}
async function statusCommand(opts, runtime) {
	const probeBudget = createStatusGatewayProbeBudget(opts.timeoutMs);
	assertStatusUsageAgentScope(opts);
	for (const finding of await collectNodeRuntimeFindings()) (opts.json ? runtime.error : runtime.log)(`[${finding.severity}] ${finding.message}${finding.fixHint ? `\n${finding.fixHint}` : ""}`);
	if (opts.all && !opts.json) {
		await statusAllModuleLoader.load().then(({ statusAllCommand }) => statusAllCommand(runtime, {
			...opts,
			...probeBudget
		}));
		return;
	}
	if (opts.json) {
		await runStatusJsonCommand({
			opts: {
				...opts,
				...probeBudget
			},
			runtime,
			includeSecurityAudit: opts.all === true || opts.deep === true,
			includePluginCompatibility: opts.all === true,
			suppressHealthErrors: true,
			scanStatusJsonFast: async (scanOpts, runtimeForScan) => await statusScanFastJsonModuleLoader.load().then(({ scanStatusJsonFast }) => scanStatusJsonFast(scanOpts, runtimeForScan))
		});
		return;
	}
	const scan = await statusScanModuleLoader.load().then(({ scanStatus }) => scanStatus({
		...probeBudget,
		deep: opts.deep
	})).catch((error) => reportStatusScanFailure(error, runtime, opts.timeoutMs));
	const { cfg, osSummary, update, gatewayProbe, gatewayReachable, channelIssues, agentStatus, channels, summary, configDiagnostics, secretDiagnostics, memory, memoryPlugin, pluginCompatibility, env } = scan;
	if (configDiagnostics) {
		const { formatStatusConfigDiagnosticEntries, theme } = await statusCommandTextRuntimeLoader.load();
		runtime.log(theme.warn("Config diagnostics:"));
		for (const entry of formatStatusConfigDiagnosticEntries(configDiagnostics)) runtime.log(entry);
		runtime.log("");
	}
	const { securityAudit, usage, health, lastHeartbeat, gatewayService: daemon, nodeService: nodeDaemon } = await resolveStatusRuntimeSnapshot({
		config: scan.cfg,
		sourceConfig: scan.sourceConfig,
		...probeBudget,
		...opts.agent ? { agentId: opts.agent } : {},
		usage: opts.usage,
		deep: opts.deep,
		gatewayReachable,
		...gatewayProbe?.startupPhase ? { gatewayStartupPhase: gatewayProbe.startupPhase } : {},
		...gatewayProbe?.error ? { gatewayProbeError: gatewayProbe.error } : {},
		includeSecurityAudit: opts.all === true || opts.deep === true,
		resolveSecurityAudit: async (input) => await withProgress({
			label: "Running security audit…",
			indeterminate: true,
			enabled: true
		}, async () => await resolveStatusSecurityAudit(input)),
		resolveUsage: async (input) => await withProgress({
			label: "Fetching usage snapshot…",
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => await resolveStatusUsageSummary(input)),
		resolveHealth: async (input) => await withProgress({
			label: "Checking gateway health…",
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => await resolveStatusGatewayHealth(input))
	});
	if (health && "error" in health) throw new Error(health.error);
	const { buildStatusCommandReportData, buildStatusCommandReportLines, buildStatusUpdateSurface, formatUsageReportLines, getTerminalTableWidth, info, theme } = await statusCommandTextRuntimeLoader.load();
	const { muted, success: ok, warn } = theme;
	const updateSurface = buildStatusUpdateSurface({
		updateConfigChannel: cfg.update?.channel,
		update
	});
	if (opts.verbose) {
		const { buildGatewayConnectionDetails } = await import("./call-CWvmXO5x.mjs");
		const details = buildGatewayConnectionDetails({ config: scan.cfg });
		logGatewayConnectionDetails({
			runtime,
			info,
			message: details.message,
			trailingBlankLine: true
		});
	}
	const tableWidth = getTerminalTableWidth();
	if (secretDiagnostics.length > 0) {
		runtime.log(theme.warn("Secret diagnostics:"));
		for (const entry of secretDiagnostics) runtime.log(`- ${entry}`);
		const wrapperContextHint = resolveServiceWrapperContextHint({
			serviceWrapperPath: daemon.wrapperPath,
			cliWrapperPath: process.env[OPENCLAW_WRAPPER_ENV_KEY]
		});
		if (wrapperContextHint) runtime.log(theme.warn(wrapperContextHint));
		runtime.log("");
	}
	const nodeOnlyGateway = await statusNodeModeModuleLoader.load().then(({ resolveNodeOnlyGatewayInfo }) => resolveNodeOnlyGatewayInfo({
		daemon,
		node: nodeDaemon
	}));
	const pairingRecovery = resolvePairingRecoveryContext({
		error: gatewayProbe?.error ?? null,
		closeReason: gatewayProbe?.close?.reason ?? null,
		details: gatewayProbe?.connectErrorDetails
	});
	const usageLines = usage ? formatUsageReportLines(usage) : void 0;
	const overviewSurface = buildStatusOverviewSurfaceFromScan({
		scan,
		gatewayService: daemon,
		nodeService: nodeDaemon,
		nodeOnlyGateway
	});
	const updateRows = await buildStatusUpdateRows((await readRestartSentinelReadOnly().catch(() => null))?.payload, {
		ok,
		warn,
		muted,
		localGatewayHealthy: scan.localGatewayHealthy,
		gatewayServer: gatewayProbe?.server
	});
	const lines = await buildStatusCommandReportLines(await buildStatusCommandReportData({
		env: env ?? {},
		opts,
		surface: overviewSurface,
		osSummary,
		summary,
		securityAudit,
		health,
		usageLines,
		lastHeartbeat,
		agentStatus,
		channels,
		channelIssues,
		memory,
		memoryPlugin,
		pluginCompatibility,
		pairingRecovery,
		tableWidth,
		updateValue: updateSurface.updateAvailable ? warn(`available · ${updateSurface.updateLine}`) : updateSurface.updateLine,
		updateRows
	}));
	runtime.log(lines.join("\n"));
}
//#endregion
export { statusCommand as t };
