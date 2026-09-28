import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, u as readStringField } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
//#region extensions/minimax/tts.ts
const DEFAULT_MINIMAX_TTS_BASE_URL = "https://api.minimax.io";
const MINIMAX_TTS_MODELS = [
	"speech-2.8-hd",
	"speech-2.8-turbo",
	"speech-2.6-hd",
	"speech-2.6-turbo",
	"speech-02-hd",
	"speech-02-turbo",
	"speech-01-hd",
	"speech-01-turbo"
];
const MINIMAX_TTS_VOICES = [
	"English_expressive_narrator",
	"Chinese (Mandarin)_Warm_Girl",
	"Chinese (Mandarin)_Lively_Girl",
	"Chinese (Mandarin)_Gentle_Boy",
	"Chinese (Mandarin)_Steady_Boy"
];
function normalizeMinimaxTtsBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return DEFAULT_MINIMAX_TTS_BASE_URL;
	return trimmed.replace(/\/+$/, "").replace(/\/(?:anthropic|v1)$/i, "");
}
function normalizeMinimaxTtsPitch(pitch) {
	return Math.trunc(pitch);
}
async function minimaxTTS(params) {
	const { text, apiKey, baseUrl, model, voiceId, speed = 1, vol = 1, pitch = 0, format = "mp3", sampleRate = 32e3, timeoutMs } = params;
	const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
	const { assertOkOrThrowProviderError, readProviderJsonObjectResponse } = await import("./plugin-sdk/provider-http.js");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("./plugin-sdk/ssrf-runtime.js");
	const { assertMinimaxBaseResp, normalizeMinimaxHexAudio } = await import("./extensions/minimax/media-provider-runtime.js");
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), safeTimeoutMs);
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url: `${baseUrl}/v1/t2a_v2`,
			init: {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model,
					text,
					stream: false,
					output_format: "hex",
					voice_setting: {
						voice_id: voiceId,
						speed,
						vol,
						pitch: normalizeMinimaxTtsPitch(pitch)
					},
					audio_setting: {
						format,
						sample_rate: sampleRate
					}
				}),
				signal: controller.signal
			},
			timeoutMs: safeTimeoutMs,
			policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
			auditContext: "minimax.tts"
		});
		try {
			await assertOkOrThrowProviderError(response, "MiniMax TTS API error");
			const body = await readProviderJsonObjectResponse(response, "minimax.tts");
			assertMinimaxBaseResp(body.base_resp, "MiniMax TTS API error");
			const hexAudio = readStringField(asOptionalRecord(body.data), "audio");
			if (!hexAudio) throw new Error("MiniMax TTS API returned no audio data");
			return Buffer.from(normalizeMinimaxHexAudio(hexAudio, "MiniMax TTS API"), "hex");
		} finally {
			await release();
		}
	} finally {
		clearTimeout(timeout);
	}
}
//#endregion
export { normalizeMinimaxTtsBaseUrl as a, minimaxTTS as i, MINIMAX_TTS_MODELS as n, MINIMAX_TTS_VOICES as r, DEFAULT_MINIMAX_TTS_BASE_URL as t };
