import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as inspectGatewayServiceInstallationDrift, s as summarizeGatewayServiceLayout } from "./service-layout-DuzmQnH1.mjs";
import "./program-args-Pr-IOsMq.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-BCULlL85.mjs";
import { a as formatServiceLabel } from "./runtime-hints-DEzqKgi3.mjs";
import { a as formatGatewayServiceInstallationDrift } from "./shared-Ba-Zp0iU.mjs";
import { t as resolveNodeService } from "./node-service-C4fy4gdx.mjs";
import { t as formatDaemonRuntimeShort } from "./status.format-8PiDIM9o.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-DkP8SzQT.mjs";
//#region src/commands/status.service-summary.ts
function normalizeServiceWrapperPath(command) {
	return command?.environment?.["OPENCLAW_WRAPPER"]?.trim() || void 0;
}
/** Reads a daemon service summary, falling back to unknown when service inspection fails. */
async function readServiceStatusSummary(service, fallbackLabel, timeoutMs, activePackageRoot) {
	try {
		const state = await readGatewayServiceState(service, {
			env: process.env,
			timeoutMs
		});
		const layout = await summarizeGatewayServiceLayout(state.command).catch(() => void 0);
		const installationDrift = activePackageRoot ? await inspectGatewayServiceInstallationDrift(layout, activePackageRoot).catch(() => void 0) : void 0;
		const wrapperPath = normalizeServiceWrapperPath(state.command);
		const managedByOpenClaw = state.installed;
		const externallyManaged = !managedByOpenClaw && state.running;
		const installed = managedByOpenClaw || externallyManaged;
		const loadedText = externallyManaged ? "running (externally managed)" : state.loadState.status === "loaded" ? service.loadedText : state.loadState.status === "not-loaded" ? service.notLoadedText : "unknown";
		return {
			label: formatServiceLabel(service.label, state.runtime),
			installed,
			loadState: state.loadState,
			managedByOpenClaw,
			externallyManaged,
			loadedText,
			runtime: state.runtime,
			...layout ? { layout } : {},
			...wrapperPath ? { wrapperPath } : {},
			...installationDrift ? { installationDrift: formatGatewayServiceInstallationDrift(installationDrift, void 0, state.env) } : {}
		};
	} catch (error) {
		return {
			label: fallbackLabel,
			installed: null,
			loadState: {
				status: "unknown",
				detail: String(error)
			},
			managedByOpenClaw: false,
			externallyManaged: false,
			loadedText: "unknown",
			runtime: void 0
		};
	}
}
//#endregion
//#region src/commands/status.daemon.ts
async function buildDaemonStatusSummary(serviceLabel, timeoutMs) {
	const summary = await readServiceStatusSummary(serviceLabel === "gateway" ? resolveGatewayService() : resolveNodeService(), serviceLabel === "gateway" ? "Daemon" : "Node", timeoutMs, (serviceLabel === "gateway" ? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	}) : null) ?? void 0);
	const runtime = summary.runtime?.inspectionFailure ? {
		...summary.runtime,
		detail: `${summary.runtime.detail}; retry with openclaw status --deep`
	} : summary.runtime;
	const loaded = summary.loadState.status === "unknown" ? null : summary.loadState.status === "loaded";
	return {
		...summary,
		loaded,
		runtime,
		runtimeShort: formatDaemonRuntimeShort(runtime)
	};
}
/** Returns the gateway daemon status summary. */
async function getDaemonStatusSummary(timeoutMs) {
	return await buildDaemonStatusSummary("gateway", timeoutMs);
}
/** Returns the node service status summary. */
async function getNodeDaemonStatusSummary(timeoutMs) {
	return await buildDaemonStatusSummary("node", timeoutMs);
}
//#endregion
//#region src/commands/status-runtime-shared.ts
const statusUsageModuleLoader = createLazyImportLoader(() => import("./status-usage.runtime.js"));
const securityAuditModuleLoader = createLazyImportLoader(() => import("./audit.runtime.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-bfuNQIMk.mjs"));
/** Runs the lightweight security audit used by status JSON/all output. */
async function resolveStatusSecurityAudit(params) {
	const { runSecurityAudit } = await securityAuditModuleLoader.load();
	return await runSecurityAudit({
		config: params.config,
		sourceConfig: params.sourceConfig,
		deep: false,
		...params.timeoutMs !== void 0 ? { deepTimeoutMs: params.timeoutMs } : {},
		includeFilesystem: true,
		includeChannelSecurity: true,
		loadPluginSecurityCollectors: false
	});
}
/** Loads optional usage and its credential resolver only when requested. */
async function resolveStatusUsageSummary(params) {
	return (await statusUsageModuleLoader.load()).resolveStatusUsageSummary(params);
}
/** Calls gateway health and lets errors propagate to deep status callers. */
async function resolveStatusGatewayHealth(params) {
	const { callGateway } = await gatewayCallModuleLoader.load();
	const timeoutMs = resolveStatusGatewayProbeTimeoutMs(params);
	if (timeoutMs === 0) throw new Error("Gateway probe budget exhausted before health check.");
	return await callGateway({
		method: "health",
		params: { probe: true },
		timeoutMs,
		config: params.config
	});
}
/** Calls gateway health but converts unreachable/failing probes into an error object. */
async function resolveStatusGatewayHealthSafe(params) {
	if (!params.gatewayReachable) return { error: params.gatewayProbeError ?? "gateway unreachable" };
	const { callGateway } = await gatewayCallModuleLoader.load();
	const timeoutMs = resolveStatusGatewayProbeTimeoutMs(params);
	if (timeoutMs === 0) return { error: "Gateway probe budget exhausted before health check." };
	return await callGateway({
		method: "health",
		params: { probe: true },
		timeoutMs,
		config: params.config,
		...params.callOverrides
	}).catch((err) => ({ error: String(err) }));
}
/** Reads gateway diagnostics while preserving whether data or an unavailable outcome was observed. */
async function resolveStatusGatewayDiagnosticsSafe(params) {
	if (!params.gatewayReachable) return {
		ok: false,
		error: "gateway unreachable"
	};
	const { callGateway } = await gatewayCallModuleLoader.load();
	const timeoutMs = resolveStatusGatewayProbeTimeoutMs(params);
	if (timeoutMs === 0) return {
		ok: false,
		error: "Gateway probe budget exhausted before diagnostics."
	};
	return await callGateway({
		method: "diagnostics.stability",
		params: {
			limit: 1e3,
			...params.type ? { type: params.type } : {}
		},
		timeoutMs,
		config: params.config,
		...params.callOverrides
	}).then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error: String(error)
	}));
}
/** Reads the most recent gateway heartbeat only when the gateway probe succeeded. */
async function resolveStatusLastHeartbeat(params) {
	if (!params.gatewayReachable) return null;
	const { callGateway } = await gatewayCallModuleLoader.load();
	const timeoutMs = resolveStatusGatewayProbeTimeoutMs(params);
	if (timeoutMs === 0) return null;
	return await callGateway({
		method: "last-heartbeat",
		params: {},
		timeoutMs,
		config: params.config
	}).catch(() => null);
}
const DEFAULT_SERVICE_PROBE_TIMEOUT_MS = 5e3;
/** Preserve independent service diagnostics when local status collection refuses state. */
async function reportStatusScanFailure(error, runtime, timeoutMs) {
	try {
		const { installationDrift } = await getDaemonStatusSummary(timeoutMs ?? DEFAULT_SERVICE_PROBE_TIMEOUT_MS);
		if (installationDrift) runtime.error(sanitizeTerminalText(installationDrift));
	} catch {}
	throw error;
}
/** Resolves launchd/systemd summaries for the gateway and node services together. */
async function resolveStatusServiceSummaries(timeoutMs) {
	const probeTimeoutMs = timeoutMs ?? DEFAULT_SERVICE_PROBE_TIMEOUT_MS;
	return await Promise.all([getDaemonStatusSummary(probeTimeoutMs), getNodeDaemonStatusSummary(probeTimeoutMs)]);
}
/** Resolves optional usage/deep runtime details plus service summaries for status output. */
async function resolveStatusRuntimeDetails(params) {
	const resolveUsageSummary = params.resolveUsage ?? resolveStatusUsageSummary;
	const resolveGatewayHealthSummary = params.resolveHealth ?? resolveStatusGatewayHealth;
	const usage = params.usage ? await resolveUsageSummary({
		timeoutMs: resolveStatusGatewayProbeTimeoutMs(params),
		gatewayProbeDeadlineMs: params.gatewayProbeDeadlineMs,
		config: params.config,
		...params.agentId ? { agentId: params.agentId } : {}
	}) : void 0;
	const health = params.deep && !params.gatewayStartupPhase ? !params.gatewayReachable ? { error: params.gatewayProbeError ?? "Gateway is unreachable" } : params.suppressHealthErrors ? await resolveGatewayHealthSummary({
		config: params.config,
		timeoutMs: params.timeoutMs,
		gatewayProbeDeadlineMs: params.gatewayProbeDeadlineMs
	}).catch((error) => ({ error: String(error) })) : await resolveGatewayHealthSummary({
		config: params.config,
		timeoutMs: params.timeoutMs,
		gatewayProbeDeadlineMs: params.gatewayProbeDeadlineMs
	}) : void 0;
	const lastHeartbeat = params.deep && !params.gatewayStartupPhase ? await resolveStatusLastHeartbeat({
		config: params.config,
		timeoutMs: params.timeoutMs,
		gatewayProbeDeadlineMs: params.gatewayProbeDeadlineMs,
		gatewayReachable: params.gatewayReachable
	}) : null;
	const [gatewayService, nodeService] = await resolveStatusServiceSummaries(params.timeoutMs);
	return {
		usage,
		health,
		lastHeartbeat,
		gatewayService,
		nodeService
	};
}
/** Resolves the full runtime snapshot, including optional security audit, for status JSON/text. */
async function resolveStatusRuntimeSnapshot(params) {
	return {
		securityAudit: params.includeSecurityAudit ? await (params.resolveSecurityAudit ?? resolveStatusSecurityAudit)({
			config: params.config,
			sourceConfig: params.sourceConfig,
			timeoutMs: params.timeoutMs
		}) : void 0,
		...await resolveStatusRuntimeDetails({
			config: params.config,
			timeoutMs: params.timeoutMs,
			gatewayProbeDeadlineMs: params.gatewayProbeDeadlineMs,
			...params.agentId ? { agentId: params.agentId } : {},
			usage: params.usage,
			deep: params.deep,
			gatewayReachable: params.gatewayReachable,
			gatewayStartupPhase: params.gatewayStartupPhase,
			gatewayProbeError: params.gatewayProbeError,
			suppressHealthErrors: params.suppressHealthErrors,
			resolveUsage: params.resolveUsage,
			resolveHealth: params.resolveHealth
		})
	};
}
//#endregion
export { resolveStatusRuntimeSnapshot as a, resolveStatusUsageSummary as c, resolveStatusGatewayHealthSafe as i, resolveStatusGatewayDiagnosticsSafe as n, resolveStatusSecurityAudit as o, resolveStatusGatewayHealth as r, resolveStatusServiceSummaries as s, reportStatusScanFailure as t };
