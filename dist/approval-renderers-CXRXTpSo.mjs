import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as resolvePluginApprovalRequestAllowedDecisions, l as buildPluginApprovalRequestMessage, u as buildPluginApprovalResolvedMessage } from "./plugin-approvals-DV5u4TwS.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-QZU5yCd0.mjs";
import { l as buildTypedApprovalPresentation, t as buildApprovalButtonPresentation } from "./exec-approval-reply-Cd667sf7.mjs";
//#region src/plugin-sdk/approval-renderers.ts
const DEFAULT_ALLOWED_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
/** Build a shipped command-backed approval payload. */
function buildApprovalPendingReplyPayload(params) {
	const allowedDecisions = params.allowedDecisions ?? DEFAULT_ALLOWED_DECISIONS;
	return {
		text: params.text,
		presentation: buildApprovalButtonPresentation({
			approvalId: params.approvalId,
			allowedDecisions
		}),
		channelData: {
			execApproval: {
				approvalId: params.approvalId,
				approvalSlug: params.approvalSlug,
				approvalKind: params.approvalKind ?? "exec",
				agentId: normalizeOptionalString(params.agentId),
				allowedDecisions,
				sessionKey: normalizeOptionalString(params.sessionKey),
				state: "pending"
			},
			...params.channelData
		}
	};
}
/** Build a pending approval payload with canonical typed decision actions. */
function buildTypedApprovalPendingReplyPayload(params) {
	return {
		...buildApprovalPendingReplyPayload(params),
		presentation: buildTypedApprovalPresentation({
			approvalId: params.approvalId,
			approvalKind: params.approvalKind,
			allowedDecisions: params.allowedDecisions ?? DEFAULT_ALLOWED_DECISIONS
		})
	};
}
/** Build a resolved approval reply payload with approval metadata but no controls. */
function buildApprovalResolvedReplyPayload(params) {
	return {
		text: params.text,
		channelData: {
			execApproval: {
				approvalId: params.approvalId,
				approvalSlug: params.approvalSlug,
				state: "resolved"
			},
			...params.channelData
		}
	};
}
/** Build pending plugin approval copy and metadata from a plugin approval request. */
function buildPluginApprovalPendingReplyPayload(params) {
	return buildApprovalPendingReplyPayload({
		approvalKind: "plugin",
		approvalId: params.request.id,
		approvalSlug: params.approvalSlug ?? params.request.id.slice(0, 8),
		text: params.text ?? buildPluginApprovalRequestMessage(params.request, params.nowMs),
		allowedDecisions: params.allowedDecisions ?? resolvePluginApprovalRequestAllowedDecisions(params.request.request),
		channelData: params.channelData
	});
}
/** Build a plugin approval prompt with canonical typed decision actions. */
function buildTypedPluginApprovalPendingReplyPayload(params) {
	return buildTypedApprovalPendingReplyPayload({
		approvalKind: "plugin",
		approvalId: params.request.id,
		approvalSlug: params.approvalSlug ?? params.request.id.slice(0, 8),
		text: params.text ?? buildPluginApprovalRequestMessage(params.request, params.nowMs),
		allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions({ allowedDecisions: params.allowedDecisions ?? params.request.request.allowedDecisions }),
		channelData: params.channelData
	});
}
/** Build resolved plugin approval copy and metadata from a plugin approval event. */
function buildPluginApprovalResolvedReplyPayload(params) {
	return buildApprovalResolvedReplyPayload({
		approvalId: params.resolved.id,
		approvalSlug: params.approvalSlug ?? params.resolved.id.slice(0, 8),
		text: params.text ?? buildPluginApprovalResolvedMessage(params.resolved),
		channelData: params.channelData
	});
}
//#endregion
export { buildTypedApprovalPendingReplyPayload as a, buildPluginApprovalResolvedReplyPayload as i, buildApprovalResolvedReplyPayload as n, buildTypedPluginApprovalPendingReplyPayload as o, buildPluginApprovalPendingReplyPayload as r, buildApprovalPendingReplyPayload as t };
