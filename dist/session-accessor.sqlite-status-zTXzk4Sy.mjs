import { a as getNodeSqliteKysely, d as sql, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { n as parseSqliteSessionEntryRecord } from "./session-entry-json-CtwFM7Hi.mjs";
import { n as sessionEntrySnapshotColumns, r as sessionEntrySnapshotColumnsForKeys, t as attachSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { n as projectSqliteSessionOwner, t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-EwCluh1i.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-BzuAi3ao.mjs";
//#region src/config/sessions/session-accessor.sqlite-status.ts
function selectSessionEntryRows(database, projection, fullEntryKeys = [], ownerColumns) {
	return getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").select("entry_json").$if(projection === "full" || fullEntryKeys.length > 0, (query) => query.select(projection === "full" ? sessionEntrySnapshotColumns : sessionEntrySnapshotColumnsForKeys(fullEntryKeys))).$if(ownerColumns ?? hasSqliteSessionOwnerColumns(database.db), (query) => query.select([
		"owner_actor_type",
		"owner_actor_id",
		"owner_assigned_by_type",
		"owner_assigned_by_id",
		"owner_assigned_at"
	]));
}
const sessionEntryInventoryJson = sql`CASE WHEN entry_valid = 1 THEN NULL ELSE entry_json END`.as("entry_json");
function normalizeStatus(value) {
	if (value === "interrupted") return "failed";
	return value === "running" || value === "done" || value === "failed" || value === "killed" || value === "timeout" ? value : null;
}
function parseSessionEntryJson(row, projection = "full") {
	const record = parseSqliteSessionEntryRecord(row);
	if (!record) return null;
	if (projection === "list") {
		delete record.sessionDiffBaseline;
		delete record.skillsSnapshot;
		delete record.systemPromptReport;
	} else attachSessionEntrySnapshots(record, row);
	return projectSqliteSessionOwner(projectCanonicalSessionEntryShape(record), row);
}
function hasSessionEntriesByStatus(database, statuses) {
	const selectedStatuses = new Set(statuses);
	const projectedStatuses = [...new Set(statuses.map(normalizeStatus))].filter((status) => status !== null);
	if (projectedStatuses.length === 0) return false;
	const query = selectSessionEntryRows(database, "list").where("status", "in", projectedStatuses);
	for (const row of iterateSqliteQuerySync(database.db, query)) {
		const entry = parseSessionEntryJson(row, "list");
		if (entry?.status && selectedStatuses.has(entry.status)) return true;
	}
	return false;
}
function readSessionEntriesByStatus(database, statuses, sessionKeys) {
	const selectedStatuses = [...new Set(statuses)];
	const projectedStatuses = [...new Set(selectedStatuses.map(normalizeStatus))].filter((status) => status !== null);
	if (selectedStatuses.length === 0) return [];
	let query = getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll().select(sessionEntrySnapshotColumns).where("status", "in", projectedStatuses);
	if (sessionKeys) query = query.where("session_key", "in", sqliteStringSet(sessionKeys));
	return executeSqliteQuerySync(database.db, query).rows.flatMap((row) => {
		const entry = parseSessionEntryJson(row);
		return entry?.status && selectedStatuses.includes(entry.status) ? [{
			entry,
			sessionKey: row.session_key
		}] : [];
	}).toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}
//#endregion
export { selectSessionEntryRows as a, readSessionEntriesByStatus as i, normalizeStatus as n, sessionEntryInventoryJson as o, parseSessionEntryJson as r, hasSessionEntriesByStatus as t };
