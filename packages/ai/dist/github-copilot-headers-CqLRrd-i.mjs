import { t as projectCopilotRequestFacts } from "./github-copilot-request-facts-BxuLEdNF.mjs";
// packages/ai/src/providers/cache-retention.ts
/**
* Resolve cache retention preference.
* Defaults to "short" and uses OPENCLAW_CACHE_RETENTION for backward compatibility.
*/
function resolveCacheRetention(cacheRetention) {
	if (cacheRetention === "short" || cacheRetention === "long" || cacheRetention === "none") return cacheRetention;
	if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") return "long";
	return "short";
}
// packages/ai/src/providers/github-copilot-headers.ts
function buildCopilotDynamicHeaders(messages) {
	const { initiator, hasImages } = projectCopilotRequestFacts(messages, "direct");
	const headers = {
		"X-Initiator": initiator,
		"Openai-Intent": "conversation-edits"
	};
	if (hasImages) headers["Copilot-Vision-Request"] = "true";
	return headers;
}
export { resolveCacheRetention as n, buildCopilotDynamicHeaders as t };
