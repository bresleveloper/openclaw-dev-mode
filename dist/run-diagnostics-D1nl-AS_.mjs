import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { $ as tailText, Q as normalizeExitCode, X as normalizeCronRunDiagnosticSummary, Y as formatUnknownError, Z as normalizeCronRunDiagnosticsCore } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import { s as isToolAllowedByPolicyName } from "./tool-policy-match-Dn8gpf-E.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { r as isExecLikeToolName } from "./tool-error-summary-64MNk8zq.mjs";
import { n as isEmbeddedRunTerminalToolFailure, t as CODE_MODE_MCP_CATALOG_MISS_MESSAGE } from "./terminal-tool-failure-C7cE3h6q.mjs";
//#region src/cron/run-diagnostics.ts
/** Builds bounded, redacted diagnostics for cron run logs and UI surfaces. */
const EXEC_DIAGNOSTIC_TAIL_CHARS = 2e3;
const WEB_SEARCH_TOOL_NAME = "web_search";
const MISSING_WEB_SEARCH_PROVIDER_DIAGNOSTIC_MESSAGE = "web_search tool requested in toolsAllow but no web search provider is selected. Configure one with: openclaw configure --section web, or set tools.web.search.provider.";
function toolsAllowRequestsWebSearch(toolsAllow) {
	const explicitAllow = (toolsAllow ?? []).filter((entry) => normalizeToolPolicyName(entry) !== "*");
	return explicitAllow.length > 0 && isToolAllowedByPolicyName(WEB_SEARCH_TOOL_NAME, { allow: explicitAllow });
}
/** Returns the operator-facing summary for persisted cron diagnostics. */
function summarizeCronRunDiagnostics(diagnostics) {
	if (!diagnostics) return;
	return normalizeCronRunDiagnosticSummary(diagnostics.summary ?? diagnostics.entries[0]?.message);
}
/** Normalizes untrusted cron diagnostic payloads into bounded, redacted entries. */
function normalizeCronRunDiagnostics(value, opts) {
	return normalizeCronRunDiagnosticsCore(value, {
		...opts,
		redactText: (text) => redactSensitiveText(text, { mode: "tools" })
	});
}
/** Merges cron diagnostics while choosing the highest-severity latest summary. */
function mergeCronRunDiagnostics(...values) {
	const entries = [];
	let summaryCandidate;
	for (const value of values) {
		const normalized = normalizeCronRunDiagnostics(value);
		if (!normalized) continue;
		const entryCandidate = normalized.entries.findLast((entry) => entry.severity === "error") ?? normalized.entries.findLast((entry) => entry.severity === "warn") ?? normalized.entries.findLast((entry) => entry.severity === "info");
		const summary = normalizeCronRunDiagnosticSummary(normalized.summary ?? entryCandidate?.message);
		if (summary) {
			const severity = entryCandidate?.severity === "error" ? 2 : entryCandidate?.severity === "warn" ? 1 : 0;
			const order = entries.length + normalized.entries.length;
			if (!summaryCandidate || severity > summaryCandidate.severity || severity === summaryCandidate.severity && order >= summaryCandidate.order) summaryCandidate = {
				summary,
				severity,
				order
			};
		}
		entries.push(...normalized.entries);
	}
	return normalizeCronRunDiagnostics({
		summary: summaryCandidate?.summary,
		entries
	});
}
/** Converts an arbitrary thrown cron error into a redacted diagnostic entry. */
function createCronRunDiagnosticsFromError(source, error, opts) {
	const message = formatUnknownError(error);
	return normalizeCronRunDiagnostics({
		summary: message,
		entries: [{
			ts: opts?.nowMs?.() ?? Date.now(),
			source,
			severity: opts?.severity ?? "error",
			message,
			toolName: opts?.toolName,
			exitCode: opts?.exitCode
		}]
	}, opts);
}
/** Reports a cron preflight warning for an explicitly allowed web_search with no provider. */
function createCronRunDiagnosticsFromMissingWebSearchProvider(params) {
	if (params.hasWebSearchProvider || !params.toolsAllow || params.toolsAllow.length === 0) return;
	if (!toolsAllowRequestsWebSearch(params.toolsAllow)) return;
	return createCronRunDiagnosticsFromError("cron-preflight", MISSING_WEB_SEARCH_PROVIDER_DIAGNOSTIC_MESSAGE, {
		severity: "warn",
		nowMs: params.nowMs,
		toolName: WEB_SEARCH_TOOL_NAME
	});
}
/** Extracts failed exec details from tool metadata into cron diagnostics. */
function createCronRunDiagnosticsFromExecDetails(details, opts) {
	const record = asOptionalObjectRecord(details);
	if (!record) return;
	const status = typeof record.status === "string" ? record.status : void 0;
	const exitCode = normalizeExitCode(record.exitCode);
	if (!(status === "failed" || typeof exitCode === "number" && exitCode !== 0)) return;
	const aggregated = normalizeOptionalString(record.aggregated);
	return createCronRunDiagnosticsFromError("exec", aggregated ? tailText(aggregated, EXEC_DIAGNOSTIC_TAIL_CHARS) : typeof exitCode === "number" ? `exec failed with exit code ${exitCode}` : "exec failed", {
		severity: opts?.finalStatus === "ok" ? "warn" : status === "failed" ? "error" : "warn",
		nowMs: opts?.nowMs,
		toolName: opts?.toolName,
		exitCode
	});
}
/** Extracts tool-call failure diagnostics from an agent reply payload. */
function createCronRunDiagnosticsFromToolPayload(payload, opts) {
	const record = asOptionalObjectRecord(payload);
	if (!record) return;
	const toolName = normalizeOptionalString(record.toolName) ?? normalizeOptionalString(record.name) ?? normalizeOptionalString(getReplyPayloadMetadata(record)?.toolErrorWarning?.toolName);
	const detailsDiagnostics = createCronRunDiagnosticsFromExecDetails(record.details, {
		nowMs: opts?.nowMs,
		toolName,
		finalStatus: opts?.finalStatus
	});
	const isError = record.isError === true;
	const text = typeof record.text === "string" ? record.text : void 0;
	return mergeCronRunDiagnostics(detailsDiagnostics, isError && text ? createCronRunDiagnosticsFromError("tool", text, {
		severity: opts?.finalStatus === "ok" ? "warn" : "error",
		nowMs: opts?.nowMs,
		toolName
	}) : void 0);
}
/** Extracts cron run diagnostics from agent result payloads and metadata. */
function createCronRunDiagnosticsFromAgentResult(result, opts) {
	const record = asOptionalObjectRecord(result) ?? {};
	const meta = record.meta && typeof record.meta === "object" ? record.meta : {};
	const diagnostics = [];
	const payloads = Array.isArray(record.payloads) ? record.payloads : [];
	for (const payload of payloads) diagnostics.push(createCronRunDiagnosticsFromToolPayload(payload, opts));
	const metaError = meta.error && typeof meta.error === "object" ? meta.error : void 0;
	if (typeof metaError?.message === "string") diagnostics.push(createCronRunDiagnosticsFromError("agent-run", metaError.message, opts));
	const terminalToolFailure = meta.terminalToolFailure;
	if (isEmbeddedRunTerminalToolFailure(terminalToolFailure)) diagnostics.push(createCronRunDiagnosticsFromError("tool", CODE_MODE_MCP_CATALOG_MISS_MESSAGE, {
		...opts,
		severity: opts?.finalStatus === "ok" ? "warn" : "error",
		toolName: terminalToolFailure.toolName
	}));
	const failureSignal = meta.failureSignal && typeof meta.failureSignal === "object" ? meta.failureSignal : void 0;
	if (typeof failureSignal?.message === "string") diagnostics.push(createCronRunDiagnosticsFromError("tool", failureSignal.message, opts));
	const unresolvedError = asOptionalObjectRecord(asOptionalObjectRecord(meta.toolSummary)?.unresolvedError);
	const toolName = normalizeOptionalString(unresolvedError?.toolName)?.toLowerCase();
	if (toolName && isExecLikeToolName(toolName) && normalizeOptionalString(failureSignal?.toolName)?.toLowerCase() !== toolName && !diagnostics.some((value) => value?.entries.some((entry) => (entry.source === "exec" || entry.source === "tool") && entry.toolName?.toLowerCase() === toolName))) diagnostics.push(createCronRunDiagnosticsFromError("exec", `${toolName} tool failed`, {
		severity: opts?.finalStatus === "ok" ? "warn" : "error",
		nowMs: opts?.nowMs,
		toolName
	}));
	return mergeCronRunDiagnostics(...diagnostics);
}
//#endregion
export { normalizeCronRunDiagnostics as a, mergeCronRunDiagnostics as i, createCronRunDiagnosticsFromError as n, summarizeCronRunDiagnostics as o, createCronRunDiagnosticsFromMissingWebSearchProvider as r, toolsAllowRequestsWebSearch as s, createCronRunDiagnosticsFromAgentResult as t };
