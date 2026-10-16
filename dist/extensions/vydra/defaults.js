import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/vydra/defaults.ts
const DEFAULT_VYDRA_BASE_URL = "https://www.vydra.ai/api/v1";
const DEFAULT_VYDRA_IMAGE_MODEL = "grok-imagine";
const DEFAULT_VYDRA_VIDEO_MODEL = "veo3";
const DEFAULT_VYDRA_SPEECH_MODEL = "elevenlabs/tts";
const DEFAULT_VYDRA_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
function normalizeVydraBaseUrl(value) {
	const trimmed = normalizeOptionalString(value);
	const url = trimmed ? URL.parse(trimmed) : null;
	if (!url) return DEFAULT_VYDRA_BASE_URL;
	if (url.hostname === "vydra.ai") url.hostname = "www.vydra.ai";
	url.pathname = url.pathname.replace(/\/+$/u, "") || "/api/v1";
	return url.toString().replace(/\/$/u, "");
}
//#endregion
export { DEFAULT_VYDRA_BASE_URL, DEFAULT_VYDRA_IMAGE_MODEL, DEFAULT_VYDRA_SPEECH_MODEL, DEFAULT_VYDRA_VIDEO_MODEL, DEFAULT_VYDRA_VOICE_ID, normalizeVydraBaseUrl };
