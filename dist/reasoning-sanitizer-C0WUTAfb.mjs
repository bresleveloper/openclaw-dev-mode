import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/opencode-go/reasoning-sanitizer.ts
const REASONING_REPLAY_FIELDS = [
	"reasoning_details",
	"reasoning_content",
	"reasoning",
	"reasoning_text"
];
const OMITTED_ASSISTANT_REASONING_TEXT = "[assistant reasoning omitted]";
function isReasoningReplayPart(value) {
	const type = asOptionalObjectRecord(value)?.type;
	return type === "thinking" || type === "redacted_thinking" || type === "reasoning";
}
function stripReasoningReplayFields(value) {
	const record = asOptionalObjectRecord(value);
	if (!record) return;
	for (const field of REASONING_REPLAY_FIELDS) delete record[field];
	const content = record.content;
	if (Array.isArray(content)) {
		const nextContent = stripReasoningReplayItems(content);
		record.content = nextContent.length > 0 ? nextContent : [{
			type: "text",
			text: OMITTED_ASSISTANT_REASONING_TEXT
		}];
	}
}
function stripReasoningReplayItems(items) {
	const retained = [];
	for (const item of items) if (!isReasoningReplayPart(item)) {
		stripReasoningReplayFields(item);
		retained.push(item);
	}
	return retained;
}
function stripOpencodeGoKimiReasoningPayload(payloadObj) {
	stripReasoningReplayFields(payloadObj);
	delete payloadObj.reasoning_effort;
	delete payloadObj.reasoningEffort;
	for (const key of ["messages", "input"]) if (Array.isArray(payloadObj[key])) payloadObj[key] = stripReasoningReplayItems(payloadObj[key]);
}
//#endregion
export { stripOpencodeGoKimiReasoningPayload as t };
