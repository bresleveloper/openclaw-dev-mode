import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { h as resolveSelectedContextEnginePluginIdFromConfig, l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { n as listExplicitlyDisabledChannelIdsForConfig, r as listPotentialConfiguredChannelIds } from "./config-presence-D97iwlYy.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { l as resolveConfiguredChannelPluginIds, s as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-C83ks5im.mjs";
import { t as loadGatewayStartupPluginPlan } from "./gateway-startup-plugin-loader-9UPXbh15.mjs";
import "./channel-plugin-ids-DiMsgxMa.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
//#region src/plugins/effective-plugin-ids.ts
/** Resolves effective plugin ids from config, installed records, and activation metadata. */
function collectConfiguredChannelIds(config, activationSourceConfig, env, discovery) {
	const disabled = /* @__PURE__ */ new Set([...listExplicitlyDisabledChannelIdsForConfig(config), ...listExplicitlyDisabledChannelIdsForConfig(activationSourceConfig)]);
	return [.../* @__PURE__ */ new Set([...listPotentialConfiguredChannelIds(config, env, {
		includePersistedAuthState: false,
		discovery
	}), ...listExplicitConfiguredChannelIdsForConfig(activationSourceConfig)])].map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => {
		if (!channelId) return false;
		return !disabled.has(channelId);
	}).toSorted((left, right) => left.localeCompare(right));
}
function addBundledChannelOwnerPluginIds(params) {
	const plugins = normalizePluginsConfig(params.config.plugins);
	const channelIds = new Set(params.channelIds.map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId)));
	if (channelIds.size === 0) return;
	const env = params.bundledPluginsDir ? {
		...params.env,
		OPENCLAW_BUNDLED_PLUGINS_DIR: params.bundledPluginsDir,
		...isVitestRuntimeEnv(params.env) || isVitestRuntimeEnv() ? { OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR: "1" } : {}
	} : params.env;
	const records = params.manifestRecords ?? loadManifestMetadataSnapshot({
		config: params.config,
		env,
		workspaceDir: params.workspaceDir
	}).plugins;
	for (const plugin of records) {
		if (plugin.origin !== "bundled") continue;
		if (plugin.channels.some((channelId) => channelIds.has(normalizeOptionalLowercaseString(channelId) ?? ""))) {
			const pluginId = normalizeOptionalLowercaseString(plugin.id);
			if (pluginId && passesManifestOwnerBasePolicy({
				plugin: { id: pluginId },
				normalizedConfig: plugins,
				allowRestrictiveAllowlistBypass: true
			})) params.pluginIds.add(pluginId);
		}
	}
}
/** Lists plugin ids that are effectively enabled for a config/discovery context. */
function resolveEffectivePluginIds(params) {
	const prepared = params.bundledPluginsDir || params.metadataSnapshot?.pluginIds ? void 0 : params.metadataSnapshot;
	const effectiveConfig = applyPluginAutoEnable({
		config: params.config,
		env: params.env,
		...prepared ? { manifestRegistry: prepared.manifestRegistry } : {},
		...prepared?.discovery ? { discovery: prepared.discovery } : {}
	}).config;
	const plugins = normalizePluginsConfig(effectiveConfig.plugins);
	const ids = new Set(plugins.enabled ? plugins.allow : []);
	if (plugins.enabled) {
		for (const [pluginId, entry] of Object.entries(plugins.entries)) if (entry?.enabled === false) ids.delete(pluginId);
		else if (entry?.enabled === true && (plugins.allow.length === 0 || plugins.allow.includes(pluginId))) ids.add(pluginId);
		for (const pluginId of plugins.deny) ids.delete(pluginId);
	}
	const contextEnginePluginId = resolveSelectedContextEnginePluginIdFromConfig(plugins, plugins.slots.contextEngine);
	if (contextEnginePluginId) ids.add(contextEnginePluginId);
	const configuredChannelIds = collectConfiguredChannelIds(effectiveConfig, params.config, params.env, prepared?.discovery);
	for (const pluginId of resolveConfiguredChannelPluginIds({
		config: effectiveConfig,
		activationSourceConfig: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: prepared?.plugins,
		discovery: prepared?.discovery
	})) ids.add(pluginId);
	addBundledChannelOwnerPluginIds({
		pluginIds: ids,
		config: effectiveConfig,
		channelIds: configuredChannelIds,
		env: params.env,
		workspaceDir: params.workspaceDir,
		manifestRecords: prepared?.plugins,
		...params.bundledPluginsDir ? { bundledPluginsDir: params.bundledPluginsDir } : {}
	});
	for (const pluginId of loadGatewayStartupPluginPlan({
		config: effectiveConfig,
		activationSourceConfig: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...prepared ? { metadataSnapshot: prepared } : {}
	}).pluginIds) ids.add(pluginId);
	return sortUniqueStrings(ids);
}
//#endregion
export { resolveEffectivePluginIds as t };
