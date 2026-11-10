import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { O as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ } from "./agent-run-control-shared-CErtQzFX.mjs";
import "./realtime-voice-provider-CSOj_y12.mjs";
import { a as isOpenAIGptLiveSubscriptionModel, c as resolveOpenAIQuicksilverVoiceCapabilities, i as isOpenAIGptLiveModel, n as OPENAI_QUICKSILVER_CAPABILITIES } from "./realtime-quicksilver-dKvDt3kO.mjs";
import { a as projectRealtimeVoicePublicProjection } from "./provider-policy-api-C5GDY1fk.mjs";
import { i as resolveOpenAIRealtimeRequestHeaders, t as createOpenAIRealtimeClientSecret } from "./realtime-provider-shared-vbb3-15T.mjs";
import { i as buildOpenAIQuicksilverInstructions } from "./realtime-quicksilver-instructions-xfl59uu7.mjs";
import { n as resolveOpenAIChatGptSubscriptionAuth } from "./realtime-auth-CHBPrfeu.mjs";
import { t as OpenAIQuicksilverVoiceBridge } from "./realtime-quicksilver-bridge-BJ9aW3Oz.mjs";
import { t as OpenAIQuicksilverGatewayBridge } from "./realtime-quicksilver-gateway-bridge-C4Dd70pk.mjs";
import { D as normalizeOpenAIRealtimeVoice, E as normalizeOpenAIRealtimeTools, M as resolveOpenAIQuicksilverBridgeAuth, N as resolveOpenAIRealtimePlatformAuth, O as normalizeProviderConfig, S as hasOpenAIRealtimePlatformAuthInputAsync, _ as hasOpenAIChatGptSubscriptionAuthInput, a as OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED, c as OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, d as OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED, h as buildOpenAIRealtimeGaSessionPolicy, i as OPENAI_REALTIME_CAPABILITIES, j as requireOpenAIRealtimePlatformAuth, l as OPENAI_REALTIME_MODELS, p as OPENAI_REALTIME_VOICES, s as OPENAI_REALTIME_DEFAULT_MODEL, v as hasOpenAIChatGptSubscriptionAuthInputAsync, x as hasOpenAIRealtimePlatformAuthInput, y as hasOpenAIRealtimeApiKeyInput } from "./realtime-voice-session-policy-BOfFN3Av.mjs";
import { t as OpenAIRealtimeBridge } from "./realtime-voice-bridge-DYK_2knW.mjs";
//#region extensions/openai/realtime-voice-provider-factory.ts
const INTERNAL_REALTIME_VOICE_PROVIDER = Symbol.for("openclaw.internal.realtime-voice-provider.v1");
const CUSTOM_ENDPOINT_CAPABILITIES = {
	...OPENAI_REALTIME_CAPABILITIES,
	transports: ["gateway-relay"],
	supportsBrowserSession: false
};
function resolveOpenAIRealtimeVoiceConfig({ cfg, rawConfig, agentId, surface, autoRespondToAudio, requiredCapabilities }, context) {
	const config = normalizeProviderConfig(rawConfig);
	if (config.model || surface !== "browser-session" && surface !== "gateway-relay") return config;
	if (config.baseUrl || config.azureEndpoint || config.azureDeployment || autoRespondToAudio === false || requiredCapabilities?.supportsVideoFrames === true) return {
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
async function resolveOpenAIRealtimeVoiceConfigAsync({ cfg, rawConfig, agentId, surface, autoRespondToAudio, requiredCapabilities }, context) {
	const config = normalizeProviderConfig(rawConfig);
	if (config.model || surface !== "browser-session" && surface !== "gateway-relay") return config;
	if (config.baseUrl || config.azureEndpoint || config.azureDeployment || autoRespondToAudio === false || requiredCapabilities?.supportsVideoFrames === true) return {
		...config,
		model: OPENAI_REALTIME_DEFAULT_MODEL
	};
	const model = !await hasOpenAIRealtimePlatformAuthInputAsync({
		configuredApiKey: config.apiKey,
		cfg,
		agentId
	}, context) && await hasOpenAIChatGptSubscriptionAuthInputAsync({
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
	const authParams = {
		configuredApiKey: config.apiKey,
		cfg: req.cfg,
		agentId: req.agentId
	};
	if (config.baseUrl) throw new Error("OpenAI realtime baseUrl requires gateway-relay; browser WebRTC is not supported");
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
			...authParams,
			model
		}, context);
		return await quicksilverBroker.createBrowserSession(quicksilverRequest, auth);
	}
	if (req.gatewayControl) {
		if (!quicksilverBroker) throw new Error("OpenAI realtime browser session broker is unavailable");
		const auth = await requireOpenAIRealtimePlatformAuth(authParams, context);
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
			token: auth
		});
	}
	const { session, voice } = buildOpenAIRealtimeBrowserSessionConfig(req, config, model, context.warn);
	const auth = await resolveOpenAIRealtimePlatformAuth(authParams, context);
	if (!auth) {
		if (await hasOpenAIRealtimePlatformAuthInputAsync(authParams, context)) throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
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
		authToken: auth,
		auditContext: "openai-realtime-browser-session",
		session,
		authRejectedMessage: OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED
	}, context);
	const headers = resolveOpenAIRealtimeRequestHeaders(context, "https://api.openai.com/v1/realtime/calls");
	const SERVER_ONLY_HEADERS = /* @__PURE__ */ new Set([
		"user-agent",
		"originator",
		"version"
	]);
	const browserHeaders = Object.fromEntries(Object.entries(headers).filter(([key]) => !SERVER_ONLY_HEADERS.has(key.toLowerCase())));
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
		resolveConfigAsync: (params) => resolveOpenAIRealtimeVoiceConfigAsync(params, context),
		isConfigured: ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.azureEndpoint || config.azureDeployment) return hasOpenAIRealtimeApiKeyInput(config.apiKey);
			return hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context);
		},
		isConfiguredAsync: async ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.azureEndpoint || config.azureDeployment) return hasOpenAIRealtimeApiKeyInput(config.apiKey);
			return hasOpenAIRealtimePlatformAuthInputAsync({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context);
		},
		createBridge: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			const model = config.model;
			if (model && isOpenAIGptLiveModel(model)) {
				if (config.baseUrl) throw new Error("OpenAI realtime baseUrl does not support GPT-Live; select a Realtime-compatible model");
				if (config.azureEndpoint || config.azureDeployment) throw new Error("GPT-Live backend WebSocket sessions do not support Azure endpoints or deployments");
				const bridgeConfig = {
					...req,
					model,
					voice: config.voice,
					instructions: buildOpenAIQuicksilverInstructions(model, req.instructions)
				};
				const authParams = {
					configuredApiKey: config.apiKey,
					cfg: req.cfg,
					agentId: req.agentId
				};
				if (req.runAgentConsult) return new OpenAIQuicksilverGatewayBridge({
					...bridgeConfig,
					logger: options?.logger ?? {
						debug: () => void 0,
						warn: () => void 0
					},
					resolveAuth: () => resolveOpenAIQuicksilverBridgeAuth({
						...authParams,
						model
					}, context)
				}, context);
				return new OpenAIQuicksilverVoiceBridge({
					...bridgeConfig,
					logger: options?.logger ?? { warn: () => void 0 },
					resolveAuth: async () => ({
						type: "api-key",
						token: await requireOpenAIRealtimePlatformAuth(authParams, context)
					})
				}, context);
			}
			return new OpenAIRealtimeBridge({
				...req,
				...config,
				voice: normalizeOpenAIRealtimeVoice(config.voice),
				interruptResponseOnInputAudio: req.interruptResponseOnInputAudio ?? config.interruptResponseOnInputAudio,
				logger: options?.logger ?? { warn: () => void 0 }
			}, context);
		},
		createBrowserSession: (req) => createOpenAIRealtimeBrowserSession(req, options?.quicksilverBrowserSessionBroker, options?.logger ?? { warn: () => void 0 }, context)
	};
	const isBrowserSessionConfiguredAsync = async ({ cfg, providerConfig, agentId }) => {
		const config = normalizeProviderConfig(providerConfig);
		if (config.baseUrl || config.azureEndpoint || config.azureDeployment) return false;
		const model = config.model ?? "gpt-realtime-2.1";
		const isGptLive = isOpenAIGptLiveModel(model);
		const hasBroker = options?.quicksilverBrowserSessionBroker !== void 0;
		if (isGptLive && !hasBroker) return false;
		return await hasOpenAIRealtimePlatformAuthInputAsync({
			configuredApiKey: config.apiKey,
			cfg,
			agentId
		}, context) || hasBroker && (!isGptLive || isOpenAIGptLiveSubscriptionModel(model)) && await hasOpenAIChatGptSubscriptionAuthInputAsync({
			cfg,
			agentId
		}, context);
	};
	const internalApi = {
		isBrowserSessionConfigured: ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.baseUrl || config.azureEndpoint || config.azureDeployment) return false;
			const model = config.model ?? "gpt-realtime-2.1";
			const isGptLive = isOpenAIGptLiveModel(model);
			const hasBroker = options?.quicksilverBrowserSessionBroker !== void 0;
			if (isGptLive && !hasBroker) return false;
			return hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context) || hasBroker && (!isGptLive || isOpenAIGptLiveSubscriptionModel(model)) && hasOpenAIChatGptSubscriptionAuthInput({
				cfg,
				agentId
			}, context);
		},
		isBrowserSessionConfiguredAsync,
		resolveBrowserSessionCapabilities: ({ cfg, providerConfig, agentId, model, clientControl }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.baseUrl) return CUSTOM_ENDPOINT_CAPABILITIES;
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
		resolveBrowserSessionCapabilitiesAsync: async ({ cfg, providerConfig, agentId, model, clientControl }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.baseUrl) return CUSTOM_ENDPOINT_CAPABILITIES;
			const effectiveModel = model ?? config.model ?? "";
			if (isOpenAIGptLiveModel(effectiveModel)) {
				const supportsGatewayControl = clientControl?.owner === "gateway" && await isBrowserSessionConfiguredAsync({
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
				...options?.quicksilverBrowserSessionBroker !== void 0 && await hasOpenAIRealtimePlatformAuthInputAsync({
					configuredApiKey: config.apiKey,
					cfg,
					agentId
				}, context) ? { supportsGatewayControl: true } : {}
			};
		},
		isGatewayRelayConfigured: ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (!isOpenAIGptLiveModel(config.model)) return;
			if (config.baseUrl || config.azureEndpoint || config.azureDeployment) return false;
			return hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context) || isOpenAIGptLiveSubscriptionModel(config.model) && hasOpenAIChatGptSubscriptionAuthInput({
				cfg,
				agentId
			}, context);
		},
		isGatewayRelayConfiguredAsync: async ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (!isOpenAIGptLiveModel(config.model)) return;
			if (config.baseUrl || config.azureEndpoint || config.azureDeployment) return false;
			return await hasOpenAIRealtimePlatformAuthInputAsync({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			}, context) || isOpenAIGptLiveSubscriptionModel(config.model) && await hasOpenAIChatGptSubscriptionAuthInputAsync({
				cfg,
				agentId
			}, context);
		},
		resolveGatewayRelayCapabilities: ({ providerConfig, model }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.baseUrl) return CUSTOM_ENDPOINT_CAPABILITIES;
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
			if (config.baseUrl && isOpenAIGptLiveModel(model ?? config.model)) return "OpenAI realtime baseUrl does not support GPT-Live; select a Realtime-compatible model";
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
