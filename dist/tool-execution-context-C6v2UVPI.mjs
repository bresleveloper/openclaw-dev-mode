import { AsyncLocalStorage } from "node:async_hooks";
//#region packages/agent-core/src/tool-execution-context.ts
const activeToolExecution = new AsyncLocalStorage();
function getAgentToolExecutionContext() {
	return activeToolExecution.getStore();
}
function runWithAgentToolExecutionContext(context, run) {
	return activeToolExecution.run(context, run);
}
//#endregion
export { runWithAgentToolExecutionContext as n, getAgentToolExecutionContext as t };
