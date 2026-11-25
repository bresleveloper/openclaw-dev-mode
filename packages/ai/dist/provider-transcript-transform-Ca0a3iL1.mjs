import { c as transformMessages } from "./host-Dm4e6L6R.mjs";
// packages/ai/src/provider-transcript-transform.ts
const IMAGE_OMISSION = "(image omitted: model does not support images)";
const VIDEO_OMISSION = "(video omitted: provider does not support video input)";
function transformProviderMessages(messages, model, normalizeToolCallId) {
	const target = {
		...model,
		input: model.input.filter((type) => type !== "video")
	};
	return transformMessages(messages.map((message) => {
		if (message.role !== "user" || !Array.isArray(message.content)) return message;
		const content = message.content;
		const supportsImages = model.input.includes("image");
		const supportsVideo = (model.api === "openai-completions" || model.api === "google-interactions") && model.input.includes("video");
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
		return Object.isFrozen(message) && Object.isFrozen(content) && result.length === content.length && result.every((block, index) => block === content[index]) ? message : Object.assign({}, message, { content: result });
	}), target, normalizeToolCallId);
}
export { transformProviderMessages as t };
