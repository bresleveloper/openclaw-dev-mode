import { t as projectCopilotRequestFacts } from "./github-copilot-request-facts-DEE6gcB9.mjs";
//#region packages/ai/src/providers/cache-retention.ts
/**
* Resolve cache retention preference.
* Defaults to "short" and uses OPENCLAW_CACHE_RETENTION for backward compatibility.
*/
function resolveCacheRetention(cacheRetention) {
	if (cacheRetention === "short" || cacheRetention === "long" || cacheRetention === "none") return cacheRetention;
	if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") return "long";
	return "short";
}
//#endregion
//#region packages/ai/src/providers/github-copilot-headers.ts
function buildCopilotDynamicHeaders(messages) {
	const { initiator, hasImages } = projectCopilotRequestFacts(messages, "direct");
	const headers = {
		"X-Initiator": initiator,
		"Openai-Intent": "conversation-edits"
	};
	if (hasImages) headers["Copilot-Vision-Request"] = "true";
	return headers;
}
//#endregion
//#region packages/ai/src/providers/cloudflare.ts
function isCloudflareProvider(provider) {
	return provider === "cloudflare-workers-ai" || provider === "cloudflare-ai-gateway";
}
/** Substitute `{VAR}` placeholders in a Cloudflare baseUrl from process.env. */
function resolveCloudflareBaseUrl(model) {
	const url = model.baseUrl;
	if (!url.includes("{")) return url;
	return url.replace(/\{([A-Z_][A-Z0-9_]*)\}/g, (_match, name) => {
		const value = process.env[name];
		if (!value) throw new Error(`${name} is required for provider ${model.provider} but is not set.`);
		return value;
	});
}
//#endregion
export { resolveCacheRetention as i, resolveCloudflareBaseUrl as n, buildCopilotDynamicHeaders as r, isCloudflareProvider as t };
