import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/channels/turn/agent-run-terminal-outcome.ts
const AGENT_RUN_TERMINAL_OUTCOME = Symbol.for("openclaw.agentRunTerminalOutcome");
const AGENT_RUN_TERMINAL_ERROR = Symbol.for("openclaw.agentRunTerminalError");
function recordAgentRunTerminalOutcome(result, outcome, error) {
	return Object.assign(result, {
		[AGENT_RUN_TERMINAL_OUTCOME]: outcome,
		[AGENT_RUN_TERMINAL_ERROR]: outcome === "failed" ? error : void 0
	});
}
function readAgentRunTerminalOutcome(result) {
	const outcome = isRecord(result) && Object.hasOwn(result, AGENT_RUN_TERMINAL_OUTCOME) ? Reflect.get(result, AGENT_RUN_TERMINAL_OUTCOME) : void 0;
	return outcome === "completed" || outcome === "failed" ? outcome : void 0;
}
/** Carries the producer's final diagnostic without changing the JSON response. */
function readAgentRunTerminalError(result) {
	if (!isRecord(result) || readAgentRunTerminalOutcome(result) !== "failed" || !Object.hasOwn(result, AGENT_RUN_TERMINAL_ERROR)) return;
	const error = Reflect.get(result, AGENT_RUN_TERMINAL_ERROR);
	return typeof error === "string" ? error : void 0;
}
//#endregion
export { readAgentRunTerminalOutcome as n, recordAgentRunTerminalOutcome as r, readAgentRunTerminalError as t };
