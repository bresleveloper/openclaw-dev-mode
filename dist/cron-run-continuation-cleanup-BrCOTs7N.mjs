import { C as parseCronRunScopeSuffix, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { r as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BcFZBpmo.mjs";
import { c as hasDescendantRunAwaitingSettle } from "./subagent-registry-read-C2SIiLpb.mjs";
import { a as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-BPrGRqBY.mjs";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-DSTuGS2l.mjs";
//#region src/tasks/cron-run-continuation-cleanup.ts
/** Removes an idle exact-run continuation through the session lifecycle owner. */
function canRemoveCronRunContinuation(marker) {
	if (!marker || marker.basePersisted !== true) return false;
	if (marker.phase === "ready") return !marker.ownerRunId;
	if (marker.phase !== "continuing" || !marker.ownerRunId) return false;
	const ownerLifecycleGeneration = marker.ownerLifecycleGeneration?.trim();
	return Boolean(ownerLifecycleGeneration && ownerLifecycleGeneration !== getAgentEventLifecycleGeneration());
}
async function removeCronRunContinuationSessionIfIdle(sessionKey, settledDeliveryId, queueContext) {
	if (!parseCronRunScopeSuffix(sessionKey).runId || hasPendingGeneratedMediaTaskForSessionKey(sessionKey)) return;
	const pendingSessionDeliveries = await loadPendingSessionDeliveries(queueContext ?? captureOpenClawStateWorkerContext());
	if (hasDescendantRunAwaitingSettle(sessionKey) || pendingSessionDeliveries.some((entry) => entry.sessionKey === sessionKey && entry.id !== settledDeliveryId && entry.settlementOutcome === void 0 && entry.acknowledgedAt === void 0)) return;
	const agentId = resolveAgentIdFromSessionKey(sessionKey);
	const cfg = getRuntimeConfig();
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const entry = loadSessionEntry({
		agentId,
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const marker = entry?.cronRunContinuation;
	if (!entry || !canRemoveCronRunContinuation(marker)) return;
	await deleteSessionEntryLifecycle({
		agentId,
		commitGuard: () => {
			if (hasDescendantRunAwaitingSettle(sessionKey)) throw new Error("cron run continuation still has unsettled subagents");
		},
		archiveTranscript: false,
		expectedEntry: entry,
		expectedLifecycleRevision: entry.lifecycleRevision,
		expectedSessionId: entry.sessionId,
		expectedUpdatedAt: entry.updatedAt,
		requireWriteSuccess: true,
		storePath,
		target: {
			canonicalKey: sessionKey,
			storeKeys: [sessionKey]
		}
	});
}
//#endregion
export { removeCronRunContinuationSessionIfIdle as t };
