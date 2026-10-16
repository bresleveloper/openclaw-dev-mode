import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { i as resolveConfiguredGitHubHost, r as resolveConfiguredGitHubApiBaseUrl } from "./github-host-CaivEi-a.mjs";
//#region src/agents/github-host-runtime.ts
function resolveGitHubHost() {
	return resolveConfiguredGitHubHost(getRuntimeConfigSnapshot());
}
function resolveGitHubApiBaseUrl() {
	return resolveConfiguredGitHubApiBaseUrl(getRuntimeConfigSnapshot());
}
//#endregion
export { resolveGitHubHost as n, resolveGitHubApiBaseUrl as t };
