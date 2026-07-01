/**
 * Internal opt-in for deterministic terminal summaries from trusted built-in tools.
 * This is intentionally absent from the public AgentTool and Plugin SDK contracts.
 */
import type { AgentToolResult } from "./runtime/index.js";
import type { AnyAgentTool } from "./tools/common.js";
type TerminalToolPresentation = {
    text: string;
};
type TerminalToolPresentationFormatter = (params: unknown, result: AgentToolResult<unknown>) => TerminalToolPresentation | undefined;
export declare function setToolTerminalPresentation<T extends AnyAgentTool>(tool: T, formatter: TerminalToolPresentationFormatter): T;
export declare function getToolTerminalPresentation(tool: AnyAgentTool): TerminalToolPresentationFormatter | undefined;
export declare function copyToolTerminalPresentation(source: AnyAgentTool, target: AnyAgentTool): void;
export {};
