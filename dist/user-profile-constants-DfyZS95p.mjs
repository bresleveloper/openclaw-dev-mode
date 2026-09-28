//#region packages/gateway-protocol/src/schema/user-profile-constants.ts
const GATEWAY_OWNER_PROFILE_ID = "gateway-owner";
const USER_PREFS_VALUE_BYTES = 4096;
const GIT_COAUTHOR_PREFERENCE_KEY = "git.coauthor.enabled";
function isGitCoauthorCreditEnabled(value) {
	return value === void 0 || value === true;
}
//#endregion
export { isGitCoauthorCreditEnabled as i, GIT_COAUTHOR_PREFERENCE_KEY as n, USER_PREFS_VALUE_BYTES as r, GATEWAY_OWNER_PROFILE_ID as t };
