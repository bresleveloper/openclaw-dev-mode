import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
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
	SKILL_PROPOSAL_REVISION_CHANGED: "SKILL_PROPOSAL_REVISION_CHANGED",
	PROJECT_CLONE_FAILED: "PROJECT_CLONE_FAILED",
	UNKNOWN_AGENT_ID: "UNKNOWN_AGENT_ID",
	WIZARD_NOT_FOUND: "WIZARD_NOT_FOUND",
	SETUP_ADMISSION_BUSY: "SETUP_ADMISSION_BUSY",
	GITHUB_PUBLICATION_SELECTION_REJECTED: "GITHUB_PUBLICATION_SELECTION_REJECTED",
	SESSION_WORKSPACE_RECOVERY_REQUIRED: "SESSION_WORKSPACE_RECOVERY_REQUIRED",
	TASK_WORKTREE_SOURCE_REQUIRED: "TASK_WORKTREE_SOURCE_REQUIRED"
};
const LEGACY_MISSING_SCOPE_PATTERN = /\bmissing scope:\s*([a-z0-9._-]+)/i;
const SHA256_PATTERN = /^[a-fA-F0-9]{64}$/;
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
/** Builds the canonical stale-draft details shared by Skill Workshop RPCs. */
function buildSkillProposalRevisionChangedErrorDetails(params) {
	return {
		code: GatewayErrorDetailCodes.SKILL_PROPOSAL_REVISION_CHANGED,
		expectedRevisionHash: params.expectedRevisionHash,
		currentRevisionHash: params.currentRevisionHash
	};
}
/** Reads a stale Skill Workshop decision without parsing operator-facing prose. */
function readSkillProposalRevisionChangedError(error) {
	const record = asNullableRecord(error);
	const details = asNullableRecord(record?.details);
	if (details?.code !== GatewayErrorDetailCodes.SKILL_PROPOSAL_REVISION_CHANGED) return null;
	const expectedRevisionHash = typeof details.expectedRevisionHash === "string" ? details.expectedRevisionHash : "";
	const currentRevisionHash = typeof details.currentRevisionHash === "string" ? details.currentRevisionHash : "";
	if (!SHA256_PATTERN.test(expectedRevisionHash) || !SHA256_PATTERN.test(currentRevisionHash)) return null;
	return buildSkillProposalRevisionChangedErrorDetails({
		expectedRevisionHash,
		currentRevisionHash
	});
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
	const gatewayError = record;
	const code = typeof gatewayError.gatewayCode === "string" ? gatewayError.gatewayCode : typeof gatewayError.code === "string" ? gatewayError.code : "";
	if (code !== ErrorCodes.FORBIDDEN && code !== ErrorCodes.INVALID_REQUEST) return null;
	const missingScope = (typeof gatewayError.message === "string" ? gatewayError.message : "").match(LEGACY_MISSING_SCOPE_PATTERN)?.[1];
	return missingScope ? {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope,
		requiredScopes: [missingScope]
	} : null;
}
//#endregion
export { isMcpAppViewExpiredError as a, readMissingScopeErrorDetails as c, buildSkillProposalRevisionChangedErrorDetails as i, readSkillProposalRevisionChangedError as l, GATEWAY_ASSISTANT_ERROR_FALLBACK_TEXT as n, readCronJobNotFoundError as o, GatewayErrorDetailCodes as r, readMissingScopeError as s, ErrorCodes as t };
