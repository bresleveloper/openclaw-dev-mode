import { d as sqliteStringSet, i as executeSqliteQuerySync, m as expressionBuilder, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as sessionEntrySnapshotColumnsDefinition } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-entry-snapshots.ts
/** One statement owns hot and cold facts; JSON remains opaque to SQLite's depth limit. */
function sessionEntrySnapshotColumnsForKeys(keys, projection = "full") {
	const selectedKeys = keys === void 0 ? void 0 : sqliteStringSet(keys);
	const eb = expressionBuilder();
	return sessionEntrySnapshotColumnsDefinition.filter(([field]) => projection === "full" || projection !== "list" && projection.includes(field)).map(([field, alias]) => {
		const snapshot = eb.selectFrom("session_entry_snapshots").select("value_json").whereRef("session_entry_snapshots.session_key", "=", "session_nodes.session_key").where("field", "=", field);
		return (selectedKeys === void 0 ? snapshot : eb.case().when("session_nodes.session_key", "in", selectedKeys).then(snapshot).end()).as(alias);
	});
}
const sessionEntrySnapshotColumns = sessionEntrySnapshotColumnsForKeys();
function splitSessionEntrySnapshots(entry, mode = "complete") {
	const { sessionDiffBaseline, skillsSnapshot, systemPromptReport, ...hot } = entry;
	const values = {
		sessionDiffBaseline,
		skillsSnapshot,
		systemPromptReport
	};
	const snapshotsChanged = mode === "complete" || sessionEntrySnapshotColumnsDefinition.some(([field]) => values[field] !== mode.previousEntry?.[field] && !isDeepStrictEqual(values[field], mode.previousEntry?.[field]));
	const snapshots = [];
	for (const [field] of snapshotsChanged ? sessionEntrySnapshotColumnsDefinition : []) {
		const valueJson = JSON.stringify(values[field]);
		if (valueJson !== void 0) snapshots.push({
			field,
			valueJson
		});
	}
	const snapshotsRemoved = mode === "complete" || snapshotsChanged && sessionEntrySnapshotColumnsDefinition.some(([field]) => mode.previousEntry?.[field] !== void 0 && !snapshots.some((snapshot) => snapshot.field === field));
	return {
		entryJson: JSON.stringify(hot),
		snapshots,
		snapshotsChanged,
		snapshotsRemoved
	};
}
/** The entry writer owns this synchronous transaction and publishes its committed facts. */
function writeSessionEntrySnapshots(database, sessionKey, snapshots, { snapshotsRemoved = true } = {}) {
	if (!database.db.isTransaction) throw new Error("Session snapshot writes require an entry transaction");
	const db = getNodeSqliteKysely(database.db);
	if (snapshotsRemoved) executeSqliteQuerySync(database.db, db.deleteFrom("session_entry_snapshots").where("session_key", "=", sessionKey).$if(snapshots.length > 0, (query) => query.where("field", "not in", snapshots.map((snapshot) => snapshot.field))));
	if (snapshots.length > 0) executeSqliteQuerySync(database.db, db.insertInto("session_entry_snapshots").values(snapshots.map((snapshot) => ({
		session_key: sessionKey,
		field: snapshot.field,
		value_json: snapshot.valueJson
	}))).onConflict((conflict) => conflict.columns(["session_key", "field"]).doUpdateSet((eb) => ({ value_json: eb.ref("excluded.value_json") })).whereRef("session_entry_snapshots.value_json", "!=", "excluded.value_json")));
}
//#endregion
export { writeSessionEntrySnapshots as i, sessionEntrySnapshotColumnsForKeys as n, splitSessionEntrySnapshots as r, sessionEntrySnapshotColumns as t };
