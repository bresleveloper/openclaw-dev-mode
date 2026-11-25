import { ft as Tool, pt as ToolCall } from "./types-B1ZIh9Ch.mjs";
/** Finds the target tool and validates/coerces a model-emitted tool call. */
declare function validateToolCall(tools: Tool[], toolCall: ToolCall): unknown;
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
declare function validateToolArguments(tool: Tool, toolCall: ToolCall): unknown;
export { validateToolCall as n, validateToolArguments as t };