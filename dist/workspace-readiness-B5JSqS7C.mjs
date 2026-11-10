import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/workspace-readiness.ts
const workspaceReadiness = resolveGlobalSingleton(Symbol.for("openclaw.agentWorkspaceReadiness"), () => new AsyncLocalStorage());
function runWithAgentWorkspaceReadiness(readiness, run) {
	return workspaceReadiness.run(readiness, run);
}
/** Capture the session owner before handing tools to another async context. */
function captureAgentWorkspaceReadiness(sessionKey) {
	const captured = workspaceReadiness.getStore();
	return sessionKey && captured?.sessionKey === sessionKey ? captured : void 0;
}
//#endregion
export { runWithAgentWorkspaceReadiness as n, captureAgentWorkspaceReadiness as t };
