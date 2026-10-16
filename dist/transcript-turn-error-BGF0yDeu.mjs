//#region src/agents/sessions/transcript-turn-error.ts
/** Native agent and Gateway error surfaces can retain only the assertion text. */
function isSessionTranscriptTurnMismatchErrorMessage(message) {
	return /^(?:Error: )?Session transcript keyed user is outside the current turn: \S/.test(message ?? "");
}
//#endregion
export { isSessionTranscriptTurnMismatchErrorMessage as t };
