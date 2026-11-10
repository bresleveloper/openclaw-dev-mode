import { s as createMessageInjectionAuthority } from "./message-injection-authority-Mu3hgByB.mjs";
//#region src/sessions/user-turn-transcript-runtime-context.ts
const RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT = Symbol.for("openclaw.runtimeUserTurnTranscriptContext");
const RUNTIME_USER_TURN_TRANSCRIPT_RECORDER = Symbol.for("openclaw.runtimeUserTurnTranscriptRecorder");
async function withCurrentUserTurnInput(recorder, run) {
	return await (recorder?.withPendingInputCurrent ? recorder.withPendingInputCurrent(run) : recorder?.withPendingInput ? recorder.withPendingInput(run) : run());
}
function bindUserTurnInput(recorder, assertCallerCurrent) {
	const assertNativeCurrent = () => {
		assertCallerCurrent();
		recorder?.withPendingInput?.(() => {});
	};
	return {
		assertNativeCurrent,
		assertLifetimeCurrent: () => {
			assertCallerCurrent();
			if (recorder?.assertPendingInputLifetimeCurrent) recorder.assertPendingInputLifetimeCurrent();
			else recorder?.withPendingInput?.(() => {});
		},
		withCurrent: async (run) => {
			assertCallerCurrent();
			return await withCurrentUserTurnInput(recorder, () => {
				assertCallerCurrent();
				return run();
			});
		}
	};
}
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
	const context = Reflect.get(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT);
	if (context) Reflect.deleteProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT);
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
function readRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
	return Reflect.get(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER);
}
/** A steered message retains its own live custody while another turn owns the runtime. */
function withRuntimeUserTurnTranscriptRecorder(runtimeMessage, append) {
	const recorder = readRuntimeUserTurnTranscriptRecorder(runtimeMessage);
	const assertCommit = recorder?.assertOriginalInputCommit;
	const beforeFreshMessageCommit = assertCommit ? createMessageInjectionAuthority(() => {
		assertCommit();
		return true;
	}) : void 0;
	const persist = () => append(beforeFreshMessageCommit);
	return recorder?.withPendingInput ? recorder.withPendingInput(persist) : persist();
}
async function withCurrentRuntimeUserTurnTranscriptRecorder(runtimeMessage, append) {
	return await withCurrentUserTurnInput(readRuntimeUserTurnTranscriptRecorder(runtimeMessage), () => withRuntimeUserTurnTranscriptRecorder(runtimeMessage, append));
}
function takeRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
	const recorder = readRuntimeUserTurnTranscriptRecorder(runtimeMessage);
	if (recorder) Reflect.deleteProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER);
	return recorder;
}
//#endregion
export { takeRuntimeUserTurnTranscriptRecorder as a, withRuntimeUserTurnTranscriptRecorder as c, takeRuntimeUserTurnTranscriptContext as i, attachRuntimeUserTurnTranscriptRecorder as n, withCurrentRuntimeUserTurnTranscriptRecorder as o, bindUserTurnInput as r, withCurrentUserTurnInput as s, attachRuntimeUserTurnTranscriptContext as t };
