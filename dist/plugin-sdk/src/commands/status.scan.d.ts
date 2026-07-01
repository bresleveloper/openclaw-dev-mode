import type { RuntimeEnv } from "../runtime.js";
import type { StatusScanResult } from "./status.scan-result.ts";
/** Runs the status scan for text or JSON command modes. */
export declare function scanStatus(opts: {
    json?: boolean;
    timeoutMs?: number;
    all?: boolean;
    deep?: boolean;
}, _runtime: RuntimeEnv): Promise<StatusScanResult>;
