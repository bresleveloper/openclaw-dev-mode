import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeMimeType, i as getFileExtension } from "./mime-1zBUMwu6.mjs";
//#region src/media/audio.ts
/** File extensions accepted by channel voice-message upload paths. */
const VOICE_MESSAGE_AUDIO_EXTENSIONS = /* @__PURE__ */ new Set([
	".oga",
	".ogg",
	".opus",
	".mp3",
	".m4a"
]);
/** MIME types compatible with voice-message upload paths. */
const VOICE_MESSAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"audio/ogg",
	"audio/opus",
	"audio/mpeg",
	"audio/mp3",
	"audio/mp4",
	"audio/x-m4a",
	"audio/m4a"
]);
/** Checks whether MIME type or filename is compatible with voice-message delivery. */
function isVoiceMessageCompatibleAudio(opts) {
	const mime = normalizeMimeType(opts.contentType);
	if (mime && VOICE_MESSAGE_MIME_TYPES.has(mime)) return true;
	const fileName = normalizeOptionalString(opts.fileName);
	if (!fileName) return false;
	const ext = getFileExtension(fileName);
	if (!ext) return false;
	return VOICE_MESSAGE_AUDIO_EXTENSIONS.has(ext);
}
/**
* Backward-compatible alias for voice-message audio compatibility checks.
*
* @deprecated Use isVoiceMessageCompatibleAudio.
*/
function isVoiceCompatibleAudio(opts) {
	return isVoiceMessageCompatibleAudio(opts);
}
//#endregion
export { isVoiceMessageCompatibleAudio as n, isVoiceCompatibleAudio as t };
