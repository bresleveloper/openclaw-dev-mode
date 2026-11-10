import { a as sessionChanges, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import { c as listPendingAgentDeletionJournalsAsync } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { s as publishAgentDeletionWorkAdmission } from "./session-agent-work-admission-D63nonbM.mjs";
import { r as deleteGatewayAgent } from "./agents-delete-BA_fWU_B.mjs";
//#region src/gateway/server-agent-deletion-recovery.ts
async function restorePendingDeletionFences() {
	let changed;
	const unsubscribe = sessionChanges.subscribeFacts((change) => {
		if (isSessionStoreTopologyChange(change)) changed = true;
	});
	try {
		for (;;) {
			changed = false;
			const pending = await listPendingAgentDeletionJournalsAsync();
			if (changed) continue;
			for (const journal of pending.entries) publishAgentDeletionWorkAdmission({ agentId: journal.agentId }, journal.operationId, true);
			return pending;
		}
	} finally {
		unsubscribe();
	}
}
/** Restart resumes the durable intent through the same owner as agents.delete. */
async function resumeAgentDeletions(context, signal) {
	const { entries, manualClawAgentIds } = await restorePendingDeletionFences();
	for (const agentId of manualClawAgentIds) context.logGateway.warn(`Claw ${agentId} removal remains pending; retry its Claw removal plan.`);
	for (const journal of entries) {
		if (signal?.aborted) return;
		try {
			const result = await deleteGatewayAgent(journal.agentId, journal.deleteFiles, context, { recoveryOperationId: journal.operationId });
			if (result.purgeFailed || result.failed?.length) context.logGateway.warn(`Agent ${journal.agentId} deletion cleanup remains pending.`);
		} catch (error) {
			context.logGateway.warn(`Agent ${journal.agentId} deletion recovery failed: ${String(error)}`);
		}
	}
}
//#endregion
export { resumeAgentDeletions };
