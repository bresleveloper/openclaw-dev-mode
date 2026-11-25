import{t as createSubsystemLogger}from"./subsystem-DpZ9wPI4.js";
//!src/infra/windows-appcontainer-spawn-log.runtime.ts
function logAppContainerTokenProbeFailure(e){createSubsystemLogger(`process`).debug(`AppContainer token probe failed; allowing spawn`,{error:String(e)})}export{logAppContainerTokenProbeFailure};