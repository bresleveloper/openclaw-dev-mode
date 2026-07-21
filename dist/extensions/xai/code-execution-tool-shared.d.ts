import { f as AgentToolResult } from "../../types-D0CdrmU4.js";
import { Type } from "typebox";

//#region extensions/xai/code-execution-tool-shared.d.ts
declare function buildMissingCodeExecutionApiKeyPayload(): {
  error: string;
  message: string;
  docs: string;
};
declare function createCodeExecutionToolDefinition(execute: (toolCallId: string, args: Record<string, unknown>) => Promise<AgentToolResult<unknown>>): {
  label: string;
  name: string;
  description: string;
  parameters: Type.TObject<{
    task: Type.TString;
  }>;
  execute: (toolCallId: string, args: Record<string, unknown>) => Promise<AgentToolResult<unknown>>;
};
//#endregion
export { buildMissingCodeExecutionApiKeyPayload, createCodeExecutionToolDefinition };