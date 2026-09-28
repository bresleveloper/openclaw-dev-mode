import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { b as uniqueValues } from "./string-normalization-_gRhJUDw.mjs";
import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Bn as preprocess, Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, bn as lazy, cr as url, or as union, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { B as createAllowDenyChannelRulesSchema, D as TypingModeSchema, L as MessagesSchema, N as BroadcastSchema, R as NativeCommandsSettingSchema, a as ContextVisibilityModeSchema, c as GroupPolicySchema, j as SecretInputSchema, l as HexColorSchema, m as ModelsConfigSchema, n as BlockStreamingCoalesceSchema, t as BlockStreamingChunkSchema, u as HumanDelaySchema, v as SecretsConfigSchema, w as TtsConfigSchema, y as SsrFPolicyConfigSchema } from "./zod-schema.core-DyJd-bbI.mjs";
import { n as sensitive, t as configUiMetadata } from "./zod-schema.sensitive-3bxjhHYT.mjs";
import { t as parseByteSize } from "./parse-bytes-DCAjQ31S.mjs";
import { a as HeartbeatSchema, c as MemorySearchSchema, d as AgentModelSchema, f as AgentToolModelSchema, i as ElevatedAllowFromSchema, l as AgentModelMapSchema, n as AgentEntrySchema, p as DecisionModelSchema, r as AgentSandboxSchema, s as ToolsSchema, t as AgentContextLimitsSchema, u as AgentModelPolicySchema } from "./zod-schema.agent-runtime-A2vJPWeP.mjs";
import { a as ApprovalsSchema, i as ChannelBotLoopProtectionSchema, r as ChannelHeartbeatVisibilitySchema, t as ChannelImplicitMentionsSchema } from "./zod-schema.implicit-mentions-CbSAuVqJ.mjs";
import { a as projectConfigFieldMetadata, r as CloudWorkersConfigSchema } from "./zod-schema.cloud-workers-Bwo2REFq.mjs";
import { a as READ_SCOPE, c as TALK_SCOPE, i as QUESTIONS_SCOPE, l as TALK_SECRETS_SCOPE, n as APPROVALS_SCOPE, o as SESSION_READ_SCOPE, r as PAIRING_SCOPE, s as SESSION_WRITE_SCOPE, t as ADMIN_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as findEdgeAuthIssue } from "./gateway-edge-auth-headers-DIemWTJm.mjs";
import { n as isHttpUrl, r as isHttpsUrl } from "./url-protocol-OU3K-ySz.mjs";
import { r as NODE_WORKER_CAPACITY_MAX } from "./node-runner-inventory-DTVspi93.mjs";
import path from "node:path";
import { isIP } from "node:net";
//#region src/config/byte-size.ts
/**
* Parse an optional byte-size value from config.
* Accepts non-negative numbers or strings like "2mb".
*/
function parseNonNegativeByteSize(value) {
	if (typeof value === "number") {
		const int = Math.floor(value);
		return Number.isSafeInteger(int) && int >= 0 ? int : null;
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return null;
		try {
			const bytes = parseByteSize(trimmed, { defaultUnit: "b" });
			return bytes >= 0 ? bytes : null;
		} catch {
			return null;
		}
	}
	return null;
}
/** Validates byte-size strings accepted by agent default byte-threshold config. */
function isValidNonNegativeByteSizeString(value) {
	return parseNonNegativeByteSize(value) !== null;
}
//#endregion
//#region src/config/zod-schema.agent-defaults-base.ts
const SilentReplyPolicySchema = union([literal("allow"), literal("disallow")]);
const NonNegativeByteSizeSchema = union([number().int().nonnegative(), string().refine(isValidNonNegativeByteSizeString, "Expected byte size string like 2mb")]);
const OptionalBootstrapFileNameSchema = _enum([
	"SOUL.md",
	"USER.md",
	"HEARTBEAT.md",
	"IDENTITY.md"
]);
const AgentThinkingLevelSchema = _enum([
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
const EmbeddedAgentConfigSchema = object({
	projectSettingsPolicy: union([
		literal("trusted"),
		literal("sanitize"),
		literal("ignore")
	]).optional(),
	executionContract: union([literal("default"), literal("strict-agentic")]).optional(),
	cyberFailover: object({
		mode: union([literal("auto"), literal("off")]).optional(),
		model: string().min(1).optional(),
		cooloffMs: number().int().positive().optional()
	}).strict().optional()
}).strict();
const SilentReplyPolicyConfigSchema = object({
	group: SilentReplyPolicySchema.optional(),
	internal: SilentReplyPolicySchema.optional()
}).strict();
//#endregion
//#region src/config/zod-schema.agent-defaults.ts
const AgentDefaultsSchema = object({
	/** Global default provider params applied to all models before per-model and per-agent overrides. */
	params: record(string(), unknown()).optional(),
	model: AgentModelSchema.optional(),
	modelSelectionScope: _enum([
		"session",
		"agent",
		"global"
	]).optional(),
	utilityModel: string().optional(),
	decisionModel: DecisionModelSchema.optional(),
	imageModel: AgentToolModelSchema.optional(),
	mediaModels: object({
		image: AgentToolModelSchema.optional(),
		video: AgentToolModelSchema.optional(),
		music: AgentToolModelSchema.optional()
	}).strict().optional(),
	voiceModel: AgentToolModelSchema.optional(),
	pdfModel: AgentToolModelSchema.optional(),
	pdfMaxMb: number().positive().optional(),
	pdfMaxPages: number().int().positive().optional(),
	models: AgentModelMapSchema.optional(),
	modelPolicy: AgentModelPolicySchema.optional(),
	workspace: string().optional(),
	cwd: string().optional(),
	skills: array(string()).optional(),
	silentReply: SilentReplyPolicyConfigSchema.optional(),
	repoRoot: string().optional(),
	skipBootstrap: boolean().optional(),
	skipOptionalBootstrapFiles: array(OptionalBootstrapFileNameSchema).optional(),
	contextInjection: union([
		literal("always"),
		literal("continuation-skip"),
		literal("never")
	]).optional(),
	bootstrapMaxChars: number().int().positive().optional(),
	bootstrapTotalMaxChars: number().int().positive().optional(),
	experimental: object({ localModelLean: boolean().optional() }).strict().optional(),
	userTimezone: string().optional(),
	startupContext: object({
		/** Enable runtime-owned startup-context prelude on bare session resets (default: true). */
		enabled: boolean().optional(),
		/** Which bare reset commands should receive startup context (default: ["new", "reset"]). */
		applyOn: array(union([literal("new"), literal("reset")])).optional(),
		/** How many dated memory files to load counting backward from today (default: 2). */
		dailyMemoryDays: number().int().min(1).max(14).optional(),
		/** Max bytes to read from each daily memory file before skipping (default: 16384). */
		maxFileBytes: number().int().min(1).max(65536).optional(),
		/** Max characters retained from each daily memory file (default: 1200). */
		maxFileChars: number().int().min(1).max(1e4).optional(),
		/** Max total characters retained across the startup prelude (default: 2800). */
		maxTotalChars: number().int().min(1).max(5e4).optional()
	}).strict().optional(),
	contextPruning: object({
		/** Pruning mode for old tool results in model context. */
		mode: union([literal("off"), literal("cache-ttl")]).optional(),
		/** TTL to consider cache expired (duration string, default unit: minutes). */
		ttl: string().optional(),
		tools: object({
			/** Tool names eligible for context pruning. */
			allow: array(string()).optional(),
			/** Tool names excluded from context pruning. */
			deny: array(string()).optional()
		}).strict().optional(),
		hardClear: object({
			/** Replace oversized old tool results with a placeholder at high pressure. */
			enabled: boolean().optional(),
			/** Placeholder text inserted when a tool result is hard-cleared. */
			placeholder: string().optional()
		}).strict().optional()
	}).strict().optional(),
	compaction: object({
		/** Enable embedded proactive auto-compaction. Default: true. */
		enabled: boolean().optional(),
		/** Compaction summarization mode. */
		mode: union([literal("default"), literal("safeguard")]).optional(),
		/**
		* Id of a registered compaction provider plugin.
		* When set, the provider's summarize() is called instead of
		* the built-in summarizeInStages(). Falls back to built-in on failure.
		*/
		provider: string().optional(),
		/** Thinking level for embedded OpenClaw compaction summaries. Default: low. */
		thinkingLevel: union([AgentThinkingLevelSchema, literal("inherit")]).optional(),
		/** Embedded OpenClaw keepRecentTokens budget used for cut-point selection. */
		keepRecentTokens: number().int().positive().optional(),
		/** Identifier-preservation instruction policy for compaction summaries. */
		identifierPolicy: union([literal("strict"), literal("off")]).optional(),
		/** Preserve this many most-recent user/assistant turns verbatim in compaction summary context. */
		recentTurnsPreserve: number().int().min(0).max(12).optional(),
		/** Optional quality-audit retries for safeguard compaction summaries. */
		qualityGuard: object({
			/** Enable compaction summary quality audits and regeneration retries. Default: false. */
			enabled: boolean().optional(),
			/** Maximum regeneration retries after a failed quality audit. Default: 1 when enabled. */
			maxRetries: number().int().nonnegative().optional()
		}).strict().optional(),
		/** Mid-turn precheck for tool-loop context pressure. Default: disabled. */
		midTurnPrecheck: object({ 
		/**
		* Enable structured context pressure checks after tool results are appended
		* and before the next agent model call. Default: false.
		*/
enabled: boolean().optional() }).strict().optional(),
		/** Post-compaction session memory index sync mode. */
		postIndexSync: _enum([
			"off",
			"async",
			"await"
		]).optional(),
		/** H2/H3 section names from AGENTS.md to inject after compaction. */
		postCompactionSections: array(string()).optional(),
		/** Optional provider/model or configured bare alias for compaction summarization.
		* When set, compaction uses this model instead of the agent's primary model.
		* Falls back to the primary model when unset. */
		model: string().optional(),
		/** Safety window in seconds for each built-in compaction model request (default: 180). */
		timeoutSeconds: number().int().positive().optional(),
		/** Pre-compaction memory flush (agentic turn). Default: enabled. */
		memoryFlush: object({
			/** Enable the pre-compaction memory flush (default: true). */
			enabled: boolean().optional(),
			/** Optional provider/model override used only for pre-compaction memory flush turns. */
			model: string().optional(),
			/** Run the memory flush when context is within this many tokens of the compaction threshold. */
			softThresholdTokens: number().int().nonnegative().optional(),
			/**
			* Force a memory flush when transcript size reaches this threshold
			* (bytes, or byte-size string like "2mb"). Set to 0 to disable.
			*/
			forceFlushTranscriptBytes: NonNegativeByteSizeSchema.optional()
		}).strict().optional(),
		/**
		* Byte threshold for normal preflight local compaction (bytes, or a byte-size
		* string like "20mb"). Set to 0 or leave unset to disable. Also caps Codex
		* app-server native rollouts; oversized native threads restart fresh.
		*/
		maxActiveTranscriptBytes: NonNegativeByteSizeSchema.optional(),
		/**
		* Send brief context-maintenance notices to the user: when compaction starts
		* and completes, and when a pre-compaction memory flush is exhausted so the
		* reply continues in a degraded state.
		* Default: false (silent by default).
		*/
		notifyUser: boolean().optional()
	}).strict().optional(),
	embeddedAgent: EmbeddedAgentConfigSchema.optional(),
	thinkingDefault: AgentThinkingLevelSchema.optional(),
	fastModeDefault: union([boolean(), literal("auto")]).optional(),
	verboseDefault: union([
		literal("off"),
		literal("on"),
		literal("full")
	]).optional(),
	toolProgressDetail: union([literal("explain"), literal("raw")]).optional(),
	reasoningDefault: union([
		literal("off"),
		literal("on"),
		literal("stream")
	]).optional(),
	elevatedDefault: union([
		literal("off"),
		literal("on"),
		literal("ask"),
		literal("full")
	]).optional(),
	blockStreamingDefault: union([literal("off"), literal("on")]).optional(),
	blockStreamingBreak: union([literal("text_end"), literal("message_end")]).optional(),
	timeoutSeconds: number().int().nonnegative().optional(),
	mediaMaxMb: number().positive().optional(),
	imageMaxDimensionPx: number().int().positive().optional(),
	imageQuality: _enum([
		"auto",
		"efficient",
		"balanced",
		"high"
	]).optional(),
	typingIntervalSeconds: number().int().positive().optional(),
	systemAgent: object({ agentId: string().trim().min(1).optional() }).strict().optional(),
	authInheritance: object({ agentId: string().trim().min(1).optional() }).strict().optional(),
	sessionStore: object({ agentId: string().trim().min(1).optional() }).strict().optional(),
	maxConcurrent: number().int().positive().optional(),
	subagents: object({
		delegationMode: _enum(["suggest", "prefer"]).optional(),
		allowAgents: array(string()).optional(),
		maxConcurrent: number().int().positive().optional(),
		maxSpawnDepth: number().int().min(1).max(5).optional().describe("Maximum nesting depth for sub-agent spawning. Default: 5; 1 makes direct children leaves."),
		maxChildrenPerAgent: number().int().min(1).max(20).optional().describe("Maximum number of active children a single agent session can spawn (default: 5)."),
		archiveAfterMinutes: number().int().min(0).optional(),
		model: AgentModelSchema.optional(),
		thinking: string().optional(),
		runTimeoutSeconds: number().int().min(0).optional(),
		announceTimeoutMs: number().int().positive().optional(),
		requireAgentId: boolean().optional()
	}).strict().optional()
}).strict().safeExtend({
	contextLimits: AgentContextLimitsSchema,
	blockStreamingChunk: BlockStreamingChunkSchema.optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	humanDelay: HumanDelaySchema.optional(),
	typingMode: TypingModeSchema.optional(),
	heartbeat: HeartbeatSchema.unwrap().safeExtend({ agentId: string().trim().min(1).optional() }).optional(),
	sandbox: AgentSandboxSchema
}).strict().optional();
//#endregion
//#region src/config/zod-schema.agents.ts
const AgentEntryConfigSchema = preprocess((value, ctx) => {
	if (value && typeof value === "object" && !Array.isArray(value)) for (const key of Object.getOwnPropertyNames(value)) {
		if (!isBlockedObjectKey(key)) continue;
		ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [key],
			message: "agent entries must not contain blocked object keys"
		});
		return NEVER;
	}
	return value;
}, AgentEntrySchema.omit({ id: true }).extend({ default: boolean().optional() }));
const AgentsSchema = object({
	ownership: literal("explicit").optional(),
	defaults: lazy(() => AgentDefaultsSchema).optional(),
	entries: record(string().regex(/^[a-z0-9_][a-z0-9_-]{0,63}$/i, "Invalid agent id"), AgentEntryConfigSchema).optional()
}).strict().superRefine((value, ctx) => {
	const entries = Object.entries(value.entries ?? {});
	if (entries.length === 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["entries"],
		message: "agents.entries must contain at least one configured agent"
	});
	const firstKeyByAgentId = /* @__PURE__ */ new Map();
	for (const [key] of entries) {
		const agentId = normalizeAgentId(key);
		const firstKey = firstKeyByAgentId.get(agentId);
		if (!firstKey) {
			firstKeyByAgentId.set(agentId, key);
			continue;
		}
		ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["entries", key],
			message: `agents.entries keys "${firstKey}" and "${key}" resolve to the same agent id "${agentId}"; rename one key so each agent has a unique id`
		});
	}
	const marked = entries.filter(([, entry]) => entry.default === true);
	if (marked.length > 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["entries"],
		message: `agents.entries must contain at most one default=true entry (found ${marked.length})`
	});
	if (value.ownership === "explicit" && marked.length > 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["ownership"],
		message: "agents.ownership=explicit cannot be combined with a legacy default=true marker"
	});
	if (entries.length > 1 && marked.length === 0 && value.ownership !== "explicit") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["ownership"],
		message: "multi-agent rosters require agents.ownership=\"explicit\" or one legacy default=true marker; add agents.ownership=\"explicit\" or run openclaw doctor"
	});
}).optional();
const BindingMatchSchema = object({
	channel: string(),
	/**
	* Channel account to match.
	* - Omitted/empty: matches only the channel default account.
	* - "*": matches every account on the channel.
	* - Any other string: matches that specific account id.
	*/
	accountId: string().optional(),
	peer: object({
		kind: union([
			literal("direct"),
			literal("group"),
			literal("channel")
		]),
		id: string()
	}).strict().optional(),
	guildId: string().optional(),
	teamId: string().optional(),
	/** Discord role IDs used for role-based routing. */
	roles: array(string()).optional()
}).strict();
const BindingSessionSchema = object({
	/** Optional session scoping override for conversations matched by this binding. */
	dmScope: _enum([
		"main",
		"per-peer",
		"per-channel-peer",
		"per-account-channel-peer"
	]).optional(),
	groupScope: _enum(["main", "per-group"]).optional()
}).strict();
const RouteBindingSchema = object({
	/** Missing type is interpreted as route for backward compatibility. */
	type: literal("route").optional(),
	agentId: string(),
	comment: string().optional(),
	match: BindingMatchSchema,
	session: BindingSessionSchema.optional()
}).strict();
const AcpBindingSchema = object({
	type: literal("acp"),
	agentId: string(),
	comment: string().optional(),
	match: BindingMatchSchema,
	acp: object({
		mode: _enum(["persistent", "oneshot"]).optional(),
		label: string().optional(),
		cwd: string().optional(),
		backend: string().optional()
	}).strict().optional()
}).strict().superRefine((value, ctx) => {
	if (!(normalizeOptionalString(value.match.peer?.id) ?? "")) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["match", "peer"],
		message: "ACP bindings require match.peer.id to target a concrete conversation."
	});
});
const BindingsSchema = array(union([RouteBindingSchema, AcpBindingSchema])).optional();
//#endregion
//#region src/config/zod-schema.channels-config.ts
const ChannelModelByChannelSchema = record(string(), record(string(), string())).optional();
function addLegacyChannelAcpBindingIssues(value, ctx, path = []) {
	if (!value || typeof value !== "object") return;
	if (Array.isArray(value)) {
		value.forEach((entry, index) => addLegacyChannelAcpBindingIssues(entry, ctx, [...path, index]));
		return;
	}
	const record = value;
	const bindings = record.bindings;
	if (bindings && typeof bindings === "object" && !Array.isArray(bindings)) {
		const acp = bindings.acp;
		if (acp && typeof acp === "object") ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				...path,
				"bindings",
				"acp"
			],
			message: "Legacy channel-local ACP bindings were removed; use top-level bindings[] entries."
		});
	}
	for (const [key, entry] of Object.entries(record)) addLegacyChannelAcpBindingIssues(entry, ctx, [...path, key]);
}
const ChannelsSchema = object({
	defaults: object({
		groupPolicy: GroupPolicySchema.optional(),
		contextVisibility: ContextVisibilityModeSchema.optional(),
		heartbeatVisibility: ChannelHeartbeatVisibilitySchema,
		botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
		implicitMentions: ChannelImplicitMentionsSchema.optional()
	}).strict().optional(),
	modelByChannel: ChannelModelByChannelSchema
}).passthrough().superRefine((value, ctx) => {
	addLegacyChannelAcpBindingIssues(value, ctx);
}).optional();
//#endregion
//#region src/config/zod-schema.desktop.ts
const DesktopHostConfigShape = {
	enabled: boolean().register(configUiMetadata, {
		label: "Desktop Sharing",
		help: "Enables this machine's desktop source. Paired macOS, Windows, and Linux nodes default to enabled; an explicit desktop-app sharing preference takes precedence. The Gateway host Labs source defaults to disabled and applies changes live. Restart a paired node after changing its desktop config."
	}),
	managed: boolean().optional().register(configUiMetadata, {
		label: "Managed Linux Host Desktop",
		help: "Runs and supervises a loopback-only headless TigerVNC/XFCE desktop on Linux. An explicit port or existing default-port VNC server still takes precedence."
	}),
	port: number().int().min(1).max(65535).optional().register(configUiMetadata, {
		label: "Local VNC Port",
		help: "Loopback RFB port of an already-running VNC server on this machine (default: 5900)."
	}),
	passwordFile: string().trim().min(1).refine(path.isAbsolute, "VNC passwordFile must be an absolute path").optional().register(configUiMetadata, {
		label: "Local VNC Password File",
		help: "Absolute path to the VNC password file. Omit on macOS to enter account credentials when opening the desktop viewer."
	})
};
const DesktopConfigShape = { host: object(DesktopHostConfigShape).strict().register(configUiMetadata, {
	label: "Local Desktop",
	help: "Connects to an existing loopback VNC server. Linux Gateways can also use an explicitly enabled managed headless desktop."
}).optional().register(configUiMetadata, {
	label: "Local Desktop",
	help: "Desktop observation for paired nodes, or the experimental Gateway host source, backed by a local VNC server."
}) };
const DesktopConfigSchema = object(DesktopConfigShape).strict().optional();
const { labels: DESKTOP_FIELD_LABELS, help: DESKTOP_FIELD_HELP } = projectConfigFieldMetadata(DesktopConfigSchema, "desktop");
//#endregion
//#region src/gateway/control-ui-bootstrap-contract.ts
/** HTTP path for the Control UI bootstrap config payload. */
const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/control-ui-config.json";
/** Fragment marker selecting the host-authorized browser-owner bootstrap profile. */
const CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM = "bootstrapProfile";
const CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT = "owner";
/** Carries the gateway-configured Control UI mount path into browser bootstrap. */
const CONTROL_UI_BASE_PATH_ATTRIBUTE = "data-openclaw-control-ui-base-path";
/** Marks whether the served document CSP permits the terminal WASM runtime. */
const CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE = "data-openclaw-terminal-enabled";
const CONTROL_UI_ENVIRONMENT_ATTRIBUTE = "data-openclaw-environment";
const CONTROL_UI_ENVIRONMENT_COLORS = [
	"teal",
	"amber",
	"purple",
	"coral",
	"pink",
	"blue",
	"green",
	"red",
	"gray"
];
//#endregion
//#region src/config/gateway-portal-ingress.ts
/** Validate a bare DNS suffix with room for a random per-portal hostname label. */
function isValidPortalIngressDomain(domain) {
	try {
		if (new URL(`https://portal.${domain}`).hostname !== `portal.${domain.toLowerCase()}`) return false;
	} catch {
		return false;
	}
	return domain.length <= 220 && domain.includes(".") && isIP(domain) === 0 && domain.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/iu.test(label));
}
/** Reject a portal namespace containing a known Gateway/Control UI hostname. */
function portalIngressConflictsWithOrigin(domain, origin) {
	try {
		const hostname = new URL(origin).hostname.toLowerCase();
		const suffix = domain.toLowerCase();
		return hostname === suffix || hostname.endsWith(`.${suffix}`);
	} catch {
		return false;
	}
}
//#endregion
//#region src/config/zod-schema.mcp-server.ts
const HttpUrlSchema = string().url().refine(isHttpUrl, "Expected http:// or https:// URL");
const McpOAuthClientMetadataUrlSchema = string().url().refine((value) => {
	const url = new URL(value);
	return isHttpsUrl(url) && url.pathname !== "/";
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
const BrowserSnapshotDefaultsSchema = object({ 
/** Default snapshot mode (applies when mode is not provided). */
mode: literal("efficient").optional() }).strict().optional();
const NodeHostAgentRunsSchema = object({ claude: object({ enabled: boolean().optional() }).strict().optional() }).strict().optional();
const NodeHostWorkerRunsSchema = object({
	enabled: boolean().optional(),
	capacity: number().int().min(1).max(NODE_WORKER_CAPACITY_MAX).optional(),
	isolation: _enum(["none", "container"]).optional(),
	containerImage: string().trim().min(1).optional()
}).strict().optional();
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
const GatewayRemoteSchemaShape = {
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
};
const GatewayRemoteConfigSchema = strictObject(GatewayRemoteSchemaShape).optional();
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
}).superRefine((realtime, ctx) => {
	const provider = normalizeLowercaseStringOrEmpty(realtime.provider ?? "");
	const providers = realtime.providers ? Object.keys(realtime.providers) : [];
	if (provider && providers.length > 0 && !Object.hasOwn(realtime.providers, provider)) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: `talk.realtime.provider must match a key in talk.realtime.providers (missing "${provider}")`
	});
	if (!provider && providers.length > 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: "talk.realtime.provider is required when talk.realtime.providers defines multiple providers"
	});
});
const TalkSchema = strictObject({
	agentId: string().trim().min(1).optional(),
	provider: string().optional(),
	providers: record(string(), TalkProviderEntrySchema).optional(),
	realtime: TalkRealtimeSchema.optional(),
	consultThinkingLevel: _enum([
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh",
		"adaptive",
		"max",
		"ultra"
	]).optional(),
	consultFastMode: boolean().optional(),
	speechLocale: string().optional(),
	interruptOnSpeech: boolean().optional(),
	silenceTimeoutMs: number().int().positive().optional()
}).superRefine((talk, ctx) => {
	const provider = normalizeLowercaseStringOrEmpty(talk.provider ?? "");
	const providers = talk.providers ? Object.keys(talk.providers) : [];
	if (provider && providers.length > 0 && !Object.hasOwn(talk.providers, provider)) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: `talk.provider must match a key in talk.providers (missing "${provider}")`
	});
	if (!provider && providers.length > 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: "talk.provider is required when talk.providers defines multiple providers"
	});
});
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
	try {
		const url = new URL(value);
		return (url.protocol === "http:" || url.protocol === "https:") && url.pathname === "/" && !url.search && !url.hash && !url.username && !url.password;
	} catch {
		return false;
	}
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
//#region src/config/zod-schema.gateway.ts
const OperatorScopeSchema = _enum([
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	SESSION_READ_SCOPE,
	SESSION_WRITE_SCOPE,
	APPROVALS_SCOPE,
	QUESTIONS_SCOPE,
	PAIRING_SCOPE,
	TALK_SCOPE,
	TALK_SECRETS_SCOPE
]);
const GatewayOperatorRoleDefinitionSchema = strictObject({
	sessions: strictObject({ 
	/** Maximum access to another person's sessions without explicit membership. */
others: _enum([
		"none",
		"view",
		"suggest",
		"write"
	]) }),
	/** Require sandbox isolation for newly created sessions, or inherit agent policy by default. */
	sandbox: _enum(["inherit", "required"]).optional(),
	/** Agent IDs available for session creation and runs, or all agents when set to "*". */
	agents: union([literal("*"), array(string().trim().min(1).refine(isValidAgentId, "Invalid agent id")).transform((agents) => uniqueValues(agents.map(normalizeAgentId)))]),
	/** Ceiling applied to the authenticated profile's granted operator scopes. */
	scopes: array(OperatorScopeSchema).transform((scopes) => uniqueValues(scopes)),
	/** Required access-policy plugin; availability is checked at admission, not config parsing. */
	accessPolicyPlugin: string().trim().min(1).max(128).optional()
});
const GatewayOperatorRoleNameSchema = string().trim().min(1).max(128);
const GATEWAY_HTTP_LOOPBACK_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"[::1]"
]);
function validateGatewayPublicOrigin(value) {
	if (!validateHttpOrigin(value)) return false;
	const url = new URL(value);
	return url.protocol === "https:" || GATEWAY_HTTP_LOOPBACK_HOSTS.has(url.hostname);
}
const GatewayConfigSchema = strictObject({
	/** Single multiplexed port for Gateway WS + HTTP (default: 18789). */
	port: number().int().min(1).max(65535).optional(),
	/**
	* Explicit gateway mode. When set to "remote", local gateway start is disabled.
	* When set to "local", the CLI may start the gateway locally.
	*/
	mode: union([literal("local"), literal("remote")]).optional(),
	/**
	* Bind address policy for the Gateway WebSocket + Control UI HTTP server.
	* - auto: Loopback (127.0.0.1) if available, else 0.0.0.0 (fallback to all interfaces)
	* - lan: 0.0.0.0 (all interfaces, no fallback, current BYOH path is IPv4-only)
	* - loopback: 127.0.0.1 (local-only)
	* - tailnet: Tailnet IPv4 plus 127.0.0.1 if available, else loopback only
	* - custom: User-specified IPv4 address (requires customBindHost); specific IPv4s also bind 127.0.0.1
	* IPv6-only BYOH is not natively supported on this path today. Use an IPv4 sidecar or proxy.
	* Default: loopback (127.0.0.1).
	*/
	bind: union([
		literal("auto"),
		literal("lan"),
		literal("loopback"),
		literal("custom"),
		literal("tailnet")
	]).optional(),
	/** Custom IPv4 address for bind="custom" mode. IPv6-only BYOH requires an IPv4 sidecar or proxy. */
	customBindHost: string().optional(),
	/** Externally reachable HTTPS origin for Gateway callback routes; HTTP only on loopback. */
	publicOrigin: string().url().refine(validateGatewayPublicOrigin, "gateway.publicOrigin must be a bare HTTPS origin; HTTP is allowed only for localhost, 127.0.0.1, or [::1]").optional(),
	/** Private HTTPS wildcard proxy forwarding to a dedicated loopback listener. */
	portals: strictObject({ ingress: strictObject({
		domain: string().refine(isValidPortalIngressDomain, "Portal ingress domain must be a bare DNS domain"),
		port: number().int().min(1).max(65535)
	}).optional() }).optional(),
	controlUi: strictObject({
		/**
		* @deprecated Upgrade-only transport input. Retained so releases that shipped
		* this break-glass flag can migrate an unpaired browser safely.
		*/
		dangerouslyDisableDeviceAuth: boolean().optional(),
		/** If false, the Gateway will not serve the Control UI (default /). */
		enabled: boolean().optional(),
		/** Optional base path prefix for the Control UI (e.g. "/openclaw"). */
		basePath: string().optional(),
		experimental: strictObject({ 
		/** Allow native UI from user-installed plugins (default false; bundled UI stays available). */
customPlugins: boolean().optional() }).optional(),
		/** Optional filesystem root for Control UI assets (defaults to dist/control-ui). */
		root: string().optional(),
		/** Optional visual label and named color distinguishing this Gateway environment. */
		environment: strictObject({
			label: string().trim().min(1).max(24),
			color: _enum(CONTROL_UI_ENVIRONMENT_COLORS)
		}).optional(),
		/** Show the Discord community invitation in this Gateway's Control UI (default true). */
		communityInvite: boolean().optional(),
		/** Optional service credential used only for Control UI GitHub previews and discovery. */
		github: strictObject({ token: SecretInputSchema.optional().register(sensitive) }).optional(),
		/** Produce utility-model session status digests for subscribed Control UI clients (default true). */
		sessionObserver: boolean().optional(),
		/**
		* Embed sandbox mode for hosted Control UI previews.
		* - strict: no script execution inside embeds
		* - scripts: allow scripts while keeping embeds origin-isolated (default)
		* - trusted: allow scripts and same-origin privileges
		*/
		embedSandbox: union([
			literal("strict"),
			literal("scripts"),
			literal("trusted")
		]).optional(),
		/**
		* DANGEROUS: Allow hosted embeds to load absolute external http(s) URLs.
		* Default off; prefer hosted /__openclaw__/canvas or /__openclaw__/a2ui content.
		*/
		allowExternalEmbedUrls: boolean().optional(),
		/** Fetch public-site favicons through the Gateway for Control UI links (default true). */
		automaticallyFetchFavicons: boolean().optional(),
		/** Optional max-width for grouped Control UI chat messages (default: min(900px, 68%)). */
		/** Allowed browser origins for Control UI/WebChat websocket connections. */
		allowedOrigins: array(string()).optional(),
		/**
		* DANGEROUS: Keep Host-header origin fallback behavior.
		* Supported long-term for deployments that intentionally rely on this policy.
		*/
		dangerouslyAllowHostHeaderOriginFallback: boolean().optional()
	}).optional(),
	cliAgents: strictObject({ 
	/** Show catalog-backed CLI agents in the new-session model picker. Default: true. */
enabled: boolean().optional() }).optional(),
	terminal: strictObject({
		/** Master switch for the operator terminal. Default: true; set false to opt out. */
		enabled: boolean().optional(),
		/**
		* Shell executable to launch. When unset the host login shell is used
		* ($SHELL on Unix, %ComSpec% on Windows).
		*/
		shell: string().optional(),
		/**
		* How long (seconds) a session survives after its connection drops, staying
		* reattachable via terminal.attach. 0 kills sessions on disconnect
		* immediately. Default: 300.
		*/
		detachedSessionTimeoutSeconds: number().int().min(0).optional()
	}).optional(),
	auth: strictObject({
		/**
		* Authentication mode for Gateway connections. Token/password mode selects the
		* configured secret; clients may send it in either auth.token or auth.password.
		*/
		mode: union([
			literal("none"),
			literal("token"),
			literal("password"),
			literal("trusted-proxy")
		]).optional(),
		/** Shared secret selected by token mode (plaintext or SecretRef). */
		token: SecretInputSchema.optional().register(sensitive),
		/** Shared secret selected by password mode (plaintext or SecretRef; consider env instead). */
		password: SecretInputSchema.optional().register(sensitive),
		/** Allow Tailscale identity headers when serve mode is enabled. */
		allowTailscale: boolean().optional(),
		/** Operator scopes granted to verified trusted-proxy or Tailscale identities. */
		identityScopes: record(string().min(1), array(OperatorScopeSchema)).optional(),
		/** Rate-limit configuration for failed authentication attempts. */
		rateLimit: strictObject({
			/** Maximum failed attempts per IP before blocking.  @default 10 */
			maxAttempts: number().optional(),
			/** Sliding window duration in milliseconds.  @default 60000 (1 min) */
			windowMs: number().optional(),
			/** Lockout duration in milliseconds after the limit is exceeded.  @default 300000 (5 min) */
			lockoutMs: number().optional(),
			/** Exempt localhost/loopback addresses from auth rate limiting.  @default true */
			exemptLoopback: boolean().optional()
		}).optional(),
		/**
		* Configuration for trusted-proxy auth mode.
		* Required when mode is "trusted-proxy".
		*/
		trustedProxy: strictObject({
			/**
			* Header name containing the authenticated user identity (required).
			* Common values: "x-forwarded-user", "x-remote-user", "x-pomerium-claim-email"
			*/
			userHeader: string().min(1, "userHeader is required for trusted-proxy mode"),
			/**
			* Additional headers that MUST be present for the request to be trusted.
			* Use this to verify the request actually came through the proxy.
			* Example: ["x-forwarded-proto", "x-forwarded-host"]
			*/
			requiredHeaders: array(string()).optional(),
			/**
			* Optional allowlist of user identities that can access the gateway.
			* If empty or omitted, all authenticated users from the proxy are allowed.
			* Example: ["nick@example.com", "admin@company.org"]
			*/
			allowUsers: array(string()).optional(),
			/**
			* Allow loopback proxy sources (127.0.0.1, ::1) in trusted-proxy mode.
			* Default false; enable only when a same-host reverse proxy is the intended
			* trust boundary and direct Gateway access is otherwise locked down.
			*/
			allowLoopback: boolean().optional(),
			/** Optional verified GitHub identity from one explicitly trusted Access OIDC provider. */
			cloudflareAccessOidc: strictObject({
				/** Exact Cloudflare Access issuer origin, including https://. */
				issuer: string().regex(/^https:\/\/[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.cloudflareaccess\.com$/u, "Expected a Cloudflare Access HTTPS issuer origin without a trailing slash"),
				/** Access identity-provider ID, not its display name or the OIDC subject. */
				providerId: string().trim().min(1),
				/** Forwarded claim containing a verified numeric GitHub account ID as a decimal string. */
				githubAccountIdClaim: string().trim().min(1)
			}).optional(),
			/**
			* Automatically approve new browser/native UI operator devices and same-key scope upgrades after
			* trusted-proxy authentication. Disabled by default; configured scopes cap grants.
			*/
			deviceAutoApprove: strictObject({
				/** Enable automatic browser enrollment and same-key scope upgrades. @default false */
				enabled: boolean().optional(),
				/**
				* Maximum operator scopes granted by automatic approval. Listing
				* operator.admin explicitly lets every proxy-authenticated user request
				* automatic full-admin device grants. Requests without scopes receive the
				* configured maximum. @default operator.read, operator.write,
				* operator.approvals, operator.questions
				*/
				scopes: array(string().min(1)).optional()
			}).optional()
		}).optional()
	}).optional(),
	/** Optional profile-bound operator roles; omitted preserves legacy authorization. */
	roles: strictObject({
		/** Required validated default for profiles without a valid assigned role. */
		default: GatewayOperatorRoleNameSchema,
		/** Closed capability bundles indexed by administrator-selected role names. */
		definitions: record(GatewayOperatorRoleNameSchema, GatewayOperatorRoleDefinitionSchema).refine((definitions) => Object.keys(definitions).length > 0, "gateway.roles.definitions must contain at least one role definition")
	}).superRefine((roles, ctx) => {
		if (!Object.hasOwn(roles.definitions, roles.default)) ctx.addIssue({
			code: "custom",
			message: "gateway.roles.default must name a configured role definition",
			path: ["default"]
		});
	}).optional(),
	/**
	* IPs of trusted reverse proxies (e.g. Traefik, nginx). When a connection
	* arrives from one of these IPs, the Gateway trusts `x-forwarded-for`
	* to determine the client IP for local pairing and HTTP checks.
	*/
	trustedProxies: array(string()).optional(),
	/**
	* Allow `x-real-ip` as a fallback only when `x-forwarded-for` is missing.
	* Default: false (safer fail-closed behavior).
	*/
	allowRealIpFallback: boolean().optional(),
	/** Tool access restrictions for HTTP /tools/invoke endpoint. */
	tools: strictObject({
		/** Tools to deny via gateway HTTP /tools/invoke (extends defaults). */
		deny: array(string()).optional(),
		/** Tools to explicitly allow (removes from default deny list). */
		allow: array(string()).optional()
	}).optional(),
	tailscale: strictObject({
		/** Tailscale exposure mode for the Gateway control UI. */
		mode: union([
			literal("off"),
			literal("serve"),
			literal("funnel")
		]).optional(),
		/**
		* Detect an external Funnel route left on the ordinary Gateway listener and
		* leave exposure unchanged with migration guidance. Gateway-authenticated
		* routes reject that ingress; plugin-authenticated webhooks keep their owner auth.
		* @deprecated Migrate to `mode="funnel"`, which uses managed ingress.
		*/
		preserveFunnel: boolean().optional()
	}).optional(),
	remote: GatewayRemoteConfigSchema,
	reload: strictObject({ mode: union([literal("off"), literal("hybrid")]).optional() }).optional(),
	tls: object({
		enabled: boolean().optional(),
		autoGenerate: boolean().optional(),
		certPath: string().optional().refine((v) => v === void 0 || v.trim().length > 0, "certPath must not be blank"),
		keyPath: string().optional().refine((v) => v === void 0 || v.trim().length > 0, "keyPath must not be blank"),
		caPath: string().optional()
	}).optional(),
	http: strictObject({
		endpoints: strictObject({
			chatCompletions: strictObject({
				enabled: boolean().optional(),
				images: strictObject({ ...ResponsesEndpointUrlFetchShape }).optional()
			}).optional(),
			responses: strictObject({
				enabled: boolean().optional(),
				maxUrlParts: number().int().nonnegative().optional(),
				files: strictObject({
					...ResponsesEndpointUrlFetchShape,
					maxChars: number().int().positive().optional(),
					pdf: strictObject({
						maxPages: number().int().positive().optional(),
						maxPixels: number().int().positive().optional(),
						minTextChars: number().int().nonnegative().optional()
					}).optional()
				}).optional(),
				images: strictObject({ ...ResponsesEndpointUrlFetchShape }).optional()
			}).optional()
		}).optional(),
		securityHeaders: strictObject({ strictTransportSecurity: union([string(), literal(false)]).optional() }).optional()
	}).optional(),
	push: strictObject({ apns: strictObject({ relay: strictObject({
		baseUrl: string().optional(),
		timeoutMs: number().int().positive().optional()
	}).optional() }).optional() }).optional(),
	nodes: strictObject({
		/** Browser routing policy for node-hosted browser proxies. */
		browser: strictObject({
			/** Routing mode (default: auto). */
			mode: union([
				literal("auto"),
				literal("manual"),
				literal("off")
			]).optional(),
			/** Pin to a specific node id/name (optional). */
			node: string().optional()
		}).optional(),
		/** Pairing policy for node-role gateway clients. */
		pairing: strictObject({
			/**
			* Silently approve trusted local device pairing and access upgrades.
			* Set false to require explicit approval; metadata refreshes remain automatic.
			* Default: true.
			*/
			autoApproveLocal: boolean().optional(),
			/**
			* Opt-in CIDR/IP allowlist for auto-approving first-time node-role pairing.
			* Only applies to fresh node pairing requests with no requested scopes.
			* Default: unset/disabled.
			*/
			autoApproveCidrs: array(string()).optional(),
			/**
			* SSH-verified auto-approval for first-time node-role pairing (default: enabled).
			* The gateway connects back to the pairing host over SSH (BatchMode, strict
			* host keys) and approves only when the remote `openclaw node identity`
			* output matches the pending request's device key. Set false to disable SSH
			* verification; this is independent of autoApproveCidrs, so unset that too for
			* manual-only node pairing. The object form tunes the probe:
			* - user: remote user (default: gateway process user)
			* - identity: SSH identity file (default: standard SSH resolution)
			* - timeoutMs: probe timeout (default: 7000)
			* - cidrs: CIDRs/IPs eligible for probing (default: private/CGNAT ranges)
			*/
			sshVerify: union([boolean(), strictObject({
				user: string().optional(),
				identity: string().optional(),
				timeoutMs: number().int().positive().optional(),
				cidrs: array(string()).optional()
			})]).optional()
		}).optional(),
		/** Controls whether paired nodes may publish agent-visible plugin tools (default: true). */
		pluginTools: strictObject({ 
		/** Accept node-published plugin tool descriptors (default: true). */
enabled: boolean().optional() }).optional(),
		/** Accept node-published skill descriptors (default: true). */
		allowSkills: boolean().optional(),
		commands: strictObject({
			/** Additional node.invoke commands to allow on the gateway. */
			allow: array(string()).optional(),
			/** Commands to deny even if they appear in the defaults or node claims. */
			deny: array(string()).optional()
		}).optional()
	}).optional()
}).superRefine((gateway, ctx) => {
	const ingress = gateway.portals?.ingress;
	if (!ingress) return;
	if ([gateway.publicOrigin, ...gateway.controlUi?.allowedOrigins ?? []].some((origin) => origin && portalIngressConflictsWithOrigin(ingress.domain, origin))) ctx.addIssue({
		code: "custom",
		path: [
			"portals",
			"ingress",
			"domain"
		],
		message: "Portal ingress must use a separate domain from Gateway and Control UI origins"
	});
	if (ingress.port === (gateway.port ?? 18789)) ctx.addIssue({
		code: "custom",
		path: [
			"portals",
			"ingress",
			"port"
		],
		message: "Portal ingress port must differ from the Gateway port"
	});
}).optional();
//#endregion
//#region src/config/zod-schema.hooks.ts
function isSafeRelativeModulePath(raw) {
	const value = raw.trim();
	if (!value) return false;
	if (path.isAbsolute(value)) return false;
	if (value.startsWith("~")) return false;
	if (value.includes(":")) return false;
	if (value.split(/[\\/]+/g).some((part) => part === "..")) return false;
	return true;
}
const SafeRelativeModulePathSchema = string().refine(isSafeRelativeModulePath, "module must be a safe relative path (no absolute paths)");
const HookMappingSchema = object({
	id: string().optional(),
	match: object({
		path: string().optional(),
		source: string().optional()
	}).optional(),
	action: union([literal("wake"), literal("agent")]).optional(),
	wakeMode: union([literal("now"), literal("next-heartbeat")]).optional(),
	name: string().optional(),
	agentId: string().optional(),
	sessionKey: string().optional().register(sensitive),
	sessionMode: union([literal("isolated"), literal("persistent")]).optional(),
	messageTemplate: string().optional(),
	textTemplate: string().optional(),
	forEach: string().regex(/^[^.[\]]+$/, "forEach must be a top-level payload key").optional(),
	deliver: boolean().optional(),
	allowUnsafeExternalContent: boolean().optional(),
	channel: string().trim().min(1).optional(),
	to: string().optional(),
	model: string().optional(),
	thinking: string().optional(),
	timeoutSeconds: number().int().positive().optional(),
	transform: object({
		module: SafeRelativeModulePathSchema,
		export: string().optional()
	}).strict().optional()
}).strict().optional();
const HookConfigSchema = object({
	enabled: boolean().optional(),
	env: record(string(), string()).optional()
}).passthrough();
const InternalHooksSchema = object({
	enabled: boolean().optional(),
	entries: record(string(), HookConfigSchema).optional(),
	load: object({ extraDirs: array(string()).optional() }).strict().optional()
}).strict().optional();
const HooksGmailSchema = object({
	account: string().optional(),
	label: string().optional(),
	topic: string().optional(),
	subscription: string().optional(),
	pushToken: string().optional().register(sensitive),
	hookUrl: string().optional(),
	includeBody: boolean().optional(),
	maxBytes: number().int().positive().optional(),
	renewEveryMinutes: number().int().positive().optional(),
	allowUnsafeExternalContent: boolean().optional(),
	serve: object({
		bind: string().optional(),
		port: number().int().positive().optional(),
		path: string().optional()
	}).strict().optional(),
	tailscale: object({
		mode: union([
			literal("off"),
			literal("serve"),
			literal("funnel")
		]).optional(),
		path: string().optional(),
		target: string().optional()
	}).strict().optional(),
	model: string().optional(),
	thinking: union([
		literal("off"),
		literal("minimal"),
		literal("low"),
		literal("medium"),
		literal("high")
	]).optional()
}).strict().optional();
//#endregion
//#region src/config/zod-schema.logging.ts
const MetricNamePrefixSchema = string().max(128).regex(/^(?:[A-Za-z][A-Za-z0-9_./-]*)?$/);
const DiagnosticsConfigSchema = strictObject({
	enabled: boolean().optional(),
	/** Optional ad-hoc diagnostics flags (e.g. "telegram.http"). */
	flags: array(string()).optional(),
	otel: strictObject({
		enabled: boolean().optional(),
		endpoint: string().optional(),
		tracesEndpoint: string().optional(),
		metricsEndpoint: string().optional(),
		logsEndpoint: string().optional(),
		protocol: literal("http/protobuf").optional(),
		headers: record(string(), string()).optional(),
		serviceName: string().optional(),
		/** Replacement prefix for OpenClaw-owned metric names. Empty removes the prefix; defaults to "openclaw.". */
		metricNamePrefix: MetricNamePrefixSchema.optional(),
		traces: boolean().optional(),
		metrics: boolean().optional(),
		logs: boolean().optional(),
		/** Log export sink: OTLP by default, stdout JSONL, or both. */
		logsExporter: union([
			literal("otlp"),
			literal("stdout"),
			literal("both")
		]).optional(),
		/** Trace sample rate (0.0 - 1.0). */
		sampleRate: number().min(0).max(1).optional(),
		/** Metric export interval (ms). */
		flushIntervalMs: number().int().nonnegative().optional(),
		/** Opt in to raw non-system message/tool content in OTEL span attributes. */
		captureContent: boolean().optional()
	}).optional(),
	cacheTrace: strictObject({ 
	/** Write prompt-cache trace artifacts for debugging deterministic cache input. */
enabled: boolean().optional() }).optional()
}).optional();
const LoggingConfigSchema = strictObject({
	level: LoggingLevelSchema.optional(),
	file: string().optional(),
	/** Maximum size of a single log file in bytes before rotation. Default: 100 MB. */
	maxFileBytes: number().int().positive().optional(),
	consoleLevel: LoggingLevelSchema.optional(),
	consoleStyle: union([literal("pretty"), literal("json")]).optional(),
	/** Redact sensitive tokens in log sinks and persisted transcript text. Default: "tools". Safety-boundary UI/tool/diagnostic payloads may still redact when this is "off". */
	/** Regex patterns used to redact sensitive tokens from logs and transcripts. */
	redactPatterns: array(string()).optional(),
	/** Metadata-only agent activity audit ledger settings. */
	audit: strictObject({
		/**
		* Record metadata-only run, tool, and enabled message lifecycle events into
		* the shared state database. Content is never stored. Default: true. This is
		* applied live; disabling stops new collection while accepted writes drain and retained
		* records stay readable until they expire.
		*/
		enabled: boolean().optional(),
		/**
		* Retain bounded execution-identity attribution for exact-run inspection.
		* Default: false. Requires the audit ledger and applies to newly admitted runs.
		*/
		executionIdentity: boolean().optional(),
		/**
		* Record content-free message lifecycle metadata. `direct` records only
		* known direct conversations; `all` also records group, channel, and
		* unknown conversation kinds. Default: `off`.
		*/
		messages: union([
			literal("off"),
			literal("direct"),
			literal("all")
		]).optional()
	}).optional()
}).optional();
//#endregion
//#region src/config/zod-schema.proxy.ts
const ProxyLoopbackModeSchema = _enum([
	"gateway-only",
	"proxy",
	"block"
]);
const ProxyTlsConfigSchema = object({ caFile: string().min(1).optional() }).strict().optional();
const ProxyConfigSchema = object({
	enabled: boolean().optional(),
	proxyUrl: url().refine(isHttpUrl, { message: "proxyUrl must use http:// or https://" }).register(sensitive).optional(),
	tls: ProxyTlsConfigSchema,
	loopbackMode: ProxyLoopbackModeSchema.optional()
}).strict().optional();
//#endregion
//#region src/config/zod-schema.session-config.ts
const SessionResetConfigSchema = object({
	mode: union([
		literal("none"),
		literal("daily"),
		literal("idle")
	]).optional(),
	atHour: number().int().min(0).max(23).optional(),
	idleMinutes: number().int().positive().optional()
}).strict();
const PositiveDurationSchema = union([string(), number()]).superRefine((value, ctx) => {
	try {
		if (parseDurationMs(normalizeStringifiedOptionalString(value) ?? "", { defaultUnit: "d" }) <= 0) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "duration must be positive (use ms, s, m, h, d), e.g. 30d"
		});
	} catch {
		ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "invalid duration (use ms, s, m, h, d)"
		});
	}
});
const SessionSendPolicySchema = createAllowDenyChannelRulesSchema();
const SessionSchema = object({
	scope: union([literal("per-sender"), literal("global")]).optional(),
	dmScope: _enum([
		"main",
		"per-peer",
		"per-channel-peer",
		"per-account-channel-peer"
	]).optional(),
	groupScope: _enum(["main", "per-group"]).optional(),
	notifyOnCreate: boolean().optional(),
	identityLinks: record(string(), array(string())).optional(),
	resetTriggers: array(string()).optional(),
	reset: SessionResetConfigSchema.optional(),
	resetByType: object({
		direct: SessionResetConfigSchema.optional(),
		group: SessionResetConfigSchema.optional(),
		thread: SessionResetConfigSchema.optional()
	}).strict().optional(),
	resetByChannel: record(string(), SessionResetConfigSchema).optional(),
	store: string().optional(),
	mainKey: string().optional(),
	sendPolicy: SessionSendPolicySchema.optional(),
	threadBindings: object({
		enabled: boolean().optional(),
		idleHours: number().nonnegative().optional(),
		maxAgeHours: number().nonnegative().optional(),
		spawnSessions: boolean().optional(),
		defaultSpawnContext: _enum(["isolated", "fork"]).optional()
	}).strict().optional(),
	sharing: object({
		readOnly: boolean().optional(),
		suggest: boolean().optional(),
		drafts: boolean().optional()
	}).strict().optional(),
	maintenance: object({
		mode: _enum(["enforce", "warn"]).optional(),
		coldStorage: object({
			enabled: boolean().optional(),
			afterDays: number().int().positive().optional()
		}).strict().optional(),
		pruneAfter: PositiveDurationSchema.optional(),
		archiveDashboardAfter: union([
			PositiveDurationSchema,
			literal(false),
			literal(0)
		]).optional(),
		maxEntries: number().int().positive().optional(),
		preserveRecent: union([PositiveDurationSchema, literal(false)]).optional(),
		resetArchiveRetention: union([PositiveDurationSchema, literal(false)]).optional(),
		maxDiskBytes: union([
			string(),
			number(),
			literal(false)
		]).optional(),
		highWaterBytes: union([string(), number()]).optional()
	}).strict().superRefine((val, ctx) => {
		if (val.maxDiskBytes !== void 0 && val.maxDiskBytes !== false) try {
			parseByteSize(normalizeStringifiedOptionalString(val.maxDiskBytes) ?? "", { defaultUnit: "b" });
		} catch {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["maxDiskBytes"],
				message: "invalid size (use b, kb, mb, gb, tb)"
			});
		}
		if (val.highWaterBytes !== void 0) try {
			parseByteSize(normalizeStringifiedOptionalString(val.highWaterBytes) ?? "", { defaultUnit: "b" });
		} catch {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["highWaterBytes"],
				message: "invalid size (use b, kb, mb, gb, tb)"
			});
		}
	}).optional()
}).strict().optional();
//#endregion
//#region src/config/zod-schema.session.ts
const CommandsSchema = object({
	native: NativeCommandsSettingSchema.optional().default("auto"),
	nativeSkills: NativeCommandsSettingSchema.optional().default("auto"),
	text: boolean().optional(),
	bash: boolean().optional(),
	bashForegroundMs: number().int().min(0).max(3e4).optional(),
	config: boolean().optional(),
	mcp: boolean().optional(),
	plugins: boolean().optional(),
	debug: boolean().optional(),
	restart: boolean().optional().default(true),
	ownerAllowFrom: array(union([string(), number()])).optional(),
	allowFrom: ElevatedAllowFromSchema.optional()
}).strict().optional().default(() => ({
	native: "auto",
	nativeSkills: "auto",
	restart: true
}));
//#endregion
//#region src/config/zod-schema.telemetry.ts
const TelemetryConfigShape = {
	enabled: boolean().optional().register(configUiMetadata, {
		label: "Anonymous Feature Statistics",
		help: "Shares enabled channel and provider names, plugin count, and recent session count with the daily update check. Disabled by default and always disabled when DO_NOT_TRACK=1."
	}),
	consentedAt: string().datetime().optional().register(configUiMetadata, {
		label: "Feature Statistics Consent Timestamp",
		help: "ISO timestamp recording when the operator accepted or declined anonymous feature statistics. Prevents the setup wizard from asking again."
	})
};
const TelemetryConfigSchema = object(TelemetryConfigShape).strict().optional();
const { labels: TELEMETRY_FIELD_LABELS, help: TELEMETRY_FIELD_HELP } = projectConfigFieldMetadata(TelemetryConfigSchema, "telemetry");
//#endregion
//#region src/config/zod-schema.root-shape.ts
const OpenClawSchemaShape = {
	$schema: string().optional(),
	meta: strictObject({
		lastTouchedVersion: string().optional(),
		migrations: strictObject({
			modelPolicyAllowlist: literal(true).optional(),
			utilityModelSeparation: literal(true).optional()
		}).optional()
	}).optional(),
	env: object({
		shellEnv: strictObject({
			enabled: boolean().optional(),
			timeoutMs: number().int().nonnegative().optional()
		}).optional(),
		vars: record(string(), string()).optional()
	}).strict().optional(),
	wizard: strictObject({
		accessMode: union([literal("full"), literal("guarded")]).optional(),
		appRecommendations: boolean().optional(),
		lastRunAt: string().optional(),
		lastRunVersion: string().optional(),
		lastRunCommit: string().optional(),
		lastRunCommand: string().optional(),
		lastRunMode: union([literal("local"), literal("remote")]).optional(),
		securityAcknowledgedAt: string().optional()
	}).optional(),
	diagnostics: DiagnosticsConfigSchema,
	logging: LoggingConfigSchema,
	update: strictObject({
		channel: union([
			literal("stable"),
			literal("extended-stable"),
			literal("beta"),
			literal("dev")
		]).optional(),
		checkOnStart: boolean().optional(),
		auto: strictObject({ enabled: boolean().optional() }).optional()
	}).optional(),
	telemetry: TelemetryConfigSchema,
	browser: strictObject({
		enabled: boolean().optional(),
		/** Allow importing cookies from the user's real Chrome-family profile into a managed profile (macOS). Default: true. */
		allowSystemProfileImport: boolean().optional(),
		/** If false, disable browser act:evaluate (arbitrary JS). Default: true */
		evaluateEnabled: boolean().optional(),
		/** Base URL of the CDP endpoint (for remote browsers). Default: loopback CDP on the derived port. */
		cdpUrl: string().optional(),
		/** Override the browser executable path (all platforms). */
		executablePath: string().optional(),
		/** Start Chrome headless (best-effort). Default: false */
		headless: boolean().optional(),
		/** Pass --no-sandbox to Chrome (Linux containers). Default: false */
		noSandbox: boolean().optional(),
		/** If true: never launch; only attach to an existing browser. Default: false */
		attachOnly: boolean().optional(),
		/** Default profile to use when profile param is omitted. Default: "openclaw" */
		defaultProfile: string().optional(),
		/** Default snapshot options (applied by the browser tool/CLI when unset). */
		snapshotDefaults: BrowserSnapshotDefaultsSchema,
		/** SSRF policy for browser navigation/open-tab operations. */
		ssrfPolicy: SsrFPolicyConfigSchema.optional(),
		profiles: record(string().regex(/^[a-z0-9-]+$/, "Profile names must be alphanumeric with hyphens only"), strictObject({
			/** CDP port for this profile. Allocated once at creation, persisted permanently. */
			cdpPort: number().int().min(1).max(65535).optional(),
			/** CDP/DevTools endpoint URL for this profile (remote CDP or existing-session endpoint attach). */
			cdpUrl: string().optional(),
			/** Explicit user data directory for existing-session Chrome MCP attachment. */
			userDataDir: string().optional(),
			/** Override the Chrome MCP command for existing-session profiles. */
			mcpCommand: string().optional(),
			/** Extra Chrome MCP arguments for existing-session profiles. */
			mcpArgs: array(string()).optional(),
			/**
			* Profile driver (default: openclaw). "extension" attaches to the user's
			* signed-in browser through the OpenClaw Chrome extension relay.
			*/
			driver: union([
				literal("openclaw"),
				literal("clawd"),
				literal("existing-session"),
				literal("extension")
			]).optional(),
			/** If true, launch this profile in headless mode. Falls back to browser.headless. */
			headless: boolean().optional(),
			/** Browser executable path for this profile. Falls back to browser.executablePath. */
			executablePath: string().optional(),
			/** If true, never launch a browser for this profile; only attach. Falls back to browser.attachOnly. */
			attachOnly: boolean().optional()
		}).refine((value) => value.driver === "existing-session" || value.driver === "extension" || value.cdpPort || value.cdpUrl, { message: "Profile must set cdpPort or cdpUrl" }).refine((value) => value.driver === "existing-session" || !value.userDataDir, { message: "Profile userDataDir is only supported with driver=\"existing-session\"" }).refine((value) => value.driver !== "extension" || !value.cdpUrl, { message: "Profile cdpUrl is not supported with driver=\"extension\" (the relay owns the endpoint)" })).optional(),
		/**
		* Additional Chrome launch arguments.
		* Useful for stealth flags, window size overrides, or custom user-agent strings.
		* Example: ["--window-size=1920,1080", "--disable-infobars"]
		*/
		extraArgs: array(string()).optional(),
		/** Best-effort cleanup policy for tabs opened by primary-agent browser sessions. */
		tabCleanup: strictObject({ 
		/** Enable best-effort cleanup for tracked primary-agent browser tabs. Default: true */
enabled: boolean().optional() }).optional(),
		/** Chrome extension relay authentication compatibility settings. */
		extensionRelay: strictObject({ 
		/** Temporarily accept legacy relay bearer/basic/subprotocol auth. Default: true. */
allowLegacyAuth: boolean().optional() }).optional()
	}).optional(),
	ui: strictObject({
		seamColor: HexColorSchema.optional(),
		prefs: strictObject({
			theme: union([
				literal("claw"),
				literal("knot"),
				literal("dash"),
				literal("absolutely"),
				literal("tide"),
				literal("beacon"),
				literal("phosphor"),
				literal("crt"),
				literal("manuscript"),
				literal("rose"),
				literal("miami"),
				literal("custom")
			]).optional(),
			themeMode: union([
				literal("light"),
				literal("dark"),
				literal("system")
			]).optional(),
			accent: union([literal("theme"), HexColorSchema.startsWith("#")]).optional(),
			locale: string().max(20).optional(),
			chatShowThinking: boolean().optional(),
			chatShowToolCalls: boolean().optional(),
			chatPersistCommentary: boolean().optional(),
			chatSendShortcut: union([literal("enter"), literal("modifier-enter")]).optional(),
			chatFollowUpMode: union([literal("steer"), literal("queue")]).optional(),
			sidebarEntries: array(string()).optional()
		}).optional()
	}).optional(),
	secrets: SecretsConfigSchema,
	auth: strictObject({
		profiles: record(string(), strictObject({
			provider: string(),
			mode: union([
				literal("api_key"),
				literal("aws-sdk"),
				literal("oauth"),
				literal("token")
			]),
			email: string().optional(),
			displayName: string().optional()
		})).optional(),
		order: record(string(), array(string())).optional()
	}).optional(),
	accessGroups: AccessGroupsSchema,
	acp: strictObject({
		enabled: boolean().optional(),
		dispatch: strictObject({ enabled: boolean().optional() }).optional(),
		backend: string().optional(),
		fallbacks: array(string()).optional(),
		defaultAgent: string().optional(),
		allowedAgents: array(string()).optional(),
		stream: strictObject({
			repeatSuppression: boolean().optional(),
			deliveryMode: union([literal("live"), literal("final_only")]).optional(),
			tagVisibility: record(string(), boolean()).optional()
		}).optional(),
		runtime: strictObject({ installCommand: string().optional() }).optional()
	}).optional(),
	models: ModelsConfigSchema,
	nodeHost: NodeHostSchema,
	agents: AgentsSchema,
	worktreeRoot: string().trim().min(1).refine((value) => path.isAbsolute(value) || value === "~" || value.startsWith("~/") || value.startsWith(`~${path.sep}`), "worktreeRoot must be an absolute path or a path starting with ~").optional(),
	worktreeAcceleration: boolean().optional(),
	tools: ToolsSchema,
	security: SecuritySchema,
	bindings: BindingsSchema,
	broadcast: BroadcastSchema,
	attachments: strictObject({ ttlHours: number().int().min(1).max(168).optional() }).optional(),
	messages: MessagesSchema,
	tts: TtsConfigSchema,
	commands: CommandsSchema,
	approvals: ApprovalsSchema,
	session: SessionSchema,
	cron: strictObject({
		enabled: boolean().optional(),
		/** Skip missed recurring slots at startup; one-shot catch-up is unchanged. Default: false. */
		skipMissedJobs: boolean().optional(),
		triggers: strictObject({ enabled: boolean().optional() }).optional(),
		/** Bearer token for cron webhook POST delivery. */
		webhookToken: SecretInputSchema.optional().register(sensitive),
		/** SSRF policy for all outbound cron webhook deliveries. */
		webhookSsrfPolicy: SsrFPolicyConfigSchema.optional(),
		/**
		* How long to retain completed cron run sessions before automatic pruning.
		* Accepts a duration string (e.g. "24h", "7d", "1h30m") or `false` to disable pruning.
		* A zero duration (e.g. "0h") also disables pruning; negative durations are invalid.
		* Default: "24h".
		*/
		sessionRetention: union([string(), literal(false)]).optional(),
		failureAlert: strictObject({
			enabled: boolean().optional(),
			after: number().int().min(1).optional(),
			cooldownMs: number().int().min(0).optional(),
			includeSkipped: boolean().optional(),
			mode: _enum(["announce", "webhook"]).optional(),
			accountId: string().optional(),
			channel: string().optional(),
			to: string().optional()
		}).optional()
	}).superRefine((val, ctx) => {
		if (val.sessionRetention !== void 0 && val.sessionRetention !== false) try {
			parseDurationMs(normalizeStringifiedOptionalString(val.sessionRetention) ?? "", { defaultUnit: "h" });
		} catch {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["sessionRetention"],
				message: "invalid duration (use ms, s, m, h, d)"
			});
		}
	}).optional(),
	transcripts: strictObject({
		enabled: boolean().optional(),
		autoStart: array(strictObject({
			providerId: string().min(1),
			whenOccupied: boolean().optional(),
			sessionId: string().min(1).optional(),
			title: string().min(1).optional(),
			accountId: string().min(1).optional(),
			guildId: string().min(1).optional(),
			channelId: string().min(1).optional(),
			meetingUrl: string().min(1).optional()
		})).optional()
	}).optional(),
	hooks: strictObject({
		enabled: boolean().optional(),
		path: string().optional(),
		token: string().optional().register(sensitive),
		defaultSessionKey: string().optional(),
		allowRequestSessionKey: boolean().optional(),
		allowedSessionKeyPrefixes: array(string()).optional(),
		allowedAgentIds: array(string()).optional(),
		presets: array(string()).optional(),
		transformsDir: string().optional(),
		mappings: array(HookMappingSchema).optional(),
		gmail: HooksGmailSchema,
		internal: InternalHooksSchema
	}).superRefine((hooks, ctx) => {
		const hasDefaultSessionKey = hooks.defaultSessionKey?.trim();
		for (const [index, mapping] of (hooks.mappings ?? []).entries()) {
			if (!mapping) continue;
			if ((mapping.action ?? "agent") === "agent" && mapping.sessionMode === "persistent" && !mapping.sessionKey?.trim() && !hasDefaultSessionKey && !mapping.transform) ctx.addIssue({
				code: ZodIssueCode.custom,
				path: [
					"mappings",
					index,
					"sessionKey"
				],
				message: "persistent hook mappings require sessionKey, hooks.defaultSessionKey, or a transform"
			});
		}
	}).optional(),
	channels: ChannelsSchema,
	discovery: strictObject({
		wideArea: strictObject({ domain: string().optional() }).optional(),
		mdns: strictObject({ mode: _enum([
			"off",
			"minimal",
			"full"
		]).optional() }).optional()
	}).optional(),
	talk: TalkSchema.optional(),
	gateway: GatewayConfigSchema,
	cloudWorkers: CloudWorkersConfigSchema,
	desktop: DesktopConfigSchema,
	memory: MemorySchema,
	mcp: McpConfigSchema,
	skills: strictObject({
		/** Optional bundled-skill allowlist (only affects bundled skills). */
		allowBundled: array(string()).optional(),
		load: strictObject({
			/**
			* Additional skill folders to scan (lowest precedence).
			* Each directory should contain skill subfolders with `SKILL.md`.
			*/
			extraDirs: array(string()).optional(),
			/**
			* Real target directories that skill symlinks may resolve into even when they
			* sit outside the configured source root.
			*/
			allowSymlinkTargets: array(string()).optional(),
			/** Watch skill folders for changes and refresh the skills snapshot. */
			watch: boolean().optional()
		}).optional(),
		install: strictObject({
			preferBrew: boolean().optional(),
			nodeManager: union([
				literal("npm"),
				literal("pnpm"),
				literal("yarn"),
				literal("bun")
			]).optional(),
			/** Allow gateway clients to install zip archives staged through skills.upload.*. */
			allowUploadedArchives: boolean().optional()
		}).optional(),
		limits: strictObject({
			/** Max number of immediate child directories to consider under a skills root before treating it as suspicious. */
			maxCandidatesPerRoot: number().int().min(1).optional(),
			/** Max number of skills to load per skills source (bundled/managed/workspace/extra). */
			maxSkillsLoadedPerSource: number().int().min(1).optional(),
			/** Max number of skills to include in the model-facing skills prompt. */
			maxSkillsInPrompt: number().int().min(0).optional(),
			/** Max characters for the model-facing skills prompt block (approx). */
			maxSkillsPromptChars: number().int().min(0).optional(),
			/** Max size (bytes) allowed for a SKILL.md file to be considered. */
			maxSkillFileBytes: number().int().min(0).optional()
		}).optional(),
		workshop: strictObject({
			/** Autonomous Skill Workshop behavior controlled separately from user-prompted proposals. */
			autonomous: strictObject({ 
			/** Capture policy for durable conversation signals and substantial completed work. */
mode: union([
				literal("off"),
				literal("propose"),
				literal("auto")
			]).optional() }).optional(),
			/** Whether proposal lifecycle actions need explicit approval. */
			approvalPolicy: union([literal("pending"), literal("auto")]).optional(),
			/** Maximum pending/quarantined proposals retained per workspace. */
			maxPending: number().int().min(1).optional(),
			/** Maximum generated skill proposal size in bytes. */
			maxSkillBytes: number().int().min(1).optional()
		}).optional(),
		entries: record(string(), SkillEntrySchema).optional()
	}).optional(),
	plugins: strictObject({
		/** Enable or disable plugin loading. */
		enabled: boolean().optional(),
		/** Optional plugin allowlist (plugin ids). */
		allow: array(string()).optional(),
		/** Optional plugin denylist (plugin ids). */
		deny: array(string()).optional(),
		load: strictObject({ 
		/** Additional plugin/extension paths to load. */
paths: array(string()).optional() }).optional(),
		slots: strictObject({
			/** Select which plugin owns the memory slot ("none" disables memory plugins). */
			memory: string().optional(),
			/** Select which plugin owns the context-engine slot. */
			contextEngine: string().optional()
		}).optional(),
		entries: record(string(), PluginEntrySchema).optional()
	}).optional(),
	surfaces: record(string(), strictObject({ silentReply: SilentReplyPolicyConfigSchema.optional() })).optional(),
	proxy: ProxyConfigSchema
};
//#endregion
//#region src/config/zod-schema.ts
const OpenClawSchema = strictObject(OpenClawSchemaShape).superRefine((cfg, ctx) => {
	const agents = listAgentEntries(cfg);
	const agentIds = new Set(agents.map((agent) => agent.id));
	const effectiveAgentIds = new Set(agents.map((agent) => normalizeAgentId(agent.id)));
	if (agents.length === 0) effectiveAgentIds.add("main");
	const explicitTargets = [
		{
			path: [
				"agents",
				"defaults",
				"heartbeat",
				"agentId"
			],
			agentId: cfg.agents?.defaults?.heartbeat?.agentId
		},
		{
			path: [
				"agents",
				"defaults",
				"systemAgent",
				"agentId"
			],
			agentId: cfg.agents?.defaults?.systemAgent?.agentId
		},
		{
			path: ["talk", "agentId"],
			agentId: cfg.talk?.agentId
		}
	];
	for (const target of explicitTargets) if (typeof target.agentId === "string" && !effectiveAgentIds.has(normalizeAgentId(target.agentId))) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: [...target.path],
		message: `Unknown agent id "${target.agentId}" (not in agents.entries).`
	});
	const bindings = cfg.bindings;
	if (agents.length > 0 && Array.isArray(bindings)) for (let idx = 0; idx < bindings.length; idx += 1) {
		const binding = bindings[idx];
		if (!binding || typeof binding !== "object") continue;
		const agentId = binding.agentId;
		if (typeof agentId === "string" && agentId !== "main" && !effectiveAgentIds.has(normalizeAgentId(agentId))) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				"bindings",
				idx,
				"agentId"
			],
			message: `Unknown agent id "${agentId}" (not in agents.entries).`
		});
	}
	const broadcast = cfg.broadcast;
	if (!broadcast) return;
	for (const [peerId, entry] of Object.entries(broadcast)) {
		if (peerId === "strategy" || typeof entry !== "object" || agents.length === 0 && !/^[a-z][a-z0-9_-]*:.+$/i.test(peerId)) continue;
		const ids = Array.isArray(entry) ? entry : entry.agents;
		for (const [idx, agentId] of ids.entries()) if (!agentIds.has(agentId)) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				"broadcast",
				peerId,
				...Array.isArray(entry) ? [] : ["agents"],
				idx
			],
			message: `Unknown agent id "${agentId}" (not in agents.entries).`
		});
	}
});
//#endregion
export { ChannelsSchema as _, NodeHostMcpServerNameSchema as a, portalIngressConflictsWithOrigin as c, CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM as d, CONTROL_UI_ENVIRONMENT_ATTRIBUTE as f, DESKTOP_FIELD_LABELS as g, DESKTOP_FIELD_HELP as h, McpServerNameSchema as i, CONTROL_UI_BASE_PATH_ATTRIBUTE as l, CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE as m, TELEMETRY_FIELD_HELP as n, NODE_HOST_FIELD_LABELS as o, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT as p, TELEMETRY_FIELD_LABELS as r, isValidPortalIngressDomain as s, OpenClawSchema as t, CONTROL_UI_BOOTSTRAP_CONFIG_PATH as u, parseNonNegativeByteSize as v };
