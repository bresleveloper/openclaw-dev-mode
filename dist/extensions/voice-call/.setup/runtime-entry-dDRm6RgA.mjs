import { isBlockedHostnameOrIp, isRequestBodyLimitError, readRequestBodyWithLimit, requestBodyErrorToText, sendHttpRequestRejection } from "../runtime-api.js";
import "../api.js";
import { a as resolveVoiceCallEffectiveConfig, c as resolveVoiceCallSessionKey, f as resolveVoiceCallRealtimeTools, i as resolveVoiceCallConfig, l as resolveVoiceCallStreamExposurePaths, n as normalizeVoiceCallConfig, o as resolveVoiceCallNumberRouteKeyForCall, r as resolveTwilioAuthToken, u as validateProviderConfig } from "./config-72FnMWHb.mjs";
import { _ as releaseRejectedProviderCall, b as setVoiceCallStateRuntime, d as getCallHistoryFromStore, f as loadActiveCallsFromStore, g as appendCallReplayKey, m as persistCallRecord, t as resolveDefaultVoiceCallStoreDir, u as findCallInStore, v as rememberManagerReplayKey, x as TerminalStates, y as reserveRejectedProviderCall } from "./store-path-B1j1up4_.mjs";
import { createRequire } from "node:module";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { isLoopbackHost } from "openclaw/plugin-sdk/gateway-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { listAgentIds, resolveDefaultAgentId } from "openclaw/plugin-sdk/agent-scope-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, assertRealtimeVoiceAgentConsultModelSelectionUnlocked, buildRealtimeVoiceAgentConsultPolicyInstructions, consultRealtimeVoiceAgent, convertPcmToMulaw8k, createTalkSessionController, recordTalkObservabilityEvent, resolveRealtimeVoiceAgentConsultToolsAllow, resolveRealtimeVoiceFastContextConsult } from "openclaw/plugin-sdk/realtime-voice";
import { WEBHOOK_BODY_READ_DEFAULTS, createWebhookInFlightLimiter, normalizeWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
import { MAX_TIMER_TIMEOUT_MS, asDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import fs from "node:fs";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import crypto from "node:crypto";
import { redactIdentifier } from "openclaw/plugin-sdk/logging-core";
import path from "node:path";
import os from "node:os";
import { root } from "openclaw/plugin-sdk/security-runtime";
import { sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { spawn } from "node:child_process";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import http from "node:http";
import { URL as URL$1 } from "node:url";
import { resolveConfiguredCapabilityProvider } from "openclaw/plugin-sdk/provider-selection-runtime";
import { rejectWebSocketUpgrade } from "openclaw/plugin-sdk/websocket-runtime";
import { canonicalizeBase64 } from "openclaw/plugin-sdk/media-runtime";
//#region extensions/voice-call/src/allowlist.ts
/** Normalize a phone number to digits only. */
function normalizePhoneNumber(input) {
	if (!input) return "";
	return input.replace(/\D/g, "");
}
/** Return true when the normalized caller exactly matches an allowlist entry. */
function isAllowlistedCaller(normalizedFrom, allowFrom) {
	if (!normalizedFrom) return false;
	return (allowFrom ?? []).some((num) => {
		const normalizedAllow = normalizePhoneNumber(num);
		return normalizedAllow !== "" && normalizedAllow === normalizedFrom;
	});
}
//#endregion
//#region extensions/voice-call/src/manager/state.ts
const ConversationStates = /* @__PURE__ */ new Set(["speaking", "listening"]);
const StateOrder = [
	"initiated",
	"ringing",
	"answered",
	"active",
	"speaking",
	"listening"
];
function transitionState(call, newState) {
	if (call.state === newState || TerminalStates.has(call.state)) return;
	if (TerminalStates.has(newState)) {
		call.state = newState;
		return;
	}
	if (ConversationStates.has(call.state) && ConversationStates.has(newState)) {
		call.state = newState;
		return;
	}
	const currentIndex = StateOrder.indexOf(call.state);
	if (StateOrder.indexOf(newState) > currentIndex) call.state = newState;
}
function addTranscriptEntry(call, speaker, text) {
	const entry = {
		timestamp: Date.now(),
		speaker,
		text,
		isFinal: true
	};
	call.transcript.push(entry);
}
/** Stage persisted changes without exposing uncommitted state through active-call getters. */
function copyCallRecord(call) {
	return {
		...call,
		transcript: [...call.transcript],
		processedEventIds: [...call.processedEventIds],
		...call.metadata ? { metadata: { ...call.metadata } } : {}
	};
}
//#endregion
//#region extensions/voice-call/src/manager/timer-delays.ts
/** Convert seconds to a safe timeout delay in milliseconds. */
function resolveVoiceCallSecondsTimerDelayMs(seconds, minMs = 1) {
	if (!Number.isFinite(seconds)) return resolveTimerTimeoutMs(MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_MS, minMs);
	const timeoutMs = Math.floor(seconds * 1e3);
	return resolveTimerTimeoutMs(Number.isFinite(timeoutMs) ? timeoutMs : MAX_TIMER_TIMEOUT_MS, minMs, minMs);
}
/** Normalize a millisecond timeout delay with fallback behavior. */
function resolveVoiceCallTimerDelayMs(timeoutMs, fallbackMs = 1) {
	return resolveTimerTimeoutMs(timeoutMs, fallbackMs);
}
//#endregion
//#region extensions/voice-call/src/manager/timers.ts
/** Clear and forget the max-duration timer for a call. */
function clearMaxDurationTimer(ctx, callId) {
	const timer = ctx.maxDurationTimers.get(callId);
	if (timer) {
		clearTimeout(timer);
		ctx.maxDurationTimers.delete(callId);
	}
}
/** Start or replace the max-duration timer for a call. */
function startMaxDurationTimer(params) {
	clearMaxDurationTimer(params.ctx, params.callId);
	const maxDurationMs = params.timeoutMs === void 0 ? resolveVoiceCallSecondsTimerDelayMs(params.ctx.config.maxDurationSeconds) : resolveVoiceCallTimerDelayMs(params.timeoutMs);
	console.log(`[voice-call] Starting max duration timer (${Math.ceil(maxDurationMs / 1e3)}s) for call ${params.callId}`);
	const timer = setTimeout(() => {
		const work = (async () => {
			params.ctx.maxDurationTimers.delete(params.callId);
			const call = params.ctx.activeCalls.get(params.callId);
			if (!params.ctx.isStopping() && call && !TerminalStates.has(call.state)) {
				console.log(`[voice-call] Max duration reached (${Math.ceil(maxDurationMs / 1e3)}s), ending call ${params.callId}`);
				try {
					const result = await params.onTimeout(params.callId);
					if (!result.success) console.warn(`[voice-call] Failed to end max-duration call ${params.callId}: ${result.error ?? "unknown error"}`);
				} catch (error) {
					console.warn(`[voice-call] Failed to end max-duration call ${params.callId}: ${formatErrorMessage(error)}`);
				}
			}
		})();
		params.ctx.trackCallWork(work);
	}, maxDurationMs);
	params.ctx.maxDurationTimers.set(params.callId, timer);
}
/** Clear and forget a pending final-transcript waiter. */
function clearTranscriptWaiter(ctx, callId) {
	const waiter = ctx.transcriptWaiters.get(callId);
	if (!waiter) return;
	clearTimeout(waiter.timeout);
	ctx.transcriptWaiters.delete(callId);
}
/** Reject a pending transcript waiter during call finalization or error paths. */
function rejectTranscriptWaiter(ctx, callId, reason) {
	const waiter = ctx.transcriptWaiters.get(callId);
	if (!waiter) return;
	clearTranscriptWaiter(ctx, callId);
	waiter.reject(new Error(reason));
}
/** Resolve a transcript waiter when the matching turn's final transcript arrives. */
function resolveTranscriptWaiter(ctx, callId, transcript, turnToken) {
	const waiter = ctx.transcriptWaiters.get(callId);
	if (!waiter) return false;
	if (waiter.turnToken && waiter.turnToken !== turnToken) return false;
	clearTranscriptWaiter(ctx, callId);
	waiter.resolve(transcript);
	return true;
}
/** Wait for the next final transcript for a call, optionally scoped to a turn token. */
function waitForFinalTranscript(ctx, callId, turnToken) {
	if (ctx.transcriptWaiters.has(callId)) return Promise.reject(/* @__PURE__ */ new Error("Already waiting for transcript"));
	const timeoutMs = resolveVoiceCallTimerDelayMs(ctx.config.transcriptTimeoutMs);
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			ctx.transcriptWaiters.delete(callId);
			reject(/* @__PURE__ */ new Error(`Timed out waiting for transcript after ${timeoutMs}ms`));
		}, timeoutMs);
		ctx.transcriptWaiters.set(callId, {
			resolve,
			reject,
			timeout,
			turnToken
		});
	});
}
//#endregion
//#region extensions/voice-call/src/manager/lifecycle.ts
const log$1 = createSubsystemLogger("voice-call/lifecycle");
/** Remove a provider-call mapping only when it still points at this call. */
function removeProviderCallMapping(providerCallIdMap, call) {
	if (!call.providerCallId) return;
	if (providerCallIdMap.get(call.providerCallId) === call.callId) providerCallIdMap.delete(call.providerCallId);
}
/** Finalize under the manager mutation queue, publishing cleanup only after persistence. */
async function finalizeCall(params) {
	const { ctx, call, endReason } = params;
	if (ctx.activeCalls.get(call.callId) !== call) return;
	const previousState = call.state;
	if (!TerminalStates.has(previousState)) {
		const next = copyCallRecord(params.preparedCall ?? call);
		next.endedAt = params.endedAt ?? Date.now();
		next.endReason = endReason;
		transitionState(next, endReason);
		await persistCallRecord(ctx.storePath, next, ctx.stateRuntime);
		Object.assign(call, next);
		log$1.info(`[voice-call] Call finalized callId=${call.callId} providerCallId=${call.providerCallId ?? "unknown"} endReason=${endReason}`);
	}
	if (ctx.maxDurationTimers) clearMaxDurationTimer({ maxDurationTimers: ctx.maxDurationTimers }, call.callId);
	const notifyTimer = ctx.notifyHangupTimers?.get(call.callId);
	if (notifyTimer) {
		clearTimeout(notifyTimer);
		ctx.notifyHangupTimers?.delete(call.callId);
	}
	if (ctx.transcriptWaiters) rejectTranscriptWaiter({ transcriptWaiters: ctx.transcriptWaiters }, call.callId, params.transcriptRejectReason ?? `Call ended: ${endReason}`);
	ctx.activeCalls.delete(call.callId);
	removeProviderCallMapping(ctx.providerCallIdMap, call);
}
//#endregion
//#region extensions/voice-call/src/manager/lookup.ts
/** Resolve an active call from provider call id with map lookup plus stale-map fallback scan. */
function getCallByProviderCallId(params) {
	const callId = params.providerCallIdMap.get(params.providerCallId);
	if (callId) return params.activeCalls.get(callId);
	for (const call of params.activeCalls.values()) if (call.providerCallId === params.providerCallId) return call;
}
/** Resolve an active call by internal call id or provider call id. */
function findCall(params) {
	const directCall = params.activeCalls.get(params.callIdOrProviderCallId);
	if (directCall) return directCall;
	return getCallByProviderCallId({
		activeCalls: params.activeCalls,
		providerCallIdMap: params.providerCallIdMap,
		providerCallId: params.callIdOrProviderCallId
	});
}
//#endregion
//#region extensions/voice-call/src/tts-provider-voice.ts
/** Read voice setting aliases from one provider-specific config block. */
function resolveProviderVoiceSetting(providerConfig) {
	if (!providerConfig || typeof providerConfig !== "object") return;
	const candidate = providerConfig;
	return normalizeOptionalString(candidate.speakerVoice) ?? normalizeOptionalString(candidate.speakerVoiceId) ?? normalizeOptionalString(candidate.voice) ?? normalizeOptionalString(candidate.voiceId);
}
/** Resolve the active provider's preferred voice id/name from voice-call TTS config. */
function resolvePreferredTtsVoice(config) {
	const providerId = config.tts?.provider;
	if (!providerId) return;
	return resolveProviderVoiceSetting(config.tts?.providers?.[providerId]);
}
//#endregion
//#region extensions/voice-call/src/voice-mapping.ts
/**
* Escape XML special characters for TwiML and other XML responses.
*/
function escapeXml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
/**
* Map of OpenAI voice names to similar Twilio Polly voices.
*/
const OPENAI_TO_POLLY_MAP = /* @__PURE__ */ new Map([
	["alloy", "Polly.Joanna"],
	["echo", "Polly.Matthew"],
	["fable", "Polly.Amy"],
	["onyx", "Polly.Brian"],
	["nova", "Polly.Salli"],
	["shimmer", "Polly.Kimberly"]
]);
/**
* Default Polly voice when no mapping is found.
*/
const DEFAULT_POLLY_VOICE = "Polly.Joanna";
/**
* Map OpenAI voice names to Twilio Polly equivalents.
* Falls through if already a valid Polly/Google voice.
*
* @param voice - OpenAI voice name (alloy, echo, etc.) or Polly voice name
* @returns Polly voice name suitable for Twilio TwiML
*/
function mapVoiceToPolly(voice) {
	if (!voice) return DEFAULT_POLLY_VOICE;
	if (voice.startsWith("Polly.") || voice.startsWith("Google.")) return voice;
	return OPENAI_TO_POLLY_MAP.get(normalizeLowercaseStringOrEmpty(voice)) ?? DEFAULT_POLLY_VOICE;
}
//#endregion
//#region extensions/voice-call/src/manager/mutations.ts
/** Commit one live call update while preserving the call identity held by its callbacks. */
function updateCall(ctx, call, update, isCurrent) {
	return ctx.mutationQueue.enqueue("state", async () => {
		if (ctx.activeCalls.get(call.callId) !== call || TerminalStates.has(call.state) || isCurrent && !isCurrent()) return false;
		const next = copyCallRecord(call);
		update(next);
		await persistCallRecord(ctx.storePath, next, ctx.stateRuntime);
		Object.assign(call, next);
		return true;
	});
}
//#endregion
//#region extensions/voice-call/src/manager/twiml.ts
/** Generate TwiML that speaks one notification and hangs up. */
function generateNotifyTwiml(message, voice) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voice}">${escapeXml(message)}</Say>
  <Hangup/>
