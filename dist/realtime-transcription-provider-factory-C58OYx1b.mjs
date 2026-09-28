import { c as asFiniteNumberInRange, f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { a as resolveOpenAIProviderConfigRecord, i as readRealtimeErrorDetail, r as createOpenAIRealtimeTranscriptionClientSecret } from "./realtime-provider-shared-CvSijJ_n.mjs";
//#region extensions/openai/realtime-transcription-provider-factory.ts
const OPENAI_REALTIME_TRANSCRIPTION_URL = "wss://api.openai.com/v1/realtime?intent=transcription";
const OPENAI_REALTIME_TRANSCRIPTION_CONNECT_TIMEOUT_MS = 1e4;
const OPENAI_REALTIME_TRANSCRIPTION_MAX_RECONNECT_ATTEMPTS = 5;
const OPENAI_REALTIME_TRANSCRIPTION_RECONNECT_DELAY_MS = 1e3;
const OPENAI_REALTIME_TRANSCRIPTION_AUDIO_BYTES_PER_MS = 8;
const OPENAI_REALTIME_TRANSCRIPTION_DEFAULT_MODEL = "gpt-4o-transcribe";
const OPENAI_REALTIME_TRANSCRIPTION_MAX_UNRESOLVED_ITEMS = 64;
const OPENAI_REALTIME_TRANSCRIPTION_MAX_ITEM_ID_BYTES = 1024;
const OPENAI_REALTIME_TRANSCRIPTION_MAX_RETAINED_TRANSCRIPT_BYTES = 262144;
const OPENAI_REALTIME_TRANSCRIPTION_MAX_SETTLED_ITEMS = 4096;
const OPENAI_REALTIME_TRANSCRIPTION_MAX_SETTLED_ID_BYTES = 262144;
const OPENAI_REALTIME_TRANSCRIPTION_ITEM_OVERFLOW_MESSAGE = "OpenAI realtime transcription exceeded the 64 unresolved item limit";
const OPENAI_REALTIME_TRANSCRIPTION_IDENTITY_OVERFLOW_MESSAGE = "OpenAI realtime transcription exceeded the 1024-byte item identity limit";
const OPENAI_REALTIME_TRANSCRIPTION_TEXT_OVERFLOW_MESSAGE = "OpenAI realtime transcription exceeded the 256 KiB retained transcript limit";
const OPENAI_REALTIME_TRANSCRIPTION_SETTLED_OVERFLOW_MESSAGE = "OpenAI realtime transcription exceeded the terminal item history limit";
const OPENAI_REALTIME_TRANSCRIPTION_API_KEY_REQUIRED = "OpenAI Realtime transcription requires an OpenAI Platform API key";
const OPENAI_REALTIME_TRANSCRIPTION_API_KEY_REJECTED = "OpenAI Realtime transcription rejected the selected API key. Update or remove the active OpenAI API-key source";
function appendedUtf8ByteLength(previous, appended) {
	const appendedBytes = Buffer.byteLength(appended, "utf8");
	if (!previous || !appended) return appendedBytes;
	const previousCodeUnit = previous.charCodeAt(previous.length - 1);
	const appendedCodeUnit = appended.charCodeAt(0);
	return previousCodeUnit >= 55296 && previousCodeUnit <= 56319 && appendedCodeUnit >= 56320 && appendedCodeUnit <= 57343 ? appendedBytes - 2 : appendedBytes;
}
function normalizeProviderConfig(config) {
	const raw = resolveOpenAIProviderConfigRecord(config);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "plugins.entries.voice-call.config.streaming.providers.openai.apiKey"
		}) ?? normalizeResolvedSecretInputString({
			value: raw?.openaiApiKey,
			path: "plugins.entries.voice-call.config.streaming.openaiApiKey"
		}),
		language: normalizeOptionalString(raw?.language),
		model: normalizeOptionalString(raw?.model) ?? normalizeOptionalString(raw?.sttModel),
		prompt: normalizeOptionalString(raw?.prompt),
		silenceDurationMs: asSafeIntegerInRange(raw?.silenceDurationMs, { min: 0 }),
		vadThreshold: normalizeVadThreshold(raw?.vadThreshold)
	};
}
function normalizeVadThreshold(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		max: 1
	});
}
function buildOpenAIRealtimeTranscriptionSessionPayload(config) {
	return {
		type: "transcription",
		audio: { input: {
			format: { type: "audio/pcmu" },
			transcription: {
				model: config.model,
				...config.language ? { language: config.language } : {},
				...config.prompt ? { prompt: config.prompt } : {}
			},
			turn_detection: {
				type: "server_vad",
				threshold: config.vadThreshold,
				prefix_padding_ms: 300,
				silence_duration_ms: config.silenceDurationMs
			}
		} }
	};
}
async function resolveOpenAIRealtimeTranscriptionAuthorization(config, runtime) {
	if (config.apiKey) return config.apiKey;
	const authToken = await runtime.resolveProviderAuthProfileApiKey({
		provider: "openai",
		cfg: config.cfg,
		profileTypes: ["api_key"]
	});
	if (authToken) return (await createOpenAIRealtimeTranscriptionClientSecret({
		authToken,
		auditContext: "openai-realtime-transcription-session",
		session: buildOpenAIRealtimeTranscriptionSessionPayload(config),
		authRejectedMessage: OPENAI_REALTIME_TRANSCRIPTION_API_KEY_REJECTED
	}, runtime)).value;
	const envApiKey = process.env.OPENAI_API_KEY?.trim();
	if (envApiKey) return envApiKey;
	throw new Error(OPENAI_REALTIME_TRANSCRIPTION_API_KEY_REQUIRED);
}
function createOpenAIRealtimeTranscriptionSession(config, runtime) {
	const pendingTranscripts = /* @__PURE__ */ new Map();
	const committedItemIds = [];
	const committedItems = /* @__PURE__ */ new Map();
	const completedTranscripts = /* @__PURE__ */ new Map();
	const trackedItemIds = /* @__PURE__ */ new Set();
	const settledItemIds = /* @__PURE__ */ new Set();
	const unkeyedTranscript = "__openclaw_unkeyed_transcript__";
	let retainedTranscriptBytes = 0;
	let settledItemIdBytes = 0;
	let appendedAudioBytes = 0;
	let committedAudioBytes = 0;
	let lastVadBoundary;
	const resetTranscriptionState = () => {
		pendingTranscripts.clear();
		committedItemIds.length = 0;
		committedItems.clear();
		completedTranscripts.clear();
		trackedItemIds.clear();
		settledItemIds.clear();
		retainedTranscriptBytes = 0;
		settledItemIdBytes = 0;
		appendedAudioBytes = 0;
		committedAudioBytes = 0;
		lastVadBoundary = void 0;
	};
	const failTerminal = (error, transport) => {
		resetTranscriptionState();
		transport.closeNow();
		try {
			config.onError?.(error);
		} catch {}
	};
	const trackItem = (itemId, transport) => {
		if (settledItemIds.has(itemId) || completedTranscripts.has(itemId)) return false;
		if (trackedItemIds.has(itemId)) return true;
		if (trackedItemIds.size >= OPENAI_REALTIME_TRANSCRIPTION_MAX_UNRESOLVED_ITEMS) {
			failTerminal(/* @__PURE__ */ new Error(OPENAI_REALTIME_TRANSCRIPTION_ITEM_OVERFLOW_MESSAGE), transport);
			return false;
		}
		if (Buffer.byteLength(itemId, "utf8") > OPENAI_REALTIME_TRANSCRIPTION_MAX_ITEM_ID_BYTES) {
			failTerminal(/* @__PURE__ */ new Error(OPENAI_REALTIME_TRANSCRIPTION_IDENTITY_OVERFLOW_MESSAGE), transport);
			return false;
		}
		trackedItemIds.add(itemId);
		return true;
	};
	const settleItem = (itemId, transport) => {
		const itemIdBytes = Buffer.byteLength(itemId, "utf8");
		if (settledItemIds.size >= OPENAI_REALTIME_TRANSCRIPTION_MAX_SETTLED_ITEMS || itemIdBytes > OPENAI_REALTIME_TRANSCRIPTION_MAX_SETTLED_ID_BYTES - settledItemIdBytes) {
			failTerminal(/* @__PURE__ */ new Error(OPENAI_REALTIME_TRANSCRIPTION_SETTLED_OVERFLOW_MESSAGE), transport);
			return false;
		}
		trackedItemIds.delete(itemId);
		for (const [candidateId, previousItemId] of committedItems) if (previousItemId === itemId) committedItems.set(candidateId, null);
		settledItemIds.add(itemId);
		settledItemIdBytes += itemIdBytes;
		return true;
	};
	const commitItem = (itemId, previousItemId, transport) => {
		if (settledItemIds.has(itemId) || committedItems.has(itemId) || !trackItem(itemId, transport)) return;
		if (previousItemId && Buffer.byteLength(previousItemId, "utf8") > OPENAI_REALTIME_TRANSCRIPTION_MAX_ITEM_ID_BYTES) {
			failTerminal(/* @__PURE__ */ new Error(OPENAI_REALTIME_TRANSCRIPTION_IDENTITY_OVERFLOW_MESSAGE), transport);
			return;
		}
		committedItems.set(itemId, previousItemId && settledItemIds.has(previousItemId) ? null : previousItemId);
		committedItemIds.push(itemId);
		const arrivalOrder = committedItemIds.splice(0);
		const successors = /* @__PURE__ */ new Map();
		for (const candidateId of arrivalOrder) {
			const previousId = committedItems.get(candidateId);
			if (previousId) successors.set(previousId, candidateId);
		}
		const seen = /* @__PURE__ */ new Set();
		const appendChain = (startId) => {
			let candidateId = startId;
			while (candidateId && !seen.has(candidateId)) {
				seen.add(candidateId);
				committedItemIds.push(candidateId);
				candidateId = successors.get(candidateId);
			}
		};
		for (const candidateId of arrivalOrder) {
			const previousId = committedItems.get(candidateId);
			if (previousId == null || settledItemIds.has(previousId)) appendChain(candidateId);
		}
		for (const candidateId of arrivalOrder) appendChain(candidateId);
	};
	const flushCompletedTranscripts = (transport) => {
		while (committedItemIds.length > 0) {
			const itemId = committedItemIds[0];
			if (!itemId || !completedTranscripts.has(itemId)) return true;
			const previousItemId = committedItems.get(itemId);
			if (previousItemId && !settledItemIds.has(previousItemId) && !committedItems.has(previousItemId)) return true;
			committedItemIds.shift();
			committedItems.delete(itemId);
			if (!settleItem(itemId, transport)) return false;
			const transcript = completedTranscripts.get(itemId);
			completedTranscripts.delete(itemId);
			if (transcript) retainedTranscriptBytes -= Buffer.byteLength(transcript, "utf8");
			if (transcript) config.onTranscript?.(transcript);
		}
		return true;
	};
	const completeItem = (itemId, transcript, transport) => {
		const key = itemId ?? unkeyedTranscript;
		if (itemId && !trackItem(itemId, transport)) return false;
		const partialBytes = pendingTranscripts.get(key)?.bytes ?? 0;
		pendingTranscripts.delete(key);
		retainedTranscriptBytes -= partialBytes;
		const transcriptBytes = transcript ? Buffer.byteLength(transcript, "utf8") : 0;
		if (transcriptBytes > OPENAI_REALTIME_TRANSCRIPTION_MAX_RETAINED_TRANSCRIPT_BYTES - retainedTranscriptBytes) {
			failTerminal(/* @__PURE__ */ new Error(OPENAI_REALTIME_TRANSCRIPTION_TEXT_OVERFLOW_MESSAGE), transport);
			return false;
		}
		if (!itemId || !committedItems.has(itemId)) {
			if (itemId) {
				if (!settleItem(itemId, transport)) return false;
			} else trackedItemIds.delete(key);
			if (transcript) config.onTranscript?.(transcript);
			return true;
		}
		completedTranscripts.set(itemId, transcript);
		retainedTranscriptBytes += transcriptBytes;
		return flushCompletedTranscripts(transport);
	};
	const handleEvent = (event, transport) => {
		switch (event.type) {
			case "session.updated":
			case "transcription_session.updated":
				transport.markReady();
				return;
			case "input_audio_buffer.committed":
				if (event.item_id && (committedItems.has(event.item_id) || settledItemIds.has(event.item_id)) && lastVadBoundary?.itemId !== event.item_id) return;
				committedAudioBytes = event.item_id && lastVadBoundary?.itemId === event.item_id ? Math.max(committedAudioBytes, Math.min(appendedAudioBytes, lastVadBoundary.audioEndBytes)) : appendedAudioBytes;
				if (event.item_id === lastVadBoundary?.itemId) lastVadBoundary = void 0;
				if (event.item_id) commitItem(event.item_id, event.previous_item_id, transport);
				return;
			case "input_audio_buffer.speech_stopped":
				if (event.item_id && typeof event.audio_end_ms === "number" && Number.isFinite(event.audio_end_ms) && event.audio_end_ms >= 0) lastVadBoundary = {
					itemId: event.item_id,
					audioEndBytes: event.audio_end_ms * OPENAI_REALTIME_TRANSCRIPTION_AUDIO_BYTES_PER_MS
				};
				return;
			case "conversation.item.input_audio_transcription.delta":
				if (event.delta) {
					const key = event.item_id ?? unkeyedTranscript;
					if (!trackItem(key, transport)) return;
					const pendingTranscript = pendingTranscripts.get(key);
					const previousPartial = pendingTranscript?.text ?? "";
					const deltaBytes = appendedUtf8ByteLength(previousPartial, event.delta);
					if (deltaBytes > OPENAI_REALTIME_TRANSCRIPTION_MAX_RETAINED_TRANSCRIPT_BYTES - retainedTranscriptBytes) {
						failTerminal(/* @__PURE__ */ new Error(OPENAI_REALTIME_TRANSCRIPTION_TEXT_OVERFLOW_MESSAGE), transport);
						return;
					}
					const partial = `${previousPartial}${event.delta}`;
					pendingTranscripts.set(key, {
						bytes: (pendingTranscript?.bytes ?? 0) + deltaBytes,
						text: partial
					});
					retainedTranscriptBytes += deltaBytes;
					config.onPartial?.(partial);
				}
				return;
			case "conversation.item.input_audio_transcription.completed":
				completeItem(event.item_id, event.transcript, transport);
				return;
			case "conversation.item.input_audio_transcription.failed":
				if (event.item_id && (settledItemIds.has(event.item_id) || completedTranscripts.has(event.item_id))) return;
				if (completeItem(event.item_id, void 0, transport)) config.onError?.(new Error(readRealtimeErrorDetail(event.error)));
				return;
			case "input_audio_buffer.speech_started": {
				const key = event.item_id ?? unkeyedTranscript;
				const partialBytes = pendingTranscripts.get(key)?.bytes ?? 0;
				pendingTranscripts.delete(key);
				retainedTranscriptBytes -= partialBytes;
				if (!committedItems.has(key)) trackedItemIds.delete(key);
				config.onSpeechStart?.();
				return;
			}
			case "error": {
				const detail = readRealtimeErrorDetail(event.error);
				const error = new Error(detail);
				if (!transport.isReady()) transport.failConnect(error);
				else config.onError?.(error);
			}
		}
	};
	return runtime.createRealtimeTranscriptionWebSocketSession({
		providerId: "openai",
		callbacks: config,
		url: OPENAI_REALTIME_TRANSCRIPTION_URL,
		headers: async () => {
			const bearer = await resolveOpenAIRealtimeTranscriptionAuthorization(config, runtime);
			return runtime.resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: OPENAI_REALTIME_TRANSCRIPTION_URL,
				capability: "audio",
				transport: "websocket",
				defaultHeaders: { Authorization: `Bearer ${bearer}` }
			}) ?? { Authorization: `Bearer ${bearer}` };
		},
		connectTimeoutMs: OPENAI_REALTIME_TRANSCRIPTION_CONNECT_TIMEOUT_MS,
		maxReconnectAttempts: OPENAI_REALTIME_TRANSCRIPTION_MAX_RECONNECT_ATTEMPTS,
		reconnectDelayMs: OPENAI_REALTIME_TRANSCRIPTION_RECONNECT_DELAY_MS,
		connectTimeoutMessage: "OpenAI realtime transcription connection timeout",
		connectClosedBeforeReadyMessage: "OpenAI realtime transcription connection closed before ready",
		reconnectLimitMessage: "OpenAI realtime transcription reconnect limit reached",
		sendAudio: (audio, transport) => {
			if (transport.sendJson({
				type: "input_audio_buffer.append",
				audio: audio.toString("base64")
			})) appendedAudioBytes += audio.byteLength;
		},
		onClose: (transport) => {
			const ownedAudioBytes = Math.max(committedAudioBytes, lastVadBoundary?.audioEndBytes ?? 0);
			if (appendedAudioBytes - ownedAudioBytes >= 800) {
				if (!transport.sendJson({ type: "input_audio_buffer.commit" })) {
					failTerminal(/* @__PURE__ */ new Error("OpenAI realtime transcription could not send its final audio commit; check the provider connection"), transport);
					return;
				}
				committedAudioBytes = appendedAudioBytes;
			}
		},
		onOpen: (transport) => {
			resetTranscriptionState();
			transport.sendJson({
				type: "session.update",
				session: buildOpenAIRealtimeTranscriptionSessionPayload(config)
			});
		},
		onMessage: handleEvent
	});
}
function buildOpenAIRealtimeTranscriptionProvider(runtime) {
	return {
		id: "openai",
		label: "OpenAI Realtime Transcription",
		aliases: ["openai-realtime"],
		defaultModel: OPENAI_REALTIME_TRANSCRIPTION_DEFAULT_MODEL,
		autoSelectOrder: 10,
		resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
		isConfigured: ({ cfg, providerConfig }) => Boolean(normalizeProviderConfig(providerConfig).apiKey || process.env.OPENAI_API_KEY?.trim() || runtime.isProviderAuthProfileConfigured({
			provider: "openai",
			cfg,
			profileTypes: ["api_key"]
		})),
		createSession: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			return createOpenAIRealtimeTranscriptionSession({
				...req,
				apiKey: config.apiKey,
				language: config.language,
				model: config.model ?? OPENAI_REALTIME_TRANSCRIPTION_DEFAULT_MODEL,
				prompt: config.prompt,
				silenceDurationMs: config.silenceDurationMs ?? 800,
				vadThreshold: config.vadThreshold ?? .5
			}, runtime);
		}
	};
}
//#endregion
export { buildOpenAIRealtimeTranscriptionProvider as t };
