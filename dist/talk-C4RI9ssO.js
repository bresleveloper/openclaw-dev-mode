import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { C as resolveExpiresAtMsFromDurationMs, S as resolveDateTimestampMs, g as parseFiniteNumber, m as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { u as readConfigFileSnapshot } from "./io-BJfjPmGW.js";
import { i as resolveActiveTalkProviderConfig, r as normalizeTalkSection, t as buildTalkConfigResponse } from "./talk-Ccvr8ePR.js";
import "./config-A41fTHlt.js";
import { a as TALK_SECRETS_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-CS3xdS-V.js";
import { a as providerMatchesId, i as getVoiceProviderConfig, s as resolveSupportedVoiceModelRefs } from "./registry-yozg2pVI.js";
import { n as redactConfigObject } from "./redact-snapshot-CRFhNm1X.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { An as validateTalkClientSteerParams, Bn as validateTalkSessionCloseParams, En as validateTalkCatalogParams, In as validateTalkModeParams, Jn as validateTalkSessionTurnParams, Kn as validateTalkSessionSteerParams, Ln as validateTalkSessionAppendAudioParams, Nn as validateTalkConfigParams, On as validateTalkClientCreateParams, Rn as validateTalkSessionCancelOutputParams, Un as validateTalkSessionJoinParams, Vn as validateTalkSessionCreateParams, Xn as validateTalkSpeakParams, jn as validateTalkClientToolCallParams, qn as validateTalkSessionSubmitToolResultParams, t as formatValidationErrors, zn as validateTalkSessionCancelTurnParams } from "./src-CSp7rUPX.js";
import { i as getSpeechProvider, o as listSpeechProviders, r as canonicalizeSpeechProviderId } from "./directives-COWky2U1.js";
import { D as synthesizeSpeech, M as withSpeakerSelectionCompat, N as withSpeakerSelectionFallbackCompat, g as resolveTtsConfig, i as getResolvedSpeechProviderConfig } from "./tts-runtime-CX2QUXBY.js";
import "./tts-Bvnit7ux.js";
import { t as abortChatRunById } from "./chat-abort-CHoKqMso.js";
import { t as formatForLog } from "./ws-log-UD7Od6QM.js";
import { r as listRealtimeTranscriptionProviders } from "./provider-registry-CJjxsNup.js";
import { A as buildRealtimeVoiceAgentConsultWorkingResponse, C as shouldAutoControlRealtimeVoiceAgentText, D as buildRealtimeVoiceAgentConsultChatMessage, H as createTalkSessionController, L as createRealtimeVoiceForcedConsultCoordinator, Q as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, T as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, V as readSpeakableRealtimeVoiceToolResult, W as recordTalkObservabilityEvent, c as resolveConfiguredRealtimeVoiceProvider, d as listRealtimeVoiceProviders, g as REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME, h as REALTIME_VOICE_AGENT_CONTROL_TOOL, i as isLikelyRealtimeVoiceAssistantEchoTranscript, l as canonicalizeRealtimeVoiceProviderId, o as recordRealtimeVoiceTranscript, p as controlRealtimeVoiceAgentRun, s as createRealtimeVoiceBridgeSession, v as buildRealtimeVoiceAgentControlSpeechMessage, w as REALTIME_VOICE_AGENT_CONSULT_TOOL } from "./session-log-runtime-sscjHiOo.js";
import { r as chatHandlers } from "./chat-Dh1r0zvE.js";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-B_pduiYW.js";
import { t as assertValidParams } from "./validation-CGUihuqY.js";
import { createHash, randomBytes, randomUUID } from "node:crypto";
//#region src/gateway/talk-relay-session-lifecycle.ts
function isExpiredTalkRelaySession(session, validNowMs) {
	const expiresAtMs = asDateTimestampMs(session.expiresAtMs);
	return expiresAtMs === void 0 || validNowMs > expiresAtMs;
}
/** Closes every expired relay session in the provided process-local map. */
function closeExpiredTalkRelaySessions(params) {
	const validNowMs = asDateTimestampMs(params.nowMs ?? Date.now());
	if (validNowMs === void 0) return;
	for (const session of params.sessions) if (isExpiredTalkRelaySession(session, validNowMs)) params.closeSession(session);
}
/** Returns the active session only when it belongs to the current connection. */
function requireActiveTalkRelaySession(params) {
	const session = params.sessions.get(params.sessionId);
	const nowMs = asDateTimestampMs(Date.now());
	if (!session || session.connId !== params.connId || nowMs === void 0 || isExpiredTalkRelaySession(session, nowMs)) {
		if (session) params.closeSession(session);
		throw new Error(params.unknownSessionMessage);
	}
	return session;
}
//#endregion
//#region src/gateway/talk-session-registry.ts
const unifiedTalkSessions = /* @__PURE__ */ new Map();
/** Associates a public Talk session id with its concrete gateway backend. */
function rememberUnifiedTalkSession(sessionId, session) {
	unifiedTalkSessions.set(sessionId, session);
}
/** Resolves a Talk session id or throws the protocol-facing unknown-session error. */
function getUnifiedTalkSession(sessionId) {
	const session = unifiedTalkSessions.get(sessionId);
	if (!session) throw new Error("Unknown Talk session");
	return session;
}
/** Removes a Talk session id after the concrete backend closes. */
function forgetUnifiedTalkSession(sessionId) {
	unifiedTalkSessions.delete(sessionId);
}
/** Enforces that a relay-backed Talk session is controlled by its owner socket. */
function requireUnifiedTalkSessionConn(session, connId) {
	if (!connId || session.connId !== connId) throw new Error("Talk session is not owned by this connection");
	return connId;
}
//#endregion
//#region src/gateway/talk-realtime-relay.ts
const RELAY_SESSION_TTL_MS = 1800 * 1e3;
const MAX_AUDIO_BASE64_BYTES$1 = 512 * 1024;
const MAX_RELAY_SESSIONS_PER_CONN = 2;
const MAX_RELAY_SESSIONS_GLOBAL = 64;
const RELAY_EVENT = "talk.event";
const RELAY_TRANSCRIPT_ECHO_LOOKBACK_MS = 12e3;
const FORCED_CONSULT_FALLBACK_DELAY_MS = 200;
const FORCED_CONSULT_RESULT_MAX_CHARS = 1800;
const relaySessions = /* @__PURE__ */ new Map();
function formatError(error) {
	return error instanceof Error ? error.message : String(error);
}
function realtimeRelayIssue(params) {
	return {
		code: "realtime_unavailable",
		message: params.message,
		provider: params.provider,
		...params.model ? { model: params.model } : {},
		transport: "gateway-relay",
		phase: params.phase
	};
}
function relayIssuePayload(relaySessionId, issue) {
	return {
		relaySessionId,
		type: "error",
		message: issue.message,
		code: issue.code,
		provider: issue.provider,
		...issue.model ? { model: issue.model } : {},
		transport: issue.transport,
		phase: issue.phase
	};
}
function isWorkingToolResult(result) {
	return Boolean(result) && typeof result === "object" && !Array.isArray(result) && result.status === "working";
}
function isRelayAssistantEchoTranscript(session, text) {
	if (!session) return false;
	return isLikelyRealtimeVoiceAssistantEchoTranscript({
		transcript: session.transcript,
		text,
		lookbackMs: RELAY_TRANSCRIPT_ECHO_LOOKBACK_MS
	});
}
function buildForcedConsultCheckingPrompt() {
	return ["Briefly tell the person that you are checking with OpenClaw.", "Do not answer the request yet. Wait for the OpenClaw result before giving the actual answer."].join(" ");
}
function buildForcedConsultSpeechPrompt(text) {
	return [
		"OpenClaw finished checking. Speak this result naturally and concisely.",
		"Do not mention tool calls, JSON, or internal routing.",
		"",
		text
	].join("\n");
}
function buildAlreadyDeliveredToolResult() {
	return {
		status: "already_delivered",
		message: "OpenClaw already delivered this consult result internally. Do not repeat it."
	};
}
function cancelForcedConsults(session) {
	for (const handle of session.forcedConsults.handles()) session.forcedConsults.markCancelled(handle);
}
function broadcastToOwner$1(context, connId, event, options = { dropIfSlow: true }) {
	context.broadcastToConnIds(RELAY_EVENT, event, new Set([connId]), options);
}
function relayEventDeliveryOptions(event) {
	switch (event.type) {
		case "ready":
		case "error":
		case "close": return { dropIfSlow: false };
		default: return { dropIfSlow: true };
	}
}
function abortRelayAgentRuns(session, reason) {
	for (const [runId, sessionKey] of session.activeAgentRuns) abortChatRunById(session.context, {
		runId,
		sessionKey,
		stopReason: reason
	});
	session.activeAgentRuns.clear();
	session.activeAgentToolCalls.clear();
}
function pruneInactiveRelayAgentRuns(session) {
	for (const runId of session.activeAgentRuns.keys()) if (!session.context.chatAbortControllers.has(runId)) session.activeAgentRuns.delete(runId);
	for (const [callId, runId] of session.activeAgentToolCalls) if (!session.activeAgentRuns.has(runId)) session.activeAgentToolCalls.delete(callId);
	return session.activeAgentRuns.size;
}
function broadcastToolResultToOwner(session, params) {
	const payload = params.forced === true ? {
		result: params.result,
		forced: true
	} : { result: params.result };
	broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "toolResult",
		callId: params.callId,
		talkEvent: session.talk.emit({
			type: "tool.result",
			callId: params.callId,
			turnId: params.turnId,
			payload,
			final: params.final
		})
	});
}
function submitRelayAgentControlProviderResults(session, result, turnId) {
	if (result.mode !== "cancel" || !result.ok || !result.providerResult) return;
	const activeCallIds = [...session.activeAgentToolCalls.keys()];
	for (const callId of activeCallIds) {
		const forcedConsult = session.forcedConsults.handles().find((handle) => handle.id === callId);
		if (forcedConsult) {
			session.forcedConsults.markCancelled(forcedConsult);
			for (const nativeCallId of session.forcedConsults.nativeCallIds(forcedConsult)) session.bridge.submitToolResult(nativeCallId, result.providerResult, { suppressResponse: true });
		} else session.bridge.submitToolResult(callId, result.providerResult, { suppressResponse: true });
		broadcastToolResultToOwner(session, {
			callId,
			turnId,
			result: result.providerResult,
			final: true
		});
		session.activeAgentToolCalls.delete(callId);
		session.completedAgentToolCalls.add(callId);
	}
	session.activeAgentRuns.clear();
}
function closeRelaySession(session, reason) {
	session.forcedConsults.clear();
	relaySessions.delete(session.id);
	forgetUnifiedTalkSession(session.id);
	clearTimeout(session.cleanupTimer);
	abortRelayAgentRuns(session, reason === "error" ? "relay-error" : "relay-closed");
	session.bridge.close();
	broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "close",
		reason,
		talkEvent: session.talk.emit({
			type: "session.closed",
			payload: { reason },
			final: true
		})
	});
}
function pruneExpiredRelaySessions(nowMs = Date.now()) {
	closeExpiredTalkRelaySessions({
		sessions: relaySessions.values(),
		closeSession: (session) => closeRelaySession(session, "completed"),
		nowMs
	});
}
function countRelaySessionsForConn(connId) {
	let count = 0;
	for (const session of relaySessions.values()) if (session.connId === connId) count += 1;
	return count;
}
function enforceRelaySessionLimits(connId) {
	pruneExpiredRelaySessions();
	if (relaySessions.size >= MAX_RELAY_SESSIONS_GLOBAL) throw new Error("Too many active realtime relay sessions");
	if (countRelaySessionsForConn(connId) >= MAX_RELAY_SESSIONS_PER_CONN) throw new Error("Too many active realtime relay sessions for this connection");
}
/** Creates a realtime voice relay session and returns the browser audio contract. */
function createTalkRealtimeRelaySession(params) {
	enforceRelaySessionLimits(params.connId);
	const forceAgentConsultOnFinalTranscript = params.forceAgentConsultOnFinalTranscript === true;
	const relaySessionId = randomUUID();
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(RELAY_SESSION_TTL_MS);
	if (expiresAtMs === void 0) throw new Error("Realtime relay session expiry is outside the supported Date range");
	const talk = createTalkSessionController({
		sessionId: relaySessionId,
		mode: "realtime",
		transport: "gateway-relay",
		brain: "agent-consult",
		provider: params.provider.id
	}, { onEvent: recordTalkObservabilityEvent });
	const emit = (event, talkEvent) => broadcastToOwner$1(params.context, params.connId, {
		...event,
		...talkEvent ? { talkEvent: talk.emit(talkEvent) } : {}
	}, relayEventDeliveryOptions(event));
	let currentOutputItemId;
	let currentOutputResponseId;
	let ready = false;
	let failureEmitted = false;
	const relayRef = {};
	const bridge = createRealtimeVoiceBridgeSession({
		provider: params.provider,
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		audioFormat: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
		instructions: params.instructions,
		autoRespondToAudio: !forceAgentConsultOnFinalTranscript,
		interruptResponseOnInputAudio: !forceAgentConsultOnFinalTranscript,
		tools: params.tools,
		markStrategy: "ack-immediately",
		audioSink: {
			isOpen: () => Boolean(relayRef.current && relaySessions.has(relayRef.current.id)),
			sendAudio: (audio) => {
				const turnId = relayRef.current ? ensureRelayTurn(relayRef.current) : void 0;
				emit({
					relaySessionId,
					type: "audio",
					audioBase64: audio.toString("base64"),
					...currentOutputItemId ? { itemId: currentOutputItemId } : {},
					...currentOutputResponseId ? { responseId: currentOutputResponseId } : {}
				}, {
					type: "output.audio.delta",
					turnId,
					payload: { byteLength: audio.length }
				});
			},
			clearAudio: () => {
				const turnId = relayRef.current ? ensureRelayTurn(relayRef.current) : void 0;
				emit({
					relaySessionId,
					type: "clear"
				}, {
					type: "output.audio.done",
					turnId,
					payload: { reason: "clear" },
					final: true
				});
			},
			sendMark: (markName) => {
				const turnId = relayRef.current ? ensureRelayTurn(relayRef.current) : void 0;
				emit({
					relaySessionId,
					type: "mark",
					markName
				}, {
					type: "output.audio.done",
					turnId,
					payload: { markName },
					final: true
				});
			}
		},
		onEvent: (event) => {
			if (event.direction !== "server") return;
			if (event.type === "conversation.output_audio.delta" || event.type === "response.audio.delta" || event.type === "response.output_audio.delta") {
				currentOutputItemId = event.itemId ?? currentOutputItemId;
				currentOutputResponseId = event.responseId ?? currentOutputResponseId;
				return;
			}
			if (event.type === "response.audio.done" || event.type === "response.output_audio.done" || event.type === "conversation.output_audio.done" || event.type === "response.done" || event.type === "response.cancelled") {
				emit({
					relaySessionId,
					type: "audioDone",
					...event.itemId ?? currentOutputItemId ? { itemId: event.itemId ?? currentOutputItemId } : {},
					...event.responseId ?? currentOutputResponseId ? { responseId: event.responseId ?? currentOutputResponseId } : {}
				});
				currentOutputItemId = void 0;
				currentOutputResponseId = void 0;
			}
		},
		onTranscript: (role, text, final) => {
			const relay = relayRef.current;
			const turnId = relay ? ensureRelayTurn(relay) : void 0;
			if (final && relay) recordRealtimeVoiceTranscript(relay.transcript, role, text);
			emit({
				relaySessionId,
				type: "transcript",
				role,
				text,
				final
			}, {
				type: role === "assistant" ? final ? "output.text.done" : "output.text.delta" : final ? "transcript.done" : "transcript.delta",
				turnId,
				payload: role === "assistant" ? { text } : {
					role,
					text
				},
				final
			});
			if (role === "user" && final && text.trim()) {
				const question = text.trim();
				if (isRelayAssistantEchoTranscript(relay, question)) return;
				if (relay && pruneInactiveRelayAgentRuns(relay) > 0 && shouldAutoControlRealtimeVoiceAgentText(question)) {
					steerTalkRealtimeRelayAgentRun({
						relaySessionId,
						connId: params.connId,
						text: question
					}).then((result) => {
						if (result.speak && !result.suppress && result.message.trim()) bridge.sendUserMessage(buildRealtimeVoiceAgentControlSpeechMessage(result.message));
					}).catch((error) => {
						emit({
							relaySessionId,
							type: "error",
							message: formatError(error)
						}, {
							type: "session.error",
							payload: { message: formatError(error) },
							final: true
						});
					});
					return;
				}
				if (forceAgentConsultOnFinalTranscript) scheduleForcedAgentConsult(relay, question);
			}
		},
		onToolCall: (toolCall) => {
			const relay = relayRef.current;
			const turnId = relay ? ensureRelayTurn(relay) : void 0;
			if (relay && toolCall.name === "openclaw_agent_consult") {
				const forcedConsult = relay.forcedConsults.recordNativeConsult(toolCall.args, toolCall.callId);
				if (forcedConsult.kind === "in_flight" || forcedConsult.kind === "already_delivered") {
					if (forcedConsult.kind === "already_delivered") submitAlreadyDeliveredToolResult(relay, toolCall.callId, turnId);
					else submitRealtimeAgentConsultWorkingResponse(relay, toolCall.callId, turnId);
					return;
				}
				submitRealtimeAgentConsultWorkingResponse(relay, toolCall.callId, turnId);
			}
			emit({
				relaySessionId,
				type: "toolCall",
				itemId: toolCall.itemId,
				callId: toolCall.callId,
				name: toolCall.name,
				args: toolCall.args
			}, {
				type: "tool.call",
				itemId: toolCall.itemId,
				callId: toolCall.callId,
				turnId,
				payload: {
					name: toolCall.name,
					args: toolCall.args
				}
			});
		},
		onReady: () => {
			ready = true;
			emit({
				relaySessionId,
				type: "ready"
			}, {
				type: "session.ready",
				payload: null
			});
		},
		onError: (error) => {
			const issue = realtimeRelayIssue({
				message: formatError(error),
				provider: params.provider.id,
				model: params.model,
				phase: ready ? "stream" : "connect"
			});
			failureEmitted = true;
			emit(relayIssuePayload(relaySessionId, issue), {
				type: "session.error",
				payload: issue,
				final: true
			});
		},
		onClose: (reason) => {
			const active = relaySessions.get(relaySessionId);
			if (!active) return;
			active.forcedConsults.clear();
			relaySessions.delete(relaySessionId);
			forgetUnifiedTalkSession(relaySessionId);
			clearTimeout(active.cleanupTimer);
			abortRelayAgentRuns(active, "relay-closed");
			if (!ready && !failureEmitted) {
				const issue = realtimeRelayIssue({
					message: "Realtime provider closed before the session became ready.",
					provider: params.provider.id,
					model: params.model,
					phase: "connect"
				});
				emit(relayIssuePayload(relaySessionId, issue), {
					type: "session.error",
					payload: issue,
					final: true
				});
			}
			emit({
				relaySessionId,
				type: "close",
				reason
			}, {
				type: "session.closed",
				payload: { reason },
				final: true
			});
		}
	});
	const relay = {
		id: relaySessionId,
		connId: params.connId,
		context: params.context,
		bridge,
		talk,
		sessionKey: params.sessionKey?.trim() || void 0,
		expiresAtMs,
		cleanupTimer: setTimeout(() => {
			const active = relaySessions.get(relaySessionId);
			if (active) closeRelaySession(active, "completed");
		}, RELAY_SESSION_TTL_MS),
		activeAgentRuns: /* @__PURE__ */ new Map(),
		activeAgentToolCalls: /* @__PURE__ */ new Map(),
		completedAgentToolCalls: /* @__PURE__ */ new Set(),
		forcedConsults: createRealtimeVoiceForcedConsultCoordinator(),
		transcript: []
	};
	relayRef.current = relay;
	relay.cleanupTimer.unref?.();
	relaySessions.set(relaySessionId, relay);
	bridge.connect().catch((error) => {
		const issue = realtimeRelayIssue({
			message: formatError(error),
			provider: params.provider.id,
			model: params.model,
			phase: "connect"
		});
		failureEmitted = true;
		emit(relayIssuePayload(relaySessionId, issue), {
			type: "session.error",
			payload: issue,
			final: true
		});
		const active = relaySessions.get(relaySessionId);
		if (active) closeRelaySession(active, "error");
	});
	return {
		provider: params.provider.id,
		transport: "gateway-relay",
		relaySessionId,
		audio: {
			inputEncoding: "pcm16",
			inputSampleRateHz: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ.sampleRateHz,
			outputEncoding: "pcm16",
			outputSampleRateHz: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ.sampleRateHz
		},
		...params.model ? { model: params.model } : {},
		...params.voice ? { voice: params.voice } : {},
		expiresAt: Math.floor(expiresAtMs / 1e3)
	};
}
function scheduleForcedAgentConsult(session, question) {
	if (!session || !question.trim()) return;
	if (session.forcedConsults.hasRecentNativeConsult(question)) return;
	session.forcedConsults.clearPending();
	const handle = session.forcedConsults.prepare(question);
	if (!handle) return;
	session.forcedConsults.schedule(handle, FORCED_CONSULT_FALLBACK_DELAY_MS, () => {
		if (!relaySessions.has(session.id)) return;
		const turnId = ensureRelayTurn(session);
		const callId = handle.id;
		const itemId = `forced-consult-item-${randomUUID()}`;
		session.forcedConsults.markStarted(handle);
		session.bridge.handleBargeIn({
			audioPlaybackActive: true,
			force: true
		});
		broadcastToOwner$1(session.context, session.connId, {
			relaySessionId: session.id,
			type: "toolCall",
			itemId,
			callId,
			name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
			forced: true,
			args: {
				question: handle.question,
				context: "The realtime provider produced a final user transcript without invoking openclaw_agent_consult, so OpenClaw is forcing the consult for realtime Talk.",
				responseStyle: "Reply in a concise spoken tone."
			},
			talkEvent: session.talk.emit({
				type: "tool.call",
				itemId,
				callId,
				turnId,
				payload: {
					name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
					args: { question: handle.question },
					forced: true
				}
			})
		});
	});
}
function submitAlreadyDeliveredToolResult(session, callId, turnId = ensureRelayTurn(session)) {
	const result = buildAlreadyDeliveredToolResult();
	session.bridge.submitToolResult(callId, result, { suppressResponse: true });
	broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "toolResult",
		callId,
		talkEvent: session.talk.emit({
			type: "tool.result",
			callId,
			turnId,
			payload: {
				name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
				result
			},
			final: true
		})
	});
}
function submitRealtimeAgentConsultWorkingResponse(session, callId, turnId = ensureRelayTurn(session)) {
	if (!session.bridge.bridge.supportsToolResultContinuation) return;
	session.bridge.submitToolResult(callId, buildRealtimeVoiceAgentConsultWorkingResponse("person"), { willContinue: true });
	broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "toolResult",
		callId,
		talkEvent: session.talk.emit({
			type: "tool.progress",
			callId,
			turnId,
			payload: {
				name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
				status: "working"
			}
		})
	});
}
function ensureRelayTurn(session) {
	const turn = session.talk.ensureTurn();
	if (turn.event) broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "inputAudio",
		byteLength: 0,
		talkEvent: turn.event
	});
	return turn.turnId;
}
function getRelaySession(relaySessionId, connId) {
	return requireActiveTalkRelaySession({
		sessions: relaySessions,
		sessionId: relaySessionId,
		connId,
		closeSession: (session) => closeRelaySession(session, "completed"),
		unknownSessionMessage: "Unknown realtime relay session"
	});
}
/** Streams one base64-encoded browser audio frame into the owning relay. */
function sendTalkRealtimeRelayAudio(params) {
	if (params.audioBase64.length > MAX_AUDIO_BASE64_BYTES$1) throw new Error("Realtime relay audio frame is too large");
	const session = getRelaySession(params.relaySessionId, params.connId);
	const turnId = ensureRelayTurn(session);
	const audio = Buffer.from(params.audioBase64, "base64");
	session.bridge.sendAudio(audio);
	broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "inputAudio",
		byteLength: audio.byteLength,
		talkEvent: session.talk.emit({
			type: "input.audio.delta",
			turnId,
			payload: { byteLength: audio.byteLength }
		})
	});
	if (typeof params.timestamp === "number" && Number.isFinite(params.timestamp)) session.bridge.setMediaTimestamp(params.timestamp);
}
/** Delivers a tool result from the browser/client side back to the provider. */
function submitTalkRealtimeRelayToolResult(params) {
	const session = getRelaySession(params.relaySessionId, params.connId);
	if (session.completedAgentToolCalls.has(params.callId)) return;
	const forcedConsult = session.forcedConsults.handles().find((handle) => handle.id === params.callId);
	if (forcedConsult) {
		const turnId = ensureRelayTurn(session);
		const cancelled = session.forcedConsults.isCancelled(forcedConsult);
		if (cancelled) {
			if (params.options?.willContinue !== true) session.forcedConsults.markCancelled(forcedConsult);
		} else if (isWorkingToolResult(params.result)) session.bridge.sendUserMessage(buildForcedConsultCheckingPrompt());
		else {
			session.forcedConsults.markDelivered(forcedConsult);
			const text = readSpeakableRealtimeVoiceToolResult(params.result, { maxChars: FORCED_CONSULT_RESULT_MAX_CHARS });
			for (const nativeCallId of session.forcedConsults.nativeCallIds(forcedConsult)) submitAlreadyDeliveredToolResult(session, nativeCallId, turnId);
			if (text) session.bridge.sendUserMessage(buildForcedConsultSpeechPrompt(text));
		}
		const final = params.options?.willContinue !== true;
		if (final && !cancelled && !isWorkingToolResult(params.result)) session.forcedConsults.markDelivered(forcedConsult);
		broadcastToolResultToOwner(session, {
			callId: params.callId,
			turnId,
			result: params.result,
			forced: true,
			final
		});
		return;
	}
	session.bridge.submitToolResult(params.callId, params.result, params.options);
	const turnId = ensureRelayTurn(session);
	const final = params.options?.willContinue !== true;
	if (final) {
		const runId = session.activeAgentToolCalls.get(params.callId);
		if (runId) {
			session.activeAgentRuns.delete(runId);
			session.activeAgentToolCalls.delete(params.callId);
		}
	}
	broadcastToolResultToOwner(session, {
		callId: params.callId,
		turnId,
		result: params.result,
		final
	});
}
/** Tracks the chat run started for a realtime agent-consult tool call. */
function registerTalkRealtimeRelayAgentRun(params) {
	const session = getRelaySession(params.relaySessionId, params.connId);
	session.activeAgentRuns.set(params.runId, params.sessionKey);
	if (params.callId?.trim()) session.activeAgentToolCalls.set(params.callId.trim(), params.runId);
	if (!session.sessionKey) session.sessionKey = params.sessionKey;
}
/** Applies realtime voice-control text to the active agent-consult chat run. */
async function steerTalkRealtimeRelayAgentRun(params) {
	const session = getRelaySession(params.relaySessionId, params.connId);
	const sessionKey = session.sessionKey;
	if (!sessionKey) throw new Error("Realtime relay steering requires a session key");
	const requestedSessionKey = params.sessionKey?.trim();
	if (requestedSessionKey && requestedSessionKey !== sessionKey) throw new Error("Realtime relay steering session key does not match the relay session");
	const result = await controlRealtimeVoiceAgentRun({
		sessionKey,
		text: params.text,
		mode: params.mode,
		recentEvents: session.talk.recentEvents
	});
	const turnId = ensureRelayTurn(session);
	broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "toolProgress",
		result,
		talkEvent: session.talk.emit({
			type: "tool.progress",
			turnId,
			payload: {
				name: "openclaw_agent_control",
				phase: result.mode,
				result
			},
			final: result.mode === "cancel" || result.mode === "status"
		})
	});
	submitRelayAgentControlProviderResults(session, result, turnId);
	return result;
}
/** Cancels the active relay turn, aborts agent work, and clears provider audio. */
function cancelTalkRealtimeRelayTurn(params) {
	const session = getRelaySession(params.relaySessionId, params.connId);
	const turnId = ensureRelayTurn(session);
	const reason = params.reason ?? "client-cancelled";
	cancelForcedConsults(session);
	session.bridge.handleBargeIn({ audioPlaybackActive: true });
	abortRelayAgentRuns(session, reason);
	const cancelled = session.talk.cancelTurn({
		turnId,
		payload: { reason }
	});
	broadcastToOwner$1(session.context, session.connId, {
		relaySessionId: session.id,
		type: "clear",
		talkEvent: cancelled.ok ? cancelled.event : void 0
	});
}
/** Closes a realtime relay session owned by the current connection. */
function stopTalkRealtimeRelaySession(params) {
	closeRelaySession(getRelaySession(params.relaySessionId, params.connId), "completed");
}
//#endregion
//#region src/gateway/talk-agent-consult.ts
function normalizeTalkChatSendAckStatus(result) {
	if (!result || typeof result !== "object" || Array.isArray(result)) return "started";
	const status = result.status;
	return status === "in_flight" || status === "ok" || status === "timeout" || status === "error" ? status : "started";
}
function terminalTalkChatSendAckError(status) {
	if (status === "timeout") return errorShape(ErrorCodes.UNAVAILABLE, "Realtime agent consult ended before the run started.");
	if (status === "error") return errorShape(ErrorCodes.UNAVAILABLE, "Realtime agent consult failed before the run started.");
	if (status === "ok") return errorShape(ErrorCodes.UNAVAILABLE, "Realtime agent consult completed before the tool result subscription started.");
}
/**
* Starts the agent-consult chat run that backs realtime Talk tool calls.
*/
async function startTalkRealtimeAgentConsult(params) {
	let message;
	try {
		message = buildRealtimeVoiceAgentConsultChatMessage(params.args);
	} catch (err) {
		return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err))
		};
	}
	const idempotencyKey = `talk-${params.callId}-${randomUUID()}`;
	const normalizedTalk = normalizeTalkSection(params.context.getRuntimeConfig().talk);
	let chatResponse;
	await chatHandlers["chat.send"]({
		req: {
			type: "req",
			id: `${params.requestId}:talk-tool-call`,
			method: "chat.send"
		},
		client: params.client,
		isWebchatConnect: params.isWebchatConnect,
		context: params.context,
		params: {
			sessionKey: params.sessionKey,
			message,
			idempotencyKey,
			...normalizedTalk?.consultThinkingLevel ? { thinking: normalizedTalk.consultThinkingLevel } : {},
			...typeof normalizedTalk?.consultFastMode === "boolean" ? { fastMode: normalizedTalk.consultFastMode } : {}
		},
		respond: (ok, result, error) => {
			chatResponse = ok ? {
				ok: true,
				result
			} : {
				ok: false,
				error: error ?? errorShape(ErrorCodes.UNAVAILABLE, "chat.send failed without error")
			};
		}
	});
	if (!chatResponse) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, "chat.send did not return a realtime tool result")
	};
	if (!chatResponse.ok) return {
		ok: false,
		error: chatResponse.error
	};
	const result = chatResponse.result;
	const terminalAckError = terminalTalkChatSendAckError(normalizeTalkChatSendAckStatus(result));
	if (terminalAckError) return {
		ok: false,
		error: terminalAckError
	};
	const runId = result && typeof result === "object" && !Array.isArray(result) ? typeof result.runId === "string" ? result.runId : idempotencyKey : idempotencyKey;
	if (params.relaySessionId && params.connId) registerTalkRealtimeRelayAgentRun({
		relaySessionId: params.relaySessionId,
		connId: params.connId,
		sessionKey: params.sessionKey,
		runId,
		callId: params.callId
	});
	return {
		ok: true,
		runId,
		idempotencyKey
	};
}
//#endregion
//#region src/gateway/server-methods/talk-shared.ts
function canUseTalkDirectTools(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
function broadcastTalkRoomEvents(context, connId, params) {
	if (!connId || params.events.length === 0) return;
	for (const talkEvent of params.events) context.broadcastToConnIds("talk.event", {
		handoffId: params.handoffId,
		roomId: params.roomId,
		talkEvent
	}, new Set([connId]), { dropIfSlow: true });
}
function talkHandoffErrorCode(reason) {
	return reason === "invalid_token" || reason === "no_active_turn" || reason === "stale_turn" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE;
}
function getRecord(value) {
	return asOptionalRecord(value) ?? void 0;
}
function singleRecordKey(record) {
	const keys = record ? Object.keys(record) : [];
	return keys.length === 1 ? keys[0] : void 0;
}
function getVoiceCallProviderConfig(config, sectionName) {
	const section = getRecord(getRecord(getRecord(getRecord(getRecord(config.plugins)?.entries)?.["voice-call"])?.config)?.[sectionName]);
	const providersRaw = getRecord(section?.providers);
	const providers = {};
	if (providersRaw) for (const [providerId, providerConfig] of Object.entries(providersRaw)) {
		const record = getRecord(providerConfig);
		if (record) providers[providerId] = record;
	}
	return {
		provider: normalizeOptionalString(section?.provider),
		providers: Object.keys(providers).length > 0 ? providers : void 0
	};
}
function getVoiceCallRealtimeConfig(config) {
	return getVoiceCallProviderConfig(config, "realtime");
}
function getVoiceCallStreamingConfig(config) {
	return getVoiceCallProviderConfig(config, "streaming");
}
function resolveConfiguredVoiceModelDefaultRef(params) {
	const configuredProvider = normalizeOptionalString(params.provider);
	const refs = resolveSupportedVoiceModelRefs({
		config: params.config.agents?.defaults?.voiceModel,
		providers: params.providers,
		providerId: configuredProvider
	});
	for (const ref of refs) {
		const provider = params.providers.find((entry) => providerMatchesId(entry, ref.provider));
		if (!provider) continue;
		if (!configuredProvider) {
			const rawConfig = getVoiceProviderConfig({
				providerConfigs: params.providerConfigs,
				provider
			});
			const rawConfigWithModel = rawConfig.model === void 0 ? {
				...rawConfig,
				model: ref.model
			} : rawConfig;
			const providerConfig = provider.resolveConfig?.({
				cfg: params.config,
				rawConfig: rawConfigWithModel
			}) ?? rawConfigWithModel;
			if (!configuredOrFalse(() => provider.isConfigured({
				cfg: params.config,
				providerConfig
			}))) continue;
		}
		return {
			provider: provider.id,
			model: ref.model
		};
	}
}
function buildTalkRealtimeConfig(config, requestedProvider) {
	const voiceCallRealtime = getVoiceCallRealtimeConfig(config);
	const talkRealtime = getRecord(config.talk?.realtime);
	const talkRealtimeProviderConfigs = talkRealtime?.providers;
	const explicitProvider = normalizeOptionalString(requestedProvider) ?? normalizeOptionalString(talkRealtime?.provider);
	const singleConfiguredProvider = normalizeOptionalString(singleRecordKey(talkRealtimeProviderConfigs));
	const selectedProvider = explicitProvider ?? singleConfiguredProvider ?? voiceCallRealtime.provider ?? singleConfiguredProvider;
	const providerConfigs = {
		...voiceCallRealtime.providers,
		...talkRealtimeProviderConfigs
	};
	const voiceModelDefault = resolveConfiguredVoiceModelDefaultRef({
		config,
		provider: selectedProvider,
		providerConfigs,
		providers: listRealtimeVoiceProviders(config)
	});
	return {
		provider: selectedProvider ?? voiceModelDefault?.provider,
		providers: providerConfigs,
		model: normalizeOptionalString(talkRealtime?.model) ?? voiceModelDefault?.model,
		voice: normalizeOptionalString(talkRealtime?.speakerVoice) ?? normalizeOptionalString(talkRealtime?.speakerVoiceId) ?? normalizeOptionalString(talkRealtime?.voice),
		instructions: normalizeOptionalString(talkRealtime?.instructions),
		mode: normalizeOptionalLowercaseString(talkRealtime?.mode),
		transport: normalizeOptionalLowercaseString(talkRealtime?.transport),
		brain: normalizeOptionalLowercaseString(talkRealtime?.brain),
		consultRouting: normalizeOptionalLowercaseString(talkRealtime?.consultRouting)
	};
}
function buildTalkTranscriptionConfig(config, requestedProvider) {
	const streamingConfig = getVoiceCallStreamingConfig(config);
	const provider = normalizeOptionalString(requestedProvider) ?? streamingConfig.provider;
	const providerConfigs = streamingConfig.providers ?? {};
	const voiceModelDefault = resolveConfiguredVoiceModelDefaultRef({
		config,
		provider,
		providerConfigs,
		providers: listRealtimeTranscriptionProviders(config)
	});
	return {
		provider: provider ?? voiceModelDefault?.provider,
		providers: providerConfigs,
		model: voiceModelDefault?.model
	};
}
function configuredOrFalse(callback) {
	try {
		return callback();
	} catch {
		return false;
	}
}
function resolveConfiguredRealtimeTranscriptionProvider(params) {
	const providers = listRealtimeTranscriptionProviders(params.config);
	const normalizedConfigured = normalizeOptionalLowercaseString(params.configuredProviderId);
	const orderedProviders = normalizedConfigured ? providers.filter((provider) => normalizeOptionalLowercaseString(provider.id) === normalizedConfigured || (provider.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalizedConfigured)) : providers.toSorted((a, b) => (a.autoSelectOrder ?? 1e3) - (b.autoSelectOrder ?? 1e3));
	for (const provider of orderedProviders) {
		const rawConfig = getVoiceProviderConfig({
			providerConfigs: params.providerConfigs,
			provider,
			configuredProviderId: params.configuredProviderId
		});
		const rawConfigWithModel = params.defaultModel && rawConfig.model === void 0 ? {
			...rawConfig,
			model: params.defaultModel
		} : rawConfig;
		const providerConfig = provider.resolveConfig?.({
			cfg: params.config,
			rawConfig: rawConfigWithModel
		}) ?? rawConfigWithModel;
		if (configuredOrFalse(() => provider.isConfigured({
			cfg: params.config,
			providerConfig
		}))) return {
			provider,
			providerConfig
		};
	}
	if (normalizedConfigured) throw new Error(`Realtime transcription provider "${params.configuredProviderId}" is not configured`);
	throw new Error("No realtime transcription provider registered");
}
const DEFAULT_REALTIME_INSTRUCTIONS = [
	"You are OpenClaw's realtime voice interface. Keep spoken replies concise.",
	`If the user asks for code, repository state, files, current OpenClaw context, tool-backed actions, or deeper reasoning, call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} and then summarize the result naturally.`,
	`Do not claim you cannot use tools, perform actions, or reach OpenClaw unless ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} returns that failure.`,
	`When ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} is in progress, speak one brief acknowledgement such as "Let me check that for you", then wait for the final OpenClaw result before answering with the actual result.`,
	`If OpenClaw is already working through ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} and the user asks in any language for progress, cancellation, a redirect/change, or a follow-up, call ${REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME} with the semantic mode.`,
	"For greetings and casual chatter while OpenClaw is working, answer naturally and do not redirect the active work."
].join(" ");
function buildRealtimeInstructions(configuredInstructions) {
	const extra = normalizeOptionalString(configuredInstructions);
	if (!extra) return DEFAULT_REALTIME_INSTRUCTIONS;
	return `${DEFAULT_REALTIME_INSTRUCTIONS}\n\nAdditional realtime instructions:\n${extra}`;
}
function buildRealtimeVoiceLaunchOptions(params) {
	return {
		...pickRealtimeVoiceLaunchOptions(params.defaults),
		...pickRealtimeVoiceLaunchOptions(params.requested)
	};
}
function withRealtimeBrowserOverrides(providerConfig, params) {
	const overrides = {};
	const model = normalizeOptionalString(params.model);
	const voice = normalizeOptionalString(params.voice);
	const reasoningEffort = normalizeOptionalString(params.reasoningEffort);
	if (model) overrides.model = model;
	if (voice) overrides.voice = voice;
	if (typeof params.vadThreshold === "number" && Number.isFinite(params.vadThreshold)) overrides.vadThreshold = params.vadThreshold;
	if (typeof params.silenceDurationMs === "number" && Number.isFinite(params.silenceDurationMs)) overrides.silenceDurationMs = params.silenceDurationMs;
	if (typeof params.prefixPaddingMs === "number" && Number.isFinite(params.prefixPaddingMs)) overrides.prefixPaddingMs = params.prefixPaddingMs;
	if (reasoningEffort) overrides.reasoningEffort = reasoningEffort;
	return Object.keys(overrides).length > 0 ? {
		...providerConfig,
		...overrides
	} : providerConfig;
}
function pickRealtimeVoiceLaunchOptions(params) {
	const options = {};
	const model = normalizeOptionalString(params.model);
	const voice = normalizeOptionalString(params.voice);
	const reasoningEffort = normalizeOptionalString(params.reasoningEffort);
	if (model) options.model = model;
	if (voice) options.voice = voice;
	if (typeof params.vadThreshold === "number" && Number.isFinite(params.vadThreshold)) options.vadThreshold = params.vadThreshold;
	if (typeof params.silenceDurationMs === "number" && Number.isFinite(params.silenceDurationMs)) options.silenceDurationMs = params.silenceDurationMs;
	if (typeof params.prefixPaddingMs === "number" && Number.isFinite(params.prefixPaddingMs)) options.prefixPaddingMs = params.prefixPaddingMs;
	if (reasoningEffort) options.reasoningEffort = reasoningEffort;
	return options;
}
function isUnsupportedBrowserWebRtcSession(session) {
	const provider = normalizeLowercaseStringOrEmpty(session.provider);
	const transport = session.transport ?? "webrtc";
	return provider === "google" && transport === "webrtc";
}
//#endregion
//#region src/gateway/server-methods/talk-client.ts
/**
* Gateway methods for browser-owned realtime Talk sessions.
*
* These handlers create provider browser sessions and bridge client-owned tool
* calls back into OpenClaw agent consult runs.
*/
const talkClientHandlers = {
	"talk.client.create": async ({ params, respond, context }) => {
		if (!validateTalkClientCreateParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.client.create params: ${formatValidationErrors(validateTalkClientCreateParams.errors)}`));
			return;
		}
		const typedParams = params;
		try {
			const runtimeConfig = context.getRuntimeConfig();
			const realtimeConfig = buildTalkRealtimeConfig(runtimeConfig, typedParams.provider);
			const mode = normalizeOptionalLowercaseString(typedParams.mode) ?? realtimeConfig.mode ?? "realtime";
			if (mode !== "realtime") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `talk.client.create only supports mode="realtime"; use talk.catalog for ${mode} provider discovery`));
				return;
			}
			if ((normalizeOptionalLowercaseString(typedParams.brain) ?? realtimeConfig.brain ?? "agent-consult") !== "agent-consult") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `talk.client.create only supports brain="agent-consult"`));
				return;
			}
			const transport = normalizeOptionalLowercaseString(typedParams.transport) ?? realtimeConfig.transport;
			if (transport === "managed-room") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "managed-room realtime Talk sessions are not available in the browser UI yet"));
				return;
			}
			if (transport === "gateway-relay") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `talk.client.create is client-owned; use talk.session.create for gateway-relay`));
				return;
			}
			const resolution = resolveConfiguredRealtimeVoiceProvider({
				configuredProviderId: realtimeConfig.provider,
				providerConfigs: realtimeConfig.providers,
				cfg: runtimeConfig,
				cfgForResolve: runtimeConfig,
				defaultModel: realtimeConfig.model,
				noRegisteredProviderMessage: "No realtime voice provider registered"
			});
			const launchOptions = buildRealtimeVoiceLaunchOptions({
				requested: typedParams,
				defaults: realtimeConfig
			});
			if (resolution.provider.createBrowserSession && transport !== "gateway-relay") {
				const session = await resolution.provider.createBrowserSession({
					cfg: runtimeConfig,
					providerConfig: resolution.providerConfig,
					instructions: buildRealtimeInstructions(realtimeConfig.instructions),
					tools: [REALTIME_VOICE_AGENT_CONSULT_TOOL, REALTIME_VOICE_AGENT_CONTROL_TOOL],
					...launchOptions
				});
				if (!isUnsupportedBrowserWebRtcSession(session) && (!transport || session.transport === transport)) {
					respond(true, session, void 0);
					return;
				}
				if (transport) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Realtime provider "${resolution.provider.id}" does not support requested browser transport "${transport}"`));
					return;
				}
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Realtime provider "${resolution.provider.id}" does not support client-owned realtime sessions`));
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"talk.client.toolCall": async (request) => {
		const { params, respond } = request;
		if (!validateTalkClientToolCallParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.client.toolCall params: ${formatValidationErrors(validateTalkClientToolCallParams.errors)}`));
			return;
		}
		if (params.name !== "openclaw_agent_consult") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsupported realtime Talk tool: ${params.name}`));
			return;
		}
		const result = await startTalkRealtimeAgentConsult({
			context: request.context,
			client: request.client,
			isWebchatConnect: request.isWebchatConnect,
			requestId: request.req.id,
			sessionKey: params.sessionKey,
			callId: params.callId,
			args: params.args ?? {},
			relaySessionId: normalizeOptionalString(params.relaySessionId),
			connId: normalizeOptionalString(request.client?.connId)
		});
		if (!result.ok) {
			respond(false, void 0, result.error);
			return;
		}
		respond(true, {
			runId: result.runId,
			idempotencyKey: result.idempotencyKey
		}, void 0);
	},
	"talk.client.steer": async ({ params, respond, client, context }) => {
		if (!validateTalkClientSteerParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.client.steer params: ${formatValidationErrors(validateTalkClientSteerParams.errors)}`));
			return;
		}
		if (!hasOwnedActiveTalkClientRun({
			context,
			clientConnId: client?.connId,
			sessionKey: params.sessionKey
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "talk.client.steer requires an active browser-owned Talk run"));
			return;
		}
		try {
			respond(true, await controlRealtimeVoiceAgentRun({
				sessionKey: params.sessionKey,
				text: params.text,
				mode: params.mode
			}), void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	}
};
function hasOwnedActiveTalkClientRun(params) {
	const connId = normalizeOptionalString(params.clientConnId);
	const sessionKey = params.sessionKey.trim();
	if (!connId || !sessionKey) return false;
	for (const entry of params.context.chatAbortControllers.values()) if (entry.sessionKey === sessionKey && entry.ownerConnId === connId && entry.kind !== "agent") return true;
	return false;
}
//#endregion
//#region src/gateway/talk-handoff.ts
const DEFAULT_TALK_HANDOFF_TTL_MS = 600 * 1e3;
const MAX_TALK_HANDOFF_TTL_MS = 3600 * 1e3;
const handoffs = /* @__PURE__ */ new Map();
/** Creates a short-lived Talk room and returns the only plaintext join token. */
function createTalkHandoff(params) {
	pruneExpiredTalkHandoffs();
	const rawCreatedAt = Date.now();
	const createdAt = resolveDateTimestampMs(rawCreatedAt);
	const expiresAt = resolveExpiresAtMsFromDurationMs(normalizeTtlMs(params.ttlMs), { nowMs: rawCreatedAt }) ?? 0;
	const id = randomUUID();
	const roomId = `talk_${id}`;
	const token = randomBytes(32).toString("base64url");
	const room = createTalkHandoffRoom({
		roomId,
		mode: params.mode ?? "stt-tts",
		transport: params.transport ?? "managed-room",
		brain: params.brain ?? "agent-consult",
		provider: params.provider
	});
	const record = {
		id,
		roomId,
		roomUrl: `/talk/rooms/${roomId}`,
		tokenHash: hashTalkHandoffToken(token),
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		channel: params.channel,
		target: params.target,
		provider: params.provider,
		model: params.model,
		voice: params.voice,
		mode: params.mode ?? "stt-tts",
		transport: params.transport ?? "managed-room",
		brain: params.brain ?? "agent-consult",
		createdAt,
		expiresAt,
		room
	};
	appendTalkHandoffRoomEvent(record, {
		type: "session.started",
		payload: {
			handoffId: id,
			roomId
		}
	});
	handoffs.set(id, record);
	return {
		...toPublicTalkHandoffRecord(record),
		token
	};
}
/** Returns a non-expired handoff record for gateway-internal callers. */
function getTalkHandoff(id) {
	pruneExpiredTalkHandoffs();
	return handoffs.get(id);
}
/** Joins a managed room, replacing any previous active client for that room. */
function joinTalkHandoff(id, token, opts = {}) {
	const access = resolveTalkHandoffAccess(id, token);
	if (!access.ok) return access;
	const record = access.record;
	const previousClientId = record.room.activeClientId;
	const events = joinTalkHandoffRoom(record, opts.clientId);
	const replacedClientId = previousClientId && previousClientId !== opts.clientId ? previousClientId : void 0;
	const replacementEvents = replacedClientId ? events.filter((event) => event.type === "session.replaced") : [];
	const activeClientEvents = replacedClientId ? events.filter((event) => event.type !== "session.replaced") : events;
	return {
		ok: true,
		record: toPublicTalkHandoffRecord(record),
		events,
		replacedClientId,
		replacementEvents,
		activeClientEvents
	};
}
/** Starts a client turn in a joined managed room. */
function startTalkHandoffTurn(id, token, opts = {}) {
	const access = resolveTalkHandoffAccess(id, token);
	if (!access.ok) return access;
	const record = access.record;
	if (opts.clientId) record.room.activeClientId = opts.clientId;
	const turnId = normalizeOptionalString(opts.turnId) ?? randomUUID();
	const turn = record.room.talk.startTurn({
		turnId,
		payload: {
			handoffId: id,
			roomId: record.roomId,
			clientId: record.room.activeClientId
		}
	});
	return {
		ok: true,
		record: toPublicTalkHandoffRecord(record),
		turnId,
		events: turn.event ? [turn.event] : []
	};
}
/** Ends the active managed-room turn and returns the emitted Talk event. */
function endTalkHandoffTurn(id, token, opts = {}) {
	const access = resolveTalkHandoffAccess(id, token);
	if (!access.ok) return access;
	const record = access.record;
	const result = record.room.talk.endTurn({
		turnId: normalizeOptionalString(opts.turnId),
		payload: {
			handoffId: id,
			roomId: record.roomId
		}
	});
	if (!result.ok) return result;
	return {
		ok: true,
		record: toPublicTalkHandoffRecord(record),
		turnId: result.turnId,
		events: [result.event]
	};
}
/** Cancels the active managed-room turn with a client-visible reason. */
function cancelTalkHandoffTurn(id, token, opts = {}) {
	const access = resolveTalkHandoffAccess(id, token);
	if (!access.ok) return access;
	const record = access.record;
	const result = record.room.talk.cancelTurn({
		turnId: normalizeOptionalString(opts.turnId),
		payload: {
			handoffId: id,
			roomId: record.roomId,
			reason: opts.reason ?? "client-cancelled"
		}
	});
	if (!result.ok) return result;
	return {
		ok: true,
		record: toPublicTalkHandoffRecord(record),
		turnId: result.turnId,
		events: [result.event]
	};
}
/** Revokes a handoff and emits the final room-close event if it existed. */
function revokeTalkHandoff(id) {
	pruneExpiredTalkHandoffs();
	const record = handoffs.get(id);
	if (!record) return {
		revoked: false,
		events: []
	};
	const event = appendTalkHandoffRoomEvent(record, {
		type: "session.closed",
		payload: {
			reason: "revoked",
			handoffId: id,
			roomId: record.roomId
		},
		final: true
	});
	handoffs.delete(id);
	return {
		revoked: true,
		roomId: record.roomId,
		activeClientId: record.room.activeClientId,
		events: [event]
	};
}
/** Verifies the caller token without exposing the stored token hash. */
function verifyTalkHandoffToken(record, token) {
	return record.tokenHash === hashTalkHandoffToken(token);
}
function normalizeTtlMs(value) {
	if (!Number.isFinite(value) || value === void 0) return DEFAULT_TALK_HANDOFF_TTL_MS;
	return Math.min(Math.max(Math.trunc(value), 1e3), MAX_TALK_HANDOFF_TTL_MS);
}
function pruneExpiredTalkHandoffs(now = Date.now()) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) return;
	for (const [id, record] of handoffs) if (!isFutureDateTimestampMs(record.expiresAt, { nowMs: validNow })) {
		appendTalkHandoffRoomEvent(record, {
			type: "session.closed",
			payload: {
				reason: "expired",
				handoffId: id,
				roomId: record.roomId
			},
			final: true
		});
		handoffs.delete(id);
	}
}
function hashTalkHandoffToken(token) {
	return createHash("sha256").update(token).digest("base64url");
}
function toPublicTalkHandoffRecord(record) {
	const { tokenHash: _tokenHash, room: _room, ...publicRecord } = record;
	return {
		...publicRecord,
		room: {
			activeClientId: record.room.activeClientId,
			activeTurnId: record.room.talk.activeTurnId,
			recentTalkEvents: [...record.room.talk.recentEvents]
		}
	};
}
function createTalkHandoffRoom(params) {
	return { talk: createTalkSessionController({
		sessionId: params.roomId,
		mode: params.mode,
		transport: params.transport,
		brain: params.brain,
		provider: params.provider
	}, { onEvent: recordTalkObservabilityEvent }) };
}
function resolveTalkHandoffAccess(id, token) {
	const record = handoffs.get(id);
	if (!record) return {
		ok: false,
		reason: "not_found"
	};
	if (!isFutureDateTimestampMs(record.expiresAt)) {
		appendTalkHandoffRoomEvent(record, {
			type: "session.closed",
			payload: {
				reason: "expired",
				handoffId: id,
				roomId: record.roomId
			},
			final: true
		});
		handoffs.delete(id);
		return {
			ok: false,
			reason: "expired"
		};
	}
	if (!verifyTalkHandoffToken(record, token)) return {
		ok: false,
		reason: "invalid_token"
	};
	return {
		ok: true,
		record
	};
}
function appendTalkHandoffRoomEvent(record, input) {
	return record.room.talk.emit(input);
}
function joinTalkHandoffRoom(record, clientId) {
	const events = [];
	if (record.room.activeClientId && record.room.activeClientId !== clientId) events.push(appendTalkHandoffRoomEvent(record, {
		type: "session.replaced",
		payload: {
			handoffId: record.id,
			roomId: record.roomId,
			previousClientId: record.room.activeClientId,
			nextClientId: clientId
		}
	}));
	record.room.activeClientId = clientId;
	events.push(appendTalkHandoffRoomEvent(record, {
		type: "session.ready",
		payload: {
			handoffId: record.id,
			roomId: record.roomId,
			clientId
		}
	}));
	return events;
}
//#endregion
//#region src/gateway/talk-transcription-relay.ts
/**
* Gateway-owned relay for streaming speech-to-text providers used by Talk.
*
* The relay accepts browser audio on one WebSocket connection, forwards it to a
* realtime transcription provider, and mirrors provider callbacks into Talk
* events for the same connection.
*/
const TRANSCRIPTION_SESSION_TTL_MS = 1800 * 1e3;
const MAX_AUDIO_BASE64_BYTES = 512 * 1024;
const MAX_TRANSCRIPTION_SESSIONS_PER_CONN = 2;
const MAX_TRANSCRIPTION_SESSIONS_GLOBAL = 64;
const TRANSCRIPTION_EVENT = "talk.event";
const RELAY_INPUT_ENCODING = "g711_ulaw";
const RELAY_INPUT_SAMPLE_RATE_HZ = 8e3;
const transcriptionSessions = /* @__PURE__ */ new Map();
/** Normalizes common provider audio-format aliases into the relay contract. */
function normalizeRelayInputEncoding(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase();
	if (!normalized) return;
	if (normalized === "mulaw" || normalized === "ulaw" || normalized === "g711_ulaw" || normalized === "g711-mulaw" || normalized === "pcm_mulaw" || normalized === "audio/pcmu" || normalized === "ulaw_8000") return "g711_ulaw";
	if (normalized === "alaw" || normalized === "g711_alaw" || normalized === "g711-alaw" || normalized === "pcm_alaw") return "g711_alaw";
	if (normalized === "pcm" || normalized === "pcm16" || normalized === "linear16" || normalized === "pcm_s16le") return "pcm16";
}
function inferSampleRateFromAudioFormat(value) {
	if (typeof value !== "string") return;
	const match = value.match(/_(\d+)$/);
	return match ? parseFiniteNumber(match[1]) : void 0;
}
/** Verifies provider config matches the audio format the browser relay emits. */
function assertRelayInputAudioConfig(providerConfig) {
	const encodingValue = providerConfig.encoding ?? providerConfig.audioFormat ?? providerConfig.audio_format;
	const encoding = normalizeRelayInputEncoding(encodingValue);
	if (encoding && encoding !== RELAY_INPUT_ENCODING) throw new Error(`Gateway transcription relay requires ${RELAY_INPUT_ENCODING}/${RELAY_INPUT_SAMPLE_RATE_HZ} audio`);
	const sampleRate = parseFiniteNumber(providerConfig.sampleRate ?? providerConfig.sample_rate) ?? inferSampleRateFromAudioFormat(encodingValue);
	if (sampleRate && sampleRate !== RELAY_INPUT_SAMPLE_RATE_HZ) throw new Error(`Gateway transcription relay requires ${RELAY_INPUT_ENCODING}/${RELAY_INPUT_SAMPLE_RATE_HZ} audio`);
}
function broadcastToOwner(context, connId, event) {
	context.broadcastToConnIds(TRANSCRIPTION_EVENT, event, new Set([connId]), { dropIfSlow: true });
}
function ensureTranscriptionTurn(session) {
	const turn = session.talk.ensureTurn();
	if (turn.event) broadcastToOwner(session.context, session.connId, {
		transcriptionSessionId: session.id,
		type: "speechStart",
		talkEvent: turn.event
	});
	return turn.turnId;
}
function closeTranscriptionSession(session, reason) {
	if (session.closed) return;
	session.closed = true;
	transcriptionSessions.delete(session.id);
	clearTimeout(session.cleanupTimer);
	session.sttSession.close();
	broadcastToOwner(session.context, session.connId, {
		transcriptionSessionId: session.id,
		type: "close",
		reason,
		talkEvent: session.talk.emit({
			type: "session.closed",
			payload: { reason },
			final: true
		})
	});
}
function pruneExpiredTranscriptionSessions(nowMs = Date.now()) {
	closeExpiredTalkRelaySessions({
		sessions: transcriptionSessions.values(),
		closeSession: (session) => closeTranscriptionSession(session, "completed"),
		nowMs
	});
}
function countTranscriptionSessionsForConn(connId) {
	let count = 0;
	for (const session of transcriptionSessions.values()) if (session.connId === connId) count += 1;
	return count;
}
function enforceTranscriptionSessionLimits(connId) {
	pruneExpiredTranscriptionSessions();
	if (transcriptionSessions.size >= MAX_TRANSCRIPTION_SESSIONS_GLOBAL) throw new Error("Too many active transcription Talk sessions");
	if (countTranscriptionSessionsForConn(connId) >= MAX_TRANSCRIPTION_SESSIONS_PER_CONN) throw new Error("Too many active transcription Talk sessions for this connection");
}
/** Creates a transcription relay session and returns its browser audio contract. */
function createTalkTranscriptionRelaySession(params) {
	enforceTranscriptionSessionLimits(params.connId);
	assertRelayInputAudioConfig(params.providerConfig);
	const transcriptionSessionId = randomUUID();
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(TRANSCRIPTION_SESSION_TTL_MS);
	if (expiresAtMs === void 0) throw new Error("Transcription relay session expiry is outside the supported Date range");
	const talk = createTalkSessionController({
		sessionId: transcriptionSessionId,
		mode: "transcription",
		transport: "gateway-relay",
		brain: "none",
		provider: params.provider.id
	}, { onEvent: recordTalkObservabilityEvent });
	const emit = (event, talkEvent) => {
		broadcastToOwner(params.context, params.connId, {
			...event,
			...talkEvent ? { talkEvent: talk.emit(talkEvent) } : {}
		});
	};
	const relayRef = {};
	const ensureTurnId = () => {
		const relay = relayRef.current;
		return relay ? ensureTranscriptionTurn(relay) : "turn-1";
	};
	const sttSession = params.provider.createSession({
		cfg: params.context.getRuntimeConfig(),
		providerConfig: params.providerConfig,
		onSpeechStart: () => {
			ensureTurnId();
		},
		onPartial: (text) => {
			const turnId = ensureTurnId();
			emit({
				transcriptionSessionId,
				type: "partial",
				text
			}, {
				type: "transcript.delta",
				turnId,
				payload: { text }
			});
		},
		onTranscript: (text) => {
			const turnId = ensureTurnId();
			emit({
				transcriptionSessionId,
				type: "transcript",
				text,
				final: true
			}, {
				type: "transcript.done",
				turnId,
				payload: { text },
				final: true
			});
			const relay = relayRef.current;
			if (relay) {
				const ended = relay.talk.endTurn({
					turnId,
					payload: {}
				});
				if (ended.ok) broadcastToOwner(relay.context, relay.connId, {
					transcriptionSessionId,
					type: "transcript",
					text: "",
					final: true,
					talkEvent: ended.event
				});
			}
		},
		onError: (error) => {
			emit({
				transcriptionSessionId,
				type: "error",
				message: error.message
			}, {
				type: "session.error",
				payload: { message: error.message },
				final: true
			});
			const relay = relayRef.current;
			if (relay) closeTranscriptionSession(relay, "error");
		}
	});
	const relay = {
		id: transcriptionSessionId,
		connId: params.connId,
		context: params.context,
		provider: params.provider,
		sttSession,
		talk,
		expiresAtMs,
		cleanupTimer: setTimeout(() => {
			const active = transcriptionSessions.get(transcriptionSessionId);
			if (active) closeTranscriptionSession(active, "completed");
		}, TRANSCRIPTION_SESSION_TTL_MS),
		closed: false
	};
	relayRef.current = relay;
	relay.cleanupTimer.unref?.();
	transcriptionSessions.set(transcriptionSessionId, relay);
	sttSession.connect().then(() => {
		emit({
			transcriptionSessionId,
			type: "ready"
		}, {
			type: "session.ready",
			payload: null
		});
	}).catch((error) => {
		emit({
			transcriptionSessionId,
			type: "error",
			message: error instanceof Error ? error.message : String(error)
		}, {
			type: "session.error",
			payload: { message: error instanceof Error ? error.message : String(error) },
			final: true
		});
		const active = transcriptionSessions.get(transcriptionSessionId);
		if (active) closeTranscriptionSession(active, "error");
	});
	return {
		provider: params.provider.id,
		mode: "transcription",
		transport: "gateway-relay",
		transcriptionSessionId,
		audio: {
			inputEncoding: RELAY_INPUT_ENCODING,
			inputSampleRateHz: RELAY_INPUT_SAMPLE_RATE_HZ
		},
		expiresAt: Math.floor(expiresAtMs / 1e3)
	};
}
function getTranscriptionSession(transcriptionSessionId, connId) {
	return requireActiveTalkRelaySession({
		sessions: transcriptionSessions,
		sessionId: transcriptionSessionId,
		connId,
		closeSession: (session) => closeTranscriptionSession(session, "completed"),
		unknownSessionMessage: "Unknown transcription Talk session"
	});
}
/** Streams one base64-encoded audio frame into the owning transcription relay. */
function sendTalkTranscriptionRelayAudio(params) {
	if (params.audioBase64.length > MAX_AUDIO_BASE64_BYTES) throw new Error("Transcription Talk audio frame is too large");
	const session = getTranscriptionSession(params.transcriptionSessionId, params.connId);
	const audio = Buffer.from(params.audioBase64, "base64");
	const turnId = ensureTranscriptionTurn(session);
	session.sttSession.sendAudio(audio);
	broadcastToOwner(session.context, session.connId, {
		transcriptionSessionId: session.id,
		type: "inputAudio",
		byteLength: audio.byteLength,
		talkEvent: session.talk.emit({
			type: "input.audio.delta",
			turnId,
			payload: { byteLength: audio.byteLength }
		})
	});
}
/** Commits the current transcription turn and closes the relay. */
function stopTalkTranscriptionRelaySession(params) {
	const session = getTranscriptionSession(params.transcriptionSessionId, params.connId);
	if (session.talk.activeTurnId) broadcastToOwner(session.context, session.connId, {
		transcriptionSessionId: session.id,
		type: "transcript",
		text: "",
		final: true,
		talkEvent: session.talk.emit({
			type: "input.audio.committed",
			turnId: session.talk.activeTurnId,
			payload: {},
			final: true
		})
	});
	closeTranscriptionSession(session, "completed");
}
/** Cancels the active transcription turn and closes the relay. */
function cancelTalkTranscriptionRelayTurn(params) {
	const session = getTranscriptionSession(params.transcriptionSessionId, params.connId);
	const turnId = ensureTranscriptionTurn(session);
	const cancelled = session.talk.cancelTurn({
		turnId,
		payload: { reason: params.reason ?? "client-cancelled" }
	});
	broadcastToOwner(session.context, session.connId, {
		transcriptionSessionId: session.id,
		type: "transcript",
		text: "",
		final: true,
		talkEvent: cancelled.ok ? cancelled.event : void 0
	});
	closeTranscriptionSession(session, "completed");
}
//#endregion
//#region src/gateway/server-methods/talk-session.ts
function normalizeTalkSessionMode(params) {
	const mode = normalizeOptionalLowercaseString(params.mode);
	if (mode) return mode;
	return normalizeOptionalLowercaseString(params.transport) === "managed-room" ? "stt-tts" : "realtime";
}
function normalizeTalkSessionTransport(params) {
	const transport = normalizeOptionalLowercaseString(params.transport);
	if (transport) return transport;
	return params.mode === "stt-tts" ? "managed-room" : "gateway-relay";
}
function normalizeTalkSessionBrain(params) {
	const brain = normalizeOptionalLowercaseString(params.brain);
	if (brain) return brain;
	return params.mode === "transcription" ? "none" : "agent-consult";
}
function isActiveManagedRoomClient(session, connId) {
	if (!connId) return false;
	return getTalkHandoff(session.handoffId)?.room.activeClientId === connId;
}
function canCloseManagedRoomSession(session, connId) {
	const handoff = getTalkHandoff(session.handoffId);
	return !handoff?.room.activeClientId || handoff.room.activeClientId === connId;
}
function canCreateUnscopedManagedRoomSession(client) {
	return client?.connect?.scopes?.includes(ADMIN_SCOPE) === true;
}
function managedRoomOwnershipError(action) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `talk.session.${action} requires the active managed-room connection`);
}
function respondInvalidRequest(respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
function respondUnavailable(respond, err) {
	const message = formatForLog(err);
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { details: { talkIssue: {
		code: "realtime_unavailable",
		message,
		phase: "request"
	} } }));
}
function respondOk(respond, payload = { ok: true }) {
	respond(true, payload, void 0);
}
function respondManagedRoomTurn(params) {
	if (params.session.kind !== "managed-room") {
		respondInvalidRequest(params.respond, `${params.method} requires managed-room`);
		return;
	}
	if (!isActiveManagedRoomClient(params.session, params.connId)) {
		params.respond(false, void 0, managedRoomOwnershipError(params.ownershipAction));
		return;
	}
	const result = params.run(params.session);
	if (!result.ok) {
		params.respond(false, void 0, errorShape(talkHandoffErrorCode(result.reason), `talk turn ${params.failureVerb} failed: ${result.reason}`));
		return;
	}
	broadcastTalkRoomEvents(params.context, result.record.room.activeClientId, {
		handoffId: result.record.id,
		roomId: result.record.roomId,
		events: result.events
	});
	respondOk(params.respond, {
		ok: true,
		turnId: result.turnId,
		events: result.events
	});
}
/** RPC handlers for gateway-managed Talk sessions and room lifecycle. */
const talkSessionHandlers = {
	"talk.session.create": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTalkSessionCreateParams, "talk.session.create", respond)) return;
		const mode = normalizeTalkSessionMode(params);
		const transport = normalizeTalkSessionTransport({
			mode,
			transport: params.transport
		});
		const brain = normalizeTalkSessionBrain({
			mode,
			brain: params.brain
		});
		if (transport === "webrtc" || transport === "provider-websocket") {
			respondInvalidRequest(respond, `talk.session.create is Gateway-managed; use talk.client.create for client transport "${transport}"`);
			return;
		}
		try {
			if (transport === "managed-room") {
				if (brain === "direct-tools" && !canUseTalkDirectTools(client)) {
					respondInvalidRequest(respond, `talk.session.create brain="direct-tools" requires gateway scope: ${ADMIN_SCOPE}`);
					return;
				}
				const spawnedBy = normalizeOptionalString(params.spawnedBy);
				if (normalizeOptionalString(params.sessionKey) && !spawnedBy && !canCreateUnscopedManagedRoomSession(client)) {
					respondInvalidRequest(respond, `talk.session.create managed-room sessionKey requires spawnedBy or gateway scope: ${ADMIN_SCOPE}`);
					return;
				}
				const resolvedSession = await resolveSessionKeyFromResolveParams({
					cfg: context.getRuntimeConfig(),
					p: {
						key: params.sessionKey,
						...spawnedBy ? { spawnedBy } : {},
						includeGlobal: true,
						includeUnknown: true
					}
				});
				if (!resolvedSession.ok) {
					respond(false, void 0, resolvedSession.error);
					return;
				}
				if ("missing" in resolvedSession) {
					respondInvalidRequest(respond, `No session found: ${params.sessionKey}`);
					return;
				}
				const handoff = createTalkHandoff({
					sessionKey: resolvedSession.key,
					provider: normalizeOptionalString(params.provider),
					model: normalizeOptionalString(params.model),
					voice: normalizeOptionalString(params.voice),
					mode,
					transport,
					brain,
					ttlMs: params.ttlMs
				});
				rememberUnifiedTalkSession(handoff.id, {
					kind: "managed-room",
					handoffId: handoff.id,
					token: handoff.token,
					roomId: handoff.roomId
				});
				respondOk(respond, {
					sessionId: handoff.id,
					provider: handoff.provider,
					mode: handoff.mode,
					transport: handoff.transport,
					brain: handoff.brain,
					handoffId: handoff.id,
					roomId: handoff.roomId,
					roomUrl: handoff.roomUrl,
					token: handoff.token,
					model: handoff.model,
					voice: handoff.voice,
					expiresAt: handoff.expiresAt
				});
				return;
			}
			const connId = client?.connId;
			if (!connId) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Talk session unavailable"));
				return;
			}
			if (mode === "realtime") {
				if (transport !== "gateway-relay" || brain !== "agent-consult") {
					respondInvalidRequest(respond, `realtime talk.session.create requires transport="gateway-relay" and brain="agent-consult"`);
					return;
				}
				const runtimeConfig = context.getRuntimeConfig();
				const realtimeConfig = buildTalkRealtimeConfig(runtimeConfig, params.provider);
				const resolution = resolveConfiguredRealtimeVoiceProvider({
					configuredProviderId: realtimeConfig.provider,
					providerConfigs: realtimeConfig.providers,
					cfg: runtimeConfig,
					cfgForResolve: runtimeConfig,
					defaultModel: realtimeConfig.model,
					noRegisteredProviderMessage: "No realtime voice provider registered"
				});
				const launchOptions = buildRealtimeVoiceLaunchOptions({
					requested: params,
					defaults: realtimeConfig
				});
				const session = createTalkRealtimeRelaySession({
					context,
					connId,
					cfg: runtimeConfig,
					provider: resolution.provider,
					providerConfig: withRealtimeBrowserOverrides(resolution.providerConfig, launchOptions),
					instructions: buildRealtimeInstructions(realtimeConfig.instructions),
					tools: [REALTIME_VOICE_AGENT_CONSULT_TOOL, REALTIME_VOICE_AGENT_CONTROL_TOOL],
					model: launchOptions.model,
					sessionKey: normalizeOptionalString(params.sessionKey),
					voice: launchOptions.voice,
					forceAgentConsultOnFinalTranscript: realtimeConfig.consultRouting === "force-agent-consult"
				});
				rememberUnifiedTalkSession(session.relaySessionId, {
					kind: "realtime-relay",
					connId,
					relaySessionId: session.relaySessionId
				});
				respondOk(respond, {
					...session,
					sessionId: session.relaySessionId,
					mode,
					brain
				});
				return;
			}
			if (mode === "transcription") {
				if (transport !== "gateway-relay" || brain !== "none") {
					respondInvalidRequest(respond, `transcription talk.session.create requires transport="gateway-relay" and brain="none"`);
					return;
				}
				const runtimeConfig = context.getRuntimeConfig();
				const transcriptionConfig = buildTalkTranscriptionConfig(runtimeConfig, params.provider);
				const resolution = resolveConfiguredRealtimeTranscriptionProvider({
					config: runtimeConfig,
					configuredProviderId: transcriptionConfig.provider,
					providerConfigs: transcriptionConfig.providers,
					defaultModel: transcriptionConfig.model
				});
				const session = createTalkTranscriptionRelaySession({
					context,
					connId,
					provider: resolution.provider,
					providerConfig: resolution.providerConfig
				});
				rememberUnifiedTalkSession(session.transcriptionSessionId, {
					kind: "transcription-relay",
					connId,
					transcriptionSessionId: session.transcriptionSessionId
				});
				respondOk(respond, {
					...session,
					sessionId: session.transcriptionSessionId,
					brain
				});
				return;
			}
			respondInvalidRequest(respond, `stt-tts talk.session.create requires transport="managed-room"`);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.join": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateTalkSessionJoinParams, "talk.session.join", respond)) return;
		try {
			const session = getUnifiedTalkSession(params.sessionId);
			if (session.kind !== "managed-room") {
				respondInvalidRequest(respond, "talk.session.join requires a managed-room session");
				return;
			}
			const result = joinTalkHandoff(session.handoffId, params.token, { clientId: client?.connId });
			if (!result.ok) {
				respond(false, void 0, errorShape(result.reason === "invalid_token" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, `talk session join failed: ${result.reason}`));
				return;
			}
			broadcastTalkRoomEvents(context, result.replacedClientId, {
				handoffId: result.record.id,
				roomId: result.record.roomId,
				events: result.replacementEvents
			});
			broadcastTalkRoomEvents(context, client?.connId, {
				handoffId: result.record.id,
				roomId: result.record.roomId,
				events: result.activeClientEvents
			});
			respondOk(respond, result.record);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.appendAudio": async ({ params, respond, client }) => {
		if (!assertValidParams(params, validateTalkSessionAppendAudioParams, "talk.session.appendAudio", respond)) return;
		try {
			const session = getUnifiedTalkSession(params.sessionId);
			if (session.kind === "realtime-relay") {
				const connId = requireUnifiedTalkSessionConn(session, client?.connId);
				sendTalkRealtimeRelayAudio({
					relaySessionId: session.relaySessionId,
					connId,
					audioBase64: params.audioBase64,
					timestamp: params.timestamp
				});
				respondOk(respond);
				return;
			}
			if (session.kind === "transcription-relay") {
				const connId = requireUnifiedTalkSessionConn(session, client?.connId);
				sendTalkTranscriptionRelayAudio({
					transcriptionSessionId: session.transcriptionSessionId,
					connId,
					audioBase64: params.audioBase64
				});
				respondOk(respond);
				return;
			}
			respondInvalidRequest(respond, "talk.session.appendAudio is not supported for managed-room sessions");
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.startTurn": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateTalkSessionTurnParams, "talk.session.startTurn", respond)) return;
		try {
			respondManagedRoomTurn({
				session: getUnifiedTalkSession(params.sessionId),
				connId: client?.connId,
				context,
				respond,
				method: "talk.session.startTurn",
				ownershipAction: "startTurn",
				failureVerb: "start",
				run: (managedSession) => startTalkHandoffTurn(managedSession.handoffId, managedSession.token, {
					turnId: params.turnId,
					clientId: client?.connId
				})
			});
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.endTurn": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateTalkSessionTurnParams, "talk.session.endTurn", respond)) return;
		try {
			respondManagedRoomTurn({
				session: getUnifiedTalkSession(params.sessionId),
				connId: client?.connId,
				context,
				respond,
				method: "talk.session.endTurn",
				ownershipAction: "endTurn",
				failureVerb: "end",
				run: (managedSession) => endTalkHandoffTurn(managedSession.handoffId, managedSession.token, { turnId: params.turnId })
			});
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.cancelTurn": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateTalkSessionCancelTurnParams, "talk.session.cancelTurn", respond)) return;
		try {
			const session = getUnifiedTalkSession(params.sessionId);
			if (session.kind === "realtime-relay") {
				const connId = requireUnifiedTalkSessionConn(session, client?.connId);
				cancelTalkRealtimeRelayTurn({
					relaySessionId: session.relaySessionId,
					connId,
					reason: normalizeOptionalString(params.reason)
				});
				respondOk(respond);
				return;
			}
			if (session.kind === "transcription-relay") {
				const connId = requireUnifiedTalkSessionConn(session, client?.connId);
				cancelTalkTranscriptionRelayTurn({
					transcriptionSessionId: session.transcriptionSessionId,
					connId,
					reason: normalizeOptionalString(params.reason)
				});
				respondOk(respond);
				return;
			}
			respondManagedRoomTurn({
				session,
				connId: client?.connId,
				context,
				respond,
				method: "talk.session.cancelTurn",
				ownershipAction: "cancelTurn",
				failureVerb: "cancel",
				run: (managedSession) => cancelTalkHandoffTurn(managedSession.handoffId, managedSession.token, {
					turnId: params.turnId,
					reason: params.reason
				})
			});
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.cancelOutput": async ({ params, respond, client }) => {
		if (!assertValidParams(params, validateTalkSessionCancelOutputParams, "talk.session.cancelOutput", respond)) return;
		try {
			const session = getUnifiedTalkSession(params.sessionId);
			if (session.kind !== "realtime-relay") {
				respondInvalidRequest(respond, "talk.session.cancelOutput requires realtime relay");
				return;
			}
			const connId = requireUnifiedTalkSessionConn(session, client?.connId);
			cancelTalkRealtimeRelayTurn({
				relaySessionId: session.relaySessionId,
				connId,
				reason: normalizeOptionalString(params.reason) ?? "output-cancelled"
			});
			respondOk(respond);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.submitToolResult": async ({ params, respond, client }) => {
		if (!assertValidParams(params, validateTalkSessionSubmitToolResultParams, "talk.session.submitToolResult", respond)) return;
		try {
			const session = getUnifiedTalkSession(params.sessionId);
			if (session.kind !== "realtime-relay") {
				respondInvalidRequest(respond, "talk.session.submitToolResult is only supported for realtime relay sessions");
				return;
			}
			const connId = requireUnifiedTalkSessionConn(session, client?.connId);
			submitTalkRealtimeRelayToolResult({
				relaySessionId: session.relaySessionId,
				connId,
				callId: params.callId,
				result: params.result,
				options: params.options
			});
			respondOk(respond);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.steer": async ({ params, respond, client }) => {
		if (!assertValidParams(params, validateTalkSessionSteerParams, "talk.session.steer", respond)) return;
		try {
			const session = getUnifiedTalkSession(params.sessionId);
			if (session.kind === "realtime-relay") {
				const connId = requireUnifiedTalkSessionConn(session, client?.connId);
				respondOk(respond, await steerTalkRealtimeRelayAgentRun({
					relaySessionId: session.relaySessionId,
					connId,
					sessionKey: normalizeOptionalString(params.sessionKey),
					text: params.text,
					mode: normalizeOptionalString(params.mode)
				}));
				return;
			}
			if (session.kind === "transcription-relay") {
				respondInvalidRequest(respond, "talk.session.steer requires an agent-backed Talk session");
				return;
			}
			if (!isActiveManagedRoomClient(session, client?.connId)) {
				respond(false, void 0, managedRoomOwnershipError("steer"));
				return;
			}
			const handoff = getTalkHandoff(session.handoffId);
			const sessionKey = handoff?.sessionKey;
			if (!sessionKey) {
				respondInvalidRequest(respond, "talk.session.steer requires a session key");
				return;
			}
			const requestedSessionKey = normalizeOptionalString(params.sessionKey);
			if (requestedSessionKey && requestedSessionKey !== sessionKey) {
				respondInvalidRequest(respond, "talk.session.steer sessionKey does not match the managed-room session");
				return;
			}
			respondOk(respond, await controlRealtimeVoiceAgentRun({
				sessionKey,
				text: params.text,
				mode: params.mode,
				recentEvents: handoff?.room.talk.recentEvents
			}));
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"talk.session.close": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateTalkSessionCloseParams, "talk.session.close", respond)) return;
		try {
			const session = getUnifiedTalkSession(params.sessionId);
			if (session.kind === "realtime-relay") {
				const connId = requireUnifiedTalkSessionConn(session, client?.connId);
				stopTalkRealtimeRelaySession({
					relaySessionId: session.relaySessionId,
					connId
				});
			} else if (session.kind === "transcription-relay") {
				const connId = requireUnifiedTalkSessionConn(session, client?.connId);
				stopTalkTranscriptionRelaySession({
					transcriptionSessionId: session.transcriptionSessionId,
					connId
				});
			} else {
				if (!canCloseManagedRoomSession(session, client?.connId)) {
					respond(false, void 0, managedRoomOwnershipError("close"));
					return;
				}
				const result = revokeTalkHandoff(session.handoffId);
				broadcastTalkRoomEvents(context, result.activeClientId, {
					handoffId: session.handoffId,
					roomId: session.roomId,
					events: result.events
				});
			}
			forgetUnifiedTalkSession(params.sessionId);
			respondOk(respond);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	}
};
//#endregion
//#region src/gateway/server-methods/talk.ts
function canReadTalkSecrets(client) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	return scopes.includes("operator.admin") || scopes.includes("operator.talk.secrets");
}
function asStringRecord(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const next = {};
	for (const [key, entryValue] of Object.entries(record)) if (typeof entryValue === "string") next[key] = entryValue;
	return Object.keys(next).length > 0 ? next : void 0;
}
function normalizeAliasKey(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function resolveTalkVoiceId(providerConfig, requested) {
	if (!requested) return;
	const aliases = asStringRecord(providerConfig.voiceAliases);
	if (!aliases) return requested;
	const normalizedRequested = normalizeAliasKey(requested);
	for (const [alias, voiceId] of Object.entries(aliases)) if (normalizeAliasKey(alias) === normalizedRequested) return voiceId;
	return requested;
}
function withTalkBaseTtsSpeakerSelectionCompat(baseTts) {
	const next = withSpeakerSelectionCompat(baseTts);
	const providers = asOptionalRecord(baseTts.providers);
	if (providers) next.providers = Object.fromEntries(Object.entries(providers).map(([providerId, providerConfig]) => [providerId, withSpeakerSelectionCompat(asOptionalRecord(providerConfig) ?? {})]));
	for (const [key, value] of Object.entries(baseTts)) {
		if (key === "providers") continue;
		const record = asOptionalRecord(value);
		if (record) next[key] = withSpeakerSelectionCompat(record);
	}
	return next;
}
function buildTalkTtsConfig(config) {
	const resolved = resolveActiveTalkProviderConfig(config.talk);
	const provider = canonicalizeSpeechProviderId(resolved?.provider, config);
	if (!resolved || !provider) return {
		error: "talk.speak unavailable: talk provider not configured",
		reason: "talk_unconfigured"
	};
	const speechProvider = getSpeechProvider(provider, config);
	if (!speechProvider) return {
		error: `talk.speak unavailable: speech provider "${provider}" does not support Talk mode`,
		reason: "talk_provider_unsupported"
	};
	const baseTts = withTalkBaseTtsSpeakerSelectionCompat(asOptionalRecord(config.messages?.tts) ?? {});
	const providerConfig = withSpeakerSelectionFallbackCompat(resolved.config);
	const resolvedProviderConfig = speechProvider.resolveTalkConfig?.({
		cfg: config,
		baseTtsConfig: baseTts,
		talkProviderConfig: providerConfig,
		timeoutMs: baseTts.timeoutMs ?? 3e4
	}) ?? providerConfig;
	const talkTts = {
		...baseTts,
		auto: "always",
		provider,
		providers: {
			...asOptionalRecord(baseTts.providers) ?? {},
			[provider]: resolvedProviderConfig
		}
	};
	return {
		provider,
		providerConfig,
		cfg: {
			...config,
			messages: {
				...config.messages,
				tts: talkTts
			}
		}
	};
}
function buildTalkCatalog(config) {
	const ttsConfig = resolveTtsConfig(config);
	const activeSpeechProvider = canonicalizeSpeechProviderId(resolveActiveTalkProviderConfig(config.talk)?.provider, config);
	const streamingConfig = getVoiceCallStreamingConfig(config);
	const realtimeConfig = buildTalkRealtimeConfig(config);
	const activeRealtimeProvider = canonicalizeRealtimeVoiceProviderId(realtimeConfig.provider, config);
	return {
		modes: [
			"realtime",
			"stt-tts",
			"transcription"
		],
		transports: [
			"webrtc",
			"provider-websocket",
			"gateway-relay",
			"managed-room"
		],
		brains: [
			"agent-consult",
			"direct-tools",
			"none"
		],
		speech: {
			...activeSpeechProvider ? { activeProvider: activeSpeechProvider } : {},
			providers: listSpeechProviders(config).map((provider) => {
				const entry = {
					id: provider.id,
					label: provider.label,
					configured: configuredOrFalse(() => provider.isConfigured({
						cfg: config,
						providerConfig: getResolvedSpeechProviderConfig(ttsConfig, provider.id, config),
						timeoutMs: ttsConfig.timeoutMs
					})),
					modes: ["stt-tts"],
					brains: ["agent-consult"]
				};
				if (provider.models) entry.models = [...provider.models];
				if (provider.voices) entry.voices = [...provider.voices];
				return entry;
			})
		},
		transcription: {
			...streamingConfig.provider ? { activeProvider: streamingConfig.provider } : {},
			providers: listRealtimeTranscriptionProviders(config).map((provider) => {
				const rawConfig = streamingConfig.providers?.[provider.id] ?? {};
				const providerConfig = provider.resolveConfig?.({
					cfg: config,
					rawConfig
				}) ?? rawConfig;
				const entry = {
					id: provider.id,
					label: provider.label,
					configured: configuredOrFalse(() => provider.isConfigured({
						cfg: config,
						providerConfig
					})),
					modes: ["transcription"],
					transports: ["gateway-relay"],
					brains: ["none"]
				};
				if (provider.defaultModel) entry.defaultModel = provider.defaultModel;
				return entry;
			})
		},
		realtime: {
			...activeRealtimeProvider ? { activeProvider: activeRealtimeProvider } : {},
			providers: listRealtimeVoiceProviders(config).map((provider) => {
				const rawConfig = realtimeConfig.providers?.[provider.id] ?? {};
				const providerConfig = provider.resolveConfig?.({
					cfg: config,
					rawConfig
				}) ?? rawConfig;
				const capabilities = provider.capabilities;
				const entry = {
					id: provider.id,
					label: provider.label,
					configured: configuredOrFalse(() => provider.isConfigured({
						cfg: config,
						providerConfig
					})),
					modes: ["realtime"],
					brains: capabilities?.supportsToolCalls === false ? ["none"] : ["agent-consult"],
					supportsBrowserSession: Boolean(capabilities?.supportsBrowserSession ?? provider.createBrowserSession)
				};
				if (provider.defaultModel) entry.defaultModel = provider.defaultModel;
				if (capabilities?.transports) entry.transports = [...capabilities.transports];
				if (capabilities?.inputAudioFormats) entry.inputAudioFormats = capabilities.inputAudioFormats.map((format) => ({ ...format }));
				if (capabilities?.outputAudioFormats) entry.outputAudioFormats = capabilities.outputAudioFormats.map((format) => ({ ...format }));
				if (capabilities?.supportsBargeIn !== void 0) entry.supportsBargeIn = capabilities.supportsBargeIn;
				if (capabilities?.supportsToolCalls !== void 0) entry.supportsToolCalls = capabilities.supportsToolCalls;
				if (capabilities?.supportsVideoFrames !== void 0) entry.supportsVideoFrames = capabilities.supportsVideoFrames;
				if (capabilities?.supportsSessionResumption !== void 0) entry.supportsSessionResumption = capabilities.supportsSessionResumption;
				return entry;
			})
		}
	};
}
function isFallbackEligibleTalkReason(reason) {
	return reason === "talk_unconfigured" || reason === "talk_provider_unsupported" || reason === "method_unavailable";
}
function talkSpeakError(reason, message) {
	const details = {
		reason,
		fallbackEligible: isFallbackEligibleTalkReason(reason)
	};
	return errorShape(ErrorCodes.UNAVAILABLE, message, { details });
}
function resolveTalkSpeed(params) {
	if (typeof params.speed === "number") return params.speed;
	if (typeof params.rateWpm !== "number" || params.rateWpm <= 0) return;
	const resolved = params.rateWpm / 175;
	if (resolved <= .5 || resolved >= 2) return;
	return resolved;
}
function buildTalkSpeakOverrides(provider, providerConfig, config, params) {
	const speechProvider = getSpeechProvider(provider, config);
	if (!speechProvider?.resolveTalkOverrides) return { provider };
	const resolvedSpeed = resolveTalkSpeed(params);
	const resolvedVoiceId = resolveTalkVoiceId(providerConfig, normalizeOptionalString(params.voiceId));
	const providerOverrides = speechProvider.resolveTalkOverrides({
		talkProviderConfig: providerConfig,
		params: {
			...params,
			...resolvedVoiceId == null ? {} : { voiceId: resolvedVoiceId },
			...resolvedSpeed == null ? {} : { speed: resolvedSpeed }
		}
	});
	if (!providerOverrides || Object.keys(providerOverrides).length === 0) return { provider };
	return {
		provider,
		providerOverrides: { [provider]: providerOverrides }
	};
}
function inferMimeType(outputFormat, fileExtension) {
	const normalizedOutput = normalizeOptionalLowercaseString(outputFormat);
	const normalizedExtension = normalizeOptionalLowercaseString(fileExtension);
	if (normalizedOutput === "mp3" || normalizedOutput?.startsWith("mp3_") || normalizedOutput?.endsWith("-mp3") || normalizedExtension === ".mp3") return "audio/mpeg";
	if (normalizedOutput === "opus" || normalizedOutput?.startsWith("opus_") || normalizedExtension === ".opus" || normalizedExtension === ".ogg") return "audio/ogg";
	if (normalizedOutput?.endsWith("-wav") || normalizedExtension === ".wav") return "audio/wav";
	if (normalizedOutput?.endsWith("-webm") || normalizedExtension === ".webm") return "audio/webm";
}
function resolveTalkResponseFromConfig(params) {
	const normalizedTalk = normalizeTalkSection(params.sourceConfig.talk);
	if (!normalizedTalk) return;
	const payload = buildTalkConfigResponse(normalizedTalk);
	if (!payload) return;
	if (params.includeSecrets) return payload;
	const sourceResolved = resolveActiveTalkProviderConfig(normalizedTalk);
	const runtimeResolved = resolveActiveTalkProviderConfig(params.runtimeConfig.talk);
	const provider = canonicalizeSpeechProviderId(sourceResolved?.provider ?? runtimeResolved?.provider, params.runtimeConfig);
	if (!provider) return payload;
	const speechProvider = getSpeechProvider(provider, params.runtimeConfig);
	const sourceBaseTts = withTalkBaseTtsSpeakerSelectionCompat(asOptionalRecord(params.sourceConfig.messages?.tts) ?? {});
	const runtimeBaseTts = withTalkBaseTtsSpeakerSelectionCompat(asOptionalRecord(params.runtimeConfig.messages?.tts) ?? {});
	const sourceProviderConfig = withSpeakerSelectionFallbackCompat(sourceResolved?.config);
	const runtimeProviderConfig = withSpeakerSelectionFallbackCompat(runtimeResolved?.config);
	const selectedBaseTts = Object.keys(runtimeBaseTts).length > 0 ? runtimeBaseTts : stripUnresolvedSecretApiKeysFromBaseTtsProviders(sourceBaseTts);
	const providerInputConfig = stripUnresolvedSecretApiKey(Object.keys(runtimeProviderConfig).length > 0 ? runtimeProviderConfig : sourceProviderConfig);
	const resolvedConfig = speechProvider?.resolveTalkConfig?.({
		cfg: params.runtimeConfig,
		baseTtsConfig: selectedBaseTts,
		talkProviderConfig: providerInputConfig,
		timeoutMs: typeof selectedBaseTts.timeoutMs === "number" ? selectedBaseTts.timeoutMs : 3e4
	}) ?? providerInputConfig;
	const responseConfig = sourceProviderConfig.apiKey === void 0 ? resolvedConfig : {
		...resolvedConfig,
		apiKey: sourceProviderConfig.apiKey
	};
	return {
		...payload,
		provider,
		resolved: {
			provider,
			config: responseConfig
		}
	};
}
function stripUnresolvedSecretApiKey(config) {
	return stripUnresolvedSecretApiKeyFromRecord(config);
}
function stripUnresolvedSecretApiKeysFromBaseTtsProviders(base) {
	const providers = asOptionalRecord(base.providers);
	if (!providers) return base;
	let mutated = false;
	const cleaned = Object.create(null);
	for (const [providerId, providerConfig] of Object.entries(providers)) {
		const cfg = asOptionalRecord(providerConfig);
		if (!cfg) {
			cleaned[providerId] = providerConfig;
			continue;
		}
		const next = stripUnresolvedSecretApiKeyFromRecord(cfg);
		if (next !== cfg) mutated = true;
		cleaned[providerId] = next;
	}
	if (!mutated) return base;
	return {
		...base,
		providers: cleaned
	};
}
function stripUnresolvedSecretApiKeyFromRecord(config) {
	if (config.apiKey === void 0 || typeof config.apiKey === "string") return config;
	const { apiKey: _omit, ...rest } = config;
	return rest;
}
/** Gateway request handlers for Talk config, catalog, mode, sessions, and speech. */
const talkHandlers = {
	...talkSessionHandlers,
	...talkClientHandlers,
	"talk.catalog": async ({ params, respond, context }) => {
		if (!validateTalkCatalogParams(params ?? {})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.catalog params: ${formatValidationErrors(validateTalkCatalogParams.errors)}`));
			return;
		}
		try {
			respond(true, buildTalkCatalog(context.getRuntimeConfig()), void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"talk.config": async ({ params, respond, client, context }) => {
		if (!validateTalkConfigParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.config params: ${formatValidationErrors(validateTalkConfigParams.errors)}`));
			return;
		}
		const includeSecrets = Boolean(params.includeSecrets);
		if (includeSecrets && !canReadTalkSecrets(client)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `missing scope: ${TALK_SECRETS_SCOPE}`));
			return;
		}
		const snapshot = await readConfigFileSnapshot();
		const runtimeConfig = context.getRuntimeConfig();
		const configPayload = {};
		const talk = resolveTalkResponseFromConfig({
			includeSecrets,
			sourceConfig: snapshot.config,
			runtimeConfig
		});
		if (talk) configPayload.talk = includeSecrets ? talk : redactConfigObject(talk);
		const sessionMainKey = snapshot.config.session?.mainKey;
		if (typeof sessionMainKey === "string") configPayload.session = { mainKey: sessionMainKey };
		const seamColor = snapshot.config.ui?.seamColor;
		if (typeof seamColor === "string") configPayload.ui = { seamColor };
		respond(true, { config: configPayload }, void 0);
	},
	"talk.speak": async ({ params, respond, context }) => {
		if (!validateTalkSpeakParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.speak params: ${formatValidationErrors(validateTalkSpeakParams.errors)}`));
			return;
		}
		const typedParams = params;
		const text = normalizeOptionalString(typedParams.text);
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "talk.speak requires text"));
			return;
		}
		if (typedParams.speed == null && typedParams.rateWpm != null && resolveTalkSpeed(typedParams) == null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.speak params: rateWpm must resolve to speed between 0.5 and 2.0`));
			return;
		}
		try {
			const runtimeConfig = context.getRuntimeConfig();
			const setup = buildTalkTtsConfig(runtimeConfig);
			if ("error" in setup) {
				respond(false, void 0, talkSpeakError(setup.reason, setup.error));
				return;
			}
			const overrides = buildTalkSpeakOverrides(setup.provider, setup.providerConfig, runtimeConfig, typedParams);
			const result = await synthesizeSpeech({
				text,
				cfg: setup.cfg,
				overrides,
				disableFallback: true
			});
			if (!result.success || !result.audioBuffer) {
				respond(false, void 0, talkSpeakError("synthesis_failed", result.error ?? "talk synthesis failed"));
				return;
			}
			if ((result.provider ?? setup.provider).trim().length === 0) {
				respond(false, void 0, talkSpeakError("invalid_audio_result", "talk synthesis returned empty provider"));
				return;
			}
			if (result.audioBuffer.length === 0) {
				respond(false, void 0, talkSpeakError("invalid_audio_result", "talk synthesis returned empty audio"));
				return;
			}
			respond(true, {
				audioBase64: result.audioBuffer.toString("base64"),
				provider: result.provider ?? setup.provider,
				outputFormat: result.outputFormat,
				voiceCompatible: result.voiceCompatible,
				mimeType: inferMimeType(result.outputFormat, result.fileExtension),
				fileExtension: result.fileExtension
			}, void 0);
		} catch (err) {
			respond(false, void 0, talkSpeakError("synthesis_failed", formatForLog(err)));
		}
	},
	"talk.mode": ({ params, respond, context, client, isWebchatConnect }) => {
		if (client && isWebchatConnect(client.connect) && !context.hasConnectedTalkNode()) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "talk disabled: no connected Talk-capable nodes"));
			return;
		}
		if (!validateTalkModeParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid talk.mode params: ${formatValidationErrors(validateTalkModeParams.errors)}`));
			return;
		}
		const payload = {
			enabled: params.enabled,
			phase: params.phase ?? null,
			ts: Date.now()
		};
		context.broadcast("talk.mode", payload, { dropIfSlow: true });
		respond(true, payload, void 0);
	}
};
//#endregion
export { talkHandlers };
