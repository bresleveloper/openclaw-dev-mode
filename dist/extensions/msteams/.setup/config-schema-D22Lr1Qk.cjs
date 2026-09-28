let openclaw_plugin_sdk_channel_core = require("openclaw/plugin-sdk/channel-core");
let openclaw_plugin_sdk_secret_input = require("openclaw/plugin-sdk/secret-input");
let openclaw_plugin_sdk_channel_config_schema = require("openclaw/plugin-sdk/channel-config-schema");
let zod = require("zod");
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
	tools: openclaw_plugin_sdk_channel_config_schema.ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	replyStyle: openclaw_plugin_sdk_channel_config_schema.MSTeamsReplyStyleSchema.optional()
}).strict();
const MSTeamsTeamSchema = zod.z.object({
	requireMention: zod.z.boolean().optional(),
	tools: openclaw_plugin_sdk_channel_config_schema.ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	replyStyle: openclaw_plugin_sdk_channel_config_schema.MSTeamsReplyStyleSchema.optional(),
	channels: zod.z.record(zod.z.string(), MSTeamsChannelSchema.optional()).optional()
}).strict();
const MSTEAMS_SERVICE_URL_HOST_ALLOWLIST = [
	"smba.trafficmanager.net",
	"smba.infra.gcc.teams.microsoft.com",
	"smba.infra.gov.teams.microsoft.us",
	"smba.infra.dod.teams.microsoft.us",
	"botframework.azure.cn"
];
function isAllowedMSTeamsServiceUrl(value) {
	try {
		const parsed = new URL(value.trim());
		if (parsed.protocol !== "https:") return false;
		const host = parsed.hostname.toLowerCase();
		return MSTEAMS_SERVICE_URL_HOST_ALLOWLIST.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
	} catch {
		return false;
	}
}
function isAzureChinaBotFrameworkServiceUrl(value) {
	try {
		const parsed = new URL(value.trim());
		if (parsed.protocol !== "https:") return false;
		const host = parsed.hostname.toLowerCase();
		return host === "botframework.azure.cn" || host.endsWith(".botframework.azure.cn");
	} catch {
		return false;
	}
}
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
const MSTeamsConfigSchema = zod.z.object({
	...accountShape,
	...rootPolicyShape,
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
	serviceUrl: zod.z.string().url().refine(isAllowedMSTeamsServiceUrl, { message: "channels.msteams.serviceUrl must use a supported Microsoft Teams Bot Connector host" }).optional(),
	authType: zod.z.enum(["secret", "federated"]).optional(),
	certificatePath: zod.z.string().optional(),
	certificateThumbprint: zod.z.string().optional(),
	useManagedIdentity: zod.z.boolean().optional(),
	managedIdentityClientId: zod.z.string().optional(),
	webhook: zod.z.object({
		port: zod.z.number().int().positive().optional(),
		path: zod.z.string().optional()
	}).strict().optional(),
	typingIndicator: zod.z.boolean().optional(),
	mediaAllowHosts: zod.z.array(zod.z.string()).optional(),
	mediaAuthAllowHosts: zod.z.array(zod.z.string()).optional(),
	graphMediaFallback: zod.z.boolean().optional(),
	requireMention: zod.z.boolean().optional(),
	replyStyle: openclaw_plugin_sdk_channel_config_schema.MSTeamsReplyStyleSchema.optional(),
	teams: zod.z.record(zod.z.string(), MSTeamsTeamSchema.optional()).optional(),
	/** Max inbound and outbound media size in MB (default: 100MB). */
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
}).strict().superRefine((value, ctx) => {
	(0, openclaw_plugin_sdk_channel_config_schema.refineChannelDmPolicy)({
		channelId: "msteams",
		value,
		ctx
	});
	if (value.sso?.enabled === true && !value.sso.connectionName?.trim()) ctx.addIssue({
		code: zod.z.ZodIssueCode.custom,
		path: ["sso", "connectionName"],
		message: "channels.msteams.sso.enabled=true requires channels.msteams.sso.connectionName to identify the Bot Framework OAuth connection"
	});
	if (value.cloud && value.cloud !== "Public" && value.cloud !== "China" && !value.serviceUrl?.trim()) ctx.addIssue({
		code: zod.z.ZodIssueCode.custom,
		path: ["serviceUrl"],
		message: "channels.msteams.cloud requires channels.msteams.serviceUrl for non-public Teams clouds"
	});
	if (value.cloud === "China" && value.serviceUrl?.trim() && !isAzureChinaBotFrameworkServiceUrl(value.serviceUrl)) ctx.addIssue({
		code: zod.z.ZodIssueCode.custom,
		path: ["serviceUrl"],
		message: "channels.msteams.cloud=China requires channels.msteams.serviceUrl to use an Azure China Bot Framework channel host"
	});
	if (value.cloud !== "China" && value.serviceUrl?.trim() && isAzureChinaBotFrameworkServiceUrl(value.serviceUrl)) ctx.addIssue({
		code: zod.z.ZodIssueCode.custom,
		path: ["cloud"],
		message: "Azure China Bot Framework serviceUrl hosts require channels.msteams.cloud=China"
	});
});
const MSTeamsChannelConfigSchema = (0, openclaw_plugin_sdk_channel_config_schema.buildChannelConfigSchema)(MSTeamsConfigSchema, { uiHints: msTeamsChannelConfigUiHints });
//#endregion
Object.defineProperty(exports, "MSTeamsChannelConfigSchema", {
	enumerable: true,
	get: function() {
		return MSTeamsChannelConfigSchema;
	}
});
