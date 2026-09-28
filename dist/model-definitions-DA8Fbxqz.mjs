import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { r as normalizeXaiModelId, t as isXaiFrontierModelId } from "./model-id-BpefGMul.mjs";
//#region extensions/xai/openclaw.plugin.json
var modelCatalog = {
	"providers": { "xai": {
		"baseUrl": "https://api.x.ai/v1",
		"api": "openai-responses",
		"models": [
			{
				"id": "grok-4.7",
				"name": "Grok 4.7",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 2,
					"output": 6,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"contextWindow": 5e5,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.6",
				"name": "Grok 4.6",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 2,
					"output": 6,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"contextWindow": 5e5,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.5",
				"name": "Grok 4.5",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 2,
					"output": 6,
					"cacheRead": .3,
					"cacheWrite": 0
				},
				"contextWindow": 5e5,
				"maxTokens": 64e3
			},
			{
				"id": "grok-build-0.1",
				"name": "Grok Build 0.1",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 1,
					"output": 2,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 256e3,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.3",
				"name": "Grok 4.3",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 1.25,
					"output": 2.5,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 1e6,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.20-0309-reasoning",
				"name": "Grok 4.20 0309 (Reasoning)",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 1.25,
					"output": 2.5,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 1e6,
				"maxTokens": 3e4
			},
			{
				"id": "grok-4.20-0309-non-reasoning",
				"name": "Grok 4.20 0309 (Non-Reasoning)",
				"reasoning": false,
				"input": ["text", "image"],
				"cost": {
					"input": 1.25,
					"output": 2.5,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 1e6,
				"maxTokens": 3e4
			}
		]
	} },
	"discovery": { "xai": "refreshable" },
	"suppressions": [
		{
			"provider": "xai",
			"model": "auto",
			"reason": "The xAI auto selector has retired; use a concrete model.",
			"retirement": { "replacedBy": "grok-4.7" },
			"when": { "baseUrlHosts": ["cli-chat-proxy.grok.com", "api.x.ai"] }
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-0309",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-latest",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-beta-latest",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-experimental-beta-0304",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-experimental-beta-latest",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-beta-0309",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		}
	]
};
//#endregion
//#region extensions/xai/model-definitions.ts
const XAI_BASE_URL = modelCatalog.providers.xai.baseUrl;
const XAI_DEFAULT_IMAGE_MODEL = "grok-imagine-image";
const XAI_IMAGE_MODELS = ["grok-imagine-image", "grok-imagine-image-quality"];
const XAI_DEFAULT_CONTEXT_WINDOW = 1e6;
const XAI_DEFAULT_MAX_TOKENS = 64e3;
const XAI_DEFAULT_MODEL_ID = "grok-4.7";
/** Models outside the manifest carry no price until the manifest lists them. */
const XAI_UNKNOWN_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
function isXaiModelInput(value) {
	return value === "text" || value === "image" || value === "video" || value === "audio";
}
function toXaiModelDefinition(model) {
	return {
		...model,
		input: model.input.filter(isXaiModelInput)
	};
}
function copyXaiModelDefinition(entry) {
	return structuredClone(entry);
}
const XAI_MODEL_CATALOG = modelCatalog.providers.xai.models.map(toXaiModelDefinition);
/** Curated pricing and supported-family capabilities share one lookup owner. */
function resolveXaiCatalogEntry(modelId) {
	const normalized = normalizeXaiCatalogModelId(modelId);
	const entry = XAI_MODEL_CATALOG.find((model) => model.id.toLowerCase() === normalized);
	if (entry) return copyXaiModelDefinition(entry);
	if (normalized.includes("multi-agent")) return;
	const grok3 = normalized.startsWith("grok-3");
	const frontier = isXaiFrontierModelId(normalized);
	const multimodal = normalized === "grok-latest" || frontier || normalized.startsWith("grok-4.3") || normalized.startsWith("grok-4.20") || normalized.startsWith("grok-4-1") || normalized.startsWith("grok-4-fast");
	if (!grok3 && !multimodal && !normalized.startsWith("grok-4")) return;
	const id = normalizeXaiModelId(modelId.trim());
	return {
		id,
		name: id,
		reasoning: grok3 ? normalized.includes("mini") : !normalized.includes("non-reasoning"),
		input: multimodal ? ["text", "image"] : ["text"],
		cost: { ...XAI_UNKNOWN_MODEL_COST },
		contextWindow: frontier ? 5e5 : XAI_DEFAULT_CONTEXT_WINDOW,
		maxTokens: normalized.startsWith("grok-4.20") ? 3e4 : XAI_DEFAULT_MAX_TOKENS
	};
}
function resolveXaiForwardCompatDefinition(modelId) {
	const known = resolveXaiCatalogEntry(modelId);
	if (known) return known;
	const id = modelId.trim();
	const lower = normalizeOptionalLowercaseString(id) ?? "";
	if (!lower.startsWith("grok-") || lower.includes("multi-agent")) return;
	return {
		id,
		name: id,
		reasoning: !lower.includes("non-reasoning"),
		input: ["text", "image"],
		cost: { ...XAI_UNKNOWN_MODEL_COST },
		contextWindow: XAI_DEFAULT_CONTEXT_WINDOW,
		maxTokens: XAI_DEFAULT_MAX_TOKENS
	};
}
function buildXaiModelDefinition() {
	const entry = resolveXaiCatalogEntry(XAI_DEFAULT_MODEL_ID);
	if (!entry) throw new Error(`xai manifest omits the default model ${XAI_DEFAULT_MODEL_ID}`);
	return entry;
}
function buildXaiCatalogModels() {
	return XAI_MODEL_CATALOG.map(copyXaiModelDefinition);
}
const LEGACY_XAI_BUILTIN_SIGNATURES = {
	"grok-3": [
		"Grok 3",
		false,
		"text",
		131072,
		8192,
		3,
		15,
		.75,
		0
	],
	"grok-3-fast": [
		"Grok 3 Fast",
		false,
		"text",
		131072,
		8192,
		5,
		25,
		1.25,
		0
	],
	"grok-3-mini": [
		"Grok 3 Mini",
		true,
		"text",
		131072,
		8192,
		.3,
		.5,
		.075,
		0
	],
	"grok-3-mini-fast": [
		"Grok 3 Mini Fast",
		true,
		"text",
		131072,
		8192,
		.6,
		4,
		.15,
		0
	],
	"grok-4": [
		"Grok 4",
		true,
		"text",
		256e3,
		64e3,
		3,
		15,
		.75,
		0
	],
	"grok-4-0709": [
		"Grok 4 0709",
		false,
		"text",
		256e3,
		64e3,
		3,
		15,
		.75,
		0
	],
	"grok-4-fast": [
		"Grok 4 Fast",
		true,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	],
	"grok-4-fast-non-reasoning": [
		"Grok 4 Fast (Non-Reasoning)",
		false,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	],
	"grok-4-1-fast": [
		"Grok 4.1 Fast",
		true,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	],
	"grok-4-1-fast-non-reasoning": [
		"Grok 4.1 Fast (Non-Reasoning)",
		false,
		"text,image",
		2e6,
		3e4,
		.2,
		.5,
		.05,
		0
	]
};
const LEGACY_MODEL_KEYS = /* @__PURE__ */ new Set([
	"id",
	"name",
	"reasoning",
	"input",
	"cost",
	"contextWindow",
	"maxTokens"
]);
const LEGACY_COST_KEYS = /* @__PURE__ */ new Set([
	"input",
	"output",
	"cacheRead",
	"cacheWrite"
]);
function normalizeXaiCatalogModelId(modelId) {
	const lower = normalizeOptionalLowercaseString(modelId) ?? "";
	const unprefixed = lower.startsWith("xai/") ? lower.slice(4) : lower;
	return normalizeXaiModelId(unprefixed);
}
function isLegacyXaiBuiltinModel(model) {
	const record = asOptionalRecord(model);
	const id = normalizeOptionalLowercaseString(record?.id);
	const signature = id ? LEGACY_XAI_BUILTIN_SIGNATURES[id] : void 0;
	const cost = asOptionalRecord(record?.cost);
	if (!record || !signature || !cost) return false;
	if (Object.keys(record).some((key) => !LEGACY_MODEL_KEYS.has(key)) || Object.keys(cost).some((key) => !LEGACY_COST_KEYS.has(key))) return false;
	const [name, reasoning, input, contextWindow, maxTokens, inputCost, outputCost, cacheReadCost, cacheWriteCost] = signature;
	return record.name === name && record.reasoning === reasoning && Array.isArray(record.input) && record.input.join(",") === input && record.contextWindow === contextWindow && record.maxTokens === maxTokens && cost.input === inputCost && cost.output === outputCost && cost.cacheRead === cacheReadCost && cost.cacheWrite === cacheWriteCost;
}
//#endregion
export { XAI_DEFAULT_MODEL_ID as a, buildXaiCatalogModels as c, resolveXaiCatalogEntry as d, resolveXaiForwardCompatDefinition as f, XAI_DEFAULT_MAX_TOKENS as i, buildXaiModelDefinition as l, XAI_DEFAULT_CONTEXT_WINDOW as n, XAI_IMAGE_MODELS as o, XAI_DEFAULT_IMAGE_MODEL as r, XAI_UNKNOWN_MODEL_COST as s, XAI_BASE_URL as t, isLegacyXaiBuiltinModel as u };
