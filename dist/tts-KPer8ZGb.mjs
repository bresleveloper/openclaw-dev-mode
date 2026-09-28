import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { t as XAI_BASE_URL } from "./model-definitions-DA8Fbxqz.mjs";
import { a as normalizeXaiTtsBaseUrl, i as normalizeXaiLanguageCode, r as isValidXaiTtsVoice } from "./speech-provider-metadata-factory-UbZbU00a.mjs";
import { n as xaiUserAgentHeaderFor } from "./xai-user-agent-BZ2gwPem.mjs";
import { t as WebSocket } from "./ws-runtime-BC0VsR8N.mjs";
import "./speech-provider-metadata-Btx6JtEY.mjs";
//#region extensions/xai/tts.ts
const DEFAULT_TTS_MAX_BYTES = 16777216;
const XAI_TTS_VOICE_LIST_TIMEOUT_MS = 3e4;
const XAI_TTS_VOICE_LIST_MAX_BYTES = 1048576;
const XAI_TTS_STREAM_TEXT_DELTA_MAX_CHARS = 15e3;
async function listXaiTtsVoices(params) {
	const baseUrl = normalizeXaiTtsBaseUrl(params.baseUrl);
	const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("./plugin-sdk/provider-http.js");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedOrigin } = await import("./plugin-sdk/ssrf-runtime.js");
	const { response, release } = await fetchWithSsrFGuard({
		url: `${baseUrl}/tts/voices`,
		init: {
			method: "GET",
			headers: {
				Authorization: `Bearer ${params.apiKey}`,
				...xaiUserAgentHeaderFor(baseUrl)
			}
		},
		timeoutMs: XAI_TTS_VOICE_LIST_TIMEOUT_MS,
		policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(baseUrl),
		auditContext: "xai tts voices"
	});
	try {
		await assertOkOrThrowProviderError(response, "xAI TTS voices API error");
		const payload = await readProviderJsonResponse(response, "xAI TTS voices", { maxBytes: XAI_TTS_VOICE_LIST_MAX_BYTES });
		const voices = asOptionalRecord(payload)?.voices;
		if (!Array.isArray(voices)) throw new Error("xAI TTS voices: malformed JSON response");
		return voices.flatMap((value) => {
			const voice = asOptionalRecord(value);
			const id = normalizeOptionalString(voice?.voice_id);
			if (!id) return [];
			return [{
				id,
				name: normalizeOptionalString(voice?.name),
				locale: normalizeOptionalString(voice?.language),
				gender: normalizeOptionalString(voice?.gender)
			}];
		});
	} finally {
		await release();
	}
}
const XAI_NATIVE_TTS_STREAM_HOST = "api.x.ai";
function toXaiTtsWsUrl(params) {
	assertXaiNativeTtsStreamEndpoint(params.baseUrl);
	const url = new URL(normalizeXaiTtsBaseUrl(params.baseUrl));
	url.protocol = "wss:";
	url.pathname = `${url.pathname.replace(/\/+$/, "")}/tts`;
	url.searchParams.set("language", params.language);
	url.searchParams.set("voice", params.voiceId);
	url.searchParams.set("codec", params.responseFormat);
	if (params.speed != null) url.searchParams.set("speed", String(params.speed));
	return url.toString();
}
function readXaiTtsStreamErrorMessage(event) {
	return normalizeOptionalString(event.message) ?? "xAI TTS stream error";
}
function parseXaiTtsStreamBaseUrl(baseUrl) {
	try {
		return new URL(normalizeXaiTtsBaseUrl(baseUrl));
	} catch {
		throw new Error(`Invalid xAI TTS stream baseUrl: ${baseUrl}`);
	}
}
function assertXaiNativeTtsStreamEndpoint(baseUrl) {
	const url = parseXaiTtsStreamBaseUrl(baseUrl);
	if (url.protocol !== "https:") throw new Error(`xAI streaming TTS only supports HTTPS for the native ${XAI_NATIVE_TTS_STREAM_HOST} endpoint; got protocol "${url.protocol}"`);
	const hostname = url.hostname.toLowerCase();
	if (hostname !== XAI_NATIVE_TTS_STREAM_HOST) throw new Error(`xAI streaming TTS only supports the native ${XAI_NATIVE_TTS_STREAM_HOST} endpoint; got host "${hostname}"`);
	const pathname = url.pathname.replace(/\/+$/, "");
	if (url.username || url.password || url.port || pathname !== "/v1" || url.search || url.hash) throw new Error(`xAI streaming TTS requires the canonical ${XAI_BASE_URL} base URL`);
}
async function xaiTTSStream(params) {
	const { text, apiKey, baseUrl, voiceId, language: rawLanguage, speed, responseFormat = "mp3", timeoutMs, maxBytes = DEFAULT_TTS_MAX_BYTES } = params;
	const language = normalizeXaiLanguageCode(rawLanguage) ?? "en";
	if (!isValidXaiTtsVoice(voiceId)) throw new Error(`Invalid voice: ${voiceId}`);
	assertXaiNativeTtsStreamEndpoint(baseUrl);
	const wsUrl = toXaiTtsWsUrl({
		baseUrl,
		voiceId,
		language,
		responseFormat,
		speed
	});
	const maxPayload = Math.ceil(maxBytes / 3) * 4 + 1024;
	return await new Promise((resolve, reject) => {
		let connectSettled = false;
		let released = false;
		let synthesisTimer;
		let connectTimer;
		let ws;
		let errorStream;
		let closeStream;
		let streamClosed = false;
		const clearTimers = () => {
			if (connectTimer) {
				clearTimeout(connectTimer);
				connectTimer = void 0;
			}
			if (synthesisTimer) {
				clearTimeout(synthesisTimer);
				synthesisTimer = void 0;
			}
		};
		const release = async () => {
			if (released) return;
			released = true;
			clearTimers();
			closeStream?.();
			const socket = ws;
			ws = void 0;
			if (!socket) return;
			if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) socket.close();
			else if (socket.readyState !== WebSocket.CLOSED) socket.terminate();
		};
		const failConnect = (error) => {
			if (connectSettled) return;
			connectSettled = true;
			clearTimers();
			release();
			reject(error);
		};
		const failStream = (error) => {
			if (released || streamClosed) return;
			clearTimers();
			errorStream?.(error);
			release();
		};
		const refreshSynthesisTimer = () => {
			if (synthesisTimer) clearTimeout(synthesisTimer);
			synthesisTimer = setTimeout(() => {
				failStream(/* @__PURE__ */ new Error("xAI TTS stream synthesis timeout"));
			}, timeoutMs);
		};
		try {
			ws = new WebSocket(wsUrl, {
				maxPayload,
				headers: {
					Authorization: `Bearer ${apiKey}`,
					...xaiUserAgentHeaderFor(baseUrl)
				}
			});
		} catch (error) {
			failConnect(toStringifiedError(error));
			return;
		}
		connectTimer = setTimeout(() => {
			failConnect(/* @__PURE__ */ new Error("xAI TTS stream connection timeout"));
		}, timeoutMs);
		ws.once("unexpected-response", (_request, response) => {
			failConnect(/* @__PURE__ */ new Error(`xAI TTS stream connection failed (${response.statusCode ?? "unknown"}): ${response.statusMessage ?? "upgrade rejected"}`));
		});
		ws.once("error", (error) => {
			const normalized = toStringifiedError(error);
			if (connectSettled) {
				failStream(normalized);
				return;
			}
			failConnect(normalized);
		});
		ws.once("close", () => {
			if (connectSettled) return;
			failConnect(/* @__PURE__ */ new Error("xAI TTS stream connection closed before open"));
		});
		ws.once("open", () => {
			if (connectSettled) return;
			connectSettled = true;
			clearTimers();
			refreshSynthesisTimer();
			let totalBytes = 0;
			let enqueue;
			const wiredStream = new ReadableStream({
				start(streamController) {
					enqueue = (chunk) => {
						if (streamClosed) return;
						streamController.enqueue(chunk);
					};
					closeStream = () => {
						if (streamClosed) return;
						streamClosed = true;
						streamController.close();
					};
					errorStream = (error) => {
						if (streamClosed) return;
						streamClosed = true;
						streamController.error(error);
					};
				},
				cancel() {
					streamClosed = true;
					release();
				}
			});
			const handleServerEvent = (event) => {
				switch (event.type) {
					case "audio.delta": {
						const encoded = normalizeOptionalString(event.delta);
						if (!encoded) return;
						const canonicalAudio = canonicalizeBase64(encoded);
						if (!canonicalAudio) {
							failStream(/* @__PURE__ */ new Error("xAI TTS stream returned malformed base64 audio data"));
							return;
						}
						const chunk = Buffer.from(canonicalAudio, "base64");
						totalBytes += chunk.length;
						if (totalBytes > maxBytes) {
							errorStream?.(/* @__PURE__ */ new Error(`xAI TTS audio stream exceeds ${maxBytes} bytes`));
							release();
							return;
						}
						enqueue?.(new Uint8Array(chunk));
						refreshSynthesisTimer();
						return;
					}
					case "audio.done":
						clearTimers();
						closeStream?.();
						release();
						return;
					case "error": failStream(new Error(readXaiTtsStreamErrorMessage(event)));
				}
			};
			ws?.on("message", (data) => {
				if (streamClosed || released) return;
				try {
					const payload = rawDataToString(data);
					handleServerEvent(JSON.parse(payload));
				} catch (error) {
					failStream(toStringifiedError(error));
				}
			});
			ws?.on("close", () => {
				if (streamClosed || released) return;
				failStream(/* @__PURE__ */ new Error("xAI TTS stream closed before audio.done"));
			});
			try {
				for (let offset = 0; offset < text.length;) {
					let end = Math.min(offset + XAI_TTS_STREAM_TEXT_DELTA_MAX_CHARS, text.length);
					if (end < text.length && text.charCodeAt(end - 1) >= 55296 && text.charCodeAt(end - 1) <= 56319 && text.charCodeAt(end) >= 56320 && text.charCodeAt(end) <= 57343) end -= 1;
					ws?.send(JSON.stringify({
						type: "text.delta",
						delta: text.slice(offset, end)
					}));
					offset = end;
				}
				ws?.send(JSON.stringify({ type: "text.done" }));
			} catch (error) {
				failStream(toStringifiedError(error));
			}
			resolve({
				audioStream: wiredStream,
				release
			});
		});
	});
}
async function xaiTTS(params) {
	const { text, apiKey, baseUrl, voiceId, language: rawLanguage, speed, responseFormat = "mp3", timeoutMs, maxBytes = DEFAULT_TTS_MAX_BYTES } = params;
	const language = normalizeXaiLanguageCode(rawLanguage) ?? "en";
	if (!isValidXaiTtsVoice(voiceId)) throw new Error(`Invalid voice: ${voiceId}`);
	const ttsBaseUrl = normalizeXaiTtsBaseUrl(baseUrl);
	const { assertOkOrThrowProviderError, postJsonRequest, readProviderBinaryResponse } = await import("./plugin-sdk/provider-http.js");
	const { ssrfPolicyFromHttpBaseUrlAllowedOrigin } = await import("./plugin-sdk/ssrf-runtime.js");
	const { response, release } = await postJsonRequest({
		url: `${ttsBaseUrl}/tts`,
		headers: new Headers({
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			...xaiUserAgentHeaderFor(ttsBaseUrl)
		}),
		body: {
			text,
			voice_id: voiceId,
			language,
			output_format: { codec: responseFormat },
			...speed != null && { speed }
		},
		timeoutMs,
		fetchFn: fetch,
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(ttsBaseUrl),
		auditContext: "xai tts"
	});
	try {
		await assertOkOrThrowProviderError(response, "xAI TTS API error");
		return await readProviderBinaryResponse(response, "xAI TTS API error", "audio", {
			maxBytes,
			onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`xAI TTS audio response exceeds ${maxBytesLocal} bytes`)
		});
	} finally {
		await release();
	}
}
//#endregion
export { xaiTTS as n, xaiTTSStream as r, listXaiTtsVoices as t };
