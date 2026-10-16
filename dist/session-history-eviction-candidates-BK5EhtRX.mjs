import { o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { n as sessionEntrySnapshotColumns } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { o as isSessionEntryDiskBudgetEvictable } from "./store-maintenance-CGOlSbiV.mjs";
import { n as collectRecentSessionHistoryIds, r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { d as readReferencedSessionIds } from "./session-accessor.sqlite-lifecycle-state-CQczfYh9.mjs";
//#region src/config/sessions/session-history-eviction-candidates.ts
const DISK_EVICTABLE_ARCHIVE_BATCH_SIZE = 64;
function readDiskEvictableArchivedSessionBatchInDatabase(database, params) {
	const limit = Math.max(1, params.limit ?? DISK_EVICTABLE_ARCHIVE_BATCH_SIZE);
	const candidates = [];
	let cursor = params.after;
	while (candidates.length < limit) {
		let query = getSessionKysely(database.db).selectFrom("session_nodes").select([
			"archived_at",
			"current_session_id",
			"entry_json",
			"session_key",
			"updated_at"
		]).select(sessionEntrySnapshotColumns).where("archived_at", "is not", null).orderBy("archived_at", "asc").orderBy("session_key", "asc").limit(DISK_EVICTABLE_ARCHIVE_BATCH_SIZE);
		if (cursor) {
			const after = cursor;
			query = query.where((eb) => eb.or([eb("archived_at", ">", after.archivedAt), eb.and([eb("archived_at", "=", after.archivedAt), eb("session_key", ">", after.sessionKey)])]));
		}
		const rows = executeSqliteQuerySync(database.db, query).rows;
		let scanned = 0;
		for (const row of rows) {
			scanned += 1;
			if (row.archived_at == null) continue;
			cursor = {
				archivedAt: row.archived_at,
				sessionKey: row.session_key
			};
			const entry = parseSessionEntryJson(row);
			if (entry && isSessionEntryDiskBudgetEvictable({
				key: row.session_key,
				entry,
				preserveRecentMs: params.preserveRecentMs
			})) {
				candidates.push({
					archivedAt: row.archived_at,
					entry,
					sessionKey: row.session_key
				});
				if (candidates.length >= limit) break;
			}
		}
		const exhausted = rows.length < DISK_EVICTABLE_ARCHIVE_BATCH_SIZE && scanned === rows.length;
		if (candidates.length >= limit || exhausted) return {
			candidates,
			...cursor ? { cursor } : {},
			exhausted
		};
	}
	return {
		candidates,
		...cursor ? { cursor } : {},
		exhausted: false
	};
}
/** Resolve a captured admission snapshot without consulting another thread's live owners. */
function collectSessionAdmissionReferences(params) {
	const protectedSessionIds = /* @__PURE__ */ new Set();
	const admissionIdentities = params.admissionIdentities;
	if (admissionIdentities.length === 0) return protectedSessionIds;
	for (const identity of admissionIdentities) protectedSessionIds.add(identity);
	const normalizedAdmissionKeys = new Set([...admissionIdentities].map((identity) => normalizeStoreSessionKey(identity)));
	const db = getSessionKysely(params.database.db);
	const admittedKeyBytes = [];
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select(["session_key", db.fn("hex", ["session_key"]).as("key_bytes")]))) if (normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) admittedKeyBytes.push(row.key_bytes);
	const rows = admittedKeyBytes.length ? iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select(["entry_json", "current_session_id"]).where("session_key", "in", db.selectFrom("session_nodes").select("session_key").where(db.fn("hex", ["session_key"]), "in", sqliteStringSet(admittedKeyBytes)))) : [];
	for (const row of rows) {
		protectedSessionIds.add(row.current_session_id);
		const entry = parseSessionEntryJson(row);
		if (entry) for (const sessionId of collectSessionStateIdsForEntry(entry)) protectedSessionIds.add(sessionId);
	}
	const generationRows = iterateSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select(["session_id", "session_key"]));
	for (const row of generationRows) if (normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) protectedSessionIds.add(row.session_id);
	return protectedSessionIds;
}
function readHistoricalSessionIdsInDatabase(params) {
	const { database } = params;
	const protectedSessionIds = readReferencedSessionIds(database, void 0, void 0, params);
	for (const sessionId of collectSessionAdmissionReferences(params)) protectedSessionIds.add(sessionId);
	for (const sessionId of collectRecentSessionHistoryIds(params)) protectedSessionIds.add(sessionId);
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").orderBy("updated_at", "asc").orderBy("session_id", "asc")).rows.flatMap((row) => protectedSessionIds.has(row.session_id) ? [] : [row.session_id]);
}
//#endregion
export { readDiskEvictableArchivedSessionBatchInDatabase as n, readHistoricalSessionIdsInDatabase as r, collectSessionAdmissionReferences as t };
