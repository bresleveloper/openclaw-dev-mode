import { m as loadExecApprovals } from "./exec-approvals-BQlhahST.js";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
//#region src/gateway/operator-approval-runtime-token.ts
const APPROVAL_RUNTIME_TOKEN_CONTEXT = "openclaw:gateway-approval-runtime-token:v1";
let fallbackApprovalRuntimeToken = null;
function deriveApprovalRuntimeToken(socketToken) {
	return createHmac("sha256", socketToken).update(APPROVAL_RUNTIME_TOKEN_CONTEXT).digest("base64url");
}
function readSharedApprovalRuntimeToken() {
	const token = loadExecApprovals().socket?.token?.trim();
	return token ? deriveApprovalRuntimeToken(token) : null;
}
function tokenMatches(token, expected) {
	if (!expected) return false;
	const tokenBytes = Buffer.from(token);
	const expectedBytes = Buffer.from(expected);
	return tokenBytes.length === expectedBytes.length && timingSafeEqual(tokenBytes, expectedBytes);
}
/**
* Returns the token used to authorize local operator-approval clients.
*/
function getOperatorApprovalRuntimeToken() {
	const sharedToken = readSharedApprovalRuntimeToken();
	if (sharedToken) return sharedToken;
	fallbackApprovalRuntimeToken ??= randomBytes(32).toString("base64url");
	return fallbackApprovalRuntimeToken;
}
/**
* Validates a presented loopback approval token without accepting empty or partial matches.
*/
function isOperatorApprovalRuntimeToken(value) {
	const token = value?.trim();
	if (!token) return false;
	const sharedToken = readSharedApprovalRuntimeToken();
	if (tokenMatches(token, sharedToken)) return true;
	return tokenMatches(token, fallbackApprovalRuntimeToken ?? (sharedToken ? null : getOperatorApprovalRuntimeToken()));
}
//#endregion
export { isOperatorApprovalRuntimeToken as n, getOperatorApprovalRuntimeToken as t };
