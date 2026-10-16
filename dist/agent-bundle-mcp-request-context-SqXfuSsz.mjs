import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-bundle-mcp-request-context.ts
const requestSignals = resolveGlobalSingleton(Symbol.for("openclaw.sessionMcpRequestSignal"), () => new AsyncLocalStorage());
function getSessionMcpRequestSignal() {
	const caller = requestSignals.getStore();
	const owner = getAsyncWorkSignal();
	return caller && owner ? AbortSignal.any([caller, owner]) : caller ?? owner;
}
function runWithSessionMcpRequestSignal(signal, run) {
	return signal ? requestSignals.run(signal, run) : run();
}
//#endregion
export { runWithSessionMcpRequestSignal as n, getSessionMcpRequestSignal as t };
