import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as ABANDONED_UPDATE_RUN_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { a as withArtifactPreservingStateReads, c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-B5xSBZMw.mjs";
import { n as inspectUpdateRunAbandonment } from "./update-run-activity-C0Hu53Kb.mjs";
import { a as readUpdateRunRecord, i as readLatestUpdateRun, n as hasStoredUpdateRecovery, o as readUpdateRuns, r as readActiveUpdateRun, t as decodeRun } from "./update-run-read.kernel-Blv-D7Xz.mjs";
//#region src/infra/update-run-reader.ts
function getUpdateRun(runId, options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => tableExists(db, "update_runs") ? readUpdateRunRecord(db, runId) : void 0, options);
}
function findActiveUpdateRun(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readActiveUpdateRun(db), options);
}
/** Previews and acknowledged abandonment cannot replace failure or completion evidence. */
function readUpdateRunResolutionHistory(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		if (!tableExists(db, "update_runs")) return {};
		const latest = (failedOnly) => {
			const query = getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().where("status", failedOnly ? "=" : "!=", failedOnly ? "failed" : "skipped").orderBy("created_at_ms", "desc").orderBy("run_id", "desc");
			for (const row of iterateSqliteQuerySync(db, query)) {
				const run = decodeRun(row);
				if (!isAcknowledgedAbandonedUpdateRun(run)) return run;
			}
		};
		return {
			failure: latest(true),
			outcome: latest(false)
		};
	}, options) ?? {};
}
async function getUpdateRunAsync(runId, options = {}) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, {
		type: "updateRuns.get",
		runId
	}));
	if (!reply) return;
	if (!reply.ok || reply.type !== "updateRuns.get") throw new Error("Unexpected update run lookup result");
	return reply.run;
}
function listUpdateRuns(input = {}, options = {}, openStateSchemaReadAdmission) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readUpdateRuns(db, input), options, openStateSchemaReadAdmission) ?? [];
}
/** The fixed two-row status projection reuses the live owner; cold reads prepare one snapshot. */
async function getUpdateRunStatusAsync(options = {}) {
	return await withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(({ db }) => ({
		activeRun: readActiveUpdateRun(db),
		lastRun: readLatestUpdateRun(db)
	}), options) ?? {};
}
/** Doctor retains its maintenance owner while the worker reads the private snapshot. */
async function listUpdateRunsAsync(input = {}, options = {}) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, {
		type: "updateRuns.list",
		input: { ...input }
	}));
	if (!reply) return [];
	if (!reply.ok || reply.type !== "updateRuns.list") throw new Error("Unexpected update run list result");
	return reply.runs;
}
/** Only a later recorded fetch completion clears an updater fetch failure. */
function getLatestUpdateFetchFailure(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		if (!tableExists(db, "update_runs")) return;
		const query = getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().orderBy("created_at_ms", "desc").orderBy("run_id", "desc");
		let latestAtMs = -Infinity;
		let latestFailure;
		for (const row of iterateSqliteQuerySync(db, query)) {
			const run = decodeRun(row);
			const fetchSteps = run.steps.filter(({ step }) => /^git (?:fetch(?:\s|$)|target inspection fetch$)/u.test(step) || step === "git import admitted target");
			const failed = fetchSteps.findLast((step) => step.status === "failed");
			if (run.reason === "fetch-failed" || failed) {
				const failedAtMs = failed?.endedAtMs ?? run.finishedAtMs ?? run.updatedAtMs;
				if (failedAtMs < latestAtMs) continue;
				const detail = failed?.detail ?? "";
				latestAtMs = failedAtMs;
				latestFailure = {
					reason: "fetch-failed",
					failedAtMs,
					detail: /would clobber existing tag/iu.test(detail) ? "tag conflict" : /authentication|permission denied|could not read Username|access denied/iu.test(detail) ? "authentication failed" : /resolve host|network|timed? out|timeout|unreachable/iu.test(detail) ? "network error" : "fetch-failed",
					runId: run.runId
				};
			} else for (const step of fetchSteps) {
				if (step.status !== "completed" || step.endedAtMs === void 0) continue;
				const completedAtMs = step.endedAtMs;
				if (completedAtMs > latestAtMs) {
					latestAtMs = completedAtMs;
					latestFailure = void 0;
				}
			}
		}
		return latestFailure;
	}, options);
}
function inspectUpdateRunReconciliation(db, record, input) {
	return {
		record,
		rule: hasStoredUpdateRecovery(db, record.runId) ? void 0 : inspectUpdateRunAbandonment(record, input)
	};
}
function readUpdateRunReconciliationCandidates(db, input) {
	if (!tableExists(db, "update_runs")) return [];
	let query = getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().where("status", "=", "running");
	if (!input.explicit) query = query.where("updated_at_ms", "<", Date.now() - ABANDONED_UPDATE_RUN_MS);
	if (input.runIds) query = query.where("run_id", "in", [...input.runIds]);
	return executeSqliteQuerySync(db, query.orderBy("run_id")).rows.map((row) => inspectUpdateRunReconciliation(db, decodeRun(row), input));
}
//#endregion
export { getUpdateRunStatusAsync as a, listUpdateRunsAsync as c, getUpdateRunAsync as i, readUpdateRunReconciliationCandidates as l, getLatestUpdateFetchFailure as n, inspectUpdateRunReconciliation as o, getUpdateRun as r, listUpdateRuns as s, findActiveUpdateRun as t, readUpdateRunResolutionHistory as u };
