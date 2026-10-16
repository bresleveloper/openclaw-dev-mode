//#region src/agents/defaults.ts
const DEFAULT_PROVIDER = "openai";
const DEFAULT_MODEL = "gpt-6-astra";
const DEFAULT_CONTEXT_TOKENS = 2e5;
/** Builds structural model metadata for a harness that resolves its real model natively. */
function createNativeModelOwnedRuntimeModel(params) {
	return {
		provider: params.provider,
		id: params.modelId,
		name: params.modelId,
		baseUrl: "",
		api: "openai-responses",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_CONTEXT_TOKENS,
		maxTokens: DEFAULT_CONTEXT_TOKENS
	};
}
//#endregion
export { createNativeModelOwnedRuntimeModel as i, DEFAULT_MODEL as n, DEFAULT_PROVIDER as r, DEFAULT_CONTEXT_TOKENS as t };
