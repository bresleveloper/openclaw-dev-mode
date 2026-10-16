import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { n as formatServiceLabel } from "./runtime-format-C0Herh-B.mjs";
import { a as formatGatewayServiceInstallationDrift } from "./shared-DejcqFfy.mjs";
import "./schtasks-BZ33FXAo.mjs";
import { c as summarizeGatewayServiceLayout, r as inspectGatewayServiceInstallationDrift } from "./service-layout-BNLNn9Ng.mjs";
import { i as readGatewayServiceState, n as resolveGatewayService } from "./service-CCUynFdj.mjs";
import { t as resolveNodeService } from "./node-service-BKoIe3O1.mjs";
import { t as formatDaemonRuntimeShort } from "./status.format-vDJygGtq.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-CGuGR8Uw.mjs";
//#region src/commands/status-overview-surface.ts
/** Converts the full status scan result into the shared overview surface. */
function buildStatusOverviewSurfaceFromScan(params) {
	return {
		cfg: params.scan.cfg,
		update: params.scan.update,
		tailscaleMode: params.scan.tailscaleMode,
		tailscaleDns: params.scan.tailscaleDns,
		tailscaleHttpsUrl: params.scan.tailscaleHttpsUrl,
		...params.scan.advertisedControlUiLinks ? { advertisedControlUiLinks: params.scan.advertisedControlUiLinks } : {},
		gatewayMode: params.scan.gatewayMode,
		remoteUrlMissing: params.scan.remoteUrlMissing,
		gatewayConnection: params.scan.gatewayConnection,
		gatewayReachable: params.scan.gatewayReachable,
		gatewayProbe: params.scan.gatewayProbe,
		gatewayProbeAuth: params.scan.gatewayProbeAuth,
		gatewayProbeAuthWarning: params.scan.gatewayProbeAuthWarning,
		gatewaySelf: params.scan.gatewaySelf,
		gatewayService: params.gatewayService,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway
	};
}
/** Converts the lighter status-all overview scan into the shared overview surface. */
function buildStatusOverviewSurfaceFromOverview(params) {
	return buildStatusOverviewSurfaceFromScan({
		scan: {
			...params.overview,
			...params.overview.gatewaySnapshot
		},
		gatewayService: params.gatewayService,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway
	});
}
//#endregion
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
async function getDaemonStatusSummary(timeoutMs) {
	return await buildDaemonStatusSummary("gateway", timeoutMs);
}
async function getNodeDaemonStatusSummary(timeoutMs) {
	return await buildDaemonStatusSummary("node", timeoutMs);
}
//#endregion
//#region src/commands/status-runtime-shared.ts
const statusUsageModuleLoader = createLazyImportLoader(() => import("./status-usage.runtime.js"));
const securityAuditModuleLoader = createLazyImportLoader(() => import("./audit.runtime.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-CWvmXO5x.mjs"));
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
async function resolveStatusRuntimeSnapshot(params) {
	const securityAudit = params.includeSecurityAudit ? await (params.resolveSecurityAudit ?? resolveStatusSecurityAudit)({
		config: params.config,
		sourceConfig: params.sourceConfig,
		timeoutMs: params.timeoutMs
	}) : void 0;
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
		securityAudit,
		usage,
		health,
		lastHeartbeat,
		gatewayService,
		nodeService
	};
}
//#endregion
export { resolveStatusRuntimeSnapshot as a, resolveStatusUsageSummary as c, resolveStatusGatewayHealthSafe as i, buildStatusOverviewSurfaceFromOverview as l, resolveStatusGatewayDiagnosticsSafe as n, resolveStatusSecurityAudit as o, resolveStatusGatewayHealth as r, resolveStatusServiceSummaries as s, reportStatusScanFailure as t, buildStatusOverviewSurfaceFromScan as u };
