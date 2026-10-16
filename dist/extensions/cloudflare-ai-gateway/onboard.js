import { CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF, buildCloudflareAiGatewayModelDefinition, resolveCloudflareAiGatewayBaseUrl } from "./models.js";
import { applyAgentDefaultModelPrimary, applyProviderConfigWithDefaultModel, applyProviderConnectionConfig, createAliasOnlyPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/cloudflare-ai-gateway/onboard.ts
const { applyProviderConfig: applyCloudflareAiGatewayAlias } = createAliasOnlyPresetAppliers({
	modelRef: CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF,
	alias: "Cloudflare AI Gateway"
});
function buildCloudflareAiGatewayConfigPatch(params) {
	return {
		models: { providers: { "cloudflare-ai-gateway": {
			baseUrl: resolveCloudflareAiGatewayBaseUrl(params),
			api: "anthropic-messages",
			models: [buildCloudflareAiGatewayModelDefinition()]
		} } },
		agents: { defaults: { models: { [CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF]: { alias: "Cloudflare AI Gateway" } } } }
	};
}
function applyCloudflareAiGatewayProviderConfig(cfg, params) {
	const withAlias = applyCloudflareAiGatewayAlias(cfg);
	const existingProvider = cfg.models?.providers?.["cloudflare-ai-gateway"];
	const baseUrl = params?.accountId && params?.gatewayId ? resolveCloudflareAiGatewayBaseUrl({
		accountId: params.accountId,
		gatewayId: params.gatewayId
	}) : typeof existingProvider?.baseUrl === "string" ? existingProvider.baseUrl : void 0;
	if (!baseUrl) return withAlias;
	return applyProviderConfigWithDefaultModel(cfg, {
		agentModels: withAlias.agents?.defaults?.models ?? {},
		providerId: "cloudflare-ai-gateway",
		api: "anthropic-messages",
		baseUrl,
		defaultModel: buildCloudflareAiGatewayModelDefinition()
	});
}
function applyCloudflareAiGatewayConfig(cfg, params) {
	return applyAgentDefaultModelPrimary(applyCloudflareAiGatewayProviderConfig(cfg, params), CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF);
}
/** Registered setup keeps authored rows and seeds the default only in replace mode. */
function applyCloudflareAiGatewayProviderConnectionConfig(cfg, params) {
	return applyProviderConnectionConfig(cfg, {
		providerId: "cloudflare-ai-gateway",
		api: "anthropic-messages",
		baseUrl: resolveCloudflareAiGatewayBaseUrl(params),
		catalogModels: () => [buildCloudflareAiGatewayModelDefinition()],
		aliases: [{
			modelRef: CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF,
			alias: "Cloudflare AI Gateway"
		}]
	});
}
function applyCloudflareAiGatewayConnectionConfig(cfg, params) {
	return applyAgentDefaultModelPrimary(applyCloudflareAiGatewayProviderConnectionConfig(cfg, params), CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF);
}
//#endregion
export { applyCloudflareAiGatewayConfig, applyCloudflareAiGatewayConnectionConfig, applyCloudflareAiGatewayProviderConfig, applyCloudflareAiGatewayProviderConnectionConfig, buildCloudflareAiGatewayConfigPatch };
