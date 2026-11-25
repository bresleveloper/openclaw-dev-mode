import { isMoonshotAlwaysThinkingModelId, isMoonshotK3NativeVideoRoute } from "./provider-policy-api.js";
import { resolveProviderContext, streamSimple } from "openclaw/plugin-sdk/llm";
import { createMoonshotThinkingWrapper, resolveMoonshotThinkingKeep, resolveMoonshotThinkingType } from "openclaw/plugin-sdk/provider-stream-shared";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/moonshot/native-video.ts
const VIDEO_PREFIX = "data:video/mp4;base64,";
const VIDEO_OMISSION = "(video omitted: untrusted or unsupported Moonshot video)";
const MOONSHOT_REQUEST_BYTES_EXCLUSIVE = 1e8;
function partUrl(part, field) {
	const url = isRecord(part[field]) ? part[field].url : void 0;
	return typeof url === "string" ? url : void 0;
}
function replacePart(part, text) {
	Object.keys(part).forEach((key) => Reflect.deleteProperty(part, key));
	Object.assign(part, {
		type: "text",
		text
	});
}
function wrapMoonshotStream(ctx, simple = false, requestBytesExclusive = MOONSHOT_REQUEST_BYTES_EXCLUSIVE) {
	const underlying = ctx.streamFn ?? streamSimple;
	if (simple && !isMoonshotAlwaysThinkingModelId(ctx.modelId)) return underlying;
	const withVideoContext = (model, context, options) => isMoonshotK3NativeVideoRoute({
		...model,
		modelId: model.id
	}) ? resolveProviderContext(context, options).then((providerContext) => underlying(model, providerContext, options)) : underlying(model, context, options);
	return createMoonshotThinkingWrapper(withVideoContext, resolveMoonshotThinkingType({
		configuredThinking: ctx.extraParams?.thinking,
		thinkingLevel: ctx.thinkingLevel
	}), resolveMoonshotThinkingKeep({ configuredThinking: ctx.extraParams?.thinking }), (result, payload) => {
		const admitted = [];
		const messages = isRecord(payload) && Array.isArray(payload.messages) ? payload.messages : [];
		for (const message of messages) {
			if (!isRecord(message) || message.role !== "user" || !Array.isArray(message.content)) continue;
			for (const part of message.content) {
				if (!isRecord(part)) continue;
				const videoUrl = partUrl(part, "video_url");
				const imageUrl = partUrl(part, "image_url");
				if (part.type === "video_url" && videoUrl?.startsWith(VIDEO_PREFIX)) admitted.push(part);
				else if (part.type === "video_url" || imageUrl?.startsWith("data:video/")) replacePart(part, VIDEO_OMISSION);
			}
		}
		while (Buffer.byteLength(JSON.stringify(payload), "utf8") >= requestBytesExclusive) {
			const part = admitted.pop();
			if (!part) throw new Error(`Moonshot request body must be smaller than ${requestBytesExclusive} bytes`);
			replacePart(part, "(video omitted: Moonshot request size limit)");
		}
		return result;
	});
}
export { wrapMoonshotStream };
