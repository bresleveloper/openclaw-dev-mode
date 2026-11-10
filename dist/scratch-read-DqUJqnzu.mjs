import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
//#region src/cron/scratch-read.ts
/** Keep first-use schema opening and the subsequent read on their existing workers. */
async function readCronScratchSnapshot(storePath, selector, options = {}, admission) {
	const context = admission?.context ?? captureOpenClawStateWorkerContext(options);
	const command = {
		type: "cron.scratch",
		storeKey: cronStoreKey(storePath),
		selector: { ...selector }
	};
	const callerCurrent = admission?.assertCurrent;
	const signal = admission?.signal;
	const assertCurrent = () => {
		signal?.throwIfAborted();
		context.admission.assertCurrent();
		callerCurrent?.();
		context.admission.assertCurrent();
	};
	assertCurrent();
	await runOpenClawStateWorkerOperation(context, async () => assertCurrent(), { assertCurrent });
	assertCurrent();
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, command, {
		context,
		current: true,
		signal
	});
	assertCurrent();
	if (!reply?.ok || reply.type !== command.type) throw new Error("Cron scratch read did not return its admitted snapshot");
	return reply.snapshot;
}
//#endregion
export { readCronScratchSnapshot as t };
