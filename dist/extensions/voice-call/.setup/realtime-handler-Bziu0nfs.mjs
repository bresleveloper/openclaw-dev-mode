import { d as REALTIME_VOICE_END_CALL_TOOL_NAME, g as CallBriefSchema, s as resolveVoiceCallPublicPathPrefix } from "./config-BdbTQCSh.mjs";
import { n as appendRecentTalkEventMetadata, s as canonicalizeVoiceCallMediaBase64 } from "./runtime-entry-Cy51Uayg.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { asNullableRecord, asOptionalObjectRecord, asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createSubsystemLogger, sleep } from "openclaw/plugin-sdk/runtime-env";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, buildRealtimeVoiceAgentConsultWorkingResponse, buildRealtimeVoiceAgentErrorProviderResult, buildRealtimeVoiceSpeakExactMessage, calculateMulawRms, createRealtimeVoiceSessionHarness, createSpeechThresholdGate, readRealtimeVoiceConsultQuestion, readSpeakableRealtimeVoiceToolResult, resolveRealtimeVoiceBargeIn, resolveRealtimeVoiceSessionPolicy } from "openclaw/plugin-sdk/realtime-voice";
import { normalizeWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
import { isFutureDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { randomUUID } from "node:crypto";
import { safeParseJson, sliceUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import "node:http";
import { WebSocket, WebSocketServer, rejectWebSocketUpgrade } from "openclaw/plugin-sdk/websocket-runtime";
//#region extensions/voice-call/src/webhook/realtime-audio-pacer.ts
const TELEPHONY_SAMPLE_RATE = 8e3;
const TELEPHONY_CHUNK_BYTES = 160;
const LEAD_MS = 160;
const DEFAULT_MAX_QUEUED_AUDIO_BYTES = TELEPHONY_SAMPLE_RATE * 120;
const QUEUE_COMPACT_HEAD_THRESHOLD = 256;
const MAX_PLAYBACK_SEGMENTS = 128;
const MAX_PENDING_MARK_BOUNDARIES = 64;
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
			this.playbackSegments.shift();
			this.retiredAudioMs += head.sentMs;
			if (head.itemId !== void 0) this.retiredItemOffsets.set(head.itemId, (this.retiredItemOffsets.get(head.itemId) ?? 0) + head.sentMs);
		}
		this.confirmedPlayedMs = Math.max(this.confirmedPlayedMs, Math.min(boundary.sentMs, this.sentAudioMs));
	}
	/** Clear queued audio and notify the provider stream. */
	clearAudio() {
		if (this.closed) return 0;
		const clearedAudioBytes = this.queuedAudioBytes;
		this.resetPlaybackState();
		this.params.send(this.params.serializer.serializeClear());
		return clearedAudioBytes;
	}
	/** True while queued audio or a paced send timer can still reach the telephony stream. */
	hasPendingAudio() {
		return !this.closed && (this.queuedAudioBytes > 0 || this.timer !== null);
	}
	close() {
		this.closed = true;
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
		this.clearTimer();
		this.resetQueue();
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
	clearTimer() {
		if (!this.timer) return;
		clearTimeout(this.timer);
		this.timer = null;
	}
	ensurePump() {
		if (!this.timer) this.pump();
	}
	failBackpressure() {
		this.close();
		this.params.onBackpressure?.();
	}
	/** Take one queued item without shifting the remaining paced-audio backlog. */
	takeNextItem() {
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
		while (this.queueHead < this.queue.length && this.streamClockMs < now + LEAD_MS) {
			const item = this.takeNextItem();
			if (!item) break;
			if (!(item.type === "audio" ? this.sendAudioItem(item) : this.sendMarkItem(item.name))) {
				this.resetQueue();
				this.queuedAudioBytes = 0;
				this.streamClockMs = null;
				return;
			}
		}
		if (this.queueHead === this.queue.length) {
			this.streamClockMs = null;
			return;
		}
		const delayMs = Math.max(1, this.streamClockMs - LEAD_MS - performance.now());
		this.timer = setTimeout(() => this.pump(), delayMs);
	}
	sendAudioItem(item) {
		this.queuedAudioBytes = Math.max(0, this.queuedAudioBytes - item.chunk.length);
		const sent = this.params.send(this.params.serializer.serializeMedia(item.chunk.toString("base64")));
		if (sent) {
			this.params.onAudioSent?.(item.chunk);
			item.segment.sentMs += item.durationMs;
			this.sentAudioMs += item.durationMs;
			item.segment.lastSentEndMs = this.sentAudioMs;
		}
		this.streamClockMs = (this.streamClockMs ?? performance.now()) + item.durationMs;
		if (!sent || item.segment.itemId === void 0 || this.sentAudioMs - this.lastPlaybackMarkMs < LEAD_MS) return sent;
		this.lastPlaybackMarkMs = this.sentAudioMs;
		this.playbackMarkSequence += 1;
		return this.sendMarkItem(`${this.playbackMarkPrefix}-${this.playbackMarkSequence}`);
	}
	/** Send a queued mark frame and bind it to the playback prefix before it. */
	sendMarkItem(name) {
		const sent = this.params.send(this.params.serializer.serializeMark(name));
		if (sent) {
			this.markBoundaries.push({
				name,
				sentMs: this.sentAudioMs
			});
			if (this.markBoundaries.length > MAX_PENDING_MARK_BOUNDARIES) this.markBoundaries.shift();
		}
		return sent;
	}
};
//#endregion
//#region extensions/voice-call/src/webhook/realtime-call-session-control.ts
const OUTBOUND_GREETING_FALLBACK_MS = 3e3;
const REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS = 3e4;
const REALTIME_DISCONNECT_HANGUP_GRACE_MS = 2e3;
const ASSISTANT_SPEECH_RMS_THRESHOLD = .035;
function speakOnRealtimeBridge(bridges, callId, instructions) {
	const bridge = bridges.get(callId);
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
function buildForcedConsultSpeechPrompt(result) {
	return [
		"Internal OpenClaw consult result is ready.",
		"Do not call tools for this internal result.",
		"Speak the following answer to the caller now, briefly and naturally:",
		result
	].join("\n");
}
function buildGreetingInstructions(baseInstructions, greeting) {
	const trimmedGreeting = greeting?.trim();
	if (!trimmedGreeting) return;
	const intro = "Start the call by greeting the caller naturally. Include this greeting in your first spoken reply:";
	return baseInstructions ? `${baseInstructions}\n\n${intro} "${trimmedGreeting}"` : `${intro} "${trimmedGreeting}"`;
}
function buildVerbatimGreetingInstructions(baseInstructions, greeting) {
	const trimmedGreeting = greeting?.trim();
	if (!trimmedGreeting) return;
	const exactGreeting = [
		"For your first spoken reply, the first words must be the exact Answer below, verbatim and in its original language, with nothing before or after it.",
		"Then stop and listen.",
		buildRealtimeVoiceSpeakExactMessage({
			text: trimmedGreeting,
			surfaceLabel: "the callee"
		})
	].join("\n");
	return baseInstructions ? `${baseInstructions}\n\n${exactGreeting}` : exactGreeting;
}
function createOutboundGreetingController(params) {
	const waitForAnsweringMachine = params.call?.direction === "outbound" && params.call.metadata?.voicemailManagedByHost && params.call.metadata?.mode !== "notify" ? () => params.call?.metadata?.answeredBy : void 0;
	let speechMs = 0;
	let silenceMs = 0;
	let acknowledged = false;
	let claimed = !params.enabled;
	let closed = false;
	let waitingForAmd = Boolean(waitForAnsweringMachine);
	let machineDetected = false;
	let readySession;
	let timer;
	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const triggerOpening = () => {
		if (!closed && readySession && params.instructions && claim()) readySession.triggerGreeting(params.instructions);
	};
	const isBlocked = () => {
		const answeredBy = waitForAnsweringMachine?.();
		if (typeof answeredBy === "string" && (answeredBy.startsWith("machine_") || answeredBy === "fax")) {
			machineDetected = true;
			clearTimer();
		}
		if (machineDetected) return true;
		if (waitingForAmd && (answeredBy === "human" || answeredBy === "unknown")) {
			waitingForAmd = false;
			clearTimer();
			triggerOpening();
		}
		return waitingForAmd;
	};
	const claim = () => {
		if (closed || isBlocked() || claimed) return false;
		claimed = true;
		clearTimer();
		return true;
	};
	return {
		claim,
		isBlocked,
		noteInputAudio(audio) {
			if (closed || !readySession || !isBlocked() || machineDetected || acknowledged) return;
			if (calculateMulawRms(audio) >= ASSISTANT_SPEECH_RMS_THRESHOLD) {
				speechMs += audio.length / 8;
				silenceMs = 0;
			} else {
				silenceMs += audio.length / 8;
				if (silenceMs >= 240) speechMs = 0;
			}
			if (speechMs <= 3e3) return;
			acknowledged = true;
			const brief = CallBriefSchema.safeParse(params.call?.metadata?.brief);
			const language = brief.success ? brief.data.language : void 0;
			params.acknowledge?.([`Say only a short acknowledgement${language ? ` in ${JSON.stringify(language)}` : ""}, then stop and wait. Do not call tools.`, /^(es(?:[-_]|$)|spanish|español)/i.test(language ?? "") ? "Sí, un momento" : "Yes, one moment."].join("\n"));
		},
		close() {
			closed = true;
			clearTimer();
		},
		onReady(session) {
			readySession = session;
			if (closed || machineDetected) return;
			if (isBlocked()) {
				if (!timer && !machineDetected) {
					timer = setTimeout(() => {
						if (isBlocked() && !machineDetected && !closed) {
							waitingForAmd = false;
							triggerOpening();
						}
					}, params.holdOpeningMaxMs ?? 3e4);
					timer.unref?.();
				}
				return;
			}
			if (!params.enabled || !params.instructions || claimed) return;
			clearTimer();
			timer = setTimeout(() => {
				if (claim()) session.triggerGreeting(params.instructions);
			}, params.fallbackMs ?? OUTBOUND_GREETING_FALLBACK_MS);
			timer.unref?.();
		}
	};
}
function createRealtimeCallActivityController(params) {
	let closed = false;
	let started = false;
	let consultsInFlight = 0;
	let idleTimer;
	let mediaTimer;
	const clearIdle = () => {
		if (idleTimer) {
			clearTimeout(idleTimer);
			idleTimer = void 0;
		}
	};
	const clearMedia = () => {
		if (mediaTimer) {
			clearTimeout(mediaTimer);
			mediaTimer = void 0;
		}
	};
	const resetIdle = () => {
		clearIdle();
		if (closed || !started || !params.idleHangupMs || consultsInFlight > 0 || params.isPaused?.() === true) return;
		idleTimer = setTimeout(params.onIdle, params.idleHangupMs);
		idleTimer.unref?.();
	};
	return {
		beginConsult() {
			consultsInFlight += 1;
			clearIdle();
		},
		close() {
			closed = true;
			clearIdle();
			clearMedia();
		},
		endConsult() {
			consultsInFlight = Math.max(0, consultsInFlight - 1);
			if (consultsInFlight === 0) resetIdle();
		},
		isPaused: () => consultsInFlight > 0,
		noteMedia() {
			if (closed) return;
			clearMedia();
			mediaTimer = setTimeout(() => {
				params.onMediaWarning();
				mediaTimer = setTimeout(params.onMediaTimeout, params.mediaGraceMs ?? 2e3);
				mediaTimer.unref?.();
			}, params.mediaInactivityMs ?? 3e4);
			mediaTimer.unref?.();
		},
		noteSpeech: resetIdle,
		start() {
			started = true;
			resetIdle();
		}
	};
}
function createRealtimeCallAudioController(params) {
	const cancelOutputAudioForBargeIn = (source, interruptProvider, clearedAudioBytes = 0) => {
		const outputAudioActive = params.harness.talk.outputAudioActive;
		const pendingTelephonyAudio = params.audioPacer.hasPendingAudio();
		if (source === "provider" && !outputAudioActive && !pendingTelephonyAudio && clearedAudioBytes === 0) return;
		const interruptedTurnId = params.harness.talk.activeTurnId;
		if (outputAudioActive || pendingTelephonyAudio) interruptProvider?.(true);
		const clearedBytes = clearedAudioBytes + (source === "local" || pendingTelephonyAudio ? params.audioPacer.clearAudio() : 0);
		console.log(`[voice-call] realtime outbound audio cleared by ${source} barge-in callId=${params.callId} providerCallId=${params.providerCallId} queuedBytes=${clearedBytes}`);
		if (!outputAudioActive || !interruptedTurnId) return;
		const reason = `${source}-barge-in`;
		params.harness.finishOutputAudio(reason);
		params.harness.talk.cancelTurn({
			turnId: interruptedTurnId,
			payload: {
				callId: params.callId,
				providerCallId: params.providerCallId,
				reason
			}
		});
	};
	return {
		audioSink: {
			isOpen: params.isOpen,
			sendAudio: (muLaw, metadata) => {
				if (params.isBlocked?.()) return;
				if (muLaw.length > 0 && calculateMulawRms(muLaw) >= ASSISTANT_SPEECH_RMS_THRESHOLD) params.onAudibleOutput?.();
				params.harness.recordOutputAudio(muLaw);
				params.audioPacer.sendAudio(muLaw, metadata);
			},
			getPlaybackState: () => params.audioPacer.getPlaybackState(),
			clearAudio: (reason) => {
				params.harness.flushOutput(() => {
					const clearedBytes = params.audioPacer.clearAudio();
					if (reason === "barge-in") {
						cancelOutputAudioForBargeIn("provider", void 0, clearedBytes);
						return;
					}
					console.log(`[voice-call] realtime outbound audio clear requested callId=${params.callId} providerCallId=${params.providerCallId} queuedBytes=${clearedBytes}`);
					params.harness.finishOutputAudio(reason ?? "clear");
				});
			},
			sendMark: (markName, acknowledge) => {
				params.audioPacer.sendMark(markName);
				if (markName && acknowledge) params.pendingMarkAcks.set(markName, acknowledge);
			}
		},
		cancelOutputAudioForBargeIn
	};
}
//#endregion
//#region extensions/voice-call/src/webhook/realtime-host-speech.ts
/** One host-requested utterance, completed by audible output rather than model receipts. */
function createRealtimeHostSpeechController(params) {
	let closed = false;
	let pending;
	let quietTimer;
	let deadline;
	const finish = (error) => {
		const current = pending;
		pending = void 0;
		clearTimeout(quietTimer);
		clearTimeout(deadline);
		if (error) current?.reject(error);
		else current?.resolve();
	};
	return {
		isActive: () => Boolean(pending),
		speak(instructions) {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("Realtime bridge is closed"));
			finish(/* @__PURE__ */ new Error("Host speech replaced"));
			return new Promise((resolve, reject) => {
				try {
					params.interrupt();
					if (closed) throw new Error("Realtime bridge is closed");
					pending = {
						resolve,
						reject
					};
					deadline = setTimeout(() => finish(/* @__PURE__ */ new Error("Realtime speech did not finish within 45 seconds")), 45e3);
					deadline.unref?.();
					params.trigger(instructions);
				} catch (error) {
					const rejection = error instanceof Error ? error : new Error(String(error));
					finish(rejection);
					reject(rejection);
				}
			});
		},
		noteAudibleOutput() {
			if (!pending) return;
			clearTimeout(quietTimer);
			quietTimer = setTimeout(() => finish(), 1500);
			quietTimer.unref?.();
		},
		close() {
			closed = true;
			finish(/* @__PURE__ */ new Error("Realtime bridge closed during host speech"));
		}
	};
}
//#endregion
//#region extensions/voice-call/src/webhook/realtime-call-playback.ts
const MAX_REALTIME_WS_BUFFERED_BYTES$1 = 1048576;
function createRealtimeCallPlayback(params) {
	const { ws, callRecord, callSid, adapter, harness, initialGreetingInstructions } = params;
	const callId = callRecord.callId;
	const checkBackpressure = (phase) => {
		if (ws.bufferedAmount > MAX_REALTIME_WS_BUFFERED_BYTES$1) {
			console.warn(`[voice-call] realtime outbound websocket backpressure ${phase} send callId=${callId} providerCallId=${callSid} bufferedBytes=${ws.bufferedAmount}`);
			ws.close(1013, "Backpressure: send buffer exceeded");
			return false;
		}
		return true;
	};
	const sendString = (message) => {
		if (ws.readyState !== WebSocket.OPEN || !checkBackpressure("before")) return false;
		ws.send(message);
		return checkBackpressure("after");
	};
	const pendingMarkAcks = /* @__PURE__ */ new Map();
	const audioPacer = new RealtimeAudioPacer({
		onPlaybackReset: () => pendingMarkAcks.clear(),
		onAudioSent: (audio) => {
			if (calculateMulawRms(audio) >= .035) {
				hostSpeech.noteAudibleOutput();
				activity.noteSpeech();
			}
		},
		send: sendString,
		serializer: adapter,
		onBackpressure: () => {
			console.warn(`[voice-call] realtime paced audio backpressure callId=${callId} providerCallId=${callSid}`);
			if (ws.readyState === WebSocket.OPEN) ws.close(1013, "Backpressure: paced audio queue exceeded");
		}
	});
	const outboundGreeting = createOutboundGreetingController({
		enabled: params.hostOwnsOpening,
		instructions: initialGreetingInstructions,
		call: callRecord,
		holdOpeningMaxMs: params.holdOpeningMaxMs,
		acknowledge: (instructions) => {
			hostSpeech.speak(instructions).catch((error) => {
				console.warn("[voice-call] AMD acknowledgement failed:", formatErrorMessage(error));
			});
		}
	});
	const interruptModelOutput = () => {
		params.getSession()?.handleBargeIn({
			audioPlaybackActive: true,
			force: true
		});
		audioController.cancelOutputAudioForBargeIn("local");
	};
	const hostSpeech = createRealtimeHostSpeechController({
		interrupt: () => {
			interruptModelOutput();
		},
		trigger: (instructions) => {
			const session = params.getSession();
			if (!session) throw new Error("No active realtime bridge for call");
			session.triggerGreeting(instructions);
		}
	});
	const audioController = createRealtimeCallAudioController({
		audioPacer,
		callId,
		harness,
		isOpen: () => !params.isClosed() && ws.readyState === WebSocket.OPEN,
		isBlocked: () => outboundGreeting.isBlocked() && !hostSpeech.isActive(),
		onAudibleOutput: () => {
			outboundGreeting.claim();
		},
		pendingMarkAcks,
		providerCallId: callSid
	});
	const activity = createRealtimeCallActivityController({
		idleHangupMs: params.idleHangupMs,
		isPaused: () => outboundGreeting.isBlocked() || hostSpeech.isActive(),
		onIdle: () => {
			console.warn(`[voice-call] Realtime speech idle timeout callId=${callId} providerCallId=${callSid} timeoutMs=${params.idleHangupMs}`);
			params.closeForInactivity();
			if (ws.readyState === WebSocket.OPEN) ws.close(1e3, "Speech inactivity");
		},
		onMediaWarning: () => {
			console.warn(`[voice-call] Realtime media inactive callId=${callId} providerCallId=${callSid} timeoutMs=${REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS} graceMs=${REALTIME_DISCONNECT_HANGUP_GRACE_MS}`);
		},
		onMediaTimeout: () => {
			params.closeForInactivity();
			if (ws.readyState === WebSocket.OPEN) ws.close(1e3, "Media inactivity");
		}
	});
	return {
		audioPacer,
		pendingMarkAcks,
		outboundGreeting,
		audioController,
		activity,
		hostSpeech
	};
}
//#endregion
//#region extensions/voice-call/src/webhook/realtime-transcript-text.ts
const MAX_PARTIAL_USER_TRANSCRIPT_CHARS = 1200;
function limitPartialUserTranscript(text) {
	if (text.length <= MAX_PARTIAL_USER_TRANSCRIPT_CHARS) return text;
	const tail = sliceUtf16Safe(text, -1200);
	return tail.replace(/^\S+\s+/, "").trimStart() || tail.trimStart();
}
function normalizeTranscriptText(text) {
	return text.replace(/\s+/g, " ").trim();
}
function findTextOverlap(base, next) {
	const max = Math.min(base.length, next.length);
	for (let size = max; size > 0; size -= 1) if (base.slice(-size) === next.slice(0, size)) return size;
	return 0;
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
	return `${current}${/[([{"']$/.test(current) || /^[,.;:!?)]/.test(next) ? "" : " "}${next}`.trim();
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
var StreamFrameAdapter = class {
	constructor(provider) {
		this.provider = provider;
		this.streamSid = provider === "twilio" ? "" : void 0;
	}
	parseInbound(rawMessage) {
		const msg = asNullableRecord(safeParseJson(rawMessage));
		if (!msg) return { kind: "ignored" };
		switch (msg.event) {
			case "start": {
				const start = asOptionalObjectRecord(msg.start);
				const streamId = this.provider === "twilio" ? start?.streamSid : msg.stream_id;
				const providerCallId = this.provider === "twilio" ? start?.callSid : start?.call_control_id;
				if (typeof streamId !== "string" || !streamId || typeof providerCallId !== "string" || !providerCallId) return { kind: "ignored" };
				if (this.provider === "twilio") this.streamSid = streamId;
				return {
					kind: "start",
					streamId,
					providerCallId
				};
			}
			case "media": {
				const media = asOptionalObjectRecord(msg.media);
				const payload = typeof media?.payload === "string" ? media.payload : void 0;
				const payloadBase64 = payload ? canonicalizeVoiceCallMediaBase64(payload) : void 0;
				return payloadBase64 ? {
					kind: "media",
					payloadBase64,
					timestampMs: parseTimestampMs(media?.timestamp)
				} : { kind: "ignored" };
			}
			case "mark": {
				const mark = asOptionalObjectRecord(msg.mark);
				return {
					kind: "mark",
					name: typeof mark?.name === "string" ? mark.name : void 0
				};
			}
			case "stop": return { kind: "stop" };
			case "error": {
				if (this.provider !== "telnyx") return { kind: "ignored" };
				const error = asOptionalObjectRecord(msg.payload);
				return {
					kind: "error",
					code: typeof error?.code === "string" || typeof error?.code === "number" ? String(error.code) : void 0,
					title: typeof error?.title === "string" ? error.title : void 0,
					detail: typeof error?.detail === "string" ? error.detail : void 0
				};
			}
			default: return { kind: "ignored" };
		}
	}
	serializeMedia(payloadBase64) {
		return JSON.stringify({
			event: "media",
			streamSid: this.streamSid,
			media: { payload: payloadBase64 }
		});
	}
	serializeClear() {
		return JSON.stringify({
			event: "clear",
			streamSid: this.streamSid
		});
	}
	serializeMark(name) {
		return JSON.stringify({
			event: "mark",
			streamSid: this.streamSid,
			mark: { name }
		});
	}
};
//#endregion
//#region extensions/voice-call/src/webhook/realtime-handler.ts
const STREAM_TOKEN_TTL_MS = 3e4;
const DEFAULT_HOST = "localhost:8443";
const MAX_REALTIME_MESSAGE_BYTES = 262144;
const MAX_REALTIME_WS_BUFFERED_BYTES = 1048576;
const FORCED_CONSULT_FALLBACK_DELAY_MS = 200;
const FORCED_CONSULT_NATIVE_DEDUPE_MS = 2e3;
const FORCED_CONSULT_RESULT_MAX_CHARS = 1800;
const FORCED_CONSULT_REASON = "provider_final_transcript_without_openclaw_agent_consult";
const CONSULT_TRANSCRIPT_SETTLE_MS = 350;
const CONSULT_TRANSCRIPT_SETTLE_MAX_MS = 1e3;
const RECENT_FINAL_USER_TRANSCRIPT_TTL_MS = 2e3;
const BARGE_IN_REQUIRED_LOUD_CHUNKS = 2;
const CALLER_SPEECH_RMS_THRESHOLD = .035;
const logger = createSubsystemLogger("voice-call/realtime");
function withFallbackConsultQuestion(args, fallback) {
	const providerQuestion = readRealtimeVoiceConsultQuestion(args);
	const question = fallback?.trim();
	if (providerQuestion) {
		if (question && providerQuestion.length <= 40 && question.length >= providerQuestion.length + 8) {
			const record = asOptionalRecord(args);
			const context = normalizeOptionalString(record?.context);
			const fallbackContext = `Realtime provider supplied a shorter consult question: ${providerQuestion}`;
			return {
				...record,
				question,
				context: context ? `${context}\n\n${fallbackContext}` : fallbackContext
			};
		}
		return args;
	}
	if (!question) return args;
	return {
		...asOptionalRecord(args),
		question
	};
}
function captureNativeConsultTranscript(state) {
	const buffer = state.partial ?? state.recentFinal;
	return () => ({
		buffer,
		text: buffer?.text
	});
}
function clearRecentFinalUserTranscript(state) {
	clearTimeout(state.recentFinalTimer);
	state.recentFinalTimer = void 0;
	state.recentFinal = void 0;
}
function consumeUserTranscript(state, consumed) {
	const buffer = consumed?.buffer;
	const text = consumed?.text?.trim();
	if (!buffer || !text || buffer !== state.partial && buffer !== state.recentFinal || !buffer.text.toLowerCase().startsWith(text.toLowerCase())) return;
	const remaining = buffer.text.slice(text.length).trimStart();
	if (remaining) {
		buffer.text = remaining;
		buffer.raw = remaining;
	} else if (buffer === state.partial) state.partial = void 0;
	else clearRecentFinalUserTranscript(state);
}
var RealtimeCallHandler = class {
	constructor(config, manager, resolveCallRegistration, servePath, streamDisconnectLifecycle, coreConfig, holdOpeningMaxMs) {
		this.config = config;
		this.manager = manager;
		this.resolveCallRegistration = resolveCallRegistration;
		this.servePath = servePath;
		this.streamDisconnectLifecycle = streamDisconnectLifecycle;
		this.coreConfig = coreConfig;
		this.holdOpeningMaxMs = holdOpeningMaxMs;
		this.toolHandlers = /* @__PURE__ */ new Map();
		this.pendingStreamTokens = /* @__PURE__ */ new Map();
		this.activeSockets = /* @__PURE__ */ new Set();
		this.serverClosingSockets = /* @__PURE__ */ new WeakSet();
		this.activeBridgesByCallId = /* @__PURE__ */ new Map();
		this.activeTelephonyBindingsByCallId = /* @__PURE__ */ new Map();
		this.forcedConsultsByCallId = /* @__PURE__ */ new Map();
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
			rejectWebSocketUpgrade(socket, { status: 503 });
			return;
		}
		const token = new URL(request.url ?? "/", "wss://localhost").pathname.split("/").pop() ?? null;
		const callerMeta = token ? this.consumeStreamToken(token) : null;
		if (!callerMeta) {
			rejectWebSocketUpgrade(socket, { status: 401 });
			return;
		}
		const adapter = new StreamFrameAdapter(callerMeta.providerName ?? "twilio");
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
		return speakOnRealtimeBridge(this.activeBridgesByCallId, callId, instructions);
	}
	playVoicemail(callId, instructions) {
		return this.activeTelephonyBindingsByCallId.get(callId)?.playVoicemail(instructions);
	}
	async drainCall(callId) {
		await this.activeBridgesByCallId.get(callId)?.close();
	}
	async prepareCarrierPlayback(callId) {
		await this.activeTelephonyBindingsByCallId.get(callId)?.close();
	}
	issueStreamSession(request = {}) {
		const meta = {
			providerName: request.providerName ?? "twilio",
			callId: request.callId,
			from: request.from,
			to: request.to,
			direction: request.direction
		};
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
		return {
			token,
			streamUrl: `wss://${this.publicOrigin || DEFAULT_HOST}${this.getStreamPathPattern()}/${token}`
		};
	}
	consumeStreamToken(token) {
		const entry = this.pendingStreamTokens.get(token);
		if (!entry) return null;
		this.pendingStreamTokens.delete(token);
		if (!isFutureDateTimestampMs(entry.expiry)) return null;
		const { expiry: _expiry, ...request } = entry;
		return request;
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
		const carrierOwnsPlayback = () => Boolean(callRecord.metadata?.voicemailStatus || callRecord.metadata?.notifyStatus);
		const admissionAbandoned = () => this.closing || ws.readyState !== WebSocket.OPEN || carrierOwnsPlayback();
		const abandonAdmission = async () => {
			if (carrierOwnsPlayback()) {
				this.streamDisconnectLifecycle.retire(callSid, streamSid);
				ws.close(1e3, "Carrier playback owns the call");
				return;
			}
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
			registration = await this.resolveCallRegistration(callRecord);
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
		if (handlesAgentConsult) console.warn("[voice-call] This realtime model uses native agent delegation; hang-up is available through the call-scoped OpenClaw agent, while other custom realtime function tools remain unavailable.");
		const initialGreetingInstructions = handlesAgentConsult ? buildVerbatimGreetingInstructions(instructions, initialGreeting) : buildGreetingInstructions(instructions, initialGreeting);
		const isDelayedOutboundGreeting = handlesAgentConsult && callRecord.direction === "outbound" && Boolean(initialGreetingInstructions);
		const hostOwnsOpening = callRecord.direction === "outbound" && Boolean(initialGreetingInstructions) && (handlesAgentConsult || Boolean(callRecord.metadata?.voicemailManagedByHost) && callRecord.metadata?.mode !== "notify");
		const sessionInstructions = isDelayedOutboundGreeting ? initialGreetingInstructions : instructions;
		const harness = createRealtimeVoiceSessionHarness({
			forcedConsults: { questionsMatch: (left, right) => Boolean(left && right && left.trim() === right.trim()) },
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
				this.manager.updateCallMetadata(callRecord, (metadata) => appendRecentTalkEventMetadata(metadata, event, "realtime")).catch((error) => {
					console.warn("[voice-call] Failed to update realtime call metadata:", error);
				});
			}
		});
		const providerHandlesInputAudioBargeIn = (capabilities ?? realtimeProvider.capabilities)?.handlesInputAudioBargeIn === true;
		harness.emit({
			type: "session.started",
			payload: {
				callId,
				providerCallId: callSid,
				streamSid
			}
		});
		console.log(`[voice-call] Realtime bridge starting for call ${callId} (providerCallId=${callSid}, initialGreeting=${initialGreetingInstructions ? "queued" : "absent"})`);
		const speechDetector = createSpeechThresholdGate({
			rmsThreshold: CALLER_SPEECH_RMS_THRESHOLD,
			speechFrames: BARGE_IN_REQUIRED_LOUD_CHUNKS,
			silenceFrames: 12
		});
		const interruptResponseOnInputAudio = typeof providerConfig.interruptResponseOnInputAudio === "boolean" ? providerConfig.interruptResponseOnInputAudio : void 0;
		let nativeConsultOwner = void 0;
		const { audioPacer, pendingMarkAcks, outboundGreeting, audioController, activity, hostSpeech } = createRealtimeCallPlayback({
			ws,
			callRecord,
			callSid,
			adapter,
			harness,
			initialGreetingInstructions,
			hostOwnsOpening,
			holdOpeningMaxMs: this.holdOpeningMaxMs,
			idleHangupMs: this.config.idleHangupMs,
			getSession: () => nativeConsultOwner,
			isClosed: () => sessionClosed,
			closeForInactivity: () => {
				telephonyBinding.close("inactivity");
			}
		});
		let sessionClosed = false;
		const userTranscriptOwner = {};
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
		const bridgeParams = {
			provider: realtimeProvider,
			cfg: this.coreConfig,
			agentId,
			providerConfig,
			capabilities,
			audioFormat: REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ,
			interruptResponseOnInputAudio,
			instructions: handlesAgentConsult ? `${sessionInstructions}\n\nUse native agent delegation for OpenClaw work. To end the current call, say out loud that you are hanging up and delegate; the OpenClaw agent acts on the transcript. Other custom realtime function tools are unavailable in this session.` : sessionInstructions,
			tools: handlesAgentConsult ? [] : this.config.tools,
			...handlesAgentConsult ? { runAgentConsult: async (request) => {
				const owner = nativeConsultOwner;
				request.signal?.throwIfAborted();
				const invocationId = randomUUID();
				const transcript = captureNativeConsultTranscript(userTranscriptOwner);
				activity.beginConsult();
				try {
					await transcriptPersistence;
					if (!owner || sessionClosed || !this.isActiveBridgeOwner(callId, owner)) throw new Error("Realtime call delegation owner is no longer active");
					if (toolPolicy === "none") throw new Error("Agent consultation is disabled for this call");
					const result = await this.executeToolCall(owner, callId, invocationId, REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, { question: request.prompt }, harness.ensureTurn(), harness, userTranscriptOwner, transcript, { signal: request.signal });
					request.signal?.throwIfAborted();
					if (sessionClosed || !this.isActiveBridgeOwner(callId, owner)) throw new Error("Realtime call delegation owner is no longer active");
					const text = readSpeakableRealtimeVoiceToolResult(result, {
						keys: ["text", "output"],
						maxChars: FORCED_CONSULT_RESULT_MAX_CHARS
					});
					if (!text) throw new Error("Agent consultation returned no spoken answer");
					return { text };
				} finally {
					activity.endConsult();
				}
			} } : {},
			initialGreetingInstructions,
			triggerGreetingOnReady: Boolean(initialGreetingInstructions) && !hostOwnsOpening,
			audioSink: audioController.audioSink,
			onTranscript: (role, text, isFinal) => {
				const owner = nativeConsultOwner;
				if (outboundGreeting.isBlocked() || sessionClosed && !isFinal || !owner || !this.isActiveBridgeOwner(callId, owner)) return;
				if (text.trim()) {
					outboundGreeting.claim();
					activity.noteSpeech();
				}
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
						const state = userTranscriptOwner;
						const partial = state.partial ??= { text: "" };
						partial.text = limitPartialUserTranscript(appendTranscriptText(partial.text, text));
						partial.raw = limitPartialUserTranscript(`${partial.raw ?? ""}${text}`);
						partial.updatedAt = Date.now();
						console.log(`[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=false chars=${text.trim().length} aggregateChars=${partial.text.length}`);
					}
					return;
				}
				let transcript = text;
				let consultTranscript;
				if (role === "user") {
					const state = userTranscriptOwner;
					transcript = resolveFinalTranscriptText({
						partial: state.partial?.text,
						rawPartial: state.partial?.raw,
						final: text
					});
					const buffer = state.partial ?? { text: transcript };
					buffer.text = transcript;
					state.partial = void 0;
					clearRecentFinalUserTranscript(state);
					state.recentFinal = buffer;
					consultTranscript = {
						buffer,
						text: transcript
					};
					const timer = setTimeout(() => {
						state.recentFinal = void 0;
						state.recentFinalTimer = void 0;
					}, RECENT_FINAL_USER_TRANSCRIPT_TTL_MS);
					timer.unref?.();
					state.recentFinalTimer = timer;
					console.log(`[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=true chars=${text.trim().length} aggregateChars=${transcript.length}`);
				}
				const event = {
					id: `realtime-${role === "user" ? "speech" : "bot"}-${callSid}-${randomUUID()}`,
					callId,
					providerCallId: callSid,
					timestamp: Date.now(),
					transcript,
					...role === "user" ? {
						type: "call.speech",
						isFinal: true
					} : { type: "call.assistant-speech" }
				};
				transcriptPersistence = this.manager.processEvent(event).then(() => {
					if (role !== "user" || handlesAgentConsult || sessionClosed || !this.isActiveBridgeOwner(callId, session)) return;
					this.scheduleForcedAgentConsult({
						harness,
						session,
						callId,
						callSid,
						transcript,
						consultTranscript,
						userTranscriptOwner,
						clearAudio: () => {
							const clearedBytes = audioPacer.clearAudio();
							console.log(`[voice-call] realtime forced consult cleared outbound audio callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`);
						},
						beginConsultActivity: () => activity.beginConsult(),
						endConsultActivity: () => activity.endConsult()
					});
				});
				transcriptPersistence.catch(reportTranscriptFailure);
			},
			onToolCall: async (toolEvent, sessionLocal) => {
				const isConsult = toolEvent.name === REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME;
				const invocationId = toolEvent.callId || toolEvent.itemId;
				const transcript = isConsult ? captureNativeConsultTranscript(userTranscriptOwner) : void 0;
				if (isConsult) activity.beginConsult();
				try {
					await transcriptPersistence;
					if (sessionClosed || !this.isActiveBridgeOwner(callId, sessionLocal)) return;
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
					await this.executeToolCall(sessionLocal, callId, invocationId, toolEvent.name, toolEvent.args, turnId, harness, userTranscriptOwner, transcript);
				} finally {
					if (isConsult) activity.endConsult();
				}
			},
			onEvent: (event) => {
				if (event.direction === "client" && event.type === "session.continuity.reset") {
					const turnId = harness.talk.activeTurnId;
					const owner = nativeConsultOwner;
					if (owner && this.isActiveBridgeOwner(callId, owner)) {
						userTranscriptOwner.partial = void 0;
						clearRecentFinalUserTranscript(userTranscriptOwner);
						this.cancelConsultSession(callId, owner, harness.forcedConsults, "continuity-reset");
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
				if (event.type === "input_audio_buffer.speech_started" && !outboundGreeting.isBlocked()) {
					outboundGreeting.claim();
					activity.noteSpeech();
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
			onReady: (readySession) => {
				harness.emit({
					type: "session.ready",
					payload: {
						callId,
						providerCallId: callSid
					}
				});
				outboundGreeting.onReady(readySession);
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
				const owner = nativeConsultOwner;
				if (!owner) return;
				if (sessionClosed) {
					if (reason === "error") {
						this.streamDisconnectLifecycle.retire(callSid, streamSid);
						if (ws.readyState === WebSocket.OPEN) ws.close(1011, "Bridge disconnected");
					}
					return;
				}
				const ownsCallState = this.isActiveBridgeOwner(callId, owner);
				if (reason === "completed" && !ownsCallState) return;
				if (ownsCallState) closeBinding(reason);
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
		if (!candidate) {
			harness.close();
			audioPacer.close();
			outboundGreeting.close();
			hostSpeech.close();
			activity.close();
			if (!this.activeBridgesByCallId.has(callId)) emitCallEnd("error");
			if (ws.readyState === WebSocket.OPEN) ws.close(1011, "Failed to create realtime bridge");
			return null;
		}
		const session = candidate;
		nativeConsultOwner = session;
		const localBargeIn = !(session.bridge.handlesInputAudioBargeIn ?? providerHandlesInputAudioBargeIn) && resolveRealtimeVoiceBargeIn({
			configuredBargeIn: void 0,
			interruptResponseOnInputAudio,
			capabilities,
			outputAudioMode: session.bridge.outputAudioMode
		});
		const sendAudioToSession = session.sendAudio.bind(session);
		session.sendAudio = (audio) => {
			if (sessionClosed) return;
			outboundGreeting.noteInputAudio(audio);
			if (outboundGreeting.isBlocked() || hostSpeech.isActive()) return;
			const inputRms = calculateMulawRms(audio);
			if (inputRms >= CALLER_SPEECH_RMS_THRESHOLD) activity.noteSpeech();
			if (speechDetector.accept({
				rms: inputRms,
				peak: 0
			})) {
				outboundGreeting.claim();
				console.log(`[voice-call] realtime local speech detected callId=${callId} providerCallId=${callSid}`);
				if (localBargeIn && !activity.isPaused()) audioController.cancelOutputAudioForBargeIn("local", (audioPlaybackActive) => {
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
			outboundGreeting.close();
			hostSpeech.close();
			activity.close();
			this.cancelConsultSession(callId, session, harness.forcedConsults);
			audioPacer.close();
			sessionClosePromise = drainProviderClose(closeSession).finally(() => {
				for (const key of [callId, callSid]) if (this.activeBridgesByCallId.get(key) === session) this.activeBridgesByCallId.delete(key);
				clearRecentFinalUserTranscript(userTranscriptOwner);
				harness.close();
			});
			return sessionClosePromise;
		};
		let bindingClosed = false;
		let bindingClosePromise;
		const closeBinding = (cause) => {
			if (bindingClosed) return bindingClosePromise ?? callEndPromise ?? Promise.resolve();
			bindingClosed = true;
			activity.close();
			const ownsCall = this.activeTelephonyBindingsByCallId.get(callId) === telephonyBinding;
			const finishClose = () => {
				const stillOwnsCall = this.activeTelephonyBindingsByCallId.get(callId) === telephonyBinding;
				if (stillOwnsCall) this.activeTelephonyBindingsByCallId.delete(callId);
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
			close: (cause) => closeBinding(cause),
			endCall: () => {
				closeBinding();
				if (ws.readyState === WebSocket.OPEN) ws.close(1e3, "Call ended");
			},
			noteMediaActivity: () => activity.noteMedia(),
			playVoicemail: (speechInstructions) => hostSpeech.speak(speechInstructions),
			retire: () => {
				closeBinding();
			}
		};
		this.activeBridgesByCallId.set(callId, session);
		this.activeBridgesByCallId.set(callSid, session);
		this.activeTelephonyBindingsByCallId.set(callId, telephonyBinding);
		telephonyBinding.noteMediaActivity();
		activity.start();
		if (this.config.idleHangupMs) console.log(`[voice-call] Realtime speech idle monitor armed callId=${callId} providerCallId=${callSid} timeoutMs=${this.config.idleHangupMs}`);
		if (previousTelephonyBinding && previousTelephonyBinding !== telephonyBinding) previousTelephonyBinding.retire();
		session.connect().catch(async (error) => {
			console.error("[voice-call] Failed to connect realtime bridge:", error);
			try {
				await closeBinding("error");
			} catch {} finally {
				ws.close(1011, "Failed to connect");
			}
		});
		return telephonyBinding;
	}
	cancelConsultSession(callId, owner, coordinator, mode = "retire") {
		coordinator.clearPending();
		const forced = this.forcedConsultsByCallId.get(callId);
		if (forced?.owner === owner) {
			forced.cancelled = true;
			forced.sendSpeechPrompt = false;
			forced.cancel();
			this.forcedConsultsByCallId.delete(callId);
		}
		const native = this.nativeConsultsInFlightByCallId.get(callId);
		if (native?.owner === owner) {
			this.nativeConsultsInFlightByCallId.delete(callId);
			native.cancel();
		}
		if (mode === "continuity-reset") coordinator.clear();
	}
	isActiveBridgeOwner(callId, owner) {
		return this.activeBridgesByCallId.get(callId) === owner;
	}
	async waitForConsultTranscriptSettle(owner, startedAt) {
		const deadline = startedAt + CONSULT_TRANSCRIPT_SETTLE_MAX_MS;
		while (true) {
			const updatedAt = owner.partial?.updatedAt;
			if (!updatedAt) return;
			const now = Date.now();
			const quietFor = now - updatedAt;
			if (quietFor >= CONSULT_TRANSCRIPT_SETTLE_MS || now >= deadline) return;
			await sleep(Math.min(CONSULT_TRANSCRIPT_SETTLE_MS - quietFor, deadline - now));
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
		params.beginConsultActivity();
		const abortController = new AbortController();
		const state = {
			owner: params.session,
			handle: params.handle,
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
			consumeUserTranscript(params.userTranscriptOwner, params.consultTranscript);
		} catch (error) {
			if (!state.cancelled) {
				const result = buildRealtimeVoiceAgentErrorProviderResult(error);
				const failed = "error" in result;
				(failed ? console.warn : console.log)(`[voice-call] realtime forced agent consult ${failed ? "failed" : "cancelled"} callId=${params.callId} providerCallId=${params.callSid}${failed ? ` error=${result.error}` : ""}`);
			}
		} finally {
			params.endConsultActivity();
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
		let callRecord;
		if (callerMeta.callId) {
			const call = await this.manager.getCallForStream(callerMeta.callId);
			callRecord = call?.providerCallId === callSid ? call : void 0;
		} else {
			await this.manager.processEvent({
				id: `realtime-initiated-${callSid}`,
				callId: callSid,
				type: "call.initiated",
				...baseFields
			});
			callRecord = this.manager.getCallByProviderCallId(callSid);
		}
		return callRecord ? {
			callRecord,
			baseFields
		} : null;
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
	async executeToolCall(bridge, callId, bridgeCallId, name, args, turnId, harness, userTranscriptOwner, consultTranscript, delegation) {
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
		const submitFinalToolResult = async (result) => {
			if (!delegation) await bridge.submitToolResult(bridgeCallId, result);
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
			return result;
		};
		const invokeHandler = async (handlerArgs, context) => {
			console.log(`[voice-call] realtime tool call executing callId=${callId} tool=${name} hasHandler=${Boolean(handler)}`);
			try {
				return handler ? await handler(handlerArgs, callId, context) : { error: `Tool "${name}" not available` };
			} catch (error) {
				return buildRealtimeVoiceAgentErrorProviderResult(error);
			}
		};
		const logResult = (result) => {
			const failed = hasResultError(result);
			const error = failed ? formatErrorMessage(result.error ?? "unknown") : void 0;
			console.log(`[voice-call] realtime tool call completed callId=${callId} tool=${name} status=${failed ? "error" : "ok"} elapsedMs=${Date.now() - startedAt}${error ? ` error=${error}` : ""}`);
			return failed;
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
			const submitBusyResult = () => submitFinalToolResult({
				status: "busy",
				started: false,
				retryable: true,
				error: "OpenClaw is still consulting on a different request. This request has not started. Wait for that consult's result before you retry this request; do not poll while it is running."
			});
			const coordinator = harness.forcedConsults;
			const forcedMatch = coordinator.recordNativeConsult(args, bridgeCallId);
			if (forcedMatch.kind === "none") {
				const pending = coordinator.consumePending();
				if (pending) coordinator.remove(pending);
			}
			const forcedConsultState = this.forcedConsultsByCallId.get(callId);
			const forcedConsult = forcedConsultState?.owner === bridge && !forcedConsultState.cancelled ? forcedConsultState : void 0;
			if (forcedMatch.kind === "already_delivered") {
				const cancelled = coordinator.isCancelled(forcedMatch.handle);
				if (cancelled && forcedConsult?.handle === forcedMatch.handle) forcedConsult.sendSpeechPrompt = false;
				return await submitFinalToolResult(cancelled ? {
					status: "cancelled",
					message: "OpenClaw cancelled this consult before completion. Do not restart it."
				} : {
					status: "already_delivered",
					message: "OpenClaw already delivered this consult result internally. Do not repeat it."
				});
			}
			if (forcedConsult && forcedMatch.kind !== "none" && forcedMatch.handle === forcedConsult.handle) {
				forcedConsult.sendSpeechPrompt = false;
				const result = await forcedConsult.promise.catch(buildRealtimeVoiceAgentErrorProviderResult);
				if (forcedConsult.cancelled || forcedConsult.owner !== bridge || this.forcedConsultsByCallId.get(callId) !== forcedConsult) return;
				return await submitFinalToolResult(result);
			}
			if (forcedConsult && !forcedConsult.completedAt) return await submitBusyResult();
			const existingNativeConsult = this.nativeConsultsInFlightByCallId.get(callId);
			if (existingNativeConsult?.owner === bridge && !existingNativeConsult.cancelled) {
				if (!bridgeCallId.trim() || existingNativeConsult.invocationId !== bridgeCallId) return await submitBusyResult();
				console.log(`[voice-call] realtime tool call sharing in-flight agent consult callId=${callId} ageMs=${Date.now() - existingNativeConsult.startedAt}`);
				await submitWorkingResponse();
				const result = await existingNativeConsult.promise;
				if (existingNativeConsult.cancelled || !this.isActiveBridgeOwner(callId, bridge)) return;
				return await submitFinalToolResult(result);
			}
			let transcript;
			const abortController = new AbortController();
			const state = {
				owner: bridge,
				invocationId: bridgeCallId,
				startedAt,
				promise: (async () => {
					await submitWorkingResponse();
					await this.waitForConsultTranscriptSettle(userTranscriptOwner, startedAt);
					if (abortController.signal.aborted || !this.isActiveBridgeOwner(callId, bridge)) return;
					transcript = consultTranscript?.();
					const context = {
						partialUserTranscript: transcript?.text,
						abortSignal: abortController.signal
					};
					const handlerArgs = withFallbackConsultQuestion(args, context.partialUserTranscript);
					return await invokeHandler(handlerArgs, context);
				})().catch(buildRealtimeVoiceAgentErrorProviderResult),
				get cancelled() {
					return abortController.signal.aborted;
				},
				cancel: () => {
					abortController.abort(/* @__PURE__ */ new Error("Realtime native consult owner was cancelled."));
				}
			};
			if (delegation?.signal?.aborted) state.cancel();
			else delegation?.signal?.addEventListener("abort", state.cancel, { once: true });
			this.nativeConsultsInFlightByCallId.set(callId, state);
			try {
				const result = await state.promise;
				if (state.cancelled || !this.isActiveBridgeOwner(callId, bridge)) return;
				const failed = logResult(result);
				await submitFinalToolResult(result);
				if (!failed) consumeUserTranscript(userTranscriptOwner, transcript);
				return result;
			} finally {
				delegation?.signal?.removeEventListener("abort", state.cancel);
				if (this.nativeConsultsInFlightByCallId.get(callId) === state) this.nativeConsultsInFlightByCallId.delete(callId);
			}
		}
		const transcript = userTranscriptOwner;
		const result = await invokeHandler(args, { partialUserTranscript: (transcript.partial ?? transcript.recentFinal)?.text });
		logResult(result);
		return await submitFinalToolResult(result);
	}
};
//#endregion
export { RealtimeCallHandler };
