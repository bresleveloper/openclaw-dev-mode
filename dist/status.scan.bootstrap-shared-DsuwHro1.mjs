import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { t as measureCliCommandStartup } from "./command-startup-timing-BiE9BoBb.mjs";
import { n as resolveGatewayProbeSnapshot, t as buildTailscaleHttpsUrl } from "./status.scan.shared-BqGO8l2R.mjs";
//#region src/commands/status.scan.bootstrap-shared.ts
function buildColdStartUpdateResult() {
	return {
		root: null,
		installKind: "unknown",
		packageManager: "unknown"
	};
}
function buildColdStartAgentLocalStatuses() {
	return {
		defaultId: "main",
		agents: [],
		totalSessions: 0,
		bootstrapPendingCount: 0
	};
}
/** Builds an empty summary for cold-start status paths that skip network and session work. */
function buildColdStartStatusSummary() {
	return {
		runtimeVersion: null,
		heartbeat: {
			defaultAgentId: "main",
			agents: []
		},
		channelSummary: [],
		queuedSystemEvents: [],
		degradedSecretOwners: [],
		sessions: {
			paths: [],
			count: 0,
			defaults: {
				model: null,
				contextTokens: null
			},
			recent: [],
			byAgent: []
		}
	};
}
function shouldSkipStatusScanNetworkChecks(params) {
	return params.coldStart && !params.hasConfiguredChannels && params.all !== true;
}
async function createStatusScanCoreBootstrap(params) {
	const tailscaleMode = params.cfg.gateway?.tailscale?.mode ?? "off";
	const skipColdStartNetworkChecks = shouldSkipStatusScanNetworkChecks({
		coldStart: params.coldStart,
		hasConfiguredChannels: params.hasConfiguredChannels,
		all: params.opts.all
	});
	const statusTimeoutMs = params.opts.timeoutMs ?? 1e4;
	const tailscaleTimeoutMs = Math.min(1200, statusTimeoutMs);
	const tailscaleDnsPromise = tailscaleMode === "off" ? Promise.resolve(null) : params.getTailnetHostname((cmd, args) => runExec(cmd, args, {
		timeoutMs: tailscaleTimeoutMs,
		maxBuffer: 2e5
	})).catch(() => null);
	return {
		tailscaleMode,
		tailscaleDnsPromise,
		updatePromise: skipColdStartNetworkChecks ? Promise.resolve(buildColdStartUpdateResult()) : params.getUpdateCheckResult({
			timeoutMs: statusTimeoutMs,
			fetchGit: params.fetchGitUpdate ?? true,
			includeRegistry: params.includeRegistryUpdate ?? true,
			updateConfigChannel: params.cfg.update?.channel ?? null
		}),
		agentStatusPromise: skipColdStartNetworkChecks ? Promise.resolve(buildColdStartAgentLocalStatuses()) : params.getAgentLocalStatuses(params.cfg),
		gatewayProbePromise: params.gatewaySnapshot ? Promise.resolve(params.gatewaySnapshot) : measureCliCommandStartup("status.gateway-probe", () => resolveGatewayProbeSnapshot({
			cfg: params.cfg,
			configPath: params.configPath,
			env: params.env,
			opts: {
				...params.opts,
				...skipColdStartNetworkChecks ? { skipProbe: true } : {},
				localStatusRpcFallback: params.includeLocalStatusRpcFallback !== false,
				onProgress: params.onGatewayProgress
			}
		}), {
			config: params.cfg,
			env: params.env
		}),
		skipColdStartNetworkChecks,
		resolveTailscaleHttpsUrl: async () => buildTailscaleHttpsUrl({
			tailscaleMode,
			tailscaleDns: await tailscaleDnsPromise,
			controlUiBasePath: params.cfg.gateway?.controlUi?.basePath
		})
	};
}
//#endregion
export { createStatusScanCoreBootstrap as n, buildColdStartStatusSummary as t };
