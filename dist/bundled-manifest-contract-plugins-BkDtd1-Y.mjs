import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { p as resolveEffectivePluginActivationState } from "./config-state-DkDfCu7E.mjs";
import { u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { o as loadManifestContractSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as resolveBundledCompatActivationInputs } from "./activation-context-ZGPJ_bJQ.mjs";
//#region src/plugins/bundled-manifest-contract-plugins.ts
/** Applies config activation and compatibility rules before returning bundled contract owners. */
function resolveEnabledBundledManifestContractPlugins(params) {
	if (params.config?.plugins?.enabled === false) return [];
	let manifestRecords = params.manifestRecords;
	const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
	const loadCandidates = () => {
		manifestRecords ??= loadManifestContractSnapshot(params).plugins;
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
