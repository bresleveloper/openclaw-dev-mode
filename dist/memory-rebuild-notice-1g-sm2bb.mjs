import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/memory-core/src/memory-rebuild-notice.ts
function captureMemoryRebuildNotice(status) {
	const notice = asNullableRecord(status.custom?.automaticRebuildNotice);
	const sequence = notice?.sequence;
	return () => notice?.sequence !== sequence && typeof notice?.warning === "string" ? notice.warning : void 0;
}
//#endregion
export { captureMemoryRebuildNotice as t };
