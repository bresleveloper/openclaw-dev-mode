import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as runOutsideAsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as registerPreparedModelRuntimeClose } from "./prepared-model-runtime.lifecycle-wUGazXvM.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./model-catalog-normalize-XcxRiFN_.mjs";
import { t as normalizeOpenRouterModelReasoning } from "./model-catalog-reasoning-BRFAQwaV.mjs";
import { i as normalizeOpenRouterModelPricing } from "./model-catalog-pricing-CtZwyNHR.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { o as resolveDefaultModelMaxTokens } from "./defaults-Bg930vxE.mjs";
import "./http-body-DZQjJc2J.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-B70cE6fn.mjs";
import { f as readProviderJsonArrayFieldResponse } from "./provider-http-errors-CjVOxCE5.mjs";
import { l as prepareCorePluginStateReplacement, r as createCorePluginStateSyncKeyedStore } from "./plugin-state-store-DY4rDlss.mjs";
import { r as resolveProxyFetchFromEnv } from "./proxy-fetch-jG_wX5MX.mjs";
import { i as streamSimple } from "./stream-NAsW_bVF.mjs";
import { _ as createOpenAIThinkingLevelWrapper, a as createMinimaxFastModeWrapper, b as resolveOpenAITextVerbosity, c as createOpenAIAttributionHeadersWrapper, d as createOpenAIFastModeWrapper, f as createOpenAIReasoningCompatibilityWrapper, g as createOpenAITextVerbosityWrapper, h as createOpenAIStringContentWrapper, i as isProxyReasoningUnsupported, m as createOpenAIServiceTierWrapper, p as createOpenAIResponsesContextManagementWrapper, r as createOpenRouterWrapper, s as createCodexNativeWebSearchWrapper, t as createKilocodeWrapper, v as resolveOpenAIFastMode, y as resolveOpenAIServiceTier } from "./proxy-5w6qPw5I.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-DKyCtmRd.mjs";
import { P as createToolStreamWrapper, u as createGoogleThinkingPayloadWrapper } from "./provider-stream-shared-Ond8mlRx.mjs";
import { n as resolveMoonshotThinkingKeep, r as resolveMoonshotThinkingType, t as createMoonshotThinkingWrapper } from "./moonshot-thinking-36kuuz70.mjs";
import { projectRuntimeToolInputSchema } from "@openclaw/ai/internal/tool-schema";
import { isOpenAIGpt56Model } from "@openclaw/ai/internal/openai";
//#region src/llm/providers/stream-wrappers/anthropic-family-tool-payload-compat.ts
function projectJsonObjectSchema(schema, path) {
	const { schema: normalizedSchema, violations } = projectRuntimeToolInputSchema(schema, path);
	if (!isRecord(normalizedSchema) || violations.some((violation) => !violation.endsWith(".$dynamicRef") && !violation.endsWith(".$dynamicAnchor"))) return;
	const { properties, required } = normalizedSchema;
	if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && (!Array.isArray(required) || required.some((entry) => typeof entry !== "string"))) return;
	if (properties === null) delete normalizedSchema.properties;
	if (required === null) delete normalizedSchema.required;
	return normalizedSchema;
}
function normalizeOpenAiFunctionAnthropicToolDefinition(tool) {
	if (!isRecord(tool)) return;
	const nested = isRecord(tool.function) ? tool.function : void 0;
	const rawName = normalizeOptionalString(tool.name);
	const custom = !nested && !rawName && tool.type === "custom" && isRecord(tool.custom) ? tool.custom : void 0;
	const definition = nested ?? custom ?? tool;
	const name = normalizeOptionalString(definition.name);
	if (!name) return nested || custom ? void 0 : { tool };
	if (custom && custom.input_schema === void 0) return {
		kind: "custom",
		name,
		projectedKind: "custom",
		tool
	};
	let schema;
	let schemaField = "parameters";
	if (nested) schema = nested.parameters;
	else if (custom || isRecord(definition.input_schema)) {
		schema = definition.input_schema;
		schemaField = "input_schema";
	} else {
		schema = definition.parameters;
		if (!isRecord(schema) && (definition.input_schema !== void 0 || schema !== void 0)) return;
		schema ??= {
			type: "object",
			properties: {}
		};
	}
	const parameters = schema === void 0 ? void 0 : projectJsonObjectSchema(schema, `${name}.${schemaField}`);
	if (schema !== void 0 && !parameters) return;
	const functionSpec = {
		name,
		...parameters ? { parameters } : {}
	};
	const description = definition.description;
	if (typeof description === "string" && description.trim()) functionSpec.description = description;
	const strict = custom ? void 0 : definition.strict;
	if (typeof strict === "boolean" || nested && strict === null) functionSpec.strict = strict;
	return {
		kind: custom ? "custom" : "function",
		name,
		projectedKind: "function",
		tool: {
			...nested ? tool : {},
			type: "function",
			function: functionSpec
		}
	};
}
function projectOpenAiFunctionAnthropicTools(tools) {
	const projectedTools = [];
	const customFunctionNames = /* @__PURE__ */ new Set();
	const customNames = /* @__PURE__ */ new Set();
	const functionNames = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		const projection = normalizeOpenAiFunctionAnthropicToolDefinition(tool);
		if (!projection) continue;
		projectedTools.push(projection.tool);
		if (projection.kind === "custom" && projection.name) {
			customNames.add(projection.name);
			if (projection.projectedKind === "function") customFunctionNames.add(projection.name);
		} else if (projection.kind === "function" && projection.name) functionNames.add(projection.name);
	}
	return {
		customFunctionNames,
		customNames,
		functionNames,
		tools: projectedTools
	};
}
function isProjectedToolAvailable(projection, kind, name) {
	return !projection || (kind === "custom" ? projection.customNames : projection.functionNames).has(name);
}
function projectToolChoiceKind(projection, kind, name) {
	return kind === "custom" && projection.customFunctionNames.has(name) ? "function" : kind;
}
function normalizeAllowedToolChoice(choice, toolProjection) {
	if (!toolProjection || !isRecord(choice.allowed_tools)) return choice;
	const mode = choice.allowed_tools.mode;
	if (mode !== "auto" && mode !== "required" || !Array.isArray(choice.allowed_tools.tools)) return choice;
	const tools = choice.allowed_tools.tools.flatMap((tool) => {
		if (!isRecord(tool)) return [];
		const kind = tool.type === "custom" || tool.type === "function" ? tool.type : void 0;
		const definition = kind && isRecord(tool[kind]) ? tool[kind] : void 0;
		const name = definition && normalizeOptionalString(definition.name);
		if (!kind || !name || !isProjectedToolAvailable(toolProjection, kind, name)) return [];
		const projectedKind = projectToolChoiceKind(toolProjection, kind, name);
		return [{
			type: projectedKind,
			[projectedKind]: { name }
		}];
	});
	if (tools.length === 0) {
		if (mode === "auto") return "none";
		throw new Error("OpenAI-compatible Anthropic tool_choice requires a tool, but no allowed tools survived payload conversion");
	}
	return {
		type: "allowed_tools",
		allowed_tools: {
			mode,
			tools
		}
	};
}
function normalizeOpenAiStringModeAnthropicToolChoice(toolChoice, toolProjection) {
	const mode = isRecord(toolChoice) ? toolChoice.type === "any" ? "required" : toolChoice.type : toolChoice;
	if (mode === "auto" || mode === "none" || mode === "required") {
		if (mode === "auto" && toolProjection?.tools.length === 0) return;
		if (mode === "required" && toolProjection?.tools.length === 0) throw new Error("OpenAI-compatible Anthropic tool_choice requires a tool, but no tools survived payload conversion");
		return mode;
	}
	if (!isRecord(toolChoice)) return toolChoice;
	const choice = toolChoice;
	const kind = choice.type === "custom" ? "custom" : "function";
	const definition = choice.type === "tool" ? choice : choice.type === kind ? choice[kind] : void 0;
	const name = isRecord(definition) ? normalizeOptionalString(definition.name) : void 0;
	if (name) {
		if (!isProjectedToolAvailable(toolProjection, kind, name)) throw new Error(`OpenAI-compatible Anthropic tool_choice requested unavailable tool "${name}" after payload conversion`);
		const projectedKind = toolProjection ? projectToolChoiceKind(toolProjection, kind, name) : kind;
		return {
			type: projectedKind,
			[projectedKind]: { name }
		};
	}
	if (choice.type === "allowed_tools") return normalizeAllowedToolChoice(choice, toolProjection);
	return toolChoice;
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function createAnthropicToolPayloadCompatibilityWrapper(baseStreamFn, options) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, streamOptions) => streamWithPayloadPatch(underlying, model, context, streamOptions, (payloadObj) => {
		if (model.api === "anthropic-messages") {
			const compatibilityFlag = isRecord(model.compat) && model.compat.requiresOpenAiAnthropicToolPayload === true;
			let toolProjection;
			if (Array.isArray(payloadObj.tools) && (options?.toolSchemaMode === "openai-functions" || compatibilityFlag)) {
				toolProjection = projectOpenAiFunctionAnthropicTools(payloadObj.tools);
				if (toolProjection.tools.length > 0) payloadObj.tools = toolProjection.tools;
				else delete payloadObj.tools;
			}
			if (options?.toolChoiceMode === "openai-string-modes" || compatibilityFlag) {
				const toolChoice = normalizeOpenAiStringModeAnthropicToolChoice(payloadObj.tool_choice, toolProjection);
				if (toolChoice === void 0) delete payloadObj.tool_choice;
				else payloadObj.tool_choice = toolChoice;
			}
			if (isOpenAIGpt56Model(model) && toolProjection?.tools.some((tool) => tool.type === "function")) payloadObj.reasoning_effort = "none";
		}
	});
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function createOpenAIAnthropicToolPayloadCompatibilityWrapper(baseStreamFn) {
	return createAnthropicToolPayloadCompatibilityWrapper(baseStreamFn, {
		toolSchemaMode: "openai-functions",
		toolChoiceMode: "openai-string-modes"
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/openrouter-model-capabilities.ts
const log = createSubsystemLogger("openrouter-model-capabilities");
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const FETCH_TIMEOUT_MS = 1e4;
const SQLITE_CACHE_OPTIONS = {
	ownerId: "core:openrouter-model-capabilities",
	namespace: "models.v4",
	maxEntries: 1e4
};
function isValidCapabilities(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.name === "string" && Array.isArray(record.input) && typeof record.reasoning === "boolean" && typeof record.contextWindow === "number" && typeof record.maxTokens === "number";
}
function prepareSqliteCacheStore() {
	try {
		return prepareCorePluginStateReplacement(SQLITE_CACHE_OPTIONS);
	} catch (err) {
		log.debug(`Failed to open OpenRouter SQLite cache: ${formatErrorMessage(err)}`);
		return null;
	}
}
async function writeSqliteCache(store, map) {
	try {
		await store?.replace(map);
	} catch (err) {
		const message = formatErrorMessage(err);
		log.debug(`Failed to write OpenRouter SQLite cache: ${message}`);
	}
}
function readSqliteCache() {
	try {
		return parseSqliteCache(createCorePluginStateSyncKeyedStore(SQLITE_CACHE_OPTIONS).entries());
	} catch (err) {
		const message = formatErrorMessage(err);
		log.debug(`Failed to read OpenRouter SQLite cache: ${message}`);
		return;
	}
}
function parseSqliteCache(entries) {
	const map = /* @__PURE__ */ new Map();
	for (const { key, value } of entries) if (isValidCapabilities(value)) map.set(key, value);
	return map.size > 0 ? map : void 0;
}
function trackCatalogWork(run) {
	const unregister = registerPreparedModelRuntimeClose(async () => {
		await work;
	});
	const work = runOutsideAsyncWorkScope(run).finally(unregister);
	return work;
}
let cache;
let fetchInFlight;
let cacheReadInFlight;
const skipNextMissRefresh = /* @__PURE__ */ new Set();
function parseModel(model) {
	const input = ["text"];
	if (((model.architecture?.modality ?? model.modality ?? "").split("->")[0] ?? "").includes("image")) input.push("image");
	const contextWindow = model.top_provider?.context_length ?? model.context_length ?? 128e3;
	const supportedParameters = Array.isArray(model.supported_parameters) ? model.supported_parameters : void 0;
	return {
		name: model.name || model.id,
		input,
		reasoning: supportedParameters?.includes("reasoning") ?? false,
		...normalizeOpenRouterModelReasoning(model.reasoning),
		...supportedParameters ? { supportsTools: supportedParameters.includes("tools") } : {},
		contextWindow,
		maxTokens: model.top_provider?.max_completion_tokens ?? model.max_completion_tokens ?? model.max_output_tokens ?? resolveDefaultModelMaxTokens(contextWindow),
		cost: normalizeOpenRouterModelPricing(model.pricing) ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		}
	};
}
async function doFetch(store) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	let response;
	try {
		response = await (resolveProxyFetchFromEnv() ?? globalThis.fetch)(OPENROUTER_MODELS_URL, { signal: controller.signal });
		if (!response.ok) {
			log.warn(`OpenRouter models API returned ${response.status}`);
			return;
		}
		const models = await readProviderJsonArrayFieldResponse(response, "OpenRouter models response", "data");
		const map = /* @__PURE__ */ new Map();
		for (const value of models) {
			if (!value || typeof value !== "object" || Array.isArray(value)) continue;
			const model = value;
			if (typeof model.id !== "string" || !model.id) continue;
			map.set(model.id, parseModel(model));
		}
		cache = map;
		await writeSqliteCache(store, map);
		log.debug(`Cached ${map.size} OpenRouter models from API`);
	} catch (err) {
		const message = formatErrorMessage(err);
		log.warn(`Failed to fetch OpenRouter models: ${message}`);
	} finally {
		clearTimeout(timeout);
		await cancelUnreadResponseBody(response);
	}
}
function triggerFetch(store) {
	if (fetchInFlight) return;
	const prepared = store === void 0 ? prepareSqliteCacheStore() : store;
	fetchInFlight = trackCatalogWork(() => doFetch(prepared)).finally(() => {
		fetchInFlight = void 0;
	});
}
function ensureOpenRouterModelCache() {
	if (cache) return;
	const stored = readSqliteCache();
	if (stored) {
		cache = stored;
		log.debug(`Loaded ${stored.size} OpenRouter models from SQLite cache`);
		return;
	}
	triggerFetch();
}
/**
* Ensure capabilities for a specific model are available before first use.
*
* Known cached entries return immediately. Unknown entries wait for at most
* one catalog fetch, then leave sync resolution to read from the populated
* cache on the same request.
*
* @deprecated OpenRouter provider-owned catalog helper; do not use from third-party plugins.
*/
async function loadOpenRouterModelCapabilities(modelId) {
	let store;
	if (!cache) {
		cacheReadInFlight ??= trackCatalogWork(async () => {
			const prepared = prepareSqliteCacheStore();
			try {
				const stored = prepared ? parseSqliteCache(await prepared.entries()) : void 0;
				if (stored && !cache) {
					cache = stored;
					log.debug(`Loaded ${stored.size} OpenRouter models from SQLite cache`);
				}
			} catch (err) {
				log.debug(`Failed to read OpenRouter SQLite cache: ${formatErrorMessage(err)}`);
			}
			return prepared;
		}).finally(() => {
			cacheReadInFlight = void 0;
		});
		store = await cacheReadInFlight;
	}
	if (cache?.has(modelId)) return;
	triggerFetch(store);
	await fetchInFlight;
	if (!cache?.has(modelId)) skipNextMissRefresh.add(modelId);
}
/**
* Synchronously look up model capabilities from the cache.
*
* If a model is not found but the cache exists, a background refresh is
* triggered in case it's a newly added model not yet in the cache.
* The cold synchronous read is retained for the v2026.9.8 provider-stream SDK contract.
*
* @deprecated Await loadOpenRouterModelCapabilities, then use getLoadedOpenRouterModelCapabilities.
* Supported through 2026-12-31; removal ships in the first January 2027 stable.
*/
function getOpenRouterModelCapabilities(modelId) {
	warnPluginSdkDeprecation({
		family: "openrouter-model-capabilities",
		method: "getOpenRouterModelCapabilities",
		replacement: "await loadOpenRouterModelCapabilities(), then getLoadedOpenRouterModelCapabilities()",
		compatibility: "The synchronous cache lookup retains its current return value and cold-load behavior."
	});
	const skipMissRefresh = skipNextMissRefresh.delete(modelId);
	if (!skipMissRefresh) ensureOpenRouterModelCache();
	const result = cache?.get(modelId);
	if (!result && !skipMissRefresh && cache) triggerFetch();
	return result;
}
/**
* Read capabilities already loaded in process memory.
*
* Synchronous policy reads follow catalog refreshes without reading SQLite or
* starting a fetch; runtime model resolution loads the catalog first.
*/
function getLoadedOpenRouterModelCapabilities(modelId) {
	skipNextMissRefresh.delete(modelId);
	return cache?.get(modelId);
}
//#endregion
//#region src/plugin-sdk/provider-stream.ts
function hasFastModeParam(extraParams) {
	return Boolean(extraParams && (Object.hasOwn(extraParams, "fastMode") || Object.hasOwn(extraParams, "fast_mode")));
}
function resolveBooleanFastMode(extraParams) {
	const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
	const resolved = typeof raw === "function" ? raw() : raw;
	return resolved === "ultrafast" ? true : typeof resolved === "boolean" ? resolved : void 0;
}
/** Builds provider hook objects for one supported stream-wrapper family. */
function buildProviderStreamFamilyHooks(family) {
	switch (family) {
		case "google-thinking": return { wrapStreamFn: (ctx) => createGoogleThinkingPayloadWrapper(ctx.streamFn, ctx.thinkingLevel) };
		case "moonshot-thinking": return { wrapStreamFn: (ctx) => {
			const thinkingType = resolveMoonshotThinkingType({
				configuredThinking: ctx.extraParams?.thinking,
				thinkingLevel: ctx.thinkingLevel
			});
			const thinkingKeep = resolveMoonshotThinkingKeep({ configuredThinking: ctx.extraParams?.thinking });
			return createMoonshotThinkingWrapper(ctx.streamFn, thinkingType, thinkingKeep);
		} };
		case "kilocode-thinking": return { wrapStreamFn: (ctx) => {
			const thinkingLevel = ctx.modelId === "kilo-auto/balanced" || isProxyReasoningUnsupported(ctx.modelId) ? void 0 : ctx.thinkingLevel;
			return createKilocodeWrapper(ctx.streamFn, thinkingLevel);
		} };
		case "minimax-fast-mode": return { wrapStreamFn: (ctx) => createMinimaxFastModeWrapper(ctx.streamFn, () => resolveBooleanFastMode(ctx.extraParams)) };
		case "openai-responses-defaults": return { wrapStreamFn: (ctx) => {
			let nextStreamFn = createOpenAIAttributionHeadersWrapper(ctx.streamFn);
			const serviceTier = resolveOpenAIServiceTier(ctx.extraParams);
			if (serviceTier || hasFastModeParam(ctx.extraParams)) {
				const underlying = nextStreamFn;
				nextStreamFn = (model, context, options) => {
					const fastMode = resolveOpenAIFastMode(ctx.extraParams);
					return (fastMode === void 0 ? serviceTier ? createOpenAIServiceTierWrapper(underlying, serviceTier) : underlying : fastMode === false && serviceTier ? createOpenAIServiceTierWrapper(underlying, "default") : createOpenAIFastModeWrapper(underlying, fastMode))(model, context, options);
				};
			}
			const textVerbosity = resolveOpenAITextVerbosity(ctx.extraParams);
			if (textVerbosity) nextStreamFn = createOpenAITextVerbosityWrapper(nextStreamFn, textVerbosity);
			nextStreamFn = createCodexNativeWebSearchWrapper(nextStreamFn, {
				config: ctx.config,
				agentDir: ctx.agentDir,
				agentId: ctx.agentId,
				nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy
			});
			nextStreamFn = createOpenAIStringContentWrapper(nextStreamFn);
			return createOpenAIResponsesContextManagementWrapper(createOpenAIReasoningCompatibilityWrapper(createOpenAIThinkingLevelWrapper(nextStreamFn, ctx.thinkingLevel)), ctx.extraParams);
		} };
		case "openrouter-thinking": return { wrapStreamFn: (ctx) => {
			const thinkingLevel = ctx.modelId === "auto" ? void 0 : ctx.thinkingLevel;
			return createOpenRouterWrapper(ctx.streamFn, thinkingLevel, ctx.extraParams);
		} };
		case "tool-stream-default-on": return { wrapStreamFn: (ctx) => createToolStreamWrapper(ctx.streamFn, ctx.extraParams?.tool_stream !== false) };
	}
	throw new Error("Unsupported provider stream family");
}
/** @deprecated Moonshot provider-owned stream hook shortcut; use local provider hooks instead. */
const MOONSHOT_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("moonshot-thinking");
//#endregion
export { loadOpenRouterModelCapabilities as a, getOpenRouterModelCapabilities as i, buildProviderStreamFamilyHooks as n, createAnthropicToolPayloadCompatibilityWrapper as o, getLoadedOpenRouterModelCapabilities as r, createOpenAIAnthropicToolPayloadCompatibilityWrapper as s, MOONSHOT_THINKING_STREAM_HOOKS as t };
