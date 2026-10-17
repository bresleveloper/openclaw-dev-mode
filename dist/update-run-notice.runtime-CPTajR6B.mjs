import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { f as recordUpdateRunStep, p as recordUpdateRunVerification } from "./update-run-ledger-jBhhLo0P.mjs";
import { l as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DPQX-jTt.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import { c as findDeliveryIntentOwner } from "./delivery-queue-storage-CTPwC17-.mjs";
import { t as createDefaultDeps } from "./deps-CZ9MeDGs.mjs";
import { t as renderUpdateRunNotice } from "./update-run-notice-B3odEBec.mjs";
import { n as recordUpdateRunNoticeSkipped, o as sendGatewayLifecycleNotice, r as resolveUpdateRunNoticeTarget, t as authorizeUpdateRunNoticeTarget } from "./update-run-notice-target-LGaJRoCA.mjs";
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
		const message = renderUpdateRunNotice(run, kind);
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
