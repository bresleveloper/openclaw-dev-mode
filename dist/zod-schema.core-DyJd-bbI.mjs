import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, kt as _null, nr as tuple, or as union, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { d as isValidFileSecretRefId, n as ENV_SECRET_REF_ID_RE, o as formatExecSecretRefIdValidationMessage, r as SECRET_PROVIDER_ALIAS_PATTERN, u as isValidExecSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.mjs";
import { n as MODEL_THINKING_FORMATS, t as MODEL_APIS } from "./model-config-vocabulary-CIfiDXNP.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { n as sensitive } from "./zod-schema.sensitive-3bxjhHYT.mjs";
import path from "node:path";
//#region src/config/model-provider-overlay-ids.ts
const BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS = /* @__PURE__ */ new Set([
	"amazon-bedrock",
	"amazon-bedrock-mantle",
	"anthropic",
	"anthropic-vertex",
	"arcee",
	"azure-openai-responses",
	"byteplus",
	"byteplus-plan",
	"cerebras",
	"chutes",
	"claude-cli",
	"clawrouter",
	"cloudflare-ai-gateway",
	"codex",
	"comfy",
	"copilot-proxy",
	"dashscope",
	"deepinfra",
	"deepseek",
	"fal",
	"fireworks",
	"github-copilot",
	"gmi",
	"gmi-cloud",
	"gmicloud",
	"google",
	"google-antigravity",
	"google-gemini-cli",
	"google-vertex",
	"groq",
	"huggingface",
	"kilocode",
	"kimi",
	"kimi-coding",
	"litellm",
	"lmstudio",
	"meta",
	"microsoft-foundry",
	"minimax",
	"minimax-portal",
	"mistral",
	"modelstudio",
	"moonshot",
	"moonshot-ai",
	"moonshotai",
	"nvidia",
	"novita",
	"novita-ai",
	"novitaai",
	"ollama",
	"ollama-cloud",
	"openai",
	"opencode",
	"opencode-go",
	"openrouter",
	"qianfan",
	"qwen",
	"qwen-token-plan",
	"qwencloud",
	"sglang",
	"stepfun",
	"stepfun-plan",
	"synthetic",
	"tencent-tokenhub",
	"tencent-tokenplan",
	"together",
	"venice",
	"vercel-ai-gateway",
	"vllm",
	"volcengine",
	"volcengine-plan",
	"vydra",
	"x-ai",
	"xai",
	"xiaomi",
	"xiaomi-token-plan",
	"z.ai",
	"z-ai",
	"zai"
]);
/** Identifies provider overlays already known to the bundled config contract. */
function isBuiltInModelProviderOverlayId(providerId) {
	return BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS.has(normalizeProviderId(providerId));
}
//#endregion
//#region src/config/zod-schema.allowdeny.ts
const AllowDenyActionSchema = union([literal("allow"), literal("deny")]);
const AllowDenyChatTypeSchema = union([
	literal("direct"),
	literal("group"),
	literal("channel")
]).optional();
function createAllowDenyChannelRulesSchema() {
	return object({
		default: AllowDenyActionSchema.optional(),
		rules: array(object({
			action: AllowDenyActionSchema,
			match: object({
				channel: string().optional(),
				chatType: AllowDenyChatTypeSchema,
				keyPrefix: string().optional(),
				rawKeyPrefix: string().optional()
			}).strict().optional()
		}).strict()).optional()
	}).strict().optional();
}
//#endregion
//#region src/config/zod-schema.messages.ts
const VisibleRepliesValueSchema = _enum(["automatic", "message_tool"]);
const VisibleRepliesSchema = union([VisibleRepliesValueSchema, boolean()]).overwrite((value) => {
	if (value === true) return "automatic";
	if (value === false) return "message_tool";
	return value;
});
const MentionPatternsPolicySchema = object({
	mode: union([literal("allow"), literal("deny")]).optional(),
	allowIn: array(string()).optional(),
	denyIn: array(string()).optional()
}).strict();
const GroupChatSchema = object({
	mentionPatterns: array(string()).optional(),
	historyLimit: number().int().min(0).optional(),
	unmentionedInbound: _enum(["user_request", "room_event"]).optional(),
	visibleReplies: VisibleRepliesSchema.optional()
}).strict().optional();
const DmConfigSchema = object({ historyLimit: number().int().min(0).optional() }).strict();
const QueueModeSchema = union([
	literal("steer"),
	literal("followup"),
	literal("collect"),
	literal("interrupt")
]);
const QueueDropSchema = union([
	literal("old"),
	literal("new"),
	literal("summarize")
]);
const QueueModeBySurfaceSchema = object({
	whatsapp: QueueModeSchema.optional(),
	telegram: QueueModeSchema.optional(),
	discord: QueueModeSchema.optional(),
	irc: QueueModeSchema.optional(),
	googlechat: QueueModeSchema.optional(),
	slack: QueueModeSchema.optional(),
	mattermost: QueueModeSchema.optional(),
	signal: QueueModeSchema.optional(),
	imessage: QueueModeSchema.optional(),
	msteams: QueueModeSchema.optional(),
	webchat: QueueModeSchema.optional(),
	matrix: QueueModeSchema.optional()
}).strict().optional();
const DebounceMsBySurfaceSchema = record(string(), number().int().nonnegative()).optional();
const QueueSchema = object({
	mode: QueueModeSchema.optional(),
	byChannel: QueueModeBySurfaceSchema,
	debounceMsByChannel: DebounceMsBySurfaceSchema,
	cap: number().int().positive().optional(),
	drop: QueueDropSchema.optional()
}).strict().optional();
const InboundDebounceSchema = object({
	debounceMs: number().int().nonnegative().optional(),
	byChannel: DebounceMsBySurfaceSchema
}).strict().optional();
const NativeCommandsSettingSchema = union([boolean(), literal("auto")]);
const ProviderCommandsSchema = object({
	native: NativeCommandsSettingSchema.optional(),
	nativeSkills: NativeCommandsSettingSchema.optional()
}).strict().optional();
const ResponseUsageModeSchema = _enum([
	"on",
	"off",
	"tokens",
	"full"
]);
const MessagesSchema = object({
	visibleReplies: VisibleRepliesSchema.optional(),
	responsePrefix: string().optional(),
	usageTemplate: union([string(), record(string(), unknown())]).optional(),
	responseUsage: union([ResponseUsageModeSchema, record(string(), ResponseUsageModeSchema)]).optional(),
	groupChat: GroupChatSchema,
	queue: QueueSchema,
	inbound: InboundDebounceSchema,
	ackReaction: string().optional(),
	ackReactionScope: _enum([
		"group-mentions",
		"group-all",
		"direct",
		"all",
		"off",
		"none"
	]).optional(),
	statusReactions: object({ enabled: boolean().optional() }).strict().optional()
}).strict().optional();
const BroadcastStrategySchema = _enum(["parallel", "sequential"]);
const BroadcastGroupSchema = strictObject({
	agents: array(string()).max(16),
	mentionGating: boolean().optional(),
	maxRounds: number().int().min(1).max(4).optional(),
	maxTurns: number().int().min(1).max(32).optional()
});
const BroadcastSchema = object({ strategy: BroadcastStrategySchema.optional() }).catchall(union([array(string()), BroadcastGroupSchema])).superRefine((broadcast, ctx) => {
	for (const [peerId, entry] of Object.entries(broadcast)) {
		if (typeof entry !== "object") continue;
		const qualified = /^[a-z][a-z0-9_-]*:.+$/i.test(peerId);
		if (!Array.isArray(entry) && !qualified) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [peerId],
			message: "Group options require a channel-qualified key (<channel>:<peerId>)."
		});
		else if (Array.isArray(entry) && qualified && entry.length > 16) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [peerId],
			message: "Agent group threads support at most 16 agents."
		});
	}
}).optional();
//#endregion
//#region src/config/zod-schema.secret-input.ts
const EnvSecretRefSchema = object({
	source: literal("env"),
	provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
	id: string().regex(ENV_SECRET_REF_ID_RE, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
}).strict();
const FileSecretRefSchema = object({
	source: literal("file"),
	provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
	id: string().refine(isValidFileSecretRefId, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
}).strict();
const ExecSecretRefSchema = object({
	source: literal("exec"),
	provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
	id: string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())
}).strict();
const StoreSecretRefSchema = object({
	source: literal("store"),
	provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
	id: string().regex(ENV_SECRET_REF_ID_RE, "Store secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
}).strict();
/** Config-level secret reference schema shared by model/provider/plugin credential fields. */
const SecretRefSchema = discriminatedUnion("source", [
	EnvSecretRefSchema,
	FileSecretRefSchema,
	ExecSecretRefSchema,
	StoreSecretRefSchema
]);
/** Accepts either legacy inline secret strings or structured secret references. */
const SecretInputSchema = union([string(), SecretRefSchema]);
//#endregion
//#region src/config/zod-schema.core.ts
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
function isAbsolutePath(value) {
	return path.isAbsolute(value) || WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value);
}
/** Canonical operator-configurable SSRF policy shared by network-capable surfaces. */
const SsrFPolicyConfigSchema = object({
	dangerouslyAllowPrivateNetwork: boolean().optional(),
	allowRfc2544BenchmarkRange: boolean().optional(),
	allowIpv6UniqueLocalRange: boolean().optional(),
	allowedHostnames: array(string()).optional(),
	blockedHostnames: array(string()).optional()
}).strict();
const SecretsEnvProviderSchema = object({
	source: literal("env"),
	/** Optional env var allowlist (exact names). */
	allowlist: array(string().regex(ENV_SECRET_REF_ID_RE)).max(256).optional()
}).strict();
const SecretsFileProviderSchema = object({
	source: literal("file"),
	path: string().min(1),
	mode: union([literal("singleValue"), literal("json")]).optional(),
	timeoutMs: number().int().positive().max(12e4).optional(),
	maxBytes: number().int().positive().max(20971520).optional()
}).strict();
const SecretsManualExecProviderSchema = object({
	source: literal("exec"),
	command: string().min(1).refine((value) => isSafeExecutableValue(value), "secrets.providers.*.command is unsafe.").refine((value) => isAbsolutePath(value), "secrets.providers.*.command must be an absolute path."),
	args: array(string().max(1024)).max(128).optional(),
	timeoutMs: number().int().positive().max(12e4).optional(),
	noOutputTimeoutMs: number().int().positive().max(12e4).optional(),
	maxOutputBytes: number().int().positive().max(20971520).optional(),
	jsonOnly: boolean().optional(),
	env: record(string(), string()).optional(),
	passEnv: array(string().regex(ENV_SECRET_REF_ID_RE)).max(128).optional(),
	trustedDirs: array(string().min(1).refine((value) => isAbsolutePath(value), "trustedDirs entries must be absolute paths.")).max(64).optional()
}).strict();
const SecretsPluginIntegrationExecProviderSchema = object({
	source: literal("exec"),
	pluginIntegration: object({
		pluginId: string().min(1).max(128),
		integrationId: string().min(1).max(128)
	}).strict()
}).strict();
const SecretsExecProviderSchema = union([SecretsManualExecProviderSchema, SecretsPluginIntegrationExecProviderSchema]);
const SecretsStoreProviderSchema = object({ source: literal("store") }).strict();
const EgressProxyExactHostSchema = string().trim().min(1).superRefine((host, ctx) => {
	try {
		normalizeExactAllowedHost(host);
	} catch (error) {
		ctx.addIssue({
			code: "custom",
			message: error instanceof Error ? error.message : "Invalid allowed host"
		});
	}
});
/** Schema for one configured env/file/exec/store secret provider entry. */
const SecretProviderSchema = union([
	SecretsEnvProviderSchema,
	SecretsFileProviderSchema,
	SecretsExecProviderSchema,
	SecretsStoreProviderSchema
]);
/** Schema for the top-level `secrets` config block. */
const SecretsConfigSchema = object({
	egressProxy: object({
		enabled: boolean().optional(),
		allowedHosts: array(EgressProxyExactHostSchema).max(256).optional(),
		bypassHosts: array(EgressProxyExactHostSchema).max(256).optional()
	}).strict().optional(),
	providers: object({}).catchall(SecretProviderSchema).optional(),
	defaults: object({
		env: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		file: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		exec: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		store: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional()
	}).strict().optional()
}).strict().optional();
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
const ModelApiSchema = _enum(MODEL_APIS, { error: (issue) => issue.input === LEGACY_OPENAI_CODEX_RESPONSES_API ? `"${LEGACY_OPENAI_CODEX_RESPONSES_API}" is a removed api id; use "${OPENAI_CHATGPT_RESPONSES_API}"` : void 0 });
const RoutingPercentileCutoffsSchema = object({
	p50: number().optional(),
	p75: number().optional(),
	p90: number().optional(),
	p99: number().optional()
}).strict();
const OpenRouterRoutingSchema = object({
	allow_fallbacks: boolean().optional(),
	require_parameters: boolean().optional(),
	data_collection: _enum(["deny", "allow"]).optional(),
	zdr: boolean().optional(),
	enforce_distillable_text: boolean().optional(),
	order: array(string()).optional(),
	only: array(string()).optional(),
	ignore: array(string()).optional(),
	quantizations: array(string()).optional(),
	sort: union([string(), object({
		by: string().optional(),
		partition: string().nullable().optional()
	}).strict()]).optional(),
	max_price: object({
		prompt: union([number(), string()]).optional(),
		completion: union([number(), string()]).optional(),
		image: union([number(), string()]).optional(),
		audio: union([number(), string()]).optional(),
		request: union([number(), string()]).optional()
	}).strict().optional(),
	preferred_min_throughput: union([number(), RoutingPercentileCutoffsSchema]).optional(),
	preferred_max_latency: union([number(), RoutingPercentileCutoffsSchema]).optional()
}).strict();
const VercelGatewayRoutingSchema = object({
	only: array(string()).optional(),
	order: array(string()).optional()
}).strict();
const ModelCompatSchema = object({
	/** Whether the provider supports the `store` field. Default: auto-detected from URL. */
	supportsStore: boolean().optional(),
	/** Whether provider accepts prompt-cache/session affinity keys. */
	supportsPromptCacheKey: boolean().optional(),
	/** Opts this model into stored HTTP continuation on a verified compatible endpoint. */
	supportsResponsesContinuation: boolean().optional(),
	/** Whether the provider supports the `developer` role (vs `system`). Default: auto-detected from URL. */
	supportsDeveloperRole: boolean().optional(),
	/** Whether the provider supports `reasoning_effort`. Default: auto-detected from URL. */
	supportsReasoningEffort: boolean().optional(),
	/** Whether the model accepts the `temperature` parameter. Default: true. */
	supportsTemperature: boolean().optional(),
	/**
	* Whether the provider honors top-level `instructions`. Defaults to true only for verified
	* native routes (OpenAI, xAI); every other route defaults to false and embeds the system
	* prompt in `input` unless set true here after verifying against that endpoint.
	*/
	supportsInstructions: boolean().optional(),
	/**
	* Whether the provider supports `stream_options: { include_usage: true }` for token usage in
	* streaming responses. Default: true.
	*/
	supportsUsageInStreaming: boolean().optional(),
	/** Whether this model supports tool/function calling. */
	supportsTools: boolean().optional(),
	/** Code-mode tier consumed by `tools.codeMode.enabled: "auto"`; absent means "capable". */
	codeMode: _enum(["preferred", "capable"]).optional(),
	/** Whether the provider supports the `strict` field in tool definitions. Default: true. */
	supportsStrictMode: boolean().optional(),
	/**
	* Whether the provider supports JSON Schema through `response_format`. Default: false for
	* unknown compatible endpoints.
	*/
	supportsJsonSchemaResponseFormat: boolean().optional(),
	/** Whether all message parts must be coerced to plain strings. */
	requiresStringContent: boolean().optional(),
	/** Whether unknown message payload keys must be stripped before requests. */
	strictMessageKeys: boolean().optional(),
	/** Reasoning detail block types safe to expose in visible transcripts. */
	visibleReasoningDetailTypes: array(string().min(1)).optional(),
	/** Provider-accepted reasoning effort labels. */
	supportedReasoningEfforts: array(string().min(1)).optional(),
	/** Per-level reasoning effort overrides, e.g. map "off" to "low" for models that cannot disable thinking. */
	reasoningEffortMap: record(string().min(1), string().min(1)).optional(),
	/** Which field to use for max tokens. Default: auto-detected from URL. */
	maxTokensField: union([literal("max_completion_tokens"), literal("max_tokens")]).optional(),
	/** Reasoning/thinking payload dialect for provider-compatible APIs. */
	thinkingFormat: _enum(MODEL_THINKING_FORMATS).optional(),
	/** Whether tool results require the `name` field. Default: auto-detected from URL. */
	requiresToolResultName: boolean().optional(),
	/**
	* Whether a user message after tool results requires an assistant message in between. Default:
	* auto-detected from URL.
	*/
	requiresAssistantAfterToolResult: boolean().optional(),
	/**
	* Whether thinking blocks must be converted to text blocks with <thinking> delimiters.
	* Default: auto-detected from URL.
	*/
	requiresThinkingAsText: boolean().optional(),
	/**
	* Whether all replayed assistant messages must include an empty reasoning_content field when
	* reasoning is enabled. Default: auto-detected from URL.
	*/
	requiresReasoningContentOnAssistantMessages: boolean().optional(),
	/** Named tool-schema profile used by provider adapters. */
	toolSchemaProfile: string().optional(),
	/** JSON Schema keywords rejected by this provider's tool schema validator. */
	unsupportedToolSchemaKeywords: array(string().min(1)).optional(),
	/** Encoding expected for tool-call arguments in provider payloads. */
	toolCallArgumentsEncoding: string().optional(),
	/** Whether OpenAI-style calls must be reshaped to Anthropic-compatible tool payloads. */
	requiresOpenAiAnthropicToolPayload: boolean().optional(),
	/** OpenRouter-specific routing preferences. Only used when baseUrl points to OpenRouter. */
	openRouterRouting: OpenRouterRoutingSchema.optional(),
	/** Vercel AI Gateway routing preferences. Only used when baseUrl points to Vercel AI Gateway. */
	vercelGatewayRouting: VercelGatewayRoutingSchema.optional(),
	/** Whether z.ai supports top-level `tool_stream: true` for streaming tool call deltas. Default: false. */
	zaiToolStream: boolean().optional(),
	/**
	* Cache control convention for prompt caching. "anthropic" applies Anthropic-style
	* `cache_control` markers to the system prompt, last tool definition, and last user/assistant
	* text content.
	*/
	cacheControlFormat: literal("anthropic").optional(),
	/**
	* Whether to send known session-affinity headers (`session_id`, `x-client-request-id`,
	* `x-session-affinity`) from `options.sessionId` when caching is enabled. Default: false.
	*/
	sendSessionAffinityHeaders: boolean().optional(),
	/**
	* Whether to send the OpenAI `session_id` cache-affinity header from `options.sessionId` when
	* caching is enabled. Default: true.
	*/
	sendSessionIdHeader: boolean().optional(),
	/**
	* Whether the provider accepts per-tool `eager_input_streaming`. When false, the Anthropic
	* provider omits `tools[].eager_input_streaming` and sends the legacy
	* `fine-grained-tool-streaming-2025-05-14` beta header for tool-enabled requests. Default:
	* true.
	*/
	supportsEagerToolInputStreaming: boolean().optional(),
	/**
	* Whether the provider supports long prompt cache retention (`prompt_cache_retention: "24h"`
	* or Anthropic-style `cache_control.ttl: "1h"`, depending on format). Default: true. Whether
	* the provider supports `prompt_cache_retention: "24h"`. Default: true. Whether the provider
	* supports Anthropic long cache retention (`cache_control.ttl: "1h"`). Default: true.
	*/
	supportsLongCacheRetention: boolean().optional()
}).strict().optional();
const ConfiguredProviderRequestTlsSchema = object({
	ca: SecretInputSchema.optional().register(sensitive),
	cert: SecretInputSchema.optional().register(sensitive),
	key: SecretInputSchema.optional().register(sensitive),
	passphrase: SecretInputSchema.optional().register(sensitive),
	serverName: string().optional(),
	insecureSkipVerify: boolean().optional()
}).strict().optional();
const ConfiguredProviderRequestAuthSchema = union([
	object({ mode: literal("provider-default") }).strict(),
	object({
		mode: literal("authorization-bearer"),
		token: SecretInputSchema.register(sensitive)
	}).strict(),
	object({
		mode: literal("header"),
		headerName: string().min(1),
		value: SecretInputSchema.register(sensitive),
		prefix: string().optional()
	}).strict()
]).optional();
const ConfiguredProviderRequestProxySchema = union([object({
	mode: literal("env-proxy"),
	tls: ConfiguredProviderRequestTlsSchema
}).strict(), object({
	mode: literal("explicit-proxy"),
	url: string().min(1),
	tls: ConfiguredProviderRequestTlsSchema
}).strict()]).optional();
const ConfiguredProviderRequestFields = {
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	auth: ConfiguredProviderRequestAuthSchema,
	proxy: ConfiguredProviderRequestProxySchema,
	tls: ConfiguredProviderRequestTlsSchema
};
const ConfiguredProviderRequestSchema = object(ConfiguredProviderRequestFields).strict().optional();
const ConfiguredModelProviderRequestSchema = object({
	...ConfiguredProviderRequestFields,
	allowPrivateNetwork: boolean().optional()
}).strict().optional();
const ModelAgentRuntimePolicySchema = object({ id: string().optional() }).strict().optional();
const ModelImageInputSchema = object({
	maxBytes: number().int().positive().optional(),
	maxPixels: number().int().positive().optional(),
	maxSidePx: number().int().positive().optional(),
	preferredSidePx: number().int().positive().optional(),
	tokenMode: union([
		literal("tile"),
		literal("detail"),
		literal("provider")
	]).optional()
}).strict();
const ModelMediaInputSchema = object({ image: ModelImageInputSchema.optional() }).strict();
const ThinkingLevelMapValueSchema = string().nullable();
const ThinkingLevelMapSchema = object({
	off: ThinkingLevelMapValueSchema.optional(),
	minimal: ThinkingLevelMapValueSchema.optional(),
	low: ThinkingLevelMapValueSchema.optional(),
	medium: ThinkingLevelMapValueSchema.optional(),
	high: ThinkingLevelMapValueSchema.optional(),
	xhigh: ThinkingLevelMapValueSchema.optional(),
	max: ThinkingLevelMapValueSchema.optional()
}).strict();
const ModelDefinitionSchema = object({
	/** Provider-facing model id. */
	id: string().min(1),
	/** Human-readable display name. */
	name: string().min(1),
	/** Optional API adapter override for this model. */
	api: ModelApiSchema.optional(),
	/** Optional base URL override for this model. */
	baseUrl: string().min(1).optional(),
	reasoning: boolean().optional(),
	input: array(union([
		literal("text"),
		literal("image"),
		literal("video"),
		literal("audio")
	])).optional(),
	cost: object({
		input: number().optional(),
		output: number().optional(),
		cacheRead: number().optional(),
		cacheWrite: number().optional(),
		tieredPricing: array(object({
			input: number(),
			output: number(),
			cacheRead: number(),
			cacheWrite: number(),
			range: union([tuple([number(), number()]), tuple([number()])])
		}).strict()).optional()
	}).strict().optional(),
	/** Provider/native maximum context window in tokens. */
	contextWindow: number().positive().optional(),
	/**
	* Optional effective runtime cap used for compaction/session budgeting.
	* Keeps provider/native contextWindow metadata intact while letting configs
	* prefer a smaller practical window.
	*/
	contextTokens: number().int().positive().optional(),
	maxTokens: number().positive().optional(),
	/** Maps OpenClaw thinking levels to provider/model-specific values. */
	thinkingLevelMap: ThinkingLevelMapSchema.optional(),
	/** Provider-specific request/runtime parameters passed through to provider plugins. */
	params: record(string(), unknown()).optional(),
	/** Optional agent execution runtime override for this provider/model pair. */
	agentRuntime: ModelAgentRuntimePolicySchema,
	/** Static headers merged into requests for this model. */
	headers: record(string(), string()).optional(),
	/** Provider compatibility flags for payload shaping and feature gating. */
	compat: ModelCompatSchema,
	/** Media input limits used by routing and preflight compression. */
	mediaInput: ModelMediaInputSchema.optional(),
	/** Metadata source marker for models added by CLI/catalog tooling. */
	metadataSource: literal("models-add").optional()
}).strict();
const ModelProviderLocalServiceSchema = object({
	/** Executable started before model requests are sent. */
	command: string().min(1),
	/** Arguments passed without shell expansion. */
	args: array(string()).optional(),
	/** Working directory for the local service process. */
	cwd: string().min(1).optional(),
	/** Environment variables added to the service process. */
	env: record(string(), string().register(sensitive)).optional(),
	/** Optional health endpoint polled before the provider is considered ready. */
	healthUrl: string().min(1).optional(),
	/** Startup readiness timeout in milliseconds. */
	readyTimeoutMs: number().int().positive().optional(),
	/** Idle timeout in milliseconds before stopping the local service. */
	idleStopMs: number().int().nonnegative().optional()
}).strict().optional();
const ModelProviderSchema = object({
	baseUrl: string().optional(),
	/** API key or secret reference for this provider. */
	apiKey: SecretInputSchema.optional().register(sensitive),
	/** Authentication mode used when resolving credentials for this provider. */
	auth: union([
		literal("api-key"),
		literal("aws-sdk"),
		literal("oauth"),
		literal("token")
	]).optional(),
	/** Default API adapter for models under this provider. */
	api: ModelApiSchema.optional(),
	/** Provider-level default max output tokens. */
	maxTokens: number().positive().optional(),
	/** Provider request timeout in seconds. */
	timeoutSeconds: number().int().positive().optional(),
	/** Optional provider deployment/API region used by provider plugins that expose regional endpoints. */
	region: string().min(1).optional(),
	injectNumCtxForOpenAICompat: boolean().optional(),
	/** Provider-specific runtime parameters interpreted by provider plugins. */
	params: record(string(), unknown()).optional(),
	/** Optional default agent execution runtime for models under this provider. */
	agentRuntime: ModelAgentRuntimePolicySchema,
	/** Optional local service to start before calling this provider. */
	localService: ModelProviderLocalServiceSchema,
	/** Secret-bearing headers merged into provider requests. */
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	/** Whether default Authorization header injection is enabled. */
	authHeader: boolean().optional(),
	/** Provider request transport/retry overrides. */
	request: ConfiguredModelProviderRequestSchema,
	models: array(ModelDefinitionSchema).optional()
}).strict();
const ModelProvidersSchema = record(string(), ModelProviderSchema).superRefine((providers, ctx) => {
	for (const [providerId, provider] of Object.entries(providers)) {
		if (isBuiltInModelProviderOverlayId(providerId)) continue;
		if (!provider.baseUrl) ctx.addIssue({
			code: "custom",
			path: [providerId, "baseUrl"],
			message: "custom model providers must declare baseUrl; provider overlays without baseUrl are only supported for bundled providers"
		});
		if (!Array.isArray(provider.models)) ctx.addIssue({
			code: "custom",
			path: [providerId, "models"],
			message: "custom model providers must declare models; provider overlays without models are only supported for bundled providers"
		});
	}
});
const ModelCatalogRefreshConfigSchema = object({
	/** Fetch model catalog updates from the hosted OpenClaw catalog. Default: true. */
	enabled: boolean().optional(),
	/** Override the hosted catalog URL (HTTPS mirrors, or localhost HTTP for testing). */
	url: string().refine((value) => {
		try {
			const parsed = new URL(value);
			return parsed.protocol === "https:" || parsed.protocol === "http:" && [
				"localhost",
				"127.0.0.1",
				"[::1]"
			].includes(parsed.hostname);
		} catch {
			return false;
		}
	}, { message: "models.catalogRefresh.url must use https, or http on localhost" }).optional()
}).strict().optional();
const ModelsConfigSchema = object({
	/** Merge provider config with bundled catalogs or replace bundled catalogs entirely. */
	mode: union([literal("merge"), literal("replace")]).optional(),
	providers: ModelProvidersSchema.optional(),
	/** Hosted model catalog refresh settings. */
	catalogRefresh: ModelCatalogRefreshConfigSchema
}).strict().optional();
const IdentitySchema = object({
	name: string().optional(),
	theme: string().optional(),
	emoji: string().optional(),
	avatar: string().optional()
}).strict().optional();
const ReplyToModeSchema = union([
	literal("off"),
	literal("first"),
	literal("all"),
	literal("batched")
]);
const TypingModeSchema = union([
	literal("never"),
	literal("instant"),
	literal("thinking"),
	literal("message")
]);
const GroupPolicySchema = _enum([
	"open",
	"disabled",
	"allowlist"
]);
const DmPolicySchema = _enum([
	"pairing",
	"allowlist",
	"open",
	"disabled"
]);
const ContextVisibilityModeSchema = _enum([
	"all",
	"allowlist",
	"allowlist_quote"
]);
const BlockStreamingCoalesceSchema = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	idleMs: number().int().nonnegative().optional()
}).strict();
const TextChunkModeSchema = _enum(["length", "newline"]);
const ChannelStreamingBlockSchema = object({
	enabled: boolean().optional(),
	coalesce: BlockStreamingCoalesceSchema.optional()
}).strict();
/** Delivery-only nested streaming config for channels without preview modes. */
const ChannelDeliveryStreamingConfigSchema = object({
	chunkMode: TextChunkModeSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
}).strict();
const ReplyRuntimeConfigSchemaShape = {
	historyLimit: number().int().min(0).optional(),
	dmHistoryLimit: number().int().min(0).optional(),
	contextVisibility: ContextVisibilityModeSchema.optional(),
	dms: record(string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: number().int().positive().optional(),
	streaming: ChannelDeliveryStreamingConfigSchema.optional(),
	responsePrefix: string().optional(),
	mediaMaxMb: number().positive().optional()
};
const BlockStreamingChunkSchema = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	breakPreference: union([
		literal("paragraph"),
		literal("newline"),
		literal("sentence")
	]).optional()
}).strict();
const MarkdownTableModeSchema = _enum([
	"off",
	"bullets",
	"code",
	"block"
]);
const MarkdownConfigSchema = object({ tables: MarkdownTableModeSchema.optional() }).strict().optional();
const TtsProviderSchema = string().min(1);
const TtsModeSchema = _enum(["final", "all"]);
const TtsAutoSchema = _enum([
	"off",
	"always",
	"inbound",
	"tagged"
]);
const TtsProviderConfigSchema = object({ apiKey: SecretInputSchema.optional().register(sensitive) }).catchall(union([
	string(),
	number(),
	boolean(),
	_null(),
	array(unknown()),
	record(string(), unknown())
]));
const TtsPersonaSchema = object({
	label: string().optional(),
	description: string().optional(),
	provider: TtsProviderSchema.optional(),
	fallbackPolicy: union([
		literal("preserve-persona"),
		literal("provider-defaults"),
		literal("fail")
	]).optional(),
	providers: record(string(), TtsProviderConfigSchema).optional()
}).strict();
const TtsConfigSchema = object({
	auto: TtsAutoSchema.optional(),
	enabled: boolean().optional(),
	mode: TtsModeSchema.optional(),
	provider: TtsProviderSchema.optional(),
	persona: string().optional(),
	personas: record(string(), TtsPersonaSchema).optional(),
	summaryModel: string().optional(),
	modelOverrides: object({
		enabled: boolean().optional(),
		allowText: boolean().optional(),
		allowProvider: boolean().optional(),
		allowVoice: boolean().optional(),
		allowModelId: boolean().optional(),
		allowVoiceSettings: boolean().optional(),
		allowNormalization: boolean().optional(),
		allowSeed: boolean().optional()
	}).strict().optional(),
	providers: record(string(), TtsProviderConfigSchema).optional(),
	maxTextLength: number().int().min(1).optional(),
	timeoutMs: number().int().min(1e3).max(12e4).optional()
}).strict().optional();
const HumanDelaySchema = object({
	mode: union([
		literal("off"),
		literal("natural"),
		literal("custom")
	]).optional(),
	minMs: number().int().nonnegative().optional(),
	maxMs: number().int().nonnegative().optional()
}).strict();
const normalizeAllowFrom = (values) => normalizeStringEntries(values);
/**
* Canonical cross-field check for dmPolicy vs allowFrom. This is the single
* source of truth shared by the Zod schema refinements and the CLI config
* validator so the rule cannot drift between the two surfaces.
*/
const evaluateDmPolicyAllowFromDependency = (params) => {
	const allow = normalizeAllowFrom(params.allowFrom);
	if (params.policy === "open" && !allow.includes("*")) return "open_requires_wildcard";
	if (params.policy === "allowlist" && allow.length === 0) return "allowlist_requires_entries";
	return null;
};
const requireOpenAllowFrom = (params) => {
	if (evaluateDmPolicyAllowFromDependency({
		policy: params.policy,
		allowFrom: params.allowFrom
	}) !== "open_requires_wildcard") return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path,
		message: params.message
	});
};
/**
* Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
* Without this, all DMs are silently dropped because the allowlist is empty
* and no senders can match.
*/
const requireAllowlistAllowFrom = (params) => {
	if (evaluateDmPolicyAllowFromDependency({
		policy: params.policy,
		allowFrom: params.allowFrom
	}) !== "allowlist_requires_entries") return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path,
		message: params.message
	});
};
const MSTeamsReplyStyleSchema = _enum(["thread", "top-level"]);
const HexColorSchema = string().regex(/^#?[0-9a-fA-F]{6}$/, "expected hex color (RRGGBB)");
const ExecutableTokenSchema = string().refine(isSafeExecutableValue, "expected safe executable name or path");
const MediaUnderstandingScopeSchema = createAllowDenyChannelRulesSchema();
const MediaUnderstandingAttachmentsSchema = object({
	/** Select the first matching attachment or process multiple. */
	mode: union([literal("first"), literal("all")]).optional(),
	/** Max number of attachments to process (default: 1). */
	maxAttachments: number().int().positive().optional(),
	/** Attachment ordering preference. */
	prefer: union([
		literal("first"),
		literal("last"),
		literal("path"),
		literal("url")
	]).optional()
}).strict().optional();
const MediaUnderstandingCapabilitiesSchema = array(union([
	literal("image"),
	literal("audio"),
	literal("video")
])).optional();
const ProviderOptionValueSchema = union([
	string(),
	number(),
	boolean()
]);
const ProviderOptionsSchema = record(string(), record(string(), ProviderOptionValueSchema)).optional();
const MediaUnderstandingRuntimeFields = {
	/** Optional prompt override for this model entry. */
	/** Default prompt. */
	prompt: string().optional(),
	/** Optional timeout override (seconds) for this model entry. */
	/** Default timeout (seconds). */
	timeoutSeconds: number().int().positive().optional(),
	/** Optional language hint for audio transcription. */
	/** Default language hint (audio). */
	language: string().optional(),
	/** Optional provider-specific query params (merged into requests). */
	providerOptions: ProviderOptionsSchema,
	/** Optional base URL override for provider requests. */
	baseUrl: string().optional(),
	/** Optional headers merged into provider requests. */
	headers: record(string(), string()).optional(),
	/** Optional request transport overrides for provider HTTP calls. */
	request: ConfiguredProviderRequestSchema
};
const MediaUnderstandingModelSchema = object({
	/** provider API id (e.g. openai, google). */
	provider: string().optional(),
	/** Model id for provider-based understanding. */
	model: string().optional(),
	/** Optional capability tags for shared model lists. */
	capabilities: MediaUnderstandingCapabilitiesSchema,
	/** Use a CLI command instead of provider API. */
	type: union([literal("provider"), literal("cli")]).optional(),
	/** CLI binary (required when type=cli). */
	command: string().optional(),
	/** CLI args (template-enabled). */
	args: array(string()).optional(),
	/** Optional max output characters for this model entry. */
	maxChars: number().int().positive().optional(),
	/** Optional max bytes for this model entry. */
	maxBytes: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	/** Auth profile id to use for this provider. */
	profile: string().optional(),
	/** Preferred profile id if multiple are available. */
	preferredProfile: string().optional()
}).strict().optional();
const ToolsMediaCapabilitySchema = object({
	enabled: boolean().optional(),
	preferredModel: string().trim().min(1).optional(),
	scope: MediaUnderstandingScopeSchema,
	maxBytes: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	attachments: MediaUnderstandingAttachmentsSchema
}).strict().optional();
const ToolsMediaAudioSchema = object({
	/** Enable media understanding when models are configured. */
	enabled: boolean().optional(),
	/** Prefer a matching shared model entry. */
	preferredModel: string().trim().min(1).optional(),
	/** Optional scope gating for understanding. */
	scope: MediaUnderstandingScopeSchema,
	/** Default max bytes to send. */
	maxBytes: number().int().positive().optional(),
	/** Default max output characters. */
	maxChars: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	/** Attachment selection policy. */
	attachments: MediaUnderstandingAttachmentsSchema,
	/**
	* Echo the audio transcript back to the originating chat before agent processing.
	* Lets users verify what was heard. Default: false.
	*/
	echoTranscript: boolean().optional(),
	/**
	* Format string for the echoed transcript. Use `{transcript}` as placeholder.
	* Default: '📝 "{transcript}"'
	*/
	echoFormat: string().optional()
}).strict().optional();
const ToolsMediaSchema = object({
	models: array(MediaUnderstandingModelSchema).optional(),
	concurrency: number().int().positive().optional(),
	image: ToolsMediaCapabilitySchema.optional(),
	audio: ToolsMediaAudioSchema.optional(),
	video: ToolsMediaCapabilitySchema.optional()
}).strict().optional();
const LinkModelSchema = object({
	/** Use a CLI command for link processing. */
	type: literal("cli").optional(),
	command: string().min(1),
	args: array(string()).optional(),
	timeoutSeconds: number().int().positive().optional()
}).strict();
const ToolsLinksSchema = object({
	/** Enable link understanding when models are configured. */
	enabled: boolean().optional(),
	scope: MediaUnderstandingScopeSchema,
	/** Max number of links to process per message. */
	maxLinks: number().int().positive().optional(),
	timeoutSeconds: number().int().positive().optional(),
	/** Ordered model list (fallbacks in order). */
	models: array(LinkModelSchema).optional()
}).strict().optional();
//#endregion
export { requireOpenAllowFrom as A, createAllowDenyChannelRulesSchema as B, TtsAutoSchema as C, TypingModeSchema as D, TtsProviderSchema as E, GroupChatSchema as F, MentionPatternsPolicySchema as I, MessagesSchema as L, SecretRefSchema as M, BroadcastSchema as N, evaluateDmPolicyAllowFromDependency as O, DmConfigSchema as P, NativeCommandsSettingSchema as R, ToolsMediaSchema as S, TtsModeSchema as T, isBuiltInModelProviderOverlayId as V, SecretProviderSchema as _, ContextVisibilityModeSchema as a, TextChunkModeSchema as b, GroupPolicySchema as c, IdentitySchema as d, MSTeamsReplyStyleSchema as f, ReplyToModeSchema as g, ReplyRuntimeConfigSchemaShape as h, ChannelStreamingBlockSchema as i, SecretInputSchema as j, requireAllowlistAllowFrom as k, HexColorSchema as l, ModelsConfigSchema as m, BlockStreamingCoalesceSchema as n, DmPolicySchema as o, MarkdownConfigSchema as p, ChannelDeliveryStreamingConfigSchema as r, ExecutableTokenSchema as s, BlockStreamingChunkSchema as t, HumanDelaySchema as u, SecretsConfigSchema as v, TtsConfigSchema as w, ToolsLinksSchema as x, SsrFPolicyConfigSchema as y, ProviderCommandsSchema as z };
