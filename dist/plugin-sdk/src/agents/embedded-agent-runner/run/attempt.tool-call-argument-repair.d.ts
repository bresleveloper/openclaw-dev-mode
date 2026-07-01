import type { StreamFn } from "../../runtime/index.js";
export declare function wrapStreamFnRepairMalformedToolCallArguments(baseFn: StreamFn): StreamFn;
export declare function shouldRepairMalformedToolCallArguments(params: {
    provider?: string;
    modelApi?: string | null;
}): boolean;
export declare function wrapStreamFnDecodeXaiToolCallArguments(baseFn: StreamFn): StreamFn;
