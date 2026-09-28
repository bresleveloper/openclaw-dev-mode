import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { a as resolvePluginActivationDecisionShared, i as resolveMemorySlotDecisionShared, n as normalizePluginsConfigWithResolverCore, o as toPluginActivationState, r as resolveChannelConfigEnablement } from "./config-normalization-shared-B7M6gfm-.mjs";
import { n as defaultSlotIdForKey } from "./slots-D4OMSTbt.mjs";
//#region src/plugins/config-state.ts
/** Normalizes plugin config and resolves effective enablement, slots, and activation sources. */
const BUILT_IN_PLUGIN_ALIAS_FALLBACKS = [
	["google-gemini-cli", "google"],
	["minimax-portal", "minimax"],
	["minimax-portal-auth", "minimax"]
];
const BUILT_IN_PLUGIN_ALIAS_LOOKUP = new Map([...BUILT_IN_PLUGIN_ALIAS_FALLBACKS, ...BUILT_IN_PLUGIN_ALIAS_FALLBACKS.map(([, pluginId]) => [pluginId, pluginId])]);
const RETIRED_PLUGIN_IDS = /* @__PURE__ */ new Set([
	"google-antigravity-auth",
	"google-gemini-cli-auth",
	"skill-workshop"
]);
/** Normalizes user/config plugin ids into the canonical lowercase key form. */
function normalizePluginId(id) {
	const normalized = normalizeOptionalLowercaseString(id) ?? "";
	return BUILT_IN_PLUGIN_ALIAS_LOOKUP.get(normalized) ?? normalized;
}
function isRetiredPluginId(id) {
	return RETIRED_PLUGIN_IDS.has(normalizePluginId(id));
}
/** Identifies the credential-free marker that records an explicit plugin disable decision. */
function isExplicitPluginDisableMarker(value) {
	return isRecord(value) && value.enabled === false && Object.keys(value).length === 1;
}
const normalizePluginsConfig = (config) => {
	return normalizePluginsConfigWithResolverCore(config, normalizePluginId);
};
/** Resolves the enabled plugin selected to own the context-engine slot. */
function resolveSelectedContextEnginePluginId(config) {
	const plugins = normalizePluginsConfig(config?.plugins);
	return resolveSelectedContextEnginePluginIdFromConfig(plugins, plugins.slots.contextEngine);
}
function resolveSelectedContextEnginePluginIdFromConfig(plugins, pluginId) {
	if (!plugins.enabled || !pluginId || pluginId === defaultSlotIdForKey("contextEngine") || plugins.deny.includes(pluginId) || plugins.entries[pluginId]?.enabled === false) return;
	return pluginId;
}
/** Canonicalizes one plugin entry and its policy-list ids before a targeted mutation. */
function normalizePluginTargetConfig(config, pluginId) {
	const normalizedId = normalizePluginId(pluginId);
	const normalized = normalizePluginsConfig(config.plugins);
	const rawEntries = config.plugins?.entries ?? {};
	const hasTargetEntry = Object.keys(rawEntries).some((entryId) => normalizePluginId(entryId) === normalizedId);
	const entries = Object.fromEntries(Object.entries(rawEntries).filter(([entryId]) => normalizePluginId(entryId) !== normalizedId));
	if (hasTargetEntry) {
		const { config: pluginConfig, ...entry } = normalized.entries[normalizedId] ?? {};
		entries[normalizedId] = {
			...Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== void 0)),
			...isRecord(pluginConfig) ? { config: pluginConfig } : {}
		};
	}
	return {
		...config,
		plugins: {
			...config.plugins,
			...Array.isArray(config.plugins?.allow) ? { allow: normalized.allow } : {},
			...Array.isArray(config.plugins?.deny) ? { deny: normalized.deny } : {},
			entries
		}
	};
}
function createPluginActivationSource(params) {
	return {
		plugins: params.plugins ?? normalizePluginsConfig(params.config?.plugins),
		rootConfig: params.config
	};
}
const hasExplicitMemorySlot = (plugins) => Boolean(plugins?.slots && Object.hasOwn(plugins.slots, "memory"));
const hasExplicitMemoryEntry = (plugins) => Boolean(plugins?.entries && Object.hasOwn(plugins.entries, defaultSlotIdForKey("memory")));
function hasExplicitPluginConfig(plugins) {
	if (!plugins) return false;
	if (typeof plugins.enabled === "boolean") return true;
	if (Array.isArray(plugins.allow) && plugins.allow.length > 0) return true;
	if (Array.isArray(plugins.deny) && plugins.deny.length > 0) return true;
	if (plugins.load?.paths && Array.isArray(plugins.load.paths) && plugins.load.paths.length > 0) return true;
	if (plugins.slots && Object.keys(plugins.slots).length > 0) return true;
	if (plugins.entries && Object.keys(plugins.entries).length > 0) return true;
	return false;
}
function applyTestPluginDefaults(cfg, env = process.env) {
	if (!env.VITEST) return cfg;
	const plugins = cfg.plugins;
	if (hasExplicitPluginConfig(plugins)) {
		if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) return cfg;
		return {
			...cfg,
			plugins: {
				...plugins,
				slots: {
					...plugins?.slots,
					memory: "none"
				}
			}
		};
	}
	return {
		...cfg,
		plugins: {
			...plugins,
			enabled: false,
			slots: {
				...plugins?.slots,
				memory: "none"
			}
		}
	};
}
function isTestDefaultMemorySlotDisabled(cfg, env = process.env) {
	if (!env.VITEST) return false;
	const plugins = cfg.plugins;
	if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) return false;
	return true;
}
function resolveEffectivePluginActivationState(params) {
	return toPluginActivationState(resolvePluginActivationDecisionShared({
		...params,
		activationSource: params.activationSource ?? createPluginActivationSource({
			config: params.rootConfig,
			plugins: params.config
		}),
		allowBundledChannelExplicitBypassesAllowlist: true,
		resolveChannelConfigEnablement
	}));
}
function toEnableStateResult(state) {
	return state.enabled ? { enabled: true } : {
		enabled: false,
		reason: state.reason
	};
}
const resolveEnableState = (id, origin, config, enabledByDefault) => toEnableStateResult(resolveEffectivePluginActivationState({
	id,
	origin,
	config,
	enabledByDefault
}));
const resolveEffectiveEnableState = (params) => toEnableStateResult(resolveEffectivePluginActivationState(params));
function resolveMemorySlotDecision(params) {
	return resolveMemorySlotDecisionShared(params);
}
//#endregion
export { isRetiredPluginId as a, normalizePluginTargetConfig as c, resolveEffectivePluginActivationState as d, resolveEnableState as f, resolveSelectedContextEnginePluginIdFromConfig as h, isExplicitPluginDisableMarker as i, normalizePluginsConfig as l, resolveSelectedContextEnginePluginId as m, createPluginActivationSource as n, isTestDefaultMemorySlotDisabled as o, resolveMemorySlotDecision as p, hasExplicitPluginConfig as r, normalizePluginId as s, applyTestPluginDefaults as t, resolveEffectiveEnableState as u };
