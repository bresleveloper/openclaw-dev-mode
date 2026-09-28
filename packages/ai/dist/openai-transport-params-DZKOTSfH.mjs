import { a as normalizeOptionalString, n as normalizeLowercaseStringOrEmpty } from "./string-coerce-fsri9iCu.mjs";
import { o as isRecord, r as asOptionalObjectRecord } from "./record-coerce-DwRYMj3t.mjs";
import { a as normalizeOpenAIReasoningEffort, c as resolveOpenAIReasoningEffortMapping, f as MODEL_CATALOG_THINKING_LEVELS, m as resolveOpenAIThinkingApi, o as resolveOpenAIModelReasoningEfforts, s as resolveOpenAIReasoningEffortForModel, u as supportsOpenAIReasoningEffort } from "./openai-reasoning-effort-ash8dPrd.mjs";
import { A as headersToRecord, M as calculateCost, N as clampThinkingLevel, j as applyProviderReportedUsageCost, n as getAiTransportHost } from "./host-yTvBrYM2.mjs";
import { n as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-CjV_2IRI.mjs";
import { i as isCodeModeModelVisibleToolName } from "./transport-utils-03Qi0CN2.mjs";
import { i as resolveOpenAICompletionsCompat, o as usesNativeOpenAICodexResponsesBackend } from "./openai-completions-compat-CUollwl6.mjs";
import { n as resolveModelRequestTimeoutMs, o as resolveProviderRequestPolicyConfig } from "./host-policy-DZO3oPPk.mjs";
import { n as projectRuntimeToolInputSchema, t as prepareRuntimeToolInputSchema } from "./tool-schema-json-projection-CD9c_fK8.mjs";
import { p as notifyProviderHttpResponse, v as transportAbortError } from "./transport-stream-shared-B5RioB_Q.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Bcunsn4I.mjs";
import { a as resolveOpenAIProjectedToolsStrictToolFlag, t as findOpenAIStrictToolProjectionDiagnostics } from "./openai-tool-schema-D4BMcj2D.mjs";
import { i as OPENAI_RESPONSES_APIS } from "./openai-responses-contracts-DWrfMODE.mjs";
import { hash } from "node:crypto";
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
function redactIdentifier(value, opts) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "-";
	const len = opts?.len ?? 12;
	return `sha256:${sha256HexPrefixCore(trimmed, Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12)}`;
}
//#endregion
//#region packages/ai/src/transports/openai-transport-shared.ts
/** Shared options, usage shape, cache identity, ordering, and stream scheduling for OpenAI APIs. */
const MODEL_STREAM_COOPERATIVE_YIELD_INTERVAL_MS = 12;
const MODEL_STREAM_COOPERATIVE_YIELD_MAX_EVENTS = 64;
const OPENAI_RESPONSE_MODEL_HEADER_NAMES = /* @__PURE__ */ new Set(["openai-model", "x-openai-model"]);
const OPENAI_RESPONSE_MODEL_EVENT_TYPES = /* @__PURE__ */ new Set([
	"response.created",
	"response.in_progress",
	"response.completed",
	"response.done",
	"response.incomplete",
	"response.failed"
]);
const OPENAI_DATED_MODEL_SUFFIX = /-(?:\d{8}|\d{4}-\d{2}-\d{2})$/;
const GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP = "skip_thought_signature_validator";
const log = {
	debug(message, data) {
		getAiTransportHost().logDebug("openai-transport", () => ({
			message,
			data
		}));
	},
	info(message, data) {
		getAiTransportHost().logInfo("openai-transport", message, data);
	},
	warn(message, data) {
		getAiTransportHost().logWarn("openai-transport", message, data);
	}
};
const OPENAI_RESPONSE_MODEL_CONFLICT = "Conflicting OpenAI response model attestations";
function splitOpenAIResponseModelHeader(value) {
	return value ? value.split(",").map((part) => part.trim()).filter(Boolean) : [];
}
function readOpenAIResponseModelHeaders(headers) {
	return [...OPENAI_RESPONSE_MODEL_HEADER_NAMES].flatMap((name) => splitOpenAIResponseModelHeader(headers.get(name)));
}
function readOpenAIResponseModelHeaderRecord(headers) {
	if (!isRecord(headers)) return [];
	return Object.entries(headers).filter(([name]) => OPENAI_RESPONSE_MODEL_HEADER_NAMES.has(name.toLowerCase())).flatMap(([, value]) => typeof value === "string" ? splitOpenAIResponseModelHeader(value) : []);
}
function readOpenAIResponseModelEvent(event) {
	if (!isRecord(event)) return [];
	const response = isRecord(event.response) ? event.response : void 0;
	return [
		...OPENAI_RESPONSE_MODEL_EVENT_TYPES.has(String(event.type)) && typeof response?.model === "string" && response.model.trim() ? [response.model.trim()] : [],
		...readOpenAIResponseModelHeaderRecord(response?.headers),
		...readOpenAIResponseModelHeaderRecord(event.headers)
	];
}
function reconcileOpenAIResponseModels(current, observed) {
	if (!current || current === observed) return observed;
	const currentBase = current.replace(OPENAI_DATED_MODEL_SUFFIX, "");
	const observedBase = observed.replace(OPENAI_DATED_MODEL_SUFFIX, "");
	if (currentBase !== observedBase) return;
	if (currentBase === current && observedBase !== observed) return observed;
	if (observedBase === observed && currentBase !== current) return current;
}
function createResponseModelTracker(enabled = true) {
	let responseModel;
	const observe = (models) => {
		for (const model of models) {
			const reconciled = reconcileOpenAIResponseModels(responseModel, model);
			if (!reconciled) throw new Error(OPENAI_RESPONSE_MODEL_CONFLICT);
			responseModel = reconciled;
		}
	};
	const begin = (headers) => {
		responseModel = void 0;
		if (enabled && headers) observe(readOpenAIResponseModelHeaders(headers));
	};
	const observeEvent = (event) => {
		if (enabled) observe(readOpenAIResponseModelEvent(event));
		return responseModel;
	};
	const resolve = () => responseModel;
	return {
		begin,
		observeEvent,
		resolve,
		track(response, stream) {
			if (!enabled) return stream;
			return (async function* () {
				begin(response?.headers);
				for await (const event of stream) {
					observeEvent(event);
					yield event;
				}
			})();
		},
		terminalOptions: enabled ? { resolveResponseModel: resolve } : {}
	};
}
function resolveOpenAIClientBaseUrl(model, baseUrl = model.baseUrl) {
	if (baseUrl?.trim()) return baseUrl;
	if (model.provider.trim().toLowerCase() === "openai") return;
	throw new Error(`Provider "${model.provider}" requires an explicit base URL before using an OpenAI-compatible API. Reload provider metadata or configure an endpoint.`);
}
const EMPTY_OPENAI_COMPLETIONS_REASONING_BATCH = {
	deltas: [],
	mirroredThinking: [],
	hasThinking: false,
	hasVisibleText: false
};
const OPENAI_COMPLETIONS_REASONING_FIELDS = [
	"reasoning_content",
	"reasoning",
	"reasoning_text"
];
function appendOpenAICompletionsReasoningDelta(batch, next) {
	if (next.kind === "thinking") batch.hasThinking = true;
	else batch.hasVisibleText = true;
	const previous = batch.deltas[batch.deltas.length - 1];
	if (!previous || previous.kind !== next.kind) {
		batch.deltas.push(next);
		if (next.kind === "thinking") batch.mirroredThinking.push(next.text);
		return;
	}
	if (next.kind === "thinking" && previous.kind === "thinking") {
		if (previous.signature !== next.signature) {
			batch.deltas.push(next);
			batch.mirroredThinking.push(next.text);
			return;
		}
		previous.text += next.text;
		batch.mirroredThinking[batch.mirroredThinking.length - 1] += next.text;
		return;
	}
	previous.text += next.text;
}
function createOpenAICompletionsReasoningBatch() {
	return {
		deltas: [],
		mirroredThinking: [],
		hasThinking: false,
		hasVisibleText: false
	};
}
function readOpenAICompletionsReasoningBatch(delta, visibleReasoningDetailTypes) {
	let batch;
	const reasoningDetails = delta.reasoning_details;
	let usedReasoningThinkingDetails = false;
	if (Array.isArray(reasoningDetails)) for (const item of reasoningDetails) {
		if (!isRecord(item)) continue;
		const detail = item;
		if (typeof detail.text !== "string" || !detail.text) continue;
		if (detail.type === "reasoning.text") {
			usedReasoningThinkingDetails = true;
			batch ??= createOpenAICompletionsReasoningBatch();
			appendOpenAICompletionsReasoningDelta(batch, {
				kind: "thinking",
				signature: "reasoning_details",
				text: detail.text
			});
			continue;
		}
		if (typeof detail.type === "string" && visibleReasoningDetailTypes.has(detail.type)) {
			batch ??= createOpenAICompletionsReasoningBatch();
			appendOpenAICompletionsReasoningDelta(batch, {
				kind: "text",
				text: detail.text,
				source: "reasoning_detail"
			});
		}
	}
	if (!usedReasoningThinkingDetails) for (const field of OPENAI_COMPLETIONS_REASONING_FIELDS) {
		const value = delta[field];
		if (typeof value === "string" && value.length > 0) {
			batch ??= createOpenAICompletionsReasoningBatch();
			appendOpenAICompletionsReasoningDelta(batch, {
				kind: "thinking",
				signature: field,
				text: value
			});
			break;
		}
	}
	return batch ?? EMPTY_OPENAI_COMPLETIONS_REASONING_BATCH;
}
function parseOpenAICompletionsUsage(rawUsage, model, options) {
	const cacheRead = rawUsage.prompt_tokens_details?.cached_tokens ?? rawUsage.prompt_cache_hit_tokens ?? 0;
	const cacheWrite = rawUsage.prompt_tokens_details?.cache_write_tokens ?? rawUsage.prompt_tokens_details?.cache_creation_input_tokens ?? rawUsage.cache_creation_input_tokens ?? 0;
	const input = Math.max(0, (rawUsage.prompt_tokens || 0) - cacheRead - cacheWrite);
	const output = rawUsage.completion_tokens || 0;
	const reasoningTokens = rawUsage.completion_tokens_details?.reasoning_tokens;
	const usage = {
		input,
		output,
		cacheRead,
		cacheWrite,
		...options?.includeReasoningTokens !== false && typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens) ? { reasoningTokens } : {},
		totalTokens: input + output + cacheRead + cacheWrite,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
	calculateCost(model, usage);
	applyProviderReportedUsageCost(usage, rawUsage.cost);
	return usage;
}
function createOpenAIResponseHook(onResponse, response, model) {
	return onResponse ? () => onResponse({
		status: response.status,
		headers: headersToRecord(response.headers)
	}, model) : void 0;
}
function createOpenAIProviderAcceptanceHook(options, response, model) {
	return () => notifyProviderHttpResponse({
		options,
		response,
		model
	});
}
function throwIfModelStreamAborted(signal) {
	if (signal?.aborted) throw transportAbortError(signal);
}
/** Measure one UTF-8 append without double-counting a surrogate pair split across chunks. */
function measureUtf8AppendBytes(bufferEndsWithHighSurrogate, chunk) {
	let bytes = Buffer.byteLength(chunk, "utf8");
	if (!chunk) return {
		bytes,
		endsWithHighSurrogate: bufferEndsWithHighSurrogate
	};
	const nextCodeUnit = chunk.charCodeAt(0);
	if (bufferEndsWithHighSurrogate && nextCodeUnit >= 56320 && nextCodeUnit <= 57343) bytes -= 2;
	const finalCodeUnit = chunk.charCodeAt(chunk.length - 1);
	return {
		bytes,
		endsWithHighSurrogate: finalCodeUnit >= 55296 && finalCodeUnit <= 56319
	};
}
function createModelStreamCooperativeScheduler(signal) {
	let lastYieldedAt = Date.now();
	let eventsSinceYield = 0;
	return { async afterEvent() {
		throwIfModelStreamAborted(signal);
		eventsSinceYield += 1;
		if (eventsSinceYield < MODEL_STREAM_COOPERATIVE_YIELD_MAX_EVENTS && Date.now() - lastYieldedAt < MODEL_STREAM_COOPERATIVE_YIELD_INTERVAL_MS) return;
		eventsSinceYield = 0;
		await new Promise((resolve) => {
			setTimeout(resolve, 0);
		});
		throwIfModelStreamAborted(signal);
		lastYieldedAt = Date.now();
	} };
}
function resolvePromptCacheKey(options, cacheRetention) {
	if (cacheRetention === "none") return;
	return clampOpenAIPromptCacheKey(options?.promptCacheKey ?? options?.sessionId);
}
function isOpenAICompletionsThinkingEnabled(effort) {
	const normalized = effort.trim().toLowerCase();
	return normalized !== "off" && normalized !== "none";
}
function readOpenAICompletionsContentDeltas(content, topLevelRefusal, mirroredThinking = []) {
	let deltas = readOpenAICompletionsContentPartDeltas(content);
	if (mirroredThinking.length > 0) {
		const structuredThinking = deltas.filter((delta) => delta.kind === "thinking").map((delta) => delta.text);
		const mirrorsCombinedThinking = structuredThinking.length > 1 && mirroredThinking.includes(structuredThinking.join(""));
		deltas = deltas.filter((delta) => delta.kind !== "thinking" || !mirrorsCombinedThinking && !mirroredThinking.includes(delta.text));
	}
	if (typeof topLevelRefusal !== "string" || !topLevelRefusal) return deltas;
	const structuredRefusals = deltas.filter((delta) => delta.kind === "text" && delta.source === "refusal").map((delta) => delta.text);
	if (structuredRefusals.some((refusal) => refusal === topLevelRefusal) || structuredRefusals.length > 1 && structuredRefusals.join("") === topLevelRefusal) return deltas;
	return [...deltas, {
		kind: "text",
		text: topLevelRefusal,
		source: "refusal"
	}];
}
function readOpenAICompletionsContentPartDeltas(content) {
	if (typeof content === "string") return content ? [{
		kind: "text",
		text: content
	}] : [];
	if (Array.isArray(content)) return content.flatMap(readOpenAICompletionsContentPartDeltas);
	if (!content || typeof content !== "object") return [];
	const record = content;
	const type = typeof record.type === "string" ? record.type.toLowerCase() : "";
	const extractText = (value) => {
		if (typeof value === "string") return value;
		if (Array.isArray(value)) return value.map(extractText).join("");
		if (value && typeof value === "object") {
			const nested = value;
			return extractText(nested.text ?? nested.content ?? nested.thinking ?? nested.refusal);
		}
		return "";
	};
	const text = extractText(record.text ?? record.content ?? record.thinking ?? record.refusal);
	if (!text) return [];
	if (type.includes("thinking") || type.includes("reasoning")) return [{
		kind: "thinking",
		text
	}];
	if (type === "refusal") return [{
		kind: "text",
		text,
		source: "refusal"
	}];
	if (["text", "output_text"].includes(type) || type.endsWith(".output_text")) return [{
		kind: "text",
		text
	}];
	return [];
}
//#endregion
//#region packages/ai/src/transports/openai-reasoning-compat.ts
/** Explicit model reasoning-effort compatibility metadata. */
function readCompatReasoningEffortMap(compat) {
	const rawMap = asOptionalObjectRecord(asOptionalObjectRecord(compat)?.reasoningEffortMap);
	if (!rawMap) return {};
	return Object.fromEntries(Object.entries(rawMap).filter((entry) => typeof entry[1] === "string"));
}
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
function resolveOpenAIReasoningEffortMap(model, fallbackMap = {}) {
	return {
		...fallbackMap,
		...readCompatReasoningEffortMap(model.compat)
	};
}
//#endregion
//#region packages/ai/src/providers/openai-request-reasoning.ts
/** Preserve explicit off until the selected route maps it to its native value. */
function resolveOpenAISimpleReasoningEffort(model, reasoning) {
	return reasoning === void 0 ? void 0 : clampThinkingLevel(model, reasoning);
}
function resolveOpenAIRequestReasoning(model, reasoning) {
	const requested = normalizeOpenAIReasoningEffort(reasoning ?? "off");
	const modelLevel = MODEL_CATALOG_THINKING_LEVELS.find((candidate) => candidate === requested);
	const modelMapped = modelLevel ? model.thinkingLevelMap?.[modelLevel] : void 0;
	const mapped = modelMapped === null ? null : resolveOpenAIReasoningEffortMapping(requested, resolveOpenAIReasoningEffortMap(model)) ?? modelMapped;
	const intent = mapped !== void 0 ? mapped?.trim() : reasoning === void 0 ? void 0 : requested;
	const normalizedIntent = normalizeOpenAIReasoningEffort(intent ?? "off");
	const supported = resolveOpenAIModelReasoningEfforts(model);
	const effort = !model.reasoning || supported?.length === 0 || intent === void 0 ? void 0 : supported === void 0 ? mapped !== void 0 ? intent : requested === "off" ? "none" : requested : resolveOpenAIReasoningEffortForModel({
		model,
		effort: requested,
		fallbackMap: { [requested]: intent }
	});
	return {
		effort: effort === "none" && resolveOpenAIThinkingApi(model.api) === "openai-chatgpt-responses" && !supportsOpenAIReasoningEffort(model.id === "gpt-6-sol" || model.id === "gpt-6-luna" ? model : { compat: model.compat }, "none") ? void 0 : effort,
		thinkingEnabled: intent === void 0 ? void 0 : model.reasoning && normalizedIntent !== "off" && normalizedIntent !== "none"
	};
}
//#endregion
//#region packages/ai/src/providers/openai-tool-projection.ts
function unreadableToolDiagnostic(toolIndex) {
	return {
		toolIndex,
		violations: [`tool[${toolIndex}] is unreadable`]
	};
}
/** Snapshots direct/custom tool descriptors before OpenAI payload construction. */
function projectOpenAITools(tools) {
	return projectOpenAIToolDescriptors(tools);
}
/** Package-private facts are consumed before the projection or payload can escape. */
function prepareOpenAITools(tools) {
	const schemas = /* @__PURE__ */ new Map();
	return {
		projection: projectOpenAIToolDescriptors(tools, schemas),
		schemas
	};
}
function projectOpenAIToolDescriptors(tools, schemas) {
	let inputToolCount;
	try {
		inputToolCount = tools.length;
	} catch {
		return {
			inputToolCount: 0,
			tools: [],
			diagnostics: [unreadableToolDiagnostic(0)]
		};
	}
	const projectedTools = [];
	const diagnostics = [];
	for (let toolIndex = 0; toolIndex < inputToolCount; toolIndex += 1) {
		let tool;
		try {
			const candidate = tools[toolIndex];
			if (!candidate) {
				diagnostics.push(unreadableToolDiagnostic(toolIndex));
				continue;
			}
			tool = candidate;
		} catch {
			diagnostics.push(unreadableToolDiagnostic(toolIndex));
			continue;
		}
		let name;
		try {
			name = tool.name;
		} catch {
			diagnostics.push({
				toolIndex,
				violations: [`tool[${toolIndex}].name is unreadable`]
			});
			continue;
		}
		if (typeof name !== "string" || !name) {
			diagnostics.push({
				toolIndex,
				violations: [`tool[${toolIndex}].name is empty`]
			});
			continue;
		}
		let parameters;
		try {
			parameters = tool.parameters;
		} catch {
			diagnostics.push({
				toolIndex,
				toolName: name,
				violations: [`${name}.parameters is unreadable`]
			});
			continue;
		}
		const prepared = schemas ? prepareRuntimeToolInputSchema(parameters ?? {}, `${name}.parameters`) : void 0;
		const schemaProjection = prepared?.projection ?? projectRuntimeToolInputSchema(parameters ?? {}, `${name}.parameters`);
		if (!isRecord(schemaProjection.schema) || schemaProjection.violations.length > 0) {
			diagnostics.push({
				toolIndex,
				toolName: name,
				violations: schemaProjection.violations.length > 0 ? schemaProjection.violations : [`${name}.parameters must be a JSON object schema`]
			});
			continue;
		}
		if (prepared?.normalization) schemas?.set(schemaProjection.schema, prepared.normalization);
		let descriptionValue;
		try {
			descriptionValue = tool.description;
		} catch {}
		const description = typeof descriptionValue === "string" ? descriptionValue : void 0;
		projectedTools.push({
			toolIndex,
			name,
			...description !== void 0 ? { description } : {},
			parameters: schemaProjection.schema
		});
	}
	return {
		inputToolCount,
		tools: projectedTools,
		diagnostics
	};
}
function requireProjectedFunction(name, projection, choiceLabel) {
	if (!projection.tools.some((tool) => tool.name === name)) throw new Error(`${choiceLabel} requested unavailable tool "${name}" after schema conversion`);
}
/** Keeps Responses tool choices aligned with surviving function schemas. */
function reconcileOpenAIResponsesToolChoice(choice, projection) {
	if (choice === "auto") return projection.tools.length > 0 ? choice : void 0;
	if (choice === "required") {
		if (projection.tools.length === 0) throw new Error("OpenAI Responses tool_choice requires a tool, but no tools survived schema conversion");
		return choice;
	}
	if (choice === "none" || !isRecord(choice)) return choice;
	const choiceType = choice.type;
	if (choiceType === "function") {
		const functionName = choice.name;
		if (typeof functionName !== "string") return choice;
		requireProjectedFunction(functionName, projection, "OpenAI Responses tool_choice");
		return {
			type: "function",
			name: functionName
		};
	}
	if (choiceType !== "allowed_tools") return choice;
	const mode = choice.mode;
	const tools = choice.tools;
	if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) return choice;
	const normalizedAllowedTools = [];
	for (const tool of tools) {
		if (!isRecord(tool) || tool.type !== "function") {
			normalizedAllowedTools.push(tool);
			continue;
		}
		const functionName = tool.name;
		if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) normalizedAllowedTools.push({
			type: "function",
			name: functionName
		});
	}
	if (normalizedAllowedTools.length === 0) {
		if (mode === "auto") return "none";
		throw new Error("OpenAI Responses tool_choice requires a tool, but no allowed tools survived schema conversion");
	}
	return {
		type: "allowed_tools",
		mode,
		tools: normalizedAllowedTools
	};
}
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
function reconcileOpenAICompletionsToolChoice(choice, projection) {
	if (choice === "auto") return projection.tools.length > 0 ? choice : void 0;
	if (choice === "required") {
		if (projection.tools.length === 0) throw new Error("OpenAI Chat Completions tool_choice requires a tool, but no tools survived schema conversion");
		return choice;
	}
	if (choice === "none" || !isRecord(choice)) return choice;
	const choiceType = choice.type;
	if (choiceType === "custom") throw new Error("OpenAI Chat Completions custom tool_choice is unsupported because this adapter emits function tools only");
	if (choiceType === "function") {
		const functionChoice = choice.function;
		if (!isRecord(functionChoice)) return choice;
		const functionName = functionChoice.name;
		if (typeof functionName !== "string") return choice;
		requireProjectedFunction(functionName, projection, "OpenAI Chat Completions tool_choice");
		return {
			type: "function",
			function: { name: functionName }
		};
	}
	if (choiceType !== "allowed_tools") return choice;
	const allowedConfig = choice.allowed_tools;
	if (!isRecord(allowedConfig)) return choice;
	const mode = allowedConfig.mode;
	const tools = allowedConfig.tools;
	if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) return choice;
	const normalizedAllowedTools = [];
	for (const tool of tools) {
		if (!isRecord(tool) || tool.type !== "function") continue;
		const functionChoice = tool.function;
		const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
		if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) normalizedAllowedTools.push({
			type: "function",
			function: { name: functionName }
		});
	}
	if (normalizedAllowedTools.length === 0) {
		if (mode === "auto") return "none";
		throw new Error("OpenAI Chat Completions tool_choice requires a tool, but no allowed tools survived schema conversion");
	}
	return {
		type: "allowed_tools",
		allowed_tools: {
			mode,
			tools: normalizedAllowedTools
		}
	};
}
//#endregion
//#region packages/ai/src/transports/openai-transport-params.ts
const MAX_OPENAI_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 256;
const loggedOpenAIStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
const OPENAI_COMPLETIONS_APIS = /* @__PURE__ */ new Set(["openai-completions", "openclaw-openai-completions-transport"]);
function readToolPayloadField(record, field) {
	try {
		return Object.hasOwn(record, field) ? record[field] : void 0;
	} catch {
		return;
	}
}
function readCodeModePayloadToolName(tool) {
	if (!isRecord(tool)) return;
	const name = readToolPayloadField(tool, "name");
	if (typeof name === "string") return name;
	const fn = readToolPayloadField(tool, "function");
	if (!isRecord(fn)) return;
	const fnName = readToolPayloadField(fn, "name");
	return typeof fnName === "string" ? fnName : void 0;
}
function readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes) {
	if (!isRecord(tool)) return;
	const type = readToolPayloadField(tool, "type");
	if (typeof type === "string" && allowedHostedToolTypes?.has(type)) {
		try {
			if (Object.hasOwn(tool, "name") || Object.hasOwn(tool, "function") || Object.hasOwn(tool, "functionDeclarations") || Object.hasOwn(tool, "function_declarations")) return false;
		} catch {
			return false;
		}
		return `hosted:${type}`;
	}
	const name = readCodeModePayloadToolName(tool);
	return typeof name === "string" && isCodeModeModelVisibleToolName(name, visibleToolNames) ? `client:${name}` : void 0;
}
function readCodeModePayloadToolIdentities(payload) {
	if (!isRecord(payload)) return [];
	const tools = readToolPayloadField(payload, "tools");
	if (!Array.isArray(tools)) return [];
	return tools.flatMap((tool) => {
		if (!isRecord(tool)) return [];
		const identities = [];
		const name = readCodeModePayloadToolName(tool);
		if (name) identities.push(`client:${name}`);
		for (const key of ["functionDeclarations", "function_declarations"]) {
			const declarations = readToolPayloadField(tool, key);
			if (!Array.isArray(declarations)) continue;
			for (const declaration of declarations) {
				const declarationName = readCodeModePayloadToolName(declaration);
				if (declarationName) identities.push(`client:${declarationName}`);
			}
		}
		const type = readToolPayloadField(tool, "type");
		if (typeof type === "string" && type !== "function") identities.push(`hosted:${type}`);
		return identities;
	});
}
function filterCodeModePayloadTools(payload, visibleToolNames, allowedHostedToolTypes, observer) {
	if (!isRecord(payload)) return;
	const tools = readToolPayloadField(payload, "tools");
	if (!Array.isArray(tools)) return;
	const beforeToolIdentities = observer ? readCodeModePayloadToolIdentities(payload) : void 0;
	payload.tools = tools.flatMap((tool) => {
		const identity = readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes);
		if (identity) return [tool];
		if (identity === false) return [];
		if (!isRecord(tool)) return [];
		const filteredGroups = {};
		for (const key of ["functionDeclarations", "function_declarations"]) {
			const declarations = readToolPayloadField(tool, key);
			if (!Array.isArray(declarations)) continue;
			const filtered = declarations.filter((declaration) => {
				const declarationName = readCodeModePayloadToolName(declaration);
				return typeof declarationName === "string" && isCodeModeModelVisibleToolName(declarationName, visibleToolNames);
			});
			if (filtered.length > 0) filteredGroups[key] = filtered;
		}
		return Object.keys(filteredGroups).length > 0 ? [filteredGroups] : [];
	});
	if (beforeToolIdentities) observer?.({
		beforeToolIdentities,
		afterToolIdentities: readCodeModePayloadToolIdentities(payload)
	});
}
function resolveCodeModeResponsesVisibleToolNames(context) {
	return new Set((context.tools ?? []).map(readCodeModePayloadToolName).filter((name) => typeof name === "string"));
}
function enforceCodeModeResponsesToolSurface(payload, visibleToolNames, allowedHostedToolTypes, observer) {
	if (!isRecord(payload)) return;
	const tools = readToolPayloadField(payload, "tools");
	if (!Array.isArray(tools)) return;
	const beforeToolIdentities = observer ? readCodeModePayloadToolIdentities(payload) : void 0;
	payload.tools = tools.filter((tool) => Boolean(readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes)));
	if (beforeToolIdentities) observer?.({
		beforeToolIdentities,
		afterToolIdentities: readCodeModePayloadToolIdentities(payload)
	});
}
function assertCodeModeResponsesToolSurface(payload, visibleToolNames, allowedHostedToolTypes) {
	const tools = isRecord(payload) ? readToolPayloadField(payload, "tools") : void 0;
	if (!Array.isArray(tools)) throw new Error("Code mode payload tool surface violation: expected exec,wait; got no tools");
	const identities = tools.map((tool) => readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes));
	const names = identities.flatMap((identity) => typeof identity === "string" && identity.startsWith("client:") ? [identity.slice(7)] : []).toSorted((left, right) => left.localeCompare(right));
	if (names.length >= 2 && identities.every((identity) => typeof identity === "string") && new Set(identities).size === identities.length && names.includes("exec") && names.includes("wait")) return;
	throw new Error(`Code mode payload tool surface violation: expected exec,wait plus direct-only tools; got ${names.length > 0 ? names.join(",") : "none"}`);
}
function resolveOpenAIStrictToolFlagWithDiagnostics(projection, strictSetting, context) {
	const strict = resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
	if (strictSetting === true && strict === false) getAiTransportHost().logDebug("openai-transport", () => {
		const diagnostics = findOpenAIStrictToolProjectionDiagnostics(projection);
		const key = sha256Hex(JSON.stringify({
			transport: context.transport,
			provider: context.model.provider ?? null,
			model: context.model.id ?? null,
			diagnostics: diagnostics.map((entry) => ({
				toolIndex: entry.toolIndex,
				toolName: entry.toolName ?? null,
				violations: entry.violations
			}))
		}));
		if (loggedOpenAIStrictToolDowngradeDiagnosticKeys.has(key)) return null;
		if (loggedOpenAIStrictToolDowngradeDiagnosticKeys.size >= MAX_OPENAI_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS) loggedOpenAIStrictToolDowngradeDiagnosticKeys.clear();
		loggedOpenAIStrictToolDowngradeDiagnosticKeys.add(key);
		const sample = diagnostics.slice(0, 5).map((entry) => ({
			tool: entry.toolName ?? `tool[${entry.toolIndex}]`,
			violations: entry.violations.slice(0, 8)
		}));
		return {
			message: `OpenAI ${context.transport} tool schema strict mode downgraded to strict=false for ${context.model.provider ?? "unknown"}/${context.model.id ?? "unknown"} because ${diagnostics.length} tool schema(s) are not strict-compatible`,
			data: {
				transport: context.transport,
				provider: context.model.provider,
				model: context.model.id,
				incompatibleToolCount: diagnostics.length,
				sample
			}
		};
	});
	return strict;
}
function buildOpenAIClientHeaders(model, context, optionHeaders, turnHeaders, sessionId, cacheRetention) {
	const providerHeaders = { ...model.headers };
	if (model.provider === "github-copilot") Object.assign(providerHeaders, getAiTransportHost().buildCopilotDynamicHeaders(context.messages));
	if (OPENAI_COMPLETIONS_APIS.has(model.api) && sessionId && cacheRetention !== "none") {
		const { sessionAffinity } = resolveOpenAICompletionsCompat(model);
		if (sessionAffinity !== "none") {
			const affinityValue = clampOpenAIPromptCacheKey(sessionId) ?? sessionId;
			const affinityHeaders = sessionAffinity === "openrouter" ? ["x-session-id"] : [
				"session_id",
				"x-client-request-id",
				"x-session-affinity"
			];
			const configuredHeaders = new Set(Object.keys(providerHeaders).map((key) => key.toLowerCase()));
			for (const name of affinityHeaders) if (!configuredHeaders.has(name)) providerHeaders[name] = affinityValue;
		}
	}
	const callerHeaders = {
		...optionHeaders,
		...turnHeaders
	};
	const resolvedHeaders = resolveProviderRequestPolicyConfig(model, {
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		capability: "llm",
		transport: "stream",
		providerHeaders,
		callerHeaders: Object.keys(callerHeaders).length > 0 ? callerHeaders : void 0,
		precedence: "caller-wins"
	}).headers ?? {};
	const sendSessionIdHeader = (OPENAI_RESPONSES_APIS.has(model.api) && model.compat && "sendSessionIdHeader" in model.compat ? model.compat?.sendSessionIdHeader : void 0) ?? usesNativeOpenAICodexResponsesBackend(model);
	if (sessionId && cacheRetention !== "none" && sendSessionIdHeader && !Object.keys(resolvedHeaders).some((key) => normalizeLowercaseStringOrEmpty(key) === "session_id")) resolvedHeaders.session_id = clampOpenAIPromptCacheKey(sessionId) ?? sessionId;
	return resolveOpencodeSessionHeaders(model, {
		sessionId,
		headers: resolvedHeaders
	}) ?? resolvedHeaders;
}
function buildOpenAISdkClientOptions(model) {
	const timeout = resolveModelRequestTimeoutMs(model);
	return {
		...timeout === void 0 ? {} : { timeout },
		maxRetries: 0
	};
}
function buildOpenAISdkRequestOptions(model, signal, options) {
	const timeout = resolveModelRequestTimeoutMs(model, options?.timeoutMs);
	const headers = options?.stream === true && usesNativeOpenAICodexResponsesBackend(model) ? { Accept: "text/event-stream" } : void 0;
	if (timeout === void 0 && !signal && !headers) return;
	return {
		...headers ? { headers } : {},
		...signal ? { signal } : {},
		...timeout !== void 0 ? { timeout } : {},
		maxRetries: 0
	};
}
function getCompat(model) {
	const resolved = resolveOpenAICompletionsCompat(model);
	const compat = model.compat ?? {};
	return {
		...resolved,
		cacheControlFormat: resolved.cacheControlFormat,
		reasoningEffortMap: resolveOpenAIReasoningEffortMap(model, {}),
		openRouterRouting: resolved.openRouterRouting ?? {},
		vercelGatewayRouting: resolved.vercelGatewayRouting,
		requiresStringContent: compat.requiresStringContent ?? false,
		strictMessageKeys: compat.strictMessageKeys === true
	};
}
//#endregion
export { resolvePromptCacheKey as A, isOpenAICompletionsThinkingEnabled as C, readOpenAICompletionsContentDeltas as D, parseOpenAICompletionsUsage as E, redactIdentifier as M, sha256Hex as N, readOpenAICompletionsReasoningBatch as O, createResponseModelTracker as S, measureUtf8AppendBytes as T, resolveOpenAIReasoningEffortMap as _, enforceCodeModeResponsesToolSurface as a, createOpenAIProviderAcceptanceHook as b, readCodeModePayloadToolName as c, prepareOpenAITools as d, projectOpenAITools as f, resolveOpenAISimpleReasoningEffort as g, resolveOpenAIRequestReasoning as h, buildOpenAISdkRequestOptions as i, throwIfModelStreamAborted as j, resolveOpenAIClientBaseUrl as k, resolveCodeModeResponsesVisibleToolNames as l, reconcileOpenAIResponsesToolChoice as m, buildOpenAIClientHeaders as n, filterCodeModePayloadTools as o, reconcileOpenAICompletionsToolChoice as p, buildOpenAISdkClientOptions as r, getCompat as s, assertCodeModeResponsesToolSurface as t, resolveOpenAIStrictToolFlagWithDiagnostics as u, GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP as v, log as w, createOpenAIResponseHook as x, createModelStreamCooperativeScheduler as y };
