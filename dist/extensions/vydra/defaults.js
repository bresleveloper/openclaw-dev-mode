import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/vydra/defaults.ts
const DEFAULT_VYDRA_BASE_URL = "https://www.vydra.ai/api/v1";
const DEFAULT_VYDRA_IMAGE_MODEL = "grok-imagine";
const DEFAULT_VYDRA_VIDEO_MODEL = "veo3";
const DEFAULT_VYDRA_SPEECH_MODEL = "elevenlabs/tts";
const DEFAULT_VYDRA_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
function normalizeVydraBaseUrl(value) {
	const fallback = DEFAULT_VYDRA_BASE_URL;
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return fallback;
	try {
		const url = new URL(trimmed);
		if (url.hostname === "vydra.ai") url.hostname = "www.vydra.ai";
		const pathname = url.pathname.replace(/\/+$/u, "");
		if (!pathname) url.pathname = "/api/v1";
		else url.pathname = pathname;
		return url.toString().replace(/\/$/u, "");
	} catch {
		return fallback;
	}
}
//#endregion
export { DEFAULT_VYDRA_BASE_URL, DEFAULT_VYDRA_IMAGE_MODEL, DEFAULT_VYDRA_SPEECH_MODEL, DEFAULT_VYDRA_VIDEO_MODEL, DEFAULT_VYDRA_VOICE_ID, normalizeVydraBaseUrl };
