import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { r as UpdateRunRecordSchema } from "./update-run-schema-BIZkdmqf.mjs";
//#region src/infra/update-run-recovery-keys.ts
/** The exact private config_machine_state namespace; never SQL LIKE (case-folding). */
const UPDATE_RECOVERY_KEY_PREFIX = "update.recovery.";
const UPDATE_RECOVERY_KEY_END = "update.recovery/";
/**
* Row ownership only, NOT payload validity or mutation authority. Generic checkpoint
* merging must not revert these rows; fenced recovery carry-forward validates and
* replaces the entire owned projection from CURRENT state before sealing. Malformed
* keys/payloads in the namespace still belong here and must fail that validation.
* All other machine-state rows remain subject to normal preservation/conflict checks.
*/
//#endregion
//#region src/infra/update-run-read.kernel.ts
const JSON_FIELDS = [
	"origin",
	"target",
	"before",
	"after",
	"steps",
	"verification",
	"repair"
];
function decodeRun(row) {
	const metadata = Object.fromEntries(JSON_FIELDS.map((field) => [field, JSON.parse(row[`${field}_json`])]));
	return UpdateRunRecordSchema.parse({
		...metadata,
		runId: row.run_id,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms,
		trigger: row.trigger,
		phase: row.phase,
		status: row.status,
		reason: row.reason,
		confirmedAtMs: row.confirmed_at_ms,
		finishedAtMs: row.finished_at_ms,
		downtimeMs: row.downtime_ms
	});
}
function readUpdateRunRecord(db, runId) {
	const query = getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().where("run_id", "=", runId);
	const row = executeSqliteQueryTakeFirstSync(db, query);
	return row ? decodeRun(row) : void 0;
}
/** Read activity on the caller's connection so maintenance can fence its mutation. */
function readActiveUpdateRun(db) {
	return readUpdateRuns(db, {
		limit: 1,
		active: true
	})[0];
}
function readLatestUpdateRun(db) {
	return readUpdateRuns(db, { limit: 1 })[0];
}
/** A descriptor reserves its history for fenced recovery, even when its driver died.
* Presence is exclusion only: corrupt or older evidence never grants cleanup authority. */
function hasStoredUpdateRecovery(db, runId) {
	return tableExists(db, "config_machine_state") && Boolean(executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select("state_key").where("state_key", "=", "update.recovery." + runId)));
}
function readUpdateRuns(db, input) {
	if (!tableExists(db, "update_runs")) return [];
	let query = getNodeSqliteKysely(db).selectFrom("update_runs").selectAll();
	if (input.active) query = query.where("status", "=", "running");
	if (input.reason) query = query.where("reason", "=", input.reason);
	const excludeReason = input.excludeReason;
	if (excludeReason) query = query.where((eb) => eb.or([eb("reason", "is", null), eb("reason", "!=", excludeReason)]));
	const runs = executeSqliteQuerySync(db, query.orderBy("created_at_ms", "desc").orderBy("run_id", "desc").limit(Math.max(1, Math.min(100, Math.trunc(input.limit ?? 20))))).rows.map(decodeRun);
	if (input.includeRunId && !runs.some((run) => run.runId === input.includeRunId)) {
		const captured = readUpdateRunRecord(db, input.includeRunId);
		if (captured) runs.push(captured);
	}
	return runs;
}
//#endregion
export { readUpdateRunRecord as a, UPDATE_RECOVERY_KEY_PREFIX as c, readLatestUpdateRun as i, hasStoredUpdateRecovery as n, readUpdateRuns as o, readActiveUpdateRun as r, UPDATE_RECOVERY_KEY_END as s, decodeRun as t };
