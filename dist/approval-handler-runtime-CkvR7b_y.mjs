import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { c as buildPluginApprovalExpiredMessage, u as buildPluginApprovalResolvedMessage } from "./plugin-approvals-DV5u4TwS.mjs";
import { s as normalizeApprovalRequest } from "./approval-request-account-binding-CJyRIlPn.mjs";
import "./approval-gateway-runtime-BXomq1FR.mjs";
import { n as buildApprovalResolvedReplyPayload } from "./approval-renderers-CXRXTpSo.mjs";
import { t as buildSystemAgentApprovalResolvedText } from "./approval-terminal-DsAX2U4_.mjs";
import "./approval-handler-runtime-DknjBBXO.mjs";
//#region src/plugin-sdk/approval-handler-runtime.ts
/**
* Runtime SDK subpath for approval handler adapters and approval view text helpers.
*/
/** Builds channel-visible resolved approval text for every approval kind. */
function buildChannelApprovalResolvedText(params) {
	if (params.view.approvalKind === "system-agent") return buildSystemAgentApprovalResolvedText({
		...params.view,
		decision: params.resolved.decision
	});
	if (params.view.approvalKind === "plugin") return buildPluginApprovalResolvedMessage(params.resolved);
	const resolvedByText = params.resolved.resolvedBy ? ` Resolved by ${params.resolved.resolvedBy}.` : "";
	return buildApprovalResolvedReplyPayload({
		approvalId: params.request.id,
		approvalSlug: params.request.id.slice(0, 8),
		text: `✅ Exec approval ${params.resolved.decision}.${resolvedByText} ID: ${params.request.id}`
	}).text ?? "";
}
/** Builds channel-visible expiration text for exec and plugin approvals. */
function buildChannelApprovalExpiredText(params) {
	const request = normalizeApprovalRequest(params.request);
	if (request.approvalKind === "system-agent") return "⏱️ OpenClaw change expired. No change was made.";
	if (request.approvalKind === "plugin") return buildPluginApprovalExpiredMessage(request);
	return `⏱️ Exec approval expired. ID: ${request.id}`;
}
function resolvePreparedApprovalAccountId(params) {
	return normalizeOptionalString(params.plannedAccountId) ?? normalizeOptionalString(params.contextAccountId) ?? normalizeOptionalString(params.fallbackAccountId);
}
//#endregion
export { buildChannelApprovalResolvedText as n, resolvePreparedApprovalAccountId as r, buildChannelApprovalExpiredText as t };
