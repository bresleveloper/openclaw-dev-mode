import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as resolveConfiguredGitHubHost, r as resolveConfiguredGitHubApiBaseUrl } from "./github-host-N2fYlLEb.mjs";
//#region src/agents/github-host-runtime.ts
function resolveGitHubHost() {
	return resolveConfiguredGitHubHost(getRuntimeConfigSnapshot());
}
function resolveGitHubApiBaseUrl() {
	return resolveConfiguredGitHubApiBaseUrl(getRuntimeConfigSnapshot());
}
//#endregion
export { resolveGitHubHost as n, resolveGitHubApiBaseUrl as t };
