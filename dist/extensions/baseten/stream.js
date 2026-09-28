import { l as usesBasetenChatTemplateThinking } from "./.setup/models-CwKDnNIj.mjs";
import { asNonArrayRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { normalizeOpenAICompatibleReasoningReplay, streamWithPayloadPatch } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/baseten/stream.ts
/** Baseten request payload policy for models with opt-in chat-template reasoning. */
/** Adds Baseten's `chat_template_args.enable_thinking` without dropping caller args. */
function createBasetenThinkingWrapper(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.provider !== "baseten" || (ctx.sourceApi ?? model.api) !== "openai-completions") return underlying(model, context, options);
		const optIn = usesBasetenChatTemplateThinking(model.id);
		const thinkingLevel = options?.reasoning ?? (ctx.thinkingLevel === "adaptive" ? "max" : ctx.thinkingLevel) ?? (optIn ? "off" : void 0);
		return streamWithPayloadPatch(underlying, model, context, thinkingLevel === void 0 ? options : {
			...options,
			reasoning: thinkingLevel
		}, (payload) => {
			if (model.id.trim().toLowerCase() === "deepseek-ai/deepseek-v4-pro") normalizeOpenAICompatibleReasoningReplay(payload, {
				thinkingEnabled: thinkingLevel !== "off",
				stripAssistantMessagesOnly: true,
				replaceNullReasoningContent: true
			});
			if (optIn) payload.chat_template_args = {
				...asNonArrayRecord(payload.chat_template_args),
				enable_thinking: thinkingLevel !== "off"
			};
		});
	};
}
//#endregion
export { createBasetenThinkingWrapper };
