import { i as normalizeMatrixStoredCredentials, n as isMatrixCredentialRevocation, r as matrixCredentialsStoreKey } from "./credentials-state-B3cuUFwZ.mjs";
import { i as resolveMatrixCredentialsDir, o as resolveMatrixCredentialsPath } from "./storage-paths-DVCANXTc.mjs";
import { a as loadMatrixCredentials, c as openMatrixCredentialsStore, n as clearMatrixCredentials, r as credentialsMatchConfig, s as openMatrixCredentialsAsyncStore } from "./credentials-read-Q5sHkkHv.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
//#region extensions/matrix/src/matrix/credentials.ts
async function saveMatrixCredentials(credentials, env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const preparedCredentials = { ...credentials };
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await updateMatrixCredentials(env, normalizedAccountId, (current) => {
		const existing = normalizeMatrixStoredCredentials(current, normalizedAccountId);
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
}
async function saveBackfilledMatrixDeviceId(credentials, env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const preparedCredentials = { ...credentials };
	const now = (/* @__PURE__ */ new Date()).toISOString();
	let result = "saved";
	await updateMatrixCredentials(env, normalizedAccountId, (current) => {
		result = "saved";
		if (isMatrixCredentialRevocation(current, normalizedAccountId)) {
			result = "skipped";
			return current;
		}
		const existing = normalizeMatrixStoredCredentials(current, normalizedAccountId);
		if (existing && (existing.homeserver !== preparedCredentials.homeserver || existing.userId !== preparedCredentials.userId || existing.accessToken !== preparedCredentials.accessToken)) {
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
	if (!store.observe || !store.compareAndApply) {
		openMatrixCredentialsStore(env).update(key, update);
		return;
	}
	let observation = await store.observe(key);
	for (;;) {
		const value = update(observation.value);
		const result = await store.compareAndApply(key, observation.comparison, value === void 0 ? {
			operation: "update",
			action: "keep"
		} : {
			operation: "update",
			action: "set",
			value
		});
		if (result.status !== "conflict") return;
		observation = result.current;
	}
}
//#endregion
export { clearMatrixCredentials, credentialsMatchConfig, loadMatrixCredentials, resolveMatrixCredentialsDir, resolveMatrixCredentialsPath, saveBackfilledMatrixDeviceId, saveMatrixCredentials, touchMatrixCredentials };
