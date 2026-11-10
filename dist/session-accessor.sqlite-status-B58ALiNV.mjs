import { o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { n as sessionEntrySnapshotColumnsForKeys } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { n as projectSqliteSessionOwner, t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-BFkJufPp.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-sjH_uIYB.mjs";
//#region src/config/sessions/session-accessor.sqlite-status.ts
function selectSessionEntryRows(database, projection, fullEntryKeys = [], ownerColumns) {
	return getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").select("entry_json").$if(projection !== "list" || fullEntryKeys.length > 0, (query) => query.select(projection === "list" ? sessionEntrySnapshotColumnsForKeys(fullEntryKeys) : sessionEntrySnapshotColumnsForKeys(void 0, projection))).$if(ownerColumns ?? hasSqliteSessionOwnerColumns(database.db), (query) => query.select([
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
	return value === "done" || value === "failed" || value === "killed" || value === "timeout" ? value : null;
}
function parseSessionEntryJson(row, projection = "full") {
	const record = parseSqliteSessionEntryRecord(row);
	if (!record) return null;
	attachSessionEntrySnapshots(record, row, projection);
	return projectSqliteSessionOwner(projectCanonicalSessionEntryShape(record), row);
}
//#endregion
export { sessionEntryInventoryJson as i, parseSessionEntryJson as n, selectSessionEntryRows as r, normalizeStatus as t };
