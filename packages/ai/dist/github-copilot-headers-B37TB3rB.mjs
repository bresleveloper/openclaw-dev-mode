import { t as projectCopilotRequestFacts } from "./github-copilot-request-facts-BTEBMeOv.mjs";
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
//#region packages/ai/src/providers/github-copilot-headers.ts
function hasCopilotVisionInput(messages) {
	return projectCopilotRequestFacts(messages, "direct").hasImages;
}
function buildCopilotDynamicHeaders(params) {
	const headers = {
		"X-Initiator": projectCopilotRequestFacts(params.messages, "direct", params.hasImages).initiator,
		"Openai-Intent": "conversation-edits"
	};
	if (params.hasImages) headers["Copilot-Vision-Request"] = "true";
	return headers;
}
//#endregion
export { resolveCloudflareBaseUrl as i, hasCopilotVisionInput as n, isCloudflareProvider as r, buildCopilotDynamicHeaders as t };
