import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./openclaw-runtime-paths-BEYXs6HA.mjs";
import { mt as projectSessionMetadata } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { n as listSessionTranscriptArchivesReadOnly } from "./session-accessor.sqlite-history-DHJfVW84.mjs";
import { n as listSessionTranscriptInstancesInWorker, t as listSessionTranscriptInstances } from "./session-history-BKt1cI8X.mjs";
import "./query-expansion-8IlqIzbI.mjs";
import { n as assertBoundIncognitoMemorySyncAccess } from "./session-transcript-stats-read-yuA27vDM.mjs";
import "./openclaw-runtime-session-Du3RWOJ8.mjs";
import { n as buildSessionEntry$1 } from "./session-files-Cv_U1iPC.mjs";
import { t as listSessionTranscriptCorpusEntriesForAgent$1 } from "./session-transcript-corpus-DI-xp5hv.mjs";
import { t as readSessionResetRecallCutoff$1 } from "./session-reset-recall-read-Ct-_vSEz.mjs";
import { t as readMemorySessionTargets } from "./session-memory-targets-CX7-WPJG.mjs";
import { r as resolveMemorySessionTargetsInWorker } from "./session-transcript-inventory-runtime-Ci94oSyU.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/plugin-sdk/memory-core-host-engine-sessions.ts
/** Private-local SDK subpath for memory session transcript helpers. */
/** Read only search-hit identities and their aliases through the canonical store owner. */
async function loadMemorySearchSessionStore(cfg, options) {
	const { agentId, ...transcriptSelection } = options;
	const { loadCombinedSessionStoreForGatewayCoreAsync } = await import("./combined-store-gateway-read-BhgN3aYB.mjs");
	const { store, storePath } = await loadCombinedSessionStoreForGatewayCoreAsync(cfg, {
		agentId,
		includeIncognito: false,
		projection: "list",
		transcriptSelection
	});
	return {
		storePath,
		store: Object.fromEntries(Object.entries(store).filter(([key]) => !isIncognitoSessionKey(key)))
	};
}
/** @deprecated Await loadArchivedSessionsAsync. Final compatibility day: 2026-12-31. */
function loadArchivedSessions(params) {
	warnPluginSdkDeprecation({
		family: "memory-session-sync-inventory",
		method: "loadArchivedSessions",
		replacement: "loadArchivedSessionsAsync"
	});
	assertBoundIncognitoMemorySyncAccess(params, "loadArchivedSessions", "loadArchivedSessionsAsync");
	return listSessionTranscriptArchivesReadOnly(params);
}
const buildSessionEntry = buildSessionEntry$1;
const listSessionTranscriptCorpusEntriesForAgent = listSessionTranscriptCorpusEntriesForAgent$1;
const readSessionResetRecallCutoff = readSessionResetRecallCutoff$1;
/** @deprecated Await loadMemorySessionMetadataAsync. Final compatibility day: 2026-12-31. */
function loadMemorySessionMetadata(params) {
	if (isMainThread) warnPluginSdkDeprecation({
		family: "memory-session",
		method: "loadMemorySessionMetadata",
		replacement: "loadMemorySessionMetadataAsync"
	});
	assertBoundIncognitoMemorySyncAccess(params, "loadMemorySessionMetadata", "loadMemorySessionMetadataAsync");
	const instance = listSessionTranscriptInstances(params, {
		includeAllWindows: true,
		sessionId: params.sessionId
	}).find((candidate) => candidate.agentId === normalizeAgentId(params.agentId) && (!params.sessionKey || candidate.sessionKey === params.sessionKey));
	return instance ? projectSessionMetadata(instance) : void 0;
}
/** Read the selected transcript's recorded source metadata through its owner. */
async function loadMemorySessionMetadataAsync(params) {
	return (await loadMemorySessionMetadataBatchAsync({
		...params,
		sessions: [params]
	}))[0];
}
/** One history read resolves the complete ingestion batch. */
async function loadMemorySessionMetadataBatchAsync(params) {
	const selectors = /* @__PURE__ */ new Map();
	for (const { sessionId, sessionKey } of params.sessions) {
		const keys = selectors.get(sessionId) ?? /* @__PURE__ */ new Set();
		keys.add(sessionKey);
		selectors.set(sessionId, keys);
	}
	if (selectors.size === 0) return [];
	const agentId = normalizeAgentId(params.agentId);
	const scope = {
		agentId,
		storePath: params.storePath
	};
	const sessionIds = [...selectors.keys()];
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => signal?.throwIfAborted();
	return (captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	}) ? (await resolveMemorySessionTargetsInWorker({
		...scope,
		sessionIds
	})).filter((entry) => entry.resolution === "live") : (await listSessionTranscriptInstancesInWorker({
		...scope,
		projection: "list"
	}, {
		includeAllWindows: true,
		sessionIds
	})).map((instance) => projectSessionMetadata(instance))).filter((entry) => entry.agentId === agentId && (selectors.get(entry.sessionId)?.has(void 0) || selectors.get(entry.sessionId)?.has(entry.sessionKey)));
}
/** @deprecated Await resolveMemorySessionTargetsAsync. Final compatibility day: 2026-12-31. */
function resolveMemorySessionTargets(params) {
	warnPluginSdkDeprecation({
		family: "memory-session-sync-inventory",
		method: "resolveMemorySessionTargets",
		replacement: "resolveMemorySessionTargetsAsync"
	});
	assertBoundIncognitoMemorySyncAccess(params, "resolveMemorySessionTargets", "resolveMemorySessionTargetsAsync");
	return readMemorySessionTargets(params);
}
//#endregion
export { loadMemorySessionMetadata as a, readSessionResetRecallCutoff as c, loadMemorySearchSessionStore as i, resolveMemorySessionTargets as l, listSessionTranscriptCorpusEntriesForAgent as n, loadMemorySessionMetadataAsync as o, loadArchivedSessions as r, loadMemorySessionMetadataBatchAsync as s, buildSessionEntry as t };
