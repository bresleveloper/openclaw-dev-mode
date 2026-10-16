import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { n as assertOkOrThrowHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { _ as resolveProviderOperationTimeoutMs, d as postJsonRequest, r as createProviderOperationDeadline } from "./shared-DcnGQdHV.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-BmVs5Dky.mjs";
import "./media-runtime-BeXWK4uL.mjs";
import "./media-generation-runtime-D1HcnVCx.mjs";
import "./time-runtime-Bfsc2GHI.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { u as toImageDataUrl } from "./image-assets-DT0442If.mjs";
import "./image-generation-OBYa9Syc.mjs";
import "./provider-auth-C3BBF7yn.mjs";
import { t as resolveOpenRouterGenerationRequestContext } from "./generation-request-context-BeJZpqVc.mjs";
//#region extensions/openrouter/music-generation-provider.ts
const DEFAULT_OPENROUTER_MUSIC_MODEL = "google/lyria-3-pro-preview";
const OPENROUTER_CLIP_MUSIC_MODEL = "google/lyria-3-clip-preview";
const DEFAULT_TIMEOUT_MS = 18e4;
const OPENROUTER_SSE_ENVELOPE_OVERHEAD_BYTES = 65536;
const OPENROUTER_MUSIC_MODELS = [DEFAULT_OPENROUTER_MUSIC_MODEL, OPENROUTER_CLIP_MUSIC_MODEL];
function imageToContentPart(image) {
	const url = normalizeOptionalString(image.url) ?? (image.buffer ? toImageDataUrl({
		...image,
		buffer: image.buffer,
		defaultMimeType: "image/png"
	}) : void 0);
	if (!url) throw new Error("OpenRouter music generation reference image is missing data.");
	return {
		type: "image_url",
		image_url: { url }
	};
}
function buildOpenRouterMusicPrompt(req) {
	const parts = [req.prompt.trim()];
	const lyrics = normalizeOptionalString(req.lyrics);
	if (req.instrumental === true) parts.push("Instrumental only. No vocals, no sung lyrics, no spoken word.");
	if (lyrics) parts.push(`Lyrics:\n${lyrics}`);
	if (typeof req.durationSeconds === "number") parts.push(`Target duration: about ${Math.round(req.durationSeconds)} seconds.`);
	return parts.join("\n\n");
}
function buildOpenRouterMessageContent(req) {
	const prompt = buildOpenRouterMusicPrompt(req);
	const images = req.inputImages ?? [];
	if (images.length === 0) return prompt;
	return [{
		type: "text",
		text: prompt
	}, ...images.map(imageToContentPart)];
}
function readDeltaAudio(part) {
	const choices = asOptionalRecord(part)?.choices;
	const first = Array.isArray(choices) ? asOptionalRecord(choices[0]) : void 0;
	const audio = asOptionalRecord(asOptionalRecord(first?.delta)?.audio);
	if (!audio) return;
	return {
		data: normalizeOptionalString(audio.data),
		transcript: typeof audio.transcript === "string" ? audio.transcript : void 0
	};
}
function resolveOpenRouterSseEventMaxBytes(maxBytes) {
	return Math.ceil(maxBytes / 3) * 4 + maxBytes + OPENROUTER_SSE_ENVELOPE_OVERHEAD_BYTES;
}
function createOpenRouterMusicTooLargeError(kind, maxBytes) {
	return /* @__PURE__ */ new Error(`OpenRouter music generation ${kind} exceeded ${maxBytes} bytes`);
}
function appendDecodedOpenRouterMusicAudio(result, base64) {
	if (!base64) return;
	const remainingBytes = result.maxBytes - result.audioBytes;
	if (estimateBase64DecodedBytes(base64) > remainingBytes) throw createOpenRouterMusicTooLargeError("audio", result.maxBytes);
	const canonicalAudio = canonicalizeBase64(base64);
	if (!canonicalAudio) throw new Error("OpenRouter music generation returned malformed base64 audio data");
	if (Buffer.byteLength(canonicalAudio, "base64") > remainingBytes) throw createOpenRouterMusicTooLargeError("audio", result.maxBytes);
	const buffer = Buffer.from(canonicalAudio, "base64");
	result.audioBytes += buffer.byteLength;
	result.audioBuffers.push(buffer);
}
function appendOpenRouterMusicAudio(result, data) {
	const combined = result.audioBase64Remainder + data;
	const completeLength = combined.length - combined.length % 4;
	result.audioBase64Remainder = combined.slice(completeLength);
	appendDecodedOpenRouterMusicAudio(result, combined.slice(0, completeLength));
}
function flushOpenRouterMusicAudio(result) {
	appendDecodedOpenRouterMusicAudio(result, result.audioBase64Remainder);
	result.audioBase64Remainder = "";
}
function appendOpenRouterMusicTranscript(result, transcript) {
	const nextBytes = result.transcriptBytes + Buffer.byteLength(transcript, "utf8");
	if (nextBytes > result.maxBytes) throw createOpenRouterMusicTooLargeError("transcript", result.maxBytes);
	result.transcriptBytes = nextBytes;
	result.transcriptChunks.push(transcript);
}
function readOpenRouterStreamError(part) {
	if (!isRecord(part) || !isRecord(part.error)) return;
	return normalizeOptionalString(part.error.message) ?? "unknown provider stream error";
}
function processOpenRouterSseLine(line, result) {
	if (!line.startsWith("data:")) return false;
	const data = line.slice(5).trim();
	if (!data) return false;
	if (data === "[DONE]") return true;
	const payload = JSON.parse(data);
	const streamError = readOpenRouterStreamError(payload);
	if (streamError) throw new Error(`OpenRouter music generation failed: ${streamError}`);
	const audio = readDeltaAudio(payload);
	if (audio?.data) appendOpenRouterMusicAudio(result, audio.data);
	if (audio?.transcript) appendOpenRouterMusicTranscript(result, audio.transcript);
	return false;
}
function resolveOpenRouterStreamRemainingMs(deadline) {
	return resolveProviderOperationTimeoutMs({
		deadline,
		defaultTimeoutMs: deadline.timeoutMs ?? DEFAULT_TIMEOUT_MS
	});
}
async function readOpenRouterStreamChunk(reader, deadline) {
	const timeoutMs = resolveOpenRouterStreamRemainingMs(deadline);
	return await withTimeout(reader.read(), timeoutMs, { createError: () => /* @__PURE__ */ new Error(`${deadline.label} timed out after ${deadline.timeoutMs}ms`) });
}
async function readOpenRouterAudioStream(response, deadline, maxBytes) {
	if (!response.body) throw new Error("OpenRouter music generation response missing stream body");
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	const result = {
		audioBuffers: [],
		audioBytes: 0,
		audioBase64Remainder: "",
		transcriptChunks: [],
		transcriptBytes: 0,
		maxBytes
	};
	const maxEventBytes = resolveOpenRouterSseEventMaxBytes(maxBytes);
	const lineFragments = [];
	let pendingBytes = 0;
	try {
		for (;;) {
			const { value, done } = await readOpenRouterStreamChunk(reader, deadline);
			if (done) break;
			for (const byte of value) {
				pendingBytes = byte === 10 ? 0 : pendingBytes + 1;
				if (pendingBytes > maxEventBytes) throw new Error(`OpenRouter music generation SSE event exceeded ${maxEventBytes} bytes for a ${maxBytes}-byte media limit`);
			}
			const chunk = decoder.decode(value, { stream: true });
			let start = 0;
			for (let end = chunk.indexOf("\n"); end !== -1; end = chunk.indexOf("\n", start)) {
				let line = chunk.slice(start, end);
				start = end + 1;
				if (lineFragments.length > 0) {
					lineFragments.push(line);
					line = lineFragments.join("");
					lineFragments.length = 0;
				}
				if (processOpenRouterSseLine(line.trim(), result)) {
					flushOpenRouterMusicAudio(result);
					return {
						audioBuffer: Buffer.concat(result.audioBuffers, result.audioBytes),
						transcript: result.transcriptChunks.join("")
					};
				}
			}
			if (start < chunk.length) lineFragments.push(chunk.slice(start));
		}
		resolveOpenRouterStreamRemainingMs(deadline);
		lineFragments.push(decoder.decode());
		const buffer = lineFragments.join("");
		pendingBytes = Buffer.byteLength(buffer, "utf8");
		if (pendingBytes > maxEventBytes) throw new Error(`OpenRouter music generation SSE event exceeded ${maxEventBytes} bytes for a ${maxBytes}-byte media limit`);
		if (!processOpenRouterSseLine(buffer.trim(), result)) throw new Error("OpenRouter music generation stream ended before completion");
		flushOpenRouterMusicAudio(result);
		return {
			audioBuffer: Buffer.concat(result.audioBuffers, result.audioBytes),
			transcript: result.transcriptChunks.join("")
		};
	} finally {
		reader.cancel().catch(() => {});
		try {
			reader.releaseLock();
		} catch {}
	}
}
function buildOpenRouterMusicGenerationProvider() {
	return {
		id: "openrouter",
		label: "OpenRouter",
		defaultModel: DEFAULT_OPENROUTER_MUSIC_MODEL,
		models: [...OPENROUTER_MUSIC_MODELS],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "openrouter",
			...ctx
		}),
		capabilities: {
			generate: {
				maxTracks: 1,
				maxDurationSeconds: 180,
				supportsLyrics: true,
				supportsInstrumental: true,
				supportsDuration: true,
				supportsFormat: true,
				supportedFormats: ["mp3", "wav"]
			},
			edit: {
				enabled: true,
				maxTracks: 1,
				maxInputImages: 1,
				maxDurationSeconds: 180,
				supportsLyrics: true,
				supportsInstrumental: true,
				supportsDuration: true,
				supportsFormat: true,
				supportedFormats: ["mp3", "wav"]
			}
		},
		async generateMusic(req) {
			if ((req.inputImages?.length ?? 0) > 1) throw new Error("OpenRouter music generation supports at most one reference image.");
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = await resolveOpenRouterGenerationRequestContext({
				cfg: req.cfg,
				agentDir: req.agentDir,
				authStore: req.authStore,
				capability: "audio",
				jsonContentType: true
			});
			const model = normalizeOptionalString(req.model) ?? DEFAULT_OPENROUTER_MUSIC_MODEL;
			const format = req.format ?? "wav";
			const requestedTimeoutMs = resolvePositiveTimerTimeoutMs(req.timeoutMs, DEFAULT_TIMEOUT_MS);
			const streamDeadline = createProviderOperationDeadline({
				timeoutMs: requestedTimeoutMs,
				label: "OpenRouter music generation"
			});
			const timeoutMs = resolveOpenRouterStreamRemainingMs(streamDeadline);
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/chat/completions`,
				headers,
				body: {
					model,
					messages: [{
						role: "user",
						content: buildOpenRouterMessageContent(req)
					}],
					modalities: ["text", "audio"],
					audio: { format },
					stream: true
				},
				timeoutMs,
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "OpenRouter music generation failed");
				const streamResult = await readOpenRouterAudioStream(response, streamDeadline, resolveGeneratedMediaMaxBytes(req.cfg, "audio"));
				if (streamResult.audioBuffer.byteLength === 0) throw new Error("OpenRouter music generation response missing audio data");
				return {
					tracks: [{
						buffer: streamResult.audioBuffer,
						mimeType: format === "mp3" ? "audio/mpeg" : "audio/wav",
						fileName: `track-1.${format}`
					}],
					model,
					...streamResult.transcript ? { lyrics: [streamResult.transcript] } : {},
					metadata: {
						inputImageCount: req.inputImages?.length ?? 0,
						instrumental: req.instrumental === true,
						requestedFormat: format
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildOpenRouterMusicGenerationProvider as t };
