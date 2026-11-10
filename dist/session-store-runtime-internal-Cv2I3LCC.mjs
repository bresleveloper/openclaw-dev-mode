import { st as projectPublicSessionEntry } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as readSessionEntryReadOnlyInWorker, r as readSessionEntryByIdReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
//#region src/plugin-sdk/session-store-runtime-internal.ts
/** Loads the complete public entry through the selected asynchronous read owner. */
async function getSessionEntryAsync(params) {
	const entry = await readSessionEntryReadOnlyInWorker(toSessionAccessScope(params));
	return entry ? projectPluginSessionEntry(entry) : void 0;
}
/** Looks up a visible current session ID in one selected store. */
async function getSessionEntryByIdAsync(params) {
	const selected = await readSessionEntryByIdReadOnlyInWorker({
		...toSessionAccessScope({
			...params,
			sessionKey: ""
		}),
		sessionId: params.sessionId,
		orderBy: params.orderBy
	});
	return selected ? {
		sessionKey: selected.sessionKey,
		entry: projectPluginSessionEntry(selected.entry)
	} : void 0;
}
function toSessionAccessScope(params) {
	return {
		sessionKey: params.sessionKey,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.readConsistency !== void 0 ? { readConsistency: params.readConsistency } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	};
}
function projectPluginSessionEntry(entry) {
	return {
		...projectPublicSessionEntry(entry),
		...entry.restartRecoveryRuns ? { restartRecoveryRuns: entry.restartRecoveryRuns.map((run) => ({ ...run })) } : {}
	};
}
//#endregion
export { toSessionAccessScope as i, getSessionEntryByIdAsync as n, projectPluginSessionEntry as r, getSessionEntryAsync as t };
