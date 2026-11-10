import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { l as invalidateSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { t as CONTENT_VERSION_KEY } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { t as ABANDONED_UPDATE_RUN_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { parse } from "semver";
//#region src/state/openclaw-state-schema-publication.ts
const TERMINAL_GRACE_MS = 3e5;
/** Only the 2026.9.2 release line reopens the ledger without the transaction fence. */
function isUnfencedUpdateDriver(version) {
	const parsed = typeof version === "string" ? parse(version) : null;
	return parsed !== null && `${parsed.major}.${parsed.minor}.${parsed.patch}` === "2026.9.2";
}
/** Every unfenced driver must clear its own deadline; a newer run cannot hide an older one. */
function readStateSchemaPublicationBlocker(db, nowMs = Date.now()) {
	if (!tableExists(db, "update_runs")) return;
	const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("update_runs").select([
		"run_id",
		"before_json",
		"status",
		"updated_at_ms",
		"finished_at_ms"
	]).where((eb) => eb.or([eb.and([eb("status", "=", "running"), eb("updated_at_ms", ">=", nowMs - ABANDONED_UPDATE_RUN_MS)]), eb.and([eb("status", "!=", "running"), eb.or([eb("finished_at_ms", ">", nowMs - TERMINAL_GRACE_MS), eb("finished_at_ms", "is", null)])])])).orderBy("run_id")).rows;
	let blocker;
	for (const row of rows) {
		const before = JSON.parse(row.before_json);
		if (!isRecord(before) || typeof before.version !== "string" || !isUnfencedUpdateDriver(before.version)) continue;
		const deadline = row.status === "running" ? row.updated_at_ms + ABANDONED_UPDATE_RUN_MS + 1 : row.finished_at_ms === null ? null : row.finished_at_ms + TERMINAL_GRACE_MS;
		if (!blocker || deadline === null || blocker.publishAfterMs !== null && deadline > blocker.publishAfterMs) blocker = {
			runId: row.run_id,
			updaterVersion: before.version,
			publishAfterMs: deadline
		};
	}
	return blocker;
}
/** Called inside the schema write transaction, after all content migrations succeed. */
function resolveStateSchemaVersionToPublish(db) {
	const published = readSqliteUserVersion(db);
	if (published >= 22 || !readStateSchemaPublicationBlocker(db)) return 22;
	if (!tableExists(db, "config_machine_state")) throw new Error("Shared state schema publication cannot be deferred without config_machine_state.");
	writeStateSchemaContentVersion(db);
	invalidateSqliteSchemaFacts(db);
	return published;
}
/** Persist the content marker inside the schema owner's transaction. */
function writeStateSchemaContentVersion(db) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("config_machine_state").values({
		state_key: CONTENT_VERSION_KEY,
		value_json: String(22),
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: String(22),
		updated_at_ms: Date.now()
	}).where("config_machine_state.value_json", "!=", String(22))));
}
//#endregion
export { writeStateSchemaContentVersion as i, readStateSchemaPublicationBlocker as n, resolveStateSchemaVersionToPublish as r, isUnfencedUpdateDriver as t };
