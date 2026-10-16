import { t as __exportAll } from "./rolldown-runtime-BhDjJH2R.mjs";
import { k as clampThinkingLevel } from "./host-u3o8XiAp.mjs";
import { n as buildBaseOptions } from "./simple-options-7QuSKriJ.mjs";
import { c as convertMessages, n as streamOpenAICompletionsRequest } from "./openai-completions-transport-QYABn8Uz.mjs";
import { t as requireApiKey } from "./required-api-key-D4kn3252.mjs";
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
	const toolChoice = options?.toolChoice;
	return streamOpenAICompletions(model, context, {
		...base,
		reasoningEffort: clampedReasoning,
		toolChoice
	});
};
//#endregion
export { streamOpenAICompletions as n, streamSimpleOpenAICompletions as r, openai_completions_exports as t };
