import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { c as resolveDeviceIdentityStore, d as readProcessDeviceIdentity, n as assertNoPendingLegacyIdentity, u as cacheProcessDeviceIdentity } from "./device-identity-store-id-VtwS0.mjs";
//#region src/infra/device-identity-async.ts
/** Bootstrap through the identity owner before the shared actor opens a missing database. */
async function loadOrCreateDeviceIdentityAsync(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: databasePath
	});
	return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "deviceIdentity.load",
		input: { identityKey }
	}), { preparation: {
		type: "deviceIdentity",
		identityKey
	} });
}
/** Keep the existing process-lifetime identity cache without opening SQLite on a warm hit. */
async function loadOrCreateProcessDeviceIdentityAsync(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const cacheKey = `${databasePath}\0${identityKey}`;
	const cached = readProcessDeviceIdentity(cacheKey);
	if (cached) return cached;
	const identity = await loadOrCreateDeviceIdentityAsync({
		...options,
		path: databasePath,
		identityKey
	});
	return cacheProcessDeviceIdentity(cacheKey, identity);
}
/** Read the captured identity on the shared worker without creating SQLite state. */
async function loadDeviceIdentityIfPresentAsync(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: databasePath
	});
	const identity = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "deviceIdentity.read",
		input: { identityKey }
	}), { existingOnly: true });
	if (identity !== void 0) return identity;
	assertNoPendingLegacyIdentity({
		path: databasePath,
		identityKey
	});
	return null;
}
//#endregion
export { loadOrCreateDeviceIdentityAsync as n, loadOrCreateProcessDeviceIdentityAsync as r, loadDeviceIdentityIfPresentAsync as t };
