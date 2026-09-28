//#region src/media-understanding/transcription-text.ts
/** Empty STT prompt echoes are not speech; match whole utterances, never prose fragments. */
function isTranscriptArtifactText(text) {
	const normalized = text.trim().replace(/\s+/gu, " ").toLowerCase();
	return normalized === "" || normalized === "context:" || normalized === "###" || normalized === "transcribe the audio" || normalized === "transcribe the audio.";
}
//#endregion
export { isTranscriptArtifactText as t };
