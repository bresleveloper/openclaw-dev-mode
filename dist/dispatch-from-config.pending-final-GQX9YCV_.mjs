import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-CVOwSXMV.mjs";
import { c as settlePendingFinalDelivery } from "./delivery-completion-DxLFTv-D.mjs";
//#region src/auto-reply/reply/dispatch-from-config.pending-final.ts
async function suppressPendingFinalDelivery(payload, options = {}) {
	const completion = payload ? getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion : void 0;
	if (completion) {
		await settlePendingFinalDelivery({
			kind: "pending-final",
			...completion
		}, "suppressed", ["prepared"], options);
		await clearPendingFinalDeliveryAfterSuccess(completion, options);
	}
}
async function clearPendingFinalDeliveryAfterSuccess(identity, options = {}) {
	if (!identity) return;
	await patchSessionEntryCore({
		agentId: identity.agentId,
		storePath: identity.storePath,
		sessionKey: identity.sessionKey
	}, (entry) => {
		const recoveryRunId = normalizeOptionalString(entry.restartRecoveryDeliveryRunId);
		const deliveries = entry.pendingFinalDelivery?.deliveries;
		if (entry.sessionId !== identity.sessionId || entry.pendingFinalDelivery?.intentId !== identity.intentId || !deliveries?.length || !deliveries.every(({ state }) => state === "delivered" || state === "suppressed") || recoveryRunId !== void 0 && recoveryRunId !== identity.recoveryRunId) return null;
		const endedAt = recoveryRunId === void 0 && (entry.restartRecoveryBeforeAgentReplyState === "handled-reply" || entry.restartRecoveryBeforeAgentReplyState === "handled-unrecoverable") ? Date.now() : void 0;
		return {
			...recoveryRunId ? buildRestartRecoveryClaimCleanupPatch({
				entry,
				recordTerminalSource: true
			}) : {
				restartRecoveryBeforeAgentReplyState: void 0,
				restartRecoverySourceIngress: void 0,
				restartRecoveryForceSafeTools: void 0
			},
			pendingFinalDelivery: void 0,
			...endedAt === void 0 ? {} : {
				abortedLastRun: false,
				endedAt,
				lifecycleRunId: void 0,
				runtimeMs: typeof entry.startedAt === "number" ? Math.max(0, endedAt - entry.startedAt) : void 0,
				status: "done"
			}
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		preserveActivity: options.preserveActivity
	});
}
//#endregion
export { suppressPendingFinalDelivery as n, clearPendingFinalDeliveryAfterSuccess as t };
