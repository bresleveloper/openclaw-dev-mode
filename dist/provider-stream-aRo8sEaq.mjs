import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-umfRGZ-E.mjs";
import "./http-body-CgfQBa7S.mjs";
import { f as readProviderJsonArrayFieldResponse } from "./provider-http-errors-DmewLLH7.mjs";
import "./model-catalog-normalize-Dxe_x7wi.mjs";
import { t as normalizeOpenRouterModelReasoning } from "./model-catalog-reasoning-BFwHFb-5.mjs";
import { i as normalizeOpenRouterModelPricing } from "./model-catalog-pricing-C9-7BMLS.mjs";
import { n as createCorePluginStateSyncKeyedStore } from "./plugin-state-store-yKq-W0-T.mjs";
import { r as resolveProxyFetchFromEnv } from "./proxy-fetch-Dq9J8411.mjs";
import { i as streamSimple } from "./stream-CL_UFGCU.mjs";
import { S as resolveOpenAITextVerbosity, _ as createOpenAIThinkingLevelWrapper, a as createMinimaxFastModeWrapper, c as createOpenAIAttributionHeadersWrapper, d as createOpenAIFastModeWrapper, f as createOpenAIReasoningCompatibilityWrapper, g as createOpenAITextVerbosityWrapper, h as createOpenAIStringContentWrapper, i as isProxyReasoningUnsupported, m as createOpenAIServiceTierWrapper, p as createOpenAIResponsesContextManagementWrapper, r as createOpenRouterWrapper, s as createCodexNativeWebSearchWrapper, t as createKilocodeWrapper, v as resolveOpenAIFastMode, y as resolveOpenAIServiceTier } from "./proxy-BUToql5i.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-BoUixBWV.mjs";
import { N as createToolStreamWrapper, l as createGoogleThinkingPayloadWrapper } from "./provider-stream-shared-CU7Z6wj0.mjs";
import { n as resolveMoonshotThinkingKeep, r as resolveMoonshotThinkingType, t as createMoonshotThinkingWrapper } from "./moonshot-thinking-JmWKqAlI.mjs";
import { projectRuntimeToolInputSchema } from "@openclaw/ai/internal/tool-schema";
import { isOpenAIGpt56Model } from "@openclaw/ai/internal/openai";
//#region src/llm/providers/stream-wrappers/anthropic-family-tool-payload-compat.ts
function readPayloadField(record, field) {
	try {
		return {
			ok: true,
			value: Reflect.get(record, field)
		};
	} catch {
		return { ok: false };
	}
}
function isProviderSupportedSchemaViolation(violation) {
	return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
function projectJsonObjectSchema(schema, path) {
	const projection = projectRuntimeToolInputSchema(schema, path);
	if (!isRecord(projection.schema) || projection.violations.some((violation) => !isProviderSupportedSchemaViolation(violation))) return;
	const properties = projection.schema.properties;
	const required = projection.schema.required;
	if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && (!Array.isArray(required) || required.some((entry) => typeof entry !== "string"))) return;
	const normalizedSchema = { ...projection.schema };
	if (properties === null) delete normalizedSchema.properties;
	if (required === null) delete normalizedSchema.required;
	return normalizedSchema;
}
function snapshotJsonRecord(value) {
	try {
		const serialized = JSON.stringify(value);
		if (!serialized) return;
		const snapshot = JSON.parse(serialized);
		return isRecord(snapshot) ? snapshot : void 0;
	} catch {
		return;
	}
}
function snapshotToolMetadata(tool) {
	let fields;
	try {
		fields = Object.keys(tool);
	} catch {
		return;
	}
	const metadata = {};
	for (const field of fields) {
		if (field === "function" || field === "type") continue;
		const read = readPayloadField(tool, field);
		if (!read.ok) continue;
		try {
			const serialized = JSON.stringify(read.value);
			if (serialized !== void 0) metadata[field] = JSON.parse(serialized);
		} catch {}
	}
	return metadata;
}
function normalizeOpenAiFunctionAnthropicToolDefinition(tool) {
	if (!isRecord(tool)) return;
	const functionField = readPayloadField(tool, "function");
	if (!functionField.ok) return;
	if (isRecord(functionField.value)) {
		const nameField = readPayloadField(functionField.value, "name");
		if (!nameField.ok) return;
		const name = normalizeOptionalString(nameField.value) ?? void 0;
		if (!name) return;
		const parametersField = readPayloadField(functionField.value, "parameters");
		if (!parametersField.ok) return;
		const parameters = parametersField.value === void 0 ? void 0 : projectJsonObjectSchema(parametersField.value, `${name}.parameters`);
		if (parametersField.value !== void 0 && !parameters) return;
		const functionSpec = {
			name,
			...parameters ? { parameters } : {}
		};
		const descriptionField = readPayloadField(functionField.value, "description");
		if (descriptionField.ok && typeof descriptionField.value === "string" && descriptionField.value.trim()) functionSpec.description = descriptionField.value;
		const strictField = readPayloadField(functionField.value, "strict");
		if (strictField.ok && (typeof strictField.value === "boolean" || strictField.value === null)) functionSpec.strict = strictField.value;
		const metadata = snapshotToolMetadata(tool);
		if (!metadata) return;
		return {
			kind: "function",
			name,
			projectedKind: "function",
			tool: {
				...metadata,
				type: "function",
				function: functionSpec
			}
		};
	}
	const nameField = readPayloadField(tool, "name");
	if (!nameField.ok) return;
	const rawName = normalizeOptionalString(nameField.value) ?? "";
	if (!rawName) {
		const snapshot = snapshotJsonRecord(tool);
		if (!snapshot) return;
		if (snapshot.type === "custom" && isRecord(snapshot.custom)) {
			const name = normalizeOptionalString(snapshot.custom.name) ?? void 0;
			if (!name) return;
			const inputSchema = snapshot.custom.input_schema;
			if (inputSchema === void 0) return {
				kind: "custom",
				name,
				projectedKind: "custom",
				tool: snapshot
			};
			const parameters = projectJsonObjectSchema(inputSchema, `${name}.input_schema`);
			if (!parameters) return;
			const functionSpec = {
				name,
				parameters
			};
			if (typeof snapshot.custom.description === "string" && snapshot.custom.description.trim()) functionSpec.description = snapshot.custom.description;
			return {
				kind: "custom",
				name,
				projectedKind: "function",
				tool: {
					type: "function",
					function: functionSpec
				}
			};
		}
		return { tool: snapshot };
	}
	const inputSchemaField = readPayloadField(tool, "input_schema");
	if (!inputSchemaField.ok) return;
	let parameters = {
		type: "object",
		properties: {}
	};
	if (isRecord(inputSchemaField.value)) {
		parameters = projectJsonObjectSchema(inputSchemaField.value, `${rawName}.input_schema`);
		if (!parameters) return;
	} else {
		const parametersField = readPayloadField(tool, "parameters");
		if (!parametersField.ok) return;
		if (isRecord(parametersField.value)) {
			parameters = projectJsonObjectSchema(parametersField.value, `${rawName}.parameters`);
			if (!parameters) return;
		} else if (inputSchemaField.value !== void 0 || parametersField.value !== void 0) return;
	}
	const functionSpec = {
		name: rawName,
		parameters
	};
	const descriptionField = readPayloadField(tool, "description");
	if (descriptionField.ok && typeof descriptionField.value === "string" && descriptionField.value.trim()) functionSpec.description = descriptionField.value;
	const strictField = readPayloadField(tool, "strict");
	if (strictField.ok && typeof strictField.value === "boolean") functionSpec.strict = strictField.value;
	return {
		kind: "function",
		name: rawName,
		projectedKind: "function",
		tool: {
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
		const snapshot = snapshotJsonRecord(tool);
		if (!snapshot) return [];
		const kind = snapshot.type === "custom" || snapshot.type === "function" ? snapshot.type : void 0;
		const definition = kind && isRecord(snapshot[kind]) ? snapshot[kind] : void 0;
		const name = definition ? normalizeOptionalString(definition.name) ?? "" : "";
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
const SQLITE_CACHE_OWNER_ID = "core:openrouter-model-capabilities";
const SQLITE_CACHE_NAMESPACE = "models.v4";
const SQLITE_CACHE_MAX_ENTRIES = 1e4;
function isValidCapabilities(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.name === "string" && Array.isArray(record.input) && typeof record.reasoning === "boolean" && typeof record.contextWindow === "number" && typeof record.maxTokens === "number";
}
function openSqliteCacheStore() {
	return createCorePluginStateSyncKeyedStore({
		ownerId: SQLITE_CACHE_OWNER_ID,
		namespace: SQLITE_CACHE_NAMESPACE,
		maxEntries: SQLITE_CACHE_MAX_ENTRIES
	});
}
function writeSqliteCache(map) {
	try {
		const store = openSqliteCacheStore();
		store.clear();
		for (const [id, capabilities] of map) store.register(id, capabilities);
	} catch (err) {
		const message = formatErrorMessage(err);
		log.debug(`Failed to write OpenRouter SQLite cache: ${message}`);
	}
}
function readSqliteCache() {
	try {
		const entries = openSqliteCacheStore().entries();
		if (entries.length === 0) return;
		const map = /* @__PURE__ */ new Map();
		for (const { key, value } of entries) if (isValidCapabilities(value)) map.set(key, value);
		return map.size > 0 ? map : void 0;
	} catch (err) {
		const message = formatErrorMessage(err);
		log.debug(`Failed to read OpenRouter SQLite cache: ${message}`);
		return;
	}
}
let cache;
let fetchInFlight;
const skipNextMissRefresh = /* @__PURE__ */ new Set();
function parseModel(model) {
	const input = ["text"];
	if (((model.architecture?.modality ?? model.modality ?? "").split("->")[0] ?? "").includes("image")) input.push("image");
	const supportedParameters = Array.isArray(model.supported_parameters) ? model.supported_parameters : void 0;
	return {
		name: model.name || model.id,
		input,
		reasoning: supportedParameters?.includes("reasoning") ?? false,
		...normalizeOpenRouterModelReasoning(model.reasoning),
		...supportedParameters ? { supportsTools: supportedParameters.includes("tools") } : {},
		contextWindow: model.top_provider?.context_length ?? model.context_length ?? 128e3,
		maxTokens: model.top_provider?.max_completion_tokens ?? model.max_completion_tokens ?? model.max_output_tokens ?? 8192,
		cost: normalizeOpenRouterModelPricing(model.pricing) ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		}
	};
}
async function doFetch() {
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
		writeSqliteCache(map);
		log.debug(`Cached ${map.size} OpenRouter models from API`);
	} catch (err) {
		const message = formatErrorMessage(err);
		log.warn(`Failed to fetch OpenRouter models: ${message}`);
	} finally {
		clearTimeout(timeout);
		await cancelUnreadResponseBody(response);
	}
}
function triggerFetch() {
	if (fetchInFlight) return;
	fetchInFlight = doFetch().finally(() => {
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
	ensureOpenRouterModelCache();
	if (cache?.has(modelId)) return;
	triggerFetch();
	await fetchInFlight;
	if (!cache?.has(modelId)) skipNextMissRefresh.add(modelId);
}
/**
* Synchronously look up model capabilities from the cache.
*
* If a model is not found but the cache exists, a background refresh is
* triggered in case it's a newly added model not yet in the cache.
*
* @deprecated OpenRouter provider-owned catalog helper; do not use from third-party plugins.
*/
function getOpenRouterModelCapabilities(modelId) {
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
			if (!serviceTier && hasFastModeParam(ctx.extraParams)) nextStreamFn = createOpenAIFastModeWrapper(nextStreamFn, () => resolveOpenAIFastMode(ctx.extraParams));
			if (serviceTier) nextStreamFn = createOpenAIServiceTierWrapper(nextStreamFn, serviceTier);
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
