import { type ToolParameterSchemaOptions } from "./agent-tools-parameter-schema.js";
import type { AnyAgentTool } from "./agent-tools.types.js";
/** Normalize a tool's parameter schema for the selected provider/model. */
export declare function normalizeToolParameters(tool: AnyAgentTool, options?: ToolParameterSchemaOptions): AnyAgentTool;
