import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/session-placement-computer.ts
const placementComputer = resolveGlobalSingleton(Symbol.for("openclaw.sessionPlacementComputer"), () => new AsyncLocalStorage());
/** Absence means ordinary node routing; null explicitly withholds an unavailable placed desktop. */
function resolveSessionPlacementComputer(run) {
	const context = placementComputer.getStore();
	return context ? run && run.runId === context.runId && context.isActive() ? context.bind(run) : null : void 0;
}
/** Select policy facts without opening a transport or activating a dormant sandbox. */
function resolveSessionPlacementSandboxToolPolicy(policy, scope) {
	const context = placementComputer.getStore();
	return policy && context && scope.runId === context.runId && scope.agentId === context.agentId && context.isActive() ? context.sandboxToolPolicy ?? policy : policy;
}
function withSessionPlacementComputer(context, run) {
	return placementComputer.run(context, run);
}
//#endregion
export { resolveSessionPlacementSandboxToolPolicy as n, withSessionPlacementComputer as r, resolveSessionPlacementComputer as t };
