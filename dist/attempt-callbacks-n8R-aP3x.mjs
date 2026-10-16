import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/command/attempt-callbacks.ts
function resetAgentAttemptLifecycle(state) {
	state.lifecycleError = void 0;
	state.lifecycleErrorObservation = void 0;
	state.lifecycleFinishing = false;
	state.lifecycleEnded = false;
}
function emitAgentAttemptRuntimeStart(info, onAgentEvent) {
	if (info.phase === "assistant_output_started" || info.phase === "tool_execution_started") onAgentEvent({
		stream: "lifecycle",
		data: { phase: "start" }
	});
}
function createAgentAttemptLifecycleCallbacks(state, onRuntimeTurnStarted) {
	return {
		onUserMessagePersisted: () => {
			state.currentTurnUserMessagePersisted = true;
		},
		onAgentEvent: (evt) => {
			if (evt.stream !== "lifecycle" || typeof evt.data?.phase !== "string") return;
			if (evt.data.phase === "start") {
				resetAgentAttemptLifecycle(state);
				return onRuntimeTurnStarted?.();
			}
			if (typeof evt.data.error === "string" && evt.data.error.trim()) {
				state.lifecycleError = evt.data.error;
				state.lifecycleErrorObservation = asOptionalRecord(evt.data.errorObservation);
			}
			if (evt.data.phase === "finishing") {
				state.lifecycleFinishing = true;
				return;
			}
			if (evt.data.phase === "end" || evt.data.phase === "error") state.lifecycleEnded = true;
		}
	};
}
//#endregion
export { emitAgentAttemptRuntimeStart as n, resetAgentAttemptLifecycle as r, createAgentAttemptLifecycleCallbacks as t };
