import { a as captureExternalSessionCommitGuard, f as sessionEntryCommitGuardOptions } from "./session-source-authority-fdILH-PW.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore, i as resolveExplicitSessionStorePathForScope } from "./paths-YgcBNLgG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./group-qLatmSbQ.mjs";
import { ct as projectPublicSessionEntryPatch, et as preserveGenerationPrivateFields, ft as readAmbientTranscriptWatermarkFromEntry } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import "./delivery-context.shared-I8-iaaj1.mjs";
import "./main-session-CHYPkxYr.mjs";
import { t as buildConversationIdentity } from "./conversation-identity-BApT92qN.mjs";
import { a as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-BqMt1Twc.mjs";
import { a as readSessionEntrySummariesInWorker, o as readSessionUpdatedAtInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { f as readTranscriptStatsAsync$1 } from "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import "./incognito-session-error-Dsi9IsoJ.mjs";
import "./session-lifecycle-admission-BihxXo5j.mjs";
import { T as readTranscriptStatsSync, u as loadTranscriptEventsSync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { a as loadSessionEntryReadOnly, c as readSessionUpdatedAtCore, f as resolveSessionKeyBySessionId, m as updateSessionLastRouteInScope, o as patchSessionEntryCore, p as updateSessionLastRoute, t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./agent-harness-session-key-zbrcLVpT.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-BLpjjUTc.mjs";
import { l as updateSessionEntry, y as cleanupSessionLifecycleArtifactsCore } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import { t as loadSessionTranscriptEvents } from "./session-transcript-events-BFcYGLfY.mjs";
import "./reset-DlE-iD9Z.mjs";
import "./session-key-Sn5H-nwW.mjs";
import "./transcript-BSOdHT4f.mjs";
import { t as assertSessionEntryPatchAuthority } from "./session-entry-patch-authority-CS4-jhpZ.mjs";
import "./send-policy-D88FrugM.mjs";
import { o as resolveCurrentConversationSession, s as resolveCurrentConversationSessionAsync } from "./conversation-registry-DdNx9ZQ8.mjs";
import { i as toSessionAccessScope, r as projectPluginSessionEntry, t as getSessionEntryAsync } from "./session-store-runtime-internal-Cv2I3LCC.mjs";
import "./ambient-transcript-watermark-DK0xDO4J.mjs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
//#region src/plugin-sdk/session-store-runtime.ts
const SQLITE_SESSION_STORE_BACKUP_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
/** @deprecated Use getSessionEntryAsync. Final compatibility day: 2026-12-31. */
function getSessionEntry(params) {
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "getSessionEntry",
		replacement: "getSessionEntryAsync"
	});
	const entry = loadSessionEntryReadOnly(toSessionAccessScope(params));
	return entry ? projectPluginSessionEntry(entry) : void 0;
}
/** @deprecated Use getConversationSessionAsync. Final compatibility day: 2026-12-31. */
function getConversationSession(params) {
	warnPluginSdkDeprecation({
		family: "session-conversation",
		method: "getConversationSession",
		replacement: "getConversationSessionAsync"
	});
	const identity = buildConversationIdentity({
		...params,
		deliveryTarget: params.peerId
	});
	return identity ? resolveCurrentConversationSession(params, identity.conversationRef) : void 0;
}
/** Reads the current binding of one canonical transport address off the Gateway thread. */
async function getConversationSessionAsync(params) {
	const identity = buildConversationIdentity({
		...params,
		deliveryTarget: params.peerId
	});
	return identity ? resolveCurrentConversationSessionAsync(params, identity.conversationRef) : void 0;
}
/**
* Lists session entries for one agent. `readOnly` reads without joining the
* agent database writable lifecycle (no create/register/migrate) — required
* for detection/introspection paths that may run across the whole fleet.
* @deprecated Use listSessionEntriesAsync for metadata reads. Final compatibility day: 2026-12-31.
*/
function listSessionEntries(params = {}) {
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "listSessionEntries",
		replacement: "listSessionEntriesAsync"
	});
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
/** Lists public session metadata without hydrating saved prompts or opening a writable database. */
async function listSessionEntriesAsync(params) {
	return (await readSessionEntrySummariesInWorker({
		...params,
		storePath: params.storePath ?? resolveSessionStorePathCore(void 0, params)
	})).map(({ sessionKey, entry }) => ({
		sessionKey,
		entry: projectPluginSessionEntry(entry)
	}));
}
/** @deprecated Use loadTranscriptEvents. Final compatibility day: 2026-12-31. */
function loadTranscriptEventsSyncLegacy(params) {
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "loadTranscriptEventsSync",
		replacement: "loadTranscriptEvents"
	});
	return loadTranscriptEventsSync(params);
}
/** Reads ordered transcript events through the session owner's worker. */
function loadTranscriptEvents(params) {
	return loadSessionTranscriptEvents(params);
}
/** @deprecated Use readTranscriptStatsAsync. Final compatibility day: 2026-12-31. */
function readSessionStoreTranscriptStatsSync(params) {
	if (isMainThread) warnPluginSdkDeprecation({
		family: "session-store",
		method: "readTranscriptStatsSync",
		replacement: "readTranscriptStatsAsync"
	});
	return readTranscriptStatsSync(params);
}
/** Reads transcript statistics through the existing session worker. */
const readTranscriptStatsAsync = readTranscriptStatsAsync$1;
/** @deprecated Await resolveTranscriptSessionKeyBySessionIdAsync. Final compatibility day: 2026-12-31. */
function resolveTranscriptSessionKeyBySessionId(params) {
	if (isMainThread) warnPluginSdkDeprecation({
		family: "session-transcript-key",
		method: "resolveTranscriptSessionKeyBySessionId",
		replacement: "resolveTranscriptSessionKeyBySessionIdAsync"
	});
	return resolveSessionKeyBySessionId(params);
}
/** @deprecated Use prepareSessionEntryPatch or applySessionEntryPatch. Final compatibility day: 2026-12-31. */
async function patchSessionEntry(params) {
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "patchSessionEntry",
		replacement: "prepareSessionEntryPatch or applySessionEntryPatch"
	});
	const entry = await patchSessionEntryCore(toSessionAccessScope(params), async (internalEntry, context) => {
		const persistedEntry = internalEntry;
		const patch = await params.update(projectPluginSessionEntry(internalEntry), { existingEntry: context.existingEntry ? projectPluginSessionEntry(context.existingEntry) : void 0 });
		if (!patch) return null;
		return preserveGenerationPrivateFields(persistedEntry, projectPublicSessionEntryPatch(patch));
	}, {
		...sessionEntryCommitGuardOptions(captureExternalSessionCommitGuard(params.assertCommitAllowed)),
		fallbackEntry: params.fallbackEntry ? projectPluginSessionEntry(params.fallbackEntry) : void 0,
		maintenanceConfig: params.maintenanceConfig !== void 0 ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : void 0,
		preserveActivity: params.preserveActivity,
		requireWriteSuccess: params.requireWriteSuccess,
		replaceEntry: params.replaceEntry,
		skipMaintenance: params.skipMaintenance
	});
	return entry ? projectPluginSessionEntry(entry) : null;
}
/** Prepare outside SQLite, then compare the exact snapshot and commit once in its worker. */
async function prepareSessionEntryPatch(params) {
	const entry = await patchSessionEntryCore(toSessionAccessScope(params), async (existing, context) => {
		if (params.authority?.kind === "host") params.authority.assertCurrent();
		const patch = await params.prepare(projectPluginSessionEntry(existing), { existingEntry: context.existingEntry ? projectPluginSessionEntry(context.existingEntry) : void 0 });
		if (params.authority?.kind === "host") params.authority.assertCurrent();
		return patch ? preserveGenerationPrivateFields(existing, projectPublicSessionEntryPatch(patch)) : null;
	}, sessionEntryPatchOptions(params));
	return entry ? projectPluginSessionEntry(entry) : null;
}
/** Reduce a data-only patch against the authoritative entry in one worker command. */
async function applySessionEntryPatch(params) {
	const entry = await applySessionEntryOperation(toSessionAccessScope(params), {
		kind: "public-fields",
		patch: projectPublicSessionEntryPatch(params.patch),
		expected: params.expected
	}, sessionEntryPatchOptions(params));
	return entry ? projectPluginSessionEntry(entry) : null;
}
function sessionEntryPatchOptions(params) {
	const authority = params.authority;
	assertSessionEntryPatchAuthority(authority);
	return {
		workerGuard: {
			assertCurrent: authority?.kind === "host" ? () => authority.assertCurrent() : void 0,
			source: authority?.kind === "source" ? authority.source : void 0
		},
		fallbackEntry: params.fallbackEntry ? projectPluginSessionEntry(params.fallbackEntry) : void 0,
		maintenanceConfig: params.maintenanceConfig !== void 0 ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : void 0,
		preserveActivity: params.preserveActivity,
		requireWriteSuccess: params.requireWriteSuccess,
		replaceEntry: params.replaceEntry,
		skipMaintenance: params.skipMaintenance
	};
}
/** @deprecated Use readSessionUpdatedAtAsync. Final compatibility day: 2026-12-31. */
function readSessionUpdatedAt(params) {
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "readSessionUpdatedAt",
		replacement: "readSessionUpdatedAtAsync"
	});
	return readSessionUpdatedAtCore(toSessionAccessScope(params));
}
/** Reads the last activity timestamp without creating a missing session store. */
function readSessionUpdatedAtAsync(params) {
	return readSessionUpdatedAtInWorker(toSessionAccessScope(params));
}
/** @deprecated Use readAmbientTranscriptWatermarkAsync. Final compatibility day: 2026-12-31. */
function readAmbientTranscriptWatermark(params) {
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "readAmbientTranscriptWatermark",
		replacement: "readAmbientTranscriptWatermarkAsync"
	});
	return readAmbientTranscriptWatermarkFromEntry(getSessionEntry(params), params.key);
}
/** Reads the transcript watermark through the session owner's worker. */
async function readAmbientTranscriptWatermarkAsync(params) {
	return readAmbientTranscriptWatermarkFromEntry(await getSessionEntryAsync(params), params.key);
}
/** @deprecated Use prepareSessionEntryPatch. Final compatibility day: 2026-12-31. */
async function updateSessionStoreEntry(params) {
	warnPluginSdkDeprecation({
		family: "session-store",
		method: "updateSessionStoreEntry",
		replacement: "prepareSessionEntryPatch"
	});
	const entry = await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, async (internalEntry) => {
		const patch = await params.update(projectPluginSessionEntry(internalEntry));
		if (!patch) return null;
		return preserveGenerationPrivateFields(internalEntry, projectPublicSessionEntryPatch(patch));
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
	await applySessionEntryOperation(toSessionAccessScope(params), {
		kind: "public-fields",
		patch: publicEntry
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
/**
* Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store.
* Joins pending startup preparation before capturing the database identity; failed preparation
* still surfaces through normal admission checks. Prepared agents do not wait.
*/
async function cleanupSessionLifecycleArtifacts(params) {
	const storePath = params.storePath ?? resolveSessionStorePathCore(params.sessionStore, {
		agentId: params.agentId,
		env: params.env
	});
	const selection = {
		agentId: params.agentId,
		env: params.env,
		storePath,
		sessionKey: params.agentId ? `agent:${params.agentId}:${params.sessionKeySegmentPrefix.trim()}` : void 0
	};
	return await cleanupSessionLifecycleArtifactsCore({
		storePath: resolveExplicitSessionStorePathForScope(selection) ?? storePath,
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
function updateLastRoute(params) {
	if (params.assertCommitAllowed) warnPluginSdkDeprecation({
		family: "session-store",
		method: "updateLastRoute.assertCommitAllowed",
		replacement: "updateLastRouteWithAuthority"
	});
	return updateSessionLastRoute(params);
}
/** Route preparation runs before the worker's conditional commit. */
function updateLastRouteWithAuthority(params) {
	return updateSessionLastRouteInScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, {
		...params,
		workerGuard: sessionEntryPatchOptions(params).workerGuard
	});
}
//#endregion
export { updateSessionStoreEntry as C, updateLastRouteWithAuthority as S, readSessionUpdatedAtAsync as _, getConversationSessionAsync as a, resolveTranscriptSessionKeyBySessionId as b, listSessionEntriesAsync as c, patchSessionEntry as d, prepareSessionEntryPatch as f, readSessionUpdatedAt as g, readSessionStoreTranscriptStatsSync as h, getConversationSession as i, loadTranscriptEvents as l, readAmbientTranscriptWatermarkAsync as m, cleanupSessionLifecycleArtifacts as n, getSessionEntry as o, readAmbientTranscriptWatermark as p, deleteSessionEntry as r, listSessionEntries as s, applySessionEntryPatch as t, loadTranscriptEventsSyncLegacy as u, readTranscriptStatsAsync as v, upsertSessionEntry as w, updateLastRoute as x, resolveSessionStoreBackupPaths as y };
