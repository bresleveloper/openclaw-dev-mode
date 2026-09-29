import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { d as resolveSessionParentForkDecision, o as forkSessionFromParentTranscript, u as forkSessionEntryFromParentTarget } from "./session-accessor.reset-0gTJAhVB.mjs";
import { n as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE, o as assertModelSelectionUnlocked } from "./model-overrides-FXSJttoI.mjs";
//#region src/auto-reply/reply/session-fork.ts
function resolveParentForkStorePath(params) {
	return params.storePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId: params.agentId });
}
async function resolveParentForkDecision(params) {
	assertModelSelectionUnlocked(params.parentEntry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	return await resolveSessionParentForkDecision({
		parentEntry: params.parentEntry,
		storePath: resolveParentForkStorePath(params)
	});
}
async function forkSessionFromParent(params) {
	assertModelSelectionUnlocked(params.parentEntry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	const storePath = resolveParentForkStorePath(params);
	const fork = await forkSessionFromParentTranscript({
		agentId: params.agentId,
		...params.commitGuard ? { commitGuard: params.commitGuard } : {},
		parentEntry: params.parentEntry,
		parentSessionKey: params.parentSessionKey,
		sessionKey: params.sessionKey,
		storePath,
		...params.forkFrom ? { forkFrom: params.forkFrom } : {},
		...params.targetStorePath ? { targetStorePath: params.targetStorePath } : {}
	});
	return fork.status === "created" ? fork.transcript : null;
}
async function forkSessionFromParentWithDecision(params) {
	assertModelSelectionUnlocked(params.parentEntry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	return await forkSessionFromParentTranscript({
		agentId: params.agentId,
		...params.commitGuard ? { commitGuard: params.commitGuard } : {},
		enforceTokenLimit: true,
		...params.maxTokens ? { maxTokens: params.maxTokens } : {},
		parentEntry: params.parentEntry,
		parentSessionKey: params.parentSessionKey,
		sessionKey: params.sessionKey,
		storePath: resolveParentForkStorePath(params),
		...params.forkFrom ? { forkFrom: params.forkFrom } : {},
		...params.targetStorePath ? { targetStorePath: params.targetStorePath } : {}
	});
}
function normalizeForkTarget(params) {
	const keys = /* @__PURE__ */ new Set();
	const remember = (value) => {
		const trimmed = value.trim();
		if (trimmed) keys.add(trimmed);
	};
	remember(params.canonicalKey);
	for (const key of params.storeKeys ?? []) remember(key);
	return {
		canonicalKey: params.canonicalKey,
		storeKeys: [...keys]
	};
}
/**
* Forks the parent transcript and persists the child session entry through one
* storage boundary operation.
*/
async function forkSessionEntryFromParent(params) {
	const storePath = resolveParentForkStorePath(params);
	return await forkSessionEntryFromParentTarget({
		agentId: params.agentId,
		commitGuard: params.commitGuard,
		decisionSkipPatch: params.decisionSkipPatch,
		fallbackEntry: params.fallbackEntry,
		parentTarget: normalizeForkTarget({
			canonicalKey: params.parentSessionKey,
			storeKeys: params.parentStoreKeys
		}),
		patch: params.patch,
		sessionTarget: normalizeForkTarget({
			canonicalKey: params.sessionKey,
			storeKeys: params.sessionStoreKeys
		}),
		skipForkWhen: params.skipForkWhen,
		skipPatch: params.skipPatch,
		storePath
	});
}
//#endregion
export { resolveParentForkDecision as i, forkSessionFromParent as n, forkSessionFromParentWithDecision as r, forkSessionEntryFromParent as t };
