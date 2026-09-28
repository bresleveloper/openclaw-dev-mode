import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as sanitizeExecApprovalWarningText, n as sanitizeExecApprovalDisplayText, t as exceedsApprovalTextLimit } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
import { t as sanitizeApprovalScope } from "./approval-scope-CfvRogZm.mjs";
import { p as truncatePluginApprovalDetail } from "./plugin-approvals-DV5u4TwS.mjs";
import { t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-Dzor4H8W.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/approval-presentation.ts
const PLUGIN_EXTERNAL_RESOLUTION_LABEL_MAX_LENGTH = 80;
function normalizeDecisionList(decisions) {
	const result = [];
	for (const decision of decisions) if (!result.includes(decision)) result.push(decision);
	if (!result.includes("deny")) result.push("deny");
	return result;
}
function sanitizeOptionalSingleLine(value) {
	const normalized = normalizeOptionalString(value);
	return normalized ? sanitizeExecApprovalDisplayText(normalized) : null;
}
function normalizePluginExternalResolution(value) {
	if (!value) return null;
	const rawLabel = value.label?.trim();
	const label = rawLabel ? sanitizeExecApprovalDisplayText(rawLabel) : "";
	if (!label || exceedsApprovalTextLimit(label, PLUGIN_EXTERNAL_RESOLUTION_LABEL_MAX_LENGTH)) throw new Error("invalid external approval label");
	const decisions = value.decisions ?? ["allow-once"];
	if (decisions.length < 1 || decisions.length > 2 || decisions.some((decision) => decision !== "allow-once" && decision !== "allow-always") || new Set(decisions).size !== decisions.length) throw new Error("invalid external approval decisions");
	return {
		label,
		decisions: [...decisions]
	};
}
function buildExecApprovalPresentation(params) {
	if (!isRecord(params.request)) return null;
	const request = params.request;
	const { commandText, commandPreview } = resolveExecApprovalCommandDisplay(request);
	if (!commandText.trim()) return null;
	const warningText = typeof request.warningText === "string" && request.warningText.trim() ? sanitizeExecApprovalWarningText(request.warningText) : null;
	const scope = request.scope ? sanitizeApprovalScope(request.scope) : null;
	return {
		kind: "exec",
		commandText,
		commandPreview,
		warningText,
		host: sanitizeOptionalSingleLine(request.host),
		nodeId: sanitizeOptionalSingleLine(request.nodeId),
		agentId: sanitizeOptionalSingleLine(request.agentId),
		...scope ? { scope } : {},
		allowedDecisions: normalizeDecisionList(params.allowedDecisions)
	};
}
function buildPluginApprovalPresentation(params) {
	if (!isRecord(params.request)) return null;
	const request = params.request;
	const rawTitle = normalizeOptionalString(request.title);
	const rawDescription = normalizeOptionalString(request.description);
	if (!rawTitle || !rawDescription) return null;
	const title = sanitizeExecApprovalDisplayText(rawTitle);
	const description = sanitizeExecApprovalWarningText(rawDescription);
	if (exceedsApprovalTextLimit(title, 80) || exceedsApprovalTextLimit(description, 512)) return null;
	const severity = request.severity === "info" || request.severity === "warning" || request.severity === "critical" ? request.severity : "warning";
	const rawDetail = normalizeOptionalString(request.detail);
	const detail = rawDetail ? truncatePluginApprovalDetail(sanitizeExecApprovalWarningText(rawDetail)) : null;
	const scope = request.scope ? sanitizeApprovalScope(request.scope) : null;
	let externalResolution;
	try {
		externalResolution = normalizePluginExternalResolution(request.externalResolution);
	} catch {
		return null;
	}
	return {
		kind: "plugin",
		title,
		description,
		...detail ? { detail } : {},
		severity,
		pluginId: sanitizeOptionalSingleLine(request.pluginId),
		toolName: sanitizeOptionalSingleLine(request.toolName),
		agentId: sanitizeOptionalSingleLine(request.agentId),
		...scope ? { scope } : {},
		allowedDecisions: normalizeDecisionList(params.allowedDecisions),
		...externalResolution ? { externalResolution: {
			label: externalResolution.label,
			decisions: [...externalResolution.decisions ?? ["allow-once"]]
		} } : {}
	};
}
function buildSystemAgentApprovalPresentation(params) {
	if (!isRecord(params.request)) return null;
	const request = params.request;
	const title = normalizeOptionalString(request.title);
	const description = normalizeOptionalString(request.description);
	if (!title || !description || !/^[a-f0-9]{64}$/.test(request.proposalHash)) return null;
	return {
		kind: "system-agent",
		title: truncateUtf16Safe(sanitizeExecApprovalDisplayText(title), 80),
		description: truncateUtf16Safe(sanitizeExecApprovalWarningText(description), 512),
		proposalHash: request.proposalHash,
		agentId: sanitizeOptionalSingleLine(request.agentId),
		allowedDecisions: ["allow-once", "deny"]
	};
}
/** Returns the safe cross-surface presentation, or null when no prompt can be rendered. */
function buildApprovalPresentation(params) {
	if (params.kind === "exec") return buildExecApprovalPresentation(params);
	return params.kind === "plugin" ? buildPluginApprovalPresentation(params) : buildSystemAgentApprovalPresentation(params);
}
//#endregion
//#region src/gateway/exec-approval-registration.ts
const EXPLICIT_APPROVAL_ID_INVALID_CHAR_PATTERN = /[^A-Za-z0-9._:-]/;
/** Typed creation failure for an explicit approval id outside the shared safe format. */
var InvalidApprovalIdError = class extends Error {
	constructor() {
		super("approval id must be 1-128 characters using only letters, numbers, '.', '_', ':', or '-', and cannot be '.' or '..'");
		this.code = "EXEC_APPROVAL_ID_INVALID";
		this.reason = "INVALID_APPROVAL_ID";
		this.name = "InvalidApprovalIdError";
	}
};
function createExecApprovalRecord(request, timeoutMs, id) {
	const now = Date.now();
	const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(resolvedTimeoutMs, { nowMs: now });
	if (expiresAtMs === void 0) throw new Error("approval expiry is unavailable");
	const hasExplicitId = id !== null && id !== void 0 && id.length > 0;
	if (hasExplicitId && (id.length > 128 || id === "." || id === ".." || EXPLICIT_APPROVAL_ID_INVALID_CHAR_PATTERN.test(id))) throw new InvalidApprovalIdError();
	return {
		id: hasExplicitId ? id : randomUUID(),
		request,
		createdAtMs: now,
		expiresAtMs
	};
}
function prepareExecApprovalPresentation(kind, request, decisions) {
	const normalized = [];
	for (const decision of decisions ?? [
		"allow-once",
		"allow-always",
		"deny"
	]) if ((decision === "allow-once" || decision === "allow-always" || decision === "deny") && !normalized.includes(decision)) normalized.push(decision);
	if (!normalized.includes("deny")) normalized.push("deny");
	const presentation = buildApprovalPresentation({
		kind,
		request,
		allowedDecisions: normalized
	});
	if (!presentation) throw new Error("approval cannot be persisted without a valid reviewer presentation");
	return presentation;
}
function readRequestString(request, key) {
	const value = asOptionalObjectRecord(request)?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
async function prepareExecApprovalRegistration(params) {
	const { record } = params;
	const source = {
		agentId: readRequestString(record.request, "agentId"),
		sessionKey: readRequestString(record.request, "sessionKey"),
		sessionId: readRequestString(record.request, "sessionId"),
		runId: readRequestString(record.request, "runId"),
		toolCallId: readRequestString(record.request, "toolCallId"),
		toolName: readRequestString(record.request, "toolName")
	};
	let audienceSessionKeys = [];
	if (source.sessionKey) audienceSessionKeys = await params.resolveAudienceSessionKeys?.(source.sessionKey, source.agentId) ?? [source.sessionKey];
	return {
		id: record.id,
		kind: params.kind,
		presentation: params.presentation,
		requester: {
			deviceId: record.requestedByDeviceId,
			clientId: record.requestedByClientId,
			deviceTokenAuth: record.requestedByDeviceTokenAuth === true
		},
		reviewerDeviceIds: record.approvalReviewerDeviceIds,
		source,
		audienceSessionKeys,
		runtimeEpoch: params.runtimeEpoch,
		createdAtMs: record.createdAtMs,
		expiresAtMs: record.expiresAtMs,
		...record.executionIdentityToken ? { executionIdentityToken: record.executionIdentityToken } : {}
	};
}
//#endregion
export { prepareExecApprovalRegistration as i, createExecApprovalRecord as n, prepareExecApprovalPresentation as r, InvalidApprovalIdError as t };
