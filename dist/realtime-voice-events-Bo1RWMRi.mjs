import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { j as normalizeRealtimeVoiceResponseOutcome } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { v as readXaiRealtimeErrorDetail } from "./realtime-voice-config-BZr_Tp5F.mjs";
import { n as XaiRealtimeVoiceProtocol } from "./realtime-voice-protocol-CQ-Fka4Z.mjs";
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
export { XaiRealtimeVoiceEvents as n, XaiRealtimeMalformedAudioError as t };
