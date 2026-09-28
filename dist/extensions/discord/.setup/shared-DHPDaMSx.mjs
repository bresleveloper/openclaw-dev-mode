import { c as resolveDiscordAccount, d as resolveDiscordAccountDisabledReason, f as resolveDiscordAccountDmPolicy, l as resolveDiscordAccountAllowFrom, n as isDiscordAccountEnabledForRuntime, o as mergeDiscordAccountConfig, r as listDiscordAccountIds, s as resolveDefaultDiscordAccountId } from "./accounts-CwJQoLjM.mjs";
import { t as inspectDiscordAccount } from "./account-inspect-BwQj24ht.mjs";
import { n as discordIngressIdentity, t as selectDiscordLivePolicyConfig } from "./live-policy-config-eKQ-PLdy.mjs";
import { t as DiscordChannelConfigSchema } from "./config-schema-CiZz-mtA.mjs";
import { n as normalizeCompatibilityConfig } from "./doctor-contract-Co5vRCZ6.mjs";
import { r as secretTargetRegistryEntries, t as collectRuntimeConfigAssignments } from "./secret-config-contract-DFu9hfU8.mjs";
import { n as unsupportedSecretRefSurfacePatterns, t as collectUnsupportedSecretRefConfigCandidates } from "./security-contract-DSHk7I2w.mjs";
import { t as deriveLegacySessionChatType } from "./session-contract-BO5tlIdl.mjs";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { PAIRING_APPROVED_MESSAGE, buildTokenChannelStatusSummary, projectCredentialSnapshotFields, resolveConfiguredFromCredentialStatuses as resolveConfiguredFromCredentialStatuses$1 } from "openclaw/plugin-sdk/channel-status";
import { formatAllowFromLowercase } from "openclaw/plugin-sdk/allow-from";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createConditionalWarningCollector, createOpenProviderConfiguredRouteWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { identityEntryAuthenticationClassifier } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { createEnvPatchedAccountSetupAdapter } from "openclaw/plugin-sdk/setup-runtime";
//#region extensions/discord/src/channel-api.ts
const DISCORD_CHANNEL_META = {
	id: "discord",
	label: "Discord",
	selectionLabel: "Discord (Bot API)",
	detailLabel: "Discord Bot",
	docsPath: "/channels/discord",
	docsLabel: "discord",
	blurb: "very well supported right now.",
	systemImage: "bubble.left.and.bubble.right",
	markdownCapable: true,
	preferSessionLookupForAnnounceTarget: true
};
function getChatChannelMeta(id) {
	if (id !== DISCORD_CHANNEL_META.id) throw new Error(`Unsupported Discord channel meta lookup: ${id}`);
	return DISCORD_CHANNEL_META;
}
//#endregion
//#region extensions/discord/src/security.ts
const resolveDiscordDmPolicy = createScopedDmSecurityResolver({
	channelKey: "discord",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	resolveAccess: ({ cfg, account }) => ({
		dmPolicy: resolveDiscordAccountDmPolicy({
			cfg,
			accountId: account.accountId
		}),
		allowFrom: resolveDiscordAccountAllowFrom({
			cfg,
			accountId: account.accountId
		})
	}),
	policyPathSuffix: "dmPolicy",
	classifyEntryAuthentication: identityEntryAuthenticationClassifier(discordIngressIdentity),
	normalizeEntry: (raw) => raw.trim().replace(/^(discord|user):/i, "").replace(/^<@!?(\d+)>$/, "$1")
});
const collectDiscordSecurityWarnings = createOpenProviderConfiguredRouteWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.discord !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Object.keys(account.config.guilds ?? {}).length > 0,
	configureRouteAllowlist: {
		surface: "Discord guilds",
		openScope: "any channel not explicitly denied",
		groupPolicyPath: "channels.discord.groupPolicy",
		routeAllowlistPath: "channels.discord.guilds.<id>.channels"
	},
	missingRouteAllowlist: {
		surface: "Discord guilds",
		openBehavior: "with no guild/channel allowlist; any channel can trigger (mention-gated)",
		remediation: "Set channels.discord.groupPolicy=\"allowlist\" and configure channels.discord.guilds.<id>.channels"
	}
});
const collectDiscordSecurityFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectDiscordSecurityWarnings,
	checkId: "channels.discord.groups.open",
	severity: "warn",
	title: "Discord security warning"
});
const loadDiscordSecurityAuditModule = createLazyRuntimeModule(() => import("./security-audit.runtime-DHtYenx9.mjs"));
const discordSecurityAdapter = {
	resolveDmPolicy: resolveDiscordDmPolicy,
	collectWarnings: collectDiscordSecurityFindings,
	collectAuditFindings: async (params) => (await loadDiscordSecurityAuditModule()).collectDiscordSecurityAuditFindings(params)
};
//#endregion
//#region extensions/discord/src/setup-adapter.ts
const discordSetupAdapter = createEnvPatchedAccountSetupAdapter({
	channelKey: "discord",
	defaultAccountOnlyEnvError: "DISCORD_BOT_TOKEN can only be used for the default account.",
	missingCredentialError: "Discord requires token (or --use-env).",
	hasCredentials: (input) => Boolean(input.token),
	validateInput: ({ input }) => input.token && /^\d+$/.test(input.token.trim()) ? "Discord token looks like a numeric application ID, not a bot token. Paste the bot token from the Discord Developer Portal (Bot page), not the application ID (General Information page)." : null,
	buildPatch: (input) => input.token ? { token: input.token } : {}
});
const discordSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Discord bot token"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use DISCORD_BOT_TOKEN"
			},
			envVars: ["DISCORD_BOT_TOKEN"]
		}
	},
	legacyAdapter: discordSetupAdapter
});
//#endregion
//#region extensions/discord/src/doctor-shared.ts
const DISCORD_LEGACY_CONFIG_RULES = [];
//#endregion
//#region extensions/discord/src/shared.ts
const DISCORD_CHANNEL = "discord";
const livePolicyConfigPrefixes = Object.keys(selectDiscordLivePolicyConfig({})).flatMap((key) => [`channels.discord.${key}`, `channels.discord.accounts.*.${key}`]);
const loadDiscordDoctorModule = createLazyRuntimeModule(() => import("./doctor-D1R-uFIu.mjs"));
const discordDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "route",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules: DISCORD_LEGACY_CONFIG_RULES,
	normalizeCompatibilityConfig,
	collectPreviewWarnings: async (params) => (await loadDiscordDoctorModule()).discordDoctor.collectPreviewWarnings?.(params) ?? [],
	collectMutableAllowlistWarnings: async (params) => (await loadDiscordDoctorModule()).discordDoctor.collectMutableAllowlistWarnings?.(params) ?? [],
	repairConfig: async (params) => (await loadDiscordDoctorModule()).discordDoctor.repairConfig?.(params) ?? {
		config: params.cfg,
		changes: []
	}
};
function resolveDiscordConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const config = mergeDiscordAccountConfig(params.cfg, accountId);
	return {
		allowFrom: resolveDiscordAccountAllowFrom({
			cfg: params.cfg,
			accountId
		}),
		defaultTo: config.defaultTo
	};
}
const discordConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: DISCORD_CHANNEL,
	listAccountIds: listDiscordAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveDiscordAccount),
	resolveAccessorAccount: resolveDiscordConfigAccessorAccount,
	inspectAccount: adaptScopedAccountAccessor(inspectDiscordAccount),
	defaultAccountId: resolveDefaultDiscordAccountId,
	clearBaseFields: ["token", "name"],
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(discord|user|pk):/i
	}).map((entry) => entry.replace(/^<@!?(\d+)>$/, "$1")),
	resolveDefaultTo: (account) => account.defaultTo
});
function createDiscordPluginBase(params) {
	return {
		id: DISCORD_CHANNEL,
		setupContract: params.setupContract,
		...params.setupWizard ? { setupWizard: params.setupWizard } : {},
		meta: { ...getChatChannelMeta(DISCORD_CHANNEL) },
		capabilities: {
			chatTypes: [
				"direct",
				"channel",
				"thread"
			],
			polls: true,
			reactions: true,
			threads: true,
			media: true,
			tts: { voice: { synthesisTarget: "voice-note" } },
			nativeCommands: true
		},
		commands: {
			nativeCommandsAutoEnabled: true,
			nativeSkillsAutoEnabled: true,
			resolveNativeCommandName: ({ commandKey, defaultName }) => commandKey === "tts" ? "voice" : defaultName
		},
		doctor: discordDoctor,
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: {
			configPrefixes: ["channels.discord"],
			noopPrefixes: [
				...livePolicyConfigPrefixes,
				"messages.inbound",
				"messages.ackReactionScope"
			]
		},
		configSchema: DiscordChannelConfigSchema,
		config: {
			...discordConfigAdapter,
			hasConfiguredState: ({ env }) => typeof env?.DISCORD_BOT_TOKEN === "string" && env.DISCORD_BOT_TOKEN.trim().length > 0,
			isEnabled: (account, cfg) => isDiscordAccountEnabledForRuntime(account, cfg),
			disabledReason: (account, cfg) => resolveDiscordAccountDisabledReason(account, cfg),
			isConfigured: (account) => resolveConfiguredFromCredentialStatuses$1(account) ?? Boolean(account.token?.trim()),
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: resolveConfiguredFromCredentialStatuses$1(account) ?? Boolean(account.token?.trim()),
				extra: {
					tokenSource: account.tokenSource,
					tokenStatus: account.tokenStatus
				}
			})
		},
		messaging: { deriveLegacySessionChatType },
		security: discordSecurityAdapter,
		secrets: {
			secretTargetRegistryEntries,
			unsupportedSecretRefSurfacePatterns,
			collectUnsupportedSecretRefConfigCandidates,
			collectRuntimeConfigAssignments
		}
	};
}
//#endregion
export { discordSecurityAdapter as a, buildTokenChannelStatusSummary as c, discordSetupContract as i, projectCredentialSnapshotFields as l, discordConfigAdapter as n, DEFAULT_ACCOUNT_ID$1 as o, DISCORD_LEGACY_CONFIG_RULES as r, PAIRING_APPROVED_MESSAGE as s, createDiscordPluginBase as t, resolveConfiguredFromCredentialStatuses$1 as u };
