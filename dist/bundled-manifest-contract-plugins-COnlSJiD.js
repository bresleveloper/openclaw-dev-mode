import { l as resolveEffectivePluginActivationState, n as createPluginActivationSource, s as normalizePluginsConfig } from "./config-state-CtMlHVRM.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { a as loadManifestContractSnapshot } from "./manifest-contract-eligibility-C77NT24K.js";
import { n as resolveBundledPluginCompatibleLoadValues } from "./activation-context-Ders3_KI.js";
//#region src/plugins/bundled-manifest-contract-plugins.ts
function createPluginIdSet(pluginIds) {
	return pluginIds && pluginIds.length > 0 ? new Set(pluginIds) : null;
}
/** Lists bundled plugin ids with a non-empty contract contribution in a manifest snapshot. */
function listBundledManifestContractPluginIds(params) {
	const onlyPluginIdSet = createPluginIdSet(params.onlyPluginIds);
	return params.plugins.filter((plugin) => plugin.origin === "bundled" && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && (plugin.contracts?.[params.contract]?.length ?? 0) > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
/** Applies config activation and compatibility rules before returning bundled contract owners. */
function resolveEnabledBundledManifestContractPlugins(params) {
	if (params.config?.plugins?.enabled === false) return [];
	let manifestRecords;
	const loadManifestRecords = (config) => {
		manifestRecords ??= loadManifestContractSnapshot({
			config,
			workspaceDir: params.workspaceDir,
			env: params.env
		}).plugins;
		return manifestRecords;
	};
	const activation = resolveBundledPluginCompatibleLoadValues({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: params.onlyPluginIds,
		applyAutoEnable: true,
		compatMode: params.compatMode,
		resolveCompatPluginIds: (compatParams) => listBundledManifestContractPluginIds({
			plugins: loadManifestRecords(compatParams.config),
			contract: params.contract,
			onlyPluginIds: compatParams.onlyPluginIds
		})
	});
	const normalizedPlugins = normalizePluginsConfig(activation.config?.plugins);
	const activationSource = createPluginActivationSource({ config: activation.activationSourceConfig });
	const onlyPluginIdSet = createPluginIdSet(params.onlyPluginIds);
	return loadManifestRecords(activation.config).filter((plugin) => {
		if (plugin.origin !== "bundled" || onlyPluginIdSet && !onlyPluginIdSet.has(plugin.id) || (plugin.contracts?.[params.contract]?.length ?? 0) === 0) return false;
		return resolveEffectivePluginActivationState({
			id: plugin.id,
			origin: plugin.origin,
			config: normalizedPlugins,
			rootConfig: activation.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin),
			activationSource
		}).enabled;
	});
}
//#endregion
export { resolveEnabledBundledManifestContractPlugins as t };
