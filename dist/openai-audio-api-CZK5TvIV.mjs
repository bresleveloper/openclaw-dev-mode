//#region src/media-understanding/openai-audio-api.ts
const OPENAI_AUDIO_TRANSCRIPTIONS_API = "openai-audio-transcriptions";
function resolveOpenAiAudioAuthModelApi(params) {
	return params.capability === "audio" && params.providerId.trim().toLowerCase() === "openai" ? OPENAI_AUDIO_TRANSCRIPTIONS_API : void 0;
}
//#endregion
export { resolveOpenAiAudioAuthModelApi as n, OPENAI_AUDIO_TRANSCRIPTIONS_API as t };
