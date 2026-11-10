import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { c as selectUserProfileDisplaysInDatabase, l as selectUserProfileIdentityInDatabase, r as projectUserProfileDisplays, s as selectHasMultipleSessionSharingIdentities } from "./user-profile-identity.read-DXpuvx74.mjs";
//#region src/state/user-profile-list.native.ts
/** Native readers serve workers and the deprecated synchronous SDK factories only. */
function getUserProfileDisplaysNative(profileIds, options = {}) {
	const ids = [...new Set(profileIds)];
	if (!ids.length) return /* @__PURE__ */ new Map();
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "user_profiles")) return /* @__PURE__ */ new Map();
		const rows = selectUserProfileDisplaysInDatabase(db, ids);
		return projectUserProfileDisplays(ids, (id) => rows.get(id));
	}, options) ?? /* @__PURE__ */ new Map();
}
/** The sharing worker resolves aliases on a participant miss. */
function readUserProfileAliasesNative(profileId, options = {}) {
	const identity = withExistingOpenClawStateDatabaseReadOnly(({ db }) => tableExists(db, "user_profiles") ? selectUserProfileIdentityInDatabase(db, profileId) : void 0, options);
	return /* @__PURE__ */ new Set([profileId, ...identity?.aliases ?? []]);
}
/** @deprecated Synchronous SDK tool construction only; runtime prepares the profile catalog. */
function hasMultipleSessionSharingIdentitiesNative(options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => tableExists(db, "user_profiles") && selectHasMultipleSessionSharingIdentities(db), options) ?? false;
}
//#endregion
export { hasMultipleSessionSharingIdentitiesNative as n, readUserProfileAliasesNative as r, getUserProfileDisplaysNative as t };
