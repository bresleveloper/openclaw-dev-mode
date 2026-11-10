import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath } from "./path-resolve-21Orzn6B.mjs";
//#region src/secrets/runtime-auth-profile-owner.ts
/** Stable SecretRef owner identity for one agent-scoped auth profile. */
/** Tuple encoding distinguishes agents and avoids path/profile separator collisions. */
function resolveAuthProfileSecretOwnerId(params) {
	const storePath = params.agentDir ? resolveAuthProfileDatabasePath(params.agentDir) : resolveSharedAuthStorePath();
	return JSON.stringify([storePath, params.profileId]);
}
/** Enumerates the same store-scoped identities used by assignment and refresh ownership. */
function listAuthProfileSecretOwnerIds(authStores) {
	return new Set(authStores.flatMap(({ agentDir, store }) => Object.keys(store.profiles).map((profileId) => resolveAuthProfileSecretOwnerId({
		agentDir,
		profileId
	}))));
}
//#endregion
export { resolveAuthProfileSecretOwnerId as n, listAuthProfileSecretOwnerIds as t };
