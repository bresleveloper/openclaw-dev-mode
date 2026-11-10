//#region src/agents/defaults.ts
const DEFAULT_PROVIDER = "openai";
const DEFAULT_MODEL = "gpt-6-astra";
const DEFAULT_CONTEXT_TOKENS = 2e5;
/** Output-token cap used when no authored, provider, or catalog limit exists. */
const DEFAULT_MODEL_MAX_TOKENS = 32768;
const DEFAULT_MODEL_MAX_TOKENS_FLOOR = 8192;
/**
* Resolves the invented output cap for a model whose real limit is unknown.
* A known window keeps half its tokens for input, between the former 8192
* fallback and the 32768 default, and never exceeds the window itself.
* Explicit limits never pass through here.
*/
function resolveDefaultModelMaxTokens(contextWindow) {
	if (contextWindow === void 0 || !Number.isFinite(contextWindow) || contextWindow <= 0) return DEFAULT_MODEL_MAX_TOKENS;
	const window = Math.max(1, Math.floor(contextWindow));
	return Math.min(DEFAULT_MODEL_MAX_TOKENS, Math.max(Math.min(DEFAULT_MODEL_MAX_TOKENS_FLOOR, window), Math.floor(window / 2)));
}
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
export { createNativeModelOwnedRuntimeModel as a, DEFAULT_PROVIDER as i, DEFAULT_MODEL as n, resolveDefaultModelMaxTokens as o, DEFAULT_MODEL_MAX_TOKENS as r, DEFAULT_CONTEXT_TOKENS as t };
