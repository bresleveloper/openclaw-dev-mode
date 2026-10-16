import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { s as emitTrustedDiagnosticEvent } from "./diagnostic-events-BADdmgZf.mjs";
import { i as emitAgentEvent, r as emitAgentAuditEvent } from "./agent-events-GvNTkbe3.mjs";
import { r as formatAcpErrorChain } from "./errors-m4L_1YUz.mjs";
import "./errors-DDGkdHjR.mjs";
import "./manager.turn-timeout-xP50hYUL.mjs";
import { p as resolveAgentRunAbortLifecycleFields } from "./run-termination-DGv2EKii.mjs";
import { n as normalizeReplyPayload } from "./normalize-reply-C8IYvn0x.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { t as resolveAcpToolTerminalOutcome } from "./tool-status-BfHSDdEj.mjs";
//#region src/agents/command/acp-lifecycle.ts
function buildAcpResult(params) {
	const normalizedFinalPayload = normalizeReplyPayload({ text: params.payloadText });
	const payloads = normalizedFinalPayload ? [normalizedFinalPayload] : [];
	const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
	const resultCancelled = params.resultStatus === "cancelled";
	return {
		payloads,
		meta: {
			durationMs: Date.now() - params.startedAt,
			aborted: abortFields.aborted ?? resultCancelled,
			stopReason: abortFields.stopReason ?? (resultCancelled ? "stop" : params.stopReason),
			...params.terminalReply ? { terminalReply: params.terminalReply } : {}
		}
	};
}
function acpRunIdentity(params) {
	return {
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	};
}
function emitAcpLifecycleEvent(params, data) {
	(params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
		...acpRunIdentity(params),
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data
	});
}
function emitAcpLifecycleStart(params) {
	emitAcpLifecycleEvent(params, {
		phase: "start",
		...params.completionSource ? { completionSource: params.completionSource } : {},
		startedAt: params.startedAt
	});
}
const ACP_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
const MAX_TRACKED_ACP_TOOLS = 4096;
function createAcpToolLifecycleTracker() {
	return {
		active: /* @__PURE__ */ new Map(),
		terminalToolCallIds: /* @__PURE__ */ new Set(),
		saturated: false
	};
}
function acpAuditToolName(kind) {
	switch (kind) {
		case "read":
		case "edit":
		case "delete":
		case "move":
		case "search":
		case "execute":
		case "fetch":
		case "switch_mode":
		case "think":
		case "other": return `acp_${kind}`;
		default: return "acp_tool";
	}
}
function resolveAcpToolTerminalReason(signal, stopReason, error, resultStatus) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields.stopReason === "timeout" ? "timed_out" : "cancelled";
	const normalizedStopReason = normalizeOptionalLowercaseString(stopReason);
	if (normalizedStopReason === "timeout") return "timed_out";
	if (resultStatus === "cancelled") return "cancelled";
	if (error instanceof Error && error.detailCode === "TURN_TIMEOUT") return "timed_out";
	if (normalizedStopReason === "cancel" || normalizedStopReason === "cancelled" || normalizedStopReason === "manual-cancel") return "cancelled";
	return "failed";
}
function resolveAcpLifecycleEndFields(signal, stopReason, resultStatus) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields;
	const terminalReason = resolveAcpToolTerminalReason(void 0, stopReason, void 0, resultStatus);
	if (terminalReason === "timed_out") return {
		aborted: true,
		stopReason: "timeout",
		status: "timed_out"
	};
	if (terminalReason === "cancelled") return {
		aborted: true,
		stopReason: "stop",
		status: "cancelled"
	};
	return {};
}
function emitAcpToolExecutionEvent(params) {
	const { event } = params;
	const now = Date.now();
	const toolCallId = event.toolCallId?.trim() ? event.toolCallId : void 0;
	const activeTool = toolCallId ? params.toolTracker.active.get(toolCallId) : void 0;
	const terminalOutcome = resolveAcpToolTerminalOutcome(event.status);
	const toolName = acpAuditToolName(event.kind);
	if (toolCallId && !activeTool) {
		if (params.toolTracker.terminalToolCallIds.has(toolCallId)) return;
		const trackedIdentities = params.toolTracker.active.size + params.toolTracker.terminalToolCallIds.size;
		if (params.toolTracker.saturated || trackedIdentities >= MAX_TRACKED_ACP_TOOLS) {
			params.toolTracker.saturated = true;
			return;
		}
	}
	if (!activeTool && (toolCallId !== void 0 || toolCallId === void 0 && terminalOutcome !== void 0)) {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.started",
			...acpRunIdentity(params),
			...toolCallId ? { toolCallId } : {},
			toolName,
			toolSource: "core",
			toolOwner: "acp"
		});
		if (toolCallId) params.toolTracker.active.set(toolCallId, {
			...acpRunIdentity(params),
			toolCallId,
			toolName,
			startedAt: now
		});
	}
	if (!terminalOutcome) return;
	const terminalReason = resolveAcpToolTerminalReason(params.abortSignal, void 0, void 0, terminalOutcome === "cancelled" ? "cancelled" : void 0);
	const durationMs = Math.max(0, now - (activeTool?.startedAt ?? now));
	const terminalFields = {
		...acpRunIdentity(params),
		...toolCallId ? { toolCallId } : {},
		toolName: activeTool?.toolName ?? toolName,
		toolSource: "core",
		toolOwner: "acp",
		durationMs
	};
	emitTrustedDiagnosticEvent(terminalOutcome === "completed" ? {
		type: "tool.execution.completed",
		...terminalFields
	} : {
		type: "tool.execution.error",
		...terminalFields,
		errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool",
		terminalReason
	});
	if (toolCallId) {
		params.toolTracker.active.delete(toolCallId);
		params.toolTracker.terminalToolCallIds.add(toolCallId);
	}
}
function finalizeAcpToolsForRun(toolTracker, runId, terminalReason) {
	const now = Date.now();
	for (const activeTool of toolTracker.active.values()) emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		runId,
		...activeTool.sessionKey ? { sessionKey: activeTool.sessionKey } : {},
		...activeTool.agentId ? { agentId: activeTool.agentId } : {},
		toolName: activeTool.toolName,
		toolSource: "core",
		toolOwner: "acp",
		toolCallId: activeTool.toolCallId,
		durationMs: Math.max(0, now - activeTool.startedAt),
		errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool_incomplete",
		terminalReason
	});
	toolTracker.active.clear();
	toolTracker.terminalToolCallIds.clear();
	toolTracker.saturated = false;
}
function resolvePresentProxyEnvKeys(env = process.env) {
	return ACP_PROXY_ENV_KEYS.filter((key) => Boolean(env[key]?.trim()));
}
function sanitizeAcpDiagnosticText(value) {
	return truncateUtf16Safe(redactSensitiveText(value).replace(/\s+/g, " ").trim(), 240);
}
function acpRuntimeEventDiagnostics(event) {
	if (event.type === "status" || event.type === "tool_call") return {
		eventType: event.type,
		text: sanitizeAcpDiagnosticText(event.text),
		...event.tag ? { tag: event.tag } : {},
		...event.type === "tool_call" ? {
			...event.status ? { status: sanitizeAcpDiagnosticText(event.status) } : {},
			...event.title ? { title: sanitizeAcpDiagnosticText(event.title) } : {},
			...event.toolCallId ? { toolCallId: sanitizeAcpDiagnosticText(event.toolCallId) } : {}
		} : {}
	};
	if (event.type === "error") return {
		eventType: event.type,
		message: sanitizeAcpDiagnosticText(event.message),
		...event.code ? { code: sanitizeAcpDiagnosticText(event.code) } : {},
		...typeof event.retryable === "boolean" ? { retryable: event.retryable } : {}
	};
	if (event.type === "done") return {
		eventType: event.type,
		...event.status ? { status: event.status } : {},
		...event.stopReason ? { stopReason: sanitizeAcpDiagnosticText(event.stopReason) } : {}
	};
	return {
		eventType: event.type,
		stream: event.stream ?? "output"
	};
}
function emitAcpPromptSubmitted(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "acp",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		data: {
			phase: "prompt_submitted",
			at: params.at,
			proxyEnvKeys: resolvePresentProxyEnvKeys()
		}
	});
}
function emitAcpRuntimeEvent(params) {
	if (params.event.type === "tool_call") emitAcpToolExecutionEvent({
		...params,
		event: params.event
	});
	if (!params.auditOnly) emitAgentEvent({
		...acpRunIdentity(params),
		stream: "acp",
		data: {
			phase: "runtime_event",
			...acpRuntimeEventDiagnostics(params.event)
		}
	});
}
function emitAcpTerminalLifecycle(params, terminal) {
	const data = {
		...terminal,
		executionSettled: true,
		...params.completionSource ? { completionSource: params.completionSource } : {}
	};
	emitAcpLifecycleEvent(params, data);
	return buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: terminal.phase,
		data,
		endedAt: terminal.endedAt
	});
}
function emitAcpLifecycleEnd(params) {
	finalizeAcpToolsForRun(params.toolTracker, params.runId, params.endFields.stopReason === "timeout" ? "timed_out" : params.endFields.aborted ? "cancelled" : "failed");
	return emitAcpTerminalLifecycle(params, {
		phase: "end",
		endedAt: Date.now(),
		...params.endFields,
		...params.terminalReply ? { terminalReply: params.terminalReply } : {}
	});
}
function emitAcpLifecycleError(params) {
	const terminalReason = resolveAcpToolTerminalReason(params.abortSignal, void 0, params.error);
	finalizeAcpToolsForRun(params.toolTracker, params.runId, terminalReason);
	const lifecycleFields = params.terminalOutcome === "blocked" ? { livenessState: "blocked" } : terminalReason === "timed_out" ? {
		aborted: true,
		stopReason: "timeout",
		status: "timed_out"
	} : resolveAgentRunAbortLifecycleFields(params.abortSignal);
	return emitAcpTerminalLifecycle(params, {
		phase: "error",
		...!params.auditOnly ? { error: formatAcpErrorChain(params.error) } : {},
		endedAt: Date.now(),
		...lifecycleFields
	});
}
function emitAcpAssistantDelta(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "assistant",
		data: {
			text: params.text,
			delta: params.delta
		}
	});
}
//#endregion
export { emitAcpLifecycleError as a, emitAcpRuntimeEvent as c, emitAcpLifecycleEnd as i, resolveAcpLifecycleEndFields as l, createAcpToolLifecycleTracker as n, emitAcpLifecycleStart as o, emitAcpAssistantDelta as r, emitAcpPromptSubmitted as s, buildAcpResult as t };
