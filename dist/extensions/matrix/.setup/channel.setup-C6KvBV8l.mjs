import { a as resolveMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { i as resolveMatrixAccount, r as resolveDefaultMatrixAccountId, t as listMatrixAccountIds } from "./accounts-iThMol10.mjs";
import { r as matrixSetupContract, t as createMatrixSetupWizardProxy } from "./setup-core-D2hMbIi3.mjs";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChannelConfigUiHints } from "openclaw/plugin-sdk/channel-core";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1 } from "openclaw/plugin-sdk/account-id";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
import { normalizeStringEntries as normalizeStringEntries$1 } from "openclaw/plugin-sdk/string-normalization-runtime";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { AllowFromListSchema, BlockStreamingCoalesceSchema, ContextVisibilityModeSchema, GroupPolicySchema, MarkdownConfigSchema, MentionPatternsPolicySchema, buildChannelConfigSchema, buildGroupEntrySchema, buildNestedDmConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
//#region extensions/matrix/src/matrix/monitor/allowlist.ts
function normalizeAllowList(list) {
	return normalizeStringEntries$1(list);
}
function normalizeMatrixUser(raw) {
	const value = (raw ?? "").trim();
	if (!value) return "";
	if (!value.startsWith("@") || !value.includes(":")) return normalizeLowercaseStringOrEmpty(value);
	return value;
}
function normalizeMatrixUserId(raw) {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) return "";
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("matrix:")) return normalizeMatrixUser(trimmed.slice(7));
	if (lowered.startsWith("user:")) return normalizeMatrixUser(trimmed.slice(5));
	return normalizeMatrixUser(trimmed);
}
function normalizeMatrixAllowListEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	if (trimmed === "*") return trimmed;
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("matrix:")) return `matrix:${normalizeMatrixUser(trimmed.slice(7))}`;
	if (lowered.startsWith("user:")) return `user:${normalizeMatrixUser(trimmed.slice(5))}`;
	return normalizeMatrixUser(trimmed);
}
function normalizeMatrixAllowList(list) {
	return normalizeAllowList(list).map((entry) => normalizeMatrixAllowListEntry(entry));
}
function resolveMatrixAllowListMatch(params) {
	const allowList = params.allowList;
	if (allowList.length === 0) return { allowed: false };
	if (allowList.includes("*")) return {
		allowed: true,
		matchKey: "*",
		matchSource: "wildcard"
	};
	const userId = normalizeMatrixUser(params.userId);
	const candidates = [
		{
			value: userId,
			source: "id"
		},
		{
			value: userId ? `matrix:${userId}` : "",
			source: "prefixed-id"
		},
		{
			value: userId ? `user:${userId}` : "",
			source: "prefixed-user"
		}
	];
	return resolveAllowlistMatchByCandidates({
		allowList,
		candidates
	});
}
//#endregion
//#region extensions/matrix/src/config-adapter.ts
const matrixConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "matrix",
	listAccountIds: listMatrixAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveMatrixAccount),
	resolveAccessorAccount: ({ cfg, accountId }) => resolveMatrixAccountConfig({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultMatrixAccountId,
	clearBaseFields: [
		"name",
		"homeserver",
		"network",
		"proxy",
		"userId",
		"accessToken",
		"password",
		"deviceId",
		"deviceName",
		"avatarUrl",
		"initialSyncLimit"
	],
	resolveAllowFrom: (account) => account.dm?.allowFrom,
	formatAllowFrom: (allowFrom) => normalizeMatrixAllowList(allowFrom)
});
//#endregion
//#region extensions/matrix/src/config-ui-hints.ts
const matrixChannelConfigUiHints = {
	joinIntro: {
		label: "Matrix Group Join Introduction",
		help: "Post one brief introduction when the bot joins an allowed group room (default: true). Account settings override the channel-wide setting."
	},
	...createChannelConfigUiHints({
		channelLabel: "Matrix",
		mentionPatterns: {
			targetDescription: "Matrix room IDs",
			policyNote: "Native Matrix mention evidence still triggers even when regex patterns are denied.",
			denyNote: "Native mention evidence still triggers."
		}
	}),
	allowBots: {
		label: "Matrix Allow Bot Messages",
		help: "Allow messages from other configured Matrix bot accounts to trigger replies (default: false). Set \"mentions\" to require a visible room mention."
	},
	botLoopProtection: {
		label: "Matrix Bot Loop Protection",
		help: "Sliding-window guard for accepted Matrix configured-bot loops. Default is enabled whenever allowBots lets configured bot messages reach dispatch."
	},
	"botLoopProtection.enabled": {
		label: "Matrix Bot Loop Protection Enabled",
		help: "Enable the bot-pair loop guard. Defaults to true when allowBots is true or \"mentions\", and false when configured bot messages are ignored."
	},
	"botLoopProtection.maxEventsPerWindow": {
		label: "Matrix Bot Loop Events per Window",
		help: "Maximum accepted bot-pair messages within the sliding window before suppression starts. Default: 20."
	},
	"botLoopProtection.windowSeconds": {
		label: "Matrix Bot Loop Window Seconds",
		help: "Sliding window length for counting bot-pair messages. Default: 60."
	},
	"botLoopProtection.cooldownSeconds": {
		label: "Matrix Bot Loop Cooldown Seconds",
		help: "How long to suppress the bot pair after it exceeds the budget. Default: 60."
	},
	dangerouslyAllowNameMatching: {
		label: "Matrix Display Name Matching",
		help: "Compatibility opt-in for resolving Matrix display names and joined room names in allowlists. Prefer full @user:server IDs and room IDs or aliases because names are mutable."
	},
	...createChannelConfigUiHints({
		channelLabel: "Matrix",
		progress: {}
	})
};
//#endregion
//#region extensions/matrix/src/config-schema.ts
const matrixActionSchema = z.object({
	reactions: z.boolean().optional(),
	messages: z.boolean().optional(),
	pins: z.boolean().optional(),
	profile: z.boolean().optional(),
	memberInfo: z.boolean().optional(),
	channelInfo: z.boolean().optional(),
	verification: z.boolean().optional()
}).optional();
const matrixThreadBindingsSchema = z.object({
	enabled: z.boolean().optional(),
	idleHours: z.number().nonnegative().optional(),
	maxAgeHours: z.number().nonnegative().optional(),
	spawnSessions: z.boolean().optional(),
	defaultSpawnContext: z.enum(["isolated", "fork"]).optional()
}).optional();
const matrixExecApprovalsSchema = z.object({
	enabled: z.union([z.boolean(), z.literal("auto")]).optional(),
	approvers: AllowFromListSchema,
	agentFilter: z.array(z.string()).optional(),
	sessionFilter: z.array(z.string()).optional(),
	target: z.enum([
		"dm",
		"channel",
		"both"
	]).optional()
}).optional();
const botLoopProtectionSchema = z.object({
	enabled: z.boolean().optional(),
	maxEventsPerWindow: z.number().int().positive().optional(),
	windowSeconds: z.number().int().positive().optional(),
	cooldownSeconds: z.number().int().positive().optional()
}).strict().optional();
const matrixRoomSchema = buildGroupEntrySchema({
	account: z.string().optional(),
	allowBots: z.union([z.boolean(), z.literal("mentions")]).optional(),
	botLoopProtection: botLoopProtectionSchema,
	autoReply: z.boolean().optional(),
	users: AllowFromListSchema
}).omit({
	toolsBySender: true,
	allowFrom: true
}).strict().optional();
const matrixNetworkSchema = z.object({ dangerouslyAllowPrivateNetwork: z.boolean().optional() }).strict().optional();
const matrixStreamingSchema = z.object({
	mode: z.enum([
		"partial",
		"quiet",
		"progress",
		"off"
	]).optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	block: z.object({
		enabled: z.boolean().optional(),
		coalesce: BlockStreamingCoalesceSchema.optional()
	}).strict().optional(),
	progress: z.object({
		label: z.union([z.string(), z.literal(false)]).optional(),
		labels: z.array(z.string()).optional(),
		maxLines: z.number().int().positive().optional(),
		maxLineChars: z.number().int().positive().optional(),
		toolProgress: z.boolean().optional(),
		commandText: z.enum(["raw", "status"]).optional()
	}).strict().optional(),
	preview: z.object({ toolProgress: z.boolean().optional() }).strict().optional()
}).strict();
const retiredMatrixAccountStreamingKeys = [
	"streamMode",
	"chunkMode",
	"blockStreaming",
	"blockStreamingCoalesce",
	"draftChunk"
];
function hasCanonicalMatrixAccountStreaming(account) {
	if (typeof account !== "object" || account === null || Array.isArray(account)) return true;
	if (retiredMatrixAccountStreamingKeys.some((key) => Object.hasOwn(account, key))) return false;
	if (!Object.hasOwn(account, "streaming")) return true;
	const streaming = account.streaming;
	return typeof streaming === "object" && streaming !== null && !Array.isArray(streaming);
}
const MatrixConfigSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	joinIntro: z.boolean().optional(),
	defaultAccount: z.string().optional(),
	accounts: z.record(z.string(), z.object({
		joinIntro: z.boolean().optional(),
		accessToken: buildSecretInputSchema().optional(),
		password: buildSecretInputSchema().optional()
	}).passthrough().refine(hasCanonicalMatrixAccountStreaming, { message: "flat or scalar streaming values are no longer supported; use streaming.* and run \"openclaw doctor --fix\"" })).optional(),
	markdown: MarkdownConfigSchema,
	homeserver: z.string().optional(),
	network: matrixNetworkSchema,
	proxy: z.string().optional(),
	userId: z.string().optional(),
	accessToken: buildSecretInputSchema().optional(),
	password: buildSecretInputSchema().optional(),
	deviceId: z.string().optional(),
	deviceName: z.string().optional(),
	avatarUrl: z.string().optional(),
	initialSyncLimit: z.number().optional(),
	encryption: z.boolean().optional(),
	allowlistOnly: z.boolean().optional(),
	dangerouslyAllowNameMatching: z.boolean().optional(),
	allowBots: z.union([z.boolean(), z.literal("mentions")]).optional(),
	botLoopProtection: botLoopProtectionSchema,
	groupPolicy: GroupPolicySchema.optional(),
	mentionPatterns: MentionPatternsPolicySchema.optional(),
	contextVisibility: ContextVisibilityModeSchema.optional(),
	streaming: matrixStreamingSchema.optional(),
	replyToMode: z.enum([
		"off",
		"first",
		"all",
		"batched"
	]).optional(),
	threadReplies: z.enum([
		"off",
		"inbound",
		"always"
	]).optional(),
	textChunkLimit: z.number().optional(),
	responsePrefix: z.string().optional(),
	ackReaction: z.string().optional(),
	ackReactionScope: z.enum([
		"group-mentions",
		"group-all",
		"direct",
		"all",
		"none",
		"off"
	]).optional(),
	reactionNotifications: z.enum(["off", "own"]).optional(),
	threadBindings: matrixThreadBindingsSchema,
	startupVerification: z.enum(["off", "if-unverified"]).optional(),
	startupVerificationCooldownHours: z.number().optional(),
	mediaMaxMb: z.number().optional(),
	historyLimit: z.number().int().min(0).optional(),
	autoJoin: z.enum([
		"always",
		"allowlist",
		"off"
	]).optional(),
	autoJoinAllowlist: AllowFromListSchema,
	groupAllowFrom: AllowFromListSchema,
	dm: buildNestedDmConfigSchema({
		sessionScope: z.enum(["per-user", "per-room"]).optional(),
		threadReplies: z.enum([
			"off",
			"inbound",
			"always"
		]).optional()
	}),
	execApprovals: matrixExecApprovalsSchema,
	groups: z.object({}).catchall(matrixRoomSchema).optional(),
	rooms: z.object({}).catchall(matrixRoomSchema).optional(),
	actions: matrixActionSchema
});
const MatrixChannelConfigSchema = buildChannelConfigSchema(MatrixConfigSchema, { uiHints: matrixChannelConfigUiHints });
const matrixPluginBase = {
	id: "matrix",
	meta: {
		id: "matrix",
		label: "Matrix",
		selectionLabel: "Matrix (plugin)",
		docsPath: "/channels/matrix",
		docsLabel: "matrix",
		blurb: "open protocol; configure a homeserver + access token.",
		order: 70,
		quickstartAllowFrom: true
	},
	setupWizard: createMatrixSetupWizardProxy(async () => ({ matrixSetupWizard: (await import("./setup-surface-BL3ha1l-.mjs").then((n) => n.t)).matrixSetupWizard })),
	setupContract: matrixSetupContract,
	capabilities: {
		chatTypes: [
			"direct",
			"group",
			"thread"
		],
		polls: true,
		reactions: true,
		threads: true,
		media: true
	},
	reload: {
		configPrefixes: ["channels.matrix"],
		noopPrefixes: ["messages.ackReactionScope"]
	},
	configSchema: MatrixChannelConfigSchema,
	config: {
		...matrixConfigAdapter,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: account.configured,
			extra: { baseUrl: account.homeserver }
		})
	}
};
const matrixSetupPlugin = {
	...matrixPluginBase,
	config: {
		...matrixPluginBase.config,
		hasConfiguredState: ({ cfg }) => resolveMatrixAccount({ cfg }).configured
	}
};
//#endregion
export { normalizeMatrixUserId as a, normalizeMatrixAllowList as i, matrixSetupPlugin as n, resolveMatrixAllowListMatch as o, DEFAULT_ACCOUNT_ID$1 as r, matrixPluginBase as t };
