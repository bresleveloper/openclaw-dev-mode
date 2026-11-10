//#region src/agents/embedded-agent-runner/run/midturn-precheck.ts
/** Stable message used to identify synthetic mid-turn overflow errors in session cleanup. */
const MID_TURN_PRECHECK_ERROR_MESSAGE = "Context overflow: prompt too large for the model (mid-turn precheck).";
/**
* Internal control-flow signal thrown after a tool result makes the next prompt
* exceed budget. The attempt runner catches it and routes through the overflow
* recovery path instead of treating it as an ordinary provider failure.
*/
var MidTurnPrecheckSignal = class extends Error {
	constructor(request) {
		super(MID_TURN_PRECHECK_ERROR_MESSAGE);
		this.name = "MidTurnPrecheckSignal";
		this.request = request;
	}
};
function isMidTurnPrecheckSignal(error) {
	return error instanceof MidTurnPrecheckSignal;
}
/** This local routing signal is not a provider response or durable conversation item. */
function isMidTurnPrecheckAssistantError(message) {
	return message?.role === "assistant" && message.stopReason === "error" && message.errorMessage === MID_TURN_PRECHECK_ERROR_MESSAGE;
}
//#endregion
export { isMidTurnPrecheckAssistantError as n, isMidTurnPrecheckSignal as r, MidTurnPrecheckSignal as t };
