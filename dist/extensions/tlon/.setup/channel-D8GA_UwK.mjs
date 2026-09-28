import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-CZ8OWBXt.mjs";
import { d as resolveTlonAccount, f as formatTargetHint, g as resolveTlonOutboundTarget, h as parseTlonTarget, n as createTlonSetupWizardBase, o as tlonSetupContract, p as normalizeShip, u as listTlonAccountIds } from "./setup-core-Ny4-ZMK0.mjs";
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
//#region extensions/tlon/src/config-schema.ts
const ShipSchema = z.string().min(1);
const ChannelNestSchema = z.string().min(1);
const TlonChannelRuleSchema = z.object({
	mode: z.enum(["restricted", "open"]).optional(),
	allowedShips: z.array(ShipSchema).optional()
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
	groupInviteAllowlist: z.array(ShipSchema).optional(),
	autoDiscoverChannels: z.boolean().optional(),
	showModelSignature: z.boolean().optional(),
	responsePrefix: z.string().optional(),
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
const tlonChannelConfigSchema = buildChannelConfigSchema(TlonConfigSchema, { uiHints: createChannelConfigUiHints({
	channelLabel: "Tlon",
	implicitMentions: true
}) });
//#endregion
//#region extensions/tlon/src/doctor.ts
const tlonDoctor = {
	legacyConfigRules,
	normalizeCompatibilityConfig
};
//#endregion
//#region extensions/tlon/src/session-route.ts
function resolveTlonOutboundSessionRoute(params) {
	const parsed = parseTlonTarget(params.target);
	if (!parsed) return null;
	if (parsed.kind === "group") return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "tlon",
		accountId: params.accountId,
		recipientSessionExact: true,
		peer: {
			kind: "group",
			id: parsed.nest
		},
		chatType: "group",
		from: `tlon:group:${parsed.nest}`,
		to: `tlon:${parsed.nest}`
	});
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "tlon",
		accountId: params.accountId,
		recipientSessionExact: true,
		peer: {
			kind: "direct",
			id: parsed.ship
		},
		chatType: "direct",
		from: `tlon:${parsed.ship}`,
		to: `tlon:${parsed.ship}`
	});
}
//#endregion
//#region extensions/tlon/src/channel.ts
const TLON_CHANNEL_ID = "tlon";
const loadTlonChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-Cwwakv4X.mjs"));
const tlonSetupWizardProxy = createTlonSetupWizardBase({
	resolveConfigured: async ({ cfg, accountId }) => await (await loadTlonChannelRuntime()).tlonSetupWizard.status.resolveConfigured({
		cfg,
		accountId
	}),
	resolveStatusLines: async ({ cfg, accountId, configured }) => await (await loadTlonChannelRuntime()).tlonSetupWizard.status.resolveStatusLines?.({
		cfg,
		accountId,
		configured
	}) ?? [],
	finalize: async (params) => await (await loadTlonChannelRuntime()).tlonSetupWizard.finalize(params)
});
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
			resolveOutboundSessionRoute: (params) => resolveTlonOutboundSessionRoute(params)
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
		gateway: { startAccount: async (ctx) => await (await loadTlonChannelRuntime()).startTlonGatewayAccount(ctx) }
	},
	outbound: tlonChannelOutbound
});
//#endregion
export { tlonPlugin as t };
