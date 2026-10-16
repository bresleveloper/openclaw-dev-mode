import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/shared/assistant-display-content.ts
const ASSISTANT_DISPLAY_CONTENT_FIELD = "openclawDisplayContent";
function isAssistantModelContentBlock(value) {
	const block = asOptionalRecord(value);
	if (!block) return false;
	if (block.type === "text") return typeof block.text === "string";
	if (block.type === "thinking") return typeof block.thinking === "string";
	return block.type === "toolCall" && typeof block.id === "string" && typeof block.name === "string" && asOptionalRecord(block.arguments) !== void 0;
}
function retainAssistantModelContent(blocks) {
	return blocks.filter(isAssistantModelContentBlock).map((block) => Object.assign({}, block));
}
function readAssistantDisplayContent(message) {
	const record = asOptionalRecord(message);
	if (!record) return [];
	const display = record[ASSISTANT_DISPLAY_CONTENT_FIELD];
	const content = Array.isArray(display) ? display : record.content;
	return Array.isArray(content) ? content.filter(isRecord) : [];
}
function projectAssistantDisplayContent(message) {
	const display = message[ASSISTANT_DISPLAY_CONTENT_FIELD];
	if (message.role !== "assistant" || !Array.isArray(display)) return message;
	const { [ASSISTANT_DISPLAY_CONTENT_FIELD]: _, ...rest } = message;
	return {
		...rest,
		content: display
	};
}
//#endregion
export { retainAssistantModelContent as i, projectAssistantDisplayContent as n, readAssistantDisplayContent as r, ASSISTANT_DISPLAY_CONTENT_FIELD as t };
