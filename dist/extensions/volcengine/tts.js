import { asOptionalRecord, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import * as crypto from "node:crypto";
//#region extensions/volcengine/tts.ts
const DEFAULT_SEED_VOICE = "en_female_anna_mars_bigtts";
const DEFAULT_LEGACY_VOICE = "zh_female_xiaohe_uranus_bigtts";
const DEFAULT_CLUSTER = "volcano_tts";
const DEFAULT_SEED_TTS_RESOURCE_ID = "seed-tts-1.0";
const DEFAULT_SEED_TTS_APP_KEY = "aGjiRDfUWi";
const VOLCENGINE_TTS_RESPONSE_MAX_BYTES = 16777216;
const BYTEPLUS_SEED_TTS_URL = "https://voice.ap-southeast-1.bytepluses.com/api/v3/tts/unidirectional";
const VOLCENGINE_LEGACY_TTS_URL = "https://openspeech.bytedance.com/api/v1/tts";
function parseJsonObject(text, providerName) {
	try {
		const parsed = JSON.parse(text);
		if (!isRecord(parsed)) throw new Error("expected JSON object");
		return parsed;
	} catch (err) {
		const detail = err instanceof Error ? err.message : String(err);
		throw new Error(`${providerName} TTS: failed to parse response JSON: ${detail}`, { cause: err });
	}
}
function toTtsResponse(parsed) {
	const header = asOptionalRecord(parsed.header);
	return {
		code: typeof parsed.code === "number" ? parsed.code : typeof header?.code === "number" ? header.code : void 0,
		message: typeof parsed.message === "string" ? parsed.message : typeof header?.message === "string" ? header.message : void 0,
		data: typeof parsed.data === "string" ? parsed.data : void 0
	};
}
function parseSeedTtsFrames(text) {
	const trimmed = text.trim();
	if (!trimmed) return [];
	try {
		return [toTtsResponse(parseJsonObject(trimmed, "BytePlus Seed Speech"))];
	} catch {}
	const frames = [];
	for (const line of trimmed.split(/\r?\n/)) {
		const item = line.trim();
		if (!item) continue;
		const json = item.startsWith("data:") ? item.slice(5).trim() : item;
		frames.push(toTtsResponse(parseJsonObject(json, "BytePlus Seed Speech")));
	}
	return frames;
}
async function volcengineTTS(params) {
	if (!params.apiKey && (!params.appId || !params.token)) throw new Error("Volcengine TTS credentials missing. Set a BytePlus Seed Speech API key or legacy AppID/token.");
	const { text, apiKey, appId, token, voice = apiKey ? DEFAULT_SEED_VOICE : DEFAULT_LEGACY_VOICE, cluster = DEFAULT_CLUSTER, resourceId = DEFAULT_SEED_TTS_RESOURCE_ID, appKey = DEFAULT_SEED_TTS_APP_KEY, baseUrl = apiKey ? BYTEPLUS_SEED_TTS_URL : VOLCENGINE_LEGACY_TTS_URL, speedRatio = 1, volumeRatio = 1, pitchRatio = 1, emotion, encoding = "ogg_opus", timeoutMs = 3e4 } = params;
	const { canonicalizeBase64 } = await import("openclaw/plugin-sdk/media-runtime");
	const { readResponseWithLimit } = await import("openclaw/plugin-sdk/response-limit-runtime");
	const { fetchWithSsrFGuard } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const providerName = apiKey ? "BytePlus Seed Speech" : "Volcengine";
	const payload = apiKey ? {
		user: { uid: "openclaw" },
		req_params: {
			text,
			speaker: voice,
			audio_params: {
				format: encoding === "wav" ? "pcm" : encoding,
				sample_rate: 24e3
			},
			...speedRatio !== 1 ? { speed_ratio: speedRatio } : {},
			...emotion ? { emotion } : {}
		}
	} : {
		app: {
			appid: appId,
			token,
			cluster
		},
		user: { uid: "openclaw" },
		audio: {
			voice_type: voice,
			encoding,
			speed_ratio: speedRatio,
			volume_ratio: volumeRatio,
			pitch_ratio: pitchRatio,
			...emotion ? { emotion } : {}
		},
		request: {
			reqid: crypto.randomUUID(),
			text,
			text_type: "plain",
			operation: "query"
		}
	};
	const { response, release } = await fetchWithSsrFGuard({
		url: baseUrl,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...apiKey ? {
					Connection: "keep-alive",
					"X-Api-Key": apiKey,
					"X-Api-Resource-Id": resourceId,
					"X-Api-App-Key": appKey
				} : { Authorization: `Bearer;${token}` }
			},
			body: JSON.stringify(payload)
		},
		timeoutMs,
		policy: { hostnameAllowlist: [new URL(baseUrl).hostname] },
		auditContext: "volcengine.tts"
	});
	try {
		const responseText = new TextDecoder("utf-8", { fatal: true }).decode(await readResponseWithLimit(response, VOLCENGINE_TTS_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${providerName} TTS response exceeds ${maxBytes} bytes`) }));
		if (!apiKey) {
			const body = toTtsResponse(parseJsonObject(responseText, providerName));
			if (!response.ok || body.code !== 3e3 || !body.data) throw new Error(`Volcengine TTS error ${body.code ?? response.status}: ${body.message ?? "unknown"}`);
			const canonicalAudio = canonicalizeBase64(body.data);
			if (!canonicalAudio) throw new Error("Volcengine TTS returned malformed base64 audio data");
			return Buffer.from(canonicalAudio, "base64");
		}
		const frames = parseSeedTtsFrames(responseText);
		const chunks = [];
		for (const frame of frames) {
			if (frame.code === 0) {
				if (frame.data) {
					const canonicalAudio = canonicalizeBase64(frame.data);
					if (!canonicalAudio) throw new Error("BytePlus Seed Speech TTS returned malformed base64 audio data");
					chunks.push(Buffer.from(canonicalAudio, "base64"));
				}
				continue;
			}
			if (frame.code === 2e7) continue;
			throw new Error(`BytePlus Seed Speech TTS error ${frame.code ?? response.status}: ${frame.message ?? "unknown"}`);
		}
		if (!response.ok || chunks.length === 0) throw new Error(`BytePlus Seed Speech TTS error ${response.status}: no audio data`);
		return Buffer.concat(chunks);
	} finally {
		await release();
	}
}
//#endregion
export { volcengineTTS };
