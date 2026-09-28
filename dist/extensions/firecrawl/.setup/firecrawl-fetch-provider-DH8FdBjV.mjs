import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
import { enablePluginInConfig } from "openclaw/plugin-sdk/provider-web-fetch-contract";
//#region extensions/firecrawl/src/firecrawl-fetch-provider-shared.ts
function ensureRecord(target, key) {
	const current = target[key];
	if (current && typeof current === "object" && !Array.isArray(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
const FIRECRAWL_WEB_FETCH_PROVIDER_SHARED = {
	id: "firecrawl",
	label: "Firecrawl",
	hint: "Fetch pages with keyless starter access; add a key for higher limits.",
	requiresCredential: false,
	credentialLabel: "Firecrawl API key (optional)",
	envVars: ["FIRECRAWL_API_KEY"],
	placeholder: "fc-...",
	signupUrl: "https://www.firecrawl.dev/",
	docsUrl: "https://docs.firecrawl.dev",
	autoDetectOrder: 50,
	credentialPath: "plugins.entries.firecrawl.config.webFetch.apiKey",
	inactiveSecretPaths: ["plugins.entries.firecrawl.config.webFetch.apiKey"],
	getCredentialValue: (fetchConfig) => {
		if (!fetchConfig || typeof fetchConfig !== "object") return;
		const legacy = fetchConfig.firecrawl;
		if (!legacy || typeof legacy !== "object" || Array.isArray(legacy)) return;
		if (legacy.enabled === false) return;
		return legacy.apiKey;
	},
	setCredentialValue: (fetchConfigTarget, value) => {
		const firecrawl = ensureRecord(fetchConfigTarget, "firecrawl");
		firecrawl.apiKey = value;
	},
	getConfiguredCredentialValue: (config) => (config?.plugins?.entries?.firecrawl?.config)?.webFetch?.apiKey,
	getConfiguredCredentialFallback: (config) => {
		const apiKey = (config?.plugins?.entries?.firecrawl?.config)?.webSearch?.apiKey;
		return apiKey === void 0 ? void 0 : {
			path: "plugins.entries.firecrawl.config.webSearch.apiKey",
			value: apiKey
		};
	},
	setConfiguredCredentialValue: (configTarget, value) => {
		const plugins = configTarget.plugins ??= {};
		const entries = plugins.entries ??= {};
		const firecrawlEntry = entries.firecrawl ??= {};
		const webFetch = ensureRecord(firecrawlEntry.config ??= {}, "webFetch");
		webFetch.apiKey = value;
	}
};
//#endregion
//#region extensions/firecrawl/src/firecrawl-fetch-provider.ts
const loadFirecrawlClientModule = createLazyRuntimeModule(() => import("./firecrawl-client-hBjAoE8s.mjs").then((n) => n.t));
function createFirecrawlWebFetchProvider() {
	return {
		...FIRECRAWL_WEB_FETCH_PROVIDER_SHARED,
		applySelectionConfig: (config) => enablePluginInConfig(config, "firecrawl").config,
		createTool: ({ config }) => ({
			description: "Fetch a page using Firecrawl.",
			parameters: {},
			execute: async (args, executionContext) => {
				executionContext?.signal?.throwIfAborted();
				const url = typeof args.url === "string" ? args.url : "";
				const extractMode = args.extractMode === "text" ? "text" : "markdown";
				const maxChars = readPositiveIntegerParam(args, "maxChars");
				const proxy = args.proxy === "basic" || args.proxy === "stealth" || args.proxy === "auto" ? args.proxy : void 0;
				const storeInCache = typeof args.storeInCache === "boolean" ? args.storeInCache : void 0;
				const { runFirecrawlScrape } = await loadFirecrawlClientModule();
				return await runFirecrawlScrape({
					cfg: config,
					url,
					extractMode,
					access: "keyless",
					maxChars,
					...executionContext?.signal ? { signal: executionContext.signal } : {},
					...proxy ? { proxy } : {},
					...storeInCache !== void 0 ? { storeInCache } : {}
				});
			}
		})
	};
}
//#endregion
export { createFirecrawlWebFetchProvider as t };
