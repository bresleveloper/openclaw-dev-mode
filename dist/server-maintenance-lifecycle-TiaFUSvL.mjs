import{o as throwSettledAggregate}from"./error-graph-internal-Bt2pFJBM.mjs";
//!src/gateway/server-maintenance-lifecycle.ts
async function clearGatewayMaintenanceHandles(e){if(!e)return;const t=await Promise.allSettled([e.stopPeriodicTasks,e.skillUsageCleanup].map(async e=>await e()));throwSettledAggregate(t,`Gateway maintenance cleanup failed`)}export{clearGatewayMaintenanceHandles as t};