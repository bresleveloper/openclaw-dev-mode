import type { GatewayRequestHandlers } from "./types.js";
/**
 * Gateway methods for browser-owned realtime Talk sessions.
 *
 * These handlers create provider browser sessions and bridge client-owned tool
 * calls back into OpenClaw agent consult runs.
 */
export declare const talkClientHandlers: GatewayRequestHandlers;
