import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as projectScrubbedPlainTextToolCallMessage, i as normalizePlainTextToolCallStreamEvents, n as createPromotedPlainTextToolCallEvents, r as projectStandalonePlainTextToolCallMessage, t as createPromotedPlainTextToolCallBlock } from "./src-1yL4ZLJM.mjs";
import { r as findCodeRegions } from "./code-regions-CvUeKYli.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { i as streamSimple } from "./stream-CL_UFGCU.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-BoUixBWV.mjs";
import "./moonshot-thinking-JmWKqAlI.mjs";
import { projectCopilotRequestFacts as projectCopilotRequestFacts$1 } from "@openclaw/ai/internal/shared";
import { applyAnthropicEphemeralCacheControlMarkers as applyAnthropicEphemeralCacheControlMarkers$1, applyAnthropicPayloadPolicyToParams, applyCompletionsAnthropicCacheControl as applyCompletionsAnthropicCacheControl$1, createEmptyTransportUsage, googleFlashSupportsMinimalThinking, resolveAnthropicPayloadPolicy, resolveOpenAIReasoningEffortMap } from "@openclaw/ai/transports";
import { resolveOpenAIReasoningEffortForModel } from "@openclaw/ai/internal/openai";
import { createDeferredEventBuffer, notifyLlmRequestActivity as notifyLlmRequestActivity$1, onLlmRequestActivity as onLlmRequestActivity$1 } from "@openclaw/ai/internal/runtime";
import { applyAnthropicRefusal, isAnthropicOAuthApiKey as isAnthropicOAuthApiKey$1, resolveAnthropicServerCompactionPlan as resolveAnthropicServerCompactionPlan$1, resolveAnthropicThinkingEffort } from "@openclaw/ai/internal/anthropic";
import { isGoogleGemini3FlashModel, isGoogleGemini3FlashModel as isGoogleGemini3FlashModel$1, isGoogleGemini3ProModel, isGoogleGemini3ProModel as isGoogleGemini3ProModel$1, isGoogleGemini3ThinkingLevelModel, isGoogleGemini3ThinkingLevelModel as isGoogleGemini3ThinkingLevelModel$1 } from "@openclaw/ai/internal/google-model-family";
//#region src/llm/providers/stream-wrappers/reasoning-effort-utils.ts
/** Maps OpenClaw thinking levels onto provider reasoning-effort labels. */
function mapThinkingLevelToReasoningEffort(thinkingLevel) {
	if (thinkingLevel === "off") return "none";
	if (thinkingLevel === "adaptive") return "medium";
	if (thinkingLevel === "max" || thinkingLevel === "ultra") return "xhigh";
	return thinkingLevel;
}
//#endregion
//#region src/llm/providers/stream-wrappers/google-thinking-payload.ts
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleThinkingRequiredModel(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).includes("gemini-2.5-pro");
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function isGoogleGemini25ThinkingBudgetModel(modelId) {
	return /(?:^|\/)gemini-2\.5-/.test(normalizeLowercaseStringOrEmpty(modelId));
}
/**
* Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function resolveGoogleGemini3ThinkingLevel(params) {
	if (typeof params.modelId !== "string") return;
	const isPro = isGoogleGemini3ProModel(params.modelId);
	if (!isPro && !isGoogleGemini3FlashModel(params.modelId)) return;
	const minimalLevel = !isPro && googleFlashSupportsMinimalThinking(params.modelId) ? "MINIMAL" : "LOW";
	switch (params.thinkingLevel) {
		case "off":
		case "minimal": return minimalLevel;
		case "low": return "LOW";
		case "medium": return isPro ? "HIGH" : "MEDIUM";
		case "high":
		case "max":
		case "xhigh": return "HIGH";
		case "adaptive": return;
		case void 0:
	}
	if (typeof params.thinkingBudget !== "number" || params.thinkingBudget < 0) return;
	if (isPro) return params.thinkingBudget <= 2048 ? "LOW" : "HIGH";
	if (params.thinkingBudget <= 0) return minimalLevel;
	if (params.thinkingBudget <= 2048) return "LOW";
	if (params.thinkingBudget <= 8192) return "MEDIUM";
	return "HIGH";
}
/**
* Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function stripInvalidGoogleThinkingBudget(params) {
	if (params.thinkingConfig.thinkingBudget !== 0 || typeof params.modelId !== "string" || !isGoogleThinkingRequiredModel(params.modelId)) return false;
	delete params.thinkingConfig.thinkingBudget;
	return true;
}
function isGemma4Model(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).startsWith("gemma-4");
}
function mapThinkLevelToGemma4ThinkingLevel(thinkingLevel) {
	switch (thinkingLevel) {
		case "off": return;
		case "minimal":
		case "low": return "MINIMAL";
		case "medium":
		case "adaptive":
		case "high":
		case "max":
		case "xhigh": return "HIGH";
		default: return;
	}
}
function normalizeGemma4ThinkingLevel(value) {
	if (typeof value !== "string") return;
	switch (value.trim().toUpperCase()) {
		case "MINIMAL":
		case "LOW": return "MINIMAL";
		case "MEDIUM":
		case "HIGH": return "HIGH";
		default: return;
	}
}
/**
* Normalizes Google thinking config across SDK payload shapes before provider transport.
* @deprecated Google provider-owned stream helper; do not use from third-party plugins.
*/
function sanitizeGoogleThinkingPayload(params) {
	if (!params.payload || typeof params.payload !== "object") return;
	const payloadObj = params.payload;
	sanitizeGoogleThinkingConfigContainer({
		container: payloadObj.config,
		modelId: params.modelId,
		thinkingLevel: params.thinkingLevel
	});
	sanitizeGoogleThinkingConfigContainer({
		container: payloadObj.generationConfig,
		modelId: params.modelId,
		thinkingLevel: params.thinkingLevel
	});
}
function sanitizeGoogleThinkingConfigContainer(params) {
	if (!params.container || typeof params.container !== "object") return;
	const configObj = params.container;
	const thinkingConfig = configObj.thinkingConfig;
	if (!thinkingConfig || typeof thinkingConfig !== "object") return;
	const thinkingConfigObj = thinkingConfig;
	if (typeof params.modelId === "string" && isGemma4Model(params.modelId)) {
		const normalizedThinkingLevel = normalizeGemma4ThinkingLevel(thinkingConfigObj.thinkingLevel);
		const explicitMappedLevel = mapThinkLevelToGemma4ThinkingLevel(params.thinkingLevel);
		const disabledViaBudget = typeof thinkingConfigObj.thinkingBudget === "number" && thinkingConfigObj.thinkingBudget <= 0;
		const hadThinkingBudget = thinkingConfigObj.thinkingBudget !== void 0;
		delete thinkingConfigObj.thinkingBudget;
		if (params.thinkingLevel === "off" || disabledViaBudget && explicitMappedLevel === void 0 && !normalizedThinkingLevel) {
			delete thinkingConfigObj.thinkingLevel;
			if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
			return;
		}
		const mappedLevel = explicitMappedLevel ?? normalizedThinkingLevel ?? (hadThinkingBudget ? "MINIMAL" : void 0);
		if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
		return;
	}
	const thinkingBudget = thinkingConfigObj.thinkingBudget;
	if (params.thinkingLevel === "adaptive" && typeof params.modelId === "string" && isGoogleGemini25ThinkingBudgetModel(params.modelId)) {
		delete thinkingConfigObj.thinkingLevel;
		thinkingConfigObj.thinkingBudget = -1;
		return;
	}
	if (typeof params.modelId === "string" && isGoogleGemini3ThinkingLevelModel(params.modelId)) {
		delete thinkingConfigObj.thinkingBudget;
		if (params.thinkingLevel === "adaptive") delete thinkingConfigObj.thinkingLevel;
		else {
			const mappedLevel = resolveGoogleGemini3ThinkingLevel({
				modelId: params.modelId,
				thinkingLevel: params.thinkingLevel,
				thinkingBudget: typeof thinkingBudget === "number" ? thinkingBudget : void 0
			});
			if (mappedLevel) thinkingConfigObj.thinkingLevel = mappedLevel;
		}
	} else if (!stripInvalidGoogleThinkingBudget({
		thinkingConfig: thinkingConfigObj,
		modelId: params.modelId
	})) {
		if (typeof thinkingBudget !== "number" || thinkingBudget >= 0) return;
		delete thinkingConfigObj.thinkingBudget;
	}
	if (Object.keys(thinkingConfigObj).length === 0) delete configObj.thinkingConfig;
}
//#endregion
//#region src/plugin-sdk/provider-stream-event-normalization.ts
const STREAM_EVENT_TYPE_RE = /^(?:start|(?:text|thinking|toolcall)_(?:start|delta|end)|done|error)$/;
const STOP_REASON_RE = /^(?:stop|length|toolUse|error|aborted)$/;
function materializeMessage(value, model, stopReason) {
	const message = asOptionalObjectRecord(value);
	if (message?.role !== "assistant" || !Array.isArray(message.content)) throw new Error("Plain-text tool-call normalization produced an invalid stream event");
	message.api = typeof message.api === "string" ? message.api : model.api;
	message.provider = typeof message.provider === "string" ? message.provider : model.provider;
	message.model = typeof message.model === "string" ? message.model : model.id;
	message.usage ??= createEmptyTransportUsage();
	message.stopReason = STOP_REASON_RE.test(String(message.stopReason)) ? message.stopReason : stopReason;
	message.timestamp = typeof message.timestamp === "number" ? message.timestamp : Date.now();
}
function assertProviderStreamEvent(value, model) {
	const event = asOptionalObjectRecord(value);
	if (!event || typeof event.type !== "string" || !STREAM_EVENT_TYPE_RE.test(event.type)) throw new Error("Plain-text tool-call normalization produced an invalid stream event");
	if (event.type === "done") {
		const reason = event.reason === "length" || event.reason === "toolUse" ? event.reason : "stop";
		event.reason = reason;
		materializeMessage(event.message, model, reason);
		return;
	}
	if (event.type === "error") {
		const reason = event.reason === "aborted" ? "aborted" : "error";
		event.reason = reason;
		materializeMessage(event.error, model, reason);
		return;
	}
	if (event.type === "text_delta" && event.partial === void 0) {
		event.contentIndex ??= 0;
		return;
	}
	event.contentIndex ??= 0;
	event.partial ??= {
		role: "assistant",
		content: []
	};
	materializeMessage(event.partial, model, "stop");
}
//#endregion
//#region src/llm/providers/stream-wrappers/zai.ts
/**
* Inject `tool_stream=true` so tool-call deltas stream in real time.
* Providers can disable this by setting `params.tool_stream=false`.
*
* @deprecated Provider-owned stream helper; do not use from third-party plugins.
*/
function createToolStreamWrapper(baseStreamFn, enabled) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (!enabled) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
			payloadObj.tool_stream = true;
		});
	};
}
//#endregion
//#region src/plugin-sdk/provider-stream-shared.ts
/** Compose stream wrapper factories from left to right around a base stream function. */
function composeProviderStreamWrappers(baseStreamFn, ...wrappers) {
	return wrappers.reduce((streamFn, wrapper) => wrapper ? wrapper(streamFn) : streamFn, baseStreamFn);
}
function resolveContextToolNames(context) {
	const tools = context.tools;
	if (!Array.isArray(tools)) return /* @__PURE__ */ new Set();
	const names = tools.map((tool) => {
		const record = asOptionalObjectRecord(tool);
		return typeof record?.name === "string" && record.name.trim() ? record.name : void 0;
	}).filter((name) => Boolean(name));
	return new Set(names);
}
function promotePlainTextToolCalls(message, toolNames) {
	const messageRecord = asOptionalObjectRecord(message);
	if (Array.isArray(messageRecord?.content) && messageRecord.content.some((block) => asOptionalObjectRecord(block)?.type === "toolCall")) return;
	return projectStandalonePlainTextToolCallMessage({
		allowedToolNames: toolNames,
		createToolCallBlock: createPromotedPlainTextToolCallBlock,
		isRetainableNonTextBlock: () => true,
		message,
		resolveProtectedRanges: findCodeRegions
	});
}
function createProviderToolNameMatcher(toolNames) {
	return {
		hasExactName: (name) => toolNames.has(name),
		hasNamePrefix: (prefix) => {
			for (const toolName of toolNames) if (toolName.startsWith(prefix)) return true;
			return false;
		}
	};
}
function normalizeProviderDoneMessage(message, allowPromotion, toolNames, matcher, preserveEmptyTextBlocks = false) {
	const scrubbedMessage = projectScrubbedPlainTextToolCallMessage({
		forceKnownCandidates: false,
		matcher,
		message,
		preserveEmptyTextBlocks,
		resolveProtectedRanges: findCodeRegions
	});
	if (scrubbedMessage) return {
		kind: "scrubbed",
		...scrubbedMessage
	};
	if (!allowPromotion) return;
	const promotedMessage = promotePlainTextToolCalls(message, toolNames);
	return promotedMessage ? {
		kind: "promoted",
		...promotedMessage
	} : void 0;
}
function wrapPlainTextToolCallStream(source, context, model) {
	const toolNames = resolveContextToolNames(context);
	if (toolNames.size === 0) return source;
	const matcher = createProviderToolNameMatcher(toolNames);
	const output = (0, event_stream_exports.createAssistantMessageEventStream)();
	(async () => {
		try {
			const normalizedEvents = normalizePlainTextToolCallStreamEvents(source, {
				createPromotedToolCallEvents: createPromotedPlainTextToolCallEvents,
				matcher,
				normalizeTerminalMessage: ({ allowPromotion, message, preserveEmptyTextBlocks }) => normalizeProviderDoneMessage(message, allowPromotion, toolNames, matcher, preserveEmptyTextBlocks),
				protectedRangesFenceCompatible: true,
				resolveProtectedRanges: findCodeRegions,
				stopAfterDone: true
			});
			for await (const normalizedEvent of normalizedEvents) {
				assertProviderStreamEvent(normalizedEvent, model);
				output.push(normalizedEvent);
			}
		} catch (error) {
			output.push({
				type: "error",
				reason: "error",
				error: {
					role: "assistant",
					content: [],
					api: model.api,
					provider: model.provider,
					model: model.id,
					usage: createEmptyTransportUsage(),
					stopReason: "error",
					errorMessage: error instanceof Error ? error.message : String(error),
					timestamp: Date.now()
				}
			});
		} finally {
			output.end();
		}
	})();
	return output;
}
/**
* Provider stream wrapper for local/proxy providers that sometimes emit a
* standalone textual tool-call block even when native tool calling is enabled.
*/
function createPlainTextToolCallCompatWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const maybeStream = underlying(model, context, options);
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => wrapPlainTextToolCallStream(stream, context, model));
		return wrapPlainTextToolCallStream(maybeStream, context, model);
	};
}
/** @deprecated Bundled provider stream helper; do not use from third-party plugins. */
function defaultToolStreamExtraParams(extraParams) {
	if (extraParams?.tool_stream !== void 0) return extraParams;
	return {
		...extraParams,
		tool_stream: true
	};
}
/** Wrap a provider stream so callers can patch the outbound provider payload once. */
function createPayloadPatchStreamWrapper(baseStreamFn, patchPayload, wrapperOptions) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (wrapperOptions?.shouldPatch && !wrapperOptions.shouldPatch({
			model,
			context,
			options
		})) return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => patchPayload({
			payload,
			model,
			context,
			options
		}));
	};
}
/**
* Applies explicit disabled-thinking intent to OpenAI-compatible Chat
* Completions payloads without changing enabled reasoning levels.
*/
function createOpenAICompatibleCompletionsThinkingOffWrapper(baseStreamFn, thinkingLevel, sourceApi) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if ((options?.reasoning ?? thinkingLevel) !== "off" || (sourceApi ?? model.api) !== "openai-completions") return underlying(model, context, options);
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (!("reasoning_effort" in payload)) return;
			const disabled = resolveOpenAIReasoningEffortForModel({
				model,
				effort: "off",
				fallbackMap: resolveOpenAIReasoningEffortMap({
					provider: model.provider,
					id: model.id,
					compat: model.compat
				})
			});
			if (disabled) payload.reasoning_effort = disabled;
			else delete payload.reasoning_effort;
		});
	};
}
function assistantMessageHasAnthropicToolUse(message) {
	return Array.isArray(message.tool_calls) && message.tool_calls.length > 0 || Array.isArray(message.content) && message.content.some((block) => {
		const type = asOptionalObjectRecord(block)?.type;
		return type === "tool_use" || type === "toolCall";
	});
}
/** Removes trailing assistant prefills while preserving assistant tool calls. */
function stripTrailingAssistantPrefillMessages(payload) {
	if (!Array.isArray(payload.messages)) return 0;
	let stripped = 0;
	while (payload.messages.length > 0) {
		const finalMessage = payload.messages[payload.messages.length - 1];
		if (!finalMessage || typeof finalMessage !== "object") break;
		const message = finalMessage;
		if (message.role !== "assistant" || assistantMessageHasAnthropicToolUse(message)) break;
		payload.messages.pop();
		stripped += 1;
	}
	return stripped;
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function stripTrailingAnthropicAssistantPrefillWhenThinking(payload) {
	const thinking = asOptionalObjectRecord(payload.thinking);
	return thinking && thinking.type !== "disabled" ? stripTrailingAssistantPrefillMessages(payload) : 0;
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn, onStripped, wrapperOptions) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
		const stripped = stripTrailingAnthropicAssistantPrefillWhenThinking(payload);
		if (stripped > 0) onStripped?.(stripped);
	}, wrapperOptions);
}
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
function isOpenAICompatibleThinkingEnabled(params) {
	const options = params.options ?? {};
	const raw = options.reasoningEffort ?? options.reasoning ?? params.thinkingLevel ?? "high";
	if (typeof raw !== "string") return true;
	const normalized = raw.trim().toLowerCase();
	return normalized !== "off" && normalized !== "none";
}
/** Applies the shared reasoning payload policy used by OpenAI-compatible proxy providers. */
function normalizeOpenAICompatibleReasoningPayload(payload, thinkingLevel) {
	delete payload.reasoning_effort;
	if (!thinkingLevel || thinkingLevel === "off") return;
	const existingReasoning = payload.reasoning;
	if (existingReasoning && typeof existingReasoning === "object" && !Array.isArray(existingReasoning)) {
		const reasoning = existingReasoning;
		if (!("max_tokens" in reasoning) && !("effort" in reasoning)) reasoning.effort = mapThinkingLevelToReasoningEffort(thinkingLevel);
	} else if (!existingReasoning) payload.reasoning = { effort: mapThinkingLevelToReasoningEffort(thinkingLevel) };
}
/** Applies Qwen chat-template thinking flags without discarding provider-specific kwargs. */
function setQwenChatTemplateThinking(payload, enabled) {
	const existing = payload.chat_template_kwargs;
	const next = {
		...existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {},
		enable_thinking: enabled
	};
	if (!Object.hasOwn(next, "preserve_thinking")) next.preserve_thinking = true;
	payload.chat_template_kwargs = next;
}
function isDisabledDeepSeekV4ThinkingLevel(thinkingLevel) {
	const normalized = typeof thinkingLevel === "string" ? thinkingLevel.toLowerCase() : "";
	return normalized === "off" || normalized === "none";
}
function resolveDeepSeekV4ReasoningEffort(thinkingLevel) {
	return thinkingLevel === "xhigh" || thinkingLevel === "max" ? "max" : "high";
}
/** Normalizes assistant reasoning replay shared by OpenAI-compatible provider families. */
function normalizeOpenAICompatibleReasoningReplay(payload, params) {
	if (!Array.isArray(payload.messages)) return;
	for (const message of payload.messages) {
		if (!message || typeof message !== "object") continue;
		const record = message;
		if (!params.thinkingEnabled) {
			if (!params.stripAssistantMessagesOnly || record.role === "assistant") delete record.reasoning_content;
			continue;
		}
		if (record.role !== "assistant" || params.shouldBackfillAssistantMessage && !params.shouldBackfillAssistantMessage(record)) continue;
		if (!("reasoning_content" in record) || params.replaceNullReasoningContent && record.reasoning_content == null) record.reasoning_content = "";
	}
}
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
function createDeepSeekV4OpenAICompatibleThinkingWrapper(params) {
	if (!params.baseStreamFn) return;
	const underlying = params.baseStreamFn;
	const resolveReasoningEffort = params.resolveReasoningEffort ?? resolveDeepSeekV4ReasoningEffort;
	return (model, context, options) => {
		if (!params.shouldPatchModel(model)) return underlying(model, context, options);
		const thinkingLevel = options?.reasoning ?? params.thinkingLevel;
		return streamWithPayloadPatch(underlying, model, context, options, (payload) => {
			if (isDisabledDeepSeekV4ThinkingLevel(thinkingLevel)) {
				payload.thinking = { type: "disabled" };
				delete payload.reasoning_effort;
				delete payload.reasoning;
				normalizeOpenAICompatibleReasoningReplay(payload, { thinkingEnabled: false });
				return;
			}
			payload.thinking = { type: "enabled" };
			payload.reasoning_effort = resolveReasoningEffort(thinkingLevel);
			normalizeOpenAICompatibleReasoningReplay(payload, {
				thinkingEnabled: true,
				shouldBackfillAssistantMessage: params.shouldBackfillAssistantReasoningContent
			});
		});
	};
}
function promoteThinkingOnlyFinalOutputToText(message) {
	if (!message || typeof message !== "object") return;
	const record = message;
	if (record.stopReason !== "stop" && record.stopReason !== "length") return;
	if (!Array.isArray(record.content) || record.content.length === 0) return;
	let hasVisibleThinking = false;
	for (const block of record.content) {
		if (!block || typeof block !== "object") continue;
		const typedBlock = block;
		if (typedBlock.type === "text" && typeof typedBlock.text === "string" && typedBlock.text.trim() || typedBlock.type === "toolCall" || typedBlock.type === "tool_use") return;
		if (typedBlock.type === "thinking" && typeof typedBlock.thinking === "string" && typedBlock.thinking.trim()) hasVisibleThinking = true;
	}
	if (!hasVisibleThinking) return;
	record.content = record.content.map((block) => {
		if (!block || typeof block !== "object") return block;
		const typedBlock = block;
		return typedBlock.type === "thinking" && typeof typedBlock.thinking === "string" && typedBlock.thinking.trim() ? {
			type: "text",
			text: typedBlock.thinking
		} : block;
	});
}
/** Mutate streamed and final message objects without replacing or buffering events. */
function transformProviderStreamMessages(stream, transformMessage) {
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		const message = await originalResult();
		transformMessage(message);
		return message;
	};
	const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = function() {
		const iterator = originalAsyncIterator();
		return {
			async next() {
				const result = await iterator.next();
				if (!result.done && result.value && typeof result.value === "object") {
					const event = result.value;
					transformMessage(event.partial);
					transformMessage(event.message);
				}
				return result;
			},
			async return(value) {
				return iterator.return?.(value) ?? {
					done: true,
					value: void 0
				};
			},
			async throw(error) {
				return iterator.throw?.(error) ?? {
					done: true,
					value: void 0
				};
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	};
	return stream;
}
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
function createThinkingOnlyFinalTextWrapper(params) {
	if (!params.baseStreamFn) return;
	const underlying = params.baseStreamFn;
	return (model, context, options) => {
		const maybeStream = underlying(model, context, options);
		if (!params.shouldPatchModel(model)) return maybeStream;
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => transformProviderStreamMessages(stream, promoteThinkingOnlyFinalOutputToText));
		return transformProviderStreamMessages(maybeStream, promoteThinkingOnlyFinalOutputToText);
	};
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function createGoogleThinkingPayloadWrapper(baseStreamFn, thinkingLevel) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
		if (model.api === "google-generative-ai") sanitizeGoogleThinkingPayload({
			payload,
			modelId: model.id,
			thinkingLevel
		});
	});
}
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
function createGoogleThinkingStreamWrapper(ctx) {
	return createGoogleThinkingPayloadWrapper(ctx.streamFn, ctx.thinkingLevel);
}
//#endregion
export { stripTrailingAnthropicAssistantPrefillWhenThinking as A, notifyLlmRequestActivity$1 as C, resolveAnthropicServerCompactionPlan$1 as D, resolveAnthropicPayloadPolicy as E, isGoogleThinkingRequiredModel as F, resolveGoogleGemini3ThinkingLevel as I, sanitizeGoogleThinkingPayload as L, transformProviderStreamMessages as M, createToolStreamWrapper as N, resolveAnthropicThinkingEffort as O, isGoogleGemini25ThinkingBudgetModel as P, stripInvalidGoogleThinkingBudget as R, normalizeOpenAICompatibleReasoningReplay as S, projectCopilotRequestFacts$1 as T, isGoogleGemini3FlashModel$1 as _, composeProviderStreamWrappers as a, isOpenAICompatibleThinkingEnabled as b, createDeferredEventBuffer as c, createOpenAICompatibleCompletionsThinkingOffWrapper as d, createPayloadPatchStreamWrapper as f, isAnthropicOAuthApiKey$1 as g, defaultToolStreamExtraParams as h, applyCompletionsAnthropicCacheControl$1 as i, stripTrailingAssistantPrefillMessages as j, setQwenChatTemplateThinking as k, createGoogleThinkingPayloadWrapper as l, createThinkingOnlyFinalTextWrapper as m, applyAnthropicPayloadPolicyToParams as n, createAnthropicThinkingPrefillPayloadWrapper as o, createPlainTextToolCallCompatWrapper as p, applyAnthropicRefusal as r, createDeepSeekV4OpenAICompatibleThinkingWrapper as s, applyAnthropicEphemeralCacheControlMarkers$1 as t, createGoogleThinkingStreamWrapper as u, isGoogleGemini3ProModel$1 as v, onLlmRequestActivity$1 as w, normalizeOpenAICompatibleReasoningPayload as x, isGoogleGemini3ThinkingLevelModel$1 as y, mapThinkingLevelToReasoningEffort as z };
