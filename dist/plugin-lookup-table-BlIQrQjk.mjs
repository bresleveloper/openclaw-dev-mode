import { n as normalizeWorkerProviderIds } from "./worker-provider-config-OOjrHh-W.mjs";
import { n as loadGatewayStartupPluginPlanWithMetadata } from "./gateway-startup-plugin-loader-9UPXbh15.mjs";
//#region src/plugins/plugin-lookup-table.ts
function loadPluginLookUpTable(params) {
	const workerProviderIds = normalizeWorkerProviderIds(params.workerProviderIds ?? []);
	const { metadataSnapshot, plan: startup, startupPlanMs } = loadGatewayStartupPluginPlanWithMetadata({
		...params,
		workerProviderIds
	});
	return {
		...metadataSnapshot,
		startup,
		workerProviderIds,
		metrics: {
			...metadataSnapshot.metrics,
			startupPlanMs,
			totalMs: metadataSnapshot.metrics.totalMs + startupPlanMs,
			startupPluginCount: startup.pluginIds.length
		}
	};
}
//#endregion
export { loadPluginLookUpTable as t };
