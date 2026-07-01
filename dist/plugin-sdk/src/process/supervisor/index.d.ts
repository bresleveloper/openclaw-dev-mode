import type { ProcessSupervisor } from "./types.js";
/** Return the process-wide supervisor used by runtime code that does not inject one. */
export declare function getProcessSupervisor(): ProcessSupervisor;
export { createProcessSupervisor } from "./supervisor.js";
export type { ManagedRun, ProcessSupervisor, RunExit, RunRecord, RunState, SpawnInput, SpawnMode, TerminationReason, } from "./types.js";
