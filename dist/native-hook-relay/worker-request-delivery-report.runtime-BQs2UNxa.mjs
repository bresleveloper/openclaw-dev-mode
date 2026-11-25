import{t as createSubsystemLogger}from"./subsystem-rLS79yG2.mjs";
//!src/infra/worker-request-delivery-report.runtime.ts
const log=createSubsystemLogger(`worker/delivery`);function reportSlowWorkerDelivery(e){log.warn(`slow SQLite worker delivery`,e)}export{reportSlowWorkerDelivery};