import { AsyncLocalStorage } from "node:async_hooks";
//#region packages/agent-core/src/tool-execution-context.ts
const activeToolExecution = new AsyncLocalStorage();
function getAgentToolExecutionContext() {
	return activeToolExecution.getStore();
}
function resolveAgentAssistantTurnId(message) {
	return message.responseId?.trim() || message.turnId?.trim() || void 0;
}
function getAgentToolAssistantTurnId() {
	const message = getAgentToolExecutionContext()?.assistantMessage;
	return message ? resolveAgentAssistantTurnId(message) : void 0;
}
function runWithAgentToolExecutionContext(context, run) {
	return activeToolExecution.run(context, run);
}
//#endregion
export { runWithAgentToolExecutionContext as i, getAgentToolExecutionContext as n, resolveAgentAssistantTurnId as r, getAgentToolAssistantTurnId as t };
