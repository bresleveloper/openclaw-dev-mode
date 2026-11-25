import { s as resolveMatrixDefaultOrOnlyAccountId } from "./account-selection-Cow3TMFO.mjs";
import { t as resolveMatrixConfigFieldPath } from "./config-paths-DBpHxDyc.mjs";
import { normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
// extensions/matrix/src/matrix/encryption-guidance.ts
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
export { formatMatrixEncryptionUnavailableError as n, formatMatrixEncryptedEventDisabledWarning as t };
