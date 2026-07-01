import type { GatewayRequestContext } from "./types.js";
/** Returns true when either requested or canonical session key has a visible active run. */
export declare function hasTrackedActiveSessionRun(params: {
    context: Partial<Pick<GatewayRequestContext, "chatAbortControllers">>;
    requestedKey: string;
    canonicalKey: string;
    agentId?: string;
    defaultAgentId?: string;
}): boolean;
