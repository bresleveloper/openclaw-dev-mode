import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { i as resolveGithubCopilotDomain } from "./domain-Bbe8oFEv.mjs";
import { t as CopilotRuntimeAuthError } from "./runtime-auth-error-CQZde1c0.mjs";
//#region extensions/github-copilot/runtime-auth.ts
const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
const COPILOT_RUNTIME_AUTH_TIMEOUT_MS = 3e4;
function copilotUserUrl(domain) {
	return `https://api.${domain}/copilot_internal/user`;
}
function copilotApiBaseFallback(domain) {
	return domain === "github.com" ? DEFAULT_COPILOT_API_BASE_URL : `https://copilot-api.${domain}`;
}
function isTrustedCopilotApiHost(host, domain) {
	if (host === "copilot-proxy.githubusercontent.com" || host.endsWith(".githubcopilot.com")) return true;
	return domain !== "github.com" && (host === domain || host.endsWith(`.${domain}`));
}
function parseCopilotApiBaseUrl(value, domain) {
	if (!value || typeof value !== "object") throw new Error("Unexpected response from GitHub Copilot user endpoint");
	const endpoints = value.endpoints;
	const api = endpoints && typeof endpoints === "object" ? endpoints.api : void 0;
	if (api === void 0 || api === null || api === "") return copilotApiBaseFallback(domain);
	if (typeof api !== "string" || !api.trim()) throw new Error("GitHub Copilot user response has an invalid endpoints.api URL");
	let url;
	try {
		url = new URL(api);
	} catch {
		throw new Error("GitHub Copilot user response has an invalid endpoints.api URL");
	}
	const host = url.hostname.toLowerCase();
	if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || !isTrustedCopilotApiHost(host, domain)) throw new Error("GitHub Copilot user response has an untrusted endpoints.api URL");
	return url.href.replace(/\/+$/, "");
}
async function resolveCopilotRuntimeAuth(params) {
	const env = params.env ?? process.env;
	const domain = resolveGithubCopilotDomain({
		env,
		explicit: params.githubDomain,
		config: params.config
	});
	const userUrl = copilotUserUrl(domain);
	const fetchImpl = params.fetchImpl ?? fetch;
	const signal = AbortSignal.timeout(COPILOT_RUNTIME_AUTH_TIMEOUT_MS);
	try {
		const response = await fetchImpl(userUrl, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${params.githubToken}`
			},
			signal
		});
		if (!response.ok) {
			if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
			throw new CopilotRuntimeAuthError({
				reason: "http_error",
				status: response.status
			});
		}
		const baseUrl = parseCopilotApiBaseUrl(await readProviderJsonResponse(response, "github-copilot.user"), domain);
		return {
			apiKey: params.githubToken,
			source: `validated:${userUrl}`,
			baseUrl
		};
	} catch (error) {
		if (signal.aborted) throw new CopilotRuntimeAuthError({
			reason: "timeout",
			timeoutMs: COPILOT_RUNTIME_AUTH_TIMEOUT_MS,
			cause: error
		});
		throw error;
	}
}
//#endregion
export { resolveCopilotRuntimeAuth as n, DEFAULT_COPILOT_API_BASE_URL as t };
