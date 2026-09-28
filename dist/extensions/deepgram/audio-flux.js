import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-BSb3HetY.mjs";
import { t as _usingCtx } from "../../usingCtx-CoYZqMqE.mjs";
import { t as tempWorkspace } from "../../private-temp-workspace-DQFTMfun.mjs";
import { t as runCommandBuffered } from "../../exec-shcN2-sN.mjs";
import { n as resolveFfmpegBin } from "../../ffmpeg-exec-Dx-p1dpM.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { d as requireTranscriptionText, i as createProviderOperationTimeoutResolver, r as createProviderOperationDeadline } from "../../shared-BLFkM12I.mjs";
import "../../media-ffmpeg-CcZtktSN.mjs";
import "../../process-runtime-BF3dUvYO.mjs";
import "../../temp-path-PENdksor.mjs";
import { n as openProviderWebSocket } from "../../provider-http-Dn9NddwC.mjs";
import { open } from "node:fs/promises";
//#region extensions/deepgram/audio-flux.ts
const DEEPGRAM_FLUX_SAMPLE_RATE = 16e3;
const DEEPGRAM_FLUX_AUDIO_CHUNK_BYTES = 2560;
const DEEPGRAM_FLUX_MAX_MESSAGE_BYTES = 1048576;
const DEEPGRAM_FLUX_MAX_TRANSCRIPT_BYTES = 262144;
const DEEPGRAM_FLUX_QUERY_KEYS = /* @__PURE__ */ new Set([
	"eager_eot_threshold",
	"eot_threshold",
	"eot_timeout_ms",
	"keyterm",
	"language_hint",
	"mip_opt_out",
	"numerals",
	"profanity_filter",
	"redact",
	"tag"
]);
function isDeepgramFluxModel(model) {
	return model?.trim().toLowerCase().startsWith("flux-") ?? false;
}
function buildDeepgramFluxUrl(params) {
	let url;
	try {
		url = new URL(params.baseUrl);
	} catch {
		throw new Error("Invalid Deepgram baseUrl: value is not a valid URL");
	}
	if (url.protocol === "http:") url.protocol = "ws:";
	else if (url.protocol === "https:") url.protocol = "wss:";
	else if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error(`Invalid Deepgram baseUrl: unsupported scheme "${url.protocol}" (expected http, https, ws, or wss)`);
	const basePath = url.pathname.replace(/\/+$/u, "");
	url.pathname = `${basePath ? basePath.replace(/\/v1$/u, "/v2") : "/v2"}/listen`;
	url.search = "";
	url.searchParams.set("model", params.model);
	url.searchParams.set("encoding", "linear16");
	url.searchParams.set("sample_rate", String(DEEPGRAM_FLUX_SAMPLE_RATE));
	const query = { ...params.query };
	query.language_hint = params.model === "flux-general-multi" ? query.language_hint ?? (params.language?.trim() || void 0) : void 0;
	for (const [key, value] of Object.entries(query)) if (value !== void 0 && DEEPGRAM_FLUX_QUERY_KEYS.has(key)) url.searchParams.set(key, String(value));
	return url.toString();
}
function readFluxEvent(data) {
	const bytes = Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data);
	let parsed;
	try {
		parsed = JSON.parse(bytes.toString("utf8"));
	} catch {
		throw new Error("Audio transcription failed: malformed JSON response");
	}
	const event = asOptionalRecord(parsed);
	if (!event) throw new Error("Audio transcription failed: malformed JSON response");
	return event;
}
function readFluxErrorDetail(event) {
	const nested = asOptionalRecord(event.error);
	for (const value of [
		event.description,
		event.message,
		nested?.message
	]) if (typeof value === "string" && value.trim()) return value.trim();
	return "Deepgram Flux transcription error";
}
function sendSocketFrame(socket, data) {
	return new Promise((resolve, reject) => {
		socket.send(data, (error) => error ? reject(error) : resolve());
	});
}
async function decodeDeepgramFluxAudio(params) {
	const result = await runCommandBuffered([
		resolveFfmpegBin(),
		"-hide_banner",
		"-loglevel",
		"error",
		"-i",
		"pipe:0",
		"-vn",
		"-sn",
		"-dn",
		"-c:a",
		"pcm_s16le",
		"-ar",
		String(DEEPGRAM_FLUX_SAMPLE_RATE),
		"-ac",
		"1",
		"-f",
		"s16le",
		params.outputPath
	], {
		input: params.buffer,
		maxOutputBytes: 65536,
		signal: params.signal,
		terminateOnOutputError: true,
		timeoutMs: params.timeoutMs
	});
	if (result.termination === "exit" && result.code === 0) return;
	const detail = result.stderr.toString("utf8").trim();
	throw new Error(`Audio transcription failed: ffmpeg ${result.termination}${detail ? `: ${detail}` : ""}`, { cause: result.error });
}
async function transcribeDeepgramFluxAudio(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const deadline = createProviderOperationDeadline({
			timeoutMs: params.request.timeoutMs,
			label: "Deepgram Flux transcription"
		});
		const resolveTimeoutMs = createProviderOperationTimeoutResolver({
			deadline,
			defaultTimeoutMs: params.request.timeoutMs
		});
		const pcmPath = _usingCtx$1.a(await tempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "audio-transcription-"
		})).path("audio.pcm");
		await decodeDeepgramFluxAudio({
			buffer: params.request.buffer,
			outputPath: pcmPath,
			signal: params.request.signal,
			timeoutMs: resolveTimeoutMs()
		});
		const pcm = _usingCtx$1.a(await open(pcmPath, "r"));
		if ((await pcm.stat()).size === 0) throw new Error("Audio transcription failed: decoded audio is empty");
		const url = buildDeepgramFluxUrl({
			baseUrl: params.requestConfig.baseUrl,
			language: params.request.language,
			model: params.model,
			query: params.request.query
		});
		const timeoutMs = resolveTimeoutMs();
		const socket = await openProviderWebSocket({
			allowPrivateNetwork: params.requestConfig.allowPrivateNetwork,
			baseUrl: params.requestConfig.baseUrl,
			dispatcherPolicy: params.requestConfig.dispatcherPolicy,
			headers: params.requestConfig.headers,
			maxPayloadBytes: DEEPGRAM_FLUX_MAX_MESSAGE_BYTES,
			signal: params.request.signal,
			timeoutMs,
			trustConfiguredBaseUrlOrigin: params.requestConfig.trustConfiguredBaseUrlOrigin,
			url
		});
		const transcript = await new Promise((resolve, reject) => {
			const finalizedTurns = [];
			let finalizedTranscriptBytes = 0;
			let lastPartial = "";
			let settled = false;
			let closeStreamSent = false;
			let timer;
			const settle = (outcome) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);
				timer = void 0;
				if (outcome.error) reject(outcome.error);
				else resolve(outcome.text ?? "");
			};
			socket.on("open", () => {
				(async () => {
					try {
						const frame = Buffer.alloc(DEEPGRAM_FLUX_AUDIO_CHUNK_BYTES);
						for (;;) {
							if (settled) return;
							const { bytesRead } = await pcm.read(frame);
							if (bytesRead === 0 || settled) break;
							await sendSocketFrame(socket, frame.subarray(0, bytesRead));
						}
						if (settled) return;
						await sendSocketFrame(socket, JSON.stringify({ type: "CloseStream" }));
						closeStreamSent = true;
					} catch (error) {
						settle({ error: /* @__PURE__ */ new Error(`Audio transcription failed: ${error instanceof Error ? error.message : String(error)}`) });
					}
				})();
			});
			socket.on("message", (data) => {
				try {
					const event = readFluxEvent(data);
					if (event.type === "Error" || event.type === "error") {
						settle({ error: /* @__PURE__ */ new Error(`Audio transcription failed: ${readFluxErrorDetail(event)}`) });
						return;
					}
					if (event.type !== "TurnInfo" || typeof event.transcript !== "string") return;
					if (event.event === "EndOfTurn") {
						finalizedTranscriptBytes += Buffer.byteLength(event.transcript, "utf8");
						finalizedTurns.push(event.transcript);
						lastPartial = "";
					} else lastPartial = event.transcript;
					if (finalizedTranscriptBytes + Buffer.byteLength(lastPartial, "utf8") > DEEPGRAM_FLUX_MAX_TRANSCRIPT_BYTES) settle({ error: /* @__PURE__ */ new Error("Audio transcription failed: transcript exceeds size limit") });
				} catch (error) {
					settle({ error: error instanceof Error ? error : new Error(String(error)) });
				}
			});
			socket.on("error", (error) => {
				settle({ error: /* @__PURE__ */ new Error(`Audio transcription failed: ${error.message}`) });
			});
			socket.on("close", (code, reason) => {
				if (!closeStreamSent) {
					settle({ error: /* @__PURE__ */ new Error("Audio transcription failed: Flux closed before flush") });
					return;
				}
				if (code !== 1e3 && code !== 1005) {
					const detail = reason.toString().trim();
					settle({ error: /* @__PURE__ */ new Error(`Audio transcription failed: Flux closed abnormally (code ${code}${detail ? `: ${detail}` : ""})`) });
					return;
				}
				settle({ text: [...finalizedTurns, lastPartial].map((part) => part.trim()).filter(Boolean).join(" ") });
			});
			timer = setTimeout(() => settle({ error: /* @__PURE__ */ new Error("Deepgram Flux transcription timed out") }), resolveTimeoutMs());
		}).finally(() => socket.terminate());
		return {
			text: requireTranscriptionText(transcript || void 0, "Audio transcription response missing transcript"),
			model: params.model
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { isDeepgramFluxModel, transcribeDeepgramFluxAudio };
