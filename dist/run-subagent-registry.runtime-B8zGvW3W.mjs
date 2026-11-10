import { n as collectSubagentSessionReadKeys } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { E as countActiveDescendantRunsFromRuns, M as listDescendantRunsForRequesterFromRuns, b as withSubagentRunReadSnapshot, g as prepareSubagentRunsSnapshotForSessions, j as hasDescendantRunAwaitingSettleFromRuns } from "./subagent-registry-state-DBdy-FdI.mjs";
//#region src/cron/isolated-agent/run-subagent-registry.runtime.ts
function withCronDescendantRuns(sessionKey, consume) {
	return withSubagentRunReadSnapshot(subagentRuns, (snapshot) => {
		const sessionKeys = collectSubagentSessionReadKeys([sessionKey], snapshot.values());
		return {
			runIds: [...snapshot.values()].filter((entry) => sessionKeys.has(entry.childSessionKey.trim())).map((entry) => entry.runId),
			sessionKeys: []
		};
	}, (_selection, runs) => consume(new Map(runs)), {
		sessionKeys: [sessionKey],
		descendants: true
	});
}
function readDescendantExecutionState(sessionKey, runStartedAt) {
	return withCronDescendantRuns(sessionKey, (runs) => ({
		hasFreshDescendants: listDescendantRunsForRequesterFromRuns(runs, sessionKey).some((entry) => {
			const descendantStartedAt = typeof entry.execution.startedAt === "number" ? entry.execution.startedAt : entry.createdAt;
			return typeof descendantStartedAt === "number" && descendantStartedAt >= runStartedAt;
		}),
		hasActiveDescendants: countActiveDescendantRunsFromRuns(runs, sessionKey) > 0
	}));
}
function listDescendantRunsForRequester(sessionKey) {
	return withCronDescendantRuns(sessionKey, (runs) => listDescendantRunsForRequesterFromRuns(runs, sessionKey));
}
function hasUnsettledCronDescendants(sessionKey) {
	return withCronDescendantRuns(sessionKey, (runs) => hasDescendantRunAwaitingSettleFromRuns(runs, sessionKey));
}
/** Retain live parent policy alongside the worker's durable deletion comparison. */
async function prepareCronDescendantDeletion(sessionKeys) {
	const prepared = await prepareSubagentRunsSnapshotForSessions(subagentRuns, sessionKeys);
	return { hasUnsettled(sessionKey) {
		const current = prepared.consume((runs) => hasDescendantRunAwaitingSettleFromRuns(new Map(runs), sessionKey));
		if (!current.ready) throw new Error("Cron descendant state changed during deletion preparation");
		return current.value;
	} };
}
//#endregion
export { readDescendantExecutionState as i, listDescendantRunsForRequester as n, prepareCronDescendantDeletion as r, hasUnsettledCronDescendants as t };
