import { createWebSearchProviderContractFields } from "openclaw/plugin-sdk/provider-web-search-contract";
//#region extensions/tavily/web-search-shared.ts
const TAVILY_CREDENTIAL_PATH = "plugins.entries.tavily.config.webSearch.apiKey";
const TAVILY_GENERIC_SEARCH_DESCRIPTION = "Search the web using Tavily. Returns structured results with snippets. Use tavily_search for Tavily-specific options like search depth, topic filtering, or AI answers.";
const TAVILY_GENERIC_SEARCH_SCHEMA = {
	type: "object",
	properties: {
		query: {
			type: "string",
			description: "Search query string."
		},
		count: {
			type: "integer",
			description: "Number of results to return (1-20).",
			minimum: 1,
			maximum: 20
		}
	},
	additionalProperties: false
};
function buildTavilyWebSearchProviderBase() {
	return {
		id: "tavily",
		label: "Tavily Search",
		hint: "Structured results with domain filters and AI answer summaries",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Tavily API key",
		envVars: ["TAVILY_API_KEY"],
		placeholder: "tvly-...",
		signupUrl: "https://tavily.com/",
		docsUrl: "https://docs.openclaw.ai/tools/tavily",
		autoDetectOrder: 70,
		credentialPath: TAVILY_CREDENTIAL_PATH,
		...createWebSearchProviderContractFields({
			credentialPath: TAVILY_CREDENTIAL_PATH,
			searchCredential: {
				type: "scoped",
				scopeId: "tavily"
			},
			configuredCredential: { pluginId: "tavily" },
			selectionPluginId: "tavily"
		})
	};
}
//#endregion
export { TAVILY_GENERIC_SEARCH_DESCRIPTION, TAVILY_GENERIC_SEARCH_SCHEMA, buildTavilyWebSearchProviderBase };
