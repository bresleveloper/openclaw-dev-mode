//#region src/llm/providers/cache-retention.ts
/**
* Resolve cache retention preference.
* Defaults to "short" and uses OPENCLAW_CACHE_RETENTION for backward compatibility.
*/
function resolveCacheRetention(cacheRetention) {
	if (cacheRetention) return cacheRetention;
	if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") return "long";
	return "short";
}
//#endregion
//#region src/llm/providers/cloudflare.ts
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
//#region src/llm/providers/github-copilot-headers.ts
function inferCopilotInitiator(messages) {
	const last = messages[messages.length - 1];
	return last && last.role !== "user" ? "agent" : "user";
}
function hasCopilotVisionInput(messages) {
	return messages.some((msg) => {
		if (msg.role === "user" && Array.isArray(msg.content)) return msg.content.some((c) => c.type === "image");
		if (msg.role === "toolResult" && Array.isArray(msg.content)) return msg.content.some((c) => c.type === "image");
		return false;
	});
}
function buildCopilotDynamicHeaders(params) {
	const headers = {
		"X-Initiator": inferCopilotInitiator(params.messages),
		"Openai-Intent": "conversation-edits"
	};
	if (params.hasImages) headers["Copilot-Vision-Request"] = "true";
	return headers;
}
//#endregion
export { resolveCacheRetention as a, resolveCloudflareBaseUrl as i, hasCopilotVisionInput as n, isCloudflareProvider as r, buildCopilotDynamicHeaders as t };
