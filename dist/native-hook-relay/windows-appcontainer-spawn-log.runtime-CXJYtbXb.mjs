import{t as createSubsystemLogger}from"./subsystem-rLS79yG2.mjs";
//!src/infra/windows-appcontainer-spawn-log.runtime.ts
function logAppContainerTokenProbeFailure(e){createSubsystemLogger(`process`).debug(`AppContainer token probe failed; allowing spawn`,{error:String(e)})}export{logAppContainerTokenProbeFailure};