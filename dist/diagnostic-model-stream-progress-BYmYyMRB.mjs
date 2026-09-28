import { o as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { a as isDiagnosticsTimelineEnabled, n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-uuHa_36_.mjs";
import { d as markDiagnosticRunProgress } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
//#region src/logging/diagnostic-model-stream-progress.ts
const MODEL_CALL_STREAM_PROGRESS_INTERVAL_MS = 3e4;
/** Canonical progress reason for model output observed on a live backend stream. */
const MODEL_CALL_STREAM_PROGRESS_REASON = "model_call:stream_progress";
function createModelCallStreamProgressReporter({ recordProgress, config } = {}) {
	let lastEmittedAtMs;
	return (target) => {
		if (recordProgress && !recordProgress()) return;
		const diagnosticsEnabled = areDiagnosticsEnabledForProcess();
		const fields = {
			runId: target.runId,
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			reason: MODEL_CALL_STREAM_PROGRESS_REASON
		};
		if (diagnosticsEnabled && !recordProgress) markDiagnosticRunProgress(fields);
		const now = Date.now();
		if (lastEmittedAtMs !== void 0 && now - lastEmittedAtMs < MODEL_CALL_STREAM_PROGRESS_INTERVAL_MS) return;
		const timelineEnabled = target.callId !== void 0 && isDiagnosticsTimelineEnabled({ config });
		if (!diagnosticsEnabled && !timelineEnabled) return;
		lastEmittedAtMs = now;
		if (diagnosticsEnabled) emitTrustedDiagnosticEvent({
			type: "run.progress",
			...fields
		});
		if (timelineEnabled) emitDiagnosticsTimelineEvent({
			type: "mark",
			name: "provider.request.activity",
			timestamp: new Date(now).toISOString(),
			runId: target.runId,
			spanId: target.callId
		}, { config });
	};
}
//#endregion
export { createModelCallStreamProgressReporter as t };
