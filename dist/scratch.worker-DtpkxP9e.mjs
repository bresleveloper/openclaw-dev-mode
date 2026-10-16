import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { n as writeCronJobScratchInDatabase } from "./scratch-write.kernel-zDV2XcUZ.mjs";
import { n as prepareCronRuntimeMutation, r as retainCronRuntimeMutationOutcome } from "./runtime-mutation.worker-Cxvhz87W.mjs";
//#region src/cron/store/scratch.worker.ts
function writeCronScratchInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const job = loadedCronStoreFromRows(loadCronRows(db, input.storeKey, /* @__PURE__ */ new Set([input.jobId])), input.createdAtMsFallback).store.jobs[0];
		prepareCronRuntimeMutation("cron.writeScratch", input.nonce, { configRevision: job ? resolveCronJobConfigRevision(job) : void 0 });
		const outcome = writeCronJobScratchInDatabase(db, input);
		return retainCronRuntimeMutationOutcome("cron.writeScratch", db, input.nonce, outcome);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.scratch.write" });
}
//#endregion
export { writeCronScratchInWorker };
