import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/supervisor/cleanup-budget.ts
const cleanupBudget = new AsyncLocalStorage();
function getProcessCleanupBudget() {
	return cleanupBudget.getStore();
}
function runWithProcessCleanupBudget(budget, run) {
	return budget ? cleanupBudget.run(budget, run) : run();
}
//#endregion
export { runWithProcessCleanupBudget as n, getProcessCleanupBudget as t };
