import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as iterateSqliteQuerySync, c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, s as prepareSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { w as SESSION_OWNER_COLUMN_DEFINITIONS } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { i as parseSqliteSessionEntryRecord } from "./conversation-ref-8kIjGCCc.mjs";
import { n as projectCanonicalSessionEntryShape } from "./store-entry-shape-CWorLqwJ.mjs";
//#region src/config/sessions/session-accessor.sqlite-owner-projection.ts
function prepareOwnerColumnReads(database) {
	const db = getNodeSqliteKysely(database);
	return {
		schemaVersion: prepareSqliteQueryTakeFirstSync(database, () => db.selectFrom(sql`pragma_schema_version`.as("pragma_schema")).select(sql`schema_version`.as("schema_version"))),
		columns: prepareSqliteQuerySync(database, () => db.selectFrom(sql`pragma_table_info('session_nodes')`.as("pragma_columns")).select(sql`name`.as("name")))
	};
}
const ownerColumnAvailability = /* @__PURE__ */ new WeakMap();
function actorFromColumns(type, id) {
	const normalizedType = type === "human" || type === "agent" || type === "system" ? type : null;
	const normalizedId = normalizeOptionalString(id);
	return normalizedType && normalizedId ? {
		type: normalizedType,
		id: normalizedId
	} : void 0;
}
function readSqliteSessionOwner(row) {
	const actor = actorFromColumns(row.owner_actor_type, row.owner_actor_id);
	if (!actor) return;
	const assignedBy = actorFromColumns(row.owner_assigned_by_type, row.owner_assigned_by_id);
	const assignedAt = typeof row.owner_assigned_at === "number" && Number.isFinite(row.owner_assigned_at) ? row.owner_assigned_at : void 0;
	return {
		actor,
		...assignedBy ? { assignedBy } : {},
		...assignedAt !== void 0 ? { assignedAt } : {}
	};
}
function projectSqliteSessionOwner(entry, row) {
	const owner = readSqliteSessionOwner(row);
	return owner ? {
		...entry,
		owner
	} : entry;
}
function hasSqliteSessionOwnerColumns(database) {
	let reads = ownerColumnAvailability.get(database);
	if (!reads) {
		reads = prepareOwnerColumnReads(database);
		ownerColumnAvailability.set(database, reads);
	}
	const schema = reads.schemaVersion(void 0);
	const schemaVersion = typeof schema?.schema_version === "number" ? schema.schema_version : -1;
	const cached = reads.availability;
	if (cached?.schemaVersion === schemaVersion) return cached.available;
	const tableInfoRows = reads.columns(void 0).rows;
	const columns = new Set(tableInfoRows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	const available = SESSION_OWNER_COLUMN_DEFINITIONS.every(({ columnName }) => columns.has(columnName));
	reads.availability = {
		available,
		schemaVersion
	};
	return available;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-status.ts
const sessionEntryMetadataJson = sql`CASE WHEN json_valid(entry_json)
  THEN CASE WHEN json_type(entry_json, '$.sessionId') = 'text'
      AND length(CAST(entry_json AS BLOB)) = length(CAST(printf('%s', entry_json) AS BLOB))
    THEN json_remove(entry_json, '$.skillsSnapshot', '$.systemPromptReport')
    ELSE entry_json END
  ELSE entry_json END`.as("entry_json");
function selectSessionEntryRows(database, projection, fullEntryKeys = [], ownerColumns) {
	const metadata = fullEntryKeys.length ? sql`CASE WHEN session_key IN ${sqliteStringSet(fullEntryKeys)} THEN entry_json ELSE ${sessionEntryMetadataJson.expression} END`.as("entry_json") : sessionEntryMetadataJson;
	return getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").select(projection === "full" ? "entry_json" : metadata).$if(ownerColumns ?? hasSqliteSessionOwnerColumns(database.db), (query) => query.select([
		"owner_actor_type",
		"owner_actor_id",
		"owner_assigned_by_type",
		"owner_assigned_by_id",
		"owner_assigned_at"
	]));
}
const sessionEntryInventoryJson = sql`CASE WHEN entry_valid = 1 THEN NULL ELSE ${sessionEntryMetadataJson.expression} END`.as("entry_json");
function normalizeStatus(value) {
	if (value === "interrupted") return "failed";
	return value === "running" || value === "done" || value === "failed" || value === "killed" || value === "timeout" ? value : null;
}
function parseSessionEntryJson(row, projection = "full") {
	const record = parseSqliteSessionEntryRecord(row);
	if (!record) return null;
	if (projection === "list") {
		delete record.skillsSnapshot;
		delete record.systemPromptReport;
	}
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
	let query = getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll().where("status", "in", projectedStatuses);
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
export { selectSessionEntryRows as a, hasSqliteSessionOwnerColumns as c, readSessionEntriesByStatus as i, projectSqliteSessionOwner as l, normalizeStatus as n, sessionEntryInventoryJson as o, parseSessionEntryJson as r, sessionEntryMetadataJson as s, hasSessionEntriesByStatus as t, readSqliteSessionOwner as u };
