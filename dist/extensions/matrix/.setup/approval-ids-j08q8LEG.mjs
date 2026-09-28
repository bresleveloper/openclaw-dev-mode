import { a as normalizeMatrixUserId } from "./channel.setup-C6KvBV8l.mjs";
//#region extensions/matrix/src/approval-ids.ts
function normalizeMatrixApproverId(value) {
	return normalizeMatrixUserId(String(value)) || void 0;
}
//#endregion
export { normalizeMatrixApproverId as t };
