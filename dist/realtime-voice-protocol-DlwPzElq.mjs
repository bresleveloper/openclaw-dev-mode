import { M as realtimeVoiceAudioDurationMs, k as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { D as parsePlaybackMarkSequence, g as buildOpenAIRealtimeTurnDetectionConfig, h as buildOpenAIRealtimeGaSessionPolicy, w as normalizeOpenAIRealtimeTools } from "./realtime-voice-session-policy-BGXV2brx.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/openai/realtime-voice-protocol.ts
var OpenAIRealtimeProtocol = class {
	static {
		this.MAX_TOOL_ARGUMENT_BYTES = 256e3;
	}
	static {
		this.MAX_COMPLETED_TOOL_CALL_IDS = 1024;
	}
	constructor(config, runtime) {
		this.config = config;
		this.runtime = runtime;
		this.supportsToolResultContinuation = true;
		this.supportsToolResultSuppression = true;
		this.nextMarkSequence = 1;
		this.oldestOutstandingMarkSequence = null;
		this.latestOutstandingMarkSequence = null;
		this.responseActive = false;
		this.responseCreateState = "idle";
		this.manualResponseCreateEventId = null;
		this.responseCancelInFlight = false;
		this.manualResponseCancelEventId = null;
		this.responseCreatePending = false;
		this.autoRespondSuppressedForManualResponse = false;
		this.continuingToolCallIds = /* @__PURE__ */ new Set();
		this.pendingToolCallIds = /* @__PURE__ */ new Set();
		this.latestMediaTimestamp = 0;
		this.outputAudioGeneration = 0;
		this.interruptingPlayback = false;
		this.assistantAudioItem = null;
		this.completedToolCallIds = /* @__PURE__ */ new Set();
		this.standaloneSpeechQueue = [];
		this.standaloneSpeechActive = false;
		this.standaloneSpeechEventId = null;
		this.audioFormat = config.audioFormat ?? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ;
	}
	setMediaTimestamp(ts) {
		this.latestMediaTimestamp = ts;
	}
	acknowledgeMark(markName) {
		const oldest = this.oldestOutstandingMarkSequence;
		const latest = this.latestOutstandingMarkSequence;
		if (oldest === null || latest === null) return;
		const acknowledgedSequence = markName === void 0 ? oldest : parsePlaybackMarkSequence(markName);
		if (acknowledgedSequence === void 0 || acknowledgedSequence < oldest || acknowledgedSequence > latest) return;
		if (acknowledgedSequence === latest) {
			this.oldestOutstandingMarkSequence = null;
			this.latestOutstandingMarkSequence = null;
			return;
		}
		this.oldestOutstandingMarkSequence = acknowledgedSequence + 1;
	}
	sendSessionUpdate() {
		if (this.usesAzureDeploymentRealtimeApi()) {
			this.sendEvent(this.buildAzureDeploymentSessionUpdate());
			return;
		}
		this.sendEvent(this.buildGaSessionUpdate());
	}
	buildGaSessionUpdate() {
		const cfg = this.config;
		return {
			type: "session.update",
			session: cfg.gaSessionPolicy ?? buildOpenAIRealtimeGaSessionPolicy({
				audioFormat: this.audioFormat,
				autoRespondToAudio: cfg.autoRespondToAudio,
				instructions: cfg.instructions,
				interruptResponseOnInputAudio: cfg.interruptResponseOnInputAudio,
				language: cfg.language,
				model: cfg.model ?? "gpt-realtime-2.1",
				noiseReduction: null,
				prefixPaddingMs: cfg.prefixPaddingMs,
				reasoningEffort: cfg.reasoningEffort,
				silenceDurationMs: cfg.silenceDurationMs,
				tools: normalizeOpenAIRealtimeTools(cfg.tools, this.runtime.warn),
				vadThreshold: cfg.vadThreshold,
				voice: cfg.voice ?? "alloy"
			})
		};
	}
	usesAzureDeploymentRealtimeApi() {
		return Boolean(this.config.azureEndpoint && this.config.azureDeployment);
	}
	buildAzureDeploymentSessionUpdate() {
		const cfg = this.config;
		const format = this.resolveLegacyRealtimeAudioFormat();
		const tools = normalizeOpenAIRealtimeTools(cfg.tools, this.runtime.warn, 64);
		return {
			type: "session.update",
			session: {
				modalities: ["text", "audio"],
				instructions: cfg.instructions,
				voice: cfg.voice ?? "alloy",
				input_audio_format: format,
				output_audio_format: format,
				input_audio_transcription: {
					model: "whisper-1",
					...cfg.language ? { language: cfg.language } : {}
				},
				turn_detection: this.buildTurnDetectionConfig(),
				temperature: cfg.temperature ?? .8,
				...tools ? {
					tools,
					tool_choice: "auto"
				} : {}
			}
		};
	}
	buildTurnDetectionConfig(options) {
		return buildOpenAIRealtimeTurnDetectionConfig({
			autoRespondToAudio: this.config.autoRespondToAudio,
			createResponse: options?.createResponse,
			includeInterruptResponse: options?.includeInterruptResponse,
			interruptResponseOnInputAudio: this.config.interruptResponseOnInputAudio,
			prefixPaddingMs: this.config.prefixPaddingMs,
			silenceDurationMs: this.config.silenceDurationMs,
			vadThreshold: this.config.vadThreshold
		});
	}
	sendAutoResponseSessionUpdate(createResponse) {
		const azureDeployment = this.usesAzureDeploymentRealtimeApi();
		const turnDetection = this.buildTurnDetectionConfig({
			createResponse,
			includeInterruptResponse: !azureDeployment
		});
		if (azureDeployment) {
			this.sendEvent({
				type: "session.update",
				session: { turn_detection: turnDetection }
			});
			return;
		}
		this.sendEvent({
			type: "session.update",
			session: {
				type: "realtime",
				audio: { input: { turn_detection: turnDetection } }
			}
		});
	}
	resolveLegacyRealtimeAudioFormat() {
		return this.audioFormat.encoding === "pcm16" ? "pcm16" : "g711_ulaw";
	}
	releaseResponseState(options = {}) {
		this.responseActive = false;
		this.responseCreateState = "idle";
		this.manualResponseCreateEventId = null;
		this.responseCancelInFlight = false;
		this.manualResponseCancelEventId = null;
		if (this.standaloneSpeechActive) {
			this.standaloneSpeechActive = false;
			this.standaloneSpeechEventId = null;
		}
		if (options.drain !== false) this.drainResponseQueue();
	}
	drainResponseQueue() {
		if (this.interruptingPlayback || this.responseActive || this.responseCreateState !== "idle" || this.responseCancelInFlight) return;
		if (this.standaloneSpeechQueue.length > 0) this.flushStandaloneSpeech();
		else if (this.responseCreatePending) this.flushPendingResponseCreate();
		else this.restoreAutoRespondAfterManualResponse();
	}
	handleBargeIn(options) {
		if (this.interruptingPlayback) return;
		this.interruptingPlayback = true;
		try {
			this.interruptPlayback(options);
		} finally {
			this.interruptingPlayback = false;
		}
		this.drainResponseQueue();
	}
	interruptPlayback(options) {
		const assistantAudioItem = this.assistantAudioItem;
		const force = options?.force === true;
		const shouldInterruptProvider = assistantAudioItem !== null && (this.oldestOutstandingMarkSequence !== null || options?.audioPlaybackActive === true || force);
		const playbackItems = (this.config.getPlaybackState ? this.config.getPlaybackState() : shouldInterruptProvider && assistantAudioItem ? [{
			itemId: assistantAudioItem.itemId,
			audioEndMs: Math.min(Math.floor(realtimeVoiceAudioDurationMs(this.audioFormat, assistantAudioItem.bytes)), Math.max(0, this.latestMediaTimestamp - assistantAudioItem.startTimestamp))
		}] : []).map(({ itemId, audioEndMs }) => ({
			itemId,
			audioEndMs
		}));
		const audioEndMs = playbackItems.reduce((played, item) => played + item.audioEndMs, 0);
		const minBargeInAudioEndMs = this.config.minBargeInAudioEndMs ?? 250;
		if (!force && playbackItems.length > 0 && audioEndMs < minBargeInAudioEndMs) {
			this.config.onEvent?.({
				direction: "client",
				type: "conversation.item.truncate.skipped",
				detail: `reason=barge-in audioEndMs=${audioEndMs} minAudioEndMs=${minBargeInAudioEndMs}`
			});
			return;
		}
		if (this.responseCreateState === "preparing") this.releaseResponseState({ drain: false });
		const cancelResponse = (options?.audioPlaybackActive === true || force) && (this.responseActive || this.responseCreateState === "in-flight") && !this.responseCancelInFlight;
		this.outputAudioGeneration += 1;
		this.assistantAudioItem = null;
		this.clearOutstandingMarks();
		if (this.responseActive || this.responseCreateState === "in-flight") this.responseCancelInFlight = true;
		if (cancelResponse) {
			const eventId = `openclaw-response-cancel-${randomUUID()}`;
			this.manualResponseCancelEventId = eventId;
			this.sendEvent({
				type: "response.cancel",
				event_id: eventId
			}, "reason=barge-in");
		}
		for (const item of playbackItems) this.sendEvent({
			type: "conversation.item.truncate",
			item_id: item.itemId,
			content_index: 0,
			audio_end_ms: item.audioEndMs
		}, `reason=barge-in audioEndMs=${item.audioEndMs}`);
		this.config.onClearAudio("barge-in");
	}
	requestResponseCreate(options) {
		if (this.interruptingPlayback || this.responseActive || this.responseCreateState !== "idle" || this.responseCancelInFlight || this.continuingToolCallIds.size > 0 || this.pendingToolCallIds.size > 0) {
			this.responseCreatePending = true;
			return;
		}
		this.responseCreatePending = false;
		this.responseCreateState = "preparing";
		this.suppressAutoRespondForManualResponse();
		if (this.responseCreateState !== "preparing") return;
		this.responseCreateState = "in-flight";
		const eventId = `openclaw-response-create-${randomUUID()}`;
		this.manualResponseCreateEventId = eventId;
		this.sendEvent({
			type: "response.create",
			event_id: eventId,
			...options?.toolChoice ? { response: {
				output_modalities: ["audio"],
				tool_choice: options.toolChoice
			} } : {}
		});
	}
	flushStandaloneSpeech() {
		if (this.interruptingPlayback || this.standaloneSpeechActive || this.responseActive || this.responseCreateState !== "idle" || this.responseCancelInFlight) return;
		const text = this.standaloneSpeechQueue.shift();
		if (!text) return;
		const eventId = `openclaw-standalone-speech-${randomUUID()}`;
		this.standaloneSpeechActive = true;
		this.standaloneSpeechEventId = eventId;
		this.responseCreateState = "in-flight";
		this.sendEvent({
			type: "response.create",
			event_id: eventId,
			response: {
				conversation: "none",
				output_modalities: ["audio"],
				input: [{
					type: "message",
					role: "user",
					content: [{
						type: "input_text",
						text
					}]
				}]
			}
		});
	}
	suppressAutoRespondForManualResponse() {
		if (this.config.autoRespondToAudio === false || this.autoRespondSuppressedForManualResponse) return;
		this.autoRespondSuppressedForManualResponse = true;
		this.sendAutoResponseSessionUpdate(false);
	}
	restoreAutoRespondAfterManualResponse() {
		if (!this.autoRespondSuppressedForManualResponse) return;
		this.autoRespondSuppressedForManualResponse = false;
		this.sendAutoResponseSessionUpdate(true);
	}
	flushPendingResponseCreate() {
		if (!this.responseCreatePending) return;
		this.responseCreatePending = false;
		this.requestResponseCreate();
	}
	resetRealtimeSessionState() {
		this.outputAudioGeneration += 1;
		this.clearOutstandingMarks();
		this.assistantAudioItem = null;
		this.responseActive = false;
		this.responseCreateState = "idle";
		this.manualResponseCreateEventId = null;
		this.responseCancelInFlight = false;
		this.manualResponseCancelEventId = null;
		this.responseCreatePending = false;
		this.autoRespondSuppressedForManualResponse = false;
		this.continuingToolCallIds.clear();
		this.pendingToolCallIds.clear();
		this.completedToolCallIds.clear();
		this.standaloneSpeechQueue = [];
		this.standaloneSpeechActive = false;
		this.standaloneSpeechEventId = null;
	}
	createPlaybackMark() {
		const sequence = this.nextMarkSequence;
		this.nextMarkSequence += 1;
		if (this.oldestOutstandingMarkSequence === null) this.oldestOutstandingMarkSequence = sequence;
		this.latestOutstandingMarkSequence = sequence;
		return `audio-${sequence}`;
	}
	clearOutstandingMarks() {
		this.oldestOutstandingMarkSequence = null;
		this.latestOutstandingMarkSequence = null;
	}
};
//#endregion
export { OpenAIRealtimeProtocol as t };
