import { n as __exportAll } from "./runtime-doctor-migrations-hxP-CXX7.mjs";
import { a as resolveConfiguredMatrixAccountIds, d as resolveScopedMatrixEnvConfig, f as resolveMatrixAccountStringValues, l as resolveGlobalMatrixEnvConfig, s as resolveMatrixDefaultOrOnlyAccountId, u as resolveMatrixEnvAuthReadiness } from "./account-selection-CWsL5zIU.mjs";
import { a as resolveMatrixAccountConfig, o as resolveMatrixBaseConfig, t as findMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { a as loadMatrixCredentials, o as loadMatrixCredentialsAsync, r as credentialsMatchConfig, t as captureMatrixCredentialsEnv } from "./credentials-read-Dj7Hj87M.mjs";
import { n as resolveMatrixConfigPath, r as shouldStoreMatrixAccountAtTopLevel, t as resolveMatrixConfigFieldPath } from "./config-paths-CnREYb1Y.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { coerceSecretRef, hasConfiguredSecretInput, normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, addWildcardAllowFrom, applyAccountNameToChannelSection, normalizeAccountId as normalizeAccountId$1, normalizeAllowFromEntries, normalizeSecretInputString as normalizeSecretInputString$1, patchTopLevelChannelConfigSection, prepareScopedSetupConfig, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$2, normalizeAccountId as normalizeAccountId$2 } from "openclaw/plugin-sdk/routing";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
//#region extensions/matrix/src/matrix/accounts.ts
function clean(value) {
	return normalizeOptionalString(value) ?? "";
}
function resolveMatrixAccountAuthView(params) {
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const matrix = resolveMatrixBaseConfig(params.cfg);
	const account = findMatrixAccountConfig(params.cfg, normalizedAccountId) ?? {};
	const resolvedStrings = resolveMatrixAccountStringValues({
		accountId: normalizedAccountId,
		account: {
			homeserver: clean(account.homeserver),
			userId: clean(account.userId),
			accessToken: typeof account.accessToken === "string" ? clean(account.accessToken) : "",
			password: typeof account.password === "string" ? clean(account.password) : "",
			deviceId: clean(account.deviceId),
			deviceName: clean(account.deviceName)
		},
		scopedEnv: resolveScopedMatrixEnvConfig(normalizedAccountId, params.env),
		channel: {
			homeserver: clean(matrix.homeserver),
			userId: clean(matrix.userId),
			accessToken: typeof matrix.accessToken === "string" ? clean(matrix.accessToken) : "",
			password: typeof matrix.password === "string" ? clean(matrix.password) : "",
			deviceId: clean(matrix.deviceId),
			deviceName: clean(matrix.deviceName)
		},
		globalEnv: resolveGlobalMatrixEnvConfig(params.env)
	});
	return {
		homeserver: resolvedStrings.homeserver,
		userId: resolvedStrings.userId,
		accessToken: resolvedStrings.accessToken || void 0,
		password: resolvedStrings.password || void 0
	};
}
function resolveMatrixAccountUserId(authView, stored) {
	const configuredUserId = authView.userId.trim();
	if (configuredUserId) return configuredUserId;
	if (!stored) return null;
	if (authView.homeserver && stored.homeserver !== authView.homeserver) return null;
	if (authView.accessToken && stored.accessToken !== authView.accessToken) return null;
	return stored.userId.trim() || null;
}
function listMatrixAccountIds(cfg) {
	const ids = resolveConfiguredMatrixAccountIds(cfg, process.env);
	return ids.length > 0 ? ids : [DEFAULT_ACCOUNT_ID];
}
function resolveDefaultMatrixAccountId(cfg, env = process.env) {
	return normalizeAccountId(resolveMatrixDefaultOrOnlyAccountId(cfg, env));
}
async function resolveConfiguredMatrixBotUserIds(params) {
	const env = params.env ?? process.env;
	const currentAccountId = normalizeAccountId(params.accountId);
	const accounts = [.../* @__PURE__ */ new Set([...resolveConfiguredMatrixAccountIds(params.cfg, env), DEFAULT_ACCOUNT_ID])].filter((accountId) => normalizeAccountId(accountId) !== currentAccountId).map((accountId) => prepareMatrixAccount({
		cfg: params.cfg,
		accountId,
		env
	}));
	const ids = /* @__PURE__ */ new Set();
	if (accounts.length === 0 || params.abortSignal?.aborted) return ids;
	const credentialsEnv = captureMatrixCredentialsEnv(env);
	for (const prepared of accounts) {
		if (params.abortSignal?.aborted) break;
		const stored = await loadMatrixCredentialsAsync(credentialsEnv, prepared.account.accountId);
		if (!isMatrixAccountConfigured(prepared, stored)) continue;
		const userId = resolveMatrixAccountUserId(prepared.authView, stored);
		if (userId) ids.add(userId);
	}
	return ids;
}
function prepareMatrixAccount(params) {
	const env = params.env ?? process.env;
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultMatrixAccountId(params.cfg, env));
	const matrixBase = resolveMatrixBaseConfig(params.cfg);
	const base = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId,
		env
	});
	const explicitAuthConfig = accountId === DEFAULT_ACCOUNT_ID ? base : findMatrixAccountConfig(params.cfg, accountId) ?? {};
	const enabled = base.enabled !== false && matrixBase.enabled !== false;
	const authView = resolveMatrixAccountAuthView({
		cfg: params.cfg,
		accountId,
		env
	});
	const hasHomeserver = Boolean(authView.homeserver);
	const hasUserId = Boolean(authView.userId);
	const hasAccessToken = Boolean(authView.accessToken) || hasConfiguredSecretInput(explicitAuthConfig.accessToken);
	const hasPassword = Boolean(authView.password);
	const hasPasswordAuth = hasUserId && (hasPassword || hasConfiguredSecretInput(explicitAuthConfig.password));
	return {
		authView,
		hasHomeserver,
		hasConfiguredAuth: hasAccessToken || hasPasswordAuth,
		account: {
			accountId,
			enabled,
			name: normalizeOptionalString(base.name),
			homeserver: authView.homeserver || void 0,
			userId: authView.userId || void 0,
			config: base
		}
	};
}
function isMatrixAccountConfigured(prepared, stored) {
	const { authView } = prepared;
	const hasStored = stored && authView.homeserver ? credentialsMatchConfig(stored, {
		homeserver: authView.homeserver,
		userId: authView.userId || ""
	}) : false;
	return prepared.hasHomeserver && (prepared.hasConfiguredAuth || hasStored);
}
/** @deprecated Use resolveMatrixAccountAsync. Final compatibility day: 2026-12-31. */
function resolveMatrixAccount(params) {
	const prepared = prepareMatrixAccount(params);
	const stored = prepared.hasHomeserver && !prepared.hasConfiguredAuth ? loadMatrixCredentials(params.env ?? process.env, prepared.account.accountId) : null;
	return {
		...prepared.account,
		configured: isMatrixAccountConfigured(prepared, stored)
	};
}
async function resolveMatrixAccountAsync(params) {
	const prepared = prepareMatrixAccount(params);
	const stored = prepared.hasHomeserver && !prepared.hasConfiguredAuth ? await loadMatrixCredentialsAsync(captureMatrixCredentialsEnv(params.env ?? process.env), prepared.account.accountId) : null;
	return {
		...prepared.account,
		configured: isMatrixAccountConfigured(prepared, stored)
	};
}
//#endregion
//#region extensions/matrix/src/matrix/config-update.ts
var config_update_exports = /* @__PURE__ */ __exportAll({
	resolveMatrixConfigFieldPath: () => resolveMatrixConfigFieldPath,
	resolveMatrixConfigPath: () => resolveMatrixConfigPath,
	shouldStoreMatrixAccountAtTopLevel: () => shouldStoreMatrixAccountAtTopLevel,
	updateMatrixAccountConfig: () => updateMatrixAccountConfig
});
function applyNullableField(target, key, value, normalize = (entry) => entry) {
	if (value === void 0) return;
	const normalized = value === null ? void 0 : normalize(value);
	if (normalized === void 0) delete target[key];
	else target[key] = normalized;
}
function normalizeMatrixSecretInput(value, key, defaults) {
	if (typeof value === "string") return normalizeSecretInputString(value) || void 0;
	const ref = coerceSecretRef(value, defaults);
	if (!ref) throw new Error(`Invalid Matrix ${key} SecretInput.`);
	return ref;
}
function cloneMatrixDmConfig(dm) {
	return {
		...dm,
		...dm.allowFrom ? { allowFrom: [...dm.allowFrom] } : {}
	};
}
function cloneMatrixRoomMap(rooms) {
	if (!rooms) return rooms;
	return Object.fromEntries(Object.entries(rooms).map(([roomId, roomCfg]) => [roomId, roomCfg ? { ...roomCfg } : roomCfg]));
}
function updateMatrixAccountConfig(cfg, accountId, patch) {
	const matrix = cfg.channels?.matrix ?? {};
	const normalizedAccountId = normalizeAccountId(accountId);
	const nextAccount = { ...findMatrixAccountConfig(cfg, normalizedAccountId) ?? (normalizedAccountId === DEFAULT_ACCOUNT_ID ? matrix : {}) };
	const trimString = (value) => value.trim() || void 0;
	applyNullableField(nextAccount, "name", patch.name, trimString);
	if (typeof patch.enabled === "boolean") nextAccount.enabled = patch.enabled;
	else if (typeof nextAccount.enabled !== "boolean") nextAccount.enabled = true;
	applyNullableField(nextAccount, "homeserver", patch.homeserver, trimString);
	applyNullableField(nextAccount, "proxy", patch.proxy, trimString);
	applyNullableField(nextAccount, "userId", patch.userId, trimString);
	for (const key of ["accessToken", "password"]) applyNullableField(nextAccount, key, patch[key], (value) => normalizeMatrixSecretInput(value, key, cfg.secrets?.defaults));
	applyNullableField(nextAccount, "deviceId", patch.deviceId, trimString);
	applyNullableField(nextAccount, "deviceName", patch.deviceName, trimString);
	applyNullableField(nextAccount, "avatarUrl", patch.avatarUrl, trimString);
	if (patch.allowPrivateNetwork !== void 0) {
		const nextNetwork = nextAccount.network && typeof nextAccount.network === "object" ? { ...nextAccount.network } : {};
		if (patch.allowPrivateNetwork === null) delete nextNetwork.dangerouslyAllowPrivateNetwork;
		else nextNetwork.dangerouslyAllowPrivateNetwork = patch.allowPrivateNetwork;
		if (Object.keys(nextNetwork).length > 0) nextAccount.network = nextNetwork;
		else delete nextAccount.network;
	}
	applyNullableField(nextAccount, "initialSyncLimit", patch.initialSyncLimit, (value) => resolveOptionalIntegerOption(value, { min: 0 }));
	applyNullableField(nextAccount, "encryption", patch.encryption);
	applyNullableField(nextAccount, "allowBots", patch.allowBots);
	applyNullableField(nextAccount, "autoJoin", patch.autoJoin);
	applyNullableField(nextAccount, "autoJoinAllowlist", patch.autoJoinAllowlist, (value) => [...value]);
	applyNullableField(nextAccount, "dm", patch.dm, (value) => cloneMatrixDmConfig({
		...nextAccount.dm,
		...value
	}));
	applyNullableField(nextAccount, "groupPolicy", patch.groupPolicy);
	applyNullableField(nextAccount, "groupAllowFrom", patch.groupAllowFrom, (value) => [...value]);
	for (const key of ["groups", "rooms"]) applyNullableField(nextAccount, key, patch[key], cloneMatrixRoomMap);
	const nextAccounts = Object.fromEntries(Object.entries(matrix.accounts ?? {}).filter(([rawAccountId]) => rawAccountId === normalizedAccountId || normalizeAccountId(rawAccountId) !== normalizedAccountId));
	if (shouldStoreMatrixAccountAtTopLevel(cfg, normalizedAccountId)) {
		const { accounts: _ignoredAccounts, defaultAccount } = matrix;
		const { accounts: _ignoredNextAccounts, defaultAccount: _ignoredNextDefaultAccount, ...topLevelAccount } = nextAccount;
		return {
			...cfg,
			channels: {
				...cfg.channels,
				matrix: {
					...defaultAccount ? { defaultAccount } : {},
					enabled: true,
					...topLevelAccount
				}
			}
		};
	}
	return {
		...cfg,
		channels: {
			...cfg.channels,
			matrix: {
				...matrix,
				enabled: true,
				accounts: {
					...nextAccounts,
					[normalizedAccountId]: nextAccount
				}
			}
		}
	};
}
//#endregion
//#region extensions/matrix/src/matrix/profile.ts
var profile_exports = /* @__PURE__ */ __exportAll({
	isSupportedMatrixAvatarSource: () => isSupportedMatrixAvatarSource,
	syncMatrixOwnProfile: () => syncMatrixOwnProfile
});
const MATRIX_PROFILE_AVATAR_MAX_BYTES = 10485760;
function isMatrixMxcUri(value) {
	return normalizeLowercaseStringOrEmpty(value).startsWith("mxc://");
}
function isMatrixHttpAvatarUri(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	return normalized.startsWith("https://") || normalized.startsWith("http://");
}
function isSupportedMatrixAvatarSource(value) {
	return isMatrixMxcUri(value) || isMatrixHttpAvatarUri(value);
}
async function syncMatrixOwnProfile(params) {
	const desiredDisplayName = normalizeOptionalString(params.displayName) ?? null;
	const avatarPath = normalizeOptionalString(params.avatarPath) ?? null;
	const avatarSource = avatarPath ?? normalizeOptionalString(params.avatarUrl) ?? null;
	let desiredAvatarUrl = avatarSource;
	let uploadedAvatarSource = null;
	if (avatarSource && (avatarPath || !isMatrixMxcUri(avatarSource))) {
		if (!avatarPath && !isMatrixHttpAvatarUri(avatarSource)) throw new Error("Matrix avatar URL must be an mxc:// URI or an http(s) URL.");
		const loadAvatar = avatarPath ? params.loadAvatarFromPath : params.loadAvatarFromUrl;
		if (!loadAvatar) throw new Error(avatarPath ? "Matrix avatar path upload requires a media loader." : "Matrix avatar URL conversion requires a media loader.");
		const media = await loadAvatar(avatarSource, params.avatarMaxBytes ?? MATRIX_PROFILE_AVATAR_MAX_BYTES);
		desiredAvatarUrl = await params.client.uploadContent(media.buffer, media.contentType, media.fileName || "avatar");
		uploadedAvatarSource = avatarPath ? "path" : "http";
	}
	const avatar = {
		resolvedAvatarUrl: desiredAvatarUrl,
		uploadedAvatarSource,
		convertedAvatarFromHttp: uploadedAvatarSource === "http"
	};
	if (!desiredDisplayName && !desiredAvatarUrl) return {
		skipped: true,
		displayNameUpdated: false,
		avatarUpdated: false,
		...avatar,
		resolvedAvatarUrl: null
	};
	let currentDisplayName;
	let currentAvatarUrl;
	try {
		const currentProfile = await params.client.getUserProfile(params.userId);
		currentDisplayName = normalizeOptionalString(currentProfile.displayname);
		currentAvatarUrl = normalizeOptionalString(currentProfile.avatar_url);
	} catch {}
	let displayNameUpdated = false;
	let avatarUpdated = false;
	if (desiredDisplayName && currentDisplayName !== desiredDisplayName) {
		await params.client.setDisplayName(desiredDisplayName);
		displayNameUpdated = true;
	}
	if (desiredAvatarUrl && currentAvatarUrl !== desiredAvatarUrl) {
		await params.client.setAvatarUrl(desiredAvatarUrl);
		avatarUpdated = true;
	}
	return {
		skipped: false,
		displayNameUpdated,
		avatarUpdated,
		...avatar
	};
}
//#endregion
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
	const normalizedDefaultAccount = typeof params.channel.defaultAccount === "string" && params.channel.defaultAccount.trim() ? normalizeAccountId$2(params.channel.defaultAccount) : void 0;
	const matchedAccountId = normalizedDefaultAccount ? Object.entries(accounts).find(([accountId, value]) => accountId && value && typeof value === "object" && normalizeAccountId$2(accountId) === normalizedDefaultAccount)?.[0] : void 0;
	if (matchedAccountId) return matchedAccountId;
	if (normalizedDefaultAccount) return DEFAULT_ACCOUNT_ID$2;
	const namedAccounts = Object.entries(accounts).filter(([accountId, value]) => accountId && typeof value === "object" && value);
	if (namedAccounts.length === 1) {
		const onlyAccount = namedAccounts[0];
		if (onlyAccount) return onlyAccount[0];
	}
	return DEFAULT_ACCOUNT_ID$2;
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
function resolveExistingMatrixAccountKey(accounts, targetAccountId) {
	const normalizedTargetAccountId = normalizeAccountId$1(targetAccountId);
	return Object.keys(accounts).find((accountId) => normalizeAccountId$1(accountId) === normalizedTargetAccountId) ?? targetAccountId;
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
	for (const key of keysToMove) nextAccount[key] = structuredClone(base[key]);
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
	const avatarUrl = normalizeOptionalString(input.avatarUrl);
	if (avatarUrl && !isSupportedMatrixAvatarSource(avatarUrl)) return "Matrix avatar URL must be an mxc:// URI or an http(s) URL.";
	if (input.useEnv) {
		const envReadiness = resolveMatrixEnvAuthReadiness(params.accountId, process.env);
		return envReadiness.ready ? null : envReadiness.missingMessage;
	}
	if (!input.homeserver?.trim()) return "Matrix requires --homeserver";
	const accessToken = input.accessToken?.trim();
	const password = normalizeSecretInputString$1(input.password);
	const userId = input.userId?.trim();
	if (!accessToken && !password) return "Matrix requires --access-token or --password";
	if (!accessToken && !userId) return "Matrix requires --user-id when using --password";
	return null;
}
function applyMatrixSetupAccountConfig(params) {
	const input = params.input;
	const normalizedAccountId = normalizeAccountId$1(params.accountId);
	const migratedCfg = normalizedAccountId !== DEFAULT_ACCOUNT_ID$1 ? moveSingleMatrixAccountConfigToNamedAccount(params.cfg) : params.cfg;
	const next = applyAccountNameToChannelSection({
		cfg: migratedCfg,
		channelKey: channel$1,
		accountId: normalizedAccountId,
		name: input.name
	});
	const avatarUrl = normalizeOptionalString(input.avatarUrl);
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
	const password = normalizeSecretInputString$1(input.password);
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
			const resolvedAccountId = normalizeAccountId$1(accountId?.trim() || resolveDefaultMatrixAccountId(resolvedCfg) || DEFAULT_ACCOUNT_ID$1);
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
	return normalizeAccountId$1(params.accountId?.trim() || params.name?.trim() || DEFAULT_ACCOUNT_ID$1);
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
const finishMatrixSetupAfterConfigWrite = async ({ previousCfg, cfg, accountId, runtime }) => {
	const { runMatrixSetupBootstrapAfterConfigWrite } = await import("./setup-bootstrap-BCbltIf_.mjs");
	await runMatrixSetupBootstrapAfterConfigWrite({
		previousCfg,
		cfg,
		accountId,
		runtime
	});
};
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
	afterAccountConfigWritten: finishMatrixSetupAfterConfigWrite
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
export { resolveMatrixAccount as _, createMatrixSetupDmPolicy as a, resolveSingleAccountPromotionTarget as c, syncMatrixOwnProfile as d, config_update_exports as f, resolveDefaultMatrixAccountId as g, resolveConfiguredMatrixBotUserIds as h, matrixSetupContract as i, singleAccountKeysToMove as l, listMatrixAccountIds as m, finishMatrixSetupAfterConfigWrite as n, moveSingleMatrixAccountConfigToNamedAccount as o, updateMatrixAccountConfig as p, matrixSetupAdapter as r, namedAccountPromotionKeys as s, createMatrixSetupWizardProxy as t, profile_exports as u, resolveMatrixAccountAsync as v };
