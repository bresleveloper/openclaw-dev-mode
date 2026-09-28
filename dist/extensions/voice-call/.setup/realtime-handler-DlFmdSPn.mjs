import { d as REALTIME_VOICE_END_CALL_TOOL_NAME, s as resolveVoiceCallPublicPathPrefix } from "./config-72FnMWHb.mjs";
import { c as canonicalizeVoiceCallMediaBase64, o as WebSocket, s as WebSocketServer } from "./runtime-entry-dDRm6RgA.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { asNullableRecord, asOptionalObjectRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, buildRealtimeVoiceAgentConsultWorkingResponse, buildRealtimeVoiceAgentErrorProviderResult, calculateMulawRms, createRealtimeVoiceSessionHarness, createSpeechThresholdGate, readRealtimeVoiceConsultQuestion, readSpeakableRealtimeVoiceToolResult, resolveRealtimeVoiceBargeIn, resolveRealtimeVoiceSessionPolicy } from "openclaw/plugin-sdk/realtime-voice";
import { normalizeWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
import { isFutureDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { randomUUID } from "node:crypto";
import { sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import "node:http";
//#region extensions/voice-call/src/webhook/realtime-audio-pacer.ts
const TELEPHONY_SAMPLE_RATE = 8e3;
const TELEPHONY_CHUNK_BYTES = 160;
const LEAD_MS = 160;
const DEFAULT_MAX_QUEUED_AUDIO_BYTES = TELEPHONY_SAMPLE_RATE * 120;
const QUEUE_COMPACT_HEAD_THRESHOLD = 256;
const MAX_PLAYBACK_SEGMENTS = 128;
const MAX_PENDING_MARK_BOUNDARIES = 64;
/** Paces outgoing mulaw audio frames at telephony cadence. */
var RealtimeAudioPacer = class {
	constructor(params) {
		this.params = params;
		this.queue = [];
		this.queueHead = 0;
		this.timer = null;
		this.queuedAudioBytes = 0;
		this.closed = false;
		this.streamClockMs = null;
		this.playbackSegments = [];
		this.sentAudioMs = 0;
		this.retiredAudioMs = 0;
		this.confirmedPlayedMs = 0;
		this.playbackMarkPrefix = `openclaw-playout-${randomUUID()}`;
		this.playbackMarkSequence = 0;
		this.lastPlaybackMarkMs = 0;
		this.markBoundaries = [];
		this.retiredItemOffsets = /* @__PURE__ */ new Map();
	}
	/** Queue mulaw audio and split it into 20ms-ish telephony chunks. */
	sendAudio(muLaw, metadata) {
		if (this.closed || muLaw.length === 0) return;
		const maxQueuedAudioBytes = this.params.maxQueuedAudioBytes ?? DEFAULT_MAX_QUEUED_AUDIO_BYTES;
		for (let offset = 0; offset < muLaw.length; offset += TELEPHONY_CHUNK_BYTES) {
			const chunk = Buffer.from(muLaw.subarray(offset, offset + TELEPHONY_CHUNK_BYTES));
			if (this.queuedAudioBytes + chunk.length > maxQueuedAudioBytes) {
				this.failBackpressure();
				return;
			}
			const durationMs = chunk.length / 8;
			const segment = this.extendPlaybackSegment(metadata?.itemId, durationMs);
			if (!segment) {
				this.failBackpressure();
				return;
			}
			this.queue.push({
				type: "audio",
				chunk,
				durationMs,
				segment
			});
			this.queuedAudioBytes += chunk.length;
		}
		this.ensurePump();
	}
	/**
	* Retained provider items in playback order with consumed playout duration.
	* Queued audio has not reached the telephony line, so unplayed items report zero.
	*/
	getPlaybackState() {
		let remaining = Math.max(0, this.confirmedPlayedMs - this.retiredAudioMs);
		const playedByItem = /* @__PURE__ */ new Map();
		for (const segment of this.playbackSegments) {
			const consumed = Math.min(remaining, segment.sentMs);
			remaining -= consumed;
			if (segment.itemId !== void 0) {
				const previousMs = playedByItem.get(segment.itemId) ?? this.retiredItemOffsets.get(segment.itemId) ?? 0;
				playedByItem.set(segment.itemId, previousMs + consumed);
			}
		}
		return Array.from(playedByItem, ([itemId, audioEndMs]) => ({
			itemId,
			audioEndMs: Math.floor(audioEndMs)
		}));
	}
	/** Queue a provider mark frame after prior audio frames. */
	sendMark(name) {
		if (this.closed || !name) return;
		this.queue.push({
			type: "mark",
			name
		});
		this.ensurePump();
	}
	/** Retire the playback prefix once the carrier confirms playout reached the mark. */
	acknowledgeMark(name) {
		if (this.closed || !name) return;
		const boundaryIndex = this.markBoundaries.findIndex((boundary) => boundary.name === name);
		if (boundaryIndex < 0) return;
		const boundary = this.markBoundaries[boundaryIndex];
		this.markBoundaries.splice(0, boundaryIndex + 1);
		if (!boundary) return;
		while (this.playbackSegments.length > 0) {
			const head = this.playbackSegments[0];
			if (!head || head.sentMs < head.totalMs || head.lastSentEndMs === void 0 || head.lastSentEndMs > boundary.sentMs) break;
			const retired = this.playbackSegments.shift();
			if (retired) {
				this.retiredAudioMs += retired.sentMs;
				if (retired.itemId !== void 0) this.retiredItemOffsets.set(retired.itemId, (this.retiredItemOffsets.get(retired.itemId) ?? 0) + retired.sentMs);
			}
		}
		this.confirmedPlayedMs = Math.max(this.confirmedPlayedMs, Math.min(boundary.sentMs, this.sentAudioMs));
	}
	/** Clear queued audio and notify the provider stream. */
	clearAudio() {
		if (this.closed) return 0;
		const clearedAudioBytes = this.queuedAudioBytes;
		this.clearTimer();
		this.resetQueue();
		this.resetPlaybackState();
		this.params.send(this.params.serializer.clear());
		return clearedAudioBytes;
	}
	/** True while queued audio or a paced send timer can still reach the telephony stream. */
	hasPendingAudio() {
		return !this.closed && (this.queuedAudioBytes > 0 || this.timer !== null);
	}
	/** Stop sending and discard queued frames. */
	close() {
		this.closed = true;
		this.clearTimer();
		this.resetQueue();
		this.resetPlaybackState();
	}
	extendPlaybackSegment(itemId, durationMs) {
		let segment = this.playbackSegments.at(-1);
		if (!segment || segment.itemId !== itemId) {
			if (this.playbackSegments.length >= MAX_PLAYBACK_SEGMENTS) return null;
			segment = {
				itemId,
				totalMs: 0,
				sentMs: 0
			};
			this.playbackSegments.push(segment);
		}
		segment.totalMs += durationMs;
		return segment;
	}
	resetPlaybackState() {
		this.playbackSegments = [];
		this.queuedAudioBytes = 0;
		this.sentAudioMs = 0;
		this.retiredAudioMs = 0;
		this.confirmedPlayedMs = 0;
		this.lastPlaybackMarkMs = 0;
		this.markBoundaries = [];
		this.retiredItemOffsets.clear();
		this.streamClockMs = null;
		this.params.onPlaybackReset?.();
	}
	/** Clear the scheduled pump timer. */
	clearTimer() {
		if (!this.timer) return;
		clearTimeout(this.timer);
		this.timer = null;
	}
	/** Start the pump when queued work exists and no timer is active. */
	ensurePump() {
		if (!this.timer) this.pump();
	}
	/** Close the pacer and notify the caller about queued-audio backpressure. */
	failBackpressure() {
		this.close();
		this.params.onBackpressure?.();
	}
	get pendingQueueSize() {
		return Math.max(0, this.queue.length - this.queueHead);
	}
	/** Take one queued item without shifting the remaining paced-audio backlog. */
	takeNextItem() {
		if (this.queueHead >= this.queue.length) {
			this.resetQueue();
			return;
		}
		const item = this.queue[this.queueHead];
		this.queueHead += 1;
		if (this.queueHead >= this.queue.length) this.resetQueue();
		else if (this.queueHead > QUEUE_COMPACT_HEAD_THRESHOLD && this.queueHead * 2 > this.queue.length) {
			this.queue.splice(0, this.queueHead);
			this.queueHead = 0;
		}
		return item;
	}
	resetQueue() {
		this.queue.length = 0;
		this.queueHead = 0;
	}
	/** Fill the provider playout cushion, then wake at the next timeline boundary. */
	pump() {
		this.timer = null;
		if (this.closed) return;
		const now = performance.now();
		this.streamClockMs ??= now;
		while (this.pendingQueueSize > 0 && this.streamClockMs < now + LEAD_MS) {
			const item = this.takeNextItem();
			if (!item) break;
			if (!(item.type === "audio" ? this.sendAudioItem(item) : this.sendMarkItem(item))) {
				this.resetQueue();
				this.queuedAudioBytes = 0;
				this.streamClockMs = null;
				return;
			}
		}
		if (this.pendingQueueSize === 0) {
			this.streamClockMs = null;
			return;
		}
		const delayMs = Math.max(1, this.streamClockMs - LEAD_MS - performance.now());
		this.timer = setTimeout(() => this.pump(), delayMs);
	}
	sendAudioItem(item) {
		this.queuedAudioBytes = Math.max(0, this.queuedAudioBytes - item.chunk.length);
		const sent = this.params.send(this.params.serializer.media(item.chunk.toString("base64")));
		if (sent) {
			item.segment.sentMs += item.durationMs;
			this.sentAudioMs += item.durationMs;
			item.segment.lastSentEndMs = this.sentAudioMs;
		}
		this.streamClockMs = (this.streamClockMs ?? performance.now()) + item.durationMs;
		if (!sent || item.segment.itemId === void 0 || this.sentAudioMs - this.lastPlaybackMarkMs < LEAD_MS) return sent;
		this.lastPlaybackMarkMs = this.sentAudioMs;
		this.playbackMarkSequence += 1;
		return this.sendMarkItem({
			type: "mark",
			name: `${this.playbackMarkPrefix}-${this.playbackMarkSequence}`
		});
	}
	/** Send a queued mark frame and bind it to the playback prefix before it. */
	sendMarkItem(item) {
		const sent = this.params.send(this.params.serializer.mark(item.name));
		if (sent) {
			this.markBoundaries.push({
				name: item.name,
				sentMs: this.sentAudioMs
			});
			if (this.markBoundaries.length > MAX_PENDING_MARK_BOUNDARIES) this.markBoundaries.shift();
		}
		return sent;
	}
};
//#endregion
//#region extensions/voice-call/src/webhook/stream-frame-adapter.ts
/** Parse numeric timestamps sent as numbers or integer strings. */
function parseTimestampMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && /^[+-]?\d+$/.test(value.trim())) {
		const parsed = Number(value.trim());
		return Number.isSafeInteger(parsed) ? parsed : void 0;
	}
}
/** Parse a JSON object frame, returning null for invalid or non-object payloads. */
function tryParseJson(rawMessage) {
	try {
		const parsed = JSON.parse(rawMessage);
		return asNullableRecord(parsed);
	} catch {}
	return null;
}
/** Read an object-valued field from a parsed frame. */
function readRecordField(record, field) {
	return asOptionalObjectRecord(record[field]);
}
/** Parse a common provider media frame. */
function parseMediaFrame(msg) {
	const mediaData = readRecordField(msg, "media");
	const payload = typeof mediaData?.payload === "string" ? mediaData.payload : void 0;
	const canonicalPayload = payload ? canonicalizeVoiceCallMediaBase64(payload) : void 0;
	if (!canonicalPayload) return { kind: "ignored" };
	return {
		kind: "media",
		payloadBase64: canonicalPayload,
		timestampMs: parseTimestampMs(mediaData?.timestamp),
		track: typeof mediaData?.track === "string" ? mediaData.track : void 0
	};
}
/** Parse a common provider mark frame. */
function parseMarkFrame(msg) {
	const markData = readRecordField(msg, "mark");
	return {
		kind: "mark",
		name: typeof markData?.name === "string" ? markData.name : void 0
	};
}
/** Parse common media, mark, and stop frames shared by supported providers. */
function parseCommonInboundFrame(event, msg) {
	if (event === "media") return parseMediaFrame(msg);
	if (event === "mark") return parseMarkFrame(msg);
	if (event === "stop") return { kind: "stop" };
}
/** Parse one provider frame with provider-specific start/error hooks. */
function parseProviderInboundFrame(rawMessage, parseStartFrame, parseExtraFrame) {
	const msg = tryParseJson(rawMessage);
	if (!msg) return { kind: "ignored" };
	const event = msg.event;
	if (event === "start") return parseStartFrame(msg) ?? { kind: "ignored" };
	return parseCommonInboundFrame(event, msg) ?? parseExtraFrame?.(event, msg) ?? { kind: "ignored" };
}
/** Include streamSid only when Twilio has already supplied one. */
function withOptionalStreamSid(streamSid) {
	return streamSid === void 0 ? {} : { streamSid };
}
/** Serialize a provider media frame. */
function serializeMediaFrame(payloadBase64, streamSid) {
	return JSON.stringify({
		event: "media",
		...withOptionalStreamSid(streamSid),
		media: { payload: payloadBase64 }
	});
}
/** Serialize a provider clear frame. */
function serializeClearFrame(streamSid) {
	return JSON.stringify({
		event: "clear",
		...withOptionalStreamSid(streamSid)
	});
}
/** Serialize a provider mark frame. */
function serializeMarkFrame(name, streamSid) {
	return JSON.stringify({
		event: "mark",
		...withOptionalStreamSid(streamSid),
		mark: { name }
	});
}
/** Twilio media stream adapter, retaining streamSid for outbound frames. */
var TwilioStreamFrameAdapter = class {
	constructor() {
		this.providerName = "twilio";
		this.streamSid = "";
	}
	/** Parse one Twilio websocket message into a normalized frame. */
	parseInbound(rawMessage) {
		return parseProviderInboundFrame(rawMessage, (msg) => {
			const startData = readRecordField(msg, "start");
			const streamSid = typeof startData?.streamSid === "string" ? startData.streamSid : "";
			const callSid = typeof startData?.callSid === "string" ? startData.callSid : "";
			if (!streamSid || !callSid) return;
			this.streamSid = streamSid;
			return {
				kind: "start",
				streamId: streamSid,
				providerCallId: callSid
			};
		});
	}
	/** Serialize Twilio media with the active streamSid. */
	serializeMedia(payloadBase64) {
		return serializeMediaFrame(payloadBase64, this.streamSid);
	}
	/** Serialize Twilio clear with the active streamSid. */
	serializeClear() {
		return serializeClearFrame(this.streamSid);
	}
	/** Serialize Twilio mark with the active streamSid. */
	serializeMark(name) {
		return serializeMarkFrame(name, this.streamSid);
	}
};
/** Telnyx media stream adapter. */
var TelnyxStreamFrameAdapter = class {
	constructor() {
		this.providerName = "telnyx";
	}
	/** Parse one Telnyx websocket message into a normalized frame. */
	parseInbound(rawMessage) {
		return parseProviderInboundFrame(rawMessage, (msg) => {
			const topLevelStreamId = typeof msg.stream_id === "string" && msg.stream_id ? msg.stream_id : void 0;
			const startData = readRecordField(msg, "start");
			const providerCallId = typeof startData?.call_control_id === "string" && startData.call_control_id ? startData.call_control_id : void 0;
			if (!topLevelStreamId || !providerCallId) return;
			return {
				kind: "start",
				streamId: topLevelStreamId,
				providerCallId
			};
		}, (event, msg) => {
			if (event !== "error") return;
			const errorData = readRecordField(msg, "payload");
			return {
				kind: "error",
				code: typeof errorData?.code === "string" || typeof errorData?.code === "number" ? String(errorData.code) : void 0,
				title: typeof errorData?.title === "string" ? errorData.title : void 0,
				detail: typeof errorData?.detail === "string" ? errorData.detail : void 0
			};
		});
	}
	/** Serialize Telnyx media. */
	serializeMedia(payloadBase64) {
		return serializeMediaFrame(payloadBase64);
	}
	/** Serialize Telnyx clear. */
	serializeClear() {
		return serializeClearFrame();
	}
	/** Serialize Telnyx mark. */
	serializeMark(name) {
		return serializeMarkFrame(name);
	}
};
//#endregion
//#region extensions/voice-call/src/webhook/realtime-handler.ts
const STREAM_TOKEN_TTL_MS = 3e4;
const DEFAULT_HOST = "localhost:8443";
const MAX_REALTIME_MESSAGE_BYTES = 262144;
const MAX_REALTIME_WS_BUFFERED_BYTES = 1048576;
const REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS = 3e4;
const REALTIME_DISCONNECT_HANGUP_GRACE_MS = 2e3;
const FORCED_CONSULT_FALLBACK_DELAY_MS = 200;
const FORCED_CONSULT_NATIVE_DEDUPE_MS = 2e3;
const FORCED_CONSULT_RESULT_MAX_CHARS = 1800;
const FORCED_CONSULT_REASON = "provider_final_transcript_without_openclaw_agent_consult";
const CONSULT_TRANSCRIPT_SETTLE_MS = 350;
const CONSULT_TRANSCRIPT_SETTLE_MAX_MS = 1e3;
const MAX_PARTIAL_USER_TRANSCRIPT_CHARS = 1200;
const RECENT_FINAL_USER_TRANSCRIPT_TTL_MS = 2e3;
const BARGE_IN_REQUIRED_LOUD_CHUNKS = 2;
const logger = createSubsystemLogger("voice-call/realtime");
function buildGreetingInstructions(baseInstructions, greeting) {
	const trimmedGreeting = greeting?.trim();
	if (!trimmedGreeting) return;
	const intro = "Start the call by greeting the caller naturally. Include this greeting in your first spoken reply:";
	return baseInstructions ? `${baseInstructions}\n\n${intro} "${trimmedGreeting}"` : `${intro} "${trimmedGreeting}"`;
}
function readConsultArgText(args, key) {
	if (!args || typeof args !== "object" || Array.isArray(args)) return;
	const value = args[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readConsultQuestionText(args) {
	return readRealtimeVoiceConsultQuestion(args);
}
function normalizeTranscriptText(text) {
	return text.replace(/\s+/g, " ").trim();
}
function findTextOverlap(base, next) {
	const max = Math.min(base.length, next.length);
	for (let size = max; size > 0; size -= 1) if (base.slice(-size) === next.slice(0, size)) return size;
	return 0;
}
function shouldInsertTranscriptSpace(base, next) {
	if (!base || !next) return false;
	const last = base.at(-1);
	if (/\s$/.test(base) || last === "(" || last === "[" || last === "{" || last === "\"" || last === "'" || /^[\s,.;:!?)]/.test(next)) return false;
	return true;
}
function appendTranscriptText(base, fragment) {
	const next = normalizeTranscriptText(fragment);
	if (!next) return base ?? "";
	const current = normalizeTranscriptText(base ?? "");
	if (!current) return next;
	const currentLower = current.toLowerCase();
	const nextLower = next.toLowerCase();
	if (currentLower === nextLower || currentLower.endsWith(nextLower)) return current;
	if (nextLower.startsWith(currentLower)) return next;
	const overlap = findTextOverlap(currentLower, nextLower);
	if (overlap >= 6 || overlap >= 3 && next.length <= 12) return `${current}${next.slice(overlap)}`.trim();
	return `${current}${shouldInsertTranscriptSpace(current, next) ? " " : ""}${next}`.trim();
}
function resolveFinalTranscriptText(params) {
	const final = normalizeTranscriptText(params.final);
	const rawPartial = params.rawPartial ?? "";
	const partial = normalizeTranscriptText(params.partial ?? rawPartial);
	if (!partial) return final;
	if (!final) return partial;
	const compact = (value) => value.toLowerCase().replaceAll(/\s/g, "");
	const compactFinal = compact(final);
	const compactRaw = compact(rawPartial);
	const compactPartial = compact(partial);
	if (compactFinal.startsWith(compactPartial) || compactFinal.endsWith(compactPartial)) return final;
	if (compactPartial.endsWith(compactFinal)) return partial;
	if (compactRaw !== compactPartial) return appendTranscriptText(partial, params.final);
	return normalizeTranscriptText(`${rawPartial}${params.final}`);
}
function limitPartialUserTranscript(text) {
	if (text.length <= MAX_PARTIAL_USER_TRANSCRIPT_CHARS) return text;
	const tail = sliceUtf16Safe(text, -1200);
	return tail.replace(/^\S+\s+/, "").trimStart() || tail.trimStart();
}
function withFallbackConsultQuestion(args, fallback) {
	const providerQuestion = readConsultQuestionText(args);
	const question = fallback?.trim();
	if (providerQuestion) {
		if (question && providerQuestion.length <= 40 && question.length >= providerQuestion.length + 8) {
			const context = readConsultArgText(args, "context");
			const fallbackContext = `Realtime provider supplied a shorter consult question: ${providerQuestion}`;
			return args && typeof args === "object" && !Array.isArray(args) ? {
				...args,
				question,
				context: context ? `${context}\n\n${fallbackContext}` : fallbackContext
			} : {
				question,
				context: fallbackContext
			};
		}
		return args;
	}
	if (!question) return args;
	return args && typeof args === "object" && !Array.isArray(args) ? {
		...args,
		question
	} : { question };
}
function buildForcedConsultSpeechPrompt(result) {
	const trimmed = result.trim();
	return [
		"Internal OpenClaw consult result is ready.",
		"Do not call tools for this internal result.",
		"Speak the following answer to the caller now, briefly and naturally:",
		trimmed.length <= FORCED_CONSULT_RESULT_MAX_CHARS ? trimmed : `${truncateUtf16Safe(trimmed, 1784).trimEnd()} [truncated]`
	].join("\n");
}
async function waitForNativeConsult(state) {
	return await Promise.race([state.promise.then((result) => ({
		kind: "completed",
		result
	})), state.cancellation.then(() => ({ kind: "cancelled" }))]);
}
function appendRecentTalkEventMetadata(metadata, event) {
	const previous = metadata ?? {};
	const recent = Array.isArray(previous.recentTalkEvents) ? previous.recentTalkEvents : [];
	return {
		...previous,
		lastTalkEventAt: event.timestamp,
		lastTalkEventType: event.type,
		recentTalkEvents: [...recent, {
			id: event.id,
			brain: event.brain,
			mode: event.mode,
			provider: event.provider,
			seq: event.seq,
			sessionId: event.sessionId,
			timestamp: event.timestamp,
			transport: event.transport,
			type: event.type,
			...event.turnId ? { turnId: event.turnId } : {},
			...event.final !== void 0 ? { final: event.final } : {}
		}].slice(-12)
	};
}
function rejectRealtimeUpgrade(socket, status) {
	const reason = status === 401 ? "Unauthorized" : "Service Unavailable";
	try {
		socket.end(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\n\r\n`, () => socket.destroy());
	} catch (error) {
		socket.destroy();
		throw error;
	}
}
var RealtimeCallHandler = class {
	constructor(config, manager, resolveCallRegistration, servePath, streamDisconnectLifecycle, coreConfig) {
		this.config = config;
		this.manager = manager;
		this.resolveCallRegistration = resolveCallRegistration;
		this.servePath = servePath;
		this.streamDisconnectLifecycle = streamDisconnectLifecycle;
		this.coreConfig = coreConfig;
		this.toolHandlers = /* @__PURE__ */ new Map();
		this.pendingStreamTokens = /* @__PURE__ */ new Map();
		this.activeSockets = /* @__PURE__ */ new Set();
		this.serverClosingSockets = /* @__PURE__ */ new WeakSet();
		this.activeBridgesByCallId = /* @__PURE__ */ new Map();
		this.activeTelephonyBindingsByCallId = /* @__PURE__ */ new Map();
		this.userTranscriptStatesByCallId = /* @__PURE__ */ new Map();
		this.forcedConsultsByCallId = /* @__PURE__ */ new Map();
		this.consultSessionsByCallId = /* @__PURE__ */ new Map();
		this.nativeConsultsInFlightByCallId = /* @__PURE__ */ new Map();
		this.terminationAttempts = /* @__PURE__ */ new Set();
		this.admissions = /* @__PURE__ */ new Set();
		this.closePromise = null;
		this.closing = false;
		this.publicOrigin = null;
		this.publicPathPrefix = "";
	}
	setPublicUrl(url) {
		try {
			const parsed = new URL(url);
			this.publicOrigin = parsed.host;
			this.publicPathPrefix = resolveVoiceCallPublicPathPrefix(parsed.pathname, this.servePath);
		} catch {
			this.publicOrigin = null;
			this.publicPathPrefix = "";
		}
	}
	getStreamPathPattern() {
		return `${this.publicPathPrefix}${normalizeWebhookPath(this.config.streamPath ?? "/voice/stream/realtime")}`;
	}
	buildTwiMLPayload(req, params) {
		const rawDirection = params?.get("Direction");
		const previousOrigin = this.publicOrigin;
		if (!previousOrigin) this.publicOrigin = req.headers.host ?? DEFAULT_HOST;
		try {
			const { streamUrl } = this.issueStreamSession({
				providerName: "twilio",
				from: params?.get("From") ?? void 0,
				to: params?.get("To") ?? void 0,
				direction: rawDirection?.startsWith("outbound") ? "outbound" : "inbound"
			});
			return {
				statusCode: 200,
				headers: { "Content-Type": "text/xml" },
				body: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}" />
  </Connect>
</Response>`
			};
		} finally {
			this.publicOrigin = previousOrigin;
		}
	}
	handleWebSocketUpgrade(request, socket, head) {
		socket.once("error", () => socket.destroy());
		if (this.closing) {
			rejectRealtimeUpgrade(socket, 503);
			return;
		}
		const token = new URL(request.url ?? "/", "wss://localhost").pathname.split("/").pop() ?? null;
		const callerMeta = token ? this.consumeStreamToken(token) : null;
		if (!callerMeta) {
			rejectRealtimeUpgrade(socket, 401);
			return;
		}
		const adapter = (callerMeta.providerName ?? "twilio") === "telnyx" ? new TelnyxStreamFrameAdapter() : new TwilioStreamFrameAdapter();
		new WebSocketServer({
			noServer: true,
			maxPayload: MAX_REALTIME_MESSAGE_BYTES
		}).handleUpgrade(request, socket, head, (ws) => {
			this.activeSockets.add(ws);
			let telephonyBinding = null;
			let initialized = false;
			let activeCallSid = "unknown";
			let activeStreamSid = "unknown";
			let lastMediaTimestamp;
			let lastMediaGapWarnAt = 0;
			let admitting = false;
			const pendingFrames = [];
			let pendingBytes = 0;
			const handleMessage = (data) => {
				if (admitting) {
					pendingBytes += Math.max(1, data.byteLength);
					if (pendingBytes > MAX_REALTIME_WS_BUFFERED_BYTES) {
						ws.terminate();
						return;
					}
					pendingFrames.push(data);
					return;
				}
				try {
					const frame = adapter.parseInbound(data.toString());
					if (frame.kind === "ignored") return;
					if (frame.kind === "start") {
						if (initialized) return;
						initialized = true;
						activeCallSid = frame.providerCallId;
						activeStreamSid = frame.streamId;
						admitting = true;
						ws.pause();
						const admission = this.handleCall(frame.streamId, frame.providerCallId, ws, callerMeta, adapter).then(async (nextBinding) => {
							telephonyBinding = nextBinding;
							if (!nextBinding) return;
							if (this.closing || ws.readyState !== WebSocket.OPEN) {
								await nextBinding.close(this.serverClosingSockets.has(ws) ? "shutdown" : "disconnect");
								return;
							}
							this.streamDisconnectLifecycle.connect(activeCallSid, activeStreamSid);
						}).catch((error) => {
							console.error("[voice-call] realtime admission failed:", error);
							ws.close(1011, "Failed to persist call");
						}).finally(() => {
							admitting = false;
							if (ws.readyState === WebSocket.OPEN && !this.closing) for (const pending of pendingFrames) handleMessage(pending);
							ws.resume();
							pendingFrames.length = 0;
							pendingBytes = 0;
						});
						this.trackShutdownWork(admission, this.admissions);
						return;
					}
					if (!telephonyBinding) return;
					if (frame.kind === "media") {
						const audio = Buffer.from(frame.payloadBase64, "base64");
						telephonyBinding.noteMediaActivity();
						telephonyBinding.bridge.sendAudio(audio);
						if (frame.timestampMs !== void 0) {
							if (lastMediaTimestamp !== void 0) {
								const gapMs = frame.timestampMs - lastMediaTimestamp;
								const now = Date.now();
								if ((gapMs > 120 || gapMs < 0) && now - lastMediaGapWarnAt > 5e3) {
									lastMediaGapWarnAt = now;
									console.warn(`[voice-call] realtime media timestamp gap providerCallId=${activeCallSid} gapMs=${gapMs} timestamp=${frame.timestampMs}`);
								}
							}
							lastMediaTimestamp = frame.timestampMs;
							telephonyBinding.bridge.setMediaTimestamp(frame.timestampMs);
						}
						return;
					}
					if (frame.kind === "mark") {
						telephonyBinding.acknowledgeCarrierMark(frame.name);
						telephonyBinding.bridge.acknowledgeMark(frame.name);
						return;
					}
					if (frame.kind === "error") {
						console.error(`[voice-call] realtime WS error frame providerCallId=${activeCallSid} code=${frame.code ?? "?"} title=${frame.title ?? ""} detail=${frame.detail ?? ""}`);
						return;
					}
					if (frame.kind === "stop") telephonyBinding.close("disconnect");
				} catch (error) {
					console.error("[voice-call] realtime WS parse failed:", error);
				}
			};
			ws.on("message", handleMessage);
			ws.on("close", () => {
				this.activeSockets.delete(ws);
				const reason = this.serverClosingSockets.has(ws) ? "shutdown" : "disconnect";
				if (telephonyBinding) telephonyBinding.close(reason);
			});
			ws.on("error", (error) => {
				console.error("[voice-call] realtime WS error:", error);
				ws.terminate();
			});
			if (this.closing) {
				this.serverClosingSockets.add(ws);
				ws.terminate();
			}
		});
	}
	close(shutdownBarrier = Promise.resolve()) {
		if (this.closePromise) return this.closePromise;
		this.closing = true;
		this.pendingStreamTokens.clear();
		const sockets = [...this.activeSockets];
		this.closePromise = Promise.allSettled([shutdownBarrier, ...sockets.map((ws) => new Promise((resolve) => {
			if (ws.readyState === WebSocket.CLOSED) {
				resolve();
				return;
			}
			this.serverClosingSockets.add(ws);
			ws.once("close", () => resolve());
			ws.terminate();
		}))]).then(async (results) => {
			results.push(...await Promise.allSettled(this.admissions));
			results.push(...await Promise.allSettled(this.terminationAttempts));
			this.pendingStreamTokens.clear();
			const failure = results.find((result) => result.status === "rejected");
			if (failure?.status === "rejected") throw failure.reason;
			if (this.shutdownFailure) throw this.shutdownFailure.error;
		}).finally(() => {
			this.closing = false;
			this.closePromise = null;
			this.shutdownFailure = void 0;
		});
		return this.closePromise;
	}
	trackShutdownWork(work, pending) {
		pending.add(work);
		work.then(() => {
			pending.delete(work);
		}, (error) => {
			pending.delete(work);
			if (this.closing) this.shutdownFailure ??= { error };
		});
	}
	registerToolHandler(name, fn) {
		this.toolHandlers.set(name, fn);
	}
	speak(callId, instructions) {
		const bridge = this.activeBridgesByCallId.get(callId);
		if (!bridge) return {
			success: false,
			error: "No active realtime bridge for call"
		};
		try {
			bridge.triggerGreeting(instructions);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: formatErrorMessage(error)
			};
		}
	}
	issueStreamSession(request = {}) {
		const token = this.issueStreamToken({
			providerName: request.providerName ?? "twilio",
			callId: request.callId,
			from: request.from,
			to: request.to,
			direction: request.direction
		});
		return {
			token,
			streamUrl: `wss://${this.publicOrigin || DEFAULT_HOST}${this.getStreamPathPattern()}/${token}`
		};
	}
	issueStreamToken(meta = {}) {
		const token = randomUUID();
		const expiry = resolveExpiresAtMsFromDurationMs(STREAM_TOKEN_TTL_MS, { nowMs: Date.now() });
		if (expiry !== void 0) {
			this.pendingStreamTokens.set(token, {
				expiry,
				...meta
			});
			const host = this.publicOrigin || DEFAULT_HOST;
			const streamPathPattern = this.getStreamPathPattern();
			setTimeout(() => {
				if (!this.pendingStreamTokens.has(token)) return;
				this.pendingStreamTokens.delete(token);
				if (this.closing) return;
				const call = meta.callId ? ` for call ${meta.callId}` : "";
				const endpoints = [meta.from ? `from ${meta.from}` : "", meta.to ? `to ${meta.to}` : ""].filter(Boolean).join(" ");
				const participants = endpoints ? ` (${endpoints})` : "";
				console.warn(`[voice-call] Realtime stream WebSocket never connected within ${STREAM_TOKEN_TTL_MS / 1e3}s${call}${participants} — the provider could not reach wss://${host}${streamPathPattern}/<token>. Verify the stream path is exposed (tailscale serve/funnel --set-path).`);
			}, STREAM_TOKEN_TTL_MS).unref?.();
		}
		return token;
	}
	consumeStreamToken(token) {
		const entry = this.pendingStreamTokens.get(token);
		if (!entry) return null;
		this.pendingStreamTokens.delete(token);
		if (!isFutureDateTimestampMs(entry.expiry)) return null;
		return {
			from: entry.from,
			to: entry.to,
			direction: entry.direction,
			providerName: entry.providerName,
			callId: entry.callId
		};
	}
	async handleCall(streamSid, callSid, ws, callerMeta, adapter) {
		const preparedCall = await this.prepareCallInManager(callSid, callerMeta);
		if (!preparedCall) {
			ws.close(1008, "Caller rejected by policy");
			return null;
		}
		const { callRecord } = preparedCall;
		const callId = callRecord.callId;
		let callEndPromise;
		const emitCallEnd = (cause) => {
			if (callEndPromise) return callEndPromise;
			const reason = cause === "error" ? "error" : cause === "inactivity" ? "timeout" : "completed";
			const attempt = this.manager.endCall(callId, { reason }).then((result) => {
				if (!result.success) {
					console.warn(`[voice-call] Failed to end realtime call callId=${callId} providerCallId=${callSid} reason=${reason}: ${result.error ?? "unknown error"}; call remains active`);
					return;
				}
				console.log(`[voice-call] Realtime call ended callId=${callId} providerCallId=${callSid} reason=${cause}`);
			});
			callEndPromise = attempt;
			this.trackShutdownWork(attempt, this.terminationAttempts);
			return attempt;
		};
		const admissionAbandoned = () => this.closing || ws.readyState !== WebSocket.OPEN;
		const abandonAdmission = async () => {
			if (!this.activeBridgesByCallId.has(callId)) {
				if (this.closing || this.serverClosingSockets.has(ws)) await emitCallEnd("shutdown");
				else {
					this.streamDisconnectLifecycle.connect(callSid, streamSid);
					this.streamDisconnectLifecycle.disconnect(callSid, streamSid);
				}
			}
		};
		if (admissionAbandoned()) {
			await abandonAdmission();
			return null;
		}
		let registration;
		let sessionPolicy;
		try {
			registration = this.resolveCallRegistration(callRecord);
			sessionPolicy = resolveRealtimeVoiceSessionPolicy({
				isAgentProxy: false,
				capabilities: registration.capabilities,
				configuredToolPolicy: this.config.toolPolicy,
				configuredConsultPolicy: this.config.consultPolicy === "always" ? "always" : "auto",
				requireWakeName: void 0,
				configuredWakeNames: void 0,
				cfg: this.coreConfig ?? {},
				agentId: registration.agentId
			});
		} catch (error) {
			console.error(`[voice-call] Failed to resolve realtime call registration callId=${callId} providerCallId=${callSid}: ${formatErrorMessage(error)}`);
			if (!this.activeBridgesByCallId.has(callId)) emitCallEnd("error");
			ws.close(1011, "Check realtime configuration for routed agent");
			return null;
		}
		const { baseFields } = preparedCall;
		let initialGreeting;
		await this.manager.updateCallMetadata(callRecord, (metadata) => {
			if (metadata) {
				initialGreeting = typeof metadata.initialMessage === "string" ? metadata.initialMessage : void 0;
				delete metadata.initialMessage;
			}
			return metadata;
		});
		await this.manager.processEvent({
			id: `realtime-answered-${callSid}`,
			callId,
			type: "call.answered",
			...baseFields
		});
		if (admissionAbandoned()) {
			await abandonAdmission();
			return null;
		}
		if (this.manager.getCallByProviderCallId(callSid) !== callRecord) {
			ws.close(1008, "Call is no longer active");
			return null;
		}
		const previousTelephonyBinding = this.activeTelephonyBindingsByCallId.get(callId);
		const { agentId, instructions, provider: realtimeProvider, providerConfig, capabilities } = registration;
		const { handlesAgentConsult, toolPolicy } = sessionPolicy;
		if (handlesAgentConsult) console.warn("[voice-call] This realtime model uses native agent delegation; the end-call and custom realtime function tools are unavailable.");
		const initialGreetingInstructions = buildGreetingInstructions(instructions, initialGreeting);
		const harness = createRealtimeVoiceSessionHarness({
			talk: {
				sessionId: `voice-call:${callId}:realtime`,
				mode: "realtime",
				transport: "gateway-relay",
				brain: "agent-consult",
				provider: realtimeProvider.id
			},
			talkPayloads: {
				turnStarted: () => ({
					callId,
					providerCallId: callSid
				}),
				turnEnded: (reason) => ({
					callId,
					providerCallId: callSid,
					reason
				}),
				inputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
				outputAudioStarted: () => ({
					callId,
					providerCallId: callSid
				}),
				outputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
				outputAudioDone: (reason) => ({
					callId,
					providerCallId: callSid,
					reason
				})
			},
			onTalkEvent: (event) => {
				this.manager.updateCallMetadata(callRecord, (metadata) => appendRecentTalkEventMetadata(metadata, event)).catch((error) => {
					console.warn("[voice-call] Failed to update realtime call metadata:", error);
				});
			}
		});
		const providerHandlesInputAudioBargeIn = (capabilities ?? realtimeProvider.capabilities)?.handlesInputAudioBargeIn === true;
		const cancelOutputAudioForBargeIn = (source, interruptProvider, clearedAudioBytes = 0) => {
			const outputAudioActive = harness.talk.outputAudioActive;
			const pendingTelephonyAudio = audioPacer.hasPendingAudio();
			if (source === "provider" && !outputAudioActive && !pendingTelephonyAudio && clearedAudioBytes === 0) return;
			const interruptedTurnId = harness.talk.activeTurnId;
			interruptProvider?.(outputAudioActive || pendingTelephonyAudio);
			const clearedBytes = clearedAudioBytes + (source === "local" || pendingTelephonyAudio ? audioPacer.clearAudio() : 0);
			console.log(`[voice-call] realtime outbound audio cleared by ${source} barge-in callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`);
			if (!outputAudioActive || !interruptedTurnId) return;
			const reason = `${source}-barge-in`;
			harness.finishOutputAudio(reason);
			harness.talk.cancelTurn({
				turnId: interruptedTurnId,
				payload: {
					callId,
					providerCallId: callSid,
					reason
				}
			});
		};
		harness.emit({
			type: "session.started",
			payload: {
				callId,
				providerCallId: callSid,
				streamSid
			}
		});
		console.log(`[voice-call] Realtime bridge starting for call ${callId} (providerCallId=${callSid}, initialGreeting=${initialGreetingInstructions ? "queued" : "absent"})`);
		const sendString = (message) => {
			if (ws.readyState !== WebSocket.OPEN) return false;
			if (ws.bufferedAmount > MAX_REALTIME_WS_BUFFERED_BYTES) {
				console.warn(`[voice-call] realtime outbound websocket backpressure before send callId=${callId} providerCallId=${callSid} bufferedBytes=${ws.bufferedAmount}`);
				ws.close(1013, "Backpressure: send buffer exceeded");
				return false;
			}
			ws.send(message);
			if (ws.bufferedAmount > MAX_REALTIME_WS_BUFFERED_BYTES) {
				console.warn(`[voice-call] realtime outbound websocket backpressure after send callId=${callId} providerCallId=${callSid} bufferedBytes=${ws.bufferedAmount}`);
				ws.close(1013, "Backpressure: send buffer exceeded");
				return false;
			}
			return true;
		};
		const pendingMarkAcks = /* @__PURE__ */ new Map();
		const audioPacer = new RealtimeAudioPacer({
			onPlaybackReset: () => pendingMarkAcks.clear(),
			send: sendString,
			serializer: {
				media: (payload) => adapter.serializeMedia(payload),
				clear: () => adapter.serializeClear(),
				mark: (name) => adapter.serializeMark(name)
			},
			onBackpressure: () => {
				console.warn(`[voice-call] realtime paced audio backpressure callId=${callId} providerCallId=${callSid}`);
				if (ws.readyState === WebSocket.OPEN) ws.close(1013, "Backpressure: paced audio queue exceeded");
			}
		});
		const speechDetector = createSpeechThresholdGate({
			rmsThreshold: .035,
			speechFrames: BARGE_IN_REQUIRED_LOUD_CHUNKS,
			silenceFrames: 12
		});
		const interruptResponseOnInputAudio = typeof providerConfig.interruptResponseOnInputAudio === "boolean" ? providerConfig.interruptResponseOnInputAudio : void 0;
		const nativeConsultOwner = {};
		let provisionalCloseReason;
		let sessionClosed = false;
		const userTranscriptAdoption = this.beginUserTranscriptOwnerAdoption(callId);
		const userTranscriptOwner = userTranscriptAdoption.owner;
		let transcriptPersistence = Promise.resolve();
		let transcriptFailure;
		const reportTranscriptFailure = (error) => {
			transcriptFailure ??= { error };
			console.error("[voice-call] Failed to persist realtime transcript:", error);
		};
		const drainProviderClose = async (closeProvider) => {
			const failures = [];
			try {
				await closeProvider();
			} catch (error) {
				failures.push(error);
			}
			await transcriptPersistence.catch((error) => {
				transcriptFailure ??= { error };
			});
			if (transcriptFailure) failures.push(transcriptFailure.error);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Realtime provider and transcript cleanup failed");
		};
		let continuityGeneration = 0;
		const bridgeParams = {
			provider: realtimeProvider,
			cfg: this.coreConfig,
			agentId,
			providerConfig,
			capabilities,
			audioFormat: REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
			interruptResponseOnInputAudio,
			instructions: handlesAgentConsult ? `${instructions}\n\nUse native agent delegation for OpenClaw work. End-call and custom realtime function tools are unavailable in this session; the caller can hang up to end the call.` : instructions,
			tools: handlesAgentConsult ? [] : this.config.tools,
			...handlesAgentConsult ? { runAgentConsult: async (request) => {
				const owner = nativeConsultOwner.current;
				const generation = continuityGeneration;
				request.signal?.throwIfAborted();
				await transcriptPersistence;
				if (!owner || sessionClosed || generation !== continuityGeneration || !this.isActiveBridgeOwner(callId, owner)) throw new Error("Realtime call delegation owner is no longer active");
				if (toolPolicy === "none") throw new Error("Agent consultation is disabled for this call");
				const result = await this.executeToolCall(owner, callId, randomUUID(), REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, { question: request.prompt }, harness.ensureTurn(), harness, userTranscriptOwner, { signal: request.signal });
				request.signal?.throwIfAborted();
				if (sessionClosed || generation !== continuityGeneration || !this.isActiveBridgeOwner(callId, owner)) throw new Error("Realtime call delegation owner is no longer active");
				const text = readSpeakableRealtimeVoiceToolResult(result, {
					keys: ["text", "output"],
					maxChars: FORCED_CONSULT_RESULT_MAX_CHARS
				});
				if (!text) throw new Error("Agent consultation returned no spoken answer");
				return { text };
			} } : {},
			initialGreetingInstructions,
			triggerGreetingOnReady: Boolean(initialGreetingInstructions),
			audioSink: {
				isOpen: () => !sessionClosed && ws.readyState === WebSocket.OPEN,
				sendAudio: (muLaw, metadata) => {
					harness.recordOutputAudio(muLaw);
					audioPacer.sendAudio(muLaw, metadata);
				},
				getPlaybackState: () => audioPacer.getPlaybackState(),
				clearAudio: (reason) => {
					harness.flushOutput(() => {
						const clearedBytes = audioPacer.clearAudio();
						if (reason === "barge-in") {
							cancelOutputAudioForBargeIn("provider", void 0, clearedBytes);
							return;
						}
						console.log(`[voice-call] realtime outbound audio clear requested callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`);
						harness.finishOutputAudio("clear");
					});
				},
				sendMark: (markName, acknowledge) => {
					audioPacer.sendMark(markName);
					if (markName && acknowledge) pendingMarkAcks.set(markName, acknowledge);
				}
			},
			onTranscript: (role, text, isFinal) => {
				const owner = nativeConsultOwner.current;
				if (provisionalCloseReason || sessionClosed && !isFinal || !this.getUserTranscriptState(callId, userTranscriptOwner) || owner && !this.isActiveBridgeOwner(callId, owner)) return;
				const turnId = harness.ensureTurn();
				const eventType = role === "assistant" ? isFinal ? "output.text.done" : "output.text.delta" : isFinal ? "transcript.done" : "transcript.delta";
				const payload = role === "assistant" ? { text } : {
					role,
					text
				};
				harness.emit({
					type: eventType,
					turnId,
					payload,
					final: isFinal
				});
				if (role === "user" && isFinal) harness.emit({
					type: "input.audio.committed",
					turnId,
					payload: {
						callId,
						providerCallId: callSid
					},
					final: true
				});
				if (!isFinal) {
					if (role === "user" && text.trim()) {
						const transcript = this.recordPartialUserTranscript(callId, userTranscriptOwner, text);
						if (!transcript) return;
						console.log(`[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=false chars=${text.trim().length} aggregateChars=${transcript.length}`);
					}
					return;
				}
				if (role === "user") {
					const state = this.getUserTranscriptState(callId, userTranscriptOwner);
					if (!state) return;
					const transcript = resolveFinalTranscriptText({
						partial: state.partial,
						rawPartial: state.rawPartial,
						final: text
					});
					this.clearPartialUserTranscript(callId, userTranscriptOwner);
					this.setRecentFinalUserTranscript(callId, userTranscriptOwner, transcript);
					console.log(`[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=true chars=${text.trim().length} aggregateChars=${transcript.length}`);
					const event = {
						id: `realtime-speech-${callSid}-${randomUUID()}`,
						type: "call.speech",
						callId,
						providerCallId: callSid,
						timestamp: Date.now(),
						transcript,
						isFinal: true
					};
					const generation = continuityGeneration;
					transcriptPersistence = this.manager.processEvent(event).then(() => {
						if (handlesAgentConsult || sessionClosed || generation !== continuityGeneration || !this.getUserTranscriptState(callId, userTranscriptOwner) || !this.isActiveBridgeOwner(callId, session)) return;
						this.scheduleForcedAgentConsult({
							harness,
							session,
							callId,
							callSid,
							transcript,
							userTranscriptOwner,
							clearAudio: () => {
								const clearedBytes = audioPacer.clearAudio();
								console.log(`[voice-call] realtime forced consult cleared outbound audio callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`);
							}
						});
					});
					transcriptPersistence.catch(reportTranscriptFailure);
					return;
				}
				transcriptPersistence = this.manager.processEvent({
					id: `realtime-bot-${callSid}-${randomUUID()}`,
					type: "call.assistant-speech",
					callId,
					providerCallId: callSid,
					timestamp: Date.now(),
					transcript: text
				}).then(() => {});
				transcriptPersistence.catch(reportTranscriptFailure);
			},
			onToolCall: async (toolEvent, sessionLocal) => {
				const generation = continuityGeneration;
				await transcriptPersistence;
				if (sessionClosed || generation !== continuityGeneration || !this.isActiveBridgeOwner(callId, sessionLocal)) return;
				const turnId = harness.ensureTurn();
				harness.emit({
					type: "tool.call",
					turnId,
					itemId: toolEvent.itemId,
					callId: toolEvent.callId,
					payload: {
						name: toolEvent.name,
						args: toolEvent.args
					}
				});
				console.log(`[voice-call] realtime tool call received callId=${callId} providerCallId=${callSid} tool=${toolEvent.name}`);
				await this.executeToolCall(sessionLocal, callId, toolEvent.callId || toolEvent.itemId, toolEvent.name, toolEvent.args, turnId, harness, userTranscriptOwner);
			},
			onEvent: (event) => {
				if (event.direction === "client" && event.type === "session.continuity.reset") {
					continuityGeneration += 1;
					const turnId = harness.talk.activeTurnId;
					const owner = nativeConsultOwner.current;
					if (owner && this.isActiveBridgeOwner(callId, owner)) {
						this.resetUserTranscriptState(callId, userTranscriptOwner);
						this.resetConsultSessionForContinuity(callId, owner);
					}
					harness.flushOutput(() => {
						audioPacer.clearAudio();
						harness.finishOutputAudio(event.type);
					});
					if (turnId) harness.talk.cancelTurn({
						turnId,
						payload: {
							callId,
							providerCallId: callSid,
							reason: event.type
						}
					});
					return;
				}
				if (event.type === "input_audio_buffer.speech_started") {
					harness.ensureTurn();
					return;
				}
				if (event.type === "input_audio_buffer.speech_stopped") {
					const turnId = harness.talk.activeTurnId;
					if (!turnId) return;
					harness.emit({
						type: "input.audio.committed",
						turnId,
						payload: {
							callId,
							providerCallId: callSid,
							source: event.type
						},
						final: true
					});
					return;
				}
				if (event.type === "error") harness.emit({
					type: "session.error",
					payload: { message: event.detail ?? "Realtime provider error" },
					final: true
				});
			},
			onResponseDone: (outcome) => {
				if (outcome.status === "failed" || outcome.status === "incomplete") console.warn(`[voice-call] realtime response ${outcome.status}: ${outcome.message}`);
			},
			onReady: () => {
				harness.emit({
					type: "session.ready",
					payload: {
						callId,
						providerCallId: callSid
					}
				});
			},
			onError: (error) => {
				console.error("[voice-call] realtime voice error:", error.message);
				harness.emit({
					type: "session.error",
					payload: { message: error.message },
					final: true
				});
			},
			onClose: (reason) => {
				harness.finishOutputAudio(reason);
				harness.emit({
					type: "session.closed",
					payload: { reason },
					final: true
				});
				const owner = nativeConsultOwner.current;
				if (!owner) {
					provisionalCloseReason ??= reason;
					return;
				}
				if (sessionClosed) {
					if (reason === "error") {
						this.streamDisconnectLifecycle.retire(callSid, streamSid);
						if (ws.readyState === WebSocket.OPEN) ws.close(1011, "Bridge disconnected");
					}
					return;
				}
				const ownsCallState = this.isActiveBridgeOwner(callId, owner);
				if (reason === "completed" && !ownsCallState) return;
				if (ownsCallState) closeBinding(telephonyBinding, reason);
				this.streamDisconnectLifecycle.retire(callSid, streamSid);
				if (ws.readyState === WebSocket.OPEN) ws.close(reason === "error" ? 1011 : 1e3, "Bridge disconnected");
			}
		};
		let candidate;
		try {
			candidate = harness.createBridge(bridgeParams);
		} catch (error) {
			console.error("[voice-call] Failed to create realtime bridge:", error);
		}
		if (!candidate || provisionalCloseReason) {
			this.rollbackUserTranscriptOwnerAdoption(callId, userTranscriptAdoption);
			try {
				await drainProviderClose(() => candidate?.close());
			} catch (error) {
				console.warn(`[voice-call] Failed to close realtime bridge ${callSid}: ${formatErrorMessage(error)}`);
			}
			harness.close();
			audioPacer.close();
			const reason = provisionalCloseReason ?? "error";
			if (!this.activeBridgesByCallId.has(callId)) emitCallEnd(reason);
			if (ws.readyState === WebSocket.OPEN) ws.close(reason === "error" ? 1011 : 1e3, "Failed to create realtime bridge");
			return null;
		}
		const session = candidate;
		this.commitUserTranscriptOwnerAdoption(callId, userTranscriptAdoption);
		nativeConsultOwner.current = session;
		const localBargeIn = !(session.bridge.handlesInputAudioBargeIn ?? providerHandlesInputAudioBargeIn) && resolveRealtimeVoiceBargeIn({
			configuredBargeIn: void 0,
			interruptResponseOnInputAudio,
			capabilities,
			outputAudioMode: session.bridge.outputAudioMode
		});
		const previousConsultSession = this.consultSessionsByCallId.get(callId);
		if (previousConsultSession && previousConsultSession.owner !== session) this.cancelConsultSession(callId, previousConsultSession.owner);
		this.consultSessionsByCallId.set(callId, {
			owner: session,
			coordinator: harness.forcedConsults
		});
		const sendAudioToSession = session.sendAudio.bind(session);
		session.sendAudio = (audio) => {
			if (sessionClosed) return;
			if (speechDetector.accept({
				rms: calculateMulawRms(audio),
				peak: 0
			})) {
				console.log(`[voice-call] realtime local speech detected callId=${callId} providerCallId=${callSid}`);
				if (localBargeIn) cancelOutputAudioForBargeIn("local", (audioPlaybackActive) => {
					session.handleBargeIn({ audioPlaybackActive });
				});
			}
			harness.recordInputAudio(audio);
			sendAudioToSession(audio);
		};
		const closeSession = session.close.bind(session);
		let sessionClosePromise;
		session.close = () => {
			if (sessionClosed) return sessionClosePromise ?? Promise.resolve();
			sessionClosed = true;
			this.cancelConsultSession(callId, session);
			audioPacer.close();
			sessionClosePromise = drainProviderClose(closeSession).finally(() => {
				this.clearActiveBridgeMappings(callId, callSid, session);
				this.clearUserTranscriptState(callId, userTranscriptOwner);
				harness.close();
			});
			return sessionClosePromise;
		};
		let livenessTimer;
		const clearLivenessTimer = () => {
			if (livenessTimer) {
				clearTimeout(livenessTimer);
				livenessTimer = void 0;
			}
		};
		let bindingClosed = false;
		let bindingClosePromise;
		const closeBinding = (binding, cause) => {
			if (bindingClosed) return bindingClosePromise ?? callEndPromise ?? Promise.resolve();
			bindingClosed = true;
			clearLivenessTimer();
			const ownsCall = this.activeTelephonyBindingsByCallId.get(callId) === binding;
			const finishClose = () => {
				const stillOwnsCall = this.activeTelephonyBindingsByCallId.get(callId) === binding;
				this.clearActiveTelephonyBinding(callId, binding);
				if (cause === "disconnect") this.streamDisconnectLifecycle.disconnect(callSid, streamSid);
				else this.streamDisconnectLifecycle.retire(callSid, streamSid);
				if (ownsCall && stillOwnsCall && cause && cause !== "disconnect") return emitCallEnd(cause);
				return Promise.resolve();
			};
			let pending;
			try {
				pending = Promise.resolve(session.close());
			} catch (error) {
				pending = Promise.reject(error instanceof Error ? error : new Error("Realtime provider close failed", { cause: error }));
			}
			bindingClosePromise = pending.then(finishClose, async (error) => {
				console.warn(`[voice-call] Failed to close realtime bridge ${callSid}: ${formatErrorMessage(error)}`);
				try {
					await finishClose();
				} catch (terminationError) {
					throw new AggregateError([error, terminationError], "Realtime call cleanup failed", { cause: terminationError });
				}
				throw error;
			});
			this.trackShutdownWork(bindingClosePromise, this.terminationAttempts);
			return bindingClosePromise;
		};
		const telephonyBinding = {
			bridge: session,
			acknowledgeCarrierMark: (markName) => {
				audioPacer.acknowledgeMark(markName);
				if (!markName) return;
				const acknowledge = pendingMarkAcks.get(markName);
				if (acknowledge) {
					pendingMarkAcks.delete(markName);
					acknowledge();
				}
			},
			close: (cause) => closeBinding(telephonyBinding, cause),
			endCall: () => {
				closeBinding(telephonyBinding);
				if (ws.readyState === WebSocket.OPEN) ws.close(1e3, "Call ended");
			},
			noteMediaActivity: () => {
				if (bindingClosed || this.activeTelephonyBindingsByCallId.get(callId) !== telephonyBinding) return;
				clearLivenessTimer();
				livenessTimer = setTimeout(() => {
					console.warn(`[voice-call] Realtime media inactive callId=${callId} providerCallId=${callSid} timeoutMs=${REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS} graceMs=${REALTIME_DISCONNECT_HANGUP_GRACE_MS}`);
					livenessTimer = setTimeout(() => {
						telephonyBinding.close("inactivity");
						if (ws.readyState === WebSocket.OPEN) ws.close(1e3, "Media inactivity");
					}, REALTIME_DISCONNECT_HANGUP_GRACE_MS);
					livenessTimer.unref?.();
				}, REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS);
				livenessTimer.unref?.();
			},
			retire: () => {
				closeBinding(telephonyBinding);
			}
		};
		this.activeBridgesByCallId.set(callId, session);
		this.activeBridgesByCallId.set(callSid, session);
		this.activeTelephonyBindingsByCallId.set(callId, telephonyBinding);
		telephonyBinding.noteMediaActivity();
		if (previousTelephonyBinding && previousTelephonyBinding !== telephonyBinding) previousTelephonyBinding.retire();
		session.connect().catch(async (error) => {
			console.error("[voice-call] Failed to connect realtime bridge:", error);
			try {
				await closeBinding(telephonyBinding, "error");
			} catch {} finally {
				ws.close(1011, "Failed to connect");
			}
		});
		return telephonyBinding;
	}
	beginUserTranscriptOwnerAdoption(callId) {
		const adoption = {
			owner: {},
			previous: this.userTranscriptStatesByCallId.get(callId)
		};
		this.userTranscriptStatesByCallId.set(callId, adoption.owner);
		return adoption;
	}
	commitUserTranscriptOwnerAdoption(callId, adoption) {
		if (this.userTranscriptStatesByCallId.get(callId) !== adoption.owner) return;
		if (adoption.previous?.recentFinalTimer) {
			clearTimeout(adoption.previous.recentFinalTimer);
			adoption.previous.recentFinalTimer = void 0;
		}
	}
	rollbackUserTranscriptOwnerAdoption(callId, adoption) {
		if (this.userTranscriptStatesByCallId.get(callId) !== adoption.owner) return;
		if (adoption.owner.recentFinalTimer) {
			clearTimeout(adoption.owner.recentFinalTimer);
			adoption.owner.recentFinalTimer = void 0;
		}
		if (adoption.previous) {
			this.userTranscriptStatesByCallId.set(callId, adoption.previous);
			return;
		}
		this.userTranscriptStatesByCallId.delete(callId);
	}
	getUserTranscriptState(callId, owner) {
		const state = this.userTranscriptStatesByCallId.get(callId);
		return state === owner ? state : void 0;
	}
	recordPartialUserTranscript(callId, owner, text) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		const next = limitPartialUserTranscript(appendTranscriptText(state.partial, text));
		const raw = limitPartialUserTranscript(`${state.rawPartial ?? ""}${text}`);
		state.partial = next;
		state.rawPartial = raw;
		state.partialUpdatedAt = Date.now();
		return next;
	}
	clearPartialUserTranscript(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		state.partial = void 0;
		state.rawPartial = void 0;
		state.partialUpdatedAt = void 0;
	}
	setRecentFinalUserTranscript(callId, owner, text) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		this.clearRecentFinalUserTranscript(callId, owner);
		state.recentFinal = text;
		const timer = setTimeout(() => {
			if (this.userTranscriptStatesByCallId.get(callId) !== state) return;
			if (state.recentFinal === text) state.recentFinal = void 0;
			if (state.recentFinalTimer === timer) state.recentFinalTimer = void 0;
		}, RECENT_FINAL_USER_TRANSCRIPT_TTL_MS);
		timer.unref?.();
		state.recentFinalTimer = timer;
	}
	clearRecentFinalUserTranscript(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		if (state.recentFinalTimer) {
			clearTimeout(state.recentFinalTimer);
			state.recentFinalTimer = void 0;
		}
		state.recentFinal = void 0;
	}
	resetUserTranscriptState(callId, owner) {
		this.clearPartialUserTranscript(callId, owner);
		this.clearRecentFinalUserTranscript(callId, owner);
	}
	clearUserTranscriptState(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		if (state.recentFinalTimer) clearTimeout(state.recentFinalTimer);
		if (this.userTranscriptStatesByCallId.get(callId) === state) this.userTranscriptStatesByCallId.delete(callId);
	}
	cancelNativeConsult(callId, owner) {
		const state = this.nativeConsultsInFlightByCallId.get(callId);
		if (!state || state.owner !== owner) return;
		this.nativeConsultsInFlightByCallId.delete(callId);
		state.cancel();
	}
	cancelForcedConsult(callId, owner) {
		const state = this.forcedConsultsByCallId.get(callId);
		if (!state || state.owner !== owner) return;
		state.cancelled = true;
		state.sendSpeechPrompt = false;
		state.cancel();
		this.forcedConsultsByCallId.delete(callId);
	}
	resetConsultSession(callId, owner) {
		const session = this.consultSessionsByCallId.get(callId);
		if (!session || session.owner !== owner) return false;
		session.coordinator.clearPending();
		this.cancelForcedConsult(callId, owner);
		this.cancelNativeConsult(callId, owner);
		return true;
	}
	resetConsultSessionForContinuity(callId, owner) {
		const session = this.consultSessionsByCallId.get(callId);
		if (!session || session.owner !== owner) return false;
		this.cancelForcedConsult(callId, owner);
		this.cancelNativeConsult(callId, owner);
		session.coordinator.clear();
		return true;
	}
	cancelConsultSession(callId, owner) {
		if (!owner || !this.resetConsultSession(callId, owner)) return;
		this.consultSessionsByCallId.delete(callId);
	}
	isActiveBridgeOwner(callId, owner) {
		return this.activeBridgesByCallId.get(callId) === owner;
	}
	clearActiveBridgeMappings(callId, callSid, owner) {
		for (const key of [callId, callSid]) {
			if (this.activeBridgesByCallId.get(key) !== owner) continue;
			this.activeBridgesByCallId.delete(key);
		}
	}
	clearActiveTelephonyBinding(callId, binding) {
		if (this.activeTelephonyBindingsByCallId.get(callId) === binding) this.activeTelephonyBindingsByCallId.delete(callId);
	}
	resolveUserTranscriptContext(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		return state?.partial ?? state?.recentFinal;
	}
	consumePartialUserTranscript(callId, owner, consumed) {
		const text = consumed?.trim();
		if (!text) return;
		const state = this.getUserTranscriptState(callId, owner);
		const current = state?.partial;
		if (!current) return;
		if (current === text) {
			this.clearPartialUserTranscript(callId, owner);
			return;
		}
		if (current.toLowerCase().startsWith(text.toLowerCase())) {
			const remaining = current.slice(text.length).trimStart();
			if (remaining) {
				state.partial = remaining;
				state.rawPartial = remaining;
			} else this.clearPartialUserTranscript(callId, owner);
		}
		const recent = state.recentFinal;
		if (!recent) return;
		if (recent === text || recent.toLowerCase().startsWith(text.toLowerCase())) this.clearRecentFinalUserTranscript(callId, owner);
	}
	async waitForConsultTranscriptSettle(callId, owner, startedAt) {
		const deadline = startedAt + CONSULT_TRANSCRIPT_SETTLE_MAX_MS;
		while (true) {
			const updatedAt = this.getUserTranscriptState(callId, owner)?.partialUpdatedAt;
			if (!updatedAt) return;
			const now = Date.now();
			const quietFor = now - updatedAt;
			if (quietFor >= CONSULT_TRANSCRIPT_SETTLE_MS || now >= deadline) return;
			await new Promise((resolve) => {
				setTimeout(resolve, Math.min(CONSULT_TRANSCRIPT_SETTLE_MS - quietFor, deadline - now));
			});
		}
	}
	scheduleForcedAgentConsult(params) {
		if (this.config.consultPolicy !== "always" || this.activeBridgesByCallId.get(params.callId) !== params.session) return;
		const question = params.transcript.trim();
		if (!question) return;
		const handler = this.toolHandlers.get(REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME);
		if (!handler) return;
		const existingForcedConsult = this.forcedConsultsByCallId.get(params.callId);
		if (existingForcedConsult && !existingForcedConsult.completedAt) return;
		const coordinator = params.harness.forcedConsults;
		if (coordinator.hasRecentNativeConsult(question, { allowUnknownQuestion: true })) return;
		coordinator.clearPending();
		const pending = coordinator.prepare(question);
		if (!pending) return;
		coordinator.schedule(pending, FORCED_CONSULT_FALLBACK_DELAY_MS, (handle) => {
			const activeForcedConsult = this.forcedConsultsByCallId.get(params.callId);
			if (activeForcedConsult && !activeForcedConsult.completedAt) return;
			this.runForcedAgentConsult({
				...params,
				handle,
				handler
			});
		});
	}
	async runForcedAgentConsult(params) {
		const coordinator = params.harness.forcedConsults;
		coordinator.markStarted(params.handle);
		const startedAt = Date.now();
		logger.debug(`[voice-call] realtime forced agent consult reason=${FORCED_CONSULT_REASON} consultPolicy=always callId=${params.callId} providerCallId=${params.callSid} chars=${params.handle.question.length}`);
		console.log(`[voice-call] realtime forced agent consult starting callId=${params.callId} providerCallId=${params.callSid} chars=${params.handle.question.length}`);
		params.clearAudio();
		const abortController = new AbortController();
		const state = {
			owner: params.session,
			sendSpeechPrompt: true,
			cancelled: false,
			cancel: () => {
				abortController.abort(/* @__PURE__ */ new Error("Realtime forced consult owner was cancelled."));
				coordinator.markCancelled(params.handle);
			},
			promise: Promise.resolve().then(() => {
				abortController.signal.throwIfAborted();
				return params.handler({ question: params.handle.question }, params.callId, { abortSignal: abortController.signal });
			})
		};
		this.forcedConsultsByCallId.set(params.callId, state);
		try {
			const result = await state.promise;
			if (state.cancelled || this.forcedConsultsByCallId.get(params.callId) !== state) return;
			state.completedAt = Date.now();
			coordinator.markDelivered(params.handle);
			const text = readSpeakableRealtimeVoiceToolResult(result, {
				keys: ["text", "output"],
				maxChars: FORCED_CONSULT_RESULT_MAX_CHARS
			});
			if (!text) {
				console.warn(`[voice-call] realtime forced agent consult returned no speakable text callId=${params.callId} providerCallId=${params.callSid}`);
				return;
			}
			if (state.sendSpeechPrompt) {
				params.clearAudio();
				params.session.sendUserMessage(buildForcedConsultSpeechPrompt(text));
			}
			console.log(`[voice-call] realtime forced agent consult completed callId=${params.callId} providerCallId=${params.callSid} elapsedMs=${Date.now() - startedAt}`);
			this.consumePartialUserTranscript(params.callId, params.userTranscriptOwner, params.handle.question);
		} catch (error) {
			if (!state.cancelled) {
				const result = buildRealtimeVoiceAgentErrorProviderResult(error);
				const failed = "error" in result;
				(failed ? console.warn : console.log)(`[voice-call] realtime forced agent consult ${failed ? "failed" : "cancelled"} callId=${params.callId} providerCallId=${params.callSid}${failed ? ` error=${result.error}` : ""}`);
			}
		} finally {
			if (!state.cancelled) {
				if (this.forcedConsultsByCallId.get(params.callId) !== state) coordinator.remove(params.handle);
				else setTimeout(() => {
					if (this.forcedConsultsByCallId.get(params.callId) === state) {
						this.forcedConsultsByCallId.delete(params.callId);
						coordinator.remove(params.handle);
					}
				}, FORCED_CONSULT_NATIVE_DEDUPE_MS).unref?.();
			}
		}
	}
	async prepareCallInManager(callSid, callerMeta = {}) {
		const baseFields = {
			providerCallId: callSid,
			timestamp: Date.now(),
			direction: callerMeta.direction ?? "inbound",
			...callerMeta.from ? { from: callerMeta.from } : {},
			...callerMeta.to ? { to: callerMeta.to } : {}
		};
		const callRecord = await this.resolveRealtimeCall(callSid, callerMeta, baseFields);
		if (!callRecord) return null;
		return {
			callRecord,
			baseFields
		};
	}
	async resolveRealtimeCall(callSid, callerMeta, baseFields) {
		if (callerMeta.callId) {
			const call = await this.manager.getCallForStream(callerMeta.callId);
			return call?.providerCallId === callSid ? call : null;
		}
		await this.manager.processEvent({
			id: `realtime-initiated-${callSid}`,
			callId: callSid,
			type: "call.initiated",
			...baseFields
		});
		return this.manager.getCallByProviderCallId(callSid) ?? null;
	}
	async executeEndCallTool(params) {
		const binding = this.activeTelephonyBindingsByCallId.get(params.callId);
		if (!binding || binding.bridge !== params.bridge || !this.isActiveBridgeOwner(params.callId, params.bridge)) return;
		let result;
		try {
			result = await this.manager.endCall(params.callId);
		} catch (error) {
			result = {
				success: false,
				error: formatErrorMessage(error)
			};
		}
		if (this.activeTelephonyBindingsByCallId.get(params.callId) !== binding || !this.isActiveBridgeOwner(params.callId, params.bridge)) return;
		if (!result.success) {
			const toolResult = { error: `Could not end the current phone call: ${result.error?.trim() || "the telephony provider returned no reason"}. Tell the caller the call could not be ended and they can hang up or ask you to try again.` };
			await params.bridge.submitToolResult(params.bridgeCallId, toolResult);
			params.harness.emit({
				type: "tool.error",
				turnId: params.turnId,
				callId: params.bridgeCallId,
				payload: {
					name: REALTIME_VOICE_END_CALL_TOOL_NAME,
					result: toolResult
				},
				final: true
			});
			return;
		}
		params.harness.emit({
			type: "tool.result",
			turnId: params.turnId,
			callId: params.bridgeCallId,
			payload: {
				name: REALTIME_VOICE_END_CALL_TOOL_NAME,
				result: { success: true }
			},
			final: true
		});
		binding.endCall();
	}
	async executeToolCall(bridge, callId, bridgeCallId, name, args, turnId, harness, userTranscriptOwner, delegation) {
		if (name === "openclaw_end_call") {
			await this.executeEndCallTool({
				bridge,
				callId,
				bridgeCallId,
				turnId,
				harness
			});
			return;
		}
		const handler = this.toolHandlers.get(name);
		const startedAt = Date.now();
		const hasResultError = (result) => {
			return result !== null && typeof result === "object" && !Array.isArray(result) && "error" in result;
		};
		const emitFinalToolEvent = (result) => {
			harness.emit({
				type: hasResultError(result) ? "tool.error" : "tool.result",
				turnId,
				callId: bridgeCallId,
				payload: {
					name,
					result
				},
				final: true
			});
		};
		const submitFinalToolResult = async (result) => {
			if (!delegation) await bridge.submitToolResult(bridgeCallId, result);
			emitFinalToolEvent(result);
			return result;
		};
		const submitWorkingResponse = async () => {
			if (!delegation && handler && name === REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME && bridge.bridge.supportsToolResultContinuation && !this.config.fastContext.enabled) {
				await bridge.submitToolResult(bridgeCallId, buildRealtimeVoiceAgentConsultWorkingResponse("caller"), { willContinue: true });
				harness.emit({
					type: "tool.progress",
					turnId,
					callId: bridgeCallId,
					payload: {
						name,
						status: "working"
					}
				});
			}
		};
		if (name === REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME) {
			if (this.activeBridgesByCallId.get(callId) !== bridge) return;
			const coordinator = harness.forcedConsults;
			const forcedMatch = coordinator.recordNativeConsult(args, bridgeCallId);
			if (forcedMatch.kind === "none") {
				const pending = coordinator.consumePending();
				if (pending) coordinator.remove(pending);
			}
			const forcedConsultState = this.forcedConsultsByCallId.get(callId);
			const forcedConsult = forcedConsultState?.owner === bridge && !forcedConsultState.cancelled ? forcedConsultState : void 0;
			if (forcedMatch.kind === "already_delivered" && coordinator.isCancelled(forcedMatch.handle)) {
				if (forcedConsult) forcedConsult.sendSpeechPrompt = false;
				return await submitFinalToolResult({
					status: "cancelled",
					message: "OpenClaw cancelled this consult before completion. Do not restart it."
				});
			}
			if (forcedConsult) {
				if (forcedConsult.completedAt || forcedMatch.kind === "already_delivered") return await submitFinalToolResult({
					status: "already_delivered",
					message: "OpenClaw already delivered this consult result internally. Do not repeat it."
				});
				forcedConsult.sendSpeechPrompt = false;
				const result = await forcedConsult.promise.catch(buildRealtimeVoiceAgentErrorProviderResult);
				if (forcedConsult.cancelled || forcedConsult.owner !== bridge || this.forcedConsultsByCallId.get(callId) !== forcedConsult) return;
				return await submitFinalToolResult(result);
			}
			const existingNativeConsult = this.nativeConsultsInFlightByCallId.get(callId);
			if (existingNativeConsult) {
				console.log(`[voice-call] realtime tool call sharing in-flight agent consult callId=${callId} ageMs=${Date.now() - existingNativeConsult.startedAt}`);
				await submitWorkingResponse();
				const outcome = await waitForNativeConsult(existingNativeConsult);
				if (outcome.kind === "cancelled") return;
				return await submitFinalToolResult(outcome.result);
			}
			const abortController = new AbortController();
			let releaseCancellation = () => {};
			const cancellation = new Promise((resolve) => {
				releaseCancellation = resolve;
			});
			let completeConsult = (_result) => {};
			const state = {
				owner: bridge,
				startedAt,
				promise: new Promise((resolve) => {
					completeConsult = resolve;
				}),
				cancellation,
				get cancelled() {
					return abortController.signal.aborted;
				},
				cancel: () => {
					abortController.abort(/* @__PURE__ */ new Error("Realtime native consult owner was cancelled."));
					releaseCancellation();
				}
			};
			if (delegation?.signal?.aborted) state.cancel();
			else delegation?.signal?.addEventListener("abort", state.cancel, { once: true });
			this.nativeConsultsInFlightByCallId.set(callId, state);
			(async () => {
				try {
					await submitWorkingResponse();
					if (state.cancelled || !this.isActiveBridgeOwner(callId, bridge)) return;
					await Promise.race([this.waitForConsultTranscriptSettle(callId, userTranscriptOwner, startedAt), state.cancellation]);
					if (state.cancelled || !this.isActiveBridgeOwner(callId, bridge)) return;
					const context = {
						partialUserTranscript: this.resolveUserTranscriptContext(callId, userTranscriptOwner),
						abortSignal: abortController.signal
					};
					state.partialUserTranscript = context.partialUserTranscript;
					const handlerArgs = withFallbackConsultQuestion(args, context.partialUserTranscript);
					console.log(`[voice-call] realtime tool call executing callId=${callId} tool=${name} hasHandler=${Boolean(handler)}`);
					return !handler ? { error: `Tool "${name}" not available` } : await handler(handlerArgs, callId, context);
				} catch (error) {
					return buildRealtimeVoiceAgentErrorProviderResult(error);
				}
			})().then(completeConsult);
			try {
				const outcome = await waitForNativeConsult(state);
				if (outcome.kind === "cancelled") return;
				const result = outcome.result;
				const failed = hasResultError(result);
				const error = failed ? formatErrorMessage(result.error ?? "unknown") : void 0;
				console.log(`[voice-call] realtime tool call completed callId=${callId} tool=${name} status=${failed ? "error" : "ok"} elapsedMs=${Date.now() - startedAt}${error ? ` error=${error}` : ""}`);
				await submitFinalToolResult(result);
				if (!failed) this.consumePartialUserTranscript(callId, userTranscriptOwner, state.partialUserTranscript);
				return result;
			} finally {
				delegation?.signal?.removeEventListener("abort", state.cancel);
				if (this.nativeConsultsInFlightByCallId.get(callId) === state) this.nativeConsultsInFlightByCallId.delete(callId);
			}
		}
		console.log(`[voice-call] realtime tool call executing callId=${callId} tool=${name} hasHandler=${Boolean(handler)}`);
		const context = { partialUserTranscript: this.resolveUserTranscriptContext(callId, userTranscriptOwner) };
		let result;
		try {
			result = !handler ? { error: `Tool "${name}" not available` } : await handler(args, callId, context);
		} catch (error) {
			result = buildRealtimeVoiceAgentErrorProviderResult(error);
		}
		const error = hasResultError(result) ? formatErrorMessage(result.error ?? "unknown") : void 0;
		console.log(`[voice-call] realtime tool call completed callId=${callId} tool=${name} status=${error === void 0 ? "ok" : "error"} elapsedMs=${Date.now() - startedAt}${error ? ` error=${error}` : ""}`);
		return await submitFinalToolResult(result);
	}
};
//#endregion
export { RealtimeCallHandler };
