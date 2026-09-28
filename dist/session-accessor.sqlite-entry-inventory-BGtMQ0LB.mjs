import { a as iterateSqliteQuerySync, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { o as sessionEntryInventoryJson, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { i as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-BBylVEaq.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-inventory.ts
function readSessionEntryStore(database, options = {}) {
	if (options.allowCanonicalRepair !== true) assertCanonicalSqliteSessionKeysCurrent(database);
	let query = getSessionKysely(database.db).selectFrom("session_nodes").selectAll();
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
	const db = getSessionKysely(database.db);
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([sessionEntryInventoryJson, "session_key"]).orderBy("session_key", "asc"))) if (row.entry_json === null || parseSessionEntryJson({ entry_json: row.entry_json })) yield row.session_key;
}
//#endregion
export { readSessionEntryCount as n, readSessionEntryStore as r, iterateSessionEntryKeys as t };
