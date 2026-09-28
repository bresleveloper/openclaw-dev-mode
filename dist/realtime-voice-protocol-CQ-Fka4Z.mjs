import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { M as realtimeVoiceAudioDurationMs, N as toOpenAICompatibleRealtimeAudioFormat, k as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { c as XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, l as XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS, y as serializeXaiRealtimeToolResult } from "./realtime-voice-config-BZr_Tp5F.mjs";
import { randomUUID } from "node:crypto";
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
export { XaiRealtimeVoiceProtocol as n, XaiRealtimePlaybackMarkOverflowError as t };
