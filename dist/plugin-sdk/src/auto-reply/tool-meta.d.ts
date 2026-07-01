type ToolAggregateOptions = {
    markdown?: boolean;
};
/** Formats one grouped tool-progress label from a tool name and metadata entries. */
export declare function formatToolAggregate(toolName?: string, metas?: string[], options?: ToolAggregateOptions): string;
export {};
