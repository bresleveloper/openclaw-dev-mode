import { a as normalizeAuthProfileSecretRefs } from "./store-save-BIpfhaDX.mjs";
import { C as updateAuthProfileStoreWithLock } from "./store-runtime-CwqGD12G.mjs";
import { a as removeProviderAuthProfilesWithLock, d as upsertAuthProfileWithLockOrThrow, u as upsertAuthProfileWithLock } from "./profiles-Df1OQ7iN.mjs";
//#region src/plugin-sdk/provider-auth-write-compat.ts
async function updateAuthProfileStoreWithLockCompat(params) {
	try {
		return await updateAuthProfileStoreWithLock({
			agentDir: params.agentDir,
			profileId: params.profileId,
			sharedStoreWrite: params.sharedStoreWrite,
			stateDir: params.stateDir,
			saveOptions: params.saveOptions,
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
