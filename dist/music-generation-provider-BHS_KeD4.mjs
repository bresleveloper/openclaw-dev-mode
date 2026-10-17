import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as readResponseWithLimit } from "./http-response-body-umfRGZ-E.mjs";
import { n as assertOkOrThrowHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-By9R9pyt.mjs";
import { r as extensionForMime } from "./mime-CGDYrRzL.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { _ as resolveProviderOperationTimeoutMs, d as postJsonRequest, h as resolveProviderHttpRequestConfig, i as createProviderOperationTimeoutError, r as createProviderOperationDeadline } from "./shared-DcnGQdHV.mjs";
import "./response-limit-runtime-CpfmMF5T.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-Xx9etrds.mjs";
import "./media-mime-DLFR6fqC.mjs";
import "./media-generation-runtime-DVf13dFr.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-B-PBEJIo.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { t as downloadGeneratedMusicAsset } from "./music-generation-D-5knzUP.mjs";
import "./provider-auth-BGYKg9mW.mjs";
import { a as resolveMinimaxMediaBaseUrl, i as normalizeMinimaxHexAudio, n as assertMinimaxBaseResp, r as fetchMinimaxResponse, t as DEFAULT_MINIMAX_MEDIA_BASE_URL } from "./media-provider-runtime-3IuGITmK.mjs";
//#region extensions/minimax/music-generation-provider.ts
const DEFAULT_MINIMAX_MUSIC_MODEL = "music-2.6";
const DEFAULT_TIMEOUT_MS = 12e4;
const DEFAULT_OPERATION_TIMEOUT_MS = 3e5;
const STREAM_ENVELOPE_MAX_BYTES_MULTIPLIER = 5;
const STREAM_ENVELOPE_OVERHEAD_BYTES = 65536;
function decodeHexAudioWithLimit(data, maxBytes) {
	const trimmed = normalizeMinimaxHexAudio(data, "MiniMax music generation");
	if (trimmed.length / 2 > maxBytes) throw createGeneratedMusicTooLargeError(maxBytes);
	return Buffer.from(trimmed, "hex");
}
function decodePossibleText(data) {
	const trimmed = data.trim();
	if (!trimmed) return "";
	if (/^[0-9a-f]+$/iu.test(trimmed) && trimmed.length % 2 === 0) return Buffer.from(trimmed, "hex").toString("utf8").trim();
	return trimmed;
}
function isLikelyRemoteUrl(value) {
	const trimmed = normalizeOptionalString(value);
	return Boolean(trimmed && /^https?:\/\//iu.test(trimmed));
}
async function downloadTrackFromUrl(params) {
	return await downloadGeneratedMusicAsset({
		candidate: { url: params.url },
		timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		provider: "MiniMax",
		requestFailedMessage: "MiniMax generated music download failed",
		maxBytes: params.maxBytes,
		validateBinaryResponse: true,
		includeSourceUrl: false,
		fetchResponse: async ({ timeoutMs }) => {
			const result = await fetchMinimaxResponse({
				stage: "download",
				url: params.url,
				init: { method: "GET" },
				timeoutMs,
				fetchFn: params.fetchFn,
				requestFailedMessage: "MiniMax generated music download failed",
				policy: params.policy
			});
			return {
				...result,
				mimeType: normalizeOptionalString(result.response.headers.get("content-type")) ?? "audio/mpeg"
			};
		}
	});
}
function resolveBodyReadTimeoutMs(deadline) {
	return resolveProviderOperationTimeoutMs({
		deadline,
		defaultTimeoutMs: deadline.timeoutMs ?? DEFAULT_OPERATION_TIMEOUT_MS
	});
}
function createGeneratedMusicTooLargeError(maxBytes) {
	return /* @__PURE__ */ new Error(`MiniMax generated music download exceeds ${maxBytes} bytes`);
}
function resolveStreamEnvelopeMaxBytes(maxBytes) {
	return Math.max(STREAM_ENVELOPE_OVERHEAD_BYTES, maxBytes * STREAM_ENVELOPE_MAX_BYTES_MULTIPLIER + STREAM_ENVELOPE_OVERHEAD_BYTES);
}
async function readResponseBufferWithDeadline(response, deadline, maxBytes) {
	return await readResponseWithLimit(response, maxBytes, {
		timeoutMs: () => resolveBodyReadTimeoutMs(deadline),
		onTimeout: () => createProviderOperationTimeoutError(deadline),
		onOverflow: ({ maxBytes: limit }) => createGeneratedMusicTooLargeError(limit)
	});
}
async function readStreamingTrack(response, deadline, maxBytes) {
	const contentType = normalizeOptionalString(response.headers.get("content-type")) ?? "";
	if (contentType.toLowerCase().startsWith("audio/")) {
		const ext = extensionForMime(contentType)?.replace(/^\./u, "") || "mp3";
		return {
			buffer: await readResponseBufferWithDeadline(response, deadline, maxBytes),
			mimeType: contentType,
			fileName: `track-1.${ext}`
		};
	}
	const chunks = [];
	let decodedBytes = 0;
	let completed = false;
	const text = new TextDecoder().decode(await readResponseBufferWithDeadline(response, deadline, resolveStreamEnvelopeMaxBytes(maxBytes)));
	for (const rawLine of text.split(/\r?\n/u)) {
		const line = rawLine.trim();
		if (!line.startsWith("data:")) continue;
		const json = line.slice(5).trim();
		if (!json || json === "[DONE]") continue;
		const frame = JSON.parse(json);
		assertMinimaxBaseResp(frame.base_resp, "MiniMax music generation failed");
		if (String(frame.data?.status ?? "") === "2") {
			completed = true;
			if (chunks.length > 0) continue;
		}
		const audio = normalizeOptionalString(frame.data?.audio);
		if (audio) {
			const chunk = decodeHexAudioWithLimit(audio, maxBytes - decodedBytes);
			chunks.push(chunk);
			decodedBytes += chunk.byteLength;
		}
	}
	if (!completed) throw new Error("MiniMax music generation stream ended without completion");
	const buffer = Buffer.concat(chunks);
	if (buffer.byteLength === 0) throw new Error("MiniMax music generation response missing audio output");
	return {
		buffer,
		mimeType: "audio/mpeg",
		fileName: "track-1.mp3"
	};
}
function buildMinimaxMusicProvider(providerId) {
	return {
		id: providerId,
		label: "MiniMax",
		defaultModel: DEFAULT_MINIMAX_MUSIC_MODEL,
		models: [
			DEFAULT_MINIMAX_MUSIC_MODEL,
			"music-2.6-free",
			"music-cover",
			"music-cover-free"
		],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: providerId,
			...ctx
		}),
		capabilities: {
			generate: {
				maxTracks: 1,
				supportsLyrics: true,
				supportsInstrumental: true,
				supportsFormat: true,
				supportedFormats: ["mp3"]
			},
			edit: { enabled: false }
		},
		async generateMusic(req) {
			if ((req.inputImages?.length ?? 0) > 0) throw new Error("MiniMax music generation does not support image reference inputs.");
			if (req.instrumental === true && normalizeOptionalString(req.lyrics)) throw new Error("MiniMax music generation cannot use lyrics when instrumental=true.");
			if (req.format && req.format !== "mp3") throw new Error("MiniMax music generation currently supports mp3 output only.");
			const auth = await resolveApiKeyForProvider({
				provider: providerId,
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("MiniMax API key missing");
			const fetchFn = fetch;
			const operationTimeoutMs = req.timeoutMs ?? DEFAULT_OPERATION_TIMEOUT_MS;
			const deadline = createProviderOperationDeadline({
				timeoutMs: operationTimeoutMs,
				label: "MiniMax music generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveMinimaxMediaBaseUrl(req.cfg, providerId),
				defaultBaseUrl: DEFAULT_MINIMAX_MEDIA_BASE_URL,
				defaultHeaders: { Authorization: `Bearer ${auth.apiKey}` },
				provider: providerId,
				capability: "audio",
				transport: "http",
				request: sanitizeConfiguredModelProviderRequest(req.cfg.models?.providers?.[providerId]?.request)
			});
			const requestPolicy = {
				allowPrivateNetwork,
				dispatcherPolicy
			};
			const jsonHeaders = new Headers(headers);
			jsonHeaders.set("Content-Type", "application/json");
			const model = normalizeOptionalString(req.model) ?? DEFAULT_MINIMAX_MUSIC_MODEL;
			const requestedLyrics = normalizeOptionalString(req.lyrics);
			const body = {
				model,
				prompt: req.prompt.trim(),
				...req.instrumental === true ? { is_instrumental: true } : {},
				...requestedLyrics ? { lyrics: requestedLyrics } : req.instrumental === true ? {} : { lyrics_optimizer: true },
				stream: true,
				output_format: "hex",
				audio_setting: {
					sample_rate: 44100,
					bitrate: 256e3,
					format: "mp3"
				}
			};
			const { response: res, release } = await postJsonRequest({
				url: `${baseUrl}/v1/music_generation`,
				headers: jsonHeaders,
				body,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: operationTimeoutMs
				}),
				fetchFn,
				pinDns: false,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(res, "MiniMax music generation failed");
				const lowerContentType = (normalizeOptionalString(res.headers.get("content-type")) ?? "").toLowerCase();
				const maxGeneratedMusicBytes = resolveGeneratedMediaMaxBytes(req.cfg, "audio");
				const payload = lowerContentType.includes("text/event-stream") || lowerContentType.startsWith("audio/") ? null : JSON.parse(new TextDecoder().decode(await readResponseBufferWithDeadline(res.clone(), deadline, resolveStreamEnvelopeMaxBytes(maxGeneratedMusicBytes))));
				if (payload) assertMinimaxBaseResp(payload.base_resp, "MiniMax music generation failed");
				const audioCandidate = normalizeOptionalString(payload?.audio) ?? normalizeOptionalString(payload?.data?.audio);
				const audioUrl = normalizeOptionalString(payload?.audio_url) || normalizeOptionalString(payload?.data?.audio_url) || (isLikelyRemoteUrl(audioCandidate) ? audioCandidate : void 0);
				const inlineAudio = isLikelyRemoteUrl(audioCandidate) ? void 0 : audioCandidate;
				const responseLyrics = decodePossibleText(payload?.lyrics ?? payload?.data?.lyrics ?? "");
				return {
					tracks: [audioUrl ? await downloadTrackFromUrl({
						url: audioUrl,
						timeoutMs: resolveProviderOperationTimeoutMs({
							deadline,
							defaultTimeoutMs: req.timeoutMs ?? DEFAULT_TIMEOUT_MS
						}),
						fetchFn,
						maxBytes: maxGeneratedMusicBytes,
						policy: requestPolicy
					}) : inlineAudio ? {
						buffer: decodeHexAudioWithLimit(inlineAudio, maxGeneratedMusicBytes),
						mimeType: "audio/mpeg",
						fileName: "track-1.mp3"
					} : await readStreamingTrack(res, deadline, maxGeneratedMusicBytes)],
					...responseLyrics ? { lyrics: [responseLyrics] } : {},
					model,
					metadata: {
						...normalizeOptionalString(payload?.task_id) ? { taskId: normalizeOptionalString(payload?.task_id) } : {},
						...audioUrl ? { audioUrl } : {},
						instrumental: req.instrumental === true,
						...requestedLyrics ? { requestedLyrics: true } : {}
					}
				};
			} finally {
				await release();
			}
		}
	};
}
function buildMinimaxMusicGenerationProvider() {
	return buildMinimaxMusicProvider("minimax");
}
function buildMinimaxPortalMusicGenerationProvider() {
	return buildMinimaxMusicProvider("minimax-portal");
}
//#endregion
export { buildMinimaxPortalMusicGenerationProvider as n, buildMinimaxMusicGenerationProvider as t };
