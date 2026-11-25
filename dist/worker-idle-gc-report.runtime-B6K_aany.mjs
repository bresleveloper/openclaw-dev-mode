import{t as createSubsystemLogger}from"./subsystem-BXrV0rVs.mjs";
//!src/infra/worker-idle-gc-report.runtime.ts
const log=createSubsystemLogger(`worker/idle-gc`);function reportSlowIdleWorkerGc(e){log.warn(`slow idle worker garbage collection`,e)}export{reportSlowIdleWorkerGc};