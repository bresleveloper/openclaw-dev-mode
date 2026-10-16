import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-DsPRn9Dz.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { t as defineChannelSetupContract } from "./setup-contract-CSCVWILe.mjs";
import { o as getChatChannelMeta } from "./registry-B3Y-vjit.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { a as mergeTelegramAccountConfig } from "./account-selection-DV4XVSJR.mjs";
import { a as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-BApaQcwN.mjs";
import { t as createSetupTranslator } from "./i18n-Cuh2pEdZ.mjs";
import { n as applySetupAccountConfigPatch, r as createEnvPatchedAccountSetupAdapter } from "./setup-helpers-CDK4xLs4.mjs";
import { N as splitSetupEntries, a as createAllowFromSection, b as patchChannelConfigForAccount, j as setSetupChannelEnabled, s as createStandardChannelSetupStatus, w as promptResolvedAllowFrom } from "./setup-wizard-helpers-Z9EJ5vhW.mjs";
import { n as defineTokenCredential } from "./setup-credential-BC9vFRHC.mjs";
import "./setup-CndW71k-.mjs";
import "./setup-runtime-DOT6R9ta.mjs";
import "./channel-setup-3Vo3OXJK.mjs";
import "./setup-tools-D6A0I-Kz.mjs";
import { t as formatAllowFromLowercase } from "./allow-from-BjoTaQXB.mjs";
import { t as createChannelDmPolicy } from "./channel-dm-policy-COI4bLVD.mjs";
import "./channel-plugin-common-C4xb7Yqq.mjs";
import { a as resolveTelegramAccount, i as resolveDefaultTelegramAccountId, r as listTelegramAccountIds } from "./accounts-Dt8wbZ2I.mjs";
import { r as normalizeTelegramAllowFromEntry, t as isNumericTelegramSenderUserId } from "./allow-from-Byf7JKVc.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-DoeQ6S2Q.mjs";
import { n as singleAccountKeysToMove, t as namedAccountPromotionKeys } from "./setup-contract-CDcIs5O0.mjs";
import { t as TelegramChannelConfigSchema } from "./config-schema-zcv_WTxx.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-CHMKkiPW.mjs";
//#region extensions/telegram/src/config-adapter.ts
const TELEGRAM_CHANNEL$1 = "telegram";
function resolveTelegramConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultTelegramAccountId(params.cfg));
	return { config: mergeTelegramAccountConfig(params.cfg, accountId) };
}
const telegramConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: TELEGRAM_CHANNEL$1,
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
		resolveEntries: async ({ entries }) => entries.map((entry) => {
			const id = parseTelegramAllowFromId(entry);
			return {
				input: entry,
				resolved: Boolean(id),
				id
			};
		})
	});
	return patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: channel$2,
		accountId,
		patch: {
			dmPolicy: "allowlist",
			allowFrom: unique
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
	const policy = merged.dmPolicy ?? "pairing";
	const hasAllowFrom = Array.isArray(merged.allowFrom) && merged.allowFrom.some((entry) => normalizeOptionalString(String(entry)));
	return policy === "pairing" && !hasAllowFrom;
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
		resolveConfigured: ({ cfg, accountId }) => (accountId ? [accountId] : listTelegramAccountIds(cfg)).some((resolvedAccountId) => {
			return inspectTelegramAccount({
				cfg,
				accountId: resolvedAccountId
			}).configured;
		})
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
		resolveEntries: async ({ entries }) => entries.map((entry) => {
			const id = parseTelegramAllowFromId(entry);
			return {
				input: entry,
				resolved: Boolean(id),
				id
			};
		}),
		apply: async ({ cfg, accountId, allowFrom }) => patchChannelConfigForAccount({
			cfg,
			channel,
			accountId,
			patch: {
				dmPolicy: "allowlist",
				allowFrom
			},
			setupSurface: telegramSetupAdapter
		})
	}),
	finalize: async ({ cfg, accountId, prompter }) => {
		if (!shouldShowTelegramDmAccessWarning(cfg, accountId)) return;
		await prompter.note(buildTelegramDmAccessWarningLines(accountId).join("\n"), "Telegram DM access warning");
	},
	dmPolicy: telegramSetupDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
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
//#region extensions/telegram/src/channel.setup.ts
const telegramSetupPlugin = createTelegramSetupPluginBase({
	setupWizard: telegramSetupWizard,
	setupContract: telegramSetupContract
});
//#endregion
export { resolveTelegramConfigAccessorAccount as a, telegramSetupContract as i, createTelegramSetupPluginBase as n, telegramConfigAdapter as o, telegramSetupWizard as r, telegramSetupPlugin as t };
