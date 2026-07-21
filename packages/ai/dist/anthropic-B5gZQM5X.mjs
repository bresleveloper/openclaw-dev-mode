import { n as getEnvApiKey, r as __exportAll } from "./env-api-keys-CtMlqaQ4.mjs";
import { c as resolveClaudeNativeThinkingLevelMap, d as supportsClaudeNativeMaxEffort, f as supportsClaudeNativeXhighEffort, l as resolveClaudeSonnet5ModelIdentity, u as supportsClaudeAdaptiveThinking } from "./src-CZ503MYJ.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.mjs";
import { n as getAiTransportHost, r as resolveAiTransportHeaderSentinels } from "./host-4t713IeR.mjs";
import { n as calculateCost, r as clampThinkingLevel } from "./model-utils-DgmOla96.mjs";
import { r as createDeferredEventBuffer, t as notifyLlmRequestActivity } from "./llm-request-activity-CehVkZP-.mjs";
import { t as headersToRecord } from "./headers-B_e4-1J0.mjs";
import { n as parseStreamingJson, t as parseJsonWithRepair } from "./json-parse-DzNSIQBq.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-DT5o51ur.mjs";
import { a as adjustMaxTokensForThinking, b as stripSystemPromptCacheBoundary, c as isRecord, d as prepareClaudeSonnet5RequestContext, f as requiresClaudeAdaptiveThinking, h as usesClaudeStreamingRefusalContract, i as extractToolResultText, l as applyClaudeRequestContract, m as usesClaudeFable5MessagesContract, n as describeToolResultMediaPlaceholder, o as buildBaseOptions, r as extractToolResultBlockText, t as transformMessages, y as splitSystemPromptCacheBoundary } from "./transform-messages-BhGF_fF4.mjs";
import { t as projectRuntimeToolInputSchema } from "./tool-schema-json-projection-BXtBc_mD.mjs";
import { a as resolveCacheRetention, i as resolveCloudflareBaseUrl, n as hasCopilotVisionInput, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-BsH5cqGj.mjs";
import Anthropic from "@anthropic-ai/sdk";
//#region packages/ai/src/providers/anthropic-auth-headers.ts
function usesFoundryBearerAuth(model) {
	return model.provider === "microsoft-foundry" && (model.authHeader === true || hasBearerAuthorizationHeader(model.headers));
}
function hasBearerAuthorizationHeader(headers) {
	if (!headers) return false;
	return Object.entries(headers).some(([key, value]) => key.toLowerCase() === "authorization" && /^bearer\s+\S+/i.test(value.trim()));
}
function omitFoundryBearerCredentialHeaders(headers) {
	if (!headers) return;
	const next = {};
	for (const [key, value] of Object.entries(headers)) {
		const lower = key.toLowerCase();
		if (lower === "authorization" || lower === "x-api-key" || lower === "api-key") continue;
		next[key] = value;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
//#endregion
//#region packages/ai/src/providers/anthropic-refusal.ts
function readNullableString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function readAnthropicRefusalDetails(value) {
	if (!value || typeof value !== "object") return {
		category: null,
		explanation: null
	};
	const details = value;
	return {
		category: readNullableString(details.category),
		explanation: readNullableString(details.explanation)
	};
}
function formatAnthropicRefusalMessage(details) {
	return `Anthropic refusal${details.category ? ` (category: ${details.category})` : ""}${details.explanation ? `: ${details.explanation}` : "."}`;
}
function applyAnthropicRefusal(output, stopDetails, provider) {
	const details = readAnthropicRefusalDetails(stopDetails);
	output.stopReason = "error";
	output.errorMessage = formatAnthropicRefusalMessage(details);
	output.diagnostics = [...output.diagnostics ?? [], {
		type: "provider_refusal",
		timestamp: Date.now(),
		details: {
			provider,
			category: details.category,
			explanation: details.explanation
		}
	}];
}
//#endregion
//#region packages/ai/src/providers/anthropic-server-fallback.ts
/** Anthropic beta that re-serves safety refusals on an allowed fallback model. */
const ANTHROPIC_SERVER_SIDE_FALLBACK_BETA = "server-side-fallback-2026-06-01";
const CLAUDE_FABLE_5_FALLBACK_MODEL = "claude-opus-4-8";
const CLAUDE_FABLE_5_FALLBACK_MODEL_COST = {
	input: 5,
	output: 25,
	cacheRead: .5,
	cacheWrite: 6.25
};
function buildAnthropicServerSideFallbacks() {
	return [{ model: CLAUDE_FABLE_5_FALLBACK_MODEL }];
}
function readBoundaryModel(value) {
	if (!value || typeof value !== "object") return null;
	const model = value.model;
	return typeof model === "string" && model.trim() ? model : null;
}
/** Reads a `fallback` content block marking where one model's output gives way to the next. */
function readAnthropicFallbackBoundary(block) {
	if (!block || typeof block !== "object") return null;
	const record = block;
	if (record.type !== "fallback") return null;
	return {
		fromModel: readBoundaryModel(record.from),
		toModel: readBoundaryModel(record.to)
	};
}
/**
* Drops pre-fallback thinking/tool calls while preserving the text prefix that
* the serving model continued. Dropped tool calls must never execute or replay.
*/
function applyAnthropicFallbackBoundary(params) {
	const { output, boundary } = params;
	const survivors = output.content.filter((block) => block.type === "text");
	for (const survivor of survivors) delete survivor.textSignature;
	output.content.splice(0, output.content.length, ...survivors);
	if (boundary.toModel) output.responseModel = boundary.toModel;
	output.diagnostics = [...output.diagnostics ?? [], {
		type: "provider_fallback",
		timestamp: Date.now(),
		details: {
			provider: params.provider,
			fromModel: boundary.fromModel,
			toModel: boundary.toModel
		}
	}];
}
//#endregion
//#region packages/ai/src/providers/anthropic-thinking-replay.ts
const ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
function asReplayMessage(value) {
	return value && typeof value === "object" ? value : void 0;
}
/**
* Anthropic tool results continue the preceding assistant turn. Preserve that
* turn's signed thinking even when the next request disables new thinking.
*/
function findActiveAnthropicToolTurnAssistantIndex(messages) {
	const toolResultIds = /* @__PURE__ */ new Set();
	let index = messages.length - 1;
	while (index >= 0) {
		const message = asReplayMessage(messages[index]);
		if (message?.role !== "toolResult") break;
		if (typeof message.toolCallId === "string") toolResultIds.add(message.toolCallId);
		index -= 1;
	}
	if (toolResultIds.size === 0) return -1;
	const assistant = asReplayMessage(messages[index]);
	if (assistant?.role !== "assistant" || !Array.isArray(assistant.content)) return -1;
	const toolCallIds = /* @__PURE__ */ new Set();
	for (const block of assistant.content) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if ((record.type === "toolCall" || record.type === "tool_use" || record.type === "function_call") && typeof record.id === "string") toolCallIds.add(record.id);
	}
	return [...toolResultIds].every((toolCallId) => toolCallIds.has(toolCallId)) ? index : -1;
}
//#endregion
//#region packages/ai/src/providers/anthropic-tool-projection.ts
function isProviderSupportedViolation(violation) {
	return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
const schemaValueKeywords = /* @__PURE__ */ new Set([
	"additionalProperties",
	"contains",
	"contentSchema",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
const schemaArrayKeywords = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
]);
const schemaMapKeywords = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependencies",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
function normalizeAnthropicJsonSchema(schema) {
	if (!isRecord(schema)) return schema;
	let changed = false;
	const normalized = { ...schema };
	for (const [key, value] of Object.entries(schema)) {
		if (schemaValueKeywords.has(key) && !Array.isArray(value)) {
			const next = normalizeAnthropicJsonSchema(value);
			normalized[key] = next;
			changed ||= next !== value;
			continue;
		}
		if (schemaArrayKeywords.has(key) && Array.isArray(value)) {
			const next = value.map(normalizeAnthropicJsonSchema);
			normalized[key] = next;
			changed ||= next.some((entry, index) => entry !== value[index]);
			continue;
		}
		if (schemaMapKeywords.has(key) && isRecord(value)) {
			const next = Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, normalizeAnthropicJsonSchema(entryValue)]));
			normalized[key] = next;
			changed ||= Object.entries(value).some(([entryKey, entryValue]) => next[entryKey] !== entryValue);
		}
	}
	if (Array.isArray(schema.items)) {
		normalized.prefixItems = schema.items.map(normalizeAnthropicJsonSchema);
		const additionalItems = schema.additionalItems;
		if (typeof additionalItems === "boolean" || isRecord(additionalItems)) normalized.items = normalizeAnthropicJsonSchema(additionalItems);
		else delete normalized.items;
		delete normalized.additionalItems;
		changed = true;
	}
	return changed ? normalized : schema;
}
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
function projectAnthropicTools(tools, toWireName) {
	const projectedTools = [];
	const unavailableOriginalNames = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		let projectedTool;
		let originalName;
		try {
			const name = tool.name;
			originalName = name;
			if (!name) continue;
			const schemaProjection = projectRuntimeToolInputSchema(tool.parameters, `${name}.parameters`);
			if (!isRecord(schemaProjection.schema) || schemaProjection.violations.some((violation) => !isProviderSupportedViolation(violation))) {
				unavailableOriginalNames.add(name);
				continue;
			}
			const anthropicSchema = normalizeAnthropicJsonSchema(schemaProjection.schema);
			if (!isRecord(anthropicSchema)) {
				unavailableOriginalNames.add(name);
				continue;
			}
			const properties = anthropicSchema.properties;
			const required = anthropicSchema.required;
			if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && (!Array.isArray(required) || required.some((entry) => typeof entry !== "string"))) {
				unavailableOriginalNames.add(name);
				continue;
			}
			let description;
			try {
				description = typeof tool.description === "string" ? tool.description : void 0;
			} catch {}
			projectedTool = {
				originalName: name,
				wireName: toWireName(name),
				...description ? { description } : {},
				inputSchema: {
					type: "object",
					properties: properties ?? {},
					required: required ?? []
				}
			};
		} catch {
			if (originalName) unavailableOriginalNames.add(originalName);
			continue;
		}
		const conflictingTool = projectedTools.find((entry) => entry.wireName === projectedTool.wireName);
		if (conflictingTool && conflictingTool.originalName !== projectedTool.originalName) throw new Error(`Anthropic tool names "${conflictingTool.originalName}" and "${projectedTool.originalName}" both map to "${projectedTool.wireName}"`);
		projectedTools.push(projectedTool);
	}
	return {
		inputToolCount: tools.length,
		unavailableOriginalNames,
		tools: projectedTools
	};
}
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
function reconcileAnthropicToolChoice(choice, projection) {
	if (projection.inputToolCount === 0) return choice;
	if (choice.type === "tool") {
		const requestedName = choice.name;
		const originalMatch = projection.tools.find((tool) => tool.originalName === requestedName);
		if (originalMatch) return {
			...choice,
			name: originalMatch.wireName
		};
		if (projection.unavailableOriginalNames.has(requestedName)) throw new Error(`Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`);
		const matchedTool = projection.tools.find((tool) => tool.wireName === requestedName);
		if (!matchedTool) throw new Error(`Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`);
		return {
			...choice,
			name: matchedTool.wireName
		};
	}
	if (projection.tools.length === 0) {
		if (choice.type === "auto") return;
		if (choice.type === "any") throw new Error("Anthropic tool_choice requires a tool, but no tools survived schema conversion");
	}
	return choice;
}
/** Maps Claude Code wire names without trusting every direct/custom descriptor. */
function resolveOriginalAnthropicToolName(name, projection) {
	return projection?.tools.find((tool) => tool.wireName === name)?.originalName ?? name;
}
//#endregion
//#region packages/ai/src/providers/anthropic-usage.ts
function readAnthropicUsageTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function readAnthropicPromptUsageSnapshot(usage) {
	const input = readAnthropicUsageTokenCount(usage.input_tokens);
	const cacheRead = usage.cache_read_input_tokens == null ? 0 : readAnthropicUsageTokenCount(usage.cache_read_input_tokens);
	const cacheWrite = usage.cache_creation_input_tokens == null ? 0 : readAnthropicUsageTokenCount(usage.cache_creation_input_tokens);
	if (input === void 0 || cacheRead === void 0 || cacheWrite === void 0) return;
	return {
		input,
		cacheRead,
		cacheWrite
	};
}
function readLastAnthropicIterationUsage(usage) {
	if (usage.iterations == null) return { state: "absent" };
	if (!Array.isArray(usage.iterations) || usage.iterations.length === 0) return { state: "invalid" };
	const iteration = usage.iterations.at(-1);
	if (!iteration || typeof iteration !== "object" || Array.isArray(iteration)) return { state: "invalid" };
	const record = iteration;
	const input = readAnthropicUsageTokenCount(record.input_tokens);
	const cacheRead = readAnthropicUsageTokenCount(record.cache_read_input_tokens);
	const cacheWrite = readAnthropicUsageTokenCount(record.cache_creation_input_tokens);
	const outputTokens = readAnthropicUsageTokenCount(record.output_tokens);
	if (input === void 0 || cacheRead === void 0 || cacheWrite === void 0 || outputTokens === void 0) return { state: "invalid" };
	const contextPromptTokens = input + cacheRead + cacheWrite;
	return {
		state: "valid",
		usage: {
			contextPromptTokens,
			totalTokens: contextPromptTokens + outputTokens
		}
	};
}
//#endregion
//#region packages/ai/src/providers/anthropic.ts
var anthropic_exports = /* @__PURE__ */ __exportAll({
	streamAnthropic: () => streamAnthropic,
	streamSimpleAnthropic: () => streamSimpleAnthropic
});
const ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
const EMPTY_ERROR_TOOL_RESULT_TEXT = "[tool error with no output]";
function getCacheControl(model, cacheRetention) {
	const retention = resolveCacheRetention(cacheRetention);
	if (retention === "none") return { retention };
	const ttl = retention === "long" && getAnthropicCompat(model).supportsLongCacheRetention ? "1h" : void 0;
	return {
		retention,
		cacheControl: {
			type: "ephemeral",
			...ttl && { ttl }
		}
	};
}
const claudeCodeVersion = "2.1.75";
const claudeCodeBillingSystemBlock = `x-anthropic-billing-header: cc_version=${claudeCodeVersion}; cc_entrypoint=sdk-cli;`;
const ccToolLookup = new Map([
	"Read",
	"Write",
	"Edit",
	"Bash",
	"Grep",
	"Glob",
	"AskUserQuestion",
	"EnterPlanMode",
	"ExitPlanMode",
	"KillShell",
	"NotebookEdit",
	"Skill",
	"Task",
	"TaskOutput",
	"TodoWrite",
	"WebFetch",
	"WebSearch"
].map((t) => [t.toLowerCase(), t]));
const toClaudeCodeName = (name) => ccToolLookup.get(name.toLowerCase()) ?? name;
/**
* Convert content blocks to Anthropic API format
*/
function convertContentBlocks(content, isError) {
	const text = extractToolResultText(content);
	const mediaPlaceholder = describeToolResultMediaPlaceholder(content);
	if (!(Array.isArray(content) && content.some((item) => item && typeof item === "object" && item.type === "image"))) {
		const sanitized = sanitizeSurrogates(text);
		return sanitized.trim().length > 0 ? sanitized : mediaPlaceholder ?? (isError ? EMPTY_ERROR_TOOL_RESULT_TEXT : "");
	}
	const blocks = [];
	let hasTextBlock = false;
	for (const block of Array.isArray(content) ? content : []) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		const blockText = extractToolResultBlockText(block);
		if (blockText) {
			blocks.push({
				type: "text",
				text: sanitizeSurrogates(blockText)
			});
			hasTextBlock = true;
		}
		if (record.type !== "image") continue;
		blocks.push({
			type: "image",
			source: {
				type: "base64",
				media_type: typeof record.mimeType === "string" ? record.mimeType : "image/jpeg",
				data: typeof record.data === "string" ? record.data : ""
			}
		});
	}
	if (!hasTextBlock) blocks.unshift({
		type: "text",
		text: mediaPlaceholder ?? "(see attached image)"
	});
	return blocks;
}
const FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
const INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14";
const ANTHROPIC_MIN_THINKING_BUDGET_TOKENS = 1024;
function getAnthropicCompat(model) {
	const isFireworks = model.provider === "fireworks";
	const isCloudflareAiGatewayAnthropic = model.provider === "cloudflare-ai-gateway" && model.baseUrl.includes("anthropic");
	return {
		supportsEagerToolInputStreaming: model.compat?.supportsEagerToolInputStreaming ?? !isFireworks,
		supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? !isFireworks,
		sendSessionAffinityHeaders: model.compat?.sendSessionAffinityHeaders ?? (isFireworks || isCloudflareAiGatewayAnthropic),
		supportsCacheControlOnTools: model.compat?.supportsCacheControlOnTools ?? !isFireworks
	};
}
function mergeHeaders(...headerSources) {
	const merged = {};
	for (const headers of headerSources) if (headers) Object.assign(merged, headers);
	return merged;
}
const ANTHROPIC_MESSAGE_EVENTS = /* @__PURE__ */ new Set([
	"message_start",
	"message_delta",
	"message_stop",
	"content_block_start",
	"content_block_delta",
	"content_block_stop"
]);
function flushSseEvent(state) {
	if (!state.event && state.data.length === 0) return null;
	const event = {
		event: state.event,
		data: state.data.join("\n"),
		raw: [...state.raw]
	};
	state.event = null;
	state.data = [];
	state.raw = [];
	return event;
}
function decodeSseLine(line, state) {
	if (line === "") return flushSseEvent(state);
	state.raw.push(line);
	if (line.startsWith(":")) return null;
	const delimiterIndex = line.indexOf(":");
	const fieldName = delimiterIndex === -1 ? line : line.slice(0, delimiterIndex);
	let value = delimiterIndex === -1 ? "" : line.slice(delimiterIndex + 1);
	if (value.startsWith(" ")) value = value.slice(1);
	if (fieldName === "event") state.event = value;
	else if (fieldName === "data") state.data.push(value);
	return null;
}
function nextLineBreakIndex(text) {
	const carriageReturnIndex = text.indexOf("\r");
	const newlineIndex = text.indexOf("\n");
	if (carriageReturnIndex === -1) return newlineIndex;
	if (newlineIndex === -1) return carriageReturnIndex;
	return Math.min(carriageReturnIndex, newlineIndex);
}
function consumeLine(text) {
	const lineBreakIndex = nextLineBreakIndex(text);
	if (lineBreakIndex === -1) return null;
	let nextIndex = lineBreakIndex + 1;
	if (text[lineBreakIndex] === "\r" && text[nextIndex] === "\n") nextIndex += 1;
	return {
		line: text.slice(0, lineBreakIndex),
		rest: text.slice(nextIndex)
	};
}
async function* iterateSseMessages(body, signal) {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	const state = {
		event: null,
		data: [],
		raw: []
	};
	let buffer = "";
	try {
		while (true) {
			if (signal?.aborted) throw new Error("Request was aborted");
			const { value, done } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			let consumed = consumeLine(buffer);
			while (consumed) {
				buffer = consumed.rest;
				const event = decodeSseLine(consumed.line, state);
				if (event) yield event;
				consumed = consumeLine(buffer);
			}
		}
		buffer += decoder.decode();
		let consumed = consumeLine(buffer);
		while (consumed) {
			buffer = consumed.rest;
			const event = decodeSseLine(consumed.line, state);
			if (event) yield event;
			consumed = consumeLine(buffer);
		}
		if (buffer.length > 0) {
			const event = decodeSseLine(buffer, state);
			if (event) yield event;
		}
		const trailingEvent = flushSseEvent(state);
		if (trailingEvent) yield trailingEvent;
	} finally {
		reader.releaseLock();
	}
}
async function* iterateAnthropicEvents(response, signal, requireMessageStop = false) {
	if (!response.body) throw new Error("Attempted to iterate over an Anthropic response with no body");
	let sawMessageStart = false;
	let sawMessageEnd = false;
	for await (const sse of iterateSseMessages(response.body, signal)) {
		if (sse.event === "error") throw new Error(sse.data);
		if (!ANTHROPIC_MESSAGE_EVENTS.has(sse.event ?? "")) continue;
		try {
			const event = parseJsonWithRepair(sse.data);
			if (event.type === "message_start") sawMessageStart = true;
			else if (event.type === "message_stop") sawMessageEnd = true;
			yield event;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`Could not parse Anthropic SSE event ${sse.event}: ${message}; data=${sse.data}; raw=${sse.raw.join("\\n")}`, { cause: error });
		}
	}
	if ((sawMessageStart || requireMessageStop) && !sawMessageEnd) throw new Error("Anthropic stream ended before message_stop");
}
const streamAnthropic = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const requestContext = prepareClaudeSonnet5RequestContext(model, context);
	const requestOptions = normalizeAnthropicThinkingOptions(model, options);
	(async () => {
		const output = {
			role: "assistant",
			content: [],
			api: model.api,
			provider: model.provider,
			model: model.id,
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			stopReason: "stop",
			timestamp: Date.now()
		};
		const refusalBuffer = usesClaudeStreamingRefusalContract(model) ? createDeferredEventBuffer(stream, () => notifyLlmRequestActivity(requestOptions?.signal)) : void 0;
		const eventSink = refusalBuffer ?? stream;
		let costModel = model;
		let messageStartPromptUsage;
		try {
			let client;
			let isOAuth;
			let serverSideFallback = false;
			if (requestOptions?.client) {
				client = requestOptions.client;
				isOAuth = false;
			} else {
				const apiKey = requestOptions?.apiKey ?? getEnvApiKey(model.provider) ?? "";
				let copilotDynamicHeaders;
				if (model.provider === "github-copilot") {
					const hasImages = hasCopilotVisionInput(requestContext.messages);
					copilotDynamicHeaders = buildCopilotDynamicHeaders({
						messages: requestContext.messages,
						hasImages
					});
				}
				const cacheSessionId = (requestOptions?.cacheRetention ?? resolveCacheRetention()) === "none" ? void 0 : requestOptions?.sessionId;
				const created = createClient(model, apiKey, requestOptions?.thinkingEnabled === true, requestOptions?.interleavedThinking ?? true, shouldUseFineGrainedToolStreamingBeta(model, requestContext), requestOptions?.headers, copilotDynamicHeaders, cacheSessionId);
				client = created.client;
				isOAuth = created.isOAuthToken;
				serverSideFallback = created.serverSideFallback;
			}
			const builtParams = buildParams(model, requestContext, isOAuth, requestOptions, serverSideFallback);
			let params = builtParams.params;
			const toolProjection = builtParams.toolProjection;
			const nextParams = await requestOptions?.onPayload?.(params, model);
			if (nextParams !== void 0) params = nextParams;
			applyClaudeRequestContract(params, model);
			const sdkRequestOptions = {
				...requestOptions?.signal ? { signal: requestOptions.signal } : {},
				...requestOptions?.timeoutMs !== void 0 ? { timeout: requestOptions.timeoutMs } : {},
				...requestOptions?.maxRetries !== void 0 ? { maxRetries: requestOptions.maxRetries } : {}
			};
			const response = await client.messages.create({
				...params,
				stream: true
			}, sdkRequestOptions).asResponse();
			await requestOptions?.onResponse?.({
				status: response.status,
				headers: headersToRecord(response.headers)
			}, model);
			const blocks = output.content;
			const blockIndexes = /* @__PURE__ */ new Map();
			for await (const event of iterateAnthropicEvents(response, requestOptions?.signal, refusalBuffer !== void 0)) if (event.type === "message_start") {
				output.responseId = event.message.id;
				output.responseModel = event.message.model;
				const promptUsage = readAnthropicPromptUsageSnapshot(event.message.usage);
				const messageStartPromptTokens = promptUsage ? promptUsage.input + promptUsage.cacheRead + promptUsage.cacheWrite : 0;
				messageStartPromptUsage = messageStartPromptTokens > 0 ? promptUsage : void 0;
				const inputTokens = readAnthropicUsageTokenCount(event.message.usage.input_tokens);
				if (inputTokens !== void 0) output.usage.input = inputTokens;
				const outputTokens = readAnthropicUsageTokenCount(event.message.usage.output_tokens);
				if (outputTokens !== void 0) output.usage.output = outputTokens;
				const cacheReadTokens = event.message.usage.cache_read_input_tokens == null ? 0 : readAnthropicUsageTokenCount(event.message.usage.cache_read_input_tokens);
				if (cacheReadTokens !== void 0) output.usage.cacheRead = cacheReadTokens;
				const cacheWriteTokens = event.message.usage.cache_creation_input_tokens == null ? 0 : readAnthropicUsageTokenCount(event.message.usage.cache_creation_input_tokens);
				if (cacheWriteTokens !== void 0) output.usage.cacheWrite = cacheWriteTokens;
				output.usage.totalTokens = output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
				if (messageStartPromptUsage && outputTokens !== void 0) output.usage.contextUsage = {
					state: "available",
					promptTokens: messageStartPromptTokens,
					totalTokens: messageStartPromptTokens + output.usage.output
				};
				calculateCost(costModel, output.usage);
				eventSink.push({
					type: "start",
					partial: output
				});
			} else if (event.type === "content_block_start") {
				const fallbackBoundary = refusalBuffer ? readAnthropicFallbackBoundary(event.content_block) : null;
				if (fallbackBoundary) {
					refusalBuffer?.discard();
					blockIndexes.clear();
					applyAnthropicFallbackBoundary({
						output,
						boundary: fallbackBoundary,
						provider: model.provider
					});
					costModel = {
						...model,
						cost: CLAUDE_FABLE_5_FALLBACK_MODEL_COST
					};
					calculateCost(costModel, output.usage);
					eventSink.push({
						type: "start",
						partial: output
					});
					for (let i = 0; i < blocks.length; i += 1) {
						const block = blocks[i];
						if (block.type !== "text") continue;
						delete block.index;
						eventSink.push({
							type: "text_start",
							contentIndex: i,
							partial: output
						});
						if (block.text) eventSink.push({
							type: "text_delta",
							contentIndex: i,
							delta: block.text,
							partial: output
						});
						eventSink.push({
							type: "text_end",
							contentIndex: i,
							content: block.text,
							partial: output
						});
					}
				} else if (event.content_block.type === "text") {
					const block = {
						type: "text",
						text: "",
						index: event.index
					};
					output.content.push(block);
					blockIndexes.set(event.index, output.content.length - 1);
					eventSink.push({
						type: "text_start",
						contentIndex: output.content.length - 1,
						partial: output
					});
				} else if (event.content_block.type === "thinking") {
					const block = {
						type: "thinking",
						thinking: "",
						thinkingSignature: "",
						index: event.index
					};
					output.content.push(block);
					blockIndexes.set(event.index, output.content.length - 1);
					eventSink.push({
						type: "thinking_start",
						contentIndex: output.content.length - 1,
						partial: output
					});
				} else if (event.content_block.type === "redacted_thinking") {
					const block = {
						type: "thinking",
						thinking: "[Reasoning redacted]",
						thinkingSignature: event.content_block.data,
						redacted: true,
						index: event.index
					};
					output.content.push(block);
					blockIndexes.set(event.index, output.content.length - 1);
					eventSink.push({
						type: "thinking_start",
						contentIndex: output.content.length - 1,
						partial: output
					});
				} else if (event.content_block.type === "tool_use") {
					const block = {
						type: "toolCall",
						id: event.content_block.id,
						name: isOAuth ? resolveOriginalAnthropicToolName(event.content_block.name, toolProjection) : event.content_block.name,
						arguments: event.content_block.input ?? {},
						partialJson: "",
						index: event.index
					};
					output.content.push(block);
					blockIndexes.set(event.index, output.content.length - 1);
					eventSink.push({
						type: "toolcall_start",
						contentIndex: output.content.length - 1,
						partial: output
					});
				}
			} else if (event.type === "content_block_delta") {
				if (event.delta.type === "text_delta") {
					const index = blockIndexes.get(event.index);
					const block = index === void 0 ? void 0 : blocks[index];
					if (index !== void 0 && block?.type === "text") {
						block.text += event.delta.text;
						eventSink.push({
							type: "text_delta",
							contentIndex: index,
							delta: event.delta.text,
							partial: output
						});
					}
				} else if (event.delta.type === "thinking_delta") {
					const index = blockIndexes.get(event.index);
					const block = index === void 0 ? void 0 : blocks[index];
					if (index !== void 0 && block?.type === "thinking") {
						block.thinking += event.delta.thinking;
						eventSink.push({
							type: "thinking_delta",
							contentIndex: index,
							delta: event.delta.thinking,
							partial: output
						});
					}
				} else if (event.delta.type === "input_json_delta") {
					const index = blockIndexes.get(event.index);
					const block = index === void 0 ? void 0 : blocks[index];
					if (index !== void 0 && block?.type === "toolCall") {
						block.partialJson += event.delta.partial_json;
						block.arguments = parseStreamingJson(block.partialJson);
						eventSink.push({
							type: "toolcall_delta",
							contentIndex: index,
							delta: event.delta.partial_json,
							partial: output
						});
					}
				} else if (event.delta.type === "signature_delta") {
					const index = blockIndexes.get(event.index);
					const block = index === void 0 ? void 0 : blocks[index];
					if (index !== void 0 && block?.type === "thinking") {
						block.thinkingSignature = block.thinkingSignature || "";
						block.thinkingSignature += event.delta.signature;
					}
				}
			} else if (event.type === "content_block_stop") {
				const index = blockIndexes.get(event.index);
				const block = index === void 0 ? void 0 : blocks[index];
				if (index !== void 0 && block) {
					blockIndexes.delete(event.index);
					delete block.index;
					if (block.type === "text") eventSink.push({
						type: "text_end",
						contentIndex: index,
						content: block.text,
						partial: output
					});
					else if (block.type === "thinking") eventSink.push({
						type: "thinking_end",
						contentIndex: index,
						content: block.thinking,
						partial: output
					});
					else if (block.type === "toolCall") {
						block.arguments = parseStreamingJson(block.partialJson);
						delete block.partialJson;
						eventSink.push({
							type: "toolcall_end",
							contentIndex: index,
							toolCall: block,
							partial: output
						});
					}
				}
			} else if (event.type === "message_delta") {
				if (event.delta.stop_reason) if (event.delta.stop_reason === "refusal") applyAnthropicRefusal(output, event.delta.stop_details, model.provider);
				else output.stopReason = mapStopReason(event.delta.stop_reason);
				const inputTokens = readAnthropicUsageTokenCount(event.usage.input_tokens);
				if (inputTokens !== void 0) output.usage.input = inputTokens;
				const outputTokens = readAnthropicUsageTokenCount(event.usage.output_tokens);
				if (outputTokens !== void 0) output.usage.output = outputTokens;
				const cacheReadTokens = readAnthropicUsageTokenCount(event.usage.cache_read_input_tokens);
				if (cacheReadTokens !== void 0) output.usage.cacheRead = cacheReadTokens;
				const cacheWriteTokens = readAnthropicUsageTokenCount(event.usage.cache_creation_input_tokens);
				if (cacheWriteTokens !== void 0) output.usage.cacheWrite = cacheWriteTokens;
				output.usage.totalTokens = output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
				const iterationUsage = readLastAnthropicIterationUsage(event.usage);
				if (iterationUsage.state === "valid") output.usage.contextUsage = {
					state: "available",
					promptTokens: iterationUsage.usage.contextPromptTokens,
					totalTokens: iterationUsage.usage.totalTokens
				};
				else if (iterationUsage.state === "invalid") output.usage.contextUsage = { state: "unavailable" };
				else if (outputTokens !== void 0 && (messageStartPromptUsage !== void 0 || inputTokens !== void 0 && cacheReadTokens !== void 0 && cacheWriteTokens !== void 0)) {
					const promptTokens = output.usage.input + output.usage.cacheRead + output.usage.cacheWrite;
					output.usage.contextUsage = {
						state: "available",
						promptTokens,
						totalTokens: promptTokens + output.usage.output
					};
				} else output.usage.contextUsage = { state: "unavailable" };
				calculateCost(costModel, output.usage);
			}
			if (requestOptions?.signal?.aborted) throw new Error("Request was aborted");
			if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
			refusalBuffer?.flush();
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			for (const block of output.content) {
				delete block.index;
				delete block.partialJson;
			}
			if (refusalBuffer) {
				refusalBuffer.discard();
				output.content = [];
			}
			output.stopReason = requestOptions?.signal?.aborted ? "aborted" : "error";
			output.errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			stream.push({
				type: "error",
				reason: output.stopReason,
				error: output
			});
			stream.end();
		}
	})();
	return stream;
};
function normalizeAnthropicToolChoice(thinkingEnabled, toolChoice) {
	if (thinkingEnabled && (toolChoice === "any" || typeof toolChoice === "object" && toolChoice.type === "tool")) return { type: "auto" };
	return typeof toolChoice === "string" ? { type: toolChoice } : toolChoice;
}
/**
* Check if a model supports adaptive thinking (Fable 5, Opus 4.6+, Sonnet 4.6).
*/
function supportsAdaptiveThinking(model) {
	return supportsClaudeAdaptiveThinking(model);
}
function normalizeAnthropicThinkingOptions(model, options) {
	if (options?.thinkingEnabled !== true || supportsAdaptiveThinking(model)) return options;
	const budgetTokens = options.thinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET_TOKENS;
	const maxTokens = options.maxTokens ?? model.maxTokens;
	if (budgetTokens >= ANTHROPIC_MIN_THINKING_BUDGET_TOKENS && budgetTokens < maxTokens) return options;
	return {
		...options,
		thinkingEnabled: false,
		thinkingBudgetTokens: void 0
	};
}
function supportsNativeXhighEffort(model) {
	return supportsClaudeNativeXhighEffort(model);
}
/**
* Map ThinkingLevel to Anthropic effort levels for adaptive thinking.
* Model metadata owns the provider-specific extended effort mapping.
*/
function mapThinkingLevelToEffort(model, level) {
	const requestedLevel = level;
	const hasCanonicalAlias = typeof model.params?.canonicalModelId === "string";
	const thinkingLevelMap = resolveClaudeNativeThinkingLevelMap(model);
	const clampModel = {
		...model,
		...hasCanonicalAlias ? { reasoning: true } : {},
		...thinkingLevelMap ? { thinkingLevelMap } : {}
	};
	const clampedLevel = requestedLevel ? clampThinkingLevel(clampModel, requestedLevel) : requestedLevel;
	const mapped = clampedLevel ? thinkingLevelMap?.[clampedLevel] : void 0;
	if (typeof mapped === "string") return mapped;
	switch (clampedLevel) {
		case "off":
		case "minimal":
		case "low": return "low";
		case "medium": return "medium";
		case "high": return "high";
		case "xhigh": return supportsNativeXhighEffort(model) ? "xhigh" : "high";
		case "max": return supportsClaudeNativeMaxEffort(model) ? "max" : "high";
		default: return "high";
	}
}
const streamSimpleAnthropic = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = {
		...buildBaseOptions(model, options, apiKey),
		toolChoice: options?.toolChoice
	};
	const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
	if (options?.reasoning === "off" && !mandatoryAdaptiveThinking) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: false
	});
	const reasoning = options?.reasoning === "off" ? mandatoryAdaptiveThinking ? "low" : "high" : options?.reasoning;
	if (resolveClaudeSonnet5ModelIdentity(model)) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: true,
		effort: mapThinkingLevelToEffort(model, reasoning ?? "high")
	});
	if (!reasoning) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: mandatoryAdaptiveThinking,
		...mandatoryAdaptiveThinking ? { effort: "high" } : {}
	});
	if (supportsAdaptiveThinking(model)) {
		const effort = mapThinkingLevelToEffort(model, reasoning);
		return streamAnthropic(model, context, {
			...base,
			thinkingEnabled: true,
			effort
		});
	}
	const adjusted = adjustMaxTokensForThinking(base.maxTokens, model.maxTokens, reasoning, options?.thinkingBudgets);
	const thinkingEnabled = adjusted.thinkingBudget >= 1024;
	return streamAnthropic(model, context, {
		...base,
		maxTokens: adjusted.maxTokens,
		thinkingEnabled,
		thinkingBudgetTokens: thinkingEnabled ? adjusted.thinkingBudget : void 0
	});
};
function isOAuthToken(apiKey) {
	return getAiTransportHost().resolveSecretSentinel(apiKey).includes("sk-ant-oat");
}
function isAnthropicPublicEndpoint(baseUrl) {
	if (!baseUrl) return true;
	try {
		return new URL(baseUrl).hostname.toLowerCase() === "api.anthropic.com";
	} catch {
		return false;
	}
}
/**
* Server-side refusal fallback is a first-party Claude API beta: proxies and
* Bedrock/Vertex/Foundry reject the `fallbacks` param, and OAuth (Claude Code
* identity) requests are excluded until the beta is verified there.
*/
function supportsAnthropicServerSideFallback(model) {
	if (!usesClaudeFable5MessagesContract(model) || model.provider !== "anthropic") return false;
	return isAnthropicPublicEndpoint(model.baseUrl);
}
function createClient(model, apiKey, thinkingEnabled, interleavedThinking, useFineGrainedToolStreamingBeta, optionsHeaders, dynamicHeaders, sessionId) {
	const needsInterleavedBeta = interleavedThinking && !supportsAdaptiveThinking(model);
	const betaFeatures = [];
	if (useFineGrainedToolStreamingBeta) betaFeatures.push(FINE_GRAINED_TOOL_STREAMING_BETA);
	if (needsInterleavedBeta) betaFeatures.push(INTERLEAVED_THINKING_BETA);
	const fetchOptions = /^kimi(?:-|$)/.test(model.provider) && thinkingEnabled ? { sanitizeSse: false } : void 0;
	const fetch = getAiTransportHost().buildModelFetch(model, void 0, fetchOptions);
	if (model.provider === "cloudflare-ai-gateway") return {
		client: new Anthropic({
			apiKey,
			authToken: null,
			baseURL: resolveCloudflareBaseUrl(model),
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				Authorization: null,
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, model.headers, optionsHeaders),
			fetch
		}),
		isOAuthToken: false,
		serverSideFallback: false
	};
	if (model.provider === "github-copilot") return {
		client: new Anthropic({
			apiKey: null,
			authToken: apiKey,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, model.headers, dynamicHeaders, optionsHeaders),
			fetch
		}),
		isOAuthToken: false,
		serverSideFallback: false
	};
	if (usesFoundryBearerAuth({
		...model,
		headers: resolveAiTransportHeaderSentinels(model.headers)
	})) return {
		client: new Anthropic({
			apiKey: null,
			authToken: apiKey,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, omitFoundryBearerCredentialHeaders(model.headers), dynamicHeaders, optionsHeaders),
			fetch
		}),
		isOAuthToken: false,
		serverSideFallback: false
	};
	if (isOAuthToken(apiKey)) return {
		client: new Anthropic({
			apiKey: null,
			authToken: apiKey,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				"anthropic-beta": [
					"claude-code-20250219",
					"oauth-2025-04-20",
					...betaFeatures
				].join(","),
				"user-agent": `claude-cli/${claudeCodeVersion}`,
				"x-app": "cli"
			}, model.headers, optionsHeaders),
			fetch
		}),
		isOAuthToken: true,
		serverSideFallback: false
	};
	const serverSideFallback = supportsAnthropicServerSideFallback(model);
	if (serverSideFallback) betaFeatures.push(ANTHROPIC_SERVER_SIDE_FALLBACK_BETA);
	const sessionAffinityHeaders = sessionId && getAnthropicCompat(model).sendSessionAffinityHeaders ? { "x-session-affinity": sessionId } : {};
	return {
		client: new Anthropic({
			apiKey,
			authToken: null,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, sessionAffinityHeaders, model.headers, optionsHeaders),
			fetch
		}),
		isOAuthToken: false,
		serverSideFallback
	};
}
function buildParams(model, context, isOAuthTokenResult, options, serverSideFallback = false) {
	const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
	const replayThinkingEnabled = mandatoryAdaptiveThinking || options?.thinkingEnabled === true;
	const { cacheControl } = getCacheControl(model, options?.cacheRetention);
	const system = buildAnthropicSystemBlocks(context.systemPrompt, isOAuthTokenResult, cacheControl);
	const compat = context.tools ? getAnthropicCompat(model) : void 0;
	const convertedTools = context.tools && compat ? convertTools(context.tools, isOAuthTokenResult, compat.supportsEagerToolInputStreaming, compat.supportsCacheControlOnTools ? cacheControl : void 0) : void 0;
	const tools = convertedTools?.tools;
	const toolProjection = convertedTools?.projection;
	const systemCacheControlCount = countNativeCacheControlMarkers(system);
	const toolCacheControlCount = countNativeCacheControlMarkers(tools);
	const messageCacheControlLimit = Math.max(0, ANTHROPIC_CACHE_CONTROL_LIMIT - systemCacheControlCount - toolCacheControlCount);
	const params = {
		model: model.id,
		messages: convertMessages(context.messages, model, isOAuthTokenResult, cacheControl, messageCacheControlLimit, replayThinkingEnabled),
		max_tokens: options?.maxTokens ?? model.maxTokens,
		stream: true
	};
	if (system) params.system = system;
	if (serverSideFallback) params.fallbacks = buildAnthropicServerSideFallbacks();
	if (options?.temperature !== void 0 && !options?.thinkingEnabled && !supportsNativeXhighEffort(model)) params.temperature = options.temperature;
	if (options?.stop !== void 0 && options.stop.length > 0) params.stop_sequences = options.stop;
	if (tools && tools.length > 0) params.tools = tools;
	if (mandatoryAdaptiveThinking || model.reasoning || supportsAdaptiveThinking(model)) {
		if (mandatoryAdaptiveThinking || options?.thinkingEnabled) {
			const display = options?.thinkingDisplay ?? "summarized";
			if (supportsAdaptiveThinking(model)) {
				params.thinking = {
					type: "adaptive",
					display
				};
				const effort = options?.effort ?? (mandatoryAdaptiveThinking ? "high" : void 0);
				if (effort) params.output_config = effort === "xhigh" ? { effort } : { effort };
			} else params.thinking = {
				type: "enabled",
				budget_tokens: options?.thinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET_TOKENS,
				display
			};
		} else if (options?.thinkingEnabled === false) params.thinking = { type: "disabled" };
	}
	if (options?.metadata) {
		const userId = options.metadata.user_id;
		if (typeof userId === "string") params.metadata = { user_id: userId };
	}
	if (options?.toolChoice) {
		const normalizedToolChoice = normalizeAnthropicToolChoice(replayThinkingEnabled, options.toolChoice);
		const projectedToolChoice = toolProjection ? reconcileAnthropicToolChoice(normalizedToolChoice, toolProjection) : normalizedToolChoice;
		if (projectedToolChoice) params.tool_choice = projectedToolChoice;
	}
	return {
		params,
		toolProjection
	};
}
function normalizeToolCallId(id) {
	return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}
