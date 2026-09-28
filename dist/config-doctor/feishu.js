import { a as asNullableRecord, c as isRecord, i as normalizeOptionalString, r as normalizeOptionalLowercaseString, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import { C as uniqueStrings, b as isBlockedObjectKey, l as normalizeChannelConfigEntries, m as pruneMapToMaxSize, n as defineKeyMoveMigration, p as normalizeAccountId, r as defineStrayPluginEntryConfigMigration, s as defineChannelAliasMigration, x as hasLegacyAccountStreamingAliases } from "./runtime-doctor-migrations-8XPPImoy.js";
import { a as SECRET_PROVIDER_ALIAS_PATTERN, c as isValidFileSecretRefId, i as ENV_SECRET_REF_ID_RE, o as formatExecSecretRefIdValidationMessage, s as isValidExecSecretRefId, t as hasConfiguredSecretInput } from "./types.secrets-CBNculTH.js";
import { _ as union, b as registry, c as literal, d as object, f as preprocess, g as tuple, h as string, i as boolean, m as strictObject, n as _null, o as discriminatedUnion, p as record, r as array, t as _enum, u as number, v as unknown, y as toJSONSchema } from "./schemas-BDyHDkT2.js";
import "./ansi-BV4Ablpw.js";
import milliseconds from "ms";
import path from "node:path";
import net from "node:net";
import { domainToASCII } from "node:url";
import "typebox/guard";
import "typebox/schema";
import "typebox/format";
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/compat.js
/** @deprecated Use the raw string literal codes instead, e.g. "invalid_type". */
const ZodIssueCode = {
	invalid_type: "invalid_type",
	too_big: "too_big",
	too_small: "too_small",
	invalid_format: "invalid_format",
	not_multiple_of: "not_multiple_of",
	unrecognized_keys: "unrecognized_keys",
	invalid_union: "invalid_union",
	invalid_key: "invalid_key",
	invalid_element: "invalid_element",
	invalid_value: "invalid_value",
	custom: "custom"
};
/** @deprecated Do not use. Stub definition, only included for zod-to-json-schema compatibility. */
var ZodFirstPartyTypeKind;
ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {});
//#endregion
//#region src/agents/sandbox/network-mode.ts
/**
* Docker network mode safety helpers.
*
* Flags host networking and container namespace joins because they bypass normal sandbox network isolation.
*/
/** Normalizes optional Docker network mode strings for policy checks. */
function normalizeNetworkMode(network) {
	return normalizeOptionalLowercaseString(network) || void 0;
}
/** Returns the concrete block reason for dangerous network modes, if blocked. */
function getBlockedNetworkModeReason(params) {
	const normalized = normalizeNetworkMode(params.network);
	if (!normalized) return null;
	if (normalized === "host") return "host";
	if (normalized.startsWith("container:") && params.allowContainerNamespaceJoin !== true) return "container_namespace_join";
	return null;
}
//#endregion
//#region src/cli/parse-duration.ts
function invalidDuration(raw, reason) {
	const value = raw.trim() ? `"${raw}"` : "empty value";
	const prefix = reason ? `Invalid duration (${reason}): ${value}.` : `Invalid duration: ${value}.`;
	return /* @__PURE__ */ new Error(`${prefix} Use values like 500ms, 30s, 5m, 2h, or 1h30m.`);
}
function parseDurationToken(raw, value, unit) {
	const parsed = milliseconds(`${value}${unit}`);
	if (!Number.isFinite(parsed) || parsed < 0) throw invalidDuration(raw);
	return parsed;
}
function roundSafeDurationMs(raw, value) {
	const ms = Math.round(value);
	if (!Number.isSafeInteger(ms)) throw invalidDuration(raw);
	return ms;
}
/** Parse a non-negative duration into milliseconds, supporting single and composite units. */
function parseDurationMs(raw, opts) {
	const trimmed = normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw) ?? "");
	if (!trimmed) throw invalidDuration(raw, "empty");
	const single = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)?$/.exec(trimmed);
	if (single) return roundSafeDurationMs(raw, parseDurationToken(raw, single[1] ?? "", single[2] ?? opts?.defaultUnit ?? "ms"));
	let totalMs = 0;
	let consumed = 0;
	for (const match of trimmed.matchAll(/(\d+(?:\.\d+)?)(ms|s|m|h|d)/g)) {
		const [full, valueRaw, unitRaw] = match;
		const index = match.index ?? -1;
		if (!full || !valueRaw || !unitRaw || index < 0) throw invalidDuration(raw);
		if (index !== consumed) throw invalidDuration(raw, "each composite segment needs a unit");
		totalMs += parseDurationToken(raw, valueRaw, unitRaw);
		consumed += full.length;
	}
	if (consumed !== trimmed.length || consumed === 0) throw invalidDuration(raw);
	return roundSafeDurationMs(raw, totalMs);
}
//#endregion
//#region src/infra/exec-approvals-core.ts
function resolveExecModeFromPolicy(params) {
	if (params.security === "deny") return "deny";
	if (params.security === "allowlist" && params.ask === "off") return "allowlist";
	if (params.security === "full" && params.ask !== "always") return "full";
	return "ask";
}
function resolveExactExecModeFromPolicy(params) {
	if (params.ask === "always" || params.security === "full" && params.ask === "on-miss") return null;
	return resolveExecModeFromPolicy(params);
}
//#endregion
//#region src/config/github-identity-profile-id.ts
const MANAGED_GITHUB_PROFILE_ID_PATTERN = /^ghp_[a-f0-9]{32}$/u;
//#endregion
//#region src/config/web-search-legacy-provider-keys.ts
/** Legacy config keys that used to live under web search provider config. */
const LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS = /* @__PURE__ */ new Set([
	"brave",
	"duckduckgo",
	"exa",
	"firecrawl",
	"gemini",
	"grok",
	"kimi",
	"minimax",
	"ollama",
	"perplexity",
	"searxng",
	"tavily"
]);
//#endregion
//#region packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
//#endregion
//#region packages/model-catalog-core/src/model-catalog-refs.ts
/** Parse a strict provider/model reference without normalizing either segment. */
function parseProviderModelRef(value) {
	const trimmed = value.trim();
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) return null;
	const provider = trimmed.slice(0, slashIndex).trim();
	const model = trimmed.slice(slashIndex + 1).trim();
	return provider && model ? {
		provider,
		model
	} : null;
}
//#endregion
//#region src/config/zod-schema.agent-model.ts
/** Decision providers require an explicit model; an empty value disables the role. */
const DecisionModelSchema = string().trim().max(512).refine((value) => value === "" || parseProviderModelRef(value) !== null, "Expected provider/model, or an empty string to disable decision models.");
/** Schema for agent model config accepting a string or fallback object. */
const AgentModelSchema = union([string(), object({
	/** Primary model (provider/model). */
	primary: string().optional(),
	/** Per-agent model fallbacks (provider/model). */
	fallbacks: array(string()).optional()
}).strict()]);
union([string(), object({
	primary: string().optional(),
	/** Per-tool model fallbacks (provider/model). */
	fallbacks: array(string()).optional(),
	/** Optional provider request timeout in milliseconds for capabilities that support it. */
	timeoutMs: number().int().positive().optional()
}).strict()]);
//#endregion
//#region src/config/zod-schema.agent-entry-base.ts
const AgentRuntimePolicySchema = object({ id: string().optional() }).strict().optional();
const AgentModelRuntimeEntrySchema = object({
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
}).strict();
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
const AgentModelPolicySchema = object({ 
/** Model refs allowed for session/run overrides. Empty or omitted allows any model. */
allow: array(string()).optional() }).strict();
const AgentRuntimeAcpSchema = object({
	/** ACP harness adapter id (for example codex, claude). */
	agent: string().optional(),
	/** Optional ACP backend override for this agent runtime. */
	backend: string().optional(),
	/** Optional ACP session mode override. */
	mode: _enum(["persistent", "oneshot"]).optional(),
	/** Optional runtime working directory override. */
	cwd: string().optional()
}).strict().optional();
const AgentRuntimeSchema = union([object({ type: literal("embedded") }).strict(), object({
	type: literal("acp"),
	acp: AgentRuntimeAcpSchema
}).strict()]).optional();
const AgentEntryEmbeddedAgentConfigSchema = object({ executionContract: union([literal("default"), literal("strict-agentic")]).optional() }).strict().optional();
const AgentEntryBaseSchema = object({
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
	thinkingDefault: _enum([
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
	fastModeDefault: union([boolean(), literal("auto")]).optional(),
	contextInjection: union([
		literal("always"),
		literal("continuation-skip"),
		literal("never")
	]).optional(),
	bootstrapMaxChars: number().int().positive().optional(),
	bootstrapTotalMaxChars: number().int().positive().optional(),
	experimental: object({ localModelLean: boolean().optional() }).strict().optional(),
	skills: array(string()).optional(),
	subagents: object({
		delegationMode: _enum(["suggest", "prefer"]).optional(),
		allowAgents: array(string()).optional(),
		model: AgentModelSchema.optional(),
		thinking: string().optional(),
		requireAgentId: boolean().optional()
	}).strict().optional(),
	embeddedAgent: AgentEntryEmbeddedAgentConfigSchema,
	params: record(string(), unknown()).optional(),
	runtime: AgentRuntimeSchema
}).strict();
//#endregion
//#region src/infra/exec-safety.ts
const SHELL_METACHARS = /[;&|`$<>]/;
const CONTROL_CHARS = /[\r\n]/;
const QUOTE_CHARS = /["']/;
const BARE_NAME_PATTERN = /^[A-Za-z0-9._+-]+$/;
function isLikelyPath(value) {
	if (value.startsWith(".") || value.startsWith("~")) return true;
	if (value.includes("/") || value.includes("\\")) return true;
	return /^[A-Za-z]:[\\/]/.test(value);
}
/** Validates that a configured executable value cannot smuggle shell syntax. */
function isSafeExecutableValue(value) {
	if (!value) return false;
	const trimmed = value.trim();
	if (!trimmed) return false;
	if (trimmed.includes("\0")) return false;
	if (CONTROL_CHARS.test(trimmed)) return false;
	if (SHELL_METACHARS.test(trimmed)) return false;
	if (QUOTE_CHARS.test(trimmed)) return false;
	if (isLikelyPath(trimmed)) return true;
	if (trimmed.startsWith("-")) return false;
	return BARE_NAME_PATTERN.test(trimmed);
}
//#endregion
//#region src/secrets/exact-hostname.ts
/**
* Canonical exact-host contract shared by per-secret destination bindings and the
* egress-proxy config allowlists: lowercase ASCII/punycode, unbracketed IP literals,
* no wildcard, scheme, path, or port. Throws with an operator-actionable message so
* config validation and the secret store surface the same policy.
*/
function normalizeExactAllowedHost(raw) {
	const trimmed = raw.trim().toLowerCase().replace(/\.+$/u, "");
	if (trimmed.includes("*")) throw new Error(`Allowed host "${raw}" cannot contain a wildcard; use one exact hostname.`);
	const unbracketed = trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed;
	if (net.isIP(unbracketed)) return unbracketed;
	if (!unbracketed || unbracketed.includes(":") || /[\s/?#@]/u.test(unbracketed)) throw new Error(`Allowed host "${raw}" must be a hostname without a scheme, path, wildcard, or port.`);
	const ascii = domainToASCII(unbracketed);
	if (!ascii || ascii.length > 253 || ascii.split(".").some((label) => !label || label.length > 63 || label.startsWith("-") || label.endsWith("-") || !/^[a-z0-9-]+$/u.test(label))) throw new Error(`Allowed host "${raw}" is not a valid hostname.`);
	return ascii;
}
//#endregion
//#region packages/llm-core/src/model-data.ts
const MODEL_DATA_APIS = [
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"anthropic-messages",
	"google-generative-ai",
	"google-vertex",
	"github-copilot",
	"bedrock-converse-stream",
	"ollama",
	"pi-messages",
	"azure-openai-responses"
];
const MODEL_DATA_THINKING_FORMATS = [
	"openai",
	"openrouter",
	"deepseek",
	"together",
	"qwen",
	"qwen-chat-template",
	"zai"
];
//#endregion
//#region src/config/model-config-vocabulary.ts
/** Provider API adapter ids accepted by model/provider config and schema generation. */
const MODEL_APIS = [...MODEL_DATA_APIS];
/** Thinking/reasoning payload dialects emitted by OpenAI-compatible providers. */
const MODEL_THINKING_FORMATS = [...MODEL_DATA_THINKING_FORMATS];
//#endregion
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
const DmConfigSchema$1 = object({ historyLimit: number().int().min(0).optional() }).strict();
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
object({
	native: NativeCommandsSettingSchema.optional(),
	nativeSkills: NativeCommandsSettingSchema.optional()
}).strict().optional();
const ResponseUsageModeSchema = _enum([
	"on",
	"off",
	"tokens",
	"full"
]);
object({
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
object({ strategy: BroadcastStrategySchema.optional() }).catchall(union([array(string()), BroadcastGroupSchema])).superRefine((broadcast, ctx) => {
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
//#region src/config/zod-schema.sensitive.ts
const sensitive = registry();
registry();
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
object({
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
object({
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
const BlockStreamingCoalesceSchema$1 = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	idleMs: number().int().nonnegative().optional()
}).strict();
const TextChunkModeSchema = _enum(["length", "newline"]);
const ChannelStreamingBlockSchema = object({
	enabled: boolean().optional(),
	coalesce: BlockStreamingCoalesceSchema$1.optional()
}).strict();
/** Delivery-only nested streaming config for channels without preview modes. */
const ChannelDeliveryStreamingConfigSchema = object({
	chunkMode: TextChunkModeSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
}).strict();
number().int().min(0).optional(), number().int().min(0).optional(), ContextVisibilityModeSchema.optional(), record(string(), DmConfigSchema$1.optional()).optional(), number().int().positive().optional(), ChannelDeliveryStreamingConfigSchema.optional(), string().optional(), number().positive().optional();
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
const MarkdownConfigSchema$1 = object({ tables: MarkdownTableModeSchema.optional() }).strict().optional();
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
_enum(["thread", "top-level"]);
string().regex(/^#?[0-9a-fA-F]{6}$/, "expected hex color (RRGGBB)");
string().refine(isSafeExecutableValue, "expected safe executable name or path");
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
//#region src/config/zod-schema.memory-search.ts
const MemorySearchSchema = object({
	enabled: boolean().optional(),
	rememberAcrossConversations: boolean().optional(),
	sources: array(union([literal("memory"), literal("sessions")])).optional(),
	extraPaths: array(union([string(), object({
		path: string(),
		pattern: string().optional()
	}).strict()])).optional(),
	multimodal: object({
		enabled: boolean().optional(),
		modalities: array(union([
			literal("image"),
			literal("audio"),
			literal("all")
		])).optional(),
		maxFileBytes: number().int().positive().optional()
	}).strict().optional(),
	experimental: object({ sessionMemory: boolean().optional() }).strict().optional(),
	provider: string().optional(),
	remote: object({
		baseUrl: string().optional(),
		apiKey: SecretInputSchema.optional().register(sensitive),
		headers: record(string(), string()).optional(),
		batch: object({ enabled: boolean().optional() }).strict().optional()
	}).strict().optional(),
	fallback: string().optional(),
	model: string().optional(),
	inputType: string().min(1).optional(),
	queryInputType: string().min(1).optional(),
	documentInputType: string().min(1).optional(),
	outputDimensionality: number().int().positive().optional(),
	local: object({ modelPath: string().optional() }).strict().optional(),
	store: object({
		fts: object({ tokenizer: union([literal("unicode61"), literal("trigram")]).optional() }).strict().optional(),
		vector: object({
			enabled: boolean().optional(),
			extensionPath: string().optional()
		}).strict().optional()
	}).strict().optional(),
	query: object({
		maxResults: number().int().positive().optional(),
		minScore: number().min(0).max(1).optional()
	}).strict().optional(),
	cache: object({ enabled: boolean().optional() }).strict().optional()
}).strict().optional();
//#endregion
//#region src/agents/sandbox/bind-spec.ts
/** Splits a bind spec while preserving Windows drive-letter prefixes in host paths. */
function splitSandboxBindSpec(spec, options) {
	const separator = getBindSeparatorIndex(spec);
	if (separator === -1) return null;
	const host = spec.slice(0, separator);
	const rest = spec.slice(separator + 1);
	const optionsStart = options?.allowWindowsContainerPath === true ? getBindSeparatorIndex(rest) : rest.indexOf(":");
	if (optionsStart === -1) return {
		host,
		container: rest,
		options: ""
	};
	return {
		host,
		container: rest.slice(0, optionsStart),
		options: rest.slice(optionsStart + 1)
	};
}
function getBindSeparatorIndex(spec) {
	const hasDriveLetterPrefix = /^[A-Za-z]:[\\/]/.test(spec);
	return spec.indexOf(":", hasDriveLetterPrefix ? 2 : 0);
}
//#endregion
//#region src/agents/sandbox/host-paths.ts
function stripWindowsNamespacePrefix(input) {
	if (input.startsWith("\\\\?\\")) {
		const withoutPrefix = input.slice(4);
		if (withoutPrefix.toUpperCase().startsWith("UNC\\")) return `\\\\${withoutPrefix.slice(4)}`;
		return withoutPrefix;
	}
	if (input.startsWith("//?/")) {
		const withoutPrefix = input.slice(4);
		if (withoutPrefix.toUpperCase().startsWith("UNC/")) return `//${withoutPrefix.slice(4)}`;
		return withoutPrefix;
	}
	return input;
}
function isWindowsDriveAbsolutePath(raw) {
	return /^[A-Za-z]:[\\/]/.test(stripWindowsNamespacePrefix(raw));
}
function isSandboxHostPathAbsolute(raw) {
	const input = stripWindowsNamespacePrefix(raw);
	return input.startsWith("/") || isWindowsDriveAbsolutePath(input);
}
//#endregion
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
const SandboxDockerSchema = object({
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
		object({
			soft: number().int().nonnegative().optional(),
			hard: number().int().nonnegative().optional()
		}).strict()
	])).optional(),
	seccompProfile: string().optional(),
	apparmorProfile: string().optional(),
	dns: array(string()).optional(),
	extraHosts: array(string()).optional(),
	binds: array(string()).optional(),
	dangerouslyAllowReservedContainerTargets: boolean().optional(),
	dangerouslyAllowExternalBindSources: boolean().optional(),
	dangerouslyAllowContainerNamespaceJoin: boolean().optional()
}).strict().superRefine((data, ctx) => {
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
const SandboxPruneSchema = object({
	idleHours: number().int().nonnegative().optional(),
	maxAgeDays: number().int().nonnegative().optional()
}).strict().optional();
//#endregion
//#region src/config/zod-schema.agent-runtime.ts
const AgentTtsConfigSchema = TtsConfigSchema.unwrap().extend({ prefsPath: string().optional() }).strict().optional();
const HeartbeatSchema = object({
	every: string().optional(),
	activeHours: object({
		start: string().optional(),
		end: string().optional(),
		timezone: string().optional()
	}).strict().optional(),
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
}).strict().superRefine((val, ctx) => {
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
	const validateTime = (raw, opts, path) => {
		if (!raw) return;
		if (!timePattern.test(raw)) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["activeHours", path],
				message: "invalid time (use \"HH:MM\" 24h format)"
			});
			return;
		}
		const [hourStr, minuteStr] = raw.split(":");
		const hour = Number(hourStr);
		const minute = Number(minuteStr);
		if (hour === 24 && minute !== 0) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["activeHours", path],
				message: "invalid time (24:00 is the only allowed 24:xx value)"
			});
			return;
		}
		if (hour === 24 && !opts.allow24) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["activeHours", path],
			message: "invalid time (start cannot be 24:00)"
		});
	};
	validateTime(active.start, { allow24: false }, "start");
	validateTime(active.end, { allow24: true }, "end");
}).optional();
const AgentContextLimitsSchema = object({
	/** Default max chars returned by memory_get before truncation metadata/notice (default: 12000). */
	memoryGetMaxChars: number().int().min(1).max(25e4).optional(),
	/** Max chars retained from post-compaction AGENTS.md context injection (default: 1800). */
	postCompactionMaxChars: number().int().min(1).max(5e4).optional()
}).strict().optional();
const AgentSkillsLimitsSchema = object({ maxSkillsPromptChars: number().int().min(0).optional() }).strict().optional();
const ToolPolicySchema$1 = object({
	/** Exact tool names allowed in this policy scope. */
	allow: array(string()).optional(),
	/** Additional allowlist entries merged into the inherited policy. */
	alsoAllow: array(string()).optional(),
	/** Exact tool names denied after allow expansion; deny wins. */
	deny: array(string()).optional()
}).strict().superRefine((value, ctx) => {
	if (value.allow && value.allow.length > 0 && value.alsoAllow && value.alsoAllow.length > 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "tools policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)"
	});
}).optional();
const ToolPolicyBySenderSchema = record(string(), ToolPolicySchema$1).optional();
const TrimmedOptionalConfigStringSchema = string().transform((value) => {
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}).optional();
const CodexAllowedDomainsSchema = array(string()).transform((values) => {
	const deduped = uniqueStrings(values.map((value) => value.trim()).filter((value) => value.length > 0));
	return deduped.length > 0 ? deduped : void 0;
}).optional();
const CodexUserLocationSchema = object({
	country: TrimmedOptionalConfigStringSchema,
	region: TrimmedOptionalConfigStringSchema,
	city: TrimmedOptionalConfigStringSchema,
	timezone: TrimmedOptionalConfigStringSchema
}).strict().transform((value) => {
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
	openaiCodex: object({
		enabled: boolean().optional(),
		mode: union([literal("cached"), literal("live")]).optional(),
		allowedDomains: CodexAllowedDomainsSchema,
		contextSize: union([
			literal("low"),
			literal("medium"),
			literal("high")
		]).optional(),
		userLocation: CodexUserLocationSchema
	}).strict().optional()
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
const ToolsWebFetchSchema = object({
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
}).strict().optional();
const ToolsWebSchema = object({
	search: ToolsWebSearchSchema,
	fetch: ToolsWebFetchSchema
}).strict().optional();
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
const ToolPolicyWithProfileSchema = object({
	allow: array(string()).optional(),
	alsoAllow: array(string()).optional(),
	deny: array(string()).optional(),
	profile: ToolProfileSchema
}).strict().superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "tools.byProvider policy cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
});
const ElevatedAllowFromSchema = record(string(), array(union([string(), number()]))).optional();
const ToolExecApplyPatchSchema = object({
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
}).strict().optional();
const ToolExecSafeBinProfileSchema = object({
	minPositional: number().int().nonnegative().optional(),
	maxPositional: number().int().nonnegative().optional(),
	allowedValueFlags: array(string()).optional(),
	deniedFlags: array(string()).optional()
}).strict();
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
	reviewer: object({
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
	}).strict().optional(),
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
const ToolExecSchema = object(ToolExecBaseShape).strict().superRefine(addExecPolicyModeConflictIssue).optional();
const ToolFsSchema = object({ 
/**
* Restrict filesystem tools (read/write/edit/apply_patch) to the agent workspace directory.
* Default: false (unrestricted, matches legacy behavior).
*/
workspaceOnly: boolean().optional() }).strict().optional();
const ToolLoopDetectionSchema = object({ 
/** Enable tool-loop protection (default: false). */
enabled: boolean().optional() }).strict().optional();
const ToolSearchSchema = union([boolean(), object({
	/** Enable compact search/call cataloging for large tool sets. */
	enabled: boolean().optional(),
	/** Exposed model surface. "code" exposes tool_search_code; "tools" exposes structured fallback tools; "directory" keeps a bounded directory plus selected schemas visible while deferring the rest behind search/describe/call. */
	mode: _enum([
		"code",
		"tools",
		"directory"
	]).optional(),
	/** Timeout in milliseconds for one tool_search_code execution. Runtime clamps to 1s..60s. */
	codeTimeoutMs: number().int().positive().optional(),
	/** Default search result count when the model omits a limit. Runtime clamps to maxSearchLimit. */
	searchDefaultLimit: number().int().positive().optional(),
	/** Maximum search result count. Runtime clamps to 1..50. */
	maxSearchLimit: number().int().positive().optional()
}).strict()]).optional();
const CodeModeSchema = union([
	boolean(),
	literal("auto"),
	object({
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
	}).strict()
]).optional();
const SwarmSchema = union([boolean(), object({
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
}).strict()]).optional();
const SandboxSshSchema = object({
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
}).strict().optional();
const AgentSandboxSchema = object({
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
}).strict().superRefine((data, ctx) => {
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
	allow: array(string()).optional(),
	/** Additional allowlist entries merged into allow and/or profile allowlist. */
	alsoAllow: array(string()).optional(),
	deny: array(string()).optional(),
	/** Optional tool policy overrides keyed by provider id or "provider/model". */
	byProvider: record(string(), ToolPolicyWithProfileSchema).optional(),
	/** Per-sender tool policy overrides keyed by sender identity. */
	toolsBySender: ToolPolicyBySenderSchema
};
const MessageToolConfigSchema = object({
	crossContext: object({
		/** Allow sends to other channels within the same provider (default: true). */
		allowWithinProvider: boolean().optional(),
		/** Allow sends across different providers (default: true). */
		allowAcrossProviders: boolean().optional(),
		/** Cross-context marker configuration. */
		marker: object({
			/** Enable origin markers for cross-context sends (default: true). */
			enabled: boolean().optional(),
			/** Text prefix template, supports {channel}. */
			prefix: string().optional(),
			/** Text suffix template, supports {channel}. */
			suffix: string().optional()
		}).strict().optional()
	}).strict().optional(),
	actions: object({ 
	/** Message action names exposed and accepted by the message tool. */
allow: array(string()).optional() }).strict().optional(),
	broadcast: object({ 
	/** Enable broadcast action (default: true). */
enabled: boolean().optional() }).strict().optional()
}).strict().optional();
const GitHubToolIdentitySchema = object({
	/** Opaque generated directory version for atomic credential rotation. */
	profileId: string().regex(MANAGED_GITHUB_PROFILE_ID_PATTERN),
	/** OAuth generations retain a separate rotating refresh credential. */
	kind: literal("oauth").optional(),
	/** Optional process-local author identity for commits made by local tools. */
	gitAuthor: object({
		name: string().trim().min(1).optional(),
		email: string().trim().min(1).optional()
	}).strict().optional()
}).strict().optional();
const AgentToolsSchema = object({
	...CommonToolPolicyFields,
	/** Per-agent code mode override; merges over the top-level tools.codeMode config. */
	codeMode: CodeModeSchema,
	/** Per-agent swarm override; merges over the top-level tools.swarm config. */
	swarm: SwarmSchema,
	/** Per-agent elevated exec gate (can only further restrict global tools.elevated). */
	elevated: object({
		/** Enable or disable elevated mode for this agent (default: true). */
		enabled: boolean().optional(),
		/** Approved senders for /elevated (per-provider allowlists). */
		allowFrom: ElevatedAllowFromSchema
	}).strict().optional(),
	/** Exec tool defaults for this agent. */
	exec: ToolExecSchema,
	/** Complete per-agent GitHub CLI identity and Git author override. */
	github: GitHubToolIdentitySchema,
	/** Filesystem tool path guards. */
	fs: ToolFsSchema,
	/** Runtime loop detection for repetitive/ stuck tool-call patterns. */
	loopDetection: ToolLoopDetectionSchema,
	/** Message tool configuration for this agent. */
	message: MessageToolConfigSchema,
	sandbox: object({ tools: ToolPolicySchema$1 }).strict().optional()
}).strict().superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "agent tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
}).optional();
AgentEntryBaseSchema.extend({
	memory: object({ search: MemorySearchSchema }).strict().optional(),
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
object({
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
	sessions: object({ 
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
	]).optional() }).strict().optional(),
	loopDetection: ToolLoopDetectionSchema,
	/** Compact large OpenClaw, MCP, and client tool catalogs behind search/call tools. */
	toolSearch: ToolSearchSchema,
	/** Global Code Mode defaults and limits; agent/model settings can override activation. */
	codeMode: CodeModeSchema,
	/** Collector-mode subagents and wait controls. */
	swarm: SwarmSchema,
	/** Message tool configuration. */
	message: MessageToolConfigSchema,
	agentToAgent: object({
		/** Default: true. False blocks ordinary cross-agent session tool access; requester-owned native subagent and ACP child sessions remain reachable under tree/all visibility. */
		enabled: boolean().optional(),
		/**
		* Agent ids or `*` glob patterns; the requesting and target agent must both match.
		* Omitted or empty counts as unset: every agent pair is allowed by default; blank entries deny.
		*/
		allow: array(string()).optional()
	}).strict().optional(),
	/** Elevated exec permissions for the host machine. */
	elevated: object({
		/** Enable or disable elevated mode (default: true). */
		enabled: boolean().optional(),
		allowFrom: ElevatedAllowFromSchema
	}).strict().optional(),
	/** Exec tool defaults. */
	exec: ToolExecSchema,
	fs: ToolFsSchema,
	/** Sub-agent tool policy defaults (deny wins; progress_card is always denied). */
	subagents: object({ tools: ToolPolicySchema$1 }).strict().optional(),
	/** Sandbox tool policy defaults (deny wins). */
	sandbox: object({ tools: ToolPolicySchema$1 }).strict().optional(),
	/** sessions_spawn tool configuration. */
	sessions_spawn: object({ attachments: object({
		/** Enable inline attachments for sessions_spawn. */
		enabled: boolean().optional(),
		maxTotalBytes: number().optional(),
		maxFiles: number().optional(),
		maxFileBytes: number().optional(),
		retainOnSessionKeep: boolean().optional()
	}).strict().optional() }).strict().optional(),
	/** Unified progress_card status tool for parent sessions; enabled by default. False opts out. */
	updatePlan: boolean().optional()
}).strict().superRefine((value, ctx) => {
	addAllowAlsoAllowConflictIssue(value, ctx, "tools cannot set both allow and alsoAllow in the same scope (merge alsoAllow into allow, or remove allow and use profile + alsoAllow)");
}).optional();
//#endregion
//#region src/plugins/plugin-lru-cache.ts
/** Small process-local LRU cache for runtime registries and compiled validators. */
var PluginLruCache = class {
	#maxEntries;
	#entries = /* @__PURE__ */ new Map();
	constructor(maxEntries) {
		this.#maxEntries = Number.isFinite(maxEntries) && maxEntries > 0 ? Math.max(1, Math.floor(maxEntries)) : 1;
	}
	get size() {
		return this.#entries.size;
	}
	clear() {
		this.#entries.clear();
	}
	deleteValue(value) {
		for (const [key, entry] of this.#entries) if (entry === value) this.#entries.delete(key);
	}
	/** Returns a cached value and refreshes its recency when present. */
	get(cacheKey) {
		if (!this.#entries.has(cacheKey)) return;
		const cached = this.#entries.get(cacheKey);
		this.#entries.delete(cacheKey);
		this.#entries.set(cacheKey, cached);
		return cached;
	}
	/** Stores a value as the newest entry and evicts oldest entries past capacity. */
	set(cacheKey, value) {
		this.#entries.delete(cacheKey);
		this.#entries.set(cacheKey, value);
		pruneMapToMaxSize(this.#entries, this.#maxEntries);
	}
};
new PluginLruCache(512);
//#endregion
//#region src/channels/plugins/config-schema.ts
/**
* Channel config schema helpers.
*
* Builds common zod/JSON schema shapes and parses runtime config issues for channel plugins.
*/
/** Shared allowlist entry shape for channel sender/user ids. */
const AllowFromEntrySchema = union([string(), number()]);
/** Optional allowlist array used by channel config schema builders. */
const AllowFromListSchema = array(AllowFromEntrySchema).optional();
/** Canonical per-group/room channel policy shape. */
const ChannelGroupEntrySchema = object({
	requireMention: boolean().optional(),
	tools: ToolPolicySchema$1,
	toolsBySender: record(string(), ToolPolicySchema$1).optional(),
	skills: array(string()).optional(),
	enabled: boolean().optional(),
	allowFrom: AllowFromListSchema,
	systemPrompt: string().optional()
}).strict();
/** Extend the canonical group/room policy shape with channel-owned fields. */
function buildGroupEntrySchema(extraShape, options) {
	const omitted = new Set(options?.omit ?? []);
	const baseShape = Object.fromEntries(Object.entries(ChannelGroupEntrySchema.shape).filter(([key]) => !omitted.has(key)));
	return object({
		...baseShape,
		...extraShape ?? {}
	}).strict();
}
/** Add the standard accounts/defaultAccount envelope and optional shared account/root refinement. */
function buildMultiAccountChannelSchema(baseSchema, options = {}) {
	const refine = options.refine;
	const rawAccountSchema = options.accountSchema ?? baseSchema;
	const accountSchema = refine ? rawAccountSchema.superRefine((value, ctx) => {
		return refine(value, ctx);
	}) : rawAccountSchema;
	const accountValueSchema = options.optionalAccount ? accountSchema.optional() : accountSchema;
	const accountsSchema = options.accountsMode === "catchall" ? object({}).catchall(accountValueSchema).optional() : record(string(), accountValueSchema).optional();
	const channelSchema = baseSchema.extend({
		accounts: accountsSchema,
		defaultAccount: string().optional()
	});
	return refine ? channelSchema.superRefine((value, ctx) => {
		return refine(value, ctx);
	}) : channelSchema;
}
function cloneRuntimeIssue(issue) {
	const record = issue && typeof issue === "object" ? issue : {};
	const path = Array.isArray(record.path) ? record.path.filter((segment) => {
		const kind = typeof segment;
		return kind === "string" || kind === "number";
	}) : void 0;
	return {
		...record,
		...path ? { path } : {}
	};
}
function safeParseRuntimeSchema(schema, value) {
	const result = schema.safeParse(value);
	if (result.success) return {
		success: true,
		data: result.data
	};
	return {
		success: false,
		issues: result.error.issues.map((issue) => cloneRuntimeIssue(issue))
	};
}
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
function buildChannelConfigSchema(schema, options) {
	if ("_zod" in schema) return {
		schema: toJSONSchema(schema, {
			target: "draft-07",
			...options?.jsonSchemaMode ? { io: options.jsonSchemaMode } : {},
			unrepresentable: "any"
		}),
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
	return {
		schema: {
			type: "object",
			additionalProperties: true
		},
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
}
union([boolean(), literal("auto")]);
const ExecApprovalForwardTargetSchema = object({
	channel: string().min(1),
	to: string().min(1),
	accountId: string().optional(),
	threadId: union([string(), number()]).optional()
}).strict();
const ExecApprovalForwardingSchema = object({
	enabled: boolean().optional(),
	mode: union([
		literal("session"),
		literal("targets"),
		literal("both")
	]).optional(),
	agentFilter: array(string()).optional(),
	sessionFilter: array(string()).optional(),
	targets: array(ExecApprovalForwardTargetSchema).optional()
}).strict().optional();
object({
	exec: ExecApprovalForwardingSchema,
	plugin: ExecApprovalForwardingSchema
}).strict().optional();
//#endregion
//#region src/config/zod-schema.channels.ts
/** Optional heartbeat visibility controls shared by channel schemas. */
const ChannelHeartbeatVisibilitySchema$1 = object({
	showOk: boolean().optional(),
	showAlerts: boolean().optional(),
	useIndicator: boolean().optional()
}).strict().optional();
const ChannelHealthMonitorSchema = object({ enabled: boolean().optional() }).strict().optional();
object({
	enabled: boolean().optional(),
	maxEventsPerWindow: number().int().positive().optional(),
	windowSeconds: number().int().positive().optional(),
	cooldownSeconds: number().int().positive().optional()
}).strict();
//#endregion
//#region src/config/zod-schema.channel-messaging-common.ts
const UnifiedStreamingModeSchema = _enum([
	"off",
	"partial",
	"block",
	"progress"
]);
const ChannelStreamingPreviewSchema = object({
	chunk: BlockStreamingChunkSchema.optional(),
	toolProgress: boolean().optional(),
	commandText: _enum(["raw", "status"]).optional()
}).strict();
const ChannelStreamingProgressSchema = object({
	label: union([string(), literal(false)]).optional(),
	labels: array(string()).optional(),
	maxLines: number().int().positive().optional(),
	maxLineChars: number().int().positive().optional(),
	toolProgress: boolean().optional(),
	commandText: _enum(["raw", "status"]).optional(),
	commentary: boolean().optional(),
	narration: boolean().optional()
}).strict();
object({
	mode: UnifiedStreamingModeSchema.optional(),
	chunkMode: TextChunkModeSchema.optional(),
	preview: ChannelStreamingPreviewSchema.optional(),
	progress: ChannelStreamingProgressSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
}).strict();
const CommonCapabilitiesSchema = array(string()).optional();
const CommonIdListSchema = array(union([string(), number()])).optional();
const CommonDefaultToSchema = string().optional();
const CommonMentionPatternsSchema = MentionPatternsPolicySchema.optional();
const CommonStreamingSchema = ChannelDeliveryStreamingConfigSchema.optional();
const CommonMediaMaxMbSchema = number().positive().optional();
const CommonReplyToModeSchema = ReplyToModeSchema.optional();
DmPolicySchema.optional().default("pairing"), GroupPolicySchema.optional().default("allowlist");
function createCommonChannelAccountShape(options) {
	return {
		name: string().optional(),
		capabilities: options.capabilities ?? CommonCapabilitiesSchema,
		markdown: MarkdownConfigSchema$1,
		configWrites: boolean().optional(),
		enabled: boolean().optional(),
		dmPolicy: DmPolicySchema.optional(),
		allowFrom: options.allowFrom ?? CommonIdListSchema,
		defaultTo: options.defaultTo ?? CommonDefaultToSchema,
		groupAllowFrom: options.groupAllowFrom ?? CommonIdListSchema,
		groupPolicy: GroupPolicySchema.optional(),
		mentionPatterns: options.mentionPatterns ?? CommonMentionPatternsSchema,
		contextVisibility: ContextVisibilityModeSchema.optional(),
		historyLimit: number().int().min(0).optional(),
		dmHistoryLimit: number().int().min(0).optional(),
		dms: record(string(), DmConfigSchema$1.optional()).optional(),
		textChunkLimit: number().int().positive().optional(),
		streaming: options.streaming ?? CommonStreamingSchema,
		heartbeatVisibility: ChannelHeartbeatVisibilitySchema$1,
		healthMonitor: ChannelHealthMonitorSchema,
		responsePrefix: string().optional(),
		mediaMaxMb: options.mediaMaxMb ?? CommonMediaMaxMbSchema,
		replyToMode: options.replyToMode ?? CommonReplyToModeSchema
	};
}
object(createCommonChannelAccountShape({})).strict();
boolean().optional();
boolean().optional();
object({
	replyToBot: boolean().optional(),
	quotedBot: boolean().optional(),
	threadParticipation: boolean().optional()
}).strict();
//#endregion
//#region extensions/feishu/src/external-keys.ts
const FEISHU_EXTERNAL_KEY_PATTERN = /^(?!\s)(?![\s\S]*\s$)(?![\s\S]*\.\.)[^\p{Cc}\p{Cs}/\\]{1,512}$/u;
//#endregion
//#region src/plugin-sdk/secret-input-schema.ts
/**
* Returns the shared secret-input schema for plaintext values and env/file/exec/store refs.
* Reusing this singleton preserves sensitive-path registration for config redaction.
*/
function buildSecretInputSchema() {
	return secretInputSchema;
}
const providerSchema = string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\").");
const secretInputSchema = union([string(), discriminatedUnion("source", [
	object({
		source: literal("env"),
		provider: providerSchema,
		id: string().regex(ENV_SECRET_REF_ID_RE, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
	}).strict(),
	object({
		source: literal("store"),
		provider: providerSchema,
		id: string().regex(ENV_SECRET_REF_ID_RE, "Store secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
	}).strict(),
	object({
		source: literal("file"),
		provider: providerSchema,
		id: string().refine(isValidFileSecretRefId, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
	}).strict(),
	object({
		source: literal("exec"),
		provider: providerSchema,
		id: string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())
	}).strict()
])]).register(sensitive);
//#endregion
//#region extensions/feishu/src/webhook-path.ts
const DEFAULT_FEISHU_WEBHOOK_PATH = "/feishu/events";
/** Normalize trusted configuration only; incoming request targets must remain unmodified. */
function normalizeFeishuWebhookPath(value) {
	const configured = value?.trim();
	if (!configured) return DEFAULT_FEISHU_WEBHOOK_PATH;
	try {
		const parsed = new URL(configured, "http://localhost");
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
		const emptyQuery = !parsed.search && parsed.href.endsWith("?") && !configured.includes("#") ? "?" : "";
		return `${parsed.pathname}${parsed.search}${emptyQuery}`;
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/feishu/src/config-schema.ts
const ChannelActionsSchema = object({
	reactions: boolean().optional(),
	sticker: boolean().optional()
}).strict().optional();
const MAX_STICKER_SETS = 32;
const MAX_STICKERS_PER_SET = 256;
function canonicalTextPattern(maxLength) {
	return new RegExp(`^(?!\\s)(?![\\s\\S]*\\s$)[^\\p{Cs}]{1,${maxLength}}$`, "u");
}
const FeishuStickerSetSchema = record(string().regex(FEISHU_EXTERNAL_KEY_PATTERN), array(string().regex(canonicalTextPattern(64))).min(1).max(8)).refine((set) => Object.keys(set).length <= MAX_STICKERS_PER_SET, { message: `At most ${MAX_STICKERS_PER_SET} stickers per bot set are allowed` }).meta({ maxProperties: MAX_STICKERS_PER_SET });
const FeishuStickerSetsSchema = record(string().regex(canonicalTextPattern(128)), FeishuStickerSetSchema).refine((sets) => Object.keys(sets).length <= MAX_STICKER_SETS, { message: `At most ${MAX_STICKER_SETS} bot sticker sets are allowed` }).meta({ maxProperties: MAX_STICKER_SETS });
const FeishuGroupPolicySchema = union([GroupPolicySchema, literal("allowall").transform(() => "open")]);
const FeishuDomainSchema = union([_enum(["feishu", "lark"]), string().regex(/^[Hh][Tt][Tt][Pp][Ss]:\/\//).url()]);
const FeishuConnectionModeSchema = _enum(["websocket", "webhook"]);
const FeishuWebhookPathSchema = string().refine((value) => normalizeFeishuWebhookPath(value) === value, { message: "webhookPath must be a canonical HTTP request path; run \"openclaw doctor --fix\" to repair it" });
const TtsOverrideSchema = object({
	auto: _enum([
		"off",
		"always",
		"inbound",
		"tagged"
	]).optional(),
	enabled: boolean().optional(),
	mode: _enum(["final", "all"]).optional(),
	provider: string().optional(),
	persona: string().optional(),
	personas: record(string(), record(string(), unknown())).optional(),
	summaryModel: string().optional(),
	modelOverrides: record(string(), unknown()).optional(),
	providers: record(string(), record(string(), unknown())).optional(),
	prefsPath: string().optional(),
	maxTextLength: number().int().min(1).optional(),
	timeoutMs: number().int().min(1e3).max(12e4).optional()
}).strict().optional();
const ToolPolicySchema = object({
	allow: array(string()).optional(),
	deny: array(string()).optional()
}).strict().optional();
const DmConfigSchema = object({
	enabled: boolean().optional(),
	systemPrompt: string().optional()
}).strict().optional();
const MarkdownConfigSchema = object({
	mode: _enum([
		"native",
		"escape",
		"strip"
	]).optional(),
	tableMode: _enum([
		"native",
		"ascii",
		"simple"
	]).optional()
}).strict().optional();
const RenderModeSchema = _enum([
	"auto",
	"raw",
	"card"
]).optional();
const BlockStreamingCoalesceSchema = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	idleMs: number().int().nonnegative().optional()
}).strict().optional();
const FeishuStreamingSchema = object({
	mode: _enum(["off", "partial"]).optional(),
	chunkMode: _enum(["length", "newline"]).optional(),
	block: object({
		enabled: boolean().optional(),
		coalesce: BlockStreamingCoalesceSchema
	}).strict().optional()
}).strict().optional();
const ChannelHeartbeatVisibilitySchema = object({
	visibility: _enum(["visible", "hidden"]).optional(),
	intervalMs: number().int().positive().optional()
}).strict().optional();
/**
* Dynamic agent creation configuration.
* When enabled, a new agent is created for each unique DM user.
*/
const DynamicAgentCreationSchema = object({
	enabled: boolean().optional(),
	workspaceTemplate: string().optional(),
	agentDirTemplate: string().optional(),
	maxAgents: number().int().positive().optional()
}).strict().optional();
/**
* Feishu tools configuration.
* Controls which tool categories are enabled.
*
* Dependencies:
* - wiki requires doc (wiki content is edited via doc tools)
* - perm can work independently but is typically used with drive
*/
const FeishuToolsConfigSchema = object({
	doc: boolean().optional(),
	chat: boolean().optional(),
	wiki: boolean().optional(),
	drive: boolean().optional(),
	perm: boolean().optional(),
	scopes: boolean().optional(),
	bitable: boolean().optional()
}).strict().optional();
/**
* Group session scope for routing Feishu group messages.
* - "group" (default): one session per group chat
* - "group_sender": one session per (group + sender)
* - "group_topic": one session per group topic thread (falls back to group if no topic)
* - "group_topic_sender": one session per (group + topic thread + sender),
*   falls back to (group + sender) if no topic
*/
const GroupSessionScopeSchema = _enum([
	"group",
	"group_sender",
	"group_topic",
	"group_topic_sender"
]).optional();
/**
* @deprecated Use groupSessionScope instead.
*
* Topic session isolation mode for group chats.
* - "disabled" (default): All messages in a group share one session
* - "enabled": Messages in different topics get separate sessions
*
* Topic routing uses Feishu topic-group `thread_id` when the event identifies a
* native topic group, and keeps `root_id` precedence for normal groups so
* reply-created threads stay on the initiating message session.
*/
const TopicSessionModeSchema = _enum(["disabled", "enabled"]).optional();
const ReactionNotificationModeSchema = _enum([
	"off",
	"own",
	"all"
]).optional();
/**
* Reply-in-thread mode for group chats.
* - "disabled" (default): Bot replies are normal inline replies
* - "enabled": Bot replies create or continue a Feishu topic thread
*
* When enabled, the Feishu reply API is called with `reply_in_thread: true`,
* causing the reply to appear as a topic (话题) under the original message.
*/
const ReplyInThreadSchema = _enum(["disabled", "enabled"]).optional();
const FeishuGroupSchema = buildGroupEntrySchema({
	tools: ToolPolicySchema,
	groupSessionScope: GroupSessionScopeSchema,
	topicSessionMode: TopicSessionModeSchema,
	replyInThread: ReplyInThreadSchema
}).omit({ toolsBySender: true });
const FeishuSharedConfigShape = {
	webhookHost: string().optional(),
	webhookPort: number().int().positive().optional(),
	capabilities: array(string()).optional(),
	markdown: MarkdownConfigSchema,
	configWrites: boolean().optional(),
	contextVisibility: ContextVisibilityModeSchema.optional(),
	replyToMode: ReplyToModeSchema.optional(),
	responsePrefix: string().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: array(union([string(), number()])).optional(),
	groupPolicy: FeishuGroupPolicySchema.optional(),
	groupAllowFrom: array(union([string(), number()])).optional(),
	groupSenderAllowFrom: array(union([string(), number()])).optional(),
	requireMention: boolean().optional(),
	groups: record(string(), FeishuGroupSchema.optional()).optional(),
	historyLimit: number().int().min(0).optional(),
	dmHistoryLimit: number().int().min(0).optional(),
	dms: record(string(), DmConfigSchema).optional(),
	textChunkLimit: number().int().positive().optional(),
	mediaMaxMb: number().positive().optional(),
	httpTimeoutMs: number().int().positive().max(3e5).optional(),
	heartbeatVisibility: ChannelHeartbeatVisibilitySchema,
	renderMode: RenderModeSchema,
	streaming: FeishuStreamingSchema,
	tools: FeishuToolsConfigSchema,
	actions: ChannelActionsSchema,
	replyInThread: ReplyInThreadSchema,
	reactionNotifications: ReactionNotificationModeSchema,
	typingIndicator: boolean().optional(),
	resolveSenderNames: boolean().optional(),
	allowBots: boolean().optional(),
	vcAutoJoin: boolean().optional(),
	tts: TtsOverrideSchema
};
/**
* Per-account configuration.
* All fields are optional - missing fields inherit from top-level config.
*/
const FeishuAccountConfigSchema = object({
	enabled: boolean().optional(),
	name: string().optional(),
	appId: string().optional(),
	appSecret: buildSecretInputSchema().optional(),
	encryptKey: buildSecretInputSchema().optional(),
	verificationToken: buildSecretInputSchema().optional(),
	domain: FeishuDomainSchema.optional(),
	connectionMode: FeishuConnectionModeSchema.optional(),
	webhookPath: FeishuWebhookPathSchema.optional(),
	...FeishuSharedConfigShape,
	groupSessionScope: GroupSessionScopeSchema,
	topicSessionMode: TopicSessionModeSchema
}).strict();
const FeishuConfigSchema = buildMultiAccountChannelSchema(object({
	enabled: boolean().optional(),
	defaultAccount: string().optional(),
	stickerSets: FeishuStickerSetsSchema.optional(),
	appId: string().optional(),
	appSecret: buildSecretInputSchema().optional(),
	encryptKey: buildSecretInputSchema().optional(),
	verificationToken: buildSecretInputSchema().optional(),
	domain: FeishuDomainSchema.optional().default("feishu"),
	connectionMode: FeishuConnectionModeSchema.optional().default("websocket"),
	webhookPath: FeishuWebhookPathSchema.optional().default(DEFAULT_FEISHU_WEBHOOK_PATH),
	...FeishuSharedConfigShape,
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	reactionNotifications: ReactionNotificationModeSchema.optional().default("own"),
	groupPolicy: FeishuGroupPolicySchema.optional().default("allowlist"),
	requireMention: boolean().optional(),
	groupSessionScope: GroupSessionScopeSchema,
	topicSessionMode: TopicSessionModeSchema,
	dynamicAgentCreation: DynamicAgentCreationSchema,
	typingIndicator: boolean().optional().default(true),
	resolveSenderNames: boolean().optional().default(true)
}).strict(), {
	accountSchema: FeishuAccountConfigSchema,
	optionalAccount: true
}).superRefine((value, ctx) => {
	const defaultAccount = value.defaultAccount?.trim();
	if (defaultAccount && value.accounts && Object.keys(value.accounts).length > 0) {
		const normalizedDefaultAccount = normalizeAccountId(defaultAccount);
		if (!Object.hasOwn(value.accounts, normalizedDefaultAccount)) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["defaultAccount"],
			message: `channels.feishu.defaultAccount="${defaultAccount}" does not match a configured account key`
		});
	}
	const defaultConnectionMode = value.connectionMode ?? "websocket";
	const defaultVerificationTokenConfigured = hasConfiguredSecretInput(value.verificationToken);
	const defaultEncryptKeyConfigured = hasConfiguredSecretInput(value.encryptKey);
	if (defaultConnectionMode === "webhook") {
		if (!defaultVerificationTokenConfigured) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["verificationToken"],
			message: "channels.feishu.connectionMode=\"webhook\" requires channels.feishu.verificationToken"
		});
		if (!defaultEncryptKeyConfigured) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["encryptKey"],
			message: "channels.feishu.connectionMode=\"webhook\" requires channels.feishu.encryptKey"
		});
	}
	for (const [accountId, account] of Object.entries(value.accounts ?? {})) {
		if (!account) continue;
		if ((account.connectionMode ?? defaultConnectionMode) !== "webhook") continue;
		const accountVerificationTokenConfigured = hasConfiguredSecretInput(account.verificationToken) || defaultVerificationTokenConfigured;
		const accountEncryptKeyConfigured = hasConfiguredSecretInput(account.encryptKey) || defaultEncryptKeyConfigured;
		if (!accountVerificationTokenConfigured) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				"accounts",
				accountId,
				"verificationToken"
			],
			message: `channels.feishu.accounts.${accountId}.connectionMode="webhook" requires a verificationToken (account-level or top-level)`
		});
		if (!accountEncryptKeyConfigured) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				"accounts",
				accountId,
				"encryptKey"
			],
			message: `channels.feishu.accounts.${accountId}.connectionMode="webhook" requires an encryptKey (account-level or top-level)`
		});
	}
	if (value.dmPolicy === "open") {
		if (!(value.allowFrom ?? []).some((entry) => String(entry).trim() === "*")) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["allowFrom"],
			message: "channels.feishu.dmPolicy=\"open\" requires channels.feishu.allowFrom to include \"*\""
		});
	}
});
buildChannelConfigSchema(FeishuConfigSchema, { jsonSchemaMode: "input" });
//#endregion
//#region extensions/feishu/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "feishu",
	streaming: { defaultMode: "partial" },
	accountStreamingReplacesRoot: true
});
const LEGACY_COALESCE_FIELDS = [
	"enabled",
	"minDelayMs",
	"maxDelayMs"
];
const LEGACY_HEARTBEAT_FIELDS = ["visibility", "intervalMs"];
const toolsBaseMigration = defineKeyMoveMigration({
	from: ["tools", "base"],
	to: ["tools", "bitable"],
	match: (value) => typeof value === "boolean",
	sourceOwn: false
});
function sanitizeLegacyHeartbeatFields(params) {
	const heartbeat = asNullableRecord(params.entry.heartbeat);
	if (!heartbeat || Object.keys(heartbeat).length > 0 && !LEGACY_HEARTBEAT_FIELDS.some((field) => Object.hasOwn(heartbeat, field))) return {
		entry: params.entry,
		changed: false
	};
	const next = { ...params.entry };
	delete next.heartbeat;
	params.changes.push(`Removed ${params.pathPrefix}.heartbeat (legacy Feishu fields were never read by runtime).`);
	return {
		entry: next,
		changed: true
	};
}
function sanitizeLegacyCoalesceFields(params) {
	const streaming = asNullableRecord(params.entry.streaming);
	const block = asNullableRecord(streaming?.block);
	const coalesce = asNullableRecord(block?.coalesce);
	if (!streaming || !block || !coalesce) return {
		entry: params.entry,
		changed: false
	};
	const removed = LEGACY_COALESCE_FIELDS.filter((field) => coalesce[field] !== void 0);
	if (removed.length === 0) return {
		entry: params.entry,
		changed: false
	};
	const nextCoalesce = { ...coalesce };
	for (const field of removed) delete nextCoalesce[field];
	params.changes.push(`Removed ${params.pathPrefix}.streaming.block.coalesce.{${removed.join(",")}} (legacy Feishu-only fields; block delivery reads minChars/maxChars/idleMs).`);
	return {
		entry: {
			...params.entry,
			streaming: {
				...streaming,
				block: {
					...block,
					coalesce: nextCoalesce
				}
			}
		},
		changed: true
	};
}
function hasLegacyWebhookPath(value) {
	const path = asNullableRecord(value)?.webhookPath;
	return typeof path === "string" && normalizeFeishuWebhookPath(path) !== path;
}
function normalizeLegacyWebhookPath(params) {
	const path = params.entry.webhookPath;
	if (typeof path !== "string") return {
		entry: params.entry,
		changed: false
	};
	const normalized = normalizeFeishuWebhookPath(path);
	const canonical = normalized ?? "/feishu/events";
	if (canonical === path) return {
		entry: params.entry,
		changed: false
	};
	params.changes.push(normalized === null ? `Reset invalid ${params.pathPrefix}.webhookPath to ${DEFAULT_FEISHU_WEBHOOK_PATH}.` : `Normalized ${params.pathPrefix}.webhookPath to its HTTP request path.`);
	return {
		entry: {
			...params.entry,
			webhookPath: canonical
		},
		changed: true
	};
}
function normalizeFeishuLegacyConfigEntries(cfg, changes) {
	return normalizeChannelConfigEntries({
		cfg,
		channelId: "feishu",
		changes,
		normalizeEntry: (params) => {
			const tools = toolsBaseMigration.normalize(params);
			const coalesce = sanitizeLegacyCoalesceFields({
				...params,
				entry: tools.entry
			});
			const heartbeat = sanitizeLegacyHeartbeatFields({
				...params,
				entry: coalesce.entry
			});
			const webhook = normalizeLegacyWebhookPath({
				...params,
				entry: heartbeat.entry
			});
			return {
				entry: webhook.entry,
				changed: tools.changed || coalesce.changed || heartbeat.changed || webhook.changed
			};
		}
	}).config;
}
const feishuStrayEntryConfigMigration = defineStrayPluginEntryConfigMigration({
	pluginId: "feishu",
	channelId: "feishu",
	validateMergedChannelConfig: (merged) => FeishuConfigSchema.safeParse(merged).success
});
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	feishuStrayEntryConfigMigration.legacyConfigRule,
	{
		path: ["channels", "feishu"],
		message: "channels.feishu[.accounts.<id>].webhookPath must be a canonical HTTP request path; run \"openclaw doctor --fix\".",
		match: (value) => {
			const entry = asNullableRecord(value);
			return hasLegacyWebhookPath(entry) || hasLegacyAccountStreamingAliases(entry?.accounts, hasLegacyWebhookPath);
		}
	},
	{
		path: ["channels", "feishu"],
		message: "channels.feishu[.accounts.<id>].tools.base is legacy; use tools.bitable. Run \"openclaw doctor --fix\".",
		match: (value) => {
			const entry = asNullableRecord(value);
			return toolsBaseMigration.hasLegacy(entry) || hasLegacyAccountStreamingAliases(entry?.accounts, toolsBaseMigration.hasLegacy);
		}
	}
];
function normalizeCompatibilityConfig({ cfg }) {
	const aliases = streamingAliasMigration.normalizeChannelConfig({ cfg });
	const entries = normalizeFeishuLegacyConfigEntries(aliases.config, aliases.changes);
	const stray = feishuStrayEntryConfigMigration.normalizeConfig({ cfg: entries });
	return {
		config: stray.config,
		changes: [...aliases.changes, ...stray.changes]
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
