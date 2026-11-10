import { n as resolveStatusSummaryFromOverview } from "./status.scan-overview-pEiu6_8P.mjs";
import { t as resolveMemoryPluginStatus } from "./memory-plugin-C0OSVysP.mjs";
import { t as buildStatusScanResult } from "./status.scan-result-BS9ujI6G.mjs";
//#region src/commands/status.scan-execute.ts
/** Builds a full status scan result from an overview scan plus channel/plugin compatibility data. */
async function executeStatusScanFromOverview(params) {
	const { coldStart: _coldStart, hasConfiguredChannels: _hasConfiguredChannels, skipColdStartNetworkChecks: _skipColdStartNetworkChecks, channelsStatus: _channelsStatus, runtimeDegradation: _runtimeDegradation, sessionStores: _sessionStores, ...overview } = params.overview;
	const memoryPlugin = resolveMemoryPluginStatus(overview.cfg);
	const [memory, summary] = await Promise.all([params.includeMemory ? import("./status.scan-memory-BL6szw7y.mjs").then(({ resolveDefaultMemoryDatabasePath, resolveStatusMemoryStatusSnapshot }) => resolveStatusMemoryStatusSnapshot({
		cfg: overview.cfg,
		agentStatus: overview.agentStatus,
		memoryPlugin,
		requireDefaultDatabasePath: resolveDefaultMemoryDatabasePath
	})) : null, resolveStatusSummaryFromOverview({ overview: params.overview })]);
	return buildStatusScanResult({
		...overview,
		env: overview.env ?? {},
		summary,
		memory,
		memoryPlugin,
		pluginCompatibility: params.pluginCompatibility
	});
}
//#endregion
export { executeStatusScanFromOverview as t };
