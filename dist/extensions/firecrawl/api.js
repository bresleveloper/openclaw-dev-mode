import { n as runFirecrawlScrape } from "./.setup/firecrawl-client--j4MjwgU.mjs";
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
		text: result.text,
		title: result.title,
		finalUrl: result.finalUrl,
		status: result.status,
		warning: result.warning
	};
}
//#endregion
export { fetchFirecrawlContent };
