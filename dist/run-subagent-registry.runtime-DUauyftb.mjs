import { d as collectSubagentSessionReadKeys } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { h as prepareSubagentRunsSnapshotForSessions, y as withSubagentRunReadSnapshot } from "./subagent-registry-state-CVSclnHX.mjs";
import { l as hasDescendantRunAwaitingSettleFromRuns, r as countActiveDescendantRunsFromRuns, u as listDescendantRunsForRequesterFromRuns } from "./subagent-registry-queries-rT6zMXb5.mjs";
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
	return {
		basis: prepared.basis,
		dispose: () => prepared.dispose(),
		hasUnsettled(sessionKey) {
			const current = prepared.consume((runs) => hasDescendantRunAwaitingSettleFromRuns(new Map(runs), sessionKey));
			if (!current.ready) throw new Error("Cron descendant state changed during deletion preparation");
			return current.value;
		}
	};
}
//#endregion
export { readDescendantExecutionState as i, listDescendantRunsForRequester as n, prepareCronDescendantDeletion as r, hasUnsettledCronDescendants as t };
