import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
//#region src/cron/agent-availability.ts
/** Deletion owns this refusal; monitor reconciliation may retry after rollback. */
var CronAgentDeletionBlockedError = class extends Error {
	constructor(agentId) {
		super(describeUnavailableCronAgent(agentId));
		this.name = "CronAgentDeletionBlockedError";
	}
};
function isCronAgentDeletionBlockedError(error) {
	return error instanceof Error && error.name === "CronAgentDeletionBlockedError";
}
function describeUnavailableCronAgent(agentId, env) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId, { env });
	return refusal ? `${refusal.reason}\n${refusal.repairHint}` : `cron job agent is unavailable: ${agentId}`;
}
//#endregion
export { describeUnavailableCronAgent as n, isCronAgentDeletionBlockedError as r, CronAgentDeletionBlockedError as t };
