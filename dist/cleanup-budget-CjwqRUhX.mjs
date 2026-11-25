import{AsyncLocalStorage}from"node:async_hooks";
//!src/process/supervisor/cleanup-budget.ts
const cleanupBudget=new AsyncLocalStorage;function getProcessCleanupBudget(){return cleanupBudget.getStore()}function runWithProcessCleanupBudget(e,t){return e?cleanupBudget.run(e,t):t()}export{runWithProcessCleanupBudget as n,getProcessCleanupBudget as t};