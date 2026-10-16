import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Bn as preprocess, Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, or as union, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { t as ALL_THINKING_LEVELS } from "./thinking.shared-Jy32Vp-O.mjs";
import { n as sensitive, r as SecretInputSchema } from "./zod-schema.sensitive-bEFwMmOC.mjs";
import { t as MemorySearchSchema } from "./zod-schema.memory-search-BxO53_FR.mjs";
import { t as findEdgeAuthIssue } from "./gateway-edge-auth-headers-DIemWTJm.mjs";
import { n as isHttpUrl, r as isHttpsUrl } from "./url-protocol-OU3K-ySz.mjs";
import { t as NODE_WORKER_CAPACITY_MAX } from "./worker-capacity-ChjgV5BU.mjs";
//#region src/config/zod-schema.mcp-server.ts
const HttpUrlSchema = string().url().refine(isHttpUrl, "Expected http:// or https:// URL");
const McpOAuthClientMetadataUrlSchema = string().url().refine((value) => {
	const url = URL.parse(value);
	return url !== null && isHttpsUrl(url) && url.pathname !== "/";
}, "Expected https:// URL with a non-root pathname");
const McpServerSchema = object({
	enabled: boolean().optional(),
	command: string().optional(),
	args: array(string()).optional(),
	env: record(string(), union([
		string().register(sensitive),
		number(),
		boolean()
	]).register(sensitive)).optional(),
	cwd: string().optional(),
	url: HttpUrlSchema.optional(),
	transport: union([
		literal("stdio"),
		literal("sse"),
		literal("streamable-http")
	]).optional(),
	headers: record(string(), union([
		string().register(sensitive),
		number(),
		boolean()
	]).register(sensitive)).optional(),
	connectionTimeoutMs: number().finite().positive().optional(),
	requestTimeoutMs: number().finite().positive().optional(),
	supportsParallelToolCalls: boolean().optional(),
	auth: literal("oauth").optional(),
	oauth: strictObject({
		identity: _enum(["shared", "per-requester"]).optional(),
		authProfileId: string().trim().min(1).optional(),
		scope: string().trim().min(1).optional(),
		redirectUrl: HttpUrlSchema.optional(),
		clientMetadataUrl: McpOAuthClientMetadataUrlSchema.optional()
	}).optional(),
	sslVerify: boolean().optional(),
	clientCert: string().optional(),
	clientKey: string().optional(),
	toolFilter: strictObject({
		include: array(string().trim().min(1)).min(1).optional(),
		exclude: array(string().trim().min(1)).min(1).optional()
	}).optional(),
	codex: strictObject({
		agents: array(string().trim().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/i)).min(1).optional(),
		defaultToolsApprovalMode: _enum([
			"auto",
			"prompt",
			"approve"
		]).optional()
	}).optional()
}).superRefine((data, ctx) => {
	for (const key of [
		"connectTimeout",
		"connect_timeout",
		"timeout",
		"workingDirectory",
		"supports_parallel_tool_calls",
		"ssl_verify",
		"client_cert",
		"client_key"
	]) if (Object.hasOwn(data, key)) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: `Unrecognized key: "${key}"`
	});
	const codex = data.codex;
	if (codex && Object.hasOwn(codex, "default_tools_approval_mode")) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["codex", "default_tools_approval_mode"],
		message: "Unrecognized key: \"default_tools_approval_mode\""
	});
	if (Object.hasOwn(data, "disabled")) {
		const disabled = Reflect.get(data, "disabled");
		const replacement = typeof disabled === "boolean" ? `"enabled: ${!disabled}" instead, then run "openclaw doctor --fix" to migrate existing config` : "the canonical \"enabled\" boolean instead";
		ctx.addIssue({
			code: ZodIssueCode.custom,
			message: `unsupported key "disabled"; use ${replacement}`,
			path: ["disabled"]
		});
	}
	if (data.oauth?.identity === "per-requester") {
		if (data.auth !== "oauth") ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.identity \"per-requester\" requires auth: \"oauth\"",
			path: ["oauth", "identity"]
		});
		if (data.oauth.authProfileId) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.authProfileId cannot be used with oauth.identity \"per-requester\"",
			path: ["oauth", "authProfileId"]
		});
		if (!data.url) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.identity \"per-requester\" requires an HTTP server URL",
			path: ["oauth", "identity"]
		});
		if (data.command !== void 0 || data.transport === "stdio") ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.identity \"per-requester\" cannot be combined with a command or \"stdio\" transport",
			path: ["oauth", "identity"]
		});
	}
	if (data.transport === "stdio" && (typeof data.command !== "string" || data.command.trim().length === 0)) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "\"stdio\" transport requires a non-empty command",
		path: ["transport"]
	});
}).catchall(unknown());
//#endregion
//#region src/config/zod-schema.node-host.ts
const NODE_HOST_FIELD_LABELS = {
	nodeHost: "Node Host",
	"nodeHost.autoUpdate": "Node Automatic Updates",
	"nodeHost.autoUpdate.enabled": "Node Automatic Updates Enabled",
	"nodeHost.agentRuns": "Node Agent Runs",
	"nodeHost.agentRuns.claude": "Node Claude Agent Runs",
	"nodeHost.agentRuns.claude.enabled": "Node Claude Agent Runs Enabled",
	"nodeHost.workerRuns": "Node Worker Runs",
	"nodeHost.workerRuns.enabled": "Node Worker Runs Enabled",
	"nodeHost.workerRuns.capacity": "Node Worker Run Capacity",
	"nodeHost.workerRuns.isolation": "Node Worker Run Isolation",
	"nodeHost.workerRuns.containerImage": "Node Worker Run Container Image",
	"nodeHost.browserProxy": "Node Browser Proxy",
	"nodeHost.browserProxy.enabled": "Node Browser Proxy Enabled",
	"nodeHost.browserProxy.allowProfiles": "Node Browser Proxy Allowed Profiles",
	"nodeHost.mcp": "Node Host MCP",
	"nodeHost.mcp.servers": "Node Host MCP Servers",
	"nodeHost.skills": "Node Host Skills",
	"nodeHost.skills.enabled": "Node Host Skills Enabled"
};
const BrowserSnapshotDefaultsSchema = strictObject({ 
/** Default snapshot mode (applies when mode is not provided). */
mode: literal("efficient").optional() }).optional();
const NodeHostAgentRunsSchema = strictObject({ claude: strictObject({ enabled: boolean().optional() }).optional() }).optional();
const NodeHostWorkerRunsSchema = strictObject({
	enabled: boolean().optional(),
	capacity: number().int().min(1).max(NODE_WORKER_CAPACITY_MAX).optional(),
	isolation: _enum(["none", "container"]).optional(),
	containerImage: string().trim().min(1).optional()
}).optional();
//#endregion
//#region src/config/zod-schema.root-support.ts
const EdgeAuthHeadersSchema = record(string(), SecretInputSchema.register(sensitive)).superRefine((headers, ctx) => {
	const issue = findEdgeAuthIssue(headers);
	if (!issue) return;
	ctx.addIssue({
		code: "custom",
		message: issue.message,
		...issue.headerName ? { path: [issue.headerName] } : {}
	});
});
const GatewayRemoteConfigSchema = strictObject({
	url: string().optional(),
	transport: union([literal("ssh"), literal("direct")]).optional(),
	remotePort: number().int().min(1).max(65535).optional(),
	token: SecretInputSchema.optional().register(sensitive),
	password: SecretInputSchema.optional().register(sensitive),
	edgeAuth: EdgeAuthHeadersSchema.optional(),
	tlsFingerprint: string().optional(),
	sshTarget: string().optional(),
	sshIdentity: string().optional(),
	sshHostKeyPolicy: union([literal("strict"), literal("openssh")]).optional()
}).optional();
const SecuritySchema = strictObject({
	audit: strictObject({ suppressions: array(strictObject({
		checkId: string().min(1),
		titleIncludes: string().min(1).optional(),
		detailIncludes: string().min(1).optional(),
		reason: string().min(1).optional()
	})).optional() }).optional(),
	installPolicy: strictObject({
		enabled: boolean().optional(),
		targets: array(union([literal("skill"), literal("plugin")])).min(1).optional(),
		exec: strictObject({
			source: literal("exec"),
			command: string().min(1),
			args: array(string()).optional(),
			timeoutMs: number().int().min(1).optional(),
			noOutputTimeoutMs: number().int().min(1).optional(),
			maxOutputBytes: number().int().min(1).optional(),
			env: record(string(), string().register(sensitive)).optional(),
			passEnv: array(string()).optional(),
			trustedDirs: array(string()).optional()
		}).optional()
	}).optional()
}).optional();
const AccessGroupsSchema = record(string().min(1), discriminatedUnion("type", [strictObject({
	type: literal("discord.channelAudience"),
	guildId: string().min(1),
	channelId: string().min(1),
	membership: literal("canViewChannel").optional()
}), strictObject({
	type: literal("message.senders"),
	members: record(string().min(1), array(string().min(1)))
})])).optional();
const LoggingLevelSchema = union([
	literal("silent"),
	literal("fatal"),
	literal("error"),
	literal("warn"),
	literal("info"),
	literal("debug"),
	literal("trace")
]);
const MemorySchema = strictObject({
	citations: union([
		literal("auto"),
		literal("on"),
		literal("off")
	]).optional(),
	search: MemorySearchSchema
}).optional();
const ResponsesEndpointUrlFetchShape = {
	allowUrl: boolean().optional(),
	urlAllowlist: array(string()).optional(),
	allowedMimes: array(string()).optional(),
	maxBytes: number().int().positive().optional(),
	maxRedirects: number().int().nonnegative().optional(),
	timeoutMs: number().int().positive().optional()
};
const SkillEntrySchema = strictObject({
	/** Disable a discovered skill without removing it from disk. */
	enabled: boolean().optional(),
	/** Optional secret made available to the skill runtime through skill env handling. */
	apiKey: SecretInputSchema.optional().register(sensitive),
	/** Plain environment overrides applied when the skill runs. */
	env: record(string(), string()).optional(),
	/** Skill-specific structured config consumed by the skill runtime. */
	config: record(string(), unknown()).optional()
});
const PluginEntrySchema = strictObject({
	enabled: boolean().optional(),
	hooks: strictObject({
		/** Controls prompt mutation via before_prompt_build. */
		allowPromptInjection: boolean().optional(),
		/**
		* Controls access to raw conversation content from conversation hooks including
		* before_agent_run, before_model_resolve, before_agent_reply, llm_input, llm_output,
		* before_agent_finalize, and agent_end.
		* Non-bundled plugins must opt in explicitly; bundled plugins stay allowed unless disabled.
		*/
		allowConversationAccess: boolean().optional(),
		/** Default timeout in milliseconds for this plugin's typed hooks. */
		timeoutMs: number().int().positive().max(6e5).optional(),
		/** Per typed-hook timeout overrides in milliseconds. */
		timeouts: record(string(), number().int().positive().max(6e5)).optional()
	}).optional(),
	subagent: strictObject({
		/** Explicitly allow this plugin to request per-run provider/model overrides for subagent runs. */
		allowModelOverride: boolean().optional(),
		/**
		* Allowed override targets as canonical provider/model refs.
		* Use "*" to explicitly allow any model for this plugin.
		*/
		allowedModels: array(string()).optional()
	}).optional(),
	llm: strictObject({
		/** Explicitly allow this plugin to request a model override for api.runtime.llm.complete. */
		allowModelOverride: boolean().optional(),
		/**
		* Allowed override targets as canonical provider/model refs.
		* Use "*" to explicitly allow any model for this plugin.
		*/
		allowedModels: array(string()).optional(),
		/**
		* Allowed models for every completion, including host-resolved defaults and overrides.
		* Use "*" to explicitly allow any model for this plugin.
		*/
		allowedCompletionModels: array(string()).optional(),
		/** Allow explicit auth-profile selection for isolated agent-runtime completions. */
		allowAuthProfileOverride: boolean().optional(),
		/** Explicitly allow this plugin to run completions against a non-default agent id. */
		allowAgentIdOverride: boolean().optional()
	}).optional(),
	config: record(string(), unknown()).optional()
});
const TalkProviderEntrySchema = object({ apiKey: SecretInputSchema.optional().register(sensitive) }).catchall(unknown());
function validateTalkProviderSelection(value, ctx, scope) {
	const provider = normalizeLowercaseStringOrEmpty(value.provider ?? "");
	const providers = value.providers ? Object.keys(value.providers) : [];
	if (provider && providers.length > 0 && !Object.hasOwn(value.providers, provider)) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: `${scope}.provider must match a key in ${scope}.providers (missing "${provider}")`
	});
	if (!provider && providers.length > 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: `${scope}.provider is required when ${scope}.providers defines multiple providers`
	});
}
const TalkRealtimeSchema = strictObject({
	provider: string().optional(),
	providers: record(string(), TalkProviderEntrySchema).optional(),
	model: string().optional(),
	speakerVoice: string().optional(),
	speakerVoiceId: string().optional(),
	instructions: string().optional(),
	mode: _enum([
		"realtime",
		"stt-tts",
		"transcription"
	]).optional(),
	transport: _enum([
		"webrtc",
		"provider-websocket",
		"gateway-relay",
		"managed-room"
	]).optional(),
	vadThreshold: number().min(0).max(1).optional(),
	silenceDurationMs: number().int().positive().optional(),
	prefixPaddingMs: number().int().nonnegative().optional(),
	reasoningEffort: string().min(1).optional(),
	brain: _enum([
		"agent-consult",
		"direct-tools",
		"none"
	]).optional(),
	consultRouting: _enum(["provider-direct", "force-agent-consult"]).optional()
}).superRefine((realtime, ctx) => validateTalkProviderSelection(realtime, ctx, "talk.realtime"));
const TalkSchema = strictObject({
	agentId: string().trim().min(1).optional(),
	provider: string().optional(),
	providers: record(string(), TalkProviderEntrySchema).optional(),
	realtime: TalkRealtimeSchema.optional(),
	consultThinkingLevel: _enum(ALL_THINKING_LEVELS).optional(),
	consultFastMode: boolean().optional(),
	speechLocale: string().optional(),
	interruptOnSpeech: boolean().optional(),
	silenceTimeoutMs: number().int().positive().optional()
}).superRefine((talk, ctx) => validateTalkProviderSelection(talk, ctx, "talk"));
const RESERVED_MCP_SERVER_NAME = "__proto__";
const RESERVED_MCP_SERVER_NAME_ERROR = "MCP server name \"__proto__\" is reserved; rename the server";
const McpServerNameSchema = string().refine((value) => value !== RESERVED_MCP_SERVER_NAME, RESERVED_MCP_SERVER_NAME_ERROR);
const NodeHostMcpServerNameSchema = McpServerNameSchema.refine((value) => value.length > 0 && value === value.trim(), "MCP server name must be non-empty and must not have surrounding whitespace");
function createMcpServersSchema(serverNameSchema) {
	return preprocess((value, ctx) => {
		if (value !== null && typeof value === "object" && !Array.isArray(value) && Object.hasOwn(value, RESERVED_MCP_SERVER_NAME)) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: [RESERVED_MCP_SERVER_NAME],
				message: RESERVED_MCP_SERVER_NAME_ERROR
			});
			return NEVER;
		}
		return value;
	}, record(serverNameSchema, McpServerSchema));
}
function validateHttpOrigin(value) {
	const url = URL.parse(value);
	return url !== null && (url.protocol === "http:" || url.protocol === "https:") && url.pathname === "/" && !url.search && !url.hash && !url.username && !url.password;
}
const McpConfigSchema = strictObject({
	sessionIdleTtlMs: number().finite().min(0).optional(),
	servers: createMcpServersSchema(McpServerNameSchema).optional(),
	apps: strictObject({
		enabled: boolean().optional(),
		sandboxOrigin: string().url().refine(validateHttpOrigin, "sandboxOrigin must be an HTTP(S) origin without a path, query, or credentials").optional(),
		sandboxPort: number().int().min(1).max(65535).optional()
	}).optional()
}).optional();
const NodeHostSchema = strictObject({
	autoUpdate: strictObject({ enabled: boolean().optional() }).optional(),
	agentRuns: NodeHostAgentRunsSchema,
	workerRuns: NodeHostWorkerRunsSchema,
	browserProxy: strictObject({
		enabled: boolean().optional(),
		allowProfiles: array(string()).optional()
	}).optional(),
	mcp: strictObject({ servers: createMcpServersSchema(NodeHostMcpServerNameSchema).optional() }).optional(),
	skills: strictObject({ enabled: boolean().optional() }).optional()
}).optional();
//#endregion
export { McpServerNameSchema as a, NodeHostSchema as c, SecuritySchema as d, SkillEntrySchema as f, NODE_HOST_FIELD_LABELS as g, BrowserSnapshotDefaultsSchema as h, McpConfigSchema as i, PluginEntrySchema as l, validateHttpOrigin as m, GatewayRemoteConfigSchema as n, MemorySchema as o, TalkSchema as p, LoggingLevelSchema as r, NodeHostMcpServerNameSchema as s, AccessGroupsSchema as t, ResponsesEndpointUrlFetchShape as u };
