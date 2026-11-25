import{t as createSubsystemLogger}from"./subsystem-BXrV0rVs.mjs";
//!src/infra/worker-request-delivery-report.runtime.ts
const log=createSubsystemLogger(`worker/delivery`);function reportSlowWorkerDelivery(e){log.warn(`slow SQLite worker delivery`,e)}export{reportSlowWorkerDelivery};