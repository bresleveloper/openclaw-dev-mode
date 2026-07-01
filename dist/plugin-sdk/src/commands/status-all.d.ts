import type { RuntimeEnv } from "../runtime.js";
/** Runs the full read-only status report and writes it to the runtime logger. */
export declare function statusAllCommand(runtime: RuntimeEnv, opts?: {
    timeoutMs?: number;
}): Promise<void>;
