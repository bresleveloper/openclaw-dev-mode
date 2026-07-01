import { l as AgentTool } from "./types-BoFHdU9q.js";
import { Xa as HookContext } from "./types-BVLQjFJF.js";
import { Dr as ToolDefinition } from "./index-Ctf-VgEf.js";

//#region src/agents/agent-tool-definition-adapter.d.ts
type AnyAgentTool$1 = AgentTool;
/** Convert executable agent tools into session definitions with hook handling. */
declare function toToolDefinitions(tools: AnyAgentTool$1[], hookContext?: HookContext): ToolDefinition[];
//#endregion
//#region src/agents/embedded-agent-runner/tool-split.d.ts
type AnyAgentTool = AgentTool;
declare function splitSdkTools(options: {
  tools: AnyAgentTool[];
  sandboxEnabled: boolean;
  toolHookContext?: HookContext;
}): {
  customTools: ReturnType<typeof toToolDefinitions>;
};
//#endregion
export { splitSdkTools as t };