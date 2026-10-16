import { i as __exportAll } from "./doctor-contract-CsTNmbMa.mjs";
import { t as findMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { n as resolveMatrixConfigPath, r as shouldStoreMatrixAccountAtTopLevel, t as resolveMatrixConfigFieldPath } from "./config-paths-CnREYb1Y.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { coerceSecretRef, normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
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
export { updateMatrixAccountConfig as n, config_update_exports as t };
