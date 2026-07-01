import type { AgentCommandOpts, AgentRunContext } from "./types.js";
/** Merges explicit run context with command routing options. */
export declare function resolveAgentRunContext(opts: AgentCommandOpts): AgentRunContext;
