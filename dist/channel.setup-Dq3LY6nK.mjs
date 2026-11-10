import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-ifCOO7_9.mjs";
import { o as getChatChannelMeta } from "./registry-DqsL4UWB.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as defineChannelSetupContract } from "./setup-contract-DgLM9zTf.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { a as mergeTelegramAccountConfig, n as listTelegramAccountIds } from "./account-selection-CQ3hKgoh.mjs";
import { a as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-iQxjPtMU.mjs";
import { t as createSetupTranslator } from "./i18n-CwUnB3fI.mjs";
import { n as applySetupAccountConfigPatch, r as createEnvPatchedAccountSetupAdapter } from "./setup-helpers-BkS00G-w.mjs";
import { N as splitSetupEntries, a as createAllowFromSection, b as patchChannelConfigForAccount, j as setSetupChannelEnabled, s as createStandardChannelSetupStatus, w as promptResolvedAllowFrom } from "./setup-wizard-helpers-B7ZmEvzm.mjs";
import { n as defineTokenCredential } from "./setup-credential-DKyBKT9L.mjs";
import "./setup-BzVmBDLq.mjs";
import "./setup-runtime-CCVzlabE.mjs";
import "./channel-setup-BMYLjjPt.mjs";
import "./setup-tools-CXw-D_tA.mjs";
import { t as formatAllowFromLowercase } from "./allow-from-0x-NWkHs.mjs";
import { t as createChannelDmPolicy } from "./channel-dm-policy-DF3Yk9TH.mjs";
import "./channel-plugin-common-DJxvaPDc.mjs";
import { i as resolveTelegramAccount, r as resolveDefaultTelegramAccountId } from "./accounts-CHcpIFN8.mjs";
import { r as normalizeTelegramAllowFromEntry, t as isNumericTelegramSenderUserId } from "./allow-from-Byf7JKVc.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-Dp1wulI-.mjs";
import { n as singleAccountKeysToMove, t as namedAccountPromotionKeys } from "./setup-contract-CDcIs5O0.mjs";
import { t as TelegramChannelConfigSchema } from "./config-schema-1AmMFX6j.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-awSlJieg.mjs";
//#region extensions/telegram/src/config-adapter.ts
function resolveTelegramConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultTelegramAccountId(params.cfg));
	return { config: mergeTelegramAccountConfig(params.cfg, accountId) };
}
const telegramConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "telegram",
	listAccountIds: listTelegramAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveTelegramAccount),
	resolveAccessorAccount: resolveTelegramConfigAccessorAccount,
	inspectAccount: adaptScopedAccountAccessor(inspectTelegramAccount),
	defaultAccountId: resolveDefaultTelegramAccountId,
	clearBaseFields: [
		"botToken",
		"tokenFile",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(telegram|tg):/i
	}),
	resolveDefaultTo: (account) => account.config.defaultTo
});
function createTelegramPluginConfig() {
	return {
		...telegramConfigAdapter,
		hasConfiguredState: ({ env }) => typeof env?.TELEGRAM_BOT_TOKEN === "string" && env.TELEGRAM_BOT_TOKEN.trim().length > 0,
		isConfigured: (account, cfg) => {
			const inspected = inspectTelegramAccount({
				cfg,
				accountId: account.accountId
			});
			return inspected.configured && Boolean(inspected.token.trim());
		},
		unconfiguredReason: (account, cfg) => {
			const inspected = inspectTelegramAccount({
				cfg,
				accountId: account.accountId
			});
			return inspected.stateReason ?? (inspected.tokenStatus === "configured_unavailable" ? `not configured: token ${inspected.tokenSource} is configured but unavailable` : "not configured");
		},
		describeAccount: (account, cfg) => {
			const inspected = inspectTelegramAccount({
				cfg,
				accountId: account.accountId
			});
			return {
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: inspected.configured,
				tokenSource: inspected.tokenSource,
				tokenStatus: inspected.tokenStatus
			};
		}
	};
}
//#endregion
//#region extensions/telegram/src/setup-core.ts
const t$1 = createSetupTranslator();
const channel$2 = "telegram";
function getTelegramTokenHelpLines() {
	return [
		t$1("wizard.telegram.tokenHelpOpenBotFather"),
		t$1("wizard.telegram.tokenHelpNewBot"),
		t$1("wizard.telegram.tokenHelpCopyToken"),
		t$1("wizard.telegram.tokenHelpWebApp", { url: "https://t.me/BotFather?startapp" }),
		t$1("wizard.telegram.tokenEnvTip"),
		t$1("wizard.channels.docs", { link: formatDocsLink("/telegram") }),
		t$1("wizard.telegram.website", { url: "https://openclaw.ai" })
	];
}
function getTelegramUserIdHelpLines() {
	return [
		t$1("wizard.telegram.userIdHelpLogs", { command: formatCliCommand("openclaw logs --follow") }),
		t$1("wizard.telegram.userIdHelpGetUpdates"),
		t$1("wizard.telegram.userIdHelpThirdParty"),
		t$1("wizard.channels.docs", { link: formatDocsLink("/telegram") }),
		t$1("wizard.telegram.website", { url: "https://openclaw.ai" })
	];
}
function parseTelegramAllowFromId(raw) {
	const stripped = normalizeTelegramAllowFromEntry(raw);
	return isNumericTelegramSenderUserId(stripped) ? stripped : null;
}
async function promptTelegramAllowFromForAccount(params) {
	const accountId = params.accountId ?? resolveDefaultTelegramAccountId(params.cfg);
	const resolved = resolveTelegramAccount({
		cfg: params.cfg,
		accountId
	});
	await params.prompter.note(getTelegramUserIdHelpLines().join("\n"), t$1("wizard.telegram.userIdTitle"));
	const unique = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: resolved.config.allowFrom ?? [],
		message: t$1("wizard.telegram.allowFromPrompt"),
		placeholder: "123456789",
		label: t$1("wizard.telegram.allowlistTitle"),
		parseInputs: splitSetupEntries,
		parseId: parseTelegramAllowFromId,
		invalidWithoutTokenNote: t$1("wizard.telegram.allowFromInvalid"),
		resolveEntries: async ({ entries }) => entries.map((input) => {
			const id = parseTelegramAllowFromId(input);
			return {
				input,
				resolved: Boolean(id),
				id
			};
		})
	});
	return applyTelegramAllowFrom(params.cfg, accountId, unique);
}
function applyTelegramAllowFrom(cfg, accountId, allowFrom) {
	return patchChannelConfigForAccount({
		cfg,
		channel: channel$2,
		accountId,
		patch: {
			dmPolicy: "allowlist",
			allowFrom
		},
		setupSurface: telegramSetupAdapter
	});
}
const telegramSetupAdapter = {
	...createEnvPatchedAccountSetupAdapter({
		channelKey: channel$2,
		defaultAccountOnlyEnvError: "TELEGRAM_BOT_TOKEN can only be used for the default account.",
		missingCredentialError: "Telegram requires token or --token-file (or --use-env).",
		hasCredentials: (input) => Boolean(input.token || input.tokenFile),
		buildPatch: (input) => input.tokenFile ? { tokenFile: input.tokenFile } : input.token ? { botToken: input.token } : {}
	}),
	singleAccountKeysToMove,
	namedAccountPromotionKeys
};
const telegramSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Telegram bot token"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Telegram bot token file"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use TELEGRAM_BOT_TOKEN"
			},
			envVars: ["TELEGRAM_BOT_TOKEN"]
		}
	},
	legacyAdapter: telegramSetupAdapter
});
//#endregion
//#region extensions/telegram/src/setup-plugin.ts
const TELEGRAM_CHANNEL = "telegram";
function createTelegramSetupPluginBase(params) {
	return {
		id: TELEGRAM_CHANNEL,
		setupContract: params.setupContract,
		meta: {
			...getChatChannelMeta(TELEGRAM_CHANNEL),
			quickstartAllowFrom: true
		},
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"group",
				"channel",
				"thread"
			],
			reactions: true,
			reactionSlots: "single",
			threads: true,
			media: true,
			tts: { voice: {
				synthesisTarget: "voice-note",
				captionedFinalText: true
			} },
			polls: true,
			nativeCommands: true,
			blockStreaming: true
		},
		reload: {
			configPrefixes: ["channels.telegram"],
			noopPrefixes: [
				"messages.inbound",
				"messages.ackReactionScope",
				...[
					"dmPolicy",
					"allowFrom",
					"groupAllowFrom",
					"groupPolicy",
					"replyToMode",
					"streaming",
					"textChunkLimit"
				].flatMap((key) => [`channels.telegram.${key}`, `channels.telegram.accounts.*.${key}`])
			]
		},
		configSchema: TelegramChannelConfigSchema,
		config: createTelegramPluginConfig(),
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		}
	};
}
//#endregion
//#region extensions/telegram/src/setup-surface.helpers.ts
const channel$1 = "telegram";
function ensureTelegramDefaultGroupMentionGate(cfg, accountId) {
	const resolved = resolveTelegramAccount({
		cfg,
		accountId
	});
	const wildcardGroup = resolved.config.groups?.["*"];
	if (wildcardGroup?.requireMention !== void 0) return cfg;
	return patchChannelConfigForAccount({
		cfg,
		channel: channel$1,
		accountId,
		patch: { groups: {
			...resolved.config.groups,
			"*": {
				...wildcardGroup,
				requireMention: true
			}
		} },
		setupSurface: telegramSetupAdapter
	});
}
function shouldShowTelegramDmAccessWarning(cfg, accountId) {
	const merged = mergeTelegramAccountConfig(cfg, accountId);
	const hasAllowFrom = Array.isArray(merged.allowFrom) && merged.allowFrom.some((entry) => normalizeOptionalString(String(entry)));
	return (merged.dmPolicy ?? "pairing") === "pairing" && !hasAllowFrom;
}
function buildTelegramDmAccessWarningLines(accountId) {
	const configBase = accountId === "default" ? "channels.telegram" : `channels.telegram.accounts.${accountId}`;
	return [
		"Your bot is using DM policy: pairing.",
		"Any Telegram user who discovers the bot can send pairing requests.",
		"For private use, configure an allowlist with your Telegram user id:",
		"  " + formatCliCommand(`openclaw config set ${configBase}.dmPolicy "allowlist"`),
		"  " + formatCliCommand(`openclaw config set ${configBase}.allowFrom '["YOUR_USER_ID"]'`),
		`Docs: ${formatDocsLink("/channels/pairing", "channels/pairing")}`
	];
}
const telegramSetupDmPolicy = createChannelDmPolicy({
	label: "Telegram",
	channel: channel$1,
	resolveAccount: (cfg, accountId) => {
		const resolvedAccountId = accountId ?? resolveDefaultTelegramAccountId(cfg);
		return {
			accountId: resolvedAccountId,
			config: mergeTelegramAccountConfig(cfg, resolvedAccountId)
		};
	},
	applyPatch: ({ cfg, requestedAccountId, account, patch }) => requestedAccountId == null && account.accountId !== "default" ? applySetupAccountConfigPatch({
		cfg,
		channelKey: channel$1,
		accountId: account.accountId,
		patch
	}) : patchChannelConfigForAccount({
		cfg,
		channel: channel$1,
		accountId: account.accountId,
		patch,
		setupSurface: telegramSetupAdapter
	}),
	promptAllowFrom: promptTelegramAllowFromForAccount
});
//#endregion
//#region extensions/telegram/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "telegram";
const telegramSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Telegram",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
		configuredHint: t("wizard.channels.statusRecommendedConfigured"),
		unconfiguredHint: t("wizard.channels.statusRecommendedNewcomerFriendly"),
		configuredScore: 1,
		unconfiguredScore: 10,
		resolveConfigured: ({ cfg, accountId }) => (accountId ? [accountId] : listTelegramAccountIds(cfg)).some((resolvedAccountId) => inspectTelegramAccount({
			cfg,
			accountId: resolvedAccountId
		}).configured)
	}),
	prepare: async ({ cfg, accountId, credentialValues }) => ({
		cfg: ensureTelegramDefaultGroupMentionGate(cfg, accountId),
		credentialValues
	}),
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "botToken",
		configuredFields: ["botToken", "tokenFile"],
		providerHint: channel,
		credentialLabel: t("wizard.telegram.botToken"),
		preferredEnvVar: "TELEGRAM_BOT_TOKEN",
		helpTitle: t("wizard.telegram.botToken"),
		helpLines: getTelegramTokenHelpLines(),
		envPrompt: t("wizard.telegram.tokenEnvPrompt"),
		keepPrompt: t("wizard.telegram.tokenKeepPrompt"),
		inputPrompt: t("wizard.telegram.tokenInputPrompt"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
		resolveAccount: ({ cfg, accountId }) => resolveTelegramAccount({
			cfg,
			accountId
		}),
		hasConfiguredValue: (account) => hasConfiguredSecretInput(account.config.botToken) || Boolean(account.config.tokenFile?.trim()),
		resolvedValue: (account) => normalizeOptionalString(account.token),
		envValue: ({ accountId }) => accountId === "default" ? normalizeOptionalString(process.env.TELEGRAM_BOT_TOKEN) : void 0
	})],
	allowFrom: createAllowFromSection({
		helpTitle: t("wizard.telegram.userIdTitle"),
		helpLines: getTelegramUserIdHelpLines(),
		message: t("wizard.telegram.allowFromPrompt"),
		placeholder: "123456789",
		invalidWithoutCredentialNote: t("wizard.telegram.allowFromInvalid"),
		parseInputs: splitSetupEntries,
		parseId: parseTelegramAllowFromId,
		apply: async ({ cfg, accountId, allowFrom }) => applyTelegramAllowFrom(cfg, accountId, allowFrom)
	}),
	finalize: async ({ cfg, accountId, prompter }) => {
		if (!shouldShowTelegramDmAccessWarning(cfg, accountId)) return;
		await prompter.note(buildTelegramDmAccessWarningLines(accountId).join("\n"), "Telegram DM access warning");
	},
	dmPolicy: telegramSetupDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
//#region extensions/telegram/src/channel.setup.ts
const telegramSetupPlugin = createTelegramSetupPluginBase({
	setupWizard: telegramSetupWizard,
	setupContract: telegramSetupContract
});
//#endregion
export { resolveTelegramConfigAccessorAccount as a, telegramSetupContract as i, telegramSetupWizard as n, telegramConfigAdapter as o, createTelegramSetupPluginBase as r, telegramSetupPlugin as t };
