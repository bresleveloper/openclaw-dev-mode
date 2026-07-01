/**
 * Splits SDK tools from OpenClaw tool definitions for provider calls.
 */
import { toToolDefinitions } from "../agent-tool-definition-adapter.js";
import type { HookContext } from "../agent-tools.before-tool-call.js";
import type { AgentTool } from "../runtime/index.js";
type AnyAgentTool = AgentTool;
export declare function splitSdkTools(options: {
    tools: AnyAgentTool[];
    sandboxEnabled: boolean;
    toolHookContext?: HookContext;
}): {
    customTools: ReturnType<typeof toToolDefinitions>;
};
export {};
