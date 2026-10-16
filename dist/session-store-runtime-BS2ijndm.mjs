import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import "./delivery-context.shared-PF5njaoI.mjs";
import "./main-session-00MgEWj5.mjs";
import "./agent-harness-session-key-D8EQIzja.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { s as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-CGOlSbiV.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import "./group-DiW6xNkZ.mjs";
import { R as buildConversationIdentity } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import "./session-lifecycle-admission-GoxISURZ.mjs";
import { l as readSessionUpdatedAtCore, o as loadSessionEntryReadOnly, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { C as readTranscriptStatsSync$1, l as loadTranscriptEventsSync$1 } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-Di4jQk7u.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as updateSessionEntry, v as cleanupSessionLifecycleArtifactsCore } from "./session-accessor.reset-DWr6djSD.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BH4CIDLX.mjs";
import { _ as SESSION_ENTRY_PRIVATE_CLEAR_PATCH, b as projectPublicSessionEntryPatch, y as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { t as readAmbientTranscriptWatermarkFromEntry } from "./ambient-transcript-watermark-Cdi7WZ4A.mjs";
import { c as resolveCurrentConversationSession } from "./conversation-registry-CcMjrJ1T.mjs";
import { t as MAIN_SESSION_RECOVERY_CLEAR_PATCH } from "./main-session-recovery-clear-BczELu-B.mjs";
import "./transcript-CEhnMlD1.mjs";
import "./session-key-DRL62oER.mjs";
import "./reset-BvpOh-VC.mjs";
import "./send-policy-dVeTk31X.mjs";
import path from "node:path";
//#region src/plugin-sdk/session-store-runtime-internal.ts
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
function projectPluginSessionEntryPatch(patch) {
	return projectPublicSessionEntryPatch(patch);
}
function generationValidPrivateFieldsForSameSession(existingEntry, nextSessionId, nextLifecycleRevision) {
	if (!existingEntry || existingEntry.sessionId !== nextSessionId || existingEntry.lifecycleRevision !== nextLifecycleRevision) return;
	const state = {
		...existingEntry.cliHistoryBoundary ? { cliHistoryBoundary: existingEntry.cliHistoryBoundary } : {},
		...existingEntry.activeWriterRunId !== void 0 ? { activeWriterRunId: existingEntry.activeWriterRunId } : {},
		...existingEntry.lifecycleRunId !== void 0 ? { lifecycleRunId: existingEntry.lifecycleRunId } : {},
		...existingEntry.pendingProjectGitUrl !== void 0 ? { pendingProjectGitUrl: existingEntry.pendingProjectGitUrl } : {},
		...existingEntry.transcriptByteCompactionLatch ? { transcriptByteCompactionLatch: existingEntry.transcriptByteCompactionLatch } : {},
		...existingEntry.sessionDiffBaselineCapture ? { sessionDiffBaselineCapture: existingEntry.sessionDiffBaselineCapture } : {},
		...existingEntry.mainRestartRecovery ? {
			abortedLastRun: existingEntry.abortedLastRun,
			restartRecoveryRuns: existingEntry.restartRecoveryRuns,
			mainRestartRecovery: existingEntry.mainRestartRecovery
		} : {}
	};
	return Object.keys(state).length > 0 ? state : void 0;
}
function clearGenerationPrivateFieldsForRotatedSessionPatch(existingEntry, publicPatch) {
	return Object.hasOwn(publicPatch, "sessionId") && publicPatch.sessionId !== existingEntry.sessionId || Object.hasOwn(publicPatch, "lifecycleRevision") && publicPatch.lifecycleRevision !== existingEntry.lifecycleRevision ? {
		...publicPatch,
		...SESSION_ENTRY_PRIVATE_CLEAR_PATCH,
		...MAIN_SESSION_RECOVERY_CLEAR_PATCH
	} : publicPatch;
}
//#endregion
//#region src/plugin-sdk/session-store-runtime.ts
const SQLITE_SESSION_STORE_BACKUP_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
function preserveGenerationPrivateFields(persistedEntry, publicPatch) {
	const privateFields = generationValidPrivateFieldsForSameSession(persistedEntry, Object.hasOwn(publicPatch, "sessionId") ? publicPatch.sessionId : persistedEntry.sessionId, Object.hasOwn(publicPatch, "lifecycleRevision") ? publicPatch.lifecycleRevision : persistedEntry.lifecycleRevision);
	return privateFields ? {
		...publicPatch,
		...!Object.hasOwn(publicPatch, "lifecycleRevision") && persistedEntry.lifecycleRevision !== void 0 ? { lifecycleRevision: persistedEntry.lifecycleRevision } : {},
		...privateFields
	} : clearGenerationPrivateFieldsForRotatedSessionPatch(persistedEntry, publicPatch);
}
/** Resolves the configured session store path without selecting a row-operation agent. */
function resolveStorePath(store, options) {
	return resolveSessionStorePathCore(store, options);
}
/** Loads one session entry by agent/session identity. */
function getSessionEntry(params) {
	const entry = loadSessionEntryReadOnly(toSessionAccessScope(params));
	return entry ? projectPluginSessionEntry(entry) : void 0;
}
/** Reads the current session binding of one canonical transport address. */
function getConversationSession(params) {
	const identity = buildConversationIdentity({
		...params,
		deliveryTarget: params.peerId
	});
	return identity ? resolveCurrentConversationSession(params, identity.conversationRef) : void 0;
}
/**
* Lists session entries for one agent. `readOnly` reads without joining the
* agent database writable lifecycle (no create/register/migrate) — required
* for detection/introspection paths that may run across the whole fleet.
*/
function listSessionEntries(params = {}) {
	return (params.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore)({
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	}).map(({ sessionKey, entry }) => ({
		sessionKey,
		entry: projectPluginSessionEntry(entry)
	}));
}
/** Reads transcript events for a live SQLite-backed session identity. */
const loadTranscriptEventsSync = loadTranscriptEventsSync$1;
/** Reads transcript freshness and byte size without materializing event rows. */
const readTranscriptStatsSync = readTranscriptStatsSync$1;
/** Patches one session entry by agent/session identity. */
async function patchSessionEntry(params) {
	const entry = await patchSessionEntryCore(toSessionAccessScope(params), async (internalEntry, context) => {
		const persistedEntry = internalEntry;
		const patch = await params.update(projectPluginSessionEntry(internalEntry), { existingEntry: context.existingEntry ? projectPluginSessionEntry(context.existingEntry) : void 0 });
		if (!patch) return null;
		return preserveGenerationPrivateFields(persistedEntry, projectPluginSessionEntryPatch(patch));
	}, {
		assertCommitAllowed: params.assertCommitAllowed,
		fallbackEntry: params.fallbackEntry ? projectPluginSessionEntry(params.fallbackEntry) : void 0,
		maintenanceConfig: params.maintenanceConfig !== void 0 ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : void 0,
		preserveActivity: params.preserveActivity,
		requireWriteSuccess: params.requireWriteSuccess,
		replaceEntry: params.replaceEntry,
		skipMaintenance: params.skipMaintenance
	});
	return entry ? projectPluginSessionEntry(entry) : null;
}
/** Reads the last activity timestamp for one session entry. */
function readSessionUpdatedAt(params) {
	return readSessionUpdatedAtCore(toSessionAccessScope(params));
}
function readAmbientTranscriptWatermark(params) {
	return readAmbientTranscriptWatermarkFromEntry(getSessionEntry(params), params.key);
}
/** Updates an existing session entry by store path and session key. */
async function updateSessionStoreEntry(params) {
	const entry = await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, async (internalEntry) => {
		const patch = await params.update(projectPluginSessionEntry(internalEntry));
		if (!patch) return null;
		return preserveGenerationPrivateFields(internalEntry, projectPluginSessionEntryPatch(patch));
	}, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
	return entry ? projectPluginSessionEntry(entry) : null;
}
/** Replaces or creates one session entry by agent/session identity. */
async function upsertSessionEntry(params) {
	const publicEntry = projectPluginSessionEntry(params.entry);
	await patchSessionEntryCore(toSessionAccessScope(params), (internalEntry) => {
		return preserveGenerationPrivateFields(internalEntry, publicEntry);
	}, {
		fallbackEntry: publicEntry,
		replaceEntry: true
	});
}
/** Deletes one session entry by agent/session identity. */
async function deleteSessionEntry(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = params.storePath ?? resolveSessionStorePathCore(void 0, {
		agentId,
		env: params.env
	});
	return (await deleteSessionEntryLifecycle({
		...agentId !== void 0 ? { agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		archiveTranscript: params.archiveTranscript ?? false,
		...params.expectedSessionId !== void 0 ? { expectedSessionId: params.expectedSessionId } : {},
		...params.expectedUpdatedAt !== void 0 ? { expectedUpdatedAt: params.expectedUpdatedAt } : {},
		storePath,
		target: {
			canonicalKey: params.sessionKey,
			storeKeys: [params.sessionKey]
		}
	})).deleted;
}
/** Resolves the file artifacts that should be backed up before mutating a session store. */
function resolveSessionStoreBackupPaths(params) {
	const backupPaths = /* @__PURE__ */ new Set();
	backupPaths.add(path.resolve(params.storePath));
	const sqlitePath = resolveSqliteTargetFromSessionStorePath(params.storePath, { agentId: params.agentId }).path;
	if (sqlitePath) for (const suffix of SQLITE_SESSION_STORE_BACKUP_SUFFIXES) backupPaths.add(`${sqlitePath}${suffix}`);
	return [...backupPaths];
}
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
async function cleanupSessionLifecycleArtifacts(params) {
	const storePath = params.storePath ?? resolveSessionStorePathCore(params.sessionStore, {
		agentId: params.agentId,
		env: params.env
	});
	return await cleanupSessionLifecycleArtifactsCore({
		storePath,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts,
		...params.pluginOwnerId !== void 0 ? { pluginOwnerId: params.pluginOwnerId } : {},
		sessionKeySegmentPrefix: params.sessionKeySegmentPrefix,
		transcriptContentMarker: params.transcriptContentMarker,
		orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
		nowMs: params.nowMs
	});
}
//#endregion
export { listSessionEntries as a, readAmbientTranscriptWatermark as c, resolveSessionStoreBackupPaths as d, resolveStorePath as f, getSessionEntry as i, readSessionUpdatedAt as l, upsertSessionEntry as m, deleteSessionEntry as n, loadTranscriptEventsSync as o, updateSessionStoreEntry as p, getConversationSession as r, patchSessionEntry as s, cleanupSessionLifecycleArtifacts as t, readTranscriptStatsSync as u };
