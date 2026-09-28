import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { readPositiveIntegerParam, readStringParam } from "openclaw/plugin-sdk/param-readers";
import { createWebSearchProviderContractFields } from "openclaw/plugin-sdk/provider-web-search-contract";
//#region extensions/duckduckgo/src/ddg-search-provider.shared.ts
const DUCKDUCKGO_ONBOARDING_SCOPES = ["text-inference"];
function createDuckDuckGoWebSearchProviderBase() {
	return {
		id: "duckduckgo",
		label: "DuckDuckGo Search (experimental)",
		hint: "Free web search fallback with no API key required",
		onboardingScopes: [...DUCKDUCKGO_ONBOARDING_SCOPES],
		requiresCredential: false,
		envVars: [],
		placeholder: "(no key needed)",
		signupUrl: "https://duckduckgo.com/",
		docsUrl: "https://docs.openclaw.ai/tools/web",
		autoDetectOrder: 100,
		credentialPath: "",
		...createWebSearchProviderContractFields({
			credentialPath: "",
			searchCredential: {
				type: "scoped",
				scopeId: "duckduckgo"
			},
			selectionPluginId: "duckduckgo"
		})
	};
}
//#endregion
//#region extensions/duckduckgo/src/ddg-search-provider.ts
const loadDuckDuckGoClientModule = createLazyRuntimeModule(() => import("./ddg-client-D9UL3Bem.mjs"));
const DuckDuckGoSearchSchema = {
	type: "object",
	properties: {
		query: {
			type: "string",
			description: "Search query string."
		},
		count: {
			type: "integer",
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		},
		region: {
			type: "string",
			description: "Optional DuckDuckGo region code such as us-en, uk-en, or de-de."
		},
		safeSearch: {
			type: "string",
			description: "SafeSearch level: strict, moderate, or off."
		}
	},
	additionalProperties: false
};
function createDuckDuckGoWebSearchProvider() {
	return {
		...createDuckDuckGoWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: "Search the web using DuckDuckGo. Returns titles, URLs, and snippets with no API key required.",
			parameters: DuckDuckGoSearchSchema,
			execute: async (args, context) => {
				context?.signal?.throwIfAborted();
				const { runDuckDuckGoSearch } = await loadDuckDuckGoClientModule();
				return await runDuckDuckGoSearch({
					config: ctx.config,
					query: readStringParam(args, "query", { required: true }),
					count: readPositiveIntegerParam(args, "count", {
						max: 10,
						message: "count must be an integer from 1 to 10."
					}),
					region: readStringParam(args, "region"),
					safeSearch: readStringParam(args, "safeSearch"),
					...context?.signal ? { signal: context.signal } : {}
				});
			}
		})
	};
}
//#endregion
export { createDuckDuckGoWebSearchProvider as t };
