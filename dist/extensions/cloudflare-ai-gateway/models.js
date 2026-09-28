//#region extensions/cloudflare-ai-gateway/models.ts
/** Provider id used in model refs and auth profiles. */
const CLOUDFLARE_AI_GATEWAY_PROVIDER_ID = "cloudflare-ai-gateway";
/** Default Cloudflare AI Gateway model id exposed by the bundled provider. */
const CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_ID = "claude-sonnet-4-6";
/** Fully-qualified default model ref used by onboarding. */
const CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF = `${CLOUDFLARE_AI_GATEWAY_PROVIDER_ID}/${CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_ID}`;
const CLOUDFLARE_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW = 2e5;
const CLOUDFLARE_AI_GATEWAY_DEFAULT_MAX_TOKENS = 64e3;
const CLOUDFLARE_AI_GATEWAY_DEFAULT_COST = {
	input: 3,
	output: 15,
	cacheRead: .3,
	cacheWrite: 3.75
};
/**
* Builds a provider model definition, allowing tests/catalog code to override
* the model id while preserving Cloudflare defaults.
*/
function buildCloudflareAiGatewayModelDefinition(params) {
	return {
		id: params?.id?.trim() || "claude-sonnet-4-6",
		name: params?.name ?? "Claude Sonnet 4.6",
		reasoning: params?.reasoning ?? true,
		input: params?.input ?? ["text", "image"],
		cost: CLOUDFLARE_AI_GATEWAY_DEFAULT_COST,
		contextWindow: CLOUDFLARE_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW,
		maxTokens: CLOUDFLARE_AI_GATEWAY_DEFAULT_MAX_TOKENS
	};
}
/**
* Constructs the Anthropic Messages base URL for a Cloudflare account/gateway
* pair, returning an empty string for incomplete metadata.
*/
function resolveCloudflareAiGatewayBaseUrl(params) {
	const accountId = params.accountId.trim();
	const gatewayId = params.gatewayId.trim();
	if (!accountId || !gatewayId) return "";
	return `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/anthropic`;
}
//#endregion
export { CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_ID, CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF, CLOUDFLARE_AI_GATEWAY_PROVIDER_ID, buildCloudflareAiGatewayModelDefinition, resolveCloudflareAiGatewayBaseUrl };
