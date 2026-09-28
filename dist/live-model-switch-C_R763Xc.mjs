import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { i as resolvePersistedSelectedModelRef, l as normalizeStoredOverrideModel } from "./model-selection-CFnUi6iD.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CJOaEEoJ.mjs";
import { d as patchSessionEntryCore, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
//#region src/agents/live-model-switch.ts
/**
* Resolves and persists live-session model switch requests.
*/
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = "openai";
/**
* Entry-snapshot variant of the selection resolver, so atomic patch callbacks
* can evaluate the persisted selection against the exact row they may rewrite.
*/
function resolveSelectionFromSessionEntry(params) {
	const { cfg, entry } = params;
	const agentId = normalizeOptionalString(params.agentId);
	const defaultModelRef = agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId
	}) : {
		provider: params.defaultProvider,
		model: params.defaultModel
	};
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
		authProfileIdSource: authProfileId ? resolveCollapsedSessionAuthPinSource(entry) : void 0
	};
}
function isAlreadyAppliedOpenAICodexRuntimePromotion(current, next) {
	return normalizeProviderId(current.provider) === OPENAI_CODEX_PROVIDER_ID && normalizeProviderId(next.provider) === OPENAI_PROVIDER_ID && current.model === next.model;
}
function hasDifferentLiveSessionModelSelection(current, next) {
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
	if (!cfg || !sessionKey || params.sessionPersistence === "detached") return;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: params.agentId?.trim() });
	const entry = loadSessionEntryReadOnly({
		storePath,
		sessionKey,
		hydrateSkillPromptRefs: false,
		clone: false,
		readConsistency: "latest"
	});
	if (!entry?.liveModelSwitchPending) return;
	const persisted = resolveSelectionFromSessionEntry({
		cfg,
		entry,
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
	return persisted;
}
/**
* Post-run consolidation: once a completed run has actually executed the
* persisted selection, the pending live-switch flag is spent. CLI harness runs
* never pass through the embedded attempt-recovery clear, so without this the
* flag survives forever and `/status` keeps reporting a switch that already
* happened. Unlike `shouldSwitchToLiveModel`, runtime/auth-profile drift is
* ignored here: the selected model demonstrably ran, so keeping the flag would
* only re-arm mid-run restarts that have nothing left to apply. Compare and
* clear happen inside one atomic patch so a concurrent `/model` that persists
* a newer selection is never consumed by this run's result.
*/
async function consolidateLiveModelSwitchAfterRun(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const cfg = params.cfg;
	const providerUsed = normalizeOptionalString(params.providerUsed);
	const modelUsed = normalizeOptionalString(params.modelUsed);
	if (!cfg || !sessionKey || !providerUsed || !modelUsed) return;
	const agentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		agentId: params.agentId
	});
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	if (!storePath) return;
	await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (entry) => {
		if (!entry.liveModelSwitchPending) return null;
		const persisted = resolveSelectionFromSessionEntry({
			cfg,
			entry,
			agentId,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL
		});
		if (!(providerUsed === persisted.provider && modelUsed === persisted.model || isAlreadyAppliedOpenAICodexRuntimePromotion({
			provider: providerUsed,
			model: modelUsed
		}, persisted))) return null;
		const next = { ...entry };
		delete next.liveModelSwitchPending;
		return next;
	}, { replaceEntry: true });
}
/**
* Clear the `liveModelSwitchPending` flag from the session entry on disk so
* subsequent retry iterations do not re-trigger the switch.
*/
async function clearLiveModelSwitchPending(params) {
	const sessionKey = params.sessionKey?.trim();
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: params.agentId?.trim() });
	if (!storePath) return;
	await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (entry) => {
		const next = { ...entry };
		delete next.liveModelSwitchPending;
		return next;
	}, { replaceEntry: true });
}
//#endregion
export { consolidateLiveModelSwitchAfterRun as n, shouldSwitchToLiveModel as r, clearLiveModelSwitchPending as t };
