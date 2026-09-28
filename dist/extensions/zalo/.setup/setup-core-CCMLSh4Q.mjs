import { createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveAccountEntry } from "openclaw/plugin-sdk/routing";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
import { buildSecretInputSchema, normalizeSecretInputString, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, createDelegatedSetupWizardProxy, createPatchedAccountSetupAdapter, createSetupInputPresenceValidator, createSetupTranslator, formatDocsLink, mergeAllowFromEntries, normalizeAccountId as normalizeAccountId$1, patchScopedAccountConfig, patchTopLevelChannelConfigSection, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
//#region extensions/zalo/src/token.ts
function readTokenFromFile(tokenFile, configPath) {
	const result = tryReadSecretFileSync(tokenFile, "Zalo token file", { rejectSymlink: true }, { configPath });
	return result.status === "available" ? {
		token: result.value,
		source: "configFile",
		status: "available"
	} : {
		token: "",
		source: "configFile",
		status: "configured_unavailable",
		credentialDiagnostics: [result.diagnostic]
	};
}
function resolveZaloToken(config, accountId, options) {
	const resolvedAccountId = normalizeAccountId(accountId ?? config?.defaultAccount);
	const isDefaultAccount = resolvedAccountId === DEFAULT_ACCOUNT_ID;
	const baseConfig = config;
	const accountConfig = resolveAccountEntry(baseConfig?.accounts, normalizeAccountId(resolvedAccountId));
	const accountHasBotToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "botToken"));
	if (accountConfig && accountHasBotToken) {
		const token = resolveSecretInputString({
			value: accountConfig.botToken,
			path: `channels.zalo.accounts.${resolvedAccountId}.botToken`,
			mode: options?.mode
		});
		if (token.status === "available") return {
			token: token.value,
			source: "config",
			status: "available"
		};
		if (token.status === "configured_unavailable") return {
			token: "",
			source: "config",
			status: "configured_unavailable"
		};
	}
	if (accountConfig?.tokenFile?.trim()) return readTokenFromFile(accountConfig.tokenFile, `channels.zalo.accounts.${resolvedAccountId}.tokenFile`);
	if (!accountHasBotToken) {
		const token = resolveSecretInputString({
			value: baseConfig?.botToken,
			path: "channels.zalo.botToken",
			mode: options?.mode
		});
		if (token.status === "available") return {
			token: token.value,
			source: "config",
			status: "available"
		};
		if (token.status === "configured_unavailable") return {
			token: "",
			source: "config",
			status: "configured_unavailable"
		};
		if (baseConfig?.tokenFile?.trim()) return readTokenFromFile(baseConfig.tokenFile, "channels.zalo.tokenFile");
	}
	if (isDefaultAccount) {
		const envToken = process.env.ZALO_BOT_TOKEN?.trim();
		if (envToken) return {
			token: envToken,
			source: "env",
			status: "available"
		};
	}
	return {
		token: "",
		source: "none",
		status: "missing"
	};
}
//#endregion
//#region extensions/zalo/src/accounts.ts
const { listAccountIds: listZaloAccountIds, resolveDefaultAccountId: resolveDefaultZaloAccountId, resolveAccountConfig: mergeZaloAccountConfig } = createAccountListHelpers("zalo", {
	omitKeys: ["defaultAccount"],
	implicitDefaultAccount: {
		channelKeys: ["botToken", "tokenFile"],
		envVars: ["ZALO_BOT_TOKEN"]
	}
});
function resolveZaloAccountWithMode(params) {
	const accountId = normalizeAccountId(params.accountId ?? (params.cfg.channels?.zalo)?.defaultAccount);
	const baseEnabled = (params.cfg.channels?.zalo)?.enabled !== false;
	const merged = mergeZaloAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const tokenResolution = resolveZaloToken(params.cfg.channels?.zalo, accountId, { mode: params.mode });
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		token: tokenResolution.token,
		tokenSource: tokenResolution.source,
		tokenStatus: tokenResolution.status,
		...tokenResolution.credentialDiagnostics ? { credentialDiagnostics: tokenResolution.credentialDiagnostics } : {},
		config: merged
	};
}
function resolveZaloAccount(params) {
	return resolveZaloAccountWithMode({
		...params,
		mode: "strict"
	});
}
function inspectZaloAccount(params) {
	const account = resolveZaloAccountWithMode({
		...params,
		mode: "inspect"
	});
	return {
		...account,
		configured: isZaloAccountConfigured(account),
		mode: account.config.webhookUrl ? "webhook" : "polling",
		dmPolicy: account.config.dmPolicy ?? "pairing"
	};
}
function isZaloAccountConfigured(account) {
	return account.tokenStatus ? account.tokenStatus !== "missing" : Boolean(account.token?.trim());
}
//#endregion
//#region extensions/zalo/src/setup-allow-from.ts
const t$1 = createSetupTranslator();
async function noteZaloTokenHelp(prompter) {
	await prompter.note([
		t$1("wizard.zalo.helpOpenPlatform"),
		t$1("wizard.zalo.helpCreateBot"),
		t$1("wizard.zalo.helpTokenFormat"),
		t$1("wizard.zalo.helpEnvTip"),
		`Docs: ${formatDocsLink("/channels/zalo", "zalo")}`
	].join("\n"), t$1("wizard.zalo.botTokenTitle"));
}
async function promptZaloAllowFrom(params) {
	const { cfg, prompter } = params;
	const accountId = params.accountId ?? resolveDefaultZaloAccountId(cfg);
	const existingAllowFrom = resolveZaloAccount({
		cfg,
		accountId
	}).config.allowFrom ?? [];
	const normalized = (await prompter.text({
		message: t$1("wizard.zalo.allowFromPrompt"),
		placeholder: "123456789",
		initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : void 0,
		validate: (value) => {
			const raw = (value ?? "").trim();
			if (!raw) return t$1("common.required");
			if (!/^\d+$/.test(raw)) return t$1("wizard.zalo.allowFromNumeric");
		}
	})).trim();
	const unique = mergeAllowFromEntries(existingAllowFrom, [normalized]);
	const currentAccount = cfg.channels?.zalo?.accounts?.[accountId];
	return patchTopLevelChannelConfigSection({
		cfg,
		channel: "zalo",
		enabled: true,
		patch: accountId === DEFAULT_ACCOUNT_ID$1 ? {
			dmPolicy: "allowlist",
			allowFrom: unique
		} : { accounts: {
			...cfg.channels?.zalo?.accounts,
			[accountId]: {
				...currentAccount,
				enabled: currentAccount?.enabled ?? true,
				dmPolicy: "allowlist",
				allowFrom: unique
			}
		} }
	});
}
//#endregion
//#region extensions/zalo/src/setup-core.ts
const t = createSetupTranslator();
const channel = "zalo";
const zaloSetupAdapter = {
	...createPatchedAccountSetupAdapter({
		channelKey: channel,
		validateInput: createSetupInputPresenceValidator({
			defaultAccountOnlyEnvError: "ZALO_BOT_TOKEN can only be used for the default account.",
			whenNotUseEnv: [{
				someOf: ["token", "tokenFile"],
				message: "Zalo requires token or --token-file (or --use-env)."
			}]
		}),
		buildPatch: (input) => input.useEnv ? {} : input.tokenFile ? { tokenFile: input.tokenFile } : input.token ? { botToken: input.token } : {}
	}),
	singleAccountKeysToMove: ["webhookSecret", "tokenFile"]
};
const zaloSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "Zalo bot token"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Zalo bot token file"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use ZALO_BOT_TOKEN"
			},
			envVars: ["ZALO_BOT_TOKEN"]
		}
	},
	legacyAdapter: zaloSetupAdapter
});
const zaloDmPolicy = createChannelDmPolicy({
	label: "Zalo",
	channel,
	resolveAccount: (cfg, accountId) => {
		return resolveZaloAccount({
			cfg,
			accountId: accountId && normalizeAccountId$1(accountId) ? normalizeAccountId$1(accountId) ?? DEFAULT_ACCOUNT_ID$1 : resolveDefaultZaloAccountId(cfg)
		});
	},
	applyPatch: ({ cfg, account, patch }) => patchScopedAccountConfig({
		cfg,
		channelKey: channel,
		accountId: account.accountId,
		patch
	}),
	promptAllowFrom: async ({ cfg, prompter, accountId }) => promptZaloAllowFrom({
		cfg,
		prompter,
		accountId: accountId ?? resolveDefaultZaloAccountId(cfg)
	})
});
function createZaloSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel,
		loadWizard,
		status: {
			configuredLabel: t("wizard.channels.statusConfigured"),
			unconfiguredLabel: t("wizard.channels.statusNeedsToken"),
			configuredHint: t("wizard.channels.statusRecommendedConfigured"),
			unconfiguredHint: t("wizard.channels.statusRecommendedNewcomerFriendly"),
			configuredScore: 1,
			unconfiguredScore: 10
		},
		credentials: [],
		delegateFinalize: true,
		dmPolicy: zaloDmPolicy,
		disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
	});
}
//#endregion
export { noteZaloTokenHelp as a, isZaloAccountConfigured as c, resolveZaloAccount as d, resolveZaloToken as f, zaloSetupContract as i, listZaloAccountIds as l, normalizeSecretInputString as m, zaloDmPolicy as n, promptZaloAllowFrom as o, buildSecretInputSchema as p, zaloSetupAdapter as r, inspectZaloAccount as s, createZaloSetupWizardProxy as t, resolveDefaultZaloAccountId as u };
