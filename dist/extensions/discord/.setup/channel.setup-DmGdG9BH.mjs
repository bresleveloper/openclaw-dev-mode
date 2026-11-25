import { c as resolveDefaultDiscordAccountId, g as resolveDiscordToken, n as inspectDiscordAccountConfig, s as mergeDiscordAccountConfig, u as resolveDiscordAccountAllowFrom } from "./accounts-DtjvhJUj.mjs";
import { r as discordSetupContract, t as createDiscordPluginBase } from "./shared-Bf7ifHlc.mjs";
import { t as resolveDiscordChannelAllowlist } from "./resolve-channels-BNnyfCR8.mjs";
import { t as resolveDiscordUserAllowlist } from "./resolve-users-CDMAGrzv.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveBasicAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { createAccountScopedAllowFromSection, createAccountScopedGroupAccessSection, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, parseMentionOrPrefixedId, patchChannelConfigForAccount, promptResolvedAllowFrom, resolveEntriesWithOptionalToken, resolveSetupAccountId, setSetupChannelEnabled, splitSetupEntries } from "openclaw/plugin-sdk/setup-runtime";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
// extensions/discord/src/setup-account-state.ts
function resolveDiscordSetupAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	return {
		accountId,
		config: mergeDiscordAccountConfig(params.cfg, accountId)
	};
}
function inspectDiscordSetupAccount(params) {
	return inspectDiscordAccountConfig(params, { resolveFallbackToken: (accountId) => resolveDiscordToken(params.cfg, { accountId }) });
}
// extensions/discord/src/setup-core.ts
const t = createSetupTranslator();
const channel = "discord";
const DISCORD_TOKEN_HELP_LINES = [
	t("wizard.discord.tokenHelpCreateApplication"),
	t("wizard.discord.tokenHelpCopyToken"),
	t("wizard.discord.tokenHelpInviteBot"),
	t("wizard.discord.tokenHelpMessageContentIntent"),
	t("wizard.channels.docs", { link: formatDocsLink("/discord", "discord") })
];
function getDiscordAllowFromHelpLines() {
	return [
		t("wizard.discord.allowlistIntro"),
		t("wizard.discord.examples"),
		"- 123456789012345678",
		"- @alice",
		"- alice#1234",
		t("wizard.discord.multipleEntries"),
		t("wizard.channels.docs", { link: formatDocsLink("/discord", "discord") })
	];
}
function setDiscordGuildChannelAllowlist(cfg, accountId, resolved) {
	const entries = Array.isArray(resolved) ? resolved.flatMap((entry) => {
		if (!entry || typeof entry !== "object") return [];
		const row = entry;
		if (row.resolved === false) return [];
		const guildKey = normalizeOptionalString(row.guildId ?? row.guildKey);
		if (!guildKey) return [];
		const channelKey = normalizeOptionalString(row.channelId ?? row.channelKey);
		return channelKey ? [{
			guildKey,
			channelKey
		}] : [{ guildKey }];
	}) : [];
	const guilds = { ...accountId === DEFAULT_ACCOUNT_ID ? cfg.channels?.discord?.guilds ?? {} : cfg.channels?.discord?.accounts?.[accountId]?.guilds ?? {} };
	for (const entry of entries) {
		const guildKey = entry.guildKey;
		const existing = guilds[guildKey] ?? {};
		if (entry.channelKey) {
			const channels = { ...existing.channels };
			channels[entry.channelKey] = { enabled: true };
			guilds[guildKey] = {
				...existing,
				channels
			};
		} else guilds[guildKey] = existing;
	}
	return patchChannelConfigForAccount({
		cfg,
		channel,
		accountId,
		patch: { guilds }
	});
}
function parseDiscordAllowFromId(value) {
	return parseMentionOrPrefixedId({
		value,
		mentionPattern: /^<@!?(\d+)>$/,
		prefixPattern: /^(user:|discord:)/i,
		idPattern: /^\d+$/
	});
}
async function promptDiscordAllowFrom(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: resolveDefaultDiscordAccountId(params.cfg)
	});
	const account = resolveDiscordSetupAccountConfig({
		cfg: params.cfg,
		accountId
	});
	const noteTitle = t("wizard.discord.allowlistTitle");
	await params.prompter.note(getDiscordAllowFromHelpLines().join("\n"), noteTitle);
	const allowFrom = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: resolveDiscordAccountAllowFrom({
			cfg: params.cfg,
			accountId
		}) ?? [],
		token: resolveDiscordToken(params.cfg, { accountId }).token,
		message: t("wizard.discord.allowFromPrompt"),
		placeholder: "@alice, 123456789012345678",
		label: noteTitle,
		parseInputs: splitSetupEntries,
		parseId: parseDiscordAllowFromId,
		invalidWithoutTokenNote: t("wizard.discord.allowFromInvalidWithoutToken"),
		resolveEntries: async ({ token, entries }) => await resolveBasicAllowFromEntries({
			token,
			entries,
			resolveEntries: resolveDiscordUserAllowlist
		})
	});
	return patchChannelConfigForAccount({
		cfg: params.cfg,
		channel,
		accountId: account.accountId,
		patch: {
			allowFrom,
			dm: {
				...account.config.dm,
				enabled: typeof account.config.dm?.enabled === "boolean" ? account.config.dm.enabled : true
			}
		}
	});
}
const discordDmPolicy = createChannelDmPolicy({
	label: "Discord",
	channel,
	resolveAccount: (cfg, accountId) => resolveDiscordSetupAccountConfig({
		cfg,
		accountId
	}),
	buildPatch: ({ account, policy, allowFrom }) => ({
		dmPolicy: policy,
		...allowFrom === void 0 ? {} : { allowFrom },
		dm: {
			...account.config.dm,
			enabled: typeof account.config.dm?.enabled === "boolean" ? account.config.dm.enabled : true
		}
	}),
	promptAllowFrom: promptDiscordAllowFrom
});
const discordSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Discord",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsToken"),
		configuredScore: 2,
		unconfiguredScore: 1,
		resolveConfigured: ({ cfg, accountId }) => inspectDiscordSetupAccount({
			cfg,
			accountId
		}).configured
	}),
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "token",
		providerHint: channel,
		credentialLabel: t("wizard.discord.botToken"),
		preferredEnvVar: "DISCORD_BOT_TOKEN",
		helpTitle: t("wizard.discord.botToken"),
		helpLines: DISCORD_TOKEN_HELP_LINES,
		envPrompt: t("wizard.discord.tokenEnvPrompt"),
		keepPrompt: t("wizard.discord.tokenKeepPrompt"),
		inputPrompt: t("wizard.discord.tokenInputPrompt"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
		resolveAccount: inspectDiscordSetupAccount,
		accountConfigured: (account) => account.configured,
		hasConfiguredValue: (account) => account.tokenStatus !== "missing",
		resolvedValue: (account) => normalizeOptionalString(account.token),
		envValue: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID ? normalizeOptionalString(process.env.DISCORD_BOT_TOKEN) : void 0
	})],
	groupAccess: createAccountScopedGroupAccessSection({
		channel,
		label: t("wizard.discord.channelsLabel"),
		placeholder: "My Server/#general, guildId/channelId, #support",
		currentPolicy: ({ cfg, accountId }) => resolveDiscordSetupAccountConfig({
			cfg,
			accountId
		}).config.groupPolicy ?? "allowlist",
		currentEntries: ({ cfg, accountId }) => Object.entries(resolveDiscordSetupAccountConfig({
			cfg,
			accountId
		}).config.guilds ?? {}).flatMap(([guildKey, value]) => {
			const channelKeys = Object.keys(value?.channels ?? {});
			if (channelKeys.length === 0) return [/^\d+$/.test(guildKey) ? `guild:${guildKey}` : guildKey];
			return channelKeys.map((channelKey) => `${guildKey}/${channelKey}`);
		}),
		updatePrompt: ({ cfg, accountId }) => Boolean(resolveDiscordSetupAccountConfig({
			cfg,
			accountId
		}).config.guilds),
		resolveAllowlist: async (params) => await resolveEntriesWithOptionalToken({
			token: resolveDiscordToken(params.cfg, { accountId: params.accountId }).token || (typeof params.credentialValues.token === "string" ? params.credentialValues.token : ""),
			entries: params.entries,
			buildWithoutToken: (input) => ({
				input,
				resolved: false
			}),
			resolveEntries: resolveDiscordChannelAllowlist
		}),
		fallbackResolved: (entries) => entries.map((input) => ({
			input,
			resolved: false
		})),
		applyAllowlist: ({ cfg, accountId, resolved }) => setDiscordGuildChannelAllowlist(cfg, accountId, resolved)
	}),
	allowFrom: createAccountScopedAllowFromSection({
		channel,
		credentialInputKey: "token",
		helpTitle: "Discord allowlist",
		helpLines: getDiscordAllowFromHelpLines(),
		message: t("wizard.discord.allowFromPrompt"),
		placeholder: "@alice, 123456789012345678",
		invalidWithoutCredentialNote: t("wizard.discord.allowFromInvalidWithoutToken"),
		parseId: parseDiscordAllowFromId,
		resolveEntries: async ({ cfg, accountId, credentialValues, entries }) => await resolveBasicAllowFromEntries({
			token: resolveDiscordToken(cfg, { accountId }).token || (typeof credentialValues.token === "string" ? credentialValues.token : ""),
			entries,
			resolveEntries: resolveDiscordUserAllowlist
		})
	}),
	dmPolicy: discordDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
// extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({
	setupWizard: discordSetupWizard,
	setupContract: discordSetupContract
}) };
export { discordSetupPlugin as t };
