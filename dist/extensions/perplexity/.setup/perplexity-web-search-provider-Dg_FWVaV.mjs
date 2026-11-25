import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { WEB_SEARCH_QUERY_COUNT_PROPERTIES, createWebSearchProviderContractFields, mergeScopedSearchConfig, resolveProviderWebSearchPluginConfig } from "openclaw/plugin-sdk/provider-web-search-config-contract";
import { asNonArrayRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/perplexity/src/perplexity-web-search-provider.shared.ts
const DEFAULT_PERPLEXITY_BASE_URL = "https://openrouter.ai/api/v1";
const PERPLEXITY_DIRECT_BASE_URL = "https://api.perplexity.ai";
const DEFAULT_PERPLEXITY_MODEL = "perplexity/sonar-pro";
function resolvePerplexityWebSearchRuntimeMetadata(ctx) {
	const credential = ctx.resolvedCredential;
	const source = credential?.source === "env" ? credential.fallbackEnvVar === "PERPLEXITY_API_KEY" ? "perplexity_env" : "openrouter_env" : (credential?.source === "config" || credential?.source === "secretRef") && credential.value ? "config" : "none";
	return { perplexityTransport: resolvePerplexityRuntime(resolvePerplexityConfig(mergeScopedSearchConfig(ctx.searchConfig, "perplexity", resolveProviderWebSearchPluginConfig(ctx.config, "perplexity"))), {
		apiKey: credential?.value,
		source
	}).transport };
}
function isDirectPerplexityBaseUrl(baseUrl) {
	return normalizeLowercaseStringOrEmpty(URL.parse(baseUrl.trim())?.hostname) === "api.perplexity.ai";
}
function resolvePerplexityConfig(searchConfig) {
	return asNonArrayRecord(searchConfig?.perplexity);
}
function hasPerplexityLegacyOverride(perplexity) {
	return Boolean(normalizeOptionalString(perplexity?.baseUrl) || normalizeOptionalString(perplexity?.model));
}
function resolvePerplexityRuntime(perplexity, auth) {
	const baseUrl = normalizeOptionalString(perplexity?.baseUrl) || (auth.source === "perplexity_env" || auth.source === "config" && !normalizeLowercaseStringOrEmpty(auth.apiKey).startsWith("sk-or-") ? PERPLEXITY_DIRECT_BASE_URL : DEFAULT_PERPLEXITY_BASE_URL);
	return {
		apiKey: auth.apiKey,
		baseUrl,
		model: normalizeOptionalString(perplexity?.model) || DEFAULT_PERPLEXITY_MODEL,
		transport: hasPerplexityLegacyOverride(perplexity) || !isDirectPerplexityBaseUrl(baseUrl) ? "chat_completions" : "search_api"
	};
}
// extensions/perplexity/src/perplexity-web-search-provider.ts
const PERPLEXITY_CREDENTIAL_PATH = "plugins.entries.perplexity.config.webSearch.apiKey";
const loadPerplexityWebSearchRuntime = createLazyRuntimeModule(() => import("./perplexity-web-search-provider.runtime-Cdl_3QK8.mjs"));
const PerplexityChatSchema = {
	type: "object",
	properties: {
		...WEB_SEARCH_QUERY_COUNT_PROPERTIES,
		freshness: {
			type: "string",
			description: "Filter by time: 'day' (24h), 'week', 'month', or 'year'."
		}
	},
	required: ["query"]
};
const PerplexitySearchSchema = {
	...PerplexityChatSchema,
	properties: {
		...PerplexityChatSchema.properties,
		country: {
			type: "string",
			description: "Native Perplexity Search API only. 2-letter country code."
		},
		language: {
			type: "string",
			description: "Native Perplexity Search API only. ISO 639-1 language code."
		},
		date_after: {
			type: "string",
			description: "Native Perplexity Search API only. Only results published after this date (YYYY-MM-DD)."
		},
		date_before: {
			type: "string",
			description: "Native Perplexity Search API only. Only results published before this date (YYYY-MM-DD)."
		},
		domain_filter: {
			type: "array",
			items: { type: "string" },
			description: "Native Perplexity Search API only. Domain filter (max 20)."
		},
		max_tokens: {
			type: "integer",
			description: "Native Perplexity Search API only. Total content budget across all results.",
			minimum: 1,
			maximum: 1e6
		},
		max_tokens_per_page: {
			type: "integer",
			description: "Native Perplexity Search API only. Max tokens extracted per page.",
			minimum: 1
		}
	}
};
function createPerplexityWebSearchProvider() {
	return {
		id: "perplexity",
		label: "Perplexity Search",
		hint: "Requires Perplexity API key or OpenRouter API key · structured results",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Perplexity API key",
		envVars: ["PERPLEXITY_API_KEY", "OPENROUTER_API_KEY"],
		placeholder: "pplx-...",
		signupUrl: "https://www.perplexity.ai/settings/api",
		docsUrl: "https://docs.openclaw.ai/perplexity",
		autoDetectOrder: 50,
		credentialPath: PERPLEXITY_CREDENTIAL_PATH,
		...createWebSearchProviderContractFields({
			credentialPath: PERPLEXITY_CREDENTIAL_PATH,
			searchCredential: {
				type: "scoped",
				scopeId: "perplexity"
			},
			configuredCredential: { pluginId: "perplexity" }
		}),
		resolveRuntimeMetadata: resolvePerplexityWebSearchRuntimeMetadata,
		createTool: (ctx) => {
			const searchConfig = mergeScopedSearchConfig(ctx.searchConfig, "perplexity", resolveProviderWebSearchPluginConfig(ctx.config, "perplexity"));
			const schemaTransport = ctx.runtimeMetadata?.perplexityTransport ?? (hasPerplexityLegacyOverride(resolvePerplexityConfig(searchConfig)) ? "chat_completions" : void 0);
			return {
				description: schemaTransport === "chat_completions" ? "Search the web using Perplexity Sonar via Perplexity/OpenRouter chat completions. Returns AI-synthesized answers with citations from web-grounded search." : "Search the web using Perplexity. Runtime routing decides between native Search API and Sonar chat-completions compatibility. Structured filters are available on the native Search API path.",
				parameters: schemaTransport === "chat_completions" ? PerplexityChatSchema : PerplexitySearchSchema,
				execute: async (args, context) => {
					context?.signal?.throwIfAborted();
					const { executePerplexitySearch } = await loadPerplexityWebSearchRuntime();
					return await executePerplexitySearch(args, searchConfig, context?.signal);
				}
			};
		}
	};
}
export { resolvePerplexityRuntime as i, isDirectPerplexityBaseUrl as n, resolvePerplexityConfig as r, createPerplexityWebSearchProvider as t };