</Response>`;
}
/** Generate TwiML that plays DTMF digits before redirecting to a webhook URL. */
function generateDtmfRedirectTwiml(digits, webhookUrl) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play digits="${escapeXml(digits)}" />
  <Redirect method="POST">${escapeXml(webhookUrl)}</Redirect>
</Response>`;
}
//#endregion
//#region extensions/voice-call/src/manager/outbound.ts
function lookupConnectedCall(ctx, callId) {
	const call = ctx.activeCalls.get(callId);
	if (!call) return {
		kind: "error",
		error: "Call not found"
	};
	if (!ctx.provider || !call.providerCallId) return {
		kind: "error",
		error: "Call not connected"
	};
	if (TerminalStates.has(call.state)) return {
		kind: "ended",
		call
	};
	return {
		kind: "ok",
		call,
		providerCallId: call.providerCallId,
		provider: ctx.provider
	};
}
function requireConnectedCall(ctx, callId) {
	const lookup = lookupConnectedCall(ctx, callId);
	if (lookup.kind === "error") return {
		ok: false,
		error: lookup.error
	};
	if (lookup.kind === "ended") return {
		ok: false,
		error: "Call has ended"
	};
	return {
		ok: true,
		call: lookup.call,
		providerCallId: lookup.providerCallId,
		provider: lookup.provider
	};
}
function isCurrentCall(ctx, call) {
	return ctx.activeCalls.get(call.callId) === call && !TerminalStates.has(call.state);
}
function validateDtmfDigits(digits) {
	return /^[0-9*#wWpP,]+$/.test(digits) ? null : "digits may only contain digits, *, #, comma, w, p";
}
async function initiateCall(ctx, to, sessionKey, options) {
	const opts = typeof options === "string" ? { message: options } : options ?? {};
	const initialMessage = opts.message;
	const mode = opts.mode ?? ctx.config.outbound.defaultMode;
	const dtmfSequence = opts.dtmfSequence;
	const requesterSessionKey = opts.requesterSessionKey?.trim();
	const agentId = normalizeAgentId(opts.agentId ?? ctx.config.agentId);
	if (dtmfSequence) {
		const validationError = validateDtmfDigits(dtmfSequence);
		if (validationError) return {
			callId: "",
			success: false,
			error: validationError
		};
		if (mode !== "conversation") return {
			callId: "",
			success: false,
			error: "dtmfSequence requires conversation mode"
		};
	}
	if (!ctx.provider) return {
		callId: "",
		success: false,
		error: "Provider not initialized"
	};
	if (!ctx.webhookUrl) return {
		callId: "",
		success: false,
		error: "Webhook URL not configured"
	};
	if (ctx.activeCalls.size + ctx.pendingCallAdmissions.size >= ctx.config.maxConcurrentCalls) return {
		callId: "",
		success: false,
		error: `Maximum concurrent calls (${ctx.config.maxConcurrentCalls}) reached`
	};
	const callId = crypto.randomUUID();
	const from = ctx.config.fromNumber || (ctx.provider?.name === "mock" ? "+15550000000" : void 0);
	if (!from) return {
		callId: "",
		success: false,
		error: "fromNumber not configured"
	};
	const callRecord = {
		callId,
		provider: ctx.provider.name,
		direction: "outbound",
		state: "initiated",
		from,
		to,
		sessionKey: resolveVoiceCallSessionKey({
			config: {
				...ctx.config,
				agentId
			},
			callId,
			phone: to,
			explicitSessionKey: sessionKey,
			coreSession: ctx.coreSession
		}),
		agentId,
		startedAt: Date.now(),
		transcript: [],
		processedEventIds: [],
		metadata: {
			...initialMessage && { initialMessage },
			mode,
			...requesterSessionKey ? { requesterSessionKey } : {}
		}
	};
	ctx.pendingCallAdmissions.add(callId);
	try {
		await ctx.mutationQueue.enqueue("state", async () => {
			await persistCallRecord(ctx.storePath, callRecord, ctx.stateRuntime);
			ctx.activeCalls.set(callId, callRecord);
			ctx.pendingCallAdmissions.delete(callId);
		});
	} finally {
		ctx.pendingCallAdmissions.delete(callId);
	}
	try {
		if (ctx.isStopping()) throw new Error("Voice Call manager is stopping");
		let inlineTwiml;
		let preConnectTwiml;
		if (mode === "notify" && initialMessage) {
			const pollyVoice = mapVoiceToPolly(resolvePreferredTtsVoice(ctx.config));
			inlineTwiml = generateNotifyTwiml(initialMessage, pollyVoice);
			console.log(`[voice-call] Using inline TwiML for notify mode (voice: ${pollyVoice})`);
		} else if (dtmfSequence) {
			preConnectTwiml = generateDtmfRedirectTwiml(dtmfSequence, ctx.webhookUrl);
			console.log(`[voice-call] Using pre-connect DTMF TwiML for call ${callId} (digits=${dtmfSequence.length}, initialMessage=${initialMessage ? "yes" : "no"})`);
		}
		const streamSession = ctx.config.realtime?.enabled && ctx.provider.name === "telnyx" && ctx.streamSessionIssuer ? ctx.streamSessionIssuer({
			providerName: "telnyx",
			callId,
			from,
			to,
			direction: "outbound"
		}) : void 0;
		const result = await ctx.provider.initiateCall({
			callId,
			from,
			to,
			webhookUrl: ctx.webhookUrl,
			inlineTwiml,
			preConnectTwiml,
			...streamSession ? {
				streamUrl: streamSession.streamUrl,
				streamAuthToken: streamSession.token
			} : {}
		});
		await ctx.mutationQueue.enqueue("state", async () => {
			if (!isCurrentCall(ctx, callRecord) || callRecord.providerCallId) return;
			const next = copyCallRecord(callRecord);
			next.providerCallId = result.providerCallId;
			await persistCallRecord(ctx.storePath, next, ctx.stateRuntime);
			Object.assign(callRecord, next);
			ctx.providerCallIdMap.set(result.providerCallId, callId);
		});
		console.log(`[voice-call] Outbound call initiated: callId=${callId} providerCallId=${callRecord.providerCallId ?? result.providerCallId} mode=${mode} preConnectDtmf=${preConnectTwiml ? "yes" : "no"} initialMessage=${initialMessage ? "yes" : "no"}`);
		return {
			callId,
			success: true
		};
	} catch (err) {
		await ctx.mutationQueue.enqueue("state", () => finalizeCall({
			ctx,
			call: callRecord,
			endReason: "failed"
		}));
		return {
			callId,
			success: false,
			error: formatErrorMessage(err)
		};
	}
}
async function speak(ctx, callId, text, options) {
	const connected = requireConnectedCall(ctx, callId);
	if (!connected.ok) return {
		success: false,
		error: connected.error
	};
	const { call, providerCallId, provider } = connected;
	let speakingCommitted = false;
	try {
		let startTimer = false;
		speakingCommitted = await updateCall(ctx, call, (next) => {
			if (!next.answeredAt) {
				next.answeredAt = Date.now();
				startTimer = true;
			}
			transitionState(next, "speaking");
		}, options?.isCurrent);
		if (options?.isCurrent) {
			await ctx.mutationQueue.enqueue("state", async () => void 0);
			if (!options.isCurrent()) throw new Error("Automatic reply superseded");
		}
		if (!speakingCommitted || !isCurrentCall(ctx, call)) return {
			success: false,
			error: "Call has ended"
		};
		if (ctx.isStopping()) throw new Error("Voice Call manager is stopping");
		if (startTimer) startMaxDurationTimer({
			ctx,
			callId,
			onTimeout: (id) => endCall(ctx, id, { reason: "timeout" })
		});
		const numberRouteKey = resolveVoiceCallNumberRouteKeyForCall(call);
		const voice = resolvePreferredTtsVoice(resolveVoiceCallEffectiveConfig(ctx.config, numberRouteKey).config);
		const playbackOptions = options?.listenAfterPlayback ? { listenAfterPlayback: true } : {};
		await provider.playTts({
			callId,
			providerCallId: call.providerCallId ?? providerCallId,
			text,
			voice,
			...playbackOptions
		});
		if (!await updateCall(ctx, call, (next) => addTranscriptEntry(next, "bot", text))) return {
			success: false,
			error: "Call has ended"
		};
		return { success: true };
	} catch (err) {
		if (speakingCommitted) await updateCall(ctx, call, (next) => {
			if (next.state === "speaking") transitionState(next, "listening");
		});
		return {
			success: false,
			error: formatErrorMessage(err)
		};
	}
}
function shouldStartListeningAfterInitialMessage(ctx) {
	if (ctx.provider?.name !== "twilio") return true;
	if (!ctx.config.streaming.enabled) return true;
	return ctx.provider.isConversationStreamConnectEnabled?.() !== true;
}
async function sendDtmf(ctx, callId, digits) {
	const validationError = validateDtmfDigits(digits);
	if (validationError) return {
		success: false,
		error: validationError
	};
	const connected = requireConnectedCall(ctx, callId);
	if (!connected.ok) return {
		success: false,
		error: connected.error
	};
	if (!connected.provider.sendDtmf) return {
		success: false,
		error: `${connected.provider.name} does not support outbound DTMF`
	};
	try {
		await connected.provider.sendDtmf({
			callId,
			providerCallId: connected.providerCallId,
			digits
		});
		return { success: true };
	} catch (err) {
		return {
			success: false,
			error: formatErrorMessage(err)
		};
	}
}
async function speakInitialMessage(ctx, providerCallId) {
	const call = getCallByProviderCallId({
		activeCalls: ctx.activeCalls,
		providerCallIdMap: ctx.providerCallIdMap,
		providerCallId
	});
	if (!call) {
		console.warn(`[voice-call] speakInitialMessage: no call found for ${providerCallId}`);
		return;
	}
	const initialMessage = call.metadata?.initialMessage;
	const mode = call.metadata?.mode ?? "conversation";
	if (!initialMessage) {
		console.log(`[voice-call] speakInitialMessage: no initial message for ${call.callId}`);
		return;
	}
	if (ctx.initialMessageInFlight.has(call.callId)) {
		console.log(`[voice-call] speakInitialMessage: initial message already in flight for ${call.callId}`);
		return;
	}
	ctx.initialMessageInFlight.add(call.callId);
	try {
		console.log(`[voice-call] Speaking initial message for call ${call.callId} (mode: ${mode})`);
		const result = await speak(ctx, call.callId, initialMessage);
		if (!result.success) {
			console.warn(`[voice-call] Failed to speak initial message: ${result.error}`);
			return;
		}
		if (!await updateCall(ctx, call, (next) => {
			if (next.metadata?.initialMessage === initialMessage) delete next.metadata.initialMessage;
		}) || !isCurrentCall(ctx, call)) return;
		if (ctx.isStopping()) throw new Error("Voice Call manager is stopping");
		if (mode === "notify") {
			const delaySec = ctx.config.outbound.notifyHangupDelaySec;
			const delayMs = resolveVoiceCallSecondsTimerDelayMs(delaySec, 0);
			console.log(`[voice-call] Notify mode: auto-hangup in ${delaySec}s for call ${call.callId}`);
			const previousTimer = ctx.notifyHangupTimers.get(call.callId);
			if (previousTimer) clearTimeout(previousTimer);
			const timer = setTimeout(() => {
				if (ctx.notifyHangupTimers.get(call.callId) !== timer) return;
				ctx.notifyHangupTimers.delete(call.callId);
				const work = (async () => {
					if (!ctx.isStopping() && isCurrentCall(ctx, call)) {
						console.log(`[voice-call] Notify mode: hanging up call ${call.callId}`);
						try {
							const endResult = await endCall(ctx, call.callId);
							if (!endResult.success) console.warn(`[voice-call] Notify mode failed to hang up call ${call.callId}: ${endResult.error ?? "unknown error"}`);
						} catch (error) {
							console.warn(`[voice-call] Notify mode failed to hang up call ${call.callId}: ${formatErrorMessage(error)}`);
						}
					}
				})();
				ctx.trackCallWork(work);
			}, delayMs);
			ctx.notifyHangupTimers.set(call.callId, timer);
		} else if (mode === "conversation" && ctx.provider && shouldStartListeningAfterInitialMessage(ctx)) {
			if (!await updateCall(ctx, call, (next) => transitionState(next, "listening")) || !isCurrentCall(ctx, call)) return;
			if (ctx.isStopping()) throw new Error("Voice Call manager is stopping");
			await ctx.provider.startListening({
				callId: call.callId,
				providerCallId: call.providerCallId ?? providerCallId
			});
		}
	} finally {
		ctx.initialMessageInFlight.delete(call.callId);
	}
}
async function continueCall(ctx, callId, prompt) {
	const connected = requireConnectedCall(ctx, callId);
	if (!connected.ok) return {
		success: false,
		error: connected.error
	};
	const { call, providerCallId, provider } = connected;
	if (ctx.activeTurnCalls.has(callId) || ctx.transcriptWaiters.has(callId)) return {
		success: false,
		error: "Already waiting for transcript"
	};
	ctx.activeTurnCalls.add(callId);
	const turnStartedAt = Date.now();
	const turnToken = provider.name === "twilio" ? crypto.randomUUID() : void 0;
	try {
		const speakResult = await speak(ctx, callId, prompt);
		if (!speakResult.success) return speakResult;
		if (!await updateCall(ctx, call, (next) => transitionState(next, "listening")) || !isCurrentCall(ctx, call)) return {
			success: false,
			error: "Call has ended"
		};
		if (ctx.isStopping()) throw new Error("Voice Call manager is stopping");
		const listenStartedAt = Date.now();
		await provider.startListening({
			callId,
			providerCallId: call.providerCallId ?? providerCallId,
			turnToken
		});
		if (ctx.isStopping()) throw new Error("Voice Call manager is stopping");
		if (!isCurrentCall(ctx, call)) return {
			success: false,
			error: "Call has ended"
		};
		const transcript = await waitForFinalTranscript(ctx, callId, turnToken);
		const transcriptReceivedAt = Date.now();
		await provider.stopListening({
			callId,
			providerCallId
		});
		const lastTurnLatencyMs = transcriptReceivedAt - turnStartedAt;
		const lastTurnListenWaitMs = transcriptReceivedAt - listenStartedAt;
		if (!await updateCall(ctx, call, (next) => {
			const turnCount = typeof next.metadata?.turnCount === "number" ? next.metadata.turnCount + 1 : 1;
			next.metadata = {
				...next.metadata,
				turnCount,
				lastTurnLatencyMs,
				lastTurnListenWaitMs,
				lastTurnCompletedAt: transcriptReceivedAt
			};
		})) return {
			success: false,
			error: "Call has ended"
		};
		console.log("[voice-call] continueCall latency call=" + call.callId + " totalMs=" + String(lastTurnLatencyMs) + " listenWaitMs=" + String(lastTurnListenWaitMs));
		return {
			success: true,
			transcript
		};
	} catch (err) {
		return {
			success: false,
			error: formatErrorMessage(err)
		};
	} finally {
		ctx.activeTurnCalls.delete(callId);
		clearTranscriptWaiter(ctx, callId);
	}
}
function endCall(ctx, callId, options) {
	const inFlight = ctx.endCallOperations.get(callId);
	if (inFlight) return inFlight;
	const lookup = lookupConnectedCall(ctx, callId);
	if (lookup.kind === "error") return Promise.resolve({
		success: false,
		error: lookup.error
	});
	if (lookup.kind === "ended") return Promise.resolve({ success: true });
	const { call, providerCallId, provider } = lookup;
	const reason = options?.reason ?? "hangup-bot";
	const operation = (async () => {
		try {
			await provider.hangupCall({
				callId,
				providerCallId,
				reason
			});
			await ctx.mutationQueue.enqueue("state", () => finalizeCall({
				ctx,
				call,
				endReason: reason
			}));
			return { success: true };
		} catch (err) {
			return {
				success: false,
				error: formatErrorMessage(err)
			};
		}
	})();
	ctx.endCallOperations.set(callId, operation);
	operation.then(() => {
		if (ctx.endCallOperations.get(callId) === operation) ctx.endCallOperations.delete(callId);
	});
	return operation;
}
//#endregion
//#region extensions/voice-call/src/manager/events.ts
const log = createSubsystemLogger("voice-call/events");
function shouldAcceptInbound(config, from) {
	const { inboundPolicy: policy, allowFrom } = config;
	switch (policy) {
		case "disabled":
			log.info("Inbound call rejected: policy is disabled");
			return false;
		case "open":
			log.info("Inbound call accepted: policy is open");
			return true;
		case "allowlist":
		case "pairing": {
			const normalized = normalizePhoneNumber(from);
			if (!normalized) {
				log.info("Inbound call rejected: missing caller ID");
				return false;
			}
			const allowed = isAllowlistedCaller(normalized, allowFrom);
			const status = allowed ? "accepted" : "rejected";
			log.info(`Inbound call ${status}: caller=${redactIdentifier(from)} allowlisted=${allowed}`);
			return allowed;
		}
		default: return false;
	}
}
async function createWebhookCall(params) {
	const callId = crypto.randomUUID();
	const effective = resolveVoiceCallEffectiveConfig(params.ctx.config, params.direction === "inbound" ? params.to : void 0);
	const effectiveConfig = effective.config;
	const callRecord = {
		callId,
		providerCallId: params.providerCallId,
		provider: params.ctx.provider?.name || "twilio",
		direction: params.direction,
		state: "ringing",
		from: params.from,
		to: params.to,
		sessionKey: resolveVoiceCallSessionKey({
			config: effectiveConfig,
			callId,
			phone: params.direction === "outbound" ? params.to : params.from,
			coreSession: params.ctx.coreSession
		}),
		agentId: normalizeAgentId(effectiveConfig.agentId),
		startedAt: Date.now(),
		transcript: [],
		processedEventIds: [],
		metadata: {
			initialMessage: params.direction === "inbound" ? effectiveConfig.inboundGreeting || "Hello! How can I help you today?" : void 0,
			...effective.numberRouteKey ? { numberRouteKey: effective.numberRouteKey } : {}
		}
	};
	await persistCallRecord(params.ctx.storePath, callRecord, params.ctx.stateRuntime);
	params.ctx.activeCalls.set(callId, callRecord);
	params.ctx.providerCallIdMap.set(params.providerCallId, callId);
	log.info(`Created ${params.direction} call record: ${callId} caller=${redactIdentifier(params.from)}`);
	return callRecord;
}
async function persistRejectedInboundCall(params) {
	const callId = params.event.callId || params.providerCallId;
	const now = Date.now();
	const rejectedCall = {
		callId,
		providerCallId: params.providerCallId,
		provider: params.ctx.provider?.name || "twilio",
		direction: "inbound",
		state: "hangup-bot",
		from: params.event.from || "unknown",
		to: params.event.to || params.ctx.config.fromNumber || "unknown",
		startedAt: params.event.timestamp || now,
		endedAt: now,
		endReason: "hangup-bot",
		transcript: [],
		processedEventIds: [params.dedupeKey],
		metadata: { rejectionReason: "inbound-policy" }
	};
	await persistCallRecord(params.ctx.storePath, rejectedCall, params.ctx.stateRuntime);
}
function processEvent(ctx, event) {
	return ctx.mutationQueue.enqueue("state", () => processEventInQueue(ctx, event));
}
async function processEventInQueue(ctx, event) {
	const dedupeKey = event.dedupeKey || event.id;
	if (ctx.processedEventIds.has(dedupeKey)) return { kind: "ignored" };
	let call = findCall({
		activeCalls: ctx.activeCalls,
		providerCallIdMap: ctx.providerCallIdMap,
		callIdOrProviderCallId: event.callId
	});
	let providerCallId = event.providerCallId;
	let retained;
	if (!call) {
		retained = await findCallInStore(ctx.storePath, event.callId, ctx.stateRuntime);
		if (!retained && providerCallId && providerCallId !== event.callId) retained = await findCallInStore(ctx.storePath, providerCallId, ctx.stateRuntime);
		if (retained && retained.metadata?.rejectionReason !== "inbound-policy") {
			call = ctx.activeCalls.get(retained.callId);
			if (!call) return TerminalStates.has(retained.state) ? { kind: "ignored" } : {
				kind: "ignored",
				replayable: true
			};
		}
	}
	if (call && providerCallId && providerCallId !== call.providerCallId) {
		if ((providerCallId === event.callId && retained ? retained : await findCallInStore(ctx.storePath, providerCallId, ctx.stateRuntime))?.callId === call.callId) providerCallId = call.providerCallId;
	}
	const eventDirection = event.direction === "inbound" || event.direction === "outbound" ? event.direction : void 0;
	if (!call && providerCallId && eventDirection) {
		if (eventDirection === "inbound" && !shouldAcceptInbound(ctx.config, event.from)) {
			const pid = providerCallId;
			if (!ctx.provider) {
				log.warn(`Inbound call rejected by policy but no provider to hang up (providerCallId: ${pid}, caller=${redactIdentifier(event.from)}); call will time out on provider side.`);
				return { kind: "ignored" };
			}
			if (ctx.rejectedProviderCallIds.has(pid)) return { kind: "ignored" };
			const callId = event.callId ?? pid;
			await persistRejectedInboundCall({
				ctx,
				event,
				dedupeKey,
				providerCallId: pid
			});
			if (ctx.isStopping()) return { kind: "processed" };
			const rejectionReservation = reserveRejectedProviderCall(ctx.rejectedProviderCallIds, pid);
			if (rejectionReservation === void 0) return { kind: "ignored" };
			rememberManagerReplayKey(ctx.processedEventIds, dedupeKey);
			log.info(`Rejecting inbound call by policy: ${pid}`);
			ctx.trackCallWork(ctx.provider.hangupCall({
				callId,
				providerCallId: pid,
				reason: "hangup-bot"
			}).catch((err) => {
				releaseRejectedProviderCall(ctx.rejectedProviderCallIds, pid, rejectionReservation);
				const message = formatErrorMessage(err);
				log.warn(`Failed to reject inbound call ${pid}: ${message}`);
			}));
			return { kind: "processed" };
		}
		call = await createWebhookCall({
			ctx,
			providerCallId,
			direction: eventDirection === "outbound" ? "outbound" : "inbound",
			from: event.from || "unknown",
			to: event.to || ctx.config.fromNumber || "unknown"
		});
		event.callId = call.callId;
	}
	if (!call) return {
		kind: "ignored",
		replayable: true
	};
	const activeCall = copyCallRecord(call);
	const previousCall = { providerCallId: call.providerCallId };
	const shouldCommitReplayKey = !(event.type === "call.error" && event.retryable);
	const effects = [];
	let result = { kind: "processed" };
	const startDurationTimer = () => {
		startMaxDurationTimer({
			ctx,
			callId: activeCall.callId,
			onTimeout: (callId) => endCall(ctx, callId, { reason: "timeout" })
		});
	};
	const prepareLiveDurationTimer = () => {
		if (!activeCall.answeredAt) {
			activeCall.answeredAt = event.timestamp;
			effects.push(startDurationTimer);
		}
	};
	const publishProviderCallId = (terminal = false) => {
		if (!providerCallId || providerCallId === previousCall.providerCallId) return;
		if (!terminal) ctx.providerCallIdMap.set(providerCallId, activeCall.callId);
		if (previousCall.providerCallId) {
			if (ctx.providerCallIdMap.get(previousCall.providerCallId) === activeCall.callId) ctx.providerCallIdMap.delete(previousCall.providerCallId);
		}
	};
	if (providerCallId && providerCallId !== activeCall.providerCallId) activeCall.providerCallId = providerCallId;
	if (shouldCommitReplayKey) appendCallReplayKey(activeCall.processedEventIds, dedupeKey);
	switch (event.type) {
		case "call.initiated": {
			transitionState(activeCall, "initiated");
			const inboundProvider = ctx.provider;
			const inboundProviderCallId = activeCall.providerCallId;
			const answerInboundCall = inboundProvider?.answerCall?.bind(inboundProvider);
			if (activeCall.direction === "inbound" && inboundProviderCallId && answerInboundCall) effects.push(() => {
				const inboundStreamSession = ctx.config.realtime?.enabled && inboundProvider?.name === "telnyx" && ctx.streamSessionIssuer ? ctx.streamSessionIssuer({
					providerName: "telnyx",
					callId: activeCall.callId,
					from: activeCall.from,
					to: activeCall.to,
					direction: "inbound"
				}) : void 0;
				ctx.trackCallWork(answerInboundCall({
					callId: activeCall.callId,
					providerCallId: inboundProviderCallId,
					...inboundStreamSession ? {
						streamUrl: inboundStreamSession.streamUrl,
						streamAuthToken: inboundStreamSession.token
					} : {}
				}).catch((err) => {
					const message = formatErrorMessage(err);
					log.warn(`Failed to answer inbound call ${activeCall.providerCallId}: ${message}`);
				}));
			});
			break;
		}
		case "call.ringing":
			transitionState(activeCall, "ringing");
			break;
		case "call.answered":
			activeCall.answeredAt = event.timestamp;
			transitionState(activeCall, "answered");
			effects.push(startDurationTimer, () => ctx.onCallAnswered?.(call));
			break;
		case "call.active":
			transitionState(activeCall, "active");
			break;
		case "call.speaking":
		case "call.assistant-speech":
			prepareLiveDurationTimer();
			transitionState(activeCall, "speaking");
			if (event.type === "call.assistant-speech" && event.transcript.trim()) addTranscriptEntry(activeCall, "bot", event.transcript);
			break;
		case "call.speech":
			if (event.isFinal && event.transcript.trim()) {
				const waiter = ctx.transcriptWaiters.get(activeCall.callId);
				if (waiter?.turnToken && waiter.turnToken !== event.turnToken) {
					log.warn(`Ignoring speech event with mismatched turn token for ${activeCall.callId}`);
					result = { kind: "ignored" };
					break;
				}
				addTranscriptEntry(activeCall, "user", event.transcript);
				const speechResult = {
					kind: "final-speech",
					call,
					transcript: event.transcript,
					waiterResolved: false
				};
				result = speechResult;
				if (waiter) effects.push(() => {
					if (ctx.transcriptWaiters.get(activeCall.callId) === waiter) speechResult.waiterResolved = resolveTranscriptWaiter(ctx, activeCall.callId, event.transcript, event.turnToken);
				});
			}
			if (event.transcript.trim()) effects.push(() => ctx.onCallerSpeech?.(call));
			prepareLiveDurationTimer();
			transitionState(activeCall, "listening");
			break;
		case "call.silence":
		case "call.dtmf": break;
		case "call.ended":
			await finalizeCall({
				ctx,
				call,
				preparedCall: activeCall,
				endReason: event.reason,
				endedAt: event.timestamp
			});
			publishProviderCallId(true);
			rememberManagerReplayKey(ctx.processedEventIds, dedupeKey);
			return { kind: "processed" };
		case "call.error":
			if (!event.retryable) {
				await finalizeCall({
					ctx,
					call,
					preparedCall: activeCall,
					endReason: "error",
					endedAt: event.timestamp,
					transcriptRejectReason: `Call error: ${event.error}`
				});
				publishProviderCallId(true);
				rememberManagerReplayKey(ctx.processedEventIds, dedupeKey);
				return { kind: "processed" };
			}
			result = {
				kind: "processed",
				replayable: true
			};
	}
	await persistCallRecord(ctx.storePath, activeCall, ctx.stateRuntime);
	Object.assign(call, activeCall);
	publishProviderCallId();
	if (shouldCommitReplayKey) rememberManagerReplayKey(ctx.processedEventIds, dedupeKey);
	if (!ctx.isStopping()) for (const effect of effects) effect();
	return result;
}
//#endregion
//#region extensions/voice-call/src/utils.ts
/** Resolve user input paths, including "~" against the current OS home. */
function resolveUserPath(input) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) {
		const expanded = trimmed.replace(/^~(?=$|[\\/])/, () => os.homedir());
		return path.resolve(expanded);
	}
	return path.resolve(trimmed);
}
//#endregion
//#region extensions/voice-call/src/manager.ts
function markRestoredCallSkipped(call, endReason) {
	call.endedAt = Date.now();
	call.endReason = endReason;
	call.state = endReason;
}
function incrementRestoreStatusCount(counts, status) {
	const key = normalizeOptionalString(status) ?? "terminal";
	counts.set(key, (counts.get(key) ?? 0) + 1);
}
function resolveRestoredMaxDurationAnchor(call) {
	return call.answeredAt ?? (call.state === "speaking" || call.state === "listening" ? call.startedAt : void 0);
}
function resolveDefaultStoreBase(config, storePath) {
	const rawOverride = storePath?.trim() || config.store?.trim();
	if (rawOverride) return resolveUserPath(rawOverride);
	return resolveDefaultVoiceCallStoreDir();
}
/**
* Manages voice calls: state ownership and delegation to manager helper modules.
*/
var CallManager = class {
	runOperation(operation) {
		if (this.closing) return Promise.reject(/* @__PURE__ */ new Error("Voice Call manager is stopping"));
		const pending = this.initialization ? this.initialization.then(() => {
			if (this.closing) throw new Error("Voice Call manager is stopping");
			return operation();
		}) : operation();
		this.trackCallWork(pending);
		return pending;
	}
	/** Stop is owned by runtime shutdown, after webhook and stream producers have closed. */
	stop() {
		if (this.stopPromise) return this.stopPromise;
		this.closing = true;
		for (const timers of [this.maxDurationTimers, this.notifyHangupTimers]) {
			for (const timer of timers.values()) clearTimeout(timer);
			timers.clear();
		}
		for (const waiter of this.transcriptWaiters.values()) {
			clearTimeout(waiter.timeout);
			waiter.reject(/* @__PURE__ */ new Error("Voice Call runtime stopped"));
		}
		this.transcriptWaiters.clear();
		this.stopPromise = (async () => {
			const failures = [];
			while (this.pendingWork.size > 0) {
				const results = await Promise.allSettled(this.pendingWork);
				for (const result of results) if (result.status === "rejected") failures.push(result.reason);
			}
			for (const timers of [this.maxDurationTimers, this.notifyHangupTimers]) {
				for (const timer of timers.values()) clearTimeout(timer);
				timers.clear();
			}
			if (failures.length > 0) throw new AggregateError(failures, "Voice Call work failed during shutdown");
		})();
		return this.stopPromise;
	}
	/** Serialize transient metadata with persisted updates without adding event-store writes. */
	updateCallMetadata(call, update) {
		return this.runOperation(() => this.mutationQueue.enqueue("state", async () => {
			if (this.activeCalls.get(call.callId) === call && !TerminalStates.has(call.state)) call.metadata = update(call.metadata ? { ...call.metadata } : void 0);
		}));
	}
	constructor(config, storePath, coreSession, stateRuntime) {
		this.activeCalls = /* @__PURE__ */ new Map();
		this.providerCallIdMap = /* @__PURE__ */ new Map();
		this.processedEventIds = /* @__PURE__ */ new Set();
		this.rejectedProviderCallIds = /* @__PURE__ */ new Map();
		this.provider = null;
		this.webhookUrl = null;
		this.activeTurnCalls = /* @__PURE__ */ new Set();
		this.endCallOperations = /* @__PURE__ */ new Map();
		this.transcriptWaiters = /* @__PURE__ */ new Map();
		this.maxDurationTimers = /* @__PURE__ */ new Map();
		this.initialMessageInFlight = /* @__PURE__ */ new Set();
		this.autoResponseOwners = /* @__PURE__ */ new WeakMap();
		this.mutationQueue = new KeyedAsyncQueue();
		this.pendingCallAdmissions = /* @__PURE__ */ new Set();
		this.pendingWork = /* @__PURE__ */ new Set();
		this.notifyHangupTimers = /* @__PURE__ */ new Map();
		this.initialization = null;
		this.closing = false;
		this.stopPromise = null;
		this.trackCallWork = (work) => {
			this.pendingWork.add(work);
			const settled = () => this.pendingWork.delete(work);
			work.then(settled, settled);
		};
		this.config = config;
		this.coreSession = coreSession;
		this.storePath = resolveDefaultStoreBase(config, storePath);
		this.stateRuntime = stateRuntime;
	}
	/**
	* Initialize the call manager with a provider.
	* Verifies persisted calls with the provider and restarts timers.
	*/
	initialize(provider, webhookUrl) {
		if (this.closing) return Promise.reject(/* @__PURE__ */ new Error("Voice Call manager is stopping"));
		const pending = this.initializeFromStore(provider, webhookUrl);
		this.initialization = pending;
		this.trackCallWork(pending);
		pending.then(() => {
			if (this.initialization === pending) this.initialization = null;
		}, () => {});
		return pending;
	}
	async initializeFromStore(provider, webhookUrl) {
		this.provider = provider;
		this.webhookUrl = webhookUrl;
		fs.mkdirSync(this.storePath, { recursive: true });
		const persisted = await loadActiveCallsFromStore(this.storePath, this.stateRuntime);
		if (this.closing) return;
		this.processedEventIds = persisted.processedEventIds;
		this.rejectedProviderCallIds = /* @__PURE__ */ new Map();
		const verified = await this.verifyRestoredCalls(provider, persisted.activeCalls);
		if (this.closing) return;
		const timers = [];
		let skippedAlreadyElapsedTimers = 0;
		for (const [callId, call] of verified) {
			const maxDurationAnchor = resolveRestoredMaxDurationAnchor(call);
			if (maxDurationAnchor !== void 0 && !TerminalStates.has(call.state)) {
				const elapsed = Date.now() - maxDurationAnchor;
				const maxDurationMs = resolveVoiceCallSecondsTimerDelayMs(this.config.maxDurationSeconds);
				if (elapsed >= maxDurationMs) {
					verified.delete(callId);
					skippedAlreadyElapsedTimers += 1;
					continue;
				}
				if (call.answeredAt === void 0) {
					call.answeredAt = maxDurationAnchor;
					await persistCallRecord(this.storePath, call, this.stateRuntime);
				}
				if (this.closing) return;
				timers.push({
					callId,
					deadline: maxDurationAnchor + maxDurationMs
				});
			}
		}
		this.activeCalls = verified;
		this.providerCallIdMap = /* @__PURE__ */ new Map();
		for (const [callId, call] of verified) if (call.providerCallId) this.providerCallIdMap.set(call.providerCallId, callId);
		for (const { callId, deadline } of timers) {
			startMaxDurationTimer({
				ctx: this.getContext(),
				callId,
				timeoutMs: Math.max(0, deadline - Date.now()),
				onTimeout: (id) => this.endCall(id, { reason: "timeout" })
			});
			console.log(`[voice-call] Restarted max-duration timer for restored call ${callId}`);
		}
		if (skippedAlreadyElapsedTimers > 0) console.log(`[voice-call] Skipped ${skippedAlreadyElapsedTimers} restored call(s) whose max-duration timer already elapsed`);
		if (verified.size > 0) console.log(`[voice-call] Restored ${verified.size} active call(s) from store`);
	}
	/**
	* Verify persisted calls with the provider before restoring.
	* Calls without providerCallId or older than maxDurationSeconds are skipped.
	* Transient provider errors keep the call (rely on timer fallback).
	*/
	async verifyRestoredCalls(provider, candidates) {
		if (candidates.size === 0) return /* @__PURE__ */ new Map();
		const maxAgeMs = resolveVoiceCallSecondsTimerDelayMs(this.config.maxDurationSeconds);
		const now = Date.now();
		const verified = /* @__PURE__ */ new Map();
		const verifyTasks = [];
		let skippedNoProviderCallId = 0;
		let skippedOlderThanMaxDuration = 0;
		const skippedTerminalStatuses = /* @__PURE__ */ new Map();
		let keptVerifiedActive = 0;
		let keptUnknownProviderStatus = 0;
		let keptVerificationFailures = 0;
		let admissionFailure;
		try {
			for (const [callId, call] of candidates) {
				if (this.closing) break;
				if (!call.providerCallId) {
					skippedNoProviderCallId += 1;
					continue;
				}
				if (now - call.startedAt > maxAgeMs) {
					skippedOlderThanMaxDuration += 1;
					markRestoredCallSkipped(call, "timeout");
					await persistCallRecord(this.storePath, call, this.stateRuntime);
					if (this.closing) break;
					await provider.hangupCall({
						callId,
						providerCallId: call.providerCallId,
						reason: "timeout"
					}).catch((err) => {
						console.warn(`[voice-call] Failed to hang up expired restored call ${callId}:`, err instanceof Error ? err.message : String(err));
					});
					continue;
				}
				const task = provider.getCallStatus({ providerCallId: call.providerCallId }).then(async (result) => {
					if (result.isTerminal) {
						incrementRestoreStatusCount(skippedTerminalStatuses, result.status);
						markRestoredCallSkipped(call, "completed");
						await persistCallRecord(this.storePath, call, this.stateRuntime);
					} else if (result.isUnknown) {
						keptUnknownProviderStatus += 1;
						verified.set(callId, call);
					} else {
						keptVerifiedActive += 1;
						verified.set(callId, call);
					}
				}, () => {
					keptVerificationFailures += 1;
					verified.set(callId, call);
				});
				task.catch(() => {});
				verifyTasks.push(task);
			}
		} catch (error) {
			admissionFailure = { error };
		}
		const outcomes = await Promise.allSettled(verifyTasks);
		if (admissionFailure) throw admissionFailure.error;
		for (const outcome of outcomes) if (outcome.status === "rejected") throw outcome.reason;
		if (skippedNoProviderCallId > 0) console.log(`[voice-call] Skipped ${skippedNoProviderCallId} restored call(s) with no providerCallId`);
		if (skippedOlderThanMaxDuration > 0) console.log(`[voice-call] Skipped ${skippedOlderThanMaxDuration} restored call(s) older than maxDurationSeconds`);
		for (const [status, count] of [...skippedTerminalStatuses].toSorted(([a], [b]) => a.localeCompare(b))) console.log(`[voice-call] Skipped ${count} restored call(s) with provider status: ${status}`);
		if (keptVerifiedActive > 0) console.log(`[voice-call] Kept ${keptVerifiedActive} restored call(s) confirmed active by provider`);
		if (keptUnknownProviderStatus > 0) console.log(`[voice-call] Kept ${keptUnknownProviderStatus} restored call(s) with unknown provider status (relying on timer)`);
		if (keptVerificationFailures > 0) console.log(`[voice-call] Kept ${keptVerificationFailures} restored call(s) after verification failure (relying on timer)`);
		return verified;
	}
	/**
	* Get the current provider.
	*/
	getProvider() {
		return this.provider;
	}
	/**
	* Initiate an outbound call.
	*/
	async initiateCall(to, sessionKey, options) {
		return this.runOperation(() => initiateCall(this.getContext(), to, sessionKey, options));
	}
	/**
	* Speak to user in an active call.
	*/
	async speak(callId, text, options) {
		return this.runOperation(() => speak(this.getContext(), callId, text, options));
	}
	/**
	* Send DTMF digits to an active call.
	*/
	async sendDtmf(callId, digits) {
		return this.runOperation(() => sendDtmf(this.getContext(), callId, digits));
	}
	/**
	* Speak the initial message for a call (called when media stream connects).
	*/
	async speakInitialMessage(providerCallId) {
		return this.runOperation(() => speakInitialMessage(this.getContext(), providerCallId));
	}
	/**
	* Continue call: speak prompt, then wait for user's final transcript.
	*/
	async continueCall(callId, prompt) {
		return this.runOperation(() => continueCall(this.getContext(), callId, prompt));
	}
	/**
	* End an active call.
	*/
	endCall(callId, options) {
		return this.runOperation(() => endCall(this.getContext(), callId, options));
	}
	getContext() {
		return {
			mutationQueue: this.mutationQueue,
			pendingCallAdmissions: this.pendingCallAdmissions,
			trackCallWork: this.trackCallWork,
			isStopping: () => this.closing,
			notifyHangupTimers: this.notifyHangupTimers,
			activeCalls: this.activeCalls,
			providerCallIdMap: this.providerCallIdMap,
			processedEventIds: this.processedEventIds,
			rejectedProviderCallIds: this.rejectedProviderCallIds,
			provider: this.provider,
			config: this.config,
			coreSession: this.coreSession,
			storePath: this.storePath,
			stateRuntime: this.stateRuntime,
			webhookUrl: this.webhookUrl,
			activeTurnCalls: this.activeTurnCalls,
			endCallOperations: this.endCallOperations,
			transcriptWaiters: this.transcriptWaiters,
			maxDurationTimers: this.maxDurationTimers,
			initialMessageInFlight: this.initialMessageInFlight,
			onCallerSpeech: (call) => this.invalidateAutoResponse(call),
			onCallAnswered: (call) => {
				this.maybeSpeakInitialMessageOnAnswered(call);
			},
			streamSessionIssuer: this.streamSessionIssuer
		};
	}
	/**
	* Process a webhook event.
	*/
	processEvent(event) {
		return this.runOperation(() => processEvent(this.getContext(), event));
	}
	createAutoResponseGuard(call) {
		const owner = Symbol("automatic response");
		this.autoResponseOwners.set(call, owner);
		return {
			isCurrent: () => !this.closing && this.activeCalls.get(call.callId) === call && !TerminalStates.has(call.state) && this.autoResponseOwners.get(call) === owner,
			release: () => {
				if (this.autoResponseOwners.get(call) === owner) this.autoResponseOwners.delete(call);
			}
		};
	}
	invalidateAutoResponse(call) {
		this.autoResponseOwners.delete(call);
	}
	shouldDeferConversationInitialMessageUntilStreamConnect() {
		if (!this.provider || this.provider.name !== "twilio" || !this.config.streaming.enabled) return false;
		const streamAwareProvider = this.provider;
		if (typeof streamAwareProvider.isConversationStreamConnectEnabled !== "function") return false;
		return streamAwareProvider.isConversationStreamConnectEnabled();
	}
	maybeSpeakInitialMessageOnAnswered(call) {
		if (!(normalizeOptionalString(call.metadata?.initialMessage) ?? "")) return;
		const mode = call.metadata?.mode ?? "conversation";
		if (mode === "conversation") {
			if (this.config.realtime.enabled) return;
			if (this.shouldDeferConversationInitialMessageUntilStreamConnect()) return;
		} else if (mode !== "notify") return;
		if (!this.provider || !call.providerCallId) return;
		this.speakInitialMessage(call.providerCallId).catch((err) => {
			console.warn(`[voice-call] Failed to speak initial message for call ${call.callId}: ${formatErrorMessage(err)}`);
		});
	}
	/**
	* Get an active call by ID.
	*/
	getCall(callId) {
		return this.activeCalls.get(callId);
	}
	/** Await admitted identity updates before resolving a token-bound stream's active call. */
	getCallForStream(callId) {
		return this.runOperation(() => this.mutationQueue.enqueue("state", async () => this.closing ? void 0 : this.activeCalls.get(callId)));
	}
	/**
	* Get an active call by provider call ID (e.g., Twilio CallSid).
	*/
	getCallByProviderCallId(providerCallId) {
		return getCallByProviderCallId({
			activeCalls: this.activeCalls,
			providerCallIdMap: this.providerCallIdMap,
			providerCallId
		});
	}
	/**
	* Get all active calls.
	*/
	getActiveCalls() {
		return Array.from(this.activeCalls.values());
	}
	/** Resolve a status record from active state or the retained event store. */
	async getCallFromMemoryOrStore(callId) {
		const active = this.getCall(callId) ?? this.getCallByProviderCallId(callId);
		if (active) return active;
		return this.runOperation(() => findCallInStore(this.storePath, callId, this.stateRuntime));
	}
	/**
	* Get call history (from persisted logs).
	*/
	async getCallHistory(limit = 50) {
		return this.runOperation(() => getCallHistoryFromStore(this.storePath, limit, this.stateRuntime));
	}
};
//#endregion
//#region extensions/voice-call/src/realtime-agent-context.ts
/** Limit injected context while preserving an explicit truncation marker. */
function limitText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return `${truncateUtf16Safe(text, Math.max(0, maxChars - 32)).trimEnd()}\n[truncated]`;
}
/** Read configured workspace context files through the safe workspace root. */
async function readWorkspaceVoiceContextFiles(params) {
	const sections = [];
	let remaining = params.maxChars;
	const workspaceRoot = await root(params.workspaceDir).catch(() => null);
	if (!workspaceRoot) return sections;
	for (const file of params.files) {
		if (remaining <= 0) continue;
		const trimmed = (await workspaceRoot.readText(file).catch(() => void 0))?.trim();
		if (!trimmed) continue;
		const section = `### ${file}\n${limitText(trimmed, Math.max(0, remaining - file.length - 16))}`;
		sections.push(section);
		remaining -= section.length;
	}
	return sections;
}
/** Build final realtime instructions from base instructions, consult policy, and fast context. */
async function buildRealtimeVoiceInstructions(params) {
	const { config } = params;
	const sections = [params.baseInstructions];
	const consultGuidance = buildRealtimeVoiceAgentConsultPolicyInstructions(config.realtime);
	if (consultGuidance) sections.push(consultGuidance);
	const contextConfig = config.realtime.agentContext;
	if (!contextConfig.enabled) return sections.filter(Boolean).join("\n\n");
	const { agentId } = params;
	const capsule = [
		"OpenClaw agent voice context:",
		`- Agent id: ${agentId}`,
		"- Use this context to match the OpenClaw agent's personality and standing preferences on fast voice turns.",
		"- Treat this as compact context only; call openclaw_agent_consult when the caller needs the full agent brain, tools, memory, or workspace state."
	];
	if (contextConfig.includeIdentity) {
		const identity = params.agentRuntime.resolveAgentIdentity(params.coreConfig, agentId);
		const identityLines = [
			normalizeOptionalString(identity?.name) ? `- Name: ${normalizeOptionalString(identity?.name)}` : void 0,
			normalizeOptionalString(identity?.emoji) ? `- Emoji: ${normalizeOptionalString(identity?.emoji)}` : void 0,
			normalizeOptionalString(identity?.vibe) ? `- Vibe: ${normalizeOptionalString(identity?.vibe)}` : void 0,
			normalizeOptionalString(identity?.theme) ? `- Theme: ${normalizeOptionalString(identity?.theme)}` : void 0,
			normalizeOptionalString(identity?.creature) ? `- Creature/persona: ${normalizeOptionalString(identity?.creature)}` : void 0
		].filter(Boolean);
		if (identityLines.length > 0) capsule.push(`Configured identity:\n${identityLines.join("\n")}`);
	}
	if (contextConfig.includeWorkspaceFiles) {
		const fileSections = await readWorkspaceVoiceContextFiles({
			workspaceDir: params.agentRuntime.resolveAgentWorkspaceDir(params.coreConfig, agentId),
			files: contextConfig.files,
			maxChars: contextConfig.maxChars
		});
		if (fileSections.length > 0) capsule.push(`Workspace voice context:\n${fileSections.join("\n\n")}`);
	}
	sections.push(limitText(capsule.join("\n\n"), contextConfig.maxChars));
	return sections.filter(Boolean).join("\n\n");
}
//#endregion
//#region extensions/voice-call/src/realtime-fast-context.ts
/** Resolve fast-context consult data using caller-oriented labels. */
async function resolveRealtimeFastContextConsult(params) {
	return await resolveRealtimeVoiceFastContextConsult({
		...params,
		labels: {
			audienceLabel: "caller",
			contextName: "OpenClaw memory or session context"
		}
	});
}
//#endregion
//#region extensions/voice-call/src/resolve-call-agent-id.ts
/** Setup and startup must resolve the same owner before provisioning telephony. */
function resolveVoiceCallAgentId(config, coreConfig) {
	return config.agentId ? normalizeAgentId(config.agentId) : resolveDefaultAgentId(coreConfig, {
		surface: "Voice Call",
		hint: "Set plugins.entries.voice-call.config.agentId to a configured agent ID."
	});
}
/** Keep one agent owner for the full call, including legacy stored records. */
function resolveCallAgentId(call, config) {
	return normalizeAgentId(call.agentId ?? config.agentId);
}
//#endregion
//#region extensions/voice-call/src/response-model.ts
/** Resolve provider/model fields from explicit voice config or agent defaults. */
function resolveVoiceResponseModel(params) {
	const modelRef = params.voiceConfig.responseModel ?? `${params.agentRuntime.defaults.provider}/${params.agentRuntime.defaults.model}`;
	const slashIndex = modelRef.indexOf("/");
	return {
		modelRef,
		provider: slashIndex === -1 ? params.agentRuntime.defaults.provider : modelRef.slice(0, slashIndex),
		model: slashIndex === -1 ? modelRef : modelRef.slice(slashIndex + 1)
	};
}
//#endregion
//#region extensions/voice-call/src/telephony-audio.ts
/**
* Chunk audio buffer into 20ms frames for streaming (8kHz mono mu-law).
*/
function chunkAudio(audio, chunkSize = 160) {
	return (function* () {
		for (let i = 0; i < audio.length; i += chunkSize) yield audio.subarray(i, Math.min(i + chunkSize, audio.length));
	})();
}
//#endregion
//#region extensions/voice-call/src/telephony-tts.ts
/** Default timeout for one telephony synthesis request. */
const TELEPHONY_DEFAULT_TTS_TIMEOUT_MS = 8e3;
var UnsupportedTelephonyTtsOutputFormatError = class extends Error {
	constructor(outputFormat, provider) {
		super(`Unsupported telephony TTS output format "${outputFormat}" from provider "${provider}"`);
		this.outputFormat = outputFormat;
		this.provider = provider;
		this.name = "UnsupportedTelephonyTtsOutputFormatError";
	}
};
function convertTelephonyTtsOutput(result) {
	const format = result.outputFormat?.trim().toLowerCase();
	if ((format === "raw-8khz-8bit-mono-mulaw" || format === "ulaw_8000") && result.sampleRate === 8e3) return result.audioBuffer;
	if (!format || format === "pcm" || /^pcm[_-]\d+$/.test(format) || format.includes("raw") && (format.includes("16bit") || format.includes("16-bit")) && format.includes("pcm")) return convertPcmToMulaw8k(result.audioBuffer, result.sampleRate);
	throw new UnsupportedTelephonyTtsOutputFormatError(result.outputFormat ?? "absent", result.provider ?? "unknown");
}
/** Create a TTS provider that honors voice-call overrides and converts PCM to mulaw. */
async function createTelephonyTtsProvider(params) {
	const { coreConfig, ttsOverride, runtime, logger } = params;
	const preparedConfig = await runtime.prepareTtsRequest({
		cfg: coreConfig,
		override: ttsOverride,
		text: ""
	});
	return {
		synthesisTimeoutMs: resolveTimerTimeoutMs(preparedConfig.cfg.tts?.timeoutMs, TELEPHONY_DEFAULT_TTS_TIMEOUT_MS),
		synthesizeForTelephony: async (text) => {
			const prepared = await runtime.prepareTtsRequest({
				cfg: preparedConfig.cfg,
				text
			});
			const directives = prepared.directives;
			if (directives.warnings.length > 0) logger?.warn?.(`[voice-call] Ignored telephony TTS directive overrides (${directives.warnings.join("; ")})`);
			const cleanText = directives.hasDirective ? directives.ttsText?.trim() || directives.cleanedText.trim() : text;
			const result = await runtime.textToSpeechTelephony({
				text: cleanText,
				cfg: prepared.cfg,
				overrides: directives.overrides
			});
			if (!result.success || !result.audioBuffer || !result.sampleRate) throw new Error(result.error ?? "TTS conversion failed");
			if (result.fallbackFrom && result.provider && result.fallbackFrom !== result.provider) {
				const attemptedChain = result.attemptedProviders && result.attemptedProviders.length > 0 ? result.attemptedProviders.join(" -> ") : `${result.fallbackFrom} -> ${result.provider}`;
				logger?.warn?.(`[voice-call] Telephony TTS fallback used from=${result.fallbackFrom} to=${result.provider} attempts=${attemptedChain}`);
			}
			return convertTelephonyTtsOutput({
				audioBuffer: result.audioBuffer,
				outputFormat: result.outputFormat,
				provider: result.provider,
				sampleRate: result.sampleRate
			});
		}
	};
}
//#endregion
//#region extensions/voice-call/src/bounded-child-output.ts
const DEFAULT_MAX_OUTPUT_CHARS = 16384;
/** Create an empty bounded output buffer. */
function emptyBoundedChildOutput() {
	return {
		text: "",
		truncated: false
	};
}
/** Append output while retaining the newest maxChars and recording truncation. */
function appendBoundedChildOutput(current, chunk, maxChars = DEFAULT_MAX_OUTPUT_CHARS) {
	const appended = current.text + chunk;
	if (appended.length <= maxChars) return {
		text: appended,
		truncated: current.truncated
	};
	return {
		text: sliceUtf16Safe(appended, -maxChars),
		truncated: true
	};
}
/** Format captured output with a truncation marker when older text was dropped. */
function formatBoundedChildOutput(output) {
	return output.truncated ? `[output truncated]\n${output.text}` : output.text;
}
//#endregion
//#region extensions/voice-call/src/webhook/tailscale.ts
const TAILSCALE_COMMAND_STDOUT_MAX_BYTES = 4194304;
const DEFAULT_TAILSCALE_HTTPS_PORT = 443;
function buildTailscaleExposureArgs(opts) {
	if (!opts.localUrl && opts.port === DEFAULT_TAILSCALE_HTTPS_PORT) return [
		opts.mode,
		"off",
		opts.path
	];
	const portArgs = opts.port === DEFAULT_TAILSCALE_HTTPS_PORT ? [] : ["--https", String(opts.port)];
	return [
		opts.mode,
		"--bg",
		"--yes",
		...portArgs,
		"--set-path",
		opts.path,
		opts.localUrl ?? "off"
	];
}
async function runTailscaleCommand(args, timeoutMs = 2500) {
	try {
		const result = await runCommandWithTimeout(["tailscale", ...args], {
			killProcessTree: true,
			maxOutputBytes: {
				stdout: TAILSCALE_COMMAND_STDOUT_MAX_BYTES,
				stderr: 1
			},
			outputCapture: "head",
			terminateOnOutputLimit: { stdout: true },
			timeoutMs
		});
		if (result.termination !== "exit" || result.outputLimitExceeded) return {
			code: -1,
			stdout: ""
		};
		return {
			code: result.code ?? -1,
			stdout: result.stdout
		};
	} catch {
		return {
			code: -1,
			stdout: ""
		};
	}
}
async function getTailscaleSelfInfo() {
	const { code, stdout } = await runTailscaleCommand([
		"status",
		"--json",
		"--peers=false"
	]);
	if (code !== 0) return null;
	try {
		const status = JSON.parse(stdout);
		return {
			dnsName: status.Self?.DNSName?.replace(/\.$/, "") || null,
			nodeId: status.Self?.ID || null
		};
	} catch {
		return null;
	}
}
async function getTailscaleDnsName() {
	return (await getTailscaleSelfInfo())?.dnsName ?? null;
}
async function cleanupTailscaleExposureRoute(opts) {
	await runTailscaleCommand(buildTailscaleExposureArgs(opts));
}
async function setupTailscaleExposureRoutes(opts) {
	const dnsName = await getTailscaleDnsName();
	if (!dnsName) {
		console.warn("[voice-call] Could not get Tailscale DNS name");
		return null;
	}
	const mountedPaths = [];
	let publicUrl = null;
	for (const route of opts.routes) {
		const { code } = await runTailscaleCommand(buildTailscaleExposureArgs({
			mode: opts.mode,
			port: opts.port,
			...route
		}));
		if (code !== 0) {
			for (const path of mountedPaths.toReversed()) await cleanupTailscaleExposureRoute({
				mode: opts.mode,
				port: opts.port,
				path
			});
			console.warn(`[voice-call] Tailscale ${opts.mode} exposure failed for ${route.path}; rolled back ${mountedPaths.length} mounted route(s)`);
			return null;
		}
		const routePublicUrl = `https://${dnsName}${opts.port === DEFAULT_TAILSCALE_HTTPS_PORT ? "" : `:${opts.port}`}${route.path}`;
		console.log(`[voice-call] Tailscale ${opts.mode} active: ${routePublicUrl}`);
		publicUrl ??= routePublicUrl;
		mountedPaths.push(route.path);
	}
	return publicUrl;
}
async function setupTailscaleExposure(config) {
	if (config.tailscale.mode === "off") return null;
	const mode = config.tailscale.mode === "funnel" ? "funnel" : "serve";
	const localUrl = `http://127.0.0.1:${config.serve.port}${config.serve.path}`;
	const streamRoutes = resolveVoiceCallStreamExposurePaths(config).map(({ publicPath, localPath }) => ({
		path: publicPath,
		localUrl: `http://127.0.0.1:${config.serve.port}${localPath}`
	}));
	return setupTailscaleExposureRoutes({
		mode,
		port: config.tailscale.port,
		routes: [{
			path: config.tailscale.path,
			localUrl
		}, ...streamRoutes]
	});
}
async function cleanupTailscaleExposure(config) {
	if (config.tailscale.mode === "off") return;
	const mode = config.tailscale.mode === "funnel" ? "funnel" : "serve";
	await cleanupTailscaleExposureRoute({
		mode,
		port: config.tailscale.port,
		path: config.tailscale.path
	});
	for (const { publicPath } of resolveVoiceCallStreamExposurePaths(config)) await cleanupTailscaleExposureRoute({
		mode,
		port: config.tailscale.port,
		path: publicPath
	});
}
//#endregion
//#region extensions/voice-call/src/tunnel.ts
const NGROK_LOG_BUFFER_MAX_CHARS = 16384;
const NGROK_ERROR_MARKER = "ERR_NGROK";
const NGROK_STOP_GRACE_MS = 2e3;
const NGROK_FORCE_KILL_WAIT_MS = 1e3;
async function terminateNgrokProcess(proc, isClosed) {
	if (isClosed()) return;
	await new Promise((resolve) => {
		let finished = false;
		let forceKillWaitTimer;
		const finish = () => {
			if (finished) return;
			finished = true;
			if (forceKillTimer) clearTimeout(forceKillTimer);
			if (forceKillWaitTimer) clearTimeout(forceKillWaitTimer);
			proc.off("close", finish);
			resolve();
		};
		proc.once("close", finish);
		const forceKillTimer = setTimeout(() => {
			forceKillWaitTimer = setTimeout(finish, NGROK_FORCE_KILL_WAIT_MS);
			if (!isClosed()) proc.kill("SIGKILL");
		}, NGROK_STOP_GRACE_MS);
		proc.kill("SIGTERM");
		if (isClosed()) finish();
	});
}
function listenForChildStreamErrors(proc, onError) {
	proc.stdout.on("error", (error) => onError("stdout", error));
	proc.stderr.on("error", (error) => onError("stderr", error));
}
/**
* Start an ngrok tunnel to expose the local webhook server.
*
* Uses the ngrok CLI which must be installed: https://ngrok.com/download
*
* @example
* const tunnel = await startNgrokTunnel({ port: 3334, path: '/voice/webhook' });
* console.log('Public URL:', tunnel.publicUrl);
* // Later: await tunnel.stop();
*/
async function startNgrokTunnel(config) {
	const args = [
		"http",
		String(config.port),
		"--log",
		"stdout",
		"--log-format",
		"json"
	];
	if (config.domain) args.push("--domain", config.domain);
	return new Promise((resolve, reject) => {
		const proc = spawn("ngrok", args, {
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			...config.authToken ? { env: {
				...process.env,
				NGROK_AUTHTOKEN: config.authToken
			} } : {}
		});
		let startupSettled = false;
		let childClosed = false;
		let publicUrl = null;
		let outputBuffer = "";
		let stderrTail = "";
		const timeout = setTimeout(() => {
			if (!startupSettled) {
				startupSettled = true;
				terminateNgrokProcess(proc, () => childClosed).then(() => {
					reject(/* @__PURE__ */ new Error("ngrok startup timed out (30s)"));
				});
			}
		}, 3e4);
		timeout.unref();
		const rejectIfPending = (message, kill = false) => {
			if (!startupSettled) {
				startupSettled = true;
				clearTimeout(timeout);
				if (kill && !childClosed) proc.kill("SIGKILL");
				reject(new Error(message));
			}
		};
		const processLine = (line) => {
			try {
				const log = JSON.parse(line);
				if (log.msg === "started tunnel" && log.url) publicUrl = log.url;
				if (log.addr && log.url && !publicUrl) publicUrl = log.url;
				if (publicUrl && !startupSettled) {
					startupSettled = true;
					clearTimeout(timeout);
					const fullUrl = publicUrl + config.path;
					console.log(`[voice-call] ngrok tunnel active: ${fullUrl}`);
					resolve({
						publicUrl: fullUrl,
						provider: "ngrok",
						stop: async () => {
							await terminateNgrokProcess(proc, () => childClosed);
						}
					});
				}
			} catch {}
		};
		proc.stdout.setEncoding("utf8");
		proc.stderr.setEncoding("utf8");
		proc.stdout.on("data", (chunk) => {
			const lines = (outputBuffer + chunk).split("\n");
			outputBuffer = lines.pop() || "";
			if (outputBuffer.length > NGROK_LOG_BUFFER_MAX_CHARS) outputBuffer = sliceUtf16Safe(outputBuffer, -16384);
			for (const line of lines) if (line.trim()) processLine(line);
		});
		proc.stderr.on("data", (chunk) => {
			const combined = stderrTail + chunk;
			if (combined.includes(NGROK_ERROR_MARKER)) rejectIfPending(`ngrok error: ${formatBoundedChildOutput(appendBoundedChildOutput(emptyBoundedChildOutput(), combined))}`, true);
			stderrTail = sliceUtf16Safe(combined, -8);
		});
		listenForChildStreamErrors(proc, (stream, error) => {
			rejectIfPending(`ngrok ${stream} error: ${error.message}`, true);
		});
		proc.on("error", (err) => {
			rejectIfPending(`Failed to start ngrok: ${err.message}`);
		});
		proc.on("close", (code) => {
			childClosed = true;
			if (!startupSettled) {
				startupSettled = true;
				clearTimeout(timeout);
				reject(/* @__PURE__ */ new Error(`ngrok exited unexpectedly with code ${code}`));
			}
		});
	});
}
/**
* Start a Tailscale serve/funnel tunnel.
*/
async function startTailscaleTunnel(config) {
	const path = config.path.startsWith("/") ? config.path : `/${config.path}`;
	const routes = [{
		publicPath: path,
		localPath: path
	}, ...config.streamPaths ?? []].map(({ publicPath, localPath }) => {
		const normalizedPublicPath = publicPath.startsWith("/") ? publicPath : `/${publicPath}`;
		const normalizedLocalPath = localPath.startsWith("/") ? localPath : `/${localPath}`;
		return {
			path: normalizedPublicPath,
			localUrl: `http://127.0.0.1:${config.port}${normalizedLocalPath}`
		};
	});
	const publicUrl = await setupTailscaleExposureRoutes({
		mode: config.mode,
		port: config.tailscalePort,
		routes
	});
	if (!publicUrl) throw new Error(`Tailscale ${config.mode} failed`);
	return {
		publicUrl,
		provider: `tailscale-${config.mode}`,
		stop: async () => {
			for (const route of routes) await cleanupTailscaleExposureRoute({
				mode: config.mode,
				port: config.tailscalePort,
				path: route.path
			});
		}
	};
}
/**
* Start a tunnel based on configuration.
*/
async function startTunnel(config) {
	switch (config.provider) {
		case "ngrok": return startNgrokTunnel({
			port: config.port,
			path: config.path,
			authToken: config.ngrokAuthToken,
			domain: config.ngrokDomain
		});
		case "tailscale-serve": return startTailscaleTunnel({
			mode: "serve",
			port: config.port,
			tailscalePort: config.tailscalePort ?? 443,
			path: config.path,
			streamPaths: config.streamPaths
		});
		case "tailscale-funnel": return startTailscaleTunnel({
			mode: "funnel",
			port: config.port,
			tailscalePort: config.tailscalePort ?? 443,
			path: config.path,
			streamPaths: config.streamPaths
		});
		default: return null;
	}
}
//#endregion
//#region extensions/voice-call/src/webhook-exposure.ts
/** Return true when a provider requires a public webhook URL or tunnel. */
function providerRequiresPublicWebhook(providerName) {
	return providerName === "twilio" || providerName === "telnyx" || providerName === "plivo";
}
/** Return true for localhost, private, or otherwise provider-unreachable hosts. */
function isLocalOnlyWebhookHost(hostname) {
	return isBlockedHostnameOrIp(hostname);
}
/** Return true when a webhook URL parses to a local/private host. */
function isProviderUnreachableWebhookUrl(webhookUrl) {
	try {
		return isLocalOnlyWebhookHost(new URL(webhookUrl).hostname);
	} catch {
		return false;
	}
}
/** Resolve a human-readable webhook exposure status for doctor/setup surfaces. */
function resolveWebhookExposureStatus(config) {
	if (config.provider === "mock") return {
		ok: true,
		configured: true,
		message: "Mock provider does not need a public webhook"
	};
	if (config.publicUrl) {
		if (isProviderUnreachableWebhookUrl(config.publicUrl)) return {
			ok: false,
			configured: true,
			message: `Public webhook URL is local/private and cannot be reached by ${config.provider ?? "the provider"}: ${config.publicUrl}`
		};
		return {
			ok: true,
			configured: true,
			message: `Public webhook URL configured: ${config.publicUrl}`
		};
	}
	if (config.tunnel?.provider && config.tunnel.provider !== "none") return {
		ok: true,
		configured: true,
		message: "Webhook exposure configured through tunnel"
	};
	if (config.tailscale?.mode && config.tailscale.mode !== "off") return {
		ok: true,
		configured: true,
		message: "Webhook exposure configured through Tailscale"
	};
	return {
		ok: false,
		configured: false,
		message: "Set publicUrl or configure tunnel/tailscale so the provider can reach webhooks"
	};
}
//#endregion
//#region extensions/voice-call/src/http-headers.ts
/** Return the first value for a header name regardless of caller casing. */
function getHeader(headers, name) {
	const target = normalizeLowercaseStringOrEmpty(name);
	const value = headers[target] ?? Object.entries(headers).find(([key]) => normalizeLowercaseStringOrEmpty(key) === target)?.[1];
	if (Array.isArray(value)) return value[0];
	return value;
}
//#endregion
//#region extensions/voice-call/src/media-base64.ts
function canonicalizeVoiceCallMediaBase64(payloadBase64) {
	return canonicalizeBase64(payloadBase64.replaceAll("-", "+").replaceAll("_", "/"));
}
//#endregion
//#region extensions/voice-call/src/websocket.ts
const require = createRequire(import.meta.url);
const { WebSocket, WebSocketServer } = require(path.join(path.dirname(require.resolve("ws/package.json")), "index.js"));
//#endregion
//#region extensions/voice-call/src/media-stream.ts
const DEFAULT_PRE_START_TIMEOUT_MS = 5e3;
const DEFAULT_MAX_PENDING_CONNECTIONS = 32;
const DEFAULT_MAX_PENDING_CONNECTIONS_PER_IP = 4;
const DEFAULT_MAX_CONNECTIONS = 128;
const MAX_INBOUND_MESSAGE_BYTES = 65536;
const MAX_WS_BUFFERED_BYTES = 1048576;
const MAX_PENDING_TTS_OPERATIONS_PER_STREAM = 8;
const MAX_IGNORED_PLAYBACK_MARKS_PER_STREAM = 64;
const PLAYBACK_MARK_TIMEOUT_GRACE_MS = 2e3;
const CLOSE_REASON_LOG_MAX_CHARS = 120;
function sanitizeLogText(value, maxChars) {
	const sanitized = value.replace(/\p{Cc}/gu, " ").replace(/\s+/g, " ").trim();
	if (sanitized.length <= maxChars) return sanitized;
	return `${truncateUtf16Safe(sanitized, maxChars)}...`;
}
function normalizeWsMessageData(data) {
	if (Buffer.isBuffer(data)) return data;
	if (Array.isArray(data)) return Buffer.concat(data);
	return Buffer.from(data);
}
function parseTwilioMediaMessage(data) {
	const raw = normalizeWsMessageData(data);
	try {
		return JSON.parse(raw.toString("utf8"));
	} catch (cause) {
		throw new Error("Twilio media stream message was malformed JSON", { cause });
	}
}
/**
* Manages WebSocket connections for Twilio media streams.
*/
var MediaStreamHandler = class {
	constructor(config) {
		this.wss = null;
		this.closePromise = null;
		this.closing = false;
		this.sessions = /* @__PURE__ */ new Map();
		this.pendingConnections = /* @__PURE__ */ new Map();
		this.pendingByIp = /* @__PURE__ */ new Map();
		this.inflightUpgrades = 0;
		this.ttsQueues = /* @__PURE__ */ new Map();
		this.ttsPlaying = /* @__PURE__ */ new Map();
		this.ttsActiveControllers = /* @__PURE__ */ new Map();
		this.pendingPlaybackMarks = /* @__PURE__ */ new Map();
		this.ignoredPlaybackMarks = /* @__PURE__ */ new Map();
		this.config = config;
		this.preStartTimeoutMs = resolveTimerTimeoutMs(config.preStartTimeoutMs, DEFAULT_PRE_START_TIMEOUT_MS);
		this.maxPendingConnections = config.maxPendingConnections ?? DEFAULT_MAX_PENDING_CONNECTIONS;
		this.maxPendingConnectionsPerIp = config.maxPendingConnectionsPerIp ?? DEFAULT_MAX_PENDING_CONNECTIONS_PER_IP;
		this.maxConnections = config.maxConnections ?? DEFAULT_MAX_CONNECTIONS;
	}
	/**
	* Handle WebSocket upgrade for media stream connections.
	*/
	handleUpgrade(request, socket, head) {
		if (this.closing) {
			this.rejectUpgrade(socket, 503, "Media stream handler is shutting down");
			return;
		}
		if (!this.wss) {
			this.wss = new WebSocketServer({
				noServer: true,
				maxPayload: MAX_INBOUND_MESSAGE_BYTES
			});
			this.wss.on("connection", (ws, req) => {
				this.handleConnection(ws, req);
			});
		}
		if (this.getCurrentConnectionCount() >= this.maxConnections) {
			this.rejectUpgrade(socket, 503, "Too many media stream connections");
			return;
		}
		this.inflightUpgrades += 1;
		let released = false;
		const releaseUpgradeReservation = () => {
			if (released) return;
			released = true;
			this.inflightUpgrades = Math.max(0, this.inflightUpgrades - 1);
		};
		const handleUpgradeAbort = () => {
			socket.removeListener("error", handleUpgradeAbort);
			socket.removeListener("close", handleUpgradeAbort);
			releaseUpgradeReservation();
		};
		socket.once("error", handleUpgradeAbort);
		socket.once("close", handleUpgradeAbort);
		try {
			this.wss.handleUpgrade(request, socket, head, (ws) => {
				socket.removeListener("error", handleUpgradeAbort);
				socket.removeListener("close", handleUpgradeAbort);
				releaseUpgradeReservation();
				this.wss?.emit("connection", ws, request);
			});
		} catch (error) {
			socket.removeListener("error", handleUpgradeAbort);
			socket.removeListener("close", handleUpgradeAbort);
			releaseUpgradeReservation();
			throw error;
		}
	}
	close(shutdownBarrier = Promise.resolve()) {
		if (this.closePromise) return this.closePromise;
		this.closing = true;
		const wss = this.wss;
		this.wss = null;
		this.closePromise = (async () => {
			if (wss) await new Promise((resolve) => {
				wss.close(() => resolve());
				for (const ws of wss.clients) ws.terminate();
			});
			await shutdownBarrier;
		})().finally(() => {
			this.closing = false;
			this.closePromise = null;
		});
		return this.closePromise;
	}
	/**
	* Handle new WebSocket connection from Twilio.
	*/
	async handleConnection(ws, _request) {
		let session = null;
		const streamToken = this.getStreamToken(_request);
		const ip = this.getClientIp(_request);
		if (!this.registerPendingConnection(ws, ip)) {
			ws.close(1013, "Too many pending media stream connections");
			return;
		}
		ws.on("message", (data) => {
			try {
				const message = parseTwilioMediaMessage(data);
				switch (message.event) {
					case "connected":
						console.log("[MediaStream] Twilio connected");
						break;
					case "start":
						if (session) {
							console.warn("[MediaStream] Rejecting duplicate start frame for active connection");
							ws.close(1008, "Duplicate start");
							break;
						}
						session = this.handleStart(ws, message, streamToken);
						if (session) this.clearPendingConnection(ws);
						break;
					case "media":
						if (session && message.media?.payload) {
							const canonicalPayload = canonicalizeVoiceCallMediaBase64(message.media.payload);
							if (!canonicalPayload) break;
							const audioBuffer = Buffer.from(canonicalPayload, "base64");
							const turnId = this.ensureActiveTurn(session);
							this.emitTalkEvent(session, {
								type: "input.audio.delta",
								turnId,
								payload: {
									callId: session.callId,
									streamSid: session.streamSid,
									bytes: audioBuffer.byteLength
								}
							});
							session.sttSession.sendAudio(audioBuffer);
						}
						break;
					case "stop":
						if (session) {
							this.handleStop(session);
							session = null;
						}
						break;
					case "mark": if (session && message.mark?.name) this.acknowledgePlaybackMark(session.streamSid, message.mark.name);
				}
			} catch (error) {
				console.error("[MediaStream] Error processing message:", error);
			}
		});
		ws.on("close", (code, reason) => {
			const reasonText = sanitizeLogText(Buffer.isBuffer(reason) ? reason.toString("utf8") : String(reason || ""), CLOSE_REASON_LOG_MAX_CHARS);
			console.log(`[MediaStream] WebSocket closed (code: ${code}, reason: ${reasonText || "none"})`);
			this.clearPendingConnection(ws);
			if (session) this.handleStop(session);
		});
		ws.on("error", (error) => {
			console.error("[MediaStream] WebSocket error:", error);
		});
	}
	/**
	* Handle stream start event.
	*/
	handleStart(ws, message, streamToken) {
		const streamSid = message.streamSid || "";
		const callSid = message.start?.callSid || "";
		const effectiveToken = message.start?.customParameters?.token ?? streamToken;
		console.log(`[MediaStream] Stream started: ${streamSid} (call: ${callSid})`);
		if (!callSid) {
			console.warn("[MediaStream] Missing callSid; closing stream");
			ws.close(1008, "Missing callSid");
			return null;
		}
		if (!this.config.shouldAcceptStream) {
			console.warn("[MediaStream] Rejecting stream without an acceptance validator");
			ws.close(1008, "Unauthorized stream");
			return null;
		}
		if (!this.config.shouldAcceptStream({
			callId: callSid,
			streamSid,
			token: effectiveToken
		})) {
			console.warn(`[MediaStream] Rejecting stream for unknown call: ${callSid}`);
			ws.close(1008, "Unknown call");
			return null;
		}
		const session = {
			callId: callSid,
			streamSid,
			ws,
			sttSession: this.config.transcriptionProvider.createSession({
				cfg: this.config.cfg,
				providerConfig: this.config.providerConfig,
				onPartial: (partial) => {
					const session = this.sessions.get(streamSid);
					if (session) this.emitTalkEvent(session, {
						type: "transcript.delta",
						turnId: this.ensureActiveTurn(session),
						payload: {
							callId: callSid,
							streamSid,
							text: partial,
							role: "user"
						}
					});
					this.config.onPartialTranscript?.(callSid, partial, streamSid);
				},
				onTranscript: (transcript) => {
					const session = this.sessions.get(streamSid);
					if (session) {
						const turnId = this.ensureActiveTurn(session);
						this.emitTalkEvent(session, {
							type: "input.audio.committed",
							turnId,
							final: true,
							payload: {
								callId: callSid,
								streamSid
							}
						});
						this.emitTalkEvent(session, {
							type: "transcript.done",
							turnId,
							final: true,
							payload: {
								callId: callSid,
								streamSid,
								text: transcript,
								role: "user"
							}
						});
					}
					this.config.onTranscript?.(callSid, transcript, streamSid);
				},
				onSpeechStart: () => {
					const session = this.sessions.get(streamSid);
					if (session) this.ensureActiveTurn(session);
					this.config.onSpeechStart?.(callSid, streamSid);
				},
				onError: (error) => {
					console.warn("[MediaStream] Transcription session error:", error.message);
					const session = this.sessions.get(streamSid);
					if (session) this.emitTalkEvent(session, {
						type: "session.error",
						final: true,
						payload: {
							callId: callSid,
							streamSid,
							error: error.message
						}
					});
				}
			}),
			talk: this.createTalkEvents(callSid, streamSid)
		};
		this.sessions.set(streamSid, session);
		this.config.onConnect?.(callSid, streamSid);
		this.emitTalkEvent(session, {
			type: "session.started",
			payload: {
				callId: callSid,
				streamSid,
				provider: this.config.transcriptionProvider.id
			}
		});
		this.connectTranscriptionAndNotify(session);
		return session;
	}
	async connectTranscriptionAndNotify(session) {
		try {
			await session.sttSession.connect();
		} catch (error) {
			console.warn("[MediaStream] STT connection failed; closing media stream:", error instanceof Error ? error.message : String(error));
			this.emitTalkEvent(session, {
				type: "session.error",
				final: true,
				payload: {
					callId: session.callId,
					streamSid: session.streamSid,
					error: error instanceof Error ? error.message : String(error)
				}
			});
			if (this.sessions.get(session.streamSid) === session && session.ws.readyState === WebSocket.OPEN) session.ws.close(1011, "STT connection failed");
			else session.sttSession.close();
			return;
		}
		if (this.sessions.get(session.streamSid) !== session || session.ws.readyState !== WebSocket.OPEN) {
			session.sttSession.close();
			return;
		}
		this.emitTalkEvent(session, {
			type: "session.ready",
			payload: {
				callId: session.callId,
				streamSid: session.streamSid
			}
		});
		this.config.onTranscriptionReady?.(session.callId, session.streamSid);
	}
	/**
	* Handle stream stop event.
	*/
	handleStop(session) {
		console.log(`[MediaStream] Stream stopped: ${session.streamSid}`);
		this.clearTtsState(session.streamSid);
		session.sttSession.close();
		this.sessions.delete(session.streamSid);
		this.emitTalkEvent(session, {
			type: "session.closed",
			final: true,
			payload: {
				callId: session.callId,
				streamSid: session.streamSid
			}
		});
		this.config.onDisconnect?.(session.callId, session.streamSid);
	}
	getStreamToken(request) {
		if (!request.url || !request.headers.host) return;
		try {
			return new URL(request.url, `http://${request.headers.host}`).searchParams.get("token") ?? void 0;
		} catch {
			return;
		}
	}
	getClientIp(request) {
		const resolvedIp = this.config.resolveClientIp?.(request)?.trim();
		if (resolvedIp) return resolvedIp;
		return request.socket.remoteAddress || "unknown";
	}
	getCurrentConnectionCount() {
		return this.wss ? this.wss.clients.size + this.inflightUpgrades : this.inflightUpgrades;
	}
	registerPendingConnection(ws, ip) {
		if (this.pendingConnections.size >= this.maxPendingConnections) {
			console.warn("[MediaStream] Rejecting connection: pending connection limit reached");
			return false;
		}
		const pendingForIp = this.pendingByIp.get(ip) ?? 0;
		if (pendingForIp >= this.maxPendingConnectionsPerIp) {
			console.warn(`[MediaStream] Rejecting connection: pending per-IP limit reached (${ip})`);
			return false;
		}
		const timeout = setTimeout(() => {
			if (!this.pendingConnections.has(ws)) return;
			console.warn(`[MediaStream] Closing pre-start idle connection after ${this.preStartTimeoutMs}ms (${ip})`);
			ws.close(1008, "Start timeout");
		}, this.preStartTimeoutMs);
		timeout.unref?.();
		this.pendingConnections.set(ws, {
			ip,
			timeout
		});
		this.pendingByIp.set(ip, pendingForIp + 1);
		return true;
	}
	clearPendingConnection(ws) {
		const pending = this.pendingConnections.get(ws);
		if (!pending) return;
		clearTimeout(pending.timeout);
		this.pendingConnections.delete(ws);
		const current = this.pendingByIp.get(pending.ip) ?? 0;
		if (current <= 1) {
			this.pendingByIp.delete(pending.ip);
			return;
		}
		this.pendingByIp.set(pending.ip, current - 1);
	}
	rejectUpgrade(socket, statusCode, message) {
		const statusText = statusCode === 429 ? "Too Many Requests" : "Service Unavailable";
		const body = `${message}\n`;
		socket.write(`HTTP/1.1 ${statusCode} ${statusText}\r\nConnection: close\r
Content-Type: text/plain; charset=utf-8\r
Content-Length: ${Buffer.byteLength(body)}\r\n\r
` + body);
		socket.destroy();
	}
	/**
	* Get an active session with an open WebSocket, or undefined if unavailable.
	*/
	getOpenSession(streamSid) {
		const session = this.sessions.get(streamSid);
		return session?.ws.readyState === WebSocket.OPEN ? session : void 0;
	}
	/**
	* Send a message to a stream's WebSocket if available.
	*/
	sendToStream(streamSid, message) {
		const session = this.sessions.get(streamSid);
		if (!session) return {
			sent: false,
			bufferedBeforeBytes: 0,
			bufferedAfterBytes: 0
		};
		const readyState = session.ws.readyState;
		const bufferedBeforeBytes = session.ws.bufferedAmount;
		if (readyState !== WebSocket.OPEN) return {
			sent: false,
			readyState,
			bufferedBeforeBytes,
			bufferedAfterBytes: session.ws.bufferedAmount
		};
		if (bufferedBeforeBytes > MAX_WS_BUFFERED_BYTES) {
			session.ws.close(1013, "Backpressure: send buffer exceeded");
			return {
				sent: false,
				readyState,
				bufferedBeforeBytes,
				bufferedAfterBytes: session.ws.bufferedAmount
			};
		}
		try {
			session.ws.send(JSON.stringify(message));
			const bufferedAfterBytes = session.ws.bufferedAmount;
			if (bufferedAfterBytes > MAX_WS_BUFFERED_BYTES) {
				session.ws.close(1013, "Backpressure: send buffer exceeded");
				return {
					sent: false,
					readyState,
					bufferedBeforeBytes,
					bufferedAfterBytes
				};
			}
			return {
				sent: true,
				readyState,
				bufferedBeforeBytes,
				bufferedAfterBytes
			};
		} catch {
			return {
				sent: false,
				readyState,
				bufferedBeforeBytes,
				bufferedAfterBytes: session.ws.bufferedAmount
			};
		}
	}
	/**
	* Send audio to a specific stream (for TTS playback).
	* Audio should be mu-law encoded at 8kHz mono.
	*/
	sendAudio(streamSid, muLawAudio) {
		const session = this.getOpenSession(streamSid);
		if (session) this.emitTalkEvent(session, {
			type: "output.audio.delta",
			turnId: this.ensureActiveTurn(session),
			payload: {
				callId: session.callId,
				streamSid,
				bytes: muLawAudio.byteLength
			}
		});
		return this.sendToStream(streamSid, {
			event: "media",
			streamSid,
			media: { payload: muLawAudio.toString("base64") }
		});
	}
	/**
	* Send a mark event to track audio playback position.
	*/
	sendMark(streamSid, name) {
		return this.sendToStream(streamSid, {
			event: "mark",
			streamSid,
			mark: { name }
		});
	}
	/** Send a completion mark and wait until Twilio reports that buffered playback reached it. */
	async sendMarkAndWait(streamSid, name, audioDurationMs, signal) {
		signal.throwIfAborted();
		const marks = this.getPendingPlaybackMarks(streamSid);
		if (marks.has(name)) throw new Error(`Telephony playback mark is already pending: ${name}`);
		this.ignoredPlaybackMarks.get(streamSid)?.delete(name);
		let pending;
		const acknowledgement = new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				console.warn(`[MediaStream] Playback mark timed out; continuing stream=${streamSid}`);
				pending.settle();
			}, Math.max(1, audioDurationMs + PLAYBACK_MARK_TIMEOUT_GRACE_MS));
			timeout.unref?.();
			const onAbort = () => {
				const reason = signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Telephony playback mark wait aborted");
				pending.settle(reason, true);
			};
			pending = { settle: (error, ignoreLateAck = false) => {
				if (marks.get(name) !== pending) return;
				clearTimeout(timeout);
				signal.removeEventListener("abort", onAbort);
				marks.delete(name);
				if (marks.size === 0) this.pendingPlaybackMarks.delete(streamSid);
				if (ignoreLateAck) this.ignorePlaybackMark(streamSid, name);
				if (error) reject(error);
				else resolve();
			} };
			marks.set(name, pending);
			signal.addEventListener("abort", onAbort, { once: true });
		});
		if (!this.sendMark(streamSid, name).sent) pending.settle(/* @__PURE__ */ new Error("Telephony stream playback failed: completion mark not delivered"));
		return acknowledgement;
	}
	/**
	* Clear audio buffer (interrupt playback).
	*/
	clearAudio(streamSid) {
		this.invalidatePlaybackMarks(streamSid);
		return this.sendToStream(streamSid, {
			event: "clear",
			streamSid
		});
	}
	/**
	* Queue a TTS operation for sequential playback.
	* Only one TTS operation plays at a time per stream to prevent overlap.
	*/
	async queueTts(streamSid, playFn) {
		const queue = this.getTtsQueue(streamSid);
		if (queue.length >= MAX_PENDING_TTS_OPERATIONS_PER_STREAM) throw new Error(`Telephony TTS queue is full for stream; maxPending=${MAX_PENDING_TTS_OPERATIONS_PER_STREAM}`);
		let resolveEntry;
		let rejectEntry;
		const promise = new Promise((resolve, reject) => {
			resolveEntry = resolve;
			rejectEntry = reject;
		});
		queue.push({
			playFn,
			controller: new AbortController(),
			resolve: resolveEntry,
			reject: rejectEntry
		});
		if (!this.ttsPlaying.get(streamSid)) this.processQueue(streamSid);
		return promise;
	}
	/**
	* Clear TTS queue and interrupt current playback (barge-in).
	*/
	clearTtsQueue(streamSid, _reason = "unspecified") {
		const queue = this.ttsQueues.get(streamSid);
		if (queue) this.resolveQueuedTtsEntries(queue);
		this.ttsActiveControllers.get(streamSid)?.abort();
		const session = this.sessions.get(streamSid);
		if (session?.talk.activeTurnId) {
			const cancelled = session.talk.cancelTurn({ payload: {
				callId: session.callId,
				streamSid,
				reason: _reason
			} });
			if (cancelled.ok) this.config.onTalkEvent?.(session.callId, session.streamSid, cancelled.event);
		}
		this.clearAudio(streamSid);
	}
	getTtsQueue(streamSid) {
		const existing = this.ttsQueues.get(streamSid);
		if (existing) return existing;
		const queue = [];
		this.ttsQueues.set(streamSid, queue);
		return queue;
	}
	getPendingPlaybackMarks(streamSid) {
		const existing = this.pendingPlaybackMarks.get(streamSid);
		if (existing) return existing;
		const marks = /* @__PURE__ */ new Map();
		this.pendingPlaybackMarks.set(streamSid, marks);
		return marks;
	}
	acknowledgePlaybackMark(streamSid, name) {
		const ignored = this.ignoredPlaybackMarks.get(streamSid);
		if (ignored?.delete(name)) {
			if (ignored.size === 0) this.ignoredPlaybackMarks.delete(streamSid);
			return;
		}
		this.pendingPlaybackMarks.get(streamSid)?.get(name)?.settle();
	}
	invalidatePlaybackMarks(streamSid) {
		const marks = this.pendingPlaybackMarks.get(streamSid);
		if (!marks) return;
		for (const pending of marks.values()) pending.settle(/* @__PURE__ */ new Error("Telephony playback cleared before completion"), true);
	}
	ignorePlaybackMark(streamSid, name) {
		const ignored = this.ignoredPlaybackMarks.get(streamSid) ?? /* @__PURE__ */ new Set();
		ignored.add(name);
		while (ignored.size > MAX_IGNORED_PLAYBACK_MARKS_PER_STREAM) {
			const oldest = ignored.values().next().value;
			if (oldest === void 0) break;
			ignored.delete(oldest);
		}
		this.ignoredPlaybackMarks.set(streamSid, ignored);
	}
	/**
	* Process the TTS queue for a stream.
	* Uses iterative approach to avoid stack accumulation from recursion.
	*/
	async processQueue(streamSid) {
		this.ttsPlaying.set(streamSid, true);
		while (true) {
			const queue = this.ttsQueues.get(streamSid);
			if (!queue || queue.length === 0) {
				this.ttsPlaying.delete(streamSid);
				this.ttsActiveControllers.delete(streamSid);
				this.ttsQueues.delete(streamSid);
				return;
			}
			const entry = queue.shift();
			this.ttsActiveControllers.set(streamSid, entry.controller);
			const session = this.sessions.get(streamSid);
			let playbackTurnId;
			try {
				if (session) {
					playbackTurnId = this.ensureActiveTurn(session);
					this.emitTalkEvent(session, {
						type: "output.audio.started",
						turnId: playbackTurnId,
						payload: {
							callId: session.callId,
							streamSid
						}
					});
				}
				await entry.playFn(entry.controller.signal);
				if (entry.controller.signal.aborted) {
					entry.resolve();
					continue;
				}
				if (session) {
					const turnId = playbackTurnId ?? this.ensureActiveTurn(session);
					this.emitTalkEvent(session, {
						type: "output.audio.done",
						turnId,
						final: true,
						payload: {
							callId: session.callId,
							streamSid
						}
					});
					if (session.talk.activeTurnId) {
						const ended = session.talk.endTurn({ payload: {
							callId: session.callId,
							streamSid
						} });
						if (ended.ok) this.config.onTalkEvent?.(session.callId, session.streamSid, ended.event);
					}
				}
				entry.resolve();
			} catch (error) {
				if (entry.controller.signal.aborted) entry.resolve();
				else {
					console.error("[MediaStream] TTS playback error:", error);
					entry.reject(error);
				}
			} finally {
				if (this.ttsActiveControllers.get(streamSid) === entry.controller) this.ttsActiveControllers.delete(streamSid);
			}
		}
	}
	createTalkEvents(callId, streamSid) {
		return createTalkSessionController({
			sessionId: `voice-call:${callId}:${streamSid}`,
			mode: "stt-tts",
			transport: "gateway-relay",
			brain: "agent-consult",
			provider: this.config.transcriptionProvider.id,
			turnIdPrefix: `${streamSid}:turn`
		}, { onEvent: recordTalkObservabilityEvent });
	}
	emitTalkEvent(session, input) {
		const event = session.talk.emit(input);
		this.config.onTalkEvent?.(session.callId, session.streamSid, event);
	}
	ensureActiveTurn(session) {
		const turn = session.talk.ensureTurn({ payload: {
			callId: session.callId,
			streamSid: session.streamSid
		} });
		if (turn.event) this.config.onTalkEvent?.(session.callId, session.streamSid, turn.event);
		return turn.turnId;
	}
	clearTtsState(streamSid) {
		const queue = this.ttsQueues.get(streamSid);
		if (queue) this.resolveQueuedTtsEntries(queue);
		this.ttsActiveControllers.get(streamSid)?.abort();
		this.ttsActiveControllers.delete(streamSid);
		this.ttsPlaying.delete(streamSid);
		this.ttsQueues.delete(streamSid);
		this.invalidatePlaybackMarks(streamSid);
		this.ignoredPlaybackMarks.delete(streamSid);
	}
	resolveQueuedTtsEntries(queue) {
		const pending = queue.splice(0);
		for (const entry of pending) {
			entry.controller.abort();
			entry.resolve();
		}
	}
};
//#endregion
//#region extensions/voice-call/src/providers/shared/call-status.ts
const TERMINAL_PROVIDER_STATUS_TO_END_REASON = {
	completed: "completed",
	failed: "failed",
	busy: "busy",
	"no-answer": "no-answer",
	canceled: "hangup-bot"
};
/** Normalize provider status text, falling back to "unknown". */
function normalizeProviderStatus(status) {
	const normalized = normalizeOptionalLowercaseString(status);
	return normalized && normalized.length > 0 ? normalized : "unknown";
}
/** Map terminal provider status strings to OpenClaw end reasons. */
function mapProviderStatusToEndReason(status) {
	const normalized = normalizeProviderStatus(status);
	return Object.hasOwn(TERMINAL_PROVIDER_STATUS_TO_END_REASON, normalized) ? TERMINAL_PROVIDER_STATUS_TO_END_REASON[normalized] ?? null : null;
}
/** Return true when a provider status is terminal. */
function isProviderStatusTerminal(status) {
	return mapProviderStatusToEndReason(status) !== null;
}
//#endregion
//#region extensions/voice-call/src/proxy-ip.ts
function normalizeProxyIp(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	const normalized = (trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed).toLowerCase();
	if (normalized.startsWith("::ffff:")) {
		const mappedIpv4 = normalized.slice(7);
		if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(mappedIpv4)) return mappedIpv4;
	}
	return normalized;
}
//#endregion
//#region extensions/voice-call/src/webhook/stale-call-reaper.ts
const CHECK_INTERVAL_MS = 3e4;
/** States that indicate a live conversation with speech/transcription.
* Inbound Twilio calls may never fire a call.answered event, so answeredAt
* can be absent even while the call is actively transcribing. These states
* prove the call is live and should not be reaped. */
const LiveConversationStates = /* @__PURE__ */ new Set(["speaking", "listening"]);
/** Start a stale-call reaper and return its cleanup callback. */
function startStaleCallReaper(params) {
	const maxAgeSeconds = params.staleCallReaperSeconds;
	if (!maxAgeSeconds || maxAgeSeconds <= 0) return null;
	const maxAgeMs = maxAgeSeconds * 1e3;
	const callsBeingReaped = /* @__PURE__ */ new Set();
	const interval = setInterval(() => {
		const now = Date.now();
		for (const call of params.manager.getActiveCalls()) {
			if (call.answeredAt || TerminalStates.has(call.state) || LiveConversationStates.has(call.state)) continue;
			const age = now - call.startedAt;
			if (age > maxAgeMs && !callsBeingReaped.has(call.callId)) {
				callsBeingReaped.add(call.callId);
				console.log(`[voice-call] Reaping stale call ${call.callId} (age: ${Math.round(age / 1e3)}s, state: ${call.state})`);
				params.manager.endCall(call.callId).then((result) => {
					if (!result.success) console.warn(`[voice-call] Reaper failed to end call ${call.callId}: ${result.error ?? "unknown error"}`);
				}).catch((err) => {
					console.warn(`[voice-call] Reaper failed to end call ${call.callId}:`, err);
				}).finally(() => {
					callsBeingReaped.delete(call.callId);
				});
			}
		}
	}, CHECK_INTERVAL_MS);
	return () => {
		clearInterval(interval);
	};
}
//#endregion
//#region extensions/voice-call/src/webhook/stream-disconnect-grace.ts
const STREAM_DISCONNECT_GRACE_MS = 2e3;
/** Track the current carrier stream and expire disconnected calls after reconnect grace. */
var StreamDisconnectGrace = class {
	constructor(onGraceExpired) {
		this.onGraceExpired = onGraceExpired;
		this.streams = /* @__PURE__ */ new Map();
	}
	connect(providerCallId, streamId) {
		const current = this.streams.get(providerCallId);
		if (current?.disconnectTimer) clearTimeout(current.disconnectTimer);
		this.streams.set(providerCallId, { streamId });
	}
	disconnect(providerCallId, streamId) {
		const current = this.streams.get(providerCallId);
		if (!current || current.streamId !== streamId || current.disconnectTimer) return;
		const disconnectTimer = setTimeout(() => {
			if (this.streams.get(providerCallId)?.disconnectTimer !== disconnectTimer) return;
			this.streams.delete(providerCallId);
			this.onGraceExpired({
				providerCallId,
				streamId
			});
		}, STREAM_DISCONNECT_GRACE_MS);
		disconnectTimer.unref?.();
		current.disconnectTimer = disconnectTimer;
	}
	retire(providerCallId, streamId) {
		const current = this.streams.get(providerCallId);
		if (!current || current.streamId !== streamId) return;
		if (current.disconnectTimer) clearTimeout(current.disconnectTimer);
		this.streams.delete(providerCallId);
	}
	close() {
		for (const state of this.streams.values()) if (state.disconnectTimer) clearTimeout(state.disconnectTimer);
		this.streams.clear();
	}
};
//#endregion
//#region extensions/voice-call/src/webhook.ts
const MAX_WEBHOOK_BODY_BYTES = WEBHOOK_BODY_READ_DEFAULTS.preAuth.maxBytes;
const WEBHOOK_BODY_TIMEOUT_MS = WEBHOOK_BODY_READ_DEFAULTS.preAuth.timeoutMs;
const MISSING_REMOTE_ADDRESS_IN_FLIGHT_KEY = "__voice_call_no_remote__";
const loadRealtimeTranscriptionRuntime = createLazyRuntimeModule(() => import("./realtime-transcription.runtime-CbJAs5t_.mjs"));
const loadResponseGeneratorModule = createLazyRuntimeModule(() => import("./response-generator-hZyGIjO4.mjs"));
function appendRecentTalkEventMetadata(metadata, event) {
	const previous = metadata ?? {};
	const recent = Array.isArray(previous.recentTalkEvents) ? previous.recentTalkEvents.filter((entry) => Boolean(entry) && typeof entry === "object" && !Array.isArray(entry)) : [];
	recent.push({
		at: event.timestamp,
		type: event.type,
		sessionId: event.sessionId,
		turnId: event.turnId
	});
	return {
		...previous,
		lastTalkEventAt: event.timestamp,
		lastTalkEventType: event.type,
		recentTalkEvents: recent.slice(-10)
	};
}
function buildRequestUrl(requestUrl) {
	return new URL$1(requestUrl ?? "/", "http://localhost");
}
function resolveForwardedClientIp(request, trustedProxyIPs) {
	const normalizedTrustedProxyIps = new Set(trustedProxyIPs.map((ip) => normalizeProxyIp(ip)).filter((ip) => Boolean(ip)));
	const forwardedFor = getHeader(request.headers, "x-forwarded-for");
	if (forwardedFor) {
		const forwardedIps = normalizeStringEntries(forwardedFor.split(","));
		if (forwardedIps.length > 0) {
			if (normalizedTrustedProxyIps.size === 0) return forwardedIps[0];
			for (let index = forwardedIps.length - 1; index >= 0; index -= 1) {
				const hop = forwardedIps[index];
				if (!normalizedTrustedProxyIps.has(normalizeProxyIp(hop) ?? "")) return hop;
			}
			return forwardedIps[0];
		}
	}
	return getHeader(request.headers, "x-real-ip")?.trim() || void 0;
}
function normalizeWebhookResponse(parsed) {
	return {
		statusCode: parsed.statusCode ?? 200,
		headers: parsed.providerResponseHeaders,
		body: parsed.providerResponseBody ?? "OK"
	};
}
function buildRealtimeRejectedTwiML() {
	return {
		statusCode: 200,
		headers: { "Content-Type": "text/xml" },
		body: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Reject reason=\"rejected\" /></Response>"
	};
}
function buildTwilioReplayTwiML() {
	return {
		statusCode: 200,
		headers: { "Content-Type": "text/xml" },
		body: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>"
	};
}
const WEBHOOK_REPLAY_RESPONSE_TTL_MS = 6e5;
const WEBHOOK_REPLAY_RESPONSE_MAX_ENTRIES = 1e4;
const WEBHOOK_REPLAY_RESPONSE_PRUNE_INTERVAL = 64;
function cloneWebhookResponsePayload(payload) {
	return {
		statusCode: payload.statusCode,
		headers: payload.headers ? { ...payload.headers } : void 0,
		body: payload.body
	};
}
/**
* HTTP server for receiving voice call webhooks from providers.
* Supports WebSocket upgrades for media streams when streaming is enabled.
*/
var VoiceCallWebhookServer = class {
	constructor(config, manager, provider, coreConfig, fullConfig, agentRuntime, logger) {
		this.server = null;
		this.listeningUrl = null;
		this.startPromise = null;
		this.stopPromise = null;
		this.stopStaleCallReaper = null;
		this.webhookInFlightLimiter = createWebhookInFlightLimiter();
		this.mediaStreamHandler = null;
		this.streamSpeechGenerations = /* @__PURE__ */ new WeakMap();
		this.realtimeHandler = null;
		this.replayResponses = /* @__PURE__ */ new Map();
		this.replayResponseCacheCalls = 0;
		this.config = normalizeVoiceCallConfig(config);
		this.manager = manager;
		this.provider = provider;
		this.coreConfig = coreConfig ?? null;
		this.fullConfig = fullConfig ?? null;
		this.agentRuntime = agentRuntime ?? null;
		this.logger = logger ?? {
			info: console.log,
			warn: console.warn,
			error: console.error,
			debug: console.debug
		};
		const rawLogger = this.logger;
		const rawDebug = rawLogger.debug;
		this.logger = {
			info: (msg) => rawLogger.info(`[voice-call] ${msg}`),
			warn: (msg) => rawLogger.warn(`[voice-call] ${msg}`),
			error: (msg) => rawLogger.error(`[voice-call] ${msg}`),
			debug: rawDebug ? (msg) => rawDebug(`[voice-call] ${msg}`) : void 0
		};
		this.streamDisconnectGrace = new StreamDisconnectGrace(({ providerCallId }) => {
			const call = this.manager.getCallByProviderCallId(providerCallId);
			if (!call) return;
			this.logger.info(`Call finalization requested reason=stream-disconnect-grace-expired callId=${call.callId} providerCallId=${providerCallId}`);
			this.manager.endCall(call.callId).then((result) => {
				if (!result.success) this.logger.warn(`Failed to auto-end call ${call.callId}: ${result.error ?? "unknown error"}`);
			}).catch((err) => {
				this.logger.warn(`Failed to auto-end call ${call.callId}: ${String(err)}`);
			});
		});
	}
	/**
	* Get the media stream handler (for wiring to provider).
	*/
	getMediaStreamHandler() {
		return this.mediaStreamHandler;
	}
	getRealtimeHandler() {
		return this.realtimeHandler;
	}
	speakRealtime(callId, instructions) {
		if (!this.realtimeHandler) return {
			success: false,
			error: "Realtime voice handler is not configured"
		};
		return this.realtimeHandler.speak(callId, instructions);
	}
	setRealtimeHandler(handler) {
		this.realtimeHandler = handler;
	}
	getStreamDisconnectLifecycle() {
		return this.streamDisconnectGrace;
	}
	resolveMediaStreamClientIp(request) {
		const remoteIp = request.socket.remoteAddress ?? void 0;
		const trustedProxyIPs = this.config.webhookSecurity.trustedProxyIPs.filter(Boolean);
		const normalizedTrustedProxyIps = new Set(trustedProxyIPs.map((ip) => normalizeProxyIp(ip)).filter((ip) => Boolean(ip)));
		const normalizedRemoteIp = normalizeProxyIp(remoteIp);
		const fromTrustedProxy = normalizedTrustedProxyIps.size > 0 && normalizedRemoteIp !== void 0 && normalizedTrustedProxyIps.has(normalizedRemoteIp);
		if (this.config.webhookSecurity.trustForwardingHeaders && fromTrustedProxy) {
			const forwardedIp = resolveForwardedClientIp(request, trustedProxyIPs);
			if (forwardedIp) return forwardedIp;
		}
		return remoteIp;
	}
	shouldSuppressBargeInForInitialMessage(call) {
		if (!call || call.direction !== "outbound") return false;
		if (call.state !== "speaking") return false;
		if ((call.metadata?.mode ?? "conversation") !== "conversation") return false;
		return (normalizeOptionalString(call.metadata?.initialMessage) ?? "").length > 0;
	}
	getCurrentStream(providerCallId, streamSid) {
		if (this.provider.name !== "twilio") return;
		const provider = this.provider;
		const call = this.manager.getCallByProviderCallId(providerCallId);
		return call && provider.hasRegisteredStream(providerCallId, streamSid) ? {
			call,
			provider
		} : void 0;
	}
	interruptStreamReply(providerCallId, streamSid) {
		const current = this.getCurrentStream(providerCallId, streamSid);
		if (!current || this.shouldSuppressBargeInForInitialMessage(current.call)) return;
		const generation = Symbol("stream speech");
		this.streamSpeechGenerations.set(current.call, generation);
		this.manager.invalidateAutoResponse(current.call);
		current.provider.clearTtsQueue(providerCallId);
		return generation;
	}
	/**
	* Initialize media streaming with the selected realtime transcription provider.
	*/
	async initializeMediaStreaming() {
		const streaming = this.config.streaming;
		const pluginConfig = this.fullConfig ?? this.coreConfig;
		const { getRealtimeTranscriptionProvider, listRealtimeTranscriptionProviders } = await loadRealtimeTranscriptionRuntime();
		const resolution = resolveConfiguredCapabilityProvider({
			configuredProviderId: streaming.provider,
			providerConfigs: streaming.providers,
			cfg: pluginConfig,
			cfgForResolve: pluginConfig ?? {},
			getConfiguredProvider: (providerId) => getRealtimeTranscriptionProvider(providerId, pluginConfig),
			listProviders: () => listRealtimeTranscriptionProviders(pluginConfig, Object.keys(streaming.providers)),
			resolveProviderConfig: ({ provider, cfg, rawConfig }) => provider.resolveConfig?.({
				cfg,
				rawConfig
			}) ?? rawConfig,
			isProviderConfigured: ({ provider, cfg, providerConfig }) => provider.isConfigured({
				cfg,
				providerConfig
			})
		});
		if (!resolution.ok && resolution.code === "missing-configured-provider") {
			this.logger.warn(`Streaming enabled but realtime transcription provider "${resolution.configuredProviderId}" is not registered`);
			return;
		}
		if (!resolution.ok && resolution.code === "no-registered-provider") {
			this.logger.warn("Streaming enabled but no realtime transcription provider is registered");
			return;
		}
		if (!resolution.ok) {
			this.logger.warn(`Streaming enabled but provider "${resolution.provider?.id}" is not configured`);
			return;
		}
		const streamConfig = {
			transcriptionProvider: resolution.provider,
			providerConfig: resolution.providerConfig,
			cfg: this.fullConfig ?? this.coreConfig ?? void 0,
			preStartTimeoutMs: streaming.preStartTimeoutMs,
			maxPendingConnections: streaming.maxPendingConnections,
			maxPendingConnectionsPerIp: streaming.maxPendingConnectionsPerIp,
			maxConnections: streaming.maxConnections,
			resolveClientIp: (request) => this.resolveMediaStreamClientIp(request),
			shouldAcceptStream: ({ callId, token }) => {
				if (this.provider.name !== "twilio") {
					this.logger.warn(`Rejecting media stream: provider ${this.provider.name} does not support authenticated classic streaming`);
					return false;
				}
				if (!this.manager.getCallByProviderCallId(callId)) return false;
				if (!this.provider.isValidStreamToken(callId, token)) {
					this.logger.warn(`Rejecting media stream: invalid token for ${callId}`);
					return false;
				}
				return true;
			},
			onTranscript: (providerCallId, transcript, streamSid) => {
				this.logger.info(`Transcript received ${providerCallId} chars=${transcript.length}`);
				const current = this.getCurrentStream(providerCallId, streamSid);
				if (!current) {
					this.logger.info(`Ignoring transcript from inactive stream ${streamSid} (${providerCallId})`);
					return;
				}
				const { call } = current;
				if (this.shouldSuppressBargeInForInitialMessage(call)) {
					this.logger.info(`Ignoring barge transcript while initial message is still playing (${providerCallId})`);
					return;
				}
				const generation = this.interruptStreamReply(providerCallId, streamSid);
				const event = {
					id: `stream-transcript-${Date.now()}`,
					type: "call.speech",
					callId: call.callId,
					providerCallId,
					timestamp: Date.now(),
					transcript,
					isFinal: true
				};
				this.processEventWithAutoResponse(event, () => this.streamSpeechGenerations.get(call) === generation && this.getCurrentStream(providerCallId, streamSid)?.call === call).catch((err) => {
					this.logger.error(`Error processing stream transcript: ${String(err)}`);
				});
			},
			onSpeechStart: (providerCallId, streamSid) => this.interruptStreamReply(providerCallId, streamSid),
			onPartialTranscript: (callId, partial, streamSid) => {
				this.logger.info(`Partial transcript ${callId} chars=${partial.length}`);
				this.interruptStreamReply(callId, streamSid);
			},
			onTalkEvent: (providerCallId, streamSid, event) => {
				const current = this.getCurrentStream(providerCallId, streamSid);
				if (current) this.manager.updateCallMetadata(current.call, (metadata) => this.getCurrentStream(providerCallId, streamSid) ? appendRecentTalkEventMetadata(metadata, event) : metadata).catch((error) => {
					this.logger.warn(`Failed to update stream call metadata: ${String(error)}`);
				});
			},
			onConnect: (callId, streamSid) => {
				this.logger.info(`Media stream connected: ${callId} -> ${streamSid}`);
				this.streamDisconnectGrace.connect(callId, streamSid);
				const call = this.manager.getCallByProviderCallId(callId);
				if (call) this.manager.invalidateAutoResponse(call);
				if (this.provider.name === "twilio") this.provider.registerCallStream(callId, streamSid);
			},
			onTranscriptionReady: (callId, streamSid) => {
				if (!this.getCurrentStream(callId, streamSid)) return;
				this.manager.speakInitialMessage(callId).catch((err) => {
					this.logger.warn(`Failed to speak initial message: ${String(err)}`);
				});
			},
			onDisconnect: (callId, streamSid) => {
				this.logger.info(`Media stream disconnected: ${callId} (${streamSid})`);
				if (this.provider.name === "twilio") {
					const twilio = this.provider;
					twilio.unregisterCallStream(callId, streamSid);
					const call = this.manager.getCallByProviderCallId(callId);
					if (call && !twilio.hasRegisteredStream(callId)) this.manager.invalidateAutoResponse(call);
				}
				this.streamDisconnectGrace.disconnect(callId, streamSid);
			}
		};
		this.mediaStreamHandler = new MediaStreamHandler(streamConfig);
		this.logger.info("Media streaming initialized");
	}
	/**
	* Start the webhook server.
	* Idempotent: returns immediately if the server is already listening.
	*/
	async start() {
		if (this.stopPromise) await this.stopPromise;
		const { port, bind, path: webhookPath } = this.config.serve;
		const streamPath = this.config.streaming.streamPath;
		if (this.server?.listening) return this.listeningUrl ?? this.resolveListeningUrl(bind, webhookPath);
		if (this.config.streaming.enabled && !this.mediaStreamHandler) await this.initializeMediaStreaming();
		if (this.startPromise) return this.startPromise;
		this.startPromise = new Promise((resolve, reject) => {
			this.server = http.createServer((req, res) => {
				this.handleRequest(req, res, webhookPath).catch((err) => {
					this.logger.error(`Webhook error: ${String(err)}`);
					res.statusCode = 500;
					res.end("Internal Server Error");
				});
			});
			if (this.realtimeHandler || this.mediaStreamHandler) this.server.on("upgrade", (request, socket, head) => {
				if (this.realtimeHandler && this.isRealtimeWebSocketUpgrade(request)) {
					this.realtimeHandler.handleWebSocketUpgrade(request, socket, head);
					return;
				}
				if (this.getUpgradePathname(request) === streamPath && this.mediaStreamHandler) this.mediaStreamHandler?.handleUpgrade(request, socket, head);
				else {
					socket.once("error", () => {});
					rejectWebSocketUpgrade(socket, { status: 404 });
				}
			});
			this.server.on("error", (err) => {
				this.server = null;
				this.listeningUrl = null;
				this.startPromise = null;
				reject(err);
			});
			this.server.listen(port, bind, () => {
				const url = this.resolveListeningUrl(bind, webhookPath);
				this.listeningUrl = url;
				this.startPromise = null;
				this.logger.info(`Webhook server listening on ${url}`);
				if (this.mediaStreamHandler) {
					const address = this.server?.address();
					const actualPort = address && typeof address === "object" ? address.port : this.config.serve.port;
					this.logger.info(`Media stream WebSocket on ws://${bind}:${actualPort}${streamPath}`);
				}
				resolve(url);
				this.stopStaleCallReaper = startStaleCallReaper({
					manager: this.manager,
					staleCallReaperSeconds: this.config.staleCallReaperSeconds
				});
			});
		});
		return this.startPromise;
	}
	/**
	* Stop the webhook server.
	*/
	stop() {
		if (this.stopPromise) return this.stopPromise;
		const server = this.server;
		const serverClosePromise = new Promise((resolve, reject) => {
			if (!server) {
				resolve();
				return;
			}
			server.close((error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
		this.startPromise = null;
		this.streamDisconnectGrace.close();
		if (this.stopStaleCallReaper) {
			this.stopStaleCallReaper();
			this.stopStaleCallReaper = null;
		}
		this.webhookInFlightLimiter.clear();
		this.stopPromise = (async () => {
			const results = await Promise.allSettled([
				serverClosePromise,
				this.mediaStreamHandler?.close(serverClosePromise) ?? Promise.resolve(),
				this.realtimeHandler?.close(serverClosePromise) ?? Promise.resolve()
			]);
			this.streamDisconnectGrace.close();
			if (this.server === server) this.server = null;
			this.listeningUrl = null;
			const failure = results.find((result) => result.status === "rejected");
			if (failure) throw failure.reason;
		})().finally(() => {
			this.stopPromise = null;
		});
		return this.stopPromise;
	}
	resolveListeningUrl(bind, webhookPath) {
		const address = this.server?.address();
		if (address && typeof address === "object") {
			const host = address.address && address.address.length > 0 ? address.address : bind;
			return `http://${host.includes(":") && !host.startsWith("[") ? `[${host}]` : host}:${address.port}${webhookPath}`;
		}
		return `http://${bind}:${this.config.serve.port}${webhookPath}`;
	}
	getUpgradePathname(request) {
		try {
			return buildRequestUrl(request.url).pathname;
		} catch {
			return null;
		}
	}
	isWebhookPathMatch(requestPath, configuredPath) {
		return normalizeWebhookPath(requestPath) === normalizeWebhookPath(configuredPath);
	}
	/**
	* Handle incoming HTTP request.
	*/
	async handleRequest(req, res, webhookPath) {
		const payload = await this.runWebhookPipeline(req, webhookPath, res);
		if (payload) this.writeWebhookResponse(res, payload);
	}
	async runWebhookPipeline(req, webhookPath, res) {
		const url = buildRequestUrl(req.url);
		if (url.pathname === "/voice/hold-music") return {
			statusCode: 200,
			headers: { "Content-Type": "text/xml" },
			body: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">All agents are currently busy. Please hold.</Say>
  <Play loop="0">https://s3.amazonaws.com/com.twilio.music.classical/BusyStrings.mp3</Play>
</Response>`
		};
		if (!this.isWebhookPathMatch(url.pathname, webhookPath)) return {
			statusCode: 404,
			body: "Not Found"
		};
		if (req.method !== "POST") return {
			statusCode: 405,
			body: "Method Not Allowed"
		};
		const headerGate = this.verifyPreAuthWebhookHeaders(req.headers);
		if (!headerGate.ok) {
			this.logger.warn(`Webhook rejected before body read: ${headerGate.reason}`);
			return {
				statusCode: 401,
				body: "Unauthorized"
			};
		}
		const remoteAddress = req.socket.remoteAddress;
		if (!remoteAddress) this.logger.warn(`Webhook accepted with no remote address; using shared fallback in-flight key`);
		const inFlightKey = remoteAddress || MISSING_REMOTE_ADDRESS_IN_FLIGHT_KEY;
		if (!this.webhookInFlightLimiter.tryAcquire(inFlightKey)) {
			this.logger.warn(`Webhook rejected before body read: too many in-flight requests`);
			return {
				statusCode: 429,
				body: "Too Many Requests"
			};
		}
		try {
			let body = "";
			try {
				body = await this.readBody(req, MAX_WEBHOOK_BODY_BYTES, WEBHOOK_BODY_TIMEOUT_MS);
			} catch (err) {
				if (isRequestBodyLimitError(err, "PAYLOAD_TOO_LARGE")) {
					await sendHttpRequestRejection(req, res, 413, "Payload Too Large");
					return null;
				}
				if (isRequestBodyLimitError(err, "REQUEST_BODY_TIMEOUT")) {
					await sendHttpRequestRejection(req, res, 408, requestBodyErrorToText("REQUEST_BODY_TIMEOUT"));
					return null;
				}
				throw err;
			}
			const ctx = {
				headers: req.headers,
				rawBody: body,
				url: url.toString(),
				method: "POST",
				query: Object.fromEntries(url.searchParams),
				remoteAddress: req.socket.remoteAddress ?? void 0
			};
			const verification = this.provider.verifyWebhook(ctx);
			if (!verification.ok) {
				this.logger.warn(`Webhook verification failed: ${verification.reason}`);
				return {
					statusCode: 401,
					body: "Unauthorized"
				};
			}
			if (!verification.verifiedRequestKey) {
				this.logger.warn("Webhook verification succeeded without request identity key");
				return {
					statusCode: 401,
					body: "Unauthorized"
				};
			}
			const isReplay = Boolean(verification.isReplay);
			if (isReplay) {
				this.logger.warn("Replay detected; skipping event side effects");
				const cachedResponse = await this.getCachedReplayResponse(verification.verifiedRequestKey);
				if (cachedResponse) return cachedResponse;
				if (this.provider.name === "twilio") return buildTwilioReplayTwiML();
			}
			const buildResponse = async () => {
				const initialTwiML = this.provider.consumeInitialTwiML?.(ctx);
				if (initialTwiML !== void 0 && initialTwiML !== null) {
					const params = new URLSearchParams(ctx.rawBody);
					this.logger.info(`Serving provider initial TwiML before realtime handling (callSid=${params.get("CallSid") ?? "unknown"}, direction=${params.get("Direction") ?? "unknown"})`);
					return {
						statusCode: 200,
						headers: { "Content-Type": "application/xml" },
						body: initialTwiML
					};
				}
				const realtimeParams = this.getRealtimeTwimlParams(ctx);
				if (realtimeParams) {
					const direction = realtimeParams.get("Direction");
					if ((!direction || direction === "inbound") && !this.shouldAcceptRealtimeInboundRequest(realtimeParams)) {
						this.logger.info("Realtime inbound call rejected before stream setup");
						return buildRealtimeRejectedTwiML();
					}
					this.logger.info(`Serving realtime TwiML for Twilio call ${realtimeParams.get("CallSid") ?? "unknown"} (direction=${direction ?? "unknown"})`);
					return this.realtimeHandler.buildTwiMLPayload(req, realtimeParams);
				}
				const parsed = this.provider.parseWebhookEvent(ctx, { verifiedRequestKey: verification.verifiedRequestKey });
				if (!isReplay && await this.processParsedEvents(parsed.events)) verification.releaseReplay?.();
				return normalizeWebhookResponse(parsed);
			};
			if (isReplay) return await buildResponse();
			return await this.cacheReplayResponse(verification.verifiedRequestKey, buildResponse, verification.releaseReplay);
		} finally {
			this.webhookInFlightLimiter.release(inFlightKey);
		}
	}
	pruneReplayResponses(rawNow) {
		const now = asDateTimestampMs(rawNow);
		if (now !== void 0) {
			for (const [key, entry] of this.replayResponses) if (entry.expiresAt <= now) this.replayResponses.delete(key);
		}
		while (this.replayResponses.size > WEBHOOK_REPLAY_RESPONSE_MAX_ENTRIES) {
			const oldest = this.replayResponses.keys().next().value;
			if (!oldest) break;
			this.replayResponses.delete(oldest);
		}
	}
	async getCachedReplayResponse(key) {
		const now = asDateTimestampMs(Date.now());
		const entry = this.replayResponses.get(key);
		if (!entry || now === void 0) return null;
		if (entry.expiresAt <= now) {
			this.replayResponses.delete(key);
			return null;
		}
		return cloneWebhookResponsePayload(await entry.response);
	}
	async cacheReplayResponse(key, buildResponse, releaseReplay) {
		const now = Date.now();
		const expiresAt = resolveExpiresAtMsFromDurationMs(WEBHOOK_REPLAY_RESPONSE_TTL_MS, { nowMs: now });
		this.replayResponseCacheCalls += 1;
		if (this.replayResponseCacheCalls % WEBHOOK_REPLAY_RESPONSE_PRUNE_INTERVAL === 0) this.pruneReplayResponses(now);
		let cachedEntry;
		const ownerResponse = buildResponse().then(cloneWebhookResponsePayload).catch((err) => {
			if (cachedEntry && this.replayResponses.get(key) === cachedEntry) this.replayResponses.delete(key);
			releaseReplay?.();
			throw err;
		});
		const response = ownerResponse.then((payload) => this.provider.name === "twilio" ? buildTwilioReplayTwiML() : cloneWebhookResponsePayload(payload));
		response.catch(() => {});
		if (expiresAt !== void 0) {
			cachedEntry = {
				expiresAt,
				response
			};
			this.replayResponses.set(key, cachedEntry);
		}
		if (this.replayResponses.size > WEBHOOK_REPLAY_RESPONSE_MAX_ENTRIES) this.pruneReplayResponses(now);
		return cloneWebhookResponsePayload(await ownerResponse);
	}
	verifyPreAuthWebhookHeaders(headers) {
		if (this.config.skipSignatureVerification) return { ok: true };
		switch (this.provider.name) {
			case "telnyx": {
				const signature = getHeader(headers, "telnyx-signature-ed25519");
				const timestamp = getHeader(headers, "telnyx-timestamp");
				if (signature && timestamp) return { ok: true };
				return {
					ok: false,
					reason: "missing Telnyx signature or timestamp header"
				};
			}
			case "twilio":
				if (getHeader(headers, "x-twilio-signature")) return { ok: true };
				return {
					ok: false,
					reason: "missing X-Twilio-Signature header"
				};
			case "plivo": {
				const hasV3 = Boolean(getHeader(headers, "x-plivo-signature-v3")) && Boolean(getHeader(headers, "x-plivo-signature-v3-nonce"));
				const hasV2 = Boolean(getHeader(headers, "x-plivo-signature-v2")) && Boolean(getHeader(headers, "x-plivo-signature-v2-nonce"));
				if (hasV3 || hasV2) return { ok: true };
				return {
					ok: false,
					reason: "missing Plivo signature headers"
				};
			}
			default: return { ok: true };
		}
	}
	isRealtimeWebSocketUpgrade(req) {
		try {
			const pathname = buildRequestUrl(req.url).pathname;
			const pattern = this.realtimeHandler?.getStreamPathPattern();
			if (!pattern) return false;
			const normalizedPattern = normalizeWebhookPath(pattern);
			const normalizedPathname = normalizeWebhookPath(pathname);
			if (normalizedPattern === "/") return true;
			return normalizedPathname === normalizedPattern || normalizedPathname.startsWith(`${normalizedPattern}/`);
		} catch {
			return false;
		}
	}
	getRealtimeTwimlParams(ctx) {
		if (!this.realtimeHandler || this.provider.name !== "twilio") return null;
		const params = new URLSearchParams(ctx.rawBody);
		const direction = params.get("Direction");
		if (!(!direction || direction === "inbound" || direction.startsWith("outbound"))) return null;
		if (ctx.query?.type === "status") return null;
		const callStatus = params.get("CallStatus");
		if (callStatus && isProviderStatusTerminal(callStatus)) return null;
		return !params.get("SpeechResult") && !params.get("Digits") ? params : null;
	}
	shouldAcceptRealtimeInboundRequest(params) {
		switch (this.config.inboundPolicy) {
			case "open": return true;
			case "allowlist":
			case "pairing": return isAllowlistedCaller(normalizePhoneNumber(params.get("From") ?? void 0), this.config.allowFrom);
			default: return false;
		}
	}
	async processParsedEvents(events) {
		let replayable = false;
		for (const event of events) try {
			replayable = await this.processEventWithAutoResponse(event) || replayable;
		} catch (err) {
			this.logger.error(`Error processing event ${event.type}: ${String(err)}`);
			throw err;
		}
		return replayable;
	}
	async processEventWithAutoResponse(event, isCurrent) {
		const result = await this.manager.processEvent(event);
		if (result.kind !== "final-speech") return result.replayable === true;
		if (result.waiterResolved || isCurrent && !isCurrent()) return false;
		const callMode = result.call.metadata?.mode;
		if (result.call.direction !== "inbound" && callMode !== "conversation") return false;
		this.handleInboundResponse(result.call.callId, result.transcript).catch((err) => {
			this.logger.warn(`Failed to auto-respond: ${String(err)}`);
		});
		return false;
	}
	writeWebhookResponse(res, payload) {
		res.statusCode = payload.statusCode;
		if (payload.headers) for (const [key, value] of Object.entries(payload.headers)) res.setHeader(key, value);
		res.end(payload.body);
	}
	/**
	* Read request body as string with timeout protection.
	*/
	readBody(req, maxBytes, timeoutMs) {
		return readRequestBodyWithLimit(req, {
			maxBytes,
			timeoutMs,
			destroyOnLimit: false
		});
	}
	/**
	* Handle auto-response for inbound calls using the agent system.
	* Supports tool calling for richer voice interactions.
	*/
	async handleInboundResponse(callId, userMessage) {
		this.logger.info(`Auto-responding to inbound call ${callId} chars=${userMessage.length}`);
		const call = this.manager.getCall(callId);
		if (!call) {
			this.logger.warn(`Call ${callId} not found for auto-response`);
			return;
		}
		if (!this.coreConfig) {
			this.logger.warn("Core config missing; skipping auto-response");
			return;
		}
		if (!this.agentRuntime) {
			this.logger.warn("Agent runtime missing; skipping auto-response");
			return;
		}
		const response = this.manager.createAutoResponseGuard(call);
		const speakResponse = async (text) => {
			if (!response.isCurrent()) {
				this.logger.info(`Discarding superseded automatic reply ${callId}`);
				return false;
			}
			this.logger.info(`AI response queued ${callId} chars=${text.length}`);
			return (await this.manager.speak(callId, text, {
				listenAfterPlayback: true,
				isCurrent: response.isCurrent
			})).success;
		};
		try {
			const { generateVoiceResponse } = await loadResponseGeneratorModule();
			if (!response.isCurrent()) return;
			const numberRouteKey = resolveVoiceCallNumberRouteKeyForCall(call);
			const effectiveConfig = resolveVoiceCallEffectiveConfig(this.config, numberRouteKey).config;
			const result = await generateVoiceResponse({
				voiceConfig: effectiveConfig,
				coreConfig: this.coreConfig,
				agentRuntime: this.agentRuntime,
				callId,
				sessionKey: call.sessionKey,
				from: call.from,
				senderIsOwner: call.direction === "inbound" ? false : void 0,
				agentId: resolveCallAgentId(call, effectiveConfig),
				transcript: call.transcript,
				userMessage,
				onEarlyText: speakResponse
			});
			if (result.error) {
				this.logger.error(`Response generation error: ${result.error}`);
				return;
			}
			if (result.text && !result.deliveredEarly) await speakResponse(result.text);
		} catch (err) {
			this.logger.error(`Auto-response error: ${String(err)}`);
		} finally {
			response.release();
		}
	}
};
//#endregion
//#region extensions/voice-call/src/runtime.ts
const REALTIME_VOICE_CONSULT_SYSTEM_PROMPT = [
	"You are the configured OpenClaw agent receiving delegated requests from a live phone voice bridge.",
	"Act on behalf of the caller using the normal available tools when the caller asks you to do work.",
	"Prioritize completing the user's request and returning a fast, speakable result over exhaustive investigation.",
	"For tool-backed status checks, prefer one or two bounded read-only queries before answering.",
	"Do not print secret values or dump environment variables; only check whether required configuration is present.",
	"Be accurate, brief, and speakable."
].join(" ");
const loadTelnyxProvider = createLazyRuntimeModule(() => import("./telnyx-BV56PXr-.mjs"));
const loadTwilioProvider = createLazyRuntimeModule(() => import("./twilio-BMb-7cu-.mjs"));
const loadPlivoProvider = createLazyRuntimeModule(() => import("./plivo-BGJda1Uz.mjs"));
const loadMockProvider = createLazyRuntimeModule(() => import("./mock-CcYEAUhV.mjs"));
const loadRealtimeVoiceRuntime = createLazyRuntimeModule(() => import("./realtime-voice.runtime-vtdCOWg-.mjs"));
const loadRealtimeHandler = createLazyRuntimeModule(() => import("./realtime-handler-DlFmdSPn.mjs"));
function resolveVoiceCallConsultSessionKey(call) {
	return resolveVoiceCallSessionKey({
		config: call.config,
		callId: call.callId,
		phone: call.direction === "outbound" ? call.to : call.from,
		explicitSessionKey: call.sessionKey,
		coreSession: call.coreSession
	});
}
function mapVoiceCallConsultTranscript(call, context) {
	const transcript = (call.transcript ?? []).map((entry) => ({
		role: entry.speaker === "bot" ? "assistant" : "user",
		text: entry.text
	}));
	const partial = context?.partialUserTranscript?.trim();
	if (partial && transcript.at(-1)?.text !== partial) transcript.push({
		role: "user",
		text: partial
	});
	return transcript;
}
function createRuntimeResourceLifecycle(params) {
	let tunnelResult = null;
	let stopPromise = null;
	return {
		setTunnelResult: (result) => {
			tunnelResult = result;
		},
		stop: (opts) => {
			if (stopPromise) return stopPromise;
			const suppressErrors = opts?.suppressErrors ?? false;
			stopPromise = (async () => {
				let failure;
				for (const step of [
					async () => {
						await tunnelResult?.stop();
					},
					() => cleanupTailscaleExposure(params.config),
					() => params.webhookServer.stop(),
					() => params.manager.stop()
				]) try {
					await step();
				} catch (error) {
					failure ??= { error };
				}
				if (failure && !suppressErrors) throw failure.error;
			})();
			return stopPromise;
		}
	};
}
async function resolveProvider(config) {
	const allowNgrokFreeTierLoopbackBypass = config.tunnel?.provider === "ngrok" && isLoopbackHost(config.serve?.bind ?? "") && (config.tunnel?.allowNgrokFreeTierLoopbackBypass ?? false);
	switch (config.provider) {
		case "telnyx": {
			const { TelnyxProvider } = await loadTelnyxProvider();
			return new TelnyxProvider({
				apiKey: config.telnyx?.apiKey,
				connectionId: config.telnyx?.connectionId,
				publicKey: config.telnyx?.publicKey
			}, { skipVerification: config.skipSignatureVerification });
		}
		case "twilio": {
			const { TwilioProvider } = await loadTwilioProvider();
			return new TwilioProvider({
				accountSid: config.twilio?.accountSid,
				authToken: resolveTwilioAuthToken(config),
				region: config.twilio?.region
			}, {
				allowNgrokFreeTierLoopbackBypass,
				publicUrl: config.publicUrl,
				skipVerification: config.skipSignatureVerification,
				streamPath: config.streaming?.enabled ? config.streaming.streamPath : void 0,
				webhookSecurity: config.webhookSecurity
			});
		}
		case "plivo": {
			const { PlivoProvider } = await loadPlivoProvider();
			return new PlivoProvider({
				authId: config.plivo?.authId,
				authToken: config.plivo?.authToken
			}, {
				publicUrl: config.publicUrl,
				skipVerification: config.skipSignatureVerification,
				ringTimeoutSec: Math.max(1, Math.floor(config.ringTimeoutMs / 1e3)),
				webhookSecurity: config.webhookSecurity
			});
		}
		case "mock": {
			const { MockProvider } = await loadMockProvider();
			return new MockProvider();
		}
		default: throw new Error(`Unsupported voice-call provider: ${String(config.provider)}`);
	}
}
function listRealtimeAgentIds(config, coreConfig) {
	const agentIds = /* @__PURE__ */ new Set([normalizeAgentId(config.agentId)]);
	for (const agentId of listAgentIds(coreConfig)) agentIds.add(normalizeAgentId(agentId));
	for (const route of Object.values(config.numbers)) if (route.agentId) agentIds.add(normalizeAgentId(route.agentId));
	return [...agentIds];
}
async function createRealtimeInstructionsResolver(params) {
	const genericConfig = {
		...params.config,
		realtime: {
			...params.config.realtime,
			agentContext: {
				...params.config.realtime.agentContext,
				enabled: false
			}
		}
	};
	const genericInstructions = await buildRealtimeVoiceInstructions({
		baseInstructions: params.config.realtime.instructions,
		config: genericConfig,
		coreConfig: params.coreConfig,
		agentRuntime: params.agentRuntime,
		agentId: params.config.agentId
	});
	const entries = await Promise.all(listRealtimeAgentIds(params.config, params.coreConfig).map(async (agentId) => {
		return [agentId, await buildRealtimeVoiceInstructions({
			baseInstructions: params.config.realtime.instructions,
			config: {
				...params.config,
				agentId
			},
			coreConfig: params.coreConfig,
			agentRuntime: params.agentRuntime,
			agentId
		})];
	}));
	const instructionsByAgentId = new Map(entries);
	return (call) => {
		const numberRouteKey = resolveVoiceCallNumberRouteKeyForCall(call);
		const effectiveConfig = resolveVoiceCallEffectiveConfig(params.config, numberRouteKey).config;
		return instructionsByAgentId.get(resolveCallAgentId(call, effectiveConfig)) ?? genericInstructions;
	};
}
async function createVoiceCallRuntime(params) {
	const { config: rawConfig, coreConfig, fullConfig, agentRuntime, stateRuntime, ttsRuntime, logger } = params;
	const log = logger ?? {
		info: console.log,
		warn: console.warn,
		error: console.error,
		debug: console.debug
	};
	const cfg = fullConfig ?? coreConfig;
	const unresolvedConfig = resolveVoiceCallConfig(rawConfig);
	const config = {
		...unresolvedConfig,
		agentId: resolveVoiceCallAgentId(unresolvedConfig, cfg)
	};
	if (!config.enabled) throw new Error("Voice call disabled. Enable the plugin entry in config.");
	if (config.skipSignatureVerification) log.warn("[voice-call] SECURITY WARNING: skipSignatureVerification=true disables webhook signature verification (development only). Do not use in production.");
	const validation = validateProviderConfig(config);
	if (!validation.valid) throw new Error(`Invalid voice-call config: ${validation.errors.join("; ")}`);
	const provider = await resolveProvider(config);
	if (stateRuntime) setVoiceCallStateRuntime({ state: stateRuntime });
	const manager = new CallManager(config, void 0, cfg.session, stateRuntime);
	const realtimeVoiceRuntime = config.realtime.enabled ? await loadRealtimeVoiceRuntime() : null;
	const webhookServer = new VoiceCallWebhookServer(config, manager, provider, coreConfig, fullConfig ?? coreConfig, agentRuntime, log);
	if (realtimeVoiceRuntime) {
		const { RealtimeCallHandler } = await loadRealtimeHandler();
		const resolveRealtimeInstructions = await createRealtimeInstructionsResolver({
			config,
			coreConfig: cfg,
			agentRuntime
		});
		const realtimeConfig = {
			...config.realtime,
			tools: resolveVoiceCallRealtimeTools(config.realtime.toolPolicy, config.realtime.tools)
		};
		const resolveCallRegistration = (call) => {
			const numberRouteKey = resolveVoiceCallNumberRouteKeyForCall(call);
			const effectiveConfig = resolveVoiceCallEffectiveConfig(config, numberRouteKey).config;
			const agentId = resolveCallAgentId(call, effectiveConfig);
			const resolved = realtimeVoiceRuntime.resolveConfiguredRealtimeVoiceProvider({
				configuredProviderId: effectiveConfig.realtime.provider,
				providerConfigs: effectiveConfig.realtime.providers,
				cfg,
				agentId,
				surface: "gateway-relay",
				useProviderDefaultModel: true
			});
			return {
				agentId,
				provider: resolved.provider,
				providerConfig: resolved.providerConfig,
				capabilities: resolved.capabilities,
				instructions: resolveRealtimeInstructions(call)
			};
		};
		const realtimeHandler = new RealtimeCallHandler(realtimeConfig, manager, resolveCallRegistration, config.serve.path, webhookServer.getStreamDisconnectLifecycle(), cfg);
		if (config.realtime.toolPolicy !== "none") realtimeHandler.registerToolHandler(REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, async (args, callId, handlerContext) => {
			handlerContext.abortSignal?.throwIfAborted();
			const call = manager.getCall(callId);
			if (!call) return { error: `Call "${callId}" not found` };
			const numberRouteKey = resolveVoiceCallNumberRouteKeyForCall(call);
			const effectiveConfig = resolveVoiceCallEffectiveConfig(config, numberRouteKey).config;
			const agentId = resolveCallAgentId(call, effectiveConfig);
			const sessionKey = resolveVoiceCallConsultSessionKey({
				...call,
				config: {
					...effectiveConfig,
					agentId
				},
				coreSession: cfg.session
			});
			const requesterSessionKey = typeof call.metadata?.requesterSessionKey === "string" ? call.metadata.requesterSessionKey : void 0;
			const modelLockParams = {
				cfg,
				agentRuntime,
				agentId,
				sessionKey,
				spawnedBy: requesterSessionKey
			};
			assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
			const fastContext = await resolveRealtimeFastContextConsult({
				cfg,
				agentId,
				sessionKey,
				config: effectiveConfig.realtime.fastContext,
				args,
				logger: log
			});
			handlerContext.abortSignal?.throwIfAborted();
			if (fastContext.handled) {
				assertRealtimeVoiceAgentConsultModelSelectionUnlocked(modelLockParams);
				return fastContext.result;
			}
			const { provider: agentProvider, model } = resolveVoiceResponseModel({
				voiceConfig: effectiveConfig,
				agentRuntime
			});
			const thinkLevel = effectiveConfig.realtime.consultThinkingLevel ?? agentRuntime.resolveThinkingDefault({
				cfg,
				provider: agentProvider,
				model
			});
			return await consultRealtimeVoiceAgent({
				cfg,
				agentRuntime,
				logger: log,
				agentId,
				sessionKey,
				messageProvider: "voice",
				lane: "voice",
				runIdPrefix: `voice-realtime-consult:${callId}`,
				args,
				transcript: mapVoiceCallConsultTranscript(call, handlerContext),
				surface: "a live phone call",
				userLabel: "Caller",
				assistantLabel: "Agent",
				questionSourceLabel: "caller",
				provider: agentProvider,
				model,
				thinkLevel,
				fastMode: effectiveConfig.realtime.consultFastMode,
				timeoutMs: effectiveConfig.responseTimeoutMs,
				spawnedBy: requesterSessionKey,
				contextMode: requesterSessionKey ? "fork" : void 0,
				toolsAllow: resolveRealtimeVoiceAgentConsultToolsAllow(effectiveConfig.realtime.toolPolicy),
				extraSystemPrompt: REALTIME_VOICE_CONSULT_SYSTEM_PROMPT,
				abortSignal: handlerContext.abortSignal
			});
		});
		webhookServer.setRealtimeHandler(realtimeHandler);
	}
	const lifecycle = createRuntimeResourceLifecycle({
		config,
		webhookServer,
		manager
	});
	const localUrl = await webhookServer.start();
	try {
		let publicUrl = config.publicUrl ?? null;
		if (!publicUrl && config.tunnel?.provider && config.tunnel.provider !== "none") try {
			const nextTunnelResult = await startTunnel({
				provider: config.tunnel.provider,
				port: config.serve.port,
				tailscalePort: config.tailscale.port,
				path: config.serve.path,
				streamPaths: resolveVoiceCallStreamExposurePaths(config, {
					publicWebhookPath: config.serve.path,
					localWebhookPath: config.serve.path
				}),
				ngrokAuthToken: config.tunnel.ngrokAuthToken,
				ngrokDomain: config.tunnel.ngrokDomain
			});
			lifecycle.setTunnelResult(nextTunnelResult);
			publicUrl = nextTunnelResult?.publicUrl ?? null;
		} catch (err) {
			log.error(`[voice-call] Tunnel setup failed: ${formatErrorMessage(err)}`);
		}
		if (!publicUrl && config.tailscale?.mode !== "off") publicUrl = await setupTailscaleExposure(config);
		const webhookUrl = publicUrl ?? localUrl;
		if (providerRequiresPublicWebhook(provider.name) && isProviderUnreachableWebhookUrl(webhookUrl)) throw new Error(`[voice-call] ${provider.name} requires a publicly reachable webhook URL. Refusing to use local-only webhook ${webhookUrl}. Set plugins.entries.voice-call.config.publicUrl or enable tunnel/tailscale exposure.`);
		if (publicUrl) provider.setPublicUrl?.(publicUrl);
		if (publicUrl && realtimeVoiceRuntime) webhookServer.getRealtimeHandler()?.setPublicUrl(publicUrl);
		const realtimeHandler = webhookServer.getRealtimeHandler();
		if (realtimeHandler) manager.streamSessionIssuer = (request) => realtimeHandler.issueStreamSession(request);
		if (provider.name === "twilio" && config.streaming?.enabled) {
			const twilioProvider = provider;
			if (ttsRuntime?.textToSpeechTelephony) try {
				const ttsProvider = await createTelephonyTtsProvider({
					coreConfig: cfg,
					ttsOverride: config.tts,
					runtime: ttsRuntime,
					logger: log
				});
				twilioProvider.setTTSProvider(ttsProvider);
				log.info("[voice-call] Telephony TTS provider configured");
			} catch (err) {
				log.warn(`[voice-call] Failed to initialize telephony TTS: ${formatErrorMessage(err)}`);
			}
			else log.warn("[voice-call] Telephony TTS unavailable; streaming TTS disabled");
			const mediaHandler = webhookServer.getMediaStreamHandler();
			if (mediaHandler) {
				twilioProvider.setMediaStreamHandler(mediaHandler);
				log.info("[voice-call] Media stream handler wired to provider");
			}
		}
		if (realtimeVoiceRuntime) log.info("[voice-call] Realtime voice enabled");
		await manager.initialize(provider, webhookUrl);
		const stop = () => lifecycle.stop();
		log.info("[voice-call] Runtime initialized");
		log.info(`[voice-call] Webhook URL: ${webhookUrl}`);
		if (publicUrl && publicUrl !== webhookUrl) log.info(`[voice-call] Public URL: ${publicUrl}`);
		return {
			config,
			provider,
			manager,
			webhookServer,
			webhookUrl,
			publicUrl,
			stop
		};
	} catch (err) {
		await lifecycle.stop({ suppressErrors: true });
		throw err;
	}
}
//#endregion
export { resolveCallAgentId as _, normalizeProviderStatus as a, escapeXml as b, canonicalizeVoiceCallMediaBase64 as c, cleanupTailscaleExposureRoute as d, getTailscaleSelfInfo as f, resolveVoiceResponseModel as g, chunkAudio as h, mapProviderStatusToEndReason as i, getHeader as l, TELEPHONY_DEFAULT_TTS_TIMEOUT_MS as m, normalizeProxyIp as n, WebSocket as o, setupTailscaleExposureRoutes as p, isProviderStatusTerminal as r, WebSocketServer as s, createVoiceCallRuntime as t, resolveWebhookExposureStatus as u, resolveVoiceCallAgentId as v, mapVoiceToPolly as x, resolveUserPath as y };
