import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as buildPluginApprovalRequestMessage, l as buildPluginApprovalResolvedMessage, u as resolvePluginApprovalRequestAllowedDecisions } from "./plugin-approvals-D2muXfhg.js";
import { r as buildApprovalPresentation } from "./exec-approval-reply-BVTlE_tw.js";
//#region src/plugin-sdk/approval-renderers.ts
const DEFAULT_ALLOWED_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
/** Build a pending approval reply payload using the portable presentation API. */
function buildApprovalPendingReplyPayload(params) {
	const allowedDecisions = params.allowedDecisions ?? DEFAULT_ALLOWED_DECISIONS;
	return {
		text: params.text,
		presentation: buildApprovalPresentation({
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
export { buildPluginApprovalResolvedReplyPayload as i, buildApprovalResolvedReplyPayload as n, buildPluginApprovalPendingReplyPayload as r, buildApprovalPendingReplyPayload as t };
