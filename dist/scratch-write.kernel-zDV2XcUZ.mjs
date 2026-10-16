import { l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as getCronStoreKysely } from "./schema-DOrtVteD.mjs";
import { n as assertCronJobScratchContent } from "./scratch-contract-B-Laspel.mjs";
import { t as captureCronMutationCommit } from "./mutation-completion-DRIubopj.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
//#region src/cron/scratch-write.kernel.ts
function prepareScratchWriteGuard(db) {
	const cronDb = getCronStoreKysely(db);
	return prepareSqliteQueryTakeFirstSync(db, (parameter) => cronDb.selectFrom(cronDb.selectNoFrom((eb) => eb.lit(1).as("one")).as("current")).leftJoin("cron_job_scratch as scratch", (join) => join.on("scratch.store_key", "=", parameter((key) => key.storeKey)).on("scratch.job_id", "=", parameter((key) => key.jobId))).leftJoin("cron_jobs as job", (join) => join.on("job.store_key", "=", parameter((key) => key.storeKey)).on("job.job_id", "=", parameter((key) => key.jobId))).select([
		"scratch.revision",
		"scratch.updated_at_ms",
		"job.job_id"
	]));
}
const scratchWriteGuard = createSqliteQueryCache(prepareScratchWriteGuard);
/** Job existence and scratch revision remain one authoritative transaction boundary. */
function writeCronJobScratchInDatabase(db, input) {
	if (input.content !== null) assertCronJobScratchContent(input.content);
	const cronDb = getCronStoreKysely(db);
	const current = scratchWriteGuard(db)(input);
	const currentRevision = current?.revision ?? 0;
	if (current?.job_id == null || input.expectedRevision !== void 0 && input.expectedRevision !== currentRevision) return {
		result: {
			ok: false,
			reason: "revision-conflict",
			currentRevision
		},
		written: false
	};
	if (input.content === null && currentRevision === 0) return {
		result: {
			ok: true,
			currentRevision
		},
		written: false
	};
	const revision = currentRevision + 1;
	const sourceSha256 = input.content !== null ? input.sourceSha256?.trim() : void 0;
	if (currentRevision > 0) executeSqliteQuerySync(db, cronDb.deleteFrom("cron_job_scratch").where("store_key", "=", input.storeKey).where("job_id", "=", input.jobId));
	executeSqliteQuerySync(db, cronDb.insertInto("cron_job_scratch").values({
		store_key: input.storeKey,
		job_id: input.jobId,
		content: input.content,
		revision,
		...sourceSha256 ? { source_sha256: sourceSha256 } : {},
		updated_at_ms: input.nowMs
	}));
	return {
		written: true,
		result: {
			ok: true,
			currentRevision: revision,
			...input.content !== null ? { scratch: {
				content: input.content,
				revision,
				...sourceSha256 ? { sourceSha256 } : {},
				updatedAtMs: input.nowMs
			} } : {}
		}
	};
}
/** Doctor retains its synchronous migration and compensation transaction owner. */
function writeCronJobScratchForMaintenance(params) {
	if (params.content !== null) assertCronJobScratchContent(params.content);
	const input = {
		storeKey: cronStoreKey(params.storePath),
		jobId: params.jobId,
		content: params.content,
		expectedRevision: params.expectedRevision,
		sourceSha256: params.sourceSha256,
		nowMs: params.nowMs ?? Date.now()
	};
	const markCommitted = captureCronMutationCommit("cron.scratch.set");
	return runOpenClawStateWriteTransaction(({ db }) => {
		const outcome = writeCronJobScratchInDatabase(db, input);
		if (outcome.written && markCommitted) deferSqlitePostCommitPublication(db, markCommitted);
		return outcome.result;
	}, params.options, { operationLabel: "cron.scratch.write" });
}
//#endregion
export { writeCronJobScratchInDatabase as n, writeCronJobScratchForMaintenance as t };
