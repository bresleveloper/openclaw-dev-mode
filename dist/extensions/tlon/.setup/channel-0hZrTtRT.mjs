import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-CfYeTj9o.mjs";
import { c as resolveTlonAccount, d as normalizeShip, i as tlonSetupContract, l as TLON_CLUB_ID_RE, m as resolveTlonOutboundTarget, n as createTlonSetupWizardBase, p as parseTlonTarget, s as listTlonAccountIds, u as formatTargetHint } from "./setup-core-B5UNhQkj.mjs";
import { buildChannelOutboundSessionRoute } from "openclaw/plugin-sdk/core";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { createHybridChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChannelConfigUiHints, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createChannelMessageAdapterFromOutbound, createRuntimeOutboundDelegates } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { chunkTextForOutbound, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { ChannelImplicitMentionsSchema, buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
// extensions/tlon/src/config-schema.ts
const TlonClubPolicySchema = z.enum([
	"approve-once",
	"approve-each",
	"disabled"
]);
const TlonClubRulesSchema = z.record(z.string().regex(TLON_CLUB_ID_RE), z.enum(["allow", "deny"]));
const ShipSchema = z.string().min(1);
const ChannelNestSchema = z.string().min(1);
const TlonChannelRuleSchema = z.object({
	mode: z.enum(["restricted", "open"]).optional(),
	allowedShips: z.array(ShipSchema).optional(),
	requireMentionInBotThreads: z.boolean().optional()
});
const TlonAuthorizationSchema = z.object({ channelRules: z.record(z.string(), TlonChannelRuleSchema).optional() });
const TlonNetworkSchema = z.object({ dangerouslyAllowPrivateNetwork: z.boolean().optional() }).strict().optional();
const tlonCommonConfigFields = {
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	mediaMaxMb: z.number().positive().optional(),
	ship: ShipSchema.optional(),
	url: z.string().optional(),
	code: z.string().optional(),
	network: TlonNetworkSchema,
	groupChannels: z.array(ChannelNestSchema).optional(),
	dmAllowlist: z.array(ShipSchema).optional(),
	clubPolicy: TlonClubPolicySchema.optional(),
	clubRules: TlonClubRulesSchema.optional(),
	groupInviteAllowlist: z.array(ShipSchema).optional(),
	autoDiscoverChannels: z.boolean().optional(),
	crossChannelCitations: z.boolean().optional(),
	showModelSignature: z.boolean().optional(),
	responsePrefix: z.string().optional(),
	requireMentionInBotThreads: z.boolean().optional(),
	implicitMentions: ChannelImplicitMentionsSchema.optional(),
	autoAcceptDmInvites: z.boolean().optional(),
	autoAcceptGroupInvites: z.boolean().optional(),
	ownerShip: ShipSchema.optional()
};
const TlonAccountSchema = z.object({ ...tlonCommonConfigFields });
const TlonConfigSchema = z.object({
	...tlonCommonConfigFields,
	historyLimit: z.number().int().min(0).optional(),
	authorization: TlonAuthorizationSchema.optional(),
	defaultAuthorizedShips: z.array(ShipSchema).optional(),
	accounts: z.record(z.string(), TlonAccountSchema).optional()
});
const botThreadMentionHint = {
	label: "Require Mention in Bot Threads",
	help: "Override mention gating when this account's ship authored the thread root. False allows unmentioned replies; true requires a mention even after the bot participates. Omit to preserve existing behavior. Sender authorization still applies."
};
const crossChannelCitationsHint = {
	label: "Tlon Cross-Channel Citations",
	help: "Expand citations of posts from other channels into agent context. False expands only citations of the channel a message was posted in; the owner's 1:1 DMs are exempt. Default: true."
};
const clubPolicyHint = {
	label: "Tlon Group DM Policy",
	help: "Default: approve-once. Enable each club once for automatic replies, require approval for every message with approve-each, or disable group DMs. Club authors and participants are unverified."
};
const clubRulesHint = {
	label: "Tlon Group DM Rules",
	help: "Club IDs mapped to allow or deny. Allow accepts unverified input delivered under that club ID with the agent's normal permitted tools; it does not authenticate participants or grant owner authority. Deny blocks the club, not a claimed ship. Approve-each still requires each message; disabled overrides all rules."
};
const tlonChannelConfigSchema = buildChannelConfigSchema(TlonConfigSchema, { uiHints: {
	...createChannelConfigUiHints({
		channelLabel: "Tlon",
		implicitMentions: true
	}),
	requireMentionInBotThreads: botThreadMentionHint,
	"accounts.*.requireMentionInBotThreads": botThreadMentionHint,
	"authorization.channelRules.*.requireMentionInBotThreads": botThreadMentionHint,
	clubPolicy: clubPolicyHint,
	"accounts.*.clubPolicy": clubPolicyHint,
	clubRules: clubRulesHint,
	"accounts.*.clubRules": clubRulesHint,
	crossChannelCitations: crossChannelCitationsHint,
	"accounts.*.crossChannelCitations": crossChannelCitationsHint
} });
// extensions/tlon/src/doctor.ts
const tlonDoctor = {
	legacyConfigRules,
	normalizeCompatibilityConfig
};
// extensions/tlon/src/channel.ts
const TLON_CHANNEL_ID = "tlon";
function resolveTlonOutboundSessionRoute(params) {
	const parsed = parseTlonTarget(params.target);
	if (!parsed) return null;
	const isGroup = parsed.kind !== "dm";
	const peerId = parsed.kind === "dm" ? parsed.ship : parsed.kind === "club" ? `club:${parsed.clubId}` : parsed.nest;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "tlon",
		accountId: params.accountId,
		recipientSessionExact: true,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: peerId
		},
		chatType: isGroup ? "group" : "direct",
		from: parsed.kind === "group" ? `tlon:group:${peerId}` : `tlon:${peerId}`,
		to: `tlon:${peerId}`
	});
}
const loadTlonChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-DJeE-L57.mjs"));
const tlonSetupWizardProxy = createTlonSetupWizardBase(async (params) => await (await loadTlonChannelRuntime()).tlonSetupWizard.finalize(params));
const tlonConfigAdapter = createHybridChannelConfigAdapter({
	sectionKey: TLON_CHANNEL_ID,
	listAccountIds: listTlonAccountIds,
	resolveAccount: resolveTlonAccount,
	defaultAccountId: () => DEFAULT_ACCOUNT_ID,
	clearBaseFields: [
		"ship",
		"code",
		"url",
		"name"
	],
	preserveSectionOnDefaultDelete: true,
	resolveAllowFrom: (account) => account.dmAllowlist,
	formatAllowFrom: (allowFrom) => allowFrom.map((entry) => normalizeShip(String(entry))).filter(Boolean)
});
const tlonChannelOutbound = {
	deliveryMode: "direct",
	chunker: chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: 1e4,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	resolveTarget: ({ to }) => resolveTlonOutboundTarget(to),
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true
	} },
	...createRuntimeOutboundDelegates({
		getRuntime: loadTlonChannelRuntime,
		sendText: { resolve: (runtime) => runtime.tlonRuntimeOutbound.sendText },
		sendMedia: { resolve: (runtime) => runtime.tlonRuntimeOutbound.sendMedia }
	})
};
const tlonMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: TLON_CHANNEL_ID,
	outbound: tlonChannelOutbound
});
const tlonPlugin = createChatChannelPlugin({
	base: {
		id: TLON_CHANNEL_ID,
		meta: {
			id: TLON_CHANNEL_ID,
			label: "Tlon",
			selectionLabel: "Tlon (Urbit)",
			docsPath: "/channels/tlon",
			docsLabel: "tlon",
			blurb: "Decentralized messaging on Urbit",
			aliases: ["urbit"],
			order: 90
		},
		capabilities: {
			chatTypes: [
				"direct",
				"group",
				"thread"
			],
			media: true,
			reply: true,
			threads: true
		},
		setupContract: tlonSetupContract,
		setupWizard: tlonSetupWizardProxy,
		reload: { configPrefixes: ["channels.tlon"] },
		configSchema: tlonChannelConfigSchema,
		config: {
			...tlonConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured,
				extra: {
					ship: account.ship,
					url: account.url
				}
			})
		},
		doctor: tlonDoctor,
		messaging: {
			targetPrefixes: ["tlon"],
			normalizeTarget: (target) => {
				const parsed = parseTlonTarget(target);
				if (!parsed) return target.trim();
				if (parsed.kind === "dm") return parsed.ship;
				if (parsed.kind === "club") return `club:${parsed.clubId}`;
				return parsed.nest;
			},
			inferTargetChatType: ({ to }) => {
				const target = parseTlonTarget(to);
				return target ? target.kind === "dm" ? "direct" : "group" : void 0;
			},
			targetResolver: {
				looksLikeId: (target) => Boolean(parseTlonTarget(target)),
				hint: formatTargetHint()
			},
			resolveOutboundSessionRoute: resolveTlonOutboundSessionRoute
		},
		message: tlonMessageAdapter,
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: (accounts) => {
				return accounts.flatMap((account) => {
					if (!account.configured) return [{
						channel: TLON_CHANNEL_ID,
						accountId: account.accountId,
						kind: "config",
						message: "Account not configured (missing ship, code, or url)"
					}];
					return [];
				});
			},
			buildChannelSummary: ({ snapshot }) => {
				const s = snapshot;
				return {
					configured: s.configured ?? false,
					ship: s.ship ?? null,
					url: s.url ?? null
				};
			},
			probeAccount: async ({ account, timeoutMs }) => {
				if (!account.configured || !account.ship || !account.url || !account.code) return {
					ok: false,
					error: "Not configured"
				};
				return await (await loadTlonChannelRuntime()).probeTlonAccount(account, timeoutMs);
			},
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name ?? void 0,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					ship: account.ship,
					url: account.url
				}
			})
		}),
		gateway: {
			apiVersion: 2,
			startAccount: async (ctx) => await (await loadTlonChannelRuntime()).startTlonGatewayAccount(ctx)
		}
	},
	outbound: tlonChannelOutbound
});
export { TlonClubPolicySchema as n, TlonClubRulesSchema as r, tlonPlugin as t };
