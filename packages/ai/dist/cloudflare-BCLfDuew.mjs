// packages/ai/src/providers/cloudflare.ts
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
export { resolveCloudflareBaseUrl as n, isCloudflareProvider as t };
