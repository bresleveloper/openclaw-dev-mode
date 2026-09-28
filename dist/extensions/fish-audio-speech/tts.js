import { MAX_AUDIO_BYTES } from "openclaw/plugin-sdk/speech-provider";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/fish-audio-speech/tts.ts
const FISH_AUDIO_BASE_URL = "https://api.fish.audio";
const FISH_AUDIO_VOICES_MAX_BYTES = 2097152;
const FISH_AUDIO_VOICE_PAGE_SIZE = 100;
const FISH_AUDIO_MAX_OWN_VOICE_PAGES = 20;
function normalizeFishAudioBaseUrl(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.replace(/\/+$/u, "") : FISH_AUDIO_BASE_URL;
}
function buildFishAudioRequestBody(params) {
	return JSON.stringify({
		text: params.text,
		format: params.format,
		...params.referenceId ? { reference_id: params.referenceId } : {},
		...params.sampleRate == null ? {} : { sample_rate: params.sampleRate },
		...params.latency == null ? {} : { latency: params.latency },
		...params.speed == null ? {} : { prosody: { speed: params.speed } },
		...params.temperature == null ? {} : { temperature: params.temperature },
		...params.topP == null ? {} : { top_p: params.topP },
		...params.normalize == null ? {} : { normalize: params.normalize }
	});
}
async function requestFishAudioTts(params) {
	const baseUrl = normalizeFishAudioBaseUrl(params.baseUrl);
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	return await fetchWithSsrFGuard({
		url: `${baseUrl}/v1/tts`,
		init: {
			method: "POST",
			headers: {
				Authorization: `Bearer ${params.apiKey}`,
				"Content-Type": "application/json",
				model: params.model
			},
			body: buildFishAudioRequestBody(params)
		},
		timeoutMs: params.timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
		auditContext: "fish-audio.tts"
	});
}
async function fishAudioTts(params) {
	const { assertOkOrThrowProviderError, readProviderBinaryResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { response, release } = await requestFishAudioTts(params);
	try {
		await assertOkOrThrowProviderError(response, "Fish Audio TTS API error");
		return await readProviderBinaryResponse(response, "Fish Audio TTS API error", "audio", { maxBytes: params.maxBytes });
	} finally {
		await release();
	}
}
async function fishAudioTtsStream(params) {
	const { createBoundedProviderBinaryStream } = await import("openclaw/plugin-sdk/provider-binary-stream");
	const { assertOkOrThrowProviderError, assertProviderBinaryResponseContent } = await import("openclaw/plugin-sdk/provider-http");
	const { response, release } = await requestFishAudioTts(params);
	let handedOff = false;
	try {
		await assertOkOrThrowProviderError(response, "Fish Audio TTS API error");
		assertProviderBinaryResponseContent(response, "Fish Audio TTS API error", "audio");
		if (!response.body) throw new Error("Fish Audio TTS API response missing audio stream");
		const bounded = createBoundedProviderBinaryStream(response.body, {
			maxBytes: params.maxBytes,
			createOverflowError: ({ maxBytes }) => /* @__PURE__ */ new Error(`Fish Audio TTS API error: audio response exceeds ${maxBytes} bytes`),
			createReleaseError: () => /* @__PURE__ */ new Error("Fish Audio TTS stream released"),
			cleanup: release
		});
		handedOff = true;
		return {
			audioStream: bounded.stream,
			release: bounded.release
		};
	} finally {
		if (!handedOff) await release();
	}
}
function parseVoiceItem(value) {
	const item = asOptionalRecord(value);
	const id = normalizeOptionalString(item?.["_id"]);
	if (!id) return;
	const languages = Array.isArray(item?.languages) ? item.languages.flatMap((entry) => typeof entry === "string" && entry.trim() ? [entry.trim()] : []) : [];
	const tags = Array.isArray(item?.tags) ? item.tags.flatMap((entry) => typeof entry === "string" && entry.trim() ? [entry.trim()] : []) : [];
	return {
		id,
		name: normalizeOptionalString(item?.title),
		description: normalizeOptionalString(item?.description),
		category: normalizeOptionalString(item?.visibility),
		locale: languages[0],
		personalities: tags.length > 0 ? tags : void 0
	};
}
async function requestVoicePage(params) {
	const url = new URL(`${normalizeFishAudioBaseUrl(params.baseUrl)}/model`);
	url.searchParams.set("type", "tts");
	url.searchParams.set("page_size", String(FISH_AUDIO_VOICE_PAGE_SIZE));
	url.searchParams.set("page_number", String(params.pageNumber));
	if (params.self) url.searchParams.set("self", "true");
	else url.searchParams.set("sort_by", "score");
	const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const { response, release } = await fetchWithSsrFGuard({
		url: url.toString(),
		init: { headers: { Authorization: `Bearer ${params.apiKey}` } },
		timeoutMs: params.timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(params.baseUrl),
		auditContext: "fish-audio.voices"
	});
	try {
		await assertOkOrThrowProviderError(response, "Fish Audio voices API error");
		return await readProviderJsonResponse(response, "Fish Audio voices", { maxBytes: FISH_AUDIO_VOICES_MAX_BYTES });
	} finally {
		await release();
	}
}
async function listFishAudioVoices(params) {
	const own = [];
	for (let pageNumber = 1; pageNumber <= FISH_AUDIO_MAX_OWN_VOICE_PAGES; pageNumber += 1) {
		const payload = await requestVoicePage({
			...params,
			self: true,
			pageNumber
		});
		const items = Array.isArray(payload.items) ? payload.items : [];
		own.push(...items.flatMap((item) => parseVoiceItem(item) ?? []));
		if (items.length < FISH_AUDIO_VOICE_PAGE_SIZE || own.length >= (payload.total ?? Number.MAX_SAFE_INTEGER)) break;
	}
	let publicVoices = [];
	try {
		const payload = await requestVoicePage({
			...params,
			self: false,
			pageNumber: 1
		});
		publicVoices = (Array.isArray(payload.items) ? payload.items : []).flatMap((item) => parseVoiceItem(item) ?? []);
	} catch {}
	const seen = /* @__PURE__ */ new Set();
	return [...own, ...publicVoices].filter((voice) => {
		if (seen.has(voice.id)) return false;
		seen.add(voice.id);
		return true;
	});
}
const FISH_AUDIO_STREAM_MAX_BYTES = MAX_AUDIO_BYTES;
//#endregion
export { FISH_AUDIO_STREAM_MAX_BYTES, fishAudioTts, fishAudioTtsStream, listFishAudioVoices, normalizeFishAudioBaseUrl };
