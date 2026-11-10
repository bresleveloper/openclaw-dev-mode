import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { S as noteActiveCronJobMessageSourceAuthorityMutation, w as noteActiveCronJobScheduleMutation, x as noteActiveCronJobMessageActionAuthorityMutation, y as markCronJobActive } from "./active-jobs-CqHAjCGh.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { t as CronRunReceiptRevisionError } from "./run-receipt.types-B4cYMMc0.mjs";
import "./run-receipt-store-Bik3uOzB.mjs";
import { c as resolveCronJobMessageActionAuthorityInputs, l as resolveCronJobMessageToolAuthorityInputs } from "./jobs-tool-policy-BlxRC469.mjs";
import { g as runsDetachedFromMainSession } from "./timer-trigger-DkbJC_Jg.mjs";
//#region src/cron/service/run-receipts.ts
function resolveCronRunReceiptAgentId(state, job) {
	return resolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId);
}
/** Both admission paths bind message permissions from the same canonical occurrence. */
function markServiceCronJobActive(state, job, runReceipt) {
	const context = captureOpenClawStateWorkerContext();
	const assertOwner = () => {
		context.admission.assertCurrent();
		if (resolveCronRunReceiptAgentId(state, job) !== runReceipt.agentId || state.deps.isAgentAvailable?.(runReceipt.agentId, { deletionBlocked: false }) === false) throw new CronRunReceiptRevisionError(runReceipt.receiptId, "cron owner changed");
	};
	const isCurrent = () => {
		try {
			assertOwner();
			return true;
		} catch {
			return false;
		}
	};
	const marker = markCronJobActive(job.id, {
		agentId: runReceipt.agentId,
		stateIdentityKey: context.admission.identity.key,
		preserveAcrossGenerationAdvance: !runsDetachedFromMainSession(job),
		isMessageActionAuthorityCurrent: resolveCronJobMessageToolAuthorityInputs(job) ? isCurrent : void 0,
		isMessageSourceAuthorityCurrent: resolveCronJobMessageActionAuthorityInputs(job) ? isCurrent : void 0
	});
	if (marker) marker.standingGrantAuthority = {
		context,
		handle: { ...runReceipt },
		assertCurrent: assertOwner
	};
	return marker;
}
function publishCronRunReceiptMutation(params) {
	if (params.messageActionAuthorityChanged) noteActiveCronJobMessageActionAuthorityMutation(params.jobId);
	if (params.messageSourceAuthorityChanged) noteActiveCronJobMessageSourceAuthorityMutation(params.jobId);
	if (params.scheduleChanged) noteActiveCronJobScheduleMutation(params.jobId);
}
function resolveCronRunReceiptTerminalStatus(status, triggerFired) {
	if (status === "ok") return triggerFired === false ? "skipped" : "ok";
	return status === "skipped" ? "skipped" : "error";
}
//#endregion
export { publishCronRunReceiptMutation as n, resolveCronRunReceiptTerminalStatus as r, markServiceCronJobActive as t };
