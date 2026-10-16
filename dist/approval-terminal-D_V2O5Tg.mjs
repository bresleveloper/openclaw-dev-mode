//#region src/plugin-sdk/approval-terminal.ts
const TERMINAL_LABELS = {
	"allow-once": "Allowed once",
	"allow-always": "Allowed always",
	deny: "Denied",
	cancelled: "Cancelled",
	applied: "Applied",
	"not-applied": "Completion unconfirmed"
};
/** Label a recorded decision without implying that a system change was applied. */
function formatApprovalDecisionLabel(decision) {
	return TERMINAL_LABELS[decision];
}
function interpretApprovalTerminalOutcome(view, precedence) {
	if (view.approvalKind !== "system-agent") return view.decision;
	if (view.terminalStatus === "cancelled") return "cancelled";
	return view.decision === "deny" && (precedence === "denial" || view.applicationStatus === "not-applied") ? "deny" : view.applicationStatus ?? view.decision;
}
/** Format a rich terminal label, retaining transport-specific decision spelling. */
function formatChannelApprovalResolvedLabel(view, formatDecision) {
	const outcome = interpretApprovalTerminalOutcome(view, "application");
	return formatDecision && outcome === view.decision ? formatDecision(view.decision) : TERMINAL_LABELS[outcome];
}
/** Describe a system change using denial-first prose and a prepared operation summary. */
function buildSystemAgentApprovalResolvedText(view) {
	const outcome = interpretApprovalTerminalOutcome(view, "denial");
	return outcome === "cancelled" ? "⚠️ OpenClaw change was cancelled because its run ended. No change was made. Retry." : outcome === "deny" ? "❌ OpenClaw change denied. No change was made." : outcome === "applied" ? `✅ OpenClaw change approved and applied: ${view.operationSummary}` : outcome === "not-applied" ? "⚠️ OpenClaw change approved, but completion could not be confirmed. Check the current settings before retrying." : `✅ OpenClaw change approved. Applying: ${view.operationSummary}`;
}
/** Terminal copy for a system change approval that expired before a decision. */
const SYSTEM_AGENT_APPROVAL_EXPIRED_TEXT = "⏱️ OpenClaw change expired. No change was made.";
//#endregion
export { formatChannelApprovalResolvedLabel as i, buildSystemAgentApprovalResolvedText as n, formatApprovalDecisionLabel as r, SYSTEM_AGENT_APPROVAL_EXPIRED_TEXT as t };
