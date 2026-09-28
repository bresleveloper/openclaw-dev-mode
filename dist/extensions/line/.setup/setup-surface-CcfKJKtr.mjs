import { i as resolveLineAccount, n as normalizeAccountId, r as resolveDefaultLineAccountId, t as listLineAccountIds } from "./accounts-BBEFMYbY.mjs";
import { n as parseLineAllowFromId, t as hasLineCredentials } from "./account-helpers-BSUyZwLm.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID, createAllowFromSection, createPromptParsedAllowFromForAccount, createSetupInputPresenceValidator, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, formatDocsLink, parseSetupEntriesWithParser, patchScopedAccountConfig, setSetupChannelEnabled, splitSetupEntries } from "openclaw/plugin-sdk/setup";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
//#region extensions/line/src/setup-core.ts
function patchLineAccountConfig(params) {
	return patchScopedAccountConfig({
		cfg: params.cfg,
		channelKey: "line",
		accountId: params.accountId,
		patch: params.patch,
		accountPatch: {
			...params.enabled ? { enabled: true } : {},
			...params.patch
		},
		...params.clearFields ? { clearFields: params.clearFields } : {},
		ensureChannelEnabled: Boolean(params.enabled),
		ensureAccountEnabled: false
	});
}
function isLineConfigured(cfg, accountId) {
	return hasLineCredentials(resolveLineAccount({
		cfg,
		accountId
	}));
}
const accountCredentialKeys = [
	"channelAccessToken",
	"channelSecret",
	"tokenFile",
	"secretFile"
];
const lineSetupAdapter = {
	singleAccountKeysToMove: accountCredentialKeys,
	namedAccountPromotionKeys: accountCredentialKeys,
	resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
	applyAccountName: ({ cfg, accountId, name }) => patchLineAccountConfig({
		cfg,
		accountId,
		patch: name?.trim() ? { name: name.trim() } : {}
	}),
	validateInput: createSetupInputPresenceValidator({
		defaultAccountOnlyEnvError: "LINE_CHANNEL_ACCESS_TOKEN can only be used for the default account.",
		whenNotUseEnv: [{
			someOf: [
				"channelAccessToken",
				"token",
				"tokenFile"
			],
			message: "LINE requires channelAccessToken or --token-file (or --use-env)."
		}, {
			someOf: ["channelSecret", "secretFile"],
			message: "LINE requires channelSecret or --secret-file (or --use-env)."
		}]
	}),
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const typedInput = input;
		const accessToken = typedInput.channelAccessToken ?? typedInput.token;
		const normalizedAccountId = normalizeAccountId(accountId);
		const useEnv = normalizedAccountId === DEFAULT_ACCOUNT_ID && Boolean(typedInput.useEnv);
		const credentials = [{
			fileKey: "tokenFile",
			file: typedInput.tokenFile,
			inlineKey: "channelAccessToken",
			inline: accessToken
		}, {
			fileKey: "secretFile",
			file: typedInput.secretFile,
			inlineKey: "channelSecret",
			inline: typedInput.channelSecret
		}];
		const patch = {};
		const retired = [];
		for (const credential of credentials) if (credential.file) {
			patch[credential.fileKey] = credential.file;
			retired.push(credential.inlineKey);
		} else if (credential.inline) {
			patch[credential.inlineKey] = credential.inline;
			retired.push(credential.fileKey);
		}
		return patchLineAccountConfig({
			cfg,
			accountId: normalizedAccountId,
			enabled: true,
			clearFields: useEnv ? [
				"channelAccessToken",
				"channelSecret",
				"tokenFile",
				"secretFile"
			] : retired.length > 0 ? retired : void 0,
			patch: useEnv ? {} : patch
		});
	}
};
const lineSetupContract = defineChannelSetupContract({
	fields: {
		channelAccessToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--channel-access-token <token>",
				description: "LINE channel access token"
			}
		},
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "LINE channel access token (alias)"
			}
		},
		channelSecret: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--channel-secret <secret>",
				description: "LINE channel secret"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "LINE access token file"
			}
		},
		secretFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--secret-file <path>",
				description: "LINE channel secret file"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use LINE environment credentials"
			},
			envVars: ["LINE_CHANNEL_ACCESS_TOKEN", "LINE_CHANNEL_SECRET"]
		}
	},
	legacyAdapter: lineSetupAdapter
});
//#endregion
//#region extensions/line/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "line";
const LINE_SETUP_HELP_LINES = [
	t("wizard.line.helpOpenConsole"),
	t("wizard.line.helpCopyCredentials"),
	t("wizard.line.helpEnableWebhook"),
	t("wizard.line.helpWebhookUrl"),
	t("wizard.channels.docs", { link: formatDocsLink("/channels/line", "channels/line") })
];
const LINE_ALLOW_FROM_HELP_LINES = [
	t("wizard.line.allowlistIntro"),
	t("wizard.line.idsCaseSensitive"),
	t("wizard.line.examples"),
	"- U1234567890abcdef1234567890abcdef",
	"- line:user:U1234567890abcdef1234567890abcdef",
	t("wizard.line.multipleEntries"),
	t("wizard.channels.docs", { link: formatDocsLink("/channels/line", "channels/line") })
];
const promptLineAllowFrom = createPromptParsedAllowFromForAccount({
	defaultAccountId: resolveDefaultLineAccountId,
	noteTitle: t("wizard.line.allowlistTitle"),
	noteLines: LINE_ALLOW_FROM_HELP_LINES,
	message: t("wizard.line.allowFromPrompt"),
	placeholder: "U1234567890abcdef1234567890abcdef",
	parseEntries: (raw) => parseSetupEntriesWithParser(raw, (entry) => {
		const id = parseLineAllowFromId(entry);
		return id ? { value: id } : { error: t("wizard.line.allowFromInvalid") };
	}),
	getExistingAllowFrom: ({ cfg, accountId }) => resolveLineAccount({
		cfg,
		accountId
	}).config.allowFrom ?? [],
	applyAllowFrom: ({ cfg, accountId, allowFrom }) => patchLineAccountConfig({
		cfg,
		accountId,
		enabled: true,
		patch: { allowFrom }
	})
});
const lineDmPolicy = createChannelDmPolicy({
	label: "LINE",
	channel,
	resolveAccount: (cfg, accountId) => resolveLineAccount({
		cfg,
		accountId: accountId ?? resolveDefaultLineAccountId(cfg)
	}),
	applyPatch: ({ cfg, account, patch }) => patchLineAccountConfig({
		cfg,
		accountId: account.accountId,
		enabled: true,
		patch,
		clearFields: patch.dmPolicy === "pairing" || patch.dmPolicy === "disabled" ? ["allowFrom"] : void 0
	}),
	promptAllowFrom: promptLineAllowFrom
});
function createLineTokenCredential(params) {
	return defineTokenCredential({
		inputKey: params.inputKey,
		configKey: params.configKey,
		configuredFields: [params.configKey, params.fileKey],
		providerHint: params.providerHint,
		credentialLabel: params.credentialLabel,
		preferredEnvVar: params.envVar,
		helpTitle: t("wizard.line.messagingApiTitle"),
		helpLines: LINE_SETUP_HELP_LINES,
		envPrompt: params.envPrompt,
		keepPrompt: params.keepPrompt,
		inputPrompt: params.inputPrompt,
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
		resolveAccount: ({ cfg, accountId }) => resolveLineAccount({
			cfg,
			accountId
		}),
		accountConfigured: (account) => Boolean(normalizeOptionalString(account.channelAccessToken) && normalizeOptionalString(account.channelSecret)),
		hasConfiguredValue: (account) => Boolean(normalizeOptionalString(account.config[params.configKey]) ?? normalizeOptionalString(account.config[params.fileKey])),
		resolvedValue: (account) => normalizeOptionalString(account[params.configKey]),
		envValue: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID ? normalizeOptionalString(process.env[params.envVar]) : void 0,
		patchAccount: ({ cfg, accountId, patch, clearFields }) => patchLineAccountConfig({
			cfg,
			accountId,
			enabled: true,
			clearFields,
			patch
		}),
		useEnv: { clearFields: [params.configKey, params.fileKey] },
		set: {
			clearFields: [params.fileKey],
			value: "resolved"
		}
	});
}
const lineSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "LINE",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsTokenSecret"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsTokenSecret"),
		configuredScore: 1,
		unconfiguredScore: 0,
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => isLineConfigured(cfg, accountId ?? resolveDefaultLineAccountId(cfg)),
		resolveExtraStatusLines: ({ cfg }) => [`Accounts: ${listLineAccountIds(cfg).length || 0}`]
	}),
	introNote: {
		title: t("wizard.line.messagingApiTitle"),
		lines: LINE_SETUP_HELP_LINES,
		shouldShow: ({ cfg, accountId }) => !isLineConfigured(cfg, accountId ?? resolveDefaultLineAccountId(cfg))
	},
	credentials: [createLineTokenCredential({
		inputKey: "token",
		configKey: "channelAccessToken",
		fileKey: "tokenFile",
		providerHint: channel,
		credentialLabel: t("wizard.line.channelAccessToken"),
		envVar: "LINE_CHANNEL_ACCESS_TOKEN",
		envPrompt: t("wizard.line.tokenEnvPrompt"),
		keepPrompt: t("wizard.line.tokenKeepPrompt"),
		inputPrompt: t("wizard.line.tokenInputPrompt")
	}), createLineTokenCredential({
		inputKey: "password",
		configKey: "channelSecret",
		fileKey: "secretFile",
		providerHint: "line-secret",
		credentialLabel: t("wizard.line.channelSecret"),
		envVar: "LINE_CHANNEL_SECRET",
		envPrompt: t("wizard.line.secretEnvPrompt"),
		keepPrompt: t("wizard.line.secretKeepPrompt"),
		inputPrompt: t("wizard.line.secretInputPrompt")
	})],
	allowFrom: createAllowFromSection({
		helpTitle: t("wizard.line.allowlistTitle"),
		helpLines: LINE_ALLOW_FROM_HELP_LINES,
		message: t("wizard.line.allowFromPrompt"),
		placeholder: "U1234567890abcdef1234567890abcdef",
		invalidWithoutCredentialNote: t("wizard.line.allowFromInvalid"),
		parseInputs: splitSetupEntries,
		parseId: parseLineAllowFromId,
		apply: ({ cfg, accountId, allowFrom }) => patchLineAccountConfig({
			cfg,
			accountId,
			enabled: true,
			patch: {
				dmPolicy: "allowlist",
				allowFrom
			}
		})
	}),
	dmPolicy: lineDmPolicy,
	completionNote: {
		title: t("wizard.line.webhookTitle"),
		lines: [
			t("wizard.line.completionEnableWebhook"),
			t("wizard.line.completionDefaultWebhook"),
			t("wizard.line.completionWebhookPath"),
			t("wizard.channels.docs", { link: formatDocsLink("/channels/line", "channels/line") })
		]
	},
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { lineSetupAdapter as n, lineSetupContract as r, lineSetupWizard as t };
