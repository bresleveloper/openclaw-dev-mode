import { l as usesBasetenChatTemplateThinking, t as BASETEN_BASE_URL } from "./.setup/models-wG5xIuOb.mjs";
import { asNonArrayRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { normalizeOpenAICompatibleReasoningReplay, streamWithPayloadPatch } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/baseten/stream.ts
/** Baseten session affinity and model-specific thinking policy. */
function createBasetenThinkingWrapper(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.provider !== "baseten" || (ctx.sourceApi ?? model.api) !== "openai-completions") return underlying(model, context, options);
		const affinity = options?.promptCacheKey ?? options?.sessionId;
		const cacheRetention = options?.cacheRetention ?? ctx.extraParams?.cacheRetention;
		let streamOptions = options;
		if (affinity && cacheRetention !== "none" && model.baseUrl?.trim().replace(/\/+$/u, "") === BASETEN_BASE_URL && !Object.keys({
			...model.headers,
			...options?.headers
		}).some((name) => name.toLowerCase() === "x-session-affinity")) streamOptions = {
			...options,
			headers: {
				...options?.headers,
				"x-session-affinity": affinity
			}
		};
		const optIn = usesBasetenChatTemplateThinking(model.id);
		const thinkingLevel = options?.reasoning ?? (ctx.thinkingLevel === "adaptive" ? "max" : ctx.thinkingLevel) ?? (optIn ? "off" : void 0);
		return streamWithPayloadPatch(underlying, model, context, thinkingLevel === void 0 ? streamOptions : {
			...streamOptions,
			reasoning: thinkingLevel
		}, (payload) => {
			const normalizedModelId = model.id.trim().toLowerCase();
			if (normalizedModelId === "deepseek-ai/deepseek-v4-pro" || normalizedModelId === "deepseek-ai/deepseek-v4-pro-0813") {
				normalizeOpenAICompatibleReasoningReplay(payload, {
					thinkingEnabled: thinkingLevel !== "off",
					stripAssistantMessagesOnly: true,
					replaceNullReasoningContent: true
				});
				if (normalizedModelId === "deepseek-ai/deepseek-v4-pro-0813" && payload.reasoning_effort !== void 0) payload.thinking = { type: payload.reasoning_effort === "none" ? "disabled" : "enabled" };
			}
			if (optIn) payload.chat_template_args = {
				...asNonArrayRecord(payload.chat_template_args),
				enable_thinking: thinkingLevel !== "off"
			};
		});
	};
}
//#endregion
export { createBasetenThinkingWrapper };
