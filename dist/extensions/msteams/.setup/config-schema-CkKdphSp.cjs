const require_bot_framework_service_url = require("./bot-framework-service-url-B3FWn2SV.cjs");
const require_token_config = require("./token-config-bEpua_Q7.cjs");
let openclaw_plugin_sdk_channel_core = require("openclaw/plugin-sdk/channel-core");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_secret_input = require("openclaw/plugin-sdk/secret-input");
let openclaw_plugin_sdk_ssrf_policy = require("openclaw/plugin-sdk/ssrf-policy");
let openclaw_plugin_sdk_channel_config_schema = require("openclaw/plugin-sdk/channel-config-schema");
let zod = require("zod");
let openclaw_plugin_sdk_webhook_targets = require("openclaw/plugin-sdk/webhook-targets");
//#region extensions/msteams/src/config-schema-refinement.ts
function hasConfiguredValue(value) {
	return typeof value === "string" ? value.trim().length > 0 : value !== void 0 && value !== null;
}
function isAzureChinaBotFrameworkServiceUrl(value) {
	return (0, openclaw_plugin_sdk_ssrf_policy.isHttpsUrlAllowedByHostnameSuffixAllowlist)(value.trim(), ["botframework.azure.cn"]);
}
function refineEffectiveAccount(account, path, isDefault, ctx) {
	const label = isDefault ? "The effective default Microsoft Teams account" : "channels.msteams.accounts.*";
	const field = (name) => `${label}${isDefault ? " " : "."}${name}`;
	const allowFrom = isDefault ? "allowFrom" : "channels.msteams.accounts.*.allowFrom (or channels.msteams.allowFrom)";
	(0, openclaw_plugin_sdk_channel_config_schema.requireOpenAllowFrom)({
		policy: account.dmPolicy,
		allowFrom: account.allowFrom,
		ctx,
		path: [...path, "allowFrom"],
		message: `${field("dmPolicy=\"open\"")} requires ${allowFrom} to include "*"`
	});
	(0, openclaw_plugin_sdk_channel_config_schema.requireAllowlistAllowFrom)({
		policy: account.dmPolicy,
		allowFrom: account.allowFrom,
		ctx,
		path: [...path, "allowFrom"],
		message: `${field("dmPolicy=\"allowlist\"")} requires ${allowFrom} to contain at least one sender ID`
	});
	const issue = (name, message) => ctx.addIssue({
		code: zod.z.ZodIssueCode.custom,
		path: [...path, ...name.split(".")],
		message
	});
	if (account.sso?.enabled === true && !account.sso.connectionName?.trim()) issue("sso.connectionName", `${field("sso.enabled=true")} requires sso.connectionName to identify the Bot Framework OAuth connection`);
	const cloud = account.cloud;
	const serviceUrl = account.serviceUrl?.trim();
	if (cloud && cloud !== "Public" && cloud !== "China" && !serviceUrl) issue("serviceUrl", `${field("cloud")} requires serviceUrl for non-public Teams clouds`);
	if (cloud === "China" && serviceUrl && !isAzureChinaBotFrameworkServiceUrl(serviceUrl)) issue("serviceUrl", `${field("cloud=China")} requires serviceUrl to use an Azure China Bot Framework channel host`);
	if (cloud !== "China" && serviceUrl && isAzureChinaBotFrameworkServiceUrl(serviceUrl)) issue("cloud", `Azure China Bot Framework serviceUrl hosts require ${isDefault ? "the effective default Microsoft Teams account cloud=China" : "channels.msteams.accounts.*.cloud=China"}`);
}
function refineMSTeamsConfig(value, ctx) {
	const webhookPaths = /* @__PURE__ */ new Map();
	const appIds = /* @__PURE__ */ new Map();
	const recordWebhookPath = (webhookPath, path) => {
		const canonical = (0, openclaw_plugin_sdk_webhook_targets.canonicalizeWebhookRouteKey)(webhookPath);
		const existing = webhookPaths.get(canonical);
		if (existing) ctx.addIssue({
			code: zod.z.ZodIssueCode.custom,
			path,
			message: `Microsoft Teams webhook path ${webhookPath} is already used by ${existing}`
		});
		else webhookPaths.set(canonical, path.join("."));
	};
	const recordAppId = (appId, path) => {
		const normalized = appId?.trim().toLowerCase();
		if (!normalized) return;
		const existing = appIds.get(normalized);
		if (existing) {
			ctx.addIssue({
				code: zod.z.ZodIssueCode.custom,
				path,
				message: `Microsoft Teams appId is already used by ${existing}`
			});
			return;
		}
		appIds.set(normalized, path.join("."));
	};
	const accountKeys = /* @__PURE__ */ new Map();
	for (const accountId of Object.keys(value.accounts ?? {})) {
		const canonicalAccountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(accountId);
		const existing = accountKeys.get(canonicalAccountId);
		if (existing) {
			ctx.addIssue({
				code: zod.z.ZodIssueCode.custom,
				path: ["accounts", accountId],
				message: `channels.msteams.accounts contains duplicate canonical account id "${canonicalAccountId}" from "${existing}" and "${accountId}"`
			});
			continue;
		}
		accountKeys.set(canonicalAccountId, accountId);
	}
	const rootDefaultIdentityFields = [value.appId, value.appPassword].some((field) => field !== void 0 && field !== null && field !== "");
	const defaultAccountKey = accountKeys.get(openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID);
	const accountsDefault = defaultAccountKey ? value.accounts?.[defaultAccountKey] : void 0;
	const accountsDefaultPath = ["accounts", defaultAccountKey ?? openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID];
	const accountsDefaultIdentityFields = [accountsDefault?.appId, accountsDefault?.appPassword].some((field) => field !== void 0 && field !== null && field !== "");
	const effectiveDefault = {
		...value,
		...accountsDefault,
		sso: {
			...value.sso,
			...accountsDefault?.sso
		}
	};
	const hasEnvironmentDefaultCredentials = require_token_config.hasConfiguredMSTeamsCredentials(effectiveDefault);
	if (rootDefaultIdentityFields && accountsDefaultIdentityFields) ctx.addIssue({
		code: zod.z.ZodIssueCode.custom,
		path: accountsDefaultPath,
		message: "channels.msteams can define the default Teams identity either at the root or in accounts.default, not both"
	});
	const rootDefaultAccountEnabled = value.enabled !== false && accountsDefault?.enabled !== false;
	const defaultAccountConfigured = rootDefaultIdentityFields || accountsDefaultIdentityFields || hasEnvironmentDefaultCredentials || accountKeys.size === 0;
	const effectiveDefaultAppId = hasConfiguredValue(accountsDefault?.appId) ? accountsDefault?.appId : hasConfiguredValue(value.appId) ? value.appId : process.env.MSTEAMS_APP_ID;
	if (rootDefaultAccountEnabled && defaultAccountConfigured) {
		refineEffectiveAccount(effectiveDefault, accountsDefault ? accountsDefaultPath : [], true, ctx);
		recordAppId(effectiveDefaultAppId, ["appId"]);
		recordWebhookPath(require_bot_framework_service_url.resolveMSTeamsWebhookPath(value, openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID, accountsDefault), [
			...accountsDefault ? accountsDefaultPath : [],
			"webhook",
			"path"
		]);
	}
	for (const [accountId, account] of Object.entries(value.accounts ?? {})) {
		if (!account) continue;
		const canonicalAccountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(accountId);
		const path = ["accounts", accountId];
		if (canonicalAccountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) continue;
		if (!(value.enabled !== false && account.enabled !== false)) continue;
		refineEffectiveAccount({
			dmPolicy: account.dmPolicy ?? value.dmPolicy,
			allowFrom: account.allowFrom ?? value.allowFrom,
			sso: {
				...value.sso,
				...account.sso
			},
			cloud: account.cloud ?? value.cloud,
			serviceUrl: account.serviceUrl ?? value.serviceUrl
		}, path, false, ctx);
		if (!account.appId?.trim()) ctx.addIssue({
			code: zod.z.ZodIssueCode.custom,
			path: [...path, "appId"],
			message: "channels.msteams.accounts.*.appId is required for named Microsoft Teams bot accounts"
		});
		if (!(account.tenantId ?? value.tenantId)?.trim()) ctx.addIssue({
			code: zod.z.ZodIssueCode.custom,
			path: [...path, "tenantId"],
			message: "channels.msteams.accounts.*.tenantId or channels.msteams.tenantId is required for named Microsoft Teams bot accounts"
		});
		const effectiveAuthType = account.authType ?? value.authType ?? "secret";
		if (effectiveAuthType === "secret" && !hasConfiguredValue(account.appPassword)) ctx.addIssue({
			code: zod.z.ZodIssueCode.custom,
			path: [...path, "appPassword"],
			message: "channels.msteams.accounts.*.appPassword is required for named Microsoft Teams bot accounts using secret auth"
		});
		if (effectiveAuthType === "federated" && !(account.certificatePath ?? value.certificatePath)?.trim() && (account.useManagedIdentity ?? value.useManagedIdentity) !== true) ctx.addIssue({
			code: zod.z.ZodIssueCode.custom,
			path: [...path, "authType"],
			message: "channels.msteams.accounts.* using federated auth must configure certificatePath or useManagedIdentity"
		});
		recordAppId(account.appId, [...path, "appId"]);
		recordWebhookPath(require_bot_framework_service_url.resolveMSTeamsWebhookPath(value, canonicalAccountId, account), [
			...path,
			"webhook",
			"path"
		]);
	}
}
//#endregion
//#region extensions/msteams/src/config-ui-hints.ts
const msTeamsChannelConfigUiHints = {
	"": {
		label: "MS Teams",
		help: "Microsoft Teams channel provider configuration and provider-specific policy toggles. Use this section to isolate Teams behavior from other enterprise chat providers."
	},
	configWrites: {
		label: "MS Teams Config Writes",
		help: "Allow Microsoft Teams to write config in response to channel events/commands (default: true)."
	},
	cloud: {
		label: "MS Teams Cloud",
		help: "Teams SDK cloud environment for auth, token validation, and token services: \"Public\", \"USGov\", \"USGovDoD\", or \"China\" (default: Public)."
	},
	serviceUrl: {
		label: "MS Teams Service URL",
		help: "Bot Connector service URL for SDK proactive sends/edits/deletes. Set with cloud for USGov/DoD; set alone for GCC."
	},
	graphMediaFallback: {
		label: "MS Teams Graph Media Fallback",
		help: "Query Microsoft Graph for unresolved channel or group-chat HTML media. Adds one lookup per matching message when enabled (default: false)."
	},
	requireMentionInBotThreads: {
		label: "Require Mentions in Bot Threads",
		help: "Override mention requirements for channel threads rooted at this bot's tracked messages. Unset preserves existing behavior. Channel overrides win over team and global values. Ownership tracking lasts up to 24 hours."
	},
	"teams.*.requireMentionInBotThreads": {
		label: "Team Bot Thread Mentions",
		help: "Override mention requirements for this bot's channel threads in this team. Unset inherits the global value."
	},
	"teams.*.channels.*.requireMentionInBotThreads": {
		label: "Channel Bot Thread Mentions",
		help: "Override mention requirements for this bot's threads in this channel. Unset inherits the team or global value."
	},
	...(0, openclaw_plugin_sdk_channel_core.createChannelConfigUiHints)({
		channelLabel: "MS Teams",
		streaming: { "": {
			label: "MS Teams Streaming",
			help: "Microsoft Teams preview/progress streaming mode: \"off\" | \"partial\" | \"block\" | \"progress\". Personal chats use Teams native streaminfo progress when available."
		} },
		progress: {
			labels: "openclaw",
			titleWording: true
		}
	})
};
//#endregion
//#region extensions/msteams/src/config-schema.ts
const SecretInputSchema = (0, openclaw_plugin_sdk_secret_input.buildSecretInputSchema)();
const ToolPolicyBySenderSchema = zod.z.record(zod.z.string(), openclaw_plugin_sdk_channel_config_schema.ToolPolicySchema).optional();
const MSTeamsChannelSchema = zod.z.object({
	requireMention: zod.z.boolean().optional(),
	requireMentionInBotThreads: zod.z.boolean().optional(),
	tools: openclaw_plugin_sdk_channel_config_schema.ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	replyStyle: openclaw_plugin_sdk_channel_config_schema.MSTeamsReplyStyleSchema.optional()
}).strict();
const MSTeamsTeamSchema = MSTeamsChannelSchema.extend({ channels: zod.z.record(zod.z.string(), MSTeamsChannelSchema.optional()).optional() });
const { accountShape, rootPolicyShape } = (0, openclaw_plugin_sdk_channel_config_schema.buildChannelAccountSchemaParts)({
	omit: [
		"name",
		"mentionPatterns",
		"replyToMode"
	],
	allowFrom: zod.z.array(zod.z.string()).optional(),
	groupAllowFrom: zod.z.array(zod.z.string()).optional(),
	streaming: openclaw_plugin_sdk_channel_config_schema.ChannelPreviewStreamingConfigSchema.optional()
});
const MSTeamsAccountConfigBaseSchema = zod.z.object({
	...accountShape,
	dangerouslyAllowNameMatching: openclaw_plugin_sdk_channel_config_schema.ChannelDangerouslyAllowNameMatchingSchema,
	appId: zod.z.string().optional(),
	appPassword: (0, openclaw_plugin_sdk_secret_input.registerSensitiveConfigSchema)(SecretInputSchema.optional()),
	tenantId: zod.z.string().optional(),
	cloud: zod.z.enum([
		"Public",
		"USGov",
		"USGovDoD",
		"China"
	]).optional(),
	serviceUrl: zod.z.string().url().refine(require_bot_framework_service_url.isAllowedBotFrameworkServiceUrl, { message: "channels.msteams.serviceUrl must use a supported Microsoft Teams Bot Connector host" }).optional(),
	authType: zod.z.enum(["secret", "federated"]).optional(),
	certificatePath: zod.z.string().optional(),
	certificateThumbprint: zod.z.string().optional(),
	useManagedIdentity: zod.z.boolean().optional(),
	managedIdentityClientId: zod.z.string().optional(),
	webhook: zod.z.object({ path: zod.z.string().optional() }).strict().optional(),
	legacyWebhook: zod.z.union([zod.z.literal(false), zod.z.object({
		port: zod.z.number().int().min(1).max(65535),
		host: zod.z.string().optional()
	}).strict()]).optional(),
	typingIndicator: zod.z.boolean().optional(),
	mediaAllowHosts: zod.z.array(zod.z.string()).optional(),
	mediaAuthAllowHosts: zod.z.array(zod.z.string()).optional(),
	graphMediaFallback: zod.z.boolean().optional(),
	requireMention: zod.z.boolean().optional(),
	requireMentionInBotThreads: zod.z.boolean().optional(),
	replyStyle: openclaw_plugin_sdk_channel_config_schema.MSTeamsReplyStyleSchema.optional(),
	teams: zod.z.record(zod.z.string(), MSTeamsTeamSchema.optional()).optional(),
	/** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2") */
	sharePointSiteId: zod.z.string().optional(),
	welcomeCard: zod.z.boolean().optional(),
	promptStarters: zod.z.array(zod.z.string()).optional(),
	groupWelcomeCard: zod.z.boolean().optional(),
	feedbackEnabled: zod.z.boolean().optional(),
	feedbackReflection: zod.z.boolean().optional(),
	feedbackReflectionCooldownMs: zod.z.number().int().min(0).optional(),
	delegatedAuth: zod.z.object({
		enabled: zod.z.boolean().optional(),
		scopes: zod.z.array(zod.z.string()).optional()
	}).strict().optional(),
	sso: zod.z.object({
		enabled: zod.z.boolean().optional(),
		connectionName: zod.z.string().optional()
	}).strict().optional()
}).strict();
const MSTeamsConfigSchema = MSTeamsAccountConfigBaseSchema.extend({
	...rootPolicyShape,
	accounts: zod.z.record(zod.z.string(), MSTeamsAccountConfigBaseSchema.extend({ name: zod.z.string().optional() }).optional()).optional(),
	defaultAccount: zod.z.string().optional()
}).strict().superRefine(refineMSTeamsConfig);
const MSTeamsChannelConfigSchema = (0, openclaw_plugin_sdk_channel_config_schema.buildChannelConfigSchema)(MSTeamsConfigSchema, { uiHints: msTeamsChannelConfigUiHints });
//#endregion
Object.defineProperty(exports, "MSTeamsChannelConfigSchema", {
	enumerable: true,
	get: function() {
		return MSTeamsChannelConfigSchema;
	}
});
