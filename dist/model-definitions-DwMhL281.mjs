import { r as MINIMAX_TEXT_MODEL_CATALOG, t as MINIMAX_DEFAULT_MODEL_ID } from "./provider-models-B4yCGD5m.mjs";
//#region extensions/minimax/model-definitions.ts
const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
const MINIMAX_CN_API_BASE_URL = "https://api.minimaxi.com/anthropic";
const MINIMAX_HOSTED_MODEL_ID = MINIMAX_DEFAULT_MODEL_ID;
const MINIMAX_HOSTED_MODEL_REF = `minimax/${MINIMAX_HOSTED_MODEL_ID}`;
const DEFAULT_MINIMAX_CONTEXT_WINDOW = 204800;
const DEFAULT_MINIMAX_MAX_TOKENS = 131072;
const MINIMAX_API_COST = {
	input: .6,
	output: 2.4,
	cacheRead: .12,
	cacheWrite: 0
};
const MINIMAX_M27_API_COST = {
	input: .3,
	output: 1.2,
	cacheRead: .06,
	cacheWrite: .375
};
const MINIMAX_API_HIGHSPEED_COST = {
	input: .6,
	output: 2.4,
	cacheRead: .06,
	cacheWrite: .375
};
const MINIMAX_M25_API_COST = {
	input: .3,
	output: 1.2,
	cacheRead: .03,
	cacheWrite: .375
};
const MINIMAX_M25_API_HIGHSPEED_COST = {
	input: .6,
	output: 2.4,
	cacheRead: .03,
	cacheWrite: .375
};
const MINIMAX_HOSTED_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const MINIMAX_LM_STUDIO_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
function resolveMinimaxApiCost(modelId) {
	if (modelId === "MiniMax-M2.7") return MINIMAX_M27_API_COST;
	if (modelId === "MiniMax-M2.5-highspeed") return MINIMAX_M25_API_HIGHSPEED_COST;
	if (modelId === "MiniMax-M2.5") return MINIMAX_M25_API_COST;
	if (modelId === "MiniMax-M2.7-highspeed") return MINIMAX_API_HIGHSPEED_COST;
	return MINIMAX_API_COST;
}
function buildMinimaxModelDefinition(params) {
	const catalog = MINIMAX_TEXT_MODEL_CATALOG[params.id];
	const compat = catalog && "compat" in catalog ? catalog.compat : void 0;
	return {
		id: params.id,
		name: params.name ?? catalog?.name ?? `MiniMax ${params.id}`,
		reasoning: params.reasoning ?? catalog?.reasoning ?? false,
		input: [...catalog?.input ?? ["text"]],
		cost: params.cost,
		contextWindow: params.contextWindow,
		maxTokens: params.maxTokens,
		...compat ? { compat: { ...compat } } : {}
	};
}
function buildMinimaxApiModelDefinition(modelId) {
	return buildMinimaxModelDefinition({
		id: modelId,
		cost: resolveMinimaxApiCost(modelId),
		contextWindow: MINIMAX_TEXT_MODEL_CATALOG[modelId]?.contextWindow ?? DEFAULT_MINIMAX_CONTEXT_WINDOW,
		maxTokens: DEFAULT_MINIMAX_MAX_TOKENS
	});
}
//#endregion
export { MINIMAX_HOSTED_COST as a, MINIMAX_LM_STUDIO_COST as c, MINIMAX_CN_API_BASE_URL as i, buildMinimaxApiModelDefinition as l, MINIMAX_API_BASE_URL as n, MINIMAX_HOSTED_MODEL_ID as o, MINIMAX_API_COST as r, MINIMAX_HOSTED_MODEL_REF as s, DEFAULT_MINIMAX_BASE_URL as t, buildMinimaxModelDefinition as u };
