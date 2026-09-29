import { t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CLj0HTDM.mjs";
import "./number-runtime-CGwowceO.mjs";
import { n as isSupportedGithubCopilotDomain, r as normalizeGithubCopilotDomain } from "./domain-Bbe8oFEv.mjs";
import { t as runGitHubCopilotDeviceFlow } from "./login-coEHIMZo.mjs";
//#region extensions/github-copilot/oauth.ts
const LEGACY_OAUTH_KEY_PREFIX = "openclaw-github-copilot-oauth:v1:";
function parseLegacyEnterpriseInput(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	try {
		return (trimmed.includes("://") ? new URL(trimmed) : new URL(`https://${trimmed}`)).hostname.toLowerCase();
	} catch {
		return null;
	}
}
function requireSupportedEnterpriseDomain(raw) {
	const domain = parseLegacyEnterpriseInput(raw);
	if (!domain || !isSupportedGithubCopilotDomain(domain)) throw new Error(`Unsupported GitHub Enterprise domain "${raw.trim()}". Use github.com or a *.ghe.com data-residency tenant.`);
	return normalizeGithubCopilotDomain(domain);
}
async function loginGithubCopilotOAuth(callbacks) {
	const input = await callbacks.onPrompt({
		message: "GitHub Enterprise URL/domain (blank for github.com)",
		placeholder: "company.ghe.com",
		allowEmpty: true
	});
	if (callbacks.signal?.aborted) throw new Error("GitHub Copilot login cancelled");
	const enterpriseUrl = input.trim() ? requireSupportedEnterpriseDomain(input) : void 0;
	const domain = enterpriseUrl ?? "github.com";
	callbacks.onProgress?.("Waiting for GitHub authorization...");
	const result = await runGitHubCopilotDeviceFlow({
		showCode: async ({ verificationUrl, userCode }) => {
			callbacks.onAuth({
				url: verificationUrl,
				instructions: `Enter code: ${userCode}`
			});
		},
		...callbacks.signal ? { signal: callbacks.signal } : {}
	}, domain);
	if (result.status === "access_denied") throw new Error("GitHub Copilot login cancelled");
	if (result.status === "expired") throw new Error("GitHub Copilot device code expired; retry login");
	return {
		refresh: result.accessToken,
		access: result.accessToken,
		expires: MAX_DATE_TIMESTAMP_MS,
		...enterpriseUrl ? { enterpriseUrl } : {}
	};
}
function refreshGithubCopilotOAuth(credential) {
	if (credential.enterpriseUrl && !isSupportedGithubCopilotDomain(credential.enterpriseUrl)) throw new Error(`Refusing to refresh GitHub Copilot OAuth for unsupported enterprise domain "${credential.enterpriseUrl}". Re-authenticate with github.com or a *.ghe.com tenant.`);
	return {
		...credential,
		access: credential.refresh,
		expires: MAX_DATE_TIMESTAMP_MS
	};
}
function formatGithubCopilotApiKey(credential) {
	if (credential.type !== "oauth" || typeof credential.refresh !== "string") return "";
	const token = credential.refresh.trim();
	if (!credential.enterpriseUrl) return token;
	const githubDomain = requireSupportedEnterpriseDomain(credential.enterpriseUrl);
	return `${LEGACY_OAUTH_KEY_PREFIX}${JSON.stringify({
		token,
		githubDomain
	})}`;
}
function parseGithubCopilotApiKey(value) {
	if (!value.startsWith(LEGACY_OAUTH_KEY_PREFIX)) return { githubToken: value };
	let parsed;
	try {
		parsed = JSON.parse(value.slice(33));
	} catch {
		throw new Error("Invalid GitHub Copilot legacy OAuth credential metadata");
	}
	if (!parsed || typeof parsed !== "object") throw new Error("Invalid GitHub Copilot legacy OAuth credential metadata");
	const { token, githubDomain } = parsed;
	if (typeof token !== "string" || !token.trim() || typeof githubDomain !== "string" || !isSupportedGithubCopilotDomain(githubDomain)) throw new Error("Invalid GitHub Copilot legacy OAuth credential metadata");
	return {
		githubToken: token,
		githubDomain: normalizeGithubCopilotDomain(githubDomain)
	};
}
function buildGithubCopilotAuthDoctorHint(context) {
	if (!(context.profileId ? [context.store.profiles[context.profileId]] : Object.values(context.store.profiles)).some((profile) => profile?.type === "oauth" && profile.provider.trim().toLowerCase() === "github-copilot" && !isSupportedGithubCopilotDomain(profile.enterpriseUrl))) return;
	return "This GitHub Copilot OAuth profile has an unsupported enterprise domain and can no longer refresh. Remove the legacy profile before re-authenticating with a supported host (github.com or a *.ghe.com tenant): openclaw models auth login --provider github-copilot --force.";
}
//#endregion
export { refreshGithubCopilotOAuth as a, parseGithubCopilotApiKey as i, formatGithubCopilotApiKey as n, loginGithubCopilotOAuth as r, buildGithubCopilotAuthDoctorHint as t };
