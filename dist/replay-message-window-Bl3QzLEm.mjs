import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES } from "./worker-inference-m2fwUhbe.mjs";
//#region src/worker/replay-message-window.ts
function windowWorkerReplayMessages(messages, limitMessages) {
	if (messages.length <= limitMessages) return {
		kind: "complete",
		messages
	};
	const minimumStart = messages.length - limitMessages;
	const replayIndex = messages.findLastIndex((message) => message.providerReplay !== void 0);
	if (replayIndex >= 0 && messages.length - replayIndex > limitMessages) return {
		kind: "provider-replay-unavailable",
		details: {
			reason: "provider-replay-message-limit",
			messageCount: messages.length - replayIndex,
			limitMessages
		}
	};
	const completeTurnStart = messages.findIndex((message, index) => index >= minimumStart && message.role === "user");
	const start = replayIndex >= 0 && (completeTurnStart < 0 || completeTurnStart > replayIndex) ? replayIndex : completeTurnStart;
	if (start < 0) throw new Error("Worker context has no complete user turn within the message limit.");
	return {
		kind: "complete",
		messages: messages.slice(start)
	};
}
const PROCESSED_IMAGE_MARKER = {
	type: "text",
	text: "[image data removed - already processed by model]"
};
/** Fit only the model projection; persisted images and replay checkpoints stay untouched. */
function fitWorkerReplayImages(messages, measureBytes, protectedToolCallId) {
	if (measureBytes(messages) <= WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) return messages;
	if (messages.some((message) => message.role === "assistant" && message.providerReplay !== void 0)) return;
	const observedBefore = messages.findLastIndex((message) => message.role === "assistant" && message.stopReason !== "error" && message.stopReason !== "aborted");
	const latestImage = messages.findLastIndex((message) => message.role !== "assistant" && Array.isArray(message.content) && message.content.some((part) => part.type === "image"));
	let fitted = messages;
	for (let index = 0; index < observedBefore; index++) {
		const message = messages[index];
		if (index === latestImage || message.role === "assistant" || !Array.isArray(message.content) || message.role === "toolResult" && message.toolCallId === protectedToolCallId) continue;
		let content = message.content;
		for (const [blockIndex, block] of message.content.entries()) {
			if (block.type !== "image") continue;
			if (fitted === messages) fitted = messages.slice();
			if (content === message.content) content = message.content.slice();
			content[blockIndex] = PROCESSED_IMAGE_MARKER;
			fitted[index] = Object.assign({}, message, { content });
			if (measureBytes(fitted) <= WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) return fitted;
		}
	}
}
//#endregion
export { windowWorkerReplayMessages as n, fitWorkerReplayImages as t };
