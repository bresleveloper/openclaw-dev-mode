import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
//#region src/infra/approval-resolution-ref.ts
const APPROVAL_RESOLUTION_REF_LENGTH = 43;
/** Build the full SHA-256 base64url locator used only when a transport cannot carry the exact id. */
function buildApprovalResolutionRef(params) {
	return sha256Base64Url(`${params.approvalKind}\0${params.approvalId}`);
}
function isApprovalResolutionRef(value) {
	return value.length === APPROVAL_RESOLUTION_REF_LENGTH && /^[A-Za-z0-9_-]+$/u.test(value);
}
//#endregion
export { isApprovalResolutionRef as n, buildApprovalResolutionRef as t };
