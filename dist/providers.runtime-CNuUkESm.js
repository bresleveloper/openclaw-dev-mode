import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { c as hasExplicitPluginIdScope } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { f as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-C6bCYWRE.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-Bh9IFehs.js";
import { a as resolveDiscoveredProviderPluginIds, f as resolveOwningPluginIdsForProviderRef, i as resolveDiscoverableProviderOwnerPluginIds, n as resolveBundledProviderCompatPluginIds, o as resolveEnabledProviderPluginIds, p as withBundledProviderVitestCompat, t as resolveActivatableProviderOwnerPluginIds, u as resolveOwningPluginIdsForModelRefs } from "./providers-B4CBCfED.js";
import { r as withActivatedPluginIds, t as resolveBundledPluginCompatibleActivationInputs } from "./activation-context-DIeg2QAR.js";
import { a as getRuntimePluginRegistryForLoadOptions, c as loadOpenClawPlugins, o as isPluginRegistryLoadInFlight } from "./loader-Bz_7hBop.js";
import { u as getActivePluginRegistryWorkspaceDir } from "./runtime-wIYJz8NY.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-CaDgql0z.js";
import { n as buildPluginRuntimeLoadOptionsFromValues, r as createPluginRuntimeLoaderLogger } from "./load-context-pLBRU83W.js";
//#region src/plugins/provider-config-owner.ts
const CORE_BUILT_IN_MODEL_APIS = new Set([
	"anthropic-messages",
	"azure-openai-responses",
	"google-generative-ai",
	"google-vertex",
	"mistral-conversations",
	"openai-chatgpt-responses",
	"openai-completions",
	"openai-responses"
]);
/** Returns the plugin API id that owns a provider config when it is not core built-in. */
function resolveProviderConfigApiOwnerHint(params) {
	const providers = params.config?.models?.providers;
	if (!providers) return;
	const normalizedProvider = normalizeProviderId(params.provider);
	if (!normalizedProvider) return;
	const providerConfig = providers[params.provider] ?? Object.entries(providers).find(([candidateId]) => normalizeProviderId(candidateId) === normalizedProvider)?.[1];
	const api = typeof providerConfig?.api === "string" ? normalizeProviderId(providerConfig.api) : "";
	if (!api || api === normalizedProvider || CORE_BUILT_IN_MODEL_APIS.has(api)) return;
	return api;
}
//#endregion
//#region src/plugins/providers.runtime.ts
function dedupeSortedPluginIds(values) {
	return sortUniqueStrings(values);
}
function resolveExplicitProviderOwnerPluginIds(params, snapshot) {
	return dedupeSortedPluginIds(params.providerRefs.flatMap((provider) => {
		const plannedPluginIds = resolveManifestActivationPluginIds({
			trigger: {
				kind: "provider",
				provider
			},
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			manifestRecords: snapshot.manifestRegistry.plugins
		});
		if (plannedPluginIds.length > 0) return plannedPluginIds;
		const apiOwnerHint = resolveProviderConfigApiOwnerHint({
			provider,
			config: params.config
		});
		if (apiOwnerHint) {
			const apiOwnerPluginIds = resolveManifestActivationPluginIds({
				trigger: {
					kind: "provider",
					provider: apiOwnerHint
				},
				config: params.config,
				workspaceDir: params.workspaceDir,
				env: params.env,
				manifestRecords: snapshot.manifestRegistry.plugins
			});
			if (apiOwnerPluginIds.length > 0) return apiOwnerPluginIds;
		}
		return resolveOwningPluginIdsForProviderRef({
			provider,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			manifestRegistry: snapshot.manifestRegistry
		}) ?? [];
	}));
}
function mergeExplicitOwnerPluginIds(providerPluginIds, explicitOwnerPluginIds) {
	if (explicitOwnerPluginIds.length === 0) return [...providerPluginIds];
	return dedupeSortedPluginIds([...providerPluginIds, ...explicitOwnerPluginIds]);
}
function resolvePluginProviderLoadBase(params, snapshot) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	const providerOwnedPluginIds = params.providerRefs?.length ? resolveExplicitProviderOwnerPluginIds({
		providerRefs: params.providerRefs,
		config: params.config,
		workspaceDir,
		env
	}, snapshot) : [];
	const modelOwnedPluginIds = params.modelRefs?.length ? resolveOwningPluginIdsForModelRefs({
		models: params.modelRefs,
		config: params.config,
		workspaceDir,
		env,
		manifestRegistry: snapshot.manifestRegistry
	}) : [];
	return {
		env,
		workspaceDir,
		requestedPluginIds: hasExplicitPluginIdScope(params.onlyPluginIds) || params.providerRefs?.length || params.modelRefs?.length || providerOwnedPluginIds.length > 0 || modelOwnedPluginIds.length > 0 ? dedupeSortedPluginIds([
			...params.onlyPluginIds ?? [],
			...providerOwnedPluginIds,
			...modelOwnedPluginIds
		]) : void 0,
		explicitOwnerPluginIds: dedupeSortedPluginIds([...providerOwnedPluginIds, ...modelOwnedPluginIds]),
		rawConfig: params.config
	};
}
function resolveProviderMetadataLookup(params) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	return {
		env,
		workspaceDir,
		snapshot: params.pluginMetadataSnapshot ?? resolvePluginMetadataSnapshot({
			config: params.config ?? {},
			workspaceDir,
			env
		})
	};
}
function resolveSetupProviderPluginLoadState(params, base, snapshot) {
	const setupPluginIds = mergeExplicitOwnerPluginIds(resolveDiscoveredProviderPluginIds({
		config: params.config,
		workspaceDir: base.workspaceDir,
		env: base.env,
		onlyPluginIds: base.requestedPluginIds,
		includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	}), resolveDiscoverableProviderOwnerPluginIds({
		pluginIds: base.explicitOwnerPluginIds,
		config: params.config,
		workspaceDir: base.workspaceDir,
		env: base.env,
		includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	}));
	if (setupPluginIds.length === 0) return;
	const setupConfig = withActivatedPluginIds({
		config: base.rawConfig,
		pluginIds: setupPluginIds
	});
	return { loadOptions: buildPluginRuntimeLoadOptionsFromValues({
		config: setupConfig,
		activationSourceConfig: setupConfig,
		autoEnabledReasons: {},
		workspaceDir: base.workspaceDir,
		env: base.env,
		logger: createPluginRuntimeLoaderLogger(),
		manifestRegistry: snapshot.manifestRegistry,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(snapshot.index)
	}, {
		onlyPluginIds: setupPluginIds,
		pluginSdkResolution: params.pluginSdkResolution,
		cache: params.cache ?? false,
		activate: params.activate ?? false
	}) };
}
function resolveRuntimeProviderPluginLoadState(params, base, snapshot) {
	const explicitOwnerPluginIds = resolveActivatableProviderOwnerPluginIds({
		pluginIds: base.explicitOwnerPluginIds,
		config: base.rawConfig,
		workspaceDir: base.workspaceDir,
		env: base.env,
		includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	});
	const runtimeRequestedPluginIds = base.requestedPluginIds !== void 0 ? dedupeSortedPluginIds([...params.onlyPluginIds ?? [], ...explicitOwnerPluginIds]) : void 0;
	const activation = resolveBundledPluginCompatibleActivationInputs({
		rawConfig: withActivatedPluginIds({
			config: base.rawConfig,
			pluginIds: explicitOwnerPluginIds
		}),
		env: base.env,
		workspaceDir: base.workspaceDir,
		onlyPluginIds: runtimeRequestedPluginIds,
		applyAutoEnable: params.applyAutoEnable ?? true,
		compatMode: { vitest: params.bundledProviderVitestCompat },
		resolveCompatPluginIds: (compatParams) => resolveBundledProviderCompatPluginIds({
			...compatParams,
			manifestRegistry: snapshot.manifestRegistry
		})
	});
	const config = params.bundledProviderVitestCompat ? withBundledProviderVitestCompat({
		config: activation.config,
		pluginIds: activation.compatPluginIds,
		env: base.env
	}) : activation.config;
	const providerPluginIds = mergeExplicitOwnerPluginIds(resolveEnabledProviderPluginIds({
		config,
		workspaceDir: base.workspaceDir,
		env: base.env,
		onlyPluginIds: runtimeRequestedPluginIds,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	}), explicitOwnerPluginIds);
	return { loadOptions: buildPluginRuntimeLoadOptionsFromValues({
		config,
		activationSourceConfig: activation.activationSourceConfig,
		autoEnabledReasons: activation.autoEnabledReasons,
		workspaceDir: base.workspaceDir,
		env: base.env,
		logger: createPluginRuntimeLoaderLogger(),
		manifestRegistry: snapshot.manifestRegistry,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(snapshot.index)
	}, {
		onlyPluginIds: providerPluginIds,
		pluginSdkResolution: params.pluginSdkResolution,
		cache: params.cache ?? true,
		activate: params.activate ?? false
	}) };
}
function isPluginProvidersLoadInFlight(params) {
	const { env, workspaceDir, snapshot } = resolveProviderMetadataLookup(params);
	const base = resolvePluginProviderLoadBase({
		...params,
		workspaceDir,
		env
	}, snapshot);
	const loadState = params.mode === "setup" ? resolveSetupProviderPluginLoadState(params, base, snapshot) : resolveRuntimeProviderPluginLoadState(params, base, snapshot);
	if (!loadState) return false;
	return isPluginRegistryLoadInFlight(loadState.loadOptions);
}
function resolvePluginProviders(params) {
	const { env, workspaceDir, snapshot } = resolveProviderMetadataLookup(params);
	const base = resolvePluginProviderLoadBase({
		...params,
		workspaceDir,
		env
	}, snapshot);
	if (params.mode === "setup") {
		const loadState = resolveSetupProviderPluginLoadState(params, base, snapshot);
		if (!loadState) return [];
		if (params.skipIfLoadInFlight && isPluginRegistryLoadInFlight(loadState.loadOptions)) return [];
		return loadOpenClawPlugins(loadState.loadOptions).providers.map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }));
	}
	const loadState = resolveRuntimeProviderPluginLoadState(params, base, snapshot);
	if (params.skipIfLoadInFlight && isPluginRegistryLoadInFlight(loadState.loadOptions)) return [];
	const registry = loadState.loadOptions.onlyPluginIds?.length === 0 ? void 0 : getLoadedRuntimePluginRegistry({
		env: base.env,
		loadOptions: loadState.loadOptions,
		workspaceDir: base.workspaceDir,
		requiredPluginIds: loadState.loadOptions.onlyPluginIds
	}) ?? getRuntimePluginRegistryForLoadOptions(loadState.loadOptions);
	if (!registry) return [];
	return registry.providers.map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }));
}
//#endregion
export { resolvePluginProviders as n, resolveProviderConfigApiOwnerHint as r, isPluginProvidersLoadInFlight as t };
