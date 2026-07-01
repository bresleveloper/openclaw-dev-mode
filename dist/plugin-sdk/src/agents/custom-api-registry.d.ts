import type { Api } from "../llm/types.js";
import type { StreamFn } from "./runtime/index.js";
/** Registers a custom API stream function when no provider already owns it. */
export declare function ensureCustomApiRegistered(api: Api, streamFn: StreamFn): boolean;
