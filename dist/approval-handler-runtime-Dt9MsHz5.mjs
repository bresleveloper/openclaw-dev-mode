import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as buildPluginApprovalExpiredMessage, o as buildPluginApprovalResolvedMessage } from "./plugin-approvals-BXljsQyC.mjs";
import { c as normalizeApprovalRequest } from "./approval-request-account-binding-I7l4AwjN.mjs";
import "./approval-gateway-runtime-BYi8ARVi.mjs";
import { n as buildSystemAgentApprovalResolvedText, t as SYSTEM_AGENT_APPROVAL_EXPIRED_TEXT } from "./approval-terminal-D_V2O5Tg.mjs";
import "./approval-handler-runtime-CNuQg7kO.mjs";
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
	return `✅ Exec approval ${params.resolved.decision}.${resolvedByText} ID: ${params.request.id}`;
}
/** Builds channel-visible expiration text for exec and plugin approvals. */
function buildChannelApprovalExpiredText(params) {
	const request = normalizeApprovalRequest(params.request);
	if (request.approvalKind === "system-agent") return SYSTEM_AGENT_APPROVAL_EXPIRED_TEXT;
	if (request.approvalKind === "plugin") return buildPluginApprovalExpiredMessage(request);
	return `⏱️ Exec approval expired. ID: ${request.id}`;
}
function resolvePreparedApprovalAccountId(params) {
	return normalizeOptionalString(params.plannedAccountId) ?? normalizeOptionalString(params.contextAccountId) ?? normalizeOptionalString(params.fallbackAccountId);
}
//#endregion
export { buildChannelApprovalResolvedText as n, resolvePreparedApprovalAccountId as r, buildChannelApprovalExpiredText as t };
