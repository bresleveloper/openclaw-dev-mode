import { D as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { n as summarizeApprovalScope } from "./approval-scope-CfvRogZm.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-QZU5yCd0.mjs";
import { c as buildTypedApprovalActionDescriptors } from "./exec-approval-reply-Cd667sf7.mjs";
import { s as normalizeApprovalRequest } from "./approval-request-account-binding-CJyRIlPn.mjs";
import { t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-Dzor4H8W.mjs";
import { t as SYSTEM_AGENT_APPROVAL_DECISIONS } from "./system-agent-approvals-r0J6k0r_.mjs";
//#region src/infra/approval-view-model.ts
function buildExecMetadata(request) {
	const metadata = [];
	if (request.request.agentId) metadata.push({
		label: "Agent",
		value: request.request.agentId
	});
	if (request.request.cwd) metadata.push({
		label: "CWD",
		value: request.request.cwd
	});
	if (request.request.host) metadata.push({
		label: "Host",
		value: request.request.host
	});
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
	const metadata = [];
	const severity = request.request.severity ?? "warning";
	metadata.push({
		label: "Severity",
		value: severity === "critical" ? "Critical" : severity === "info" ? "Info" : "Warning"
	});
	if (request.request.toolName) metadata.push({
		label: "Tool",
		value: request.request.toolName
	});
	if (request.request.pluginId) metadata.push({
		label: "Plugin",
		value: request.request.pluginId
	});
	if (request.request.agentId) metadata.push({
		label: "Agent",
		value: request.request.agentId
	});
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
/** Builds the presentation model for an unresolved exec or plugin approval. */
function buildPendingApprovalView(request) {
	const normalizedRequest = normalizeApprovalRequest(request);
	if (normalizedRequest.approvalKind === "system-agent") return {
		...buildSystemAgentViewBase(normalizedRequest, "pending"),
		actions: buildTypedApprovalActionDescriptors({
			approvalCommandId: normalizedRequest.id,
			approvalKind: normalizedRequest.approvalKind,
			allowedDecisions: SYSTEM_AGENT_APPROVAL_DECISIONS
		}),
		expiresAtMs: normalizedRequest.expiresAtMs
	};
	if (normalizedRequest.approvalKind === "plugin") return {
		...buildPluginViewBase(normalizedRequest, "pending"),
		actions: buildTypedApprovalActionDescriptors({
			approvalCommandId: normalizedRequest.id,
			approvalKind: normalizedRequest.approvalKind,
			allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(normalizedRequest.request)
		}),
		expiresAtMs: normalizedRequest.expiresAtMs
	};
	return {
		...buildExecViewBase(normalizedRequest, "pending"),
		actions: buildTypedApprovalActionDescriptors({
			approvalCommandId: normalizedRequest.id,
			approvalKind: normalizedRequest.approvalKind,
			ask: normalizedRequest.request.ask,
			allowedDecisions: resolveExecApprovalRequestAllowedDecisions(normalizedRequest.request)
		}),
		expiresAtMs: normalizedRequest.expiresAtMs
	};
}
/** Builds the presentation model for an approval after a decision was recorded. */
function buildResolvedApprovalView(request, resolved) {
	const normalizedRequest = normalizeApprovalRequest(request);
	if (normalizedRequest.approvalKind === "system-agent") return {
		...buildSystemAgentViewBase(normalizedRequest, "resolved"),
		decision: resolved.decision,
		resolvedBy: resolved.resolvedBy,
		applicationStatus: resolved.applicationStatus,
		terminalStatus: resolved.terminalStatus
	};
	if (normalizedRequest.approvalKind === "plugin") return {
		...buildPluginViewBase(normalizedRequest, "resolved"),
		decision: resolved.decision,
		resolvedBy: resolved.resolvedBy
	};
	return {
		...buildExecViewBase(normalizedRequest, "resolved"),
		decision: resolved.decision,
		resolvedBy: resolved.resolvedBy
	};
}
/** Builds the presentation model shown when an approval can no longer be acted on. */
function buildExpiredApprovalView(request) {
	const normalizedRequest = normalizeApprovalRequest(request);
	if (normalizedRequest.approvalKind === "system-agent") return buildSystemAgentViewBase(normalizedRequest, "expired");
	if (normalizedRequest.approvalKind === "plugin") return buildPluginViewBase(normalizedRequest, "expired");
	return buildExecViewBase(normalizedRequest, "expired");
}
//#endregion
export { buildPendingApprovalView as n, buildResolvedApprovalView as r, buildExpiredApprovalView as t };
