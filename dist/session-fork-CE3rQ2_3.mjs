import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { i as assertModelSelectionUnlocked, t as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE } from "./model-overrides-CgHG3YVT.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { d as forkSessionEntryFromParentTargetWithPatch, f as forkSessionTranscriptFromParent, m as resolveSessionParentForkDecision, p as prepareSessionForkTranscript } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
//#region src/auto-reply/reply/session-fork.ts
function resolveParentForkStorePath(params) {
	return params.storePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId: params.agentId });
}
async function resolveParentForkDecision(params) {
	assertModelSelectionUnlocked(params.parentEntry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	return await resolveSessionParentForkDecision({
		parentEntry: params.parentEntry,
		parentSessionKey: params.parentSessionKey,
		storePath: resolveParentForkStorePath(params)
	});
}
function resolveParentForkParams(params) {
	assertModelSelectionUnlocked(params.parentEntry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	return {
		agentId: params.agentId,
		...params.commitGuard ? { commitGuard: params.commitGuard } : {},
		parentEntry: params.parentEntry,
		parentSessionKey: params.parentSessionKey,
		sessionKey: params.sessionKey,
		storePath: resolveParentForkStorePath(params),
		...params.forkFrom ? { forkFrom: params.forkFrom } : {},
		...params.targetStorePath ? { targetStorePath: params.targetStorePath } : {}
	};
}
async function forkSessionFromParent(params) {
	const fork = await forkSessionTranscriptFromParent(resolveParentForkParams(params));
	return fork.status === "created" ? fork.transcript : null;
}
async function prepareSessionForkFromParent(params) {
	return await prepareSessionForkTranscript({
		...resolveParentForkParams(params),
		enforceTokenLimit: true,
		...params.maxTokens ? { maxTokens: params.maxTokens } : {}
	});
}
function normalizeForkTarget(canonicalKey, storeKeys) {
	return {
		canonicalKey,
		storeKeys: [...new Set([canonicalKey, ...storeKeys ?? []].map((key) => key.trim()).filter(Boolean))]
	};
}
/**
* Forks the parent transcript and persists the child session entry through one
* storage boundary operation.
*/
async function forkSessionEntryFromParent(params) {
	const storePath = resolveParentForkStorePath(params);
	return await forkSessionEntryFromParentTargetWithPatch({
		agentId: params.agentId,
		commitGuard: params.commitGuard,
		fallbackEntry: params.fallbackEntry,
		parentTarget: normalizeForkTarget(params.parentSessionKey, params.parentStoreKeys),
		sessionTarget: normalizeForkTarget(params.sessionKey, params.sessionStoreKeys),
		storePath
	}, params.entryPatch);
}
//#endregion
export { resolveParentForkDecision as i, forkSessionFromParent as n, prepareSessionForkFromParent as r, forkSessionEntryFromParent as t };
