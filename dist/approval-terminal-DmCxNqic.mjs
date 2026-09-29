import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { n as formatApprovalDecisionLabel, t as buildSystemAgentApprovalResolvedText } from "./approval-terminal-DsAX2U4_.mjs";
import "./approval-runtime-QANlV9GN.mjs";
//#region extensions/telegram/src/approval-terminal.ts
const TELEGRAM_APPROVAL_DETAIL_MAX_CHARS = 2800;
const TELEGRAM_APPROVAL_ID_MAX_CHARS = 512;
const TELEGRAM_APPROVAL_TERMINAL_MAX_CHARS = 4e3;
function formatApprovalDecision(decision) {
	return decision ? formatApprovalDecisionLabel(decision) : "Resolved";
}
function formatCanonicalResult(approval) {
	if (approval.status === "allowed" || approval.status === "denied") return formatApprovalDecision(approval.decision);
	return approval.status === "expired" ? "Expired" : "Cancelled";
}
function truncateDetail(value) {
	const trimmed = value.trim();
	if (trimmed.length <= TELEGRAM_APPROVAL_DETAIL_MAX_CHARS) return trimmed;
	return `${truncateUtf16Safe(trimmed, 2799).trimEnd()}…`;
}
function truncateApprovalId(value) {
	const escaped = JSON.stringify(value).slice(1, -1);
	if (escaped.length <= TELEGRAM_APPROVAL_ID_MAX_CHARS) return escaped;
	return `${truncateUtf16Safe(escaped, 511)}…`;
}
function formatResolvedBy(value) {
	return truncateDetail(value.replace(/\s+/gu, " "));
}
function finalizeTerminalText(lines) {
	const text = lines.join("\n");
	if (text.length <= TELEGRAM_APPROVAL_TERMINAL_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, 3999).trimEnd()}…`;
}
function appendCanonicalSubject(lines, presentation) {
	if (presentation.kind === "exec") {
		lines.push("", "Command:", truncateDetail(presentation.commandPreview ?? presentation.commandText));
		return;
	}
	lines.push("", "Request:", truncateDetail(presentation.title));
	const description = presentation.description.trim();
	if (description) lines.push(truncateDetail(description));
}
/** Render the canonical first-answer result returned to a Telegram callback surface. */
function buildTelegramCanonicalApprovalTerminalText(params) {
	const approval = params.result.approval;
	if (approval.presentation?.kind === "system-agent" && params.result.applied) {
		if (approval.status === "allowed") return `✅ OpenClaw change approved. Applying: ${truncateDetail(approval.presentation.description)}`;
		if (approval.status === "cancelled") return "⚠️ OpenClaw change was cancelled because its run ended. No change was made. Retry.";
		if (approval.status === "denied") return "❌ OpenClaw change denied. No change was made.";
		if (approval.status === "expired") return "⏱️ OpenClaw change expired. No change was made.";
	}
	const approvalId = approval.id || params.fallbackApprovalId;
	const lines = [
		params.result.applied ? "✅ Approval resolved here" : "ℹ️ Approval already resolved",
		`Canonical result: ${formatCanonicalResult(approval)}`,
		`ID: ${truncateApprovalId(approvalId)}`
	];
	if (approval.presentation) appendCanonicalSubject(lines, approval.presentation);
	return finalizeTerminalText(lines);
}
/** Render a truthful receipt for a legacy callback without a canonical snapshot. */
function buildTelegramLegacyApprovalTerminalText(params) {
	const lines = params.outcome === "resolved-here" ? ["✅ Approval resolved here", `Result: ${formatApprovalDecision(params.decision)}`] : params.outcome === "no-longer-pending" ? ["ℹ️ Approval no longer pending", "It was already resolved or expired; the canonical decision is unavailable here."] : ["ℹ️ Approval is no longer actionable from this button", "It may have been resolved, expired, or require a different authorized approval surface."];
	lines.push(`ID: ${truncateApprovalId(params.approvalId)}`);
	return finalizeTerminalText(lines);
}
/** Render a neutral terminal receipt for malformed callbacks in the reserved namespace. */
function buildTelegramInvalidApprovalTerminalText() {
	return "ℹ️ Approval action unavailable\nThis button is invalid or no longer actionable.";
}
function appendViewSubject(lines, view) {
	if (view.approvalKind === "exec") {
		lines.push("", "Command:", truncateDetail(view.commandPreview ?? view.commandText));
		return;
	}
	lines.push("", "Request:", truncateDetail(view.title));
	const description = view.description?.trim();
	if (description) lines.push(truncateDetail(description));
}
/** Render a canonical native resolved event while retaining safe request context. */
function buildTelegramNativeResolvedApprovalText(view) {
	if (view.approvalKind === "system-agent") return buildSystemAgentApprovalResolvedText({
		...view,
		operationSummary: truncateDetail(view.operationSummary)
	});
	const lines = [`✅ ${view.approvalKind === "exec" ? "Exec" : "Plugin"} approval resolved`, `Canonical result: ${formatApprovalDecision(view.decision)}`];
	if (view.resolvedBy?.trim()) lines.push(`Resolved by: ${formatResolvedBy(view.resolvedBy)}`);
	lines.push(`ID: ${truncateApprovalId(view.approvalId)}`);
	appendViewSubject(lines, view);
	return finalizeTerminalText(lines);
}
/** Render a canonical native expiration event while retaining safe request context. */
function buildTelegramNativeExpiredApprovalText(view) {
	if (view.approvalKind === "system-agent") return "⏱️ OpenClaw change expired. No change was made.";
	const lines = [
		`⏱️ ${view.approvalKind === "exec" ? "Exec" : "Plugin"} approval expired`,
		"Canonical result: Expired",
		`ID: ${truncateApprovalId(view.approvalId)}`
	];
	appendViewSubject(lines, view);
	return finalizeTerminalText(lines);
}
//#endregion
export { buildTelegramNativeResolvedApprovalText as a, buildTelegramNativeExpiredApprovalText as i, buildTelegramInvalidApprovalTerminalText as n, buildTelegramLegacyApprovalTerminalText as r, buildTelegramCanonicalApprovalTerminalText as t };
