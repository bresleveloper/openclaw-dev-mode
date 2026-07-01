import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { StreamFn } from "../../runtime/index.js";
import type { EmbeddedRunTrigger } from "./params.js";
/**
 * Resolves the stream-idle watchdog timeout for one embedded run. Explicit
 * provider request timeouts and bounded run/agent timeouts cap the watchdog;
 * local provider base URLs disable the implicit cloud-provider default.
 */
export declare function resolveLlmIdleTimeoutMs(params?: {
    cfg?: OpenClawConfig;
    trigger?: EmbeddedRunTrigger;
    runTimeoutMs?: number;
    modelRequestTimeoutMs?: number;
    model?: {
        baseUrl?: string;
        id?: string;
        provider?: string;
    };
}): number;
/**
 * Wraps a stream function with idle timeout detection for both stream creation
 * and iterator progress. Each successful `next()` resets the timer; a timeout
 * aborts the provider request and surfaces the same Error to the caller.
 */
export declare function streamWithIdleTimeout(baseFn: StreamFn, timeoutMs: number, onIdleTimeout?: (error: Error) => void): StreamFn;
