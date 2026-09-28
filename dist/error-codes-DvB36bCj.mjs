import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { a as NonEmptyString } from "./primitives-C-2-W5SF.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/error-codes.ts
const CronJobNotFoundErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.CRON_JOB_NOT_FOUND),
	jobId: NonEmptyString
});
/** Missing operator-scope details shared by WebSocket and HTTP responses. */
const MissingScopeErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.MISSING_SCOPE),
	missingScope: NonEmptyString,
	requiredScopes: Type.Array(NonEmptyString, { minItems: 1 })
});
const McpAppViewExpiredErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED) });
const OutboundDeliveryQueuedErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.OUTBOUND_DELIVERY_QUEUED) });
const UserPrefsLimitExceededErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.USER_PREFS_LIMIT_EXCEEDED),
	limit: Type.Integer({ minimum: 1 }),
	currentCount: Type.Integer({ minimum: 0 })
});
const UnknownAgentIdErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.UNKNOWN_AGENT_ID),
	agentId: NonEmptyString
});
const SetupAdmissionBusyErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.SETUP_ADMISSION_BUSY) });
const GitHubPublicationSelectionRejectedErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.GITHUB_PUBLICATION_SELECTION_REJECTED),
	idempotencyKey: NonEmptyString
});
const WizardNotFoundErrorDetailsSchema = closedObject({ code: Type.Literal(GatewayErrorDetailCodes.WIZARD_NOT_FOUND) });
const ProjectCloneErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.PROJECT_CLONE_FAILED),
	cause: Type.String({ enum: [
		"invalid_url",
		"auth_required",
		"not_found",
		"network",
		"target_exists",
		"clone_failed"
	] })
});
const RevisionHashSchema = Type.String({ pattern: "^[a-fA-F0-9]{64}$" });
const SkillProposalRevisionChangedErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.SKILL_PROPOSAL_REVISION_CHANGED),
	expectedRevisionHash: RevisionHashSchema,
	currentRevisionHash: RevisionHashSchema
});
const SessionWorkspaceRecoveryRequiredErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.SESSION_WORKSPACE_RECOVERY_REQUIRED),
	cause: Type.Literal("device_offline"),
	recoveryAction: Type.Literal("continue_on_gateway"),
	sessionId: NonEmptyString,
	source: closedObject({
		generation: Type.Integer({ minimum: 0 }),
		environmentId: NonEmptyString,
		ownerEpoch: Type.Integer({ minimum: 1 })
	})
});
/** Structured details emitted by method-level failures. */
const TaskWorktreeSourceRequiredErrorDetailsSchema = closedObject({
	code: Type.Literal(GatewayErrorDetailCodes.TASK_WORKTREE_SOURCE_REQUIRED),
	cwd: NonEmptyString
});
/** Structured details emitted by method-level failures. */
const GatewayErrorDetailsSchema = Type.Union([
	CronJobNotFoundErrorDetailsSchema,
	MissingScopeErrorDetailsSchema,
	McpAppViewExpiredErrorDetailsSchema,
	OutboundDeliveryQueuedErrorDetailsSchema,
	UserPrefsLimitExceededErrorDetailsSchema,
	SkillProposalRevisionChangedErrorDetailsSchema,
	ProjectCloneErrorDetailsSchema,
	UnknownAgentIdErrorDetailsSchema,
	WizardNotFoundErrorDetailsSchema,
	SetupAdmissionBusyErrorDetailsSchema,
	GitHubPublicationSelectionRejectedErrorDetailsSchema,
	SessionWorkspaceRecoveryRequiredErrorDetailsSchema,
	TaskWorktreeSourceRequiredErrorDetailsSchema
]);
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
function errorShape(code, message, opts) {
	return {
		code,
		message,
		...opts
	};
}
/** Builds structured details for a missing operator scope. */
function buildMissingScopeErrorDetails(params) {
	const requiredScopes = params.requiredScopes.length > 0 ? [...params.requiredScopes] : [params.missingScope];
	return {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope: params.missingScope,
		requiredScopes
	};
}
/** Builds a forbidden error for a missing operator scope without message parsing. */
function missingScopeErrorShape(params) {
	const details = buildMissingScopeErrorDetails(params);
	return errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${params.missingScope}`, { details });
}
//#endregion
export { ProjectCloneErrorDetailsSchema as a, SkillProposalRevisionChangedErrorDetailsSchema as c, buildMissingScopeErrorDetails as d, errorShape as f, OutboundDeliveryQueuedErrorDetailsSchema as i, UserPrefsLimitExceededErrorDetailsSchema as l, GatewayErrorDetailsSchema as n, SessionWorkspaceRecoveryRequiredErrorDetailsSchema as o, missingScopeErrorShape as p, MissingScopeErrorDetailsSchema as r, SetupAdmissionBusyErrorDetailsSchema as s, CronJobNotFoundErrorDetailsSchema as t, WizardNotFoundErrorDetailsSchema as u };
