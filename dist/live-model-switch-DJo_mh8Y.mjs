import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { o as normalizeStoredOverrideModel, r as resolvePersistedSelectedModelRef } from "./model-selection-DdQ-ffuG.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
//#region src/agents/live-model-switch.ts
/**
* Resolves and persists live-session model switch requests.
*/
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
	return normalizeProviderId(current.provider) === "openai" && normalizeProviderId(next.provider) === "openai" && current.model === next.model;
}
/** The completion actor consumes this exact selection, never a later /model request. */
function prepareLiveModelSwitchAfterRun(params) {
	const provider = normalizeOptionalString(params.providerUsed);
	const model = normalizeOptionalString(params.modelUsed);
	const entry = params.entry;
	if (!entry.liveModelSwitchPending || !provider || !model) return;
	const persisted = resolveSelectionFromSessionEntry({
		cfg: params.cfg,
		entry,
		agentId: resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: params.cfg,
			agentId: params.agentId
		}),
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	if (!(provider === persisted.provider && model === persisted.model) && !isAlreadyAppliedOpenAICodexRuntimePromotion({
		provider,
		model
	}, persisted)) return;
	return {
		kind: "live-model",
		expected: {
			modelProvider: entry.modelProvider,
			model: entry.model,
			agentHarnessId: entry.agentHarnessId,
			providerOverride: entry.providerOverride,
			modelOverride: entry.modelOverride,
			agentRuntimeOverride: entry.agentRuntimeOverride,
			authProfileOverride: entry.authProfileOverride,
			authProfileOverrideSource: entry.authProfileOverrideSource,
			liveModelSwitchPending: entry.liveModelSwitchPending
		},
		next: {
			modelProvider: entry.modelProvider,
			model: entry.model,
			agentHarnessId: entry.agentHarnessId
		},
		clearPending: true
	};
}
function hasDifferentLiveSessionModelSelection(current, next) {
	return (current.provider !== next.provider || current.model !== next.model) && !isAlreadyAppliedOpenAICodexRuntimePromotion(current, next) || normalizeOptionalString(current.agentRuntimeOverride) !== next.agentRuntimeOverride || normalizeOptionalString(current.authProfileId) !== next.authProfileId || (normalizeOptionalString(current.authProfileId) ? current.authProfileIdSource : void 0) !== next.authProfileIdSource;
}
/**
* Return a pending user selection and eagerly clear switches already applied.
* The runner consumes an unapplied switch only when canRestartForLiveSwitch
* permits it; otherwise the flag survives tool execution and later user turns.
*/
async function shouldSwitchToLiveModel(params) {
	const sessionKey = params.sessionKey?.trim();
	const cfg = params.cfg;
	if (!cfg || !sessionKey || params.sessionPersistence === "detached") return;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: params.agentId?.trim() });
	const entry = await readSessionEntryReadOnlyInWorker({
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
			agentId: params.agentId,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel,
			expectedSelection: persisted
		}).catch(() => {});
		return;
	}
	return persisted;
}
/**
* Consume only the observed selection; a newer request may commit while this clear queues.
*/
async function clearLiveModelSwitchPending(params) {
	const sessionKey = params.sessionKey?.trim();
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return;
	const agentId = params.agentId?.trim();
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	await clearMatchingLiveModelSwitch({
		...params,
		cfg,
		sessionKey,
		storePath,
		agentId
	}, (persisted) => !hasDifferentLiveSessionModelSelection(params.expectedSelection, persisted));
}
async function clearMatchingLiveModelSwitch(params, matches) {
	await patchSessionEntryCore({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (entry) => {
		if (!entry.liveModelSwitchPending || !matches(resolveSelectionFromSessionEntry({
			...params,
			entry
		}))) return null;
		const next = { ...entry };
		delete next.liveModelSwitchPending;
		return next;
	}, {
		replaceEntry: true,
		workerGuard: {},
		prepareIf: { kind: "live-model-switch-pending" }
	});
}
//#endregion
export { prepareLiveModelSwitchAfterRun as n, shouldSwitchToLiveModel as r, clearLiveModelSwitchPending as t };
