import { b as normalizeAuthProfileSecretRefs } from "./store-SwwRUDrm.mjs";
import { a as removeProviderAuthProfilesWithLock, l as upsertAuthProfileWithLock, u as upsertAuthProfileWithLockOrThrow } from "./profiles-Dk53jI-3.mjs";
import { p as updateAuthProfileStoreWithLock } from "./store-runtime-Qx0DZ2Si.mjs";
//#region src/plugin-sdk/provider-auth-write-compat.ts
async function updateAuthProfileStoreWithLockCompat(params) {
	try {
		return await updateAuthProfileStoreWithLock({
			...params,
			updater: (store) => {
				const changed = params.updater(store);
				if (changed) for (const [profileId, credential] of Object.entries(store.profiles)) store.profiles[profileId] = normalizeAuthProfileSecretRefs(credential);
				return changed;
			}
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
