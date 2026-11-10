import { d as sqliteStringSet, i as executeSqliteQuerySync, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as sessionEntrySnapshotColumns } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as sessionEntryInventoryJson, n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-inventory.ts
function readSessionEntryStore(database, options = {}) {
	if (options.allowCanonicalRepair !== true) assertCanonicalSqliteSessionKeysCurrent(database);
	let query = getSessionKysely(database.db).selectFrom("session_nodes").selectAll().select(sessionEntrySnapshotColumns);
	if (options.includeArchived === false) query = query.where("archived_at", "is", null);
	const rows = iterateSqliteQuerySync(database.db, (options.sessionKeys ? query.where("session_key", "in", sqliteStringSet(options.sessionKeys)) : query).orderBy("session_key"));
	const store = {};
	for (const row of rows) {
		const entry = parseSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
const countQueriesByDatabase = /* @__PURE__ */ new WeakMap();
function readSessionEntryCount(database, options = {}) {
	const includeArchived = options.includeArchived !== false;
	let queries = countQueriesByDatabase.get(database.db);
	let compiled = queries?.get(includeArchived);
	if (!compiled) {
		const db = getSessionKysely(database.db);
		let query = db.selectFrom("session_nodes");
		if (!includeArchived) query = query.where("archived_at", "is", null);
		const totalCount = db.selectFrom("session_nodes").select((eb) => eb.fn.countAll().as("count"));
		compiled = db.selectNoFrom((eb) => [(includeArchived ? totalCount : eb(totalCount, "-", totalCount.where("archived_at", "is not", null))).as("count"), eb.val(null).as("entry_json")]).unionAll(query.where("entry_valid", "!=", 1).select((eb) => eb.val(0).as("count")).select(sessionEntryInventoryJson)).compile();
		if (!queries) {
			queries = /* @__PURE__ */ new Map();
			countQueriesByDatabase.set(database.db, queries);
		}
		queries.set(includeArchived, compiled);
	}
	let count = 0;
	for (const row of executeSqliteQuerySync(database.db, { compile: () => compiled }).rows) count += row.entry_json === null ? row.count : parseSessionEntryJson({ entry_json: row.entry_json }) ? 0 : -1;
	return count;
}
function* iterateSessionEntryKeys(database) {
	const query = getSessionKysely(database.db).selectFrom("session_nodes").select([sessionEntryInventoryJson, "session_key"]).orderBy("session_key", "asc");
	for (const row of iterateSqliteQuerySync(database.db, query)) if (row.entry_json === null || parseSessionEntryJson({ entry_json: row.entry_json })) yield row.session_key;
}
//#endregion
export { readSessionEntryCount as n, readSessionEntryStore as r, iterateSessionEntryKeys as t };
