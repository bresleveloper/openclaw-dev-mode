import { w as isOpenAISubscriptionOnlyRouteModelId } from "./model-route-contract-Fecaqw2C.mjs";
//#region extensions/openai/account-models.ts
const OPENAI_UNKNOWN_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const OPENAI_RESPONSES_UNSUPPORTED_MODEL_ID_PATTERN = /(?:^|-)(?:search|live|cyber|exp|alpha)(?:-|$)/;
const OPENAI_PRE_GPT5_MODEL_ID_PATTERN = /^(?:ft:)?(?:gpt-3\.5|gpt-4|o[134])/;
/** Conservative Responses metadata for an OpenAI chat id without a catalog row. */
function buildOpenAIUncataloguedModel(id, baseUrl) {
	return {
		id,
		name: id,
		api: "openai-responses",
		baseUrl,
		reasoning: /^(?:gpt-(?:[5-9]|\d{2})|o\d)/.test(id),
		input: ["text"],
		cost: OPENAI_UNKNOWN_MODEL_COST,
		contextWindow: 128e3,
		maxTokens: 16384
	};
}
/**
* Keeps catalog rows for listed ids and gives every other runnable listed chat id
* conservative Responses metadata. Shared prefix templates are not used here: every
* OpenAI id shares "gpt-", and GPT-5 reasoning settings make GPT-4-family requests fail.
*/
function projectOpenAIAccountModels(params) {
	const catalogIds = new Set(params.catalogModels.map((model) => model.id));
	return params.listedModels.flatMap((model) => {
		if (OPENAI_PRE_GPT5_MODEL_ID_PATTERN.test(model.id)) return [];
		if (catalogIds.has(model.id)) return [model];
		if (OPENAI_RESPONSES_UNSUPPORTED_MODEL_ID_PATTERN.test(model.id) || isOpenAISubscriptionOnlyRouteModelId(model.id)) return [];
		return [buildOpenAIUncataloguedModel(model.id, params.baseUrl)];
	});
}
//#endregion
export { projectOpenAIAccountModels as i, OPENAI_UNKNOWN_MODEL_COST as n, buildOpenAIUncataloguedModel as r, OPENAI_PRE_GPT5_MODEL_ID_PATTERN as t };
