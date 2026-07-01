import { c as hasExplicitPluginIdScope, l as hasNonEmptyPluginIdScope, u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { E as resolveDiscoverableScopedChannelPluginIds, c as resolveChannelPluginIds, w as resolveConfiguredChannelPluginIds } from "./gateway-startup-plugin-ids-DvFtK64_.js";
import { r as withActivatedPluginIds } from "./activation-context-DIeg2QAR.js";
import { c as loadOpenClawPlugins } from "./loader-Bz_7hBop.js";
import { s as getActivePluginRegistry, u as getActivePluginRegistryWorkspaceDir } from "./runtime-wIYJz8NY.js";
import { n as getLoadedRuntimePluginRegistry, r as registryContainsRuntimePluginIds } from "./active-runtime-registry-CaDgql0z.js";
import { i as resolvePluginRuntimeLoadContext, n as buildPluginRuntimeLoadOptionsFromValues } from "./load-context-pLBRU83W.js";
import "./channel-plugin-ids-CNTCN-WZ.js";
import { t as resolveEffectivePluginIds } from "./effective-plugin-ids-CsZ9C_-h.js";
//#region src/plugins/runtime/runtime-registry-loader.ts
let pluginRegistryLoaded = "none";
function scopeRank(scope) {
	switch (scope) {
		case "none": return 0;
		case "configured-channels": return 1;
		case "channels": return 2;
		case "all": return 3;
	}
	throw new Error("Unsupported plugin registry scope");
}
function activeRegistrySatisfiesScope(scope, active, expectedChannelPluginIds, requestedPluginIds, requestedWorkspaceDir) {
	if (!active) return false;
	if (requestedPluginIds !== void 0) {
		const activeWorkspaceDir = getActivePluginRegistryWorkspaceDir();
		if (requestedWorkspaceDir !== void 0 && activeWorkspaceDir !== requestedWorkspaceDir) return false;
		return registryContainsRuntimePluginIds(active, requestedPluginIds);
	}
	const activeChannelPluginIds = new Set(active.channels.map((entry) => entry.plugin.id));
	switch (scope) {
		case "configured-channels":
		case "channels": return active.channels.length > 0 && expectedChannelPluginIds.every((pluginId) => activeChannelPluginIds.has(pluginId));
		case "all": return false;
	}
	throw new Error("Unsupported plugin registry scope");
}
function shouldForwardChannelScope(params) {
	return !params.scopedLoad && params.scope === "configured-channels";
}
function resolveScopePluginIds(params) {
	switch (params.scope) {
		case "configured-channels": return resolveConfiguredChannelPluginIds({
			config: params.context.config,
			activationSourceConfig: params.context.activationSourceConfig,
			workspaceDir: params.context.workspaceDir,
			env: params.context.env
		});
		case "channels": return resolveChannelPluginIds({
			config: params.context.config,
			workspaceDir: params.context.workspaceDir,
			env: params.context.env
		});
		case "all": return resolveEffectivePluginIds({
			config: params.context.rawConfig,
			workspaceDir: params.context.workspaceDir,
			env: params.context.env
		});
	}
	return params.scope;
}
function resolveOrLoadRuntimePluginRegistry(loadOptions) {
	if (!getLoadedRuntimePluginRegistry({
		env: loadOptions.env,
		loadOptions,
		workspaceDir: loadOptions.workspaceDir,
		requiredPluginIds: loadOptions.onlyPluginIds
	})) loadOpenClawPlugins(loadOptions);
}
function ensurePluginRegistryLoaded(options) {
	const scope = options?.scope ?? "all";
	const requestedPluginIdsFromOptions = normalizePluginIdScope(options?.onlyPluginIds);
	const requestedChannelIds = normalizePluginIdScope(options?.onlyChannelIds);
	const context = resolvePluginRuntimeLoadContext(options);
	const requestedChannelOwnerPluginIds = requestedChannelIds === void 0 ? void 0 : resolveDiscoverableScopedChannelPluginIds({
		config: context.config,
		activationSourceConfig: context.activationSourceConfig,
		channelIds: requestedChannelIds,
		workspaceDir: context.workspaceDir,
		env: context.env
	});
	const requestedPluginIds = requestedChannelOwnerPluginIds === void 0 ? requestedPluginIdsFromOptions : normalizePluginIdScope([...requestedPluginIdsFromOptions ?? [], ...requestedChannelOwnerPluginIds]);
	const scopedLoad = hasExplicitPluginIdScope(requestedPluginIds);
	const expectedPluginIds = scopedLoad ? requestedPluginIds ?? [] : resolveScopePluginIds({
		scope,
		context
	});
	const active = getActivePluginRegistry();
	const requestedPluginIdsForScope = scope === "all" && expectedPluginIds.length === 0 ? expectedPluginIds : void 0;
	if (!scopedLoad && scopeRank(pluginRegistryLoaded) >= scopeRank(scope) && activeRegistrySatisfiesScope(scope, active, expectedPluginIds, requestedPluginIdsForScope, context.workspaceDir)) return;
	if ((pluginRegistryLoaded === "none" || scopedLoad) && activeRegistrySatisfiesScope(scope, active, expectedPluginIds, requestedPluginIds, context.workspaceDir)) {
		if (!scopedLoad) pluginRegistryLoaded = scope;
		return;
	}
	const scopedConfig = scope === "configured-channels" && expectedPluginIds.length > 0 && (!scopedLoad || requestedChannelOwnerPluginIds !== void 0) ? withActivatedPluginIds({
		config: context.config,
		pluginIds: expectedPluginIds
	}) ?? context.config : context.config;
	const scopedActivationSourceConfig = scope === "configured-channels" && expectedPluginIds.length > 0 && (!scopedLoad || requestedChannelOwnerPluginIds !== void 0) ? withActivatedPluginIds({
		config: context.activationSourceConfig,
		pluginIds: expectedPluginIds
	}) ?? context.activationSourceConfig : context.activationSourceConfig;
	resolveOrLoadRuntimePluginRegistry(buildPluginRuntimeLoadOptionsFromValues({
		...context,
		config: scopedConfig,
		activationSourceConfig: scopedActivationSourceConfig
	}, {
		throwOnLoadError: true,
		...hasExplicitPluginIdScope(requestedPluginIds) || shouldForwardChannelScope({
			scope,
			scopedLoad
		}) || hasNonEmptyPluginIdScope(expectedPluginIds) || scope === "all" ? { onlyPluginIds: expectedPluginIds } : {}
	}));
	if (!scopedLoad) pluginRegistryLoaded = scope;
}
const testing = { resetPluginRegistryLoadedForTests() {
	pluginRegistryLoaded = "none";
} };
//#endregion
export { testing as n, ensurePluginRegistryLoaded as t };
