import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createWebSearchProviderContractFields } from "openclaw/plugin-sdk/provider-web-search-contract";
//#region extensions/parallel/src/parallel-free-web-search-provider.shared.ts
const PARALLEL_FREE_ONBOARDING_SCOPES = ["text-inference"];
function createParallelFreeWebSearchProviderBase() {
	return {
		id: "parallel-free",
		label: "Parallel Search (Free)",
		hint: "Free web search via Parallel's hosted Search MCP — no API key required",
		configPath: null,
		onboardingScopes: [...PARALLEL_FREE_ONBOARDING_SCOPES],
		requiresCredential: false,
		envVars: [],
		placeholder: "(no key needed)",
		signupUrl: "https://parallel.ai",
		docsUrl: "https://docs.openclaw.ai/tools/parallel-search",
		credentialPath: "",
		...createWebSearchProviderContractFields({
			credentialPath: "",
			searchCredential: {
				type: "scoped",
				scopeId: "parallel-free"
			},
			selectionPluginId: "parallel"
		})
	};
}
//#endregion
//#region extensions/parallel/src/parallel-web-search-provider.shared.ts
const PARALLEL_CREDENTIAL_PATH = "plugins.entries.parallel.config.webSearch.apiKey";
const PARALLEL_ONBOARDING_SCOPES = ["text-inference"];
function createParallelWebSearchProviderBase() {
	return {
		id: "parallel",
		label: "Parallel Search",
		hint: "LLM-optimized dense excerpts from web sources",
		onboardingScopes: [...PARALLEL_ONBOARDING_SCOPES],
		credentialLabel: "Parallel API key",
		envVars: ["PARALLEL_API_KEY"],
		placeholder: "par-...",
		signupUrl: "https://platform.parallel.ai",
		docsUrl: "https://docs.openclaw.ai/tools/parallel-search",
		autoDetectOrder: 75,
		credentialPath: PARALLEL_CREDENTIAL_PATH,
		...createWebSearchProviderContractFields({
			credentialPath: PARALLEL_CREDENTIAL_PATH,
			searchCredential: {
				type: "scoped",
				scopeId: "parallel"
			},
			configuredCredential: { pluginId: "parallel" },
			selectionPluginId: "parallel"
		})
	};
}
//#endregion
//#region extensions/parallel/src/parallel-web-search-provider.ts
const PARALLEL_MAX_SEARCH_COUNT = 40;
const PARALLEL_MAX_SEARCH_QUERIES = 5;
const PARALLEL_MAX_SEARCH_QUERY_CHARS = 200;
const PARALLEL_MAX_OBJECTIVE_CHARS = 5e3;
const PARALLEL_MAX_SESSION_ID_CHARS = 1e3;
const PARALLEL_MAX_CLIENT_MODEL_CHARS = 100;
const loadParallelWebSearchRuntime = createLazyRuntimeModule(() => import("./parallel-web-search-provider.runtime-D3trDaRb.mjs"));
const ParallelSearchSchema = {
	type: "object",
	properties: {
		objective: {
			type: "string",
			description: "Natural-language description of the underlying question or goal driving the search. Should be self-contained with enough context to understand the intent. Used together with search_queries to focus results on the most relevant content.",
			maxLength: PARALLEL_MAX_OBJECTIVE_CHARS
		},
		search_queries: {
			type: "array",
			description: "Concise keyword search queries, 3-6 words each. Provide 2-3 diverse queries for best results (max 5). Vary entity names, synonyms, and angles. Each query is a keyword phrase, not a sentence; do not use site: operators.",
			items: {
				type: "string",
				maxLength: PARALLEL_MAX_SEARCH_QUERY_CHARS
			},
			minItems: 1,
			maxItems: PARALLEL_MAX_SEARCH_QUERIES
		},
		count: {
			type: "integer",
			description: "Number of results to return (1-40).",
			minimum: 1,
			maximum: PARALLEL_MAX_SEARCH_COUNT
		},
		session_id: {
			type: "string",
			description: "Optional session id returned by an earlier Parallel search. Pass it on follow-up searches that are part of the same task to keep Parallel's server-side context grouped (look for `sessionId` in the prior tool result).",
			maxLength: PARALLEL_MAX_SESSION_ID_CHARS
		},
		client_model: {
			type: "string",
			description: "The identifier of the LLM model making this tool call (e.g. 'claude-opus-4-7', 'gpt-6-astra', 'gemini-3.1-pro'). Pass the exact active model slug verbatim; never shorten or substitute a family alias like 'gpt-5'. Lets Parallel tailor default settings for your model's capabilities.",
			maxLength: PARALLEL_MAX_CLIENT_MODEL_CHARS
		}
	},
	required: ["objective", "search_queries"],
	additionalProperties: false
};
function createParallelWebSearchProvider() {
	return {
		...createParallelWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: "Search the web using Parallel. Returns ranked, LLM-optimized dense excerpts from web sources. Pass an `objective` describing the underlying question along with 2-3 short keyword `search_queries` (Parallel's recommended pairing). For multi-step research, thread the prior result's `sessionId` back in as `session_id` to keep Parallel's context grouped.",
			parameters: ParallelSearchSchema,
			execute: async (args, context) => {
				context?.signal?.throwIfAborted();
				const { executeParallelWebSearchProviderTool } = await loadParallelWebSearchRuntime();
				return await executeParallelWebSearchProviderTool(ctx, args, context?.signal);
			}
		})
	};
}
//#endregion
//#region extensions/parallel/src/parallel-free-web-search-provider.ts
const ParallelFreeSearchSchema = {
	...ParallelSearchSchema,
	properties: {
		...ParallelSearchSchema.properties,
		session_id: {
			...ParallelSearchSchema.properties.session_id,
			maxLength: 100
		}
	}
};
const loadParallelFreeWebSearchRuntime = createLazyRuntimeModule(() => import("./parallel-free-web-search-provider.runtime-OAvvtssG.mjs"));
function createParallelFreeWebSearchProvider() {
	return {
		...createParallelFreeWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: "Search the web using Parallel's free Search MCP (no API key). Returns ranked, LLM-optimized dense excerpts from web sources. Pass an `objective` describing the underlying question along with 2-3 short keyword `search_queries` (Parallel's recommended pairing). For multi-step research, thread the prior result's `sessionId` back in as `session_id` to keep Parallel's context grouped.",
			parameters: ParallelFreeSearchSchema,
			execute: async (args, context) => {
				const { executeParallelFreeWebSearchProviderTool } = await loadParallelFreeWebSearchRuntime();
				return await executeParallelFreeWebSearchProviderTool(ctx, args, context?.signal);
			}
		})
	};
}
//#endregion
export { createParallelWebSearchProvider as n, createParallelFreeWebSearchProvider as t };
