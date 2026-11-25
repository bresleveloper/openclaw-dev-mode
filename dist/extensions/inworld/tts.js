import { truncateUtf16Safe } from "openclaw/plugin-sdk/speech-provider";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
// extensions/inworld/tts.ts
const DEFAULT_INWORLD_BASE_URL = "https://api.inworld.ai";
const DEFAULT_INWORLD_VOICE_ID = "Sarah";
const DEFAULT_INWORLD_MODEL_ID = "inworld-tts-1.5-max";
const INWORLD_UPSTREAM_IDLE_TIMEOUT_MS = 3e4;
const INWORLD_ERROR_BODY_MAX_BYTES = 8192;
const INWORLD_ERROR_BODY_MAX_CHARS = 400;
const INWORLD_ERROR_BODY_READ_IDLE_TIMEOUT_MS = 1e4;
var InworldErrorBodyOverflow = class extends Error {};
async function readInworldErrorBodySnippet(response) {
	let buffer;
	try {
		buffer = await readResponseWithLimit(response, INWORLD_ERROR_BODY_MAX_BYTES, {
			chunkTimeoutMs: INWORLD_ERROR_BODY_READ_IDLE_TIMEOUT_MS,
			onOverflow: () => new InworldErrorBodyOverflow()
		});
	} catch (error) {
		return error instanceof InworldErrorBodyOverflow ? "(error body exceeded diagnostic limit; truncated)" : "";
	}
	const collapsed = buffer.toString("utf8").replace(/\s+/g, " ").trim();
	if (collapsed.length > INWORLD_ERROR_BODY_MAX_CHARS) return `${truncateUtf16Safe(collapsed, INWORLD_ERROR_BODY_MAX_CHARS)}…`;
	return collapsed;
}
const INWORLD_TTS_MODELS = [
	"inworld-tts-1.5-max",
	"inworld-tts-1.5-mini",
	"inworld-tts-1-max",
	"inworld-tts-1",
	"inworld-tts-2",
	"inworld-tts-2-flash"
];
const INWORLD_DELIVERY_MODES = [
	"STABLE",
	"BALANCED",
	"CREATIVE"
];
function normalizeInworldBaseUrl(baseUrl) {
	return (baseUrl?.trim())?.replace(/\/+$/, "") || DEFAULT_INWORLD_BASE_URL;
}
function ssrfPolicyFromInworldBaseUrl(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return { hostnameAllowlist: [parsed.hostname] };
	} catch {
		return;
	}
}
async function requestInworldText(params, request, maxAudioBytes, parse) {
	const baseUrl = normalizeInworldBaseUrl(params.baseUrl);
	const isTts = request.kind === "tts";
	const apiLabel = isTts ? "TTS" : "voices";
	const bodyLabel = isTts ? "TTS audio stream" : "voices response";
	const { fetchWithSsrFGuard } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const { response, release } = await fetchWithSsrFGuard({
		url: `${baseUrl}/${isTts ? "tts/v1/voice:stream" : "voices/v1/voices"}`,
		init: {
			method: isTts ? "POST" : "GET",
			headers: {
				...isTts ? { "Content-Type": "application/json" } : {},
				Authorization: `Basic ${params.apiKey}`
			},
			...request.kind === "tts" ? { body: request.body } : {}
		},
		timeoutMs: isTts ? params.timeoutMs : params.timeoutMs ?? INWORLD_UPSTREAM_IDLE_TIMEOUT_MS,
		policy: ssrfPolicyFromInworldBaseUrl(baseUrl),
		auditContext: isTts ? "inworld-tts" : "inworld-voices"
	});
	try {
		if (!response.ok) {
			const errorBody = await readInworldErrorBodySnippet(response);
			throw new Error(`Inworld ${apiLabel} API error (${response.status}): ${errorBody}`);
		}
		return parse((await readResponseWithLimit(response, maxAudioBytes * (isTts ? 2 : 1), {
			chunkTimeoutMs: INWORLD_UPSTREAM_IDLE_TIMEOUT_MS,
			onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Inworld ${bodyLabel} too large: ${size} bytes (limit: ${maxBytes} bytes)`),
			onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Inworld ${bodyLabel} stalled: no data received for ${chunkTimeoutMs}ms`)
		})).toString("utf8"));
	} finally {
		await release();
	}
}
/**
* Calls the Inworld streaming TTS endpoint and concatenates every audio chunk
* into a single buffer. The stream returns newline-delimited JSON, each line
* carrying base64 audio in `result.audioContent`.
*/
async function inworldTTS(params) {
	const { canonicalizeBase64, MAX_AUDIO_BYTES } = await import("openclaw/plugin-sdk/media-runtime");
	const modelId = params.modelId ?? "inworld-tts-1.5-max";
	return await requestInworldText(params, {
		kind: "tts",
		body: JSON.stringify({
			text: params.text,
			voiceId: params.voiceId ?? "Sarah",
			modelId,
			audioConfig: {
				audioEncoding: params.audioEncoding ?? "MP3",
				...params.sampleRateHertz && { sampleRateHertz: params.sampleRateHertz },
				...params.speakingRate != null && { speakingRate: params.speakingRate }
			},
			...params.temperature != null && { temperature: params.temperature },
			...modelId === "inworld-tts-2" && params.deliveryMode ? { deliveryMode: params.deliveryMode } : {}
		})
	}, MAX_AUDIO_BYTES, (body) => {
		const chunks = [];
		let decodedAudioBytes = 0;
		for (const line of body.split("\n")) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			let parsed;
			try {
				parsed = JSON.parse(trimmed);
			} catch {
				throw new Error(`Inworld TTS stream parse error: unexpected non-JSON line: ${truncateUtf16Safe(trimmed, 80)}`);
			}
			if (parsed.error) throw new Error(`Inworld TTS stream error (${parsed.error.code}): ${parsed.error.message}`);
			if (parsed.result?.audioContent) {
				const canonicalAudio = canonicalizeBase64(parsed.result.audioContent);
				if (!canonicalAudio) throw new Error("Inworld TTS returned malformed base64 audio data");
				const chunk = Buffer.from(canonicalAudio, "base64");
				const nextDecodedAudioBytes = decodedAudioBytes + chunk.length;
				if (nextDecodedAudioBytes > MAX_AUDIO_BYTES) throw new Error(`Inworld TTS decoded audio too large: ${nextDecodedAudioBytes} bytes (limit: ${MAX_AUDIO_BYTES} bytes)`);
				decodedAudioBytes = nextDecodedAudioBytes;
				chunks.push(chunk);
			}
		}
		if (chunks.length === 0) throw new Error("Inworld TTS returned no audio data");
		return Buffer.concat(chunks);
	});
}
async function listInworldVoices(params) {
	const { MAX_AUDIO_BYTES } = await import("openclaw/plugin-sdk/media-runtime");
	return await requestInworldText(params, { kind: "voices" }, MAX_AUDIO_BYTES, (voicesBody) => {
		let json;
		try {
			json = JSON.parse(voicesBody);
		} catch {
			throw new Error("Inworld voices API returned malformed JSON");
		}
		return Array.isArray(json.voices) ? json.voices.map((voice) => ({
			id: voice.voiceId?.trim() ?? "",
			name: voice.displayName?.trim() || void 0,
			description: voice.description?.trim() || void 0,
			locale: voice.langCode || void 0,
			gender: voice.tags?.find((t) => t === "male" || t === "female") || void 0
		})).filter((voice) => voice.id.length > 0) : [];
	});
}
export { DEFAULT_INWORLD_MODEL_ID, DEFAULT_INWORLD_VOICE_ID, INWORLD_DELIVERY_MODES, INWORLD_TTS_MODELS, inworldTTS, listInworldVoices, normalizeInworldBaseUrl };
