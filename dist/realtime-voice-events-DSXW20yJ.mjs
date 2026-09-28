import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { j as normalizeRealtimeVoiceResponseOutcome } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { i as readRealtimeErrorDetail } from "./realtime-provider-shared-CvSijJ_n.mjs";
import { O as readRealtimeErrorEventId, S as isOpenAIRealtimeMaxSessionDurationError } from "./realtime-voice-session-policy-BGXV2brx.mjs";
import { t as OpenAIRealtimeProtocol } from "./realtime-voice-protocol-DlwPzElq.mjs";
//#region extensions/openai/realtime-voice-events.ts
var OpenAIRealtimeMalformedAudioError = class extends Error {};
function base64ToBuffer(b64) {
	const canonicalAudio = canonicalizeBase64(b64);
	if (!canonicalAudio) throw new OpenAIRealtimeMalformedAudioError("OpenAI realtime stream returned malformed base64 audio data");
	return Buffer.from(canonicalAudio, "base64");
}
var OpenAIRealtimeEvents = class extends OpenAIRealtimeProtocol {
	handleEvent(event, connection) {
		const emitServerEvent = () => this.config.onEvent?.({
			direction: "server",
			type: event.type,
			detail: this.describeServerEvent(event),
			...event.item_id ? { itemId: event.item_id } : {},
			...event.response_id ?? event.response?.id ? { responseId: event.response_id ?? event.response?.id } : {}
		});
		if (event.type === "error" && isOpenAIRealtimeMaxSessionDurationError(readRealtimeErrorDetail(event.error))) {
			this.rotateExpiredSession();
			return;
		}
		if (event.type === "response.done") {
			this.handleResponseDone(event, connection, emitServerEvent);
			return;
		}
		if (event.type === "response.cancelled") {
			try {
				emitServerEvent();
			} finally {
				this.releaseResponseState();
			}
			return;
		}
		if (event.type === "response.created") {
			this.outputAudioGeneration += 1;
			this.responseActive = true;
			this.responseCreateState = "idle";
		}
		const audioGeneration = this.outputAudioGeneration;
		emitServerEvent();
		if (!this.acceptsEvent(connection)) return;
		switch (event.type) {
			case "session.created": return;
			case "session.updated":
				this.onSessionUpdated(connection);
				return;
			case "conversation.output_audio.delta":
			case "response.audio.delta":
			case "response.output_audio.delta": {
				const audioDelta = event.delta ?? event.data;
				if (!audioDelta || this.responseCancelInFlight || audioGeneration !== this.outputAudioGeneration) return;
				const audio = base64ToBuffer(audioDelta);
				if (event.item_id && event.item_id !== this.assistantAudioItem?.itemId) this.assistantAudioItem = {
					itemId: event.item_id,
					bytes: audio.byteLength,
					startTimestamp: this.latestMediaTimestamp
				};
				else if (this.assistantAudioItem) this.assistantAudioItem.bytes += audio.byteLength;
				this.responseActive = true;
				const generation = this.outputAudioGeneration;
				const markName = this.createPlaybackMark();
				this.config.onAudio(audio, event.item_id ? { itemId: event.item_id } : void 0);
				if (generation === this.outputAudioGeneration && this.acceptsEvent(connection)) this.config.onMark?.(markName, () => {
					if (this.acceptsEvent(connection)) this.acknowledgeMark(markName);
				});
				return;
			}
			case "input_audio_buffer.speech_started":
				if (this.config.interruptResponseOnInputAudio ?? this.config.autoRespondToAudio ?? true) this.handleBargeIn();
				return;
			case "conversation.output_transcript.delta":
			case "response.text.delta":
			case "response.output_text.delta":
			case "response.audio_transcript.delta":
			case "response.output_audio_transcript.delta":
				if (event.delta) this.config.onTranscript?.("assistant", event.delta, false);
				return;
			case "response.text.done":
			case "response.output_text.done":
			case "response.audio_transcript.done":
			case "response.output_audio_transcript.done":
				{
					const transcript = event.transcript ?? event.text;
					if (transcript) this.config.onTranscript?.("assistant", transcript, true);
				}
				return;
			case "conversation.input_transcript.delta":
			case "conversation.item.input_audio_transcription.delta":
				if (event.delta) this.config.onTranscript?.("user", event.delta, false);
				return;
			case "conversation.item.input_audio_transcription.completed":
				if (event.transcript) this.config.onTranscript?.("user", event.transcript, true);
				return;
			case "conversation.item.input_audio_transcription.failed":
				this.config.onError?.(new Error(readRealtimeErrorDetail(event.error)));
				break;
			case "conversation.item.added": break;
			case "response.function_call_arguments.delta":
			case "response.function_call_arguments.done":
			case "conversation.item.done": return;
			case "error": {
				const detail = readRealtimeErrorDetail(event.error);
				const error = isRecord(event.error) ? event.error : void 0;
				const rejectedEventId = readRealtimeErrorEventId(event.error) ?? (this.responseCreateState === "in-flight" && error?.type === "invalid_request_error" && typeof error.param === "string" && (error.param === "response" || error.param.startsWith("response.")) ? this.manualResponseCreateEventId ?? this.standaloneSpeechEventId : void 0);
				const rejectsStandaloneSpeech = this.standaloneSpeechEventId !== null && rejectedEventId === this.standaloneSpeechEventId;
				const rejectsManualResponseCreate = this.manualResponseCreateEventId !== null && rejectedEventId === this.manualResponseCreateEventId;
				if (rejectsManualResponseCreate && detail.startsWith("Conversation already has an active response in progress:")) {
					this.responseActive = true;
					this.responseCreateState = "idle";
					this.manualResponseCreateEventId = null;
					this.responseCreatePending = true;
					return;
				}
				const rejectsManualResponseCancel = this.manualResponseCancelEventId !== null && readRealtimeErrorEventId(event.error) === this.manualResponseCancelEventId;
				if (detail === "Cancellation failed: no active response found") {
					if (!rejectsManualResponseCancel) return;
					this.responseActive = false;
					this.responseCancelInFlight = false;
					this.manualResponseCancelEventId = null;
					if (this.responseCreatePending) this.flushPendingResponseCreate();
					else this.restoreAutoRespondAfterManualResponse();
					return;
				}
				if (rejectsManualResponseCreate || rejectsStandaloneSpeech) {
					this.handleResponseDone({
						type: "response.done",
						response: {
							status: "failed",
							status_details: { error: event.error }
						}
					}, connection, () => this.config.onError?.(new Error(detail)));
					return;
				}
				this.config.onError?.(new Error(detail));
			}
		}
	}
	handleCompletedResponse(event, connection) {
		if (event.response?.status !== "completed" || !Array.isArray(event.response.output) || !this.config.onToolCall) return false;
		for (const output of event.response.output) {
			if (!this.acceptsEvent(connection) || !this.isTransportOpen()) return true;
			if (!isRecord(output) || output.type !== "function_call" || output.status !== void 0 && output.status !== "completed") continue;
			const itemId = typeof output.id === "string" ? output.id.trim() || void 0 : void 0;
			const callId = typeof output.call_id === "string" ? output.call_id.trim() : "";
			const name = typeof output.name === "string" ? output.name.trim() : "";
			if (!callId || !name || this.completedToolCallIds.has(callId)) continue;
			if (this.completedToolCallIds.size >= OpenAIRealtimeProtocol.MAX_COMPLETED_TOOL_CALL_IDS) {
				this.failToolCallSessionLimit(/* @__PURE__ */ new Error(`OpenAI realtime tool-call session limit exceeded (${OpenAIRealtimeProtocol.MAX_COMPLETED_TOOL_CALL_IDS})`), connection);
				return true;
			}
			this.completedToolCallIds.add(callId);
			this.pendingToolCallIds.add(callId);
			if (typeof output.arguments !== "string") {
				this.rejectToolCallArguments({
					itemId,
					callId,
					reason: "invalid-json-type",
					message: "Invalid tool arguments: expected a JSON object."
				});
				continue;
			}
			const rawArgs = output.arguments;
			if (Buffer.byteLength(rawArgs, "utf8") > OpenAIRealtimeProtocol.MAX_TOOL_ARGUMENT_BYTES) {
				this.rejectToolCallArguments({
					itemId,
					callId,
					reason: "too-large",
					message: `Realtime tool arguments exceed the ${OpenAIRealtimeProtocol.MAX_TOOL_ARGUMENT_BYTES}-byte UTF-8 limit`
				});
				continue;
			}
			let args;
			try {
				args = JSON.parse(rawArgs || "{}");
			} catch {
				this.rejectToolCallArguments({
					itemId,
					callId,
					reason: "malformed-json",
					message: "Invalid tool arguments: expected a JSON object."
				});
				continue;
			}
			if (!isRecord(args)) {
				this.rejectToolCallArguments({
					itemId,
					callId,
					reason: "non-object-json",
					message: "Invalid tool arguments: expected a JSON object."
				});
				continue;
			}
			this.config.onToolCall({
				itemId: itemId ?? callId,
				callId,
				name,
				args
			});
		}
		return false;
	}
	handleResponseDone(event, connection, emitServerEvent) {
		const outcome = normalizeRealtimeVoiceResponseOutcome({
			providerLabel: "OpenAI realtime voice",
			response: event.response,
			responseId: event.response_id
		});
		let callbackError;
		let providerTerminated = false;
		const invoke = (callback) => {
			try {
				callback();
			} catch (error) {
				callbackError ??= error;
			}
		};
		try {
			invoke(() => {
				providerTerminated = this.handleCompletedResponse(event, connection);
			});
			invoke(() => this.config.onResponseDone?.(outcome));
			invoke(emitServerEvent);
		} finally {
			const canDrain = !providerTerminated && this.acceptsEvent(connection) && this.isTransportOpen();
			this.releaseResponseState({ drain: canDrain });
		}
		if (callbackError) throw callbackError instanceof Error ? callbackError : new Error("OpenAI realtime response callback failed", { cause: callbackError });
	}
	rejectToolCallArguments(params) {
		this.config.onEvent?.({
			direction: "server",
			type: "tool_call.arguments.rejected",
			detail: `reason=${params.reason}`,
			itemId: params.itemId
		});
		this.submitToolResult(params.callId, { error: params.message });
	}
	describeServerEvent(event) {
		if (event.type === "error" || event.type === "conversation.item.input_audio_transcription.failed") return readRealtimeErrorDetail(event.error);
		if (event.type === "session.created" || event.type === "session.updated") {
			const session = isRecord(event.session) ? event.session : void 0;
			const tools = Array.isArray(session?.tools) ? session.tools.length : 0;
			const rawToolChoice = session?.tool_choice;
			return `tools=${tools} toolChoice=${typeof rawToolChoice === "string" ? rawToolChoice : isRecord(rawToolChoice) && typeof rawToolChoice.type === "string" ? rawToolChoice.type : "unset"}`;
		}
		if ((event.type === "conversation.item.added" || event.type === "conversation.item.done") && event.item?.type) return [`itemType=${event.item.type}`, event.item.name ? `name=${event.item.name}` : void 0].filter(Boolean).join(" ");
		if (event.type === "response.done") {
			const status = event.response?.status;
			const details = event.response?.status_details === void 0 ? void 0 : JSON.stringify(event.response.status_details);
			return [status ? `status=${status}` : void 0, details].filter(Boolean).join(" ") || void 0;
		}
		if (event.type === "response.cancelled") return "cancelled";
	}
};
//#endregion
export { OpenAIRealtimeMalformedAudioError as n, OpenAIRealtimeEvents as t };
