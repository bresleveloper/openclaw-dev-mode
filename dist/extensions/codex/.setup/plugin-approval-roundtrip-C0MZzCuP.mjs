import { it as resolveCodexGatewayTimeoutWithGraceMs } from "./shared-client-DA4VR4Eb.mjs";
import { isApprovalNotFoundError, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/codex/src/app-server/plugin-approval-roundtrip.ts
const DEFAULT_CODEX_APPROVAL_TIMEOUT_MS = 12e4;
const MAX_PLUGIN_APPROVAL_TITLE_LENGTH = 80;
const MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH = 512;
const ANSI_OSC_SEQUENCE_RE = new RegExp(String.raw`(?:\u001b]|\u009d)[^\u001b\u009c\u0007]*(?:\u0007|\u001b\\|\u009c)`, "g");
const ANSI_CONTROL_SEQUENCE_RE = new RegExp(String.raw`(?:\u001b\[[0-?]*[ -/]*[@-~]|\u009b[0-?]*[ -/]*[@-~]|\u001b[@-Z\\-_])`, "g");
const CONTROL_CHARACTER_RE = new RegExp(String.raw`[\u0000-\u001f\u007f-\u009f]+`, "g");
const INVISIBLE_FORMATTING_CONTROL_RE = new RegExp(String.raw`[\u00ad\u034f\u061c\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\ufe00-\ufe0f\u{e0100}-\u{e01ef}]`, "gu");
const DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE = new RegExp(String.raw`(?:\u001b\][^\u001b\u009c\u0007]*|\u009d[^\u001b\u009c\u0007]*|\u001b\[[0-?]*[ -/]*|\u009b[0-?]*[ -/]*|\u001b)$`);
const CODEX_APPROVAL_TIMEOUT_SUBJECTS = {
	command: "Command approval",
	"file-change": "File change approval",
	permissions: "Permission approval",
	other: "Approval"
};
function codexApprovalTimeoutText(kind) {
	return `${CODEX_APPROVAL_TIMEOUT_SUBJECTS[kind]} timed out before an operator responded.`;
}
/** Starts a two-phase plugin approval request through the OpenClaw gateway. */
async function requestPluginApproval(params) {
	const timeoutMs = DEFAULT_CODEX_APPROVAL_TIMEOUT_MS;
	return params.hostCapabilities.requestApproval({
		signal: params.signal,
		title: truncateCodexApprovalDisplayText(params.title, MAX_PLUGIN_APPROVAL_TITLE_LENGTH),
		description: truncateCodexApprovalDisplayText(params.description, MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH),
		severity: params.severity,
		toolName: params.toolName,
		toolCallId: params.toolCallId,
		...params.mcpTool ? {
			mcpTool: params.mcpTool,
			isMcpToolApprovalActive: params.isMcpToolApprovalActive
		} : {},
		timeoutMs,
		transportTimeoutMs: resolveCodexGatewayTimeoutWithGraceMs(timeoutMs),
		...params.allowedDecisions ? { allowedDecisions: params.allowedDecisions } : {}
	});
}
/** Detects the gateway's explicit null-decision marker for unavailable approvals. */
function approvalRequestExplicitlyUnavailable(result) {
	if (result === null || result === void 0 || typeof result !== "object") return false;
	let descriptor;
	try {
		descriptor = Object.getOwnPropertyDescriptor(result, "decision");
	} catch {
		return false;
	}
	return descriptor !== void 0 && "value" in descriptor && descriptor.value === null;
}
/** Waits for the gateway's final approval decision, respecting turn aborts. */
async function waitForPluginApprovalDecision(params) {
	const timeoutMs = DEFAULT_CODEX_APPROVAL_TIMEOUT_MS;
	const waitPromise = params.hostCapabilities.waitForApproval({
		approvalId: params.approvalId,
		timeoutMs,
		transportTimeoutMs: resolveCodexGatewayTimeoutWithGraceMs(timeoutMs),
		signal: params.signal
	}).catch((error) => {
		if (isApprovalNotFoundError(error)) return;
		throw error;
	});
	if (!params.signal) return await waitPromise;
	let onAbort;
	const abortPromise = new Promise((_, reject) => {
		if (params.signal.aborted) {
			reject(toErrorObject(params.signal.reason, "Non-Error rejection"));
			return;
		}
		onAbort = () => reject(toErrorObject(params.signal.reason, "Non-Error rejection"));
		params.signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		return await Promise.race([waitPromise, abortPromise]);
	} finally {
		if (onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
/** Converts a gateway exec approval decision into the app-server approval outcome enum. */
function mapExecDecisionToOutcome(decision) {
	switch (decision) {
		case "allow-once": return "approved-once";
		case "allow-always": return "approved-session";
		case "deny": return "denied";
		default: return "unavailable";
	}
}
/** Runs one complete host approval request and maps transport failures to a closed outcome. */
async function requestPluginApprovalOutcome(params) {
	try {
		const requestResult = await requestPluginApproval({
			...params,
			severity: "warning"
		});
		const approvalId = requestResult?.id;
		if (!approvalId) return "unavailable";
		const approvalResult = approvalRequestExplicitlyUnavailable(requestResult) ? void 0 : await waitForPluginApprovalDecision({
			hostCapabilities: params.hostCapabilities,
			approvalId,
			signal: params.signal
		});
		if (params.signal?.aborted) return "cancelled";
		if (approvalResult?.terminalReason === "timeout") return "timed-out";
		const decision = approvalResult?.decision;
		return mapExecDecisionToOutcome(decision === "allow-always" && params.allowedDecisions?.includes("allow-always") === false ? "allow-once" : decision);
	} catch {
		return params.signal?.aborted ? "cancelled" : "denied";
	}
}
function truncateCodexApprovalDisplayText(value, maxLength) {
	return value.length <= maxLength ? value : `${truncateUtf16Safe(value, maxLength - 3)}...`;
}
function stripDanglingCodexApprovalTerminalSequence(value) {
	return value.replace(DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE, "");
}
function sanitizeCodexApprovalVisibleText(value, options = {}) {
	const terminalSafe = value.replace(ANSI_OSC_SEQUENCE_RE, "").replace(ANSI_CONTROL_SEQUENCE_RE, "");
	return (options.stripDanglingTerminalSequence ? stripDanglingCodexApprovalTerminalSequence(terminalSafe) : terminalSafe).replace(INVISIBLE_FORMATTING_CONTROL_RE, " ").replace(CONTROL_CHARACTER_RE, " ").replace(/\s+/g, " ").trim();
}
//#endregion
export { requestPluginApprovalOutcome as a, truncateCodexApprovalDisplayText as c, requestPluginApproval as i, waitForPluginApprovalDecision as l, codexApprovalTimeoutText as n, sanitizeCodexApprovalVisibleText as o, mapExecDecisionToOutcome as r, stripDanglingCodexApprovalTerminalSequence as s, approvalRequestExplicitlyUnavailable as t };
