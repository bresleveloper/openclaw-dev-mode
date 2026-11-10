import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { t as CronJobsStoreChangedError } from "./save-error-BrzBbDk8.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { n as writeCronJobScratchInDatabase } from "./scratch-write.kernel-Ddtd-SDk.mjs";
//#region src/cron/store/scratch.worker.ts
function writeCronScratchInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const job = loadedCronStoreFromRows(loadCronRows(db, input.storeKey, /* @__PURE__ */ new Set([input.jobId])), input.createdAtMsFallback).store.jobs[0];
		if (input.snapshot.expectedConfigRevision !== void 0 && (!job || resolveCronJobConfigRevision(job) !== input.snapshot.expectedConfigRevision)) throw new CronJobsStoreChangedError(input.storeKey);
		return { outcome: writeCronJobScratchInDatabase(db, input) };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.scratch.write" });
}
//#endregion
export { writeCronScratchInWorker };
