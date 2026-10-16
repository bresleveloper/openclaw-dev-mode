import { t as AssistantMessageEventStream } from "./event-stream-C5AbCAaZ.mjs";
import { a as asRecord, i as asOptionalRecord, s as readStringField } from "./record-coerce-CNDovvft.mjs";
import { O as calculateCost, a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { t as buildGuardedModelFetch } from "./host-policy-BwhNNGQR.mjs";
import { P as sanitizeSurrogates, b as transportAbortError, c as failTransportStream, g as parseTerminalToolCallArguments, h as notifyProviderStreamOpened, m as notifyProviderHttpResponse, w as parseJsonPreservingUnsafeIntegers } from "./transport-stream-shared-CCR7hSW0.mjs";
import { C as stripSystemPromptCacheBoundary, n as buildBaseOptions } from "./simple-options-7QuSKriJ.mjs";
import { n as getEnvApiKey } from "./env-api-keys-CyX4VKGO.mjs";
import { n as transformProviderMessages, t as createAssistantOutput } from "./assistant-output-D5762GPH.mjs";
import { n as buildGoogleInteractionsSimpleThinking } from "./google-shared-V8jogVPq.mjs";
import { createRequire } from "node:module";
//#region packages/ai/src/providers/google-interactions-request.ts
const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com";
let packageVersionMemo;
function resolvePackageVersion() {
	if (packageVersionMemo) return packageVersionMemo;
	if (typeof process !== "undefined" && process.env?.OPENCLAW_VERSION) {
		packageVersionMemo = process.env.OPENCLAW_VERSION;
		return packageVersionMemo;
	}
	try {
		const require = createRequire(import.meta.url);
		for (const candidate of [
			"../package.json",
			"../../package.json",
			"../../../package.json",
			"../../../../package.json"
		]) try {
			const parsed = asRecord(require(candidate));
			const name = readStringField(parsed, "name");
			const version = readStringField(parsed, "version");
			if (version && (name === "openclaw" || name === "@openclaw/ai")) {
				packageVersionMemo = version;
				return packageVersionMemo;
			}
		} catch {}
	} catch {}
	packageVersionMemo = "0.0";
	return packageVersionMemo;
}
function resolveGoogleApiClientHeaders(params) {
	const hostHeaders = getAiTransportHost().resolveProviderRequestHeaders({
		provider: "google",
		api: params?.api ?? params?.model?.api ?? "google-generative-ai",
		baseUrl: params?.baseUrl ?? DEFAULT_GOOGLE_API_BASE_URL,
		model: params?.model
	});
	if (hostHeaders?.["x-goog-api-client"]) return hostHeaders;
	return {
		...hostHeaders,
		"x-goog-api-client": `openclaw/${resolvePackageVersion()}`
	};
}
function convertToolResultContent(content) {
	if (!Array.isArray(content)) return content;
	return content.map((item) => {
		if (item.type === "image") return {
			type: "image",
			mime_type: item.mimeType,
			data: item.data
		};
		if (item.type === "text") return {
			type: "text",
			text: sanitizeSurrogates(item.text)
		};
		return item;
	});
}
function convertMessages(model, context) {
	const steps = [];
	const messages = transformProviderMessages(context.messages, model);
	for (const message of messages) {
		if (message.role === "user") {
			const sourceContent = message.content;
			const content = (typeof sourceContent === "string" ? [{
				type: "text",
				text: sourceContent
			}] : sourceContent).map((item) => item.type === "text" ? {
				type: "text",
				text: sanitizeSurrogates(item.text) || " "
			} : {
				type: "image",
				mime_type: item.mimeType,
				data: item.data
			});
			steps.push({
				type: "user_input",
				content: content.length > 0 ? content : [{
					type: "text",
					text: " "
				}]
			});
			continue;
		}
		if (message.role === "toolResult") {
			steps.push({
				type: "function_result",
				call_id: message.toolCallId,
				name: message.toolName || "tool",
				result: convertToolResultContent(message.content),
				is_error: message.isError
			});
			continue;
		}
		if (message.stopReason === "error") continue;
		if (message.content.length === 1 && message.content[0]?.type === "text" && message.content[0].text.includes("[assistant turn failed before producing content]")) continue;
		let pendingText = [];
		const flushText = () => {
			if (pendingText.length === 0) return;
			steps.push({
				type: "model_output",
				content: [{
					type: "text",
					text: pendingText.join("\n\n")
				}]
			});
			pendingText = [];
		};
		for (const block of message.content) {
			if (block.type === "thinking") {
				flushText();
				if (block.thinkingSignature) steps.push({
					type: "thought",
					signature: block.thinkingSignature,
					...block.thinking.trim() ? { summary: [{
						type: "text",
						text: sanitizeSurrogates(block.thinking)
					}] } : {}
				});
				continue;
			}
			if (block.type === "text") {
				if (block.text.trim()) pendingText.push(sanitizeSurrogates(block.text));
				continue;
			}
			flushText();
			if (block.thoughtSignature && block.thoughtSignature !== "skip_thought_signature_validator" && !message.content.some((candidate) => candidate.type === "thinking")) steps.push({
				type: "thought",
				signature: block.thoughtSignature
			});
			steps.push({
				type: "function_call",
				id: block.id,
				name: block.name,
				arguments: block.arguments ?? {}
			});
		}
		flushText();
	}
	return steps;
}
function buildGoogleInteractionsParams(model, context, options = {}) {
	const optionRecord = asRecord(options);
	if (optionRecord.cachedContent || optionRecord.cached_content) throw new Error("Explicit prompt caching ('cachedContent') is not supported with the Gemini Interactions API. The Interactions API handles caching implicitly on the server.");
	if (optionRecord.videoMetadata || optionRecord.video_metadata) throw new Error("video_metadata clipping offsets are not supported with the Gemini Interactions API.");
	const generationConfig = {};
	if (options.temperature !== void 0) generationConfig.temperature = options.temperature;
	if (options.maxTokens !== void 0) generationConfig.max_output_tokens = options.maxTokens;
	if (options.stop && options.stop.length > 0) generationConfig.stop_sequences = options.stop;
	if (options.thinking) {
		generationConfig.thinking_summaries = options.thinking.enabled ? "auto" : "none";
		const thinkingLevel = options.thinking.level ?? (options.thinking.enabled ? void 0 : buildGoogleInteractionsSimpleThinking(model, { reasoning: "off" }).level);
		if (thinkingLevel) generationConfig.thinking_level = thinkingLevel.toLowerCase();
	}
	if (options.toolChoice) generationConfig.tool_choice = options.toolChoice;
	const tools = context.tools?.map((tool) => ({
		type: "function",
		name: tool.name,
		description: tool.description || "",
		parameters: asRecord(tool.parameters)
	}));
	return {
		model: model.id,
		input: convertMessages(model, context),
		...context.systemPrompt ? { system_instruction: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt)) } : {},
		...tools && tools.length > 0 ? { tools } : {},
		...Object.keys(generationConfig).length > 0 ? { generation_config: generationConfig } : {},
		store: false,
		stream: true
	};
}
//#endregion
//#region packages/ai/src/providers/google-interactions-shared.ts
/**
* Gemini Interactions API adapter and lifecycle for OpenClaw.
* POST /v1beta/interactions
*/
function resolveGoogleInteractionsApiKey(model, options, apiKey) {
	return apiKey || options?.apiKey || getEnvApiKey(model.provider) || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
}
function logGoogleInteractionsDebug(message, data) {
	getAiTransportHost().logDebug("google-interactions", () => ({
		message,
		data
	}));
}
function joinTextParts(value) {
	return Array.isArray(value) ? value.map((content) => readStringField(asOptionalRecord(content), "text") ?? "").join("") : "";
}
function isGoogleInteractionsRequestBody(value) {
	const record = asOptionalRecord(value);
	if (!record) return false;
	return typeof record.model === "string" && Array.isArray(record.input) && typeof record.store === "boolean" && typeof record.stream === "boolean";
}
async function runGoogleInteractionsLifecycle(params) {
	const { stream, model, output, options, context, nextToolCallId } = params;
	let reader;
	try {
		const host = getAiTransportHost();
		const unresolvedApiKey = resolveGoogleInteractionsApiKey(model, options, params.apiKey);
		const apiKey = host.resolveSecretSentinel(unresolvedApiKey);
		if (!apiKey.trim()) throw new Error(`No API key for provider: ${model.provider}`);
		let body = buildGoogleInteractionsParams(model, context, options);
		const nextBody = await options?.onPayload?.(body, model);
		if (nextBody !== void 0) {
			if (!isGoogleInteractionsRequestBody(nextBody)) throw new Error("Google Interactions onPayload returned an invalid request body");
			body = nextBody;
		}
		let baseUrl = (model.baseUrl || "https://generativelanguage.googleapis.com/v1beta").trim().replace(/\/+$/, "");
		if (/^https:\/\/generativelanguage\.googleapis\.com$/i.test(baseUrl)) baseUrl = "https://generativelanguage.googleapis.com/v1beta";
		const url = `${baseUrl}/interactions?alt=sse`;
		const googleClientHeaders = resolveGoogleApiClientHeaders({
			baseUrl,
			api: "google-generative-ai",
			model
		});
		const headers = resolveAiTransportHeaderSentinels({
			"Content-Type": "application/json",
			"x-goog-api-key": apiKey,
			"Api-Revision": "2026-05-20",
			...googleClientHeaders,
			...model.headers,
			...options?.headers
		}) ?? {
			"Content-Type": "application/json",
			"x-goog-api-key": apiKey
		};
		logGoogleInteractionsDebug("request", {
			method: "POST",
			url,
			model: model.id,
			inputSteps: body.input.length,
			tools: body.tools?.length ?? 0
		});
		const response = await buildGuardedModelFetch({
			...model,
			baseUrl
		}, options?.timeoutMs, { sanitizeSse: true })(url, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
			signal: options?.signal
		});
		await notifyProviderHttpResponse({
			options,
			response,
			model
		});
		logGoogleInteractionsDebug("response", {
			status: response.status,
			statusText: response.statusText
		});
		if (!response.ok) {
			const errorText = await response.text();
			logGoogleInteractionsDebug("request failed", { status: response.status });
			throw new Error(`Google Interactions API error HTTP ${response.status}: ${errorText}`);
		}
		if (!response.body) throw new Error("Google Interactions API returned empty response body");
		reader = response.body.getReader();
		await notifyProviderStreamOpened({
			options,
			cancelStream: () => reader?.cancel()
		});
		stream.push({
			type: "start",
			partial: output
		});
		const decoder = new TextDecoder();
		let buffer = "";
		let currentBlockType = null;
		let currentBlockIndex = -1;
		let currentToolCall = null;
		let currentToolArgs = "";
		let latestThoughtSignature;
		let latestUsage;
		const endCurrentBlock = () => {
			if (currentBlockType === "text") {
				const block = output.content[currentBlockIndex];
				const textBlock = block?.type === "text" ? block : void 0;
				stream.push({
					type: "text_end",
					contentIndex: currentBlockIndex,
					content: textBlock?.text ?? "",
					partial: output
				});
			} else if (currentBlockType === "thinking") {
				const block = output.content[currentBlockIndex];
				const thinkingBlock = block?.type === "thinking" ? block : void 0;
				if (thinkingBlock && !thinkingBlock.thinkingSignature && latestThoughtSignature) thinkingBlock.thinkingSignature = latestThoughtSignature;
				stream.push({
					type: "thinking_end",
					contentIndex: currentBlockIndex,
					content: thinkingBlock?.thinking ?? "",
					partial: output
				});
				latestThoughtSignature = void 0;
			} else if (currentBlockType === "toolCall" && currentToolCall) {
				if (currentToolArgs.trim()) currentToolCall.arguments = parseTerminalToolCallArguments(currentToolArgs);
				stream.push({
					type: "toolcall_end",
					contentIndex: currentBlockIndex,
					toolCall: currentToolCall,
					partial: output
				});
				currentToolCall = null;
				currentToolArgs = "";
			}
			currentBlockType = null;
		};
		const startTextBlock = (type, text = "") => {
			endCurrentBlock();
			currentBlockIndex = output.content.length;
			output.content.push(type === "text" ? {
				type,
				text
			} : {
				type,
				thinking: text,
				...latestThoughtSignature ? { thinkingSignature: latestThoughtSignature } : {}
			});
			stream.push({
				type: type === "text" ? "text_start" : "thinking_start",
				contentIndex: currentBlockIndex,
				partial: output
			});
			if (text) stream.push({
				type: type === "text" ? "text_delta" : "thinking_delta",
				contentIndex: currentBlockIndex,
				delta: text,
				partial: output
			});
			return type;
		};
		const appendTextDelta = (type, text) => {
			if (!text) return;
			if (currentBlockType !== type) currentBlockType = startTextBlock(type);
			const block = output.content[currentBlockIndex];
			if (type === "text") {
				if (block?.type !== "text") throw new Error("Google Interactions text delta has no active text block");
				block.text += text;
			} else {
				if (block?.type !== "thinking") throw new Error("Google Interactions thought delta has no active thought block");
				block.thinking += text;
			}
			stream.push({
				type: type === "text" ? "text_delta" : "thinking_delta",
				contentIndex: currentBlockIndex,
				delta: text,
				partial: output
			});
		};
		const startToolCallBlock = (source, args = {}) => {
			endCurrentBlock();
			currentBlockIndex = output.content.length;
			const name = readStringField(source, "name") ?? "tool";
			const toolCall = {
				type: "toolCall",
				id: readStringField(source, "id") ?? nextToolCallId(name),
				name,
				arguments: args
			};
			currentToolArgs = Object.keys(args).length > 0 ? JSON.stringify(args) : "";
			output.content.push(toolCall);
			stream.push({
				type: "toolcall_start",
				contentIndex: currentBlockIndex,
				partial: output
			});
			return toolCall;
		};
		let streamDone = false;
		let sawCompletion = false;
		while (!streamDone) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed || !trimmed.startsWith("data:")) continue;
				const dataStr = trimmed.slice(5).trim();
				if (dataStr === "[DONE]") {
					streamDone = true;
					break;
				}
				let event;
				try {
					event = asRecord(parseJsonPreservingUnsafeIntegers(dataStr));
				} catch {
					continue;
				}
				const eventType = event.event_type || event.type;
				logGoogleInteractionsDebug("stream event", { eventType: typeof eventType === "string" ? eventType : "unknown" });
				if (eventType === "error") {
					const providerError = asOptionalRecord(event.error);
					const message = readStringField(providerError, "message") ?? "Google Interactions stream failed";
					throw Object.assign(new Error(message), {
						code: readStringField(providerError, "code"),
						type: "google_interactions_stream_error"
					});
				} else if (eventType === "step.delta") {
					const delta = asOptionalRecord(event.delta);
					const deltaType = delta?.type;
					if (deltaType === "text") appendTextDelta("text", readStringField(delta, "text") ?? "");
					else if (deltaType === "thought" || deltaType === "thought_summary" || deltaType === "raw_thought") {
						let thinkingText = "";
						if (typeof delta?.text === "string") thinkingText = delta.text;
						else if (typeof delta?.content === "string") thinkingText = delta.content;
						else if (Array.isArray(delta?.content)) thinkingText = joinTextParts(delta.content);
						else thinkingText = readStringField(asOptionalRecord(delta?.content), "text") ?? "";
						appendTextDelta("thinking", thinkingText);
					} else if (deltaType === "thought_signature" || delta && typeof delta.signature === "string" && !delta.text) {
						const signature = readStringField(delta, "signature") ?? "";
						if (signature) {
							latestThoughtSignature = signature;
							if (currentBlockType === "thinking") {
								const block = output.content[currentBlockIndex];
								if (block?.type === "thinking") block.thinkingSignature = signature;
							} else {
								const lastThinking = output.content.findLast((block) => block.type === "thinking");
								if (lastThinking && !lastThinking.thinkingSignature) lastThinking.thinkingSignature = signature;
								else if (!lastThinking) output.content.push({
									type: "thinking",
									thinking: "",
									thinkingSignature: signature
								});
							}
						}
					} else if (deltaType === "arguments" || deltaType === "arguments_delta") {
						const argText = readStringField(delta, "arguments") ?? readStringField(delta, "text") ?? "";
						if (currentBlockType !== "toolCall") {
							currentToolCall = startToolCallBlock(delta);
							currentBlockType = "toolCall";
						}
						const streamedToolName = readStringField(delta, "name");
						if (streamedToolName && currentToolCall && (!currentToolCall.name || currentToolCall.name === "tool")) currentToolCall.name = streamedToolName;
						const streamedToolCallId = readStringField(delta, "id");
						if (streamedToolCallId && currentToolCall) currentToolCall.id = streamedToolCallId;
						currentToolArgs += argText;
						stream.push({
							type: "toolcall_delta",
							contentIndex: currentBlockIndex,
							delta: argText,
							partial: output
						});
					}
				} else if (eventType === "step.start") {
					const step = asOptionalRecord(event.step);
					if (step?.type === "thought") {
						const stepSignature = readStringField(step, "signature");
						if (stepSignature) latestThoughtSignature = stepSignature;
						const initialThinking = joinTextParts(step.summary);
						if (currentBlockType !== "thinking") currentBlockType = startTextBlock("thinking", initialThinking);
					} else if (step?.type === "model_output") currentBlockType = startTextBlock("text", joinTextParts(step.content));
					else if (step?.type === "function_call") {
						currentToolCall = startToolCallBlock(step, asRecord(step.arguments));
						currentBlockType = "toolCall";
					}
				} else if (eventType === "step.stop") {
					latestUsage = asOptionalRecord(event.usage) ?? latestUsage;
					endCurrentBlock();
				} else if (eventType === "interaction.completed" || eventType === "interaction.complete") {
					sawCompletion = true;
					const interaction = asOptionalRecord(event.interaction) ?? event;
					const usage = asOptionalRecord(interaction.usage) ?? latestUsage ?? {};
					const promptTokens = Number(usage.total_input_tokens ?? 0);
					const cacheRead = Number(usage.total_cached_tokens ?? 0);
					const candidatesTokens = Number(usage.total_output_tokens ?? 0);
					const thoughtTokens = Number(usage.total_thought_tokens ?? 0);
					const toolUseTokens = Number(usage.total_tool_use_tokens ?? 0);
					const outputTokens = candidatesTokens + thoughtTokens;
					const totalTokens = Number(usage.total_tokens ?? promptTokens + outputTokens + toolUseTokens);
					output.usage = {
						input: Math.max(0, promptTokens - cacheRead) + toolUseTokens,
						output: outputTokens,
						cacheRead,
						cacheWrite: 0,
						cacheTelemetry: { state: "available" },
						totalTokens,
						cost: {
							input: 0,
							output: 0,
							cacheRead: 0,
							cacheWrite: 0,
							total: 0
						}
					};
					if (model.cost) calculateCost(model, output.usage);
					const status = typeof interaction.status === "string" ? interaction.status : "completed";
					if (status === "failed" || status === "cancelled" || status === "budget_exceeded") throw new Error(`Google Interactions API completed with status: ${status}`);
					if (status === "incomplete") output.stopReason = "length";
					else output.stopReason = output.content.some((b) => b.type === "toolCall") ? "toolUse" : "stop";
				}
			}
		}
		endCurrentBlock();
		if (!sawCompletion) throw Object.assign(/* @__PURE__ */ new Error("Google Interactions stream ended before a terminal event"), {
			code: "STREAM_INCOMPLETE",
			type: "google_incomplete_stream"
		});
		if (latestThoughtSignature) {
			for (const block of output.content) if (block.type === "thinking" && !block.thinkingSignature) block.thinkingSignature = latestThoughtSignature;
		}
		if (!output.stopReason) output.stopReason = output.content.some((b) => b.type === "toolCall") ? "toolUse" : "stop";
		if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error("An unknown error occurred");
		stream.push({
			type: "done",
			reason: output.stopReason,
			message: output
		});
		stream.end();
	} catch (error) {
		const failure = options?.signal?.aborted ? transportAbortError(options.signal) : error;
		failTransportStream({
			stream,
			output,
			signal: options?.signal,
			error: failure
		});
	} finally {
		if (reader) {
			const cancellation = reader.cancel().catch(() => void 0);
			reader.releaseLock();
			getAiTransportHost().observePendingProviderWork?.(cancellation);
		}
	}
}
//#endregion
//#region packages/ai/src/providers/google-interactions.ts
let toolCallCounter = 0;
const streamGoogleInteractions = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	runGoogleInteractionsLifecycle({
		stream,
		model,
		output: createAssistantOutput(model, "google-interactions"),
		options,
		context,
		nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter}`,
		apiKey: resolveGoogleInteractionsApiKey(model, options)
	});
	return stream;
};
const streamSimpleGoogleInteractions = (model, context, options) => {
	const apiKey = resolveGoogleInteractionsApiKey(model, options);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	return streamGoogleInteractions(model, context, {
		...base,
		thinking: buildGoogleInteractionsSimpleThinking(model, options)
	});
};
//#endregion
export { streamGoogleInteractions, streamSimpleGoogleInteractions };
