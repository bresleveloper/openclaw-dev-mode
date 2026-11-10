import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import { createHmac, randomBytes } from "node:crypto";
//#region src/gateway/operator-approval-runtime-token.ts
const APPROVAL_RUNTIME_TOKEN_CONTEXT = "openclaw:gateway-approval-runtime-token:v1";
let fallbackApprovalRuntimeToken = null;
function deriveApprovalRuntimeToken(socketToken) {
	return createHmac("sha256", socketToken).update(APPROVAL_RUNTIME_TOKEN_CONTEXT).digest("base64url");
}
async function readSharedApprovalRuntimeToken() {
	const token = (await loadExecApprovalsReadOnlyAsync()).socket?.token?.trim();
	return token ? deriveApprovalRuntimeToken(token) : null;
}
function getFallbackApprovalRuntimeToken() {
	fallbackApprovalRuntimeToken ??= randomBytes(32).toString("base64url");
	return fallbackApprovalRuntimeToken;
}
/**
* Returns the token used to authorize local operator-approval clients.
*/
async function getOperatorApprovalRuntimeToken() {
	const sharedToken = await readSharedApprovalRuntimeToken();
	if (sharedToken) return sharedToken;
	return getFallbackApprovalRuntimeToken();
}
/**
* Validates a presented loopback approval token without accepting empty or partial matches.
*/
async function isOperatorApprovalRuntimeToken(value) {
	const token = value?.trim();
	if (!token) return false;
	const sharedToken = await readSharedApprovalRuntimeToken();
	if (safeEqualSecret(token, sharedToken)) return true;
	const fallbackToken = fallbackApprovalRuntimeToken ?? (sharedToken ? null : getFallbackApprovalRuntimeToken());
	return safeEqualSecret(token, fallbackToken);
}
//#endregion
export { isOperatorApprovalRuntimeToken as n, getOperatorApprovalRuntimeToken as t };
