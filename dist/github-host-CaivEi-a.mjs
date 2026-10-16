//#region src/agents/github-host.ts
const DEFAULT_GITHUB_HOST = "github.com";
const DEFAULT_GITHUB_API_BASE_URL = "https://api.github.com";
const CLEARED_GITHUB_CREDENTIALS = {
	GH_TOKEN: "",
	GH_ENTERPRISE_TOKEN: "",
	GITHUB_TOKEN: "",
	GITHUB_ENTERPRISE_TOKEN: ""
};
function withGitHubToken(env, token) {
	return {
		...env,
		GH_TOKEN: token,
		GH_ENTERPRISE_TOKEN: token,
		GITHUB_TOKEN: void 0,
		GITHUB_ENTERPRISE_TOKEN: void 0
	};
}
function normalizeGitHubHost(value) {
	const host = value?.trim().toLowerCase() || DEFAULT_GITHUB_HOST;
	if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/u.test(host) || host.includes("..")) throw new Error("gateway.github.host must be a hostname");
	return host;
}
function normalizeGitHubApiBaseUrl(value) {
	const raw = value?.trim() || DEFAULT_GITHUB_API_BASE_URL;
	const parsed = new URL(raw);
	if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash || ![
		"/",
		"",
		"/api/v3",
		"/api/v3/"
	].includes(parsed.pathname)) throw new Error("gateway.github.apiBaseUrl must be an HTTPS GitHub API base URL");
	return parsed.origin + (parsed.pathname.startsWith("/api/v3") ? "/api/v3" : "");
}
function resolveConfiguredGitHubHost(config) {
	return normalizeGitHubHost(config?.gateway?.github?.host);
}
function resolveConfiguredGitHubApiBaseUrl(config) {
	return normalizeGitHubApiBaseUrl(config?.gateway?.github?.apiBaseUrl);
}
function githubRepositoryUrl(repository, host = resolveConfiguredGitHubHost()) {
	return `https://${host}/${repository}.git`;
}
//#endregion
export { withGitHubToken as a, resolveConfiguredGitHubHost as i, githubRepositoryUrl as n, resolveConfiguredGitHubApiBaseUrl as r, CLEARED_GITHUB_CREDENTIALS as t };
