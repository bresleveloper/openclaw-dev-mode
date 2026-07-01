type AnthropicToolDescriptor = {
    readonly name: string;
    readonly description: string;
    readonly parameters: unknown;
};
type AnthropicProjectedTool = {
    readonly originalName: string;
    readonly wireName: string;
    readonly description?: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: Record<string, unknown>;
        readonly required: string[];
    };
};
export type AnthropicToolProjection = {
    readonly inputToolCount: number;
    readonly unavailableOriginalNames: ReadonlySet<string>;
    readonly tools: readonly AnthropicProjectedTool[];
};
type AnthropicParallelToolChoice = {
    readonly disable_parallel_tool_use?: boolean;
};
export type AnthropicProjectedToolChoice = ({
    readonly type: "auto";
} & AnthropicParallelToolChoice) | ({
    readonly type: "any";
} & AnthropicParallelToolChoice) | {
    readonly type: "none";
} | ({
    readonly type: "tool";
    readonly name: string;
} & AnthropicParallelToolChoice);
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
export declare function projectAnthropicTools(tools: readonly AnthropicToolDescriptor[], toWireName: (name: string) => string): AnthropicToolProjection;
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
export declare function reconcileAnthropicToolChoice(choice: AnthropicProjectedToolChoice, projection: AnthropicToolProjection): AnthropicProjectedToolChoice | undefined;
/** Maps Claude Code wire names without trusting every direct/custom descriptor. */
export declare function resolveOriginalAnthropicToolName(name: string, projection: AnthropicToolProjection | undefined): string;
export {};
