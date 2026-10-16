import { createWebSearchProviderContractFields } from "openclaw/plugin-sdk/provider-web-search-config-contract";
//#region extensions/brave/web-search-shared.ts
/**
* Shared Brave Search provider metadata and credential lookup. Contract tests
* and runtime provider creation both use this lightweight descriptor.
*/
const BRAVE_CREDENTIAL_PATH = "plugins.entries.brave.config.webSearch.apiKey";
function resolveBraveMode(brave) {
	return brave?.mode === "llm-context" ? "llm-context" : "web";
}
/** Build the common Brave provider metadata without the runtime tool executor. */
function buildBraveWebSearchProviderBase() {
	return {
		id: "brave",
		label: "Brave Search",
		hint: "Structured results · country/language/time filters",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Brave Search API key",
		envVars: ["BRAVE_API_KEY"],
		placeholder: "BSA...",
		signupUrl: "https://brave.com/search/api/",
		docsUrl: "https://docs.openclaw.ai/tools/brave-search",
		autoDetectOrder: 10,
		credentialPath: BRAVE_CREDENTIAL_PATH,
		...createWebSearchProviderContractFields({
			credentialPath: BRAVE_CREDENTIAL_PATH,
			searchCredential: { type: "top-level" },
			configuredCredential: { pluginId: "brave" }
		})
	};
}
//#endregion
export { buildBraveWebSearchProviderBase, resolveBraveMode };
