import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { f as asSafeIntegerInRange } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries, r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
//#region src/plugins/slots.ts
/** Applies mutually exclusive plugin slot selection for memory and context-engine plugins. */
const SLOT_BY_KIND = {
	memory: "memory",
	"context-engine": "contextEngine"
};
const DEFAULT_SLOT_BY_KEY = {
	memory: "memory-core",
	contextEngine: "legacy"
};
const PLUGIN_SLOT_KEYS = Object.keys(DEFAULT_SLOT_BY_KEY);
/** Normalize a kind field to an array for uniform iteration. */
function normalizeKinds(kind) {
	if (!kind) return [];
	return Array.isArray(kind) ? kind : [kind];
}
/** Check whether a plugin's kind field includes a specific kind. */
function hasKind(kind, target) {
	return normalizeKinds(kind).includes(target);
}
/** Order-insensitive equality check for two kind values (string or array). */
function kindsEqual(a, b) {
	const aN = normalizeKinds(a).toSorted();
	const bN = normalizeKinds(b).toSorted();
	return aN.length === bN.length && aN.every((k, i) => k === bN[i]);
}
/** Return all slot keys that a plugin's kind field maps to. */
function slotKeysForPluginKind(kind) {
	return normalizeKinds(kind).map((k) => SLOT_BY_KIND[k]).filter((k) => k != null);
}
/** Returns the implicit plugin id that owns a slot before config overrides it. */
function defaultSlotIdForKey(slotKey) {
	return DEFAULT_SLOT_BY_KEY[slotKey];
}
/** Raw `plugins.slots[key]`: `none` turns the slot off, blank leaves it unset. */
function normalizeSlotValue(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (normalizeOptionalLowercaseString(trimmed) === "none") return null;
	return trimmed;
}
function resolveSlotSelection(slotKey, value) {
	const normalized = normalizeSlotValue(value);
	if (normalized === void 0) return {
		kind: "default",
		pluginId: defaultSlotIdForKey(slotKey)
	};
	return normalized === null ? { kind: "off" } : {
		kind: "pinned",
		pluginId: normalized
	};
}
/** Resets every slot currently owned by a plugin to its implicit default. */
function resetPluginSlotsToDefaults(slots, pluginId) {
	if (!slots) return slots;
	const next = { ...slots };
	let changed = false;
	for (const slotKey of PLUGIN_SLOT_KEYS) {
		if (slots[slotKey] !== pluginId) continue;
		delete next[slotKey];
		changed = true;
	}
	return changed ? Object.keys(next).length === 0 ? void 0 : next : slots;
}
/** Updates config so the selected plugin owns all slots implied by its kind. */
function applyExclusiveSlotSelection(params) {
	const slotKeys = slotKeysForPluginKind(params.selectedKind);
	if (slotKeys.length === 0) return params.config;
	const pluginsConfig = params.config.plugins ?? {};
	let anyChanged = false;
	const entries = { ...pluginsConfig.entries };
	const slots = { ...pluginsConfig.slots };
	for (const slotKey of slotKeys) {
		const prevSlot = slots[slotKey];
		const nextSlot = params.selectedId === defaultSlotIdForKey(slotKey) ? void 0 : params.selectedId;
		if (nextSlot === void 0) delete slots[slotKey];
		else slots[slotKey] = nextSlot;
		if (prevSlot !== nextSlot) anyChanged = true;
	}
	if (!anyChanged) return params.config;
	const { slots: _previousSlots, ...pluginsWithoutSlots } = pluginsConfig;
	return {
		...params.config,
		plugins: {
			...pluginsWithoutSlots,
			...Object.keys(slots).length > 0 ? { slots } : {},
			entries
		}
	};
}
//#endregion
//#region src/plugins/config-normalization-shared.ts
/** Default plugin id normalizer for already-canonical ids. */
const identityNormalizePluginId = (id) => id.trim();
function normalizePluginConfigList(value, normalizePluginId) {
	return filterStringEntries(value).map((entry) => normalizePluginId(entry)).filter(Boolean);
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
	const resolvePolicyId = (id) => normalizePluginPolicyId(normalizePluginId(id));
	return {
		enabled: config?.enabled ?? true,
		allow: normalizePluginConfigList(config?.allow, resolvePolicyId),
		deny: normalizePluginConfigList(config?.deny, resolvePolicyId),
		loadPaths: normalizePluginConfigList(config?.load?.paths, identityNormalizePluginId),
		slots: {
			memory: memorySlot.kind === "off" ? null : memorySlot.pluginId,
			contextEngine: normalizeSlotValue(config?.slots?.contextEngine)
		},
		entries: normalizePluginEntries(config?.entries, resolvePolicyId)
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
	const autoEnabledReason = params.autoEnabledReason || (entry?.enabled === true ? "enabled by effective config" : void 0) || (params.origin === "bundled" && resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true ? "channel configured" : void 0);
	if (params.origin === "bundled" && params.enabledByDefault === true && (!autoEnabledReason || activationSource.plugins.allow.length === 0 || activationSource.plugins.allow.includes(policyId))) return decision("default", {
		explicitlyEnabled: false,
		reason: "bundled default enablement"
	});
	if (autoEnabledReason) return decision("auto", {
		explicitlyEnabled: false,
		reason: autoEnabledReason
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
	const normalized = normalizePluginPolicyId(id);
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
	if (!plugins.enabled || !pluginId || pluginId === defaultSlotIdForKey("contextEngine") || plugins.deny.includes(normalizePluginPolicyId(pluginId)) || plugins.entries[normalizePluginPolicyId(pluginId)]?.enabled === false) return;
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
export { defaultSlotIdForKey as C, resetPluginSlotsToDefaults as E, applyExclusiveSlotSelection as S, kindsEqual as T, resolveSelectedContextEnginePluginIdFromConfig as _, isExplicitPluginDisableMarker as a, normalizePluginsConfigWithResolverCore as b, normalizePluginId as c, prepareRuntimePluginsConfig as d, resolveEffectiveEnableState as f, resolveSelectedContextEnginePluginId as g, resolveMemorySlotDecision as h, hasExplicitPluginConfig as i, normalizePluginTargetConfig as l, resolveEnableState as m, createNormalizedPluginsConfig as n, isRetiredPluginId as o, resolveEffectivePluginActivationState as p, createPluginActivationSource as r, isTestDefaultMemorySlotDisabled as s, applyTestPluginDefaults as t, normalizePluginsConfig as u, resolvePluginActivationStateShared as v, hasKind as w, resolveChannelConfigEnablement as x, normalizePluginConfigList as y };
