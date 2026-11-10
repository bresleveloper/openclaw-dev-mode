import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { d as getAgentEventLifecycleGeneration } from "./agent-events-Bf3Js0D3.mjs";
import { T as parseCronRunScopeSuffix, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { S as runExclusiveSessionLifecycleMutation, v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./config-B3oiWDlr.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import { x as assertSubagentReadContext } from "./subagent-registry-state-DBdy-FdI.mjs";
import { l as hasPendingGeneratedMediaTaskForSessionKey } from "./media-generation-activity-CdYWMYrm.mjs";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-BfVLAorZ.mjs";
import { r as prepareCronDescendantDeletion } from "./run-subagent-registry.runtime-B8zGvW3W.mjs";
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
	const storePath = resolveSessionStorePathCore(readRuntimeConfig().session?.store, {
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
			assertCurrent();
			if (descendants.hasUnsettled(sessionKey)) return;
			const entry = await readEntry();
			if (!entry || entry.sessionId !== original.sessionId || entry.lifecycleRevision !== original.lifecycleRevision || !canRemoveCronRunContinuation(entry.cronRunContinuation)) return;
			await deleteSessionEntryLifecycle({
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
		}
	});
}
//#endregion
export { removeCronRunContinuationSessionIfIdle as t };
