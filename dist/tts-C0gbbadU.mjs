import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import { u as mimeTypeFromFilePath } from "./mime-C3j3dfQb.mjs";
import { f as saveMediaBuffer } from "./store-BOkrav0N.mjs";
import { S as setTtsMachinePrefsPathResolver } from "./tts-settings-D0coreBP.mjs";
import { i as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-BaCve0jk.mjs";
import { t as getPreparedTtsPreferences } from "./tts-preferences-Bp6AU2gl.mjs";
import { S as textToSpeechCore, T as setSpeechRuntimeAvailabilityGuard, f as maybeApplyTtsToPayloadCore } from "./runtime-api-BSuqjkok.mjs";
//#region src/tts/tts-audio-store.ts
const TTS_MEDIA_SUBDIR = "tool-speech-synthesis";
const persistTtsAudioToMediaStore = async ({ audioBuffer, cfg, fileExtension }) => {
	const originalFilename = `voice${fileExtension}`;
	return (await saveMediaBuffer(audioBuffer, mimeTypeFromFilePath(originalFilename), TTS_MEDIA_SUBDIR, resolveGeneratedMediaMaxBytes(cfg, "audio"), originalFilename)).path;
};
//#endregion
//#region src/tts/tts.ts
/** Public TTS runtime barrel exposed to core callers and plugin SDK facades. */
setSpeechRuntimeAvailabilityGuard(() => {
	assertSecretOwnerAvailable("capability", "tts");
});
setTtsMachinePrefsPathResolver(() => getPreparedTtsPreferences()?.machinePrefsPath);
function textToSpeech(params) {
	return textToSpeechCore(params, persistTtsAudioToMediaStore);
}
function maybeApplyTtsToPayload(params) {
	return maybeApplyTtsToPayloadCore(params, persistTtsAudioToMediaStore);
}
//#endregion
export { textToSpeech as n, maybeApplyTtsToPayload as t };
