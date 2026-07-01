import { b as loadSessionStore$1 } from "./store-DJ7wx5_V.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { P as updateSessionEntry, T as replaceSessionEntry, c as cleanupSessionLifecycleArtifacts$1, f as listSessionEntries$1, g as patchSessionEntry$1, m as loadSessionEntry, w as readSessionUpdatedAt$1 } from "./session-accessor-Dx6KDG0K.js";
import "./reset-BZdKvPn-.js";
import "./session-key-CzB54Lfy.js";
import "./transcript-BMyCREan.js";
import "./send-policy-D_O9N501.js";
//#region src/plugin-sdk/session-store-runtime.ts
function toSessionAccessScope(params) {
	return {
		sessionKey: params.sessionKey,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	};
}
/**
* @deprecated Use getSessionEntry/listSessionEntries for reads and
* patchSessionEntry/upsertSessionEntry for writes. This whole-store helper is
* kept only during the transition before SQLite migration. Callers must
* migrate away from reading sessions.json directly.
*/
const loadSessionStore = loadSessionStore$1;
/** Loads one session entry by agent/session identity. */
function getSessionEntry(params) {
	return loadSessionEntry(toSessionAccessScope(params));
}
/** Lists session entries for one agent. */
function listSessionEntries(params = {}) {
	return listSessionEntries$1({
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	});
}
/** Patches one session entry by agent/session identity. */
async function patchSessionEntry(params) {
	return await patchSessionEntry$1(toSessionAccessScope(params), params.update, {
		fallbackEntry: params.fallbackEntry,
		maintenanceConfig: params.maintenanceConfig,
		preserveActivity: params.preserveActivity,
		replaceEntry: params.replaceEntry
	});
}
/** Reads the last activity timestamp for one session entry. */
function readSessionUpdatedAt(params) {
	return readSessionUpdatedAt$1(toSessionAccessScope(params));
}
/** Updates an existing session entry by store path and session key. */
async function updateSessionStoreEntry(params) {
	return await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.update, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
}
/** Replaces or creates one session entry by agent/session identity. */
async function upsertSessionEntry(params) {
	await replaceSessionEntry(toSessionAccessScope(params), params.entry);
}
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
async function cleanupSessionLifecycleArtifacts(params) {
	return await cleanupSessionLifecycleArtifacts$1({
		storePath: params.storePath ?? resolveStorePath(params.sessionStore, {
			agentId: params.agentId,
			env: params.env
		}),
		archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts,
		sessionKeySegmentPrefix: params.sessionKeySegmentPrefix,
		transcriptContentMarker: params.transcriptContentMarker,
		orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
		nowMs: params.nowMs
	});
}
//#endregion
export { patchSessionEntry as a, upsertSessionEntry as c, loadSessionStore as i, getSessionEntry as n, readSessionUpdatedAt as o, listSessionEntries as r, updateSessionStoreEntry as s, cleanupSessionLifecycleArtifacts as t };
