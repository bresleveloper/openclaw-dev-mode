import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union } from "./schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "./compat-CVCDeluo.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-B5xWSzLp.mjs";
import { c as GroupPolicySchema, o as DmPolicySchema, z as ProviderCommandsSchema } from "./zod-schema.core-DyJd-bbI.mjs";
import { o as ToolPolicySchema } from "./zod-schema.agent-runtime-A2vJPWeP.mjs";
import { a as buildGroupEntrySchema, i as buildChannelConfigSchema, u as refineChannelDmPolicy } from "./config-schema-BJ55TtqJ.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { i as registerSensitiveConfigSchema, r as buildSecretInputSchema } from "./secret-input-DTg0P0Pk.mjs";
import { t as createChannelConfigUiHints } from "./channel-config-ui-hints-D1z4Jpgv.mjs";
import { i as ChannelStreamingPreviewSchema, l as buildChannelExecApprovalsSchema, n as ChannelPreviewStreamingConfigSchema, s as buildChannelAccountSchemaParts, u as buildChannelReactionShape } from "./channel-config-schema-DMmqacmO.mjs";
import { i as resolveTelegramCustomCommands, n as normalizeTelegramCommandDescription, r as normalizeTelegramCommandName } from "./command-config-2phBVF-a.mjs";
//#region extensions/telegram/src/config-ui-hints.ts
const observedGroupHistoryHint = { help: "Automatic observed-message context uses a default of 50 and a maximum of 200 messages; 0 disables automatic injection. The JSON integer maximum selects the 50-message default. Session transcript trimming separately counts user turns, where 0 means no trimming. The observed-message cap does not rewrite saved values." };
const observedDmHistoryHint = { help: "Automatic observed-DM context uses a default of 10 and a maximum of 200 messages; 0 disables that extra context. The JSON integer maximum selects the 10-message default. Session transcript trimming separately counts user turns, where 0 means no trimming. The observed-message cap does not rewrite saved values." };
const telegramChannelConfigUiHints = {
	historyLimit: observedGroupHistoryHint,
	"accounts.*.historyLimit": observedGroupHistoryHint,
	dmHistoryLimit: observedDmHistoryHint,
	"accounts.*.dmHistoryLimit": observedDmHistoryHint,
	"dms.*.historyLimit": observedDmHistoryHint,
	"accounts.*.dms.*.historyLimit": observedDmHistoryHint,
	"": {
		label: "Telegram",
		help: "Telegram channel provider configuration including auth tokens, retry behavior, and message rendering controls. Use this section to tune bot behavior for Telegram-specific API semantics."
	},
	customCommands: {
		label: "Telegram Custom Commands",
		help: "Additional Telegram bot menu commands (merged with native; conflicts ignored)."
	},
	botToken: {
		label: "Telegram Bot Token",
		help: "Telegram bot token used to authenticate Bot API requests for this account/provider config. Use secret/env substitution and rotate tokens if exposure is suspected."
	},
	joinIntro: {
		label: "Telegram Group Join Introduction",
		help: "Send one room-aware introduction when the bot joins an allowed group or supergroup (default: true). Telegram cannot provide message history from before the bot joined."
	},
	...createChannelConfigUiHints({
		channelLabel: "Telegram",
		dmPolicy: { channelKey: "telegram" },
		configWrites: true,
		mentionPatterns: {
			targetDescription: "Telegram group chat IDs or chatId:topic:threadId topic IDs",
			policyNote: "Native Telegram bot mentions still trigger even when regex patterns are denied.",
			denyNote: "Native bot mentions still trigger."
		},
		nativeCommands: true,
		streaming: {
			"": "Unified Telegram stream preview mode: \"off\" | \"partial\" | \"block\" | \"progress\" (default: \"progress\"). \"progress\" keeps a single editable progress draft until final delivery. Legacy boolean/streamMode keys are detected; run doctor --fix to migrate.",
			mode: "Canonical Telegram preview mode: \"off\" | \"partial\" | \"block\" | \"progress\" (default: \"progress\").",
			chunkMode: "Chunking mode for outbound Telegram text delivery: \"length\" (default) or \"newline\".",
			"block.enabled": "Enable normal Telegram block replies. This takes precedence over editable preview delivery.",
			"block.coalesce": "Merge streamed Telegram block replies before sending final delivery.",
			"preview.chunk.minChars": "Minimum chars before emitting a Telegram block preview chunk when channels.telegram.streaming.mode=\"block\".",
			"preview.chunk.maxChars": "Target max size for a Telegram block preview chunk when channels.telegram.streaming.mode=\"block\".",
			"preview.chunk.breakPreference": "Preferred breakpoints for Telegram draft chunks (paragraph | newline | sentence).",
			"preview.toolProgress": "Show tool/progress activity in the live draft preview message (default: true when preview streaming is active). Set false to keep tool updates out of the edited Telegram preview.",
			"preview.commandText": "Command/exec detail in preview tool-progress lines: \"status\" is the safe default; \"raw\" opts into command text."
		},
		progress: {
			includeCommentary: true,
			commentaryOrder: "after-command"
		}
	}),
	richMessages: {
		label: "Telegram Rich Messages",
		help: "Opt into Bot API 10.3 rich text sends and edits, including native tables and rich media. Default: false because some current Telegram clients render these messages as unsupported."
	},
	"network.autoSelectFamily": {
		label: "Telegram autoSelectFamily",
		help: "Override Node autoSelectFamily for Telegram (true=enable, false=disable)."
	},
	"network.dangerouslyAllowPrivateNetwork": {
		label: "Telegram Dangerously Allow Private Network",
		help: "Dangerous opt-in for trusted fake-IP or transparent-proxy environments where Telegram media downloads resolve api.telegram.org to private/internal/special-use addresses."
	},
	silentErrorReplies: {
		label: "Telegram Silent Error Replies",
		help: "When true, Telegram bot replies marked as errors are sent silently (no notification sound). Default: false."
	},
	apiRoot: {
		label: "Telegram API Root URL",
		help: "Custom Telegram Bot API root URL. Use the API root only (for example https://api.telegram.org), not a full /bot<TOKEN> endpoint. Use for self-hosted Bot API servers (https://github.com/tdlib/telegram-bot-api) or reverse proxies in regions where api.telegram.org is blocked."
	},
	trustedLocalFileRoots: {
		label: "Telegram Trusted Local File Roots",
		help: "Trusted local filesystem roots for self-hosted Telegram Bot API file_path values. Exact in-root paths are read directly; container paths under /var/lib/telegram-bot-api can map into a host volume mount. Other absolute paths are rejected."
	},
	autoTopicLabel: {
		label: "Telegram Auto Topic Label",
		help: "Auto-rename DM forum topics on first message using LLM. Default: true. Set to false to disable, or use object form { enabled: true, prompt: '...' } for custom prompt."
	},
	"autoTopicLabel.enabled": {
		label: "Telegram Auto Topic Label Enabled",
		help: "Whether auto topic labeling is enabled. Default: true."
	},
	"autoTopicLabel.prompt": {
		label: "Telegram Auto Topic Label Prompt",
		help: "Custom prompt for LLM-based topic naming. The user message is appended after the prompt."
	},
	"capabilities.inlineButtons": {
		label: "Telegram Inline Buttons",
		help: "Enable Telegram inline button components for supported command and interaction surfaces. Disable if your deployment needs plain-text-only compatibility behavior."
	},
	execApprovals: {
		label: "Telegram Exec Approvals",
		help: "Telegram-native exec approval routing and approver authorization. When unset, OpenClaw auto-enables DM-first native approvals if approvers can be resolved for the selected bot account."
	},
	"execApprovals.enabled": {
		label: "Telegram Exec Approvals Enabled",
		help: "Controls Telegram native exec approvals for this account: unset or \"auto\" enables DM-first native approvals when approvers can be resolved, true forces native approvals on, and false disables them."
	},
	"execApprovals.approvers": {
		label: "Telegram Exec Approval Approvers",
		help: "Telegram user IDs allowed to approve exec requests for this bot account. Use numeric Telegram user IDs. If you leave this unset, OpenClaw falls back to numeric owner IDs inferred from commands.ownerAllowFrom when possible."
	},
	"execApprovals.agentFilter": {
		label: "Telegram Exec Approval Agent Filter",
		help: "Optional allowlist of agent IDs eligible for Telegram exec approvals, for example `[\"main\", \"ops-agent\"]`. Use this to keep approval prompts scoped to the agents you actually operate from Telegram."
	},
	"execApprovals.sessionFilter": {
		label: "Telegram Exec Approval Session Filter",
		help: "Optional session-key filters matched as substring or regex-style patterns before Telegram approval routing is used. Use narrow patterns so Telegram approvals only appear for intended sessions."
	},
	"execApprovals.target": {
		label: "Telegram Exec Approval Target",
		help: "Controls where Telegram approval prompts are sent: \"dm\" sends to approver DMs (default), \"channel\" sends to the originating Telegram chat/topic, and \"both\" sends to both. Channel delivery exposes the command text to the chat, so only use it in trusted groups/topics."
	},
	"threadBindings.enabled": {
		label: "Telegram Thread Binding Enabled",
		help: "Enable Telegram conversation-bound session spawning, routing, and delivery. Manage bindings with /agents and /session unbind|idle|max-age. Overrides session.threadBindings.enabled when set."
	},
	"threadBindings.idleHours": {
		label: "Telegram Thread Binding Idle Timeout (hours)",
		help: "Inactivity window in hours for Telegram bound sessions. Set 0 to disable idle expiry (default: 24). Overrides session.threadBindings.idleHours when set."
	},
	"threadBindings.maxAgeHours": {
		label: "Telegram Thread Binding Max Age (hours)",
		help: "Optional hard max age in hours for Telegram bound sessions. Set 0 to disable hard cap (default: 0). Overrides session.threadBindings.maxAgeHours when set."
	},
	"threadBindings.spawnSessions": {
		label: "Telegram Thread-Bound Session Spawn",
		help: "Allow sessions_spawn(thread=true) and ACP thread spawns to auto-bind Telegram current conversations when supported."
	},
	"threadBindings.defaultSpawnContext": {
		label: "Telegram Thread Spawn Context",
		help: "Default native subagent context for thread-bound spawns. \"fork\" starts from the requester transcript; \"isolated\" starts clean. Default: \"fork\"."
	}
};
//#endregion
//#region extensions/telegram/src/config-schema.ts
const SecretInputSchema = buildSecretInputSchema();
const ToolPolicyBySenderSchema = record(string(), ToolPolicySchema).optional();
function validateTelegramWebhookSecretRequirements(value, ctx) {
	const baseWebhookUrl = normalizeOptionalString(value.webhookUrl) ?? "";
	const hasBaseWebhookSecret = hasConfiguredSecretInput(value.webhookSecret);
	if (baseWebhookUrl && !hasBaseWebhookSecret) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "channels.telegram.webhookUrl requires channels.telegram.webhookSecret",
		path: ["webhookSecret"]
	});
	for (const [accountId, account] of Object.entries(value.accounts ?? {})) {
		if (!account || account.enabled === false) continue;
		if (!(normalizeOptionalString(account.webhookUrl) ?? "")) continue;
		if (!hasConfiguredSecretInput(account.webhookSecret) && !hasBaseWebhookSecret) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "channels.telegram.accounts.*.webhookUrl requires channels.telegram.webhookSecret or channels.telegram.accounts.*.webhookSecret",
			path: [
				"accounts",
				accountId,
				"webhookSecret"
			]
		});
	}
}
const TelegramInlineButtonsScopeSchema = _enum([
	"off",
	"dm",
	"group",
	"all",
	"allowlist"
]);
const TelegramCapabilitiesSchema = union([array(string()), object({ inlineButtons: TelegramInlineButtonsScopeSchema.optional() }).strict()]);
const TelegramPreviewStreamingConfigSchema = ChannelPreviewStreamingConfigSchema.extend({ preview: ChannelStreamingPreviewSchema.optional() }).strict();
const TelegramErrorPolicySchema = _enum([
	"always",
	"once",
	"silent"
]).optional();
const TelegramTopicSchema = object({
	requireMention: boolean().optional(),
	ingest: boolean().optional(),
	disableAudioPreflight: boolean().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	skills: array(string()).optional(),
	enabled: boolean().optional(),
	allowFrom: array(union([string(), number()])).optional(),
	systemPrompt: string().optional(),
	agentId: string().optional(),
	errorPolicy: TelegramErrorPolicySchema
}).strict();
const TelegramGroupSchema = buildGroupEntrySchema({
	ingest: boolean().optional(),
	disableAudioPreflight: boolean().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	topics: record(string(), TelegramTopicSchema.optional()).optional(),
	errorPolicy: TelegramErrorPolicySchema
});
const AutoTopicLabelSchema = union([boolean(), object({
	enabled: boolean().optional(),
	prompt: string().optional()
}).strict()]).optional();
const TelegramDirectSchema = object({
	dmPolicy: DmPolicySchema.optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	skills: array(string()).optional(),
	enabled: boolean().optional(),
	allowFrom: array(union([string(), number()])).optional(),
	systemPrompt: string().optional(),
	topics: record(string(), TelegramTopicSchema.optional()).optional(),
	errorPolicy: TelegramErrorPolicySchema,
	requireTopic: boolean().optional(),
	autoTopicLabel: AutoTopicLabelSchema
}).strict();
const TelegramCustomCommandSchema = object({
	command: string().overwrite(normalizeTelegramCommandName),
	description: string().overwrite(normalizeTelegramCommandDescription)
}).strict();
const validateTelegramCustomCommands = (value, ctx) => {
	if (!value.customCommands || value.customCommands.length === 0) return;
	const { issues } = resolveTelegramCustomCommands({
		commands: value.customCommands,
		checkReserved: false,
		checkDuplicates: false
	});
	for (const issue of issues) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: [
			"customCommands",
			issue.index,
			issue.field
		],
		message: issue.message
	});
};
const { accountShape, rootPolicyShape } = buildChannelAccountSchemaParts({
	capabilities: TelegramCapabilitiesSchema.optional(),
	defaultTo: union([string(), number()]).optional(),
	streaming: TelegramPreviewStreamingConfigSchema.optional()
});
const TelegramAccountSchemaBase = object({
	...accountShape,
	joinIntro: boolean().optional(),
	execApprovals: buildChannelExecApprovalsSchema(union([string(), number()])),
	commands: ProviderCommandsSchema,
	customCommands: array(TelegramCustomCommandSchema).optional(),
	botToken: registerSensitiveConfigSchema(SecretInputSchema.optional()),
	tokenFile: string().optional(),
	groups: record(string(), TelegramGroupSchema.optional()).optional(),
	direct: record(string(), TelegramDirectSchema.optional()).optional(),
	richMessages: boolean().optional(),
	network: object({
		autoSelectFamily: boolean().optional(),
		dnsResultOrder: _enum(["ipv4first", "verbatim"]).optional(),
		dangerouslyAllowPrivateNetwork: boolean().optional().describe("Dangerous opt-in for trusted Telegram fake-IP or transparent-proxy environments where api.telegram.org resolves to private/internal/special-use addresses during media downloads.")
	}).strict().optional(),
	proxy: string().optional(),
	webhookUrl: string().optional().describe("Public HTTPS webhook URL registered with Telegram for inbound updates. This must be internet-reachable and requires channels.telegram.webhookSecret."),
	webhookSecret: registerSensitiveConfigSchema(SecretInputSchema.optional().describe("Secret token sent to Telegram during webhook registration and verified on inbound webhook requests. Telegram returns this value for verification; this is not the gateway auth token and not the bot token.")),
	webhookPath: string().optional().describe("Local webhook route path served by the gateway listener. Defaults to /telegram-webhook."),
	webhookHost: string().optional().describe("Local bind host for the webhook listener. Defaults to 127.0.0.1; keep loopback unless you intentionally expose direct ingress."),
	webhookPort: number().int().nonnegative().optional().describe("Local bind port for the webhook listener. Defaults to 8787; set to 0 to let the OS assign an ephemeral port."),
	webhookCertPath: string().optional().describe("Path to the self-signed certificate (PEM) to upload to Telegram during webhook registration. Required for self-signed certs (direct IP or no domain)."),
	actions: object({
		reactions: boolean().optional(),
		sendMessage: boolean().optional(),
		poll: boolean().optional(),
		deleteMessage: boolean().optional(),
		editMessage: boolean().optional(),
		sticker: boolean().optional(),
		createForumTopic: boolean().optional(),
		editForumTopic: boolean().optional()
	}).strict().optional(),
	threadBindings: object({
		enabled: boolean().optional(),
		idleHours: number().nonnegative().optional(),
		maxAgeHours: number().nonnegative().optional(),
		spawnSessions: boolean().optional(),
		defaultSpawnContext: _enum(["isolated", "fork"]).optional()
	}).strict().optional(),
	...buildChannelReactionShape({
		notificationModes: [
			"off",
			"own",
			"all"
		],
		reactionLevels: [
			"off",
			"ack",
			"minimal",
			"extensive"
		],
		ackReaction: string().optional()
	}),
	linkPreview: boolean().optional(),
	silentErrorReplies: boolean().optional(),
	errorPolicy: TelegramErrorPolicySchema,
	apiRoot: string().url().optional(),
	trustedLocalFileRoots: array(string()).optional().describe("Trusted local filesystem roots for self-hosted Telegram Bot API absolute file_path values. Only absolute paths under these roots are read directly; all other absolute paths are rejected."),
	autoTopicLabel: AutoTopicLabelSchema
}).strict();
const TelegramAccountSchema = TelegramAccountSchemaBase.superRefine((value, ctx) => {
	validateTelegramCustomCommands(value, ctx);
});
const TelegramConfigSchema = TelegramAccountSchemaBase.extend({
	...rootPolicyShape,
	accounts: record(string(), TelegramAccountSchema.optional()).optional(),
	defaultAccount: string().optional()
}).superRefine((value, ctx) => {
	refineChannelDmPolicy({
		channelId: "telegram",
		value,
		ctx
	});
	validateTelegramCustomCommands(value, ctx);
	if (value.accounts) for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		refineChannelDmPolicy({
			channelId: "telegram",
			value,
			accountId,
			ctx
		});
	}
	validateTelegramWebhookSecretRequirements(value, ctx);
});
const TelegramChannelConfigSchema = buildChannelConfigSchema(TelegramConfigSchema, { uiHints: telegramChannelConfigUiHints });
//#endregion
export { TelegramConfigSchema as n, TelegramChannelConfigSchema as t };
