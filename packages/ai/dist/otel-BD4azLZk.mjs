import { a as registerTracerProvider, i as getRegisteredTracerProvider, n as completionChunkFromJSON, r as UsageInfo$outboundSchema } from "./mistral-CF8d4m1z.mjs";
import { SpanStatusCode, context, propagation, trace } from "@opentelemetry/api";
import { ATTR_ERROR_TYPE, ATTR_GEN_AI_AGENT_DESCRIPTION, ATTR_GEN_AI_AGENT_ID, ATTR_GEN_AI_AGENT_NAME, ATTR_GEN_AI_CONVERSATION_ID, ATTR_GEN_AI_INPUT_MESSAGES, ATTR_GEN_AI_OPERATION_NAME, ATTR_GEN_AI_OUTPUT_MESSAGES, ATTR_GEN_AI_PROVIDER_NAME, ATTR_GEN_AI_REQUEST_CHOICE_COUNT, ATTR_GEN_AI_REQUEST_ENCODING_FORMATS, ATTR_GEN_AI_REQUEST_FREQUENCY_PENALTY, ATTR_GEN_AI_REQUEST_MAX_TOKENS, ATTR_GEN_AI_REQUEST_MODEL, ATTR_GEN_AI_REQUEST_PRESENCE_PENALTY, ATTR_GEN_AI_REQUEST_SEED, ATTR_GEN_AI_REQUEST_STOP_SEQUENCES, ATTR_GEN_AI_REQUEST_TEMPERATURE, ATTR_GEN_AI_REQUEST_TOP_K, ATTR_GEN_AI_REQUEST_TOP_P, ATTR_GEN_AI_RESPONSE_FINISH_REASONS, ATTR_GEN_AI_RESPONSE_ID, ATTR_GEN_AI_RESPONSE_MODEL, ATTR_GEN_AI_SYSTEM_INSTRUCTIONS, ATTR_GEN_AI_TOOL_CALL_ARGUMENTS, ATTR_GEN_AI_TOOL_CALL_ID, ATTR_GEN_AI_TOOL_CALL_RESULT, ATTR_GEN_AI_TOOL_DEFINITIONS, ATTR_GEN_AI_TOOL_NAME, ATTR_GEN_AI_TOOL_TYPE, ATTR_GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS, ATTR_GEN_AI_USAGE_INPUT_TOKENS, ATTR_GEN_AI_USAGE_OUTPUT_TOKENS, ATTR_HTTP_REQUEST_METHOD, ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_SERVER_ADDRESS, ATTR_SERVER_PORT, ATTR_URL_FULL, GEN_AI_OPERATION_NAME_VALUE_CHAT, GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT, GEN_AI_OPERATION_NAME_VALUE_EMBEDDINGS, GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL, GEN_AI_OPERATION_NAME_VALUE_GENERATE_CONTENT, GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT, GEN_AI_OPERATION_NAME_VALUE_TEXT_COMPLETION, GEN_AI_PROVIDER_NAME_VALUE_MISTRAL_AI } from "@opentelemetry/semantic-conventions/incubating";
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/extra/observability/formatting.js
/**
* Formatting helpers for converting Mistral API payloads to OTEL GenAI convention formats.
*
* These are pure functions with no OTEL dependencies - they transform objects to objects
* matching the GenAI semantic convention schemas for input/output messages and tool definitions.
* The caller is responsible for the final JSON serialization (single JSON.stringify on the whole
* collection) before setting span attributes.
*
* Schemas:
* - Input messages: https://github.com/open-telemetry/semantic-conventions/blob/main/docs/gen-ai/gen-ai-input-messages.json
* - Output messages: https://github.com/open-telemetry/semantic-conventions/blob/main/docs/gen-ai/gen-ai-output-messages.json
* - Tool definitions: https://github.com/Cirilla-zmh/semantic-conventions/blob/cc4d07e7e56b80e9aa5904a3d524c134699da37f/docs/gen-ai/gen-ai-tool-definitions.json
*/
/**
* Convert Mistral message content to OTEL parts array.
*
* Mistral content is either a string or an array of content chunks.
*/
function contentToParts(content) {
	if (content == null) return [];
	if (typeof content === "string") return [{
		type: "text",
		content
	}];
	if (!Array.isArray(content)) return [];
	const parts = [];
	for (const chunk of content) if (typeof chunk === "string") parts.push({
		type: "text",
		content: chunk
	});
	else if (typeof chunk === "object" && chunk !== null) {
		const c = chunk;
		const chunkType = c["type"] || "";
		if (chunkType === "text") parts.push({
			type: "text",
			content: c["text"] || ""
		});
		else if (chunkType === "thinking") {
			const thinking = c["thinking"];
			let contentStr;
			if (Array.isArray(thinking)) contentStr = thinking.filter((sub) => typeof sub === "object" && sub !== null && sub["type"] === "text").map((sub) => sub["text"] || "").join("\n");
			else contentStr = String(thinking || "");
			parts.push({
				type: "reasoning",
				content: contentStr
			});
		} else if (chunkType === "image_url") {
			const url = c["image_url"];
			const uri = typeof url === "object" && url !== null ? url["url"] || "" : String(url || "");
			parts.push({
				type: "uri",
				modality: "image",
				uri
			});
		} else parts.push({ type: chunkType });
	}
	return parts;
}
/**
* Convert Mistral tool_calls to OTEL ToolCallRequestPart entries.
*/
function toolCallsToParts(toolCalls) {
	if (!toolCalls || !Array.isArray(toolCalls)) return [];
	const parts = [];
	for (const tc of toolCalls) {
		if (typeof tc !== "object" || tc === null) continue;
		const tcObj = tc;
		const func = tcObj["function"] || {};
		const part = {
			type: "tool_call",
			name: func["name"] || ""
		};
		const tcId = tcObj["id"];
		if (tcId != null) part["id"] = tcId;
		const args = func["arguments"];
		if (args != null) part["arguments"] = args;
		parts.push(part);
	}
	return parts;
}
/**
* Format a single input message per the OTEL GenAI convention.
*
* Schema: https://github.com/open-telemetry/semantic-conventions/blob/main/docs/gen-ai/gen-ai-input-messages.json
* ChatMessage: {role (required), parts (required), name?}
*
* Conversation entry objects (e.g. function.result) don't carry a "role"
* field - they are detected via their "type" and mapped to the closest OTEL role.
*/
function formatInputMessage(message) {
	if (message["type"] === "function.result") {
		const part = {
			type: "tool_call_response",
			response: message["result"]
		};
		const toolCallId = message["tool_call_id"];
		if (toolCallId != null) part["id"] = toolCallId;
		return {
			role: "tool",
			parts: [part]
		};
	}
	const role = message["role"] || "unknown";
	const parts = [];
	if (role === "tool") {
		const toolPart = {
			type: "tool_call_response",
			response: message["content"]
		};
		const toolCallId = message["tool_call_id"];
		if (toolCallId != null) toolPart["id"] = toolCallId;
		parts.push(toolPart);
	} else {
		parts.push(...contentToParts(message["content"]));
		parts.push(...toolCallsToParts(message["tool_calls"]));
	}
	return {
		role,
		parts
	};
}
/**
* Format a single output choice/message per the OTEL GenAI convention.
*
* Schema: https://github.com/open-telemetry/semantic-conventions/blob/main/docs/gen-ai/gen-ai-output-messages.json
* OutputMessage: {role (required), parts (required), finish_reason (required), name?}
*/
function formatOutputMessage(choice) {
	const message = choice["message"] || {};
	const parts = [];
	parts.push(...contentToParts(message["content"]));
	parts.push(...toolCallsToParts(message["tool_calls"]));
	return {
		role: message["role"] || "assistant",
		parts,
		finish_reason: choice["finish_reason"] || ""
	};
}
/**
* Flatten a Mistral tool definition to the OTEL GenAI convention schema.
*
* Mistral format: {"type": "function", "function": {"name": ..., "description": ..., "parameters": ...}}
* OTEL format: {"type": "function", "name": ..., "description": ..., "parameters": ...}
*
* Schema, still under review: https://github.com/open-telemetry/semantic-conventions
*/
function formatToolDefinition(tool) {
	const type = tool["type"] || "function";
	const func = tool["function"];
	if (!func) return null;
	const name = func["name"];
	if (!name) return null;
	const formatted = {
		type,
		name
	};
	const description = func["description"];
	if (description != null) formatted["description"] = description;
	const parameters = func["parameters"];
	if (parameters != null) formatted["parameters"] = parameters;
	return formatted;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/extra/observability/streaming.js
/**
* Streaming response helpers for OTEL tracing.
*
* Pure functions that parse SSE byte streams and accumulate CompletionChunk
* deltas into a ChatCompletionResponse-shaped dict suitable for span enrichment.
*
* NOTE: The SSE bytes are re-parsed here even though EventStream already
* parsed them during iteration.
* TracedResponse sits below EventStream and can only accumulate raw bytes; it
* has no access to the decoded events. Hooking into EventStream could eliminate
* this double-parse, but EventStream is Speakeasy-generated code.
*/
function normalizeCompletionChunkPayload(payload) {
	const parsed = JSON.parse(payload);
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return payload;
	const chunk = parsed;
	for (const field of [
		"object",
		"created",
		"usage"
	]) if (chunk[field] === null) delete chunk[field];
	const choices = chunk["choices"];
	if (Array.isArray(choices)) {
		for (const choice of choices) if (typeof choice === "object" && choice !== null && !Array.isArray(choice)) {
			const choiceObj = choice;
			if (!("finish_reason" in choiceObj)) choiceObj["finish_reason"] = null;
		}
	}
	return JSON.stringify(chunk);
}
/**
* Parse raw SSE text into a list of typed CompletionChunk models.
*
* Only CompletionChunk is handled. If new SSE-streamed response types
* are added, parsing and typing here will need updating.
*/
function parseSseChunks(rawSseText) {
	const chunks = [];
	const lines = rawSseText.split("\n");
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed.startsWith("data: ")) continue;
		const payload = trimmed.slice(6);
		if (payload === "[DONE]") continue;
		try {
			const result = completionChunkFromJSON(normalizeCompletionChunkPayload(payload));
			if (result.ok) chunks.push(result.value);
		} catch {
			continue;
		}
	}
	return chunks;
}
/**
* Accumulate streaming CompletionChunk deltas into a ChatCompletionResponse-shaped dict.
*/
function accumulateChunksToResponseDict(chunks) {
	let responseId;
	let model;
	let usage;
	const choices = /* @__PURE__ */ new Map();
	for (const chunk of chunks) {
		responseId = responseId || chunk.id;
		model = model || chunk.model;
		usage = usage || chunk.usage;
		for (const choice of chunk.choices) {
			let accumulated = choices.get(choice.index);
			if (!accumulated) {
				accumulated = {
					message: {
						role: "assistant",
						content: ""
					},
					finish_reason: ""
				};
				choices.set(choice.index, accumulated);
			}
			const msg = accumulated.message;
			const delta = choice.delta;
			if (typeof delta.role === "string") msg.role = delta.role;
			msg.content += extractOutputText(delta.content);
			if (typeof choice.finishReason === "string") accumulated.finish_reason = choice.finishReason;
			if (Array.isArray(delta.toolCalls)) {
				if (!msg.tool_calls) msg.tool_calls = [];
				const toolCalls = msg.tool_calls;
				for (const tc of delta.toolCalls) {
					const tcIdx = tc.index != null ? tc.index : toolCalls.length;
					while (toolCalls.length <= tcIdx) toolCalls.push({
						id: null,
						function: {
							name: "",
							arguments: ""
						}
					});
					const existing = toolCalls[tcIdx];
					if (tc.id != null && tc.id !== "null") existing.id = tc.id;
					if (tc.function.name) existing.function.name += tc.function.name;
					if (typeof tc.function.arguments === "string" && tc.function.arguments) existing.function.arguments += tc.function.arguments;
				}
			}
		}
	}
	const sortedIndices = Array.from(choices.keys()).sort((a, b) => a - b);
	const result = {
		id: responseId,
		model,
		choices: sortedIndices.map((idx) => choices.get(idx))
	};
	if (usage != null) result["usage"] = UsageInfo$outboundSchema.parse(usage);
	return result;
}
function extractOutputText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.filter((block) => block.type === "text").map((block) => block.text).join("");
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/extra/observability/otel.js
/**
* OTEL conventions for gen AI may be found at:
*
* https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/
* https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/
*/
const semConvAttributes = {
	ATTR_ERROR_TYPE,
	ATTR_GEN_AI_AGENT_DESCRIPTION,
	ATTR_GEN_AI_AGENT_ID,
	ATTR_GEN_AI_AGENT_NAME,
	ATTR_GEN_AI_CONVERSATION_ID,
	ATTR_GEN_AI_INPUT_MESSAGES,
	ATTR_GEN_AI_OPERATION_NAME,
	ATTR_GEN_AI_OUTPUT_MESSAGES,
	ATTR_GEN_AI_PROVIDER_NAME,
	ATTR_GEN_AI_REQUEST_CHOICE_COUNT,
	ATTR_GEN_AI_REQUEST_ENCODING_FORMATS,
	ATTR_GEN_AI_REQUEST_FREQUENCY_PENALTY,
	ATTR_GEN_AI_REQUEST_MAX_TOKENS,
	ATTR_GEN_AI_REQUEST_MODEL,
	ATTR_GEN_AI_REQUEST_PRESENCE_PENALTY,
	ATTR_GEN_AI_REQUEST_SEED,
	ATTR_GEN_AI_REQUEST_STOP_SEQUENCES,
	ATTR_GEN_AI_REQUEST_TEMPERATURE,
	ATTR_GEN_AI_REQUEST_TOP_K,
	ATTR_GEN_AI_REQUEST_TOP_P,
	ATTR_GEN_AI_RESPONSE_FINISH_REASONS,
	ATTR_GEN_AI_RESPONSE_ID,
	ATTR_GEN_AI_RESPONSE_MODEL,
	ATTR_GEN_AI_SYSTEM_INSTRUCTIONS,
	ATTR_GEN_AI_TOOL_CALL_ARGUMENTS,
	ATTR_GEN_AI_TOOL_CALL_ID,
	ATTR_GEN_AI_TOOL_CALL_RESULT,
	ATTR_GEN_AI_TOOL_DEFINITIONS,
	ATTR_GEN_AI_TOOL_NAME,
	ATTR_GEN_AI_TOOL_TYPE,
	ATTR_GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS,
	ATTR_GEN_AI_USAGE_INPUT_TOKENS,
	ATTR_GEN_AI_USAGE_OUTPUT_TOKENS,
	ATTR_HTTP_REQUEST_METHOD,
	ATTR_HTTP_RESPONSE_STATUS_CODE,
	ATTR_SERVER_ADDRESS,
	ATTR_SERVER_PORT,
	ATTR_URL_FULL,
	GEN_AI_OPERATION_NAME_VALUE_CHAT,
	GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT,
	GEN_AI_OPERATION_NAME_VALUE_EMBEDDINGS,
	GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL,
	GEN_AI_OPERATION_NAME_VALUE_GENERATE_CONTENT,
	GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT,
	GEN_AI_OPERATION_NAME_VALUE_TEXT_COMPLETION,
	GEN_AI_PROVIDER_NAME_VALUE_MISTRAL_AI
};
const OTEL_SERVICE_NAME = "mistralai_sdk";
const MISTRAL_SDK_OTEL_TRACER_NAME = `${OTEL_SERVICE_NAME}_tracer`;
const MISTRAL_AGENT_TRACE_PUBLIC_ATTRIBUTE = "agent.trace.public";
const getDebugTracing = () => {
	try {
		if (typeof globalThis !== "undefined" && "process" in globalThis) return globalThis.process?.env?.["MISTRAL_SDK_DEBUG_TRACING"]?.toLowerCase() === "true";
	} catch {}
	return false;
};
const MISTRAL_SDK_DEBUG_TRACING = getDebugTracing();
const DEBUG_HINT = "To see detailed tracing logs, set MISTRAL_SDK_DEBUG_TRACING=true.";
const MistralAIAttributes = {
	MISTRAL_AI_OCR_USAGE_PAGES_PROCESSED: "mistral_ai.ocr.usage.pages_processed",
	MISTRAL_AI_OCR_USAGE_DOC_SIZE_BYTES: "mistral_ai.ocr.usage.doc_size_bytes",
	MISTRAL_AI_ERROR_CODE: "mistral_ai.error.code"
};
const TracingErrors = {
	FAILED_TO_CREATE_SPAN_FOR_REQUEST: "Failed to create span for request.",
	FAILED_TO_ENRICH_SPAN_WITH_RESPONSE: "Failed to enrich span with response.",
	FAILED_TO_HANDLE_ERROR_IN_SPAN: "Failed to handle error in span.",
	FAILED_TO_END_SPAN: "Failed to end span."
};
function parseTimeToMillis(ts) {
	return new Date(ts).getTime();
}
function inferGenAiOperationName(operationId) {
	if (operationId.includes("chat_completion") || operationId === "stream_chat") return GEN_AI_OPERATION_NAME_VALUE_CHAT;
	if ((operationId.includes("agents_create") || operationId.includes("agents_update")) && !operationId.includes("alias")) return GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT;
	if (operationId.includes("agents_completion") || operationId === "stream_agents") return GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT;
	if (operationId.includes("conversations") && (operationId.includes("start") || operationId.includes("append") || operationId.includes("restart"))) return GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT;
	if (operationId.includes("fim")) return GEN_AI_OPERATION_NAME_VALUE_TEXT_COMPLETION;
	if (operationId.includes("embeddings")) return GEN_AI_OPERATION_NAME_VALUE_EMBEDDINGS;
	if (operationId.includes("ocr_post")) return GEN_AI_OPERATION_NAME_VALUE_GENERATE_CONTENT;
	return null;
}
function isKnownGenAiOperation(operationId) {
	return inferGenAiOperationName(operationId) !== null;
}
function isJsonContentType(contentType) {
	const mediaType = contentType?.split(";")[0]?.trim().toLowerCase();
	return mediaType === "application/json" || mediaType === "text/json" || mediaType?.endsWith("+json") === true;
}
function buildGenaiSpanName(genAiOp, body) {
	if (genAiOp === GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT || genAiOp === GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT) {
		const agentName = body["name"];
		return agentName ? `${genAiOp} ${agentName}` : genAiOp;
	}
	if (genAiOp === GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL) {
		const toolName = body["name"];
		return toolName ? `${genAiOp} ${toolName}` : genAiOp;
	}
	const model = body["model"];
	return model ? `${genAiOp} ${model}` : genAiOp;
}
function setAvailableAttributes(span, attributes) {
	for (const [key, value] of Object.entries(attributes)) if (value != null && value !== "") span.setAttribute(key, value);
}
function setMistralAgentTraceMarker(span) {
	span.setAttribute(MISTRAL_AGENT_TRACE_PUBLIC_ATTRIBUTE, "");
}
function setHttpAttributes(span, url, method, host) {
	let port = url.port ? parseInt(url.port, 10) : -1;
	if (port === -1) {
		if (url.protocol === "https:") port = 443;
		else if (url.protocol === "http:") port = 80;
	}
	span.setAttributes({
		[ATTR_HTTP_REQUEST_METHOD]: method,
		[ATTR_URL_FULL]: url.toString(),
		[ATTR_SERVER_ADDRESS]: host,
		[ATTR_SERVER_PORT]: port
	});
}
function enrichRequestGenaiAttrs(span, genAiOp, requestBody) {
	span.updateName(buildGenaiSpanName(genAiOp, requestBody));
	const attributes = {
		[ATTR_GEN_AI_REQUEST_CHOICE_COUNT]: requestBody["n"],
		[ATTR_GEN_AI_REQUEST_ENCODING_FORMATS]: requestBody["encoding_formats"],
		[ATTR_GEN_AI_REQUEST_FREQUENCY_PENALTY]: requestBody["frequency_penalty"],
		[ATTR_GEN_AI_REQUEST_MAX_TOKENS]: requestBody["max_tokens"],
		[ATTR_GEN_AI_REQUEST_MODEL]: requestBody["model"],
		[ATTR_GEN_AI_REQUEST_PRESENCE_PENALTY]: requestBody["presence_penalty"],
		[ATTR_GEN_AI_REQUEST_SEED]: requestBody["random_seed"],
		[ATTR_GEN_AI_REQUEST_STOP_SEQUENCES]: requestBody["stop"],
		[ATTR_GEN_AI_REQUEST_TEMPERATURE]: requestBody["temperature"],
		[ATTR_GEN_AI_REQUEST_TOP_P]: requestBody["top_p"],
		[ATTR_GEN_AI_REQUEST_TOP_K]: requestBody["top_k"]
	};
	const inputMessages = requestBody["messages"] || requestBody["inputs"];
	if (typeof inputMessages === "string") attributes[ATTR_GEN_AI_INPUT_MESSAGES] = JSON.stringify([formatInputMessage({
		role: "user",
		content: inputMessages
	})]);
	else if (Array.isArray(inputMessages)) attributes[ATTR_GEN_AI_INPUT_MESSAGES] = JSON.stringify(inputMessages.map((msg) => formatInputMessage(msg)));
	const tools = requestBody["tools"];
	if (tools) {
		const formattedTools = tools.map((tool) => formatToolDefinition(tool)).filter((t) => t !== null);
		if (formattedTools.length > 0) attributes[ATTR_GEN_AI_TOOL_DEFINITIONS] = JSON.stringify(formattedTools);
	}
	setAvailableAttributes(span, attributes);
}
function enrichSpanFromRequest(span, operationId, url, method, host, body) {
	setHttpAttributes(span, url, method, host);
	const genAiOp = inferGenAiOperationName(operationId);
	if (genAiOp === null) return span;
	span.setAttributes({
		[ATTR_GEN_AI_OPERATION_NAME]: genAiOp,
		[ATTR_GEN_AI_PROVIDER_NAME]: GEN_AI_PROVIDER_NAME_VALUE_MISTRAL_AI
	});
	if (body) try {
		enrichRequestGenaiAttrs(span, genAiOp, JSON.parse(body));
	} catch {}
	return span;
}
function enrichResponseGenaiAttrs(span, genAiOp, responseData) {
	const attributes = {};
	if (genAiOp !== GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT) attributes[ATTR_GEN_AI_RESPONSE_ID] = responseData["id"];
	attributes[ATTR_GEN_AI_RESPONSE_MODEL] = responseData["model"];
	const choices = responseData["choices"] || [];
	const finishReasons = choices.map((c) => c["finish_reason"]).filter((r) => !!r);
	if (finishReasons.length > 0) attributes[ATTR_GEN_AI_RESPONSE_FINISH_REASONS] = finishReasons;
	if (choices.length > 0) attributes[ATTR_GEN_AI_OUTPUT_MESSAGES] = JSON.stringify(choices.map((choice) => formatOutputMessage(choice)));
	const usage = responseData["usage"];
	if (usage) {
		attributes[ATTR_GEN_AI_USAGE_INPUT_TOKENS] = usage["prompt_tokens"] || 0;
		attributes[ATTR_GEN_AI_USAGE_OUTPUT_TOKENS] = usage["completion_tokens"] || 0;
		const cachedTokens = usage["prompt_tokens_details"]?.["cached_tokens"];
		if (typeof cachedTokens === "number" && cachedTokens > 0) attributes[ATTR_GEN_AI_USAGE_CACHE_READ_INPUT_TOKENS] = cachedTokens;
	}
	setAvailableAttributes(span, attributes);
}
function enrichCreateAgent(span, responseData) {
	setAvailableAttributes(span, {
		[ATTR_GEN_AI_AGENT_DESCRIPTION]: responseData["description"],
		[ATTR_GEN_AI_AGENT_ID]: responseData["id"],
		[ATTR_GEN_AI_AGENT_NAME]: responseData["name"],
		"gen_ai.agent.version": String(responseData["version"]),
		[ATTR_GEN_AI_REQUEST_MODEL]: responseData["model"],
		[ATTR_GEN_AI_SYSTEM_INSTRUCTIONS]: responseData["instructions"]
	});
}
function stringifyToolAttribute(value) {
	if (typeof value === "string") return value;
	if (value) return JSON.stringify(value);
	return null;
}
function createToolExecutionChildSpan(tracer, parentContext, output) {
	const startMs = parseTimeToMillis(output["created_at"]);
	const endMs = parseTimeToMillis(output["completed_at"]);
	const opName = GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL;
	const spanName = buildGenaiSpanName(opName, output);
	const childSpan = tracer.startSpan(spanName, { startTime: startMs }, parentContext);
	setMistralAgentTraceMarker(childSpan);
	const toolArguments = output["arguments"];
	const toolResult = output["info"];
	setAvailableAttributes(childSpan, {
		[ATTR_GEN_AI_OPERATION_NAME]: opName,
		[ATTR_GEN_AI_PROVIDER_NAME]: GEN_AI_PROVIDER_NAME_VALUE_MISTRAL_AI,
		[ATTR_GEN_AI_TOOL_CALL_ID]: output["id"],
		[ATTR_GEN_AI_TOOL_CALL_ARGUMENTS]: stringifyToolAttribute(toolArguments),
		[ATTR_GEN_AI_TOOL_CALL_RESULT]: stringifyToolAttribute(toolResult),
		[ATTR_GEN_AI_TOOL_NAME]: output["name"],
		[ATTR_GEN_AI_TOOL_TYPE]: "extension"
	});
	childSpan.end(endMs);
}
function createMessageOutputChildSpan(tracer, parentContext, output) {
	const startMs = parseTimeToMillis(output["created_at"]);
	const endMs = parseTimeToMillis(output["completed_at"]);
	const opName = GEN_AI_OPERATION_NAME_VALUE_CHAT;
	const spanName = buildGenaiSpanName(opName, output);
	const childSpan = tracer.startSpan(spanName, { startTime: startMs }, parentContext);
	setMistralAgentTraceMarker(childSpan);
	const choiceWrapper = {
		message: output,
		finish_reason: output["finish_reason"] || ""
	};
	setAvailableAttributes(childSpan, {
		[ATTR_GEN_AI_OPERATION_NAME]: opName,
		[ATTR_GEN_AI_PROVIDER_NAME]: GEN_AI_PROVIDER_NAME_VALUE_MISTRAL_AI,
		[ATTR_GEN_AI_RESPONSE_ID]: output["id"],
		[ATTR_GEN_AI_AGENT_ID]: output["agent_id"],
		[ATTR_GEN_AI_RESPONSE_MODEL]: output["model"],
		[ATTR_GEN_AI_OUTPUT_MESSAGES]: JSON.stringify([formatOutputMessage(choiceWrapper)])
	});
	childSpan.end(endMs);
}
function enrichInvokeAgent(tracer, span, responseData) {
	setAvailableAttributes(span, { [ATTR_GEN_AI_CONVERSATION_ID]: responseData["conversation_id"] });
	const outputs = responseData["outputs"] || [];
	const parentContext = trace.setSpan(context.active(), span);
	for (const output of outputs) {
		const outputType = output["type"];
		if (!outputType) continue;
		if (outputType === "function.call") continue;
		if (outputType === "tool.execution") createToolExecutionChildSpan(tracer, parentContext, output);
		else if (outputType === "message.output") createMessageOutputChildSpan(tracer, parentContext, output);
	}
}
function enrichOcr(span, responseData) {
	const usageInfo = responseData["usage_info"];
	if (!usageInfo) return;
	setAvailableAttributes(span, {
		[MistralAIAttributes.MISTRAL_AI_OCR_USAGE_PAGES_PROCESSED]: usageInfo["pages_processed"],
		[MistralAIAttributes.MISTRAL_AI_OCR_USAGE_DOC_SIZE_BYTES]: usageInfo["doc_size_bytes"]
	});
}
function enrichSpanFromResponse(tracer, span, operationId, responseData) {
	const genAiOp = inferGenAiOperationName(operationId);
	if (genAiOp === null) return;
	enrichResponseGenaiAttrs(span, genAiOp, responseData);
	if (genAiOp === GEN_AI_OPERATION_NAME_VALUE_CREATE_AGENT) enrichCreateAgent(span, responseData);
	else if (genAiOp === GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT) enrichInvokeAgent(tracer, span, responseData);
	if (operationId === "ocr_v1_ocr_post") enrichOcr(span, responseData);
}
/**
* Get a tracer from the registered or global TracerProvider.
*
* The SDK does not set up its own TracerProvider. It relies on the application
* to register one explicitly or configure OpenTelemetry's global provider.
*
* If no TracerProvider is configured, the ProxyTracerProvider (default) will
* return a NoOp tracer, effectively disabling tracing. Once the application
* sets up a real TracerProvider, subsequent spans will be recorded.
*/
function getOrCreateOtelTracer(provider, options = {}) {
	return (provider ?? (options.useRegisteredProvider === false ? void 0 : getRegisteredTracerProvider()) ?? trace.getTracerProvider()).getTracer(MISTRAL_SDK_OTEL_TRACER_NAME);
}
function getSpanContext(span) {
	return trace.setSpan(context.active(), span);
}
function runWithContext(context$1, fn) {
	return context.with(context$1, fn);
}
async function recordRequestError(context, error) {
	const span = trace.getSpan(context);
	if (span) await getResponseAndError(span, null, error);
}
function warn(error, details) {
	if (MISTRAL_SDK_DEBUG_TRACING) console.warn(error, details);
	else console.warn(error, DEBUG_HINT);
}
async function getTracedRequestAndSpan(tracer, operationId, request) {
	const span = tracer.startSpan(operationId);
	if (!span.isRecording()) return {
		request,
		span,
		body: null
	};
	try {
		setMistralAgentTraceMarker(span);
		const conversationId = propagation.getBaggage(context.active())?.getEntry(ATTR_GEN_AI_CONVERSATION_ID)?.value;
		if (conversationId) span.setAttribute(ATTR_GEN_AI_CONVERSATION_ID, conversationId);
		let body = null;
		if (request.body && isKnownGenAiOperation(operationId) && isJsonContentType(request.headers.get("content-type"))) try {
			body = await request.clone().text();
		} catch {}
		const headers = new Headers(request.headers);
		const headerCarrier = {};
		propagation.inject(trace.setSpan(context.active(), span), headerCarrier);
		for (const [key, value] of Object.entries(headerCarrier)) headers.set(key, value);
		const newRequest = new Request(request, { headers });
		const url = new URL(request.url);
		enrichSpanFromRequest(span, operationId, url, request.method, headers.get("host") || url.host, body);
		return {
			request: newRequest,
			span,
			body
		};
	} catch (err) {
		warn(TracingErrors.FAILED_TO_CREATE_SPAN_FOR_REQUEST, err);
		try {
			span.end();
		} catch {}
		return {
			request,
			span,
			body: null
		};
	}
}
async function getTracedResponse(tracer, span, operationId, response) {
	if (!span.isRecording()) return response;
	try {
		span.setStatus({ code: SpanStatusCode.OK });
		span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, response.status);
		const knownGenAiOperation = isKnownGenAiOperation(operationId);
		const responseContentType = response.headers.get("content-type");
		if (knownGenAiOperation && !response.bodyUsed && responseContentType?.toLowerCase().includes("text/event-stream") === true && response.body) return createTracedStreamResponse(response, span, tracer, operationId);
		if (knownGenAiOperation && !response.bodyUsed && isJsonContentType(responseContentType)) {
			const clonedResponse = response.clone();
			try {
				enrichSpanFromResponse(tracer, span, operationId, await clonedResponse.json());
			} catch {}
		}
		endSpan(span);
		return response;
	} catch (err) {
		warn(TracingErrors.FAILED_TO_ENRICH_SPAN_WITH_RESPONSE, err);
		endSpan(span);
		return response;
	}
}
function createTracedStreamResponse(response, span, tracer, operationId) {
	const originalBody = response.body;
	const chunks = [];
	const decoder = new TextDecoder();
	const reader = originalBody.getReader();
	let finalized = false;
	const finalize = () => {
		if (finalized) return;
		const remaining = decoder.decode();
		if (remaining) chunks.push(remaining);
		finalized = true;
		finalizeStreamSpan(chunks, span, tracer, operationId);
	};
	const tracedStream = new ReadableStream({
		async pull(controller) {
			try {
				const { done, value } = await reader.read();
				if (done) {
					finalize();
					controller.close();
					return;
				}
				chunks.push(decoder.decode(value, { stream: true }));
				controller.enqueue(value);
			} catch (err) {
				finalize();
				controller.error(err);
				try {
					await reader.cancel(err);
				} catch {}
			}
		},
		async cancel(reason) {
			finalize();
			await reader.cancel(reason);
		}
	}, { highWaterMark: 0 });
	return new Response(tracedStream, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function finalizeStreamSpan(chunks, span, tracer, operationId) {
	try {
		const parsedChunks = parseSseChunks(chunks.join(""));
		if (parsedChunks.length > 0) enrichSpanFromResponse(tracer, span, operationId, accumulateChunksToResponseDict(parsedChunks));
	} catch (err) {
		warn("Failed to enrich span with streaming response.", err);
	}
	endSpan(span);
}
async function getResponseAndError(span, response, error) {
	if (!span.isRecording()) return {
		response,
		error
	};
	try {
		if (error) {
			span.recordException(error);
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: String(error)
			});
		}
		if (!response) {
			endSpan(span);
			return {
				response,
				error
			};
		}
		try {
			const body = await response.clone().json();
			if (body["object"] === "error") {
				const errorMsg = body["message"] || "";
				const errorType = body["type"] || "";
				if (errorMsg) {
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: errorMsg
					});
					span.addEvent("exception", {
						"exception.type": errorType || "api_error",
						"exception.message": errorMsg
					});
					const attrs = { [ATTR_HTTP_RESPONSE_STATUS_CODE]: response.status };
					if (errorType) attrs[ATTR_ERROR_TYPE] = errorType;
					if (body["code"]) attrs[MistralAIAttributes.MISTRAL_AI_ERROR_CODE] = body["code"];
					setAvailableAttributes(span, attrs);
				}
			}
		} catch {}
		endSpan(span);
	} catch (err) {
		warn(TracingErrors.FAILED_TO_HANDLE_ERROR_IN_SPAN, err);
		try {
			span.end();
		} catch {}
	}
	return {
		response,
		error
	};
}
function endSpan(span) {
	try {
		span.end();
	} catch (err) {
		warn(TracingErrors.FAILED_TO_END_SPAN, err);
	}
}
/**
* Create a traced span using a callback pattern.
* This is the TypeScript equivalent of Python's context manager.
*/
async function traceAsync(name, fn) {
	const span = getOrCreateOtelTracer().startSpan(name);
	try {
		return await fn(span);
	} finally {
		span.end();
	}
}
export { MISTRAL_SDK_OTEL_TRACER_NAME, MistralAIAttributes, OTEL_SERVICE_NAME, TracingErrors, enrichSpanFromRequest, enrichSpanFromResponse, getOrCreateOtelTracer, getRegisteredTracerProvider, getResponseAndError, getSpanContext, getTracedRequestAndSpan, getTracedResponse, recordRequestError, registerTracerProvider, runWithContext, semConvAttributes, traceAsync };
