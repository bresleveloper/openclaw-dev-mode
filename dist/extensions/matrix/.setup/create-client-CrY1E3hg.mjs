import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { t as resolveValidatedMatrixHomeserverUrl } from "./url-validation-CF6pG6eE.mjs";
import { n as maybeMigrateLegacyStorage, o as resolveMatrixStoragePaths, s as writeStorageMeta } from "./storage-CN4dxdtV.mjs";
import "./client-BEl7PU1_.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "openclaw/plugin-sdk/ssrf-runtime";
import fs from "node:fs";
//#region extensions/matrix/src/matrix/client/create-client.ts
const loadMatrixCreateClientRuntimeDeps = createLazyRuntimeModule(() => Promise.all([
	import("./sdk-DNW03GqJ.mjs").then((n) => n.t),
	import("./logging-CoaEyRtA.mjs").then((n) => n.n),
	import("./file-sync-store-BxUPmUoJ.mjs")
]).then(([sdkModule, loggingModule, syncStoreModule]) => ({
	MatrixClient: sdkModule.MatrixClient,
	SqliteBackedMatrixSyncStore: syncStoreModule.SqliteBackedMatrixSyncStore,
	ensureMatrixSdkLoggingConfigured: loggingModule.ensureMatrixSdkLoggingConfigured
})));
async function prepareMatrixClientStorage(params) {
	const homeserver = await resolveValidatedMatrixHomeserverUrl(params.homeserver, { dangerouslyAllowPrivateNetwork: params.allowPrivateNetwork });
	const matrixClientUserId = normalizeOptionalString(params.userId);
	const userId = matrixClientUserId ?? "unknown";
	return {
		homeserver,
		matrixClientUserId,
		storagePaths: params.persistStorage !== false ? await resolveMatrixStoragePaths({
			homeserver,
			userId,
			accessToken: params.accessToken,
			accountId: params.accountId,
			deviceId: params.deviceId,
			env: process.env
		}) : null
	};
}
async function createMatrixClient(params, preparedStorage) {
	const { homeserver, matrixClientUserId, storagePaths } = preparedStorage ?? await prepareMatrixClientStorage(params);
	const userId = matrixClientUserId ?? "unknown";
	const { MatrixClient, SqliteBackedMatrixSyncStore, ensureMatrixSdkLoggingConfigured } = await loadMatrixCreateClientRuntimeDeps();
	ensureMatrixSdkLoggingConfigured();
	if (storagePaths) {
		await maybeMigrateLegacyStorage({ storagePaths });
		fs.mkdirSync(storagePaths.rootDir, { recursive: true });
		await writeStorageMeta({
			storagePaths,
			homeserver,
			userId,
			accountId: params.accountId,
			deviceId: params.deviceId
		});
	}
	const cryptoDatabasePrefix = storagePaths ? `openclaw-matrix-${storagePaths.accountKey}-${storagePaths.tokenHash}` : void 0;
	const syncStore = storagePaths ? await SqliteBackedMatrixSyncStore.create(storagePaths.rootDir) : void 0;
	return new MatrixClient(homeserver, params.accessToken, {
		userId: matrixClientUserId,
		password: params.password,
		deviceId: params.deviceId,
		encryption: params.encryption,
		localTimeoutMs: params.localTimeoutMs,
		initialSyncLimit: params.initialSyncLimit,
		syncStore,
		recoveryKeyPath: storagePaths?.recoveryKeyPath,
		idbSnapshotPath: storagePaths?.idbSnapshotPath,
		cryptoDatabasePrefix,
		autoBootstrapCrypto: params.autoBootstrapCrypto,
		ssrfPolicy: params.ssrfPolicy ?? ssrfPolicyFromDangerouslyAllowPrivateNetwork(params.allowPrivateNetwork),
		dispatcherPolicy: params.dispatcherPolicy,
		stateRuntime: getMatrixRuntime().state
	});
}
//#endregion
export { createMatrixClient, prepareMatrixClientStorage };
