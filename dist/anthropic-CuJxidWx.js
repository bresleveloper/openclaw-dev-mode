import { d as supportsClaudeNativeMaxEffort, f as supportsClaudeNativeXhighEffort, l as resolveClaudeNativeThinkingLevelMap, u as supportsClaudeAdaptiveThinking } from "./src-M7TBQdDX.js";
import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { a as usesClaudeFable5MessagesContract, l as calculateCost, n as transformMessages, o as adjustMaxTokensForThinking, r as requiresClaudeAdaptiveThinking, s as buildBaseOptions, t as sanitizeSurrogates, u as clampThinkingLevel } from "./sanitize-unicode-DcA7E1vi.js";
import { n as getEnvApiKey } from "./env-api-keys-8q9bEA0v.js";
import { n as parseStreamingJson, t as parseJsonWithRepair } from "./json-parse-CydVzlvP.js";
import { a as stripSystemPromptCacheBoundary, i as splitSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { t as headersToRecord } from "./headers-CaXpIDsu.js";
import { a as resolveCacheRetention, i as resolveCloudflareBaseUrl, n as hasCopilotVisionInput, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-YQWBLrLa.js";
import { a as usesFoundryBearerAuth, i as omitFoundryBearerCredentialHeaders, n as reconcileAnthropicToolChoice, o as ANTHROPIC_OMITTED_REASONING_TEXT, r as resolveOriginalAnthropicToolName, s as findActiveAnthropicToolTurnAssistantIndex, t as projectAnthropicTools } from "./anthropic-tool-projection-koHqMbd3.js";
import { i as applyAnthropicRefusal, r as createDeferredEventBuffer, t as notifyLlmRequestActivity } from "./llm-request-activity-wsKalIGX.js";
import Anthropic from "@anthropic-ai/sdk";
//#region src/llm/providers/anthropic.ts
const ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
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
function convertContentBlocks(content) {
	if (!content.some((c) => c.type === "image")) return sanitizeSurrogates(content.map((c) => c.text).join("\n"));
	const blocks = content.map((block) => {
		if (block.type === "text") return {
			type: "text",
			text: sanitizeSurrogates(block.text)
		};
		return {
			type: "image",
			source: {
				type: "base64",
				media_type: block.mimeType,
				data: block.data
			}
		};
	});
	if (!blocks.some((b) => b.type === "text")) blocks.unshift({
		type: "text",
		text: "(see attached image)"
	});
	return blocks;
}
const FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
const INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14";
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
const ANTHROPIC_MESSAGE_EVENTS = new Set([
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
		const refusalBuffer = usesClaudeFable5MessagesContract(model) ? createDeferredEventBuffer(stream, () => notifyLlmRequestActivity(options?.signal)) : void 0;
		const eventSink = refusalBuffer ?? stream;
		try {
			let client;
			let isOAuth;
			if (options?.client) {
				client = options.client;
				isOAuth = false;
			} else {
				const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";
				let copilotDynamicHeaders;
				if (model.provider === "github-copilot") {
					const hasImages = hasCopilotVisionInput(context.messages);
					copilotDynamicHeaders = buildCopilotDynamicHeaders({
						messages: context.messages,
						hasImages
					});
				}
				const cacheSessionId = (options?.cacheRetention ?? resolveCacheRetention()) === "none" ? void 0 : options?.sessionId;
				const created = createClient(model, apiKey, options?.interleavedThinking ?? true, shouldUseFineGrainedToolStreamingBeta(model, context), options?.headers, copilotDynamicHeaders, cacheSessionId);
				client = created.client;
				isOAuth = created.isOAuthToken;
			}
			const builtParams = buildParams(model, context, isOAuth, options);
			let params = builtParams.params;
			const toolProjection = builtParams.toolProjection;
			const nextParams = await options?.onPayload?.(params, model);
			if (nextParams !== void 0) params = nextParams;
			const requestOptions = {
				...options?.signal ? { signal: options.signal } : {},
				...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
				...options?.maxRetries !== void 0 ? { maxRetries: options.maxRetries } : {}
			};
			const response = await client.messages.create({
				...params,
				stream: true
			}, requestOptions).asResponse();
			await options?.onResponse?.({
				status: response.status,
				headers: headersToRecord(response.headers)
			}, model);
			const blocks = output.content;
			const blockIndexes = /* @__PURE__ */ new Map();
			for await (const event of iterateAnthropicEvents(response, options?.signal, refusalBuffer !== void 0)) if (event.type === "message_start") {
				output.responseId = event.message.id;
				output.responseModel = event.message.model;
				output.usage.input = event.message.usage.input_tokens || 0;
				output.usage.output = event.message.usage.output_tokens || 0;
				output.usage.cacheRead = event.message.usage.cache_read_input_tokens || 0;
				output.usage.cacheWrite = event.message.usage.cache_creation_input_tokens || 0;
				output.usage.totalTokens = output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
				calculateCost(model, output.usage);
				eventSink.push({
					type: "start",
					partial: output
				});
			} else if (event.type === "content_block_start") {
				if (event.content_block.type === "text") {
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
				if (event.usage.input_tokens != null) output.usage.input = event.usage.input_tokens;
				if (event.usage.output_tokens != null) output.usage.output = event.usage.output_tokens;
				if (event.usage.cache_read_input_tokens != null) output.usage.cacheRead = event.usage.cache_read_input_tokens;
				if (event.usage.cache_creation_input_tokens != null) output.usage.cacheWrite = event.usage.cache_creation_input_tokens;
				output.usage.totalTokens = output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
				calculateCost(model, output.usage);
			}
			if (options?.signal?.aborted) throw new Error("Request was aborted");
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
			output.stopReason = options?.signal?.aborted ? "aborted" : "error";
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
function normalizeAnthropicToolChoice(model, toolChoice) {
	if (requiresClaudeAdaptiveThinking(model) && (toolChoice === "any" || typeof toolChoice === "object" && toolChoice.type === "tool")) return { type: "auto" };
	return typeof toolChoice === "string" ? { type: toolChoice } : toolChoice;
}
/**
* Check if a model supports adaptive thinking (Fable 5, Opus 4.6+, Sonnet 4.6).
*/
function supportsAdaptiveThinking(model) {
	return supportsClaudeAdaptiveThinking(model);
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
	const base = buildBaseOptions(model, options, apiKey);
	if (!options?.reasoning) {
		const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
		return streamAnthropic(model, context, {
			...base,
			thinkingEnabled: mandatoryAdaptiveThinking,
			...mandatoryAdaptiveThinking ? { effort: "high" } : {}
		});
	}
	if (supportsAdaptiveThinking(model)) {
		const effort = mapThinkingLevelToEffort(model, options.reasoning);
		return streamAnthropic(model, context, {
			...base,
			thinkingEnabled: true,
			effort
		});
	}
	const adjusted = adjustMaxTokensForThinking(base.maxTokens, model.maxTokens, options.reasoning, options.thinkingBudgets);
	return streamAnthropic(model, context, {
		...base,
		maxTokens: adjusted.maxTokens,
		thinkingEnabled: true,
		thinkingBudgetTokens: adjusted.thinkingBudget
	});
};
function isOAuthToken(apiKey) {
	return apiKey.includes("sk-ant-oat");
}
function createClient(model, apiKey, interleavedThinking, useFineGrainedToolStreamingBeta, optionsHeaders, dynamicHeaders, sessionId) {
	const needsInterleavedBeta = interleavedThinking && !supportsAdaptiveThinking(model);
	const betaFeatures = [];
	if (useFineGrainedToolStreamingBeta) betaFeatures.push(FINE_GRAINED_TOOL_STREAMING_BETA);
	if (needsInterleavedBeta) betaFeatures.push(INTERLEAVED_THINKING_BETA);
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
			}, model.headers, optionsHeaders)
		}),
		isOAuthToken: false
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
			}, model.headers, dynamicHeaders, optionsHeaders)
		}),
		isOAuthToken: false
	};
	if (usesFoundryBearerAuth(model)) return {
		client: new Anthropic({
			apiKey: null,
			authToken: apiKey,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, omitFoundryBearerCredentialHeaders(model.headers), dynamicHeaders, optionsHeaders)
		}),
		isOAuthToken: false
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
			}, model.headers, optionsHeaders)
		}),
		isOAuthToken: true
	};
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
			}, sessionAffinityHeaders, model.headers, optionsHeaders)
		}),
		isOAuthToken: false
	};
}
function buildParams(model, context, isOAuthTokenResult, options) {
	const fable5 = usesClaudeFable5MessagesContract(model);
	const replayThinkingEnabled = fable5 || options?.thinkingEnabled === true;
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
	if (options?.temperature !== void 0 && !options?.thinkingEnabled && !supportsNativeXhighEffort(model)) params.temperature = options.temperature;
	if (options?.stop !== void 0 && options.stop.length > 0) params.stop_sequences = options.stop;
	if (tools && tools.length > 0) params.tools = tools;
	if (fable5 || model.reasoning || supportsAdaptiveThinking(model)) {
		if (fable5 || options?.thinkingEnabled) {
			const display = options?.thinkingDisplay ?? "summarized";
			if (supportsAdaptiveThinking(model)) {
				params.thinking = {
					type: "adaptive",
					display
				};
				const effort = options?.effort ?? (fable5 ? "high" : void 0);
				if (effort) params.output_config = effort === "xhigh" ? { effort } : { effort };
			} else params.thinking = {
				type: "enabled",
				budget_tokens: options?.thinkingBudgetTokens || 1024,
				display
			};
		} else if (options?.thinkingEnabled === false) params.thinking = { type: "disabled" };
	}
	if (options?.metadata) {
		const userId = options.metadata.user_id;
		if (typeof userId === "string") params.metadata = { user_id: userId };
	}
	if (options?.toolChoice) {
		const normalizedToolChoice = normalizeAnthropicToolChoice(model, options.toolChoice);
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
	const transformedMessages = transformMessages(messages, model, normalizeToolCallId);
	const activeToolTurnAssistantIndex = replayThinkingEnabled ? -1 : findActiveAnthropicToolTurnAssistantIndex(transformedMessages);
	for (let i = 0; i < transformedMessages.length; i++) {
		const msg = transformedMessages[i];
		if (msg.role === "user") if (typeof msg.content === "string") {
			if (msg.content.trim().length > 0) params.push({
				role: "user",
				content: sanitizeSurrogates(msg.content)
			});
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
			params.push({
				role: "user",
				content: filteredBlocks
			});
		}
		else if (msg.role === "assistant") {
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
				content: convertContentBlocks(msg.content),
				is_error: msg.isError
			});
			let j = i + 1;
			while (j < transformedMessages.length && transformedMessages[j].role === "toolResult") {
				const nextMsg = transformedMessages[j];
				toolResults.push({
					type: "tool_result",
					tool_use_id: nextMsg.toolCallId,
					content: convertContentBlocks(nextMsg.content),
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
			if (message.role !== "user") continue;
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
	if (isOAuthTokenResult) blocks.push({
		type: "text",
		text: "You are Claude Code, Anthropic's official CLI for Claude.",
		...cacheControl ? { cache_control: cacheControl } : {}
	});
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
export { streamAnthropic, streamSimpleAnthropic };
