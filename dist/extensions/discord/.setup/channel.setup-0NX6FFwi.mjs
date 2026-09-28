import { _ as inspectDiscordAccountTokenState, h as resolveDiscordToken, l as resolveDiscordAccountAllowFrom, o as mergeDiscordAccountConfig, s as resolveDefaultDiscordAccountId, u as resolveDiscordAccountConfig } from "./accounts-CwJQoLjM.mjs";
import { i as discordSetupContract, t as createDiscordPluginBase } from "./shared-DHPDaMSx.mjs";
import { t as resolveDiscordChannelAllowlist } from "./resolve-channels-BbvsLQOZ.mjs";
import { t as resolveDiscordUserAllowlist } from "./resolve-users-ByFlR7LQ.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveBasicAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { createAccountScopedAllowFromSection, createAccountScopedGroupAccessSection, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, parseMentionOrPrefixedId, patchChannelConfigForAccount, promptResolvedAllowFrom, resolveEntriesWithOptionalToken, resolveSetupAccountId, setSetupChannelEnabled, splitSetupEntries } from "openclaw/plugin-sdk/setup-runtime";
import { formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
//#region extensions/discord/src/setup-account-state.ts
function resolveDefaultDiscordSetupAccountId(cfg) {
	return resolveDefaultDiscordAccountId(cfg);
}
function resolveDiscordSetupAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordSetupAccountId(params.cfg));
	return {
		accountId,
		config: mergeDiscordAccountConfig(params.cfg, accountId)
	};
}
function inspectDiscordSetupAccount(params) {
	const { accountId, config } = resolveDiscordSetupAccountConfig(params);
	const enabled = params.cfg.channels?.discord?.enabled !== false && config.enabled !== false;
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const hasAccountToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "token"));
	return inspectDiscordAccountTokenState({
		base: {
			accountId,
			enabled
		},
		config,
		accountToken: accountConfig?.token,
		hasAccountToken,
		channelToken: params.cfg.channels?.discord?.token,
		resolveFallbackToken: () => resolveDiscordToken(params.cfg, { accountId })
	});
}
//#endregion
//#region extensions/discord/src/setup-core.ts
const t$1 = createSetupTranslator();
const channel$1 = "discord";
const DISCORD_TOKEN_HELP_LINES = [
	t$1("wizard.discord.tokenHelpCreateApplication"),
	t$1("wizard.discord.tokenHelpCopyToken"),
	t$1("wizard.discord.tokenHelpInviteBot"),
	t$1("wizard.discord.tokenHelpMessageContentIntent"),
	t$1("wizard.channels.docs", { link: formatDocsLink("/discord", "discord") })
];
function mapDiscordSetupAllowlistEntries(resolved) {
	if (!Array.isArray(resolved)) return [];
	return resolved.flatMap((entry) => {
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
	});
}
function setDiscordGuildChannelAllowlist(cfg, accountId, entries) {
	const guilds = { ...accountId === DEFAULT_ACCOUNT_ID ? cfg.channels?.discord?.guilds ?? {} : cfg.channels?.discord?.accounts?.[accountId]?.guilds ?? {} };
	for (const entry of entries) {
		const guildKey = entry.guildKey || "*";
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
		channel: channel$1,
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
function createDiscordSetupWizardBase(handlers) {
	const discordDmPolicy = createChannelDmPolicy({
		label: "Discord",
		channel: channel$1,
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
		promptAllowFrom: handlers.promptAllowFrom
	});
	return {
		channel: channel$1,
		status: createStandardChannelSetupStatus({
			channelLabel: "Discord",
			configuredLabel: t$1("wizard.channels.statusConfigured"),
			unconfiguredLabel: t$1("wizard.channels.statusNeedsToken"),
			configuredHint: t$1("wizard.channels.statusConfigured"),
			unconfiguredHint: t$1("wizard.channels.statusNeedsToken"),
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
			providerHint: channel$1,
			credentialLabel: t$1("wizard.discord.botToken"),
			preferredEnvVar: "DISCORD_BOT_TOKEN",
			helpTitle: t$1("wizard.discord.botToken"),
			helpLines: DISCORD_TOKEN_HELP_LINES,
			envPrompt: t$1("wizard.discord.tokenEnvPrompt"),
			keepPrompt: t$1("wizard.discord.tokenKeepPrompt"),
			inputPrompt: t$1("wizard.discord.tokenInputPrompt"),
			allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
			resolveAccount: ({ cfg, accountId }) => inspectDiscordSetupAccount({
				cfg,
				accountId
			}),
			accountConfigured: (account) => account.configured,
			hasConfiguredValue: (account) => account.tokenStatus !== "missing",
			resolvedValue: (account) => normalizeOptionalString(account.token),
			envValue: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID ? normalizeOptionalString(process.env.DISCORD_BOT_TOKEN) : void 0
		})],
		groupAccess: createAccountScopedGroupAccessSection({
			channel: channel$1,
			label: t$1("wizard.discord.channelsLabel"),
			placeholder: "My Server/#general, guildId/channelId, #support",
			currentPolicy: ({ cfg, accountId }) => resolveDiscordSetupAccountConfig({
				cfg,
				accountId
			}).config.groupPolicy ?? "allowlist",
			currentEntries: ({ cfg, accountId }) => Object.entries(resolveDiscordSetupAccountConfig({
				cfg,
				accountId
			}).config.guilds ?? {}).flatMap(([guildKey, value]) => {
				const channels = value?.channels ?? {};
				const channelKeys = Object.keys(channels);
				if (channelKeys.length === 0) return [/^\d+$/.test(guildKey) ? `guild:${guildKey}` : guildKey];
				return channelKeys.map((channelKey) => `${guildKey}/${channelKey}`);
			}),
			updatePrompt: ({ cfg, accountId }) => Boolean(resolveDiscordSetupAccountConfig({
				cfg,
				accountId
			}).config.guilds),
			resolveAllowlist: handlers.resolveGroupAllowlist,
			fallbackResolved: (entries) => entries.map((input) => ({
				input,
				resolved: false
			})),
			applyAllowlist: ({ cfg, accountId, resolved }) => setDiscordGuildChannelAllowlist(cfg, accountId, mapDiscordSetupAllowlistEntries(resolved))
		}),
		allowFrom: createAccountScopedAllowFromSection({
			channel: channel$1,
			credentialInputKey: "token",
			helpTitle: "Discord allowlist",
			helpLines: [
				t$1("wizard.discord.allowlistIntro"),
				t$1("wizard.discord.examples"),
				"- 123456789012345678",
				"- @alice",
				"- alice#1234",
				t$1("wizard.discord.multipleEntries"),
				t$1("wizard.channels.docs", { link: formatDocsLink("/discord", "discord") })
			],
			message: t$1("wizard.discord.allowFromPrompt"),
			placeholder: "@alice, 123456789012345678",
			invalidWithoutCredentialNote: t$1("wizard.discord.allowFromInvalidWithoutToken"),
			parseId: parseDiscordAllowFromId,
			resolveEntries: handlers.resolveAllowFromEntries
		}),
		dmPolicy: discordDmPolicy,
		disable: (cfg) => setSetupChannelEnabled(cfg, channel$1, false)
	};
}
//#endregion
//#region extensions/discord/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "discord";
async function resolveDiscordAllowFromEntries(params) {
	return await resolveBasicAllowFromEntries({
		token: params.token,
		entries: params.entries,
		resolveEntries: async ({ token, entries }) => await resolveDiscordUserAllowlist({
			token,
			entries
		})
	});
}
async function promptDiscordAllowFrom(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: resolveDefaultDiscordSetupAccountId(params.cfg)
	});
	const account = resolveDiscordSetupAccountConfig({
		cfg: params.cfg,
		accountId
	});
	const noteTitle = t("wizard.discord.allowlistTitle");
	await params.prompter.note([
		t("wizard.discord.allowlistIntro"),
		t("wizard.discord.examples"),
		"- 123456789012345678",
		"- @alice",
		"- alice#1234",
		t("wizard.discord.multipleEntries"),
		t("wizard.channels.docs", { link: formatDocsLink("/discord", "discord") })
	].join("\n"), noteTitle);
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
		resolveEntries: async ({ token, entries }) => (await resolveDiscordUserAllowlist({
			token,
			entries
		})).map((entry) => ({
			input: entry.input,
			resolved: entry.resolved,
			id: entry.id ?? null
		}))
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
async function resolveDiscordGroupAllowlist(params) {
	return await resolveEntriesWithOptionalToken({
		token: resolveDiscordToken(params.cfg, { accountId: params.accountId }).token || (typeof params.credentialValues.token === "string" ? params.credentialValues.token : ""),
		entries: params.entries,
		buildWithoutToken: (input) => ({
			input,
			resolved: false
		}),
		resolveEntries: async ({ token, entries }) => await resolveDiscordChannelAllowlist({
			token,
			entries
		})
	});
}
const discordSetupWizard = createDiscordSetupWizardBase({
	promptAllowFrom: promptDiscordAllowFrom,
	resolveAllowFromEntries: async ({ cfg, accountId, credentialValues, entries }) => await resolveDiscordAllowFromEntries({
		token: resolveDiscordToken(cfg, { accountId }).token || (typeof credentialValues.token === "string" ? credentialValues.token : ""),
		entries
	}),
	resolveGroupAllowlist: async ({ cfg, accountId, credentialValues, entries }) => await resolveDiscordGroupAllowlist({
		cfg,
		accountId,
		credentialValues,
		entries
	})
});
//#endregion
//#region extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({
	setupWizard: discordSetupWizard,
	setupContract: discordSetupContract
}) };
//#endregion
export { discordSetupPlugin as t };
