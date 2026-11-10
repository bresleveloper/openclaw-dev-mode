import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { c as summarizeGatewayServiceLayout, r as inspectGatewayServiceInstallationDrift } from "./service-layout-DcU2-cAg.mjs";
import { C as OPENCLAW_WRAPPER_ENV_KEY } from "./schtasks-Cm91eO2_.mjs";
import { n as formatServiceLabel } from "./runtime-format-BBnSbkJD.mjs";
import { a as formatGatewayServiceInstallationDrift } from "./shared-BiNxJvE7.mjs";
import { n as resolveGatewayService, s as readGatewayServiceState } from "./service-CCmqtriJ.mjs";
import { t as resolveNodeService } from "./node-service-BRYuh5C5.mjs";
import { t as formatDaemonRuntimeShort } from "./status.format-Ck3YNhmg.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-DyNYY-tA.mjs";
//#region src/commands/status.service-summary.ts
/** Reads a daemon service summary, falling back to unknown when service inspection fails. */
async function readServiceStatusSummary(service, fallbackLabel, timeoutMs, activePackageRoot) {
	try {
		const state = await readGatewayServiceState(service, {
			env: process.env,
			timeoutMs
		});
		const layout = await summarizeGatewayServiceLayout(state.command).catch(() => void 0);
		const installationDrift = activePackageRoot ? await inspectGatewayServiceInstallationDrift(layout, activePackageRoot).catch(() => void 0) : void 0;
		const wrapperPath = state.command?.environment?.[OPENCLAW_WRAPPER_ENV_KEY]?.trim();
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
/** Runs the lightweight security audit used by status JSON/all output. */
async function resolveStatusSecurityAudit(params) {
	const { runSecurityAudit } = await import("./audit.runtime.js");
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
	return (await import("./status-usage.runtime.js")).resolveStatusUsageSummary(params);
}
async function queryStatusGateway(params, buildRequest) {
	const { callGateway } = await import("./call-BvbeEASg.mjs");
	const timeoutMs = resolveStatusGatewayProbeTimeoutMs(params);
	if (timeoutMs === 0) return {
		ok: false,
		error: { kind: "budget" }
	};
	return await callGateway({
		...buildRequest(),
		timeoutMs,
		config: params.config,
		...params.callOverrides
	}).then((value) => ({
		ok: true,
		value
	}), (cause) => ({
		ok: false,
		error: {
			kind: "request",
			cause
		}
	}));
}
function formatStatusGatewayFailure(error, operation) {
	return error.kind === "budget" ? `Gateway check budget exhausted before ${operation}.` : String(error.cause);
}
/** Calls gateway health and lets errors propagate to deep status callers. */
async function resolveStatusGatewayHealth(params) {
	const result = await queryStatusGateway(params, () => ({
		method: "health",
		params: { probe: true }
	}));
	if (!result.ok) throw result.error.kind === "request" ? result.error.cause : new Error(formatStatusGatewayFailure(result.error, "health check"));
	return result.value;
}
/** Calls gateway health but converts unreachable/failing probes into an error object. */
async function resolveStatusGatewayHealthSafe(params) {
	if (!params.gatewayReachable) return { error: params.gatewayProbeError ?? "gateway unreachable" };
	const result = await queryStatusGateway(params, () => ({
		method: "health",
		params: { probe: true }
	}));
	return result.ok ? result.value : { error: formatStatusGatewayFailure(result.error, "health check") };
}
/** Reads gateway diagnostics while preserving whether data or an unavailable outcome was observed. */
async function resolveStatusGatewayDiagnosticsSafe(params) {
	if (!params.gatewayReachable) return {
		ok: false,
		error: "gateway unreachable"
	};
	const result = await queryStatusGateway(params, () => ({
		method: "diagnostics.stability",
		params: {
			limit: 1e3,
			...params.type ? { type: params.type } : {}
		}
	}));
	return result.ok ? result : {
		ok: false,
		error: formatStatusGatewayFailure(result.error, "diagnostics")
	};
}
/** Reads the most recent gateway heartbeat only when the gateway probe succeeded. */
async function resolveStatusLastHeartbeat(params) {
	if (!params.gatewayReachable) return null;
	const result = await queryStatusGateway(params, () => ({
		method: "last-heartbeat",
		params: {}
	}));
	return result.ok ? result.value : null;
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
	const health = params.deep && !params.gatewayStartupPhase ? !params.gatewayReachable ? { error: params.gatewayProbeError ?? "Gateway is unreachable" } : await resolveGatewayHealthSummary({
		config: params.config,
		timeoutMs: params.timeoutMs,
		gatewayProbeDeadlineMs: params.gatewayProbeDeadlineMs
	}).catch(params.suppressHealthErrors ? (error) => ({ error: String(error) }) : void 0) : void 0;
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
export { resolveStatusRuntimeSnapshot as a, resolveStatusUsageSummary as c, resolveStatusGatewayHealthSafe as i, resolveStatusGatewayDiagnosticsSafe as n, resolveStatusSecurityAudit as o, resolveStatusGatewayHealth as r, resolveStatusServiceSummaries as s, reportStatusScanFailure as t };
