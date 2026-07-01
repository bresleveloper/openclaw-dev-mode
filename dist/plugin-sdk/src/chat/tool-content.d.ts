declare const TOOL_USE_ID_FIELDS: readonly ["id", "tool_call_id", "toolCallId", "tool_use_id", "toolUseId"];
type ToolUseIdField = (typeof TOOL_USE_ID_FIELDS)[number];
/** Provider-agnostic chat content block shape used before SDK-specific narrowing. */
export type ToolContentBlock = Record<string, unknown> & Partial<Record<ToolUseIdField, unknown>>;
/** Accepts tool-call content type spellings used by provider SDKs and persisted transcripts. */
export declare function isToolCallContentType(value: unknown): boolean;
/** Accepts tool-result content type spellings used by provider SDKs and persisted transcripts. */
export declare function isToolResultContentType(value: unknown): boolean;
/** Narrows unknown chat content blocks to provider-shaped tool-call blocks. */
export declare function isToolCallBlock(block: ToolContentBlock): boolean;
/** Narrows unknown chat content blocks to provider-shaped tool-result blocks. */
export declare function isToolResultBlock(block: ToolContentBlock): boolean;
/** Reads the argument payload across the common provider field names. */
export declare function resolveToolBlockArgs(block: ToolContentBlock): unknown;
/** Reads the stable tool-use id across snake_case and camelCase provider field names. */
export declare function resolveToolUseId(block: ToolContentBlock): string | undefined;
export {};
