import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { p as resolveEffectivePluginActivationState } from "./config-state-DY_WJYue.mjs";
import { u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { o as loadManifestContractSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { t as resolveBundledCompatActivationInputs } from "./activation-context-cBjvZv-U.mjs";
//#region src/plugins/bundled-manifest-contract-plugins.ts
/** Applies config activation and compatibility rules before returning bundled contract owners. */
function resolveEnabledBundledManifestContractPlugins(params) {
	if (params.config?.plugins?.enabled === false) return [];
	let manifestRecords = params.manifestRecords;
	const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
	const loadCandidates = () => {
		manifestRecords ??= loadManifestContractSnapshot({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		}).plugins;
		return manifestRecords.filter((plugin) => plugin.origin === "bundled" && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && (plugin.contracts?.[params.contract]?.length ?? 0) > 0);
	};
	const activation = resolveBundledCompatActivationInputs({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: params.onlyPluginIds,
		applyAutoEnable: true,
		resolveBundledPluginIds: () => loadCandidates().map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right))
	});
	return loadCandidates().filter((plugin) => resolveEffectivePluginActivationState({
		id: plugin.id,
		origin: plugin.origin,
		channelIds: plugin.channels,
		config: activation.normalized,
		rootConfig: activation.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin),
		activationSource: activation.activationSource
	}).enabled);
}
//#endregion
export { resolveEnabledBundledManifestContractPlugins as t };
