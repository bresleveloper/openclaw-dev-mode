import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
//#region packages/gateway-protocol/src/gateway-error-details.ts
/** Display projection for an assistant failure without visible reply content. */
const GATEWAY_ASSISTANT_ERROR_FALLBACK_TEXT = "The agent run failed before producing a reply.";
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
const ErrorCodes = {
	/** @deprecated Retained for source compatibility; no current server emitter. */
	NOT_LINKED: "NOT_LINKED",
	/** Device exists but still needs an explicit pairing approval. */
	NOT_PAIRED: "NOT_PAIRED",
	/** @deprecated Retained for source compatibility; no current server emitter. */
	AGENT_TIMEOUT: "AGENT_TIMEOUT",
	/** Request payload failed protocol validation or method preconditions. */
	INVALID_REQUEST: "INVALID_REQUEST",
	/** Authenticated caller lacks permission for the requested operation. */
	FORBIDDEN: "FORBIDDEN",
	/** Approval resolution referenced a missing or expired approval request. */
	APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
	/** Gateway service or required backend is temporarily unavailable. */
	UNAVAILABLE: "UNAVAILABLE"
};
/** Stable discriminants for structured method-level failures. */
const GatewayErrorDetailCodes = {
	CRON_JOB_NOT_FOUND: "CRON_JOB_NOT_FOUND",
	MISSING_SCOPE: "MISSING_SCOPE",
	MCP_APP_VIEW_EXPIRED: "MCP_APP_VIEW_EXPIRED",
	OUTBOUND_DELIVERY_QUEUED: "OUTBOUND_DELIVERY_QUEUED",
	USER_PREFS_LIMIT_EXCEEDED: "USER_PREFS_LIMIT_EXCEEDED",
	SESSION_COMPANION_BUSY: "SESSION_COMPANION_BUSY",
	PROJECT_CLONE_FAILED: "PROJECT_CLONE_FAILED",
	UNKNOWN_AGENT_ID: "UNKNOWN_AGENT_ID",
	WIZARD_NOT_FOUND: "WIZARD_NOT_FOUND",
	SETUP_ADMISSION_BUSY: "SETUP_ADMISSION_BUSY",
	GITHUB_PUBLICATION_SELECTION_REJECTED: "GITHUB_PUBLICATION_SELECTION_REJECTED",
	SESSION_WORKSPACE_RECOVERY_REQUIRED: "SESSION_WORKSPACE_RECOVERY_REQUIRED",
	TASK_WORKTREE_SOURCE_REQUIRED: "TASK_WORKTREE_SOURCE_REQUIRED",
	TASK_HISTORY_PREVIEW_CAPACITY: "TASK_HISTORY_PREVIEW_CAPACITY",
	CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED: "CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED",
	CLAW_REVIEW_REQUIRED: "CLAW_REVIEW_REQUIRED"
};
function readClawHubRiskAcknowledgementRequiredError(error) {
	const record = asNullableRecord(error);
	const details = asNullableRecord(record?.details);
	const warning = typeof details?.warning === "string" ? details.warning.trim() : "";
	return record?.code === ErrorCodes.INVALID_REQUEST && details?.code === GatewayErrorDetailCodes.CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED && warning ? {
		code: GatewayErrorDetailCodes.CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED,
		warning
	} : null;
}
function readClawReviewRequiredError(error) {
	const record = asNullableRecord(error);
	const details = asNullableRecord(record?.details);
	return record?.code === ErrorCodes.INVALID_REQUEST && details?.code === GatewayErrorDetailCodes.CLAW_REVIEW_REQUIRED && (details.kind === "plugin" || details.kind === "skill") ? {
		code: GatewayErrorDetailCodes.CLAW_REVIEW_REQUIRED,
		kind: details.kind
	} : null;
}
const LEGACY_MISSING_SCOPE_PATTERN = /\bmissing scope:\s*([a-z0-9._-]+)/i;
/** Reads a typed cron lookup miss without parsing operator-facing prose. */
function readCronJobNotFoundError(error) {
	const record = asNullableRecord(error);
	const details = asNullableRecord(record?.details);
	if (details?.code !== GatewayErrorDetailCodes.CRON_JOB_NOT_FOUND) return null;
	const jobId = typeof details.jobId === "string" ? details.jobId.trim() : "";
	return jobId ? {
		code: GatewayErrorDetailCodes.CRON_JOB_NOT_FOUND,
		jobId
	} : null;
}
/** Reads validated missing-scope details from an untrusted protocol payload. */
function readMissingScopeErrorDetails(details) {
	const record = asNullableRecord(details);
	if (record?.code !== GatewayErrorDetailCodes.MISSING_SCOPE) return null;
	const missingScope = typeof record.missingScope === "string" ? record.missingScope.trim() : "";
	const requiredScopes = Array.isArray(record.requiredScopes) ? record.requiredScopes.map((scope) => typeof scope === "string" ? scope.trim() : "") : [];
	if (!missingScope || requiredScopes.length === 0 || requiredScopes.some((scope) => !scope)) return null;
	return {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope,
		requiredScopes
	};
}
function isMcpAppViewExpiredError(error) {
	const record = asNullableRecord(error);
	return asNullableRecord(record?.details)?.code === GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED;
}
/**
* Reads a method-level missing-scope failure, preferring structured details.
* The message fallback keeps clients compatible with gateways predating structured details.
*/
function readMissingScopeError(error) {
	const record = asNullableRecord(error);
	if (!record) return null;
	const structured = readMissingScopeErrorDetails(record.details);
	if (structured) return structured;
	const code = typeof record.gatewayCode === "string" ? record.gatewayCode : typeof record.code === "string" ? record.code : "";
	if (code !== ErrorCodes.FORBIDDEN && code !== ErrorCodes.INVALID_REQUEST) return null;
	const missingScope = (typeof record.message === "string" ? record.message : "").match(LEGACY_MISSING_SCOPE_PATTERN)?.[1];
	return missingScope ? {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope,
		requiredScopes: [missingScope]
	} : null;
}
//#endregion
export { readClawHubRiskAcknowledgementRequiredError as a, readMissingScopeError as c, isMcpAppViewExpiredError as i, readMissingScopeErrorDetails as l, GATEWAY_ASSISTANT_ERROR_FALLBACK_TEXT as n, readClawReviewRequiredError as o, GatewayErrorDetailCodes as r, readCronJobNotFoundError as s, ErrorCodes as t };
