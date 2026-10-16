import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { Bn as preprocess, Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { s as resolveExactExecModeFromPolicy } from "./exec-approvals-core-s7tTQC_a.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { D as TypingModeSchema, H as AgentModelSchema, N as GroupChatSchema, S as ToolsMediaSchema, d as IdentitySchema, u as HumanDelaySchema, w as TtsConfigSchema, x as ToolsLinksSchema, y as SsrFPolicyConfigSchema, z as AgentEntryBaseSchema } from "./zod-schema.core-MaNAY9dn.mjs";
import { n as sensitive, r as SecretInputSchema } from "./zod-schema.sensitive-bEFwMmOC.mjs";
import { t as getBlockedNetworkModeReason } from "./network-mode-DUpqMGsq.mjs";
import { t as MANAGED_GITHUB_PROFILE_ID_PATTERN } from "./github-identity-profile-id-BJzGq1wi.mjs";
import { t as LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS } from "./web-search-legacy-provider-keys-pn4zHmNy.mjs";
import { t as MemorySearchSchema } from "./zod-schema.memory-search-BxO53_FR.mjs";
import { a as splitSandboxBindSpec, n as isSandboxHostPathAbsolute } from "./host-paths-C5NtLpi_.mjs";
//#region src/config/zod-schema.sandbox.ts
function validateSandboxBindEntries(binds, ctx) {
	if (!binds) return;
	for (let i = 0; i < binds.length; i += 1) {
		const bind = binds[i] ?? "";
		if (!bind.trim()) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["binds", i],
				message: "Sandbox security: bind mount entry must be a non-empty string."
			});
			continue;
		}
		const parsed = splitSandboxBindSpec(bind);
		const source = parsed ? parsed.host : bind;
		if (!isSandboxHostPathAbsolute(source)) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["binds", i],
			message: `Sandbox security: bind mount "${bind}" uses a non-absolute source path "${source}". Only absolute POSIX or Windows drive-letter paths are supported for sandbox binds.`
		});
	}
}
const SandboxDockerSchema = strictObject({
	image: string().optional(),
	containerPrefix: string().optional(),
	workdir: string().optional(),
	readOnlyRoot: boolean().optional(),
	tmpfs: array(string()).optional(),
	network: string().optional(),
	user: string().optional(),
	capDrop: array(string()).optional(),
	env: record(string(), string()).optional(),
	setupCommand: union([string(), array(string())]).transform((value) => Array.isArray(value) ? value.join("\n") : value).pipe(string()).optional(),
	pidsLimit: number().int().positive().optional(),
	memory: union([string(), number()]).optional(),
	memorySwap: union([string(), number()]).optional(),
	cpus: number().positive().optional(),
	gpus: string().min(1).optional(),
	ulimits: record(string(), union([
		string(),
		number(),
		strictObject({
			soft: number().int().nonnegative().optional(),
			hard: number().int().nonnegative().optional()
		})
	])).optional(),
	seccompProfile: string().optional(),
	apparmorProfile: string().optional(),
	dns: array(string()).optional(),
	extraHosts: array(string()).optional(),
	binds: array(string()).optional(),
	dangerouslyAllowReservedContainerTargets: boolean().optional(),
	dangerouslyAllowExternalBindSources: boolean().optional(),
	dangerouslyAllowContainerNamespaceJoin: boolean().optional()
}).superRefine((data, ctx) => {
	validateSandboxBindEntries(data.binds, ctx);
	const blockedNetworkReason = getBlockedNetworkModeReason({
		network: data.network,
		allowContainerNamespaceJoin: data.dangerouslyAllowContainerNamespaceJoin === true
	});
	if (blockedNetworkReason === "host") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["network"],
		message: "Sandbox security: network mode \"host\" is blocked. Use \"bridge\" or \"none\" instead."
	});
	if (blockedNetworkReason === "container_namespace_join") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["network"],
		message: "Sandbox security: network mode \"container:*\" is blocked by default. Use a custom bridge network, or set dangerouslyAllowContainerNamespaceJoin=true only when you fully trust this runtime."
	});
	if (normalizeLowercaseStringOrEmpty(data.seccompProfile ?? "") === "unconfined") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["seccompProfile"],
		message: "Sandbox security: seccomp profile \"unconfined\" is blocked. Use a custom seccomp profile file or omit this setting."
	});
	if (normalizeLowercaseStringOrEmpty(data.apparmorProfile ?? "") === "unconfined") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["apparmorProfile"],
		message: "Sandbox security: AppArmor profile \"unconfined\" is blocked. Use a named AppArmor profile or omit this setting."
	});
}).optional();
const SandboxBrowserSchema = object({
	enabled: boolean().optional(),
	image: string().optional(),
	containerPrefix: string().optional(),
	network: string().optional(),
	cdpPort: number().int().positive().optional(),
	cdpSourceRange: string().optional(),
	vncPort: number().int().positive().optional(),
	noVncPort: number().int().positive().optional(),
	headless: boolean().optional(),
	noVncEnabled: boolean().optional(),
	allowHostControl: boolean().optional(),
	autoStart: boolean().optional(),
	autoStartTimeoutMs: number().int().positive().optional(),
	binds: array(string()).optional()
}).superRefine((data, ctx) => {
	validateSandboxBindEntries(data.binds, ctx);
	if (normalizeLowercaseStringOrEmpty(data.network ?? "") === "host") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["network"],
		message: "Sandbox security: browser network mode \"host\" is blocked. Use \"bridge\" or a custom bridge network instead."
	});
}).strict().optional();
const SandboxPruneSchema = strictObject({
	idleHours: number().int().nonnegative().optional(),
	maxAgeDays: number().int().nonnegative().optional()
}).optional();
//#endregion
//#region src/config/zod-schema.agent-runtime.ts
const AgentTtsConfigSchema = TtsConfigSchema.unwrap().extend({ prefsPath: string().optional() }).strict().optional();
const HeartbeatSchema = strictObject({
	every: string().optional(),
	activeHours: strictObject({
		start: string().optional(),
		end: string().optional(),
		timezone: string().optional()
	}).optional(),
	model: string().optional(),
	session: string().optional(),
	target: string().optional(),
	directPolicy: union([literal("allow"), literal("block")]).optional(),
	to: string().optional(),
	accountId: string().optional(),
	prompt: string().optional(),
	timeoutSeconds: number().int().positive().optional(),
	lightContext: boolean().optional(),
	isolatedSession: boolean().optional()
}).superRefine((val, ctx) => {
	if (val.every) try {
		parseDurationMs(val.every, { defaultUnit: "m" });
	} catch {
		ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["every"],
			message: "invalid duration (use ms, s, m, h)"
		});
	}
	const active = val.activeHours;
	if (!active) return;
	const timePattern = /^([01]\d|2[0-3]|24):([0-5]\d)$/;
	for (const path of ["start", "end"]) {
		const raw = active[path];
		if (!raw) continue;
		const match = timePattern.exec(raw);
		let message;
		if (!match) message = "invalid time (use \"HH:MM\" 24h format)";
		else if (match[1] === "24" && match[2] !== "00") message = "invalid time (24:00 is the only allowed 24:xx value)";
		else if (match[1] === "24" && path === "start") message = "invalid time (start cannot be 24:00)";
		if (message) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["activeHours", path],
			message
		});
	}
}).optional();
const AgentContextLimitsSchema = strictObject({
	/** Default max chars returned by memory_get before truncation metadata/notice (default: 12000). */
	memoryGetMaxChars: number().int().min(1).max(25e4).optional(),
	/** Max chars retained from post-compaction AGENTS.md context injection (default: 1800). */
	postCompactionMaxChars: number().int().min(1).max(5e4).optional()
}).optional();
const AgentSkillsLimitsSchema = strictObject({ maxSkillsPromptChars: number().int().min(0).optional() }).optional();
const ToolPolicyBaseSchema = strictObject({
	/** Exact tool names allowed in this policy scope. */
	allow: array(string()).optional(),
	/** Additional allowlist entries merged into the inherited policy. */
	alsoAllow: array(string()).optional(),
	/** Exact tool names denied after allow expansion; deny wins. */
	deny: array(string()).optional()
});
const ToolPolicySchema = ToolPolicyBaseSchema.superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "tools policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
}).optional();
const ToolPolicyBySenderSchema = record(string(), ToolPolicySchema).optional();
const TrimmedOptionalConfigStringSchema = string().transform(normalizeOptionalString).optional();
const CodexAllowedDomainsSchema = array(string()).transform((values) => {
	const deduped = normalizeUniqueStringEntries(values);
	return deduped.length > 0 ? deduped : void 0;
}).optional();
const CodexUserLocationSchema = strictObject({
	country: TrimmedOptionalConfigStringSchema,
	region: TrimmedOptionalConfigStringSchema,
	city: TrimmedOptionalConfigStringSchema,
	timezone: TrimmedOptionalConfigStringSchema
}).transform((value) => {
	return value.country || value.region || value.city || value.timezone ? value : void 0;
}).optional();
const BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD = "__openclawBlockedWebSearchKeys";
const ToolsWebSearchSchema = preprocess((value) => {
	if (!isRecord(value)) return value;
	const blockedKeys = Object.getOwnPropertyNames(value).filter((key) => isBlockedObjectKey(key));
	if (blockedKeys.length === 0) return value;
	return {
		...value,
		[BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD]: blockedKeys
	};
}, object({
	enabled: boolean().optional(),
	provider: string().optional(),
	maxResults: number().int().positive().optional(),
	timeoutSeconds: number().int().positive().optional(),
	cacheTtlMinutes: number().nonnegative().optional(),
	openaiCodex: strictObject({
		enabled: boolean().optional(),
		mode: union([literal("cached"), literal("live")]).optional(),
		allowedDomains: CodexAllowedDomainsSchema,
		contextSize: union([
			literal("low"),
			literal("medium"),
			literal("high")
		]).optional(),
		userLocation: CodexUserLocationSchema
	}).optional()
}).catchall(unknown()).superRefine((value, ctx) => {
	const blockedKeys = value[BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD];
	if (Array.isArray(blockedKeys)) for (const key of blockedKeys) {
		if (typeof key !== "string") continue;
		ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [key],
			message: "tools.web.search must not contain blocked object keys"
		});
	}
	for (const [key, entry] of Object.entries(value)) {
		if (key === BLOCKED_WEB_SEARCH_KEYS_ISSUE_FIELD || isBlockedObjectKey(key)) continue;
		if (key === "apiKey" || LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS.has(key) && isRecord(entry)) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [key],
			message: "legacy web_search provider config must use plugins.entries.<plugin>.config.webSearch"
		});
	}
})).optional();
const ToolsWebFetchSchema = strictObject({
	/** Enable web fetch tool (default: true). */
	enabled: boolean().optional(),
	/** Web fetch fallback provider id. */
	provider: string().optional(),
	/** Max characters to return from fetched content. */
	maxChars: number().int().positive().optional(),
	/** Hard cap for maxChars (tool or config), defaults to 20000. */
	maxCharsCap: number().int().positive().optional(),
	/** Max download size before truncation, defaults to 750000 bytes. */
	maxResponseBytes: number().int().positive().optional(),
	/** Timeout in seconds for fetch requests. */
	timeoutSeconds: number().int().positive().optional(),
	/** Cache TTL in minutes for fetched content. */
	cacheTtlMinutes: number().nonnegative().optional(),
	/** Maximum number of redirects to follow (default: 3). */
	maxRedirects: number().int().nonnegative().optional(),
	/** Override User-Agent header for fetch requests. */
	userAgent: string().optional(),
	/**
	* Extra request headers sent with direct web_fetch requests. Every value is
	* treated as sensitive in exposed config. Entries a request cannot carry are
	* dropped with a warning at request time.
	*/
	headers: record(string(), string().register(sensitive)).optional(),
	/** Use Readability to extract main content (default: true). */
	readability: boolean().optional(),
	/** Route web_fetch through a trusted HTTP(S) env proxy and let the proxy resolve DNS. Enable only when that proxy enforces outbound policy. */
	useTrustedEnvProxy: boolean().optional(),
	/** SSRF policy configuration for web_fetch. */
	ssrfPolicy: SsrFPolicyConfigSchema.optional()
}).optional();
const ToolsWebSchema = strictObject({
	search: ToolsWebSearchSchema,
	fetch: ToolsWebFetchSchema
}).optional();
const ToolProfileSchema = union([
	literal("minimal"),
	literal("coding"),
	literal("messaging"),
	literal("full")
]).optional();
function addAllowAlsoAllowConflictIssue(value, ctx, message) {
	if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		message
	});
}
const ToolPolicyWithProfileSchema = ToolPolicyBaseSchema.extend({ profile: ToolProfileSchema }).superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "tools.byProvider policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
});
const ElevatedAllowFromSchema = record(string(), array(union([string(), number()]))).optional();
const ToolExecApplyPatchSchema = strictObject({
	/** Enable apply_patch for OpenAI models (default: true; set false to disable). */
	enabled: boolean().optional(),
	/**
	* Restrict apply_patch paths to the workspace directory.
	* Default: true (safer; does not affect read/write/edit).
	*/
	workspaceOnly: boolean().optional(),
	/**
	* Optional allowlist of model ids that can use apply_patch.
	* Accepts either raw ids (e.g. "gpt-5.4") or full ids (e.g. "openai/gpt-5.4").
	*/
	allowModels: array(string()).optional()
}).optional();
const ToolExecSafeBinProfileSchema = strictObject({
	minPositional: number().int().nonnegative().optional(),
	maxPositional: number().int().nonnegative().optional(),
	allowedValueFlags: array(string()).optional(),
	deniedFlags: array(string()).optional()
});
const ToolExecBaseShape = {
	/** Exec host routing (default: auto). */
	host: _enum([
		"auto",
		"sandbox",
		"gateway",
		"node"
	]).optional(),
	/** Normalized exec policy mode. Prefer this over raw security/ask knobs. */
	mode: _enum([
		"deny",
		"allowlist",
		"ask",
		"auto",
		"full"
	]).optional(),
	/** Legacy exec security mode retained when no canonical mode can preserve policy. */
	security: _enum([
		"deny",
		"allowlist",
		"full"
	]).optional(),
	/** Legacy exec ask mode retained when no canonical mode can preserve policy. */
	ask: _enum([
		"off",
		"on-miss",
		"always"
	]).optional(),
	/** Default node binding for exec.host=node (node id/name). */
	node: string().optional(),
	/** Directories to prepend to PATH when running exec (gateway/sandbox). */
	pathPrepend: array(string()).optional(),
	/** Safe stdin-only binaries that can run without allowlist entries. */
	safeBins: array(string()).optional(),
	/**
	* Require explicit approval for interpreter inline-eval forms (`python -c`, `node -e`, etc.).
	* Prevents silent allowlist reuse and allow-always persistence for those forms.
	*/
	strictInlineEval: boolean().optional(),
	/** Render parser-derived command highlights in exec approval prompts (default: false). */
	commandHighlighting: boolean().optional(),
	/**
	* Default lifetime, in days, stamped onto standing grants minted by
	* allow-always on automation approvals. Unset means grants live until
	* revoked or the owning job changes. Terms freeze at mint; changing this
	* affects only future grants.
	*/
	grantExpiryDays: number().int().min(1).max(3650).optional(),
	/** Extra explicit directories trusted for safeBins path checks (never derived from PATH). */
	safeBinTrustedDirs: array(string()).optional(),
	/** Optional custom safe-bin profiles for entries in tools.exec.safeBins. */
	safeBinProfiles: record(string(), ToolExecSafeBinProfileSchema).optional(),
	/** Model-backed reviewer used by tools.exec.mode=auto before falling back to human approval. */
	reviewer: strictObject({
		/** Optional reviewer model override (provider/model or agent model config). */
		model: AgentModelSchema.optional(),
		/** Optional reasoning effort for model-backed approval reviews. */
		thinking: _enum([
			"minimal",
			"low",
			"medium",
			"high",
			"xhigh",
			"max"
		]).optional(),
		/** Optional Fast processing for supported provider requests. */
		fastMode: boolean().optional(),
		/** Reviewer timeout in milliseconds (default: 30000). */
		timeoutMs: number().int().positive().optional()
	}).optional(),
	/** Default time (ms) before an exec command auto-backgrounds. */
	backgroundMs: number().int().positive().optional(),
	/** Emit a running notice (ms) when approval-backed exec runs long (default: 10000, 0 = off). */
	approvalRunningNoticeMs: number().int().nonnegative().optional(),
	/** Default timeout (seconds) before auto-killing exec commands. */
	timeoutSeconds: number().int().positive().optional(),
	/** How long to keep finished sessions in memory (ms). */
	cleanupMs: number().int().positive().optional(),
	/** Emit a system event and heartbeat when a backgrounded exec exits. */
	notifyOnExit: boolean().optional(),
	/**
	* Also emit success exit notifications when a backgrounded exec has no output.
	* Default false to reduce context noise.
	*/
	notifyOnExitEmptySuccess: boolean().optional(),
	/** apply_patch subtool configuration. */
	applyPatch: ToolExecApplyPatchSchema
};
function addExecPolicyModeConflictIssue(value, ctx) {
	if (value.mode === void 0 || value.security === void 0 && value.ask === void 0) return;
	const exactMode = value.security !== void 0 && value.ask !== void 0 ? resolveExactExecModeFromPolicy({
		security: value.security,
		ask: value.ask
	}) : null;
	const repair = exactMode ? `Replace security/ask with mode="${exactMode}" (the equivalent of security="${value.security}" + ask="${value.ask}").` : value.security !== void 0 && value.ask !== void 0 ? "This security/ask pair has no exact mode equivalent. To keep this policy, retain both legacy fields and remove mode." : "The legacy policy is incomplete. Choose the intended security and ask values before converting; no mode equivalent can be inferred.";
	ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["mode"],
		message: `mode cannot be combined with security or ask in the same exec object. Update the deploy script, template, or patch at this scope. ${repair} Doctor migrates supported legacy policies to mode; run "openclaw doctor --fix" only when the saved file still needs migration.`
	});
}
const ToolExecSchema = strictObject(ToolExecBaseShape).superRefine(addExecPolicyModeConflictIssue).optional();
const ToolFsSchema = strictObject({ 
/**
* Restrict filesystem tools (read/write/edit/apply_patch) to the agent workspace directory.
* Default: false (unrestricted, matches legacy behavior).
*/
workspaceOnly: boolean().optional() }).optional();
const ToolLoopDetectionSchema = strictObject({ 
/** Enable tool-loop protection (default: false). */
enabled: boolean().optional() }).optional();
const ToolSearchSchema = union([boolean(), strictObject({
	/** Enable compact search/call cataloging for large tool sets. */
	enabled: boolean().optional(),
	/** Exposed model surface. "tools" exposes structured search/describe/call tools; "directory" keeps a bounded directory plus selected schemas visible while deferring the rest behind search/describe/call. */
	mode: _enum(["tools", "directory"]).optional(),
	/** Default search result count when the model omits a limit. Runtime clamps to maxSearchLimit. */
	searchDefaultLimit: number().int().positive().optional(),
	/** Maximum search result count. Runtime clamps to 1..50. */
	maxSearchLimit: number().int().positive().optional()
})]).optional();
const CodeModeSchema = union([
	boolean(),
	literal("auto"),
	strictObject({
		/** Explicit object-form activation. Omitted stays off; "auto" engages catalog-preferred models. A completely absent global codeMode setting defaults separately to auto. */
		enabled: union([boolean(), literal("auto")]).optional(),
		/** Executor. Node is the default; QuickJS provides a separate WASM guest. */
		executor: _enum(["node", "quickjs"]).optional(),
		/** Model-facing mode. Only "only" is supported: expose exec/wait and hide normal tools. */
		mode: literal("only").optional(),
		/** Wall-clock limit in milliseconds for one exec or wait call. */
		timeoutMs: number().int().positive().optional(),
		/** QuickJS guest heap limit or best-effort Node worker V8 heap budget in bytes; excludes external buffers and process RSS. */
		memoryLimitBytes: number().int().positive().optional(),
		/** Maximum serialized output bytes. */
		maxOutputBytes: number().int().positive().optional(),
		/** Maximum serialized snapshot bytes. */
		maxSnapshotBytes: number().int().positive().optional(),
		/** Maximum concurrent nested tool calls. */
		maxPendingToolCalls: number().int().positive().optional(),
		/** Retention for suspended snapshots. */
		snapshotTtlSeconds: number().int().positive().optional(),
		/** Default search result count for catalog.search. */
		searchDefaultLimit: number().int().positive().optional(),
		/** Maximum search result count for catalog.search. */
		maxSearchLimit: number().int().positive().optional()
	})
]).optional();
const SwarmSchema = union([boolean(), strictObject({
	/** Enable collector-mode subagents and agents_wait. Default: true. */
	enabled: boolean().optional(),
	/** Maximum concurrently running collector children per swarm group. */
	maxConcurrent: number().int().positive().optional(),
	/** Maximum live collector children per swarm group. */
	maxChildrenPerGroup: number().int().positive().optional(),
	/** Maximum lifetime collector spawns per swarm group. */
	maxTotalPerGroup: number().int().positive().optional(),
	/** Maximum agents_wait timeout in seconds. */
	waitTimeoutSecondsMax: number().int().positive().optional(),
	/** Default child agent id when sessions_spawn omits agentId. */
	defaultAgentId: string().optional()
})]).optional();
const SandboxSshSchema = strictObject({
	target: string().min(1).optional(),
	command: string().min(1).optional(),
	workspaceRoot: string().min(1).optional(),
	strictHostKeyChecking: boolean().optional(),
	updateHostKeys: boolean().optional(),
	identityFile: string().min(1).optional(),
	certificateFile: string().min(1).optional(),
	knownHostsFile: string().min(1).optional(),
	identityData: SecretInputSchema.optional().register(sensitive),
	certificateData: SecretInputSchema.optional().register(sensitive),
	knownHostsData: SecretInputSchema.optional().register(sensitive)
}).optional();
const AgentSandboxSchema = strictObject({
	mode: union([
		literal("off"),
		literal("non-main"),
		literal("all")
	]).optional(),
	backend: string().min(1).optional(),
	workspaceAccess: union([
		literal("none"),
		literal("ro"),
		literal("rw")
	]).optional(),
	sessionToolsVisibility: union([literal("spawned"), literal("all")]).optional(),
	scope: union([
		literal("session"),
		literal("agent"),
		literal("shared")
	]).optional(),
	workspaceRoot: string().optional(),
	docker: SandboxDockerSchema,
	ssh: SandboxSshSchema,
	browser: SandboxBrowserSchema,
	prune: SandboxPruneSchema
}).superRefine((data, ctx) => {
	if (getBlockedNetworkModeReason({
		network: data.browser?.network,
		allowContainerNamespaceJoin: data.docker?.dangerouslyAllowContainerNamespaceJoin === true
	}) === "container_namespace_join") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["browser", "network"],
		message: "Sandbox security: browser network mode \"container:*\" is blocked by default. Set sandbox.docker.dangerouslyAllowContainerNamespaceJoin=true only when you fully trust this runtime."
	});
}).optional();
const CommonToolPolicyFields = {
	/** Base tool profile applied before allow/deny lists. */
	profile: ToolProfileSchema,
	...ToolPolicyBaseSchema.shape,
	/** Optional tool policy overrides keyed by provider id or "provider/model". */
	byProvider: record(string(), ToolPolicyWithProfileSchema).optional(),
	/** Per-sender tool policy overrides keyed by sender identity. */
	toolsBySender: ToolPolicyBySenderSchema
};
const NestedToolPolicySchema = strictObject({ tools: ToolPolicySchema }).optional();
const ElevatedToolsSchema = strictObject({
	/** Enable or disable elevated mode (default: true). */
	enabled: boolean().optional(),
	/** Approved senders for /elevated (per-provider allowlists). */
	allowFrom: ElevatedAllowFromSchema
}).optional();
const MessageToolConfigSchema = strictObject({
	crossContext: strictObject({
		/** Allow sends to other channels within the same provider (default: true). */
		allowWithinProvider: boolean().optional(),
		/** Allow sends across different providers (default: true). */
		allowAcrossProviders: boolean().optional(),
		/** Cross-context marker configuration. */
		marker: strictObject({
			/** Enable origin markers for cross-context sends (default: true). */
			enabled: boolean().optional(),
			/** Text prefix template, supports {channel}. */
			prefix: string().optional(),
			/** Text suffix template, supports {channel}. */
			suffix: string().optional()
		}).optional()
	}).optional(),
	actions: strictObject({ 
	/** Message action names exposed and accepted by the message tool. */
allow: array(string()).optional() }).optional(),
	broadcast: strictObject({ 
	/** Enable broadcast action (default: true). */
enabled: boolean().optional() }).optional()
}).optional();
const GitHubToolIdentitySchema = strictObject({
	/** Opaque generated directory version for atomic credential rotation. */
	profileId: string().regex(MANAGED_GITHUB_PROFILE_ID_PATTERN),
	/** OAuth generations retain a separate rotating refresh credential. */
	kind: literal("oauth").optional(),
	/** Optional process-local author identity for commits made by local tools. */
	gitAuthor: strictObject({
		name: string().trim().min(1).optional(),
		email: string().trim().min(1).optional()
	}).optional()
}).optional();
const AgentToolsSchema = strictObject({
	...CommonToolPolicyFields,
	/** Per-agent code mode override; merges over the top-level tools.codeMode config. */
	codeMode: CodeModeSchema,
	/** Per-agent swarm override; merges over the top-level tools.swarm config. */
	swarm: SwarmSchema,
	/** Per-agent elevated exec gate (can only further restrict global tools.elevated). */
	elevated: ElevatedToolsSchema,
	/** Exec tool defaults for this agent. */
	exec: ToolExecSchema,
	/** Complete per-agent GitHub CLI identity and Git author override. */
	github: GitHubToolIdentitySchema.unwrap().extend({ 
	/** Explicitly expose this agent's managed identity inside its own sandbox (default: false). */
allowInSandbox: boolean().optional() }).optional(),
	/** Filesystem tool path guards. */
	fs: ToolFsSchema,
	/** Runtime loop detection for repetitive/ stuck tool-call patterns. */
	loopDetection: ToolLoopDetectionSchema,
	/** Message tool configuration for this agent. */
	message: MessageToolConfigSchema,
	sandbox: NestedToolPolicySchema
}).superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "agent tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
}).optional();
const AgentEntrySchema = AgentEntryBaseSchema.extend({
	memory: strictObject({ search: MemorySearchSchema }).optional(),
	humanDelay: HumanDelaySchema.optional(),
	typingMode: TypingModeSchema.optional(),
	tts: AgentTtsConfigSchema,
	skillsLimits: AgentSkillsLimitsSchema,
	contextLimits: AgentContextLimitsSchema,
	heartbeat: HeartbeatSchema,
	identity: IdentitySchema,
	groupChat: GroupChatSchema.unwrap().omit({ visibleReplies: true }).optional(),
	sandbox: AgentSandboxSchema,
	tools: AgentToolsSchema
}).strict();
const ToolsSchema = strictObject({
	...CommonToolPolicyFields,
	web: ToolsWebSchema,
	/** Managed local GitHub CLI identity and Git author; never overrides Git transport. */
	github: GitHubToolIdentitySchema,
	media: ToolsMediaSchema,
	links: ToolsLinksSchema,
	/**
	* Session tool visibility controls which sessions can be targeted by session tools
	* (sessions_list, sessions_history, sessions_search, sessions_send, session_status).
	*
	* Default: "all" (all sessions on the Gateway, with cross-agent access scoped by agentToAgent).
	*/
	sessions: strictObject({ 
	/**
	* - "self": only the current session
	* - "tree": current session + sessions spawned by this session
	* - "agent": any session belonging to the current agent id (can include other users)
	* - "all": any session (default; cross-agent access is governed by tools.agentToAgent)
	*/
visibility: _enum([
		"self",
		"tree",
		"agent",
		"all"
	]).optional() }).optional(),
	loopDetection: ToolLoopDetectionSchema,
	/** Compact large OpenClaw, MCP, and client tool catalogs behind search/call tools. */
	toolSearch: ToolSearchSchema,
	/** Global Code Mode defaults and limits; agent/model settings can override activation. */
	codeMode: CodeModeSchema,
	/** Collector-mode subagents and wait controls. */
	swarm: SwarmSchema,
	/** Message tool configuration. */
	message: MessageToolConfigSchema,
	agentToAgent: strictObject({
		/** Default: true. False blocks ordinary cross-agent session tool access; requester-owned native subagent and ACP child sessions remain reachable under tree/all visibility. */
		enabled: boolean().optional(),
		/**
		* Agent ids or `*` glob patterns; the requesting and target agent must both match.
		* Omitted or empty counts as unset: every agent pair is allowed by default; blank entries deny.
		*/
		allow: array(string()).optional()
	}).optional(),
	/** Elevated exec permissions for the host machine. */
	elevated: ElevatedToolsSchema,
	/** Exec tool defaults. */
	exec: ToolExecSchema,
	fs: ToolFsSchema,
	/** Sub-agent tool policy defaults (deny wins; progress_card is always denied). */
	subagents: NestedToolPolicySchema,
	/** Sandbox tool policy defaults (deny wins). */
	sandbox: NestedToolPolicySchema,
	/** sessions_spawn tool configuration. */
	sessions_spawn: strictObject({ attachments: strictObject({
		/** Enable inline attachments for sessions_spawn. */
		enabled: boolean().optional(),
		maxTotalBytes: number().optional(),
		maxFiles: number().optional(),
		maxFileBytes: number().optional(),
		retainOnSessionKeep: boolean().optional()
	}).optional() }).optional(),
	/** Unified progress_card status tool for parent sessions; enabled by default. False opts out. */
	updatePlan: boolean().optional()
}).superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
}).optional();
//#endregion
export { HeartbeatSchema as a, ElevatedAllowFromSchema as i, AgentEntrySchema as n, ToolPolicySchema as o, AgentSandboxSchema as r, ToolsSchema as s, AgentContextLimitsSchema as t };
