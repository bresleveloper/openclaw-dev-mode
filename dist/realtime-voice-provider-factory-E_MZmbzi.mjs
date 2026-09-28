import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { A as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { a as isOpenAIGptLiveSubscriptionModel, c as resolveOpenAIQuicksilverVoiceCapabilities, i as isOpenAIGptLiveModel, n as OPENAI_QUICKSILVER_CAPABILITIES } from "./realtime-quicksilver-0VQEPDSP.mjs";
import { a as projectRealtimeVoicePublicProjection } from "./provider-policy-api-DDfnU9u7.mjs";
import { i as buildOpenAIQuicksilverInstructions } from "./realtime-quicksilver-instructions-CkYwSLJz.mjs";
import { n as createOpenAIRealtimeClientSecret } from "./realtime-provider-shared-CvSijJ_n.mjs";
import { t as resolveOpenAIChatGptSubscriptionAuth } from "./realtime-auth-B5Xgkcgd.mjs";
import { t as OpenAIQuicksilverVoiceBridge } from "./realtime-quicksilver-bridge-BJEa4olU.mjs";
import { t as OpenAIQuicksilverGatewayBridge } from "./realtime-quicksilver-gateway-bridge-CBRsHe5j.mjs";
import { A as requireOpenAIRealtimePlatformAuth, E as normalizeProviderConfig, N as resolveOpenAIRealtimePlatformAuth, T as normalizeOpenAIRealtimeVoice, _ as hasOpenAIChatGptSubscriptionAuthInput, a as OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED, b as hasOpenAIRealtimePlatformAuthInput, c as OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, d as OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED, h as buildOpenAIRealtimeGaSessionPolicy, i as OPENAI_REALTIME_CAPABILITIES, j as resolveOpenAIQuicksilverBridgeAuth, l as OPENAI_REALTIME_MODELS, p as OPENAI_REALTIME_VOICES, s as OPENAI_REALTIME_DEFAULT_MODEL, v as hasOpenAIRealtimeApiKeyInput, w as normalizeOpenAIRealtimeTools } from "./realtime-voice-session-policy-BGXV2brx.mjs";
import { t as OpenAIRealtimeBridge } from "./realtime-voice-bridge-CELYC4Ae.mjs";
//#region extensions/openai/realtime-voice-provider-factory.ts
const INTERNAL_REALTIME_VOICE_PROVIDER = Symbol.for("openclaw.internal.realtime-voice-provider.v1");
function resolveOpenAIRealtimeVoiceConfig({ cfg, rawConfig, agentId, surface, autoRespondToAudio, requiredCapabilities }, context) {
	const config = normalizeProviderConfig(rawConfig);
	if (config.model || surface !== "browser-session" && surface !== "gateway-relay") return config;
	if (config.azureEndpoint || config.azureDeployment || autoRespondToAudio === false || requiredCapabilities?.supportsVideoFrames === true) return {
		...config,
		model: OPENAI_REALTIME_DEFAULT_MODEL
	};
	const model = !hasOpenAIRealtimePlatformAuthInput({
		configuredApiKey: config.apiKey,
		cfg,
		agentId
	}, context) && hasOpenAIChatGptSubscriptionAuthInput({
		cfg,
		agentId
	}, context) ? "gpt-live-1-codex" : "gpt-live-1";
	return {
		...config,
		model
	};
}
function buildOpenAIRealtimeBrowserSessionConfig(req, config, model, warn) {
	const voice = normalizeOpenAIRealtimeVoice(req.voice) ?? normalizeOpenAIRealtimeVoice(config.voice) ?? "alloy";
	const tools = normalizeOpenAIRealtimeTools(req.tools, warn);
	const session = {
		type: "realtime",
		model,
		instructions: req.instructions,
		audio: {
			input: {
				noise_reduction: { type: "near_field" },
				turn_detection: {
					type: "server_vad",
					create_response: true,
					interrupt_response: true,
					...typeof (req.vadThreshold ?? config.vadThreshold) === "number" ? { threshold: req.vadThreshold ?? config.vadThreshold } : {},
					...typeof (req.prefixPaddingMs ?? config.prefixPaddingMs) === "number" ? { prefix_padding_ms: req.prefixPaddingMs ?? config.prefixPaddingMs } : {},
					...typeof (req.silenceDurationMs ?? config.silenceDurationMs) === "number" ? { silence_duration_ms: req.silenceDurationMs ?? config.silenceDurationMs } : {}
				},
				transcription: { model: OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL }
			},
			output: { voice }
		}
	};
	if (tools) {
		session.tools = tools;
		session.tool_choice = "auto";
	}
	const reasoningEffort = normalizeOptionalString(req.reasoningEffort) ?? config.reasoningEffort;
	if (reasoningEffort) session.reasoning = { effort: reasoningEffort };
	return {
		session,
		voice
	};
}
async function createOpenAIRealtimeBrowserSession(req, quicksilverBroker, logger, context) {
	const { resolveAgentDir } = context;
	const config = normalizeProviderConfig(req.providerConfig);
	if (config.azureEndpoint || config.azureDeployment) throw new Error("OpenAI Realtime browser sessions do not support Azure endpoints yet");
	const model = req.model ?? config.model ?? "gpt-realtime-2.1";
	if (isOpenAIGptLiveModel(model)) {
		if (!quicksilverBroker) throw new Error("OpenAI GPT-Live browser session broker is unavailable");
		const quicksilverRequest = {
			...req,
			model,
			instructions: buildOpenAIQuicksilverInstructions(model, req.instructions),
			voice: req.voice ?? config.voice
		};
		const auth = await resolveOpenAIQuicksilverBridgeAuth({
			configuredApiKey: config.apiKey,
			cfg: req.cfg,
			agentId: req.agentId,
			model
		}, context);
		return await quicksilverBroker.createBrowserSession(quicksilverRequest, auth);
	}
	if (req.gatewayControl) {
		if (!quicksilverBroker) throw new Error("OpenAI realtime browser session broker is unavailable");
		const auth = await requireOpenAIRealtimePlatformAuth({
			configuredApiKey: config.apiKey,
			cfg: req.cfg,
			agentId: req.agentId
		}, context);
		const voice = normalizeOpenAIRealtimeVoice(req.voice) ?? normalizeOpenAIRealtimeVoice(config.voice) ?? "alloy";
		const sessionConfig = buildOpenAIRealtimeGaSessionPolicy({
			audioFormat: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
			instructions: req.instructions,
			interruptResponseOnInputAudio: config.interruptResponseOnInputAudio,
			model,
			noiseReduction: { type: "near_field" },
			prefixPaddingMs: req.prefixPaddingMs ?? config.prefixPaddingMs,
			reasoningEffort: normalizeOptionalString(req.reasoningEffort) ?? config.reasoningEffort,
			silenceDurationMs: req.silenceDurationMs ?? config.silenceDurationMs,
			tools: normalizeOpenAIRealtimeTools(req.tools, context.warn),
			vadThreshold: req.vadThreshold ?? config.vadThreshold,
			voice
		});
		const gatewayControl = req.gatewayControl;
		return await quicksilverBroker.createBrowserSession({
			...req,
			model,
			voice,
			clientControl: { owner: "gateway" },
			gatewayControl,
			gaSession: sessionConfig,
			gaSideband: { createBridge: ({ apiKey, callId, onTerminal }) => {
				const bridge = new OpenAIRealtimeBridge({
					cfg: req.cfg,
					agentId: req.agentId,
					providerConfig: req.providerConfig,
					apiKey,
					callId,
					audioFormat: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
					gaSessionPolicy: sessionConfig,
					model,
					voice,
					instructions: req.instructions,
					tools: req.tools,
					interruptResponseOnInputAudio: config.interruptResponseOnInputAudio,
					reasoningEffort: req.reasoningEffort ?? config.reasoningEffort,
					vadThreshold: req.vadThreshold ?? config.vadThreshold,
					silenceDurationMs: req.silenceDurationMs ?? config.silenceDurationMs,
					prefixPaddingMs: req.prefixPaddingMs ?? config.prefixPaddingMs,
					onAudio: () => void 0,
					onClearAudio: () => void 0,
					onEvent: gatewayControl.onEvent,
					onResponseDone: gatewayControl.onResponseDone,
					onTranscript: gatewayControl.onTranscript,
					onToolCall: gatewayControl.onToolCall,
					onReady: gatewayControl.onReady,
					onError: gatewayControl.onError,
					onClose: (reason) => {
						try {
							gatewayControl.onClose?.(reason);
						} finally {
							onTerminal();
						}
					},
					logger
				}, context);
				if (gatewayControl.bindControl) gatewayControl.bindControl({
					submitToolResult: bridge.submitToolResult.bind(bridge),
					sendUserMessage: bridge.sendUserMessage.bind(bridge)
				});
				else gatewayControl.bindBridge(bridge);
				return bridge;
			} }
		}, {
			type: "api-key",
			token: auth.value
		});
	}
	const { session, voice } = buildOpenAIRealtimeBrowserSessionConfig(req, config, model, context.warn);
	const auth = await resolveOpenAIRealtimePlatformAuth({
		configuredApiKey: config.apiKey,
		cfg: req.cfg,
		agentId: req.agentId
	}, context);
	if (auth.status === "missing") {
		if (hasOpenAIRealtimePlatformAuthInput({
			configuredApiKey: config.apiKey,
			cfg: req.cfg,
			agentId: req.agentId
		}, context)) throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
		const subscriptionAuth = await resolveOpenAIChatGptSubscriptionAuth({
			cfg: req.cfg,
			agentDir: req.cfg ? resolveAgentDir(req.cfg, req.agentId) : void 0
		}, context);
		if (!subscriptionAuth) throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
		if (!quicksilverBroker) throw new Error("OpenAI realtime browser session broker is unavailable");
		return await quicksilverBroker.createBrowserSession({
			...req,
			model,
			voice,
			gaSession: session
		}, subscriptionAuth);
	}
	const clientSecret = await createOpenAIRealtimeClientSecret({
		authToken: auth.value,
		auditContext: "openai-realtime-browser-session",
		session,
		authRejectedMessage: OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED
	}, context);
	const headers = context.resolveProviderRequestHeaders({
		provider: "openai",
		baseUrl: "https://api.openai.com/v1/realtime/calls",
		capability: "audio",
		transport: "http",
		defaultHeaders: {}
	});
	const SERVER_ONLY_HEADERS = /* @__PURE__ */ new Set([
		"user-agent",
		"originator",
		"version"
	]);
	const browserHeaders = Object.fromEntries(Object.entries(headers ?? {}).filter(([key]) => !SERVER_ONLY_HEADERS.has(key.toLowerCase())));
	const offerHeaders = Object.keys(browserHeaders).length > 0 ? browserHeaders : void 0;
	return {
		provider: "openai",
		transport: "webrtc",
		clientSecret: clientSecret.value,
		offerUrl: "https://api.openai.com/v1/realtime/calls",
		offerResponseMaxBytes: 262144,
		...offerHeaders ? { offerHeaders } : {},
		model,
		voice,
		...typeof clientSecret.expiresAt === "number" ? { expiresAt: clientSecret.expiresAt } : {}
	};
}
function buildOpenAIRealtimeVoiceProvider(context, options) {
	const provider = {
		id: "openai",
		label: "OpenAI Realtime Voice",
		defaultModel: OPENAI_REALTIME_DEFAULT_MODEL,
		models: OPENAI_REALTIME_MODELS,
		voices: OPENAI_REALTIME_VOICES,
		autoSelectOrder: 10,
		capabilities: OPENAI_REALTIME_CAPABILITIES,
		resolveConfig: (params) => resolveOpenAIRealtimeVoiceConfig(params, context),
		isConfigured: ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.azureEndpoint || config.azureDeployment) return hasOpenAIRealtimeApiKeyInput(config.apiKey);
			return hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context);
		},
		createBridge: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			const model = config.model;
			if (model && isOpenAIGptLiveModel(model)) {
				if (config.azureEndpoint || config.azureDeployment) throw new Error("GPT-Live backend WebSocket sessions do not support Azure endpoints or deployments");
				if (req.runAgentConsult) return new OpenAIQuicksilverGatewayBridge({
					...req,
					model,
					voice: config.voice,
					instructions: buildOpenAIQuicksilverInstructions(model, req.instructions),
					logger: options?.logger ?? {
						debug: () => void 0,
						warn: () => void 0
					},
					resolveAuth: () => resolveOpenAIQuicksilverBridgeAuth({
						configuredApiKey: config.apiKey,
						cfg: req.cfg,
						agentId: req.agentId,
						model
					}, context)
				}, context);
				return new OpenAIQuicksilverVoiceBridge({
					...req,
					model,
					voice: config.voice,
					instructions: buildOpenAIQuicksilverInstructions(model, req.instructions),
					logger: options?.logger ?? { warn: () => void 0 },
					resolveAuth: async () => ({
						type: "api-key",
						token: (await requireOpenAIRealtimePlatformAuth({
							configuredApiKey: config.apiKey,
							cfg: req.cfg,
							agentId: req.agentId
						}, context)).value
					})
				}, context);
			}
			return new OpenAIRealtimeBridge({
				...req,
				apiKey: config.apiKey,
				model: config.model,
				voice: normalizeOpenAIRealtimeVoice(config.voice),
				temperature: config.temperature,
				vadThreshold: config.vadThreshold,
				silenceDurationMs: config.silenceDurationMs,
				prefixPaddingMs: config.prefixPaddingMs,
				interruptResponseOnInputAudio: req.interruptResponseOnInputAudio ?? config.interruptResponseOnInputAudio,
				minBargeInAudioEndMs: config.minBargeInAudioEndMs,
				reasoningEffort: config.reasoningEffort,
				azureEndpoint: config.azureEndpoint,
				azureDeployment: config.azureDeployment,
				azureApiVersion: config.azureApiVersion,
				logger: options?.logger ?? { warn: () => void 0 }
			}, context);
		},
		createBrowserSession: (req) => createOpenAIRealtimeBrowserSession(req, options?.quicksilverBrowserSessionBroker, options?.logger ?? { warn: () => void 0 }, context)
	};
	const internalApi = {
		isBrowserSessionConfigured: ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.azureEndpoint || config.azureDeployment) return false;
			const model = config.model ?? "gpt-realtime-2.1";
			if (isOpenAIGptLiveModel(model)) return options?.quicksilverBrowserSessionBroker !== void 0 && (hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context) || isOpenAIGptLiveSubscriptionModel(model) && hasOpenAIChatGptSubscriptionAuthInput({
				cfg,
				agentId
			}, context));
			return hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context) || options?.quicksilverBrowserSessionBroker !== void 0 && hasOpenAIChatGptSubscriptionAuthInput({
				cfg,
				agentId
			}, context);
		},
		resolveBrowserSessionCapabilities: ({ cfg, providerConfig, agentId, model, clientControl }) => {
			const config = normalizeProviderConfig(providerConfig);
			const effectiveModel = model ?? config.model ?? "";
			if (isOpenAIGptLiveModel(effectiveModel)) {
				const supportsGatewayControl = clientControl?.owner === "gateway" && internalApi.isBrowserSessionConfigured({
					cfg,
					providerConfig: {
						...providerConfig,
						model: effectiveModel
					},
					agentId
				});
				return {
					...OPENAI_REALTIME_CAPABILITIES,
					...OPENAI_QUICKSILVER_CAPABILITIES,
					...resolveOpenAIQuicksilverVoiceCapabilities(effectiveModel),
					...supportsGatewayControl ? { supportsGatewayControl: true } : {}
				};
			}
			return {
				...OPENAI_REALTIME_CAPABILITIES,
				...options?.quicksilverBrowserSessionBroker !== void 0 && hasOpenAIRealtimePlatformAuthInput({
					configuredApiKey: config.apiKey,
					cfg,
					agentId
				}, context) ? { supportsGatewayControl: true } : {}
			};
		},
		isGatewayRelayConfigured: ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (!isOpenAIGptLiveModel(config.model)) return;
			if (config.azureEndpoint || config.azureDeployment) return false;
			return hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context) || isOpenAIGptLiveSubscriptionModel(config.model) && hasOpenAIChatGptSubscriptionAuthInput({
				cfg,
				agentId
			}, context);
		},
		resolveGatewayRelayCapabilities: ({ providerConfig, model }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (isOpenAIGptLiveModel(model ?? config.model)) return {
				...OPENAI_REALTIME_CAPABILITIES,
				...OPENAI_QUICKSILVER_CAPABILITIES,
				...resolveOpenAIQuicksilverVoiceCapabilities(model ?? config.model ?? "")
			};
			return OPENAI_REALTIME_CAPABILITIES;
		},
		projectPublicProjection: projectRealtimeVoicePublicProjection,
		validateGatewayRelayLaunch: ({ providerConfig, model, autoRespondToAudio }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (autoRespondToAudio === false && isOpenAIGptLiveModel(model ?? config.model)) return "GPT-Live gateway-relay sessions cannot use forced agent consult routing; GPT-Live delegates to the agent natively";
		},
		cancelBrowserSession: (_request, session) => options?.quicksilverBrowserSessionBroker?.cancelBrowserSession(session)
	};
	Object.defineProperty(provider, INTERNAL_REALTIME_VOICE_PROVIDER, {
		configurable: true,
		value: internalApi
	});
	return provider;
}
//#endregion
export { buildOpenAIRealtimeVoiceProvider as t };
