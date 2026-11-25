import { n as __exportAll } from "./rolldown-runtime-DYf_mQCB.mjs";
import { N as clampThinkingLevel } from "./host-Dm4e6L6R.mjs";
import { n as buildBaseOptions } from "./simple-options-Bet1Zroc.mjs";
import { l as convertMessages, n as streamOpenAICompletionsRequest } from "./openai-completions-transport-Dzqn0lMx.mjs";
import { t as requireApiKey } from "./required-api-key-BniLGxy4.mjs";
// packages/ai/src/providers/openai-completions.ts
var openai_completions_exports = /* @__PURE__ */ __exportAll({
	convertMessages: () => convertMessages,
	streamOpenAICompletions: () => streamOpenAICompletions,
	streamSimpleOpenAICompletions: () => streamSimpleOpenAICompletions
});
const streamOpenAICompletions = (model, context, options) => streamOpenAICompletionsRequest(model, context, options, "direct");
const streamSimpleOpenAICompletions = (model, context, options) => {
	const apiKey = requireApiKey(model.provider, options?.apiKey);
	const base = buildBaseOptions(model, options, apiKey);
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const completionsOptions = options;
	const providerOptions = {
		...base,
		reasoningEffort: clampedReasoning,
		toolChoice: completionsOptions?.toolChoice,
		streaming: completionsOptions?.streaming,
		openclawThinkingExplicit: completionsOptions?.openclawThinkingExplicit ?? options?.reasoning !== void 0
	};
	return streamOpenAICompletions(model, context, providerOptions);
};
export { streamOpenAICompletions as n, streamSimpleOpenAICompletions as r, openai_completions_exports as t };
