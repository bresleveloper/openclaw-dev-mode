import "openclaw/plugin-sdk/provider-model-shared";
const MINIMAX_TEXT_MODEL_ORDER = [
	"MiniMax-M3",
	"MiniMax-M2.7",
	"MiniMax-M2.7-highspeed"
];
const MINIMAX_TEXT_MODEL_CATALOG = {
	"MiniMax-M3": {
		name: "MiniMax M3",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1e6,
		compat: { codeMode: "preferred" }
	},
	"MiniMax-M2.7": {
		name: "MiniMax M2.7",
		reasoning: true,
		input: ["text"],
		contextWindow: 204800
	},
	"MiniMax-M2.7-highspeed": {
		name: "MiniMax M2.7 Highspeed",
		reasoning: true,
		input: ["text"],
		contextWindow: 204800
	}
};
MINIMAX_TEXT_MODEL_ORDER.map((modelId) => `minimax/${modelId}`);
//#endregion
//#region extensions/minimax/model-definitions.ts
const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
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
//#region extensions/minimax/provider-catalog.ts
function resolveMinimaxCatalogBaseUrl(env = process.env) {
	const rawHost = env.MINIMAX_API_HOST?.trim();
	if (!rawHost) return MINIMAX_API_BASE_URL;
	try {
		const url = new URL(rawHost);
		const basePath = url.pathname.replace(/\/+$/, "");
		if (basePath.endsWith("/anthropic")) return `${url.origin}${basePath}`;
		return `${url.origin}/anthropic`;
	} catch {
		return MINIMAX_API_BASE_URL;
	}
}
function buildMinimaxCatalog() {
	return MINIMAX_TEXT_MODEL_ORDER.map(buildMinimaxApiModelDefinition);
}
function buildMinimaxProvider(env) {
	return {
		baseUrl: resolveMinimaxCatalogBaseUrl(env),
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
function buildMinimaxPortalProvider(env) {
	return {
		baseUrl: resolveMinimaxCatalogBaseUrl(env),
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
//#endregion
//#region extensions/minimax/provider-discovery.ts
const minimaxProviderDiscovery = [{
	id: "minimax",
	label: "MiniMax",
	docsPath: "/providers/minimax",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async (ctx) => ({ providers: { minimax: buildMinimaxProvider(ctx.env) } })
	}
}, {
	id: "minimax-portal",
	label: "MiniMax",
	docsPath: "/providers/minimax",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async (ctx) => ({ providers: { "minimax-portal": buildMinimaxPortalProvider(ctx.env) } })
	}
}];
//#endregion
export { minimaxProviderDiscovery as default };
