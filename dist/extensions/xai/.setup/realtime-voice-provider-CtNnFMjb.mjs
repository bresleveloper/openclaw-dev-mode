import { C as XAI_REALTIME_WS_MAX_PAYLOAD_BYTES, D as serializeXaiRealtimeToolResult, E as readXaiRealtimeErrorDetail, O as toXaiRealtimeWsUrl, T as normalizeXaiRealtimeProviderConfig, _ as XAI_REALTIME_CONNECT_TIMEOUT_MS, b as XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, g as XAI_REALTIME_BASE_RECONNECT_DELAY_MS, s as assertXaiRealtimeVoiceRequestSupported, w as normalizeXaiRealtimeBaseUrl, x as XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS } from "./capability-provider-metadata-factory-Dd0r_YMX.mjs";
import { t as createXaiRealtimeVoiceProviderMetadata } from "./capability-provider-metadata-n00NVxSt.mjs";
import { t as xaiUserAgentHeaderFor } from "./xai-user-agent-y9285KEZ.mjs";
import { t as WebSocket } from "./ws-runtime-BC0VsR8N.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, RealtimeVoiceSessionLifecycle, RealtimeVoiceWebSocketTransport, canonicalizeBase64, normalizeRealtimeVoiceResponseOutcome, realtimeVoiceAudioDurationMs, toOpenAICompatibleRealtimeAudioFormat } from "openclaw/plugin-sdk/realtime-voice-provider";
import { resolveAgentDir } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import * as proxyCaptureSdk from "openclaw/plugin-sdk/proxy-capture";
import { randomUUID } from "node:crypto";
//#region extensions/xai/realtime-voice-auth.runtime.ts
async function resolveXaiRealtimeApiKey(configApiKey, cfg, agentId) {
	const direct = normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
	if (direct) return direct;
	const auth = await resolveApiKeyForProvider({
		provider: "xai",
		cfg,
		...cfg && agentId ? { agentDir: resolveAgentDir(cfg, agentId) } : {}
	});
	const oauthKey = normalizeOptionalString(auth?.apiKey);
	if (oauthKey) return oauthKey;
	throw new Error("xAI credentials missing for realtime voice. Sign in with `openclaw onboard --auth-choice xai-oauth`, run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.");
}
//#endregion
//#region extensions/xai/realtime-voice-protocol.ts
var XaiRealtimePlaybackMarkOverflowError = class extends Error {};
var XaiRealtimeVoiceProtocol = class {
	constructor(config) {
		this.config = config;
		this.markQueue = [];
		this.responseActive = false;
		this.responseCreateInFlight = false;
		this.responseCancelInFlight = false;
		this.responseCreatePending = false;
		this.pendingToolCallIds = /* @__PURE__ */ new Set();
		this.latestMediaTimestamp = 0;
		this.assistantAudioItem = null;
		this.toolCallBuffers = /* @__PURE__ */ new Map();
		this.deliveredToolCallKeys = /* @__PURE__ */ new Set();
		this.pendingToolResultAcks = /* @__PURE__ */ new Set();
		this.conversationId = null;
		this.audioFormat = config.audioFormat ?? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ;
	}
	sendUserMessageNow(text) {
		this.sendEvent({
			type: "conversation.item.create",
			item: {
				type: "message",
				role: "user",
				content: [{
					type: "input_text",
					text
				}]
			}
		});
		this.requestResponseCreate();
	}
	submitToolResultNow(callId, result, options) {
		if (options?.willContinue === true) return;
		const output = serializeXaiRealtimeToolResult(result);
		this.sendEvent({
			type: "conversation.item.create",
			item: {
				type: "function_call_output",
				call_id: callId,
				output
			}
		});
		this.pendingToolResultAcks.add(callId);
		this.pendingToolCallIds.delete(callId);
		if (options?.suppressResponse !== true) this.requestResponseCreate();
	}
	acknowledgeMark(markName) {
		if (this.markQueue.length === 0) return;
		if (markName) {
			const index = this.markQueue.indexOf(markName);
			if (index < 0) return;
			this.markQueue.splice(index, 1);
		} else this.markQueue.shift();
		if (this.markQueue.length === 0) this.flushPendingResponseCreate();
	}
	handleBargeIn(options) {
		this.interruptPlayback("barge-in", options);
	}
	handleServerVadBargeIn() {
		this.interruptPlayback("server-vad-barge-in");
	}
	audioEndMs(item) {
		const producedAudioMs = Math.floor(realtimeVoiceAudioDurationMs(this.audioFormat, item.bytes));
		const playbackAudioMs = Math.max(0, this.latestMediaTimestamp - item.startTimestamp);
		return Math.min(producedAudioMs, playbackAudioMs);
	}
	interruptPlayback(reason, options) {
		const item = this.assistantAudioItem;
		const hasLegacyPlayback = this.markQueue.length > 0 || reason === "barge-in" && (this.responseActive || options?.audioPlaybackActive === true);
		const playbackItems = (this.config.getPlaybackState ? this.config.getPlaybackState() : item && hasLegacyPlayback ? [{
			itemId: item.itemId,
			audioEndMs: this.audioEndMs(item)
		}] : []).map(({ itemId, audioEndMs }) => ({
			itemId,
			audioEndMs
		}));
		const cancelResponse = reason === "barge-in" && (this.responseActive || this.responseCreateInFlight || playbackItems.length > 0) && !this.responseCancelInFlight;
		this.markQueue = [];
		this.assistantAudioItem = null;
		if (this.responseActive || this.responseCreateInFlight) this.responseCancelInFlight = true;
		if (cancelResponse) this.sendEvent({ type: "response.cancel" }, `reason=${reason}`);
		for (const playbackItem of playbackItems) this.sendEvent({
			type: "conversation.item.truncate",
			item_id: playbackItem.itemId,
			content_index: 0,
			audio_end_ms: playbackItem.audioEndMs
		}, `reason=${reason} audioEndMs=${playbackItem.audioEndMs}`);
		this.config.onClearAudio("barge-in");
		if (reason === "barge-in") this.flushPendingResponseCreate();
	}
	buildSessionUpdate() {
		const cfg = this.config;
		const format = toOpenAICompatibleRealtimeAudioFormat(this.audioFormat);
		return {
			type: "session.update",
			session: {
				instructions: cfg.instructions,
				voice: cfg.voice ?? "eve",
				output_modalities: ["audio"],
				turn_detection: {
					type: "server_vad",
					threshold: cfg.vadThreshold ?? .85,
					prefix_padding_ms: cfg.prefixPaddingMs ?? 333,
					silence_duration_ms: cfg.silenceDurationMs ?? 500
				},
				audio: {
					input: {
						format,
						transcription: { model: XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL }
					},
					output: { format }
				},
				...cfg.sessionResumption === true ? { resumption: { enabled: true } } : {},
				...cfg.reasoningEffort ? { reasoning: { effort: cfg.reasoningEffort } } : {},
				...cfg.tools?.length ? {
					tools: cfg.tools,
					tool_choice: "auto"
				} : {}
			}
		};
	}
	emitToolCallOnce(fields) {
		if (!this.config.onToolCall) return;
		const itemId = fields.itemId || fields.callId || "unknown";
		const callId = fields.callId || itemId;
		const name = fields.name || "";
		const dedupeKey = fields.itemId || fields.callId || `${name}:${fields.rawArgs ?? ""}`;
		if (this.deliveredToolCallKeys.has(dedupeKey)) return;
		let args;
		try {
			args = JSON.parse(fields.rawArgs || "{}");
		} catch {
			this.rejectToolCallArguments({
				itemId,
				callId,
				dedupeKey,
				reason: "malformed-json"
			});
			return;
		}
		if (!isRecord(args)) {
			this.rejectToolCallArguments({
				itemId,
				callId,
				dedupeKey,
				reason: "non-object-json"
			});
			return;
		}
		this.deliveredToolCallKeys.add(dedupeKey);
		this.pendingToolCallIds.add(callId);
		this.config.onToolCall({
			itemId,
			callId,
			name,
			args
		});
	}
	rejectToolCallArguments(params) {
		this.deliveredToolCallKeys.add(params.dedupeKey);
		this.config.onEvent?.({
			direction: "server",
			type: "tool_call.arguments.rejected",
			detail: `reason=${params.reason}`,
			itemId: params.itemId
		});
		this.submitToolResultNow(params.callId, { error: "Invalid tool arguments." });
	}
	requestResponseCreate() {
		if (this.responseActive || this.responseCreateInFlight || this.responseCancelInFlight || this.markQueue.length > 0 || this.pendingToolCallIds.size > 0) {
			this.responseCreatePending = true;
			return;
		}
		this.responseCreatePending = false;
		this.responseCreateInFlight = true;
		this.sendEvent({ type: "response.create" });
	}
	flushPendingResponseCreate() {
		if (!this.responseCreatePending) return;
		this.responseCreatePending = false;
		this.requestResponseCreate();
	}
	resetRealtimeSessionState(options = {}) {
		this.markQueue = [];
		this.responseActive = false;
		this.responseCreateInFlight = false;
		this.responseCancelInFlight = false;
		this.responseCreatePending = false;
		this.assistantAudioItem = null;
		this.resetInputTranscripts();
		if (!options.preserveToolCallState) {
			this.pendingToolCallIds.clear();
			this.toolCallBuffers.clear();
			this.deliveredToolCallKeys.clear();
			this.pendingToolResultAcks.clear();
		}
	}
	createPlaybackMark() {
		if (this.markQueue.length >= 1024) throw new XaiRealtimePlaybackMarkOverflowError(`xAI realtime voice playback mark limit exceeded (${XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS})`);
		const markName = `audio-${randomUUID()}`;
		this.markQueue.push(markName);
		return markName;
	}
};
//#endregion
//#region extensions/xai/realtime-voice-events.ts
var XaiRealtimeMalformedAudioError = class extends Error {};
const XAI_REALTIME_INPUT_SETTLE_MS = 1500;
var XaiRealtimeVoiceEvents = class extends XaiRealtimeVoiceProtocol {
	constructor(..._args) {
		super(..._args);
		this.assistantTranscriptBuffer = "";
		this.assistantTranscriptFinalized = false;
		this.finalizedInputTranscriptKeys = /* @__PURE__ */ new Set();
		this.inputSpeechSequence = 0;
		this.inputResponseStarted = false;
		this.inputResponseFinished = false;
		this.finalizedToolCallItems = /* @__PURE__ */ new Set();
		this.inputTranscriptReplacements = /* @__PURE__ */ new Map();
	}
	handleEvent(event, connection) {
		const responseId = event.response_id ?? event.response?.id;
		if (event.type.startsWith("response.") && event.type !== "response.created" && this.outputResponse && (this.outputResponse.ended || responseId && this.outputResponse.id && responseId !== this.outputResponse.id)) return;
		if (event.type === "response.created" && this.acceptsEvent(connection)) {
			this.inputResponseStarted = true;
			this.inputResponseFinished = false;
			if (this.outputResponse && !this.outputResponse.ended && responseId && this.outputResponse.id && responseId !== this.outputResponse.id) this.responseCancelInFlight = false;
			this.outputResponse = {
				id: responseId,
				ended: false
			};
			this.toolCallBuffers.clear();
			this.finalizedToolCallItems.clear();
			this.responseActive = true;
			this.responseCreateInFlight = false;
			this.markQueue = [];
			this.assistantAudioItem = null;
			this.resetAssistantTranscript();
		}
		const bridgeEvent = {
			direction: "server",
			type: event.type,
			detail: this.describeServerEvent(event),
			...event.item_id ? { itemId: event.item_id } : {},
			...event.response_id ?? event.response?.id ? { responseId: event.response_id ?? event.response?.id } : {}
		};
		const emitBridgeEvent = () => this.config.onEvent?.(bridgeEvent);
		if (event.type !== "response.done" || !this.acceptsEvent(connection)) emitBridgeEvent();
		if (!this.acceptsEvent(connection)) return;
		switch (event.type) {
			case "session.created": return;
			case "conversation.created": {
				const conversationId = normalizeOptionalString(event.conversation?.id);
				if (conversationId) this.conversationId = conversationId;
				return;
			}
			case "conversation.item.created":
			case "conversation.item.added": {
				const item = event.item;
				const callId = normalizeOptionalString(item?.call_id);
				if (item?.type === "function_call_output" && callId) {
					this.pendingToolResultAcks.delete(callId);
					return;
				}
				if (event.type === "conversation.item.created") this.emitCompletedToolCall(item, event);
				return;
			}
			case "session.updated":
				this.onSessionUpdated(connection);
				return;
			case "response.output_audio.delta": {
				const audioDelta = event.delta ?? event.data;
				if (!audioDelta || this.responseCancelInFlight) return;
				const canonicalAudio = canonicalizeBase64(audioDelta);
				if (!canonicalAudio) throw new XaiRealtimeMalformedAudioError("xAI realtime voice stream returned malformed base64 audio data");
				const audio = Buffer.from(canonicalAudio, "base64");
				if (event.item_id && event.item_id !== this.assistantAudioItem?.itemId) this.assistantAudioItem = {
					itemId: event.item_id,
					bytes: audio.byteLength,
					startTimestamp: this.latestMediaTimestamp
				};
				else if (this.assistantAudioItem) this.assistantAudioItem.bytes += audio.byteLength;
				this.responseActive = true;
				const markName = this.createPlaybackMark();
				this.config.onAudio(audio, event.item_id ? { itemId: event.item_id } : void 0);
				if (this.acceptsEvent(connection)) this.config.onMark?.(markName, () => {
					if (this.acceptsEvent(connection)) this.acknowledgeMark(markName);
				});
				return;
			}
			case "input_audio_buffer.speech_started":
				this.flushPendingInputTranscript();
				this.inputSpeechSequence += 1;
				this.inputResponseStarted = false;
				this.inputResponseFinished = false;
				this.handleServerVadBargeIn();
				return;
			case "response.text.delta":
			case "response.output_text.delta":
			case "response.output_audio_transcript.delta":
				if (event.delta) this.appendAssistantTranscriptDelta(event.delta);
				return;
			case "response.text.done":
			case "response.output_text.done":
			case "response.output_audio_transcript.done":
				if (this.isCurrentInputResponse(event)) {
					this.flushPendingInputTranscript();
					if (!this.acceptsEvent(connection)) return;
				}
				this.flushAssistantTranscript(event.transcript ?? event.text);
				return;
			case "conversation.item.input_audio_transcription.delta":
				if (event.delta) this.config.onTranscript?.("user", event.delta, false);
				return;
			case "conversation.item.input_audio_transcription.updated":
				if (event.transcript) this.inputTranscriptReplacements.set(this.inputTranscriptKey(event), event.transcript);
				return;
			case "conversation.item.input_audio_transcription.completed": {
				const key = this.inputTranscriptKey(event);
				const transcript = event.transcript ?? this.inputTranscriptReplacements.get(key);
				this.inputTranscriptReplacements.delete(key);
				if (!transcript || this.finalizedInputTranscriptKeys.has(key)) return;
				if (this.pendingInputTranscript && this.pendingInputTranscript.key !== key) {
					this.flushPendingInputTranscript();
					if (!this.acceptsEvent(connection)) return;
				}
				this.pendingInputTranscript = {
					key,
					text: transcript
				};
				this.config.onTranscript?.("user", transcript, false, { textMode: "snapshot" });
				if (this.inputResponseFinished) this.armInputSettleTimer();
				return;
			}
			case "conversation.item.input_audio_transcription.failed": {
				const key = this.inputTranscriptKey(event);
				if (this.pendingInputTranscript?.key === key) this.pendingInputTranscript = void 0;
				this.inputTranscriptReplacements.delete(key);
				this.config.onError?.(new Error(readXaiRealtimeErrorDetail(event.error)));
				return;
			}
			case "response.done": {
				if (this.isCurrentInputResponse(event)) {
					this.inputResponseFinished = true;
					this.flushPendingInputTranscript();
					if (!this.acceptsEvent(connection)) return;
				}
				const output = Array.isArray(event.response?.output) ? event.response.output.filter(isRecord) : [];
				const outcome = normalizeRealtimeVoiceResponseOutcome({
					providerLabel: "xAI realtime voice",
					response: event.response,
					responseId: event.response_id
				});
				if (outcome.status !== "completed") {
					this.markQueue = [];
					this.assistantAudioItem = null;
				}
				try {
					if (outcome.status === "completed") {
						for (const [itemId, toolCall] of this.toolCallBuffers) {
							if (!this.acceptsEvent(connection)) break;
							this.emitToolCallOnce({
								itemId,
								callId: toolCall.callId,
								name: toolCall.name,
								rawArgs: toolCall.args
							});
						}
						for (const item of output) {
							if (!this.acceptsEvent(connection)) break;
							this.emitCompletedToolCall(item, event);
						}
					}
					if (this.acceptsEvent(connection)) {
						const terminalTranscript = output.filter((item) => item.type === "message" && item.role === "assistant").flatMap((item) => Array.isArray(item.content) ? item.content.filter(isRecord) : []).map((content) => typeof content.transcript === "string" ? content.transcript : typeof content.text === "string" ? content.text : "").join("");
						this.flushAssistantTranscript(terminalTranscript);
					}
					if (this.outputResponse) this.outputResponse.ended = true;
					this.config.onResponseDone?.(outcome);
					emitBridgeEvent();
				} finally {
					this.responseActive = false;
					this.responseCreateInFlight = false;
					this.responseCancelInFlight = false;
					this.toolCallBuffers.clear();
					this.finalizedToolCallItems.clear();
					this.flushPendingResponseCreate();
				}
				return;
			}
			case "response.function_call_arguments.delta": {
				const key = event.item_id ?? "unknown";
				const existing = this.toolCallBuffers.get(key);
				if (existing && event.delta) existing.args += event.delta;
				else if (event.item_id) this.toolCallBuffers.set(event.item_id, {
					name: event.name ?? "",
					callId: event.call_id ?? "",
					args: event.delta ?? ""
				});
				return;
			}
			case "response.function_call_arguments.done": {
				const key = event.item_id ?? "unknown";
				if (this.finalizedToolCallItems.has(key)) return;
				const buffered = this.toolCallBuffers.get(key);
				if (event.item_id) {
					this.finalizedToolCallItems.add(event.item_id);
					this.toolCallBuffers.set(event.item_id, {
						name: buffered?.name || event.name || "",
						callId: buffered?.callId || event.call_id || "",
						args: event.arguments ?? buffered?.args ?? ""
					});
				}
				return;
			}
			case "response.output_item.done":
				this.bufferCompletedToolCall(event.item, event);
				return;
			case "error": this.handleErrorEvent(event.error);
		}
	}
	resetInputTranscripts() {
		this.flushPendingInputTranscript();
		this.inputTranscriptReplacements.clear();
		this.finalizedInputTranscriptKeys.clear();
		this.inputResponseStarted = false;
		this.inputResponseFinished = false;
		this.outputResponse = void 0;
		this.finalizedToolCallItems.clear();
	}
	isCurrentInputResponse(event) {
		const responseId = event.response_id ?? event.response?.id;
		return this.inputResponseStarted && (!responseId || !this.outputResponse?.id || responseId === this.outputResponse.id);
	}
	armInputSettleTimer() {
		clearTimeout(this.inputSettleTimer);
		this.inputSettleTimer = setTimeout(() => {
			this.inputSettleTimer = void 0;
			this.flushPendingInputTranscript();
		}, XAI_REALTIME_INPUT_SETTLE_MS);
		this.inputSettleTimer.unref?.();
	}
	flushPendingInputTranscript() {
		clearTimeout(this.inputSettleTimer);
		this.inputSettleTimer = void 0;
		const pending = this.pendingInputTranscript;
		this.pendingInputTranscript = void 0;
		if (!pending) return;
		this.finalizedInputTranscriptKeys.add(pending.key);
		if (this.finalizedInputTranscriptKeys.size > 1024) {
			const oldest = this.finalizedInputTranscriptKeys.values().next().value;
			if (oldest !== void 0) this.finalizedInputTranscriptKeys.delete(oldest);
		}
		this.config.onTranscript?.("user", pending.text, true, { textMode: "snapshot" });
	}
	emitCompletedToolCall(item, event) {
		if (item?.type === "function_call" && (!item.status || item.status === "completed")) this.emitToolCallOnce({
			itemId: item.id ?? event.item_id,
			callId: item.call_id,
			name: item.name,
			rawArgs: item.arguments
		});
	}
	bufferCompletedToolCall(item, event) {
		if (item?.type !== "function_call" || item.status && item.status !== "completed") return;
		const itemId = item.id ?? event.item_id;
		if (!itemId) return;
		this.toolCallBuffers.set(itemId, {
			name: item.name ?? "",
			callId: item.call_id ?? "",
			args: item.arguments ?? ""
		});
	}
	appendAssistantTranscriptDelta(delta) {
		if (this.assistantTranscriptFinalized) {
			this.assistantTranscriptBuffer = "";
			this.assistantTranscriptFinalized = false;
		}
		this.assistantTranscriptBuffer += delta;
		this.config.onTranscript?.("assistant", delta, false);
	}
	flushAssistantTranscript(finalTranscript) {
		if (this.assistantTranscriptFinalized) return;
		const transcript = finalTranscript || this.assistantTranscriptBuffer;
		if (transcript) {
			this.config.onTranscript?.("assistant", transcript, true);
			this.assistantTranscriptFinalized = true;
		}
		this.assistantTranscriptBuffer = "";
	}
	resetAssistantTranscript() {
		this.assistantTranscriptBuffer = "";
		this.assistantTranscriptFinalized = false;
	}
	inputTranscriptKey(event) {
		return event.item_id ?? event.response_id ?? `speech-${this.inputSpeechSequence}`;
	}
	handleErrorEvent(error) {
		const detail = readXaiRealtimeErrorDetail(error);
		if (detail.startsWith("Conversation already has an active response in progress:")) {
			this.responseActive = true;
			this.responseCreateInFlight = false;
			this.responseCreatePending = true;
			return;
		}
		if (detail === "Cancellation failed: no active response found") {
			if (!this.responseCancelInFlight) return;
			this.responseActive = false;
			this.responseCancelInFlight = false;
			this.flushPendingResponseCreate();
			return;
		}
		this.config.onError?.(new Error(detail));
	}
	describeServerEvent(event) {
		if (event.type === "error" || event.type === "conversation.item.input_audio_transcription.failed") return readXaiRealtimeErrorDetail(event.error);
		if (event.type !== "response.done") return;
		const status = event.response?.status;
		const details = event.response?.status_details === void 0 ? void 0 : JSON.stringify(event.response.status_details);
		return [status ? `status=${status}` : void 0, details].filter(Boolean).join(" ") || void 0;
	}
};
//#endregion
//#region extensions/xai/realtime-voice-bridge.ts
var XaiRealtimeVoiceBridge = class extends XaiRealtimeVoiceEvents {
	constructor(config) {
		super(config);
		this.supportsToolResultContinuation = false;
		this.pendingToolResults = [];
		this.pendingUserMessages = [];
		this.sessionReadyFired = false;
		this.transport = new RealtimeVoiceWebSocketTransport({
			providerId: "xai",
			label: "xAI realtime voice",
			callbacks: config,
			lifecycle: new RealtimeVoiceSessionLifecycle("xAI"),
			resolveConnection: () => this.resolveConnectionParams(),
			createSocket: ({ url, headers }) => {
				const proxyAgent = proxyCaptureSdk.createDebugProxyWebSocketAgent(proxyCaptureSdk.resolveDebugProxySettings());
				return new WebSocket(url, {
					headers,
					maxPayload: XAI_REALTIME_WS_MAX_PAYLOAD_BYTES,
					...proxyAgent ? { agent: proxyAgent } : {}
				});
			},
			capture: proxyCaptureSdk.captureWsEventAsync,
			onOpen: () => {
				this.resetRealtimeSessionState({ preserveToolCallState: config.sessionResumption === true && this.conversationId !== null });
				this.sendEvent(this.buildSessionUpdate());
			},
			onEvent: (event, connection) => this.handleEvent(event, connection),
			onReset: () => this.resetTerminalState(),
			startupError: (error) => error instanceof Error ? error : new Error(readXaiRealtimeErrorDetail(error)),
			fatalEventError: (error) => error instanceof XaiRealtimeMalformedAudioError ? {
				code: 1002,
				reason: "Malformed audio payload"
			} : error instanceof XaiRealtimePlaybackMarkOverflowError ? {
				code: 1002,
				reason: "Playback mark overflow"
			} : void 0,
			reconnectBlocked: () => this.reconnectBlockReason(),
			maxReconnectAttempts: 5,
			reconnectDelayMs: XAI_REALTIME_BASE_RECONNECT_DELAY_MS,
			connectTimeoutMs: XAI_REALTIME_CONNECT_TIMEOUT_MS
		});
	}
	connect() {
		return this.transport.connect();
	}
	sendAudio(audio) {
		if (this.transport.lifecycle.phase() === "terminal") return;
		if (!this.isConnected()) {
			this.transport.lifecycle.enqueuePendingAudio(audio);
			return;
		}
		this.sendEvent({
			type: "input_audio_buffer.append",
			audio: audio.toString("base64")
		});
	}
	setMediaTimestamp(ts) {
		this.latestMediaTimestamp = ts;
	}
	sendUserMessage(text) {
		if (this.transport.lifecycle.phase() === "terminal") return;
		if (!this.isConnected()) {
			if (this.pendingUserMessages.length < 128) this.pendingUserMessages.push(text);
			else this.config.onError?.(/* @__PURE__ */ new Error("xAI realtime voice pending user message queue overflow during reconnect"));
			return;
		}
		this.sendUserMessageNow(text);
	}
	triggerGreeting(instructions) {
		if (this.isConnected() && this.transport.socket) this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the user.");
	}
	submitToolResult(callId, result, options) {
		if (this.transport.lifecycle.phase() === "terminal" || options?.willContinue === true) return;
		if (!this.isConnected()) {
			let serialized;
			try {
				serialized = serializeXaiRealtimeToolResult(result);
			} catch (error) {
				this.config.onError?.(error);
				throw error;
			}
			if (this.pendingToolResults.length >= 128) {
				const error = /* @__PURE__ */ new Error("xAI realtime voice pending tool result queue overflow during reconnect");
				this.config.onError?.(error);
				throw error;
			}
			this.pendingToolResults.push({
				callId,
				result: JSON.parse(serialized),
				...options ? { options } : {}
			});
			return;
		}
		this.submitToolResultNow(callId, result, options);
	}
	close() {
		this.transport.close();
	}
	isConnected() {
		return this.transport.isConnected();
	}
	async resolveConnectionParams() {
		const apiKey = this.config.resolveApiKey ? await this.config.resolveApiKey() : await resolveXaiRealtimeApiKey(this.config.apiKey, this.config.cfg, this.config.agentId);
		const model = this.config.model ?? "grok-voice-latest";
		return {
			url: toXaiRealtimeWsUrl(this.config.baseUrl, model, this.config.sessionResumption === true ? this.conversationId ?? void 0 : void 0),
			headers: {
				Authorization: `Bearer ${apiKey}`,
				...xaiUserAgentHeaderFor(this.config.baseUrl)
			}
		};
	}
	reconnectBlockReason() {
		if (this.config.sessionResumption !== true) return "sessionResumption=false";
		if (this.pendingToolResultAcks.size > 0) return `unacknowledgedToolResults=${this.pendingToolResultAcks.size}`;
		if (!this.conversationId) return "missingConversationId=true";
	}
	acceptsEvent(connection) {
		return this.transport.lifecycle.acceptsEvents(connection);
	}
	onSessionUpdated(connection) {
		if (!this.transport.lifecycle.ready(connection)) return;
		for (const chunk of this.transport.lifecycle.drainPendingAudio()) this.sendAudio(chunk);
		for (const pending of this.pendingToolResults.splice(0)) this.submitToolResultNow(pending.callId, pending.result, pending.options);
		for (const message of this.pendingUserMessages.splice(0)) this.sendUserMessageNow(message);
		if (!this.sessionReadyFired) {
			this.sessionReadyFired = true;
			this.config.onReady?.();
		}
	}
	sendEvent(event, detail) {
		this.transport.send(event, detail);
	}
	resetTerminalState() {
		this.pendingToolResults = [];
		this.pendingUserMessages = [];
		this.conversationId = null;
		this.resetRealtimeSessionState();
	}
};
//#endregion
//#region extensions/xai/realtime-voice-provider.ts
function buildXaiRealtimeVoiceProvider() {
	return {
		...createXaiRealtimeVoiceProviderMetadata(),
		createBridge: (req) => {
			const config = normalizeXaiRealtimeProviderConfig(req.providerConfig);
			assertXaiRealtimeVoiceRequestSupported(req);
			return new XaiRealtimeVoiceBridge({
				...req,
				apiKey: config.apiKey,
				baseUrl: normalizeXaiRealtimeBaseUrl(config.baseUrl),
				model: config.model,
				voice: config.voice,
				vadThreshold: config.vadThreshold,
				silenceDurationMs: config.silenceDurationMs,
				prefixPaddingMs: config.prefixPaddingMs,
				reasoningEffort: config.reasoningEffort,
				sessionResumption: config.sessionResumption,
				resolveApiKey: () => resolveXaiRealtimeApiKey(config.apiKey, req.cfg, req.agentId)
			});
		}
	};
}
//#endregion
export { buildXaiRealtimeVoiceProvider };
