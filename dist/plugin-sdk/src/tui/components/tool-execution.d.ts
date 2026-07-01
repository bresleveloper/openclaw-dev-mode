import { Container } from "@earendil-works/pi-tui";
type ToolResultContent = {
    type?: string;
    text?: string;
    mimeType?: string;
    bytes?: number;
    omitted?: boolean;
};
type ToolResult = {
    content?: ToolResultContent[];
    details?: Record<string, unknown>;
};
/** Displays a running or completed tool call with optional expandable output. */
export declare class ToolExecutionComponent extends Container {
    private box;
    private header;
    private argsLine;
    private output;
    private toolName;
    private args;
    private result?;
    private expanded;
    private isError;
    private isPartial;
    constructor(toolName: string, args: unknown);
    /** Re-renders tool arguments when streaming tool call input changes. */
    setArgs(args: unknown): void;
    /** Toggles preview/full output rendering for long tool results. */
    setExpanded(expanded: boolean): void;
    /** Marks the tool call complete and renders final output. */
    setResult(result: ToolResult | undefined, opts?: {
        isError?: boolean;
    }): void;
    /** Renders partial output while the tool call is still running. */
    setPartialResult(result: ToolResult | undefined): void;
    private refresh;
}
export {};
