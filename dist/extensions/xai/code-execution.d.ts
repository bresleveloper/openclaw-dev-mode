import { f as AgentToolResult } from "../../types-BoFHdU9q.js";
import { t as XaiToolAuthContext } from "../../tool-auth-shared-Bmx32iMq.js";

//#region extensions/xai/code-execution.d.ts
declare function createCodeExecutionTool(options?: {
  config?: unknown;
  runtimeConfig?: Record<string, unknown> | null;
  auth?: XaiToolAuthContext;
}): {
  label: string;
  name: string;
  description: string;
  parameters: import("typebox").TObject<{
    task: import("typebox").TString;
  }>;
  execute: (toolCallId: string, args: Record<string, unknown>) => Promise<AgentToolResult<unknown>>;
} | null;
//#endregion
export { createCodeExecutionTool };