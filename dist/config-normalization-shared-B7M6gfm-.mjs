import { f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { a as normalizeSlotValue, s as resolveSlotSelection } from "./slots-D4OMSTbt.mjs";
//#region src/plugins/config-activation-shared.ts
const PLUGIN_ACTIVATION_REASON_BY_CAUSE = {
	"enabled-in-config": "enabled in config",
	"bundled-channel-enabled-in-config": "channel enabled in config",
	"selected-memory-slot": "selected memory slot",
	"selected-context-engine-slot": "selected context engine slot",
	"selected-in-allowlist": "selected in allowlist",
	"plugins-disabled": "plugins disabled",
	"blocked-by-denylist": "blocked by denylist",
	"disabled-in-config": "disabled in config",
	"channel-disabled-in-config": "channel disabled in config",
	"workspace-disabled-by-default": "workspace plugin (disabled by default)",
	"not-in-allowlist": "not in allowlist",
	"enabled-by-effective-config": "enabled by effective config",
	"bundled-channel-configured": "channel configured",
	"bundled-default-enablement": "bundled default enablement",
	"bundled-disabled-by-default": "bundled (disabled by default)"
};
function resolvePluginActivationReason(cause, reason) {
	if (reason) return reason;
	return cause ? PLUGIN_ACTIVATION_REASON_BY_CAUSE[cause] : void 0;
}
function toPluginActivationState(decision) {
	return {
		enabled: decision.enabled,
		activated: decision.activated,
		explicitlyEnabled: decision.explicitlyEnabled,
		source: decision.source,
		reason: resolvePluginActivationReason(decision.cause, decision.reason)
	};
}
function resolveExplicitPluginSelectionShared(params) {
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.entries[policyId]?.enabled === true) return {
		explicitlyEnabled: true,
		cause: "enabled-in-config"
	};
	if (params.origin === "bundled" && params.resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return {
		explicitlyEnabled: true,
		cause: "bundled-channel-enabled-in-config"
	};
	if (params.config.slots.memory === params.id) return {
		explicitlyEnabled: true,
		cause: "selected-memory-slot"
	};
	if (params.config.slots.contextEngine === params.id) return {
		explicitlyEnabled: true,
		cause: "selected-context-engine-slot"
	};
	if (params.origin !== "bundled" && params.config.allow.includes(policyId)) return {
		explicitlyEnabled: true,
		cause: "selected-in-allowlist"
	};
	return { explicitlyEnabled: false };
}
function resolvePluginActivationDecisionShared(params) {
	const activationSource = params.activationSource ?? {
		plugins: params.config,
		rootConfig: params.rootConfig
	};
	const explicitSelection = resolveExplicitPluginSelectionShared({
		id: params.id,
		origin: params.origin,
		config: activationSource.plugins,
		rootConfig: activationSource.rootConfig,
		channelIds: params.channelIds,
		resolveChannelConfigEnablement: params.resolveChannelConfigEnablement
	});
	const decision = (source, details = {}) => ({
		enabled: source !== "disabled",
		activated: source !== "disabled",
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source,
		...details
	});
	if (!params.config.enabled) return decision("disabled", { cause: "plugins-disabled" });
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.deny.includes(policyId)) return decision("disabled", { cause: "blocked-by-denylist" });
	const entry = params.config.entries[policyId];
	if (entry?.enabled === false) return decision("disabled", { cause: "disabled-in-config" });
	if (params.resolveChannelConfigEnablement(activationSource.rootConfig ?? params.rootConfig, params.id, params.channelIds) === false) return decision("disabled", { cause: "channel-disabled-in-config" });
	const explicitlyAllowed = params.config.allow.includes(policyId);
	if (params.origin === "workspace" && !explicitlyAllowed && entry?.enabled !== true && explicitSelection.cause !== "selected-context-engine-slot") return decision("disabled", { cause: "workspace-disabled-by-default" });
	if (params.config.slots.memory === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		cause: "selected-memory-slot"
	});
	if (params.config.slots.contextEngine === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		cause: "selected-context-engine-slot"
	});
	if (params.allowBundledChannelExplicitBypassesAllowlist === true && explicitSelection.cause === "bundled-channel-enabled-in-config") return decision("explicit", {
		explicitlyEnabled: true,
		cause: explicitSelection.cause
	});
	if (params.config.allow.length > 0 && !explicitlyAllowed) return decision("disabled", { cause: "not-in-allowlist" });
	if (explicitSelection.explicitlyEnabled) return decision("explicit", {
		explicitlyEnabled: true,
		cause: explicitSelection.cause
	});
	if (params.autoEnabledReason) return decision("auto", {
		explicitlyEnabled: false,
		reason: params.autoEnabledReason
	});
	if (entry?.enabled === true) return decision("auto", {
		explicitlyEnabled: false,
		cause: "enabled-by-effective-config"
	});
	if (params.origin === "bundled" && params.resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return decision("auto", {
		explicitlyEnabled: false,
		cause: "bundled-channel-configured"
	});
	if (params.origin === "bundled" && params.enabledByDefault === true) return decision("default", {
		explicitlyEnabled: false,
		cause: "bundled-default-enablement"
	});
	if (params.origin === "bundled") return decision("disabled", {
		explicitlyEnabled: false,
		cause: "bundled-disabled-by-default"
	});
	return decision("default");
}
function hasKind(kind, target) {
	if (!kind) return false;
	return Array.isArray(kind) ? kind.includes(target) : kind === target;
}
function resolveMemorySlotDecisionShared(params) {
	if (!hasKind(params.kind, "memory")) return { enabled: true };
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
		const hooksRaw = entry.hooks;
		const hooks = isRecord(hooksRaw) ? {
			allowPromptInjection: hooksRaw.allowPromptInjection,
			allowConversationAccess: hooksRaw.allowConversationAccess,
			timeoutMs: normalizeHookTimeoutMs(hooksRaw.timeoutMs),
			timeouts: normalizeHookTimeouts(hooksRaw.timeouts)
		} : void 0;
		const normalizedHooks = hooks && (typeof hooks.allowPromptInjection === "boolean" || typeof hooks.allowConversationAccess === "boolean" || hooks.timeoutMs !== void 0 || hooks.timeouts !== void 0) ? {
			...typeof hooks.allowPromptInjection === "boolean" ? { allowPromptInjection: hooks.allowPromptInjection } : {},
			...typeof hooks.allowConversationAccess === "boolean" ? { allowConversationAccess: hooks.allowConversationAccess } : {},
			...hooks.timeoutMs !== void 0 ? { timeoutMs: hooks.timeoutMs } : {},
			...hooks.timeouts !== void 0 ? { timeouts: hooks.timeouts } : {}
		} : void 0;
		const subagentRaw = entry.subagent;
		const subagent = isRecord(subagentRaw) ? {
			allowModelOverride: subagentRaw.allowModelOverride,
			hasAllowedModelsConfig: Array.isArray(subagentRaw.allowedModels),
			allowedModels: Array.isArray(subagentRaw.allowedModels) ? normalizeArrayBackedTrimmedStringList(subagentRaw.allowedModels) : void 0
		} : void 0;
		const normalizedSubagent = subagent && (typeof subagent.allowModelOverride === "boolean" || subagent.hasAllowedModelsConfig || Array.isArray(subagent.allowedModels) && subagent.allowedModels.length > 0) ? {
			...typeof subagent.allowModelOverride === "boolean" ? { allowModelOverride: subagent.allowModelOverride } : {},
			...subagent.hasAllowedModelsConfig ? { hasAllowedModelsConfig: true } : {},
			...Array.isArray(subagent.allowedModels) && subagent.allowedModels.length > 0 ? { allowedModels: subagent.allowedModels } : {}
		} : void 0;
		const llmRaw = entry.llm;
		const llm = isRecord(llmRaw) ? {
			allowModelOverride: llmRaw.allowModelOverride,
			hasAllowedModelsConfig: Array.isArray(llmRaw.allowedModels),
			allowedModels: Array.isArray(llmRaw.allowedModels) ? normalizeArrayBackedTrimmedStringList(llmRaw.allowedModels) : void 0,
			hasAllowedCompletionModelsConfig: Array.isArray(llmRaw.allowedCompletionModels),
			allowedCompletionModels: Array.isArray(llmRaw.allowedCompletionModels) ? normalizeArrayBackedTrimmedStringList(llmRaw.allowedCompletionModels) : void 0,
			allowAuthProfileOverride: llmRaw.allowAuthProfileOverride,
			allowAgentIdOverride: llmRaw.allowAgentIdOverride
		} : void 0;
		const normalizedLlm = llm && (typeof llm.allowModelOverride === "boolean" || llm.hasAllowedModelsConfig || Array.isArray(llm.allowedModels) && llm.allowedModels.length > 0 || llm.hasAllowedCompletionModelsConfig || Array.isArray(llm.allowedCompletionModels) && llm.allowedCompletionModels.length > 0 || typeof llm.allowAuthProfileOverride === "boolean" || typeof llm.allowAgentIdOverride === "boolean") ? {
			...typeof llm.allowModelOverride === "boolean" ? { allowModelOverride: llm.allowModelOverride } : {},
			...llm.hasAllowedModelsConfig ? { hasAllowedModelsConfig: true } : {},
			...Array.isArray(llm.allowedModels) && llm.allowedModels.length > 0 ? { allowedModels: llm.allowedModels } : {},
			...llm.hasAllowedCompletionModelsConfig ? { hasAllowedCompletionModelsConfig: true } : {},
			...Array.isArray(llm.allowedCompletionModels) && llm.allowedCompletionModels.length > 0 ? { allowedCompletionModels: llm.allowedCompletionModels } : {},
			...typeof llm.allowAuthProfileOverride === "boolean" ? { allowAuthProfileOverride: llm.allowAuthProfileOverride } : {},
			...typeof llm.allowAgentIdOverride === "boolean" ? { allowAgentIdOverride: llm.allowAgentIdOverride } : {}
		} : void 0;
		normalized[normalizedKey] = {
			...normalized[normalizedKey],
			enabled: typeof entry.enabled === "boolean" ? entry.enabled : normalized[normalizedKey]?.enabled,
			hooks: normalizedHooks ?? normalized[normalizedKey]?.hooks,
			subagent: normalizedSubagent ?? normalized[normalizedKey]?.subagent,
			llm: normalizedLlm ?? normalized[normalizedKey]?.llm,
			config: "config" in entry ? entry.config : normalized[normalizedKey]?.config
		};
	}
	return normalized;
}
/** Normalizes plugin config while allowing callers to resolve aliases first. */
function normalizePluginsConfigWithResolverCore(config, normalizePluginId = identityNormalizePluginId) {
	const memorySlot = resolveSlotSelection("memory", config?.slots?.memory);
	return {
		enabled: config?.enabled !== false,
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
export { resolvePluginActivationDecisionShared as a, resolveMemorySlotDecisionShared as i, normalizePluginsConfigWithResolverCore as n, toPluginActivationState as o, resolveChannelConfigEnablement as r, normalizePluginConfigList as t };
