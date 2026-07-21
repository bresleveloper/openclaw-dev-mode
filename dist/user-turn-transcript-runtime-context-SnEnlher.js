//#region src/sessions/user-turn-transcript-runtime-context.ts
const RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT = Symbol.for("openclaw.runtimeUserTurnTranscriptContext");
const RUNTIME_USER_TURN_TRANSCRIPT_RECORDER = Symbol.for("openclaw.runtimeUserTurnTranscriptRecorder");
/** Carries transcript-only fields with a queued runtime message without exposing them to the model. */
function attachRuntimeUserTurnTranscriptContext(runtimeMessage, context) {
	Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT, {
		configurable: true,
		value: context
	});
	return runtimeMessage;
}
/** Consumes the transient queued-turn context before the message is serialized. */
function takeRuntimeUserTurnTranscriptContext(runtimeMessage) {
	const record = runtimeMessage;
	const context = record[RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT];
	if (context) delete record[RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT];
	return context;
}
/** Keeps the queued recorder attached to the exact final message until persistence succeeds. */
function attachRuntimeUserTurnTranscriptRecorder(runtimeMessage, recorder) {
	Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER, {
		configurable: true,
		value: recorder
	});
	return runtimeMessage;
}
function takeRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
	const record = runtimeMessage;
	const recorder = record[RUNTIME_USER_TURN_TRANSCRIPT_RECORDER];
	if (recorder) delete record[RUNTIME_USER_TURN_TRANSCRIPT_RECORDER];
	return recorder;
}
//#endregion
export { takeRuntimeUserTurnTranscriptRecorder as i, attachRuntimeUserTurnTranscriptRecorder as n, takeRuntimeUserTurnTranscriptContext as r, attachRuntimeUserTurnTranscriptContext as t };
