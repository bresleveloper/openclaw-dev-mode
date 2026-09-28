import { h as normalizeMattermostBaseUrl } from "./client-BSSVve1x.mjs";
import { t as mattermostIngressIdentity } from "./ingress-identity-DNl4yQSc.mjs";
import { a as resolveMattermostPresentation, c as listMattermostAccountIds, d as resolveMattermostReplyToMode, f as buildSecretInputSchema, i as requiresMattermostMediaUpload, l as resolveDefaultMattermostAccountId, n as normalizeMattermostMessagingTarget, o as inspectMattermostAccount, p as hasConfiguredSecretInput, s as isMattermostConfigured$1, t as looksLikeMattermostTargetId, u as resolveMattermostAccount } from "./normalize-DM54w7ud.mjs";
import { t as resolveMattermostGatewayAuthBypassPaths } from "./gateway-auth-bypass-B93t91oq.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-mvORF4f6.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-qg3NXRlS.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildPassiveProbedChannelStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { isPrivateNetworkOptInEnabled } from "openclaw/plugin-sdk/ssrf-runtime";
import { z } from "zod";
import { formatNormalizedAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { createLoggedPairingApprovalNotifier } from "openclaw/plugin-sdk/channel-pairing";
import { createAccountStatusSink, createChannelMessageAdapterFromOutbound } from "openclaw/plugin-sdk/channel-outbound";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, stripChannelTargetPrefix, stripTargetKindPrefix } from "openclaw/plugin-sdk/core";
import { jsonResult, readPositiveIntegerParam, readStringArrayParam, readStringParam, withNormalizedTimestamp } from "openclaw/plugin-sdk/channel-actions";
import { createChannelConfigUiHints, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { identityEntryAuthenticationClassifier } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { buildChannelGroupsScopeTree, buildMutableAllowEntryDetector, collectStandardAllowlistLists, createDangerousNameMatchingMutableAllowlistWarningCollector, createRestrictSendersChannelSecurity, resolveScopeRequireMention } from "openclaw/plugin-sdk/channel-policy";
import { attachChannelToResult, createAttachedChannelResultAdapter } from "openclaw/plugin-sdk/channel-send-result";
import { createChannelDirectoryAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { resolveMessagePresentationButtonAction } from "openclaw/plugin-sdk/interactive-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { resolvePayloadMediaUrls, sendTextMediaPayload } from "openclaw/plugin-sdk/reply-payload";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { chunkTextForOutbound, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { BlockStreamingCoalesceSchema, ChannelImplicitMentionsSchema, ContextVisibilityModeSchema, DmPolicySchema, GroupPolicySchema, MarkdownConfigSchema, buildChannelConfigSchema, buildGroupEntrySchema, buildMultiAccountChannelSchema, requireOpenAllowFrom } from "openclaw/plugin-sdk/channel-config-schema";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { applyAccountNameToChannelSection, applySetupAccountConfigPatch, baseUrlTextInput, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, formatDocsLink, migrateBaseNameToDefaultAccount, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { createSetupInputPresenceValidator } from "openclaw/plugin-sdk/setup-runtime";
//#region extensions/mattermost/src/approval-auth.ts
const MATTERMOST_USER_ID_RE = /^[a-z0-9]{26}$/;
function normalizeMattermostApproverId(value) {
	const normalized = String(value).trim().replace(/^(mattermost|user):/i, "").replace(/^@/, "").trim();
	const lowered = normalizeLowercaseStringOrEmpty(normalized);
	return MATTERMOST_USER_ID_RE.test(lowered) ? lowered : void 0;
}
const mattermostApprovalAuth = createChannelApprovalAuth({
	channelLabel: "Mattermost",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveMattermostAccount({
			cfg,
			accountId
		}).config.allowFrom };
	},
	normalizeApprover: normalizeMattermostApproverId
}).approvalAuth;
//#endregion
//#region extensions/mattermost/src/channel-config-shared.ts
const mattermostMeta = {
	id: "mattermost",
	label: "Mattermost",
	selectionLabel: "Mattermost (plugin)",
	detailLabel: "Mattermost Bot",
	docsPath: "/channels/mattermost",
	docsLabel: "mattermost",
	blurb: "self-hosted Slack-style chat; install the plugin to enable.",
	systemImage: "bubble.left.and.bubble.right",
	order: 65,
	quickstartAllowFrom: true
};
function normalizeMattermostAllowEntry(entry) {
	return normalizeLowercaseStringOrEmpty(entry.trim().replace(/^(mattermost|user):/i, "").replace(/^@/, ""));
}
function formatMattermostAllowEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed) return "";
	if (trimmed.startsWith("@")) {
		const username = trimmed.slice(1).trim();
		return username ? `@${normalizeLowercaseStringOrEmpty(username)}` : "";
	}
	return normalizeLowercaseStringOrEmpty(trimmed.replace(/^(mattermost|user):/i, ""));
}
const mattermostConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "mattermost",
	listAccountIds: listMattermostAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveMattermostAccount),
	inspectAccount: adaptScopedAccountAccessor(inspectMattermostAccount),
	defaultAccountId: resolveDefaultMattermostAccountId,
	clearBaseFields: [
		"botToken",
		"baseUrl",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatNormalizedAllowFromEntries({
		allowFrom,
		normalizeEntry: formatMattermostAllowEntry
	})
});
function describeMattermostAccount(account) {
	return describeAccountSnapshot({
		account,
		configured: isMattermostConfigured$1(account),
		extra: {
			botTokenSource: account.botTokenSource,
			botTokenStatus: account.botTokenStatus,
			baseUrl: account.baseUrl
		}
	});
}
//#endregion
//#region extensions/mattermost/src/channel-send-result.ts
function toMattermostOutboundResult(result) {
	const { channelId, ...delivery } = result;
	return {
		...delivery,
		target: {
			kind: "channel",
			id: channelId
		}
	};
}
function createMattermostDeliveryProgressReporter(onDeliveryResult) {
	return onDeliveryResult ? async (result) => {
		await onDeliveryResult(attachChannelToResult("mattermost", toMattermostOutboundResult(result)));
	} : void 0;
}
//#endregion
//#region extensions/mattermost/src/config-schema-core.ts
const MattermostGroupSchema = buildGroupEntrySchema().omit({
	tools: true,
	toolsBySender: true,
	skills: true,
	enabled: true,
	allowFrom: true,
	systemPrompt: true
});
function requireMattermostOpenAllowFrom(params) {
	requireOpenAllowFrom({
		policy: params.policy,
		allowFrom: params.allowFrom,
		ctx: params.ctx,
		path: ["allowFrom"],
		message: "channels.mattermost.dmPolicy=\"open\" requires channels.mattermost.allowFrom to include \"*\""
	});
}
const DmChannelRetrySchema = z.object({
	/** Maximum number of retry attempts for DM channel creation (default: 3) */
	maxRetries: z.number().int().min(0).max(10).optional(),
	/** Initial delay in milliseconds before first retry (default: 1000) */
	initialDelayMs: z.number().int().min(100).max(6e4).optional(),
	/** Maximum delay in milliseconds between retries (default: 10000) */
	maxDelayMs: z.number().int().min(1e3).max(6e4).optional(),
	/** Timeout for each individual DM channel creation request in milliseconds (default: 30000) */
	timeoutMs: z.number().int().min(5e3).max(12e4).optional()
}).strict().refine((data) => {
	if (data.initialDelayMs !== void 0 && data.maxDelayMs !== void 0) return data.initialDelayMs <= data.maxDelayMs;
	return true;
}, {
	message: "initialDelayMs must be less than or equal to maxDelayMs",
	path: ["initialDelayMs"]
}).optional();
const MattermostSlashCommandsSchema = z.object({
	/** Enable native slash commands. "auto" resolves to false (opt-in). */
	native: z.union([z.boolean(), z.literal("auto")]).optional(),
	/** Also register skill-based commands. */
	nativeSkills: z.union([z.boolean(), z.literal("auto")]).optional(),
	/** Path for the callback endpoint on the gateway HTTP server. */
	callbackPath: z.string().optional(),
	/** Explicit callback URL (e.g. behind reverse proxy). */
	callbackUrl: z.string().optional()
}).strict().optional();
const MattermostNetworkSchema = z.object({ 
/** Dangerous opt-in for self-hosted Mattermost on trusted private/internal hosts. */
dangerouslyAllowPrivateNetwork: z.boolean().optional() }).strict().optional();
const MattermostStreamingModeSchema = z.enum([
	"off",
	"partial",
	"block",
	"progress"
]);
const MattermostStreamingProgressSchema = z.object({
	label: z.union([z.string(), z.literal(false)]).optional(),
	labels: z.array(z.string()).optional(),
	maxLines: z.number().int().positive().optional(),
	maxLineChars: z.number().int().positive().optional(),
	toolProgress: z.boolean().optional(),
	commandText: z.enum(["raw", "status"]).optional()
}).strict();
const MattermostStreamingPreviewSchema = z.object({
	toolProgress: z.boolean().optional(),
	commandText: z.enum(["raw", "status"]).optional()
}).strict();
const MattermostStreamingBlockSchema = z.object({
	enabled: z.boolean().optional(),
	coalesce: BlockStreamingCoalesceSchema.optional()
}).strict();
const MattermostStreamingSchema = z.object({
	mode: MattermostStreamingModeSchema.optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	preview: MattermostStreamingPreviewSchema.optional(),
	progress: MattermostStreamingProgressSchema.optional(),
	block: MattermostStreamingBlockSchema.optional()
}).strict();
const MattermostReplyToModeSchema = z.enum([
	"off",
	"first",
	"all",
	"batched"
]);
const MattermostReplyToModeByChatTypeSchema = z.object({
	direct: MattermostReplyToModeSchema.optional(),
	group: MattermostReplyToModeSchema.optional(),
	channel: MattermostReplyToModeSchema.optional()
}).strict();
const MattermostAccountSchemaBase = z.object({
	name: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	dangerouslyAllowNameMatching: z.boolean().optional(),
	markdown: MarkdownConfigSchema,
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	contextVisibility: ContextVisibilityModeSchema.optional(),
	historyLimit: z.number().int().min(0).optional(),
	mediaMaxMb: z.number().positive().optional(),
	botToken: buildSecretInputSchema().optional(),
	baseUrl: z.string().optional(),
	chatmode: z.enum([
		"oncall",
		"onmessage",
		"onchar"
	]).optional(),
	oncharPrefixes: z.array(z.string()).optional(),
	requireMention: z.boolean().optional(),
	implicitMentions: ChannelImplicitMentionsSchema.optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	textChunkLimit: z.number().int().positive().optional(),
	streaming: MattermostStreamingSchema.optional(),
	replyToMode: MattermostReplyToModeSchema.optional(),
	replyToModeByChatType: MattermostReplyToModeByChatTypeSchema.optional(),
	responsePrefix: z.string().optional(),
	actions: z.object({
		messages: z.boolean().optional(),
		reactions: z.boolean().optional()
	}).optional(),
	commands: MattermostSlashCommandsSchema,
	interactions: z.object({
		callbackBaseUrl: z.string().optional(),
		allowedSourceIps: z.array(z.string()).optional()
	}).optional(),
	/** Per-group configuration (keyed by Mattermost channel ID or "*" for default). */
	groups: z.record(z.string(), MattermostGroupSchema.optional()).optional(),
	/** Network policy overrides for self-hosted Mattermost on trusted private/internal hosts. */
	network: MattermostNetworkSchema,
	/** Retry configuration for DM channel creation */
	dmChannelRetry: DmChannelRetrySchema
}).strict();
const MattermostConfigSchema = buildMultiAccountChannelSchema(MattermostAccountSchemaBase, {
	optionalAccount: true,
	refine: (value, ctx) => {
		requireMattermostOpenAllowFrom({
			policy: value.dmPolicy,
			allowFrom: value.allowFrom,
			ctx
		});
	}
});
//#endregion
//#region extensions/mattermost/src/config-ui-hints.ts
const mattermostChannelConfigUiHints = {
	"": {
		label: "Mattermost",
		help: "Mattermost channel provider configuration for bot auth, access policy, slash commands, and preview streaming."
	},
	...createChannelConfigUiHints({
		channelLabel: "Mattermost",
		dmPolicy: { channelKey: "mattermost" },
		implicitMentions: true,
		streaming: {
			"": "Unified Mattermost stream preview mode: \"off\" | \"partial\" | \"block\" | \"progress\". \"progress\" keeps a single editable progress draft until final delivery.",
			mode: "Canonical Mattermost preview mode: \"off\" | \"partial\" | \"block\" | \"progress\".",
			"block.enabled": "Enable chunked block-style Mattermost preview delivery when channels.mattermost.streaming.mode=\"block\".",
			"block.coalesce": "Merge streamed Mattermost block replies before final delivery.",
			"preview.toolProgress": "Show tool/progress activity in the live draft preview post (default: true). Set false to hide interim tool updates while the draft preview stays active.",
			"preview.commandText": "Command/exec detail in preview tool-progress lines: \"status\" is the safe default; \"raw\" opts into command text."
		},
		progress: {}
	})
};
//#endregion
//#region extensions/mattermost/src/config-surface.ts
const MattermostChannelConfigSchema = buildChannelConfigSchema(MattermostConfigSchema, { uiHints: mattermostChannelConfigUiHints });
//#endregion
//#region extensions/mattermost/src/doctor.ts
const isMattermostMutableAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:(?:mattermost|user):)?@?[a-z0-9]{26}$/i });
const collectMattermostMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "mattermost",
	detector: isMattermostMutableAllowEntry,
	collectLists: (scope) => collectStandardAllowlistLists(scope)
});
const mattermostDoctor = {
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectMutableAllowlistWarnings: collectMattermostMutableAllowlistWarnings
};
//#endregion
//#region extensions/mattermost/src/group-mentions.ts
function resolveMattermostGroupRequireMention(params) {
	const account = resolveMattermostAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return resolveScopeRequireMention({
		tree: buildChannelGroupsScopeTree(params.cfg, "mattermost", params.accountId),
		path: params.groupId ? [params.groupId] : [],
		requireMentionOverride: params.requireMentionOverride ?? account.requireMention,
		overrideOrder: "after-config"
	});
}
//#endregion
//#region extensions/mattermost/src/mattermost/emoji.ts
const MATTERMOST_EMOJI_SHORTNAME_BY_GLYPH = {
	"✅": "white_check_mark",
	"❌": "x",
	"👍": "thumbsup",
	"👎": "thumbsdown",
	"🎉": "tada",
	"❤": "heart",
	"😄": "smile",
	"😂": "joy",
	"🚀": "rocket",
	"👀": "eyes",
	"🙏": "pray",
	"🔥": "fire",
	"💯": "100",
	"⚠": "warning",
	"➕": "heavy_plus_sign",
	"➖": "heavy_minus_sign",
	"🤔": "thinking_face",
	"⚡": "zap",
	"🌐": "globe_with_meridians",
	"😱": "scream",
	"🧠": "brain",
	"💻": "computer",
	"👋": "wave",
	"🙌": "raised_hands"
};
const MATTERMOST_EMOJI_TONE_CAPABLE_NAMES = /* @__PURE__ */ new Set([
	"thumbsup",
	"thumbsdown",
	"pray",
	"wave",
	"raised_hands"
]);
const MATTERMOST_EMOJI_TONE_SUFFIX_BY_MODIFIER = /* @__PURE__ */ new Map([
	["🏻", "light_skin_tone"],
	["🏼", "medium_light_skin_tone"],
	["🏽", "medium_skin_tone"],
	["🏾", "medium_dark_skin_tone"],
	["🏿", "dark_skin_tone"]
]);
const EMOJI_SKIN_TONE_MODIFIER_RE = /[\u{1F3FB}-\u{1F3FF}]/gu;
const EMOJI_VARIATION_SELECTOR_RE = /[\u{FE00}-\u{FE0F}]/gu;
function normalizeMattermostEmojiName(raw) {
	const withoutColons = raw?.trim().replace(/^:+|:+$/g, "");
	if (!withoutColons) return;
	const toneModifier = withoutColons.match(EMOJI_SKIN_TONE_MODIFIER_RE)?.[0];
	const glyphKey = withoutColons.replace(EMOJI_SKIN_TONE_MODIFIER_RE, "").replace(EMOJI_VARIATION_SELECTOR_RE, "");
	const shortname = Object.hasOwn(MATTERMOST_EMOJI_SHORTNAME_BY_GLYPH, glyphKey) ? MATTERMOST_EMOJI_SHORTNAME_BY_GLYPH[glyphKey] : void 0;
	if (shortname === void 0) return withoutColons;
	const toneSuffix = toneModifier ? MATTERMOST_EMOJI_TONE_SUFFIX_BY_MODIFIER.get(toneModifier) : void 0;
	if (!toneSuffix || !MATTERMOST_EMOJI_TONE_CAPABLE_NAMES.has(shortname)) return shortname;
	return `${shortname}_${toneSuffix}`;
}
//#endregion
//#region extensions/mattermost/src/session-route.ts
/**
* Reads the peer chat-kind already recorded for `peerId` in an agent session
* key. Agent session keys are
* `agent:<agentId>:mattermost:<direct|group|channel>:<peerId>[:thread:...]`, so
* the segment right after `mattermost:` is the authoritative inbound chat kind.
*/
function mattermostSessionKeyPeerKind(sessionKey, peerId) {
	if (!sessionKey || !peerId) return;
	const match = /^agent:[^:]+:mattermost:(direct|group|channel):([^:]+)(?::thread:[^:]+)?$/i.exec(sessionKey);
	const kind = match?.[1]?.toLowerCase();
	if (!kind || match?.[2] !== peerId) return;
	return kind;
}
function resolveMattermostOutboundSessionRoute(params) {
	let trimmed = stripChannelTargetPrefix(params.target, "mattermost");
	if (!trimmed) return null;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const resolvedKind = params.resolvedTarget?.kind;
	const isUser = resolvedKind === "user" || resolvedKind !== "channel" && resolvedKind !== "group" && (lower.startsWith("user:") || trimmed.startsWith("@"));
	if (trimmed.startsWith("@")) trimmed = trimmed.slice(1).trim();
	const rawId = stripTargetKindPrefix(trimmed);
	if (!rawId) return null;
	const hasExplicitUserKind = resolvedKind === "user" || lower.startsWith("user:");
	const recipientSessionExact = isUser && hasExplicitUserKind && /^[a-z0-9]{26}$/.test(rawId);
	const isGroup = !isUser && (resolvedKind === "group" || resolvedKind !== "channel" && (lower.startsWith("group:") || mattermostSessionKeyPeerKind(params.currentSessionKey, rawId) === "group"));
	const kind = isUser ? "direct" : isGroup ? "group" : "channel";
	const baseRoute = buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "mattermost",
		accountId: params.accountId,
		recipientSessionExact,
		peer: {
			kind,
			id: rawId
		},
		chatType: kind,
		from: isUser ? `mattermost:${rawId}` : `mattermost:${kind}:${rawId}`,
		to: isUser ? `user:${rawId}` : `channel:${rawId}`
	});
	return buildThreadAwareOutboundSessionRoute({
		route: baseRoute,
		replyToId: params.replyToId,
		threadId: params.threadId,
		currentSessionKey: params.currentSessionKey,
		canRecoverCurrentThread: ({ route }) => route.chatType !== "direct" || (params.cfg.session?.dmScope ?? "main") !== "main"
	});
}
//#endregion
//#region extensions/mattermost/src/setup-core.ts
const channel$1 = "mattermost";
function isMattermostConfigured(account) {
	return (Boolean(account.botToken?.trim()) || hasConfiguredSecretInput(account.config.botToken)) && Boolean(account.baseUrl);
}
function resolveMattermostAccountWithSecrets(cfg, accountId) {
	return inspectMattermostAccount({
		cfg,
		accountId
	});
}
function applyMattermostSetupConfigPatch(params) {
	const namedConfig = applyAccountNameToChannelSection({
		cfg: params.cfg,
		channelKey: channel$1,
		accountId: params.accountId,
		name: params.name
	});
	const next = params.accountId !== DEFAULT_ACCOUNT_ID ? migrateBaseNameToDefaultAccount({
		cfg: namedConfig,
		channelKey: channel$1
	}) : namedConfig;
	return applySetupAccountConfigPatch({
		cfg: next,
		channelKey: channel$1,
		accountId: params.accountId,
		patch: params.patch
	});
}
const accountCredentialKeys = ["botToken", "baseUrl"];
const mattermostSetupAdapter = {
	singleAccountKeysToMove: accountCredentialKeys,
	namedAccountPromotionKeys: accountCredentialKeys,
	resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
	applyAccountName: ({ cfg, accountId, name }) => applyAccountNameToChannelSection({
		cfg,
		channelKey: channel$1,
		accountId,
		name
	}),
	validateInput: createSetupInputPresenceValidator({
		defaultAccountOnlyEnvError: "Mattermost env vars can only be used for the default account.",
		whenNotUseEnv: [{
			someOf: ["botToken", "token"],
			message: "Mattermost requires --bot-token and --http-url (or --use-env)."
		}, {
			someOf: ["httpUrl"],
			message: "Mattermost requires --bot-token and --http-url (or --use-env)."
		}],
		validate: ({ input }) => {
			const setupInput = input;
			const token = setupInput.botToken ?? setupInput.token;
			const baseUrl = normalizeMattermostBaseUrl(setupInput.httpUrl);
			if (!setupInput.useEnv && (!token || !baseUrl)) return "Mattermost requires --bot-token and --http-url (or --use-env).";
			if (setupInput.httpUrl && !baseUrl) return "Mattermost --http-url must include a valid base URL.";
			return null;
		}
	}),
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const setupInput = input;
		const token = setupInput.botToken ?? setupInput.token;
		const baseUrl = normalizeMattermostBaseUrl(setupInput.httpUrl);
		return applyMattermostSetupConfigPatch({
			cfg,
			accountId,
			name: setupInput.name,
			patch: setupInput.useEnv ? {} : {
				...token ? { botToken: token } : {},
				...baseUrl ? { baseUrl } : {}
			}
		});
	}
};
const mattermostSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Mattermost bot token"
			}
		},
		botToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--bot-token <token>",
				description: "Mattermost bot token"
			}
		},
		httpUrl: {
			kind: "string",
			cli: {
				flags: "--http-url <url>",
				description: "Mattermost server URL"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Mattermost environment credentials"
			},
			envVars: ["MATTERMOST_BOT_TOKEN", "MATTERMOST_URL"]
		}
	},
	legacyAdapter: mattermostSetupAdapter
});
//#endregion
//#region extensions/mattermost/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "mattermost";
const mattermostSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Mattermost",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsTokenUrl"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsSetup"),
		configuredScore: 2,
		unconfiguredScore: 1,
		resolveConfigured: ({ cfg, accountId }) => isMattermostConfigured(resolveMattermostAccountWithSecrets(cfg, accountId ?? DEFAULT_ACCOUNT_ID))
	}),
	introNote: {
		title: t("wizard.mattermost.botTokenTitle"),
		lines: [
			t("wizard.mattermost.helpOpenConsole"),
			t("wizard.mattermost.helpCreateBot"),
			t("wizard.mattermost.helpBaseUrl"),
			t("wizard.mattermost.helpBotMember"),
			t("wizard.channels.docs", { link: formatDocsLink("/mattermost", "mattermost") })
		],
		shouldShow: ({ cfg, accountId }) => !isMattermostConfigured(resolveMattermostAccountWithSecrets(cfg, accountId))
	},
	envShortcut: {
		prompt: t("wizard.mattermost.envPrompt"),
		preferredEnvVar: "MATTERMOST_BOT_TOKEN",
		isAvailable: ({ cfg, accountId }) => {
			if (accountId !== DEFAULT_ACCOUNT_ID) return false;
			const resolvedAccount = resolveMattermostAccountWithSecrets(cfg, accountId);
			const hasConfigValues = hasConfiguredSecretInput(resolvedAccount.config.botToken) || Boolean(resolvedAccount.config.baseUrl?.trim());
			return Boolean(process.env.MATTERMOST_BOT_TOKEN?.trim() && process.env.MATTERMOST_URL?.trim() && !hasConfigValues);
		},
		apply: ({ cfg, accountId }) => applySetupAccountConfigPatch({
			cfg,
			channelKey: channel,
			accountId,
			patch: {}
		})
	},
	credentials: [defineTokenCredential({
		inputKey: "botToken",
		configKey: "botToken",
		providerHint: channel,
		credentialLabel: t("wizard.mattermost.botToken"),
		preferredEnvVar: "MATTERMOST_BOT_TOKEN",
		envPrompt: t("wizard.mattermost.envPrompt"),
		keepPrompt: t("wizard.mattermost.botTokenKeep"),
		inputPrompt: t("wizard.mattermost.botTokenInput"),
		resolveAccount: ({ cfg, accountId }) => resolveMattermostAccountWithSecrets(cfg, accountId),
		accountConfigured: isMattermostConfigured,
		patchAccount: ({ cfg, accountId, patch }) => applyMattermostSetupConfigPatch({
			cfg,
			accountId,
			patch
		}),
		set: {}
	})],
	textInputs: [baseUrlTextInput({
		inputKey: "httpUrl",
		configKey: "baseUrl",
		message: t("wizard.mattermost.baseUrlPrompt"),
		confirmCurrentValue: false,
		resolveAccount: ({ cfg, accountId }) => resolveMattermostAccountWithSecrets(cfg, accountId),
		currentValue: (account) => account.baseUrl ?? process.env.MATTERMOST_URL?.trim(),
		includeInitialValue: true,
		shouldPrompt: ({ cfg, accountId, credentialValues, currentValue }) => {
			const resolvedAccount = resolveMattermostAccountWithSecrets(cfg, accountId);
			const tokenConfigured = Boolean(resolvedAccount.botToken?.trim()) || hasConfiguredSecretInput(resolvedAccount.config.botToken);
			return Boolean(credentialValues.botToken) || !tokenConfigured || !currentValue;
		},
		validate: (value) => normalizeMattermostBaseUrl(value) ? void 0 : "Mattermost base URL must include a valid base URL.",
		normalize: (value) => normalizeMattermostBaseUrl(value) ?? value.trim(),
		patchAccount: ({ cfg, accountId, patch }) => applyMattermostSetupConfigPatch({
			cfg,
			accountId,
			patch
		})
	})],
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
//#region extensions/mattermost/src/channel.ts
const loadMattermostChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-CihvzY84.mjs"));
const MATTERMOST_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: false,
	context: true,
	divider: false,
	limits: { text: { markdownDialect: "markdown" } }
};
function hasMattermostPresentationNavigation(presentation) {
	return presentation.blocks.some((block) => block.type === "buttons" && block.buttons.some((button) => {
		const action = resolveMessagePresentationButtonAction(button);
		return action?.type === "url" || action?.type === "web-app" && Boolean(action.url);
	}));
}
function readMattermostPayloadData(payload) {
	const data = payload.channelData?.mattermost;
	return data && typeof data === "object" && !Array.isArray(data) ? data : void 0;
}
function readMattermostPresentationButtons(payload) {
	const buttons = readMattermostPayloadData(payload)?.presentationButtons;
	return Array.isArray(buttons) ? buttons : void 0;
}
const mattermostSecurityAdapter = createRestrictSendersChannelSecurity({
	channelKey: "mattermost",
	resolveDmPolicy: (account) => account.config.dmPolicy,
	resolveDmAllowFrom: (account) => account.config.allowFrom,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	surface: "Mattermost channels",
	openScope: "any member",
	groupPolicyPath: "channels.mattermost.groupPolicy",
	groupAllowFromPath: "channels.mattermost.groupAllowFrom",
	findingTitle: "Mattermost security warning",
	policyPathSuffix: "dmPolicy",
	classifyEntryAuthentication: identityEntryAuthenticationClassifier(mattermostIngressIdentity),
	normalizeDmEntry: (raw) => normalizeMattermostAllowEntry(raw)
});
function describeMattermostMessageTool({ cfg, accountId }) {
	const enabledAccounts = (accountId ? [inspectMattermostAccount({
		cfg,
		accountId
	})] : listMattermostAccountIds(cfg).map((listedAccountId) => inspectMattermostAccount({
		cfg,
		accountId: listedAccountId
	}))).filter((account) => account.enabled).filter((account) => Boolean(account.botToken?.trim() && account.baseUrl?.trim()));
	const actions = [];
	if (enabledAccounts.length > 0) actions.push("send");
	const actionsConfig = cfg.channels?.mattermost?.actions;
	const baseMessages = actionsConfig?.messages;
	const baseReactions = actionsConfig?.reactions;
	if (enabledAccounts.some((account) => {
		return account.config.actions?.reactions ?? baseReactions ?? true;
	})) actions.push("react");
	if (enabledAccounts.some((account) => account.config.actions?.messages ?? baseMessages ?? false)) actions.push("read");
	return {
		actions,
		capabilities: enabledAccounts.length > 0 ? ["presentation"] : []
	};
}
function hasConfiguredMattermostDirectoryAccount({ cfg, accountId }) {
	return (accountId ? [inspectMattermostAccount({
		cfg,
		accountId
	})] : listMattermostAccountIds(cfg).map((listedAccountId) => inspectMattermostAccount({
		cfg,
		accountId: listedAccountId
	}))).some((account) => Boolean(account.enabled && account.botToken?.trim() && account.baseUrl?.trim()));
}
function extractMattermostToolSend(args) {
	if (normalizeOptionalString(args.action) !== "send") return null;
	const to = normalizeOptionalString(args.to) ?? normalizeOptionalString(args.target);
	if (!to) return null;
	const threadId = normalizeOptionalString(args.threadId) ?? normalizeOptionalString(args.replyToId) ?? normalizeOptionalString(args.replyTo);
	const threadSuppressed = args.topLevel === true || args.threadId === null;
	return {
		to,
		accountId: normalizeOptionalString(args.accountId),
		...threadId ? { threadId } : {},
		...!threadId && !threadSuppressed ? { threadImplicit: true } : {},
		...threadSuppressed ? { threadSuppressed: true } : {}
	};
}
function resolveMattermostAutoThreadId(params) {
	const replyToId = normalizeOptionalString(params.replyToId);
	const context = params.toolContext;
	const currentThreadId = normalizeOptionalString(context?.currentThreadTs);
	const currentMessageId = typeof context?.currentMessageId === "number" ? String(context.currentMessageId) : normalizeOptionalString(context?.currentMessageId);
	const currentTarget = normalizeMattermostThreadTarget(context?.currentChannelId);
	if (currentThreadId && currentTarget === normalizeMattermostThreadTarget(params.to)) {
		if (replyToId === currentMessageId) return currentThreadId;
		if (!replyToId) {
			const replyToMode = context?.replyToMode;
			return replyToMode === "all" || replyToMode === "first" && context?.hasRepliedRef?.value !== true ? currentThreadId : void 0;
		}
	}
	return replyToId;
}
function normalizeMattermostThreadTarget(raw) {
	const normalized = raw ? normalizeMattermostMessagingTarget(raw) : void 0;
	if (normalized) return normalized;
	const trimmed = normalizeOptionalString(raw);
	return trimmed && /^[a-z0-9]{26}$/i.test(trimmed) ? `channel:${trimmed}` : void 0;
}
function matchesMattermostToolContextTarget(params) {
	const target = normalizeMattermostThreadTarget(params.target);
	if (!target) return false;
	return [params.toolContext.currentChannelId, params.toolContext.currentMessagingTarget].some((currentTarget) => normalizeMattermostThreadTarget(currentTarget) === target);
}
function normalizeMattermostThreadId(value) {
	return typeof value === "number" ? String(value) : normalizeOptionalString(value);
}
function buildMattermostThreadingToolContext(params) {
	const account = resolveMattermostAccount({
		cfg: params.cfg,
		accountId: params.accountId ?? resolveDefaultMattermostAccountId(params.cfg)
	});
	const chatType = params.context.ChatType === "direct" || params.context.ChatType === "group" || params.context.ChatType === "channel" ? params.context.ChatType : "channel";
	const configuredReplyToMode = resolveMattermostReplyToMode(account, chatType);
	const currentThreadTs = normalizeMattermostThreadId(params.context.MessageThreadId) ?? normalizeMattermostThreadId(params.context.TransportThreadId) ?? normalizeOptionalString(params.context.ReplyToId);
	const currentMessageId = normalizeMattermostThreadId(params.context.CurrentMessageId);
	const hasExistingThread = Boolean(currentThreadTs) && (!currentMessageId || currentThreadTs !== currentMessageId);
	return {
		currentChannelId: params.context.To ? normalizeMattermostMessagingTarget(params.context.To) : void 0,
		currentThreadTs,
		currentMessageId: params.context.CurrentMessageId,
		replyToMode: hasExistingThread ? "all" : configuredReplyToMode,
		hasRepliedRef: params.hasRepliedRef,
		sameChannelThreadRequired: Boolean(currentThreadTs)
	};
}
async function listMattermostDirectoryGroups(params) {
	if (!hasConfiguredMattermostDirectoryAccount(params)) return [];
	return (await loadMattermostChannelRuntime()).listMattermostDirectoryGroups(params);
}
async function listMattermostDirectoryPeers(params) {
	if (!hasConfiguredMattermostDirectoryAccount(params)) return [];
	return (await loadMattermostChannelRuntime()).listMattermostDirectoryPeers(params);
}
const mattermostMessageActions = {
	providerOwnedReadGates: ["read"],
	readAuthorityActions: ["read"],
	describeMessageTool: describeMattermostMessageTool,
	extractToolSend: ({ args }) => extractMattermostToolSend(args),
	prepareSendPayload: ({ ctx, payload }) => {
		if (ctx.action !== "send") return null;
		const mediaUrl = resolveMattermostSendAttachmentMedia(ctx.params);
		const attachmentText = typeof ctx.params.attachmentText === "string" ? ctx.params.attachmentText : void 0;
		const existingMattermostData = readMattermostPayloadData(payload);
		return {
			...payload,
			...mediaUrl ? {
				mediaUrl,
				mediaUrls: [mediaUrl]
			} : {},
			...attachmentText !== void 0 ? { channelData: {
				...payload.channelData,
				mattermost: {
					...existingMattermostData,
					attachmentText
				}
			} } : {}
		};
	},
	supportsAction: ({ action }) => {
		return action === "react" || action === "read";
	},
	handleAction: async ({ action, params, cfg, accountId, conversationReadOrigin, requesterAccountId, toolContext }) => {
		if (action === "read") {
			const resolvedAccountId = accountId ?? resolveDefaultMattermostAccountId(cfg);
			const mattermostConfig = cfg.channels?.mattermost;
			const account = resolveMattermostAccount({
				cfg,
				accountId: resolvedAccountId
			});
			if (!account.enabled) throw new Error(`Mattermost account "${resolvedAccountId}" is disabled`);
			if (!(account.config.actions?.messages ?? mattermostConfig?.actions?.messages ?? false)) throw new Error("Mattermost message reads are disabled in config");
			const rawTarget = readStringParam(params, "to") ?? readStringParam(params, "channelId") ?? readStringParam(params, "target");
			if (!rawTarget) throw new Error("Mattermost read requires target, to, or channelId.");
			const normalizedTarget = normalizeMattermostMessagingTarget(rawTarget);
			const channelId = normalizedTarget?.startsWith("channel:") ? normalizedTarget.slice(8).trim() : !rawTarget.includes(":") ? rawTarget : "";
			if (!channelId) throw new Error("Mattermost read requires a channel target.");
			const before = readStringParam(params, "before");
			const after = readStringParam(params, "after");
			if (before && after) throw new Error("Mattermost read accepts either before or after, not both.");
			const result = await (await loadMattermostChannelRuntime()).readMattermostMessages({
				cfg,
				channelId,
				limit: readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." }),
				before,
				after,
				accountId: resolvedAccountId,
				context: {
					conversationReadOrigin,
					requesterAccountId,
					toolContext
				}
			});
			return jsonResult({
				ok: true,
				channelId,
				messages: result.messages.map((message) => withNormalizedTimestamp(message, message.create_at)),
				hasMore: result.hasMore
			});
		}
		if (action === "react") {
			const resolvedAccountId = accountId ?? resolveDefaultMattermostAccountId(cfg);
			const mattermostConfig = cfg.channels?.mattermost;
			const account = resolveMattermostAccount({
				cfg,
				accountId: resolvedAccountId
			});
			if (!account.enabled) throw new Error(`Mattermost account "${resolvedAccountId}" is disabled`);
			if (!(account.config.actions?.reactions ?? mattermostConfig?.actions?.reactions ?? true)) throw new Error("Mattermost reactions are disabled in config");
			const { postId, emojiName, remove } = parseMattermostReactActionParams(params);
			const authorizedTarget = normalizeOptionalString(params.to);
			const runtime = await loadMattermostChannelRuntime();
			const result = await (remove ? runtime.removeMattermostReaction : runtime.addMattermostReaction)({
				cfg,
				postId,
				emojiName,
				accountId: resolvedAccountId,
				authorizedTarget,
				conversationReadOrigin
			});
			if (!result.ok) throw new Error(result.error);
			return {
				content: [{
					type: "text",
					text: remove ? `Removed reaction :${emojiName}: from ${postId}` : `Reacted with :${emojiName}: on ${postId}`
				}],
				details: {}
			};
		}
		throw new Error(`Unsupported Mattermost action: ${action}`);
	}
};
function parseMattermostReactActionParams(params) {
	const postId = normalizeOptionalString(params.messageId) ?? normalizeOptionalString(params.postId);
	if (!postId) throw new Error("Mattermost react requires messageId (post id)");
	const emojiName = normalizeMattermostEmojiName(normalizeOptionalString(params.emoji));
	if (!emojiName) throw new Error("Mattermost react requires emoji");
	return {
		postId,
		emojiName,
		remove: params.remove === true
	};
}
function resolveMattermostSendAttachmentMedia(params) {
	const sourceKeys = [
		"media",
		"mediaUrl",
		"path",
		"filePath",
		"fileUrl"
	];
	const candidates = sourceKeys.map((key) => readStringParam(params, key));
	candidates.push(...readStringArrayParam(params, "mediaUrls") ?? []);
	let hasUnsupportedAttachmentPayload = Boolean(readStringParam(params, "buffer") ?? readStringParam(params, "base64"));
	if (Array.isArray(params.attachments)) for (const attachment of params.attachments) {
		if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) continue;
		const record = attachment;
		candidates.push(...sourceKeys.map((key) => readStringParam(record, key)));
		candidates.push(readStringParam(record, "url"));
		hasUnsupportedAttachmentPayload ||= Boolean(readStringParam(record, "buffer") ?? readStringParam(record, "base64"));
	}
	if (hasUnsupportedAttachmentPayload) throw new Error("Mattermost send attachments require media, mediaUrl, path, filePath, fileUrl, mediaUrls, or attachments[] with one of those fields; buffer/base64 payloads are not supported.");
	const mediaUrls = [...new Set(candidates.filter((candidate) => Boolean(candidate)))];
	if (mediaUrls.length > 1) throw new Error("Mattermost send supports one attachment per message; split multiple mediaUrls or attachments[] entries into separate sends.");
	return mediaUrls[0];
}
const mattermostOutbound = {
	deliveryMode: "direct",
	chunker: chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: 4e3,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		payload: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true
	} },
	presentationCapabilities: MATTERMOST_PRESENTATION_CAPABILITIES,
	renderPresentation: ({ payload, presentation }) => {
		if (payload.mediaUrls && payload.mediaUrls.length > 1) return null;
		const { text, buttons } = resolveMattermostPresentation({
			text: payload.text,
			presentation,
			channelData: payload.channelData
		});
		if (!buttons.length && !hasMattermostPresentationNavigation(presentation)) return null;
		return {
			...payload,
			text,
			...buttons.length ? { channelData: {
				...payload.channelData,
				mattermost: {
					...payload.channelData?.mattermost,
					presentationButtons: buttons
				}
			} } : {}
		};
	},
	sendPayload: async (ctx) => {
		const buttons = readMattermostPresentationButtons(ctx.payload);
		const rawAttachmentText = readMattermostPayloadData(ctx.payload)?.attachmentText;
		const attachmentText = typeof rawAttachmentText === "string" ? rawAttachmentText : void 0;
		if (buttons?.length || attachmentText !== void 0) {
			const mediaUrl = resolvePayloadMediaUrls({
				...ctx.payload,
				mediaUrl: ctx.payload.mediaUrl ?? ctx.mediaUrl
			}).map((url) => url.trim()).find(Boolean);
			const result = await (await loadMattermostChannelRuntime()).sendMessageMattermost(ctx.to, ctx.payload.text ?? ctx.text, {
				cfg: ctx.cfg,
				accountId: ctx.accountId ?? void 0,
				mediaUrl,
				mediaLocalRoots: ctx.mediaLocalRoots ?? ctx.mediaAccess?.localRoots,
				mediaReadFile: ctx.mediaReadFile ?? ctx.mediaAccess?.readFile,
				...ctx.mediaAccess?.workspaceDir ? { workspaceDir: ctx.mediaAccess.workspaceDir } : {},
				requireMediaUpload: requiresMattermostMediaUpload(mediaUrl) ? true : void 0,
				replyToId: ctx.replyToId ?? (ctx.threadId != null ? String(ctx.threadId) : void 0),
				buttons: buttons?.length ? buttons : void 0,
				attachmentText,
				assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
				onPlatformSendDispatch: ctx.onPlatformSendDispatch,
				onDeliveryResult: createMattermostDeliveryProgressReporter(ctx.onDeliveryResult)
			});
			return attachChannelToResult("mattermost", toMattermostOutboundResult(result));
		}
		return await sendTextMediaPayload({
			channel: "mattermost",
			ctx,
			adapter: mattermostOutbound
		});
	},
	resolveTarget: ({ to }) => {
		const trimmed = to?.trim();
		if (!trimmed) return {
			ok: false,
			error: /* @__PURE__ */ new Error("Delivering to Mattermost requires --to <channelId|@username|user:ID|channel:ID>")
		};
		return {
			ok: true,
			to: trimmed
		};
	},
	...createAttachedChannelResultAdapter({
		channel: "mattermost",
		sendText: async (ctx) => toMattermostOutboundResult(await (await loadMattermostChannelRuntime()).sendMessageMattermost(ctx.to, ctx.text, {
			cfg: ctx.cfg,
			accountId: ctx.accountId ?? void 0,
			replyToId: ctx.replyToId ?? (ctx.threadId != null ? String(ctx.threadId) : void 0),
			assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
			onPlatformSendDispatch: ctx.onPlatformSendDispatch,
			onDeliveryResult: createMattermostDeliveryProgressReporter(ctx.onDeliveryResult)
		})),
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, accountId, replyToId, threadId, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) => toMattermostOutboundResult(await (await loadMattermostChannelRuntime()).sendMessageMattermost(to, text, {
			cfg,
			accountId: accountId ?? void 0,
			mediaUrl,
			mediaLocalRoots: mediaLocalRoots ?? mediaAccess?.localRoots,
			mediaReadFile: mediaReadFile ?? mediaAccess?.readFile,
			...mediaAccess?.workspaceDir ? { workspaceDir: mediaAccess.workspaceDir } : {},
			requireMediaUpload: requiresMattermostMediaUpload(mediaUrl) ? true : void 0,
			replyToId: replyToId ?? (threadId != null ? String(threadId) : void 0),
			assertDirectAdapterHandoff,
			onPlatformSendDispatch,
			onDeliveryResult: createMattermostDeliveryProgressReporter(onDeliveryResult)
		}))
	})
};
const mattermostMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "mattermost",
	outbound: mattermostOutbound,
	live: {
		capabilities: {
			draftPreview: true,
			previewFinalization: true,
			progressUpdates: true
		},
		finalizer: { capabilities: {
			finalEdit: true,
			normalFallback: true,
			discardPending: true
		} }
	}
});
const mattermostPlugin = createChatChannelPlugin({
	base: {
		id: "mattermost",
		meta: { ...mattermostMeta },
		setupContract: mattermostSetupContract,
		setupWizard: mattermostSetupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"channel",
				"group",
				"thread"
			],
			reactions: true,
			threads: true,
			media: true,
			nativeCommands: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: {
			configPrefixes: ["channels.mattermost"],
			noopPrefixes: ["messages.inbound"],
			/**
			* accounts.default is promoted; named resolution merges only channel-wide fields
			* plus the selected account. Monitor debounce and durable ingress use accountId.
			*/
			accountScopedRestart: true
		},
		configSchema: MattermostChannelConfigSchema,
		config: {
			...mattermostConfigAdapter,
			isConfigured: isMattermostConfigured$1,
			describeAccount: describeMattermostAccount
		},
		approvalCapability: mattermostApprovalAuth,
		doctor: mattermostDoctor,
		groups: { resolveRequireMention: resolveMattermostGroupRequireMention },
		actions: mattermostMessageActions,
		message: mattermostMessageAdapter,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		directory: createChannelDirectoryAdapter({
			listGroups: listMattermostDirectoryGroups,
			listGroupsLive: listMattermostDirectoryGroups,
			listPeers: listMattermostDirectoryPeers,
			listPeersLive: listMattermostDirectoryPeers
		}),
		messaging: {
			targetPrefixes: ["mattermost"],
			directTargetStyle: "user-prefixed",
			targetIdComparison: "case-sensitive",
			defaultMarkdownTableMode: "off",
			normalizeTarget: normalizeMattermostMessagingTarget,
			inferTargetChatType: ({ to }) => {
				const target = normalizeMattermostMessagingTarget(to);
				if (!target) return;
				return target.startsWith("user:") || target.startsWith("@") ? "direct" : "channel";
			},
			resolveDeliveryTarget: ({ conversationId, parentConversationId }) => {
				const parent = parentConversationId?.trim();
				const child = conversationId.trim();
				return parent && parent !== child ? {
					to: `channel:${parent}`,
					threadId: child
				} : { to: normalizeMattermostMessagingTarget(`channel:${child}`) };
			},
			resolveOutboundSessionRoute: (params) => resolveMattermostOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeMattermostTargetId,
				hint: "<channelId|user:ID|channel:ID>",
				resolveTarget: async ({ cfg, accountId, input }) => {
					const resolved = await (await loadMattermostChannelRuntime()).resolveMattermostOpaqueTarget({
						input,
						cfg,
						accountId
					});
					if (!resolved) return null;
					return {
						to: resolved.to,
						kind: resolved.kind,
						source: "directory"
					};
				}
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$1, {
				connected: false,
				lastConnectedAt: null,
				lastDisconnect: null
			}),
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot, {
				botTokenSource: snapshot.botTokenSource ?? "none",
				connected: snapshot.connected ?? false,
				baseUrl: snapshot.baseUrl ?? null
			}),
			probeAccount: async ({ account, timeoutMs }) => {
				const token = account.botToken?.trim();
				const baseUrl = account.baseUrl?.trim();
				if (!token || !baseUrl) return {
					ok: false,
					error: "bot token or baseUrl missing"
				};
				return await (await loadMattermostChannelRuntime()).probeMattermost(baseUrl, token, timeoutMs, isPrivateNetworkOptInEnabled(account.config));
			},
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: Boolean(account.botToken && account.baseUrl),
				extra: {
					botTokenSource: account.botTokenSource,
					botTokenStatus: account.botTokenStatus,
					baseUrl: account.baseUrl,
					dmPolicy: account.config.dmPolicy ?? "pairing",
					connected: runtime?.connected ?? false,
					lastConnectedAt: runtime?.lastConnectedAt ?? null,
					lastDisconnect: runtime?.lastDisconnect ?? null
				}
			})
		}),
		gateway: {
			resolveGatewayAuthBypassPaths: resolveMattermostGatewayAuthBypassPaths,
			startAccount: async (ctx) => {
				const account = ctx.account;
				const statusSink = createAccountStatusSink({
					accountId: ctx.accountId,
					setStatus: ctx.setStatus
				});
				statusSink({
					baseUrl: account.baseUrl,
					botTokenSource: account.botTokenSource
				});
				ctx.log?.info(`[${account.accountId}] starting channel`);
				return (await loadMattermostChannelRuntime()).monitorMattermostProvider({
					botToken: account.botToken ?? void 0,
					baseUrl: account.baseUrl ?? void 0,
					accountId: account.accountId,
					config: ctx.cfg,
					runtime: ctx.runtime,
					abortSignal: ctx.abortSignal,
					statusSink
				});
			}
		}
	},
	pairing: { text: {
		idLabel: "mattermostUserId",
		message: "OpenClaw: your access has been approved.",
		normalizeAllowEntry: (entry) => normalizeMattermostAllowEntry(entry),
		notify: createLoggedPairingApprovalNotifier(({ id }) => `[mattermost] User ${id} approved for pairing`)
	} },
	threading: {
		buildToolContext: (params) => buildMattermostThreadingToolContext(params),
		scopedAccountReplyToMode: {
			resolveAccount: (cfg, accountId) => resolveMattermostAccount({
				cfg,
				accountId: accountId ?? resolveDefaultMattermostAccountId(cfg)
			}),
			resolveReplyToMode: (account, chatType) => resolveMattermostReplyToMode(account, chatType === "direct" || chatType === "group" || chatType === "channel" ? chatType : "channel")
		},
		resolveAutoThreadId: ({ to, replyToId, toolContext }) => resolveMattermostAutoThreadId({
			to,
			replyToId,
			toolContext
		}),
		matchesToolContextTarget: ({ target, toolContext }) => matchesMattermostToolContextTarget({
			target,
			toolContext
		}),
		resolveReplyTransport: ({ threadId, replyToId, replyToIsExplicit, replyDelivery }) => {
			const ambientThreadId = threadId != null ? String(threadId) : void 0;
			const isFlatDirect = replyDelivery?.chatType === "direct" && replyDelivery.replyToMode === "off";
			const resolvedThreadId = isFlatDirect ? void 0 : replyDelivery ? replyToIsExplicit ? replyToId ?? ambientThreadId : ambientThreadId ?? replyToId ?? void 0 : ambientThreadId ?? replyToId;
			return {
				replyToId: isFlatDirect ? null : resolvedThreadId,
				threadId: resolvedThreadId ?? null
			};
		}
	},
	security: mattermostSecurityAdapter,
	outbound: mattermostOutbound
});
//#endregion
export { describeMattermostAccount as a, MattermostChannelConfigSchema as i, mattermostSetupWizard as n, mattermostConfigAdapter as o, mattermostSetupContract as r, mattermostMeta as s, mattermostPlugin as t };
