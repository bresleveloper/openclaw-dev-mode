//#region src/agents/sessions/transcript-turn-error.ts
/** Native agent and Gateway error surfaces can retain only the admission assertion text. */
function isSessionTranscriptTurnMismatchErrorMessage(message) {
	const text = message?.replace(/^Error: /, "") ?? "";
	return /^Transcript idempotency key ".+" conflicts with the admitted message\.$/.test(text) || /^Session transcript keyed user is outside the current turn: \S/.test(text) || text === "Pending input is no longer active in its admitted transcript" || text === "Pending input session changed before transcript promotion" || text === "Pending input custody ended before transcript promotion" || text === "Model prompt projection lost its canonical user turn";
}
//#endregion
export { isSessionTranscriptTurnMismatchErrorMessage as t };
