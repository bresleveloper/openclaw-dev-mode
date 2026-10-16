import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as readOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
//#region src/gateway/upload-policy.ts
const GATEWAY_UPLOADS_DISABLED_CODE = "UPLOADS_DISABLED";
const GATEWAY_UPLOADS_DISABLED_MESSAGE = "File and image uploads are disabled by gateway.uploads.enabled";
/** Client ingress policy, not a restriction on generated media or agent filesystem tools. */
function areGatewayUploadsEnabled(config) {
	return config?.gateway?.uploads?.enabled !== false;
}
function disabledUploadError() {
	return errorShape(ErrorCodes.FORBIDDEN, GATEWAY_UPLOADS_DISABLED_MESSAGE, { details: { code: GATEWAY_UPLOADS_DISABLED_CODE } });
}
/** Pure policy guard suitable for native write admission; it performs no database reads. */
function assertGatewayUploadsEnabled(config) {
	if (!areGatewayUploadsEnabled(config)) throw new SessionMutationAuthorizationChangedError(disabledUploadError());
}
function isNodeUploadRequest(command, params) {
	if (command === "terminal.upload" || command === "browser.proxy.upload.v1") return true;
	return command === "file.write" && isRecord(params) && typeof params.contentBase64 === "string";
}
function hasAttachments(params) {
	return Array.isArray(params.attachments) && params.attachments.length > 0;
}
function isInlineMedia(value) {
	return typeof value === "string" && /^data:/i.test(value.trim());
}
function hasInlineMessageMedia(params) {
	return typeof params.buffer === "string" && params.buffer.length > 0 || [
		params.media,
		params.mediaUrl,
		params.path,
		params.filePath
	].some(isInlineMedia) || Array.isArray(params.mediaUrls) && params.mediaUrls.some(isInlineMedia);
}
/** Classify bytes accepted from clients, without confusing text edits or downloads with uploads. */
function isGatewayUploadRequest(method, params) {
	switch (method) {
		case "terminal.upload":
		case "users.setAvatar":
		case "skills.upload.begin":
		case "skills.upload.chunk":
		case "skills.upload.commit":
		case "skills.library.upload": return true;
	}
	if (!isRecord(params)) return false;
	switch (method) {
		case "mcp.app.formResource": return params.action === "upload";
		case "chat.send":
		case "agent":
		case "sessions.create":
		case "sessions.send":
		case "sessions.steer":
		case "sessions.companion.ask": return hasAttachments(params);
		case "node.invoke": return typeof params.command === "string" && isNodeUploadRequest(params.command, params.params);
		case "skills.install": return params.source === "upload";
		case "skills.library.save": return Array.isArray(params.files) && params.files.length > 0;
		case "skills.proposals.create":
		case "skills.proposals.update":
		case "skills.proposals.revise": return Array.isArray(params.supportFiles) && params.supportFiles.length > 0;
		case "agents.create":
		case "agents.update": return isInlineMedia(params.avatar);
		case "send": return hasInlineMessageMedia(params);
		case "message.action": return isRecord(params.params) && hasInlineMessageMedia(params.params);
		default: return false;
	}
}
/** Trusted in-process media delivery is not client ingress; wire params cannot grant this. */
function gatewayClientUploadPolicyError(params) {
	if (!isGatewayUploadRequest(params.method, params.requestParams)) return null;
	try {
		readOperatorToolGatewayAuthority()?.assertInputCommitAllowed?.();
	} catch (error) {
		if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
		return error.error;
	}
	return currentClientUploadPolicyError(params);
}
function currentClientUploadPolicyError(params) {
	if (params.client?.internal?.syntheticClient || params.client?.internal?.agentRuntimeIdentity) return null;
	return areGatewayUploadsEnabled((params.context.getCommittedRuntimeConfig ?? params.context.getRuntimeConfig)()) ? null : disabledUploadError();
}
/** Carry only client-upload policy into worker commits, never opaque SDK guards that may read SQL. */
function captureGatewayClientUploadCommitGuard(params) {
	const hasUploads = isGatewayUploadRequest(params.method, params.requestParams);
	const assertInheritedInput = readOperatorToolGatewayAuthority()?.assertInputCommitAllowed;
	if (!hasUploads && !assertInheritedInput) return;
	return () => {
		assertInheritedInput?.();
		const error = hasUploads ? currentClientUploadPolicyError(params) : null;
		if (error) throw new SessionMutationAuthorizationChangedError(error);
	};
}
//#endregion
export { captureGatewayClientUploadCommitGuard as a, assertGatewayUploadsEnabled as i, GATEWAY_UPLOADS_DISABLED_MESSAGE as n, gatewayClientUploadPolicyError as o, areGatewayUploadsEnabled as r, isGatewayUploadRequest as s, GATEWAY_UPLOADS_DISABLED_CODE as t };
