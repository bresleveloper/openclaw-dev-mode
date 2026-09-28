import { n as runFirecrawlScrape } from "./.setup/firecrawl-client-hBjAoE8s.mjs";
import { readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/firecrawl/api.ts
async function fetchFirecrawlContent(params) {
	const cfg = { plugins: { entries: { firecrawl: {
		enabled: true,
		config: { webFetch: {
			apiKey: params.apiKey,
			baseUrl: params.baseUrl,
			onlyMainContent: params.onlyMainContent,
			maxAgeMs: params.maxAgeMs,
			timeoutSeconds: params.timeoutSeconds
		} }
	} } } };
	const result = await runFirecrawlScrape({
		cfg,
		url: params.url,
		extractMode: params.extractMode,
		maxChars: params.maxChars,
		proxy: params.proxy,
		storeInCache: params.storeInCache,
		onlyMainContent: params.onlyMainContent,
		maxAgeMs: params.maxAgeMs,
		timeoutSeconds: params.timeoutSeconds
	});
	return {
		text: typeof result.text === "string" ? result.text : "",
		title: readStringValue(result.title),
		finalUrl: readStringValue(result.finalUrl),
		status: typeof result.status === "number" ? result.status : void 0,
		warning: readStringValue(result.warning)
	};
}
//#endregion
export { fetchFirecrawlContent };
