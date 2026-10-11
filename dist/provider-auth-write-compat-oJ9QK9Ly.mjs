import { a as removeProviderAuthProfilesWithLock, l as upsertAuthProfileWithLock, u as upsertAuthProfileWithLockOrThrow } from "./profiles-0b5lHPxP.mjs";
import { p as updateAuthProfileStoreWithLock } from "./store-runtime-DJ_qpkmC.mjs";
//#region src/plugin-sdk/provider-auth-write-compat.ts
async function updateAuthProfileStoreWithLockCompat(params) {
	try {
		return await updateAuthProfileStoreWithLock({
			...params,
			updater: (store) => params.updater(store)
		});
	} catch {
		return null;
	}
}
async function upsertAuthProfileWithLockCompat({ profileId, credential, agentDir, stateDir }) {
	try {
		return await upsertAuthProfileWithLock({
			profileId,
			credential,
			agentDir,
			stateDir
		});
	} catch {
		return null;
	}
}
async function upsertAuthProfileWithLockOrThrowCompat({ profileId, credential, agentDir, stateDir }) {
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential,
		agentDir,
		stateDir
	});
}
async function removeProviderAuthProfilesWithLockCompat(params) {
	try {
		return await removeProviderAuthProfilesWithLock(params);
	} catch {
		return null;
	}
}
//#endregion
export { upsertAuthProfileWithLockOrThrowCompat as i, updateAuthProfileStoreWithLockCompat as n, upsertAuthProfileWithLockCompat as r, removeProviderAuthProfilesWithLockCompat as t };
