import { s as resolveMatrixDefaultOrOnlyAccountId } from "./account-selection-BHkfU1eC.mjs";
import { t as resolveMatrixConfigFieldPath } from "./config-paths-CnREYb1Y.mjs";
import { normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
//#region extensions/matrix/src/matrix/encryption-guidance.ts
function resolveMatrixEncryptionConfigPath(cfg, accountId) {
	const effectiveAccountId = normalizeOptionalAccountId(accountId) ?? resolveMatrixDefaultOrOnlyAccountId(cfg);
	return resolveMatrixConfigFieldPath(cfg, effectiveAccountId, "encryption");
}
function formatMatrixEncryptionUnavailableError(cfg, accountId) {
	return `Matrix encryption is not available (enable ${resolveMatrixEncryptionConfigPath(cfg, accountId)}=true)`;
}
function formatMatrixEncryptedEventDisabledWarning(cfg, accountId) {
	return `matrix: encrypted event received without encryption enabled; set ${resolveMatrixEncryptionConfigPath(cfg, accountId)}=true and verify the device to decrypt`;
}
//#endregion
export { formatMatrixEncryptionUnavailableError as n, formatMatrixEncryptedEventDisabledWarning as t };
