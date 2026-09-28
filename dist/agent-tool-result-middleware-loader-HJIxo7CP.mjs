import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { r as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-k2s7FqfS.mjs";
import { i as listAgentToolResultMiddlewares } from "./agent-tool-result-middleware-CfincE3c.mjs";
import { r as loadPluginRegistryHandle } from "./loader-CidXT38G.mjs";
//#region src/plugins/agent-tool-result-middleware-loader.ts
const log = createSubsystemLogger("plugins/agent-tool-result-middleware");
function listMiddlewareOwners(params) {
	const owners = [];
	for (const owner of params.registry?.agentToolResultMiddlewareOwners ?? []) if (owner.runtimes.includes(params.runtime) && !owners.some((entry) => entry.pluginId === owner.pluginId)) owners.push(owner);
	return owners;
}
function listRuntimeMiddlewareOwnerPluginIds(registry, runtime) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of registry?.agentToolResultMiddlewares ?? []) if (entry.runtimes.includes(runtime)) pluginIds.add(entry.pluginId);
	return pluginIds;
}
function registryHasMiddlewareOwners(params) {
	if (!params.registry) return false;
	const ownerPluginIds = listRuntimeMiddlewareOwnerPluginIds(params.registry, params.runtime);
	return params.pluginIds.every((pluginId) => ownerPluginIds.has(pluginId));
}
async function loadAgentToolResultMiddlewaresForRuntime(params) {
	const activeHandlers = listAgentToolResultMiddlewares(params.runtime);
	try {
		const activeRegistry = getActivePluginRegistry();
		const owners = listMiddlewareOwners({
			registry: activeRegistry,
			runtime: params.runtime
		});
		if (owners.length === 0) return activeHandlers;
		const activePluginIds = listRuntimeMiddlewareOwnerPluginIds(activeRegistry, params.runtime);
		const missingOwners = owners.filter((owner) => !activePluginIds.has(owner.pluginId));
		if (missingOwners.length === 0) return activeHandlers;
		const missingPluginIds = missingOwners.map((owner) => owner.pluginId);
		const missingPluginIdSet = new Set(missingPluginIds);
		const loadedRegistry = getLoadedRuntimePluginRegistry({ requiredPluginIds: missingPluginIds });
		const missingHandlers = (loadedRegistry && registryHasMiddlewareOwners({
			registry: loadedRegistry,
			pluginIds: missingPluginIds,
			runtime: params.runtime
		}) ? loadedRegistry : loadPluginRegistryHandle({
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
