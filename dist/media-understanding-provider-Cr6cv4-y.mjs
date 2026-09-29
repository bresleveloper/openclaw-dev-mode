import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { d as requireTranscriptionText, l as postJsonRequest, p as resolveProviderHttpRequestConfig } from "./shared-BLFkM12I.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { t as OPENROUTER_BASE_URL } from "./provider-defaults-ilQX6q3J.mjs";
import "./provider-catalog-CAdWJvAA.mjs";
import path from "node:path";
//#region extensions/openrouter/media-understanding-provider.ts
const DEFAULT_OPENROUTER_AUDIO_TRANSCRIPTION_MODEL = "openai/whisper-large-v3-turbo";
const SUPPORTED_AUDIO_FORMATS = /* @__PURE__ */ new Set([
	"wav",
	"mp3",
	"flac",
	"m4a",
	"ogg",
	"webm",
	"aac"
]);
function normalizeMimeType(mime) {
	const normalized = mime?.trim().toLowerCase();
	if (!normalized) return;
	const [type] = normalized.split(";");
	return type?.trim() || void 0;
}
function resolveFormatFromMime(mime) {
	const normalized = normalizeMimeType(mime);
	if (!normalized) return;
	switch (normalized) {
		case "audio/wav":
		case "audio/x-wav": return "wav";
		case "audio/mpeg":
		case "audio/mp3": return "mp3";
		case "audio/flac": return "flac";
		case "audio/mp4":
		case "audio/m4a":
		case "audio/x-m4a": return "m4a";
		case "audio/ogg":
		case "audio/oga":
		case "audio/opus": return "ogg";
		case "audio/webm": return "webm";
		case "audio/aac": return "aac";
		default: return;
	}
}
function resolveFormatFromFileName(fileName) {
	const ext = path.extname(fileName ?? "").trim().toLowerCase().replace(/^\./, "");
	if (!ext) return;
	if (ext === "mpeg") return "mp3";
	if (ext === "mp4") return "m4a";
	if (ext === "oga" || ext === "opus") return "ogg";
	return SUPPORTED_AUDIO_FORMATS.has(ext) ? ext : void 0;
}
function resolveOpenRouterAudioFormat(params) {
	const fromMime = resolveFormatFromMime(params.mime);
	if (fromMime) return fromMime;
	const fromFileName = resolveFormatFromFileName(params.fileName);
	if (fromFileName) return fromFileName;
	throw new Error(`OpenRouter STT could not resolve audio format from mime "${params.mime ?? ""}" and file "${params.fileName ?? ""}"`);
}
async function transcribeOpenRouterAudio(params) {
	const model = params.model?.trim() || DEFAULT_OPENROUTER_AUDIO_TRANSCRIPTION_MODEL;
	const format = resolveOpenRouterAudioFormat({
		mime: params.mime,
		fileName: params.fileName
	});
	const fetchFn = params.fetchFn ?? fetch;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: params.baseUrl,
		defaultBaseUrl: OPENROUTER_BASE_URL,
		headers: params.headers,
		request: params.request,
		defaultHeaders: {
			Authorization: `Bearer ${params.apiKey}`,
			"Content-Type": "application/json",
			"HTTP-Referer": "https://openclaw.ai",
			"X-OpenRouter-Title": "OpenClaw"
		},
		provider: "openrouter",
		api: "openrouter-stt",
		capability: "audio",
		transport: "media-understanding"
	});
	const temperature = asFiniteNumber(params.query?.temperature);
	const { response, release } = await postJsonRequest({
		url: `${baseUrl}/audio/transcriptions`,
		headers,
		body: {
			model,
			input_audio: {
				data: params.buffer.toString("base64"),
				format
			},
			...params.language?.trim() ? { language: params.language.trim() } : {},
			...temperature !== void 0 ? { temperature } : {}
		},
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		fetchFn,
		allowPrivateNetwork,
		dispatcherPolicy,
		auditContext: "openrouter stt"
	});
	try {
		await assertOkOrThrowHttpError(response, "OpenRouter audio transcription failed");
		const payload = await readProviderJsonResponse(response, "openrouter.stt");
		return {
			text: requireTranscriptionText(payload.text, "OpenRouter transcription response missing text"),
			model
		};
	} finally {
		await release();
	}
}
const openrouterMediaUnderstandingProvider = {
	id: "openrouter",
	capabilities: ["image", "audio"],
	defaultModels: {
		image: "auto",
		audio: DEFAULT_OPENROUTER_AUDIO_TRANSCRIPTION_MODEL
	},
	autoPriority: { audio: 35 },
	describeImage: void 0,
	describeImages: void 0,
	transcribeAudio: transcribeOpenRouterAudio
};
//#endregion
export { openrouterMediaUnderstandingProvider as t };
