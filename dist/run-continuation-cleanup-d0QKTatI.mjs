import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { T as parseCronRunScopeSuffix, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-GvNTkbe3.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { g as runExclusiveSessionLifecycleMutation, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BH4CIDLX.mjs";
import { c as hasPendingGeneratedMediaTaskForSessionKey } from "./media-generation-activity-JkwDNUkC.mjs";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-rherQwwt.mjs";
import { b as assertSubagentReadContext } from "./subagent-registry-state-CVSclnHX.mjs";
import { r as prepareCronDescendantDeletion } from "./run-subagent-registry.runtime-DUauyftb.mjs";
//#region src/cron/run-continuation-cleanup.ts
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
	const context = queueContext ?? captureOpenClawStateWorkerContext();
	const assertCurrent = () => assertSubagentReadContext(context);
	const agentId = resolveAgentIdFromSessionKey(sessionKey);
	const storePath = resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
		agentId,
		env: context.environment
	});
	const readEntry = () => withSessionEntryReadOnlyInWorker({
		agentId,
		sessionKey,
		storePath,
		env: context.environment,
		hydrateSkillPromptRefs: false
	}, assertCurrent, async (read) => {
		if (!read.ok) throw read.error;
		return read.value;
	});
	const original = await readEntry();
	if (!original || !canRemoveCronRunContinuation(original.cronRunContinuation)) return;
	await runExclusiveSessionLifecycleMutation("cron-cleanup", {
		scope: storePath,
		identities: [sessionKey, original.sessionId],
		run: async () => {
			if (isCompetingSessionWorkAdmissionActive(storePath, [sessionKey, original.sessionId])) return;
			const pendingSessionDeliveries = await loadPendingSessionDeliveries(context);
			if (hasPendingGeneratedMediaTaskForSessionKey(sessionKey) || pendingSessionDeliveries.some((entry) => entry.sessionKey === sessionKey && entry.id !== settledDeliveryId && entry.settlementOutcome === void 0 && entry.acknowledgedAt === void 0)) return;
			const descendants = await prepareCronDescendantDeletion([sessionKey]);
			try {
				assertCurrent();
				if (descendants.hasUnsettled(sessionKey)) return;
				const entry = await readEntry();
				if (!entry || entry.sessionId !== original.sessionId || entry.lifecycleRevision !== original.lifecycleRevision || !canRemoveCronRunContinuation(entry.cronRunContinuation)) return;
				await deleteSessionEntryLifecycle({
					descendantRunBasis: descendants.basis,
					agentId,
					commitGuard: () => {
						assertCurrent();
						if (descendants.hasUnsettled(sessionKey) || hasPendingGeneratedMediaTaskForSessionKey(sessionKey)) throw new Error("cron run continuation still has unsettled background work");
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
			} finally {
				descendants.dispose();
			}
		}
	});
}
//#endregion
export { removeCronRunContinuationSessionIfIdle as t };
