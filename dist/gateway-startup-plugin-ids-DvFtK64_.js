import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { g as compileSafeRegex } from "./redact-CQ2tlRRk.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { i as normalizeProviderId, n as findNormalizedProviderValue } from "./provider-id-Dq06Bcx6.js";
import { r as buildModelCatalogMergeKey } from "./model-catalog-normalize-CkJjoy4K.js";
import { i as normalizePluginsConfigWithResolver } from "./config-normalization-shared-B5SNet8_.js";
import { l as resolveEffectivePluginActivationState, n as createPluginActivationSource, o as normalizePluginId, s as normalizePluginsConfig } from "./config-state-6HQcbL-X.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { a as resolveManifestOwnerBasePolicyBlock, i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-DnbmOuKf.js";
import "./agent-scope-CDZXADgT.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { g as hashJson } from "./installed-plugin-index-C6bCYWRE.js";
import { _ as createPluginRegistryIdNormalizer, n as loadPluginManifestRegistryForPluginRegistry, r as normalizePluginsConfigWithRegistry } from "./plugin-registry-DYM918bn.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CxGHASZV.js";
import "./config-contracts-DRnPzwa7.js";
import { a as resolvePluginMetadataSnapshot, n as isPluginMetadataSnapshotCompatible } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { _ as collectConfiguredModelRefs, d as listPotentialConfiguredChannelIds, f as listPotentialConfiguredChannelPresenceSignals, l as hasMeaningfulChannelConfig, n as normalizeConfiguredSpeechProviderIdForStartup, t as collectConfiguredSpeechProviderIds, u as listExplicitlyDisabledChannelIdsForConfig } from "./gateway-startup-speech-providers-CQCz_cL7.js";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes--3bc5qch.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { J as resolveMemoryDreamingPluginId, K as resolveMemoryDreamingConfig, q as resolveMemoryDreamingPluginConfig, v as DEFAULT_MEMORY_DREAMING_PLUGIN_ID } from "./dreaming-DFdUxl07.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-BaCUlysk.js";
import { t as isSafeChannelEnvVarTriggerName } from "./channel-env-var-names-DsCXktaU.js";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-Bh9IFehs.js";
//#region src/plugins/channel-presence-policy.ts
const IGNORED_CHANNEL_CONFIG_KEYS = new Set(["defaults", "modelByChannel"]);
const ANNOUNCE_SUPPRESSING_BLOCKED_REASONS = new Set([
	"plugins-disabled",
	"blocked-by-denylist",
	"plugin-disabled"
]);
function normalizeChannelIds(channelIds) {
	return sortUniqueStrings([...channelIds].flatMap((channelId) => {
		const normalized = normalizeOptionalLowercaseString(channelId);
		return normalized ? [normalized] : [];
	}));
}
function hasNonEmptyEnvValue(env, key) {
	if (!isSafeChannelEnvVarTriggerName(key)) return false;
	const trimmed = key.trim();
	const value = env[trimmed] ?? env[trimmed.toUpperCase()];
	return typeof value === "string" && value.trim().length > 0;
}
/** True when config contains meaningful enabled channel settings. */
function hasExplicitChannelConfig(params) {
	const channels = params.config.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
	const entry = channels[params.channelId];
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
	const enabled = entry.enabled;
	if (enabled === false) return false;
	return enabled === true || hasMeaningfulChannelConfig(entry);
}
/** Lists explicitly configured channel ids, excluding global channel config keys. */
function listExplicitConfiguredChannelIdsForConfig(config) {
	const channels = config.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return [];
	return Object.keys(channels).filter((channelId) => !IGNORED_CHANNEL_CONFIG_KEYS.has(channelId) && hasExplicitChannelConfig({
		config,
		channelId
	})).toSorted((left, right) => left.localeCompare(right));
}
function recordDeclaresChannel(record, channelId) {
	const normalizedChannelId = normalizeOptionalLowercaseString(channelId) ?? "";
	if (!normalizedChannelId) return false;
	return record.channels.some((ownedChannelId) => (normalizeOptionalLowercaseString(ownedChannelId) ?? "") === normalizedChannelId);
}
function listManifestEnvConfiguredChannelSignals(params) {
	const signals = [];
	const seen = /* @__PURE__ */ new Set();
	const trustConfig = params.activationSourceConfig ?? params.config;
	const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
	for (const record of params.records) {
		if (!isChannelPluginEligibleForScopedOwnership({
			plugin: record,
			normalizedConfig,
			rootConfig: trustConfig
		})) continue;
		for (const channelId of record.channels) {
			if (!(record.channelEnvVars?.[channelId] ?? []).some((envVar) => hasNonEmptyEnvValue(params.env, envVar))) continue;
			if (seen.has(channelId)) continue;
			seen.add(channelId);
			signals.push({
				channelId,
				source: "manifest-env"
			});
		}
	}
	return signals.toSorted((left, right) => left.channelId.localeCompare(right.channelId));
}
function normalizeActivationBlockedReason(reason) {
	switch (reason) {
		case "plugins disabled": return "plugins-disabled";
		case "blocked by denylist": return "blocked-by-denylist";
		case "disabled in config": return "plugin-disabled";
		case "not in allowlist": return "not-in-allowlist";
		case "workspace plugin (disabled by default)": return "workspace-disabled-by-default";
		case "bundled (disabled by default)": return "bundled-disabled-by-default";
		default: return "not-activated";
	}
}
function resolveBasePolicyBlockedReason(params) {
	return resolveManifestOwnerBasePolicyBlock(params);
}
function isChannelPluginEligibleForScopedOwnership(params) {
	const allowRestrictiveAllowlistBypass = params.channelId !== void 0 && isBundledManifestOwner(params.plugin) && hasExplicitChannelConfig({
		config: params.rootConfig,
		channelId: params.channelId
	});
	if (!passesManifestOwnerBasePolicy({
		plugin: params.plugin,
		normalizedConfig: params.normalizedConfig,
		allowRestrictiveAllowlistBypass
	})) return false;
	if (isBundledManifestOwner(params.plugin)) return true;
	if (params.plugin.origin === "global" || params.plugin.origin === "config") return hasExplicitManifestOwnerTrust({
		plugin: params.plugin,
		normalizedConfig: params.normalizedConfig
	});
	return isActivatedManifestOwner({
		plugin: params.plugin,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.rootConfig
	});
}
function evaluateEffectiveChannelPlugin(params) {
	const explicitBundledChannelConfig = isBundledManifestOwner(params.plugin) && hasExplicitChannelConfig({
		config: params.activationSource.rootConfig ?? params.config,
		channelId: params.channelId
	});
	const baseBlockedReason = resolveBasePolicyBlockedReason({
		plugin: params.plugin,
		normalizedConfig: params.normalizedConfig,
		allowRestrictiveAllowlistBypass: explicitBundledChannelConfig
	});
	if (baseBlockedReason) return {
		effective: false,
		pluginId: params.plugin.id,
		blockedReason: baseBlockedReason
	};
	if (!isBundledManifestOwner(params.plugin)) {
		if (params.plugin.origin === "global" || params.plugin.origin === "config") return hasExplicitManifestOwnerTrust({
			plugin: params.plugin,
			normalizedConfig: params.normalizedConfig
		}) ? {
			effective: true,
			pluginId: params.plugin.id
		} : {
			effective: false,
			pluginId: params.plugin.id,
			blockedReason: "untrusted-plugin"
		};
		return isActivatedManifestOwner({
			plugin: params.plugin,
			normalizedConfig: params.normalizedConfig,
			rootConfig: params.activationSource.rootConfig
		}) ? {
			effective: true,
			pluginId: params.plugin.id
		} : {
			effective: false,
			pluginId: params.plugin.id,
			blockedReason: "untrusted-plugin"
		};
	}
	if (explicitBundledChannelConfig) return {
		effective: true,
		pluginId: params.plugin.id
	};
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.id,
		origin: params.plugin.origin,
		config: params.normalizedConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin),
		activationSource: params.activationSource
	});
	return activationState.enabled ? {
		effective: true,
		pluginId: params.plugin.id
	} : {
		effective: false,
		pluginId: params.plugin.id,
		blockedReason: normalizeActivationBlockedReason(activationState.reason)
	};
}
function addPolicySignal(entries, channelId, source) {
	const normalized = normalizeOptionalLowercaseString(channelId);
	if (!normalized) return;
	let sources = entries.get(normalized);
	if (!sources) {
		sources = /* @__PURE__ */ new Set();
		entries.set(normalized, sources);
	}
	sources.add(source);
}
function loadInstalledChannelManifestRecords(params) {
	return loadPluginManifestRegistryForPluginRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeDisabled: true
	}).plugins;
}
/** Resolves effective configured-channel policy rows from config, auth state, env, and manifests. */
function resolveConfiguredChannelPresencePolicy(params) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, resolveDefaultAgentId(params.config));
	const records = params.manifestRecords ?? loadInstalledChannelManifestRecords({
		config: params.config,
		workspaceDir,
		env
	});
	const disabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
	const entrySources = /* @__PURE__ */ new Map();
	for (const channelId of listExplicitConfiguredChannelIdsForConfig(params.config)) addPolicySignal(entrySources, channelId, "explicit-config");
	for (const signal of listPotentialConfiguredChannelPresenceSignals(params.config, env, { includePersistedAuthState: params.includePersistedAuthState })) {
		if (signal.source === "config") continue;
		addPolicySignal(entrySources, signal.channelId, signal.source);
	}
	for (const signal of listManifestEnvConfiguredChannelSignals({
		records,
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		env
	})) addPolicySignal(entrySources, signal.channelId, signal.source);
	for (const channelId of disabledChannelIds) entrySources.delete(channelId);
	const activationSource = createPluginActivationSource({ config: params.activationSourceConfig ?? params.config });
	const normalizedConfig = activationSource.plugins;
	const entries = [];
	for (const channelId of normalizeChannelIds(entrySources.keys())) {
		const owningRecords = records.filter((record) => recordDeclaresChannel(record, channelId));
		const evaluations = owningRecords.map((plugin) => evaluateEffectiveChannelPlugin({
			plugin,
			channelId,
			normalizedConfig,
			config: params.config,
			activationSource
		}));
		const effectivePluginIds = evaluations.filter((entry) => entry.effective).map((entry) => entry.pluginId);
		const blockedReasons = owningRecords.length === 0 ? ["no-channel-owner"] : [...new Set(evaluations.map((entry) => entry.blockedReason).filter((reason) => Boolean(reason)))].toSorted((left, right) => left.localeCompare(right));
		entries.push({
			channelId,
			sources: [...entrySources.get(channelId) ?? []].toSorted((left, right) => left.localeCompare(right)),
			effective: effectivePluginIds.length > 0,
			pluginIds: sortUniqueStrings(effectivePluginIds),
			blockedReasons
		});
	}
	return entries;
}
/** Lists effective channel ids available to read-only scoped discovery. */
function listConfiguredChannelIdsForReadOnlyScope(params) {
	return resolveConfiguredChannelPresencePolicy(params).filter((entry) => entry.effective).map((entry) => entry.channelId);
}
/** True when read-only scoped discovery has any effective configured channel. */
function hasConfiguredChannelsForReadOnlyScope(params) {
	return listConfiguredChannelIdsForReadOnlyScope(params).length > 0;
}
/** Lists channel ids that should be announced as configured for operators. */
function listConfiguredAnnounceChannelIdsForConfig(params) {
	const disabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
	const trustConfig = params.activationSourceConfig ?? params.config;
	const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
	const policy = resolveConfiguredChannelPresencePolicy({
		config: params.config,
		activationSourceConfig: trustConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includePersistedAuthState: false,
		manifestRecords: params.manifestRecords
	});
	const policyDisabledChannelIds = new Set(policy.filter((entry) => !entry.effective && entry.blockedReasons.some((reason) => ANNOUNCE_SUPPRESSING_BLOCKED_REASONS.has(reason))).map((entry) => entry.channelId));
	return normalizeChannelIds([...listExplicitConfiguredChannelIdsForConfig(params.config).filter((channelId) => normalizedConfig.enabled && !normalizedConfig.deny.includes(channelId) && normalizedConfig.entries[channelId]?.enabled !== false && (normalizedConfig.allow.length === 0 || normalizedConfig.allow.includes(channelId))), ...policy.filter((entry) => entry.effective).map((entry) => entry.channelId)]).filter((channelId) => !disabledChannelIds.has(channelId) && !policyDisabledChannelIds.has(channelId));
}
function resolveScopedChannelOwnerPluginIds(params) {
	const channelIds = normalizeChannelIds(params.channelIds);
	if (channelIds.length === 0) return [];
	const records = params.manifestRecords ?? loadInstalledChannelManifestRecords({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const trustConfig = params.activationSourceConfig ?? params.config;
	const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
	const candidateIds = sortUniqueStrings(channelIds.flatMap((channelId) => {
		return resolveManifestActivationPluginIds({
			trigger: {
				kind: "channel",
				channel: channelId
			},
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			manifestRecords: records,
			allowRestrictiveAllowlistBypass: hasExplicitChannelConfig({
				config: trustConfig,
				channelId
			})
		});
	}));
	if (candidateIds.length === 0) return [];
	const candidateIdSet = new Set(candidateIds);
	return records.filter((plugin) => {
		if (!candidateIdSet.has(plugin.id)) return false;
		return isChannelPluginEligibleForScopedOwnership({
			plugin,
			normalizedConfig,
			rootConfig: trustConfig,
			channelId: channelIds.find((channelId) => recordDeclaresChannel(plugin, channelId))
		});
	}).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
/** Resolves plugin ids discoverable for scoped channel activation. */
function resolveDiscoverableScopedChannelPluginIds(params) {
	return resolveScopedChannelOwnerPluginIds(params);
}
/** Resolves plugin ids that own currently configured channels. */
function resolveConfiguredChannelPluginIds(params) {
	const configuredChannelIds = normalizeChannelIds([...listConfiguredChannelIdsForReadOnlyScope({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		env: params.env
	}), ...listExplicitConfiguredChannelIdsForConfig(params.activationSourceConfig ?? params.config)]);
	if (configuredChannelIds.length === 0) return [];
	return resolveScopedChannelOwnerPluginIds({
		...params,
		channelIds: configuredChannelIds
	});
}
//#endregion
//#region src/plugins/embedding-provider-config.ts
const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = new Set(["openai-completions", "openai-responses"]);
function resolveConfiguredProviderConfig(providerId, cfg) {
	const providers = cfg?.models?.providers;
	if (!providers) return;
	const normalized = normalizeProviderId(providerId);
	return providers[providerId] ?? Object.entries(providers).find(([candidateId]) => normalizeProviderId(candidateId) === normalized)?.[1];
}
/** Reads a configured provider's backing API id when runtime lookup should follow an alias. */
function readConfiguredProviderApiId(params) {
	const providerConfig = resolveConfiguredProviderConfig(params.providerId, params.cfg);
	if (!providerConfig) return;
	const normalized = normalizeProviderId(params.providerId);
	const api = providerConfig.api?.trim();
	const resolvedProviderId = api ? params.resolveApiProviderId?.(normalizeProviderId(api)) ?? normalizeProviderId(api) : params.resolveMissingApiProviderId?.(providerConfig);
	return resolvedProviderId && resolvedProviderId !== normalized ? resolvedProviderId : void 0;
}
function resolveConfiguredGenericEmbeddingProviderId(providerId, cfg) {
	return readConfiguredProviderApiId({
		providerId,
		cfg,
		resolveApiProviderId: (normalizedApiId) => OPENAI_COMPATIBLE_MODEL_APIS.has(normalizedApiId) ? OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID : normalizedApiId,
		resolveMissingApiProviderId: (providerConfig) => providerConfig.baseUrl?.trim() ? OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID : void 0
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-scope-lookup.ts
const PROVIDER_CONTRIBUTION_CONTRACTS = [
	"externalAuthProviders",
	"embeddingProviders",
	"memoryEmbeddingProviders",
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders",
	"mediaUnderstandingProviders",
	"meetingNotesSourceProviders",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webFetchProviders",
	"webSearchProviders"
];
function appendOwner(owners, rawKey, pluginId) {
	const key = normalizeOptionalLowercaseString(rawKey);
	if (!key) return;
	const existing = owners.get(key);
	if (existing) {
		existing.push(pluginId);
		return;
	}
	owners.set(key, [pluginId]);
}
function freezeOwnerMap(owners) {
	return new Map([...owners.entries()].map(([key, pluginIds]) => [key, Object.freeze([...new Set(pluginIds)])]));
}
function addOwners(target, owners, ids) {
	for (const id of ids) {
		const normalized = normalizeOptionalLowercaseString(id);
		if (!normalized) continue;
		for (const pluginId of owners.get(normalized) ?? []) target.add(pluginId);
	}
}
function hasOwners(owners, ids) {
	return ids.every((id) => {
		const normalized = normalizeOptionalLowercaseString(id);
		return Boolean(normalized && owners.has(normalized));
	});
}
function listContributionValues(plugin, key) {
	const value = plugin.contributions?.[key];
	return Array.isArray(value) ? value : [];
}
function listContractContributionValues(plugin, key) {
	const value = plugin.contributions?.contracts?.[key];
	return Array.isArray(value) ? value : [];
}
function compileModelSupportPatterns(patterns) {
	const compiled = [];
	for (const pattern of patterns) {
		const regex = compileSafeRegex(pattern, "u");
		if (regex) compiled.push(regex);
	}
	return compiled;
}
function modelSupportOwnerMatches(owner, modelId) {
	const trimmed = modelId.trim();
	if (!trimmed) return false;
	if (owner.prefixes.some((prefix) => trimmed.startsWith(prefix))) return true;
	return owner.patterns.some((pattern) => pattern.test(trimmed));
}
function buildLookupMaps(index) {
	const channelContributionOwners = /* @__PURE__ */ new Map();
	const directChannelOwners = /* @__PURE__ */ new Map();
	const directProviderOwners = /* @__PURE__ */ new Map();
	const pluginIdsByLowercase = /* @__PURE__ */ new Map();
	const providerContributionOwners = /* @__PURE__ */ new Map();
	const modelSupportOwners = [];
	for (const plugin of index.plugins) {
		const normalizedPluginId = normalizeOptionalLowercaseString(plugin.pluginId);
		if (normalizedPluginId) {
			pluginIdsByLowercase.set(normalizedPluginId, plugin.pluginId);
			appendOwner(directChannelOwners, plugin.pluginId, plugin.pluginId);
			appendOwner(directProviderOwners, plugin.pluginId, plugin.pluginId);
			appendOwner(channelContributionOwners, plugin.pluginId, plugin.pluginId);
			appendOwner(providerContributionOwners, plugin.pluginId, plugin.pluginId);
		}
		appendOwner(directChannelOwners, plugin.packageChannel?.id, plugin.pluginId);
		appendOwner(channelContributionOwners, plugin.packageChannel?.id, plugin.pluginId);
		for (const channelId of listContributionValues(plugin, "channels")) appendOwner(channelContributionOwners, channelId, plugin.pluginId);
		for (const channelId of listContributionValues(plugin, "channelConfigs")) appendOwner(channelContributionOwners, channelId, plugin.pluginId);
		for (const providerId of listContributionValues(plugin, "providers")) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		for (const providerId of listContributionValues(plugin, "modelCatalogProviders")) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		for (const providerId of listContributionValues(plugin, "autoEnableProviderIds")) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		for (const contract of PROVIDER_CONTRIBUTION_CONTRACTS) for (const providerId of listContractContributionValues(plugin, contract)) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		modelSupportOwners.push({
			pluginId: plugin.pluginId,
			prefixes: listContributionValues(plugin, "modelSupportPrefixes"),
			patterns: compileModelSupportPatterns(listContributionValues(plugin, "modelSupportPatterns"))
		});
	}
	return {
		channelContributionOwners: freezeOwnerMap(channelContributionOwners),
		directChannelOwners: freezeOwnerMap(directChannelOwners),
		directProviderOwners: freezeOwnerMap(directProviderOwners),
		installedPluginIds: new Set(pluginIdsByLowercase.keys()),
		modelSupportOwners,
		pluginIdsByLowercase,
		providerContributionOwners: freezeOwnerMap(providerContributionOwners)
	};
}
function createInstalledPluginIndexScopeLookup(index) {
	const maps = buildLookupMaps(index);
	const normalizeInstalledPluginId = (pluginId) => {
		const normalized = normalizePluginId(pluginId);
		const lowercase = normalizeOptionalLowercaseString(normalized);
		return lowercase ? maps.pluginIdsByLowercase.get(lowercase) ?? normalized : normalized;
	};
	return {
		addChannelContributionOwners: (target, ids) => addOwners(target, maps.channelContributionOwners, ids),
		addDirectChannelOwners: (target, ids) => addOwners(target, maps.directChannelOwners, ids),
		addDirectProviderOwners: (target, ids) => addOwners(target, maps.directProviderOwners, ids),
		addProviderContributionOwners: (target, ids) => addOwners(target, maps.providerContributionOwners, ids),
		addShorthandModelOwners: (target, modelIds) => {
			for (const modelId of modelIds) for (const owner of maps.modelSupportOwners) if (modelSupportOwnerMatches(owner, modelId)) target.add(owner.pluginId);
		},
		canResolveDirectProviderIds: (providerIds, scopePluginIds) => {
			const normalizedScope = new Set([...scopePluginIds].map((pluginId) => normalizeOptionalLowercaseString(pluginId)).filter((pluginId) => Boolean(pluginId)));
			return providerIds.every((providerId) => {
				const normalized = normalizeOptionalLowercaseString(providerId);
				return Boolean(normalized && (maps.directProviderOwners.has(normalized) || normalizedScope.has(normalized)));
			});
		},
		hasChannelContributionOwners: (ids) => hasOwners(maps.channelContributionOwners, ids),
		hasCompleteConfigPathActivationMetadata: () => index.plugins.every((plugin) => !plugin.compat.includes("activation-config-path-hint") || plugin.startup.configPaths !== void 0),
		hasDirectChannelOwners: (ids) => hasOwners(maps.directChannelOwners, ids),
		hasInstalledPluginIds: (ids) => [...ids].every((pluginId) => {
			const normalized = normalizeOptionalLowercaseString(pluginId);
			return Boolean(normalized && maps.installedPluginIds.has(normalized));
		}),
		hasProviderContributionOwners: (ids) => hasOwners(maps.providerContributionOwners, ids),
		hasShorthandModelOwners: (modelIds) => modelIds.every((modelId) => maps.modelSupportOwners.some((owner) => modelSupportOwnerMatches(owner, modelId))),
		normalizePluginId: normalizeInstalledPluginId
	};
}
//#endregion
//#region src/plugins/gateway-startup-plugin-ids.ts
/** Resolves plugin ids that should load during Gateway startup. */
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
function sortUniquePluginIds(values) {
	return [...new Set([...values].map((value) => value.trim()).filter(Boolean))].toSorted((left, right) => left.localeCompare(right));
}
function normalizePluginsConfigForInstalledIndex(config, lookup) {
	return normalizePluginsConfigWithResolver(config, lookup.normalizePluginId);
}
function isConfigActivationValueEnabled(value) {
	if (value === false) return false;
	if (isRecord(value) && value.enabled === false) return false;
	return true;
}
function listPotentialEnabledChannelIds(config, env) {
	const disabled = new Set(listExplicitlyDisabledChannelIdsForConfig(config));
	return listPotentialConfiguredChannelIds(config, env, { includePersistedAuthState: false }).map((id) => normalizeOptionalLowercaseString(id) ?? "").filter((id) => id && !disabled.has(id));
}
function isGatewayStartupMemoryPlugin(plugin) {
	return plugin.startup.memory;
}
function resolveGatewayStartupDreamingEngineId(config) {
	if (!resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(config),
		cfg: config
	}).enabled) return;
	if (!resolveGatewayStartupDreamingSelectedPluginId(config)) return;
	return DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
}
function resolveGatewayStartupDreamingSelectedPluginId(config) {
	const selectedPluginId = normalizeOptionalLowercaseString(resolveMemoryDreamingPluginId(config));
	return selectedPluginId && selectedPluginId !== "memory-core" ? selectedPluginId : void 0;
}
function blocksPluginStartup(params) {
	return params.pluginsConfig.deny.includes(params.pluginId) || params.activationSourcePlugins.deny.includes(params.pluginId) || params.pluginsConfig.entries[params.pluginId]?.enabled === false || params.activationSourcePlugins.entries[params.pluginId]?.enabled === false;
}
function resolveAuthorizedGatewayStartupDreamingPluginIds(params) {
	const engineId = resolveGatewayStartupDreamingEngineId(params.config);
	const dreamingSelectedPluginId = resolveGatewayStartupDreamingSelectedPluginId(params.config);
	if (!engineId || !params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled) return /* @__PURE__ */ new Set();
	if (!params.selectedMemoryPluginId || params.selectedMemoryPluginId !== dreamingSelectedPluginId || params.selectedMemoryPluginId === engineId || blocksPluginStartup({
		pluginId: engineId,
		pluginsConfig: params.pluginsConfig,
		activationSourcePlugins: params.activationSourcePlugins
	})) return /* @__PURE__ */ new Set();
	const selectedPlugin = params.index.plugins.find((plugin) => plugin.pluginId === params.selectedMemoryPluginId);
	const sidecarPlugin = params.index.plugins.find((plugin) => plugin.pluginId === engineId);
	if (!selectedPlugin?.startup.memory || !sidecarPlugin?.startup.memory) return /* @__PURE__ */ new Set();
	return resolveEffectivePluginActivationState({
		id: selectedPlugin.pluginId,
		origin: selectedPlugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedPlugin, params.platform),
		activationSource: params.activationSource
	}).enabled ? new Set([engineId]) : /* @__PURE__ */ new Set();
}
function resolveMemorySlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.memory?.trim();
	if (configuredSlot?.toLowerCase() === "none") return;
	if (!configuredSlot) {
		const defaultSlot = activationSourcePlugins.slots.memory;
		if (typeof defaultSlot !== "string") return;
		if (activationSourcePlugins.allow.length > 0 && !activationSourcePlugins.allow.includes(defaultSlot)) return;
		return defaultSlot;
	}
	return normalizePluginId(configuredSlot);
}
function resolveContextEngineSlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.contextEngine?.trim();
	if (!configuredSlot) return;
	const normalized = normalizePluginId(configuredSlot);
	if (normalized === "legacy") return;
	if (activationSourcePlugins.deny.includes(normalized)) return;
	if (activationSourcePlugins.entries[normalized]?.enabled === false) return;
	return normalized;
}
function shouldConsiderForGatewayStartup(params) {
	if (params.manifest?.activation?.onStartup === true) return true;
	if (params.contextEngineSlotStartupPluginId === params.plugin.pluginId) return true;
	if (!isGatewayStartupMemoryPlugin(params.plugin)) return false;
	if (params.startupDreamingPluginIds.has(params.plugin.pluginId)) return true;
	return params.memorySlotStartupPluginId === params.plugin.pluginId;
}
function hasConfiguredStartupChannel(params) {
	return listManifestChannelIds(params.manifestLookup, params.plugin.pluginId).some((channelId) => params.configuredChannelIds.has(channelId));
}
function createManifestRegistryLookup(manifestRegistry) {
	return new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
}
function listManifestChannelIds(manifestLookup, pluginId) {
	return manifestLookup.get(pluginId)?.channels ?? [];
}
function findManifestPlugin(manifestLookup, pluginId) {
	return manifestLookup.get(pluginId);
}
function hasConfiguredActivationPath(params) {
	return hasConfiguredActivationPathPatterns({
		paths: params.manifest?.activation?.onConfigPaths,
		config: params.config
	});
}
function hasConfiguredActivationPathPatterns(params) {
	const paths = params.paths;
	if (!paths?.length) return false;
	return paths.some((pathPattern) => collectPluginConfigContractMatches({
		root: params.config,
		pathPattern
	}).some((match) => isConfigActivationValueEnabled(match.value)));
}
function addConfiguredActivationPathPluginIds(target, params) {
	for (const plugin of params.index.plugins) {
		if (plugin.origin !== "bundled") continue;
		if (hasConfiguredActivationPathPatterns({
			paths: plugin.startup.configPaths,
			config: params.activationSourceConfig
		})) target.add(plugin.pluginId);
	}
}
function manifestOwnsConfiguredSpeechProvider(params) {
	if (params.configuredSpeechProviderIds.size === 0) return false;
	return (params.manifest?.contracts?.speechProviders ?? []).some((providerId) => {
		const normalized = normalizeConfiguredSpeechProviderIdForStartup(providerId);
		return normalized ? params.configuredSpeechProviderIds.has(normalized) : false;
	});
}
function collectConfiguredWebSearchProviderIds(config) {
	const search = config.tools?.web?.search;
	if (search?.enabled === false || typeof search?.provider !== "string") return /* @__PURE__ */ new Set();
	const providerId = normalizeOptionalLowercaseString(search.provider);
	return providerId ? new Set([providerId]) : /* @__PURE__ */ new Set();
}
function manifestOwnsConfiguredWebSearchProvider(params) {
	if (params.configuredWebSearchProviderIds.size === 0) return false;
	return (params.manifest?.contracts?.webSearchProviders ?? []).some((providerId) => {
		const normalized = normalizeOptionalLowercaseString(providerId);
		return normalized ? params.configuredWebSearchProviderIds.has(normalized) : false;
	});
}
function listModelProviderRefs(value) {
	if (typeof value === "string") return [value];
	if (!isRecord(value)) return [];
	const refs = [];
	if (typeof value.primary === "string") refs.push(value.primary);
	if (Array.isArray(value.fallbacks)) {
		for (const fallback of value.fallbacks) if (typeof fallback === "string") refs.push(fallback);
	}
	return refs;
}
function listModelProviderRefParts(value) {
	return listModelProviderRefs(value).map((ref) => {
		const slashIndex = ref.indexOf("/");
		if (slashIndex <= 0 || slashIndex >= ref.length - 1) return;
		return {
			providerId: normalizeProviderId(ref.slice(0, slashIndex)),
			modelId: ref.slice(slashIndex + 1).trim()
		};
	}).filter((entry) => Boolean(entry?.providerId && entry.modelId));
}
function collectModelProviderIds(value) {
	return new Set(listModelProviderRefs(value).map((ref) => {
		const slashIndex = ref.indexOf("/");
		return slashIndex > 0 ? normalizeProviderId(ref.slice(0, slashIndex)) : "";
	}).filter((providerId) => Boolean(providerId)));
}
function buildManifestModelProviderLookup(manifestRegistry) {
	return {
		modelApis: new Map(planManifestModelCatalogRows({ registry: manifestRegistry }).rows.flatMap((row) => row.api ? [[row.mergeKey, row.api]] : [])),
		providerIds: new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.providers.map(normalizeProviderId)))
	};
}
function collectConfiguredAgentModelProviderIds(config, manifestRegistry) {
	const modelIdsByProvider = /* @__PURE__ */ new Map();
	const manifestModelProviders = buildManifestModelProviderLookup(manifestRegistry);
	const addModelProviderRefs = (value) => {
		for (const { providerId, modelId } of listModelProviderRefParts(value)) {
			const modelIds = modelIdsByProvider.get(providerId) ?? /* @__PURE__ */ new Set();
			modelIds.add(modelId);
			modelIdsByProvider.set(providerId, modelIds);
		}
	};
	const addModelMapProviderIds = (models) => {
		if (!isRecord(models)) return;
		for (const modelRef of Object.keys(models)) addModelProviderRefs(modelRef);
	};
	const defaults = config.agents?.defaults;
	addModelProviderRefs(defaults?.model);
	addModelMapProviderIds(defaults?.models);
	const agents = Array.isArray(config.agents?.list) ? config.agents.list : [];
	for (const agent of agents) {
		if (!isRecord(agent)) continue;
		addModelProviderRefs(agent.model);
		addModelMapProviderIds(agent.models);
	}
	return new Set([...modelIdsByProvider.entries()].filter(([providerId, modelIds]) => {
		return [...modelIds].some((modelId) => configuredModelProviderNeedsRuntimePlugin({
			config,
			manifestModelProviders,
			providerId,
			modelId
		}));
	}).map(([providerId]) => providerId));
}
function configuredModelProviderNeedsRuntimePlugin(params) {
	const providerConfig = params.config.models?.providers?.[params.providerId];
	const modelApi = (providerConfig?.models?.find((model) => model.id === params.modelId))?.api ?? providerConfig?.api ?? params.manifestModelProviders.modelApis.get(buildModelCatalogMergeKey(params.providerId, params.modelId));
	if (typeof modelApi === "string") return !CORE_BUILT_IN_MODEL_APIS.has(modelApi);
	return params.manifestModelProviders.providerIds.has(params.providerId);
}
function manifestOwnsConfiguredModelProvider(params) {
	if (params.configuredModelProviderIds.size === 0) return false;
	return (params.manifest?.providers ?? []).some((providerId) => {
		return params.configuredModelProviderIds.has(normalizeProviderId(providerId));
	});
}
function collectConfiguredGenerationProviderIds(config) {
	const defaults = config.agents?.defaults;
	return {
		imageGenerationProviders: collectModelProviderIds(defaults?.imageGenerationModel),
		videoGenerationProviders: collectModelProviderIds(defaults?.videoGenerationModel),
		musicGenerationProviders: collectModelProviderIds(defaults?.musicGenerationModel)
	};
}
function collectConfiguredVoiceProviderIds(config) {
	const providerIds = collectModelProviderIds(config.agents?.defaults?.voiceModel);
	return {
		speechProviders: providerIds,
		realtimeTranscriptionProviders: providerIds,
		realtimeVoiceProviders: providerIds
	};
}
const MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS = new Set(["auto", "none"]);
function normalizeMemoryEmbeddingProviderIdValue(value) {
	if (typeof value !== "string") return;
	return normalizeOptionalLowercaseString(value) || void 0;
}
function normalizeExplicitMemoryEmbeddingProviderId(value) {
	const normalized = normalizeMemoryEmbeddingProviderIdValue(value);
	return normalized && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(normalized) ? normalized : void 0;
}
function readMemorySearchEnabled(memorySearch) {
	const enabled = memorySearch?.enabled;
	return typeof enabled === "boolean" ? enabled : void 0;
}
function isMemorySlotExplicitlyDisabled(config) {
	return normalizeOptionalLowercaseString(config.plugins?.slots?.memory) === "none";
}
/**
* Resolve a configured memory embedding provider id to the adapter id(s) a
* plugin manifest contract or runtime registry can own. Mirrors runtime
* `getConfiguredMemoryEmbeddingProvider`: the raw id maps to a direct adapter,
* and a custom `models.providers.<id>` entry additionally maps to its `api`
* owner adapter (`provider: "ollama-5080"` with `api: "ollama"` -> "ollama").
* Both candidates are returned so matching covers the direct adapter and the
* API owner without the runtime adapter registry.
*/
function resolveMemoryEmbeddingProviderOwnerIds(providerId, config) {
	const ownerIds = [providerId];
	const genericOwnerId = normalizeOptionalLowercaseString(resolveConfiguredGenericEmbeddingProviderId(providerId, config));
	if (genericOwnerId && genericOwnerId !== providerId) ownerIds.push(genericOwnerId);
	const ownerApi = normalizeOptionalLowercaseString(findNormalizedProviderValue(config.models?.providers, providerId)?.api);
	if (ownerApi && ownerApi !== providerId) ownerIds.push(ownerApi);
	return ownerIds;
}
function resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override) {
	if (!(readMemorySearchEnabled(override) ?? readMemorySearchEnabled(defaults) ?? true)) return [];
	const rawProvider = normalizeMemoryEmbeddingProviderIdValue(override?.provider ?? defaults?.provider);
	const effectiveProvider = rawProvider === "auto" || !rawProvider ? "openai" : rawProvider;
	if (effectiveProvider === "none") return [];
	const entries = [];
	const provider = rawProvider && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(rawProvider) ? rawProvider : void 0;
	if (provider) entries.push({
		configuredId: provider,
		source: "provider"
	});
	const fallback = normalizeExplicitMemoryEmbeddingProviderId(override?.fallback ?? defaults?.fallback ?? "none");
	if (fallback && fallback !== effectiveProvider) entries.push({
		configuredId: fallback,
		source: "fallback"
	});
	return entries;
}
/**
* Collect explicit memory embedding provider owners required by startup. The
* resolver mirrors runtime memory-search inheritance for enablement, primary
* provider, and fallback provider, then maps custom `models.providers` ids to
* their API-owner adapter ids.
*/
function collectConfiguredMemoryEmbeddingStartupProviderOwners(config) {
	if (isMemorySlotExplicitlyDisabled(config)) return [];
	const byConfiguredIdAndSource = /* @__PURE__ */ new Map();
	const defaultsBlock = config.agents?.defaults?.memorySearch;
	const defaults = isRecord(defaultsBlock) ? defaultsBlock : void 0;
	const addEffectiveProviders = (override) => {
		for (const { configuredId, source } of resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override)) {
			const key = `${source}\0${configuredId}`;
			if (byConfiguredIdAndSource.has(key)) continue;
			byConfiguredIdAndSource.set(key, {
				configuredId,
				ownerIds: new Set(resolveMemoryEmbeddingProviderOwnerIds(configuredId, config)),
				source
			});
		}
	};
	addEffectiveProviders(void 0);
	const agents = config.agents?.list;
	const agentEntries = Array.isArray(agents) ? agents.filter(isRecord) : [];
	if (agentEntries.length === 0) return [...byConfiguredIdAndSource.values()];
	for (const agent of agentEntries) addEffectiveProviders(isRecord(agent.memorySearch) ? agent.memorySearch : void 0);
	return [...byConfiguredIdAndSource.values()];
}
/**
* Collect configured memory embedding provider ids that map to a plugin-owned
* memory embedding provider contract, including the resolved `api` owner for
* custom `models.providers` ids so the owning plugin loads at startup.
*/
function collectConfiguredMemoryEmbeddingProviderIds(config) {
	const providerIds = /* @__PURE__ */ new Set();
	for (const provider of collectConfiguredMemoryEmbeddingStartupProviderOwners(config)) for (const ownerId of provider.ownerIds) providerIds.add(ownerId);
	return providerIds;
}
/**
* Report configured memory embedding providers that no loaded plugin can serve.
* A provider is unregistered only when none of its resolved adapter ids (the
* configured id and its `models.providers.<id>.api` owner) was registered, so
* custom providers warn when their API-owner plugin is missing but stay quiet
* once that plugin loads.
*/
function collectUnregisteredConfiguredMemoryEmbeddingProviders(params) {
	const configured = collectConfiguredMemoryEmbeddingStartupProviderOwners(params.config);
	if (configured.length === 0) return [];
	const registered = new Set([...params.registeredProviderIds].map((id) => normalizeOptionalLowercaseString(id)).filter((id) => Boolean(id)));
	return configured.filter((provider) => ![...provider.ownerIds].some((ownerId) => registered.has(ownerId))).map((provider) => ({
		configuredId: provider.configuredId,
		source: provider.source
	})).toSorted((left, right) => left.configuredId.localeCompare(right.configuredId) || left.source.localeCompare(right.source));
}
function addPluginConfigEntryIds(target, plugins) {
	for (const [pluginId, entry] of Object.entries(plugins.entries)) if (entry?.enabled !== false) target.add(pluginId);
}
function addConfiguredSlotPluginIds(target, params) {
	const memorySlot = resolveMemorySlotStartupPluginId({
		activationSourceConfig: params.activationSourceConfig,
		activationSourcePlugins: params.activationSourcePlugins,
		normalizePluginId: params.lookup.normalizePluginId
	});
	if (memorySlot) target.add(memorySlot);
	const contextEngineSlot = resolveContextEngineSlotStartupPluginId({
		activationSourceConfig: params.activationSourceConfig,
		activationSourcePlugins: params.activationSourcePlugins,
		normalizePluginId: params.lookup.normalizePluginId
	});
	if (contextEngineSlot) target.add(contextEngineSlot);
}
function collectConfiguredStartupChannelIds(params) {
	return sortUniquePluginIds([...listPotentialEnabledChannelIds(params.config, params.env), ...listPotentialEnabledChannelIds(params.activationSourceConfig, params.env)]);
}
function collectValidationHeartbeatTargetChannelIds(config) {
	const channelIds = [];
	const pushTarget = (target) => {
		if (typeof target !== "string") return;
		const normalized = normalizeOptionalLowercaseString(target);
		if (!normalized || normalized === "last" || normalized === "none") return;
		channelIds.push(normalized);
	};
	pushTarget(config.agents?.defaults?.heartbeat?.target);
	if (Array.isArray(config.agents?.list)) for (const agent of config.agents.list) pushTarget(agent?.heartbeat?.target);
	return sortUniquePluginIds(channelIds);
}
function collectValidationChannelConfigIds(config) {
	const channels = isRecord(config.channels) ? config.channels : null;
	if (!channels) return [];
	return Object.keys(channels).filter((channelId) => channelId !== "defaults" && channelId !== "modelByChannel").map((channelId) => normalizeOptionalLowercaseString(channelId) ?? "").filter(Boolean).toSorted((left, right) => left.localeCompare(right));
}
function collectConfigValidationChannelIds(params) {
	return sortUniquePluginIds([
		...collectValidationChannelConfigIds(params.config),
		...collectConfiguredStartupChannelIds({
			config: params.config,
			activationSourceConfig: params.config,
			env: params.env
		}),
		...collectValidationHeartbeatTargetChannelIds(params.config)
	]);
}
function collectConfiguredProviderIds(config) {
	const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(config);
	const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(config);
	const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(config);
	return sortUniquePluginIds([
		...collectConfiguredSpeechProviderIds(config),
		...configuredWebSearchProviderIds,
		...configuredGenerationProviderIds.imageGenerationProviders,
		...configuredGenerationProviderIds.videoGenerationProviders,
		...configuredGenerationProviderIds.musicGenerationProviders,
		...configuredVoiceProviderIds.speechProviders,
		...configuredVoiceProviderIds.realtimeTranscriptionProviders,
		...configuredVoiceProviderIds.realtimeVoiceProviders,
		...collectConfiguredMemoryEmbeddingProviderIds(config)
	]);
}
function collectValidationConfiguredProviderIds(config) {
	const providerIds = [];
	const pushProviderId = (value) => {
		if (typeof value !== "string") return;
		const normalized = normalizeOptionalLowercaseString(value);
		if (normalized) providerIds.push(normalized);
	};
	const profiles = config.auth?.profiles;
	if (profiles && typeof profiles === "object") {
		for (const profile of Object.values(profiles)) if (isRecord(profile)) pushProviderId(profile.provider);
	}
	const providers = config.models?.providers;
	if (providers && typeof providers === "object") for (const providerId of Object.keys(providers)) pushProviderId(providerId);
	for (const ref of collectConfiguredModelRefs(config)) {
		const slashIndex = ref.value.indexOf("/");
		if (slashIndex > 0) pushProviderId(ref.value.slice(0, slashIndex));
	}
	pushProviderId(config.tools?.web?.search?.provider);
	pushProviderId(config.tools?.web?.fetch?.provider);
	return sortUniquePluginIds(providerIds);
}
function collectValidationConfiguredShorthandModelIds(config) {
	return sortUniquePluginIds(collectConfiguredModelRefs(config).map((ref) => ref.value).filter((ref) => !ref.includes("/")).map((ref) => splitTrailingAuthProfile(ref).model.trim()).filter(Boolean));
}
function addRequiredAgentHarnessPluginIds(target, params) {
	const requiredAgentHarnessRuntimes = new Set(collectConfiguredAgentHarnessRuntimes(params.activationSourceConfig, { includeImplicitRuntimePreferences: false }));
	if (requiredAgentHarnessRuntimes.size === 0) return;
	for (const plugin of params.index.plugins) if (canStartRequiredAgentHarnessPlugin({
		plugin,
		pluginsConfig: params.pluginsConfig,
		activationSource: params.activationSource,
		config: params.config,
		requiredAgentHarnessRuntimes,
		platform: params.platform
	})) target.add(plugin.pluginId);
}
function resolveGatewayStartupMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const activationSourceConfig = params.activationSourceConfig ?? params.config;
	const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config.plugins, lookup);
	const activationSourcePlugins = normalizePluginsConfigForInstalledIndex(activationSourceConfig.plugins, lookup);
	if (!pluginsConfig.enabled || !activationSourcePlugins.enabled) return [];
	if (params.config.plugins?.bundledDiscovery === "compat" || activationSourceConfig.plugins?.bundledDiscovery === "compat") return;
	if (pluginsConfig.allow.length === 0 && activationSourcePlugins.allow.length === 0) return;
	const scope = new Set([...pluginsConfig.allow, ...activationSourcePlugins.allow]);
	addPluginConfigEntryIds(scope, pluginsConfig);
	addPluginConfigEntryIds(scope, activationSourcePlugins);
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
		config: params.config,
		activationSourceConfig,
		env: params.env
	});
	if (!lookup.hasDirectChannelOwners(configuredChannelIds)) return;
	lookup.addDirectChannelOwners(scope, configuredChannelIds);
	const configuredProviderIds = sortUniquePluginIds([
		...collectConfiguredProviderIds(params.config),
		...collectConfiguredProviderIds(activationSourceConfig),
		...collectValidationConfiguredProviderIds(params.config),
		...collectValidationConfiguredProviderIds(activationSourceConfig)
	]);
	if (!lookup.canResolveDirectProviderIds(configuredProviderIds, scope)) return;
	lookup.addDirectProviderOwners(scope, configuredProviderIds);
	const configuredShorthandModelIds = sortUniquePluginIds([...collectValidationConfiguredShorthandModelIds(params.config), ...collectValidationConfiguredShorthandModelIds(activationSourceConfig)]);
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
	const deniedPluginIds = new Set([...pluginsConfig.deny, ...activationSourcePlugins.deny]);
	for (const pluginId of deniedPluginIds) scope.delete(pluginId);
	for (const [pluginId, entry] of Object.entries(pluginsConfig.entries)) if (entry?.enabled === false) scope.delete(pluginId);
	for (const [pluginId, entry] of Object.entries(activationSourcePlugins.entries)) if (entry?.enabled === false) scope.delete(pluginId);
	if (!lookup.hasInstalledPluginIds(scope)) return;
	return sortUniquePluginIds(scope);
}
function createGatewayStartupMetadataPluginIdScope(params) {
	const configuredChannelIds = collectConfiguredStartupChannelIds({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig ?? params.config,
		env: params.env
	});
	return {
		key: hashJson({
			kind: "gateway-startup",
			config: params.config,
			activationSourceConfig: params.activationSourceConfig ?? null,
			configuredChannelIds,
			platform: params.platform ?? null
		}),
		resolve: ({ index }) => resolveGatewayStartupMetadataPluginIds({
			config: params.config,
			...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
			env: params.env,
			index,
			...params.platform !== void 0 ? { platform: params.platform } : {}
		})
	};
}
function addValidationPluginConfigReferences(target, params) {
	for (const pluginId of params.pluginsConfig.allow) target.add(pluginId);
	for (const pluginId of params.pluginsConfig.deny) target.add(pluginId);
	for (const pluginId of Object.keys(params.pluginsConfig.entries)) target.add(pluginId);
	const rawSlots = isRecord(params.config.plugins?.slots) ? params.config.plugins.slots : {};
	const memorySlot = Object.hasOwn(rawSlots, "memory") ? params.pluginsConfig.slots.memory : void 0;
	if (typeof memorySlot === "string") target.add(params.normalizePluginId(memorySlot));
	const contextEngineSlot = Object.hasOwn(rawSlots, "contextEngine") ? params.pluginsConfig.slots.contextEngine : void 0;
	if (typeof contextEngineSlot === "string" && contextEngineSlot !== "legacy") target.add(params.normalizePluginId(contextEngineSlot));
}
function resolveConfigValidationMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config.plugins, lookup);
	if (params.config.plugins?.bundledDiscovery === "compat" || pluginsConfig.loadPaths.length > 0) return;
	const scope = /* @__PURE__ */ new Set();
	addValidationPluginConfigReferences(scope, {
		config: params.config,
		pluginsConfig,
		normalizePluginId: lookup.normalizePluginId
	});
	if (!lookup.hasCompleteConfigPathActivationMetadata()) return;
	addConfiguredActivationPathPluginIds(scope, {
		activationSourceConfig: params.config,
		index: params.index
	});
	const configuredChannelIds = collectConfigValidationChannelIds({
		config: params.config,
		env: params.env
	});
	if (!lookup.hasChannelContributionOwners(configuredChannelIds)) return;
	lookup.addChannelContributionOwners(scope, configuredChannelIds);
	const configuredProviderIds = collectValidationConfiguredProviderIds(params.config);
	if (!lookup.hasProviderContributionOwners(configuredProviderIds)) return;
	lookup.addProviderContributionOwners(scope, configuredProviderIds);
	const configuredShorthandModelIds = collectValidationConfiguredShorthandModelIds(params.config);
	if (!lookup.hasShorthandModelOwners(configuredShorthandModelIds)) return;
	lookup.addShorthandModelOwners(scope, configuredShorthandModelIds);
	addRequiredAgentHarnessPluginIds(scope, {
		activationSourceConfig: params.config,
		config: params.config,
		index: params.index,
		pluginsConfig,
		activationSource: {
			plugins: pluginsConfig,
			rootConfig: params.config
		},
		env: params.env,
		platform: params.platform
	});
	if (!lookup.hasInstalledPluginIds(scope)) return;
	return sortUniquePluginIds(scope);
}
function createConfigValidationMetadataPluginIdScope(params) {
	const configuredChannelIds = collectConfigValidationChannelIds({
		config: params.config,
		env: params.env
	});
	const configuredProviderIds = collectValidationConfiguredProviderIds(params.config);
	const configuredShorthandModelIds = collectValidationConfiguredShorthandModelIds(params.config);
	return {
		key: hashJson({
			kind: "config-validation",
			config: params.config,
			configuredChannelIds,
			configuredProviderIds,
			configuredShorthandModelIds,
			platform: params.platform ?? null
		}),
		resolve: ({ index }) => resolveConfigValidationMetadataPluginIds({
			config: params.config,
			env: params.env,
			index,
			...params.platform !== void 0 ? { platform: params.platform } : {}
		})
	};
}
function isMetadataSnapshotScopedForGatewayStartup(params) {
	const expectedPluginIds = normalizePluginIdScope(params.pluginIdScope.resolve({ index: params.metadataSnapshot.index }));
	const snapshotPluginIds = normalizePluginIdScope(params.metadataSnapshot.pluginIds);
	if (expectedPluginIds === void 0 || snapshotPluginIds === void 0) return expectedPluginIds === void 0 && snapshotPluginIds === void 0;
	if (expectedPluginIds.length === 0) return snapshotPluginIds.length === 0;
	const snapshotPluginIdSet = new Set(snapshotPluginIds);
	return expectedPluginIds.every((pluginId) => snapshotPluginIdSet.has(pluginId));
}
function manifestOwnsConfiguredGenerationProvider(params) {
	for (const contractKey of [
		"imageGenerationProviders",
		"videoGenerationProviders",
		"musicGenerationProviders"
	]) {
		const configuredProviderIds = params.configuredGenerationProviderIds[contractKey];
		if (configuredProviderIds.size === 0) continue;
		if ((params.manifest?.contracts?.[contractKey] ?? []).some((providerId) => {
			const normalized = normalizeOptionalLowercaseString(providerId);
			return normalized ? configuredProviderIds.has(normalized) : false;
		})) return true;
	}
	return false;
}
function manifestOwnsConfiguredVoiceProvider(params) {
	for (const contractKey of [
		"speechProviders",
		"realtimeTranscriptionProviders",
		"realtimeVoiceProviders"
	]) {
		const configuredProviderIds = params.configuredVoiceProviderIds[contractKey];
		if (configuredProviderIds.size === 0) continue;
		if ((params.manifest?.contracts?.[contractKey] ?? []).some((providerId) => {
			const normalized = normalizeOptionalLowercaseString(providerId);
			return normalized ? configuredProviderIds.has(normalized) : false;
		})) return true;
	}
	return false;
}
function manifestOwnsConfiguredMemoryEmbeddingProvider(params) {
	if (params.configuredMemoryEmbeddingProviderIds.size === 0) return false;
	return [...params.manifest?.contracts?.memoryEmbeddingProviders ?? [], ...params.manifest?.contracts?.embeddingProviders ?? []].some((providerId) => {
		const normalized = normalizeOptionalLowercaseString(providerId);
		return normalized ? params.configuredMemoryEmbeddingProviderIds.has(normalized) : false;
	});
}
function canStartConfiguredGenerationProviderPlugin(params) {
	if (!manifestOwnsConfiguredGenerationProvider({
		manifest: params.manifest,
		configuredGenerationProviderIds: params.configuredGenerationProviderIds
	})) return false;
	if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	});
	return activationState.enabled && (params.plugin.origin === "bundled" || activationState.explicitlyEnabled);
}
function canStartConfiguredVoiceProviderPlugin(params) {
	if (!manifestOwnsConfiguredVoiceProvider({
		manifest: params.manifest,
		configuredVoiceProviderIds: params.configuredVoiceProviderIds
	})) return false;
	if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	});
	return activationState.enabled && (params.plugin.origin === "bundled" || activationState.explicitlyEnabled);
}
function canStartConfiguredMemoryEmbeddingProviderPlugin(params) {
	if (!manifestOwnsConfiguredMemoryEmbeddingProvider({
		manifest: params.manifest,
		configuredMemoryEmbeddingProviderIds: params.configuredMemoryEmbeddingProviderIds
	})) return false;
	if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	return resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	}).enabled;
}
function canStartConfiguredModelProviderPlugin(params) {
	if (!manifestOwnsConfiguredModelProvider({
		manifest: params.manifest,
		configuredModelProviderIds: params.configuredModelProviderIds
	})) return false;
	if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	});
	return activationState.enabled && (params.plugin.origin === "bundled" || activationState.explicitlyEnabled);
}
function canStartRequiredAgentHarnessPlugin(params) {
	if (!params.plugin.startup.agentHarnesses.some((runtime) => params.requiredAgentHarnessRuntimes.has(runtime))) return false;
	if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	if (params.pluginsConfig.allow.length > 0 && !params.pluginsConfig.allow.includes(params.plugin.pluginId)) return false;
	if (params.activationSource.plugins.allow.length > 0 && !params.activationSource.plugins.allow.includes(params.plugin.pluginId)) return false;
	return resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	}).enabled || params.plugin.origin === "bundled";
}
function canStartConfiguredSpeechProviderPlugin(params) {
	if (!manifestOwnsConfiguredSpeechProvider({
		manifest: params.manifest,
		configuredSpeechProviderIds: params.configuredSpeechProviderIds
	})) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	if (params.plugin.origin === "bundled") return true;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	});
	return activationState.enabled && activationState.explicitlyEnabled;
}
function canStartConfiguredWebSearchProviderPlugin(params) {
	if (!manifestOwnsConfiguredWebSearchProvider({
		manifest: params.manifest,
		configuredWebSearchProviderIds: params.configuredWebSearchProviderIds
	})) return false;
	if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	return resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	}).enabled;
}
function canStartConfiguredRootPlugin(params) {
	if (params.plugin.origin !== "bundled") return false;
	if (!hasConfiguredActivationPath({
		manifest: params.manifest,
		config: params.config
	})) return false;
	if (!params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSourcePlugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSourcePlugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	return true;
}
function hasExplicitHookPolicyConfig(entry) {
	return entry?.hooks?.allowConversationAccess === true || entry?.hooks?.allowPromptInjection === true || entry?.hooks?.timeoutMs !== void 0 || entry?.hooks?.timeouts !== void 0 && Object.keys(entry.hooks.timeouts).length > 0;
}
function hasHookRuntimeStartupIntent(params) {
	if (params.manifest?.activation?.onCapabilities?.includes("hook")) return true;
	return hasExplicitHookPolicyConfig(params.activationSourcePlugins.entries[params.plugin.pluginId]);
}
function canStartExplicitHookPlugin(params) {
	const hasHookPolicyIntent = hasExplicitHookPolicyConfig(params.activationSourcePlugins.entries[params.plugin.pluginId]);
	if (!hasHookRuntimeStartupIntent({
		plugin: params.plugin,
		manifest: params.manifest,
		activationSourcePlugins: params.activationSourcePlugins
	})) return false;
	if (!params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSourcePlugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSourcePlugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	});
	return activationState.enabled && (activationState.explicitlyEnabled || hasHookPolicyIntent);
}
function canStartTrustedToolPolicyPlugin(params) {
	if ((params.manifest?.contracts?.trustedToolPolicies?.length ?? 0) === 0) return false;
	if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId) || params.activationSource.plugins.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false || params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false) return false;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	});
	return activationState.enabled && (params.plugin.origin === "bundled" || activationState.explicitlyEnabled);
}
function canStartConfiguredChannelPlugin(params) {
	if (!params.pluginsConfig.enabled) return false;
	if (params.pluginsConfig.deny.includes(params.plugin.pluginId)) return false;
	if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false) return false;
	const explicitBundledChannelConfig = params.plugin.origin === "bundled" && listManifestChannelIds(params.manifestLookup, params.plugin.pluginId).some((channelId) => hasExplicitChannelConfig({
		config: params.activationSource.rootConfig ?? params.config,
		channelId
	}));
	if (params.pluginsConfig.allow.length > 0 && !params.pluginsConfig.allow.includes(params.plugin.pluginId) && !explicitBundledChannelConfig) return false;
	if (params.plugin.origin === "bundled") return true;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource
	});
	return activationState.enabled && activationState.explicitlyEnabled;
}
function resolveChannelPluginIds(params) {
	return [...loadGatewayStartupPluginPlan(params).channelPluginIds];
}
function resolveChannelPluginIdsFromRegistry(params) {
	const { manifestRegistry } = params;
	return manifestRegistry.plugins.filter((plugin) => plugin.channels.length > 0).map((plugin) => plugin.id);
}
function resolveConfiguredDeferredChannelPluginIdsFromRegistry(params) {
	const configuredChannelIds = new Set(listPotentialEnabledChannelIds(params.config, params.env));
	if (configuredChannelIds.size === 0) return [];
	const pluginsConfig = normalizePluginsConfigWithRegistry(params.config.plugins, params.index, { manifestRegistry: params.manifestRegistry });
	const activationSource = {
		plugins: pluginsConfig,
		rootConfig: params.config
	};
	const manifestLookup = createManifestRegistryLookup(params.manifestRegistry);
	return resolveConfiguredDeferredChannelPluginIdsFromPrepared({
		config: params.config,
		index: params.index,
		configuredChannelIds,
		pluginsConfig,
		activationSource,
		manifestLookup
	});
}
function resolveConfiguredDeferredChannelPluginIdsFromPrepared(params) {
	if (params.configuredChannelIds.size === 0) return [];
	return params.index.plugins.filter((plugin) => hasConfiguredStartupChannel({
		plugin,
		manifestLookup: params.manifestLookup,
		configuredChannelIds: params.configuredChannelIds
	}) && plugin.startup.deferConfiguredChannelFullLoadUntilAfterListen && canStartConfiguredChannelPlugin({
		plugin,
		config: params.config,
		pluginsConfig: params.pluginsConfig,
		activationSource: params.activationSource,
		manifestLookup: params.manifestLookup,
		platform: params.platform
	})).map((plugin) => plugin.pluginId);
}
function resolveConfiguredDeferredChannelPluginIds(params) {
	return [...loadGatewayStartupPluginPlan(params).configuredDeferredChannelPluginIds];
}
function resolveGatewayStartupPluginPlanFromRegistry(params) {
	const channelPluginIds = resolveChannelPluginIdsFromRegistry({ manifestRegistry: params.manifestRegistry });
	const configuredChannelIds = new Set(listPotentialEnabledChannelIds(params.config, params.env));
	const pluginsConfig = normalizePluginsConfigWithRegistry(params.config.plugins, params.index, { manifestRegistry: params.manifestRegistry });
	const activationSourceConfig = params.activationSourceConfig ?? params.config;
	const activationSourcePlugins = normalizePluginsConfigWithRegistry(activationSourceConfig.plugins, params.index, { manifestRegistry: params.manifestRegistry });
	const activationSource = {
		plugins: activationSourcePlugins,
		rootConfig: activationSourceConfig
	};
	const manifestLookup = createManifestRegistryLookup(params.manifestRegistry);
	const explicitlyDisabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
	const configuredDeferredChannelPluginIds = [];
	const requiredAgentHarnessRuntimes = new Set(collectConfiguredAgentHarnessRuntimes(activationSourceConfig));
	const configuredSpeechProviderIds = collectConfiguredSpeechProviderIds(activationSourceConfig);
	const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(activationSourceConfig);
	const configuredModelProviderIds = collectConfiguredAgentModelProviderIds(activationSourceConfig, params.manifestRegistry);
	const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(activationSourceConfig);
	const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(activationSourceConfig);
	const configuredMemoryEmbeddingProviderIds = collectConfiguredMemoryEmbeddingProviderIds(activationSourceConfig);
	const normalizePluginId = createPluginRegistryIdNormalizer(params.index, { manifestRegistry: params.manifestRegistry });
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
		const manifest = findManifestPlugin(manifestLookup, plugin.pluginId);
		const hasEnabledManifestChannel = manifest?.channels?.some((channelId) => {
			const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
			return normalizedChannelId ? !explicitlyDisabledChannelIds.has(normalizedChannelId) : false;
		}) ?? false;
		const hasExplicitlyEnabledNonBundledChannel = plugin.origin !== "bundled" && hasEnabledManifestChannel && pluginsConfig.entries[plugin.pluginId]?.enabled === true && !pluginsConfig.deny.includes(plugin.pluginId);
		if (hasConfiguredStartupChannel({
			plugin,
			manifestLookup,
			configuredChannelIds
		}) || hasExplicitlyEnabledNonBundledChannel) {
			if (canStartConfiguredChannelPlugin({
				plugin,
				config: params.config,
				pluginsConfig,
				activationSource,
				manifestLookup,
				platform: params.platform
			})) {
				pluginIds.push(plugin.pluginId);
				if (plugin.startup.deferConfiguredChannelFullLoadUntilAfterListen) configuredDeferredChannelPluginIds.push(plugin.pluginId);
			}
			continue;
		}
		if (canStartRequiredAgentHarnessPlugin({
			plugin,
			pluginsConfig,
			activationSource,
			config: params.config,
			requiredAgentHarnessRuntimes,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartConfiguredRootPlugin({
			plugin,
			manifest,
			config: activationSourceConfig,
			pluginsConfig,
			activationSourcePlugins
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartConfiguredSpeechProviderPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			configuredSpeechProviderIds,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartConfiguredWebSearchProviderPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			configuredWebSearchProviderIds,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartConfiguredModelProviderPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			configuredModelProviderIds,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartConfiguredGenerationProviderPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			configuredGenerationProviderIds,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartConfiguredVoiceProviderPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			configuredVoiceProviderIds,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartConfiguredMemoryEmbeddingProviderPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			configuredMemoryEmbeddingProviderIds,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartExplicitHookPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			activationSourcePlugins,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartTrustedToolPolicyPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
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
		const activationState = resolveEffectivePluginActivationState({
			id: plugin.pluginId,
			origin: plugin.origin,
			config: pluginsConfig,
			rootConfig: params.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin, params.platform),
			activationSource
		});
		if (!activationState.enabled) continue;
		if (plugin.origin !== "bundled" ? activationState.explicitlyEnabled : activationState.source === "explicit" || activationState.source === "default") pluginIds.push(plugin.pluginId);
	}
	return {
		channelPluginIds,
		configuredDeferredChannelPluginIds,
		pluginIds
	};
}
function resolveGatewayStartupPluginIdsFromRegistry(params) {
	return [...resolveGatewayStartupPluginPlanFromRegistry(params).pluginIds];
}
function loadGatewayStartupPluginPlan(params) {
	const snapshotConfig = params.activationSourceConfig ?? params.config;
	const pluginIdScope = createGatewayStartupMetadataPluginIdScope({
		config: params.config,
		...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
		env: params.env,
		...params.platform !== void 0 ? { platform: params.platform } : {}
	});
	const metadataSnapshot = params.metadataSnapshot && isPluginMetadataSnapshotCompatible({
		snapshot: params.metadataSnapshot,
		config: snapshotConfig,
		env: params.env,
		allowScopedSnapshot: true,
		workspaceDir: params.workspaceDir,
		index: params.index
	}) && isMetadataSnapshotScopedForGatewayStartup({
		metadataSnapshot: params.metadataSnapshot,
		pluginIdScope
	}) ? params.metadataSnapshot : resolvePluginMetadataSnapshot({
		config: snapshotConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0,
		...params.index ? { index: params.index } : {},
		pluginIdScope
	});
	return resolveGatewayStartupPluginPlanFromRegistry({
		config: params.config,
		...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
		env: params.env,
		index: metadataSnapshot.index,
		manifestRegistry: metadataSnapshot.manifestRegistry,
		platform: params.platform
	});
}
function resolveGatewayStartupPluginIds(params) {
	return [...loadGatewayStartupPluginPlan(params).pluginIds];
}
//#endregion
export { listExplicitConfiguredChannelIdsForConfig as C, resolveDiscoverableScopedChannelPluginIds as E, listConfiguredChannelIdsForReadOnlyScope as S, resolveConfiguredChannelPresencePolicy as T, readConfiguredProviderApiId as _, createGatewayStartupMetadataPluginIdScope as a, hasExplicitChannelConfig as b, resolveChannelPluginIds as c, resolveConfiguredDeferredChannelPluginIds as d, resolveConfiguredDeferredChannelPluginIdsFromRegistry as f, resolveGatewayStartupPluginPlanFromRegistry as g, resolveGatewayStartupPluginIdsFromRegistry as h, createConfigValidationMetadataPluginIdScope as i, resolveChannelPluginIdsFromRegistry as l, resolveGatewayStartupPluginIds as m, collectConfiguredMemoryEmbeddingStartupProviderOwners as n, isMetadataSnapshotScopedForGatewayStartup as o, resolveGatewayStartupMetadataPluginIds as p, collectUnregisteredConfiguredMemoryEmbeddingProviders as r, loadGatewayStartupPluginPlan as s, collectConfiguredMemoryEmbeddingProviderIds as t, resolveConfigValidationMetadataPluginIds as u, resolveConfiguredGenericEmbeddingProviderId as v, resolveConfiguredChannelPluginIds as w, listConfiguredAnnounceChannelIdsForConfig as x, hasConfiguredChannelsForReadOnlyScope as y };
