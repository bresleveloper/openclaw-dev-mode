import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import "./sqlite-transaction-DsZ3X6nD.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as getCronStoreKysely } from "./schema-DOrtVteD.mjs";
import "./row-codec-DgIrj0Uv.mjs";
import { n as assertCronJobScratchContent } from "./scratch-contract-B-Laspel.mjs";
import { t as captureCronMutationCommit } from "./mutation-completion-DRIubopj.mjs";
import { t as runCronRuntimeMutation } from "./runtime-mutation-CPS1DVrM.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import "./config-revision-DVuJ106z.mjs";
import { createHash } from "node:crypto";
//#region src/cron/scratch-read.kernel.ts
function rowToState(row) {
	if (row.content === null) return { currentRevision: row.revision };
	return {
		currentRevision: row.revision,
		scratch: {
			content: row.content,
			revision: row.revision,
			...row.source_sha256 ? { sourceSha256: row.source_sha256 } : {},
			updatedAtMs: row.updated_at_ms
		}
	};
}
function readScratchStateFromDatabase(db, storeKey, jobId) {
	const cronDb = getCronStoreKysely(db);
	const row = executeSqliteQuerySync(db, cronDb.selectFrom("cron_job_scratch").select([
		"content",
		"revision",
		"source_sha256",
		"updated_at_ms"
	]).where("store_key", "=", storeKey).where("job_id", "=", jobId)).rows[0];
	return row ? rowToState(row) : { currentRevision: 0 };
}
function readHeartbeatMonitorScratchFromDatabase(db, storeKey, agentId) {
	const cronDb = getCronStoreKysely(db);
	const row = executeSqliteQuerySync(db, cronDb.selectFrom("cron_jobs").leftJoin("cron_job_scratch", (join) => join.onRef("cron_job_scratch.store_key", "=", "cron_jobs.store_key").onRef("cron_job_scratch.job_id", "=", "cron_jobs.job_id")).select([
		"cron_jobs.job_id as job_id",
		"cron_job_scratch.content as content",
		"cron_job_scratch.revision as revision",
		"cron_job_scratch.source_sha256 as source_sha256",
		"cron_job_scratch.updated_at_ms as updated_at_ms"
	]).where("cron_jobs.store_key", "=", storeKey).where("cron_jobs.declaration_key", "=", `heartbeat:${agentId}`).where("cron_jobs.payload_kind", "=", "heartbeat")).rows[0];
	if (!row) return;
	if (row.revision === null || row.updated_at_ms === null) return {
		jobId: row.job_id,
		state: { currentRevision: 0 }
	};
	return {
		jobId: row.job_id,
		state: rowToState({
			content: row.content,
			revision: row.revision,
			source_sha256: row.source_sha256,
			updated_at_ms: row.updated_at_ms
		})
	};
}
//#endregion
//#region src/cron/scratch-store.ts
/** Database-backed per-job scratch storage, kept outside public cron job state. */
/** Doctor's synchronous transaction reads stay with the maintenance owner. */
function readCronJobScratchState(storePath, jobId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	return readScratchStateFromDatabase(db, cronStoreKey(storePath), jobId);
}
function readHeartbeatMonitorScratch(storePath, agentId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	return readHeartbeatMonitorScratchFromDatabase(db, cronStoreKey(storePath), agentId);
}
/** Doctor inventory does not create or migrate its inspected source. */
function readHeartbeatMonitorScratchReadOnly(storePath, agentId, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readHeartbeatMonitorScratchFromDatabase(db, cronStoreKey(storePath), agentId), options);
}
/** Writes through the existing actor while retaining the original caller's admission. */
async function writeCronJobScratch(params, admission) {
	if (params.content !== null) assertCronJobScratchContent(params.content);
	const context = admission?.context ?? captureOpenClawStateWorkerContext(params.options);
	const markCommitted = captureCronMutationCommit("cron.scratch.set");
	let result;
	await runCronRuntimeMutation({
		context,
		type: "cron.writeScratch",
		input: {
			storeKey: cronStoreKey(params.storePath),
			jobId: params.jobId,
			content: params.content,
			expectedRevision: params.expectedRevision,
			sourceSha256: params.sourceSha256,
			nowMs: params.nowMs ?? Date.now(),
			createdAtMsFallback: admission?.createdAtMsFallback
		},
		assertCurrent: () => admission?.assertCurrent?.(),
		prepare({ configRevision }) {
			const assertCurrent = () => {
				admission?.assertCurrent?.();
				admission?.assertJobCurrent?.(configRevision);
			};
			assertCurrent();
			return {
				value: {},
				assertCurrent
			};
		},
		publish(outcome) {
			result = outcome.result;
			if (outcome.written) markCommitted?.();
		}
	});
	if (!result) throw new Error("Cron scratch write has no committed result");
	return result;
}
/**
* Deletes scratch when its owning job is removed, or — with expectedRevision —
* atomically reverts a migration write back to the no-row state. Returns false
* when the guarded revision moved.
*/
function deleteCronJobScratch(storePath, jobId, options = {}, guard) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const storeKey = cronStoreKey(storePath);
		const cronDb = getCronStoreKysely(db);
		if (guard) {
			if ((executeSqliteQuerySync(db, cronDb.selectFrom("cron_job_scratch").select(["revision", "updated_at_ms"]).where("store_key", "=", storeKey).where("job_id", "=", jobId)).rows[0]?.revision ?? 0) !== guard.expectedRevision) return false;
		}
		executeSqliteQuerySync(db, cronDb.deleteFrom("cron_job_scratch").where("store_key", "=", storeKey).where("job_id", "=", jobId));
		return true;
	}, options, { operationLabel: "cron.scratch.delete" });
}
/** Hash used by doctor to prove the file it removes is the file it migrated. */
function hashCronScratchSource(content) {
	return createHash("sha256").update(content, "utf8").digest("hex");
}
//#endregion
export { readHeartbeatMonitorScratchReadOnly as a, readHeartbeatMonitorScratch as i, hashCronScratchSource as n, writeCronJobScratch as o, readCronJobScratchState as r, deleteCronJobScratch as t };
