import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { f as captureSessionWatcherStorePaths } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { p as recordSessionStateEventAsync } from "./session-state-events-B7wdeeGU.mjs";
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
				agentId: resolveAgentIdFromSessionKey(params.childSessionKey),
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
	const prepared = prepareSubagentTerminalState(params);
	await recordSessionStateEventAsync(prepared.input.event, {
		now: prepared.input.now,
		assertCurrent,
		acpControl,
		sessionEntryCurrent: params.sessionEntryCurrent
	});
}
//#endregion
export { recordSubagentTerminalState as n, prepareSubagentTerminalState as t };
