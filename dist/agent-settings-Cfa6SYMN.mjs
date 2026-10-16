import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as resolveProviderEndpoint } from "./provider-attribution-DCsKu1Yv.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-DmXQuPyL.mjs";
//#region src/agents/agent-settings.ts
/** Applies agent compaction settings and small-context overflow guards. */
const DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR = 2e4;
function toPositiveInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
/** Applies configured compaction reserve/keep-recent settings to an agent settings manager. */
function applyAgentCompactionSettingsFromConfig(params) {
	const currentReserveTokens = params.settingsManager.getCompactionReserveTokens();
	const currentKeepRecentTokens = params.settingsManager.getCompactionKeepRecentTokens();
	const compactionCfg = params.cfg?.agents?.defaults?.compaction;
	const configuredEnabled = compactionCfg?.enabled;
	const configuredKeepRecentTokens = toPositiveInt(compactionCfg?.keepRecentTokens);
	const contextTokenBudget = toPositiveInt(params.contextTokenBudget);
	const requestedReserveTokens = Math.max(currentReserveTokens, DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR);
	const targetReserveTokens = contextTokenBudget === void 0 ? requestedReserveTokens : resolveEffectiveCompactionReserveTokens({
		contextTokenBudget,
		reserveTokens: requestedReserveTokens
	});
	const targetKeepRecentTokens = configuredKeepRecentTokens ?? currentKeepRecentTokens;
	const overrides = {};
	if (targetReserveTokens !== currentReserveTokens) overrides.reserveTokens = targetReserveTokens;
	if (targetKeepRecentTokens !== currentKeepRecentTokens) overrides.keepRecentTokens = targetKeepRecentTokens;
	const shouldApplyEnabled = configuredEnabled !== void 0 && typeof params.settingsManager.setCompactionEnabled === "function" && (typeof params.settingsManager.getCompactionEnabled !== "function" || params.settingsManager.getCompactionEnabled() !== configuredEnabled);
	if (shouldApplyEnabled) params.settingsManager.setCompactionEnabled(configuredEnabled);
	if (Object.keys(overrides).length > 0) params.settingsManager.applyOverrides({ compaction: overrides });
	return {
		didOverride: shouldApplyEnabled || Object.keys(overrides).length > 0,
		compaction: {
			reserveTokens: targetReserveTokens,
			keepRecentTokens: targetKeepRecentTokens
		}
	};
}
/** Resolve the compaction mode after provider-backed safeguard promotion. */
function resolveEffectiveCompactionMode(cfg) {
	const compaction = cfg?.agents?.defaults?.compaction;
	if (compaction?.provider) return "safeguard";
	return compaction?.mode === "safeguard" ? "safeguard" : "default";
}
function isSilentOverflowProneModel(model) {
	if (normalizeProviderId(typeof model.provider === "string" ? model.provider : "") === "zai") return true;
	if (typeof model.baseUrl === "string" && model.baseUrl.length > 0 && resolveProviderEndpoint(model.baseUrl).endpointClass === "zai-native") return true;
	const normalized = typeof model.modelId === "string" ? model.modelId.toLowerCase() : "";
	return normalized.startsWith("z-ai/") || normalized.startsWith("openrouter/z-ai/") || normalized.startsWith("glm-");
}
function applyAgentAutoCompactionGuard(params) {
	const disable = params.contextEngineInfo?.ownsCompaction === true || params.compactionMode === "safeguard" || params.silentOverflowProneProvider === true;
	const hasMethod = typeof params.settingsManager.setCompactionEnabled === "function";
	if (!disable || !hasMethod) return {
		supported: hasMethod,
		disabled: false
	};
	params.settingsManager.setCompactionEnabled(false);
	return {
		supported: true,
		disabled: true
	};
}
//#endregion
export { resolveEffectiveCompactionMode as a, isSilentOverflowProneModel as i, applyAgentAutoCompactionGuard as n, applyAgentCompactionSettingsFromConfig as r, DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR as t };
