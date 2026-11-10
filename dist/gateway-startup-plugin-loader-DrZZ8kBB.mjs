import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { b as normalizePluginsConfigWithResolverCore, p as resolveEffectivePluginActivationState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { g as withBundledPluginEnablementCompat, h as isBundledProviderCompatPlugin } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { u as resolvePluginMetadataSnapshot, v as createPluginRegistryIdNormalizer } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { t as listExplicitlyDisabledChannelIdsForConfig } from "./config-presence-oqIBz-8f.mjs";
import "./plugin-registry-contributions-BDlJJbko.mjs";
import { d as listGatewayActivatedChannelIds } from "./channel-presence-policy-hdzky3AO.mjs";
import { t as canStartConfiguredChannelPlugin } from "./channel-startup-policy-8d7Kz1SS.mjs";
import { C as isWebSearchProviderAutoSelected, _ as collectConfiguredMemoryEmbeddingProviderIds, a as collectConfiguredProviderIds, b as collectConfiguredWebSearchProviderIds, c as collectValidationConfiguredShorthandModelIds, d as resolveAuthorizedGatewayStartupDreamingPluginIds, f as resolveContextEngineSlotStartupPluginId, g as collectConfiguredGenerationProviderIds, h as collectConfiguredAgentModelProviderIds, i as blocksPluginStartup, l as hasConfiguredActivationPath, m as shouldConsiderForGatewayStartup, n as addConfiguredSlotPluginIds, o as collectConfiguredStartupChannelIds, p as resolveMemorySlotStartupPluginId, r as addPluginConfigEntryIds, s as collectValidationConfiguredRefs, t as addConfiguredActivationPathPluginIds, u as readStartupBundledDiscoveryMode, w as manifestOwnsConfiguredModelProvider, y as collectConfiguredVoiceProviderIds } from "./gateway-startup-plugin-config-Cv_2HdnZ.mjs";
import { t as getConfiguredDecisionProviderIds } from "./decision-model-setting-CqwqM5vF.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-C-QBCzx4.mjs";
import { r as sortUniquePluginIds, t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-GphgdX8d.mjs";
import { r as manifestOwnsStorageProvider, t as collectConfiguredStorageProviderIds } from "./storage-provider-manifest-D3Hhc9Ut.mjs";
import { n as normalizeWorkerProviderIds, t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-BI49IDBE.mjs";
import { n as manifestOwnsWorkerProvider } from "./worker-provider-manifest-muUGU3iQ.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-BspjHPkd.mjs";
//#region src/plugins/gateway-startup-plugin-activation.ts
function addRequiredAgentHarnessPluginIds(target, params) {
	const requiredAgentHarnessRuntimes = new Set(collectConfiguredAgentHarnessRuntimes(params.activationSourceConfig, { includeImplicitRuntimePreferences: false }));
	if (requiredAgentHarnessRuntimes.size === 0) return;
	for (const plugin of params.index.plugins) if (plugin.startup.agentHarnesses.some((runtime) => requiredAgentHarnessRuntimes.has(runtime)) && passesPluginStartupPolicy({
		...params,
		plugin
	}, "harness")) target.add(plugin.pluginId);
}
function resolveStartupActivationState(params, autoEnabledReason, applyBundledProviderCompat = false) {
	const config = applyBundledProviderCompat ? withBundledPluginEnablementCompat({
		config: params.config,
		pluginIds: [params.plugin.pluginId],
		env: params.env,
		activation: "defaults"
	}) ?? params.config : params.config;
	return resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		channelIds: params.plugin.contributions?.channels,
		config: applyBundledProviderCompat ? normalizePluginsConfig(config.plugins) : params.pluginsConfig,
		rootConfig: config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource,
		...autoEnabledReason ? { autoEnabledReason } : {}
	});
}
function isProviderCompatStartupPolicy(policy) {
	return policy === "provider" || policy === "worker" || policy === "storage" || policy === "speech" || policy === "implicit-external";
}
function hasExplicitHookPolicyConfig(entry) {
	return entry?.hooks?.allowConversationAccess === true || entry?.hooks?.allowPromptInjection === true || entry?.hooks?.timeoutMs !== void 0 || entry?.hooks?.timeouts !== void 0 && Object.keys(entry.hooks.timeouts).length > 0;
}
function passesPluginStartupPolicy(params, policy) {
	const { activationSource, plugin, pluginsConfig } = params;
	const policyId = normalizePluginPolicyId(plugin.pluginId);
	if (policy !== "speech" && (!pluginsConfig.enabled || !activationSource.plugins.enabled) || blocksPluginStartup({
		pluginId: plugin.pluginId,
		pluginsConfig,
		activationSourcePlugins: activationSource.plugins
	})) return false;
	if (policy === "harness" && [pluginsConfig, activationSource.plugins].some((config) => config.allow.length > 0 && !config.allow.includes(policyId))) return false;
	const bundled = plugin.origin === "bundled";
	if (bundled && (policy === "harness" || policy === "speech" || policy === "root")) return true;
	if (policy === "root" && activationSource.plugins.allow.length > 0 && !activationSource.plugins.allow.includes(policyId)) return false;
	const activationState = resolveStartupActivationState(params, policy === "worker" ? "cloud worker provider required" : policy === "storage" ? "storage provider required" : policy === "decision" ? "decision model selected" : void 0, isProviderCompatStartupPolicy(policy) && isBundledProviderCompatPlugin({
		origin: plugin.origin,
		providers: plugin.contributions?.providers,
		contracts: plugin.contributions?.contracts
	}));
	if (!activationState.enabled) return false;
	if (policy === "harness" || policy === "implicit-external" || policy === "decision") return true;
	if (policy === "web-search-auto") return activationState.explicitlyEnabled;
	if (policy === "hook") return activationState.explicitlyEnabled || hasExplicitHookPolicyConfig(activationSource.plugins.entries[policyId]);
	return bundled || activationState.explicitlyEnabled;
}
function manifestOwnsConfiguredContract(manifest, contractKey, configuredProviderIds) {
	return configuredProviderIds.size > 0 && (manifest?.contracts?.[contractKey] ?? []).some((providerId) => {
		const normalized = normalizeOptionalLowercaseString(providerId);
		return normalized ? configuredProviderIds.has(normalized) : false;
	});
}
function manifestOwnsConfiguredContractGroup(manifest, configuredProviderIds) {
	return Object.entries(configuredProviderIds).some(([contractKey, providerIds]) => manifestOwnsConfiguredContract(manifest, contractKey, providerIds));
}
/** Evaluates manifest-owned startup surfaces in their original precedence order. */
function canStartGatewayStartupPlugin(params) {
	const { manifest, plugin, activationSource, config } = params;
	return manifestOwnsConfiguredContract(manifest, "decisionProviders", params.configuredDecisionProviderIds) && passesPluginStartupPolicy(params, "decision") || plugin.startup.agentHarnesses.some((runtime) => params.requiredAgentHarnessRuntimes.has(runtime)) && passesPluginStartupPolicy(params, "harness") || hasConfiguredActivationPath({
		manifest,
		config: activationSource.rootConfig ?? config
	}) && passesPluginStartupPolicy(params, "root") || manifestOwnsWorkerProvider(manifest, params.configuredWorkerProviderIds) && passesPluginStartupPolicy(params, "worker") || manifestOwnsStorageProvider(manifest, params.configuredStorageProviderIds) && passesPluginStartupPolicy(params, "storage") || manifestOwnsConfiguredContract(manifest, "speechProviders", params.configuredSpeechProviderIds) && passesPluginStartupPolicy(params, "speech") || manifestOwnsConfiguredContract(manifest, "webSearchProviders", params.configuredWebSearchProviderIds) && passesPluginStartupPolicy(params, "implicit-external") || params.autoSelectWebSearchProvider && (manifest?.contracts?.webSearchProviders?.length ?? 0) > 0 && passesPluginStartupPolicy(params, "web-search-auto") || manifestOwnsConfiguredModelProvider({
		manifest,
		configuredModelProviderIds: params.configuredModelProviderIds
	}) && passesPluginStartupPolicy(params, "provider") || manifestOwnsConfiguredContractGroup(manifest, params.configuredGenerationProviderIds) && passesPluginStartupPolicy(params, "provider") || manifestOwnsConfiguredContractGroup(manifest, params.configuredVoiceProviderIds) && passesPluginStartupPolicy(params, "provider") || manifestOwnsConfiguredContract(manifest, "embeddingProviders", params.configuredMemoryEmbeddingProviderIds) && passesPluginStartupPolicy(params, "implicit-external") || (manifest?.activation?.onCapabilities?.includes("hook") === true || hasExplicitHookPolicyConfig(activationSource.plugins.entries[normalizePluginPolicyId(plugin.pluginId)])) && passesPluginStartupPolicy(params, "hook") || (manifest?.contracts?.tools?.length ?? 0) > 0 && passesPluginStartupPolicy(params, "tool") || (manifest?.contracts?.trustedToolPolicies?.length ?? 0) > 0 && passesPluginStartupPolicy(params, "provider");
}
//#endregion
//#region src/plugins/gateway-startup-plugin-metadata.ts
function resolveGatewayStartupMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const activationSourceConfig = params.activationSourceConfig ?? params.config;
	const sameConfig = activationSourceConfig === params.config;
	const pluginsConfig = normalizePluginsConfigWithResolverCore(params.config.plugins, lookup.normalizePluginId);
	const activationSourcePlugins = sameConfig ? pluginsConfig : normalizePluginsConfigWithResolverCore(activationSourceConfig.plugins, lookup.normalizePluginId);
	if (!pluginsConfig.enabled || !activationSourcePlugins.enabled) return [];
	if (readStartupBundledDiscoveryMode(params.config, params.env) === "compat" || readStartupBundledDiscoveryMode(activationSourceConfig, params.env) === "compat") return;
	if (pluginsConfig.allow.length === 0 && activationSourcePlugins.allow.length === 0) return;
	const configs = sameConfig ? [params.config] : [params.config, activationSourceConfig];
	const pluginConfigs = sameConfig ? [pluginsConfig] : [pluginsConfig, activationSourcePlugins];
	const scope = new Set(pluginConfigs.flatMap((plugins) => plugins.allow.map(lookup.normalizePluginId)));
	for (const plugins of pluginConfigs) addPluginConfigEntryIds(scope, plugins, lookup.normalizePluginId);
	const memorySlotStartupPluginId = resolveMemorySlotStartupPluginId({
		activationSourceConfig,
		activationSourcePlugins,
		normalizePluginId: lookup.normalizePluginId
	});
	addConfiguredSlotPluginIds(scope, {
		activationSourceConfig,
		activationSourcePlugins,
		lookup
	});
	for (const pluginId of resolveAuthorizedGatewayStartupDreamingPluginIds({
		config: params.config,
		pluginsConfig,
		activationSource: {
			plugins: activationSourcePlugins,
			rootConfig: activationSourceConfig
		},
		activationSourcePlugins,
		selectedMemoryPluginId: memorySlotStartupPluginId,
		index: params.index,
		platform: params.platform
	})) scope.add(pluginId);
	if (!lookup.hasCompleteConfigPathActivationMetadata()) return;
	addConfiguredActivationPathPluginIds(scope, {
		activationSourceConfig,
		index: params.index
	});
	const configuredChannelIds = collectConfiguredStartupChannelIds({
		configs,
		env: params.env,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	if (!lookup.hasDirectChannelOwners(configuredChannelIds)) return;
	lookup.addDirectChannelOwners(scope, configuredChannelIds);
	const providerIds = configs.flatMap(collectConfiguredProviderIds);
	const validationRefs = configs.map(collectValidationConfiguredRefs);
	const configuredProviderIds = sortUniquePluginIds([...providerIds, ...validationRefs.flatMap((refs) => refs.providerIds)]);
	if (!lookup.canResolveDirectProviderIds(configuredProviderIds, scope)) return;
	lookup.addDirectProviderOwners(scope, configuredProviderIds);
	for (const resolveProviderIds of [
		() => configs.flatMap(getConfiguredDecisionProviderIds),
		() => normalizeWorkerProviderIds([...configs.flatMap(collectConfiguredWorkerProviderIds), ...params.workerProviderIds ?? []]),
		() => configs.flatMap(collectConfiguredStorageProviderIds)
	]) {
		const contributionProviderIds = resolveProviderIds();
		if (!lookup.hasProviderContributionOwners(contributionProviderIds)) return;
		lookup.addProviderContributionOwners(scope, contributionProviderIds);
	}
	const configuredShorthandModelIds = sortUniquePluginIds(validationRefs.flatMap((refs) => collectValidationConfiguredShorthandModelIds(refs.shorthandModelRefs)));
	if (!lookup.hasShorthandModelOwners(configuredShorthandModelIds)) return;
	lookup.addShorthandModelOwners(scope, configuredShorthandModelIds);
	addRequiredAgentHarnessPluginIds(scope, {
		activationSourceConfig,
		config: params.config,
		index: params.index,
		pluginsConfig,
		activationSource: {
			plugins: activationSourcePlugins,
			rootConfig: activationSourceConfig
		},
		env: params.env,
		platform: params.platform
	});
	const deniedPluginIds = new Set(pluginConfigs.flatMap((plugins) => plugins.deny));
	for (const pluginId of deniedPluginIds) scope.delete(lookup.normalizePluginId(pluginId));
	for (const plugins of pluginConfigs) for (const [pluginId, entry] of Object.entries(plugins.entries)) if (entry?.enabled === false) scope.delete(lookup.normalizePluginId(pluginId));
	if (!lookup.hasInstalledPluginIds(scope)) return;
	return sortUniquePluginIds(scope);
}
function createGatewayStartupMetadataPluginIdScope(params) {
	const workerProviderIds = normalizeWorkerProviderIds(params.workerProviderIds ?? []);
	return { resolve: ({ index }) => resolveGatewayStartupMetadataPluginIds({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		env: params.env,
		index,
		...workerProviderIds.length > 0 ? { workerProviderIds } : {},
		platform: params.platform,
		ambientEnvTriggers: params.ambientEnvTriggers
	}) };
}
//#endregion
//#region src/plugins/gateway-startup-plugin-plan.ts
function resolveChannelPluginIdsFromRegistry(params) {
	const { manifestRegistry } = params;
	return manifestRegistry.plugins.filter((plugin) => plugin.channels.length > 0).map((plugin) => plugin.id);
}
function resolveGatewayStartupPluginPlanFromRegistry(params) {
	const channelPluginIds = resolveChannelPluginIdsFromRegistry({ manifestRegistry: params.manifestRegistry });
	const activationSourceConfig = params.activationSourceConfig ?? params.config;
	const configuredChannelIds = new Set(listGatewayActivatedChannelIds({
		config: params.config,
		activationSourceConfig,
		env: params.env,
		ambientEnvTriggers: params.ambientEnvTriggers,
		manifestRecords: params.manifestRegistry.plugins,
		discovery: params.discovery
	}));
	const normalizePluginId = params.normalizePluginId ?? createPluginRegistryIdNormalizer(params.index, { manifestRegistry: params.manifestRegistry });
	const pluginsConfig = normalizePluginsConfigWithResolverCore(params.config.plugins, normalizePluginId);
	const activationSourcePlugins = normalizePluginsConfigWithResolverCore(activationSourceConfig.plugins, normalizePluginId);
	const activationSource = {
		plugins: activationSourcePlugins,
		rootConfig: activationSourceConfig
	};
	const manifestLookup = new Map(params.manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
	const explicitlyDisabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
	const startupParams = {
		config: params.config,
		pluginsConfig,
		activationSource,
		env: params.env,
		requiredAgentHarnessRuntimes: new Set(collectConfiguredAgentHarnessRuntimes(activationSourceConfig)),
		configuredSpeechProviderIds: collectConfiguredSpeechProviderIds(activationSourceConfig),
		configuredWebSearchProviderIds: collectConfiguredWebSearchProviderIds(activationSourceConfig),
		autoSelectWebSearchProvider: isWebSearchProviderAutoSelected(activationSourceConfig),
		configuredModelProviderIds: collectConfiguredAgentModelProviderIds(activationSourceConfig, params.manifestRegistry),
		configuredGenerationProviderIds: collectConfiguredGenerationProviderIds(activationSourceConfig),
		configuredVoiceProviderIds: collectConfiguredVoiceProviderIds(activationSourceConfig),
		configuredMemoryEmbeddingProviderIds: collectConfiguredMemoryEmbeddingProviderIds(activationSourceConfig),
		configuredDecisionProviderIds: new Set(getConfiguredDecisionProviderIds(activationSourceConfig)),
		configuredWorkerProviderIds: /* @__PURE__ */ new Set([...collectConfiguredWorkerProviderIds(activationSourceConfig), ...normalizeWorkerProviderIds(params.workerProviderIds ?? [])]),
		configuredStorageProviderIds: new Set(collectConfiguredStorageProviderIds(activationSourceConfig)),
		platform: params.platform
	};
	const memorySlotStartupPluginId = resolveMemorySlotStartupPluginId({
		activationSourceConfig,
		activationSourcePlugins,
		normalizePluginId
	});
	const startupDreamingPluginIds = resolveAuthorizedGatewayStartupDreamingPluginIds({
		config: params.config,
		pluginsConfig,
		activationSource,
		activationSourcePlugins,
		selectedMemoryPluginId: memorySlotStartupPluginId,
		index: params.index,
		platform: params.platform
	});
	const contextEngineSlotStartupPluginId = resolveContextEngineSlotStartupPluginId({
		activationSourceConfig,
		activationSourcePlugins,
		normalizePluginId
	});
	const pluginIds = [];
	for (const plugin of params.index.plugins) {
		const policyId = normalizePluginPolicyId(plugin.pluginId);
		const manifest = manifestLookup.get(plugin.pluginId);
		const manifestChannelIds = manifest?.channels ?? [];
		const hasEnabledManifestChannel = manifest?.channels?.some((channelId) => {
			const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
			return normalizedChannelId ? !explicitlyDisabledChannelIds.has(normalizedChannelId) : false;
		}) ?? false;
		const hasExplicitlyEnabledNonBundledChannel = plugin.origin !== "bundled" && hasEnabledManifestChannel && pluginsConfig.entries[policyId]?.enabled === true && !pluginsConfig.deny.includes(policyId);
		if (manifestChannelIds.some((channelId) => configuredChannelIds.has(channelId)) || hasExplicitlyEnabledNonBundledChannel) {
			if (canStartConfiguredChannelPlugin({
				id: plugin.pluginId,
				origin: plugin.origin,
				channelIds: plugin.origin === "bundled" ? manifestChannelIds : plugin.contributions?.channels,
				config: params.config,
				pluginsConfig,
				activationSource
			})) pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartGatewayStartupPlugin({
			...startupParams,
			plugin,
			manifest
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (!shouldConsiderForGatewayStartup({
			plugin,
			manifest,
			startupDreamingPluginIds,
			memorySlotStartupPluginId,
			contextEngineSlotStartupPluginId
		})) continue;
		if (startupDreamingPluginIds.has(plugin.pluginId)) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		const startupPolicyOrigin = plugin.origin === "bundled" && plugin.packageBuild?.bundledDist === false ? "workspace" : plugin.origin;
		const activationState = resolveEffectivePluginActivationState({
			id: plugin.pluginId,
			origin: startupPolicyOrigin,
			channelIds: plugin.contributions?.channels,
			config: pluginsConfig,
			rootConfig: params.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin, params.platform),
			activationSource
		});
		if (!activationState.enabled) continue;
		if (startupPolicyOrigin !== "bundled" ? activationState.explicitlyEnabled : activationState.source === "explicit" || activationState.source === "default") pluginIds.push(plugin.pluginId);
	}
	return {
		channelPluginIds,
		pluginIds
	};
}
//#endregion
//#region src/plugins/gateway-startup-plugin-loader.ts
function resolveChannelPluginIds(params) {
	return [...loadGatewayStartupPluginPlan(params).channelPluginIds];
}
function loadGatewayStartupPluginPlanWithMetadata(params) {
	const snapshotConfig = params.activationSourceConfig ?? params.config;
	const metadataSnapshot = params.metadataSnapshot ?? resolvePluginMetadataSnapshot({
		config: snapshotConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0,
		...params.index ? { index: params.index } : {},
		pluginIdScope: createGatewayStartupMetadataPluginIdScope({
			config: params.config,
			activationSourceConfig: params.activationSourceConfig,
			env: params.env,
			workerProviderIds: params.workerProviderIds ?? [],
			platform: params.platform,
			ambientEnvTriggers: params.ambientEnvTriggers
		})
	});
	const startupPlanStartedAt = performance.now();
	return {
		plan: resolveGatewayStartupPluginPlanFromRegistry({
			config: params.config,
			activationSourceConfig: params.activationSourceConfig,
			env: params.env,
			index: metadataSnapshot.index,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			discovery: metadataSnapshot.discovery,
			normalizePluginId: metadataSnapshot.normalizePluginId,
			workerProviderIds: params.workerProviderIds ?? [],
			platform: params.platform,
			ambientEnvTriggers: params.ambientEnvTriggers
		}),
		metadataSnapshot,
		startupPlanMs: performance.now() - startupPlanStartedAt
	};
}
function loadGatewayStartupPluginPlan(params) {
	return loadGatewayStartupPluginPlanWithMetadata(params).plan;
}
//#endregion
export { resolveGatewayStartupPluginPlanFromRegistry as a, resolveChannelPluginIdsFromRegistry as i, loadGatewayStartupPluginPlanWithMetadata as n, createGatewayStartupMetadataPluginIdScope as o, resolveChannelPluginIds as r, resolveGatewayStartupMetadataPluginIds as s, loadGatewayStartupPluginPlan as t };
