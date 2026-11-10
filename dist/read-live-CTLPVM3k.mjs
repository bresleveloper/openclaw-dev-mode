import { d as readTranscriptCaptureSnapshot, l as isTranscriptSessionActive } from "./capture-operations-DwDzC-nq.mjs";
//#region src/transcripts/read-live.ts
/** Stored facts carry no live capture or provider authority across the worker boundary. */
function presentTranscriptSession(session, captures = readTranscriptCaptureSnapshot(), providerName) {
	return {
		...session,
		active: isTranscriptSessionActive(session),
		providerName,
		activeSubscription: captures.some((capture) => capture.state === "armed" && capture.session.sessionId === session.sessionId && capture.session.startedAt === session.startedAt)
	};
}
//#endregion
export { presentTranscriptSession as t };
