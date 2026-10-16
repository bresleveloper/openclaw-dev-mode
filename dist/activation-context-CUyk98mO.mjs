import { g as withBundledPluginEnablementCompat } from "./installed-plugin-index-Zl-RSskC.mjs";
import { r as createPluginActivationSource, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
//#region src/plugins/activation-context.ts
function withActivatedPluginIds(params) {
	if (params.pluginIds.length === 0) return params.config;
	const originalAllow = params.config?.plugins?.allow ?? [];
	const originalAllowSet = originalAllow.length > 0 ? new Set(originalAllow) : void 0;
	const allow = new Set(originalAllow);
	const entries = { ...params.config?.plugins?.entries };
	let entryChanged = false;
	for (const pluginId of params.pluginIds) {
		const normalized = pluginId.trim();
		if (!normalized) continue;
		if (originalAllowSet && !originalAllowSet.has(normalized)) continue;
		allow.add(normalized);
		const existingEntry = entries[normalized];
		const enabled = existingEntry?.enabled !== false || params.overrideExplicitDisable === true;
		entryChanged ||= existingEntry?.enabled !== enabled;
		entries[normalized] = {
			...existingEntry,
			enabled
		};
	}
	const forcePluginsEnabled = params.overrideGlobalDisable === true && params.config?.plugins?.enabled === false;
	if (!forcePluginsEnabled && !entryChanged && allow.size === originalAllow.length && params.config?.plugins?.entries) return params.config;
	return {
		...params.config,
		plugins: {
			...params.config?.plugins,
			...forcePluginsEnabled ? { enabled: true } : {},
			...allow.size > 0 ? { allow: [...allow] } : {},
			entries
		}
	};
}
function applyPluginAutoEnableForActivation(params) {
	const currentSnapshot = params.manifestRegistry ? void 0 : getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		allowWorkspaceScopedSnapshot: true
	});
	const defaultDiscoverySnapshot = !params.manifestRegistry && normalizePluginsConfig(params.config.plugins).loadPaths.length === 0 ? getCurrentPluginMetadataSnapshot({
		env: params.env,
		workspaceDir: params.workspaceDir,
		allowWorkspaceScopedSnapshot: true,
		requireDefaultDiscoveryContext: true
	}) : void 0;
	const currentManifestRegistry = params.manifestRegistry ?? currentSnapshot?.manifestRegistry ?? defaultDiscoverySnapshot?.manifestRegistry;
	return applyPluginAutoEnable({
		config: params.config,
		env: params.env,
		manifestRegistry: currentManifestRegistry,
		discovery: params.discovery ?? currentSnapshot?.discovery ?? defaultDiscoverySnapshot?.discovery
	});
}
function resolveBundledCompatActivationInputs(params) {
	const env = params.env ?? process.env;
	const rawConfig = params.rawConfig ?? params.resolvedConfig;
	let resolvedConfig = params.resolvedConfig ?? params.rawConfig;
	let autoEnabledReasons = params.autoEnabledReasons;
	if (params.applyAutoEnable && rawConfig !== void 0) {
		const autoEnabled = applyPluginAutoEnableForActivation({
			config: rawConfig,
			env,
			workspaceDir: params.workspaceDir,
			discovery: params.discovery,
			manifestRegistry: params.manifestRegistry
		});
		resolvedConfig = autoEnabled.config;
		autoEnabledReasons = autoEnabled.autoEnabledReasons;
	}
	const activationSource = createPluginActivationSource({ config: rawConfig });
	const bundledPluginIds = params.resolveBundledPluginIds({
		config: resolvedConfig,
		workspaceDir: params.workspaceDir,
		env,
		onlyPluginIds: params.onlyPluginIds,
		...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}
	});
	const config = withBundledPluginEnablementCompat({
		config: resolvedConfig,
		pluginIds: bundledPluginIds,
		env,
		...params.activation ? { activation: params.activation } : {}
	});
	return {
		rawConfig,
		config,
		normalized: normalizePluginsConfig(config?.plugins),
		activationSourceConfig: rawConfig,
		activationSource,
		autoEnabledReasons: autoEnabledReasons ?? {}
	};
}
//#endregion
export { withActivatedPluginIds as n, resolveBundledCompatActivationInputs as t };
