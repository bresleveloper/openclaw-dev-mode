import { C as parseStrictNonNegativeInteger, P as resolvePositiveTimerTimeoutMs, a as addTimerTimeoutGraceMs, f as asSafeIntegerInRange, u as asPositiveFiniteNumber } from "../number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, o as asRecord } from "../record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, h as readNonEmptyStringPreservingWhitespace, l as normalizeOptionalString, m as readNonBlankString } from "../string-coerce-CIXf7egm.mjs";
import { s as normalizeOptionalTrimmedStringList, y as uniqueStrings } from "../string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "../utf16-slice-D_ngcYKd.mjs";
import { r as createLazyRuntimeModule } from "../lazy-runtime-BPNHa36e.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Sn as looseObject, or as union, sr as unknown } from "../schemas-BOYIvvln.mjs";
import { h as sleep } from "../utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "../agent-id-GA8mwdTG.mjs";
import { m as resolveDefaultAgentId } from "../agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "../session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "../errors-DnjwnOju.mjs";
import { t as KeyedAsyncQueue } from "../keyed-async-queue-CTreGrmR.mjs";
import { n as callGatewayFromCli } from "../gateway-rpc-DXO3PHhc.mjs";
import { n as truncateUtf8Suffix } from "../utf8-truncate-_hf7tp13.mjs";
import { t as ErrorCodes } from "../gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "../error-codes-DvB36bCj.mjs";
import { r as onDecodedOutput } from "../decoded-output-CqBjhNN5.mjs";
import { t as canonicalizeBase64 } from "../base64-B5EyWEOm.mjs";
import { t as jsonResult } from "../tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam, l as readNonNegativeIntegerParam } from "../common-XfKigJno.mjs";
import { t as resolveTranscriptsConfig } from "../config-qnAcplqt.mjs";
import { n as getRealtimeTranscriptionProvider, r as listRealtimeTranscriptionProviders } from "../provider-registry-CkWPgKRO.mjs";
import { C as resolveRealtimeVoiceBargeIn, b as consultRealtimeVoiceAgent, d as resolveConfiguredRealtimeVoiceProvider, t as createRealtimeVoiceSessionHarness } from "../realtime-session-harness-DwEE7xVl.mjs";
import { A as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, D as resolveRealtimeVoiceAgentConsultTools, E as resolveRealtimeVoiceAgentConsultToolPolicy, O as resolveRealtimeVoiceAgentConsultToolsAllow, k as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, x as buildRealtimeVoiceAgentConsultWorkingResponse } from "../agent-run-control-shared-DXVEJ-0Y.mjs";
import { a as convertPcmToMulaw8k, i as readPcm16AudioStats, l as resamplePcm, n as createSpeechThresholdGate, r as isRealtimeVoiceAudioAudible, s as mulawToPcm } from "../audio-energy-CUNIcCl_.mjs";
import { t as MeetingSessionTranscriptStore } from "../session-transcript-store--EhAbY95.mjs";
import { t as createMeetingTranscriptSourceProvider } from "../transcripts-bridge-BhkdwJIv.mjs";
import { spawn, spawnSync } from "node:child_process";
import { Readable } from "node:stream";
import { randomUUID } from "node:crypto";
//#region src/meeting-bot/realtime-audio-format.ts
function resolveMeetingRealtimeAudioFormat(audioFormat) {
	return audioFormat === "g711-ulaw-8khz" ? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ : REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ;
}
function convertMeetingBridgeAudioForStt(audio, audioFormat) {
	if (audioFormat === "g711-ulaw-8khz") return audio;
	return convertPcmToMulaw8k(audio, 24e3);
}
function convertMeetingTtsAudioForBridge(audio, sampleRate, audioFormat, outputFormat, platformName = "meeting platform") {
	const sourceFormat = sourceTelephonyTtsFormat(outputFormat, platformName);
	if (audioFormat === "g711-ulaw-8khz" && sourceFormat === "mulaw" && sampleRate === 8e3) return audio;
	const pcm = decodeMeetingTelephonyTtsAudio(audio, sourceFormat);
	return audioFormat === "g711-ulaw-8khz" ? convertPcmToMulaw8k(pcm, sampleRate) : resamplePcm(pcm, sampleRate, 24e3);
}
function sourceTelephonyTtsFormat(outputFormat, platformName) {
	const normalized = outputFormat?.trim().toLowerCase().replaceAll("_", "-") ?? "";
	if (!normalized || normalized === "pcm" || normalized.startsWith("pcm-") || normalized.includes("pcm16") || normalized.includes("16bit-mono-pcm")) return "pcm";
	if (normalized === "mulaw" || normalized === "ulaw" || normalized.includes("mu-law") || normalized.includes("mulaw") || normalized.includes("ulaw")) return "mulaw";
	if (normalized === "alaw" || normalized.includes("a-law") || normalized.includes("alaw")) return "alaw";
	throw new Error(`Unsupported telephony TTS output format for ${platformName}: ${outputFormat}`);
}
function decodeMeetingTelephonyTtsAudio(audio, sourceFormat) {
	switch (sourceFormat) {
		case "pcm": return audio;
		case "mulaw": return mulawToPcm(audio);
		case "alaw": return alawToPcm(audio);
	}
	throw new Error("Unsupported telephony TTS output format for meeting platform");
}
function alawToPcm(alaw) {
	const pcm = Buffer.alloc(alaw.length * 2);
	for (let index = 0; index < alaw.length; index += 1) pcm.writeInt16LE(alawByteToLinear(alaw[index] ?? 0), index * 2);
	return pcm;
}
function alawByteToLinear(value) {
	const aLaw = value ^ 85;
	const sign = aLaw & 128;
	const exponent = (aLaw & 112) >> 4;
	const mantissa = aLaw & 15;
	const sample = exponent === 0 ? (mantissa << 4) + 8 : (mantissa << 4) + 264 << exponent - 1;
	return sign ? sample : -sample;
}
//#endregion
//#region src/meeting-bot/realtime-engine-support.ts
const MEETING_REALTIME_CANCELLATION_RACE_DETAIL = "Cancellation failed: no active response found";
function meetingOutputBytesPerMs(audioFormat) {
	return audioFormat === "g711-ulaw-8khz" ? 8 : 48;
}
function resolveMeetingRealtimeProvider(params) {
	const providerId = params.config.realtime.voiceProvider ?? params.config.realtime.provider;
	return resolveConfiguredRealtimeVoiceProvider({
		configuredProviderId: providerId,
		providerConfigs: params.config.realtime.providers,
		cfg: params.fullConfig,
		agentId: params.config.realtime.agentId,
		surface: "gateway-relay",
		useProviderDefaultModel: true,
		providers: params.providers,
		defaultModel: params.config.realtime.model,
		noRegisteredProviderMessage: "No configured realtime voice provider registered"
	});
}
function resolveMeetingRealtimeTranscriptionProvider(params) {
	const providers = params.providers ?? listRealtimeTranscriptionProviders(params.fullConfig);
	if (providers.length === 0) throw new Error("No configured realtime transcription provider registered");
	const providerId = params.config.realtime.transcriptionProvider ?? params.config.realtime.provider;
	const provider = (providerId ? params.providers?.find((entry) => entry.id === providerId || entry.aliases?.includes(providerId)) ?? getRealtimeTranscriptionProvider(providerId, params.fullConfig) : void 0) ?? providers[0];
	if (!provider) throw new Error("No configured realtime transcription provider registered");
	const rawConfig = providerId ? params.config.realtime.providers[providerId] ?? params.config.realtime.providers[provider.id] ?? {} : params.config.realtime.providers[provider.id] ?? {};
	const providerConfig = provider.resolveConfig ? provider.resolveConfig({
		cfg: params.fullConfig,
		rawConfig
	}) : rawConfig;
	if (!provider.isConfigured({
		cfg: params.fullConfig,
		providerConfig
	})) throw new Error(`Realtime transcription provider "${provider.id}" is not configured`);
	return {
		provider,
		providerConfig
	};
}
function buildMeetingSpeakExactUserMessage(text) {
	return ["Speak this exact OpenClaw answer to the meeting, without adding, removing, or rephrasing words.", `Answer: ${JSON.stringify(text)}`].join("\n");
}
function formatLogValue(value) {
	return (value ? truncateUtf16Safe(value.replace(/\s+/g, "_"), 180) : void 0) || "unknown";
}
function resolveProviderModelForLog(params) {
	return normalizeOptionalString(params.providerConfig.model) ?? normalizeOptionalString(params.providerConfig.modelId) ?? normalizeOptionalString(params.fallbackModel) ?? normalizeOptionalString(params.provider.defaultModel) ?? "provider-default";
}
function formatMeetingRealtimeVoiceModelLog(params) {
	return [
		`${params.logScope} realtime voice bridge starting: strategy=${formatLogValue(params.strategy)}`,
		`provider=${formatLogValue(params.provider.id)}`,
		`model=${formatLogValue(resolveProviderModelForLog({
			provider: params.provider,
			providerConfig: params.providerConfig,
			fallbackModel: params.fallbackModel
		}))}`,
		`audioFormat=${formatLogValue(params.audioFormat)}`
	].join(" ");
}
function formatMeetingAgentAudioModelLog(params) {
	return [
		`${params.logScope} agent audio bridge starting: transcriptionProvider=${formatLogValue(params.provider.id)}`,
		`transcriptionModel=${formatLogValue(resolveProviderModelForLog({
			provider: params.provider,
			providerConfig: params.providerConfig
		}))}`,
		"tts=telephony",
		`audioFormat=${formatLogValue(params.audioFormat)}`
	].join(" ");
}
function formatMeetingAgentTtsResultLog(logScope, prefix, result) {
	return [
		`${logScope} ${prefix} TTS: provider=${formatLogValue(result.provider)}`,
		`model=${formatLogValue(result.providerModel)}`,
		`voice=${formatLogValue(result.providerVoice)}`,
		`outputFormat=${formatLogValue(result.outputFormat)}`,
		`sampleRate=${result.sampleRate ?? "unknown"}`,
		...result.fallbackFrom ? [`fallbackFrom=${formatLogValue(result.fallbackFrom)}`] : []
	].join(" ");
}
function formatMeetingTranscriptSummaryLog(logScope, prefix, text) {
	return `${logScope} ${prefix}: chars=${text.length}`;
}
function normalizeMeetingTtsPromptText(text) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	const sayExactly = trimmed.match(/^say exactly:\s*(?<text>.+)$/is)?.groups?.text?.trim();
	if (sayExactly) return sayExactly.replace(/^["']|["']$/g, "").trim() || trimmed;
	return trimmed;
}
function createMeetingRealtimeLifecycleHandlers(params) {
	const onEvent = (event) => {
		if (event.direction === "server" && event.type === "session.created") params.lifecycle.continuityResetActive = false;
		if (event.direction === "client" && event.type === "session.continuity.reset") {
			if (params.lifecycle.continuityResetActive) return;
			params.lifecycle.continuityResetActive = true;
			params.lifecycle.realtimeReady = false;
			params.outputOwner.reset();
			params.lifecycle.outputGenerationActive = false;
			params.resetToolContinuity(event.type);
			const turnId = params.harness.talk.activeTurnId;
			params.invalidateOutputPlayback();
			params.harness.flushOutput(params.clearOutputPlayback);
			params.harness.finishOutputAudio(event.type);
			if (turnId) params.harness.talk.cancelTurn({
				turnId,
				payload: {
					...params.outputTalkPayload,
					reason: event.type
				}
			});
			return;
		}
		params.outputOwner.noteEvent(event);
		if (event.type === "input_audio_buffer.speech_started") params.harness.ensureTurn();
		else if (event.type === "input_audio_buffer.speech_stopped") {
			const turnId = params.harness.talk.activeTurnId;
			if (!turnId) return;
			params.harness.emit({
				type: "input.audio.committed",
				turnId,
				payload: {
					...params.outputTalkPayload,
					source: event.type
				},
				final: true
			});
		} else if (event.type === "error" && event.detail === MEETING_REALTIME_CANCELLATION_RACE_DETAIL) {
			if (params.outputOwner.clearBlocked()) {
				params.lifecycle.outputGenerationActive = false;
				params.harness.finishOutputAudio(event.type);
			}
		} else if (event.type === "error") params.harness.emit({
			type: "session.error",
			payload: { message: event.detail ?? "Realtime provider error" },
			final: true
		});
		if (event.type === "error" || event.type === "response.done" || event.type === "input_audio_buffer.speech_started" || event.type === "input_audio_buffer.speech_stopped" || event.type === "conversation.item.input_audio_transcription.completed" || event.type === "conversation.item.input_audio_transcription.failed") {
			const detail = event.detail ? ` ${event.detail}` : "";
			params.logger.info(`${params.logScope} ${params.realtimeLogScope} ${event.direction}:${event.type}${detail}`);
		}
	};
	const onResponseDone = (outcome) => {
		if (!params.outputOwner.terminal(outcome.responseId)) return;
		params.lifecycle.outputGenerationActive = false;
		if (outcome.status === "failed" || outcome.status === "incomplete") params.logger.warn(`${params.logScope} ${params.realtimeLogScope} response ${outcome.status}: ${outcome.message}`);
	};
	return {
		onEvent,
		onResponseDone
	};
}
//#endregion
//#region src/meeting-bot/realtime-output-owner.ts
const STALE_RESPONSE_LIMIT = 16;
const AUDIO_DELTA_EVENTS = /* @__PURE__ */ new Set([
	"conversation.output_audio.delta",
	"response.audio.delta",
	"response.output_audio.delta"
]);
const OUTPUT_MAX_PENDING_MS = 2e3;
const OUTPUT_MAX_WRITE_MS = 500;
const OUTPUT_MAX_PENDING_FRAMES = 256;
/** Serializes native playback writes and fences queued audio across interruption. */
function createMeetingRealtimeOutputQueue(params) {
	let stopped = false;
	let generation = 0;
	let writePhase = "idle";
	let clearPending = 0;
	let clearAfterActive = false;
	let pendingBytes = 0;
	let pendingFrames = 0;
	let pendingAudibleFrames = 0;
	let playableUntilMs = 0;
	let audibleUntilMs = 0;
	let clearCount = 0;
	let lastClearAt;
	let clearTail = Promise.resolve();
	const queue = [];
	const maxPendingBytes = params.bytesPerMs * OUTPUT_MAX_PENDING_MS;
	const maxWriteBytes = params.bytesPerMs * OUTPUT_MAX_WRITE_MS;
	const reset = () => {
		generation += 1;
		queue.length = 0;
		pendingBytes = 0;
		pendingFrames = 0;
		pendingAudibleFrames = 0;
		playableUntilMs = 0;
		audibleUntilMs = 0;
	};
	const clear = () => {
		if (stopped) return;
		clearCount += 1;
		lastClearAt = (/* @__PURE__ */ new Date()).toISOString();
		clearPending += 1;
		clearTail = clearTail.then(async () => {
			if (!stopped) await params.transport.clearOutput();
		}).catch((error) => params.onFailure("audio output clear", error)).finally(() => {
			clearPending -= 1;
			pump();
		});
	};
	const pump = () => {
		if (stopped || writePhase !== "idle" || clearPending > 0) return;
		const next = queue.shift();
		if (!next) return;
		const batch = [next];
		let batchBytes = next.audio.byteLength;
		let batchFrames = 1;
		let batchAudibleFrames = Number(next.audible);
		while (batchBytes < maxWriteBytes) {
			const queued = queue[0];
			if (!queued || queued.beginsOutput || queued.audio.byteLength > maxWriteBytes - batchBytes) break;
			queue.shift();
			batch.push(queued);
			batchBytes += queued.audio.byteLength;
			batchFrames += 1;
			batchAudibleFrames += Number(queued.audible);
		}
		const audio = batch.length === 1 ? next.audio : Buffer.concat(batch.map((entry) => entry.audio), batchBytes);
		writePhase = "scheduled";
		Promise.resolve().then(async () => {
			if (stopped || next.generation !== generation) return;
			if (next.beginsOutput) params.transport.beginOutput?.();
			writePhase = "writing";
			await params.transport.writeOutput(audio);
			if (!stopped && next.generation === generation) {
				playableUntilMs = Math.max(Date.now(), playableUntilMs);
				for (const entry of batch) {
					playableUntilMs += entry.audio.byteLength / params.bytesPerMs;
					if (entry.audible) audibleUntilMs = playableUntilMs;
				}
			}
		}).catch((error) => {
			if (!stopped && next.generation === generation) params.onFailure("audio output", error);
		}).finally(() => {
			writePhase = "idle";
			if (next.generation === generation) {
				pendingBytes -= batchBytes;
				pendingFrames -= batchFrames;
				pendingAudibleFrames -= batchAudibleFrames;
			}
			if (clearAfterActive && !stopped) {
				clearAfterActive = false;
				clear();
				return;
			}
			pump();
		});
	};
	return {
		enqueue(audio, audible, beginsOutput) {
			if (stopped || audio.byteLength > maxPendingBytes - pendingBytes || pendingFrames >= OUTPUT_MAX_PENDING_FRAMES) return false;
			pendingBytes += audio.byteLength;
			pendingFrames += 1;
			pendingAudibleFrames += Number(audible);
			queue.push({
				audio,
				audible,
				beginsOutput,
				generation
			});
			pump();
			return true;
		},
		invalidate() {
			clearAfterActive ||= writePhase === "writing";
			reset();
		},
		clear,
		stop() {
			stopped = true;
			clearAfterActive = false;
			reset();
		},
		pending: () => ({
			pendingBytes,
			pendingFrames
		}),
		hasUnplayedAudibleAudio: () => pendingAudibleFrames > 0 || Date.now() < audibleUntilMs,
		getHealth: () => ({
			clearCount,
			lastClearAt
		})
	};
}
function createMeetingRealtimeOutputOwner() {
	let nextResponseId;
	let announcedResponseId;
	let currentResponseId;
	let blocked;
	const staleResponseIds = /* @__PURE__ */ new Set();
	const rememberStale = (responseId) => {
		staleResponseIds.delete(responseId);
		staleResponseIds.add(responseId);
		while (staleResponseIds.size > STALE_RESPONSE_LIMIT) {
			const oldest = staleResponseIds.values().next().value;
			if (!oldest) break;
			staleResponseIds.delete(oldest);
		}
	};
	return {
		accept(responseId) {
			if (responseId && staleResponseIds.has(responseId)) return false;
			if (blocked) {
				if (!blocked.responseId || !responseId || responseId === blocked.responseId) return false;
				blocked = void 0;
			}
			if (responseId) currentResponseId = responseId;
			return true;
		},
		block() {
			if (blocked) return {
				blocked: false,
				token: blocked.token
			};
			const token = Symbol("meeting-realtime-output-blocked");
			const responseId = currentResponseId ?? announcedResponseId;
			blocked = {
				...responseId ? { responseId } : {},
				token
			};
			if (responseId) rememberStale(responseId);
			nextResponseId = void 0;
			return {
				blocked: true,
				token
			};
		},
		clearBlocked() {
			if (!blocked) return false;
			blocked = void 0;
			return true;
		},
		isBlockedBy(token) {
			return blocked?.token === token;
		},
		noteEvent(event) {
			if (event.direction === "server" && event.type === "response.created" && event.responseId) {
				announcedResponseId = event.responseId;
				nextResponseId = void 0;
				return;
			}
			nextResponseId = event.direction === "server" && AUDIO_DELTA_EVENTS.has(event.type) ? event.responseId ?? announcedResponseId : void 0;
		},
		providerClear() {
			if (blocked) {
				if (!blocked.responseId) blocked = void 0;
				return false;
			}
			const responseId = currentResponseId ?? announcedResponseId;
			if (responseId) {
				blocked = {
					responseId,
					token: Symbol("meeting-realtime-output-blocked")
				};
				rememberStale(responseId);
			}
			nextResponseId = void 0;
			return true;
		},
		reset() {
			nextResponseId = void 0;
			announcedResponseId = void 0;
			currentResponseId = void 0;
			blocked = void 0;
			staleResponseIds.clear();
		},
		takeNextResponseId() {
			const responseId = nextResponseId ?? announcedResponseId;
			nextResponseId = void 0;
			return responseId;
		},
		terminal(responseId) {
			if (!responseId || !blocked?.responseId || blocked.responseId === responseId) blocked = void 0;
			if (!responseId || announcedResponseId === responseId) announcedResponseId = void 0;
			if (responseId && currentResponseId && currentResponseId !== responseId) return false;
			currentResponseId = void 0;
			return true;
		}
	};
}
//#endregion
//#region src/meeting-bot/realtime-tool-continuity.ts
const meetingRealtimeToolAbortSignals = /* @__PURE__ */ new WeakMap();
function readMeetingRealtimeToolAbortSignal(session) {
	return meetingRealtimeToolAbortSignals.get(session);
}
function createMeetingRealtimeToolContinuity(handleToolCall) {
	let epoch = 0;
	const activeControllers = /* @__PURE__ */ new Set();
	const reset = (reason) => {
		epoch += 1;
		for (const controller of activeControllers) controller.abort(reason);
		activeControllers.clear();
	};
	const runConsult = async (request, consult) => {
		const controller = new AbortController();
		activeControllers.add(controller);
		const signal = request.signal ? AbortSignal.any([controller.signal, request.signal]) : controller.signal;
		try {
			signal.throwIfAborted();
			const result = await consult({
				...request,
				signal
			});
			signal.throwIfAborted();
			return result;
		} finally {
			activeControllers.delete(controller);
		}
	};
	const run = (params) => {
		const callEpoch = epoch;
		const controller = new AbortController();
		activeControllers.add(controller);
		const isActive = () => !controller.signal.aborted && callEpoch === epoch;
		const turnId = params.harness.ensureTurn();
		params.harness.emit({
			type: "tool.call",
			turnId,
			itemId: params.call.event.itemId,
			callId: params.call.event.callId,
			payload: {
				name: params.call.event.name,
				args: params.call.event.args
			}
		});
		const guardedSession = Object.create(params.session);
		meetingRealtimeToolAbortSignals.set(guardedSession, controller.signal);
		guardedSession.submitToolResult = (callId, result, options) => {
			if (!isActive()) return;
			return params.session.submitToolResult(callId, result, options);
		};
		return handleToolCall({
			...params.call,
			session: guardedSession,
			onTalkEvent: (event) => {
				if (isActive()) params.harness.emit({
					...event,
					turnId: event.turnId ?? turnId
				});
			}
		}).catch((error) => {
			if (isActive()) throw error;
		}).finally(() => {
			meetingRealtimeToolAbortSignals.delete(guardedSession);
			activeControllers.delete(controller);
		});
	};
	return {
		reset,
		run,
		runConsult
	};
}
const MEETING_OUTPUT_ECHO_SUPPRESSION_TAIL_MS = 3e3;
const MEETING_TRANSCRIPT_ECHO_LOOKBACK_MS = 45e3;
async function startMeetingRealtimeEngine(params) {
	let stopped = false;
	let stopPromise;
	let bridgeClosed = false;
	let transportStopped = false;
	let transportDisposed = false;
	let bridge;
	const lifecycle = {
		realtimeReady: false,
		outputGenerationActive: false,
		continuityResetActive: false
	};
	const outputOwner = createMeetingRealtimeOutputOwner();
	const toolContinuity = createMeetingRealtimeToolContinuity(params.handleToolCall);
	const realtimeLogScope = params.logPrefix ? `${params.logPrefix} realtime` : "realtime";
	const audioFormat = resolveMeetingRealtimeAudioFormat(params.config.chrome.audioFormat);
	const outputQueue = createMeetingRealtimeOutputQueue({
		transport: params.transport,
		bytesPerMs: meetingOutputBytesPerMs(params.config.chrome.audioFormat),
		onFailure: (source, error) => {
			params.logger.warn(`${params.platform.logScope} ${realtimeLogScope} ${source} failed: ${formatErrorMessage(error)}`);
			stopAfterFailure(source);
		}
	});
	const stop = async () => {
		if (!stopped) {
			stopped = true;
			outputOwner.reset();
			outputQueue.stop();
			lifecycle.outputGenerationActive = false;
			toolContinuity.reset("meeting realtime stopped");
			harness.talkback?.close();
			harness.forcedConsults.clear();
		}
		if (stopPromise) {
			await stopPromise;
			return;
		}
		const cleanup = Promise.resolve().then(async () => {
			if (!bridgeClosed) try {
				await bridge?.close();
			} catch (error) {
				params.logger.debug?.(`${params.platform.logScope} ${realtimeLogScope}${params.logPrefix ? "" : " voice"} bridge close ignored: ${formatErrorMessage(error)}`);
			} finally {
				bridgeClosed = true;
				harness.close();
			}
			let cleanupError;
			if (!transportStopped) try {
				await params.transport.stop();
				transportStopped = true;
			} catch (error) {
				cleanupError = error;
			}
			if (!transportDisposed) try {
				await params.transport.dispose();
				transportDisposed = true;
			} catch (error) {
				cleanupError ??= error;
			}
			if (cleanupError) throw cleanupError instanceof Error ? cleanupError : new Error("Meeting realtime transport cleanup failed", { cause: cleanupError });
		});
		stopPromise = cleanup;
		try {
			await cleanup;
		} finally {
			if (stopPromise === cleanup) stopPromise = void 0;
		}
	};
	const stopAfterFailure = (source) => {
		stop().catch((error) => {
			params.logger.warn(`${params.platform.logScope} ${realtimeLogScope} ${source} cleanup failed: ${formatErrorMessage(error)}`);
		});
	};
	const invalidateOutputPlayback = () => {
		outputQueue.invalidate();
		lifecycle.outputGenerationActive = false;
	};
	const invalidateAndClearOutputPlayback = () => {
		blockOutput();
		outputQueue.clear();
	};
	const blockOutput = () => {
		const result = outputOwner.block();
		invalidateOutputPlayback();
		return result;
	};
	const handleOutputBackpressure = () => {
		const { pendingBytes, pendingFrames } = outputQueue.pending();
		const block = bridge?.bridge.outputAudioMode === "continuous" ? void 0 : blockOutput();
		if (block && !block.blocked) return;
		params.logger.warn(`${params.platform.logScope} ${realtimeLogScope} audio output backpressured: pendingBytes=${pendingBytes} pendingFrames=${pendingFrames}`);
		if (!block) invalidateOutputPlayback();
		harness.flushOutput(outputQueue.clear);
		harness.finishOutputAudio("output-backpressure");
		if (!block) return;
		queueMicrotask(() => {
			if (stopped || !outputOwner.isBlockedBy(block.token)) return;
			harness.handleBargeIn({
				audioPlaybackActive: true,
				force: true
			}, () => {});
		});
	};
	const startHumanBargeInMonitor = () => {
		if (!params.transport.startBargeInMonitor || !resolveRealtimeVoiceBargeIn({
			configuredBargeIn: void 0,
			interruptResponseOnInputAudio: void 0,
			capabilities: resolved.capabilities,
			outputAudioMode: bridge?.bridge.outputAudioMode
		})) return;
		params.transport.startBargeInMonitor(() => {
			if (stopped || !harness.outputActivity.isInterruptible()) return false;
			const now = Date.now();
			const playbackActive = harness.isOutputPlaybackWindowActive();
			const lastOutputAudioAt = harness.outputActivity.snapshot().lastAudioAt;
			if (!playbackActive && (lastOutputAudioAt === void 0 || now - lastOutputAudioAt > 1e3)) return false;
			harness.handleBargeIn({ audioPlaybackActive: true }, invalidateAndClearOutputPlayback);
			return true;
		});
	};
	const resolved = resolveMeetingRealtimeProvider({
		config: params.config,
		fullConfig: params.fullConfig,
		providers: params.providers
	});
	const strategy = params.config.realtime.strategy;
	params.logger.info(formatMeetingRealtimeVoiceModelLog({
		logScope: params.platform.logScope,
		strategy,
		provider: resolved.provider,
		providerConfig: resolved.providerConfig,
		fallbackModel: params.config.realtime.model,
		audioFormat: params.config.chrome.audioFormat
	}));
	const meetingTalkPayload = params.talkContext ? {
		bridgeId: params.talkContext.bridgeId,
		meetingSessionId: params.meetingSessionId
	} : { meetingSessionId: params.meetingSessionId };
	const outputTalkPayload = params.talkContext ? { bridgeId: params.talkContext.bridgeId } : { meetingSessionId: params.meetingSessionId };
	const reasonTalkPayload = (reason) => params.talkContext ? {
		bridgeId: params.talkContext.bridgeId,
		reason
	} : { reason };
	const harness = createRealtimeVoiceSessionHarness({
		talk: {
			sessionId: params.talkSessionId ?? `${params.platform.sessionIdPrefix}:${params.meetingSessionId}:command-realtime`,
			mode: "realtime",
			transport: "gateway-relay",
			brain: strategy === "bidi" && !resolved.capabilities?.handlesAgentConsult ? "direct-tools" : "agent-consult",
			provider: resolved.provider.id
		},
		talkPayloads: {
			turnStarted: () => meetingTalkPayload,
			turnEnded: reasonTalkPayload,
			inputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
			outputAudioStarted: () => outputTalkPayload,
			outputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
			outputAudioDone: reasonTalkPayload
		},
		echoSuppression: params.transport.inputAudioIsolated ? void 0 : {
			bytesPerMs: meetingOutputBytesPerMs(params.config.chrome.audioFormat),
			tailMs: MEETING_OUTPUT_ECHO_SUPPRESSION_TAIL_MS,
			transcriptLookbackMs: MEETING_TRANSCRIPT_ECHO_LOOKBACK_MS
		},
		talkback: {
			debounceMs: 900,
			logger: params.logger,
			logPrefix: `${params.platform.logScope} ${realtimeLogScope} agent`,
			responseStyle: "Brief, natural spoken answer for a live meeting.",
			fallbackText: "I hit an error while checking that. Please try again.",
			consult: ({ question, responseStyle, signal }) => params.consultAgent({
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				args: {
					question,
					responseStyle
				},
				transcript: harness.transcript,
				abortSignal: signal
			}),
			deliver: (text) => {
				bridge?.sendUserMessage(buildMeetingSpeakExactUserMessage(text));
			}
		}
	});
	harness.emit({
		type: "session.started",
		payload: params.talkContext ? {
			...meetingTalkPayload,
			nodeId: params.talkContext.nodeId
		} : meetingTalkPayload
	});
	params.transport.onFatal(() => {
		stopAfterFailure("audio transport");
	});
	if (stopped) throw new Error(`${params.platform.displayName} audio transport failed before realtime provider setup`);
	const lifecycleHandlers = createMeetingRealtimeLifecycleHandlers({
		clearOutputPlayback: outputQueue.clear,
		lifecycle,
		harness,
		invalidateOutputPlayback,
		logger: params.logger,
		logScope: params.platform.logScope,
		outputOwner,
		outputTalkPayload,
		realtimeLogScope,
		resetToolContinuity: (reason) => toolContinuity.reset(reason)
	});
	try {
		const requireIsolatedInput = () => {
			if (!params.transport.inputAudioIsolated) throw new Error(`${params.platform.displayName} native live voice requires isolated meeting audio input. Remove chrome.audioInputCommand to use managed browser capture, which must be available before connecting.`);
		};
		if (resolved.capabilities?.handlesInputAudioBargeIn === true && resolved.capabilities.supportsBargeIn === false) requireIsolatedInput();
		bridge = harness.createBridge({
			provider: resolved.provider,
			capabilities: resolved.capabilities,
			cfg: params.fullConfig,
			agentId: params.config.realtime.agentId,
			providerConfig: resolved.providerConfig,
			audioFormat,
			instructions: params.config.realtime.instructions,
			initialGreetingInstructions: params.config.realtime.introMessage,
			autoRespondToAudio: strategy === "bidi",
			triggerGreetingOnReady: false,
			markStrategy: "ack-immediately",
			tools: strategy === "bidi" && !resolved.capabilities?.handlesAgentConsult ? params.tools : [],
			...resolved.capabilities?.handlesAgentConsult ? { runAgentConsult: (request) => {
				if (stopped) throw new Error("Meeting realtime session is closed");
				return toolContinuity.runConsult(request, ({ prompt, signal }) => {
					if (params.config.realtime.toolPolicy === "none") throw new Error("Agent delegation is disabled by the meeting tool policy");
					return params.consultAgent({
						meetingSessionId: params.meetingSessionId,
						requesterSessionKey: params.requesterSessionKey,
						args: { question: prompt },
						transcript: harness.transcript,
						abortSignal: signal
					});
				});
			} } : {},
			audioSink: {
				isOpen: () => !stopped,
				sendAudio: (audio) => {
					const responseId = outputOwner.takeNextResponseId();
					const continuous = bridge?.bridge.outputAudioMode === "continuous";
					const audible = !continuous || isRealtimeVoiceAudioAudible(audio, audioFormat);
					if (!audible && !outputQueue.hasUnplayedAudibleAudio()) {
						if (lifecycle.outputGenerationActive) {
							lifecycle.outputGenerationActive = false;
							harness.finishOutputAudio("silence");
						}
						return;
					}
					if (stopped || !continuous && !outputOwner.accept(responseId)) return;
					if (!outputQueue.enqueue(audio, audible, !lifecycle.outputGenerationActive)) {
						handleOutputBackpressure();
						return;
					}
					lifecycle.outputGenerationActive = true;
					harness.outputActivity.markPlaybackStarted();
					harness.recordOutputAudio(audio);
				},
				clearAudio: () => {
					const continuous = bridge?.bridge.outputAudioMode === "continuous";
					if (!continuous && !outputOwner.providerClear()) return;
					if (continuous) outputOwner.reset();
					invalidateOutputPlayback();
					harness.flushOutput(outputQueue.clear);
					harness.finishOutputAudio("clear");
				}
			},
			onTranscript: (role, text, isFinal) => {
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
					payload: outputTalkPayload,
					final: true
				});
				if (!isFinal) return;
				params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${realtimeLogScope} ${role}`, text));
				if (role !== "user" || strategy !== "agent") return;
				if (harness.isLikelyAssistantEchoTranscript(text)) {
					params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${realtimeLogScope} ignored assistant echo transcript`, text));
					return;
				}
				if (!stopped) harness.talkback?.enqueue(text);
			},
			onEvent: lifecycleHandlers.onEvent,
			onResponseDone: lifecycleHandlers.onResponseDone,
			onToolCall: (event, session) => {
				if (stopped) return Promise.resolve();
				return toolContinuity.run({
					session,
					call: {
						strategy,
						event,
						meetingSessionId: params.meetingSessionId,
						requesterSessionKey: params.requesterSessionKey,
						transcript: harness.transcript
					},
					harness
				});
			},
			onError: (error) => {
				harness.emit({
					type: "session.error",
					payload: { message: formatErrorMessage(error) },
					final: true
				});
				params.logger.warn(`${params.platform.logScope} ${realtimeLogScope} voice bridge failed: ${formatErrorMessage(error)}`);
			},
			onClose: (reason) => {
				lifecycle.outputGenerationActive = false;
				lifecycle.realtimeReady = false;
				harness.finishOutputAudio(reason);
				harness.emit({
					type: "session.closed",
					payload: { reason },
					final: true
				});
				stopAfterFailure("voice bridge close");
			},
			onReady: () => {
				lifecycle.realtimeReady = true;
				lifecycle.continuityResetActive = false;
				harness.emit({
					type: "session.ready",
					payload: outputTalkPayload
				});
			}
		});
		if (bridge.bridge.outputAudioMode === "continuous") requireIsolatedInput();
		startHumanBargeInMonitor();
		params.transport.startInput((audio) => {
			if (stopped || audio.byteLength === 0) return;
			if (!harness.recordInputAudio(audio)) return;
			bridge?.sendAudio(audio);
		});
		await bridge.connect();
		if (stopped) throw new Error(`${params.platform.displayName} audio transport stopped during realtime provider setup`);
	} catch (error) {
		try {
			await stop();
		} catch (cleanupError) {
			params.logger.debug?.(`${params.platform.logScope} ${realtimeLogScope} failed-start cleanup ignored: ${formatErrorMessage(cleanupError)}`);
			try {
				await stop();
			} catch (retryError) {
				params.logger.debug?.(`${params.platform.logScope} ${realtimeLogScope} failed-start cleanup retry ignored: ${formatErrorMessage(retryError)}`);
			}
		}
		throw error;
	}
	return {
		providerId: resolved.provider.id,
		speak: (instructions) => {
			bridge?.triggerGreeting(instructions);
		},
		getHealth: () => ({
			...harness.getHealth({
				providerConnected: bridge?.bridge.isConnected() ?? false,
				realtimeReady: lifecycle.realtimeReady
			}),
			...bridge?.bridge.outputAudioMode === "continuous" ? { audioOutputActive: outputQueue.hasUnplayedAudibleAudio() } : {},
			...params.transport.getHealth?.(),
			...outputQueue.getHealth(),
			bridgeClosed
		}),
		stop
	};
}
//#endregion
//#region src/meeting-bot/realtime-agent-engine.ts
async function startMeetingAgentRealtimeEngine(params) {
	let stopped = false;
	let stopPromise;
	let sttSession = null;
	let realtimeReady = false;
	let ttsQueue = Promise.resolve();
	const agentLogScope = params.logPrefix ? `${params.logPrefix} agent` : "agent";
	const resolved = resolveMeetingRealtimeTranscriptionProvider({
		config: params.config,
		fullConfig: params.fullConfig,
		providers: params.providers
	});
	params.logger.info(formatMeetingAgentAudioModelLog({
		logScope: params.platform.logScope,
		provider: resolved.provider,
		providerConfig: resolved.providerConfig,
		audioFormat: params.config.chrome.audioFormat
	}));
	const stop = async () => {
		if (stopped) {
			await stopPromise;
			return;
		}
		stopped = true;
		stopPromise = (async () => {
			harness.close();
			try {
				sttSession?.close();
			} catch (error) {
				params.logger.debug?.(`${params.platform.logScope} ${agentLogScope} transcription bridge close ignored: ${formatErrorMessage(error)}`);
			}
			harness.finishOutputAudio("stopped");
			harness.endTurn("stopped");
			harness.emit({
				type: "session.closed",
				final: true,
				payload: { meetingSessionId: params.meetingSessionId }
			});
			try {
				await params.transport.stop();
			} finally {
				await params.transport.dispose();
			}
		})();
		await stopPromise;
	};
	const stopAfterFailure = (source) => {
		stop().catch((error) => {
			params.logger.warn(`${params.platform.logScope} ${agentLogScope} ${source} cleanup failed: ${formatErrorMessage(error)}`);
		});
	};
	const writeOutputAudio = async (audio) => {
		params.transport.beginOutput?.();
		harness.outputActivity.markPlaybackStarted();
		harness.recordOutputAudio(audio);
		await params.transport.writeOutput(audio);
	};
	const enqueueSpeakText = (text) => {
		const normalized = normalizeMeetingTtsPromptText(text);
		if (!normalized || stopped) return;
		ttsQueue = ttsQueue.then(async () => {
			if (stopped) return;
			harness.recordTranscript("assistant", normalized);
			params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${agentLogScope} assistant`, normalized));
			const turnId = harness.ensureTurn();
			harness.emit({
				type: "output.text.done",
				turnId,
				final: true,
				payload: {
					meetingSessionId: params.meetingSessionId,
					text: normalized
				}
			});
			const result = await params.runtime.tts.textToSpeechTelephony({
				text: normalized,
				cfg: params.fullConfig
			});
			if (stopped) return;
			if (!result.success || !result.audioBuffer || !result.sampleRate) throw new Error(result.error ?? "TTS conversion failed");
			params.logger.info(formatMeetingAgentTtsResultLog(params.platform.logScope, agentLogScope, result));
			await writeOutputAudio(convertMeetingTtsAudioForBridge(result.audioBuffer, result.sampleRate, params.config.chrome.audioFormat, result.outputFormat, params.platform.displayName));
			if (stopped) return;
			harness.finishOutputAudio("completed");
			harness.endTurn();
		}).catch((error) => {
			if (stopped) return;
			harness.finishOutputAudio("failed");
			harness.endTurn("failed");
			params.logger.warn(`${params.platform.logScope} ${agentLogScope} TTS failed: ${formatErrorMessage(error)}`);
		});
	};
	const harness = createRealtimeVoiceSessionHarness({
		talk: {
			sessionId: `${params.platform.sessionIdPrefix}:${params.meetingSessionId}:agent`,
			mode: "stt-tts",
			transport: "gateway-relay",
			brain: "agent-consult",
			provider: resolved.provider.id,
			turnIdPrefix: `${params.platform.sessionIdPrefix}:${params.meetingSessionId}:turn`
		},
		talkPayloads: {
			turnStarted: () => ({ meetingSessionId: params.meetingSessionId }),
			turnEnded: () => ({ meetingSessionId: params.meetingSessionId }),
			inputAudioDelta: (audio) => ({
				meetingSessionId: params.meetingSessionId,
				bytes: audio.byteLength
			}),
			outputAudioStarted: () => ({ meetingSessionId: params.meetingSessionId }),
			outputAudioDelta: (audio) => ({
				meetingSessionId: params.meetingSessionId,
				bytes: audio.byteLength
			}),
			outputAudioDone: () => ({ meetingSessionId: params.meetingSessionId })
		},
		echoSuppression: params.transport.inputAudioIsolated ? void 0 : {
			bytesPerMs: meetingOutputBytesPerMs(params.config.chrome.audioFormat),
			tailMs: MEETING_OUTPUT_ECHO_SUPPRESSION_TAIL_MS,
			transcriptLookbackMs: MEETING_TRANSCRIPT_ECHO_LOOKBACK_MS
		},
		talkback: {
			debounceMs: 900,
			logger: params.logger,
			logPrefix: `${params.platform.logScope} ${agentLogScope}`,
			responseStyle: "Brief, natural spoken answer for a live meeting.",
			fallbackText: "I hit an error while checking that. Please try again.",
			consult: ({ question, responseStyle, signal }) => params.consultAgent({
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				args: {
					question,
					responseStyle
				},
				transcript: harness.transcript,
				abortSignal: signal
			}),
			deliver: enqueueSpeakText
		}
	});
	params.transport.onFatal(() => {
		stopAfterFailure("audio transport");
	});
	if (stopped) throw new Error(`${params.platform.displayName} audio transport failed before transcription provider setup`);
	try {
		sttSession = resolved.provider.createSession({
			cfg: params.fullConfig,
			providerConfig: resolved.providerConfig,
			onTranscript: (text) => {
				const trimmed = text.trim();
				if (!trimmed || stopped) return;
				const turnId = harness.ensureTurn();
				harness.emit({
					type: "input.audio.committed",
					turnId,
					final: true,
					payload: { meetingSessionId: params.meetingSessionId }
				});
				harness.emit({
					type: "transcript.done",
					turnId,
					final: true,
					payload: {
						meetingSessionId: params.meetingSessionId,
						text: trimmed,
						role: "user"
					}
				});
				harness.recordTranscript("user", trimmed);
				params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${agentLogScope} user`, trimmed));
				if (harness.isLikelyAssistantEchoTranscript(trimmed)) {
					params.logger.info(formatMeetingTranscriptSummaryLog(params.platform.logScope, `${agentLogScope} ignored assistant echo transcript`, trimmed));
					return;
				}
				harness.talkback?.enqueue(trimmed);
			},
			onError: (error) => {
				params.logger.warn(`${params.platform.logScope} ${agentLogScope} transcription bridge failed: ${formatErrorMessage(error)}`);
				harness.emit({
					type: "session.error",
					final: true,
					payload: {
						meetingSessionId: params.meetingSessionId,
						error: formatErrorMessage(error)
					}
				});
				stopAfterFailure("transcription bridge");
			}
		});
		harness.emit({
			type: "session.started",
			payload: {
				meetingSessionId: params.meetingSessionId,
				provider: resolved.provider.id
			}
		});
		params.transport.startInput((audio) => {
			if (stopped || !realtimeReady || audio.byteLength === 0) return;
			if (!harness.recordInputAudio(audio)) return;
			sttSession?.sendAudio(convertMeetingBridgeAudioForStt(audio, params.config.chrome.audioFormat));
		});
		await sttSession.connect();
	} catch (error) {
		try {
			await stop();
		} catch (cleanupError) {
			params.logger.debug?.(`${params.platform.logScope} ${agentLogScope} failed-start cleanup ignored: ${formatErrorMessage(cleanupError)}`);
		}
		throw error;
	}
	if (stopped) throw new Error(`${params.platform.displayName} audio transport stopped during transcription provider setup`);
	realtimeReady = true;
	harness.emit({
		type: "session.ready",
		payload: { meetingSessionId: params.meetingSessionId }
	});
	return {
		providerId: resolved.provider.id,
		speak: enqueueSpeakText,
		getHealth: () => ({
			...harness.getHealth({
				providerConnected: sttSession?.isConnected() ?? false,
				realtimeReady
			}),
			...params.transport.getHealth?.(),
			bridgeClosed: stopped
		}),
		stop
	};
}
//#endregion
//#region src/meeting-bot/bridge-process.ts
function hasExited(proc) {
	return proc.exitCode !== null || proc.signalCode !== null;
}
function waitForExit(proc, timeoutMs) {
	if (hasExited(proc)) return Promise.resolve(true);
	return new Promise((resolve) => {
		let settled = false;
		const finish = (exited) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			proc.off("exit", onExit);
			resolve(exited);
		};
		const onExit = () => finish(true);
		const timeout = setTimeout(() => finish(hasExited(proc)), timeoutMs);
		timeout.unref?.();
		proc.once("exit", onExit);
		if (hasExited(proc)) finish(true);
	});
}
/** Settles after the bridge exits or the bounded force-kill sequence finishes. */
async function terminateMeetingBridgeProcess(proc, options) {
	if (!proc || hasExited(proc)) return;
	const initialSignal = options.initialSignal ?? "SIGTERM";
	try {
		if (!proc.kill(initialSignal)) return;
	} catch {
		return;
	}
	const forceKillWaitMs = options.forceKillWaitMs ?? 1e3;
	if (initialSignal === "SIGKILL") {
		await waitForExit(proc, forceKillWaitMs);
		return;
	}
	if (await waitForExit(proc, options.graceMs)) return;
	try {
		if (!proc.kill("SIGKILL")) return;
	} catch {
		return;
	}
	await waitForExit(proc, forceKillWaitMs);
}
//#endregion
//#region src/meeting-bot/command-argv.ts
function splitCommandArgv(argv, commandLabel) {
	const [command, ...args] = argv;
	if (!command) throw new Error(`${commandLabel} must not be empty`);
	return {
		command,
		args
	};
}
//#endregion
//#region src/meeting-bot/output-loopback-verifier.ts
const OUTPUT_LOOPBACK_OBSERVATION_WINDOW_MS = 5e3;
const OUTPUT_LOOPBACK_REFERENCE_MS = 500;
const OUTPUT_LOOPBACK_INPUT_HISTORY_MS = 1e4;
const OUTPUT_LOOPBACK_FINGERPRINT_POINTS = 64;
const OUTPUT_LOOPBACK_MIN_FINGERPRINT_POINTS = 16;
const OUTPUT_LOOPBACK_FULL_CORRELATION_THRESHOLD = .9;
const OUTPUT_LOOPBACK_SHORT_CORRELATION_THRESHOLD = .98;
const OUTPUT_LOOPBACK_RMS_THRESHOLD = 8;
const OUTPUT_LOOPBACK_PEAK_THRESHOLD = 32;
function decodeMeetingAudio(audio, audioFormat) {
	return audioFormat === "g711-ulaw-8khz" ? mulawToPcm(audio) : audio;
}
function hasSignal(stats) {
	return stats.rms >= OUTPUT_LOOPBACK_RMS_THRESHOLD || stats.peak >= OUTPUT_LOOPBACK_PEAK_THRESHOLD;
}
function createOutputFingerprint(pcm, fullReferenceBytes) {
	const totalSamples = Math.floor(pcm.byteLength * .5);
	let firstSignalSample = 0;
	while (firstSignalSample < totalSamples && Math.abs(pcm.readInt16LE(firstSignalSample * 2)) < OUTPUT_LOOPBACK_PEAK_THRESHOLD) firstSignalSample += 1;
	let lastSignalSample = totalSamples - 1;
	while (lastSignalSample >= firstSignalSample && Math.abs(pcm.readInt16LE(lastSignalSample * 2)) < OUTPUT_LOOPBACK_PEAK_THRESHOLD) lastSignalSample -= 1;
	const activePcm = pcm.subarray(firstSignalSample * 2, (lastSignalSample + 1) * 2);
	const sampleCount = Math.floor(activePcm.byteLength * .5);
	const pointCount = Math.min(OUTPUT_LOOPBACK_FINGERPRINT_POINTS, Math.floor(sampleCount * .25));
	if (pointCount < OUTPUT_LOOPBACK_MIN_FINGERPRINT_POINTS) return;
	const inversePointCount = pointCount ** -1;
	const selected = [];
	for (let point = 0; point < pointCount; point += 1) {
		const start = Math.floor(point * sampleCount * inversePointCount);
		const end = Math.max(start + 1, Math.floor((point + 1) * sampleCount * inversePointCount));
		let selectedIndex = start;
		let selectedSample = activePcm.readInt16LE(start * 2);
		for (let index = start + 1; index < end; index += 1) {
			const sample = activePcm.readInt16LE(index * 2);
			if (Math.abs(sample) > Math.abs(selectedSample)) {
				selectedIndex = index;
				selectedSample = sample;
			}
		}
		selected.push({
			index: selectedIndex,
			sample: selectedSample
		});
	}
	const baseIndex = selected[0]?.index ?? 0;
	const samples = selected.map((entry) => entry.sample);
	const inverseSamples = samples.length ** -1;
	const referenceMean = samples.reduce((sum, sample) => sum + sample, 0) * inverseSamples;
	const referenceVariance = samples.reduce((sum, sample) => {
		const delta = sample - referenceMean;
		return sum + delta * delta;
	}, 0);
	if (referenceVariance === 0) return;
	const offsets = selected.map((entry) => entry.index - baseIndex);
	return {
		offsets,
		referenceMean,
		referenceVariance,
		samples,
		spanSamples: (offsets.at(-1) ?? 0) + 1,
		threshold: activePcm.byteLength < fullReferenceBytes ? OUTPUT_LOOPBACK_SHORT_CORRELATION_THRESHOLD : OUTPUT_LOOPBACK_FULL_CORRELATION_THRESHOLD
	};
}
function fingerprintCorrelation(pcm, startSample, fingerprint) {
	let inputSum = 0;
	for (const offset of fingerprint.offsets) inputSum += pcm.readInt16LE((startSample + offset) * 2);
	const inputMean = inputSum * fingerprint.offsets.length ** -1;
	let covariance = 0;
	let inputVariance = 0;
	for (let index = 0; index < fingerprint.offsets.length; index += 1) {
		const referenceDelta = (fingerprint.samples[index] ?? 0) - fingerprint.referenceMean;
		const inputDelta = pcm.readInt16LE((startSample + (fingerprint.offsets[index] ?? 0)) * 2) - inputMean;
		covariance += referenceDelta * inputDelta;
		inputVariance += inputDelta * inputDelta;
	}
	if (inputVariance === 0) return 0;
	return Math.abs(covariance * (fingerprint.referenceVariance * inputVariance) ** -.5);
}
/** Correlates sink audio with the same waveform returning on the microphone capture path. */
function createMeetingOutputLoopbackVerifier(options) {
	const now = options.now ?? Date.now;
	const sampleRate = options.audioFormat === "g711-ulaw-8khz" ? 8e3 : 24e3;
	const fullReferenceBytes = sampleRate * OUTPUT_LOOPBACK_REFERENCE_MS * .001 * 2;
	const maxInputHistoryBytes = sampleRate * OUTPUT_LOOPBACK_INPUT_HISTORY_MS * .001 * 2;
	let generationStarted = false;
	let generationVerified = false;
	let outputGeneration = 0;
	let verifiedOutputGeneration;
	let inputPcm = Buffer.alloc(0);
	let nextInputStartSample = 0;
	let outputFingerprint;
	let pendingOutputPcm = Buffer.alloc(0);
	let outputObservationDeadlineMs = Number.NEGATIVE_INFINITY;
	let outputQueuedUntilMs = Number.NEGATIVE_INFINITY;
	let outputLoopbackSignalBytes = 0;
	let lastOutputLoopbackAt;
	let lastOutputLoopbackCorrelation;
	let lastOutputLoopbackPeak;
	let lastOutputLoopbackRms;
	const clearCorrelationScratch = () => {
		inputPcm = Buffer.alloc(0);
		nextInputStartSample = 0;
		outputFingerprint = void 0;
		pendingOutputPcm = Buffer.alloc(0);
	};
	const resetGeneration = (started) => {
		generationStarted = started;
		generationVerified = false;
		if (started) outputGeneration += 1;
		clearCorrelationScratch();
		outputObservationDeadlineMs = Number.NEGATIVE_INFINITY;
		outputQueuedUntilMs = Number.NEGATIVE_INFINITY;
	};
	const refreshFingerprint = (fingerprint) => {
		outputFingerprint = fingerprint;
		const inputSampleCount = Math.floor(inputPcm.byteLength * .5);
		const rescanTailSamples = sampleRate * OUTPUT_LOOPBACK_REFERENCE_MS * .001;
		nextInputStartSample = Math.max(0, inputSampleCount - rescanTailSamples);
	};
	const consumePendingOutput = () => {
		const pendingBytes = pendingOutputPcm.byteLength;
		for (let end = pendingBytes; end >= fullReferenceBytes; end -= fullReferenceBytes) {
			const fingerprint = createOutputFingerprint(pendingOutputPcm.subarray(end - fullReferenceBytes, end), fullReferenceBytes);
			if (fingerprint) {
				pendingOutputPcm = Buffer.alloc(0);
				refreshFingerprint(fingerprint);
				return;
			}
		}
		const residualBytes = pendingBytes % fullReferenceBytes;
		if (residualBytes > 0) {
			const fingerprint = createOutputFingerprint(pendingOutputPcm.subarray(0, residualBytes), fullReferenceBytes);
			if (fingerprint) {
				pendingOutputPcm = Buffer.alloc(0);
				refreshFingerprint(fingerprint);
				return;
			}
		}
		pendingOutputPcm = pendingBytes > fullReferenceBytes ? pendingOutputPcm.subarray(pendingBytes - fullReferenceBytes) : pendingOutputPcm;
	};
	return {
		beginOutput() {
			resetGeneration(true);
		},
		cancelOutput() {
			resetGeneration(false);
		},
		recordInput(audio) {
			const capturedAtMs = now();
			if (!generationStarted || generationVerified || audio.byteLength === 0 || capturedAtMs > outputObservationDeadlineMs) return;
			const decoded = decodeMeetingAudio(audio, options.audioFormat);
			const chunkStats = readPcm16AudioStats(decoded);
			const combinedInput = inputPcm.byteLength > 0 ? Buffer.concat([inputPcm, decoded]) : decoded;
			const droppedInputBytes = Math.max(0, combinedInput.byteLength - maxInputHistoryBytes);
			inputPcm = droppedInputBytes > 0 ? combinedInput.subarray(droppedInputBytes) : combinedInput;
			if (droppedInputBytes > 0) nextInputStartSample = Math.max(0, nextInputStartSample - Math.floor(droppedInputBytes * .5));
			const fingerprint = outputFingerprint;
			if (!fingerprint || !hasSignal(chunkStats)) return;
			const lastStartSample = Math.floor(inputPcm.byteLength * .5) - fingerprint.spanSamples;
			for (let startSample = nextInputStartSample; startSample <= lastStartSample; startSample += 1) {
				const matchedCorrelation = fingerprintCorrelation(inputPcm, startSample, fingerprint);
				if (matchedCorrelation < fingerprint.threshold) continue;
				const matchedPcm = inputPcm.subarray(startSample * 2, (startSample + fingerprint.spanSamples) * 2);
				const matchedStats = readPcm16AudioStats(matchedPcm);
				if (!hasSignal(matchedStats)) continue;
				generationVerified = true;
				verifiedOutputGeneration = outputGeneration;
				outputLoopbackSignalBytes += audio.byteLength;
				lastOutputLoopbackAt = new Date(capturedAtMs).toISOString();
				lastOutputLoopbackCorrelation = matchedCorrelation;
				lastOutputLoopbackPeak = matchedStats.peak;
				lastOutputLoopbackRms = matchedStats.rms;
				clearCorrelationScratch();
				return;
			}
			nextInputStartSample = Math.max(0, lastStartSample + 1);
		},
		recordOutput(audio) {
			const outputAtMs = now();
			if (!generationStarted || outputObservationDeadlineMs !== Number.NEGATIVE_INFINITY && outputAtMs > outputObservationDeadlineMs) resetGeneration(true);
			if (audio.byteLength === 0) return;
			const durationMs = (options.audioFormat === "g711-ulaw-8khz" ? audio.byteLength : audio.byteLength * .5) * sampleRate ** -1 * 1e3;
			outputQueuedUntilMs = Math.max(outputAtMs, outputQueuedUntilMs) + durationMs;
			outputObservationDeadlineMs = Math.max(outputObservationDeadlineMs, outputQueuedUntilMs + OUTPUT_LOOPBACK_OBSERVATION_WINDOW_MS);
			if (generationVerified) return;
			const decoded = decodeMeetingAudio(audio, options.audioFormat);
			pendingOutputPcm = Buffer.concat([pendingOutputPcm, decoded]);
			if (!outputFingerprint || pendingOutputPcm.byteLength >= fullReferenceBytes) consumePendingOutput();
		},
		getHealth() {
			return {
				lastOutputLoopbackAt,
				lastOutputLoopbackCorrelation,
				lastOutputLoopbackPeak,
				lastOutputLoopbackRms,
				outputLoopbackSignalBytes,
				outputGeneration,
				verifiedOutputGeneration
			};
		}
	};
}
//#endregion
//#region src/meeting-bot/realtime-local-audio-transport.ts
const LOCAL_BRIDGE_TERMINATION_GRACE_MS = 1e3;
const STDERR_LINE_TRUNCATED_PREFIX = "[stderr line truncated] ";
const MAX_STDERR_CHUNK_BYTES = 8192;
function attachStderrLineLogger(params) {
	if (!params.stderr) return;
	if (!params.logger.debug) {
		params.stderr.on("data", () => {});
		return;
	}
	const debug = (message) => params.logger.debug?.(message);
	if (!(params.stderr instanceof Readable)) {
		params.stderr.on("data", (chunk) => {
			debug(`${params.prefix}: ${String(chunk).trim()}`);
		});
		return;
	}
	onDecodedOutput(params.stderr, (chunk) => {
		const trimmed = chunk.trim();
		if (!trimmed) return;
		const truncated = Buffer.byteLength(trimmed, "utf8") > MAX_STDERR_CHUNK_BYTES;
		const value = truncated ? truncateUtf8Suffix(trimmed, MAX_STDERR_CHUNK_BYTES) : trimmed;
		debug(`${params.prefix}: ${truncated ? STDERR_LINE_TRUNCATED_PREFIX : ""}${value}`);
	});
}
function createLocalMeetingRealtimeAudioTransport(params) {
	const input = splitCommandArgv(params.inputCommand, "audio bridge command");
	const output = splitCommandArgv(params.outputCommand, "audio bridge command");
	const spawnFn = params.spawn ?? ((command, args, options) => spawn(command, args, options));
	const spawnOutputProcess = () => spawnFn(output.command, output.args, { stdio: [
		"pipe",
		"ignore",
		"pipe"
	] });
	let outputProcess = spawnOutputProcess();
	const inputProcess = spawnFn(input.command, input.args, { stdio: [
		"ignore",
		"pipe",
		"pipe"
	] });
	let bargeInInputProcess;
	let stopped = false;
	let inputStarted = false;
	let fatalSignaled = false;
	let fatalHandler;
	let stopPromise;
	const retiredOutputStops = /* @__PURE__ */ new Set();
	const outputWriteWaiters = /* @__PURE__ */ new Set();
	const outputLoopbackVerifier = createMeetingOutputLoopbackVerifier({ audioFormat: params.audioFormat ?? "pcm16-24khz" });
	const signalFatal = () => {
		if (!fatalSignaled) {
			fatalSignaled = true;
			stop().catch((error) => {
				params.logger.warn(`${params.logScope} failed audio transport cleanup: ${formatErrorMessage(error)}`);
			});
			fatalHandler?.();
		}
	};
	const fail = (label) => (error) => {
		params.logger.warn(`${params.logScope} ${label} failed: ${formatErrorMessage(error)}`);
		signalFatal();
	};
	const attachOutputProcessHandlers = (proc) => {
		proc.on("error", (error) => {
			if (proc === outputProcess) fail("audio output command")(error);
		});
		proc.stdin?.on?.("error", (error) => {
			if (proc === outputProcess) fail("audio output command")(error);
		});
		proc.on("exit", (code, signal) => {
			if (proc === outputProcess && !stopped) {
				params.logger.warn(`${params.logScope} audio output command exited (${code ?? signal ?? "done"})`);
				signalFatal();
			}
		});
		attachStderrLineLogger({
			stderr: proc.stderr,
			logger: params.logger,
			prefix: `${params.logScope} audio output`
		});
		proc.stderr?.on("error", (error) => {
			if (proc === outputProcess) fail("audio output command stderr")(error);
		});
	};
	const writeOutputChunk = (proc, stdin, audio) => new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			outputWriteWaiters.delete(waiter);
			if (error) reject(error);
			else resolve();
		};
		const waiter = {
			proc,
			release: () => finish()
		};
		outputWriteWaiters.add(waiter);
		try {
			stdin.write(audio, (error) => finish(error ?? void 0));
		} catch (error) {
			finish(error instanceof Error ? error : new Error(formatErrorMessage(error)));
			return;
		}
		if (stdin.destroyed || stdin.writableEnded) finish(/* @__PURE__ */ new Error("audio output stream is closed"));
	});
	const releaseOutputWriteWaiters = (proc) => {
		for (const waiter of outputWriteWaiters) if (!proc || waiter.proc === proc) waiter.release();
	};
	const stop = () => {
		stopPromise ??= (async () => {
			stopped = true;
			outputLoopbackVerifier.cancelOutput();
			releaseOutputWriteWaiters();
			await Promise.all([
				terminateMeetingBridgeProcess(inputProcess, { graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS }),
				terminateMeetingBridgeProcess(outputProcess, { graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS }),
				terminateMeetingBridgeProcess(bargeInInputProcess, { graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS }),
				...retiredOutputStops
			]);
		})();
		return stopPromise;
	};
	attachOutputProcessHandlers(outputProcess);
	inputProcess.on("error", fail("audio input command"));
	inputProcess.on("exit", (code, signal) => {
		if (!stopped) {
			params.logger.warn(`${params.logScope} audio input command exited (${code ?? signal ?? "done"})`);
			signalFatal();
		}
	});
	attachStderrLineLogger({
		stderr: inputProcess.stderr,
		logger: params.logger,
		prefix: `${params.logScope} audio input`
	});
	inputProcess.stdout?.on("error", fail("audio input command stdout"));
	inputProcess.stderr?.on("error", fail("audio input command stderr"));
	const transport = {
		onFatal: (handler) => {
			fatalHandler = handler;
			if (fatalSignaled) handler();
		},
		startInput: (onAudio) => {
			if (inputStarted) throw new Error("audio input transport already started");
			inputStarted = true;
			inputProcess.stdout?.on("data", (chunk) => {
				if (!stopped) {
					const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
					outputLoopbackVerifier.recordInput(audio);
					onAudio(audio);
				}
			});
		},
		beginOutput: () => outputLoopbackVerifier.beginOutput(),
		stop,
		writeOutput: async (audio) => {
			if (stopped) return;
			const proc = outputProcess;
			const stdin = proc.stdin;
			if (!stdin) return;
			outputLoopbackVerifier.recordOutput(audio);
			try {
				await writeOutputChunk(proc, stdin, audio);
			} catch (error) {
				if (stopped || proc !== outputProcess || fatalSignaled) return;
				fail("audio output command")(error instanceof Error ? error : new Error(formatErrorMessage(error)));
			}
		},
		clearOutput: async () => {
			if (stopped) return;
			outputLoopbackVerifier.cancelOutput();
			const previousOutput = outputProcess;
			outputProcess = spawnOutputProcess();
			attachOutputProcessHandlers(outputProcess);
			releaseOutputWriteWaiters(previousOutput);
			params.logger.debug?.(`${params.logScope} cleared realtime audio output buffer by restarting playback command`);
			const retiredOutputStop = terminateMeetingBridgeProcess(previousOutput, {
				graceMs: LOCAL_BRIDGE_TERMINATION_GRACE_MS,
				initialSignal: "SIGKILL"
			});
			retiredOutputStops.add(retiredOutputStop);
			retiredOutputStop.finally(() => {
				retiredOutputStops.delete(retiredOutputStop);
			});
		},
		dispose: async () => {
			await transport.stop();
		},
		getHealth: () => outputLoopbackVerifier.getHealth()
	};
	if (!params.bargeInInputCommand) return transport;
	return {
		...transport,
		startBargeInMonitor: (onBargeIn) => {
			if (bargeInInputProcess || stopped) return;
			const command = splitCommandArgv(params.bargeInInputCommand ?? [], "audio bridge command");
			const bargeInGate = createSpeechThresholdGate({
				rmsThreshold: params.bargeInRmsThreshold,
				peakThreshold: params.bargeInPeakThreshold,
				cooldownMs: params.bargeInCooldownMs
			});
			bargeInInputProcess = spawnFn(command.command, command.args, { stdio: [
				"ignore",
				"pipe",
				"pipe"
			] });
			bargeInInputProcess.stdout?.on("data", (chunk) => {
				const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				if (stopped) return;
				const stats = readPcm16AudioStats(audio);
				if (!bargeInGate.accept(stats, {
					nowMs: Date.now(),
					onTrigger: () => onBargeIn(audio)
				})) return;
				params.logger.debug?.(`${params.logScope} human barge-in detected by local input (rms=${Math.round(stats.rms)}, peak=${stats.peak})`);
			});
			bargeInInputProcess.stdout?.on("error", (error) => {
				params.logger.warn(`${params.logScope} human barge-in input stdout failed: ${formatErrorMessage(error)}`);
			});
			attachStderrLineLogger({
				stderr: bargeInInputProcess.stderr,
				logger: params.logger,
				prefix: `${params.logScope} barge-in input`
			});
			bargeInInputProcess.stderr?.on("error", (error) => {
				params.logger.warn(`${params.logScope} human barge-in input stderr failed: ${formatErrorMessage(error)}`);
			});
			bargeInInputProcess.on("error", (error) => {
				params.logger.warn(`${params.logScope} human barge-in input failed: ${formatErrorMessage(error)}`);
			});
			bargeInInputProcess.on("exit", (code, signal) => {
				if (!stopped) params.logger.debug?.(`${params.logScope} human barge-in input exited (${code ?? signal ?? "done"})`);
			});
		}
	};
}
//#endregion
//#region src/meeting-bot/audio-base64.ts
function decodeMeetingAudioBase64(base64, action) {
	const canonicalBase64 = canonicalizeBase64(base64);
	if (!canonicalBase64) throw new Error(`${action} base64 must be a valid audio payload`);
	return Buffer.from(canonicalBase64, "base64");
}
function isMeetingAudioBase64(base64) {
	return canonicalizeBase64(base64) !== void 0;
}
//#endregion
//#region src/meeting-bot/realtime-node-audio-transport.ts
const NODE_OUTPUT_GENERATION_CAPABILITY = Symbol.for("openclaw.internal.meeting-node-output-generation.v1");
function createNodeMeetingRealtimeAudioTransport(params) {
	let stopped = false;
	let inputStarted = false;
	let consecutiveInputErrors = 0;
	let lastInputError;
	let fatalSignaled = false;
	let fatalHandler;
	let outputGeneration = 0;
	let outputGenerationSupported = false;
	let legacyOutputTail = Promise.resolve();
	const outputLoopbackVerifier = createMeetingOutputLoopbackVerifier({ audioFormat: params.audioFormat ?? "pcm16-24khz" });
	const runOutputCommand = (task) => {
		if (outputGenerationSupported) return task();
		const result = legacyOutputTail.then(task, task);
		legacyOutputTail = result.then(() => void 0, () => void 0);
		return result;
	};
	const signalFatal = () => {
		if (!fatalSignaled) {
			fatalSignaled = true;
			fatalHandler?.();
		}
	};
	const transport = {
		onFatal: (handler) => {
			fatalHandler = handler;
			if (fatalSignaled) handler();
		},
		startInput: (onAudio) => {
			if (inputStarted) throw new Error("audio input transport already started");
			inputStarted = true;
			(async () => {
				for (;;) {
					if (stopped) break;
					try {
						const raw = await params.runtime.nodes.invoke({
							nodeId: params.nodeId,
							command: params.commandName,
							params: {
								action: "pullAudio",
								bridgeId: params.bridgeId,
								timeoutMs: 250
							},
							timeoutMs: 2e3
						});
						if (stopped) break;
						const rawRecord = asOptionalRecord(raw);
						const result = asOptionalRecord(rawRecord?.payload ?? raw) ?? {};
						const base64 = readNonBlankString(result.base64);
						if (base64) {
							const audio = decodeMeetingAudioBase64(base64, "pullAudio");
							outputLoopbackVerifier.recordInput(audio);
							onAudio(audio);
						}
						consecutiveInputErrors = 0;
						lastInputError = void 0;
						if (result.closed === true) {
							signalFatal();
							break;
						}
					} catch (error) {
						if (stopped) break;
						const message = formatErrorMessage(error);
						consecutiveInputErrors += 1;
						lastInputError = message;
						params.logger.warn(`${params.logScope} ${params.logPrefix} audio input failed (${consecutiveInputErrors}/5): ${message}`);
						if (consecutiveInputErrors >= 5 || /unknown bridgeId|bridge is not open/i.test(message)) {
							signalFatal();
							break;
						}
						await new Promise((resolve) => {
							setTimeout(resolve, 250);
						});
					}
				}
			})();
		},
		beginOutput: () => outputLoopbackVerifier.beginOutput(),
		stop: async () => {
			if (stopped) return;
			stopped = true;
			outputLoopbackVerifier.cancelOutput();
			try {
				await params.runtime.nodes.invoke({
					nodeId: params.nodeId,
					command: params.commandName,
					params: {
						action: "stop",
						bridgeId: params.bridgeId
					},
					timeoutMs: 5e3
				});
			} catch (error) {
				params.logger.debug?.(`${params.logScope} node audio bridge stop ignored: ${formatErrorMessage(error)}`);
			}
		},
		writeOutput: async (audio) => {
			if (stopped) return;
			const generation = outputGeneration;
			outputLoopbackVerifier.recordOutput(audio);
			try {
				await runOutputCommand(async () => {
					if (stopped) return;
					await params.runtime.nodes.invoke({
						nodeId: params.nodeId,
						command: params.commandName,
						params: {
							action: "pushAudio",
							bridgeId: params.bridgeId,
							base64: audio.toString("base64"),
							...outputGenerationSupported ? { outputGeneration: generation } : {}
						},
						timeoutMs: 5e3
					});
				});
			} catch (error) {
				if (!stopped && generation === outputGeneration) outputLoopbackVerifier.cancelOutput();
				throw error;
			}
		},
		clearOutput: async () => {
			if (stopped) return;
			outputGeneration += 1;
			outputLoopbackVerifier.cancelOutput();
			await runOutputCommand(async () => {
				if (stopped) return;
				await params.runtime.nodes.invoke({
					nodeId: params.nodeId,
					command: params.commandName,
					params: {
						action: "clearAudio",
						bridgeId: params.bridgeId,
						...outputGenerationSupported ? { outputGeneration } : {}
					},
					timeoutMs: 5e3
				});
			});
		},
		dispose: async () => {
			await transport.stop();
		},
		getHealth: () => ({
			consecutiveInputErrors,
			lastInputError,
			...outputLoopbackVerifier.getHealth()
		})
	};
	Object.defineProperty(transport, NODE_OUTPUT_GENERATION_CAPABILITY, {
		get() {
			return outputGenerationSupported;
		},
		set(value) {
			outputGenerationSupported = value === true;
		}
	});
	return transport;
}
//#endregion
//#region src/meeting-bot/session-cleanup-tracker.ts
var MeetingSessionCleanupTracker = class {
	#states = /* @__PURE__ */ new Map();
	#state(sessionId) {
		let state = this.#states.get(sessionId);
		if (!state) {
			state = { stops: /* @__PURE__ */ new Set() };
			this.#states.set(sessionId, state);
		}
		return state;
	}
	prepareRuntime(sessionId, prepare) {
		const state = this.#state(sessionId);
		if (state.setup) return state.setup;
		const setup = Promise.resolve().then(prepare).finally(() => {
			if (state.setup === setup) state.setup = void 0;
		});
		state.setup = setup;
		return setup;
	}
	addStop(sessionId, stop) {
		this.#state(sessionId).stops.add(stop);
	}
	hasRuntime(sessionId) {
		const state = this.#states.get(sessionId);
		return Boolean(state?.setup || state?.stops.size);
	}
	retainFailedJoin(sessionId) {
		this.#state(sessionId).unpublished = true;
	}
	stopRuntime(sessionId) {
		const state = this.#states.get(sessionId);
		if (!state) return Promise.resolve();
		if (state.stopping) return state.stopping;
		const stopping = Promise.resolve().then(async () => {
			await state.setup?.catch(() => void 0);
			const failures = (await Promise.allSettled([...state.stops].map(async (stop) => {
				await stop();
				state.stops.delete(stop);
			}))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Meeting runtime cleanup failed");
		}).finally(() => {
			if (state.stopping === stopping) state.stopping = void 0;
		});
		state.stopping = stopping;
		return stopping;
	}
	begin(sessionId, browserLeft) {
		const state = this.#state(sessionId);
		if (state.cleanup) return false;
		state.cleanup = {
			browserLeft,
			browserSettled: false,
			stopSettled: false
		};
		return true;
	}
	isPending(sessionId) {
		return this.#states.get(sessionId)?.cleanup !== void 0;
	}
	async cleanup(params) {
		const state = this.#states.get(params.sessionId)?.cleanup;
		if (!state) throw new Error("Missing cleanup state for meeting session " + params.sessionId);
		let cleanupError;
		if (!state.stopSettled) try {
			await this.stopRuntime(params.sessionId);
			state.stopSettled = true;
		} catch (error) {
			cleanupError = error;
		}
		if (!state.browserSettled) try {
			if (params.keepBrowserTab) state.browserSettled = true;
			else {
				state.browserLeft = await params.releaseBrowser();
				state.browserSettled = state.browserLeft !== false || !params.hasBrowserTab();
			}
		} catch (error) {
			cleanupError ??= error;
		}
		const unpublished = this.#states.get(params.sessionId)?.unpublished === true;
		const complete = this.#completeIfSettled(params.sessionId, state);
		if (cleanupError) throw cleanupError instanceof Error ? cleanupError : new Error("Meeting session cleanup failed", { cause: cleanupError });
		return {
			browserLeft: state.browserLeft,
			complete,
			unpublished
		};
	}
	async retryBrowserAfterFailedJoin(params) {
		const state = this.#states.get(params.sessionId)?.cleanup;
		if (!state) return {
			browserLeft: params.browserLeft,
			complete: true,
			incomplete: false
		};
		if (!params.hasBrowserTab()) state.browserSettled = true;
		else if (!state.browserSettled) try {
			state.browserLeft = await params.releaseBrowser();
			state.browserSettled = state.browserLeft !== false;
		} catch (error) {
			return {
				browserLeft: state.browserLeft,
				complete: false,
				error,
				incomplete: params.hasBrowserTab()
			};
		}
		return {
			browserLeft: state.browserLeft,
			complete: this.#completeIfSettled(params.sessionId, state),
			incomplete: params.hasBrowserTab()
		};
	}
	async rollbackFailedJoin(params) {
		let retryFullCleanup = false;
		try {
			await params.leave();
		} catch (error) {
			params.warn(`replacement cleanup failed: ${params.formatError(error)}`);
			retryFullCleanup = true;
		}
		if (retryFullCleanup) try {
			await params.leave();
		} catch (error) {
			params.warn(`replacement cleanup retry failed: ${params.formatError(error)}`);
		}
		const retry = await this.retryBrowserAfterFailedJoin(params);
		params.onBrowserResult(retry.browserLeft);
		if (retry.error) params.warn(`replacement browser cleanup retry failed: ${params.formatError(retry.error)}`);
		if (retry.complete) params.onComplete();
		if (retry.incomplete) params.warn("replacement browser cleanup incomplete after failed join");
	}
	#completeIfSettled(sessionId, state) {
		if (!state.stopSettled || !state.browserSettled || this.hasRuntime(sessionId)) return false;
		this.#states.delete(sessionId);
		return true;
	}
};
//#endregion
//#region src/meeting-bot/session-durable-transcripts.ts
const STOP_RETRY_DELAY_MS = 1e3;
const STOP_RETRY_MAX_DELAY_MS = 6e4;
var MeetingSessionDurableTranscripts = class {
	#bridge;
	#enabled;
	#policyTransition = Promise.resolve();
	#stopRetries = /* @__PURE__ */ new Map();
	constructor(options) {
		this.options = options;
		this.#enabled = resolveTranscriptsConfig(options.config?.config).enabled;
	}
	reconcilePolicy(enabled) {
		this.#enabled = enabled;
		const reconcile = async () => {
			const bridge = await this.#getBridge();
			if (!bridge) return;
			await Promise.all(this.options.listSessions().map(async (session) => {
				if (session.state !== "active" || !this.options.isBrowserSession(session)) return;
				if (!enabled) await bridge.stop(session, async () => this.options.transcriptStore.captureNotes(session));
				else if (this.#enabled) {
					await bridge.stop(session, async () => this.options.transcriptStore.flushPending(session));
					this.#stopRetries.delete(session.id);
					await this.options.transcriptStore.captureNotes(session);
					if (this.#enabled && session.state === "active") await bridge.start(session, async () => this.options.transcriptStore.captureNotes(session));
				}
			}));
		};
		const transition = this.#policyTransition.then(reconcile);
		this.#policyTransition = transition.catch(() => {});
		return transition;
	}
	async ingest(session, lines) {
		await (await this.#getBridge())?.ingest(session, lines);
	}
	async start(session) {
		await this.#policyTransition;
		if (!this.#enabled || !this.options.isBrowserSession(session)) return;
		await (await this.#getBridge())?.start(session, async () => await this.options.transcriptStore.captureNotes(session));
	}
	async stop(session, options) {
		const finalCapture = async () => await this.options.transcriptStore.captureNotes(session, { finalize: true });
		const bridge = await this.#getBridge();
		if (bridge) try {
			if (await bridge.stop(session, finalCapture)) {
				this.#stopRetries.delete(session.id);
				return true;
			}
		} catch (error) {
			this.options.logger.warn(`${this.options.logScope} durable transcript finalization queued for retry: ${this.options.formatError(error)}`);
			this.#scheduleStopRetry(session, bridge);
			return false;
		}
		if (options.allowFallback && this.options.isTranscribeSession(session)) await finalCapture().catch((error) => {
			this.options.logger.debug?.(`${this.options.logScope} final transcript snapshot ignored: ${this.options.formatError(error)}`);
		});
		return true;
	}
	async startSource(request) {
		const bridge = await this.#getBridge();
		if (!bridge?.enabled) return {
			ok: false,
			error: "meeting transcripts are disabled"
		};
		const session = this.#findSourceSession(request.session.source);
		if (!session) return {
			ok: false,
			error: "No active meeting session matches the transcript source."
		};
		if (request.session.source.agentId !== session.agentId) return {
			ok: false,
			error: "meeting transcript source belongs to another agent"
		};
		return await bridge.attach(session, request);
	}
	async stopSource(request) {
		const bridge = await this.#getBridge();
		return bridge ? await bridge.detach(request) : {
			ok: true,
			sessionId: request.sessionId,
			stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	}
	#findSourceSession(source) {
		const agentId = source.agentId?.trim();
		const meetingUrl = source.meetingUrl?.trim();
		const sessionId = source.channelId?.trim();
		if (!agentId || !meetingUrl && !sessionId) return;
		return this.options.listSessions().filter((session) => session.state === "active").toSorted((left, right) => left.createdAt.localeCompare(right.createdAt)).find((session) => session.agentId === agentId && (!sessionId || session.id === sessionId) && (!meetingUrl || this.options.sameMeetingUrl(session.url, meetingUrl)));
	}
	async #getBridge() {
		if (!this.options.config) return;
		this.#bridge ??= import("../transcripts-bridge.runtime-BqyqYe3d.mjs").then(({ createMeetingDurableTranscriptBridge }) => createMeetingDurableTranscriptBridge({
			isEnabled: () => this.#enabled,
			logger: this.options.logger,
			options: this.options.config
		})).catch((error) => {
			this.options.logger.warn(`${this.options.logScope} durable transcripts unavailable: ${this.options.formatError(error)}`);
		});
		return await this.#bridge;
	}
	#scheduleStopRetry(session, bridge) {
		if (this.#stopRetries.has(session.id)) return;
		const token = Symbol(session.id);
		this.#stopRetries.set(session.id, {
			attempt: 1,
			token
		});
		const retry = () => {
			const attempt = this.#stopRetries.get(session.id)?.attempt ?? 1;
			const delayMs = Math.min(STOP_RETRY_DELAY_MS * 2 ** Math.min(attempt - 1, 16), STOP_RETRY_MAX_DELAY_MS);
			setTimeout(() => void run(), delayMs).unref?.();
		};
		const run = async () => {
			await this.#policyTransition;
			const state = this.#stopRetries.get(session.id);
			if (!state || state.token !== token) return;
			try {
				if (!await bridge.stop(session, async () => await this.options.transcriptStore.flushPending(session))) throw new Error("durable transcript capture is no longer active");
				if (this.#stopRetries.get(session.id)?.token !== token) return;
				this.options.transcriptStore.retire(session.id);
				this.#stopRetries.delete(session.id);
			} catch {
				if (this.#stopRetries.get(session.id)?.token !== token) return;
				this.#stopRetries.set(session.id, {
					attempt: state.attempt + 1,
					token
				});
				retry();
			}
		};
		retry();
	}
};
//#endregion
//#region src/meeting-bot/session-speech-readiness.ts
function evaluateMeetingSpeechReadiness(params) {
	const { browser, speech } = params;
	if (!params.talkBack || !browser) return { ready: true };
	if (!params.managedBrowser) return browser.hasAudioBridge ? { ready: true } : {
		ready: false,
		reason: speech.audioBridgeUnavailableReason,
		message: speech.audioBridgeUnavailable
	};
	const health = browser.health;
	if (health?.manualAction) return {
		ready: false,
		reason: health.manualAction.reason,
		message: health.manualAction.message
	};
	if (health?.inCall === true) {
		if (health.micMuted !== false) {
			const muted = health.micMuted === true;
			return {
				ready: false,
				reason: muted ? speech.microphoneMutedReason : speech.browserUnverifiedReason,
				message: muted ? speech.microphoneMuted : speech.browserUnverified
			};
		}
		return browser.hasAudioBridge ? { ready: true } : {
			ready: false,
			reason: speech.audioBridgeUnavailableReason,
			message: speech.audioBridgeUnavailable
		};
	}
	if (health?.inCall === false) return {
		ready: false,
		reason: speech.notInCallReason,
		message: speech.notInCall
	};
	return {
		ready: false,
		reason: speech.browserUnverifiedReason,
		message: speech.browserUnverified
	};
}
//#endregion
//#region src/meeting-bot/session-runtime.ts
const nowIso$1 = () => (/* @__PURE__ */ new Date()).toISOString();
/** Shared lifecycle owner; platform strategies perform transport-specific I/O only. */
var MeetingSessionRuntime = class {
	#sessions = /* @__PURE__ */ new Map();
	#sessionLeaves = /* @__PURE__ */ new Map();
	#sessionCleanup = new MeetingSessionCleanupTracker();
	#meetingLock = new KeyedAsyncQueue();
	#sessionSpeakers = /* @__PURE__ */ new Map();
	#sessionHealth = /* @__PURE__ */ new Map();
	#durableTranscripts;
	#transcriptStore;
	constructor(options) {
		this.options = options;
		this.#transcriptStore = new MeetingSessionTranscriptStore({
			getSession: (sessionId) => this.#sessions.get(sessionId),
			isBrowserSession: (session) => this.options.isBrowserTransport(session.transport),
			isTranscribeSession: (session) => this.options.isTranscribeMode(session.mode),
			hasBrowserTab: (session) => Boolean(this.options.getBrowser(session)?.tab),
			capture: async (session, captureOptions) => await this.options.captureTranscript(session, captureOptions),
			onLines: async (session, lines) => await this.#durableTranscripts.ingest(session, lines)
		});
		this.#durableTranscripts = new MeetingSessionDurableTranscripts({
			config: options.durableTranscripts,
			formatError: (error) => options.formatError(error),
			isBrowserSession: (session) => options.isBrowserTransport(session.transport),
			isTranscribeSession: (session) => options.isTranscribeMode(session.mode),
			listSessions: () => [...this.#sessions.values()],
			logger: options.logger,
			logScope: options.logScope,
			sameMeetingUrl: (left, right) => options.sameMeetingUrl(left, right),
			transcriptStore: this.#transcriptStore
		});
	}
	list() {
		this.refreshHealth();
		return [...this.#sessions.values()].toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
	}
	getSession(sessionId) {
		return this.#sessions.get(sessionId);
	}
	async status(sessionId) {
		this.refreshHealth(sessionId);
		if (!sessionId) {
			const sessions = [...this.#sessions.values()].toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
			await Promise.all(sessions.map((session) => this.options.refreshStatus(session)));
			return {
				found: true,
				sessions
			};
		}
		const session = this.#sessions.get(sessionId);
		if (session) await this.options.refreshStatus(session);
		return session ? {
			found: true,
			session
		} : { found: false };
	}
	async transcript(sessionId, options = {}) {
		return await this.#transcriptStore.read(sessionId, options);
	}
	async startTranscriptSource(request) {
		return await this.#durableTranscripts.startSource(request);
	}
	reconcileTranscriptPolicy(enabled) {
		return this.#durableTranscripts.reconcilePolicy(enabled);
	}
	async stopTranscriptSource(request) {
		return await this.#durableTranscripts.stopSource(request);
	}
	isReusableSession(session, resolved) {
		return session.state === "active" && this.options.sameMeetingUrl(session.url, resolved.url) && session.transport === resolved.transport && session.mode === resolved.mode && session.agentId === resolved.agentId;
	}
	async join(request) {
		const resolved = this.options.resolveJoin(request);
		return await this.#meetingLock.enqueue(this.#meetingKey(resolved.transport, resolved.url), async () => await this.#joinUnlocked(request, resolved));
	}
	async leave(sessionId, options) {
		const session = this.#sessions.get(sessionId);
		if (!session) return { found: false };
		return await this.#meetingLock.enqueue(this.#meetingKey(session.transport, session.url), async () => await this.#leaveUnlocked(sessionId, options));
	}
	async speak(sessionId, instructions) {
		const session = this.#sessions.get(sessionId);
		if (!session) return {
			found: false,
			spoken: false
		};
		if (session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		const delegated = await this.options.speakViaTransport(session, instructions);
		if (session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		if (delegated?.handled) return {
			found: true,
			spoken: delegated.spoken,
			session
		};
		await this.refreshBrowserHealth(session);
		if (session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		await this.#sessionCleanup.prepareRuntime(session.id, async () => {
			if (session.state !== "active") return;
			const handles = await this.options.ensureRealtimeBridge(session);
			if (handles) this.#attachRuntimeHandles(session, handles);
		});
		if (session.state !== "active") {
			await this.#sessionCleanup.stopRuntime(session.id);
			return {
				found: true,
				spoken: false,
				session
			};
		}
		const speak = this.#sessionSpeakers.get(sessionId);
		if (!speak || session.state !== "active") return {
			found: true,
			spoken: false,
			session
		};
		const readiness = this.refreshSpeechReadiness(session);
		if (!readiness.ready) {
			const note = readiness.message ? `Realtime speech blocked: ${readiness.message}` : this.options.messages.speechBlockedFallback;
			this.#noteSession(session, note);
			session.updatedAt = nowIso$1();
			return {
				found: true,
				spoken: false,
				session
			};
		}
		speak(instructions || this.options.defaultSpeechInstructions);
		session.updatedAt = nowIso$1();
		this.refreshHealth(sessionId);
		return {
			found: true,
			spoken: true,
			session
		};
	}
	async speakWhenReady(session, instructions) {
		let result = await this.speak(session.id, instructions);
		if (result.spoken || !this.options.isBrowserTransport(session.transport)) return result.spoken;
		const waitMs = Math.min(Math.max(0, this.options.waitForInCallMs), Math.max(0, this.options.joinTimeoutMs));
		const deadline = Date.now() + waitMs;
		while (Date.now() < deadline) {
			await new Promise((resolve) => {
				setTimeout(resolve, Math.min(250, Math.max(0, deadline - Date.now())));
			});
			result = await this.speak(session.id, instructions);
			if (result.spoken) return true;
			const health = this.options.getBrowser(result.session)?.health;
			if (health?.manualAction || result.session?.state !== "active") return false;
			const blocked = health?.speechBlockedReason;
			if (blocked && !this.options.transientSpeechBlockedReasons.has(blocked)) return false;
		}
		return false;
	}
	hasHealthHandle(sessionId) {
		return this.#sessionHealth.has(sessionId);
	}
	refreshHealth(sessionId) {
		const ids = sessionId ? [sessionId] : [...this.#sessionHealth.keys()];
		for (const id of ids) {
			const session = this.#sessions.get(id);
			const getHealth = this.#sessionHealth.get(id);
			const browser = session ? this.options.getBrowser(session) : void 0;
			if (!session || !browser || !getHealth) continue;
			this.options.setBrowserHealth(session, {
				...browser.health,
				...getHealth()
			});
			this.refreshSpeechReadiness(session);
		}
	}
	async refreshBrowserHealth(session, options = {}) {
		if (!this.#isManagedBrowserSession(session)) {
			this.refreshSpeechReadiness(session);
			return;
		}
		if (!options.force && this.options.isTalkBackMode(session.mode) && this.#evaluateSpeechReadiness(session).ready) {
			this.refreshSpeechReadiness(session);
			return;
		}
		await this.options.refreshBrowserHealth(session, options);
		this.refreshSpeechReadiness(session);
	}
	async refreshCaptionHealth(session) {
		if (!this.options.isTranscribeMode(session.mode)) {
			this.refreshSpeechReadiness(session);
			return;
		}
		await this.refreshBrowserHealth(session);
	}
	refreshSpeechReadiness(session) {
		const readiness = this.#evaluateSpeechReadiness(session);
		if (readiness.ready) session.notes = session.notes.filter((note) => !note.startsWith("Realtime speech blocked:"));
		const browser = this.options.getBrowser(session);
		if (browser) this.options.setBrowserHealth(session, {
			...browser.health,
			speechReady: readiness.ready,
			speechBlockedReason: readiness.reason,
			speechBlockedMessage: readiness.message
		});
		return readiness;
	}
	markSessionEnded(session, reason) {
		session.state = "ended";
		session.updatedAt = nowIso$1();
		this.#dropRuntimeHandles(session.id);
		this.#noteSession(session, reason);
	}
	async #joinUnlocked(request, resolved) {
		for (const session of this.list()) if (session.state === "ended" && session.transport === resolved.transport && this.options.sameMeetingUrl(session.url, resolved.url) && this.#sessionCleanup.hasRuntime(session.id)) await this.#leaveUnlocked(session.id);
		const activeSessions = this.list().filter((session) => session.state === "active" && this.options.sameMeetingUrl(session.url, resolved.url) && session.transport === resolved.transport);
		const retained = [];
		if (this.options.isBrowserTransport(resolved.transport)) for (const session of activeSessions) {
			if (this.isReusableSession(session, resolved)) continue;
			const browser = this.options.getBrowser(session);
			const tab = this.options.reuseExistingBrowserTab ? browser?.tab : void 0;
			const keepBrowserParticipant = Boolean(tab) || browser?.launched === false;
			if (tab) retained.push({
				session,
				tab
			});
			try {
				if ((await this.#leaveUnlocked(session.id, keepBrowserParticipant ? { keepBrowserTab: true } : void 0)).browserLeft === false) throw new Error(this.options.messages.previousBrowserLeaveFailed);
			} catch (error) {
				await this.#settleRetainedBrowserTabsAfterFailure(retained);
				throw error;
			}
			this.#noteSession(session, this.options.messages.reassignedSessionNote);
		}
		let reusable = activeSessions.find((session) => this.isReusableSession(session, resolved));
		if (reusable) {
			const refreshResult = await this.options.refreshReusableSession(reusable, request, resolved);
			if (reusable.state !== "active") {
				await this.#leaveSession(reusable, { keepBrowserTab: refreshResult?.keepBrowserTab ?? true });
				reusable = void 0;
			}
		}
		const speechInstructions = this.options.resolveSpeechInstructions(request);
		if (reusable) {
			await this.#durableTranscripts.start(reusable);
			await this.refreshBrowserHealth(reusable);
			this.#noteSession(reusable, this.options.messages.reusedSessionNote);
			reusable.updatedAt = nowIso$1();
			const spoken = this.options.isTalkBackMode(resolved.mode) && speechInstructions ? await this.speakWhenReady(reusable, speechInstructions) : false;
			return {
				session: reusable,
				spoken
			};
		}
		const session = this.options.createSession({
			request,
			resolved,
			createdAt: nowIso$1()
		});
		let delegatedSpoken;
		try {
			delegatedSpoken = (await this.options.joinTransport({
				request,
				session,
				context: {
					attachRuntimeHandles: (target, handles) => this.#attachRuntimeHandles(target, handles),
					inheritedBrowserTab: (params) => this.#inheritBrowserTabOwnership(params)
				}
			})).delegatedSpoken === true;
			const browser = this.options.getBrowser(session);
			if (!await this.#settleRetainedBrowserTabs(retained, browser?.tab ? {
				transport: session.transport,
				nodeId: browser.nodeId,
				tab: browser.tab
			} : void 0)) throw new Error(this.options.messages.replacementBrowserLeaveFailed);
		} catch (error) {
			await this.#rollbackFailedJoinSession(session);
			if (this.#sessionCleanup.isPending(session.id)) {
				this.#sessionCleanup.retainFailedJoin(session.id);
				this.#sessions.set(session.id, session);
				this.#noteSession(session, "Meeting cleanup is pending; use leave to retry.");
			}
			await this.#settleRetainedBrowserTabsAfterFailure(retained);
			this.options.logger.warn(`${this.options.logScope} join failed: ${this.options.formatError(error)}`);
			throw error;
		}
		this.#sessions.set(session.id, session);
		await this.#durableTranscripts.start(session);
		return {
			session,
			spoken: delegatedSpoken ? true : this.options.isTalkBackMode(resolved.mode) && speechInstructions ? await this.speakWhenReady(session, speechInstructions) : false
		};
	}
	async #leaveUnlocked(sessionId, options) {
		const inFlight = this.#sessionLeaves.get(sessionId);
		if (inFlight) return await inFlight;
		const session = this.#sessions.get(sessionId);
		if (!session) return { found: false };
		if (session.state === "ended" && !this.#sessionCleanup.isPending(sessionId) && !this.#sessionCleanup.hasRuntime(sessionId)) return {
			found: true,
			session,
			...session.browserLeft === void 0 ? {} : { browserLeft: session.browserLeft }
		};
		const leave = this.#leaveSession(session, options);
		this.#sessionLeaves.set(sessionId, leave);
		try {
			return await leave;
		} finally {
			if (this.#sessionLeaves.get(sessionId) === leave) this.#sessionLeaves.delete(sessionId);
		}
	}
	async #leaveSession(session, options) {
		const firstAttempt = this.#sessionCleanup.begin(session.id, session.browserLeft);
		session.state = "ended";
		session.updatedAt = nowIso$1();
		this.#dropRuntimeHandles(session.id);
		const transcribe = this.options.isTranscribeMode(session.mode);
		let transcriptStopped = false;
		if (transcribe) this.#transcriptStore.startFinalizing(session.id);
		try {
			transcriptStopped = await this.#durableTranscripts.stop(session, { allowFallback: firstAttempt });
			const cleanup = await this.#sessionCleanup.cleanup({
				sessionId: session.id,
				keepBrowserTab: options?.keepBrowserTab === true,
				hasBrowserTab: () => Boolean(this.options.getBrowser(session)?.tab),
				releaseBrowser: async () => await this.options.releaseBrowserTab(session)
			});
			session.browserLeft = cleanup.browserLeft;
			const browser = this.options.getBrowser(session);
			if (cleanup.browserLeft === true && browser?.health) this.options.setBrowserHealth(session, {
				...browser.health,
				inCall: false,
				micMuted: void 0,
				manualAction: void 0,
				speechReady: false,
				speechBlockedReason: void 0,
				speechBlockedMessage: void 0
			});
			if (cleanup.complete) {
				this.#dropRuntimeHandles(session.id);
				if (cleanup.unpublished) this.#sessions.delete(session.id);
			}
			return {
				found: true,
				session,
				...cleanup.browserLeft === void 0 ? {} : { browserLeft: cleanup.browserLeft }
			};
		} finally {
			if (transcriptStopped) this.#transcriptStore.retire(session.id);
			if (transcribe) this.#transcriptStore.finishFinalizing(session.id);
		}
	}
	#meetingKey(transport, url) {
		return `${transport}:${this.options.normalizeMeetingUrlForReuse(url) ?? url}`;
	}
	#inheritBrowserTabOwnership(params) {
		if (!params.tab) return;
		return [...this.#sessions.values()].some((session) => {
			const browser = this.options.getBrowser(session);
			const browserTab = browser?.tab;
			return session.transport === params.transport && this.options.sameMeetingUrl(session.url, params.meetingUrl) && browser?.nodeId === params.nodeId && browserTab?.targetId === params.tab?.targetId && browserTab?.openedByPlugin === true;
		}) ? {
			...params.tab,
			openedByPlugin: true
		} : params.tab;
	}
	async #settleRetainedBrowserTabs(retained, adopted) {
		let settled = true;
		for (let index = 0; index < retained.length;) {
			const retainedTab = retained[index];
			if (!retainedTab) break;
			const { session, tab } = retainedTab;
			const browser = this.options.getBrowser(session);
			if (adopted?.transport === session.transport && adopted.nodeId === browser?.nodeId && adopted.tab.targetId === tab.targetId) {
				this.options.setBrowserTab(session, void 0);
				retained.splice(index, 1);
				continue;
			}
			if (await this.options.releaseBrowserTab(session) === false) {
				settled = false;
				index += 1;
				continue;
			}
			retained.splice(index, 1);
		}
		return settled;
	}
	async #rollbackFailedJoinSession(session) {
		await this.#sessionCleanup.rollbackFailedJoin({
			sessionId: session.id,
			browserLeft: session.browserLeft,
			leave: async () => await this.#leaveSession(session),
			hasBrowserTab: () => Boolean(this.options.getBrowser(session)?.tab),
			releaseBrowser: async () => await this.options.releaseBrowserTab(session),
			formatError: (error) => this.options.formatError(error),
			warn: (message) => this.options.logger.warn(`${this.options.logScope} ${message}`),
			onBrowserResult: (left) => session.browserLeft = left,
			onComplete: () => this.#dropRuntimeHandles(session.id)
		});
	}
	async #settleRetainedBrowserTabsAfterFailure(retained) {
		for (let attempt = 0; attempt < 2 && retained.length > 0; attempt += 1) try {
			if (await this.#settleRetainedBrowserTabs(retained)) return;
		} catch (error) {
			this.options.logger.warn(`${this.options.logScope} retained browser cleanup failed: ${this.options.formatError(error)}`);
		}
		if (retained.length > 0) this.options.logger.warn(`${this.options.logScope} retained browser cleanup incomplete after failed join`);
	}
	#attachRuntimeHandles(session, handles) {
		if (handles.stop) this.#sessionCleanup.addStop(session.id, handles.stop);
		if (session.state !== "active") return;
		if (handles.speak) this.#sessionSpeakers.set(session.id, handles.speak);
		if (handles.getHealth) this.#sessionHealth.set(session.id, handles.getHealth);
	}
	#dropRuntimeHandles(sessionId) {
		this.#sessionSpeakers.delete(sessionId);
		this.#sessionHealth.delete(sessionId);
	}
	#isManagedBrowserSession(session) {
		const browser = this.options.getBrowser(session);
		return Boolean(this.options.isBrowserTransport(session.transport) && browser?.launched);
	}
	#evaluateSpeechReadiness(session) {
		return evaluateMeetingSpeechReadiness({
			browser: this.options.getBrowser(session),
			managedBrowser: this.#isManagedBrowserSession(session),
			speech: this.options.messages.speech,
			talkBack: this.options.isTalkBackMode(session.mode)
		});
	}
	#noteSession(session, note) {
		session.notes = [...session.notes.filter((item) => item !== note), note];
	}
};
//#endregion
//#region src/meeting-bot/session-factory.ts
function createMeetingSession(params) {
	const { config, createdAt, platform, resolved } = params;
	return {
		id: `${platform.session.idPrefix}_${randomUUID()}`,
		...resolved,
		state: "active",
		createdAt,
		updatedAt: createdAt,
		participantIdentity: platform.session.participantIdentity(resolved.transport),
		realtime: {
			enabled: resolved.mode === "agent" || resolved.mode === "bidi",
			strategy: resolved.mode === "bidi" ? "bidi" : "agent",
			provider: resolved.mode === "bidi" ? config.realtime.voiceProvider ?? config.realtime.provider : void 0,
			model: resolved.mode === "bidi" ? config.realtime.model : void 0,
			transcriptionProvider: resolved.mode === "agent" ? config.realtime.transcriptionProvider ?? config.realtime.provider : void 0,
			toolPolicy: config.realtime.toolPolicy
		},
		notes: []
	};
}
//#endregion
//#region src/meeting-bot/browser-act-lock.ts
const browserActLock = new KeyedAsyncQueue();
const BROWSER_ACT_TIMEOUT_MESSAGE = "Meeting browser operation timed out waiting for browser tab control.";
async function runMeetingBrowserAct(params) {
	const waitMs = Math.floor(params.deadline - performance.now());
	if (waitMs <= 0) throw new Error(BROWSER_ACT_TIMEOUT_MESSAGE);
	let acquired = false;
	let markAcquired;
	const acquisition = new Promise((resolve) => {
		markAcquired = resolve;
	});
	let timeout;
	const queued = browserActLock.enqueue(params.targetId, async () => {
		const remainingMs = Math.floor(params.deadline - performance.now());
		if (remainingMs <= 0) throw new Error(BROWSER_ACT_TIMEOUT_MESSAGE);
		acquired = true;
		clearTimeout(timeout);
		markAcquired?.();
		return await params.operation(remainingMs);
	});
	queued.catch(() => void 0);
	const expired = new Promise((_resolve, reject) => {
		timeout = setTimeout(() => {
			if (!acquired) reject(/* @__PURE__ */ new Error(BROWSER_ACT_TIMEOUT_MESSAGE));
		}, waitMs);
	});
	try {
		await Promise.race([acquisition, expired]);
	} finally {
		clearTimeout(timeout);
	}
	return await queued;
}
//#endregion
//#region src/meeting-bot/browser-navigation-errors.ts
function isMeetingBrowserTransientNavigationError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /execution context was destroyed.*navigation|cannot find context with specified id/i.test(message);
}
//#endregion
//#region src/meeting-bot/browser-request.ts
function asMeetingBrowserTabs(result) {
	const record = result && typeof result === "object" ? result : {};
	return Array.isArray(record.tabs) ? record.tabs : [];
}
function readMeetingBrowserTab(result) {
	return result && typeof result === "object" ? result : void 0;
}
function resolveBrowserGatewayTimeoutMs(timeoutMs) {
	return addTimerTimeoutGraceMs(timeoutMs) ?? 1;
}
async function callLocalBrowserRequest(params) {
	return await callGatewayFromCli("browser.request", {
		json: true,
		timeout: String(resolveBrowserGatewayTimeoutMs(params.timeoutMs))
	}, {
		method: params.method,
		path: params.path,
		body: params.body,
		timeoutMs: params.timeoutMs
	}, { progress: false });
}
async function resolveLocalMeetingBrowserRequest(runtime) {
	if (!await runtime.gateway.isAvailable()) return callLocalBrowserRequest;
	return async (params) => await runtime.gateway.request("browser.request", {
		method: params.method,
		path: params.path,
		body: params.body,
		timeoutMs: params.timeoutMs
	}, {
		timeoutMs: resolveBrowserGatewayTimeoutMs(params.timeoutMs),
		scopes: ["operator.admin"]
	});
}
//#endregion
//#region src/meeting-bot/browser-controller.ts
function mergeBrowserNotes(browser, notes) {
	if (!browser || notes.length === 0) return browser;
	return {
		...browser,
		notes: uniqueStrings([...browser.notes ?? [], ...notes])
	};
}
function applyMeetingManualAction(browser, manual) {
	return browser && manual ? {
		...browser,
		manualAction: {
			reason: manual.reason,
			message: manual.message
		}
	} : browser;
}
async function prepareMeetingBrowserTab(params) {
	const plan = params.adapter.browser.permissions({
		allowMicrophone: params.allowMicrophone,
		meetingUrl: params.meetingUrl
	});
	if (!plan) return params.adapter.browser.permissionNotes({ allowMicrophone: params.allowMicrophone });
	try {
		const result = await params.callBrowser({
			method: "POST",
			path: "/permissions/grant",
			body: {
				origin: plan.origin,
				permissions: plan.permissions,
				optionalPermissions: plan.optionalPermissions,
				targetId: params.targetId,
				timeoutMs: Math.min(params.timeoutMs, 5e3)
			},
			timeoutMs: Math.min(params.timeoutMs, 5e3)
		});
		return params.adapter.browser.permissionNotes({
			allowMicrophone: params.allowMicrophone,
			result
		});
	} catch (error) {
		return params.adapter.browser.permissionNotes({
			allowMicrophone: params.allowMicrophone,
			error
		});
	}
}
function selectReusableTab(params) {
	const matches = params.tabs.filter((tab) => params.adapter.urls.isRecoverableTab(tab, params.url));
	const accountHint = params.adapter.urls.accountHint(params.url);
	return {
		matches,
		tab: matches.find((candidate) => params.adapter.urls.isPreferredJoinUrl(candidate.url) && (!accountHint || params.adapter.urls.accountHint(candidate.url) === accountHint))
	};
}
async function openMeetingWithBrowser(params) {
	if (!params.config.launch) return { launched: false };
	const timeoutMs = Math.max(1e3, params.config.joinTimeoutMs);
	let targetId;
	let tab;
	let openSession = params.session;
	let openedByPlugin = false;
	if (params.config.reuseExistingTab) {
		const tabs = asMeetingBrowserTabs(await params.callBrowser({
			method: "GET",
			path: "/tabs",
			timeoutMs: Math.min(timeoutMs, 5e3)
		}));
		const reusable = selectReusableTab({
			adapter: params.adapter,
			tabs,
			url: params.session.url
		});
		tab = reusable.tab;
		if (!tab && !params.adapter.urls.accountHint(params.session.url)) {
			const fallbackUrl = reusable.matches.find((candidate) => candidate.url)?.url;
			if (fallbackUrl) openSession = {
				...params.session,
				url: fallbackUrl
			};
		}
		targetId = tab?.targetId;
		if (tab && targetId) await params.callBrowser({
			method: "POST",
			path: "/tabs/focus",
			body: { targetId },
			timeoutMs: Math.min(timeoutMs, 5e3)
		});
	}
	if (!targetId) {
		tab = readMeetingBrowserTab(await params.callBrowser({
			method: "POST",
			path: "/tabs/open",
			body: { url: params.adapter.urls.buildJoinUrl(openSession) },
			timeoutMs
		}));
		targetId = tab?.targetId;
		openedByPlugin = Boolean(targetId);
	}
	if (!targetId) return {
		launched: true,
		browser: {
			status: "browser-control",
			notes: [`Browser proxy opened ${params.adapter.browserLabel} but did not return a targetId.`],
			browserUrl: tab?.url,
			browserTitle: tab?.title
		}
	};
	const tabIdentity = {
		targetId,
		openedByPlugin
	};
	const allowMicrophone = params.adapter.browser.allowsMicrophone(params.session.mode);
	const permissionNotes = await prepareMeetingBrowserTab({
		adapter: params.adapter,
		allowMicrophone,
		callBrowser: params.callBrowser,
		meetingUrl: params.session.url,
		targetId,
		timeoutMs
	});
	const deadline = performance.now() + Math.max(0, params.config.waitForInCallMs);
	let browser = {
		status: "browser-control",
		browserUrl: tab?.url,
		browserTitle: tab?.title,
		notes: permissionNotes
	};
	let allowSessionAdoption = true;
	do {
		try {
			const adoptSession = allowSessionAdoption;
			allowSessionAdoption = false;
			const actionTimeoutMs = Math.min(timeoutMs, 1e4);
			const evaluated = await runMeetingBrowserAct({
				deadline: performance.now() + actionTimeoutMs,
				targetId,
				operation: async (remainingMs) => await params.callBrowser({
					method: "POST",
					path: "/act",
					body: {
						kind: "evaluate",
						targetId,
						fn: params.adapter.browser.buildStatusJoinScript({
							...params.session,
							allowSessionAdoption: adoptSession,
							autoJoin: params.config.autoJoin,
							captureCaptions: params.session.captureCaptions ?? params.adapter.browser.captions.enabled(params.session.mode),
							guestName: params.config.guestName,
							waitForInCallMs: params.config.waitForInCallMs
						})
					},
					timeoutMs: remainingMs
				})
			});
			browser = mergeBrowserNotes(params.adapter.browser.parseStatus(evaluated) ?? browser, permissionNotes);
			const manual = browser ? params.adapter.browser.classifyManualAction(browser) : void 0;
			browser = applyMeetingManualAction(browser, manual);
			const shouldRetry = browser ? params.adapter.browser.shouldRetryJoinStatus?.(browser) === true : false;
			if (!shouldRetry && browser?.inCall === true && browser.manualAction === void 0 && (!allowMicrophone || browser.micMuted !== true)) return {
				launched: true,
				browser,
				tab: tabIdentity
			};
			if (!shouldRetry && browser?.manualAction) return {
				launched: true,
				browser,
				tab: tabIdentity
			};
		} catch (error) {
			if (isMeetingBrowserTransientNavigationError(error) && performance.now() < deadline) browser = mergeBrowserNotes(browser, [`${params.adapter.browserLabel} navigated while joining; retrying browser inspection.`]);
			else {
				const manual = params.adapter.browser.browserControlUnavailable(error);
				browser = {
					...browser,
					inCall: false,
					manualAction: {
						reason: manual.reason,
						message: manual.message
					},
					notes: [...permissionNotes, `Browser control could not inspect or auto-join ${params.adapter.browserLabel}: ${error instanceof Error ? error.message : String(error)}`]
				};
				break;
			}
		}
		const remainingWaitMs = deadline - performance.now();
		if (remainingWaitMs > 0) await new Promise((resolve) => {
			setTimeout(resolve, Math.min(750, remainingWaitMs));
		});
	} while (performance.now() < deadline);
	return {
		launched: true,
		browser,
		tab: tabIdentity
	};
}
function findRecoverableTab(params) {
	const candidates = params.tabs.filter((tab) => params.adapter.urls.isRecoverableTab(tab, params.requestedMeetingUrl));
	if (!params.requestedMeetingUrl) {
		const meetingCandidates = candidates.filter((tab) => params.adapter.urls.normalizeForReuse(tab.url));
		return meetingCandidates.find((tab) => params.adapter.urls.isPreferredJoinUrl(tab.url)) ?? meetingCandidates[0] ?? candidates[0];
	}
	const accountHint = params.adapter.urls.accountHint(params.requestedMeetingUrl);
	const accountCandidates = accountHint ? candidates.filter((tab) => params.adapter.urls.accountHint(tab.url) === accountHint) : candidates;
	return accountCandidates.find((tab) => params.adapter.urls.isPreferredJoinUrl(tab.url)) ?? accountCandidates[0];
}
async function inspectRecoverableTab(params) {
	const allowMicrophone = params.adapter.browser.allowsMicrophone(params.mode);
	const focusTimeoutMs = params.deadline === void 0 ? params.timeoutMs : Math.floor(params.deadline - performance.now());
	if (focusTimeoutMs <= 0) throw new Error("Meeting browser recovery timed out.");
	await params.callBrowser({
		method: "POST",
		path: "/tabs/focus",
		body: { targetId: params.targetId },
		timeoutMs: Math.min(focusTimeoutMs, 5e3)
	});
	const localeAction = params.adapter.urls.localeAction(params.tab);
	if (localeAction) return {
		found: true,
		targetId: params.targetId,
		tab: params.tab,
		browser: {
			status: "browser-control",
			browserUrl: params.tab.url,
			browserTitle: params.tab.title,
			manualAction: {
				reason: localeAction.reason,
				message: localeAction.message
			}
		},
		message: localeAction.message
	};
	const permissionNotes = params.readOnly ? [] : await prepareMeetingBrowserTab({
		adapter: params.adapter,
		allowMicrophone,
		callBrowser: params.callBrowser,
		meetingUrl: params.requestedMeetingUrl ?? params.tab.url ?? "",
		targetId: params.targetId,
		timeoutMs: params.deadline === void 0 ? params.timeoutMs : Math.max(1, Math.floor(params.deadline - performance.now()))
	});
	const navigationNotes = [];
	const inspectionDeadline = params.deadline ?? performance.now() + Math.min(params.timeoutMs, 1e4);
	let allowSessionAdoption = params.allowSessionAdoption ?? false;
	let evaluated;
	for (;;) try {
		const adoptSession = allowSessionAdoption;
		allowSessionAdoption = false;
		evaluated = await runMeetingBrowserAct({
			deadline: inspectionDeadline,
			targetId: params.targetId,
			operation: async (remainingMs) => await params.callBrowser({
				method: "POST",
				path: "/act",
				body: {
					kind: "evaluate",
					targetId: params.targetId,
					fn: params.adapter.browser.buildStatusJoinScript({
						allowSessionAdoption: adoptSession,
						meetingSessionId: params.meetingSessionId ?? "",
						mode: params.mode,
						url: params.requestedMeetingUrl ?? params.tab.url ?? "",
						autoJoin: params.autoJoin ?? false,
						captureCaptions: params.captureCaptions ?? params.adapter.browser.captions.enabled(params.mode),
						guestName: params.config.guestName,
						readOnly: params.readOnly,
						waitForInCallMs: params.config.waitForInCallMs
					})
				},
				timeoutMs: remainingMs
			})
		});
		break;
	} catch (error) {
		const remainingMs = inspectionDeadline - performance.now();
		if (!isMeetingBrowserTransientNavigationError(error) || remainingMs <= 0) throw error;
		navigationNotes.push(`${params.adapter.browserLabel} navigated while recovering; retrying browser inspection.`);
		await new Promise((resolve) => {
			setTimeout(resolve, Math.min(250, remainingMs));
		});
		if (performance.now() >= inspectionDeadline) throw error;
	}
	const browser = mergeBrowserNotes(params.adapter.browser.parseStatus(evaluated) ?? {
		status: "browser-control",
		browserUrl: params.tab.url,
		browserTitle: params.tab.title
	}, [...permissionNotes, ...navigationNotes]);
	const manual = browser ? params.adapter.browser.classifyManualAction(browser) : void 0;
	const recoveredBrowser = applyMeetingManualAction(browser, manual);
	const message = manual?.message ?? (recoveredBrowser?.inCall ? `Existing ${params.adapter.browserLabel} tab is in-call.` : `Existing ${params.adapter.browserLabel} tab focused.`);
	return {
		found: true,
		targetId: params.targetId,
		tab: params.tab,
		browser: recoveredBrowser,
		message
	};
}
async function recoverMeetingBrowserTab(params) {
	const configuredTimeoutMs = Math.max(1e3, params.config.joinTimeoutMs);
	const timeoutMs = params.timeoutMs === void 0 ? configuredTimeoutMs : Math.max(1, Math.min(configuredTimeoutMs, params.timeoutMs));
	const deadline = params.timeoutMs === void 0 ? void 0 : performance.now() + timeoutMs;
	const tabs = asMeetingBrowserTabs(await params.callBrowser({
		method: "GET",
		path: "/tabs",
		timeoutMs: deadline === void 0 ? Math.min(timeoutMs, 5e3) : Math.min(Math.max(1, Math.floor(deadline - performance.now())), 5e3)
	}));
	const trackedCandidate = params.trackedTargetId ? tabs.find((tab) => tab.targetId === params.trackedTargetId) : void 0;
	const trackedUrlHasMeetingIdentity = Boolean(params.adapter.urls.normalizeForReuse(trackedCandidate?.url));
	const trackedIdentityMatches = params.adapter.urls.isSameMeeting(params.trackedMeetingUrl, params.requestedMeetingUrl);
	const trackedUrlMatches = params.adapter.urls.isSameMeeting(trackedCandidate?.url, params.requestedMeetingUrl);
	const tab = (trackedCandidate && trackedIdentityMatches && (!trackedUrlHasMeetingIdentity || trackedUrlMatches) ? trackedCandidate : void 0) ?? findRecoverableTab({
		adapter: params.adapter,
		tabs,
		requestedMeetingUrl: params.requestedMeetingUrl
	});
	const targetId = tab?.targetId;
	if (!tab || !targetId) return {
		found: false,
		tab,
		message: params.requestedMeetingUrl ? `No existing ${params.adapter.browserLabel} tab matched ${params.requestedMeetingUrl}.` : `No existing ${params.adapter.browserLabel} tab found ${params.locationLabel}.`
	};
	return await inspectRecoverableTab({
		adapter: params.adapter,
		allowSessionAdoption: params.allowSessionAdoption,
		autoJoin: params.autoJoin,
		callBrowser: params.callBrowser,
		captureCaptions: params.captureCaptions,
		config: params.config,
		...deadline === void 0 ? {} : { deadline },
		meetingSessionId: params.meetingSessionId,
		mode: params.mode,
		readOnly: params.readOnly,
		requestedMeetingUrl: params.requestedMeetingUrl,
		timeoutMs,
		tab,
		targetId
	});
}
//#endregion
//#region src/meeting-bot/browser-session-control.ts
async function leaveMeetingInPage(params) {
	const deadline = performance.now() + params.timeoutMs;
	let clickedLeave = false;
	let clickedConfirmation = false;
	let ownershipRetained = false;
	do {
		const remainingMs = Math.floor(deadline - performance.now());
		if (remainingMs <= 0) throw new Error("Meeting browser leave timed out.");
		const evaluated = await params.callBrowser({
			method: "POST",
			path: "/act",
			body: {
				kind: "evaluate",
				targetId: params.targetId,
				fn: params.adapter.browser.buildSessionLeaveScript?.({
					leaveInitiated: clickedLeave,
					meetingSessionId: params.meetingSessionId ?? "",
					meetingUrl: params.meetingUrl
				}) ?? params.adapter.browser.buildLeaveScript(params.meetingUrl)
			},
			timeoutMs: remainingMs
		});
		const step = params.adapter.browser.parseLeaveResult(evaluated);
		clickedLeave ||= step.leaveAction === "leave";
		clickedConfirmation ||= step.leaveAction === "confirm";
		if (step.sessionMatched === false) {
			const stepOwnershipRetained = clickedLeave && step.sessionConflict !== true;
			if (step.departed || !stepOwnershipRetained) return {
				departed: stepOwnershipRetained ? step.departed : false,
				clickedLeave,
				clickedConfirmation,
				ownershipRetained: stepOwnershipRetained,
				sessionConflict: step.sessionConflict,
				sessionMatched: false,
				urlMatched: step.urlMatched
			};
			ownershipRetained = true;
		}
		if (step.departed || step.urlMatched !== true) return {
			departed: step.departed,
			clickedLeave,
			clickedConfirmation,
			...ownershipRetained && step.sessionConflict !== true ? { ownershipRetained: true } : {},
			urlMatched: step.urlMatched
		};
		if (!step.leaveAction && !clickedLeave) return {
			departed: false,
			clickedLeave,
			clickedConfirmation,
			urlMatched: true
		};
		if (!step.leaveAction) await new Promise((resolve) => {
			setTimeout(resolve, 100);
		});
	} while (performance.now() < deadline);
	return {
		departed: false,
		clickedLeave,
		clickedConfirmation,
		...ownershipRetained ? {
			ownershipRetained: true,
			sessionMatched: false
		} : {},
		urlMatched: true
	};
}
async function leaveMeetingWithBrowser(params) {
	if (!params.launch) return {
		left: false,
		note: "Browser leave skipped because chrome.launch is disabled."
	};
	const timeoutMs = Math.min(Math.max(1e3, params.timeoutMs), 5e3);
	const { targetId, openedByPlugin } = params.tab;
	try {
		if (!asMeetingBrowserTabs(await params.callBrowser({
			method: "GET",
			path: "/tabs",
			timeoutMs
		})).find((entry) => entry.targetId === targetId)) return {
			left: true,
			note: `${params.adapter.browserLabel} tab is already closed.`
		};
		let leaveResult;
		let tabClosed = false;
		try {
			const locked = await runMeetingBrowserAct({
				deadline: performance.now() + timeoutMs,
				targetId,
				operation: async (remainingMs) => {
					const operationDeadline = performance.now() + remainingMs;
					const closeReserveMs = openedByPlugin ? Math.min(1e3, Math.max(250, Math.floor(remainingMs / 4))) : 0;
					const result = await leaveMeetingInPage({
						adapter: params.adapter,
						callBrowser: params.callBrowser,
						meetingSessionId: params.meetingSessionId,
						meetingUrl: params.meetingUrl,
						targetId,
						timeoutMs: Math.max(1, remainingMs - closeReserveMs)
					});
					if (!(openedByPlugin && (result.urlMatched === true || result.departed) && (result.sessionMatched !== false || result.ownershipRetained === true))) return {
						leaveResult: result,
						tabClosed: false
					};
					const closeTimeoutMs = Math.floor(operationDeadline - performance.now());
					if (closeTimeoutMs <= 0) throw new Error("Meeting browser leave timed out before the tab could close.");
					await params.callBrowser({
						method: "DELETE",
						path: `/tabs/${targetId}`,
						timeoutMs: closeTimeoutMs
					});
					return {
						leaveResult: result,
						tabClosed: true
					};
				}
			});
			leaveResult = locked.leaveResult;
			tabClosed = locked.tabClosed;
		} catch (error) {
			return {
				left: false,
				note: `Browser control could not verify the ${params.adapter.browserLabel} tab before leaving: ${error instanceof Error ? error.message : String(error)}`
			};
		}
		if (leaveResult.urlMatched === false) return {
			left: true,
			note: `${params.adapter.browserLabel} tab moved away from this session; left its current page untouched.`
		};
		if (leaveResult.sessionMatched === false && leaveResult.ownershipRetained !== true) {
			if (leaveResult.sessionConflict !== true) return {
				left: false,
				note: `Browser control could not verify that the ${params.adapter.browserLabel} tab still belongs to this OpenClaw meeting session.`
			};
			return {
				left: true,
				note: `${params.adapter.browserLabel} tab belongs to another OpenClaw meeting session; left its current call untouched.`
			};
		}
		if (leaveResult.urlMatched !== true && !leaveResult.departed) return {
			left: false,
			note: "Browser control could not verify that the tracked tab still showed this meeting."
		};
		const { clickedLeave, departed } = leaveResult;
		return {
			left: openedByPlugin ? tabClosed : departed,
			note: openedByPlugin ? clickedLeave ? `Clicked ${params.adapter.browserLabel}'s Leave call button and closed the ${params.adapter.browserLabel} tab.` : `Closed the ${params.adapter.browserLabel} tab to leave the meeting (Leave call button was not found).` : departed ? `Clicked ${params.adapter.browserLabel}'s Leave call button; kept the reused browser tab open.` : clickedLeave ? `Clicked ${params.adapter.browserLabel}'s Leave call button, but could not verify departure; leave it manually.` : `Could not find ${params.adapter.browserLabel}'s Leave call button in the reused browser tab; leave it manually.`
		};
	} catch (error) {
		return {
			left: false,
			note: `Browser control could not leave the ${params.adapter.browserLabel} tab: ${error instanceof Error ? error.message : String(error)}`
		};
	}
}
async function readMeetingTranscriptWithBrowser(params) {
	const result = await runMeetingBrowserAct({
		deadline: performance.now() + Math.max(1, params.timeoutMs),
		targetId: params.tab.targetId,
		operation: async (remainingMs) => await params.callBrowser({
			method: "POST",
			path: "/act",
			body: {
				kind: "evaluate",
				targetId: params.tab.targetId,
				fn: params.adapter.browser.captions.buildTranscriptScript({
					finalize: params.finalize,
					meetingSessionId: params.meetingSessionId,
					meetingUrl: params.meetingUrl
				})
			},
			timeoutMs: remainingMs
		})
	});
	const snapshot = params.adapter.browser.captions.parseTranscript(result);
	if (snapshot.urlMatched === false) throw new Error(`The tracked ${params.adapter.browserLabel} tab no longer shows this session's meeting URL.`);
	if (snapshot.sessionMatched === false) throw new Error(`The tracked ${params.adapter.browserLabel} tab now belongs to another OpenClaw meeting session.`);
	return {
		droppedLines: snapshot.droppedLines,
		...snapshot.epoch ? { epoch: snapshot.epoch } : {},
		lines: snapshot.lines
	};
}
//#endregion
//#region src/meeting-bot/browser-node.ts
function isMeetingBrowserNode(node, adapter) {
	const commands = Array.isArray(node.commands) ? node.commands : [];
	const caps = Array.isArray(node.caps) ? node.caps : [];
	return node.connected === true && commands.includes(adapter.nodeCommandName) && (commands.includes("browser.proxy") || caps.includes("browser"));
}
function matchesRequestedNode(node, requested) {
	return [
		node.nodeId,
		node.displayName,
		node.remoteIp
	].some((value) => value === requested);
}
function formatNodeLabel(node) {
	const parts = [
		node.displayName,
		node.nodeId,
		node.remoteIp
	].filter(Boolean);
	return parts.length > 0 ? parts.join(" / ") : "unknown node";
}
function describeNodeUsabilityIssues(node, adapter) {
	const commands = Array.isArray(node.commands) ? node.commands : [];
	const caps = Array.isArray(node.caps) ? node.caps : [];
	const issues = [];
	if (node.connected !== true) issues.push("offline");
	if (!commands.includes(adapter.nodeCommandName)) issues.push(`missing ${adapter.nodeCommandName}`);
	if (!commands.includes("browser.proxy") && !caps.includes("browser")) issues.push("missing browser.proxy/browser capability");
	return issues;
}
async function listMeetingNodes(runtime, adapter, params) {
	try {
		return params ? await runtime.nodes.list(params) : await runtime.nodes.list();
	} catch (error) {
		throw new Error(`${adapter.displayName} node inventory unavailable`, { cause: error });
	}
}
async function resolveMeetingBrowserNodeInfo(params) {
	const requested = params.requestedNode?.trim();
	if (requested) {
		const matches = (await listMeetingNodes(params.runtime, params.adapter)).nodes.filter((node) => matchesRequestedNode(node, requested));
		if (matches.length > 1) throw new Error(`Configured ${params.adapter.displayName} node ${requested} is ambiguous (${matches.length} matches). Pin ${params.adapter.nodeConfigPath} to a unique node id, display name, or remote IP.`);
		const [node] = matches;
		if (!node) throw new Error(`Configured ${params.adapter.displayName} node ${requested} was not found. Run \`openclaw nodes status\` and start or approve the Chrome node.`);
		if (isMeetingBrowserNode(node, params.adapter)) return node;
		throw new Error(`Configured ${params.adapter.displayName} node ${requested} is not usable (${formatNodeLabel(node)}): ${describeNodeUsabilityIssues(node, params.adapter).join("; ")}. Start or reinstall \`openclaw node run\` on that Chrome host, approve pairing, and allow ${params.adapter.nodeCommandName} plus browser.proxy.`);
	}
	const nodes = (await listMeetingNodes(params.runtime, params.adapter, { connected: true })).nodes.filter((node) => isMeetingBrowserNode(node, params.adapter));
	const [node] = nodes;
	if (!node) throw new Error(`No connected ${params.adapter.displayName}-capable node with browser proxy. Run \`openclaw node run\` on the Chrome host with browser proxy enabled, approve pairing, and allow ${params.adapter.nodeCommandName} plus browser.proxy.`);
	if (nodes.length === 1) return node;
	throw new Error(`Multiple ${params.adapter.displayName}-capable nodes connected. Set ${params.adapter.nodeConfigPath}.`);
}
async function resolveMeetingBrowserNode(params) {
	const node = await resolveMeetingBrowserNodeInfo(params);
	if (!node.nodeId) throw new Error(`${params.adapter.displayName} node did not include a node id.`);
	return node.nodeId;
}
function unwrapNodeInvokePayload(raw, adapter) {
	const record = raw && typeof raw === "object" ? raw : {};
	if (typeof record.payloadJSON === "string" && record.payloadJSON.trim()) try {
		return JSON.parse(record.payloadJSON);
	} catch (error) {
		throw new Error(`${adapter.displayName} browser proxy returned malformed payloadJSON.`, { cause: error });
	}
	if ("payload" in record) return record.payload;
	return raw;
}
function parseBrowserProxyResult(raw, adapter) {
	const payload = unwrapNodeInvokePayload(raw, adapter);
	const proxy = payload && typeof payload === "object" ? payload : void 0;
	if (!proxy || !("result" in proxy)) throw new Error(`${adapter.displayName} browser proxy returned an invalid result.`);
	return proxy.result;
}
async function callMeetingBrowserProxyOnNode(params) {
	return parseBrowserProxyResult(await params.runtime.nodes.invoke({
		nodeId: params.nodeId,
		command: "browser.proxy",
		params: {
			method: params.method,
			path: params.path,
			body: params.body,
			timeoutMs: params.timeoutMs
		},
		timeoutMs: addTimerTimeoutGraceMs(params.timeoutMs) ?? 1,
		scopes: ["operator.admin"]
	}), params.adapter);
}
//#endregion
//#region src/meeting-bot/sox-audio-command.ts
function formatArgs(format) {
	return [
		"-t",
		"raw",
		"-r",
		String(format.sampleRate),
		"-c",
		String(format.channels),
		"-e",
		format.encoding,
		"-b",
		String(format.bits),
		...format.endian === "little" ? ["-L"] : format.endian === "big" ? ["-B"] : [],
		"-"
	];
}
function withBuffer(executable, bufferBytes, args) {
	return [
		executable,
		"-q",
		"--buffer",
		String(bufferBytes),
		...args
	];
}
function buildMeetingSoxAudioCommands(params) {
	const wire = formatArgs(params.format);
	if (!params.device) return {
		inputCommand: withBuffer(params.inputExecutable ?? "rec", params.bufferBytes, wire),
		outputCommand: withBuffer(params.outputExecutable ?? "play", params.bufferBytes, wire)
	};
	const deviceType = params.deviceType ?? "coreaudio";
	return {
		inputCommand: withBuffer(params.inputExecutable ?? "sox", params.bufferBytes, [
			"-t",
			deviceType,
			params.device,
			...wire
		]),
		outputCommand: withBuffer(params.outputExecutable ?? "sox", params.bufferBytes, [
			...wire,
			"-t",
			deviceType,
			params.device
		])
	};
}
//#endregion
//#region src/meeting-bot/audio-backend.ts
const PIPEWIRE_SINK_NAME = "openclaw_meeting_audio";
const PIPEWIRE_MONITOR_NAME = `${PIPEWIRE_SINK_NAME}.monitor`;
const PIPEWIRE_SOURCE_NAME = PIPEWIRE_SINK_NAME;
const PIPEWIRE_MEETING_AUDIO_DEVICE_LABEL = "OpenClaw Meeting Audio";
const BLACKHOLE_MEETING_AUDIO_DEVICE_LABEL = "BlackHole 2ch";
function resolvePulseFormat(config) {
	if (config.encoding === "mu-law" && config.bits === 8) return "ulaw";
	if (config.encoding === "signed-integer" && config.bits === 16) return config.endian === "big" ? "s16be" : "s16le";
	throw new Error(`PipeWire-Pulse does not support meeting audio format ${config.encoding}/${config.bits}.`);
}
function resolveMeetingAudioBackend(selection, platform = process.platform) {
	if (selection && selection !== "auto") {
		if (selection === "blackhole-2ch" && platform !== "darwin") throw new Error("BlackHole 2ch meeting audio requires macOS.");
		if (selection === "pipewire-pulse" && platform !== "linux") throw new Error("PipeWire-Pulse meeting audio requires Linux.");
		return selection;
	}
	if (platform === "darwin") return "blackhole-2ch";
	if (platform === "linux") return "pipewire-pulse";
	throw new Error(`Local Chrome meeting talk-back is unsupported on ${platform}; use transcribe mode or a macOS/Linux Chrome node.`);
}
function resolveMeetingAudioRuntime(config, platform = process.platform) {
	const backend = resolveMeetingAudioBackend(config.backend, platform);
	const bytesPerSecond = config.format.sampleRate * config.format.channels * Math.ceil(config.format.bits / 8);
	const pulseLatencyMs = Math.max(1, Math.ceil(config.bufferBytes / bytesPerSecond * 1e3));
	const defaults = backend === "blackhole-2ch" ? buildMeetingSoxAudioCommands({
		bufferBytes: config.bufferBytes,
		device: BLACKHOLE_MEETING_AUDIO_DEVICE_LABEL,
		deviceType: "coreaudio",
		format: config.format
	}) : {
		inputCommand: [
			"parec",
			"--raw",
			`--device=${PIPEWIRE_SOURCE_NAME}`,
			`--format=${resolvePulseFormat(config.format)}`,
			`--rate=${config.format.sampleRate}`,
			`--channels=${config.format.channels}`,
			`--latency-msec=${pulseLatencyMs}`
		],
		outputCommand: [
			"pacat",
			"--raw",
			"--playback",
			`--device=${PIPEWIRE_SINK_NAME}`,
			`--format=${resolvePulseFormat(config.format)}`,
			`--rate=${config.format.sampleRate}`,
			`--channels=${config.format.channels}`,
			`--latency-msec=${pulseLatencyMs}`
		]
	};
	return {
		backend,
		deviceLabel: backend === "blackhole-2ch" ? BLACKHOLE_MEETING_AUDIO_DEVICE_LABEL : PIPEWIRE_MEETING_AUDIO_DEVICE_LABEL,
		inputCommand: config.inputCommand ? [...config.inputCommand] : defaults.inputCommand,
		outputCommand: config.outputCommand ? [...config.outputCommand] : defaults.outputCommand
	};
}
function resolveMeetingAudioRuntimeForFormat(params) {
	return resolveMeetingAudioRuntime({
		backend: params.backend,
		bufferBytes: params.bufferBytes,
		format: params.format === "g711-ulaw-8khz" ? {
			sampleRate: 8e3,
			channels: 1,
			encoding: "mu-law",
			bits: 8
		} : {
			sampleRate: 24e3,
			channels: 1,
			encoding: "signed-integer",
			bits: 16,
			endian: "little"
		},
		inputCommand: params.inputCommand,
		outputCommand: params.outputCommand
	}, params.platform);
}
function commandOutput(result) {
	return `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
}
function pulseListContains(output, name) {
	return output.split(/\r?\n/u).some((line) => line.split(/\s+/u)[1] === name);
}
function assertCommandSucceeded(result, message) {
	if (result.code === 0) return;
	const detail = commandOutput(result).trim();
	throw new Error(detail ? `${message}: ${detail}` : message);
}
async function ensureMeetingAudioBackend(params) {
	if (params.backend === "blackhole-2ch") {
		const result = await params.run(["/usr/sbin/system_profiler", "SPAudioDataType"], params.timeoutMs);
		if (result.code !== 0 || !commandOutput(result).toLowerCase().includes("blackhole 2ch")) throw new Error("BlackHole 2ch audio device not found. Install BlackHole 2ch and SoX, then reboot.");
		return;
	}
	assertCommandSucceeded(await params.run(["pactl", "info"], params.timeoutMs), "PipeWire-Pulse is unavailable. Start pipewire-pulse and install pulseaudio-utils");
	let sinks = await params.run([
		"pactl",
		"list",
		"short",
		"sinks"
	], params.timeoutMs);
	if (!pulseListContains(sinks.stdout ?? "", PIPEWIRE_SINK_NAME)) {
		const loaded = await params.run([
			"pactl",
			"load-module",
			"module-null-sink",
			`sink_name=${PIPEWIRE_SINK_NAME}`,
			"rate=48000",
			"channels=2",
			"channel_map=front-left,front-right",
			`sink_properties='device.description="${PIPEWIRE_MEETING_AUDIO_DEVICE_LABEL}"'`
		], params.timeoutMs);
		if (loaded.code !== 0) {
			sinks = await params.run([
				"pactl",
				"list",
				"short",
				"sinks"
			], params.timeoutMs);
			if (!pulseListContains(sinks.stdout ?? "", PIPEWIRE_SINK_NAME)) assertCommandSucceeded(loaded, "Could not create the OpenClaw PipeWire-Pulse sink");
		}
	}
	let sources = await params.run([
		"pactl",
		"list",
		"short",
		"sources"
	], params.timeoutMs);
	if (!pulseListContains(sources.stdout ?? "", PIPEWIRE_SOURCE_NAME)) {
		const loaded = await params.run([
			"pactl",
			"load-module",
			"module-remap-source",
			`source_name=${PIPEWIRE_SOURCE_NAME}`,
			`master=${PIPEWIRE_MONITOR_NAME}`,
			"channels=2",
			"master_channel_map=front-left,front-right",
			"channel_map=front-left,front-right",
			"remix=no",
			`source_properties='device.description="${PIPEWIRE_MEETING_AUDIO_DEVICE_LABEL}"'`
		], params.timeoutMs);
		if (loaded.code !== 0) {
			sources = await params.run([
				"pactl",
				"list",
				"short",
				"sources"
			], params.timeoutMs);
			if (!pulseListContains(sources.stdout ?? "", PIPEWIRE_SOURCE_NAME)) assertCommandSucceeded(loaded, "Could not create the OpenClaw PipeWire-Pulse source");
		}
	}
	sinks = await params.run([
		"pactl",
		"list",
		"short",
		"sinks"
	], params.timeoutMs);
	sources = await params.run([
		"pactl",
		"list",
		"short",
		"sources"
	], params.timeoutMs);
	if (!pulseListContains(sinks.stdout ?? "", PIPEWIRE_SINK_NAME) || !pulseListContains(sources.stdout ?? "", PIPEWIRE_SOURCE_NAME)) throw new Error("OpenClaw PipeWire-Pulse sink or monitor source was not created.");
}
//#endregion
//#region src/meeting-bot/chrome-node-result.ts
/** Unwraps the node.invoke envelope while keeping result validation transport-generic. */
function parseMeetingChromeNodeResult(raw, invalidMessage) {
	const value = raw && typeof raw === "object" && "payload" in raw ? raw.payload : raw;
	if (!value || typeof value !== "object") throw new Error(invalidMessage);
	return value;
}
//#endregion
//#region src/meeting-bot/realtime-browser-audio-transport.ts
async function createBrowserMeetingRealtimeAudioTransport(params) {
	const { buildCaptureScript, targetId } = params;
	if (params.hasConfiguredInputCommand || !buildCaptureScript) return params.nativeTransport;
	if (!targetId) throw new Error("Meeting browser audio capture requires its tracked tab.");
	const captureId = randomUUID();
	let stopped = false;
	let inputStarted = false;
	let fatal = false;
	let fatalHandler;
	let stopPromise;
	let timer;
	const callCapture = (action) => runMeetingBrowserAct({
		deadline: performance.now() + 5e3,
		targetId,
		operation: async (timeoutMs) => {
			if (stopped && action !== "stop") return { closed: true };
			const response = await params.callBrowser({
				method: "POST",
				path: "/act",
				timeoutMs,
				body: {
					kind: "evaluate",
					targetId,
					fn: buildCaptureScript({
						action,
						captureId,
						meetingSessionId: params.meetingSessionId,
						meetingUrl: params.meetingUrl
					})
				}
			});
			const raw = asOptionalRecord(response)?.result;
			const result = typeof raw === "string" ? asOptionalRecord(JSON.parse(raw)) : void 0;
			if (!result || result.captureId !== captureId) throw new Error("Meeting browser returned an invalid audio capture response.");
			return result;
		}
	});
	const stop = () => {
		stopPromise ??= (async () => {
			stopped = true;
			clearTimeout(timer);
			await Promise.all([params.nativeTransport.stop(), callCapture("stop").catch((error) => {
				params.logger.warn(`Meeting browser audio cleanup failed: ${formatErrorMessage(error)}`);
			})]);
		})();
		return stopPromise;
	};
	const fail = (error) => {
		if (stopped || fatal) return;
		fatal = true;
		if (error) params.logger.warn(`Meeting browser audio capture failed: ${formatErrorMessage(error)}`);
		stop().catch((cleanupError) => {
			params.logger.warn(`Meeting audio cleanup failed: ${formatErrorMessage(cleanupError)}`);
		});
		fatalHandler?.();
	};
	params.nativeTransport.onFatal(() => fail());
	try {
		const result = await callCapture("start");
		if (stopped || result.isolated !== true) throw new Error("Meeting browser could not isolate remote playback from its virtual microphone.");
	} catch (error) {
		await stop();
		throw error;
	}
	return {
		inputAudioIsolated: true,
		onFatal(handler) {
			fatalHandler = handler;
			if (fatal) handler();
		},
		startInput(onAudio) {
			if (inputStarted) throw new Error("audio input transport already started");
			inputStarted = true;
			params.nativeTransport.startInput(() => {});
			const pull = async () => {
				if (stopped) return;
				try {
					const result = await callCapture("pull");
					if (stopped) return;
					if (result.closed === true || result.isolated !== true) {
						fail(/* @__PURE__ */ new Error("Meeting browser audio capture lost its session."));
						return;
					}
					if (typeof result.base64 === "string" && result.base64) {
						if (result.base64.length > 65536) throw new Error("Meeting browser audio exceeded its input buffer.");
						const pcm = decodeMeetingAudioBase64(result.base64, "meeting browser audio");
						if (pcm.length % 2 !== 0) throw new Error("Meeting browser returned incomplete PCM samples.");
						onAudio(params.audioFormat === "pcm16-24khz" ? pcm : convertPcmToMulaw8k(pcm, 24e3));
					}
					if (!stopped) timer = setTimeout(() => void pull(), 50);
				} catch (error) {
					fail(error);
				}
			};
			pull();
		},
		beginOutput: () => params.nativeTransport.beginOutput?.(),
		writeOutput: (audio) => stopped ? Promise.resolve() : params.nativeTransport.writeOutput(audio),
		clearOutput: () => stopped ? Promise.resolve() : params.nativeTransport.clearOutput(),
		...params.nativeTransport.startBargeInMonitor ? { startBargeInMonitor: (handler) => {
			if (!stopped) params.nativeTransport.startBargeInMonitor?.(handler);
		} } : {},
		getHealth: () => params.nativeTransport.getHealth?.() ?? {},
		stop,
		dispose: stop
	};
}
//#endregion
//#region src/meeting-bot/chrome-transport.ts
function createMeetingChromeTransportWithAudioPolicy(options, audioBridge) {
	async function openOrRecoverMeeting(params) {
		const captureCaptions = params.mode === "transcribe" || resolveTranscriptsConfig(params.fullConfig.transcripts).enabled;
		if (params.config.chrome.launch) return await openMeetingWithBrowser({
			adapter: options.platform,
			callBrowser: params.callBrowser,
			config: params.config.chrome,
			session: {
				captureCaptions,
				meetingSessionId: params.meetingSessionId,
				mode: params.mode,
				url: params.url
			}
		});
		const recovered = await recoverMeetingBrowserTab({
			adapter: options.platform,
			allowSessionAdoption: true,
			autoJoin: params.config.chrome.autoJoin,
			callBrowser: params.callBrowser,
			captureCaptions,
			config: params.config.chrome,
			locationLabel: params.locationLabel,
			meetingSessionId: params.meetingSessionId,
			mode: params.mode,
			requestedMeetingUrl: params.url,
			trackedMeetingUrl: params.url,
			trackedTargetId: params.trackedTargetId
		});
		return {
			launched: false,
			browser: recovered.browser,
			tab: recovered.targetId ? {
				targetId: recovered.targetId,
				openedByPlugin: false
			} : void 0
		};
	}
	async function rollbackBrowserJoin(params) {
		if (!params.tab) return;
		if (options.startupFailurePolicy === "owned" && (!params.config.chrome.launch || !params.tab.openedByPlugin)) return;
		const result = await leaveMeetingWithBrowser({
			adapter: options.platform,
			callBrowser: params.callBrowser,
			launch: true,
			meetingSessionId: params.meetingSessionId,
			meetingUrl: params.url,
			tab: params.tab,
			timeoutMs: params.config.chrome.joinTimeoutMs
		}).catch((error) => ({
			left: false,
			note: error instanceof Error ? error.message : String(error)
		}));
		if (!result.left) params.logger.warn(`${options.platform.logScope} browser rollback after realtime startup failure did not complete: ${result.note}`);
	}
	async function prepareAudioRuntime(params) {
		const audio = resolveMeetingAudioRuntimeForFormat({
			backend: params.config.chrome.audioBackend,
			bufferBytes: params.config.chrome.audioBufferBytes,
			format: params.config.chrome.audioFormat,
			inputCommand: params.config.chrome.audioInputCommandOverride,
			outputCommand: params.config.chrome.audioOutputCommandOverride
		});
		await ensureMeetingAudioBackend({
			backend: audio.backend,
			timeoutMs: params.timeoutMs,
			run: async (argv, timeoutMs) => {
				const result = await params.runtime.system.runCommandWithTimeout(argv, { timeoutMs });
				return {
					...result,
					code: result.code ?? 1
				};
			}
		});
		return audio;
	}
	async function assertAudioDeviceAvailable(params) {
		await prepareAudioRuntime(params);
	}
	async function startLocalAudioBridge(params) {
		if (!options.isTalkBackMode(params.mode)) return;
		if (audioBridge.external) {
			if (params.config.chrome.audioBridgeCommand) {
				if (params.mode === "agent") throw new Error("Chrome agent mode requires chrome.audioInputCommand and chrome.audioOutputCommand so OpenClaw can run STT and regular TTS directly.");
				const bridge = await params.runtime.system.runCommandWithTimeout(params.config.chrome.audioBridgeCommand, { timeoutMs: params.config.chrome.joinTimeoutMs });
				if (bridge.code !== 0) throw new Error(`failed to start Chrome audio bridge: ${bridge.stderr || bridge.stdout || bridge.code}`);
				return audioBridge.external();
			}
			if (!params.config.chrome.audioInputCommand || !params.config.chrome.audioOutputCommand) throw new Error("Chrome talk-back mode requires chrome.audioInputCommand and chrome.audioOutputCommand, or chrome.audioBridgeCommand for an external bridge.");
		}
		let transport = options.runtime.createLocalAudioTransport({
			inputCommand: params.audio.inputCommand,
			outputCommand: params.audio.outputCommand,
			audioFormat: params.config.chrome.audioFormat,
			bargeInInputCommand: params.config.chrome.bargeInInputCommand,
			bargeInRmsThreshold: params.config.chrome.bargeInRmsThreshold,
			bargeInPeakThreshold: params.config.chrome.bargeInPeakThreshold,
			bargeInCooldownMs: params.config.chrome.bargeInCooldownMs,
			logger: params.logger,
			logScope: options.platform.logScope
		});
		try {
			transport = await createBrowserMeetingRealtimeAudioTransport({
				...params,
				nativeTransport: transport,
				hasConfiguredInputCommand: params.config.chrome.audioInputCommandOverride !== void 0,
				buildCaptureScript: options.platform.browser.buildAudioCaptureScript?.bind(options.platform.browser),
				meetingUrl: params.url,
				targetId: params.tab?.targetId,
				audioFormat: params.config.chrome.audioFormat
			});
			const bindings = options.runtime.createBindings({
				platform: options.platform,
				...params
			});
			const engine = params.mode === "agent" ? await options.runtime.startAgentRealtimeEngine({
				config: params.config,
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				platform: bindings.platform,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				transport,
				logger: params.logger,
				consultAgent: bindings.consultAgent
			}) : await options.runtime.startRealtimeEngine({
				config: {
					...params.config,
					realtime: {
						...params.config.realtime,
						strategy: "bidi"
					}
				},
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				...bindings,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				transport,
				logger: params.logger
			});
			return audioBridge.local(engine, params.audio);
		} catch (error) {
			await transport.dispose().catch(() => {});
			throw error;
		}
	}
	async function launchInChrome(params) {
		const audio = options.isTalkBackMode(params.mode) ? await prepareAudioRuntime({
			runtime: params.runtime,
			config: params.config,
			timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4)
		}) : void 0;
		if (audio && audioBridge.external && params.config.chrome.audioBridgeHealthCommand) {
			const health = await params.runtime.system.runCommandWithTimeout(params.config.chrome.audioBridgeHealthCommand, { timeoutMs: params.config.chrome.joinTimeoutMs });
			if (health.code !== 0) throw new Error(`Chrome audio bridge health check failed: ${health.stderr || health.stdout || health.code}`);
		}
		const callBrowser = await resolveLocalMeetingBrowserRequest(params.runtime);
		const result = await openOrRecoverMeeting({
			callBrowser,
			config: params.config,
			fullConfig: params.fullConfig,
			locationLabel: "in local Chrome",
			meetingSessionId: params.meetingSessionId,
			mode: params.mode,
			trackedTargetId: params.trackedTargetId,
			url: params.url
		});
		if (!options.isRealtimeRouteReady(params.mode, result.browser)) return {
			...result,
			audioBackend: audio?.backend
		};
		try {
			return {
				...result,
				audioBackend: audio?.backend,
				audioBridge: audio ? await startLocalAudioBridge({
					...params,
					audio,
					callBrowser,
					tab: result.tab
				}) : void 0
			};
		} catch (error) {
			if (!options.preserveTrackedBrowserOnEngineFailure || !params.trackedTargetId) await rollbackBrowserJoin({
				callBrowser,
				config: params.config,
				logger: params.logger,
				meetingSessionId: params.meetingSessionId,
				tab: result.tab,
				url: params.url
			});
			throw error;
		}
	}
	async function resolveChromeNode(params) {
		return await resolveMeetingBrowserNode({
			...params,
			adapter: options.browserNodeAdapter
		});
	}
	async function callNodeBrowser(params) {
		return await callMeetingBrowserProxyOnNode({
			...params,
			adapter: options.browserNodeAdapter
		});
	}
	const parseNodeResult = (raw) => parseMeetingChromeNodeResult(raw, `${options.meetingLabel} node returned an invalid start result.`);
	async function resolveBrowserRequest(runtime, nodeId) {
		return nodeId ? async (request) => await callNodeBrowser({
			runtime,
			nodeId,
			...request
		}) : await resolveLocalMeetingBrowserRequest(runtime);
	}
	async function launchOnNode(params) {
		const nodeId = await resolveChromeNode({
			runtime: params.runtime,
			requestedNode: params.config.chromeNode.node
		});
		try {
			await params.runtime.nodes.invoke({
				nodeId,
				command: options.nodeCommandName,
				params: {
					action: "stopByUrl",
					url: params.url,
					mode: params.mode
				},
				timeoutMs: 5e3
			});
		} catch (error) {
			params.logger.debug?.(`${options.platform.logScope} node bridge cleanup ignored: ${error instanceof Error ? error.message : String(error)}`);
		}
		const audioSetup = options.isTalkBackMode(params.mode) ? parseNodeResult(await params.runtime.nodes.invoke({
			nodeId,
			command: options.nodeCommandName,
			params: {
				action: "setup",
				audioBackend: params.config.chrome.audioBackend,
				audioFormat: params.config.chrome.audioFormat,
				audioBufferBytes: params.config.chrome.audioBufferBytes,
				...params.config.chrome.audioInputCommandOverride ? { audioInputCommand: params.config.chrome.audioInputCommandOverride } : {},
				...params.config.chrome.audioOutputCommandOverride ? { audioOutputCommand: params.config.chrome.audioOutputCommandOverride } : {}
			},
			timeoutMs: 12e3
		})) : void 0;
		const callBrowser = await resolveBrowserRequest(params.runtime, nodeId);
		const browser = await openOrRecoverMeeting({
			callBrowser,
			config: params.config,
			fullConfig: params.fullConfig,
			locationLabel: "on the selected Chrome node",
			meetingSessionId: params.meetingSessionId,
			mode: params.mode,
			trackedTargetId: params.trackedTargetId,
			url: params.url
		});
		if (!options.isRealtimeRouteReady(params.mode, browser.browser)) return {
			nodeId,
			launched: browser.launched,
			audioBackend: audioSetup?.audioBackend,
			browser: browser.browser,
			tab: browser.tab
		};
		let startedBridgeId;
		let audioTransport;
		try {
			const raw = await params.runtime.nodes.invoke({
				nodeId,
				command: options.nodeCommandName,
				params: {
					action: "start",
					url: params.url,
					mode: params.mode,
					launch: false,
					browserProfile: params.config.chrome.browserProfile,
					joinTimeoutMs: params.config.chrome.joinTimeoutMs,
					...params.config.chrome.audioInputCommandOverride ? { audioInputCommand: params.config.chrome.audioInputCommandOverride } : {},
					...params.config.chrome.audioOutputCommandOverride ? { audioOutputCommand: params.config.chrome.audioOutputCommandOverride } : {},
					audioBackend: params.config.chrome.audioBackend,
					audioFormat: params.config.chrome.audioFormat,
					audioBufferBytes: params.config.chrome.audioBufferBytes,
					...audioBridge.external ? {
						audioBridgeCommand: params.config.chrome.audioBridgeCommand,
						audioBridgeHealthCommand: params.config.chrome.audioBridgeHealthCommand
					} : {}
				},
				timeoutMs: addTimerTimeoutGraceMs(params.config.chrome.joinTimeoutMs) ?? 1
			});
			const result = parseNodeResult(raw);
			if (result.audioBridge?.type !== "node-command-pair") return {
				nodeId,
				launched: browser.launched || result.launched === true,
				audioBackend: result.audioBackend ?? audioSetup?.audioBackend,
				browser: browser.browser ?? result.browser,
				tab: browser.tab,
				...audioBridge.external && result.audioBridge?.type === "external-command" ? { audioBridge: audioBridge.external() } : {}
			};
			if (!result.bridgeId) throw new Error(`${options.meetingLabel} node did not return an audio bridge id.`);
			startedBridgeId = result.bridgeId;
			let transport = options.runtime.createNodeAudioTransport({
				runtime: params.runtime,
				nodeId,
				bridgeId: result.bridgeId,
				audioFormat: params.config.chrome.audioFormat,
				logger: params.logger,
				commandName: options.nodeCommandName,
				logScope: options.platform.logScope,
				logPrefix: params.mode === "agent" ? "node agent" : "node"
			});
			audioTransport = transport;
			Reflect.set(transport, Symbol.for("openclaw.internal.meeting-node-output-generation.v1"), result.audioBridge.outputGeneration === true);
			transport = await createBrowserMeetingRealtimeAudioTransport({
				...params,
				nativeTransport: transport,
				hasConfiguredInputCommand: params.config.chrome.audioInputCommandOverride !== void 0,
				callBrowser,
				buildCaptureScript: options.platform.browser.buildAudioCaptureScript?.bind(options.platform.browser),
				meetingUrl: params.url,
				targetId: browser.tab?.targetId,
				audioFormat: params.config.chrome.audioFormat
			});
			audioTransport = transport;
			const bindings = options.runtime.createBindings({
				platform: options.platform,
				...params
			});
			const engine = params.mode === "agent" ? await options.runtime.startAgentRealtimeEngine({
				config: params.config,
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				platform: bindings.platform,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				logPrefix: "node",
				transport,
				logger: params.logger,
				consultAgent: bindings.consultAgent
			}) : await options.runtime.startRealtimeEngine({
				config: {
					...params.config,
					realtime: {
						...params.config.realtime,
						strategy: "bidi"
					}
				},
				fullConfig: params.fullConfig,
				runtime: params.runtime,
				...bindings,
				meetingSessionId: params.meetingSessionId,
				requesterSessionKey: params.requesterSessionKey,
				logPrefix: "node",
				talkSessionId: `${options.platform.id}:${params.meetingSessionId}:${result.bridgeId}:node-realtime`,
				talkContext: {
					nodeId,
					bridgeId: result.bridgeId
				},
				transport,
				logger: params.logger
			});
			return {
				nodeId,
				launched: browser.launched || result.launched === true,
				audioBackend: result.audioBackend ?? audioSetup?.audioBackend,
				audioBridge: {
					type: "node-command-pair",
					nodeId,
					bridgeId: result.bridgeId,
					...engine
				},
				browser: browser.browser ?? result.browser,
				tab: browser.tab
			};
		} catch (error) {
			await audioTransport?.dispose().catch(() => {});
			if (options.startupFailurePolicy === "owned") {
				if (!audioTransport && startedBridgeId) await params.runtime.nodes.invoke({
					nodeId,
					command: options.nodeCommandName,
					params: {
						action: "stop",
						bridgeId: startedBridgeId
					},
					timeoutMs: 5e3
				}).catch(() => {});
			} else await params.runtime.nodes.invoke({
				nodeId,
				command: options.nodeCommandName,
				params: {
					action: "stopByUrl",
					url: params.url,
					mode: params.mode
				},
				timeoutMs: 5e3
			}).catch(() => {});
			if (!options.preserveTrackedBrowserOnEngineFailure || !params.trackedTargetId) await rollbackBrowserJoin({
				callBrowser,
				config: params.config,
				logger: params.logger,
				meetingSessionId: params.meetingSessionId,
				tab: browser.tab,
				url: params.url
			});
			throw error;
		}
	}
	async function recoverCurrentTab(params) {
		const nodeId = params.transport === "chrome-node" ? params.nodeId ?? await resolveChromeNode({
			runtime: params.runtime,
			requestedNode: params.config.chromeNode.node
		}) : void 0;
		return {
			transport: params.transport,
			...nodeId ? { nodeId } : {},
			...await recoverMeetingBrowserTab({
				adapter: options.platform,
				callBrowser: await resolveBrowserRequest(params.runtime, nodeId),
				captureCaptions: params.mode === "transcribe" || resolveTranscriptsConfig(params.fullConfig?.transcripts).enabled,
				config: params.config.chrome,
				locationLabel: nodeId ? "on the selected Chrome node" : "in local Chrome",
				meetingSessionId: params.meetingSessionId,
				mode: params.mode,
				readOnly: params.readOnly,
				requestedMeetingUrl: params.url,
				trackedMeetingUrl: params.trackedMeetingUrl,
				trackedTargetId: params.trackedTargetId,
				timeoutMs: params.timeoutMs
			})
		};
	}
	async function leaveInBrowser(params) {
		const nodeId = params.nodeId;
		return await leaveMeetingWithBrowser({
			adapter: options.platform,
			callBrowser: await resolveBrowserRequest(params.runtime, nodeId),
			launch: params.config.chrome.launch || !params.tab.openedByPlugin,
			meetingSessionId: params.meetingSessionId,
			meetingUrl: params.meetingUrl,
			tab: params.tab,
			timeoutMs: params.config.chrome.joinTimeoutMs
		});
	}
	async function readTranscript(params) {
		const nodeId = params.nodeId;
		return await readMeetingTranscriptWithBrowser({
			adapter: options.platform,
			callBrowser: await resolveBrowserRequest(params.runtime, nodeId),
			finalize: params.finalize === true,
			meetingUrl: params.meetingUrl,
			meetingSessionId: params.meetingSessionId,
			tab: params.tab,
			timeoutMs: Math.min(Math.max(1e3, params.config.chrome.joinTimeoutMs), 1e4)
		});
	}
	return {
		assertAudioDeviceAvailable,
		launchInChrome,
		launchOnNode,
		leaveInBrowser,
		readTranscript,
		recoverCurrentTab
	};
}
function createMeetingChromeTransport(options) {
	return createMeetingChromeTransportWithAudioPolicy(options, { local: (engine) => ({
		type: "command-pair",
		...engine
	}) });
}
function createMeetingChromeTransportWithExternalAudio(options) {
	return createMeetingChromeTransportWithAudioPolicy(options, {
		local: (engine, audio) => ({
			type: "command-pair",
			inputCommand: audio.inputCommand,
			outputCommand: audio.outputCommand,
			...engine
		}),
		external: () => ({ type: "external-command" })
	});
}
//#endregion
//#region src/meeting-bot/node-audio-config.ts
const DEFAULT_NODE_AUDIO_BUFFER_BYTES = 4096;
const DEFAULT_NODE_AUDIO_FORMAT = "pcm16-24khz";
function readMeetingNodeCommand(value) {
	if (!Array.isArray(value)) return;
	const result = value.filter((entry) => typeof entry === "string" && entry.length > 0);
	return result.length > 0 ? result : void 0;
}
function readAudioBackend(value) {
	if (value === void 0) return;
	if (value === "auto" || value === "blackhole-2ch" || value === "pipewire-pulse") return value;
	throw new Error("audioBackend must be auto, blackhole-2ch, or pipewire-pulse");
}
function readAudioFormat(value) {
	if (value === void 0) return;
	if (value === "pcm16-24khz" || value === "g711-ulaw-8khz") return value;
	throw new Error("audioFormat must be pcm16-24khz or g711-ulaw-8khz");
}
function readAudioBufferBytes(value) {
	if (value === void 0) return;
	if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value;
	throw new Error("audioBufferBytes must be a positive safe integer");
}
/** Resolves untrusted node params before any backend or command process starts. */
async function prepareMeetingNodeAudio(params, timeoutMs, options) {
	const defaults = options.defaultAudio;
	const config = {
		backend: readAudioBackend(params.audioBackend) ?? defaults?.backend ?? "auto",
		bufferBytes: readAudioBufferBytes(params.audioBufferBytes) ?? defaults?.bufferBytes ?? DEFAULT_NODE_AUDIO_BUFFER_BYTES,
		format: readAudioFormat(params.audioFormat) ?? defaults?.format ?? DEFAULT_NODE_AUDIO_FORMAT,
		inputCommand: readMeetingNodeCommand(params.audioInputCommand),
		outputCommand: readMeetingNodeCommand(params.audioOutputCommand),
		bargeInInputCommand: readMeetingNodeCommand(params.bargeInInputCommand)
	};
	if (options.prepareAudio) return await options.prepareAudio(config, timeoutMs);
	await options.assertAudioAvailable(timeoutMs);
	return {
		backend: "blackhole-2ch",
		deviceLabel: "BlackHole 2ch",
		inputCommand: config.inputCommand ?? [...options.defaultAudioInputCommand],
		outputCommand: config.outputCommand ?? [...options.defaultAudioOutputCommand]
	};
}
//#endregion
//#region src/meeting-bot/node-audio-pull-waiters.ts
/** Internal pull-wait ownership used by the node-host long poll. */
var MeetingNodeAudioPullWaiters = class {
	#waiters = /* @__PURE__ */ new Set();
	get size() {
		return this.#waiters.size;
	}
	async wait(timeoutMs) {
		let wake;
		const ready = new Promise((resolve) => {
			wake = resolve;
			this.#waiters.add(wake);
		});
		let timer;
		const timeout = new Promise((resolve) => {
			timer = setTimeout(resolve, timeoutMs);
		});
		try {
			await Promise.race([timeout, ready]);
		} finally {
			this.#waiters.delete(wake);
			if (timer !== void 0) clearTimeout(timer);
		}
	}
	wake() {
		const waiters = [...this.#waiters];
		this.#waiters.clear();
		for (const waiter of waiters) waiter();
	}
};
//#endregion
//#region src/meeting-bot/node-host.ts
const NODE_BRIDGE_TERMINATION_GRACE_MS = 2e3;
const NODE_BRIDGE_INPUT_DRAIN_MS = 3e3;
const NODE_BRIDGE_TERMINAL_RETENTION_MS = 5e3;
const NODE_BRIDGE_MAX_QUEUED_INPUT_CHUNKS = 200;
const NODE_BRIDGE_MAX_QUEUED_INPUT_BYTES = 1048576;
function readPositiveNumberOr(value, fallback) {
	return asPositiveFiniteNumber(value) ?? fallback;
}
function readOutputGeneration$1(value) {
	if (value === void 0) return;
	if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return value;
	throw new Error("outputGeneration must be a non-negative integer");
}
function runCommandWithTimeout(argv, timeoutMs) {
	const { command, args } = splitCommandArgv(argv, "command");
	const result = spawnSync(command, args, {
		encoding: "utf8",
		timeout: timeoutMs
	});
	const errorMessage = result.error ? formatErrorMessage(result.error) : "";
	const stderr = errorMessage && result.stderr ? `${errorMessage}: ${result.stderr}` : errorMessage || result.stderr || (result.signal ? `terminated by ${result.signal}` : "");
	return {
		code: typeof result.status === "number" ? result.status : 1,
		stdout: result.stdout ?? "",
		stderr
	};
}
function waitForInputDrain(stream, timeoutMs) {
	if (!stream || stream.readableEnded || stream.destroyed) return Promise.resolve();
	return new Promise((resolve) => {
		let settled = false;
		const finish = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			stream.off("end", finish);
			stream.off("close", finish);
			resolve();
		};
		const timeout = setTimeout(finish, timeoutMs);
		timeout.unref?.();
		stream.once("end", finish);
		stream.once("close", finish);
		if (stream.readableEnded || stream.destroyed) finish();
	});
}
function createMeetingNodeHost(options) {
	const sessions = /* @__PURE__ */ new Map();
	const activeProcesses = /* @__PURE__ */ new Set();
	const trackProcess = (child) => {
		activeProcesses.add(child);
		child.once("close", () => activeProcesses.delete(child));
		return child;
	};
	const wake = (session) => {
		session.waiters.wake();
	};
	const releaseOutputWriteWaiters = (session, output) => {
		for (const waiter of session.outputWriteWaiters) if (!output || waiter.output === output) waiter.release();
	};
	const retireOutputProcess = (session, outputProcess) => {
		const stopPromise = terminateMeetingBridgeProcess(outputProcess, { graceMs: NODE_BRIDGE_TERMINATION_GRACE_MS });
		session.retiredOutputStops.add(stopPromise);
		stopPromise.finally(() => {
			session.retiredOutputStops.delete(stopPromise);
		});
	};
	const deleteSession = (session) => {
		if (session.terminalEvictionTimer) {
			clearTimeout(session.terminalEvictionTimer);
			session.terminalEvictionTimer = void 0;
		}
		session.chunks.length = 0;
		session.queuedInputBytes = 0;
		if (sessions.get(session.id) === session) sessions.delete(session.id);
	};
	const armTerminalEviction = (session) => {
		if (session.terminalEvictionTimer) clearTimeout(session.terminalEvictionTimer);
		session.terminalEvictionTimer = setTimeout(() => {
			deleteSession(session);
		}, NODE_BRIDGE_TERMINAL_RETENTION_MS);
		session.terminalEvictionTimer.unref?.();
	};
	const stopSession = (session, stopOptions = {}) => {
		session.stopping = true;
		if (stopOptions.discardQueuedAudio) {
			session.discardQueuedAudioOnStop = true;
			if (session.terminalEvictionTimer) {
				clearTimeout(session.terminalEvictionTimer);
				session.terminalEvictionTimer = void 0;
			}
			session.chunks.length = 0;
			session.queuedInputBytes = 0;
			if (!session.closed) session.closed = true;
			wake(session);
		}
		releaseOutputWriteWaiters(session);
		if (session.stopPromise) return session.stopPromise;
		const terminalReady = session.discardQueuedAudioOnStop ? Promise.resolve() : waitForInputDrain(session.input?.stdout, NODE_BRIDGE_INPUT_DRAIN_MS).then(() => {
			if (session.discardQueuedAudioOnStop || session.closed) return;
			session.closed = true;
			wake(session);
		});
		session.stopPromise = Promise.all([
			terminateMeetingBridgeProcess(session.input, { graceMs: NODE_BRIDGE_TERMINATION_GRACE_MS }),
			terminateMeetingBridgeProcess(session.output, { graceMs: NODE_BRIDGE_TERMINATION_GRACE_MS }),
			...session.retiredOutputStops,
			terminalReady
		]).then(() => {
			if (session.discardQueuedAudioOnStop) {
				deleteSession(session);
				return;
			}
			armTerminalEviction(session);
		});
		return session.stopPromise;
	};
	const attachOutputProcessHandlers = (session, outputProcess) => {
		const stopIfCurrent = () => {
			if (session.output === outputProcess) stopSession(session);
		};
		outputProcess.on("exit", stopIfCurrent);
		outputProcess.on("error", stopIfCurrent);
		outputProcess.stdin?.on("error", stopIfCurrent);
		outputProcess.stderr?.on("error", stopIfCurrent);
	};
	const startOutputProcess = (command) => trackProcess(spawn(command.command, command.args, { stdio: [
		"pipe",
		"ignore",
		"pipe"
	] }));
	const startCommandPair = (params) => {
		const input = splitCommandArgv(params.inputCommand, "audio command");
		const output = splitCommandArgv(params.outputCommand, "audio command");
		const session = {
			id: `${options.bridgeIdPrefix}${randomUUID()}`,
			url: params.url,
			mode: params.mode,
			outputCommand: output,
			chunks: [],
			queuedInputBytes: 0,
			waiters: new MeetingNodeAudioPullWaiters(),
			closed: false,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastInputBytes: 0,
			lastOutputBytes: 0,
			clearCount: 0,
			outputGeneration: 0,
			outputWriteWaiters: /* @__PURE__ */ new Set(),
			retiredOutputStops: /* @__PURE__ */ new Set(),
			stopping: false,
			discardQueuedAudioOnStop: false
		};
		const outputProcess = startOutputProcess(output);
		let inputProcess;
		try {
			inputProcess = trackProcess(spawn(input.command, input.args, { stdio: [
				"ignore",
				"pipe",
				"pipe"
			] }));
		} catch (error) {
			terminateMeetingBridgeProcess(outputProcess, { graceMs: NODE_BRIDGE_TERMINATION_GRACE_MS });
			throw error;
		}
		session.input = inputProcess;
		session.output = outputProcess;
		inputProcess.stdout?.on("data", (chunk) => {
			if (session.discardQueuedAudioOnStop || session.closed) return;
			const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			session.lastInputAt = (/* @__PURE__ */ new Date()).toISOString();
			session.lastInputBytes += audio.byteLength;
			const retainedAudio = Buffer.from(audio.subarray(Math.max(0, audio.byteLength - NODE_BRIDGE_MAX_QUEUED_INPUT_BYTES)));
			session.chunks.push(retainedAudio);
			session.queuedInputBytes += retainedAudio.byteLength;
			while (session.chunks.length > NODE_BRIDGE_MAX_QUEUED_INPUT_CHUNKS || session.queuedInputBytes > NODE_BRIDGE_MAX_QUEUED_INPUT_BYTES) {
				const evicted = session.chunks.shift();
				if (evicted) session.queuedInputBytes -= evicted.byteLength;
			}
			if (!session.stopPromise) wake(session);
		});
		const stop = () => {
			stopSession(session);
		};
		inputProcess.on("exit", stop);
		inputProcess.on("error", stop);
		inputProcess.stdout?.on("error", stop);
		inputProcess.stderr?.on("error", stop);
		attachOutputProcessHandlers(session, outputProcess);
		sessions.set(session.id, session);
		return session;
	};
	const pullAudio = async (params) => {
		const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
		if (!bridgeId) throw new Error("bridgeId required");
		const session = sessions.get(bridgeId);
		if (!session) throw new Error(`unknown bridgeId: ${bridgeId}`);
		const timeoutMs = Math.min(readPositiveNumberOr(params.timeoutMs, 250), 2e3);
		if (session.chunks.length === 0 && !session.closed) await session.waiters.wait(timeoutMs);
		const chunk = session.chunks.shift();
		if (chunk) session.queuedInputBytes -= chunk.byteLength;
		const closed = session.closed && session.chunks.length === 0;
		if (closed) deleteSession(session);
		else if (chunk && session.closed && session.terminalEvictionTimer) armTerminalEviction(session);
		return {
			bridgeId,
			closed,
			base64: chunk ? chunk.toString("base64") : void 0
		};
	};
	const staleOutputResult = (session) => ({
		bridgeId: session.id,
		ok: true,
		stale: true
	});
	const writeOutputChunk = (session, output, audio) => new Promise((resolve, reject) => {
		const stdin = output.stdin;
		if (!stdin) {
			reject(/* @__PURE__ */ new Error("audio output stream is closed"));
			return;
		}
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			session.outputWriteWaiters.delete(waiter);
			if (error) reject(error);
			else resolve();
		};
		const waiter = {
			output,
			release: () => finish()
		};
		session.outputWriteWaiters.add(waiter);
		try {
			stdin.write(audio, (error) => finish(error ?? void 0));
		} catch (error) {
			finish(error instanceof Error ? error : new Error(formatErrorMessage(error)));
			return;
		}
		if (stdin.destroyed || stdin.writableEnded) finish(/* @__PURE__ */ new Error("audio output stream is closed"));
	});
	const pushAudio = async (params) => {
		const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
		const base64 = readNonEmptyStringPreservingWhitespace(params.base64);
		if (!bridgeId || !base64) throw new Error("bridgeId and base64 required");
		const session = sessions.get(bridgeId);
		if (!session || session.stopping || session.closed) throw new Error(`bridge is not open: ${bridgeId}`);
		const requestedGeneration = readOutputGeneration$1(params.outputGeneration);
		if (requestedGeneration !== void 0 && requestedGeneration !== session.outputGeneration) return staleOutputResult(session);
		const output = session.output;
		if (!output?.stdin) throw new Error(`bridge is not open: ${bridgeId}`);
		const audio = decodeMeetingAudioBase64(base64, "pushAudio");
		try {
			await writeOutputChunk(session, output, audio);
		} catch {
			if (session.output !== output || requestedGeneration !== void 0 && requestedGeneration !== session.outputGeneration) return staleOutputResult(session);
			stopSession(session);
			throw new Error(`bridge is not open: ${bridgeId}`);
		}
		if (session.stopping || session.closed || session.output !== output || requestedGeneration !== void 0 && requestedGeneration !== session.outputGeneration) return staleOutputResult(session);
		session.lastOutputAt = (/* @__PURE__ */ new Date()).toISOString();
		session.lastOutputBytes += audio.byteLength;
		return {
			bridgeId,
			ok: true
		};
	};
	const clearAudio = (params) => {
		const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
		if (!bridgeId) throw new Error("bridgeId required");
		const session = sessions.get(bridgeId);
		if (!session || session.stopping || session.closed) throw new Error(`bridge is not open: ${bridgeId}`);
		const requestedGeneration = readOutputGeneration$1(params.outputGeneration);
		if (requestedGeneration !== void 0 && requestedGeneration <= session.outputGeneration) return staleOutputResult(session);
		if (requestedGeneration === void 0 && session.outputGeneration >= Number.MAX_SAFE_INTEGER) throw new Error("outputGeneration exhausted");
		const nextGeneration = requestedGeneration ?? session.outputGeneration + 1;
		const previousOutput = session.output;
		const outputProcess = startOutputProcess(session.outputCommand);
		session.output = outputProcess;
		session.outputGeneration = nextGeneration;
		attachOutputProcessHandlers(session, outputProcess);
		releaseOutputWriteWaiters(session, previousOutput);
		session.clearCount += 1;
		session.lastClearAt = (/* @__PURE__ */ new Date()).toISOString();
		retireOutputProcess(session, previousOutput);
		return {
			bridgeId,
			ok: true,
			clearCount: session.clearCount
		};
	};
	const startBrowser = async (params) => {
		const url = options.normalizeUrl(params.url);
		const timeoutMs = readPositiveNumberOr(params.joinTimeoutMs, 3e4);
		const mode = readNonEmptyStringPreservingWhitespace(params.mode);
		let audioRuntime;
		let bridgeId;
		let audioBridge;
		if (mode && options.talkBackModes.has(mode)) {
			audioRuntime = await prepareMeetingNodeAudio(params, Math.min(timeoutMs, 1e4), options);
			const healthCommand = readMeetingNodeCommand(params.audioBridgeHealthCommand);
			if (healthCommand) {
				const health = runCommandWithTimeout(healthCommand, timeoutMs);
				if (health.code !== 0) throw new Error(`Chrome audio bridge health check failed: ${health.stderr || health.stdout || health.code}`);
			}
			const bridgeCommand = readMeetingNodeCommand(params.audioBridgeCommand);
			if (bridgeCommand) {
				if (mode === options.agentMode) throw new Error("Chrome agent mode requires audioInputCommand and audioOutputCommand so OpenClaw can run STT and regular TTS directly.");
				const bridge = runCommandWithTimeout(bridgeCommand, timeoutMs);
				if (bridge.code !== 0) throw new Error(`failed to start Chrome audio bridge: ${bridge.stderr || bridge.stdout || bridge.code}`);
				audioBridge = { type: "external-command" };
			} else {
				bridgeId = startCommandPair({
					inputCommand: audioRuntime.inputCommand,
					outputCommand: audioRuntime.outputCommand,
					url,
					mode
				}).id;
				audioBridge = {
					type: "node-command-pair",
					outputGeneration: true
				};
			}
		}
		if (params.launch !== false) {
			const argv = [
				"open",
				"-a",
				options.browser.application,
				url
			];
			const browserProfile = readNonEmptyStringPreservingWhitespace(params.browserProfile);
			if (browserProfile) argv.push(...options.browser.buildProfileArgs(browserProfile));
			try {
				const result = runCommandWithTimeout(argv, timeoutMs);
				if (result.code !== 0) throw new Error(`failed to launch Chrome for ${options.browserLabel}: ${result.stderr || result.stdout || result.code}`);
			} catch (error) {
				if (bridgeId) {
					const session = sessions.get(bridgeId);
					if (session) stopSession(session, { discardQueuedAudio: true });
				}
				throw error;
			}
		}
		return {
			launched: params.launch !== false,
			audioBackend: audioRuntime?.backend,
			audioDeviceLabel: audioRuntime?.deviceLabel,
			bridgeId,
			audioBridge,
			browser: params.launch !== false ? {
				status: options.browser.openedStatus,
				browserUrl: url,
				notes: options.browser.openedNotes
			} : void 0
		};
	};
	const bridgeStatus = (params) => {
		const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
		const session = bridgeId ? sessions.get(bridgeId) : void 0;
		return { bridge: session ? {
			bridgeId,
			closed: session.stopping || session.closed,
			createdAt: session.createdAt,
			lastInputAt: session.lastInputAt,
			lastOutputAt: session.lastOutputAt,
			lastClearAt: session.lastClearAt,
			lastInputBytes: session.lastInputBytes,
			lastOutputBytes: session.lastOutputBytes,
			clearCount: session.clearCount,
			queuedInputChunks: session.chunks.length
		} : bridgeId ? {
			bridgeId,
			closed: true
		} : void 0 };
	};
	const summarizeSession = (session) => ({
		bridgeId: session.id,
		url: session.url,
		mode: session.mode,
		closed: session.closed,
		createdAt: session.createdAt,
		lastInputAt: session.lastInputAt,
		lastOutputAt: session.lastOutputAt,
		lastInputBytes: session.lastInputBytes,
		lastOutputBytes: session.lastOutputBytes
	});
	const listSessions = (params) => {
		const urlKey = options.normalizeMeetingKey(readNonEmptyStringPreservingWhitespace(params.url));
		const mode = readNonEmptyStringPreservingWhitespace(params.mode);
		return { bridges: [...sessions.values()].filter((session) => !session.stopping && !session.closed).filter((session) => !urlKey || options.normalizeMeetingKey(session.url) === urlKey).filter((session) => !mode || session.mode === mode).map(summarizeSession) };
	};
	const stopSessionsByUrl = async (params) => {
		const urlKey = options.normalizeMeetingKey(readNonEmptyStringPreservingWhitespace(params.url));
		if (!urlKey) throw new Error("url required");
		const mode = readNonEmptyStringPreservingWhitespace(params.mode);
		const exceptBridgeId = readNonEmptyStringPreservingWhitespace(params.exceptBridgeId);
		let stopped = 0;
		const stopping = [];
		for (const [bridgeId, session] of sessions) {
			if (exceptBridgeId && bridgeId === exceptBridgeId) continue;
			if (options.normalizeMeetingKey(session.url) !== urlKey) continue;
			if (mode && session.mode !== mode) continue;
			const wasClosed = session.stopping || session.closed;
			stopping.push(stopSession(session, { discardQueuedAudio: true }));
			if (!wasClosed) stopped += 1;
		}
		await Promise.all(stopping);
		return {
			ok: true,
			stopped
		};
	};
	const stopBrowser = async (params) => {
		const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
		if (!bridgeId) return {
			ok: true,
			stopped: false
		};
		const session = sessions.get(bridgeId);
		if (!session) return {
			ok: true,
			stopped: false
		};
		const wasStopped = session.stopping || session.closed;
		await stopSession(session, { discardQueuedAudio: true });
		return {
			ok: true,
			stopped: !wasStopped
		};
	};
	return {
		hasActiveWork: () => sessions.size > 0 || activeProcesses.size > 0,
		async handleCommand(paramsJSON) {
			let raw = {};
			if (paramsJSON) try {
				raw = JSON.parse(paramsJSON);
			} catch {
				throw new Error(`${options.displayName} node host received malformed params JSON.`);
			}
			const params = asOptionalRecord(raw) ?? {};
			const action = readNonEmptyStringPreservingWhitespace(params.action);
			let result;
			switch (action) {
				case "setup":
					{
						const audioRuntime = await prepareMeetingNodeAudio(params, 1e4, options);
						result = {
							ok: true,
							audioBackend: audioRuntime.backend,
							audioDeviceLabel: audioRuntime.deviceLabel
						};
					}
					break;
				case "start":
					result = await startBrowser(params);
					break;
				case "status":
					result = bridgeStatus(params);
					break;
				case "list":
					result = listSessions(params);
					break;
				case "stopByUrl":
					result = await stopSessionsByUrl(params);
					break;
				case "pullAudio":
					result = await pullAudio(params);
					break;
				case "pushAudio":
					result = await pushAudio(params);
					break;
				case "clearAudio":
					result = clearAudio(params);
					break;
				case "stop":
					result = await stopBrowser(params);
					break;
				default: throw new Error(`unsupported ${options.commandName} action`);
			}
			return JSON.stringify(result);
		}
	};
}
//#endregion
//#region src/meeting-bot/configured-node-host.ts
function isSpawnSyncTimeout(error) {
	return error instanceof Error && "code" in error && error.code === "ETIMEDOUT";
}
function createMeetingConfiguredNodeHost(options) {
	const runCommand = (argv, timeoutMs) => {
		const [command, ...args] = argv;
		if (!command) return {
			code: 1,
			stderr: "command must not be empty"
		};
		const result = spawnSync(command, args, {
			encoding: "utf8",
			timeout: timeoutMs
		});
		if (isSpawnSyncTimeout(result.error)) throw new Error(`${options.meetingLabel} audio prerequisite check timed out on the node.`);
		const stderr = [
			result.error ? result.error instanceof Error ? result.error.message : String(result.error) : "",
			result.stderr,
			result.signal ? `terminated by ${result.signal}` : ""
		].filter(Boolean).join(": ");
		return {
			code: typeof result.status === "number" ? result.status : 1,
			stdout: result.stdout ?? "",
			stderr
		};
	};
	const probeCommand = (command, timeoutMs) => {
		const result = spawnSync("/bin/sh", [
			"-lc",
			"command -v \"$1\" >/dev/null 2>&1",
			"sh",
			command
		], {
			encoding: "utf8",
			timeout: timeoutMs
		});
		if (isSpawnSyncTimeout(result.error)) return "timed-out";
		return result.status === 0 ? "found" : "missing";
	};
	const prepareAudio = async (config, timeoutMs) => {
		const deadline = Date.now() + timeoutMs;
		const commandTimeout = () => {
			if (!options.sharePrerequisiteDeadline) return timeoutMs;
			const remainingMs = deadline - Date.now();
			if (remainingMs <= 0) throw new Error(`${options.meetingLabel} audio prerequisite check timed out on the node.`);
			return remainingMs;
		};
		const runtime = resolveMeetingAudioRuntimeForFormat({
			backend: config.backend,
			bufferBytes: config.bufferBytes,
			format: config.format,
			inputCommand: config.inputCommand,
			outputCommand: config.outputCommand
		});
		await ensureMeetingAudioBackend({
			backend: runtime.backend,
			run: async (argv, requestedTimeoutMs) => {
				return runCommand(argv, Math.min(requestedTimeoutMs, commandTimeout()));
			},
			timeoutMs
		});
		const commandNames = new Set([
			runtime.inputCommand,
			runtime.outputCommand,
			config.bargeInInputCommand
		].flatMap((command) => command?.[0] ? [command[0]] : []));
		for (const command of commandNames) {
			const probeResult = probeCommand(command, commandTimeout());
			if (probeResult === "timed-out") throw new Error(`${options.meetingLabel} audio prerequisite check timed out on the node.`);
			if (probeResult === "missing") throw new Error(`Configured audio command not found on the node: ${command}`);
		}
		return runtime;
	};
	const host = createMeetingNodeHost({
		...options,
		assertAudioAvailable: async (timeoutMs) => {
			await prepareAudio({
				backend: options.defaultAudio?.backend ?? "auto",
				bufferBytes: options.defaultAudio?.bufferBytes ?? 4096,
				format: options.defaultAudio?.format ?? "pcm16-24khz"
			}, timeoutMs);
		},
		prepareAudio
	});
	return Object.assign(host.handleCommand, { hasActiveWork: host.hasActiveWork });
}
//#endregion
//#region src/meeting-bot/meeting-modes.ts
function isMeetingTalkBackMode(mode) {
	return mode === "agent" || mode === "bidi";
}
function isMeetingRealtimeRouteReady(mode, health) {
	return isMeetingTalkBackMode(mode) && health?.inCall === true && health.micMuted === false && health.audioInputRouted === true && health.audioOutputRouted === true && health.manualAction === void 0;
}
//#endregion
//#region src/meeting-bot/plugin-cli.ts
function parseTimeout(value) {
	if (value === void 0) return;
	const parsed = parseStrictNonNegativeInteger(value);
	if (parsed === void 0 || parsed === 0) throw new Error("timeout-ms must be a positive integer");
	return parsed;
}
function parseMeetingCliMode(value) {
	if (value === void 0 || value === "agent" || value === "bidi" || value === "transcribe") return value;
	throw new Error(`mode must be agent, bidi, or transcribe; received ${value}`);
}
function parseMeetingCliTransport(value) {
	if (value === void 0 || value === "chrome" || value === "chrome-node") return value;
	throw new Error(`transport must be chrome or chrome-node; received ${value}`);
}
function markMeetingSetupFailure(result) {
	if (result && typeof result === "object" && "ok" in result && result.ok === false) process.exitCode = 1;
}
function joinPayload(url, options) {
	return {
		url,
		...options.transport ? { transport: parseMeetingCliTransport(options.transport) } : {},
		...options.mode ? { mode: parseMeetingCliMode(options.mode) } : {},
		...options.message ? { message: options.message } : {},
		...options.timeoutMs ? { timeoutMs: parseTimeout(options.timeoutMs) } : {}
	};
}
function addJoinOptions(command) {
	return command.option("--transport <transport>", "chrome or chrome-node").option("--mode <mode>", "agent, bidi, or transcribe").option("--message <text>", "instructions to speak after joining");
}
function registerMeetingPluginCli(options) {
	const call = async (method, payload) => {
		const requestedTimeoutMs = typeof payload?.timeoutMs === "number" ? payload.timeoutMs : void 0;
		const timeoutMs = options.resolveGatewayTimeoutMs({
			config: options.config,
			method,
			requestedTimeoutMs
		});
		const result = await options.callGateway(method, {
			json: true,
			timeout: String(timeoutMs)
		}, payload, {
			progress: false,
			scopes: ["operator.admin"]
		});
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
		return result;
	};
	const method = (action) => `${options.methodPrefix}.${action}`;
	const root = options.program.command(options.commandName).description(options.descriptions.root);
	const command = (usage, description) => root.command(usage).description(description);
	addJoinOptions(command("join <url>", options.descriptions.join)).action(async (url, joinOptions) => {
		await call(method("join"), joinPayload(url, joinOptions));
	});
	command("leave <session-id>", options.descriptions.leave).action(async (sessionId) => {
		await call(method("leave"), { sessionId });
	});
	command("status [session-id]", options.descriptions.status).action(async (sessionId) => {
		await call(method("status"), sessionId ? { sessionId } : {});
	});
	command("transcript <session-id>", "read the current transcript snapshot").option("--since-index <index>", "resume from a prior transcript index").action(async (sessionId, transcriptOptions) => {
		const sinceIndex = transcriptOptions.sinceIndex === void 0 ? void 0 : parseStrictNonNegativeInteger(transcriptOptions.sinceIndex);
		if (transcriptOptions.sinceIndex !== void 0 && sinceIndex === void 0) throw new Error("since-index must be a non-negative integer");
		await call(method("transcript"), {
			sessionId,
			...sinceIndex === void 0 ? {} : { sinceIndex }
		});
	});
	command("speak <session-id> [message]", "speak through an active talk-back session").action(async (sessionId, message) => {
		await call(method("speak"), {
			sessionId,
			...message ? { message } : {}
		});
	});
	command("setup", options.descriptions.setup).option("--transport <transport>", "chrome or chrome-node").option("--mode <mode>", "agent, bidi, or transcribe").action(async (setupOptions) => {
		markMeetingSetupFailure(await call(method("setup"), {
			transport: parseMeetingCliTransport(setupOptions.transport),
			mode: parseMeetingCliMode(setupOptions.mode)
		}));
	});
	for (const [name, action, description] of [[
		"test-speech",
		"testSpeech",
		options.descriptions.testSpeech
	], [
		"test-listen",
		"testListen",
		options.descriptions.testListen
	]]) addJoinOptions(command(`${name} <url>`, description)).option("--timeout-ms <ms>", "probe timeout in milliseconds").action(async (url, joinOptions) => {
		await call(method(action), joinPayload(url, joinOptions));
	});
}
//#endregion
//#region src/meeting-bot/plugin-config.ts
const DEFAULT_AUDIO_BUFFER_BYTES = 4096;
const DEFAULT_AUDIO_FORMAT = "pcm16-24khz";
const DEFAULT_MODE_HELP = "Agent consults OpenClaw, bidi uses direct realtime voice, and transcribe observes only.";
const CHROME_NODE_HELP = "Node id/name/IP that owns Chrome and the native virtual-audio backend.";
function resolveBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function resolvePositiveNumber(value, fallback) {
	return asPositiveFiniteNumber(value) ?? fallback;
}
function resolveTimer(value, fallback) {
	return resolvePositiveTimerTimeoutMs(resolvePositiveNumber(value, fallback), fallback);
}
function resolveMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "agent" || normalized === "bidi" || normalized === "transcribe" ? normalized : "agent";
}
function resolveAudioFormat(value) {
	const normalized = normalizeOptionalLowercaseString(value)?.replaceAll("_", "-");
	return normalized === "g711-ulaw-8khz" ? normalized : DEFAULT_AUDIO_FORMAT;
}
function resolveAudioBackend(value) {
	const normalized = normalizeOptionalLowercaseString(value)?.replaceAll("_", "-");
	return normalized === "blackhole-2ch" || normalized === "pipewire-pulse" ? normalized : "auto";
}
function resolveProviders(value) {
	const providers = {};
	for (const [key, entry] of Object.entries(asRecord(value))) {
		const id = normalizeOptionalLowercaseString(key);
		if (id) providers[id] = asRecord(entry);
	}
	return providers;
}
function createMeetingPluginConfigSchema(options) {
	const buildAudioCommands = (backend, format, bufferBytes) => {
		const platform = backend === "blackhole-2ch" ? "darwin" : backend === "pipewire-pulse" ? "linux" : process.platform;
		try {
			return resolveMeetingAudioRuntimeForFormat({
				backend,
				bufferBytes,
				format,
				platform
			});
		} catch {
			return resolveMeetingAudioRuntimeForFormat({
				backend: "blackhole-2ch",
				bufferBytes,
				format,
				platform: "darwin"
			});
		}
	};
	const defaultAudioRuntime = buildAudioCommands("auto", DEFAULT_AUDIO_FORMAT, DEFAULT_AUDIO_BUFFER_BYTES);
	const defaults = {
		enabled: true,
		defaultMode: "agent",
		chrome: {
			audioBackend: "auto",
			audioFormat: DEFAULT_AUDIO_FORMAT,
			audioBufferBytes: DEFAULT_AUDIO_BUFFER_BYTES,
			launch: true,
			guestName: "OpenClaw Agent",
			reuseExistingTab: true,
			autoJoin: true,
			joinTimeoutMs: 3e4,
			waitForInCallMs: 6e4,
			audioInputCommand: defaultAudioRuntime.inputCommand,
			audioOutputCommand: defaultAudioRuntime.outputCommand,
			bargeInRmsThreshold: 650,
			bargeInPeakThreshold: 2500,
			bargeInCooldownMs: 900
		},
		chromeNode: {},
		realtime: {
			strategy: "agent",
			provider: "openai",
			transcriptionProvider: "openai",
			instructions: options.defaultRealtimeInstructions,
			introMessage: "Say exactly: I'm here and listening.",
			toolPolicy: "safe-read-only",
			providers: {}
		}
	};
	const resolveConfig = (input) => {
		const raw = asRecord(input);
		const chrome = asRecord(raw.chrome);
		const chromeNode = asRecord(raw.chromeNode);
		const realtime = asRecord(raw.realtime);
		const audioFormat = resolveAudioFormat(chrome.audioFormat);
		const audioBufferBytes = Math.max(17, Math.trunc(resolvePositiveNumber(chrome.audioBufferBytes, DEFAULT_AUDIO_BUFFER_BYTES)));
		const audioBackend = resolveAudioBackend(chrome.audioBackend);
		const generatedCommands = buildAudioCommands(audioBackend, audioFormat, audioBufferBytes);
		const audioInputCommandOverride = normalizeOptionalTrimmedStringList(chrome.audioInputCommand);
		const audioOutputCommandOverride = normalizeOptionalTrimmedStringList(chrome.audioOutputCommand);
		const provider = normalizeOptionalString(realtime.provider) ?? defaults.realtime.provider;
		return {
			enabled: resolveBoolean(raw.enabled, defaults.enabled),
			defaultMode: resolveMode(raw.defaultMode),
			chrome: {
				audioBackend,
				audioFormat,
				audioBufferBytes,
				launch: resolveBoolean(chrome.launch, defaults.chrome.launch),
				browserProfile: normalizeOptionalString(chrome.browserProfile),
				guestName: normalizeOptionalString(chrome.guestName) ?? defaults.chrome.guestName,
				reuseExistingTab: resolveBoolean(chrome.reuseExistingTab, defaults.chrome.reuseExistingTab),
				autoJoin: resolveBoolean(chrome.autoJoin, defaults.chrome.autoJoin),
				joinTimeoutMs: resolveTimer(chrome.joinTimeoutMs, defaults.chrome.joinTimeoutMs),
				waitForInCallMs: resolveTimer(chrome.waitForInCallMs, defaults.chrome.waitForInCallMs),
				audioInputCommand: audioInputCommandOverride ?? generatedCommands.inputCommand,
				audioOutputCommand: audioOutputCommandOverride ?? generatedCommands.outputCommand,
				audioInputCommandOverride,
				audioOutputCommandOverride,
				bargeInInputCommand: normalizeOptionalTrimmedStringList(chrome.bargeInInputCommand),
				bargeInRmsThreshold: resolvePositiveNumber(chrome.bargeInRmsThreshold, defaults.chrome.bargeInRmsThreshold),
				bargeInPeakThreshold: resolvePositiveNumber(chrome.bargeInPeakThreshold, defaults.chrome.bargeInPeakThreshold),
				bargeInCooldownMs: resolveTimer(chrome.bargeInCooldownMs, defaults.chrome.bargeInCooldownMs)
			},
			chromeNode: { node: normalizeOptionalString(chromeNode.node) },
			realtime: {
				strategy: normalizeOptionalLowercaseString(realtime.strategy) === "bidi" ? "bidi" : "agent",
				provider,
				transcriptionProvider: normalizeOptionalString(realtime.transcriptionProvider) ?? defaults.realtime.transcriptionProvider,
				voiceProvider: normalizeOptionalString(realtime.voiceProvider),
				model: normalizeOptionalString(realtime.model),
				instructions: normalizeOptionalString(realtime.instructions) ?? defaults.realtime.instructions,
				introMessage: typeof realtime.introMessage === "string" ? realtime.introMessage.trim() : defaults.realtime.introMessage,
				agentId: normalizeOptionalString(realtime.agentId),
				toolPolicy: resolveRealtimeVoiceAgentConsultToolPolicy(realtime.toolPolicy, defaults.realtime.toolPolicy),
				providers: resolveProviders(realtime.providers)
			}
		};
	};
	return {
		configSchema: {
			parse: resolveConfig,
			uiHints: {
				defaultMode: {
					label: "Default Mode",
					help: DEFAULT_MODE_HELP
				},
				"chrome.audioBackend": {
					label: "Chrome Audio Backend",
					help: "Auto selects BlackHole 2ch on macOS or PipeWire-Pulse on Linux."
				},
				"chrome.browserProfile": {
					label: "Chrome Profile",
					advanced: true
				},
				"chrome.guestName": { label: "Guest Name" },
				"chrome.waitForInCallMs": {
					label: "Wait For In-Call (ms)",
					advanced: true
				},
				"chrome.audioInputCommand": {
					label: "Audio Input Command",
					advanced: true
				},
				"chrome.audioOutputCommand": {
					label: "Audio Output Command",
					advanced: true
				},
				"chromeNode.node": {
					label: "Chrome Node",
					help: CHROME_NODE_HELP,
					advanced: true
				},
				"realtime.transcriptionProvider": { label: "Realtime Transcription Provider" },
				"realtime.voiceProvider": { label: "Bidi Voice Provider" },
				"realtime.model": {
					label: "Bidi Realtime Model",
					advanced: true
				},
				"realtime.instructions": {
					label: "Realtime Instructions",
					advanced: true
				},
				"realtime.introMessage": { label: "Realtime Intro Message" },
				"realtime.agentId": {
					label: "Realtime Consult Agent",
					advanced: true
				},
				"realtime.toolPolicy": {
					label: "Realtime Tool Policy",
					advanced: true
				}
			}
		},
		defaultAudioInputCommand: defaultAudioRuntime.inputCommand,
		defaultAudioOutputCommand: defaultAudioRuntime.outputCommand,
		resolveConfig,
		resolveGatewayOperationTimeoutMs: (config) => options.resolveGatewayOperationTimeoutMs(config)
	};
}
//#endregion
//#region src/meeting-bot/plugin-entry.ts
function readErrorDetails(error) {
	return error && typeof error === "object" && "details" in error ? error.details : void 0;
}
function createMeetingPluginEntryOptions(options) {
	const invalidRequest = (message) => {
		throw options.invalidRequest(message);
	};
	const normalizeTransport = (value) => {
		if (value === void 0) return;
		if (value === "chrome" || value === "chrome-node") return value;
		return invalidRequest("transport must be chrome or chrome-node");
	};
	const normalizeMode = (value) => {
		if (value === void 0) return;
		if (value === "agent" || value === "bidi" || value === "transcribe") return value;
		return invalidRequest("mode must be agent, bidi, or transcribe");
	};
	const requireString = (value, name) => {
		return normalizeOptionalString(value) ?? invalidRequest(`${name} required`);
	};
	const readSinceIndex = (raw) => {
		try {
			return readNonNegativeIntegerParam(raw, "sinceIndex");
		} catch (error) {
			return invalidRequest(formatErrorMessage(error));
		}
	};
	const keepTrustedToolContext = (raw, client) => {
		const { agentId: rawAgentId, requesterSessionKey: rawRequesterSessionKey, ...rest } = raw;
		const trustedOwner = client?.internal?.pluginRuntimeOwnerId === options.id;
		const agentId = trustedOwner ? normalizeOptionalString(rawAgentId) : void 0;
		const requesterSessionKey = options.normalizeRequesterSessionKey(rawRequesterSessionKey, trustedOwner);
		return {
			...rest,
			...agentId ? { agentId } : {},
			...requesterSessionKey ? { requesterSessionKey } : {}
		};
	};
	const trustedToolAgentId = (raw, client) => normalizeOptionalString(keepTrustedToolContext(raw, client).agentId);
	const joinRequest = (raw, joinOptions) => {
		if (!joinOptions?.allowTimeout && raw.timeoutMs !== void 0) return invalidRequest("timeoutMs is supported only by testSpeech or testListen");
		try {
			return {
				url: options.normalizeUrl(requireString(raw.url, "url")),
				transport: normalizeTransport(raw.transport),
				mode: normalizeMode(raw.mode),
				message: normalizeOptionalString(raw.message),
				requesterSessionKey: normalizeOptionalString(raw.requesterSessionKey),
				agentId: normalizeOptionalString(raw.agentId),
				timeoutMs: readPositiveIntegerParam(raw, "timeoutMs")
			};
		} catch (error) {
			if (options.isInvalidRequest(error)) throw error;
			return invalidRequest(formatErrorMessage(error));
		}
	};
	const gatewayMethod = (action) => `${options.gatewayMethodPrefix}.${action}`;
	const callGatewayFromTool = async (params) => {
		try {
			const timeoutMs = options.resolveGatewayTimeoutMs(params.config);
			if (params.runtime) return await params.runtime.gateway.request(gatewayMethod(params.action), params.raw, {
				timeoutMs,
				scopes: ["operator.admin"]
			});
			return await callGatewayFromCli(gatewayMethod(params.action), {
				json: true,
				timeout: String(timeoutMs)
			}, params.raw, {
				progress: false,
				scopes: ["operator.admin"]
			});
		} catch (error) {
			const details = readErrorDetails(error);
			if (details && typeof details === "object") return details;
			throw error;
		}
	};
	return {
		id: options.id,
		name: options.name,
		description: options.description,
		configSchema: options.configSchema,
		register(api) {
			const config = options.configSchema.parse(api.pluginConfig);
			let transcriptsEnabled = api.config.transcripts?.enabled !== false;
			let runtime;
			const ensureRuntime = async () => {
				if (!config.enabled) throw new Error(options.disabledMessage);
				if (!runtime) {
					runtime = options.createRuntime({
						api,
						config
					});
					await runtime.reconcileTranscriptPolicy?.(transcriptsEnabled);
				}
				return runtime;
			};
			if (options.transcriptSource) {
				api.registerService({
					id: `${options.id}-transcripts`,
					reload: { configPrefixes: ["transcripts.enabled"] },
					start: ({ config: current }) => {
						transcriptsEnabled = current.transcripts?.enabled !== false;
						return runtime?.reconcileTranscriptPolicy?.(transcriptsEnabled);
					},
					stop: () => {
						transcriptsEnabled = false;
						return runtime?.reconcileTranscriptPolicy?.(false);
					}
				});
				api.registerTranscriptSourceProvider(createMeetingTranscriptSourceProvider({
					...options.transcriptSource,
					runtime: async () => {
						const resolved = await ensureRuntime();
						if (!resolved.startTranscriptSource || !resolved.stopTranscriptSource) throw new Error(`${options.name} transcript source runtime is unavailable`);
						return resolved;
					}
				}));
			}
			const sendError = (respond, error, code = ErrorCodes.UNAVAILABLE) => {
				const payload = { error: formatErrorMessage(error) };
				respond(false, payload, errorShape(code, payload.error, { details: payload }));
			};
			const sendRequestError = (respond, error) => sendError(respond, error, options.isInvalidRequest(error) ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE);
			api.registerGatewayMethod(`${options.gatewayMethodPrefix}.join`, async ({ params, client, respond }) => {
				try {
					const raw = keepTrustedToolContext(asOptionalRecord(params) ?? {}, client);
					respond(true, await (await ensureRuntime()).join(joinRequest(raw)));
				} catch (error) {
					sendRequestError(respond, error);
				}
			});
			api.registerGatewayMethod(`${options.gatewayMethodPrefix}.leave`, async ({ params, client, respond }) => {
				try {
					const raw = asOptionalRecord(params) ?? {};
					const agentId = trustedToolAgentId(raw, client);
					const sessionId = requireString(raw.sessionId, "sessionId");
					const rt = await ensureRuntime();
					respond(true, agentId && !rt.ownsSession(agentId, sessionId) ? { found: false } : await rt.leave(sessionId));
				} catch (error) {
					sendRequestError(respond, error);
				}
			});
			api.registerGatewayMethod(`${options.gatewayMethodPrefix}.status`, async ({ params, client, respond }) => {
				try {
					const raw = asOptionalRecord(params) ?? {};
					const agentId = trustedToolAgentId(raw, client);
					const rt = await ensureRuntime();
					respond(true, agentId ? await rt.statusForAgent(agentId, normalizeOptionalString(raw.sessionId)) : await rt.status(normalizeOptionalString(raw.sessionId)));
				} catch (error) {
					sendRequestError(respond, error);
				}
			});
			api.registerGatewayMethod(`${options.gatewayMethodPrefix}.transcript`, async ({ params, client, respond }) => {
				try {
					const raw = asOptionalRecord(params) ?? {};
					const sessionId = requireString(raw.sessionId, "sessionId");
					const sinceIndex = readSinceIndex(raw);
					const agentId = trustedToolAgentId(raw, client);
					const rt = await ensureRuntime();
					respond(true, agentId && !rt.ownsSession(agentId, sessionId) ? { found: false } : await rt.transcript(sessionId, sinceIndex === void 0 ? {} : { sinceIndex }));
				} catch (error) {
					sendRequestError(respond, error);
				}
			});
			api.registerGatewayMethod(`${options.gatewayMethodPrefix}.speak`, async ({ params, client, respond }) => {
				try {
					const raw = asOptionalRecord(params) ?? {};
					const sessionId = requireString(raw.sessionId, "sessionId");
					const agentId = trustedToolAgentId(raw, client);
					const rt = await ensureRuntime();
					respond(true, agentId && !rt.ownsSession(agentId, sessionId) ? {
						found: false,
						spoken: false
					} : await rt.speak(sessionId, normalizeOptionalString(raw.message)));
				} catch (error) {
					sendRequestError(respond, error);
				}
			});
			api.registerGatewayMethod(`${options.gatewayMethodPrefix}.setup`, async ({ params, respond }) => {
				try {
					respond(true, await (await ensureRuntime()).setupStatus({
						mode: normalizeMode(params?.mode),
						transport: normalizeTransport(params?.transport)
					}));
				} catch (error) {
					sendRequestError(respond, error);
				}
			});
			for (const [method, run] of [[`${options.gatewayMethodPrefix}.testSpeech`, (rt, raw) => rt.testSpeech(joinRequest(raw, { allowTimeout: true }))], [`${options.gatewayMethodPrefix}.testListen`, (rt, raw) => rt.testListen(joinRequest(raw, { allowTimeout: true }))]]) api.registerGatewayMethod(method, async ({ params, client, respond }) => {
				try {
					const raw = keepTrustedToolContext(asOptionalRecord(params) ?? {}, client);
					respond(true, await run(await ensureRuntime(), raw));
				} catch (error) {
					sendRequestError(respond, error);
				}
			});
			api.registerTool((toolContext) => ({
				name: options.toolName,
				label: options.toolLabel,
				description: options.toolDescription,
				parameters: options.toolParameters,
				async execute(_toolCallId, params) {
					const raw = asOptionalRecord(params) ?? {};
					const action = raw.action;
					const requesterSessionKey = normalizeOptionalString(toolContext.sessionKey);
					const contextAgentId = toolContext.agentId ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
					const agentId = options.normalizeToolAgentId(contextAgentId);
					try {
						if (![
							"join",
							"leave",
							"status",
							"transcript",
							"speak"
						].includes(action)) throw new Error(options.unknownActionMessage);
						const runtimeForTool = await options.resolveToolRuntime(api, agentId);
						return jsonResult(await callGatewayFromTool({
							action,
							config,
							raw: {
								...raw,
								...requesterSessionKey ? { requesterSessionKey } : {},
								...runtimeForTool && agentId ? { agentId } : {}
							},
							runtime: runtimeForTool
						}));
					} catch (error) {
						return jsonResult({ error: formatErrorMessage(error) });
					}
				}
			}), { name: options.toolName });
			if (options.registerNodeWhen(config)) {
				api.registerNodeHostCommand({
					command: options.nodeCommand,
					cap: options.cap,
					dangerous: true,
					handle: (paramsJSON) => options.nodeHandler(paramsJSON),
					hasActiveWork: options.nodeHandler.hasActiveWork
				});
				api.registerNodeInvokePolicy(options.createNodePolicy(config));
			}
			options.registerCli(api, config);
		}
	};
}
//#endregion
//#region src/meeting-bot/agent-consult.ts
function resolveMeetingRealtimeTools(policy) {
	return resolveRealtimeVoiceAgentConsultTools(policy);
}
function resolveMeetingAgentConsultSurface(platform) {
	return {
		id: platform.id,
		provider: platform.id,
		lane: platform.id,
		...platform.agentConsult
	};
}
function createMeetingRealtimeEngineBindings(params) {
	const surface = resolveMeetingAgentConsultSurface(params.platform);
	return {
		platform: {
			displayName: params.platform.displayName,
			logScope: params.platform.logScope,
			sessionIdPrefix: params.platform.id
		},
		consultAgent: async (consult) => await consultMeetingAgent({
			surface,
			config: params.fullConfig,
			runtime: params.runtime,
			logger: params.logger,
			agentId: params.config.realtime.agentId,
			toolPolicy: params.config.realtime.toolPolicy,
			...consult
		}),
		tools: resolveMeetingRealtimeTools(params.config.realtime.toolPolicy),
		handleToolCall: async (call) => {
			const abortSignal = readMeetingRealtimeToolAbortSignal(call.session);
			await handleMeetingRealtimeConsultToolCall({
				surface,
				config: params.fullConfig,
				runtime: params.runtime,
				logger: params.logger,
				agentId: params.config.realtime.agentId,
				toolPolicy: params.config.realtime.toolPolicy,
				abortSignal,
				...call
			});
		}
	};
}
async function submitMeetingConsultWorkingResponse(params) {
	if (params.abortSignal?.aborted || !params.session.bridge.supportsToolResultContinuation) return;
	await params.session.submitToolResult(params.callId, buildRealtimeVoiceAgentConsultWorkingResponse(params.label), { willContinue: true });
}
async function consultMeetingAgent(params) {
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : resolveDefaultAgentId(params.config);
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey) ?? `agent:${agentId}:main`;
	const sessionKey = `agent:${agentId}:subagent:${params.surface.id}:${params.meetingSessionId}`;
	return await consultRealtimeVoiceAgent({
		cfg: params.config,
		agentRuntime: params.runtime.agent,
		logger: params.logger,
		agentId,
		sessionKey,
		messageProvider: params.surface.provider,
		lane: params.surface.lane,
		runIdPrefix: `${params.surface.id}:${params.meetingSessionId}`,
		spawnedBy: requesterSessionKey,
		contextMode: "fork",
		args: params.args,
		transcript: params.transcript,
		surface: params.surface.surface,
		userLabel: params.surface.userLabel,
		assistantLabel: params.surface.assistantLabel,
		questionSourceLabel: params.surface.questionSourceLabel,
		toolsAllow: resolveRealtimeVoiceAgentConsultToolsAllow(params.toolPolicy),
		extraSystemPrompt: params.surface.extraSystemPrompt,
		abortSignal: params.abortSignal
	});
}
async function handleMeetingRealtimeConsultToolCall(params) {
	const callId = params.event.callId || params.event.itemId;
	if (params.abortSignal?.aborted) return;
	if (params.strategy !== "bidi") {
		const error = `Tool "${params.event.name}" is only available in bidi realtime strategy`;
		await params.session.submitToolResult(callId, { error });
		if (params.abortSignal?.aborted) return;
		params.onTalkEvent?.({
			type: "tool.error",
			callId,
			payload: {
				name: params.event.name,
				error
			},
			final: true
		});
		return;
	}
	if (params.event.name !== "openclaw_agent_consult") {
		const error = `Tool "${params.event.name}" not available`;
		await params.session.submitToolResult(callId, { error });
		if (params.abortSignal?.aborted) return;
		params.onTalkEvent?.({
			type: "tool.error",
			callId,
			payload: {
				name: params.event.name,
				error
			},
			final: true
		});
		return;
	}
	await submitMeetingConsultWorkingResponse({
		session: params.session,
		abortSignal: params.abortSignal,
		callId,
		label: params.surface.workingResponseLabel
	});
	if (params.abortSignal?.aborted) return;
	params.onTalkEvent?.({
		type: "tool.progress",
		callId,
		payload: {
			name: params.event.name,
			status: "working"
		}
	});
	let result;
	try {
		result = await consultMeetingAgent({
			surface: params.surface,
			config: params.config,
			runtime: params.runtime,
			logger: params.logger,
			agentId: params.agentId,
			toolPolicy: params.toolPolicy,
			meetingSessionId: params.meetingSessionId,
			requesterSessionKey: params.requesterSessionKey,
			args: params.event.args,
			transcript: params.transcript,
			abortSignal: params.abortSignal
		});
	} catch (error) {
		if (params.abortSignal?.aborted) return;
		const message = formatErrorMessage(error);
		await params.session.submitToolResult(callId, { error: message });
		if (params.abortSignal?.aborted) return;
		params.onTalkEvent?.({
			type: "tool.error",
			callId,
			payload: {
				name: params.event.name,
				error: message
			},
			final: true
		});
		return;
	}
	if (params.abortSignal?.aborted) return;
	await params.session.submitToolResult(callId, result);
	if (params.abortSignal?.aborted) return;
	params.onTalkEvent?.({
		type: "tool.result",
		callId,
		payload: {
			name: params.event.name,
			result
		},
		final: true
	});
}
//#endregion
//#region src/meeting-bot/node-invoke-policy.ts
function readOutputGeneration(value) {
	return asSafeIntegerInRange(value, { min: 0 });
}
function copyCommand(command) {
	return command && command.length > 0 ? [...command] : void 0;
}
function copyConfiguredAudio(target, start) {
	if (start.audioBackend === "auto" || start.audioBackend === "blackhole-2ch" || start.audioBackend === "pipewire-pulse") target.audioBackend = start.audioBackend;
	if (typeof start.audioBufferBytes === "number" && start.audioBufferBytes > 0) target.audioBufferBytes = start.audioBufferBytes;
	if (start.audioFormat === "pcm16-24khz" || start.audioFormat === "g711-ulaw-8khz") target.audioFormat = start.audioFormat;
	const hasCommandOverrideFields = "audioInputCommandOverride" in start || "audioOutputCommandOverride" in start;
	const audioInputCommand = copyCommand(start.audioInputCommandOverride ?? (hasCommandOverrideFields ? void 0 : start.audioInputCommand));
	const audioOutputCommand = copyCommand(start.audioOutputCommandOverride ?? (hasCommandOverrideFields ? void 0 : start.audioOutputCommand));
	if (audioInputCommand) target.audioInputCommand = audioInputCommand;
	if (audioOutputCommand) target.audioOutputCommand = audioOutputCommand;
	for (const key of [
		"bargeInInputCommand",
		"audioBridgeCommand",
		"audioBridgeHealthCommand"
	]) {
		const command = copyCommand(start[key]);
		if (command) target[key] = command;
	}
}
function denied(options, message) {
	return {
		ok: false,
		code: options.deniedCode,
		message
	};
}
function approved(params) {
	return {
		approved: true,
		params
	};
}
function buildStartParams(params, options) {
	let url;
	try {
		url = options.normalizeUrl(params.url);
	} catch (error) {
		return {
			approved: false,
			result: denied(options, error instanceof Error ? error.message : `${options.commandName} start requires url`)
		};
	}
	const mode = readNonEmptyStringPreservingWhitespace(params.mode);
	if (mode && !options.supportedModes.has(mode)) return {
		approved: false,
		result: denied(options, `${options.commandName} start mode is unsupported: ${mode}`)
	};
	const startParams = {
		action: "start",
		url,
		launch: params.launch === false ? false : options.start.launch,
		browserProfile: options.start.browserProfile,
		joinTimeoutMs: options.start.joinTimeoutMs
	};
	if (mode) startParams.mode = mode;
	copyConfiguredAudio(startParams, options.start);
	return approved(startParams);
}
function denyMissing(options, action, field) {
	return {
		approved: false,
		result: denied(options, `${options.commandName} ${action} requires ${field}`)
	};
}
function buildForwardParams(params, options) {
	const action = readNonEmptyStringPreservingWhitespace(params.action);
	switch (action) {
		case "setup": return approved({ action });
		case "status": {
			const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
			return approved(bridgeId ? {
				action,
				bridgeId
			} : { action });
		}
		case "list": {
			const forwarded = { action };
			const url = readNonEmptyStringPreservingWhitespace(params.url);
			const mode = readNonEmptyStringPreservingWhitespace(params.mode);
			if (url) try {
				forwarded.url = options.normalizeUrl(url);
			} catch (error) {
				return {
					approved: false,
					result: denied(options, error instanceof Error ? error.message : `${options.commandName} list url`)
				};
			}
			if (mode) forwarded.mode = mode;
			return approved(forwarded);
		}
		case "stopByUrl": {
			const forwarded = { action };
			const url = readNonEmptyStringPreservingWhitespace(params.url);
			const mode = readNonEmptyStringPreservingWhitespace(params.mode);
			const exceptBridgeId = readNonEmptyStringPreservingWhitespace(params.exceptBridgeId);
			if (!url) return denyMissing(options, action, "url");
			try {
				forwarded.url = options.normalizeUrl(url);
			} catch (error) {
				return {
					approved: false,
					result: denied(options, error instanceof Error ? error.message : `${options.commandName} stopByUrl url`)
				};
			}
			if (mode) forwarded.mode = mode;
			if (exceptBridgeId) forwarded.exceptBridgeId = exceptBridgeId;
			return approved(forwarded);
		}
		case "pullAudio": {
			const forwarded = { action };
			const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
			const timeoutMs = asPositiveFiniteNumber(params.timeoutMs);
			if (!bridgeId) return denyMissing(options, action, "bridgeId");
			forwarded.bridgeId = bridgeId;
			if (timeoutMs) forwarded.timeoutMs = timeoutMs;
			return approved(forwarded);
		}
		case "pushAudio": {
			const forwarded = { action };
			const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
			const base64 = readNonEmptyStringPreservingWhitespace(params.base64);
			if (!bridgeId) return denyMissing(options, action, "bridgeId");
			if (!base64) return denyMissing(options, action, "base64");
			if (!isMeetingAudioBase64(base64)) return {
				approved: false,
				result: denied(options, "base64 must be a valid audio payload")
			};
			forwarded.bridgeId = bridgeId;
			forwarded.base64 = base64;
			const outputGeneration = readOutputGeneration(params.outputGeneration);
			if (params.outputGeneration !== void 0 && outputGeneration === void 0) return {
				approved: false,
				result: denied(options, "outputGeneration must be a non-negative safe integer")
			};
			if (outputGeneration !== void 0) forwarded.outputGeneration = outputGeneration;
			return approved(forwarded);
		}
		case "clearAudio": {
			const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
			if (!bridgeId) return denyMissing(options, action, "bridgeId");
			const outputGeneration = readOutputGeneration(params.outputGeneration);
			if (params.outputGeneration !== void 0 && outputGeneration === void 0) return {
				approved: false,
				result: denied(options, "outputGeneration must be a non-negative safe integer")
			};
			return approved({
				action,
				bridgeId,
				...outputGeneration !== void 0 ? { outputGeneration } : {}
			});
		}
		case "stop": {
			const bridgeId = readNonEmptyStringPreservingWhitespace(params.bridgeId);
			return approved(bridgeId ? {
				action,
				bridgeId
			} : { action });
		}
		default: return null;
	}
}
function createMeetingBrowserNodeInvokePolicy(options) {
	return {
		commands: [options.commandName],
		dangerous: true,
		async handle(ctx) {
			if (ctx.command !== options.commandName) return denied(options, `unsupported ${options.displayName} node command: ${ctx.command}`);
			const params = asOptionalRecord(ctx.params) ?? {};
			const action = readNonEmptyStringPreservingWhitespace(params.action);
			if (action === "setup" && options.useConfiguredSetupCommands) {
				const setupParams = { action };
				copyConfiguredAudio(setupParams, options.start);
				return await ctx.invokeNode({ params: setupParams });
			}
			const decision = action === "start" ? buildStartParams(params, options) : buildForwardParams(params, options) ?? {
				approved: false,
				result: denied(options, `unsupported ${options.commandName} action`)
			};
			if (!decision.approved) return decision.result;
			return await ctx.invokeNode({ params: decision.params });
		}
	};
}
//#endregion
//#region src/meeting-bot/plugin-shell.ts
function createMeetingPluginNodeHostHandler(options) {
	const platform = options.platform;
	return createMeetingConfiguredNodeHost({
		...options,
		commandName: platform.nodeCommandName,
		displayName: platform.displayName,
		browserLabel: platform.browserLabel,
		bridgeIdPrefix: `${platform.session.idPrefix}_node_`,
		talkBackModes: /* @__PURE__ */ new Set(["agent", "bidi"]),
		agentMode: "agent",
		defaultAudio: {
			backend: "auto",
			bufferBytes: 4096,
			format: "pcm16-24khz"
		},
		normalizeUrl: (value) => platform.urls.validateAndNormalize(value),
		normalizeMeetingKey: (value) => platform.urls.normalizeForReuse(value),
		browser: {
			application: "Google Chrome",
			buildProfileArgs: (profile) => ["--args", `--profile-directory=${profile}`],
			openedStatus: "chrome-opened",
			openedNotes: [`${options.browserPageName} page control is handled by OpenClaw browser automation when using chrome-node.`]
		}
	});
}
function createMeetingPluginNodeInvokePolicy(config, options) {
	const platform = options.platform;
	return createMeetingBrowserNodeInvokePolicy({
		commandName: platform.nodeCommandName,
		displayName: platform.displayName,
		deniedCode: options.deniedCode,
		supportedModes: /* @__PURE__ */ new Set([
			"agent",
			"bidi",
			"transcribe"
		]),
		normalizeUrl: (value) => platform.urls.validateAndNormalize(value),
		useConfiguredSetupCommands: true,
		start: config.chrome
	});
}
function createMeetingChromeRuntimeBindings() {
	return {
		createBindings: createMeetingRealtimeEngineBindings,
		createLocalAudioTransport: createLocalMeetingRealtimeAudioTransport,
		createNodeAudioTransport: createNodeMeetingRealtimeAudioTransport,
		startAgentRealtimeEngine: startMeetingAgentRealtimeEngine,
		startRealtimeEngine: startMeetingRealtimeEngine
	};
}
function createMeetingPluginChromeTransport(options) {
	return createMeetingChromeTransport({
		...options,
		browserNodeAdapter: options.platform,
		isRealtimeRouteReady: isMeetingRealtimeRouteReady,
		isTalkBackMode: isMeetingTalkBackMode,
		nodeCommandName: options.platform.nodeCommandName
	});
}
function createMeetingPluginShellEntry(options) {
	const id = options.platform.id;
	const methodPrefix = id.replaceAll("-", "");
	const toolName = id.replaceAll("-", "_");
	const loadCli = createLazyRuntimeModule(() => options.cli.load());
	return createMeetingPluginEntryOptions({
		...options,
		id,
		name: options.platform.displayName,
		cap: id,
		description: `Join ${options.platform.displayName} as a Chrome browser guest`,
		disabledMessage: `${options.platform.displayName} plugin disabled in plugin config`,
		gatewayMethodPrefix: methodPrefix,
		nodeCommand: options.platform.nodeCommandName,
		normalizeUrl: (value) => options.platform.urls.validateAndNormalize(value),
		toolDescription: `Join and manage ${options.browserGuestLabel} browser guests. Guest admission, tenant sign-in, and media permissions may require manual action in the OpenClaw Chrome profile.`,
		toolLabel: options.platform.displayName,
		toolName,
		transcriptSource: {
			...options.transcriptSource,
			name: options.platform.displayName
		},
		unknownActionMessage: `unknown ${toolName} action`,
		createRuntime: ({ api, config }) => new options.runtime({
			config,
			fullConfig: api.config,
			runtime: api.runtime,
			logger: api.logger
		}),
		registerCli: (api, config) => {
			api.registerCli(async ({ program }) => (await loadCli())({
				program,
				config
			}), {
				commands: [options.cli.descriptor.name],
				descriptors: [options.cli.descriptor]
			});
		}
	});
}
function createMeetingPluginTypes() {
	return null;
}
//#endregion
//#region src/meeting-bot/runtime-facade.ts
const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
function createMeetingRuntimeFacade(options) {
	return class MeetingRuntimeFacade {
		#defaultAgentId;
		#sessions;
		#requesterSessionKeys = /* @__PURE__ */ new Map();
		constructor(params) {
			this.params = params;
			this.#defaultAgentId = normalizeAgentId(params.config.realtime.agentId ?? resolveDefaultAgentId(params.fullConfig));
			this.#sessions = new MeetingSessionRuntime({
				logger: params.logger,
				logScope: options.platform.logScope,
				formatError: formatErrorMessage,
				reuseExistingBrowserTab: params.config.chrome.reuseExistingTab,
				waitForInCallMs: params.config.chrome.waitForInCallMs,
				joinTimeoutMs: params.config.chrome.joinTimeoutMs,
				defaultSpeechInstructions: params.config.realtime.introMessage,
				transientSpeechBlockedReasons: /* @__PURE__ */ new Set([
					"not-in-call",
					"browser-unverified",
					options.messages.sessionRuntime.speech.microphoneMutedReason
				]),
				messages: options.messages.sessionRuntime,
				resolveJoin: (request) => this.#resolveJoin(request),
				createSession: ({ request, resolved, createdAt }) => {
					const session = createMeetingSession({
						platform: options.platform,
						config: params.config,
						resolved,
						createdAt
					});
					if (request.requesterSessionKey) this.#requesterSessionKeys.set(session.id, request.requesterSessionKey);
					return session;
				},
				resolveSpeechInstructions: (request) => request.message ?? params.config.realtime.introMessage,
				isBrowserTransport: () => true,
				isTalkBackMode: (mode) => mode === "agent" || mode === "bidi",
				isTranscribeMode: (mode) => mode === "transcribe",
				sameMeetingUrl: (left, right) => options.platform.urls.isSameMeeting(left, right),
				normalizeMeetingUrlForReuse: (url) => options.platform.urls.normalizeForReuse(url),
				getBrowser: (session) => session.chrome ? {
					launched: session.chrome.launched,
					nodeId: session.chrome.nodeId,
					tab: session.chrome.browserTab,
					health: session.chrome.health,
					hasAudioBridge: options.hooks?.isAudioBridgeActive?.(session) ?? Boolean(session.chrome.audioBridge)
				} : void 0,
				setBrowserTab: (session, tab) => {
					if (session.chrome) session.chrome.browserTab = tab;
				},
				setBrowserHealth: (session, health) => {
					if (session.chrome) session.chrome.health = health;
				},
				joinTransport: async ({ request, session, context }) => await this.#joinTransport(request, session, context),
				releaseBrowserTab: async (session) => await this.#releaseBrowserTab(session),
				refreshBrowserHealth: async (session, refreshOptions) => await this.#refreshBrowserHealth(session, refreshOptions),
				refreshStatus: async (session) => await this.#refreshStatus(session),
				refreshReusableSession: async (session, request) => await options.hooks?.refreshReusableSession?.(session, request, this.#hookContext()),
				ensureRealtimeBridge: async (session) => await this.#ensureRealtimeBridge(session),
				captureTranscript: async (session, captureOptions) => await this.#captureTranscript(session, captureOptions),
				speakViaTransport: async () => void 0,
				durableTranscripts: {
					config: params.fullConfig.transcripts,
					openclawConfig: params.fullConfig,
					...options.messages.durableTranscripts
				}
			});
		}
		list() {
			return this.#sessions.list();
		}
		async startTranscriptSource(request) {
			return await this.#sessions.startTranscriptSource(request);
		}
		reconcileTranscriptPolicy(enabled) {
			return this.#sessions.reconcileTranscriptPolicy(enabled);
		}
		async stopTranscriptSource(request) {
			return await this.#sessions.stopTranscriptSource(request);
		}
		ownsSession(agentId, sessionId) {
			return this.list().some((session) => session.id === sessionId && session.agentId === agentId);
		}
		async join(request) {
			try {
				return await this.#sessions.join(options.hooks?.normalizeJoinRequest?.(request, this.#hookContext()) ?? request);
			} catch (error) {
				const activeIds = new Set(this.list().map((session) => session.id));
				for (const sessionId of this.#requesterSessionKeys.keys()) if (!activeIds.has(sessionId)) this.#requesterSessionKeys.delete(sessionId);
				throw error;
			}
		}
		async leave(sessionId) {
			try {
				return await this.#sessions.leave(sessionId);
			} finally {
				this.#requesterSessionKeys.delete(sessionId);
			}
		}
		async status(sessionId) {
			return await this.#sessions.status(sessionId);
		}
		async statusForAgent(agentId, sessionId) {
			if (sessionId) return this.ownsSession(agentId, sessionId) ? await this.#sessions.status(sessionId) : { found: false };
			const sessions = this.list().filter((session) => session.agentId === agentId);
			await Promise.all(sessions.map((session) => this.#sessions.status(session.id)));
			return {
				found: true,
				sessions
			};
		}
		async transcript(sessionId, transcriptOptions = {}) {
			return await this.#sessions.transcript(sessionId, transcriptOptions);
		}
		async speak(sessionId, instructions) {
			return await this.#sessions.speak(sessionId, instructions);
		}
		async setupStatus(setupOptions) {
			return await options.probes.setupStatus({
				...this.params,
				options: setupOptions
			});
		}
		async testSpeech(request) {
			return await options.probes.testSpeech(this.#probeContext(), request);
		}
		async testListen(request) {
			return await options.probes.testListening(this.#probeContext(), request);
		}
		#resolveJoin(request) {
			return {
				url: options.platform.urls.validateAndNormalize(request.url),
				transport: request.transport ?? (this.params.config.chromeNode.node ? "chrome-node" : "chrome"),
				mode: request.mode ?? this.params.config.defaultMode,
				agentId: normalizeAgentId(request.agentId ?? this.#defaultAgentId)
			};
		}
		#hookContext() {
			return {
				deleteRequesterSessionKey: (sessionId) => this.#requesterSessionKeys.delete(sessionId),
				endSession: async (sessionId, leaveOptions) => {
					await this.#sessions.leave(sessionId, leaveOptions);
					this.#requesterSessionKeys.delete(sessionId);
				},
				noteSession: (session, note) => this.#noteSession(session, note),
				refreshBrowserHealth: async (session, refreshOptions) => await this.#sessions.refreshBrowserHealth(session, refreshOptions),
				resolvedJoin: (request) => this.#resolveJoin(request)
			};
		}
		#probeContext() {
			return {
				config: this.params.config,
				resolveAgentId: (request) => normalizeAgentId(request.agentId ?? this.#defaultAgentId),
				list: () => this.list(),
				join: async (request) => await this.join(request),
				isReusable: (session, resolved) => this.#sessions.isReusableSession(session, resolved),
				hasHealthHandle: (sessionId) => this.#sessions.hasHealthHandle(sessionId),
				refreshHealth: (sessionId) => this.#sessions.refreshHealth(sessionId),
				refreshCaptionHealth: async (session, timeoutMs) => await this.#refreshBrowserHealth(session, { timeoutMs })
			};
		}
		async #joinTransport(request, session, context) {
			const config = this.#withSessionAgentConfig(session.agentId);
			const launchParams = {
				runtime: this.params.runtime,
				config,
				fullConfig: this.params.fullConfig,
				meetingSessionId: session.id,
				requesterSessionKey: request.requesterSessionKey,
				mode: session.mode,
				url: session.url,
				logger: this.params.logger
			};
			const result = session.transport === "chrome-node" ? await options.transport.launchOnNode(launchParams) : await options.transport.launchInChrome(launchParams);
			const nodeId = result.nodeId;
			const tab = context.inheritedBrowserTab({
				session,
				transport: session.transport,
				nodeId,
				meetingUrl: session.url,
				tab: result.tab
			});
			session.chrome = {
				audioBackend: result.audioBackend,
				launched: result.launched,
				nodeId,
				browserProfile: this.params.config.chrome.browserProfile,
				browserTab: tab,
				health: result.browser
			};
			options.hooks?.validateLaunchResult?.(result);
			const handles = this.#attachAudioBridge(session, result.audioBridge);
			if (handles) context.attachRuntimeHandles(session, handles);
			session.notes.push(result.audioBridge ? session.transport === "chrome-node" ? options.messages.joined.node : options.messages.joined.local : session.mode === "transcribe" ? options.messages.joined.transcribe : options.messages.joined.waiting);
			this.#sessions.refreshSpeechReadiness(session);
			return {};
		}
		#attachAudioBridge(session, audioBridge) {
			if (!session.chrome || !audioBridge) return;
			session.chrome.audioBridge = {
				type: audioBridge.type,
				provider: audioBridge.providerId
			};
			options.hooks?.afterAudioBridgeAttached?.(session);
			return {
				stop: audioBridge.stop,
				speak: audioBridge.speak,
				getHealth: audioBridge.getHealth
			};
		}
		async #ensureRealtimeBridge(session) {
			const audioBridgeActive = options.hooks?.isAudioBridgeActive?.(session) ?? Boolean(session.chrome?.audioBridge);
			if (session.mode !== "agent" && session.mode !== "bidi" || session.state !== "active" || !session.chrome || audioBridgeActive || !isMeetingRealtimeRouteReady(session.mode, session.chrome.health)) return;
			if (session.chrome.audioBridge) session.chrome.audioBridge = void 0;
			const config = this.#withSessionAgentConfig(session.agentId);
			const recoveryConfig = {
				...config,
				chrome: {
					...config.chrome,
					launch: false
				},
				chromeNode: { node: session.chrome.nodeId ?? config.chromeNode.node }
			};
			const launchParams = {
				runtime: this.params.runtime,
				config: recoveryConfig,
				fullConfig: this.params.fullConfig,
				meetingSessionId: session.id,
				requesterSessionKey: this.#requesterSessionKeys.get(session.id),
				mode: session.mode,
				trackedTargetId: session.chrome.browserTab?.targetId,
				url: session.url,
				logger: this.params.logger
			};
			const result = session.transport === "chrome-node" ? await options.transport.launchOnNode(launchParams) : await options.transport.launchInChrome(launchParams);
			if (result.tab) {
				const currentTab = session.chrome.browserTab;
				session.chrome.browserTab = {
					...result.tab,
					openedByPlugin: result.tab.targetId === currentTab?.targetId ? currentTab.openedByPlugin : result.tab.openedByPlugin
				};
			}
			if (result.browser) session.chrome.health = {
				...session.chrome.health,
				...result.browser
			};
			session.updatedAt = nowIso();
			return this.#attachAudioBridge(session, result.audioBridge);
		}
		async #refreshStatus(session) {
			await this.#sessions.refreshBrowserHealth(session, {
				force: true,
				readOnly: !(options.hooks?.isAwaitingAdmission?.(session) ?? false)
			});
			await options.hooks?.afterStatusRefresh?.(session, this.#hookContext());
		}
		async #refreshBrowserHealth(session, refreshOptions = {}) {
			try {
				const result = await options.transport.recoverCurrentTab({
					runtime: this.params.runtime,
					config: this.params.config,
					fullConfig: this.params.fullConfig,
					meetingSessionId: session.id,
					mode: session.mode,
					nodeId: session.chrome?.nodeId,
					readOnly: refreshOptions.readOnly,
					trackedMeetingUrl: session.url,
					trackedTargetId: session.chrome?.browserTab?.targetId,
					transport: session.transport,
					timeoutMs: refreshOptions.timeoutMs,
					url: session.url
				});
				if (result.found && session.chrome) {
					if (result.tab?.targetId) {
						const currentTab = session.chrome.browserTab;
						session.chrome.browserTab = {
							targetId: result.tab.targetId,
							openedByPlugin: result.tab.targetId === currentTab?.targetId ? currentTab.openedByPlugin : false
						};
					}
					if (result.browser) session.chrome.health = {
						...session.chrome.health,
						...result.browser
					};
					session.updatedAt = nowIso();
				} else if (session.chrome) options.hooks?.recordBrowserRecoveryFailure?.(session, {
					kind: "missing",
					message: result.message
				});
			} catch (error) {
				const formattedError = formatErrorMessage(error);
				const message = options.messages.browserReadinessFailed?.(formattedError) ?? formattedError;
				if (options.hooks?.recordBrowserRecoveryFailure) {
					this.params.logger.debug?.(`${options.platform.logScope} ${message}`);
					options.hooks.recordBrowserRecoveryFailure(session, {
						kind: "error",
						message
					});
				} else this.params.logger.debug?.(`${options.platform.logScope} browser readiness refresh ignored: ${formatErrorMessage(error)}`);
			}
		}
		async #captureTranscript(session, captureOptions = {}) {
			await this.#sessions.refreshCaptionHealth(session);
			const tab = session.chrome?.browserTab;
			if (!tab) return;
			return await options.transport.readTranscript({
				runtime: this.params.runtime,
				config: this.params.config,
				finalize: captureOptions.finalize,
				meetingUrl: session.url,
				meetingSessionId: session.id,
				nodeId: session.chrome?.nodeId,
				tab
			});
		}
		async #releaseBrowserTab(session) {
			const tab = session.chrome?.browserTab;
			if (!tab) {
				this.#noteSession(session, options.messages.noTrackedTab);
				session.browserLeft = false;
				return false;
			}
			if (this.list().some((other) => other.id !== session.id && other.state === "active" && other.chrome?.browserTab?.targetId === tab.targetId && other.chrome?.nodeId === session.chrome?.nodeId)) {
				this.#noteSession(session, options.messages.sharedTab);
				return;
			}
			try {
				const result = await options.transport.leaveInBrowser({
					runtime: this.params.runtime,
					config: this.params.config,
					meetingSessionId: session.id,
					meetingUrl: session.url,
					nodeId: session.chrome?.nodeId,
					tab
				});
				this.#noteSession(session, result.note);
				if (result.left && session.chrome) {
					session.chrome.browserTab = void 0;
					if (session.chrome.health) session.chrome.health = {
						...session.chrome.health,
						captioning: false,
						audioInputRouted: false,
						audioOutputRouted: false,
						providerConnected: false,
						realtimeReady: false,
						audioInputActive: false,
						audioOutputActive: false
					};
				}
				session.browserLeft = result.left;
				return result.left;
			} catch (error) {
				this.#noteSession(session, options.messages.leaveFailed(formatErrorMessage(error)));
				session.browserLeft = false;
				return false;
			}
		}
		#withSessionAgentConfig(agentId) {
			return this.params.config.realtime.agentId === agentId ? this.params.config : {
				...this.params.config,
				realtime: {
					...this.params.config.realtime,
					agentId
				}
			};
		}
		#noteSession(session, note) {
			session.notes = [...session.notes.filter((item) => item !== note), note];
		}
	};
}
//#endregion
//#region src/meeting-bot/runtime-probes.ts
function resolveMeetingProbeTimeoutMs(input, fallback, invalidRequest = (message) => new Error(message)) {
	if (input === void 0) return Math.min(Math.max(fallback, 1), 12e4);
	if (!Number.isFinite(input) || input <= 0) throw invalidRequest("timeoutMs must be a positive number");
	return Math.min(Math.trunc(input), 12e4);
}
function createMeetingRuntimeProbes(options) {
	const testSpeech = async (context, request) => {
		const requestMode = options.resolveRequestMode?.(request.mode, context.config) ?? request.mode;
		if (requestMode === "transcribe") throw options.invalidRequest(options.speechModeError ?? "test_speech requires mode: agent or bidi");
		const requestedMode = requestMode ?? context.config.defaultMode;
		const mode = options.talkBackMode(requestedMode) ? requestedMode : "agent";
		const resolved = {
			url: options.normalizeUrl?.(request.url) ?? request.url,
			transport: request.transport ?? options.defaultTransport?.(context.config) ?? (context.config.chromeNode.node ? "chrome-node" : "chrome"),
			mode,
			agentId: context.resolveAgentId(request)
		};
		const beforeSessions = context.list();
		const before = new Set(beforeSessions.map((session) => session.id));
		const existing = beforeSessions.find((session) => context.isReusable(session, resolved));
		const existingBaseline = {
			outputBytes: existing?.chrome?.health?.lastOutputBytes ?? 0,
			outputGeneration: existing?.chrome?.health?.outputGeneration ?? 0
		};
		const result = await context.join({
			...request,
			...resolved,
			message: request.message ?? options.defaultSpeechMessage
		});
		const baseline = existing?.id === result.session.id ? existingBaseline : {
			outputBytes: 0,
			outputGeneration: 0
		};
		let health = result.session.chrome?.health;
		const verified = () => (health?.lastOutputBytes ?? 0) > baseline.outputBytes && (health?.outputGeneration ?? 0) > baseline.outputGeneration && health?.verifiedOutputGeneration === health?.outputGeneration;
		const shouldWait = result.spoken === true && health?.manualAction === void 0 && context.hasHealthHandle(result.session.id);
		if (shouldWait && !verified()) {
			const deadline = performance.now() + (options.resolveSpeechTimeoutMs?.(request, context.config) ?? options.resolveTimeoutMs(request.timeoutMs, context.config.chrome.joinTimeoutMs));
			while (performance.now() < deadline && !verified()) {
				await sleep(100);
				context.refreshHealth(result.session.id);
				health = result.session.chrome?.health;
			}
		}
		const speechOutputVerified = verified();
		return {
			createdSession: !before.has(result.session.id),
			inCall: health?.inCall,
			manualAction: health?.manualAction,
			spoken: result.spoken ?? false,
			speechOutputVerified,
			speechOutputTimedOut: shouldWait && !speechOutputVerified,
			speechReady: health?.speechReady,
			speechBlockedReason: health?.speechBlockedReason,
			speechBlockedMessage: health?.speechBlockedMessage,
			audioOutputActive: health?.audioOutputActive,
			lastOutputBytes: health?.lastOutputBytes,
			outputLoopbackSignalBytes: health?.outputLoopbackSignalBytes,
			lastOutputLoopbackAt: health?.lastOutputLoopbackAt,
			lastOutputLoopbackCorrelation: health?.lastOutputLoopbackCorrelation,
			lastOutputLoopbackRms: health?.lastOutputLoopbackRms,
			lastOutputLoopbackPeak: health?.lastOutputLoopbackPeak,
			outputGeneration: health?.outputGeneration,
			verifiedOutputGeneration: health?.verifiedOutputGeneration,
			session: result.session
		};
	};
	const testListening = async (context, request) => {
		const requestMode = options.resolveRequestMode?.(request.mode, context.config) ?? request.mode;
		if (requestMode && requestMode !== "transcribe") throw options.invalidRequest(options.listeningModeError ?? "test_listen requires mode: transcribe");
		const resolved = {
			url: options.normalizeUrl?.(request.url) ?? request.url,
			transport: request.transport ?? options.defaultTransport?.(context.config) ?? (context.config.chromeNode.node ? "chrome-node" : "chrome"),
			mode: "transcribe",
			agentId: context.resolveAgentId(request)
		};
		options.validateListeningTransport?.(resolved.transport);
		const beforeSessions = context.list();
		const before = new Set(beforeSessions.map((session) => session.id));
		const existing = beforeSessions.find((session) => context.isReusable(session, resolved));
		const start = {
			lines: existing?.chrome?.health?.transcriptLines ?? 0,
			at: existing?.chrome?.health?.lastCaptionAt,
			text: existing?.chrome?.health?.lastCaptionText
		};
		const result = await context.join({
			...request,
			...resolved,
			message: void 0
		});
		let health = result.session.chrome?.health;
		const advanced = () => (health?.transcriptLines ?? 0) > (existing?.id === result.session.id ? start.lines : 0) || Boolean(health?.lastCaptionAt && health.lastCaptionAt !== start.at) || Boolean(health?.lastCaptionText && health.lastCaptionText !== start.text);
		const shouldWait = health?.manualAction === void 0 && options.shouldWaitForListening(result.session);
		let listenVerified = advanced();
		if (shouldWait && !listenVerified) {
			const deadline = performance.now() + options.resolveTimeoutMs(request.timeoutMs, context.config.chrome.joinTimeoutMs);
			while (performance.now() < deadline) {
				const remainingMs = Math.floor(deadline - performance.now());
				if (remainingMs <= 0) break;
				let deadlineTimer;
				const deadlineReached = new Promise((resolve) => {
					deadlineTimer = setTimeout(() => resolve(false), remainingMs);
				});
				if (!await Promise.race([(options.refreshCaptionHealth?.(context, result.session, remainingMs) ?? context.refreshCaptionHealth(result.session, remainingMs)).then(() => true), deadlineReached]).finally(() => {
					if (deadlineTimer !== void 0) clearTimeout(deadlineTimer);
				})) break;
				health = result.session.chrome?.health;
				if (performance.now() >= deadline) break;
				if (advanced()) listenVerified = true;
				if (listenVerified || health?.manualAction) break;
				const retryDelayMs = deadline - performance.now();
				if (retryDelayMs <= 0) break;
				await sleep(Math.min(250, retryDelayMs));
			}
		}
		return {
			createdSession: !before.has(result.session.id),
			inCall: health?.inCall,
			manualAction: health?.manualAction,
			listenVerified,
			listenTimedOut: shouldWait && !listenVerified && health?.manualAction === void 0,
			captioning: health?.captioning,
			captionsEnabledAttempted: health?.captionsEnabledAttempted,
			transcriptLines: health?.transcriptLines,
			lastCaptionAt: health?.lastCaptionAt,
			lastCaptionSpeaker: health?.lastCaptionSpeaker,
			lastCaptionText: health?.lastCaptionText,
			recentTranscript: health?.recentTranscript,
			session: result.session
		};
	};
	return {
		testListening,
		testSpeech
	};
}
//#endregion
//#region src/meeting-bot/setup-checks.ts
function createMeetingSetupStatus(checks) {
	return {
		ok: checks.every((check) => check.ok),
		checks
	};
}
function addMeetingSetupCheck(status, check) {
	return createMeetingSetupStatus([...status.checks, check]);
}
//#endregion
//#region src/meeting-bot/runtime-setup.ts
async function commandExists(runtime, command) {
	return (await runtime.system.runCommandWithTimeout([
		"/bin/sh",
		"-lc",
		"command -v \"$1\" >/dev/null 2>&1",
		"sh",
		command
	], { timeoutMs: 5e3 })).code === 0;
}
function createMeetingRuntimeSetup(options) {
	return async (params) => {
		const mode = params.options?.mode ?? params.config.defaultMode;
		const transport = params.options?.transport ?? (params.config.chromeNode.node ? "chrome-node" : "chrome");
		const talkBack = isMeetingTalkBackMode(mode);
		const guestJoin = options.guestJoinCheck(params.config);
		let status = createMeetingSetupStatus([
			{
				id: "chrome-profile",
				ok: true,
				message: params.config.chrome.browserProfile ? `Chrome node profile configured: ${params.config.chrome.browserProfile}` : "Local Chrome uses the configured OpenClaw browser profile"
			},
			{
				id: "guest-join",
				...guestJoin
			},
			{
				id: "captions",
				ok: true,
				message: options.captionsMessage(mode)
			}
		]);
		if (transport === "chrome-node") try {
			const node = await resolveMeetingBrowserNodeInfo({
				runtime: params.runtime,
				requestedNode: params.config.chromeNode.node,
				adapter: options.nodeAdapter
			});
			status = addMeetingSetupCheck(status, {
				id: "chrome-node-connected",
				ok: true,
				message: options.connectedNodeMessage(node.displayName ?? node.remoteIp ?? node.nodeId)
			});
			if (talkBack) {
				if (!node.nodeId) throw new Error(options.missingNodeIdMessage);
				await params.runtime.nodes.invoke({
					nodeId: node.nodeId,
					command: options.nodeAdapter.nodeCommandName,
					params: {
						action: "setup",
						audioBackend: params.config.chrome.audioBackend,
						audioFormat: params.config.chrome.audioFormat,
						audioBufferBytes: params.config.chrome.audioBufferBytes,
						...params.config.chrome.audioInputCommandOverride ? { audioInputCommand: params.config.chrome.audioInputCommandOverride } : {},
						...params.config.chrome.audioOutputCommandOverride ? { audioOutputCommand: params.config.chrome.audioOutputCommandOverride } : {},
						...params.config.chrome.bargeInInputCommand ? { bargeInInputCommand: params.config.chrome.bargeInInputCommand } : {}
					},
					timeoutMs: 12e3
				});
				status = addMeetingSetupCheck(status, {
					id: "chrome-node-audio-prerequisites",
					ok: true,
					message: "Remote virtual audio backend and command-pair prerequisites are ready"
				});
			}
		} catch (error) {
			const connected = status.checks.some((check) => check.id === "chrome-node-connected" && check.ok);
			status = addMeetingSetupCheck(status, {
				id: connected ? "chrome-node-audio-prerequisites" : "chrome-node-connected",
				ok: false,
				message: formatErrorMessage(error)
			});
		}
		if (!talkBack) return status;
		status = addMeetingSetupCheck(status, {
			id: "audio-bridge",
			ok: true,
			message: `Command-pair audio bridge configured (${params.config.chrome.audioFormat})`
		});
		if (transport === "chrome-node") return status;
		let audio;
		try {
			audio = resolveMeetingAudioRuntimeForFormat({
				backend: params.config.chrome.audioBackend,
				bufferBytes: params.config.chrome.audioBufferBytes,
				format: params.config.chrome.audioFormat,
				inputCommand: params.config.chrome.audioInputCommandOverride,
				outputCommand: params.config.chrome.audioOutputCommandOverride
			});
			await options.assertAudioDeviceAvailable({
				config: params.config,
				runtime: params.runtime,
				timeoutMs: Math.min(params.config.chrome.joinTimeoutMs, 1e4)
			});
			status = addMeetingSetupCheck(status, {
				id: "chrome-local-audio-device",
				ok: true,
				message: "Virtual meeting audio backend is ready"
			});
		} catch (error) {
			status = addMeetingSetupCheck(status, {
				id: "chrome-local-audio-device",
				ok: false,
				message: formatErrorMessage(error)
			});
			if (!audio) return status;
		}
		const commands = uniqueStrings([
			audio.inputCommand[0],
			audio.outputCommand[0],
			params.config.chrome.bargeInInputCommand?.[0]
		].filter((value) => Boolean(value?.trim())));
		const missing = [];
		for (const command of commands) if (!await commandExists(params.runtime, command).catch(() => false)) missing.push(command);
		return addMeetingSetupCheck(status, {
			id: "chrome-local-audio-commands",
			ok: missing.length === 0,
			message: missing.length === 0 ? "Configured Chrome audio commands are available" : `Chrome audio commands missing: ${missing.join(", ")}`
		});
	};
}
//#endregion
//#region src/meeting-bot/status-call-source.ts
function createMeetingStatusCallSource(options) {
	const captionSettleMs = options.captionSettleMs ?? 1e3;
	const audioOutputsGlobal = JSON.stringify(options.platform.globals.audioOutputs);
	const captionsGlobal = JSON.stringify(options.platform.globals.captions);
	const meetingGlobal = JSON.stringify(options.platform.globals.meeting);
	const transcriptMaxLines = options.transcriptMaxLines ?? 500;
	return `  let audioOutputRouted;
  let audioOutputDeviceLabel;
  let audioOutputRouteError;
  let audioOutputRouteRetryable = false;
  const remoteCapture = window.__openclawMeetingRemoteAudio;
  if (remoteCapture && remoteCapture.sessionId === sessionId && remoteCapture.isCurrent()) {
    if (canMutateSession) remoteCapture.scan();
    audioOutputRouted = remoteCapture.isCurrent();
    audioOutputDeviceLabel = "Isolated browser playback";
  } else if (inCall && allowMicrophone && navigator.mediaDevices?.enumerateDevices) {
    const media = [...document.querySelectorAll("audio, video")].filter(
      (element) =>
        typeof element.setSinkId === "function" &&
        !String(element.id || "").startsWith(${JSON.stringify(options.platform.audioOutputElementIdPrefix)}),
    );
    if (media.length > 0) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const output = devices.find(
          (device) => device.kind === "audiooutput" && isVirtualAudioDevice(device.label)
        );
        if (output?.deviceId) {
          const routeErrors = [];
          const liveStream = (element) =>
            element.srcObject?.getAudioTracks?.().some((track) => track.readyState === "live")
              ? element.srcObject
              : undefined;
          const allBridgeEntries = Array.isArray(window[${audioOutputsGlobal}])
            ? window[${audioOutputsGlobal}]
            : [];
          const retainedBridgeEntries = allBridgeEntries.filter((entry) => !bridgeOwnedBySession(entry));
          const previousBridgeEntries = allBridgeEntries.filter(bridgeOwnedBySession);
          const originalMuteBySource = new Map(previousBridgeEntries.flatMap((entry) =>
            bridgeSources(entry).flatMap((source) =>
              source?.element ? [[source.element, Boolean(source.muted)]] : []
            )
          ));
          const bridgedElements = new Set(previousBridgeEntries.flatMap((entry) =>
            bridgeSources(entry).map((source) => source?.element).filter(Boolean)
          ));
          const routeCandidates = media
            .map((element) => ({ element, stream: liveStream(element) }))
            // Teams mutes local/self-view and intentionally suppressed playback. Preserve
            // that product decision; only our own already-bridged source stays eligible.
            .filter((entry) => !entry.element.muted || bridgedElements.has(entry.element));
          // The self-view often exists before Teams attaches remote playback. With the
          // required output present, an all-filtered list is still a transient DOM state.
          if (routeCandidates.length === 0) audioOutputRouteRetryable = true;
          if (canMutateSession) {
            for (const { element } of routeCandidates) {
              if (!originalMuteBySource.has(element)) {
                originalMuteBySource.set(element, Boolean(element.muted));
              }
              // Sink changes are asynchronous. Silence the physical output until either
              // the source or its fallback bridge is confirmed on the virtual device.
              element.muted = true;
            }
          }
          const currentSources = new Set(routeCandidates.map((entry) => entry.element));
          const bridgeEntries = previousBridgeEntries.filter((entry) =>
            entry?.source &&
            entry?.stream === liveStream(entry.source) &&
            entry?.bridge?.isConnected &&
            currentSources.has(entry.source)
          );
          const suspendedBySource = new Map();
          for (const entry of previousBridgeEntries) {
            if (bridgeEntries.includes(entry)) continue;
            for (const source of bridgeSources(entry)) {
              if (
                !source?.element ||
                source.muted ||
                !bridgeSourceMatches(source.element, source)
              ) continue;
              const sourceStillPresent = currentSources.has(source.element);
              const detachedLiveSource = !sourceStillPresent && Boolean(liveStream(source.element));
              if (!sourceStillPresent && !detachedLiveSource) continue;
              suspendedBySource.set(source.element, {
                detached: detachedLiveSource,
                sessionId: entry.sessionId || sessionId,
                source: source.element,
                sourceMuted: false,
                sourceUrl: mediaSourceUrl(source.element) || source.url,
                stream: source.element.srcObject,
                suspended: true,
              });
            }
          }
          if (canMutateSession) {
            // One bridge owns one Teams playback element. Stream or element replacement
            // retires that bridge so it cannot keep playing or satisfy route verification.
            previousBridgeEntries.filter((entry) => !bridgeEntries.includes(entry)).forEach((entry) => {
              for (const source of bridgeSources(entry)) {
                if (
                  !source?.element ||
                  suspendedBySource.has(source.element) ||
                  currentSources.has(source.element)
                ) continue;
                restoreAudioBridgeSource(source);
              }
              // Reused current elements stay silent until this pass confirms their
              // replacement source; unrelated exact sources were restored above.
              retireAudioBridge(entry, false);
            });
          }
          const routed = [];
          for (const { element, stream } of routeCandidates) {
            let entry = bridgeEntries.find((candidate) => candidate.source === element);
            let elementRouted = element.sinkId === output.deviceId;
            let directRouteError;
            if (canMutateSession && !elementRouted) {
              try {
                await element.setSinkId(output.deviceId);
                elementRouted = element.sinkId === output.deviceId;
              } catch (error) {
                directRouteError = {
                  message: error?.message || String(error),
                  retryable: error?.name === "AbortError",
                };
              }
            }
            if (elementRouted && entry && canMutateSession) {
              const bridgedIndex = bridgeEntries.indexOf(entry);
              if (bridgedIndex >= 0) {
                const [bridged] = bridgeEntries.splice(bridgedIndex, 1);
                retireAudioBridge(bridged);
                entry = undefined;
              }
            }
            // Direct sink routing is valid for src/MediaSource and pre-attachment elements.
            // A live MediaStream is required only when the hidden bridge fallback is needed.
            if (elementRouted) {
              if (canMutateSession && originalMuteBySource.has(element)) {
                element.muted = originalMuteBySource.get(element);
              }
              suspendedBySource.delete(element);
              routed.push(true);
              continue;
            }
            if (!stream) {
              const hasLoadedPlaybackSource = Number(element.readyState) > 0;
              routed.push(false);
              if (hasLoadedPlaybackSource && directRouteError) routeErrors.push(directRouteError);
              if (!hasLoadedPlaybackSource) audioOutputRouteRetryable = true;
              if (canMutateSession && originalMuteBySource.get(element) === false) {
                // Teams may attach the remote MediaStream after creating its media element.
                // Keep it silent until a later serialized status poll routes that source.
                suspendedBySource.set(element, {
                  sessionId,
                  pending: true,
                  source: element,
                  sourceMuted: false,
                  sourceUrl: mediaSourceUrl(element),
                  stream: element.srcObject,
                  suspended: true,
                });
              }
              continue;
            }
            if (!elementRouted && stream) {
              if (!entry && canMutateSession) {
                const bridge = document.createElement("audio");
                bridge.id = ${JSON.stringify(options.platform.audioOutputElementIdPrefix)} + bridgeEntries.length;
                bridge.autoplay = false;
                bridge.hidden = true;
                bridge.srcObject = stream;
                document.body.appendChild(bridge);
                entry = {
                  bridge,
                  playing: false,
                  sessionId,
                  source: element,
                  sourceMuted: originalMuteBySource.has(element)
                    ? originalMuteBySource.get(element)
                    : Boolean(element.muted),
                  sourceUrl: mediaSourceUrl(element),
                  stream,
                };
                bridgeEntries.push(entry);
                suspendedBySource.delete(element);
              }
              if (entry?.bridge) {
                try {
                  if (canMutateSession) {
                    if (entry.bridge.sinkId !== output.deviceId) {
                      await entry.bridge.setSinkId(output.deviceId);
                    }
                    await entry.bridge.play();
                    entry.playing = true;
                  }
                  elementRouted =
                    entry.bridge.sinkId === output.deviceId && entry.playing === true;
                  if (elementRouted) {
                    suspendedBySource.delete(element);
                    if (canMutateSession && !entry.sourceMuted) element.muted = true;
                  }
                } catch (error) {
                  entry.playing = false;
                  if (canMutateSession) retireAudioBridge(entry, false);
                  routeErrors.push({
                    message: error?.message || String(error),
                    retryable: error?.name === "AbortError",
                  });
                }
              }
            }
            routed.push(elementRouted);
          }
          if (canMutateSession) {
            const nextBridgeEntries = [
              ...retainedBridgeEntries,
              ...bridgeEntries,
              ...suspendedBySource.values(),
            ];
            if (nextBridgeEntries.length > 0) {
              window[${audioOutputsGlobal}] = nextBridgeEntries;
            } else {
              delete window[${audioOutputsGlobal}];
            }
          }
          audioOutputRouted = routed.length > 0 && routed.every(Boolean);
          if (canMutateSession && !audioOutputRouted) suspendOwnedAudioBridges();
          if (audioOutputRouted && bridgeEntries.length > 0) {
            notes.push(
              "Routed ${options.platform.displayName} remote audio to " +
              (output.label || "the virtual audio device") +
              " through MediaStream bridges."
            );
          }
          audioOutputDeviceLabel = output.label || "Virtual audio device";
          // An unloaded Teams media element can reject setSinkId before its stream
          // arrives. Keep that state retryable; loaded-source failures are terminal.
          if (!audioOutputRouted && routed.length > 0 && routeErrors.length > 0) {
            audioOutputRouteError = routeErrors[routeErrors.length - 1]?.message;
            audioOutputRouteRetryable = routeErrors.every((error) => error.retryable === true);
          }
        } else {
          audioOutputRouted = false;
          if (canMutateSession) suspendOwnedAudioBridges();
          notes.push("The OpenClaw virtual audio speaker output was not visible to ${options.platform.displayName}.");
        }
      } catch (error) {
        audioOutputRouted = false;
        audioOutputRouteError = error?.message || String(error);
        if (canMutateSession) suspendOwnedAudioBridges();
      }
      if (!audioOutputRouted && audioOutputRouteError) {
        notes.push("Could not route ${options.platform.displayName} speaker output to the OpenClaw virtual audio device: " + audioOutputRouteError);
      }
    } else {
      audioOutputRouted = false;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const output = devices.find(
          (device) => device.kind === "audiooutput" && isVirtualAudioDevice(device.label)
        );
        if (output?.deviceId) {
          // Teams can briefly remove every media element during an in-call rerender.
          // Retry only after proving the required output still exists.
          audioOutputRouteRetryable = true;
          audioOutputDeviceLabel = output.label || "Virtual audio device";
        } else {
          notes.push("The OpenClaw virtual audio speaker output was not visible to ${options.platform.displayName}.");
        }
      } catch (error) {
        audioOutputRouteError = error?.message || String(error);
        notes.push("Could not inspect ${options.platform.displayName} speaker outputs: " + audioOutputRouteError);
      }
      // Suspend ownership until the source returns; call teardown retires it.
      if (canMutateSession) suspendOwnedAudioBridges();
    }
  } else if (inCall && allowMicrophone) {
    audioOutputRouted = false;
    if (canMutateSession) retireOwnedAudioBridges();
  }
  let captioning = false;
  let captionsEnabledAttempted = false;
  let transcriptLines = 0;
  let lastCaptionAt;
  let lastCaptionSpeaker;
  let lastCaptionText;
  let recentTranscript = [];
  const captionState = (() => {
    let active = window[${captionsGlobal}];
    const activeOwnedByRequest = Boolean(
      !active || (sessionId && (!active.sessionId || active.sessionId === sessionId))
    );
    if (!identityVerified) {
      if (identityAwaitingRerender && activeOwnedByRequest) return active;
      if (canMutateSession && activeOwnedByRequest) finalizeOwnedCaptions();
      return undefined;
    }
    if (!activeOwnedByRequest) {
      const replacedPriorOwner = Boolean(
        canMutateSession &&
        active?.sessionId &&
        active.sessionId !== sessionId
      );
      if (replacedPriorOwner) {
        if (priorMeeting?.sessionId === active.sessionId) {
          active.identity ||= priorMeeting.identity;
        }
        finalizeCaptionState(active);
      }
      else if (!canMutateSession || !captureCaptions || active?.finalized !== true) return undefined;
      archiveFinalizedCaptions(active);
      if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active.observer?.disconnect?.();
      delete window[${captionsGlobal}];
      active = undefined;
    }
    if (!captureCaptions) {
      if (!canMutateSession) return undefined;
      if (active?.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active?.observer?.disconnect?.();
      if (active) delete window[${captionsGlobal}];
      return undefined;
    }
    if (!inCall && !active) return undefined;
    if (!active && !canMutateSession) return undefined;
    if (!active) {
      if (active?.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active?.observer?.disconnect?.();
      window[${captionsGlobal}] = {
        sessionId,
        identity: expectedIdentity,
        epoch: crypto.randomUUID(),
        enabledAttempted: false,
        observerInstalled: false,
        observer: undefined,
        droppedLines: 0,
        lines: [],
        settled: [],
        settleTimer: undefined,
        visible: [],
      };
    }
    return window[${captionsGlobal}];
  })();
  const normalizeCaption = (speaker, captionText) => {
    if (!captionState) return undefined;
    const clean = String(captionText || "").replace(/\\s+/g, " ").trim();
    const cleanSpeaker = String(speaker || "").replace(/\\s+/g, " ").trim();
    if (!clean) return undefined;
    return { speaker: cleanSpeaker || undefined, text: clean };
  };
  const captionRowIdentity = (row) =>
    // aria-posinset identifies the logical caption item across virtual-list
    // rerenders. DOM ids and data indexes can belong to the recycled element.
    ["aria-posinset"]
      .map((name) => {
        const value = row?.getAttribute?.(name);
        return typeof value === "string" && value.trim()
          ? name + ":" + value.trim()
          : undefined;
      })
      .find(Boolean);
  const sameCaptionUtterance = (prior, current) => {
    if (prior.rowIdentity || current.rowIdentity) {
      return Boolean(
        prior.rowIdentity &&
        current.rowIdentity &&
        prior.rowIdentity === current.rowIdentity
      );
    }
    if (prior.speaker && current.speaker && prior.speaker !== current.speaker) return false;
    return prior.node === current.node;
  };
  const commitCaptionLines = (state, entries) => {
    state.lines.push(...entries.map((entry) => {
      entry.utteranceId ||= crypto.randomUUID();
      return {
        at: entry.at,
        speaker: entry.speaker,
        text: entry.text,
        utteranceId: entry.utteranceId,
      };
    }));
    const excess = state.lines.length - ${transcriptMaxLines};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
  };
  const sameCaptionRow = (left, right) =>
    right.rowIdentity
      ? left.rowIdentity === right.rowIdentity
      : left.node === right.node;
  const retainSettledCaptionLines = (state, entries) => {
    const settled = [...state.settled];
    for (const entry of entries) {
      const priorIndex = settled.findIndex((candidate) => sameCaptionRow(candidate, entry));
      if (priorIndex >= 0) settled.splice(priorIndex, 1, { ...entry });
      else settled.push({ ...entry });
    }
    const retainedLineIds = new Set(state.lines.map((entry) => entry.utteranceId));
    state.settled = settled.filter((entry) => retainedLineIds.has(entry.utteranceId));
  };
  const scheduleCaptionSettle = () => {
    if (!captionState || captionState.visible.length === 0) return;
    if (captionState.settleTimer !== undefined) clearTimeout(captionState.settleTimer);
    const pendingState = captionState;
    pendingState.settleTimer = setTimeout(() => {
      if (window[${captionsGlobal}] !== pendingState) return;
      commitCaptionLines(pendingState, pendingState.visible);
      retainSettledCaptionLines(pendingState, pendingState.visible);
      pendingState.visible = [];
      pendingState.settleTimer = undefined;
    }, ${captionSettleMs});
  };
  const captionCaptureMatchesCurrentMeeting = () => {
    if (
      !captionState ||
      captionState.finalized === true ||
      window[${captionsGlobal}] !== captionState
    ) return false;
    const observedIdentity = meetingIdentity(location.href);
    const observedMeeting = window[${meetingGlobal}];
    const identityConflicts = Boolean(
      observedIdentity && expectedIdentity && observedIdentity !== expectedIdentity
    );
    const sessionConflicts = Boolean(
      observedMeeting?.sessionId && sessionId && observedMeeting.sessionId !== sessionId
    );
    if (identityConflicts || sessionConflicts) {
      // The observer outlives Teams SPA navigation. Freeze the old buffer before
      // any caption nodes from the replacement meeting can be attributed to it.
      finalizeOwnedCaptions();
      return false;
    }
    if (observedIdentity === expectedIdentity) return true;
    const observedMarkerAgeMs = Date.now() - (observedMeeting?.verifiedAt || 0);
    const observedAwaitingRerender = Boolean(
      !observedIdentity &&
      observedMeeting?.identity === expectedIdentity &&
      (!observedMeeting.sessionId || !sessionId || observedMeeting.sessionId === sessionId) &&
      observedMeeting.inCallControl?.isConnected === false &&
      observedMeeting.inCallUrl === location.href &&
      observedMarkerAgeMs >= 0 &&
      observedMarkerAgeMs < 5_000
    );
    if (observedAwaitingRerender) return true;
    return Boolean(
      observedMeeting?.identity === expectedIdentity &&
      (!observedMeeting.sessionId || !sessionId || observedMeeting.sessionId === sessionId) &&
      observedMeeting.inCallControl?.isConnected !== false &&
      observedMeeting.inCallUrl === location.href
    );
  };
  const scrapeCaptions = (mutations = []) => {
    if (!captionCaptureMatchesCurrentMeeting()) return;
    const content = firstRaw(selectors.captionContent);
    const rows = content
      ? selectors.captionRows.flatMap((selector) => [...content.querySelectorAll(selector)])
      : [];
    captionState.settled = Array.isArray(captionState.settled) ? captionState.settled : [];
    const removedNodes = mutations.flatMap((mutation) => [...(mutation.removedNodes || [])]);
    const rowWasRemoved = (entry) => removedNodes.some((node) =>
      node === entry.node || node?.contains?.(entry.node)
    );
    const removedVisible = captionState.visible.filter(rowWasRemoved);
    if (removedVisible.length > 0) {
      if (captionState.settleTimer !== undefined) clearTimeout(captionState.settleTimer);
      captionState.settleTimer = undefined;
      captionState.visible = captionState.visible.filter((entry) => !rowWasRemoved(entry));
      commitCaptionLines(captionState, removedVisible);
      retainSettledCaptionLines(captionState, removedVisible);
    }
    const retainedLineIds = new Set(captionState.lines.map((entry) => entry.utteranceId));
    captionState.settled = captionState.settled.filter((entry) =>
      entry.rowIdentity
        ? retainedLineIds.has(entry.utteranceId)
        : !rowWasRemoved(entry) && rows.some((row) => sameCaptionRow(entry, {
            node: row,
            rowIdentity: captionRowIdentity(row),
          }))
    );
    const parsedRows = rows.flatMap((row) => {
      const speaker = text(firstWithin(row, selectors.captionAuthor));
      const captionText = text(firstWithin(row, selectors.captionText));
      const parsed = normalizeCaption(speaker, captionText);
      if (!parsed) return [];
      const current = { ...parsed, node: row, rowIdentity: captionRowIdentity(row) };
      const settledIndex = captionState.settled.findIndex((entry) =>
        sameCaptionRow(entry, current)
      );
      const settled = settledIndex >= 0 ? captionState.settled[settledIndex] : undefined;
      if (
        settled &&
        settled.text === current.text &&
        (settled.speaker || "") === (current.speaker || "")
      ) return [];
      if (settled?.rowIdentity && settled.rowIdentity === current.rowIdentity) {
        const committed = captionState.lines.find((entry) =>
          entry.utteranceId === settled.utteranceId
        );
        if (committed) {
          committed.speaker = current.speaker || committed.speaker;
          committed.text = current.text;
        }
        captionState.settled.splice(settledIndex, 1, {
          ...settled,
          ...current,
          speaker: current.speaker || settled.speaker,
        });
        return [];
      }
      if (settledIndex >= 0) captionState.settled.splice(settledIndex, 1);
      return [current];
    });
    if (parsedRows.length === 0) {
      if (captionState.visible.length > 0 && captionState.settleTimer === undefined) {
        scheduleCaptionSettle();
      }
      return;
    }
    const unmatchedPrevious = [...captionState.visible];
    const nextVisible = [];
    const now = Date.now();
    let captionChanged = false;
    for (const row of parsedRows) {
      const priorIndex = unmatchedPrevious.findIndex((candidate) =>
        row.rowIdentity
          ? candidate.rowIdentity === row.rowIdentity
          : candidate.node === row.node
      );
      const candidate = priorIndex >= 0 ? unmatchedPrevious[priorIndex] : undefined;
      const prior = candidate && sameCaptionUtterance(candidate, row)
        ? unmatchedPrevious.splice(priorIndex, 1)[0]
        : undefined;
      if (prior) {
        captionChanged ||=
          prior.text !== row.text ||
          prior.speaker !== row.speaker ||
          prior.node !== row.node;
        prior.speaker = row.speaker || prior.speaker;
        prior.text = row.text;
        prior.node = row.node;
        prior.rowIdentity = row.rowIdentity || prior.rowIdentity;
        prior.seenAt = now;
        nextVisible.push(prior);
      } else {
        captionChanged = true;
        nextVisible.push({
          at: new Date().toISOString(),
          node: row.node,
          rowIdentity: row.rowIdentity,
          seenAt: now,
          speaker: row.speaker,
          text: row.text,
        });
      }
    }
    captionChanged ||= unmatchedPrevious.length > 0;
    commitCaptionLines(captionState, unmatchedPrevious);
    retainSettledCaptionLines(captionState, unmatchedPrevious);
    captionState.visible = nextVisible;
    // Identity-less rows stay mutable while rendered; removal is their only
    // reliable utterance boundary. Stable logical rows may settle on quiet.
    if (
      (captionChanged || captionState.settleTimer === undefined) &&
      captionState.visible.every((entry) => entry.rowIdentity)
    ) {
      scheduleCaptionSettle();
    }
  };
  if (captionState) {
    const captionsFinalized = captionState.finalized === true;
    let captionsEnabledNow = captionsFinalized
      ? Boolean(captionState.enabledAttempted)
      : Boolean(firstRaw(selectors.captionRenderer) || firstRaw(selectors.captionsOff));
    ${options.captionEnableSource}
    if (!captionsFinalized && canMutateSession) captionState.enabledAttempted = captionsEnabledNow;
    captionsEnabledAttempted = Boolean(captionState.enabledAttempted);
    if (!captionsFinalized && canMutateSession && inCall && !captionState.observerInstalled) {
      captionState.observerInstalled = true;
      captionState.observer = new MutationObserver(scrapeCaptions);
      captionState.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      notes.push("Installed ${options.platform.displayName} live-caption observer.");
    }
    if (!captionsFinalized && canMutateSession && inCall) scrapeCaptions();
    const allLines = [...captionState.lines, ...captionState.visible];
    const lines = allLines.slice(-${transcriptMaxLines});
    const last = lines[lines.length - 1];
    captioning = captionsEnabledNow;
    transcriptLines = (captionState.droppedLines || 0) + allLines.length;
    lastCaptionAt = last?.at;
    lastCaptionSpeaker = last?.speaker;
    lastCaptionText = last?.text;
    recentTranscript = lines.slice(-5).map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text,
    }));
  }
  if (inCall && allowMicrophone && !manualAction) {
    if (audioInputRouted !== true || audioOutputRouted !== true) {
      manualAction = manualActionFor("${options.platform.manualActionReasonPrefix}-audio-choice-required", "Verify the OpenClaw virtual audio device is selected as both the ${options.platform.displayName} microphone and speaker before starting talk-back.");
    } else if (micMuted !== false) {
      manualAction = manualActionFor("${options.platform.manualActionReasonPrefix}-microphone-required", "Unmute the ${options.platform.displayName} microphone and verify the microphone control shows it is on before starting talk-back.");
    }
  }
  return JSON.stringify({
    clickedContinueInBrowser: Boolean(continueInBrowser),
    clickedJoin,
    inCall,
    ${options.extraResultSource ?? ""}
    micMuted,
    cameraOff,
    lobbyWaiting,
    captionCaptureRequested: captureCaptions,
    captioning,
    captionsEnabledAttempted,
    transcriptLines,
    lastCaptionAt,
    lastCaptionSpeaker,
    lastCaptionText,
    recentTranscript,
    audioInputRouted,
    audioInputDeviceLabel,
    audioInputRouteError,
    audioOutputRouted,
    audioOutputDeviceLabel,
    audioOutputRouteError,
    audioOutputRouteRetryable,
    manualAction,
    title: document.title,
    url: location.href,
    notes,
  });
}`;
}
//#endregion
//#region src/meeting-bot/status-prejoin-source.ts
function createMeetingStatusPreludeSource(params, options) {
	const selectors = params.selectors;
	const expectedIdentity = params.expectedIdentity;
	const toggleStateFunction = params.toggleStateFunction;
	const pageIdentityFunctionSource = () => params.pageIdentitySource;
	const audioOutputsGlobal = JSON.stringify(options.platform.globals.audioOutputs);
	const captionArchiveGlobal = JSON.stringify(options.platform.globals.captionArchive);
	const captionsGlobal = JSON.stringify(options.platform.globals.captions);
	const meetingGlobal = JSON.stringify(options.platform.globals.meeting);
	const transcriptMaxLines = options.transcriptMaxLines ?? 500;
	return `async () => {
  ${pageIdentityFunctionSource()}
  ${options.setupSource ?? ""}
  const parseToggleState = ${toggleStateFunction};
  const selectors = ${selectors};
  const expectedIdentity = ${JSON.stringify(expectedIdentity)};
  const allowMicrophone = ${JSON.stringify(params.allowMicrophone)};
  const allowSessionAdoption = ${JSON.stringify(params.allowSessionAdoption)};
  const autoJoin = ${JSON.stringify(params.autoJoin)};
  const captureCaptions = ${JSON.stringify(params.captureCaptions)};
  const readOnly = ${JSON.stringify(Boolean(params.readOnly))};
  const sessionId = ${JSON.stringify(params.meetingSessionId)};
  const identityRetentionMs = ${JSON.stringify(Math.max(3e4, params.waitForInCallMs))};
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const label = (node) => [
    node?.getAttribute?.("aria-label"),
    node?.getAttribute?.("title"),
    node?.getAttribute?.("data-tid"),
    text(node),
  ].filter(Boolean).join(" ");
  const manualActionFor = (reason, message) => ({ reason, message });
  const clickable = (node) => node?.matches?.("button")
    ? node
    : node?.querySelector?.("button") || node?.closest?.("button") || node;
  const first = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (node) return clickable(node);
    }
    return undefined;
  };
  const firstRaw = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    return undefined;
  };
  const firstWithin = (root, list) => {
    if (!root) return undefined;
    for (const selector of list) {
      if (root.matches?.(selector)) return root;
      const node = root.querySelector?.(selector);
      if (node) return node;
    }
    return undefined;
  };
  // Keep these names scoped: older plugin lifecycle fragments declare their own helpers.
  const meetingAudioInput = (() => {
    const isVirtualAudioDevice = (value) =>
      /^(?:blackhole 2ch(?: \\(virtual\\))?|openclaw meeting audio)$/i.test(
        String(value || "").replace(/\\s+/g, " ").trim()
      );
    const isVirtualAudioDeviceNode = (node) => [
      node?.getAttribute?.("aria-label"),
      node?.getAttribute?.("title"),
      node?.label,
      node?.value,
      text(node),
    ].some(isVirtualAudioDevice);
    const microphoneDeviceRoots = () => {
      // Consumer in-call controls expose the listbox itself, without the prejoin
      // selected-device button/combobox wrapper.
      const control = firstRaw(selectors.microphoneDevice) || firstRaw(selectors.microphoneDeviceMenu);
      if (!control) return { control, roots: [] };
      const roots = [control];
      const scope = control.closest?.(selectors.microphoneDeviceScope);
      if (scope && !roots.includes(scope)) roots.push(scope);
      const listboxId = control.getAttribute?.("aria-controls");
      const listbox = listboxId ? document.getElementById?.(listboxId) : undefined;
      if (listbox && !roots.includes(listbox)) roots.push(listbox);
      const liveMenu = firstRaw(selectors.microphoneDeviceMenu);
      if (liveMenu && !roots.includes(liveMenu)) roots.push(liveMenu);
      return { control, roots };
    };
    const selectedMicrophoneLabel = () => {
      const { control, roots } = microphoneDeviceRoots();
      const selectedOption = control?.selectedOptions?.[0];
      if (selectedOption && isVirtualAudioDeviceNode(selectedOption)) {
        return label(selectedOption) || selectedOption.value;
      }
      if (control && isVirtualAudioDeviceNode(control)) return label(control) || control.value;
      for (const root of roots) {
        const selected = firstWithin(root, selectors.selectedMicrophoneDevice);
        if (selected && isVirtualAudioDeviceNode(selected)) {
          return label(selected) || selected.value;
        }
      }
      return undefined;
    };
    return { isVirtualAudioDevice, isVirtualAudioDeviceNode, microphoneDeviceRoots, selectedMicrophoneLabel };
  })();
  ${options.controlLookupSource}
  const waitForUi = () => new Promise((resolve) => setTimeout(resolve, 120));
  const bridgeOwnedBySession = (entry) => Boolean(
    sessionId && (!entry?.sessionId || entry.sessionId === sessionId)
  );
  const mediaSourceUrl = (element) => String(element?.currentSrc || element?.src || "");
  const bridgeSources = (entry) => Array.isArray(entry?.sources)
    ? entry.sources
    : entry?.source
      ? [{ element: entry.source, muted: Boolean(entry.sourceMuted), pending: Boolean(entry.pending), stream: entry.stream, url: entry.sourceUrl }]
      : [];
  const bridgeSourceMatches = (element, source) => {
    if (!element) return false;
    if (source?.pending && mediaSourceIsEmpty(element) && !source.stream && !source.url) return true;
    if (source?.stream || element.srcObject) return element.srcObject === source?.stream;
    const currentUrl = mediaSourceUrl(element);
    return Boolean(source?.url && currentUrl && source.url === currentUrl);
  };
  const mediaSourceIsEmpty = (element) => Boolean(
    element && !element.srcObject && !mediaSourceUrl(element)
  );
  const restoreAudioBridgeSource = (source) => {
    const element = source?.element;
    // An empty element may receive a replacement source after cleanup. Keep it
    // silent because there is no source identity that is safe to restore.
    if (mediaSourceIsEmpty(element)) {
      element.muted = true;
      return;
    }
    // Teams reuses media elements across source changes. Restore only the exact
    // source this bridge muted.
    if (!bridgeSourceMatches(element, source)) return;
    const detachedLiveSource = Boolean(
      element.isConnected === false &&
      element.srcObject?.getAudioTracks?.().some((track) => track.readyState === "live")
    );
    if (detachedLiveSource) {
      element.muted = true;
      element.pause?.();
      element.srcObject = null;
      return;
    }
    element.muted = Boolean(source.muted);
  };
  const restoreAudioBridgeSources = (entry) => {
    bridgeSources(entry).forEach(restoreAudioBridgeSource);
  };
  const retireAudioBridge = (entry, restoreSources = true) => {
    if (restoreSources) restoreAudioBridgeSources(entry);
    entry?.bridge?.pause?.();
    if (entry?.bridge) entry.bridge.srcObject = null;
    entry?.bridge?.remove?.();
  };
  const retireOwnedAudioBridges = (restoreSources = true) => {
    const entries = Array.isArray(window[${audioOutputsGlobal}])
      ? window[${audioOutputsGlobal}]
      : [];
    const retained = [];
    for (const entry of entries) {
      if (!bridgeOwnedBySession(entry)) {
        retained.push(entry);
        continue;
      }
      retireAudioBridge(entry, restoreSources);
    }
    if (retained.length > 0) window[${audioOutputsGlobal}] = retained;
    else delete window[${audioOutputsGlobal}];
  };
  const adoptAudioBridgeSourcesForSession = () => {
    const entries = Array.isArray(window[${audioOutputsGlobal}])
      ? window[${audioOutputsGlobal}]
      : [];
    const suspendedBySource = new Map();
    for (const entry of entries) {
      for (const source of bridgeSources(entry)) {
        if (!source?.element || suspendedBySource.has(source.element)) continue;
        if (!bridgeSourceMatches(source.element, source)) {
          restoreAudioBridgeSource(source);
          continue;
        }
        suspendedBySource.set(source.element, {
          sessionId,
          source: source.element,
          sourceMuted: Boolean(source.muted),
          sourceUrl: mediaSourceUrl(source.element) || source.url,
          stream: source.element.srcObject,
          suspended: true,
        });
      }
      retireAudioBridge(entry, false);
    }
    const suspended = [...suspendedBySource.values()];
    if (suspended.length > 0) window[${audioOutputsGlobal}] = suspended;
    else delete window[${audioOutputsGlobal}];
  };
  const suspendOwnedAudioBridges = () => {
    const entries = Array.isArray(window[${audioOutputsGlobal}])
      ? window[${audioOutputsGlobal}]
      : [];
    const retained = [];
    const suspendedBySource = new Map();
    for (const entry of entries) {
      if (!bridgeOwnedBySession(entry)) {
        retained.push(entry);
        continue;
      }
      // This pending entry owns the muted element until a later serialized
      // status poll sees and routes the attached playback source.
      if (
        entry?.pending &&
        bridgeSources(entry).some((source) => bridgeSourceMatches(source?.element, source))
      ) {
        retained.push(entry);
        continue;
      }
      for (const source of bridgeSources(entry)) {
        if (!source?.element || suspendedBySource.has(source.element)) continue;
        if (!bridgeSourceMatches(source.element, source)) {
          restoreAudioBridgeSource(source);
          continue;
        }
        suspendedBySource.set(source.element, {
          sessionId: entry.sessionId || sessionId,
          source: source.element,
          sourceMuted: Boolean(source.muted),
          sourceUrl: source.url,
          stream: source.element.srcObject,
          suspended: true,
        });
      }
      retireAudioBridge(entry, false);
    }
    const next = [...retained, ...suspendedBySource.values()];
    if (next.length > 0) window[${audioOutputsGlobal}] = next;
    else delete window[${audioOutputsGlobal}];
  };
  const retireOwnedCaptions = () => {
    const active = window[${captionsGlobal}];
    const owned = Boolean(
      active && sessionId && (!active.sessionId || active.sessionId === sessionId)
    );
    if (!owned) return;
    if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
    active.observer?.disconnect?.();
    delete window[${captionsGlobal}];
  };
  const finalizeCaptionState = (active) => {
    if (!active) return;
    if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
    active.settleTimer = undefined;
    active.observer?.disconnect?.();
    active.observer = undefined;
    active.observerInstalled = false;
    active.lines = Array.isArray(active.lines) ? active.lines : [];
    if (Array.isArray(active.visible) && active.visible.length > 0) {
      active.lines.push(...active.visible.map((entry) => ({
        at: entry.at,
        speaker: entry.speaker,
        text: entry.text,
      })));
      active.visible = [];
    }
    const excess = active.lines.length - ${transcriptMaxLines};
    if (excess > 0) {
      active.lines.splice(0, excess);
      active.droppedLines = (active.droppedLines || 0) + excess;
    }
    active.finalized = true;
    active.finalizedAt = Date.now();
  };
  const archiveFinalizedCaptions = (active) => {
    if (active?.finalized !== true || !active.sessionId) return;
    const archive = window[${captionArchiveGlobal}] &&
        typeof window[${captionArchiveGlobal}] === "object"
      ? window[${captionArchiveGlobal}]
      : {};
    archive[active.sessionId] = active;
    const retained = Object.entries(archive)
      .sort((left, right) => Number(right[1]?.finalizedAt || 0) - Number(left[1]?.finalizedAt || 0))
      .slice(0, 4);
    window[${captionArchiveGlobal}] = Object.fromEntries(retained);
  };
  const finalizeOwnedCaptions = () => {
    const active = window[${captionsGlobal}];
    const owned = Boolean(
      active && sessionId && (!active.sessionId || active.sessionId === sessionId)
    );
    if (owned) {
      active.identity ||= priorMeeting?.identity || expectedIdentity;
      finalizeCaptionState(active);
    }
  };
  const toggleState = (node, kind) => parseToggleState({
    kind,
    ariaPressed: node?.getAttribute?.("aria-pressed"),
    ariaChecked: node?.getAttribute?.("aria-checked"),
    checked: typeof node?.checked === "boolean" ? node.checked : undefined,
    iconClass: node?.querySelector?.("svg")?.getAttribute?.("class"),
    label: label(node),
  });
  const notes = [];
  const currentIdentity = meetingIdentity(location.href);
  const priorMeeting = window[${meetingGlobal}];
  if (expectedIdentity && currentIdentity && currentIdentity !== expectedIdentity) {
    // A confirmed SPA transition must stop resources still owned by this
    // request, while preserving any newer session already committed to the tab.
    retireOwnedAudioBridges();
    finalizeOwnedCaptions();
    const requestOwnsMeeting = Boolean(
      priorMeeting &&
      sessionId &&
      (!priorMeeting.sessionId || priorMeeting.sessionId === sessionId)
    );
    if (requestOwnsMeeting) delete window[${meetingGlobal}];
    return JSON.stringify({
      inCall: false,
      manualAction: manualActionFor("${options.platform.manualActionReasonPrefix}-session-conflict", "The tracked ${options.platform.displayName} tab now shows a different meeting. Return to the requested meeting link, then retry."),
      title: document.title,
      url: location.href,
      notes,
    });
  }
  const meetingOwnerConflict = Boolean(
    priorMeeting?.sessionId && priorMeeting.sessionId !== sessionId
  );
  const captionOwnerConflict = Boolean(
    window[${captionsGlobal}]?.sessionId &&
    window[${captionsGlobal}].sessionId !== sessionId
  );
  const committedOwnerConflict = meetingOwnerConflict || captionOwnerConflict;
  const canRepairCaptionOwner = Boolean(
    !meetingOwnerConflict && priorMeeting?.sessionId === sessionId
  );
  const canMutateSession = Boolean(
    !readOnly &&
    sessionId &&
    (!committedOwnerConflict || canRepairCaptionOwner || allowSessionAdoption)
  );
  const identityMatchedUrl = Boolean(expectedIdentity && currentIdentity === expectedIdentity);
  const identityVerifiedBeforeCall = identityMatchedUrl;
  const previousRemoteCapture = window.__openclawMeetingRemoteAudio;
  if (canMutateSession && allowSessionAdoption && previousRemoteCapture && previousRemoteCapture.sessionId !== sessionId) {
    await previousRemoteCapture.stop();
  }
  ${options.lifecycleSource}
  const micMuted = microphoneState === "off" ? true : microphoneState === "on" ? false : undefined;
  const cameraOff = cameraState === "off" ? true : cameraState === "on" ? false : undefined;
  ${options.manualActionSource}
