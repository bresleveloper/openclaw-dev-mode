import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { join } from "node:path";
import { parseFiniteNumber, resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/memory-lancedb/config.ts
const MEMORY_CATEGORIES = [
	"preference",
	"fact",
	"decision",
	"entity",
	"other"
];
const DEFAULT_MODEL = "text-embedding-3-small";
const DEFAULT_CAPTURE_MAX_CHARS = 500;
const DEFAULT_RECALL_MAX_CHARS = 1e3;
function resolveDefaultDbPath(stateDir = resolveStateDir()) {
	return join(stateDir, "memory", "lancedb");
}
const EMBEDDING_DIMENSIONS = {
	"text-embedding-3-small": 1536,
	"text-embedding-3-large": 3072
};
const EMBEDDING_CONFIG_KEYS = [
	"provider",
	"apiKey",
	"model",
	"baseUrl",
	"dimensions"
];
function assertAllowedKeys(value, allowed, label) {
	const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
	if (unknown.length === 0) return;
	throw new Error(`${label} has unknown keys: ${unknown.join(", ")}`);
}
function vectorDimsForModel(model) {
	const dims = EMBEDDING_DIMENSIONS[model];
	if (!dims) throw new Error(`Unsupported embedding model: ${model}`);
	return dims;
}
function resolveEnvVars(value, env = process.env) {
	return value.replace(/\$\{([^}]+)\}/g, (_, envVar) => {
		const envValue = env[envVar];
		if (!envValue) throw new Error(`Environment variable ${envVar} is not set`);
		return envValue;
	});
}
function resolveEmbeddingModel(embedding, dimensions) {
	const model = typeof embedding.model === "string" ? embedding.model : DEFAULT_MODEL;
	if (dimensions === void 0) vectorDimsForModel(model);
	return model;
}
function resolveTextLimit(value, fallback, label) {
	const resolved = resolveOptionalIntegerOption(value) ?? fallback;
	if (resolved < 100 || resolved > 1e4) throw new Error(`${label} must be between 100 and 10000`);
	return resolved;
}
function resolveEmbeddingDimensions(embedding) {
	if (embedding.dimensions === void 0) return;
	const dimensions = typeof embedding.dimensions === "number" ? parseFiniteNumber(embedding.dimensions) : void 0;
	if (dimensions === void 0 || !Number.isInteger(dimensions) || dimensions < 1) throw new Error("embedding.dimensions must be a positive integer");
	return dimensions;
}
const memoryConfigSchema = { parse(value) {
	if (!isRecord(value)) throw new Error("memory config required");
	const cfg = value;
	assertAllowedKeys(cfg, [
		"embedding",
		"dreaming",
		"dbPath",
		"autoCapture",
		"autoRecall",
		"captureMaxChars",
		"customTriggers",
		"recallMaxChars",
		"storageOptions"
	], "memory config");
	const embedding = cfg.embedding;
	if (!isRecord(embedding)) throw new Error("embedding config required");
	assertAllowedKeys(embedding, [...EMBEDDING_CONFIG_KEYS], "embedding config");
	if (Object.keys(embedding).length === 0) throw new Error("embedding config must include at least one setting");
	const dimensions = resolveEmbeddingDimensions(embedding);
	const model = resolveEmbeddingModel(embedding, dimensions);
	const provider = typeof embedding.provider === "string" ? embedding.provider.trim() : "openai";
	if (!provider) throw new Error("embedding.provider must not be empty");
	const captureMaxChars = resolveTextLimit(cfg.captureMaxChars, 500, "captureMaxChars");
	const recallMaxChars = resolveTextLimit(cfg.recallMaxChars, DEFAULT_RECALL_MAX_CHARS, "recallMaxChars");
	let customTriggers;
	if (cfg.customTriggers !== void 0) {
		if (!Array.isArray(cfg.customTriggers)) throw new Error("customTriggers must be an array of strings");
		customTriggers = cfg.customTriggers.map((trigger, index) => {
			if (typeof trigger !== "string") throw new Error(`customTriggers.${index} must be a string`);
			const normalized = trigger.trim();
			if (!normalized) throw new Error(`customTriggers.${index} must not be empty`);
			if (normalized.length > 100) throw new Error(`customTriggers.${index} must be at most 100 characters`);
			return normalized;
		});
		if (customTriggers.length > 50) throw new Error("customTriggers must include at most 50 entries");
	}
	const dreaming = cfg.dreaming;
	if (dreaming !== void 0 && !isRecord(dreaming)) throw new Error("dreaming config must be an object");
	let storageOptions;
	const storageOpts = cfg.storageOptions;
	if (storageOpts !== void 0 && storageOpts !== null) {
		if (!isRecord(storageOpts)) throw new Error("storageOptions must be an object");
		storageOptions = {};
		for (const [key, valueLocal] of Object.entries(storageOpts)) {
			if (typeof valueLocal !== "string") throw new Error(`storageOptions.${key} must be a string`);
			storageOptions[key] = resolveEnvVars(valueLocal);
		}
	}
	return {
		embedding: {
			provider,
			model,
			apiKey: typeof embedding.apiKey === "string" ? resolveEnvVars(embedding.apiKey) : void 0,
			baseUrl: typeof embedding.baseUrl === "string" ? resolveEnvVars(embedding.baseUrl) : void 0,
			dimensions
		},
		dreaming,
		dbPath: typeof cfg.dbPath === "string" ? cfg.dbPath : resolveDefaultDbPath(),
		autoCapture: cfg.autoCapture === true,
		autoRecall: cfg.autoRecall !== false,
		captureMaxChars,
		...customTriggers ? { customTriggers } : {},
		recallMaxChars,
		...storageOptions ? { storageOptions } : {}
	};
} };
//#endregion
export { DEFAULT_CAPTURE_MAX_CHARS, DEFAULT_RECALL_MAX_CHARS, MEMORY_CATEGORIES, memoryConfigSchema, resolveDefaultDbPath, resolveEnvVars, vectorDimsForModel };
