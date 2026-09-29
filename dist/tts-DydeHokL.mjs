import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { f as saveMediaBuffer } from "./store-CqRcb7T5.mjs";
import { b as setTtsMachinePrefsPathResolver } from "./tts-settings-CuXW4C4p.mjs";
import { n as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CWCWnxsU.mjs";
import { C as setSpeechRuntimeAvailabilityGuard, b as textToSpeechCore, u as maybeApplyTtsToPayloadCore } from "./runtime-api-BvEX7sJP.mjs";
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
setTtsMachinePrefsPathResolver(() => readConfigMachineState("tts.prefsPath"));
function textToSpeech(params) {
	return textToSpeechCore(params, persistTtsAudioToMediaStore);
}
function maybeApplyTtsToPayload(params) {
	return maybeApplyTtsToPayloadCore(params, persistTtsAudioToMediaStore);
}
//#endregion
export { textToSpeech as n, maybeApplyTtsToPayload as t };
