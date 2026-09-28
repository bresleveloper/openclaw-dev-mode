import { c as prepareSqliteQueryTakeFirstSync, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as getCronStoreKysely } from "./schema-BUdLKyI9.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as captureCronMutationCommit } from "./mutation-completion-BHiX066E.mjs";
import { n as assertCronJobScratchContent } from "./scratch-contract-B-Laspel.mjs";
import { createHash } from "node:crypto";
//#region src/cron/scratch-store.ts
/** Database-backed per-job scratch storage, kept outside public cron job state. */
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
/** Reads one job's scratch state without exposing it through cron list/history surfaces. */
function readCronJobScratchState(storePath, jobId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	return readScratchStateFromDatabase(db, cronStoreKey(storePath), jobId);
}
function readHeartbeatMonitorScratchFromDatabase(db, storePath, agentId) {
	const storeKey = cronStoreKey(storePath);
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
/** Resolves the current heartbeat monitor and its scratch with one narrow SQLite query. */
function readHeartbeatMonitorScratch(storePath, agentId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	return readHeartbeatMonitorScratchFromDatabase(db, storePath, agentId);
}
/** Reads heartbeat scratch from existing shared state without creating or migrating it. */
function readHeartbeatMonitorScratchReadOnly(storePath, agentId, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readHeartbeatMonitorScratchFromDatabase(db, storePath, agentId), options);
}
function prepareScratchWriteGuard(db) {
	const cronDb = getCronStoreKysely(db);
	return prepareSqliteQueryTakeFirstSync(db, (parameter) => cronDb.selectFrom(cronDb.selectNoFrom((eb) => eb.lit(1).as("one")).as("current")).leftJoin("cron_job_scratch as scratch", (join) => join.on("scratch.store_key", "=", parameter((key) => key.storeKey)).on("scratch.job_id", "=", parameter((key) => key.jobId))).leftJoin("cron_jobs as job", (join) => join.on("job.store_key", "=", parameter((key) => key.storeKey)).on("job.job_id", "=", parameter((key) => key.jobId))).select([
		"scratch.revision",
		"scratch.updated_at_ms",
		"job.job_id"
	]));
}
const scratchWriteGuards = /* @__PURE__ */ new WeakMap();
/** Writes, clears, or compare-and-swaps one scratch row. */
function writeCronJobScratch(params) {
	if (params.content !== null) assertCronJobScratchContent(params.content);
	const storeKey = cronStoreKey(params.storePath);
	const nowMs = params.nowMs ?? Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const cronDb = getCronStoreKysely(db);
		let readGuard = scratchWriteGuards.get(db);
		if (!readGuard) {
			readGuard = prepareScratchWriteGuard(db);
			scratchWriteGuards.set(db, readGuard);
		}
		const current = readGuard({
			storeKey,
			jobId: params.jobId
		});
		const currentRevision = current?.revision ?? 0;
		if (current?.job_id == null || params.expectedRevision !== void 0 && params.expectedRevision !== currentRevision) return {
			ok: false,
			reason: "revision-conflict",
			currentRevision
		};
		if (params.content === null && currentRevision === 0) return {
			ok: true,
			currentRevision
		};
		const revision = currentRevision + 1;
		const sourceSha256 = params.content !== null ? params.sourceSha256?.trim() : void 0;
		if (currentRevision > 0) executeSqliteQuerySync(db, cronDb.deleteFrom("cron_job_scratch").where("store_key", "=", storeKey).where("job_id", "=", params.jobId));
		executeSqliteQuerySync(db, cronDb.insertInto("cron_job_scratch").values({
			store_key: storeKey,
			job_id: params.jobId,
			content: params.content,
			revision,
			...sourceSha256 ? { source_sha256: sourceSha256 } : {},
			updated_at_ms: nowMs
		}));
		const committed = captureCronMutationCommit("cron.scratch.set");
		if (committed) deferSqlitePostCommitPublication(db, committed);
		if (params.content === null) return {
			ok: true,
			currentRevision: revision
		};
		return {
			ok: true,
			currentRevision: revision,
			scratch: {
				content: params.content,
				revision,
				...sourceSha256 ? { sourceSha256 } : {},
				updatedAtMs: nowMs
			}
		};
	}, params.options, { operationLabel: "cron.scratch.write" });
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
