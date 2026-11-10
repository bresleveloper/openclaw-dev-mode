import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/agent-database-preparation-context.ts
const preparation = new AsyncLocalStorage();
/** Carry readiness observation without borrowing startup's database access. */
function withAgentDatabasePreparationContext(resolveOwner, run) {
	return preparation.run(resolveOwner, run);
}
function waitForAgentDatabasePreparation(agentId, options) {
	return preparation.getStore()?.()?.waitForAgentPreparation(agentId, options);
}
//#endregion
export { withAgentDatabasePreparationContext as n, waitForAgentDatabasePreparation as t };
