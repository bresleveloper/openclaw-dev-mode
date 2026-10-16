import { c as transformMessages } from "./host-u3o8XiAp.mjs";
import { a as createEmptyTransportUsage } from "./transport-stream-shared-CCR7hSW0.mjs";
//#region packages/ai/src/provider-transcript-transform.ts
const IMAGE_OMISSION = "(image omitted: model does not support images)";
const VIDEO_OMISSION = "(video omitted: provider does not support video input)";
function projectUserMediaForTransport(content, supportsImages, supportsVideo) {
	const result = [];
	for (const block of content) {
		if (block.type === "text" || block.type === "image" && supportsImages || block.type === "video" && supportsVideo) {
			result.push(block);
			continue;
		}
		const text = block.type === "video" ? VIDEO_OMISSION : IMAGE_OMISSION;
		const previous = result.at(-1);
		if (block.data.trim() && !(previous?.type === "text" && previous.text === text)) result.push({
			type: "text",
			text
		});
	}
	return result;
}
function transformProviderMessages(messages, model, normalizeToolCallId) {
	const target = {
		...model,
		input: model.input.filter((type) => type !== "video")
	};
	return transformMessages(messages.map((message) => {
		if (message.role !== "user" || !Array.isArray(message.content)) return message;
		return Object.assign({}, message, { content: projectUserMediaForTransport(message.content, model.input.includes("image"), model.api === "openai-completions" && model.input.includes("video")) });
	}), target, normalizeToolCallId);
}
//#endregion
//#region packages/ai/src/transports/assistant-output.ts
function createAssistantOutput(model, api = model.api) {
	return {
		role: "assistant",
		content: [],
		api,
		provider: model.provider,
		model: model.id,
		usage: createEmptyTransportUsage(),
		stopReason: "stop",
		timestamp: Date.now()
	};
}
//#endregion
export { transformProviderMessages as n, createAssistantOutput as t };
