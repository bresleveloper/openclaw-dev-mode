import { s as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { n as summarizeApprovalScope } from "./approval-scope-DTzlGETe.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-Dx5Fhv49.mjs";
import { s as buildTypedApprovalActionDescriptors } from "./exec-approval-reply-Dn62m4ql.mjs";
import { h as normalizeApprovalRequest } from "./approval-request-account-binding-CVzeB0WI.mjs";
import { t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-CXSi5KK6.mjs";
import { t as SYSTEM_AGENT_APPROVAL_DECISIONS } from "./system-agent-approvals-r0J6k0r_.mjs";
//#region src/infra/approval-view-model.ts
function buildMetadata(entries) {
	return entries.flatMap(([label, value]) => value ? [{
		label,
		value
	}] : []);
}
function buildExecMetadata(request) {
	const metadata = buildMetadata([
		["Agent", request.request.agentId],
		["CWD", request.request.cwd],
		["Host", request.request.host]
	]);
	if (Array.isArray(request.request.envKeys) && request.request.envKeys.length > 0) metadata.push({
		label: "Env Overrides",
		value: request.request.envKeys.join(", ")
	});
	if (request.request.scope) metadata.push({
		label: "Scope",
		value: summarizeApprovalScope(request.request.scope)
	});
	return metadata;
}
function buildPluginMetadata(request) {
	const severity = request.request.severity ?? "warning";
	const metadata = buildMetadata([
		["Severity", severity === "critical" ? "Critical" : severity === "info" ? "Info" : "Warning"],
		["Tool", request.request.toolName],
		["Plugin", request.request.pluginId],
		["Agent", request.request.agentId]
	]);
	if (request.request.scope) metadata.push({
		label: "Scope",
		value: summarizeApprovalScope(request.request.scope)
	});
	return metadata;
}
function buildExecViewBase(request, phase) {
	const { commandText, commandPreview } = resolveExecApprovalCommandDisplay(request.request);
	return {
		approvalId: request.id,
		approvalKind: "exec",
		phase,
		title: phase === "pending" ? "Exec Approval Required" : "Exec Approval",
		description: phase === "pending" ? "A command needs your approval." : null,
		metadata: buildExecMetadata(request),
		ask: request.request.ask ?? null,
		agentId: request.request.agentId ?? null,
		warningText: request.request.warningText ?? null,
		commandAnalysis: request.request.commandAnalysis ?? null,
		commandText,
		commandPreview,
		cwd: request.request.cwd ?? null,
		envKeys: request.request.envKeys ?? void 0,
		host: request.request.host ?? null,
		nodeId: request.request.nodeId ?? null,
		...request.request.scope ? { scope: request.request.scope } : {},
		sessionKey: request.request.sessionKey ?? null
	};
}
function buildPluginViewBase(request, phase) {
	return {
		approvalId: request.id,
		approvalKind: "plugin",
		phase,
		title: request.request.title,
		description: request.request.description ?? null,
		metadata: buildPluginMetadata(request),
		agentId: request.request.agentId ?? null,
		pluginId: request.request.pluginId ?? null,
		...request.request.scope ? { scope: request.request.scope } : {},
		toolName: request.request.toolName ?? null,
		severity: request.request.severity ?? "warning"
	};
}
function buildSystemAgentViewBase(request, phase) {
	return {
		approvalId: request.id,
		approvalKind: "system-agent",
		phase,
		title: phase === "pending" ? "OpenClaw change requires approval" : "OpenClaw change",
		description: request.request.description,
		metadata: request.request.agentId ? [{
			label: "Agent",
			value: request.request.agentId
		}] : [],
		agentId: request.request.agentId ?? null,
		commandText: request.request.description,
		commandPreview: request.request.description,
		cwd: null,
		host: "gateway",
		nodeId: null,
		sessionKey: request.request.sessionKey ?? null,
		operationSummary: request.request.description
	};
}
function buildApprovalViewBase(request, phase) {
	if (request.approvalKind === "system-agent") return buildSystemAgentViewBase(request, phase);
	if (request.approvalKind === "plugin") return buildPluginViewBase(request, phase);
	return buildExecViewBase(request, phase);
}
/** Builds the presentation model for an unresolved approval. */
function buildPendingApprovalView(request) {
	const normalizedRequest = normalizeApprovalRequest(request);
	const allowedDecisions = normalizedRequest.approvalKind === "system-agent" ? SYSTEM_AGENT_APPROVAL_DECISIONS : normalizedRequest.approvalKind === "plugin" ? resolveCanonicalPluginApprovalRequestAllowedDecisions(normalizedRequest.request) : resolveExecApprovalRequestAllowedDecisions(normalizedRequest.request);
	return {
		...buildApprovalViewBase(normalizedRequest, "pending"),
		actions: buildTypedApprovalActionDescriptors({
			approvalCommandId: normalizedRequest.id,
			approvalKind: normalizedRequest.approvalKind,
			allowedDecisions
		}),
		expiresAtMs: normalizedRequest.expiresAtMs
	};
}
/** Builds the presentation model for an approval after a decision was recorded. */
function buildResolvedApprovalView(request, resolved) {
	const view = buildApprovalViewBase(normalizeApprovalRequest(request), "resolved");
	return {
		...view,
		decision: resolved.decision,
		resolvedBy: resolved.resolvedBy,
		...view.approvalKind === "system-agent" ? {
			applicationStatus: resolved.applicationStatus,
			terminalStatus: resolved.terminalStatus
		} : {}
	};
}
/** Builds the presentation model shown when an approval can no longer be acted on. */
function buildExpiredApprovalView(request) {
	return buildApprovalViewBase(normalizeApprovalRequest(request), "expired");
}
//#endregion
export { buildPendingApprovalView as n, buildResolvedApprovalView as r, buildExpiredApprovalView as t };
