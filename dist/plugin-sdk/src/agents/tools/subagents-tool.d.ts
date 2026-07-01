import type { AnyAgentTool } from "./common.js";
/** Creates the subagents list tool scoped to the caller's controlled session tree. */
export declare function createSubagentsTool(opts?: {
    agentSessionKey?: string;
}): AnyAgentTool;
