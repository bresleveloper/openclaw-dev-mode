import { K as Tool, q as ToolCall } from "./types-DRgdPqaZ.mjs";

//#region packages/llm-core/src/validation.d.ts
/** Finds the target tool and validates/coerces a model-emitted tool call. */
declare function validateToolCall(tools: Tool[], toolCall: ToolCall): unknown;
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
declare function validateToolArguments(tool: Tool, toolCall: ToolCall): unknown;
//#endregion
export { validateToolCall as n, validateToolArguments as t };