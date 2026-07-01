import type { StreamFn } from "../../runtime/index.js";
/**
 * Wraps provider streams so raw "Unhandled stop reason" failures are rewritten
 * into stable error messages. Recovery covers synchronous creation failures,
 * async stream creation failures, iterator errors, and `result()` errors.
 */
export declare function wrapStreamFnHandleSensitiveStopReason(baseFn: StreamFn): StreamFn;
