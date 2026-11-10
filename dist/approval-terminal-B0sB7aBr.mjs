import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { n as buildSystemAgentApprovalResolvedText, r as formatApprovalDecisionLabel } from "./approval-terminal-D_V2O5Tg.mjs";
import "./approval-runtime-DuoFkHOM.mjs";
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
function truncateApprovalText(value, maxChars, preserveWhitespace = false) {
	if (value.length <= maxChars) return value;
	const prefix = truncateUtf16Safe(value, maxChars - 1);
	return `${preserveWhitespace ? prefix : prefix.trimEnd()}…`;
}
function truncateDetail(value) {
	return truncateApprovalText(value.trim(), TELEGRAM_APPROVAL_DETAIL_MAX_CHARS);
}
function truncateApprovalId(value) {
	return truncateApprovalText(JSON.stringify(value).slice(1, -1), TELEGRAM_APPROVAL_ID_MAX_CHARS, true);
}
function finalizeTerminalText(lines) {
	return truncateApprovalText(lines.join("\n"), TELEGRAM_APPROVAL_TERMINAL_MAX_CHARS);
}
function appendApprovalSubject(lines, label, subject, description) {
	lines.push("", label, truncateDetail(subject));
	if (description) lines.push(truncateDetail(description));
}
/** Render the canonical first-answer result returned to a Telegram callback surface. */
function buildTelegramCanonicalApprovalTerminalText(params) {
	const approval = params.result.approval;
	if (approval.presentation?.kind === "system-agent" && params.result.applied) {
		if (approval.status === "allowed") return `✅ OpenClaw change approved. Applying: ${truncateDetail(approval.presentation.description)}`;
		return {
			cancelled: "⚠️ OpenClaw change was cancelled because its run ended. No change was made. Retry.",
			denied: "❌ OpenClaw change denied. No change was made.",
			expired: "⏱️ OpenClaw change expired. No change was made."
		}[approval.status];
	}
	const approvalId = approval.id || params.fallbackApprovalId;
	const lines = [
		params.result.applied ? "✅ Approval resolved here" : "ℹ️ Approval already resolved",
		`Recorded result: ${formatCanonicalResult(approval)}`,
		`ID: ${truncateApprovalId(approvalId)}`
	];
	if (approval.presentation) {
		const subject = approval.presentation;
		appendApprovalSubject(lines, subject.kind === "exec" ? "Command:" : "Request:", subject.kind === "exec" ? subject.commandPreview ?? subject.commandText : subject.title, subject.kind === "exec" ? void 0 : subject.description.trim());
	}
	return finalizeTerminalText(lines);
}
/** Render a truthful receipt for a legacy callback without a canonical snapshot. */
function buildTelegramLegacyApprovalTerminalText(params) {
	const lines = params.outcome === "resolved-here" ? ["✅ Approval resolved here", `Result: ${formatApprovalDecision(params.decision)}`] : params.outcome === "no-longer-pending" ? ["ℹ️ Approval no longer pending", "It was already resolved or expired; the recorded decision is unavailable here."] : ["ℹ️ Approval is no longer actionable from this button", "It may have been resolved, expired, or require a different authorized approval surface."];
	lines.push(`ID: ${truncateApprovalId(params.approvalId)}`);
	return finalizeTerminalText(lines);
}
/** Render a neutral terminal receipt for malformed callbacks in the reserved namespace. */
function buildTelegramInvalidApprovalTerminalText() {
	return "ℹ️ Approval action unavailable\nThis button is invalid or no longer actionable.";
}
/** Render a canonical native resolved event while retaining safe request context. */
function buildTelegramNativeResolvedApprovalText(view) {
	if (view.approvalKind === "system-agent") return buildSystemAgentApprovalResolvedText({
		...view,
		operationSummary: truncateDetail(view.operationSummary)
	});
	const lines = [`✅ ${view.approvalKind === "exec" ? "Exec" : "Plugin"} approval resolved`, `Recorded result: ${formatApprovalDecision(view.decision)}`];
	if (view.resolvedBy?.trim()) lines.push(`Resolved by: ${truncateDetail(view.resolvedBy.replace(/\s+/gu, " "))}`);
	return finalizeNativeApprovalText(view, lines);
}
/** Render a canonical native expiration event while retaining safe request context. */
function buildTelegramNativeExpiredApprovalText(view) {
	if (view.approvalKind === "system-agent") return "⏱️ OpenClaw change expired. No change was made.";
	return finalizeNativeApprovalText(view, [`⏱️ ${view.approvalKind === "exec" ? "Exec" : "Plugin"} approval expired`, "Recorded result: Expired"]);
}
function finalizeNativeApprovalText(view, lines) {
	lines.push(`ID: ${truncateApprovalId(view.approvalId)}`);
	appendApprovalSubject(lines, view.approvalKind === "exec" ? "Command:" : "Request:", view.approvalKind === "exec" ? view.commandPreview ?? view.commandText : view.title, view.approvalKind === "exec" ? void 0 : view.description?.trim());
	return finalizeTerminalText(lines);
}
//#endregion
export { buildTelegramNativeResolvedApprovalText as a, buildTelegramNativeExpiredApprovalText as i, buildTelegramInvalidApprovalTerminalText as n, buildTelegramLegacyApprovalTerminalText as r, buildTelegramCanonicalApprovalTerminalText as t };
