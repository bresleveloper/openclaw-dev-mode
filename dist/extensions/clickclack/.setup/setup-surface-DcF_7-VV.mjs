import { createAccountListHelpers, hasConfiguredAccountValue } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$2, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { resolveNormalizedAccountEntry } from "openclaw/plugin-sdk/account-resolution-runtime";
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
import { buildSecretInputSchema, normalizeSecretInputString, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { canResolveEnvSecretRefInReadOnlyPath } from "openclaw/plugin-sdk/secret-ref-readonly";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getChatChannelMeta } from "openclaw/plugin-sdk/channel-plugin-common";
import { ChannelBotLoopProtectionSchema, buildChannelAllowBotsSchema, buildChannelConfigSchema, buildMultiAccountChannelSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, applyAccountNameToChannelSection, baseUrlTextInput, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, formatDocsLink, hasConfiguredSecretInput, moveSingleAccountChannelSectionToDefaultAccount, patchScopedAccountConfig, prepareScopedSetupConfig, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { createSetupInputPresenceValidator } from "openclaw/plugin-sdk/setup-runtime";
import net from "node:net";
//#region extensions/clickclack/src/accounts.ts
const DEFAULT_RECONNECT_MS = 1500;
const MIN_RECONNECT_MS = 100;
const MAX_RECONNECT_MS = 6e4;
const DEFAULT_DISCUSSIONS_SECTION = "Sessions";
const { listAccountIds: listClickClackAccountIds, resolveDefaultAccountId: resolveDefaultClickClackAccountId, resolveAccountConfig: resolveMergedClickClackAccountConfig } = createAccountListHelpers("clickclack", {
	normalizeAccountId,
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["botLoopProtection", "discussions"],
	hasImplicitDefaultAccount: (cfg) => {
		const channel = cfg.channels?.clickclack;
		return Boolean(channel?.baseUrl?.trim() && (hasConfiguredAccountValue(channel.token) || Boolean(channel.tokenFile?.trim()) || Boolean(process.env.CLICKCLACK_BOT_TOKEN?.trim())) && channel.workspace?.trim());
	}
});
function mergeClickClackGroups(...sources) {
	const merged = /* @__PURE__ */ new Map();
	for (const source of sources) for (const [rawKey, value] of Object.entries(source ?? {})) {
		const key = rawKey.trim();
		if (!key) continue;
		const mergedBotLoopProtection = mergePairLoopGuardConfig(merged.get(key)?.botLoopProtection, value.botLoopProtection);
		merged.set(key, {
			...merged.get(key),
			...value.requireMention !== void 0 ? { requireMention: value.requireMention } : {},
			...value.requireMentionInBotThreads !== void 0 ? { requireMentionInBotThreads: value.requireMentionInBotThreads } : {},
			...value.mentionPatterns !== void 0 ? { mentionPatterns: value.mentionPatterns } : {},
			...value.allowBots !== void 0 ? { allowBots: value.allowBots } : {},
			...mergedBotLoopProtection ? { botLoopProtection: mergedBotLoopProtection } : {}
		});
	}
	return Object.fromEntries(merged);
}
function resolveClickClackAccountConfig(cfg, accountId) {
	const channel = cfg.channels?.clickclack;
	const merged = resolveMergedClickClackAccountConfig(cfg, accountId);
	const account = resolveNormalizedAccountEntry(channel?.accounts, accountId, normalizeAccountId);
	const mergedWithGroups = channel?.groups || account?.groups ? {
		...merged,
		groups: mergeClickClackGroups(channel?.groups, account?.groups)
	} : merged;
	const accountTokenFile = account?.tokenFile?.trim();
	if (accountTokenFile) return {
		...mergedWithGroups,
		token: account?.token,
		tokenFile: accountTokenFile
	};
	if (hasConfiguredAccountValue(account?.token)) return {
		...mergedWithGroups,
		token: account?.token,
		tokenFile: void 0
	};
	return mergedWithGroups;
}
function resolveClickClackAccountEndpoints(config) {
	const baseUrl = config.baseUrl?.trim().replace(/\/$/, "") ?? "";
	return {
		baseUrl,
		apiEndpoint: config.apiBaseUrl?.trim().replace(/\/$/, "") || baseUrl
	};
}
/** Pins inbound authority to the configured identity that started the transport. */
function isClickClackAccountCurrent(params) {
	const { cfg, account } = params;
	if (!cfg.channels?.clickclack || cfg.channels.clickclack.enabled === false || !listClickClackAccountIds(cfg).includes(account.accountId)) return false;
	const current = resolveClickClackAccountConfig(cfg, account.accountId);
	const endpoints = resolveClickClackAccountEndpoints(current);
	return current.enabled !== false && Boolean(endpoints.baseUrl && current.workspace?.trim()) && endpoints.baseUrl === account.baseUrl && endpoints.apiEndpoint === account.apiEndpoint && current.workspace?.trim() === account.config.workspace?.trim() && normalizeOptionalString(current.botUserId) === normalizeOptionalString(account.config.botUserId);
}
function resolveClickClackToken(params) {
	const tokenFile = params.tokenFile?.trim();
	if (tokenFile) {
		const accountTokenFile = resolveNormalizedAccountEntry(params.cfg.channels?.clickclack?.accounts, params.accountId, normalizeAccountId)?.tokenFile?.trim();
		const result = tryReadSecretFileSync(tokenFile, "ClickClack bot token", { rejectSymlink: true }, { configPath: accountTokenFile ? `channels.clickclack.accounts.${params.accountId}.tokenFile` : "channels.clickclack.tokenFile" });
		return result.status === "available" ? {
			token: result.value,
			tokenSource: "tokenFile",
			tokenStatus: "available"
		} : {
			token: "",
			tokenSource: "tokenFile",
			tokenStatus: "configured_unavailable",
			credentialDiagnostics: [result.diagnostic]
		};
	}
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.accountId === DEFAULT_ACCOUNT_ID$2 ? "channels.clickclack.token" : `channels.clickclack.accounts.${params.accountId}.token`,
		defaults: params.cfg.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status !== "available") {
		if (resolved.status === "missing" && params.accountId === DEFAULT_ACCOUNT_ID$2) {
			const token = normalizeSecretInputString((params.env ?? process.env).CLICKCLACK_BOT_TOKEN);
			return token ? {
				token,
				tokenSource: "env",
				tokenStatus: "available"
			} : {
				token: "",
				tokenSource: "none",
				tokenStatus: "missing"
			};
		}
		if (resolved.status === "configured_unavailable" && resolved.ref.source === "env") {
			if (!canResolveEnvSecretRefInReadOnlyPath({
				cfg: params.cfg,
				...resolved.ref
			})) {
				const providerConfig = params.cfg.secrets?.providers?.[resolved.ref.provider];
				if (!providerConfig) throw new Error(`Secret provider "${resolved.ref.provider}" is not configured (ref: env:${resolved.ref.provider}:${resolved.ref.id}).`);
				if (providerConfig.source !== "env") throw new Error(`Secret provider "${resolved.ref.provider}" has source "${providerConfig.source}" but ref requests "env".`);
				throw new Error(`Environment variable "${resolved.ref.id}" is not allowlisted in secrets.providers.${resolved.ref.provider}.allowlist.`);
			}
			const token = normalizeSecretInputString((params.env ?? process.env)[resolved.ref.id]);
			return {
				token: token ?? "",
				tokenSource: "config",
				tokenStatus: token ? "available" : "configured_unavailable"
			};
		}
		return {
			token: "",
			tokenSource: resolved.status === "missing" ? "none" : "config",
			tokenStatus: resolved.status
		};
	}
	return {
		token: resolved.value,
		tokenSource: "config",
		tokenStatus: "available"
	};
}
function resolveClickClackAccount(params) {
	const accountId = normalizeAccountId(params.accountId);
	const merged = resolveClickClackAccountConfig(params.cfg, accountId);
	const enabled = params.cfg.channels?.clickclack?.enabled !== false && merged.enabled !== false;
	const { baseUrl, apiEndpoint } = resolveClickClackAccountEndpoints(merged);
	const token = resolveClickClackToken({
		cfg: params.cfg,
		value: merged.token,
		tokenFile: merged.tokenFile,
		accountId,
		env: params.env
	});
	const workspace = merged.workspace?.trim() ?? "";
	const discussionsWorkspace = merged.discussions?.workspace?.trim() || workspace;
	const controlUrlBase = merged.discussions?.controlUrlBase?.trim();
	return {
		accountId,
		enabled,
		configured: Boolean(baseUrl && token.tokenStatus !== "missing" && workspace),
		name: normalizeOptionalString(merged.name),
		baseUrl,
		...token,
		workspace,
		botUserId: normalizeOptionalString(merged.botUserId),
		agentId: normalizeOptionalString(merged.agentId),
		replyMode: merged.replyMode === "model" ? "model" : "agent",
		model: normalizeOptionalString(merged.model),
		systemPrompt: normalizeOptionalString(merged.systemPrompt),
		toolsAllow: merged.toolsAllow,
		defaultTo: merged.defaultTo?.trim() || "channel:general",
		allowFrom: merged.allowFrom ?? ["*"],
		reconnectMs: resolveIntegerOption(merged.reconnectMs, DEFAULT_RECONNECT_MS, {
			min: MIN_RECONNECT_MS,
			max: MAX_RECONNECT_MS
		}),
		agentActivity: merged.agentActivity === true,
		nativeProgress: merged.nativeProgress === true,
		commandMenu: merged.commandMenu !== false,
		discussions: {
			enabled: merged.discussions?.enabled === true,
			workspace: discussionsWorkspace,
			...controlUrlBase ? { controlUrlBase } : {},
			section: merged.discussions?.section?.trim() || DEFAULT_DISCUSSIONS_SECTION
		},
		requireMention: merged.requireMention === true,
		requireMentionInBotThreads: merged.requireMentionInBotThreads,
		mentionPatterns: merged.mentionPatterns ?? [],
		allowBots: merged.allowBots ?? false,
		botLoopProtection: merged.botLoopProtection,
		groups: mergeClickClackGroups(merged.groups),
		config: {
			...merged,
			allowFrom: merged.allowFrom ?? ["*"]
		},
		apiEndpoint
	};
}
function listEnabledClickClackAccounts(cfg) {
	return listClickClackAccountIds(cfg).map((accountId) => resolveClickClackAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
//#region extensions/clickclack/src/channel-config.ts
const CLICKCLACK_CHANNEL_ID = "clickclack";
const clickClackMeta = { ...getChatChannelMeta(CLICKCLACK_CHANNEL_ID) };
const clickClackConfigAdapter = {
	listAccountIds: (cfg) => listClickClackAccountIds(cfg),
	resolveAccount: (cfg, accountId) => resolveClickClackAccount({
		cfg,
		accountId
	}),
	defaultAccountId: (cfg) => resolveDefaultClickClackAccountId(cfg),
	isConfigured: (account) => account.configured,
	resolveAllowFrom: ({ cfg, accountId }) => resolveClickClackAccount({
		cfg,
		accountId
	}).allowFrom,
	resolveDefaultTo: ({ cfg, accountId }) => resolveClickClackAccount({
		cfg,
		accountId
	}).defaultTo
};
//#endregion
//#region extensions/clickclack/src/config-schema.ts
/**
* Zod-backed config schema for ClickClack channel accounts.
*/
const ClickClackAccountConfigSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	mediaMaxMb: z.number().positive().optional(),
	responsePrefix: z.string().optional(),
	baseUrl: z.string().url().optional(),
	apiBaseUrl: z.string().url().optional(),
	token: buildSecretInputSchema().optional(),
	tokenFile: z.string().optional(),
	workspace: z.string().optional(),
	botUserId: z.string().optional(),
	agentId: z.string().optional(),
	replyMode: z.enum(["agent", "model"]).optional(),
	model: z.string().optional(),
	systemPrompt: z.string().optional(),
	toolsAllow: z.array(z.string()).optional(),
	defaultTo: z.string().optional(),
	allowFrom: z.array(z.string()).optional(),
	allowBots: buildChannelAllowBotsSchema({ allowMentions: true }),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	reconnectMs: z.number().int().min(100).max(6e4).optional(),
	agentActivity: z.boolean().optional(),
	nativeProgress: z.boolean().optional(),
	commandMenu: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	requireMentionInBotThreads: z.boolean().optional(),
	mentionPatterns: z.array(z.string()).optional(),
	groups: z.record(z.string(), z.object({
		requireMention: z.boolean().optional(),
		requireMentionInBotThreads: z.boolean().optional(),
		mentionPatterns: z.array(z.string()).optional(),
		allowBots: buildChannelAllowBotsSchema({ allowMentions: true }),
		botLoopProtection: ChannelBotLoopProtectionSchema.optional()
	}).strict()).optional(),
	discussions: z.object({
		enabled: z.boolean().optional(),
		workspace: z.string().optional(),
		controlUrlBase: z.string().url().optional(),
		section: z.string().optional()
	}).strict().optional()
}).strict();
const ClickClackConfigSchema = buildMultiAccountChannelSchema(ClickClackAccountConfigSchema.extend({ historyLimit: z.number().int().min(0).optional() }), { accountSchema: ClickClackAccountConfigSchema.partial() });
/**
* Config schema exported to core so `openclaw doctor` and config validation
* understand both default and named ClickClack accounts.
*/
const clickClackConfigSchema = buildChannelConfigSchema(ClickClackConfigSchema, { uiHints: {
	requireMentionInBotThreads: {
		label: "Require Mention in Bot Threads",
		help: "Override mention requirements in threads rooted in this bot's messages. Unset keeps the normal mention policy."
	},
	"groups.*.requireMentionInBotThreads": {
		label: "Require Mention in Bot Threads",
		help: "Override the account policy for threads rooted in this bot's messages in this channel."
	},
	"accounts.*.requireMentionInBotThreads": {
		label: "Require Mention in Bot Threads",
		help: "Override mention requirements in threads rooted in this bot's messages. Unset inherits the channel configuration."
	},
	"accounts.*.groups.*.requireMentionInBotThreads": {
		label: "Require Mention in Bot Threads",
		help: "Override the account policy for threads rooted in this bot's messages in this channel."
	}
} });
//#endregion
//#region extensions/clickclack/src/setup-contract.ts
const CLICKCLACK_SETUP_CODE_CLAIM_PATH = "/api/bot-setup-codes/claim";
const LOOPBACK_ADDRESSES = new net.BlockList();
LOOPBACK_ADDRESSES.addSubnet("127.0.0.0", 8, "ipv4");
LOOPBACK_ADDRESSES.addAddress("::1", "ipv6");
const BASE_PATH_SEGMENT = /^[A-Za-z0-9._~-]+$/u;
function isClickClackSetupLoopbackHost(hostname) {
	const normalized = hostname.toLowerCase().replace(/^\[|\]$/gu, "");
	if (normalized === "localhost") return true;
	const family = net.isIP(normalized);
	return family !== 0 && LOOPBACK_ADDRESSES.check(normalized, family === 4 ? "ipv4" : "ipv6");
}
function requireClickClackSetupApiBaseUrl(value, label) {
	if (!value || value !== value.trim()) throw new Error(`ClickClack ${label} is invalid`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`ClickClack ${label} is invalid`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:" || !parsed.hostname || parsed.hostname.endsWith(".") || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error(`ClickClack ${label} is invalid`);
	if (parsed.protocol === "http:" && !isClickClackSetupLoopbackHost(parsed.hostname)) throw new Error(`ClickClack ${label} must use HTTPS unless it is on loopback`);
	const pathname = parsed.pathname;
	let basePath = "";
	if (pathname !== "/") {
		if (pathname.endsWith("/") || pathname.includes("//") || pathname.includes("\\") || pathname.slice(1).split("/").some((segment) => !BASE_PATH_SEGMENT.test(segment))) throw new Error(`ClickClack ${label} is invalid`);
		basePath = pathname;
	}
	const canonical = parsed.origin + basePath;
	if (value !== canonical) throw new Error(`ClickClack ${label} is not canonical`);
	return canonical;
}
function requireClickClackSetupClaimUrl(value) {
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error("ClickClack setup URL has an invalid claim endpoint.");
	}
	if (parsed.username || parsed.password || parsed.search || parsed.hash || !parsed.pathname.endsWith("/api/bot-setup-codes/claim")) throw new Error("ClickClack setup URL has an invalid claim endpoint.");
	const basePath = parsed.pathname.slice(0, -26);
	const apiBaseUrl = requireClickClackSetupApiBaseUrl(parsed.origin + basePath, "setup URL API base");
	const claimUrl = apiBaseUrl + CLICKCLACK_SETUP_CODE_CLAIM_PATH;
	if (value !== claimUrl) throw new Error("ClickClack setup URL has a non-canonical claim endpoint.");
	return {
		claimUrl,
		apiBaseUrl
	};
}
function buildClickClackSetupClaimUrl(baseUrl) {
	return baseUrl.replace(/\/+$/u, "") + CLICKCLACK_SETUP_CODE_CLAIM_PATH;
}
//#endregion
//#region extensions/clickclack/src/setup-core.ts
const channel$1 = "clickclack";
const SETUP_CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const SETUP_CODE_LENGTH = 12;
const REQUIRED_INPUT_ERROR = "ClickClack requires --token, --base-url, and --workspace (or --use-env).";
const INVALID_BASE_URL_ERROR = "ClickClack base URL must be a valid http(s) URL.";
const SETUP_CODE_CONFLICT_ERROR = "ClickClack --code cannot be combined with --token, --token-file, or --use-env.";
function normalizeClickClackBaseUrl(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return parsed.toString().replace(/\/+$/, "");
	} catch {
		return;
	}
}
function normalizeClickClackSetupCode(value) {
	const normalized = value.trim().toUpperCase().replaceAll("-", "").replaceAll(" ", "");
	if (normalized.length !== SETUP_CODE_LENGTH || Array.from(normalized).some((character) => !SETUP_CODE_ALPHABET.includes(character))) return;
	return normalized;
}
function requireClickClackSetupCodeBaseUrl(value) {
	const baseUrl = normalizeClickClackBaseUrl(value);
	if (!baseUrl) throw new Error("ClickClack setup codes require a valid HTTP(S) base URL.");
	return baseUrl;
}
function parseClickClackSetupCodeInput(params) {
	const rawCode = params.code.trim();
	if (!rawCode) throw new Error("ClickClack --code must not be empty.");
	let code = rawCode;
	let baseUrl;
	let exactClaimUrl;
	if (/^[a-z][a-z\d+.-]*:\/\//iu.test(rawCode)) {
		let setupUrl;
		try {
			setupUrl = new URL(rawCode);
		} catch {
			throw new Error("ClickClack --code must be a valid HTTP(S) setup URL or a bare setup code.");
		}
		if (setupUrl.protocol !== "http:" && setupUrl.protocol !== "https:") throw new Error("ClickClack setup codes require an HTTP(S) URL.");
		if (setupUrl.username || setupUrl.password) throw new Error("ClickClack setup URLs must not include credentials.");
		if (setupUrl.search) throw new Error("ClickClack setup URLs must not include a query.");
		code = setupUrl.hash.slice(1);
		if (!code) throw new Error("ClickClack setup URL is missing its #CODE fragment.");
		setupUrl.hash = "";
		if (setupUrl.pathname.endsWith("/api/bot-setup-codes/claim")) {
			const exactEndpoint = requireClickClackSetupClaimUrl(setupUrl.toString());
			baseUrl = exactEndpoint.apiBaseUrl;
			exactClaimUrl = exactEndpoint.claimUrl;
		} else baseUrl = requireClickClackSetupCodeBaseUrl(setupUrl.toString());
		if (params.baseUrl) {
			if (requireClickClackSetupCodeBaseUrl(params.baseUrl) !== baseUrl) throw new Error("ClickClack --base-url does not match the server in the setup-code URL.");
		}
	} else {
		code = code.startsWith("#") ? code.slice(1) : code;
		if (!params.baseUrl) throw new Error("A bare ClickClack setup code requires --base-url.");
		baseUrl = requireClickClackSetupCodeBaseUrl(params.baseUrl);
	}
	const normalizedCode = normalizeClickClackSetupCode(code);
	if (!normalizedCode) throw new Error("ClickClack setup code must contain 12 valid base32 characters.");
	return {
		code: normalizedCode,
		baseUrl,
		...exactClaimUrl ? { exactClaimUrl } : {}
	};
}
function formatClickClackSetupCodeClaimError(error) {
	if (typeof error === "object" && error !== null && "status" in error) {
		const status = error.status;
		if (status === 404) return /* @__PURE__ */ new Error("ClickClack setup code is invalid, expired, or already used. Generate a new code and try again.");
		if (status === 429) return /* @__PURE__ */ new Error("Too many ClickClack setup code attempts. Wait and try again.");
	}
	return /* @__PURE__ */ new Error(`Could not claim ClickClack setup code: ${formatErrorMessage(error)}`);
}
function applyClickClackSetupConfigPatch(params) {
	const accountId = normalizeAccountId(params.accountId);
	const scopedConfig = accountId === DEFAULT_ACCOUNT_ID ? params.cfg : moveSingleAccountChannelSectionToDefaultAccount({
		cfg: params.cfg,
		channelKey: channel$1,
		setupSurface: clickClackSetupAdapter
	});
	return patchScopedAccountConfig({
		cfg: prepareScopedSetupConfig({
			cfg: scopedConfig,
			channelKey: channel$1,
			accountId,
			name: params.name,
			migrateBaseName: accountId !== DEFAULT_ACCOUNT_ID
		}),
		channelKey: channel$1,
		accountId,
		patch: params.patch,
		...params.clearFields ? { clearFields: params.clearFields } : {}
	});
}
function applyClickClackCredentialConfig(params) {
	const fieldsToClear = params.useEnv ? ["token", "tokenFile"] : params.tokenFile ? ["token"] : params.token !== void 0 ? ["tokenFile"] : [];
	return applyClickClackSetupConfigPatch({
		cfg: params.cfg,
		accountId: params.accountId,
		clearFields: fieldsToClear,
		patch: params.useEnv ? {} : params.tokenFile ? { tokenFile: params.tokenFile } : params.token !== void 0 ? { token: params.token } : {}
	});
}
const clickClackSetupAdapter = {
	resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
	prepareAccountConfigInput: async ({ cfg, accountId, input: setupInput }) => {
		if (!setupInput.code?.trim()) return setupInput;
		if (setupInput.token?.trim() || setupInput.tokenFile?.trim() || setupInput.useEnv) throw new Error(SETUP_CODE_CONFLICT_ERROR);
		const setup = parseClickClackSetupCodeInput({
			code: setupInput.code,
			baseUrl: setupInput.baseUrl
		});
		const privateApiBaseUrl = normalizeClickClackBaseUrl(resolveClickClackAccountConfig(cfg, accountId).apiBaseUrl);
		const claimUrl = setup.exactClaimUrl && !privateApiBaseUrl ? setup.exactClaimUrl : buildClickClackSetupClaimUrl(privateApiBaseUrl ?? setup.baseUrl);
		let claim;
		try {
			const { claimClickClackSetupCode } = await import("./setup-claim-Cfv5ikVH.mjs");
			claim = await claimClickClackSetupCode({
				claimUrl,
				code: setup.code,
				...setup.exactClaimUrl ? { expectedClaimUrl: setup.exactClaimUrl } : {}
			});
		} catch (error) {
			throw formatClickClackSetupCodeClaimError(error);
		}
		const { code: _code, tokenFile: _tokenFile, useEnv: _useEnv, ...remainingInput } = setupInput;
		return {
			...remainingInput,
			baseUrl: claim.api_base_url ?? setup.baseUrl,
			token: claim.token,
			workspace: claim.workspace.id,
			...claim.defaults.defaultTo !== void 0 ? { defaultTo: claim.defaults.defaultTo } : {},
			...claim.defaults.allowFrom !== void 0 ? { allowFrom: [...claim.defaults.allowFrom] } : {},
			...claim.defaults.agentActivity !== void 0 ? { agentActivity: claim.defaults.agentActivity } : {}
		};
	},
	applyAccountName: ({ cfg, accountId, name }) => applyAccountNameToChannelSection({
		cfg,
		channelKey: channel$1,
		accountId,
		name
	}),
	validateInput: createSetupInputPresenceValidator({
		defaultAccountOnlyEnvError: "CLICKCLACK_BOT_TOKEN can only be used for the default account.",
		whenNotUseEnv: [
			{
				someOf: ["token", "tokenFile"],
				message: REQUIRED_INPUT_ERROR
			},
			{
				someOf: ["baseUrl"],
				message: REQUIRED_INPUT_ERROR
			},
			{
				someOf: ["workspace"],
				message: REQUIRED_INPUT_ERROR
			}
		],
		validate: ({ cfg, accountId, input: setupInput }) => {
			const baseUrl = normalizeClickClackBaseUrl(setupInput.baseUrl);
			if (setupInput.baseUrl && !baseUrl) return INVALID_BASE_URL_ERROR;
			if (!setupInput.useEnv) return null;
			const existing = resolveClickClackAccountConfig(cfg, accountId);
			const existingBaseUrl = normalizeClickClackBaseUrl(existing.baseUrl);
			if (!baseUrl && existing.baseUrl?.trim() && !existingBaseUrl) return INVALID_BASE_URL_ERROR;
			if (!baseUrl && !existingBaseUrl) return REQUIRED_INPUT_ERROR;
			if (!setupInput.workspace?.trim() && !existing.workspace?.trim()) return REQUIRED_INPUT_ERROR;
			return null;
		}
	}),
	applyAccountConfig: ({ cfg, accountId, input: setupInput }) => {
		const existing = setupInput.useEnv ? resolveClickClackAccountConfig(cfg, accountId) : void 0;
		const baseUrl = normalizeClickClackBaseUrl(setupInput.baseUrl ?? existing?.baseUrl);
		const workspace = setupInput.workspace?.trim() || existing?.workspace?.trim();
		const tokenFile = setupInput.tokenFile?.trim();
		const token = setupInput.token?.trim();
		return applyClickClackCredentialConfig({
			cfg: applyClickClackSetupConfigPatch({
				cfg,
				accountId,
				name: setupInput.name,
				patch: {
					...baseUrl ? { baseUrl } : {},
					...workspace ? { workspace } : {},
					...setupInput.defaultTo?.trim() ? { defaultTo: setupInput.defaultTo.trim() } : {},
					...setupInput.allowFrom ? { allowFrom: [...setupInput.allowFrom] } : {},
					...setupInput.agentActivity !== void 0 ? { agentActivity: setupInput.agentActivity } : {}
				}
			}),
			accountId,
			token,
			tokenFile,
			useEnv: setupInput.useEnv
		});
	},
	afterAccountConfigWritten: async ({ cfg, accountId, runtime }) => {
		const { verifyClickClackAccountAfterSetup } = await import("./setup-verify-POQZk8SG.mjs");
		await verifyClickClackAccountAfterSetup({
			cfg,
			accountId,
			runtime
		});
	}
};
const clickClackSetupContract = defineChannelSetupContract({
	fields: {
		code: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--code <code>",
				description: "ClickClack one-time setup code or setup URL"
			}
		},
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "ClickClack bot token"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "ClickClack bot token file"
			}
		},
		baseUrl: {
			kind: "string",
			cli: {
				flags: "--base-url <url>",
				description: "ClickClack API base URL"
			}
		},
		workspace: {
			kind: "string",
			cli: {
				flags: "--workspace <workspace>",
				description: "ClickClack workspace id, slug, or name"
			}
		},
		defaultTo: {
			kind: "string",
			cli: {
				flags: "--default-to <target>",
				description: "Default ClickClack target"
			}
		},
		allowFrom: {
			kind: "string-list",
			cli: {
				flags: "--allow-from <ids>",
				description: "Allowed ClickClack senders"
			}
		},
		agentActivity: {
			kind: "boolean",
			cli: {
				flags: "--agent-activity",
				description: "Enable ClickClack agent activity"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use CLICKCLACK_BOT_TOKEN"
			},
			envVars: ["CLICKCLACK_BOT_TOKEN"]
		}
	},
	legacyAdapter: clickClackSetupAdapter
});
//#endregion
//#region extensions/clickclack/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "clickclack";
function hasConfiguredClickClackCredential(account) {
	return hasConfiguredSecretInput(account.config.token) || Boolean(account.config.tokenFile?.trim());
}
function isClickClackSetupConfigured(account) {
	return Boolean(account.baseUrl && account.workspace && (account.token || hasConfiguredClickClackCredential(account)));
}
const clickClackSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "ClickClack",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
		configuredHint: t("wizard.channels.statusSelfHostedChat"),
		unconfiguredHint: t("wizard.channels.statusNeedsSetup"),
		configuredScore: 2,
		unconfiguredScore: 1,
		resolveConfigured: ({ cfg, accountId }) => (accountId ? [accountId] : listClickClackAccountIds(cfg)).some((resolvedAccountId) => isClickClackSetupConfigured(resolveClickClackAccount({
			cfg,
			accountId: resolvedAccountId
		})))
	}),
	introNote: {
		title: t("wizard.clickclack.botTokenTitle"),
		lines: [t("wizard.clickclack.helpCreateToken"), t("wizard.channels.docs", { link: formatDocsLink("/channels/clickclack", "clickclack") })],
		shouldShow: ({ cfg, accountId }) => !isClickClackSetupConfigured(resolveClickClackAccount({
			cfg,
			accountId
		}))
	},
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "token",
		configuredFields: ["token", "tokenFile"],
		providerHint: channel,
		credentialLabel: t("wizard.clickclack.botToken"),
		preferredEnvVar: "CLICKCLACK_BOT_TOKEN",
		envPrompt: t("wizard.clickclack.envPrompt"),
		keepPrompt: t("wizard.clickclack.botTokenKeep"),
		inputPrompt: t("wizard.clickclack.botTokenInput"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1,
		resolveAccount: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}),
		hasConfiguredValue: hasConfiguredClickClackCredential,
		resolvedValue: (account) => account.token || void 0,
		envValue: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1 ? process.env.CLICKCLACK_BOT_TOKEN?.trim() || void 0 : void 0,
		patchAccount: ({ cfg, accountId, mode, patch }) => mode === "env" ? applyClickClackCredentialConfig({
			cfg,
			accountId,
			useEnv: true
		}) : applyClickClackCredentialConfig({
			cfg,
			accountId,
			...patch
		}),
		useEnv: { clearFields: ["token", "tokenFile"] },
		set: { clearFields: ["tokenFile"] }
	})],
	textInputs: [baseUrlTextInput({
		inputKey: "baseUrl",
		configKey: "baseUrl",
		message: t("wizard.clickclack.baseUrlPrompt"),
		resolveAccount: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}),
		currentValue: (account) => account.baseUrl || void 0,
		includeInitialValue: true,
		validate: (value) => normalizeClickClackBaseUrl(value) ? void 0 : "ClickClack server URL must be a valid http(s) URL.",
		normalize: (value) => normalizeClickClackBaseUrl(value) ?? value.trim(),
		patchAccount: ({ cfg, accountId, patch }) => applyClickClackSetupConfigPatch({
			cfg,
			accountId,
			patch
		})
	}), {
		inputKey: "workspace",
		message: t("wizard.clickclack.workspacePrompt"),
		helpTitle: t("wizard.clickclack.workspacePrompt"),
		helpLines: [t("wizard.clickclack.workspaceHelp")],
		currentValue: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}).workspace || void 0,
		initialValue: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}).workspace || void 0,
		validate: ({ value }) => value.trim() ? void 0 : "Required",
		normalizeValue: ({ value }) => value.trim(),
		applySet: async ({ cfg, accountId, value }) => applyClickClackSetupConfigPatch({
			cfg,
			accountId,
			patch: { workspace: value }
		})
	}],
	finalize: async ({ cfg, accountId, credentialValues, prompter }) => {
		const { checkClickClackSetupConnection } = await import("./setup-verify-POQZk8SG.mjs");
		const result = await checkClickClackSetupConnection({
			cfg,
			accountId,
			token: credentialValues.token
		});
		if (result.status === "connected") {
			await prompter.note(t("wizard.clickclack.connected", {
				handle: result.handle,
				workspace: result.workspaceName
			}), t("wizard.clickclack.connectionTitle"));
			return;
		}
		if (result.status === "skipped-env-token" || result.status === "skipped-unconfigured") return;
		const message = result.status === "invalid-token" ? t("wizard.clickclack.invalidToken") : result.status === "workspace-not-found" ? t("wizard.clickclack.workspaceNotFound", { workspace: result.workspace }) : t("wizard.clickclack.connectionFailed", { error: result.error });
		await prompter.note(message, t("wizard.clickclack.validationWarningTitle"));
	},
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { resolveDefaultClickClackAccountId as _, isClickClackSetupLoopbackHost as a, CLICKCLACK_CHANNEL_ID as c, DEFAULT_ACCOUNT_ID$2 as d, isClickClackAccountCurrent as f, resolveClickClackAccountConfig as g, resolveClickClackAccount as h, buildClickClackSetupClaimUrl as i, clickClackConfigAdapter as l, listEnabledClickClackAccounts as m, clickClackSetupContract as n, requireClickClackSetupApiBaseUrl as o, listClickClackAccountIds as p, CLICKCLACK_SETUP_CODE_CLAIM_PATH as r, clickClackConfigSchema as s, clickClackSetupWizard as t, clickClackMeta as u };
