import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
//#region extensions/matrix/src/matrix/credentials-state.ts
const MATRIX_CREDENTIALS_NAMESPACE = "credentials";
function matrixCredentialsStoreKey(accountId) {
	return `account:${normalizeAccountId(accountId)}`;
}
function normalizeMatrixStoredCredentials(value, accountId) {
	if (!value || typeof value !== "object") return null;
	const parsed = value;
	if (typeof parsed.homeserver !== "string" || !parsed.homeserver || typeof parsed.userId !== "string" || !parsed.userId || typeof parsed.accessToken !== "string" || !parsed.accessToken || typeof parsed.createdAt !== "string" || !parsed.createdAt) return null;
	return {
		accountId: normalizeAccountId(accountId ?? parsed.accountId),
		homeserver: parsed.homeserver,
		userId: parsed.userId,
		accessToken: parsed.accessToken,
		...typeof parsed.deviceId === "string" ? { deviceId: parsed.deviceId } : {},
		createdAt: parsed.createdAt,
		...typeof parsed.lastUsedAt === "string" ? { lastUsedAt: parsed.lastUsedAt } : {}
	};
}
function isMatrixCredentialRevocation(value, accountId) {
	if (!value || typeof value !== "object") return false;
	const parsed = value;
	return parsed.kind === "revoked" && typeof parsed.revokedAt === "string" && parsed.revokedAt.length > 0 && normalizeAccountId(parsed.accountId) === normalizeAccountId(accountId ?? parsed.accountId);
}
//#endregion
export { normalizeMatrixStoredCredentials as i, isMatrixCredentialRevocation as n, matrixCredentialsStoreKey as r, MATRIX_CREDENTIALS_NAMESPACE as t };
