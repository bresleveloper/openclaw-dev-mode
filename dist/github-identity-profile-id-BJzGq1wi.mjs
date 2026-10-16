//#region src/config/github-identity-profile-id.ts
const MANAGED_GITHUB_PROFILE_ID_PATTERN = /^ghp_[a-f0-9]{32}$/u;
function isManagedGitHubProfileId(value) {
	return MANAGED_GITHUB_PROFILE_ID_PATTERN.test(value);
}
//#endregion
export { isManagedGitHubProfileId as n, MANAGED_GITHUB_PROFILE_ID_PATTERN as t };
