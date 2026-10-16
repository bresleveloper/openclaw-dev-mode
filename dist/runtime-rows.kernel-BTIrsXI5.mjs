import { h as updateCronRuntimeRow, n as deleteCronJobRowInDatabase, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-Dhn3MVqB.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-BU6jc44f.mjs";
//#region src/cron/store/runtime-rows.kernel.ts
/** The caller owns the transaction; target rows and their authority are reread under its write lock. */
function mutateCronRuntimeRowsInDatabase(params) {
	const { database: db, storeKey, jobIds } = params;
	const receiptSchema = prepareCronRunReceiptWriteSchema(db);
	const rows = loadCronRows(db, storeKey, jobIds, { includeGrantDefinitionProjection: true });
	const rowsByJobId = new Map(rows.map((row) => [row.job_id, row]));
	const loadedJobs = loadedCronStoreFromRows(rows).store.jobs;
	const { repairJobIds } = loadCronRuntimeAuthorities({
		db,
		storeKey,
		jobs: loadedJobs
	});
	if (repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
		db,
		storeKey,
		jobs: loadedJobs,
		jobIds: repairJobIds
	});
	const jobs = new Map(loadedJobs.map((job) => [job.id, job]));
	const previousEnabled = new Map(loadedJobs.map((job) => [job.id, job.enabled ?? true]));
	const mutation = params.mutate({
		database: db,
		jobs,
		receiptSchema
	});
	const upsertJobIds = [...new Set(mutation.upsertJobIds ?? [])].toSorted();
	const deleteJobIds = [...new Set(mutation.deleteJobIds ?? [])].toSorted();
	const runHooks = mutation.runHooks !== false;
	if (runHooks) params.transactionHooks?.beforeWrite?.(db, receiptSchema);
	for (const jobId of deleteJobIds) deleteCronJobRowInDatabase(db, storeKey, jobId);
	for (const jobId of upsertJobIds) {
		const row = rowsByJobId.get(jobId);
		const job = jobs.get(jobId);
		if (row && job && !deleteJobIds.includes(jobId)) updateCronRuntimeRow(db, storeKey, job, previousEnabled.get(jobId));
	}
	if (runHooks) params.transactionHooks?.afterWrite?.(db, receiptSchema);
	return {
		changed: upsertJobIds.length > 0 || deleteJobIds.length > 0,
		runHooks,
		value: mutation.value
	};
}
//#endregion
export { mutateCronRuntimeRowsInDatabase as t };
