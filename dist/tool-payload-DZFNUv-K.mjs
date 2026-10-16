import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as parseStandalonePlainTextToolCallBlocks$1 } from "./src-1yL4ZLJM.mjs";
//#region src/plugin-sdk/tool-payload.ts
/** Parses a message made only of standalone plain-text tool call blocks. */
function parseStandalonePlainTextToolCallBlocks(text, options) {
	return parseStandalonePlainTextToolCallBlocks$1(text, options);
}
function isToolPayloadTextBlock(block) {
	const record = asOptionalObjectRecord(block);
	return record?.type === "text" && typeof record.text === "string";
}
/**
* Extract the most useful payload from tool result-like objects shared across
* outbound core flows and bundled plugin helpers.
*/
function extractToolPayload(result) {
	if (!result) return;
	if (result.details !== void 0) return result.details;
	const text = (Array.isArray(result.content) ? result.content.find(isToolPayloadTextBlock) : void 0)?.text;
	if (!text) return result.content ?? result;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
//#endregion
export { parseStandalonePlainTextToolCallBlocks as n, extractToolPayload as t };
