import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { g as normalizeXaiRealtimeBaseUrl } from "../../realtime-voice-config-ZrZsQBkX.mjs";
import { m as normalizeXaiRealtimeTranscriptionProviderConfig, u as createXaiRealtimeTranscriptionProviderMetadata } from "../../capability-provider-metadata-factory-Cs1Hgti5.mjs";
import { n as xaiUserAgentHeaderFor } from "../../xai-user-agent-DZopgRsl.mjs";
//#region extensions/xai/realtime-transcription-provider-factory.ts
function readErrorDetail(value) {
	if (typeof value === "string") return value;
	const record = isRecord(value) ? value : void 0;
	const message = normalizeOptionalString(record?.message);
	const code = normalizeOptionalString(record?.code);
	return message ?? code ?? "xAI realtime transcription error";
}
function buildXaiRealtimeTranscriptionProvider(runtime) {
	return {
		...createXaiRealtimeTranscriptionProviderMetadata(runtime),
		createSession: (req) => {
			const config = normalizeXaiRealtimeTranscriptionProviderConfig(req.providerConfig);
			const baseUrl = normalizeXaiRealtimeBaseUrl(config.baseUrl);
			const callbacks = { ...req };
			let lastTranscript;
			let speechStarted = false;
			const emitTranscript = (text) => {
				if (text === lastTranscript) return;
				lastTranscript = text;
				callbacks.onTranscript?.(text);
			};
			return runtime.createRealtimeTranscriptionWebSocketSession({
				providerId: "xai",
				callbacks,
				url: () => {
					const url = new URL(normalizeXaiRealtimeBaseUrl(baseUrl));
					url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
					url.pathname = `${url.pathname.replace(/\/+$/, "")}/stt`;
					url.searchParams.set("sample_rate", String(config.sampleRate ?? 8e3));
					url.searchParams.set("encoding", config.encoding ?? "mulaw");
					url.searchParams.set("interim_results", String(config.interimResults ?? true));
					url.searchParams.set("endpointing", String(config.endpointingMs ?? 800));
					if (config.language) url.searchParams.set("language", config.language);
					return url.toString();
				},
				headers: async () => {
					const apiKey = normalizeOptionalString(config.apiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY) ?? normalizeOptionalString((await runtime.resolveApiKeyForProvider({
						provider: "xai",
						cfg: req.cfg
					}))?.apiKey);
					if (!apiKey) throw new Error("xAI credentials missing for realtime STT. Sign in with `openclaw onboard --auth-choice xai-oauth`, or run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.");
					return {
						Authorization: `Bearer ${apiKey}`,
						...xaiUserAgentHeaderFor(baseUrl)
					};
				},
				connectTimeoutMs: 1e4,
				closeTimeoutMs: 5e3,
				maxReconnectAttempts: 5,
				reconnectDelayMs: 1e3,
				maxQueuedBytes: 2097152,
				connectTimeoutMessage: "xAI realtime transcription connection timeout",
				connectClosedBeforeReadyMessage: "xAI realtime transcription connection closed before ready",
				reconnectLimitMessage: "xAI realtime transcription reconnect limit reached",
				sendAudio: (audio, transport) => {
					transport.sendBinary(audio);
				},
				onClose: (transport) => {
					transport.sendJson({ type: "audio.done" });
				},
				onMessage: (event, transport) => {
					if (event.type === "transcript.created") {
						transport.markReady();
						return;
					}
					if (!transport.isReady() && event.type === "error") {
						transport.failConnect(new Error(readErrorDetail(event.error ?? event.message)));
						return;
					}
					switch (event.type) {
						case "transcript.partial": {
							const text = normalizeOptionalString(event.text ?? event.transcript);
							if (!text) return;
							if (!speechStarted) {
								lastTranscript = void 0;
								speechStarted = true;
								callbacks.onSpeechStart?.();
							}
							if (event.is_final && event.speech_final) {
								emitTranscript(text);
								speechStarted = false;
								return;
							}
							callbacks.onPartial?.(text);
							return;
						}
						case "transcript.done": {
							const text = normalizeOptionalString(event.text ?? event.transcript);
							if (text) emitTranscript(text);
							transport.closeNow();
							return;
						}
						case "error": callbacks.onError?.(new Error(readErrorDetail(event.error ?? event.message)));
					}
				}
			});
		}
	};
}
//#endregion
export { buildXaiRealtimeTranscriptionProvider };
