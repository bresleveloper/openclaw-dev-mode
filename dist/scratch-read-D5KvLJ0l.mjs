import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
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
