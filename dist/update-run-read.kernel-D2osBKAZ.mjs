import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { r as UpdateRunRecordSchema } from "./update-run-schema-DOichlUj.mjs";
import { n as LEGACY_UPDATE_RUN_EXPIRED_REASON } from "./update-run-legacy-expiry-BU1v4N5g.mjs";
import "./update-run-recovery-keys-CWZoJNcI.mjs";
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
	const record = UpdateRunRecordSchema.parse({
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
	if (record.origin.admission) record.admission = record.origin.admission;
	return record;
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
function readInterruptedUpdateCandidate(db) {
	const run = readLatestUpdateRun(db);
	return run && !hasStoredUpdateRecovery(db, run.runId) ? run : void 0;
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
function canReconcileUpdateRunCandidates(candidates, input) {
	return candidates.some(({ rule }) => rule && (!input.legacyOnly || rule === "legacy-driver-expired")) && !(input.explicit && candidates.some(({ record, rule }) => record.status === "running" && !rule));
}
function readUpdateRunStatusInDatabase(db) {
	return {
		activeRun: readActiveUpdateRun(db),
		lastRun: readLatestUpdateRun(db)
	};
}
function readUpdateRunHistoryStatusInDatabase(db) {
	return {
		activeRun: readActiveUpdateRun(db),
		lastRun: readUpdateRuns(db, {
			limit: 1,
			excludeReason: "dry-run"
		})[0],
		expiredRun: readUpdateRuns(db, {
			limit: 1,
			reason: LEGACY_UPDATE_RUN_EXPIRED_REASON
		})[0]
	};
}
//#endregion
export { readInterruptedUpdateCandidate as a, readUpdateRunRecord as c, readActiveUpdateRun as i, readUpdateRunStatusInDatabase as l, decodeRun as n, readLatestUpdateRun as o, hasStoredUpdateRecovery as r, readUpdateRunHistoryStatusInDatabase as s, canReconcileUpdateRunCandidates as t, readUpdateRuns as u };
