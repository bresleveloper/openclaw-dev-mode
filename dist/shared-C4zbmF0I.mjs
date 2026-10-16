//#region extensions/elevenlabs/shared.ts
const DEFAULT_ELEVENLABS_BASE_URL = "https://api.elevenlabs.io";
function isValidElevenLabsVoiceId(voiceId) {
	return /^[a-zA-Z0-9]{10,40}$/.test(voiceId);
}
function normalizeElevenLabsBaseUrlWithProtocols(baseUrl, allowedProtocols) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return DEFAULT_ELEVENLABS_BASE_URL;
	const normalized = trimmed.replace(/\/+$/, "");
	let parsed;
	try {
		parsed = new URL(normalized);
	} catch {
		throw new Error("Invalid ElevenLabs baseUrl: value is not a valid URL");
	}
	if (!allowedProtocols.includes(parsed.protocol)) throw new Error(`Invalid ElevenLabs baseUrl: unsupported scheme "${parsed.protocol}" (expected ${allowedProtocols.join(" or ")})`);
	return normalized;
}
function normalizeElevenLabsBaseUrl(baseUrl) {
	return normalizeElevenLabsBaseUrlWithProtocols(baseUrl, ["http:", "https:"]);
}
function normalizeElevenLabsRealtimeBaseUrl(baseUrl) {
	const url = new URL(normalizeElevenLabsBaseUrlWithProtocols(baseUrl, [
		"http:",
		"https:",
		"ws:",
		"wss:"
	]));
	if (url.protocol === "http:" || url.protocol === "https:") url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
	return url.toString().replace(/\/+$/, "");
}
//#endregion
export { normalizeElevenLabsRealtimeBaseUrl as i, isValidElevenLabsVoiceId as n, normalizeElevenLabsBaseUrl as r, DEFAULT_ELEVENLABS_BASE_URL as t };
