import "./src-VWy9E7DZ.mjs";
import { _ as runtimeContextContentToText, f as hasRuntimeContextMarker, p as isRuntimeContextMessage } from "./types-CQc6JNG4.mjs";
import { o as readProviderRefusalReview, t as appendAssistantMessageDiagnostic } from "./diagnostics-DzrF1h4J.mjs";
import { r as appendAssistantThinking } from "./event-stream-C5AbCAaZ.mjs";
import { o as isRecord, r as asOptionalObjectRecord } from "./record-coerce-CNDovvft.mjs";
import { a as normalizeOptionalString, c as readStringValue, n as normalizeLowercaseStringOrEmpty, o as normalizeStringifiedOptionalString } from "./string-coerce-CtgOVOSv.mjs";
import { D as applyProviderReportedUsageCost, E as headersToRecord, N as isImageWithMediaPayload, O as calculateCost, a as resolveAiTransportHeaderSentinels, k as clampThinkingLevel, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { A as resolveOpenAIThinkingApi, C as resolveOpenAIReasoningEffortForModel, D as supportsOpenAITemperature, E as supportsOpenAIReasoningEffort, O as MODEL_CATALOG_THINKING_LEVELS, S as resolveOpenAIModelReasoningEfforts, a as OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE, c as OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE, f as RESPONSE_FAILED_NO_DETAILS_MESSAGE, g as responsesServiceTierObserver, i as OPENAI_RESPONSES_APIS, o as OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY, p as isPreviousResponseRejection, s as OPENAI_RESPONSES_REASONING_REPLAY_META_KEY, w as resolveOpenAIReasoningEffortMapping, x as normalizeOpenAIReasoningEffort } from "./openai-responses-contracts-BKu8O7l4.mjs";
import { n as getSessionResourceOwnerId, r as registerSessionResourceCleanup } from "./session-resources-D1wgDQ8C.mjs";
import { o as truncateUtf16Safe, s as stableStringify } from "./provider-error-DQBE1bUQ.mjs";
import { n as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-BK6E2g4Q.mjs";
import { a as resolveModelSseDebugMode, d as isResponsesProviderTool, g as resolveResponsesTerminalStopReason, h as readResponsesReasoningTokens, i as resolveModelPayloadDebugMode, l as ResponsesOutputIdentityError, m as mapResponsesTerminalUsage, r as emitModelTransportDebug, u as hasOnlyResponsesFunctionTools } from "./diagnostics-Caj-4RBA.mjs";
import { i as providerReplayContextMatches, l as redactSensitiveText, n as buildProviderReplayContext, r as isProviderReplayContext, s as isCodeModeModelVisibleToolName, t as encodeTextSignatureV1 } from "./text-signature-CbqxIB8B.mjs";
import { c as resolveOpenAIResponsesTextFormat, i as resolveOpenAICompletionsCompat, o as usesNativeOpenAICodexResponsesBackend } from "./openai-completions-compat-GMN8A0fm.mjs";
import { r as resolveModelRequestTimeoutMs } from "./host-policy-BwhNNGQR.mjs";
import { A as shortHash, C as parseJsonObjectPreservingUnsafeIntegers, E as createToolArgumentPreviewSchedule, O as parseStreamingJson, S as withProviderResponseHook, _ as sanitizeNonEmptyTransportPayloadText, b as transportAbortError, c as failTransportStream, d as iterateModelStream, g as parseTerminalToolCallArguments, m as notifyProviderHttpResponse, t as IncompleteToolCallError, u as finalizeTransportStream, v as sanitizeTransportPayloadText } from "./transport-stream-shared-CCR7hSW0.mjs";
import { C as stripSystemPromptCacheBoundary, D as sortPromptCacheToolsByName, d as describeToolResultMediaPlaceholder, m as extractToolResultText, s as prepareModelRequestBody } from "./simple-options-7QuSKriJ.mjs";
import { n as transformProviderMessages } from "./assistant-output-D5762GPH.mjs";
import { n as projectRuntimeToolInputSchema, t as prepareRuntimeToolInputSchema } from "./tool-schema-json-projection-Ct8SeBeJ.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-D8f_oxHj.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-D9ZmL_s9.mjs";
import { a as resolveOpenAIProjectedToolsStrictToolFlag, f as withPreparedToolSchemaNormalization, r as normalizeOpenAIStrictToolParameters, t as findOpenAIStrictToolProjectionDiagnostics } from "./openai-tool-schema-BIrI0mrA.mjs";
import { n as isOpenAIResponsesCompactionOutput, r as readOpenAIResponsesCompactionWindow } from "./openai-responses-compaction-window-tA4QkU0o.mjs";
import { hash, randomUUID } from "node:crypto";
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
const EMPTY_OPENAI_COMPLETIONS_REASONING_BATCH = createOpenAICompletionsReasoningBatch();
const OPENAI_COMPLETIONS_REASONING_FIELDS = [
	"reasoning_content",
	"reasoning",
	"reasoning_text"
];
function appendOpenAICompletionsReasoningDelta(batch, next) {
	if (next.kind === "thinking") batch.hasThinking = true;
	else batch.hasVisibleText = true;
	const previous = batch.deltas[batch.deltas.length - 1];
	if (!previous || previous.kind !== next.kind || next.kind === "thinking" && previous.kind === "thinking" && previous.signature !== next.signature) {
		batch.deltas.push(next);
		if (next.kind === "thinking") batch.mirroredThinking.push(next.text);
		return;
	}
	previous.text += next.text;
	if (next.kind === "thinking") batch.mirroredThinking[batch.mirroredThinking.length - 1] += next.text;
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
	const hasCoherentContext = [
		rawUsage.prompt_tokens,
		rawUsage.completion_tokens,
		rawUsage.total_tokens,
		cacheRead,
		cacheWrite
	].every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0) && rawUsage.prompt_tokens >= cacheRead + cacheWrite && rawUsage.total_tokens >= rawUsage.prompt_tokens + rawUsage.completion_tokens;
	const usage = {
		input,
		output,
		cacheRead,
		cacheWrite,
		...options?.includeReasoningTokens !== false && typeof reasoningTokens === "number" && Number.isFinite(reasoningTokens) ? { reasoningTokens } : {},
		contextUsage: hasCoherentContext ? {
			state: "available",
			promptTokens: rawUsage.prompt_tokens,
			totalTokens: Math.max(input + output + cacheRead + cacheWrite, rawUsage.total_tokens)
		} : { state: "unavailable" },
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
function reconcileToolChoice(choice, projection, responses) {
	const label = responses ? "OpenAI Responses" : "OpenAI Chat Completions";
	if (choice === "auto") return projection.tools.length > 0 ? choice : void 0;
	if (choice === "required") {
		if (projection.tools.length === 0) throw new Error(`${label} tool_choice requires a tool, but no tools survived schema conversion`);
		return choice;
	}
	if (choice === "none" || !isRecord(choice)) return choice;
	const choiceType = choice.type;
	if (!responses && choiceType === "custom") throw new Error("OpenAI Chat Completions custom tool_choice is unsupported because this adapter emits function tools only");
	if (choiceType === "function") {
		const functionChoice = responses ? choice : choice.function;
		const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
		if (typeof functionName !== "string") return choice;
		if (!projection.tools.some((tool) => tool.name === functionName)) throw new Error(`${label} tool_choice requested unavailable tool "${functionName}" after schema conversion`);
		return responses ? {
			type: "function",
			name: functionName
		} : {
			type: "function",
			function: { name: functionName }
		};
	}
	if (choiceType !== "allowed_tools") return choice;
	const allowedConfig = responses ? choice : choice.allowed_tools;
	if (!isRecord(allowedConfig)) return choice;
	const { mode, tools } = allowedConfig;
	if (mode !== "auto" && mode !== "required" || !Array.isArray(tools)) return choice;
	const responseTools = [];
	const completionTools = [];
	for (const tool of tools) {
		if (!isRecord(tool) || tool.type !== "function") {
			if (responses) responseTools.push(tool);
			continue;
		}
		const functionChoice = responses ? tool : tool.function;
		const functionName = isRecord(functionChoice) ? functionChoice.name : void 0;
		if (typeof functionName === "string" && projection.tools.some((projectedTool) => projectedTool.name === functionName)) {
			if (responses) responseTools.push({
				type: "function",
				name: functionName
			});
			else completionTools.push({
				type: "function",
				function: { name: functionName }
			});
		}
	}
	if (responseTools.length === 0 && completionTools.length === 0) {
		if (mode === "auto") return "none";
		throw new Error(`${label} tool_choice requires a tool, but no allowed tools survived schema conversion`);
	}
	return responses ? {
		type: "allowed_tools",
		mode,
		tools: responseTools
	} : {
		type: "allowed_tools",
		allowed_tools: {
			mode,
			tools: completionTools
		}
	};
}
/** Keeps Responses tool choices aligned with surviving function schemas. */
function reconcileOpenAIResponsesToolChoice(choice, projection) {
	return reconcileToolChoice(choice, projection, true);
}
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
function reconcileOpenAICompletionsToolChoice(choice, projection) {
	return reconcileToolChoice(choice, projection, false);
}
/** Re-expresses an object Chat Completions tool choice in the Responses wire shape. */
function toOpenAIResponsesToolChoice(choice) {
	if (choice.type === "function") return {
		type: "function",
		name: choice.function.name
	};
	return {
		type: "allowed_tools",
		mode: choice.allowed_tools.mode,
		tools: choice.allowed_tools.tools.map((tool) => tool.type === "function" && isRecord(tool.function) && typeof tool.function.name === "string" ? {
			type: "function",
			name: tool.function.name
		} : tool)
	};
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
//#region packages/ai/src/transports/openai-transport-params.ts
const MAX_OPENAI_STRICT_TOOL_DOWNGRADE_DIAGNOSTIC_KEYS = 256;
const loggedOpenAIStrictToolDowngradeDiagnosticKeys = /* @__PURE__ */ new Set();
const OPENAI_COMPLETIONS_APIS = /* @__PURE__ */ new Set(["openai-completions", "openclaw-openai-completions-transport"]);
function readToolPayloadField$1(record, field) {
	try {
		return Object.hasOwn(record, field) ? record[field] : void 0;
	} catch {
		return;
	}
}
function readCodeModePayloadToolName(tool) {
	if (!isRecord(tool)) return;
	const name = readToolPayloadField$1(tool, "name");
	if (typeof name === "string") return name;
	const fn = readToolPayloadField$1(tool, "function");
	if (!isRecord(fn)) return;
	const fnName = readToolPayloadField$1(fn, "name");
	return typeof fnName === "string" ? fnName : void 0;
}
function readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes) {
	if (!isRecord(tool)) return;
	const type = readToolPayloadField$1(tool, "type");
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
	const tools = readToolPayloadField$1(payload, "tools");
	if (!Array.isArray(tools)) return [];
	return tools.flatMap((tool) => {
		if (!isRecord(tool)) return [];
		const identities = [];
		const name = readCodeModePayloadToolName(tool);
		if (name) identities.push(`client:${name}`);
		for (const key of ["functionDeclarations", "function_declarations"]) {
			const declarations = readToolPayloadField$1(tool, key);
			if (!Array.isArray(declarations)) continue;
			for (const declaration of declarations) {
				const declarationName = readCodeModePayloadToolName(declaration);
				if (declarationName) identities.push(`client:${declarationName}`);
			}
		}
		const type = readToolPayloadField$1(tool, "type");
		if (typeof type === "string" && type !== "function") identities.push(`hosted:${type}`);
		return identities;
	});
}
function filterCodeModePayloadTools(payload, visibleToolNames, allowedHostedToolTypes, observer) {
	if (!isRecord(payload)) return;
	const tools = readToolPayloadField$1(payload, "tools");
	if (!Array.isArray(tools)) return;
	const beforeToolIdentities = observer ? readCodeModePayloadToolIdentities(payload) : void 0;
	payload.tools = tools.flatMap((tool) => {
		const identity = readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes);
		if (identity) return [tool];
		if (identity === false) return [];
		if (!isRecord(tool)) return [];
		const filteredGroups = {};
		for (const key of ["functionDeclarations", "function_declarations"]) {
			const declarations = readToolPayloadField$1(tool, key);
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
	const tools = readToolPayloadField$1(payload, "tools");
	if (!Array.isArray(tools)) return;
	const beforeToolIdentities = observer ? readCodeModePayloadToolIdentities(payload) : void 0;
	payload.tools = tools.filter((tool) => Boolean(readCodeModePayloadToolIdentity(tool, visibleToolNames, allowedHostedToolTypes)));
	if (beforeToolIdentities) observer?.({
		beforeToolIdentities,
		afterToolIdentities: readCodeModePayloadToolIdentities(payload)
	});
}
function assertCodeModeResponsesToolSurface(payload, visibleToolNames, allowedHostedToolTypes) {
	const tools = isRecord(payload) ? readToolPayloadField$1(payload, "tools") : void 0;
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
	const resolvedHeaders = getAiTransportHost().resolveProviderRequestHeaders({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		providerHeaders,
		callerHeaders: Object.keys(callerHeaders).length > 0 ? callerHeaders : void 0,
		precedence: "caller-wins",
		model
	}) ?? {};
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
		reasoningEffortMap: resolveOpenAIReasoningEffortMap(model, {}),
		openRouterRouting: resolved.openRouterRouting ?? {},
		vercelGatewayRouting: resolved.vercelGatewayRouting,
		requiresStringContent: compat.requiresStringContent ?? false,
		strictMessageKeys: compat.strictMessageKeys === true
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compaction-replay.ts
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE = "openai-responses-compaction-suppression";
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA = "rejected";
function isOpenAIResponsesCompactionState(state) {
	if (typeof state.baseUrlHash !== "string" || state.v !== 1) return false;
	if (state.type === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE) return state.data === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA;
	if (state.type === "openai-responses-retained-compaction") return typeof state.data === "string" && state.data.length > 0 && (state.id === void 0 || typeof state.id === "string") && state.replayIndex === void 0;
	return state.type === "openai-responses-compaction" && typeof state.data === "string" && state.data.length > 0 && (state.id === void 0 || typeof state.id === "string") && (state.replayIndex === void 0 || typeof state.replayIndex === "number" && Number.isSafeInteger(state.replayIndex) && state.replayIndex >= 0);
}
function readOpenAIResponsesCompactionReplayState(value) {
	return isRecord(value) && isProviderReplayContext(value) && isOpenAIResponsesCompactionState(value) ? value : void 0;
}
function captureOpenAIResponsesCompaction(output, item, boundary, model, captureMetadata, compactedOutput) {
	const metadata = captureMetadata ?? buildOpenAIResponsesReasoningReplayMetadata(model);
	if (!item.encrypted_content) return;
	if (!metadata?.baseUrlHash) {
		log.debug("[responses] skipping compaction capture: missing base URL hash");
		return;
	}
	const currentReplay = readOpenAIResponsesCompactionReplayState(output.providerReplay);
	if (typeof boundary === "number" && currentReplay?.type === "openai-responses-compaction" && (currentReplay.replayIndex ?? -1) > boundary) return;
	if (compactedOutput && !isOpenAIResponsesCompactionOutput(compactedOutput, model)) throw new Error("Responses compact endpoint checkpoint is invalid");
	const replay = {
		v: 1,
		...boundary === "retained-users" ? { type: OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE } : {
			type: OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE,
			replayIndex: boundary
		},
		...item.id ? { id: item.id } : {},
		data: item.encrypted_content,
		provider: metadata.provider,
		api: metadata.api,
		model: metadata.model,
		baseUrlHash: metadata.baseUrlHash,
		...metadata.sessionHash ? { sessionHash: metadata.sessionHash } : {},
		...metadata.authProfileHash ? { authProfileHash: metadata.authProfileHash } : {},
		...compactedOutput ? { compactedWindow: {
			state: "ready",
			output: JSON.stringify(compactedOutput)
		} } : {}
	};
	if (compactedOutput && !readOpenAIResponsesCompactionWindow(replay, model)) throw new Error("Responses compact endpoint checkpoint is invalid or exceeds 16 MiB");
	output.providerReplay = replay;
}
function suppressOpenAIResponsesCompaction(output, model, options, rejectedCheckpoint) {
	const context = buildProviderReplayContext(model, options);
	if (!context.baseUrlHash) return;
	output.providerReplay = {
		v: 1,
		type: OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE,
		data: OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA,
		...context,
		baseUrlHash: context.baseUrlHash
	};
	if (rejectedCheckpoint) options?.onCompactionRejected?.(rejectedCheckpoint);
}
function createCompactionTracker(output, model, options) {
	const replayIndexes = /* @__PURE__ */ new Map();
	return {
		added(item, replayIndex) {
			if (item.type === "compaction" && item.id) replayIndexes.set(item.id, replayIndex);
		},
		completed(item, fallbackReplayIndex) {
			if (item.type !== "compaction" || !item.encrypted_content) return;
			captureOpenAIResponsesCompaction(output, {
				type: "compaction",
				...item.id ? { id: item.id } : {},
				encrypted_content: item.encrypted_content
			}, (item.id ? replayIndexes.get(item.id) : void 0) ?? fallbackReplayIndex, model, options?.reasoningReplayMetadata);
			if (item.id) replayIndexes.delete(item.id);
		}
	};
}
function isSafeResponsesReplayItemId(id) {
	return typeof id === "string" && id.length > 0 && id.length <= 64;
}
function resolveNewestOpenAIResponsesCompactionReplay(messages, model, options) {
	const context = buildProviderReplayContext(model, options);
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message?.role !== "assistant") continue;
		const replay = readOpenAIResponsesCompactionReplayState(message.providerReplay);
		if (replay?.type === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE) {
			if (providerReplayContextMatches(replay, context)) return;
			continue;
		}
		if (replay?.type !== "openai-responses-compaction" && replay?.type !== "openai-responses-retained-compaction") {
			if (message.providerReplay?.type === "openai-responses-compaction" || message.providerReplay?.type === "openai-responses-retained-compaction") return;
			continue;
		}
		if (!providerReplayContextMatches(replay, context)) return;
		if (replay.compactedWindow !== void 0 || replay.type === "openai-responses-retained-compaction") {
			const output = readOpenAIResponsesCompactionWindow(replay, model);
			const item = output?.at(-1);
			if (!output || item?.type !== "compaction") return {
				owner: message,
				mode: "refresh-required"
			};
			return {
				owner: message,
				mode: "complete-window",
				output,
				item,
				replayIndex: replay.type === "openai-responses-retained-compaction" ? message.content.length : replay.replayIndex ?? 0
			};
		}
		return {
			owner: message,
			item: {
				type: "compaction",
				...isSafeResponsesReplayItemId(replay.id) ? { id: replay.id } : {},
				encrypted_content: replay.data
			},
			mode: "compacted-prefix",
			replayIndex: replay.replayIndex ?? 0
		};
	}
}
var CompactionReplayRefreshRequiredError = class extends Error {
	constructor() {
		super("Provider compaction checkpoint needs rebuilding. Run /compact to rebuild from saved conversation history.");
		this.name = "CompactionReplayRefreshRequiredError";
	}
};
function buildOpenAIResponsesCompactionReplayPlan(messages, model, options) {
	if (options?.mode === "full-history") return {
		messages,
		preserveUnframedToolResults: false
	};
	const compaction = resolveNewestOpenAIResponsesCompactionReplay(messages, model, options);
	if (!compaction) return {
		messages,
		preserveUnframedToolResults: false
	};
	if (compaction.mode === "refresh-required") throw new CompactionReplayRefreshRequiredError();
	const ownerIndex = messages.indexOf(compaction.owner);
	return {
		messages: [{
			...compaction.owner,
			content: compaction.owner.content.slice(compaction.replayIndex)
		}, ...messages.slice(ownerIndex + 1)],
		...compaction.mode === "complete-window" ? { compactedWindow: compaction.output } : { compaction: compaction.item },
		preserveUnframedToolResults: true
	};
}
function buildOpenAIResponsesReasoningReplayMetadata(model, options) {
	return {
		v: 1,
		source: "openai-responses",
		...buildProviderReplayContext(model, options)
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-reasoning-update.ts
function isConfigurationUpdate(value) {
	return isRecord(value) && value.type === "configuration_update" && isRecord(value.reasoning) && typeof value.reasoning.effort === "string";
}
function isResponsesReasoningUpdateCompatible(request) {
	const mode = isRecord(request.reasoning) ? request.reasoning.mode : void 0;
	return request.model === "gpt-6-astra" && (mode === void 0 || mode === "standard") && (!isRecord(request.multi_agent) || request.multi_agent.enabled !== true) && request.truncation !== "auto" && (!Array.isArray(request.context_management) || !request.context_management.some((item) => isRecord(item) && item.type === "compaction"));
}
function supportsResponsesReasoningUpdate(request) {
	return isResponsesReasoningUpdateCompatible(request) && isRecord(request.reasoning) && typeof request.reasoning.effort === "string";
}
function canReferenceResponsesReasoningHistory(previous, request) {
	return !previous.input?.some(isConfigurationUpdate) || isResponsesReasoningUpdateCompatible(request);
}
/** Rehydrate input controls only provisionally; continuation must validate the full prefix. */
function replayResponsesReasoningUpdates(previous, request, previousOutputLength, steering) {
	if (steering !== "required-input" && (!supportsResponsesReasoningUpdate(previous) || !supportsResponsesReasoningUpdate(request)) || !Array.isArray(previous.input) || !Array.isArray(request.input) || request.input.some(isConfigurationUpdate)) return request;
	const input = [...request.input];
	let activeEffort = isRecord(previous.reasoning) ? previous.reasoning.effort : void 0;
	for (const [index, item] of previous.input.entries()) if (isConfigurationUpdate(item)) {
		input.splice(index, 0, item);
		activeEffort = item.reasoning.effort;
	}
	if (steering === "required-input") return input.length === request.input.length ? request : {
		...request,
		input
	};
	if (!isRecord(previous.reasoning) || !isRecord(request.reasoning) || typeof request.reasoning.effort !== "string") return request;
	if (activeEffort !== request.reasoning.effort && steering !== "automatic") {
		const baselineLength = previous.input.length + previousOutputLength;
		const nextUser = input.findIndex((item, index) => index >= baselineLength && "role" in item && item.role === "user");
		if (nextUser === -1) return request;
		input.splice(nextUser, 0, {
			type: "configuration_update",
			reasoning: { effort: request.reasoning.effort }
		});
	}
	if (input.length === request.input.length && activeEffort === request.reasoning.effort) return request;
	return {
		...request,
		reasoning: {
			...request.reasoning,
			effort: previous.reasoning.effort
		},
		input
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-tool-call-id-shape.ts
/**
* Pure OpenAI Responses `call_*`/`fc_*` tool-call-id shape helpers.
*
* Moved out of embedded-agent-helpers/openai.ts (the AgentMessage[]-walking
* caller lives in src/agents and imports from packages/ai, so the reverse
* import direction is not available) so the continuation transport can
* recognize its own cached raw ids after this same reshaping and restore
* them on a replayed wire request -- see openai-responses-continuation.ts.
*/
const OPENAI_RESPONSES_ID_MAX_LENGTH = 64;
const OPENAI_RESPONSES_CALL_ID_RE = /^call_[A-Za-z0-9_-]{1,59}$/;
const OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE = /^fc_[A-Za-z0-9_-]{1,61}$/;
function splitOpenAIFunctionCallPairing(id) {
	const separator = id.indexOf("|");
	if (separator <= 0 || separator >= id.length - 1) return { callId: id };
	return {
		callId: id.slice(0, separator),
		itemId: id.slice(separator + 1)
	};
}
function shortOpenAIResponsesIdHash(id) {
	return sha256Hex(id).slice(0, 10);
}
function sanitizeOpenAIResponsesIdTail(value) {
	return value.replace(/[^A-Za-z0-9_-]/g, "_").replace(/^_+|_+$/g, "");
}
function normalizeOpenAIResponsesIdPart(params) {
	const trimmed = params.value.trim();
	if (params.isValid(trimmed)) return trimmed;
	const rawTail = trimmed.startsWith(params.prefix) ? trimmed.slice(params.prefix.length) : trimmed;
	const hash = shortOpenAIResponsesIdHash(trimmed || params.prefix);
	const maxTailLength = 64 - params.prefix.length;
	const hashSuffix = `_${hash}`;
	const tail = `${sanitizeOpenAIResponsesIdTail(rawTail).slice(0, Math.max(1, maxTailLength - hashSuffix.length)) || "id"}${hashSuffix}`.slice(0, maxTailLength);
	return `${params.prefix}${tail}`;
}
/** Same shaping `normalizeOpenAIResponsesToolCallIds` applies to a replayed `call_id`/`call_id|fc_id` pair. */
function normalizeOpenAIResponsesFunctionCallId(id) {
	const { callId, itemId } = splitOpenAIFunctionCallPairing(id);
	const normalizedCallId = normalizeOpenAIResponsesIdPart({
		value: itemId ? `${callId}|${itemId}` : callId,
		prefix: "call_",
		isValid: (value) => OPENAI_RESPONSES_CALL_ID_RE.test(value)
	});
	if (!itemId) return normalizedCallId;
	return `${normalizedCallId}|${normalizeOpenAIResponsesIdPart({
		value: itemId,
		prefix: "fc_",
		isValid: (value) => OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE.test(value)
	})}`;
}
function shouldNormalizeOpenAIResponsesToolCallId(id) {
	const pairing = splitOpenAIFunctionCallPairing(id);
	if (!OPENAI_RESPONSES_CALL_ID_RE.test(pairing.callId)) return true;
	if (pairing.itemId === void 0) return false;
	return !OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE.test(pairing.itemId);
}
//#endregion
//#region packages/ai/src/transports/openai-responses-continuation.ts
const HTTP_CONTINUATION_IDLE_TTL_MS = 54e5;
const MAX_HTTP_CONTINUATION_READY_ENTRIES = 1e3;
const MAX_HTTP_CONTINUATION_RETAINED_BYTES = 67108864;
const TURN_HEADERS = /* @__PURE__ */ new Set([
	"traceparent",
	"x-openclaw-turn-id",
	"x-openclaw-turn-attempt"
]);
function jsonValuesEqual(left, right) {
	const leftJson = JSON.stringify(left);
	const normalizedLeft = stableStringify(JSON.parse(leftJson));
	const rightJson = JSON.stringify(right);
	return leftJson === rightJson || normalizedLeft === stableStringify(JSON.parse(rightJson));
}
function requestWithoutInput(request) {
	const { input: _input, previous_response_id: _previousResponseId, instructions: _instructions, tools: _tools, ...rest } = request;
	if (!isRecord(rest.metadata)) return rest;
	const metadata = Object.fromEntries(Object.entries(rest.metadata).filter(([key]) => key !== "openclaw_turn_id" && key !== "openclaw_turn_attempt"));
	return {
		...rest,
		metadata
	};
}
function canonicalizeToolCallId(callId, itemId) {
	if (typeof callId !== "string") return callId;
	const paired = typeof itemId === "string" && itemId ? `${callId}|${itemId}` : callId;
	if (!shouldNormalizeOpenAIResponsesToolCallId(paired)) return callId;
	return splitOpenAIFunctionCallPairing(normalizeOpenAIResponsesFunctionCallId(paired)).callId;
}
function responseToolCalls(items) {
	return items.flatMap((item) => {
		if (!isRecord(item) || item.type !== "function_call" || typeof item.call_id !== "string") return [];
		return [{
			callId: item.call_id,
			...typeof item.id === "string" ? { itemId: item.id } : {}
		}];
	});
}
function toolCallReplayShapes(call) {
	return new Set([
		call.callId,
		canonicalizeToolCallId(call.callId, call.itemId),
		canonicalizeToolCallId(call.callId, void 0)
	].filter((shape) => typeof shape === "string"));
}
function toolCallOwnerByReplayShape(calls) {
	const ownerByReplayShape = /* @__PURE__ */ new Map();
	for (const [index, call] of calls.entries()) for (const replayShape of toolCallReplayShapes(call)) {
		const owner = ownerByReplayShape.get(replayShape);
		ownerByReplayShape.set(replayShape, owner === void 0 || owner === index ? index : null);
	}
	return ownerByReplayShape;
}
function pendingResponsesToolCalls(calls, input) {
	const ownerByReplayShape = toolCallOwnerByReplayShape(calls);
	const replayedCallIds = /* @__PURE__ */ new Set();
	const lastCallPosition = /* @__PURE__ */ new Map();
	const lastOutputPosition = /* @__PURE__ */ new Map();
	for (const [inputIndex, item] of input.entries()) {
		if (!isRecord(item) || typeof item.call_id !== "string") continue;
		const owner = ownerByReplayShape.get(item.call_id);
		if (item.type === "function_call") {
			replayedCallIds.add(item.call_id);
			if (owner !== void 0 && owner !== null) lastCallPosition.set(owner, inputIndex);
			continue;
		}
		if (item.type !== "function_call_output") continue;
		if (owner !== void 0 && owner !== null) lastOutputPosition.set(owner, inputIndex);
	}
	return calls.filter((_call, index) => {
		const callPosition = lastCallPosition.get(index);
		return [...toolCallReplayShapes(_call)].some((shape) => replayedCallIds.has(shape)) && (callPosition === void 0 || (lastOutputPosition.get(index) ?? -1) < callPosition);
	});
}
function recordResponsesContinuationState(previous, lastRequest, response, continued = false) {
	const calls = previous && continued ? [...previous.pendingToolCalls ?? [], ...responseToolCalls(previous.lastResponseItems)] : responseToolCalls(lastRequest.input ?? []);
	const seenCalls = /* @__PURE__ */ new Set();
	const pendingToolCalls = pendingResponsesToolCalls(calls.filter((call) => {
		const key = JSON.stringify([call.callId, call.itemId]);
		if (seenCalls.has(key)) return false;
		seenCalls.add(key);
		return true;
	}), lastRequest.input ?? []);
	return {
		lastRequest,
		lastResponseId: response.id,
		lastResponseItems: response.output,
		pendingToolCalls
	};
}
function normalizeAssistantReplayInput(input, fromResponse = false, ignoreCachedItemIds = false) {
	return input.map((item) => {
		if (!isRecord(item)) return item;
		if (item.type === "reasoning") return { type: "reasoning" };
		if (item.type !== "function_call" && item.type !== "function_call_output" && !(item.type === "message" && item.role === "assistant")) return item;
		const { id: rawId, status: _status, ...stableItem } = item;
		if (item.type === "function_call_output") {
			if ("id" in item) stableItem.id = item.id;
			if ("status" in item) stableItem.status = item.status;
		}
		if ("call_id" in stableItem) {
			const itemId = item.type === "function_call" && !(fromResponse && ignoreCachedItemIds) ? rawId : void 0;
			stableItem.call_id = canonicalizeToolCallId(stableItem.call_id, itemId);
		}
		if (fromResponse && item.type === "function_call") {
			const args = parseJsonObjectPreservingUnsafeIntegers(stableItem.arguments);
			stableItem.arguments = args ? JSON.stringify(args) : stableItem.arguments;
		}
		if (item.type === "message" && Array.isArray(stableItem.content)) stableItem.content = stableItem.content.map((part) => {
			if (!isRecord(part) || part.type !== "output_text") return part;
			const { annotations: _annotations, logprobs: _logprobs, ...stablePart } = part;
			return stablePart;
		});
		return stableItem;
	});
}
function normalizeContinuationHistory(input) {
	const normalized = normalizeAssistantReplayInput(input);
	const ownerByReplayShape = toolCallOwnerByReplayShape(responseToolCalls(input));
	let callIndex = 0;
	for (const [index, item] of input.entries()) {
		const normalizedItem = normalized[index];
		if (!isRecord(item) || !isRecord(normalizedItem)) continue;
		if (item.type === "function_call") {
			if (typeof normalizedItem.call_id !== "string") return;
			const callOwner = ownerByReplayShape.get(normalizedItem.call_id);
			if (callOwner !== callIndex) return;
			normalizedItem.call_id = { callOwner };
			callIndex += 1;
			continue;
		}
		if (item.type !== "function_call_output" || typeof item.call_id !== "string") continue;
		const owner = ownerByReplayShape.get(item.call_id);
		if (owner === null) return;
		normalizedItem.call_id = owner === void 0 ? { unknownCallId: canonicalizeToolCallId(item.call_id, void 0) } : { callOwner: owner };
	}
	return normalized;
}
function continuationHistoryMatches(previousInput, currentInput) {
	for (const [index, previousItem] of previousInput.entries()) {
		const currentItem = currentInput[index];
		if (!isRecord(previousItem) || !isRecord(currentItem)) continue;
		if (previousItem.type === "function_call" && currentItem.type === "function_call") {
			if (typeof previousItem.call_id === "string" && typeof currentItem.call_id === "string" && !toolCallReplayShapes({
				callId: previousItem.call_id,
				...typeof previousItem.id === "string" ? { itemId: previousItem.id } : {}
			}).has(currentItem.call_id)) return false;
		}
		if (previousItem.type === "function_call_output" && currentItem.type === "function_call_output" && typeof previousItem.call_id === "string" && typeof currentItem.call_id === "string" && currentItem.call_id !== previousItem.call_id && currentItem.call_id !== canonicalizeToolCallId(previousItem.call_id, void 0)) return false;
	}
	const previousCalls = responseToolCalls(previousInput);
	const currentCalls = responseToolCalls(currentInput);
	if (previousCalls.length !== currentCalls.length) return false;
	for (const [index, previousCall] of previousCalls.entries()) {
		const currentCall = currentCalls[index];
		if (!currentCall) return false;
		const previousShapes = toolCallReplayShapes(previousCall);
		if (![...toolCallReplayShapes(currentCall)].some((shape) => previousShapes.has(shape))) return false;
	}
	const normalizedPrevious = normalizeContinuationHistory(previousInput);
	const normalizedCurrent = normalizeContinuationHistory(currentInput);
	return normalizedPrevious !== void 0 && normalizedCurrent !== void 0 && jsonValuesEqual(normalizedCurrent, normalizedPrevious);
}
function responsesContinuationRequestFingerprint(request) {
	const serialized = JSON.stringify(requestWithoutInput(request));
	return sha256Hex(stableStringify(JSON.parse(serialized)));
}
function responsesContinuationPrefixFingerprint(input, output = []) {
	const serialized = JSON.stringify([...normalizeAssistantReplayInput(input), ...normalizeAssistantReplayInput(output, true)]);
	return sha256Hex(stableStringify(JSON.parse(serialized)));
}
function restoreRawCallIdsInDelta(delta, cachedResponseItems, replayedToolRound, pendingToolCalls) {
	const currentResponseCalls = responseToolCalls(cachedResponseItems);
	const replayedCalls = replayedToolRound.filter((item) => isRecord(item) && item.type === "function_call");
	if (currentResponseCalls.length !== replayedCalls.length) return;
	const cachedCalls = [...pendingToolCalls, ...currentResponseCalls];
	const currentCallOffset = pendingToolCalls.length;
	const ownerByReplayShape = toolCallOwnerByReplayShape(cachedCalls);
	for (const index of currentResponseCalls.keys()) {
		const replayedCallId = replayedCalls[index]?.call_id;
		if (typeof replayedCallId !== "string" || ownerByReplayShape.get(replayedCallId) !== currentCallOffset + index) return;
	}
	const restoredDelta = [];
	for (const item of delta) {
		if (!isRecord(item) || item.type !== "function_call_output" || typeof item.call_id !== "string") {
			restoredDelta.push(item);
			continue;
		}
		const owner = ownerByReplayShape.get(item.call_id);
		if (owner === void 0 || owner === null) return;
		const rawCallId = cachedCalls[owner]?.callId;
		if (!rawCallId) return;
		restoredDelta.push(rawCallId === item.call_id ? item : {
			...item,
			call_id: rawCallId
		});
	}
	return restoredDelta;
}
function resolveResponsesContinuationRequest(continuation, request, steering) {
	if (!continuation) return {
		request,
		continuationStatus: "no_previous_response"
	};
	if (request.previous_response_id) return {
		request,
		continuationStatus: "explicit_previous_response_id"
	};
	if (!canReferenceResponsesReasoningHistory(continuation.lastRequest, request)) return {
		request,
		continuationStatus: "request_changed"
	};
	const prepared = replayResponsesReasoningUpdates(continuation.lastRequest, request, continuation.lastResponseItems.length, steering);
	if (steering !== "required-input" && !jsonValuesEqual(requestWithoutInput(prepared), requestWithoutInput(continuation.lastRequest))) return {
		request,
		continuationStatus: "request_changed"
	};
	const currentInput = prepared.input ?? [];
	const previousInput = continuation.lastRequest.input ?? [];
	const baselineLength = previousInput.length + continuation.lastResponseItems.length;
	if (currentInput.length < baselineLength) return {
		request,
		continuationStatus: "history_shorter"
	};
	const replayedToolRoundInput = currentInput.slice(previousInput.length, baselineLength);
	const replayedToolRound = normalizeAssistantReplayInput(replayedToolRoundInput);
	const historyToolRoundUnchanged = jsonValuesEqual(replayedToolRound, normalizeAssistantReplayInput(continuation.lastResponseItems, true)) || jsonValuesEqual(replayedToolRound, normalizeAssistantReplayInput(continuation.lastResponseItems, true, true));
	if (!continuationHistoryMatches(previousInput, currentInput.slice(0, previousInput.length)) || !historyToolRoundUnchanged) return {
		request,
		continuationStatus: "history_changed"
	};
	const restoredInput = restoreRawCallIdsInDelta(currentInput.slice(baselineLength), continuation.lastResponseItems, replayedToolRoundInput, continuation.pendingToolCalls ?? []);
	if (!restoredInput) return {
		request,
		continuationStatus: "history_changed"
	};
	const restoredResponseInput = restoredInput;
	return {
		request: {
			...prepared,
			previous_response_id: continuation.lastResponseId,
			input: restoredResponseInput
		},
		...prepared !== request ? { fullRequest: prepared } : {},
		continuationStatus: "continued"
	};
}
const httpContinuationEntries = /* @__PURE__ */ new Map();
const readyHttpContinuationEntries = /* @__PURE__ */ new Map();
let httpContinuationRetainedBytes = 0;
function deleteHttpContinuationIfOwned(key, entry) {
	if (httpContinuationEntries.get(key) !== entry) return;
	if (entry.kind === "ready") {
		clearTimeout(entry.idleTimer);
		httpContinuationRetainedBytes -= entry.retainedBytes;
		readyHttpContinuationEntries.delete(key);
	}
	httpContinuationEntries.delete(key);
}
function evictReadyEntriesForCapacity(pendingBytes) {
	for (;;) {
		const overCapacity = readyHttpContinuationEntries.size >= MAX_HTTP_CONTINUATION_READY_ENTRIES;
		const overBudget = httpContinuationRetainedBytes + pendingBytes > MAX_HTTP_CONTINUATION_RETAINED_BYTES;
		if (!overCapacity && !overBudget) return;
		const oldest = readyHttpContinuationEntries.entries().next();
		if (oldest.done) return;
		const [oldestKey, oldestEntry] = oldest.value;
		deleteHttpContinuationIfOwned(oldestKey, oldestEntry);
	}
}
function connectionIdentity(params) {
	const headers = Object.entries(resolveAiTransportHeaderSentinels(params.headers) ?? {}).map(([name, value]) => [name.toLowerCase(), value]).filter(([name]) => !TURN_HEADERS.has(name)).toSorted(([a], [b]) => a.localeCompare(b));
	return sha256Hex(JSON.stringify([
		getAiTransportHost().resolveSecretSentinel(params.apiKey),
		params.baseUrl,
		headers
	]));
}
function claimOpenAIResponsesHttpContinuation(params) {
	const owner = getAiTransportHost();
	const key = `${getSessionResourceOwnerId(owner)}\0${params.sessionId}\0${connectionIdentity(params)}`;
	const previous = httpContinuationEntries.get(key);
	if (previous?.kind === "claimed") return;
	if (previous?.kind === "ready") deleteHttpContinuationIfOwned(key, previous);
	const claimed = {
		kind: "claimed",
		sessionId: params.sessionId,
		owner
	};
	httpContinuationEntries.set(key, claimed);
	try {
		const request = previous?.kind === "ready" ? params.request : params.restoreRequest?.() ?? params.request;
		const resolved = resolveResponsesContinuationRequest(previous?.kind === "ready" ? previous.state : void 0, request);
		const fullRequest = resolved.fullRequest ?? request;
		return {
			request: params.request.store === false ? fullRequest : resolved.request,
			fullRequest,
			commit: (effectiveRequest, response, dispatchedPreviousResponseId) => {
				if (httpContinuationEntries.get(key) !== claimed) return;
				const state = recordResponsesContinuationState(previous?.kind === "ready" ? previous.state : void 0, effectiveRequest, response, previous?.kind === "ready" && dispatchedPreviousResponseId === previous.state.lastResponseId);
				const retainedBytes = Buffer.byteLength(JSON.stringify(state), "utf8");
				if (httpContinuationEntries.get(key) !== claimed) return;
				if (retainedBytes > MAX_HTTP_CONTINUATION_RETAINED_BYTES) {
					deleteHttpContinuationIfOwned(key, claimed);
					return;
				}
				evictReadyEntriesForCapacity(retainedBytes);
				const ready = {
					...claimed,
					kind: "ready",
					state,
					idleTimer: setTimeout(() => deleteHttpContinuationIfOwned(key, ready), HTTP_CONTINUATION_IDLE_TTL_MS),
					retainedBytes
				};
				ready.idleTimer.unref?.();
				httpContinuationRetainedBytes += retainedBytes;
				httpContinuationEntries.set(key, ready);
				readyHttpContinuationEntries.set(key, ready);
			},
			release: () => deleteHttpContinuationIfOwned(key, claimed)
		};
	} catch (error) {
		deleteHttpContinuationIfOwned(key, claimed);
		throw error;
	}
}
registerSessionResourceCleanup((sessionId, owner) => {
	for (const [key, entry] of httpContinuationEntries) if ((!owner || entry.owner === owner) && (!sessionId || entry.sessionId === sessionId)) deleteHttpContinuationIfOwned(key, entry);
});
//#endregion
//#region packages/ai/src/transports/openai-responses-input-replay.ts
function recordResponsesInputReplay(message, replay) {
	if (replay) Object.assign(message, { openclawResponsesInputReplay: replay });
}
function readResponsesInputReplayState(message) {
	const replay = "openclawResponsesInputReplay" in message ? message.openclawResponsesInputReplay : void 0;
	return isRecord(replay) ? replay : void 0;
}
function readResponsesInputReplay(message) {
	const replay = readResponsesInputReplayState(message);
	if (replay && typeof replay.afterResponseId === "string" && Array.isArray(replay.before) && replay.before.every((item) => typeof item === "string") && Array.isArray(replay.after) && replay.after.every((item) => typeof item === "string")) return {
		afterResponseId: replay.afterResponseId,
		before: replay.before,
		after: replay.after
	};
}
function responsesInputFingerprint(item) {
	if (isRecord(item) && (item.type === "function_call_output" || item.type === "custom_tool_call_output") && typeof item.call_id === "string") return sha256Hex(stableStringify({
		type: item.type,
		call_id: item.call_id
	}));
	return sha256Hex(stableStringify(item));
}
/** Reconstruct delivery order without rewriting durable local completion events. */
function createResponsesInputReplay(model) {
	const starts = /* @__PURE__ */ new Map();
	const ends = /* @__PURE__ */ new Map();
	const fingerprints = /* @__PURE__ */ new Map();
	const fingerprint = (item) => {
		const value = fingerprints.get(item) ?? responsesInputFingerprint(item);
		fingerprints.set(item, value);
		return value;
	};
	return (input, output, message) => {
		const key = message.turnId || message.responseId;
		const start = (key ? starts.get(key) : void 0) ?? output[0];
		if (key && start) starts.set(key, start);
		input.push(...output);
		let end = input.at(-1);
		const replay = readResponsesInputReplay(message);
		const parent = replay ? ends.get(replay.afterResponseId) : void 0;
		if (replay && parent && message.provider === model.provider && message.api === model.api && message.model === model.id) {
			const take = (keys) => {
				const moved = [];
				for (const inputKey of keys.toReversed()) {
					const boundary = input.indexOf(parent);
					const index = input.findLastIndex((item, position) => position > boundary && fingerprint(item) === inputKey);
					if (index > boundary) moved.unshift(...input.splice(index, 1));
				}
				return moved;
			};
			const before = take(replay.before);
			const after = take(replay.after);
			input.splice(start ? input.indexOf(start) : input.length, 0, ...before);
			end = input.at(-1);
			input.push(...after);
		}
		if (message.responseId && end) ends.set(message.responseId, end);
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay.ts
/** Resolves the assistant message id that can be replayed to OpenAI Responses. */
function resolveReplayableResponsesMessageId(params) {
	if (!params.replayResponsesItemIds) return;
	if (!params.textSignatureId) return params.fallbackOrdinal === 0 ? params.fallbackId : `${params.fallbackId}_${params.fallbackOrdinal}`;
	return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay-messages-internal.ts
function resolveResponsesInstructionRole(model) {
	const supportsDeveloperRole = !isRecord(model.compat) || model.compat.supportsDeveloperRole !== false;
	return model.reasoning && supportsDeveloperRole ? "developer" : "system";
}
function stripEncryptedReasoningContentFields(value) {
	if (!value || typeof value !== "object") return {
		value,
		changed: false
	};
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item) => {
			const stripped = stripEncryptedReasoningContentFields(item);
			changed ||= stripped.changed;
			return stripped.value;
		});
		return changed ? {
			value: next,
			changed: true
		} : {
			value,
			changed: false
		};
	}
	const source = value;
	if (source.type === "compaction") return {
		value,
		changed: false
	};
	let changed = false;
	const next = {};
	for (const [key, child] of Object.entries(source)) {
		if (key === "encrypted_content") {
			changed = true;
			continue;
		}
		const stripped = stripEncryptedReasoningContentFields(child);
		changed ||= stripped.changed;
		next[key] = stripped.value;
	}
	return changed ? {
		value: next,
		changed: true
	} : {
		value,
		changed: false
	};
}
function isOpenAIResponsesReasoningReplayMetadata(value) {
	if (!isProviderReplayContext(value)) return false;
	const record = value;
	return record.v === 1 && record.source === "openai-responses";
}
function readOpenAIResponsesReasoningReplayBlockMetadata(block) {
	if (!Object.hasOwn(block, "openclawReasoningReplay")) return;
	const value = block[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY];
	return isOpenAIResponsesReasoningReplayMetadata(value) ? value : null;
}
function normalizeOpenAIResponsesReasoningReplayItem(item) {
	const record = item;
	if (record.type !== "reasoning" || Array.isArray(record.summary)) return item;
	return {
		...record,
		summary: []
	};
}
function prepareOpenAIResponsesReasoningItemForReplay(item, context, blockMetadata, options) {
	const record = item;
	const hasRawMetadata = Object.hasOwn(record, OPENAI_RESPONSES_REASONING_REPLAY_META_KEY);
	const { [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]: rawMetadata, ...rest } = record;
	if (!("encrypted_content" in rest)) return normalizeOpenAIResponsesReasoningReplayItem(rest);
	const metadata = blockMetadata !== void 0 ? blockMetadata ?? void 0 : isOpenAIResponsesReasoningReplayMetadata(rawMetadata) ? rawMetadata : void 0;
	if (blockMetadata === void 0 && !hasRawMetadata && options?.preserveUnattributedEncryptedContent === true || metadata && providerReplayContextMatches(metadata, context)) return normalizeOpenAIResponsesReasoningReplayItem(rest);
	return normalizeOpenAIResponsesReasoningReplayItem(stripEncryptedReasoningContentFields(rest).value);
}
function normalizeResponsesReplayItemId(id, prefix) {
	if (!id) return;
	if (id.length <= 64) return id;
	return `${prefix}_${shortHash(id)}`;
}
function orderResponsesAsyncToolResults(source) {
	const turnKey = (message) => {
		const id = message.turnId || message.responseId;
		return id ? `${message.provider}:${message.api}:${message.model}:${id}` : void 0;
	};
	const lastAssistant = /* @__PURE__ */ new Map();
	for (const [index, message] of source.entries()) if (message.role === "assistant") {
		const key = turnKey(message);
		if (key) lastAssistant.set(key, index);
	}
	const owners = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Map();
	const ordered = [];
	for (const [index, message] of source.entries()) {
		if (message.role === "assistant") {
			const key = turnKey(message);
			if (key) {
				for (const block of message.content) if (block.type === "toolCall" && block.async) owners.set(block.id, key);
			}
		}
		const owner = message.role === "toolResult" ? owners.get(message.toolCallId) : void 0;
		const lastIndex = owner ? lastAssistant.get(owner) : void 0;
		if (lastIndex !== void 0 && lastIndex > index) {
			const results = pending.get(lastIndex) ?? [];
			results.push(message);
			pending.set(lastIndex, results);
		} else ordered.push(message);
		const results = pending.get(index);
		if (results) {
			ordered.push(...results);
			pending.delete(index);
		}
	}
	return ordered;
}
function parseOpenAIResponsesTextSignature(signature) {
	if (!signature) return;
	if (signature.startsWith("{")) try {
		const parsed = JSON.parse(signature);
		if (parsed.v === 1) {
			const id = typeof parsed.id === "string" ? parsed.id : void 0;
			const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
			if (id !== void 0 || phase !== void 0) return {
				id,
				phase
			};
			return;
		}
	} catch {}
	return { id: signature };
}
const responsesInputSource = Symbol("openclaw.responsesInputSource");
/** Source identity survives payload spreads but never enters serialized provider input. */
function bindResponsesInputMessage(source) {
	const identity = {};
	Object.defineProperty(source, responsesInputSource, {
		value: identity,
		enumerable: true
	});
	return (input) => typeof input === "object" && input !== null && Reflect.get(input, responsesInputSource) === identity;
}
function buildResponsesInputMessage(role, content, source) {
	const identity = source && Reflect.get(source, responsesInputSource);
	return {
		type: "message",
		role,
		content,
		...identity ? { [responsesInputSource]: identity } : {}
	};
}
function convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, conversionStyle) {
	const messages = [];
	const providerStyle = conversionStyle === "provider";
	const shouldReplayReasoningItems = options?.replayReasoningItems ?? true;
	const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
	const replayContext = buildProviderReplayContext(model, {
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId
	});
	const shouldNormalizeSameModelToolCallIds = model.provider === "github-copilot";
	const sanitizeIdPart = (part) => {
		const sanitized = part.replace(/[^a-zA-Z0-9_-]/g, "_");
		return providerStyle ? sanitized : sanitized.replace(/_+$/, "");
	};
	const normalizeIdPart = (part) => {
		const sanitized = sanitizeIdPart(part);
		return (sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized).replace(/_+$/, "");
	};
	const buildForeignResponsesItemId = (itemId) => `fc_${shortHash(itemId)}`;
	const buildSameProviderCopilotResponsesItemId = (itemId) => {
		const sanitized = sanitizeIdPart(itemId);
		const candidate = sanitized.startsWith("fc_") ? sanitized : `fc_${sanitized}`;
		return candidate.length > 64 ? buildForeignResponsesItemId(itemId) : candidate;
	};
	const normalizeToolCallId = (id, _targetModel, source) => {
		if (!allowedToolCallProviders.has(model.provider) || !id.includes("|")) return normalizeIdPart(id);
		const separatorIndex = id.indexOf("|");
		const callId = id.slice(0, separatorIndex);
		const itemId = id.slice(separatorIndex + 1);
		const normalizedCallId = normalizeIdPart(callId);
		let normalizedItemId = source.provider !== model.provider || source.api !== model.api ? buildForeignResponsesItemId(itemId) : model.provider === "github-copilot" ? providerStyle ? normalizeIdPart(itemId) : buildSameProviderCopilotResponsesItemId(itemId) : normalizeIdPart(itemId);
		if (!normalizedItemId.startsWith("fc_")) normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
		return `${normalizedCallId}|${normalizedItemId}`;
	};
	const replayPlan = buildOpenAIResponsesCompactionReplayPlan(context.messages, model, {
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId,
		mode: options?.replayMode
	});
	const transformMessages = (source) => providerStyle ? transformProviderMessages(source, model, normalizeToolCallId) : getAiTransportHost().transformTransportMessages(source, model, normalizeToolCallId, {
		normalizeSameModelToolCallIds: shouldNormalizeSameModelToolCallIds,
		preserveUnframedToolResults: replayPlan.preserveUnframedToolResults
	});
	const transformedMessages = orderResponsesAsyncToolResults(transformMessages(replayPlan.messages));
	if ((options?.includeSystemPrompt ?? true) && context.systemPrompt) messages.push(buildResponsesInputMessage(resolveResponsesInstructionRole(model), [{
		type: "input_text",
		text: sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(context.systemPrompt))
	}]));
	if (replayPlan.compactedWindow) messages.push(...replayPlan.compactedWindow);
	let replayMessages = replayPlan.compaction ? [replayPlan.compaction, ...transformedMessages] : transformedMessages;
	const isCarrier = (message) => "role" in message && hasRuntimeContextMarker(message);
	if (replayMessages.some(isCarrier)) {
		const anchored = [];
		let insertionIndex = replayPlan.compactedWindow ? 0 : void 0;
		for (const message of replayMessages) {
			if (isCarrier(message) && insertionIndex !== void 0) {
				anchored.splice(insertionIndex++, 0, message);
				continue;
			}
			anchored.push(message);
			if (!isCarrier(message) && ("role" in message ? message.role === "user" : message.type === "compaction")) insertionIndex = anchored.length;
		}
		replayMessages = anchored;
	}
	let msgIndex = 0;
	const appendAssistant = createResponsesInputReplay(model);
	for (const msg of replayMessages) {
		if (!("role" in msg)) {
			messages.push(msg);
			continue;
		}
		if (isRuntimeContextMessage(msg)) messages.push(buildResponsesInputMessage(resolveResponsesInstructionRole(model), [{
			type: "input_text",
			text: sanitizeTransportPayloadText(runtimeContextContentToText(msg.content))
		}]));
		else if (msg.role === "user") {
			if (typeof msg.content === "string") messages.push(buildResponsesInputMessage("user", [{
				type: "input_text",
				text: sanitizeTransportPayloadText(msg.content)
			}], msg));
			else {
				const content = msg.content.map((item) => item.type === "text" ? {
					type: "input_text",
					text: sanitizeTransportPayloadText(item.text)
				} : {
					type: "input_image",
					detail: "auto",
					image_url: `data:${item.mimeType};base64,${item.data}`
				}).filter((item) => providerStyle || model.input.includes("image") || item.type !== "input_image");
				if (content.length > 0) messages.push(buildResponsesInputMessage("user", content, msg));
				else if (providerStyle) continue;
			}
		} else if (msg.role === "assistant") {
			const output = [];
			let textFallbackOrdinal = 0;
			let previousReplayItemWasReasoning = false;
			const isDifferentModel = msg.model !== model.id && msg.provider === model.provider && msg.api === model.api;
			for (const block of msg.content) if (block.type === "thinking") {
				if (shouldReplayReasoningItems && block.thinkingSignature && (providerStyle || block.thinkingSignature.startsWith("{"))) {
					let reasoningItem;
					try {
						reasoningItem = JSON.parse(block.thinkingSignature);
					} catch {
						continue;
					}
					if (!isRecord(reasoningItem) || reasoningItem.type !== "reasoning") continue;
					const replayableReasoningItem = prepareOpenAIResponsesReasoningItemForReplay(reasoningItem, replayContext, readOpenAIResponsesReasoningReplayBlockMetadata(isRecord(block) ? block : {}), providerStyle ? { preserveUnattributedEncryptedContent: true } : void 0);
					if (!shouldReplayResponsesItemIds) delete replayableReasoningItem.id;
					if (shouldReplayResponsesItemIds && !providerStyle && model.provider === "github-copilot" && !isSafeResponsesReplayItemId(replayableReasoningItem.id)) continue;
					output.push(replayableReasoningItem);
					previousReplayItemWasReasoning = true;
				}
			} else if (block.type === "text") {
				const textSignature = parseOpenAIResponsesTextSignature(block.textSignature);
				let msgId = resolveReplayableResponsesMessageId({
					replayResponsesItemIds: shouldReplayResponsesItemIds,
					textSignatureId: textSignature?.id,
					fallbackId: `msg_${msgIndex}`,
					fallbackOrdinal: textFallbackOrdinal,
					previousReplayItemWasReasoning
				});
				if (!textSignature?.id) textFallbackOrdinal += 1;
				msgId = normalizeResponsesReplayItemId(msgId, "msg");
				const messageItem = {
					type: "message",
					role: "assistant",
					content: [{
						type: "output_text",
						text: sanitizeTransportPayloadText(block.text),
						annotations: []
					}],
					status: "completed",
					...msgId ? { id: msgId } : {},
					phase: textSignature?.phase
				};
				output.push(messageItem);
				previousReplayItemWasReasoning = false;
			} else if (block.type === "toolCall") {
				const separatorIndex = block.id.indexOf("|");
				const callId = separatorIndex === -1 ? block.id : block.id.slice(0, separatorIndex);
				const itemIdRaw = separatorIndex === -1 ? void 0 : block.id.slice(separatorIndex + 1);
				const itemId = shouldReplayResponsesItemIds && !(isDifferentModel && itemIdRaw?.startsWith("fc_")) ? itemIdRaw : void 0;
				output.push({
					type: "function_call",
					...itemId ? { id: itemId } : {},
					call_id: callId,
					name: block.name,
					...block.async ? { async: true } : {},
					arguments: providerStyle ? JSON.stringify(block.arguments) : typeof block.arguments === "string" ? block.arguments : JSON.stringify(block.arguments ?? {})
				});
				previousReplayItemWasReasoning = false;
			}
			while (true) {
				const last = output.at(-1);
				if (last?.type !== "reasoning" || !last.id?.startsWith("rs_") || typeof last.encrypted_content === "string" && last.encrypted_content.length > 0) break;
				output.pop();
			}
			appendAssistant(messages, output, msg);
			if (output.length === 0 && providerStyle) continue;
		} else if (msg.role === "toolResult") {
			const textResult = extractToolResultText(msg.content);
			const sanitizedTextResult = sanitizeTransportPayloadText(textResult);
			const hasText = sanitizedTextResult.trim().length > 0;
			const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
			const hasImages = msg.content.some(isImageWithMediaPayload);
			const separatorIndex = msg.toolCallId.indexOf("|");
			const callId = separatorIndex === -1 ? msg.toolCallId : msg.toolCallId.slice(0, separatorIndex);
			messages.push({
				type: "function_call_output",
				call_id: callId,
				output: hasImages && model.input.includes("image") ? [...hasText ? [{
					type: "input_text",
					text: sanitizedTextResult
				}] : mediaPlaceholder === "(see attached media)" ? [{
					type: "input_text",
					text: mediaPlaceholder
				}] : [], ...msg.content.filter(isImageWithMediaPayload).map((item) => ({
					type: "input_image",
					detail: "auto",
					image_url: `data:${item.mimeType};base64,${item.data}`
				}))] : sanitizeNonEmptyTransportPayloadText(textResult, mediaPlaceholder ?? "(no output)")
			});
		}
		msgIndex += 1;
	}
	return messages;
}
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
	return convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, "transport");
}
function convertProviderResponsesMessages(model, context, allowedToolCallProviders, options) {
	return convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, "provider");
}
//#endregion
//#region packages/ai/src/transports/openai-responses-context-usage.ts
const TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"opencode",
	"azure-openai-responses",
	"github-copilot"
]);
function contextFingerprint(input, output = []) {
	const reasoning = [...input, ...output].flatMap((item) => {
		if (!isRecord(item) || item.type !== "reasoning") return [];
		const { id: _id, status: _status, ...content } = item;
		return [content];
	});
	return sha256Hex(stableStringify({
		prefix: responsesContinuationPrefixFingerprint(input, output),
		reasoning
	}));
}
/** Bind measured usage to the admitted replay prefix, without copying its content. */
function recordResponsesContextUsage(message, model, identity, request, output, projection) {
	const usage = message.usage.contextUsage;
	if (usage?.state !== "available" || !Number.isSafeInteger(usage.totalTokens) || usage.totalTokens <= 0 || message.stopReason === "error" || message.stopReason === "aborted" || message.providerReplay || request.previous_response_id || !Array.isArray(request.input) || !request.input.some((item) => isRecord(item) && item.type === "compaction") || !Array.isArray(output) || output.some((item) => isRecord(item) && item.type === "compaction")) return;
	const replayOutput = (projection === "transport" ? convertResponsesMessages : convertProviderResponsesMessages)(model, { messages: [message] }, TOOL_CALL_PROVIDERS, {
		...identity,
		includeSystemPrompt: false
	}).filter((item) => item.type !== "function_call_output");
	const firstInput = request.input[0];
	const contextUsage = {
		...buildProviderReplayContext(model, identity),
		projection,
		includeSystemPrompt: request.instructions === void 0 && firstInput?.type === "message" && (firstInput.role === "developer" || firstInput.role === "system"),
		prefixHash: contextFingerprint(request.input, replayOutput),
		prefixLength: request.input.length + replayOutput.length,
		promptTokens: usage.promptTokens,
		totalTokens: usage.totalTokens
	};
	Object.assign(message, { openclawResponsesInputReplay: {
		...readResponsesInputReplayState(message),
		contextUsage
	} });
}
/** Only matching provider input may replace the conservative local pressure estimate. */
function resolveResponsesContextUsageBoundary(messages, model, identity, systemPrompt) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (!message || !isAssistant(message)) continue;
		const state = readResponsesInputReplayState(message)?.contextUsage;
		const usage = message.usage.contextUsage;
		if (!isRecord(state) || usage?.state !== "available") continue;
		const { projection, prefixHash, prefixLength, promptTokens, totalTokens, includeSystemPrompt } = state;
		if (!isProviderReplayContext(state) || !providerReplayContextMatches(state, buildProviderReplayContext(model, identity)) || message.provider !== model.provider || message.api !== model.api || message.model !== model.id || projection !== "transport" && projection !== "provider" || typeof prefixHash !== "string" || typeof prefixLength !== "number" || !Number.isSafeInteger(prefixLength) || prefixLength <= 0 || promptTokens !== usage.promptTokens || totalTokens !== usage.totalTokens || !Number.isSafeInteger(usage.totalTokens) || usage.totalTokens <= 0) return;
		const input = (projection === "transport" ? convertResponsesMessages : convertProviderResponsesMessages)(model, {
			messages: messages.filter(isProviderMessage),
			systemPrompt
		}, TOOL_CALL_PROVIDERS, {
			...identity,
			includeSystemPrompt: includeSystemPrompt === true
		});
		if (input.length < prefixLength || contextFingerprint(input.slice(0, prefixLength)) !== prefixHash) return;
		return {
			index,
			totalTokens: usage.totalTokens,
			suffix: input.slice(prefixLength)
		};
	}
}
function isAssistant(message) {
	return message.role === "assistant";
}
function isProviderMessage(message) {
	return message.role === "user" || message.role === "assistant" || message.role === "toolResult";
}
//#endregion
//#region packages/ai/src/transports/openai-responses-debug.ts
function stringifyUnknown(value, fallback = "") {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return fallback;
}
function safeDebugValue(value) {
	if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
	return Array.isArray(value) ? "array" : typeof value;
}
function responseInputTextChars(input) {
	if (typeof input === "string") return input.length;
	if (Array.isArray(input)) return input.reduce((total, item) => total + responseInputTextChars(item), 0);
	if (!input || typeof input !== "object") return 0;
	const record = input;
	let total = 0;
	if (typeof record.text === "string") total += record.text.length;
	if (typeof record.content === "string") total += record.content.length;
	else if (Array.isArray(record.content)) total += responseInputTextChars(record.content);
	return total;
}
function responseInputRoles(input) {
	if (!Array.isArray(input)) return "";
	const roles = /* @__PURE__ */ new Set();
	for (const item of input) if (item && typeof item === "object") {
		const role = item.role;
		if (typeof role === "string" && role.trim()) roles.add(role.trim());
	}
	return [...roles].toSorted().join(",");
}
function responseInputItemShape(input) {
	if (!Array.isArray(input)) return "none";
	return input.map((item) => {
		if (!isRecord(item) || typeof item.type !== "string") return "unknown";
		if (item.type === "message" && typeof item.role === "string") return `message:${item.role}`;
		return item.type;
	}).join(",") || "none";
}
function summarizeResponsesCompactionItems(input) {
	const compactions = (Array.isArray(input) ? input : []).flatMap((item, inputIndex) => {
		if (!isRecord(item) || item.type !== "compaction") return [];
		return [{
			idHash: typeof item.id === "string" ? sha256Hex(item.id) : void 0,
			inputIndex,
			payloadHash: typeof item.encrypted_content === "string" ? sha256Hex(item.encrypted_content) : void 0
		}];
	});
	return [
		`compactionItems=${compactions.length}`,
		`compactionIdHashes=${compactions.flatMap((item) => item.idHash ?? []).join(",") || "none"}`,
		`compactionPayloadHashes=${compactions.flatMap((item) => item.payloadHash ?? []).join(",") || "none"}`,
		`compactionInputIndexes=${compactions.map((item) => item.inputIndex).join(",") || "none"}`
	];
}
function readToolPayloadField(record, field) {
	try {
		return record[field];
	} catch {
		return;
	}
}
function readResponsesToolDisplayName(tool) {
	if (!tool || typeof tool !== "object") return "";
	const record = tool;
	const name = readToolPayloadField(record, "name");
	if (typeof name === "string") return name;
	const fn = readToolPayloadField(record, "function");
	if (fn && typeof fn === "object") {
		const fnName = readToolPayloadField(fn, "name");
		if (typeof fnName === "string") return fnName;
	}
	const type = readToolPayloadField(record, "type");
	return typeof type === "string" && type !== "function" ? type : "";
}
function summarizeResponsesTools(tools) {
	if (!Array.isArray(tools)) return "count=0";
	const names = tools.map(readResponsesToolDisplayName).filter(Boolean);
	const mode = resolveModelPayloadDebugMode();
	const maxNames = mode === "tools" || mode === "full-redacted" ? names.length : 12;
	const label = maxNames >= names.length ? "names" : "sample";
	const shown = names.slice(0, maxNames).join(",");
	return `count=${tools.length}${shown ? ` ${label}=${shown}` : ""}`;
}
function stringifyRedactedPayload(value) {
	try {
		const encoded = JSON.stringify(value, (key, child) => key === "encrypted_content" ? "<opaque data omitted>" : child);
		if (!encoded) return "<empty>";
		const redacted = redactSensitiveText(encoded);
		return redacted.length > 8e3 ? `${truncateUtf16Safe(redacted, 8e3)}…<truncated>` : redacted;
	} catch {
		return "<unserializable>";
	}
}
function stringifyRedactedEvent(value) {
	const redacted = stringifyRedactedPayload(value);
	return redacted.length > 2e3 ? `${truncateUtf16Safe(redacted, 2e3)}…<truncated>` : redacted;
}
const RESPONSE_FAILED_FAILURE_FIELD_KEYS = [
	"error",
	"incomplete_details",
	"status_details",
	"failure_reason",
	"last_error",
	"provider_error",
	"error_details"
];
function buildResponsesFailedEventSummary(message, responseId, code, observation) {
	return {
		message,
		...responseId ? { responseId } : {},
		...code ? { code } : {},
		...observation ? { observation } : {}
	};
}
function isResponseFailedIdentifierKey(key) {
	const normalized = key.replace(/[-_\s]/g, "").toLowerCase();
	return normalized.includes("request") && normalized.endsWith("id") || normalized.includes("provider") && normalized.endsWith("id");
}
function collectResponseFailedIdentifierHashes(input) {
	const out = [];
	const seen = /* @__PURE__ */ new WeakSet();
	const visit = (value, path, depth, identifierKey) => {
		if (out.length >= 12 || depth > 4 || !value || typeof value !== "object" || seen.has(value)) return;
		seen.add(value);
		const entries = Array.isArray(value) ? value.entries() : Object.entries(value);
		for (const [key, child] of entries) {
			if (out.length >= 12 || typeof key === "number" && key >= 8) break;
			const childPath = typeof key === "number" ? `${path}[${key}]` : path ? `${path}.${key}` : key;
			const childIdentifierKey = typeof key === "number" ? identifierKey : key;
			const isIdentifier = isResponseFailedIdentifierKey(childIdentifierKey);
			const childString = typeof child === "string" || typeof child === "number" ? String(child).trim() : "";
			if (isIdentifier && childString) out.push(`${childPath}=${redactIdentifier(childString, { len: 12 })}`);
			else visit(child, childPath, depth + 1, isIdentifier ? childIdentifierKey : "");
		}
	};
	visit(input, "", 0, "");
	return out;
}
function redactResponseFailedDiagnosticValue(input) {
	const seen = /* @__PURE__ */ new WeakSet();
	const redact = (value, key, depth) => {
		if (typeof value === "string" || typeof value === "number") return key && isResponseFailedIdentifierKey(key) ? redactIdentifier(String(value), { len: 12 }) : value;
		if (depth > 6 || !value || typeof value !== "object") return value;
		if (seen.has(value)) return "<circular>";
		seen.add(value);
		if (Array.isArray(value)) return value.slice(0, 16).map((item) => redact(item, key, depth + 1));
		const out = {};
		for (const [childKey, child] of Object.entries(value)) out[childKey] = redact(child, childKey, depth + 1);
		return out;
	};
	return redact(input, "", 0);
}
function buildResponsesFailedFailureFields(response) {
	if (!response) return {};
	const fields = {};
	for (const key of RESPONSE_FAILED_FAILURE_FIELD_KEYS) if (response[key] !== void 0 && response[key] !== null) fields[key] = response[key];
	return fields;
}
function buildResponsesFailedNoDetailsObservation(event, model, response = isRecord(event.response) ? event.response : void 0) {
	const failureFields = redactResponseFailedDiagnosticValue(buildResponsesFailedFailureFields(response));
	const metadataKeys = isRecord(response?.metadata) ? Object.keys(response.metadata).toSorted() : [];
	const responsePreview = {
		id: stringifyUnknown(response?.id),
		status: stringifyUnknown(response?.status),
		model: stringifyUnknown(response?.model),
		object: stringifyUnknown(response?.object),
		failureFields,
		metadataKeys
	};
	return {
		event: "openai_responses_response_failed_without_details",
		provider: model.provider,
		api: model.api,
		transportModel: model.id,
		providerRuntimeFailureKind: "no_error_details",
		responseId: responsePreview.id,
		responseStatus: responsePreview.status,
		responseModel: responsePreview.model,
		responseObject: responsePreview.object,
		metadataKeys,
		requestIdHashes: collectResponseFailedIdentifierHashes(event),
		failureFieldsPreview: stringifyRedactedEvent(failureFields),
		responsePreview: stringifyRedactedEvent(responsePreview)
	};
}
function summarizeResponsesFailedNoDetailsObservation(observation) {
	const requestIds = observation.requestIdHashes.join(",");
	const metadataKeys = observation.metadataKeys.join(",");
	return `responseId=${safeDebugValue(observation.responseId || void 0)} responseStatus=${safeDebugValue(observation.responseStatus || void 0)} responseModel=${safeDebugValue(observation.responseModel || void 0)} requestIds=${requestIds || "none"} metadataKeys=${metadataKeys || "none"} failureFields=${observation.failureFieldsPreview}`;
}
function normalizeResponsesFailedEvent(event, model) {
	const response = isRecord(event.response) ? event.response : void 0;
	const responseId = stringifyUnknown(response?.id) || void 0;
	const error = isRecord(response?.error) ? response.error : void 0;
	if (error) {
		const code = stringifyUnknown(error.code).trim();
		const message = stringifyUnknown(error.message).trim();
		if (code || message) return buildResponsesFailedEventSummary(`${code || "unknown"}: ${message || "no message"}`, responseId, code || void 0);
	}
	const incompleteReason = stringifyUnknown((isRecord(response?.incomplete_details) ? response.incomplete_details : void 0)?.reason);
	if (incompleteReason) return buildResponsesFailedEventSummary(`incomplete: ${incompleteReason}`, responseId);
	return buildResponsesFailedEventSummary(RESPONSE_FAILED_NO_DETAILS_MESSAGE, responseId, void 0, buildResponsesFailedNoDetailsObservation(event, model, response));
}
var ResponsesStreamFailure = class extends Error {
	constructor(failure, response) {
		super(failure.message);
		this.name = "ResponsesStreamFailure";
		this.responseId = failure.responseId;
		this.response = response;
		this.code = failure.code;
		this.observation = failure.observation;
	}
};
function logResponsesFailedNoDetails(observation) {
	log.warn(`[responses] response.failed missing error details provider=${observation.provider} api=${observation.api} model=${observation.transportModel} ` + summarizeResponsesFailedNoDetailsObservation(observation), observation);
}
function summarizeResponsesPayload(params) {
	if (!params || typeof params !== "object") return "payload=non-object";
	const record = params;
	const input = record.input;
	const reasoning = record.reasoning && typeof record.reasoning === "object" ? record.reasoning : void 0;
	const text = record.text && typeof record.text === "object" ? record.text : void 0;
	const parts = [
		`fields=${Object.keys(record).toSorted().join(",")}`,
		`model=${safeDebugValue(record.model)}`,
		`stream=${safeDebugValue(record.stream)}`,
		`inputItems=${Array.isArray(input) ? input.length : typeof input}`,
		`inputItemShape=${responseInputItemShape(input)}`,
		`inputRoles=${responseInputRoles(input) || "none"}`,
		`inputTextChars=${responseInputTextChars(input)}`,
		`tools=${summarizeResponsesTools(record.tools)}`,
		`reasoningEffort=${safeDebugValue(reasoning?.effort)}`,
		`reasoningSummary=${safeDebugValue(reasoning?.summary)}`,
		`textVerbosity=${safeDebugValue(text?.verbosity)}`,
		`serviceTier=${safeDebugValue(record.service_tier)}`,
		...summarizeResponsesCompactionItems(input),
		`store=${safeDebugValue(record.store)}`,
		`promptCacheKey=${record.prompt_cache_key === void 0 ? "absent" : "present"}`,
		`metadataKeys=${record.metadata && typeof record.metadata === "object" ? Object.keys(record.metadata).toSorted().join(",") : "none"}`
	];
	if (resolveModelPayloadDebugMode() === "full-redacted") parts.push(`payload=${stringifyRedactedPayload(record)}`);
	return parts.join(" ");
}
function summarizeOpenAITransportError(error) {
	if (!error || typeof error !== "object") return `type=${typeof error} message=${safeDebugValue(error)}`;
	const record = error;
	const cause = record.cause && typeof record.cause === "object" ? record.cause : void 0;
	return [
		`name=${safeDebugValue(record.name)}`,
		`status=${safeDebugValue(record.status)}`,
		`code=${safeDebugValue(record.code)}`,
		`type=${safeDebugValue(record.type)}`,
		`causeName=${safeDebugValue(cause?.name)}`,
		`causeCode=${safeDebugValue(cause?.code)}`,
		`message=${error instanceof Error ? error.message : safeDebugValue(error)}`
	].join(" ");
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay-internal.ts
function isAsyncIterable(value) {
	return (typeof value === "object" && value !== null || typeof value === "function") && Symbol.asyncIterator in value;
}
function isInvalidEncryptedContentError(error) {
	if (!error || typeof error !== "object") return false;
	const record = error;
	if (record.code === "invalid_encrypted_content" || record.code === "thinking_signature_invalid") return true;
	const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
	return message.includes("invalid_encrypted_content") || message.includes("thinking_signature_invalid") || (record.status === 400 || record.status == null && /(?:^|[\s(])400(?:[\s):]|$)/.test(message)) && (message.includes("could not decrypt the provided encrypted_content") || message.includes("encrypted content") && (message.includes("could not be verified") || message.includes("could not be decrypted or parsed")));
}
function isOrphanedFunctionCallOutputError(error) {
	if (!error || typeof error !== "object") return false;
	const record = error;
	const message = typeof record.message === "string" ? record.message : "";
	return /No tool call found for function call output with call_id [A-Za-z0-9_-]+/.test(message);
}
function commitResponsesEncryptedContentAttempt(attempt, commit) {
	if (attempt.kind === "compaction-stripped") commit(attempt.rejectedCompaction);
}
function stripResponsesRequestEncryptedReasoning(request) {
	const stripped = stripEncryptedReasoningContentFields(request.input);
	if (!stripped.changed) return request;
	return {
		...request,
		input: stripped.value
	};
}
function stripResponsesRequestCompaction(request) {
	if (!Array.isArray(request.input)) return request;
	const input = request.input.filter((item) => !(item !== null && typeof item === "object" && item.type === "compaction"));
	return input.length === request.input.length ? request : {
		...request,
		input
	};
}
function readOpenAIResponsesCompactionRejection(request) {
	if (!Array.isArray(request.input)) return;
	const item = request.input.find((candidate) => candidate !== null && typeof candidate === "object" && candidate.type === "compaction" && typeof candidate.encrypted_content === "string");
	return item ? {
		data: item.encrypted_content,
		...typeof item.id === "string" ? { id: item.id } : {}
	} : void 0;
}
async function resolveNextResponsesEncryptedContentAttempt(attempt, error, options) {
	const orphanedFunctionOutput = isOrphanedFunctionCallOutputError(error);
	if (!isInvalidEncryptedContentError(error) && !orphanedFunctionOutput || attempt.kind === "compaction-stripped") return;
	if (!orphanedFunctionOutput && (attempt.kind === "initial" || attempt.kind === "continuation-rejected")) {
		const reasoningStripped = stripResponsesRequestEncryptedReasoning(attempt.request);
		if (reasoningStripped !== attempt.request) return {
			kind: "reasoning-stripped",
			request: reasoningStripped
		};
	}
	const locallyStripped = stripResponsesRequestCompaction(attempt.request);
	if (locallyStripped === attempt.request) return;
	let compactionStripped = options?.buildFullHistoryRequest ? await options.buildFullHistoryRequest() : locallyStripped;
	compactionStripped = stripResponsesRequestCompaction(compactionStripped);
	if (attempt.kind === "reasoning-stripped") compactionStripped = stripResponsesRequestEncryptedReasoning(compactionStripped);
	return {
		kind: "compaction-stripped",
		request: compactionStripped,
		rejectedCompaction: readOpenAIResponsesCompactionRejection(attempt.request)
	};
}
async function createResponsesStreamWithEncryptedContentRetry(params) {
	const encodeBody = params.encodeBody ?? prepareModelRequestBody(void 0);
	const send = async (initialAttempt) => {
		let attempt = initialAttempt;
		for (;;) {
			params.observePrompt?.(attempt.request, {
				egress: "responses-sdk",
				payloadVariant: attempt.kind
			});
			const bodyOptions = await encodeBody(attempt.request);
			try {
				const { data, response } = await params.client.responses.create(attempt.request, {
					...params.requestOptions,
					...bodyOptions,
					headers: {
						...bodyOptions.headers,
						...params.requestOptions?.headers
					}
				}).withResponse();
				commitResponsesEncryptedContentAttempt(attempt, (checkpoint) => {
					if (checkpoint) params.onCompactionRejected?.(checkpoint);
				});
				if (!isAsyncIterable(data)) throw new Error("OpenAI Responses streaming request returned a non-stream response");
				return {
					stream: data,
					response,
					attempt
				};
			} catch (error) {
				let nextAttempt = await resolveNextResponsesEncryptedContentAttempt(attempt, error, { buildFullHistoryRequest: params.buildFullHistoryRequest });
				if (!nextAttempt && attempt.request.previous_response_id && error && typeof error === "object" && typeof error.status === "number" && isPreviousResponseRejection(error)) {
					const request = { ...params.buildFullHistoryRequest ? await params.buildFullHistoryRequest() : attempt.request };
					delete request.previous_response_id;
					nextAttempt = {
						kind: "continuation-rejected",
						request
					};
				}
				if (!nextAttempt) throw error;
				const retryDescription = nextAttempt.kind === "reasoning-stripped" ? "without encrypted reasoning content" : nextAttempt.kind === "compaction-stripped" ? "without encrypted compaction content" : "full history after rejected previous_response_id";
				log.warn(`[responses] retrying ${retryDescription} provider=${params.model.provider} api=${params.model.api} model=${params.model.id}`);
				attempt = nextAttempt;
			}
		}
	};
	const result = await send({
		kind: params.initialAttemptKind ?? "initial",
		request: params.request,
		...params.initialRejectedCompaction ? { rejectedCompaction: params.initialRejectedCompaction } : {}
	});
	return { stream: { async *[Symbol.asyncIterator]() {
		let current = result;
		for (;;) {
			let rejectedEvent;
			try {
				for await (const event of params.wrapStream?.(current) ?? current.stream) {
					if (isRecord(event)) {
						const failure = event.type === "response.failed" && isRecord(event.response) ? event.response.error : event.type === "error" ? event.error ?? event : void 0;
						if (isRecord(failure) && params.canRetryStream?.() === true && isInvalidEncryptedContentError(failure)) {
							rejectedEvent = event;
							const message = typeof failure.message === "string" ? failure.message : "";
							throw Object.assign(new Error(message), {
								code: failure.code,
								status: failure.status
							});
						}
					}
					yield event;
				}
				return;
			} catch (error) {
				const nextAttempt = params.canRetryStream?.() === true && !params.requestOptions?.signal?.aborted ? await resolveNextResponsesEncryptedContentAttempt(current.attempt, error, { buildFullHistoryRequest: params.buildFullHistoryRequest }) : void 0;
				if (!nextAttempt) {
					if (rejectedEvent !== void 0) {
						yield rejectedEvent;
						return;
					}
					throw error;
				}
				log.warn(`[responses] retrying streamed encrypted content provider=${params.model.provider} api=${params.model.api} model=${params.model.id}`);
				current = await send(nextAttempt);
			}
		}
	} } };
}
function resolveAzureOpenAIApiVersion(env = process.env) {
	return env.AZURE_OPENAI_API_VERSION?.trim() || "preview";
}
//#endregion
//#region packages/ai/src/providers/openai-responses-stream-compat.ts
const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
const OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
const AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
function isResponsesTextContentPartType(type) {
	return type === "output_text" || type === "text";
}
function isResponsesTextDeltaEventType(type) {
	return type === "response.output_text.delta" || type === "response.text.delta";
}
function isAzureResponsesTextDeltaEventType(type) {
	return type === AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
}
function isAzureResponsesTextDeltaEvent(event) {
	return isAzureResponsesTextDeltaEventType(event.type) && typeof event.delta === "string";
}
function resolveResponsesMessageSnapshotCollapse(params) {
	const { prior, nextText } = params;
	if (!prior?.text || !nextText || prior.phase !== params.nextPhase) return { kind: "keep" };
	if (nextText.length > prior.text.length && nextText.startsWith(prior.text)) return {
		kind: "extend",
		text: nextText
	};
	return { kind: "keep" };
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-slots-internal.ts
function createResponsesOutputTracker(params) {
	const outputs = /* @__PURE__ */ new Map();
	let currentEventType = "unknown";
	let providerToolObserved = false;
	let visibleTextEmitted = false;
	let terminalAllowsRetry = false;
	const identity = (item) => {
		if ((item.type === "reasoning" || item.type === "message") && item.id) return `${item.type}:${item.id}`;
		const callId = item.call_id ?? item.id;
		return item.type === "function_call" && callId ? `function_call:${callId}` : void 0;
	};
	const get = (item, outputIndex) => {
		const key = identity(item);
		const output = (outputIndex === void 0 ? void 0 : outputs.get(outputIndex)) ?? (key === void 0 ? void 0 : outputs.get(key));
		if (!output || outputIndex !== void 0 && output.outputIndex !== void 0 && output.outputIndex !== outputIndex) return;
		if (output.type !== item.type || output.callId && item.call_id && output.callId !== item.call_id) throw new ResponsesOutputIdentityError({
			outputIndex,
			expectedType: output.type,
			actualType: item.type,
			completed: output.completed,
			completedToolCall: [...outputs.values()].some((candidate) => candidate.type === "function_call" && candidate.completed),
			eventType: currentEventType,
			retrySafe: params.canRetryIdentityConflict?.() === true && !providerToolObserved && !visibleTextEmitted && terminalAllowsRetry && !params.output.content.some((block) => block.type === "text" && block.text.length > 0)
		});
		return output;
	};
	return {
		trackStream(sink) {
			return { push(event) {
				visibleTextEmitted ||= event.type === "text_delta" && event.delta.length > 0 || event.type === "text_end" && event.content.length > 0;
				sink.push(event);
			} };
		},
		observeEvent(event) {
			currentEventType = event.type;
			terminalAllowsRetry = false;
			if (event.type === "response.output_item.added" || event.type === "response.output_item.done") providerToolObserved ||= isResponsesProviderTool(event.item);
			else if (event.type === "response.completed" || event.type === "response.incomplete") {
				let terminalHasRefusal = false;
				for (const item of event.response.output ?? []) {
					providerToolObserved ||= isResponsesProviderTool(item);
					terminalHasRefusal ||= item.type === "message" && (item.content ?? []).some((part) => part.type === "refusal");
				}
				terminalAllowsRetry = event.type === "response.completed" && event.response.status === "completed" && event.response.error == null && event.response.incomplete_details == null && !terminalHasRefusal;
			}
		},
		get,
		set(item, contentIndex, outputIndex, completed = false) {
			const output = get(item, outputIndex) ?? {
				type: item.type,
				contentIndex,
				completed
			};
			Object.assign(output, {
				contentIndex,
				completed
			});
			if (item.call_id) output.callId = item.call_id;
			if (outputIndex !== void 0) {
				output.outputIndex = outputIndex;
				outputs.set(outputIndex, output);
			}
			const key = identity(item);
			if (key !== void 0) outputs.set(key, output);
		}
	};
}
function appendResponsesPendingTextDelta(slot, delta, materialize) {
	const offset = slot.pendingText?.length ?? 0;
	slot.pendingText = `${slot.pendingText ?? ""}${delta}`;
	const priorText = slot.collapseCandidate?.block.text ?? "";
	if (offset >= priorText.length || priorText.startsWith(delta.slice(0, priorText.length - offset), offset)) return;
	materialize(slot);
}
function readResponsesOutputIndex(event) {
	const outputIndex = event.output_index;
	return typeof outputIndex === "number" && Number.isInteger(outputIndex) && outputIndex >= 0 ? outputIndex : void 0;
}
function createResponsesOutputSlotTracker() {
	const indexed = /* @__PURE__ */ new Map();
	let unindexed;
	return {
		register(event, slot) {
			const outputIndex = readResponsesOutputIndex(event);
			if (outputIndex === void 0) {
				if (unindexed) throw new Error("Responses stream added overlapping unindexed output items");
				unindexed = slot;
				return;
			}
			if (indexed.has(outputIndex)) throw new Error(`Responses stream reused active output index ${outputIndex}`);
			indexed.set(outputIndex, slot);
		},
		resolve(event, type) {
			const outputIndex = readResponsesOutputIndex(event);
			let slot = outputIndex === void 0 ? unindexed : indexed.get(outputIndex);
			if (outputIndex === void 0 && !slot) {
				const matches = [...indexed.values()].filter((candidate) => candidate.type === type);
				slot = matches.length === 1 ? matches[0] : void 0;
			}
			return slot?.type === type ? slot : void 0;
		},
		get(event) {
			const outputIndex = readResponsesOutputIndex(event);
			return outputIndex === void 0 ? unindexed : indexed.get(outputIndex);
		},
		resolveOutputItem(event, item) {
			if (item.type === "reasoning") return this.resolve(event, "thinking");
			if (item.type === "message") return this.resolve(event, "text");
			return readResponsesOutputIndex(event) === void 0 ? void 0 : this.get(event);
		},
		values() {
			return [.../* @__PURE__ */ new Set([...indexed.values(), ...unindexed ? [unindexed] : []])];
		},
		forget(slot) {
			if (unindexed === slot) unindexed = void 0;
			for (const [outputIndex, candidate] of indexed) if (candidate === slot) indexed.delete(outputIndex);
		}
	};
}
//#endregion
//#region packages/ai/src/providers/openai-responses-tool-call-tracker.ts
function readEventIdentity(event) {
	return { itemId: normalizeOptionalString(event.item_id) };
}
function readResponsesToolCallItemIdentity(item) {
	return {
		itemId: normalizeOptionalString(item.id),
		callId: normalizeOptionalString(item.call_id)
	};
}
function createResponsesToolCallTracker() {
	const indexedCalls = /* @__PURE__ */ new Map();
	const unindexedCalls = /* @__PURE__ */ new Set();
	const identitiesConflict = (state, identity) => Boolean(state.itemId && identity.itemId && state.itemId !== identity.itemId || state.callId && identity.callId && state.callId !== identity.callId);
	const sharesIdentity = (state, identity) => Boolean(state.itemId && identity.itemId && state.itemId === identity.itemId || state.callId && identity.callId && state.callId === identity.callId);
	const adoptIdentity = (state, identity) => {
		state.itemId ??= identity.itemId;
		state.callId ??= identity.callId;
		return state;
	};
	const resolveCompatible = (candidates, identity, allowUnmatchedIdentity) => {
		const uniqueCandidates = [...new Set(candidates)];
		if (!identity.itemId && !identity.callId) return allowUnmatchedIdentity && uniqueCandidates.length === 1 ? uniqueCandidates.at(0) : void 0;
		const compatible = uniqueCandidates.filter((state) => !identitiesConflict(state, identity));
		const matches = compatible.filter((state) => sharesIdentity(state, identity));
		const matched = matches.length === 1 ? matches.at(0) : allowUnmatchedIdentity && uniqueCandidates.length === 1 ? compatible.at(0) : void 0;
		return matched ? adoptIdentity(matched, identity) : void 0;
	};
	return {
		register(event, state) {
			const outputIndex = readResponsesOutputIndex(event);
			if (outputIndex === void 0) {
				unindexedCalls.add(state);
				return;
			}
			if (indexedCalls.has(outputIndex)) throw new Error(`Responses stream reused active tool-call output index ${outputIndex}`);
			state.outputIndex = outputIndex;
			indexedCalls.set(outputIndex, state);
		},
		resolve(event, identity = readEventIdentity(event), allowUnmatchedIdentity = true) {
			const outputIndex = readResponsesOutputIndex(event);
			if (outputIndex !== void 0) {
				const indexed = indexedCalls.get(outputIndex);
				if (indexed) {
					if (indexed.callId && identity.callId && indexed.callId !== identity.callId) return;
					return adoptIdentity(indexed, identity);
				}
				const unindexed = resolveCompatible(unindexedCalls, identity, allowUnmatchedIdentity);
				if (unindexed) {
					unindexedCalls.delete(unindexed);
					unindexed.outputIndex = outputIndex;
					indexedCalls.set(outputIndex, unindexed);
				}
				return unindexed;
			}
			return resolveCompatible([...indexedCalls.values(), ...unindexedCalls], identity, allowUnmatchedIdentity);
		},
		forget(toolCall) {
			for (const [outputIndex, tracked] of indexedCalls) if (tracked === toolCall) indexedCalls.delete(outputIndex);
			unindexedCalls.delete(toolCall);
		},
		markArgumentsUnreliable() {
			for (const toolCall of /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])) toolCall.argumentStreamReliable = false;
		},
		hasActive() {
			return indexedCalls.size > 0 || unindexedCalls.size > 0;
		},
		values() {
			return [.../* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])];
		},
		hasExactlyActive(expected) {
			const active = /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls]);
			return active.size === expected.length && expected.every((state) => active.has(state));
		}
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-observer-internal.ts
const STRING_DELTA_EVENTS = /* @__PURE__ */ new Set([
	"response.function_call_arguments.delta",
	"response.output_text.delta",
	"response.reasoning_summary_text.delta",
	"response.reasoning_text.delta",
	"response.refusal.delta",
	"response.text.delta"
]);
async function* adaptResponsesStream(stream, signal) {
	for await (const event of iterateModelStream(stream, signal)) {
		if (!isRecord(event) || typeof event.type !== "string") throw new Error("Responses stream delivered a malformed event without a string type");
		if (STRING_DELTA_EVENTS.has(event.type) && typeof event.delta !== "string") throw new Error(`Responses stream delivered malformed ${event.type} delta`);
		if ((event.type === "response.output_item.added" || event.type === "response.output_item.done") && !isRecord(event.item)) throw new Error(`Responses stream delivered malformed ${event.type} item`);
		if ((event.type === "response.created" || event.type === "response.completed" || event.type === "response.incomplete" || event.type === "response.failed") && !isRecord(event.response)) throw new Error(`Responses stream delivered malformed ${event.type} response`);
		yield event;
	}
}
async function* observeResponsesStream(stream, model, requestStartedAt) {
	const startedAt = Date.now();
	const eventTypes = /* @__PURE__ */ new Map();
	const debugMode = resolveModelSseDebugMode();
	let eventCount = 0;
	try {
		for await (const event of stream) {
			const type = isRecord(event) && typeof event.type === "string" ? event.type : "unknown";
			eventCount += 1;
			eventTypes.set(type, (eventTypes.get(type) ?? 0) + 1);
			if (eventCount === 1) emitModelTransportDebug(log, `[responses] first_event provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - (requestStartedAt ?? startedAt)} headersToEventMs=${Date.now() - startedAt} type=${type}`);
			if (debugMode === "peek" && eventCount <= 5) emitModelTransportDebug(log, `[responses] event_peek provider=${model.provider} api=${model.api} model=${model.id} index=${eventCount} type=${type} event=${stringifyRedactedEvent(event)}`);
			yield event;
		}
	} finally {
		const types = [...eventTypes].map(([type, count]) => `${type}:${count}`).join(",");
		emitModelTransportDebug(log, `[responses] stream_done provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - startedAt} events=${eventCount} types=${types}`);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-terminal-internal.ts
function splitToolCallId(id) {
	const separator = id.indexOf("|");
	return separator === -1 ? [id, void 0] : [id.slice(0, separator), id.slice(separator + 1)];
}
function resolveResponsesToolCallId(item, fallbackId) {
	const callId = typeof item.call_id === "string" ? item.call_id.trim() : "";
	const itemId = typeof item.id === "string" ? item.id.trim() : "";
	const [fallbackCallId, fallbackItemId = ""] = splitToolCallId(fallbackId ?? "");
	const resolvedCallId = callId || fallbackCallId;
	const resolvedItemId = itemId || fallbackItemId;
	if (resolvedCallId) return resolvedItemId ? `${resolvedCallId}|${resolvedItemId}` : resolvedCallId;
	const generated = `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
	return resolvedItemId ? `${generated}|${resolvedItemId}` : generated;
}
function resolveCompletedResponsesToolCall(item, streamed) {
	if (item.status && item.status !== "completed") throw new IncompleteToolCallError("Responses stream completed with an incomplete terminal tool call");
	const streamedName = streamed?.name?.trim() || void 0;
	const completedName = typeof item.name === "string" ? item.name.trim() || void 0 : void 0;
	if (streamedName && completedName && streamedName !== completedName) throw new Error(`Responses stream changed tool-call function name from ${streamedName} to ${completedName}`);
	const name = completedName ?? streamedName;
	if (!name) throw new Error("Responses stream completed tool call without a function name");
	return {
		name,
		arguments: parseTerminalToolCallArguments(streamed?.arguments ?? item.arguments, "Responses stream completed tool call with invalid JSON arguments")
	};
}
function createResponsesTerminalController(params) {
	const { output, stream, model, options } = params;
	const blocks = output.content;
	let rejectedToolCallId;
	const recordIncompleteToolCall = (event, item) => {
		rejectedToolCallId = params.toolCalls.resolve(event, readResponsesToolCallItemIdentity(item))?.block.id ?? (item.call_id ? resolveResponsesToolCallId(item) : void 0);
	};
	const backfillReasoning = (items) => {
		for (const [outputIndex, item] of items.entries()) {
			if (item.type !== "reasoning" || !item.encrypted_content) continue;
			const tracked = params.outputs.get(item, outputIndex);
			const block = tracked && blocks[tracked.contentIndex];
			if (block?.type !== "thinking" || !block.thinkingSignature) continue;
			const stored = JSON.parse(block.thinkingSignature);
			if (!stored.encrypted_content) block.thinkingSignature = JSON.stringify({
				...stored,
				encrypted_content: item.encrypted_content
			});
			if (options?.reasoningReplayMetadata) Object.assign(block, { [OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY]: options.reasoningReplayMetadata });
		}
	};
	const appendText = (item, contentIndex) => {
		const text = (Array.isArray(item.content) ? item.content : []).map((part) => {
			const content = part;
			return content.type === "output_text" || content.type === "text" ? content.text ?? "" : content.refusal ?? "";
		}).join("");
		const block = contentIndex === void 0 ? void 0 : blocks[contentIndex];
		const started = block?.type === "text" ? block : void 0;
		if (!text && !started) return;
		const phase = item.phase ?? void 0;
		if (started && contentIndex !== void 0) {
			const previousText = started.text;
			started.text = text;
			started.textSignature = encodeTextSignatureV1(item.id, phase);
			params.setLastTextBlock({
				block: started,
				index: contentIndex,
				phase
			});
			if (text.startsWith(previousText)) {
				const delta = text.slice(previousText.length);
				if (delta) stream.push({
					type: "text_delta",
					contentIndex,
					delta
				});
			}
			stream.push({
				type: "text_end",
				contentIndex,
				content: text,
				partial: output
			});
			return contentIndex;
		}
		const previous = params.getLastTextBlock();
		const collapse = resolveResponsesMessageSnapshotCollapse({
			prior: previous && {
				text: previous.block.text,
				phase: previous.phase
			},
			nextText: text,
			nextPhase: phase
		});
		if (collapse.kind === "extend" && previous) {
			previous.block.text = collapse.text;
			previous.block.textSignature = encodeTextSignatureV1(item.id, phase);
			stream.push({
				type: "text_end",
				contentIndex: previous.index,
				content: collapse.text,
				partial: output
			});
			return previous.index;
		}
		const newBlock = {
			type: "text",
			text,
			textSignature: encodeTextSignatureV1(item.id, phase)
		};
		blocks.push(newBlock);
		const index = blocks.length - 1;
		params.setLastTextBlock({
			block: newBlock,
			index,
			phase
		});
		stream.push({
			type: "text_start",
			contentIndex: index,
			partial: output
		});
		stream.push({
			type: "text_end",
			contentIndex: index,
			content: text,
			partial: output
		});
		return index;
	};
	const emitToolCallCompletion = (item, outputIndex, started, validated) => {
		const completed = {
			id: resolveResponsesToolCallId(item, started?.block.id),
			...validated
		};
		const toolCall = started ? Object.assign(started.block, completed) : {
			type: "toolCall",
			...completed
		};
		delete toolCall.partialJson;
		const contentIndex = started?.contentIndex ?? blocks.length;
		if (!started) {
			blocks.push(toolCall);
			stream.push({
				type: "toolcall_start",
				contentIndex,
				partial: output
			});
		}
		params.outputs.set(item, contentIndex, outputIndex, true);
		stream.push({
			type: "toolcall_end",
			contentIndex,
			toolCall,
			partial: output
		});
	};
	const recoverTerminalOutput = (items, completeToolCall) => {
		let hasCompletedLaterOutput = false;
		for (const [outputIndex, item] of [...items.entries()].toReversed()) {
			const tracked = params.outputs.get(item, outputIndex);
			if (item.type === "reasoning") {
				hasCompletedLaterOutput ||= tracked !== void 0;
				continue;
			}
			if (item.type !== "message" && item.type !== "function_call") continue;
			if (tracked) {
				hasCompletedLaterOutput = true;
				continue;
			}
			if (item.type === "function_call" && !completeToolCall) continue;
			if (hasCompletedLaterOutput) throw new Error("Responses stream omitted an output item before completed output");
		}
		for (const [terminalIndex, item] of items.entries()) if (item.type === "message") {
			const tracked = params.outputs.get(item, terminalIndex);
			if (tracked?.completed) continue;
			const appendedIndex = appendText(item, tracked?.contentIndex);
			if (appendedIndex !== void 0) params.outputs.set(item, appendedIndex, terminalIndex, true);
		} else {
			params.setLastTextBlock(null);
			const alreadyCapturedCompaction = item.type === "compaction" && output.providerReplay?.type === "openai-responses-compaction" && output.providerReplay.id === item.id && output.providerReplay.data === item.encrypted_content;
			if (item.type === "compaction" && !alreadyCapturedCompaction) {
				let replayIndex = blocks.length;
				for (const [laterIndex, laterItem] of items.entries()) {
					if (laterIndex <= terminalIndex) continue;
					const laterContentIndex = params.outputs.get(laterItem, laterIndex)?.contentIndex;
					if (laterContentIndex !== void 0) {
						replayIndex = laterContentIndex;
						break;
					}
				}
				captureOpenAIResponsesCompaction(output, item, replayIndex, model, options?.reasoningReplayMetadata);
			} else if (completeToolCall && item.type === "function_call") {
				if (params.outputs.get(item, terminalIndex)?.completed) continue;
				completeToolCall(terminalIndex);
			}
		}
	};
	const finalizeTerminalFacts = (response, responseId = response.id) => {
		options?.onServiceTier?.(response.service_tier);
		output.responseId = responseId || output.responseId;
		output.responseModel = options?.resolveResponseModel ? options.resolveResponseModel()?.trim() || void 0 : response.model?.trim() || void 0;
		const usage = mapResponsesTerminalUsage(response.usage);
		const reasoningTokens = readResponsesReasoningTokens(response.usage);
		if (usage) output.usage = {
			...usage,
			...reasoningTokens === void 0 ? {} : { reasoningTokens },
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		};
		calculateCost(model, output.usage);
		if (options?.applyServiceTierPricing) {
			const tier = options.resolveServiceTier ? options.resolveServiceTier(response.service_tier, options.serviceTier) : response.service_tier ?? options.serviceTier;
			options.applyServiceTierPricing(output.usage, tier);
		}
	};
	const finalizeResponse = (response, terminalEventType, hasRejectedToolCall) => {
		backfillReasoning(response.output ?? []);
		finalizeTerminalFacts(response);
		const terminal = resolveResponsesTerminalStopReason({
			status: response.status,
			terminalEventType,
			incompleteReason: response.incomplete_details?.reason,
			hasToolCall: blocks.some((block) => block.type === "toolCall")
		});
		output.stopReason = terminal.stopReason;
		output.errorMessage = terminal.errorMessage;
		if (terminalEventType === "response.completed" && typeof response.end_turn === "boolean") output.endTurn = response.end_turn;
		const incompleteReason = response.incomplete_details?.reason;
		const incompleteCall = response.output?.find((item) => item.type === "function_call" && item.status && item.status !== "completed");
		const incompleteToolCallId = rejectedToolCallId ?? (terminalEventType === "response.incomplete" && !hasRejectedToolCall ? params.toolCalls.values()[0]?.block.id : void 0) ?? (incompleteCall?.type === "function_call" && incompleteCall.call_id ? resolveResponsesToolCallId(incompleteCall) : void 0);
		appendAssistantMessageDiagnostic(output, {
			type: "openai_responses_terminal",
			timestamp: Date.now(),
			details: {
				eventType: terminalEventType,
				stopReason: terminal.stopReason,
				...incompleteToolCallId ? { incompleteToolCallId } : {},
				...terminalEventType === "response.incomplete" ? { incompleteReason: incompleteReason === "max_output_tokens" || incompleteReason === "max_messages" || incompleteReason === "content_filter" || incompleteReason === "steered" ? incompleteReason : "unknown" } : {},
				endTurn: typeof response.end_turn === "boolean" ? response.end_turn : response.end_turn === void 0 ? "absent" : "invalid"
			}
		});
		if (!hasRejectedToolCall && terminalEventType === "response.incomplete" && params.toolCalls.hasActive()) throw output.errorMessage ? new Error(output.errorMessage) : new IncompleteToolCallError("Responses stream completed with unresolved tool calls");
	};
	return {
		finalizeResponse,
		finalizeFailedResponse: finalizeTerminalFacts,
		recordIncompleteToolCall,
		recoverTerminalOutput,
		emitToolCallCompletion
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-internal.ts
async function processResponsesStream(openaiStream, output, sink, model, options) {
	const streamingToolCalls = createResponsesToolCallTracker();
	const outputSlots = createResponsesOutputSlotTracker();
	const outputs = createResponsesOutputTracker({
		output,
		canRetryIdentityConflict: options?.canRetryIdentityConflict
	});
	const stream = outputs.trackStream(sink);
	let terminalResponse;
	let rejectedToolCall;
	let lastTextBlock = null;
	const blocks = output.content;
	const compactionTracker = createCompactionTracker(output, model, options);
	const createOutputSlot = (event, item) => {
		if (item.type === "reasoning") {
			const block = {
				type: "thinking",
				thinking: ""
			};
			const slot = {
				type: "thinking",
				item,
				block,
				contentIndex: blocks.length,
				outputIndex: readResponsesOutputIndex(event)
			};
			blocks.push(block);
			outputs.set(item, slot.contentIndex, slot.outputIndex);
			outputSlots.register(event, slot);
			stream.push({
				type: "thinking_start",
				contentIndex: slot.contentIndex,
				partial: output
			});
			return slot;
		}
		if (item.type === "message") {
			const messageItem = item;
			const collapseCandidate = lastTextBlock;
			const block = collapseCandidate ? null : {
				type: "text",
				text: "",
				...messageItem.phase ? { textSignature: encodeTextSignatureV1(messageItem.id, messageItem.phase) } : {}
			};
			const slot = {
				type: "text",
				item: messageItem,
				block,
				contentIndex: block ? blocks.length : void 0,
				outputIndex: readResponsesOutputIndex(event),
				pendingText: collapseCandidate ? "" : null,
				collapseCandidate
			};
			if (block) {
				blocks.push(block);
				outputs.set(messageItem, slot.contentIndex ?? blocks.length - 1, slot.outputIndex);
			}
			outputSlots.register(event, slot);
			if (slot.contentIndex !== void 0) stream.push({
				type: "text_start",
				contentIndex: slot.contentIndex,
				partial: output
			});
			return slot;
		}
	};
	const materializeDeferredTextSlot = (slot) => {
		if (slot.block || slot.pendingText === null) return;
		const text = slot.pendingText;
		slot.block = {
			type: "text",
			text,
			...slot.item.phase ? { textSignature: encodeTextSignatureV1(slot.item.id, slot.item.phase) } : {}
		};
		blocks.push(slot.block);
		slot.contentIndex = blocks.length - 1;
		outputs.set(slot.item, slot.contentIndex, slot.outputIndex);
		stream.push({
			type: "text_start",
			contentIndex: slot.contentIndex,
			partial: output
		});
		if (text) stream.push({
			type: "text_delta",
			contentIndex: slot.contentIndex,
			delta: text
		});
		if (lastTextBlock === slot.collapseCandidate) lastTextBlock = null;
		slot.pendingText = null;
		slot.collapseCandidate = null;
	};
	const materializeDeferredTextSlots = (except) => {
		for (const slot of outputSlots.values()) if (slot !== except && slot.type === "text") materializeDeferredTextSlot(slot);
	};
	const appendThinkingDelta = (slot, delta) => {
		appendAssistantThinking(slot.block, delta);
		stream.push({
			type: "thinking_delta",
			contentIndex: slot.contentIndex,
			delta,
			partial: output
		});
	};
	const projectTextDelta = (slot, delta) => {
		if (slot.pendingText !== null) appendResponsesPendingTextDelta(slot, delta, materializeDeferredTextSlot);
		else if (slot.block && slot.contentIndex !== void 0) {
			slot.block.text += delta;
			stream.push({
				type: "text_delta",
				contentIndex: slot.contentIndex,
				delta
			});
		}
	};
	const terminal = createResponsesTerminalController({
		output,
		stream,
		model,
		options,
		outputs,
		toolCalls: streamingToolCalls,
		getLastTextBlock: () => lastTextBlock,
		setLastTextBlock: (block) => {
			lastTextBlock = block;
		}
	});
	const finalizeToolCall = (item, outputIndex, streamingToolCall, validated) => {
		const identity = {
			type: item.type,
			id: item.id || streamingToolCall?.itemId,
			call_id: item.call_id || streamingToolCall?.callId
		};
		const finalOutputIndex = outputIndex ?? streamingToolCall?.outputIndex;
		if (finalOutputIndex === void 0 && !identity.id && !identity.call_id) {
			if (!streamingToolCall) throw new Error("Responses stream completed tool call without an output identity");
			return;
		}
		if (streamingToolCall) {
			streamingToolCalls.forget(streamingToolCall);
			for (const slot of outputSlots.values()) if (slot.type === "toolCall" && slot.toolCall === streamingToolCall) outputSlots.forget(slot);
		}
		terminal.emitToolCallCompletion(identity, finalOutputIndex, streamingToolCall, {
			...validated,
			...options?.asyncToolExecution && isRecord(item) && item.async === true ? { async: true } : {}
		});
	};
	const prepareTerminalToolCalls = (items) => {
		const prepared = /* @__PURE__ */ new Map();
		const recovered = [];
		const callIds = /* @__PURE__ */ new Set();
		const allowUnmatchedIdentity = items.filter((item, index) => item.type === "function_call" && !outputs.get(item, index)?.completed).length === 1;
		for (const [outputIndex, item] of items.entries()) {
			const tracked = outputs.get(item, outputIndex);
			if (item.type !== "function_call") continue;
			if (item.call_id && callIds.has(item.call_id)) throw new Error("Responses stream repeated a terminal tool-call identity");
			if (item.call_id) callIds.add(item.call_id);
			if (tracked?.completed) continue;
			const state = streamingToolCalls.resolve({ output_index: outputIndex }, readResponsesToolCallItemIdentity(item), allowUnmatchedIdentity);
			if (tracked && !state) throw new Error("Responses stream completed with unresolved tool calls");
			const validated = resolveCompletedResponsesToolCall(item, { name: state?.block.name });
			if (state) recovered.push(state);
			prepared.set(outputIndex, () => finalizeToolCall(item, outputIndex, state, validated));
		}
		if (!streamingToolCalls.hasExactlyActive(recovered)) throw new Error("Responses stream completed with unresolved tool calls");
		return (outputIndex) => {
			const complete = prepared.get(outputIndex);
			if (!complete) throw new Error("Responses stream completed with unresolved tool calls");
			complete();
		};
	};
	const guardedStream = adaptResponsesStream(withFirstStreamEventTimeout(openaiStream, {
		provider: model.provider,
		api: model.api,
		model: model.id,
		timeoutMs: options?.firstEventTimeoutMs ?? 0,
		stage: "responses",
		abort: options?.abortFirstEventStream,
		onTimeout: options?.onFirstEventTimeout,
		hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
	}), options?.signal);
	try {
		for await (const event of guardedStream) {
			outputs.observeEvent(event);
			notifyLlmRequestActivity(options?.signal);
			if (event.type === "response.output_item.done" && event.item.type === "function_call" && event.item.status && event.item.status !== "completed" && !rejectedToolCall) try {
				resolveCompletedResponsesToolCall(event.item);
			} catch (error) {
				terminal.recordIncompleteToolCall(event, event.item);
				rejectedToolCall = { error };
			}
			if (rejectedToolCall && event.type !== "response.completed" && event.type !== "response.incomplete" && event.type !== "response.failed" && event.type !== "error") continue;
			if (event.type === "response.created") output.responseId = event.response.id;
			else if (event.type === "response.output_item.added") {
				materializeDeferredTextSlots();
				const item = event.item;
				compactionTracker.added(item, blocks.length);
				if (item.type !== "message") lastTextBlock = null;
				if (item.type === "reasoning" || item.type === "message") createOutputSlot(event, item);
				else if (item.type === "function_call") {
					const toolCallBlock = {
						type: "toolCall",
						id: resolveResponsesToolCallId(item),
						name: typeof item.name === "string" ? item.name.trim() : "",
						arguments: {},
						partialJson: item.arguments || ""
					};
					const contentIndex = output.content.length;
					const toolCallState = {
						block: toolCallBlock,
						contentIndex,
						argumentStreamReliable: true,
						argumentsStreamed: false,
						previewSchedule: createToolArgumentPreviewSchedule(),
						...readResponsesToolCallItemIdentity(item)
					};
					streamingToolCalls.register(event, toolCallState);
					if (readResponsesOutputIndex(event) !== void 0) outputSlots.register(event, {
						type: "toolCall",
						toolCall: toolCallState
					});
					output.content.push(toolCallBlock);
					outputs.set(item, contentIndex, readResponsesOutputIndex(event));
					stream.push({
						type: "toolcall_start",
						contentIndex,
						partial: output
					});
				}
			} else if (event.type === "response.reasoning_summary_part.added") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				slot.item.summary = slot.item.summary || [];
				slot.item.summary.push(event.part);
			} else if (event.type === "response.reasoning_summary_text.delta" || event.type === "response.reasoning_summary_part.done") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				slot.item.summary = slot.item.summary || [];
				const lastPart = slot.item.summary[slot.item.summary.length - 1];
				if (!lastPart) continue;
				const delta = event.type === "response.reasoning_summary_text.delta" ? event.delta : "\n\n";
				lastPart.text += delta;
				appendThinkingDelta(slot, delta);
			} else if (event.type === "response.reasoning_text.delta") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				appendThinkingDelta(slot, event.delta);
			} else if (event.type === "response.content_part.added") {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content = slot.item.content || [];
				if (event.part.type === "output_text" || event.part.type === "text" || event.part.type === "refusal") slot.item.content.push(event.part);
			} else if (event.type === "response.output_text.delta" || isAzureResponsesTextDeltaEvent(event) || event.type === "response.refusal.delta") {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content ||= [];
				let lastPart = slot.item.content[slot.item.content.length - 1];
				if (event.type === "response.refusal.delta") {
					if (lastPart?.type !== "refusal") {
						lastPart = {
							type: "refusal",
							refusal: ""
						};
						slot.item.content.push(lastPart);
					}
					lastPart.refusal += event.delta;
				} else {
					const azure = isAzureResponsesTextDeltaEvent(event);
					if (!isResponsesTextContentPartType(lastPart?.type) || azure && lastPart.type !== "text") {
						lastPart = azure ? {
							type: "text",
							text: ""
						} : {
							type: "output_text",
							text: "",
							annotations: []
						};
						slot.item.content.push(lastPart);
					}
					lastPart.text += event.delta;
				}
				projectTextDelta(slot, event.delta);
			} else if (event.type === "response.function_call_arguments.delta") {
				const toolCall = streamingToolCalls.resolve(event);
				if (toolCall) {
					toolCall.block.partialJson += event.delta;
					toolCall.argumentsStreamed = true;
					if (toolCall.previewSchedule(toolCall.block.partialJson.length)) toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
					stream.push({
						type: "toolcall_delta",
						contentIndex: toolCall.contentIndex,
						delta: event.delta,
						partial: output
					});
				} else if (streamingToolCalls.hasActive()) streamingToolCalls.markArgumentsUnreliable();
			} else if (event.type === "response.function_call_arguments.done") {
				const toolCall = streamingToolCalls.resolve(event);
				if (toolCall) {
					const previousPartialJson = toolCall.block.partialJson;
					const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
					if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
						toolCall.block.partialJson = doneArguments;
						toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
						toolCall.argumentStreamReliable = true;
						toolCall.argumentsStreamed = true;
					}
					if (doneArguments?.startsWith(previousPartialJson)) {
						const delta = doneArguments.slice(previousPartialJson.length);
						if (delta.length > 0) stream.push({
							type: "toolcall_delta",
							contentIndex: toolCall.contentIndex,
							delta,
							partial: output
						});
					}
				} else if (streamingToolCalls.hasActive()) streamingToolCalls.markArgumentsUnreliable();
			} else if (event.type === "response.output_item.done") {
				const item = event.item;
				if (item.type !== "message") lastTextBlock = null;
				const existingOutputSlot = outputSlots.resolveOutputItem(event, item);
				materializeDeferredTextSlots(existingOutputSlot);
				const outputSlot = existingOutputSlot ?? createOutputSlot(event, item);
				compactionTracker.completed(item, blocks.length);
				if (item.type === "reasoning" && outputSlot?.type === "thinking") {
					const summaryText = item.summary?.map((s) => s.text).join("\n\n") || "";
					const contentText = item.content?.map((c) => c.text).join("\n\n") || "";
					outputSlot.block.thinking = summaryText || contentText || outputSlot.block.thinking;
					outputSlot.block.thinkingSignature = JSON.stringify(item);
					outputs.set(item, outputSlot.contentIndex, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
					if (item.encrypted_content && options?.reasoningReplayMetadata) outputSlot.block[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY] = options.reasoningReplayMetadata;
					stream.push({
						type: "thinking_end",
						contentIndex: outputSlot.contentIndex,
						content: outputSlot.block.thinking,
						partial: output
					});
					outputSlots.forget(outputSlot);
				} else if (item.type === "message" && outputSlot?.type === "text" && (outputSlot.block || outputSlot.pendingText !== null)) {
					const streamedText = outputSlot.pendingText ?? outputSlot.block?.text ?? "";
					const finalText = item.content == null ? streamedText : item.content.map((c) => c.type === "output_text" || c.type === "text" ? c.text : c.refusal).join("");
					const phase = item.phase ?? void 0;
					const collapse = outputSlot.pendingText !== null ? resolveResponsesMessageSnapshotCollapse({
						prior: outputSlot.collapseCandidate && {
							text: outputSlot.collapseCandidate.block.text,
							phase: outputSlot.collapseCandidate.phase
						},
						nextText: finalText,
						nextPhase: phase
					}) : { kind: "keep" };
					outputSlot.pendingText = null;
					if (collapse.kind === "extend" && outputSlot.collapseCandidate) {
						outputSlot.collapseCandidate.block.text = collapse.text;
						outputSlot.collapseCandidate.block.textSignature = encodeTextSignatureV1(item.id, phase);
						stream.push({
							type: "text_end",
							contentIndex: outputSlot.collapseCandidate.index,
							content: collapse.text,
							partial: output
						});
						lastTextBlock = outputSlot.collapseCandidate;
						outputs.set(item, outputSlot.collapseCandidate.index, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
					} else {
						if (!outputSlot.block) {
							outputSlot.block = {
								type: "text",
								text: "",
								...phase ? { textSignature: encodeTextSignatureV1(item.id, phase) } : {}
							};
							blocks.push(outputSlot.block);
							outputSlot.contentIndex = blocks.length - 1;
							stream.push({
								type: "text_start",
								contentIndex: outputSlot.contentIndex,
								partial: output
							});
						}
						outputSlot.block.text = finalText;
						outputSlot.block.textSignature = encodeTextSignatureV1(item.id, phase);
						const contentIndex = outputSlot.contentIndex;
						if (contentIndex === void 0) throw new Error("Responses stream finalized text without a content index");
						lastTextBlock = {
							block: outputSlot.block,
							index: contentIndex,
							phase
						};
						outputs.set(item, contentIndex, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
						stream.push({
							type: "text_end",
							contentIndex,
							content: outputSlot.block.text,
							partial: output
						});
					}
					outputSlots.forget(outputSlot);
				} else if (item.type === "function_call") {
					if (outputs.get(item, readResponsesOutputIndex(event))?.completed) continue;
					const streamingToolCall = streamingToolCalls.resolve(event, readResponsesToolCallItemIdentity(item));
					if (!streamingToolCall && streamingToolCalls.hasActive()) continue;
					const completedArguments = typeof item.arguments === "string" ? item.arguments : void 0;
					if (streamingToolCall && !streamingToolCall.argumentStreamReliable && !completedArguments) continue;
					const streamedArguments = streamingToolCall?.block.partialJson || "";
					const parsedStreamedArguments = streamingToolCall?.argumentStreamReliable && streamingToolCall?.argumentsStreamed && streamedArguments.length > 0 && completedArguments !== void 0 && streamedArguments !== completedArguments ? parseJsonObjectPreservingUnsafeIntegers(streamedArguments) : null;
					let validated;
					try {
						validated = resolveCompletedResponsesToolCall(item, {
							name: streamingToolCall?.block.name,
							arguments: parsedStreamedArguments ?? (completedArguments || streamedArguments)
						});
					} catch (error) {
						rejectedToolCall = { error };
						continue;
					}
					finalizeToolCall(item, readResponsesOutputIndex(event), streamingToolCall, validated);
				}
			} else if (event.type === "response.completed" || event.type === "response.incomplete") {
				terminal.finalizeResponse(event.response, event.type, Boolean(rejectedToolCall));
				if (rejectedToolCall) throw output.errorMessage ? new Error(output.errorMessage) : rejectedToolCall.error;
				if (event.type === "response.completed" || output.stopReason === "length") {
					const items = event.response.output ?? [];
					const completeToolCall = event.type === "response.completed" ? prepareTerminalToolCalls(items) : void 0;
					terminal.recoverTerminalOutput(items, completeToolCall);
				}
				terminalResponse = event.type === "response.completed" ? event.response : null;
				if (output.stopReason === "stop" && output.content.some((block) => block.type === "toolCall")) output.stopReason = "toolUse";
				break;
			} else if (event.type === "error") {
				const details = isRecord(event) && isRecord(event.error) ? event.error : event;
				const message = readStringValue(details.message);
				const code = normalizeStringifiedOptionalString(details.code);
				throw Object.assign(new Error(message ? code ? `Error Code ${code}: ${message}` : message : "Unknown error"), {
					code: details.code,
					error: details
				});
			} else if (event.type === "response.failed") {
				const failure = normalizeResponsesFailedEvent(isRecord(event) ? event : {}, model);
				terminal.finalizeFailedResponse(event.response, failure.responseId);
				throw new ResponsesStreamFailure(failure, event.response);
			}
		}
		if (options?.signal?.aborted) throw transportAbortError(options.signal);
		if (rejectedToolCall) throw rejectedToolCall.error;
		if (streamingToolCalls.hasActive()) throw new Error("Responses stream ended with unresolved tool calls");
		if (terminalResponse === void 0) throw new Error("OpenAI Responses stream ended before a terminal response event");
		return terminalResponse ?? void 0;
	} finally {
		for (const block of output.content) delete block.partialJson;
	}
}
//#endregion
//#region packages/ai/src/providers/openai-provider-refusal.ts
/** Responses uses snake_case; the ChatGPT app-server error envelope uses camelCase. */
function readOpenAIMisalignmentReview(value, continuationSupported) {
	if (!isRecord(value)) return;
	return readProviderRefusalReview({
		explanation: value.detailed_explanation ?? value.detailedExplanation,
		errorType: value.error_type ?? value.errorType,
		...continuationSupported ? { continuation: value.steer } : {}
	});
}
//#endregion
//#region packages/ai/src/providers/openai-responses-tools.ts
/** Projects direct provider descriptors before resolving their strict policy. */
function convertResponsesToolPayload(tools, options) {
	return convertPreparedResponsesTools(prepareOpenAITools(tools), resolveResponsesStrictToolSetting(options), options?.model);
}
/** The transport has already resolved policy before descriptor projection. */
function prepareResponsesTools(tools, strictSetting, model) {
	const prepared = prepareOpenAITools(tools);
	return {
		projection: prepared.projection,
		tools: convertPreparedResponsesTools(prepared, strictSetting, model)
	};
}
function convertPreparedResponsesTools(prepared, strictSetting, model) {
	const { projection, schemas } = prepared;
	return withPreparedToolSchemaNormalization(schemas, () => {
		const strict = model ? resolveOpenAIStrictToolFlagWithDiagnostics(projection, strictSetting, {
			transport: "responses",
			model
		}) : resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
		return sortPromptCacheToolsByName(projection.tools).map((tool) => {
			const result = {
				type: "function",
				name: tool.name,
				description: tool.description,
				parameters: normalizeOpenAIStrictToolParameters(tool.parameters, strict === true, model?.compat)
			};
			if (strict !== void 0) result.strict = strict;
			return result;
		});
	});
}
function resolveResponsesStrictToolSetting(options) {
	if (options?.strict !== void 0) return options.strict;
	if (options?.model) return getAiTransportHost().resolveOpenAIStrictToolSetting(options.model, {
		transport: "stream",
		supportsStrictMode: options.supportsStrictMode ?? resolveOpenAICompletionsCompat(options.model).supportsStrictMode
	});
	return false;
}
//#endregion
//#region packages/ai/src/providers/openai-responses-shared.ts
function applyResponsesServiceTierPricing(usage, serviceTier, model) {
	let multiplier = 1;
	if (serviceTier === "flex") multiplier = .5;
	else if (serviceTier === "priority") multiplier = model.id === "gpt-5.5" ? 2.5 : 2;
	if (multiplier === 1) return;
	usage.cost.input *= multiplier;
	usage.cost.output *= multiplier;
	usage.cost.cacheRead *= multiplier;
	usage.cost.cacheWrite *= multiplier;
	usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
function applyCommonResponsesParams(params, model, context, options, config) {
	if (options?.maxTokens) params.max_output_tokens = Math.max(options.maxTokens, 16);
	if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) params.temperature = options.temperature;
	if (options?.responseFormat !== void 0) params.text = {
		...params.text,
		format: resolveOpenAIResponsesTextFormat(options.responseFormat)
	};
	if (context.tools) {
		const tools = convertResponsesToolPayload(context.tools, { model });
		if (tools.length > 0) params.tools = tools;
	}
	if (!model.reasoning) return;
	const requestedEffort = options?.reasoningEffort ?? (options?.reasoningSummary ? "medium" : config?.setDefaultReasoningOff ?? true ? "off" : void 0);
	const effort = requestedEffort === void 0 ? void 0 : resolveOpenAIRequestReasoning(model, requestedEffort).effort;
	if (effort === void 0) return;
	params.reasoning = { effort };
	if (effort !== "none" && (options?.reasoningEffort || options?.reasoningSummary)) {
		params.reasoning.summary = options?.reasoningSummary || "auto";
		params.include = ["reasoning.encrypted_content"];
	}
}
function cleanStreamingScratchBuffers(output) {
	for (const block of output.content) {
		delete block.index;
		delete block.partialJson;
	}
}
async function runResponsesStreamLifecycle(params) {
	const { stream, output, options } = params;
	let firstEventAbort;
	try {
		const model = params.resolveRequestModel?.(params.model) ?? params.model;
		const client = params.createClient(model);
		const encodeBody = prepareModelRequestBody(options);
		const buildRequest = async (replayMode) => {
			let request = params.buildParams(model, replayMode);
			const nextRequest = await options?.onPayload?.(request, model);
			if (nextRequest !== void 0) request = nextRequest;
			return request;
		};
		const requestParams = await buildRequest("checkpoint");
		const firstEvent = createFirstStreamEventAbortController(options?.signal);
		firstEventAbort = firstEvent;
		let started = false;
		let admittedRequest;
		let requestedTier;
		const { stream: hookedOpenAIStream } = await createResponsesStreamWithEncryptedContentRetry({
			client,
			request: requestParams,
			requestOptions: {
				signal: firstEvent.signal,
				...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
				maxRetries: 0
			},
			model,
			encodeBody,
			buildFullHistoryRequest: () => buildRequest("full-history"),
			onCompactionRejected: (checkpoint) => suppressOpenAIResponsesCompaction(output, model, options, checkpoint),
			canRetryStream: () => output.content.length === 0,
			wrapStream: ({ stream: openaiStream, response, attempt }) => {
				requestedTier = attempt.request.service_tier;
				admittedRequest = attempt.kind === "initial" ? attempt.request : void 0;
				return withProviderResponseHook({
					stream: openaiStream,
					signal: firstEvent.signal,
					abort: firstEvent.abort,
					hook: createOpenAIProviderAcceptanceHook(options, response, model),
					onReady: () => {
						if (!started) {
							started = true;
							stream.push({
								type: "start",
								partial: output
							});
						}
					}
				});
			}
		});
		const firstEventTimeoutMs = getFirstStreamEventTimeoutMs(options);
		const onFirstEventTimeout = getFirstStreamEventTimeoutHandler(options);
		const terminal = await processResponsesStream(hookedOpenAIStream, output, stream, model, {
			...params.processStreamOptions || firstEventTimeoutMs !== void 0 || onFirstEventTimeout !== void 0 ? {
				...params.processStreamOptions,
				firstEventTimeoutMs: params.processStreamOptions?.firstEventTimeoutMs ?? firstEventTimeoutMs,
				abortFirstEventStream: params.processStreamOptions?.abortFirstEventStream ?? firstEventAbort.abort,
				onFirstEventTimeout: params.processStreamOptions?.onFirstEventTimeout ?? onFirstEventTimeout,
				signal: params.processStreamOptions?.signal ?? options?.signal
			} : void 0,
			onServiceTier: (responseTier) => responsesServiceTierObserver.observe(options, requestedTier, responseTier),
			canRetryIdentityConflict: () => hasOnlyResponsesFunctionTools(admittedRequest),
			reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, {
				sessionId: options?.sessionId,
				authProfileId: options?.authProfileId
			})
		});
		if (terminal && admittedRequest && !options?.signal?.aborted) recordResponsesContextUsage(output, model, options, admittedRequest, terminal.output, "provider");
		finalizeTransportStream({
			stream,
			output,
			signal: options?.signal
		});
	} catch (error) {
		const response = error instanceof ResponsesStreamFailure ? error.response : error;
		const rawError = isRecord(response) && isRecord(response.error) ? response.error : response;
		if (params.model.provider === "openai" && params.model.api === "openai-responses" && isRecord(rawError) && rawError.code === "misalignment_policy_violation") {
			const review = readOpenAIMisalignmentReview(rawError.misalignment, false);
			appendAssistantMessageDiagnostic(output, {
				type: "provider_refusal",
				timestamp: Date.now(),
				details: {
					provider: "openai",
					category: "misalignment",
					...review ? { review } : {}
				}
			});
		}
		failTransportStream({
			stream,
			output,
			signal: options?.signal,
			error,
			cleanup: () => cleanStreamingScratchBuffers(output)
		});
	} finally {
		firstEventAbort?.dispose();
	}
}
//#endregion
export { supportsResponsesReasoningUpdate as $, recordResponsesContextUsage as A, parseOpenAICompletionsUsage as At, claimOpenAIResponsesHttpContinuation as B, resolveAzureOpenAIApiVersion as C, GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP as Ct, safeDebugValue as D, isOpenAICompletionsThinkingEnabled as Dt, logResponsesFailedNoDetails as E, createResponseModelTracker as Et, convertResponsesMessages as F, redactIdentifier as Ft, OPENAI_RESPONSES_CALL_ID_RE as G, resolveResponsesContinuationRequest as H, resolveReplayableResponsesMessageId as I, sha256Hex as It, normalizeOpenAIResponsesFunctionCallId as J, OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE as K, readResponsesInputReplayState as L, bindResponsesInputMessage as M, readOpenAICompletionsReasoningBatch as Mt, buildResponsesInputMessage as N, resolveOpenAIClientBaseUrl as Nt, summarizeOpenAITransportError as O, log as Ot, convertProviderResponsesMessages as P, resolvePromptCacheKey as Pt, replayResponsesReasoningUpdates as Q, recordResponsesInputReplay as R, isInvalidEncryptedContentError as S, toOpenAIResponsesToolChoice as St, ResponsesStreamFailure as T, createOpenAIResponseHook as Tt, responsesContinuationPrefixFingerprint as U, recordResponsesContinuationState as V, responsesContinuationRequestFingerprint as W, splitOpenAIFunctionCallPairing as X, shouldNormalizeOpenAIResponsesToolCallId as Y, isConfigurationUpdate as Z, isResponsesTextContentPartType as _, resolveOpenAIReasoningEffortMap as _t, prepareResponsesTools as a, assertCodeModeResponsesToolSurface as at, commitResponsesEncryptedContentAttempt as b, reconcileOpenAICompletionsToolChoice as bt, observeResponsesStream as c, buildOpenAISdkRequestOptions as ct, AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE as d, getCompat as dt, CompactionReplayRefreshRequiredError as et, AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE as f, readCodeModePayloadToolName as ft, isAzureResponsesTextDeltaEventType as g, resolveOpenAISimpleReasoningEffort as gt, isAzureResponsesTextDeltaEvent as h, resolveOpenAIRequestReasoning as ht, convertResponsesToolPayload as i, suppressOpenAIResponsesCompaction as it, resolveResponsesContextUsageBoundary as j, readOpenAICompletionsContentDeltas as jt, summarizeResponsesPayload as k, measureUtf8AppendBytes as kt, createResponsesToolCallTracker as l, enforceCodeModeResponsesToolSurface as lt, OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE as m, resolveOpenAIStrictToolFlagWithDiagnostics as mt, applyResponsesServiceTierPricing as n, captureOpenAIResponsesCompaction as nt, readOpenAIMisalignmentReview as o, buildOpenAIClientHeaders as ot, OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE as p, resolveCodeModeResponsesVisibleToolNames as pt, OPENAI_RESPONSES_ID_MAX_LENGTH as q, runResponsesStreamLifecycle as r, resolveNewestOpenAIResponsesCompactionReplay as rt, processResponsesStream as s, buildOpenAISdkClientOptions as st, applyCommonResponsesParams as t, buildOpenAIResponsesReasoningReplayMetadata as tt, readResponsesToolCallItemIdentity as u, filterCodeModePayloadTools as ut, isResponsesTextDeltaEventType as v, prepareOpenAITools as vt, resolveNextResponsesEncryptedContentAttempt as w, createOpenAIProviderAcceptanceHook as wt, createResponsesStreamWithEncryptedContentRetry as x, reconcileOpenAIResponsesToolChoice as xt, resolveResponsesMessageSnapshotCollapse as y, projectOpenAITools as yt, responsesInputFingerprint as z };