`;
}
//#endregion
//#region src/meeting-bot/platform-adapter.ts
function browserResultString(result) {
	if (!result || typeof result !== "object") return;
	const value = result.result;
	return typeof value === "string" && value.trim() ? value : void 0;
}
const optionalBrowserString = string().optional().catch(void 0);
const optionalBrowserBoolean = boolean().optional().catch(void 0);
const optionalBrowserNumber = number().optional().catch(void 0);
const invalidBrowserArrayItemSchema = unknown().transform(() => null);
const meetingTranscriptLineSchema = object({
	at: optionalBrowserString,
	speaker: optionalBrowserString,
	text: string().refine((value) => value.trim().length > 0)
}).transform(({ at, speaker, text }) => ({
	...at !== void 0 ? { at } : {},
	...speaker !== void 0 ? { speaker } : {},
	text
}));
const meetingBrowserStatusSchema = looseObject({
	inCall: optionalBrowserBoolean,
	micMuted: optionalBrowserBoolean,
	cameraOff: optionalBrowserBoolean,
	lobbyWaiting: optionalBrowserBoolean,
	captionCaptureRequested: optionalBrowserBoolean,
	captioning: optionalBrowserBoolean,
	captionsEnabledAttempted: optionalBrowserBoolean,
	transcriptLines: optionalBrowserNumber,
	lastCaptionAt: optionalBrowserString,
	lastCaptionSpeaker: optionalBrowserString,
	lastCaptionText: optionalBrowserString,
	recentTranscript: array(union([meetingTranscriptLineSchema, invalidBrowserArrayItemSchema])).transform((lines) => lines.filter((line) => line !== null)).optional().catch(void 0),
	audioInputRouted: optionalBrowserBoolean,
	audioInputDeviceLabel: optionalBrowserString,
	audioInputRouteError: optionalBrowserString,
	audioOutputRouted: optionalBrowserBoolean,
	audioOutputDeviceLabel: optionalBrowserString,
	audioOutputRouteError: optionalBrowserString,
	audioOutputRouteRetryable: optionalBrowserBoolean,
	manualAction: object({
		reason: string(),
		message: string()
	}).optional().catch(void 0),
	url: optionalBrowserString,
	title: optionalBrowserString,
	notes: array(union([string(), invalidBrowserArrayItemSchema])).transform((notes) => notes.filter((note) => note !== null)).optional().catch(void 0)
});
function parseMeetingBrowserStatus(result, options) {
	const raw = browserResultString(result);
	if (!raw) return;
	let parsed;
	try {
		parsed = meetingBrowserStatusSchema.parse(JSON.parse(raw));
	} catch {
		throw new Error(options.malformedStatusMessage);
	}
	return {
		inCall: parsed.inCall,
		micMuted: parsed.micMuted,
		cameraOff: parsed.cameraOff,
		lobbyWaiting: parsed.lobbyWaiting,
		captionCaptureRequested: parsed.captionCaptureRequested,
		captioning: parsed.captioning,
		captionsEnabledAttempted: parsed.captionsEnabledAttempted,
		transcriptLines: parsed.transcriptLines,
		lastCaptionAt: parsed.lastCaptionAt,
		lastCaptionSpeaker: parsed.lastCaptionSpeaker,
		lastCaptionText: parsed.lastCaptionText,
		recentTranscript: parsed.recentTranscript,
		audioInputRouted: parsed.audioInputRouted,
		audioInputDeviceLabel: parsed.audioInputDeviceLabel,
		audioInputRouteError: parsed.audioInputRouteError,
		audioOutputRouted: parsed.audioOutputRouted,
		audioOutputDeviceLabel: parsed.audioOutputDeviceLabel,
		audioOutputRouteError: parsed.audioOutputRouteError,
		audioOutputRouteRetryable: parsed.audioOutputRouteRetryable,
		manualAction: parsed.manualAction,
		browserUrl: parsed.url,
		browserTitle: parsed.title,
		status: "browser-control",
		notes: parsed.notes,
		...options.statusFields?.(parsed)
	};
}
function parseMeetingLeaveResult(result) {
	const raw = browserResultString(result);
	if (!raw) return { departed: false };
	try {
		const parsed = JSON.parse(raw);
		const leaveAction = parsed.leaveAction === "leave" || parsed.leaveAction === "confirm" ? parsed.leaveAction : void 0;
		return {
			departed: parsed.departed === true,
			...leaveAction ? { leaveAction } : {},
			...typeof parsed.sessionConflict === "boolean" ? { sessionConflict: parsed.sessionConflict } : {},
			...typeof parsed.sessionMatched === "boolean" ? { sessionMatched: parsed.sessionMatched } : {},
			...typeof parsed.urlMatched === "boolean" ? { urlMatched: parsed.urlMatched } : {}
		};
	} catch {
		return { departed: false };
	}
}
function parseMeetingTranscript(result, options) {
	const raw = browserResultString(result);
	if (!raw) return {
		droppedLines: 0,
		lines: []
	};
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error(options.malformedTranscriptMessage);
	}
	if (!parsed || typeof parsed !== "object") throw new Error(options.invalidTranscriptMessage);
	const payload = parsed;
	const droppedLines = typeof payload.droppedLines === "number" && Number.isSafeInteger(payload.droppedLines) ? Math.max(0, payload.droppedLines) : 0;
	const lines = Array.isArray(payload.lines) ? payload.lines.flatMap((value) => {
		if (!value || typeof value !== "object") return [];
		const line = value;
		if (typeof line.text !== "string" || !line.text.trim()) return [];
		return [{
			...typeof line.at === "string" ? { at: line.at } : {},
			...typeof line.speaker === "string" ? { speaker: line.speaker } : {},
			text: line.text
		}];
	}) : [];
	return {
		droppedLines,
		...typeof payload.epoch === "string" ? { epoch: payload.epoch } : {},
		lines,
		...typeof payload.urlMatched === "boolean" ? { urlMatched: payload.urlMatched } : {},
		...typeof payload.sessionMatched === "boolean" ? { sessionMatched: payload.sessionMatched } : {}
	};
}
function createMeetingPlatformAdapter(options) {
	const { browser, parsing, ...platform } = options;
	return {
		...platform,
		browser: {
			...browser,
			parseStatus: (result) => parseMeetingBrowserStatus(result, parsing),
			classifyManualAction: (health) => {
				if (!health.manualAction) return;
				return {
					category: parsing.classifyManualActionReason(health.manualAction.reason),
					reason: health.manualAction.reason,
					message: health.manualAction.message
				};
			},
			parseLeaveResult: parseMeetingLeaveResult,
			captions: {
				...browser.captions,
				parseTranscript: (result) => parseMeetingTranscript(result, parsing)
			},
			permissionNotes: browser.permissionNotes ?? (({ allowMicrophone, error, result }) => {
				if (!allowMicrophone) return [`Observe-only mode does not request ${parsing.displayName} microphone access.`];
				if (error) return [`Could not grant ${parsing.displayName} media permissions automatically: ${formatErrorMessage(error)}`];
				const record = result && typeof result === "object" ? result : {};
				const unsupportedPermissions = Array.isArray(record.unsupportedPermissions) ? record.unsupportedPermissions.filter((value) => typeof value === "string") : [];
				const notes = [`Granted ${parsing.displayName} microphone permission through browser control.`];
				if (unsupportedPermissions.includes("speakerSelection")) notes.push(`Chrome did not accept the optional ${parsing.displayName} speaker-selection permission.`);
				return notes;
			})
		}
	};
}
const MeetingPlatformAdapter = {
	create: createMeetingPlatformAdapter,
	createChromeTransport: createMeetingChromeTransport,
	createChromeTransportWithExternalAudio: createMeetingChromeTransportWithExternalAudio,
	createChromeRuntimeBindings: createMeetingChromeRuntimeBindings,
	createPluginChromeTransport: createMeetingPluginChromeTransport,
	createPluginConfigSchema: createMeetingPluginConfigSchema,
	createPluginNodeHostHandler: createMeetingPluginNodeHostHandler,
	createPluginNodeInvokePolicy: createMeetingPluginNodeInvokePolicy,
	createPluginShellEntry: createMeetingPluginShellEntry,
	createRuntimeFacade: createMeetingRuntimeFacade,
	createRuntimeSetup: createMeetingRuntimeSetup,
	pluginTypes: createMeetingPluginTypes,
	registerPluginCli: registerMeetingPluginCli,
	resolveProbeTimeoutMs: resolveMeetingProbeTimeoutMs,
	createRuntimeProbes: createMeetingRuntimeProbes,
	createNodeHostHandler: createMeetingConfiguredNodeHost,
	createPluginEntry: createMeetingPluginEntryOptions,
	createStatusCallSource: createMeetingStatusCallSource,
	createStatusPreludeSource: createMeetingStatusPreludeSource,
	isRealtimeRouteReady: isMeetingRealtimeRouteReady,
	isTalkBackMode: isMeetingTalkBackMode,
	ensureAudioBackend: ensureMeetingAudioBackend,
	resolveAudioRuntimeForFormat: resolveMeetingAudioRuntimeForFormat
};
//#endregion
//#region src/meeting-bot/voice-call-gateway.ts
function createMeetingVoiceCallGateway(params) {
	if (!params.config.gatewayUrl) return {
		trustedPluginIdentity: true,
		request: (method, requestParams) => params.runtime.gateway.request(method, requestParams, { timeoutMs: params.config.requestTimeoutMs })
	};
	return {
		trustedPluginIdentity: false,
		async request(method, requestParams) {
			const client = await params.connectClient(params);
			try {
				return await client.request(method, requestParams, { timeoutMs: params.config.requestTimeoutMs });
			} finally {
				await client.stopAndWait({ timeoutMs: 1e3 }).catch(() => {});
			}
		}
	};
}
function isMeetingVoiceCallMissingError(error) {
	const message = formatErrorMessage(error).toLowerCase();
	return message.includes("call not found") || message.includes("call is not active");
}
async function joinMeetingViaVoiceCallGateway(params) {
	if (params.agentId && params.agentId !== "main" && !params.gateway.trustedPluginIdentity) throw new Error(`Per-agent Voice Call routing requires the local Gateway runtime. Remove ${params.surface.configPath} or omit agent routing.`);
	params.logger?.info(`${params.surface.logScope} Delegating ${params.surface.providerLabel} join to Voice Call (dtmf=${params.dtmfSequence ? "pre-connect" : "none"}, intro=${params.message ? "delayed" : "none"})`);
	const start = await params.gateway.request("voicecall.start", {
		to: params.dialInNumber,
		mode: "conversation",
		...params.dtmfSequence ? { dtmfSequence: params.dtmfSequence } : {},
		...params.requesterSessionKey ? { requesterSessionKey: params.requesterSessionKey } : {},
		...params.agentId && params.gateway.trustedPluginIdentity ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
	if (!start.callId) throw new Error(start.error || "voicecall.start did not return callId");
	params.logger?.info(`${params.surface.logScope} Voice Call ${params.surface.providerLabel} phone leg started: callId=${start.callId}`);
	const dtmfSent = Boolean(params.dtmfSequence);
	if (dtmfSent) params.logger?.info(`${params.surface.logScope} ${params.surface.meetingLabel} DTMF queued before realtime connect: callId=${start.callId} digits=${params.dtmfSequence?.length ?? 0}`);
	let introSent = false;
	if (params.message) {
		const delayMs = params.dtmfSequence ? params.config.postDtmfSpeechDelayMs : 0;
		if (delayMs > 0) {
			params.logger?.info(`${params.surface.logScope} Waiting ${delayMs}ms after ${params.surface.meetingLabel} DTMF before speaking intro for callId=${start.callId}`);
			await sleep(delayMs);
		}
		let spoken;
		try {
			spoken = await params.gateway.request("voicecall.speak", {
				callId: start.callId,
				allowTwimlFallback: false,
				message: params.message
			});
		} catch (error) {
			params.logger?.warn?.(`${params.surface.logScope} Skipped intro speech because realtime bridge was not ready: ${formatErrorMessage(error)}`);
			spoken = { success: false };
		}
		if (spoken.success === false) params.logger?.warn?.(`${params.surface.logScope} Skipped intro speech because realtime bridge was not ready: ${spoken.error || "voicecall.speak failed"}`);
		else {
			introSent = true;
			params.logger?.info(`${params.surface.logScope} Intro speech requested after ${params.surface.meetingLabel} dial sequence: callId=${start.callId}`);
		}
	}
	return {
		callId: start.callId,
		dtmfSent,
		introSent
	};
}
async function endMeetingVoiceCallGatewayCall(params) {
	try {
		await params.gateway.request("voicecall.end", { callId: params.callId });
	} catch (error) {
		if (!isMeetingVoiceCallMissingError(error)) throw error;
	}
}
async function getMeetingVoiceCallGatewayCall(params) {
	return await params.gateway.request("voicecall.status", { callId: params.callId });
}
async function speakMeetingViaVoiceCallGateway(params) {
	const spoken = await params.gateway.request("voicecall.speak", {
		callId: params.callId,
		message: params.message
	});
	if (spoken.success === false) throw new Error(spoken.error || "voicecall.speak failed");
}
//#endregion
export { MeetingPlatformAdapter, MeetingSessionRuntime, addMeetingSetupCheck, asMeetingBrowserTabs, buildMeetingSoxAudioCommands, callMeetingBrowserProxyOnNode, convertMeetingTtsAudioForBridge, createLocalMeetingRealtimeAudioTransport, createMeetingBrowserNodeInvokePolicy, createMeetingNodeHost, createMeetingRealtimeEngineBindings, createMeetingSession, createMeetingSetupStatus, createMeetingVoiceCallGateway, createNodeMeetingRealtimeAudioTransport, endMeetingVoiceCallGatewayCall, getMeetingVoiceCallGatewayCall, isMeetingVoiceCallMissingError, joinMeetingViaVoiceCallGateway, leaveMeetingWithBrowser, openMeetingWithBrowser, readMeetingBrowserTab, readMeetingTranscriptWithBrowser, recoverMeetingBrowserTab, resolveLocalMeetingBrowserRequest, resolveMeetingBrowserNode, resolveMeetingBrowserNodeInfo, speakMeetingViaVoiceCallGateway, startMeetingAgentRealtimeEngine, startMeetingRealtimeEngine };
