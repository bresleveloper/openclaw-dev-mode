import { l as resolveMatrixEnvAuthReadiness } from "./account-selection-BHkfU1eC.mjs";
import { a as resolveMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { r as resolveDefaultMatrixAccountId } from "./accounts-iThMol10.mjs";
import { t as resolveMatrixConfigFieldPath } from "./config-paths-CnREYb1Y.mjs";
import { r as updateMatrixAccountConfig } from "./config-update-B_4qZ5bV.mjs";
import { t as isSupportedMatrixAvatarSource } from "./profile-ClrB3IgR.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID, addWildcardAllowFrom, applyAccountNameToChannelSection, normalizeAccountId, normalizeAllowFromEntries, normalizeSecretInputString, patchTopLevelChannelConfigSection, prepareScopedSetupConfig, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$1 } from "openclaw/plugin-sdk/routing";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
//#region extensions/matrix/src/setup-contract.ts
const matrixSingleAccountKeysToMove = [
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceId",
	"deviceName",
	"avatarUrl",
	"initialSyncLimit",
	"encryption",
	"allowlistOnly",
	"dangerouslyAllowNameMatching",
	"allowBots",
	"streaming",
	"replyToMode",
	"threadReplies",
	"textChunkLimit",
	"responsePrefix",
	"ackReaction",
	"ackReactionScope",
	"reactionNotifications",
	"threadBindings",
	"startupVerification",
	"startupVerificationCooldownHours",
	"mediaMaxMb",
	"autoJoin",
	"autoJoinAllowlist",
	"dm",
	"groups",
	"rooms",
	"actions"
];
const matrixNamedAccountPromotionKeys = [
	"name",
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceId",
	"deviceName",
	"avatarUrl",
	"initialSyncLimit",
	"encryption"
];
const singleAccountKeysToMove = [...matrixSingleAccountKeysToMove];
const namedAccountPromotionKeys = [...matrixNamedAccountPromotionKeys];
function resolveSingleAccountPromotionTarget(params) {
	const accounts = typeof params.channel.accounts === "object" && params.channel.accounts ? params.channel.accounts : {};
	const normalizedDefaultAccount = typeof params.channel.defaultAccount === "string" && params.channel.defaultAccount.trim() ? normalizeAccountId$1(params.channel.defaultAccount) : void 0;
	const matchedAccountId = normalizedDefaultAccount ? Object.entries(accounts).find(([accountId, value]) => accountId && value && typeof value === "object" && normalizeAccountId$1(accountId) === normalizedDefaultAccount)?.[0] : void 0;
	if (matchedAccountId) return matchedAccountId;
	if (normalizedDefaultAccount) return DEFAULT_ACCOUNT_ID$1;
	const namedAccounts = Object.entries(accounts).filter(([accountId, value]) => accountId && typeof value === "object" && value);
	if (namedAccounts.length === 1) {
		const onlyAccount = namedAccounts[0];
		if (onlyAccount) return onlyAccount[0];
	}
	if (namedAccounts.length > 1 && accounts[DEFAULT_ACCOUNT_ID$1] && typeof accounts[DEFAULT_ACCOUNT_ID$1] === "object") return DEFAULT_ACCOUNT_ID$1;
	return DEFAULT_ACCOUNT_ID$1;
}
//#endregion
//#region extensions/matrix/src/setup-config.ts
const channel$1 = "matrix";
const COMMON_SINGLE_ACCOUNT_KEYS_TO_MOVE = /* @__PURE__ */ new Set([
	"name",
	"enabled",
	"httpPort",
	"webhookPath",
	"webhookUrl",
	"webhookSecret",
	"service",
	"region",
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceName",
	"url",
	"code",
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom",
	"defaultTo"
]);
const MATRIX_SINGLE_ACCOUNT_KEYS_TO_MOVE = new Set(matrixSingleAccountKeysToMove);
const MATRIX_NAMED_ACCOUNT_PROMOTION_KEYS = new Set(matrixNamedAccountPromotionKeys);
function cloneIfObject(value) {
	if (value && typeof value === "object") return structuredClone(value);
	return value;
}
function resolveSetupAvatarUrl(input) {
	const avatarUrl = input.avatarUrl;
	if (typeof avatarUrl !== "string") return;
	return avatarUrl.trim() || void 0;
}
function resolveExistingMatrixAccountKey(accounts, targetAccountId) {
	const normalizedTargetAccountId = normalizeAccountId(targetAccountId);
	return Object.keys(accounts).find((accountId) => normalizeAccountId(accountId) === normalizedTargetAccountId) ?? targetAccountId;
}
function moveSingleMatrixAccountConfigToNamedAccount(cfg) {
	const baseConfig = cfg.channels?.[channel$1];
	const base = typeof baseConfig === "object" && baseConfig ? baseConfig : void 0;
	if (!base) return cfg;
	const accounts = typeof base.accounts === "object" && base.accounts ? base.accounts : {};
	const hasNamedAccounts = Object.keys(accounts).some(Boolean);
	const keysToMove = Object.entries(base).filter(([key, value]) => {
		if (key === "accounts" || key === "enabled" || value === void 0) return false;
		if (!COMMON_SINGLE_ACCOUNT_KEYS_TO_MOVE.has(key) && !MATRIX_SINGLE_ACCOUNT_KEYS_TO_MOVE.has(key)) return false;
		if (hasNamedAccounts && !MATRIX_NAMED_ACCOUNT_PROMOTION_KEYS.has(key)) return false;
		return true;
	}).map(([key]) => key);
	if (keysToMove.length === 0) return cfg;
	const resolvedTargetAccountId = resolveExistingMatrixAccountKey(accounts, resolveSingleAccountPromotionTarget({ channel: base }));
	const nextAccount = { ...accounts[resolvedTargetAccountId] };
	for (const key of keysToMove) nextAccount[key] = cloneIfObject(base[key]);
	return patchTopLevelChannelConfigSection({
		cfg,
		channel: channel$1,
		clearFields: keysToMove,
		patch: { accounts: {
			...accounts,
			[resolvedTargetAccountId]: nextAccount
		} }
	});
}
function validateMatrixSetupInput(params) {
	const input = params.input;
	const avatarUrl = resolveSetupAvatarUrl(input);
	if (avatarUrl && !isSupportedMatrixAvatarSource(avatarUrl)) return "Matrix avatar URL must be an mxc:// URI or an http(s) URL.";
	if (input.useEnv) {
		const envReadiness = resolveMatrixEnvAuthReadiness(params.accountId, process.env);
		return envReadiness.ready ? null : envReadiness.missingMessage;
	}
	if (!input.homeserver?.trim()) return "Matrix requires --homeserver";
	const accessToken = input.accessToken?.trim();
	const password = normalizeSecretInputString(input.password);
	const userId = input.userId?.trim();
	if (!accessToken && !password) return "Matrix requires --access-token or --password";
	if (!accessToken) {
		if (!userId) return "Matrix requires --user-id when using --password";
		if (!password) return "Matrix requires --password when using --user-id";
	}
	return null;
}
function applyMatrixSetupAccountConfig(params) {
	const input = params.input;
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const migratedCfg = normalizedAccountId !== DEFAULT_ACCOUNT_ID ? moveSingleMatrixAccountConfigToNamedAccount(params.cfg) : params.cfg;
	const next = applyAccountNameToChannelSection({
		cfg: migratedCfg,
		channelKey: channel$1,
		accountId: normalizedAccountId,
		name: input.name
	});
	const avatarUrl = resolveSetupAvatarUrl(input);
	if (input.useEnv) return updateMatrixAccountConfig(next, normalizedAccountId, {
		enabled: true,
		homeserver: null,
		allowPrivateNetwork: null,
		proxy: null,
		userId: null,
		accessToken: null,
		password: null,
		deviceId: null,
		deviceName: null,
		avatarUrl
	});
	const accessToken = input.accessToken?.trim();
	const password = normalizeSecretInputString(input.password);
	const userId = input.userId?.trim();
	return updateMatrixAccountConfig(next, normalizedAccountId, {
		enabled: true,
		homeserver: input.homeserver?.trim(),
		allowPrivateNetwork: typeof input.dangerouslyAllowPrivateNetwork === "boolean" ? input.dangerouslyAllowPrivateNetwork : typeof input.allowPrivateNetwork === "boolean" ? input.allowPrivateNetwork : void 0,
		proxy: normalizeOptionalString(input.proxy),
		userId: password && !userId ? null : userId,
		accessToken: accessToken || (password ? null : void 0),
		password: password || (accessToken ? null : void 0),
		deviceName: input.deviceName?.trim(),
		avatarUrl,
		initialSyncLimit: input.initialSyncLimit
	});
}
//#endregion
//#region extensions/matrix/src/setup-dm-policy.ts
function resolveMatrixSetupDmAllowFrom(policy, allowFrom) {
	if (policy === "open") return addWildcardAllowFrom(allowFrom);
	return normalizeAllowFromEntries(allowFrom ?? []).filter((entry) => entry !== "*");
}
function createMatrixSetupDmPolicy(promptAllowFrom) {
	return createChannelDmPolicy({
		label: "Matrix",
		channel: "matrix",
		policyPath: "dm.policy",
		allowFromPath: "dm.allowFrom",
		resolveAccount: (cfg, accountId) => {
			const resolvedCfg = cfg;
			const resolvedAccountId = normalizeAccountId(accountId?.trim() || resolveDefaultMatrixAccountId(resolvedCfg) || DEFAULT_ACCOUNT_ID);
			const config = resolveMatrixAccountConfig({
				cfg: resolvedCfg,
				accountId: resolvedAccountId
			});
			return {
				accountId: resolvedAccountId,
				config: {
					dmPolicy: config.dm?.policy,
					allowFrom: config.dm?.allowFrom,
					dm: config.dm
				}
			};
		},
		resolveConfigKeys: ({ cfg, account }) => ({
			policyKey: resolveMatrixConfigFieldPath(cfg, account.accountId, "dm.policy"),
			allowFromKey: resolveMatrixConfigFieldPath(cfg, account.accountId, "dm.allowFrom")
		}),
		resolveAllowFrom: ({ policy, account }) => resolveMatrixSetupDmAllowFrom(policy, account.config.allowFrom),
		buildPatch: ({ account, policy, allowFrom }) => ({ dm: {
			...account.config.dm,
			policy,
			allowFrom
		} }),
		applyPatch: ({ cfg, account, patch }) => updateMatrixAccountConfig(cfg, account.accountId, patch),
		promptAllowFrom
	});
}
//#endregion
//#region extensions/matrix/src/setup-core.ts
const channel = "matrix";
function resolveMatrixSetupAccountId(params) {
	return normalizeAccountId(params.accountId?.trim() || params.name?.trim() || DEFAULT_ACCOUNT_ID);
}
function createMatrixSetupWizardProxy(loadWizardModule) {
	let wizardPromise = null;
	const loadWizard = () => {
		wizardPromise ??= loadWizardModule().then((module) => module.matrixSetupWizard);
		return wizardPromise;
	};
	return {
		channel,
		getStatus: async (ctx) => await (await loadWizard()).getStatus(ctx),
		configure: async (ctx) => await (await loadWizard()).configure(ctx),
		configureInteractive: async (ctx) => {
			const wizard = await loadWizard();
			return await (wizard.configureInteractive ?? wizard.configure)(ctx);
		},
		configureWhenConfigured: async (ctx) => {
			const wizard = await loadWizard();
			return await (wizard.configureWhenConfigured ?? wizard.configureInteractive ?? wizard.configure)(ctx);
		},
		afterConfigWritten: async (ctx) => await (await loadWizard()).afterConfigWritten?.(ctx),
		dmPolicy: createMatrixSetupDmPolicy(async (params) => {
			const promptAllowFrom = (await loadWizard()).dmPolicy?.promptAllowFrom;
			return promptAllowFrom ? await promptAllowFrom(params) : params.cfg;
		}),
		disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
	};
}
const matrixSetupAdapter = {
	singleAccountKeysToMove,
	namedAccountPromotionKeys,
	resolveSingleAccountPromotionTarget,
	resolveAccountId: ({ accountId, input }) => resolveMatrixSetupAccountId({
		accountId,
		name: input?.name
	}),
	resolveBindingAccountId: ({ accountId, agentId }) => resolveMatrixSetupAccountId({
		accountId,
		name: agentId
	}),
	applyAccountName: ({ cfg, accountId, name }) => prepareScopedSetupConfig({
		cfg,
		channelKey: channel,
		accountId,
		name
	}),
	validateInput: ({ accountId, input }) => validateMatrixSetupInput({
		accountId,
		input
	}),
	applyAccountConfig: ({ cfg, accountId, input }) => applyMatrixSetupAccountConfig({
		cfg,
		accountId,
		input
	}),
	afterAccountConfigWritten: async ({ previousCfg, cfg, accountId, runtime }) => {
		const { runMatrixSetupBootstrapAfterConfigWrite } = await import("./setup-bootstrap-A_WGFq1Y.mjs");
		await runMatrixSetupBootstrapAfterConfigWrite({
			previousCfg,
			cfg,
			accountId,
			runtime
		});
	}
};
const matrixSetupContract = defineChannelSetupContract({
	fields: {
		homeserver: {
			kind: "string",
			cli: {
				flags: "--homeserver <url>",
				description: "Matrix homeserver URL"
			}
		},
		userId: {
			kind: "string",
			cli: {
				flags: "--user-id <id>",
				description: "Matrix user id"
			}
		},
		accessToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--access-token <token>",
				description: "Matrix access token"
			}
		},
		password: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--password <password>",
				description: "Matrix password"
			}
		},
		deviceName: {
			kind: "string",
			cli: {
				flags: "--device-name <name>",
				description: "Matrix device name"
			}
		},
		avatarUrl: {
			kind: "string",
			cli: {
				flags: "--avatar-url <url>",
				description: "Matrix avatar URL"
			}
		},
		initialSyncLimit: {
			kind: "integer",
			cli: {
				flags: "--initial-sync-limit <n>",
				description: "Matrix initial sync room limit"
			}
		},
		proxy: {
			kind: "string",
			cli: {
				flags: "--proxy <url>",
				description: "Matrix proxy URL"
			}
		},
		dangerouslyAllowPrivateNetwork: {
			kind: "boolean",
			cli: {
				flags: "--dangerously-allow-private-network",
				description: "Allow private-network Matrix homeservers"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Matrix environment credentials"
			}
		}
	},
	legacyAdapter: matrixSetupAdapter
});
//#endregion
export { moveSingleMatrixAccountConfigToNamedAccount as a, singleAccountKeysToMove as c, createMatrixSetupDmPolicy as i, matrixSetupAdapter as n, namedAccountPromotionKeys as o, matrixSetupContract as r, resolveSingleAccountPromotionTarget as s, createMatrixSetupWizardProxy as t };