function convertMessages(messages, model, isOAuthTokenValue, cacheControl, messageCacheControlLimit = 4, replayThinkingEnabled = true) {
	const params = [];
	const cacheBreakpointOptOutParamIndexes = /* @__PURE__ */ new Set();
	const transformedMessages = transformMessages(messages, model, normalizeToolCallId);
	const activeToolTurnAssistantIndex = replayThinkingEnabled ? -1 : findActiveAnthropicToolTurnAssistantIndex(transformedMessages);
	for (let i = 0; i < transformedMessages.length; i++) {
		const msg = transformedMessages[i];
		if (msg.role === "user") {
			const isRuntimeContextCarrier = msg.runtimeContextCarrier === true;
			if (typeof msg.content === "string") {
				if (msg.content.trim().length > 0) {
					if (isRuntimeContextCarrier) cacheBreakpointOptOutParamIndexes.add(params.length);
					params.push({
						role: "user",
						content: sanitizeSurrogates(msg.content)
					});
				}
			} else {
				const filteredBlocks = msg.content.map((item) => {
					if (item.type === "text") return {
						type: "text",
						text: sanitizeSurrogates(item.text)
					};
					return {
						type: "image",
						source: {
							type: "base64",
							media_type: item.mimeType,
							data: item.data
						}
					};
				}).filter((b) => {
					if (b.type === "text") return b.text.trim().length > 0;
					return true;
				});
				if (filteredBlocks.length === 0) continue;
				if (isRuntimeContextCarrier) cacheBreakpointOptOutParamIndexes.add(params.length);
				params.push({
					role: "user",
					content: filteredBlocks
				});
			}
		} else if (msg.role === "assistant") {
			const blocks = [];
			let omittedThinking = false;
			for (const block of msg.content) if (block.type === "text") {
				if (block.text.trim().length === 0) continue;
				blocks.push({
					type: "text",
					text: sanitizeSurrogates(block.text)
				});
			} else if (block.type === "thinking") {
				if (!replayThinkingEnabled && i !== activeToolTurnAssistantIndex) {
					omittedThinking = true;
					continue;
				}
				if (block.redacted) {
					blocks.push({
						type: "redacted_thinking",
						data: block.thinkingSignature
					});
					continue;
				}
				const thinkingSignature = block.thinkingSignature?.trim();
				const hasNativeThinkingSignature = Boolean(thinkingSignature) && thinkingSignature !== "reasoning_content";
				if (block.thinking.trim().length === 0 && !hasNativeThinkingSignature) continue;
				if (!thinkingSignature) blocks.push({
					type: "text",
					text: sanitizeSurrogates(block.thinking)
				});
				else {
					if (thinkingSignature === "reasoning_content") continue;
					blocks.push({
						type: "thinking",
						thinking: block.thinking,
						signature: thinkingSignature
					});
				}
			} else if (block.type === "toolCall") blocks.push({
				type: "tool_use",
				id: block.id,
				name: isOAuthTokenValue ? toClaudeCodeName(block.name) : block.name,
				input: block.arguments ?? {}
			});
			if (blocks.length === 0 && omittedThinking) blocks.push({
				type: "text",
				text: ANTHROPIC_OMITTED_REASONING_TEXT
			});
			if (blocks.length === 0) continue;
			params.push({
				role: "assistant",
				content: blocks
			});
		} else if (msg.role === "toolResult") {
			const toolResults = [];
			toolResults.push({
				type: "tool_result",
				tool_use_id: msg.toolCallId,
				content: convertContentBlocks(msg.content, msg.isError),
				is_error: msg.isError
			});
			let j = i + 1;
			while (j < transformedMessages.length && transformedMessages[j].role === "toolResult") {
				const nextMsg = transformedMessages[j];
				toolResults.push({
					type: "tool_result",
					tool_use_id: nextMsg.toolCallId,
					content: convertContentBlocks(nextMsg.content, nextMsg.isError),
					is_error: nextMsg.isError
				});
				j++;
			}
			i = j - 1;
			params.push({
				role: "user",
				content: toolResults
			});
		}
	}
	if (cacheControl && params.length > 0 && messageCacheControlLimit > 0) {
		let fallbackToolResult;
		for (let i = params.length - 1; i >= 0; i--) {
			const message = params[i];
			if (message.role !== "user" || cacheBreakpointOptOutParamIndexes.has(i)) continue;
			if (Array.isArray(message.content)) {
				for (let j = message.content.length - 1; j >= 0; j--) {
					const block = message.content[j];
					if (block.type === "text" || block.type === "image") {
						if (fallbackToolResult && messageCacheControlLimit === 1) {
							applyContentBlockCacheControl(fallbackToolResult, cacheControl);
							return params;
						}
						applyContentBlockCacheControl(block, cacheControl);
						if (fallbackToolResult && messageCacheControlLimit > 1) applyContentBlockCacheControl(fallbackToolResult, cacheControl);
						return params;
					}
					if (block.type === "tool_result" && fallbackToolResult === void 0) fallbackToolResult = block;
				}
				continue;
			}
			if (typeof message.content === "string") {
				if (fallbackToolResult && messageCacheControlLimit === 1) {
					applyContentBlockCacheControl(fallbackToolResult, cacheControl);
					return params;
				}
				message.content = [{
					type: "text",
					text: message.content,
					cache_control: cacheControl
				}];
				if (fallbackToolResult && messageCacheControlLimit > 1) applyContentBlockCacheControl(fallbackToolResult, cacheControl);
				return params;
			}
		}
		if (fallbackToolResult) applyContentBlockCacheControl(fallbackToolResult, cacheControl);
	}
	return params;
}
function applyContentBlockCacheControl(block, cacheControl) {
	block.cache_control = cacheControl;
}
function buildAnthropicSystemBlocks(systemPrompt, isOAuthTokenResult, cacheControl) {
	const blocks = [];
	if (isOAuthTokenResult) {
		blocks.push({
			type: "text",
			text: claudeCodeBillingSystemBlock
		});
		blocks.push({
			type: "text",
			text: "You are Claude Code, Anthropic's official CLI for Claude.",
			...cacheControl ? { cache_control: cacheControl } : {}
		});
	}
	if (systemPrompt) blocks.push(...buildSystemPromptBlocks(systemPrompt, cacheControl));
	return blocks.length > 0 ? blocks : void 0;
}
function buildSystemPromptBlocks(systemPrompt, cacheControl) {
	if (!cacheControl) return [{
		type: "text",
		text: sanitizeSurrogates(stripSystemPromptCacheBoundary(systemPrompt))
	}];
	const split = splitSystemPromptCacheBoundary(systemPrompt);
	if (!split) return [{
		type: "text",
		text: sanitizeSurrogates(systemPrompt),
		cache_control: cacheControl
	}];
	const blocks = [];
	if (split.stablePrefix) blocks.push({
		type: "text",
		text: sanitizeSurrogates(split.stablePrefix),
		cache_control: cacheControl
	});
	if (split.dynamicSuffix) blocks.push({
		type: "text",
		text: sanitizeSurrogates(split.dynamicSuffix)
	});
	return blocks.length > 0 ? blocks : [{
		type: "text",
		text: ""
	}];
}
function countNativeCacheControlMarkers(blocks) {
	if (!Array.isArray(blocks)) return 0;
	let count = 0;
	for (const block of blocks) if (block && typeof block === "object" && "cache_control" in block) count += 1;
	return count;
}
function shouldUseFineGrainedToolStreamingBeta(model, context) {
	return Boolean(context.tools?.length) && !getAnthropicCompat(model).supportsEagerToolInputStreaming;
}
function convertTools(tools, isOAuthTokenLocal, supportsEagerToolInputStreaming, cacheControl) {
	const projection = projectAnthropicTools(tools, (name) => isOAuthTokenLocal ? toClaudeCodeName(name) : name);
	const convertedTools = [];
	for (const [index, tool] of projection.tools.entries()) {
		const convertedTool = {
			name: tool.wireName,
			description: tool.description,
			input_schema: tool.inputSchema
		};
		if (supportsEagerToolInputStreaming) convertedTool.eager_input_streaming = true;
		if (cacheControl && index === projection.tools.length - 1) convertedTool.cache_control = cacheControl;
		convertedTools.push(convertedTool);
	}
	return {
		projection,
		tools: convertedTools
	};
}
function mapStopReason(reason) {
	switch (reason) {
		case "end_turn": return "stop";
		case "max_tokens": return "length";
		case "tool_use": return "toolUse";
		case "refusal": return "error";
		case "pause_turn": return "stop";
		case "stop_sequence": return "stop";
		case "sensitive": return "error";
		default: throw new Error(`Unhandled stop reason: ${reason}`);
	}
}
//#endregion
export { readAnthropicFallbackBoundary as _, readAnthropicUsageTokenCount as a, usesFoundryBearerAuth as b, reconcileAnthropicToolChoice as c, findActiveAnthropicToolTurnAssistantIndex as d, ANTHROPIC_SERVER_SIDE_FALLBACK_BETA as f, buildAnthropicServerSideFallbacks as g, applyAnthropicFallbackBoundary as h, readAnthropicPromptUsageSnapshot as i, resolveOriginalAnthropicToolName as l, CLAUDE_FABLE_5_FALLBACK_MODEL_COST as m, streamAnthropic as n, readLastAnthropicIterationUsage as o, CLAUDE_FABLE_5_FALLBACK_MODEL as p, streamSimpleAnthropic as r, projectAnthropicTools as s, anthropic_exports as t, ANTHROPIC_OMITTED_REASONING_TEXT as u, applyAnthropicRefusal as v, omitFoundryBearerCredentialHeaders as y };
