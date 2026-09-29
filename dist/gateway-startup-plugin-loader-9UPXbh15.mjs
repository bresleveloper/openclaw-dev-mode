import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { m as withBundledPluginEnablementCompat, p as isBundledProviderCompatPlugin } from "./installed-plugin-index-D0kh4WcK.mjs";
import { n as normalizePluginsConfigWithResolverCore } from "./config-normalization-shared-B7M6gfm-.mjs";
import { d as resolveEffectivePluginActivationState, l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { h as createPluginRegistryIdNormalizer, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import "./plugin-registry-contributions-CHC0CCKR.mjs";
import { n as listExplicitlyDisabledChannelIdsForConfig } from "./config-presence-D97iwlYy.mjs";
import { c as listGatewayActivatedChannelIds } from "./channel-presence-policy-C83ks5im.mjs";
import { t as canStartConfiguredChannelPlugin } from "./channel-startup-policy-C2yOEe0U.mjs";
import { S as collectConfiguredWebSearchProviderIds, T as manifestOwnsConfiguredModelProvider, _ as collectConfiguredAgentModelProviderIds, a as collectConfiguredProviderIds, c as collectValidationConfiguredShorthandModelIds, d as readStartupBundledDiscoveryMode, f as resolveAuthorizedGatewayStartupDreamingPluginIds, g as sortUniquePluginIds, h as shouldConsiderForGatewayStartup, i as blocksPluginStartup, l as hasConfiguredActivationPath, m as resolveMemorySlotStartupPluginId, n as addConfiguredSlotPluginIds, o as collectConfiguredStartupChannelIds, p as resolveContextEngineSlotStartupPluginId, r as addPluginConfigEntryIds, s as collectValidationConfiguredRefs, t as addConfiguredActivationPathPluginIds, u as normalizePluginsConfigForInstalledIndex, v as collectConfiguredGenerationProviderIds, x as collectConfiguredVoiceProviderIds, y as collectConfiguredMemoryEmbeddingProviderIds } from "./gateway-startup-plugin-config-AVh0bjkO.mjs";
import { t as getConfiguredDecisionProviderIds } from "./decision-model-setting-BX2feN2y.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-DBwiH9TR.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-CXRk02Zm.mjs";
import { n as normalizeWorkerProviderIds, t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-OOjrHh-W.mjs";
import { n as manifestOwnsWorkerProvider } from "./worker-provider-manifest-nXb1-dX2.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-Dl4k2vJA.mjs";
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
	return policy === "provider" || policy === "worker" || policy === "speech" || policy === "implicit-external";
}
function hasExplicitHookPolicyConfig(entry) {
	return entry?.hooks?.allowConversationAccess === true || entry?.hooks?.allowPromptInjection === true || entry?.hooks?.timeoutMs !== void 0 || entry?.hooks?.timeouts !== void 0 && Object.keys(entry.hooks.timeouts).length > 0;
}
function passesPluginStartupPolicy(params, policy) {
	const { activationSource, plugin, pluginsConfig } = params;
	if (policy !== "speech" && (!pluginsConfig.enabled || !activationSource.plugins.enabled) || blocksPluginStartup({
		pluginId: plugin.pluginId,
		pluginsConfig,
		activationSourcePlugins: activationSource.plugins
	})) return false;
	if (policy === "harness" && [pluginsConfig, activationSource.plugins].some((config) => config.allow.length > 0 && !config.allow.includes(plugin.pluginId))) return false;
	const bundled = plugin.origin === "bundled";
	if (bundled && (policy === "harness" || policy === "speech" || policy === "root")) return true;
	if (policy === "root" && activationSource.plugins.allow.length > 0 && !activationSource.plugins.allow.includes(plugin.pluginId)) return false;
	const activationState = resolveStartupActivationState(params, policy === "worker" ? "cloud worker provider required" : policy === "decision" ? "decision model selected" : void 0, isProviderCompatStartupPolicy(policy) && isBundledProviderCompatPlugin({
		origin: plugin.origin,
		providers: plugin.contributions?.providers,
		contracts: plugin.contributions?.contracts
	}));
	if (!activationState.enabled) return false;
	if (policy === "harness" || policy === "implicit-external" || policy === "decision") return true;
	if (policy === "hook") return activationState.explicitlyEnabled || hasExplicitHookPolicyConfig(activationSource.plugins.entries[plugin.pluginId]);
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
const GATEWAY_STARTUP_ACTIVATION_POLICIES = [
	{
		policy: "decision",
		matches: ({ manifest, configuredDecisionProviderIds }) => manifestOwnsConfiguredContract(manifest, "decisionProviders", configuredDecisionProviderIds)
	},
	{
		policy: "harness",
		matches: ({ plugin, requiredAgentHarnessRuntimes }) => plugin.startup.agentHarnesses.some((runtime) => requiredAgentHarnessRuntimes.has(runtime))
	},
	{
		policy: "root",
		matches: ({ manifest, activationSource, config }) => hasConfiguredActivationPath({
			manifest,
			config: activationSource.rootConfig ?? config
		})
	},
	{
		policy: "worker",
		matches: ({ manifest, configuredWorkerProviderIds }) => manifestOwnsWorkerProvider(manifest, configuredWorkerProviderIds)
	},
	{
		policy: "speech",
		matches: ({ manifest, configuredSpeechProviderIds }) => manifestOwnsConfiguredContract(manifest, "speechProviders", configuredSpeechProviderIds)
	},
	{
		policy: "implicit-external",
		matches: ({ manifest, configuredWebSearchProviderIds }) => manifestOwnsConfiguredContract(manifest, "webSearchProviders", configuredWebSearchProviderIds)
	},
	{
		policy: "provider",
		matches: ({ manifest, configuredModelProviderIds }) => manifestOwnsConfiguredModelProvider({
			manifest,
			configuredModelProviderIds
		})
	},
	{
		policy: "provider",
		matches: ({ manifest, configuredGenerationProviderIds }) => manifestOwnsConfiguredContractGroup(manifest, configuredGenerationProviderIds)
	},
	{
		policy: "provider",
		matches: ({ manifest, configuredVoiceProviderIds }) => manifestOwnsConfiguredContractGroup(manifest, configuredVoiceProviderIds)
	},
	{
		policy: "implicit-external",
		matches: ({ manifest, configuredMemoryEmbeddingProviderIds }) => manifestOwnsConfiguredContract(manifest, "embeddingProviders", configuredMemoryEmbeddingProviderIds)
	},
	{
		policy: "hook",
		matches: ({ activationSource, manifest, plugin }) => manifest?.activation?.onCapabilities?.includes("hook") === true || hasExplicitHookPolicyConfig(activationSource.plugins.entries[plugin.pluginId])
	},
	{
		policy: "tool",
		matches: ({ manifest }) => (manifest?.contracts?.tools?.length ?? 0) > 0
	},
	{
		policy: "provider",
		matches: ({ manifest }) => (manifest?.contracts?.trustedToolPolicies?.length ?? 0) > 0
	}
];
/** Evaluates manifest-owned startup surfaces in their original precedence order. */
function canStartGatewayStartupPlugin(params) {
	return GATEWAY_STARTUP_ACTIVATION_POLICIES.some(({ matches, policy }) => matches(params) && passesPluginStartupPolicy(params, policy));
}
//#endregion
//#region src/plugins/gateway-startup-plugin-metadata.ts
function resolveGatewayStartupMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const activationSourceConfig = params.activationSourceConfig ?? params.config;
	const sameConfig = activationSourceConfig === params.config;
	const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config.plugins, lookup);
	const activationSourcePlugins = sameConfig ? pluginsConfig : normalizePluginsConfigForInstalledIndex(activationSourceConfig.plugins, lookup);
	if (!pluginsConfig.enabled || !activationSourcePlugins.enabled) return [];
	if (readStartupBundledDiscoveryMode(params.config, params.env) === "compat" || readStartupBundledDiscoveryMode(activationSourceConfig, params.env) === "compat") return;
	if (pluginsConfig.allow.length === 0 && activationSourcePlugins.allow.length === 0) return;
	const configs = sameConfig ? [params.config] : [params.config, activationSourceConfig];
	const pluginConfigs = sameConfig ? [pluginsConfig] : [pluginsConfig, activationSourcePlugins];
	const scope = new Set(pluginConfigs.flatMap((plugins) => plugins.allow));
	for (const plugins of pluginConfigs) addPluginConfigEntryIds(scope, plugins);
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
		ambientEnvTriggers: params.ambientEnvTriggers,
		includePersistedAuthState: false
	});
	if (!lookup.hasDirectChannelOwners(configuredChannelIds)) return;
	lookup.addDirectChannelOwners(scope, configuredChannelIds);
	const providerIds = configs.flatMap(collectConfiguredProviderIds);
	const validationRefs = configs.map(collectValidationConfiguredRefs);
	const configuredProviderIds = sortUniquePluginIds([...providerIds, ...validationRefs.flatMap((refs) => refs.providerIds)]);
	if (!lookup.canResolveDirectProviderIds(configuredProviderIds, scope)) return;
	lookup.addDirectProviderOwners(scope, configuredProviderIds);
	const decisionProviderIds = configs.flatMap(getConfiguredDecisionProviderIds);
	if (!lookup.hasProviderContributionOwners(decisionProviderIds)) return;
	lookup.addProviderContributionOwners(scope, decisionProviderIds);
	const workerProviderIds = normalizeWorkerProviderIds([...configs.flatMap(collectConfiguredWorkerProviderIds), ...params.workerProviderIds ?? []]);
	if (!lookup.hasProviderContributionOwners(workerProviderIds)) return;
	lookup.addProviderContributionOwners(scope, workerProviderIds);
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
	for (const pluginId of deniedPluginIds) scope.delete(pluginId);
	for (const plugins of pluginConfigs) for (const [pluginId, entry] of Object.entries(plugins.entries)) if (entry?.enabled === false) scope.delete(pluginId);
	if (!lookup.hasInstalledPluginIds(scope)) return;
	return sortUniquePluginIds(scope);
}
function createGatewayStartupMetadataPluginIdScope(params) {
	const workerProviderIds = normalizeWorkerProviderIds(params.workerProviderIds ?? []);
	return { resolve: ({ index }) => resolveGatewayStartupMetadataPluginIds({
		config: params.config,
		...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
		env: params.env,
		index,
		...workerProviderIds.length > 0 ? { workerProviderIds } : {},
		...params.platform !== void 0 ? { platform: params.platform } : {},
		...params.ambientEnvTriggers !== void 0 ? { ambientEnvTriggers: params.ambientEnvTriggers } : {}
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
	const requiredAgentHarnessRuntimes = new Set(collectConfiguredAgentHarnessRuntimes(activationSourceConfig));
	const configuredSpeechProviderIds = collectConfiguredSpeechProviderIds(activationSourceConfig);
	const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(activationSourceConfig);
	const configuredModelProviderIds = collectConfiguredAgentModelProviderIds(activationSourceConfig, params.manifestRegistry);
	const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(activationSourceConfig);
	const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(activationSourceConfig);
	const configuredMemoryEmbeddingProviderIds = collectConfiguredMemoryEmbeddingProviderIds(activationSourceConfig);
	const configuredDecisionProviderIds = new Set(getConfiguredDecisionProviderIds(activationSourceConfig));
	const configuredWorkerProviderIds = /* @__PURE__ */ new Set([...collectConfiguredWorkerProviderIds(activationSourceConfig), ...normalizeWorkerProviderIds(params.workerProviderIds ?? [])]);
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
		const manifest = manifestLookup.get(plugin.pluginId);
		const manifestChannelIds = manifest?.channels ?? [];
		const hasEnabledManifestChannel = manifest?.channels?.some((channelId) => {
			const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
			return normalizedChannelId ? !explicitlyDisabledChannelIds.has(normalizedChannelId) : false;
		}) ?? false;
		const hasExplicitlyEnabledNonBundledChannel = plugin.origin !== "bundled" && hasEnabledManifestChannel && pluginsConfig.entries[plugin.pluginId]?.enabled === true && !pluginsConfig.deny.includes(plugin.pluginId);
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
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			env: params.env,
			requiredAgentHarnessRuntimes,
			configuredWorkerProviderIds,
			configuredSpeechProviderIds,
			configuredWebSearchProviderIds,
			configuredModelProviderIds,
			configuredGenerationProviderIds,
			configuredVoiceProviderIds,
			configuredMemoryEmbeddingProviderIds,
			configuredDecisionProviderIds,
			platform: params.platform
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
			...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
			env: params.env,
			workerProviderIds: params.workerProviderIds ?? [],
			...params.platform !== void 0 ? { platform: params.platform } : {},
			...params.ambientEnvTriggers !== void 0 ? { ambientEnvTriggers: params.ambientEnvTriggers } : {}
		})
	});
	const startupPlanStartedAt = performance.now();
	return {
		plan: resolveGatewayStartupPluginPlanFromRegistry({
			config: params.config,
			...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
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
