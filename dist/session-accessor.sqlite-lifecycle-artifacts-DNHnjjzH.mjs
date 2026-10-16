import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { m as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { a as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { h as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { d as readWithCanonicalSessionReaderContinuation, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { c as planSessionStateDeleteIfUnreferenced, r as collectProjectedReferencedSessionIds } from "./session-accessor.sqlite-lifecycle-state-CQczfYh9.mjs";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-accessor.sqlite-lifecycle-artifacts.ts
function sessionKeySegmentStartsWith(sessionKey, prefix) {
	const firstSeparator = sessionKey.indexOf(":");
	if (firstSeparator < 0) return sessionKey.startsWith(prefix);
	const secondSeparator = sessionKey.indexOf(":", firstSeparator + 1);
	return (secondSeparator < 0 ? sessionKey : sessionKey.slice(secondSeparator + 1)).startsWith(prefix);
}
function sessionKeyBelongsToAgent(sessionKey, agentId) {
	if (agentId === void 0) return true;
	const parsed = parseAgentSessionKey(sessionKey);
	return parsed !== null && normalizeAgentId(parsed.agentId) === normalizeAgentId(agentId);
}
function readSessionTranscriptUpdatedAt(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("created_at").as("updated_at")).where("session_id", "=", sessionId));
	if (row?.updated_at === null || row?.updated_at === void 0) return;
	return coerceRequiredSqliteNumber(row.updated_at);
}
function sqliteTranscriptStateIsReclaimable(params) {
	if (params.sessionUpdatedAt !== void 0 && params.nowMs - params.sessionUpdatedAt < params.orphanTranscriptMinAgeMs) return false;
	const transcriptUpdatedAt = readSessionTranscriptUpdatedAt(params.database, params.sessionId);
	const updatedAt = params.sessionUpdatedAt === void 0 ? transcriptUpdatedAt : Math.max(params.sessionUpdatedAt, transcriptUpdatedAt ?? params.sessionUpdatedAt);
	return updatedAt === void 0 || params.nowMs - updatedAt >= params.orphanTranscriptMinAgeMs;
}
function sqliteTranscriptStateHasMarker(params) {
	const startedAt = params.diagnostics ? performance.now() : 0;
	if (params.diagnostics) params.diagnostics.markerWindows = (params.diagnostics.markerWindows ?? 0) + 1;
	try {
		const db = getSessionKysely(params.database.db);
		const rows = iterateSqliteQuerySync(params.database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(params.database.db).as("event_json")).where("session_id", "=", params.sessionId).orderBy("seq", "asc"));
		let hasMarker = false;
		for (const row of rows) {
			if (params.diagnostics) params.diagnostics.markerRows = (params.diagnostics.markerRows ?? 0) + 1;
			hasMarker ||= row.event_json.includes(params.transcriptContentMarker);
		}
		return hasMarker;
	} finally {
		if (params.diagnostics) params.diagnostics.markerScanMs = (params.diagnostics.markerScanMs ?? 0) + performance.now() - startedAt;
	}
}
function planSqliteOrphanLifecycleTranscriptStateDeletes(params) {
	const db = getSessionKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"plugin_owner_id"
	]).orderBy("session_id", "asc")).rows;
	if (params.diagnostics) params.diagnostics.windowRows = rows.length;
	const deletePlans = [];
	for (const row of rows) {
		if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || params.referencedSessionIds.has(row.session_id) || params.excludedSessionIds?.has(row.session_id) || params.pluginOwnerId && row.plugin_owner_id && row.plugin_owner_id !== params.pluginOwnerId) continue;
		if (!sqliteTranscriptStateIsReclaimable({
			database: params.database,
			sessionId: row.session_id,
			nowMs: params.nowMs,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
		}) || !sqliteTranscriptStateHasMarker({
			database: params.database,
			sessionId: row.session_id,
			transcriptContentMarker: params.transcriptContentMarker,
			diagnostics: params.diagnostics
		})) continue;
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: params.archiveRemovedEntryTranscripts,
			archiveDirectory: params.archiveDirectory,
			database: params.database,
			reason: "deleted",
			referencedSessionIds: params.referencedSessionIds,
			sessionId: row.session_id
		});
		if (plan) deletePlans.push(plan);
	}
	return deletePlans;
}
/** A negative selection skips planning; the planner still owns every deletion decision. */
function hasSessionLifecycleArtifactCleanupCandidates(database, params, inspectOrphanTranscripts) {
	const db = getSessionKysely(database.db);
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key"))) if (sessionKeyBelongsToAgent(row.session_key, params.agentId) && sessionKeySegmentStartsWith(row.session_key, params.sessionKeySegmentPrefix)) return true;
	const windows = iterateSqliteQuerySync(database.db, db.selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"plugin_owner_id"
	]).where("session_id", "not in", db.selectFrom("session_nodes").select("current_session_id")).orderBy("session_id", "asc"));
	for (const row of windows) {
		if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || params.pluginOwnerId && row.plugin_owner_id && row.plugin_owner_id !== params.pluginOwnerId) continue;
		if (!inspectOrphanTranscripts) return true;
		if (sqliteTranscriptStateIsReclaimable({
			database,
			sessionId: row.session_id,
			nowMs: params.nowMs,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
		}) && sqliteTranscriptStateHasMarker({
			database,
			sessionId: row.session_id,
			transcriptContentMarker: params.transcriptContentMarker
		})) return true;
	}
	return false;
}
/** Called inside the lifecycle writer FIFO; only candidate stores need writable preparation. */
async function prepareSessionLifecycleArtifactCleanup(databaseOptions, params) {
	const cachedDatabase = getOpenClawAgentDatabaseIfOpen(databaseOptions);
	if (!cachedDatabase) try {
		const candidates = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => hasSessionLifecycleArtifactCleanupCandidates(database, params, true)), databaseOptions);
		if (!candidates.found || !candidates.value) return {
			entries: [],
			deletePlans: []
		};
	} catch {}
	return withSqliteSessionDatabase(databaseOptions, (database) => {
		if (cachedDatabase) try {
			if (!runSqliteDeferredTransactionSync(database.db, () => {
				assertCanonicalSqliteSessionKeysCurrent(database);
				return hasSessionLifecycleArtifactCleanupCandidates(database, params, false);
			})) return {
				entries: [],
				deletePlans: []
			};
		} catch {}
		return planSessionLifecycleArtifactCleanup(database, params);
	}, void 0, params.diagnostics);
}
function readSessionLifecycleArtifactCleanup(database, params, expectedSource) {
	assertOpenClawAgentDatabaseIdentity(database, expectedSource);
	const read = () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		return hasSessionLifecycleArtifactCleanupCandidates(database, params, false) ? planSessionLifecycleArtifactCleanup(database, params) : {
			entries: [],
			deletePlans: []
		};
	};
	const plan = readWithCanonicalSessionReaderContinuation(database, params.continuation, () => database.db.isTransaction ? read() : runSqliteDeferredTransactionSync(database.db, read));
	assertOpenClawAgentDatabaseIdentity(database, expectedSource);
	return plan;
}
function planSessionLifecycleArtifactCleanup(database, params) {
	const diagnostics = params.diagnostics;
	let phase = "nodeInventoryMs";
	let phaseStartedAt = diagnostics ? performance.now() : 0;
	if (diagnostics) {
		diagnostics.markerScanMs = 0;
		diagnostics.markerRows = 0;
		diagnostics.markerWindows = 0;
		diagnostics.completed = false;
	}
	const recordPhase = (next) => {
		if (diagnostics) {
			const finishedAt = performance.now();
			diagnostics[phase] = (diagnostics[phase] ?? 0) + finishedAt - phaseStartedAt;
			phaseStartedAt = finishedAt;
		}
		if (next) phase = next;
	};
	try {
		const db = getSessionKysely(database.db);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
			"session_key",
			"current_session_id",
			"updated_at"
		]).orderBy("session_key", "asc")).rows;
		if (diagnostics) diagnostics.nodeRows = rows.length;
		const removedSessionIds = /* @__PURE__ */ new Set();
		const entries = [];
		const projectedStore = readSessionEntryStore(database);
		const foreignOwnedSessionIds = params.pluginOwnerId ? new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("plugin_owner_id", "is not", null).where("plugin_owner_id", "!=", params.pluginOwnerId)).rows.map((row) => row.session_id)) : void 0;
		for (const row of rows) {
			if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || !sessionKeySegmentStartsWith(row.session_key, params.sessionKeySegmentPrefix)) continue;
			const entry = projectedStore[row.session_key];
			const sessionIds = uniqueStrings([row.current_session_id, ...entry ? collectSessionStateIdsForEntry(entry) : []]);
			if (params.pluginOwnerId && entry?.pluginOwnerId && entry.pluginOwnerId !== params.pluginOwnerId || sessionIds.some((sessionId) => foreignOwnedSessionIds?.has(sessionId))) continue;
			if (!sqliteTranscriptStateIsReclaimable({
				database,
				sessionUpdatedAt: coerceRequiredSqliteNumber(row.updated_at),
				sessionId: row.current_session_id,
				nowMs: params.nowMs,
				orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
			})) continue;
			for (const sessionId of sessionIds) removedSessionIds.add(sessionId);
			entries.push({
				expectedEntry: entry ? structuredClone(entry) : void 0,
				sessionKey: row.session_key
			});
			delete projectedStore[row.session_key];
		}
		if (diagnostics) diagnostics.selectedEntries = entries.length;
		recordPhase("referencePlanningMs");
		const referencedSessionIds = collectProjectedReferencedSessionIds({
			database,
			excludedSessionKeys: entries.map((entry) => entry.sessionKey),
			projectedStore
		});
		if (diagnostics) diagnostics.referenceIds = referencedSessionIds.size;
		const deletePlans = [];
		for (const sessionId of removedSessionIds) {
			const plan = planSessionStateDeleteIfUnreferenced({
				archiveTranscript: params.archiveRemovedEntryTranscripts,
				archiveDirectory: params.archiveDirectory,
				database,
				referencedSessionIds,
				sessionId
			});
			if (plan) deletePlans.push(plan);
		}
		recordPhase("orphanPlanningMs");
		deletePlans.push(...planSqliteOrphanLifecycleTranscriptStateDeletes({
			...params.agentId ? { agentId: params.agentId } : {},
			archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts,
			archiveDirectory: params.archiveDirectory,
			database,
			excludedSessionIds: removedSessionIds,
			...params.pluginOwnerId ? { pluginOwnerId: params.pluginOwnerId } : {},
			referencedSessionIds,
			transcriptContentMarker: params.transcriptContentMarker,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
			nowMs: params.nowMs,
			diagnostics
		}));
		if (diagnostics) {
			diagnostics.deletePlans = deletePlans.length;
			diagnostics.completed = true;
		}
		return {
			deletePlans,
			entries
		};
	} finally {
		recordPhase();
		if (diagnostics?.orphanPlanningMs !== void 0) diagnostics.orphanPlanningMs -= diagnostics.markerScanMs ?? 0;
	}
}
//#endregion
export { prepareSessionLifecycleArtifactCleanup as n, readSessionLifecycleArtifactCleanup as r, planSessionLifecycleArtifactCleanup as t };
