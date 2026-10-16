import { i as __exportAll } from "./doctor-contract-CsTNmbMa.mjs";
import { r as getOptionalMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { i as normalizeMatrixStoredCredentials, r as matrixCredentialsStoreKey, t as MATRIX_CREDENTIALS_NAMESPACE } from "./credentials-state-B3cuUFwZ.mjs";
import { i as resolveMatrixCredentialsDir, o as resolveMatrixCredentialsPath } from "./storage-paths-B51JM-pC.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { createPluginStateKeyedStore, createPluginStateSyncKeyedStore } from "openclaw/plugin-sdk/plugin-state-store-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/matrix/src/matrix/credentials-read.ts
var credentials_read_exports = /* @__PURE__ */ __exportAll({
	captureMatrixCredentialsEnv: () => captureMatrixCredentialsEnv,
	clearMatrixCredentials: () => clearMatrixCredentials,
	credentialsMatchConfig: () => credentialsMatchConfig,
	loadMatrixCredentials: () => loadMatrixCredentials,
	loadMatrixCredentialsAsync: () => loadMatrixCredentialsAsync,
	openMatrixCredentialsAsyncStore: () => openMatrixCredentialsAsyncStore,
	openMatrixCredentialsStore: () => openMatrixCredentialsStore,
	resolveMatrixCredentialsDir: () => resolveMatrixCredentialsDir,
	resolveMatrixCredentialsPath: () => resolveMatrixCredentialsPath
});
function matrixCredentialsStoreOptions(env) {
	const runtime = getOptionalMatrixRuntime();
	const resolvedEnv = env.OPENCLAW_STATE_DIR?.trim() || !runtime ? env : {
		...env,
		OPENCLAW_STATE_DIR: runtime.state.resolveStateDir(env)
	};
	return {
		namespace: MATRIX_CREDENTIALS_NAMESPACE,
		maxEntries: 256,
		overflowPolicy: "reject-new",
		env: resolvedEnv
	};
}
function openMatrixCredentialsStore(env = process.env) {
	return createPluginStateSyncKeyedStore("matrix", matrixCredentialsStoreOptions(env));
}
function openMatrixCredentialsAsyncStore(env = process.env) {
	const options = matrixCredentialsStoreOptions(env);
	const runtime = getOptionalMatrixRuntime();
	return runtime ? runtime.state.openKeyedStore(options) : createPluginStateKeyedStore("matrix", options);
}
function captureMatrixCredentialsEnv(env) {
	return {
		...env,
		OPENCLAW_STATE_DIR: getOptionalMatrixRuntime()?.state.resolveStateDir(env) ?? resolveStateDir(env),
		OPENCLAW_SUPERVISOR_MODE: env.OPENCLAW_SUPERVISOR_MODE
	};
}
async function loadMatrixCredentialsAsync(env = process.env, accountId) {
	return decodeMatrixCredentials(await openMatrixCredentialsAsyncStore(env).lookup(matrixCredentialsStoreKey(accountId)), accountId);
}
function loadMatrixCredentials(env = process.env, accountId) {
	return decodeMatrixCredentials(openMatrixCredentialsStore(env).lookup(matrixCredentialsStoreKey(accountId)), accountId);
}
function decodeMatrixCredentials(stored, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const parsed = normalizeMatrixStoredCredentials(stored, normalizedAccountId);
	if (!parsed || parsed.accountId !== normalizedAccountId) return null;
	const { accountId: _accountId, ...credentials } = parsed;
	return credentials;
}
function clearMatrixCredentials(env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	openMatrixCredentialsStore(env).register(matrixCredentialsStoreKey(normalizedAccountId), {
		accountId: normalizedAccountId,
		kind: "revoked",
		revokedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
function credentialsMatchConfig(stored, config) {
	if (!config.userId) {
		if (!config.accessToken) return false;
		return stored.homeserver === config.homeserver && stored.accessToken === config.accessToken;
	}
	return stored.homeserver === config.homeserver && stored.userId === config.userId;
}
//#endregion
export { loadMatrixCredentials as a, openMatrixCredentialsStore as c, credentials_read_exports as i, clearMatrixCredentials as n, loadMatrixCredentialsAsync as o, credentialsMatchConfig as r, openMatrixCredentialsAsyncStore as s, captureMatrixCredentialsEnv as t };
