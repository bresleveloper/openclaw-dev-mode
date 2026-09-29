import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { h as isImplicitLocalGatewayTarget, o as callGateway } from "./call-C_MP4_Gs.mjs";
import { n as readGatewayDispatchConfigWithShellEnvFallback } from "./gateway-dispatch-config-D6ryKgcX.mjs";
import { r as resolveOsSummary } from "./os-summary-B-12bRQs.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-CoumbNZT.mjs";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-l9swrDqQ.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-DkP8SzQT.mjs";
import { n as resolveGatewayProbeSnapshot } from "./status.scan.shared-BT_Y8vLq.mjs";
import { n as createStatusScanCoreBootstrap, t as buildColdStartStatusSummary } from "./status.scan.bootstrap-shared--TvYEDAa.mjs";
import { t as resolveMemoryPluginStatus } from "./memory-plugin-bRtlqyTC.mjs";
import { t as buildStatusScanResult } from "./status.scan-result-DVzxcEQL.mjs";
import { existsSync } from "node:fs";
//#region src/commands/status.scan.gateway.ts
/** The running Gateway owns fleet admission and status; local discovery is the offline fallback. */
async function scanStatusJsonGateway(opts) {
	const env = process.env;
	const configPath = resolveConfigPath(env);
	if (!existsSync(configPath)) return {};
	const cfg = await measureCliCommandStartup("status.connection-config", () => readGatewayDispatchConfigWithShellEnvFallback({
		configPath,
		env
	}).catch(() => null), { env });
	if (!cfg) return {};
	let projectionError = "Gateway status is unavailable.";
	const gatewaySnapshot = await resolveGatewayProbeSnapshot({
		cfg,
		configPath,
		env,
		opts
	});
	if (!gatewaySnapshot.gatewayReachable) return { gatewaySnapshot };
	const status = await measureCliCommandStartup("status.gateway-projection", () => {
		const timeoutMs = resolveStatusGatewayProbeTimeoutMs(opts);
		if (timeoutMs === 0) {
			projectionError = "Gateway probe budget exhausted before status projection.";
			return Promise.resolve(null);
		}
		return callGateway({
			config: cfg,
			configPath,
			method: "status",
			params: {
				includeChannelSummary: false,
				includeCliProjection: true
			},
			timeoutMs
		}).catch((error) => {
			projectionError = error instanceof Error ? error.message : String(error);
			return null;
		});
	}, {
		config: cfg,
		env
	});
	const { cliProjection, ...summary } = status ?? buildColdStartStatusSummary();
	if (status) {
		gatewaySnapshot.gatewayReachable = true;
		gatewaySnapshot.gatewayProbe = {
			...gatewaySnapshot.gatewayProbe,
			ok: true,
			gatewayReached: true,
			url: gatewaySnapshot.gatewayConnection.url,
			connectLatencyMs: gatewaySnapshot.gatewayProbe?.connectLatencyMs ?? null,
			error: null,
			close: null,
			auth: {
				role: "operator",
				scopes: ["operator.read"],
				capability: "read_only"
			},
			health: null,
			status,
			presence: gatewaySnapshot.gatewayProbe?.presence ?? null,
			configSnapshot: null
		};
	}
	const agentNames = new Map(cliProjection?.agents.rows.map((agent) => [agent.id, agent.name]));
	const agentStatus = {
		defaultId: cliProjection?.agents.defaultId ?? null,
		ownership: cliProjection?.agents.ownership ?? null,
		selectionRequired: cliProjection?.agents.selectionRequired ?? null,
		agents: summary.sessions.byAgent.map((agent) => ({
			id: agent.agentId,
			name: agentNames.get(agent.agentId),
			...agent.status ? { status: agent.status } : {},
			...agent.admissionRefusal ? { admissionRefusal: agent.admissionRefusal } : {},
			workspaceDir: null,
			bootstrapPending: null,
			sessionsPath: agent.path,
			sessionsCount: agent.count,
			lastUpdatedAt: agent.recent[0]?.updatedAt ?? null,
			lastActiveAgeMs: agent.recent[0]?.age ?? null
		})),
		totalSessions: summary.sessions.count,
		bootstrapPendingCount: null
	};
	const localGateway = await isImplicitLocalGatewayTarget({ config: cfg });
	const statusConfig = localGateway && cliProjection?.updateChannel ? {
		...cfg,
		update: { channel: cliProjection.updateChannel }
	} : cfg;
	const bootstrap = await createStatusScanCoreBootstrap({
		coldStart: false,
		cfg: statusConfig,
		configPath,
		env,
		hasConfiguredChannels: false,
		opts,
		fetchGitUpdate: opts.all === true,
		includeRegistryUpdate: opts.all === true,
		gatewaySnapshot,
		getAgentLocalStatuses: async () => agentStatus,
		getTailnetHostname: async (runner) => (await import("./tailscale-CJM8sDit.mjs")).getTailnetHostname(runner),
		getUpdateCheckResult: async (params) => (await import("./status.update-B1JNGO5F.mjs")).getUpdateCheckResult(params)
	});
	const [tailscaleDns, tailscaleHttpsUrl, update] = await Promise.all([
		bootstrap.tailscaleDnsPromise,
		bootstrap.resolveTailscaleHttpsUrl(),
		bootstrap.updatePromise
	]);
	const conflict = resolveGatewayAuthTokenSourceConflict({
		cfg,
		env
	});
	return { scan: buildStatusScanResult({
		env,
		cfg: statusConfig,
		sourceConfig: cfg,
		configDiagnostics: null,
		secretDiagnostics: conflict ? [conflict.diagnostic] : [],
		osSummary: resolveOsSummary(),
		tailscaleMode: bootstrap.tailscaleMode,
		tailscaleDns,
		tailscaleHttpsUrl,
		update,
		gatewaySnapshot,
		channelIssues: [],
		agentStatus,
		channels: {
			rows: [],
			details: []
		},
		summary,
		memory: null,
		memoryPlugin: cliProjection?.memoryPlugin ?? resolveMemoryPluginStatus(cfg),
		pluginCompatibility: [],
		collection: {
			source: "gateway",
			notCollected: [
				...!localGateway ? [{
					fields: ["updateChannel", "updateChannelSource"],
					reason: "The remote Gateway's update channel does not describe this CLI installation; its local channel override was not collected."
				}] : [],
				...!status ? [{
					fields: [
						"agents",
						"sessions",
						"heartbeat",
						"tasks",
						"taskAudit",
						"channelSummary"
					],
					reason: projectionError
				}] : summary.channelSummary.length === 0 ? [{
					fields: ["channelSummary"],
					reason: "Online status skips channel summaries; an empty channelSummary was not collected. Use openclaw channels status, or openclaw channels status --probe for live account checks."
				}] : [],
				...!cliProjection ? [{
					fields: [
						"agents.defaultId",
						"agents.ownership",
						"agents.selectionRequired",
						"agents.agents.*.name",
						"updateChannel"
					],
					reason: "This Gateway does not expose the CLI configuration projection."
				}] : [],
				{
					fields: [
						"agents.agents.*.workspaceDir",
						"agents.agents.*.bootstrapPending",
						"agents.bootstrapPendingCount"
					],
					reason: "Online status does not inspect local agent workspaces."
				},
				{
					fields: [
						"sessions.paths",
						"sessions.defaults",
						"sessions.recent",
						"sessions.byAgent.*.path",
						"sessions.byAgent.*.recent",
						"agents.agents.*.admissionRefusal",
						"agents.agents.*.lastUpdatedAt",
						"agents.agents.*.lastActiveAgeMs"
					],
					reason: "Gateway status preserves operator.read redaction of session details and admission refusals."
				},
				{
					fields: ["configDiagnostics", "secretDiagnostics"],
					reason: "Only Gateway connection configuration is read locally; degradedSecretOwners reports Gateway runtime availability."
				},
				...opts.all ? [{
					fields: ["memory", "pluginCompatibility"],
					reason: "Local plugin inspection is not collected in online status."
				}] : []
			]
		}
	}) };
}
//#endregion
export { scanStatusJsonGateway };
