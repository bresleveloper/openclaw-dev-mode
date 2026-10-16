import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { $ as ZodPipe, Bn as preprocess, Et as _enum, Fn as object, G as ZodNever, I as ZodIntersection, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Z as ZodObject, bn as lazy, cr as url, it as ZodRecord, n as ZodArray, or as union, qn as strictObject, sr as unknown, vt as ZodUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { t as ALL_THINKING_LEVELS } from "./thinking.shared-Jy32Vp-O.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { B as AgentModelMapSchema, D as TypingModeSchema, F as MessagesSchema, H as AgentModelSchema, I as NativeCommandsSettingSchema, R as createAllowDenyChannelRulesSchema, U as AgentToolModelSchema, V as AgentModelPolicySchema, W as DecisionModelSchema, a as ContextVisibilityModeSchema, c as GroupPolicySchema, j as BroadcastSchema, l as HexColorSchema, m as ModelsConfigSchema, n as BlockStreamingCoalesceSchema, t as BlockStreamingChunkSchema, u as HumanDelaySchema, v as SecretsConfigSchema, w as TtsConfigSchema, y as SsrFPolicyConfigSchema } from "./zod-schema.core-MaNAY9dn.mjs";
import { n as sensitive, r as SecretInputSchema, t as configUiMetadata } from "./zod-schema.sensitive-bEFwMmOC.mjs";
import { t as parseByteSize } from "./parse-bytes-D4EkBe-w.mjs";
import { a as HeartbeatSchema, i as ElevatedAllowFromSchema, n as AgentEntrySchema, r as AgentSandboxSchema, s as ToolsSchema, t as AgentContextLimitsSchema } from "./zod-schema.agent-runtime-cX-pI-Mt.mjs";
import { f as ChannelImplicitMentionsSchema, h as ApprovalsSchema, m as ChannelBotLoopProtectionSchema, o as ChannelThreadBindingsSchema, p as ChannelHeartbeatVisibilitySchema } from "./zod-schema.channel-messaging-common-D8pVq6y7.mjs";
import { t as normalizeCloudRepo } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { t as validateProviderSettings } from "./provider-settings-CR-jdYHV.mjs";
import { t as GatewayConfigSchema } from "./zod-schema.gateway-CHIeMx7g.mjs";
import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
import { c as NodeHostSchema, d as SecuritySchema, f as SkillEntrySchema, h as BrowserSnapshotDefaultsSchema, i as McpConfigSchema, l as PluginEntrySchema, o as MemorySchema, p as TalkSchema, t as AccessGroupsSchema } from "./zod-schema.root-support-B_04-6fB.mjs";
import { n as LoggingConfigSchema, t as DiagnosticsConfigSchema } from "./zod-schema.logging-xOlZMArg.mjs";
import path from "node:path";
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
const AgentThinkingLevelSchema = _enum(ALL_THINKING_LEVELS);
const EmbeddedAgentConfigSchema = strictObject({
	projectSettingsPolicy: union([
		literal("trusted"),
		literal("sanitize"),
		literal("ignore")
	]).optional(),
	executionContract: union([literal("default"), literal("strict-agentic")]).optional(),
	cyberFailover: strictObject({
		mode: union([literal("auto"), literal("off")]).optional(),
		model: string().min(1).optional(),
		cooloffMs: number().int().positive().optional()
	}).optional()
});
const SilentReplyPolicyConfigSchema = strictObject({ group: SilentReplyPolicySchema.optional() });
const AgentOwnerTargetSchema = strictObject({ agentId: string().trim().min(1).optional() }).optional();
//#endregion
//#region src/config/zod-schema.agent-defaults.ts
const AgentDefaultsSchema = strictObject({
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
	mediaModels: strictObject({
		image: AgentToolModelSchema.optional(),
		video: AgentToolModelSchema.optional(),
		music: AgentToolModelSchema.optional()
	}).optional(),
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
	experimental: strictObject({
		/** Global opt-in for automatic Decision experiments; model selection is separate. */
		decisionAssistance: boolean().optional(),
		localModelLean: boolean().optional()
	}).optional(),
	userTimezone: string().optional(),
	startupContext: strictObject({
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
	}).optional(),
	contextPruning: strictObject({
		/** Pruning mode for old tool results in model context. */
		mode: union([literal("off"), literal("cache-ttl")]).optional(),
		/** TTL to consider cache expired (duration string, default unit: minutes). */
		ttl: string().optional(),
		tools: strictObject({
			/** Tool names eligible for context pruning. */
			allow: array(string()).optional(),
			/** Tool names excluded from context pruning. */
			deny: array(string()).optional()
		}).optional(),
		hardClear: strictObject({
			/** Replace oversized old tool results with a placeholder at high pressure. */
			enabled: boolean().optional(),
			/** Placeholder text inserted when a tool result is hard-cleared. */
			placeholder: string().optional()
		}).optional()
	}).optional(),
	compaction: strictObject({
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
		qualityGuard: strictObject({
			/** Enable compaction summary quality audits and regeneration retries. Default: false. */
			enabled: boolean().optional(),
			/** Maximum regeneration retries after a failed quality audit. Default: 1 when enabled. */
			maxRetries: number().int().nonnegative().optional()
		}).optional(),
		/** Mid-turn precheck for tool-loop context pressure. Default: disabled. */
		midTurnPrecheck: strictObject({ 
		/**
		* Enable structured context pressure checks after tool results are appended
		* and before the next agent model call. Default: false.
		*/
enabled: boolean().optional() }).optional(),
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
		memoryFlush: strictObject({
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
		}).optional(),
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
	}).optional(),
	embeddedAgent: EmbeddedAgentConfigSchema.optional(),
	thinkingDefault: AgentThinkingLevelSchema.optional(),
	fastModeDefault: union([
		boolean(),
		literal("auto"),
		literal("ultrafast")
	]).optional(),
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
	systemAgent: AgentOwnerTargetSchema,
	authInheritance: AgentOwnerTargetSchema,
	sessionStore: AgentOwnerTargetSchema,
	maxConcurrent: number().int().positive().optional(),
	subagents: strictObject({
		delegationMode: _enum(["suggest", "prefer"]).optional(),
		allowAgents: array(string()).optional(),
		maxConcurrent: number().int().positive().optional().describe("Maximum concurrent child-agent runs per immediate spawning/controller session (default: 8). Independent sessions have independent budgets."),
		maxSpawnDepth: number().int().min(1).max(5).optional().describe("Maximum nesting depth for sub-agent spawning. Default: 5; 1 makes direct children leaves."),
		maxChildrenPerAgent: number().int().min(1).max(20).optional().describe("Maximum number of active children a single agent session can spawn (default: 5)."),
		archiveAfterMinutes: number().int().min(0).optional(),
		model: AgentModelSchema.optional(),
		thinking: string().optional(),
		runTimeoutSeconds: number().int().min(0).optional(),
		announceTimeoutMs: number().int().positive().optional(),
		requireAgentId: boolean().optional()
	}).optional()
}).safeExtend({
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
const AgentsSchema = strictObject({
	ownership: literal("explicit").optional(),
	defaults: lazy(() => AgentDefaultsSchema).optional(),
	entries: record(string().regex(/^[a-z0-9_][a-z0-9_-]{0,63}$/i, "Invalid agent id"), AgentEntryConfigSchema).optional()
}).superRefine((value, ctx) => {
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
const BindingMatchSchema = strictObject({
	channel: string(),
	/**
	* Channel account to match.
	* - Omitted/empty: matches only the channel default account.
	* - "*": matches every account on the channel.
	* - Any other string: matches that specific account id.
	*/
	accountId: string().optional(),
	peer: strictObject({
		kind: union([
			literal("direct"),
			literal("group"),
			literal("channel")
		]),
		id: string()
	}).optional(),
	guildId: string().optional(),
	teamId: string().optional(),
	/** Discord role IDs used for role-based routing. */
	roles: array(string()).optional()
});
const BindingSessionSchema = strictObject({
	/** Optional session scoping override for conversations matched by this binding. */
	dmScope: _enum([
		"main",
		"per-peer",
		"per-channel-peer",
		"per-account-channel-peer"
	]).optional(),
	groupScope: _enum(["main", "per-group"]).optional()
});
const RouteBindingSchema = strictObject({
	/** Missing type is interpreted as route for backward compatibility. */
	type: literal("route").optional(),
	agentId: string(),
	comment: string().optional(),
	match: BindingMatchSchema,
	session: BindingSessionSchema.optional()
});
const AcpBindingSchema = strictObject({
	type: literal("acp"),
	agentId: string(),
	comment: string().optional(),
	match: BindingMatchSchema,
	acp: strictObject({
		mode: _enum(["persistent", "oneshot"]).optional(),
		label: string().optional(),
		cwd: string().optional(),
		backend: string().optional()
	}).optional()
}).superRefine((value, ctx) => {
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
	defaults: strictObject({
		groupPolicy: GroupPolicySchema.optional(),
		contextVisibility: ContextVisibilityModeSchema.optional(),
		heartbeatVisibility: ChannelHeartbeatVisibilitySchema,
		botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
		implicitMentions: ChannelImplicitMentionsSchema.optional()
	}).optional(),
	modelByChannel: ChannelModelByChannelSchema
}).passthrough().superRefine((value, ctx) => {
	addLegacyChannelAcpBindingIssues(value, ctx);
}).optional();
//#endregion
//#region src/config/schema.walk.ts
/** Visit schema wrappers and their fields in config path order, preserving array/wildcard paths. */
function walkConfigSchema(schema, path, visit) {
	const walk = (node, fieldPath) => {
		let current = node;
		while (true) {
			visit(current, fieldPath);
			if (!isUnwrappable(current)) break;
			current = current.unwrap();
		}
		if (current instanceof ZodPipe) walk(current.out, fieldPath);
		else if (current instanceof ZodObject) {
			for (const key in current.shape) walk(current.shape[key], fieldPath ? `${fieldPath}.${key}` : key);
			const catchall = current.def.catchall;
			if (catchall && !(catchall instanceof ZodNever)) walk(catchall, fieldPath ? `${fieldPath}.*` : "*");
		} else if (current instanceof ZodArray) walk(current.element, fieldPath ? `${fieldPath}[]` : "[]");
		else if (current instanceof ZodRecord) walk(current.def.valueType, fieldPath ? `${fieldPath}.*` : "*");
		else if (current instanceof ZodUnion) for (const option of current.options) walk(option, fieldPath);
		else if (current instanceof ZodIntersection) {
			walk(current.def.left, fieldPath);
			walk(current.def.right, fieldPath);
		}
	};
	walk(schema, path);
}
function isUnwrappable(schema) {
	return "unwrap" in schema && typeof schema.unwrap === "function" && !(schema instanceof ZodArray);
}
//#endregion
//#region src/config/schema.field-metadata.ts
/** Derive documented paths from the schema instead of maintaining a second field inventory. */
function projectConfigFieldMetadata(schema, path) {
	const labels = {};
	const help = {};
	walkConfigSchema(schema, path, (fieldSchema, fieldPath) => {
		const metadata = configUiMetadata.get(fieldSchema);
		if (typeof metadata?.label === "string") labels[fieldPath] ??= metadata.label;
		if (typeof metadata?.help === "string") help[fieldPath] ??= metadata.help;
	});
	return {
		labels,
		help
	};
}
//#endregion
//#region src/config/zod-schema.cloud-workers.ts
const CloudWorkerSettingsSchema = record(string(), unknown()).superRefine((value, ctx) => {
	const message = validateProviderSettings(value, "Worker profile");
	if (message) ctx.addIssue({
		code: "custom",
		message
	});
});
const CloudWorkerProfileShape = {
	provider: string().trim().min(1).register(configUiMetadata, {
		label: "Cloud Worker Provider",
		help: "Worker provider id registered by a plugin. The configured plugin must expose this id before the gateway can provision environments from the profile."
	}),
	install: _enum(["bundle", "npm"]).optional().default("bundle").register(configUiMetadata, {
		label: "Cloud Worker Install Method",
		help: "Worker installation method: \"bundle\" (default) transfers the gateway's content-hashed installed build and supports released, development, and unreleased versions; \"npm\" installs the exact gateway version and is available only when that version is released."
	}),
	suspendAfter: string().refine((value) => {
		try {
			return /(?:ms|s|m|h|d)$/i.test(value) && parseDurationMs(value) >= 6e4;
		} catch {
			return false;
		}
	}, "Worker profile suspendAfter must be a duration of at least 1m").optional().register(configUiMetadata, {
		label: "Cloud Worker Idle Suspend Duration",
		help: "Automatically reclaims an idle cloud worker after this duration, such as 45m or 2h; the next message provisions a replacement. Minimum: 1m. Leave unset to keep workers running."
	}),
	readyWorkers: number().int().nonnegative().optional().register(configUiMetadata, {
		label: "Cloud Worker Ready Reserve Target",
		help: "Target unassigned prepared workers per eligible project using this profile (default: 1), subject to the Gateway-wide prepared pool cap. Set 0 to disable this profile's reserves while preserving snapshot reuse. Preparing workers and unconfirmed reserve cleanup count toward the target."
	}),
	settings: CloudWorkerSettingsSchema.optional().register(configUiMetadata, {
		label: "Cloud Worker Provider Settings",
		help: "Provider-owned settings validated by the selected plugin. Use SecretRef objects for secret-bearing values; opaque settings do not gain automatic secret resolution."
	})
};
const CloudWorkerProfileSchema = strictObject(CloudWorkerProfileShape).register(configUiMetadata, {
	label: "Cloud Worker Profile",
	help: "One cloud worker profile selected by name when creating an environment. Keep provider credentials in supported references rather than embedding secret material in this block."
});
const CloudWorkerProfileIdSchema = string().min(1).refine((value) => value === value.trim(), "Worker profile ids must not contain outer whitespace");
const CloudWorkerProjectKeySchema = string().min(1).refine((value) => normalizeCloudRepo(`https://${value}`) === value, "Project profile keys must use lowercase host/owner/repo identities without trailing .git");
const CloudWorkerProjectProfileSchema = CloudWorkerProfileIdSchema.register(configUiMetadata, {
	label: "Cloud Worker Project Profile",
	help: "Cloud worker profile name used by default when a session worktree's origin matches this repository identity."
});
const CloudWorkerPreparedPoolShape = { maxTotal: number().int().nonnegative().optional().register(configUiMetadata, {
	label: "Cloud Worker Ready Reserve Cap",
	help: "Gateway-wide cap on unassigned prepared cloud workers across projects and profiles (default: 4). Preparing workers and unconfirmed reserve cleanup count toward the cap. Set 0 to drain unassigned reserves and disable replenishment while preserving snapshot reuse and active sessions."
}) };
const CloudWorkersConfigShape = {
	desktop: boolean().optional().register(configUiMetadata, {
		label: "Cloud Worker Desktop (Labs)",
		help: "Enables the experimental worker.desktop.observe surface and Control UI Desktop panel for desktop-capable cloud worker environments."
	}),
	preparedPool: strictObject(CloudWorkerPreparedPoolShape).optional().register(configUiMetadata, {
		label: "Cloud Worker Prepared Pool",
		help: "Limits for prepared cloud workers kept ready for later sessions. Reserves incur running-machine charges until provider cleanup completes; their fixed expiry follows actual project demand and the provider's existing idle policy."
	}),
	projectProfiles: record(CloudWorkerProjectKeySchema, CloudWorkerProjectProfileSchema).optional().register(configUiMetadata, {
		label: "Cloud Worker Project Profiles",
		help: "Default cloud worker profile names keyed by normalized lowercase repository identity (host/owner/repo). Explicit dispatch profile ids take precedence."
	}),
	profiles: record(CloudWorkerProfileIdSchema, CloudWorkerProfileSchema).optional().register(configUiMetadata, {
		label: "Cloud Worker Profiles",
		help: "Named cloud worker profiles. Each profile selects a worker provider registered by a plugin and carries provider-owned settings."
	})
};
const CloudWorkersConfigSchema = strictObject(CloudWorkersConfigShape).optional();
const { labels: CLOUD_WORKER_FIELD_LABELS, help: CLOUD_WORKER_FIELD_HELP } = projectConfigFieldMetadata(CloudWorkersConfigSchema, "cloudWorkers");
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
const DesktopConfigShape = { host: strictObject(DesktopHostConfigShape).register(configUiMetadata, {
	label: "Local Desktop",
	help: "Connects to an existing loopback VNC server. Linux Gateways can also use an explicitly enabled managed headless desktop."
}).optional().register(configUiMetadata, {
	label: "Local Desktop",
	help: "Desktop observation for paired nodes, or the experimental Gateway host source, backed by a local VNC server."
}) };
const DesktopConfigSchema = strictObject(DesktopConfigShape).optional();
const { labels: DESKTOP_FIELD_LABELS, help: DESKTOP_FIELD_HELP } = projectConfigFieldMetadata(DesktopConfigSchema, "desktop");
//#endregion
//#region src/config/zod-schema.hooks.ts
function isSafeRelativeModulePath(raw) {
	const value = raw.trim();
	if (!value || path.isAbsolute(value) || value.startsWith("~") || value.includes(":")) return false;
	return !value.split(/[\\/]+/g).some((part) => part === "..");
}
const SafeRelativeModulePathSchema = string().refine(isSafeRelativeModulePath, "module must be a safe relative path (no absolute paths)");
const HookMappingSchema = strictObject({
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
	transform: strictObject({
		module: SafeRelativeModulePathSchema,
		export: string().optional()
	}).optional()
}).optional();
const HookConfigSchema = object({
	enabled: boolean().optional(),
	env: record(string(), string()).optional()
}).passthrough();
const InternalHooksSchema = strictObject({
	enabled: boolean().optional(),
	entries: record(string(), HookConfigSchema).optional(),
	load: strictObject({ extraDirs: array(string()).optional() }).optional()
}).optional();
const HooksGmailSchema = strictObject({
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
	serve: strictObject({
		bind: string().optional(),
		port: number().int().positive().optional(),
		path: string().optional()
	}).optional(),
	tailscale: strictObject({
		mode: union([
			literal("off"),
			literal("serve"),
			literal("funnel")
		]).optional(),
		path: string().optional(),
		target: string().optional()
	}).optional(),
	model: string().optional(),
	thinking: union([
		literal("off"),
		literal("minimal"),
		literal("low"),
		literal("medium"),
		literal("high")
	]).optional()
}).optional();
//#endregion
//#region src/config/zod-schema.proxy.ts
const ProxyLoopbackModeSchema = _enum([
	"gateway-only",
	"proxy",
	"block"
]);
const ProxyTlsConfigSchema = strictObject({ caFile: string().min(1).optional() }).optional();
const ProxyConfigSchema = strictObject({
	enabled: boolean().optional(),
	proxyUrl: url().refine(isHttpUrl, { message: "proxyUrl must use http:// or https://" }).register(sensitive).optional(),
	tls: ProxyTlsConfigSchema,
	loopbackMode: ProxyLoopbackModeSchema.optional()
}).optional();
//#endregion
//#region src/config/zod-schema.session-config.ts
const SessionResetConfigSchema = strictObject({
	mode: union([
		literal("none"),
		literal("daily"),
		literal("idle")
	]).optional(),
	atHour: number().int().min(0).max(23).optional(),
	idleMinutes: number().int().positive().optional()
});
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
const SessionSchema = strictObject({
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
	resetByType: strictObject({
		direct: SessionResetConfigSchema.optional(),
		group: SessionResetConfigSchema.optional(),
		thread: SessionResetConfigSchema.optional()
	}).optional(),
	resetByChannel: record(string(), SessionResetConfigSchema).optional(),
	store: string().optional(),
	mainKey: string().optional(),
	sendPolicy: SessionSendPolicySchema.optional(),
	threadBindings: ChannelThreadBindingsSchema.optional(),
	sharing: strictObject({
		readOnly: boolean().optional(),
		suggest: boolean().optional(),
		drafts: boolean().optional()
	}).optional(),
	maintenance: strictObject({
		mode: _enum(["enforce", "warn"]).optional(),
		coldStorage: strictObject({
			enabled: boolean().optional(),
			afterDays: number().int().positive().optional()
		}).optional(),
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
	}).superRefine((val, ctx) => {
		for (const key of ["maxDiskBytes", "highWaterBytes"]) {
			const value = val[key];
			if (value === void 0 || value === false) continue;
			try {
				parseByteSize(normalizeStringifiedOptionalString(value) ?? "", { defaultUnit: "b" });
			} catch {
				ctx.addIssue({
					code: ZodIssueCode.custom,
					path: [key],
					message: "invalid size (use b, kb, mb, gb, tb)"
				});
			}
		}
	}).optional()
}).optional();
//#endregion
//#region src/config/zod-schema.session.ts
const CommandsSchema = strictObject({
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
}).optional().default(() => ({
	native: "auto",
	nativeSkills: "auto",
	restart: true
}));
//#endregion
//#region src/config/zod-schema.storage.ts
const StorageSettingsSchema = record(string(), unknown()).superRefine((value, ctx) => {
	const message = validateProviderSettings(value, "Storage location");
	if (message) ctx.addIssue({
		code: "custom",
		message
	});
});
const StorageLocationSchema = strictObject({
	provider: string().trim().min(1).register(configUiMetadata, {
		label: "Storage Provider",
		help: "Storage provider id, such as \"filesystem\". Referencing a bundled provider automatically enables its plugin unless plugin policy disables it."
	}),
	settings: StorageSettingsSchema.register(configUiMetadata, {
		label: "Storage Provider Settings",
		help: "Provider-owned bounded JSON settings. Secret-bearing values must use SecretRef objects, which the provider resolves only when needed. The filesystem provider requires an absolute path to an existing directory."
	}),
	encryption: union([literal("none"), strictObject({ passphrase: SecretInputSchema.register(sensitive).register(configUiMetadata, {
		label: "Storage Encryption Passphrase",
		help: "Passphrase used to encrypt this location. Prefer a SecretRef and keep a recoverable copy: losing or changing the passphrase makes existing encrypted objects unreadable."
	}) })]).register(configUiMetadata, {
		label: "Storage Encryption",
		help: "Required encryption choice: a passphrase object encrypts objects before upload; \"none\" explicitly disables encryption. Backups can contain credentials, so use \"none\" only when the destination already provides suitable protection."
	})
}).register(configUiMetadata, {
	label: "Storage Location",
	help: "One named storage destination with provider settings and an explicit encryption choice. Initialize a new destination with openclaw storage init before writing objects."
});
const StorageConfigSchema = strictObject({ locations: record(string().regex(/^[a-z0-9][a-z0-9-]{0,62}$/), StorageLocationSchema).optional().register(configUiMetadata, {
	label: "Storage Locations",
	help: "Named storage destinations. Names contain 1–63 lowercase letters, digits, or hyphens and start with a letter or digit. Each destination keeps an initialization marker that runtime writes never create."
}) }).optional().register(configUiMetadata, {
	label: "Storage",
	help: "Reusable storage locations for OpenClaw artifacts. Core storage owns location identity, encryption, and health; providers transport objects and consumers decide what to retain."
});
const { labels: STORAGE_FIELD_LABELS, help: STORAGE_FIELD_HELP } = projectConfigFieldMetadata(StorageConfigSchema, "storage");
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
const TelemetryConfigSchema = strictObject(TelemetryConfigShape).optional();
const { labels: TELEMETRY_FIELD_LABELS, help: TELEMETRY_FIELD_HELP } = projectConfigFieldMetadata(TelemetryConfigSchema, "telemetry");
//#endregion
//#region src/config/zod-schema.root-shape.ts
const OpenClawSchemaShape = {
	$schema: string().optional(),
	meta: strictObject({
		lastTouchedVersion: string().optional(),
		migrations: strictObject({
			modelPolicyAllowlist: literal(true).optional(),
			utilityModelSeparation: literal(true).optional(),
			webhookListeners: union([literal(true), record(string(), array(array(string())))]).optional()
		}).optional()
	}).optional(),
	env: strictObject({
		shellEnv: strictObject({
			enabled: boolean().optional(),
			timeoutMs: number().int().nonnegative().optional()
		}).optional(),
		vars: record(string(), string()).optional()
	}).optional(),
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
			/** Browser engine capability preset. Lightpanda is an external, semantic-only CDP service. */
			engine: _enum(["chromium", "lightpanda"]).optional(),
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
		}).refine((value) => value.driver === "existing-session" || value.driver === "extension" || value.cdpPort || value.cdpUrl, { message: "Profile must set cdpPort or cdpUrl" }).refine((value) => value.driver === "existing-session" || !value.userDataDir, { message: "Profile userDataDir is only supported with driver=\"existing-session\"" }).refine((value) => value.driver !== "extension" || !value.cdpUrl, { message: "Profile cdpUrl is not supported with driver=\"extension\" (the relay owns the endpoint)" }).superRefine((value, ctx) => {
			if (value.engine !== "lightpanda") return;
			const endpoint = value.cdpUrl ? URL.parse(value.cdpUrl) : null;
			if (!endpoint || !["ws:", "wss:"].includes(endpoint.protocol)) ctx.addIssue({
				code: "custom",
				path: ["cdpUrl"],
				message: "Lightpanda requires an explicit ws:// or wss:// CDP endpoint"
			});
			if (value.attachOnly !== true) ctx.addIssue({
				code: "custom",
				path: ["attachOnly"],
				message: "Lightpanda requires attachOnly: true; OpenClaw does not launch it"
			});
			if (value.driver !== void 0 && value.driver !== "openclaw") ctx.addIssue({
				code: "custom",
				path: ["driver"],
				message: "Lightpanda requires the default \"openclaw\" CDP driver"
			});
			for (const key of [
				"cdpPort",
				"userDataDir",
				"mcpCommand",
				"mcpArgs",
				"headless",
				"executablePath"
			]) if (value[key] !== void 0) ctx.addIssue({
				code: "custom",
				path: [key],
				message: `Lightpanda does not support the profile ${key} setting`
			});
		})).optional(),
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
	}).superRefine((value, ctx) => {
		const endpoints = /* @__PURE__ */ new Map();
		for (const [name, profile] of Object.entries(value.profiles ?? {})) {
			const endpoint = profile.cdpUrl ? URL.parse(profile.cdpUrl) : null;
			if (!endpoint) continue;
			const key = endpoint.toString().replace(/\/$/, "");
			const previous = endpoints.get(key);
			if (previous && (previous.engine === "lightpanda" || profile.engine === "lightpanda")) ctx.addIssue({
				code: "custom",
				path: [
					"profiles",
					name,
					"cdpUrl"
				],
				message: `Lightpanda requires a dedicated CDP endpoint; also used by profile "${previous.name}"`
			});
			endpoints.set(key, {
				name,
				engine: profile.engine
			});
		}
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
	storage: StorageConfigSchema,
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
	if (agents.length > 0) {
		for (const [idx, { agentId }] of (cfg.bindings ?? []).entries()) if (agentId !== "main" && !effectiveAgentIds.has(normalizeAgentId(agentId))) ctx.addIssue({
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
export { STORAGE_FIELD_LABELS as a, CLOUD_WORKER_FIELD_HELP as c, ChannelsSchema as d, parseNonNegativeByteSize as f, STORAGE_FIELD_HELP as i, CLOUD_WORKER_FIELD_LABELS as l, TELEMETRY_FIELD_HELP as n, DESKTOP_FIELD_HELP as o, TELEMETRY_FIELD_LABELS as r, DESKTOP_FIELD_LABELS as s, OpenClawSchema as t, walkConfigSchema as u };
