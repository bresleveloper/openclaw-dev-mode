type ToolCallShapedTextDetection = {
    kind: "json_tool_call" | "xml_tool_call" | "bracketed_tool_call" | "react_action";
    toolName?: string;
};
/** Detects assistant-visible text that looks like an unexecuted tool call instead of prose. */
export declare function detectToolCallShapedText(text: string): ToolCallShapedTextDetection | null;
export {};
