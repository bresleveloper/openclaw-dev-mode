import { r as AnthropicOptions } from "./provider-options-DAzsyi49.mjs";
import { Tool } from "@anthropic-ai/sdk/resources/messages.js";
//#region packages/ai/src/providers/anthropic-tool-projection.d.ts
type AnthropicToolDescriptor = {
  readonly name: string;
  readonly description: string;
  readonly parameters: unknown;
};
type AnthropicProjectedTool = {
  readonly originalName: string;
  readonly wireName: string;
  readonly description?: string;
  readonly inputSchema: Tool["input_schema"] & {
    readonly properties: Record<string, unknown>;
    readonly required: string[];
  };
};
type AnthropicToolProjection = {
  readonly inputToolCount: number;
  readonly unavailableOriginalNames: ReadonlySet<string>;
  readonly tools: readonly AnthropicProjectedTool[];
};
type AnthropicParallelToolChoice = {
  readonly disable_parallel_tool_use?: boolean;
};
type AnthropicProjectedToolChoice = ({
  readonly type: "auto";
} & AnthropicParallelToolChoice) | ({
  readonly type: "any";
} & AnthropicParallelToolChoice) | {
  readonly type: "none";
} | ({
  readonly type: "tool";
  readonly name: string;
} & AnthropicParallelToolChoice);
/** Preserve Claude Code's canonical tool casing for subscription OAuth requests. */
declare function toClaudeCodeToolName(name: string): string;
/** Anthropic rejects forced tools while extended thinking is enabled. */
declare function normalizeAnthropicToolChoice(thinkingEnabled: boolean, toolChoice: NonNullable<AnthropicOptions["toolChoice"]>): AnthropicProjectedToolChoice;
/** Anthropic tool identifiers accept only ASCII word characters and dashes. */
declare function normalizeAnthropicToolCallId(id: string): string;
/** Prepare a detached JSON projection for Anthropic's tuple dialect. */
declare function prepareAnthropicInputSchema(schema: Record<string, unknown>): AnthropicProjectedTool["inputSchema"] | null;
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
declare function projectAnthropicTools(tools: readonly AnthropicToolDescriptor[], toWireName: (name: string) => string): AnthropicToolProjection;
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
declare function reconcileAnthropicToolChoice(choice: AnthropicProjectedToolChoice, projection: AnthropicToolProjection): AnthropicProjectedToolChoice | undefined;
/** Maps Claude Code wire names without trusting every direct/custom descriptor. */
declare function resolveOriginalAnthropicToolName(name: string, projection: AnthropicToolProjection | undefined): string;
//#endregion
export { prepareAnthropicInputSchema as a, resolveOriginalAnthropicToolName as c, normalizeAnthropicToolChoice as i, toClaudeCodeToolName as l, AnthropicToolProjection as n, projectAnthropicTools as o, normalizeAnthropicToolCallId as r, reconcileAnthropicToolChoice as s, AnthropicProjectedToolChoice as t };