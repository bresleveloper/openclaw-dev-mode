import { F as resolveTimerTimeoutMs, l as asNonNegativeFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { o as emitTrustedDiagnosticEvent } from "./diagnostic-events-CVabF32H.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-Dkx3Z36w.mjs";
import { n as resolveBundledProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { c as normalizeSessionDeliveryState, r as hasDeliveryTargetFields, s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { i as normalizeCapabilityProviderId, t as buildCapabilityProviderIndex } from "./provider-registry-shared-CGngP_UC.mjs";
import { a as resolvePluginCapabilityProviders, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-BdPCG__9.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as buildSessionCreationStamp, r as inheritSessionCreationPolicy } from "./session-entry-provenance-C-JyMH54.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { i as ModelSelectionLockedError, s as isModelSelectionLocked } from "./model-overrides-FXSJttoI.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { n as parseSessionThreadInfoFast } from "./thread-info-cIAJ239O.mjs";
import { c as sortRealtimeVoiceActivationNames, o as normalizeSupportedRealtimeVoiceActivationName } from "./activation-name-ChkvJJSE.mjs";
import { C as collectRealtimeVoiceAgentConsultVisibleText, E as resolveRealtimeVoiceAgentConsultToolPolicy, O as resolveRealtimeVoiceAgentConsultToolsAllow, b as buildRealtimeVoiceAgentConsultPrompt, o as buildRealtimeVoiceAgentControlSpeechMessage, t as REALTIME_VOICE_AGENT_CONTROL_FAILURE_MESSAGE } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import { t as createRealtimeVoiceOutputActivityTracker } from "./output-activity-tracker-DibtmiPc.mjs";
import { t as resolveConfiguredCapabilityProvider } from "./provider-selection-runtime-CS2P9sxk.mjs";
import { randomUUID } from "node:crypto";
//#region src/talk/provider-internal.ts
const INTERNAL_REALTIME_VOICE_PROVIDER = Symbol.for("openclaw.internal.realtime-voice-provider.v1");
function readInternalRealtimeVoiceProviderApi(provider) {
	const value = Reflect.get(provider, INTERNAL_REALTIME_VOICE_PROVIDER);
	if (!value || typeof value !== "object") return;
	const api = value;
	return typeof api.isBrowserSessionConfigured === "function" ? api : void 0;
}
function isInternalRealtimeVoiceBrowserSessionConfigured(params) {
	return readInternalRealtimeVoiceProviderApi(params.provider)?.isBrowserSessionConfigured({
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		agentId: params.agentId
	});
}
function resolveInternalRealtimeVoiceBrowserSessionCapabilities(params) {
	return readInternalRealtimeVoiceProviderApi(params.provider)?.resolveBrowserSessionCapabilities?.({
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		agentId: params.agentId,
		model: params.model,
		...params.clientControl ? { clientControl: params.clientControl } : {}
	});
}
function isInternalRealtimeVoiceGatewayRelayConfigured(params) {
	return readInternalRealtimeVoiceProviderApi(params.provider)?.isGatewayRelayConfigured?.({
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		agentId: params.agentId
	});
}
function resolveInternalRealtimeVoiceGatewayRelayCapabilities(params) {
	return readInternalRealtimeVoiceProviderApi(params.provider)?.resolveGatewayRelayCapabilities?.({
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		model: params.model
	});
}
function projectInternalRealtimeVoicePublicConfig(params) {
	return projectInternalRealtimeVoicePublicProjection(params).config;
}
function projectInternalRealtimeVoicePublicProjection(params) {
	const projected = ((params.provider ? readInternalRealtimeVoiceProviderApi(params.provider)?.projectPublicProjection : void 0) ?? (params.providerId ? resolveBundledProviderPolicySurface(params.providerId)?.projectRealtimeVoicePublicProjection : void 0))?.({
		providerConfig: params.providerConfig,
		config: params.config
	});
	if (projected) return {
		...projected,
		config: projected.config
	};
	return { config: params.config };
}
function resolveInternalRealtimeVoiceGatewayRelayLaunchError(params) {
	return readInternalRealtimeVoiceProviderApi(params.provider)?.validateGatewayRelayLaunch?.({
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		model: params.model,
		autoRespondToAudio: params.autoRespondToAudio
	});
}
async function cancelInternalRealtimeVoiceBrowserSession(params) {
	await readInternalRealtimeVoiceProviderApi(params.provider)?.cancelBrowserSession?.(params.request, params.session);
}
//#endregion
//#region src/talk/talk-events.ts
/**
* Canonical event names emitted by Talk sessions across realtime and STT/TTS flows.
*/
const TALK_EVENT_TYPES = [
	"session.started",
	"session.ready",
	"session.closed",
	"session.error",
	"session.replaced",
	"turn.started",
	"turn.ended",
	"turn.cancelled",
	"capture.started",
	"capture.stopped",
	"capture.cancelled",
	"capture.once",
	"input.audio.delta",
	"input.audio.committed",
	"transcript.delta",
	"transcript.done",
	"output.text.delta",
	"output.text.done",
	"output.audio.started",
	"output.audio.delta",
	"output.audio.done",
	"tool.call",
	"tool.progress",
	"tool.result",
	"tool.error",
	"usage.metrics",
	"latency.metrics",
	"health.changed"
];
const TURN_SCOPED_TALK_EVENT_TYPES = /* @__PURE__ */ new Set([
	"turn.started",
	"turn.ended",
	"turn.cancelled",
	"input.audio.delta",
	"input.audio.committed",
	"transcript.delta",
	"transcript.done",
	"output.text.delta",
	"output.text.done",
	"output.audio.started",
	"output.audio.delta",
	"output.audio.done",
	"tool.call",
	"tool.progress",
	"tool.result",
	"tool.error"
]);
const CAPTURE_SCOPED_TALK_EVENT_TYPES = /* @__PURE__ */ new Set([
	"capture.started",
	"capture.stopped",
	"capture.cancelled",
	"capture.once"
]);
function assertTalkEventCorrelation(input) {
	if (TURN_SCOPED_TALK_EVENT_TYPES.has(input.type) && !input.turnId?.trim()) throw new Error(`Talk event ${input.type} requires turnId`);
	if (CAPTURE_SCOPED_TALK_EVENT_TYPES.has(input.type) && !input.captureId?.trim()) throw new Error(`Talk event ${input.type} requires captureId`);
}
/**
* Creates a sequencer that stamps Talk events with stable session context and monotonic ids.
*/
function createTalkEventSequencer(context, options = {}) {
	let seq = 0;
	const now = options.now ?? (() => /* @__PURE__ */ new Date());
	return { next(input) {
		assertTalkEventCorrelation(input);
		seq += 1;
		const timestamp = input.timestamp ?? (() => {
			const value = now();
			return typeof value === "string" ? value : value.toISOString();
		})();
		return {
			...context,
			id: `${context.sessionId}:${seq}`,
			type: input.type,
			turnId: input.turnId,
			captureId: input.captureId,
			seq,
			timestamp,
			final: input.final,
			callId: input.callId,
			itemId: input.itemId,
			parentId: input.parentId,
			payload: input.payload
		};
	} };
}
//#endregion
//#region src/talk/event-metrics.ts
/**
* Shared metric extraction helpers for Talk event diagnostics and logging.
*
* Talk event payloads are provider-owned JSON blobs, so callers must coerce
* records and read only bounded numeric counters that are safe to export.
*/
/** Read the first non-negative finite number from a provider payload record. */
function firstFiniteTalkEventNumber(record, keys) {
	if (!record) return;
	for (const key of keys) {
		const value = asNonNegativeFiniteNumber(record[key]);
		if (value !== void 0) return value;
	}
}
//#endregion
//#region src/talk/diagnostics.ts
/**
* Privacy-preserving Talk diagnostic event projection.
*
* The diagnostic stream needs timing and size counters for reliability work,
* but must not export raw provider payloads, transcripts, or audio content.
*/
/** Convert a Talk event into the bounded diagnostic payload shape. */
function createTalkDiagnosticEvent(event) {
	const payload = asOptionalRecord(event.payload);
	return {
		type: "talk.event",
		sessionId: event.sessionId,
		turnId: event.turnId,
		captureId: event.captureId,
		talkEventType: event.type,
		mode: event.mode,
		transport: event.transport,
		brain: event.brain,
		provider: event.provider,
		final: event.final,
		durationMs: firstFiniteTalkEventNumber(payload, [
			"durationMs",
			"latencyMs",
			"elapsedMs"
		]),
		byteLength: firstFiniteTalkEventNumber(payload, ["byteLength", "audioBytes"])
	};
}
/** Emit a trusted internal diagnostic event for one Talk event. */
function recordTalkDiagnosticEvent(event) {
	emitTrustedDiagnosticEvent(createTalkDiagnosticEvent(event));
}
//#endregion
//#region src/talk/logging.ts
const OMITTED_TALK_LOG_EVENT_TYPES = /* @__PURE__ */ new Set([
	"input.audio.delta",
	"output.audio.delta",
	"output.text.delta",
	"transcript.delta",
	"tool.progress"
]);
const TALK_LOGGER_BINDINGS = Object.freeze({ subsystem: "talk" });
/**
* Converts high-level Talk events into compact structured log records, skipping noisy deltas.
*/
function createTalkLogRecord(event) {
	if (OMITTED_TALK_LOG_EVENT_TYPES.has(event.type)) return;
	const payload = asOptionalRecord(event.payload);
	const attributes = {
		sessionId: event.sessionId,
		talkEventType: event.type,
		talkMode: event.mode,
		talkTransport: event.transport,
		talkBrain: event.brain
	};
	if (event.provider) attributes.talkProvider = event.provider;
	if (typeof event.final === "boolean") attributes.talkFinal = event.final;
	const durationMs = firstFiniteTalkEventNumber(payload, [
		"durationMs",
		"latencyMs",
		"elapsedMs"
	]);
	if (durationMs !== void 0) attributes.talkDurationMs = durationMs;
	const byteLength = firstFiniteTalkEventNumber(payload, ["byteLength", "audioBytes"]);
	if (byteLength !== void 0) attributes.talkByteLength = byteLength;
	return {
		level: event.type === "session.error" || event.type === "tool.error" ? "warn" : "info",
		message: `talk event ${event.type}`,
		attributes
	};
}
/**
* Emits Talk logs best-effort so logging failures never break realtime audio handling.
*/
function recordTalkLogEvent(event) {
	const record = createTalkLogRecord(event);
	if (!record) return;
	try {
		const logger = getChildLogger(TALK_LOGGER_BINDINGS);
		if (record.level === "warn") {
			logger.warn(record.attributes, record.message);
			return;
		}
		logger.info(record.attributes, record.message);
	} catch {}
}
//#endregion
//#region src/talk/observability.ts
/**
* Combined Talk observability hook for relays and SDK consumers.
*
* A single Talk event should feed both trusted diagnostics and structured logs;
* this facade keeps relay call sites from choosing only one path.
*/
/** Record one Talk event through diagnostics and logging projections. */
function recordTalkObservabilityEvent(event) {
	recordTalkDiagnosticEvent(event);
	recordTalkLogEvent(event);
}
//#endregion
//#region src/talk/talk-session-controller.ts
function defaultTalkEventPayload(payload) {
	return payload === void 0 ? {} : payload;
}
/**
* Creates a per-session Talk controller that emits correlated turn and output-audio events.
*/
function createTalkSessionController(params, options = {}) {
	const { maxRecentEvents = 20, turnIdPrefix = "turn", ...context } = params;
	const sequencer = options.sequencer ?? createTalkEventSequencer(context, { now: options.now });
	const recentEvents = [];
	let activeTurnId;
	let outputAudioActive = false;
	let turnSeq = 0;
	const remember = (event) => {
		recentEvents.push(event);
		if (recentEvents.length > maxRecentEvents) recentEvents.splice(0, recentEvents.length - maxRecentEvents);
		try {
			options.onEvent?.(event);
		} catch {}
		return event;
	};
	const emit = (input) => {
		return remember(sequencer.next(input));
	};
	const resolveActiveTurn = (requestedTurnId) => {
		if (!activeTurnId) return {
			ok: false,
			reason: "no_active_turn"
		};
		const normalizedRequested = normalizeOptionalString(requestedTurnId);
		if (normalizedRequested && normalizedRequested !== activeTurnId) return {
			ok: false,
			reason: "stale_turn"
		};
		return activeTurnId;
	};
	const ensureTurn = (ensureParams = {}) => {
		if (activeTurnId) return { turnId: activeTurnId };
		return startTurn(ensureParams);
	};
	const startTurn = (startParams = {}) => {
		const turnId = normalizeOptionalString(startParams.turnId) ?? `${turnIdPrefix}-${++turnSeq}`;
		outputAudioActive = false;
		activeTurnId = turnId;
		return {
			turnId,
			event: emit({
				type: "turn.started",
				turnId,
				payload: defaultTalkEventPayload(startParams.payload)
			})
		};
	};
	const finishTurn = (type, paramsForTurn = {}) => {
		const turnId = resolveActiveTurn(paramsForTurn.turnId);
		if (typeof turnId !== "string") return turnId;
		outputAudioActive = false;
		activeTurnId = void 0;
		return {
			ok: true,
			turnId,
			event: emit({
				type,
				turnId,
				payload: defaultTalkEventPayload(paramsForTurn.payload),
				final: true
			})
		};
	};
	return {
		get activeTurnId() {
			return activeTurnId;
		},
		context,
		get outputAudioActive() {
			return outputAudioActive;
		},
		get recentEvents() {
			return recentEvents;
		},
		clearActiveTurn() {
			activeTurnId = void 0;
			outputAudioActive = false;
		},
		emit,
		ensureTurn,
		startTurn,
		endTurn(paramsForTurn) {
			return finishTurn("turn.ended", paramsForTurn);
		},
		cancelTurn(paramsForTurn) {
			return finishTurn("turn.cancelled", paramsForTurn);
		},
		finishOutputAudio(paramsForOutput = {}) {
			if (!outputAudioActive) return;
			const turnId = resolveActiveTurn(paramsForOutput.turnId);
			if (typeof turnId !== "string") return;
			outputAudioActive = false;
			return emit({
				type: "output.audio.done",
				turnId,
				payload: defaultTalkEventPayload(paramsForOutput.payload),
				final: true
			});
		},
		startOutputAudio(paramsForOutput = {}) {
			const turn = ensureTurn({
				turnId: paramsForOutput.turnId,
				payload: {}
			});
			if (outputAudioActive) return { turnId: turn.turnId };
			outputAudioActive = true;
			return {
				turnId: turn.turnId,
				event: emit({
					type: "output.audio.started",
					turnId: turn.turnId,
					payload: defaultTalkEventPayload(paramsForOutput.payload)
				})
			};
		}
	};
}
/**
* Normalizes legacy realtime transport names into Talk transport families.
*/
function normalizeTalkTransport(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	if (normalized === "webrtc-sdp") return "webrtc";
	if (normalized === "json-pcm-websocket") return "provider-websocket";
	return normalized;
}
//#endregion
//#region src/talk/consult-question.ts
/**
* Realtime voice consult-question extraction and result summarization helpers.
*
* These utilities connect Talk tool calls to spoken follow-up answers by
* pulling human-readable questions/results out of provider-owned payloads.
*/
const REALTIME_VOICE_CONSULT_QUESTION_STOPWORDS = /* @__PURE__ */ new Set([
	"a",
	"an",
	"and",
	"are",
	"can",
	"check",
	"could",
	"for",
	"in",
	"is",
	"it",
	"look",
	"me",
	"of",
	"on",
	"or",
	"please",
	"see",
	"that",
	"the",
	"this",
	"to",
	"would",
	"you"
]);
const DEFAULT_REALTIME_VOICE_CONSULT_QUESTION_KEYS = [
	"question",
	"prompt",
	"query",
	"task"
];
const DEFAULT_REALTIME_VOICE_SPEAKABLE_RESULT_KEYS = [
	"text",
	"result",
	"output",
	"error"
];
const DEFAULT_REALTIME_VOICE_SPEAKABLE_RESULT_MAX_CHARS = 1800;
/** Read the consult question from a raw string or selected object keys. */
function readRealtimeVoiceConsultQuestion(args, keys = DEFAULT_REALTIME_VOICE_CONSULT_QUESTION_KEYS) {
	if (typeof args === "string") return normalizeOptionalString(args);
	if (!args || typeof args !== "object" || Array.isArray(args)) return;
	return readTrimmedStringAlias(args, keys);
}
/** Normalize consult questions for stable matching across punctuation/casing. */
function normalizeRealtimeVoiceConsultQuestion(value) {
	return value?.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/gu, " ").trim() || void 0;
}
/** Compare two consult questions with exact, containment, and token-overlap matching. */
function matchRealtimeVoiceConsultQuestions(left, right, options = {}) {
	const normalizedLeft = normalizeRealtimeVoiceConsultQuestion(left);
	const normalizedRight = normalizeRealtimeVoiceConsultQuestion(right);
	if (!normalizedLeft || !normalizedRight) return false;
	if (normalizedLeft === normalizedRight || normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft)) return true;
	const leftTokens = realtimeVoiceConsultQuestionTokens(normalizedLeft);
	const rightTokens = realtimeVoiceConsultQuestionTokens(normalizedRight);
	if (leftTokens.size === 0 || rightTokens.size === 0) return false;
	let overlap = 0;
	for (const token of leftTokens) if (rightTokens.has(token)) overlap += 1;
	const minTokenOverlapCount = options.minTokenOverlapCount ?? 2;
	if (overlap < minTokenOverlapCount) return false;
	const minTokenOverlapRatio = options.minTokenOverlapRatio ?? .6;
	return overlap / Math.min(leftTokens.size, rightTokens.size) >= minTokenOverlapRatio;
}
/** Extract a bounded speakable string from a tool result payload. */
function readSpeakableRealtimeVoiceToolResult(result, options = {}) {
	if (typeof result === "string") return limitSpeakableRealtimeVoiceToolResult(result, options.maxChars);
	if (!result || typeof result !== "object" || Array.isArray(result)) return;
	const record = result;
	const keys = options.keys ?? DEFAULT_REALTIME_VOICE_SPEAKABLE_RESULT_KEYS;
	const value = readTrimmedStringAlias(record, keys);
	return value ? limitSpeakableRealtimeVoiceToolResult(value, options.maxChars) : void 0;
}
function realtimeVoiceConsultQuestionTokens(value) {
	return new Set(value.split(/[^\p{L}\p{N}]+/gu).map((token) => token.trim()).filter((token) => token.length >= 2 && !REALTIME_VOICE_CONSULT_QUESTION_STOPWORDS.has(token)));
}
function limitSpeakableRealtimeVoiceToolResult(value, maxChars = DEFAULT_REALTIME_VOICE_SPEAKABLE_RESULT_MAX_CHARS) {
	const trimmed = value.trim();
	if (!trimmed) return;
	if (trimmed.length <= maxChars) return trimmed;
	return `${truncateUtf16Safe(trimmed, Math.max(0, maxChars - 16)).trimEnd()} [truncated]`;
}
//#endregion
//#region src/talk/forced-consult-coordinator.ts
/**
* Forced-consult dedupe coordinator for realtime voice sessions.
*
* The relay may synthesize an OpenClaw consult when the model hesitates, but a
* native provider tool call can still arrive later. This coordinator prevents
* duplicate consults and keeps late native calls correlated to forced handles.
*/
const DEFAULT_REALTIME_VOICE_FORCED_CONSULT_NATIVE_DEDUPE_MS = 2e3;
const DEFAULT_REALTIME_VOICE_FORCED_CONSULT_LIMIT = 12;
/** Create an in-memory forced-consult coordinator for one realtime session. */
function createRealtimeVoiceForcedConsultCoordinator(options = {}) {
	const state = /* @__PURE__ */ new Map();
	const recentNativeConsults = [];
	let nextId = 0;
	const now = options.now ?? Date.now;
	const limit = options.limit ?? DEFAULT_REALTIME_VOICE_FORCED_CONSULT_LIMIT;
	const nativeDedupeMs = options.nativeDedupeMs ?? DEFAULT_REALTIME_VOICE_FORCED_CONSULT_NATIVE_DEDUPE_MS;
	const setTimer = options.setTimer ?? ((fn, ms) => {
		const timer = setTimeout(fn, ms);
		timer.unref?.();
		return { clear: () => clearTimeout(timer) };
	});
	const questionsMatch = options.questionsMatch ?? matchRealtimeVoiceConsultQuestions;
	const clearTimer = (stored) => {
		stored.timer?.clear();
		stored.timer = void 0;
	};
	const scheduleCleanup = (stored) => {
		stored.cleanupTimer?.clear();
		stored.cleanupTimer = setTimer(() => {
			if (state.get(stored.handle.id) === stored) state.delete(stored.handle.id);
		}, nativeDedupeMs);
	};
	const prune = () => {
		const earliestRecentNative = now() - nativeDedupeMs;
		for (let index = recentNativeConsults.length - 1; index >= 0; index -= 1) {
			const recent = recentNativeConsults[index];
			if (recent && recent.at < earliestRecentNative) recentNativeConsults.splice(index, 1);
		}
		while (recentNativeConsults.length > limit) recentNativeConsults.shift();
		while (state.size > limit) {
			const first = state.values().next().value;
			if (!first) return;
			first.timer?.clear();
			first.cleanupTimer?.clear();
			state.delete(first.handle.id);
		}
	};
	const findMatching = (question) => {
		if (!question) return;
		return [...state.values()].toReversed().find((candidate) => candidate.questions.some((candidateQuestion) => questionsMatch(candidateQuestion, question)));
	};
	const rememberStoredQuestion = (stored, question) => {
		const trimmed = question?.trim();
		if (!trimmed) return;
		if (stored.questions.some((candidate) => questionsMatch(candidate, trimmed))) return;
		stored.questions.push(trimmed);
	};
	const recordRecentNativeConsult = (question) => {
		recentNativeConsults.push({
			question,
			at: now()
		});
		prune();
	};
	const hasRecentNativeConsult = (question, recentOptions = {}) => {
		prune();
		return recentNativeConsults.toReversed().some((recent) => recent.question ? questionsMatch(recent.question, question) : recentOptions.allowUnknownQuestion === true);
	};
	const getStored = (handle) => state.get(handle.id);
	return {
		prepare(question, prepareOptions) {
			const trimmed = question.trim();
			if (!trimmed) return;
			const id = prepareOptions?.id ?? `forced-consult:${now()}:${++nextId}`;
			const existing = state.get(id);
			if (existing) {
				existing.timer?.clear();
				existing.cleanupTimer?.clear();
			}
			const handle = {
				id,
				question: trimmed,
				...prepareOptions && "context" in prepareOptions ? { context: prepareOptions.context } : {}
			};
			state.set(handle.id, {
				handle,
				createdAt: now(),
				nativeCallIds: /* @__PURE__ */ new Set(),
				questions: [trimmed],
				pending: true,
				started: false,
				delivered: false,
				cancelled: false
			});
			prune();
			return handle;
		},
		schedule(handle, delayMs, run) {
			const stored = getStored(handle);
			if (!stored || !stored.pending || stored.timer) return;
			stored.timer = setTimer(() => {
				stored.timer = void 0;
				if (state.get(handle.id) === stored && stored.pending && !stored.cancelled) run(handle);
			}, resolveTimerTimeoutMs(delayMs, 0, 0));
		},
		clearPending() {
			for (const stored of state.values()) if (stored.pending) {
				clearTimer(stored);
				state.delete(stored.handle.id);
			}
		},
		consumePending(question) {
			const pendingCandidates = [...state.values()].filter((candidate) => candidate.pending);
			const stored = !question && pendingCandidates.length === 1 ? pendingCandidates[0] : pendingCandidates.toReversed().find((candidate) => candidate.questions.some((candidateQuestion) => questionsMatch(candidateQuestion, question)));
			if (!stored?.pending) return;
			clearTimer(stored);
			stored.pending = false;
			return stored.handle;
		},
		cancelPending(handle) {
			const stored = getStored(handle);
			if (!stored?.pending) return;
			clearTimer(stored);
			stored.pending = false;
			state.delete(handle.id);
		},
		recordNativeConsult(args, nativeCallId) {
			const question = readRealtimeVoiceConsultQuestion(args);
			recordRecentNativeConsult(question);
			const pending = [...state.values()].toReversed().find((candidate) => candidate.pending && candidate.questions.some((candidateQuestion) => questionsMatch(candidateQuestion, question)));
			if (pending) {
				clearTimer(pending);
				rememberStoredQuestion(pending, question);
				if (nativeCallId) pending.nativeCallIds.add(nativeCallId);
				pending.pending = false;
				scheduleCleanup(pending);
				return {
					kind: "pending",
					question,
					handle: pending.handle
				};
			}
			const stored = findMatching(question);
			if (!stored) return {
				kind: "none",
				question
			};
			if (nativeCallId) stored.nativeCallIds.add(nativeCallId);
			rememberStoredQuestion(stored, question);
			if (stored.cancelled) return {
				kind: "already_delivered",
				question,
				handle: stored.handle
			};
			if (stored.delivered) return {
				kind: "already_delivered",
				question,
				handle: stored.handle
			};
			if (stored.started) return {
				kind: "in_flight",
				question,
				handle: stored.handle
			};
			return {
				kind: "none",
				question
			};
		},
		markStarted(handle) {
			const stored = getStored(handle);
			if (!stored) return;
			clearTimer(stored);
			stored.pending = false;
			stored.started = true;
		},
		markDelivered(handle) {
			const stored = getStored(handle);
			if (!stored) return;
			clearTimer(stored);
			stored.pending = false;
			stored.started = true;
			stored.delivered = true;
			scheduleCleanup(stored);
		},
		markCancelled(handle) {
			const stored = getStored(handle);
			if (!stored || stored.delivered) return;
			clearTimer(stored);
			stored.pending = false;
			stored.cancelled = true;
			scheduleCleanup(stored);
		},
		isCancelled(handle) {
			return getStored(handle)?.cancelled === true;
		},
		nativeCallIds(handle) {
			return [...getStored(handle)?.nativeCallIds ?? []];
		},
		handles() {
			return [...state.values()].map((stored) => stored.handle);
		},
		rememberQuestion(handle, question) {
			const stored = getStored(handle);
			if (stored) rememberStoredQuestion(stored, question);
		},
		findRecent(question) {
			prune();
			return findMatching(question)?.handle;
		},
		hasRecent(question) {
			return Boolean(findMatching(question));
		},
		hasRecentNativeConsult,
		remove(handle) {
			const stored = getStored(handle);
			stored?.timer?.clear();
			stored?.cleanupTimer?.clear();
			state.delete(handle.id);
		},
		clear() {
			for (const stored of state.values()) {
				stored.timer?.clear();
				stored.cleanupTimer?.clear();
			}
			state.clear();
			recentNativeConsults.length = 0;
		}
	};
}
//#endregion
//#region src/talk/realtime-session-policy.ts
/** Resolve generic consult, activation-name, and auto-response session policy. */
function resolveRealtimeVoiceSessionPolicy(params) {
	const handlesAgentConsult = params.capabilities?.handlesAgentConsult === true;
	if (handlesAgentConsult && (params.requireWakeName === true || params.configuredConsultPolicy === "always")) throw new Error("This realtime model owns voice responses and delegation. Remove requireWakeName: true and consultPolicy: always, or select a model that supports host-controlled turns.");
	const toolPolicy = resolveRealtimeVoiceAgentConsultToolPolicy(params.configuredToolPolicy, params.isAgentProxy ? "owner" : "safe-read-only");
	const consultPolicy = params.configuredConsultPolicy ?? (params.isAgentProxy && !handlesAgentConsult ? "always" : "auto");
	const wakeNamePolicy = resolveRealtimeVoiceWakeNamePolicy({
		...params,
		supportsActivationNameGating: !handlesAgentConsult && (params.capabilities?.supportsActivationNameGating ?? params.supportsActivationNameGating) === true
	});
	const wakeNames = wakeNamePolicy === "never" ? [] : resolveRealtimeVoiceWakeNames({
		configuredWakeNames: params.configuredWakeNames,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return {
		handlesAgentConsult,
		toolPolicy,
		consultToolsAllow: resolveRealtimeVoiceAgentConsultToolsAllow(toolPolicy),
		consultPolicy,
		wakeNamePolicy,
		wakeNames,
		autoRespondToAudio: wakeNamePolicy === "never" && (!params.isAgentProxy || consultPolicy !== "always")
	};
}
function isRealtimeVoiceWakeNameRequired(policy, humanParticipantCount) {
	return policy === "always" || policy === "automatic" && humanParticipantCount > 1;
}
function resolveRealtimeVoiceInterruptResponseOnInputAudio(value) {
	return asBoolean(value) ?? true;
}
function resolveRealtimeVoiceBargeIn(params) {
	if (params.capabilities?.supportsBargeIn === false || params.outputAudioMode === "continuous") return false;
	if (typeof params.configuredBargeIn === "boolean") return params.configuredBargeIn;
	return resolveRealtimeVoiceInterruptResponseOnInputAudio(params.interruptResponseOnInputAudio);
}
function resolveRealtimeVoiceMinBargeInAudioEndMs(configured) {
	return typeof configured === "number" ? configured : 250;
}
function resolveRealtimeVoiceWakeNamePolicy(params) {
	if (!params.isAgentProxy || !params.supportsActivationNameGating) return "never";
	if (params.requireWakeName === true) return "always";
	if (params.requireWakeName === false) return "never";
	return "automatic";
}
function resolveRealtimeVoiceWakeNames(params) {
	if (params.configuredWakeNames !== void 0) {
		const configured = params.configuredWakeNames.map((name) => normalizeSupportedRealtimeVoiceActivationName(name)).filter((name) => Boolean(name));
		return sortRealtimeVoiceActivationNames(uniqueStrings(configured));
	}
	const agent = params.cfg.agents?.list?.find((candidate) => candidate.id === params.agentId);
	const configuredAgentNames = [agent?.name, agent?.identity?.name].map((name) => normalizeSupportedRealtimeVoiceActivationName(name)).filter((name) => Boolean(name));
	const productWakeNames = [normalizeSupportedRealtimeVoiceActivationName("OpenClaw")].filter((name) => Boolean(name));
	const defaults = configuredAgentNames.length > 0 ? [...configuredAgentNames, ...productWakeNames] : [normalizeSupportedRealtimeVoiceActivationName(params.agentId), ...productWakeNames].filter((name) => Boolean(name));
	return sortRealtimeVoiceActivationNames(uniqueStrings(defaults));
}
//#endregion
//#region src/talk/agent-consult-runtime.ts
const REALTIME_VOICE_YIELD_ACK_MAX_CHARS = 500;
const REALTIME_VOICE_YIELD_ACK_FALLBACK = "I started that work and will share the result when it is ready.";
/**
* Sender-auth contract revision for official realtime voice plugins.
*
* Revision 1 forwards ingress-authenticated `senderId` and `senderIsOwner` unchanged. Ingress
* owns authentication; consumers that require this handoff must fail closed on other revisions.
*/
const REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION = 1;
/**
* Fails closed when a realtime consult would cross a model-selection lock.
*/
function assertRealtimeVoiceAgentConsultModelSelectionUnlocked(params) {
	const candidates = /* @__PURE__ */ new Map();
	const remember = (sessionKey, fallbackAgentId, storePath) => {
		const candidateAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? fallbackAgentId;
		const candidateStorePath = storePath ?? params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, { agentId: candidateAgentId });
		candidates.set(`${candidateStorePath}\u0000${sessionKey}`, {
			agentId: candidateAgentId,
			sessionKey,
			storePath: candidateStorePath
		});
	};
	remember(params.sessionKey, params.agentId, params.storePath);
	const requesterSessionKey = params.spawnedBy?.trim();
	const requesterAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId;
	const targetAgentId = parseAgentSessionKey(params.sessionKey)?.agentId ?? params.agentId;
	if (requesterSessionKey && (!requesterAgentId || requesterAgentId === targetAgentId)) {
		const requesterAgent = requesterAgentId ?? params.agentId;
		remember(requesterSessionKey, requesterAgent);
		const { baseSessionKey } = parseSessionThreadInfoFast(requesterSessionKey);
		if (baseSessionKey && baseSessionKey !== requesterSessionKey) remember(baseSessionKey, requesterAgent);
	}
	for (const { agentId, sessionKey, storePath } of candidates.values()) {
		const entry = params.agentRuntime.session.getSessionEntry({
			agentId,
			storePath,
			sessionKey,
			readConsistency: "latest"
		});
		if (isModelSelectionLocked(entry)) throw new ModelSelectionLockedError();
	}
}
function resolveRealtimeVoiceAgentSandboxSessionKey(agentId, sessionKey) {
	const trimmed = sessionKey.trim();
	if (trimmed.toLowerCase().startsWith("agent:")) return trimmed;
	return `agent:${agentId}:${trimmed}`;
}
function resolveDeliverySessionFields(context) {
	const normalized = normalizeDeliveryContext(context);
	if (!normalized?.channel || !normalized.to) return {};
	return { delivery: normalizeSessionDeliveryState({ context: normalized }) };
}
function resolveRealtimeVoiceAgentDeliveryContext(params) {
	const requesterSessionKey = params.spawnedBy?.trim();
	try {
		const candidates = [];
		if (requesterSessionKey) {
			const { baseSessionKey } = parseSessionThreadInfoFast(requesterSessionKey);
			for (const key of [requesterSessionKey, baseSessionKey]) if (key) candidates.push({ sessionKey: key });
		}
		candidates.push({
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		for (const candidate of candidates) {
			const agentId = parseAgentSessionKey(candidate.sessionKey)?.agentId ?? params.agentId;
			const storePath = candidate.storePath ?? params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, { agentId });
			const entry = params.agentRuntime.session.getSessionEntry({
				agentId,
				storePath,
				sessionKey: candidate.sessionKey
			});
			const context = deliveryContextFromSession(entry);
			if (hasDeliveryTargetFields(context)) return context;
		}
	} catch {}
}
/** Current caller-side facts shared by consultation and inbound voice steering. */
function prepareRealtimeVoiceAgentExecutionContext(params) {
	const agentId = params.agentId ?? resolveSessionAgentId({
		config: params.cfg,
		sessionKey: params.sessionKey
	});
	const storePath = params.storePath ?? params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, { agentId });
	const sessionEntry = params.sessionEntry ?? params.agentRuntime.session.getSessionEntry({
		agentId,
		storePath,
		sessionKey: params.sessionKey,
		readConsistency: "latest"
	});
	const deliveryContext = resolveRealtimeVoiceAgentDeliveryContext({
		...params,
		agentId,
		storePath
	}) ?? deliveryContextFromSession(sessionEntry);
	return {
		agentId,
		storePath,
		sessionEntry,
		deliveryContext,
		toolAuthorityOverlay: {
			permissionMode: sessionEntry?.permissionMode,
			toolOverrides: sessionEntry?.toolOverrides,
			messageProvider: deliveryContext?.channel ?? params.messageProvider,
			agentAccountId: deliveryContext?.accountId,
			spawnedBy: params.spawnedBy ?? void 0,
			senderId: params.senderId ?? void 0,
			senderIsOwner: params.senderIsOwner === true,
			toolsAllow: params.toolsAllow,
			disableTools: false,
			traceAuthorized: false
		},
		agentDir: params.agentRuntime.resolveAgentDir(params.cfg, agentId),
		workspaceDir: params.agentRuntime.resolveAgentWorkspaceDir(params.cfg, agentId)
	};
}
async function resolveRealtimeVoiceAgentConsultSessionEntry(params) {
	const now = Date.now();
	const deliveryFields = resolveDeliverySessionFields(params.deliveryContext);
	const requesterSessionKey = params.spawnedBy?.trim();
	const requesterAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId;
	const requesterEntry = requesterSessionKey ? params.agentRuntime.session.getSessionEntry({
		agentId: requesterAgentId ?? params.agentId,
		storePath: params.agentRuntime.session.resolveStorePath(params.cfg.session?.store, { agentId: requesterAgentId ?? params.agentId }),
		sessionKey: requesterSessionKey,
		readConsistency: "latest"
	}) : void 0;
	const creationStamp = buildSessionCreationStamp({
		via: "talk",
		...inheritSessionCreationPolicy(requesterEntry, requesterSessionKey ? {
			type: "agent",
			id: requesterSessionKey
		} : void 0)
	});
	const shouldFork = params.contextMode === "fork" && requesterSessionKey && (!requesterAgentId || requesterAgentId === params.agentId);
	let forkDecisionWarning;
	let patched = null;
	if (shouldFork) {
		const { forkSessionEntryFromParent } = await import("./session-fork-BELuFrRf.mjs");
		const forked = await forkSessionEntryFromParent({
			storePath: params.storePath,
			parentSessionKey: requesterSessionKey,
			agentId: params.agentId,
			config: params.cfg,
			sessionKey: params.sessionKey,
			fallbackEntry: {
				...creationStamp,
				sessionId: "",
				updatedAt: now
			},
			skipForkWhen: (entry) => Boolean(entry.sessionId?.trim()),
			skipPatch: () => ({
				...deliveryFields,
				updatedAt: now
			}),
			patch: () => ({
				...deliveryFields,
				spawnedBy: requesterSessionKey,
				updatedAt: now
			})
		});
		if (forked.status === "forked" || forked.status === "skipped") {
			if (forked.status === "skipped" && forked.decision?.status === "skip") forkDecisionWarning = forked.decision.message;
			if (forked.sessionEntry.sessionId?.trim()) patched = forked.sessionEntry;
		}
	}
	patched ??= await params.agentRuntime.session.patchSessionEntry({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		fallbackEntry: {
			...creationStamp,
			sessionId: "",
			updatedAt: now
		},
		update: async (entry) => {
			if (entry.sessionId?.trim()) return {
				...deliveryFields,
				updatedAt: now
			};
			return {
				...deliveryFields,
				sessionId: randomUUID(),
				...requesterSessionKey ? { spawnedBy: requesterSessionKey } : {},
				updatedAt: now
			};
		}
	});
	if (forkDecisionWarning) params.logger.warn(`[talk] ${forkDecisionWarning}`);
	if (patched?.sessionId?.trim()) return patched;
	throw new Error("realtime voice agent consult session could not be initialized");
}
function assertRealtimeVoiceConsultNotInterrupted(abortSignal, meta) {
	const outcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: "end",
		data: meta,
		abortSignal
	});
	const classification = classifyAgentRunTerminalOutcome(outcome);
	if (classification === "cancellation") throw new DOMException("Realtime voice agent consult cancelled", "AbortError");
	if (classification === "timeout") throw new DOMException("Realtime voice agent consult timed out", "TimeoutError");
}
/**
* Runs an embedded agent consult and returns concise speakable text for realtime voice playback.
*/
async function consultRealtimeVoiceAgent(params) {
	params.abortSignal?.throwIfAborted();
	const [{ beginSessionWorkAdmission }, { resolveSessionWorkStartError }] = await Promise.all([import("./session-lifecycle-admission-DAijprei.mjs"), import("./lifecycle-6QU7L3p3.mjs")]);
	params.abortSignal?.throwIfAborted();
	const { agentId, agentDir, workspaceDir, storePath, sessionEntry: initialSessionEntry } = prepareRealtimeVoiceAgentExecutionContext(params);
	const modelLockParams = {
		cfg: params.cfg,
		agentRuntime: params.agentRuntime,
		agentId,
		sessionKey: params.sessionKey,
		spawnedBy: params.spawnedBy,
		storePath
	};
	assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
	const lifecycleAbortController = new AbortController();
	const sessionWorkAdmission = await beginSessionWorkAdmission({
		scope: storePath,
		identities: [params.sessionKey, initialSessionEntry?.sessionId],
		onInterrupt: () => lifecycleAbortController.abort(/* @__PURE__ */ new Error("Realtime voice agent consult interrupted by a session lifecycle change.")),
		assertAllowed: () => {
			const currentEntry = params.agentRuntime.session.getSessionEntry({
				agentId,
				storePath,
				sessionKey: params.sessionKey,
				readConsistency: "latest"
			});
			if (initialSessionEntry ? !currentEntry || currentEntry.sessionId !== initialSessionEntry.sessionId : Boolean(currentEntry)) throw new Error(`Session "${params.sessionKey}" changed while starting work. Retry.`);
			const archivedSessionError = resolveSessionWorkStartError(params.sessionKey, currentEntry);
			if (archivedSessionError) throw new Error(archivedSessionError);
			assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
		}
	});
	const abortFromCaller = () => lifecycleAbortController.abort(params.abortSignal?.reason);
	if (params.abortSignal?.aborted) abortFromCaller();
	else params.abortSignal?.addEventListener("abort", abortFromCaller, { once: true });
	try {
		return await sessionWorkAdmission.run(async () => {
			await params.agentRuntime.ensureAgentWorkspace({ dir: workspaceDir });
			const resolvedDeliveryContext = resolveRealtimeVoiceAgentDeliveryContext({
				cfg: params.cfg,
				agentRuntime: params.agentRuntime,
				agentId,
				storePath,
				sessionKey: params.sessionKey,
				spawnedBy: params.spawnedBy
			});
			const sessionEntry = await resolveRealtimeVoiceAgentConsultSessionEntry({
				agentId,
				cfg: params.cfg,
				sessionKey: params.sessionKey,
				spawnedBy: params.spawnedBy,
				contextMode: params.contextMode,
				deliveryContext: resolvedDeliveryContext,
				storePath,
				agentRuntime: params.agentRuntime,
				logger: params.logger
			});
			const { deliveryContext: consultDeliveryContext, toolAuthorityOverlay } = prepareRealtimeVoiceAgentExecutionContext({
				...params,
				agentId,
				storePath,
				sessionEntry
			});
			const sessionId = sessionEntry.sessionId;
			assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
			const runId = `${params.runIdPrefix}-${randomUUID()}`;
			const timeoutMs = params.timeoutMs ?? params.agentRuntime.resolveAgentTimeoutMs({ cfg: params.cfg });
			const runRegistration = params.onRunStarted?.({
				runId,
				sessionId,
				timeoutMs
			});
			const abortSignal = runRegistration?.abortSignal ? AbortSignal.any([lifecycleAbortController.signal, runRegistration.abortSignal]) : lifecycleAbortController.signal;
			const result = await params.agentRuntime.runEmbeddedAgent({
				sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: {
					agentId,
					sessionId,
					sessionKey: params.sessionKey,
					storePath
				},
				sandboxSessionKey: resolveRealtimeVoiceAgentSandboxSessionKey(agentId, params.sessionKey),
				agentId,
				...toolAuthorityOverlay,
				messageProvider: toolAuthorityOverlay.messageProvider,
				messageTo: consultDeliveryContext?.to,
				messageThreadId: consultDeliveryContext?.threadId,
				currentChannelId: consultDeliveryContext?.to,
				currentThreadTs: consultDeliveryContext?.threadId != null ? String(consultDeliveryContext.threadId) : void 0,
				workspaceDir,
				config: params.cfg,
				prompt: buildRealtimeVoiceAgentConsultPrompt({
					args: params.args,
					transcript: params.transcript,
					surface: params.surface,
					userLabel: params.userLabel,
					assistantLabel: params.assistantLabel,
					questionSourceLabel: params.questionSourceLabel
				}),
				provider: params.provider,
				model: params.model,
				thinkLevel: params.thinkLevel ?? "high",
				fastMode: params.fastMode,
				verboseLevel: "off",
				reasoningLevel: "off",
				toolResultFormat: "plain",
				execSession: sessionEntry,
				toolsAllow: params.toolsAllow,
				timeoutMs,
				runId,
				lane: params.lane,
				extraSystemPrompt: params.extraSystemPrompt ?? "You are the configured OpenClaw agent receiving delegated requests from a live voice bridge. Act on behalf of the user, use available tools when appropriate, and return a brief speakable result.",
				agentDir,
				abortSignal
			}).catch((error) => {
				assertRealtimeVoiceConsultNotInterrupted(abortSignal);
				throw error;
			}).finally(() => runRegistration?.cleanup?.());
			assertRealtimeVoiceConsultNotInterrupted(abortSignal, result.meta);
			if (result.meta?.yielded === true) return {
				text: (typeof result.meta.yieldAcknowledgment === "string" ? truncateUtf16Safe(result.meta.yieldAcknowledgment.replaceAll(/\s+/g, " ").trim(), REALTIME_VOICE_YIELD_ACK_MAX_CHARS) : "") || REALTIME_VOICE_YIELD_ACK_FALLBACK,
				yielded: true
			};
			const currentInputPayloads = (result.payloads ?? []).filter((payload) => getReplyPayloadMetadata(payload)?.precedingInputAnswer !== true);
			const text = collectRealtimeVoiceAgentConsultVisibleText(currentInputPayloads);
			if (!text) {
				params.logger.warn("[talk] agent consult produced no answer: agent returned no speakable text");
				return { text: params.fallbackText ?? "I need a moment to verify that before answering." };
			}
			return { text };
		});
	} finally {
		params.abortSignal?.removeEventListener("abort", abortFromCaller);
		sessionWorkAdmission.release();
	}
}
//#endregion
//#region src/talk/agent-talkback-runtime.ts
const MAX_PENDING_QUESTIONS = 32;
const MAX_PENDING_QUESTION_CHARS = 32768;
/** Create a serial consult queue for realtime transcript talkback. */
function createRealtimeVoiceAgentTalkbackQueue(params) {
	let active = false;
	let closed = false;
	let pendingQuestions = [];
	let pendingQuestionChars = 0;
	let overflowWarned = false;
	let debounceTimer;
	let activeAbortController;
	const shouldStop = () => closed || params.isStopped();
	const clearDebounceTimer = () => {
		if (!debounceTimer) return;
		clearTimeout(debounceTimer);
		debounceTimer = void 0;
	};
	const appendPendingQuestion = (next) => {
		const current = pendingQuestions.at(-1);
		const mergeWithCurrent = current !== void 0 && Object.is(current.metadata, next.metadata);
		const addedChars = next.question.length + (mergeWithCurrent ? 1 : 0);
		const exceedsQuestionLimit = !mergeWithCurrent && pendingQuestions.length >= MAX_PENDING_QUESTIONS;
		const exceedsCharacterLimit = pendingQuestionChars + addedChars > MAX_PENDING_QUESTION_CHARS;
		if (exceedsQuestionLimit || exceedsCharacterLimit) {
			if (!overflowWarned) {
				overflowWarned = true;
				params.logger.warn(`${params.logPrefix} consult queue full: droppedChars=${next.question.length} queued=${pendingQuestions.length} queuedChars=${pendingQuestionChars}`);
			}
			return false;
		}
		if (current && mergeWithCurrent) current.question = `${current.question}\n${next.question}`;
		else pendingQuestions.push(next);
		pendingQuestionChars += addedChars;
		return true;
	};
	const shiftPendingQuestion = () => {
		const next = pendingQuestions.shift();
		if (!next) return;
		pendingQuestionChars -= next.question.length;
		if (pendingQuestions.length === 0) overflowWarned = false;
		return next;
	};
	const clearPendingQuestions = () => {
		pendingQuestions = [];
		pendingQuestionChars = 0;
		overflowWarned = false;
	};
	const run = async (pending) => {
		const trimmed = pending.question.trim();
		if (!trimmed || shouldStop()) return;
		if (active) {
			appendPendingQuestion({
				question: trimmed,
				metadata: pending.metadata
			});
			return;
		}
		active = true;
		let nextQuestion = {
			question: trimmed,
			metadata: pending.metadata
		};
		let consultStartedAt;
		try {
			while (nextQuestion) {
				if (shouldStop()) return;
				const currentQuestion = nextQuestion;
				consultStartedAt = Date.now();
				params.logger.info(`${params.logPrefix} consult: chars=${currentQuestion.question.length} queued=${pendingQuestions.length}`);
				activeAbortController = new AbortController();
				const result = await params.consult({
					question: currentQuestion.question,
					metadata: currentQuestion.metadata,
					responseStyle: params.responseStyle,
					signal: activeAbortController.signal
				});
				activeAbortController = void 0;
				const text = result.text.trim();
				params.logger.info(`${params.logPrefix} consult done: elapsedMs=${Date.now() - consultStartedAt} answerChars=${text.length} queued=${pendingQuestions.length}`);
				if (!shouldStop() && text) params.deliver(text);
				nextQuestion = shiftPendingQuestion();
			}
		} catch (error) {
			activeAbortController = void 0;
			if (shouldStop() || isAbortError(error)) return;
			const message = error instanceof Error ? error.message : String(error);
			const elapsedDetail = consultStartedAt === void 0 ? "" : ` elapsedMs=${Date.now() - consultStartedAt}`;
			params.logger.warn(`${params.logPrefix} consult failed:${elapsedDetail} ${message}`);
			params.deliver(params.fallbackText);
		} finally {
			active = false;
			if (shouldStop()) clearPendingQuestions();
			else {
				const queuedQuestion = shiftPendingQuestion();
				if (queuedQuestion) run(queuedQuestion);
			}
		}
	};
	return {
		isIdle: () => !active && pendingQuestions.length === 0,
		close: () => {
			if (closed) return;
			closed = true;
			clearDebounceTimer();
			clearPendingQuestions();
			activeAbortController?.abort();
		},
		enqueue: (question, metadata) => {
			const trimmed = question.trim();
			if (!trimmed || shouldStop()) return;
			if (active) {
				if (appendPendingQuestion({
					question: trimmed,
					metadata
				})) params.logger.info(`${params.logPrefix} consult queued: chars=${trimmed.length} queued=${pendingQuestions.length}`);
				clearDebounceTimer();
				return;
			}
			if (!appendPendingQuestion({
				question: trimmed,
				metadata
			})) return;
			clearDebounceTimer();
			debounceTimer = setTimeout(() => {
				debounceTimer = void 0;
				const queuedQuestion = shiftPendingQuestion();
				if (queuedQuestion && !shouldStop()) run(queuedQuestion);
			}, params.debounceMs);
			debounceTimer.unref?.();
		}
	};
}
function isAbortError(error) {
	return error instanceof Error && error.name === "AbortError";
}
//#endregion
//#region src/talk/provider-registry.ts
/**
* Normalizes realtime voice provider ids so direct ids and aliases compare through one registry key.
*/
function normalizeRealtimeVoiceProviderId(providerId) {
	return normalizeCapabilityProviderId(providerId);
}
/**
* Lists canonical realtime voice providers, discovering additional candidates through manifest policy.
*/
function listRealtimeVoiceProviders(cfg, additionalProviderIds) {
	const providers = resolvePluginCapabilityProviders({
		key: "realtimeVoiceProviders",
		cfg,
		additionalProviderIds
	});
	return [...buildCapabilityProviderIndex(providers, "canonical").values()];
}
/**
* Resolves a realtime voice provider by canonical id or declared alias.
*/
function getRealtimeVoiceProvider(providerId, cfg) {
	const normalized = normalizeRealtimeVoiceProviderId(providerId);
	if (!normalized) return;
	return resolvePluginCapabilityProvider({
		key: "realtimeVoiceProviders",
		providerId: normalized,
		cfg
	});
}
/**
* Converts a realtime voice provider id or alias into the canonical provider id when known.
*/
function canonicalizeRealtimeVoiceProviderId(providerId, cfg) {
	const normalized = normalizeRealtimeVoiceProviderId(providerId);
	if (!normalized) return;
	return getRealtimeVoiceProvider(normalized, cfg)?.id ?? normalized;
}
//#endregion
//#region src/talk/provider-resolver.ts
function resolveRealtimeVoiceProviderCapabilities(params) {
	if (params.surface === "browser-session") {
		const internalCapabilities = resolveInternalRealtimeVoiceBrowserSessionCapabilities(params);
		if (internalCapabilities) return internalCapabilities;
	}
	if (params.surface === "gateway-relay") {
		const internalCapabilities = resolveInternalRealtimeVoiceGatewayRelayCapabilities(params);
		if (internalCapabilities) return internalCapabilities;
	}
	return params.provider.capabilities;
}
function isRealtimeVoiceProviderConfigured(params) {
	const internalConfigured = params.surface === "browser-session" ? isInternalRealtimeVoiceBrowserSessionConfigured(params) : params.surface === "gateway-relay" ? isInternalRealtimeVoiceGatewayRelayConfigured(params) : void 0;
	if (internalConfigured !== void 0) return internalConfigured;
	return params.provider.isConfigured({
		cfg: params.cfg,
		agentId: params.agentId,
		providerConfig: params.providerConfig
	});
}
/** Resolve the configured realtime voice provider or auto-select the first configured one. */
function resolveConfiguredRealtimeVoiceProvider(params) {
	const cfgForResolve = params.cfgForResolve ?? params.cfg ?? {};
	const resolution = resolveConfiguredCapabilityProvider({
		configuredProviderId: params.configuredProviderId,
		providerConfigs: params.providerConfigs,
		cfg: params.cfg,
		cfgForResolve,
		getConfiguredProvider: (providerId) => params.providers?.find((entry) => entry.id === providerId) ?? getRealtimeVoiceProvider(providerId, params.cfg),
		listProviders: () => params.providers ?? listRealtimeVoiceProviders(params.cfg, Object.keys(params.providerConfigs ?? {})),
		isProviderAvailable: params.isProviderAvailable ? ({ provider }) => params.isProviderAvailable?.(provider) === true : void 0,
		resolveProviderConfig: ({ provider, cfg, rawConfig }) => {
			const defaultModel = params.defaultModel ?? (params.useProviderDefaultModel ? provider.defaultModel : void 0);
			const rawConfigWithOverrides = {
				...defaultModel && rawConfig.model === void 0 ? {
					...rawConfig,
					model: defaultModel
				} : rawConfig,
				...params.providerConfigOverrides
			};
			return provider.resolveConfig?.({
				cfg,
				rawConfig: rawConfigWithOverrides,
				agentId: params.agentId,
				surface: params.surface,
				autoRespondToAudio: params.autoRespondToAudio,
				requiredCapabilities: params.requiredCapabilities
			}) ?? rawConfigWithOverrides;
		},
		isProviderConfigured: ({ provider, cfg, providerConfig }) => isRealtimeVoiceProviderConfigured({
			provider,
			cfg,
			providerConfig,
			agentId: params.agentId,
			surface: params.surface
		})
	});
	if (!resolution.ok && resolution.code === "missing-configured-provider") throw new Error(`Realtime voice provider "${resolution.configuredProviderId}" is not registered`);
	if (!resolution.ok && resolution.code === "no-registered-provider") throw new Error(params.noRegisteredProviderMessage ?? "No realtime voice provider registered");
	if (!resolution.ok && resolution.code === "provider-unavailable" && resolution.provider) {
		params.assertProviderAvailable?.(resolution.provider);
		throw new Error(`Realtime voice provider "${resolution.provider.id}" is unavailable`);
	}
	if (!resolution.ok) throw new Error(`Realtime voice provider "${resolution.provider?.id}" is not configured`);
	return {
		provider: resolution.provider,
		providerConfig: resolution.providerConfig,
		capabilities: resolveRealtimeVoiceProviderCapabilities({
			provider: resolution.provider,
			providerConfig: resolution.providerConfig,
			cfg: params.cfg,
			agentId: params.agentId,
			surface: params.surface,
			clientControl: params.clientControl
		})
	};
}
//#endregion
//#region src/talk/session-runtime.ts
/**
* Creates a realtime voice bridge session and wires provider events to the configured audio sink.
*/
function createRealtimeVoiceBridgeSession(params) {
	const bridgeRef = {};
	const handleDelegationInput = params.handleDelegationInput;
	const runAgentConsult = params.runAgentConsult;
	const getPlaybackState = params.audioSink.getPlaybackState;
	let phase = "admitting";
	let terminalBeforeBridgeAdoption = false;
	let closeReported = false;
	let detached = false;
	let closeCompletion;
	const isAdmitting = () => phase === "admitting";
	const requireBridge = () => {
		if (!bridgeRef.current) throw new Error("Realtime voice bridge is not ready");
		return bridgeRef.current;
	};
	const requestResponse = (send) => {
		if (!isAdmitting() || !send) return;
		params.onResponseRequest?.();
		if (isAdmitting()) send();
	};
	const session = {
		capabilities: params.capabilities,
		get bridge() {
			return requireBridge();
		},
		acknowledgeMark: (markName) => {
			if (isAdmitting()) requireBridge().acknowledgeMark(markName);
		},
		close: (options) => {
			if (phase === "closing" || phase === "disposed") return closeCompletion;
			const bridge = requireBridge();
			detached = isAdmitting() && options?.disposition === "detach";
			phase = "closing";
			try {
				const completion = bridge.close(options);
				if (completion) {
					closeCompletion = completion.finally(() => {
						phase = "disposed";
					});
					return closeCompletion;
				}
			} catch (error) {
				phase = "disposed";
				throw error;
			}
			phase = "disposed";
		},
		connect: () => {
			if (phase === "closing" || phase === "disposed") return Promise.reject(/* @__PURE__ */ new Error("Realtime voice session is closed"));
			if (phase === "provider-terminal") {
				if (!terminalBeforeBridgeAdoption) return Promise.reject(/* @__PURE__ */ new Error("Realtime voice connection is closed"));
				terminalBeforeBridgeAdoption = false;
				phase = "admitting";
				closeReported = false;
			}
			return requireBridge().connect();
		},
		sendAudio: (audio) => {
			if (isAdmitting()) requireBridge().sendAudio(audio);
		},
		sendUserMessage: (text) => {
			if (text.trim()) {
				const bridge = requireBridge();
				requestResponse(bridge.sendUserMessage?.bind(bridge, text));
			}
		},
		handleBargeIn: (options) => {
			if (!isAdmitting()) return;
			const bridge = requireBridge();
			if (resolveRealtimeVoiceBargeIn({
				configuredBargeIn: true,
				interruptResponseOnInputAudio: true,
				capabilities: params.capabilities,
				outputAudioMode: bridge.outputAudioMode
			})) bridge.handleBargeIn?.(options);
		},
		setMediaTimestamp: (ts) => {
			if (isAdmitting()) requireBridge().setMediaTimestamp(ts);
		},
		submitToolResult: (callId, result, options) => {
			if (!isAdmitting()) return;
			const bridge = requireBridge();
			if (options?.suppressResponse && bridge.supportsToolResultSuppression === false) throw new Error("Realtime provider does not support suppressed tool results");
			return bridge.submitToolResult(callId, result, options);
		},
		triggerGreeting: (instructions) => {
			const bridge = requireBridge();
			requestResponse(bridge.triggerGreeting?.bind(bridge, instructions));
		}
	};
	const canSendAudio = () => isAdmitting() && (params.audioSink.isOpen?.() ?? true);
	const reportCallbackError = (error) => {
		if (!isAdmitting()) return;
		try {
			params.onError?.(error instanceof Error ? error : new Error(String(error)));
		} catch {}
	};
	bridgeRef.current = params.provider.createBridge({
		cfg: params.cfg,
		agentId: params.agentId,
		providerConfig: params.providerConfig,
		audioFormat: params.audioFormat,
		instructions: params.instructions,
		language: params.language,
		autoRespondToAudio: params.autoRespondToAudio,
		interruptResponseOnInputAudio: params.interruptResponseOnInputAudio,
		tools: params.tools,
		...runAgentConsult ? { runAgentConsult: async (request) => {
			if (!isAdmitting()) throw new Error("Realtime voice session is closed");
			request.signal?.throwIfAborted();
			const result = await runAgentConsult(request);
			request.signal?.throwIfAborted();
			if (!isAdmitting() && !detached) throw new Error("Realtime voice session is closed");
			return result;
		} } : {},
		onAudio: (audio, metadata) => {
			if (canSendAudio()) params.audioSink.sendAudio(audio, metadata);
		},
		...getPlaybackState ? { getPlaybackState: () => {
			if (!canSendAudio()) return [];
			const playback = getPlaybackState();
			return canSendAudio() ? playback : [];
		} } : {},
		onClearAudio: (reason) => {
			if (canSendAudio()) params.audioSink.clearAudio?.(reason);
		},
		onMark: (markName, acknowledge) => {
			if (!canSendAudio() || params.markStrategy === "ignore") return;
			if (params.markStrategy === "ack-immediately") {
				if (acknowledge) acknowledge();
				else bridgeRef.current?.acknowledgeMark(markName);
				return;
			}
			if (params.markStrategy === void 0 || params.markStrategy === "transport") {
				if (acknowledge) params.audioSink.sendMark?.(markName, () => {
					if (canSendAudio()) acknowledge();
				});
				else params.audioSink.sendMark?.(markName);
			}
		},
		onTranscript: (role, text, isFinal) => {
			if (isAdmitting() || phase === "closing" && isFinal) params.onTranscript?.(role, text, isFinal);
		},
		...handleDelegationInput ? { handleDelegationInput: (text, respond) => {
			if (!bridgeRef.current || !isAdmitting()) return "control";
			let responded = false;
			const reply = (message) => {
				if (!responded && bridgeRef.current && isAdmitting()) {
					responded = true;
					respond(message);
				}
			};
			try {
				return handleDelegationInput(text, reply);
			} catch (error) {
				try {
					reply(buildRealtimeVoiceAgentControlSpeechMessage(REALTIME_VOICE_AGENT_CONTROL_FAILURE_MESSAGE));
				} catch (replyError) {
					reportCallbackError(replyError);
				}
				reportCallbackError(error);
				return "control";
			}
		} } : {},
		onEvent: params.onEvent,
		onResponseDone: params.onResponseDone,
		onToolCall: (event) => {
			if (!bridgeRef.current || !isAdmitting()) return;
			try {
				const pending = params.onToolCall?.(event, session);
				if (pending) pending.catch(reportCallbackError);
			} catch (error) {
				reportCallbackError(error);
			}
		},
		onReady: () => {
			if (!bridgeRef.current || !isAdmitting()) return;
			if (params.triggerGreetingOnReady) session.triggerGreeting(params.initialGreetingInstructions);
			if (isAdmitting()) params.onReady?.(session);
		},
		onError: params.onError,
		onClose: (reason) => {
			if (!bridgeRef.current) terminalBeforeBridgeAdoption = true;
			if (phase !== "closing" && phase !== "disposed") phase = "provider-terminal";
			if (closeReported) return;
			closeReported = true;
			params.onClose?.(reason);
		}
	});
	return session;
}
//#endregion
//#region src/talk/session-log-runtime.ts
/** Appends a transcript entry and trims old rows in-place to bound Talk diagnostics memory. */
function recordRealtimeVoiceTranscript(transcript, role, text, maxEntries = 40) {
	const entry = {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		role,
		text
	};
	transcript.push(entry);
	if (transcript.length > maxEntries) transcript.splice(0, transcript.length - maxEntries);
	return entry;
}
/** Summarizes transcript history for health endpoints and UI diagnostics. */
function getRealtimeVoiceTranscriptHealth(transcript) {
	const last = transcript.at(-1);
	return {
		realtimeTranscriptLines: transcript.length,
		lastRealtimeTranscriptAt: last?.at,
		lastRealtimeTranscriptRole: last?.role,
		lastRealtimeTranscriptText: last?.text,
		recentRealtimeTranscript: transcript.slice(-5)
	};
}
/** Records low-volume bridge events while dropping raw audio chunks from diagnostics. */
function recordRealtimeVoiceBridgeEvent(events, event, maxEntries = 40) {
	if (event.direction === "client" && event.type === "input_audio_buffer.append") return;
	events.push({
		at: (/* @__PURE__ */ new Date()).toISOString(),
		...event
	});
	if (events.length > maxEntries) events.splice(0, events.length - maxEntries);
}
/** Summarizes recent bridge events without exposing the full rolling event buffer. */
function getRealtimeVoiceBridgeEventHealth(events) {
	const last = events.at(-1);
	return {
		lastRealtimeEventAt: last?.at,
		lastRealtimeEventType: last ? `${last.direction}:${last.type}` : void 0,
		lastRealtimeEventDetail: last?.detail,
		recentRealtimeEvents: events.slice(-10)
	};
}
function normalizeTranscriptForEchoMatch(text) {
	return text.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((token) => token.length > 1);
}
function hasMeaningfulEchoOverlap(userTokens, assistantTokens) {
	if (userTokens.length < 4 || assistantTokens.length < 4) return false;
	const uniqueUserTokens = uniqueStrings(userTokens);
	if (uniqueUserTokens.length < 4) return false;
	const assistantTokenSet = new Set(assistantTokens);
	return uniqueUserTokens.filter((token) => assistantTokenSet.has(token)).length / uniqueUserTokens.length >= .58;
}
/** Detects user transcript text that likely came from assistant speaker echo, not speech. */
function isLikelyRealtimeVoiceAssistantEchoTranscript(params) {
	const userTokens = normalizeTranscriptForEchoMatch(params.text);
	if (userTokens.length < 4) return false;
	const nowMs = params.nowMs ?? Date.now();
	const recentAssistantText = params.transcript.filter((entry) => {
		if (entry.role !== "assistant") return false;
		const at = Date.parse(entry.at);
		return Number.isFinite(at) && nowMs - at <= params.lookbackMs;
	}).slice(-6).map((entry) => entry.text).join(" ");
	if (!recentAssistantText.trim()) return false;
	const userNormalized = userTokens.join(" ");
	const assistantTokens = normalizeTranscriptForEchoMatch(recentAssistantText);
	const assistantNormalized = assistantTokens.join(" ");
	return userNormalized.length >= 18 && assistantNormalized.includes(userNormalized) || assistantNormalized.length >= 18 && userNormalized.includes(assistantNormalized) || hasMeaningfulEchoOverlap(userTokens, assistantTokens);
}
/** Extends input suppression through the estimated playback tail for assistant audio. */
function extendRealtimeVoiceOutputEchoSuppression(params) {
	const durationMs = Math.ceil(params.audio.byteLength / params.bytesPerMs);
	const playbackEndMs = Math.max(params.nowMs, params.lastOutputPlayableUntilMs) + durationMs;
	return {
		durationMs,
		lastOutputPlayableUntilMs: playbackEndMs,
		suppressInputUntilMs: Math.max(params.suppressInputUntilMs, playbackEndMs + params.tailMs)
	};
}
//#endregion
//#region src/talk/realtime-session-harness.ts
const MAX_SETTLED_RESPONSE_IDS = 64;
const harnessResponseOwners = /* @__PURE__ */ new WeakMap();
/** Core-only adapter for direct provider bridges that cannot use createBridge(). */
function handleRealtimeVoiceHarnessBridgeEvent(harness, event) {
	const owner = harnessResponseOwners.get(harness);
	owner?.claimResponseEvent(event);
	return owner?.finishLegacyEvent(event);
}
function createRealtimeVoiceSessionHarness(params) {
	let closed = false;
	let bridge;
	let bridgeCapabilities;
	let lastInputAt;
	let lastOutputAt;
	let lastSuppressedInputAt;
	let lastInputBytes = 0;
	let suppressedInputBytes = 0;
	let suppressInputUntilMs = 0;
	let lastOutputPlayableUntilMs = 0;
	let outputFlushGeneration = 0;
	let responseOwnerTurnId;
	let responseOwnerId;
	let suppressNextUnkeyedLegacyTerminal = false;
	const settledResponseIds = /* @__PURE__ */ new Set();
	const settledResponseIdOrder = [];
	const transcript = [];
	const bridgeEvents = [];
	const outputActivity = createRealtimeVoiceOutputActivityTracker();
	const transcriptLookbackMs = params.transcriptLookbackMs ?? params.echoSuppression?.transcriptLookbackMs;
	const forcedConsults = createRealtimeVoiceForcedConsultCoordinator(params.forcedConsults);
	const talk = createTalkSessionController({
		maxRecentEvents: 40,
		...params.talk
	}, { onEvent: (event) => {
		recordTalkObservabilityEvent(event);
		params.onTalkEvent?.(event);
	} });
	const talkback = params.talkback ? createRealtimeVoiceAgentTalkbackQueue({
		...params.talkback,
		isStopped: () => closed
	}) : void 0;
	const ensureTurn = () => {
		const turnId = talk.ensureTurn({ payload: params.talkPayloads.turnStarted() }).turnId;
		responseOwnerTurnId ??= turnId;
		return turnId;
	};
	const rememberSettledResponse = (responseId) => {
		if (!responseId || settledResponseIds.has(responseId)) return;
		settledResponseIds.add(responseId);
		settledResponseIdOrder.push(responseId);
		if (settledResponseIdOrder.length > MAX_SETTLED_RESPONSE_IDS) {
			const oldest = settledResponseIdOrder.shift();
			if (oldest) settledResponseIds.delete(oldest);
		}
	};
	const claimResponseEvent = (event) => {
		if (event.direction === "client" && event.type === "response.create") {
			responseOwnerTurnId = ensureTurn();
			return;
		}
		if (event.direction !== "server" || event.type !== "response.created") return;
		responseOwnerTurnId = ensureTurn();
		responseOwnerId = event.responseId;
		suppressNextUnkeyedLegacyTerminal = false;
	};
	const finishResponse = (outcome, source) => {
		if (outcome.responseId && settledResponseIds.has(outcome.responseId)) return {
			ok: false,
			reason: "no_active_turn"
		};
		if (outcome.responseId && responseOwnerId && outcome.responseId !== responseOwnerId) return {
			ok: false,
			reason: "stale_turn"
		};
		const turnId = responseOwnerTurnId ?? talk.activeTurnId;
		if (!turnId) return {
			ok: false,
			reason: "no_active_turn"
		};
		if (talk.activeTurnId !== turnId) return {
			ok: false,
			reason: "stale_turn"
		};
		talk.finishOutputAudio({
			turnId,
			payload: params.talkPayloads.outputAudioDone(outcome.status)
		});
		if (outcome.status === "failed" || outcome.status === "incomplete") talk.emit({
			type: "session.error",
			turnId,
			payload: outcome,
			final: true
		});
		const payload = params.talkPayloads.turnEnded(outcome.status);
		const result = outcome.status === "cancelled" ? talk.cancelTurn({
			turnId,
			payload
		}) : talk.endTurn({
			turnId,
			payload
		});
		if (result.ok) {
			rememberSettledResponse(outcome.responseId);
			if (!outcome.responseId && source === "typed") suppressNextUnkeyedLegacyTerminal = true;
			if (!responseOwnerId || !outcome.responseId || responseOwnerId === outcome.responseId) {
				responseOwnerTurnId = void 0;
				responseOwnerId = void 0;
			}
		}
		return result;
	};
	const finishLegacyEvent = (event) => {
		if (event.direction !== "server" || event.type !== "response.done" && event.type !== "response.cancelled") return;
		if (event.responseId && settledResponseIds.has(event.responseId)) return;
		if (!event.responseId && suppressNextUnkeyedLegacyTerminal) {
			suppressNextUnkeyedLegacyTerminal = false;
			return;
		}
		const outcome = {
			status: event.type === "response.cancelled" ? "cancelled" : "completed",
			...event.responseId ? { responseId: event.responseId } : {}
		};
		return finishResponse(outcome, "legacy").ok ? outcome : void 0;
	};
	const flushOutput = (flush) => {
		outputFlushGeneration += 1;
		suppressInputUntilMs = 0;
		lastOutputPlayableUntilMs = 0;
		flush();
	};
	const harness = {
		forcedConsults,
		outputActivity,
		talk,
		talkback,
		transcript,
		close() {
			if (closed) return;
			closed = true;
			talkback?.close();
			forcedConsults.clear();
			responseOwnerTurnId = void 0;
			responseOwnerId = void 0;
		},
		createBridge(bridgeParams) {
			bridgeCapabilities = bridgeParams.capabilities;
			bridge = createRealtimeVoiceBridgeSession({
				...bridgeParams,
				onResponseRequest: () => {
					ensureTurn();
					bridgeParams.onResponseRequest?.();
				},
				onTranscript: (role, text, isFinal) => {
					if (isFinal) harness.recordTranscript(role, text);
					bridgeParams.onTranscript?.(role, text, isFinal);
				},
				onEvent: (event) => {
					claimResponseEvent(event);
					const legacyOutcome = finishLegacyEvent(event);
					if (legacyOutcome) bridgeParams.onResponseDone?.(legacyOutcome);
					if (params.captureBridgeEvents !== false) recordRealtimeVoiceBridgeEvent(bridgeEvents, event);
					bridgeParams.onEvent?.(event);
				},
				onResponseDone: (outcome) => {
					if (finishResponse(outcome, "typed").ok) bridgeParams.onResponseDone?.(outcome);
				}
			});
			return bridge;
		},
		emit: (input) => talk.emit(input),
		ensureTurn,
		endTurn(reason = "completed") {
			if (talk.endTurn({ payload: params.talkPayloads.turnEnded(reason) }).ok) {
				responseOwnerTurnId = void 0;
				responseOwnerId = void 0;
			}
		},
		finishResponse(outcome) {
			return finishResponse(outcome, "typed");
		},
		finishOutputAudio(reason) {
			talk.finishOutputAudio({ payload: params.talkPayloads.outputAudioDone(reason) });
		},
		flushOutput,
		getHealth(healthParams) {
			const output = outputActivity.snapshot();
			return {
				providerConnected: healthParams.providerConnected,
				realtimeReady: healthParams.realtimeReady,
				audioInputActive: lastInputBytes > 0,
				audioOutputActive: outputActivity.isActive(),
				lastInputAt,
				lastOutputAt,
				lastSuppressedInputAt,
				lastInputBytes,
				lastOutputBytes: output.sinkAudioBytes,
				suppressedInputBytes,
				...getRealtimeVoiceTranscriptHealth(transcript),
				...bridge ? getRealtimeVoiceBridgeEventHealth(bridgeEvents) : {},
				recentTalkEvents: talk.recentEvents.slice(-20).map((event) => ({
					id: event.id,
					type: event.type,
					sessionId: event.sessionId,
					turnId: event.turnId,
					seq: event.seq,
					timestamp: event.timestamp,
					final: event.final
				}))
			};
		},
		handleBargeIn(options, fallbackFlush) {
			if (!resolveRealtimeVoiceBargeIn({
				configuredBargeIn: true,
				interruptResponseOnInputAudio: true,
				capabilities: bridgeCapabilities,
				outputAudioMode: bridge?.bridge.outputAudioMode
			})) return;
			suppressInputUntilMs = 0;
			const flushGeneration = outputFlushGeneration;
			bridge?.handleBargeIn(options);
			if (flushGeneration === outputFlushGeneration) flushOutput(fallbackFlush);
		},
		isLikelyAssistantEchoTranscript(text) {
			return transcriptLookbackMs === void 0 ? false : isLikelyRealtimeVoiceAssistantEchoTranscript({
				transcript,
				text,
				lookbackMs: transcriptLookbackMs
			});
		},
		isOutputPlaybackWindowActive() {
			return Date.now() <= Math.max(lastOutputPlayableUntilMs, suppressInputUntilMs);
		},
		recordInputAudio(audio) {
			if (Date.now() < suppressInputUntilMs) {
				lastSuppressedInputAt = (/* @__PURE__ */ new Date()).toISOString();
				suppressedInputBytes += audio.byteLength;
				return false;
			}
			lastInputAt = (/* @__PURE__ */ new Date()).toISOString();
			lastInputBytes += audio.byteLength;
			harness.emit({
				type: "input.audio.delta",
				turnId: ensureTurn(),
				payload: params.talkPayloads.inputAudioDelta(audio)
			});
			return true;
		},
		recordOutputAudio(audio, activity = {}) {
			if (closed) return;
			const flushGeneration = outputFlushGeneration;
			let audioMs = activity.audioMs;
			if (params.echoSuppression) {
				const suppression = extendRealtimeVoiceOutputEchoSuppression({
					audio,
					bytesPerMs: params.echoSuppression.bytesPerMs,
					tailMs: params.echoSuppression.tailMs,
					nowMs: Date.now(),
					lastOutputPlayableUntilMs,
					suppressInputUntilMs
				});
				lastOutputPlayableUntilMs = suppression.lastOutputPlayableUntilMs;
				suppressInputUntilMs = suppression.suppressInputUntilMs;
				audioMs ??= suppression.durationMs;
			}
			outputActivity.markAudio({
				audioMs,
				sourceAudioBytes: activity.sourceAudioBytes ?? audio.byteLength,
				sinkAudioBytes: activity.sinkAudioBytes ?? audio.byteLength
			});
			lastOutputAt = (/* @__PURE__ */ new Date()).toISOString();
			const turnId = ensureTurn();
			if (closed || flushGeneration !== outputFlushGeneration) return;
			talk.startOutputAudio({
				turnId,
				payload: params.talkPayloads.outputAudioStarted()
			});
			if (closed || flushGeneration !== outputFlushGeneration) return;
			harness.emit({
				type: "output.audio.delta",
				turnId,
				payload: params.talkPayloads.outputAudioDelta(audio)
			});
		},
		recordTranscript: (role, text) => recordRealtimeVoiceTranscript(transcript, role, text)
	};
	harnessResponseOwners.set(harness, {
		claimResponseEvent,
		finishLegacyEvent
	});
	return harness;
}
//#endregion
export { readRealtimeVoiceConsultQuestion as A, createTalkEventSequencer as B, resolveRealtimeVoiceBargeIn as C, createRealtimeVoiceForcedConsultCoordinator as D, resolveRealtimeVoiceSessionPolicy as E, createTalkLogRecord as F, projectInternalRealtimeVoicePublicConfig as H, recordTalkLogEvent as I, createTalkDiagnosticEvent as L, createTalkSessionController as M, normalizeTalkTransport as N, matchRealtimeVoiceConsultQuestions as O, recordTalkObservabilityEvent as P, recordTalkDiagnosticEvent as R, isRealtimeVoiceWakeNameRequired as S, resolveRealtimeVoiceMinBargeInAudioEndMs as T, projectInternalRealtimeVoicePublicProjection as U, cancelInternalRealtimeVoiceBrowserSession as V, resolveInternalRealtimeVoiceGatewayRelayLaunchError as W, createRealtimeVoiceAgentTalkbackQueue as _, getRealtimeVoiceTranscriptHealth as a, consultRealtimeVoiceAgent as b, recordRealtimeVoiceTranscript as c, resolveConfiguredRealtimeVoiceProvider as d, resolveRealtimeVoiceProviderCapabilities as f, normalizeRealtimeVoiceProviderId as g, listRealtimeVoiceProviders as h, getRealtimeVoiceBridgeEventHealth as i, readSpeakableRealtimeVoiceToolResult as j, normalizeRealtimeVoiceConsultQuestion as k, createRealtimeVoiceBridgeSession as l, getRealtimeVoiceProvider as m, handleRealtimeVoiceHarnessBridgeEvent as n, isLikelyRealtimeVoiceAssistantEchoTranscript as o, canonicalizeRealtimeVoiceProviderId as p, extendRealtimeVoiceOutputEchoSuppression as r, recordRealtimeVoiceBridgeEvent as s, createRealtimeVoiceSessionHarness as t, isRealtimeVoiceProviderConfigured as u, REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION as v, resolveRealtimeVoiceInterruptResponseOnInputAudio as w, prepareRealtimeVoiceAgentExecutionContext as x, assertRealtimeVoiceAgentConsultModelSelectionUnlocked as y, TALK_EVENT_TYPES as z };
