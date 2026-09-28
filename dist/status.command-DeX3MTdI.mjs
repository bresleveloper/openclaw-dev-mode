import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-Pr-IOsMq.mjs";
import { g as readRestartSentinelReadOnly } from "./restart-sentinel-KM6PPxhT.mjs";
import { f as readConnectPairingRequiredMessage, l as normalizePairingConnectRequestId, p as readPairingConnectErrorDetails } from "./connect-error-details-HKRZ1hRc.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { t as collectNodeRuntimeFindings } from "./node-runtime-diagnostics-BUi_YN6x.mjs";
import { t as logGatewayConnectionDetails } from "./status.gateway-connection-1c0sRw1k.mjs";
import { l as buildStatusOverviewSurfaceFromScan } from "./status.format-514H1-f-.mjs";
import { a as resolveStatusRuntimeSnapshot, c as resolveStatusUsageSummary, o as resolveStatusSecurityAudit, r as resolveStatusGatewayHealth, t as reportStatusScanFailure } from "./status-runtime-shared-BTXqM8_0.mjs";
import { t as createStatusGatewayProbeBudget } from "./status.gateway-probe-budget-DkP8SzQT.mjs";
import { t as buildStatusUpdateRows } from "./status-update-restart-CoDicJLe.mjs";
import { n as runStatusJsonCommand, t as assertStatusUsageAgentScope } from "./status-json-command-Ccqm698E.mjs";
//#region src/commands/status.command.ts
const statusScanModuleLoader = createLazyImportLoader(() => import("./status.scan-o_CsZmEJ.mjs"));
const statusScanFastJsonModuleLoader = createLazyImportLoader(() => import("./status.scan.fast-json-DYq-Ux73.mjs"));
const statusAllModuleLoader = createLazyImportLoader(() => import("./status-all-BhqU3hT_.mjs"));
const statusCommandTextRuntimeLoader = createLazyImportLoader(() => import("./status.command.text-runtime-s_oQd9Tb.mjs"));
const statusNodeModeModuleLoader = createLazyImportLoader(() => import("./status.node-mode-DGzbytW6.mjs"));
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
function normalizeStatusWrapperPath(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}
function resolveServiceWrapperContextHint(params) {
	const serviceWrapperPath = normalizeStatusWrapperPath(params.serviceWrapperPath);
	if (!serviceWrapperPath) return null;
	if (normalizeStatusWrapperPath(params.cliWrapperPath) === serviceWrapperPath) return null;
	return `The installed gateway service uses ${OPENCLAW_WRAPPER_ENV_KEY} (${sanitizeTerminalText(serviceWrapperPath)}), but this CLI process is not running with that same wrapper. Missing-secret diagnostics may describe the current CLI process rather than the installed gateway service context.`;
}
/** Runs `openclaw status`, including JSON/all routing and optional deep probes. */
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
	const { cfg, osSummary, tailscaleMode, tailscaleDns, tailscaleHttpsUrl, advertisedControlUiLinks, update, gatewayConnection, remoteUrlMissing, gatewayMode, gatewayProbeAuth, gatewayProbeAuthWarning, gatewayProbe, gatewayReachable, gatewaySelf, channelIssues, agentStatus, channels, summary, configDiagnostics, secretDiagnostics, memory, memoryPlugin, pluginCompatibility, env } = scan;
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
	const muted = (value) => theme.muted(value);
	const ok = (value) => theme.success(value);
	const warn = (value) => theme.warn(value);
	const updateSurface = buildStatusUpdateSurface({
		updateConfigChannel: cfg.update?.channel,
		update
	});
	if (opts.verbose) {
		const { buildGatewayConnectionDetails } = await import("./call-bfuNQIMk.mjs");
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
		scan: {
			cfg,
			update,
			tailscaleMode,
			tailscaleDns,
			tailscaleHttpsUrl,
			...advertisedControlUiLinks ? { advertisedControlUiLinks } : {},
			gatewayMode,
			remoteUrlMissing,
			gatewayConnection,
			gatewayReachable,
			gatewayProbe,
			gatewayProbeAuth,
			gatewayProbeAuthWarning,
			gatewaySelf
		},
		gatewayService: daemon,
		nodeService: nodeDaemon,
		nodeOnlyGateway
	});
	const updateRows = buildStatusUpdateRows((await readRestartSentinelReadOnly().catch(() => null))?.payload, {
		ok,
		warn,
		muted
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
