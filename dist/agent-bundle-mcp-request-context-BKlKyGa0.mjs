import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { n as withGuardedFetchRequestAuthority } from "./fetch-request-authority-BA1Sa1i8.mjs";
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
const callAuthorities = resolveGlobalSingleton(Symbol.for("openclaw.sessionMcpToolCallAuthority"), () => new AsyncLocalStorage());
/** Caller-owned liveness check that MCP tools/call re-runs immediately before server I/O. */
function getSessionMcpToolCallAuthority() {
	return callAuthorities.getStore();
}
function runWithSessionMcpToolCallAuthority(assertCurrent, run) {
	return assertCurrent ? callAuthorities.run(assertCurrent, run) : run();
}
/**
* Binds a configured-server request to the loopback caller's grant: it is
* rechecked at the request boundary, including after reconnection or catalog
* refresh waits, and carried into guarded fetches.
*/
function withSessionMcpCallerAuthority(request) {
	const callerAuthority = getSessionMcpToolCallAuthority();
	return callerAuthority ? (...args) => {
		callerAuthority();
		return withGuardedFetchRequestAuthority(callerAuthority, () => request(...args));
	} : request;
}
//#endregion
export { withSessionMcpCallerAuthority as i, runWithSessionMcpRequestSignal as n, runWithSessionMcpToolCallAuthority as r, getSessionMcpRequestSignal as t };
