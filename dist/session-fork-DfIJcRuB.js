import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
import { d as resolveStorePath } from "./paths-C2C4lJH6.js";
import { g as forkSessionFromParentTranscript, h as forkSessionEntryFromParentTarget } from "./session-accessor-CwhXEUId.js";
//#region src/auto-reply/reply/session-fork.ts
/**
* Default max parent token count beyond which thread/session parent forking is skipped.
* This prevents new thread sessions from inheriting near-full parent context.
* See #26905.
*/
const DEFAULT_PARENT_FORK_MAX_TOKENS = 1e5;
const sessionForkRuntimeLoader = createLazyImportLoader(() => import("./session-fork.runtime.js"));
function loadSessionForkRuntime() {
	return sessionForkRuntimeLoader.load();
}
function formatParentForkTooLargeMessage(params) {
	return `Parent context is too large to fork (${params.parentTokens}/${params.maxTokens} tokens); starting with isolated context instead.`;
}
function resolveParentForkStorePath(params) {
	return params.storePath ?? resolveStorePath(params.config?.session?.store, { agentId: params.agentId });
}
async function resolveParentForkDecision(params) {
	const maxTokens = DEFAULT_PARENT_FORK_MAX_TOKENS;
	const parentTokens = await resolveParentForkTokenCount({
		parentEntry: params.parentEntry,
		storePath: resolveParentForkStorePath(params)
	});
	if (typeof parentTokens === "number" && parentTokens > maxTokens) return {
		status: "skip",
		reason: "parent-too-large",
		maxTokens,
		parentTokens,
		message: formatParentForkTooLargeMessage({
			parentTokens,
			maxTokens
		})
	};
	return {
		status: "fork",
		maxTokens,
		...typeof parentTokens === "number" ? { parentTokens } : {}
	};
}
async function forkSessionFromParent(params) {
	const storePath = resolveParentForkStorePath(params);
	const fork = await forkSessionFromParentTranscript({
		agentId: params.agentId,
		parentEntry: params.parentEntry,
		parentSessionKey: params.parentSessionKey,
		sessionKey: params.sessionKey,
		storePath,
		...params.targetStorePath ? { targetStorePath: params.targetStorePath } : {}
	});
	return fork.status === "created" ? fork.transcript : null;
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
		decisionSkipPatch: params.decisionSkipPatch,
		fallbackEntry: params.fallbackEntry,
		parentTarget: normalizeForkTarget({
			canonicalKey: params.parentSessionKey,
			storeKeys: params.parentStoreKeys
		}),
		patch: params.patch,
		resolveDecision: (parentEntry) => resolveParentForkDecision({
			parentEntry,
			agentId: params.agentId,
			config: params.config,
			storePath
		}),
		sessionTarget: normalizeForkTarget({
			canonicalKey: params.sessionKey,
			storeKeys: params.sessionStoreKeys
		}),
		skipForkWhen: params.skipForkWhen,
		skipPatch: params.skipPatch,
		storePath
	});
}
async function resolveParentForkTokenCount(params) {
	return (await loadSessionForkRuntime()).resolveParentForkTokenCountRuntime(params);
}
//#endregion
export { forkSessionFromParent as n, resolveParentForkDecision as r, forkSessionEntryFromParent as t };
