import { c as execRequestMatches, l as readExecRequestOwners, r as cancelExecRequestOwners, t as activeExecRequestOwners } from "./exec-request-context-CWnK9ayt.mjs";
import { h as peekExecRequestSystemEventEntries, r as consumeSelectedSystemEventEntries } from "./system-events-Bf4ozS7L.mjs";
import { t as getProcessSupervisor } from "./supervisor-BxKhxTp_.mjs";
import { T as waitForExecSession, b as removeNotifyOnExit, f as listExecSessionsForCancellation, l as getSession } from "./bash-process-registry-D3AARAgk.mjs";
//#region src/agents/bash-process-control.ts
function isBackgroundExecCancellable(session) {
	return Boolean(session?.backgrounded && !session.exited && !session.finalizing && session.processActivity && !session.processActivity.resultSettled);
}
function cancelBackgroundExecSession(sessionId) {
	const session = getSession(sessionId);
	if (!isBackgroundExecCancellable(session)) return false;
	getProcessSupervisor().cancel(sessionId, "manual-cancel");
	session.cancellationRequested = true;
	return true;
}
/** A requested cancellation is successful only after its own terminal reason and cleanup. */
function isConfirmedRequestedStop(session) {
	return session.cancellationRequested === true && session.exitReason === "manual-cancel" && session.finalizationFailed !== true;
}
/** Agent retirement also owns independent services after their creating turns settle. */
async function drainAgentExecProcesses(agentId, assertCurrent) {
	const sessions = listExecSessionsForCancellation().filter((session) => session.agentId === agentId);
	const accepted = [];
	const failures = [];
	try {
		for (const session of sessions) {
			assertCurrent();
			accepted.push(session);
			session.requestCancelled = true;
			if (!session.exited && !session.finalizing) {
				session.cancellationRequested = true;
				getProcessSupervisor().cancel(session.id, "manual-cancel");
			}
			removeNotifyOnExit(session);
		}
	} catch (error) {
		failures.push(error);
	}
	await Promise.all(accepted.map(waitForExecSession));
	if (accepted.some((session) => session.finalizationFailed || session.cleanupUncertain)) failures.push(/* @__PURE__ */ new Error("Command cleanup could not be confirmed; inspect retained process output."));
	if (failures.length > 0) throw new AggregateError(failures, `Agent ${agentId} command cleanup is still draining`);
}
/** Select before awaited cancellation work; a later human turn cannot enter this plan. */
function captureExecRequestCancellation(target, accept = () => true) {
	const queued = peekExecRequestSystemEventEntries(target);
	const initialSessions = listExecSessionsForCancellation();
	const residualOwners = [...initialSessions.flatMap((session) => !session.exited || session.finalizing ? readExecRequestOwners(session) ?? [] : []), ...queued.flatMap(({ events }) => events.flatMap((event) => readExecRequestOwners(event) ?? []))].filter((owner) => execRequestMatches(owner, target) && accept(owner.identity));
	const owners = /* @__PURE__ */ new Set([...activeExecRequestOwners(target, accept), ...residualOwners]);
	const matching = (session) => readExecRequestOwners(session)?.some((owner) => owners.has(owner)) === true;
	const capturedSessions = initialSessions.filter(matching);
	let cancelled = false;
	return {
		owners: [...owners],
		requestRunIds: [...new Set([...owners].flatMap((owner) => Array.from(owner.turnRunIds)))],
		cancel(select = () => true) {
			if (cancelled || owners.size === 0) return false;
			cancelled = true;
			for (const owner of owners) if (!select(owner.identity)) owners.delete(owner);
			if (owners.size === 0) return false;
			cancelExecRequestOwners([...owners]);
			for (const session of listExecSessionsForCancellation().filter(matching)) removeNotifyOnExit(session);
			for (const { sessionKey, events } of queued) consumeSelectedSystemEventEntries(sessionKey, events.filter((event) => readExecRequestOwners(event)?.some((owner) => owners.has(owner))));
			return true;
		},
		async settle() {
			const stoppedOwners = new Set([...owners].filter((owner) => owner.signal.aborted));
			if (stoppedOwners.size === 0) return;
			const sessions = [.../* @__PURE__ */ new Set([...capturedSessions, ...listExecSessionsForCancellation()])].filter((session) => readExecRequestOwners(session)?.some((owner) => stoppedOwners.has(owner)));
			const pending = sessions.map(waitForExecSession);
			for (const owner of stoppedOwners) for (const settlement of owner.pendingProcesses) pending.push(settlement);
			await Promise.all(pending);
			if ([...stoppedOwners].some((owner) => owner.cleanupUncertain) || sessions.some((session) => session.finalizationFailed || session.cleanupUncertain)) throw new Error("Request stopped, but command cleanup could not be confirmed. Inspect its retained process output before retrying.");
		}
	};
}
//#endregion
export { isConfirmedRequestedStop as a, isBackgroundExecCancellable as i, captureExecRequestCancellation as n, drainAgentExecProcesses as r, cancelBackgroundExecSession as t };
