import OpenAI from "openai";
import { ResponseCreateParamsStreaming } from "openai/resources/responses/responses.js";
//#region packages/ai/src/providers/openai-tool-projection.d.ts
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
type OpenAIToolProjection = {
  readonly inputToolCount: number;
  readonly tools: readonly OpenAIProjectedTool[];
  readonly diagnostics: readonly OpenAIToolProjectionDiagnostic[];
};
type OpenAIResponsesToolChoice = ResponseCreateParamsStreaming["tool_choice"];
type OpenAICompletionsSdkToolChoice = OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming["tool_choice"];
type OpenAICompletionsToolChoice = Exclude<OpenAICompletionsSdkToolChoice, {
  type: "custom";
}>;
/** Snapshots direct/custom tool descriptors before OpenAI payload construction. */
declare function projectOpenAITools(tools: readonly OpenAIToolDescriptor[]): OpenAIToolProjection;
/** Keeps Responses tool choices aligned with surviving function schemas. */
declare function reconcileOpenAIResponsesToolChoice(choice: OpenAIResponsesToolChoice, projection: OpenAIToolProjection): OpenAIResponsesToolChoice | undefined;
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
declare function reconcileOpenAICompletionsToolChoice(choice: OpenAICompletionsSdkToolChoice, projection: OpenAIToolProjection): OpenAICompletionsSdkToolChoice | undefined;
//#endregion
export { reconcileOpenAIResponsesToolChoice as a, reconcileOpenAICompletionsToolChoice as i, OpenAIToolProjection as n, projectOpenAITools as r, OpenAICompletionsToolChoice as t };