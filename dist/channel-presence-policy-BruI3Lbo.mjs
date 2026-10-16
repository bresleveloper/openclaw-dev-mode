import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { v as sortUniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { p as resolveEffectivePluginActivationState, r as createPluginActivationSource, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DdBZxRt7.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { r as hasChannelPackageState } from "./package-state-probes-DT9QRO40.mjs";
import { r as listPotentialConfiguredChannelPresenceSignals, t as listExplicitlyDisabledChannelIdsForConfig } from "./config-presence-bjA_OXo5.mjs";
import { t as hasMeaningfulChannelConfig } from "./channel-config-activation-CjIoaWiA.mjs";
import { a as resolveManifestOwnerBasePolicyBlock, i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JwCDUODD.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-C14NFDc3.mjs";
//#region src/plugins/channel-presence-policy.ts
const AMBIENT_ENV_SOURCES = /* @__PURE__ */ new Set(["env", "manifest-env"]);
const ANNOUNCE_SUPPRESSING_BLOCKED_REASONS = /* @__PURE__ */ new Set([
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
/** True when config contains meaningful enabled channel settings. */
function hasExplicitChannelConfig(params) {
	const channels = params.config.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
	const entry = channels[params.channelId];
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
	const enabled = entry.enabled;
	if (enabled === false) return false;
	return enabled === true || hasMeaningfulChannelConfig(entry, params.channelId);
}
/** Lists explicitly configured channel ids, excluding global channel config keys. */
function listExplicitConfiguredChannelIdsForConfig(config) {
	const channels = config.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return [];
	return Object.keys(channels).flatMap((rawChannelId) => {
		const channelId = rawChannelId.trim();
		return channelId && !isChannelConfigMetadataKey(channelId) && hasExplicitChannelConfig({
			config,
			channelId: rawChannelId
		}) ? [channelId] : [];
	}).toSorted((left, right) => left.localeCompare(right));
}
function recordDeclaresChannel(record, channelId) {
	const normalizedChannelId = normalizeOptionalLowercaseString(channelId) ?? "";
	if (!normalizedChannelId) return false;
	return record.channels.some((ownedChannelId) => (normalizeOptionalLowercaseString(ownedChannelId) ?? "") === normalizedChannelId);
}
function resolveManifestEnvConfiguredChannels(params) {
	const channelIds = /* @__PURE__ */ new Set();
	const contractChannelIds = /* @__PURE__ */ new Set();
	const trustConfig = params.activationSourceConfig ?? params.config;
	const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
	for (const record of params.records) {
		if (!isChannelPluginEligibleForScopedOwnership({
			plugin: record,
			normalizedConfig,
			rootConfig: trustConfig
		})) continue;
		for (const channelId of record.channels) {
			const packageChannel = record.packageChannel;
			const configuredState = normalizeOptionalLowercaseString(packageChannel?.id) === normalizeOptionalLowercaseString(channelId) ? packageChannel?.configuredState : void 0;
			const allOf = configuredState?.env?.allOf ?? [];
			const anyOf = configuredState?.env?.anyOf ?? [];
			const hasModuleContract = Boolean(configuredState?.specifier && configuredState.exportName);
			if (allOf.length === 0 && anyOf.length === 0 && !hasModuleContract) continue;
			const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
			if (!normalizedChannelId) continue;
			contractChannelIds.add(normalizedChannelId);
			if (hasModuleContract && !params.envSignalChannelIds.has(normalizedChannelId) || !packageChannel || !hasChannelPackageState({
				entry: {
					pluginId: record.id,
					origin: record.origin,
					rootDir: record.rootDir,
					channel: packageChannel
				},
				metadataKey: "configuredState",
				cfg: params.config,
				env: params.env
			})) continue;
			channelIds.add(channelId);
		}
	}
	return {
		contractChannelIds,
		channelIds: [...channelIds].toSorted((left, right) => left.localeCompare(right))
	};
}
function normalizeActivationBlockedReason(reason) {
	switch (reason) {
		case "plugins disabled": return "plugins-disabled";
		case "blocked by denylist": return "blocked-by-denylist";
		case "disabled in config":
		case "channel disabled in config": return "plugin-disabled";
		case "not in allowlist": return "not-in-allowlist";
		case "workspace plugin (disabled by default)": return "workspace-disabled-by-default";
		case "bundled (disabled by default)": return "bundled-disabled-by-default";
		default: return "not-activated";
	}
}
function hasChannelPluginOwnerTrust(params) {
	return params.plugin.origin === "global" || params.plugin.origin === "config" ? hasExplicitManifestOwnerTrust(params) : isActivatedManifestOwner(params);
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
	return hasChannelPluginOwnerTrust(params);
}
function resolveChannelPluginBlockedReason(params) {
	const explicitBundledChannelConfig = isBundledManifestOwner(params.plugin) && hasExplicitChannelConfig({
		config: params.activationSource.rootConfig ?? params.config,
		channelId: params.channelId
	});
	const baseBlockedReason = resolveManifestOwnerBasePolicyBlock({
		plugin: params.plugin,
		normalizedConfig: params.normalizedConfig,
		allowRestrictiveAllowlistBypass: explicitBundledChannelConfig
	});
	if (baseBlockedReason) return baseBlockedReason;
	if (!isBundledManifestOwner(params.plugin)) return hasChannelPluginOwnerTrust({
		plugin: params.plugin,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.activationSource.rootConfig
	}) ? null : "untrusted-plugin";
	if (explicitBundledChannelConfig) return null;
	const activationState = resolveEffectivePluginActivationState({
		id: params.plugin.id,
		origin: params.plugin.origin,
		channelIds: params.plugin.channels,
		config: params.normalizedConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin),
		activationSource: params.activationSource
	});
	return activationState.enabled ? null : normalizeActivationBlockedReason(activationState.reason);
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
	if (!params.workspaceDir) return resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.env
	}).plugins;
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
	const workspaceDir = params.workspaceDir;
	const records = params.manifestRecords ?? loadInstalledChannelManifestRecords({
		config: params.config,
		workspaceDir,
		env
	});
	const disabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
	const entrySources = /* @__PURE__ */ new Map();
	const potentialSignals = listPotentialConfiguredChannelPresenceSignals(params.config, env, {
		persistedAuthChannelIds: params.manifestRecords ? new Set(normalizeChannelIds(params.manifestRecords.flatMap((record) => record.channels))) : void 0,
		includePersistedAuthState: params.includePersistedAuthState,
		ambientEnvTriggers: params.ambientEnvTriggers,
		discovery: params.discovery
	});
	const manifestEnv = params.ambientEnvTriggers === "suppress" ? void 0 : resolveManifestEnvConfiguredChannels({
		records,
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		env,
		envSignalChannelIds: new Set(potentialSignals.filter((signal) => signal.source === "env").map((signal) => normalizeOptionalLowercaseString(signal.channelId)).filter((channelId) => Boolean(channelId)))
	});
	const configuredManifestEnvChannelIds = new Set(manifestEnv?.channelIds.map(normalizeOptionalLowercaseString));
	for (const channelId of listExplicitConfiguredChannelIdsForConfig(params.activationSourceConfig ?? params.config)) addPolicySignal(entrySources, channelId, "explicit-config");
	for (const signal of potentialSignals) {
		const channelId = normalizeOptionalLowercaseString(signal.channelId);
		if (signal.source === "config" || signal.source === "env" && channelId && manifestEnv?.contractChannelIds.has(channelId) && !configuredManifestEnvChannelIds.has(channelId)) continue;
		addPolicySignal(entrySources, signal.channelId, signal.source);
	}
	for (const channelId of manifestEnv?.channelIds ?? []) addPolicySignal(entrySources, channelId, "manifest-env");
	for (const channelId of disabledChannelIds) entrySources.delete(channelId);
	if (params.ambientEnvTriggers === "suppress") {
		for (const [channelId, sources] of entrySources) if (sources.size > 0 && [...sources].every((source) => AMBIENT_ENV_SOURCES.has(source))) entrySources.delete(channelId);
	}
	const activationSource = createPluginActivationSource({ config: params.activationSourceConfig ?? params.config });
	const normalizedConfig = activationSource.plugins;
	const entries = [];
	for (const channelId of sortUniqueStrings(entrySources.keys())) {
		const owningRecords = records.filter((record) => recordDeclaresChannel(record, channelId));
		const effectivePluginIds = [];
		const blockedReasons = new Set(owningRecords.length === 0 ? ["no-channel-owner"] : []);
		for (const plugin of owningRecords) {
			const blockedReason = resolveChannelPluginBlockedReason({
				plugin,
				channelId,
				normalizedConfig,
				config: params.config,
				activationSource
			});
			if (blockedReason) blockedReasons.add(blockedReason);
			else effectivePluginIds.push(plugin.id);
		}
		entries.push({
			channelId,
			sources: [...entrySources.get(channelId) ?? []].toSorted((left, right) => left.localeCompare(right)),
			effective: effectivePluginIds.length > 0,
			pluginIds: sortUniqueStrings(effectivePluginIds),
			blockedReasons: [...blockedReasons].toSorted((left, right) => left.localeCompare(right))
		});
	}
	return entries;
}
function listChannelIdsForGatewayPolicy(params, includePersistedAuthState) {
	return resolveConfiguredChannelPresencePolicy({
		...params,
		includePersistedAuthState
	}).filter((entry) => entry.effective || entry.blockedReasons.includes("bundled-disabled-by-default")).map((entry) => entry.channelId);
}
function listGatewayActivatedChannelIds(params) {
	return listChannelIdsForGatewayPolicy(params, false);
}
function listChannelIdsForOwnershipMigration(params) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir;
	const records = params.manifestRecords ?? loadInstalledChannelManifestRecords({
		config: params.config,
		workspaceDir,
		env
	});
	const trustConfig = params.activationSourceConfig ?? params.config;
	const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
	const persistedTrustedChannelIds = listPotentialConfiguredChannelPresenceSignals(params.config, env, {
		includePersistedAuthState: true,
		ambientEnvTriggers: params.ambientEnvTriggers,
		discovery: params.discovery
	}).filter((signal) => signal.source === "persisted-auth").map((signal) => signal.channelId).filter((channelId) => records.some((plugin) => recordDeclaresChannel(plugin, channelId) && isChannelPluginEligibleForScopedOwnership({
		plugin,
		normalizedConfig,
		rootConfig: trustConfig
	})));
	return normalizeChannelIds([...listChannelIdsForGatewayPolicy(params, true), ...persistedTrustedChannelIds]);
}
/** Lists channels that suppression removes because their only presence is ambient env. */
function listAmbientOnlyConfiguredChannelIds(params) {
	return resolveConfiguredChannelPresencePolicy({
		...params,
		ambientEnvTriggers: "allow"
	}).filter((entry) => entry.sources.length > 0 && entry.sources.every((source) => AMBIENT_ENV_SOURCES.has(source))).map((entry) => entry.channelId);
}
/** Lists effective channel ids available to read-only scoped discovery. */
function listConfiguredChannelIdsForReadOnlyScope(params) {
	return resolveConfiguredChannelPresencePolicy(params).filter((entry) => entry.effective).map((entry) => entry.channelId);
}
/** True when read-only scoped discovery has any effective configured channel. */
function hasConfiguredChannelsForReadOnlyScope(params) {
	return resolveConfiguredChannelPresencePolicy(params).some((entry) => entry.effective);
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
		manifestRecords: params.manifestRecords,
		discovery: params.discovery
	});
	const policyDisabledChannelIds = new Set(policy.filter((entry) => !entry.effective && entry.blockedReasons.some((reason) => ANNOUNCE_SUPPRESSING_BLOCKED_REASONS.has(reason))).map((entry) => entry.channelId));
	return normalizeChannelIds([...listExplicitConfiguredChannelIdsForConfig(params.config).filter((channelId) => normalizedConfig.enabled && !normalizedConfig.deny.includes(channelId) && normalizedConfig.entries[channelId]?.enabled !== false && (normalizedConfig.allow.length === 0 || normalizedConfig.allow.includes(channelId))), ...policy.filter((entry) => entry.effective).map((entry) => entry.channelId)]).filter((channelId) => !disabledChannelIds.has(channelId) && !policyDisabledChannelIds.has(channelId));
}
/** Resolves plugin ids discoverable for scoped channel activation. */
function resolveDiscoverableScopedChannelPluginIds(params) {
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
/** Resolves plugin ids that own currently configured channels. */
function resolveConfiguredChannelPluginIds(params) {
	if (!normalizePluginsConfig((params.activationSourceConfig ?? params.config).plugins).enabled) return [];
	const configuredChannelIds = normalizeChannelIds([...listConfiguredChannelIdsForReadOnlyScope({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: params.manifestRecords,
		discovery: params.discovery
	}), ...listExplicitConfiguredChannelIdsForConfig(params.activationSourceConfig ?? params.config)]);
	if (configuredChannelIds.length === 0) return [];
	return resolveDiscoverableScopedChannelPluginIds({
		...params,
		channelIds: configuredChannelIds
	});
}
//#endregion
export { listConfiguredAnnounceChannelIdsForConfig as a, listGatewayActivatedChannelIds as c, resolveDiscoverableScopedChannelPluginIds as d, listChannelIdsForOwnershipMigration as i, resolveConfiguredChannelPluginIds as l, hasExplicitChannelConfig as n, listConfiguredChannelIdsForReadOnlyScope as o, listAmbientOnlyConfiguredChannelIds as r, listExplicitConfiguredChannelIdsForConfig as s, hasConfiguredChannelsForReadOnlyScope as t, resolveConfiguredChannelPresencePolicy as u };
