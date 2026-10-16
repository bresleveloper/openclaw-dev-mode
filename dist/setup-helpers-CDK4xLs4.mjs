import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { i as resolveChannelAccountKey } from "./account-lookup-D_rRUHd5.mjs";
import { i as hasConfiguredAccountValue } from "./account-helpers-DLhdydCj.mjs";
import { s as writeChannelSection } from "./config-helpers-Ch_BBBFF.mjs";
import { t as resolveSingleAccountPromotion } from "./setup-promotion-helpers-CZR3vCRJ.mjs";
//#region src/channels/plugins/setup-helpers.ts
function readChannelConfigSection(cfg, channelKey) {
	const section = cfg.channels?.[channelKey];
	return section && typeof section === "object" ? section : void 0;
}
function applyAccountNameToChannelSection(params) {
	const trimmed = params.name?.trim();
	if (!trimmed) return params.cfg;
	const accountId = normalizeAccountId(params.accountId);
	const base = readChannelConfigSection(params.cfg, params.channelKey);
	const accounts = base?.accounts ?? {};
	const accountKey = resolveChannelAccountKey(accounts, accountId, params.channelKey, (id) => id, params.accountKeyPolicy) ?? accountId;
	if (!(params.alwaysUseAccounts || accountId !== "default" || Object.keys(accounts).length > 0)) return writeChannelSection(params.cfg, params.channelKey, {
		...base,
		name: trimmed
	});
	const baseWithoutName = accountId === "default" ? (({ name: _ignored, ...rest }) => rest)(base ?? {}) : base ?? {};
	return writeChannelSection(params.cfg, params.channelKey, {
		...baseWithoutName,
		accounts: {
			...accounts,
			[accountKey]: {
				...accounts[accountKey],
				name: trimmed
			}
		}
	});
}
/** Moves a root-level channel name into `accounts.default` before adding named accounts. */
function migrateBaseNameToDefaultAccount(params) {
	if (params.alwaysUseAccounts) return params.cfg;
	const base = readChannelConfigSection(params.cfg, params.channelKey);
	const baseName = base?.name?.trim();
	if (!baseName) return params.cfg;
	const accounts = { ...base?.accounts };
	const defaultAccountKey = resolveChannelAccountKey(accounts, "default", params.channelKey, (id) => id, params.accountKeyPolicy) ?? "default";
	const defaultAccount = accounts[defaultAccountKey] ?? {};
	if (!defaultAccount.name) accounts[defaultAccountKey] = {
		...defaultAccount,
		name: baseName
	};
	const { name: _ignored, ...rest } = base ?? {};
	return writeChannelSection(params.cfg, params.channelKey, {
		...rest,
		accounts
	});
}
/** Applies setup-time account naming and optional root-name migration in one step. */
function prepareScopedSetupConfig(params) {
	const namedConfig = applyAccountNameToChannelSection(params);
	if (!params.migrateBaseName || normalizeAccountId(params.accountId) === "default") return namedConfig;
	return migrateBaseNameToDefaultAccount({
		...params,
		cfg: namedConfig
	});
}
/** Applies a setup patch using account-scoped config semantics. */
function applySetupAccountConfigPatch(params) {
	return patchScopedAccountConfig(params);
}
/** Creates a setup adapter that turns validated setup input into an account config patch. */
function createPatchedAccountSetupAdapter(params) {
	return {
		accountKeyPolicy: params.accountKeyPolicy,
		resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
		applyAccountName: ({ cfg, accountId, name }) => prepareScopedSetupConfig({
			cfg,
			channelKey: params.channelKey,
			accountKeyPolicy: params.accountKeyPolicy,
			accountId,
			name,
			alwaysUseAccounts: params.alwaysUseAccounts
		}),
		validateInput: params.validateInput,
		applyAccountConfig: ({ cfg, accountId, input }) => {
			const next = prepareScopedSetupConfig({
				cfg,
				channelKey: params.channelKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId,
				name: input.name,
				alwaysUseAccounts: params.alwaysUseAccounts,
				migrateBaseName: !params.alwaysUseAccounts
			});
			const patch = params.buildPatch(input);
			return patchScopedAccountConfig({
				cfg: next,
				channelKey: params.channelKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId,
				patch,
				ensureChannelEnabled: params.ensureChannelEnabled ?? !params.alwaysUseAccounts,
				ensureAccountEnabled: params.ensureAccountEnabled ?? true,
				scopeDefaultToAccounts: params.alwaysUseAccounts
			});
		}
	};
}
function createSetupInputPresenceValidator(params) {
	return (inputParams) => {
		if (params.defaultAccountOnlyEnvError && inputParams.input.useEnv && inputParams.accountId !== "default") return params.defaultAccountOnlyEnvError;
		if (!inputParams.input.useEnv) {
			const inputRecord = inputParams.input;
			for (const requirement of params.whenNotUseEnv ?? []) {
				if (requirement.someOf.some((key) => hasConfiguredAccountValue(inputRecord[key]))) continue;
				return requirement.message;
			}
		}
		return params.validate?.(inputParams) ?? null;
	};
}
/** Creates a setup adapter that supports env-backed default account auth and patched credentials. */
function createEnvPatchedAccountSetupAdapter(params) {
	return createPatchedAccountSetupAdapter({
		...params,
		validateInput: (inputParams) => {
			if (inputParams.input.useEnv && inputParams.accountId !== "default") return params.defaultAccountOnlyEnvError;
			if (!inputParams.input.useEnv && !params.hasCredentials(inputParams.input)) return params.missingCredentialError;
			return params.validateInput?.(inputParams) ?? null;
		}
	});
}
/** Patches channel config at root for default accounts or under `accounts.<id>` for named accounts. */
function patchScopedAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId);
	const base = readChannelConfigSection(params.cfg, params.channelKey);
	const ensureChannelEnabled = params.ensureChannelEnabled ?? true;
	const ensureAccountEnabled = params.ensureAccountEnabled ?? ensureChannelEnabled;
	const patch = params.patch;
	const accountPatch = params.accountPatch ?? patch;
	const clearFields = (record) => {
		if (!params.clearFields?.length) return record;
		const cleared = { ...record };
		for (const field of params.clearFields) delete cleared[field];
		return cleared;
	};
	if (accountId === "default" && !params.scopeDefaultToAccounts) return writeChannelSection(params.cfg, params.channelKey, {
		...clearFields(base ?? {}),
		...ensureChannelEnabled ? { enabled: true } : {},
		...patch
	});
	const accounts = base?.accounts ?? {};
	const accountKey = resolveChannelAccountKey(accounts, accountId, params.channelKey, (id) => id, params.accountKeyPolicy) ?? accountId;
	const existingAccount = clearFields(accounts[accountKey] ?? {});
	return writeChannelSection(params.cfg, params.channelKey, {
		...base,
		...ensureChannelEnabled ? { enabled: true } : {},
		accounts: {
			...accounts,
			[accountKey]: {
				...existingAccount,
				...ensureAccountEnabled ? { enabled: typeof existingAccount.enabled === "boolean" ? existingAccount.enabled : true } : {},
				...accountPatch
			}
		}
	});
}
function resolveSingleAccountPromotionTarget(params) {
	const accounts = params.channel.accounts ?? {};
	const resolveTargetKey = (accountId) => resolveChannelAccountKey(accounts, normalizeAccountId(accountId), params.channelKey, normalizeAccountId, params.setupSurface?.accountKeyPolicy);
	const pluginTarget = params.setupSurface?.resolveSingleAccountPromotionTarget?.({ channel: params.channel });
	if (pluginTarget?.trim()) return resolveTargetKey(pluginTarget) ?? normalizeAccountId(pluginTarget);
	const normalizedDefaultAccount = typeof params.channel.defaultAccount === "string" && params.channel.defaultAccount.trim() ? normalizeAccountId(params.channel.defaultAccount) : void 0;
	const namedAccounts = Object.keys(accounts).filter(Boolean);
	return resolveTargetKey(normalizedDefaultAccount ?? (namedAccounts.length === 1 ? namedAccounts[0] ?? "default" : "default")) ?? resolveTargetKey("default") ?? "default";
}
/**
* Promotes legacy single-account channel fields into the account map for multi-account setup.
*/
function moveSingleAccountChannelSectionToDefaultAccount(params) {
	const base = readChannelConfigSection(params.cfg, params.channelKey);
	if (!base) return params.cfg;
	const accounts = base.accounts ?? {};
	const hasAccounts = Object.keys(accounts).length > 0;
	const promotion = resolveSingleAccountPromotion({
		channelKey: params.channelKey,
		channel: base,
		setupSurface: params.setupSurface,
		includeSetupKeys: true
	});
	if (promotion.kind === "preserve-root") return params.cfg;
	const { keysToMove } = promotion;
	if (hasAccounts && keysToMove.length === 0) return params.cfg;
	const targetAccountKey = hasAccounts ? resolveSingleAccountPromotionTarget({
		channel: base,
		channelKey: params.channelKey,
		setupSurface: params.setupSurface
	}) : DEFAULT_ACCOUNT_ID;
	const nextAccount = { ...accounts[targetAccountKey] };
	const nextChannel = { ...base };
	for (const key of keysToMove) {
		if (!(key in nextAccount)) {
			const value = base[key];
			nextAccount[key] = value && typeof value === "object" ? structuredClone(value) : value;
		}
		delete nextChannel[key];
	}
	return writeChannelSection(params.cfg, params.channelKey, {
		...nextChannel,
		accounts: {
			...accounts,
			[targetAccountKey]: nextAccount
		}
	});
}
//#endregion
export { createSetupInputPresenceValidator as a, patchScopedAccountConfig as c, createPatchedAccountSetupAdapter as i, prepareScopedSetupConfig as l, applySetupAccountConfigPatch as n, migrateBaseNameToDefaultAccount as o, createEnvPatchedAccountSetupAdapter as r, moveSingleAccountChannelSectionToDefaultAccount as s, applyAccountNameToChannelSection as t, readChannelConfigSection as u };
