import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { _ as updateSessionStore } from "./store-DJ7wx5_V.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { r as mergeSessionEntry } from "./types-CoDcFuoc.js";
import path from "node:path";
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
function resolveParentForkSessionsDir(params) {
	return params.sessionsDir ?? path.dirname(resolveParentForkStorePath(params));
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
	return (await loadSessionForkRuntime()).forkSessionFromParentRuntime({
		...params,
		sessionsDir: resolveParentForkSessionsDir(params)
	});
}
function resolveEntryFromStoreKeys(params) {
	for (const key of params.keys) {
		const entry = params.store[key];
		if (entry) return entry;
	}
}
function persistForkedSessionEntry(params) {
	const next = mergeSessionEntry(params.existing, params.patch);
	params.store[params.sessionKey] = next;
	for (const key of params.sessionStoreKeys ?? []) if (key !== params.sessionKey) delete params.store[key];
	return next;
}
/**
* Forks the parent transcript and persists the child session entry through one
* storage boundary operation.
*/
async function forkSessionEntryFromParent(params) {
	const storePath = resolveParentForkStorePath(params);
	return await updateSessionStore(storePath, async (store) => {
		const parentEntry = resolveEntryFromStoreKeys({
			store,
			keys: params.parentStoreKeys ?? [params.parentSessionKey]
		});
		if (!parentEntry?.sessionId) return { status: "missing-parent" };
		const entry = resolveEntryFromStoreKeys({
			store,
			keys: params.sessionStoreKeys ?? [params.sessionKey]
		}) ?? params.fallbackEntry;
		if (!entry) return { status: "missing-entry" };
		if (params.skipForkWhen?.(entry)) {
			const patch = params.skipPatch?.(entry);
			return {
				status: "skipped",
				reason: "existing-entry",
				parentEntry,
				sessionEntry: patch ? persistForkedSessionEntry({
					store,
					sessionKey: params.sessionKey,
					sessionStoreKeys: params.sessionStoreKeys,
					existing: entry,
					patch
				}) : entry
			};
		}
		const decision = await resolveParentForkDecision({
			parentEntry,
			agentId: params.agentId,
			config: params.config,
			storePath
		});
		if (decision.status === "skip") {
			const patch = params.decisionSkipPatch?.({
				decision,
				entry,
				parentEntry
			});
			return {
				status: "skipped",
				reason: "decision-skip",
				parentEntry,
				sessionEntry: patch ? persistForkedSessionEntry({
					store,
					sessionKey: params.sessionKey,
					sessionStoreKeys: params.sessionStoreKeys,
					existing: entry,
					patch
				}) : entry,
				decision
			};
		}
		const fork = await forkSessionFromParent({
			parentEntry,
			agentId: params.agentId,
			config: params.config,
			sessionsDir: params.sessionsDir ?? path.dirname(storePath)
		});
		if (!fork) return { status: "failed" };
		return {
			status: "forked",
			fork,
			parentEntry,
			sessionEntry: persistForkedSessionEntry({
				store,
				sessionKey: params.sessionKey,
				sessionStoreKeys: params.sessionStoreKeys,
				existing: entry,
				patch: {
					...params.patch?.({
						entry,
						parentEntry,
						fork,
						decision
					}),
					sessionId: fork.sessionId,
					sessionFile: fork.sessionFile,
					forkedFromParent: true
				}
			}),
			decision
		};
	}, { skipSaveWhenResult: (result) => result.status === "missing-entry" || result.status === "missing-parent" || result.status === "failed" || result.status === "skipped" && result.sessionEntry === params.fallbackEntry });
}
async function resolveParentForkTokenCount(params) {
	return (await loadSessionForkRuntime()).resolveParentForkTokenCountRuntime(params);
}
//#endregion
export { forkSessionFromParent as n, resolveParentForkDecision as r, forkSessionEntryFromParent as t };
