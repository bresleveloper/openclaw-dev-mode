import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { g as recordUpdateRunVerification, h as recordUpdateRunStep } from "./update-run-ledger-CwAEg-5V.mjs";
import { l as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-MlBhwaKa.mjs";
import { i as renderUpdateRunNotice } from "./update-run-report-Dh57tzMI.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DgtCkbrJ.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import { c as findDeliveryIntentOwner } from "./delivery-queue-storage-Cpr0qrGT.mjs";
import { t as createDefaultDeps } from "./deps-BNm1BD0Q.mjs";
import { t as readUpdateRunReportHealth } from "./update-run-report-health-CZRthy8u.mjs";
import { n as recordUpdateRunNoticeSkipped, o as sendGatewayLifecycleNotice, r as resolveUpdateRunNoticeTarget, t as authorizeUpdateRunNoticeTarget } from "./update-run-notice-target-Bb9RsWTe.mjs";
//#region src/gateway/update-run-notice.runtime.ts
const log = createSubsystemLogger("gateway/update-run");
/** Prepare routing before an update can replace lazily loaded channel modules. */
async function createUpdateRunNotifier(initial, getConfig = getRuntimeConfig, deps = createDefaultDeps(), target, context = captureDeliveryQueueStateContext()) {
	const env = context.workerContext.environment;
	const noticeTarget = target ?? await resolveUpdateRunNoticeTarget({
		cfg: getConfig(),
		sessionKey: initial.origin.sessionKey,
		explicitDeliveryContext: initial.origin.deliveryContext,
		threadId: initial.origin.deliveryContext?.threadId,
		env
	});
	const { sessionKey } = initial.origin;
	return (run, kind) => runWithoutOwnedSessionTranscriptWrites(async () => {
		const milestone = kind === "parking" ? "activating" : kind;
		const recorded = kind === "finished" ? run.verification.noticeDelivered === true : run.steps.some((step) => step.step === `notice:${milestone}` && step.status === "completed");
		if (recorded) return {
			delivered: false,
			owned: recorded
		};
		const message = renderUpdateRunNotice(run, kind, kind === "finished" && run.status === "failed" ? { currentHealth: await readUpdateRunReportHealth(run.verification, { env: resolveDeliveryQueueStateEnv(void 0, context) }) } : {});
		if (!message) return {
			delivered: false,
			owned: false
		};
		const cfg = getConfig();
		const currentTarget = authorizeUpdateRunNoticeTarget(cfg, noticeTarget);
		if (currentTarget.kind === "none") {
			recordUpdateRunNoticeSkipped(run.runId, currentTarget.reason, env);
			return {
				delivered: false,
				owned: false
			};
		}
		const deliveryIntentId = `update-run-${milestone}:${run.runId}`;
		let delivered;
		if (currentTarget.kind === "route") delivered = await sendGatewayLifecycleNotice({
			...currentTarget.route,
			cfg,
			deps,
			sessionKey,
			message,
			deliveryIntentId
		}, context);
		else {
			const internal = currentTarget.session;
			const notice = await appendAssistantMessageToSessionTranscript({
				agentId: internal.agentId,
				sessionKey: internal.canonicalKey,
				expectedSessionId: internal.entry.sessionId,
				expectedLifecycleRevision: internal.entry.lifecycleRevision ?? null,
				storePath: internal.storePath,
				text: message,
				idempotencyKey: deliveryIntentId
			}).catch((error) => ({
				ok: false,
				reason: formatErrorMessage(error)
			}));
			delivered = notice.ok;
			if (!notice.ok) log.warn(`update run notice append failed: ${notice.reason}`);
		}
		if (delivered && kind === "finished") recordUpdateRunVerification(run.runId, { noticeDelivered: true }, { env });
		const custody = currentTarget.kind === "route" ? await findDeliveryIntentOwner(deliveryIntentId, void 0, context) : null;
		const owned = delivered || custody?.status === "pending" || custody?.status === "completed";
		if (owned && kind !== "finished") recordUpdateRunStep(run.runId, {
			step: `notice:${milestone}`,
			status: "completed",
			endedAtMs: Date.now()
		}, { env });
		return {
			delivered,
			owned
		};
	});
}
async function notifyUpdateRunPhase(run) {
	if (run.phase === "activating" || run.phase === "finished") await (await createUpdateRunNotifier(run))(run, run.phase);
}
//#endregion
export { createUpdateRunNotifier, notifyUpdateRunPhase };
