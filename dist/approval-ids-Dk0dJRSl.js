import { n as normalizeMatrixUserId } from "./allowlist-B4NW92_F.js";
//#region extensions/matrix/src/approval-ids.ts
function normalizeMatrixApproverId(value) {
	return normalizeMatrixUserId(String(value)) || void 0;
}
//#endregion
export { normalizeMatrixApproverId as t };
