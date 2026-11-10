import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as canonicalSessionValidationQuery, g as validateCanonicalSessionRow, l as readCanonicalSessionMainKey, s as hasCanonicalSessionValidationProjection } from "./session-canonical-key-B7chVWi3.mjs";
//#region src/config/sessions/session-canonical-validation.ts
const validatedBatch = Symbol("validatedCanonicalSessionBatch");
function hasPendingCanonicalSessionValidation(database) {
	return hasCanonicalSessionValidationProjection(database) && Boolean(executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_canonical_validation_pending").select("session_key").limit(1)));
}
/** First physical admission must validate all rows, even when an imported projection is clean. */
function seedCanonicalSessionValidation(database) {
	if (!database.db.isTransaction) throw new Error("Canonical validation seeding requires write admission");
	if (!hasCanonicalSessionValidationProjection(database)) return 0;
	const db = getNodeSqliteKysely(database.db);
	const result = executeSqliteQuerySync(database.db, db.insertInto("session_canonical_validation_pending").columns(["session_key"]).expression(db.selectFrom("session_nodes").select("session_key").where(sql.lit(true))).onConflict((conflict) => conflict.column("session_key").doNothing()));
	return Number(result.numAffectedRows ?? 0n);
}
/** Capture bounded source bytes and policy in one committed snapshot before write admission. */
function readPendingCanonicalSessionValidationBatch(database, options) {
	if (!Number.isSafeInteger(options.maxRows) || options.maxRows < 1 || !Number.isSafeInteger(options.maxBytes) || options.maxBytes < 1) throw new Error("Canonical validation batch limits must be positive safe integers");
	return runSqliteDeferredTransactionSync(database.db, () => {
		if (!hasCanonicalSessionValidationProjection(database)) return {
			mainKey: "main",
			rows: [],
			absentKeys: [],
			hasMore: false,
			oversizedRows: 0
		};
		const mainKey = readCanonicalSessionMainKey(database);
		const db = getNodeSqliteKysely(database.db);
		const candidates = executeSqliteQuerySync(database.db, db.selectFrom("session_canonical_validation_pending as pending").leftJoin("session_nodes as node", "node.session_key", "pending.session_key").select("pending.session_key").select(sql`length(CAST(pending.session_key AS BLOB)) + coalesce(length(CAST(node.entry_json AS BLOB)), 0) + coalesce(length(CAST(node.current_session_id AS BLOB)), 0) * 2 + coalesce(length(CAST(node.parent_session_key AS BLOB)), 0) + coalesce(length(CAST(node.spawned_by AS BLOB)), 0) + coalesce(length(CAST(node.fork_source_session_key AS BLOB)), 0)`.as("bytes")).orderBy("pending.session_key").limit(options.maxRows + 1)).rows;
		const keys = [];
		let bytes = 0;
		let oversizedRows = 0;
		for (const candidate of candidates) {
			if (keys.length >= options.maxRows || keys.length > 0 && bytes + candidate.bytes > options.maxBytes) break;
			keys.push(candidate.session_key);
			bytes += candidate.bytes;
			if (candidate.bytes > options.maxBytes) oversizedRows += 1;
		}
		const rows = keys.length ? executeSqliteQuerySync(database.db, canonicalSessionValidationQuery(database).where("session_nodes.session_key", "in", sqliteStringSet(keys))).rows : [];
		const found = new Set(rows.map((row) => row.session_key));
		return {
			mainKey,
			rows,
			absentKeys: keys.filter((key) => !found.has(key)),
			hasMore: keys.length < candidates.length,
			oversizedRows
		};
	});
}
/** Keep the exact validated flat fields private and immutable across awaited write admission. */
function validateCanonicalSessionValidationBatch(batch) {
	const rows = batch.rows.map((row) => {
		const snapshot = { ...row };
		validateCanonicalSessionRow(snapshot);
		return Object.freeze(snapshot);
	});
	const validated = {
		...batch,
		rows: Object.freeze(rows),
		absentKeys: Object.freeze([...batch.absentKeys]),
		[validatedBatch]: true
	};
	return Object.freeze(validated);
}
function sameCanonicalRow(left, right) {
	return left.session_key === right.session_key && left.current_session_id === right.current_session_id && left.entry_valid === right.entry_valid && left.entry_json === right.entry_json && left.parent_session_key === right.parent_session_key && left.spawned_by === right.spawned_by && left.fork_source_session_key === right.fork_source_session_key && left.retained_window_id === right.retained_window_id;
}
/** Settle only exact validated inputs; changed rows stay pending for the next owner admission. */
function compareAndCertifyCanonicalSessionValidationBatch(database, batch) {
	if (!database.db.isTransaction) throw new Error("Canonical validation certification requires write admission");
	if (!hasCanonicalSessionValidationProjection(database) || readCanonicalSessionMainKey(database) !== batch.mainKey) return 0;
	const keys = [...batch.rows.map((row) => row.session_key), ...batch.absentKeys];
	if (keys.length === 0) return 0;
	const current = new Map(executeSqliteQuerySync(database.db, canonicalSessionValidationQuery(database).where("session_nodes.session_key", "in", sqliteStringSet(keys))).rows.map((row) => [row.session_key, row]));
	const certifiedKeys = batch.rows.flatMap((row) => {
		const candidate = current.get(row.session_key);
		return candidate && sameCanonicalRow(row, candidate) ? [row.session_key] : [];
	});
	certifiedKeys.push(...batch.absentKeys.filter((key) => !current.has(key)));
	if (certifiedKeys.length === 0) return 0;
	const result = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).deleteFrom("session_canonical_validation_pending").where("session_key", "in", sqliteStringSet(certifiedKeys)));
	return Number(result.numAffectedRows ?? 0n);
}
//#endregion
export { validateCanonicalSessionValidationBatch as a, seedCanonicalSessionValidation as i, hasPendingCanonicalSessionValidation as n, readPendingCanonicalSessionValidationBatch as r, compareAndCertifyCanonicalSessionValidationBatch as t };
