import type { AnyAgentTool } from "./agent-tools.types.js";
/** Wrap a tool so every execute call observes the supplied run abort signal. */
export declare function wrapToolWithAbortSignal(tool: AnyAgentTool, abortSignal?: AbortSignal): AnyAgentTool;
