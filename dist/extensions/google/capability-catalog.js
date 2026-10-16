import { n as resolveGoogleEnvApiKey } from "./.setup/gemini-auth-C4siUxjy.mjs";
import { n as GOOGLE_REALTIME_VOICE_METADATA, r as GOOGLE_PREBUILT_VOICES } from "./.setup/realtime-voice-metadata-Av6ZDzmC.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { createRealtimeVoiceAudioQueue } from "openclaw/plugin-sdk/realtime-voice-audio-queue";
import { createLazyRealtimeVoiceBridgeLifecycle } from "openclaw/plugin-sdk/realtime-voice-provider";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { retryAsync } from "openclaw/plugin-sdk/speech-provider";
//#region extensions/google/realtime-voice-lazy.ts
const loadGoogleRealtimeVoiceProvider = createLazyRuntimeSurface(() => import("./.setup/realtime-voice-provider-Idd2T347.mjs"), (mod) => mod.buildGoogleRealtimeVoiceProvider());
function resolveGoogleRealtimeProviderConfig(rawConfig, cfg) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.google) ?? asOptionalRecord(rawConfig.google) ?? rawConfig;
	return {
		...raw,
		...raw.apiKey === void 0 ? cfg?.models?.providers?.google?.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
			value: cfg.models.providers.google.apiKey,
			path: "models.providers.google.apiKey"
		}) } : { apiKey: normalizeResolvedSecretInputString({
			value: raw.apiKey,
			path: "plugins.entries.voice-call.config.realtime.providers.google.apiKey"
		}) }
	};
}
const GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGES = 128;
const GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGE_BYTES = 262144;
function createLazyGoogleRealtimeVoiceBridge(req) {
	let bridgeReady = false;
	let latestMediaTimestamp;
	let pendingGreeting;
	const pendingAudio = createRealtimeVoiceAudioQueue("drop-oldest");
	const pendingUserMessages = [];
	let pendingUserMessageBytes = 0;
	const lifecycle = createLazyRealtimeVoiceBridgeLifecycle({
		label: "Google",
		request: req,
		load: async (request) => (await loadGoogleRealtimeVoiceProvider()).createBridge(request),
		clearPending: () => {
			bridgeReady = false;
			pendingAudio.clear();
			pendingUserMessages.length = 0;
			pendingUserMessageBytes = 0;
			pendingGreeting = void 0;
			latestMediaTimestamp = void 0;
		},
		onProviderReady: (bridge) => {
			if (bridge) {
				bridgeReady = true;
				flushPending(bridge);
			}
		}
	});
	const requireBridge = () => {
		const bridge = lifecycle.bridge;
		if (!bridge) throw new Error("Google realtime voice bridge is not connected");
		return bridge;
	};
	const flushPending = (loadedBridge) => {
		if (!lifecycle.isActive()) return;
		if (typeof latestMediaTimestamp === "number") loadedBridge.setMediaTimestamp(latestMediaTimestamp);
		for (const audio of pendingAudio.drain()) loadedBridge.sendAudio(audio);
		const userMessages = pendingUserMessages.splice(0);
		pendingUserMessageBytes = 0;
		for (const text of userMessages) loadedBridge.sendUserMessage?.(text);
		if (pendingGreeting !== void 0) {
			const greeting = pendingGreeting;
			pendingGreeting = void 0;
			loadedBridge.triggerGreeting?.(greeting);
		}
	};
	return {
		get supportsToolResultContinuation() {
			return lifecycle.bridge?.supportsToolResultContinuation ?? false;
		},
		supportsToolResultSuppression: false,
		connect: lifecycle.connect,
		sendAudio: (audio) => {
			if (!lifecycle.isActive()) return;
			const bridge = lifecycle.bridge;
			if (bridgeReady && bridge) {
				bridge.sendAudio(audio);
				return;
			}
			pendingAudio.enqueue(audio);
		},
		setMediaTimestamp: (ts) => {
			if (!lifecycle.isActive()) return;
			latestMediaTimestamp = ts;
			lifecycle.bridge?.setMediaTimestamp(ts);
		},
		sendUserMessage: (text) => {
			if (!lifecycle.isActive()) return;
			const bridge = lifecycle.bridge;
			if (bridgeReady && bridge) {
				bridge.sendUserMessage?.(text);
				return;
			}
			const messageBytes = Buffer.byteLength(text, "utf8");
			if (pendingUserMessages.length >= GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGES || pendingUserMessageBytes + messageBytes > GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGE_BYTES) {
				req.onError?.(/* @__PURE__ */ new Error("Google realtime voice pending user message queue overflow during startup"));
				return;
			}
			pendingUserMessages.push(text);
			pendingUserMessageBytes += messageBytes;
		},
		triggerGreeting: (instructions) => {
			if (!lifecycle.isActive()) return;
			const bridge = lifecycle.bridge;
			if (bridgeReady && bridge) {
				bridge.triggerGreeting?.(instructions);
				return;
			}
			pendingGreeting = instructions;
		},
		handleBargeIn: (options) => {
			if (lifecycle.isActive()) requireBridge().handleBargeIn?.(options);
		},
		submitToolResult: (callId, result, options) => {
			if (!lifecycle.isActive()) return;
			return requireBridge().submitToolResult(callId, result, options);
		},
		acknowledgeMark: () => {
			if (lifecycle.isActive()) requireBridge().acknowledgeMark();
		},
		close: lifecycle.close,
		isConnected: () => lifecycle.isActive() && (lifecycle.bridge?.isConnected() ?? false)
	};
}
function createLazyGoogleRealtimeVoiceProvider() {
	return {
		...GOOGLE_REALTIME_VOICE_METADATA,
		resolveConfig: ({ cfg, rawConfig }) => resolveGoogleRealtimeProviderConfig(rawConfig, cfg),
		isConfigured: ({ cfg, providerConfig }) => Boolean(normalizeOptionalString(providerConfig.apiKey) ?? normalizeOptionalString(cfg?.models?.providers?.google?.apiKey) ?? resolveGoogleEnvApiKey()),
		createBridge: createLazyGoogleRealtimeVoiceBridge,
		createBrowserSession: async (req) => {
			const provider = await loadGoogleRealtimeVoiceProvider();
			if (!provider.createBrowserSession) throw new Error("Google realtime voice browser sessions are unavailable");
			return await provider.createBrowserSession(req);
		}
	};
}
//#endregion
//#region extensions/google/speech-models.ts
const DEFAULT_GOOGLE_TTS_MODEL = "gemini-3.1-flash-tts-preview";
const DEFAULT_GOOGLE_TTS_VOICE = "Kore";
const GOOGLE_TTS_SAMPLE_RATE = 24e3;
const GOOGLE_TTS_INTERACTIONS_MODELS = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"];
const GOOGLE_TTS_GENERATE_CONTENT_MODELS = [
	"gemini-3.1-flash-tts-preview",
	"gemini-2.5-flash-preview-tts",
	"gemini-2.5-pro-preview-tts"
];
const GOOGLE_TTS_MODELS = [...GOOGLE_TTS_INTERACTIONS_MODELS, ...GOOGLE_TTS_GENERATE_CONTENT_MODELS];
const GOOGLE_TTS_MODEL_ALIASES = { "gemini-3.1-flash-tts": "gemini-3.1-flash-tts-preview" };
function normalizeGoogleTtsModel(model) {
	const trimmed = normalizeOptionalString(model);
	if (!trimmed) return DEFAULT_GOOGLE_TTS_MODEL;
	const withoutProvider = trimmed.startsWith("google/") ? trimmed.slice(7) : trimmed;
	return GOOGLE_TTS_MODEL_ALIASES[withoutProvider] ?? withoutProvider;
}
function isGoogleInteractionsTtsModel(model) {
	return GOOGLE_TTS_INTERACTIONS_MODELS.some((candidate) => candidate === model);
}
function assertSupportedGoogleTtsModel(model) {
	if (isGoogleInteractionsTtsModel(model)) return;
	if (model.includes("gemini-3.8-") && model.includes("-tts")) throw new Error(`Google TTS model ${model} is not supported. OpenClaw sends Gemini 3.8 TTS through the Interactions API; supported models: ${GOOGLE_TTS_INTERACTIONS_MODELS.join(", ")}.`);
}
function normalizeGoogleTtsVoiceName(voiceName) {
	return normalizeOptionalString(voiceName) ?? DEFAULT_GOOGLE_TTS_VOICE;
}
function normalizeGooglePromptTemplate(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (trimmed === "audio-profile-v1") return trimmed;
	throw new Error(`Invalid Google TTS promptTemplate: ${trimmed}`);
}
//#endregion
//#region extensions/google/speech-dialogue.ts
function readGoogleTtsSpeakers(value) {
	if (value == null) return;
	if (!Array.isArray(value)) throw new Error("Google TTS speakers must be an array of exactly two { speaker, voice } entries.");
	const speakers = value.map((entry, index) => {
		const record = asOptionalRecord(entry);
		const speaker = normalizeOptionalString(record?.speaker ?? record?.name);
		const voice = normalizeOptionalString(record?.voice ?? record?.voiceName);
		const style = normalizeOptionalString(record?.style);
		if (!speaker || !voice) throw new Error(`Google TTS speakers[${index}] needs a speaker name and a voice.`);
		return {
			speaker,
			voice,
			...style ? { style } : {}
		};
	});
	if (speakers.length !== 2) throw new Error("Google TTS multi-speaker requires exactly two speakers.");
	if (new Set(speakers.map((speaker) => speaker.speaker)).size !== 2) throw new Error("Google TTS speakers must use two different speaker names.");
	return speakers;
}
function splitGoogleTtsDialogue(text, speakers) {
	const names = new Set(speakers.map((speaker) => speaker.speaker));
	const turns = [];
	const lead = [];
	for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const labeled = /^([^:\n]{1,80}):([\s\S]*)$/u.exec(trimmed);
		const speaker = labeled?.[1]?.trim();
		if (labeled && speaker && names.has(speaker)) {
			const spoken = labeled[2]?.trim();
			if (!spoken) continue;
			if (turns.length === 0 && lead.length > 0) turns.push({
				speaker,
				text: lead.splice(0).join(" ")
			});
			const previous = turns.at(-1);
			if (previous?.speaker === speaker) previous.text = `${previous.text} ${spoken}`;
			else turns.push({
				speaker,
				text: spoken
			});
			continue;
		}
		const previous = turns.at(-1);
		if (previous) previous.text = `${previous.text} ${trimmed}`;
		else lead.push(trimmed);
	}
	if (turns.length === 0) return;
	return turns;
}
function composeGoogleInteractionsSpeechStyle(parts) {
	return parts.map((part) => normalizeOptionalString(part)).filter((part) => part !== void 0).join("\n\n") || void 0;
}
function buildGoogleInteractionsTtsBody(params) {
	const dialogue = params.speakers ? splitGoogleTtsDialogue(params.text, params.speakers) : void 0;
	let content;
	if (dialogue) content = dialogue.map((turn) => {
		const cast = params.speakers?.find((speaker) => speaker.speaker === turn.speaker);
		const style = composeGoogleInteractionsSpeechStyle([
			cast?.style,
			params.audioProfile,
			params.personaPrompt
		]);
		return {
			type: "text",
			text: turn.text,
			annotations: [{
				type: "speech_metadata",
				speaker: turn.speaker,
				...style ? { style } : {}
			}]
		};
	});
	else {
		const style = composeGoogleInteractionsSpeechStyle([params.audioProfile, params.personaPrompt]);
		const speaker = normalizeOptionalString(params.speakerName);
		const textBlock = {
			type: "text",
			text: params.text
		};
		if (style || speaker) textBlock.annotations = [{
			type: "speech_metadata",
			...speaker ? { speaker } : {},
			...style ? { style } : {}
		}];
		content = [textBlock];
	}
	return {
		model: params.model,
		store: false,
		input: [{
			type: "user_input",
			content
		}],
		response_format: {
			type: "audio",
			mime_type: "audio/l16",
			sample_rate: GOOGLE_TTS_SAMPLE_RATE
		},
		generation_config: dialogue ? { speech_config: {
			mode: "conversational",
			speakers: params.speakers?.map((speaker) => ({
				speaker: speaker.speaker,
				voice: speaker.voice
			}))
		} } : { speech_config: [{ voice: params.voiceName }] }
	};
}
//#endregion
//#region extensions/google/speech-synthesis.ts
const GOOGLE_TTS_CHANNELS = 1;
const GOOGLE_TTS_BITS_PER_SAMPLE = 16;
var GoogleTtsRetryableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GoogleTtsRetryableError";
	}
};
function isGoogleTtsRetryableError(err) {
	if (err instanceof GoogleTtsRetryableError) return true;
	if (!(err instanceof Error)) return false;
	if (err.name === "AbortError") return true;
	const message = err.message.toLowerCase();
	return message.includes("aborted") || message.includes("timeout") || message.includes("fetch failed") || message.includes("network");
}
function composeGoogleTtsText(params) {
	return [
		normalizeOptionalString(params.audioProfile),
		normalizeOptionalString(params.speakerName) ? `Speaker name: ${params.speakerName}` : void 0,
		params.text
	].filter((part) => part !== void 0).join("\n\n");
}
function normalizePromptSectionText(value) {
	const trimmed = normalizeOptionalString(value?.replace(/\r\n?/g, "\n"));
	if (!trimmed) return;
	return trimmed.replace(/\p{Cc}/gu, (char) => "	\n\r".includes(char) || char.charCodeAt(0) > 127 ? char : "");
}
function isOpenClawGoogleAudioProfilePrompt(text) {
	return text.includes("# AUDIO PROFILE:") && text.includes("### TRANSCRIPT") && text.startsWith("Synthesize speech from the TRANSCRIPT section only.");
}
function renderGoogleAudioProfilePrompt(params) {
	const transcript = params.text.replace(/\r\n?/g, "\n").trim();
	const personaPrompt = normalizePromptSectionText(params.personaPrompt);
	const label = normalizePromptSectionText(params.persona?.label) ?? normalizePromptSectionText(params.persona?.id);
	const sections = [[
		"Synthesize speech from the TRANSCRIPT section only. Use the other sections only",
		"as performance direction. Do not read section titles, notes, labels, or",
		"configuration aloud."
	].join("\n")];
	if (label) sections.push(`# AUDIO PROFILE: ${label}`);
	if (personaPrompt) sections.push([
		"### DIRECTOR'S NOTES",
		"Provider notes:",
		personaPrompt
	].join("\n"));
	sections.push(["### TRANSCRIPT", transcript].join("\n"));
	return sections.join("\n\n");
}
function wrapPcm16MonoToWav(pcm, sampleRate = GOOGLE_TTS_SAMPLE_RATE) {
	const byteRate = sampleRate * GOOGLE_TTS_CHANNELS * (GOOGLE_TTS_BITS_PER_SAMPLE / 8);
	const blockAlign = GOOGLE_TTS_CHANNELS * (GOOGLE_TTS_BITS_PER_SAMPLE / 8);
	const header = Buffer.alloc(44);
	header.write("RIFF", 0, "ascii");
	header.writeUInt32LE(36 + pcm.length, 4);
	header.write("WAVE", 8, "ascii");
	header.write("fmt ", 12, "ascii");
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(GOOGLE_TTS_CHANNELS, 22);
	header.writeUInt32LE(sampleRate, 24);
	header.writeUInt32LE(byteRate, 28);
	header.writeUInt16LE(blockAlign, 32);
	header.writeUInt16LE(GOOGLE_TTS_BITS_PER_SAMPLE, 34);
	header.write("data", 36, "ascii");
	header.writeUInt32LE(pcm.length, 40);
	return Buffer.concat([header, pcm]);
}
function extractOpenClawGoogleAudioProfileTranscript(text) {
	if (!isOpenClawGoogleAudioProfilePrompt(text)) return;
	const match = /\n\n### TRANSCRIPT(?:\n|$)/u.exec(text);
	if (!match) return;
	return text.slice(match.index + match[0].length).trim() || void 0;
}
function prepareGoogleInteractionsSynthesis(text) {
	const transcript = extractOpenClawGoogleAudioProfileTranscript(text);
	return transcript ? { text: transcript } : void 0;
}
function stripWavContainerToPcm(audio) {
	if (audio.subarray(0, 4).toString("ascii") !== "RIFF" || audio.subarray(8, 12).toString("ascii") !== "WAVE") return audio;
	let offset = 12;
	while (offset + 8 <= audio.length) {
		const chunkId = audio.subarray(offset, offset + 4).toString("ascii");
		const chunkSize = audio.readUInt32LE(offset + 4);
		const dataStart = offset + 8;
		if (chunkId === "data") return audio.subarray(dataStart, Math.min(dataStart + chunkSize, audio.length));
		offset = dataStart + chunkSize + chunkSize % 2;
	}
	throw new Error("Google TTS WAV response missing PCM data");
}
function readGoogleInteractionsAudioData(payload) {
	const direct = normalizeOptionalString(payload.output_audio?.data ?? payload.outputAudio?.data);
	if (direct) return direct;
	for (const step of payload.steps ?? []) for (const block of step.content ?? []) {
		const mime = block.mimeType ?? block.mime_type;
		if (block.type !== "audio" && !mime?.startsWith("audio/")) continue;
		const data = normalizeOptionalString(block.data);
		if (data) return data;
	}
}
async function synthesizeGoogleTtsPcmOnce(params) {
	assertSupportedGoogleTtsModel(params.model);
	const interactions = isGoogleInteractionsTtsModel(params.model);
	if (!interactions && params.speakers && splitGoogleTtsDialogue(params.text, params.speakers)) throw new Error("Google TTS multi-speaker dialogue requires gemini-3.8-flash-tts or gemini-3.8-flash-lite-tts.");
	const { assertOkOrThrowProviderError, postJsonRequest, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { resolveGoogleGenerativeAiHttpRequestConfig } = await import("./.setup/http-request-C4cXFx9-.mjs");
	const { canonicalizeGoogleProviderBase64 } = await import("./.setup/base64-Cw_Cc1ui.mjs");
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveGoogleGenerativeAiHttpRequestConfig({
		apiKey: params.apiKey,
		baseUrl: params.baseUrl,
		request: params.request,
		capability: "audio",
		transport: "http"
	});
	const { response: res, release } = await postJsonRequest({
		url: interactions ? `${baseUrl}/interactions` : `${baseUrl}/models/${params.model}:generateContent`,
		headers,
		body: interactions ? buildGoogleInteractionsTtsBody(params) : {
			contents: [{
				role: "user",
				parts: [{ text: composeGoogleTtsText({
					text: params.text,
					audioProfile: params.audioProfile,
					speakerName: params.speakerName
				}) }]
			}],
			generationConfig: {
				responseModalities: ["AUDIO"],
				speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: params.voiceName } } }
			}
		},
		timeoutMs: params.timeoutMs,
		fetchFn: fetch,
		pinDns: false,
		allowPrivateNetwork,
		dispatcherPolicy
	});
	try {
		if (!res.ok) try {
			await assertOkOrThrowProviderError(res, "Google TTS failed");
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (res.status >= 500 && res.status < 600) throw new GoogleTtsRetryableError(message);
			throw err;
		}
		try {
			const payload = await readProviderJsonResponse(res, "Google TTS response");
			const encoded = interactions ? readGoogleInteractionsAudioData(payload) : payload.candidates?.flatMap((candidate) => candidate.content?.parts ?? []).map((part) => normalizeOptionalString((part.inlineData ?? part.inline_data)?.data)).find((data) => data !== void 0);
			if (!encoded) throw new Error("Google TTS response missing audio data");
			const canonicalAudio = canonicalizeGoogleProviderBase64(encoded);
			if (!canonicalAudio) throw new Error("Google TTS response returned malformed base64 audio data");
			return stripWavContainerToPcm(Buffer.from(canonicalAudio, "base64"));
		} catch (err) {
			throw new GoogleTtsRetryableError(err instanceof Error ? err.message : String(err));
		}
	} finally {
		await release();
	}
}
//#endregion
//#region extensions/google/speech-provider.ts
function resolveGoogleTtsApiKey(params) {
	return params.providerConfig.apiKey ?? normalizeResolvedSecretInputString({
		value: params.cfg?.models?.providers?.google?.apiKey,
		path: "models.providers.google.apiKey"
	}) ?? resolveGoogleEnvApiKey();
}
function normalizeGoogleTtsProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.google) ?? asOptionalRecord(rawConfig.google);
	return {
		...readGoogleTtsProviderConfig(raw ?? {}),
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.google.apiKey"
		})
	};
}
function readGoogleTtsProviderConfig(config) {
	const promptTemplate = normalizeGooglePromptTemplate(config.promptTemplate);
	const personaPrompt = normalizeOptionalString(config.personaPrompt);
	const speakers = readGoogleTtsSpeakers(config.speakers);
	return {
		apiKey: normalizeOptionalString(config.apiKey),
		baseUrl: normalizeOptionalString(config.baseUrl),
		model: normalizeGoogleTtsModel(config.model),
		voiceName: normalizeGoogleTtsVoiceName(config.voiceName ?? config.voice),
		audioProfile: normalizeOptionalString(config.audioProfile),
		speakerName: normalizeOptionalString(config.speakerName),
		...speakers ? { speakers } : {},
		...promptTemplate ? { promptTemplate } : {},
		...personaPrompt ? { personaPrompt } : {}
	};
}
function readGoogleTtsOverrides(overrides) {
	if (!overrides) return {};
	return {
		model: normalizeOptionalString(overrides.model),
		voiceName: normalizeOptionalString(overrides.voiceName ?? overrides.voice),
		audioProfile: normalizeOptionalString(overrides.audioProfile),
		speakerName: normalizeOptionalString(overrides.speakerName)
	};
}
function parseDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voicename":
		case "voice_name":
		case "google_voice":
		case "googlevoice":
			if (!ctx.policy.allowVoice) return { handled: true };
			return {
				handled: true,
				overrides: { voiceName: ctx.value }
			};
		case "google_model":
		case "googlemodel":
			if (!ctx.policy.allowModelId) return { handled: true };
			return {
				handled: true,
				overrides: { model: ctx.value }
			};
		default: return { handled: false };
	}
}
async function synthesizeConfiguredGoogleTts(req) {
	const config = readGoogleTtsProviderConfig(req.providerConfig);
	const overrides = readGoogleTtsOverrides(req.providerOverrides);
	const apiKey = resolveGoogleTtsApiKey({
		cfg: req.cfg,
		providerConfig: config
	});
	if (!apiKey) throw new Error("Google API key missing");
	const { sanitizeConfiguredModelProviderRequest } = await import("openclaw/plugin-sdk/provider-http");
	const params = {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl ?? normalizeOptionalString(req.cfg?.models?.providers?.google?.baseUrl),
		request: sanitizeConfiguredModelProviderRequest(req.cfg?.models?.providers?.google?.request),
		model: normalizeGoogleTtsModel(overrides.model ?? config.model),
		voiceName: normalizeGoogleTtsVoiceName(overrides.voiceName ?? config.voiceName),
		audioProfile: overrides.audioProfile ?? config.audioProfile,
		speakerName: overrides.speakerName ?? config.speakerName,
		speakers: config.speakers,
		personaPrompt: config.personaPrompt,
		timeoutMs: req.timeoutMs
	};
	return retryAsync(() => synthesizeGoogleTtsPcmOnce(params), {
		attempts: 2,
		minDelayMs: 0,
		shouldRetry: isGoogleTtsRetryableError
	});
}
function buildGoogleSpeechProvider() {
	return {
		id: "google",
		label: "Google",
		autoSelectOrder: 50,
		defaultModel: DEFAULT_GOOGLE_TTS_MODEL,
		models: GOOGLE_TTS_MODELS,
		voices: GOOGLE_PREBUILT_VOICES,
		resolveConfig: ({ rawConfig }) => normalizeGoogleTtsProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeGoogleTtsProviderConfig(baseTtsConfig),
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.google.apiKey"
				}) },
				...normalizeOptionalString(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeOptionalString(talkProviderConfig.baseUrl) },
				...normalizeOptionalString(talkProviderConfig.modelId) == null ? {} : { model: normalizeGoogleTtsModel(talkProviderConfig.modelId) },
				...normalizeOptionalString(talkProviderConfig.voiceId) == null ? {} : { voiceName: normalizeGoogleTtsVoiceName(talkProviderConfig.voiceId) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...normalizeOptionalString(params.voiceId) == null ? {} : { voiceName: normalizeGoogleTtsVoiceName(params.voiceId) },
			...normalizeOptionalString(params.modelId) == null ? {} : { model: normalizeGoogleTtsModel(params.modelId) }
		}),
		listVoices: async () => GOOGLE_PREBUILT_VOICES.map((voice) => ({
			id: voice,
			name: voice
		})),
		isConfigured: ({ cfg, providerConfig }) => Boolean(resolveGoogleTtsApiKey({
			cfg,
			providerConfig: readGoogleTtsProviderConfig(providerConfig)
		})),
		prepareSynthesis: (ctx) => {
			const config = readGoogleTtsProviderConfig(ctx.providerConfig);
			const model = normalizeGoogleTtsModel(readGoogleTtsOverrides(ctx.providerOverrides).model ?? config.model);
			assertSupportedGoogleTtsModel(model);
			if (isGoogleInteractionsTtsModel(model)) return prepareGoogleInteractionsSynthesis(ctx.text);
			if (!(config.promptTemplate === "audio-profile-v1" || Boolean(config.personaPrompt)) || isOpenClawGoogleAudioProfilePrompt(ctx.text)) return;
			return { text: renderGoogleAudioProfilePrompt({
				text: ctx.text,
				persona: ctx.persona,
				personaPrompt: config.personaPrompt
			}) };
		},
		synthesize: async (req) => {
			const pcm = await synthesizeConfiguredGoogleTts(req);
			if (req.target === "voice-note") {
				const { transcodeAudioBufferToOpus } = await import("openclaw/plugin-sdk/media-runtime");
				return {
					audioBuffer: await transcodeAudioBufferToOpus({
						audioBuffer: wrapPcm16MonoToWav(pcm),
						inputExtension: "wav",
						tempPrefix: "tts-google-",
						timeoutMs: req.timeoutMs
					}),
					outputFormat: "opus",
					fileExtension: ".opus",
					voiceCompatible: true
				};
			}
			return {
				audioBuffer: wrapPcm16MonoToWav(pcm),
				outputFormat: "wav",
				fileExtension: ".wav",
				voiceCompatible: false
			};
		},
		synthesizeTelephony: async (req) => {
			return {
				audioBuffer: await synthesizeConfiguredGoogleTts(req),
				outputFormat: "pcm",
				sampleRate: GOOGLE_TTS_SAMPLE_RATE
			};
		}
	};
}
//#endregion
//#region extensions/google/capability-catalog.ts
var capability_catalog_default = {
	speechProviders: [buildGoogleSpeechProvider()],
	realtimeVoiceProviders: [createLazyGoogleRealtimeVoiceProvider()]
};
//#endregion
export { capability_catalog_default as default };
