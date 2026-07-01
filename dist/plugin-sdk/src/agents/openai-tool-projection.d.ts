import type OpenAI from "openai";
import type { ResponseCreateParamsStreaming } from "openai/resources/responses/responses.js";
type OpenAIToolDescriptor = {
    readonly name?: unknown;
    readonly description?: unknown;
    readonly parameters: unknown;
};
type OpenAIProjectedTool = {
    readonly toolIndex: number;
    readonly name: string;
    readonly description?: string;
    readonly parameters: Record<string, unknown>;
};
type OpenAIToolProjectionDiagnostic = {
    readonly toolIndex: number;
    readonly toolName?: string;
    readonly violations: readonly string[];
};
export type OpenAIToolProjection = {
    readonly inputToolCount: number;
    readonly tools: readonly OpenAIProjectedTool[];
    readonly diagnostics: readonly OpenAIToolProjectionDiagnostic[];
};
type OpenAIResponsesToolChoice = ResponseCreateParamsStreaming["tool_choice"];
type OpenAICompletionsSdkToolChoice = OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming["tool_choice"];
export type OpenAICompletionsToolChoice = Exclude<OpenAICompletionsSdkToolChoice, {
    type: "custom";
}>;
/** Snapshots direct/custom tool descriptors before OpenAI payload construction. */
export declare function projectOpenAITools(tools: readonly OpenAIToolDescriptor[]): OpenAIToolProjection;
/** Keeps Responses tool choices aligned with surviving function schemas. */
export declare function reconcileOpenAIResponsesToolChoice(choice: OpenAIResponsesToolChoice, projection: OpenAIToolProjection): OpenAIResponsesToolChoice | undefined;
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
export declare function reconcileOpenAICompletionsToolChoice(choice: OpenAICompletionsSdkToolChoice, projection: OpenAIToolProjection): OpenAICompletionsSdkToolChoice | undefined;
export {};
