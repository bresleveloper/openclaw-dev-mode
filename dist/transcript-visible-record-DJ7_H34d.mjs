import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import "./internal-runtime-context-BH-o1oq1.mjs";
//#region src/sessions/transcript-visible-record.ts
function isVisibleTranscriptRecord(value) {
	const record = asOptionalRecord(value);
	return Boolean(record?.message) || record?.type === "compaction" || record?.type === "reset" || record?.type === "custom_message" && record.display === true && record.customType !== "openclaw.runtime-context";
}
//#endregion
export { isVisibleTranscriptRecord as t };
