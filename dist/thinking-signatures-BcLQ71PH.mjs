import { v as parseDateFirstTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
//#region src/agents/thinking-signatures.ts
function isAssistantMessageWithContent(message) {
	return Boolean(message) && typeof message === "object" && message.role === "assistant" && Array.isArray(message.content);
}
function isThinkingBlock(block) {
	return Boolean(block) && typeof block === "object" && (block.type === "thinking" || block.type === "redacted_thinking");
}
function stripThinkingSignaturesFromMessage(message) {
	let changed = false;
	const content = Array.from(message.content, (block) => {
		if (!isThinkingBlock(block)) return block;
		const signatureFields = [
			"thinkingSignature",
			"signature",
			"thought_signature"
		];
		if (Reflect.get(block, "type") === "redacted_thinking") signatureFields.push("data");
		if (!signatureFields.some((field) => Reflect.get(block, field) != null)) return block;
		const stripped = { ...block };
		for (const field of signatureFields) Reflect.deleteProperty(stripped, field);
		changed = true;
		return stripped;
	});
	return changed ? {
		...message,
		content
	} : message;
}
/**
* Strip signatures from assistant messages generated before the latest compaction.
* Their signatures are bound to the replaced prompt prefix and cannot be replayed.
*/
function stripStaleThinkingSignaturesForCompactionReplay(messages) {
	let latestCompactionTimestamp = null;
	for (const message of messages) {
		if (message.role !== "compactionSummary") continue;
		const timestamp = parseDateFirstTimestampMs(message.timestamp);
		if (timestamp !== void 0) latestCompactionTimestamp = latestCompactionTimestamp === null ? timestamp : Math.max(latestCompactionTimestamp, timestamp);
	}
	if (latestCompactionTimestamp === null) return messages;
	let touched = false;
	const out = messages.map((message) => {
		if (!isAssistantMessageWithContent(message)) return message;
		const timestamp = parseDateFirstTimestampMs(message.timestamp);
		if (timestamp === void 0 || timestamp >= latestCompactionTimestamp) return message;
		const stripped = stripThinkingSignaturesFromMessage(message);
		touched ||= stripped !== message;
		return stripped;
	});
	return touched ? out : messages;
}
//#endregion
export { isThinkingBlock as n, stripStaleThinkingSignaturesForCompactionReplay as r, isAssistantMessageWithContent as t };
