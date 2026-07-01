import type { StreamFn } from "../../../agents/runtime/index.js";
/** Wraps a stream function and lets callers mutate outgoing provider payload objects. */
export declare function streamWithPayloadPatch(underlying: StreamFn, model: Parameters<StreamFn>[0], context: Parameters<StreamFn>[1], options: Parameters<StreamFn>[2], patchPayload: (payload: Record<string, unknown>) => void): ReturnType<StreamFn>;
