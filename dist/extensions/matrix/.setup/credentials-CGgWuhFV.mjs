import { i as normalizeMatrixStoredCredentials, n as isMatrixCredentialRevocation, r as matrixCredentialsStoreKey } from "./credentials-state-jxq29yQw.mjs";
import { i as resolveMatrixCredentialsDir, o as resolveMatrixCredentialsPath } from "./storage-paths-e_Vq6cvw.mjs";
import { a as loadMatrixCredentials, n as clearMatrixCredentials, r as credentialsMatchConfig, s as openMatrixCredentialsAsyncStore } from "./credentials-read-rPqEpuxv.mjs";
import { r as updateMatrixKeyedState } from "./sqlite-state-D6Zpz1q1.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
// extensions/matrix/src/matrix/credentials.ts
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
	const store = openMatrixCredentialsAsyncStore(env);
	const key = matrixCredentialsStoreKey(normalizedAccountId);
	await updateMatrixKeyedState(store, key, (current) => {
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
export { clearMatrixCredentials, credentialsMatchConfig, loadMatrixCredentials, resolveMatrixCredentialsDir, resolveMatrixCredentialsPath, saveBackfilledMatrixDeviceId, saveMatrixCredentials };
