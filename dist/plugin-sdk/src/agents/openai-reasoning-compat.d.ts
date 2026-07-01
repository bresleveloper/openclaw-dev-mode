/** Minimal model fields needed to resolve OpenAI reasoning effort compatibility. */
type OpenAIReasoningCompatModel = {
    provider?: string | null;
    id?: string | null;
    compat?: unknown;
};
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
export declare function resolveOpenAIReasoningEffortMap(model: OpenAIReasoningCompatModel, fallbackMap?: Record<string, string>): Record<string, string>;
export {};
