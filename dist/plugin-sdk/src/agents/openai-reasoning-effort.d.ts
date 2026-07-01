export type OpenAIReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
export type OpenAIApiReasoningEffort = OpenAIReasoningEffort | (string & {});
type OpenAIReasoningModel = {
    provider?: unknown;
    id?: unknown;
    name?: unknown;
    api?: unknown;
    baseUrl?: unknown;
    compat?: unknown;
};
/** Return whether a model is the GPT-5.4 mini family. */
export declare function isOpenAIGpt54MiniModel(model: OpenAIReasoningModel): boolean;
/** Return whether a model is the GPT-5.5 family. */
export declare function isOpenAIGpt55Model(model: OpenAIReasoningModel): boolean;
/** Normalize user-facing reasoning effort names to API effort names. */
export declare function normalizeOpenAIReasoningEffort(effort: string): string;
/** Resolve the reasoning efforts accepted by a specific OpenAI-compatible model. */
export declare function resolveOpenAISupportedReasoningEfforts(model: OpenAIReasoningModel): readonly OpenAIApiReasoningEffort[];
/** Return whether a model accepts a requested reasoning effort. */
export declare function supportsOpenAIReasoningEffort(model: OpenAIReasoningModel, effort: string): boolean;
/** Resolve a requested reasoning effort to the closest value supported by the model. */
export declare function resolveOpenAIReasoningEffortForModel(params: {
    model: OpenAIReasoningModel;
    effort: string;
    fallbackMap?: Record<string, string>;
}): OpenAIApiReasoningEffort | undefined;
export {};
