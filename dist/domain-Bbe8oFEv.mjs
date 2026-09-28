//#region extensions/github-copilot/domain.ts
/** Public GitHub Copilot host used when no data-residency domain is configured. */
const PUBLIC_GITHUB_COPILOT_DOMAIN = "github.com";
const GHE_DATA_RESIDENCY_HOST = /^[a-z0-9-]+\.ghe\.com$/;
function isSupportedGithubCopilotDomain(raw) {
	const trimmed = (raw ?? "").trim().toLowerCase();
	if (!trimmed) return true;
	return /^[a-z0-9.-]+$/.test(trimmed) && (trimmed === "github.com" || GHE_DATA_RESIDENCY_HOST.test(trimmed));
}
function normalizeGithubCopilotDomain(raw) {
	const trimmed = (raw ?? "").trim().toLowerCase();
	return trimmed && isSupportedGithubCopilotDomain(trimmed) ? trimmed : PUBLIC_GITHUB_COPILOT_DOMAIN;
}
function readConfiguredGithubCopilotDomain(config) {
	const params = config?.models?.providers?.["github-copilot"]?.params;
	const value = params && typeof params === "object" ? params.githubDomain : void 0;
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
/**
* Resolve the GitHub Copilot host for this provider from (in priority order) the
* `COPILOT_GITHUB_DOMAIN` env override, the persisted
* `models.providers.github-copilot.params.githubDomain` config, then public
* `github.com`. The result always passes through the SDK allowlist
* (`normalizeGithubCopilotDomain`) so an unsafe value fails closed.
*/
function resolveGithubCopilotDomain(params) {
	const fromEnv = (params?.env ?? process.env).COPILOT_GITHUB_DOMAIN?.trim();
	if (fromEnv) return normalizeGithubCopilotDomain(fromEnv);
	if (params?.explicit) return normalizeGithubCopilotDomain(params.explicit);
	return normalizeGithubCopilotDomain(readConfiguredGithubCopilotDomain(params?.config));
}
//#endregion
export { resolveGithubCopilotDomain as i, isSupportedGithubCopilotDomain as n, normalizeGithubCopilotDomain as r, PUBLIC_GITHUB_COPILOT_DOMAIN as t };
