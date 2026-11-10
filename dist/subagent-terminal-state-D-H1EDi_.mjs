import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { r as prepareSessionWatcherStorePaths, t as captureSessionWatcherStorePaths } from "./session-store-path-BQkYPc4_.mjs";
import { f as recordSessionStateEventAsync } from "./session-state-events-BCzDVKh0.mjs";
//#region src/sessions/subagent-terminal-state.ts
const SUBAGENT_TERMINAL_SUMMARY = {
	ok: "child run completed",
	error: "child run failed",
	timeout: "child run timed out",
	cancelled: "child run cancelled"
};
/** The registry commits this signal with its terminal row, under the same authority. */
function prepareSubagentTerminalState(params, now = Date.now()) {
	const watcherSessionKeys = [params.requesterSessionKey];
	return {
		input: {
			event: {
				sessionKey: params.childSessionKey,
				agentId: params.agentId,
				kind: params.outcomeStatus === "ok" ? "run_completed" : "run_failed",
				actorType: "system",
				runId: params.runId,
				dedupeKey: `run-terminal:${params.runId}`,
				summary: SUBAGENT_TERMINAL_SUMMARY[params.outcomeStatus],
				...params.outcomeStatus === "ok" ? {} : { payload: { outcome: params.outcomeStatus } },
				watcherSessionKeys,
				watcherStorePaths: params.watcherStorePaths ?? captureSessionWatcherStorePaths(watcherSessionKeys)
			},
			now,
			sessionEntryCurrentSource: params.sessionEntryCurrent?.source
		},
		sessionEntryCurrent: params.sessionEntryCurrent
	};
}
/** ACP terminal projections use the signal owner without a native subagent run row. */
async function recordSubagentTerminalState(params, assertCurrent, acpControl) {
	let watcherStorePaths = params.watcherStorePaths;
	if (!watcherStorePaths) {
		await captureRuntimeConfigAsyncReader()();
		watcherStorePaths = (await prepareSessionWatcherStorePaths([params.requesterSessionKey])).paths;
	}
	const prepared = prepareSubagentTerminalState({
		...params,
		watcherStorePaths
	});
	await recordSessionStateEventAsync(prepared.input.event, {
		now: prepared.input.now,
		assertCurrent,
		acpControl,
		sessionEntryCurrent: params.sessionEntryCurrent
	});
}
//#endregion
export { recordSubagentTerminalState as n, prepareSubagentTerminalState as t };
