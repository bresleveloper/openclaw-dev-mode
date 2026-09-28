import { v as parseDateFirstTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
//#region src/agents/thinking-signatures.ts
function isAssistantMessageWithContent(message) {
	return Boolean(message) && typeof message === "object" && message.role === "assistant" && Array.isArray(message.content);
}
function isThinkingBlock(block) {
	return Boolean(block) && typeof block === "object" && (block.type === "thinking" || block.type === "redacted_thinking");
}
function stripSignatureFieldsFromThinkingBlock(block) {
	const stripped = { ...block };
	Reflect.deleteProperty(stripped, "thinkingSignature");
	Reflect.deleteProperty(stripped, "signature");
	Reflect.deleteProperty(stripped, "thought_signature");
	if (Reflect.get(block, "type") === "redacted_thinking") Reflect.deleteProperty(stripped, "data");
	return stripped;
}
function stripThinkingSignaturesFromMessage(message) {
	if (!isAssistantMessageWithContent(message)) return message;
	let changed = false;
	const newContent = [];
	for (const block of message.content) {
		if (!isThinkingBlock(block)) {
			newContent.push(block);
			continue;
		}
		const type = Reflect.get(block, "type");
		if (!(Reflect.get(block, "thinkingSignature") != null || Reflect.get(block, "signature") != null || Reflect.get(block, "thought_signature") != null || type === "redacted_thinking" && Reflect.get(block, "data") != null)) {
			newContent.push(block);
			continue;
		}
		newContent.push(stripSignatureFieldsFromThinkingBlock(block));
		changed = true;
	}
	return changed ? {
		...message,
		content: newContent
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
