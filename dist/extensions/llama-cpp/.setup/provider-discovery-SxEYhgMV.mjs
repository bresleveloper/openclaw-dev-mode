import { _ as LLAMA_CPP_PROVIDER_ID, b as buildLlamaCppProviderConfig, g as LLAMA_CPP_LOCAL_AUTH_MARKER, v as LLAMA_CPP_PROVIDER_LABEL } from "./defaults-DX4XN2j1.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { CUSTOM_LOCAL_AUTH_MARKER, hasConfiguredSecretInput, normalizeOptionalSecretInput } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/llama-cpp/src/external-server/auth-policy.ts
function hasLlamaServerAuthorizationHeader(headers) {
	const record = asOptionalRecord(headers);
	if (!record) return false;
	return Object.entries(record).some(([name, value]) => name.trim().toLowerCase() === "authorization" && hasConfiguredSecretInput(value));
}
function shouldUseLlamaServerSyntheticAuth(providerConfig) {
	const apiKey = normalizeOptionalSecretInput(providerConfig?.apiKey)?.trim();
	return !(hasConfiguredSecretInput(providerConfig?.apiKey) && apiKey !== "llama-cpp-local" && apiKey !== CUSTOM_LOCAL_AUTH_MARKER);
}
//#endregion
//#region extensions/llama-cpp/src/external-server/defaults.ts
const LLAMA_SERVER_DEFAULT_ORIGIN = "http://127.0.0.1:8080";
const LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR = "LLAMA_SERVER_API_KEY";
const LLAMA_SERVER_DISCOVERY_TIMEOUT_MS = 5e3;
//#endregion
//#region extensions/llama-cpp/src/external-server/endpoint.ts
/** Resolves the server origin and its OpenAI-compatible `/v1` inference base. */
function resolveLlamaServerEndpoint(configuredBaseUrl) {
	const configured = configuredBaseUrl?.trim() || "http://127.0.0.1:8080";
	const parsed = new URL(/^[a-z][a-z\d+.-]*:\/\//iu.test(configured) ? configured : `http://${configured}`);
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new TypeError(`Unsupported llama-server protocol: ${parsed.protocol}`);
	if (parsed.username || parsed.password) throw new TypeError("llama-server base URL must not contain credentials");
	parsed.pathname = parsed.pathname.replace(/\/+$/u, "").replace(/\/v1$/iu, "") || "/";
	parsed.search = "";
	parsed.hash = "";
	const origin = parsed.toString().replace(/\/$/u, "");
	return {
		origin,
		inferenceBaseUrl: `${origin}/v1`
	};
}
/** Canonicalizes persisted provider config for the shared OpenAI transport. */
function normalizeLlamaServerProviderConfig(provider) {
	const endpoint = resolveLlamaServerEndpoint(provider.baseUrl);
	const request = provider.request ?? {};
	const normalizedRequest = typeof request.allowPrivateNetwork === "boolean" ? request : {
		...request,
		allowPrivateNetwork: true
	};
	return {
		...provider,
		baseUrl: endpoint.inferenceBaseUrl,
		api: "openai-completions",
		request: normalizedRequest
	};
}
//#endregion
//#region extensions/llama-cpp/provider-discovery.ts
var provider_discovery_default = {
	id: LLAMA_CPP_PROVIDER_ID,
	label: LLAMA_CPP_PROVIDER_LABEL,
	docsPath: "/plugins/llama-cpp",
	envVars: [LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR],
	auth: [],
	catalog: {
		order: "late",
		run: async (ctx) => {
			const configured = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
			if (configured?.localService) return { provider: buildLlamaCppProviderConfig({
				existing: configured,
				modelInventory: configured.models
			}) };
			const { discoverLlamaServerProvider } = await import("./provider-DVEnxK8Q.mjs");
			return await discoverLlamaServerProvider(ctx);
		}
	},
	staticCatalog: {
		order: "late",
		run: async () => ({ provider: buildLlamaCppProviderConfig() })
	},
	resolveSyntheticAuth: ({ providerConfig }) => providerConfig?.localService || shouldUseLlamaServerSyntheticAuth(providerConfig) ? {
		apiKey: LLAMA_CPP_LOCAL_AUTH_MARKER,
		source: providerConfig?.localService ? "managed local llama.cpp server" : hasLlamaServerAuthorizationHeader(providerConfig?.headers) ? "models.providers.llama-cpp.headers.Authorization" : "models.providers.llama-cpp (synthetic local key)",
		mode: "api-key"
	} : void 0,
	shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === "llama-cpp-local" || resolvedApiKey?.trim() === CUSTOM_LOCAL_AUTH_MARKER,
	normalizeConfig: ({ providerConfig }) => providerConfig.localService ? providerConfig : normalizeLlamaServerProviderConfig(providerConfig)
};
//#endregion
export { LLAMA_SERVER_DEFAULT_ORIGIN as a, LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR as i, normalizeLlamaServerProviderConfig as n, LLAMA_SERVER_DISCOVERY_TIMEOUT_MS as o, resolveLlamaServerEndpoint as r, hasLlamaServerAuthorizationHeader as s, provider_discovery_default as t };
