import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as SESSION_PROCESS_TAIL_MAX_CHARS } from "./session-processes-C3V27wAB.mjs";
import { A as deriveSessionName, C as tail, a as compareProcessSessionStartOrder, l as getSession, m as listRunningSessions, p as listFinishedSessions, v as processSessionInstanceId } from "./bash-process-registry-D3AARAgk.mjs";
import { a as isConfirmedRequestedStop, i as isBackgroundExecCancellable, t as cancelBackgroundExecSession } from "./bash-process-control-D15pjJye.mjs";
//#region src/agents/bash-process-observation.ts
function inScope(session, scope) {
	return Boolean(session.scopeKey && scope.scopeKeys.includes(session.scopeKey) && (session.agentId === void 0 || session.agentId === scope.agentId) && (session.scopeKey !== "global" || session.agentId === scope.agentId));
}
/** Non-consuming observation: never drains poll output or acknowledges an exit notification. */
function readBackgroundProcesses(scope) {
	const sessions = [...listRunningSessions(), ...listFinishedSessions()].filter((session) => inScope(session, scope)).toSorted((a, b) => Number(a.exited) - Number(b.exited) || compareProcessSessionStartOrder(a, b));
	const processes = [];
	let bytes = 0;
	for (const session of sessions) {
		const output = tail(session.tail, SESSION_PROCESS_TAIL_MAX_CHARS);
		const row = {
			processId: session.id,
			instanceId: processSessionInstanceId(session),
			name: truncateUtf16Safe(deriveSessionName(session.command) || session.command, 160),
			status: isConfirmedRequestedStop(session) ? "killed" : session.terminalStatus ?? "running",
			startedAt: session.startedAt,
			...session.endedAt !== void 0 ? { endedAt: session.endedAt } : {},
			tail: output,
			truncated: session.truncated || session.totalOutputChars > output.length,
			canStop: isBackgroundExecCancellable(session) && !session.cancellationRequested,
			...session.exitCode !== void 0 ? { exitCode: session.exitCode } : {},
			...session.exitSignal !== void 0 ? { exitSignal: session.exitSignal } : {},
			...session.exitReason !== void 0 ? { exitReason: session.exitReason } : {}
		};
		bytes += Buffer.byteLength(JSON.stringify(row), "utf8");
		if (processes.length >= 50 || bytes > 49152) break;
		processes.push(row);
	}
	return {
		processes,
		truncated: processes.length < sessions.length
	};
}
/** The session authority is checked by the caller; this owner checks the exact process object. */
function stopBackgroundProcess(scope, target) {
	const session = getSession(target.processId);
	return { requested: Boolean(session && inScope(session, scope) && processSessionInstanceId(session) === target.instanceId && cancelBackgroundExecSession(session.id)) };
}
//#endregion
export { stopBackgroundProcess as n, readBackgroundProcesses as t };
