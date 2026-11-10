import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { _ as listActiveCronJobIds } from "./active-jobs-CqHAjCGh.mjs";
import { g as runCronRuntimeMutation } from "./store-HF7PvtRl.mjs";
//#region src/cron/store/run-history.ts
async function maintainCronRunHistory(context, assertCurrent) {
	let nextSweepAtMs = null;
	await runCronRuntimeMutation({
		context,
		type: "cron.maintainHistory",
		input: {},
		assertCurrent,
		snapshot: {
			nowMs: Date.now(),
			protectedJobIds: listActiveCronJobIds()
		},
		publish(outcome) {
			nextSweepAtMs = outcome.nextSweepAtMs;
		}
	});
	return { nextSweepAtMs };
}
async function recordCronRun(input, source) {
	const context = source?.context ?? captureOpenClawStateWorkerContext();
	const captured = structuredClone(input);
	const assertCurrent = () => {
		context.admission.assertCurrent();
	};
	await runOpenClawStateWorkerOperation(context, (scope) => {
		assertCurrent();
		return scope.execute({
			type: "cron.recordRun",
			input: captured
		});
	}, { assertCurrent });
}
//#endregion
export { recordCronRun as n, maintainCronRunHistory as t };
