import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as sanitizeForLog } from "./ansi-zQGMgESZ.js";
import { s as normalizePluginsConfig } from "./config-state-6HQcbL-X.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { a as resolveManifestOwnerBasePolicyBlock, n as isActivatedManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-DnbmOuKf.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-DYM918bn.js";
import { u as listExplicitlyDisabledChannelIdsForConfig } from "./gateway-startup-speech-providers-CQCz_cL7.js";
import { t as isSafeChannelEnvVarTriggerName } from "./channel-env-var-names-DsCXktaU.js";
import { C as listExplicitConfiguredChannelIdsForConfig, T as resolveConfiguredChannelPresencePolicy, b as hasExplicitChannelConfig } from "./gateway-startup-plugin-ids-DvFtK64_.js";
import "./channel-plugin-ids-CNTCN-WZ.js";
//#region src/commands/doctor/shared/channel-plugin-blockers.ts
/** Find configured channel ids whose backing plugins cannot activate. */
function scanConfiguredChannelPluginBlockers(cfg, env = process.env, activationSourceConfig = cfg) {
	const explicitChannelIds = listExplicitConfiguredChannelIdsForConfig(cfg).map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId));
	const sourcePluginsConfig = normalizePluginsConfig(activationSourceConfig.plugins);
	const effectivePluginsConfig = normalizePluginsConfig(cfg.plugins);
	const registry = loadPluginManifestRegistryForPluginRegistry({
		config: cfg,
		env,
		includeDisabled: true
	});
	const manifestEnvTriggers = listManifestEnvConfiguredChannelTriggers(registry.plugins, env);
	const policyChannelIds = resolveConfiguredChannelPresencePolicy({
		config: cfg,
		activationSourceConfig,
		env,
		includePersistedAuthState: false,
		manifestRecords: registry.plugins
	}).filter((entry) => !manifestEnvTriggers.has(entry.channelId) || entry.sources.some((source) => source !== "env" && source !== "manifest-env")).map((entry) => entry.channelId);
	const genericChannelIds = new Set([...explicitChannelIds, ...explicitChannelIds.length === 0 ? policyChannelIds : []]);
	for (const channelId of listExplicitlyDisabledChannelIdsForConfig(cfg)) {
		const normalizedChannelId = normalizeOptionalLowercaseString(channelId) ?? channelId;
		genericChannelIds.delete(normalizedChannelId);
		manifestEnvTriggers.delete(normalizedChannelId);
	}
	if (genericChannelIds.size === 0 && manifestEnvTriggers.size === 0) return [];
	const hits = [];
	const hitKeys = /* @__PURE__ */ new Set();
	const globalDisableChannelIds = /* @__PURE__ */ new Set();
	const addHits = (channelId, ownerStates, channelAvailable = false) => {
		for (const state of ownerStates) {
			if (!state.reason) continue;
			if (state.reason === "plugins disabled") {
				if (globalDisableChannelIds.has(channelId)) continue;
				globalDisableChannelIds.add(channelId);
			}
			const key = `${channelId}\0${state.pluginId}\0${state.reason}`;
			if (hitKeys.has(key)) continue;
			hitKeys.add(key);
			const hit = {
				channelId,
				pluginId: state.pluginId,
				reason: state.reason
			};
			if (channelAvailable) hit.channelAvailable = true;
			hits.push(hit);
		}
	};
	for (const channelId of genericChannelIds) {
		const ownerStates = registry.plugins.filter((plugin) => plugin.channels.some((rawChannelId) => normalizeOptionalLowercaseString(rawChannelId) === channelId)).map((plugin) => resolveConfiguredChannelOwnerState({
			plugin,
			channelId,
			sourceConfig: activationSourceConfig,
			sourcePluginsConfig,
			effectiveConfig: cfg,
			effectivePluginsConfig
		}));
		if (ownerStates.some((state) => state.available)) continue;
		addHits(channelId, ownerStates);
	}
	for (const [channelId, triggers] of manifestEnvTriggers) {
		const channelOwnerStates = registry.plugins.filter((plugin) => plugin.channels.some((rawChannelId) => normalizeOptionalLowercaseString(rawChannelId) === channelId)).map((plugin) => resolveConfiguredChannelOwnerState({
			plugin,
			channelId,
			sourceConfig: activationSourceConfig,
			sourcePluginsConfig,
			effectiveConfig: cfg,
			effectivePluginsConfig
		}));
		const channelAvailable = channelOwnerStates.some((state) => state.available);
		for (const pluginIds of triggers.values()) {
			const ownerStates = channelOwnerStates.filter((state) => pluginIds.has(state.pluginId));
			if (ownerStates.some((state) => state.available)) continue;
			addHits(channelId, ownerStates, channelAvailable);
		}
	}
	return hits;
}
function listManifestEnvConfiguredChannelTriggers(plugins, env) {
	const triggersByChannelId = /* @__PURE__ */ new Map();
	for (const plugin of plugins) {
		const ownedChannelIds = new Set(plugin.channels.map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId)));
		for (const [rawChannelId, envVars] of Object.entries(plugin.channelEnvVars ?? {})) {
			const channelId = normalizeOptionalLowercaseString(rawChannelId);
			if (!channelId || !ownedChannelIds.has(channelId)) continue;
			for (const envVar of envVars) {
				if (!isSafeChannelEnvVarTriggerName(envVar)) continue;
				const value = env[envVar] ?? env[envVar.toUpperCase()];
				if (typeof value !== "string" || value.trim().length === 0) continue;
				let triggers = triggersByChannelId.get(channelId);
				if (!triggers) {
					triggers = /* @__PURE__ */ new Map();
					triggersByChannelId.set(channelId, triggers);
				}
				const trigger = envVar.trim().toUpperCase();
				let ownerIds = triggers.get(trigger);
				if (!ownerIds) {
					ownerIds = /* @__PURE__ */ new Set();
					triggers.set(trigger, ownerIds);
				}
				ownerIds.add(plugin.id);
			}
		}
	}
	return triggersByChannelId;
}
function resolveConfiguredChannelOwnerState(params) {
	const bundledChannelConfigured = params.plugin.origin === "bundled" && hasExplicitChannelConfig({
		config: params.sourceConfig,
		channelId: params.channelId
	});
	const sourceAllowlistBypass = bundledChannelConfigured || params.plugin.origin === "workspace" && params.sourcePluginsConfig.slots.contextEngine === params.plugin.id;
	const sourceBaseBlock = resolveManifestOwnerBasePolicyBlock({
		plugin: params.plugin,
		normalizedConfig: params.sourcePluginsConfig,
		allowRestrictiveAllowlistBypass: sourceAllowlistBypass
	});
	const sourceExternalTrusted = params.plugin.origin === "bundled" || hasExplicitManifestOwnerTrust({
		plugin: params.plugin,
		normalizedConfig: params.sourcePluginsConfig
	}) || params.plugin.origin === "workspace" && params.sourcePluginsConfig.slots.contextEngine === params.plugin.id;
	const sourceBundledActivated = params.plugin.origin === "bundled" && (bundledChannelConfigured || isActivatedManifestOwner({
		plugin: params.plugin,
		normalizedConfig: params.sourcePluginsConfig,
		rootConfig: params.sourceConfig
	}));
	const sourceBundledNeedsExplicitEnablement = params.plugin.origin === "bundled" && !isPluginEnabledByDefaultForPlatform(params.plugin) && params.sourcePluginsConfig.entries[params.plugin.id]?.enabled !== true;
	const effectiveBundledChannelConfigured = params.plugin.origin === "bundled" && hasExplicitChannelConfig({
		config: params.effectiveConfig,
		channelId: params.channelId
	});
	const effectiveAllowlistBypass = effectiveBundledChannelConfigured || params.plugin.origin === "workspace" && params.effectivePluginsConfig.slots.contextEngine === params.plugin.id;
	const available = resolveManifestOwnerBasePolicyBlock({
		plugin: params.plugin,
		normalizedConfig: params.effectivePluginsConfig,
		allowRestrictiveAllowlistBypass: effectiveAllowlistBypass
	}) === null && sourceExternalTrusted && (effectiveBundledChannelConfigured || isActivatedManifestOwner({
		plugin: params.plugin,
		normalizedConfig: params.effectivePluginsConfig,
		rootConfig: params.effectiveConfig
	}));
	return {
		pluginId: params.plugin.id,
		available,
		reason: available ? void 0 : params.plugin.origin === "bundled" && sourceBaseBlock === "not-in-allowlist" && sourceBundledNeedsExplicitEnablement ? "not enabled and not in allowlist" : mapManifestOwnerBlockerReason(sourceBaseBlock) ?? (!sourceExternalTrusted && sourceBaseBlock === null ? "missing explicit enablement" : params.plugin.origin === "bundled" && sourceBaseBlock === null && !sourceBundledActivated ? "not enabled" : void 0)
	};
}
function mapManifestOwnerBlockerReason(reason) {
	if (reason === "plugins-disabled") return "plugins disabled";
	if (reason === "plugin-disabled") return "disabled in config";
	if (reason === "blocked-by-denylist") return "blocked by denylist";
	if (reason === "not-in-allowlist") return "not in allowlist";
}
function formatReason(hit) {
	if (hit.reason === "disabled in config") return `plugin "${sanitizeForLog(hit.pluginId)}" is disabled by plugins.entries.${sanitizeForLog(hit.pluginId)}.enabled=false.`;
	if (hit.reason === "blocked by denylist") return `plugin "${sanitizeForLog(hit.pluginId)}" is blocked by plugins.deny. Remove "${sanitizeForLog(hit.pluginId)}" from plugins.deny.`;
	if (hit.reason === "plugins disabled") return `plugins.enabled=false blocks channel plugins globally.`;
	if (hit.reason === "missing explicit enablement") return `external plugin "${sanitizeForLog(hit.pluginId)}" is installed without explicit trust. Add plugins.entries.${sanitizeForLog(hit.pluginId)}.enabled=true.`;
	if (hit.reason === "not enabled") return `plugin "${sanitizeForLog(hit.pluginId)}" is installed but not enabled. Add plugins.entries.${sanitizeForLog(hit.pluginId)}.enabled=true.`;
	if (hit.reason === "not enabled and not in allowlist") return `plugin "${sanitizeForLog(hit.pluginId)}" is not enabled and is omitted from plugins.allow. Add plugins.entries.${sanitizeForLog(hit.pluginId)}.enabled=true and include "${sanitizeForLog(hit.pluginId)}" in plugins.allow.`;
	if (hit.reason === "not in allowlist") return `plugin "${sanitizeForLog(hit.pluginId)}" is installed but omitted from plugins.allow. Include "${sanitizeForLog(hit.pluginId)}" in plugins.allow.`;
	return `plugin "${sanitizeForLog(hit.pluginId)}" is not loadable (${sanitizeForLog(hit.reason)}).`;
}
/** Format doctor warnings for configured channels blocked by plugin activation state. */
function collectConfiguredChannelPluginBlockerWarnings(hits) {
	return hits.map((hit) => `- channels.${sanitizeForLog(hit.channelId)}: channel is configured, but ${formatReason(hit)} Fix plugin enablement before relying on setup guidance for this channel.`);
}
/** Return true when a setup warning targets a channel already explained by plugin blockers. */
function isWarningBlockedByChannelPlugin(warning, hits) {
	return hits.some((hit) => {
		if (hit.channelAvailable) return false;
		const prefix = `channels.${sanitizeForLog(hit.channelId)}`;
		return warning.includes(`${prefix}:`) || warning.includes(`${prefix}.`);
	});
}
//#endregion
export { collectConfiguredChannelPluginBlockerWarnings, isWarningBlockedByChannelPlugin, scanConfiguredChannelPluginBlockers };
