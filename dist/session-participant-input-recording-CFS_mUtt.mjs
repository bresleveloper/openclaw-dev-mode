import { o as sessionParticipantInput } from "./host-context-builder-BBwOEVfN.mjs";
import { t as recordSessionParticipantBestEffort } from "./session-participant-recording-Cbdqxwp1.mjs";
//#region src/sessions/session-participant-input-recording.ts
/** Call only after admission and final target selection; never creates a session to count input. */
function recordAcceptedSessionParticipantInput(ctx, target) {
	for (const input of ctx[sessionParticipantInput] ?? []) if (!input.recorded) {
		input.recorded = true;
		recordSessionParticipantBestEffort({
			...target,
			identity: input.identity,
			promptedAt: input.promptedAt
		});
	}
}
//#endregion
export { recordAcceptedSessionParticipantInput as t };
