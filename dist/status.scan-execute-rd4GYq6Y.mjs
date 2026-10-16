import { n as resolveStatusSummaryFromOverview } from "./status.scan-overview-XbgpmdaV.mjs";
import { t as resolveMemoryPluginStatus } from "./memory-plugin-DvF4pz6G.mjs";
import { t as buildStatusScanResult } from "./status.scan-result-CAK1TcS0.mjs";
//#region src/commands/status.scan-execute.ts
/** Builds a full status scan result from an overview scan plus channel/plugin compatibility data. */
async function executeStatusScanFromOverview(params) {
	const memoryPlugin = resolveMemoryPluginStatus(params.overview.cfg);
	const [memory, summary] = await Promise.all([params.resolveMemory({
		cfg: params.overview.cfg,
		agentStatus: params.overview.agentStatus,
		memoryPlugin
	}), resolveStatusSummaryFromOverview({ overview: params.overview })]);
	return buildStatusScanResult({
		env: params.overview.env ?? {},
		cfg: params.overview.cfg,
		sourceConfig: params.overview.sourceConfig,
		configDiagnostics: params.overview.configDiagnostics,
		secretDiagnostics: params.overview.secretDiagnostics,
		osSummary: params.overview.osSummary,
		tailscaleMode: params.overview.tailscaleMode,
		tailscaleDns: params.overview.tailscaleDns,
		tailscaleHttpsUrl: params.overview.tailscaleHttpsUrl,
		...params.overview.advertisedControlUiLinks ? { advertisedControlUiLinks: params.overview.advertisedControlUiLinks } : {},
		update: params.overview.update,
		gatewaySnapshot: params.overview.gatewaySnapshot,
		channelIssues: params.overview.channelIssues,
		agentStatus: params.overview.agentStatus,
		channels: params.overview.channels,
		summary,
		memory,
		memoryPlugin,
		pluginCompatibility: params.pluginCompatibility
	});
}
//#endregion
export { executeStatusScanFromOverview as t };
