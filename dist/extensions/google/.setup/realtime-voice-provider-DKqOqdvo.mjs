import { n as GOOGLE_REALTIME_VOICE_METADATA } from "./realtime-voice-metadata-Av6ZDzmC.mjs";
import { r as resolveGoogleApiClientHeaders, t as resolveGoogleGemini3ThinkingLevel } from "./thinking-api-h4l7eUNr.mjs";
import { canonicalizeGoogleProviderBase64 } from "./base64-Cw_Cc1ui.mjs";
import { asBoolean, asFiniteNumber, asOptionalRecord, asSafeIntegerInRange, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, convertPcmToMulaw8k, createRealtimeVoiceAudioQueue, mulawToPcm, realtimeVoiceAudioDurationMs, resamplePcm } from "openclaw/plugin-sdk/realtime-voice-provider";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { randomUUID } from "node:crypto";
import { resolveExpiresAtMsFromDurationMs, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { ActivityHandling, Behavior, EndSensitivity, FunctionResponseScheduling, GoogleGenAI, Modality, StartSensitivity, TurnCoverage } from "@google/genai";
import { warn } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/google/google-genai-runtime.ts
function createGoogleGenAI(options) {
	const httpOptions = options.httpOptions ?? {};
	return new GoogleGenAI({
		...options,
		httpOptions: {
			...httpOptions,
			headers: {
				...httpOptions.headers,
				...resolveGoogleApiClientHeaders({ baseUrl: typeof httpOptions.baseUrl === "string" ? httpOptions.baseUrl : void 0 })
			}
		}
	});
}
//#endregion
//#region extensions/google/realtime-voice-provider.ts
const GOOGLE_REALTIME_DEFAULT_VOICE = "Kore";
const GOOGLE_REALTIME_DEFAULT_API_VERSION = "v1beta";
const GOOGLE_REALTIME_INPUT_SAMPLE_RATE = 16e3;
const GOOGLE_REALTIME_BROWSER_API_VERSION = "v1alpha";
const GOOGLE_REALTIME_BROWSER_WEBSOCKET_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";
const DEFAULT_AUDIO_STREAM_END_SILENCE_MS = 500;
const GOOGLE_REALTIME_BROWSER_SESSION_TTL_MS = 18e5;
const GOOGLE_REALTIME_BROWSER_NEW_SESSION_TTL_MS = 6e4;
const GOOGLE_REALTIME_RECONNECT_MAX_ATTEMPTS = 3;
const GOOGLE_REALTIME_RECONNECT_BASE_DELAY_MS = 250;
const GOOGLE_REALTIME_RECONNECT_MAX_DELAY_MS = 2e3;
const GOOGLE_REALTIME_MAX_TOOL_CALL_IDS = 1024;
const GOOGLE_REALTIME_MAX_PENDING_TOOL_RESPONSES = 1024;
const GOOGLE_REALTIME_MAX_PENDING_TOOL_RESPONSE_BYTES = 1048576;
const GOOGLE_REALTIME_MAX_PENDING_TRANSCRIPT_BYTES = 262144;
const GOOGLE_REALTIME_TRANSCRIPT_OVERFLOW_MESSAGE = "Google Live transcript exceeded the 256 KiB UTF-8 pending buffer limit";
const GOOGLE_REALTIME_TOOL_NAME_RE = /^[A-Za-z_][A-Za-z0-9_.:-]{0,127}$/;
const MULAW_LINEAR_SAMPLES = /* @__PURE__ */ new Int16Array(256);
for (let i = 0; i < MULAW_LINEAR_SAMPLES.length; i += 1) MULAW_LINEAR_SAMPLES[i] = decodeMulawSample(i);
const START_SENSITIVITY = {
	high: StartSensitivity.START_SENSITIVITY_HIGH,
	low: StartSensitivity.START_SENSITIVITY_LOW
};
const END_SENSITIVITY = {
	high: EndSensitivity.END_SENSITIVITY_HIGH,
	low: EndSensitivity.END_SENSITIVITY_LOW
};
const ACTIVITY_HANDLING = {
	"start-of-activity-interrupts": ActivityHandling.START_OF_ACTIVITY_INTERRUPTS,
	"no-interruption": ActivityHandling.NO_INTERRUPTION
};
const TURN_COVERAGE = {
	"only-activity": TurnCoverage.TURN_INCLUDES_ONLY_ACTIVITY,
	"all-input": TurnCoverage.TURN_INCLUDES_ALL_INPUT,
	"audio-activity-and-all-video": TurnCoverage.TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO
};
function trimToUndefined(value) {
	return normalizeOptionalString(value);
}
function asSensitivity(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return normalized === "low" || normalized === "high" ? normalized : void 0;
}
function asThinkingLevel(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return normalized === "minimal" || normalized === "low" || normalized === "medium" || normalized === "high" ? normalized : void 0;
}
function asActivityHandling(value) {
	switch (normalizeOptionalString(value)?.toLowerCase().replaceAll("_", "-")) {
		case "start-of-activity-interrupts":
		case "start-of-activity-interrupt":
		case "interrupt":
		case "interrupts": return "start-of-activity-interrupts";
		case "no-interruption":
		case "no-interruptions":
		case "none": return "no-interruption";
		default: return;
	}
}
function asTurnCoverage(value) {
	switch (normalizeOptionalString(value)?.toLowerCase().replaceAll("_", "-")) {
		case "only-activity":
		case "turn-includes-only-activity": return "only-activity";
		case "all-input":
		case "turn-includes-all-input": return "all-input";
		case "audio-activity-and-all-video":
		case "turn-includes-audio-activity-and-all-video": return "audio-activity-and-all-video";
		default: return;
	}
}
function asNonNegativeInteger(value) {
	return asSafeIntegerInRange(value, { min: 0 });
}
function resolveGoogleRealtimeProviderConfigRecord(config) {
	const providers = asOptionalRecord(config.providers);
	return asOptionalRecord(providers?.google) ?? asOptionalRecord(config.google) ?? config;
}
function normalizeProviderConfig(config, cfg) {
	const raw = resolveGoogleRealtimeProviderConfigRecord(config);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey ?? cfg?.models?.providers?.google?.apiKey,
			path: "plugins.entries.voice-call.config.realtime.providers.google.apiKey"
		}),
		model: trimToUndefined(raw?.model),
		voice: trimToUndefined(raw?.speakerVoice) ?? trimToUndefined(raw?.voice),
		temperature: asFiniteNumber(raw?.temperature),
		apiVersion: trimToUndefined(raw?.apiVersion),
		prefixPaddingMs: asNonNegativeInteger(raw?.prefixPaddingMs),
		silenceDurationMs: asNonNegativeInteger(raw?.silenceDurationMs),
		startSensitivity: asSensitivity(raw?.startSensitivity),
		endSensitivity: asSensitivity(raw?.endSensitivity),
		activityHandling: asActivityHandling(raw?.activityHandling),
		turnCoverage: asTurnCoverage(raw?.turnCoverage),
		automaticActivityDetectionDisabled: asBoolean(raw?.automaticActivityDetectionDisabled),
		enableAffectiveDialog: asBoolean(raw?.enableAffectiveDialog),
		sessionResumption: asBoolean(raw?.sessionResumption),
		contextWindowCompression: asBoolean(raw?.contextWindowCompression),
		thinkingLevel: asThinkingLevel(raw?.thinkingLevel),
		thinkingBudget: asSafeIntegerInRange(raw?.thinkingBudget, {
			min: -1,
			max: 24576
		})
	};
}
function resolveEnvApiKey() {
	return trimToUndefined(process.env.GEMINI_API_KEY) ?? trimToUndefined(process.env.GOOGLE_API_KEY);
}
function isGemini31LiveModel(model) {
	const modelId = model.startsWith("models/") ? model.slice(7) : model;
	return modelId.startsWith("gemini-3.1-") && modelId.includes("-live");
}
function supportsAsyncFunctionCalling(model) {
	return !isGemini31LiveModel(model);
}
function buildThinkingConfig(config, model) {
	if (isGemini31LiveModel(model)) {
		const thinkingLevel = resolveGoogleGemini3ThinkingLevel({
			modelId: model,
			thinkingLevel: config.thinkingLevel,
			thinkingBudget: config.thinkingBudget
		});
		return thinkingLevel ? { thinkingLevel } : void 0;
	}
	if (typeof config.thinkingBudget === "number") return { thinkingBudget: config.thinkingBudget };
}
function buildRealtimeInputConfig(config) {
	const startSensitivity = config.startSensitivity ? START_SENSITIVITY[config.startSensitivity] : void 0;
	const endSensitivity = config.endSensitivity ? END_SENSITIVITY[config.endSensitivity] : void 0;
	const activityHandling = config.activityHandling ? ACTIVITY_HANDLING[config.activityHandling] : void 0;
	const turnCoverage = config.turnCoverage ? TURN_COVERAGE[config.turnCoverage] : void 0;
	const automaticActivityDetection = {
		...typeof config.automaticActivityDetectionDisabled === "boolean" ? { disabled: config.automaticActivityDetectionDisabled } : {},
		...startSensitivity ? { startOfSpeechSensitivity: startSensitivity } : {},
		...endSensitivity ? { endOfSpeechSensitivity: endSensitivity } : {},
		...typeof config.prefixPaddingMs === "number" ? { prefixPaddingMs: config.prefixPaddingMs } : {},
		...typeof config.silenceDurationMs === "number" ? { silenceDurationMs: config.silenceDurationMs } : {}
	};
	const realtimeInputConfig = {
		...Object.keys(automaticActivityDetection).length > 0 ? { automaticActivityDetection } : {},
		...activityHandling ? { activityHandling } : {},
		...turnCoverage ? { turnCoverage } : {}
	};
	return Object.keys(realtimeInputConfig).length > 0 ? realtimeInputConfig : void 0;
}
function buildFunctionDeclarations(tools, allowNonBlocking) {
	const declarations = [];
	let omitted = 0;
	for (const tool of tools ?? []) try {
		const name = tool.name;
		if (typeof name !== "string" || !GOOGLE_REALTIME_TOOL_NAME_RE.test(name)) {
			omitted += 1;
			continue;
		}
		const declaration = {
			name,
			description: tool.description,
			parameters: tool.parameters
		};
		if (allowNonBlocking && name === REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME) declaration.behavior = Behavior.NON_BLOCKING;
		declarations.push(declaration);
	} catch {
		omitted += 1;
	}
	if (omitted > 0) warn(`google realtime: omitted ${omitted} tool definition(s) with unsupported names`);
	return declarations;
}
function buildGoogleLiveConnectConfig(config, model) {
	const functionDeclarations = buildFunctionDeclarations(config.tools, supportsAsyncFunctionCalling(model));
	const realtimeInputConfig = buildRealtimeInputConfig(config);
	const thinkingConfig = buildThinkingConfig(config, model);
	return {
		responseModalities: [Modality.AUDIO],
		...typeof config.temperature === "number" && config.temperature > 0 ? { temperature: config.temperature } : {},
		speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voice ?? GOOGLE_REALTIME_DEFAULT_VOICE } } },
		systemInstruction: config.instructions,
		...functionDeclarations.length > 0 ? { tools: [{ functionDeclarations }] } : {},
		...realtimeInputConfig ? { realtimeInputConfig } : {},
		inputAudioTranscription: {},
		outputAudioTranscription: {},
		...!isGemini31LiveModel(model) && typeof config.enableAffectiveDialog === "boolean" ? { enableAffectiveDialog: config.enableAffectiveDialog } : {},
		...thinkingConfig ? { thinkingConfig } : {}
	};
}
function toGoogleModelResource(model) {
	return model.startsWith("models/") ? model : `models/${model}`;
}
function buildBrowserInitialSetup(model) {
	return { setup: {
		model: toGoogleModelResource(model),
		generationConfig: { responseModalities: [Modality.AUDIO] },
		inputAudioTranscription: {},
		outputAudioTranscription: {}
	} };
}
function parsePcmSampleRate(mimeType) {
	const match = mimeType?.match(/(?:^|[;,\s])rate=(\d+)/i);
	const parsed = match ? Number.parseInt(match[1] ?? "", 10) : NaN;
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 24e3;
}
function isMulawSilence(audio) {
	return audio.length > 0 && audio.every((sample) => sample === 255);
}
function isPcm16Silence(audio) {
	const samples = Math.floor(audio.length / 2);
	if (samples === 0) return false;
	for (let i = 0; i < samples; i += 1) if (audio.readInt16LE(i * 2) !== 0) return false;
	return true;
}
function formatGoogleLiveCloseEvent(event) {
	if (!event) return "code=unknown reason=unknown";
	return `code=${typeof event.code === "number" ? event.code : "unknown"} reason=${event.reason?.trim() || "none"}${typeof event.wasClean === "boolean" ? ` clean=${event.wasClean}` : ""}`;
}
var GoogleRealtimeVoiceBridge = class {
	constructor(config) {
		this.config = config;
		this.supportsToolResultSuppression = false;
		this.session = null;
		this.connected = false;
		this.setupCompleteReceived = false;
		this.sessionConfigured = false;
		this.intentionallyClosed = false;
		this.pendingAudio = createRealtimeVoiceAudioQueue("reject-newest");
		this.sessionReadyFired = false;
		this.consecutiveSilenceMs = 0;
		this.audioStreamEnded = false;
		this.responseInterrupted = false;
		this.pendingFunctionNames = /* @__PURE__ */ new Map();
		this.seenFunctionCallIds = /* @__PURE__ */ new Set();
		this.pendingToolResponses = [];
		this.pendingToolResponseBytes = 0;
		this.resumingSession = false;
		this.reconnectAttempts = 0;
		this.hasConnectedSession = false;
		this.continuityResetEmitted = false;
		this.closeNotified = false;
		this.pendingTranscripts = {
			user: {
				text: "",
				byteCount: 0
			},
			assistant: {
				text: "",
				byteCount: 0
			}
		};
		this.audioFormat = config.audioFormat ?? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ;
		this.model = config.model ?? "gemini-3.1-flash-live-preview";
		this.supportsToolResultContinuation = supportsAsyncFunctionCalling(this.model);
	}
	async connect() {
		if (this.terminalError) throw this.terminalError;
		if (this.session) return;
		if (this.connectAttempt) return this.connectAttempt.promise;
		let cancel = () => {};
		const cancelled = new Promise((resolve) => {
			cancel = resolve;
		});
		const attempt = {
			promise: cancelled,
			cancel
		};
		this.connectionOwner = attempt;
		this.connectAttempt = attempt;
		const connection = this.connectOwned(attempt);
		attempt.promise = Promise.race([connection, cancelled]).finally(() => {
			if (this.connectAttempt === attempt) this.connectAttempt = void 0;
		});
		return attempt.promise;
	}
	async connectOwned(attempt) {
		this.intentionallyClosed = false;
		this.closeNotified = false;
		this.setupCompleteReceived = false;
		this.sessionConfigured = false;
		this.sessionReadyFired = false;
		this.consecutiveSilenceMs = 0;
		this.audioStreamEnded = false;
		const resumesExistingSession = this.config.sessionResumption !== false && Boolean(this.resumptionHandle);
		this.resumingSession = resumesExistingSession;
		if (!resumesExistingSession) {
			this.responseInterrupted = false;
			this.resetToolCallOwnership();
		}
		const ai = createGoogleGenAI({
			apiKey: this.config.apiKey,
			httpOptions: { apiVersion: this.config.apiVersion ?? GOOGLE_REALTIME_DEFAULT_API_VERSION }
		});
		try {
			const session = await ai.live.connect({
				model: this.model,
				config: {
					...buildGoogleLiveConnectConfig(this.config, this.model),
					...this.config.sessionResumption === false ? {} : { sessionResumption: this.resumptionHandle ? { handle: this.resumptionHandle } : {} },
					...this.config.contextWindowCompression === false ? {} : { contextWindowCompression: { slidingWindow: {} } }
				},
				callbacks: {
					onopen: () => {
						if (this.connectionOwner !== attempt) return;
						this.connected = true;
						this.maybeActivateSession();
					},
					onmessage: (message) => {
						if (this.connectionOwner !== attempt) return;
						this.handleMessage(message);
					},
					onerror: (event) => {
						if (this.connectionOwner !== attempt) return;
						const error = event.error instanceof Error ? event.error : new Error(typeof event.message === "string" ? event.message : "Google Live API error");
						this.config.onError?.(error);
					},
					onclose: (event) => {
						if (this.connectionOwner !== attempt) return;
						this.connectionOwner = void 0;
						this.cancelConnectAttempt(attempt);
						this.connected = false;
						this.setupCompleteReceived = false;
						this.sessionConfigured = false;
						this.session = null;
						if (this.terminalError) {
							this.notifyClose("error");
							return;
						}
						if (this.intentionallyClosed) {
							this.notifyClose("completed");
							return;
						}
						const closeDetails = formatGoogleLiveCloseEvent(event);
						if (this.scheduleReconnect(closeDetails)) return;
						this.resetToolCallOwnership();
						this.flushPendingTranscripts();
						this.config.onError?.(/* @__PURE__ */ new Error(`Google Live session closed after reconnect attempts: ${closeDetails}`));
						this.notifyClose("error");
					}
				}
			});
			if (this.connectionOwner !== attempt) {
				session.close();
				return;
			}
			this.session = session;
			this.hasConnectedSession = true;
			this.maybeActivateSession();
		} catch (error) {
			if (this.connectionOwner === attempt) {
				this.connectionOwner = void 0;
				this.connected = false;
				this.setupCompleteReceived = false;
				this.sessionConfigured = false;
				const session = this.session;
				this.session = null;
				session?.close();
			}
			throw error;
		}
	}
	sendAudio(audio) {
		if (this.terminalError || this.intentionallyClosed || this.closeNotified) return;
		if (!this.session || !this.connected || !this.sessionConfigured) {
			this.pendingAudio.enqueue(audio);
			return;
		}
		const silent = this.isSilence(audio);
		if (silent && this.audioStreamEnded) return;
		if (!silent) {
			this.consecutiveSilenceMs = 0;
			this.audioStreamEnded = false;
		}
		const pcm16k = this.toGoogleInputPcm16k(audio);
		this.session.sendRealtimeInput({ audio: {
			data: pcm16k.toString("base64"),
			mimeType: `audio/pcm;rate=${GOOGLE_REALTIME_INPUT_SAMPLE_RATE}`
		} });
		if (!silent) return;
		const silenceThresholdMs = typeof this.config.silenceDurationMs === "number" ? Math.max(0, Math.floor(this.config.silenceDurationMs)) : DEFAULT_AUDIO_STREAM_END_SILENCE_MS;
		this.consecutiveSilenceMs += Math.round(realtimeVoiceAudioDurationMs(this.audioFormat, audio.length));
		if (!this.audioStreamEnded && this.consecutiveSilenceMs >= silenceThresholdMs) {
			this.session.sendRealtimeInput({ audioStreamEnd: true });
			this.audioStreamEnded = true;
		}
	}
	setMediaTimestamp(_ts) {}
	sendUserMessage(text) {
		const normalized = text.trim();
		if (!normalized || !this.session || !this.connected || !this.sessionConfigured) return;
		if (isGemini31LiveModel(this.model)) {
			this.session.sendRealtimeInput({ text: normalized });
			return;
		}
		this.session.sendClientContent({
			turns: [{
				role: "user",
				parts: [{ text: normalized }]
			}],
			turnComplete: true
		});
	}
	triggerGreeting(instructions) {
		const greetingPrompt = instructions?.trim() || "Start the call now. Greet the caller naturally and keep it brief.";
		this.sendUserMessage(greetingPrompt);
	}
	rejectToolResult(error) {
		this.config.onError?.(error);
		throw error;
	}
	submitToolResult(callId, result, options) {
		const name = this.pendingFunctionNames.get(callId);
		if (!name) {
			if (this.seenFunctionCallIds.has(callId)) return;
			this.rejectToolResult(/* @__PURE__ */ new Error(`Google Live function response is missing a matching function call for ${callId}`));
		}
		const isConsultTool = name === REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME;
		if (options?.willContinue === true && !this.supportsToolResultContinuation) this.rejectToolResult(/* @__PURE__ */ new Error(`Google Live model ${this.model} does not support continuing tool responses`));
		const wrapsResult = !result || typeof result !== "object" || Array.isArray(result);
		const functionResponse = {
			id: callId,
			name,
			response: wrapsResult ? { output: result } : result
		};
		if (isConsultTool && this.supportsToolResultContinuation) {
			functionResponse.scheduling = FunctionResponseScheduling.WHEN_IDLE;
			if (options?.willContinue === true) functionResponse.willContinue = true;
		} else if (options?.willContinue === true) this.rejectToolResult(/* @__PURE__ */ new Error(`Google Live continuation is only supported for ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME}`));
		let serializedResponse;
		let normalizedResponse;
		try {
			serializedResponse = JSON.stringify(functionResponse);
			normalizedResponse = JSON.parse(serializedResponse);
			if (!isRecord(normalizedResponse.response) || wrapsResult && !Object.hasOwn(normalizedResponse.response, "output")) throw new Error("Google Live function response is missing required JSON output");
		} catch (cause) {
			this.rejectToolResult(new Error("Google Live function response result is not JSON-serializable", { cause }));
		}
		try {
			const session = this.session;
			const canSendImmediately = Boolean(session && (!this.resumingSession || this.sessionConfigured));
			if (session && canSendImmediately) session.sendToolResponse({ functionResponses: [normalizedResponse] });
			else this.queueToolResponseForReconnect(callId, serializedResponse);
			if (options?.willContinue !== true) this.pendingFunctionNames.delete(callId);
		} catch (error) {
			const sendError = error instanceof Error ? error : /* @__PURE__ */ new Error("Failed to send Google Live function response");
			if (this.session && (!this.resumingSession || this.sessionConfigured)) this.config.onError?.(sendError);
			else this.failConnection(sendError);
			throw sendError;
		}
	}
	acknowledgeMark(_markName) {}
	close() {
		const hadConnection = Boolean(this.connectionOwner || this.connectAttempt || this.session || this.reconnectTimer);
		this.intentionallyClosed = true;
		this.connected = false;
		this.setupCompleteReceived = false;
		this.sessionConfigured = false;
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = void 0;
		}
		this.clearPendingAudio();
		this.consecutiveSilenceMs = 0;
		this.audioStreamEnded = false;
		this.resetToolCallOwnership();
		this.flushPendingTranscripts();
		const owner = this.connectionOwner;
		this.connectionOwner = void 0;
		this.cancelConnectAttempt(owner);
		const session = this.session;
		this.session = null;
		session?.close();
		if (hadConnection) this.notifyClose("completed");
	}
	isConnected() {
		return this.connected && this.sessionConfigured;
	}
	isSilence(audio) {
		return this.audioFormat.encoding === "pcm16" ? isPcm16Silence(audio) : isMulawSilence(audio);
	}
	toInputPcm(audio) {
		return this.audioFormat.encoding === "pcm16" ? audio : mulawToPcm(audio);
	}
	toGoogleInputPcm16k(audio) {
		if (this.audioFormat.encoding === "g711_ulaw" && this.audioFormat.sampleRateHz === 8e3 && true) return convertMulaw8kToPcm16k(audio);
		return resamplePcm(this.toInputPcm(audio), this.audioFormat.sampleRateHz, GOOGLE_REALTIME_INPUT_SAMPLE_RATE);
	}
	toOutputAudio(pcm, sampleRate) {
		return this.audioFormat.encoding === "pcm16" ? resamplePcm(pcm, sampleRate, this.audioFormat.sampleRateHz) : convertPcmToMulaw8k(pcm, sampleRate);
	}
	handleMessage(message) {
		const owner = this.connectionOwner;
		this.captureSessionLifecycle(message);
		if (message.setupComplete) this.handleSetupComplete();
		if (message.serverContent) {
			this.handleServerContent(message.serverContent);
			if (this.connectionOwner !== owner) return;
		}
		if (message.toolCall) this.handleToolCall(message.toolCall);
		if (message.toolCallCancellation) this.handleToolCallCancellation(message.toolCallCancellation.ids);
		if (message.setupComplete) this.maybeActivateSession();
	}
	captureSessionLifecycle(message) {
		const raw = message;
		const update = raw.sessionResumptionUpdate;
		if (update?.resumable === false) this.resumptionHandle = void 0;
		else if (update?.resumable && update.newHandle) this.resumptionHandle = update.newHandle;
		if (raw.goAway?.timeLeft) this.config.onError?.(/* @__PURE__ */ new Error(`Google Live session goAway: ${raw.goAway.timeLeft}`));
	}
	handleSetupComplete() {
		if (!this.setupCompleteReceived) {
			if (this.continuityResetEmitted) this.config.onEvent?.({
				direction: "server",
				type: "session.created"
			});
			this.continuityResetEmitted = false;
		}
		this.setupCompleteReceived = true;
	}
	maybeActivateSession() {
		if (this.sessionConfigured || !this.connected || !this.setupCompleteReceived || !this.session) return;
		this.sessionConfigured = true;
		this.reconnectAttempts = 0;
		if (!this.flushPendingToolResponses()) return;
		this.resumingSession = false;
		for (const chunk of this.pendingAudio.drain()) this.sendAudio(chunk);
		if (!this.sessionReadyFired) {
			this.sessionReadyFired = true;
			this.config.onReady?.();
		}
	}
	handleServerContent(content) {
		const owner = this.connectionOwner;
		if (content.interrupted) {
			this.responseInterrupted = true;
			this.config.onClearAudio("barge-in");
			if (this.connectionOwner !== owner) return;
		}
		if (content.inputTranscription) {
			if (!this.appendTranscript("user", content.inputTranscription)) return;
		}
		if (content.outputTranscription) {
			if (!this.appendTranscript("assistant", content.outputTranscription)) return;
		}
		for (const part of content.modelTurn?.parts ?? []) if (part.inlineData?.data) {
			const canonicalAudio = canonicalizeGoogleProviderBase64(part.inlineData.data);
			if (!canonicalAudio) {
				this.failConnection(/* @__PURE__ */ new Error("Google Live stream returned malformed base64 audio data"));
				return;
			}
			const pcm = Buffer.from(canonicalAudio, "base64");
			const sampleRate = parsePcmSampleRate(part.inlineData.mimeType);
			const audio = this.toOutputAudio(pcm, sampleRate);
			if (audio.length > 0) {
				this.config.onAudio(audio);
				if (this.connectionOwner !== owner) return;
				this.config.onMark?.(`audio-${randomUUID()}`);
				if (this.connectionOwner !== owner) return;
			}
			continue;
		}
		if (content.generationComplete || content.interrupted || content.turnComplete) this.flushPendingTranscript("assistant");
		if (content.turnComplete && this.connectionOwner === owner) {
			const status = this.responseInterrupted ? "cancelled" : "completed";
			this.responseInterrupted = false;
			this.config.onResponseDone?.({ status });
		}
	}
	appendTranscript(role, transcript) {
		const owner = this.connectionOwner;
		const completeInput = role === "user" && isGemini31LiveModel(this.model);
		const text = transcript.text;
		if (text) {
			const pending = this.pendingTranscripts[role];
			const textBytes = Buffer.byteLength(text, "utf8");
			if (pending.byteCount + textBytes > GOOGLE_REALTIME_MAX_PENDING_TRANSCRIPT_BYTES) {
				this.resetPendingTranscripts();
				this.failConnection(/* @__PURE__ */ new Error(GOOGLE_REALTIME_TRANSCRIPT_OVERFLOW_MESSAGE));
				return false;
			}
			pending.text += text;
			pending.byteCount += textBytes;
			if (!completeInput) {
				this.emitTranscript(role, text, false);
				if (this.connectionOwner !== owner) return false;
			}
		}
		if (transcript.finished || completeInput) this.flushPendingTranscript(role);
		return this.connectionOwner === owner;
	}
	flushPendingTranscript(role) {
		const pending = this.pendingTranscripts[role];
		const completeText = pending.text.trim();
		pending.text = "";
		pending.byteCount = 0;
		if (completeText) this.emitTranscript(role, completeText, true);
	}
	emitTranscript(role, text, isFinal) {
		try {
			this.config.onTranscript?.(role, text, isFinal);
		} catch (error) {
			try {
				this.config.onError?.(error instanceof Error ? error : /* @__PURE__ */ new Error("Google Live transcript callback failed"));
			} catch {}
		}
	}
	flushPendingTranscripts() {
		this.flushPendingTranscript("user");
		this.flushPendingTranscript("assistant");
	}
	resetPendingTranscripts() {
		this.responseInterrupted = false;
		this.pendingTranscripts.user = {
			text: "",
			byteCount: 0
		};
		this.pendingTranscripts.assistant = {
			text: "",
			byteCount: 0
		};
	}
	failConnection(error) {
		if (this.terminalError) return;
		this.terminalError = error;
		this.intentionallyClosed = true;
		this.connected = false;
		this.setupCompleteReceived = false;
		this.sessionConfigured = false;
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = void 0;
		}
		this.resetToolCallOwnership();
		this.flushPendingTranscripts();
		const owner = this.connectionOwner;
		this.connectionOwner = void 0;
		this.cancelConnectAttempt(owner);
		const session = this.session;
		this.session = null;
		try {
			this.config.onError?.(error);
		} finally {
			try {
				session?.close();
			} finally {
				this.notifyClose("error");
			}
		}
	}
	notifyClose(reason) {
		if (this.closeNotified) return;
		this.clearPendingAudio();
		this.responseInterrupted = false;
		this.closeNotified = true;
		this.config.onClose?.(reason);
	}
	clearPendingAudio() {
		this.pendingAudio.clear();
	}
	cancelConnectAttempt(attempt) {
		if (!attempt) return;
		if (this.connectAttempt === attempt) this.connectAttempt = void 0;
		attempt.cancel();
	}
	handleToolCall(toolCall) {
		for (const call of toolCall.functionCalls ?? []) {
			const name = call.name?.trim();
			if (!name) continue;
			const callId = call.id?.trim() || `google-live-${randomUUID()}`;
			if (this.seenFunctionCallIds.has(callId)) continue;
			if (this.seenFunctionCallIds.size >= GOOGLE_REALTIME_MAX_TOOL_CALL_IDS) {
				this.failConnection(/* @__PURE__ */ new Error("Google Live tool-call session limit exceeded"));
				return;
			}
			this.seenFunctionCallIds.add(callId);
			this.pendingFunctionNames.set(callId, name);
			this.config.onToolCall?.({
				itemId: callId,
				callId,
				name,
				args: call.args ?? {}
			});
		}
	}
	handleToolCallCancellation(ids) {
		for (const rawId of ids ?? []) {
			const callId = rawId.trim();
			if (!callId) continue;
			const removedPendingCall = this.pendingFunctionNames.delete(callId);
			const removedQueuedResponse = this.removePendingToolResponses(callId);
			if (!removedPendingCall && !removedQueuedResponse) continue;
			this.config.onEvent?.({
				direction: "server",
				type: "tool.call.cancelled",
				itemId: callId
			});
		}
	}
	resetToolCallOwnership() {
		this.pendingFunctionNames.clear();
		this.seenFunctionCallIds.clear();
		this.pendingToolResponses = [];
		this.pendingToolResponseBytes = 0;
	}
	queueToolResponseForReconnect(callId, payload) {
		const payloadBytes = Buffer.byteLength(payload, "utf8");
		if (this.pendingToolResponses.length >= GOOGLE_REALTIME_MAX_PENDING_TOOL_RESPONSES || this.pendingToolResponseBytes + payloadBytes > GOOGLE_REALTIME_MAX_PENDING_TOOL_RESPONSE_BYTES) throw new Error("Google Live reconnect tool-response buffer limit exceeded");
		this.pendingToolResponses.push({
			callId,
			payload,
			byteLength: payloadBytes
		});
		this.pendingToolResponseBytes += payloadBytes;
	}
	removePendingToolResponses(callId) {
		const retained = [];
		let removed = false;
		for (const response of this.pendingToolResponses) if (response.callId === callId) {
			this.pendingToolResponseBytes -= response.byteLength;
			removed = true;
		} else retained.push(response);
		this.pendingToolResponses = retained;
		return removed;
	}
	flushPendingToolResponses() {
		const session = this.session;
		if (!session) return false;
		try {
			while (this.pendingToolResponses.length > 0) {
				const response = this.pendingToolResponses[0];
				if (!response) break;
				session.sendToolResponse({ functionResponses: [JSON.parse(response.payload)] });
				this.pendingToolResponses.shift();
				this.pendingToolResponseBytes -= response.byteLength;
			}
			return true;
		} catch (error) {
			this.failConnection(error instanceof Error ? error : /* @__PURE__ */ new Error("Failed to flush Google Live function responses"));
			return false;
		}
	}
	scheduleReconnect(closeDetails) {
		if (this.reconnectAttempts >= GOOGLE_REALTIME_RECONNECT_MAX_ATTEMPTS) return false;
		const canResumeSession = this.config.sessionResumption !== false && Boolean(this.resumptionHandle);
		if (this.hasConnectedSession && !canResumeSession && !this.continuityResetEmitted) {
			this.continuityResetEmitted = true;
			this.resetPendingTranscripts();
			this.resetToolCallOwnership();
			this.config.onEvent?.({
				direction: "client",
				type: "session.continuity.reset"
			});
		}
		const attempt = ++this.reconnectAttempts;
		const delayMs = Math.min(GOOGLE_REALTIME_RECONNECT_MAX_DELAY_MS, GOOGLE_REALTIME_RECONNECT_BASE_DELAY_MS * 2 ** (attempt - 1));
		this.config.onError?.(/* @__PURE__ */ new Error(`Google Live session closed unexpectedly (${closeDetails}); reconnecting ${attempt}/${GOOGLE_REALTIME_RECONNECT_MAX_ATTEMPTS} in ${delayMs}ms`));
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = void 0;
			if (this.intentionallyClosed) return;
			this.connect().catch((error) => {
				const message = error instanceof Error ? error.message : String(error);
				this.config.onError?.(error instanceof Error ? error : new Error(message));
				if (!this.scheduleReconnect(`connect failed: ${message}`)) {
					this.resetToolCallOwnership();
					this.flushPendingTranscripts();
					this.notifyClose("error");
				}
			});
		}, delayMs);
		return true;
	}
};
function convertMulaw8kToPcm16k(muLaw) {
	if (muLaw.length === 0) return Buffer.alloc(0);
	const pcm = Buffer.alloc(muLaw.length * 4);
	for (let i = 0; i < muLaw.length; i += 1) {
		const current = MULAW_LINEAR_SAMPLES[muLaw[i] ?? 0] ?? 0;
		const next = MULAW_LINEAR_SAMPLES[muLaw[i + 1] ?? muLaw[i] ?? 0] ?? current;
		pcm.writeInt16LE(current, i * 4);
		pcm.writeInt16LE(Math.round((current + next) / 2), i * 4 + 2);
	}
	return pcm;
}
function decodeMulawSample(value) {
	const muLaw = ~value & 255;
	const sign = muLaw & 128;
	const exponent = muLaw >> 4 & 7;
	let sample = ((muLaw & 15) << 3) + 132 << exponent;
	sample -= 132;
	return sign ? -sample : sample;
}
async function createGoogleRealtimeBrowserSession(req) {
	const providerConfig = normalizeProviderConfig(req.providerConfig);
	const prefixPaddingMs = asNonNegativeInteger(req.prefixPaddingMs);
	const silenceDurationMs = asNonNegativeInteger(req.silenceDurationMs);
	const config = {
		...providerConfig,
		...prefixPaddingMs !== void 0 ? { prefixPaddingMs } : {},
		...silenceDurationMs !== void 0 ? { silenceDurationMs } : {}
	};
	const apiKey = config.apiKey || resolveEnvApiKey();
	if (!apiKey) throw new Error("Google Gemini API key missing");
	const model = req.model ?? config.model ?? "gemini-3.1-flash-live-preview";
	const voice = req.voice ?? config.voice ?? GOOGLE_REALTIME_DEFAULT_VOICE;
	const nowMs = Date.now();
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(GOOGLE_REALTIME_BROWSER_SESSION_TTL_MS, { nowMs });
	const newSessionExpiresAtMs = resolveExpiresAtMsFromDurationMs(GOOGLE_REALTIME_BROWSER_NEW_SESSION_TTL_MS, { nowMs });
	const expireTime = timestampMsToIsoString(expiresAtMs);
	const newSessionExpireTime = timestampMsToIsoString(newSessionExpiresAtMs);
	if (expiresAtMs === void 0 || !expireTime || !newSessionExpireTime) throw new Error("Google realtime browser session expiry is outside the supported Date range");
	const clientSecret = (await createGoogleGenAI({
		apiKey,
		httpOptions: {
			apiVersion: GOOGLE_REALTIME_BROWSER_API_VERSION,
			timeout: 3e4
		}
	}).authTokens.create({ config: {
		uses: 1,
		expireTime,
		newSessionExpireTime,
		liveConnectConstraints: {
			model,
			config: buildGoogleLiveConnectConfig({
				...config,
				apiKey,
				model,
				voice,
				instructions: req.instructions,
				tools: req.tools
			}, model)
		}
	} })).name?.trim();
	if (!clientSecret) throw new Error("Google Live browser session did not return an ephemeral token");
	return {
		provider: "google",
		transport: "provider-websocket",
		protocol: "google-live-bidi",
		clientSecret,
		websocketUrl: GOOGLE_REALTIME_BROWSER_WEBSOCKET_URL,
		audio: {
			inputEncoding: "pcm16",
			inputSampleRateHz: GOOGLE_REALTIME_INPUT_SAMPLE_RATE,
			outputEncoding: "pcm16",
			outputSampleRateHz: 24e3
		},
		initialMessage: buildBrowserInitialSetup(model),
		model,
		voice,
		expiresAt: newSessionExpiresAtMs
	};
}
function buildGoogleRealtimeVoiceProvider() {
	return {
		...GOOGLE_REALTIME_VOICE_METADATA,
		capabilities: {
			transports: ["provider-websocket", "gateway-relay"],
			inputAudioFormats: [REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ],
			outputAudioFormats: [REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ],
			supportsBrowserSession: true,
			supportsBargeIn: true,
			handlesInputAudioBargeIn: true,
			supportsToolCalls: true,
			supportsVideoFrames: true,
			supportsSessionResumption: true
		},
		resolveConfig: ({ cfg, rawConfig }) => normalizeProviderConfig(rawConfig, cfg),
		isConfigured: ({ providerConfig }) => Boolean(normalizeProviderConfig(providerConfig).apiKey || resolveEnvApiKey()),
		createBridge: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			const apiKey = config.apiKey || resolveEnvApiKey();
			if (!apiKey) throw new Error("Google Gemini API key missing");
			return new GoogleRealtimeVoiceBridge({
				...req,
				...config,
				apiKey
			});
		},
		createBrowserSession: createGoogleRealtimeBrowserSession
	};
}
//#endregion
export { buildGoogleRealtimeVoiceProvider };
