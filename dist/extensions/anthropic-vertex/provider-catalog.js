import { resolveAnthropicVertexRegion } from "./region.js";
import { resolveAnthropicVertexBaseUrl, resolveAnthropicVertexClientRegion } from "./region-endpoint.js";
import { modelCostsEqual, resolveClaudeFable5ModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/anthropic-vertex/provider-catalog.ts
/** Default Anthropic Vertex model used for implicit provider catalogs. */
const ANTHROPIC_VERTEX_DEFAULT_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW = 1e6;
const ANTHROPIC_VERTEX_CLAUDE_5_MAX_TOKENS = 128e3;
const CLAUDE_5_SUPPORTED_REGIONS = /* @__PURE__ */ new Set([
	"global",
	"us",
	"eu"
]);
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
const OPUS_5_COST = {
	global: {
		input: 5,
		output: 25,
		cacheRead: .5,
		cacheWrite: 6.25
	},
	multiRegion: {
		input: 5.5,
		output: 27.5,
		cacheRead: .55,
		cacheWrite: 6.875
	}
};
const SONNET_5_COST = {
	global: {
		input: 2,
		output: 10,
		cacheRead: .2,
		cacheWrite: 2.5
	},
	multiRegion: {
		input: 2.2,
		output: 11,
		cacheRead: .22,
		cacheWrite: 2.75
	}
};
function buildAnthropicVertexModel(params) {
	return {
		id: params.id,
		name: params.name,
		reasoning: params.reasoning,
		input: params.input,
		cost: params.cost,
		contextWindow: ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW,
		maxTokens: params.maxTokens,
		...params.mediaInput ? { mediaInput: params.mediaInput } : {},
		...params.thinkingLevelMap ? { thinkingLevelMap: params.thinkingLevelMap } : {}
	};
}
function resolveOpus5Cost(region) {
	const normalizedRegion = normalizeLowercaseStringOrEmpty(region);
	if (!CLAUDE_5_SUPPORTED_REGIONS.has(normalizedRegion)) return;
	return normalizedRegion === "global" ? OPUS_5_COST.global : OPUS_5_COST.multiRegion;
}
function resolveSonnet5Cost(region) {
	const normalizedRegion = normalizeLowercaseStringOrEmpty(region);
	if (!CLAUDE_5_SUPPORTED_REGIONS.has(normalizedRegion)) return;
	return normalizedRegion === "global" ? SONNET_5_COST.global : SONNET_5_COST.multiRegion;
}
function buildAnthropicVertexCatalog(region) {
	const opus5Cost = resolveOpus5Cost(region);
	const opus5 = opus5Cost ? [buildAnthropicVertexModel({
		id: "claude-opus-5",
		name: "Claude Opus 5",
		reasoning: true,
		input: ["text", "image"],
		cost: opus5Cost,
		maxTokens: ANTHROPIC_VERTEX_CLAUDE_5_MAX_TOKENS,
		mediaInput: { image: {
			maxSidePx: 2576,
			preferredSidePx: 2576,
			tokenMode: "provider"
		} },
		thinkingLevelMap: {
			xhigh: "xhigh",
			max: "max"
		}
	})] : [];
	const sonnet5Cost = resolveSonnet5Cost(region);
	const sonnet5 = sonnet5Cost ? [buildAnthropicVertexModel({
		id: "claude-sonnet-5",
		name: "Claude Sonnet 5",
		reasoning: true,
		input: ["text", "image"],
		cost: sonnet5Cost,
		maxTokens: 128e3,
		mediaInput: { image: {
			maxSidePx: 2576,
			preferredSidePx: 2576,
			tokenMode: "provider"
		} },
		thinkingLevelMap: {
			xhigh: "xhigh",
			max: "max"
		}
	})] : [];
	return [
		buildAnthropicVertexModel({
			id: "claude-fable-5",
			name: "Claude Fable 5",
			reasoning: true,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 50,
				cacheRead: 1,
				cacheWrite: 12.5
			},
			maxTokens: ANTHROPIC_VERTEX_CLAUDE_5_MAX_TOKENS,
			thinkingLevelMap: {
				off: "low",
				minimal: "low",
				xhigh: "xhigh",
				max: "max"
			}
		}),
		...opus5,
		buildAnthropicVertexModel({
			id: "claude-mythos-5",
			name: "Claude Mythos 5",
			reasoning: true,
			input: ["text", "image"],
			cost: {
				input: 10,
				output: 50,
				cacheRead: 1,
				cacheWrite: 12.5
			},
			maxTokens: ANTHROPIC_VERTEX_CLAUDE_5_MAX_TOKENS,
			thinkingLevelMap: {
				off: "low",
				minimal: "low",
				xhigh: "xhigh",
				max: "max"
			}
		}),
		...sonnet5,
		buildAnthropicVertexModel({
			id: "claude-opus-4-8",
			name: "Claude Opus 4.8",
			reasoning: true,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			maxTokens: 128e3,
			thinkingLevelMap: {
				xhigh: "xhigh",
				max: "max"
			}
		}),
		buildAnthropicVertexModel({
			id: "claude-opus-4-6",
			name: "Claude Opus 4.6",
			reasoning: true,
			input: ["text", "image"],
			cost: {
				input: 5,
				output: 25,
				cacheRead: .5,
				cacheWrite: 6.25
			},
			maxTokens: 128e3,
			thinkingLevelMap: {
				xhigh: null,
				max: "max"
			}
		}),
		buildAnthropicVertexModel({
			id: ANTHROPIC_VERTEX_DEFAULT_MODEL_ID,
			name: "Claude Sonnet 4.6",
			reasoning: true,
			input: ["text", "image"],
			cost: {
				input: 3,
				output: 15,
				cacheRead: .3,
				cacheWrite: 3.75
			},
			maxTokens: 128e3,
			thinkingLevelMap: {
				xhigh: null,
				max: "max"
			}
		})
	];
}
/** Resolve a missing runtime row using the same regional inventory as discovery. */
function resolveAnthropicVertexDynamicModel(modelId, baseUrl) {
	const endpoint = normalizeOptionalString(baseUrl) ?? resolveAnthropicVertexBaseUrl();
	const model = buildAnthropicVertexCatalog(resolveAnthropicVertexClientRegion({ baseUrl: endpoint })).find((entry) => entry.id === modelId);
	return model ? {
		...model,
		provider: "anthropic-vertex",
		api: "anthropic-messages",
		baseUrl: endpoint
	} : void 0;
}
/** Restore required generation metadata after explicit models replace an implicit row. */
function normalizeAnthropicVertexResolvedModel(modelId, model) {
	const ref = {
		id: modelId,
		params: model.params
	};
	const fable5 = resolveClaudeFable5ModelIdentity(ref) !== void 0;
	const mythos5 = resolveClaudeMythos5ModelIdentity(ref) !== void 0;
	const opus5 = resolveClaudeOpus5ModelIdentity(ref) !== void 0;
	const sonnet5 = resolveClaudeSonnet5ModelIdentity(ref) !== void 0;
	if (!fable5 && !mythos5 && !opus5 && !sonnet5) return;
	const input = model.input.includes("image") ? model.input : [...model.input, "image"];
	const thinkingLevelMap = {
		...fable5 || mythos5 ? {
			off: "low",
			minimal: "low"
		} : {},
		xhigh: "xhigh",
		max: "max",
		...model.thinkingLevelMap
	};
	const nativeThinkingLevelsMatch = model.thinkingLevelMap?.xhigh === "xhigh" && model.thinkingLevelMap.max === "max" && (!(fable5 || mythos5) || model.thinkingLevelMap.off === "low" && model.thinkingLevelMap.minimal === "low");
	const region = resolveAnthropicVertexClientRegion({ baseUrl: model.baseUrl });
	const cost = opus5 ? resolveOpus5Cost(region) : sonnet5 ? resolveSonnet5Cost(region) : void 0;
	const costMatches = !cost || modelCostsEqual(model.cost, cost);
	if (model.reasoning && input === model.input && model.contextWindow === ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW && model.contextTokens === ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW && (model.maxTokens ?? 0) >= ANTHROPIC_VERTEX_CLAUDE_5_MAX_TOKENS && nativeThinkingLevelsMatch && costMatches) return;
	return {
		...model,
		reasoning: true,
		input,
		contextWindow: ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW,
		contextTokens: ANTHROPIC_VERTEX_DEFAULT_CONTEXT_WINDOW,
		maxTokens: Math.max(model.maxTokens ?? 0, ANTHROPIC_VERTEX_CLAUDE_5_MAX_TOKENS),
		thinkingLevelMap,
		...cost ? { cost } : {}
	};
}
/** Build the implicit Anthropic Vertex provider config for the current env. */
function buildAnthropicVertexProvider(params) {
	const region = resolveAnthropicVertexRegion(params?.env);
	return {
		baseUrl: resolveAnthropicVertexBaseUrl(params?.env),
		api: "anthropic-messages",
		apiKey: GCP_VERTEX_CREDENTIALS_MARKER,
		models: buildAnthropicVertexCatalog(region)
	};
}
//#endregion
export { ANTHROPIC_VERTEX_DEFAULT_MODEL_ID, buildAnthropicVertexProvider, normalizeAnthropicVertexResolvedModel, resolveAnthropicVertexDynamicModel };
