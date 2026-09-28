import { parseStrictInteger } from "openclaw/plugin-sdk/number-runtime";
import { normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, hasConfiguredAccountValue } from "openclaw/plugin-sdk/account-resolution";
import { resolveDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, createAllowFromSection, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, formatDocsLink, mergeAllowFromEntries, normalizeAccountId, patchScopedAccountConfig, setSetupChannelEnabled, splitSetupEntries } from "openclaw/plugin-sdk/setup";
//#region extensions/synology-chat/src/accounts.ts
/**
* Account resolution: reads config from channels.synology-chat,
* merges per-account overrides, falls back to environment variables.
*/
/** Extract the channel config from the full OpenClaw config object. */
function getChannelConfig$1(cfg) {
	return cfg?.channels?.["synology-chat"];
}
const { listAccountIds, resolveAccountConfig: resolveMergedSynologyChatAccountConfig } = createAccountListHelpers("synology-chat", {
	fallbackAccountIdWhenEmpty: false,
	hasImplicitDefaultAccount: (cfg) => {
		const channel = getChannelConfig$1(cfg);
		return Boolean(channel && (hasConfiguredAccountValue(channel.token) || hasConfiguredAccountValue(process.env.SYNOLOGY_CHAT_TOKEN)));
	}
});
function getRawAccountConfig$1(channelCfg, accountId) {
	if (accountId === DEFAULT_ACCOUNT_ID) return channelCfg;
	return channelCfg.accounts?.[accountId] ?? {};
}
function hasExplicitWebhookPath(rawAccount) {
	return typeof rawAccount?.webhookPath === "string" && rawAccount.webhookPath.trim().length > 0;
}
function resolveWebhookPathSource(params) {
	if (hasExplicitWebhookPath(params.rawAccount)) return "explicit";
	if (params.accountId !== DEFAULT_ACCOUNT_ID && hasExplicitWebhookPath(params.channelCfg)) return "inherited-base";
	return "default";
}
/** Parse allowedUserIds from string or array to string[]. */
function parseAllowedUserIds(raw) {
	if (!raw) return [];
	if (Array.isArray(raw)) return raw.filter(Boolean);
	return normalizeStringEntries(raw.split(","));
}
function normalizeRateLimitPerMinuteValue(raw) {
	if (typeof raw === "number") return Number.isSafeInteger(raw) && raw >= 0 ? raw : void 0;
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	if (!/^\d+$/.test(trimmed)) return;
	const parsed = parseStrictInteger(trimmed);
	return parsed != null && parsed >= 0 ? parsed : void 0;
}
function parseRateLimitPerMinute(raw) {
	return normalizeRateLimitPerMinuteValue(raw) ?? 30;
}
/**
* Resolve a specific account by ID with full defaults applied.
* Falls back to env vars for the "default" account.
*/
function resolveAccount(cfg, accountId) {
	const channelCfg = getChannelConfig$1(cfg) ?? {};
	const id = accountId || DEFAULT_ACCOUNT_ID;
	const accountOverrides = id === DEFAULT_ACCOUNT_ID ? void 0 : channelCfg.accounts?.[id] ?? void 0;
	const rawAccount = getRawAccountConfig$1(channelCfg, id);
	const merged = resolveMergedSynologyChatAccountConfig(cfg, id);
	const envToken = normalizeOptionalString(process.env.SYNOLOGY_CHAT_TOKEN) ?? "";
	const envIncomingUrl = normalizeOptionalString(process.env.SYNOLOGY_CHAT_INCOMING_URL) ?? "";
	const envNasHost = normalizeOptionalString(process.env.SYNOLOGY_NAS_HOST) ?? "localhost";
	const envAllowedUserIds = normalizeOptionalString(process.env.SYNOLOGY_ALLOWED_USER_IDS) ?? "";
	const envRateLimitValue = parseRateLimitPerMinute(process.env.SYNOLOGY_RATE_LIMIT);
	const envBotName = normalizeOptionalString(process.env.OPENCLAW_BOT_NAME) ?? "OpenClaw";
	const webhookPathSource = resolveWebhookPathSource({
		accountId: id,
		channelCfg,
		rawAccount
	});
	const dangerouslyAllowInheritedWebhookPath = rawAccount.dangerouslyAllowInheritedWebhookPath ?? channelCfg.dangerouslyAllowInheritedWebhookPath ?? false;
	return {
		accountId: id,
		enabled: merged.enabled ?? true,
		token: merged.token ?? envToken,
		incomingUrl: merged.incomingUrl ?? envIncomingUrl,
		webhookUrl: normalizeOptionalString(id === DEFAULT_ACCOUNT_ID ? merged.webhookUrl : rawAccount.webhookUrl) ?? "",
		nasHost: merged.nasHost ?? envNasHost,
		webhookPath: merged.webhookPath ?? "/webhook/synology",
		webhookPathSource,
		dangerouslyAllowNameMatching: resolveDangerousNameMatchingEnabled({
			providerConfig: channelCfg,
			accountConfig: accountOverrides
		}),
		dangerouslyAllowInheritedWebhookPath,
		dmPolicy: merged.dmPolicy ?? "allowlist",
		allowedUserIds: parseAllowedUserIds(merged.allowedUserIds ?? envAllowedUserIds),
		rateLimitPerMinute: normalizeRateLimitPerMinuteValue(merged.rateLimitPerMinute) ?? envRateLimitValue,
		botName: merged.botName ?? envBotName,
		allowInsecureSsl: merged.allowInsecureSsl ?? false
	};
}
//#endregion
//#region extensions/synology-chat/src/hosted-media-route.ts
const SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX = "__openclaw_synology_media_token";
function normalizeExactPath(path) {
	const trimmed = path.trim();
	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/u, "") : "/";
}
function resolveSynologyPublicWebhookRouteKey(webhookUrlValue) {
	try {
		const webhookUrl = new URL(webhookUrlValue);
		if (webhookUrl.protocol !== "https:" || !webhookUrl.hostname || webhookUrl.username || webhookUrl.password || webhookUrl.hash) return;
		webhookUrl.searchParams.sort();
		return webhookUrl.toString();
	} catch {
		return;
	}
}
function toSynologyHostedMediaStoreRoutePath(path) {
	const normalized = normalizeExactPath(path);
	return normalized === "/" ? normalized : `${normalized}/`;
}
function resolveSynologyHostedMediaRoute(params) {
	if (!params.webhookUrl.trim()) throw new Error("Synology Chat attachments require webhookUrl. Set the account's exact externally reachable HTTPS callback URL.");
	if (!resolveSynologyPublicWebhookRouteKey(params.webhookUrl)) throw new Error("Synology Chat webhookUrl must be an absolute HTTPS URL with a hostname and no credentials or fragment.");
	const webhookUrl = new URL(params.webhookUrl);
	if ([...webhookUrl.searchParams.keys()].some((key) => key.startsWith(`__openclaw_synology_media_token_`))) throw new Error(`Synology Chat webhookUrl must not contain query parameters starting with ${SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX}_.`);
	return {
		localRoutePath: toSynologyHostedMediaStoreRoutePath(params.webhookPath),
		publicBaseUrl: webhookUrl.origin,
		publicRoutePath: webhookUrl.pathname,
		publicSearch: webhookUrl.search
	};
}
//#endregion
//#region extensions/synology-chat/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "synology-chat";
const DEFAULT_WEBHOOK_PATH = "/webhook/synology";
const SYNOLOGY_SETUP_HELP_LINES = [
	t("wizard.synologyChat.helpIncomingWebhook"),
	t("wizard.synologyChat.helpOutgoingWebhook"),
	t("wizard.synologyChat.helpPointWebhook", { path: DEFAULT_WEBHOOK_PATH }),
	t("wizard.synologyChat.helpAllowedUsers"),
	`Docs: ${formatDocsLink("/channels/synology-chat", "channels/synology-chat")}`
];
const SYNOLOGY_ALLOW_FROM_HELP_LINES = [
	t("wizard.synologyChat.allowlistIntro"),
	t("wizard.synologyChat.examples"),
	"- 123456",
	"- synology-chat:123456",
	t("wizard.synologyChat.multipleEntries"),
	`Docs: ${formatDocsLink("/channels/synology-chat", "channels/synology-chat")}`
];
function getChannelConfig(cfg) {
	return cfg.channels?.[channel] ?? {};
}
function getRawAccountConfig(cfg, accountId) {
	const channelConfig = getChannelConfig(cfg);
	if (accountId === DEFAULT_ACCOUNT_ID$1) return channelConfig;
	return channelConfig.accounts?.[accountId] ?? {};
}
function patchSynologyChatAccountConfig(params) {
	return patchScopedAccountConfig({
		cfg: params.cfg,
		channelKey: channel,
		accountId: params.accountId,
		patch: params.patch,
		accountPatch: {
			...params.enabled ? { enabled: true } : {},
			...params.patch
		},
		clearFields: params.clearFields,
		ensureChannelEnabled: Boolean(params.enabled),
		ensureAccountEnabled: false
	});
}
function isSynologyChatConfigured(cfg, accountId) {
	const account = resolveAccount(cfg, accountId);
	return Boolean(account.token.trim() && account.incomingUrl.trim());
}
function validateWebhookUrl(value) {
	try {
		const parsed = new URL(value);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "Incoming webhook must use http:// or https://.";
	} catch {
		return "Incoming webhook must be a valid URL.";
	}
}
function validatePublicWebhookUrl(value) {
	const trimmed = value.trim();
	if (!trimmed) return;
	try {
		resolveSynologyHostedMediaRoute({
			webhookUrl: trimmed,
			webhookPath: DEFAULT_WEBHOOK_PATH
		});
	} catch (error) {
		return error instanceof Error ? error.message : "Attachment webhook URL is invalid.";
	}
}
function validateWebhookPath(value) {
	const trimmed = value.trim();
	if (!trimmed) return;
	return trimmed.startsWith("/") ? void 0 : "Webhook path must start with /.";
}
function parseSynologyUserId(value) {
	const cleaned = value.replace(/^synology(?:[-_]?chat)?:/i, "").trim();
	return /^\d+$/.test(cleaned) ? cleaned : null;
}
function normalizeSynologyAllowedUserId(value) {
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return `${value}`.trim();
	return "";
}
function resolveExistingAllowedUserIds(cfg, accountId) {
	const raw = getRawAccountConfig(cfg, accountId).allowedUserIds;
	if (Array.isArray(raw)) return raw.map(normalizeSynologyAllowedUserId).filter(Boolean);
	return normalizeStringEntries(normalizeSynologyAllowedUserId(raw).split(","));
}
const synologyChatSetupAdapter = {
	resolveAccountId: ({ accountId }) => normalizeAccountId(accountId) ?? DEFAULT_ACCOUNT_ID$1,
	validateInput: ({ accountId, input }) => {
		const setupInput = input;
		if (setupInput.useEnv && accountId !== DEFAULT_ACCOUNT_ID$1) return "Synology Chat env credentials only support the default account.";
		if (!setupInput.useEnv && !setupInput.token?.trim()) return "Synology Chat requires --token or --use-env.";
		if (!setupInput.url?.trim()) return "Synology Chat requires --url for the incoming webhook.";
		const urlError = validateWebhookUrl(setupInput.url.trim());
		if (urlError) return urlError;
		if (setupInput.webhookUrl?.trim()) {
			const webhookUrlError = validatePublicWebhookUrl(setupInput.webhookUrl);
			if (webhookUrlError) return webhookUrlError;
		}
		if (setupInput.webhookPath?.trim()) return validateWebhookPath(setupInput.webhookPath.trim()) ?? null;
		return null;
	},
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const setupInput = input;
		return patchSynologyChatAccountConfig({
			cfg,
			accountId,
			enabled: true,
			clearFields: setupInput.useEnv ? ["token"] : void 0,
			patch: {
				...setupInput.useEnv ? {} : { token: setupInput.token?.trim() },
				incomingUrl: setupInput.url?.trim(),
				...setupInput.webhookUrl?.trim() ? { webhookUrl: setupInput.webhookUrl.trim() } : {},
				...setupInput.webhookPath?.trim() ? { webhookPath: setupInput.webhookPath.trim() } : {}
			}
		});
	}
};
const synologyChatSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Synology Chat token"
			}
		},
		url: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--url <url>",
				description: "Synology Chat webhook URL"
			}
		},
		webhookUrl: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--webhook-url <url>",
				description: "Public HTTPS Synology Chat callback URL used for attachments"
			}
		},
		webhookPath: {
			kind: "string",
			cli: {
				flags: "--webhook-path <path>",
				description: "Synology Chat webhook path"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Synology Chat environment credentials"
			},
			envVars: ["SYNOLOGY_CHAT_TOKEN"]
		}
	},
	legacyAdapter: synologyChatSetupAdapter
});
const synologyChatSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Synology Chat",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsTokenIncomingWebhook"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsTokenIncomingWebhook"),
		configuredScore: 1,
		unconfiguredScore: 0,
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => accountId ? isSynologyChatConfigured(cfg, accountId) : listAccountIds(cfg).some((candidateAccountId) => isSynologyChatConfigured(cfg, candidateAccountId)),
		resolveExtraStatusLines: ({ cfg }) => [`Accounts: ${listAccountIds(cfg).length || 0}`]
	}),
	introNote: {
		title: t("wizard.synologyChat.setupTitle"),
		lines: SYNOLOGY_SETUP_HELP_LINES
	},
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "token",
		providerHint: channel,
		credentialLabel: "outgoing webhook token",
		preferredEnvVar: "SYNOLOGY_CHAT_TOKEN",
		helpTitle: t("wizard.synologyChat.webhookTokenTitle"),
		helpLines: SYNOLOGY_SETUP_HELP_LINES,
		envPrompt: t("wizard.synologyChat.tokenEnvPrompt"),
		keepPrompt: t("wizard.synologyChat.tokenKeep"),
		inputPrompt: t("wizard.synologyChat.tokenInput"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1,
		resolveAccount: ({ cfg, accountId }) => ({
			config: getRawAccountConfig(cfg, accountId),
			resolved: resolveAccount(cfg, accountId),
			configured: isSynologyChatConfigured(cfg, accountId)
		}),
		accountConfigured: (account) => account.configured,
		hasConfiguredValue: (account) => Boolean(normalizeOptionalString(account.config.token)),
		resolvedValue: (account) => normalizeOptionalString(account.resolved.token),
		envValue: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1 ? normalizeOptionalString(process.env.SYNOLOGY_CHAT_TOKEN) : void 0,
		patchAccount: ({ cfg, accountId, patch, clearFields }) => patchSynologyChatAccountConfig({
			cfg,
			accountId,
			enabled: true,
			clearFields,
			patch
		}),
		useEnv: { clearFields: ["token"] },
		set: { value: "resolved" }
	})],
	textInputs: [
		{
			inputKey: "url",
			message: t("wizard.synologyChat.incomingWebhookUrlPrompt"),
			placeholder: "https://nas.example.com/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming...",
			helpTitle: t("wizard.synologyChat.incomingWebhookTitle"),
			helpLines: [t("wizard.synologyChat.incomingWebhookHelpUseUrl"), t("wizard.synologyChat.incomingWebhookHelpReplies")],
			sensitive: true,
			currentValue: ({ cfg, accountId }) => getRawAccountConfig(cfg, accountId).incomingUrl?.trim(),
			keepPrompt: t("wizard.synologyChat.incomingWebhookKeep"),
			validate: ({ value }) => validateWebhookUrl(value),
			applySet: async ({ cfg, accountId, value }) => patchSynologyChatAccountConfig({
				cfg,
				accountId,
				enabled: true,
				patch: { incomingUrl: value.trim() }
			})
		},
		{
			inputKey: "webhookUrl",
			message: t("wizard.synologyChat.publicWebhookUrlPrompt"),
			placeholder: "https://gateway.example.com/webhook/synology",
			required: false,
			applyEmptyValue: true,
			sensitive: true,
			helpTitle: t("wizard.synologyChat.publicWebhookUrlTitle"),
			helpLines: [t("wizard.synologyChat.publicWebhookUrlHelp"), t("wizard.synologyChat.publicWebhookUrlScope")],
			currentValue: ({ cfg, accountId }) => getRawAccountConfig(cfg, accountId).webhookUrl?.trim(),
			keepPrompt: t("wizard.synologyChat.publicWebhookUrlKeep"),
			validate: ({ value }) => validatePublicWebhookUrl(value),
			applySet: async ({ cfg, accountId, value }) => patchSynologyChatAccountConfig({
				cfg,
				accountId,
				enabled: true,
				clearFields: value.trim() ? void 0 : ["webhookUrl"],
				patch: value.trim() ? { webhookUrl: value.trim() } : {}
			})
		},
		{
			inputKey: "webhookPath",
			message: t("wizard.synologyChat.outgoingWebhookPathPrompt"),
			placeholder: DEFAULT_WEBHOOK_PATH,
			required: false,
			applyEmptyValue: true,
			helpTitle: t("wizard.synologyChat.outgoingWebhookPathTitle"),
			helpLines: [t("wizard.synologyChat.defaultPath", { path: DEFAULT_WEBHOOK_PATH }), t("wizard.synologyChat.outgoingWebhookPathHelp")],
			currentValue: ({ cfg, accountId }) => getRawAccountConfig(cfg, accountId).webhookPath?.trim(),
			keepPrompt: (value) => t("wizard.synologyChat.outgoingWebhookPathKeep", { value }),
			validate: ({ value }) => validateWebhookPath(value),
			applySet: async ({ cfg, accountId, value }) => patchSynologyChatAccountConfig({
				cfg,
				accountId,
				enabled: true,
				clearFields: value.trim() ? void 0 : ["webhookPath"],
				patch: value.trim() ? { webhookPath: value.trim() } : {}
			})
		}
	],
	allowFrom: createAllowFromSection({
		helpTitle: t("wizard.synologyChat.allowlistTitle"),
		helpLines: SYNOLOGY_ALLOW_FROM_HELP_LINES,
		message: t("wizard.synologyChat.allowedUserIdsPrompt"),
		placeholder: "123456, 987654",
		invalidWithoutCredentialNote: t("wizard.synologyChat.allowedUserIdsInvalid"),
		parseInputs: splitSetupEntries,
		parseId: parseSynologyUserId,
		apply: async ({ cfg, accountId, allowFrom }) => patchSynologyChatAccountConfig({
			cfg,
			accountId,
			enabled: true,
			patch: {
				dmPolicy: "allowlist",
				allowedUserIds: mergeAllowFromEntries(resolveExistingAllowedUserIds(cfg, accountId), allowFrom)
			}
		})
	}),
	completionNote: {
		title: t("wizard.synologyChat.accessControlTitle"),
		lines: [
			`Default outgoing webhook path: ${DEFAULT_WEBHOOK_PATH}`,
			"Set allowed user IDs, or manually switch `channels.synology-chat.dmPolicy` to `\"open\"` with `allowedUserIds: [\"*\"]` for public DMs.",
			"With `dmPolicy=\"allowlist\"`, an empty allowedUserIds list blocks the route from starting.",
			`Docs: ${formatDocsLink("/channels/synology-chat", "channels/synology-chat")}`
		]
	},
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { resolveSynologyHostedMediaRoute as a, listAccountIds as c, SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX as i, resolveAccount as l, synologyChatSetupContract as n, resolveSynologyPublicWebhookRouteKey as o, synologyChatSetupWizard as r, toSynologyHostedMediaStoreRoutePath as s, synologyChatSetupAdapter as t };
