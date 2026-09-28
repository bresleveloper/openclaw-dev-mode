import { i as requireInRange, n as normalizeLanguageCode, r as normalizeSeed, t as normalizeApplyTextNormalization } from "./tts-provider-helpers-C-NkgFz4.mjs";
import "./speech-provider-CgepLVUd.mjs";
import { n as isValidElevenLabsVoiceId, r as normalizeElevenLabsBaseUrl } from "./shared-C4zbmF0I.mjs";
//#region extensions/elevenlabs/tts.ts
function assertElevenLabsVoiceSettings(settings) {
	requireInRange(settings.stability, 0, 1, "stability");
	requireInRange(settings.similarityBoost, 0, 1, "similarityBoost");
	requireInRange(settings.style, 0, 1, "style");
	requireInRange(settings.speed, .5, 2, "speed");
}
function resolveElevenLabsAcceptHeader(outputFormat) {
	const normalized = outputFormat.trim().toLowerCase();
	if (!normalized || normalized.startsWith("mp3_")) return "audio/mpeg";
}
function normalizeElevenLabsLatencyTier(latencyTier) {
	if (latencyTier === void 0 || !Number.isFinite(latencyTier)) return;
	if (!Number.isSafeInteger(latencyTier)) throw new Error("latencyTier must be an integer");
	requireInRange(latencyTier, 0, 4, "latencyTier");
	return latencyTier;
}
function prepareElevenLabsTtsRequest(params) {
	const { text, baseUrl, voiceId, modelId, outputFormat, seed, applyTextNormalization, languageCode, latencyTier, voiceSettings } = params;
	if (!isValidElevenLabsVoiceId(voiceId)) throw new Error("Invalid voiceId format");
	assertElevenLabsVoiceSettings(voiceSettings);
	const normalizedLanguage = normalizeLanguageCode(languageCode);
	const normalizedNormalization = normalizeApplyTextNormalization(applyTextNormalization);
	const normalizedSeed = normalizeSeed(seed);
	const normalizedBaseUrl = normalizeElevenLabsBaseUrl(baseUrl);
	const normalizedLatencyTier = normalizeElevenLabsLatencyTier(latencyTier);
	const url = new URL(`${normalizedBaseUrl}/v1/text-to-speech/${voiceId}${params.stream ? "/stream" : ""}`);
	if (outputFormat) url.searchParams.set("output_format", outputFormat);
	const supportsStreamingLatency = modelId.trim().toLowerCase() !== "eleven_v3";
	if (normalizedLatencyTier !== void 0 && supportsStreamingLatency) url.searchParams.set("optimize_streaming_latency", normalizedLatencyTier.toString());
	return {
		url,
		normalizedBaseUrl,
		acceptHeader: resolveElevenLabsAcceptHeader(outputFormat),
		body: JSON.stringify({
			text,
			model_id: modelId,
			seed: normalizedSeed,
			apply_text_normalization: normalizedNormalization,
			language_code: normalizedLanguage,
			voice_settings: {
				stability: voiceSettings.stability,
				similarity_boost: voiceSettings.similarityBoost,
				style: voiceSettings.style,
				use_speaker_boost: voiceSettings.useSpeakerBoost,
				speed: voiceSettings.speed
			}
		})
	};
}
async function elevenLabsTTS(params) {
	const { apiKey, timeoutMs } = params;
	const { url, normalizedBaseUrl, acceptHeader, body } = prepareElevenLabsTtsRequest({
		...params,
		stream: false
	});
	const { assertOkOrThrowProviderError, readProviderBinaryResponse } = await import("./plugin-sdk/provider-http.js");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("./plugin-sdk/ssrf-runtime.js");
	const { response, release } = await fetchWithSsrFGuard({
		url: url.toString(),
		init: {
			method: "POST",
			headers: {
				"xi-api-key": apiKey,
				"Content-Type": "application/json",
				...acceptHeader ? { Accept: acceptHeader } : {}
			},
			body
		},
		timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
		auditContext: "elevenlabs.tts"
	});
	try {
		await assertOkOrThrowProviderError(response, "ElevenLabs API error");
		return await readProviderBinaryResponse(response, "ElevenLabs API error", "audio");
	} finally {
		await release();
	}
}
async function elevenLabsTTSStream(params) {
	const { apiKey, timeoutMs } = params;
	const { url, normalizedBaseUrl, acceptHeader, body } = prepareElevenLabsTtsRequest({
		...params,
		stream: true
	});
	const { MAX_AUDIO_BYTES } = await import("./plugin-sdk/media-runtime.js");
	const { createBoundedProviderBinaryStream } = await import("./plugin-sdk/provider-binary-stream.js");
	const { assertOkOrThrowProviderError, assertProviderBinaryResponseContent } = await import("./plugin-sdk/provider-http.js");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("./plugin-sdk/ssrf-runtime.js");
	const { response, release } = await fetchWithSsrFGuard({
		url: url.toString(),
		init: {
			method: "POST",
			headers: {
				"xi-api-key": apiKey,
				"Content-Type": "application/json",
				...acceptHeader ? { Accept: acceptHeader } : {}
			},
			body
		},
		timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
		auditContext: "elevenlabs.tts.stream"
	});
	let handedOff = false;
	try {
		await assertOkOrThrowProviderError(response, "ElevenLabs API error");
		assertProviderBinaryResponseContent(response, "ElevenLabs API error", "audio");
		if (!response.body) throw new Error("ElevenLabs API response missing audio stream");
		const boundedStream = createBoundedProviderBinaryStream(response.body, {
			maxBytes: MAX_AUDIO_BYTES,
			createOverflowError: ({ maxBytes }) => /* @__PURE__ */ new Error(`ElevenLabs API error: audio response exceeds ${maxBytes} bytes`),
			createReleaseError: () => /* @__PURE__ */ new Error("ElevenLabs TTS stream released"),
			cleanup: release
		});
		handedOff = true;
		return {
			audioStream: boundedStream.stream,
			release: boundedStream.release
		};
	} finally {
		if (!handedOff) await release();
	}
}
//#endregion
export { elevenLabsTTSStream as n, elevenLabsTTS as t };
