import { TtsConfigSchema } from "../runtime-api.js";
import "../api.js";
import { t as TWILIO_REGIONS } from "./twilio-region-4fkgz3UG.mjs";
import { normalizeAgentId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES, resolveRealtimeVoiceAgentConsultTools } from "openclaw/plugin-sdk/realtime-voice";
import { mergeDeep } from "openclaw/plugin-sdk/plugin-config-runtime";
import { buildSecretInputSchema, hasConfiguredSecretInput, normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { canonicalizeMainSessionAlias } from "openclaw/plugin-sdk/session-store-runtime";
import { resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-core";
import { normalizeWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
import { z } from "zod";
import { MAX_TCP_PORT } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/voice-call/src/realtime-call-control.ts
/** Stable provider-facing tool name for ending the current phone call. */
const REALTIME_VOICE_END_CALL_TOOL_NAME = "openclaw_end_call";
/** Closure-bound end-call control exposed on every realtime phone call. */
const REALTIME_VOICE_END_CALL_TOOL = {
	type: "function",
	name: REALTIME_VOICE_END_CALL_TOOL_NAME,
	description: "End the current phone call immediately. Speak any final words to the caller before invoking this tool because the call ends as soon as it is invoked and no further reply will be spoken.",
	parameters: {
		type: "object",
		properties: {}
	}
};
/** Merge built-in call controls with consult and configured realtime tools. */
function resolveVoiceCallRealtimeTools(policy, customTools = []) {
	const tools = resolveRealtimeVoiceAgentConsultTools(policy, customTools).filter((tool) => tool.name !== REALTIME_VOICE_END_CALL_TOOL_NAME);
	return [REALTIME_VOICE_END_CALL_TOOL, ...tools];
}
//#endregion
//#region extensions/voice-call/src/realtime-defaults.ts
/** Baseline instructions that keep realtime calls brief and route deep work to agent consult. */
const DEFAULT_VOICE_CALL_REALTIME_INSTRUCTIONS = `You are OpenClaw's phone-call realtime voice interface. Keep spoken replies brief and natural. When a question needs deeper reasoning, current information, or tools, call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} before answering. When the caller asks to end the call, speak any final words first, then call ${REALTIME_VOICE_END_CALL_TOOL_NAME}; it ends the call immediately and nothing after it will be spoken.`;
//#endregion
//#region extensions/voice-call/src/tailscale-config.ts
const VoiceCallTailscaleConfigSchema = z.object({
	mode: z.enum([
		"off",
		"serve",
		"funnel"
	]).default("off"),
	port: z.number().int().positive().max(MAX_TCP_PORT).default(443),
	path: z.string().min(1).default("/voice/webhook")
}).strict().default({
	mode: "off",
	port: 443,
	path: "/voice/webhook"
});
const TAILSCALE_FUNNEL_HTTPS_PORTS = /* @__PURE__ */ new Set([
	443,
	8443,
	1e4
]);
function isTailscalePortAllowed(config) {
	return !(config.tailscale.mode === "funnel" || config.tunnel.provider === "tailscale-funnel") || TAILSCALE_FUNNEL_HTTPS_PORTS.has(config.tailscale.port);
}
//#endregion
//#region extensions/voice-call/src/config.ts
/**
* E.164 phone number format: +[country code][number]
* Examples use 555 prefix (reserved for fictional numbers)
*/
const E164Schema = z.string().regex(/^\+[1-9]\d{1,14}$/, "Expected E.164 format, e.g. +15550001234");
/**
* Controls how inbound calls are handled:
* - "disabled": Block all inbound calls (outbound only)
* - "allowlist": Only accept calls from numbers in allowFrom
* - "pairing": Unknown callers can request pairing (future)
* - "open": Accept all inbound calls (dangerous!)
*/
const InboundPolicySchema = z.enum([
	"disabled",
	"allowlist",
	"pairing",
	"open"
]);
const SecretInputSchema = buildSecretInputSchema();
const TelnyxConfigSchema = z.object({
	/** Telnyx API v2 key */
	apiKey: z.string().min(1).optional(),
	/** Telnyx connection ID (from Call Control app) */
	connectionId: z.string().min(1).optional(),
	/** Public key for webhook signature verification */
	publicKey: z.string().min(1).optional()
}).strict();
const TwilioConfigSchema = z.object({
	/** Twilio Account SID */
	accountSid: z.string().min(1).optional(),
	/** Twilio Auth Token */
	authToken: SecretInputSchema.optional(),
	/** Twilio processing Region (for example, ie1) */
	region: z.enum(TWILIO_REGIONS).optional()
}).strict();
const PlivoConfigSchema = z.object({
	/** Plivo Auth ID (starts with MA/SA) */
	authId: z.string().min(1).optional(),
	/** Plivo Auth Token */
	authToken: z.string().min(1).optional()
}).strict();
const VoiceCallNumberRouteConfigSchema = z.object({
	/** Greeting message for inbound calls to this number. */
	inboundGreeting: z.string().optional(),
	/** TTS override for inbound calls to this number. Deep-merges with global voice-call TTS. */
	tts: TtsConfigSchema,
	/** Agent ID to use for voice response generation for this number. */
	agentId: z.string().min(1).optional(),
	/** Optional model override for voice responses for this number. */
	responseModel: z.string().optional(),
	/** System prompt for voice responses for this number. */
	responseSystemPrompt: z.string().optional(),
	/** Timeout for response generation in ms for this number. */
	responseTimeoutMs: z.number().int().positive().optional()
}).strict();
const VoiceCallServeConfigSchema = z.object({
	/** Port to listen on */
	port: z.number().int().positive().default(3334),
	/** Bind address */
	bind: z.string().default("127.0.0.1"),
	/** Webhook path */
	path: z.string().min(1).default("/voice/webhook")
}).strict().default({
	port: 3334,
	bind: "127.0.0.1",
	path: "/voice/webhook"
});
const VoiceCallTunnelConfigSchema = z.object({
	/**
	* Tunnel provider:
	* - "none": No tunnel (use publicUrl if set, or manual setup)
	* - "ngrok": Use ngrok for public HTTPS tunnel
	* - "tailscale-serve": Tailscale serve (private to tailnet)
	* - "tailscale-funnel": Tailscale funnel (public HTTPS)
	*/
	provider: z.enum([
		"none",
		"ngrok",
		"tailscale-serve",
		"tailscale-funnel"
	]).default("none"),
	/** ngrok auth token (optional, enables longer sessions and more features) */
	ngrokAuthToken: z.string().min(1).optional(),
	/** ngrok custom domain (paid feature, e.g., "myapp.ngrok.io") */
	ngrokDomain: z.string().min(1).optional(),
	/**
	* Allow ngrok free tier compatibility mode.
	* When true, forwarded headers may be trusted for loopback requests
	* to reconstruct the public ngrok URL used for signing.
	*
	* IMPORTANT: This does NOT bypass signature verification.
	*/
	allowNgrokFreeTierLoopbackBypass: z.boolean().default(false)
}).strict().default({
	provider: "none",
	allowNgrokFreeTierLoopbackBypass: false
});
const VoiceCallWebhookSecurityConfigSchema = z.object({
	/**
	* Allowed hostnames for webhook URL reconstruction.
	* Only these hosts are accepted from forwarding headers.
	*/
	allowedHosts: z.array(z.string().min(1)).default([]),
	/**
	* Trust X-Forwarded-* headers without a hostname allowlist.
	* WARNING: Only enable if you trust your proxy configuration.
	*/
	trustForwardingHeaders: z.boolean().default(false),
	/**
	* Trusted proxy IP addresses. Forwarded headers are only trusted when
	* the remote IP matches one of these addresses.
	*/
	trustedProxyIPs: z.array(z.string().min(1)).default([])
}).strict().default({
	allowedHosts: [],
	trustForwardingHeaders: false,
	trustedProxyIPs: []
});
/**
* Call mode determines how outbound calls behave:
* - "notify": Deliver message and auto-hangup after delay (one-way notification)
* - "conversation": Stay open for back-and-forth until explicit end or timeout
*/
const CallModeSchema = z.enum(["notify", "conversation"]);
const VoiceCallSessionScopeSchema = z.enum([
	"per-phone",
	"per-call",
	"main"
]);
const OutboundConfigSchema = z.object({
	/** Default call mode for outbound calls */
	defaultMode: CallModeSchema.default("notify"),
	/** Seconds to wait after TTS before auto-hangup in notify mode */
	notifyHangupDelaySec: z.number().int().nonnegative().default(3)
}).strict().default({
	defaultMode: "notify",
	notifyHangupDelaySec: 3
});
const RealtimeToolSchema = z.object({
	type: z.literal("function"),
	name: z.string().min(1),
	description: z.string(),
	parameters: z.object({
		type: z.literal("object"),
		properties: z.record(z.string(), z.unknown()),
		required: z.array(z.string()).optional()
	})
}).strict();
const VoiceCallRealtimeProvidersConfigSchema = z.record(z.string(), z.record(z.string(), z.unknown())).default({});
const VoiceCallRealtimeToolPolicySchema = z.enum(REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES);
const VoiceCallRealtimeConsultPolicySchema = z.enum([
	"auto",
	"substantive",
	"always"
]);
const VoiceCallRealtimeFastContextSourceSchema = z.enum(["memory", "sessions"]);
const VoiceCallRealtimeFastContextConfigSchema = z.object({
	/** Enable bounded memory/session lookup before the full consult agent. */
	enabled: z.boolean().default(false),
	/** Hard deadline for the fast context lookup. */
	timeoutMs: z.number().int().positive().default(800),
	/** Maximum memory/session hits to inject into the realtime tool result. */
	maxResults: z.number().int().positive().default(3),
	/** Indexed sources used by the fast context lookup. */
	sources: z.array(VoiceCallRealtimeFastContextSourceSchema).min(1).default(["memory", "sessions"]),
	/** Fall back to the full agent consult when fast context has no answer. */
	fallbackToConsult: z.boolean().default(false)
}).strict().default({
	enabled: false,
	timeoutMs: 800,
	maxResults: 3,
	sources: ["memory", "sessions"],
	fallbackToConsult: false
});
const VoiceCallRealtimeAgentContextConfigSchema = z.object({
	/** Inject a compact agent persona/context capsule into realtime voice instructions. */
	enabled: z.boolean().default(false),
	/** Maximum number of characters from the generated capsule to append. */
	maxChars: z.number().int().positive().default(6e3),
	/** Include configured agent identity fields. */
	includeIdentity: z.boolean().default(true),
	/** Include selected workspace files such as SOUL.md and IDENTITY.md. */
	includeWorkspaceFiles: z.boolean().default(true),
	/** Workspace-relative files to include, bounded by maxChars. */
	files: z.array(z.string().min(1)).default([
		"SOUL.md",
		"IDENTITY.md",
		"USER.md"
	])
}).strict().default({
	enabled: false,
	maxChars: 6e3,
	includeIdentity: true,
	includeWorkspaceFiles: true,
	files: [
		"SOUL.md",
		"IDENTITY.md",
		"USER.md"
	]
});
const VoiceCallRealtimeConsultThinkingLevelSchema = z.enum([
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"adaptive",
	"max",
	"ultra"
]);
const VoiceCallStreamingProvidersConfigSchema = z.record(z.string(), z.record(z.string(), z.unknown())).default({});
const VoiceCallRealtimeConfigSchema = z.object({
	/** Enable realtime voice-to-voice mode. */
	enabled: z.boolean().default(false),
	/** Provider id from registered realtime voice providers. */
	provider: z.string().min(1).optional(),
	/** Optional override for the local WebSocket route path. */
	streamPath: z.string().min(1).optional(),
	/** System instructions passed to the realtime provider. */
	instructions: z.string().default(DEFAULT_VOICE_CALL_REALTIME_INSTRUCTIONS),
	/** Tool policy for the shared OpenClaw agent consult tool. */
	toolPolicy: VoiceCallRealtimeToolPolicySchema.default("safe-read-only"),
	/** Guidance for when the realtime model should call the OpenClaw agent consult tool. */
	consultPolicy: VoiceCallRealtimeConsultPolicySchema.default("auto"),
	/** Optional thinking level override for the regular agent behind realtime consults. */
	consultThinkingLevel: VoiceCallRealtimeConsultThinkingLevelSchema.optional(),
	/** Optional fast mode override for the regular agent behind realtime consults. */
	consultFastMode: z.boolean().optional(),
	/** Tool definitions exposed to the realtime provider. */
	tools: z.array(RealtimeToolSchema).default([]),
	/** Low-latency memory/session context for the consult tool. */
	fastContext: VoiceCallRealtimeFastContextConfigSchema,
	/** Bounded agent persona/context injection for the fast realtime voice path. */
	agentContext: VoiceCallRealtimeAgentContextConfigSchema,
	/** Provider-owned raw config blobs keyed by provider id. */
	providers: VoiceCallRealtimeProvidersConfigSchema
}).strict().default({
	enabled: false,
	instructions: DEFAULT_VOICE_CALL_REALTIME_INSTRUCTIONS,
	toolPolicy: "safe-read-only",
	consultPolicy: "auto",
	tools: [],
	fastContext: {
		enabled: false,
		timeoutMs: 800,
		maxResults: 3,
		sources: ["memory", "sessions"],
		fallbackToConsult: false
	},
	agentContext: {
		enabled: false,
		maxChars: 6e3,
		includeIdentity: true,
		includeWorkspaceFiles: true,
		files: [
			"SOUL.md",
			"IDENTITY.md",
			"USER.md"
		]
	},
	providers: {}
});
const VoiceCallStreamingConfigSchema = z.object({
	/** Enable Twilio Media Streams for real-time transcription. */
	enabled: z.boolean().default(false),
	/** Provider id from registered realtime transcription providers. */
	provider: z.string().min(1).optional(),
	/** WebSocket path for media stream connections */
	streamPath: z.string().min(1).default("/voice/stream"),
	/** Provider-owned raw config blobs keyed by provider id. */
	providers: VoiceCallStreamingProvidersConfigSchema,
	/**
	* Close unauthenticated media stream sockets if no valid `start` frame arrives in time.
	* Protects against pre-auth idle connection hold attacks.
	*/
	preStartTimeoutMs: z.number().int().positive().default(5e3),
	/** Maximum number of concurrently pending (pre-start) media stream sockets. */
	maxPendingConnections: z.number().int().positive().default(32),
	/** Maximum pending media stream sockets per source IP. */
	maxPendingConnectionsPerIp: z.number().int().positive().default(4),
	/** Hard cap for all open media stream sockets (pending + active). */
	maxConnections: z.number().int().positive().default(128)
}).strict().default({
	enabled: false,
	streamPath: "/voice/stream",
	providers: {},
	preStartTimeoutMs: 5e3,
	maxPendingConnections: 32,
	maxPendingConnectionsPerIp: 4,
	maxConnections: 128
});
const VoiceCallConfigSchema = z.object({
	/** Enable voice call functionality */
	enabled: z.boolean().default(false),
	/** Active provider (telnyx, twilio, plivo, or mock) */
	provider: z.enum([
		"telnyx",
		"twilio",
		"plivo",
		"mock"
	]).optional(),
	/** Telnyx-specific configuration */
	telnyx: TelnyxConfigSchema.optional(),
	/** Twilio-specific configuration */
	twilio: TwilioConfigSchema.optional(),
	/** Plivo-specific configuration */
	plivo: PlivoConfigSchema.optional(),
	/** Phone number to call from (E.164) */
	fromNumber: E164Schema.optional(),
	/** Default phone number to call (E.164) */
	toNumber: E164Schema.optional(),
	/** Inbound call policy */
	inboundPolicy: InboundPolicySchema.default("disabled"),
	/** Allowlist of phone numbers for inbound calls (E.164) */
	allowFrom: z.array(E164Schema).default([]),
	/** Greeting message for inbound calls */
	inboundGreeting: z.string().optional(),
	/** Per-dialed-number overrides for inbound calls. Keys are E.164 numbers. */
	numbers: z.record(E164Schema, VoiceCallNumberRouteConfigSchema).default({}),
	/** Outbound call configuration */
	outbound: OutboundConfigSchema,
	/** Maximum call duration in seconds */
	maxDurationSeconds: z.number().int().positive().default(300),
	/**
	* Maximum age of a call in seconds before it is automatically reaped.
	* Catches calls stuck before answer (for example, local mock calls that
	* never receive provider webhooks). Set to 0 to disable.
	*/
	staleCallReaperSeconds: z.number().int().nonnegative().default(120),
	/** Silence timeout for end-of-speech detection (ms) */
	silenceTimeoutMs: z.number().int().positive().default(800),
	/** Timeout for user transcript (ms) */
	transcriptTimeoutMs: z.number().int().positive().default(18e4),
	/** Ring timeout for outbound calls (ms) */
	ringTimeoutMs: z.number().int().positive().default(3e4),
	/** Maximum concurrent calls */
	maxConcurrentCalls: z.number().int().positive().default(1),
	/** Webhook server configuration */
	serve: VoiceCallServeConfigSchema,
	/** @deprecated Prefer tunnel config. */
	tailscale: VoiceCallTailscaleConfigSchema,
	/** Tunnel configuration (unified ngrok/tailscale) */
	tunnel: VoiceCallTunnelConfigSchema,
	/** Webhook signature reconstruction and proxy trust configuration */
	webhookSecurity: VoiceCallWebhookSecurityConfigSchema,
	/** Real-time audio streaming configuration */
	streaming: VoiceCallStreamingConfigSchema,
	/** Realtime voice-to-voice configuration */
	realtime: VoiceCallRealtimeConfigSchema,
	/** Session memory scope for voice conversations. */
	sessionScope: VoiceCallSessionScopeSchema.default("per-phone"),
	/** Public webhook URL override (if set, bypasses tunnel auto-detection) */
	publicUrl: z.string().url().optional(),
	/** Skip webhook signature verification (development only, NOT for production) */
	skipSignatureVerification: z.boolean().default(false),
	/** TTS override (deep-merges with core tts) */
	tts: TtsConfigSchema,
	/** Store path for call logs */
	store: z.string().optional(),
	/** Response/session owner. Required when multiple agents have no legacy owner. */
	agentId: z.string().min(1).optional(),
	/** Optional model override for generating voice responses. */
	responseModel: z.string().optional(),
	/** System prompt for voice responses */
	responseSystemPrompt: z.string().optional(),
	/** Timeout for response generation in ms (default 30s) */
	responseTimeoutMs: z.number().int().positive().default(3e4)
}).strict().refine(isTailscalePortAllowed, {
	path: ["tailscale", "port"],
	message: "Tailscale Funnel HTTPS port must be one of 443, 8443, 10000"
});
const TWILIO_AUTH_TOKEN_PATH = "plugins.entries.voice-call.config.twilio.authToken";
const DEFAULT_VOICE_CALL_CONFIG = VoiceCallConfigSchema.parse({});
function cloneDefaultVoiceCallConfig() {
	return structuredClone(DEFAULT_VOICE_CALL_CONFIG);
}
function defaultRealtimeStreamPathForServePath(servePath) {
	const normalized = normalizeWebhookPath(servePath);
	if (normalized.endsWith("/webhook")) return `${normalized.slice(0, -8)}/stream/realtime`;
	if (normalized === "/") return "/voice/stream/realtime";
	return `${normalized}/stream/realtime`;
}
function resolveVoiceCallPublicPathPrefix(publicWebhookPath, localWebhookPath) {
	const publicPath = normalizeWebhookPath(publicWebhookPath);
	const localPathIndex = publicPath.indexOf(normalizeWebhookPath(localWebhookPath));
	return localPathIndex > 0 ? publicPath.slice(0, localPathIndex) : "";
}
function resolveVoiceCallStreamExposurePaths(config, webhookPaths = {}) {
	const exposurePaths = [];
	const localWebhookPath = webhookPaths.localWebhookPath ?? config.serve.path;
	const publicPathPrefix = resolveVoiceCallPublicPathPrefix(webhookPaths.publicWebhookPath ?? config.tailscale.path, localWebhookPath);
	if (config.realtime.enabled) {
		const localPath = normalizeWebhookPath(config.realtime.streamPath ?? defaultRealtimeStreamPathForServePath(config.serve.path));
		exposurePaths.push({
			localPath,
			publicPath: `${publicPathPrefix}${localPath}`
		});
	}
	if (config.streaming.enabled) {
		const localPath = normalizeWebhookPath(config.streaming.streamPath);
		if (!exposurePaths.some((path) => path.localPath === localPath && path.publicPath === localPath)) exposurePaths.push({
			localPath,
			publicPath: localPath
		});
	}
	return exposurePaths;
}
function normalizeVoiceCallTtsConfig(defaults, overrides) {
	if (!defaults && !overrides) return;
	return TtsConfigSchema.parse(mergeDeep(defaults ?? {}, overrides ?? {}));
}
function normalizePhoneRouteKey(phone) {
	return phone?.replace(/\D/g, "") ?? "";
}
function resolveVoiceCallNumberRouteKey(config, phone) {
	const routes = config.numbers;
	if (!routes) return;
	if (phone && Object.hasOwn(routes, phone)) return phone;
	const normalizedPhone = normalizePhoneRouteKey(phone);
	if (!normalizedPhone) return;
	return Object.keys(routes).find((routeKey) => normalizePhoneRouteKey(routeKey) === normalizedPhone);
}
/** Resolve inbound-only number routing from a persisted call record. */
function resolveVoiceCallNumberRouteKeyForCall(call) {
	if (call.direction !== "inbound") return;
	const storedRouteKey = call.metadata?.numberRouteKey;
	if (typeof storedRouteKey === "string") return storedRouteKey;
	return call.to;
}
function resolveVoiceCallEffectiveConfig(config, phoneOrRouteKey) {
	const numberRouteKey = resolveVoiceCallNumberRouteKey(config, phoneOrRouteKey);
	if (!numberRouteKey) return { config };
	const route = config.numbers[numberRouteKey];
	if (!route) return { config };
	return {
		numberRouteKey,
		config: {
			...config,
			...route,
			tts: normalizeVoiceCallTtsConfig(config.tts, route.tts),
			numbers: config.numbers
		}
	};
}
function sanitizeVoiceCallProviderConfigs(value) {
	if (!value) return {};
	return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== void 0));
}
function sanitizeVoiceCallNumberRoutes(value) {
	if (!value) return {};
	return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== void 0).map(([key, route]) => [key, VoiceCallNumberRouteConfigSchema.parse(route)]));
}
function resolveTwilioAuthToken(config) {
	return normalizeResolvedSecretInputString({
		value: config.twilio?.authToken,
		path: TWILIO_AUTH_TOKEN_PATH
	});
}
function normalizeVoiceCallConfig(config) {
	const defaults = cloneDefaultVoiceCallConfig();
	const serve = {
		...defaults.serve,
		...config.serve
	};
	const streamingProvider = config.streaming?.provider;
	const streamingProviders = sanitizeVoiceCallProviderConfigs(config.streaming?.providers ?? defaults.streaming.providers);
	const realtimeProvider = config.realtime?.provider ?? defaults.realtime.provider;
	const realtimeProviders = sanitizeVoiceCallProviderConfigs(config.realtime?.providers ?? defaults.realtime.providers);
	const realtimeFastContext = {
		...defaults.realtime.fastContext,
		...config.realtime?.fastContext,
		sources: config.realtime?.fastContext?.sources ?? defaults.realtime.fastContext.sources
	};
	const realtimeAgentContext = {
		...defaults.realtime.agentContext,
		...config.realtime?.agentContext,
		files: config.realtime?.agentContext?.files ?? defaults.realtime.agentContext.files
	};
	return {
		...defaults,
		...config,
		allowFrom: config.allowFrom ?? defaults.allowFrom,
		numbers: sanitizeVoiceCallNumberRoutes(config.numbers ?? defaults.numbers),
		outbound: {
			...defaults.outbound,
			...config.outbound
		},
		serve,
		tailscale: {
			...defaults.tailscale,
			...config.tailscale
		},
		tunnel: {
			...defaults.tunnel,
			...config.tunnel
		},
		webhookSecurity: {
			...defaults.webhookSecurity,
			...config.webhookSecurity,
			allowedHosts: config.webhookSecurity?.allowedHosts ?? defaults.webhookSecurity.allowedHosts,
			trustedProxyIPs: config.webhookSecurity?.trustedProxyIPs ?? defaults.webhookSecurity.trustedProxyIPs
		},
		streaming: {
			...defaults.streaming,
			...config.streaming,
			provider: streamingProvider,
			providers: streamingProviders
		},
		realtime: {
			...defaults.realtime,
			...config.realtime,
			provider: realtimeProvider,
			streamPath: config.realtime?.streamPath ?? defaultRealtimeStreamPathForServePath(serve.path ?? defaults.serve.path),
			tools: config.realtime?.tools ?? defaults.realtime.tools,
			consultThinkingLevel: VoiceCallRealtimeConsultThinkingLevelSchema.optional().parse(config.realtime?.consultThinkingLevel ?? defaults.realtime.consultThinkingLevel),
			consultFastMode: config.realtime?.consultFastMode ?? defaults.realtime.consultFastMode,
			fastContext: realtimeFastContext,
			agentContext: realtimeAgentContext,
			providers: realtimeProviders
		},
		tts: normalizeVoiceCallTtsConfig(defaults.tts, config.tts)
	};
}
function resolveVoiceCallSessionKey(params) {
	const explicit = params.explicitSessionKey?.trim();
	if (explicit) return resolveVoiceCallAgentSessionKey({
		config: params.config,
		sessionKey: explicit,
		coreSession: params.coreSession
	});
	if (params.config.sessionScope === "main") return resolveVoiceCallAgentSessionKey({
		config: params.config,
		sessionKey: "main",
		coreSession: params.coreSession
	});
	const prefix = `agent:${normalizeAgentId(params.config.agentId)}:voice`;
	if (params.config.sessionScope === "per-call") return `${prefix}:call:${params.callId}`.toLowerCase();
	const normalizedPhone = params.phone?.replace(/\D/g, "");
	return (normalizedPhone ? `${prefix}:${normalizedPhone}` : `${prefix}:${params.callId}`).toLowerCase();
}
/** Resolve persisted or integration-provided keys into the configured agent namespace. */
function resolveVoiceCallAgentSessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) throw new Error("Voice Call session key cannot be empty");
	const lower = sessionKey.toLowerCase();
	const agentId = normalizeAgentId(params.config.agentId);
	if (lower === "global" || lower === "unknown") return lower;
	const parsedInput = parseAgentSessionKey(sessionKey);
	let normalizedScopedKey;
	if (parsedInput && normalizeAgentId(parsedInput.agentId) === parsedInput.agentId && parsedInput.agentId === agentId) normalizedScopedKey = `agent:${parsedInput.agentId}:${parsedInput.rest}`;
	else {
		const wrappedInput = parseAgentSessionKey(`agent:${agentId}:${sessionKey}`);
		if (!wrappedInput) throw new Error("Voice Call session key could not be normalized");
		normalizedScopedKey = `agent:${agentId}:${wrappedInput.rest}`;
	}
	const canonicalMain = canonicalizeMainSessionAlias({
		cfg: { session: params.coreSession },
		agentId,
		sessionKey: normalizedScopedKey
	});
	return canonicalMain === normalizedScopedKey ? normalizedScopedKey : canonicalMain;
}
/**
* Resolves the configuration by merging environment variables into missing fields.
* Returns a new configuration object with environment variables applied.
*/
function resolveVoiceCallConfig(config) {
	const resolved = normalizeVoiceCallConfig(config);
	if (resolved.provider === "telnyx") {
		resolved.telnyx = resolved.telnyx ?? {};
		resolved.telnyx.apiKey = resolved.telnyx.apiKey ?? resolveSpeechProviderApiKey(process.env.TELNYX_API_KEY);
		resolved.telnyx.connectionId = resolved.telnyx.connectionId ?? resolveSpeechProviderApiKey(process.env.TELNYX_CONNECTION_ID);
		resolved.telnyx.publicKey = resolved.telnyx.publicKey ?? resolveSpeechProviderApiKey(process.env.TELNYX_PUBLIC_KEY);
	}
	if (resolved.provider === "twilio") {
		resolved.fromNumber = resolved.fromNumber ?? resolveSpeechProviderApiKey(process.env.TWILIO_FROM_NUMBER);
		resolved.twilio = resolved.twilio ?? {};
		resolved.twilio.accountSid = resolved.twilio.accountSid ?? resolveSpeechProviderApiKey(process.env.TWILIO_ACCOUNT_SID);
		resolved.twilio.authToken = resolved.twilio.authToken ?? resolveSpeechProviderApiKey(process.env.TWILIO_AUTH_TOKEN);
	}
	if (resolved.provider === "plivo") {
		resolved.plivo = resolved.plivo ?? {};
		resolved.plivo.authId = resolved.plivo.authId ?? resolveSpeechProviderApiKey(process.env.PLIVO_AUTH_ID);
		resolved.plivo.authToken = resolved.plivo.authToken ?? resolveSpeechProviderApiKey(process.env.PLIVO_AUTH_TOKEN);
	}
	resolved.tunnel = resolved.tunnel ?? {
		provider: "none",
		allowNgrokFreeTierLoopbackBypass: false
	};
	resolved.tunnel.allowNgrokFreeTierLoopbackBypass = resolved.tunnel.allowNgrokFreeTierLoopbackBypass ?? false;
	resolved.tunnel.ngrokAuthToken = resolved.tunnel.ngrokAuthToken ?? resolveSpeechProviderApiKey(process.env.NGROK_AUTHTOKEN);
	resolved.tunnel.ngrokDomain = resolved.tunnel.ngrokDomain ?? resolveSpeechProviderApiKey(process.env.NGROK_DOMAIN);
	resolved.webhookSecurity = resolved.webhookSecurity ?? {
		allowedHosts: [],
		trustForwardingHeaders: false,
		trustedProxyIPs: []
	};
	resolved.webhookSecurity.allowedHosts = resolved.webhookSecurity.allowedHosts ?? [];
	resolved.webhookSecurity.trustForwardingHeaders = resolved.webhookSecurity.trustForwardingHeaders ?? false;
	resolved.webhookSecurity.trustedProxyIPs = resolved.webhookSecurity.trustedProxyIPs ?? [];
	return normalizeVoiceCallConfig(resolved);
}
/**
* Validate that the configuration has all required fields for the selected provider.
*/
function validateProviderConfig(config) {
	const errors = [];
	if (!config.enabled) return {
		valid: true,
		errors: []
	};
	if (!config.provider) errors.push("plugins.entries.voice-call.config.provider is required");
	if (!config.fromNumber && config.provider !== "mock") errors.push(config.provider === "twilio" ? "plugins.entries.voice-call.config.fromNumber is required (or set TWILIO_FROM_NUMBER env)" : "plugins.entries.voice-call.config.fromNumber is required");
	if (config.provider === "telnyx") {
		if (!config.telnyx?.apiKey) errors.push("plugins.entries.voice-call.config.telnyx.apiKey is required (or set TELNYX_API_KEY env)");
		if (!config.telnyx?.connectionId) errors.push("plugins.entries.voice-call.config.telnyx.connectionId is required (or set TELNYX_CONNECTION_ID env)");
		if (!config.skipSignatureVerification && !config.telnyx?.publicKey) errors.push("plugins.entries.voice-call.config.telnyx.publicKey is required (or set TELNYX_PUBLIC_KEY env)");
	}
	if (config.provider === "twilio") {
		if (!config.twilio?.accountSid) errors.push("plugins.entries.voice-call.config.twilio.accountSid is required (or set TWILIO_ACCOUNT_SID env)");
		if (!hasConfiguredSecretInput(config.twilio?.authToken)) errors.push("plugins.entries.voice-call.config.twilio.authToken is required (or set TWILIO_AUTH_TOKEN env)");
	}
	if (config.provider === "plivo") {
		if (!config.plivo?.authId) errors.push("plugins.entries.voice-call.config.plivo.authId is required (or set PLIVO_AUTH_ID env)");
		if (!config.plivo?.authToken) errors.push("plugins.entries.voice-call.config.plivo.authToken is required (or set PLIVO_AUTH_TOKEN env)");
	}
	if (config.realtime.enabled && config.inboundPolicy === "disabled") errors.push("plugins.entries.voice-call.config.inboundPolicy must not be \"disabled\" when realtime.enabled is true");
	if (config.realtime.enabled && config.streaming.enabled) errors.push("plugins.entries.voice-call.config.realtime.enabled and plugins.entries.voice-call.config.streaming.enabled cannot both be true");
	if (config.streaming.enabled && config.provider && config.provider !== "twilio") errors.push("plugins.entries.voice-call.config.provider must be \"twilio\" when streaming.enabled is true");
	if (config.realtime.enabled && config.provider && config.provider !== "twilio" && config.provider !== "telnyx" && config.provider !== "mock") errors.push("plugins.entries.voice-call.config.provider must be \"twilio\", \"telnyx\", or \"mock\" when realtime.enabled is true");
	return {
		valid: errors.length === 0,
		errors
	};
}
//#endregion
export { resolveVoiceCallEffectiveConfig as a, resolveVoiceCallSessionKey as c, REALTIME_VOICE_END_CALL_TOOL_NAME as d, resolveVoiceCallRealtimeTools as f, resolveVoiceCallConfig as i, resolveVoiceCallStreamExposurePaths as l, normalizeVoiceCallConfig as n, resolveVoiceCallNumberRouteKeyForCall as o, resolveTwilioAuthToken as r, resolveVoiceCallPublicPathPrefix as s, VoiceCallConfigSchema as t, validateProviderConfig as u };
