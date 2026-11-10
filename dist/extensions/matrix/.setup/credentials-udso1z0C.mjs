import { i as normalizeMatrixStoredCredentials, n as isMatrixCredentialRevocation, r as matrixCredentialsStoreKey } from "./credentials-state-B3cuUFwZ.mjs";
import { i as resolveMatrixCredentialsDir, o as resolveMatrixCredentialsPath } from "./storage-paths-B51JM-pC.mjs";
import { a as loadMatrixCredentials, n as clearMatrixCredentials, r as credentialsMatchConfig, s as openMatrixCredentialsAsyncStore } from "./credentials-read-Dj7Hj87M.mjs";
import { r as updateMatrixKeyedState } from "./sqlite-state-LByPx4Yp.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
//#region extensions/matrix/src/matrix/credentials.ts
async function saveMatrixCredentials(credentials, env = process.env, accountId) {
	await persistMatrixCredentials(credentials, env, accountId, false);
}
async function saveBackfilledMatrixDeviceId(credentials, env = process.env, accountId) {
	return persistMatrixCredentials(credentials, env, accountId, true);
}
async function persistMatrixCredentials(credentials, env, accountId, backfill) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const preparedCredentials = { ...credentials };
	const now = (/* @__PURE__ */ new Date()).toISOString();
	let result = "saved";
	await updateMatrixCredentials(env, normalizedAccountId, (current) => {
		result = "saved";
		if (backfill && isMatrixCredentialRevocation(current, normalizedAccountId)) {
			result = "skipped";
			return current;
		}
		const existing = normalizeMatrixStoredCredentials(current, normalizedAccountId);
		if (backfill && existing && (existing.homeserver !== preparedCredentials.homeserver || existing.userId !== preparedCredentials.userId || existing.accessToken !== preparedCredentials.accessToken)) {
			result = "skipped";
			return existing;
		}
		return {
			accountId: normalizedAccountId,
			homeserver: preparedCredentials.homeserver,
			userId: preparedCredentials.userId,
			accessToken: preparedCredentials.accessToken,
			...typeof preparedCredentials.deviceId === "string" ? { deviceId: preparedCredentials.deviceId } : {},
			createdAt: existing?.createdAt ?? now,
			lastUsedAt: now
		};
	});
	return result;
}
async function touchMatrixCredentials(env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	await updateMatrixCredentials(env, normalizedAccountId, (current) => {
		if (isMatrixCredentialRevocation(current, normalizedAccountId)) return current;
		const existing = normalizeMatrixStoredCredentials(current, normalizedAccountId);
		return existing ? {
			...existing,
			lastUsedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : void 0;
	});
}
async function updateMatrixCredentials(env, accountId, update) {
	const store = openMatrixCredentialsAsyncStore(env);
	const key = matrixCredentialsStoreKey(accountId);
	await updateMatrixKeyedState(store, key, update);
}
//#endregion
export { clearMatrixCredentials, credentialsMatchConfig, loadMatrixCredentials, resolveMatrixCredentialsDir, resolveMatrixCredentialsPath, saveBackfilledMatrixDeviceId, saveMatrixCredentials, touchMatrixCredentials };
