import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-DTwXFUt4.js";
import { l as resolveEffectivePluginActivationState, n as createPluginActivationSource, s as normalizePluginsConfig } from "./config-state-6HQcbL-X.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { c as loadOpenClawPlugins } from "./loader-Bz_7hBop.js";
import { s as getActivePluginRegistry } from "./runtime-wIYJz8NY.js";
import { a as normalizeAgentToolResultMiddlewareRuntimeIds, i as listAgentToolResultMiddlewares } from "./tool-contracts-CnGjTaKv.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-CaDgql0z.js";
//#region src/plugins/agent-tool-result-middleware-loader.ts
const log = createSubsystemLogger("plugins/agent-tool-result-middleware");
async function resolveRuntimeConfigContext() {
	const { getRuntimeConfig, getRuntimeConfigSourceSnapshot } = await import("./config/config.js");
	const config = getRuntimeConfig();
	return {
		config,
		activationSourceConfig: getRuntimeConfigSourceSnapshot() ?? config
	};
}
function listMiddlewareOwnerPluginIds(params) {
	const pluginIds = [];
	for (const record of params.manifestRegistry.plugins) {
		if (!canLazyLoadMiddlewareOwner({
			record,
			config: params.config,
			pluginsConfig: params.pluginsConfig,
			activationSource: params.activationSource
		})) continue;
		if (normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware).includes(params.runtime) && !pluginIds.includes(record.id)) pluginIds.push(record.id);
	}
	return pluginIds;
}
function canLazyLoadMiddlewareOwner(params) {
	if (params.record.origin === "bundled") return true;
	const activationState = resolveEffectivePluginActivationState({
		id: params.record.id,
		origin: params.record.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.record),
		activationSource: params.activationSource
	});
	return activationState.enabled && activationState.explicitlyEnabled;
}
function listRuntimeMiddlewareOwnerPluginIds(registry, runtime) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of registry?.agentToolResultMiddlewares ?? []) if (entry.runtimes.includes(runtime)) pluginIds.add(entry.pluginId);
	return pluginIds;
}
function listActiveMiddlewareOwnerPluginIds(runtime) {
	return listRuntimeMiddlewareOwnerPluginIds(getActivePluginRegistry(), runtime);
}
function registryHasMiddlewareOwners(params) {
	if (!params.registry) return false;
	const ownerPluginIds = listRuntimeMiddlewareOwnerPluginIds(params.registry, params.runtime);
	return params.pluginIds.every((pluginId) => ownerPluginIds.has(pluginId));
}
async function loadAgentToolResultMiddlewaresForRuntime(params) {
	const activeHandlers = listAgentToolResultMiddlewares(params.runtime);
	try {
		const runtimeContext = params.config ? {
			config: params.config,
			activationSourceConfig: params.config
		} : await resolveRuntimeConfigContext();
		const config = runtimeContext.config;
		const activationSourceConfig = params.activationSourceConfig ?? runtimeContext.activationSourceConfig;
		const env = params.env ?? process.env;
		const manifestRegistry = params.manifestRegistry ?? loadPluginManifestRegistry({
			config,
			workspaceDir: params.workspaceDir,
			env
		});
		const pluginsConfig = normalizePluginsConfig(config.plugins);
		const activationSource = createPluginActivationSource({
			config: activationSourceConfig,
			plugins: normalizePluginsConfig(activationSourceConfig.plugins)
		});
		const pluginIds = listMiddlewareOwnerPluginIds({
			manifestRegistry,
			runtime: params.runtime,
			config,
			pluginsConfig,
			activationSource
		});
		if (pluginIds.length === 0) return activeHandlers;
		const activePluginIds = listActiveMiddlewareOwnerPluginIds(params.runtime);
		const missingPluginIds = pluginIds.filter((pluginId) => !activePluginIds.has(pluginId));
		if (missingPluginIds.length === 0) return activeHandlers;
		const missingPluginIdSet = new Set(missingPluginIds);
		const loadedRegistry = getLoadedRuntimePluginRegistry({
			workspaceDir: params.workspaceDir,
			env,
			requiredPluginIds: missingPluginIds
		});
		const missingHandlers = (loadedRegistry && registryHasMiddlewareOwners({
			registry: loadedRegistry,
			pluginIds: missingPluginIds,
			runtime: params.runtime
		}) ? loadedRegistry : loadOpenClawPlugins({
			config,
			workspaceDir: params.workspaceDir,
			env,
			onlyPluginIds: missingPluginIds,
			manifestRegistry,
			activate: false,
			forceFullRuntimeForChannelPlugins: true
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
