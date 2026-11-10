import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BrXk-dcA.mjs";
import { i as listAgentToolResultMiddlewares } from "./agent-tool-result-middleware-CYg_z_PV.mjs";
import { n as loadPluginRegistryHandle } from "./loader-B8PRFJEU.mjs";
//#region src/plugins/agent-tool-result-middleware-loader.ts
const log = createSubsystemLogger("plugins/agent-tool-result-middleware");
function listRuntimeMiddlewareOwnerPluginIds(registry, runtime) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of registry?.agentToolResultMiddlewares ?? []) if (entry.runtimes.includes(runtime)) pluginIds.add(entry.pluginId);
	return pluginIds;
}
async function loadAgentToolResultMiddlewaresForRuntime(params) {
	const activeHandlers = listAgentToolResultMiddlewares(params.runtime);
	try {
		const activeRegistry = getActivePluginRegistry();
		const activePluginIds = listRuntimeMiddlewareOwnerPluginIds(activeRegistry, params.runtime);
		const missingOwners = [];
		for (const owner of activeRegistry?.agentToolResultMiddlewareOwners ?? []) if (owner.runtimes.includes(params.runtime) && !activePluginIds.has(owner.pluginId) && !missingOwners.some((entry) => entry.pluginId === owner.pluginId)) missingOwners.push(owner);
		if (missingOwners.length === 0) return activeHandlers;
		const missingPluginIds = missingOwners.map((owner) => owner.pluginId);
		const missingPluginIdSet = new Set(missingPluginIds);
		const loadedRegistry = getLoadedRuntimePluginRegistry({ requiredPluginIds: missingPluginIds });
		const loadedPluginIds = listRuntimeMiddlewareOwnerPluginIds(loadedRegistry, params.runtime);
		const missingHandlers = (loadedRegistry && missingPluginIds.every((pluginId) => loadedPluginIds.has(pluginId)) ? loadedRegistry : loadPluginRegistryHandle({
			config: (await import("./config/config.js")).getRuntimeConfig(),
			onlyPluginIds: missingPluginIds,
			manifestRegistry: {
				plugins: missingOwners.map((owner) => owner.manifest),
				diagnostics: []
			},
			channelPluginLoadIntent: "full"
		})).agentToolResultMiddlewares.filter((entry) => missingPluginIdSet.has(entry.pluginId) && entry.runtimes.includes(params.runtime)).map((entry) => entry.handler);
		return [...activeHandlers, ...missingHandlers];
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		log.warn(`[${params.runtime}] failed to load tool result middleware plugins: ${detail}`);
		return listAgentToolResultMiddlewares(params.runtime);
	}
}
//#endregion
export { loadAgentToolResultMiddlewaresForRuntime };
