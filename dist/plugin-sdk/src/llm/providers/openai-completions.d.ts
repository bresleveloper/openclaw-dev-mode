import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
import { type OpenAICompletionsToolChoice } from "../../agents/openai-tool-projection.js";
import type { Context, Model, OpenAICompletionsCompat, SimpleStreamOptions, StreamFunction, StreamOptions } from "../types.js";
export interface OpenAICompletionsOptions extends StreamOptions {
    toolChoice?: OpenAICompletionsToolChoice;
    reasoningEffort?: "minimal" | "low" | "medium" | "high" | "xhigh";
}
type ResolvedOpenAICompletionsCompat = Omit<Required<OpenAICompletionsCompat>, "cacheControlFormat"> & {
    cacheControlFormat?: OpenAICompletionsCompat["cacheControlFormat"];
};
export declare const streamOpenAICompletions: StreamFunction<"openai-completions", OpenAICompletionsOptions>;
export declare const streamSimpleOpenAICompletions: StreamFunction<"openai-completions", SimpleStreamOptions>;
export declare function convertMessages(model: Model<"openai-completions">, context: Context, compat: ResolvedOpenAICompletionsCompat, options?: {
    preserveSystemPromptCacheBoundary?: boolean;
}): ChatCompletionMessageParam[];
export {};
