import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-By9R9pyt.mjs";
import { h as resolveProviderHttpRequestConfig } from "./shared-DcnGQdHV.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CpGmMxRN.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { t as OPENROUTER_BASE_URL } from "./provider-defaults-ilQX6q3J.mjs";
import "./provider-catalog-CtJ2DVzZ.mjs";
//#region extensions/openrouter/generation-request-context.ts
async function resolveOpenRouterGenerationRequestContext(params) {
	const auth = await resolveApiKeyForProvider({
		provider: "openrouter",
		cfg: params.cfg,
		agentDir: params.agentDir,
		store: params.authStore
	});
	if (!auth.apiKey) throw new Error("OpenRouter API key missing");
	return resolveProviderHttpRequestConfig({
		baseUrl: params.cfg.models?.providers?.openrouter?.baseUrl,
		defaultBaseUrl: OPENROUTER_BASE_URL,
		allowPrivateNetwork: false,
		defaultHeaders: {
			Authorization: `Bearer ${auth.apiKey}`,
			...params.jsonContentType ? { "Content-Type": "application/json" } : {}
		},
		request: sanitizeConfiguredModelProviderRequest(params.cfg.models?.providers?.openrouter?.request),
		provider: "openrouter",
		capability: params.capability,
		transport: "http"
	});
}
//#endregion
export { resolveOpenRouterGenerationRequestContext as t };
