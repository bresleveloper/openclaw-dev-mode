import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/shared/model-context-message.ts
const MODEL_CONTEXT_PRIVATE_METADATA_KEYS = ["upstreamUserText"];
function stripToolResultDetails(messages) {
	let touched = false;
	const out = messages.map((message) => {
		const record = asOptionalRecord(message);
		if (record?.role !== "toolResult" || !("details" in record)) return message;
		const sanitized = { ...record };
		delete sanitized.details;
		touched = true;
		return sanitized;
	});
	return touched ? out : messages;
}
/** A transient view; evidence and persistence readers must retain the original messages. */
function projectModelContextMessages(messages) {
	const output = [];
	for (const message of stripToolResultDetails(messages)) {
		const record = asOptionalRecord(message);
		const metadata = asOptionalRecord(record?.["__openclaw"]);
		if (!metadata || !MODEL_CONTEXT_PRIVATE_METADATA_KEYS.some((key) => key in metadata)) {
			output.push(message);
			continue;
		}
		const projected = { ...metadata };
		for (const key of MODEL_CONTEXT_PRIVATE_METADATA_KEYS) delete projected[key];
		output.push({
			...record,
			__openclaw: projected
		});
	}
	return output;
}
//#endregion
export { projectModelContextMessages as n, stripToolResultDetails as r, MODEL_CONTEXT_PRIVATE_METADATA_KEYS as t };
