//#region src/utils/github-login.ts
const GITHUB_LOGIN_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/u;
function normalizeGitHubLogin(value) {
	const login = value.trim();
	return GITHUB_LOGIN_PATTERN.test(login) ? login : void 0;
}
//#endregion
export { normalizeGitHubLogin as t };
