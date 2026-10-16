import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { n as summarizeApprovalScope } from "./approval-scope-D8jXLqpU.mjs";
//#region src/infra/plugin-approvals.ts
const DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS = 12e4;
const MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 6e5;
const PLUGIN_APPROVAL_DETAIL_MAX_LENGTH = 16384;
const PLUGIN_APPROVAL_DETAIL_TRUNCATION_SUFFIX = "…[truncated]";
const DEFAULT_PLUGIN_APPROVAL_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
/** Caps reviewer-only plugin detail by Unicode code point without splitting surrogate pairs. */
function truncatePluginApprovalDetail(value) {
	if (value.length <= PLUGIN_APPROVAL_DETAIL_MAX_LENGTH) return value;
	const bounded = truncateCodePoints(value, PLUGIN_APPROVAL_DETAIL_MAX_LENGTH);
	if (bounded === value) return value;
	const contentLimit = PLUGIN_APPROVAL_DETAIL_MAX_LENGTH - Array.from(PLUGIN_APPROVAL_DETAIL_TRUNCATION_SUFFIX).length;
	return `${truncateCodePoints(bounded, contentLimit)}${PLUGIN_APPROVAL_DETAIL_TRUNCATION_SUFFIX}`;
}
function resolvePluginApprovalTimeoutMs(value) {
	return Math.min(MAX_PLUGIN_APPROVAL_TIMEOUT_MS, Math.max(1, Math.floor(typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS)));
}
function approvalDecisionLabel(decision) {
	if (decision === "allow-once") return "allowed once";
	if (decision === "allow-always") return "allowed always";
	return "denied";
}
function resolvePluginApprovalRequestAllowedDecisions(params) {
	const explicit = [];
	if (Array.isArray(params?.allowedDecisions)) {
		for (const decision of params.allowedDecisions) if ((decision === "allow-once" || decision === "allow-always" || decision === "deny") && !explicit.includes(decision)) explicit.push(decision);
	}
	return explicit.length > 0 ? explicit : DEFAULT_PLUGIN_APPROVAL_DECISIONS;
}
function buildPluginApprovalRequestMessage(request, nowMsValue) {
	const lines = [];
	const severity = request.request.severity ?? "warning";
	const icon = severity === "critical" ? "🚨" : severity === "info" ? "ℹ️" : "🛡️";
	lines.push(`${icon} Plugin approval required`);
	lines.push(`Title: ${request.request.title}`);
	lines.push(`Description: ${request.request.description}`);
	if (request.request.scope) lines.push(`Scope: ${summarizeApprovalScope(request.request.scope)}`);
	if (request.request.toolName) lines.push(`Tool: ${request.request.toolName}`);
	if (request.request.pluginId) lines.push(`Plugin: ${request.request.pluginId}`);
	if (request.request.agentId) lines.push(`Agent: ${request.request.agentId}`);
	lines.push(`ID: ${request.id}`);
	const expiresIn = Math.max(0, Math.round((request.expiresAtMs - nowMsValue) / 1e3));
	lines.push(`Expires in: ${expiresIn}s`);
	lines.push(`Reply with: /approve ${request.id} ${resolvePluginApprovalRequestAllowedDecisions(request.request).join("|")}`);
	return lines.join("\n");
}
function buildPluginApprovalResolvedMessage(resolved) {
	return `${`✅ Plugin approval ${approvalDecisionLabel(resolved.decision)}.`}${resolved.resolvedBy ? ` Resolved by ${resolved.resolvedBy}.` : ""} ID: ${resolved.id}`;
}
function buildPluginApprovalExpiredMessage(request) {
	return `⏱️ Plugin approval expired. ID: ${request.id}`;
}
//#endregion
export { buildPluginApprovalRequestMessage as a, resolvePluginApprovalTimeoutMs as c, buildPluginApprovalExpiredMessage as i, truncatePluginApprovalDetail as l, MAX_PLUGIN_APPROVAL_TIMEOUT_MS as n, buildPluginApprovalResolvedMessage as o, approvalDecisionLabel as r, resolvePluginApprovalRequestAllowedDecisions as s, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS as t };
