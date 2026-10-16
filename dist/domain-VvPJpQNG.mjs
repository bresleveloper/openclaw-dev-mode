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
/** Normalize legacy OAuth URL/domain spellings without accepting unsupported tenants. */
function normalizeGithubCopilotOAuthScope(raw) {
	if (!raw) return PUBLIC_GITHUB_COPILOT_DOMAIN;
	const trimmed = raw.trim();
	if (!trimmed) return;
	const hostname = URL.parse(trimmed.includes("://") ? trimmed : `https://${trimmed}`)?.hostname;
	return hostname && isSupportedGithubCopilotDomain(hostname) ? normalizeGithubCopilotDomain(hostname) : void 0;
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
* `github.com`. The provider allowlist rejects unsafe values.
*/
function resolveGithubCopilotDomain(params) {
	const fromEnv = (params?.env ?? process.env).COPILOT_GITHUB_DOMAIN?.trim();
	if (fromEnv) return normalizeGithubCopilotDomain(fromEnv);
	if (params?.explicit) return normalizeGithubCopilotDomain(params.explicit);
	return normalizeGithubCopilotDomain(readConfiguredGithubCopilotDomain(params?.config));
}
//#endregion
export { resolveGithubCopilotDomain as a, normalizeGithubCopilotOAuthScope as i, isSupportedGithubCopilotDomain as n, normalizeGithubCopilotDomain as r, PUBLIC_GITHUB_COPILOT_DOMAIN as t };
