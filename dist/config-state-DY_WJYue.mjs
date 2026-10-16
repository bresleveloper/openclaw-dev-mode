import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { f as asSafeIntegerInRange } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { a as normalizeSlotValue, n as defaultSlotIdForKey, s as resolveSlotSelection } from "./slots-DarSawuQ.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
//#region src/plugins/config-normalization-shared.ts
/** Default plugin id normalizer for already-canonical ids. */
const identityNormalizePluginId = (id) => id.trim();
function normalizePluginConfigList(value, normalizePluginId) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => typeof entry === "string" ? normalizePluginId(entry) : "").filter(Boolean);
}
function normalizeHookTimeoutMs(value) {
	return asSafeIntegerInRange(value, {
		min: 1,
		max: 6e5
	});
}
function normalizeHookTimeouts(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [hookName, timeoutMs] of Object.entries(value)) {
		const normalizedTimeoutMs = normalizeHookTimeoutMs(timeoutMs);
		if (normalizedTimeoutMs !== void 0) normalized[hookName] = normalizedTimeoutMs;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePluginHooks(value) {
	if (!isRecord(value)) return;
	const hooks = {};
	for (const key of ["allowPromptInjection", "allowConversationAccess"]) if (typeof value[key] === "boolean") hooks[key] = value[key];
	const timeoutMs = normalizeHookTimeoutMs(value.timeoutMs);
	const timeouts = normalizeHookTimeouts(value.timeouts);
	if (timeoutMs !== void 0) hooks.timeoutMs = timeoutMs;
	if (timeouts !== void 0) hooks.timeouts = timeouts;
	return Object.keys(hooks).length > 0 ? hooks : void 0;
}
function normalizePluginModelConfig(value, kind) {
	if (!isRecord(value)) return;
	const config = {};
	if (typeof value.allowModelOverride === "boolean") config.allowModelOverride = value.allowModelOverride;
	for (const [key, configuredKey] of [["allowedModels", "hasAllowedModelsConfig"], ["allowedCompletionModels", "hasAllowedCompletionModelsConfig"]]) {
		if (key === "allowedCompletionModels" && kind !== "llm") continue;
		const models = normalizeArrayBackedTrimmedStringList(value[key]);
		if (models) {
			config[configuredKey] = true;
			if (models.length > 0) config[key] = models;
		}
	}
	if (kind === "llm") {
		for (const key of ["allowAuthProfileOverride", "allowAgentIdOverride"]) if (typeof value[key] === "boolean") config[key] = value[key];
	}
	return Object.keys(config).length > 0 ? config : void 0;
}
function normalizePluginEntries(entries, normalizePluginId) {
	if (!isRecord(entries)) return {};
	const normalized = {};
	for (const [key, value] of Object.entries(entries)) {
		const normalizedKey = normalizePluginId(key);
		if (!normalizedKey) continue;
		if (!isRecord(value)) {
			normalized[normalizedKey] = {};
			continue;
		}
		const entry = value;
		normalized[normalizedKey] = {
			...normalized[normalizedKey],
			enabled: typeof entry.enabled === "boolean" ? entry.enabled : normalized[normalizedKey]?.enabled,
			hooks: normalizePluginHooks(entry.hooks) ?? normalized[normalizedKey]?.hooks,
			subagent: normalizePluginModelConfig(entry.subagent, "subagent") ?? normalized[normalizedKey]?.subagent,
			llm: normalizePluginModelConfig(entry.llm, "llm") ?? normalized[normalizedKey]?.llm,
			config: "config" in entry ? entry.config : normalized[normalizedKey]?.config
		};
	}
	return normalized;
}
/** Normalizes plugin config while allowing callers to resolve aliases first. */
function normalizePluginsConfigWithResolverCore(config, normalizePluginId = identityNormalizePluginId) {
	const memorySlot = resolveSlotSelection("memory", config?.slots?.memory);
	return {
		enabled: config?.enabled ?? true,
		allow: normalizePluginConfigList(config?.allow, normalizePluginId),
		deny: normalizePluginConfigList(config?.deny, normalizePluginId),
		loadPaths: normalizePluginConfigList(config?.load?.paths, identityNormalizePluginId),
		slots: {
			memory: memorySlot.kind === "off" ? null : memorySlot.pluginId,
			contextEngine: normalizeSlotValue(config?.slots?.contextEngine)
		},
		entries: normalizePluginEntries(config?.entries, normalizePluginId)
	};
}
/**
* Enables an owner for any enabled channel; disables it only when all channels are off.
* Unspecified channels leave the plugin's own activation policy in control.
*/
function resolveChannelConfigEnablement(cfg, pluginId, channelIds = []) {
	const channels = cfg?.channels;
	if (!channels) return;
	const enablement = (channelIds.length ? channelIds.map((channelId) => normalizeChatChannelId(channelId) ?? channelId) : [normalizeChatChannelId(pluginId)]).map((channelId) => {
		const entry = channelId ? channels[channelId] : void 0;
		return isRecord(entry) ? entry.enabled : void 0;
	});
	if (enablement.includes(true)) return true;
	return enablement.every((enabled) => enabled === false) ? false : void 0;
}
//#endregion
//#region src/plugins/config-activation-shared.ts
function resolveExplicitPluginSelectionShared(params) {
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.entries[policyId]?.enabled === true) return "enabled in config";
	if (params.origin === "bundled" && resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return "channel enabled in config";
	if (params.config.slots.memory === params.id) return "selected memory slot";
	if (params.config.slots.contextEngine === params.id) return "selected context engine slot";
	if (params.origin !== "bundled" && params.config.allow.includes(policyId)) return "selected in allowlist";
}
function resolvePluginActivationStateShared(params) {
	const activationSource = params.activationSource ?? {
		plugins: params.config,
		rootConfig: params.rootConfig
	};
	const explicitReason = resolveExplicitPluginSelectionShared({
		id: params.id,
		origin: params.origin,
		config: activationSource.plugins,
		rootConfig: activationSource.rootConfig,
		channelIds: params.channelIds
	});
	const decision = (source, details = {}) => ({
		enabled: source !== "disabled",
		activated: source !== "disabled",
		explicitlyEnabled: explicitReason !== void 0,
		source,
		reason: void 0,
		...details
	});
	if (!params.config.enabled) return decision("disabled", { reason: "plugins disabled" });
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.deny.includes(policyId)) return decision("disabled", { reason: "blocked by denylist" });
	const entry = params.config.entries[policyId];
	if (entry?.enabled === false) return decision("disabled", { reason: "disabled in config" });
	if (resolveChannelConfigEnablement(activationSource.rootConfig ?? params.rootConfig, params.id, params.channelIds) === false) return decision("disabled", { reason: "channel disabled in config" });
	const explicitlyAllowed = params.config.allow.includes(policyId);
	if (params.origin === "workspace" && !explicitlyAllowed && entry?.enabled !== true && explicitReason !== "selected context engine slot") return decision("disabled", { reason: "workspace plugin (disabled by default)" });
	if (params.config.slots.memory === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		reason: "selected memory slot"
	});
	if (params.config.slots.contextEngine === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		reason: "selected context engine slot"
	});
	if (params.allowBundledChannelExplicitBypassesAllowlist === true && explicitReason === "channel enabled in config") return decision("explicit", {
		explicitlyEnabled: true,
		reason: explicitReason
	});
	if (params.config.allow.length > 0 && !explicitlyAllowed) return decision("disabled", { reason: "not in allowlist" });
	if (explicitReason) return decision("explicit", {
		explicitlyEnabled: true,
		reason: explicitReason
	});
	if (params.autoEnabledReason) return decision("auto", {
		explicitlyEnabled: false,
		reason: params.autoEnabledReason
	});
	if (entry?.enabled === true) return decision("auto", {
		explicitlyEnabled: false,
		reason: "enabled by effective config"
	});
	if (params.origin === "bundled" && resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return decision("auto", {
		explicitlyEnabled: false,
		reason: "channel configured"
	});
	if (params.origin === "bundled" && params.enabledByDefault === true) return decision("default", {
		explicitlyEnabled: false,
		reason: "bundled default enablement"
	});
	if (params.origin === "bundled") return decision("disabled", {
		explicitlyEnabled: false,
		reason: "bundled (disabled by default)"
	});
	return decision("default");
}
function resolveMemorySlotDecisionShared(params) {
	if (!(Array.isArray(params.kind) ? params.kind.includes("memory") : params.kind === "memory")) return { enabled: true };
	const isMultiKind = Array.isArray(params.kind) && params.kind.length > 1;
	if (params.slot === null) return isMultiKind ? { enabled: true } : {
		enabled: false,
		reason: "memory slot disabled"
	};
	if (typeof params.slot === "string") {
		if (params.slot === params.id) return {
			enabled: true,
			selected: true
		};
		return isMultiKind ? { enabled: true } : {
			enabled: false,
			reason: `memory slot set to "${params.slot}"`
		};
	}
	if (params.selectedId && params.selectedId !== params.id) return isMultiKind ? { enabled: true } : {
		enabled: false,
		reason: `memory slot already filled by "${params.selectedId}"`
	};
	return {
		enabled: true,
		selected: true
	};
}
//#endregion
//#region src/plugins/config-state.ts
/** Normalizes plugin config and resolves effective enablement, slots, and activation sources. */
const BUILT_IN_PLUGIN_ALIAS_LOOKUP = /* @__PURE__ */ new Map([
	["google-gemini-cli", "google"],
	["minimax-portal", "minimax"],
	["minimax-portal-auth", "minimax"]
]);
const RETIRED_PLUGIN_IDS = /* @__PURE__ */ new Set([
	"google-antigravity-auth",
	"google-gemini-cli-auth",
	"skill-workshop",
	"webhooks"
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
/** Builds caller-owned policy without exposing the host's prepared objects. */
const createNormalizedPluginsConfig = (config) => normalizePluginsConfigWithResolverCore(config, normalizePluginId);
const normalizePluginsConfig = (config) => {
	if (preparedRuntimePluginsConfig && preparedRuntimePluginsConfig.source === config) return preparedRuntimePluginsConfig.value;
	return createNormalizedPluginsConfig(config);
};
let preparedRuntimePluginsConfig;
/** Runtime config publication owns replacement, including same-object refreshes and teardown. */
function prepareRuntimePluginsConfig(config) {
	if (!config) {
		preparedRuntimePluginsConfig = void 0;
		return;
	}
	const value = createNormalizedPluginsConfig(config.plugins);
	for (const entry of Object.values(value.entries)) {
		const { config: _config, ...policy } = entry;
		freezeJsonSnapshot(policy);
		Object.freeze(entry);
	}
	Object.freeze(value.entries);
	for (const field of [
		value.allow,
		value.deny,
		value.loadPaths,
		value.slots
	]) Object.freeze(field);
	preparedRuntimePluginsConfig = {
		source: config.plugins,
		value: Object.freeze(value)
	};
}
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
	return typeof plugins.enabled === "boolean" || Array.isArray(plugins.allow) && plugins.allow.length > 0 || Array.isArray(plugins.deny) && plugins.deny.length > 0 || Array.isArray(plugins.load?.paths) && plugins.load.paths.length > 0 || Boolean(plugins.slots && Object.keys(plugins.slots).length > 0) || Boolean(plugins.entries && Object.keys(plugins.entries).length > 0);
}
function applyTestPluginDefaults(cfg, env = process.env) {
	if (!env.VITEST) return cfg;
	const plugins = cfg.plugins;
	const explicitConfig = hasExplicitPluginConfig(plugins);
	if (explicitConfig && (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins))) return cfg;
	return {
		...cfg,
		plugins: {
			...plugins,
			...!explicitConfig ? { enabled: false } : {},
			slots: {
				...plugins?.slots,
				memory: "none"
			}
		}
	};
}
function isTestDefaultMemorySlotDisabled(cfg, env = process.env) {
	return Boolean(env.VITEST) && !hasExplicitMemorySlot(cfg.plugins) && !hasExplicitMemoryEntry(cfg.plugins);
}
function resolveEffectivePluginActivationState(params) {
	return resolvePluginActivationStateShared({
		...params,
		allowBundledChannelExplicitBypassesAllowlist: true
	});
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
export { resolveSelectedContextEnginePluginIdFromConfig as _, isExplicitPluginDisableMarker as a, normalizePluginsConfigWithResolverCore as b, normalizePluginId as c, prepareRuntimePluginsConfig as d, resolveEffectiveEnableState as f, resolveSelectedContextEnginePluginId as g, resolveMemorySlotDecision as h, hasExplicitPluginConfig as i, normalizePluginTargetConfig as l, resolveEnableState as m, createNormalizedPluginsConfig as n, isRetiredPluginId as o, resolveEffectivePluginActivationState as p, createPluginActivationSource as r, isTestDefaultMemorySlotDisabled as s, applyTestPluginDefaults as t, normalizePluginsConfig as u, resolvePluginActivationStateShared as v, resolveChannelConfigEnablement as x, normalizePluginConfigList as y };
