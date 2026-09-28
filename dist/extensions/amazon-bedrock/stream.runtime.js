import { resolveBedrockCachePoint, resolveBedrockPromptCachePolicy } from "./bedrock-options.js";
import { resolveBedrockClaudeThinkingProfile, supportsBedrockNativeMaxEffort } from "./thinking-policy.js";
import { bindsClaudeThinkingPrefix, requiresClaudeMandatoryAdaptiveThinking, resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity, supportsClaudeAdaptiveThinking, supportsClaudeNativeXhighEffort } from "openclaw/plugin-sdk/provider-model-shared";
import { applyAnthropicRefusal, createDeferredEventBuffer, notifyLlmRequestActivity } from "openclaw/plugin-sdk/provider-stream-shared";
import { describeToolResultMediaPlaceholder, failTransportStream, finalizeTerminalToolCallArguments, notifyProviderHttpMetadata, splitSystemPromptCacheBoundary, stripSystemPromptCacheBoundary } from "openclaw/plugin-sdk/provider-transport-runtime";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { BedrockRuntimeClient, BedrockRuntimeServiceException, CacheTTL, ConversationRole, ConverseStreamCommand, ImageFormat, StopReason, ToolResultStatus } from "@aws-sdk/client-bedrock-runtime";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { AssistantMessageEventStream, adjustMaxTokensForThinking, buildBaseOptions, calculateCost, clampReasoning, createHttpProxyAgentsForTarget, createToolArgumentPreviewSchedule, parseStreamingJson, sanitizeSurrogates, transformMessages } from "openclaw/plugin-sdk/llm";
import { canonicalizeBase64 } from "openclaw/plugin-sdk/media-runtime";
//#region extensions/amazon-bedrock/stream.runtime.ts
/**
* Amazon Bedrock Converse streaming runtime. It maps OpenClaw messages/tools,
* thinking, cache points, images, and usage into Bedrock Converse Stream calls.
*/
function usesClaudeFable5BedrockContract(model) {
	return resolveClaudeFable5ModelIdentity(model) !== void 0;
}
function usesClaudeOpus5BedrockContract(model) {
	return resolveClaudeOpus5ModelIdentity(model) !== void 0;
}
function usesClaudeSonnet5BedrockContract(model) {
	return resolveClaudeSonnet5ModelIdentity(model) !== void 0;
}
function usesClaudeStreamingRefusalBedrockContract(model) {
	return usesClaudeFable5BedrockContract(model) || resolveClaudeMythos5ModelIdentity(model) !== void 0 || usesClaudeOpus5BedrockContract(model) || usesClaudeSonnet5BedrockContract(model);
}
function readBedrockStopDetails(fields) {
	if (!fields || typeof fields !== "object" || Array.isArray(fields)) return;
	const record = fields;
	return record.stop_details ?? record.stopDetails;
}
function normalizeAdaptiveClaudeToolChoice(toolChoice) {
	if (toolChoice === "any" || typeof toolChoice === "object" && toolChoice?.type === "tool") return "auto";
	return toolChoice;
}
const OPENCLAW_FALLBACK_MODEL_MAX_TOKENS = /* @__PURE__ */ new Set([
	4096,
	8192,
	16384
]);
function resolveAdaptiveBedrockMaxTokens(model, baseMaxTokens) {
	if (baseMaxTokens !== void 0) return baseMaxTokens;
	return OPENCLAW_FALLBACK_MODEL_MAX_TOKENS.has(model.maxTokens) ? void 0 : model.maxTokens;
}
/** Stream a Bedrock Converse request using Bedrock-specific options. */
const streamBedrock = (model, context, options = {}) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = {
			role: "assistant",
			content: [],
			api: "bedrock-converse-stream",
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
		const blocks = output.content;
		const pendingToolCallEnds = [];
		const toolArgumentPreviewSchedules = /* @__PURE__ */ new WeakMap();
		const redactedReasoningChunks = /* @__PURE__ */ new Map();
		const fable5 = usesClaudeFable5BedrockContract(model);
		const refusalBuffer = usesClaudeStreamingRefusalBedrockContract(model) ? createDeferredEventBuffer(stream) : void 0;
		const eventSink = refusalBuffer ?? stream;
		const config = { profile: options.profile };
		const configuredRegion = getConfiguredBedrockRegion(options);
		const requestRegion = options.region || getBedrockModelArnRegion(model.id) || configuredRegion;
		const hasConfiguredProfile = hasConfiguredBedrockProfile(options);
		const endpointRegion = getStandardBedrockEndpointRegion(model.baseUrl);
		const useExplicitEndpoint = shouldUseExplicitBedrockEndpoint(model.baseUrl, requestRegion, hasConfiguredProfile);
		if (useExplicitEndpoint) config.endpoint = model.baseUrl;
		const bearerToken = options.bearerToken || process.env.AWS_BEARER_TOKEN_BEDROCK || void 0;
		const useBearerToken = bearerToken !== void 0 && process.env.AWS_BEDROCK_SKIP_AUTH !== "1";
		if (typeof process !== "undefined" && (process.versions?.node || process.versions?.bun)) {
			if (requestRegion) config.region = requestRegion;
			else if (endpointRegion && useExplicitEndpoint) config.region = endpointRegion;
			else if (!hasConfiguredProfile) config.region = "us-east-1";
			if (process.env.AWS_BEDROCK_SKIP_AUTH === "1") config.credentials = {
				accessKeyId: "dummy-access-key",
				secretAccessKey: "dummy-secret-key"
			};
			const proxyAgents = createHttpProxyAgentsForTarget(model.baseUrl);
			if (proxyAgents) config.requestHandler = new NodeHttpHandler(proxyAgents);
			else if (process.env.AWS_BEDROCK_FORCE_HTTP1 === "1") config.requestHandler = new NodeHttpHandler();
		} else config.region = requestRegion || (endpointRegion && useExplicitEndpoint ? endpointRegion : void 0) || "us-east-1";
		if (useBearerToken) {
			config.token = { token: bearerToken };
			config.authSchemePreference = ["httpBearerAuth"];
		}
		let client;
		try {
			client = new BedrockRuntimeClient(config);
			const cacheRetention = resolveCacheRetention(model, options.cacheRetention);
			const cachePoint = resolveBedrockCachePoint(model, cacheRetention);
			const additionalModelRequestFields = buildAdditionalModelRequestFields(model, options);
			const thinking = additionalModelRequestFields?.thinking;
			const sendsAdaptiveThinking = thinking !== null && typeof thinking === "object" && thinking.type === "adaptive";
			let commandInput = {
				modelId: model.id,
				messages: convertMessages(context, model, cachePoint),
				system: buildSystemPrompt(context.systemPrompt, cacheRetention, cachePoint),
				inferenceConfig: {
					...options.maxTokens !== void 0 && { maxTokens: options.maxTokens },
					...options.temperature !== void 0 && !sendsAdaptiveThinking && { temperature: options.temperature }
				},
				toolConfig: convertToolConfig(context.tools, fable5 || sendsAdaptiveThinking ? normalizeAdaptiveClaudeToolChoice(options.toolChoice) : options.toolChoice),
				additionalModelRequestFields,
				...usesClaudeStreamingRefusalBedrockContract(model) ? { additionalModelResponseFieldPaths: ["/stop_details"] } : {},
				...options.requestMetadata !== void 0 && { requestMetadata: options.requestMetadata }
			};
			const nextCommandInput = await options?.onPayload?.(commandInput, model);
			if (nextCommandInput !== void 0) commandInput = nextCommandInput;
			const command = new ConverseStreamCommand(commandInput);
			const response = await client.send(command, { abortSignal: options.signal });
			const responseIterator = response.stream[Symbol.asyncIterator]();
			if (response.$metadata.httpStatusCode !== void 0) {
				const responseHeaders = {};
				if (response.$metadata.requestId) responseHeaders["x-amzn-requestid"] = response.$metadata.requestId;
				await notifyProviderHttpMetadata({
					options,
					response: {
						status: response.$metadata.httpStatusCode,
						headers: responseHeaders
					},
					model,
					cancelStream: async () => {
						await responseIterator.return?.();
					}
				});
			}
			let sawMessageStop = false;
			for await (const item of { [Symbol.asyncIterator]: () => responseIterator }) {
				notifyLlmRequestActivity(options.signal);
				if (item.messageStart) {
					if (item.messageStart.role !== ConversationRole.ASSISTANT) throw new Error("Unexpected assistant message start but got user message start instead");
					eventSink.push({
						type: "start",
						partial: output
					});
				} else if (item.contentBlockStart) handleContentBlockStart(item.contentBlockStart, blocks, output, eventSink, toolArgumentPreviewSchedules);
				else if (item.contentBlockDelta) handleContentBlockDelta(item.contentBlockDelta, blocks, output, eventSink, redactedReasoningChunks, toolArgumentPreviewSchedules);
				else if (item.contentBlockStop) handleContentBlockStop(item.contentBlockStop, blocks, output, eventSink, redactedReasoningChunks, pendingToolCallEnds);
				else if (item.messageStop) {
					sawMessageStop = true;
					if (item.messageStop.stopReason === "refusal") applyAnthropicRefusal(output, readBedrockStopDetails(item.messageStop.additionalModelResponseFields), model.provider);
					else {
						const mappedStop = mapStopReason(item.messageStop.stopReason);
						output.stopReason = mappedStop.stopReason;
						if (mappedStop.errorMessage) output.errorMessage = mappedStop.errorMessage;
					}
				} else if (item.metadata) handleMetadata(item.metadata, model, output);
				else if (item.internalServerException) throw item.internalServerException;
				else if (item.modelStreamErrorException) throw item.modelStreamErrorException;
				else if (item.validationException) throw item.validationException;
				else if (item.throttlingException) throw item.throttlingException;
				else if (item.serviceUnavailableException) throw item.serviceUnavailableException;
			}
			if (!sawMessageStop) throw new Error("Bedrock stream ended before messageStop");
			if (options.signal?.aborted) throw new Error("Request was aborted");
			if (output.stopReason === "error" || output.stopReason === "aborted") throw new Error(output.errorMessage ?? "An unknown error occurred");
			for (const block of blocks) if (block.index !== void 0 && block.type !== "toolCall") handleContentBlockStop({ contentBlockIndex: block.index }, blocks, output, eventSink, redactedReasoningChunks, pendingToolCallEnds);
			flushPendingBedrockToolCalls(pendingToolCallEnds, blocks, output, eventSink);
			refusalBuffer?.flush();
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			failTransportStream({
				stream,
				output,
				signal: options.signal,
				error,
				cleanup: () => {
					output.content = output.content.filter((block) => block.type !== "toolCall");
					for (const block of output.content) {
						delete block.index;
						delete block.partialJson;
					}
					if (refusalBuffer) {
						refusalBuffer.discard();
						output.content = [];
					}
					output.errorMessage = formatBedrockError(error);
				}
			});
		} finally {
			client?.destroy();
		}
	})();
	return stream;
};
/**
* Human-readable prefixes for Bedrock SDK exception names.
* The downstream retry logic in agent-session matches patterns like
* `server.?error` and `service.?unavailable`, so we preserve the legacy
* prefix format rather than using the raw SDK exception name.
*/
const BEDROCK_ERROR_PREFIXES = {
	InternalServerException: "Internal server error",
	ModelStreamErrorException: "Model stream error",
	ValidationException: "Validation error",
	ThrottlingException: "Throttling error",
	ServiceUnavailableException: "Service unavailable"
};
/**
* Format a Bedrock error with a human-readable prefix.
* AWS SDK exceptions (both from `client.send()` and from stream event items)
* extend BedrockRuntimeServiceException. We map the `.name` to a stable
* human-readable prefix so downstream consumers (retry logic, context-overflow
* detection) can distinguish error categories via simple string matching.
* The shared transport owner projects errorType, errorCode, and diagnostics.
*/
function formatBedrockError(error) {
	const message = error instanceof Error ? error.message : JSON.stringify(error);
	if (error instanceof BedrockRuntimeServiceException) return `${BEDROCK_ERROR_PREFIXES[error.name] ?? error.name}: ${message}`;
	return message;
}
/** Stream a Bedrock Converse request from the generic OpenClaw stream options. */
const streamSimpleBedrock = (model, context, options) => streamBedrock(model, context, resolveSimpleBedrockOptions(model, options));
function resolveSimpleBedrockOptions(model, options) {
	const base = {
		...options,
		...buildBaseOptions(model, options, void 0)
	};
	if (requiresMandatoryAdaptiveThinking(model)) return {
		...base,
		maxTokens: resolveAdaptiveBedrockMaxTokens(model, base.maxTokens),
		reasoning: options?.reasoning,
		thinkingBudgets: options?.thinkingBudgets
	};
	if (!options?.reasoning) {
		const reasoning = usesClaudeOpus5BedrockContract(model) ? "high" : void 0;
		return {
			...base,
			...reasoning !== void 0 || supportsAdaptiveThinking(model) ? { maxTokens: resolveAdaptiveBedrockMaxTokens(model, base.maxTokens) } : {},
			reasoning
		};
	}
	if (options.reasoning === "off") return {
		...base,
		...supportsAdaptiveThinking(model) ? { maxTokens: resolveAdaptiveBedrockMaxTokens(model, base.maxTokens) } : {},
		reasoning: "off"
	};
	if (isAnthropicClaudeModel(model)) {
		if (supportsAdaptiveThinking(model)) return {
			...base,
			maxTokens: resolveAdaptiveBedrockMaxTokens(model, base.maxTokens),
			reasoning: options.reasoning,
			thinkingBudgets: options.thinkingBudgets
		};
		const adjusted = adjustMaxTokensForThinking(base.maxTokens, model.maxTokens, options.reasoning, options.thinkingBudgets);
		if (adjusted.thinkingBudget < 1024) return {
			...base,
			maxTokens: adjusted.maxTokens,
			reasoning: "off"
		};
		return {
			...base,
			maxTokens: adjusted.maxTokens,
			reasoning: options.reasoning,
			thinkingBudgets: {
				...options.thinkingBudgets,
				[clampReasoning(options.reasoning)]: adjusted.thinkingBudget
			}
		};
	}
	return {
		...base,
		reasoning: options.reasoning,
		thinkingBudgets: options.thinkingBudgets
	};
}
function handleContentBlockStart(event, blocks, output, stream, toolArgumentPreviewSchedules) {
	const index = event.contentBlockIndex;
	const start = event.start;
	if (start?.toolUse) {
		const startArguments = isRecord(start.toolUse) ? start.toolUse.input : void 0;
		const block = {
			type: "toolCall",
			id: start.toolUse.toolUseId || "",
			name: start.toolUse.name || "",
			arguments: isRecord(startArguments) ? startArguments : {},
			partialJson: "",
			index
		};
		toolArgumentPreviewSchedules.set(block, createToolArgumentPreviewSchedule());
		output.content.push(block);
		stream.push({
			type: "toolcall_start",
			contentIndex: blocks.length - 1,
			partial: output
		});
	}
}
function handleContentBlockDelta(event, blocks, output, stream, redactedReasoningChunks, toolArgumentPreviewSchedules) {
	const contentBlockIndex = event.contentBlockIndex;
	const delta = event.delta;
	let index = blocks.findIndex((b) => b.index === contentBlockIndex);
	let block = blocks[index];
	if (delta?.text !== void 0) {
		if (!block) {
			const newBlock = {
				type: "text",
				text: "",
				index: contentBlockIndex
			};
			output.content.push(newBlock);
			index = blocks.length - 1;
			block = newBlock;
			stream.push({
				type: "text_start",
				contentIndex: index,
				partial: output
			});
		}
		if (block.type === "text") {
			block.text += delta.text;
			stream.push({
				type: "text_delta",
				contentIndex: index,
				delta: delta.text,
				partial: output
			});
		}
	} else if (delta?.toolUse && block?.type === "toolCall") {
		block.partialJson = (block.partialJson || "") + (delta.toolUse.input || "");
		if (toolArgumentPreviewSchedules.get(block)?.(block.partialJson.length)) block.arguments = parseStreamingJson(block.partialJson);
		stream.push({
			type: "toolcall_delta",
			contentIndex: index,
			delta: delta.toolUse.input || "",
			partial: output
		});
	} else if (delta?.reasoningContent) {
		let thinkingBlock = block;
		let thinkingIndex = index;
		if (!thinkingBlock) {
			const newBlock = {
				type: "thinking",
				thinking: "",
				thinkingSignature: "",
				index: contentBlockIndex
			};
			output.content.push(newBlock);
			thinkingIndex = blocks.length - 1;
			thinkingBlock = blocks[thinkingIndex];
			stream.push({
				type: "thinking_start",
				contentIndex: thinkingIndex,
				partial: output
			});
		}
		if (thinkingBlock?.type === "thinking") {
			if (delta.reasoningContent.text) {
				thinkingBlock.thinking += delta.reasoningContent.text;
				stream.push({
					type: "thinking_delta",
					contentIndex: thinkingIndex,
					delta: delta.reasoningContent.text,
					partial: output
				});
			}
			if (delta.reasoningContent.signature) thinkingBlock.thinkingSignature = (thinkingBlock.thinkingSignature || "") + delta.reasoningContent.signature;
			if (delta.reasoningContent.redactedContent) {
				const chunks = redactedReasoningChunks.get(contentBlockIndex);
				if (chunks) chunks.push(delta.reasoningContent.redactedContent);
				else redactedReasoningChunks.set(contentBlockIndex, [delta.reasoningContent.redactedContent]);
				thinkingBlock.thinking = "[Reasoning redacted]";
				thinkingBlock.redacted = true;
			}
		}
	}
}
function handleMetadata(event, model, output) {
	if (event.usage) {
		output.usage.input = event.usage.inputTokens || 0;
		output.usage.output = event.usage.outputTokens || 0;
		output.usage.cacheRead = event.usage.cacheReadInputTokens || 0;
		output.usage.cacheWrite = event.usage.cacheWriteInputTokens || 0;
		const promptTokens = output.usage.input + output.usage.cacheRead + output.usage.cacheWrite;
		output.usage.totalTokens = Math.max(event.usage.totalTokens || 0, promptTokens + output.usage.output);
		output.usage.contextUsage = {
			state: "available",
			promptTokens,
			totalTokens: promptTokens + output.usage.output
		};
		const cacheWrite1h = event.usage.cacheDetails?.reduce((total, detail) => detail.ttl === CacheTTL.ONE_HOUR ? total + (detail.inputTokens ?? 0) : total, 0);
		if (cacheWrite1h) output.usage.cacheWrite1h = cacheWrite1h;
		calculateCost(model, output.usage);
	}
}
function handleContentBlockStop(event, blocks, output, stream, redactedReasoningChunks, pendingToolCallEnds) {
	const index = blocks.findIndex((b) => b.index === event.contentBlockIndex);
	const block = blocks[index];
	if (!block) return;
	switch (block.type) {
		case "text":
			delete block.index;
			stream.push({
				type: "text_end",
				contentIndex: index,
				content: block.text,
				partial: output
			});
			break;
		case "thinking":
			delete block.index;
			if (block.redacted) {
				const chunks = redactedReasoningChunks.get(event.contentBlockIndex);
				if (chunks) {
					let opaqueReasoning = "";
					for (const chunk of chunks) for (const byte of chunk) opaqueReasoning += String.fromCharCode(byte);
					block.thinkingSignature = btoa(opaqueReasoning);
					redactedReasoningChunks.delete(event.contentBlockIndex);
				}
			}
			stream.push({
				type: "thinking_end",
				contentIndex: index,
				content: block.thinking,
				partial: output
			});
			break;
		case "toolCall":
			delete block.index;
			pendingToolCallEnds.push({
				block,
				contentIndex: index
			});
	}
}
function flushPendingBedrockToolCalls(pending, blocks, output, stream) {
	if (blocks.some((block) => block.type === "toolCall" && block.index !== void 0)) throw new Error("Provider completed stream with an incomplete tool call");
	finalizeTerminalToolCallArguments(pending.map(({ block }) => block), (block) => block.partialJson && block.partialJson.length > 0 ? block.partialJson : block.arguments);
	for (const toolCall of pending) {
		delete toolCall.block.partialJson;
		stream.push({
			type: "toolcall_end",
			contentIndex: toolCall.contentIndex,
			toolCall: toolCall.block,
			partial: output
		});
	}
}
function resolveClaudeProfileNameModelId(modelName) {
	const normalized = modelName?.trim().toLowerCase().replace(/[\s_.:]+/g, "-") ?? "";
	if (!normalized.includes("claude")) return;
	const family = /(?:fable-5|mythos-(?:5|preview)|opus-(?:5|4-(?:6|7|8))|sonnet-(?:5|4-6))(?:$|-)/.exec(normalized)?.[0];
	return family ? `claude-${family.replace(/-$/, "")}` : void 0;
}
function isClaudeMythosPreviewModelId(modelId) {
	return /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId?.trim().toLowerCase().replace(/[\s_.:]+/g, "-") ?? "");
}
/** Check canonical metadata and profile names for adaptive Claude support. */
function supportsAdaptiveThinking(model) {
	const profileModelId = resolveClaudeProfileNameModelId(model.name);
	return supportsClaudeAdaptiveThinking(model) || supportsClaudeAdaptiveThinking({ id: profileModelId }) || isClaudeMythosPreviewModelId(resolveClaudeModelIdentity(model));
}
function requiresMandatoryAdaptiveThinking(model) {
	const profileModelId = resolveClaudeProfileNameModelId(model.name);
	return requiresClaudeMandatoryAdaptiveThinking(model) || requiresClaudeMandatoryAdaptiveThinking({ id: profileModelId }) || isClaudeMythosPreviewModelId(resolveClaudeModelIdentity(model)) || usesClaudeSonnet5BedrockContract(model) || resolveClaudeSonnet5ModelIdentity({ id: profileModelId }) !== void 0;
}
function resolveMandatoryAdaptiveDefault(model) {
	const defaultLevel = resolveBedrockClaudeThinkingProfile(model.id, model.params).defaultLevel ?? resolveBedrockClaudeThinkingProfile(resolveClaudeProfileNameModelId(model.name) ?? "").defaultLevel;
	switch (defaultLevel) {
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
		case "max": return defaultLevel;
		default: return "high";
	}
}
function supportsNativeXhighEffort(model) {
	const profileModelId = resolveClaudeProfileNameModelId(model.name);
	return supportsClaudeNativeXhighEffort(model) || supportsClaudeNativeXhighEffort({ id: profileModelId });
}
function supportsNativeMaxEffort(model) {
	const profileModelId = resolveClaudeProfileNameModelId(model.name);
	return supportsBedrockNativeMaxEffort(model.id, model.params) || supportsBedrockNativeMaxEffort(profileModelId ?? "");
}
function mapThinkingLevelToEffort(model, level) {
	const mapped = level ? model.thinkingLevelMap?.[level] : void 0;
	if (typeof mapped === "string") return mapped;
	if ((level === "xhigh" || level === "max") && mapped === null) return "high";
	switch (level) {
		case "minimal":
		case "low": return "low";
		case "medium": return "medium";
		case "high": return "high";
		case "xhigh": return supportsNativeXhighEffort(model) ? "xhigh" : "high";
		case "max": return supportsNativeMaxEffort(model) ? "max" : "high";
		default: return "high";
	}
}
/**
* Resolve cache retention preference.
* Nova requires explicit opt-in; other models retain the existing env/default policy.
*/
function resolveCacheRetention(model, cacheRetention) {
	if (cacheRetention) return cacheRetention;
	if (resolveBedrockPromptCachePolicy(model) === "nova") return "none";
	if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") return "long";
	return "short";
}
/**
* Check if the model is an Anthropic Claude model on Bedrock.
* Checks both model ID and model name to support application inference profiles
* whose ARNs don't contain the model name.
*/
function isAnthropicClaudeModel(model) {
	if (resolveClaudeModelIdentity(model).startsWith("claude-")) return true;
	const id = model.id.toLowerCase();
	const name = model.name?.toLowerCase() ?? "";
	return id.includes("anthropic.claude") || id.includes("anthropic/claude") || name.includes("anthropic.claude") || name.includes("anthropic/claude") || name.includes("claude");
}
/**
* Check if the model supports thinking signatures in reasoningContent.
* Only Anthropic Claude models support the signature field.
* Other models (OpenAI, Qwen, Minimax, Moonshot, etc.) reject it with:
* "This model doesn't support the reasoningContent.reasoningText.signature field"
*
* Checks both model ID and model name to support application inference profiles.
*/
function supportsThinkingSignature(model) {
	return isAnthropicClaudeModel(model);
}
function buildSystemPrompt(systemPrompt, cacheRetention, cachePoint) {
	if (!systemPrompt) return;
	if (cacheRetention === "none") return [{ text: sanitizeSurrogates(stripSystemPromptCacheBoundary(systemPrompt)) }];
	const split = splitSystemPromptCacheBoundary(systemPrompt);
	const stablePrefix = split?.stablePrefix ?? systemPrompt;
	const blocks = stablePrefix ? [{ text: sanitizeSurrogates(stripSystemPromptCacheBoundary(stablePrefix)) }] : [];
	if (stablePrefix && cachePoint) blocks.push({ cachePoint });
	if (split?.dynamicSuffix) blocks.push({ text: sanitizeSurrogates(stripSystemPromptCacheBoundary(split.dynamicSuffix)) });
	return blocks.length > 0 ? blocks : void 0;
}
function normalizeToolCallId(id) {
	const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, "_");
	return sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized;
}
function createBedrockToolResult(message) {
	const content = [];
	for (const block of message.content) {
		if (block.type === "text") {
			content.push({ text: sanitizeSurrogates(block.text) });
			continue;
		}
		if (block.type === "image" && describeToolResultMediaPlaceholder([block])) content.push({ image: createImageBlock(block.mimeType, block.data) });
	}
	return { toolResult: {
		toolUseId: message.toolCallId,
		content: content.length > 0 ? content : [{ text: describeToolResultMediaPlaceholder(message.content) ?? "(no output)" }],
		status: message.isError ? ToolResultStatus.ERROR : ToolResultStatus.SUCCESS
	} };
}
function convertMessages(context, model, cachePoint) {
	const result = [];
	let firstVolatileMessageIndex;
	const transformedMessages = transformMessages(context.messages, model, normalizeToolCallId);
	for (let i = 0; i < transformedMessages.length; i++) {
		const m = expectDefined(transformedMessages[i], "message conversion index is in bounds");
		switch (m.role) {
			case "user": {
				const content = [];
				if (typeof m.content === "string") content.push({ text: sanitizeSurrogates(m.content) });
				else for (const c of m.content) switch (c.type) {
					case "text":
						content.push({ text: sanitizeSurrogates(c.text) });
						break;
					case "image":
						content.push({ image: createImageBlock(c.mimeType, c.data) });
						break;
					default: continue;
				}
				if (content.length === 0) continue;
				if (m.runtimeContextCarrier === true && !bindsClaudeThinkingPrefix(model) && firstVolatileMessageIndex === void 0) firstVolatileMessageIndex = result.length;
				result.push({
					role: ConversationRole.USER,
					content
				});
				break;
			}
			case "assistant": {
				if (m.content.length === 0) continue;
				const contentBlocks = [];
				for (const c of m.content) switch (c.type) {
					case "text":
						if (c.text.trim().length === 0) continue;
						contentBlocks.push({ text: sanitizeSurrogates(c.text) });
						break;
					case "toolCall":
						contentBlocks.push({ toolUse: {
							toolUseId: c.id,
							name: c.name,
							input: c.arguments
						} });
						break;
					case "thinking": {
						if (c.redacted) {
							if (!supportsThinkingSignature(model)) continue;
							if (!c.thinkingSignature) throw new Error("Bedrock redacted reasoning block is missing its opaque signature");
							contentBlocks.push({ reasoningContent: { redactedContent: decodeBedrockBase64(c.thinkingSignature, "Bedrock redacted reasoning block has a malformed opaque signature") } });
							break;
						}
						const thinkingSignature = c.thinkingSignature;
						const normalizedThinkingSignature = thinkingSignature?.trim();
						const supportsSignature = supportsThinkingSignature(model);
						const hasNativeThinkingSignature = supportsSignature && Boolean(normalizedThinkingSignature) && normalizedThinkingSignature !== "reasoning_content";
						if (c.thinking.trim().length === 0 && !hasNativeThinkingSignature) continue;
						if (supportsSignature) {
							if (normalizedThinkingSignature === "reasoning_content") continue;
							if (!thinkingSignature || !normalizedThinkingSignature) contentBlocks.push({ text: sanitizeSurrogates(c.thinking) });
							else contentBlocks.push({ reasoningContent: { reasoningText: {
								text: c.thinking,
								signature: thinkingSignature
							} } });
						} else contentBlocks.push({ text: sanitizeSurrogates(c.thinking) });
						break;
					}
					default: continue;
				}
				if (contentBlocks.length === 0) continue;
				result.push({
					role: ConversationRole.ASSISTANT,
					content: contentBlocks
				});
				break;
			}
			case "toolResult": {
				const toolResults = [];
				toolResults.push(createBedrockToolResult(m));
				let j = i + 1;
				while (true) {
					const nextMsg = transformedMessages.at(j);
					if (nextMsg?.role !== "toolResult") break;
					toolResults.push(createBedrockToolResult(nextMsg));
					j++;
				}
				i = j - 1;
				const attachedImages = [];
				const userContent = model.id.includes("openai.gpt-5.6-sol") ? toolResults.map((block) => {
					const images = [];
					const content = (block.toolResult.content ?? []).filter((part) => {
						if (part.image) {
							images.push({ image: part.image });
							return false;
						}
						return true;
					});
					if (images.length === 0) return block;
					const label = `Images from tool result ${block.toolResult.toolUseId}`;
					attachedImages.push({ text: `${label}:` }, ...images);
					return { toolResult: {
						...block.toolResult,
						content: [...content, { text: `(see attached images labeled "${label}")` }]
					} };
				}) : toolResults;
				userContent.push(...attachedImages);
				result.push({
					role: ConversationRole.USER,
					content: userContent
				});
				break;
			}
			default: continue;
		}
	}
	if (cachePoint && result.at(-1)?.role === ConversationRole.USER) {
		const cacheAnchor = result.findLast((message, index) => message.role === ConversationRole.USER && (firstVolatileMessageIndex === void 0 || index < firstVolatileMessageIndex));
		if (cacheAnchor?.content) cacheAnchor.content.push({ cachePoint });
	}
	return result;
}
function convertToolConfig(tools, toolChoice) {
	if (!tools?.length || toolChoice === "none") return;
	const bedrockTools = tools.map((tool) => ({ toolSpec: {
		name: tool.name,
		description: tool.description,
		inputSchema: { json: { ...tool.parameters } }
	} }));
	let bedrockToolChoice;
	switch (toolChoice) {
		case "auto":
			bedrockToolChoice = { auto: {} };
			break;
		case "any":
			bedrockToolChoice = { any: {} };
			break;
		default: if (typeof toolChoice === "object" && toolChoice?.type === "tool") bedrockToolChoice = { tool: { name: toolChoice.name } };
	}
	return {
		tools: bedrockTools,
		toolChoice: bedrockToolChoice
	};
}
function mapStopReason(reason) {
	switch (reason) {
		case StopReason.END_TURN:
		case StopReason.STOP_SEQUENCE: return { stopReason: "stop" };
		case StopReason.MAX_TOKENS:
		case StopReason.MODEL_CONTEXT_WINDOW_EXCEEDED: return { stopReason: "length" };
		case StopReason.TOOL_USE: return { stopReason: "toolUse" };
		case StopReason.CONTENT_FILTERED:
		case StopReason.GUARDRAIL_INTERVENED:
		case StopReason.MALFORMED_MODEL_OUTPUT:
		case StopReason.MALFORMED_TOOL_USE: return {
			stopReason: "error",
			errorMessage: reason
		};
		default: return reason ? {
			stopReason: "error",
			errorMessage: reason
		} : { stopReason: "error" };
	}
}
function getBedrockModelArnRegion(modelId) {
	return /^arn:aws(?:-[a-z0-9-]+)?:bedrock:([a-z0-9-]+):/.exec(modelId)?.[1];
}
function getConfiguredBedrockRegion(options) {
	if (typeof process === "undefined") return options.region;
	return options.region || normalizeOptionalString(process.env.AWS_REGION) || normalizeOptionalString(process.env.AWS_DEFAULT_REGION);
}
function hasConfiguredBedrockProfile(options) {
	if (options.profile) return true;
	if (typeof process === "undefined") return false;
	return Boolean(process.env.AWS_PROFILE);
}
function getStandardBedrockEndpointRegion(baseUrl) {
	if (!baseUrl) return;
	try {
		const { hostname } = new URL(baseUrl);
		return hostname.toLowerCase().match(/^bedrock-runtime(?:-fips)?\.([a-z0-9-]+)\.amazonaws\.com(?:\.cn)?$/)?.[1];
	} catch {
		return;
	}
}
function shouldUseExplicitBedrockEndpoint(baseUrl, configuredRegion, hasConfiguredProfile) {
	if (!getStandardBedrockEndpointRegion(baseUrl)) return true;
	return !configuredRegion && !hasConfiguredProfile;
}
function isGovCloudBedrockTarget(model, options) {
	if (getConfiguredBedrockRegion(options)?.toLowerCase().startsWith("us-gov-")) return true;
	const modelId = model.id.toLowerCase();
	return modelId.startsWith("us-gov.") || modelId.startsWith("arn:aws-us-gov:");
}
function buildAdditionalModelRequestFields(model, options) {
	const mandatoryAdaptiveThinking = requiresMandatoryAdaptiveThinking(model);
	const reasoning = options.reasoning === "off" ? mandatoryAdaptiveThinking ? "low" : "off" : options.reasoning ?? (mandatoryAdaptiveThinking ? resolveMandatoryAdaptiveDefault(model) : void 0);
	if (reasoning === "off") return;
	if (!reasoning || !model.reasoning && !usesClaudeFable5BedrockContract(model) && !supportsAdaptiveThinking(model)) return;
	if (isAnthropicClaudeModel(model)) {
		const display = isGovCloudBedrockTarget(model, options) ? void 0 : options.thinkingDisplay ?? "summarized";
		const result = supportsAdaptiveThinking(model) ? {
			thinking: {
				type: "adaptive",
				...display !== void 0 ? { display } : {}
			},
			output_config: { effort: mapThinkingLevelToEffort(model, reasoning) }
		} : (() => {
			const defaultBudgets = {
				minimal: 1024,
				low: 2048,
				medium: 8192,
				high: 16384,
				xhigh: 16384,
				max: 16384
			};
			const level = reasoning === "xhigh" ? "high" : reasoning;
			return { thinking: {
				type: "enabled",
				budget_tokens: options.thinkingBudgets?.[level] ?? defaultBudgets[reasoning],
				...display !== void 0 ? { display } : {}
			} };
		})();
		if (!supportsAdaptiveThinking(model) && (options.interleavedThinking ?? true)) result.anthropic_beta = ["interleaved-thinking-2025-05-14"];
		return result;
	}
}
function createImageBlock(mimeType, data) {
	let format;
	switch (mimeType) {
		case "image/jpeg":
		case "image/jpg":
			format = ImageFormat.JPEG;
			break;
		case "image/png":
			format = ImageFormat.PNG;
			break;
		case "image/gif":
			format = ImageFormat.GIF;
			break;
		case "image/webp":
			format = ImageFormat.WEBP;
			break;
		default: throw new Error(`Unknown image type: ${mimeType}`);
	}
	return {
		source: { bytes: decodeBedrockBase64(data, "Amazon Bedrock image content has malformed base64") },
		format
	};
}
function decodeBedrockBase64(data, errorMessage) {
	const canonicalBase64 = canonicalizeBase64(data);
	if (!canonicalBase64) throw new Error(errorMessage);
	const binaryString = atob(canonicalBase64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	return bytes;
}
//#endregion
export { streamSimpleBedrock };
