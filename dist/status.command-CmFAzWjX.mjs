import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { f as readConnectPairingRequiredMessage, l as normalizePairingConnectRequestId, p as readPairingConnectErrorDetails } from "./connect-error-details-DhaB57zU.mjs";
import { C as OPENCLAW_WRAPPER_ENV_KEY } from "./schtasks-Cm91eO2_.mjs";
import { g as readRestartSentinelReadOnly } from "./restart-sentinel-BPoW-ukG.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { t as collectNodeRuntimeFindings } from "./node-runtime-diagnostics-zqUVmxFt.mjs";
import { t as logGatewayConnectionDetails } from "./status.gateway-connection-DorgUvdO.mjs";
import { a as resolveStatusRuntimeSnapshot, c as resolveStatusUsageSummary, o as resolveStatusSecurityAudit, r as resolveStatusGatewayHealth, t as reportStatusScanFailure } from "./status-runtime-shared-CwX47JnZ.mjs";
import { t as createStatusGatewayProbeBudget } from "./status.gateway-probe-budget-DyNYY-tA.mjs";
import { t as buildStatusUpdateRows } from "./status-update-restart-DSS3uNaX.mjs";
import { n as runStatusJsonCommand, t as assertStatusUsageAgentScope } from "./status-json-command-C9w2GBcw.mjs";
//#region src/commands/status.command.ts
/** Extracts device-pairing recovery context from structured gateway errors or legacy message text. */
function resolvePairingRecoveryContext(params) {
	const structured = readPairingConnectErrorDetails(params.details);
	const pairing = structured ?? readConnectPairingRequiredMessage([params.error, params.closeReason].filter((part) => typeof part === "string" && part.trim().length > 0).join(" "));
	if (!pairing) return null;
	return {
		requestId: normalizePairingConnectRequestId(pairing.requestId) ?? null,
		reason: pairing.reason ?? null,
		remediationHint: structured?.remediationHint ? sanitizeTerminalText(structured.remediationHint) : null
	};
}
function resolveServiceWrapperContextHint(params) {
	const serviceWrapperPath = params.serviceWrapperPath?.trim();
	if (!serviceWrapperPath) return null;
	if (params.cliWrapperPath?.trim() === serviceWrapperPath) return null;
	return `The installed gateway service uses ${OPENCLAW_WRAPPER_ENV_KEY} (${sanitizeTerminalText(serviceWrapperPath)}), but this CLI process is not running with that same wrapper. Missing-secret diagnostics may describe the current CLI process rather than the installed gateway service context.`;
}
function withStatusProgress(label, resolve) {
	return (input) => withProgress({
		label,
		indeterminate: true,
		enabled: true
	}, () => resolve(input));
}
async function statusCommand(opts, runtime) {
	const probeBudget = createStatusGatewayProbeBudget(opts.timeoutMs);
	assertStatusUsageAgentScope(opts);
	for (const finding of await collectNodeRuntimeFindings()) (opts.json ? runtime.error : runtime.log)(`[${finding.severity}] ${finding.message}${finding.fixHint ? `\n${finding.fixHint}` : ""}`);
	if (opts.all && !opts.json) {
		await import("./status-all-BZG5dj7v.mjs").then(({ statusAllCommand }) => statusAllCommand(runtime, {
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
			runtime
		});
		return;
	}
	const scan = await import("./status.scan-B7Y2MJMy.mjs").then(({ scanStatus }) => scanStatus({
		...probeBudget,
		deep: opts.deep
	})).catch((error) => reportStatusScanFailure(error, runtime, opts.timeoutMs));
	const { cfg, update, gatewayProbe, gatewayReachable, configDiagnostics, secretDiagnostics, env } = scan;
	if (configDiagnostics) {
		const { formatStatusConfigDiagnosticEntries, theme } = await import("./status.command.text-runtime-zPGiqKL4.mjs");
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
		resolveSecurityAudit: withStatusProgress("Running security audit…", resolveStatusSecurityAudit),
		resolveUsage: withStatusProgress("Fetching usage snapshot…", resolveStatusUsageSummary),
		resolveHealth: withStatusProgress("Checking gateway health…", resolveStatusGatewayHealth)
	});
	if (health && "error" in health) throw new Error(health.error);
	const { buildStatusCommandReportData, buildStatusCommandReportLines, buildStatusUpdateSurface, formatUsageReportLines, getTerminalTableWidth, info, theme } = await import("./status.command.text-runtime-zPGiqKL4.mjs");
	const { muted, success: ok, warn } = theme;
	const updateSurface = buildStatusUpdateSurface({
		updateConfigChannel: cfg.update?.channel,
		update
	});
	if (opts.verbose) {
		const { buildGatewayConnectionDetails } = await import("./call-BvbeEASg.mjs");
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
	const nodeOnlyGateway = await import("./status.node-mode-QDv3awtH.mjs").then(({ resolveNodeOnlyGatewayInfo }) => resolveNodeOnlyGatewayInfo({
		daemon,
		node: nodeDaemon
	}));
	const pairingRecovery = resolvePairingRecoveryContext({
		error: gatewayProbe?.error ?? null,
		closeReason: gatewayProbe?.close?.reason ?? null,
		details: gatewayProbe?.connectErrorDetails
	});
	const usageLines = usage ? formatUsageReportLines(usage) : void 0;
	const overviewSurface = {
		...scan,
		gatewayService: daemon,
		nodeService: nodeDaemon,
		nodeOnlyGateway
	};
	const updateRows = await buildStatusUpdateRows((await readRestartSentinelReadOnly().catch(() => null))?.payload, {
		ok,
		warn,
		muted,
		localGatewayHealthy: scan.localGatewayHealthy,
		gatewayServer: gatewayProbe?.server
	});
	const lines = await buildStatusCommandReportLines(await buildStatusCommandReportData({
		...scan,
		env: env ?? {},
		opts,
		surface: overviewSurface,
		securityAudit,
		health,
		usageLines,
		lastHeartbeat,
		pairingRecovery,
		tableWidth,
		updateValue: updateSurface.updateAvailable ? warn(`available · ${updateSurface.updateLine}`) : updateSurface.updateLine,
		updateRows
	}));
	runtime.log(lines.join("\n"));
}
//#endregion
export { statusCommand as t };
