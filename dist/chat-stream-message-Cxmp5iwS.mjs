import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region packages/gateway-client/src/chat-stream-message.ts
/** A snapshot includes its delta; append-only frames require an existing baseline. */
function mergeChatStreamMessage(previous, payload) {
	if (payload.message !== void 0) return payload.message;
	const delta = payload.deltaText;
	if (typeof delta !== "string") return previous;
	const replace = payload.replace === true;
	if (!delta && !replace) return previous;
	if (!isRecord(previous) && !replace) return;
	const message = isRecord(previous) ? previous : { role: "assistant" };
	if (typeof message.content === "string") return {
		...message,
		content: replace ? delta : message.content + delta
	};
	const content = Array.isArray(message.content) ? [...message.content] : [];
	const isText = (block) => isRecord(block) && block.type === "text";
	if (replace) return {
		...message,
		content: [{
			type: "text",
			text: delta
		}, ...content.filter((block) => !isText(block))]
	};
	const index = content.findLastIndex(isText);
	const block = content[index];
	if (isText(block)) content[index] = {
		...block,
		text: `${typeof block.text === "string" ? block.text : ""}${delta}`
	};
	else content.push({
		type: "text",
		text: delta
	});
	return {
		...message,
		content
	};
}
//#endregion
export { mergeChatStreamMessage as t };
