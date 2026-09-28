import { a as emitInternalDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as getDiagnosticSessionState } from "./diagnostic-session-state-DpvjzgzY.mjs";
//#region src/logging/diagnostic-runtime.ts
const diag = createSubsystemLogger("diagnostic");
let lastActivityAt = 0;
/** Root diagnostic subsystem logger. */
const diagnosticLogger = diag;
/** Marks that diagnostics emitted useful activity. */
function markDiagnosticActivity() {
	lastActivityAt = Date.now();
}
/** Returns the last diagnostic activity timestamp for watchdog-style checks. */
function getLastDiagnosticActivityAt() {
	return lastActivityAt;
}
/** Clears diagnostic activity state for tests. */
function resetDiagnosticActivityForTest() {
	lastActivityAt = 0;
}
/** Records queue activity while letting internal run owners distinguish steering from backlog. */
function logMessageQueuedWithBacklogPolicy(params, countsTowardBacklog) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const state = getDiagnosticSessionState(params);
	if (countsTowardBacklog) state.queueDepth += 1;
	state.lastActivity = Date.now();
	state.generation = (state.generation ?? 0) + 1;
	state.lastStuckWarnAgeMs = void 0;
	state.lastLongRunningWarnAgeMs = void 0;
	if (diag.isEnabled("debug")) diag.debug(`message queued: sessionId=${state.sessionId ?? "unknown"} sessionKey=${state.sessionKey ?? "unknown"} source=${params.source} queueDepth=${state.queueDepth} sessionState=${state.state}`);
	emitInternalDiagnosticEvent({
		type: "message.queued",
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		channel: params.channel,
		source: params.source,
		queueDepth: state.queueDepth
	});
	markDiagnosticActivity();
}
/** Logs and emits a diagnostic event when work enters a serialized lane. */
function logLaneEnqueue(lane, queueSize) {
	if (!areDiagnosticsEnabledForProcess()) return;
	diag.debug(`lane enqueue: lane=${lane} queueSize=${queueSize}`);
	emitInternalDiagnosticEvent({
		type: "queue.lane.enqueue",
		lane,
		queueSize
	});
	markDiagnosticActivity();
}
/** Logs and emits a diagnostic event when work leaves a serialized lane. */
function logLaneDequeue(lane, waitMs, queueSize) {
	if (!areDiagnosticsEnabledForProcess()) return;
	diag.debug(`lane dequeue: lane=${lane} waitMs=${waitMs} queueSize=${queueSize}`);
	emitInternalDiagnosticEvent({
		type: "queue.lane.dequeue",
		lane,
		queueSize,
		waitMs
	});
	markDiagnosticActivity();
}
//#endregion
export { logMessageQueuedWithBacklogPolicy as a, logLaneEnqueue as i, getLastDiagnosticActivityAt as n, markDiagnosticActivity as o, logLaneDequeue as r, resetDiagnosticActivityForTest as s, diagnosticLogger as t };
