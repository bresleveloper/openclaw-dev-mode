import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { n as readBackupRunFreshness } from "./backup-run-records-CBOO28UK.mjs";
import { t as readUpdateRunStatus } from "./update-run-status-6rOpNT9O.mjs";
import { a as resolveStatusUpdateChannelInfo } from "./format-BAb_G2oU.mjs";
import { l as buildStatusOverviewSurfaceFromScan, o as buildStatusGatewayJsonPayloadFromSurface } from "./status.format-8PiDIM9o.mjs";
import { a as resolveStatusRuntimeSnapshot, c as resolveStatusUsageSummary, t as reportStatusScanFailure } from "./status-runtime-shared-CiQwyF_T.mjs";
//#region src/commands/status-json-payload.ts
/** Combines scan summary, overview surface, services, agents, diagnostics, and optional deep probes. */
function buildStatusJsonPayload(params) {
	const channelInfo = resolveStatusUpdateChannelInfo({
		updateConfigChannel: params.surface.cfg.update?.channel ?? void 0,
		update: params.surface.update
	});
	return {
		...params.summary,
		os: params.osSummary,
		update: params.surface.update,
		updateChannel: channelInfo.channel,
		updateChannelSource: channelInfo.source,
		memory: params.memory,
		memoryPlugin: params.memoryPlugin,
		gateway: buildStatusGatewayJsonPayloadFromSurface({ surface: params.surface }),
		gatewayService: params.surface.gatewayService,
		nodeService: params.surface.nodeService,
		agents: params.agents,
		...params.configDiagnostics ? { configDiagnostics: params.configDiagnostics } : {},
		secretDiagnostics: params.secretDiagnostics,
		...params.securityAudit ? { securityAudit: params.securityAudit } : {},
		...params.pluginCompatibility ? { pluginCompatibility: {
			count: params.pluginCompatibility.length,
			warnings: params.pluginCompatibility
		} } : {},
		...params.health || params.usage || params.lastHeartbeat ? {
			health: params.health,
			usage: params.usage,
			lastHeartbeat: params.lastHeartbeat
		} : {}
	};
}
//#endregion
//#region src/commands/status-json-runtime.ts
/** Builds the status JSON object from a completed scan plus optional runtime/deep probes. */
async function resolveStatusJsonOutput(params) {
	const { scan, opts } = params;
	const inspectionReason = "Local plugin inspection is not collected in online status.";
	const { securityAudit, usage, health, lastHeartbeat, gatewayService, nodeService } = await resolveStatusRuntimeSnapshot({
		config: scan.cfg,
		sourceConfig: scan.sourceConfig,
		timeoutMs: opts.timeoutMs,
		gatewayProbeDeadlineMs: opts.gatewayProbeDeadlineMs,
		...opts.agent ? { agentId: opts.agent } : {},
		usage: opts.usage,
		deep: opts.deep,
		gatewayReachable: scan.gatewayReachable,
		...scan.gatewayProbe?.startupPhase ? { gatewayStartupPhase: scan.gatewayProbe.startupPhase } : {},
		...scan.gatewayProbe?.error ? { gatewayProbeError: scan.gatewayProbe.error } : {},
		includeSecurityAudit: params.includeSecurityAudit && !scan.collection,
		suppressHealthErrors: params.suppressHealthErrors,
		...scan.collection && opts.usage ? { resolveUsage: async (input) => {
			const { readConfigFileSnapshot } = await import("./config/config.js");
			const snapshot = await readConfigFileSnapshot({
				observe: false,
				pluginValidation: "core-only"
			});
			return resolveStatusUsageSummary({
				...input,
				config: snapshot.runtimeConfig
			});
		} } : {}
	});
	const payload = buildStatusJsonPayload({
		summary: scan.summary,
		surface: buildStatusOverviewSurfaceFromScan({
			scan,
			gatewayService,
			nodeService
		}),
		osSummary: scan.osSummary,
		memory: scan.memory,
		memoryPlugin: scan.memoryPlugin,
		agents: scan.agentStatus,
		configDiagnostics: scan.configDiagnostics,
		secretDiagnostics: scan.secretDiagnostics,
		securityAudit: params.includeSecurityAudit && scan.collection ? {
			collected: false,
			reason: inspectionReason
		} : securityAudit,
		health,
		usage,
		lastHeartbeat,
		pluginCompatibility: params.includePluginCompatibility ? scan.pluginCompatibility : void 0
	});
	const backups = await readBackupRunFreshness(scan.env ?? {});
	if (backups.latest || backups.latestOk) Object.assign(payload, { backups });
	return {
		...payload,
		...scan.collection ? {
			collection: {
				...scan.collection,
				notCollected: [...scan.collection.notCollected, ...params.includeSecurityAudit ? [{
					fields: ["securityAudit"],
					reason: inspectionReason
				}] : []]
			},
			...params.includePluginCompatibility ? { pluginCompatibility: {
				count: 0,
				warnings: [],
				collected: false,
				reason: inspectionReason
			} } : {}
		} : {}
	};
}
//#endregion
//#region src/commands/status-json-command.ts
/** Prevents --agent from implying that the aggregate status report itself is agent-scoped. */
function assertStatusUsageAgentScope(opts) {
	if (opts.agent !== void 0 && opts.usage !== true) throw new Error("--agent is only valid with --usage");
}
/** Runs the fast status scan, resolves optional deep fields, and writes JSON through the runtime. */
async function runStatusJsonCommand(params) {
	assertStatusUsageAgentScope(params.opts);
	const scan = await params.scanStatusJsonFast({
		timeoutMs: params.opts.timeoutMs,
		gatewayProbeDeadlineMs: params.opts.gatewayProbeDeadlineMs,
		all: params.opts.all
	}, params.runtime).catch((error) => reportStatusScanFailure(error, params.runtime, params.opts.timeoutMs));
	const updateRunStatus = readUpdateRunStatus();
	writeRuntimeJson(params.runtime, {
		...await resolveStatusJsonOutput({
			scan,
			opts: params.opts,
			includeSecurityAudit: params.includeSecurityAudit,
			includePluginCompatibility: params.includePluginCompatibility,
			suppressHealthErrors: params.suppressHealthErrors
		}),
		...Object.keys(updateRunStatus).length ? { updateRunStatus } : {}
	});
}
//#endregion
export { runStatusJsonCommand as n, assertStatusUsageAgentScope as t };
