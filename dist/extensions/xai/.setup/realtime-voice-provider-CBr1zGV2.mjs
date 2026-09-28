import { C as XAI_REALTIME_WS_MAX_PAYLOAD_BYTES, D as serializeXaiRealtimeToolResult, E as readXaiRealtimeErrorDetail, O as toXaiRealtimeWsUrl, T as normalizeXaiRealtimeProviderConfig, _ as XAI_REALTIME_CONNECT_TIMEOUT_MS, b as XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, g as XAI_REALTIME_BASE_RECONNECT_DELAY_MS, s as assertXaiRealtimeVoiceRequestSupported, w as normalizeXaiRealtimeBaseUrl, x as XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS } from "./capability-provider-metadata-factory-VkSZouOh.mjs";
import { t as createXaiRealtimeVoiceProviderMetadata } from "./capability-provider-metadata-HN_SpLri.mjs";
import { t as xaiUserAgentHeaderFor } from "./xai-user-agent-82PmYLBQ.mjs";
import { t as WebSocket } from "./ws-runtime-BC0VsR8N.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, RealtimeVoiceSessionLifecycle, canonicalizeBase64, normalizeRealtimeVoiceResponseOutcome, realtimeVoiceAudioDurationMs, toOpenAICompatibleRealtimeAudioFormat } from "openclaw/plugin-sdk/realtime-voice-provider";
import { resolveAgentDir } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { randomUUID } from "node:crypto";
import { toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { captureWsEvent, createDebugProxyWebSocketAgent, resolveDebugProxySettings } from "openclaw/plugin-sdk/proxy-capture";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
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
		this.continuingToolCallIds = /* @__PURE__ */ new Set();
		this.pendingToolCallIds = /* @__PURE__ */ new Set();
		this.latestMediaTimestamp = 0;
		this.outputAudioGeneration = 0;
		this.interruptingPlayback = false;
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
		this.continuingToolCallIds.delete(callId);
		this.pendingToolCallIds.delete(callId);
		if (options?.suppressResponse !== true) this.flushPendingResponseCreateAfterToolResults();
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
		if (this.interruptingPlayback) return;
		this.interruptingPlayback = true;
		try {
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
			this.outputAudioGeneration += 1;
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
		} finally {
			this.interruptingPlayback = false;
		}
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
	flushPendingResponseCreateAfterToolResults() {
		if (this.pendingToolCallIds.size > 0 || this.continuingToolCallIds.size > 0) {
			this.responseCreatePending = true;
			return;
		}
		this.requestResponseCreate();
	}
	requestResponseCreate() {
		if (this.interruptingPlayback || this.responseActive || this.responseCreateInFlight || this.responseCancelInFlight || this.markQueue.length > 0 || this.continuingToolCallIds.size > 0 || this.pendingToolCallIds.size > 0) {
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
		this.outputAudioGeneration += 1;
		this.markQueue = [];
		this.responseActive = false;
		this.responseCreateInFlight = false;
		this.responseCancelInFlight = false;
		this.responseCreatePending = false;
		this.assistantAudioItem = null;
		this.resetInputTranscripts();
		if (!options.preserveToolCallState) {
			this.continuingToolCallIds.clear();
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
var XaiRealtimeVoiceEvents = class extends XaiRealtimeVoiceProtocol {
	constructor(..._args) {
		super(..._args);
		this.assistantTranscriptBuffer = "";
		this.assistantTranscriptFinalized = false;
		this.finalizedToolCallItems = /* @__PURE__ */ new Set();
		this.inputTranscriptReplacements = /* @__PURE__ */ new Map();
	}
	handleEvent(event, connection) {
		if (event.type === "response.created" && this.acceptsEvent(connection)) {
			this.outputAudioGeneration += 1;
			this.responseActive = true;
			this.responseCreateInFlight = false;
			this.markQueue = [];
			this.assistantAudioItem = null;
			this.resetAssistantTranscript();
		}
		const audioGeneration = this.outputAudioGeneration;
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
				if (!audioDelta || this.responseCancelInFlight || audioGeneration !== this.outputAudioGeneration) return;
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
				if (audioGeneration === this.outputAudioGeneration && this.acceptsEvent(connection)) this.config.onMark?.(markName, () => {
					if (this.acceptsEvent(connection)) this.acknowledgeMark(markName);
				});
				return;
			}
			case "input_audio_buffer.speech_started":
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
				if (transcript) this.config.onTranscript?.("user", transcript, true);
				return;
			}
			case "conversation.item.input_audio_transcription.failed":
				this.inputTranscriptReplacements.delete(this.inputTranscriptKey(event));
				this.config.onError?.(new Error(readXaiRealtimeErrorDetail(event.error)));
				return;
			case "response.done": {
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
				let callbackError;
				const invoke = (callback) => {
					try {
						callback();
					} catch (error) {
						callbackError ??= error;
					}
				};
				try {
					invoke(() => {
						if (outcome.status === "completed") {
							for (const [itemId, toolCall] of this.toolCallBuffers) {
								if (!this.acceptsEvent(connection)) return;
								this.emitToolCallOnce({
									itemId,
									callId: toolCall.callId,
									name: toolCall.name,
									rawArgs: toolCall.args
								});
							}
							for (const item of output) {
								if (!this.acceptsEvent(connection)) return;
								this.emitCompletedToolCall(item, event);
							}
						}
						if (!this.acceptsEvent(connection)) return;
						const terminalTranscript = output.filter((item) => item.type === "message" && item.role === "assistant").flatMap((item) => Array.isArray(item.content) ? item.content.filter(isRecord) : []).map((content) => typeof content.transcript === "string" ? content.transcript : typeof content.text === "string" ? content.text : "").join("");
						this.flushAssistantTranscript(terminalTranscript);
					});
					invoke(() => this.config.onResponseDone?.(outcome));
					invoke(emitBridgeEvent);
				} finally {
					this.responseActive = false;
					this.responseCreateInFlight = false;
					this.responseCancelInFlight = false;
					this.toolCallBuffers.clear();
					this.finalizedToolCallItems.clear();
					this.flushPendingResponseCreate();
				}
				if (callbackError) throw callbackError instanceof Error ? callbackError : new Error("xAI realtime response callback failed", { cause: callbackError });
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
		this.inputTranscriptReplacements.clear();
		this.finalizedToolCallItems.clear();
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
		return event.item_id ?? event.response_id ?? "default";
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
	constructor(..._args) {
		super(..._args);
		this.supportsToolResultContinuation = false;
		this.ws = null;
		this.terminalError = null;
		this.lifecycle = new RealtimeVoiceSessionLifecycle("xAI");
		this.pendingToolResults = [];
		this.pendingUserMessages = [];
		this.connectionUrl = "";
		this.flowId = randomUUID();
		this.sessionReadyFired = false;
	}
	async connect() {
		if (this.terminalError) throw this.terminalError;
		await this.lifecycle.connect((connection) => this.doConnect(connection));
	}
	sendAudio(audio) {
		if (this.lifecycle.phase() === "terminal") return;
		if (!this.isConnected()) {
			this.lifecycle.enqueuePendingAudio(audio);
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
		if (this.lifecycle.phase() === "terminal") return;
		if (!this.canSubmitInput()) {
			if (this.pendingUserMessages.length < 128) this.pendingUserMessages.push(text);
			else this.config.onError?.(/* @__PURE__ */ new Error("xAI realtime voice pending user message queue overflow during reconnect"));
			return;
		}
		this.sendUserMessageNow(text);
	}
	triggerGreeting(instructions) {
		if (this.isConnected() && this.ws) this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the user.");
	}
	submitToolResult(callId, result, options) {
		if (this.lifecycle.phase() === "terminal" || options?.willContinue === true) return;
		if (!this.canSubmitInput()) {
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
		const connection = this.lifecycle.currentConnection();
		if (!this.lifecycle.cancel()) return;
		this.resetTerminalState();
		if (!connection) return;
		const ws = this.ws;
		this.ws = null;
		if (ws?.readyState !== WebSocket.CLOSED) ws?.close(1e3, "Bridge closed");
		this.notifyClose(connection, "completed");
	}
	isConnected() {
		return this.lifecycle.isReady() && this.ws?.readyState === WebSocket.OPEN;
	}
	async doConnect(connection) {
		let activeWs;
		const attempt = this.lifecycle.createConnectAttempt({
			connection,
			timeoutMs: XAI_REALTIME_CONNECT_TIMEOUT_MS,
			timeoutError: () => /* @__PURE__ */ new Error("xAI realtime voice connection timeout"),
			onTimeout: () => activeWs?.terminate(),
			onAbort: (outcome) => {
				if (outcome !== "error" && activeWs && activeWs.readyState !== WebSocket.CLOSED) activeWs.close(1e3, "connection canceled");
			}
		});
		const openWebSocket = (resolvedConnection) => {
			if (attempt.settled) return;
			if (!this.lifecycle.isCurrent(connection) || connection.signal.aborted) {
				attempt.resolve();
				return;
			}
			attempt.startTimeout();
			const { url, headers } = resolvedConnection;
			this.connectionUrl = url;
			const proxyAgent = createDebugProxyWebSocketAgent(resolveDebugProxySettings());
			const ws = new WebSocket(url, {
				headers,
				maxPayload: XAI_REALTIME_WS_MAX_PAYLOAD_BYTES,
				...proxyAgent ? { agent: proxyAgent } : {}
			});
			activeWs = ws;
			this.ws = ws;
			const rejectStartup = (error) => {
				if (!attempt.rejectStartup(error)) return;
				if (ws.readyState !== WebSocket.CLOSED) ws.close(1e3, "startup failed");
			};
			ws.on("open", () => {
				if (!this.lifecycle.acceptsEvents(connection)) {
					ws.close(1e3, "stale connection");
					return;
				}
				this.resetRealtimeSessionState({ preserveToolCallState: this.config.sessionResumption === true && this.conversationId !== null });
				captureWsEvent({
					url,
					direction: "local",
					kind: "ws-open",
					flowId: this.flowId,
					meta: {
						provider: "xai",
						capability: "realtime-voice"
					}
				});
				this.sendEvent(this.buildSessionUpdate());
			});
			ws.on("message", (data) => {
				if (!this.lifecycle.acceptsEvents(connection) || this.ws !== ws) return;
				if (attempt.settled && !attempt.ready) return;
				captureWsEvent({
					url,
					direction: "inbound",
					kind: "ws-frame",
					flowId: this.flowId,
					payload: data,
					meta: {
						provider: "xai",
						capability: "realtime-voice"
					}
				});
				try {
					const event = JSON.parse(data.toString());
					if (event.type === "error" && !attempt.ready) {
						rejectStartup(new Error(readXaiRealtimeErrorDetail(event.error)));
						return;
					}
					this.handleEvent(event, connection);
					if (event.type === "session.updated" && this.lifecycle.isCurrent(connection) && this.lifecycle.isReady()) attempt.resolve(true);
				} catch (error) {
					if (error instanceof XaiRealtimeMalformedAudioError || error instanceof XaiRealtimePlaybackMarkOverflowError) {
						attempt.reject(error);
						this.failConnection(error, ws, connection);
						return;
					}
					console.error("[xai] realtime event parse failed:", error);
				}
			});
			ws.on("error", (error) => {
				if (!this.lifecycle.acceptsEvents(connection) || this.ws !== ws) return;
				captureWsEvent({
					url,
					direction: "local",
					kind: "error",
					flowId: this.flowId,
					errorText: error instanceof Error ? error.message : String(error),
					meta: {
						provider: "xai",
						capability: "realtime-voice"
					}
				});
				if (!attempt.ready) {
					rejectStartup(toStringifiedError(error));
					return;
				}
				this.config.onError?.(toStringifiedError(error));
			});
			ws.on("close", (code, reasonBuffer) => {
				captureWsEvent({
					url,
					direction: "local",
					kind: "ws-close",
					flowId: this.flowId,
					closeCode: typeof code === "number" ? code : void 0,
					meta: {
						provider: "xai",
						capability: "realtime-voice",
						reason: Buffer.isBuffer(reasonBuffer) && reasonBuffer.length > 0 ? reasonBuffer.toString("utf8") : void 0
					}
				});
				if (!this.lifecycle.isCurrent(connection)) return;
				if (this.ws === ws) this.ws = null;
				if (attempt.startupFailed) return;
				if (this.terminalError) {
					this.notifyClose(connection, "error");
					return;
				}
				if (this.lifecycle.terminalOutcome(connection) === "completed") {
					attempt.resolve();
					this.notifyClose(connection, "completed");
					return;
				}
				if (!attempt.ready && !attempt.settled) {
					attempt.reject(/* @__PURE__ */ new Error("xAI realtime voice connection closed before ready"));
					return;
				}
				this.attemptReconnect("websocket-close", connection);
			});
		};
		this.resolveConnectionParams().then(openWebSocket).catch((error) => {
			if (!this.lifecycle.isCurrent(connection) || this.lifecycle.terminalOutcome(connection) === "completed") {
				attempt.resolve();
				return;
			}
			attempt.reject(toStringifiedError(error));
		});
		await attempt.promise;
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
	async attemptReconnect(reason, connection) {
		const blocked = this.reconnectBlockReason();
		if (blocked) {
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.blocked",
				detail: `reason=${reason} ${blocked}`
			});
			this.enterTerminalState(connection);
			return;
		}
		const retry = this.lifecycle.retry(connection, 5);
		if (!retry) return;
		if (retry === "exhausted") {
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.exhausted",
				detail: `reason=${reason} attempts=5`
			});
			this.enterTerminalState(connection);
			return;
		}
		const attempt = retry.attempt;
		const delay = XAI_REALTIME_BASE_RECONNECT_DELAY_MS * 2 ** (attempt - 1);
		this.config.onEvent?.({
			direction: "client",
			type: "session.reconnect.scheduled",
			detail: `reason=${reason} attempt=${attempt} delayMs=${delay}`
		});
		try {
			await sleepWithAbort(delay, retry.signal);
		} catch (error) {
			if (!retry.signal.aborted) throw error;
			return;
		}
		const nextConnection = this.lifecycle.reconnect(connection);
		if (!nextConnection) return;
		try {
			await this.doConnect(nextConnection);
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.ready",
				detail: `reason=${reason} attempt=${attempt}`
			});
		} catch (error) {
			if (this.terminalError || !this.lifecycle.isCurrent(nextConnection) || this.lifecycle.terminalOutcome(nextConnection)) return;
			this.config.onError?.(toStringifiedError(error));
			await this.attemptReconnect(reason, nextConnection);
		}
	}
	reconnectBlockReason() {
		if (this.config.sessionResumption !== true) return "sessionResumption=false";
		if (this.pendingToolResultAcks.size > 0) return `unacknowledgedToolResults=${this.pendingToolResultAcks.size}`;
		if (!this.conversationId) return "missingConversationId=true";
	}
	acceptsEvent(connection) {
		return this.lifecycle.acceptsEvents(connection);
	}
	onSessionUpdated(connection) {
		if (!this.lifecycle.ready(connection)) return;
		for (const chunk of this.lifecycle.drainPendingAudio()) this.sendAudio(chunk);
		for (const pending of this.pendingToolResults.splice(0)) this.submitToolResultNow(pending.callId, pending.result, pending.options);
		for (const message of this.pendingUserMessages.splice(0)) this.sendUserMessageNow(message);
		if (!this.sessionReadyFired) {
			this.sessionReadyFired = true;
			this.config.onReady?.();
		}
	}
	sendEvent(event, detail) {
		const ws = this.ws;
		if (ws?.readyState !== WebSocket.OPEN) return;
		const type = event && typeof event === "object" && typeof event.type === "string" ? event.type : "unknown";
		const payload = JSON.stringify(event);
		captureWsEvent({
			url: this.connectionUrl,
			direction: "outbound",
			kind: "ws-frame",
			flowId: this.flowId,
			payload,
			meta: {
				provider: "xai",
				capability: "realtime-voice"
			}
		});
		ws.send(payload);
		this.config.onEvent?.({
			direction: "client",
			type,
			...detail ? { detail } : {}
		});
	}
	canSubmitInput() {
		return this.isConnected();
	}
	failConnection(error, ws, connection) {
		if (!this.lifecycle.failure(connection)) return;
		this.terminalError = error;
		this.resetTerminalState();
		try {
			this.config.onError?.(error);
		} finally {
			if (ws.readyState !== WebSocket.CLOSED) ws.close(1002, error instanceof XaiRealtimePlaybackMarkOverflowError ? "Playback mark overflow" : "Malformed audio payload");
			else this.notifyClose(connection, "error");
		}
	}
	enterTerminalState(connection) {
		if (this.lifecycle.failure(connection)) this.resetTerminalState();
		this.notifyClose(connection, "error");
	}
	notifyClose(connection, outcome) {
		const terminalOutcome = this.lifecycle.close(connection, outcome);
		if (!terminalOutcome) return;
		this.resetTerminalState();
		this.config.onClose?.(terminalOutcome);
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
