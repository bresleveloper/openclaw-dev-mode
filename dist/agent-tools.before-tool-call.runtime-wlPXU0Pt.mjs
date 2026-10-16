import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as emitInternalDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { n as getDiagnosticSessionState } from "./diagnostic-session-state-tX9oTPd5.mjs";
import { o as markDiagnosticActivity, t as diagnosticLogger } from "./diagnostic-runtime-Clvsorku.mjs";
import { c as markDiagnosticArgumentChurnObservation } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { i as recordToolCallOutcome, n as hashToolCall, o as resolveToolLoopWarningThreshold, r as recordToolCall, s as getArgumentChurnNoProgressStreak, t as detectToolCallLoop } from "./tool-loop-detection-fg_cpzJq.mjs";
//#region src/logging/diagnostic-tool-loop.ts
/** Tool-loop diagnostic logging and trusted tool.loop event emission. */
function logToolLoopAction(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const payload = `tool loop: sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} tool=${params.toolName} level=${params.level} action=${params.action} detector=${params.detector} count=${params.count}${params.pairedToolName ? ` pairedTool=${params.pairedToolName}` : ""} message="${params.message}"`;
	if (params.level === "critical") diagnosticLogger.error(payload);
	else diagnosticLogger.warn(payload);
	emitInternalDiagnosticEvent({
		type: "tool.loop",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		toolName: params.toolName,
		level: params.level,
		action: params.action,
		detector: params.detector,
		count: params.count,
		message: params.message,
		pairedToolName: params.pairedToolName
	});
	markDiagnosticActivity();
}
//#endregion
//#region src/agents/tool-loop-call-reconciliation.ts
/**
* Rebind the pending admission record to the arguments that will actually
* execute after trusted/plugin policy rewrites, then re-evaluate churn against
* the completed history that preceded that call.
*/
function reconcileToolCallExecutionParams(state, params) {
	const history = state.toolCallHistory;
	if (!history) return {
		active: false,
		count: 0,
		variantCount: 0
	};
	const runId = normalizeOptionalString(params.runId);
	const argsHash = hashToolCall(params.toolName, params.toolParams);
	for (let index = history.length - 1; index >= 0; index -= 1) {
		const call = history[index];
		if (!call || normalizeOptionalString(call.runId) !== runId) continue;
		if (params.toolCallId && call.toolCallId !== params.toolCallId) continue;
		if (call.toolName !== params.toolName || call.resultHash !== void 0 || call.outcomeKind !== void 0) continue;
		call.argsHash = argsHash;
		const scopedHistory = history.slice(0, index).filter((record) => normalizeOptionalString(record.runId) === runId);
		const churn = getArgumentChurnNoProgressStreak(scopedHistory, params.toolName, argsHash);
		return {
			active: churn.count >= params.warningThreshold,
			...churn
		};
	}
	return {
		active: false,
		count: 0,
		variantCount: 0
	};
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.runtime.ts
/**
* Lazy runtime dependencies for before_tool_call handling.
* Keeps diagnostics and loop-detection imports behind a seam that tests can
* replace without loading the full runtime graph.
*/
/** Runtime seam for before_tool_call diagnostics and loop detection. */
const beforeToolCallRuntime = {
	getArgumentChurnNoProgressStreak,
	markDiagnosticArgumentChurnObservation,
	getDiagnosticSessionState,
	logToolLoopAction,
	detectToolCallLoop,
	reconcileToolCallExecutionParams,
	recordToolCall,
	recordToolCallOutcome,
	resolveToolLoopWarningThreshold
};
//#endregion
export { beforeToolCallRuntime };
