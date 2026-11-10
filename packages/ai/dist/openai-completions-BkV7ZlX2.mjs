import { n as __exportAll } from "./rolldown-runtime-B4iAMlE-.mjs";
import { k as clampThinkingLevel } from "./host-CWt55nnF.mjs";
import { n as buildBaseOptions } from "./simple-options-xJkqrG_E.mjs";
import { n as streamOpenAICompletionsRequest, s as convertMessages } from "./openai-completions-transport-CXMmOM4R.mjs";
import { t as requireApiKey } from "./required-api-key-D088S4Cd.mjs";
//#region packages/ai/src/providers/openai-completions.ts
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
//#endregion
export { streamOpenAICompletions as n, streamSimpleOpenAICompletions as r, openai_completions_exports as t };
