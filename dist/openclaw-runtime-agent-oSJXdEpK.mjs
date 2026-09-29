import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as resolveProviderEndpoint } from "./provider-attribution-DUtJJsHV.mjs";
import "./workspace-access-BNUXOhfF.mjs";
import "./current-time-ojiw0e0p.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-DmXQuPyL.mjs";
import "./common-XfKigJno.mjs";
import "./memory-search-Dqa3SQYk.mjs";
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
/**
* Detect providers whose shared model runtime `isContextOverflow` Case 2 (silent overflow)
* fires on a successful turn and triggers OpenClaw runtime's `_runAutoCompaction` from
* inside `Session.prompt()`, collapsing `agent.state.messages` before the
* provider call (openclaw#75799).
*
* True on any of: `zai-native` endpoint class, normalized provider id `zai`,
* a `z-ai/` / `openrouter/z-ai/` model-id namespace prefix, or a bare `glm-`
* model id (no namespace prefix) — the latter covers in-house gateways that
* expose Zhipu's GLM family directly without a `z-ai/` qualifier. Intentionally
* narrow: namespaced GLM ids that route through other providers (e.g.
* `ollama/glm-*`, `opencode-go/glm-*`) are NOT included because their hosts
* have their own overflow accounting and may not exhibit the z.ai silent-
* overflow shape. Other providers documented as silently truncating are not
* added without a reproducible repro.
*/
function isSilentOverflowProneModel(model) {
	if (normalizeProviderId(typeof model.provider === "string" ? model.provider : "") === "zai") return true;
	if (typeof model.baseUrl === "string" && model.baseUrl.length > 0) {
		if (resolveProviderEndpoint(model.baseUrl).endpointClass === "zai-native") return true;
	}
	if (typeof model.modelId === "string" && model.modelId.length > 0) {
		const normalized = model.modelId.toLowerCase();
		if (normalized.startsWith("z-ai/") || normalized.startsWith("openrouter/z-ai/") || normalized.startsWith("glm-")) return true;
	}
	return false;
}
/**
* Disable OpenClaw runtime's `_checkCompaction → _runAutoCompaction` (which would otherwise
* fire from inside `Session.prompt()` and reassign `agent.state.messages`
* before the provider call) when OpenClaw or a plugin owns compaction:
* `contextEngineInfo.ownsCompaction === true`, effective safeguard compaction,
* or an active model that is silent-overflow-prone (openclaw#75799).
* Default-mode runs against ordinary providers keep OpenClaw runtime's auto-compaction as
* the existing baseline.
*/
function shouldDisableAgentAutoCompaction(params) {
	return params.contextEngineInfo?.ownsCompaction === true || params.compactionMode === "safeguard" || params.silentOverflowProneProvider === true;
}
/**
* Apply the auto-compaction guard. Callers that reload a `DefaultResourceLoader`
* MUST call this AGAIN after each `reload()` — `settingsManager.reload()`
* rehydrates `compaction.enabled` from disk and silently restores OpenClaw runtime's
* default-on behavior, undoing the guard. Mirrors the existing
* `applyAgentCompactionSettingsFromConfig` re-call pattern at the same sites.
*/
function applyAgentAutoCompactionGuard(params) {
	const disable = shouldDisableAgentAutoCompaction({
		contextEngineInfo: params.contextEngineInfo,
		compactionMode: params.compactionMode,
		silentOverflowProneProvider: params.silentOverflowProneProvider
	});
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
