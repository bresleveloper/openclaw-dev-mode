import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { d as resolveStorePath } from "./paths-C2C4lJH6.js";
import { C as patchSessionEntry, y as loadSessionEntry } from "./session-accessor-CwhXEUId.js";
import { c as resolveDefaultModelForAgent, d as resolvePersistedSelectedModelRef, i as normalizeStoredOverrideModel } from "./model-selection-CFL1kjzt.js";
import { n as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-Dg3upVEO.js";
//#region src/agents/live-model-switch.ts
/**
* Resolves and persists live-session model switch requests.
*/
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = "openai";
function resolveLiveSessionModelSelection(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return null;
	const agentId = normalizeOptionalString(params.agentId);
	const defaultModelRef = agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId
	}) : {
		provider: params.defaultProvider,
		model: params.defaultModel
	};
	const entry = loadSessionEntry({
		storePath: resolveStorePath(cfg.session?.store, { agentId }),
		sessionKey,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	});
	const normalizedSelection = normalizeStoredOverrideModel({
		providerOverride: entry?.providerOverride,
		modelOverride: entry?.modelOverride
	});
	const persisted = resolvePersistedSelectedModelRef({
		defaultProvider: defaultModelRef.provider,
		runtimeProvider: entry?.modelProvider,
		runtimeModel: entry?.model,
		overrideProvider: normalizedSelection.providerOverride,
		overrideModel: normalizedSelection.modelOverride
	});
	const provider = persisted?.provider ?? normalizedSelection.providerOverride ?? entry?.providerOverride?.trim() ?? defaultModelRef.provider;
	const model = persisted?.model ?? defaultModelRef.model;
	const agentRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
		provider,
		entry,
		cfg
	});
	const authProfileId = normalizeOptionalString(entry?.authProfileOverride);
	return {
		provider,
		model,
		...agentRuntimeOverride ? { agentRuntimeOverride } : {},
		authProfileId,
		authProfileIdSource: authProfileId ? entry?.authProfileOverrideSource : void 0
	};
}
function isAlreadyAppliedOpenAICodexRuntimePromotion(current, next) {
	return normalizeProviderId(current.provider) === OPENAI_CODEX_PROVIDER_ID && normalizeProviderId(next.provider) === OPENAI_PROVIDER_ID && current.model === next.model;
}
function hasDifferentLiveSessionModelSelection(current, next) {
	if (!next) return false;
	return (current.provider !== next.provider || current.model !== next.model) && !isAlreadyAppliedOpenAICodexRuntimePromotion(current, next) || normalizeOptionalString(current.agentRuntimeOverride) !== next.agentRuntimeOverride || normalizeOptionalString(current.authProfileId) !== next.authProfileId || (normalizeOptionalString(current.authProfileId) ? current.authProfileIdSource : void 0) !== next.authProfileIdSource;
}
/**
* Check whether a user-initiated live model switch is pending for the given
* session.  Returns the persisted model selection when the session's
* `liveModelSwitchPending` flag is `true` AND the persisted selection differs
* from the currently running model; otherwise returns `undefined`.
*
* When the flag is set but the current model already matches the persisted
* selection (e.g. the switch was applied as an override and the current
* attempt is already using the new model), the flag is consumed (cleared)
* eagerly to prevent it from persisting as stale state.
*
* **Deferral semantics:** The caller in `run.ts` only acts on the returned
* selection when `canRestartForLiveSwitch` is `true`.  If the run cannot
* restart (e.g. a tool call is in progress), the flag intentionally remains
* set so the switch fires on the next clean retry opportunity — even if that
* falls into a subsequent user turn.
*
* This replaces the previous approach that used an in-memory run-state map,
* which could not distinguish between
* user-initiated `/model` switches and system-initiated fallback rotations.
*/
function shouldSwitchToLiveModel(params) {
	const sessionKey = params.sessionKey?.trim();
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return;
	if (!loadSessionEntry({
		storePath: resolveStorePath(cfg.session?.store, { agentId: params.agentId?.trim() }),
		sessionKey,
		hydrateSkillPromptRefs: false,
		clone: false,
		readConsistency: "latest"
	})?.liveModelSwitchPending) return;
	const persisted = resolveLiveSessionModelSelection({
		cfg,
		sessionKey,
		agentId: params.agentId,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	});
	if (!hasDifferentLiveSessionModelSelection({
		provider: params.currentProvider,
		model: params.currentModel,
		agentRuntimeOverride: params.currentAgentRuntimeOverride,
		authProfileId: params.currentAuthProfileId,
		authProfileIdSource: params.currentAuthProfileIdSource
	}, persisted)) {
		clearLiveModelSwitchPending({
			cfg,
			sessionKey,
			agentId: params.agentId
		}).catch(() => {});
		return;
	}
	return persisted ?? void 0;
}
/**
* Clear the `liveModelSwitchPending` flag from the session entry on disk so
* subsequent retry iterations do not re-trigger the switch.
*/
async function clearLiveModelSwitchPending(params) {
	const sessionKey = params.sessionKey?.trim();
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return;
	const storePath = resolveStorePath(cfg.session?.store, { agentId: params.agentId?.trim() });
	if (!storePath) return;
	await patchSessionEntry({
		storePath,
		sessionKey
	}, (entry) => {
		const next = { ...entry };
		delete next.liveModelSwitchPending;
		return next;
	}, { replaceEntry: true });
}
//#endregion
export { shouldSwitchToLiveModel as n, clearLiveModelSwitchPending as t };
