import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-BPNHa36e.mjs";
import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { n as createRealtimeVoiceAudioQueue } from "./realtime-session-lifecycle-CJCE-3t7.mjs";
import { t as createLazyRealtimeVoiceBridgeLifecycle } from "./realtime-voice-provider-C3SkPdAW.mjs";
import { n as GOOGLE_REALTIME_VOICE_METADATA } from "./realtime-voice-metadata-BfpYKwoa.mjs";
//#region extensions/google/realtime-voice-lazy.ts
const loadGoogleRealtimeVoiceProvider = createLazyRuntimeSurface(() => import("./extensions/google/realtime-voice-provider.js"), (mod) => mod.buildGoogleRealtimeVoiceProvider());
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
function resolveGoogleRealtimeEnvApiKey() {
	return normalizeOptionalString(process.env.GEMINI_API_KEY) ?? normalizeOptionalString(process.env.GOOGLE_API_KEY);
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
		isConfigured: ({ cfg, providerConfig }) => Boolean(normalizeOptionalString(providerConfig.apiKey) ?? normalizeOptionalString(cfg?.models?.providers?.google?.apiKey) ?? resolveGoogleRealtimeEnvApiKey()),
		createBridge: createLazyGoogleRealtimeVoiceBridge,
		createBrowserSession: async (req) => {
			const provider = await loadGoogleRealtimeVoiceProvider();
			if (!provider.createBrowserSession) throw new Error("Google realtime voice browser sessions are unavailable");
			return await provider.createBrowserSession(req);
		}
	};
}
//#endregion
export { createLazyGoogleRealtimeVoiceProvider as t };
