import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { p as isCronJobActive } from "./active-jobs-BS2UT6i2.mjs";
import { t as runCronRuntimeMutation } from "./runtime-mutation-CPS1DVrM.mjs";
import { _ as isCronRunReceiptOwnerStale } from "./run-receipt-store-BI8RC7qi.mjs";
//#region src/cron/store/run-history.ts
async function maintainCronRunHistory(context, assertCurrent) {
	await runCronRuntimeMutation({
		context,
		type: "cron.maintainHistory",
		input: {},
		assertCurrent,
		prepare({ jobIds, receipts }) {
			const protectedJobs = () => /* @__PURE__ */ new Set([...jobIds.filter(isCronJobActive), ...receipts.filter((receipt) => !isCronRunReceiptOwnerStale(receipt, Date.now())).map((receipt) => receipt.jobId)]);
			const protectedJobIds = protectedJobs();
			return {
				value: {
					nowMs: Date.now(),
					protectedJobIds: [...protectedJobIds]
				},
				assertCurrent() {
					assertCurrent();
					const current = protectedJobs();
					if (current.size !== protectedJobIds.size || [...current].some((id) => !protectedJobIds.has(id))) throw new Error("Cron history backing ownership changed before commit");
				}
			};
		},
		publish() {}
	});
}
async function recordCronRun(input, source) {
	const context = source?.context ?? captureOpenClawStateWorkerContext();
	const captured = structuredClone(input);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		source?.assertCurrent();
	};
	await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "cron.recordRun",
		input: captured
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
export { recordCronRun as n, maintainCronRunHistory as t };
