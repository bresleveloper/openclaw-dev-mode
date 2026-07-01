import type { AnyAgentTool } from "./common.js";
/** Creates the sessions_yield tool for runtimes that support yield callbacks. */
export declare function createSessionsYieldTool(opts?: {
    sessionId?: string;
    onYield?: (message: string) => Promise<void> | void;
}): AnyAgentTool;
