import { a as getNodeSqliteKysely, f as expressionBuilder, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
//#region src/config/sessions/session-entry-snapshots.ts
const snapshotColumns = [
	["sessionDiffBaseline", "session_diff_baseline_json"],
	["skillsSnapshot", "skills_snapshot_json"],
	["systemPromptReport", "system_prompt_report_json"]
];
/** One statement owns hot and cold facts; JSON remains opaque to SQLite's depth limit. */
function sessionEntrySnapshotColumnsForKeys(keys) {
	const selectedKeys = keys === void 0 ? void 0 : sqliteStringSet(keys);
	const eb = expressionBuilder();
	return snapshotColumns.map(([field, alias]) => {
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
	const snapshotsChanged = mode === "complete" || snapshotColumns.some(([field]) => values[field] !== mode.previousEntry?.[field]);
	const snapshots = [];
	for (const [field] of snapshotsChanged ? snapshotColumns : []) {
		const valueJson = JSON.stringify(values[field]);
		if (valueJson !== void 0) snapshots.push({
			field,
			valueJson
		});
	}
	return {
		entryJson: JSON.stringify(hot),
		snapshots,
		snapshotsChanged
	};
}
function attachSessionEntrySnapshots(entry, row) {
	for (const [field, alias] of snapshotColumns) {
		const valueJson = row[alias];
		if (valueJson != null) {
			const value = JSON.parse(valueJson);
			Object.assign(entry, { [field]: value });
		}
	}
	return entry;
}
/** The entry writer owns this synchronous transaction and publishes its committed facts. */
function writeSessionEntrySnapshots(database, sessionKey, snapshots) {
	if (!database.db.isTransaction) throw new Error("Session snapshot writes require an entry transaction");
	const db = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_entry_snapshots").where("session_key", "=", sessionKey).$if(snapshots.length > 0, (query) => query.where("field", "not in", snapshots.map((snapshot) => snapshot.field))));
	for (const snapshot of snapshots) executeSqliteQuerySync(database.db, db.insertInto("session_entry_snapshots").values({
		session_key: sessionKey,
		field: snapshot.field,
		value_json: snapshot.valueJson
	}).onConflict((conflict) => conflict.columns(["session_key", "field"]).doUpdateSet((eb) => ({ value_json: eb.ref("excluded.value_json") })).whereRef("session_entry_snapshots.value_json", "!=", "excluded.value_json")));
}
//#endregion
export { writeSessionEntrySnapshots as a, splitSessionEntrySnapshots as i, sessionEntrySnapshotColumns as n, sessionEntrySnapshotColumnsForKeys as r, attachSessionEntrySnapshots as t };
