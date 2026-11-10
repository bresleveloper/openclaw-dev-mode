import { F as resolveTimerTimeoutMs, M as resolveNonNegativeIntegerOption } from "../number-coercion-CkhMiRw8.mjs";
import { r as truncateUtf16Safe } from "../utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "../errors-DPfGDWk1.mjs";
import { A as withTimeout } from "../fs-safe-6Z4UiMS4.mjs";
import "../with-timeout-DPEAkQt5.mjs";
import { n as createRealtimeVoiceAudioQueue, t as RealtimeVoiceSessionLifecycle } from "../realtime-session-lifecycle-D5AJf2IE.mjs";
import { a as sortRealtimeVoiceActivationNames, i as normalizeSupportedRealtimeVoiceActivationName, n as matchRealtimeVoiceActivationName, r as normalizeRealtimeVoiceActivationNamePrefix, t as isSupportedRealtimeVoiceActivationName } from "../activation-name-Mr5RBN2x.mjs";
import { n as controlRealtimeVoiceAgentRun, r as registerRealtimeVoiceSelection, t as buildRealtimeVoiceAgentErrorProviderResult } from "../agent-run-control-CwFgoHm3.mjs";
import { A as readSpeakableRealtimeVoiceToolResult, C as resolveRealtimeVoiceBargeIn, D as createRealtimeVoiceForcedConsultCoordinator, E as resolveRealtimeVoiceSessionPolicy, F as projectInternalRealtimeVoicePublicConfig, M as recordTalkObservabilityEvent, N as TALK_EVENT_TYPES, O as matchRealtimeVoiceConsultQuestions, S as isRealtimeVoiceWakeNameRequired, T as resolveRealtimeVoiceMinBargeInAudioEndMs, _ as createRealtimeVoiceAgentTalkbackQueue, a as getRealtimeVoiceTranscriptHealth, c as recordRealtimeVoiceTranscript, d as resolveConfiguredRealtimeVoiceProvider, f as resolveConfiguredRealtimeVoiceProviderAsync, g as listRealtimeVoiceProviders, h as getRealtimeVoiceProvider, i as getRealtimeVoiceBridgeEventHealth, j as createTalkSessionController, k as readRealtimeVoiceConsultQuestion, l as createRealtimeVoiceBridgeSession, m as canonicalizeRealtimeVoiceProviderId, o as isLikelyRealtimeVoiceAssistantEchoTranscript, r as extendRealtimeVoiceOutputEchoSuppression, s as recordRealtimeVoiceBridgeEvent, t as createRealtimeVoiceSessionHarness, v as REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION, w as resolveRealtimeVoiceInterruptResponseOnInputAudio, x as consultRealtimeVoiceAgent, y as assertRealtimeVoiceAgentConsultModelSelectionUnlocked } from "../realtime-session-harness-C96O9S-p.mjs";
import { A as realtimeVoiceAudioDurationMs, C as parseRealtimeVoiceAgentConsultArgs, D as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, E as resolveRealtimeVoiceAgentConsultToolsAllow, O as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, S as isRealtimeVoiceAgentConsultToolPolicy, T as resolveRealtimeVoiceAgentConsultTools, _ as buildRealtimeVoiceAgentConsultPolicyInstructions, b as buildRealtimeVoiceSessionInstructions, f as shouldAutoControlRealtimeVoiceAgentText, g as buildRealtimeVoiceAgentConsultChatMessage, h as REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES, i as buildRealtimeVoiceAgentCancelProviderResult, j as toOpenAICompatibleRealtimeAudioFormat, k as normalizeRealtimeVoiceResponseOutcome, m as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, n as REALTIME_VOICE_AGENT_CONTROL_TOOL, p as REALTIME_VOICE_AGENT_CONSULT_TOOL, r as REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME, s as classifyRealtimeVoiceAgentControlText, u as parseRealtimeVoiceAgentControlToolArgs, w as resolveRealtimeVoiceAgentConsultToolPolicy, y as buildRealtimeVoiceAgentConsultWorkingResponse } from "../agent-run-control-shared-CErtQzFX.mjs";
import { a as resamplePcm, o as resamplePcmTo8k, r as mulawToPcm, s as createRealtimeVoiceOutputActivityTracker, t as convertPcmToMulaw8k } from "../audio-codec-CZcvtjIg.mjs";
import { i as readPcm16AudioStats, n as createSpeechThresholdGate, r as isRealtimeVoiceAudioAudible, t as calculateMulawRms } from "../audio-energy-D6TOXih8.mjs";
import { t as createRealtimeVoiceAudioPortSender } from "../audio-output-port-D8MeN94q.mjs";
//#region src/talk/consult-transcript.ts
/**
* ASR often emits partial fragments or polite closings that should not trigger
* an OpenClaw consult. This classifier names those skip reasons for callers.
*/
const REALTIME_VOICE_CONSULT_TRAILING_FRAGMENT_WORDS = /* @__PURE__ */ new Set([
	"a",
	"about",
	"an",
	"and",
	"as",
	"at",
	"because",
	"but",
	"by",
	"for",
	"from",
	"in",
	"of",
	"on",
	"or",
	"so",
	"that",
	"the",
	"then",
	"to",
	"with"
]);
const REALTIME_VOICE_CLOSING_REMAINDER = new RegExp(String.raw`^(?:(?:${[
	"ok(?:ay)?|all right|alright|well|so|and",
	"thanks(?: a lot| so much)?|thank you(?: very much)?|take care",
	"have a (?:good|nice|great) (?:day|night|evening|weekend)",
	"guys|everyone|everybody|all|folks|you all",
	"for now|now|later|soon|tomorrow|tonight|next (?:time|week|month|year|weekend)",
	"(?:on |next )?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)",
	String.raw`in (?:a|a few|few|one|two|three|four|five|six|seven|eight|nine|ten|\d+) (?:second|minute|moment)s?`,
	"in a bit|in the (?:morning|afternoon|evening)"
].join("|")})\b|[.! ,;:—–-])*$`);
function classifySkippableRealtimeVoiceConsultTranscript(text) {
	const normalized = text.replace(/\s+/g, " ").trim().toLowerCase();
	if (!normalized) return "empty";
	if (/(\.\.\.|…)\s*$/.test(normalized)) return "incomplete-transcript";
	const lastWord = normalized.match(/[a-z']+$/)?.[0]?.replace(/^'+|'+$/g, "");
	if (lastWord && REALTIME_VOICE_CONSULT_TRAILING_FRAGMENT_WORDS.has(lastWord)) return "trailing-fragment";
	const remainder = normalized.replace(/\b(?:(?:i['’]?ll|i will) be (?:right )?back|see you|bye(?:[- ]bye)?|good[- ]?bye)\b/g, "");
	if (remainder !== normalized && REALTIME_VOICE_CLOSING_REMAINDER.test(remainder)) return "non-actionable-closing";
}
//#endregion
//#region src/talk/turn-context-tracker.ts
const DEFAULT_REALTIME_VOICE_TURN_CONTEXT_LIMIT = 32;
const DEFAULT_REALTIME_VOICE_IGNORED_CONTEXT_TTL_MS = 1e4;
function createRealtimeVoiceTurnContextTracker(options = {}) {
	const turns = [];
	let recentIgnoredContext;
	let nextId = 0;
	const owner = Symbol("realtimeVoiceTurnContextTracker");
	const now = options.now ?? Date.now;
	const limit = resolveNonNegativeIntegerOption(options.limit, DEFAULT_REALTIME_VOICE_TURN_CONTEXT_LIMIT);
	const ignoredContextTtlMs = resolveNonNegativeIntegerOption(options.ignoredContextTtlMs, DEFAULT_REALTIME_VOICE_IGNORED_CONTEXT_TTL_MS);
	const deferUntilAudio = options.deferUntilAudio === true;
	const prune = () => {
		for (let index = turns.length - 1; index >= 0; index -= 1) {
			const turn = turns[index];
			if (turn?.closed && !turn.hasAudio) turns.splice(index, 1);
		}
		while (turns.length > limit) {
			const completedIndex = turns.findIndex((turn) => turn.closed);
			turns.splice(Math.max(completedIndex, 0), 1);
		}
	};
	const expireClosedTurnsBeforeLaterAudio = () => {
		let hasLaterAudio = false;
		for (let index = turns.length - 1; index >= 0; index -= 1) {
			const turn = turns[index];
			if (!turn?.hasAudio) continue;
			if (turn.closed && hasLaterAudio) {
				turns.splice(index, 1);
				continue;
			}
			hasLaterAudio = true;
		}
	};
	const prepareForAudioContextRead = () => {
		prune();
		expireClosedTurnsBeforeLaterAudio();
	};
	const owns = (handle) => handle[owner] === true;
	return {
		open(context, ...extra) {
			const startedAt = now();
			const handle = {
				...extra[0] ?? {},
				[owner]: true,
				id: `realtime-turn:${startedAt}:${++nextId}`,
				context,
				hasAudio: false,
				closed: false,
				startedAt
			};
			if (!deferUntilAudio) {
				turns.push(handle);
				prune();
			}
			return handle;
		},
		markAudio(handle) {
			if (!owns(handle)) return;
			handle.hasAudio = true;
			handle.lastAudioAt = now();
			if (!turns.includes(handle)) {
				turns.push(handle);
				prune();
			}
		},
		close(handle) {
			if (!owns(handle)) return;
			handle.closed = true;
			if (!turns.includes(handle)) return;
			prune();
		},
		consumeAudioContext() {
			prepareForAudioContextRead();
			const index = turns.findIndex((turn) => turn.hasAudio);
			if (index < 0) return;
			const [turn] = turns.splice(index, 1);
			prune();
			return turn?.context;
		},
		peekAudioTurn() {
			prepareForAudioContextRead();
			return turns.find((turn) => turn.hasAudio);
		},
		hasAudioContext() {
			prepareForAudioContextRead();
			return turns.some((turn) => turn.hasAudio);
		},
		rememberIgnoredContext(context) {
			if (context === void 0) return;
			recentIgnoredContext = {
				context,
				createdAt: now()
			};
		},
		consumeIgnoredContext() {
			const recent = recentIgnoredContext;
			recentIgnoredContext = void 0;
			if (!recent || now() - recent.createdAt > ignoredContextTtlMs) return;
			return recent.context;
		},
		size() {
			prune();
			return turns.length;
		},
		clear() {
			turns.length = 0;
			recentIgnoredContext = void 0;
		}
	};
}
//#endregion
//#region src/talk/exact-speech-protocol.ts
/** Build the internal user message that asks a realtime model to speak exact text. */
function buildRealtimeVoiceSpeakExactMessage(params) {
	return [
		"Internal OpenClaw voice playback result.",
		"Do not call openclaw_agent_consult or any other tool for this message.",
		`Speak this exact OpenClaw answer to ${params.surfaceLabel}, without adding, removing, or rephrasing words.`,
		`Answer: ${JSON.stringify(params.text)}`
	].join("\n");
}
/** Classify a provider consult call before normal agent delegation. */
function classifyRealtimeVoiceConsultToolCall(args, options) {
	const message = collectRealtimeConsultArgStrings(args).join("\n");
	if (message.includes("Speak this exact OpenClaw answer")) {
		const text = readJsonStringAfterLabel(message, "Answer:");
		if (text !== void 0 && options.retainedExactSpeechTexts.includes(text)) return {
			kind: "exact-speech-echo",
			text
		};
	}
	for (const text of options.retainedExactSpeechTexts) if (text && message.includes(JSON.stringify(text))) return {
		kind: "exact-speech-echo",
		text
	};
	try {
		return {
			kind: "consult",
			message: buildRealtimeVoiceAgentConsultChatMessage(args)
		};
	} catch (error) {
		return {
			kind: "malformed",
			error: formatErrorMessage(error)
		};
	}
}
function collectRealtimeConsultArgStrings(args) {
	if (!args || typeof args !== "object") return typeof args === "string" ? [args] : [];
	const values = [];
	for (const key of [
		"question",
		"prompt",
		"query",
		"task",
		"context",
		"responseStyle"
	]) {
		const value = args[key];
		if (typeof value === "string") values.push(value);
	}
	return values;
}
function readJsonStringAfterLabel(text, label) {
	const labelIndex = text.indexOf(label);
	if (labelIndex < 0) return;
	const quoteIndex = text.indexOf("\"", labelIndex + label.length);
	if (quoteIndex < 0) return;
	for (let index = quoteIndex + 1; index < text.length; index += 1) {
		if (text[index] !== "\"" || isEscapedQuote(text, index)) continue;
		try {
			const parsed = JSON.parse(text.slice(quoteIndex, index + 1));
			return typeof parsed === "string" ? parsed : void 0;
		} catch {
			return;
		}
	}
}
function isEscapedQuote(text, quoteIndex) {
	let backslashes = 0;
	for (let index = quoteIndex - 1; index >= 0 && text[index] === "\\"; index -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
//#endregion
//#region src/talk/fast-context-runtime.ts
/**
* Fast context lookup for realtime voice consults.
*
* When memory/session search can answer quickly, Talk can return concise
* context without launching a full agent consult; otherwise callers may fall
* back to the normal consult flow.
*/
const MAX_SNIPPET_CHARS = 700;
function normalizeSnippet(text) {
	const normalized = text.replace(/\s+/g, " ").trim();
	if (normalized.length <= MAX_SNIPPET_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, 699).trimEnd()}...`;
}
function buildContextText(params) {
	const hits = params.hits.map((hit, index) => `${index + 1}. [${hit.source}] ${hit.location}\n${normalizeSnippet(hit.snippet)}`).join("\n\n");
	return [
		`Fast ${params.labels.contextName} found for the live ${params.labels.audienceLabel}.`,
		`Use this context only if it answers the ${params.labels.audienceLabel}'s question. If it is not relevant, say briefly that you do not have that context handy.`,
		`Question:\n${params.query}`,
		`Context:\n${hits}`
	].join("\n\n");
}
function buildMissText(query, labels) {
	return [
		`No relevant ${labels.contextName} was found quickly for the live ${labels.audienceLabel}.`,
		`Answer briefly that you do not have that context handy. Do not keep checking unless the ${labels.audienceLabel} asks you to.`,
		`Question:\n${query}`
	].join("\n\n");
}
function toNativeFastContextHit(hit) {
	return {
		source: hit.source ?? hit.reference.providerId,
		location: hit.citations?.map((citation) => citation.label).join(", ") || `${hit.reference.providerId}:${hit.reference.id}`,
		snippet: hit.excerpt
	};
}
async function lookupFastContext(params) {
	const { authorizeActiveMemorySearchHits, getActiveMemoryProviderCore, getActiveMemorySearchManagerCore, isActiveMemoryProviderNative } = await import("../memory-runtime-CCvD2E5N.mjs");
	if (isActiveMemoryProviderNative({
		cfg: params.cfg,
		agentId: params.agentId
	})) {
		if (!params.callerSuppliedLiveness) return {
			status: "unavailable",
			error: "caller supplied no request liveness"
		};
		const memory = await getActiveMemoryProviderCore({
			cfg: params.cfg,
			agentId: params.agentId,
			context: params.context
		});
		if (!memory.provider) return {
			status: "unavailable",
			error: memory.error ?? "no active memory provider"
		};
		try {
			const { hits } = await memory.provider.search({
				query: params.query,
				maxResults: params.config.maxResults,
				sources: params.config.sources
			});
			params.context.assertCurrent();
			return {
				status: "hits",
				hits: hits.map(toNativeFastContextHit)
			};
		} finally {
			await memory.provider.close();
			params.context.assertCurrent();
		}
	}
	const memory = await getActiveMemorySearchManagerCore({
		cfg: params.cfg,
		agentId: params.agentId
	});
	params.context.assertCurrent();
	if (!memory.manager) return {
		status: "unavailable",
		error: memory.error ?? "no active memory manager"
	};
	const rawHits = await memory.manager.search(params.query, {
		maxResults: params.config.maxResults,
		sessionKey: params.sessionKey,
		sources: params.config.sources
	});
	params.context.assertCurrent();
	const hits = await authorizeActiveMemorySearchHits({
		cfg: params.cfg,
		agentId: params.agentId,
		requesterSessionKey: params.sessionKey,
		sandboxed: false,
		hits: rawHits
	});
	params.context.assertCurrent();
	return {
		status: "hits",
		hits: hits.map((hit) => ({
			source: hit.source,
			location: `${hit.path}:${hit.startLine}-${hit.endLine}`,
			snippet: hit.snippet
		}))
	};
}
async function resolveRealtimeVoiceFastContextConsult(params) {
	if (!params.config.enabled) return { handled: false };
	const labels = {
		audienceLabel: params.labels?.audienceLabel?.trim() || "person",
		contextName: params.labels?.contextName?.trim() || "OpenClaw memory context"
	};
	const parsed = parseRealtimeVoiceAgentConsultArgs(params.args);
	const query = [parsed.question, parsed.context].filter(Boolean).join("\n\n");
	const lookupLifetime = new AbortController();
	const signal = params.liveness?.signal ? AbortSignal.any([params.liveness.signal, lookupLifetime.signal]) : lookupLifetime.signal;
	const context = {
		authority: {
			kind: "session",
			sessionKey: params.sessionKey,
			sandboxed: false
		},
		signal,
		assertCurrent() {
			if (lookupLifetime.signal.aborted) throw new Error("voice context request has ended");
			signal.throwIfAborted();
			params.liveness?.assertCurrent();
		}
	};
	try {
		const timeoutMs = resolveTimerTimeoutMs(params.config.timeoutMs, 1);
		const lookup = await withTimeout(lookupFastContext({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			config: params.config,
			query,
			context,
			callerSuppliedLiveness: params.liveness !== void 0
		}), timeoutMs, { createError: () => /* @__PURE__ */ new Error(`fast context lookup timed out after ${timeoutMs}ms`) });
		context.assertCurrent();
		if (lookup.status === "unavailable") params.logger.debug?.(`[talk] fast context unavailable: ${lookup.error}`);
		else if (lookup.hits.length > 0) return {
			handled: true,
			result: { text: buildContextText({
				query,
				hits: lookup.hits,
				labels
			}) }
		};
	} catch (error) {
		const message = formatErrorMessage(error);
		params.logger.debug?.(`[talk] fast context lookup failed: ${message}`);
	} finally {
		lookupLifetime.abort(/* @__PURE__ */ new Error("voice context request has ended"));
	}
	return params.config.fallbackToConsult ? { handled: false } : {
		handled: true,
		result: { text: buildMissText(query, labels) }
	};
}
//#endregion
export { REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION, REALTIME_VOICE_AGENT_CONSULT_TOOL, REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES, REALTIME_VOICE_AGENT_CONTROL_TOOL, REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, RealtimeVoiceSessionLifecycle, TALK_EVENT_TYPES, assertRealtimeVoiceAgentConsultModelSelectionUnlocked, buildRealtimeVoiceAgentCancelProviderResult, buildRealtimeVoiceAgentConsultChatMessage, buildRealtimeVoiceAgentConsultPolicyInstructions, buildRealtimeVoiceAgentConsultWorkingResponse, buildRealtimeVoiceAgentErrorProviderResult, buildRealtimeVoiceSessionInstructions, buildRealtimeVoiceSpeakExactMessage, calculateMulawRms, canonicalizeRealtimeVoiceProviderId, classifyRealtimeVoiceAgentControlText, classifyRealtimeVoiceConsultToolCall, classifySkippableRealtimeVoiceConsultTranscript, consultRealtimeVoiceAgent, controlRealtimeVoiceAgentRun, convertPcmToMulaw8k, createRealtimeVoiceAgentTalkbackQueue, createRealtimeVoiceAudioPortSender, createRealtimeVoiceAudioQueue, createRealtimeVoiceBridgeSession, createRealtimeVoiceForcedConsultCoordinator, createRealtimeVoiceOutputActivityTracker, createRealtimeVoiceSessionHarness, createRealtimeVoiceTurnContextTracker, createSpeechThresholdGate, createTalkSessionController, extendRealtimeVoiceOutputEchoSuppression, getRealtimeVoiceBridgeEventHealth, getRealtimeVoiceProvider, getRealtimeVoiceTranscriptHealth, isLikelyRealtimeVoiceAssistantEchoTranscript, isRealtimeVoiceAgentConsultToolPolicy, isRealtimeVoiceAudioAudible, isRealtimeVoiceWakeNameRequired, isSupportedRealtimeVoiceActivationName, listRealtimeVoiceProviders, matchRealtimeVoiceActivationName, matchRealtimeVoiceConsultQuestions, mulawToPcm, normalizeRealtimeVoiceActivationNamePrefix, normalizeRealtimeVoiceResponseOutcome, normalizeSupportedRealtimeVoiceActivationName, parseRealtimeVoiceAgentControlToolArgs, projectInternalRealtimeVoicePublicConfig, readPcm16AudioStats, readRealtimeVoiceConsultQuestion, readSpeakableRealtimeVoiceToolResult, realtimeVoiceAudioDurationMs, recordRealtimeVoiceBridgeEvent, recordRealtimeVoiceTranscript, recordTalkObservabilityEvent, registerRealtimeVoiceSelection, resamplePcm, resamplePcmTo8k, resolveConfiguredRealtimeVoiceProvider, resolveConfiguredRealtimeVoiceProviderAsync, resolveRealtimeVoiceAgentConsultToolPolicy, resolveRealtimeVoiceAgentConsultTools, resolveRealtimeVoiceAgentConsultToolsAllow, resolveRealtimeVoiceBargeIn, resolveRealtimeVoiceFastContextConsult, resolveRealtimeVoiceInterruptResponseOnInputAudio, resolveRealtimeVoiceMinBargeInAudioEndMs, resolveRealtimeVoiceSessionPolicy, shouldAutoControlRealtimeVoiceAgentText, sortRealtimeVoiceActivationNames, toOpenAICompatibleRealtimeAudioFormat };
