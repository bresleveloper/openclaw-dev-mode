import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as ENV_SECRET_REF_ID_RE, r as SECRET_PROVIDER_ALIAS_PATTERN } from "./ref-contract-D0kWy5jy.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, kt as _null, nr as tuple, or as union, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { t as isSafeExecutableValue } from "./exec-safety-2Pps-JeG.mjs";
import { n as MODEL_THINKING_FORMATS, t as MODEL_APIS } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import { t as ALL_THINKING_LEVELS } from "./thinking.shared-Jy32Vp-O.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { n as sensitive, r as SecretInputSchema } from "./zod-schema.sensitive-bEFwMmOC.mjs";
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
	"kie",
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
	"runway",
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
//#region src/config/zod-schema.agent-model.ts
/** Decision providers require an explicit model; an empty value disables the role. */
const DecisionModelSchema = string().trim().max(512).refine((value) => value === "" || parseProviderModelRef(value) !== null, "Expected provider/model, or an empty string to disable decision models.");
/** Schema for agent model config accepting a string or fallback object. */
const AgentModelSchema = union([string(), strictObject({
	/** Primary model (provider/model). */
	primary: string().optional(),
	/** Per-agent model fallbacks (provider/model). */
	fallbacks: array(string()).optional()
})]);
const AgentToolModelSchema = union([string(), strictObject({
	primary: string().optional(),
	/** Per-tool model fallbacks (provider/model). */
	fallbacks: array(string()).optional(),
	/** Optional provider request timeout in milliseconds for capabilities that support it. */
	timeoutMs: number().int().positive().optional()
})]);
//#endregion
//#region src/config/zod-schema.agent-entry-base.ts
const AgentRuntimePolicySchema = strictObject({ id: string().optional() }).optional();
const AgentModelRuntimeEntrySchema = strictObject({
	/** Optional display/lookup alias for this provider/model entry. */
	alias: string().optional(),
	/** Provider-specific API parameters (e.g., GLM-4.7 thinking mode). */
	params: record(string(), unknown()).optional(),
	/** Optional agent execution runtime for this specific provider/model entry. */
	agentRuntime: AgentRuntimePolicySchema,
	/** Additional explicit runtime choices in the model picker; does not change the default. */
	pickerRuntimes: array(string().trim().min(1).max(128).regex(/^[a-z][a-z0-9-]*$/).refine((id) => id !== "auto" && id !== "default")).max(8).optional(),
	/** OpenClaw Code Mode override; omitted inherits the enclosing activation policy. */
	codeMode: boolean().optional(),
	/** Enable streaming for this model (default: true, false for Ollama to avoid SDK issue #1205). */
	streaming: boolean().optional()
});
const AgentModelMapSchema = record(string(), AgentModelRuntimeEntrySchema).superRefine((models, ctx) => {
	for (const [ref, entry] of Object.entries(models)) {
		if (entry.pickerRuntimes !== void 0 && (ref.includes("*") || !parseProviderModelRef(ref))) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [ref, "pickerRuntimes"],
			message: "Picker runtimes require an exact provider/model entry."
		});
		if (entry.codeMode !== void 0 && (ref.includes("*") || !parseProviderModelRef(ref))) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [ref, "codeMode"],
			message: "Code Mode requires an exact provider/model entry; wildcard and bare model keys are not supported."
		});
	}
});
const AgentModelPolicySchema = strictObject({ 
/** Model refs allowed for session/run overrides. Empty or omitted allows any model. */
allow: array(string()).optional() });
const AgentRuntimeAcpSchema = strictObject({
	/** ACP harness adapter id (for example codex, claude). */
	agent: string().optional(),
	/** Optional ACP backend override for this agent runtime. */
	backend: string().optional(),
	/** Optional ACP session mode override. */
	mode: _enum(["persistent", "oneshot"]).optional(),
	/** Optional runtime working directory override. */
	cwd: string().optional()
}).optional();
const AgentRuntimeSchema = union([strictObject({ type: literal("embedded") }), strictObject({
	type: literal("acp"),
	acp: AgentRuntimeAcpSchema
})]).optional();
const AgentEntryEmbeddedAgentConfigSchema = strictObject({ executionContract: union([literal("default"), literal("strict-agentic")]).optional() }).optional();
const AgentEntryBaseSchema = strictObject({
	id: string(),
	name: string().optional(),
	description: string().optional(),
	workspace: string().optional(),
	cwd: string().optional(),
	agentDir: string().optional(),
	model: AgentModelSchema.optional(),
	utilityModel: string().optional(),
	decisionModel: DecisionModelSchema.optional(),
	models: AgentModelMapSchema.optional(),
	modelPolicy: AgentModelPolicySchema.optional(),
	thinkingDefault: _enum(ALL_THINKING_LEVELS).optional(),
	verboseDefault: _enum([
		"off",
		"on",
		"full"
	]).optional(),
	toolProgressDetail: _enum(["explain", "raw"]).optional(),
	reasoningDefault: _enum([
		"on",
		"off",
		"stream"
	]).optional(),
	fastModeDefault: union([
		boolean(),
		literal("auto"),
		literal("ultrafast")
	]).optional(),
	contextInjection: union([
		literal("always"),
		literal("continuation-skip"),
		literal("never")
	]).optional(),
	bootstrapMaxChars: number().int().positive().optional(),
	bootstrapTotalMaxChars: number().int().positive().optional(),
	experimental: strictObject({ localModelLean: boolean().optional() }).optional(),
	skills: array(string()).optional(),
	subagents: strictObject({
		delegationMode: _enum(["suggest", "prefer"]).optional(),
		allowAgents: array(string()).optional(),
		model: AgentModelSchema.optional(),
		thinking: string().optional(),
		requireAgentId: boolean().optional()
	}).optional(),
	embeddedAgent: AgentEntryEmbeddedAgentConfigSchema,
	params: record(string(), unknown()).optional(),
	runtime: AgentRuntimeSchema
});
//#endregion
//#region src/config/zod-schema.allowdeny.ts
const AllowDenyActionSchema = union([literal("allow"), literal("deny")]);
const AllowDenyChatTypeSchema = union([
	literal("direct"),
	literal("group"),
	literal("channel")
]).optional();
function createAllowDenyChannelRulesSchema() {
	return strictObject({
		default: AllowDenyActionSchema.optional(),
		rules: array(strictObject({
			action: AllowDenyActionSchema,
			match: strictObject({
				channel: string().optional(),
				chatType: AllowDenyChatTypeSchema,
				keyPrefix: string().optional(),
				rawKeyPrefix: string().optional()
			}).optional()
		})).optional()
	}).optional();
}
//#endregion
//#region src/config/zod-schema.messages.ts
const VisibleRepliesValueSchema = _enum(["automatic", "message_tool"]);
const VisibleRepliesSchema = union([VisibleRepliesValueSchema, boolean()]).overwrite((value) => {
	if (value === true) return "automatic";
	if (value === false) return "message_tool";
	return value;
});
const MentionPatternsPolicySchema = strictObject({
	mode: union([literal("allow"), literal("deny")]).optional(),
	allowIn: array(string()).optional(),
	denyIn: array(string()).optional()
});
const GroupChatSchema = strictObject({
	mentionPatterns: array(string()).optional(),
	historyLimit: number().int().min(0).optional(),
	unmentionedInbound: _enum(["user_request", "room_event"]).optional(),
	visibleReplies: VisibleRepliesSchema.optional()
}).optional();
const DmConfigSchema = strictObject({ historyLimit: number().int().min(0).optional() });
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
const QueueModeBySurfaceSchema = strictObject({
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
}).optional();
const DebounceMsBySurfaceSchema = record(string(), number().int().nonnegative()).optional();
const QueueSchema = strictObject({
	mode: QueueModeSchema.optional(),
	byChannel: QueueModeBySurfaceSchema,
	debounceMsByChannel: DebounceMsBySurfaceSchema,
	cap: number().int().positive().optional(),
	drop: QueueDropSchema.optional()
}).optional();
const InboundDebounceSchema = strictObject({
	debounceMs: number().int().nonnegative().optional(),
	byChannel: DebounceMsBySurfaceSchema
}).optional();
const NativeCommandsSettingSchema = union([boolean(), literal("auto")]);
const ProviderCommandsSchema = strictObject({
	native: NativeCommandsSettingSchema.optional(),
	nativeSkills: NativeCommandsSettingSchema.optional()
}).optional();
const ResponseUsageModeSchema = _enum([
	"on",
	"off",
	"tokens",
	"full"
]);
const MessagesSchema = strictObject({
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
	statusReactions: strictObject({ enabled: boolean().optional() }).optional()
}).optional();
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
//#region src/config/zod-schema.model-compat.ts
const RoutingPercentileCutoffsSchema = strictObject({
	p50: number().optional(),
	p75: number().optional(),
	p90: number().optional(),
	p99: number().optional()
});
const OpenRouterRoutingSchema = strictObject({
	allow_fallbacks: boolean().optional(),
	require_parameters: boolean().optional(),
	data_collection: _enum(["deny", "allow"]).optional(),
	zdr: boolean().optional(),
	enforce_distillable_text: boolean().optional(),
	order: array(string()).optional(),
	only: array(string()).optional(),
	ignore: array(string()).optional(),
	quantizations: array(string()).optional(),
	sort: union([string(), strictObject({
		by: string().optional(),
		partition: string().nullable().optional()
	})]).optional(),
	max_price: strictObject({
		prompt: union([number(), string()]).optional(),
		completion: union([number(), string()]).optional(),
		image: union([number(), string()]).optional(),
		audio: union([number(), string()]).optional(),
		request: union([number(), string()]).optional()
	}).optional(),
	preferred_min_throughput: union([number(), RoutingPercentileCutoffsSchema]).optional(),
	preferred_max_latency: union([number(), RoutingPercentileCutoffsSchema]).optional()
});
const VercelGatewayRoutingSchema = strictObject({
	only: array(string()).optional(),
	order: array(string()).optional()
});
/** Provider/model compatibility switches consumed by request builders and tool schema adapters. */
const ModelCompatSchema = strictObject({
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
	* or Anthropic-style `cache_control.ttl: "1h"`, depending on format). Default: true.
	*/
	supportsLongCacheRetention: boolean().optional()
}).optional();
//#endregion
//#region src/config/zod-schema.core.ts
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
function isAbsolutePath(value) {
	return path.isAbsolute(value) || WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value);
}
/** Canonical operator-configurable SSRF policy shared by network-capable surfaces. */
const SsrFPolicyConfigSchema = strictObject({
	dangerouslyAllowPrivateNetwork: boolean().optional(),
	allowRfc2544BenchmarkRange: boolean().optional(),
	allowIpv6UniqueLocalRange: boolean().optional(),
	allowedHostnames: array(string()).optional(),
	blockedHostnames: array(string()).optional()
});
const SecretsEnvProviderSchema = strictObject({
	source: literal("env"),
	/** Optional env var allowlist (exact names). */
	allowlist: array(string().regex(ENV_SECRET_REF_ID_RE)).max(256).optional()
});
const SecretsFileProviderSchema = strictObject({
	source: literal("file"),
	path: string().min(1),
	mode: union([literal("singleValue"), literal("json")]).optional(),
	timeoutMs: number().int().positive().max(12e4).optional(),
	maxBytes: number().int().positive().max(20971520).optional()
});
const SecretsManualExecProviderSchema = strictObject({
	source: literal("exec"),
	command: string().min(1).refine(isSafeExecutableValue, "secrets.providers.*.command is unsafe.").refine(isAbsolutePath, "secrets.providers.*.command must be an absolute path."),
	args: array(string().max(1024)).max(128).optional(),
	timeoutMs: number().int().positive().max(12e4).optional(),
	noOutputTimeoutMs: number().int().positive().max(12e4).optional(),
	maxOutputBytes: number().int().positive().max(20971520).optional(),
	jsonOnly: boolean().optional(),
	env: record(string(), string()).optional(),
	passEnv: array(string().regex(ENV_SECRET_REF_ID_RE)).max(128).optional(),
	trustedDirs: array(string().min(1).refine(isAbsolutePath, "trustedDirs entries must be absolute paths.")).max(64).optional()
});
const SecretsPluginIntegrationExecProviderSchema = strictObject({
	source: literal("exec"),
	pluginIntegration: strictObject({
		pluginId: string().min(1).max(128),
		integrationId: string().min(1).max(128)
	})
});
const SecretsExecProviderSchema = union([SecretsManualExecProviderSchema, SecretsPluginIntegrationExecProviderSchema]);
const SecretsStoreProviderSchema = strictObject({ source: literal("store") });
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
const SecretsConfigSchema = strictObject({
	egressProxy: strictObject({
		enabled: boolean().optional(),
		allowedHosts: array(EgressProxyExactHostSchema).max(256).optional(),
		bypassHosts: array(EgressProxyExactHostSchema).max(256).optional()
	}).optional(),
	providers: object({}).catchall(SecretProviderSchema).optional(),
	defaults: strictObject({
		env: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		file: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		exec: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		store: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional()
	}).optional()
}).optional();
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
const ModelApiSchema = _enum(MODEL_APIS, { error: (issue) => issue.input === LEGACY_OPENAI_CODEX_RESPONSES_API ? `"${LEGACY_OPENAI_CODEX_RESPONSES_API}" is a removed api id; use "${OPENAI_CHATGPT_RESPONSES_API}"` : void 0 });
const ConfiguredProviderRequestTlsSchema = strictObject({
	ca: SecretInputSchema.optional().register(sensitive),
	cert: SecretInputSchema.optional().register(sensitive),
	key: SecretInputSchema.optional().register(sensitive),
	passphrase: SecretInputSchema.optional().register(sensitive),
	serverName: string().optional(),
	insecureSkipVerify: boolean().optional()
}).optional();
const ConfiguredProviderRequestAuthSchema = union([
	strictObject({ mode: literal("provider-default") }),
	strictObject({
		mode: literal("authorization-bearer"),
		token: SecretInputSchema.register(sensitive)
	}),
	strictObject({
		mode: literal("header"),
		headerName: string().min(1),
		value: SecretInputSchema.register(sensitive),
		prefix: string().optional()
	})
]).optional();
const ConfiguredProviderRequestProxySchema = union([strictObject({
	mode: literal("env-proxy"),
	tls: ConfiguredProviderRequestTlsSchema
}), strictObject({
	mode: literal("explicit-proxy"),
	url: string().min(1),
	tls: ConfiguredProviderRequestTlsSchema
})]).optional();
const ConfiguredProviderRequestFields = {
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	auth: ConfiguredProviderRequestAuthSchema,
	proxy: ConfiguredProviderRequestProxySchema,
	tls: ConfiguredProviderRequestTlsSchema
};
const ConfiguredProviderRequestSchema = strictObject(ConfiguredProviderRequestFields).optional();
const ConfiguredModelProviderRequestSchema = strictObject({
	...ConfiguredProviderRequestFields,
	allowPrivateNetwork: boolean().optional()
}).optional();
const ModelImageInputSchema = strictObject({
	maxBytes: number().int().positive().optional(),
	maxPixels: number().int().positive().optional(),
	maxSidePx: number().int().positive().optional(),
	preferredSidePx: number().int().positive().optional(),
	tokenMode: union([
		literal("tile"),
		literal("detail"),
		literal("provider")
	]).optional()
});
const ModelMediaInputSchema = strictObject({ image: ModelImageInputSchema.optional() });
const ThinkingLevelMapValueSchema = string().nullable();
const ThinkingLevelMapSchema = strictObject({
	off: ThinkingLevelMapValueSchema.optional(),
	minimal: ThinkingLevelMapValueSchema.optional(),
	low: ThinkingLevelMapValueSchema.optional(),
	medium: ThinkingLevelMapValueSchema.optional(),
	high: ThinkingLevelMapValueSchema.optional(),
	xhigh: ThinkingLevelMapValueSchema.optional(),
	max: ThinkingLevelMapValueSchema.optional()
});
const ModelDefinitionSchema = strictObject({
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
	cost: strictObject({
		input: number().optional(),
		output: number().optional(),
		cacheRead: number().optional(),
		cacheWrite: number().optional(),
		tieredPricing: array(strictObject({
			input: number(),
			output: number(),
			cacheRead: number(),
			cacheWrite: number(),
			range: union([tuple([number(), number()]), tuple([number()])])
		})).optional()
	}).optional(),
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
	agentRuntime: AgentRuntimePolicySchema,
	/** Static headers merged into requests for this model. */
	headers: record(string(), string()).optional(),
	/** Provider compatibility flags for payload shaping and feature gating. */
	compat: ModelCompatSchema,
	/** Media input limits used by routing and preflight compression. */
	mediaInput: ModelMediaInputSchema.optional(),
	/** Metadata source marker for models added by CLI/catalog tooling. */
	metadataSource: literal("models-add").optional()
});
const ModelProviderLocalServiceSchema = strictObject({
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
}).optional();
const ModelProviderSchema = strictObject({
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
	agentRuntime: AgentRuntimePolicySchema,
	/** Optional local service to start before calling this provider. */
	localService: ModelProviderLocalServiceSchema,
	/** Secret-bearing headers merged into provider requests. */
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	/** Whether default Authorization header injection is enabled. */
	authHeader: boolean().optional(),
	/** Provider request transport/retry overrides. */
	request: ConfiguredModelProviderRequestSchema,
	models: array(ModelDefinitionSchema).optional()
});
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
const ModelCatalogRefreshConfigSchema = strictObject({
	/** Fetch model catalog updates from the hosted OpenClaw catalog. Default: true. */
	enabled: boolean().optional(),
	/** Override the hosted catalog URL (HTTPS mirrors, or localhost HTTP for testing). */
	url: string().refine((value) => {
		const parsed = URL.parse(value);
		return parsed !== null && (parsed.protocol === "https:" || parsed.protocol === "http:" && [
			"localhost",
			"127.0.0.1",
			"[::1]"
		].includes(parsed.hostname));
	}, { message: "models.catalogRefresh.url must use https, or http on localhost" }).optional()
}).optional();
const ModelsConfigSchema = strictObject({
	/** Merge provider config with bundled catalogs or replace bundled catalogs entirely. */
	mode: union([literal("merge"), literal("replace")]).optional(),
	providers: ModelProvidersSchema.optional(),
	/** Hosted model catalog refresh settings. */
	catalogRefresh: ModelCatalogRefreshConfigSchema
}).optional();
const IdentitySchema = strictObject({
	name: string().optional(),
	theme: string().optional(),
	emoji: string().optional(),
	avatar: string().optional()
}).optional();
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
const BlockStreamingCoalesceSchema = strictObject({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	idleMs: number().int().nonnegative().optional()
});
const TextChunkModeSchema = _enum(["length", "newline"]);
const ChannelStreamingBlockSchema = strictObject({
	enabled: boolean().optional(),
	coalesce: BlockStreamingCoalesceSchema.optional()
});
/** Delivery-only nested streaming config for channels without preview modes. */
const ChannelDeliveryStreamingConfigSchema = strictObject({
	chunkMode: TextChunkModeSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
});
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
const BlockStreamingChunkSchema = strictObject({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	breakPreference: union([
		literal("paragraph"),
		literal("newline"),
		literal("sentence")
	]).optional()
});
const MarkdownTableModeSchema = _enum([
	"off",
	"bullets",
	"code",
	"block"
]);
const MarkdownConfigSchema = strictObject({ tables: MarkdownTableModeSchema.optional() }).optional();
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
const TtsPersonaSchema = strictObject({
	label: string().optional(),
	description: string().optional(),
	provider: TtsProviderSchema.optional(),
	fallbackPolicy: union([
		literal("preserve-persona"),
		literal("provider-defaults"),
		literal("fail")
	]).optional(),
	providers: record(string(), TtsProviderConfigSchema).optional()
});
const TtsConfigSchema = strictObject({
	auto: TtsAutoSchema.optional(),
	enabled: boolean().optional(),
	mode: TtsModeSchema.optional(),
	provider: TtsProviderSchema.optional(),
	persona: string().optional(),
	personas: record(string(), TtsPersonaSchema).optional(),
	summaryModel: string().optional(),
	modelOverrides: strictObject({
		enabled: boolean().optional(),
		allowText: boolean().optional(),
		allowProvider: boolean().optional(),
		allowVoice: boolean().optional(),
		allowModelId: boolean().optional(),
		allowVoiceSettings: boolean().optional(),
		allowNormalization: boolean().optional(),
		allowSeed: boolean().optional()
	}).optional(),
	providers: record(string(), TtsProviderConfigSchema).optional(),
	maxTextLength: number().int().min(1).optional(),
	timeoutMs: number().int().min(1e3).max(12e4).optional()
}).optional();
const HumanDelaySchema = strictObject({
	mode: union([
		literal("off"),
		literal("natural"),
		literal("custom")
	]).optional(),
	minMs: number().int().nonnegative().optional(),
	maxMs: number().int().nonnegative().optional()
});
/**
* Canonical cross-field check for dmPolicy vs allowFrom. This is the single
* source of truth shared by the Zod schema refinements and the CLI config
* validator so the rule cannot drift between the two surfaces.
*/
const evaluateDmPolicyAllowFromDependency = (params) => {
	const allow = normalizeStringEntries(params.allowFrom);
	if (params.policy === "open" && !allow.includes("*")) return "open_requires_wildcard";
	if (params.policy === "allowlist" && allow.length === 0) return "allowlist_requires_entries";
	return null;
};
function createDmPolicyAllowFromValidator(violation) {
	return (params) => {
		if (evaluateDmPolicyAllowFromDependency(params) === violation) params.ctx.addIssue({
			code: ZodIssueCode.custom,
			path: params.path,
			message: params.message
		});
	};
}
const requireOpenAllowFrom = createDmPolicyAllowFromValidator("open_requires_wildcard");
/**
* Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
* Without this, all DMs are silently dropped because the allowlist is empty
* and no senders can match.
*/
const requireAllowlistAllowFrom = createDmPolicyAllowFromValidator("allowlist_requires_entries");
const MSTeamsReplyStyleSchema = _enum(["thread", "top-level"]);
const HexColorSchema = string().regex(/^#?[0-9a-fA-F]{6}$/, "expected hex color (RRGGBB)");
const ExecutableTokenSchema = string().refine(isSafeExecutableValue, "expected safe executable name or path");
const MediaUnderstandingScopeSchema = createAllowDenyChannelRulesSchema();
const MediaUnderstandingAttachmentsSchema = strictObject({
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
}).optional();
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
	/** Default prompt; model entries can override it. */
	prompt: string().optional(),
	/** Default timeout (seconds); model entries can override it. */
	timeoutSeconds: number().int().positive().optional(),
	/** Default language hint for audio transcription; model entries can override it. */
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
const MediaUnderstandingModelSchema = strictObject({
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
}).optional();
const ToolsMediaCapabilitySchema = strictObject({
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
	attachments: MediaUnderstandingAttachmentsSchema
}).optional();
const ToolsMediaAudioSchema = ToolsMediaCapabilitySchema.unwrap().extend({
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
}).optional();
const ToolsMediaSchema = strictObject({
	models: array(MediaUnderstandingModelSchema).optional(),
	concurrency: number().int().positive().optional(),
	image: ToolsMediaCapabilitySchema.optional(),
	audio: ToolsMediaAudioSchema.optional(),
	video: ToolsMediaCapabilitySchema.optional()
}).optional();
const LinkModelSchema = strictObject({
	/** Use a CLI command for link processing. */
	type: literal("cli").optional(),
	command: string().min(1),
	args: array(string()).optional(),
	timeoutSeconds: number().int().positive().optional()
});
const ToolsLinksSchema = strictObject({
	/** Enable link understanding when models are configured. */
	enabled: boolean().optional(),
	scope: MediaUnderstandingScopeSchema,
	/** Max number of links to process per message. */
	maxLinks: number().int().positive().optional(),
	timeoutSeconds: number().int().positive().optional(),
	/** Ordered model list (fallbacks in order). */
	models: array(LinkModelSchema).optional()
}).optional();
//#endregion
export { requireOpenAllowFrom as A, AgentModelMapSchema as B, TtsAutoSchema as C, TypingModeSchema as D, TtsProviderSchema as E, MessagesSchema as F, isBuiltInModelProviderOverlayId as G, AgentModelSchema as H, NativeCommandsSettingSchema as I, ProviderCommandsSchema as L, DmConfigSchema as M, GroupChatSchema as N, evaluateDmPolicyAllowFromDependency as O, MentionPatternsPolicySchema as P, createAllowDenyChannelRulesSchema as R, ToolsMediaSchema as S, TtsModeSchema as T, AgentToolModelSchema as U, AgentModelPolicySchema as V, DecisionModelSchema as W, SecretProviderSchema as _, ContextVisibilityModeSchema as a, TextChunkModeSchema as b, GroupPolicySchema as c, IdentitySchema as d, MSTeamsReplyStyleSchema as f, ReplyToModeSchema as g, ReplyRuntimeConfigSchemaShape as h, ChannelStreamingBlockSchema as i, BroadcastSchema as j, requireAllowlistAllowFrom as k, HexColorSchema as l, ModelsConfigSchema as m, BlockStreamingCoalesceSchema as n, DmPolicySchema as o, MarkdownConfigSchema as p, ChannelDeliveryStreamingConfigSchema as r, ExecutableTokenSchema as s, BlockStreamingChunkSchema as t, HumanDelaySchema as u, SecretsConfigSchema as v, TtsConfigSchema as w, ToolsLinksSchema as x, SsrFPolicyConfigSchema as y, AgentEntryBaseSchema as z };
