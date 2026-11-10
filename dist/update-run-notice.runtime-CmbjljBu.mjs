import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import "./config-B3oiWDlr.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { t as createDefaultDeps } from "./deps-CHvP-bJh.mjs";
import { o as recordUpdateRunStepAsync, s as recordUpdateRunVerificationAsync } from "./update-run-write.async-c2y7GgO-.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { c as findDeliveryIntentOwner } from "./delivery-queue-storage-B0ORUZO-.mjs";
import { t as renderUpdateRunNotice } from "./update-run-notice-vU_3JeGX.mjs";
import { n as recordUpdateRunNoticeSkipped, o as sendGatewayLifecycleNotice, r as resolveUpdateRunNoticeTarget, t as authorizeUpdateRunNoticeTarget } from "./update-run-notice-target-Ci_QteV_.mjs";
//#region src/gateway/update-run-notice.runtime.ts
const log = createSubsystemLogger("gateway/update-run");
/** Prepare routing before an update can replace lazily loaded channel modules. */
async function createUpdateRunNotifier(initial, getConfig = readRuntimeConfig, deps = createDefaultDeps(), target, context = captureDeliveryQueueStateContext()) {
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
		const message = renderUpdateRunNotice(run, kind);
		if (!message) return {
			delivered: false,
			owned: false
		};
		const cfg = getConfig();
		const currentTarget = authorizeUpdateRunNoticeTarget(cfg, noticeTarget);
		if (currentTarget.kind === "none") {
			await recordUpdateRunNoticeSkipped(run.runId, currentTarget.reason, env);
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
		if (delivered && kind === "finished") await recordUpdateRunVerificationAsync(run.runId, { noticeDelivered: true }, { env });
		const custody = currentTarget.kind === "route" ? await findDeliveryIntentOwner(deliveryIntentId, void 0, context) : null;
		const owned = delivered || custody?.status === "pending" || custody?.status === "completed";
		if (owned && kind !== "finished") await recordUpdateRunStepAsync(run.runId, {
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
